import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

import globalStyles from "@/src/assets/styles";
import Header from "@/src/components/Header";
import LoadingModal from "@/components/LoadingModal";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";

import RackStatus from "@/src/components/RackStatus";
import ReserveForm from "@/src/components/ReserveForm"; // New component

import { useBike } from "@/context/BikeContext";
import { Rack } from "@/src/components/types";

export default function Reserve() {
  const router = useRouter();

  // for getting current rack info; rack is input parameter to reserve function
  const { rackID } = useLocalSearchParams<{ rackID: string }>();
  const [rackData, setRackData] = useState<Rack | null>(null);

  // for bike-related functions
  const [assignedBike, setAssignedBike] = useState<Bike | null>(null);
  const {
    showSuccessModal,
    showErrorModal,
    showLoadingModal,
    setShowSuccessModal,
    updateRackId,
    reserveABike,
  } = useBike();

  // reserves from current time
  const selectedDate = new Date();

  // fetch rack info to display in card
  useEffect(() => {
    updateRackId(rackID); // raising a problem, but works
    if (!rackID || typeof rackID !== "string") return;

    const fetchRackInfo = async () => {
      try {
        const rackDoc = await getDoc(doc(db, "racks", rackID));
        if (!rackDoc.exists()) {
          console.error("[APP] Rack not found"); // PLACEHOLDER; modal/go back
          return;
        }

        const rackData = rackDoc.data();
        const bikesQuery = query(collection(db, "bikes"), where("rackId", "==", rackID));
        const bikesSnapshot = await getDocs(bikesQuery);
        const bikes = bikesSnapshot.docs.map((doc) => doc.data());

        const availableCount = bikes.filter((b) => b.status === "available").length;
        const reservedCount = bikes.filter((b) => b.status === "reserved").length;
        const emptySlots = 5 - bikes.length; // PLACEHOLDER; HARDCODED

        setRackData({
          name: rackData.rack_name,
          location: rackData.location,
          available: availableCount,
          reserved: reservedCount,
          empty: emptySlots,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchRackInfo();
  }, [rackID]);

  const handleReserve = async () => {
    try {
      const res = await reserveABike(selectedDate);
      setAssignedBike(res);
    } catch (err: any) {
      console.log("Reserve error:", err.message);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.replace("/(tabs)/action");
  };

  const handleBack = () => {
    updateRackId("");
    router.canGoBack() ? router.back() : router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Reserve" subtitle="Reserve a bike from this rack!" hasBack={true} prevCallback={handleBack} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={globalStyles.title}>{rackData?.name}</Text>
        <View style={{ marginBottom: 10 }}>
          <Text style={globalStyles.detail}>Map Photo</Text>
        </View>

        <Text style={globalStyles.subtitle}>Rack Status</Text>
        {rackData && <RackStatus {...rackData} />}

        <ReserveForm onReserve={handleReserve} />

        <LoadingModal showLoadingModal={showLoadingModal} />
        <SuccessModal
          title="Bike reserved successfully!"
          description1={`Please make sure to claim your bike from slot ${assignedBike?.rackSlot}.`}
          description2="Reservation holds for 15 mins."
          showSuccessModal={showSuccessModal}
          onClose={handleCloseSuccessModal}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
