/**
 * Created by sid on 5/5/17.
 */

var mongoose = require('mongoose');

var mongoose_schema = mongoose.Schema;

var userScheme = new mongoose_schema({
    Name : String,
    notifications : [{
      'message' : String,
      'destinationURL' : String,
      'scheduled_time' : Number
    }],
    notificationType : {type: String, default: 'push'},
    destinationURL   : {type: String, default: "https://cutshort.io/"},
    todispatch     : {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userScheme);
