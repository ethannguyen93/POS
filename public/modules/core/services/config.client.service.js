'use strict';

// This factory serves as the app's Configurations
angular.module('core').factory('Config', [function() {
    return {
        // Orders
        EXISTING_ORDER_ACTIVE: true,
        ORDER_MODAL_ACTIVE: true,
        SAVE_ORDER_ACTIVE: true,
        // Features
        SCHEDULER_ACTIVE: true,
        POINT_CARDS_ACTIVE: true,
        GIFT_CARDS_ACTIVE: true,
        CUSTOMERS_ACTIVE: true,
        MARKETING_ACTIVE: true,
        INVENTORY_ACTIVE: true,
        CSV_REPORT: true
    }
}]);
