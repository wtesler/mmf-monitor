const NetworkNames = require('../../constants/NetworkNames');

class DexScreenerClient {

  constructor() {
    this.request = require("superagent");

    this.DOMAIN = `https://api.dexscreener.io`;
    this.HOST = `${this.DOMAIN}/latest`;

    this.DOMAIN2 = `https://io.dexscreener.com`;
    this.HOST2 = `${this.DOMAIN}/u`;

    this.DEX = 'dex';
    this.PAIRS = 'pairs';
    this.CHART = 'chart';
    this.BARS = 'bars';
  }

  async readPairInfo(pairAddress, chainName=NetworkNames.CRONOS) {
    const req = this.request
      .get(`${this.HOST}/${this.DEX}/${this.PAIRS}/${chainName}/${pairAddress}`)
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      this._handleError(e, 'Dex Pairs');
      return null;
    }
  }

  _toSuccessResponse(networkResponse) {
    const code = networkResponse.statusCode;
    if (code && code === 200 || code === 201) {
      return networkResponse.body;
    } else {
      const error = new Error();
      error.code = code;
      error.message = networkResponse.text;
      throw error;
    }
  }

  _handleError(e, endpoint) {
    console.error(e);

    let errorText;
    if (e.response && e.response.text) {
      errorText = e.response.text;
    } else {
      errorText = e.toString();
    }
    const error = new Error(`DexScreener ${endpoint} endpoint failed with text: ${errorText}`);
    error.status = e.status;
    throw error;
  }

  _defaultHeaders() {
    return function (request) {
      request.set("accept", "application/json");
      request.set("content-type", "application/json");
      return request;
    };
  }

  _toResilient() {
    return function (request) {
      request.timeout({
        response: 15000,
        deadline: 60000,
      });
      request.retry(3);
      return request;
    };
  }
}

module.exports = new DexScreenerClient();
