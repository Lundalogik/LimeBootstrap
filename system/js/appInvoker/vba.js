var VBA = null;

/**
 * Use VBA.Run to call a function in VBA from the actionpad.
 * The first parameter in the VBA.Run method is the VBA function name
 * and the other parameters(unlimited) is arguments for the VBA function.
 *
 * To call a function with no arguments:
 *
 * VBA.Run("FunctionName");
 *
 * To call a function with arguments:
 *
 * VBA.Run("FunctionName", "Arg1", "Arg2", "Arg3");
 */
(function() 
{

	if (VBA == null)
		VBA = new Object();
	
	VBA.Run = function() {
		try {
			if ( arguments.length > 1 ) {
				var args = "";
				var vbaline = "window.external.Run('" + arguments[0] + "', ";
				for (var i = 1; i < arguments.length; i++) {
					args += "'" + arguments[i] + "'";
					if (i != arguments.length - 1) 
						args += ",";
				}
				vbaline += args + ")";
				return eval(vbaline);
			}
			else {
				return window.external.Run( arguments[0] );
			}
		} catch (exception)
		{
			alert(exception.message);
		}
	}

}

) ();