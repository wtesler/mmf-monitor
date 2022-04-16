module.exports = async (asset, field, newValue) => {
  const admin = await require('../../firebase/firebaseAdmin');
  const readBrokerHistory = await require('../read/readBrokerHistory');

  const brokerHistory = await readBrokerHistory(asset);

  const historyField = brokerHistory[field];

  historyField.push(newValue);

  if (historyField.length > brokerHistory.size) {
    historyField.shift();
  }

  brokerHistory[field] = historyField;

  const newSeries = {
    [field]: historyField
  };

  const firestore = admin.firestore();
  const docRef = firestore.doc(`brokerHistory/${asset}`);

  await docRef.set(newSeries, {merge: true});

  return brokerHistory;
};
