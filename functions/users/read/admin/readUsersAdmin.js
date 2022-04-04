(async () => {
  const readUsers = require("../readUsers");
  try {
    const users = await readUsers();
    console.log(users);
  } catch (e) {
    console.error(e);
  }
})();
