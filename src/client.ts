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
  BlockDetailsSchema,
  InscriptionsIDsResponseSchema,
  ChildrenInfoResponseSchema,
  InscriptionIDSchema,
  OutputAssetsSchema,
  TransactionHexSchema,
  InscriptionRecursiveSchema,
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
  BlockDetails,
  InscriptionsIDsResponse,
  ChildrenInfoResponse,
  InscriptionID,
  OutputAssets,
  TransactionHex,
  InscriptionRecursive,
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
   */
  async getAddressInfo(address: string): Promise<AddressInfo> {
    return this.fetch(api.getAddressInfo(address), AddressInfoSchema);
  }

  /**
   * Fetches details about a specific block by its height or hash.
   *
   * @param {number | BlockHash} heightOrHash - Block height (number) or block hash (string).
   */
  async getBlockInfo(heightOrHash: number | BlockHash): Promise<BlockInfo> {
    return this.fetch(api.getBlockInfo(heightOrHash), BlockInfoSchema);
  }

  /**
   * Gets detailed block information using the recursive endpoint.
   *
   * @param {number | string} heightOrHash - Block height or hash
   */
  async getBlockInfoRecursive(
    heightOrHash: number | string,
  ): Promise<BlockDetails> {
    return this.fetch(
      api.getBlockInfoRecursive(heightOrHash),
      BlockDetailsSchema,
    );
  }

  /**
   * Retrieves the total number of blocks in the blockchain.
   */
  async getBlockCount(): Promise<number> {
    return this.fetch(api.getBlockCount, z.number().int().nonnegative());
  }

  /**
   * Gets the hash of the latest block.
   */
  async getBlockHash(): Promise<BlockHash> {
    return this.fetch(api.getBlockHash, BlockHashSchema);
  }

  /**
   * Gets the latest block hash using the recursive endpoint.
   *
   * @returns {Promise<BlockHash>} Latest block hash
   */
  async getBlockHashRecursive(): Promise<BlockHash> {
    return this.fetch(api.getBlockHashRecursive, BlockHashSchema);
  }

  /**
   * Gets the hash of a block at the specified height.
   *
   * @param {number} height - Block height to get hash for
   */
  async getBlockHashByHeight(height: number): Promise<BlockHash> {
    return this.fetch(api.getBlockHashByHeight(height), BlockHashSchema);
  }

  /**
   * Gets the block hash using the recursive endpoint.
   *
   * @param {number} height - Block height
   */
  async getBlockHashByHeightRecursive(height: number): Promise<BlockHash> {
    return this.fetch(
      api.getBlockHashByHeightRecursive(height),
      BlockHashSchema,
    );
  }

  /**
   * Gets the height of the latest block.
   */
  async getBlockHeight(): Promise<number> {
    return this.fetch(api.getBlockHeight, z.number().int().nonnegative());
  }

  /**
   * Gets the latest block height using the recursive endpoint.
   */
  async getBlockHeightRecursive(): Promise<number> {
    return this.fetch(
      api.getBlockHeightRecursive,
      z.number().int().nonnegative(),
    );
  }

  /**
   * Returns the height of the latest block, the blockhashes of the last 100 blocks, and featured inscriptions from them.
   */
  async getBlocksLatest(): Promise<BlocksResponse> {
    return this.fetch(api.getBlocksLatest, BlocksResponseSchema);
  }

  /**
   * Gets the timestamp of the latest block.
   */
  async getBlockTime(): Promise<number> {
    return this.fetch(api.getBlockTime, z.number().int());
  }

  /**
   * Gets block time using the recursive endpoint.
   */
  async getBlockTimeRecursive(): Promise<number> {
    return this.fetch(api.getBlockTimeRecursive, z.number().int());
  }

  /**
   * Retrieves information about a specific inscription by its ID.
   *
   * @param {string} id - Inscription ID
   */
  async getInscriptionInfo(id: string): Promise<InscriptionInfo> {
    return this.fetch(api.getInscriptionInfo(id), InscriptionInfoSchema);
  }

  /**
   * Gets recursive inscription information.
   *
   * @param {string} id - Inscription ID
   */
  async getInscriptionRecursive(id: string): Promise<InscriptionRecursive> {
    return this.fetch(
      api.getInscriptionRecursive(id),
      InscriptionRecursiveSchema,
    );
  }

  /**
   * Gets a list of the 100 most recent inscriptions.
   */
  async getInscriptions(): Promise<InscriptionsResponse> {
    return this.fetch(api.getInscriptions, InscriptionsResponseSchema);
  }

  /**
   * Retrieves information about multiple inscriptions by their IDs.
   *
   * @param {string[]} ids - Array of inscription IDs to fetch
   */
  async getInscriptionsByIds(ids: string[]): Promise<InscriptionInfo[]> {
    return this.fetchPost(
      api.getInscriptionsByIds,
      ids,
      z.array(InscriptionInfoSchema),
    );
  }

  /**
   * Gets inscriptions for a specific page number in paginated results.
   *
   * @param {number} page - Page number to fetch
   */
  async getInscriptionsByPage(page: number): Promise<InscriptionsResponse> {
    return this.fetch(
      api.getInscriptionsByPage(page),
      InscriptionsResponseSchema,
    );
  }

  /**
   * Gets all inscriptions in a specific block.
   *
   * @param {number} height - Block height to fetch inscriptions from
   */
  async getInscriptionsByBlock(height: number): Promise<InscriptionsResponse> {
    return this.fetch(
      api.getInscriptionsByBlock(height),
      InscriptionsResponseSchema,
    );
  }

  /**
   * Gets ID of a specific inscription at an index by sat number. The inscription id at index of all inscriptions on a sat. Index may be a negative number to index from the back. 0 being the first and -1 being the most recent for example. Requires index with --index-sats flag.
   *
   * @param {number} number - Satoshi number
   * @param {number} index - Inscription index
   */
  async getInscriptionOnSat(
    number: number,
    index: number,
  ): Promise<InscriptionID> {
    return this.fetch(
      api.getInscriptionOnSat(number, index),
      InscriptionIDSchema,
    );
  }

  /**
   * Gets the first 100 inscription ids on a sat. Requires index with --index-sats flag.
   *
   * @param {number} number - Satoshi number
   */
  async getInscriptionsOnSat(number: number): Promise<InscriptionsIDsResponse> {
    return this.fetch(
      api.getInscriptionsOnSat(number),
      InscriptionsIDsResponseSchema,
    );
  }

  /**
   * Gets paginated inscription ids for a specific satoshi.
   *
   * @param {number} number - Satoshi number
   * @param {number} page - Page number
   */
  async getInscriptionsOnSatByPage(
    number: number,
    page: number,
  ): Promise<InscriptionsIDsResponse> {
    return this.fetch(
      api.getInscriptionsOnSatByPage(number, page),
      InscriptionsIDsResponseSchema,
    );
  }

  /**
   * Gets a specific child inscription of a parent inscription.
   *
   * @param {string} id - Parent inscription ID
   * @param {number} child - Index of the child inscription
   */
  async getChild(id: string, child: number): Promise<InscriptionInfo> {
    return this.fetch(api.getChild(id, child), InscriptionInfoSchema);
  }

  /**
   * Gets first 100 child inscriptions IDs.
   *
   * @param {string} id - Parent inscription ID
   */
  async getChildren(id: string): Promise<InscriptionsIDsResponse> {
    return this.fetch(api.getChildren(id), InscriptionsIDsResponseSchema);
  }

  /**
   * Gets paginated child inscription IDs.
   *
   * @param {string} id - Parent inscription ID
   * @param {number} page - Page number
   */
  async getChildrenByPage(
    id: string,
    page: number,
  ): Promise<InscriptionsIDsResponse> {
    return this.fetch(
      api.getChildrenByPage(id, page),
      InscriptionsIDsResponseSchema,
    );
  }

  /**
   * Gets details of the first 100 child inscriptions.
   *
   * @param {string} id - Parent inscription ID
   */
  async getChildrenInfo(id: string): Promise<ChildrenInfoResponse> {
    return this.fetch(api.getChildrenInfo(id), ChildrenInfoResponseSchema);
  }

  /**
   * Gets paginated detailed child inscription information.
   *
   * @param {string} id - Parent inscription ID
   * @param {number} page - Page number
   */
  async getChildrenInfoByPage(
    id: string,
    page: number,
  ): Promise<ChildrenInfoResponse> {
    return this.fetch(
      api.getChildrenInfoByPage(id, page),
      ChildrenInfoResponseSchema,
    );
  }

  /**
   * Gets parent inscription IDs.
   *
   * @param {string} id - Child inscription ID
   */
  async getParents(id: string): Promise<InscriptionsResponse> {
    return this.fetch(api.getParents(id), InscriptionsResponseSchema);
  }

  /**
   * Gets paginated parent inscription IDs.
   *
   * @param {string} id - Child inscription ID
   * @param {number} page - Page number
   */
  async getParentsByPage(
    id: string,
    page: number,
  ): Promise<InscriptionsResponse> {
    return this.fetch(
      api.getParentsByPage(id, page),
      InscriptionsResponseSchema,
    );
  }

  /**
   * Retrieves information about a specific UTXO.
   *
   * @param {string} outpoint - Transaction outpoint in format {txid}:{vout}
   */
  async getOutput(outpoint: string): Promise<OutputInfo> {
    return this.fetch(api.getOutput(outpoint), OutputInfoSchema);
  }

  /**
   * Gets assets held by an UTXO.
   *
   * @param {string} outpoint - Transaction outpoint
   */
  async getOutputAssets(outpoint: string): Promise<OutputAssets> {
    return this.fetch(api.getOutputAssets(outpoint), OutputAssetsSchema);
  }

  /**
   * Gets information about multiple UTXOs.
   *
   * @param {string[]} outpoints - Array of outpoints to fetch
   */
  async getOutputs(outpoints: string[]): Promise<OutputInfo[]> {
    return this.fetchPost(api.getOutputs, outpoints, z.array(OutputInfoSchema));
  }

  /**
   * Gets all UTXOs for a specific address, optionally filtered by type.
   *
   * @param {string} address - Bitcoin address to get outputs for
   * @param {OutputType} [type] - Optional filter for specific output types
   */
  async getOutputsByAddress(
    address: string,
    type?: OutputType,
  ): Promise<OutputInfo[]> {
    return this.fetch(
      api.getOutputsByAddress(address, type),
      z.array(OutputInfoSchema),
    );
  }

  /**
   * Gets information about a specific rune by name.
   *
   * @param {string} name - Rune name
   */
  async getRune(name: string): Promise<RuneResponse> {
    return this.fetch(api.getRune(name), RuneResponseSchema);
  }

  /**
   * Gets a list of the 100 most recent runes.
   */
  async getRunesLatest(): Promise<RunesResponse> {
    return this.fetch(api.getRunesLatest, RunesResponseSchema);
  }

  /**
   * Gets runes for a specific page number in paginated results.
   *
   * @param {number} page - Page number to fetch
   */
  async getRunesByPage(page: number): Promise<RunesResponse> {
    return this.fetch(api.getRunesByPage(page), RunesResponseSchema);
  }

  /**
   * Gets information about a specific satoshi by its number.
   *
   * @param {number} number - Satoshi number
   */
  async getSat(number: number): Promise<SatInfo> {
    return this.fetch(api.getSat(number), SatInfoSchema);
  }

  /**
   * Gets information about a specific transaction.
   *
   * @param {string} txId - Transaction ID
   */
  async getTransaction(txId: string): Promise<TransactionInfo> {
    return this.fetch(api.getTransaction(txId), TransactionInfoSchema);
  }

  /**
   * Gets hex transaction data.
   *
   * @param {string} txid - Transaction ID
   */
  async getTransactionHex(txid: string): Promise<TransactionHex> {
    return this.fetch(api.getTransactionHex(txid), TransactionHexSchema);
  }

  /**
   * Gets the current server status and information.
   */
  async getServerStatus(): Promise<ServerStatus> {
    return this.fetch(api.getServerStatus, ServerStatusSchema);
  }
}
