var active;

function clearField(e, id)
{
	var TAB_KEY = 9;
	
	var keypressed = e.keyCode;
    if(active && keypressed != TAB_KEY)
    {	
    	// The user focused on the field and entered a char
    	// other than tab so blank out the field
		var textField = document.getElementById(id);
		textField.value = '';
	}
	
	// set inactive so the
	// next char will not get
	// erased
	active = false;
}

function activate()
{
	active = true;
}
