var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    var source = req.body.data;
    var collectionName = (req.body.part === 'item')? 'items': 'categories';
    var query = (req.body.part === 'item')? {name: source.name, category: source.category, price: source.price}: {name: source.name};
    connectionDB.collection(collectionName, function (err, collection) {
        collection.insert(query, function(err, result){
            if (err) {
                console.log(err)
            } else {
                res.jsonp(result);
            }
        })
    });
};
