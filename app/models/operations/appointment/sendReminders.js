var accountSid = 'ACc6d06b7c7cc18f2b04ca09f823f69a8f';
var authToken = 'f0b37ac21592628e9f9abd792add153f';

var mongoose = require('mongoose'),
    client = require('twilio')(accountSid, authToken),
    _ = require('lodash'),
    moment = require('moment'),
    nodemailer = require('nodemailer'),
    xoauth2 = require('xoauth2');

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
                        var bulk = collection.initializeUnorderedBulkOp();
                        _.map(result, function(a){
                            if (a.sentReminderPhone === undefined
                                && a.sentReminderPhone !== 'sent'
                                && a.customer.phone !== ''
                                && a.sendSMS !== undefined
                                && a.sendSMS){
                                appointmentsPhone.push(a);
                            }
                            if (a.sentReminderEmail === undefined
                                && a.sentReminderEmail !== 'sent'
                                && a.customer.email !== ''
                                && a.sendEmail !== undefined
                                && a.sendEmail){
                                appointmentsEmail.push(a);
                            }
                        });
                        _.each(appointmentsPhone, function(a){
                            if (a.customer.phone !== ''){
                                bulk.find({ _id: mongoose.Types.ObjectId(a._id) }).updateOne( { $set: { sentReminderPhone: 'sent'} } );
                                var message = 'Hello ' + a.customer.name + ', this is a reminder that your appointment ' +
                                    'with ... is tomorrow at ' + a.startTime + ' ' + a.startTimeList + '. We hope ' +
                                    'to see you there.';
                                /*client.messages.create({
                                    to: a.customer.phone,
                                    from: "+16475600735",
                                    body: message
                                }, function(err, message){
                                    if (err !== null){
                                        console.log(err.message);
                                    }else{
                                        console.log(message.sid);
                                    }
                                });*/
                            }
                        });
                        var transporter = nodemailer.createTransport({
                            service: 'Gmail',
                            auth: {
                                user: 'ethannguyen93@gmail.com',
                                pass: 'password'
                            }
                        });
                        console.log(appointmentsEmail);
                        _.each(appointmentsEmail, function(a){
                            if (a.customer.email !== ''){
                                bulk.find({ _id: mongoose.Types.ObjectId(a._id) }).updateOne( { $set: { sentReminderEmail: 'sent'} } );
                                var message = 'Hello ' + a.customer.name + ', this is a reminder that your appointment ' +
                                    'with ... is tomorrow at ' + a.startTime + ' ' + a.startTimeList + '. We hope ' +
                                    'to see you there.';
                                console.log(message);
                                /*transporter.sendMail({
                                    from: 'ethannguyen93@gmail.com',
                                    to: a.customer.email,
                                    subject: 'Reminder Email',
                                    text: message
                                });*/
                            }
                        });
                        if (appointmentsPhone.length !== 0 || appointmentsEmail.length !== 0){
                            bulk.execute(function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.jsonp([]);
                                }
                            });
                        }else{
                            res.jsonp([]);
                        }
                    }
                });
            }
        })
    });
};
