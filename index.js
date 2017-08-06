var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
// Connection URL
var url = 'mongodb://tenthsamurai:tenthsamurai@ds129023.mlab.com:29023/tenth-samurai';

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
 
  db.close();
});

// if our user.js file is at app/models/user.js
var Message = require('./models/message');

app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.listen((process.env.PORT || 3000));

app.route('/m')
  .get(function(req, res) {
    res.send('Get a random book');
  })
  .post(function(req, res) {
    res.send('Add a book');
  });



// Server frontpage
app.get('/', function (req, res) {  
    res.send('This is TestBot Server');
    res.end();
});

// Facebook Webhook
app.get('/webhook', function (req, res) {  
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {  
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
        TestMessage = event.message;
        messagePost();
    }
    res.sendStatus(200);
});

function messagePost() { 

    //res.setHeader('Content-Type', 'application/json');
    console.log('Testing...');
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        var collection = db.collection('Test');
            // //res.write(qs);
            // sendMessageToDB(172323672892326);// res.sendStatus(200);
            // var doneMessage = new Message({
            //     message: "Testing from POST to fbook2",
            //     created_time: "2017-08-5T19:29:38+0000",
            //     from: {
            //         name: "Ariel Booth-Castillo",
            //         email: "10212287516170271@facebook.com",
            //         id: "10212287516170271"
            //     },
            //     id: "m_mid.$cAACcum0oHJBjwRigGVdj9NZPlA00"
            // });

            collection.insert(TestMessage);

        db.close();
        });
    //res.end(); 
}

var TestMessage = new Message({
                message: "Testing Param",
                created_time: "2017-08-5T19:29:38+0000",
                from: {
                    name: "Ariel Booth-Castillo",
                    email: "10212287516170271@facebook.com",
                    id: "10212287516170271"
                },
                id: "m_mid.$cAACcum0oHJBjwRigGVdj9NZPlA00"
            });

// generic function sending messages
function sendMessage(recipientId, message) {  
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

app.post('/sendMsgtoDB', messagePost);

// function to send json to mongodb
function sendMessageToDB() {
    //res.setHeader('Content-Type', 'application/json');
    console.log('Sending Msg to DB');
    let messageData = {
        "message": "Hello from localhost Next",
        "created_time": "2017-07-29T19:29:38+0000",
        "from": {
            "name": "Ariel Booth-Castillo",
            "email": "10212287516170271@facebook.com",
            "id": "10212287516170271"
        },
        "id": "m_mid.$cAACcum0oHJBjwRigGVdj9NZPlA00"
    };

    request({
        url: 'https://api.mlab.com/api/1/databases/tenth-samurai/collections/Test',
        qs: {access_token: '9vrjZkFE-HA0eOsfgznB69eoA1yayFu2'},
        method: 'POST',
        json: {
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending db message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
        //response.end();
    });
    //response.end();
}