var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('pointcards', function (err, collection) {
        collection.insert({
            number: req.body.number,
            point: 0
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                res.jsonp(result);
            }
        })
    });
};
