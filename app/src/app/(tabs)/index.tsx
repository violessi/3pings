import { useRouter } from "expo-router";
import { SafeAreaView, Text, View, TouchableOpacity } from "react-native";

import globalStyles from "@/src/assets/styles";
import Header from "@/src/components/Header";

export default function Index() {
  const router = useRouter();

  const handleSelectRack = (rackID: string) => {
    router.push({
      pathname: "/reserve",
      params: { rackID }, // dynamically pass the rackID
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <Header title="Map" subtitle="Check the bike racks near you!" />

      {/* add rack buttons/map here, send rackID (mathces db doc name) to handleSelectRack*/}

      <Text>Select a Rack:</Text>
      <TouchableOpacity onPress={() => handleSelectRack("rack123")}>
        <Text>Rack 123</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleSelectRack("rack456")}>
        <Text>Rack 456</Text>
      </TouchableOpacity>
     
    </SafeAreaView>
  );
}


// export default function Index() {
//   return (
//     <SafeAreaView className="flex-1">
//       <Header title="Map" subtitle="Check the bike racks near you!" />
//     </SafeAreaView>
//   );
// }

/*

import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://10.147.40.131:3000/api/hello") // Replace with your local IP
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <View style={{ padding: 50 }}>
      <Text>{message || "Loading..."}</Text>
    </View>
  );
}

*/