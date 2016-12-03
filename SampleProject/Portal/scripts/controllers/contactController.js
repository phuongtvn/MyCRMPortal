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
    var contactController = function ($scope, $routeParams, $http) {
        $scope.contacts = [];
        $scope.PageType = "none";
        $scope.selRecordId = $routeParams.recordId;
        $scope.selRecord = null;
        $scope.formType = "";
        $scope.message = "";

        /*------------------ Begin: VIEW methods ------------------*/
        $scope.viewInit = function () {
            console.info("View Init");
            $scope.PageType = "view";
            $scope.queryData();
        }
        $scope.queryData = function () {
            var token = authContext.getCachedToken(organizationURI);
            if (token == null) return;
            $scope.contacts = [];
            var req = new XMLHttpRequest
            req.open("GET", encodeURI(organizationURI + "/api/data/v8.2/contacts?$select=fullname&$top=20&$orderby=modifiedon desc"), true);
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                    var response = JSON.parse(req.responseText);
                    for (var i in response.value) {
                        $scope.contacts.push(response.value[i]);
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

        $scope.deleteRecord = function () {
            var id = $("#deleteModal").attr("recordId");
            if (id && id != null) {
                let requestUri = encodeURI(organizationURI + "/api/data/v8.2/contacts(" + id + ")");
                $scope.executeRequest("DELETE", requestUri, null, function (response) {
                    $scope.message = "Contact is deleted successfully !";
                    $scope.showNotification();
                    $scope.queryData();
                })
            }
        }
        /*------------------ End: VIEW methods ------------------*/

        /*------------------ Begin: FORM methods ------------------*/
        $scope.formInit = function () {
            console.info("Form Init");
            $scope.PageType = "form";
            $scope.queryFormData();
        }
        $scope.form_save = function () {
            var requestUri = "";
            if ($scope.formType == FORM_TYPE.Create) {
                // Create Record
                requestUri = encodeURI(organizationURI + "/api/data/v8.2/contacts");
                $scope.executeRequest("POST", requestUri, $scope.selRecord, function (response) {
                    recordUri = response;
                    var regExp = /\(([^)]+)\)/;
                    var matches = regExp.exec(recordUri);
                    if (matches == null)
                        console.error("Error when execute action. Record uri:" + recordUri);
                    else {
                        var newRecordId = matches[1];
                        location.hash += newRecordId;
                    }
                })
            }
            else {
                // Update record using PATCH
                if ($scope.formType == FORM_TYPE.Update) {
                    requestUri = encodeURI(organizationURI + "/api/data/v8.2/contacts(" + $scope.selRecordId + ")");
                    let updateEntity = {
                        firstname: $scope.selRecord.firstname,
                        lastname: $scope.selRecord.lastname,
                        jobtitle: $scope.selRecord.jobtitle,
                        emailaddress1: $scope.selRecord.emailaddress1
                    };

                    $scope.executeRequest("PATCH", requestUri, updateEntity, function (response) {
                        $scope.message = "Contact is updated successfully !";
                        $scope.showNotification();
                        $scope.selRecord = response;
                    })
                }
            }
        }
        $scope.queryFormData = function () {
            if (!$scope.selRecordId || $scope.selRecordId == null) {
                console.warn("Record ID is not available");
                $scope.formType = FORM_TYPE.Create;
                return;
            }
            $scope.formType = FORM_TYPE.Update;
            requestUri = encodeURI(organizationURI + "/api/data/v8.2/contacts(" + $scope.selRecordId + ")");
            $scope.executeRequest("GET", requestUri, null, function (response) {
                $scope.selRecord = response;
            })

        }

        $scope.showNotification = function () {
            $('#modalNotification').modal('show');
        }

        /*------------------ End: FORM methods ------------------*/

        /*------------------ Begin: UTILITY methods ------------------*/

        $scope.executeRequest = function (requestType, requestUri, data, callbackFn) {
            if (!RegExp(requestType, "g").test("POST PATCH PUT GET DELETE")) {
                throw new Error("Sdk.request: action parameter must be one of the following: " +
                    "POST, PATCH, PUT, GET, or DELETE.");
            }

            var token = authContext.getCachedToken(organizationURI);
            if (token == null) return;
            var req = new XMLHttpRequest
            req.open(requestType, requestUri, true);
            req.onreadystatechange = function () {
                if (req.readyState == 4 && (req.status == 200 || req.status == 201 || req.status == 204)) {                    
                    var response = (req.responseText == "") ? "" : JSON.parse(req.responseText);
                    if (requestType == "POST" && req.status == 204) {
                        // RECORD CREATED => refresh url
                        response = req.getResponseHeader("OData-EntityId");                     
                    }

                    if (typeof callbackFn == "function") {
                        callbackFn(response);
                        $scope.$apply();
                    }
                }
            };
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            if (requestType == "PATCH")
                req.setRequestHeader("Prefer", "return=representation"); // Update with data return
            req.setRequestHeader("Authorization", "Bearer " + token);
            req.send(JSON.stringify(data));
        }

        /*------------------ End: UTILITY methods ------------------*/
    }
    angular.module('myApp').controller('contactController', ["$scope", "$routeParams", "$http", contactController]);

}());