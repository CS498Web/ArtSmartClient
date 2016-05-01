'use strict';
/**
 * @ngdoc function
 * @name anotareApp.factory:Album
 */ 

angular.module('anotareApp')
  
  .factory('UserService', function ($http) {
    var baseURL = "localhost:4000/api/"
    //service to get json file from database
    
    var UserService = {

        getAllUsers : function() {
          return $http.get(baseURL + 'users/');
        }
        getSingleUser : function(id) {
           return $http.get(baseURL + 'users/'+id);
        }
        post : function(data) {
          return $http.post(baseURL+'/users/', data);
        }
        put : function(id, data) {
          return $http.put(baseURL+'/users/'+id, data);
        }
        delete : function(id) { 
          return $http.delete)(baseURL+'/users/'+id);
        }
    }

    return UserService;
});