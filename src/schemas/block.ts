import { z } from 'zod';
import { blockHeight, TransactionSchema } from 'schemas';

const isHexString = (str: string) => /^[0-9a-fA-F]+$/.test(str);

export const BlockHashSchema = z
  .string()
  .length(64, 'Block hash must be exactly 64 characters long')
  .refine(
    isHexString,
    'Block hash must contain only hexadecimal characters (0-9, a-f, A-F)',
  );

export const BlockSchema = z.object({
  best_height: blockHeight,
  hash: BlockHashSchema,
  height: blockHeight,
  inscriptions: z.array(z.string()),
  runes: z.array(z.string()),
  target: z.string(),
  transactions: z.array(TransactionSchema),
});

export const BlocksResponseSchema = z.object({
  last: blockHeight,
  blocks: z.array(BlockHashSchema),
  featured_blocks: z.record(BlockHashSchema, z.array(z.string())),
});
