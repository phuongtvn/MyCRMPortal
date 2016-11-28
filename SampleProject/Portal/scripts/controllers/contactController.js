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
        $scope.selectedRecordId = $routeParams.recordId;
        $scope.selectedRecord = null;
        $scope.formType = "";

        $scope.viewInit = function()
        {
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
            req.open("GET", encodeURI(organizationURI + "/api/data/v8.2/contacts?$select=fullname&$top=10"), true);
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                    var response = JSON.parse(req.responseText);                    
                    for (var i in response.value)
                    {
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

        $scope.queryFormData = function () {
            console.log($routeParams.selectedRecordId);
            if (!$scope.selectedRecordId || $scope.selectedRecordId == null) {
                console.warn("Record ID is not available");
                $scope.formType = FORM_TYPE.Create;
                return;
            }
            $scope.formType = FORM_TYPE.Update;
            // jobtitle | parentcustomerid | emailaddress1 | telephone1 | mobilephone | parentcustomerid | 
            requestUri = encodeURI(organizationURI + "/api/data/v8.2/contacts(" + $scope.selectedRecordId + ")");
            $scope.executeRequest(requestUri, function (response) {
                console.log(response);
                $scope.selectedRecord = response;
            })

        }
        $scope.TestScript = function () {
            /*--------------------------------*/
            /*                                */
            /*           NOT IN USE           */
            /*                                */
            /*--------------------------------*/
        }
        $scope.executeRequest = function (requestUri, callbackFn) {
            var token = authContext.getCachedToken(organizationURI);
            if (token == null) return;
            var req = new XMLHttpRequest
            req.open("GET", requestUri, true);
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                    var response = JSON.parse(req.responseText);
                    if (typeof callbackFn == "function")
                    {
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
    angular.module('myApp').controller('contactController', ["$scope", "$routeParams", "$http", contactController]);

}());