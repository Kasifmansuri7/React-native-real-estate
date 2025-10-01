import Card from "@/components/Card";
import FeaturedCard from "@/components/FeaturedCard";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
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

const PROPERTY_LIMIT = 6;
const index = () => {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams<{ query?: string; filters?: string }>();

  const { data: latestProperties, loading: latestPropertiesLoading } =
    useAppwrite({ fn: getLatestProperties });

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
          <>
            <View className="px-5">
              <View className="flex flex-row items-center justify-between mt-5">
                <View className="flex flex-row">
                  <Image
                    source={{ uri: user?.avatar }}
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

              {latestPropertiesLoading ? (
                <ActivityIndicator
                  size={"large"}
                  className="text-primary-300"
                />
              ) : !latestProperties?.length ? (
                <NoResults />
              ) : (
                <FlatList
                  data={latestProperties || []}
                  renderItem={({ item }) => (
                    <FeaturedCard
                      item={item}
                      onPress={() => handleCardPress(item.$id)}
                    />
                  )}
                  keyExtractor={(item) => item.$id}
                  horizontal
                  bounces={false} // For jumping in all four directions
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              )}

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
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default index;
