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
    if(props.domos.length === 0) {
        return (
            <div className="picList">
                <h3 className="emptyPic">No Pictures yet</h3>
            </div>
        );
    }

    const picNodes = props.domos.map(function(pic) {
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
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <PicList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <PictureForm csrf={csrf} />, document.querySelector("#savePic")
    );

    ReactDOM.render(
        <PicList domos={[]} />, document.querySelector("#domos")
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