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

    connectionDB.collection('orders', function (err, collection) {

        var queryBody;
        if (!req.body.reportType || req.body.reportType === 'DailyReport' || req.body.reportType === 'EmployeeReport') {
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
                        var tableCols = [];
                        function generateReportRegular(order) {
                            var o = [];
                            o.push(order.index.toString());
                            o.push(order.employee.name);
                            var isPaid = (order.isPaid) ? 'Yes' : 'No';
                            o.push(isPaid);
                            var time = moment(order.timePaid).format("MMM-DD-YYYY HH:mm");
                            o.push(time);
                            o.push(order.customerName);
                            var totalBeforeGC = 0;
                            var tax = order.isTax ? 1.13 : 1;
                            _.each(order.orders, function(item){
                                if (!item.isGiftcard){
                                    totalBeforeGC += item.quantity * item.price * tax;
                                }
                            });
                            o.push('$' + (totalBeforeGC).toFixed(2));
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

                        function generateEmployeeReport(order) {
                            var r = _.find(report, function(r){
                                return r[0] === order.employee.name
                            });
                            var totalBeforeGC = 0;
                            var tax = order.isTax ? 1.13 : 1;
                            _.each(order.orders, function(item){
                                if (!item.isGiftcard){
                                    totalBeforeGC += item.quantity * item.price * tax;
                                }
                            });
                            if (r !== undefined){
                                //remove $ sign then add new total
                                r[1] = r[1].substring(1);
                                r[1] = parseFloat(r[1]);
                                r[1] += totalBeforeGC;
                                r[1] = '$' + r[1].toFixed(2);
                            }else{
                                var o = [];
                                o.push(order.employee.name);
                                o.push('$' + (totalBeforeGC).toFixed(2));
                                report.push(o);
                            }
                        }

                        if (req.body.reportType){
                            switch (req.body.reportType){
                                case 'DailyReport':
                                    _.each(orders, generateReportRegular);
                                    tableCols = ['Index', 'Employee Name', 'Paid?', 'Time Paid', 'Customer Name', 'Total-Before GC', 'Total-After GC'];
                                    var sumBeforeGC = 0;
                                    var sumAfterGC = 0;
                                    _.each(report,function(item){
                                        //remove $ sign then add new total
                                        var valueBeforeGC = parseFloat(item[tableCols.indexOf('Total-Before GC')].substring(1));
                                        var valueAfterGC = parseFloat(item[tableCols.indexOf('Total-After GC')].substring(1));
                                        sumBeforeGC += valueBeforeGC;
                                        sumAfterGC += valueAfterGC;
                                    });
                                    sumBeforeGC = '$' + sumBeforeGC.toFixed(2);
                                    sumAfterGC = '$' + sumAfterGC.toFixed(2);
                                    report.push(['','','','','Total:', sumBeforeGC, sumAfterGC]);
                                    break;
                                case 'checkGiftcard':
                                    _.each(orders, generateReportGiftCard);
                                    tableCols = ['Index', 'Employee Name', 'Paid?', 'Time Paid', 'Customer Name', 'Total'];

                                    break;
                                case 'EmployeeReport':
                                    _.each(orders, generateEmployeeReport);
                                    tableCols = ['Employee', 'Total'];
                                    break;
                            }
                        }
                        //_.each(orders, (!req.body.reportType || req.body.reportType === 'DailyReport') ? generateReportRegular : generateReportGiftCard);
                        saveToPDF(PDFFile, report, tableCols);
                        res.jsonp([{"status": "success", "pdf": "/reports/reports.pdf"}])
                    }
                });
            }
        })
    });
    var saveToPDF = function (filename, report, tableCols) {
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
        docDefinition.content[1].table.body.push(tableCols);
        _.each(report, function (r) {
            docDefinition.content[1].table.body.push(r);
        });
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(filename));
        pdfDoc.end();
    }
};
