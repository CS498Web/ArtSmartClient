'use strict';
/**
 * @ngdoc function
 * @name anotare.directive:drop-tool
 */

 angular.module('anotareApp')
.directive('dropTool', function () {
  return {
    restrict: 'E',
    replace : true,
    templateUrl:'views/dropdown.html',
    link: function(scope, element, attribute, event) {
      var newAnnotation, newShape, oldShape;
      var $dropdown = $("#dropdown-context");
      var confirmDraw = false;
      var isNewShape;

      // draw the dropdown menu where the mouse is clicked
      scope.drawDropdown = function(ev, shape){
        $dropdown.css({
          top: ev.event.y + "px", 
          left: ev.event.x + "px", 
          display: "block",
          zIndex: 1001
        });

        // if the mouse is clicked not on shape (on raster)
        if (typeof shape === 'undefined'){
          isNewShape = true;
           newAnnotation = {
                            "type":"pin",
                            "x": ev.point.x,
                            "y": ev.point.y,
                            "text": scope.newAnnotationText
                          }
          newShape = scope.drawAnnotation(newAnnotation);
        }
        else { //if the mouse is clicked on the shape
          isNewShape = false;
          newShape = shape;
          oldShape = shape;
        }
      };

      // hide the dropdown menu
      scope.hideDropdown = function(){
        $dropdown.css({
          display: "none"
        });

        if (!confirmDraw && isNewShape && typeof newShape !== 'undefined'){
          newShape.remove();
        }
        else {
          //shape has been drawn, reset confirmDraw and newShape
          confirmDraw = false;
          newShape = undefined;
        }
      };

      // when submit is clicked on the drop down meny
      scope.submitNewAnnotation = function() {
        //check if the fieldtext is not empty
        if (scope.newAnnotationText && scope.newAnnotationText.trim() !== ""){
          confirmDraw = true;
          newShape.text = scope.newAnnotationText;
          scope.hideDropdown();
          scope.showDropdown = true;
        }
        else {
          console.log("you have to write on the input field to submit a new annotation");
        }
      }

      scope.cancelNewAnnotation = function() {
        scope.hideDropdown();
        scope.showDropdown = true;
      }

      // when clicking the shapes on the dropdown menu
      scope.dropdownClick = function(toolName){
        var origX = newShape.position.x / scope.canvas.width;
        var origY = newShape.position.y / scope.canvas.height;
        newShape.remove();
        if (toolName === 'circle-tool'){
          newAnnotation = 
          {
            "type":"ellipse",
            "relative_x": origX,
            "relative_y": origY,
            "text": scope.newAnnotationText
          }
        }
        else if (toolName === 'square-tool'){
          newAnnotation = 
          {
            "type":"rectangle",
            "relative_x": origX,
            "relative_y": origY,
            "text": scope.newAnnotationText
          }
        }
        newShape = scope.drawAnnotation(newAnnotation);

      }
    }
  };
})