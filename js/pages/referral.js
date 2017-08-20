Referral= {

     init: function () {
         $('#refer_friend').on('click', function(e){
                                 if($('#friend_email').val()=="")
        alert("Enter a valid email address")
        else{
            Referral.referFriend($('#friend_email').val())
        }
                                 })
     },

referFriend: function (email) {
        $.ajax({
            url: App.api + '/refer/friend',

            data: {
                email: email,
            },
            error: function (data) {
                Cedezone.hideLoadingGif()
                swal('Error', 'Error occured. Try Again Later', 'error');
            },
            headers: {
                "Authorization": "Bearer " + Cedezone.getToken()
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                if (data.status == true) {
                    swal('Success', 'We have sent your referral code to your friend', 'success');
                    $('#friend_email').val("");
                } else if (data.status == false) {
                    swal('Error', data.msg , 'error')
                }
                //hide modal
            },
            beforeSend: function () {
                Cedezone.showLoadingGif();
            },
            type: 'POST'
        })
    },
    }