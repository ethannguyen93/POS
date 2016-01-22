var mongoose = require('mongoose');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('customers', function (err, collection) {
        collection.findOne({
            'name': req.body.name,
            'phone': req.body.phone,
            'email': req.body.email
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                res.jsonp([result]);
            }
        })
    });
};
