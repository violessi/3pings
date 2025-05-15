// bikeListener.tsx
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // adjust path based on your project structure

export const listenToBikeStatus = (
  bikeId: string,
  onChange: (status: string) => void
) => {
  const unsub = onSnapshot(doc(db, "bikes", bikeId), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data?.status) {
        onChange(data.status);
      }
    }
  });

  return unsub;
};
