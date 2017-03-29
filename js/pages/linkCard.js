linkcard = {

    CONSTANTS: {
        route: 'link/card',
    },

    init: function () {
        $(document).ready(function () {
            $('#cardlinking').submit(function (e) {
                e.preventDefault();
                var instance = $(this).parsley();
                if (instance.isValid()) {
                    $(this).ajaxSubmit(linkcard.setAjaxOptions());
                } else {
                    return (false);
                }
            });
        });
        linkcard.getCardStatus();
    },

    setAjaxOptions: function () {
        return {
            beforeSubmit: Cedezone.showLoadingGif, // pre-submit callback
            success: function (data) {
                linkcard.SuccessResponse(data);
            }, // post-submit callback
            type: 'post', // 'get' or 'post', override for form's 'method' attribute
            dataType: 'json', // 'xml', 'script', or 'json' (expected server response type)
            clearForm: false, // clear all form fields after successful submit
            resetForm: false,
            url: Cedezone.CONSTANTS.BASE_URL + '/' + linkcard.CONSTANTS.route,
            // reset the form after successful submit
            // $.ajax options can be used here too, for example:
            //timeout:   3000
            error: function (data) {
                linkcard.ProcessError(data);
            },
            headers: {
                "Authorization": "Bearer " + Cedezone.getToken()
            },
        };
    },

    SuccessResponse: function (data) {
        Cedezone.hideLoadingGif();
        if (data.status == true) {
            // console.log('registration successful');

            showDialog({
                title: 'Success',
                text: 'Card Linked Successfully',
            })
            setTimeout(function () {
                window.location = "linkcard.html";
            }, 1000);
        } else {
            showDialog({
                title: 'Error',
                text: data.msg,
            })
        }
    },

    ReplaceView: function () {
        window.location = '/users/profile';
    },

    ProcessError: function (data) {
        // swal('Error', data.msg, 'error');
        showDialog({
            title: 'Error',
            text: data.msg,
        })
    },

    getCardStatus: function () {
        $.ajax({
            // url: App.api + '/' + Route.PROFILE,
            url: Cedezone.CONSTANTS.BASE_URL + '/profile/show',
            data: {
                token: Cedezone.getToken()
            },
            error: function () {
                Cedezone.hideLoadingGif();
                showDialog({
                    title: 'Error',
                    text: 'Unable to get card status',
                })
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                    $('#cardstatus').append('<h6 style="margin: 0 0; text-transform: uppercase; color:orange" id="cardstatus">' + data.data.card_linking + '</h6>');
            },
            type: 'GET',
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