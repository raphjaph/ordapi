import { z } from 'zod';

export const InputSchema = z.object({
  previous_output: z.string(),
  script_sig: z.string(),
  sequence: z.number().int().nonnegative(),
  witness: z.array(z.string()),
});

export const OutputSchema = z.object({
  value: z.number().int().nonnegative(),
  script_pubkey: z.string(),
});

export const TransactionSchema = z.object({
  version: z.number().int().nonnegative(),
  lock_time: z.number().int().nonnegative(),
  input: z.array(InputSchema),
  output: z.array(OutputSchema),
});

export const BlockSchema = z.object({
  best_height: z.number().int().nonnegative(),
  hash: z.string(),
  height: z.number().int().nonnegative(),
  inscriptions: z.array(z.string()),
  runes: z.array(z.string()),
  target: z.string(),
  transactions: z.array(TransactionSchema),
});

export type Block = z.infer<typeof BlockSchema>;

export class OrdClient {
  private headers: HeadersInit;

  constructor(
    private baseUrl: string,
    headers: HeadersInit = {},
  ) {
    this.headers = {
      Accept: 'application/json',
      ...headers,
    };
  }

  async getBlock(blockHeight: number): Promise<Block> {
    const response = await fetch(`${this.baseUrl}/block/${blockHeight}`, {
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error();
    }
    const data = await response.json();
    return BlockSchema.parse(data);
  }
}
