'use strict';
/**
 * @ngdoc function
 * @name anotare.directive:filebrowse
 */

angular.module('anotareApp')
  .directive("filebrowse", [function() {
    return {
      restrict: 'A',
      scope: {
        fileread: "="
      },
      link: function($scope, element, attributes) {
        element.bind("change", function(changeEvent) {
          var reader = new FileReader();
          reader.onload = function(e) {
            $scope.$apply(function() {
              $scope.$parent.fileToUpload = e.target.result;
              $("#imgDrop").css('background-image','url(' + $scope.$parent.fileToUpload + ')');
              $scope.urlValue = "";
            });
          }
          reader.readAsDataURL(changeEvent.target.files[0]);
        });
      }
    }
  }]);
