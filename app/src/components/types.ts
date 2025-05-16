import { Timestamp } from 'firebase/firestore';

// should match actual fields from database

export type Trip = {
    bikeId: string;
    startTime: Timestamp;
    endTime: Timestamp;
    status: string;
    addtlCharge: number;
  };

export type Rack = {
    name: string;
    location: string;
    available: number;
    reserved: number;
    empty: number;
  };