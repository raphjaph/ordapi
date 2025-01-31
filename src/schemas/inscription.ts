import { z } from 'zod';

export const CharmSchema = z.enum([
  'burned',
  'coin',
  'cursed',
  'epic',
  'legendary',
  'lost',
  'mythic',
  'nineball',
  'palindrome',
  'rare',
  'reinscription',
  'unbound',
  'uncommon',
  'vindicated',
]);

export const InscriptionSchema = z.object({
  address: z.string().nullable(),
  charms: z.array(CharmSchema),
  child_count: z.number().int().nonnegative(),
  children: z.array(z.string()),
  content_length: z.number().int().nonnegative(),
  content_type: z.string(),
  effective_content_type: z.string(),
  fee: z.number().int().nonnegative(),
  height: z.number().int().nonnegative(),
  id: z.string(),
  next: z.string().nullable(),
  number: z.number().int().nonnegative(),
  parents: z.array(z.string()),
  previous: z.string().nullable(),
  rune: z.string().nullable(),
  sat: z.number().int().nonnegative().nullable(),
  satpoint: z.string(),
  timestamp: z.number().int(),
  value: z.number().int().nonnegative(),
  metaprotocol: z.string().nullable(),
});

export const InscriptionsResponseSchema = z.object({
  ids: z.array(z.string()),
  more: z.boolean(),
  page_index: z.number().int().nonnegative(),
});
