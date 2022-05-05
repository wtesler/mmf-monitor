(async () => {
  const readBrokerHistory = require("../read/readBrokerHistory");
  const TokenNames = require("../../constants/TokenNames");
  const history = await readBrokerHistory(TokenNames.MMF_USDC);
  const prices = history.prices;

  const admin = await require('../../firebase/firebaseAdmin');

  const firestore = admin.firestore();
  const docRef = firestore.doc(`brokerHistory/${TokenNames.MMF_MUSD}`);

  await docRef.set({
    prices: prices
  }, {merge: true});

})();
