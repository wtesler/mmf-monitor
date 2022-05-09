/**
 * Adds a new config for a arbitrage pool.
 *
 * Note that you must manually enter the mnemonic on firestore.
 */
module.exports = async () => {
  const firebaseAdmin = await require('../../firebase/firebaseAdmin');

  const firestore = firebaseAdmin.firestore();

  const arbitrageColl = firestore.collection("arbitrage");

  const configsSnapshot = await arbitrageColl.get();

  const configs = [];
  for (const doc of configsSnapshot.docs) {
    const data = doc.data();
    data.id = doc.id;
    configs.push(data);
  }

  return configs;
};
