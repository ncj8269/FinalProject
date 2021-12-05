"use strict";

var handleChangePass = function handleChangePass(e) {
  e.preventDefault();
  $("#clippyMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#newPass").val() == '') {
    handleError("There is an empty field");
    return false;
  }

  console.log($("input[name=_csrf]").val());
  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
  return false;
};


var ChangePassWindow = function ChangePassWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "changePassForm",
    name: "changePassForm",
    onSubmit: handleChangePass,
    action: "/changePass",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "newPass",
    type: "password",
    name: "newPass",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    id: "newPassSubmit",
    value: "Change Pass"
  }));
};


var createChangePassWindow = function createChangePassWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangePassWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};


var setup = function setup(csrf) {
  var changePassButton = document.querySelector("#changePassButton");

  changePassButton.addEventListener("click", function (e) {
    e.preventDefault();
    createChangePassWindow(csrf);
    return false;
  });
  createChangePassWindow(csrf); //default view
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#clippyMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#clippyMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
