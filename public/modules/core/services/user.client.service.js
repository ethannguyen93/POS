'use strict';

/* UserService which holds information about current User throughout application */
angular.module('core').service('UserService', [function() {

    var user;

    this.setUser = function(userName) {
        user = { 'name' : userName };
    };

    this.logoutUser = function() {
        user = undefined;
    };

    this.getUser = function() {
        return user;
    }

}]);
