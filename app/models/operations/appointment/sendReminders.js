var accountSid = 'ACc6d06b7c7cc18f2b04ca09f823f69a8f';
var authToken = 'f0b37ac21592628e9f9abd792add153f';

var mongoose = require('mongoose'),
    client = require('twilio')(accountSid, authToken),
    _ = require('lodash'),
    moment = require('moment');;

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    var today = moment().startOf('day');
    var tomorrow = moment(today).add(1, 'days');
    console.log(tomorrow.toDate());
    connectionDB.collection('appointments', function (err, collection) {
        collection.find({

        }, function(err, cursor){
            if (err) {
                console.log(err)
            } else {
                var customers = [];
                cursor.toArray(function (err, result) {
                    console.log(result);
                    if (err) {
                        console.log(err);
                    } else {
                        _.map(result, function(a){
                            customers.push(a.customer);
                        });
                        _.each(customers, function(c){
                            if (c.phone !== ''){
                                client.messages.create({
                                    to: c.phone,
                                    from: "+16475600735",
                                    body: "Hello this is reminder"
                                }, function(err, message){
                                    if (err !== null){
                                        console.log(err.message);
                                    }else{
                                        console.log(message.sid);
                                    }
                                });
                            }
                        });
                        res.jsonp([]);
                    }
                });
            }
        })
    });
};
