import { z } from 'zod';

export const farmSchema = z.object({
  name: z.string().nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  location_name: z.string().nullable().optional(),
  area_acres: z.number().positive().nullable().optional(),
  soil_type: z.string().nullable().optional(),
  irrigation_type: z.string().nullable().optional(),
});

export const cropSchema = z.object({
  crop_name: z.string().min(1),
  variety: z.string().nullable().optional(),
  sowing_date: z.string().nullable().optional(),
  growth_stage: z.string().nullable().optional(),
  crop_history: z.string().nullable().optional(),
});

export const soilSchema = z.object({
  moisture_percent: z.number().min(0).max(100).nullable().optional(),
  ph: z.number().min(0).max(14).nullable().optional(),
  nitrogen: z.number().nonnegative().nullable().optional(),
  phosphorus: z.number().nonnegative().nullable().optional(),
  potassium: z.number().nonnegative().nullable().optional(),
  groundwater_level: z.number().nullable().optional(),
  source: z.enum(['manual', 'sensor', 'simulated']),
  recorded_at: z.string().datetime().optional(),
});

export const weatherRefreshSchema = z.object({
  mock: z.boolean().optional(),
});
