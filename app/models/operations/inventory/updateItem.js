var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    var field = req.body.data.field;
    var item = _.clone(req.body.data.item);
    item[field] = req.body.data.oldValue;
    var setQuery = {};
    console.log(item);
    switch (field){
        case 'name':
            setQuery = {'name': req.body.data.newValue};
            break;
        case 'category':
            setQuery = {'category': req.body.data.newValue};
            break;
        case 'price':
            setQuery = {'price': req.body.data.newValue};
            break;
    }
    console.log(setQuery);
    connectionDB.collection('items', function (err, collection) {
        collection.update({
            'name': item.name,
            'category': item.category,
            'price': item.price
        },{
            $set: setQuery
        }, function(err, result){
            console.log(err);
            console.log(result);
            if (err) {
                console.log(err)
            } else {
                res.jsonp([result]);
            }
        })
    });
};
