import { settings } from "@/constants/data";
import icons from "@/constants/icons";
import { logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import React from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsItemProps {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingsItemProps) => (
  <TouchableOpacity
    className="flex flex-row items-center justify-between py-3"
    onPress={onPress}>
    <View className="flex flex-row items-center gap-3">
      <Image
        source={icon}
        className="size-8"
      />
      <Text className={`text-lg font-rubik-medium text-black-100 ${textStyle}`}>
        {title}
      </Text>
    </View>

    {showArrow && (
      <Image
        source={icons.rightArrow}
        className="size-5"
      />
    )}
  </TouchableOpacity>
);

const profile = () => {
  const { user, refetch } = useGlobalContext();

  // Logout handler
  const handleLogout = async () => {
    const result = await logout();

    if (result) {
      Alert.alert("Success", "Logged out successfully!");
      refetch();
    } else {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsHorizontalScrollIndicator={true}
        // Title
        contentContainerClassName="pb-32 px-7">
        <View className="flex flex-row  items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold ">Profile</Text>
          <Image
            source={icons.bell}
            className="size-5"
          />
        </View>

        <View className="flex-row justify-center flex mt-5">
          <View className="flex flex-col  items-center relative mt-5">
            <Image
              source={{ uri: user?.avatar }}
              className="size-44 relative rounded-full"
            />

            {/* Profile edit icon */}
            {/* <TouchableOpacity className="absolute bottom-11 right-2">
              <Image
                source={icons.edit}
                className="size-8"
              />
            </TouchableOpacity> */}

            <Text className="text-2xl font-rubik-bold mt-2">{user?.name}</Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          <SettingsItem
            icon={icons.calendar}
            title="My Bookings"
          />
          <SettingsItem
            icon={icons.wallet}
            title="Payments"
          />
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingsItem
              key={index}
              {...item}
            />
          ))}
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle="text-danger"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
