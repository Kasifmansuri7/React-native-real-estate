import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const PropertyDetails = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Property Details: {id}</Text>
    </View>
  );
};

export default PropertyDetails;
