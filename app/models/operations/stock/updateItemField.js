var mongoose = require('mongoose'),
    _ = require('lodash'),
    Q = require('q');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    var quantity = (req.body.typeQuantity === 'Remove') ? -req.body.quantity : req.body.quantity;
    connectionDB.collection('items', function (err, collection) {
        collection.update({
            _id: mongoose.Types.ObjectId(req.body.id)
        },{
            $set: {name: req.body.name, desc: req.body.desc, stockPrice: req.body.stockPrice, price: req.body.price}
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                res.jsonp([result]);
            }
        })
    });
};
