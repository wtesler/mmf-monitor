const TokenNames = require('../../../constants/TokenNames');

module.exports = class BalanceUpdater {
  constructor() {
    const {BehaviorSubject} = require('rxjs');

    this.balances = {};

    this.registerMap = {};

    this.balancesSubject = new BehaviorSubject([null, null, null]);
  }

  setWallet(wallet) {
    this.wallet = wallet;
  }

  register(pairToken) {
    const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairToken);
    if (!(tokenA in this.registerMap)) {
      this.registerMap[tokenA] = new Set([]);
    }
    if (!(tokenB in this.registerMap)) {
      this.registerMap[tokenB] = new Set([]);
    }
    this.registerMap[tokenA].add(pairToken);
    this.registerMap[tokenB].add(pairToken);

    this._emit(pairToken, this.balances[tokenA], this.balances[tokenB]);
  }

  observe(pairToken) {
    const {map} = require('rxjs');
    const {filter} = require('rxjs/operators');

    return this.balancesSubject
      .pipe(filter(([pair, balance1, balance2]) => pair === pairToken))
      .pipe(map(([pair, balance1, balance2]) => [balance1, balance2]));
  }

  async update(pairToken, onResult) {
    const readTokenBalance = require('../../../web3/token/readTokenBalance');

    const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairToken);

    try {
      const balances = await Promise.all([
        readTokenBalance(tokenA, this.wallet, false),
        readTokenBalance(tokenB, this.wallet, false),
      ]);

      const balanceA = balances[0];
      const balanceB = balances[1];

      this.balances[tokenA] = balanceA;
      this.balances[tokenB] = balanceB;

      onResult(true);

      const emittedPairs = [];
      const tokenASet = this.registerMap[tokenA];
      const tokenBSet = this.registerMap[tokenB];

      const emitFromSet = (set) => {
        for (const pair of set) {
          if (!emittedPairs.includes(pair)) {
            const [splitA, splitB] = TokenNames.SplitTokenNames(pair);
            if (this.balances[splitA] && this.balances[splitB]) {
              this._emit(pair, this.balances[splitA], this.balances[splitB]);
              emittedPairs.push(pair);
            }
          }
        }
      }

      emitFromSet(tokenASet);
      emitFromSet(tokenBSet);
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

  _emit(pairToken, balanceA, balanceB) {
    const [tokenA, tokenB] = TokenNames.SplitTokenNames(pairToken);

    if (balanceA && balanceB) {
      console.log(`${pairToken} | ${tokenA} BALANCE: ${balanceA.toString()}`);
      console.log(`${pairToken} | ${tokenB} BALANCE: ${balanceB.toString()}`);
    }

    this.balancesSubject.next([pairToken, balanceA, balanceB]);
  }
};
