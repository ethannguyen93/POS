'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    var passcode = req.body.passcode;
    connectionDB.collection('employees', function (err, collection) {
        collection.findOne({'passcode': passcode, 'isAdmin': true}, function(err, result){
            if (err) {
                console.log(err)
            } else {
                res.jsonp([result])
            }
        })
    });
};
