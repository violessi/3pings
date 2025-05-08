import { SafeAreaView, Text, View } from "react-native";

import globalStyles from "@/src/assets/styles";
import Header from "@/src/components/Header";

export default function Index() {
  return (
    <SafeAreaView className="flex-1">
      <Header title="Map" subtitle="Check the bike racks near you!" />
    </SafeAreaView>
  );
}

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