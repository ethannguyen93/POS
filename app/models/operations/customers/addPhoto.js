var mongoose = require('mongoose'),
    fs = require('fs');
    sys = require('sys');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    console.log(req.body.customerID);
    connectionDB.collection('customers', function (err, collection) {
        collection.update({
            _id: mongoose.Types.ObjectId(req.body.customerID)
        },{
            $set: {
                'image': req.body.customerID+'-image.png'
            }
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                var img = req.body.img;
                var data = img.replace(/^data:image\/\w+;base64,/, "");
                var buf = new Buffer(data, 'base64');
                fs.writeFile('./public/customerImage/' + req.body.customerID + '-image.png', buf);
                res.jsonp([]);
            }
        })
    });
};
