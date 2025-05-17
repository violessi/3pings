import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useRouter, useLocalSearchParams   } from "expo-router";
import { db } from "@/firebaseConfig";

import globalStyles from "@/src/assets/styles";
import Header from "@/src/components/Header";
import LoadingModal from "@/components/LoadingModal";
import SuccessModal from "@/components/SuccessModal";

// handling multiple racks
import { Rack } from "@/src/components/types";
import RackStatus from "@/src/components/RackStatus";
import RackInput from "@/components/RackInput";

// assign bike
import { useBike } from "@/context/BikeContext";

export default function Reserve({ params }: { params: { rackID: string } }) {
  const router = useRouter();    

  // for bike-related functions 
  const {
    rackId,
    showSuccessModal,
    showErrorModal,
    setShowErrorModal,
    setShowSuccessModal,
    showLoadingModal,
    updateRackId,
    rentABike,
    reserveABike
  } = useBike();
  const [assignedBike, setAssignedBike] = useState<Bike | null>(null);

  // for getting current rack info; rack is input parameter to reserve function
  const { rackID } = useLocalSearchParams(); // get rackID from parameters of calling reserve
  const [rackData, setRackData] = useState<Rack | null>(null);
  
  // for date and time; date and time is posted to server 
  const selectedDate = new Date(); // Reserves from current time
  
  // handler functions
  const handleButtonPress = async () => {
    try {
      const res = await reserveABike(selectedDate);
      setAssignedBike(res);
    } catch (err: any) {
      console.log("[CHECK] Error!", err.message); // PLACEHOLDER
    }
  }; 
  
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.replace("/(tabs)/action");
  };

  const handleBack = () => {
    updateRackId(""); 
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  // fetch rack info to display in card
  useEffect(() => {
    updateRackId(rackID); // raising a problem, but works

    const fetchRackInfo = async () => {
      if (!rackID || typeof rackID !== "string") return;

      try {
        const totalSlots = 5; // PLACEHOLDER; HARDCODED

        // fetch bike rack info
        const rackDoc = await getDoc(doc(db, "racks", rackID));
        if (!rackDoc.exists()) {
          console.error("[APP] Rack not found"); // PLACEHOLDER; modal/go back
          return;
        }
        const rackData = rackDoc.data();
        console.log("Rack Name:", rackData.location);

        // get rack slots info
        // taken from bike info (db = bikes) where the rack_id and bike status is stored
        const bikesQuery = query(
          collection(db, "bikes"),
          where("rackId", "==", rackID)
        );
        const bikesSnapshot = await getDocs(bikesQuery); // get all bikes in that rack
        const bikes = bikesSnapshot.docs.map((doc) => doc.data());
        
        // # available => bikes where rack_id = rack specified && status = available
        // # reserved => bikes where rack_id = rack specified && status = reserved
        // # empty => 5 (number of slots) - number of bikes where rack_id = rack specified
        const availableCount = bikes.filter((b) => b.status === "available").length;
        const reservedCount = bikes.filter((b) => b.status === "reserved").length;
        const occupiedSlots = bikes.length; // # number of bikes in that rack
        const emptySlots = totalSlots - availableCount - reservedCount;

        setRackData ({
          name: rackData.rack_name,
          location: rackData.location,
          available: availableCount,
          reserved: reservedCount,
          empty: emptySlots,
        });

        console.log("[APP] Rack:", rackData.rack_name);
        console.log("[APP] Available:", availableCount);
        console.log("[APP] Reserved:", reservedCount);
        console.log("[APP] Empty slots:", emptySlots);
      } catch (error) {
        console.error("[APP] Error fetching racks:", error);
      }
    };
  
    fetchRackInfo();
  }, [rackID]);

  // return 3 segments: rack photo, rack status, reserve a bike container
  // reserving a bike has dropdown fields date, start time of reservation, and then reserve button
  // reserve button goes to backend handleReserve fucntion that adds a new trip doc but with status as reserved, which will be timed
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header 
        title="Reserve"
        subtitle="Reserve a bike from this rack!"
        hasBack={true}
        prevCallback={handleBack}
      />
      <ScrollView
        contentContainerStyle={reserveStyles.container}
        showsVerticalScrollIndicator={false}
      >
      <Text style={globalStyles.title}> {rackData && rackData.name} </Text>
      <View style={reserveStyles.reserveCard}>
        <Text style={globalStyles.detail}> Map Photo </Text>
      </View>
      
      <Text style={globalStyles.subtitle}> Rack Status </Text>
      {rackData && (
        <RackStatus
          location={rackData.location}
          available={rackData.available}
          reserved={rackData.reserved}
          empty={rackData.empty}
        />
      )}
      
      <View style={reserveStyles.reserveCard}>
        <Text style={globalStyles.subtitle}> Reserve a Bike </Text>
        <View style={globalStyles.row}>
          <View style={globalStyles.column}> 
            <Text style={globalStyles.detail}> Date </Text>
            <TouchableOpacity
              style={reserveStyles.placeholderPicker}
              onPress={() => {}} // PLACEHOLDER
              activeOpacity={0.8}
              >
              <Text style={reserveStyles.buttonText}>Select a Date</Text>
            </TouchableOpacity>
          </View>

          <View style={globalStyles.column}> 
            <Text style={globalStyles.detail}> Start Time </Text>
            <TouchableOpacity
              style={reserveStyles.placeholderPicker}
              onPress={() => {}} // PLACEHOLDER
              activeOpacity={0.8}
              >
              <Text style={reserveStyles.buttonText}>Select a Time</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={reserveStyles.reserveButton}
          onPress={() => {
            handleButtonPress();
          }}
          activeOpacity={0.8}
        >
        <Text style={reserveStyles.buttonText}>Reserve</Text>
        </TouchableOpacity>
        
        <Text style={globalStyles.note}>Note: Your reservation will only hold for 15 mins! Bike will automatically be reverted to Available if not claimed.  </Text>

        <LoadingModal showLoadingModal={showLoadingModal} />
        <SuccessModal
          title="Bike reserved successfully!"
          description1={`Please make sure to claim your bike from slot ${assignedBike?.rackSlot} at this rack.`}
          description2="Your reservation will only hold for 15 mins! Bike will automatically be made available if not claimed."
          showSuccessModal={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false); // Hide modal
            router.replace("/action"); // Or navigate to any route (e.g. router.push("/home"))
          }}
        />
      </View>


      </ScrollView>
      
    </SafeAreaView>
  );
}

const reserveStyles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    backgroundColor: '#F2F2F2',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    padding: 20,
  },
  reserveCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  reserveButton: {
    backgroundColor: '#362C5F',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  placeholderPicker: {
    backgroundColor: '#A9A9A9',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
    padding: 8,
  },
});