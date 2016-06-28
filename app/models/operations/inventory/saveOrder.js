var mongoose = require('mongoose'),
    Q = require('q'),
    _ = require('lodash'),
    util = require('../util');

module.exports = function (req, res) {
    console.log("[saveOrder.js] Reached!");
    console.log(req.body.id);
    util.saveOrder(req, false).then(function(result){
        res.jsonp(result);
    });
};
