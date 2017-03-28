Login = {
    CONSTANTS: {
        route: 'login',
        action: 'login',
        profileroute: 'profile',
        error: '<div class="alert alert-danger">Wrong username or Password</div>'
    },
    init: function () {
        $('#login').submit(function (e) {
            e.preventDefault();
            var instance = $(this).parsley();
            if (instance.isValid()) {
                $(this).ajaxSubmit(Login.setOptions());
            } else {
                return (false);
            }
        });
        //  $('#a').click( func)
    },

    setOptions: function () {
        return {
            target: '#message', // target element(s) to be updated with server response
            beforeSubmit: Login.showRequest, // pre-submit callback
            success: function (data) {
                Login.showResponse(data)
            }, // post-submit callback
            type: 'post', // 'get' or 'post', override for form's 'method' attribute
            dataType: 'json', // 'xml', 'script', or 'json' (expected server response type)
            clearForm: false, // clear all form fields after successful submit
            resetForm: false,
            url: Cedezone.CONSTANTS.BASE_URL + '/' + 'login',
            // reset the form after successful submit
            // $.ajax options can be used here too, for example:
            //timeout:   3000
            error: function (data) {
                Login.ProcessError(data);
            }
        };
    },
    showResponse: function (data) {
        //alert('am here');
        Cedezone.hideLoadingGif();
        console.log(data)
        if (data.status == true) {
            var token = data.token;
            Cedezone.storeToken(token);
            //    alert(Cedezone.getToken());
            // Cedezone.showNotification('success', 'Login you in', 'Login Successful');
            // Profile.init();
            Login.getProfile();
        }
    },

    getProfile: function () {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + '/' + Login.CONSTANTS.profileroute,
            data: {
                token: Cedezone.getToken()
            },
            error: function () {
                // Cedezone.showNotification('error', 'Error occured while making connection', 'Error')
                showDialog({
                    title: 'Error',
                    text: 'Error occured while making connection',
                })
            },
            dataType: 'json',
            success: function (data) {

                switch (parseInt(data.data.role)) {
                    case 1:
                        Cedezone.storeName(data.data.name);
                        showDialog({
                    title: 'Success',
                    text: 'Login you in.....',
                })
                        window.location = 'home.html';
                        break;
                    case 2:
                        //individual service provider
                        document.getElementById('login-error').innerHTML = 'Invalid Username or Password';
                        break;
                    case 3:
                        Login.providerStatus(data.data);
                        break;
                    case 4:
                        // Login.adminDetails(data.data);
                        document.getElementById('login-error').innerHTML = 'Invalid Username or Password';
                        break;
                    case 5:
                        //super admin
                        //  Login.adminDetails(data.data);
                        document.getElementById('login-error').innerHTML = 'Invalid Username or Password';
                        break;
                    default:
                        // Login.userDetails(data.data);
                        Cedezone.storeName(data.data.name);

                        window.location = 'home.html';

                        break;
                }
            },
            type: 'GET'
        });

    },

    showRequest: function () {
        Cedezone.showLoadingGif();
    },
    ProcessError: function (data) {
        Cedezone.hideLoadingGif();
        console.log(data);
        try {
            var errorKeys = Object.keys(data.responseJSON);
            //    $('#login-error').append(Login.CONSTANTS.error);
            document.getElementById('login-error').innerHTML = 'Invalid Username or Password';

            //    Cedezone.showNotification('error', 'Wrong username or password', 'Invalid Login');
            errorKeys.forEach(function (record) {
                console.log(record);
                $('#' + record).addClass('parsley-error').parent().append(
                    '<ul class="parsley-errors-list filled"><li class="parsley-required">' + data.responseJSON[record] + '</li></ul>'
                )
            });
        } catch (err) {
            showDialog({
                    title: 'Error',
                    text: 'Unable to Connect',
                })
        }
    },
}