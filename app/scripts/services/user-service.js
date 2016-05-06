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
        getSingleUser : function(id, success, error) {
           var url = baseURL + 'users/' + id
           $http.get(url).success(function(response){
                if (success && typeof success == "function") success(response.data);
            })
            .error( function(error) {
                if (error && typeof error == "function") error();
            });
        },
        post : function(data) {
          return $http.post(baseURL+'users/', $.param(data));
        },
        put : function(id, data) {
          return $http.put(baseURL+'users/'+id, $.param(data), formHeader);
        },
        delete : function(id) { 
          return $http.delete(baseURL+'users/'+id);
        }
        
    }

    return UserService;
});