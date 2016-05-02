'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:AnnotationCtrl
 * @description
 * # AboutCtrl
 * Controller of the anotareApp
 */
 angular.module('anotareApp')
 .controller('loginController', ['$scope', '$http', 'UserService', '$location'], function ($scope, $http, UserService, $location) {

 	$scope.login = function() {
 		var user = {
 			"email": $scope.userEmail,
 			"password": $scope.userPassword
 		}

 		UserService.login(user).success(function(data){
 			$location.replace("/explore");
 		}).error(function(){});

 	}
 	$scope.signup = function() {
 		var newUser = {
 			"name": $scopeUsername,
 			"email": $scope.userEmail,
 			"password": $scope.userPassword
 		}
 		UserService.signup(user).success(function(){
 			//$location.replace("/sign");
 		}).error(function(){});
 	}

 });



