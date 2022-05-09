module.exports = class BalanceUpdater {
  constructor() {
    const {BehaviorSubject} = require('rxjs');

    this.balanceA = null;
    this.balanceB = null;

    this.tokenA = null;
    this.tokenB = null;

    this.balancesSubject = new BehaviorSubject([null, null]);
  }

  setConfig(pairToken, wallet) {
    const TokenNames = require('../../../constants/TokenNames');

    this.pairToken = pairToken;

    const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairToken);

    let hasChanged = false;

    if (this.tokenA !== tokenA) {
      this.balanceA = null;
      hasChanged = true;
    }
    if (this.tokenB !== tokenB) {
      this.balanceB = null;
      hasChanged = true;
    }

    this.tokenA = tokenA;
    this.tokenB = tokenB;
    this.wallet = wallet;

    if (hasChanged) {
      this._emit();
    }
  }

  observe() {
    return this.balancesSubject;
  }

  async update(onResult) {
    const TokenDecimals = require('../../../constants/TokenDecimals');
    const readTokenBalance = require('../../../web3/token/readTokenBalance');
    const FixedNumberUtils = require('../../../numbers/FixedNumberUtils');
    const {BigNumber} = require('ethers');

    try {
      const balances = await Promise.all([
        readTokenBalance(this.tokenA, this.wallet, false),
        readTokenBalance(this.tokenB, this.wallet, false),
      ]);

      this.balanceA = balances[0];
      this.balanceB = balances[1];

      const tokenABalanceFixed = FixedNumberUtils.From(this.balanceA);
      const tokenBBalanceFixed = FixedNumberUtils.From(this.balanceB);
      const tokenADecimalMult = BigNumber.from('10').pow(TokenDecimals[this.tokenA]);
      const tokenBDecimalMult = BigNumber.from('10').pow(TokenDecimals[this.tokenB]);
      const adjustedTokenAFixed = FixedNumberUtils.Divide(tokenABalanceFixed, tokenADecimalMult);
      const adjustedTokenBFixed = FixedNumberUtils.Divide(tokenBBalanceFixed, tokenBDecimalMult);
      const totalBalanceUsd = adjustedTokenAFixed.addUnsafe(adjustedTokenBFixed).toString();

      onResult([this.tokenA, this.tokenB, this.balanceA, this.balanceB, totalBalanceUsd]);

      this._emit();
    } catch (e) {
      const errStr = e.toString();
      if (errStr.includes('Bad Gateway')) {
        console.warn('Bad Gateway.');
      } else {
        console.error(e);
      }
      onResult(false);
    }
  }

  _emit() {
    if (this.balanceA && this.balanceB) {
      console.log(`${this.pairToken} | ${this.tokenA} BALANCE: ${this.balanceA.toString()}`);
      console.log(`${this.pairToken} | ${this.tokenB} BALANCE: ${this.balanceB.toString()}`);
    }
    this.balancesSubject.next([this.balanceA, this.balanceB]);
  }
};
