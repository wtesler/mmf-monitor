module.exports = async (asset, oldAction, oldActionTimeMs, newAction) => {
  const admin = await require('../../firebase/firebaseAdmin');

  const newActionData = {
    action: {
      lastAction: oldAction,
      lastActionTimeMs: oldActionTimeMs,
      curAction: newAction,
      curActionTimeMs: Date.now(),
    }
  };

  const firestore = admin.firestore();
  const docRef = firestore.doc(`brokerHistory/${asset}`);

  await docRef.set(newActionData, {merge: true});
};
