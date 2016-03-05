var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('items', function (err, collection) {
        collection.findOne({
            type: 'StockItem',
            barcode: req.body.barcode
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                res.jsonp([result]);
            }
        })
    });
};
