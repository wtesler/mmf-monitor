class CoinGeckoClient {
  constructor() {
    this.request = require("superagent");

    this.DOMAIN = `https://api.coingecko.com/api`;
    this.HOST = `${this.DOMAIN}/v3`;

    this.SIMPLE = 'simple';
    this.PRICE = 'price';
  }

  async readPrice(tokenA, tokenB) {
    tokenA = tokenA.toLowerCase();
    tokenB = tokenB.toLowerCase();
    const req = this.request
      .get(`${this.HOST}/${this.SIMPLE}/${this.PRICE}`)
      .query({
        ids: tokenA,
        vs_currencies: tokenB
      })
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return Number(serverResponse[tokenA][tokenB]);
    } catch (e) {
      this._handleError(e, 'Get Simple Price');
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
    const error = new Error(`CoinGecko ${endpoint} endpoint failed with text: ${errorText}`);
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

module.exports = new CoinGeckoClient();
