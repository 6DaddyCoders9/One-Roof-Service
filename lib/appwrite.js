import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.daddycoders.one_roof_service",
  projectId: "669a6b0c00193cc45e07",
  storageId: "669a6bda003a517f50ee",
  databaseId: "669a6b5d00315c6ccc43",
  userCollectionId: "669a6b6500156d81c9b2",
  servicesCollectionId: "66a4f269000d9fa2fc7c",
  bookingCollectionID: "66a4f8c50016ddb6f777",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    
    if (!currentUser) throw Error;
    
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllServices = async () => {
  try {
    const services = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.servicesCollectionId
    );
    return services.documents;
  } catch (error) {
    console.error("Failed to fetch services:", error.message);
    throw error;
  }
};

export const getServiceById = async (id) => {
  try {
    const service = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.servicesCollectionId,
      id
    );
    return service;
  } catch (error) {
    console.error("Failed to fetch service:", error.message);
    throw error;
  }
};

export const bookAppointment = async (userId, serviceId, date) => {
  try {
    // Extract date and time in the appropriate format
    const appointmentDate = date.toISOString().split('T')[0]; // Date part
    const appointmentTime = date.toISOString().split('T')[1]; // Time part
    
    // Log data for debugging
    console.log("Booking Details:", {
      userId,
      serviceId,
      appointmentDate,
      appointmentTime
    });

    const appointment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionID,
      ID.unique(),
      {
        users: userId, // Ensure this maps correctly to your schema
        services: serviceId, // Ensure this maps correctly to your schema
        date: appointmentDate, // Date in ISO format
        time: appointmentTime, // Time in ISO format
        status: "pending" // Default value for status
      }
    );
    return appointment;
  } catch (error) {
    console.error("Failed to book appointment:", error.message);
    throw error;
  }
};

// New function to get user bookings
export const getUserBookings = async (userId) => {
  try {
    const bookings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionID,
      [Query.equal("users", userId)]
    );
    return bookings.documents;
  } catch (error) {
    console.error("Failed to fetch user bookings:", error.message);
    throw error;
  }
};

// New function to cancel a booking
export const cancelBooking = async (bookingId) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionID,
      bookingId
    );
  } catch (error) {
    console.error("Failed to delete booking:", error);
    throw error;
  }
};

