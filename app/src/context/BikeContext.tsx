import React, { createContext, useState, useContext, ReactNode } from "react";
import { createATrip, getRack, getAvailableBikes, getUserReservedTrip } from "@/service/tripService";
import { listenToBikeStatus } from "@/service/listeners";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // adjust to your actual import

type BikeContextType = {
  rackId: string;
  showSuccessModal: boolean;
  showErrorModal: boolean;
  setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateRackId: (newRackId: string) => void;
  rentABike: () => Promise<Bike | null>;
  reserveABike: (selectedDate: Date) => Promise<Bike | null>;
  showLoadingModal: boolean;
};

export const BikeContext = createContext<BikeContextType | null>(null);

// PROVIDER COMPONENT
export const BikeProvider = ({ children }: { children: ReactNode }) => {
  const [rackId, setRackId] = useState("");
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

  async function checkReserved(userId: string) {
    try {
      const reservedTrip = await getUserReservedTrip(userId);
      return reservedTrip;
    } catch (err) {
      console.error("Error in checkReserved:", err);
      return null;
    }
  }


  // ============ FULL RENT A BIKE FUNCTION ============
  async function rentABike() {
    const userId = "user123";

    setShowLoadingModal(true);
    try {
      // Check if rackId is valid
      const validRackId = await checkRackId();
      console.log("[CHECK Rent] Rack valid?", validRackId);
      
      if (Boolean(validRackId.message) === false) {
        throw new Error("Invalid rack ID");
      }

      // Check if user has a reservation at this rack
      const reservedTripDoc = await checkReserved(userId);
      let bikeId: string;
      let reservedTripId: string | undefined;

      console.log(reservedTripDoc); // success
      
      // IF has reserved trip at that rack, take bikeId of already assigned bike
      // Include reservedTripId in payload for CreateTrip
      if (reservedTripDoc && reservedTripDoc.status === "reserved") {
        bikeId = reservedTripDoc.bikeId;
        reservedTripId = reservedTripDoc.id;

        console.log("[APP] User has reserved: " + reservedTripId); // NOT WORKING
        // check if reservation is at that rack

        console.log("[RENT] Using reserved bike:", bikeId);
      } else {
        // ELSE, check if there are available bikes
        const availableBikes = await checkAvailableBikes();
        console.log("[CHECK Rent] Available bikes:", availableBikes);

        if (!availableBikes || availableBikes.length === 0) {
          throw new Error("No available bikes found");
        }

        // Randomly assign a bike to user
        const randomIndex = Math.floor(Math.random() * availableBikes.length);
        const bike = availableBikes[randomIndex];
        bikeId = bike.id;
      }

      // CreateTrip handles creating new trip or updating reserved trip
      const payload: CreateTrip = {
        bikeId: bikeId,
        userId: "user123", // Replace with actual user ID
        status: "active",
        baseRate: 10,
        startTime: "",
        ...(reservedTripId && { reservedTripId }),
      };

      await initializeTrip(payload);

      setShowLoadingModal(false);
      setShowSuccessModal(true);
      updateRackId("");
      
      // shared logic after trip is created
      // listen for changes in bike status.
      // while bike status is not "rented", keep showing the success modal
      // if bike status is "rented", close the modal and navigate to the action page
      const unsub = listenToBikeStatus(bikeId, (status) => {
        if (status.toLowerCase() === "rented") {
          unsub(); // stop listening when status is "rented"
          setShowSuccessModal(false);
        }
      });

      return bikeId;
    } catch (err: any) {
      setShowLoadingModal(false);
      throw new Error(`Error: ${err.message}`);
    }
  }

  // ============ FULL RENT A BIKE FUNCTION ============
  async function reserveABike(selectedDate: Date) {
    setShowLoadingModal(true);

    try {
      const validRackId = await checkRackId();
      if (!validRackId.message) throw new Error("Invalid rack ID");

      const availableBikes = await checkAvailableBikes();
      if (!availableBikes || availableBikes.length === 0) {
        throw new Error("No available bikes");
      }

      const randomIndex = Math.floor(Math.random() * availableBikes.length);
      const bike = availableBikes[randomIndex];

      const payload: CreateTrip = {
        bikeId: bike.id,
        userId: "user123", // Replace with actual user ID
        status: "reserved",
        baseRate: 10,
        startTime: selectedDate.toISOString(),
      };

      await initializeTrip(payload);
      console.log("[RESERVE] Bike assigned:", bike.id);

      setShowLoadingModal(false);
      setShowSuccessModal(true);
      updateRackId("");

      return bike;
    } catch (err: any) {
      setShowLoadingModal(false);
      throw new Error(`Reservation failed: ${err.message}`);
    }
  }

  return (
    <BikeContext.Provider
      value={{
        rackId,
        showSuccessModal,
        showErrorModal,
        setShowErrorModal,
        setShowSuccessModal,
        updateRackId,
        rentABike,
        reserveABike,
        showLoadingModal,
      }}
    >
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
