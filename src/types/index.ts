import type { z } from 'zod';
import type {
  BlockInfoSchema,
  BlockHashSchema,
  BlocksResponseSchema,
  TransactionSchema,
  InputSchema,
  AddressInfoSchema,
  InscriptionSchema,
  CharmSchema,
  InscriptionsResponseSchema,
  OutputInfoSchema,
  RuneSchema,
  RunesResponseSchema,
  SatSchema,
  ServerStatusSchema,
  RuneResponseSchema,
  TransactionInfoSchema,
  RaritySchema,
  OutputSchema,
  OutputTypeSchema,
} from '../schemas';

export type AddressInfo = z.infer<typeof AddressInfoSchema>;

export type BlockInfo = z.infer<typeof BlockInfoSchema>;
export type BlockHash = z.infer<typeof BlockHashSchema>;
export type BlocksResponse = z.infer<typeof BlocksResponseSchema>;

export type Transaction = z.infer<typeof TransactionSchema>;
export type TransactionInfo = z.infer<typeof TransactionInfoSchema>;
export type Input = z.infer<typeof InputSchema>;
export type Output = z.infer<typeof OutputSchema>;

export type SatInfo = z.infer<typeof SatSchema>;
export type CharmType = z.infer<typeof CharmSchema>;
export type RarityType = z.infer<typeof RaritySchema>;
export type OutputType = z.infer<typeof OutputTypeSchema>;
export type OutputInfo = z.infer<typeof OutputInfoSchema>;
export type InscriptionInfo = z.infer<typeof InscriptionSchema>;
export type InscriptionsResponse = z.infer<typeof InscriptionsResponseSchema>;

export type RuneInfo = z.infer<typeof RuneSchema>;
export type RuneResponse = z.infer<typeof RuneResponseSchema>;
export type RunesResponse = z.infer<typeof RunesResponseSchema>;

export type ServerStatus = z.infer<typeof ServerStatusSchema>;
