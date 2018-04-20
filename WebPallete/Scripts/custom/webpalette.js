var themeController = (function () {
    var Themes = function(id,name,css){
        this.id = id;
        this.name = name;
        this.css = css;
    }

    var data = {
        allThemes: []
    };
    
    return {
        getThemesFromDB: function () {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", "http://localhost:64985/Themes/GetAllThemes", false);
            xhttp.send();
            var resp = JSON.parse(xhttp.response);
            for (var i = 0; i < resp.length; i++) {
                data.allThemes.push(resp[i]);
            };
            return data;
        },
        getThemeCSS: function (themeid) {
            var css = data['allThemes'].find(x => x.ThemeID == themeid).ThemeCSS
            return css;
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

    var setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    };

    // Remove link to css and set cookies content to empty
    var removeEl = function (el) {
        el.parentNode.removeChild(el);
        setCookie('customcsspath', '', -1);
    }

    return {
        saveCookie: function(themeID){
            setCookie('customcsspath', themeID, 365);
        },

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
            var html, themesLen, themeID, themeIconColor;
            html = '';
            themesLen = themes['allThemes'].length;
            // 1. Create HTML String
            for (var i = 0; i < themesLen; i++) {
                themeID = themes['allThemes'][i].ThemeID;
                themeIconColor = themes['allThemes'][i].IconColor;
                html += '<li><a href="#" class="glyphicon glyphicon-tint" data-theme="' + themeID + '" style="color:' + themeIconColor + '"></a></li>';
            };
            // 2. Insert into DOM
            document.querySelector(DOMstrings.themesContainer).insertAdjacentHTML('beforeend', html);
        },

        changeWebTheme: function (CSSCode) {
            // 1. Check if there is css link id, if exist then remove
            var x;
            x = document.getElementById(DOMstrings.customCSS);
            if (x) {
                removeEl(x);
            }
            // 2. Create new css link in head tag if the chosen theme is not the default one and add cookies
            if (CSSCode) {
                var styleEL = document.createElement('style');

                styleEL.insertAdjacentHTML('beforeend', CSSCode);
                styleEL.setAttribute('id', 'customcss');
                document.getElementsByTagName("head")[0].appendChild(styleEL);
            }
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
        document.querySelector(DOM.body).addEventListener('click', ctrlCheckEventID);
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
            ctrlChangeThemes(x);
        }
    };

    var ctrlCheckEventID = function (event) {
        // 1.Check if there is data-theme attribute in event target
        var themeID = event.target.getAttribute('data-theme');
        if (themeID) {
            // 2.Change web themes
            ctrlChangeThemes(themeID);
        }
    }

    var ctrlChangeThemes = function (themeID) {

        // 1. Get CSS Code
        var themeCSS = themeController.getThemeCSS(themeID);
        // 2. Change theme using CSS code
        UICtrl.changeWebTheme(themeCSS);
        // 3. Set cookie
        UICtrl.saveCookie(themeID);
    }

    
    return {
        init: function () {
            // 1. Show that controller is running
            console.log("App started")

            // 2. Get Themes from DB
            getThemes();

            // 3. Get cookies
            loadSavedTheme();

            // 4. Set event listener
            setupEventListeners();
        }
    }

})(themeController,UIController);

// Initialize controller
controller.init();


