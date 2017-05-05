/**
 * Created by sid on 3/5/17.
 */
var pqueue = require('js-priority-queue'),
    request = require('request'),
    Client = require('../db_config/Client'),
    scheduler = require('./scheduler');

setInterval(dispatch_cron_job, 60000); //cron job of every minute
var next_scheduled;
var notifications_queue;

function sendPushNotification(notification, callback) { //send Notification via Endpoint
    Client.findOne({Name: notification.targetUser}, function (error, client) {
        if (!client) {
            console.log("Client does not exist in db");
        } else {
            client.sentLastDay++;
            client.sentLastTwoDays++;
            client.save(function (err) {
                if (err) {
                    console.log("Could not update client's db");
                }
            });
            request.post(
                'http://localhost:3000/sendPushNotif',
                {
                    json: {
                        targetUser: notification.targetUser,
                        message: notification.message,
                        destinationURL: notification.destinationURL
                    }
                },
                function (err, res) {
                    if (err) {
                        callback(err);
                    }
                }
            );

        }
    });


}

function initializePriorityQueue() { //initialize priority queue
    notifications_queue = new PriorityQueue({
        comparator: function (a, b) {
            return a.scheduled_time < b.scheduled_time;
        }
    });

}
function updatePriorityQueue(notifications, callback) { //update pqueue from list of notificartions
    if (!notifications_queue) {
        initializePriorityQueue();
    }
    for (var i = 0; i < notifications.length; i++) {
        notifications_queue.queue(notifications[i]);
        if (i == notifications.length - 1) {
            callback(true);
        }
    }
}

function dispatchNotification(notification, callback) { //called by notification source to dispatch a notification
    User.findOne({Name: notification.targetUser}, function (err, user) {
        if (notification.priority == 1) {
            sendPushNotification(notification, function (err) {
                if (err) {
                    callback(false, err);
                }
            });
        }
        else {
            if (user.sentLastDay >= user.limitLastDay) {

                scheduler.schedule(client, 'dailydelay', function (status, delay) {
                    if (status) {
                        user.notifications.scheduled_time = getCurrentHours() * 60 + getCurrentMinutes() + delay;
                        updatePriorityQueue(notification, function (sta) {
                            if (sta) {
                                callback(true);
                            }
                        });

                    }
                });
            }
            else if (user.sentLastTwoDays >= user.limitLastTwoDays) {
                scheduler.schedule(client, 'twodaydelay', function (status, delay) {
                    if (status) {
                        user.notifications.scheduled_time = getCurrentHours() * 60 + getCurrentMinutes() + delay;
                        updatePriorityQueue(notification, function (sta) {
                            if (sta) {
                                callback(true);
                            }
                        });

                    }
                });
            }
            else {
                scheduler.schedule(client, 'feedbackdelay', function (status, delay) {
                    if (status) {
                        user.notifications.scheduled_time = getCurrentHours() * 60 + getCurrentMinutes() + delay;
                        updatePriorityQueue(notification, function (sta) {
                            if (sta) {
                                callback(true);
                            }
                        });
                    }
                });
            }
        }

    })

}


function dispatch_cron_job() { //the main cron job handling the dispatching
    if (notifications_queue) {
        if (!next_scheduled || notifications_queue.peek() < next_scheduled) {
            if (next_scheduled) {
                notifications_queue.queue(next_scheduled);
            }
            next_scheduled = notifications_queue.dequeue();
        }
        if (Math.abs(next_scheduled.scheduled_time - getCurrentHours() * 60 + getCurrentMinutes()) <= 3 ) { //To make sure it is not skipped , decrease accuracy
            dispatchNotification(next_scheduled, function (status, err) {
                if (!status) {
                    console.log(err);
                }
            });
        }
    }

}

module.exports.dispatchNotification = dispatchNotification;