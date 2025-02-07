import { expect, test, describe, beforeAll } from 'bun:test';
import OrdClient from '../../index';
import { BASE_URL, TIMEOUT } from '../config/test-config';
import {
  GENESIS_BLOCK,
  SAMPLE_ORDINALS_ADDRESS,
  SAMPLE_INSCRIPTION_ID,
  SAMPLE_CHILD_ID,
  SAMPLE_BLOCK_HEIGHT,
  SAMPLE_SAT_NUMBER,
  SAMPLE_TX_ID,
  SAMPLE_RUNE_NAME,
  SAMPLE_OUTPOINT_A,
  SAMPLE_OUTPOINT_B,
  SAMPLE_BTC_ADDRESS,
  SAMPLE_ADDRESS_INFO,
} from '../data/test-data';

describe('API Integration Tests', () => {
  let client: OrdClient;
  let invalidClient: OrdClient;

  beforeAll(() => {
    client = new OrdClient(BASE_URL);
    invalidClient = new OrdClient('https://invalid.api');
  });

  describe('getBlockInfo', () => {
    test(
      'fetches genesis block successfully',
      async () => {
        const block = await client.getBlockInfo(0);
        expect(block.height).toBe(0);
        expect(block.hash).toBe(GENESIS_BLOCK.hash);
      },
      TIMEOUT,
    );

    test(
      'rejects negative block height',
      async () => {
        expect(client.getBlockInfo(-1)).rejects.toThrow();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getBlockInfo(0)).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getAddressInfo', () => {
    test(
      'fetches address info successfully',
      async () => {
        const info = await client.getAddressInfo(SAMPLE_ORDINALS_ADDRESS);
        expect(info).toEqual(SAMPLE_ADDRESS_INFO);
      },
      TIMEOUT,
    );

    test(
      'rejects invalid address format',
      async () => {
        expect(client.getAddressInfo('invalid-address')).rejects.toThrow();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getAddressInfo(SAMPLE_ORDINALS_ADDRESS),
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
        expect(invalidClient.getBlockCount()).rejects.toThrow();
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
        expect(client.getBlockHashByHeight(-1)).rejects.toThrow();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getBlockHashByHeight(0)).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getLatestBlockHash', () => {
    test(
      'returns valid hash successfully',
      async () => {
        const hash = await client.getBlockHash();
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getBlockHash()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getLatestBlockHeight', () => {
    test(
      'returns height successfully',
      async () => {
        const height = await client.getBlockHeight();
        expect(height).toBeGreaterThan(0);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getBlockHeight()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getLatestBlocks', () => {
    test(
      'returns blocks list successfully',
      async () => {
        const blocksResponse = await client.getBlocksLatest();

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
        expect(invalidClient.getBlocksLatest()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getLatestBlockTime', () => {
    test(
      'returns timestamp successfully',
      async () => {
        const time = await client.getBlockTime();
        expect(time).toBeGreaterThan(0);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getBlockTime()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getInscription', () => {
    test(
      'fetches inscription successfully',
      async () => {
        const inscription = await client.getInscriptionInfo(
          SAMPLE_INSCRIPTION_ID,
        );
        expect(inscription.id).toBe(SAMPLE_INSCRIPTION_ID);
        expect(inscription.address).toBeDefined();
        expect(Array.isArray(inscription.charms)).toBe(true);
        expect(Array.isArray(inscription.children)).toBe(true);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getInscriptionInfo(SAMPLE_INSCRIPTION_ID),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getInscriptionChild', () => {
    test(
      'fetches child inscription successfully',
      async () => {
        const child = await client.getChild(SAMPLE_INSCRIPTION_ID, 0);
        expect(child.id).toBeDefined();
        expect(Array.isArray(child.children)).toBe(true);
        expect(child.parents).toContain(SAMPLE_INSCRIPTION_ID);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getChild(SAMPLE_INSCRIPTION_ID, 0),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getLatestInscriptions', () => {
    test(
      'fetches latest inscriptions successfully',
      async () => {
        const response = await client.getInscriptions();
        expect(Array.isArray(response.ids)).toBe(true);
        expect(response.ids.length).toBeGreaterThan(0);
        expect(typeof response.more).toBe('boolean');
        expect(typeof response.page_index).toBe('number');
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getInscriptions()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getInscriptionsByPage', () => {
    test(
      'fetches inscriptions by page successfully',
      async () => {
        const response = await client.getInscriptionsByPage(1);
        expect(Array.isArray(response.ids)).toBe(true);
        expect(response.page_index).toBe(1);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getInscriptionsByPage(1)).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getInscriptionsByBlock', () => {
    test(
      'fetches inscriptions by block successfully',
      async () => {
        const response =
          await client.getInscriptionsByBlock(SAMPLE_BLOCK_HEIGHT);
        expect(Array.isArray(response.ids)).toBe(true);
        expect(response.ids).toContain(SAMPLE_INSCRIPTION_ID);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getInscriptionsByBlock(SAMPLE_BLOCK_HEIGHT),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getOutput', () => {
    test(
      'fetches output successfully',
      async () => {
        const output = await client.getOutput(SAMPLE_OUTPOINT_A);
        expect(output.outpoint).toBe(SAMPLE_OUTPOINT_A);
        expect(output.value).toBeGreaterThan(0);
        expect(Array.isArray(output.sat_ranges)).toBe(true);
      },
      TIMEOUT,
    );

    test(
      'handles invalid outpoint format',
      async () => {
        expect(client.getOutput('invalid-outpoint')).rejects.toThrow();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getOutput(SAMPLE_OUTPOINT_A)).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getOutputsByAddress', () => {
    test(
      'fetches outputs by address successfully',
      async () => {
        const outputs = await client.getOutputsByAddress(SAMPLE_BTC_ADDRESS);
        expect(Array.isArray(outputs)).toBe(true);
        if (outputs.length > 0) {
          expect(outputs[0].address).toBe(SAMPLE_BTC_ADDRESS);
        }
      },
      TIMEOUT,
    );

    test(
      'fetches outputs with type filter',
      async () => {
        const outputs = await client.getOutputsByAddress(
          SAMPLE_BTC_ADDRESS,
          'cardinal',
        );
        expect(Array.isArray(outputs)).toBe(true);
      },
      TIMEOUT,
    );

    test(
      'handles invalid address',
      async () => {
        expect(client.getOutputsByAddress('invalid-address')).rejects.toThrow();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getOutputsByAddress(SAMPLE_BTC_ADDRESS),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getRune', () => {
    test(
      'fetches rune successfully',
      async () => {
        const rune = await client.getRune(SAMPLE_RUNE_NAME);
        expect(rune.entry.spaced_rune).toBe(SAMPLE_RUNE_NAME);
        expect(typeof rune.entry.block).toBe('number');
        expect(typeof rune.mintable).toBe('boolean');
      },
      TIMEOUT,
    );

    test(
      'handles invalid rune name',
      async () => {
        expect(client.getRune('invalid/rune/name')).rejects.toThrow();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getRune(SAMPLE_RUNE_NAME)).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getLatestRunes', () => {
    test(
      'fetches latest runes successfully',
      async () => {
        const response = await client.getRunesLatest();
        expect(Array.isArray(response.entries)).toBe(true);
        expect(typeof response.more).toBe('boolean');
        if (response.entries.length > 0) {
          const [runeName, runeData] = response.entries[0];
          expect(typeof runeName).toBe('string');
          expect(typeof runeData.block).toBe('number');
        }
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getRunesLatest()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getRunesByPage', () => {
    test(
      'fetches runes by page successfully',
      async () => {
        const response = await client.getRunesByPage(0);
        expect(Array.isArray(response.entries)).toBe(true);
        expect(typeof response.more).toBe('boolean');
        expect(
          response.prev === null || typeof response.prev === 'number',
        ).toBe(true);
        expect(
          response.next === null || typeof response.next === 'number',
        ).toBe(true);
      },
      TIMEOUT,
    );

    test(
      'handles invalid page number',
      async () => {
        expect(client.getRunesByPage(-1)).rejects.toThrow();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getRunesByPage(1)).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getSat', () => {
    test(
      'fetches sat info successfully',
      async () => {
        const sat = await client.getSat(SAMPLE_SAT_NUMBER);
        expect(sat.number).toBe(SAMPLE_SAT_NUMBER);
        expect(Array.isArray(sat.charms)).toBe(true);
        expect(Array.isArray(sat.inscriptions)).toBe(true);
        expect(sat.decimal).toBeDefined();
        expect(sat.degree).toBeDefined();
      },
      TIMEOUT,
    );

    test(
      'rejects negative sat number',
      async () => {
        expect(client.getSat(-1)).rejects.toThrow();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getSat(SAMPLE_SAT_NUMBER)).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getTx', () => {
    test(
      'fetches transaction successfully',
      async () => {
        const tx = await client.getTransaction(SAMPLE_TX_ID);
        expect(tx.txid).toBe(SAMPLE_TX_ID);
        expect(Array.isArray(tx.transaction.input)).toBe(true);
        expect(Array.isArray(tx.transaction.output)).toBe(true);
        expect(typeof tx.inscription_count).toBe('number');
      },
      TIMEOUT,
    );

    test(
      'rejects invalid transaction id',
      async () => {
        expect(client.getTransaction('invalid-txid')).rejects.toThrow();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getTransaction(SAMPLE_TX_ID)).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  test(
    'fetches status successfully',
    async () => {
      const status = await client.getServerStatus();
      expect(typeof status.height).toBe('number');
      expect(status.height).toBeGreaterThan(0);
      expect(typeof status.chain).toBe('string');
      expect(typeof status.inscriptions).toBe('number');
      expect(typeof status.lost_sats).toBe('number');
      expect(typeof status.address_index).toBe('boolean');
      expect(typeof status.sat_index).toBe('boolean');
      expect(typeof status.rune_index).toBe('boolean');
      expect(typeof status.transaction_index).toBe('boolean');
      expect(status.initial_sync_time).toBeDefined();
      expect(status.uptime).toBeDefined();
    },
    TIMEOUT,
  );

  test(
    'handles server error',
    async () => {
      expect(invalidClient.getServerStatus()).rejects.toThrow();
    },
    TIMEOUT,
  );
});
