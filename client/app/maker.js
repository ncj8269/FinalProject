const handlePic = (e) => {
    e.preventDefault();

    $("#clippyMessage").animate({width:'hide'},350);

    if($("#picTitle").val() == '' || $("#picAge").val() == '' || $("#picHeight").val() == '') {
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#pictureForm").attr("action"), $("#pictureForm").serialize(), function() {
        loadPicsFromServer();
    });

    return false;
};

const API_KEY = "24452997-a92d3065d5570184056e038c1";

const searchPic = (e) => {
    e.preventDefault();

    $("#clippyMessage").animate({width:'hide'},350);

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
        },
        error: function error(xhr, status, _error) {
          var messageObj = JSON.parse(xhr.responseText);
          handleError(messageObj.error);
        }
      });

    return false;
};

const SearchForm = (props) => {
    return (
      <form id="imageSearchForm"
            name ="searchForm"
            onSubmit={searchPic}
            className="searchForm">
        <label htmlFor="search">Image Name</label>
        <input id="picSearch" type="text" name="search"  placeholder="Flower"/>
        <input type="submit" className="btn" id="search-button" value="Search"/>
    </form>
    );
};

const PictureForm = (props) => {
    return (
        <form id="pictureForm"
            name ="pictureForm"
            onSubmit={handlePic}
            action="/maker"
            method="POST"
            className="pictureForm"
        >
            <label htmlFor="title">Title: </label>
            <input id="picTitle" type="text" name="title" placeholder="Pic Title"/>
            <label htmlFor="age">Age: </label>
            <input id="picAge" type="text" name="age" placeholder="Pic Age"/>
            <label htmlFor="height">Height: </label>
            <input id="picHeight" type="text" name="height" placeholder="Pic Height"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makePicSubmit" type="submit" value="Save Picture" />
        </form> 
    );
};

const PicList = function(props) {
    if(props.pics.length === 0) {
        return (
            <div className="picList">
                <h3 className="emptyPic">No Pictures yet</h3>
            </div>
        );
    }

    const picNodes = props.pics.map(function(pic) {
        return (
            <div key={pic._id} className="pic">
                <img src="/assets/img/tempImg.jpeg" alt="Temp Img" className="tempImg" />
                <h3 className="picTitle"> Pic Title: {pic.title} </h3>
                <h3 className="picAge"> Age: {pic.age} </h3>
                <h3 className="picHeight"> Height: {pic.height} </h3>
            </div>
        );
    });

    return (
        <div className="picList">
            {picNodes}
        </div>
    );
};

const loadPicsFromServer = () => {
    sendAjax('GET', '/getPics', null, (data) => {
        ReactDOM.render(
            <PicList pics={data.pics} />, document.querySelector("#pics")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <PictureForm csrf={csrf} />, document.querySelector("#savePic")
    );

    ReactDOM.render(
        <SearchForm csrf={csrf} />, document.querySelector("#searchPic")
    );

    ReactDOM.render(
        <PicList pics={[]} />, document.querySelector("#pics")
    );

    loadPicsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});