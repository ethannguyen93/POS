var mongoose = require('mongoose'),
    _ = require('lodash'),
    moment = require('moment');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    var today = moment().startOf('day');
    var tomorrow = moment(today).add(1, 'days');
    connectionDB.collection('appointments', function (err, collection) {
        collection.find({
            startDate: {
                $gte: today.toISOString(),
                $lt: tomorrow.toISOString()
            }
        }, function(err, cursor){
            if (err) {
                console.log(err)
            } else {
                var appointmentsPhone = [];
                var appointmentsEmail = [];
                cursor.toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        _.map(result, function(a){
                            if (a.sentReminderPhone === undefined && a.sentReminderPhone !== 'sent'){
                                appointmentsPhone.push(a);
                            }
                            if (a.sentReminderEmail === undefined && a.sentReminderEmail !== 'sent'){
                                appointmentsEmail.push(a);
                            }
                        });
                        res.jsonp([{email: appointmentsEmail.length, phone: appointmentsPhone.length}])
                    }
                });
            }
        })
    });
};
