var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('customers', function (err, collection) {
        collection.find({}, function(err, cursor){
            if (err) {
                console.log(err)
            } else {
                var customers = [];
                cursor.toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        _.map(result, function(i){
                            customers.push(i);
                        });
                        res.jsonp(customers);
                    }
                });
            }
        })
    });
};
