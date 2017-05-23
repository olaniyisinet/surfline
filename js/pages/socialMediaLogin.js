socialLogin = {

    CONSTANTS: {
        route: '/login/social',
    },

    init: function () {

    },

    ProcessError: function (data) {
        // swal('Error', data.msg, 'error');
        showDialog({
            title: 'Error',
            text: data.msg,
        })
    },

    getToken: function (useremail, username, provider, provider_id) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + socialLogin.CONSTANTS.route,
            data: {
                email: useremail,
                name: username,
                auth_provider: provider,
                auth_provider_id: provider_id
            },
            error: function () {
                Cedezone.hideLoadingGif();
                showDialog({
                    title: 'Error',
                    text: 'Error Occured while login you in',
                })
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                Cedezone.storeToken(data.token);
                if (Cedezone.getStatus() == 'true') {
                    window.location = 'services.html'
                } else {
                    window.location = "home.html";
                }
            },
            type: 'POST',
            beforeSend: function () {
                Cedezone.showLoadingGif();
            },
        });
    },

    setText: function (element, newtext) {
        componentHandler.downgradeElements(element);
        element.innerHTML = newtext;
        componentHandler.upgradeElement(element);
    },

    loadOrder: function () {
        window.location = 'bookaservice.html'
    },
}