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
    const readTokenBalance = require('../../../web3/token/readTokenBalance');

    try {
      const balances = await Promise.all([
        readTokenBalance(this.tokenA, this.wallet, false),
        readTokenBalance(this.tokenB, this.wallet, false),
      ]);

      this.balanceA = balances[0];
      this.balanceB = balances[1];

      onResult(true);

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
      console.log(`${this.tokenA} BALANCE: ${this.balanceA.toString()}`);
      console.log(`${this.tokenB} BALANCE: ${this.balanceB.toString()}`);
    }
    this.balancesSubject.next([this.balanceA, this.balanceB]);
  }
};
