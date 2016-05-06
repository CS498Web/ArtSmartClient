'use strict';
/**
 * @ngdoc function
 * @name anotare.directive:display-annotation
 */

angular.module('anotareApp')
  .directive('displayAnnotation', ['$timeout', function ($timeout) {
    return {
      restrict : 'E',
      replace : true,
      templateUrl :'views/display-annotation.html',
      link: function(scope, element, attribute, event) {
        scope.editMode = false;
        scope.addMode = false;
        scope.showAnnotation = false;
        scope.showDropdown = true;
        isEditingAnnotation = false;
        scope.currentAnnotation = {};
        scope.newComment = "";
        scope.annotationHeader = "annotation"; //TODO change number of annotations dynamically
        scope.annotationShapes = [];
        var currentUser = scope.getCurrentUser();

        var shouldShowMoreDescription = false;
        var shouldShowEditImageDescription = true;

        var shapeLastClicked, canvasWidth, canvasHeight, raster;

        var toolSelected, newAnnotation, newShape;

        var annotationTextBeforeEdit = "";

        var isAddingNewAnnotation = false;
        var isEditingAnnotation = false;

        var stickyShowAnnotation = false;
        var shouldShowTextAnnotationTools = false;
        var shouldShowCommentTextArea = false;
        var shouldShowDeleteButton = false;

        var imageDescriptionBeforeEdit = {};

        scope.imageDescription = {};

        $("#main-canvas").on("mouseup", function(event) {
          if (scope.editMode && !isAddingNewAnnotation) {
            _.map(scope.imageScope.annotations, function(annotation){
              if(annotation._id === shapeLastClicked.key) {
                var newRelativeSegmentPoints = [];
                _.each(shapeLastClicked.segments, function(elem) {
                  newRelativeSegmentPoints.push({
                    x: elem.point.x / canvasWidth,
                    y: elem.point.y / canvasHeight
                  })
                })
                annotation.relativeSegmentPoints = newRelativeSegmentPoints;
              }
            });

            scope.updateImage();
            
          }
        })

        // initialize the page
        var init = function() {
            // $(document).ready(function(){
              
              scope.imageDescription = _.pick(scope.imageScope,
                'artists', 'title', 'description', 'currentLocation', 'period', 'year', 'originLocation', 'medium', 'actualSize');
              if (_.isArray(scope.imageDescription.artists)) {
                scope.imageDescription.artists = scope.imageDescription.artists.join(", ");
              }
              var canvasImage = document.getElementById("canvas-image");

              var canvasImage = document.getElementById("canvas-image");

              canvasImage.addEventListener('load', function() {
                var canvasContainer = $("#canvas-container");
                scope.canvas = document.getElementById("main-canvas");
                var buttonColumn = $("#button-column");
                var scaleCanvas = this.naturalHeight / this.naturalWidth;
                var canvasContainerHeight = canvasContainer.width() * scaleCanvas;
                canvasContainer.height(canvasContainerHeight);
                buttonColumn.height(canvasContainerHeight);

                paper.setup(scope.canvas);
                scope.paper = paper;
                //ajax http get method to get image object from database
                drawAll();
              });
              
            // });
            
        }

        //global styles to be used on the shapes
        var styleDefault = {
          strokeColor: new paper.Color(0.8,0.9),
          strokeWidth: 1.5,
          fillColor: new paper.Color(0,0,0,0.2)
        };

        var styleLine = {
          strokeColor: new paper.Color(0.8,0.9),
          strokeWidth: 3.5,
          fillColor: new paper.Color(0,0,0,0.2)
        };

        var styleHide = {
          strokeWidth: 0,
          fillColor: null
        };
        // var stylePin = {
        //   strokeColor: new paper.Color(0.8,0.9),
        //   strokeWidth: 1.5,
        //   fillColor: new paper.Color(0.8,0.9)
        // };
        var styleHover = {
          strokeColor: new paper.Color(0.7,0.1,0.1,1),
          strokeWidth: 2.0,
          fillColor: new paper.Color(0,0,0,0.1)
        };
        var styleActive = {
          strokeColor: new paper.Color(0.9,0.1,0.1,1),
          strokeWidth: 3.0,
          fillColor: new paper.Color(0,0,0,0.0001) //hack so that it's still filled
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

          if (!scope.isLoggedIn()) {
            alert("You have to log in to comment!");
            return;
          } 

          if (scope.editMode && isAddingNewAnnotation && !scope.tryDestroySelectedAnnotation()) {
            return;
          }

          // turn off view mode if it is on
          if (scope.addMode)
          {
            scope.switchAddMode();
          }

          scope.editMode = !scope.editMode;

          changeCursorType();

          // draw frame on the first shape if edit mode is activated and
          // shapeLastClicked is not defined.
          // TODO: draw on the biggest shape instead of getting the first one
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
              shapeLastClicked.onMouseDown(null, 'force-update');
            }
            else {
              shapeLastClicked.removeSegments();
              shapeLastClicked.frame.remove();
            }
            paper.view.draw();
          }
        }

        // turn on/off view mode
        scope.switchAddMode = function () {
          if (!scope.isLoggedIn()) {
            alert("You have to log in to comment!");
            return;
          }
          // turn off edit mode if it is on
          if (scope.editMode && isAddingNewAnnotation && !scope.tryDestroySelectedAnnotation()) {
            return;
          }

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
          // var shapes = paper.project.getActiveLayer().children;

        }

        var changeCursorType = function() {
          if (scope.checkIsToolSelected()) {
            $('html,body').css('cursor','crosshair');
          } else {
            $('html,body').css('cursor','default');
          }
        }

        scope.isEqualToToolSelected = function(toolName) {
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
              "shapeType":"ellipse",
              "comments": []
            }
          } else if (toolName === 'square-tool'){
            newAnnotation = 
            {
              "shapeType":"rectangle",
              "comments": []
            }
          } else if (toolName === 'line-tool'){
            newAnnotation = 
            {
              "shapeType":"line",
              "comments": []
            }
          } else if (toolName === 'triangle-tool'){
            newAnnotation = 
            {
              "shapeType":"triangle",
              "comments": []
            }
          }
          // newShape = scope.drawAnnotation(newAnnotation);
        }

        //draw the image
        var drawImage = function(next){

          // initialize raster
          raster = new paper.Raster('canvas-image');

          raster.on('load', function() {
            var rasterHeight = raster.getHeight();
            var rasterWidth = raster.getWidth();
            canvasHeight = parseFloat(scope.canvas.style.height, 10);
            canvasWidth = parseFloat(scope.canvas.style.width, 10);
            var scale = Math.min(canvasHeight/rasterHeight, canvasWidth/rasterWidth);
            raster.scale(scale);
            raster.position = paper.view.center;
            raster.type = 'main-image';

            raster.onMouseEnter = function () {
              if (scope.checkIsToolSelected()) {
                $('html,body').css('cursor','crosshair');
              }
            }

            raster.onClick = function(event){

              if (isAddingNewAnnotation && !scope.tryDestroySelectedAnnotation()) {
                return;
              }
              //hide annotation
              scope.safeApply(function() {
                scope.showAnnotation = false;
              });

              resetEditAnnotationText();
              resetAddingComment();

              stickyShowAnnotation = false;
              shouldShowTextAnnotationTools = false;
              scope.safeApply(function() {
                shouldShowDeleteButton = false;
              });

              // if raster is clicked, turn shapes into style standard
              if (typeof shapeLastClicked !== 'undefined') {
                if (shapeLastClicked.shapeType === 'line') {
                  shapeLastClicked.style = styleLine;
                } else {
                  shapeLastClicked.style = styleDefault;
                }
                shapeLastClicked.active = false;
                if (shapeLastClicked.frame) {
                  shapeLastClicked.removeSegments();
                  shapeLastClicked.frame.remove();
                }
              }

              if (scope.checkIsToolSelected()) {
                var eventPointXRelativeCanvas = event.point.x - scope.canvas.offsetLeft;
                var eventPointYRelativeCanvas = event.point.y - scope.canvas.offsetTop;
                if (toolSelected === 'line-tool') {
                  newAnnotation.relativeSegmentPoints = [
                    {
                      x: (eventPointXRelativeCanvas - 25) / canvasWidth,
                      y: (eventPointYRelativeCanvas + 25) / canvasHeight
                    },
                    {
                      x: (eventPointXRelativeCanvas + 25) / canvasWidth,
                      y: (eventPointYRelativeCanvas - 25) / canvasHeight
                    }
                  ];
                } else if (toolSelected === 'triangle-tool') {
                  newAnnotation.relativeSegmentPoints = [
                    {
                      x: (eventPointXRelativeCanvas - 25) / canvasWidth,
                      y: (eventPointYRelativeCanvas + 25) / canvasHeight
                    },
                    {
                      x: (eventPointXRelativeCanvas + 25) / canvasWidth,
                      y: (eventPointYRelativeCanvas + 25) / canvasHeight
                    },
                    {
                      x: (eventPointXRelativeCanvas     ) / canvasWidth,
                      y: (eventPointYRelativeCanvas - 13) / canvasHeight
                    }
                  ];
                } else {
                  newAnnotation.relativeX = eventPointXRelativeCanvas / canvasWidth;
                  newAnnotation.relativeY = eventPointYRelativeCanvas / canvasHeight;
                  newAnnotation.relativeHeight = 0.05;
                  newAnnotation.relativeWidth = 0.05 * canvasHeight / canvasWidth;
                }
                toolSelected = '';
                
                newShape = scope.drawAnnotation(newAnnotation, 'tool');
                shapeLastClicked = newShape;
                scope.switchEditMode();
                newShape.onMouseDown(null, 'force-update');
                scope.switchToEditAnnotationText();
                scope.safeApply(function() {
                  isAddingNewAnnotation = true;
                  scope.annotationHeader = "adding new annotation";
                  isEditingAnnotation = false;
                })
                  
                  // newShape = undefined;
              }
            }

            next();
          });

        }

        // find angle for rotation of shape
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
                  $('html,body').css('cursor', 'default');
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
        scope.drawAnnotation = function( annotation, drawType){

          // mouse actions to be applied on shapes
          var mouseActionsOn = function(shape){
            //hover effect
            var mouseEnterEffect = function(shape){
              if (scope.checkIsToolSelected()) {
                return;
              }

              if (scope.editMode) {
                $('html,body').css('cursor','move');
              }
              else {
                $('html,body').css('cursor','pointer');
              }

              if (!stickyShowAnnotation) {
                scope.showAnnotation=true;
                scope.safeApply(function() {
                  scope.currentAnnotation = _.pick(shape, 'text', 'comments', 'creatorName', 'dateCreated');
                  scope.comments = shape.comments;
                });
              }

              if (!shape.active){
                shape.style = styleHover;
              }
            }

            //unhover effect
            var mouseLeaveEffect = function(shape){
              if (!scope.checkIsToolSelected()) {
                $('html,body').css('cursor','default');
              }

              if (!stickyShowAnnotation) {
                scope.safeApply(function() {
                  scope.showAnnotation=false;
                });
              }

              if (!shape.active){
                if (shape.shapeType === 'line') {
                  shape.style = styleLine;
                } else {
                  shape.style = styleDefault;
                }
              }
            }

            //only activated when editMode is true
            var mouseDragEffect = function(event, shape) {
              if (scope.editMode) {

                $('html,body').css('cursor','move');

                if (event.point.x < raster.bounds.x) {
                  event.point.x = raster.bounds.x;
                } else if (event.point.x > raster.bounds.x + raster.bounds.width) {
                  event.point.x = raster.bounds.x + raster.bounds.width;
                }

                if (event.point.y < raster.bounds.y) {
                  event.point.y = raster.bounds.y;
                } else if (event.point.y > raster.bounds.y + raster.bounds.height) {
                  event.point.y = raster.bounds.y + raster.bounds.height;
                }

                shape.position.x += event.delta.x;
                shape.position.y += event.delta.y;
                drawFrameOn(shape, 'updateAll');
              }

            }

            //give an active effect when shape is clicked, show frame only when editMode is true
            //shapeLastClicked is a 'global' variable to determine which shape was last clicked
            var mouseDownEffect = function(event, shape, clickType) {

              var shouldAllowDragging = true;

              if (scope.checkIsToolSelected() || (isAddingNewAnnotation && (shape !== newShape)) ) {
                shouldAllowDragging = false;
                if ( !scope.tryDestroySelectedAnnotation() ) {
                  // prevent click bubble, returning false prevents mouse drag effect on different shape to be executed
                  return shouldAllowDragging; 
                }
              }

              if (typeof shapeLastClicked !== 'undefined' && shapeLastClicked !== shape ){
                if (shapeLastClicked.shapeType === 'line') {
                    shapeLastClicked.style = styleLine;
                } else {
                  shapeLastClicked.style = styleDefault;
                }
                shapeLastClicked.active = false;
                resetEditAnnotationText();
                resetAddingComment();

                if (scope.editMode){
                  shapeLastClicked.removeSegments();
                  shapeLastClicked.frame.remove();
                }
              }

              // show the text corresponding to the shape
              if (shapeLastClicked !== shape ||
                  (typeof clickType !== 'undefined' && clickType === 'force-update')) {
                scope.showAnnotation=true;
                scope.safeApply(function() {
                  scope.currentAnnotation = _.pick(shape, 'text', 'comments', 'creatorName', 'dateCreated');
                  scope.comments = shape.comments;
                });
              }

              scope.safeApply(function() {
                shapeLastClicked = shape;
                shape.active = true;
                shape.style = styleActive;
                stickyShowAnnotation = true;
                shouldShowTextAnnotationTools = true;
                shouldShowDeleteButton = true;
              });

              if (scope.editMode){
                if (!shape.frame){
                  drawFrameOn(shape, 'makeNew');
                }
                else {
                  drawFrameOn(shape, 'updateAll');
                }
              }

              return shouldAllowDragging; // allow mouse dragging
            }

            // var mouseUpEffect = function() {
            //   return false;
            // }
            //override the mouse actions of shape
            //TODO make backend api to update
            shape.onMouseDown   = function(event, clickType) {return mouseDownEffect ( event, shape, clickType);}
            shape.onMouseEnter  = function() { mouseEnterEffect ( shape ) };
            shape.onMouseDrag  = function(event) { mouseDragEffect  ( event, shape ) };
            shape.onMouseLeave  = function() { mouseLeaveEffect ( shape ) };
            // shape.onMouseUp   = function(event, clickType) {return mouseUpEffect ( event, shape, clickType);}
            // shape.onClick   = function(event, clickType) {mouseClickEffect ( event, shape, clickType); return false;}

          };
          //end mouseActionsOn

          // draw rectangle
          var drawRect = function( shape, drawType ){
            if (typeof drawType !== 'undefined' && drawType === 'tool') {
              var rect = new paper.Path.Rectangle({
                width: shape.relativeWidth * canvasWidth,
                height: shape.relativeHeight * canvasHeight,
                style: styleDefault,
              });
              rect.position.setX(annotation.relativeX * canvasWidth);
              rect.position.setY(annotation.relativeY *  canvasHeight);
              return rect;
            } else {
              return new paper.Path({
                segments: shape.actualSegments,
                style: styleDefault,
                closed: true
              });
            }
            
          };

          // draw ellipse
          var drawEllipse = function( shape, drawType ){
            if (typeof drawType !== 'undefined' && drawType === 'tool') {
              var ellipse = new paper.Path.Ellipse({
                width: shape.relativeWidth * canvasWidth,
                height: shape.relativeHeight * canvasHeight,
                style: styleDefault
              });
              ellipse.position.setX(annotation.relativeX * canvasWidth);
              ellipse.position.setY(annotation.relativeY *  canvasHeight);
              return ellipse;
            } else {
              var ellipse = new paper.Path({
                segments: shape.actualSegments,
                closed: true,
                style: styleDefault
              });

              ellipse.smooth();
              return ellipse;
            }
          };

          //draw line
          var drawLine = function( shape, drawType ){
            return new paper.Path({
              segments: shape.actualSegments,
              style: styleLine
            });
          };

          var drawTriangle = function( shape, drawType ){
            return new paper.Path({
              segments: shape.actualSegments,
              style: styleDefault,
              closed: true
            });
          };

          //draw every annotation from annotations
          var shape;

          annotation.actualSegments = [];

          _.each(annotation.relativeSegmentPoints, function(element, index) {
            annotation.actualSegments.push({
              x: element.x * canvasWidth,
              y: element.y * canvasWidth
            });
          });

          if (annotation.shapeType === 'rectangle'){
            shape = drawRect(annotation, drawType);
          }
          else if (annotation.shapeType === 'ellipse'){
            shape = drawEllipse(annotation, drawType);
          }
          else if(annotation.shapeType === 'line'){
            shape = drawLine(annotation, drawType);
          }
          else if(annotation.shapeType === 'triangle'){
            shape = drawTriangle(annotation, drawType);
          }

          //creating the frame and overriding mouse actions on every shape
          if (typeof shape !== 'undefined') {

            shape.shapeType = annotation.shapeType;

            // if ( !_.contains(['line', 'triangle'], shape.shapeType) ) {
            //   shape.position.setX(annotation.relativeX * canvasWidth);
            //   shape.position.setY(annotation.relativeY *  canvasHeight);
            //   shape.rotate(annotation.rotateAngle);
            // }

            shape.text = annotation.text;
            shape.dateCreated = annotation.dateCreated;
            shape.creatorName = annotation.creatorName;
            shape.comments = annotation.comments;
            shape.active = false;
            shape.key = annotation._id;
            mouseActionsOn(shape);
            return shape;
          }
          else { //shape is unidentified
            console.log('Shape' + annotation.shapeType + 'is unidentified');
          }

        };
        //end drawAnnotations

        //wrapper function to draw image, annotation, frame, and the implement the mouse actions on the shapes
        var drawAll = function(){
          drawImage( function() {
            scope.imageScope.annotations.forEach(function(annotation){
              scope.annotationShapes.push(scope.drawAnnotation(annotation));
            }); 
          });
        };

        scope.shouldShowDeleteButton = function() {
          return shouldShowDeleteButton;
        }

        scope.switchToEditAnnotationText = function() {
          if (!scope.isLoggedIn()) {
            alert("You have to log in to comment!");
          } else {
            isEditingAnnotation = true;
            annotationTextBeforeEdit = scope.currentAnnotation.text;
            angular.element("#annotation-description > textarea").prop("disabled", false).focus();
          }
        }

        scope.submitNewAnnotation = function () {
          if (scope.currentAnnotation.text && scope.currentAnnotation.text.trim().length > 0) {
            newAnnotation.text = scope.currentAnnotation.text;
            newAnnotation.creatorName = currentUser.name;
            newAnnotation.creatorId = currentUser.id;
            newAnnotation.dateCreated = Date.now();

            _.extend(shapeLastClicked, newAnnotation);
            _.extend(scope.currentAnnotation, newAnnotation);

            var newRelativeSegmentPoints = [];
            _.each(shapeLastClicked.segments, function(elem) {
              newRelativeSegmentPoints.push({
                x: elem.point.x / canvasWidth,
                y: elem.point.y / canvasHeight
              })
            });

            newAnnotation.relativeSegmentPoints = newRelativeSegmentPoints;

            scope.imageScope.annotations.push(newAnnotation);
            scope.updateImage(function (annotation) {
              scope.addWorkAnnotatedToUser(currentUser.id, annotation._id);
            });
            newAnnotation = {};
            isAddingNewAnnotation = false;
            isEditingAnnotation = false;
            scope.annotationHeader = "annotation";
            scope.switchEditMode();
          } else {
            alert("You can't submit an empty annotation.");
          }
          
        }


        scope.cancelEditAnnotationText = function () {
          isEditingAnnotation = false;
          angular.element("#annotation-description > textarea").prop("disabled", true);
          if (annotationTextBeforeEdit.trim().length > 0) {
            scope.currentAnnotation.text = annotationTextBeforeEdit;
          }
          annotationTextBeforeEdit = "";
        }

        var resetEditAnnotationText = function() {
          annotationTextBeforeEdit = "";
          scope.cancelEditAnnotationText();
        }

        scope.updateEditAnnotationText = function () {
          if (scope.currentAnnotation.text.trim().length > 0) {
            isEditingAnnotation = false;
            shapeLastClicked.text = scope.currentAnnotation.text;
            angular.element("#annotation-description > textarea").prop("disabled", true);
            annotationTextBeforeEdit = "";

            _.map(scope.imageScope.annotations, function(annotation){
              if(annotation._id === shapeLastClicked.key) {
                annotation.text = shapeLastClicked.text;
              }
            });
            scope.updateImage();

          } else {
            alert("You can't submit an empty annotation.");
          }
          
        }

        scope.checkIsToolSelected = function() {
          return !!toolSelected;
        }

        scope.shouldShowSubmitAnnotation = function() {
          return isAddingNewAnnotation;
        }

        scope.shouldShowEditAnnotation = function() {
          return !isEditingAnnotation && !isAddingNewAnnotation;
        }

        scope.shouldShowUpdateAnnotation = function() {
          return isEditingAnnotation;
        }

        function destroyAnnotation(shape) {
          if (shape.frame) shape.frame.remove();
          if (!isAddingNewAnnotation) {
            scope.imageScope.annotations = _.without(scope.imageScope.annotations,
                                                     _.findWhere(scope.imageScope.annotations, {key: shape.key}));
            scope.deleteAnnotation(shape.key);
          }
          shape.removeSegments();
          shape.remove();
          shape = undefined;
          scope.showAnnotation = false;
          isAddingNewAnnotation = false;
          shouldShowDeleteButton = false;
          shapeLastClicked = undefined;
          scope.annotationHeader = "annotation";
          paper.view.draw();
        }


        scope.tryDestroySelectedAnnotation = function() {
          if (!scope.isLoggedIn()) {
            alert("You have to log in to comment!");
            return;
          }
          
          var confirmMessage;

          if (newShape === shapeLastClicked) {
            confirmMessage = "Are you sure you do no want to submit your new annotation?";
          } else {
            confirmMessage = "Are you sure you want to delete this annotation?";
          }

          if (confirm(confirmMessage)) {
            destroyAnnotation(shapeLastClicked);
            return true;
          } else {
            return false;
          }

        }

        scope.shouldShowTextAnnotationTools = function() {
          return shouldShowTextAnnotationTools;
        }

        scope.shouldShowAnnotationComments = function() {
          return shouldShowTextAnnotationTools && !isAddingNewAnnotation;
        }

        scope.shouldShowCommentTextArea = function() {
          return shouldShowCommentTextArea;
        }

        scope.showCommentTextArea = function() {
          if (!scope.isLoggedIn()) {
            alert("You have to log in to comment!");
          } else {
            shouldShowCommentTextArea = true;
            $timeout(function() {
              $(".add-comment-textarea").focus();
            })
          }
        }

        function resetAddingComment() {
          scope.newComment = "";
          shouldShowCommentTextArea = false;
        }

        scope.cancelNewComment = function() {
          resetAddingComment();
        }

        scope.submitNewComment = function() {
          if (typeof scope.newComment === "string" && scope.newComment.trim().length > 0) {
            _.map(scope.imageScope.annotations, function(annotation){
              if(annotation._id === shapeLastClicked.key) {
                annotation.comments.push({
                  text: scope.newComment,
                  userName: currentUser.name,
                  userId: currentUser.id,
                  dateCreated: Date.now()
                });
              }
            });
            scope.updateImage();
            resetAddingComment();
          } else {
            alert("You can't submit an empty comment.");
          }
        }

        scope.shouldShowAddAComment = function() {
          return !shouldShowCommentTextArea && !isAddingNewAnnotation;
        }

        scope.shouldShowMoreInfo = function() {
          return !shouldShowMoreDescription && shouldShowEditImageDescription;
        }

        scope.shouldShowLessInfo = function() {
          return shouldShowMoreDescription && shouldShowEditImageDescription;
        }

        scope.shouldShowEditImageDescription = function() {
          return shouldShowEditImageDescription;
        }

        scope.showMoreInfo = function() {
          shouldShowMoreDescription = true;
        }

        scope.showLessInfo = function() {
          shouldShowMoreDescription = false;
        }

        scope.editImageDescription = function () {
          if (!scope.isLoggedIn()) {
            alert("You have to log in to comment!");
          } else {
            imageDescriptionBeforeEdit = _.clone(scope.imageDescription);
            shouldShowEditImageDescription = false;
          }
        }

        scope.updateImageDescription = function () {
          scope.imageDescription.artists = scope.imageDescription.artists.split(",");
          scope.imageDescription.artists.forEach(function (elem, index) {
            scope.imageDescription.artists[index] = elem.trim();
          })
          _.extendOwn(scope.imageScope, scope.imageDescription);
          scope.imageDescription.artists = scope.imageDescription.artists.join(", ");
          scope.updateImage();
          shouldShowEditImageDescription = true;
        }

        scope.cancelImageDescription = function () {
          _.extendOwn(scope.imageDescription, imageDescriptionBeforeEdit);
          shouldShowEditImageDescription = true;
        }

        scope.shouldShowDescriptionLabels = function() {
          return !shouldShowEditImageDescription;
        }

        scope.shouldShowMoreDescription = function() {
          return shouldShowMoreDescription;
        }

        //setup canvas
        scope.getImage(init);
        
      }
    };
  }])
.directive('elastic', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            require    : 'ngModel',
            link: function(scope, element) {
              var ngModelCtrl = element.controller('ngModel');

              var resize = function(event) {
                if (element.prop("tagName") === 'TEXTAREA') {
                  var actualScrollHeight = (element.height(1))[0].scrollHeight;
                  if (actualScrollHeight < 25) {
                    actualScrollHeight = 25;
                  }
                  element.height(actualScrollHeight);
                } else {
                  console.warn("directive elastic is only for textarea element");
                }
              }

              scope.$watch(function () {
                return ngModelCtrl.$modelValue + element.attr('class');
              }, function() {
                $timeout(resize, 0); // wait until the dom responds to the model change
              },
              false // deepwatch is not required
              );

            }
        };
    }
]);