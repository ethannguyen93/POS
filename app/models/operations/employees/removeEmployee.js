var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    console.log(req.body);
    connectionDB.collection('employees', function (err, collection) {
        collection.remove({passcode: req.body.data.passcode, name: req.body.data.name}, function(err, result){
            if (err) {
                console.log(err)
            } else {
                console.log(result);
                res.jsonp([result]);
            }
        })
    });
};
