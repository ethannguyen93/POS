var mongoose = require('mongoose'),
    _ = require('lodash'),
    moment = require('moment');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    var today = moment().startOf('day');
    var tomorrow = moment(today).add(1, 'days');
    var dayAfterTomorrow = moment(today).add(2, 'days');
    connectionDB.collection('appointments', function (err, collection) {
        collection.find({
            startDate: {
                $gte: tomorrow.toISOString(),
                $lt: dayAfterTomorrow.toISOString()
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
                            if (a.sentReminderPhone === undefined && a.sentReminderPhone !== 'sent' && a.customer.phone !== ''){
                                appointmentsPhone.push(a);
                            }
                            if (a.sentReminderEmail === undefined && a.sentReminderEmail !== 'sent' && a.customer.email !== ''){
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
