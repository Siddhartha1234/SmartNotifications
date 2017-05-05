/**
 * Created by sid on 5/5/17.
 */

var mongoose = require('mongoose');

var mongoose_schema = mongoose.Schema;

var clientScheme = new Schema({
    Name : String,
    sentLastDay : {type : Number, default : 0},
    limitLastDay : {type : Number, default : 20},
    sentLastTwoDays : {type : Number, default : 0},
    limitLastTwoDays : {type : Number, default : 40},
    pushNotificationsEnabled : {type : Boolean, default : true},
    preference : {
        'morning'  : {type : Number, default : 0},
        'afternoon': {type : Number, default : 0},
        'evening'  :  {type : Number, default : 0},
        'night'    :  {type : Number, default : 0}
    },
    notifications : [{
        'message' : String,
        'destinationURL' : String
    }],
    notificationType : {type: String, default: 'push'},
    destinationURL   : {type: String, default: "https://cutshort.io/"}

});

var Client = mongoose.model('User', clientScheme);

module.exports = Client;