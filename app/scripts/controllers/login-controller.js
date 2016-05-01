'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:AnnotationCtrl
 * @description
 * # AboutCtrl
 * Controller of the anotareApp
 */


angular.module('anotareApp')
 .controller('loginController', function ($scope, $http, UserService) {

 	$scope.login = function() {
 		var user = { 
 			"email": $scope.userEmail,
 			"password": $scope.userPassword
 	};
 	UserService.getSingleUser(user).success(function(){
 		
 	}).error(Function(){});

 }
 $scope.signup = function() {
 	var newUser = {
 			"name" = $scopeUsername
 			"email": $scope.userEmail,
 			"password": $scope.userPassword
 		}
 	UserService.put().success(function(){

 	}).error(Function(){});
 	}



});
