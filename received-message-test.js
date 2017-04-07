var chai = require('chai');
var expect = chai.expect; // using the "expect" style of Chai

var app = require('./../index.js');

var request = require("supertest").agent(app.listen());
describe('receivedMessage', function() {
	  it('receivedMessage() should return string if message was received', function(receivedMessage) {

	     request
            .get("/")
            .expect("This is BoilerBot Server")
            .end(receivedMessage);

	  });
	  it('receivedMessage() quickReply button check', function(receivedMessage) {

	     request
            .get("/")
            .expect("This is BoilerBot Server")
            .end(receivedMessage);

	  });
	  it('receivedMessage() should return an error if message was unable to be received', function(receivedMessage) {

	     request
            .get("/")
            .expect("This is BoilerBot Server")
            .end(receivedMessage);

	  });
});