import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { TextInput } from "react-native-paper";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

import Header from "@/components/Header";
import Button from "@/components/Button";
import { useBike } from "@/context/BikeContext";
import LoadingModal from "@/components/LoadingModal";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import globalStyles from "@/src/assets/styles";
import { formatDate } from "@/src/service/tripService";

export default function Pay() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const {
    showSuccessModal,
    showErrorModal,
    setShowErrorModal,
    setShowSuccessModal,
    showLoadingModal,
    payForTrip,
  } = useBike();

  const [startString, setStartString]  = useState("");
  const [endString, setEndString]  = useState("");
  const [feeString, setFeeString]  = useState("");
  const [feeAddtlString, setAddtlString]  = useState("");
  const [finalFee, setFinalFee]       = useState(0);
  const [currentBalance, setBalance]  = useState(0);
  const [newBalance, setNewBalance]  = useState(0);

  useEffect(() => {
    if (!tripId) return;

    (async () => {
      // Trip
      const snap = await getDoc(doc(db, "trips", tripId));
      if (snap.exists()){
        const trip = snap.data();
        
        const startSnap = await getDoc(doc(db, "racks", trip.startRack));
        if(startSnap.exists()){
          const startName = startSnap.data().rackName;
          const startTime = formatDate(trip.startTime.toDate().toLocaleString());
          setStartString(`${startName}\n${startTime}\n`);
        }
        const endSnap = await getDoc(doc(db, "racks", trip.endRack));
        if(endSnap.exists()){
          const endName = endSnap.data().rackName;
          const endTime = formatDate(trip.endTime.toDate().toLocaleString());
          setEndString(`${endName}\n${endTime}`);
        }

        const durationMinutes = Math.ceil((trip.endTime.toDate() - trip.startTime.toDate()) / (1000 * 60));
        const baseFee = Math.ceil(durationMinutes / trip.rateInterval) * trip.baseRate;
        setFinalFee(trip.finalFee ?? 0);
        const feeString = `₱${trip.baseRate} / ${trip.rateInterval} mins x ${durationMinutes} mins = ₱${baseFee}`;
        setFeeString(feeString);

        if (trip.addtlCharge){
          setAddtlString(`LATE ₱${trip.addtlCharge}`);
        }
        else {
          setAddtlString(`NO LATE FEES`);
        }
        
      }
      // User balance 
      const userSnap = await getDoc(doc(db, "users", "user123"));
      if (userSnap.exists()){
        const user = userSnap.data();
        setBalance(user.balance ?? 0);
        setNewBalance(user.balance - finalFee);
      }
    })();
  }, [tripId]);

  const handleButtonPress = async () => {
    try {
      // payForTrip in BikeContext.tsx
      // calls handler for server calls in TripService.tsx
      await payForTrip(tripId, finalFee);
      setShowSuccessModal(true);
    } catch (err: any) {
      Alert.alert("Error!", err.message); // temporary; replace with modal
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.replace("/(tabs)/profile");
  };

  // .push() used to /pay
  // go back to page based on callstack
  const handleBack = () => {
    try {
      router.back();
    } catch (error) {
      router.replace("/payment");
    }
  };

  useEffect(() => {
    if (!tripId) return;

    (async () => {
      // Trip
      const snap = await getDoc(doc(db, "trips", tripId));
      if (snap.exists()) setFinalFee(snap.data().finalFee ?? 0);

      // User credits
      const userSnap = await getDoc(doc(db, "users", "user123"));
      if (userSnap.exists()) setTotalCred(userSnap.data().credits ?? 0);
    })();
  }, [tripId]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Pay for a Trip" hasBack={true} prevCallback={handleBack} />
      {/* show trip details */}
      <View className="px-4 py-2">
        <Text className="text-lg font-semibold mb-1">Trip Summary:</Text>
        <View className="px-4 py-2">
          <Text>Start :</Text>
          <Text>{startString}</Text>
        </View>
        <View className="px-4 py-2">
          <Text>End :</Text>
          <Text>{endString}</Text>
        </View>
      </View>

      {/* way to pay for trip, use credits, etc */}
      {/* set amount of credits to use, max allowable = total credits OR finalFee*/}
      {/* i think need to set minusCredits and minusBalance on button press... but also go to payForTrip() with payload*/}
      {/* set minusCredits = amount set by user; set minusBalance = diff of finalFee and minusCredits*/}
      
      <View className="px-4 mt-4">
        <Text className="font-medium">Payment Breakdown:</Text>
        <Text>{feeString}</Text>
        <Text>{feeAddtlString}</Text>
        <Text>Total Fee: ₱{finalFee}</Text>
      </View>

      <View className="px-4 py-2">
        <Text >Current Balance: {currentBalance}</Text>
        <Text >New Balance: {newBalance}</Text>
      </View>

      <View className="px-4 mt-4">
        <TouchableOpacity onPress={handleButtonPress} style={styles.payButton}>
          <Text style={styles.payText}>Pay</Text>
        </TouchableOpacity>
      </View>

      {/* loading, success, and error modal */}
      <LoadingModal showLoadingModal={showLoadingModal} />
      <SuccessModal title="Successful Payment" showSuccessModal={showSuccessModal} onClose={handleCloseSuccessModal} />
      <ErrorModal title="Error" showErrorModal={showErrorModal} onClose={() => setShowErrorModal(false)} /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  payButton: {
    backgroundColor: "#EFC89B",
    borderColor: "#A35700",
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
