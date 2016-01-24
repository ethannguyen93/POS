'use strict';

/* Service for FTScroller initialization */
angular.module('core').factory('FTScroller', function() {
    return {
        initFTScrollerGrid:  function(id) {
            setTimeout(function () {
                var containerElement = document.querySelector("#" + id + " .ui-grid-viewport");
                console.log(containerElement);
                var scroller = new FTScroller(containerElement, {
                    alwaysScroll: true,
                    scrollingX: false
                });
            }, 100);
        },
        initFTScroller: function(id, verticalScroll) {
            var containerElement = document.getElementById(id);
            console.log(containerElement);
            setTimeout(function() {
                var scroller = new FTScroller(containerElement, {
                    //contentHeight: 160,
                    alwaysScroll: true,
                    scrollingY: (verticalScroll) ? true : false,
                    scrollingX: (verticalScroll) ? false : true
                });
            }, 100);
        }
    }
});
