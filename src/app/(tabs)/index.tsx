import { Text, View, Button, StyleSheet, Alert } from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

import globalStyles from "@/src/assets/styles";

export default function Index() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.text}>Map and racks screen</Text>
    </View>
  );
}
