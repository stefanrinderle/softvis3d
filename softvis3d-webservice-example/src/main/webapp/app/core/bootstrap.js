/*jshint browser:true */
'use strict';

require('./vendor')();

// run an empty function
var appModule = require('../index');
// replaces ng-app="appName"
angular.element(document).ready(function () {
    angular.bootstrap(document, [appModule.name], {
        //strictDi: true
    });
});