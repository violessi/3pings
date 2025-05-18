import { z } from "zod";

export const TripStatusSchema = z.enum([
  "reserved",
  "active",
  "completed",
  "cancelled",
]);

export const BikeStatusSchema = z.enum([
  "reserved",
  "available",
  "returning",
  "returned",
  "rented",
  "getting",
  "missing",
  "maintenance",
]);

export const CoordinatesSchema = z.tuple([z.number(), z.number()]);

export const ProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  balance: z.number(),
  currentTrip: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  credits: z.number(),
});

export const BikeSchema = z.object({
  id: z.string(),
  rackId: z.string(),
  rackSlot: z.string().transform((val) => {
    parseInt(val.toString());
  }),
  status: BikeStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const RackSchema = z.object({
  id: z.string(),
  rackName: z.string(),
  location: z.string(),
  coordinates: CoordinatesSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TripSchema = z.object({
  id: z.string(),
  bikeId: z.string(),
  userId: z.string(),
  startTime: z.string(),
  endTime: z.string().nullable(),
  status: TripStatusSchema,
  baseRate: z.number(),
  addtlCharge: z.number().nullable(),
  finalFee: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  paid: z.boolean().nullable(),
  startRack: z.string(),
  endRack: z.string().nullable(),
});
