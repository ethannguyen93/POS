'use strict';

// Modals Service for Core
angular.module('core').factory('Modals', ['$q', '$modal', 'UserService',
    function ($q, $modal, UserService) {
        // Opens a Boilerplate Modal
        function _openGenericModal(configs) {
            var deferred = $q.defer();
            var editorInstance = $modal.open({
                animation: true,
                windowClass: configs.windowClass || 'modal-fullwindow',
                templateUrl: configs.templateUrl,
                controller: configs.controller
            });
            editorInstance.result.then(function (bundle) {
                deferred.resolve(bundle);
            });
            return deferred.promise;
        }

        // Opens Order Selection
        function _openOrderModal() {
            var deferred = $q.defer();
            var editorInstance = $modal.open({
                animation: true,
                windowClass: 'modal-fullwindow modal-order',
                templateUrl: 'modules/core/views/orderModal.client.view.html',
                controller: 'orderCtrl',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    currentUser: function () {
                        return UserService.getUser().name;
                    }
                }
            });
            editorInstance.result.then(function (selectedItem) {
                deferred.resolve(selectedItem);
            });
            return deferred.promise;
        }

        // Modal for adding Custom Item into order
        function _openCustomItemModal() {
            var deferred = $q.defer();
            var editorInstance = $modal.open({
                animation: true,
                windowClass: 'modal-fullwindow modal-order',
                templateUrl: 'modules/core/views/modal/addCustomItemModal.client.view.html',
                controller: 'addCustomItemController'
            });
            editorInstance.result.then(function (item) {
                deferred.resolve(item);
            });
            return deferred.promise;
        }

        // Modal for Point Cards
        function _openPointCardModal() {
            return _openGenericModal({
                templateUrl: 'modules/core/views/modal/usePointcardModal.client.view.html',
                controller: 'usePointcardCtrl'
            });
        }

        // Modal for Point Card Redemption
        function _openRedeemPointCardModal() {
            return _openGenericModal({
                templateUrl: 'modules/core/views/modal/redeemPointcardModal.client.view.html',
                controller: 'redeemPointcardCtrl'
            });
        }

        function _openBuyGiftCardModal() {
            return _openGenericModal({
                templateUrl: 'modules/core/views/buyGiftcardModal.client.view.html',
                controller: 'buyGiftcardCtrl'
            });
        }

        function _openUseGiftCardModal() {
            return _openGenericModal({
                templateUrl: 'modules/core/views/useGiftcardModal.client.view.html',
                controller: 'useGiftcardCtrl'
            });
        }

        function _openDoneOrderModal(data) {
            var deferred = $q.defer();
            var editorInstance = $modal.open({
                animation: true,
                windowClass: 'modal-fullwindow',
                templateUrl: 'modules/core/views/doneOrderModal.client.view.html',
                controller: 'doneOrderCtrl',
                resolve: {
                    data: function(){
                        return data;
                    }
                }

            });
            editorInstance.result.then(function (bundle) {
                deferred.resolve(bundle);
            });
            return deferred.promise;
        }

        // Modal which shows a Notification
        function _openNotificationModal (notification) {
            var editorInstance = $modal.open({
                animation: true,
                windowClass: 'modal-fullwindow',
                templateUrl: 'modules/core/views/notificationModal.client.view.html',
                controller: 'notificationCtrl',
                resolve: {
                    notification: function() {
                        return notification;
                    }
                }
            });
            editorInstance.result.then(function () {
                // do nothing
            });
        }

        // Modal which shows remaining Balance for Giftcard
        function _openCheckBalanceModal() {
            return _openGenericModal({
                templateUrl: 'modules/core/views/checkBalanceModal.client.view.html',
                controller: 'checkBalanceCtrl'
            });
        }

        // Modal for Logout Confirmation
        function _openDeleteModal() {
            return _openGenericModal({
                templateUrl: 'modules/core/views/modal/deleteModal.client.view.html',
                controller: 'deleteModalCtrl'
            });
        }

        // Modal for Logout Confirmation
        function _openSaveOrderModal() {
            return _openGenericModal({
                templateUrl: 'modules/core/views/modal/saveOrderModal.client.view.html',
                controller: 'deleteModalCtrl'
            });
        }

        // Modal for Logout Confirmation
        function _openLogoutModal() {
            var deferred = $q.defer();
            var editorInstance = $modal.open({
                animation: true,
                windowClass: 'modal-fullwindow',
                templateUrl: 'modules/core/views/logoutModal.client.view.html',
                controller: 'logoutCtrl'
            });
            editorInstance.result.then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }

        // Modal for Printing Message
        function _printingModal(data) {
            var deferred = $q.defer();
            var printingInstance = $modal.open({
                animation: true,
                windowClass: 'modal-fullwindow',
                templateUrl: 'modules/core/views/modal/printingModal.client.view.html',
                controller: 'printingCtrl',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });
            printingInstance.result.then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        }
        // Public API
        return {
            openOrderModal: _openOrderModal,
            openCustomItemModal: _openCustomItemModal,
            openDeleteModal: _openDeleteModal,

            openNotificationModal: _openNotificationModal,
            openDoneOrderModal: _openDoneOrderModal,
            openLogoutModal: _openLogoutModal,
            openSaveOrderModal: _openSaveOrderModal,

            openPointCardModal: _openPointCardModal,
            openRedeemPointCardModal: _openRedeemPointCardModal,

            openBuyGiftCardModal: _openBuyGiftCardModal,
            openUseGiftCardModal: _openUseGiftCardModal,
            openCheckBalanceModal: _openCheckBalanceModal,

            printingModal: _printingModal
        }
    }]);
