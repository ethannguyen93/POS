var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('employees', function (err, collection) {
        collection.update({
            'passcode': req.body.oldpasscode
        },{
            $set: {'passcode': req.body.newpasscode}
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                res.jsonp([result]);
            }
        })
    });
};
