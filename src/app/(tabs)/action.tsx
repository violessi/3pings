import { View, Alert, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

import Header from "@/src/components/Header";
import Option from "@/src/components/HomeOptions";

export default function ActionPage() {
  const router = useRouter();
  const handleAvail = async () => {
    try {
      const newTrip = {
        bikeID: Math.floor(Math.random() * 100), // Random bikeID
        startRack: "Station A", // change to current rack read from rfid
        startTime: new Date(), // take current timestamp
        status: "In Use",
      };

      // add logic to verify user
      await addDoc(collection(db, "activeTrips"), newTrip);
      Alert.alert("Bike availed!");
      router.replace("/trips");
    } catch (error) {
      console.error("Error availing bike:", error);
    }
  };

  const handleReturn = async () => {
    try {
      const activeSnapshot = await getDocs(collection(db, "activeTrips"));

      if (activeSnapshot.empty) {
        Alert.alert("No active trips to return.");
        return;
      }

      // add logic to verify bike to firstTrip
      // if not matching bike ID, do not allow return
      const firstTrip = activeSnapshot.docs[0]; // Simulate returning the first active trip
      const tripData = firstTrip.data();

      const completedTrip = {
        ...tripData,
        endRack: "Station B", // change to current rack read from rfid
        endTime: new Date(), // take current timestamp
        status: "Paid", // need to double check with actual payment
      };

      // transfer from active to completed
      await addDoc(collection(db, "completedTrips"), completedTrip);
      await deleteDoc(doc(db, "activeTrips", firstTrip.id));
      Alert.alert("Bike returned!");
      router.replace("/trips");
    } catch (error) {
      console.error("Error returning bike:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title="Welcome, user!"
        subtitle="What do you want to do today?"
        hasBack={false}
        isHomepage={true}
      />
      <View className="flex-1 justify-start gap-1 p-5">
        <Option
          title="Rent"
          description="Rent a bike"
          icon="bike"
          onPress={handleAvail}
        />
        <Option
          title="Return"
          description="Return a bike"
          icon="arrow-left"
          onPress={handleReturn}
        />
        <Option
          title="Reserve"
          description="Reserve a bike"
          icon="calendar"
          onPress={() => router.replace("/(tabs)")}
        />
      </View>
    </SafeAreaView>
  );
}
