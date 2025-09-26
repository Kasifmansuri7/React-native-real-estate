import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import {
  Account,
  Avatars,
  Client,
  Databases,
  OAuthProvider,
} from "react-native-appwrite";

export const configs = {
  endPoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

// Create client instance
export const client = new Client();

client
  .setEndpoint(configs.endPoint as string) // Your Appwrite Endpoint
  .setProject(configs.projectId as string); // Your project ID

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
        name: response.name || "U",
      });
      return { ...response, avatar: userAvatar.toString() };
    }

    return response;
  } catch (error) {
    console.log("Get user error: ", error);
    return null;
  }
}
