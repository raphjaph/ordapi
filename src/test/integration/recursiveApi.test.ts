import { expect, test, describe, beforeAll } from 'bun:test';
import OrdClient from '../../index';
import { BASE_URL, TIMEOUT } from '../config/test-config';
import {
  GENESIS_BLOCK,
  SAMPLE_INSCRIPTION_ID,
  SAMPLE_CHILD_ID,
  SAMPLE_SAT_NUMBER,
  SAMPLE_TX_ID,
  SAMPLE_OUTPOINT_A,
} from '../data/test-data';

describe('Recursive API Integration Tests', () => {
  let client: OrdClient;
  let invalidClient: OrdClient;

  beforeAll(() => {
    client = new OrdClient(BASE_URL);
    invalidClient = new OrdClient('https://invalid.api');
  });

  describe('getBlockHashRecursive', () => {
    test(
      'returns latest block hash successfully',
      async () => {
        const hash = await client.getBlockHashRecursive();
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getBlockHashRecursive()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getBlockHashByHeightRecursive', () => {
    test(
      'returns genesis block hash successfully',
      async () => {
        const hash = await client.getBlockHashByHeightRecursive(0);
        expect(hash).toBe(GENESIS_BLOCK.hash);
      },
      TIMEOUT,
    );

    test(
      'rejects negative height',
      async () => {
        expect(client.getBlockHashByHeightRecursive(-1)).rejects.toThrow();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getBlockHashByHeightRecursive(0),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getBlockHeightRecursive', () => {
    test(
      'returns height successfully',
      async () => {
        const height = await client.getBlockHeightRecursive();
        expect(height).toBeGreaterThan(0);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getBlockHeightRecursive()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getBlockTimeRecursive', () => {
    test(
      'returns timestamp successfully',
      async () => {
        const time = await client.getBlockTimeRecursive();
        expect(time).toBeGreaterThan(0);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getBlockTimeRecursive()).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getBlockInfoRecursive', () => {
    test(
      'fetches block info by height successfully',
      async () => {
        const block = await client.getBlockInfoRecursive(0);
        expect(block.height).toBe(0);
        expect(block.hash).toBe(GENESIS_BLOCK.hash);
        expect(block.chainwork).toBeDefined();
        expect(block.bits).toBeDefined();
        expect(block.merkle_root).toBeDefined();
      },
      TIMEOUT,
    );

    test(
      'fetches block info by hash successfully',
      async () => {
        const block = await client.getBlockInfoRecursive(GENESIS_BLOCK.hash);
        expect(block.height).toBe(0);
        expect(block.hash).toBe(GENESIS_BLOCK.hash);
        expect(block.chainwork).toBeDefined();
        expect(block.bits).toBeDefined();
        expect(block.merkle_root).toBeDefined();
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getBlockInfoRecursive(0)).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getInscriptionRecursive', () => {
    test(
      'fetches inscription info successfully',
      async () => {
        const inscription = await client.getInscriptionRecursive(
          SAMPLE_INSCRIPTION_ID,
        );
        expect(inscription.id).toBe(SAMPLE_INSCRIPTION_ID);
        expect(inscription.content_length).toBeGreaterThan(0);
        expect(inscription.height).toBeGreaterThan(0);
        expect(Array.isArray(inscription.charms)).toBe(true);
        expect(typeof inscription.satpoint).toBe('string');
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getInscriptionRecursive(SAMPLE_INSCRIPTION_ID),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getChildren', () => {
    test(
      'fetches children ids successfully',
      async () => {
        const children = await client.getChildren(SAMPLE_INSCRIPTION_ID);
        expect(Array.isArray(children.ids)).toBe(true);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getChildren(SAMPLE_INSCRIPTION_ID),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getChildrenByPage', () => {
    test(
      'fetches paginated children ids successfully',
      async () => {
        const children = await client.getChildrenByPage(
          SAMPLE_INSCRIPTION_ID,
          0,
        );
        expect(Array.isArray(children.ids)).toBe(true);
        expect(children.page).toBe(0);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getChildrenByPage(SAMPLE_INSCRIPTION_ID, 0),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getChildrenInfo', () => {
    test(
      'fetches children info successfully',
      async () => {
        const children = await client.getChildrenInfo(SAMPLE_INSCRIPTION_ID);
        expect(typeof children.more).toBe('boolean');
        expect(typeof children.page).toBe('number');
        expect(children.page).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(children.children)).toBe(true);
        if (children.children.length > 0) {
          const child = children.children[0];
          expect(Array.isArray(child.charms)).toBe(true);
          expect(typeof child.fee).toBe('number');
          expect(typeof child.height).toBe('number');
          expect(typeof child.id).toBe('string');
          expect(typeof child.number).toBe('number');
          expect(typeof child.output).toBe('string');
          expect(typeof child.sat).toBe('number');
          expect(typeof child.satpoint).toBe('string');
          expect(typeof child.timestamp).toBe('number');
        }
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getChildrenInfo(SAMPLE_INSCRIPTION_ID),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getChildrenInfoByPage', () => {
    test(
      'fetches paginated children info successfully',
      async () => {
        const children = await client.getChildrenInfoByPage(
          SAMPLE_INSCRIPTION_ID,
          0,
        );
        expect(typeof children.more).toBe('boolean');
        expect(typeof children.page).toBe('number');
        expect(children.page).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(children.children)).toBe(true);
        if (children.children.length > 0) {
          const child = children.children[0];
          expect(Array.isArray(child.charms)).toBe(true);
          expect(typeof child.fee).toBe('number');
          expect(typeof child.height).toBe('number');
          expect(typeof child.id).toBe('string');
          expect(typeof child.number).toBe('number');
          expect(typeof child.output).toBe('string');
          expect(typeof child.sat).toBe('number');
          expect(typeof child.satpoint).toBe('string');
          expect(typeof child.timestamp).toBe('number');
        }
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getChildrenInfoByPage(SAMPLE_INSCRIPTION_ID, 0),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getParents', () => {
    test(
      'fetches parent ids successfully',
      async () => {
        const parents = await client.getParents(SAMPLE_CHILD_ID);
        expect(Array.isArray(parents.ids)).toBe(true);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getParents(SAMPLE_CHILD_ID)).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getParentsByPage', () => {
    test(
      'fetches paginated parent ids successfully',
      async () => {
        const parents = await client.getParentsByPage(SAMPLE_CHILD_ID, 0);
        expect(Array.isArray(parents.ids)).toBe(true);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getParentsByPage(SAMPLE_CHILD_ID, 0),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getInscriptionOnSat', () => {
    test(
      'fetches inscription at index successfully',
      async () => {
        const inscription = await client.getInscriptionOnSat(
          SAMPLE_SAT_NUMBER,
          0,
        );
        expect(inscription.id).toBe(null);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getInscriptionOnSat(SAMPLE_SAT_NUMBER, 0),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getInscriptionsOnSat', () => {
    test(
      'fetches inscriptions successfully',
      async () => {
        const inscriptions =
          await client.getInscriptionsOnSat(SAMPLE_SAT_NUMBER);
        expect(Array.isArray(inscriptions.ids)).toBe(true);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getInscriptionsOnSat(SAMPLE_SAT_NUMBER),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getInscriptionsOnSatByPage', () => {
    test(
      'fetches paginated inscriptions successfully',
      async () => {
        const inscriptions = await client.getInscriptionsOnSatByPage(
          SAMPLE_SAT_NUMBER,
          0,
        );
        expect(Array.isArray(inscriptions.ids)).toBe(true);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getInscriptionsOnSatByPage(SAMPLE_SAT_NUMBER, 0),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getOutputAssets', () => {
    test(
      'fetches output info successfully',
      async () => {
        const output = await client.getOutputAssets(SAMPLE_OUTPOINT_A);
        expect(output.value).toBeGreaterThanOrEqual(0);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(
          invalidClient.getOutputAssets(SAMPLE_OUTPOINT_A),
        ).rejects.toThrow();
      },
      TIMEOUT,
    );
  });

  describe('getTransactionHex', () => {
    test(
      'fetches transaction hex successfully',
      async () => {
        const hex = await client.getTransactionHex(SAMPLE_TX_ID);
        expect(typeof hex).toBe('string');
        expect(hex).toMatch(/^[0-9a-f]+$/);
      },
      TIMEOUT,
    );

    test(
      'handles server error',
      async () => {
        expect(invalidClient.getTransactionHex(SAMPLE_TX_ID)).rejects.toThrow();
      },
      TIMEOUT,
    );
  });
});
