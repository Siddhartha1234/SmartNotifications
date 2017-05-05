/**
 * Created by sid on 3/5/17.
 */
var pqueue = require('js-priority-queue');

function getCurrentHour() { //get Current hour
    var date = new Date();
    return date.getHours();
}

function getCurrentMinutes() { //get Current Minutes
    var date = new Date();
    return date.getMinutes();
}

function getCurrentSlot() { //get Current Slot
    var date = new Date();
    var currHour = date.getHours();

    if (currHour >= 7 && currHour <= 11) {
        return 0;
    }
    else if(currHour >= 12 && currHour <= 15) {
        return 1;
    }
    else if(currHour >= 16 && currHour <= 19) {
        return 2;
    }
    else {
        return 3;
    }
}

function preferredSlot(user) { //Get the maximum preference slot after current slot using preference feedback
    var max = 0;
    var slot = '';
    var slotPeriodMap = { 0: 'morning', 1 : 'afternoon', 2: 'evening' , 3 : 'night'};
    var curr_slot = getCurrentSlot();
    if(curr_slot == 0 && user.preference['morning'] > max) {
        slot = 0;
        max = user.preference['morning'];
    }
    if(curr_slot <=1 && user.preference['afternoon']> max) {
        slot = 1;
        max = user.preference['afternoon'];
    }
    if(curr_slot <=2 && user.preference['evening'] > max) {
        slot = 2;
        max = user.preference['evening'];
    }
    if(user.preference['night'] > max){
        slot = 3;
        max = user.preference['night'];
    }

    if(max == 0 || max == user.preference[slotPeriodMap[getCurrentSlot()]]) //no need to change slots if they are all same
        slot = getCurrentSlot();

    return slot;
}

function getRequiredDelay(user) { //get the right amount of delay
    var preferred_slot = preferredSlot(user);
    var current_hour = getCurrentHour();
    var start_time_map = { 0: 7 , 1 : 12 , 2 :16 ,3 : 20};
    var periodMap  = { 0 : 5 , 1: 4 ,2: 4, 3 :11};
    return (start_time_map[preferred_slot] + Math.floor(Math.random()*periodMap[preferred_slot]) - current_hour)*60;
}

function daylimitDelay(dailyLimit) { //delay for avoiding day limits
    if(dailyLimit) {
        return (1440 -getCurrentHour()*60) + Math.floor(Math.random()* 1440);
    }
    return (2880 -(getCurrentHour()*60+getCurrentMinutes()) + Math.floor(Math.random()* 1440));
}


function registerServer(users) { //register users to the Server
    var keys = Object.keys(users);
    for (var i = 0; i < keys.length; i++) {

        var server = new User({
            Name: users[keys[i]]['name'],
            iter: users[keys[i]].id - 1
        });

        server.save(function (err, results) {
            if (err) {
                console.log(err);
            }
            console.log(results);
        });

    }
}

function schedule(notification, type , callback) { //Schedule notifications
    User.findOne({Name: notification.Name}, function (error,user) {
        if(user) {
            if(type == 'first_time') {
                user.notifications.push({
                    message : notification.message,
                    destinationURL : notification.destinationURL
                });
                user.scheduled_time = getCurrentHour()*60+ getCurrentMinutes();
                user.todispatch = true;

                user.save(function (err) {
                    if(err) {
                        callback(false, "Could not update db");
                    }
                });

            }
            else if(type == 'dailydelay') {
                callback(true, daylimitDelay(true));
            }
            else if(type == 'twodaydelay') {
                callback(true, daylimitDelay(false));
            }
            else {
                callback(true, getRequiredDelay(user));
            }
        }
        else {
            callback(false,"User does not exist in db");
        }
    });
}

module.exports.getCurrentHour = getCurrentHour;
module.exports.getCurrentMinutes = getCurrentMinutes;
module.exports.registerServer = registerServer;
module.exports.schedule = schedule;

