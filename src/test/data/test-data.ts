export const GENESIS_BLOCK = {
  best_height: 864325,
  hash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
  height: 0,
  inscriptions: [],
  runes: [],
  target: '00000000ffff0000000000000000000000000000000000000000000000000000',
  transactions: [
    {
      version: 1,
      lock_time: 0,
      input: [
        {
          previous_output:
            '0000000000000000000000000000000000000000000000000000000000000000:4294967295',
          script_sig:
            '04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73',
          sequence: 4294967295,
          witness: [],
        },
      ],
      output: [
        {
          value: 5000000000,
          script_pubkey:
            '4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac',
        },
      ],
    },
  ],
};

export const SAMPLE_ADDRESS =
  'bc1pyy0ttst33sgv9vx0jnqueca7vsqqupwu2t38l43pfgpwjrqvdddsq73hzp';

export const SAMPLE_ADDRESS_INFO = {
  outputs: [
    '37bd80a1a6f763b556e6e061435fde3847765578a993fa0446023a0f94011d0a:240',
    'b59bc9542e2715cc9b4e21cf29e5f2e763e5eb924b3d98fd84947b5e78ec1476:0',
    '11b9f231169f0f07270011aa6430f77cc7e99794446cc34e951d7e01614fe0bd:1701',
    '44c6b5a3f23b1e8ffbadfcb618bb7a724172c49f2594de9abb39e1f30a0dadcc:1698',
    'e1380b2896ad2e47f67a07e2d44806ba225a33e0cd5a01b0aba3d44735a87fe6:1687',
    'e1380b2896ad2e47f67a07e2d44806ba225a33e0cd5a01b0aba3d44735a87fe6:1688',
  ],
  inscriptions: [
    '3beb59221cec3d1fbc189fc54933488a8015f4f25cabe9d41537bc45a63b0137i0',
    '0000077c4851b026f4d19c25bf80de7b5b44b856da50d67ae8da304bd3be6999i5698',
  ],
  sat_balance: 3297,
  runes_balances: [
    ['GREED•FRAGMENTS', '417', '∞'],
    ['LIQUIDIUM•TOKEN', '117.42', '🫠'],
    ['EPIC•EPIC•EPIC•EPIC', '20000', '💥'],
  ],
};

export const SAMPLE_RUNE_BALANCE = ['TEST•RUNE', '100', '🎯'];

export const SAMPLE_BLOCKS_RESPONSE = {
  last: 1000,
  blocks: [
    '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f',
    '00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048',
  ],
  featured_blocks: {
    '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f': [
      'inscription1',
      'inscription2',
    ],
  },
};

export const SAMPLE_TX_ID =
  '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799';

export const SAMPLE_TRANSACTION = {
  version: 1,
  lock_time: 0,
  input: [
    {
      previous_output: 'abc123:0',
      script_sig: '76a914...',
      sequence: 4294967295,
      witness: [],
    },
  ],
  output: [
    {
      value: 5000000000,
      script_pubkey: '76a914...',
    },
  ],
};

export const SAMPLE_INPUT = {
  previous_output: 'abc123:0',
  script_sig: '76a914...',
  sequence: 4294967295,
  witness: ['304502...'],
};

export const SAMPLE_OUTPUT = {
  value: 5000000000,
  script_pubkey: '76a914...',
};

export const SAMPLE_INSCRIPTION = {
  address: 'bc1ppth27qnr74qhusy9pmcyeaelgvsfky6qzquv9nf56gqmte59vfhqwkqguh',
  charms: ['vindicated'],
  children: [
    '681b5373c03e3f819231afd9227f54101395299c9e58356bda278e2f32bef2cdi0',
    'b1ef66c2d1a047cbaa6260b74daac43813924378fe08ef8545da4cb79e8fcf00i0',
  ],
  content_length: 793,
  content_type: 'image/png',
  effective_content_type: 'image/png',
  fee: 322,
  height: 767430,
  id: '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
  next: '26482871f33f1051f450f2da9af275794c0b5f1c61ebf35e4467fb42c2813403i0',
  number: 0,
  parents: [],
  previous: null,
  rune: null,
  sat: null,
  satpoint:
    '47c7260764af2ee17aa584d9c035f2e5429aefd96b8016cfe0e3f0bcf04869a3:0:0',
  timestamp: 1671049920,
  value: 606,
};

export const SAMPLE_INSCRIPTIONS_RESPONSE = {
  ids: [
    '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0',
    '26482871f33f1051f450f2da9af275794c0b5f1c61ebf35e4467fb42c2813403i0',
  ],
  more: true,
  page_index: 0,
};

export const SAMPLE_INSCRIPTION_ID =
  '6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0';

export const SAMPLE_CHILD_ID =
  'ab924ff229beca227bf40221faf492a20b5e2ee4f084524c84a5f98b80fe527fi0';

export const SAMPLE_BLOCK_HEIGHT = 767430;
