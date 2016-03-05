var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('items', function (err, collection) {
        collection.remove({
            _id: mongoose.Types.ObjectId(req.body._id)
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                console.log(result);
                res.jsonp([result]);
            }
        })
    });
};
