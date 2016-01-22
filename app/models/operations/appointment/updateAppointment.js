var mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    console.log(req.body);
    connectionDB.collection('appointments', function (err, collection) {
        collection.update({
            '_id':mongoose.Types.ObjectId(req.body.id)
        },{
            $set: {
                customer: req.body.customer,
                startTime: req.body.startTime,
                startTimeList: req.body.startTimeList,
                startDate: req.body.startDate,
                endTime: req.body.endTime,
                endTimeList: req.body.endTimeList,
                endDate: req.body.endDate,
                assignedEmployee: req.body.assignedEmployee,
                note: req.body.note
            }
        }, function(err, result){
            if (err) {
                console.log(err)
            } else {
                res.jsonp([result]);
            }
        })
    });
};
