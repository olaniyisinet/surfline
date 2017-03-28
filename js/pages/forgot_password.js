Password = {
    CONSTANTS: {
        change_route: 'change/password',
        reset_route: 'reset/password'
    },

    init: function () {
        $('#forgotpassword').submit(function (e) {
            e.preventDefault();
            var instance = $(this).parsley();
            if (instance.isValid()) {
                Password.resetPassword();
            } else {
                return (false);
            }
        });
    },

    resetPassword: function () {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + '/' + Password.CONSTANTS.reset_route,
            beforeSubmit: Cedezone.showLoadingGif(),
            data: {
                //  token: Cedezone.getToken(),
                email: $('#email').val()
            },
            error: function () {
                Cedezone.hideLoadingGif();
                Password.ProcessError(data);
            },

            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                 showDialog({
                    title: 'Success',
                    text: 'Check your email for further instructions',
                }),
                setTimeout(function () {
                    window.location = 'index.html'
                }, 5000);
            },
            type: 'POST'
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
