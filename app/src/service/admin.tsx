const IP_ADDRESS = "10.80.97.193"; // change to your laptop's/server's IP
const SERVER_URL = "https://iotcup-spinrewards-server-ccf03fb41b1c.herokuapp.com/";

export const resetDatabase = async () => {
  try {
    const res = await fetch(`http://${IP_ADDRESS}:3000/api/admin/reset`, {
    // const res = await fetch(`${SERVER_URL}api/admin/reset`, {
      method: "POST",
    });

    if (res.ok) {
      console.log("[APP] Reset done, ready for demo");
    } else {
      const { error } = await res.json();
      console.error("[APP] Failed to reset:", error);
    }
  } catch (err) {
    console.error("[APP] Error resetting:", err);
  }
};