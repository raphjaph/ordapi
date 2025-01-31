import { z } from 'zod';
import { CharmSchema } from './inscription';

export const RaritySchema = z.enum([
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic',
]);

export const SatSchema = z.object({
  address: z.string().nullable(),
  block: z.number().int().nonnegative(),
  charms: z.array(CharmSchema),
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
  rarity: RaritySchema,
  satpoint: z.string().nullable(),
  timestamp: z.number().int(),
});
