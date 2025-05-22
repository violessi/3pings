import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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
import { Card } from "@/src/components/Card";

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

  const [startString, setStartString] = useState("");
  const [endString, setEndString] = useState("");
  const [feeString, setFeeString] = useState("");
  const [feeAddtlString, setAddtlString] = useState("");
  const [finalFee, setFinalFee] = useState(0);
  const [currentBalance, setBalance] = useState(0);
  const [newBalance, setNewBalance] = useState(0);

  const [errorString, setErrorString] = useState("");

  const handleButtonPress = async () => {
    try {
      // payForTrip in BikeContext.tsx
      // calls handler for server calls in TripService.tsx
      const res = await payForTrip(tripId, finalFee);
      console.log(res);
      setShowSuccessModal(true);
    } catch (err: any) {
      setErrorString(err.error);
      setShowErrorModal(true);
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
      if (snap.exists()) {
        const trip = snap.data();

        const startSnap = await getDoc(doc(db, "racks", trip.startRack));
        if (startSnap.exists()) {
          const startName = startSnap.data().rackName;
          const startTime = formatDate(
            trip.startTime.toDate());
          setStartString(`${startName}\n${startTime}\n`);
        }
        const endSnap = await getDoc(doc(db, "racks", trip.endRack));
        if (endSnap.exists()) {
          const endName = endSnap.data().rackName;
          const endTime = formatDate(trip.endTime.toDate());
          setEndString(`${endName}\n${endTime}`);
        }

        const durationMinutes = Math.ceil(
          (trip.endTime.toDate() - trip.startTime.toDate()) / (1000 * 60)
        );
        const baseFee =
          Math.ceil(durationMinutes / trip.rateInterval) * trip.baseRate;
        const feeString = `₱${trip.baseRate} / ${trip.rateInterval} mins x ${durationMinutes} mins = ₱${baseFee}`;
        setFinalFee(trip.finalFee ?? 0);
        setFeeString(feeString);

        if (trip.addtlCharge) {
          setAddtlString(`Late fee: ₱${trip.addtlCharge}`);
        } else {
          setAddtlString(`No late fee`);
        }
      }
      // User balance
      const userSnap = await getDoc(doc(db, "users", "user123"));
      if (userSnap.exists()) {
        const user = userSnap.data();
        setBalance(user.balance ?? 0);
        setNewBalance(user.balance - finalFee);
      }
    })();
  }, [tripId]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Pay for a Trip" hasBack={true} prevCallback={handleBack} />
      <ScrollView
        contentContainerStyle={globalStyles.container}
        showsVerticalScrollIndicator={false}
      >
      {/* show trip details */}
      <Card style={{backgroundColor: "#fff"}}>
        <Text className="text-lg font-semibold text-gray-800 mb-3">🚴 Trip Summary</Text>
        
        <View className="flex-row mb-2">
          <Text className="text-sm font-medium text-gray-800">Start Time:</Text>
          <Text className="text-sm text-gray-600 ml-5">{startString}</Text>
        </View>

        <View className="flex-row">
          <Text className="text-sm font-medium text-gray-800">End Time:</Text>
          <Text className="text-sm text-gray-600 ml-7">{endString}</Text>
        </View>
      </Card>

      {/* payment breakdown */}
      <Card style={{backgroundColor: "#fff"}}>
        <Text className="text-lg font-semibold text-gray-800 mb-3">💰 Payment Breakdown</Text>
        
        <View className="mb-1">
          <Text className="text-sm text-gray-600">{feeString}</Text>
          <Text className="text-sm text-gray-600">{feeAddtlString}</Text>
        </View>

        <Text className="text-base font-bold text-gray-900 mt-2">Total Fee: ₱{finalFee}</Text>
      </Card>

      {/* balance update */}
      <Card style={{backgroundColor: "#fff"}}>
        <Text className="text-lg font-semibold text-gray-800 mb-3">🧾 Wallet</Text>
          <View className="flex-row justify-between mb-1">
            <Text className="text-sm font-medium text-gray-800">Current Balance:</Text>
            <Text className="text-sm text-gray-600">₱{currentBalance}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-sm font-medium text-gray-800">New Balance:</Text>
            <Text className="text-sm text-gray-600">₱{newBalance}</Text>
          </View>
      </Card>

      <View className="px-4 mt-4">
        <TouchableOpacity onPress={handleButtonPress} style={styles.payButton}>
          <Text style={styles.payText}>Pay</Text>
        </TouchableOpacity>
      </View>

      {/* loading, success, and error modal */}
      <LoadingModal showLoadingModal={showLoadingModal} />
      <SuccessModal
        title="Payment Successful"
        showSuccessModal={showSuccessModal}
        onClose={handleCloseSuccessModal}
      />
      <ErrorModal
        title="Error"
        description={errorString}
        showErrorModal={showErrorModal}
        onClose={() => setShowErrorModal(false)}
      />
    </ScrollView>
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
