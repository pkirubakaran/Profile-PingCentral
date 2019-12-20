/********************************************************************
 *                        context-help.js                           *	
 ******************************************************************** 	
 * Including this file will enable link the context help to the *
 * appropiate online document link.								*
 ********************************************************************/

 function openContextHelp(help_path)
{   
  	help_win = window.open(help_path, 'WWHFrame', 'top=20,left=20,height=750,width=1200,menubar,location,resizable,titlebar,toolbar,scrollbars,status');

	if (help_win.opener == null)
    {
      help_win.opener = window;
    }
	
    help_win.focus();
}