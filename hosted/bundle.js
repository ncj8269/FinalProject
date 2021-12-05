"use strict";

var handlePic = function handlePic(e) {
  e.preventDefault();
  $("#clippyMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#picTitle").val() == '' || $("#picRating").val() == '' || $("#picTags").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#pictureForm").attr("action"), $("#pictureForm").serialize(), function () {
    loadPicsFromServer();
  });
  return false;
};

const API_KEY = "24452997-a92d3065d5570184056e038c1";
//arrays to hold pictures
const picsToAddTemp = [];
const picsToAddPerm = [];

const searchPic = (e) => {
  e.preventDefault();
  $("#clippyMessage").animate({
    width: 'hide'
  }, 350);

  if($("#picSearch").val() == '') {
      handleError("All fields are required");
      return false;
  }

  $.ajax({
    cache: false,
    type: "GET",
    url: `https://pixabay.com/api/?key=${API_KEY}&q=${document.querySelector("#picSearch").value}&image_type=photo`,
    dataType: "json",
    success: function (data) {
      console.log(data);
      for (var i = 0; i < data.hits.length; i++) {
        console.log(data.hits[i].webformatURL);
      }
      //creates images
      for (var i = 0; i < data.hits.length; i++) {
          let picImage = $("<input type='image'>");
          picImage.attr("class", "pic");
          picImage.attr("src", data.hits[i].webformatURL);
          //picImage.attr("id", response.hits[i].name);
          //picImage.data(data.hits[i]);
          $("#picList").append(picImage);
          // picImage.click(function () {
          //     picsToAdd[0] = picImage.data().webformatURL;
          // });
      }
  },
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });

  return false;
};

var SearchForm = function SearchForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "searchForm",
    name: "searchForm",
    onSubmit: searchPic,
    className: "searchForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "search"
  }, "Img Name: "), /*#__PURE__*/React.createElement("input", {
    id: "picSearch",
    type: "text",
    name: "search",
    placeholder: "Flower"
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    className: "btn",
    id: "search-button",
    value: "search"
  })
  );
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
    htmlFor: "rating"
  }, "Rating: "), /*#__PURE__*/React.createElement("input", {
    id: "picRating",
    type: "text",
    name: "rating",
    placeholder: "Pic Rating"
  }),/*#__PURE__*/React.createElement("label", {
    htmlFor: "tags"
  }, "Tags: "), /*#__PURE__*/React.createElement("input", {
    id: "picTags",
    type: "text",
    name: "tags",
    placeholder: "Pic Tags"
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
  if (props.pics.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "picList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyPic"
    }, "No Pictures yet"));
  }

  var picNodes = props.pics.map(function (pic) {
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
      className: "picRating"
    }, " Rating: ", pic.rating, " "),/*#__PURE__*/React.createElement("h3", {
      className: "picTags"
    }, " Tags: ", pic.tags, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "picList"
  }, picNodes);
};

var loadPicsFromServer = function loadPicsFromServer() {
  sendAjax('GET', '/getPics', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PicList, {
      pics: data.pics
    }), document.querySelector("#pics"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PictureForm, {
    csrf: csrf
  }), document.querySelector("#savePic"));
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, {
    csrf: csrf
  }), document.querySelector("#searchPic"));
  ReactDOM.render( /*#__PURE__*/React.createElement(PicList, {
    pics: []
  }), document.querySelector("#pics"));
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
