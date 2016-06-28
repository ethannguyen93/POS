var mongoose = require('mongoose'),
    _ = require('lodash'),
    PdfPrinter = require('pdfmake'),
    fs = require('fs'),
    moment = require('moment'),
    json2csv = require('json2csv'),
    Q = require('Q');
var PDFFile = './public/reports/reports.pdf';
var CSVFile = './public/reports/reports.csv';

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
    var sortBy = (req.body.reportType === 'InventoryReport') ? {date: 1} : {timeOrderPlaced: 1};
    connectionDB.collection(collName, function (err, collection) {
        var queryBody = {};
        if (!req.body.reportType || req.body.reportType === 'DailyReport') {
            queryBody = {
                void: {$exists: false},
                timeOrderPlaced: {
                    $gte: givenDate.toDate(),
                    $lt: nextDate.toDate()
                }
            };
        } else if (req.body.reportType === 'WeeklyReport') {
            queryBody = {
                void: {$exists: false},
                timeOrderPlaced: {
                    $gte: moment(req.body.date).startOf('week').toDate(),
                    $lt: moment(req.body.date).endOf('week').toDate()
                }
            };
        }  else if (req.body.reportType === 'MonthlyReport') {
            queryBody = {
                void: {$exists: false},
                timeOrderPlaced: {
                    $gte: moment(req.body.date).startOf('month').toDate(),
                    $lt: moment(req.body.date).endOf('month').toDate()
                }
            };
        }  else if (req.body.reportType === 'YearlyReport') {
            queryBody = {
                void: {$exists: false},
                timeOrderPlaced: {
                    $gte: moment(req.body.date).startOf('year').toDate(),
                    $lt: moment(req.body.date).endOf('year').toDate()
                }
            };
        } else if (req.body.reportType === 'checkGiftcard') {
            var regex = 'Giftcard ' + req.body.giftcardNum;
            queryBody = {
                isPaid: true,
                'orders.name': {$regex: new RegExp(regex)}
            };
        } else if (req.body.reportType === 'EmployeeReportDaily'){
            queryBody = {
                void: {$exists: false},
                'employee.name': req.body.employeeName,
                isPaid: true,
                timeOrderPlaced: {
                    $gte: moment(req.body.date).startOf('day').toDate(),
                    $lt: moment(req.body.date).endOf('day').toDate()
                }
            };
        }  else if (req.body.reportType === 'EmployeeReportWeekly'){
            queryBody = {
                void: {$exists: false},
                'employee.name': req.body.employeeName,
                isPaid: true,
                timeOrderPlaced: {
                    $gte: moment(req.body.date).startOf('week').toDate(),
                    $lt: moment(req.body.date).endOf('week').toDate()
                }
            };
        }  else if (req.body.reportType === 'EmployeeReportMonthly'){
            queryBody = {
                void: {$exists: false},
                'employee.name': req.body.employeeName,
                isPaid: true,
                timeOrderPlaced: {
                    $gte: moment(req.body.date).startOf('month').toDate(),
                    $lt: moment(req.body.date).endOf('month').toDate()
                }
            };
        }  else if (req.body.reportType === 'EmployeeReportYearly'){
            queryBody = {
                void: {$exists: false},
                'employee.name': req.body.employeeName,
                isPaid: true,
                timeOrderPlaced: {
                    $gte: moment(req.body.date).startOf('year').toDate(),
                    $lt: moment(req.body.date).endOf('year').toDate()
                }
            };
        } else if (req.body.reportType === 'InventoryReport'){
            queryBody = {
                itemBarcode: parseInt(req.body.itemBarcode)
            };
        } else if (req.body.reportType === 'GetAllOrders'){
            queryBody = {
                todayDate : {$exists: false}
            };
        }else{
            queryBody = {
                customerID: req.body.customerID
            };
        }
        collection.find(queryBody).sort(sortBy, function (err, cursor) {
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
                            var time = moment(order.timeOrderPlaced).format("MMM-DD-YYYY HH:mm");
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
                            var discountPrice = (order.discountPrice !== undefined) ? order.discountPrice: 0;
                            o.push('$ -' + (discountPrice).toFixed(2));
                            o.push('$' + (order.tax).toFixed(2));
                            o.push('$' + (order.subtotal + order.tax - discountPrice).toFixed(2));
                            var paymentType = (order.paymentType) ? order.paymentType : '';
                            o.push(paymentType);
                            report.push(o);
                        }

                        function generateAllOrders(order) {
                            _.each(order.orders, function(item) {
                                var o = [];
                                o.push(order._id);
                                //employee
                                o.push(order.employee.name);
                                var isPaid = (order.isPaid) ? 'yes' : 'no';
                                o.push(isPaid);
                                //time
                                var time = moment(order.timeOrderPlaced).format("MMM-DD-YYYY HH:mm");
                                o.push(time);
                                //customer name
                                o.push(order.customerName);
                                var paymentType = (order.paymentType) ? order.paymentType : '';
                                o.push(paymentType);
                                var discountPrice = (order.discountPrice !== undefined) ? order.discountPrice: 0;
                                o.push('$ -' + (discountPrice).toFixed(2));
                                o.push('$' + (order.tax).toFixed(2));
                                o.push('$' + (order.subtotal + order.tax - discountPrice).toFixed(2));
                                o.push(order.ticketNumber);
                                o.push(order.barcode);
                                o.push(item.id);
                                o.push(item.name);
                                o.push(item.price);
                                o.push(item.quantity);
                                o.push(item.barcode);
                                o.push(item.isGiftcard);
                                o.push(item.isPointcard);
                                report.push(o);
                            });
                        }

                        function generateReportRegular(order) {
                            var o = [];
                            //employee
                            o.push(order.employee.name);
                            var isPaid = (order.isPaid) ? 'yes' : 'no';
                            o.push(isPaid);
                            //time
                            var time = moment(order.timeOrderPlaced).format("MMM-DD-YYYY HH:mm");
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
                            var discountPrice = (order.discountPrice !== undefined) ? order.discountPrice: 0;
                            o.push('$ -' + (discountPrice).toFixed(2));
                            o.push('$' + (order.tax).toFixed(2));
                            o.push('$' + (order.subtotal + order.tax - discountPrice).toFixed(2));
                            var paymentType = (order.paymentType) ? order.paymentType : '';
                            o.push(paymentType);
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
                                    var time = moment(order.timeOrderPlaced).format("MMM-DD-YYYY HH:mm");
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
                            var time = moment(order.timeOrderPlaced).format("MMM-DD-YYYY HH:mm");
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
                            var discountPrice = (order.discountPrice !== undefined) ? order.discountPrice: 0;
                            o.push('$ -' + (discountPrice).toFixed(2));
                            o.push('$' + (order.tax).toFixed(2));
                            o.push('$' + (order.subtotal + order.tax - discountPrice).toFixed(2));
                            var paymentType = (order.paymentType) ? order.paymentType : '';
                            o.push(paymentType);
                            report.push(o);
                        }
                        function addAllContent(){
                            _.each(orders, generateAllOrders);
                            tableCols = ['orderId', 'Employee', 'isPaid?' ,'Time Order Placed', 'Customer', 'Payment Type', 'Discount', 'Tax', 'Total', 'Ticket Number',
                            'Order barcode' , 'itemId' , 'Item Name' , 'Item Price' , 'Item Quantity' , 'Item Barcode' , 'Is Item Giftcard?' , 'Is Item Pointcard?'];
                        };
                        function addRegularContent(){
                            _.each(orders, generateReportRegular);
                            tableCols = ['Employee', 'isPaid?' ,'Time Paid', 'Customer', 'Subtotal', 'Giftcard', 'Pointcard', 'Discount', 'Tax', 'Total', 'PaymentType'];
                            var sumSubtotal = 0;
                            var sumGiftcard = 0;
                            var sumPointcard = 0;
                            var sumDiscount = 0;
                            var sumTotal = 0;
                            var sumTax = 0;
                            var sumCash = 0;
                            var sumOther = 0;
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
                                if (item[tableCols.indexOf('PaymentType')] === 'Cash') {
                                    sumCash += total
                                } else {
                                    sumOther += total;
                                }
                            });
                            sumSubtotal = '$' + sumSubtotal.toFixed(2);
                            sumGiftcard = '$' + sumGiftcard.toFixed(2);
                            sumDiscount = '$' + sumDiscount.toFixed(2);
                            sumPointcard = '$' + sumPointcard.toFixed(2);
                            sumTotal = '$' + sumTotal.toFixed(2);
                            sumTax = '$' + sumTax.toFixed(2);
                            sumCash = '$' + sumCash.toFixed(2);
                            sumOther = '$' + sumOther.toFixed(2);
                            report.push(['','', '','Total:', sumSubtotal, sumGiftcard, sumPointcard, sumDiscount, sumTax, sumTotal, '']);
                            report.push(['','', '','Total Cash:', '', '', '', '', '', sumCash, '']);
                            report.push(['','', '','Total Other:', '', '', '', '', '', sumOther, '']);
                        };
                        function addCustomerContent(){
                            _.each(orders, generateCustomerReport);
                            tableCols = ['Employee', 'Time Paid', 'Customer', 'Subtotal', 'Giftcard', 'Discount', 'Tax', 'Total', 'PaymentType'];
                            var sumSubtotal = 0;
                            var sumGiftcard = 0;
                            var sumDiscount = 0;
                            var sumTotal = 0;
                            var sumTax = 0;
                            var sumCash = 0;
                            var sumOther = 0;
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
                                if (item[tableCols.indexOf('PaymentType')] === 'Cash') {
                                    sumCash += total
                                } else {
                                    sumOther += total;
                                }
                            });
                            sumSubtotal = '$' + sumSubtotal.toFixed(2);
                            sumGiftcard = '$' + sumGiftcard.toFixed(2);
                            sumDiscount = '$' + sumDiscount.toFixed(2);
                            sumTotal = '$' + sumTotal.toFixed(2);
                            sumTax = '$' + sumTax.toFixed(2);
                            sumCash = '$' + sumCash.toFixed(2);
                            sumOther = '$' + sumOther.toFixed(2);
                            report.push(['','','Total:', sumSubtotal, sumGiftcard, sumDiscount, sumTax, sumTotal, '']);
                            report.push(['','','Total Cash:', '', '', '', '', sumCash, '']);
                            report.push(['','','Total Other:', '', '', '', '', sumOther, '']);
                        }
                        function addEmployeeContent(){
                            _.each(orders, generateEmployeeReport);
                            tableCols = ['Employee', 'Time Paid', 'Customer', 'Subtotal', 'Giftcard', 'Discount', 'Tax', 'Total', 'PaymentType'];
                            var sumSubtotal = 0;
                            var sumGiftcard = 0;
                            var sumDiscount = 0;
                            var sumTotal = 0;
                            var sumTax = 0;
                            var sumCash = 0;
                            var sumOther = 0;
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
                                if (item[tableCols.indexOf('PaymentType')] === 'Cash') {
                                    sumCash += total
                                } else {
                                    sumOther += total;
                                }
                            });
                            sumSubtotal = '$' + sumSubtotal.toFixed(2);
                            sumGiftcard = '$' + sumGiftcard.toFixed(2);
                            sumDiscount = '$' + sumDiscount.toFixed(2);
                            sumTotal = '$' + sumTotal.toFixed(2);
                            sumTax = '$' + sumTax.toFixed(2);
                            sumCash = '$' + sumCash.toFixed(2);
                            sumOther = '$' + sumOther.toFixed(2);
                            report.push(['','','Total:', sumSubtotal, sumGiftcard, sumDiscount, sumTax, sumTotal, '']);
                            report.push(['','','Total Cash:', '', '', '', '', sumCash, '']);
                            report.push(['','','Total Other:', '', '', '', '', sumOther, '']);
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
                                case 'GetAllOrders' :
                                    addAllContent();
                                    break;
                                case 'DailyReport' :
                                    addRegularContent();
                                    break;
                                case 'WeeklyReport':
                                case 'MonthlyReport':
                                case 'YearlyReport':
                                    addRegularContent();
                                    if (req.body.exportType === 'PDF'){
                                        report = [_.last(report)];
                                    }
                                    break;
                                case 'CustomerReport':
                                    addCustomerContent();
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
                                    addEmployeeContent();
                                    break;
                                case 'EmployeeReportWeekly':
                                case 'EmployeeReportMonthly':
                                case 'EmployeeReportYearly':
                                    addEmployeeContent();
                                    if (req.body.exportType === 'PDF'){
                                        report = [_.last(report)];
                                    }
                                    break;
                            }
                        }
                        if (req.body.exportType === 'PDF' && req.body.reportType !== 'GetAllOrders'){
                            saveToPDF(PDFFile, report, tableCols).then(function(){
                                res.jsonp([{"status": "success", "pdf": "/reports/reports.pdf"}])
                            });
                        }else{
                            saveToCSV(CSVFile, report, tableCols).then(function(){
                                res.jsonp([{"status": "success", "pdf": "/reports/reports.csv"}])
                            });
                        }
                    }
                });
            }
        })
    });
    var saveToPDF = function (filename, report, tableCols) {
        var deferred = Q.defer();
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
        deferred.resolve();
        return deferred.promise;
    };
    var saveToCSV = function (filename, report, tableCols){
        var deferred = Q.defer();
        var data = [];
        _.each(report, function(r){
            var detail = {};
            for (var i = 0; i < tableCols.length; i++){
                detail[tableCols[i]] = r[i];
            }
            data.push(detail);
        });
        data = _.without(data, _.last(data));
        json2csv({ data: data, fields: tableCols }, function(err, csv) {
            if (err) console.log(err);
            fs.writeFile(filename, csv, function(err) {
                if (err) throw err;
                console.log('file saved');
                deferred.resolve();
            });
        });
        return deferred.promise;
    }
};
