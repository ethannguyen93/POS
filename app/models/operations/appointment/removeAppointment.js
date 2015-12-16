var mongoose = require('mongoose');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('appointments', function (err, collection) {
        collection.remove({
            _id: mongoose.Types.ObjectId(req.body.id)
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
