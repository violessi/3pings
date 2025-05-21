import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
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
  const [expiryTimeStr, setExpiryTimeStr] = useState<string>("");

  // fetch rack info to display in card

  const handleReserve = async () => {
    try {
      const res = await reserveABike(selectedDate);
      setAssignedBike(res);
      const now = new Date();
      const expiry = new Date(now.getTime() + 15 * 60 * 1000);

      const formattedExpiry = expiry.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setExpiryTimeStr(formattedExpiry);
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
    router.replace("/"); // go back to index
  };

  // define images mapping
  const dcs = require("@/src/assets/images/dcs.jpg");
  const cal = require("@/src/assets/images/cal.jpg");
  const im = require("@/src/assets/images/im.png");
  const vh = require("@/src/assets/images/vinzons.jpg");

  const rackImages: Record<string, any> = {
    rack123: dcs,
    rack456: im,
    rack789: cal,
    rackABC: vh,
  };

  useEffect(() => {
    updateRackId(rackID); // raising a problem, but works
    if (!rackID || typeof rackID !== "string") return;

    const fetchRackInfo = async () => {
      try {
        console.log("Getting rack:", rackID);
        const rackDoc = await getDoc(doc(db, "racks", rackID));
        if (!rackDoc.exists()) {
          console.error("[APP] Rack not found"); // PLACEHOLDER; modal/go back
          return;
        }

        const rackData = rackDoc.data();
        const bikesQuery = query(
          collection(db, "bikes"),
          where("rackId", "==", rackID)
        );
        const bikesSnapshot = await getDocs(bikesQuery);
        const bikes = bikesSnapshot.docs.map((doc) => doc.data());

        const availableCount = bikes.filter(
          (b) => b.status === "available"
        ).length;
        const reservedCount = bikes.filter(
          (b) => b.status === "reserved"
        ).length;
        const emptySlots = 5 - availableCount - reservedCount;

        setRackData({
          name: rackData.rackName,
          location: rackData.location,
          available: availableCount,
          reserved: reservedCount,
          empty: emptySlots,
          rackSlot: rackData.rackSlot,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchRackInfo();
  }, [rackID]);

  useEffect(() => {
    // prevent modal from reappearing if already set from a previous page
    setShowSuccessModal(false);
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title="Reserve"
        subtitle="Reserve a bike from this rack!"
        hasBack={true}
        prevCallback={handleBack}
      />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={globalStyles.title}>{rackData?.name}</Text>
        <View style={{ marginBottom: 25 }}>
          {rackID && rackImages[rackID] && (
            <Image
              source={rackImages[rackID]}
              style={{ width: "100%", height: 200, borderRadius: 10 }}
              resizeMode="cover"
            />
          )}
        </View>

        <Text style={globalStyles.subtitle}>Rack Status</Text>
        {rackData && <RackStatus {...rackData} />}

        <ReserveForm onReserve={handleReserve} />

        <LoadingModal showLoadingModal={showLoadingModal} />
        {rackData && (
          <SuccessModal
            title="Bike reserved successfully!"
            description1={`Please make sure to claim your bike from the ${rackData.location}.`}
            description2={`Reservation holds until ${expiryTimeStr}.`}
            showSuccessModal={showSuccessModal}
            onClose={handleCloseSuccessModal}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
