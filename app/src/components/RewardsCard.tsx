import React , { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import globalStyles from "@/src/assets/styles";
import { useRouter } from "expo-router";

import { Reward } from "@/src/components/types";
import { verifyReward } from "@/src/service/rewardService";
import LoadingModal from "@/src/components/LoadingModal";

// props and style of rewards card 
// displayed in rewards page

type RewardsCardProps = {
  title: string;
  desc: string;
  prize: number;
  claimed: boolean;
  reqs: string[];
  rewardId: string;
  userId: string;
  onUpdate?: () => void;
};

export default function RewardsCard({
  title,
  desc,
  prize,
  claimed,
  reqs = [],
  rewardId,
  userId,
  onUpdate,
}: RewardsCardProps) {
  const router = useRouter();  
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  // handlers
  const handleButtonPress = async () => {
    setShowLoadingModal(true);

    try {
        console.log("[REWARDS] Button press, claim:", userId, rewardId);
        await verifyReward(userId, rewardId, onUpdate);
    } catch (err: any) {
        console.log("[CHECK] Error!", err.message);
    } finally {
      setShowLoadingModal(false);
    }
  };
  
  return (
    <View style={[globalStyles.card, {backgroundColor: "#fff"}]}>
      <Text style={globalStyles.subtitle}>{title}</Text>

      <View style={globalStyles.row}>
        {/*Left*/}
        <View style={globalStyles.column}>
          <Text style={rewardStyles.label}> Requirements </Text>
          { (reqs.length > 0) && (
            reqs.map((req, index) => (
              <Text key={index} style={rewardStyles.detail}> • {req}</Text>
            ))
          )}
        </View>

        {/*Right*/}
        <View style={globalStyles.column}>
          <Text style={[rewardStyles.label, {color: '#721c24'}]}>Reward </Text>
          <Text style={[rewardStyles.detail, {color: '#721c24'}]}> Php {prize} </Text>
        </View>   
      </View>

      <View style={{ alignItems: 'flex-end' }}>     
      { (!claimed) && (
        <TouchableOpacity
          style={[globalStyles.statusBox, {backgroundColor: '#e2e3e5'}]}
          onPress={() => handleButtonPress()}
          activeOpacity={0.8}
          >
          <Text>Check Trips</Text>
        </TouchableOpacity>
      )}
      </View>
    <LoadingModal showLoadingModal={showLoadingModal} />
    </View>
  );
}

const rewardStyles = StyleSheet.create({
  detail: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
});