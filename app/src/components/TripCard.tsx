import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import globalStyles from "@/src/assets/styles";
import { useRouter } from "expo-router";
import { useBike } from "@/context/BikeContext";
import LoadingModal from "./LoadingModal";

// fields and style of trip card 
// displayed in trips page

type TripCardProps = {
  tripID: string;
  title: string;
  bikeID: string;
  tripStart: string;
  tripEnd: string;
  remarks: string;
  finalFee?: number;
  startRack: string;
  endRack: string;
  paid?: boolean;
  onTripCancelled?: () => void;
  onCancelError?: (message: string) => void;
};

export default function TripCard({
  tripID,
  title,
  bikeID,
  tripStart,
  tripEnd,
  remarks,
  finalFee,
  startRack,
  endRack,
  paid,
  onTripCancelled,
  onCancelError,
}: TripCardProps) {
  const statusStyles = getStatusStyles(remarks, finalFee, paid); // remarks = status string
  const router = useRouter(); 
  
  const {
    rackId,
    showSuccessModal,
    showErrorModal,
    setShowErrorModal,
    setShowSuccessModal,
    updateRackId,
    rentABike,
    reserveABike,
    cancelReservation,
    getRackNameById
  } = useBike();

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  
  const handleCancel = async () => {
    try {
      if (!tripID){
        console.error("No tripId passed to TripCard!");
        return;
      }
      setShowLoadingModal(true);
      const res = await cancelReservation(tripID);
      updateRackId("");
      console.log("Cancelled.");
      onTripCancelled?.();
    } catch (err: any) {
      console.log("Error!", err.message); // PLACEHOLDER; replace with modal
      onCancelError?.("Failed to cancel reservation. Please try again.");
    } finally {
      setShowLoadingModal(false);
    }
  };

  const [startRackName, setStartRackName] = useState(startRack);
  const [endRackName, setEndRackName] = useState(endRack);

  useEffect(() => {
    const fetchRackNames = async () => {
      const startName = await getRackNameById(startRack);
      const endName = await getRackNameById(endRack);
      setStartRackName(startName);
      setEndRackName(endName);
    };
    fetchRackNames();
  }, [startRack, endRack]);

  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.subtitle}>{title} {startRackName}</Text>

      <View style={globalStyles.row}>
        {/*Left*/}
        <View style={globalStyles.column}>
          <Text style={tripStyles.label}>Start: </Text>
          <Text style={tripStyles.detail}>{tripStart}</Text>
          <Text style={tripStyles.label}>End: </Text>
          <Text style={tripStyles.detail}>{tripEnd}</Text>
        </View>

        {/*Right*/}
        <View style={globalStyles.column}>
          <Text style={tripStyles.label}> From: </Text>
          <Text style={tripStyles.detail}>{startRackName}{rackId}</Text>
          <Text style={tripStyles.label}> To: </Text>
          <Text style={tripStyles.detail}>{endRackName}</Text>
        </View>
      </View>
      
      <View style={globalStyles.row}>
        {/*Left*/}
        <View style={[globalStyles.column, { alignItems: 'flex-start' }]}>
          { (remarks != 'reserved') && ( // display status if not reserved
            <View style={[globalStyles.statusBox, statusStyles.container]}>
              <Text style={[{ fontWeight: '600' }, {textTransform: 'capitalize'}, statusStyles.text]}>
                { paid
                ? 'Paid'
                : (finalFee && finalFee > 0 
                ? 'Balance: Php ' + finalFee 
                : remarks)} 
              </Text>
            </View>
          )}
        </View>

        {/*Right*/}
        <View style={[globalStyles.column, { alignItems: 'flex-end' }]}> 
          { !paid && (remarks == "completed") && ( // penalty information
            <TouchableOpacity
              style={[globalStyles.statusBox, {backgroundColor: '#e2e3e5'}]}
              onPress={() => router.push('/payment/pay')} // go to profile
              activeOpacity={0.8}
              >
              <Text>Pay</Text>
            </TouchableOpacity>
          )}
          { remarks === 'active' && ( // nearest rack to me 
            <TouchableOpacity
              style={[globalStyles.statusBox, {backgroundColor: '#e2e3e5'}]}
              onPress={() => router.replace('/')} // go to maps?
              activeOpacity={0.8}
              >
              <Text>View racks</Text>
            </TouchableOpacity>
          )}
          { remarks === 'reserved' && ( // cancel reservation 
            <TouchableOpacity
              style={[globalStyles.statusBox, {backgroundColor: '#e2e3e5'}]}
              onPress={() => {handleCancel();}} // handle cancel reservation
              activeOpacity={0.8}
              >
              <Text>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <LoadingModal showLoadingModal={showLoadingModal} />
      
    </View>
  );
}

const tripStyles = StyleSheet.create({
  detail: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  status: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
});

// diff colored status boxes
const getStatusStyles = (status: string, addtlCharge?: number, paid?: boolean) => {
  if ((addtlCharge && addtlCharge > 0) && !paid ) {
    return { //case: overdue
      container: {
        backgroundColor: '#f8d7da',
        borderColor: '#721c24',
      },
      text: {
        color: '#721c24',
      },
    };
  }
  
  switch (status.toLowerCase()) {
    case 'active': // yellow
      return {
        container: {
          backgroundColor: '#fff3cd',
          borderColor: '#856404',
        },
        text: {
          color: '#856404',
        },
      };
    case 'completed': // green
      return {
        container: {
          backgroundColor: '#d4edda',
          borderColor: '#155724',
        },
        text: {
          color: '#155724',
        },
      };
    default:
      return {
        container: {
          backgroundColor: '#fff',
          borderColor: '#6c757d',
        },
        text: {
          color: '#6c757d',
        },
      };
  }
};