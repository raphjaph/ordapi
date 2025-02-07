import { OutputType } from './types';

const api = {
  getAddressInfo: (address: string) => `/address/${address}`,
  getBlockInfo: (heightOrHash: number | string) => `/block/${heightOrHash}`,
  getBlockCount: '/blockcount',
  getBlockHashByHeight: (height: number) => `/blockhash/${height}`,
  getBlockHash: '/blockhash',
  getBlockHeight: '/blockheight',
  getBlocksLatest: '/blocks',
  getBlockTime: '/blocktime',
  getInscriptionInfo: (id: string) => `/inscription/${id}`,
  getChild: (id: string, child: number) => `/inscription/${id}/${child}`,
  getInscriptions: '/inscriptions',
  getInscriptionsByPage: (page: number) => `/inscriptions/${page}`,
  getInscriptionsByBlock: (height: number) => `/inscriptions/block/${height}`,
  getOutput: (outpoint: string) => `/output/${outpoint}`,
  getOutputsByAddress: (address: string, type?: OutputType) => {
    const base = `/outputs/${address}`;
    return type ? `${base}?type=${type}` : base;
  },
  getRune: (name: string) => `/rune/${name}`,
  getRunesLatest: '/runes',
  getRunesByPage: (page: number) => `/runes/${page}`,
  getSat: (number: number) => `/sat/${number}`,
  getTransaction: (txId: string) => `/tx/${txId}`,
  getServerStatus: '/status',

  // recursive endpoints
  getBlockHashByHeightRecursive: (height: number) => `/r/blockhash/${height}`,
  getBlockHashRecursive: '/r/blockhash',
  getBlockHeightRecursive: '/r/blockheight',
  getBlockInfoRecursive: (heightOrHash: number | string) =>
    `/r/blockinfo/${heightOrHash}`,
  getBlockTimeRecursive: '/r/blocktime',
  getChildren: (id: string) => `/r/children/${id}`,
  getChildrenByPage: (id: string, page: number) => `/r/children/${id}/${page}`,
  getChildrenInfo: (id: string) => `/r/children/${id}/inscriptions`,
  getChildrenInfoByPage: (id: string, page: number) =>
    `/r/children/${id}/inscriptions/${page}`,
  getInscriptionRecursive: (id: string) => `/r/inscription/${id}`,
  getParents: (id: string) => `/r/parents/${id}`,
  getParentsByPage: (id: string, page: number) => `/r/parents/${id}/${page}`,
  getInscriptionsOnSat: (number: number) => `/r/sat/${number}`,
  getInscriptionsOnSatByPage: (number: number, page: number) =>
    `/r/sat/${number}/${page}`,
  getInscriptionOnSat: (number: number, index: number) =>
    `/r/sat/${number}/at/${index}`,
  getTransactionHex: (txid: string) => `/r/tx/${txid}`,
  getOutputAssets: (outpoint: string) => `/r/utxo/${outpoint}`,
} as const;

export default api;
