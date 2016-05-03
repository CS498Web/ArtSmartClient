'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:AnnotationCtrl
 * @description
 * # AboutCtrl
 * Controller of the anotareApp
 */
 angular.module('anotareApp')
 .controller('AnnotationCtrl', [ '$scope', '$http', 'ArtworkService', '$stateParams',
             function ($scope, $http, ArtworkService, $stateParams) {
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

    $scope.getImage = function(next) {
      ArtworkService.getOne($stateParams.artwork_id)
      .then(
        //success function
        function (response) {
            $scope.imageScope = response.data;
            next();
          },
        //error function
        function(result) {
          console.log("Failed to get the image, result is :");
          console.log(result); 
        });
    };

    $scope.updateImage = function() {
      ArtworkService.putOne($stateParams.artwork_id, $scope.imageScope)
      .then(
        //success function
        function (response) {
          },
        //error function
        function(result) {
          console.log("Failed to get the image, result is :");
          console.log(result); 
        });
    };

    $scope.deleteAnnotation = function(annotation_id) {
      ArtworkService.deleteAnnotation($stateParams.artwork_id, annotation_id)
      .then(
        //success function
        function (response) {
          },
        //error function
        function(result) {
          console.log("Failed to delete annotation, result is :");
          console.log(result); 
        });
    };
    
  }]);
