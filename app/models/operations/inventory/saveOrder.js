var mongoose = require('mongoose'),
    Q = require('q'),
    _ = require('lodash');

module.exports = function (req, res) {
    console.log("[saveOrder.js] Reached!");
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
                       collection.update(
                           {
                               todayDate: result[0].todayDate
                           },
                           {
                               $set: {todayDate: now, index: result[0].index + 1}
                           }, function(){
                               deferred.resolve(result[0].index);
                           });
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
            if (!req.body.order){
                collection.insert({
                    employee: req.body.user,
                    orders: req.body.orders,
                    isPaid: false,
                    timeOrderPlaced: new Date(),
                    index: index+1,
                    customerName: req.body.customerName,
                    subtotal: req.body.subtotal,
                    tax: req.body.tax
                }, function(err, result){
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("saved successfully!");
                        res.jsonp([result]);
                    }
                })
            }else{
                collection.update(
                    {
                        _id: mongoose.Types.ObjectId(req.body.order)
                    },
                    {
                        $set: {
                            orders: req.body.orders,
                            subtotal: req.body.subtotal,
                            tax: req.body.tax
                        }
                    }, function(err, result){
                        if (err) {
                            console.log(err)
                        } else {
                            res.jsonp([result]);
                        }
                    })
            }
        });
    });
};
