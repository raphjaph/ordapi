export const endpoints = {
  address: (address: string) => `/address/${address}`,
  block: (heightOrHash: number | string) => `/block/${heightOrHash}`,
  blockcount: '/blockcount',
  blockhashLatest: '/blockhash',
  blockhashByHeight: (height: number) => `/blockhash/${height}`,
  blockheight: '/blockheight',
  blocks: '/blocks',
  blocktime: '/blocktime',
  inscription: (id: string) => `/inscription/${id}`,
  inscriptionChild: (id: string, child: number) =>
    `/inscription/${id}/${child}`,
  inscriptions: '/inscriptions',
  inscriptionsByPage: (page: number) => `/inscriptions/${page}`,
  inscriptionsByBlock: (height: number) => `/inscriptions/block/${height}`,
} as const;
