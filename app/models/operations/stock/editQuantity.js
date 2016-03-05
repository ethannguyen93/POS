var mongoose = require('mongoose'),
    _ = require('lodash'),
    Q = require('q');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    var quantity = (req.body.typeQuantity === 'Remove') ? -req.body.quantity : req.body.quantity;
    var trackQuantity = function(){
        var deferred = Q.defer();
        connectionDB.collection('inventoryTracking', function (err, collection) {
            collection.insert({
                itemName: req.body.item.name,
                itemId: mongoose.Types.ObjectId(req.body.item._id),
                itemBarcode: req.body.item.barcode,
                type: req.body.typeQuantity,
                quantity: quantity,
                date: new Date()
            }, function(){
                deferred.resolve()
            })
        });
        return deferred.promise;
    };
    trackQuantity().then(function(){
        connectionDB.collection('items', function (err, collection) {
            collection.update({
                _id: mongoose.Types.ObjectId(req.body.item._id)
            },{
                $inc: {quantity: quantity}
            }, function(err, result){
                if (err) {
                    console.log(err)
                } else {
                    res.jsonp([result]);
                }
            })
        });
    })
};
