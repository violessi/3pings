import { BikeSchema, RackSchema } from "@/types/schema";

const IP_ADDRESS = "192.168.1.29"; // change to your laptop's/server's IP

// ========================RENT=============================

export const createATrip = async (payload: CreateTrip) => {
  try {
    const res = await fetch(`http://${IP_ADDRESS}:3000/api/rent/createTrip`, {
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

// ======================RESERVE=============================

export const getUserReservedTrip = async (payload: {
  userId: string;
  rackId: string;
}) => {
  const res = await fetch(
    `http://${IP_ADDRESS}:3000/api/reserve/getReservedTrip`,
    {
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
export const payTrip = async (tripId: string) => {
  try {
    const res = await fetch(`http://${IP_ADDRESS}:3000/api/reserve/payTrip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tripId),
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
