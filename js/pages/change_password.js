Password = {
    CONSTANTS: {
        change_route: 'change/password',
        reset_route: 'reset/password'
    },

    init: function () {
        $('#resetpassword').submit(function (e) {
            e.preventDefault();
            var instance = $(this).parsley();
            if (instance.isValid()) {
                Password.changePassword();
            } else {
                return (false);
            }
        });
    },

    changePassword: function () {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + '/' + Password.CONSTANTS.change_route,
            beforeSubmit: Cedezone.showLoadingGif(),
            data: {
                //  token: Cedezone.getToken(),
                oldpassword: $('#oldpassword').val(),
                password: $('#password').val(),
                password_confirmation: $('#password-confirmation').val()
            },
            error: function (data) {
                Cedezone.hideLoadingGif();
                Password.ProcessError(data);
            },

            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                
                // alert('Password Changed Successfully');
                showDialog({
                    title: 'Success',
                    text: 'Password Changed Successfully',
                }),

                setTimeout(function () {
                    window.location = 'change_password.html'
                }, 1000);
            },
            type: 'POST',
            headers: {
                "Authorization": "Bearer " + Cedezone.getToken()
            },
        });
    },

ProcessError: function (data) {
        Cedezone.hideLoadingGif();
        console.log(data);
         try {
            var errorKeys = Object.keys(data.responseJSON);
            
            errorKeys.forEach(function (record) {
                console.log(record);
                $('#' + record).addClass('parsley-error').parent().append(
                    '<ul class="parsley-errors-list filled"><li class="parsley-required">' + data.responseJSON[record] + '</li></ul>'
                )
            });
        } catch (err) {
            showDialog({
                    title: 'Error',
                    text: 'Unable to Connect, ',
                })
        }
    },
}
