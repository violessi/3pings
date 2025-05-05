import { Timestamp } from 'firebase/firestore';

export type Trip = {
    bikeID: number;
    startRack: string;
    endRack: string;
    startTime: Timestamp;
    endTime: Timestamp;
    status: string;
  };