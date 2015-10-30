var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('orders', function (err, collection) {
        collection.findOne({
            'employee.name': req.body.user,
            'isPaid': false,
            'index': req.body.index
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                if (err) {
                    console.log(err);
                } else {
                    res.jsonp([result]);
                }
            }
        })
    });
};
