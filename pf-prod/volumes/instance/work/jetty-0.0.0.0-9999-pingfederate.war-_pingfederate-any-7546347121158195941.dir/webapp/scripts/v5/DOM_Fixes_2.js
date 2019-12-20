/*********************************
 * Module: DOM_Fixes.js Version 1.1
 *********************************
 * Various functions fixing the inconsistencies of DOM implementation by
 * different browsers.
 *********************************
 * Copyright (c) 2002, Vlad Krylov, All Rights Reserved.
 *********************************/
var browser = '';
var version = 0.0;
var str = '';
var ignoreEnterKeyPress = false;

// Perform browser identification on load
switch(navigator.appName)
{
    case 'Microsoft Internet Explorer':
        browser='ie';
        str = navigator.appVersion;
        str = str.substring(str.indexOf('MSIE')+4, str.length);
        version = parseFloat(str);
        break;
    case 'Netscape':
        if (navigator.vendorSub !== '')
        {
            browser = 'ns';
            version=parseFloat(navigator.vendorSub);
        }
        else
        {
            browser = 'mz';
            version=parseFloat(navigator.appVersion);
        }
        break;
    default:
        browser='unknown';
        break;
  }

/* Function:  setRowBG
 * Arguments: row  - Row object
 *            bgc  - background color
 *     Works around the Internet Explorer flaw of not updating cell
 *     backgroungs when row background is changed
 */
function setRowBG(row,bgc)
{
    if (browser === 'ns')
    {
        row.style.backgroundColor = bgc;
    }
    else
    {
        for (var i=0; i<row.childNodes.length; i++)
            row.childNodes[i].style.backgroundColor = bgc;
    }
    return;
}


function IEWidthFix()
{
    if (browser === 'ie')
    {
        setTimeout('IEResize();',20);
    }
    return;
}

function IEResize()
{
    window.resizeBy(-1,-1);
    setTimeout('window.resizeBy(-1,-1);', 2);
}

function ieReset()
{
    if (browser == 'ie')
    {
        document.Form0.reset();
    }
}

function ignoreKeyPress(ignoreIt)
{
    ignoreEnterKeyPress = ignoreIt;
}

function formKeyPress(e)
{
    // Legacy code removed. The primary button logic was added to the Frame.html.
    // Keeping method here to avoid errors in the console.
}

function searchFormKeyPress(e)
{
    e = e || window.event;

    if (e.keyCode == '13')
    {
        e.preventDefault();
        var btn = document.getElementById('search');
        if ( btn !== null )
        {
            e.stopPropagation();
            btn.focus();
            if (browser !== 'ie')
            {
                btn.click();
            }
        }
    }
}

// Lazy Load jQuery and Table Helper Library for V2 UI
// consider changing to defer
document.write("<script src='scripts/v5/jquery-1.9.0.min.js'><\/script>");
document.write("<script src='scripts/v5/ui-table-helper.js'><\/script>");
document.write("<script src='scripts/v5/navigation.js'><\/script>");
document.write("<script src='scripts/v5/jquery-ui.min.js'><\/script>");
