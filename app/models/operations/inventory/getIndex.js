var mongoose = require('mongoose'),
    Q = require('q'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    var getIndex = function(collection){
        var deferred = Q.defer();
        collection.find({todayDate: {$exists: true}}, function(err, cursor){
            cursor.toArray(function(err, result){
               if (result.length > 0){
                   var now = new Date ();
                   var isSameDay = (now.getDate() == result[0].todayDate.getDate()
                   && now.getMonth() == result[0].todayDate.getMonth()
                   && now.getFullYear() == result[0].todayDate.getFullYear());
                   if (!isSameDay){
                       collection.update(
                           {
                               todayDate: result[0].todayDate
                           },
                           {
                               $set: {todayDate: now, index: 0}
                           }, function(){
                               deferred.resolve(0);
                           })
                   }else{
                       deferred.resolve(result[0].index);
                   }
               }else{
                   collection.insert(
                       {
                           todayDate: new Date(),
                           index: 0
                       }, function(){
                           deferred.resolve(0);
                       })
               }
            });
        });
        return deferred.promise;
    };
    connectionDB.collection('orders', function (err, collection) {
        getIndex(collection).then(function(index){
            res.jsonp([index+1]);
        });
    });
};
