'use strict';
/**
 * @ngdoc function
 * @name anotare.directive:horizontal-infinity-scroll
 */

angular.module('anotareApp')
.directive('horizontalInfinityScroll', function () {
    return {
        restrict : 'EA',
        //TODO : use local scope variables instead of polluting the global scope
        link: function(scope, element, attribute) {
            
            var lastImageIndex = 0;
            var allImagesLoaded = false;
            var firstLoad = true;
            var raw = element[0];
            var isScrolling = false;
            var intervalID;

            scope.loadMore = function() {
                for (var i = 0; i < 5 && lastImageIndex < scope.imageScope.length; i++) {
                    scope.items.push(scope.imageScope[lastImageIndex]);
                    lastImageIndex++;
                }
            };

            //move to next photo, or first photo if it's the last photo
            scope.scrollRight = function () {
                isScrolling = true;
                intervalID =  window.setInterval( function(){
                    if (isScrolling){
                        $(raw).animate( { scrollLeft: '+=20' }, 100);
                    }
                },100);
            };

            scope.scrollEnd = function () {
                window.clearInterval(intervalID);
                isScrolling = false;
            }
            //move to previous photo, or last photo if it's the first photo
            scope.scrollLeft = function () {
                isScrolling = true;
                intervalID = window.setInterval( function(){
                    if (isScrolling){
                        $(raw).animate( { scrollLeft: '-=20' }, 100);
                    }
                },100);
            };

            scope.getImage();
            scope.$watch('imageScope', function(newVal, oldVal) {
                if (typeof newVal !== 'undefined' && newVal.length > 0 && firstLoad)
                {   
                    firstLoad = false;
                    scope.loadMore();
                }
            });


            element.bind('scroll', function() {
                if (raw.scrollLeft + raw.offsetWidth >= raw.scrollWidth) {
                    scope.$apply(attribute.horizontalInfinityScroll);
                }
            });

        }
    };
});