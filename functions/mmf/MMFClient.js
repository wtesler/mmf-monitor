class MMFClient {
  constructor() {
    this.request = require("superagent");
  }

  async readAppIndex() {
    const req = this.request
      .get('https://vaults.mm.finance/vault')
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      this._handleError(e, "Read App Index");
    }
  }

  async readAppPage(url) {
    const req = this.request
      .get(url)
      .buffer(true)
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      this._handleError(e, "Read App Page");
    }
  }

  _toSuccessResponse(networkResponse) {
    const code = networkResponse.statusCode;
    if (code && code === 200 || code === 201) {
      return networkResponse.text;
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
    const error = new Error(`Sendinblue ${endpoint} endpoint failed with text: ${errorText}`);
    error.status = e.status;
    throw error;
  }

  _defaultHeaders() {
    return function (request) {
      request.set("accept", "application/javascript");
      request.set("content-type", "application/javascript");
      return request;
    }.bind(this);
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

module.exports = (function () {
  const client = new MMFClient();
  return client;
})();
