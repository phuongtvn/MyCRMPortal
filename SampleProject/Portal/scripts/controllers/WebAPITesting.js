var WebAPI = (function () {
    /*-------------------------------- Begin: declare variables --------------------------------*/
    var RESPONSE_STATUS = {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_CONTENT: 204,

        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDEN: 403,
        NOT_FOUND: 404,
        NOT_ALLOWED: 405
    }
    var READY_STATE = {
        UNSENT: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4
    }
    var organizationURI = "https://phuongtvn2.api.crm5.dynamics.com";
    var requestUri = organizationURI + "/api/data/v8.2/";


    /*-------------------------------- End: declare variables --------------------------------*/

    /*-------------------------------- Begin: private methods --------------------------------*/
    var _executeRequest = function (requestType, uri, isDataReturn, data, callbackFn) {
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
                }
            }
        };
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        if (isDataReturn == true)
            req.setRequestHeader("Prefer", "return=representation");
        req.setRequestHeader("Authorization", "Bearer " + token);

        req.send(JSON.stringify(data));
    }


    /*-------------------------------- End: private methods --------------------------------*/

    /*-------------------------------- Begin: public methods --------------------------------*/
    var sendRequest = function () {
        var requestType, requestUri, requestBody, isDataReturn, uri, parameters;
        uri = $("#uri").val();
        parameters = $("#parameters").val();
        requestType = $("#requestType").val();
        requestUri = uri + parameters;
        isDataReturn = $("#dataReturn").prop('checked');
        requestBody = JSON.parse($("#requestBody").val());


    }


    /*-------------------------------- End: public methods --------------------------------*/


    /*-------------------------------- Return public methods --------------------------------*/
    return {
        SendRequest: sendRequest
    }
})();