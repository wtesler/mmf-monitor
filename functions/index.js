(async function () {
  const functions = require('firebase-functions');
  const {discoverEndpoints} = require("cranny");
  const {reportError} = require("google-cloud-report-error");

  const cors = require("cors")({
    origin: true
  });

  const environmentSetup = require("./environmentSetup");
  environmentSetup();

  const justRouteName = route => route.replace('/', '');

  const restEndpoints = discoverEndpoints(__dirname, 'rest');
  const userCreateEndpoints = discoverEndpoints(__dirname, 'userCreate');
  const userDeleteEndpoints = discoverEndpoints(__dirname, 'userDelete');

  for (const endpoint of restEndpoints) {
    const funcName = justRouteName(endpoint.route);
    const func = endpoint.obj;
    exports[funcName] = functions.region('us-central1').https.onRequest(async (req, res) => {
      cors(req, res, async () => {
        try {
          await func(req, res);
        } catch (e) {
          reportError(e, 'functions');
          throw e;
        }
      });
    });
  }

  for (const endpoint of userCreateEndpoints) {
    const funcName = justRouteName(endpoint.route);
    const func = endpoint.obj;
    exports[funcName] = functions.auth.user().onCreate((async (user) => {
      try {
        await func(user);
      } catch (e) {
        reportError(e, 'functions');
        throw e;
      }
    }));
  }

  for (const endpoint of userDeleteEndpoints) {
    const funcName = justRouteName(endpoint.route);
    const func = endpoint.obj;
    exports[funcName] = functions.auth.user().onDelete((async (user) => {
      try {
        await func(user);
      } catch (e) {
        reportError(e, 'functions');
        throw e;
      }
    }));
  }
})();
