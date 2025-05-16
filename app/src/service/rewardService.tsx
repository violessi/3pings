import { BikeSchema } from "@/types/schema";
import RewardsCard from "@/src/components/RewardsCard";

const IP_ADDRESS = "10.150.244.52"; // change to your laptop's/server's IP

// ========================CLAIM=============================

export const verifyReward = async (
  userId: string,
  rewardId: string,
  onUpdate?: () => void
) => {
  try {
    const res = await fetch(`http://${IP_ADDRESS}:3000/api/rewards/verify`, {
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
