/**
 * Created by kushrustagi on 2/26/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    user_id: String,
    name: String,
    dining_location: String,
    location: String,
    latitude: String,
    longitude: String,
    request_type: String,
    cred_id: String,
    cred_pass: String,
});

// creating model
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = mongoose.model('User', userSchema);
