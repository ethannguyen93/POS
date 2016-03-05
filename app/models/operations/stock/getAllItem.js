var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('items', function (err, collection) {
        collection.find({
            type: 'StockItem'
        }, function(err, cursor){
            if (err) {
                console.log(err)
            } else {
                var items = [];
                cursor.toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        _.map(result, function(i){
                            items.push(i);
                        });
                        res.jsonp(items);
                    }
                });
            }
        })
    });
};
