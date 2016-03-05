var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('settings', function (err, collection) {
        collection.update({
            type: 'PointCard'
        },{
            $set: {
                type: 'PointCard',
                debit: req.body.debit,
                credit: req.body.credit,
                cash: req.body.cash,
                redeem: req.body.redeem
            }
        },{
            upsert: true
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                console.log(result);
                res.jsonp([]);
            }
        })
    });
};
