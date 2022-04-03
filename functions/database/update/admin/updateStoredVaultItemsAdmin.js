(async () => {
  const updateStoredVaultItems = require("../updateStoredVaultItems");
  try {
    await updateStoredVaultItems(
      [
        {
          name: 'MMF',
          type: 'Single',
          earn: 'MMO + MMF',
          lpAddresses: '0xbA452A1c0875D33a440259B1ea4DcA8f5d86D9Ae'
        },
        {
          name: 'VVS',
          type: 'Single',
          earn: 'MMO + MMF',
          lpAddresses: '0xbf62c67eA509E86F07c8c69d0286C0636C50270b'
        },
        {
          name: 'MMO-CRO',
          type: 'LP',
          earn: 'MMO + MMF',
          lpAddresses: '0xf0b5074dbf73c96d766c9a48726cee7a6074d436'
        },
        {
          name: 'MMF-CRO',
          type: 'LP',
          earn: 'MMO + MMF',
          lpAddresses: '0xbA452A1c0875D33a440259B1ea4DcA8f5d86D9Ae'
        },
        {
          name: 'MMF-USDC',
          type: 'LP',
          earn: 'MMO + MMF',
          lpAddresses: '0x722f19bd9A1E5bA97b3020c6028c279d27E4293C'
        },
        {
          name: 'MMF-USDT',
          type: 'LP',
          earn: 'MMO + MMF',
          lpAddresses: '0x5801d37e04ab1f266c35a277e06c9d3afa1c9ca2'
        },
        {
          name: 'METF-MMF',
          type: 'LP',
          earn: 'METF-MMF',
          lpAddresses: '0xd7385f46FFb877d8c8Fe78E5f5a7c6b2F18C05A7'
        },
        {
          name: 'SVN-MMF',
          type: 'LP',
          earn: 'SVN-MMF',
          lpAddresses: '0xB6E1705BfAFcf1efEE83C135C0F0210653bAB8F0'
        },
        {
          name: 'MSHARE-MMF',
          type: 'LP',
          earn: 'MSHARE-MMF',
          lpAddresses: '0xc924da29d37f3b8C62c4c3e4e6958bF2b5ebF677'
        },
        {
          name: 'PES-METF',
          type: 'LP',
          earn: 'PES-METF',
          lpAddresses: '0xADab84BF91c130aF81d76Be9D7f28b8c4F515367'
        },
        {
          name: 'SPES-METF',
          type: 'LP',
          earn: 'SPES-METF',
          lpAddresses: '0x72c1f5fB7E5513A07e1FF663Ad861554887a0A0a'
        },
        {
          name: 'CRO-USDC',
          type: 'LP',
          earn: 'MMO + MMF',
          lpAddresses: '0xa68466208F1A3Eb21650320D2520ee8eBA5ba623'
        },
        {
          name: 'CRO-USDT',
          type: 'LP',
          earn: 'MMO + MMF',
          lpAddresses: '0xEB28c926A7Afc75fcC8d6671Acd4c4A298b38419'
        },
        {
          name: 'ETH-CRO',
          type: 'LP',
          earn: 'MMO + MMF',
          lpAddresses: '0x019d9479606FBDd4aCB16488e0aAE49E4684322b'
        },
        {
          name: 'BTC-CRO',
          type: 'LP',
          earn: 'MMO + MMF',
          lpAddresses: '0x5383202D48C24aAA19873366168f2Ed558a00ff0'
        },
        {
          name: 'WETH-BTC',
          type: 'LP',
          earn: 'MMO + MMF',
          lpAddresses: '0x0101112C7aDdb2E8197922e9cFa17cbAA935ECCc'
        },
        {
          name: 'USDT-USDC',
          type: 'LP',
          earn: 'MMO + MMF',
          lpAddresses: '0x6F186E4BEd830D13DcE638e40bA27Fd6d91BAd0B'
        }
      ]
    );
    console.log('Success');
  } catch (e) {
    console.error(e);
  }
})();
