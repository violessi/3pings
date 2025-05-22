import React, { useState, useEffect } from "react";
import { Text, ScrollView, View, SafeAreaView, StyleSheet, TouchableOpacity} from "react-native";
import Header from "@/src/components/Header";
import globalStyles from "@/src/assets/styles";

import Button from "@/components/Button";
import { useBike } from "@/context/BikeContext";
import { useRouter } from "expo-router";
import { collection, getDocs , doc, getDoc, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function Rent() {
  const router = useRouter();
  const {
    showSuccessModal,
    showErrorModal,
    setShowErrorModal,
    setShowSuccessModal,
    showLoadingModal,
  } = useBike();

  const handlePay = (tripId: string) => {
    router.push({           
        pathname: "/payment/pay",
        params: { tripId },   // becomes /payment/pay?tripId=abc123
    });
  };

  const handleBack = () => {
    router.replace("/(tabs)/profile");
  };

  const userId = "user123";
  const [trips, setTrips] = useState<any[]>([]);
  const [pendingFees, setPendingFees] = useState(0);

  // fetch trips for pending fees summary
  useEffect(() => {
    const fetchTrips = async () => {
      if (!userId) return;

      try {
        const tripsQuery = query(
          collection(db, "trips"),
          where("userId", "==", userId),
          where("status", "==", "completed"),
          where("paid", "==", false)
        );
        const querySnapshot = await getDocs(tripsQuery);

        const tripsData: any[] = [];
        let totalFees = 0;

        for (const docSnap of querySnapshot.docs) {
          const trip = docSnap.data();
          const tripId = docSnap.id;

          // get rack name based on trip.startRack
          let rackName = "";
          if (trip.startRack) {
            try {
              const rackSnap = await getDoc(doc(db, "racks", trip.startRack));
              if (rackSnap.exists()) {
                const rackData = rackSnap.data();
                rackName = rackData.rackName || "";
              }
            } catch (rackError) {
              console.warn("Error fetching rack data:", rackError);
            }
          }

          tripsData.push({
            id: tripId,
            ...trip,
            startRackName: rackName,
          });

          totalFees += trip.finalFee || 0; // handle undefined finalFare
        }
        setPendingFees(totalFees);
        setTrips(tripsData);

      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, [userId]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title="Pending Fees"
        subtitle="Click to pay for a trip"
        hasBack={true}
        prevCallback={handleBack}
      />
      <ScrollView
        contentContainerStyle={globalStyles.container}
        showsVerticalScrollIndicator={false}
      >
      
      {/* show list of trips with pending fees, each with a button to pay to the right */}
      {/* button goes to /payment/pay; consider if will pass tripid? */}
      <Text className="text-base font-semibold text-gray-800">Total Pending Fees: ₱{pendingFees}</Text>
      <Text className="text-sm text-gray-500 text-center">You are not allowed to Rent a bike with pending fees of more than ₱50.</Text>
     
      <View className="mt-4 space-y-2 w-full">
        {trips.map((trip) => (
          <View key={trip.id} style={styles.tripRow}>
            <View style={styles.tripText}>
              <Text className="text-sm font-bold text-gray-700">
                Trip {new Date(trip.startTime.seconds * 1000).toLocaleDateString()} from {trip.startRackName}
              </Text>
              <Text className="text-sm text-gray-500">₱{trip.finalFee}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handlePay(trip.id)}
              style={styles.payButton}
              >
              <Text style={styles.payText}>Pay</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tripRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },
  tripText: {
    flexDirection: "column",
  },
  payButton: {
    backgroundColor: "#EFC89B",
    borderColor: "#A35700" ,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  payText: {
    color: "#A35700",
    fontWeight: "600",
  },
});
