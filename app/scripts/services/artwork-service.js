'use strict';
/**
 * @ngdoc function
 * @name anotareApp.factory:Album
 */ 

angular.module('anotareApp')
  .factory('ArtworkService', function ($http) {
    var baseUrl = "http://192.241.182.160:4000/api"
    var formHeader = {headers:{ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}
    // delete $http.defaults.headers.post['Content-type'];
    // delete $http.defaults.headers.delete['Content-type'];
    return {
        getAll : function() {
          return $http.get(baseUrl + '/artworks/');
        },
        getOne : function(artwork_id, success, error) {
            return $http.get(baseUrl + '/artworks/' + artwork_id)
            .success(function(response){
                console.log(response);
                if (success && typeof success == "function") success(response.data);
            })
            .error( function(error) {
                if (error && typeof error == "function") error();
            });
        },
        postOne : function(data, success, error) {
            return $http.post(baseUrl+'/artworks', $.param(data), formHeader)
            .success(function(response){
                if (success && typeof success == "function") success(response.data);
            })
            .error( function(error) {
                if (error && typeof error == "function") error();
            });
        },
        deleteOne : function(artwork_id) {
            return $http.delete(baseUrl+'/artworks/' + artwork_id);
        },
        putOne : function(artwork_id, data) {
            return $http.put(baseUrl+'/artworks/' + artwork_id, $.param(data), formHeader);
        },
        deleteAnnotation: function(artwork_id, annotation_id) {
            return $http.delete(baseUrl + '/artworks/' + artwork_id + '/annotations/' + annotation_id);
        }
    }
});
