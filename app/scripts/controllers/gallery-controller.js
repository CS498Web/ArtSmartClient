'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:AnnotationCtrl
 * @description
 * # AboutCtrl
 * Controller of the anotareApp
 */
 angular.module('anotareApp')
 .controller('GalleryCtrl', function ($scope, $http, AlbumService) {

    $scope.items = [];
    $scope.imageScope = [];

    // Call the async method and then do stuff with what is returned inside the function
    $scope.getImage = function() {
      AlbumService.getImage()
      .then(
        //success function
        function (asyncImageData) {
            // console.log(asyncImageData.data);
            $scope.imageScope = asyncImageData.data.Album;
          },
        //error function
        function(result) {
          console.log("Failed to get the image, result is " + result.toString()); 
        });
    };
  });
