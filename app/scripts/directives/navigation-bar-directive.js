'use strict';
/**
 * @ngdoc function
 * @name anotare.directive:navigation-bar
 */

angular.module('anotareApp')
  .directive('navigationBar', function () {
    return {
      restrict : 'E',
      controller : 'navigation-bar',
      templateUrl :'views/navigation-bar.html',
      link: function(scope, element, attribute, event) {

      }
    };
  })
