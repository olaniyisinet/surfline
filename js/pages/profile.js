Profile = {
    CONSTANTS: {
        route: Route.PROFILE,
        profile: '',
        location_route: '/location/',
        myorders_route: '/myorders',
        address_route: '/address',
        avatar: '/update/avatar',
        card_linking: '/profile/show',
        change_route: 'change/password',
    },

    init: function () {
        Cedezone.checkToken();
        Profile.getProfile();
        Profile.getCountries();

        $('.tab-content #profileForm').submit(function (e) {
            e.preventDefault();
            var instance = $(this).parsley();
            if (instance.isValid()) {
                var data = $(this).serializeArray();
                console.log(data);
                var id = $(this).find('#profile_id').val();

                Profile.updateProfile(data, id);
            } else {
                return (false);
            }
        });
        /***For getting **/
        $('#changePhoto').click( function(){
            Profile.updateAvatar();
        })
        $('.country_id').change(function () {
            var value = $(this).val()
            if(value!=null){
            Profile.getStatesInCountry(value);
            }
        });

        $('.state_id').change(function () {
            var value = $(this).val();
            if(value!=null) {
                Profile.getLocationsInState(value);
            }
        });
    },

    getProfile: function () {
        $.ajax({
           // url: App.api + '/' + Route.PROFILE,
            url: Cedezone.CONSTANTS.BASE_URL + Profile.CONSTANTS.card_linking,
            data: {
                token: Cedezone.getToken()
            },
            error: function () {
                Cedezone.hideLoadingGif();
                Cedezone.showNotification('error', 'Error occurred while making connection', 'Error')
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                Profile.populateProfile(data)
            },
            type: 'GET',
            beforeSend: function () {
                Cedezone.showLoadingGif();
            },
        });

    },
    populateProfile: function (data) {

        Profile.CONSTANTS.profile = data;
        $('#profileForm').find('#name').val(data.data.name);
        $('#profileForm').find('#profile_id').val(data.data.id);
        $('#profileForm').find('#phone').val(data.data.phone);
        $('#profileForm').find('#address').val(data.data.address);
        $('#profileForm').find('#country_id').val(data.data.country_id);

//        if(data.data.country_id = '0'){
//            $('#profileTab').find('#profileLocation').text('');
//        }else{
//        $('#profileTab').find('#profileLocation').text(data.data.country + ',' + data.data.state + ',' + data.data.location);
//        }

        if(data.data.avatar!='') {
            $('.img-uplod').find('#avatar').attr('src', data.data.avatar); //
            // $('#photo').attr('data-default-file',data.data.avatar);
            // $('#photo').dropify();
        }

        Profile.getStatesInCountry(data.data.country_id);
        Profile.getLocationsInState(data.data.state_id);
        Cedezone.storeName(Profile.CONSTANTS.profile.data.name);
//        Dashboard.init();
    },

    uploadPic: function () {
        $(form).ajaxForm({
            success: function (data) {},
        })
    },

    updateProfile: function (data, id) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + '/' + Profile.CONSTANTS.route + '/' + id,
            data: data,
            error: function (data) {
                Cedezone.hideLoadingGif();
               Profile.ProcessError(data);
            },

            headers: {
                "Authorization": "Bearer " + Cedezone.getToken()
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                if (data.status == true) {
                  showDialog({
                    title: 'Success',
                    text: 'Profile Updated Successfully',
                })
                // setTimeout(function () {
                // window.location="profile.html";
                // }, 4000);
                 }
            },
            beforeSend: function () {
                Cedezone.showLoadingGif();
            },
            type: 'PUT'
        })
    },

    updateAvatar: function () {
        var data = new FormData();
        data.append('photo', $('#photo')[0].files[0]);
        console.log(data);
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + Profile.CONSTANTS.avatar,
            type: 'POST',
            data: data,
            headers: {
                "Authorization": "Bearer " + Cedezone.getToken()
            },
            processData: false,
            contentType: false,
            success: function (data) {
                if(data.status==true){
                    // swal('Success',data.msg,'success')
//                    location.reload(); ///reload page to change profile pic
                    Profile.getProfile();
                    sideProfile.init();
                }
            }
        });
    },

    getCountries: function () {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + '/country/all',
            data: {
                format: 'json'
            },
            error: function () {
                // swal('Error', 'Error fetching Available Countries', 'error');
            },
            dataType: 'json',
            success: function (data) {
                //  console.log(data);
                Profile.populateCountryDropdown(data);
            },
            type: 'GET'
        });
    },

    populateCountryDropdown: function (data) {
        var $country = $(".country_id");
        $country.empty();
        $country.append('<option value="" selected>Select your country</option>')
        $.each(data, function (index, value) {
            //console.log(data)
            $country.append("<option value=" + value.id + ">" + value.name + "</option>");
        });
         if (Profile.CONSTANTS.profile) {
            $country.val(Profile.CONSTANTS.profile.data.country_id);
        }
    },

    getStatesInCountry: function (countryid) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL+ '/country/states/' + countryid,
            data: {
                format: 'json'
            },
            error: function () {
                // swal('Error', 'Error fetching avalable states in your country', 'error');
            },
            dataType: 'json',
            success: function (data) {
                // console.log(data);
                Profile.populateStateDropdown(data);
            },
            type: 'GET'
        });
    },

    populateStateDropdown: function (data) {
        var $state = $(".state_id");
        $state.empty();
        $state.append('<option value="" selected>Select your state</option>');
        $.each(data, function (index, value) {
            $state.append("<option value=" + value.id + ">" + value.name + "</option>");
        });
        if (Profile.CONSTANTS.profile) {
            $state.val(Profile.CONSTANTS.profile.data.state_id);
        }
    },

    getLocationsInState: function (stateid) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + Profile.CONSTANTS.location_route + stateid,
            data: {
                format: 'json'
            },
            error: function () {
                alert('Sorry error occured while fetching available locations in your state');
            },
            dataType: 'json',
            success: function (data) {
                Profile.populateLocationDropdown(data);
            },
            type: 'GET'
        });
    },

    populateLocationDropdown: function (data) {
        var $location = $(".location_id");
        $location.empty();
        $location.append('<option value="">Select your Location</option>');
        $.each(data, function (index, value) {
            $location.append("<option value=" + value.id + ">" + value.name + "</option>");
        });
        if (Profile.CONSTANTS.profile) {
            console.log(Profile.CONSTANTS.profile.data.location_id);
            $location.val(Profile.CONSTANTS.profile.data.location_id);
        }
    },


    /******ADDRESS MANAGEMENT SCRIPT***/
    getAddress: function(){
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + Profile.CONSTANTS.address_route,
            data: {
                format: 'json'
            },
            headers: {
                "Authorization": "Bearer " + Cedezone.getToken()
            },
            error: function () {
                // swal('Error', 'Error fetching your address', 'error');
            },
            dataType: 'json',
            success: function (data) {
                //  console.log(data);
                Profile.processGetAddress(data);
            },
            type: 'GET'
        });
    },

 processGetAddress: function(data)   {
     if($.isEmptyObject(data.data)){
         $('.address-holder').append($('#empty-address').html())
         return false;
     }
     var no = (data.pagination.current_page - 1) * data.pagination.per_page;
     $content =$('.address-template').html();
     $('.address-holder').html("");
     $('.address-holder').append($content);
     var responses=data.data;
     $.each(responses, function (i, item) {
         //for(no =1; no<=5; no++){
         no++
         $tr = $('<tr>').append(
             $('<td>').text(no),
             $('<td>').text(item.name),
             $('<td>').text(item.country.name+','+ item.state.name,', '+item.location.name),
             $('<td>').text(item.address),
             $('<td>').text(item.updated_at.date),
             $('<td>').html('<button class="btn btn-sm btn-info view" data-id="'+item.id+'" ' +
                 'data-state-id="'+item.state.id+'" data-country-id="'+item.country.id+'"  data-location-id="'+item.location.id+'">Edit</button>'
                 +'<button class="btn btn-sm btn-danger delete" data-id="'+item.id+'">Delete</button>'
             )
         )
         $('.address-holder table tbody').append($tr);
     })
 },

 saveNewAddress: function(data){
     $.ajax({
         url: Cedezone.CONSTANTS.BASE_URL + Profile.CONSTANTS.address_route,
         data: data,
         headers: {
             "Authorization": "Bearer " + Cedezone.getToken()
         },
         error: function () {
            //  swal('Error', 'Error saving your address', 'error');
         },
         dataType: 'json',
         success: function (data) {
             if(data.status==true){
                 swal('Success',data.msg,'success')
                  $('#myAddress').modal('toggle');
                 Profile.getAddress();
                 return false;
             }
            //  swal('Error','Address could not be saved please review inputs','error');
         },
         type: 'POST'
     });
 }, 
    
 deleteAddress: function(id){
     $.ajax({
         url: Cedezone.CONSTANTS.BASE_URL + Profile.CONSTANTS.address_route + '/' + id,
         data: data,
         headers: {
             "Authorization": "Bearer " + Cedezone.getToken()
         },
         error: function () {
            //  swal('Error', 'Error saving your address', 'error');
         },
         dataType: 'json',
         success: function (data) {
             if(data.status==true){
                //  swal('Success',data.msg,'success')
                  $('#myAddress').modal('toggle');
                 Profile.getAddress();
                 return false;
             }
            //  swal('Error','Address could not be saved please review inputs','error');
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
