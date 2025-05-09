import { Timestamp } from 'firebase/firestore';

// should match actual fields from database

export type Trip = {
    bike_id: string;
    start_time: Timestamp;
    end_time: Timestamp;
    status: string;
  };

export type Rack = {
    location: string;
    available: number;
    reserved: number;
    empty: number;
  };