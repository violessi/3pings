import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import TripCard from '../../components/TripCard'; // Import your TripCard component
import globalStyles from '../../assets/styles'; // Relative path to the styles.ts file

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // adjust the path based on your folder structure

// NEW TYPE for completedTrips
type CompletedTrip = {
  bikeID: string;
  startRack: string;
  endRack: string;
  startTime: string;
  endTime: string;
};

// TEMPORARY mocked current trip
const currentTrip = [
  { title: 'Downtown Tour 1', duration: '2 hours', distance: '10km', difficulty: 'Easy' },
];

export default function TripScreen() {
  // Fetch data
  const [completedTrips, setCompletedTrips] = useState<CompletedTrip[]>([]);

  useEffect(() => {
    const fetchCompletedTrips = async () => {
      try {
        const tripsCollection = collection(db, 'completedTrips');
        const tripSnapshot = await getDocs(tripsCollection);

        const trips: CompletedTrip[] = tripSnapshot.docs.map((doc) => doc.data() as CompletedTrip);

        console.log('Fetched completed trips:', trips);
        setCompletedTrips(trips);
      } catch (error) {
        console.error("Error fetching completed trips:", error);
      }
    };

    fetchCompletedTrips();
  }, []);

  // Return
  return (
    <View style={globalStyles.wrapper}>
    <ScrollView contentContainerStyle={globalStyles.container} showsVerticalScrollIndicator={false}>
        {/* Dynamically render bike trip cards */}
        <Text style={globalStyles.title}> Active</Text>
        {currentTrip.map((trip, index) => (
          <TripCard
            key={index}
            title={trip.title}
            duration={trip.duration}
            distance={trip.distance}
            difficulty={trip.difficulty}
          />
        ))}
        <Text style={globalStyles.title}> Completed</Text>
        {completedTrips.map((trip, index) => (
          <TripCard
            key={index}
            title={`Bike ${trip.bikeID}`}
            duration={`${trip.startTime.toDate().toLocaleString()} to ${trip.endTime.toDate().toLocaleString()}`}
            distance={`${trip.startRack} → ${trip.endRack}`}
            difficulty="N/A" // You can customize this or create a new component
          />
        ))}
    </ScrollView>
    </View>
  );
}