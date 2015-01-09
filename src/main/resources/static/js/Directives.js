/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
/**
 * trigger the event 'windowResize' on window resize.
 */
softVis3dAngular.directive('resize', ['$window', '$rootScope', function ($window, $rootScope) {
    return function ($scope, element) {
        var w = angular.element($window);

        $scope.getWindowDimensions = function () {
            return {
                'h': w.height(),
                'w': w.width()
            };
        };

        $scope.$watch($scope.getWindowDimensions, function (newValue) {
            $scope.windowHeight = newValue.h;
            $scope.windowWidth = newValue.w;
        }, true);

        w.bind('resize', function () {
            $scope.$apply();
            $rootScope.$broadcast('windowResize', $scope.windowWidth, $scope.windowHeight);
        });
    }
}]);