import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, FlatList, Text, RefreshControl, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserBookings, signOut, cancelBooking } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import EmptyState from "../../components/EmptyState";
import InfoBox from "../../components/InfoBox";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: userBookings, loading, refetch } = useAppwrite(() =>
    getUserBookings(user.$id)
  );
  const [refreshing, setRefreshing] = useState(false);

  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const time = new Date(timeString);
    // Combine date and time
    const combinedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );
    return {
      date: combinedDateTime.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }),
      time: combinedDateTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };
  };

  const handleCancel = async (bookingId) => {
    try {
      // Attempt to delete the booking document
      await cancelBooking(bookingId);
      Alert.alert("Booking Cancelled", "Your booking has been cancelled successfully.");
      refetch(); // Refresh the data after cancelling the booking
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      Alert.alert("Error", "Failed to cancel booking. Please try again.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={userBookings}
        keyExtractor={(item) => item.$id}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              subtitle={user?.email}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <Text className="text-2xl font-bold text-secondary mt-6">
              Your Bookings
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const { date, time } = formatDateTime(item.date, item.time); // Format date and time

          return (
            <View className="px-4 mb-4">
              <View className="bg-gray-800 p-4 rounded-lg shadow-md">
                <Text className="text-lg font-semibold text-secondary">{item.services.name}</Text>
                <Text className="text-gray-200 mt-2 text-lg">
                  Description: {item.services.description}
                </Text>
                <Text className="text-gray-200 mt-2 text-lg">
                  Price: ${item.services.price}
                </Text>
                <Text className="text-gray-200 mt-2 text-lg">
                  Status: {item.status}
                </Text>
                <Text className="text-gray-200 mt-2 text-lg pb-2">
                  Date: {date}
                </Text>
                <Text className="text-gray-200 mt-2 text-lg pb-5">
                  Time: {time}
                </Text>

                <TouchableOpacity
                  className="bg-secondary-200 rounded-xl min-h-[62px] justify-center items-center"
                  onPress={() => handleCancel(item.$id)}
                >
                  <Text className="text-primary font-psemibold text-lg">
                    Cancel Booking
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <EmptyState
            title="No Bookings yet :("
            subtitle="Make a booking and view it here!"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
