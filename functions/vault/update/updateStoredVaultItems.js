module.exports = async function (items) {
  const admin = await require('../../firebase/firebaseAdmin');

  const firestore = admin.firestore();
  const collection = firestore.collection('vault');

  const docRef = collection.doc('items');

  await docRef.set({items: items}, {merge: false});
};
