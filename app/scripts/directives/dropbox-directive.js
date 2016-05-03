'use strict';
/**
 * @ngdoc function
 * @name anotare.directive:dropbox
 */

angular.module('anotareApp')
  .directive('dropbox', function() {
    return {
      restrict: 'A',
      require: '^navigation-bar',
      link: function($scope, element) {
        $scope.uploadImgSrc = "images/graybox.jpg"
        element.bind('error', function(){
          //console.log("dsfdsaf");
        })
        element.bind('dragover', function(e) {
          e.stopPropagation();
          e.preventDefault();
        });
        element.bind('dragenter', function(e) {
          e.stopPropagation();
          e.preventDefault();
          $scope.$apply(function() {
            element.addClass('highlight-border');
          });
        });
        element.bind('dragleave', function(e) {
          e.stopPropagation();
          e.preventDefault();
          $scope.$apply(function() {
            element.removeClass('highlight-border');
          });
        });
        element.bind('drop', function(e) {
          var droppedFile = [];
          if (e.dataTransfer) {
            droppedFile = e.dataTransfer.files[0];
          } else {
            droppedFile = e.originalEvent.dataTransfer.files[0];
          }

          e.stopPropagation();
          e.preventDefault();

          var reader = new FileReader();


          reader.onload = function(e) {

            $scope.$apply(function() {

              element.removeClass('highlight-border');
              $scope.fileToUpload = e.target.result;
              //$scope.$parent.fileToUpload = e.target.result;

            });
          }
          reader.readAsDataURL(droppedFile);
        });
      }
    };
  })
