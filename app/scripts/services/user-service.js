'use strict';
/**
 * @ngdoc function
 * @name anotareApp.factory:Album
 */ 

angular.module('anotareApp')
  
  .factory('UserService', function ($http) {
    var baseURL = "http://localhost:4000/api/"
    var formHeader = {headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}

    //service to get json file from database
    
    var UserService = {

        getAllUsers : function() {
          return $http.get(baseURL + 'users/');
        },
        getSingleUser : function(id) {
           var url = baseURL + 'users/' + id
           console.log(url);
           return $http.get(url);
        },
        post : function(data) {
          return $http.post(baseURL+'users/', $.param(data));
        },
        put : function(id, data) {
          return $http.put(baseURL+'users/'+id, $.param(data));
        },
        delete : function(id) { 
          return $http.delete(baseURL+'users/'+id);
        },
        login: function(data){
          var url = baseURL + "login/"
          return $http.post(url, $.param(data), formHeader);
        },
        signup: function(data){
          var url = baseURL + "signup/"
          return $http.post(url, data);
        }
        // isAuthenticated: function(req, res) {
        //   var url = baseURL + "authenticate/"
        //   var authenticatedUser = $http.post(url, data);
        //   if(authenticated!=false){

        //   }
    }

    return UserService;
});