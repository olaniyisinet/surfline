Cedezone = {
    CONSTANTS: {
        BASE_URL: 'http://api.staging.cedezone.com/api/v1',
        // BASE_URL: 'http://localhost/cleaning-app/public/api/v1',
        mprogress: '',
        profile_data: '',
        card_status: '',
    },

    init: function () {
        Cedezone.CONSTANTS.mprogress = new Mprogress();
        $('.fa-power-off').click(function (e) {
            // window.localStorage.removeItem('token');
            localStorage.clear();
            ///  alert('Storage cleared');
            window.location = 'login.html';
        });
        $('#change').click(function (e) {
            // alert('am here');
            window.location = Cedezone.CONSTANTS.BASE_URL + '/password/reset';
        });

    },

    callApi: function (url, type, callback, formdata) {
        formdata = formdata || "";
        $.ajax({
            url: App.api + "/" + url,
            type: type,
            dataType: "json",
            data: formdata + '&token=' + Cedezone.getToken(),
            beforeSend: function () {
                //showRequest();
            },
            success: function (result) {
                callback(result);
            },
            complete: function () {
                //App.doneLoading();
            },
            error: function () {

                Cedezone.showNotification('error', "'No Internet Connection. Please ensure you have access to the Internet", ":(")
            }
        });
    },

    storeToken: function (token) {
        localStorage.setItem('token', token);
    },
    getToken: function () {
        return localStorage.getItem('token');
    },
    storeCard: function (card) {
        localStorage.setItem('card', card);
    },
    getCard: function () {
        return localStorage.getItem('card');
    },

    showNotification: function (type, msg, title) {
        var stack_bottomleft = {
            "dir1": "right",
            "dir2": "up",
            "push": "top"
        };
        var stack_bottomright = {
            "dir1": "left",
            "dir2": "up",
            "push": "top"
        };

        type = type || "info";
        var opts = {
            title: "Notification",
            text: "Welcome to Cedezone",
            addclass: "stack-bottomright",
            stack: stack_bottomright
        };
        switch (type) {
            case 'error':
                opts.title = title;
                opts.text = msg;
                opts.type = 'error';
                break;
            case 'info':
                opts.title = title;
                opts.text = msg;
                opts.type = 'info';
                break;
            case 'success':
                opts.title = title;
                opts.text = msg;
                opts.type = 'success';
                break;
            default:
                opts.title = title;
                opts.text = msg;
                opts.type = 'info';
        }
        console.log('am trying to show notification')
        new PNotify(opts);
    },

    clearNotification: function () {
        Cedezone.showNotification('', '', "");
    },

    showLoadingGif: function () {
        //  Cedezone.CONSTANTS.mprogress.start();
        var imgSrc = $("#loading-gif").attr('src');
        $.blockUI({
            message: '<img src="' + imgSrc + ' " /> Loading..',
            // message: Cedezone.CONSTANTS.mprogress.start(),
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: "none",
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                // opacity: 0.9,
                color: '#fff'
            },
            overlayCSS: {
                backgroundColor: '#fff',
                opacity: 0.8,
            }
        });
    },

    hideLoadingGif: function () {
        $.unblockUI();
        //   Cedezone.CONSTANTS.mprogress.end(true);
    },

    checkToken: function () {
        //  alert(Cedezone.getToken());
        if (Cedezone.getToken() === null) {
            window.location = "login.html";
        }
    },

    storeName: function (name) {
        localStorage.setItem('name', name);
    },
    getName: function () {
        return localStorage.getItem('name');
    },
    storeAvatar: function (avatar) {
        localStorage.setItem('avatar', avatar);
    },
    getAvatar: function () {
        return localStorage.getItem('avatar');
    },
    storeEmail: function (email) {
        localStorage.setItem('email', email);
    },
    getEmail: function () {
        return localStorage.getItem('email');
    },

    storeStateID: function (state_id) {
        localStorage.setItem('state_id', state_id);
    },
    getStateID: function () {
        return localStorage.getItem('state_id');
    },

    storeLocationID: function (location_id) {
        localStorage.setItem('location_id', location_id);
    },
    getLocationID: function () {
        return localStorage.getItem('location_id');
    },

    storeCountryID: function (country_id) {
        localStorage.setItem('country_id', country_id);
    },
    getCountryID: function () {
        return localStorage.getItem('servcountry_idice_id');
    },

    storeServiceID: function (service_id) {
        localStorage.setItem('service_id', service_id);
    },
    getServiceID: function () {
        return localStorage.getItem('service_id');
    },

    storeAddress: function (address) {
        localStorage.setItem('address', address);
    },
    getAddress: function () {
        return localStorage.getItem('address');
    },

    storeStatus: function (status) {
        localStorage.setItem('status', status);
    },
    getStatus: function () {
        return localStorage.getItem('status');
    },

    storefbName: function (fbname) {
        localStorage.setItem('fbname', fbname);
    },
    getfbName: function () {
        return localStorage.getItem('fbname');
    },

    storefbEmail: function (fbEmail) {
        localStorage.setItem('fbEmail', fbEmail);
    },
    getfbEmail: function () {
        return localStorage.getItem('fbEmail');
    },

    storefbId: function (fbId) {
        localStorage.setItem('fbId', fbId);
    },
    getfbId: function () {
        return localStorage.getItem('fbId');
    },
}
/******Route list***/
Route = {
    PROFILE: 'profile',

}

Params = {
    email: '',
    active: 'false',
    country_id: '',
    state_id: '',
    location_id: '',
    service_id: '',
    category_id: '',
    attribute_id: '',
}