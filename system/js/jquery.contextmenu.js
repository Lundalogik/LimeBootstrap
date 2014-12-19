(function ($, window) {

    $.fn.contextMenu = function (idOfTarget,id) {        
        return this.each(function () {

            // Open context menu
            $(this).on("contextmenu", function (e) {
                //open menu
                $(idOfTarget)
                    .data("invokedOn", $(e.target))
                    .show()
                    .css({
                        position: "absolute",
                        left: getLeftLocation(e),
                        top: getTopLocation(e)
                    })
                    .off('click')
                    .on('click', function (e) {
                        $(this).hide();                                  
                        if (e.target.id == "edit") {
                            openLink(id);
                        }                       
                });
                
                return false;
            });

            //make sure menu closes on any click
            $(document).click(function () {
                $(idOfTarget).hide();
            });
        });

        function getLeftLocation(e) {
            var mouseWidth = e.pageX;
            var pageWidth = $(window).width();
            var menuWidth = $(idOfTarget).width();
            
            // opening menu would pass the side of the page
            if (mouseWidth + menuWidth > pageWidth &&
                menuWidth < mouseWidth) {
                return mouseWidth - menuWidth;
            } 
            return mouseWidth;
        }        
        
        function getTopLocation(e) {
            var mouseHeight = e.pageY;
            var pageHeight = $(window).height();
            var menuHeight = $(idOfTarget).height();

            // opening menu would pass the bottom of the page
            if (mouseHeight + menuHeight > pageHeight &&
                menuHeight < mouseHeight) {
                return mouseHeight - menuHeight;
            } 
            return mouseHeight;
        }

    };
})(jQuery, window);