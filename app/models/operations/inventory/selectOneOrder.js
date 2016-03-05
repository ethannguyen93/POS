var mongoose = require('mongoose'),
    _ = require('lodash'),
    objectId = mongoose.Types.ObjectId;

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('orders', function (err, collection) {
        collection.findOne({
            '_id': objectId(req.body.id),
            'isPaid': false
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
