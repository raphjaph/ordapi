import { z } from 'zod';

export const AddressInfoSchema = z.object({
  outputs: z.array(z.string()),
  inscriptions: z.array(z.string()),
  sat_balance: z.number().int().nonnegative(),
  runes_balances: z.array(z.array(z.string())),
});
