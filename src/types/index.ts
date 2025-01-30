import type { z } from 'zod';
import type {
  BlockSchema,
  BlockHashSchema,
  BlocksResponseSchema,
  TxSchema,
  TxInputSchema,
  AddressInfoSchema,
  InscriptionSchema,
  CharmSchema,
  InscriptionsResponseSchema,
  OutputSchema,
  RuneSchema,
  RunesResponseSchema,
  SatSchema,
  StatusSchema,
  RuneResponseSchema,
  TxDetailsSchema,
  RaritySchema,
  TxOutputSchema,
  OutputTypeSchema,
} from '../schemas';

export type AddressInfo = z.infer<typeof AddressInfoSchema>;

export type BlockInfo = z.infer<typeof BlockSchema>;
export type BlockHash = z.infer<typeof BlockHashSchema>;
export type BlocksResponse = z.infer<typeof BlocksResponseSchema>;

export type Transaction = z.infer<typeof TxSchema>;
export type TransactionInfo = z.infer<typeof TxDetailsSchema>;
export type TransactionInput = z.infer<typeof TxInputSchema>;
export type TransactionOutput = z.infer<typeof TxOutputSchema>;

export type SatInfo = z.infer<typeof SatSchema>;
export type CharmType = z.infer<typeof CharmSchema>;
export type RarityType = z.infer<typeof RaritySchema>;
export type OutputType = z.infer<typeof OutputTypeSchema>;
export type OutputInfo = z.infer<typeof OutputSchema>;
export type InscriptionInfo = z.infer<typeof InscriptionSchema>;
export type InscriptionsResponse = z.infer<typeof InscriptionsResponseSchema>;

export type RuneInfo = z.infer<typeof RuneSchema>;
export type RuneResponse = z.infer<typeof RuneResponseSchema>;
export type RunesResponse = z.infer<typeof RunesResponseSchema>;

export type Status = z.infer<typeof StatusSchema>;
