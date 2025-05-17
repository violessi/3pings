import { Text, View, Alert, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

// styling
import Header from "@/src/components/Header";
import Option from "@/src/components/HomeOptions";

// trips
import React, { useState, useEffect } from "react";
import TripCard from "@/src/components/TripCard";
import { Trip } from "@/src/components/types";
import globalStyles from "@/src/assets/styles";

export default function ActionPage() {
  const router = useRouter();

  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const tripsCollection = collection(db, "trips");
        const tripSnapshot = await getDocs(tripsCollection);

        const allTrips: Trip[] = tripSnapshot.docs.map((doc) => ({
          ...(doc.data() as Trip),
          id: doc.id,
        }));

        const active = allTrips.filter((trip) => trip.status === "reserved");

        setActiveTrips(active);

        console.log("[APP] Reserved Trips:", active);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title="Welcome, user!"
        subtitle="What do you want to do today?"
        hasBack={false}
        isHomepage={true}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-start gap-1 p-5">
          <Option
            title="Rent"
            description="Rent a bike"
            icon="bike"
            onPress={() => router.replace("/rent")}
          />
          <Option
            title="Return"
            description="Return a bike"
            icon="arrow-left"
            onPress={() => router.replace("/return")}
          />
          <Option
            title="Reserve"
            description="Reserve a bike"
            icon="calendar"
            onPress={() => router.replace("/")}
          />
        </View>
        <View style = {{marginTop: 20}}>
          <Header
          title="Your Reservations"
          subtitle="Please use the Rent page to claim your bike."
          hasBack={false}
          isHomepage={true}
        />
        </View>
        <View style={{ marginHorizontal: 20 }}>
          {activeTrips.map((trip, index) => (
            <TripCard
              tripID={trip.id}
              key={index}
              title={`Reservation from ${trip.startTime.toDate().toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}`}
              bikeID={`${trip.bikeId}`}
              tripStart={`${trip.startTime.toDate().toLocaleString()}`}
              tripEnd=""
              remarks={`${trip.status}`}
              // startRack={trip.startRack}
              // endRack=""
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
