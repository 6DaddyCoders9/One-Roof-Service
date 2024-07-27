import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getServiceById } from "../../lib/appwrite"; // Import the function
import CustomButton from "../../components/CustomButton";

const ServiceDetail = () => {
  const { id } = useLocalSearchParams(); // Get the ID from route params
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getServiceById(id);
        setService(data);
      } catch (error) {
        console.error("Failed to fetch service:", error.message); // More descriptive error
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    ); // Show a loading message or spinner

  if (!service)
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white">Service not found</Text>
      </View>
    ); // Handle no data case

  return (
    <View className="flex-1 bg-primary pt-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      <Text className="text-2xl font-psemibold text-white pb-10">Service Details</Text>
        <Image
          source={{ uri: service.image }}
          className="w-full h-48 rounded-lg"
        />
        <Text className="text-4xl font-semibold my-4 text-secondary">
          {service.name}
        </Text>
        <Text className="text-white text-lg mb-4">{service.description}</Text>
        <Text className="text-white text-lg">
          Price: <Text className="font-bold">${service.price.toFixed(2)}</Text>
        </Text>
        <Text className="text-white text-lg mt-2">
          Availability:{" "}
          <Text className="font-bold">
            {service.availability ? "Available" : "Currently not Available"}
          </Text>
        </Text>
      </ScrollView>
      <CustomButton
        title="BOOK SERVICE"
        handlePress={() => router.push(`./BookingPage?id=${service.$id}`)}
        containerStyles="w-full mt-7"
      />
    </View>
  );
};

export default ServiceDetail;
