// Code for initializing the jQuery UI tooltips. For the inline help icons we need to position the tooltip differently.
// So override the location for classes with the help icon.

$(document).ready(function (){
    // Default
    $(document).tooltip({
        tooltipClass: "tooltip",
        show: { delay: 500 },
        close: function( evt, ui ) {
            ui.tooltip.hover(
                function () {
                    $(this).stop(true).fadeTo(250, 1);
                },
                function () {
                    $(this).fadeOut("250", function(){
                        $(this).remove();
                    })
                }
            );
        }
    });

    // Toggle override
    $('.toggle-tooltip').tooltip({
        tooltipClass: "tooltip",
        show: { delay: 500 },
        position: {
            my: "left-12 top+13",
            at: "left bottom",
            using: function( obj, info ) {
                // Set this element's position as passed in via 'obj'
                $(this).css({
                    left: obj.left,
                    top: obj.top
                });
                $(this).removeClass("right-arrow");
                $(this).removeClass("left-arrow");
                // Determine if the tooltip was flipped
                // due to collision detection with screen edge
                // set the arrow class to show arrow on left or
                // right of the tooltip
                if( (info.target.left - obj.left) > 21 ) {
                    $(this).addClass("right-arrow");
                }
                else {
                    $(this).addClass("left-arrow");
                }
            }
        },
        close: function( evt, ui ) {
            ui.tooltip.hover(
                function () {
                    $(this).stop(true).fadeTo(250, 1);
                },
                function () {
                    $(this).fadeOut("250", function(){
                        $(this).remove();
                    })
                }
            );
        }
    });

    // Help text override
    $('.icon-help').tooltip({
        tooltipClass: "tooltip",
        show: { delay: 500 },
        position: {
            my: "left-20 top+13",
            at: "left bottom",
            using: function( obj, info ) {
                // Set this element's position as passed in via 'obj'
                $(this).css({
                    left: obj.left,
                    top: obj.top
                });
                $(this).removeClass("right-arrow");
                $(this).removeClass("left-arrow");
                // Determine if the tooltip was flipped 
                // due to collision detection with screen edge
                // set the arrow class to show arrow on left or
                // right of the tooltip
                if( (info.target.left - obj.left) > 21 ) {
                    $(this).addClass("right-arrow");
                }
                else {
                    $(this).addClass("left-arrow");
                }
            }     
        },
        close: function( evt, ui ) {
            ui.tooltip.hover(
                function () {
                    $(this).stop(true).fadeTo(250, 1);
                },
                function () {
                    $(this).fadeOut("250", function(){
                        $(this).remove();
                    })
                }
            );
        }
    });
});

