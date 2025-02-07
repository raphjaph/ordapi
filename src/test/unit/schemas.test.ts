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
  TransactionHexSchema,
  TransactionSchema,
} from '../../schemas/transaction';
import {
  ChildInfoSchema,
  ChildrenInfoResponseSchema,
  InscriptionIDSchema,
  InscriptionInfoSchema,
  InscriptionRecursiveSchema,
  InscriptionsResponseSchema,
} from '../../schemas/inscription';
import {
  OutputAssetsSchema,
  OutputInfoSchema,
  SatRangeSchema,
} from '../../schemas/output';
import {
  RuneBalanceSchema,
  RuneInfoSchema,
  RunesResponseSchema,
} from '../../schemas/rune';
import { SatInfoSchema } from '../../schemas/sat';
import { ServerStatusSchema } from '../../schemas/status';
import {
  GENESIS_BLOCK,
  SAMPLE_ADDRESS_INFO,
  SAMPLE_BLOCKS_RESPONSE,
  SAMPLE_TRANSACTION,
  SAMPLE_INPUT,
  SAMPLE_OUTPUT,
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
        expect(TransactionSchema.safeParse(SAMPLE_TRANSACTION).success).toBe(
          true,
        );
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

    describe('TransactionHexSchema', () => {
      test('validates valid hex string', () => {
        expect(TransactionHexSchema.safeParse('0123456789abcdef').success).toBe(
          true,
        );
      });

      test('rejects non-hex characters', () => {
        expect(
          TransactionHexSchema.safeParse('0123456789abcdefg').success,
        ).toBe(false);
      });

      test('rejects uppercase hex', () => {
        expect(TransactionHexSchema.safeParse('0123456789ABCDEF').success).toBe(
          false,
        );
      });
    });

    describe('OutputAssetsSchema', () => {
      test('validates valid output assets', () => {
        const validAssets = {
          inscriptions: [],
          runes: {},
          sat_ranges: [],
          value: 1000,
        };
        expect(OutputAssetsSchema.safeParse(validAssets).success).toBe(true);
      });

      test('validates null fields', () => {
        const validAssets = {
          inscriptions: null,
          runes: null,
          sat_ranges: null,
          value: 1000,
        };
        expect(OutputAssetsSchema.safeParse(validAssets).success).toBe(true);
      });

      test('rejects negative value', () => {
        const invalidAssets = {
          inscriptions: [],
          runes: {},
          sat_ranges: [],
          value: -1000,
        };
        expect(OutputAssetsSchema.safeParse(invalidAssets).success).toBe(false);
      });
    });

    describe('SatRangeSchema', () => {
      test('validates valid sat range', () => {
        expect(SatRangeSchema.safeParse([0, 1000]).success).toBe(true);
      });

      test('rejects negative numbers', () => {
        expect(SatRangeSchema.safeParse([-1, 1000]).success).toBe(false);
        expect(SatRangeSchema.safeParse([0, -1000]).success).toBe(false);
      });

      test('rejects wrong tuple length', () => {
        expect(SatRangeSchema.safeParse([0]).success).toBe(false);
        expect(SatRangeSchema.safeParse([0, 1000, 2000]).success).toBe(false);
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
    describe('InscriptionInfoSchema', () => {
      test('validates valid inscription', () => {
        const result = InscriptionInfoSchema.safeParse(SAMPLE_INSCRIPTION);
        expect(result.success).toBe(true);
      });

      test('rejects invalid charm value', () => {
        const inscriptionWithInvalidCharm = {
          ...SAMPLE_INSCRIPTION,
          charms: ['invalid_charm'],
        };
        const result = InscriptionInfoSchema.safeParse(
          inscriptionWithInvalidCharm,
        );
        expect(result.success).toBe(false);
      });

      test('validates empty arrays', () => {
        const inscriptionWithEmptyArrays = {
          ...SAMPLE_INSCRIPTION,
          charms: [],
          children: [],
          parents: [],
        };
        const result = InscriptionInfoSchema.safeParse(
          inscriptionWithEmptyArrays,
        );
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
        const result = InscriptionInfoSchema.safeParse(nullableInscription);
        expect(result.success).toBe(true);
      });

      test('rejects negative values', () => {
        const inscriptionWithNegatives = {
          ...SAMPLE_INSCRIPTION,
          content_length: -1,
          fee: -1,
          value: -1,
        };
        const result = InscriptionInfoSchema.safeParse(
          inscriptionWithNegatives,
        );
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

    describe('InscriptionRecursiveSchema', () => {
      test('validates valid recursive inscription', () => {
        const validInscription = {
          charms: ['rare', 'uncommon'],
          content_type: 'text/plain',
          content_length: 100,
          delegate: null,
          fee: 1000,
          height: 1000,
          id: 'abc123',
          number: 1,
          output: 'txid:0',
          sat: 1000,
          satpoint: 'txid:0:0',
          timestamp: 1234567890,
          value: 1000,
          address: 'bc1...',
        };
        expect(
          InscriptionRecursiveSchema.safeParse(validInscription).success,
        ).toBe(true);
      });

      test('validates null fields', () => {
        const validInscription = {
          charms: [],
          content_type: null,
          content_length: null,
          delegate: null,
          fee: 1000,
          height: 1000,
          id: 'abc123',
          number: 1,
          output: 'txid:0',
          sat: null,
          satpoint: 'txid:0:0',
          timestamp: 1234567890,
          value: null,
          address: null,
        };
        expect(
          InscriptionRecursiveSchema.safeParse(validInscription).success,
        ).toBe(true);
      });
    });

    describe('ChildInfoSchema', () => {
      test('validates valid child info', () => {
        const validChild = {
          charms: ['rare'],
          fee: 1000,
          height: 1000,
          id: 'abc123',
          number: 1,
          output: 'txid:0',
          sat: 1000,
          satpoint: 'txid:0:0',
          timestamp: 1234567890,
        };
        expect(ChildInfoSchema.safeParse(validChild).success).toBe(true);
      });

      test('rejects negative numbers', () => {
        const invalidChild = {
          charms: ['rare'],
          fee: -1000,
          height: 1000,
          id: 'abc123',
          number: 1,
          output: 'txid:0',
          sat: 1000,
          satpoint: 'txid:0:0',
          timestamp: 1234567890,
        };
        expect(ChildInfoSchema.safeParse(invalidChild).success).toBe(false);
      });
    });

    describe('ChildrenInfoResponseSchema', () => {
      test('validates valid children info response', () => {
        const validResponse = {
          children: [],
          more: false,
          page: 0,
        };
        expect(
          ChildrenInfoResponseSchema.safeParse(validResponse).success,
        ).toBe(true);
      });

      test('rejects negative page number', () => {
        const invalidResponse = {
          children: [],
          more: false,
          page: -1,
        };
        expect(
          ChildrenInfoResponseSchema.safeParse(invalidResponse).success,
        ).toBe(false);
      });
    });

    describe('InscriptionIDSchema', () => {
      test('validates valid inscription ID', () => {
        expect(InscriptionIDSchema.safeParse({ id: 'abc123' }).success).toBe(
          true,
        );
      });

      test('validates null ID', () => {
        expect(InscriptionIDSchema.safeParse({ id: null }).success).toBe(true);
      });

      test('rejects missing ID field', () => {
        expect(InscriptionIDSchema.safeParse({}).success).toBe(false);
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
    describe('RuneBalanceSchema', () => {
      test('validates valid rune balance', () => {
        const validBalance = {
          amount: 1000,
          divisibility: 8,
          symbol: 'TEST•RUNE',
        };
        expect(RuneBalanceSchema.safeParse(validBalance).success).toBe(true);
      });

      test('rejects negative amount', () => {
        const invalidBalance = {
          amount: -1000,
          divisibility: 8,
          symbol: 'TEST•RUNE',
        };
        expect(RuneBalanceSchema.safeParse(invalidBalance).success).toBe(false);
      });

      test('rejects negative divisibility', () => {
        const invalidBalance = {
          amount: 1000,
          divisibility: -8,
          symbol: 'TEST•RUNE',
        };
        expect(RuneBalanceSchema.safeParse(invalidBalance).success).toBe(false);
      });

      test('rejects missing required fields', () => {
        const invalidBalance = {
          amount: 1000,
          symbol: 'TEST•RUNE',
        };
        expect(RuneBalanceSchema.safeParse(invalidBalance).success).toBe(false);
      });
    });

    describe('RuneInfoSchema', () => {
      test('validates valid rune', () => {
        const result = RuneInfoSchema.safeParse(SAMPLE_RUNE);
        expect(result.success).toBe(true);
      });

      test('validates nullable field', () => {
        const runeWithNullSymbol = {
          ...SAMPLE_RUNE,
          symbol: null,
        };
        const result = RuneInfoSchema.safeParse(runeWithNullSymbol);
        expect(result.success).toBe(true);
      });

      test('fails with negative numbers', () => {
        const invalidRune = {
          ...SAMPLE_RUNE,
          block: -1,
          burned: -1,
          mints: -1,
        };
        const result = RuneInfoSchema.safeParse(invalidRune);
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
    describe('SatInfoSchema', () => {
      test('validates valid sat', () => {
        const result = SatInfoSchema.safeParse(SAMPLE_SAT);
        expect(result.success).toBe(true);
      });

      test('validates nullable fields', () => {
        const satWithNullSatpoint = {
          ...SAMPLE_SAT,
          address: null,
          satpoint: null,
        };
        const result = SatInfoSchema.safeParse(satWithNullSatpoint);
        expect(result.success).toBe(true);
      });

      test('rejects invalid charm value', () => {
        const satWithInvalidCharm = {
          ...SAMPLE_SAT,
          charms: ['invalid_charm'],
        };
        const result = SatInfoSchema.safeParse(satWithInvalidCharm);
        expect(result.success).toBe(false);
      });

      test('rejects invalid rarity value', () => {
        const satWithInvalidRarity = {
          ...SAMPLE_SAT,
          rarity: 'invalid_rarity',
        };
        const result = SatInfoSchema.safeParse(satWithInvalidRarity);
        expect(result.success).toBe(false);
      });

      test('rejects negative values', () => {
        const satWithNegatives = {
          ...SAMPLE_SAT,
          number: -1,
          offset: -1,
          period: -1,
        };
        const result = SatInfoSchema.safeParse(satWithNegatives);
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
