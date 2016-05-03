'use strict';
/**
 * @ngdoc function
 * @name anotareApp.factory:Album
 */ 

angular.module('anotareApp')
  
  .factory('AuthService', ['$cookieStore', '$http', function ($cookieStore, $http) {

    var currentUser = $cookieStore.get('user') || {};

    var baseURL = "http://localhost:4000/api/"
    var formHeader = {headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}

    $cookieStore.remove('user');

    function changeUser(user) {
        angular.extend(currentUser, user);
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
                success();
            }).error(error);
        },
        login: function(data, success, error){
          $http.post(baseURL + "login/", $.param(data), formHeader).success(function(user){
              changeUser(user);
              console.log(user);
              success(user);
          }).error(error);
        },
        signup: function(data, success, error){
          $http.post(baseURL + "signup/", data).success(function(user) {
              changeUser(user);
              success(user);
          }).error(error);
        },
        user: currentUser
    };
}])