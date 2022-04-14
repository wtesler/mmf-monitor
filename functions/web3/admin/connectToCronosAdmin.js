(async () => {
  const connectToCronos = require("../connectToCronos");
  try {
    await connectToCronos();
    console.log('Success');
  } catch (e) {
    console.error(e);
  }
})();
