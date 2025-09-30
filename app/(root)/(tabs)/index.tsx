import Card from "@/components/Card";
import FeaturedCard from "@/components/FeaturedCard";
import Filters from "@/components/Filters";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useGlobalContext } from "@/lib/global-provider";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const { user } = useGlobalContext();

  return (
    <SafeAreaView className="bg-white h-full">
      {/* Header */}
      <View className="px-5">
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row">
            <Image
              source={images.avatar}
              className="size-12 rounded-full"
            />
            <View className="flex flex-col items-start justify-center ml-2">
              <Text className="text-xs font-rubik text-black-100">
                Good Morning!
              </Text>
              <Text className="text-base font-rubik-medium text-black-300">
                {user?.name}
              </Text>
            </View>
          </View>

          <Image
            source={icons.bell}
            className="size-6"
          />
        </View>
      </View>

      <View className="px-5">
        {/* Search */}
        <Search />

        <View className="my-5 ">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-rubik-bold text-black-300">
              Featured
            </Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-bold text-primary-300">
                See All
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}>
          <View className="flex flex-row gap-5 mt-5">
            <FeaturedCard />
            <FeaturedCard />
            <FeaturedCard />
          </View>
        </ScrollView>

        <View className="my-5">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-xl font-rubik-bold text-black-300">
              Our Recommedations
            </Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-bold text-primary-300">
                See All
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Filters />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}>
          <View className="flex flex-row gap-5">
            <Card />
            <Card />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default index;
