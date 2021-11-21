"use strict";

var handlePic = function handlePic(e) {
  e.preventDefault();
  $("#clippyMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#picTitle").val() == '' || $("#picAge").val() == '' || $("#picHeight").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#pictureForm").attr("action"), $("#pictureForm").serialize(), function () {
    loadPicsFromServer();
  });
  return false;
};

var PictureForm = function PictureForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "pictureForm",
    name: "pictureForm",
    onSubmit: handlePic,
    action: "/maker",
    method: "POST",
    className: "pictureForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "title"
  }, "Pic Title: "), /*#__PURE__*/React.createElement("input", {
    id: "picTitle",
    type: "text",
    name: "title",
    placeholder: "Pic Title"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
    id: "picAge",
    type: "text",
    name: "age",
    placeholder: "Pic Age"
  }),/*#__PURE__*/React.createElement("label", {
    htmlFor: "height"
  }, "Height: "), /*#__PURE__*/React.createElement("input", {
    id: "picHeight",
    type: "text",
    name: "height",
    placeholder: "Pic Height"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makePicSubmit",
    type: "submit",
    value: "Save Picture"
  }));
};

var PicList = function PicList(props) {
  if (props.domos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "picList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyPic"
    }, "No Pictures yet"));
  }

  var picNodes = props.domos.map(function (pic) {
    return /*#__PURE__*/React.createElement("div", {
      key: pic._id,
      className: "pic"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/tempImg.jpeg",
      alt: "temp img",
      className: "tempImg"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "picTitle"
    }, " Pic Title: ", pic.title, " "), /*#__PURE__*/React.createElement("h3", {
      className: "picAge"
    }, " Age: ", pic.age, " "),/*#__PURE__*/React.createElement("h3", {
      className: "picHeight"
    }, " Height: ", pic.height, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "picList"
  }, picNodes);
};

var loadPicsFromServer = function loadPicsFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PicList, {
      domos: data.domos
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PictureForm, {
    csrf: csrf
  }), document.querySelector("#savePic"));
  ReactDOM.render( /*#__PURE__*/React.createElement(PicList, {
    domos: []
  }), document.querySelector("#domos"));
  loadPicsFromServer();
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
