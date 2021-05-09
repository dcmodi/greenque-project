$(window).on("load",function(){
    var x = document.readyState
    if (x === "complete") {
        $(".load").fadeOut("slow");
        $("body").css("visibility","visible") ;
        $("nav").css("visibility","visible") ;
    } else {
        $(".load").css("visibility","visible") ;
    }
});