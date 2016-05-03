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
 		AuthService.login(user, success, error);
 	}

 	$scope.signup = function(user, success, error) {
        AuthService.signup(user, success, error);
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
    $scope.toggleLogin = function(){
        $scope.loggingIn = true;
        $scope.uploading = false;
    }
    $scope.upload = function(){
        $scope.loggingIn = false;
        $scope.uploading = true;
    }
    $scope.navbarLogin = function() {
        $scope.login({
            email: $scope.loginName,
            password: $scope.loginPassword
        }, function() {
            // $location.path('/main/explore');
        }, function() {
            alert("wrong credentials");
        })
    }

 }]);



