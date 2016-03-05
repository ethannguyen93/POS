var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    console.log(req.body.currentUser);
    connectionDB.collection('orders', function (err, collection) {
        collection.find({
            'employee.name': req.body.currentUser.name,
            'isPaid': false
        }, function(err, cursor){
            if (err) {
                console.log(err)
            } else {
                var items = [];
                cursor.toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        var now = new Date();
                        _.map(result, function(i){
                            var isSameDay = (now.getDate() === i.timeOrderPlaced.getDate()
                            && now.getMonth() === i.timeOrderPlaced.getMonth()
                            && now.getFullYear() === i.timeOrderPlaced.getFullYear());
                            if (isSameDay){
                                items.push(i);
                            }
                        });
                        console.log(items);
                        res.jsonp(items);
                    }
                });
            }
        })
    });
};
