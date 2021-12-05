const handlePurchace = (e) => {
    e.preventDefault();

    $("#clippyMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("There is an empty field");
        return false;
    }

    sendAjax('POST', $("#paymentForm").attr("action"), $("#paymentForm").serialize(), redirect);

    return false;
};


const PaymentWindow = (props) => {
    return (
        <form id="paymentForm" 
            name="paymentForm"
            onSubmit={handlePurchace}
            action="/purchace"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" id="purchaceSubmit" value="Confirm Purchace" />

        </form>
    );
};


const createPaymentWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};


const setup = (csrf) => {
    const purchaceButton = document.querySelector("#purchaceButton");

    purchaceButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPaymentWindow(csrf);
        return false;
    });

    createPaymentWindow(csrf);    //default view
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});