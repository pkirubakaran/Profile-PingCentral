/**
 * We will not see the response when downloading an element. So show a loader check every 250ms to see if the cookie
 * pf-download-started is set. Then remove the cookie and the spinners since the downloads are finished. As a safe
 * guard, this will only run for 10 minutes maximum to allow for a server response.
 */
function handleDownload(element) {
    addLoader(element);
    var retries = 0;
    var max_retries = 7200; // remove after 30 minutes something server side probably went wrong.

    var timer = setInterval(function(){
        if(Cookies.get('pf-download-started') || retries===max_retries) {
            Cookies.remove('pf-download-started', { path: '/' });
            removeLoader();
            clearInterval(timer);
        }
        retries++;
    }, 250);
}

/**
 * Removes all the loader objects on the page.
 */
function removeLoader() {
    $(".loader").remove();
}

/**
 * Add the loader to the end of the parent of the element passed in after 250ms.
 */
function addLoader(element) {
    setTimeout(function(){
        $(element).parent().append("<div class=\"loader\"></div>");
    }, 250);
}