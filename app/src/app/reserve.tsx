
import { SafeAreaView, Text, View } from "react-native";

import globalStyles from "@/src/assets/styles";
import Header from "@/src/components/Header";

// for a specific bike rack 

export default function ViewRack() {

  // fetch bike rack status
  // details/address from db = racks, fields = rack_name, location
  // # available, # reserved, # empty slots
  // taken from bike info (db = bikes) where the rack_id and bike status is stored
  // so # available means bikes where rack_id = rack specified and states = available
  // # reserved means bikes where rack_id = rack specified and states = reserved
  // # empty slots means 5 (number of slots) - number of bikes where rack_id = rack specified


  // return 3 containers(?) or segments: rack photo, rack status, reserve a bike container
  // reserving a bike has dropdown fields date, start time of reservation, and then reserve button
  // reserve button goes to backend handleReserve fucntion that adds a new trip doc but with status as reserved, which will be timed
  return (
    <SafeAreaView className="flex-1">
      <Header title="Map" subtitle="Check the bike racks near you!" />
    </SafeAreaView>
  );
}