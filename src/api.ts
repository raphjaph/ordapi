import { OutputType } from './types';

const api = {
  address: (address: string) => `/address/${address}`,
  block: (heightOrHash: number | string) => `/block/${heightOrHash}`,
  blockcount: '/blockcount',
  blockhash: {
    latest: '/blockhash',
    byHeight: (height: number) => `/blockhash/${height}`,
  },
  blockheight: '/blockheight',
  blocks: '/blocks',
  blocktime: '/blocktime',
  inscription: (id: string) => `/inscription/${id}`,
  inscriptionChild: (id: string, child: number) =>
    `/inscription/${id}/${child}`,
  inscriptions: {
    base: '/inscriptions',
    latest: '/inscriptions',
    byPage: (page: number) => `/inscriptions/${page}`,
    byBlock: (height: number) => `/inscriptions/block/${height}`,
  },
  output: (outpoint: string) => `/output/${outpoint}`,
  outputs: {
    base: '/outputs',
    byAddress: (address: string, type?: OutputType) => {
      const base = `/outputs/${address}`;
      return type ? `${base}?type=${type}` : base;
    },
  },
  rune: (name: string) => `/rune/${name}`,
  runes: {
    latest: '/runes',
    byPage: (page: number) => `/runes/${page}`,
  },
  sat: (number: number) => `/sat/${number}`,
  tx: (txId: string) => `/tx/${txId}`,
  status: '/status',
} as const;

export default api;
