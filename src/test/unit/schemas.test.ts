import { expect, test, describe } from 'bun:test';
import {
  BlockInfoSchema,
  BlockHashSchema,
  BlocksResponseSchema,
} from '../../schemas/block';
import { AddressInfoSchema } from '../../schemas/address';
import {
  InputSchema,
  OutputSchema,
  TransactionSchema,
} from '../../schemas/transaction';
import {
  InscriptionSchema,
  InscriptionsResponseSchema,
} from '../../schemas/inscription';
import { OutputInfoSchema } from '../../schemas/output';
import { RuneSchema, RunesResponseSchema } from '../../schemas/rune';
import { SatSchema } from '../../schemas/sat';
import { ServerStatusSchema } from '../../schemas/status';
import {
  GENESIS_BLOCK,
  SAMPLE_ADDRESS_INFO,
  SAMPLE_BLOCKS_RESPONSE,
  SAMPLE_TRANSACTION,
  SAMPLE_INPUT,
  SAMPLE_OUTPUT,
  SAMPLE_RUNE_BALANCE,
  SAMPLE_INSCRIPTION,
  SAMPLE_INSCRIPTIONS_RESPONSE,
  SAMPLE_UTXO_INFO,
  SAMPLE_RUNE,
  SAMPLE_STATUS,
  SAMPLE_SAT,
} from '../data/test-data';

describe('Schema Validation', () => {
  describe('Tx Schemas', () => {
    describe('TxInputSchema', () => {
      test('validates valid input', () => {
        expect(InputSchema.safeParse(SAMPLE_INPUT).success).toBe(true);
      });

      test('rejects invalid sequence', () => {
        const invalidTxInput = {
          ...SAMPLE_INPUT,
          sequence: -1,
        };
        expect(InputSchema.safeParse(invalidTxInput).success).toBe(false);
      });

      test('rejects missing field', () => {
        const { script_sig, ...invalidTxInput } = SAMPLE_INPUT;
        expect(InputSchema.safeParse(invalidTxInput).success).toBe(false);
      });
    });

    describe('OutputSchema', () => {
      test('validates valid output', () => {
        expect(OutputSchema.safeParse(SAMPLE_OUTPUT).success).toBe(true);
      });

      test('rejects negative value', () => {
        const invalidOutput = {
          ...SAMPLE_OUTPUT,
          value: -5000000000,
        };
        expect(OutputSchema.safeParse(invalidOutput).success).toBe(false);
      });

      test('rejects missing script_pubkey', () => {
        const { script_pubkey, ...invalidOutput } = SAMPLE_OUTPUT;
        expect(OutputSchema.safeParse(invalidOutput).success).toBe(false);
      });
    });

    describe('TxSchema', () => {
      test('validates valid transaction', () => {
        expect(TransactionSchema.safeParse(SAMPLE_TRANSACTION).success).toBe(true);
      });

      test('rejects invalid version', () => {
        const invalidTx = {
          ...SAMPLE_TRANSACTION,
          version: -1,
        };
        expect(TransactionSchema.safeParse(invalidTx).success).toBe(false);
      });

      test('rejects invalid input array', () => {
        const invalidTx = {
          ...SAMPLE_TRANSACTION,
          input: [{ invalid: 'data' }],
        };
        expect(TransactionSchema.safeParse(invalidTx).success).toBe(false);
      });
    });
  });

  describe('Block Schemas', () => {
    describe('BlockHashSchema', () => {
      test('validates valid block hash', () => {
        const validHash = GENESIS_BLOCK.hash;
        expect(BlockHashSchema.safeParse(validHash).success).toBe(true);
      });

      test('rejects invalid length', () => {
        const shortHash = GENESIS_BLOCK.hash.slice(0, -1);
        expect(BlockHashSchema.safeParse(shortHash).success).toBe(false);
      });

      test('rejects non-hex characters', () => {
        const invalidHash = GENESIS_BLOCK.hash.replace('0', 'g');
        expect(BlockHashSchema.safeParse(invalidHash).success).toBe(false);
      });
    });

    describe('BlocksResponseSchema', () => {
      test('validates valid blocks response', () => {
        expect(
          BlocksResponseSchema.safeParse(SAMPLE_BLOCKS_RESPONSE).success,
        ).toBe(true);
      });

      test('validates empty blocks response', () => {
        const emptyResponse = {
          last: 0,
          blocks: [],
          featured_blocks: {},
        };
        expect(BlocksResponseSchema.safeParse(emptyResponse).success).toBe(
          true,
        );
      });

      test('rejects invalid last height', () => {
        const invalidResponse = {
          ...SAMPLE_BLOCKS_RESPONSE,
          last: -1,
        };
        expect(BlocksResponseSchema.safeParse(invalidResponse).success).toBe(
          false,
        );
      });
    });

    describe('BlockSchema', () => {
      test('validates valid block', () => {
        expect(BlockInfoSchema.safeParse(GENESIS_BLOCK).success).toBe(true);
      });

      test('rejects invalid block height type', () => {
        const invalidBlock = {
          ...GENESIS_BLOCK,
          best_height: '864325',
        };
        expect(BlockInfoSchema.safeParse(invalidBlock).success).toBe(false);
      });

      test('rejects invalid block hash', () => {
        const invalidBlock = {
          ...GENESIS_BLOCK,
          hash: 'invalid_hash',
        };
        expect(BlockInfoSchema.safeParse(invalidBlock).success).toBe(false);
      });

      test('rejects negative height', () => {
        const invalidBlock = {
          ...GENESIS_BLOCK,
          height: -1,
        };
        expect(BlockInfoSchema.safeParse(invalidBlock).success).toBe(false);
      });
    });
  });

  describe('Address Schemas', () => {
    describe('AddressInfoSchema', () => {
      test('validates valid address info', () => {
        expect(AddressInfoSchema.safeParse(SAMPLE_ADDRESS_INFO).success).toBe(
          true,
        );
      });

      test('validates empty arrays', () => {
        const emptyAddressInfo = {
          outputs: [],
          inscriptions: [],
          sat_balance: 0,
          runes_balances: [],
        };
        expect(AddressInfoSchema.safeParse(emptyAddressInfo).success).toBe(
          true,
        );
      });

      test('rejects negative sat balance', () => {
        const invalidAddress = {
          ...SAMPLE_ADDRESS_INFO,
          sat_balance: -1,
        };
        expect(AddressInfoSchema.safeParse(invalidAddress).success).toBe(false);
      });

      test('rejects invalid runes_balances format', () => {
        const invalidAddress = {
          ...SAMPLE_ADDRESS_INFO,
          runes_balances: [['TEST•RUNE', 100, '🎯']],
        };
        expect(AddressInfoSchema.safeParse(invalidAddress).success).toBe(false);
      });
    });
  });

  describe('Inscription Schemas', () => {
    describe('InscriptionSchema', () => {
      test('validates valid inscription', () => {
        const result = InscriptionSchema.safeParse(SAMPLE_INSCRIPTION);
        expect(result.success).toBe(true);
      });

      test('rejects invalid charm value', () => {
        const inscriptionWithInvalidCharm = {
          ...SAMPLE_INSCRIPTION,
          charms: ['invalid_charm'],
        };
        const result = InscriptionSchema.safeParse(inscriptionWithInvalidCharm);
        expect(result.success).toBe(false);
      });

      test('validates empty arrays', () => {
        const inscriptionWithEmptyArrays = {
          ...SAMPLE_INSCRIPTION,
          charms: [],
          children: [],
          parents: [],
        };
        const result = InscriptionSchema.safeParse(inscriptionWithEmptyArrays);
        expect(result.success).toBe(true);
      });

      test('validates all nullable fields', () => {
        const nullableInscription = {
          ...SAMPLE_INSCRIPTION,
          address: null,
          next: null,
          previous: null,
          rune: null,
          sat: null,
          metaprotocol: null,
        };
        const result = InscriptionSchema.safeParse(nullableInscription);
        expect(result.success).toBe(true);
      });

      test('validates without optional fields', () => {
        const { children_count, metaprotocol, ...minimalInscription } =
          SAMPLE_INSCRIPTION;
        const result = InscriptionSchema.safeParse(minimalInscription);
        expect(result.success).toBe(true);
      });

      test('rejects negative values', () => {
        const inscriptionWithNegatives = {
          ...SAMPLE_INSCRIPTION,
          content_length: -1,
          fee: -1,
          value: -1,
        };
        const result = InscriptionSchema.safeParse(inscriptionWithNegatives);
        expect(result.success).toBe(false);
      });
    });

    describe('InscriptionsResponseSchema', () => {
      test('validates valid response', () => {
        const result = InscriptionsResponseSchema.safeParse(
          SAMPLE_INSCRIPTIONS_RESPONSE,
        );
        expect(result.success).toBe(true);
      });

      test('rejects invalid types', () => {
        const invalidResponse = {
          SAMPLE_INSCRIPTIONS_RESPONSE,
          ids: [123],
          page_index: -1,
        };
        const result = InscriptionsResponseSchema.safeParse(invalidResponse);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Output Info Schemas', () => {
    describe('OutputInfoSchema', () => {
      test('validates valid output', () => {
        const result = OutputInfoSchema.safeParse(SAMPLE_UTXO_INFO);
        expect(result.success).toBe(true);
      });

      test('rejects negative value', () => {
        const invalidOutput = {
          ...SAMPLE_UTXO_INFO,
          value: -1,
        };
        const result = OutputInfoSchema.safeParse(invalidOutput);
        expect(result.success).toBe(false);
      });

      test('validates without optional fields', () => {
        const { runes, ...minimalOutput } = SAMPLE_UTXO_INFO;
        const result = OutputInfoSchema.safeParse(minimalOutput);
        expect(result.success).toBe(true);
      });

      test('validates all nullable fields', () => {
        const minimalOutput = {
          ...SAMPLE_UTXO_INFO,
          inscriptions: [],
          runes: {},
          sat_ranges: null,
        };
        const result = OutputInfoSchema.safeParse(minimalOutput);
        expect(result.success).toBe(true);
      });

      test('rejests invalid field types', () => {
        const invalidOutput = {
          ...SAMPLE_UTXO_INFO,
          inscriptions: 'invalid',
          runes: -1,
          sat_ranges: [[0]],
        };
        const result = OutputInfoSchema.safeParse(invalidOutput);
        expect(result.success).toBe(false);
      });

      test('rejects invalid sat ranges format', () => {
        const invalidOutput = {
          ...SAMPLE_UTXO_INFO,
          sat_ranges: [[0]],
        };
        const result = OutputInfoSchema.safeParse(invalidOutput);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Rune Schemas', () => {
    describe('RuneSchema', () => {
      test('validates valid rune', () => {
        const result = RuneSchema.safeParse(SAMPLE_RUNE);
        expect(result.success).toBe(true);
      });

      test('validates nullable field', () => {
        const runeWithNullSymbol = {
          ...SAMPLE_RUNE,
          symbol: null,
        };
        const result = RuneSchema.safeParse(runeWithNullSymbol);
        expect(result.success).toBe(true);
      });

      test('fails with negative numbers', () => {
        const invalidRune = {
          ...SAMPLE_RUNE,
          block: -1,
          burned: -1,
          mints: -1,
        };
        const result = RuneSchema.safeParse(invalidRune);
        expect(result.success).toBe(false);
      });

      test('validates RunesResponse structure', () => {
        const validResponse = {
          entries: [['TEST•RUNE', SAMPLE_RUNE]],
          more: true,
          prev: 1,
          next: 3,
        };
        const result = RunesResponseSchema.safeParse(validResponse);
        expect(result.success).toBe(true);
      });

      test('validates RunesResponse with null values', () => {
        const responseWithNulls = {
          entries: [['TEST•RUNE', SAMPLE_RUNE]],
          more: false,
          prev: null,
          next: null,
        };
        const result = RunesResponseSchema.safeParse(responseWithNulls);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Sat Schema', () => {
    describe('SatSchema', () => {
      test('validates valid sat', () => {
        const result = SatSchema.safeParse(SAMPLE_SAT);
        expect(result.success).toBe(true);
      });

      test('validates nullable fields', () => {
        const satWithNullSatpoint = {
          ...SAMPLE_SAT,
          satpoint: null,
        };
        const result = SatSchema.safeParse(satWithNullSatpoint);
        expect(result.success).toBe(true);
      });

      test('rejects invalid charm value', () => {
        const satWithInvalidCharm = {
          ...SAMPLE_SAT,
          charms: ['invalid_charm'],
        };
        const result = SatSchema.safeParse(satWithInvalidCharm);
        expect(result.success).toBe(false);
      });

      test('rejects invalid rarity value', () => {
        const satWithInvalidRarity = {
          ...SAMPLE_SAT,
          rarity: 'invalid_rarity',
        };
        const result = SatSchema.safeParse(satWithInvalidRarity);
        expect(result.success).toBe(false);
      });

      test('rejects negative values', () => {
        const satWithNegatives = {
          ...SAMPLE_SAT,
          number: -1,
          offset: -1,
          period: -1,
        };
        const result = SatSchema.safeParse(satWithNegatives);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Status Schema', () => {
    describe('ServerStatusSchema', () => {
      test('validates valid status', () => {
        const result = ServerStatusSchema.safeParse(SAMPLE_STATUS);
        expect(result.success).toBe(true);
      });

      test('validates nullable fields', () => {
        const statusWithNullRune = {
          ...SAMPLE_STATUS,
          minimum_rune_for_next_block: null,
        };
        const result = ServerStatusSchema.safeParse(statusWithNullRune);
        expect(result.success).toBe(true);
      });

      test('validates time fields', () => {
        const statusWithMinimalTime = {
          ...SAMPLE_STATUS,
          initial_sync_time: { secs: 0, nanos: 0 },
          uptime: { secs: 0, nanos: 0 },
        };
        const result = ServerStatusSchema.safeParse(statusWithMinimalTime);
        expect(result.success).toBe(true);
      });

      test('rejects negative values', () => {
        const statusWithNegatives = {
          ...SAMPLE_STATUS,
          height: -1,
          inscriptions: -1,
          lost_sats: -1,
        };
        const result = ServerStatusSchema.safeParse(statusWithNegatives);
        expect(result.success).toBe(false);
      });

      test('rejects invalid time fields', () => {
        const statusWithInvalidTime = {
          ...SAMPLE_STATUS,
          initial_sync_time: { secs: -1, nanos: -1 },
        };
        const result = ServerStatusSchema.safeParse(statusWithInvalidTime);
        expect(result.success).toBe(false);
      });
    });
  });
});
