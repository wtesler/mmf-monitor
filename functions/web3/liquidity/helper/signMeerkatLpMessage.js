module.exports = async function (
  signer,
  lpAddress,
  contract,
  spender,
  value,
  deadline
) {
  const {utils} = require("ethers");

  const nonce = '0x01';

  const rawSignature = await signer._signTypedData(
    {
      name: 'Meerkat LPs',
      version: '1',
      chainId: 25,
      verifyingContract: lpAddress,
    },
    {
      Permit: [
        {
          name: "owner",
          type: "address",
        },
        {
          name: "spender",
          type: "address",
        },
        {
          name: "value",
          type: "uint256",
        },
        {
          name: "nonce",
          type: "uint256",
        },
        {
          name: "deadline",
          type: "uint256",
        },
      ],
    },
    {
      owner: signer.address,
      spender: spender,
      value: value,
      nonce: nonce,
      deadline: deadline,
    }
  );

  const split = utils.splitSignature(rawSignature);

  return [split.v, split.r, split.s];
};
