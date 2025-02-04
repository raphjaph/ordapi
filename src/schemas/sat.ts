import { z } from 'zod';
import { CharmTypeSchema } from './inscription';

export const RarityTypeSchema = z.enum([
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic',
]);

export const SatInfoSchema = z.object({
  address: z.string().nullable(),
  block: z.number().int().nonnegative(),
  charms: z.array(CharmTypeSchema),
  cycle: z.number().int().nonnegative(),
  decimal: z.string(),
  degree: z.string(),
  epoch: z.number().int().nonnegative(),
  inscriptions: z.array(z.string()),
  name: z.string(),
  number: z.number().int().nonnegative(),
  offset: z.number().int().nonnegative(),
  percentile: z.string(),
  period: z.number().int().nonnegative(),
  rarity: RarityTypeSchema,
  satpoint: z.string().nullable(),
  timestamp: z.number().int(),
});
