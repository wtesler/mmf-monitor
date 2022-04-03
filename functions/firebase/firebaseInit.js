module.exports = async function () {
  const { initializeApp, cert } = require('firebase-admin/app');

  const readFirebaseConfig = require("../secrets/specific/readFirebaseConfig");
  const service_account = await readFirebaseConfig();

  initializeApp({
    credential: cert(service_account),
    databaseURL: 'https://mmf-monitor.firebaseio.com',
    storageBucket: 'mmf-monitor.appspot.com',
  });

  // The following back-ports support for firebase-admin 10 to the codebase.
  // Future projects should use the new firebase-admin 10 syntax directly.

  const { getFirestore, FieldValue } = require('firebase-admin/firestore');

  const firestore = getFirestore();

  const admin = {};

  // Services
  admin.firestore = () => {return firestore};

  // Properties
  admin.firestore.FieldValue = FieldValue;

  return admin;
}
