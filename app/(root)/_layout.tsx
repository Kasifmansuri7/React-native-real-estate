import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AppLayout = () => {
  const { loading, isLoggedIn } = useGlobalContext();

  // Loader
  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex-1 justify-center items-center">
        <ActivityIndicator
          size="large"
          className="text-primary-300"
        />
      </SafeAreaView>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/sign-in" />;
  }

  // Slot means current screen
  return <Slot />;
};

export default AppLayout;
