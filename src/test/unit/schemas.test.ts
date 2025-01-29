import { expect, test, describe } from 'bun:test';
import {
  BlockSchema,
  BlockHashSchema,
  BlocksResponseSchema,
} from '../../schemas/block';
import { AddressInfoSchema, RuneBalanceSchema } from '../../schemas/address';
import {
  InputSchema,
  OutputSchema,
  TransactionSchema,
} from '../../schemas/transaction';
import {
  InscriptionSchema,
  InscriptionsResponseSchema,
} from '../../schemas/inscription';
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
} from '../data/test-data';

describe('Schema Validation', () => {
  describe('Transaction Schemas', () => {
    describe('InputSchema', () => {
      test('validates valid input', () => {
        expect(InputSchema.safeParse(SAMPLE_INPUT).success).toBe(true);
      });

      test('rejects invalid sequence', () => {
        const invalidInput = {
          ...SAMPLE_INPUT,
          sequence: -1,
        };
        expect(InputSchema.safeParse(invalidInput).success).toBe(false);
      });

      test('rejects missing field', () => {
        const { script_sig, ...invalidInput } = SAMPLE_INPUT;
        expect(InputSchema.safeParse(invalidInput).success).toBe(false);
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

    describe('TransactionSchema', () => {
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
  });

  describe('Block Schemas', () => {
    describe('BlockHashSchema', () => {
      test('validates valid block hash', () => {
        const validHash = GENESIS_BLOCK.hash;
        expect(BlockHashSchema.safeParse(validHash).success).toBe(true);
      });

      test('rejects invalid length', () => {
        const shortHash = GENESIS_BLOCK.hash.slice(0, -1); // Remove last character
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
        expect(BlockSchema.safeParse(GENESIS_BLOCK).success).toBe(true);
      });

      test('rejects invalid block height type', () => {
        const invalidBlock = {
          ...GENESIS_BLOCK,
          best_height: '864325', // string instead of number
        };
        expect(BlockSchema.safeParse(invalidBlock).success).toBe(false);
      });

      test('rejects invalid block hash', () => {
        const invalidBlock = {
          ...GENESIS_BLOCK,
          hash: 'invalid_hash',
        };
        expect(BlockSchema.safeParse(invalidBlock).success).toBe(false);
      });

      test('rejects negative height', () => {
        const invalidBlock = {
          ...GENESIS_BLOCK,
          height: -1,
        };
        expect(BlockSchema.safeParse(invalidBlock).success).toBe(false);
      });
    });
  });

  describe('Address Schemas', () => {
    describe('RuneBalanceSchema', () => {
      test('validates valid rune balance', () => {
        expect(RuneBalanceSchema.safeParse(SAMPLE_RUNE_BALANCE).success).toBe(
          true,
        );
      });

      test('rejects invalid tuple length', () => {
        const invalidBalance = ['TEST•RUNE', '100'];
        expect(RuneBalanceSchema.safeParse(invalidBalance).success).toBe(false);
      });

      test('rejects invalid value type', () => {
        const invalidBalance = ['TEST•RUNE', 100, '🎯'];
        expect(RuneBalanceSchema.safeParse(invalidBalance).success).toBe(false);
      });
    });

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
          runes_balances: [['TEST•RUNE', 100, '🎯']], // number instead of string
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
          ids: [123], // should be strings
          page_index: -1, // should be non-negative
        };
        const result = InscriptionsResponseSchema.safeParse(invalidResponse);
        expect(result.success).toBe(false);
      });
    });
  });
});
