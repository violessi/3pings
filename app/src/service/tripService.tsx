import { BikeSchema, RackSchema } from "@/types/schema";

const IP_ADDRESS = "10.147.40.131"; // change to your laptop's/server's IP
const SERVER_URL =
  "https://iotcup-spinrewards-server-ccf03fb41b1c.herokuapp.com/";

// ========================KAT TRIAL========================

export const hwToServer = async () => {
  try {
    console.log("Sending request to server...");
    const res = await fetch(`http://${IP_ADDRESS}:3000/api/rent/test`, {
      method: "GET",
    });
    if (res.ok) {
      const data = await res.json();
      console.log("Data from server:", data);
      return data; // return the response data
    } else {
      throw new Error("Failed to fetch data from server");
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

// ========================RENT=============================

export const createATrip = async (payload: CreateTrip) => {
  try {
    const res = await fetch(`http://${IP_ADDRESS}:3000/api/rent/createTrip`, {
      // const res = await fetch(`${SERVER_URL}api/rent/createTrip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return res.json(); // return the response data
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

export const getRack = async (rackId: string) => {
  try {
    const res = await fetch(
      `http://${IP_ADDRESS}:3000/api/rent/getRack/${rackId}`,
      {
        // const res = await fetch(`${SERVER_URL}api/rent/getRack/${rackId}`, {
        method: "GET",
      }
    );

    if (res.ok) {
      return res.json(); // SHOULD RETURN BOOLEAN
    } else {
      const { error } = await res.json();
      throw new Error(error || "Error fetching rack ID");
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

export const getBike = async (bikeId: string) => {
  try {
    const res = await fetch(
      `http://${IP_ADDRESS}:3000/api/rent/getBike/${bikeId}`,
      {
        // const res = await fetch(`${SERVER_URL}api/rent/getBike/${bikeId}`, {
        method: "GET",
      }
    );

    if (res.ok) {
      return res.json(); // SHOULD RETURN BIKE
    } else {
      const { error } = await res.json();
      throw new Error(error || "Error fetching bike ID");
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

export const preRentCheck = async (userId: string, rackId: string) => {
  const res = await fetch(`http://${IP_ADDRESS}:3000/api/rent/preCheck`, {
    // const res = await fetch(`${SERVER_URL}api/rent/preCheck`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, rackId }),
  });

  const data = await res.json();
  return data;
};

export const getAvailableBikes = async (rackId: string): Promise<Bike[]> => {
  try {
    const res = await fetch(
      `http://${IP_ADDRESS}:3000/api/rent/getAvailableBikes/${rackId}`,
      {
        // const res = await fetch(
        //   `${SERVER_URL}api/rent/getAvailableBikes/${rackId}`,
        //   {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`);
    }

    const data = await res.json();
    if (!data?.availableBikes || !Array.isArray(data.availableBikes)) {
      throw new Error("No available bikes found");
    }

    const parsed = BikeSchema.array().safeParse(data.availableBikes);
    if (!parsed.success) {
      console.error(parsed.error);
      throw new Error("Failed to validate availableBikes data");
    }

    return parsed.data;
  } catch (err: any) {
    return []; // temporary solution
  }
};

export const hardwareRequest = async (payload: { bikeId: string }) => {
  try {
    const res = await fetch(
      `http://${IP_ADDRESS}:3000/api/rent/hardwareRequest`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to send hardware request");
    }
    return await res.json(); // return server response
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

// ======================RESERVE=============================

export const getUserReservedTrip = async (payload: {
  userId: string;
  rackId: string;
}) => {
  const res = await fetch(
    `http://${IP_ADDRESS}:3000/api/reserve/getReservedTrip`,
    {
      // const res = await fetch(`${SERVER_URL}api/reserve/getReservedTrip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch reserved trip");
  }

  return res.json();
};

export const deleteTrip = async (payload: {
  bikeId: string;
  userId: string;
  tripId: string;
}) => {
  try {
    const res = await fetch(
      `http://${IP_ADDRESS}:3000/api/reserve/deleteReservedTrip`,
      {
        // const res = await fetch(`${SERVER_URL}api/reserve/deleteReservedTrip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to delete trip");
    }

    return await res.json(); // return server response
  } catch (err) {
    console.error("Error deleting trip:", err);
    throw err; // rethrow so it can be caught in cancelReservation
  }
};

// ======================RETURN=============================

export const handleReturn = async (payload: {
  rackId: string;
  userId: string;
}) => {
  try {
    const res = await fetch(`http://${IP_ADDRESS}:3000/api/return/request`, {
      // const res = await fetch(`${SERVER_URL}api/return/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to return bike");
    }

    return await res.json();
  } catch (err) {
    console.error("Error returning bike:", err);
    throw err;
  }
};

// ======================PAY FOR A TRIP======================
export const payTrip = async (payload: {tripId: string, minusCredits: number, minusBalance: number }) => {
  try {
    // const res = await fetch(`http://${IP_ADDRESS}:3000/api/reserve/payTrip`, {
    const res = await fetch(`${SERVER_URL}api/reserve/payTrip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to delete trip");
    }

    return await res.json(); // return server response
  } catch (err) {
    console.error("Error paying for trip:", err);
    throw err; // rethrow so it can be caught in cancelReservation
  }
};

// ======================FORMAT DATE/TIME======================
export const formatDate = (dateString: string): string => {
  if (dateString) {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };

    const datePart = date.toLocaleDateString("en-US", options);
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${datePart} (${timePart})`;
  }
  return "";
};
