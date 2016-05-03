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
 		var user = {
 			"email": user.email,
 			"password": user.password
 		}

 		AuthService.login(user, success, error);
 	}

 	$scope.signup = function(user, success, error) {
 		var newUser = {
 			"name": user.name,
 			"email": user.email,
 			"password": user.password
 		}
        AuthService.signup(newUser, success, error);
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

    $scope.isLoggedIn = function() {
        return AuthService.isLoggedIn();
    }

    $scope.getCurrentUser = function() {
        return AuthService.user;
    }

    $scope.modalTitle = "Upload New Image";
    $scope.username = "Roger";
    $scope.loggedIn = false;
    $scope.loggingIn = true;
    $scope.signingUp = false;
    $scope.uploading = false;
    $scope.imageLoaded = false;
    $scope.fileToUpload = "";
    $scope.valid = false;
    $scope.loginName = "";
    $scope.passwordName ="";
    $scope.title = "";
    $scope.artist="";
    $scope.description="";
    $scope.location="";
    $scope.medium="";
    $scope.navbarLogin = function(){
        $scope.loggingIn = true;
        $scope.uploading = false;
    }
    $scope.upload = function(){
        $scope.loggingIn = false;
        $scope.uploading = true;
    }

 }]);



