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
            scope.items = [];

            var updateCurrentIndex = function (newIndex) {
                if (newIndex !== scope.currentIndex) {
                    scope.headerItems[scope.currentIndex].visible = false;
                    scope.headerItems[newIndex].visible = true;
                    scope.currentIndex = newIndex
                }
            }

            scope.loadToItem = function() {
                scope.imageScope.forEach(function (image, index) {
                    scope.items.push(image);
                    scope.items[index].visible = false;
                });
                scope.items[scope.currentIndex].visible = true;
            };

            //move to next photo, or first photo if it's the last photo
            scope.next = function () {
                var newIndex = scope.currentIndex < scope.headerItems.length - 1 ? scope.currentIndex + 1 : 0;
                updateCurrentIndex(newIndex);
            };
            //move to previous photo, or last photo if it's the first photo
            scope.prev = function () {
                var newIndex = scope.currentIndex > 0 ? scope.currentIndex - 1  : scope.headerItems.length - 1;
                updateCurrentIndex(newIndex);
            };

            //used in the welcome page to link between the dots and the images
            scope.setCurrentIndex = function (index) {
                updateCurrentIndex(index);
            };
            //used in the welcome page to link between the dots and the images
            scope.isCurrentIndex = function (index) {
                return scope.currentIndex === index;
            };

            // //set other images visibilty to false (so that it the ng-show property is false), only set the image of the 
            // // current index true
            // scope.updateSlide = function () {
            //     if (typeof scope.items !== 'undefined' && scope.items.length > 0 )
            //     {
            //         angular.forEach(scope.items, function(image) {
            //         image.visible = false; // make every image invisible
            //         });
            //         scope.items[scope.currentIndex].visible = true; // make the current image visible
            //     }
            // };

            // //update the slide if there is any changes to the currentIndex
            // scope.$watch('currentIndex', function() {
            //     scope.updateSlide();
            // });


            // scope.$watch('imageScope', function(newVal, oldVal) {
            //     if (typeof newVal !== 'undefined' && newVal.length > 0)
            //     {   
            //         scope.loadToItem();
            //     }
            // });

            scope.getAllArtwork( function(response) {
                scope.imageScope = response.data.data;
                scope.loadToItem();
                $interval(scope.next, 5000);
            });
            //animation to change the pictures

        }
    };
});
