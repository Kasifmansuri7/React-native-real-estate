import { Buffer } from "buffer";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import {
  Account,
  Avatars,
  Client,
  Databases,
  OAuthProvider,
  Query,
} from "react-native-appwrite";

export const config = {
  endPoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  agentTableId: process.env.EXPO_PUBLIC_APPWRITE_AGENT_TABLE_ID,
  galleryTableId: process.env.EXPO_PUBLIC_APPWRITE_GALLERY_TABLE_ID,
  reviewTableId: process.env.EXPO_PUBLIC_APPWRITE_REVIEW_TABLE_ID,
  propertyTableId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTY_TABLE_ID,
};

// Create client instance
export const client = new Client();

client
  .setEndpoint(config.endPoint as string) // Your Appwrite Endpoint
  .setProject(config.projectId as string); // Your project ID

// Export services
export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

// Login method
export async function login() {
  try {
    // Deeplinking url
    const redirectUri = Linking.createURL("/");

    // Go to OAuth provider login page
    const response = account.createOAuth2Token({
      provider: OAuthProvider.Google,
      success: redirectUri, // redirect here on success
      failure: redirectUri, // redirect here on failure
    });

    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await WebBrowser.openAuthSessionAsync(
      response.toString(),
      redirectUri,
    );

    if (browserResult.type !== "success") {
      throw new Error("Create OAuth2 token failed");
    }

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create session");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Logout method
export async function logout() {
  try {
    const response = await account.deleteSession("current");
    if (!response) throw new Error("Logout failed!");
    return true;
  } catch (error) {
    console.log("Logout error: ", error);
    return false;
  }
}

// Get currently logged in user
export async function getSessionUser() {
  try {
    const response = await account.get();

    if (response.$id) {
      // Get initials avatar
      const userAvatar = await avatar.getInitials({
        name: response.name || response.email,
      });

      // Convert ArrayBuffer to Base64
      const base64 = Buffer.from(userAvatar).toString("base64");
      const avatarUri = `data:image/png;base64,${base64}`;

      return { ...response, avatar: avatarUri };
    }

    return response;
  } catch (error: any) {
    if (error?.code === 401) {
      // No session found
      return null;
    }

    console.log("Get user error: ", error);
    return null;
  }
}

export async function getLatestProperties() {
  try {
    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertyTableId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)],
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All")
      buildQuery.push(Query.equal("type", filter));

    if (query)
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ]),
      );

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertyTableId!,
      buildQuery,
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Helper to fetch multiple documents by IDs
async function getDocumentsByIds(collectionId: string, ids: string[]) {
  const promises = ids.map((id) =>
    databases
      .getDocument(config.databaseId!, collectionId, id)
      .catch(() => null),
  );
  return await Promise.all(promises);
}

// write function to get property by id
export async function getPropertyById({ id }: { id: string }) {
  try {
    const result = await databases.getDocument(
      config.databaseId!,
      config.propertyTableId!,
      id,
    );

    // 2. Populate agent
    let agent = null;
    if (result.agent) {
      try {
        agent = await databases.getDocument(
          config.databaseId!,
          config.agentTableId!,
          result.agent,
        );
      } catch (err) {
        console.error("Failed to fetch agent:", err);
      }
    }
    // Populate gallery
    let gallery = [];
    if (result.galleryIds?.length) {
      gallery = await getDocumentsByIds(
        config.databaseId!,
        config.galleryTableId!,
        result.galleryIds,
      );
    }

    // Populate reviews
    let reviews = [];
    if (result.reviewIds?.length) {
      reviews = await getDocumentsByIds(
        config.databaseId!,
        config.reviewTableId!,
        result.reviewIds,
      );
    }

    return {
      ...result,
      agent,
      gallery,
      reviews,
    };
  } catch (error) {}
}
