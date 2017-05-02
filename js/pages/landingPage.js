   Landing  = {
    CONSTANTS: {
        // route: App.api,
        country_route: '/country/all',
        state_route: '/country/states/',
        quote_route: '/fetch/price',
        service_route: '/service/all',
        category_route: '/set/service/category/',
        location_route: '/location/',
        check_user: '/check/user',
        attributes_route: '/set/service/attributes/',
    },
    init: function () {
        Landing.getStatesInCountry(1);

        $('#state_id').change(function () {
            var value = $('#state_id').val();
            Landing.getLocationsInState(value);
        })
         $('#next').click(function () {
        var country = 1
         var state = $('#state_id').val();
         var location = $('#location_id').val();
         var email = $('#email').val();

         if (location == '') {
             alert('Select a Location');
             return false;
         } else if (email == '') {
             alert('Enter a valid Email');
             return false;
         }
         else{
             Landing.checkUser(email, 1, state, location);
         }
         });
    },
    
    checkUser: function (email, country, state, location) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + Landing.CONSTANTS.check_user,
            data: {
                format: 'json',
                email: email
            },
            error: function () {
                // $('#alert').modal();
                alert(data);
                // document.getElementById('alertresponse').innerHTML = 'Our Prices Does not cover this service Category yet'
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                // alert(data.data)
                Landing.processResponse(data, email, country, state, location);
            },
            type: 'POST',
            beforeSubmit:  Cedezone.showLoadingGif()

        });
    },

    processResponse: function (data, email, country, state, location) {
        //  Quote.saveServiceData(data);
        if (data.status == true) {
            Landing.replacewithLoginView(data.name, email, country, state, location);
        } else {
            Landing.replacewithRegisterView();
        }
        /**else{
          Quote.replacewithRegisterView();
      }**/
    },

    replacewithLoginView: function (data, email, country, state, location) {
        Cedezone.storeName(data);
        Cedezone.storeEmail(email);
        Cedezone.storeLocationID(location);
        Cedezone.storeStateID(state);
        Cedezone.storeCountryID(country);
        Cedezone.storeStatus('true');
        window.location = 'partialIndex.html'
    },

    replacewithRegisterView: function () {
        window.location = 'register.html'
    },

     getLocationsInState: function (stateid) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + Landing.CONSTANTS.location_route + stateid,
            data: {
                format: 'json'

            },
            error: function () {
                alert('Sorry error occured while fetching available locations in your state');
            },
            dataType: 'json',
            success: function (data) {
                if (data.length == 0) {
                    //  alert('no state');
                    // $('#empty_response').modal();
                } else {
                    Landing.populateLocationDropdown(data);
                }
            },
            type: 'GET'
        });
    },
 populateLocationDropdown: function (data) {
        var $location = $("#location_id");
        $location.empty();
        $location.append('<option value="">Select your Location</option>');
        $.each(data, function (index, value) {
            $location.append("<option value=" + value.id + ">" + value.name + "</option>");
        });
    },

    getStatesInCountry: function (countryid) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + Landing.CONSTANTS.state_route + countryid,
            data: {
                format: 'json'
            },
            error: function () {
                $('#alert').modal();
            },
            dataType: 'json',
            success: function (data) {
                if (data.length == 0) {
                    //  alert('no state');
                    // $('#empty_response').modal();
                } else {
                    Landing.populateStateDropdown(data);
                }
            },
            type: 'GET'
        });
    },
    populateStateDropdown: function (data) {
        var $state = $("#state_id");
        $state.empty();
        $state.append('<option value="">Select your state</option>');
        $.each(data, function (index, value) {
            $state.append("<option value=" + value.id + ">" + value.name + "</option>");
        });
    },


   }