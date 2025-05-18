import React, { useState, useEffect } from "react";
import { Text, ScrollView, SafeAreaView } from "react-native";
import globalStyles from "@/src/assets/styles";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Header from "@/src/components/Header";

// trips
import { Trip } from "@/src/components/types";
import TripCard from "@/src/components/TripCard";


export default function TripScreen() {
  const [completedTrips, setCompletedTrips] = useState<Trip[]>([]);
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);

  const fetchTrips = async () => {
    try {
      const tripsCollection = collection(db, "trips");
      const tripSnapshot = await getDocs(tripsCollection);

      const allTrips: Trip[] = tripSnapshot.docs.map((doc) => ({
        ...(doc.data() as Trip),
        id: doc.id,
      }));

      const active = allTrips.filter(trip =>
        trip.status === "active"
      );

      const completed = allTrips.filter(trip =>
        trip.status === "completed" || trip.status === "cancelled"
      );

      setActiveTrips(active);
      setCompletedTrips(completed);

      console.log("[APP] Active Trips:", active);
      console.log("[APP] Completed Trips:", completed);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
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
        { activeTrips.length === 0 ? (
          <Text style={[globalStyles.detail, {fontSize: 20}, {marginLeft: 40},{marginBottom: 30}]}>No trips to show.</Text>
        ) : (  
          activeTrips.map((trip, index) => (
            <TripCard
              key={index}
              tripID={trip.id}
              title={`Trip from`}
              bikeID={`${trip.bikeId}`}
              tripStart={`${trip.startTime.toDate().toLocaleString()}`}
              tripEnd={trip.endTime
                ? trip.endTime.toDate().toLocaleString()
                : ""}
              remarks={`${trip.status}`}
              addtl_charge={trip.addtlCharge}
              startRack={trip.startRack}
              endRack={trip.endRack}
            />
          ))
        )}
        <Text style={globalStyles.title}> Completed </Text>
        { completedTrips.length === 0 ? (
          <Text style={[globalStyles.detail, {fontSize: 20}, {marginLeft: 40},{marginBottom: 30}]}>No trips to show.</Text>
        ) : ( 
          completedTrips.map((trip, index) => (
            <TripCard
              key={index}
              tripID={trip.id}
              title={`Trip from`}
              bikeID={`${trip.bikeId}`}
              tripStart={`${trip.startTime.toDate().toLocaleString()}`}
              tripEnd={trip.endTime
                ? trip.endTime.toDate().toLocaleString()
                : ""}
              remarks={`${trip.status}`}
              addtl_charge={trip.addtlCharge}
              startRack={trip.startRack}
              endRack={trip.endRack}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}