import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";

const AboutUs = () => {
  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <View className="flex-1 justify-center items-center">
          <Image
            source={images.logo} // Replace with your app's logo
            className="w-24 h-24 mb-6"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-white mb-4">About Us</Text>
          <Text className="text-lg text-white mb-6 text-center">
            Welcome to One Roof Service App, where we provide the best solutions for all your needs. Our mission is to deliver top-notch services with ease and efficiency.
          </Text>
          <Text className="text-lg text-white mb-6 text-center">
            We are dedicated to offering a seamless experience through our app, which connects you with various services quickly and effortlessly. Our team is committed to ensuring the highest quality and satisfaction.
          </Text>
          <Text className="text-lg text-white mb-6 text-center">
            Thank you for choosing One Roof Service App. We hope you have a great experience and look forward to serving you.
          </Text>
          <View className="bg-gray-800 p-4 rounded-lg w-full max-w-md mb-6">
            <Text className="text-xl font-bold text-white mb-2">Contact Us</Text>
            <Text className="text-lg text-white mb-1">Email: support@oneroofservice.com</Text>
            <Text className="text-lg text-white mb-1">Phone: +1 (123) 456-7890</Text>
            <Text className="text-lg text-white">Address: 123 Service Lane, Suite 100, Cityville, ST 12345</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutUs;
