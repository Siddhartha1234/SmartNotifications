/**
 * Created by sid on 5/5/17.
 */

var mongoose = require('mongoose');

var mongoose_schema = mongoose.Schema;

var userScheme = new Schema({
    Name : String,
    notifications : [{
      'message' : String,
      'destinationURL' : String
    }],
    notificationType : {type: String, default: 'push'},
    destinationURL   : {type: String, default: "https://cutshort.io/"}

});

var User = mongoose.model('User', userScheme);

module.exports = User;