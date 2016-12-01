/// <reference path="../angular.min.js" />
/// <reference path="../adal.js" />
/// <reference path="../util.js" />
/// <reference path="../app.js" />
(function () {
    var FORM_TYPE = {
        Create: "C",
        Update: "U",
        Delete: "D"
    }
    var pt_sampleentityController = function ($scope, $routeParams, $http) {
        $scope.list = [];
        $scope.entity = {
            entityName: "pt_sampleentity",
            pluralName: "pt_sampleentities"
        };
        $scope.PageType = "none";
        $scope.selRecordId = $routeParams.recordId;
        $scope.selRecord = null;
        $scope.formType = "";

        $scope.viewInit = function () {
            console.info("View Init");
            $scope.PageType = "view";
            $scope.queryData();
        }
        $scope.formInit = function () {
            console.info("Form Init");
            $scope.PageType = "form";
            $scope.queryFormData();
        }
        $scope.queryData = function () {
            var token = authContext.getCachedToken(organizationURI);
            if (token == null) return;
            var req = new XMLHttpRequest
            req.open("GET", encodeURI(organizationURI + "/api/data/v8.2/" + $scope.entity.pluralName + "?$select=pt_name&$top=10"), true);
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                    var response = JSON.parse(req.responseText);
                    for (var i in response.value) {
                        $scope.list.push(response.value[i]);
                    }
                    $scope.$apply();
                }
            };
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Authorization", "Bearer " + token);
            req.send();
        }

        $scope.queryFormData = function () {
            if (!$scope.selRecordId || $scope.selRecordId == null) {
                console.warn("Record ID is not available");
                $scope.formType = FORM_TYPE.Create;
                return;
            }
            $scope.formType = FORM_TYPE.Update;
            requestUri = encodeURI(organizationURI + "/api/data/v8.2/" + $scope.entity.pluralName + "(" + $scope.selRecordId + ")");
            $scope.executeRequest("GET", requestUri, function (response) {
                console.log(response);
                $scope.selRecord = response;
            })

        }
        $scope.executeRequest = function (requestType, requestUri, callbackFn) {
            if (!RegExp(requestType, "g").test("POST PATCH PUT GET DELETE")) {
                throw new Error("Sdk.request: action parameter must be one of the following: " +
                    "POST, PATCH, PUT, GET, or DELETE.");
            }

            var token = authContext.getCachedToken(organizationURI);
            if (token == null) return;
            var req = new XMLHttpRequest
            req.open(requestType, requestUri, true);
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                    var response = JSON.parse(req.responseText);
                    if (typeof callbackFn == "function") {
                        callbackFn(response);
                        $scope.$apply();
                    }
                }
            };
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Authorization", "Bearer " + token);
            req.send();
        }
    }
    angular.module('myApp').controller('pt_sampleentityController', ["$scope", "$routeParams", "$http", pt_sampleentityController]);

}());

/*
pt_multilinetext
pt_name
pt_sampleentityid
pt_simpleboolean
pt_simplecurrency
pt_simplecurrency_base
pt_simpledateonly
pt_simpledateonlytimezoneindependent
pt_simpledateonlyuserlocal
pt_simpledatetimetimezoneindependent
pt_simpledatetimeuserlocal
pt_simpledecimal
pt_simplefloating
pt_simpleinteger
pt_simpleoption
_pt_accountlookup_value
_pt_customerlookup_value
*/