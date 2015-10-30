var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('employees', function (err, collection) {
        collection.find({isAdmin: {$ne: true}}, function(err, cursor){
            if (err) {
                console.log(err)
            } else {
                var employees = [];
                cursor.toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        _.map(result, function(i){
                            employees.push(i);
                        });
                        res.jsonp(employees);
                    }
                });
            }
        })
    });
};
