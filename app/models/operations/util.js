var Q = require('q'),
    mongoose = require('mongoose');

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
    getIndexFromOrders: function(){
        var deferred = Q.defer();
        var connectionDB = mongoose.connection.db;
        connectionDB.collection('orders', function (err, collection) {
            collection.find({todayDate: {$exists: true}}, function(err, cursor){
                cursor.toArray(function(err, result){
                    if (result.length > 0){
                        var now = new Date ();
                        var isSameDay = (now.getDate() == result[0].todayDate.getDate()
                        && now.getMonth() == result[0].todayDate.getMonth()
                        && now.getFullYear() == result[0].todayDate.getFullYear());
                        if (!isSameDay){
                            collection.update(
                                {
                                    todayDate: result[0].todayDate
                                },
                                {
                                    $set: {todayDate: now, index: 0}
                                }, function(){
                                    deferred.resolve(0);
                                })
                        }else{
                            collection.update(
                                {
                                    todayDate: result[0].todayDate
                                },
                                {
                                    $set: {todayDate: now, index: result[0].index + 1}
                                }, function(){
                                    deferred.resolve(result[0].index);
                                });
                        }
                    }else{
                        collection.insert(
                            {
                                todayDate: new Date(),
                                index: 0
                            }, function(){
                                deferred.resolve(0);
                            })
                    }
                });
            });
        });
        return deferred.promise;
    }
};
