'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:AnnotationCtrl
 * @description
 * # AboutCtrl
 * Controller of the anotareApp
 */
 angular.module('anotareApp')
 .controller('ExploreCtrl', [ '$scope', '$http', 'ArtworkService', '$stateParams',
             function ($scope, $http, ArtworkService, $stateParams) {
    $scope.getAllArtwork = function() {
        ArtworkService.getAll()
        .then(
        //success function
        function (response) {
            $scope.items = response.data;
          },
        //error function
        function(result) {
          console.log("Failed to get the images, result is :");
          console.log(result); 
        });
    }
  }]);
