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
