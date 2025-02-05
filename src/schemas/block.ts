import { z } from 'zod';
import { TransactionSchema } from './transaction';

const isHexString = (str: string) => /^[0-9a-fA-F]+$/.test(str);

export const BlockHashSchema = z
  .string()
  .length(64, 'Block hash must be exactly 64 characters long')
  .refine(
    isHexString,
    'Block hash must contain only hexadecimal characters (0-9, a-f, A-F)',
  );

export const BlockInfoSchema = z.object({
  best_height: z.number().int().nonnegative(),
  hash: BlockHashSchema,
  height: z.number().int().nonnegative(),
  inscriptions: z.array(z.string()),
  runes: z.array(z.string()),
  target: z.string(),
  transactions: z.array(TransactionSchema),
});

export const BlocksResponseSchema = z.object({
  last: z.number().int().nonnegative(),
  blocks: z.array(BlockHashSchema),
  featured_blocks: z.record(BlockHashSchema, z.array(z.string())),
});

export const BlockDetailsSchema = z.object({
  average_fee: z.number().int().nonnegative(),
  average_fee_rate: z.number().nonnegative(),
  bits: z.number().int().nonnegative(),
  chainwork: z.string(),
  confirmations: z.number().int().nonnegative(),
  difficulty: z.number().nonnegative(),
  hash: BlockHashSchema,
  feerate_percentiles: z.array(z.number().nonnegative()),
  height: z.number().int().nonnegative(),
  max_fee: z.number().int().nonnegative(),
  max_fee_rate: z.number().nonnegative(),
  max_tx_size: z.number().int().nonnegative(),
  median_fee: z.number().int().nonnegative(),
  median_time: z.number().int().nonnegative().nullable(),
  merkle_root: z.string(),
  min_fee: z.number().int().nonnegative(),
  min_fee_rate: z.number().nonnegative(),
  next_block: BlockHashSchema.nullable(),
  nonce: z.number().int().nonnegative(),
  previous_block: BlockHashSchema.nullable(),
  subsidy: z.number().int().nonnegative(),
  target: z.string(),
  timestamp: z.number().int(),
  total_fee: z.number().int().nonnegative(),
  total_size: z.number().int().nonnegative(),
  total_weight: z.number().int().nonnegative(),
  transaction_count: z.number().int().nonnegative(),
  version: z.number().int(),
});
