module.exports = async () => {
  const admin = await require('../../firebase/firebaseAdmin');

  const firestore = admin.firestore();
  const response = await firestore.doc(`compounder/config`).get();
  if (!response.exists) {
    throw new Error('No broker config found.');
  }
  const config = response.data();
  return config;
};
