var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('orders', function (err, collection) {
        collection.findOne({'ticketNumber': req.body.ticketNumber, 'isPaid': false}, function(err, result){
            if (err) {
                console.log(err)
            } else {
                res.jsonp([result])
            }
        })
    });
};
