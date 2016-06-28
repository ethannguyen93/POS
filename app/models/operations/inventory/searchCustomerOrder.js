var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('orders').find({
        customerName: req.body.customerName
    }).toArray(function(err, result){
        res.jsonp(result);
    });
};
