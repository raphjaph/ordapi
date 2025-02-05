import type { z } from 'zod';
import type {
  BlockInfoSchema,
  BlockHashSchema,
  BlocksResponseSchema,
  TransactionSchema,
  InputSchema,
  AddressInfoSchema,
  InscriptionInfoSchema,
  CharmTypeSchema,
  InscriptionsResponseSchema,
  OutputInfoSchema,
  RuneInfoSchema,
  RuneBalanceSchema,
  RunesResponseSchema,
  SatInfoSchema,
  ServerStatusSchema,
  RuneResponseSchema,
  TransactionInfoSchema,
  RarityTypeSchema,
  OutputSchema,
  OutputTypeSchema,
  BlockDetailsSchema,
  InscriptionIDSchema,
  InscriptionsIDsResponseSchema,
  ChildrenInfoResponseSchema,
  InscriptionRecursiveSchema,
  OutputAssetsSchema,
  TransactionHexSchema,
  SatRangeSchema,
  ChildInfoSchema,
} from '../schemas';

/**
 * Comprehensive information about a Bitcoin address including its balance, outputs, inscriptions, and runes balances.
 */
export type AddressInfo = z.infer<typeof AddressInfoSchema>;

/**
 * Basic block information including inscriptions and runes.
 */
export type BlockInfo = z.infer<typeof BlockInfoSchema>;
/**
 * Detailed information about given block.
 */
export type BlockDetails = z.infer<typeof BlockDetailsSchema>;
/**
 * A Bitcoin block hash represented as a hex string.
 */
export type BlockHash = z.infer<typeof BlockHashSchema>;
/**
 * Paginated response containing a list of recent blocks and metadata.
 */
export type BlocksResponse = z.infer<typeof BlocksResponseSchema>;

/**
 * Bitcoin transaction data including version, locktime, inputs and outputs.
 */
export type Transaction = z.infer<typeof TransactionSchema>;
/**
 * Extended transaction information including block details, timestamp and inscription data.
 */
export type TransactionInfo = z.infer<typeof TransactionInfoSchema>;
/**
 * Hex-encoded transaction.
 */
export type TransactionHex = z.infer<typeof TransactionHexSchema>;
/**
 * Transaction input containing previous output reference and witness data.
 */
export type Input = z.infer<typeof InputSchema>;
/**
 * Transaction output containing value and script pubkey.
 */
export type Output = z.infer<typeof OutputSchema>;
/**
 * Information about a specific satoshi including its number, timestamp, and rarity classification.
 */
export type SatInfo = z.infer<typeof SatInfoSchema>;
/**
 * A tuple representing a range of satoshis with start and end values.
 */
export type SatRange = z.infer<typeof SatRangeSchema>;
/**
 * Special characteristics or properties of a sat (e.g. "cursed", "epic", "burned").
 */
export type CharmType = z.infer<typeof CharmTypeSchema>;
/**
 * Classification of sat rarity (e.g. "common", "uncommon", "rare", "epic", "legendary").
 */
export type RarityType = z.infer<typeof RarityTypeSchema>;
/**
 * Type of UTXO output (e.g. "plain", "inscription", "rune").
 */
export type OutputType = z.infer<typeof OutputTypeSchema>;
/**
 * Detailed information about a UTXO including value, script type, and any inscriptions or runes it contains.
 */
export type OutputInfo = z.infer<typeof OutputInfoSchema>;
/**
 * Information about assets held by an UTXO.
 */
export type OutputAssets = z.infer<typeof OutputAssetsSchema>;
/**
 * Comprehensive information about an inscription including its content type, genesis data, location and transfer history.
 */
export type InscriptionInfo = z.infer<typeof InscriptionInfoSchema>;
/**
 * Comprehensive information about an inscription retrieved from recursive endpoint.
 */
export type InscriptionRecursive = z.infer<typeof InscriptionRecursiveSchema>;
/**
 * Paginated response containing a list of inscriptions IDs.
 */
export type InscriptionsResponse = z.infer<typeof InscriptionsResponseSchema>;
/**
 * Response containing a single inscription ID.
 */
export type InscriptionID = z.infer<typeof InscriptionIDSchema>;
/**
 * Paginated response containing a list of inscription IDs
 */
export type InscriptionsIDsResponse = z.infer<
  typeof InscriptionsIDsResponseSchema
>;
/**
 * Paginated response containing child inscriptions detailed info.
 */
export type ChildrenInfoResponse = z.infer<typeof ChildrenInfoResponseSchema>;
/**
 * Child inscription info retrieved from recursive endpoint.
 */
export type ChildInfo = z.infer<typeof ChildInfoSchema>;

/**
 * Basic information about a rune including its symbol and supply details.
 */
export type RuneInfo = z.infer<typeof RuneInfoSchema>;
/**
 * Basic information about a rune held by an UTXO.
 */
export type RuneBalance = z.infer<typeof RuneBalanceSchema>;
/**
 * Detailed rune information including minting status and parent.
 */
export type RuneResponse = z.infer<typeof RuneResponseSchema>;
/**
 * Paginated response containing a list of runes and metadata.
 */
export type RunesResponse = z.infer<typeof RunesResponseSchema>;

/**
 * Current status information about the ordinals server including version, height and indexing progress.
 */
export type ServerStatus = z.infer<typeof ServerStatusSchema>;
