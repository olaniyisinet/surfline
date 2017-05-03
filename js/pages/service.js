Services = {

    init: function () {
        Cedezone.CONSTANTS.mprogress = new Mprogress();
        $('#cleaning').click(function (e) {
            Cedezone.storeServiceID(1);
            window.location = "bookaservice.html";
        });
    },
}