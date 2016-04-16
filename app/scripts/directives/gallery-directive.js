'use strict';
/**
 * @ngdoc function
 * @name anotare.directive:photo-slider
 */

angular.module('anotareApp')
.directive('photoSlider', function ($interval) {
    return {
        restrict : 'EA',
        //TODO : use local scope variables instead of polluting the global scope
        link: function(scope) {
            scope.currentIndex = 0;

            scope.loadToItem = function() {
                for (var i = 1; i < 5; i++) {
                    scope.items.push(scope.imageScope[i]);
                    scope.items[i-1].visible = false;
                }
                scope.items[scope.currentIndex].visible = true;
            };

            //move to next photo, or first photo if it's the last photo
            scope.next = function () {
                scope.items[scope.currentIndex].visible = false;
                scope.currentIndex = scope.currentIndex < scope.items.length - 1 ? scope.currentIndex + 1 : 0;
                scope.items[scope.currentIndex].visible = true;
            };
            //move to previous photo, or last photo if it's the first photo
            scope.prev = function () {
                scope.items[scope.currentIndex].visible = false;
                scope.currentIndex = scope.currentIndex > 0 ? scope.currentIndex - 1  : scope.items.length - 1;
                scope.items[scope.currentIndex].visible = true;
            };

            //used in the welcome page to link between the dots and the images
            scope.setCurrentIndex = function (index) {
                scope.currentIndex = index;
            };
            //used in the welcome page to link between the dots and the images
            scope.isCurrentIndex = function (index) {
                return scope.currentIndex === index;
            };

            //set other images visibilty to false (so that it the ng-show property is false), only set the image of the 
            // current index true
            scope.updateSlide = function () {
                if (typeof scope.items !== 'undefined' && scope.items.length > 0 )
                {
                    angular.forEach(scope.items, function(image) {
                    image.visible = false; // make every image invisible
                    });
                    scope.items[scope.currentIndex].visible = true; // make the current image visible
                }
            };

            //update the slide if there is any changes to the currentIndex
            scope.$watch('currentIndex', function() {
                scope.updateSlide();
            });


            scope.$watch('imageScope', function(newVal, oldVal) {
                if (typeof newVal !== 'undefined' && newVal.length > 0)
                {   
                    scope.loadToItem();
                }
            });

            scope.getImage();
            //animation to change the pictures
            $interval(scope.next, 5000);

        }
    };
});