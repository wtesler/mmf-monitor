module.exports = async function() {
  const {readSecret} = require("google-cloud-secrets");
  return await readSecret('projects/348085923278/secrets/server_self_key/versions/latest');
};
