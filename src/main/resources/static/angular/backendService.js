/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
softVis3dAngular.factory('backendService', ['$http', function($http) {
    return {
        getTreeForSnapshotView: function(snapshotId, footprintMetricId, heightMetricId, viewType) {
            // $http returns a promise, which has a then function, which also returns a promise
            var promise = $http.get("../../api/softVis3D/getTree?snapshotId=" + snapshotId
                + "&footprintMetricId=" + footprintMetricId
                + "&heightMetricId=" + heightMetricId
                // TODO: change this line
                // + "&viewType=" + viewType).then(function (response) {
                // to test
                + "&viewType=" + "city").then(function (response) {
                return response.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
}]);