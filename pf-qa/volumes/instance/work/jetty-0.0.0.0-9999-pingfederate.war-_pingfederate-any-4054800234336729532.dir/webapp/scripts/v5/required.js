/*********************************
* required.js Version 1.1
*********************************/

$(document).ready(function() {
    // check required inputs onload for when a select causes a page to be reloaded
    $(':input[type=text], :input[type=password], textarea').filter(function(index) {
        return $(this).val() !== '' && $(this).parent().hasClass('required');
    }).parent().removeClass('required').addClass('was-required');
    $('select').filter(function(index) {
        return  $(this).parent().parent().hasClass('required') && ($(this).val() !== '0' && $(this).val() !== '');
    }).parent().parent().removeClass('required').addClass('was-required');
    $(':checkbox').filter(function(index) {
        return  $(this).parent().parent().parent().hasClass('required') && $(this).is(':checked');
    }).parent().parent().parent().removeClass('required').addClass('was-required');
    // selection filter list has a different dom
    $(':input[type=text]').filter(function(index) {
        return $(this).val() !== '' && $(this).parent().parent().hasClass('required');
    }).parent().parent().removeClass('required').addClass('was-required');

    // check required inputs on a page during interaction
    $(':input[type=text], :input[type=password], textarea').keyup(function() {
        if ($(this).val() !== '') {
            if ($(this).parent().hasClass('required')) {
                // add 'was-required' to mark input if end user later
                // deletes the input values, need to re-mark as required
                $(this).parent().removeClass('required').addClass('was-required');
            }
        }
        else {
            if ($(this).parent().hasClass('was-required')) {
                $(this).parent().removeClass('was-required').addClass('required');
            }
        }
    });
    $('select').change(function() {
        if ($(this).val() !== '0' && $(this).val() !== '') {
            if ($(this).parent().parent().hasClass('required')) {
                // add 'was-required' to mark input if end user later
                // deletes the input values, need to re-mark as required
                $(this).parent().parent().removeClass('required').addClass('was-required');
            }
        }
        else {
            if ($(this).parent().parent().hasClass('was-required')) {
                $(this).parent().parent().removeClass('was-required').addClass('required');
            }
        }
    });
    $('checkbox').on('click', function() {
        if ($(this).is(':checked')) {
            if ($(this).parent().parent().parent().hasClass('required')) {
                // add 'was-required' to mark input if end user later
                // deletes the input values, need to re-mark as required
                $(this).parent().parent().parent().removeClass('required').addClass('was-required');
            }
        }
        else {
            if ($(this).parent().parent().parent().hasClass('was-required')) {
                $(this).parent().parent().parent().removeClass('was-required').addClass('required');
            }
        }
    });
    // selection filters have a different dom structure
    $(':input[type=text]').change(function() {
        if ($(this).parent().hasClass('filter-container')) {
            if ($(this).val() !== '') {
                if ($(this).parent().parent().hasClass('required')) {
                    // add 'was-required' to mark input if end user later
                    // deletes the input values, need to re-mark as required
                    $(this).parent().parent().removeClass('required').addClass('was-required');
                }
            }
            else {
                if ($(this).parent().parent().hasClass('was-required')) {
                    $(this).parent().parent().removeClass('was-required').addClass('required');
                }
            }
        }
    });
});
