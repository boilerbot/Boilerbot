const config = require('../config');
const urls = require('../urls');
const request = require('request');


module.exports = {
	//define all facebook functions here.
	getUserInfo : function(fbID) {

		var request_url = urls.get_user_info_url + "/" + fbID + "?access_token=" + config.token;
		request(request_url, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				return JSON.parse(body);
			}
			else {
				return null;
			}
		});
	},

	createTextMessage : function(fbID, text) {
		console.log("Creating message JSON for text: " + text);
		var messageData = {
			recipient: {
				id: fbID
			},
			message: {
				text: text
			}
		};
		return messageData;
	},

	createImageMessage : function(fbID, imageURL) {

	},

	createCards : function(fbID, messageData) {
		var response = {
			recipient : {
				id : fbID
			},
			message : {
				attachment : {
					type : "template",
					payload : {
						template_type : "generic",
						elements : messageData
					}
				}
			}
		};
		//console.log(messageData);
		return response;
	},

	createQuickReply :  function(fbID, data) {
		console.log("The facebook id is " + fbID);
		var messageData = {
		    recipient: {
		      id: fbID
		    },
			message : data, 
		};
		return messageData;
	},

	sendMessageToNewUser : function(senderID) {
		var message = module.exports.createTextMessage(senderID, "Hi, I am BoilerBot! I provide information about all-things-Purdue. How may I help you today?");
		module.exports.sendMessageToFacebook(message);
	},

	sendMessageToFacebook : function(message) {
		request({
		uri: urls.post_message_url,
		qs: { access_token: config.token },
		method: 'POST',
		json: message
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				return response.statusCode;
			} else {
				console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
				console.log("the message we call for is " + message);
				return response.statusCode;
			}
		});
	},
};