/********************************************************************
 *                        auto-scroll.js                            *
 ********************************************************************
 * Including this file will enable auto scrolling on the page that  *
 * it is included in. When the same page is reloaded this will      *
 * automatically scroll back to where the user was on the page.     *
 ********************************************************************
 * Dependencies: jQuery - Requires jQuery to be preloaded.          *
 ********************************************************************/


var AutoScroll = (function() {
    var page_id_key = 'pf-page-id';
    var page_location_y = 'pf-page-loc-y';
    var page_location_x = 'pf-page-loc-x';

    var vertical = "html,body";
    var horizontal = "div#content-container";

    function getTaskletId()
    {
        return $("[name='taskletStateId']").val();
    }

    function saveLocation()
    {
        localStorage.setItem(page_id_key, getTaskletId());
        localStorage.setItem(page_location_y, $(vertical).scrollTop());
        localStorage.setItem(page_location_x, $(horizontal).scrollLeft());
    }

    function clearLocation()
    {
        localStorage.removeItem(page_id_key);
        localStorage.removeItem(page_location_y);
        localStorage.removeItem(page_location_x);
    }

    function autoScroll()
    {
        // Only scroll if we are on the same page and there is no error message at the top of the page
        if($('.errortext').length == 0 && localStorage[page_id_key] == getTaskletId()){
            $(vertical).animate({ scrollTop: localStorage[page_location_y] }, 5);
            $(horizontal).scrollLeft(localStorage[page_location_x]);
        }
        clearLocation();
    }

    return {
        init: function (verticalElement, horizontalElement) {
            if(horizontalElement) horizontal = horizontalElement;
            if(verticalElement) vertical = verticalElement;

            $(window).load(function() {
                autoScroll();
            });

            $(window).unload(function() {
                saveLocation();
            });
        }
    };
 })();

function isLocalStorageSupported() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

if(isLocalStorageSupported())
{
    AutoScroll.init();
}