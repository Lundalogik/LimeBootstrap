$(document).ready(
	function(){
	

	$(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        var width = $(window).width();
        var p = navigator.platform;
        
        $('.app-row').each(function(){
            var width = $(window).width();
            var scroll = $(window).scrollTop();
            if (width > 1025){
                if($(this).offset().top < $(window).scrollTop()+700){
                    $(this).css("visibility","visible");
                    $(this).addClass("animated bounceIn");
                }
            }
            else{
                if($(this).offset().top < $(window).scrollTop()+400){
                    $(this).css("visibility","visible");
                    $(this).addClass("animated bounceIn");
    
                }
            }
            
        });

        $('.clock-icon').each(function(){
        	 if($(this).offset().top < $(window).scrollTop()+700){
                    $(this).css("visibility","visible");
                    $(this).addClass("animated lightSpeedIn");
             }
        });
    });


});