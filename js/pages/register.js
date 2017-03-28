Register ={

    CONSTANTS: {
      route: 'register',
      message: '<div class="alert alert-success"><p>Your registration was successful</p> Please login</div>',
      template: '',
    },

    init: function(){
        $('#register').submit(function (e) {
            e.preventDefault();
            var instance = $(this).parsley();
            if(instance.isValid()) {
                $(this).ajaxSubmit(Register.setAjaxOptions());
            } else {
                return (false);
            }
        });
    },

    setAjaxOptions : function(){
        return   {
            target: '#message',   // target element(s) to be updated with server response
            beforeSubmit: Cedezone.showLoadingGif,  // pre-submit callback
            success: function(data){
                Register.SuccessResponse(data)
            },  // post-submit callback
            type: 'post',       // 'get' or 'post', override for form's 'method' attribute
            dataType: 'json',        // 'xml', 'script', or 'json' (expected server response type)
            clearForm: false,        // clear all form fields after successful submit
            resetForm: false,
            url: Cedezone.CONSTANTS.BASE_URL+'/'+'register',
            // reset the form after successful submit
            // $.ajax options can be used here too, for example:
            //timeout:   3000
            error: function (data) {
                Register.ProcessError(data);
            }
        };
    },

    SuccessResponse: function(data){
        Cedezone.hideLoadingGif();
        if(data.status==true) {
            console.log('registration successful');
            // alert('Registartion successful');
            Register.ReplaceView();
       }
    },

    ReplaceView: function(){
    //    window.location = "index.html";
    window.location = 'reg_successful.html';
    },

    ProcessError: function(data){
        Cedezone.hideLoadingGif();
        try{
        var errorKeys = Object.keys(data.responseJSON);
       // $('#register-message').append();
        Cedezone.showNotification('error','Registration not successful','Invalid inputs');
        errorKeys.forEach(function(record){
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