/**
 * Created by sid on 3/5/17.
 */
var pqueue = require('js-priority-queue'),
    User   = require('../db_config/User');

function getCurrentHour() {
    var date = new Date();
    return date.getHours();
}

function schedule(notification, notifications_queue, callback) {
    User.findOne({Name: notification.targetUser}, function (error,user) {
        if(user) {
            user.notifications.push({
                message : notification.message,
                destinationURL : notification.destinationURL
            });

            user.save(function (err) {
                if(err) {
                    callback(false, "Could not update db");
                }
            });

            notification['scheduled_time'] = getCurrentHour();
            notifications_queue.queue(notification);
            callback(true);
        }
        else {
            callback(false,"User does not exist in db");
        }
    });
}

module.exports.schedule = schedule;

