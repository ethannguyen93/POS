var fs = require('fs'),
    xml2js = require('xml2js'),
    mongoose = require('mongoose'),
    _ = require('lodash'),
    Q = require('q');

module.exports = function (req, res) {
    console.log('here');
    var parser = new xml2js.Parser();
    fs.readFile('./app/models/operations/stock/test.xml', 'utf8', function(err, data) {
        console.log(data);
        console.log('done');
    });
};
