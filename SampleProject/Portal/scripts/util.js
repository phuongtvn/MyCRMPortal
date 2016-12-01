/// <reference path="adal.js" />
/// <reference path="D:\Working\Projects_2016\Github\MyCRMPortal\SampleProject\scripts/jquery-1.9.1.min.js" />

/*===============================================================================================
||
|| IMPORTANT NOTES: 
|| - If Cross-Origin error => Update Manifest("oauth2AllowImplicitFlow": true) 
|| (http://stackoverflow.com/questions/29326918/adal-js-response-type-token-is-not-supported)
||
================================================================================================*/

var user, authContext, errorMessage;
var organizationURI = "https://phuongtvn2.api.crm5.dynamics.com"; // TODO: Add your organizationURI
var pageData = [];
(function () {
    var tenant = "b5101e80-6255-4e07-afed-380b2d3bdd51"; // TODO: add your tenant
    var clientId = "30156abc-cc53-468f-a1ca-972e1c3b02d6"; // TODO: Add your Client Id
    var pageUrl = "http://localhost:61950/Portal/Sample.html";// TODO: Add your Reply URL

    var endpoints = {
        orgUri: organizationURI
    };

    window.config = {
        tenant: tenant,
        clientId: clientId,
        postLogoutRedirectUri: pageUrl,
        endpoints: endpoints,
        cacheLocation: 'localStorage', 
    };
    authContext = new AuthenticationContext(config);
    authenticate();
    document.getElementById('login').addEventListener('click', function () {
        login();
    })
    //document.getElementById('btn_get_name').addEventListener('click', function () {
    //    authContext.acquireToken(organizationURI, getUserId)
    //})
    document.getElementById('sign_out').addEventListener('click', function () {
        authContext.logOut();
    })

})();

function authenticate() {
    var isCallback = authContext.isCallback(window.location.hash);
    if (isCallback) {
        authContext.handleWindowCallback();
    }
    var loginError = authContext.getLoginError();

    if (isCallback && !loginError) {
        window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);        
    }
    else {
        //errorMessage.textContent = loginError;
        //alert(loginError);
    }
    if (authContext._loginInProgress == true)
    {
        return;
    }

    //if (authContext.getCachedToken(organizationURI) == null)
    //{
    //    alert("Authentication token is expired or user is not logged in");
    //    return false;
    //}
    user = authContext.getCachedUser();
    var hasToken = true;
    if (authContext._getItem(authContext.CONSTANTS.STORAGE.EXPIRATION_KEY + organizationURI) == 0 || 
        authContext._getItem(authContext.CONSTANTS.STORAGE.RENEW_STATUS + window.config.clientId) == authContext.CONSTANTS.TOKEN_RENEW_STATUS_COMPLETED)
    {
        authContext.acquireToken(organizationURI,
        function (error, token) {
            if (!token) {
                console.warn("Cannot find token");
                hasToken = false;
                return false;
            }
            if (isCallback) {
                authContext.handleWindowCallback();
            }
        });
    }
    if (hasToken == false)
        return;

    var token = authContext.getCachedToken(organizationURI);
    if (user && token != null) {
        displayLogin();
    }
    
}
function login() {
    authContext.login();
}

function displayLogin() {

    var anonymous_div = document.getElementById('anonymous_user')
    anonymous_div.style.display = 'none';

    document.getElementById('register_user').style.display = 'block';

    var helloMessage = document.createElement("span");
    helloMessage.textContent = "Hello " + user.profile.name;
    document.getElementById('user_name').appendChild(helloMessage);
}

function getUserId(error,token) {
    var req = new XMLHttpRequest
    req.open("GET", encodeURI(organizationURI + "/api/data/v8.2/WhoAmI"), true);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var whoAmIResponse = JSON.parse(req.responseText);
            console.log(whoAmIResponse.UserId);
            //getFullname(whoAmIResponse.UserId)
        }
    };
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Authorization", "Bearer " + token);
    req.send();
}

function getFullname(Id) {
    var req = new XMLHttpRequest
    req.open("GET", encodeURI(organizationURI + "/api/data/v8.2/systemusers(" + Id + ")?$select=fullname"), true);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var userInfoResponse = JSON.parse(req.responseText);
            alert(userInfoResponse.fullname);
        }
    };
    req.setRequestHeader("Access-Control-Allow-Origin", "*");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Authorization", "Bearer " + authContext.getCachedToken(organizationURI));
    req.send();
}

var queryAccount = function () {
    var token = authContext.getCachedToken(organizationURI);
    if (token == null)
    {
        authContext.login();
    }
    var req = new XMLHttpRequest
    req.open("GET", encodeURI(organizationURI + "/api/data/v8.2/accounts?$select=name,emailaddress1,telephone1"), true);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var response = JSON.parse(req.responseText);
            queryAccountCallBack(response);
        }
    };
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Authorization", "Bearer " + token);
    req.send();
}

function queryAccountCallBack(response) {
    var listAccount = response.value;
    var table = document.getElementById("dataTable");
    $(table.tBodies[0]).empty();
    pageData = new Array();
    for (var i in listAccount)
    {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerText = listAccount[i].name;
        td.setAttribute("attribute-name","name");
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerText = listAccount[i].emailaddress1;
        td.setAttribute("attribute-name", "emailaddress1");
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerText = listAccount[i].telephone1;
        td.setAttribute("attribute-name", "telephone1");
        tr.appendChild(td);

        createOperations(tr);

        tr.id = listAccount[i].accountid;
        table.tBodies[0].appendChild(tr);
        pageData.push(listAccount[i]);
    }    
}

function createOperations(tr) {
    var td = document.createElement("td");
    var editLink = document.createElement("a");
    editLink.className = "btn btn-md glyphicon glyphicon-edit";
    editLink.onclick = editRecord;
    //editLink.setAttribute("data-toggle", "modal");
    editLink.setAttribute("data-target", "#editModal");
    
    var removeLink = document.createElement("a");
    removeLink.className = "btn btn-md glyphicon glyphicon-remove";
    removeLink.onclick = deleteRecord;
    
    td.appendChild(editLink);
    td.appendChild(removeLink);
    tr.appendChild(td);
}

function editRecord() {
    console.log(this);
    var row = $(this).parents("tr");
    var recordId = row.attr("id");
    var cols = row.children("td[attribute-name]");
    var recordData = {};
    var form = $("#form-body");
    for (var i = 0; i < cols.length; i++)
    {
        let colName = cols[i].getAttribute("attribute-name");
        form.find("input[attribute-name=" + colName + "]").val(cols[i].innerText);
    }

    //$("#myModal .modal-title").html(data);
    $("#editModal").modal();
}

function deleteRecord() {
    console.log(arguments);
}

