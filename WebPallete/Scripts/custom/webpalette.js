var UIController = (function () {

    var DOMstrings = {
        container: 'body',
        customCSS: 'customcss'
    };

    var removeEl = function (el) {
        el.parentNode.removeChild(el);
        setCookie('customcsspath', '', -1);
    }

    var setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    };

    return {
        getCookie: function (cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
        },

        changeWebTheme: function (filename) {
            var x;
            x = document.getElementById(DOMstrings.customCSS);
            if (filename !== 'default') {
                var fileref = document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("id", "customcss");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", filename);
                document.getElementsByTagName("head")[0].appendChild(fileref);
                setCookie('customcsspath', filename, 365);
            }
            else {
                removeEl(x);
            }

            //console.log(getCookie('customcsspath'));

            return "";
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    }
})();


var controller = (function (UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.container).addEventListener('click', ctrlChangeThemes);
    };

    var loadSavedTheme = function () {
        // 1. Get Cookie
        var x = UICtrl.getCookie('customcsspath');

        // 2. Change web theme if cookie exist
        if (x) {
            UICtrl.changeWebTheme(x);
        }
    }

    var ctrlChangeThemes = function (event) {
        var themeID = event.target.getAttribute('data-theme');
        if (themeID) {
            // 1. Change web theme
            UICtrl.changeWebTheme(themeID);
        }
    }

    loadSavedTheme();
    return {
        init: function () {
            console.log("App started")
            setupEventListeners();
        }
    }

})(UIController);
