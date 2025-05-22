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
import React, { useState, useEffect, createContext } from "react";
import TripCard from "@/src/components/TripCard";
import { Trip } from "@/src/components/types";
import globalStyles from "@/src/assets/styles";
import { preRentCheck } from "@/src/service/tripService";
import ErrorModal from "@/src/components/ErrorModal";
import SuccessModal from "@/src/components/SuccessModal";
import { formatDate } from "@/src/service/tripService";
import LoadingModal from "@/src/components/LoadingModal";
import { useFocusEffect } from "@react-navigation/native";

type BikeContextType = {
  rackId: string;
  showSuccessModal: boolean;
  showErrorModal: boolean;
  showReturnModal: boolean;
  errorMessage: string;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  showLoadingModal: boolean;
};

export const BikeContext = createContext<BikeContextType | null>(null);

export default function ActionPage() {
  const router = useRouter();
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);
  const userId = "user123";
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleButtonPress = async () => {
    setShowLoadingModal(true);
    try {
      // handle prechecking before renting - TO MOVE TO RENT BUTTON PRESSING
      const result = await preRentCheck(userId);
      if (!result.allowed) {
        throw new Error(result.reason);
      } else {
        setShowLoadingModal(false);
        router.navigate("/rent");
      }
    } catch (err: any) {
      setShowLoadingModal(false);
      setTimeout(() => {
        setErrorMessage(err.message);
        setShowErrorModal(true);
      }, 500);
      return;
    }
  };

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

  useFocusEffect(
    React.useCallback(() => {
      fetchTrips();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title="Welcome, user!"
        subtitle="What do you want to do today?"
        hasBack={false}
        isHomepage={true}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-start gap-2 p-5">
          <Option
            title="Rent"
            description="Rent a bike"
            icon="bike"
            onPress={handleButtonPress}
          />
          <Option
            title="Return"
            description="Return a bike"
            icon="arrow-left"
            onPress={() => router.navigate("/return")}
          />
          <Option
            title="Reserve"
            description="Reserve a bike"
            icon="calendar"
            onPress={() => router.navigate("/")}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Header
            title="Your Reservations"
            subtitle="Please use the Rent page to claim your bike."
            hasBack={false}
            isHomepage={true}
          />
        </View>
        <View style={{ marginHorizontal: 20 }}>
          {activeTrips.length === 0 ? (
            <Text
              style={[
                globalStyles.detail,
                { fontSize: 18 },
                { marginLeft: 40 },
                { marginBottom: 30 },
              ]}
            >
              No trips to show.
            </Text>
          ) : (
            activeTrips.map((trip, index) => (
              <TripCard
                tripID={trip.id}
                key={index}
                title={`Reservation from`}
                bikeID={`${trip.bikeId}`}
                tripStart={formatDate(trip.startTime.toDate())}
                tripEnd=""
                remarks={`${trip.status}`}
                startRack={trip.startRack}
                endRack=""
                onTripCancelled={() => {
                  setSuccessMessage("Reservation cancelled.");
                  setShowSuccessModal(true);
                  fetchTrips();
                }}
                onCancelError={(message) => {
                  setErrorMessage(message);
                  setShowErrorModal(true);
                }}
              />
            ))
          )}
        </View>
        <SuccessModal
          title="Success"
          description1={successMessage}
          showSuccessModal={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />
        <ErrorModal
          title="Error"
          description={errorMessage}
          showErrorModal={showErrorModal}
          onClose={() => setShowErrorModal(false)}
        />
        <LoadingModal showLoadingModal={showLoadingModal} />
      </ScrollView>
    </SafeAreaView>
  );
}
