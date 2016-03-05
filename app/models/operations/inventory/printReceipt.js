var mongoose = require('mongoose'),
    _ = require('lodash'),
    util = require('util'),
    fs = require('fs'),
    moment = require('moment'),
    Docxtemplater = require('docxtemplater'),
    Q = require('q');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    var isWin = /^win/.test(process.platform);
    var getIndex = function(collection){
        var deferred = Q.defer();
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
        return deferred.promise;
    };
    var saveOrder = function(){
        var deferred = Q.defer();
        connectionDB.collection('orders', function (err, collection) {
            getIndex(collection).then(function(index){
                console.log('in Index');
                if (!req.body.id){
                    collection.insert({
                        employee: req.body.actualEmployee,
                        orders: req.body.orders,
                        isPaid: false,
                        timeOrderPlaced: new Date(),
                        index: index+1,
                        customerName: req.body.customerName,
                        subtotal: req.body.subtotal,
                        tax: req.body.tax,
                        discount: req.body.discount,
                        discountPrice: req.body.discountPrice,
                        customerID: req.body.customerID,
                        paymentType: req.body.paymentType,
                        ticketNumber: req.body.ticketNumber
                    }, function(err, result){
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("saved successfully!");
                            deferred.resolve(result._id);
                        }
                    })
                }else{
                    collection.update(
                        {
                            _id: mongoose.Types.ObjectId(req.body.id)
                        },
                        {
                            $set: {
                                orders: req.body.orders,
                                subtotal: req.body.subtotal,
                                tax: req.body.tax,
                                discount: req.body.discount,
                                discountPrice: req.body.discountPrice,
                                paymentType: req.body.paymentType,
                                ticketNumber: req.body.ticketNumber
                            }
                        }, function(err, result){
                            if (err) {
                                console.log(err)
                            } else {
                                deferred.resolve(req.body.order);
                            }
                        })
                }
            });
        });
        return deferred.promise;
    };
    var getGiftcardBalance = function() {
        var deferred = Q.defer();
        var giftcards = [];
        var gcNumbers = [];
        _.each(req.body.orders, function(order){
            if (order.isGiftcard){
                var name = order.name;
                name += ' ';
                name = name.replace('Giftcard ', '');
                var indexOfSpace = name.indexOf(' ');
                var giftcardNumber = name.substring(0, indexOfSpace);
                giftcards.push({giftcardNumber: giftcardNumber, quantity: order.quantity, price: order.price});
                gcNumbers.push(giftcardNumber);
            }
        });
        connectionDB.collection('giftcards', function (err, collection) {
            collection.find({
                number: { $in: gcNumbers}
            }, function (err, cursor) {
                cursor.toArray(function(err, result){
                    _.each(giftcards, function(gc){
                        var tmp = _.find(result, function(giftcard){
                            return giftcard.number === gc.giftcardNumber;
                        });
                        if (tmp === undefined){
                            result.push({number: gc.giftcardNumber, amount: gc.quantity * gc.price});
                        }else{
                            tmp.amount = tmp.amount + gc.quantity * gc.price;
                        }
                    });
                    deferred.resolve(result);
                });
            })
        });
        return deferred.promise;
    };
    var printDocument = function(){
        var exec = require('child_process').exec;
        var scriptFile = "cscript " + __dirname + '\\printFile.vbs';
        console.log(scriptFile);
        var child = exec(scriptFile, function (error, stdout, stderr) {
            child.kill();
            res.jsonp([]);
        });
    };
    var saveCustomerReceipt = function(){
        var deferred = Q.defer();
        var templateFile = req.body.discountPrice !== 0 ? 'templateWithDiscount.docx' : 'template.docx';
        console.log(templateFile);
        var fileName = isWin ? __dirname + '\\' + templateFile : __dirname + '/' + templateFile;
        var content = fs
            .readFileSync(fileName, "binary");

        var doc = new Docxtemplater(content);
        var now = new Date();
        var nowFormat = moment(now).format('MM/DD/YY hh:mm a');
        var order = [];
        var total = req.body.tax + req.body.subtotal - req.body.discountPrice;

        _.each(req.body.orders, function(o){
            var ord = {};
            ord.quantity = o.quantity;
            ord.item = o.name;
            ord.price = (o.price*o.quantity).toFixed(2);
            order.push(ord);
        });
        getGiftcardBalance().then(function(listOfGC){
            doc.setData({
                "server":req.body.user.name,
                "order":req.body.order,
                "time":nowFormat,
                "orders": order,
                "subtotal": req.body.subtotal.toFixed(2),
                "tax": req.body.tax.toFixed(2),
                "total": total.toFixed(2),
                "paymentType": req.body.paymentType,
                "percentage": req.body.discount,
                "discount": req.body.discountPrice.toFixed(2),
                "giftcards" : listOfGC,
                "discountArr": [],
                "isCustomer": true
            });
            doc.render();
            var buf = doc.getZip()
                .generate({type:"nodebuffer"});
            var outputFile = isWin ? __dirname + '\\output.docx' : __dirname + '/outputCustomer.docx';
            fs.writeFileSync(outputFile, buf);
            deferred.resolve();
        });
        return deferred.promise;
    };
    var saveMerchantReceipt = function(){
        var deferred = Q.defer();
        var templateFile = req.body.discountPrice !== 0 ? 'templateWithDiscount.docx' : 'template.docx';
        console.log(templateFile);
        var fileName = isWin ? __dirname + '\\' + templateFile : __dirname + '/' + templateFile;
        var content = fs
            .readFileSync(fileName, "binary");

        var doc = new Docxtemplater(content);
        var now = new Date();
        var nowFormat = moment(now).format('MM/DD/YY hh:mm a');
        var order = [];
        var total = req.body.tax + req.body.subtotal - req.body.discountPrice;

        _.each(req.body.orders, function(o){
            var ord = {};
            ord.quantity = o.quantity;
            ord.item = o.name;
            ord.price = (o.price*o.quantity).toFixed(2);
            order.push(ord);
        });
        getGiftcardBalance().then(function(listOfGC){
            doc.setData({
                "server":req.body.user.name,
                "order":req.body.order,
                "time":nowFormat,
                "orders": order,
                "subtotal": req.body.subtotal.toFixed(2),
                "tax": req.body.tax.toFixed(2),
                "total": total.toFixed(2),
                "paymentType": req.body.paymentType,
                "percentage": req.body.discount,
                "discount": req.body.discountPrice.toFixed(2),
                "giftcards" : listOfGC,
                "discountArr": [],
                "isMerchant": true,
                "orderId": req.body.id
            });
            doc.render();
            var buf = doc.getZip()
                .generate({type:"nodebuffer"});
            var outputFile = isWin ? __dirname + '\\output.docx' : __dirname + '/outputMerchant.docx';
            fs.writeFileSync(outputFile, buf);
            deferred.resolve();
        });
        return deferred.promise;
    };
    saveOrder().then(function(){
        saveMerchantReceipt().then(function(){
            return saveCustomerReceipt();
        }).then(function(){
            if (isWin){
                printDocument();
            }else{
                res.jsonp([]);
            }
        });
    });
};
