import { Timestamp } from 'firebase/firestore';

// should match actual fields from database

export type Trip = {
  id: string;
  bikeId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  status: string;
  addtlCharge: number;
  paid: boolean;
  startRack: string;
  endRack: string;
};

export type Rack = {
  name: string;
  location: string;
  available: number;
  reserved: number;
  empty: number;
};

export type Reward = {
  id: string;
  desc: string;
  status: string;
  reqs: string[];
  prize: number;
};