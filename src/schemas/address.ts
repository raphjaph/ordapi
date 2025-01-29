import { z } from 'zod';

export const RuneBalanceSchema = z.tuple([z.string(), z.string(), z.string()]);

export const AddressInfoSchema = z.object({
  outputs: z.array(z.string()),
  inscriptions: z.array(z.string()),
  sat_balance: z.number().int().nonnegative(),
  runes_balances: z.array(RuneBalanceSchema),
});
