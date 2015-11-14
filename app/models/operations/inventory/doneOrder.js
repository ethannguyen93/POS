var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    console.log(req.body.currentUser);
    connectionDB.collection('orders', function (err, collection) {
        collection.update(
            {
                'isPaid': false,
                '_id': mongoose.Types.ObjectId(req.body.order.toString()),
            },
            {
                $set: {
                    'isPaid': true,
                    'timePaid': new Date()
                }
            },
            function(err, result){
                console.log(result);
                res.jsonp();
            }
        )
    });
};
