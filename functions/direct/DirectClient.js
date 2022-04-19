/**
 * Makes direct calls to other cloud functions using the direct secret key.
 * Should only be used for Backend-To-Backend calls.
 *
 * This client should be asynchronously imported.
 */
class DirectClient {
  constructor(key) {
    this.directKey = key;

    this.request = require("superagent");

    this.HOST = "https://us-central1-mmf-monitor.cloudfunctions.net/";

    this.SWAP_STAKED_POOLS = "swapStakedPools";
  }

  setToTest() {
    this.HOST = "http://localhost:5000/mmf-monitor/us-central1/";
  }

  async swapStakedPools(srcPool, dstPool, mnemonic, email, signal) {
    const req = this.request
      .post(this.HOST + this.SWAP_STAKED_POOLS)
      .send({
        srcPool: srcPool,
        dstPool: dstPool,
        mnemonic: mnemonic,
        email: email,
        signal: signal,
      })
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      this._handleError(e, this.SWAP_STAKED_POOLS);
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
    let errorText;
    if (e.response && e.response.text) {
      errorText = e.response.text;
    } else {
      errorText = e.toString();
    }
    const error = new Error(`Direct call to ${endpoint} function failed with text: ${errorText}`);
    error.status = e.status;
    throw error;
  }

  _defaultHeaders() {
    return function (request) {
      request
        .send({
          _secret: this.directKey
        })
        .set("accept", "application/json")
        .set("content-type", "application/json");

      return request;
    }.bind(this);
  }

  _toResilient() {
    return function (request) {
      return request;
    };
  }
}

module.exports = (async function () {
  const readDirectKey = require("../secrets/specific/readDirectKey");
  const key = await readDirectKey();
  const client = new DirectClient(key);
  return client;
})();
