module.exports = async function () {
  const admin = await require('../../firebase/firebaseAdmin');

  const firestore = admin.firestore();

  const walletsColl = firestore.collection("wallets");

  const walletsSnapshot = await walletsColl.get();

  const wallets = [];
  for (const doc of walletsSnapshot.docs) {
    const data = doc.data();
    wallets.push(data);
  }

  return wallets;
};
