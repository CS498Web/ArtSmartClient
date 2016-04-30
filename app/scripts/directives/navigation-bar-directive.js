'use strict';
/**
 * @ngdoc function
 * @name anotare.directive:navigation-bar
 */

angular.module('anotareApp')
  .directive('navigationBar', function () {
    return {
      restrict : 'E',
      templateUrl :'views/navigation-bar.html',
      link: function(scope, element, attribute, event) {

          scope.modalTitle = "Login";
          scope.name = "Roger";
          scope.loggingIn = false;
          scope.signingUp = false;
          scope.uploading = true;
      }
    };
  })
