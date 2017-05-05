/**
 * Created by sid on 3/5/17.
 */
var app = angular.module('SmartNotifications', ['ngMaterial']);

app.controller('NotificationsController', function ($scope,$http) {
    $scope.users = {
        'u1': {
            id: 1,
            name: 'Siddhartha Mishra',
            notifications: ['You have a job offer' , 'Check out this article!', "See this user's updated profile" ]
        },
        'u2': {
            id:2,
            name: 'Second user',
            notifications: ['Check out this article!', "See this user's updated profile" ]
        },
        'u3': {
            id:3,
            name: 'Third user',
            notifications: [ "See this user's updated profile" , 'You have a job offer' , 'Check out this article!', 'You have a job offer' ]
        },
        'u4': {
            id:4,
            name: 'Fourth user',
            notifications: ['You have a job offer' , "See this user's updated profile" , 'Check out this article!' ]
        },
        'u5': {
            id:5,
            name: 'Fifth user',
            notifications: ['Check out this article!']
        }
    };

    $scope.setUser = function (userName) {
        $scope.users['test'].name = userName;
    }
});
