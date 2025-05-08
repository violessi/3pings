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
      const res = await fetch("http://localhost:3000/api/bikeActions/avail", {
        method: "POST", // post to server to handle avail request
      });
  
      if (res.ok) {
        Alert.alert("Bike availed!");
        router.replace("/trips"); // redirect to updated trips page
      } else {
        Alert.alert("Error availing bike");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };
  
  const handleReturn = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/bikeActions/return", {
        method: "POST", // post to server to handle return request
      });
  
      if (res.ok) {
        Alert.alert("Bike returned!");
        router.replace("/trips");
      } else {
        const { error } = await res.json();
        Alert.alert(error || "Error returning bike");
      }
    } catch (err) {
      console.error("Error:", err);
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
