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

    $scope.user;

    $http({
      method: 'GET',
      url: ('/users/' + $stateParams.user_id)
    }).success(function(data){
      $scope.user = data;
    }).error(function(err) {
      console.log(err);
    });

    $scope.annotatedArtworkIds = $scope.user.worksAnnotated;
    $scope.annotatedArtworks = [];
    $scope.uploadedArtworkIds = $scope.user.worksUploaded;
    $scope.uploadedArtworks = [];

    for (var i = 0; i < $scope.annotatedArtworkIds.length; i++) {
      $http({
        method: 'GET',
        url: ('/artworks/' + $scope.annotatedArtworkIds[i])
      }).success(function(data){
        $scope.annotatedArtworks.push(data);
      }).error(function(err) {
        console.log(err);
      });
    };

    for (var i = 0; i < $scope.uploadedArtworkIds.length; i++) {
      $http({
        method: 'GET',
        url: ('/artworks/' + $scope.uploadedArtworkIds[i])
      }).success(function(data){
        $scope.uploadedArtworks.push(data);
      }).error(function(err) {
        console.log(err);
      });
    };



    /*$scope.getAnnotatedArtwork = function() {
      var user = $scope.getCurrentUser;
      var worksAnnotated = user.worksAnnotated;

      $scope.user = $scope.getCurrentUser;
      $scope.worksAnnotateds = worksAnnotated;
    }

    $scope.getUploadedArtwork = function() {
      var user = $scope.getCurrentUser;
      var worksUploaded = user.worksUploaded;

      $scope.worksUploadeds = worksUploaded
    }*/
  }]);
