'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:RootCtrl
 * @description
 * # RootCtrl
 * Controller of the anotareApp
 */
 angular.module('anotareApp')
 .controller('LandingCtrl', ['$scope', '$http', '$location',
             function ($scope, $http, $location) {

    if ($scope.isLoggedIn()) {
        $location.path('/main/explore');
    }

    $scope.landingLogin = function() {
        console.log("what");
        console.log($scope.login);
        $scope.login({
            email: $scope.userEmail,
            password: $scope.userPassword
        }, function() {
            $location.path('/main/explore');
        }, function() {
            alert("wrong credentials");
        })
    }

    $scope.landingSignup = function() {
        $scope.signup({
            name: $scope.userName,
            email: $scope.userEmail,
            password: $scope.userPassword
        }, function() {
            $location.path('/main/landing');
        }, function() {
            alert("something went wrong");
        })
    }
   

 }]);



