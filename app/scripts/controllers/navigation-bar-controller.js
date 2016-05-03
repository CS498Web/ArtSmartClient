'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:navigation-bar
 * @description
 * # AboutCtrl
 * Controller of the navigation
 */
angular.module('anotareApp')
  .controller('navigation-bar', function($scope, $http) {
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
    $scope.height="";
    $scope.width="";
    $scope.medium="";
    $scope.login = function(){
        $scope.loggingIn = true;
        $scope.uploading = false;
    }
    $scope.upload = function(){
        $scope.loggingIn = false;
        $scope.uploading = true;
    }
  });
