module.exports = async (asset) => {
  const admin = await require('../../firebase/firebaseAdmin');

  const firestore = admin.firestore();
  const response = await firestore.doc(`brokerHistory/${asset}`).get();
  if (!response.exists) {
    throw new Error('No broker history found.');
  }
  const history = response.data();
  return history;
};
