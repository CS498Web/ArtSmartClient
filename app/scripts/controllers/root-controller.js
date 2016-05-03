'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:RootCtrl
 * @description
 * # RootCtrl
 * Controller of the anotareApp
 */
 angular.module('anotareApp')

 .controller('RootCtrl', ['$scope', '$http', 'UserService', '$location',
             function ($scope, $http, UserService, $location) {

 	$scope.login = function() {
 		var user = {
 			"email": $scope.userEmail,
 			"password": $scope.userPassword
 		}
 		UserService.login(user).success(function(data){
 			console.log(data);
 		}).error(function(){});

 	}
 	$scope.signup = function() {
 		var newUser = {
 			"name": "$scope.userName",
 			"email": $scope.userEmail,
 			"password": $scope.userPassword
 		}
 		UserService.signup(newUser).success(function(){
 			//$location.replace("/sign");
 		}).error(function(){});
 	}
 	$scope.authenticate = function() {
 		var user = {
 			"name": $scope.Username,
 			"email": $scope.userEmail,
 			"password": $scope.userPassword
 		}
 		UserService.authenticate(user).success(function(){
 			//$location.replace("/sign");
 		}).error(function(){});
 	}

 }]);



