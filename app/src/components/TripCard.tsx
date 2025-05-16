import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import globalStyles from "@/src/assets/styles";
import { useRouter } from "expo-router";
import { useBike } from "@/context/BikeContext";

// fields and style of trip card 
// displayed in trips page

type TripCardProps = {
  tripID: string;
  title: string;
  bikeID: string;
  tripStart: string;
  tripEnd: string;
  remarks: string;
  addtl_charge?: number;
};

export default function TripCard({
  tripID,
  title,
  bikeID,
  tripStart,
  tripEnd,
  remarks,
  addtl_charge,
}: TripCardProps) {
  const statusStyles = getStatusStyles(remarks, addtl_charge); // remarks = status string
  const router = useRouter(); 
  
  const {
    rackId,
    showSuccessModal,
    showErrorModal,
    setShowErrorModal,
    setShowSuccessModal,
    showLoadingModal,
    updateRackId,
    rentABike,
    reserveABike,
    cancelReservation
  } = useBike();

  const handleCancel = async () => {
    try {
      if (!tripID){
        console.error("No tripId passed to TripCard!");
        return;
      }
      const res = await cancelReservation(tripID);
      updateRackId("");
      console.log("Cancelled.");
    } catch (err: any) {
      console.log("Error!", err.message); // PLACEHOLDER; replace with modal
    }
  };

  // optional: release button in reserved card
  // const handleRelease = async () => {
  //   try {
  //     updateRackId(rackId);
  //     console.log("Release from rack:", rackId);
  //     const res = await rentABike();
  //   } catch (err: any) {
  //     console.log("Error!", err.message); // temporary; replace with modal
  //   }    
  // };

  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.subtitle}>{title}</Text>

      <View style={globalStyles.row}>
        {/*Left*/}
        <View style={globalStyles.column}>
          <Text style={tripStyles.label}>Trip Start: </Text>
          <Text style={tripStyles.detail}>{formatDate(tripStart)}</Text>
          <Text style={tripStyles.label}>Trip End: </Text>
          <Text style={tripStyles.detail}>{formatDate(tripEnd)}</Text>
        </View>

        {/*Right*/}
        <View style={globalStyles.column}>
          <Text style={tripStyles.label}> From: </Text>
          <Text style={tripStyles.detail}> Start Rack</Text>
          <Text style={tripStyles.label}> To: </Text>
          <Text style={tripStyles.detail}> End Rack</Text>
        </View>
      </View>
      
      <View style={globalStyles.row}>
        {/*Left*/}
        <View style={[globalStyles.column, { alignItems: 'flex-start' }]}>
          { remarks != 'reserved' && ( // display status if not reserved
            <View style={[globalStyles.statusBox, statusStyles.container]}>
              <Text style={[{ fontWeight: '600' }, {textTransform: 'capitalize'}, statusStyles.text]}>
                {addtl_charge && addtl_charge > 0 ? 'Overdue: Php ' + addtl_charge : remarks}
              </Text>
            </View>
          )}
          {/* { remarks === 'reserved' && ( // optional: entrypoint to rent from here 
            <TouchableOpacity
              style={[globalStyles.statusBox, {backgroundColor: '#e2e3e5'}]}
              onPress={() => {handleRelease();}} // handle cancel reservation
              activeOpacity={0.8}
              >
              <Text>Release bike</Text>
            </TouchableOpacity>
          )} */}
        </View>

        {/*Right*/}
        <View style={[globalStyles.column, { alignItems: 'flex-end' }]}> 
          { addtl_charge && addtl_charge > 0 && ( // penalty information 
            <TouchableOpacity
              style={[globalStyles.statusBox, {backgroundColor: '#e2e3e5'}]}
              onPress={() => router.replace('/profile')} // go to profile
              activeOpacity={0.8}
              >
              <Text>Penalty information</Text>
            </TouchableOpacity>
          )}
          { remarks === 'active' && ( // nearest rack to me 
            <TouchableOpacity
              style={[globalStyles.statusBox, {backgroundColor: '#e2e3e5'}]}
              onPress={() => router.replace('/')} // go to maps?
              activeOpacity={0.8}
              >
              <Text> Nearest rack to me</Text>
            </TouchableOpacity>
          )}
          { remarks === 'reserved' && ( // cancel reservation 
            <TouchableOpacity
              style={[globalStyles.statusBox, {backgroundColor: '#e2e3e5'}]}
              onPress={() => {handleCancel();}} // handle cancel reservation
              activeOpacity={0.8}
              >
              <Text>Cancel reservation</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      { remarks != 'reserved' && ( // nearest rack to me 
        <Text style={[tripStyles.detail, {color: '#721c24'}]}>
          <Text style={[tripStyles.label, {color: '#721c24'}]}>Remarks: </Text>
          [time left or overdue balance]
        </Text>
      )}
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
const getStatusStyles = (status: string, addtlCharge?: number) => {
 if (addtlCharge && addtlCharge > 0) {
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
    default: // 
      return {
        container: {
          backgroundColor: '#e2e3e5',
          borderColor: '#6c757d',
        },
        text: {
          color: '#6c757d',
        },
      };
  }
};

// date time display format
const formatDate = (dateString: string): string => {

  if (dateString) {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',  
      day: 'numeric', 
    };

    const datePart = date.toLocaleDateString('en-US', options);
    const timePart = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    return `${datePart} (${timePart})`;
  }
  return "";
};
