var Q = require('q'),
    mongoose = require('mongoose'),
    _ = require('lodash');

module.exports = {
    UUID: function () {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = '0123456789abcdef';
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-';

        return s.join('');
    },
    populateData: function(data){
        var result = {
            employee: data.user,
            orders: data.orders,
            timeOrderPlaced: new Date(),
            customerName: data.customerName,
            subtotal: data.subtotal,
            tax: data.tax,
            discount: data.discount,
            discountType: data.discountType,
            discountPrice: data.discountPrice,
            customerID: data.customerID,
            paymentType: data.paymentType,
            ticketNumber: data.ticketNumber

        };
        return result;
    },
    getIndexFromOrders: function(){
        var deferred = Q.defer();
        var connectionDB = mongoose.connection.db;
        connectionDB.collection('orders')
            .find({todayDate: {$exists: true}})
            .toArray(function(err, result){
                if (result.length > 0){
                    var now = new Date ();
                    var isSameDay = (now.getDate() == result[0].todayDate.getDate()
                    && now.getMonth() == result[0].todayDate.getMonth()
                    && now.getFullYear() == result[0].todayDate.getFullYear());
                    if (!isSameDay){
                        connectionDB.collection('orders').update(
                            {
                                todayDate: result[0].todayDate
                            },
                            {
                                $set: {todayDate: now, index: 0}
                            }, function(){
                                deferred.resolve(0);
                            })
                    }else{
                        deferred.resolve(result[0].index);
                    }
                }else{
                    connectionDB.collection('orders').insert(
                        {
                            todayDate: new Date(),
                            index: 0
                        }, function(){
                            deferred.resolve(0);
                        })
                }
            });
        return deferred.promise;
    },
    increaseIndex: function(){
        var connectionDB = mongoose.connection.db;
        connectionDB.collection('orders').update(
            {
                todayDate: {$exists: true}
            },
            {
                $set: {
                    todayDate: new Date ()
                },
                $inc: {
                    index: 1
                }
            }, function(err, result){
                console.log('Increasing index');
                console.log(err);
                console.log(result);
            });
    },
    generateBarcode: function(){
        var deferred = Q.defer();
        var success = false;
        var connectionDB = mongoose.connection.db;
        connectionDB.collection('orders')
            .find({}, {barcode: 1})
            .toArray(function(err, result){
            while (!success){
                var barcode = Math.floor(Math.random()*900000000) + 100000000;
                var item = _.find(result, function(i){
                    return (i.barcode !== undefined && i.barcode === barcode);
                });
                if (item === undefined){
                    success = true;
                    deferred.resolve(barcode);
                }
            }
        });
        return deferred.promise;
    },
    saveOrder: function(req, isPaid){
        var self = this;
        var deferred = Q.defer();
        var connectionDB = mongoose.connection.db;
        connectionDB.collection('orders', function (err, collection) {
            self.getIndexFromOrders().then(function(index){
                if (!req.body.id){
                    self.generateBarcode().then(function(barcode){
                        var data = self.populateData(req.body);
                        data.index = index + 1;
                        data.isPaid = isPaid;
                        data.barcode = barcode;
                        collection.insert(data, function(err, result){
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("saved successfully!");
                                self.increaseIndex();
                                deferred.resolve(result);
                            }
                        })
                    });
                }else{
                    var data = self.populateData(req.body);
                    data.isPaid = isPaid;
                    console.log(data);
                    collection.findAndModify({
                            _id: mongoose.Types.ObjectId(req.body.id)
                        },
                        [],
                        {
                            $set: data
                        },
                        {
                            new: true
                        }, function(err, result){
                            if (err) {
                                console.log(err)
                            } else {
                                deferred.resolve([result]);
                            }
                        })
                }
            });
        });
        return deferred.promise;
    }
};
