class CronoscanClient {
  constructor() {
    this.request = require("superagent");
  }

  async readPage(tokenAddress) {
    const startTimeMs = Date.now();

    const req = this.request
      .get(`https://cronoscan.com/token/${tokenAddress}`)
      .buffer(true)
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const timeTakenMs = Date.now() - startTimeMs;
      const timeTakenSeconds = timeTakenMs / 1000;
      const timeStr = timeTakenSeconds.toFixed(1);

      console.log(`Read page in ${timeStr} seconds`);

      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      this._handleError(e, "Read App Page");
      return null;
    }
  }

  parsePriceUsdObject(page) {
    // Use this to locate where the items are in the text.
    const marker = `<script type="application/ld+json">`;
    const cueIndex = page.indexOf(marker);

    const objectChars = [];
    for (let i = cueIndex + marker.length; i < page.length - 8; i++) {
      if (page[i] === '<' &&
        page[i + 1] === '/' &&
        page[i + 2] === 's' &&
        page[i + 3] === 'c' &&
        page[i + 4] === 'r' &&
        page[i + 5] === 'i' &&
        page[i + 6] === 'p' &&
        page[i + 7] === 't' &&
        page[i + 8] === '>'
      ) {
        break;
      } else {
        objectChars.push(page[i]);
      }
    }

    const objectStr = objectChars.filter(x => x !== '\n').join('');

    console.log(objectStr);

    const object = JSON.parse(objectStr);

    return object;
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
    const error = new Error(`Cronoscan ${endpoint} endpoint failed with text: ${errorText}`);
    error.status = e.status;
    throw error;
  }

  _defaultHeaders() {
    return function (request) {
      // request.set("accept", "application/javascript");
      // request.set("content-type", "application/javascript");
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

module.exports = (function () {
  const client = new CronoscanClient();
  return client;
})();
