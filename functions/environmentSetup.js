const {reportError} = require("google-cloud-report-error");

module.exports = function () {
  process.env.GCLOUD_PROJECT = "mmf-monitor";
  global.crannyReportError = e => reportError(e, 'mmf-monitor');
};
