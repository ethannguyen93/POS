// Twilio Credentials
var accountSid = 'ACc6d06b7c7cc18f2b04ca09f823f69a8f';
var authToken = 'f0b37ac21592628e9f9abd792add153f';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);
var cronJob = require('cron').CronJob;

var date = new Date("January 18, 2016 10:58:00");

var textJob = new cronJob(date, function(){
    //Retrieve data from mongo then send to the list
    client.messages.create({
        to: "6478359012",
        from: "+16475600735",
        body: "Hello World. Testing testing1"
    }, function(err, message) {
        console.log(message.sid);
    });
    client.messages.create({
        to: "6478359012",
        from: "+16475600735",
        body: "Hello World. Testing testing2"
    }, function(err, message) {
        console.log(message.sid);
    });
    textJob.stop();
},  function(){
    console.log('done');
}, true);

textJob.start();

/*
client.messages.create({
    to: "6478359012",
    from: "+16475600735",
    body: "Hello World. Testing testing",
}, function(err, message) {
    console.log(message.sid);
});
*/
