/*********************************
 * navigation.js Version 1.1
 *********************************/
$(document).ready(function(){
    
    // nav logic
    var $nav = $('#nav'),
        $navItem = '',
        $hdrIdp = $('.portal-header-idp'),
        $hdrSystem = $('.portal-header-system'),
        $hdrSecurity = $('.portal-header-security'),
        $hdrSp = $('.portal-header-sp'),
        $hdrOauth = $('.portal-header-oauth'),
        $portal = $('.portal');
        
    // remove inline styles, rewrite once new classes added
    $hdrIdp.removeAttr('style').find('h2').removeAttr('style');
    $hdrSystem.removeAttr('style').find('h2').removeAttr('style');
    $hdrSecurity.removeAttr('style').find('h2').removeAttr('style');
    $hdrSp.removeAttr('style').find('h2').removeAttr('style');
    $hdrOauth.removeAttr('style').find('h2').removeAttr('style');
    $portal.find('td').removeAttr('width');
    
    // TODO: consider local storage rather than main links
    displayDirectory(readCookie('pf-directory'));
    
    // check cookie, on first load, display most recent nav   
    function displayDirectory(dir) {
        var $directory = $('#content-container');
        
        // clean up, add class 'active'
        $directory.find('td').removeClass('active');
        $nav.find('li').removeClass('selected');
            
        var $colIdp = $('.column-idp'),
            $colSystem = $('.column-system'),
            $colSecurity = $('.column-security'),
            $colOauth = $('.column-oauth'),
            $colSp = $('.column-sp'),
            $navIdp = $('.nav-idp'),
            $navSystem = $('.nav-system'),
            $navSecurity = $('.nav-security'),
            $navOauth = $('.nav-oauth'),
            $navSp = $('.nav-sp');

            if (dir === 'system' && $navSystem.length > 0) {
                $hdrSystem.addClass('active');
                $colSystem.removeAttr('style').addClass('active');
                $navSystem.addClass('selected');
            }
            else if (dir === 'security' && $navSecurity.length > 0) {
                $hdrSecurity.addClass('active');
                $colSecurity.removeAttr('style').addClass('active');
                $navSecurity.addClass('selected');
            }
            else if (dir === 'sp' && $navSp.length > 0) {
                $hdrSp.addClass('active');
                $colSp.removeAttr('style').addClass('active');
                $navSp.addClass('selected');
            }
            else if (dir === 'oauth' && $navOauth.length > 0) {
                $hdrOauth.addClass('active');
                $colOauth.removeAttr('style').addClass('active');
                $navOauth.addClass('selected');
            }
            else if (dir === 'idp' && $navIdp.length > 0) {
                // default
                $hdrIdp.addClass('active');
                $colIdp.removeAttr('style').addClass('active');
                $navIdp.addClass('selected');
            }
            else {
                // default : choose first item in left nav
                if ($navIdp.length > 0) {
                    displayDirectory('idp');
                }
                else if ($navSp.length > 0) {
                    displayDirectory('sp');
                }
                else if ($navOauth.length > 0) {
                    displayDirectory('oauth');
                }
                else {
                    $hdrSystem.addClass('active');
                    $colSystem.removeAttr('style').addClass('active');
                    $navSystem.addClass('selected');
                }
            }
    }

    $nav.find('a').on('click', function(){
        var $this = $(this);
        $navItem = $(this).data('nav');
        // set cookie
        createCookie('pf-directory', $navItem, 7); 
    });
    
    // CHECKBOX DISPLAY LOGIC
    checkChecked();
    $('input[type=checkbox]').on('click', checkChecked);
    function checkChecked() {
        var $inputCheckbox = $('.input-checkbox').find('.checkbox-group');
        if ($inputCheckbox.length > 0) {
            $inputCheckbox.each(function(index) {
                $(this).find('input:checked').parent().parent().find('.icon').addClass('checked');
                $(this).find('input:disabled').parent().parent().addClass('disabled').find('.icon').addClass('disabled');
            });
        }
    }
    
    // RADIO BUTTON DISPLAY LOGIC
    checkRadios();
    $('input[type=radio]').on('click', checkRadios);
    function checkRadios() {
        var $inputRadio = $('.input-radio').find('.radio-group');
        if ($inputRadio.length > 0) {
            $inputRadio.each(function(index) {
                $(this).find('input:checked').parent().parent().find('.circle').addClass('checked');
                $(this).find('input:disabled').parent().parent().addClass('disabled').find('.circle').addClass('disabled');
            });
        }
    }
    
    // MOVE HIDDEN INPUT FOR FORMS CONTAINING ANY SUBMIT
    checkAnySubmit();
    function checkAnySubmit() {
        $('#hidden-link').detach().prependTo('#content-container');
    }

    // REMOVE REQUIRED INDICATOR ON DISABLED INPUTS LOGIC
    checkRequired();
    function checkRequired() {
        var $inputRequired = $('.input-text.required');
        if ($inputRequired.length > 0) {
            $inputRequired.each(function(index) {
                $(this).find('input:disabled').parent().removeClass('required');
            });
        }
    }
    
    // ADD DISABLED CLASS TO RADIO BUTTONS AND CHECKBOXES THAT ARE DISABLED
    checkDisabled();
    function checkDisabled() {
        var $radioButtons = $('.input-radio');
        if ($radioButtons.length > 0) {
            $radioButtons.each(function(index) {
                $(this).find('input:disabled').parent().addClass('disabled');
            });
        }
        var $checkBoxes = $('.input-checkbox');
        if ($checkBoxes.length > 0) {
            $checkBoxes.each(function(index) {
                $(this).find('input:disabled').parent().addClass('disabled');
            });
        }
    }    
    
    // HIDE SINGLE SECONDARY NAV ITEMS (BREADCRUMBS) WHEN PRIMARY NAV (HEADCRUMBS) ARE SAME
    checkSingleNavigation();
    function checkSingleNavigation() {
        var $breadCrumbsSpan = $('.breadcrumbs').find('span');
        var $breadCrumbsAnchor = $('.breadcrumbs').find('a');
        var $breadCrumbsCant = $('.breadcrumbs').find('.cant');
        var $headCrumbs = $('.headcrumbs').find('a');
        // main link is hidden, but still counts as one for length
        if ($headCrumbs.length === 2 && 
            $breadCrumbsAnchor.length === 0 &&
            $breadCrumbsCant.length === 0) {
            // hide single secondary nav item
            $breadCrumbsSpan.hide();
        }
    }
    
    // COOKIE: CREATE, READ, ERASE
    function createCookie(name, value, days) {
        var date = '',
            expires = '';
        if (days) {
            date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        else expires = '';
        document.cookie = name+"="+value+expires+"; path=/;";
    }
    function readCookie(name) {
        var nameEQ = name + '=',
            ca = '';

        if (null !== document.cookie.split(';')) {
            ca = document.cookie.split(';');
        }
        if (ca !== '') {
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length,c.length);
                }
            }
        }
        return null;
    }
    function eraseCookie(name) {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        var expires = "; expires="+d;
        createCookie(name, '', -1);
    }
});
