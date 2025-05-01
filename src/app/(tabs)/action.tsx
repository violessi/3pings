import { Text, View, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

import globalStyles from "@/src/assets/styles";

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
    <View style={styles.container}>
      <Button title="Avail Bike" onPress={handleAvail} color="#362C5F" />
      <Button title="Return Bike" onPress={handleReturn} color="#362C5F" />
      <Button
        title="Reserve"
        onPress={() => router.replace("/(tabs)")}
        color="#362C5F"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
});
