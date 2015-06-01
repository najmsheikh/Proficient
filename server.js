var firebase = require('firebase');
var twilio = require('twilio')(process.env.TWILIO_TEST_SID, process.env.TWILIO_TEST_CODE);
var fb = new firebase(process.env.FIREBASE_URL);
var rwg = require('random-word-generator');
var generator = new rwg();

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', function(req, res) {
    res.sendfile("./index.html");
});
app.post('/gethelp', function(req, res) {
    var client = req.body.client;
    // var number = req.body.number;
    var subject = req.body.subject;
    var room = 'http://appear.in/' + generator.generate();

    // AppearIn.getRandomRoomName()(function (roomName){
    //     console.log('works!')
    // });

    fb.once('value', function(datasnap) {
        datasnap.forEach(function(snapshot) {
            var name = snapshot.child('name').val();
            var number = snapshot.child('number').val();

            twilio.sms.messages.create({
                to: number,
                from: '+15005550006',
                body: 'Hey ' + name + ', ' + client + ' needs your help in ' + subject + '. You may choose to help them out by going to ' + room
            }, function(err, msg) {
                if (err)
                    console.log('Oh crap! Something effed up!');
                if (!err) {
                    console.log('The message with the ID: \n' +
                        msg.sid +
                        '\n was sucessfully sent to ' + msg.to);
                    console.log('The message was: ' + msg.body + '\n \n')
                };
            });
        });
    });
    res.end();
});
app.listen(1337, function() {
    console.log("Server is up.");
})
