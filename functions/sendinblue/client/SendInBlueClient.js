class SendInBlueClient {
  constructor(key) {
    this.apiKey = key;

    this.request = require("superagent");

    this.DOMAIN = "https://api.sendinblue.com";
    this.HOST = this.DOMAIN + "/v3/";

    this.EMAIL = "smtp/email";
    this.CONTACTS = "contacts";
    this.LISTS = "lists";
    this.SENDERS = "senders";
    this.TEMPLATES = "smtp/templates";
    this.BLOCKED = "smtp/blockedDomains";
    this.TRANSACTIONAL_SMS = "transactionalSMS";
    this.SMS = "sms";
  }

  static get DEFAULT_EMAIL() {
    return {
      name: 'Will Tesler',
      email: 'willtesler@gmail.com'
    };
  }

  getDefaultAddress() {
    return SendInBlueClient.DEFAULT_EMAIL.email;
  }

  /**
   * Adds a new contact
   */
  async addContact(email) {
    const req = this.request
      .post(this.HOST + this.CONTACTS)
      .send({
        email: email
      })
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      let errorText;
      if (e.response && e.response.text) {
        errorText = e.response.text;
      }
      if (errorText.includes('Contact already exist')) {
        console.warn('Contact exists');
        return null;
      } else {
        this._handleError(e, this.CONTACTS);
      }
    }
  }

  async addContactToList(email, listNumber) {
    // First ensure the contact is already registered in general.
    try {
      await this.addContact(email);
    } catch (e) {
      this._handleError(e, "Add Contact");
    }

    const req = this.request
      .post(`${this.HOST}${this.CONTACTS}/${this.LISTS}/${listNumber}/contacts/add`)
      .send({
        emails: [email]
      })
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      let errorText;
      if (e.response && e.response.text) {
        errorText = e.response.text;
      }
      if (errorText.includes('Contact already in list')) {
        console.warn('Contact already in list');
        return null;
      } else {
        this._handleError(e, "Add Contact to List");
      }
    }
  }

  async sendEmail(
    recipientEmail,
    templateId,
    params = null,
    attachment = null,
    sender = SendInBlueClient.DEFAULT_EMAIL,
    replyTo = SendInBlueClient.DEFAULT_EMAIL,
  ) {
    if (!sender) {
      sender = SendInBlueClient.DEFAULT_EMAIL;
    }

    if (!replyTo) {
      replyTo = SendInBlueClient.DEFAULT_EMAIL;
    }

    const sendObj = {
      sender: sender,
      replyTo: replyTo,
      to: [{
        email: recipientEmail
      }],
      templateId: templateId,
      attachment: attachment,
      headers: {
        charset: 'iso-8859-1'
      }
    };

    if (params) {
      sendObj.params = params;
    }

    const req = this.request
      .post(this.HOST + this.EMAIL)
      .send(sendObj)
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      this._handleError(e, this.EMAIL);
    }
  }

  async sendSms(
    recipientNumber,
    templateId,
    params = null
  ) {
    const sendObj = {
      sender: 'Will',
      recipient: `18472200839`,
      content: 'hello',
      type: 'transactional'
    };

    if (params) {
      sendObj.params = params;
    }

    const req = this.request
      .post(this.HOST + this.TRANSACTIONAL_SMS + '/' + this.SMS)
      .send(sendObj)
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      this._handleError(e, this.TRANSACTIONAL_SMS);
    }
  }

  async readTemplate(templateId) {
    const req = this.request
      .get(this.HOST + this.TEMPLATES + '/' + templateId)
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      this._handleError(e, this.TEMPLATES);
    }
  }

  async addSender(name, email) {
    const req = this.request
      .post(this.HOST + this.SENDERS)
      .send({
        name: name,
        email: email,
      })
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      this._handleError(e, this.SENDERS);
    }
  }

  async getSenders() {
    const req = this.request
      .get(this.HOST + this.SENDERS)
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      this._handleError(e, this.SENDERS);
    }
  }

  async getBlockedDomains() {
    const req = this.request
      .get(this.HOST + this.BLOCKED)
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      this._handleError(e, this.BLOCKED);
    }
  }

  async getTemplateInfo(templateId) {
    const req = this.request
      .get(this.HOST + this.TEMPLATES + '/' + templateId)
      .use(this._defaultHeaders())
      .use(this._toResilient());

    try {
      const networkResponse = await req;
      const serverResponse = this._toSuccessResponse(networkResponse);
      return serverResponse;
    } catch (e) {
      this._handleError(e, 'Get template info');
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
    const error = new Error(`Sendinblue ${endpoint} endpoint failed with text: ${errorText}`);
    error.status = e.status;
    throw error;
  }

  _defaultHeaders() {
    return function (request) {
      request.set("api-key", this.apiKey);
      request.set("accept", "application/json");
      request.set("content-type", "application/json");
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

module.exports = (async function () {
  const readSendInBlueKey = require("../../secrets/specific/readSendInBlueKey");
  const key = await readSendInBlueKey();
  const client = new SendInBlueClient(key);
  return client;
})();
