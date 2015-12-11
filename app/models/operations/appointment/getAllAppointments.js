var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('appointments', function (err, collection) {
        collection.find({}, function(err, cursor){
            if (err) {
                console.log(err)
            } else {
                var appointment = [];
                cursor.toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        _.map(result, function(a){
                            appointment.push(a);
                        });
                        res.jsonp(appointment);
                    }
                });
            }
        })
    });
};
