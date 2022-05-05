module.exports = async function () {
  const admin = await require('../../firebase/firebaseAdmin');

  const firestore = admin.firestore();

  const walletsColl = firestore.collection("compounderWallets");

  const walletsSnapshot = await walletsColl.get();

  const wallets = [];
  for (const doc of walletsSnapshot.docs) {
    const data = doc.data();
    data.id = doc.id;
    wallets.push(data);
  }

  return wallets;
};
