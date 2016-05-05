'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:AnnotationCtrl
 * @description
 * # AboutCtrl
 * Controller of the anotareApp
 */
 angular.module('anotareApp')
 .controller('ProfileCtrl', [ '$scope', '$http', 'ArtworkService', '$stateParams',
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

    $scope.getAnnotatedArtwork = function() {
      var user = $scope.getCurrentUser;
      var worksAnnotated = user.worksAnnotated;

      $scope.user = $scope.getCurrentUser;
      $scope.worksAnnotateds = worksAnnotated;
    }

    $scope.getUploadedArtwork = function() {
      var user = $scope.getCurrentUser;
      var worksUploaded = user.worksUploaded;

      $scope.worksUploadeds = worksUploaded
    }
  }]);
