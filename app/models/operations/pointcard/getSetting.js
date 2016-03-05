var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('settings', function (err, collection) {
        collection.findOne({
            type: 'PointCard'
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                res.jsonp([result]);
            }
        })
    });
};
