import React, { useState, useEffect } from "react";
import { View, Text, Alert, Platform, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getServiceById, bookAppointment } from "../../lib/appwrite";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";

const BookingPage = () => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [service, setService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getServiceById(id);
        setService(data);
      } catch (error) {
        console.error("Failed to fetch service:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  const handleDateChange = (event, date) => {
    if (event.type === "set") {
      const newDate = date || new Date();
      setSelectedDate((prevDate) => {
        const updatedDate = new Date(prevDate);
        updatedDate.setFullYear(newDate.getFullYear());
        updatedDate.setMonth(newDate.getMonth());
        updatedDate.setDate(newDate.getDate());
        return updatedDate;
      });
      setShowDatePicker(false);
      if (!showTimePicker) {
        setShowTimePicker(true);
      }
    } else {
      setShowDatePicker(false);
    }
  };

  const handleTimeChange = (event, time) => {
    if (event.type === "set") {
      const newTime = time || new Date();
      setSelectedDate((prevDate) => {
        const updatedDate = new Date(prevDate);
        updatedDate.setHours(newTime.getHours());
        updatedDate.setMinutes(newTime.getMinutes());
        return updatedDate;
      });
      setShowTimePicker(false);
    } else {
      setShowTimePicker(false);
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === "ios") {
      setShowDatePicker(true);
    } else if (Platform.OS === "android") {
      import("@react-native-community/datetimepicker").then(
        ({ DateTimePickerAndroid }) => {
          DateTimePickerAndroid.open({
            mode: "date",
            value: selectedDate,
            onChange: (event, date) => handleDateChange(event, date),
          });
        }
      );
    }
  };

  const handleBookAppointment = async () => {
    try {
      if (!service) {
        Alert.alert("Error", "Service information is not available.");
        return;
      }
      await bookAppointment(user.$id, service.$id, selectedDate);
      Alert.alert("Success", "Appointment booked successfully!");
      router.push("../(tabs)/home");
    } catch (error) {
      Alert.alert("Error", "Failed to book appointment. Please try again.");
      console.error(error);
    }
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );

  if (!service) return (
    <View className="flex-1 justify-center items-center bg-primary">
      <Text className="text-white">Service not found</Text>
    </View>
  );

  // Format date and time
  const formattedDate = selectedDate.toLocaleDateString(); // Format date without time
  const formattedTime = selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format time without seconds

  return (
    <View className="flex-1 mt-10 bg-primary">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <Text className="text-4xl font-bold mb-4 text-white">
          {service.name}
        </Text>
        <Text className="text-lg text-white mb-4">
          Book a time slot at your convenience{"\n"}and confirm!
        </Text>
        <CustomButton
          title="Select Date & Time"
          handlePress={openDatePicker}
          containerStyles="w-full h-12 bg-secondary mb-5"
        />
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, date) => handleDateChange(event, date)}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, time) => handleTimeChange(event, time)}
          />
        )}
        <Text className="text-xl font-regular text-white">
          Selected Date:{" "}
        </Text>
        <Text className="text-secondary font-bold text-3xl mt-4">
          {formattedDate}
        </Text>
        <Text className="text-xl font-regular text-white mt-2">
          Selected Time:{" "}
        </Text>
        <Text className="text-secondary font-bold text-3xl mt-4">
          {formattedTime}
        </Text>
      </ScrollView>
      <CustomButton
        title="Book Appointment"
        handlePress={handleBookAppointment}
        containerStyles="w-full h-12 bg-secondary"
      />
    </View>
  );
};

export default BookingPage;
