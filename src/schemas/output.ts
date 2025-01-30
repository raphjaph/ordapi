import { z } from 'zod';

export const OutputTypeSchema = z.enum([
  'any',
  'cardinal',
  'inscribed',
  'runic',
]);

const SatRangeSchema = z.tuple([
  z.number().int().nonnegative(),
  z.number().int().nonnegative(),
]);

const RuneSchema = z.object({
  amount: z.number().int().nonnegative(),
  divisibility: z.number().int().nonnegative(),
  symbol: z.string(),
});

export const OutputSchema = z.object({
  address: z.string(),
  indexed: z.boolean(),
  inscriptions: z.array(z.string()),
  outpoint: z.string(),
  runes: z.record(z.string(), RuneSchema).optional(),
  sat_ranges: z.array(SatRangeSchema).nullable(),
  script_pubkey: z.string(),
  spent: z.boolean(),
  transaction: z.string(),
  value: z.number().int().nonnegative(),
});
