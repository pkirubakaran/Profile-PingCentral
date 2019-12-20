/*********************************
 * ui-table-helper.js Version 1.1
 *********************************
 * Apply classes to all table cells on document ready
 * to allow UI changes without modifying markup.
 * Move elements to allow for styling.
 * Remove some inline styles and un-needed elements.
 * Apply classes and remove image tags to allow for
 * background images.
 *********************************
 * Uses jQuery 1.9.0
 *********************************
 * Copyright (c) 2013, Faction Media, All Rights Reserved.
 *********************************/

// document ready
$(document).ready(function(){

    // hide body to hide dom modification
    $('body').hide();

    // apply identifier classes to all tables
    TableHelper.applyClassesToTables();

    // move app into container div to allow for desired background styling
    TableHelper.appTableContainerFix();

    // gets number of portal columns and applies classes to outer columns if needed
    // TableHelper.applyPortalColumnFix();

    // apply identifier classes to all portal links with small tags and images
    TableHelper.applyClassesToPortalLinks();

    // remove inline attributes
    TableHelper.removeInlineAttributes();

    // work with line breaks to convert text to ul
    TableHelper.footerLineBreakFix();

    // hide footer buttons element if no buttons present
    TableHelper.applyFooterButtonFix();

    // remove unwanted hard-coded tags
    TableHelper.removeUnwantedTags();

    // fix breadcrumbs by removing all but anchors and spans
    TableHelper.applyBreadcrumbsFix();

    // fix summary table by applying class to subtasklet rows
    TableHelper.applySummaryTableFix();

    // fix interior content buttons by moving them into a container div
    TableHelper.applyInteriorContentButtonFix();

    // fix messagetext and warntext containers
    TableHelper.applyMessageAndWarnTextFix();
});

$(window).load(function(){
    // show app
    var body = $('body');
    body.show();
    body.append("<div id='end-of-page'></div>");
    WrappingHelper.fixInteriorContentButtonWrapping();
});

$(window).resize(function(){
    WrappingHelper.fixInteriorContentButtonWrapping();
});

WrappingHelper = {
    fixInteriorContentButtonWrapping: function() {
        var interiorContentButtons = $('#interior-content-buttons').find('input');
        if(interiorContentButtons.length > 0)
        {
            var top = interiorContentButtons.first().offset().top;
            interiorContentButtons.removeClass('margin-top');
            interiorContentButtons.each( function(i,e) {
                if($(this).offset().top > top)
                {
                    $(this).addClass('margin-top');
                }
            });
        }
    }
}

// TableHelper Prototype
TableHelper = {
    wrapper: null,
    header: null,
    content: null,
    footer: null,
    login: null,

    // TableHelper.applyClassesToTables
    // apply unique identifier class to all tables
    // params:
    // return:
    applyClassesToTables: function() {
        // get all tables and iterate
        var tables = $('table');
        $.each(tables, function(t, table) {
            // add identifier class
            $(table).addClass('ui-table-' + t);

            // add classes to all table rows and cells
            TableHelper.applyClassesToTableCells(table);
        });
    },

    // TableHelper.applyClassesToTableCells
    // apply unique identifier class to all table rows and cells
    // params: (object)table
    // return:
    applyClassesToTableCells: function(table) {
        // get all rows and iterate
        var rows = $(table).children('tbody').children('tr');
        var nobanding = table.classList && table.classList.contains('nobanding');
        $.each(rows, function(r, row){
            // add identifier class
            $(row).addClass('ui-row-' + r);

            // add even class
            if (r%2 === 0 && !nobanding)
            {
                $(row).addClass('even');
            }

            // get all child cells and iterate
            var cells = $(row).children('td');
            $.each(cells, function(c, cell) {
                //add identifier class
                $(cell).addClass('ui-cell-' + c);
            });
        });
    },

    // TableHelper.appTableContainerFix
    // create containers for major sections of app, move sections into
    // newly created containers, and delete unwanted elements
    // params:
    // return:
    appTableContainerFix: function() {

        // create new layout framework
        if ($('form').length === 0)
        {
            $('<form />').appendTo('body');
        }
        TableHelper.wrapper = $('<div id="wrapper" />').appendTo('form');
        TableHelper.header = $('<div id="header-container"><table border="0" cellpadding="0" cellspacing="0" width="100%"></table></div>').appendTo(TableHelper.wrapper);
        TableHelper.login = $('<div id="login"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="login-table"></table></div>').appendTo(TableHelper.wrapper);
        TableHelper.footer = $('<div id="footer-container"><div class="inner"><table border="0" cellpadding="0" cellspacing="0" width="100%"></table></div></div>').appendTo('form');

        // if login page, kill method and apply login table container fix
        if ($('table.logincontainer').length !== 0)
        {
            TableHelper.loginTableContainerFix();
            return;
        }
        else {
            // #login container only needed on login page
            $('#wrapper').find('#login').remove();
        }

        // create new layout framework items that aren't neccessary for the login page
        TableHelper.content = $('<div id="content-container" class="selection-container"><table border="0" cellpadding="0" cellspacing="0" width="100%"></table><div id="interior-content-buttons"></div></div>').appendTo(TableHelper.wrapper);

        // remove padding cells
        $('table.structure > tbody').children('tr').each(function(i, row){
            $(row).children('td.ui-cell-0').remove();
            $(row).children('td.ui-cell-2').remove();
        });

        // move header
        $('table.structure > tbody > tr.ui-row-0').appendTo(TableHelper.header.children('table'));
        $('table.structure > tbody > tr.ui-row-1').appendTo(TableHelper.header.children('table'));

        // check for messagetext area
        if ($('table.structure > tbody > tr.ui-row-5').length !== 0)
        {
            // move header
            $('table.structure > tbody > tr.ui-row-3 > td.ui-cell-1 > table.ui-table-1').appendTo(TableHelper.header).find('td.ui-cell-0').remove();
            $('table.structure > tbody > tr.ui-row-3 > td.ui-cell-1 > table.ui-table-1').remove();

            // move content
            $('table.structure > tbody > tr.ui-row-2').appendTo(TableHelper.content.children('table'));
            $('table.structure > tbody > tr.ui-row-3').appendTo(TableHelper.content.children('table'));

            // move footer
            $('table.structure > tbody > tr.ui-row-4').appendTo(TableHelper.footer.children('.inner').children('table'));
            $('table.structure > tbody > tr.ui-row-5').appendTo(TableHelper.footer.children('.inner').children('table'));
        }
        else
        {
            // move header
            $('table.structure > tbody > tr.ui-row-2 > td.ui-cell-1 > table.ui-table-1').appendTo(TableHelper.header).find('td.ui-cell-0').remove();
            $('table.structure > tbody > tr.ui-row-2 > td.ui-cell-1 > table.ui-table-1').remove();

            // move content
            $('table.structure > tbody > tr.ui-row-2').appendTo(TableHelper.content.children('table'));

            // move footer
            $('table.structure > tbody > tr.ui-row-3').appendTo(TableHelper.footer.children('.inner').children('table'));
            $('table.structure > tbody > tr.ui-row-4').appendTo(TableHelper.footer.children('.inner').children('table'));
        }

        // destroy structure table
        $('table.structure').remove();
    },

    // TableHelper.loginTableContainerFix
    // move login/exception elements into container for styling,
    // show error container if errors exist, delete unwanted elements
    // params:
    // return:
    loginTableContainerFix: function() {
        // login
        if ($('#formLoginRow').length !== 0)
        {
            $('body').addClass('login-body');
            $('#formLoginRow > td.ui-cell-0').appendTo(TableHelper.login.children('table'));
        }
        // exception
        else
        {
            $('body').addClass('login-body');
            $('table.logincontainer > tbody > tr.ui-row-1').appendTo(TableHelper.login.children('table'));
            $('table.logincontainer > tbody > tr.ui-row-2').appendTo(TableHelper.login.children('table'));
        }

        // import license
        if ($('td.login_license_import_left').length !== 0)
        {
            $('body').addClass('import-license-body');

            // get warning message, if exists
            var warning_message = TableHelper.login.find('tr.ui-row-1').first().children('td.ui-cell-0').children('div');
            if(warning_message.length !== 0)
            {
                // get warning message text
                var warning_message_text = warning_message.html();

                // remove row where message was
                warning_message.closest('tr').remove();

                // adjust next row class name
                $('table.login-table > tbody > tr.ui-row-2').removeClass('ui-row-2 even').addClass('ui-row-1');

                // move the warning message after the h1 tag
                $('<div class="warntext">' + warning_message_text + '</div>').insertAfter('#login h1.login');
            }
        }

        // move error message
        var error_message_container = $('#errorMessageDiv');
        error_message_container.insertAfter('div#login h1');
        if (error_message_container.text().length > 3)
        {
            error_message_container.show();
        }

        // move header
        $('table.logincontainer').appendTo(TableHelper.header);

        // move footer
        $('table.ui-table-2 > tbody > tr.ui-row-0').appendTo(TableHelper.footer.children('.inner').children('table'));

        // remove left over tables
        $('center').remove();
    },

    // TableHelper.applyPortalColumnFix
    // gets number of portal columns and applies classes to outer columns if needed
    // params:
    // return:
    applyPortalColumnFix: function() {
        // get portal columns
        var portal_columns = $('table.portal > tbody > tr.ui-row-1 > td');

        // if 4 columns found, apply classes to the outer columns for vertical striping
        if (portal_columns.length === 4)
        {
            $(portal_columns[0]).addClass('portal-column-outer');
            $(portal_columns[3]).addClass('portal-column-outer');
        }
    },

    // TableHelper.applyClassesToPortalLinks
    // apply classes to portal links with small tags wrapping anchors and remove
    // all elements aside from small tags and anchors to use backgrounds instead
    // of img tags
    // params:
    // return:
    applyClassesToPortalLinks: function() {
        // get all portal links and iterate
        var portal_links = $('.portal_link');
        $.each(portal_links, function(i, link) {
            // get all small tags within portal link
            var small_tags = $(link).children('small');
            if (small_tags.length !== 0)
            {
                // iterate through each
                $.each(small_tags, function(i, small_tag)
                {
                    // get all anchors
                    var anchors = $(small_tag).children('a');

                    // append arrow and small classes
                    anchors.addClass('arrow').addClass('small');

                    // append only anchors back into small tag
                    $(small_tag).html(anchors);
                });

            // append only small tags back into link
            $(link).html(small_tags);
            }
        });
    },

    // TableHelper.footerLineBreakFix
    // refactor layout of footer version information using unordered lists
    // rather than line breaks
    // params:
    // return:
    footerLineBreakFix: function() {
        // get footer markup containers that need to be reworked and iterate through each
        var version_container_array = $('#footer-container td.version, #footer-container td.loginversion');
        $.each(version_container_array, function(i, container) {
            // get container markup
            var markup = $(container).html();

            // split markup by line break and remove empty arrays using clean
            var markup_array = markup.split(/<br[^>]*>/gi);

            //validate markup array length
            if (markup_array.length !== 0)
            {
                // join markup by li
                var markup = TableHelper.joinArrayToListItemsWithClasses(markup_array);

                // place new markup into container
                $(container).html('<ul class="footer-list list-' + i + '">' + markup + '</ul>');
            }
            // else place original markup back into container
            else
            {
                $(container).html(markup);
            }
        });
    },

    // TableHelper.removeUnwantedTags
    // remove unwanted tags such as br and &nbsp;
    // params:
    // return:
    removeUnwantedTags: function() {
        // line breaks
        $('table.portal br').remove();
        $('div.footer-container br').remove();

        // inline styling in interior table
        $('table.interior div').removeAttr('style');

        // remove &nbsp; from messagetext content
        if ($('div.messagetext').length !== 0)
        {
            $('div.messagetext').each(function() {
                var $msgtxt = $(this);
                $msgtxt.html($msgtxt.html().replace(/&nbsp;/g, ''));
            });
        }

        // remove &nbsp; from banner content
        if ($('div.banner div').length !== 0)
        {
            $('div.banner div').html($('div.banner div').html().replace(/&nbsp;/g, ''));
        }
    },

    // TableHelper.removeInlineAttributes
    // remove inline styles
    // params:
    // return:
    removeInlineAttributes: function() {
        // remove height attribute
        $('table, tr, td, div').removeAttr('height');
    },

    // TableHelper.applyBreadcrumbsFix
    // get all anchors and spans from breadcrumbs container, empty breadcrumbs,
    // and append elements back into clean breadcrumbs container
    // params:
    // return:
    applyBreadcrumbsFix: function() {
        // get anchors and spans
        var elements = $('div.breadcrumbs a, div.breadcrumbs span');

        // empty breadcrumbs
        $('div.breadcrumbs').empty();

        // append elements back into breadcrumbs container
        elements.appendTo($('div.breadcrumbs'));
    },

    // TableHelper.applySummaryTableFix
    // remove accordion controls, add class to parent row of tasklet cells,
    // add class to parent row of subtasklet cells
    // params:
    // return:
    applySummaryTableFix: function() {
        // get all tasklets
        var tasklets = $('table.summary td.tasklet');

        // iterate through each and remove accordion control
        $.each(tasklets, function(i, tasklet) {
            // remove image
            $(tasklet).children('a').children('img').remove();

            // get link text
            var text = $(tasklet).children('a').text();

            // if anchor text found, remove anchor and append text
            if (text.length !== 0)
            {
                // remove link
                $(tasklet).children('a').remove();

                // append link text back into tasklet cell
                $(tasklet).text(text);
            }

            // apply class to parent
            $(tasklet).parent().addClass('row-tasklet');
        });

        // get all subtasklets
        var subtasklets = $('table.summary td.subtasklet');

        // iterate through each and apply class to parent
        $.each(subtasklets, function(i, subtasklet) {
            $(subtasklet).parent().addClass('row-subtasklet');
        });
    },

    // TableHelper.applyInteriorContentButtonFix
    // if buttons found, move to newly created interior-content-buttons container,
    // otherwise apply no-interior-buttons class to content-container
    //
    // NOTE:
    // If you do not want the interior buttons to be moved around, simple add the class ".ignore-content-button-fix" to
    // the row you do now want to be touched.
    // params:
    // return:
    applyInteriorContentButtonFix: function() {
        // get all interior content buttons
        var buttons = $('table.interior tr').not('.ignore-content-button-fix').last().find('input[type="submit"]');
        var unwanted = $('table.interior tr').last().find('input[type="text"], input[type="radio"], input[type="file"], select');

        // if no buttons found, apply class to content-container to remove certain button container styles
        if (buttons.length === 0 || unwanted.length !== 0)
        {
            $('#content-container').addClass('no-interior-buttons');
            return;
        }
        else
        {
            // get buttons and spans
            buttons = $('table.interior tr').last().find('td').contents();

            // move to container
            $('#interior-content-buttons').html(buttons);

            // apply margin class to last button
            $('#interior-content-buttons').find('input').last().addClass('default margin-right');

            // remove row where they were moved from
            $('table.interior tr').last().remove();
        }
    },

    // TableHelper.applyMessageAndWarnTextFix
    // remove padding from warningtext parent container,
    // remove images, hide if empty
    // params:
    // return:
    applyMessageAndWarnTextFix: function() {
        // remove padding from parent
        $('div.warntext').parent().css('padding', '0px');

        // remove images
        $('div.messagetext img').remove();
        $('div.warntext img').remove();

        // hide if empty
        if ($('div.messagetext').length !== 0 && $('div.messagetext').html().length < 10)
        {
            $('div.messagetext').hide();
        }
        if ($('div.warntext	').length !== 0 && $('div.warntext').html().length < 10)
        {
            $('div.warntext').hide();
        }
    },

    // TableHelper.applyFooterButtonFix
    // hide footer buttons element if no buttons present
    // params:
    // return:
    applyFooterButtonFix: function() {
        var footer_buttons = TableHelper.footer.find('div.buttons input, button');
        if (footer_buttons.length === 0)
        {
            TableHelper.footer.find('div.buttons').hide();
        }
    },

    // TableHelper.joinArrayToListItemsWithClasses
    // place each array item into list item element with item number class
    // params: (array)markup_array
    // return: (string)markup
    joinArrayToListItemsWithClasses: function(markup_array)
    {
        // validate markup array is not null and has length
        if (typeof markup_array == 'undefined' || markup_array.length === 0)
        {
            return markup_array;
        }

        // iterate through array to create markup
        var markup = '';
        for (var i = 0, l = markup_array.length; i < l; i++)
        {
            //add to markup if cell value not empty
            if (String(markup_array[i]).length > 0)
            {
                markup += '<li class="item-' + i + '">' + markup_array[i] + '</li>';
            }
        }
        return markup;
    }
};
