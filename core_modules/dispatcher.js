/**
 * Created by sid on 3/5/17.
 */
var pqueue   = require('js-priority-queue'),
    requests = require('requests'),
    Client   = require('../db_config/Client');


function getCurrentHour() {
    var date = new Date();
    return date.getHours();
}

function getCurrentSlot() {
    var date = new Date();
    var currHour = date.getHours();

    if (currHour >= 7 && currHour <= 11) {
        return 'morning';
    }
    else if(currHour >= 12 && currHour <= 15) {
        return 'afternoon';
    }
    else if(currHour >= 16 && currHour <= 19) {
        return 'evening';
    }
    else {
        return 'night';
    }
}

function preferredSlot(user) {
    var max = 0;
    var slot = '';
    if(user.preference['morning'] > max) {
        slot = 'morning';
        max = user.preference['morning'];
    }
    else if(user.preference['afternoon']> max) {
        slot = 'afternoon';
        max = user.preference['afternoon'];
    }
    else if(user.preference['evening'] > max) {
        slot = 'evening';
        max = user.preference['evening'];
    }
    else {
        slot = 'night';
        max = user.preference['night'];
    }

    if(max == 0)
       slot = getCurrentSlot();

    return slot;
}

function sendPushNotification(notification, callback) {
    Client.findOne({Name: notification.targetUser}, function (error,client) {
        if(client) {
            client.notifications.push({
                message : notification.message,
                destinationURL : notification.destinationURL
            });

            client.save(function (err) {
                if(err) {
                    callback(false, "Could not update client's db");
                }
            });
            callback(true);
        }
        else {
            callback(false,"Client does not exist in db");
        }
    });
}

// function dispatch_async_job(notification_queue) {
//
//
//
//
// }

