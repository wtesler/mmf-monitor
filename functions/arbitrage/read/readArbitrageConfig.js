module.exports = async () => {
  const firebaseAdmin = await require('../../firebase/firebaseAdmin');

  const firestore = firebaseAdmin.firestore();
  const response = await firestore.doc(`arbitrage/config`).get();
  if (!response.exists) {
    throw new Error('No arbitrage config found.');
  }
  const config = response.data();

  return config;
};
