var util = require('../util');

module.exports = function (req, res) {
    util.getIndexFromOrders().then(function(index){
        res.jsonp([index+1]);
    });
};
