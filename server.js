var express = require('express');
var firebase = require('firebase');
var bodyParser = require('body-parser');
var rwg = require('random-word-generator');
var twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_CODE);

var fb = new firebase(process.env.FIREBASE_URL);
var generator = new rwg();
var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', function(req, res) {
    res.sendfile("./index.html");
});

app.post('/gethelp', function(req, res) {
    var client = req.body.client;
    var subject = req.body.subject;
    var room = 'http://appear.in/' + generator.generate();

    var fbChild = fb.child(subject);
    fbChild.once('value', function(datasnap) {
        datasnap.forEach(function(snapshot) {
            var name = snapshot.child('name').val();
            var number = snapshot.child('number').val();

            twilio.sms.messages.create({
                to: number,
                from: process.env.TWILIO_NUMBER,
                body: 'Hey ' + name + ', ' + client + ' needs your help in ' + subject + '. You may choose to help them out by going to ' + room
            }, function(err, msg) {
                if (err)
                    console.log('Oh crap! Something effed up!');
                if (!err) {
                    console.log('\n The message with the ID: \n' +
                        msg.sid +
                        '\n was sucessfully sent to ' + msg.to);
                    console.log('The message was: ' + msg.body + '\n')
                };
            });
        });
    });
    res.end();
});

app.post('/signup', function(req, res) {
    var name = req.body.client;
    var number = req.body.number;
    var subject = req.body.subject;
    var fbChild = fb.child(subject);
    fbChild.push({
        'name': name,
        'number': number
    });
    res.end();
});

app.listen(process.env.PORT, function() {
    console.log("Server is up  running at port: " + process.env.PORT);
});
