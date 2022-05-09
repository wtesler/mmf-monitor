module.exports = async (config) => {
  const firebaseAdmin = await require('../../firebase/firebaseAdmin');

  const firestore = firebaseAdmin.firestore();

  const arbitrageColl = firestore.collection("arbitrage");

  await arbitrageColl.add(config);
};
