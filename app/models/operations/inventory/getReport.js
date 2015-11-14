var mongoose = require('mongoose'),
    _ = require('lodash'),
    PdfPrinter = require('pdfmake'),
    fs = require('fs'),
    moment = require('moment');
var PDFFile = './reports.pdf';

module.exports = function (req, res) {
    var fonts = {
        Roboto: {
            normal: './app/models/operations/inventory/fonts/Roboto-Regular.ttf',
            bold: './app/models/operations/inventory/fonts/Roboto-Medium.ttf',
            italics: './app/models/operations/inventory/fonts/Roboto-Italic.ttf',
            bolditalics: './app/models/operations/inventory/fonts/Roboto-Italic.ttf'
        }
    };
    var givenDate = moment(req.body.date).startOf('day');
    var nextDate = moment(givenDate).add(1, 'days');
    var connectionDB = mongoose.connection.db;
    connectionDB.collection('orders', function (err, collection) {
        collection.find(
            {
                timePaid: {
                    $gte: givenDate.toDate(),
                    $lt: nextDate.toDate()
                }
            }, function(err, cursor){
            if (err) {
                console.log(err)
            } else {
                var orders = [];
                cursor.toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        _.map(result, function(i){
                            orders.push(i);
                        });
                        var report = [];
                        _.each(orders, function(order){
                            var o = [];
                            o.push(order.index.toString());
                            o.push(order.employee.name);
                            var isPaid = (order.isPaid) ? 'Yes' : 'No';
                            o.push(isPaid);
                            var time = moment(order.timePaid).format("MMM-DD-YYYY HH:mm");
                            o.push(time);
                            o.push(order.customerName);
                            o.push('$' + (order.subtotal + order.tax).toFixed(2));
                            report.push(o);
                        });
                        saveToPDF(PDFFile, report);
                    }
                });
            }
        })
    });
    var saveToPDF = function(filename, report){
        var printer = new PdfPrinter(fonts);
        var docDefinition = {
            content: [
                {
                    table: {
                        // headers are automatically repeated if the table spans over multiple pages
                        // you can declare how many rows should be treated as headers
                        headerRows: 1,
                        body: [
                        ]
                    }
                }
            ]
        };
        docDefinition.content[0].table.body.push([ 'Index', 'Employee Name', 'Paid?', 'Time Paid', 'Customer Name', 'Total' ]);
        _.each(report, function(r){
            docDefinition.content[0].table.body.push(r);
        });
        console.log(docDefinition.content[0].table.body);
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(filename));
        pdfDoc.end();
    }
};
