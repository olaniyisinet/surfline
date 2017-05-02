   Landing  = {
    CONSTANTS: {
        route: App.api,
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
        Quote.getCountries();
        Quote.getService();
        $('#country_id').change(function () {
            var value = $('#country_id').val();
            Quote.getStatesInCountry(value);
        });
        $('#state_id').change(function () {
            var value = $('#state_id').val();
            Quote.getLocationsInState(value);
        })
    },
    
    checkUser: function (email, country, state, location, service, category, attribute) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + Quote.CONSTANTS.check_user,
            data: {
                format: 'json',
                email: email
            },
            error: function () {
                $('#alert').modal();
                document.getElementById('alertresponse').innerHTML = 'Our Prices Does not cover this service Category yet'
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                // alert(data.data)
                Quote.processResponse(data, email, country, state, location, service, category, attribute);
            },
            type: 'POST'
        });
    },

    processResponse: function (data, email, country, state, location, service, category, attribute) {
        //  Quote.saveServiceData(data);
        if (data.status == true) {
            Quote.replacewithLoginView(data.name, email, country, state, location, service, category, attribute);
        } else {
            Quote.replacewithRegisterView();
        }
        /**else{
          Quote.replacewithRegisterView();
      }**/
    },

    replacewithLoginView: function (data, email, country, state, location, service, category, attribute) {
    
        Cedezone.storeName(data);
        Cedezone.storeEmail(email);
        Cedezone.storeCategoryID(category);
        Cedezone.storeServiceID(service);
        Cedezone.storeLocationID(location);
        Cedezone.storeStateID(state);
        Cedezone.storeCountryID(country);
        Cedezone.storeAttributeID(attribute);
        Cedezone.storeStatus('true');
        window.location = 'login.html'
    },

    replacewithRegisterView: function () {
        window.location = '/register.html'
    },
   }