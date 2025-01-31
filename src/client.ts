import { z } from 'zod';
import api from './api';
import {
  BlockInfoSchema,
  BlockHashSchema,
  AddressInfoSchema,
  BlocksResponseSchema,
  InscriptionSchema,
  InscriptionsResponseSchema,
  OutputInfoSchema,
  RuneResponseSchema,
  RunesResponseSchema,
  SatSchema,
  ServerStatusSchema,
  TransactionInfoSchema,
} from './schemas';
import type {
  BlockInfo,
  BlockHash,
  AddressInfo,
  BlocksResponse,
  InscriptionInfo,
  InscriptionsResponse,
  OutputInfo,
  RuneResponse,
  RunesResponse,
  SatInfo,
  TransactionInfo,
  ServerStatus,
  OutputType,
} from './types';

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
    return this.fetch(api.address(address), AddressInfoSchema);
  }

  async getBlock(heightOrHash: number | BlockHash): Promise<BlockInfo> {
    return this.fetch(api.block(heightOrHash), BlockInfoSchema);
  }

  async getBlockCount(): Promise<number> {
    return this.fetch(api.blockcount, z.number().int().nonnegative());
  }

  async getBlockHashByHeight(height: number): Promise<BlockHash> {
    return this.fetch(api.blockhash.byHeight(height), BlockHashSchema);
  }

  async getLatestBlockHash(): Promise<BlockHash> {
    return this.fetch(api.blockhash.latest, BlockHashSchema);
  }

  async getLatestBlockHeight(): Promise<number> {
    return this.fetch(api.blockheight, z.number().int().nonnegative());
  }

  async getLatestBlocks(): Promise<BlocksResponse> {
    return this.fetch(api.blocks, BlocksResponseSchema);
  }

  async getLatestBlockTime(): Promise<number> {
    return this.fetch(api.blocktime, z.number().int());
  }

  async getInscription(id: string): Promise<InscriptionInfo> {
    return this.fetch(api.inscription(id), InscriptionSchema);
  }

  async getInscriptionChild(
    id: string,
    child: number,
  ): Promise<InscriptionInfo> {
    return this.fetch(api.inscriptionChild(id, child), InscriptionSchema);
  }

  async getLatestInscriptions(): Promise<InscriptionsResponse> {
    return this.fetch(api.inscriptions.latest, InscriptionsResponseSchema);
  }

  async getInscriptionsByIds(ids: string[]): Promise<InscriptionInfo[]> {
    return this.fetchPost(
      api.inscriptions.base,
      ids,
      z.array(InscriptionSchema),
    );
  }

  async getInscriptionsByPage(page: number): Promise<InscriptionsResponse> {
    return this.fetch(
      api.inscriptions.byPage(page),
      InscriptionsResponseSchema,
    );
  }

  async getInscriptionsByBlock(height: number): Promise<InscriptionsResponse> {
    return this.fetch(
      api.inscriptions.byBlock(height),
      InscriptionsResponseSchema,
    );
  }

  async getOutput(outpoint: string): Promise<OutputInfo> {
    return this.fetch(api.output(outpoint), OutputInfoSchema);
  }

  async getOutputs(outpoints: string[]): Promise<OutputInfo[]> {
    return this.fetchPost(api.outputs.base, outpoints, z.array(OutputInfoSchema));
  }

  async getOutputsByAddress(
    address: string,
    type?: OutputType,
  ): Promise<OutputInfo[]> {
    return this.fetch(
      api.outputs.byAddress(address, type),
      z.array(OutputInfoSchema),
    );
  }

  async getRune(name: string): Promise<RuneResponse> {
    return this.fetch(api.rune(name), RuneResponseSchema);
  }

  async getLatestRunes(): Promise<RunesResponse> {
    return this.fetch(api.runes.latest, RunesResponseSchema);
  }

  async getRunesByPage(page: number): Promise<RunesResponse> {
    return this.fetch(api.runes.byPage(page), RunesResponseSchema);
  }

  async getSat(number: number): Promise<SatInfo> {
    return this.fetch(api.sat(number), SatSchema);
  }

  async getTransaction(txId: string): Promise<TransactionInfo> {
    return this.fetch(api.tx(txId), TransactionInfoSchema);
  }

  async getServerStatus(): Promise<ServerStatus> {
    return this.fetch(api.status, ServerStatusSchema);
  }
}
