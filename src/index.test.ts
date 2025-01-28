import { expect, test, describe } from 'bun:test';
import { ApiClient, BlockSchema } from './index';

describe('ApiClient', () => {
  test('get block by height', () => {
    const validBlock = {
      "best_height": 864325,
      "hash": "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
      "height": 0,
      "inscriptions": [],
      "runes": [],
      "target": "00000000ffff0000000000000000000000000000000000000000000000000000",
      "transactions": [
        {
          "version": 1,
          "lock_time": 0,
          "input": [
            {
              "previous_output": "0000000000000000000000000000000000000000000000000000000000000000:4294967295",
              "script_sig": "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73",
              "sequence": 4294967295,
              "witness": []
            }
          ],
          "output": [
            {
              "value": 5000000000,
              "script_pubkey": "4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac"
            }
          ]
        }
      ]
    };


    const result = BlockSchema.safeParse(validBlock);
    expect(result.success).toBe(true);
  });

  test('rejects invalid user data', () => {
    const invalidBlock = {
      "best_height": "864325",
      "hash": "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
      "height": 0,
      "inscriptions": [],
      "runes": [],
      "target": "00000000ffff0000000000000000000000000000000000000000000000000000",
      "transactions": [
        {
          "version": 1,
          "lock_time": 0,
          "input": [
            {
              "previous_output": "0000000000000000000000000000000000000000000000000000000000000000:4294967295",
              "script_sig": "04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73",
              "sequence": 4294967295,
              "witness": []
            }
          ],
          "output": [
            {
              "value": 5000000000,
              "script_pubkey": "4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac"
            }
          ]
        }
      ]
    };

    const result = BlockSchema.safeParse(invalidBlock);
    expect(result.success).toBe(false);
  });
});

describe('API Integration Tests', () => {
  const client = new ApiClient('https://charlie.ordinals.net');

  const TIMEOUT = 10000;

  test('getBlock fetches genesis block', async () => {
    const block = await client.getBlock(0);
    expect(block.height).toBe(0);
    expect(block.hash).toBe("000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f");
  }, TIMEOUT);

  test('getBlock handles non-existent block', async () => {
    try {
      await client.getBlock(-1);
      throw new Error('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, TIMEOUT);

  test('handles server errors gracefully', async () => {
    const badClient = new ApiClient('https://non.existent.api');
    try {
      await badClient.getBlock(0);
      throw new Error('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    }
  }, TIMEOUT);
});
