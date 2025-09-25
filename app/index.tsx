import { Link } from "expo-router";
import { Text, View } from "react-native";
import "./global.css";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-blue-500 font-rubik text-3xl">
        Welcome to Nativewind!
      </Text>

      <Text className="text-3xl font-rubik">Kashif</Text>
      <Text className="text-3xl font-rubik">Welcome to ReState</Text>
      <Text className="text-3xl">Kashif</Text>
      <Link href={"/sign-in"}>SignIn</Link>
    </View>
  );
}
