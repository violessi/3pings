import React, { createContext, useState, useContext, ReactNode } from "react";
import { createATrip, getRack, getAvailableBikes } from "@/service/tripService";

type BikeContextType = {
  rackId: string;
  updateRackId: (newRackId: string) => void;
  rentABike: () => Promise<void>;
};

export const BikeContext = createContext<BikeContextType | null>(null);

// Provider component
export const BikeProvider = ({ children }: { children: ReactNode }) => {
  const [rackId, setRackId] = useState("");
  const [assignedBike, setAssignedBike] = useState<Bike | null>(null);

  function updateRackId(newRackId: string) {
    setRackId(newRackId);
  }

  async function checkRackId() {
    try {
      const res = await getRack(rackId);
      return res;
    } catch (err) {
      return err;
    }
  }

  async function checkAvailableBikes(): Promise<Bike[]> {
    try {
      const res = await getAvailableBikes(rackId);
      return res;
    } catch (err: any) {
      return err;
    }
  }

  async function initializeTrip(payload: CreateTrip) {
    try {
      const res = await createATrip(payload);
      return res;
    } catch (err) {
      console.error("Error:", err);
    }
  }

  // ============ FULL RENT A BIKE FUNCTION ============
  async function rentABike() {
    try {
      // Check if rackId is valid
      const validRackId = await checkRackId();
      if (Boolean(validRackId.message) === false) {
        throw new Error("Invalid rack ID");
      }

      // Check if there are available bikes
      const availableBikes = await checkAvailableBikes();
      if (!availableBikes || availableBikes.length === 0) {
        throw new Error("No available bikes found");
      }

      // Randomly assign a bike to user
      const randomIndex = Math.floor(Math.random() * availableBikes.length);
      const bike = availableBikes[randomIndex];
      setAssignedBike(bike);

      const payload: CreateTrip = {
        bikeId: bike.id,
        userId: "user123", // Replace with actual user ID
        status: "active",
        baseRate: 10,
      };

      const res = await initializeTrip(payload);
      return res;
    } catch (err: any) {
      console.error("Error in rentABike:", err.message || err);
      return null;
    }
  }

  return (
    <BikeContext.Provider value={{ rackId, updateRackId, rentABike }}>
      {children}
    </BikeContext.Provider>
  );
};

export const useBike = () => {
  const context = useContext(BikeContext);
  if (!context) {
    throw new Error("useBikeContext must be used within an AppProvider");
  }
  return context;
};
