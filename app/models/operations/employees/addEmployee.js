var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('employees', function (err, collection) {
        collection.insert({
            'name': req.body.data.name,
            'passcode': req.body.data.passcode
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                res.jsonp(result);
            }
        })
    });
};
