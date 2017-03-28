userOrders = {
    CONSTANTS: {
            myorders_route: '/myorders',
                status: '/change/order/status',

    },

    init: function () {
      userOrders.getMyOrders(1);

         $('#pagination').on('click', '.pagination a', function (e) { //controls pagination link
           // alert('am clicked');
            e.preventDefault();
            userOrders.getMyOrders($(this).attr('href').split('page=')[1]);
        });

        $('.order-container').on('click', '.confirm', function (e) {
            e.preventDefault();
            if(this.value == ''){
                return false;
            }
            var orderid = $(this).attr('data-id');
            var statusid = this.value;
//            alert(orderid);
//            alert( this.value );

           userOrders.changeorderStatus(orderid, 11);

        });

        $('.order-container').on('click', '.cancel', function (e) {
            e.preventDefault();
            if(this.value == ''){
                return false;
            }
            var orderid = $(this).attr('data-id');
            var statusid = this.value;
//            alert(orderid);
//            alert( this.value );

           userOrders.changeorderStatus(orderid, 7);

        });

        $('.order-container').on('click', '.provider', function (e) {
            e.preventDefault();
        //   $('#provider').modal('show');

            var data = JSON.parse($(this).attr('data-provider'));

            console.log(data);

            document.getElementById('username').innerHTML = '<i class="fa fa-user"></i> ' + data.name;
            document.getElementById('email').innerHTML = '<i class="fa fa-envelope"></i> ' + data.email;
            document.getElementById('phone').innerHTML = '<i class="fa fa-phone" ></i> ' + data.phone;

            if(data.avatar == ""){
              //   $("#avatar").attr("src", "{{asset('assets/images/default.png')}}");
            }else{
                 $("#avatar").attr("src", data.avatar);
            }

          //  $("#avatar").attr("src", data.avatar);

        });
    },

    getMyOrders: function (p) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + userOrders.CONSTANTS.myorders_route + '?page=' + p,
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
                userOrders.populateTable(data);
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
                $('.order-container').append($('#empty-activity').html())
                return false;
            }
            var $content =$('#order_history_template').html();

            //$('#myservices tbody').html(""); ///empty table for new records
            var no = (data.pagination.current_page - 1) * data.pagination.per_page;
            $('.order-container').empty();
            $('.order-container').append($content)
            $.each(responses, function (i, item) {
                //for(no =1; no<=5; no++){
                no++
                    $tr = $('<tr>').append(
                    $('<td>').text(no),
                    // $('<td>').text(item.order_ref_id),
                    $('<td>').text(item.service.category + ' ' + item.service.name),
                    $('<td>').text(item.service.attribute),
                    $('<td>').text(item.service_date + ' / ' +item.service_time),
                    $('<td>').text(item.address),
                    $('<td>').text(item.status.name),
                    $('<td>').html(userOrders.providerDisplay(item.provider)),
//                    $('<td>').text(''),
                    $('<td>').html(userOrders.orderStatusButton(item.status.name,item.id ))
                    );
                $('.order-container table tbody').append($tr);
                // $('.order-container table tbody').append('<div class="line" style="height: 40px; width: 6px; background: #888; margin: 0 auto;"></div>');

            });
            //console.log(data.pagination);
            // var paging = $.parseJSON(data.pagination);
            $('#pagination').html(data.pagination.link);
        } else {
            swal('Oops..', data.msg, 'error');
        }
    },
 orderStatusButton: function(data, id){
        $html = ''
          if(data == 'Completed'){
                   $html='<a class="btn waves-effect waves-light blue confirm" data-id="'+id+'"><i class="fa fa-check"></i> Confirm </a>'
                }else if(data == 'Confirmed'){
                   $html='<button class="btn waves-effect waves-light green" data-id="" disabled><i class="fa fa-check"></i> Confirmed </button>'
                }else if(data == 'Canceled'){
                   $html='<button class="btn waves-effect waves-light red data-id="" disabled><i class="fa fa-trash"></i> Canceled </button>'
                }else{

                   $html='<a class="btn waves-effect waves-light red cancel" data-id="'+id+'"><i class="fa fa-trash"></i> Cancel </a>'
                }

        return $html
    },

providerDisplay: function(data){
    $html =''
    if(data==''){
        return $html
    }else{
        return "<a href='#provider' class='provider' data-provider='"+JSON.stringify(data)+"'>"+data.name+"</a>"
    }
},

    changeorderStatus: function (orderid, statusid) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + userOrders.CONSTANTS.status,

            data: {
                order_id: orderid,
                status: statusid
            },
            error: function (data) {
                Cedezone.hideLoadingGif()
                // swal('Error', 'Unable to update status. Try Again Later', 'error');
                showDialog({
                    title: 'Error',
                    text: 'Error in connection',
                })
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
                    text: data.msg,
                })
      userOrders.getMyOrders(1);
                } else if (data.status == false) {
                    showDialog({
                    title: 'Error',
                    text: data.msg,
                })
                }
            },
            beforeSend: function () {
                Cedezone.showLoadingGif();
            },
            type: 'POST'
        })
    },
}
