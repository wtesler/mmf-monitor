/**
 * Turns the provided handler function into a secret HTTPS REST function.
 * The function is private-key protected by a secret stored in a secrets manager.
 *
 * @param handler A function which takes (req, res).
 * @param secretName the name of the secret we should check the _secret in the body against.
 */
module.exports = function(handler, secretName) {
  const {rest} = require("cranny");

  return rest(async (req, res) => {
    const _secret = req.body._secret;

    const readSecretKey = require("../readSecretKey");
    const storedSecret = await readSecretKey(secretName);

    if (!_secret || _secret !== storedSecret) {
      res.status(403).send({ code: 403, message: 'Access Denied.' });
      return Promise.resolve();
    }

    return await handler(req, res);
  });
};
