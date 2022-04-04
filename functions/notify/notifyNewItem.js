module.exports = async (itemName) => {
  const sendInBlueClient = await require("../sendinblue/client/SendInBlueClient");
  const readUsers = require("../users/read/readUsers");

  const users = await readUsers();

  for (const user of users) {
    await sendInBlueClient.sendEmail(user, 2, {tokenName: itemName}, null);
  }
};
