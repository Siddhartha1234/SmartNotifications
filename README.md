# SmartNotifications

### Usage instructions

```
$ git clone https://github.com/Siddhartha1234/SmartNotifications.git
$ cd SmartNotifications
$ npm start
open http://localhost:3000/test/
```

This will start a test server that executes a sample cron job for 5 test users.
Wait for some minutes and you can see notifications being dispatched to the test users like this: 

![](https://github.com/Siddhartha1234/SmartNotifications/blob/master/sample.gif)

### Design guidelines and concerned-files
1. There are two documents in the mongodb server.
   1. User  : The data stored by the server. This stores the scheduled notifications before it is dispatched. 
   2. Client: The data stored and visible to the client. This stores the notifications that have been dispatched.

2.Files : 
   ```
   Server route             : /routes/index.js
   Frontend view            : /views/index.ejs
   Frontend angular         : /public/javascript/Notifications.js
   Samples/random generators: /samples/sample.js
   Test job                 : /tests/testCronJob.js
   Mongo_schemes            : /db_config/*.js
   
   ```
### Scheduling and tracking
1. Each day is divided into 4 sections : Morning, Afternoon , Evening and Night
2. If the priority is 1, the notification is instantly dispatched or else it is scheduled intelligently.
3. There are 4 types of scheduling : 
    1. First time scheduling : Just updates the notification in the server Database.
    2. One Day / Two day limit avoiding scheduling: Schedules appropriately if those limits are reached. 
    3. Tracking: The user activity is tracked and the maximum preference time from the current slot to the end is picked 
       as the right time to schedule.  

### Dispatching 
1. A min priority Queue with key -> scheduled time is maintained.
2. Cron job regularly peeks at the top of this priority Queue and updates the closest job to be executed.
3. ``dispatchNotification`` function is called when the time comes very close to the closest job.
4. ``dispatchNotification`` function then checks the type of scheduling required and calls the appropriate scheduling technique.


### Frontend
Frontend is made using Angular Material framework. It uses the concept of periodic AJAX calls to server for updating notifications using ``$interval`` feature of AngularJS. 
The tabs, notifications are auto updated as they are bound to scope.





