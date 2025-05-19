import { BikeSchema } from "@/types/schema";
import RewardsCard from "@/src/components/RewardsCard";

// const IP_ADDRESS = "172.20.10.7"; // change to your laptop's/server's IP
const SERVER_URL = "https://iotcup-spinrewards-server-ccf03fb41b1c.herokuapp.com/";

// ========================CLAIM=============================

export const verifyReward = async (
  userId: string,
  rewardId: string,
  onUpdate?: () => void
) => {
  try {
    // const res = await fetch(`http://${IP_ADDRESS}:3000/api/rewards/verify`, {
    const res = await fetch(`${SERVER_URL}api/rewards/verify`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, rewardId })
    });

    if (res.ok) {
      console.log("[APP] Reward claimed");
      onUpdate?.();
    } else {
      const { error } = await res.json();
      console.error("[APP] Failed to claim:", error);
    }
  } catch (err) {
    console.error("[APP] Error claiming:", err);
  }
};
