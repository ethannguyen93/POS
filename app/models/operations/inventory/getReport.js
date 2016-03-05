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
    var collName = (req.body.reportType === 'InventoryReport') ? 'inventoryTracking' : 'orders';
    connectionDB.collection(collName, function (err, collection) {
        var queryBody = {};
        if (!req.body.reportType || req.body.reportType === 'DailyReport') {
            queryBody = {
                void: {$exists: false},
                timePaid: {
                    $gte: givenDate.toDate(),
                    $lt: nextDate.toDate()
                }
            };
        } else if (req.body.reportType === 'WeeklyReport') {
            queryBody = {
                void: {$exists: false},
                timePaid: {
                    $gte: moment(req.body.date).startOf('week').toDate(),
                    $lt: moment(req.body.date).endOf('week').toDate()
                }
            };
        }  else if (req.body.reportType === 'MonthlyReport') {
            queryBody = {
                void: {$exists: false},
                timePaid: {
                    $gte: moment(req.body.date).startOf('month').toDate(),
                    $lt: moment(req.body.date).endOf('month').toDate()
                }
            };
        }  else if (req.body.reportType === 'YearlyReport') {
            queryBody = {
                void: {$exists: false},
                timePaid: {
                    $gte: moment(req.body.date).startOf('year').toDate(),
                    $lt: moment(req.body.date).endOf('year').toDate()
                }
            };
        } else if (req.body.reportType === 'checkGiftcard') {
            var regex = 'Giftcard ' + req.body.giftcardNum;
            queryBody = {
                $query: { isPaid: true, 'orders.name': new RegExp(regex)},
                $orderBy: {timeOrderPlace: 1}
            };
        } else if (req.body.reportType === 'EmployeeReportDaily'){
            queryBody = {
                void: {$exists: false},
                'employee.name': req.body.employeeName,
                timePaid: {
                    $gte: moment(req.body.date).startOf('day').toDate(),
                    $lt: moment(req.body.date).endOf('day').toDate()
                }
            };
        }  else if (req.body.reportType === 'EmployeeReportWeekly'){
            queryBody = {
                void: {$exists: false},
                'employee.name': req.body.employeeName,
                timePaid: {
                    $gte: moment(req.body.date).startOf('week').toDate(),
                    $lt: moment(req.body.date).endOf('week').toDate()
                }
            };
        }  else if (req.body.reportType === 'EmployeeReportMontly'){
            queryBody = {
                void: {$exists: false},
                'employee.name': req.body.employeeName,
                timePaid: {
                    $gte: moment(req.body.date).startOf('month').toDate(),
                    $lt: moment(req.body.date).endOf('month').toDate()
                }
            };
        }  else if (req.body.reportType === 'EmployeeReportYearly'){
            queryBody = {
                void: {$exists: false},
                'employee.name': req.body.employeeName,
                timePaid: {
                    $gte: moment(req.body.date).startOf('year').toDate(),
                    $lt: moment(req.body.date).endOf('year').toDate()
                }
            };
        } else if (req.body.reportType === 'InventoryReport'){
            queryBody = {
                itemBarcode: parseInt(req.body.itemBarcode)
            };
        }else{
            queryBody = {
                customerID: req.body.customerID
            };
        }
        console.log(queryBody);
        collection.find(queryBody, function (err, cursor) {
            if (err) {
                console.log(err)
            } else {
                var orders = [];
                cursor.toArray(function (err, result) {
                    console.log(result);
                    if (err) {
                        console.log(err);
                    } else {
                        _.map(result, function (i) {
                            orders.push(i);
                        });
                        var report = [];
                        var tableCols = [];
                        function generateInventoryReport(order) {
                            var o = [];
                            o.push(order.itemName);
                            var time = moment(order.date).format("MMM-DD-YYYY HH:mm");
                            o.push(time);
                            o.push(order.type);
                            o.push(order.quantity.toString());
                            report.push(o);
                        }
                        function generateCustomerReport(order) {
                            var o = [];
                            //employee
                            o.push(order.employee.name);
                            //time
                            var time = moment(order.timePaid).format("MMM-DD-YYYY HH:mm");
                            o.push(time);
                            //customer name
                            o.push(order.customerName);
                            //subtotal
                            var totalBeforeGC = 0;
                            var Giftcard = 0;
                            var tax = order.isTax ? 1.13 : 1;
                            _.each(order.orders, function(item){
                                if (!item.isGiftcard){
                                    totalBeforeGC += item.quantity * item.price;
                                }else{
                                    Giftcard += item.price;
                                }
                            });
                            o.push('$' + (totalBeforeGC).toFixed(2));
                            o.push('$' + (Giftcard).toFixed(2));
                            o.push('$' + (order.tax).toFixed(2));
                            var discountPrice = (order.discountPrice !== undefined) ? order.discountPrice: 0;
                            o.push('$ -' + (discountPrice).toFixed(2));
                            o.push('$' + (order.subtotal + order.tax - discountPrice).toFixed(2));
                            o.push(order.paymentType);
                            report.push(o);
                        }

                        function generateReportRegular(order) {
                            var o = [];
                            //employee
                            o.push(order.employee.name);
                            //time
                            var time = moment(order.timePaid).format("MMM-DD-YYYY HH:mm");
                            o.push(time);
                            //customer name
                            o.push(order.customerName);
                            //subtotal
                            var totalBeforeGC = 0;
                            var Giftcard = 0;
                            var Pointcard = 0;
                            var tax = order.isTax ? 1.13 : 1;
                            _.each(order.orders, function(item){
                                if (!item.isGiftcard && !item.isPointcard){
                                    totalBeforeGC += item.quantity * item.price;
                                }else if (item.isGiftcard){
                                    Giftcard += item.price;
                                }else if (item.isPointcard){
                                    Pointcard += item.price;
                                }
                            });
                            o.push('$' + (totalBeforeGC).toFixed(2));
                            o.push('$' + (Giftcard).toFixed(2));
                            o.push('$' + (Pointcard).toFixed(2));
                            o.push('$' + (order.tax).toFixed(2));
                            var discountPrice = (order.discountPrice !== undefined) ? order.discountPrice: 0;
                            o.push('$ -' + (discountPrice).toFixed(2));
                            o.push('$' + (order.subtotal + order.tax - discountPrice).toFixed(2));
                            o.push(order.paymentType);
                            report.push(o);
                        }

                        function generateReportGiftCard(order) {
                            function stringStartsWith (string, prefix) {
                                return string.slice(0, prefix.length) == prefix;
                            }
                            _.each(order.orders, function(item) {
                                if (item.isGiftcard && stringStartsWith(item.name, 'Giftcard ' + req.body.giftcardNum)) {
                                    var o = [];
                                    o.push(order.index.toString());
                                    o.push(order.employee.name);
                                    var time = moment(order.timePaid).format("MMM-DD-YYYY HH:mm");
                                    o.push(time);
                                    o.push(order.customerName);
                                    o.push('$' + parseFloat(item.price).toFixed(2));
                                    report.push(o);
                                }
                            });
                        }

                        function generateEmployeeReport(order) {
                            var o = [];
                            //employee
                            o.push(order.employee.name);
                            //time
                            var time = moment(order.timePaid).format("MMM-DD-YYYY HH:mm");
                            o.push(time);
                            //customer name
                            o.push(order.customerName);
                            //subtotal
                            var totalBeforeGC = 0;
                            var Giftcard = 0;
                            var tax = order.isTax ? 1.13 : 1;
                            _.each(order.orders, function(item){
                                if (!item.isGiftcard){
                                    totalBeforeGC += item.quantity * item.price;
                                }else{
                                    Giftcard += item.price;
                                }
                            });
                            o.push('$' + (totalBeforeGC).toFixed(2));
                            o.push('$' + (Giftcard).toFixed(2));
                            o.push('$' + (order.tax).toFixed(2));
                            var discountPrice = (order.discountPrice !== undefined) ? order.discountPrice: 0;
                            o.push('$ -' + (discountPrice).toFixed(2));
                            o.push('$' + (order.subtotal + order.tax - discountPrice).toFixed(2));
                            o.push(order.paymentType);
                            report.push(o);
                        }

                        if (req.body.reportType){
                            switch (req.body.reportType){
                                case 'InventoryReport':
                                    _.each(orders, generateInventoryReport);
                                    tableCols = ['Name', 'Time', 'Type', 'Quantity'];
                                    var remainder = 0;
                                    _.each(report,function(item){
                                        remainder += parseInt(item[tableCols.indexOf('Quantity')]);
                                    });
                                    remainder = remainder.toString();
                                    report.push(['','','Remaining:', remainder]);
                                    break;
                                case 'DailyReport' :
                                case 'WeeklyReport':
                                case 'MonthlyReport':
                                case 'YearlyReport':
                                    _.each(orders, generateReportRegular);
                                    tableCols = ['Employee', 'Time Paid', 'Customer', 'Subtotal', 'Giftcard', 'Pointcard', 'Tax', 'Discount', 'Total', 'PaymentType'];
                                    var sumSubtotal = 0;
                                    var sumGiftcard = 0;
                                    var sumPointcard = 0;
                                    var sumDiscount = 0;
                                    var sumTotal = 0;
                                    var sumTax = 0;
                                    _.each(report,function(item){
                                        //remove $ sign then add new total
                                        var subtotal = parseFloat(item[tableCols.indexOf('Subtotal')].substring(1));
                                        var giftcard = parseFloat(item[tableCols.indexOf('Giftcard')].substring(1));
                                        var pointcard = parseFloat(item[tableCols.indexOf('Pointcard')].substring(1));
                                        var discount = parseFloat(item[tableCols.indexOf('Discount')].substring(1));
                                        var total = parseFloat(item[tableCols.indexOf('Total')].substring(1));
                                        var tax = parseFloat(item[tableCols.indexOf('Tax')].substring(1));
                                        sumSubtotal += subtotal;
                                        sumGiftcard += giftcard;
                                        sumPointcard += pointcard;
                                        sumDiscount += discount;
                                        sumTax += tax;
                                        sumTotal += total;
                                    });
                                    sumSubtotal = '$' + sumSubtotal.toFixed(2);
                                    sumGiftcard = '$' + sumGiftcard.toFixed(2);
                                    sumDiscount = '$' + sumDiscount.toFixed(2);
                                    sumPointcard = '$' + sumPointcard.toFixed(2);
                                    sumTotal = '$' + sumTotal.toFixed(2);
                                    sumTax = '$' + sumTax.toFixed(2);
                                    report.push(['','','Total:', sumSubtotal, sumGiftcard, sumPointcard, sumTax, sumDiscount, sumTotal, '']);
                                    break;
                                case 'CustomerReport':
                                    _.each(orders, generateCustomerReport);
                                    tableCols = ['Employee', 'Time Paid', 'Customer', 'Subtotal', 'Giftcard', 'Tax', 'Discount', 'Total', 'PaymentType'];
                                    var sumSubtotal = 0;
                                    var sumGiftcard = 0;
                                    var sumDiscount = 0;
                                    var sumTotal = 0;
                                    var sumTax = 0;
                                    _.each(report,function(item){
                                        //remove $ sign then add new total
                                        var subtotal = parseFloat(item[tableCols.indexOf('Subtotal')].substring(1));
                                        var giftcard = parseFloat(item[tableCols.indexOf('Giftcard')].substring(1));
                                        var discount = parseFloat(item[tableCols.indexOf('Discount')].substring(1));
                                        var total = parseFloat(item[tableCols.indexOf('Total')].substring(1));
                                        var tax = parseFloat(item[tableCols.indexOf('Tax')].substring(1));
                                        sumSubtotal += subtotal;
                                        sumGiftcard += giftcard;
                                        sumDiscount += discount;
                                        sumTax += tax;
                                        sumTotal += total;
                                    });
                                    sumSubtotal = '$' + sumSubtotal.toFixed(2);
                                    sumGiftcard = '$' + sumGiftcard.toFixed(2);
                                    sumDiscount = '$' + sumDiscount.toFixed(2);
                                    sumTotal = '$' + sumTotal.toFixed(2);
                                    sumTax = '$' + sumTax.toFixed(2);
                                    report.push(['','','Total:', sumSubtotal, sumGiftcard, sumTax, sumDiscount, sumTotal, '']);
                                    break;
                                case 'checkGiftcard':
                                    _.each(orders, generateReportGiftCard);
                                    tableCols = ['Index', 'Employee Name', 'Time Paid', 'Customer Name', 'Total'];
                                    var sumTotal = 0;
                                    _.each(report,function(item){
                                        //remove $ sign then add new total
                                        var total = parseFloat(item[tableCols.indexOf('Total')].substring(1));
                                        sumTotal += total;
                                    });
                                    sumTotal = '$' + sumTotal.toFixed(2);
                                    report.push(['','', '','Total:', sumTotal]);
                                    break;
                                case 'EmployeeReportDaily':
                                case 'EmployeeReportWeekly':
                                case 'EmployeeReportMontly':
                                case 'EmployeeReportYearly':
                                    _.each(orders, generateEmployeeReport);
                                    tableCols = ['Employee', 'Time Paid', 'Customer', 'Subtotal', 'Giftcard', 'Tax', 'Discount', 'Total', 'PaymentType'];
                                    var sumSubtotal = 0;
                                    var sumGiftcard = 0;
                                    var sumDiscount = 0;
                                    var sumTotal = 0;
                                    var sumTax = 0;
                                    _.each(report,function(item){
                                        //remove $ sign then add new total
                                        var subtotal = parseFloat(item[tableCols.indexOf('Subtotal')].substring(1));
                                        var giftcard = parseFloat(item[tableCols.indexOf('Giftcard')].substring(1));
                                        var discount = parseFloat(item[tableCols.indexOf('Discount')].substring(1));
                                        var total = parseFloat(item[tableCols.indexOf('Total')].substring(1));
                                        var tax = parseFloat(item[tableCols.indexOf('Tax')].substring(1));
                                        sumSubtotal += subtotal;
                                        sumGiftcard += giftcard;
                                        sumDiscount += discount;
                                        sumTax += tax;
                                        sumTotal += total;
                                    });
                                    sumSubtotal = '$' + sumSubtotal.toFixed(2);
                                    sumGiftcard = '$' + sumGiftcard.toFixed(2);
                                    sumDiscount = '$' + sumDiscount.toFixed(2);
                                    sumTotal = '$' + sumTotal.toFixed(2);
                                    sumTax = '$' + sumTax.toFixed(2);
                                    report.push(['','','Total:', sumSubtotal, sumGiftcard, sumTax, sumDiscount, sumTotal, '']);
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
            pageOrientation: 'landscape',
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
