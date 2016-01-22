var mongoose = require('mongoose');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('customers', function (err, collection) {
        collection.update({
            _id: mongoose.Types.ObjectId(req.body.id)
        },{
            $set: {
                'name': req.body.name,
                'phone': req.body.phone,
                'email': req.body.email
            }
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                console.log(result);
                res.jsonp([result]);
            }
        })
    });
};
