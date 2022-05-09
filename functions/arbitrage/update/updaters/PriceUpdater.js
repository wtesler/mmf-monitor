module.exports = class PriceUpdater {
  constructor() {
    const {BehaviorSubject} = require('rxjs');

    this.price = null;
    this.shouldUpdate = false;
    this.updatePeriodMs = 1000;
    this.numRequests = 0;

    this.priceSubject = new BehaviorSubject(null);
  }

  setConfig(pairToken, wallet, updatePeriodMs) {
    if (this.pairToken !== pairToken) {
      this._clear();
    }
    this.pairToken = pairToken;
    this.wallet = wallet;
    this.updatePeriodMs = updatePeriodMs;
  }

  start() {
    // noinspection JSIgnoredPromiseFromCall
    this._startUpdating();
  }

  stop() {
    this.shouldUpdate = false;
    this._clear();
  }

  observe() {
    return this.priceSubject;
  }

  _clear() {
    this.price = null;
    this.priceSubject.next(null);
  }

  async _startUpdating() {
    this.shouldUpdate = true;

    while (this.shouldUpdate) {
      // if (this.numRequests > 3) {
      //   continue; // Wait until the requests have completed.
      // }
      // noinspection ES6MissingAwait
      await this._readPrice();
      // await new Promise(resolve => setTimeout(resolve, this.updatePeriodMs)); // Sleep
    }
  }

  async _readPrice() {
    const readNativePrice = require('../../../web3/token/readNativePrice');

    try {
      this.numRequests++;
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 40000, 'timeout')); // 4 seconds.
      const readPricePromise = readNativePrice(this.pairToken, this.wallet.provider);
      const priceNativeFixedNumber = await Promise.race([readPricePromise, timeoutPromise]);
      if (priceNativeFixedNumber === 'timeout') {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('timeout');
      }
      const priceNativeFloat = priceNativeFixedNumber.toUnsafeFloat();
      if (priceNativeFloat !== this.price) {
        console.log(`${this.pairToken} PRICE: ${priceNativeFloat.toFixed(6)}`);
      }
      this.price = priceNativeFloat;
      this.priceSubject.next(this.price);
    } catch (e) {
      const errStr = e.toString();
      if (errStr.includes('Bad Gateway')) {
        console.warn('Bad Gateway.');
      } else if (e.message.includes('timeout')) {
        console.warn('Timeout.');
      } else {
        console.error(e);
      }
    } finally {
      this.numRequests--;
    }
  }
}