import { z } from 'zod';
import { RuneBalanceSchema } from './rune';

export const OutputTypeSchema = z.enum([
  'any',
  'cardinal',
  'inscribed',
  'runic',
]);

export const SatRangeSchema = z.tuple([
  z.number().int().nonnegative(),
  z.number().int().nonnegative(),
]);

export const OutputInfoSchema = z.object({
  address: z.string().nullable(),
  indexed: z.boolean(),
  inscriptions: z.array(z.string()).nullable(),
  outpoint: z.string(),
  runes: z.record(z.string(), RuneBalanceSchema).nullable(),
  sat_ranges: z.array(SatRangeSchema).nullable(),
  script_pubkey: z.string(),
  spent: z.boolean(),
  transaction: z.string(),
  value: z.number().int().nonnegative(),
});

export const OutputAssetsSchema = z.object({
  inscriptions: z.array(z.string()).nullable(),
  runes: z.record(z.string(), RuneBalanceSchema).nullable(),
  sat_ranges: z.array(SatRangeSchema).nullable(),
  value: z.number().int().nonnegative(),
});
