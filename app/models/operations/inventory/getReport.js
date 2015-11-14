var mongoose = require('mongoose'),
    _ = require('lodash'),
    PdfPrinter = require('pdfmake'),
    fs = require('fs'),
    moment = require('moment');
var PDFFile = './public/reports/reports.pdf';

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

    console.log("Request Body");
    console.log(req.body);

    connectionDB.collection('orders', function (err, collection) {

        var queryBody;
        if (!req.body.reportType || req.body.reportType === 'DailyReport') {
            queryBody = {
                timePaid: {
                    $gte: givenDate.toDate(),
                    $lt: nextDate.toDate()
                }
            };
        } else {
            queryBody = {
                $query: {'orders.name': 'Giftcard ' + req.body.giftcardNum},
                $orderBy: {timeOrderPlace: 1}
            };
        }

        collection.find(queryBody, function (err, cursor) {
            if (err) {
                console.log(err)
            } else {
                var orders = [];
                cursor.toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        _.map(result, function (i) {
                            orders.push(i);
                        });
                        var report = [];

                        function generateReportRegular(order) {
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
                        }

                        function generateReportGiftCard(order) {
                            _.each(order.orders, function(item) {
                                console.log('generated reports giftcard');
                                if (item.isGiftcard) {
                                    var o = [];
                                    o.push(order.index.toString());
                                    o.push(order.employee.name);
                                    var isPaid = (order.isPaid) ? 'Yes' : 'No';
                                    o.push(isPaid);
                                    var time = moment(order.timePaid).format("MMM-DD-YYYY HH:mm");
                                    o.push(time);
                                    o.push(order.customerName);
                                    o.push('$' + parseFloat(item.price).toFixed(2));
                                    report.push(o);
                                }
                            });

                        }
                        _.each(orders, (!req.body.reportType || req.body.reportType === 'DailyReport') ? generateReportRegular : generateReportGiftCard);
                        saveToPDF(PDFFile, report);
                        res.jsonp([{"status": "success", "pdf": "/reports/reports.pdf"}])
                    }
                });
            }
        })
    });
    var saveToPDF = function (filename, report) {
        var printer = new PdfPrinter(fonts);

        var title = (req.body.reportType === 'checkGiftcard') ?  ('Giftcard ' + req.body.giftcardNum) : (moment(givenDate).format("MMM-DD-YYYY HH:mm")) ;
        var docDefinition = {
            content: [
                { text: 'Report for ' + title  , fontSize: 15 },
                {
                    table: {
                        // headers are automatically repeated if the table spans over multiple pages
                        // you can declare how many rows should be treated as headers
                        headerRows: 1,
                        body: []
                    }
                }
            ]
        };
        docDefinition.content[1].table.body.push(['Index', 'Employee Name', 'Paid?', 'Time Paid', 'Customer Name', 'Total']);
        _.each(report, function (r) {
            docDefinition.content[1].table.body.push(r);
        });
        console.log(docDefinition.content[1].table.body);
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(filename));
        pdfDoc.end();
    }
};
