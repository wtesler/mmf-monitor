module.exports = async function () {
  const admin = await require('../../firebase/firebaseAdmin');

  const firestore = admin.firestore();
  const response = await firestore.doc(`users/users`).get();
  if (!response.exists) {
    return [];
  }
  const itemsDoc = response.data();
  return itemsDoc.users;
};
