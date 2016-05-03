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
        // console.log(scope.isLoggedIn);
      }
    };
  })
