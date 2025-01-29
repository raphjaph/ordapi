import { z } from 'zod';
import { endpoints } from 'src/endpoints';
import {
  BlockSchema,
  BlockHashSchema,
  AddressInfoSchema,
  BlocksResponseSchema,
} from 'schemas';
import type { Block, BlockHash, AddressInfo, BlocksResponse } from 'types';

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

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

  private async fetch<T extends z.ZodType>(
    endpoint: string,
    schema: T,
  ): Promise<z.infer<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const text = await response.text();
    const result = schema.safeParse(text);

    if (!result.success) {
      try {
        const json = JSON.parse(text);
        const jsonResult = schema.safeParse(json);
        if (jsonResult.success) {
          return jsonResult.data;
        }
      } catch {}

      throw new Error(`Validation error: ${result.error.message}`);
    }

    return result.data;
  }

  async getAddress(address: string): Promise<AddressInfo> {
    return this.fetch(endpoints.address(address), AddressInfoSchema);
  }

  async getBlock(heightOrHash: number | BlockHash): Promise<Block> {
    return this.fetch(endpoints.block(heightOrHash), BlockSchema);
  }

  async getBlockCount(): Promise<number> {
    return this.fetch(endpoints.blockcount, z.number().int().nonnegative());
  }

  async getBlockHashByHeight(height: number): Promise<BlockHash> {
    return this.fetch(endpoints.blockhashByHeight(height), BlockHashSchema);
  }

  async getLatestBlockHash(): Promise<BlockHash> {
    return this.fetch(endpoints.blockhashLatest, BlockHashSchema);
  }

  async getBlockHeight(): Promise<number> {
    return this.fetch(endpoints.blockheight, z.number().int().nonnegative());
  }

  async getBlocks(): Promise<BlocksResponse> {
    return this.fetch(endpoints.blocks, BlocksResponseSchema);
  }

  async getBlockTime(): Promise<number> {
    return this.fetch(endpoints.blocktime, z.number().int());
  }
}
