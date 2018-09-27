
var Auth = null;

/**
 * Use Auth.AuthorizePage in the onLoad event to show/hide authorized content.
 * The "policy" attribute on an element determines if the current user is
 * authorized to see the element.
 * 
 * For example here is a div-element wich is only visible for users in groups
 * "SuperUsers" and "Administrators"
 * 
 * <div policy="SupersUsers,Administrators">Secret content</div>
 * 
 */
(function() {

   if (Auth == null)
     Auth = new Object();

   Auth.AuthorizePage = function() {
     var isAuth = false;
     
     $("*", document.body).each(function(i) {
       if ($(this).attr('groups') != null){
         var p = $(this).attr('groups').split(',');
         
         for(j=0;j<p.length;j++)
	 {
	   if(external.ActiveUser.MemberOfGroups.Lookup(p[j],2)!=null){
	     isAuth = true;break;
	   }
	 }
	 
	 if(!isAuth)
	 {
	   $(this).css({ display:"none"});
	 }
	 
	 isAuth = false;
       }
       });
   }

 }

) ();