'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:RootCtrl
 * @description
 * # RootCtrl
 * Controller of the anotareApp
 */
 angular.module('anotareApp')
 .controller('LandingCtrl', ['$scope', '$http', '$location', '$state',
             function ($scope, $http, $location, $state) {

    if ($scope.isLoggedIn()) {
        $state.go('root.explore', {}, {reload: true});
    }

    // $scope.landingLogin = function() {
    //     $scope.login({
    //         email: $scope.userEmail,
    //         password: $scope.userPassword
    //     }, function() {
    //         $location.path('/main/explore');
    //     }, function() {
    //         alert("wrong credentials");
    //     })
    // }

    $scope.landingSignup = function() {
        $scope.signup({
            name: $scope.userName,
            email: $scope.userEmail,
            password: $scope.userPassword
        }, function() {
            $scope.login({
                email: $scope.userEmail,
                password: $scope.userPassword
            }, function() {
                $scope.updateCurrentUser();
                $scope.userName = "";
                $scope.userPassword = "";
                $state.go('root.explore', {reload: true});
            }, function() {
                alert("Wrong credentials");
            })
        }, function() {
            alert("something went wrong");
        })
    }
   

 }]);



