var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    var number = req.body.number;
    connectionDB.collection('pointcards', function (err, collection) {
        collection.findOne({'number': number}, function(err, result){
            if (err) {
                console.log(err)
            } else {
                res.jsonp([result])
            }
        })
    });
};
