var mongoose = require('mongoose'),
    _ = require('lodash'),
    Q = require('q');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    var getBarcode = function(){
        var deferred = Q.defer();
        var success = false;
        connectionDB.collection('items', function(err, collection){
            collection.find({}, {barcode: 1}, function(err, cursor){
                cursor.toArray(function(err, result){
                    while (!success){
                        var barcode = Math.floor(Math.random()*900000) + 100000;
                        var item = _.find(result, function(i){
                            return (i.barcode !== undefined && i.barcode === barcode);
                        });
                        if (item === undefined){
                            success = true;
                            console.log(barcode);
                            deferred.resolve(barcode);
                        }
                    }
                });
            });
        });
        return deferred.promise;
    };
    getBarcode().then(function(barcode){
        console.log('here');
        connectionDB.collection('items', function (err, collection) {
            collection.insert({
                name: req.body.name,
                category: req.body.category,
                quantity: req.body.quantity,
                price: req.body.price,
                stockPrice: req.body.stockPrice,
                barcode: barcode,
                desc: req.body.desc,
                type: 'StockItem'
            }, function(err, result){
                var item = result[0];
                connectionDB.collection('inventoryTracking', function (err, collection) {
                    collection.insert({
                        itemName: item.name,
                        itemId: item._id,
                        itemBarcode: item.barcode,
                        type: 'Add',
                        quantity: item.quantity,
                        date: new Date()
                    }, function(){
                        res.jsonp(result);
                    })
                });
            })
        });
    });
};
