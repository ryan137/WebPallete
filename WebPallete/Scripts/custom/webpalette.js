var themeController = (function () {
    var Themes = function(id,name,css){
        this.id = id;
        this.name = name;
        this.css = css;
    }

    var data = [];

    Themes.prototype.getTheme= function(){
        return this.css;
    }
    
    return {
        getThemesFromDB: function () {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", "http://localhost:64985/Themes/GetAllThemes", false);
            xhttp.send();
            return JSON.parse(xhttp.response);
        }
    }
})();

var UIController = (function () {

    // Set DOM names
    var DOMstrings = {
        body: 'body',
        customCSS: 'customcss',
        themesContainer: '.themes-container'
    };

    // Remove link to css and set cookies content to empty
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

        displayThemes: function (themes) {
            var html;
            // 1. Create HTML String
            for (var i = 0; i < themes.length; i++) {
                html += '<li><a href="#" class="glyphicon glyphicon-tint" data-theme="' + themes[i].id + '"></a></li>';
            };
            console.log(html);
            // 2. Insert into DOM
            document.querySelector(DOMstrings.themesContainer).insertAdjacentHTML('beforeend', html);
        },

        changeWebTheme: function (filename) {
            // 1. Check if there is css link id, if exist then remove
            var x;
            x = document.getElementById(DOMstrings.customCSS);
            if (x) {
                removeEl(x);
            }

            // 2. Request CSS code from DB using AJAX


            // 2. Create new css link in head tag if the chosen theme is not the default one and add cookies
            if (filename !== 'default') {
                var fileref = document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("id", "customcss");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", filename);
                document.getElementsByTagName("head")[0].appendChild(fileref);
                setCookie('customcsspath', filename, 365);
            }

            //console.log(getCookie('customcsspath'));

            return "";
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    }
})();


var controller = (function (themeCtrl,UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        // Set event listener to html body
        document.querySelector(DOM.body).addEventListener('click', ctrlChangeThemes);
    };

    var getThemes = function () {
        // 1. Get themes from DB
        var themes = themeCtrl.getThemesFromDB();
        // 2. Display themes list to UI
        UICtrl.displayThemes(themes);

    };

    var loadSavedTheme = function () {
        // 1. Get Cookie
        var x = UICtrl.getCookie('customcsspath');

        // 2. Change web theme if cookie exist
        if (x) {
            UICtrl.changeWebTheme(x);
        }
    };

    var ctrlChangeThemes = function (event) {
        
        // 1.Check if there is data-theme attribute in event target
        var themeID = event.target.getAttribute('data-theme');

        // 2.If data-theme exist then change theme 
        if (themeID) {
            UICtrl.changeWebTheme(themeID);
        }
    }

    
    return {
        init: function () {
            // 1. Show that controller is running
            console.log("App started")

            // 2. Get cookies
            loadSavedTheme();
            getThemes();

            // 3. Set event listener
            setupEventListeners();
        }
    }

})(themeController,UIController);

// Initialize controller
controller.init();


