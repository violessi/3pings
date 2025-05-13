import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#362C5F",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          paddingTop: 4,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="action"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name={
                focused ? "star" : "staro"
              }
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Maps",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "map" : "map-outline"
              }
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Trips",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={
                focused ? "pedal-bike" : "pedal-bike"
              }
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name={
                focused ? "smile-circle" : "smileo"
              }
              color={color}
              size={22}
            />
          ),
        }}
      />
    </Tabs>
  );
}
