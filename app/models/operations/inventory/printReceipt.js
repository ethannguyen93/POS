var mongoose = require('mongoose'),
    _ = require('lodash'),
    util = require('util'),
    fs = require('fs'),
    printer = require('printer'),
    printers = printer.getPrinters(),
    lxDocument = require('lx-pdf')('./app/models/operations/inventory/templates/template.json');

var MERCHANT_NAME = 'NiceOne Nails',
    ADDRESS = '123 Wilson Ave.',
    PHONE_NUM = '(123) 456-7890',
    ORDER_TYPE = 'SERVICE',
    LINEBREAK = '==========================';


module.exports = function (req, res) {

    /*
     var body = {
     'type': 'printReceipt',
     'order': $scope.data.order,
     'orders': $scope.data.orders,
     'user': $scope.data.currentUser,
     'customerName': $scope.data.customerName,
     'subtotal': $scope.data.subtotal,
     'tax': $scope.data.tax
     };
     */

    var body = req.body;

    console.log("supported formats are:\n"+util.inspect(printer.getSupportedPrintFormats(), {colors:true, depth:10}));
    console.log("supported job commands:\n"+util.inspect(printer.getSupportedJobCommands(), {colors:true, depth:10}));
    var printerName = printer.getDefaultPrinterName();

    lxDocument.addContent('content', '=== RECEIPT ===');
    lxDocument.addContent('content', MERCHANT_NAME);
    lxDocument.addContent('content', ADDRESS);
    lxDocument.addContent('content', 'PHONE NUMBER: ' + PHONE_NUM);
    lxDocument.addContent('content', '  ');
    var TextToMid = function(text){
        return {text: text, align: 'center'}
    };

    var date = new Date();

    var tableData = [
        [TextToMid('Server: ' + body.user.name), TextToMid('Date: ' + date.getMonth() + '/' + date.getDay() + '/' + date.getYear())],
        [TextToMid('Order #: ' + body.order), TextToMid('Time: ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds())]
    ];
    lxDocument.addTable('content', tableData);
    lxDocument.addContent('content', ORDER_TYPE );

    lxDocument.addContent('content', LINEBREAK);
    var tableHeader = [
        {
            "align": "center",
            width: 30,
            font: {
                size: 6,
                color: '#000000'
            }
        },
        {
            width: 120,
            align: 'center',
            font: {
                size: 6,
                color: '#000000'
            }
        },
        {
            width: 30,
            align: 'right',
            font: {
                size: 6,
                color: '#000000'
            }
        }
    ];
    tableData = [
        /*[{text: '1', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '4', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '5', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '6', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '7', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '8', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '9', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '10', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '11', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '12', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '13', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '14', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '14', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '14', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '14', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '14', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
         [{text: '15', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}]*/
    ];

    function makeRow(text, align) {
        return { 'text' : text , 'align' : align };
    }

    _.each(body.orders, function(orderItem) {
        var row = [];

        row.push(makeRow(orderItem.index, 'center'));
        row.push(makeRow(orderItem.name + ' x ' + orderItem.quantity , 'left'));
        row.push(makeRow('$'+orderItem.price, 'left'));

        tableData.push(row);
    });

    lxDocument.addTable('content', tableData, tableHeader);
    lxDocument.addContent('content', LINEBREAK);
    tableHeader = [
        {
            width: 100,
            font: {
                size: 8,
                color: '#000000'
            }
        },
        {
            width: 5,
            font: {
                size: 8,
                color: '#000000'
            }
        },
        {
            width: 75,
            align: 'right',
            font: {
                size: 8,
                color: '#000000'
            }
        }
    ];



    tableData = [
        [{text: 'SUBTOTAL:', align: 'right'}, '', {text: '$'+body.subtotal, align: 'left'}],
        [{text: 'HST:', align: 'right'}, '',{text: '$'+body.tax, align: 'left'}]

    ];
    lxDocument.addTable('content', tableData, tableHeader);
    lxDocument.addContent('content', LINEBREAK);
    tableData = [
        [{text: 'TOTAL:', align: 'right'}, '', {text: '$'+(body.subtotal+body.tax).toFixed(2), align: 'left'}]
    ];
    tableHeader = [
        {
            width: 100,
            font: {
                size: 8,
                color: '#000000'
            }
        },
        {
            width: 5,
            font: {
                size: 8,
                color: '#000000'
            }
        },
        {
            width: 75,
            align: 'right',
            font: {
                size: 8,
                color: '#000000'
            }
        }
    ];
    lxDocument.addTable('content', tableData, tableHeader);
    var printDocument = function(){
        printer.printDirect({
            data:fs.readFileSync('./document.pdf'), // or simple String: "some text"
            printer:printerName, // printer name
            type: 'PDF', // type: RAW, TEXT, PDF, JPEG, .. depends on platform
            success:function(jobID){
                console.log("sent to printer with ID: "+jobID);
                res.jsonp([]);
            }
            , error:function(err){
                console.log(err);
                res.jsonp([]);
            }
        });
    };
    lxDocument.save('document.pdf', function(result) {
        console.log(result);
        lxDocument.clear();
    });
};
