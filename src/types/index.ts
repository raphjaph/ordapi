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
  RunesResponseSchema,
  SatInfoSchema,
  ServerStatusSchema,
  RuneResponseSchema,
  TransactionInfoSchema,
  RarityTypeSchema,
  OutputSchema,
  OutputTypeSchema,
} from '../schemas';

/**
 * Comprehensive information about a Bitcoin address including its balance, outputs, inscriptions, and runes balances.
 * 
 */
export type AddressInfo = z.infer<typeof AddressInfoSchema>;

/**
 * Detailed block information including height, hash, timestamp, transaction list, and inscription data.
 * 
 */
export type BlockInfo = z.infer<typeof BlockInfoSchema>;
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
 * Transaction input containing previous output reference and witness data.
 */
export type Input = z.infer<typeof InputSchema>;
/**
 * Transaction output containing value and script pubkey.
 */
export type Output = z.infer<typeof OutputSchema>;

/**
 * Information about a specific satoshi including its number, timestamp,
 * and rarity classification.
 */
export type SatInfo = z.infer<typeof SatInfoSchema>;
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
 * 
 */
export type OutputInfo = z.infer<typeof OutputInfoSchema>;
/**
 * Comprehensive information about an inscription including its content type, genesis data, location and transfer history.
 * 
 */
export type InscriptionInfo = z.infer<typeof InscriptionInfoSchema>;
/**
 * Paginated response containing a list of inscriptions and metadata.
 */
export type InscriptionsResponse = z.infer<typeof InscriptionsResponseSchema>;

/**
 * Basic information about a rune including its symbol and supply details.
 */
export type RuneInfo = z.infer<typeof RuneInfoSchema>;
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
 * 
 */
export type ServerStatus = z.infer<typeof ServerStatusSchema>;
