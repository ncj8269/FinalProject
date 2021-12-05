const handleChangePass = (e) => {
    e.preventDefault();

    $("#clippyMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#newPass").val() == '') {
        handleError("There is an empty field");
        return false;
    }

    sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);

    return false;
};


const ChangePassWindow = (props) => {
    return (
        <form id="changePassForm" 
            name="changePassForm"
            onSubmit={handleChangePass}
            action="/changePass"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="pass">Old Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <label htmlFor="newPass">New Password: </label>
            <input id="newPass" type="password" name="newPass" placeholder="new password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" id="newPassSubmit" value="Change Pass" />

        </form>
    );
};


const createChangePassWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};


const setup = (csrf) => {
    const changePassButton = document.querySelector("#changePassButton");

    changePassButton.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePassWindow(csrf);
        return false;
    });

    createChangePassWindow(csrf);    //default view
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});