var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('employees', function (err, collection) {
        collection.update({
            'name': req.body.data.oldName,
            'passcode': req.body.data.passcode
        },{
            $set: {'name': req.body.data.newName}
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                res.jsonp([result]);
            }
        })
    });
};
