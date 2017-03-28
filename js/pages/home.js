Home = {
    CONSTANTS: {

        Home: '',
        location_route: '/location/',
        myorders_route: '/myorders',
         status: '/change/order/status',
    },

    init: function () {
        Cedezone.checkToken();
        // sideProfile.init();
        Home.getMyOrders();

         $('#history-content').on('click', '.confirm', function (e) {
            e.preventDefault();
            if(this.value == ''){
                return false;
            }
            var orderid = $(this).attr('data-id');
            var statusid = this.value;
//            alert(orderid);
//            alert( this.value );

           Home.changeorderStatus(orderid, 11);

        });

        $('#history-content').on('click', '.cancel', function (e) {
            e.preventDefault();
            if(this.value == ''){
                return false;
            }
            var orderid = $(this).attr('data-id');
            var statusid = this.value;
//            alert(orderid);
//            alert( this.value );

           Home.changeorderStatus(orderid, 7);

        });
    },

    getMyOrders: function (p) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + Home.CONSTANTS.myorders_route + '?page=' + p,
            data: {
                format: 'json',
                token: Cedezone.getToken(),
            },
            error: function () {
                Cedezone.hideLoadingGif();
                swal('Error', 'Error fetching Your recent activities', 'error')
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                Home.populateTable(data);
            },
            beforeSend: function () {
                Cedezone.showLoadingGif();
            },
            type: 'GET'
        });
    },

    populateTable: function (data) {
        if (data.status == true) {
            var $tr = '';
            var responses = data.data;
            if($.isEmptyObject(data.data)){

                $('#history-content').append($('#empty-activity').html())
                return false;
            }
            var $content =$('#activities_template').html();
            $('#table tbody').html(""); ///empty table for new records
            var no = (data.pagination.current_page - 1) * data.pagination.per_page;
            $('#history-content').empty();
            $('#history-content').append($content);
            $.each(responses, function (i, item) {
                //for(no =1; no<=5; no++){
                no++
                if(no>3){
                    return false;
                }
                $tr = $('<tr>').append(
                    // $('<td>').text(no),
                    $('<td>').text(item.service.category+ ' '+ item.service.name),
                    $('<td>').text(item.service.attribute),
                    // $('<td>').text(item.order_ref_id),
                    $('<td>').text(item.service_date + ' ' +item.service_time),
                    $('<td>').text(item.address),
                    $('<td>').text(item.status.name),
                    $('<td>').html(Home.orderStatusButton(item.status.name,item.id ))
                )
                $('#history-content table tbody').append($tr);
            })

            //console.log(data.pagination);
            // var paging = $.parseJSON(data.pagination);
            $('#pagination').html(data.pagination.link);
        } else {
            swal('Oops..', data.msg, 'error')
        }
    },

 orderStatusButton: function(data, id){
        $html = ''
          if(data == 'Completed'){
                   $html='<a class="btn waves-effect waves-light blue" confirm" data-id="'+id+'"><i class="fa fa-check"></i> Confirm </a>'
                }else if(data == 'Confirmed'){
                   $html='<button class="btn waves-effect waves-light green"" data-id="" disabled><i class="fa fa-check"></i> Confirmed </button>'
                }else if(data == 'Canceled'){
                   $html='<button class="btn waves-effect waves-light red" data-id="" disabled><i class="fa fa-trash"></i> Canceled </button>'
                }else{

                   $html='<a class="btn waves-effect waves-light red cancel" data-id="'+id+'"><i class="fa fa-trash"></i> Cancel </a>'
                }

        return $html
    },

    ProcessError: function (data) {
        Cedezone.hideLoadingGif();
        console.log(data);
        var errorKeys = Object.keys(data.responseJSON);
        //    $('#login-error').append(Login.CONSTANTS.error);
//document.getElementById('login-error').innerHTML = 'Invalid Username or Password';
        //    Cedezone.showNotification('error', 'Wrong username or password', 'Invalid Login');
        errorKeys.forEach(function (record) {
            console.log(record);
            $('#' + record).addClass('parsley-error').parent().append(
                '<ul class="parsley-errors-list filled"><li class="parsley-required">' + data.responseJSON[record] + '</li></ul>'
            )
        });
    },


    changeorderStatus: function (orderid, statusid) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + Home.CONSTANTS.status,

            data: {
                order_id: orderid,
                status: statusid
            },
            error: function (data) {
                Cedezone.hideLoadingGif()
                swal('Error', 'Unable to update status. Try Again Later', 'error');
            },
            headers: {
                "Authorization": "Bearer " + Cedezone.getToken()
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                if (data.status == true) {
                    swal('Success', data.msg, 'success')
                        //   Provider.getNewProviders()//reload the page
        Home.getMyOrders();
                } else if (data.status == false) {
                    swal('Error', data.msg, 'error')
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
