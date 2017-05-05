/**
 * Created by sid on 3/5/17.
 */
var app = angular.module('SmartNotifications', ['ngMaterial']);

app.controller('NotificationsController', function ($scope,$http,$interval) {
    $scope.users = {
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
    $scope.keys = Object.keys($scope.users);
    var update;
    update = $interval(function () {
        for(var i = 0; i < $scope.keys.length;i++) {
            $http({
                method: "POST",
                url: '/updateNotifications',
                data: { user: $scope.users[$scope.keys[i]] }
            }).then(function mySuccess(res) {
                if (!res.data.err) {
                    console.log(res.data.iter);
                    $scope.users[$scope.keys[res.data.iter]].notifications = res.data.notifications;
                }
                else {
                    console.log("Error updating notfs");
                }
            }, function myError(res) {
                console.log("Error updating notfs");
            });
        }

    },2000);

    $scope.$on('$destroy', function() {
        $interval.cancel(update);
    });

});
