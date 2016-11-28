/// <reference path="angular.js" />
/// <reference path="angular-route.js" />
(function () {
    main = angular.module('myApp', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
            .when("/contact/view", {
                templateUrl: "views/ContactView.html",
                controller: "contactController"
            })
            .when("/contact/form/:recordId", {
                templateUrl: "views/ContactForm.html",
                controller: "contactController"
            })
            .when("/contact/form/", {
                templateUrl: "views/ContactForm.html",
                controller: "contactController"
            })
            .otherwise({
                templateUrl: "views/ContactView.html",
                controller: "contactController"
            })
        }]);
}());
main.controller("mainCtrl", ["$scope", function ($scope) {
    $scope.message = "Hello World";
    $scope.data = "Hello World";
}]);

