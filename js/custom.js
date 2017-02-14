$(function () {
    "use-strict";
    $(".sidenav-control-right").sideNav({
        edge: "left",
        closeOnClick: !1
    }), $(document).on("click", ".collapsible-header", function () {
        $(this).find("span i").toggleClass("fa-chevron-down")
    }), $(".slider-slick").slick({
        dots: !0,
        infinite: !0,
        speed: 300,
        slidesToShow: 1,
        autoplay: !0
    }), $(document).on("click", ".faq-collapsible", function () {
        $(this).find("i").toggleClass("fa-minus")
    }), $("#testimonial").owlCarousel({
        slideSpeed: 300,
        paginationSpeed: 400,
        singleItem: !0
    }), $("ul.tabs").tabs()
});
