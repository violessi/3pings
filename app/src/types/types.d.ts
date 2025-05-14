import { z } from "zod";
import {
  BikeStatusSchema,
  TripStatusSchema,
  CoordinatesSchema,
  ProfileSchema,
  TripSchema,
  BikeSchema,
  RackSchema,
} from "./schema";

// declare global types
declare global {
  export type TripStatus = z.infer<typeof TripStatusSchema>;
  export type BikeStatus = z.infer<typeof BikeStatusSchema>;
  export type Coordinates = z.infer<typeof CoordinatesSchema>;

  export type Profile = z.infer<typeof ProfileSchema>;
  export type CreateProfile = Omit<
    Profile,
    "id" | "createdAt" | "updatedAt" | "currentTrip"
  >;

  export type Trip = z.infer<typeof TripSchema>;
  export type CreateTrip = Omit<
    Trip,
    | "id"
    | "startTime"
    | "createdAt"
    | "updatedAt"
    | "endTime"
    | "addtlCharge"
    | "finalFee"
  >;

  export type Bike = z.infer<typeof BikeSchema>;

  export type Rack = z.infer<typeof RackSchema>;
}
