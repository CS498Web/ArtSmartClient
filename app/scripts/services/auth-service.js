'use strict';
/**
 * @ngdoc function
 * @name anotareApp.factory:Album
 */ 

angular.module('anotareApp')
  
  .factory('AuthService', ['localStorageService', '$http', function (localStorageService, $http) {

    var currentUser = localStorageService.get('user') || {};

    var baseURL = "http://localhost:4000/api/"
    var formHeader = {headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}

    // $cookieStore.remove('user');

    function changeUser(user) {
        angular.extend(currentUser, user);
        localStorageService.set('user', user);
    }

    return {
        isLoggedIn: function(user) {
            if(user === undefined) {
                user = currentUser;
            }
            return !_.isEmpty(user);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({});
                if (success && typeof success == "function") success();
            }).error( function() {
              if (error && typeof error == "function") error();
            });
        },
        login: function(data, success, error){
            $http.post(baseURL + "login/", $.param(data), formHeader).success(function(user){
                changeUser(user);
                if (success && typeof success == "function") success(user);
            }).error( function() {
                if (error && typeof error == "function") error();
            });
        },
        signup: function(data, success, error){
            $http.post(baseURL + "signup/", data).success(function(user) {
                changeUser(user);
                if (success && typeof success == "function") success(user);
            }).error( function() {
                if (error && typeof error == "function") error();
            });
        },
        user: currentUser
    };
}])