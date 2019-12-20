/*********************************
 * Module: Selection List Filter
 *********************************
 * Various functions for the Selection List Filter component.
 *********************************/

// global variables
var MAX_SHOWN_PER_PAGE = 50;
var tooltipOpen = false;
var currentTooltipConfig = [];
var typingTimer;
var apiCallDelay = 250;         // Make the api call 250ms after typing is finished.

var FORBIDDEN_STATUS_CODE = 403;

// This span at the end of the search results as a helper to programmatically determine when
// the search has completed.
var searchComplete = document.createElement('span');
searchComplete.id = 'search-complete';

var DetailsTooltip = (function () {

    function getChildVal(parentElement, childClass) {
        var child = $(parentElement).find(childClass);
        return $(child).val();
    }

    // gets all the tab config for a given page.
    function getTabConfiguration(hiddenVars) {
        var tabs = $(hiddenVars).find('.tab-config');
        var tabConfig = new Array(tabs.length);
        for (var i = 0; i < tabs.length; i++) {
            var tabTitle = getChildVal(tabs[i], '.tabTitle');
            var endPoint = getChildVal(tabs[i], '.endpoint');
            var displayName = getChildVal(tabs[i], '.displayNameField');
            var idField = getChildVal(tabs[i], '.idField');
            var queryParamConfig = $(hiddenVars).find('.query-params');
            var queryParams = new Array(queryParamConfig.length);
            for (var j = 0; j < queryParamConfig.length; j++) {
                var queryParam = {};
                var param = getChildVal(queryParamConfig[j], ".queryParam");
                queryParam[param] = getChildVal(queryParamConfig[j], ".queryValue");
                queryParams[j] = queryParam;
            }
            tabConfig[i] = {
                "endpoint": endPoint,
                "displayName": displayName,
                "idField": idField,
                "tabTitle": tabTitle,
                "queryParams": queryParams
            };
        }
        return tabConfig;
    }

    function configureTabs(tooltip) {
        currentTooltipConfig = getTabConfiguration($(tooltip).find('.hidden-variables'));
        var optionTabs = $(tooltip).find('.option-tab');
        var selected = $(tooltip).find('.option-container').val() ? parseInt($(tooltip).find('.option-container').val()) : 0;

        // add optionsList to tooltip
        $(tooltip).find('.option-container').attr('id', 'optionList');

        // show applicable list items and hide if there is only one list item
        if (currentTooltipConfig.length > 1) {
            for (var i = 0; i < currentTooltipConfig.length; i++) {
                optionTabs[i].textContent = currentTooltipConfig[i]['tabTitle'];
                optionTabs[i].className = 'option-tab visible';
                // check if option has already been selected
                if (i == selected) {
                    optionTabs[i].className = 'option-tab visible current';
                }
            }
        }

        // ie won't hide 'options' in a select input, need to remove
        if (optionTabs.length > 1) {
            for (var i = 0; i < optionTabs.length; i++) {
                if (optionTabs[i].textContent === 'Tab') {
                    $(optionTabs[i]).remove();
                }
            }
        }

        // don't show dropdown if only 1 option, show search in full width
        if (currentTooltipConfig.length === 1) {
            var searchArea = $(tooltip).find('.selection-list-search').addClass('full-width');
        }

        getCurrentTab(tooltip).removeClass('current-tab');
        $(tooltip).find('.tab-' + selected).addClass('current-tab');
    }

    function getCurrentTab(element) {
        return $(element).parents('.input-selection-list').find('.current-tab')
    }

    function showSpinner(searchField) {
        var selection_data = getCurrentTab(searchField).find('.selection-data');
        // only show the spinner if its not already there.
        if ($(selection_data).find('.loader').length === 0) {
            selection_data.html('');
            addSpinner(selection_data);
        }
    }

    function addSpinner(element) {
        // only show the spinner if its not already there.
        if ($(element).find('#loader-container').length === 0) {
            $(element).append('<div id="loader-container"><div class="loader"></div></div>');
        }
    }

    function removeSpinner(parent) {
        $(parent).find('#loader-container').each(function(index, element) {
            $(element).remove();
        })
    }

    function getQueryString(tabConfig, searchValue, page) {
        var params = {
            "page": page,
            "numberPerPage": MAX_SHOWN_PER_PAGE,
            "filter": searchValue
        };

        // add in the query params defined for this tooltip.
        tabConfig['queryParams'].forEach(function (param) {
            // params = Object.assign(params, param);
            var key = Object.keys(param)[0];
            params[key] = param[key];
        });

        return params;
    }

    function getCurrentTabIndex(element) {
        var index = $(element).closest('.details-tooltip').find('.option-tab.current').data('id')
        return index ? index : 0;
    }

    function displayResults(appendResultsTo, json, idField, nameField)
    {
        removeSpinner($(appendResultsTo).parent());

        if (json.items.length === 0) {
            // display message for no results
            var noResults = document.createElement('span');
            noResults.innerHTML = 'No results available.';
            noResults.className = 'no-results';
            $(appendResultsTo).append(noResults);
            $(appendResultsTo).append(searchComplete);
        }
        else {
            // loop through json, populating list items
            for (var i = 0; i < json.items.length && i < MAX_SHOWN_PER_PAGE; i++) {
                var item = json.items[i];
                var itemId = item[idField];
                var itemName = item[nameField];

                var childLabel = document.createElement('span');
                childLabel.className = 'list-item list-item-clickable';
                var idSpan = document.createElement('span');
                idSpan.className = 'list-id';
                var nameSpan = document.createElement('span');
                nameSpan.className = 'list-name';

                idSpan.innerHTML = itemId;
                nameSpan.innerHTML = itemName;

                // append values to each list item
                childLabel.appendChild(idSpan);
                childLabel.appendChild(nameSpan);

                // append list items
                $(appendResultsTo).append(childLabel);
                $(appendResultsTo).append(searchComplete);
            }
        }
    }

    function retrieveData(tabConfig, searchValue, page, success) {
        $.ajax({
            url: tabConfig['endpoint'],
            contentType: 'application/json',
            data: getQueryString(tabConfig, searchValue, page),
            headers: {
                'X-XSRF-Header': 'PingFederate',
                'Authorization': 'Bearer ' + accessTokenId
            }
        })
            .success(function (data) {
                success(data);
            })
            .error(function (jqXHR, textStatus, errorThrown) {
                // stop data retrieval if receiving http 403 status code
                if (jqXHR.status == FORBIDDEN_STATUS_CODE) {
                    success({items: [], length: 0})
                }
                else {
                    retrieveAccessToken(function(token){
                        accessTokenId = token;
                        retrieveData(tabConfig, searchValue, page, success);
                    });
                }
            })
    }

    var page = 1;
    var noMorePages = false;

    function getMoreResults(searchField, completedCallback) {
        page++;
        var searchValue = $(searchField).val();
        var tabIndex = getCurrentTabIndex(searchField);
        var tabConfig = currentTooltipConfig[tabIndex];

        var currentTab = getCurrentTab(searchField);
        var list = $(currentTab).find('.list-items-container');

        if (!noMorePages) {
            addSpinner(list);

            retrieveData(tabConfig, searchValue, page, function (results) {
                if (results.items.length === 0) {
                    noMorePages = true;
                    removeSpinner(list);
                }
                else {
                    displayResults(list[0], results, tabConfig['idField'], tabConfig['displayName']);
                }
                completedCallback();
            });
        } else {
            completedCallback();
        }
    }

    function getResults(searchField) {
        page = 1; // Reset page variable since filter has changed.
        noMorePages = false;
        var searchValue = $(searchField).val();
        var tabIndex = getCurrentTabIndex(searchField);
        var tabConfig = currentTooltipConfig[tabIndex];

        showSpinner(searchField);

        retrieveData(tabConfig, searchValue, 1, function(results){
            // clear previous data for all tabs content areas
            var list = $(searchField).parents('.input-selection-list');
            var contentAreas = $(list).find('.selection-data');
            for (var i = 0; i < contentAreas.length; i++) {
                contentAreas[i].innerHTML = '';
            }
            var parentDiv = document.createElement('span');
            parentDiv.className = 'list-items-container';

            var listItems = '.tab' + tabIndex + 'Items';
            var itemList = list.find(listItems);
            $(itemList).append(parentDiv);

            displayResults(parentDiv, results, tabConfig['idField'], tabConfig['displayName']);
        });
    }

    // api token
    var accessTokenId = 'fakeId';
    function retrieveAccessToken(callback) {
        $.post( '/pingfederate/app?service=apitoken', function(data) {
            callback(data.access_token);
        })
            .error(function () {
                window.location.reload(true);
                return undefined;
            })
    }

    function hideTooltip() {
        $(".details-tooltip").removeClass('show');
        tooltipOpen = false;
        $('.selection-container').removeClass('extra-height');
        // remove instances of id="optionList"
        $('.details-tooltip').find('.option-container').removeAttr('id');
    }

    return {
        init: function () {
            // toggle tooltip for specific dropdown
            $('.filter-container').click(function (e) {
                e.preventDefault();
                e.stopPropagation();

                var tooltipElement = $(this).parents('.details-tooltip');
                if (!tooltipOpen && !tooltipElement.hasClass('disabled')) {
                    tooltipElement.addClass('show');
                    tooltipOpen = true;
                    
                    var selectionContainer = tooltipElement.closest('.selection-container');
                    selectionContainer.addClass('extra-height');

                    // If it is off the edge of the container, scroll horizontally to bring into view.
                    var endOfFilterPosition = tooltipElement.offset().left + 500;
                    var edgeOfContainer = selectionContainer.offset().left + selectionContainer.width();
                    var isOffRightScreen = endOfFilterPosition > edgeOfContainer;

                    var startOfFilterPosition = tooltipElement.offset().left;
                    var startOfContainer = selectionContainer.offset().left;
                    var isOffLeftScreen = startOfFilterPosition < startOfContainer;

                    if(!(isOffLeftScreen && isOffRightScreen)) {
                        var pixelsToScroll = 0;
                        if(isOffLeftScreen)
                            pixelsToScroll = startOfFilterPosition - startOfContainer;

                        if(isOffRightScreen)
                            pixelsToScroll = endOfFilterPosition - edgeOfContainer;

                        selectionContainer.animate({
                            scrollLeft: selectionContainer.scrollLeft() + pixelsToScroll
                        });
                    }

                    // show applicable number of tabs for specific dropdown
                    configureTabs(tooltipElement);
                    var search_input = $(tooltipElement).find('.details-search-display');
                    $(search_input).val('');

                    var contentAreas = $(tooltipElement).find('.selection-data');
                    for (var i = 0; i < contentAreas.length; i++) {
                        contentAreas[i].innerHTML = '';
                    }

                    $(search_input).focus();
                    getResults(search_input);
                }
                else {
                    // close it if the input was clicked again.
                    hideTooltip();
                }
            });

            // remove tooltip if clicked outside the box.
            $(document).click(function (event) {
                if ($(event.target).parents(".details-content").length === 0) {
                    hideTooltip();
                }
            });

            // allow for disabled elements on the page to hide the tooltip
            $('.disabled').click(function (event) {
                if ($(event.target).parents(".details-content").length === 0) {
                    hideTooltip();
                }
            });

            // choose current tab
            $('.option-container').change(function(e) {
                e.preventDefault();
                e.stopPropagation();
                var tabId = $(this).val();

                $(this).parents('.selection-options').find('.current').removeClass('current');
                getCurrentTab(this).removeClass('current-tab');

                $(".option-container option:selected").addClass('current');

                $(this).parents('.input-selection-list').find('.tab-' + tabId).addClass('current-tab');
                var search_input = $(this).parents('.details-tooltip').find('.details-search-display');

                getResults(search_input);
            });

            // select an option
            $('.input-selection-list-items').delegate('.list-item-clickable', 'click', function (e) {
                var value = $(this).find('.list-name').text();
                var id = $(this).find('.list-id').text();
                var tabIndex = getCurrentTabIndex(this);

                $(this).parents('.details-tooltip').find('.details-search').val(value);
                var type = currentTooltipConfig[tabIndex]['tabTitle'];
                $(this).parents('.details-tooltip').find('.details-search-id').val(type + "-" + id);
                hideTooltip();
                // for tapestry's sake, update server side
                $("#wrapperForm").submit();
            });

            // prevent the enter key from submitting the page while the selection box is open.
            $(document).keydown(function(e) {
                if(e.keyCode === 13 && tooltipOpen) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            // get matching data.
            $('.details-search-display').on('input', function(event) {
                event.preventDefault();
                clearTimeout(typingTimer);
                var searchField = event.target;
                showSpinner(searchField);

                typingTimer = setTimeout(function () {
                    getResults(searchField);
                }, apiCallDelay);
            });

            var moreResultsInProgress = false;
            // get more results if reaching the bottom of the selection.
            $('.input-selection-list-items').on('scroll', function() {
                if ($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight - 25)) {
                    if(!moreResultsInProgress) {
                        moreResultsInProgress = true;
                        var searchField = $(this).parents('.input-selection-list').find('.details-search-display');
                        getMoreResults(searchField, function () {
                            moreResultsInProgress = false;
                        });
                    }
                }
            });
        }
    };
})();

// IE11 Will treat placeholder text as a value in the input field. So when focusing on the search field
// an API call is triggered since the "value" changed when really only the placeholder text was removed.
//
// To get around this behavior we won't have any placeholder text in IE11
function removePlaceHolderTextForIE11() {
    $(".details-search-display").each(function() {
        $(this).removeAttr("placeholder");
    })
}

$(document).ready(function () {
    if ($('.details-tooltip').length > 0) {
        if(navigator.userAgent.match(/Trident\/7\./)) {
            removePlaceHolderTextForIE11();
        }

        DetailsTooltip.init();
    }
});
