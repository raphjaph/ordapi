import { z } from 'zod';
import {
  BlockSchema,
  BlockHashSchema,
  BlocksResponseSchema,
  TransactionSchema,
  AddressInfoSchema,
  InscriptionSchema,
  InscriptionsResponseSchema,
} from 'schemas';

export type Block = z.infer<typeof BlockSchema>;
export type BlockHash = z.infer<typeof BlockHashSchema>;
export type BlocksResponse = z.infer<typeof BlocksResponseSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type AddressInfo = z.infer<typeof AddressInfoSchema>;
export type Inscription = z.infer<typeof InscriptionSchema>;
export type InscriptionsResponse = z.infer<typeof InscriptionsResponseSchema>;
