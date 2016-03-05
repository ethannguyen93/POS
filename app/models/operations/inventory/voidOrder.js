var mongoose = require('mongoose'),
    Q = require('q'),
    _ = require('lodash');

module.exports = function (req, res) {
    var findOrder = function(){
        var deferred = Q.defer();
        var connectionDB = mongoose.connection.db;
        connectionDB.collection('orders', function (err, collection) {
            collection.findOne({
                _id: mongoose.Types.ObjectId(req.body.orderId)
            }, function(err, result){
                console.log(result);
                if (result === null){
                    deferred.reject();
                }else{
                    console.log(result);
                    deferred.resolve();
                }
            })
        });
        return deferred.promise;
    };
    findOrder().then(function(){
        var connectionDB = mongoose.connection.db;
        connectionDB.collection('orders', function (err, collection) {
            collection.update({
                _id: mongoose.Types.ObjectId(req.body.orderId)
            },{
                $set: {void: true}
            }, function(err, result){
                res.jsonp(['Updated']);
            })
        });
    }).catch(function(){
        res.jsonp(['Not Found']);
    });
};
