(async () => {
  const sendInBlueClient = await require('../SendInBlueClient');
  const response = await sendInBlueClient.sendEmail('willtesler@gmail.com', 3, {tokenName: 'MMF-CRO'}, null);
  // const response = await sendInBlueClient.sendSms('8472200839', 2, null, null);
  // const response = await sendInBlueClient.getSenders();
  // const response = await sendInBlueClient.getBlockedDomains();
  // const response = await sendInBlueClient.addContact('scottiet123@gmail.com')
  console.log(response);
})();
