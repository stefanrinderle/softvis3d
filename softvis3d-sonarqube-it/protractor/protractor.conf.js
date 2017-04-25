/**
 * @author: @AngularClass
 */

require('ts-node/register');

var reporters = require('jasmine-reporters');
var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

var reporter = new HtmlScreenshotReporter({
  dest: './results',
  filename: 'my-report.html'
});

exports.config = {
  // baseUrl: 'http://localhost:9000',

  // use `npm run e2e`
  specs: [
    'test/**/**.e2e.ts'
  ],
  exclude: [],

  framework: 'jasmine2',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  capabilities: {
    // 'browserName': 'chrome',
    // 'chromeOptions': {
    //   'args': ['show-fps-counter=true', '–ignore-gpu-blacklist', '--enable-webgl', "--log-path=chromedriver.log"]
    // }
    'browserName': 'firefox'
  },

    onPrepare: function () {
        browser.ignoreSynchronization = true;
        // The require statement must be down here, since jasmine-reporters
        // needs jasmine to be in the global and protractor does not guarantee
        // this until inside the onPrepare function.
        var junitReporter = new reporters.JUnitXmlReporter({
            savePath: './results',
            consolidateAll: true
        });

        jasmine.getEnv().addReporter(junitReporter);
        jasmine.getEnv().addReporter(reporter);

        let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
        jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
    },

  beforeLaunch: function() {
    return new Promise(function(resolve){
      reporter.beforeLaunch(resolve);
    });
  },

  // Close the report after all tests finish
  afterLaunch: function(exitCode) {
    return new Promise(function(resolve){
      reporter.afterLaunch(resolve.bind(this, exitCode));
    });
  }

};
