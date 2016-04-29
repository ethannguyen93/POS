'use strict';

/* UserService which holds information about current User throughout application */
angular.module('core').service('UserService', [function() {

    var _user;

    this.setUser = function(user) {
        _user = user;
    };

    this.logoutUser = function() {
        _user = undefined;
    };

    this.getUser = function() {
        return _user;
    }

}]);
