var mongoose = require('mongoose'),
    _ = require('lodash'),
    Q = require('q'),
    util = require('../util');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
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
    var trackStock = function(){
        var deferred = Q.defer();
        connectionDB.collection('inventoryTracking', function (err, collection) {
            var bulk = collection.initializeUnorderedBulkOp();
            _.each(req.body.orders, function(order){
                if (order.itemType === 'StockItem'){
                    bulk.insert({
                        itemName: order.name,
                        itemId: mongoose.Types.ObjectId(order.id),
                        itemBarcode: order.barcode,
                        type: 'Sold',
                        quantity: -order.quantity,
                        date: new Date()
                    });
                };
                bulk.execute(function(err, result) {
                    deferred.resolve();
                });
            });
        });
        return deferred.promise;
    };
    var updateStock = function(){
        var deferred = Q.defer();
        var hasStock = _.find(req.body.orders, function(order){
            return (order.itemType === 'StockItem');
        });
        if (hasStock !== undefined){
            trackStock().then(function(){
                connectionDB.collection('items', function (err, collection) {
                    var bulk = collection.initializeUnorderedBulkOp();
                    _.each(req.body.orders, function(order){
                        console.log(order);
                        if (order.itemType === 'StockItem'){
                            bulk.find(
                                {
                                    _id: mongoose.Types.ObjectId(order.id)
                                }).updateOne(
                                {
                                    $inc: {quantity: -order.quantity}
                                });
                        }
                    });
                    bulk.execute(function(err, result) {
                        deferred.resolve();
                    });
                });
            });
        }else{
            deferred.resolve();
        }
        return deferred.promise;
    };
    var getPointCardSetting = function(){
        var deferred = Q.defer();
        connectionDB.collection('settings', function (err, collection) {
            collection.findOne({
                type: 'PointCard'
            }, function(err, result){
                deferred.resolve(result);
            })
        });
        return deferred.promise;
    };
    var updatePointCard = function(){
        var deferred = Q.defer();
        var hasPC = _.find(req.body.orders, function(order){
            return (order.isPointcard);
        });
        if (hasPC !== undefined){
            getPointCardSetting().then(function(setting){
                connectionDB.collection('pointcards', function (err, collection) {
                    if (err) console.log(err);
                    var bulk = collection.initializeUnorderedBulkOp();
                    _.each(req.body.orders, function(order){
                        if (order.isPointcard){
                            var point = req.body.subtotal - req.body.discountPrice;
                            switch(req.body.paymentType) {
                                case 'DebitCard':
                                    point = point * setting.debit;
                                    break;
                                case 'CreditCard':
                                    point = point * setting.credit;
                                    break;
                                case 'Cash':
                                    point = point * setting.cash;
                                    break;
                            };
                            point = Math.floor(point);
                            switch (order.pcType){
                                case 'Use':
                                    bulk.find(
                                        {
                                            number: order.pcNumber
                                        }).updateOne(
                                        {
                                            $inc: {point: point}
                                        });
                                    break;
                                case 'Redeem':
                                    bulk.find(
                                        {
                                            number: order.pcNumber
                                        }).updateOne(
                                        {
                                            $inc: {point: -order.pcRedeem}
                                        });
                                    break;
                            }
                        }
                    });
                    bulk.execute(function(err, result) {
                        deferred.resolve();
                    });
                });
            });
        }else{
            deferred.resolve();
        }
        return deferred.promise;
    };
    updateGiftcard().then(function() {
        return updatePointCard();
    }).then(function(){
        return updateStock();
    }).then(function(){
        util.saveOrder(req, true).then(function(result){
            res.jsonp(result);
        });
    });
};
