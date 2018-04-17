(function () {
    $(".pallete-popover").popover({
        html: true,
        content: function () {
            return $("#pallete-content").html();
        },
    });
})();

//function changeWebTheme(filename) {

//    var x = document.getElementById("customcss");
//    if (x !== null) {
//        removeel(x);
//    };
//    var fileref = document.createElement("link");
//    fileref.setAttribute("rel", "stylesheet");
//    fileref.setAttribute("id", "customcss");
//    fileref.setAttribute("type", "text/css");
//    fileref.setAttribute("href", filename);
//    document.getElementsByTagName("head")[0].appendChild(fileref);
//    setCookie('customcsspath', filename, 365);
//    //console.log(getCookie('customcsspath'));
//};

//function setCookie(cname, cvalue, exdays) {
//    var d = new Date();
//    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//    var expires = "expires=" + d.toUTCString();
//    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
//};

//function getCookie(cname) {
//    var name = cname + "=";
//    var decodedCookie = decodeURIComponent(document.cookie);
//    var ca = decodedCookie.split(';');
//    for (var i = 0; i < ca.length; i++) {
//        var c = ca[i];
//        while (c.charAt(0) == ' ') {
//            c = c.substring(1);
//        }
//        if (c.indexOf(name) == 0) {
//            return c.substring(name.length, c.length);
//        }
//    }
//    return "";
//}

//function removeel(el) {
//    el.parentNode.removeChild(el);
//    setCookie('customcsspath', '', -1);
//};

//function init() {
//    var x = getCookie('customcsspath');
//    if (x !== '') {
//        changeWebTheme(x);
//    }
//}

//$(document).ready(function () {
//    init();
//})

//var themeController = (function () {
//    return {
        
//    }
//})();


