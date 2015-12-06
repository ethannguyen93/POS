var mongoose = require('mongoose'),
    _ = require('lodash'),
    util = require('util'),
    fs = require('fs'),
    moment = require('moment'),
    Docxtemplater = require('docxtemplater');

module.exports = function (req, res) {
    console.log(req.body);
    var content = fs
        .readFileSync(__dirname + "/template.docx", "binary");

    var doc = new Docxtemplater(content);
    var now = new Date();
    var nowFormat = moment(now).format('MM/DD/YY hh:mm a');
    var order = [];
    _.each(req.body.orders, function(o){
        var ord = {};
        ord.quantity = o.quantity;
        ord.item = o.name;
        ord.price = o.price;
        order.push(ord);
    });
    var total = req.body.tax + req.body.subtotal;
    doc.setData({
        "server":req.body.user.name,
        "order":req.body.order,
        "time":nowFormat,
        "orders": order,
        "subtotal": req.body.subtotal.toFixed(2),
        "tax": req.body.tax.toFixed(2),
        "total": total.toFixed(2)
    });
    doc.render();
    var buf = doc.getZip()
        .generate({type:"nodebuffer"});

    fs.writeFileSync(__dirname + "/output.docx",buf);
    var printDocument = function(){
        var exec = require('child_process').exec;
        var scriptFile = "cscript " + __dirname + '\\printFile.vbs';
        console.log(scriptFile);
        var child = exec(scriptFile, function (error, stdout, stderr) {
            child.kill();
            res.jsonp([]);
        });
    };
    printDocument();
};
