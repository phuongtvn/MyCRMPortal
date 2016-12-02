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
            .when("/contact/", {
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

            .when("/account/view", {
                templateUrl: "views/AccountView.html",
                controller: "accountController"
            })
            .when("/account/", {
                templateUrl: "views/AccountView.html",
                controller: "accountController"
            })

            .when("/pt_sampleentity/view", {
                templateUrl: "views/pt_sampleentity/EntityView.html",
                controller: "pt_sampleentityController"
            })
            .when("/pt_sampleentity/", {
                templateUrl: "views/pt_sampleentity/EntityView.html",
                controller: "pt_sampleentityController"
            })
            .when("/pt_sampleentity/form/:recordId", {
                templateUrl: "views/pt_sampleentity/EntityForm.html",
                controller: "pt_sampleentityController"
            })
            .when("/pt_sampleentity/form/", {
                templateUrl: "views/pt_sampleentity/EntityForm.html",
                controller: "pt_sampleentityController"
            })

            .otherwise({
                templateUrl: "views/ContactView.html",
                controller: "contactController"
            })
        }]);
}());
