import React, { useState, useEffect } from "react";
import { Text, ScrollView, View, SafeAreaView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Header from "@/src/components/Header";
import globalStyles from "@/src/assets/styles";

import { useRouter } from "expo-router";
import { collection, getDocs , doc, getDoc, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Card } from "@/src/components/Card";
import { resetDatabase, unpayDemotrip3} from "@/service/admin";
import LoadingModal from "@/src/components/LoadingModal";
import SuccessModal from "@/src/components/SuccessModal";
import { useBike } from "@/src/context/BikeContext";

export default function ProfileScreen() {
  const router = useRouter();
  const userId = "user123";

  const [userData, setUserData] = useState<any>(null);
  const [rewardsData, setRewardsData] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [pendingFees, setPendingFees] = useState(0);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { setRefreshTripsFlag } = useBike();

  const handleReset = async () => {
    setShowLoadingModal(true);

    try {
      const res = await resetDatabase();
      setShowLoadingModal(false); 
      setShowSuccessModal(true);
      setRefreshTripsFlag((prev) => !prev);
    } catch (err: any) {
      setShowLoadingModal(false);
      console.log("Error!", err.message); // temporary; replace with modal
    }
  };

    const handleUnpay3 = async () => {
    try {
      const res = await unpayDemotrip3();
    } catch (err: any) {
      console.log("Error!", err.message); // temporary; replace with modal
    }
  };

  // fetch user profile + reward details for rewards summary
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        // fetch user data
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;

        const userInfo = userSnap.data();
        setUserData(userInfo);
        setTotalCredits(userInfo.credits || 0); // fallback to 0 if not defined

        // get the 3 most recent claimed rewards
        const rewardIds = userInfo.rewards || [];
        const rewardDocs: any[] = [];

        for (let id of rewardIds) {
          const rewardRef = doc(db, "rewards", id);
          const rewardSnap = await getDoc(rewardRef);
          if (rewardSnap.exists()) {
            rewardDocs.push({ id, ...rewardSnap.data() });
          }
        }

        // sort and get top 3
        rewardDocs.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() ?? 0;
          const bTime = b.createdAt?.toMillis?.() ?? 0;
          return bTime - aTime;
        });
        const recentRewards = rewardDocs.slice(0, 3);

        setRewardsData(recentRewards);

      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

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

        querySnapshot.forEach((doc) => {
          const trip = doc.data();
          tripsData.push({ id: doc.id, ...trip });
          totalFees += trip.finalFee || 0; // handle undefined finalFare
        });
        setPendingFees(totalFees);

        // get 3 most recent
        tripsData.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() ?? 0;
          const bTime = b.createdAt?.toMillis?.() ?? 0;
          return bTime - aTime;
        });
        const recentTrips = tripsData.slice(0, 3);

        setTrips(recentTrips);

      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, [userId]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Profile" subtitle="Check your profile!" />
      <ScrollView
        contentContainerStyle={globalStyles.container}
        showsVerticalScrollIndicator={false}
      >
      
      {/* see user information; no functions yet */}
      {/*<Text style={globalStyles.title}> Profile </Text>*/}
      <Card style={{backgroundColor: "#362C5F"}} activeOpacity={1}>
        {userData && (
            <View key={userData.id} className="pr-2 pb-2">
              <Text className="text-lg font-semibold text-white">User Name</Text>
              <Text className="text-sm text-white">  Username: {userData.username}</Text>
              <Text className="text-sm text-white">  Student Number: {userData.id}</Text>
              <Text className="text-sm text-white">  Email: {userData.email}</Text>
              <Text className="text-lg font-semibold text-white">Balance: {userData.balance}</Text>
            </View>
        )}
      </Card>

      {/* show total fees and list view most recent trips */}
      {/* 'see more' -> clicking goes to a full page to view and pay */}
      <Text style={globalStyles.title}> Pending Fees </Text>
      <Card onPress={() => router.push("../payment")} style={{backgroundColor: "#fff"}}>
        <Text className="text-base font-semibold text-gray-800">Total Pending Fees: ₱{pendingFees}</Text>
        <View className="mt-2">
          {trips.map((trip) => (
            <Text key={trip.id} className="text-sm text-gray-600">
              🚲 {new Date(trip.startTime.seconds * 1000).toLocaleDateString()} - ₱{trip.finalFee}
            </Text>
          ))}
        </View>
        <Text className="text-sm mt-4" style={{color: "#cccfcd"}}>Check and pay late fees</Text>
      </Card>

      {/* show total credits* and list preview rewards */}
      {/* 'see more' -> clicking goes to a full page to view */}
      {/* add total credits (not necessarily same as total of rewards), so outside card */}

      <Text style={globalStyles.title}> Demo Functions </Text>
      <TouchableOpacity onPress={() => handleReset()}>
        <Text>Reset Demo</Text>
      </TouchableOpacity>
      
      <Text className="text-sm mt-4" style={{color: "#cccfcd"}}>See all rewards</Text>
      
      <LoadingModal showLoadingModal={showLoadingModal} />
      <SuccessModal
        title="Reset successful!"
        description1="You're ready for a demo."
        showSuccessModal={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.replace("/action"); // or use push/pop if needed
        }}
      />


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
});