let app = {};

app.config = {
  'sessionToken' : false
};

app.client = {}

app.client.request = (headers,path,method,queryStringObject,payload,callback) => {

  headers = typeof(headers) == 'object' && headers !== null ? headers : {};
  path = typeof(path) == 'string' ? path : '/';
  method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
  payload = typeof(payload) == 'object' && payload !== null ? payload : {};
  callback = typeof(callback) == 'function' ? callback : false;

  let requestUrl = path+'?';
  let counter = 0;
  for(let queryKey in queryStringObject){
     if(queryStringObject.hasOwnProperty(queryKey)){
       counter++;
       if(counter > 1){
         requestUrl+='&';
       }
       requestUrl+=queryKey+'='+queryStringObject[queryKey];
     }
  }

  let xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/json");

  for(let headerKey in headers){
     if(headers.hasOwnProperty(headerKey)){
       xhr.setRequestHeader(headerKey, headers[headerKey]);
     }
  }

  if(app.config.sessionToken){
    xhr.setRequestHeader("token", app.config.sessionToken.id);
  }

  xhr.onreadystatechange = () => {
      if(xhr.readyState == XMLHttpRequest.DONE) {
        let statusCode = xhr.status;
        let responseReturned = xhr.responseText;

        if(callback){
          try{
            let parsedResponse = JSON.parse(responseReturned);
            callback(statusCode,parsedResponse);
          } catch(e){
            callback(statusCode,false);
          }

        }
      }
  }

  let payloadString = JSON.stringify(payload);
  xhr.send(payloadString);

};

app.bindLogoutButton = () => {
  document.getElementById("logoutButton").addEventListener("click", (e)=>{

    e.preventDefault();

    app.logUserOut();

  });
};

app.logUserOut = (redirectUser) => {
  redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;

  let tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

  let queryStringObject = {
    'id' : tokenId
  };
  app.client.request(undefined,'api/tokens','DELETE',queryStringObject,undefined,(statusCode,responsePayload)=>{
    app.setSessionToken(false);

    if(redirectUser){
      window.location = '/session/deleted';
    }

  });
};

app.bindForms = () => {
  if(document.querySelector("form")){

    let allForms = document.querySelectorAll("form");
    for(let i = 0; i < allForms.length; i++){
        allForms[i].addEventListener("submit", function(e){

        e.preventDefault();
        let formId = this.id;
        let path = this.action;
        let method = this.method.toUpperCase();

        document.querySelector("#"+formId+" .formError").style.display = 'none';

        if(document.querySelector("#"+formId+" .formSuccess")){
          document.querySelector("#"+formId+" .formSuccess").style.display = 'none';
        }

        let payload = {};
        let elements = this.elements;
        for(let i = 0; i < elements.length; i++){
          if(elements[i].type !== 'submit'){
            let classOfElement = typeof(elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
            let valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value);
            let elementIsChecked = elements[i].checked;
            let nameOfElement = elements[i].name;
            if(nameOfElement == '_method'){
              method = valueOfElement;
            } else {
              if(nameOfElement == 'httpmethod'){
                nameOfElement = 'method';
              }
              if(nameOfElement == 'uid'){
                nameOfElement = 'id';
              }
              if(classOfElement.indexOf('multiselect') > -1){
                if(elementIsChecked){
                  payload[nameOfElement] = typeof(payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                  payload[nameOfElement].push(valueOfElement);
                }
              } else {
                payload[nameOfElement] = valueOfElement;
              }

            }
          }
        }


        let queryStringObject = method == 'DELETE' ? payload : {};

        app.client.request(undefined,path,method,queryStringObject,payload,(statusCode,responsePayload)=>{
          if(statusCode !== 200){

            if(statusCode == 403){
              app.logUserOut();

            } else {

              let error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

              document.querySelector("#"+formId+" .formError").innerHTML = error;

              document.querySelector("#"+formId+" .formError").style.display = 'block';
            }
          } else {
            app.formResponseProcessor(formId,payload,responsePayload);
          }

        });
      });
    }
  }
};

app.formResponseProcessor = (formId,requestPayload,responsePayload) => {
  if(formId == 'accountCreate'){
    let newPayload = {
      'phone' : requestPayload.phone,
      'password' : requestPayload.password
    };

    app.client.request(undefined,'api/tokens','POST',undefined,newPayload,(newStatusCode,newResponsePayload)=>{
      if(newStatusCode !== 200){

        document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';

        document.querySelector("#"+formId+" .formError").style.display = 'block';

      } else {
        app.setSessionToken(newResponsePayload);
        window.location = '/checks/all';
      }
    });
  }
  if(formId == 'sessionCreate'){
    app.setSessionToken(responsePayload);
    window.location = '/checks/all';
  }

  let formsWithSuccessMessages = ['accountEdit1', 'accountEdit2','checksEdit1'];
  if(formsWithSuccessMessages.indexOf(formId) > -1){
    document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
  }

  if(formId == 'accountEdit3'){
    app.logUserOut(false);
    window.location = '/account/deleted';
  }

  if(formId == 'checksCreate'){
    window.location = '/checks/all';
  }

  if(formId == 'checksEdit2'){
    window.location = '/checks/all';
  }

};

app.getSessionToken = () => {
  let tokenString = localStorage.getItem('token');
  if(typeof(tokenString) == 'string'){
    try{
      let token = JSON.parse(tokenString);
      app.config.sessionToken = token;
      if(typeof(token) == 'object'){
        app.setLoggedInClass(true);
      } else {
        app.setLoggedInClass(false);
      }
    }catch(e){
      app.config.sessionToken = false;
      app.setLoggedInClass(false);
    }
  }
};

app.setLoggedInClass = (add) => {
  let target = document.querySelector("body");
  if(add){
    target.classList.add('loggedIn');
  } else {
    target.classList.remove('loggedIn');
  }
};

app.setSessionToken = (token) => {
  app.config.sessionToken = token;
  let tokenString = JSON.stringify(token);
  localStorage.setItem('token',tokenString);
  if(typeof(token) == 'object'){
    app.setLoggedInClass(true);
  } else {
    app.setLoggedInClass(false);
  }
};

app.renewToken = (callback) => {
  let currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
  if(currentToken){
    let payload = {
      'id' : currentToken.id,
      'extend' : true,
    };
    app.client.request(undefined,'api/tokens','PUT',undefined,payload,(statusCode,responsePayload)=>{
      if(statusCode == 200){
        let queryStringObject = {'id' : currentToken.id};
        app.client.request(undefined,'api/tokens','GET',queryStringObject,undefined,(statusCode,responsePayload)=>{
          if(statusCode == 200){
            app.setSessionToken(responsePayload);
            callback(false);
          } else {
            app.setSessionToken(false);
            callback(true);
          }
        });
      } else {
        app.setSessionToken(false);
        callback(true);
      }
    });
  } else {
    app.setSessionToken(false);
    callback(true);
  }
};

app.loadDataOnPage = () => {
  let bodyClasses = document.querySelector("body").classList;
  let primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

  if(primaryClass == 'accountEdit'){
    app.loadAccountEditPage();
  }

  if(primaryClass == 'checksList'){
    app.loadChecksListPage();
  }

  if(primaryClass == 'checksEdit'){
    app.loadChecksEditPage();
  }
};

app.loadAccountEditPage = () => {
  let phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
  if(phone){
    let queryStringObject = {
      'phone' : phone
    };
    app.client.request(undefined,'api/users','GET',queryStringObject,undefined,(statusCode,responsePayload) => {
      if(statusCode == 200){
        document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.firstName;
        document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lastName;
        document.querySelector("#accountEdit1 .displayPhoneInput").value = responsePayload.phone;

        let hiddenPhoneInputs = document.querySelectorAll("input.hiddenPhoneNumberInput");
        for(let i = 0; i < hiddenPhoneInputs.length; i++){
            hiddenPhoneInputs[i].value = responsePayload.phone;
        }

      } else {
        app.logUserOut();
      }
    });
  } else {
    app.logUserOut();
  }
};

app.loadChecksListPage = () => {
  let phone = typeof(app.config.sessionToken.phone) == 'string' ? app.config.sessionToken.phone : false;
  if(phone){
    let queryStringObject = {
      'phone' : phone
    };
    app.client.request(undefined,'api/users','GET',queryStringObject,undefined,(statusCode,responsePayload)=>{
      if(statusCode == 200){

        let allChecks = typeof(responsePayload.checks) == 'object' && responsePayload.checks instanceof Array && responsePayload.checks.length > 0 ? responsePayload.checks : [];
        if(allChecks.length > 0){

          allChecks.forEach((checkId)=>{
            let newQueryStringObject = {
              'id' : checkId
            };
            app.client.request(undefined,'api/checks','GET',newQueryStringObject,undefined,(statusCode,responsePayload)=>{
              if(statusCode == 200){
                let checkData = responsePayload;

                let table = document.getElementById("checksListTable");
                let tr = table.insertRow(-1);
                tr.classList.add('checkRow');
                let td0 = tr.insertCell(0);
                let td1 = tr.insertCell(1);
                let td2 = tr.insertCell(2);
                let td3 = tr.insertCell(3);
                let td4 = tr.insertCell(4);
                td0.innerHTML = responsePayload.method.toUpperCase();
                td1.innerHTML = responsePayload.protocol+'://';
                td2.innerHTML = responsePayload.url;
                let state = typeof(responsePayload.state) == 'string' ? responsePayload.state : 'unknown';
                td3.innerHTML = state;
                td4.innerHTML = '<a href="/checks/edit?id='+responsePayload.id+'">View / Edit / Delete</a>';
              } else {
                console.log("Error trying to load check ID: ",checkId);
              }
            });
          });

          if(allChecks.length < 5){
            document.getElementById("createCheckCTA").style.display = 'block';
          }

        } else {
          document.getElementById("noChecksMessage").style.display = 'table-row';

          document.getElementById("createCheckCTA").style.display = 'block';

        }
      } else {
        app.logUserOut();
      }
    });
  } else {
    app.logUserOut();
  }
};


app.loadChecksEditPage = () => {
  let id = typeof(window.location.href.split('=')[1]) == 'string' && window.location.href.split('=')[1].length > 0 ? window.location.href.split('=')[1] : false;
  if(id){
    let queryStringObject = {
      'id' : id
    };
    app.client.request(undefined,'api/checks','GET',queryStringObject,undefined,(statusCode,responsePayload)=>{
      if(statusCode == 200){

        let hiddenIdInputs = document.querySelectorAll("input.hiddenIdInput");
        for(let i = 0; i < hiddenIdInputs.length; i++){
            hiddenIdInputs[i].value = responsePayload.id;
        }

        document.querySelector("#checksEdit1 .displayIdInput").value = responsePayload.id;
        document.querySelector("#checksEdit1 .displayStateInput").value = responsePayload.state;
        document.querySelector("#checksEdit1 .protocolInput").value = responsePayload.protocol;
        document.querySelector("#checksEdit1 .urlInput").value = responsePayload.url;
        document.querySelector("#checksEdit1 .methodInput").value = responsePayload.method;

        let mySelect = document.querySelector("#checksEdit1 .timeoutInput");
        for(let i, j = 0; i = mySelect.options[j]; j++) {
            if(i.value == responsePayload.timeOutSeconds) {
                mySelect.selectedIndex = j;
                break;
            }
        }

        let successCodeCheckboxes = document.querySelectorAll("#checksEdit1 input.successCodesInput");
        for(let i = 0; i < successCodeCheckboxes.length; i++){
          if(responsePayload.successCodes.indexOf(parseInt(successCodeCheckboxes[i].value)) > -1){
            successCodeCheckboxes[i].checked = true;
          }
        }
      } else {
        window.location = '/checks/all';
      }
    });
  } else {
    window.location = '/checks/all';
  }
};

app.tokenRenewalLoop = () => {
  setInterval(()=>{
    app.renewToken((err)=>{
      if(!err){
        console.log("Token renewed successfully @ "+Date.now());
      }
    });
  },1000 * 60);
};

app.init = () => {

  app.bindForms();

  app.bindLogoutButton();

  app.getSessionToken();

  app.tokenRenewalLoop();

  app.loadDataOnPage();

};

window.onload = () => {
  app.init();
};