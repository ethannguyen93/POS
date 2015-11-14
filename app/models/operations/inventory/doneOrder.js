var mongoose = require('mongoose'),
    _ = require('lodash'),
    Q = require('q');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    console.log(req.body);
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
        if (req.body.order === 0 || req.body.order === ''){
            getIndex(collection).then(function(index) {
                collection.insert({
                    employee: req.body.user,
                    orders: req.body.orders,
                    isPaid: true,
                    timeOrderPlaced: new Date(),
                    'timePaid': new Date(),
                    index: index+1,
                    customerName: req.body.customerName,
                    subtotal: req.body.subtotal,
                    tax: req.body.tax
                }, function(err, result){
                    if (err) {
                        console.log(err)
                    } else {
                        res.jsonp([result]);
                    }
                })
            });
        }else{
            collection.update(
                {
                    'isPaid': false,
                    '_id': mongoose.Types.ObjectId(req.body.order.toString())
                },
                {
                    $set: {
                        'isPaid': true,
                        'timePaid': new Date(),
                        orders: req.body.orders,
                        subtotal: req.body.subtotal,
                        tax: req.body.tax
                    }
                },
                function(err, result){
                    console.log(result);
                    res.jsonp();
                }
            )
        }
    });
};
