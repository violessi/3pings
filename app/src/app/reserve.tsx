import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "expo-router";
import { db } from "@/firebaseConfig";
import { Rack } from "@/src/components/types";

import globalStyles from "@/src/assets/styles";
import Header from "@/src/components/Header";
import RackStatus from "@/src/components/RackStatus";


export default function ReserveScreen() {

  const [rackData, setRackData] = useState<Rack | null>(null);
  const router = useRouter();  
  
  useEffect(() => {
    const fetchRackInfo = async () => {
      try {
        const rackID = "rack123"; // for a specific bike rack; hardcode first
        const totalSlots = 5;

        // fetch bike rack info
        // details/address from db = racks, fields = rack_name, location
        const rackDoc = await getDoc(doc(db, "racks", rackID));
        if (!rackDoc.exists()) {
          console.error("Rack not found");
          return;
        }

        const rackData = rackDoc.data();
        console.log("Rack Name:", rackData.location);

        // get rack slots info (based on bikes info)
        // taken from bike info (db = bikes) where the rack_id and bike status is stored
        const bikesQuery = query(
          collection(db, "bikes"),
          where("rack_id", "==", rackID)
        );
        const bikesSnapshot = await getDocs(bikesQuery); // get all bikes in that rack
        const bikes = bikesSnapshot.docs.map((doc) => doc.data());
        
        // # available means bikes where rack_id = rack specified and states = available
        // # reserved means bikes where rack_id = rack specified and states = reserved
        // # empty slots means 5 (number of slots) - number of bikes where rack_id = rack specified
        const availableCount = bikes.filter((b) => b.status === "available").length;
        const reservedCount = bikes.filter((b) => b.status === "reserved").length;
        const occupiedSlots = bikes.length; // # number of bikes in that rack
        const emptySlots = totalSlots - occupiedSlots - reservedCount;

        setRackData ({
          location: rackData.location,
          available: availableCount,
          reserved: reservedCount,
          empty: emptySlots,
        });

        console.log("Rack:", rackData.rack_name);
        console.log("Available:", availableCount);
        console.log("Reserved:", reservedCount);
        console.log("Empty slots:", emptySlots);
      } catch (error) {
          console.error("Error fetching racks:", error);
      }
    };
  
    fetchRackInfo();
  }, []);

  
  // handle reserve function
  const handleReserve = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/bikeActions/reserve", {
        method: "POST", // post to server to handle reservation request
      });
  
      if (res.ok) {
        Alert.alert("Bike reserved!");
        router.replace("/trips");
      } else {
        const { error } = await res.json();
        Alert.alert(error || "Error reserving bike");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };
  

  // return 3 segments: rack photo, rack status, reserve a bike container
  // reserving a bike has dropdown fields date, start time of reservation, and then reserve button
  // reserve button goes to backend handleReserve fucntion that adds a new trip doc but with status as reserved, which will be timed
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Reserve"/>
      <ScrollView
        contentContainerStyle={reserveStyles.container}
        showsVerticalScrollIndicator={false}
      >
      <Text style={globalStyles.title}> Rack Name </Text>
      <View style={reserveStyles.reserveCard}>
        <Text style={globalStyles.detail}> Map Photo </Text>
      </View>
      
      <Text style={globalStyles.subtitle}> Rack status </Text>
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
              onPress={() => {}}
              activeOpacity={0.8}
              >
              <Text style={reserveStyles.buttonText}>Select a Date</Text>
            </TouchableOpacity>
          </View>

          <View style={globalStyles.column}> 
            <Text style={globalStyles.detail}> Start Time </Text>
            <TouchableOpacity
              style={reserveStyles.placeholderPicker}
              onPress={() => {}}
              activeOpacity={0.8}
              >
              <Text style={reserveStyles.buttonText}>Select a Time</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={reserveStyles.reserveButton}
          onPress={() => {handleReserve}}
          activeOpacity={0.8}
        >
        <Text style={reserveStyles.buttonText}>Reserve</Text>
        </TouchableOpacity>

        <Text style={globalStyles.note}>Note: Your reservation will only hold for 15 mins! Bike will automatically be reverted to Available if not claimed.  </Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
});