'use strict';

// Workflows controller
angular.module('admin').controller('EmailModalController', [
    '$scope', '$modalInstance', 'RetrieveCustomer', '$q', '$modal', 'email',
    function ($scope, $modalInstance, RetrieveCustomer, $q, $modal, email) {

        $scope.email = email.config;

        $scope.gridOptions = {
            rowHeight: 60,
            columnFooterHeight: 60,
            showColumnFooter: true,
            enableFiltering: true,
            enablePaginationControls: false,
            paginationPageSize: 10,
            data: 'data.customers'
        };

        $scope.removeBlock = function (index) {
            $scope.email.blocks.splice(index,1);
        };

        var defaultBlock = {
            "btnLink" : "http://example.com",
            "btnText" : "Buy now!",
            "btnEnabled" : true,
            "content" : "The quick brown fox jumps over the lazy dog (Could be blank)",
            "tag" : "$29.99 (Could be blank)",
            "heading" : "Trendy Shoes (Could be blank)",
            "imgUrl" : "http://s3.amazonaws.com/swu-filepicker/9wRy50HQTg2CTyZA5Ozi_item_images_16.jpg",
            "imgEnabled" : true
        };

        $scope.addBlock = function () {
            $scope.email.blocks.push(defaultBlock);
        };

        $scope.cancel = function(){
            $modalInstance.dismiss();
        };

        $scope.save = function() {
            $modalInstance.close($scope.email);
        };


        $scope.initFTScroller = function(id) {
            console.log('Init scroller=' + id);
            var containerElement = document.getElementById(id);
            console.log(containerElement);
            setTimeout(function() {
                var scroller = new FTScroller(containerElement, {
                    //contentHeight: 800,
                    alwaysScroll: true,
                    scrollingX: false,
                    scrollingY: true
                });
            }, 100);
        };
    }]
);
