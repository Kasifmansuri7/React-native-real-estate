import Card from "@/components/Card";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { getProperties } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PROPERTY_LIMIT = 20;
const Explore = () => {
  const params = useLocalSearchParams<{ query?: string; filters?: string }>();

  const {
    data: properties,
    loading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: {
      query: params.query!,
      filter: params?.filters!,
      limit: PROPERTY_LIMIT,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      query: params.query!,
      filter: params?.filters!,
      limit: PROPERTY_LIMIT,
    });
  }, [params.filters, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={properties || []}
        renderItem={({ item }) => (
          <Card
            item={item}
            onPress={() => handleCardPress(item.$id)}
          />
        )}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              className="text-primary-300 mt-5"
              size="large"
            />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center">
                <Image
                  source={icons.backArrow}
                  className="size-5"
                />
              </TouchableOpacity>

              <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                Search For Your Ideal Home
              </Text>

              <Image
                source={icons.bell}
                className="h-6 w-6"
              />
            </View>
            <Search />

            <View className="mt-5">
              <Filters />

              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {properties?.length || 0} Properties
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Explore;
