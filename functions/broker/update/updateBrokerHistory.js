module.exports = async (asset, newValue) => {
  const admin = await require('../../firebase/firebaseAdmin');
  const readBrokerHistory = await require('../read/readBrokerHistory');

  const brokerHistory = await readBrokerHistory(asset);

  const historyPoints = brokerHistory.points;

  historyPoints.push(newValue);

  if (historyPoints.length > brokerHistory.size) {
    historyPoints.shift();
  }

  brokerHistory.points = historyPoints;

  const newPoints = {
    points: historyPoints
  }

  const firestore = admin.firestore();
  const docRef = firestore.doc(`brokerHistory/${asset}`);

  await docRef.set(newPoints, {merge: true});

  return brokerHistory;
};
