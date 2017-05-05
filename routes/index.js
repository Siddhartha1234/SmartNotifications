var express = require('express');
var router = express.Router();
var samples = require('../samples/samples');
var testJob = require('../tests/testCronJob');
var Client   = require('../db_config/Client');

/* GET home page. */
router.get('/test', function(req, res) {
    var users = {
        'u1': {
            id: 1,
            name: 'Siddhartha Mishra',
            notifications: []
        },
        'u2': {
            id:2,
            name: 'Second user',
            notifications: []
        },
        'u3': {
            id:3,
            name: 'Third user',
            notifications: []
        },
        'u4': {
            id:4,
            name: 'Fourth user',
            notifications: []
        },
        'u5': {
            id:5,
            name: 'Fifth user',
            notifications: []
        }
    };

    var keys = Object.keys(users);
    for(var i = 0; i < keys.length;i++) {

        var client = new Client({
            Name: users[keys[i]]['name'],
            iter : users[keys[i]].id - 1
        });

        client.save(function (err, results) {
            if(err) {
                console.log(err);
            }
            console.log(results);
        });

        if(i == 4) {

            testJob.cronRandomNotifications(users, function (err) {
                if(err) {
                    console.log(err);
                }

            });
        }

    }
    res.render('index');
});

router.post('/updateNotifications', function (req,res) {
    var user = req.body.user;
    Client.findOne({Name: user['name']}, function (error,client) {
            if(client) {
                res.send({ notifications : client.notifications, iter: client.iter});
            }
            else {
                res.send({err: "Client does not exist in db"});
            }

        });
});

router.post('/sendPushNotif', function (req,res) {
    var notification = req.body;
    Client.findOne({Name: notification.targetUser}, function (error,client) {
        if(client) {
            client.notifications.push({
                message : notification.message,
                destinationURL : notification.destinationURL
            });

            client.save(function (err) {
                if(err) {
                    res.send({status:false, err: "Could not update client's db"});
                }
            });
            res.send({status: true})
        }
        else {
            res.send({status:false,err: "Client does not exist in db"});
        }
    });
});

module.exports = router;
