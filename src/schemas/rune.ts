import { z } from 'zod';

export const RuneTermsSchema = z
  .object({
    amount: z.number().int().nonnegative(),
    cap: z.number().int().nonnegative(),
    height: z.tuple([z.number().int().nullable(), z.number().int().nullable()]),
    offset: z.tuple([z.number().int().nullable(), z.number().int().nullable()]),
  })
  .nullable();

export const RuneInfoSchema = z.object({
  block: z.number().int().nonnegative(),
  burned: z.number().int().nonnegative(),
  divisibility: z.number().int().nonnegative(),
  etching: z.string(),
  mints: z.number().int().nonnegative(),
  number: z.number().int().nonnegative(),
  premine: z.number().int().nonnegative(),
  spaced_rune: z.string(),
  symbol: z.string().nullable(),
  terms: RuneTermsSchema,
  timestamp: z.number().int(),
  turbo: z.boolean(),
});

export const RuneResponseSchema = z.object({
  entry: RuneInfoSchema,
  id: z.string(),
  mintable: z.boolean(),
  parent: z.string().nullable(),
});

export const RunesResponseSchema = z.object({
  entries: z.array(z.tuple([z.string(), RuneInfoSchema])),
  more: z.boolean(),
  prev: z.number().nullable(),
  next: z.number().nullable(),
});
