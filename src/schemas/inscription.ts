import { z } from 'zod';

export const CharmTypeSchema = z.enum([
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

export const InscriptionInfoSchema = z.object({
  address: z.string().nullable(),
  charms: z.array(CharmTypeSchema),
  child_count: z.number().int().nonnegative(),
  children: z.array(z.string()),
  content_length: z.number().int().nonnegative().nullable(),
  content_type: z.string().nullable(),
  effective_content_type: z.string().nullable(),
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
  value: z.number().int().nonnegative().nullable(),
  metaprotocol: z.string().nullable(),
});

export const InscriptionRecursiveSchema = z.object({
  charms: z.array(CharmTypeSchema),
  content_type: z.string().nullable(),
  content_length: z.number().int().nonnegative().nullable(),
  delegate: z.string().nullable(),
  fee: z.number().int().nonnegative(),
  height: z.number().int().nonnegative(),
  id: z.string(),
  number: z.number().int().nonnegative(),
  output: z.string(),
  sat: z.number().int().nonnegative().nullable(),
  satpoint: z.string(),
  timestamp: z.number().int(),
  value: z.number().int().nonnegative().nullable(),
  address: z.string().nullable(),
});

export const InscriptionsResponseSchema = z.object({
  ids: z.array(z.string()),
  more: z.boolean(),
  page_index: z.number().int().nonnegative(),
});

export const InscriptionsIDsResponseSchema = z.object({
  ids: z.array(z.string()),
  more: z.boolean(),
  page: z.number().int().nonnegative(),
});

export const ChildInfoSchema = z.object({
  charms: z.array(CharmTypeSchema),
  fee: z.number().int().nonnegative(),
  height: z.number().int().nonnegative(),
  id: z.string(),
  number: z.number().int().nonnegative(),
  output: z.string(),
  sat: z.number().int().nonnegative(),
  satpoint: z.string(),
  timestamp: z.number().int(),
});

export const ChildrenInfoResponseSchema = z.object({
  children: z.array(ChildInfoSchema),
  more: z.boolean(),
  page: z.number().int().nonnegative(),
});

export const InscriptionIDSchema = z.object({
  id: z.string().nullable(),
});
