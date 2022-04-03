module.exports = async function() {
  const {readSecret} = require("google-cloud-secrets");
  const payload = await readSecret('projects/348085923278/secrets/firebase_admin_config/versions/latest');
  const config = JSON.parse(payload);
  return config;
};
