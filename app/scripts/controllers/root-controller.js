'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:RootCtrl
 * @description
 * # RootCtrl
 * Controller of the anotareApp
 */
 angular.module('anotareApp')
 .controller('RootCtrl', ['$scope', '$http', 'UserService', 'AuthService', '$location',
             function ($scope, $http, UserService, AuthService, $location) {

 	$scope.login = function(user, success, error) {
        console.log("lololol");
 		var user = {
 			"email": user.email,
 			"password": user.password
 		}
 		AuthService.login(user, success, error);
 	}

 	$scope.signup = function(user, success, error) {
        console.log("whafasf");
 		var newUser = {
 			"name": user.name,
 			"email": user.email,
 			"password": user.password
 		}
        AuthService.signup(newUser, success, error);
 	}

    $scope.isLoggedIn = function() {
        return AuthService.isLoggedIn();
    }

    $scope.getCurrentUser = function() {
        return AuthService.user;
    }

 }]);



