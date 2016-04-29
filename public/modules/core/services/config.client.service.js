'use strict';

// This factory serves as the app's Configurations
angular.module('core').factory('Config', [function() {
    return {
        // Orders
        ORDER_MODAL_ACTIVE: false,
        SAVE_ORDER_ACTIVE: false,
        // Features
        SCHEDULER_ACTIVE: true,
        POINT_CARDS_ACTIVE: true,
        GIFT_CARDS_ACTIVE: true,
        CUSTOMERS_ACTIVE: true
    }
}]);
