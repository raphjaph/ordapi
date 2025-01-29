import { expect, test, describe, beforeAll } from 'bun:test';
import { OrdClient } from '../../index';
import { BASE_URL, TIMEOUT } from '../config/test-config';
import {
  GENESIS_BLOCK,
  SAMPLE_ADDRESS,
  SAMPLE_ADDRESS_INFO,
} from '../data/test-data';

describe('API Integration Tests', () => {
  let client: OrdClient;
  let invalidClient: OrdClient;

  beforeAll(() => {
    client = new OrdClient(BASE_URL);
    invalidClient = new OrdClient('https://invalid.api');
  });

  describe('getBlock', () => {
    test(
      'fetches genesis block successfully',
      async () => {
        const block = await client.getBlock(0);
        expect(block.height).toBe(0);
        expect(block.hash).toBe(GENESIS_BLOCK.hash);
      },
      TIMEOUT,
    );

    test(
      'rejects negative block height',
      async () => {
        await expect(client.getBlock(-1)).rejects.toThrow();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        await expect(invalidClient.getBlock(0)).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getAddressInfo', () => {
    test(
      'fetches address info successfully',
      async () => {
        const info = await client.getAddressInfo(SAMPLE_ADDRESS);
        expect(info).toEqual(SAMPLE_ADDRESS_INFO);
      },
      TIMEOUT,
    );

    test(
      'rejects invalid address format',
      async () => {
        await expect(client.getAddressInfo('invalid-address')).rejects.toThrow();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        await expect(
          invalidClient.getAddressInfo(SAMPLE_ADDRESS),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getBlockCount', () => {
    test(
      'returns block count successfully',
      async () => {
        const count = await client.getBlockCount();
        expect(count).toBeGreaterThan(0);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        await expect(invalidClient.getBlockCount()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getBlockHashByHeight', () => {
    test(
      'returns genesis block hash successfully',
      async () => {
        const hash = await client.getBlockHashByHeight(0);
        expect(hash).toBe(GENESIS_BLOCK.hash);
      },
      TIMEOUT,
    );

    test(
      'rejects negative height',
      async () => {
        await expect(client.getBlockHashByHeight(-1)).rejects.toThrow();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        await expect(invalidClient.getBlockHashByHeight(0)).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getLatestBlockHash', () => {
    test(
      'returns valid hash successfully',
      async () => {
        const hash = await client.getLatestBlockHash();
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        await expect(invalidClient.getLatestBlockHash()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getLatestBlockHeight', () => {
    test(
      'returns height successfully',
      async () => {
        const height = await client.getLatestBlockHeight();
        expect(height).toBeGreaterThan(0);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        await expect(invalidClient.getLatestBlockHeight()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getLatestBlocks', () => {
    test(
      'returns blocks list successfully',
      async () => {
        const blocksResponse = await client.getLatestBlocks();

        expect(typeof blocksResponse.last).toBe('number');
        expect(Array.isArray(blocksResponse.blocks)).toBe(true);
        expect(typeof blocksResponse.featured_blocks).toBe('object');

        if (blocksResponse.blocks.length > 0) {
          expect(blocksResponse.blocks[0]).toMatch(/^[0-9a-f]{64}$/);
        }
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        await expect(invalidClient.getLatestBlocks()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getLatestBlockTime', () => {
    test(
      'returns timestamp successfully',
      async () => {
        const time = await client.getLatestBlockTime();
        expect(time).toBeGreaterThan(0);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        await expect(invalidClient.getLatestBlockTime()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });
});
