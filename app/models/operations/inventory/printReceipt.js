var mongoose = require('mongoose'),
    _ = require('lodash'),
    util = require('util'),
    fs = require('fs'),
    printer = require('printer'),
    printers = printer.getPrinters(),
    lxDocument = require('lx-pdf')('./app/models/operations/inventory/templates/template.json');

module.exports = function (req, res) {
    console.log("supported formats are:\n"+util.inspect(printer.getSupportedPrintFormats(), {colors:true, depth:10}));
    console.log("supported job commands:\n"+util.inspect(printer.getSupportedJobCommands(), {colors:true, depth:10}));
    var printerName = printer.getDefaultPrinterName();

    lxDocument.addContent('content', '***RECEIPT***');
    lxDocument.addContent('content', 'RESTAURANT NAME');
    lxDocument.addContent('content', 'ADDRESS');
    lxDocument.addContent('content', 'PHONE NUMBER: (123) 456-7890');
    lxDocument.addContent('content', '  ');
    var TextToMid = function(text){
        return {text: text, align: 'center'}
    };
    var tableData = [
        [TextToMid('Server: Ethan'), TextToMid('Data: 11/12/2015')],
        [TextToMid('Check: 12345'), TextToMid('Time: 2:28:12 PM')]
    ];
    lxDocument.addTable('content', tableData);
    lxDocument.addContent('content', 'SERVICE');
    lxDocument.addContent('content', '****************************************');
    
    var tableHeader = [
        {
            "align": "center",
            width: 30,
            font: {
                size: 12,
                color: '#000000'
            }
        },
        {
            width: 120,
            align: 'center',
            font: {
                size: 12,
                color: '#000000'
            }
        },
        {
            width: 30,
            align: 'right',
            font: {
                size: 12,
                color: '#000000'
            }
        }
    ];
    tableData = [
        [{text: '1', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}],
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
        [{text: '15', align: 'center'}, {text: 'Pizza', align: 'left'},{text: '$10', align: 'left'}]
    ];
    lxDocument.addTable('content', tableData, tableHeader);
    lxDocument.addContent('content', '****************************************');
    tableHeader = [
        {
            width: 120,
            font: {
                size: 12,
                color: '#000000'
            }
        },
        {
            width: 30,
            font: {
                size: 12,
                color: '#000000'
            }
        },
        {
            width: 30,
            align: 'right',
            font: {
                size: 12,
                color: '#000000'
            }
        }
    ];
    tableData = [
        [{text: 'SUBTOTAL:', align: 'right'}, '', {text: '$10', align: 'left'}],
        [{text: 'HST:', align: 'right'}, '',{text: '$10', align: 'left'}]

    ];
    lxDocument.addTable('content', tableData, tableHeader);
    lxDocument.addContent('content', '****************************************');
    tableData = [
        [{text: 'TOTAL:', align: 'right'}, '', {text: '$10', align: 'left'}]
    ];
    tableHeader = [
        {
            width: 120,
            font: {
                size: 12,
                color: '#000000'
            }
        },
        {
            width: 30,
            font: {
                size: 12,
                color: '#000000'
            }
        },
        {
            width: 30,
            align: 'right',
            font: {
                size: 12,
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
