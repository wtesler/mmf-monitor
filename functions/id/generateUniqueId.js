module.exports = function () {
  const {customAlphabet} = require('nanoid');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const nanoid = customAlphabet(alphabet, 20);
  return nanoid();
}
