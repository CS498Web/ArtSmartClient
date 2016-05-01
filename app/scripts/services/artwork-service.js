'use strict';
/**
 * @ngdoc function
 * @name anotareApp.factory:Album
 */ 

angular.module('anotareApp')
  .factory('ArtworkService', function ($http) {

        getAllArtwork : function() {
          return $http.get(baseURL + 'artworks/');
        }
        getSingleArtwork : function(id) {
           return $http.get(baseURL + 'artworks/'+id);
        }
        post : function(data) {
          return $http.post(baseURL+'/artworks/', data);
        }
        put : function(id, data) {
          return $http.put(baseURL+'/artworks/'+id, data);
        }
        delete : function(id) { 
          return $http.delete)(baseURL+'/artworks/'+id);
        }
    return ArtworkService;
});