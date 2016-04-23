var mongoose = require('mongoose'),
    Q = require('q'),
    _ = require('lodash'),
    util = require('../util');

module.exports = function (req, res) {
    console.log("[saveOrder.js] Reached!");
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('orders', function (err, collection) {
        util.getIndexFromOrders().then(function(index){
            if (!req.body.order){
                collection.insert({
                    employee: req.body.user,
                    orders: req.body.orders,
                    isPaid: false,
                    timeOrderPlaced: new Date(),
                    index: index+1,
                    customerName: req.body.customerName,
                    subtotal: req.body.subtotal,
                    tax: req.body.tax,
                    discount: req.body.discount,
                    discountType: req.body.discountType,
                    discountPrice: req.body.discountPrice,
                    customerID: req.body.customerID,
                    paymentType: req.body.paymentType,
                    ticketNumber: req.body.ticketNumber
                }, function(err, result){
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("saved successfully!");
                        res.jsonp([result]);
                    }
                })
            }else{
                collection.update(
                    {
                        _id: mongoose.Types.ObjectId(req.body.order)
                    },
                    {
                        $set: {
                            orders: req.body.orders,
                            subtotal: req.body.subtotal,
                            tax: req.body.tax,
                            discount: req.body.discount,
                            discountType: req.body.discountType,
                            discountPrice: req.body.discountPrice,
                            paymentType: req.body.paymentType,
                            ticketNumber: req.body.ticketNumber
                        }
                    }, function(err, result){
                        if (err) {
                            console.log(err)
                        } else {
                            res.jsonp([result]);
                        }
                    })
            }
        });
    });
};
