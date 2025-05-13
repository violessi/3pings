import React, { useState, useEffect } from "react";
import { Text, ScrollView, SafeAreaView } from "react-native";
import TripCard from "@/src/components/TripCard";
import globalStyles from "@/src/assets/styles";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Trip } from "@/src/components/types";
import Header from "@/src/components/Header";

export default function TripScreen() {
  const [completedTrips, setCompletedTrips] = useState<Trip[]>([]);
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const tripsCollection = collection(db, "trips");
        const tripSnapshot = await getDocs(tripsCollection);

        const allTrips: Trip[] = tripSnapshot.docs.map((doc) => doc.data() as Trip);

        const active = allTrips.filter(trip =>
          trip.status === "reserved" || trip.status === "active"
        );

        const completed = allTrips.filter(trip =>
          trip.status === "completed" || trip.status === "cancelled"
        );

        setActiveTrips(active);
        setCompletedTrips(completed);

        console.log("Active Trips:", active);
        console.log("Completed Trips:", completed);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

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
            title={`Trip using ${trip.bike_id}`}
            bikeID={`${trip.bike_id}`}
            tripStart={`${trip.start_time.toDate().toLocaleString()}`}
            tripEnd=""
            remarks={`${trip.status}`}
          />
        ))}
        <Text style={globalStyles.title}> Completed </Text>
        {completedTrips.map((trip, index) => (
          <TripCard
            key={index}
            title={`Trip using ${trip.bike_id}`}
            bikeID={`${trip.bike_id}`}
            tripStart={`${trip.start_time.toDate().toLocaleString()}`}
            tripEnd={`${trip.end_time.toDate().toLocaleString()}`}
            remarks={`${trip.status}`}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}