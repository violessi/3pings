import { BikeSchema } from "@/types/schema";

const IP_ADDRESS = "10.150.244.52"; // change to your laptop's/server's IP

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

export const getUserReservedTrip = async (userId: string) => {
  try {
    const res = await fetch(`http://${IP_ADDRESS}:3000/api/rent/getReservedTrip/${userId}`, {
      method: "GET",
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || "Error fetching reserved trip");
    }

    const data = await res.json();
    return data; // expected reserved trip object or null
  } catch (err) {
    console.error("getUserReservedTrip error:", err);
    return null;
  }
};


// ======================RETURN=============================

// export const returnABike = async () => {
//   try {
//     const res = await fetch(
//       `http://${IP_ADDRESS}:3000/api/bikeActions/return`,
//       {
//         method: "POST", // post to server to handle return request
//       }
//     );

//     if (res.ok) {
//       Alert.alert("Bike returned!");
//       router.replace("/trips");
//     } else {
//       const { error } = await res.json();
//       Alert.alert(error || "Error returning bike");
//     }
//   } catch (err) {
//     console.error("Error:", err);
//   }
// };
