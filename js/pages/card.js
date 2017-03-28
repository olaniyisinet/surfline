Profile = {
    CONSTANTS: {
        route: Route.PROFILE,
        profile: '',
        location_route: '/location/',
        myorders_route: '/myorders',
        address_route: '/address',
        avatar: '/update/avatar',
        card_linking: '/profile/show'
    },

    init: function () {
        Cedezone.checkToken();
        Profile.getCardStatus();    
    },

    ProcessError: function (data) {
        Cedezone.hideLoadingGif();
        console.log(data);
        var errorKeys = Object.keys(data.responseJSON);
        //    $('#login-error').append(Login.CONSTANTS.error);
//document.getElementById('login-error').innerHTML = 'Invalid Username or Password';
        //    Cedezone.showNotification('error', 'Wrong username or password', 'Invalid Login');
        errorKeys.forEach(function (record) {
            console.log(record);
            $('#' + record).addClass('parsley-error').parent().append(
                '<ul class="parsley-errors-list filled"><li class="parsley-required">' + data.responseJSON[record] + '</li></ul>'
            )
        });
    },
   
    getCardStatus: function () {
        $.ajax({
            url: App.api + Profile.CONSTANTS.card_linking,
            data: {
                token: Cedezone.getToken()
            },
            error: function () {
                Cedezone.hideLoadingGif();
                Cedezone.showNotification('error', 'Error occurred while making connection', 'Error')
            },
            dataType: 'json',
            success: function (data) {
               // Cedezone.hideLoadingGif();
                console.log(data);
               // providerProfile.populateProfile(data)
               // providerProfile.populateProfile(data)
            },
            type: 'GET',
//            beforeSend: function () {
//                Cedezone.showLoadingGif();
//            },
        });
    },

}
