var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    console.log(req.body.currentUser);
    connectionDB.collection('orders', function (err, collection) {
        collection.find({'employee.name': req.body.currentUser.name, 'isPaid': false}, function(err, cursor){
            if (err) {
                console.log(err)
            } else {
                var items = [];
                cursor.toArray(function (err, result) {
                    console.log(result);
                    if (err) {
                        console.log(err);
                    } else {
                        _.map(result, function(i){
                            items.push(i);
                        });
                        res.jsonp(items);
                    }
                });
            }
        })
    });
};
