module.exports = async (itemName) => {
  const sendInBlueClient = await require("../sendinblue/client/SendInBlueClient");
  await sendInBlueClient.sendEmail('willtesler@gmail.com', 2, {tokenName: itemName}, null);
};
