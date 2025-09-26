import { Link } from "expo-router";
import { Text, View } from "react-native";
import "../global.css";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-blue-500 font-rubik text-3xl">
        Welcome to ReState!
      </Text>

      <Link
        href={"/sign-in"}
        className="p-5 border-2">
        Go to SignIn
      </Link>
    </View>
  );
}
