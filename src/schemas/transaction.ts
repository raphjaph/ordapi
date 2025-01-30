import { z } from 'zod';

export const TxInputSchema = z.object({
  previous_output: z.string(),
  script_sig: z.string(),
  sequence: z.number().int().nonnegative(),
  witness: z.array(z.string()),
});

export const TxOutputSchema = z.object({
  value: z.number().int().nonnegative(),
  script_pubkey: z.string(),
});

export const TxSchema = z.object({
  version: z.number().int().nonnegative(),
  lock_time: z.number().int().nonnegative(),
  input: z.array(TxInputSchema),
  output: z.array(TxOutputSchema),
});

export const TxDetailsSchema = z.object({
  chain: z.string(),
  etching: z.string().nullable(),
  inscription_count: z.number().int().nonnegative(),
  transaction: TxSchema,
  txid: z.string(),
});
