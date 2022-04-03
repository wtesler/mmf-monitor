module.exports = (async function() {
  const firebaseInit = require("./firebaseInit");
  const admin = await firebaseInit();

  return admin;
})();
