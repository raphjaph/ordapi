import { z } from 'zod';

export const InscriptionContentSchema = z.object({
  body: z.string().optional(),
  content_encoding: z.string().optional(),
  content_length: z.number().optional(),
  content_type: z.string(),
});

export const InscriptionSchema = z.object({
  address: z.string().optional(),
  chain_stats: z.object({
    blocks_since_genesis: z.number(),
    inscription_number: z.number(),
    timestamp: z.number(),
  }),
  charms: z.array(z.string()),
  content: InscriptionContentSchema,
  content_length: z.number(),
  content_type: z.string(),
  genesis_fee: z.number().int().nonnegative(),
  genesis_height: z.number(),
  id: z.string(),
  location: z.string(),
  offset: z.number().optional(),
  output: z.string(),
  output_value: z.number().int().nonnegative(),
  parent: z.string().optional(),
  rune: z
    .object({
      id: z.string(),
      name: z.string(),
      rune: z.string(),
      supply: z.string(),
      symbol: z.string().optional(),
      timestamp: z.number(),
    })
    .optional(),
  sat: z.string().optional(),
  timestamp: z.number(),
});

export const InscriptionIdSchema = z.string().regex(/^[0-9a-f]{64}i\d+$/);

export const InscriptionsResponseSchema = z.object({
  inscriptions: z.array(InscriptionSchema),
  page: z.number().optional(),
  total_pages: z.number().optional(),
});
