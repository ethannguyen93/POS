var mongoose = require('mongoose'),
    _ = require('lodash'),
    Q = require('q');

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
                                t$set: {todayDate: now, index: 0}
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
    var updateGiftcard = function(){
        var deferred = Q.defer();
        var hasGC = _.find(req.body.orders, function(order){
            return (order.isGiftcard);
        });
        if (hasGC !== undefined){
            connectionDB.collection('giftcards', function (err, collection) {
                if (err) console.log(err);
                var bulk = collection.initializeUnorderedBulkOp();
                _.each(req.body.orders, function(order){
                    if (order.isGiftcard){
                        var gc = {};
                        var tmp = order.name.substring(9);
                        var index = tmp.indexOf(' ');
                        if (index < 0){
                            index = order.name.length - 9 + 1;
                        }
                        var gcnum = order.name.substring(9, 9+index);
                        var type = '';
                        gc.price = order.price;
                        if (gc.price < 0){
                            type = 'Reload'
                        }else{
                            type = (order.name.indexOf('Buy') > -1) ? 'Buy' : 'Reload';
                        }
                        gc.type = type;
                        gc.number = gcnum;
                        switch (type){
                            case 'Buy':
                                bulk.insert(
                                    {
                                        number: gc.number,
                                        amount: gc.price
                                    });
                                break;
                            case 'Reload':
                                console.log('Reload');
                                bulk.find(
                                    {
                                        number: gc.number
                                    }).updateOne(
                                    {
                                        $inc: {amount: gc.price}
                                    });
                                break;
                        }
                    }
                });
                bulk.execute(function(err, result) {
                    console.log('done with giftcard');
                    deferred.resolve();
                });
            });
        }else{
            deferred.resolve();
        }
        return deferred.promise;
    };
    updateGiftcard().then(function(){
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
                        tax: req.body.tax,
                        isTax: req.body.isTax
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
    });
};
