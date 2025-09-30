import icons from "@/constants/icons";
import images from "@/constants/images";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  onPress?: () => void;
}

const Card = ({ onPress }: Props) => {
  const item = {
    rating: 4.5,
    image: images.newYork,
    name: "Cozy Studio",
    address: "22 Kentucky, USA",
    price: "1500",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-60 mt-4 px-3 rounded-lg bg-white shadow-lg shadow-black-100/70 relative">
      <View className="flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded-full z-50">
        <Image
          source={icons.star}
          className="size-3.5"
        />
        <Text className="text-xs font-rubik-bold text-primary-300 ml-1 ">
          4.5
        </Text>
      </View>

      <Image
        source={item?.image}
        className="w-full h-40 rounded-lg "
      />

      <View className="flex flex-col mt-2">
        <Text className="text-base font-rubik-bold text-black-300">
          {item?.name}
        </Text>

        <Text className="text-xs font-rubik text-black-200">
          22 Kentucky, USA
        </Text>

        <View className="flex flex-row items-center justify-between mt-2">
          <Text className="text-base font-rubik-bold text-primary-300">
            $1500
          </Text>
          <Image
            source={icons.heart}
            className="size-6 w-5 h-5 mr-2"
            tintColor="#191d31"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;
