var mongoose = require('mongoose'),
    _ = require('lodash'),
    util = require('../util'),
    fs = require('fs'),
    moment = require('moment'),
    Docxtemplater = require('docxtemplater'),
    Q = require('q'),
    bwipjs = require('bwip-js'),
    saveOrder = require('./saveOrder'),
    ImageModule=require('docxtemplater-image-module');

module.exports = function (req, res) {
    var connectionDB = mongoose.connection.db;
    var isWin = /^win/.test(process.platform);
    var imageFile = './public/barcode.png';
    var barcode = '';
    var total = req.body.subtotal - req.body.discountPrice + req.body.tax;
    var getPointCardSetting = function(){
        var deferred = Q.defer();
        connectionDB.collection('settings', function (err, collection) {
            collection.findOne({
                type: 'PointCard'
            }, function(err, result){
                deferred.resolve(result);
            })
        });
        return deferred.promise;
    };
    var getPointcardBalance = function(listOfGC){
        var deferred = Q.defer();
        var pointcards = [];
        var pcNumbers = [];
        getPointCardSetting().then(function(setting){
            _.each(req.body.orders, function(order){
                if (order.isPointcard){
                    var point = total;
                    switch(req.body.paymentType) {
                        case 'DebitCard':
                            point = point * setting.debit;
                            break;
                        case 'CreditCard':
                            point = point * setting.credit;
                            break;
                        case 'Cash':
                            point = point * setting.cash;
                            break;
                    };
                    point = Math.floor(point);
                    switch (order.pcType){
                        case 'Use':
                            break;
                        case 'Redeem':
                            point = -order.pcRedeem;
                            break;
                    }
                    var pc = _.find(pointcards, function(p){
                        return p.pointcardNumber === order.pcNumber;
                    });
                    if (pc === undefined){
                        pointcards.push({pointcardNumber: order.pcNumber, point: point});
                        pcNumbers.push(order.pcNumber);
                    }else{
                        pc.point += point;
                    }
                }
            });
            connectionDB.collection('pointcards', function (err, collection) {
                collection.find({
                    number: { $in: pcNumbers}
                }, function (err, cursor) {
                    cursor.toArray(function(err, result){
                        _.each(pointcards, function(pc){
                            var tmp = _.find(result, function(pointcard){
                                return pointcard.number === pc.pointcardNumber;
                            });
                            if (tmp === undefined){
                                result.push({number: order.pcNumber, point: point});
                            }else{
                                tmp.point = tmp.point + pc.point;
                            }
                        });
                        deferred.resolve({gc: listOfGC, pc: result});
                    });
                })
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
            res.jsonp([ID]);
        });
    };
    var saveCustomerReceipt = function(){
        var deferred = Q.defer();
        var templateFile = req.body.discountPrice !== 0 ? 'templateWithDiscount.docx' : 'template.docx';
        var fileName = isWin ? __dirname + '\\' + templateFile : __dirname + '/' + templateFile;
        var content = fs
            .readFileSync(fileName, "binary");

        var doc = new Docxtemplater(content);
        var now = new Date();
        var nowFormat = moment(now).format('MM/DD/YY hh:mm a');
        var order = [];

        _.each(req.body.orders, function(o){
            var ord = {};
            ord.quantity = o.quantity;
            ord.item = o.name;
            ord.price = (o.price*o.quantity).toFixed(2);
            order.push(ord);
        });
        getGiftcardBalance().then(function(listOfGC){
            return getPointcardBalance(listOfGC)
        }).then(function(list){
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
                "giftcards" : list.gc,
                "pointcards" : list.pc,
                "discountArr": [],
                "isCustomer": true,
                "customerName": req.body.customerName
            });
            doc.render();
            var buf = doc.getZip()
                .generate({type:"nodebuffer"});
            var outputFile = isWin ? __dirname + '\\outputCustomer.docx' : __dirname + '/outputCustomer.docx';
            fs.writeFileSync(outputFile, buf);
            deferred.resolve();
        });
        return deferred.promise;
    };
    var generateReceiptBarcode = function(){
        var deferred = Q.defer();
        bwipjs.toBuffer({
            bcid:           'code128',      // Barcode type
            text:           barcode.toString(),   // Text to encode
            scale:          1,              // 3x scaling factor
            height:         1,             // Bar height, in millimeters
            includetext:    false,           // Show human-readable text
            textxalign:     'center',       // Use your custom font
            textsize:       9              // Font size, in points
        }, function (err, png) {
            if (err) {
                console.log(err);
            } else {
                console.log('generating barcode');
                fs.writeFile(imageFile, png, 'binary', function(){
                    deferred.resolve();
                });
            }
        });
        return deferred.promise;
    };
    var saveMerchantReceipt = function(orderId){
        var deferred = Q.defer();
        var templateFile = req.body.discountPrice !== 0 ? 'templateWithDiscount.docx' : 'template.docx';
        var fileName = isWin ? __dirname + '\\' + templateFile : __dirname + '/' + templateFile;
        var content = fs
            .readFileSync(fileName, "binary");

        var doc = new Docxtemplater(content);
        var now = new Date();
        var nowFormat = moment(now).format('MM/DD/YY hh:mm a');
        var order = [];
        _.each(req.body.orders, function(o){
            var ord = {};
            ord.quantity = o.quantity;
            ord.item = o.name;
            ord.price = (o.price*o.quantity).toFixed(2);
            order.push(ord);
        });
        generateReceiptBarcode().then(function(){
            console.log('in here');
            return getGiftcardBalance()
        }).then(function(listOfGC) {
            console.log('after list');
            return getPointcardBalance(listOfGC)
        }).then(function(list){
            var opts = {};
            opts.centered = false;
            var imageModule = new ImageModule(opts);
            /*imageModule.getSizeFromData=function(imgData) {
                var sizeOf = require('image-size');
                var sizeObj = sizeOf(imgData);
                return [137.57480315,24.188976378];
            };*/
            doc.attachModule(imageModule);
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
                "giftcards" : list.gc,
                "pointcards" : list.pc,
                "discountArr": [],
                "isMerchant": true,
                "orderId": barcode,
                "barcode": imageFile,
                "customerName": req.body.customerName
            });
            doc.render();
            var buf = doc.getZip()
                .generate({type:"nodebuffer"});
            var outputFile = isWin ? __dirname + '\\outputMerchant.docx' : __dirname + '/outputMerchant.docx';
            fs.writeFileSync(outputFile, buf);
            deferred.resolve();
        });
        return deferred.promise;
    };
    var ID;
    util.saveOrder(req, false).then(function(order){
        barcode = order[0].barcode.toString();
        ID = order[0]._id.toString();
        saveMerchantReceipt(ID).then(function(){
            return saveCustomerReceipt();
        }).then(function(){
            if (isWin){
                printDocument();
            }else{
                console.log('Finish');
                res.jsonp([ID]);
            }
        });
    });
};
