import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import TripCard from '../../components/TripCard';
import globalStyles from '../../assets/styles';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Trip } from '../../components/types';

export default function TripScreen() {
  const [completedTrips, setCompletedTrips] = useState<Trip[]>([]);
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);

  // Fetch data

  useEffect(() => {
    const fetchActiveTrips = async () => {
      try {
        const activeCollection = collection(db, 'activeTrips');
        const activeSnapshot = await getDocs(activeCollection);
        const trips: Trip[] = activeSnapshot.docs.map((doc) => doc.data() as Trip);
        setActiveTrips(trips);
        console.log('Fetched active trips:', trips);
      } catch (error) {
        console.error('Error fetching active trips:', error);
      }
    };

    fetchActiveTrips();
  }, []);

  useEffect(() => {
    const fetchCompletedTrips = async () => {
      try {
        const tripsCollection = collection(db, 'completedTrips');
        const tripSnapshot = await getDocs(tripsCollection);

        const trips: Trip[] = tripSnapshot.docs.map((doc) => doc.data() as Trip);

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
        <Text style={globalStyles.title}> Active </Text>
        {activeTrips.map((trip, index) => (
          <TripCard
            key={index}
            title={`${trip.startRack}`}
            bikeID={`Bike ${trip.bikeID}`}
            tripStart={`${trip.startTime.toDate().toLocaleString()}`}
            tripEnd=""
            remarks={`${trip.status}`} // change to bike status once db for bikes ready (reserved | in use | overtime)
          />
        ))}
        <Text style={globalStyles.title}> Completed </Text>
        {completedTrips.map((trip, index) => (
          <TripCard
            key={index}
            title={`${trip.startRack} to ${trip.endRack}`}
            bikeID={`Bike ${trip.bikeID}`}
            tripStart={`${trip.startTime.toDate().toLocaleString()}`}
            tripEnd={`${trip.endTime.toDate().toLocaleString()}`}
            remarks={`${trip.status}`} // change to bike status once db for bikes ready (paid | unpaid)
          />
        ))}
    </ScrollView>
    </View>
  );
}