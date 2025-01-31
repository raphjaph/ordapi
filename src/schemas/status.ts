import { z } from 'zod';

const TimeSchema = z.object({
  secs: z.number().int().nonnegative(),
  nanos: z.number().int().nonnegative(),
});

export const ServerStatusSchema = z.object({
  address_index: z.boolean(),
  blessed_inscriptions: z.number().int().nonnegative(),
  chain: z.string(),
  cursed_inscriptions: z.number().int().nonnegative(),
  height: z.number().int().nonnegative(),
  initial_sync_time: TimeSchema,
  inscriptions: z.number().int().nonnegative(),
  lost_sats: z.number().int().nonnegative(),
  minimum_rune_for_next_block: z.string().nullable(),
  rune_index: z.boolean(),
  runes: z.number().int().nonnegative(),
  sat_index: z.boolean(),
  started: z.string(),
  transaction_index: z.boolean(),
  unrecoverably_reorged: z.boolean(),
  uptime: TimeSchema,
});
