'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const recast = require('recastai');
const config = require('./config');
const urls = require('./urls');

var mongoose = require("mongoose");

//var db = mongoose.connect("mongodb://heroku_b4mqcjqm:7m1nqnr1d4vvsshk0smsbggi0u@ds161209.mlab.com:61209/heroku_b4mqcjqm");
var User = require("./users");

/*services section*/
const fb = require('./services/facebook-service');
const courts = require('./services/dining-courts');
/*Recast client*/
const client = new recast.Client(config.recast_token, 'en');
/*intents section*/
const greetings = require('./intents/greetings');
const goodbyes = require('./intents/goodbyes');
const help = require('./intents/help');
const feedback = require('./intents/feedback');

/*APP SETTINGS DO NOT TOUCH THESE. THEY REMAIN THE SAME ALWAYS*/
app.set('port', (process.env.PORT || 8080));


if(!module.parent) {
    app.listen(app.get('port'), function() {
		console.log('running on port', app.get('port'));
	});
}

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

// Server frontpage
app.get('/', function (req, res) {  
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {  
    if (req.query['hub.verify_token'] === 'boilerbot') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});


/*POST METHOD TO GET MESSAGE FROM FACEBOOK*/
app.post('/webhook/', function(req, res) {

	var data = req.body;

	if (data.object == 'page') {
		data.entry.forEach(function(pageEntry) {

			pageEntry.messaging.forEach(function(messagingEvent) {
				if (messagingEvent.message) {
					console.log("Got a message from Facebook:");
					console.log("Messaging event:" + messagingEvent)
					console.log("sender:" + messagingEvent.sender)
                    User.findOne({ user_id: messagingEvent.sender.id }, function(err, user) {

                        // if error connecting to DB
                        if (err) throw err;
                        //if user is not a first timer.
                        if (user) {
                            console.log("Not a first time user: " + messagingEvent.sender.id);
                            console.log(user);
                            //Send a normal reply back.
                        }

                        //If user is new, we add user to our DB.
                        else {
                            //creating user object
                            var newUser = User({
                                user_id: messagingEvent.sender.id,
								name: messagingEvent.sender.first_name + " " + messagingEvent.sender.last_name,
                            });
                            //saving user object
                            newUser.save(function(err) {
                                if (err) throw err;
                                console.log('User created!: ' + messagingEvent.sender.id);
                            });
                            //Since user is new, we will by default send the HELP messages.
                            //help();
                        }
                    });
					receivedMessage(messagingEvent);
				}
				else if (messagingEvent.postback) {
					receivedPostback(messagingEvent);
				}
				else {
					console.log("Webhook received messaging event which is not handled");
				}
			});
		});
		res.sendStatus(200);
	}
});

function receivedMessage(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message;
	var metadata = message.metadata;

	var messageText = message.text;
	var messageAttachments = message.attachments;
	var isEcho = message.is_echo;
	var quickReply = message.quick_reply;

	if (isEcho) {
		return;
	}
	else if (quickReply) {
		var quickReplyPayload = quickReply.payload;
		var payload = quickReplyPayload.split(" ");

		console.log("Quick reply with payload %s", quickReplyPayload);
		console.log("Response status -> " + fb.sendMessageToFacebook(message));
		return;
	}
	else if (messageText) {
		sendToRecast(senderID, messageText);
	}
}

function receivedPostback(event) {
	var senderID = event.sender.id;
	var timeOfPostback = event.timestamp;

	var payload = event.postback.payload;
	var payload_params = payload.split(" ");
	if (payload_params[0] === "new_user") {
		console.log("Postback was : " + payload_params[0]);
		fb.sendMessageToNewUser(senderID);
	}
}

function sendToRecast(sender, message) {
	var custom_url = urls.get_user_info_url + "/" + sender + "?access_token=" + config.token;
	var user_details;


	//have to figure out async before calling from fb here....
	request(custom_url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			user_details = JSON.parse(body);
		}
		else {
			console.error("Failed calling get API", response.statusCode, response.statusMessage, body.error);
		}
	});
	console.log(custom_url);
	client.textRequest(message).then((res) => {
		var message_to_send = '';
		if (res.intent() != null) {
			var intent = res.intent().slug;
			var message;
      	switch(intent) {
				case 'greetings':
					console.log("Intent: greeting");
					message = fb.createTextMessage(sender, greetings.getGreetings(user_details.first_name));
					console.log("Response status -> " + fb.sendMessageToFacebook(message));
					break;

				case 'goodbyes':
					console.log("Intent: goodbyes");
					message = fb.createTextMessage(sender, goodbyes.getGoodbyes(user_details.first_name));
					console.log("Response status -> " + fb.sendMessageToFacebook(message));
					break;

				case 'help':
					console.log("Intent: help");
					message = fb.createTextMessage(sender, help.getHelp(user_details.first_name));
					console.log("Response status -> " + fb.sendMessageToFacebook(message));
					break;

				case 'feedback':
		            console.log("Intent: feedback");
		            message = fb.createTextMessage(sender,feedback.getFeedback(user_details.first_name));
		            console.log("Response status -> " + fb.sendMessageToFacebook(message));
		            break;

		        case 'location_courts':
					console.log("\n Dining courts location intent found:");
					if (res.entities != null) {
						courts.diningcourts_location(sender).then(function(elements) {
							console.log("Promise was resolved and we got elements");
							message = fb.createCards(sender, elements);
							console.log("Response status -> " + fb.sendMessageToFacebook(message));
						}).catch(function(error) {
							console.log("Got an error in dining courts and got error");
						});
					}
					else {
						console.log("error handling");
					}
					break;

				default:
					message = fb.createTextMessage(sender, "Didn't really get that " + user_details['first_name'] + ". Could you try something else?");
					console.log("Response status -> " + fb.sendMessageToFacebook(message));
			}
		}
		else {
			message = fb.createTextMessage(sender, "Didn't really get that " + user_details['first_name'] + ". Could you try something else?");
			console.log("Response status -> " + fb.sendMessageToFacebook(message));
		}
	}).catch(e => {
		console.log(e);
	});
}

module.exports = app;