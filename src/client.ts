import { z } from 'zod';
import api from './api';
import {
  BlockInfoSchema,
  BlockHashSchema,
  AddressInfoSchema,
  BlocksResponseSchema,
  InscriptionInfoSchema,
  InscriptionsResponseSchema,
  OutputInfoSchema,
  RuneResponseSchema,
  RunesResponseSchema,
  SatInfoSchema,
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

  /**
   * Retrieves information about a specific address including its outputs,
   * inscriptions, and rune balances.
   *
   * @param {string} address - Bitcoin address to query.
   * @returns {Promise<AddressInfo>} Address details including outputs and balances.
   */
  async getAddressInfo(address: string): Promise<AddressInfo> {
    return this.fetch(api.address(address), AddressInfoSchema);
  }

  /**
   * Fetches details about a specific block by its height or hash.
   *
   * @param {number | BlockHash} heightOrHash - Block height (number) or block hash (string).
   * @returns {Promise<BlockInfo>} Detailed information about the block.
   */
  async getBlock(heightOrHash: number | BlockHash): Promise<BlockInfo> {
    return this.fetch(api.block(heightOrHash), BlockInfoSchema);
  }

  /**
   * Retrieves the total number of blocks in the blockchain.
   *
   * @returns {Promise<number>} Current block count
   */
  async getBlockCount(): Promise<number> {
    return this.fetch(api.blockcount, z.number().int().nonnegative());
  }

  /**
   * Gets the hash of a block at the specified height.
   *
   * @param {number} height - Block height to get hash for
   * @returns {Promise<BlockHash>} Block hash
   */
  async getBlockHashByHeight(height: number): Promise<BlockHash> {
    return this.fetch(api.blockhash.byHeight(height), BlockHashSchema);
  }

  /**
   * Gets the hash of the latest block.
   *
   * @returns {Promise<BlockHash>} Latest block hash
   */
  async getLatestBlockHash(): Promise<BlockHash> {
    return this.fetch(api.blockhash.latest, BlockHashSchema);
  }

  /**
   * Gets the height of the latest block.
   *
   * @returns {Promise<number>} Latest block height
   */
  async getLatestBlockHeight(): Promise<number> {
    return this.fetch(api.blockheight, z.number().int().nonnegative());
  }

  /**
   * Returns the height of the latest block, the blockhashes of the last 100 blocks, and featured inscriptions from them.
   *
   * @returns {Promise<BlocksResponse>} Latest blocks information
   */
  async getLatestBlocks(): Promise<BlocksResponse> {
    return this.fetch(api.blocks, BlocksResponseSchema);
  }

  /**
   * Gets the timestamp of the latest block.
   *
   * @returns {Promise<number>} Latest block's Unix timestamp
   */
  async getLatestBlockTime(): Promise<number> {
    return this.fetch(api.blocktime, z.number().int());
  }

  /**
   * Retrieves information about a specific inscription by its ID.
   *
   * @param {string} id - Inscription ID
   * @returns {Promise<InscriptionInfo>} Detailed information about the inscription
   */
  async getInscription(id: string): Promise<InscriptionInfo> {
    return this.fetch(api.inscription(id), InscriptionInfoSchema);
  }

  /**
   * Gets a specific child inscription of a parent inscription.
   *
   * @param {string} id - Parent inscription ID
   * @param {number} child - Index of the child inscription
   * @returns {Promise<InscriptionInfo>} Child inscription details
   */
  async getInscriptionChild(
    id: string,
    child: number,
  ): Promise<InscriptionInfo> {
    return this.fetch(api.inscriptionChild(id, child), InscriptionInfoSchema);
  }

  /**
   * Gets a list of the 100 most recent inscriptions.
   *
   * @returns {Promise<InscriptionsResponse>} Latest inscriptions information
   */
  async getLatestInscriptions(): Promise<InscriptionsResponse> {
    return this.fetch(api.inscriptions.latest, InscriptionsResponseSchema);
  }

  /**
   * Retrieves information about multiple inscriptions by their IDs.
   *
   * @param {string[]} ids - Array of inscription IDs to fetch
   * @returns {Promise<InscriptionInfo[]>} Array of inscription details
   */
  async getInscriptionsByIds(ids: string[]): Promise<InscriptionInfo[]> {
    return this.fetchPost(
      api.inscriptions.base,
      ids,
      z.array(InscriptionInfoSchema),
    );
  }

  /**
   * Gets inscriptions for a specific page number in paginated results.
   *
   * @param {number} page - Page number to fetch
   * @returns {Promise<InscriptionsResponse>} Page of inscriptions
   */
  async getInscriptionsByPage(page: number): Promise<InscriptionsResponse> {
    return this.fetch(
      api.inscriptions.byPage(page),
      InscriptionsResponseSchema,
    );
  }

  /**
   * Gets all inscriptions in a specific block.
   *
   * @param {number} height - Block height to fetch inscriptions from
   * @returns {Promise<InscriptionsResponse>} Block's inscriptions
   */
  async getInscriptionsByBlock(height: number): Promise<InscriptionsResponse> {
    return this.fetch(
      api.inscriptions.byBlock(height),
      InscriptionsResponseSchema,
    );
  }

  /**
   * Retrieves information about a specific UTXO.
   *
   * @param {string} outpoint - Transaction outpoint in format {txid}:{vout}
   * @returns {Promise<OutputInfo>} UTXO details
   */
  async getOutput(outpoint: string): Promise<OutputInfo> {
    return this.fetch(api.output(outpoint), OutputInfoSchema);
  }

  /**
   * Gets information about multiple UTXOs.
   *
   * @param {string[]} outpoints - Array of outpoints to fetch
   * @returns {Promise<OutputInfo[]>} Array of UTXO details
   */
  async getOutputs(outpoints: string[]): Promise<OutputInfo[]> {
    return this.fetchPost(
      api.outputs.base,
      outpoints,
      z.array(OutputInfoSchema),
    );
  }

  /**
   * Gets all UTXOs for a specific address, optionally filtered by type.
   *
   * @param {string} address - Bitcoin address to get outputs for
   * @param {OutputType} [type] - Optional filter for specific output types
   * @returns {Promise<OutputInfo[]>} Array of address's UTXOs
   */
  async getOutputsByAddress(
    address: string,
    type?: OutputType,
  ): Promise<OutputInfo[]> {
    return this.fetch(
      api.outputs.byAddress(address, type),
      z.array(OutputInfoSchema),
    );
  }

  /**
   * Gets information about a specific rune by name.
   *
   * @param {string} name - Rune name
   * @returns {Promise<RuneResponse>} Rune details
   */
  async getRune(name: string): Promise<RuneResponse> {
    return this.fetch(api.rune(name), RuneResponseSchema);
  }

  /**
   * Gets a list of the 100 most recent runes.
   *
   * @returns {Promise<RunesResponse>} Latest runes information
   */
  async getLatestRunes(): Promise<RunesResponse> {
    return this.fetch(api.runes.latest, RunesResponseSchema);
  }

  /**
   * Gets runes for a specific page number in paginated results.
   *
   * @param {number} page - Page number to fetch
   * @returns {Promise<RunesResponse>} Page of runes
   */
  async getRunesByPage(page: number): Promise<RunesResponse> {
    return this.fetch(api.runes.byPage(page), RunesResponseSchema);
  }

  /**
   * Gets information about a specific satoshi by its number.
   *
   * @param {number} number - Satoshi number
   * @returns {Promise<SatInfo>} Satoshi details
   */
  async getSat(number: number): Promise<SatInfo> {
    return this.fetch(api.sat(number), SatInfoSchema);
  }

  /**
   * Gets information about a specific transaction.
   *
   * @param {string} txId - Transaction ID
   * @returns {Promise<TransactionInfo>} Transaction details
   */
  async getTransaction(txId: string): Promise<TransactionInfo> {
    return this.fetch(api.tx(txId), TransactionInfoSchema);
  }

  /**
   * Gets the current server status and information.
   *
   * @returns {Promise<ServerStatus>} Server status details
   */
  async getServerStatus(): Promise<ServerStatus> {
    return this.fetch(api.status, ServerStatusSchema);
  }
}
