'use strict';
/**
 * @ngdoc function
 * @name anotare.directive:display-annotation
 */

angular.module('anotareApp')
  .directive('displayAnnotation', function () {
    return {
      restrict : 'E',
      replace : true,
      templateUrl :'views/display-annotation.html',
      link: function(scope, element, attribute, event) {
        scope.editMode = false;
        scope.addMode = false;
        scope.showAnnotation = false;
        scope.showDropdown = true;
        scope.isEditingAnnotation = false;
        scope.annotationText = "";

        //prevent default right click function
        // window.oncontextmenu = function() { return false;};

        var shapeLastClicked, canvasWidth, canvasHeight, raster;

        var toolSelected, newAnnotation, newShape;

        var annotationTextBeforeEdit = "";

        // initialize the page
        var init = function() {
            var canvasContainer = $("#canvas-container");
            scope.canvas = document.getElementById("main-canvas");

            var img = new Image();
            img.src = scope.imageScope.src;

            img.addEventListener("load", function(){
                var scaleCanvas = this.naturalHeight / this.naturalWidth;
                canvasContainer.height(canvasContainer.width() * scaleCanvas);
                // canvas.setAttribute("width", screen.availWidth * 0.55);

                paper.setup(scope.canvas);
                // canvas.height =  screen.availHeight * 0.85;

                scope.paper = paper;
                //ajax http get method to get image object from database

                drawAll();
            });
            
        }

        //global styles to be used on the shapes
        var styleDefault = {
          strokeColor: new paper.Color(0.8,0.9),
          strokeWidth: 1.5,
          fillColor: new paper.Color(0,0,0,0.2)
        };
        var styleHide = {
          strokeWidth: 0,
          fillColor: null
        };
        var stylePin = {
          strokeColor: new paper.Color(0.8,0.9),
          strokeWidth: 1.5,
          fillColor: new paper.Color(0.8,0.9)
        };
        var styleHover = {
          strokeColor: new paper.Color(0.7,0.1,0.1,1),
          strokeWidth: 2.0,
          fillColor: new paper.Color(0,0,0,0)
        };
        var styleActive = {
          strokeColor: new paper.Color(0.9,0.1,0.1,1),
          strokeWidth: 3.0,
          fillColor: new paper.Color(0,0,0,0.1)
        };
        var styleFrame = {
          strokeColor: new paper.Color(0,0,1,1),
          strokeWidth: 1
        };
        var styleFrameSelector = {
          fillColor: new paper.Color(0.2,0.2,0.8,1),
          strokeColor: new paper.Color(1,1,1,1),
          strokeWidth: 0.3
        };


        // turn on/off edit mode        
        scope.switchEditMode = function(){
          // turn off view mode if it is on
          if (scope.addMode)
          {
            scope.switchAddMode();
          }

          scope.editMode = !scope.editMode;

          changeCursorType();

          // draw frame on the first shape if edit mode is activated and
          // shapeLastClicked is not defined.
          // TODO: draw on the biggest shape
          if (scope.editMode && typeof shapeLastClicked === 'undefined') {
            // only if children contains more than one (it contains annotation)
            if (paper.project.getActiveLayer().children.length > 1) {
              shapeLastClicked = paper.project.getActiveLayer().children[1];
            }
          }

          // draw frame boundary for shape last clicked
          if (typeof shapeLastClicked !== 'undefined') {
            if (scope.editMode) {
              // drawFrameOn(shapeLastClicked, 'makeNew');
              shapeLastClicked.onClick();
            }
            else {
              shapeLastClicked.removeSegments();
              shapeLastClicked.frame.remove();
            }
          }
        }

        // turn on/off view mode
        scope.switchAddMode = function () {
          // turn off edit mode if it is on
          if (scope.editMode){
            scope.switchEditMode();
            raster.onClick(); //hack to clear previously shaped click
          }

          scope.addMode = !scope.addMode;

          if (!scope.addMode) {
            toolSelected = '';
          }


          // if (typeof shapeLastClicked !== 'undefined') {
          //   shapeLastClicked.removeSegments();
          //   shapeLastClicked.frame.remove();
          // }
          
          // get array of shapes
          var shapes = paper.project.getActiveLayer().children;

        }

        var changeCursorType = function() {
          if (scope.addMode && !!toolSelected) {
            $('html,body').css('cursor','crosshair');
          } else {
            $('html,body').css('cursor','default');
          }
        }

        scope.isToolSelected = function(toolName) {
          return toolSelected === toolName;
        }
        // when clicking the shapes on the dropdown menu
        scope.selectDrawTool = function(toolName){
          toolSelected = toolName;

          // var origX = newShape.position.x / scope.canvas.width;
          // var origY = newShape.position.y / scope.canvas.height;
          // newShape.remove();
          changeCursorType();
          if (toolName === 'circle-tool'){
            newAnnotation = 
            {
              "type":"ellipse",
            }
          }
          else if (toolName === 'square-tool'){
            newAnnotation = 
            {
              "type":"rectangle",
            }
          }
          // newShape = scope.drawAnnotation(newAnnotation);
        }

        //draw the image
        var drawImage = function(next){

          //resize the image to max in the canvas
          var resizeRaster = function(){
            var rasterHeight = this.getHeight();
            var rasterWidth = this.getWidth();
            canvasHeight = parseFloat(scope.canvas.style.height, 10);
            canvasWidth = parseFloat(scope.canvas.style.width, 10);
            var scale = Math.min(canvasHeight/rasterHeight, canvasWidth/rasterWidth);

            this.scale(scale);
            next();
          }

          // initialize raster
          raster = new paper.Raster(scope.imageScope.src);
          raster.type = 'main-image';
          raster.onLoad = resizeRaster;
          raster.position = paper.view.center;

          raster.onClick = function(event){

            //hide annotation
            scope.safeApply(function() {
              scope.showAnnotation = false;
            });

            resetEditAnnotationText();

            // if raster is clicked, turn shapes into style standard
            if (typeof shapeLastClicked !== 'undefined') {
              shapeLastClicked.style = styleDefault;
              shapeLastClicked.active = false;
              if (shapeLastClicked.frame) {
                shapeLastClicked.removeSegments();
                shapeLastClicked.frame.remove();
              }
            }

        if (scope.addMode) {
            var eventPointXRelativeCanvas = event.point.x - scope.canvas.offsetLeft;
            var eventPointYRelativeCanvas = event.point.y - scope.canvas.offsetTop;
            console.log(newAnnotation);
            newAnnotation.relative_x = eventPointXRelativeCanvas / canvasWidth;
            newAnnotation.relative_y = eventPointYRelativeCanvas / canvasHeight;
            newShape = scope.drawAnnotation(newAnnotation);
            shapeLastClicked = newShape;
            scope.safeApply(scope.switchEditMode);
            newShape.onClick();
            newShape = undefined;
          }
        }
      }

        // find angle for rotation of shape
        // TODO: detect when it is counterclockwise rotation
        var findAngle = function (centerPoint, rotatePoint, eventPoint ){
          return eventPoint.subtract(centerPoint).angle - rotatePoint.subtract(centerPoint).angle;
        }

        // draw boundary frame on shapes
        var drawFrameOn = function(shape, updateType){

            // draw rectangle path around shape
            var drawPath = function(shape){
              var b = shape.bounds.clone().expand(5,5);
              shape.frame = new paper.Path.Rectangle(b);
              shape.frame.strokeWidth = 1;
              shape.frame.strokeColor = 'blue';
              shape.frame.insert(2, new paper.Point(b.center.x, b.top));
              shape.frame.insert(2, new paper.Point(b.center.x, b.top-15));
              shape.frame.insert(2, new paper.Point(b.center.x, b.top));
            }

            // draw little squares on the corners
            // these segments, when dragged resize the shapes
            // except rotate segment is dragged, it rotates the shape
            var drawSegments = function(shape) {

              shape.frame.bottomLeftSegment = new paper.Path.Rectangle({
                x: shape.frame.segments[0].point.x - 2.5,
                y: shape.frame.segments[0].point.y - 2.5,
                width: 5,
                height: 5,
                fillColor: 'white',
                strokeColor: 'blue',
                strokeWidth: 1,
                onMouseDrag : function(event){
                  if (event.point.y <= shape.frame.segments[5].point.y + 10) {
                    event.point.y = shape.frame.segments[5].point.y + 10;
                  } 
                  if (event.point.x >= shape.frame.segments[5].point.x - 10) {
                    event.point.x = shape.frame.segments[5].point.x - 10;
                  }
                  shape.bounds.setBottomLeft(event.point);
                  drawFrameOn(shape, 'updateAll');
                },
                onMouseEnter: function() {
                  $('html,body').css('cursor','nesw-resize');
                },
                onMouseLeave: function() {
                  $('html,body').css('cursor','default');
                }
              });

              shape.frame.topLeftSegment = new paper.Path.Rectangle({
                x: shape.frame.segments[1].point.x - 2.5,
                y: shape.frame.segments[1].point.y - 2.5,
                width: 5,
                height: 5,
                fillColor: 'white',
                strokeColor: 'blue',
                strokeWidth: 1,
                onMouseDrag : function(event){
                  if (event.point.y >= shape.frame.segments[6].point.y - 10) {
                    event.point.y = shape.frame.segments[6].point.y - 10;
                  } 
                  if (event.point.x >= shape.frame.segments[6].point.x - 10) {
                    event.point.x = shape.frame.segments[6].point.x - 10;
                  }
                  shape.bounds.setTopLeft(event.point);
                  drawFrameOn(shape, 'updateAll');
                },
                onMouseEnter: function() {
                  $('html,body').css('cursor','nwse-resize');
                },
                onMouseLeave: function() {
                  $('html,body').css('cursor','default');
                }
              });

              shape.frame.topRightSegment = new paper.Path.Rectangle({
                x: shape.frame.segments[5].point.x - 2.5,
                y: shape.frame.segments[5].point.y - 2.5,
                width: 5,
                height: 5,
                fillColor: 'white',
                strokeColor: 'blue',
                strokeWidth: 1,
                onMouseDrag : function(event){
                  if (event.point.y >= shape.frame.segments[0].point.y - 10) {
                    event.point.y = shape.frame.segments[0].point.y - 10;
                  } 
                  if (event.point.x <= shape.frame.segments[0].point.x + 10) {
                    event.point.x = shape.frame.segments[0].point.x + 10;
                  }
                  shape.bounds.setTopRight(event.point);
                  drawFrameOn(shape, 'updateAll');
                },
                onMouseEnter: function() {
                  $('html,body').css('cursor','nesw-resize');
                },
                onMouseLeave: function() {
                  $('html,body').css('cursor','default');
                }
              });

              shape.frame.bottomRightSegment = new paper.Path.Rectangle({
                x: shape.frame.segments[6].point.x - 2.5,
                y: shape.frame.segments[6].point.y - 2.5,
                width: 5,
                height: 5,
                fillColor: 'white',
                strokeColor: 'blue',
                strokeWidth: 1,
                onMouseDrag : function(event){
                  if (event.point.y <= shape.frame.segments[1].point.y + 10) {
                    event.point.y = shape.frame.segments[1].point.y + 10;
                  } 
                  if (event.point.x <= shape.frame.segments[1].point.x + 10) {
                    event.point.x = shape.frame.segments[1].point.x + 10;
                  }
                  shape.bounds.setBottomRight(event.point);
                  drawFrameOn(shape, 'updateAll');
                },
                onMouseEnter: function() {
                  $('html,body').css('cursor','nwse-resize');
                },
                onMouseLeave: function() {
                  $('html,body').css('cursor','default');
                }
              });

              shape.frame.rotateSegment = new paper.Path.Rectangle({
                x: shape.frame.segments[3].point.x - 2.5,
                y: shape.frame.segments[3].point.y - 2.5,
                width: 5,
                height: 5,
                fillColor: 'white',
                strokeColor: 'blue',
                strokeWidth: 1,
                onMouseDrag : function(event){
                  var rotateAngle=findAngle(shape.bounds.center, shape.frame.segments[3].point, event.point);
                  shape.rotate(rotateAngle);
                  shape.frame.rotate(rotateAngle);
                  drawFrameOn(shape, 'updateSegments');
                  shape.frame.bottomRightSegment.rotate(rotateAngle);
                  shape.frame.bottomLeftSegment.rotate(rotateAngle);
                  shape.frame.topRightSegment.rotate(rotateAngle);
                  shape.frame.topLeftSegment.rotate(rotateAngle);
                  shape.frame.rotateSegment.rotate(rotateAngle);
                },
                onMouseEnter: function() {
                  $('html,body').css('cursor','all-scroll');
                },
                onMouseLeave: function() {
                  $('html,body').css('cursor','default');
                }
              });
            }

            // remove the segments (little squares on the boundary frame)
            var removeSegments = function (){
              shape.frame.bottomLeftSegment.remove();
              shape.frame.bottomRightSegment.remove();
              shape.frame.topLeftSegment.remove();
              shape.frame.topRightSegment.remove();
              shape.frame.rotateSegment.remove();
            }


            // API of the function, makeNew draw new shape with the segments
            // updateAll remove the old shape and boundary, then draw new one
            // updateSegments only update the boundary frame and segments
            shape.removeSegments = removeSegments;

            if (updateType === 'makeNew'){
              drawPath(shape);
              drawSegments(shape);
            }
            else if (shape.frame && updateType === 'updateAll'){
              removeSegments(shape);
              shape.frame.remove();
              drawPath(shape);
              drawSegments(shape);
            }
            else if (shape.frame && updateType === 'updateSegments'){
              removeSegments(shape);
              drawSegments(shape);
            }

          };
        

        //draw shapes on the image/Raster
        scope.drawAnnotation = function( annotation ){

          // mouse actions to be applied on shapes
          var mouseActionsOn = function(shape){
            //hover effect
            var mouseEnterEffect = function(shape){
              if (scope.editMode) {
                $('html,body').css('cursor','move');
              } else {
                $('html,body').css('cursor','pointer');
              }
              if (!shape.active){
                shape.style = styleHover;
              }
            }

            //unhover effect
            var mouseLeaveEffect = function(shape){
              $('html,body').css('cursor','default');
              if (!shape.active){
                if (shape.type === 'pin') {
                  shape.style = stylePin;
                }
                else {
                  shape.style = styleDefault;
                }
              }
            }

            //only activated when editMode is true
            var mouseDragEffect = function(event, shape) {

              $('html,body').css('cursor','move');

              //prevent dragging shapes outside of the canvas
              var dragBound = function(point,shape){
                var halfHeight = shape.bounds.height/2;
                var halfWidth = shape.bounds.width/2;

                if(point.x < shape.bounds || point.x > canvasWidth - halfWidth || 
                  point.y < halfHeight || point.y > canvasHeight - halfHeight) {
                  return false;
                } else {
                  return true;
                }

              }

              // if (shape === newShape || (scope.editMode && dragBound(event.point,shape)) ){
              if (scope.editMode && dragBound(event.point,shape)){
                shape.position = event.point;
                drawFrameOn(shape, 'updateAll');
              }
            }

            //give an active effect when shape is clicked, show frame only when editMode is true
            //shapeLastClicked is a 'global' variable to determine which shape was last clicked
            var mouseClickEffect = function(event, shape) {
              if (typeof shapeLastClicked !== 'undefined' && shapeLastClicked !== shape ){
                if (shapeLastClicked.type === 'pin') {
                    shapeLastClicked.style = stylePin;
                }
                else {
                  shapeLastClicked.style = styleDefault;
                }
                shapeLastClicked.active = false;
                resetEditAnnotationText();
                if (shape === newShape || scope.editMode){
                  shapeLastClicked.removeSegments();
                  shapeLastClicked.frame.remove();
                }
              }
              shapeLastClicked = shape;

              shape.active = true;

              shape.style = styleActive;

              //show the text corresponding to the shape
              scope.showAnnotation=true;
              scope.safeApply(function() {
                scope.annotationText = shape.text;
                scope.comments = shape.comments;
              });

              if (shape === newShape || scope.editMode){
                if (!shape.frame){
                  drawFrameOn(shape, 'makeNew');
                }
                else {
                  drawFrameOn(shape, 'updateAll');
                }
              }
            }

            //override the mouse actions of shape
            shape.onMouseDrag   = function(event) { mouseDragEffect  ( event, shape ) };
            shape.onMouseEnter  = function() { mouseEnterEffect ( shape ) };
            shape.onMouseLeave  = function() { mouseLeaveEffect ( shape ) };
            shape.onClick   = function(event) {mouseClickEffect ( event, shape); return false;}

          };
          //end mouseActionsOn

          // draw rectangle
          var drawRect = function( shape ){
            var rect;
            if (typeof shape.relative_width === 'undefined' || typeof shape.relative_height === 'undefined'){
              rect = new paper.Path.Rectangle({
                width: 70,
                height: 70,
                style: styleDefault
              });
            }
            else {
              rect = new paper.Path.Rectangle({
                width: shape.relative_width * canvasWidth,
                height: shape.relative_height * canvasHeight,
                style: styleDefault
              });
            }
            return rect;
          };

          // draw ellipse
          var drawEllipse = function( shape ){
            var ellipse;
            if (typeof shape.relative_width === 'undefined' || typeof shape.relative_height === 'undefined'){
              ellipse = new paper.Path.Ellipse({
                width: 70,
                height: 70,
                style: styleDefault
              });
            }
            else {
              ellipse = new paper.Path.Ellipse({
                width: shape.relative_width * canvasWidth,
                height: shape.relative_height * canvasHeight,
                style: styleDefault
              });
            }
            return ellipse;
          };

          //draw pin
          var drawPin = function( shape ){
            var pin = new paper.Path.Circle({
              radius: 3,
              style: stylePin
            });
            return pin;
          };

          //draw every annotation from annotations
          var shape;

          if (annotation.type === 'rectangle'){
            shape = drawRect(annotation);
          }
          else if (annotation.type === 'ellipse'){
            shape = drawEllipse(annotation);
          }
          else if(annotation.type === 'pin'){
            shape = drawPin(annotation);
          }

          //creating the frame and overriding mouse actions on every shape
          if (typeof shape !== 'undefined') {

            shape.type = annotation.type;
            shape.position.setX(annotation.relative_x * canvasWidth);
            shape.position.setY(annotation.relative_y *  canvasHeight);
            shape.text = annotation.text;
            shape.comments = annotation.comments;
            shape.active = false;
            mouseActionsOn(shape);
            return shape;
          }
          else { //shape is unidentified
            console.log('Shape' + annotation.type + 'is unidentified');
          }

        };
        //end drawAnnotations

        //wrapper function to draw image, annotation, frame, and the implement the mouse actions on the shapes
        var drawAll = function(){
          drawImage( function() {
            scope.imageScope.annotations.forEach(function(annotation){
              scope.drawAnnotation(annotation);
            }); 
          });
        };

        scope.switchToEditAnnotationText = function() {
          var $annotation = $("#annotation-description");
          scope.isEditingAnnotation = true;
          annotationTextBeforeEdit = scope.annotationText;
          $annotation.prop('contenteditable', scope.isEditingAnnotation).focus();
        }


        scope.cancelEditAnnotationText = function () {
          scope.isEditingAnnotation = false;
          //somehow angular binding is not working...
          console.log(annotationTextBeforeEdit);
          if (annotationTextBeforeEdit.trim().length > 0) {
            scope.annotationText = annotationTextBeforeEdit;
            // $("#annotation-description > span").text(scope.annotationText);
          }
          annotationTextBeforeEdit = "";
        }

        var resetEditAnnotationText = function() {
          annotationTextBeforeEdit = "";
          scope.cancelEditAnnotationText();
        }

        scope.updateEditAnnotationText = function () {
          scope.isEditingAnnotation = false;
          //somehow angular binding is not working...
          // scope.annotationText = $("#annotation-description > span").text();
          annotationTextBeforeEdit = ""
        }

        //setup canvas
        scope.getImage(init);
        
      }
    };
  });