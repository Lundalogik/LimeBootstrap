
var Localizer = null;

/**
 * Use Localizer.LocalizePage to translate an actionpad into the current user's
 * locale. Each element with an attribute with the same name as the locale is
 * translated. Call Localizer.LocalizePage in the onload event.
 *
 * A href in the actionpad should look like this:
 *
 * <a href="#" onclick="..." sv="Nytt företag" en-us="New company"></a>
 *
 * Tooltips (title) for hrefs should look like this:
 *
 * <a href="#" onclick="..." title-sv="Svenskt tooltip" title-en-us="English tooltip"></a>
 */
(function() {

   if (Localizer == null)
     Localizer = new Object();

   Localizer.LocalizePage = function() {
     var locale = window.external.Locale;
     var title;

     // set innerhtml for all tags with a locale attribute
     $("*", document.body).each(function(i) {
       if ($(this).attr(locale) != undefined){
         $(this).html($(this).attr(locale));
       }
       });

     // set tooltip for all hrefs
     title = "title-" + locale;
     $("a", document.body).each(function(i) {
       if ($(this).attr(title) != undefined){
         $(this).attr({title: $(this).attr(title)});
       }
       });
   }

 }

) ();
