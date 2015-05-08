/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
'use strict';
goog.provide('ThreeViewer.BackendService');

ThreeViewer.BackendService = function ($http) {
    this.http = $http;
};

ThreeViewer.BackendService.prototype.getVisualization = function (snapshotId, footprintMetricId, heightMetricId, viewType) {
    return this.http.get("../../api/softVis3D/getVisualization?snapshotId=" + snapshotId
    + "&footprintMetricId=" + footprintMetricId
    + "&heightMetricId=" + heightMetricId
    + "&viewType=" + viewType);
};

ThreeViewer.BackendService.prototype.getConfig = function (snapshotId) {
    return this.http.get("../../api/softVis3D/getConfig?snapshotId=" + snapshotId);
};