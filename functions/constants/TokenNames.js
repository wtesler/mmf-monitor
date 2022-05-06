module.exports = class TokenNames {
  static SplitTokenNames(pairTokenName) {
    const tokens = pairTokenName.split('_');
    const tokenA = tokens[0];
    const tokenB = tokens[1];
    return [tokenA, tokenB];
  }

  static get USDC() {
    return 'USDC';
  }

  static get USDT() {
    return 'USDT';
  }

  static get DAI() {
    return 'DAI';
  }

  static get MMF() {
    return 'MMF';
  }

  static get MUSD() {
    return 'MUSD';
  }

  static get CRO() {
    return 'CRO';
  }

  static get SVN() {
    return 'SVN';
  }

  static get MMF_USDC() {
    return 'MMF_USDC';
  }

  static get MMF_MUSD() {
    return 'MMF_MUSD';
  }

  static get MUSD_USDC() {
    return 'MUSD_USDC';
  }

  static get USDC_USDT() {
    return 'USDC_USDT';
  }

  static get DAI_USDC() {
    return 'DAI_USDC';
  }

  static get THREEMM() {
    return 'THREEMM';
  }

  static get MUSD_THREEMM() {
    return 'MUSD_THREEMM';
  }
};
