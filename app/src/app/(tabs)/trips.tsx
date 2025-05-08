import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, SafeAreaView } from "react-native";
import TripCard from "@/src/components/TripCard";
import globalStyles from "@/src/assets/styles";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Trip } from "@/src/components/types";
import Header from "@/src/components/Header";

export default function TripScreen() {
  const [completedTrips, setCompletedTrips] = useState<Trip[]>([]);
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);

  // Fetch data

  useEffect(() => {
    const fetchActiveTrips = async () => {
      try {
        const activeCollection = collection(db, "activeTrips");
        const activeSnapshot = await getDocs(activeCollection);
        const trips: Trip[] = activeSnapshot.docs.map((doc) => doc.data() as Trip);
        setActiveTrips(trips);
        console.log("Fetched active trips:", trips);
      } catch (error) {
        console.error("Error fetching active trips:", error);
      }
    };

    fetchActiveTrips();
  }, []);

  useEffect(() => {
    const fetchCompletedTrips = async () => {
      try {
        const tripsCollection = collection(db, "completedTrips");
        const tripSnapshot = await getDocs(tripsCollection);
        const trips: Trip[] = tripSnapshot.docs.map((doc) => doc.data() as Trip);
        setCompletedTrips(trips);
        console.log("Fetched completed trips:", trips);
      } catch (error) {
        console.error("Error fetching completed trips:", error);
      }
    };

    fetchCompletedTrips();
  }, []);

  // Return
  
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Trips" subtitle="Check your trips!" />
      <ScrollView
        contentContainerStyle={globalStyles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={globalStyles.title}> Active </Text>
        {activeTrips.map((trip, index) => (
          <TripCard
            key={index}
            title={`Bike ${trip.bike_id}`}  
            bikeID={trip.bike_id}  
            tripStart={trip.start_time.toDate().toLocaleString()}  
            tripEnd={trip.end_time.toDate().toLocaleString() || "Not returned yet"}  
            remarks={trip.status}  
          />
        ))}
        <Text style={globalStyles.title}> Completed </Text>
        {completedTrips.map((trip, index) => (
          <TripCard
            key={index}
            title={`Bike ${trip.bike_id}`}  
            bikeID={trip.bike_id} 
            tripStart={trip.start_time.toDate().toLocaleString()}  
            tripEnd={trip.end_time.toDate().toLocaleString()} 
            remarks={trip.status}  
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
