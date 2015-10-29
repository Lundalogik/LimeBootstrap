lbs.bakery = {

    loader: function () {       

        var ap = decodeURI(
            (RegExp('ap' + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
        //On load: check collapsible menu cookies
        $('.expandable').each(function () {
            if (lbs.bakery.getCookie($(this).index() + 'ul' + ap) === "0") {
                $(this).find(".menu-header").prepend("<i class='fa fa-angle-down'> </i>");
                $(this).removeClass("collapsed");
                $(this).children("li").not(".remainHidden").show();
            }
            else{
                $(this).find(".menu-header").prepend("<i class='fa fa-angle-right'> </i>");
                $(this).addClass("collapsed");
                $(this).children("li").not(".menu-header").not(".divider").hide();
            }
        });


        $('.expandable').find(".menu-header").click(function () {
            var menuDiv = $(this).parent();
            var i = lbs.bakery.getCookie(menuDiv.index() + 'ul' + ap);
            i = i === "0" ? "1" : "0";
            lbs.bakery.setCookie(menuDiv.index() + 'ul' + ap, i, "200");
            lbs.bakery.hideshow(menuDiv, ap);
        });

    }
    ,
    hideshow: function (menu, ap) {        
        var menuDiv = $(menu);    
        $(menu).find("i").first().toggleClass("fa fa-angle-down"); //expanded
        $(menu).find("i").first().toggleClass("fa fa-angle-right"); // Hidden
        if (lbs.bakery.getCookie($(menu).index() + 'ul' + ap) === "0") {
            menuDiv.removeClass("collapsed");
            menuDiv.children("li").not(".remainHidden").fadeIn(200);
        } else {
            menuDiv.addClass("collapsed");
            menuDiv.children("li").not(".menu-header").not(".divider").fadeOut(200);
        }
    },
    
    setCookie: function (cname, cvalue, exdays) {

        var ap = decodeURI(
            (RegExp('ap' + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );

        cname = cname + '-' + ap;

        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();        
        var cookieid = "cookieid=" + $('.expandable').attr('id');
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    ,
    getCookie: function (cname) {

        var ap = decodeURI(
            (RegExp('ap' + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );

        cname = cname + '-' + ap;

        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }
};

