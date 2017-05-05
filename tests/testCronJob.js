/**
 * Created by sid on 5/5/17.
 */

var random =  require('../samples/samples'),
    schedule = require('node-schedule'),
    dispatcher = require('../core_modules/dispatcher');


function cronRandomNotifications(users) {

    var i = schedule.scheduleJob('5 * * * * *', function () {
        console.log("Here");
        var keys = Object.keys(users);
        for(var i=0; i < keys.length; i++) {
            dispatcher.sendPushNotification({
                targetUser: users[keys[i]].name,
                message: random.random_notification(),
                destinationURL: 'http://cutshort.io/'
            }, function (status, err) {
                console.log(status, err);
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Sent scheduled notification");
                }
            });
        }

    });
}

module.exports.cronRandomNotifications = cronRandomNotifications;