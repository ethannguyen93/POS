/*
var moment = require('moment');
var MongoClient = require('mongodb').MongoClient;
var $db;
MongoClient.connect('mongodb://localhost/pos-dev', function (err, db) {
    console.log(moment().subtract(1, 'day').toDate());
    db.collection('orders', function(err, collection){
        collection.find({
            timeOrderPlaced: {
                $gt: moment().subtract(1, 'day').toDate()
            }
        }, function(err, array){
            array.toArray(function(err, result){
                console.log(result);
            })
        })
    })
    console.log('DB connection successful!');
});
*/
