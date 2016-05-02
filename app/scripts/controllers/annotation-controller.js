'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:AnnotationCtrl
 * @description
 * # AboutCtrl
 * Controller of the anotareApp
 */
 angular.module('anotareApp')
 .controller('AnnotationCtrl', function ($scope, $http, AlbumService) {
  $scope.imageScope;
  $scope.editMode = false;
  $scope.annotationText = "";
  $scope.comments;
  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };
  
  $scope.toolIcons = [
  {
    url: 'images/tool-line.png',
    name: 'line-tool'
  },
  {
    url: 'images/tool-square.png',
    name: 'square-tool'
  },
  {
    url: 'images/tool-circle.png',
    name: 'circle-tool'
  },
  {
    url: 'images/tool-triangle.png',
    name: 'triangle-tool'
  }
  ];

    // Call the async method and then do stuff with what is returned inside the function
    // $scope.getImage = function(next) {
    //   AlbumService.getImage()
    //   .then(
    //     //success function
    //     function (asyncImageData) {
    //         // console.log(asyncImageData.data);
    //         $scope.imageScope = asyncImageData.data.Album[0];
    //         next();
    //       },
    //     //error function
    //     function(result) {
    //       console.log("Failed to get the image, result is " + result.toString()); 
    //     });
    // };
    
  });
