'use strict';
/**
 * @ngdoc function
 * @name anotare.directive:parallax
 */

angular.module('anotareApp')
.directive('parallax', function () {
  return {
    restrict: 'A',
    replace : true,
    scope: {
      offset: "@offsetParallax",  // specify how much the logo moves away from the original position
      direction: "@directionParallax", // if reverse, then the logo moves away from the mouse
    },
    link: function(scope, element, attribute, event) {

      // initialize variables
      var currentMousePos = { x: -1, y: -1 };

      // convert into number
      var initialMarginTop = Number(element.css("margin-top").replace(/[^-\d\.]/g, ''));
      var initialMarginLeft = Number(element.css("margin-left").replace(/[^-\d\.]/g, ''));
      var widthElement = Number(element[0].style.width.replace(/[^-\d\.]/g, ''));
      var heightElement = Number(element[0].style.height.replace(/[^-\d\.]/g, ''));

      var centerV = $(window).height() - heightElement/2 + 10;
      var centerH = $(window).width() - widthElement/2;


      //create parallax effect on the logo
      $(document).mousemove(function(event) {
          currentMousePos.x = event.pageX;
          currentMousePos.y = event.pageY;
          if (scope.direction === 'reverse'){
            var marginTop =  initialMarginTop - (currentMousePos.y - centerV) / centerV * scope.offset;
            var marginLeft = initialMarginLeft - (currentMousePos.x - centerH) / centerH * scope.offset;
          }
          else {
            var marginTop =  initialMarginTop + (currentMousePos.y - centerV) / centerV * scope.offset;
            var marginLeft = initialMarginLeft + (currentMousePos.x - centerH) / centerH * scope.offset;
          }
          element.css({
            "margin-top": marginTop + "px",
            "margin-left": marginLeft + "px"
          });
      });

    }
  };
})