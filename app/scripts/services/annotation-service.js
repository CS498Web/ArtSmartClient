'use strict';
/**
 * @ngdoc function
 * @name anotareApp.factory:Album
 */ 

angular.module('anotareApp')
  .factory('AlbumService', function ($http) {

    //service to get json file from database
    var AlbumService = {
        getImage: function() {
            return $http.get('data/album.json').
              success(function(data) {
                return data.Album;
              }).
              error(function(data, status) {
                console.log('Oh no! An error! Error status: ' + status);
              });
        }
    }

    return AlbumService;
});
