serviceOrder = {
    CONSTANTS: {
        service_route: '/service/all',
        category_route: '/set/service/category/',
        attributes_route: '/set/service/attributes/',
        country_route: '/country/all',
        state_route: '/country/states/',
        location_route: '/location/',
        location: '',
        service: '',
        category: '',
        attribute: '',
        address: '',
        service_date: '',
        service_time: '',
        serviceattributesArray: []
    },

    init: function () {
        $("#housetype").hide();
        $("#livingrooms").hide();
        $("#bedrooms").hide();
        //  alert('hidhjdbvs');
        $("#bathrooms").hide();
        $("#garden").hide();
        $("#plan").hide();

        serviceOrder.listener(); ////listen to any price change
        serviceOrder.checkStatus();
        serviceOrder.getService();

        serviceOrder.getCountries();

        $('#country_id').change(function () {
            var value = $('#country_id').val();
            serviceOrder.getStatesInCountry(value);
        });

        $('#state_id').change(function () {
            var value = $('#state_id').val();
            serviceOrder.getLocationsInState(value);
        })

        $('#service_id').change(function () {
            var value = $('#service_id').val();
            serviceOrder.getCategory(value);
        });

        $('#category_id').change(function () {
            var value = $('#service_id').val();
            var value2 = $('#category_id').val();
            serviceOrder.getAttribute(value, value2);
        });

        serviceOrder.categoryOptions();

        $('#getPrice').click(function (e) {
            e.preventDefault;
            serviceOrder.getOrderPrice();
        });

        $('#createOrder').click(function (e) {
            e.preventDefault;
            serviceOrder.submitOrder();
        });

        $('#confirm').on('click', '.confirm', function (e) {

            serviceOrder.orderAjax();
            // $('#confirm').modal('toggle');
        })
    },

    getCountries: function () {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + serviceOrder.CONSTANTS.country_route,
            data: {
                format: 'json'
            },
            error: function () {
                //   alert('Sorry error occured while fetching available countries');
                $('#alert').modal();
                document.getElementById('alertresponse').innerHTML = 'Unable to fecth available countries.'
            },
            dataType: 'json',
            success: function (data) {
                // console.log(data);
                serviceOrder.populateCountryDropdown(data);
            },
            type: 'GET'
        });
    },
    populateCountryDropdown: function (data) {
        var $country = $("#country_id");
        $country.empty();
        $country.append('<option value="">Select your country</option>')
        $.each(data, function (index, value) {
            //console.log(data)
            $country.append("<option value=" + value.id + ">" + value.name + "</option>");
        });
        //    alert(Cedezone.getStatus());
        if (Cedezone.getStatus() == 'true') {
            //  alert(Cedezone.getStatus());
            $country.val(Cedezone.getCountryID());
        }
    },

    getStatesInCountry: function (countryid) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + serviceOrder.CONSTANTS.state_route + countryid,
            data: {
                format: 'json'
            },
            error: function () {
                // $('#alert').modal();
                // document.getElementById('alertresponse').innerHTML = 'Unable to fetch available states in your country';
                showDialog({
                    title: 'Error',
                    text: 'Unable to fetch available states in your country',
                    positive: {
                        title: 'Ok'
                    },
                    cancelable: false
                })
                var $state = $("#state_id");
                $state.empty();
                $state.append('<option value="">Select your state</option>');
            },
            dataType: 'json',
            success: function (data) {
                if (data.length == 0) {
                    //  alert('no state');
                    // $('#empty_response').modal();
                    // document.getElementById('noyet').innerHTML = "We are yet to Cover Your Country";
                    showDialog({
                        title: 'Error',
                        text: 'We are yet to Cover Your Country',
                        positive: {
                            title: 'Ok'
                        },
                        cancelable: false
                    })
                    var $state = $("#state_id");
                    $state.empty();
                    $state.append('<option value="">Select your state</option>');
                } else {
                    serviceOrder.populateStateDropdown(data);
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
        if (Cedezone.getStatus() == 'true') {
            $state.val(Cedezone.getStateID());
        }
    },

    getLocationsInState: function (stateid) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + serviceOrder.CONSTANTS.location_route + stateid,
            data: {
                format: 'json'
            },
            error: function () {
                // alert('Sorry error occured while fetching available locations in your state');
                showDialog({
                    title: 'Oops!',
                    text: 'Sorry error occured while fetching available locations in your state',
                    positive: {
                        title: 'Ok'
                    },
                    cancelable: false
                })
                var $location = $("#location_id");
                $location.empty();
                $location.append('<option value="">Select your Location</option>');
            },
            dataType: 'json',
            success: function (data) {
                if (data.length == 0) {
                    //  alert('no state');
                    // $('#empty_response').modal();
                    // document.getElementById('noyet').innerHTML = "We are yet to Cover Your State";
                    showDialog({
                        title: 'Oops!',
                        text: 'We are yet to Cover Your State',
                        positive: {
                            title: 'Ok'
                        },
                        cancelable: false
                    });
                    var $location = $("#location_id");
                    $location.empty();
                    $location.append('<option value="">Select your Location</option>');
                } else {
                    serviceOrder.populateLocationDropdown(data);
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
        if (Cedezone.getStatus() == 'true') {
            $location.val(Cedezone.getLocationID());
        }
    },

    getService: function () {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + serviceOrder.CONSTANTS.service_route,
            data: {
                format: 'json'
            },
            error: function () {
                // alert('Sorry error occured while fetching available services');
                showDialog({
                    title: 'Oops!',
                    text: 'Sorry error occured while fetching available services',
                    positive: {
                        title: 'Ok'
                    },
                    cancelable: false
                })
            },
            dataType: 'json',
            success: function (data) {
                // console.log(data);
                serviceOrder.populateServiceDropdown(data);
            },
            type: 'GET'
        });
    },

    populateServiceDropdown: function (data) {
        var $service = $("#service_id");
        $service.empty();
        $service.append('<option value="">Select Service</option>');
        $.each(data.data, function (index, value) {
            $service.append("<option value=" + value.id + ">" + value.name + "</option>");
            $("#service_id option[value=2]").hide();
        });

        if (Cedezone.getStatus() == 'true') {
            $service.val(Cedezone.getServiceID());
        }
    },

    getCategory: function (serviceID) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + serviceOrder.CONSTANTS.category_route + serviceID,
            data: {
                format: 'json'
            },
            error: function () {
                //   alert('Sorry error occured while fetching available Service Categories');

                // var $category = $("#category_id");
                // $category.empty();
                // $category.append('<option value="">Service Category</option>');

                showDialog({
                    title: 'Oops!',
                    text: 'Sorry error occured while fetching available Service Categories',
                    positive: {
                        title: 'Ok'
                    },
                    cancelable: false
                })
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                serviceOrder.populatecategoryDropdown(data);
            },
            type: 'GET'
        });
    },

    populatecategoryDropdown: function (data) {
        var $category = $("#category_id");
        $category.empty();
        $category.append('<option value="">Service Category</option>');
        $.each(data.data, function (index, value) {
            $category.append("<option value=" + value.id + ">" + value.name + "</option>");
        });

        if (Cedezone.getStatus() == 'true') {
            $category.val(Cedezone.getCategoryID());
        }
    },

    getAttribute: function (serviceID, CategoryID) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + serviceOrder.CONSTANTS.attributes_route + serviceID + '/' + CategoryID,
            data: {
                format: 'json'
            },
            error: function () {
                showDialog({
                    title: 'Oops!',
                    text: 'Sorry error occured while fetching Service Attributes',
                    positive: {
                        title: 'Ok'
                    },
                    cancelable: false
                })
                var $attribute = $("#attribute_id");
                $attribute.empty();
                $attribute.append('<option value="">Service Attribute</option>');
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                serviceOrder.populateattributeDropdown(data);
            },
            type: 'GET'
        });
    },

    populateattributeDropdown: function (data) {
        var $attribute = $("#attribute_id");
        $attribute.empty();
        $attribute.append('<option value="">Service Attribute</option>');
        $.each(data.data, function (index, value) {
            $attribute.append("<option value=" + value.id + ">" + value.name + "</option>");
        });
        if (Cedezone.getStatus() == 'true') {
            //  alert(Cedezone.getAttributeID());
            $attribute.val(Cedezone.getAttributeID());
        }
    },

    categoryOptions: function () {
        $('#category_id').on('change', function () {
            // var selectedservice = $(this).val();
            var selectedservice = $('#category_id option:selected').text();

            if (selectedservice == 'Home') {
                $("#housetype").show();
            } else {
                $("#housetype").hide();
                $("#livingrooms").hide();
                $("#bedrooms").hide();
                $("#bathrooms").hide();
                $("#garden").hide();
            }
        });

        $('#attribute_id').on('change', function () {
            var selectedattrib = $('#attribute_id option:selected').text();
            //  var selectedattrib = $('#attribute_id').val();
            //alert(selectedattrib);
            if (selectedattrib == 'Regular') {
                $("#plan").show();
            } else {
                $("#plan").hide();
                $("#regularly").val = 0;
            }
        });

        $('#housetype').on('change', function () {
            var selectedhouse = $('#housetype option:selected').text();

            if (selectedhouse == 'Apartment/Flats') {
                $("#livingrooms").hide();
                $("#bedrooms").show();
                $("#bathrooms").show();
                $("#garden").hide();

            } else if (selectedhouse == 'Duplex' || selectedhouse == 'Mansion') {
                $("#livingrooms").show();
                $("#bedrooms").show();
                $("#bathrooms").show();
                $("#garden").show();
            } else {
                $("#livingrooms").hide();
                $("#bedrooms").hide();
                $("#bathrooms").hide();
                $("#garden").hide();
            }
        });
    },

    listener: function () {
        $object = $("[data-price-checker='true']");
        if ($object.size() > 0) {
            $.each($object, function (key, value) {
                $(this).change(function () {
                    serviceOrder.checkQuote();
                });
            })
        }
    },

    checkQuote: function () {
        var location_id = $('#location_id').val();
        var service_id = $('#service_id').val();
        var category_id = $('#category_id').val();
        var attribute_id = $('#attribute_id').val();
        if (location_id != '' && service_id != '' && category_id != '' && attribute_id != '') {
            serviceOrder.getQuote(location_id, service_id, category_id, attribute_id);
        }
    },

    getQuote: function (location_id, service_id, category_id, attribute_id) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + '/fetch/price/attribute',
            data: {
                format: 'json',
                category_id: category_id,
                location_id: location_id,
                service_id: service_id,
                serviceattribute_id: attribute_id
            },
            error: function () {
                $('#alert').modal();
                document.getElementById('alertresponse').innerHTML = 'Our Prices does not cover this service category / location yet';
                document.getElementById('price_per_hour').innerHTML = '0.00';
                document.getElementById('rec_hour').innerHTML = '0';

                //    serviceOrder.getAttribute($('#service_id').val(), $('#category_id').val());

            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                //alert(data.data.price);

                if (data.data.length == 0) {
                    // $('#alert').modal();
                    showDialog({
                            title: 'None',
                            text: 'Our Prices Does not cover this service category / location yet',
                            positive: {
                                title: 'Ok'
                            },
                            cancelable: false
                        }),
                        document.getElementById('price_per_hour').innerHTML = '0.00';
                    document.getElementById('rec_hour').innerHTML = '0';

                    //serviceOrder.getAttribute($('#service_id').val(), $('#category_id').val());

                } else {
                    document.getElementById('price_per_hour').innerHTML = '<b>' + data.data.price + '</b>';
                    document.getElementById('rec_hour').innerHTML = '<b>' + data.data.recommended_hour + '</b>';
                }
                //  $("#price").show();
            },
            type: 'POST'
        });
    },

    getOrderPrice: function () {
        //   var selectedservice = $('#service_id').val();
        var selectedservice = $('#service_id option:selected').text();
        var selectedcategory = $('#category_id option:selected').text();
        //     alert(selectedservice);
        serviceOrder.CONSTANTS.location = $('#location_id').val();
        serviceOrder.CONSTANTS.service = $('#service_id').val();
        serviceOrder.CONSTANTS.category = $('#category_id').val();
        serviceOrder.CONSTANTS.attribute = $('#attribute_id').val();

        if (serviceOrder.CONSTANTS.location == '') {
            showDialog({
                title: 'Alert',
                text: 'Select a Location',
                positive: {
                    title: 'Ok'
                },
                cancelable: false
            })
            // alert('Select a Location');
            return false;
        } else if (serviceOrder.CONSTANTS.service == '') {
            // alert('Select a Service');
            showDialog({
                title: 'Alert',
                text: 'Select a Service',
                positive: {
                    title: 'Ok'
                },
                cancelable: false
            })
            return false;
        } else if (serviceOrder.CONSTANTS.category == '') {
            // alert('Select a Service Category');
            showDialog({
                title: 'Alert',
                text: 'Select a Service Category',
                positive: {
                    title: 'Ok'
                },
                cancelable: false
            })
            return false;
        } else if (serviceOrder.CONSTANTS.attribute == '') {
            // alert('Select a Category Attribute');
            showDialog({
                title: 'Alert',
                text: 'Select a Category Attribute',
                positive: {
                    title: 'Ok'
                },
                cancelable: false
            })
            return false;
        } else {
            serviceOrder.getQuote(serviceOrder.CONSTANTS.location, serviceOrder.CONSTANTS.service, serviceOrder.CONSTANTS.category, serviceOrder.CONSTANTS.attribute);
        }
    },

    submitOrder: function () {
        serviceOrder.CONSTANTS.service_date = $('#service_date').val();
        serviceOrder.CONSTANTS.service_time = $('#service_time').val();
        serviceOrder.CONSTANTS.address = ($.trim($('#address').val()));

        serviceOrder.CONSTANTS.location = $('#location_id').val();
        serviceOrder.CONSTANTS.service = $('#service_id').val();
        serviceOrder.CONSTANTS.category = $('#category_id').val();
        serviceOrder.CONSTANTS.attribute = $('#attribute_id').val();

        serviceOrder.CONSTANTS.serviceattributesArray.push("Type: " + $('#housetype_value').val());
        serviceOrder.CONSTANTS.serviceattributesArray.push("Bed Rooms: " + $('#bedrooms_value').val());
        serviceOrder.CONSTANTS.serviceattributesArray.push("Bathrooms: " + $('#bathrooms_value').val());
        serviceOrder.CONSTANTS.serviceattributesArray.push("Living Rooms: " + $('#livingrooms_value').val());
        serviceOrder.CONSTANTS.serviceattributesArray.push("Garden: " + $('#garden_value').val());
        serviceOrder.CONSTANTS.serviceattributesArray.push("Additional Details: " + $.trim($('#additional_info').val()));

        //        var location_id = $('#location_id').val();
        //        var service_id = $('#service_id').val();
        //        var category_id = $('#category_id').val();
        //        var attribute_id = $('#attribute_id').val();

        if (serviceOrder.CONSTANTS.service == '') {
            // alert('Select a Service');
            showDialog({
                title: 'Alert',
                text: 'Select a Service',
                positive: {
                    title: 'Ok'
                },
                cancelable: false
            })
            return false;
        } else if (serviceOrder.CONSTANTS.category == '') {
            // alert('Select a service category');
            showDialog({
                title: 'Alert',
                text: 'Select a Service Category',
                positive: {
                    title: 'Ok'
                },
                cancelable: false
            })
            return false;
        } else if (serviceOrder.CONSTANTS.attribute == '') {
            // alert('Select service attribute');
            showDialog({
                title: 'Alert',
                text: 'Select a Service Attribute',
                positive: {
                    title: 'Ok'
                },
                cancelable: false
            })
            return false;
        } else if (serviceOrder.CONSTANTS.service_date == '') {
            //  alert(serviceOrder.CONSTANTS.service_date);
            // alert('Select a Date');
            showDialog({
                title: 'Alert',
                text: 'Select Date',
                positive: {
                    title: 'Ok'
                },
                cancelable: false
            })
            return false;
        } else if (serviceOrder.CONSTANTS.service_time == '') {
            // alert('Select a Time');
            showDialog({
                title: 'Alert',
                text: 'Select Time',
                positive: {
                    title: 'Ok'
                },
                cancelable: false
            })
            return false;
        } else if (serviceOrder.CONSTANTS.address == '') {
            // alert('Enter your Address');
            showDialog({
                title: 'Alert',
                text: 'Enter your Address',
                positive: {
                    title: 'Ok'
                },
                cancelable: false
            })
            return false;
        } else if (document.getElementById('price_per_hour').innerHTML == '0.00') {
            // alert('No Price for this service in this location');
            showDialog({
                title: 'Alert',
                text: 'No Price for this service in this location',
                positive: {
                    title: 'Ok'
                },
                cancelable: false
            })
        } else {
            //
            if ($('#category_id option:selected').text() == 'Home') {
                if ($('#housetype_value').val() == 'Not Selected') {
                    // alert('Select House Type');
                    showDialog({
                        title: 'Alert',
                        text: 'Select House Type',
                        positive: {
                            title: 'Ok'
                        },
                        cancelable: false
                    })
                } else if (document.getElementById('price_per_hour').innerHTML == '0.00') {
                    // alert('No Price for this service in this location');
                    showDialog({
                        title: 'Alert',
                        text: 'No Price for this service in this location',
                        positive: {
                            title: 'Ok'
                        },
                        cancelable: false
                    })
                } else {
                    // $('#confirm').modal('toggle');
                    $('#clickme').click();
                }
            } else {
                // $('#confirm').modal('toggle');
                $('#clickme').click();
            }
        }
    },

    orderAjax: function () {
        // alert($('#service_date').val());
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + '/order',
            data: {
                format: 'json',
                //   token: Cedezone.getToken(),
                location_id: serviceOrder.CONSTANTS.location,
                service_id: serviceOrder.CONSTANTS.service,
                category_id: serviceOrder.CONSTANTS.category,
                serviceattribute_id: serviceOrder.CONSTANTS.attribute,
                address: serviceOrder.CONSTANTS.address,
                service_date: serviceOrder.CONSTANTS.service_date,
                service_time: serviceOrder.CONSTANTS.service_time,
                order_attributes: serviceOrder.CONSTANTS.serviceattributesArray
            },
            error: function (data) {
                Cedezone.hideLoadingGif();
                console.log(data);
                showDialog({
                    title: 'Error',
                    text: 'Unable to Initiate Order. Try again Later',
                })
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                if (data.status == false) {
                    showDialog({
                        title: 'Error',
                        text: data.msg,
                        positive: {
                            title: 'Ok'
                        },
                        cancelable: false
                    })
                } else {
                    serviceOrder.successfulOrderResponse(data);
                }
            },
            beforeSend: function () {
                Cedezone.showLoadingGif();
            },
            type: 'POST',
            headers: {
                "Authorization": "Bearer " + Cedezone.getToken()
            },
        });
    },

    successfulOrderResponse: function (data) {
        $view = $('#successMsg').html();
        $('#changepage').html("");
        $('#changepage').html($view);
    },

    failedOrderResponse: function (data) {
        $view = $('#failureMsg').html();
        $('#changepage').html("");
        $('#changepage').html($view);
        $('.message').innerHTML = data.msg;
    },

    formatDate: function (date) {
        if (date == null) {
            return date
        }
        if (date['date']) {
            return date.date;
        }
        return date;
    },

    redirectHome: function () {
        window.location.href = 'home.html';
    },

    checkStatus: function () {
        if (Cedezone.getStatus() == 'true') {
            serviceOrder.getStatesInCountry(Cedezone.getCountryID());
            serviceOrder.getLocationsInState(Cedezone.getStateID());

            serviceOrder.getCategory(Cedezone.getServiceID());
            serviceOrder.getAttribute(Cedezone.getServiceID(), Cedezone.getCategoryID());

            serviceOrder.CONSTANTS.location = Cedezone.getLocationID();
            serviceOrder.CONSTANTS.service = Cedezone.getServiceID();
            serviceOrder.CONSTANTS.category = Cedezone.getCategoryID();
            serviceOrder.CONSTANTS.attribute = Cedezone.getAttributeID();

            Cedezone.showLoadingGif();
            serviceOrder.getQuote(Cedezone.getLocationID(), Cedezone.getServiceID(), Cedezone.getCategoryID(), Cedezone.getAttributeID());
            Cedezone.hideLoadingGif();

            setTimeout(function () {
                var selectedservice = $('#category_id option:selected').text();
                var selectedattrib = $('#attribute_id option:selected').text();
                //  alert(selectedservice);
                if (selectedservice == 'Home') {
                    $("#housetype").show();
                } else {
                    $("#housetype").hide();
                    $("#livingrooms").hide();
                    $("#bedrooms").hide();
                    $("#bathrooms").hide();
                    $("#garden").hide();
                }

                if (selectedattrib == 'Regular') {
                    $("#plan").show();
                } else {
                    $("#plan").hide();
                    $("#regularly").val = 0;
                }
            }, 3000);
        }
    },
}