import {
  FlatList,
  Text,
  View,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import EmptyState from "../../components/EmptyState";
import useAppwrite from "../../lib/useAppwrite";
import { getAllServices } from "../../lib/appwrite"; // Update to fetch services
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";

const Home = () => {
  const { user } = useGlobalContext();
  const { data: services, refetch } = useAppwrite(getAllServices); // Fetch services
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handlePress = (id) => {
    router.push(`/service-details/${id}`);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={services}
        keyExtractor={(item) => item.$id}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row ">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back,
                </Text>
                <Text className="text-2xl font-psemibold text-secondary">
                  {user?.username}
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logo}
                  className="w-[150px] -top-8"
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text className="text-2xl font-psemibold text-white">Services : </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Services Found"
            subtitle="Don't worry, We are finding you the best deals!"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            className="px-4 mb-4"
            onPress={() => handlePress(item.$id)}
          >
            <View className="bg-gray-700 p-4 rounded-lg shadow-md space-y-2">
              <Text className="text-secondary-100 text-lg font-semibold">
                {item.name}
              </Text>
              <Image
                source={{ uri: item.image }}
                className="w-full h-48 mt-4 rounded-lg"
                resizeMode="cover"
              />
              <Text className="text-gray-200 mt-2">
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
