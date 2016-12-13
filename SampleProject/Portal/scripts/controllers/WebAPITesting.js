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
    var organizationURI = "https://phuongtvn3.api.crm5.dynamics.com";
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
        var req = new XMLHttpRequest();
        req.open(requestType, uri, true);
        req.onreadystatechange = function () {
            if (req.readyState == 4 && (req.status == 200 || req.status == 201 || req.status == 204)) {
                var response = (req.responseText == "") ? "" : JSON.parse(req.responseText);
                if (req.status == 204) {
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

        req.send(data == null ? null : JSON.stringify(data));
    }
    var _requestCallback = function (response) {
        if (typeof response == "string") {
            $("#response").val(response);
        }
        else if (typeof response == "object") {
            var json = JSON.stringify(response, null, 2);
            $("#response").val(json);
        }

        //$("#loader").attr("hidden", true);
    }

    var _beautifulJSON = function (json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
    /*-------------------------------- End: private methods --------------------------------*/

    /*-------------------------------- Begin: public methods --------------------------------*/
    var sendRequest = function () {
        try {                        
            //$("#loader").removeAttr("hidden");
            var requestType, requestUri, requestBody, isDataReturn, uri, parameters;
            uri = $("#uri").val();
            parameters = $("#parameters").val();
            requestType = $("#requestType").val();
            requestUri = uri + parameters;
            isDataReturn = $("#dataReturn").prop('checked');
            requestBody = $("#requestBody").val() == "" ? null : JSON.parse($("#requestBody").val());

            _executeRequest(requestType, requestUri, isDataReturn, requestBody, _requestCallback);
        } catch (ex) {
            throw new Error(ex.message);
        }

    }


    /*-------------------------------- End: public methods --------------------------------*/


    /*-------------------------------- Return public methods --------------------------------*/
    return {
        SendRequest: sendRequest
    }
})();