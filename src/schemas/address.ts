import { z } from 'zod';
import { satoshi } from 'schemas';

export const RuneBalanceSchema = z.tuple([z.string(), z.string(), z.string()]);

export const AddressInfoSchema = z.object({
  outputs: z.array(z.string()),
  inscriptions: z.array(z.string()),
  sat_balance: satoshi,
  runes_balances: z.array(RuneBalanceSchema),
});
