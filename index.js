var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');  
var app = express();

app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());  
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {  
    res.send('This is TestBot Server');
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
    }
    res.sendStatus(200);
});

app.post('/mongoDB', function (req, res) { 
    //var qs = req.query(test);
    //res.setHeader('Content-Type', 'application/json');
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    console.log('Testing...');
    
    //res.write(qs);
    sendMessageToDB(172323672892326);

    res.sendStatus(200);
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

// function to send json to mongodb
function sendMessageToDB(recipientId) {
    let messageData = {
        "message": "Hello from localhost",
        "created_time": "2017-07-29T19:29:38+0000",
        "from": {
            "name": "Ariel Booth-Castillo",
            "email": "10212287516170271@facebook.com",
            "id": "10212287516170271"
        },
        "id": "m_mid.$cAACcum0oHJBjwRigGVdj9NZPlA00"
    }
    request({
        url: 'https://api.mlab.com/api/1/databases/tenth-samurai/collections/Test?apiKey=9vrjZkFE-HA0eOsfgznB69eoA1yayFu2',
        //qs: {access_token: process.env.MLAB_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending db message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};