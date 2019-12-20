<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE script PUBLIC

	"-//Apache Software Foundation//Tapestry Script Specification 3.0//EN"

	"http://jakarta.apache.org/tapestry/dtd/Script_3_0.dtd">

<script>
  <body>
<![CDATA[ 
 		function checkCookies()
 		{
			document.cookie = "name=cookies-enabled-check";
			
			// check if cookie was created.  if it was then cookies are enabled.
 			var cookieEnabled = (document.cookie.indexOf("cookies-enabled-check") != -1) ? true : false;
 				
 			if (!cookieEnabled)
 			{
 				var formLoginRow = document.getElementById("formLoginRow");
 				if(formLoginRow != "undefined")
 				{
 					formLoginRow.style.visibility = "hidden";
 				}	

 				var errorMessageDiv = document.getElementById("errorMessageDiv");
 				if(errorMessageDiv != "undefined")
 				{
 	 				errorMessageDiv.innerHTML = "Your browser's support for cookies is disabled, and cookies are required.  Please enable cookies before continuing. <a href='/pingfederate/app'>Try Again</a>";
			
					// this div is hidden by default, via CSS.  it then becomes visible, via javascript, if an error message
					// is detected within it.  since we are injecting a message now, after the javascript is executed, we 
					// must set the div to be visible here.
					var error_message_container = $('#errorMessageDiv');
 	 				error_message_container.show();
 				}	
 			}
 			else
 			{
 				// delete cookie
 				var date = new Date();
 				document.cookie = "name=cookies-enabled-check;expires=" + date.toGMTString();
 			}	
 		}
]]>
  </body>
  <initialization>
  	checkCookies();
  </initialization>
</script>
