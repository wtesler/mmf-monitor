module.exports = class TokenAddresses {
  static get USDC() {
    return '0xc21223249ca28397b4b6541dffaecc539bff0c59';
  }

  static get USDT() {
    return '0x66e428c3f67a68878562e79a0234c1f83c208770';
  }

  static get DAI() {
    return '0xf2001b145b43032aaf5ee2884e456ccd805f677d';
  }

  static get MMF() {
    return '0x97749c9b61f878a880dfe312d2594ae07aed7656';
  }

  static get MUSD() {
    return '0x95aeaf383e2e86a47c11cffde1f7944ecb2c38c2';
  }

  static get DUSD() {
    return '0x6582C738660bf0701f05b04DcE3c4E5Fcfcda47a';
  }

  static get SVN() {
    return '0x654bAc3eC77d6dB497892478f854cF6e8245DcA9';
  }

  static get MMF_USDC() {
    return '0x722f19bd9a1e5ba97b3020c6028c279d27e4293c';
  }

  static get USDT_USDC() {
    return '0x6f186e4bed830d13dce638e40ba27fd6d91bad0b';
  }

  static get MMF_MUSD() {
    return '0xeF2dC4849bDCC120acB7274cd5A557B5145DA149';
  }

  static get MUSD_USDC() {
    return '0x0B083d50417FEC1390C2C07Eba85f31D5EeFC350';
  }

  static get DUSD_USDC() {
    return '0x8c183c81a5ae3e7a46ecaac17c4bf27a6a40bbe8';
  }

  static get DAI_USDC() {
    return '0x787A47b0596fa8F7D6666F3C59696b3c57bB612b';
  }

  static get THREEMM() {
    return '0x74759c8bcb6787ef25ed2ff432fe33ed57cccb0d';
  }

  static get MUSD_THREEMM() {
    return '0xdB04E53eC3FAB887Be2F55C3fD79bC57855bC827';
  }

  static AreAddressesEqual(address1, address2) {
    return address1.toLowerCase() === address2.toLowerCase();
  }
};
