var mongoose = require('mongoose'),
    _ = require('lodash'),
    util = require('util'),
    fs = require('fs'),
    moment = require('moment'),
    Docxtemplater = require('docxtemplater');

module.exports = function (req, res) {
    console.log(req.body);
    var isWin = /^win/.test(process.platform);
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
    var total = req.body.tax + req.body.subtotal - req.body.discountPrice;
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
        "discount": req.body.discountPrice.toFixed(2)
    });
    doc.render();
    var buf = doc.getZip()
        .generate({type:"nodebuffer"});
    var outputFileName = isWin ? __dirname + '\\output.docx' : __dirname + '/output.docx';
    fs.writeFileSync(outputFileName, buf);
    var printDocument = function(){
        var exec = require('child_process').exec;
        var scriptFile = "cscript " + __dirname + '\\printFile.vbs';
        console.log(scriptFile);
        var child = exec(scriptFile, function (error, stdout, stderr) {
            child.kill();
            res.jsonp([]);
        });
    };
    if (isWin){
        printDocument();
    }else{
        res.jsonp([]);
    }
};
