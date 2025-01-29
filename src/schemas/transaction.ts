import { z } from 'zod';
import { satoshi } from 'schemas';

export const InputSchema = z.object({
  previous_output: z.string(),
  script_sig: z.string(),
  sequence: z.number().int().nonnegative(),
  witness: z.array(z.string()),
});

export const OutputSchema = z.object({
  value: satoshi,
  script_pubkey: z.string(),
});

export const TransactionSchema = z.object({
  version: z.number().int().nonnegative(),
  lock_time: z.number().int().nonnegative(),
  input: z.array(InputSchema),
  output: z.array(OutputSchema),
});
