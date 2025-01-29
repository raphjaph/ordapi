import { z } from 'zod';
import { endpoints } from 'src/endpoints';
import {
  BlockSchema,
  BlockHashSchema,
  AddressInfoSchema,
  BlocksResponseSchema,
  InscriptionSchema,
  InscriptionsResponseSchema,
} from 'schemas';
import type {
  Block,
  BlockHash,
  AddressInfo,
  BlocksResponse,
  Inscription,
  InscriptionsResponse,
} from 'types';

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

  private async fetchPost<T extends z.ZodType, P extends object>(
    endpoint: string,
    payload: P,
    schema: T,
  ): Promise<z.infer<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const result = schema.safeParse(data);

    if (!result.success) {
      throw new Error(`Validation error: ${result.error.message}`);
    }

    return result.data;
  }

  async getAddressInfo(address: string): Promise<AddressInfo> {
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

  async getLatestBlockHeight(): Promise<number> {
    return this.fetch(endpoints.blockheight, z.number().int().nonnegative());
  }

  async getLatestBlocks(): Promise<BlocksResponse> {
    return this.fetch(endpoints.blocks, BlocksResponseSchema);
  }

  async getLatestBlockTime(): Promise<number> {
    return this.fetch(endpoints.blocktime, z.number().int());
  }

  async getInscription(id: string): Promise<Inscription> {
    return this.fetch(endpoints.inscription(id), InscriptionSchema);
  }

  async getInscriptionChild(id: string, child: number): Promise<Inscription> {
    return this.fetch(endpoints.inscriptionChild(id, child), InscriptionSchema);
  }

  async getLatestInscriptions(): Promise<InscriptionsResponse> {
    return this.fetch(endpoints.inscriptions, InscriptionsResponseSchema);
  }

  async getInscriptionsByIds(ids: string[]): Promise<Inscription[]> {
    return this.fetchPost(
      endpoints.inscriptions,
      ids,
      z.array(InscriptionSchema),
    );
  }

  async getInscriptionsByPage(page: number): Promise<InscriptionsResponse> {
    return this.fetch(
      endpoints.inscriptionsByPage(page),
      InscriptionsResponseSchema,
    );
  }

  async getInscriptionsByBlock(height: number): Promise<InscriptionsResponse> {
    return this.fetch(
      endpoints.inscriptionsByBlock(height),
      InscriptionsResponseSchema,
    );
  }
}
