import { useState , useEffect } from "react";
import { SafeAreaView, View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
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

  const [finalFee, setFinalFee]       = useState(0);
  const [totalCredits, setTotalCred]  = useState(0);   // pull from user doc if needed
  const [creditInput, setCreditInput] = useState("");

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

  const [minusCredits, setMinusCredits] = useState(0);
  const [minusBalance, setMinusBalance] = useState(0);

  const handleCreditChange = (text: string) => {
    const parsed = parseFloat(text) || 0;
    // maximum allowable credits to use is the min of input, total credits, or the finalfee
    const useCredits = Math.min(parsed, totalCredits, finalFee);
    setMinusCredits(useCredits);
    setMinusBalance(finalFee - useCredits);
    setCreditInput(text);
  };
  
  const handleButtonPress = async () => {
    try {
      // payForTrip in BikeContext.tsx
      // calls handler for server calls in TripService.tsx
      await payForTrip(tripId, minusCredits, minusBalance);
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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title="Pay for a Trip"
        hasBack={true}
        prevCallback={handleBack}
      />
      {/* show trip details */}
      <View className="px-4 py-2">
        <Text className="text-lg font-semibold mb-1">Trip Summary:</Text>
        <Text>Total Fee: ₱{finalFee.toFixed(2)}</Text>
        <Text>Available Spin Credits: {totalCredits}</Text>
      </View>

      {/* way to pay for trip, use credits, etc */}
      {/* set amount of credits to use, max allowable = total credits OR finalFee*/}
      {/* i think need to set minusCredits and minusBalance on button press... but also go to payForTrip() with payload*/}
      {/* set minusCredits = amount set by user; set minusBalance = diff of finalFee and minusCredits*/}
      <View className="px-4 mt-2">
        <Text className="mb-1">Enter credits to use:</Text>
        <TextInput
          value={creditInput}
          onChangeText={handleCreditChange}
          mode="outlined"
          keyboardType="numeric"
          placeholder="e.g., 5"
          textColor="black"
          outlineColor="#7E7E7E"
          activeOutlineColor="#7E7E7E"
          style={{ backgroundColor: "white" }}
        />
      </View>
      <View className="px-4 mt-4">
        <Text className="font-medium">Payment Breakdown:</Text>
        <Text>Using Credits: {minusCredits}</Text>
        <Text>Balance Deduction: ₱{finalFee - minusCredits}</Text>
        <Text style={globalStyles.note}>You can avail up to either you total credits</Text>
      </View>
      <View className="px-4 mt-4">
        <TouchableOpacity onPress={handleButtonPress} style={styles.payButton}>
          <Text style={styles.payText}>Pay</Text>
        </TouchableOpacity>
      </View>

      
      {/* loading, success, and error modal */}
      {/* <LoadingModal visible={showLoadingModal} />
      <SuccessModal visible={showSuccessModal} onClose={handleCloseSuccessModal} />
      <ErrorModal visible={showErrorModal} onClose={() => setShowErrorModal(false)} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
