import { z } from 'zod';

export const InputSchema = z.object({
  previous_output: z.string(),
  script_sig: z.string(),
  sequence: z.number().int().nonnegative(),
  witness: z.array(z.string()),
});

export const OutputSchema = z.object({
  value: z.number().int().nonnegative(),
  script_pubkey: z.string(),
});

export const TransactionSchema = z.object({
  version: z.number().int().nonnegative(),
  lock_time: z.number().int().nonnegative(),
  input: z.array(InputSchema),
  output: z.array(OutputSchema),
});

export const TransactionInfoSchema = z.object({
  chain: z.string(),
  etching: z.string().nullable(),
  inscription_count: z.number().int().nonnegative(),
  transaction: TransactionSchema,
  txid: z.string(),
});

export const TransactionHexSchema = z
  .string()
  .regex(
    /^[0-9a-f]+$/,
    'Transaction hex must contain only lowercase hexadecimal characters',
  );
