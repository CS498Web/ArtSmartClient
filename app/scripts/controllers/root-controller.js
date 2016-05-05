'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:RootCtrl
 * @description
 * # RootCtrl
 * Controller of the anotareApp
 */
 angular.module('anotareApp')
 .controller('RootCtrl', ['$scope', '$http', 'UserService', 'AuthService', '$location', '$state',
             function ($scope, $http, UserService, AuthService, $location, $state) {

 	$scope.login = function(user, success, error) {
 		AuthService.login(user, success, error);
 	}

 	$scope.signup = function(user, success, error) {
        AuthService.signup(user, success, error);
 	}

    $scope.logout = function(success, error) {
        AuthService.logout(success, error);
    }

    $scope.isLoggedIn = function() {
        return AuthService.isLoggedIn();
    }

    $scope.getCurrentUser = function() {
        return AuthService.user;
    }

    var updateCurrentUser = function() {
        $scope.currentUser = $scope.getCurrentUser();
        $scope.username = $scope.currentUser.name;
    }
    
    $scope.modalTitle = "";
    $scope.loggingIn = false;
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
        $scope.modalTitle = "Log In";
        $scope.loggingIn = !$scope.loggingIn;
        $("#myModal").modal('show');
        $scope.uploading = false;
    }
    $scope.upload = function(){
        $scope.modalTitle = "Upload new artwork";
        $scope.uploading = !$scope.uploading;
        console.log($scope.uploading);
        $("#myModal").modal('show');
        $scope.loggingIn = false;
    }

    $scope.closeModal = function() {
        $scope.uploading = false;
        $scope.loggingIn = false;
        $("#myModal").modal('hide');
    }

    $scope.navbarLogin = function() {
        $scope.login({
            email: $scope.loginName,
            password: $scope.loginPassword
        }, function() {
            updateCurrentUser();
            $scope.closeModal();
            $scope.loginName = "";
            $scope.loginPassword = "";
            if ($state.current.name === 'root.landing') {
                $state.go('root.explore', {}, {reload: true});
            }
        }, function() {
            alert("Wrong credentials");
        })
    }

    $scope.navbarLogout = function() {
        $scope.logout(function() {
            updateCurrentUser();
            $state.go('root.landing', {}, {reload: true});
        }, function(error) {
            console.log(error);
        })
    }

    updateCurrentUser();

 }]);



