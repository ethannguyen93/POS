var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    console.log(req.body);
    connectionDB.collection('employees', function (err, collection) {
        collection.update({
            'isAdmin': true,
            'passcode': req.body.passcode
        },{
            $set: {'passcode': req.body.newpasscode}
        }, function(err, result){
            console.log('here');
            console.log(result);
            if (err) {
                console.log(err)
            } else {
                res.jsonp([result]);
            }
        })
    });
};
