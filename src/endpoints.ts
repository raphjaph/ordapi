export const endpoints = {
  address: (address: string) => `/address/${address}`,
  block: (heightOrHash: number | string) => `/block/${heightOrHash}`,
  blockcount: '/blockcount',
  blockhashLatest: '/blockhash',
  blockhashByHeight: (height: number) => `/blockhash/${height}`,
  blockheight: '/blockheight',
  blocks: '/blocks',
  blocktime: '/blocktime',
} as const;
