'use strict';
/**
 * @ngdoc function
 * @name anotare.directive:imgurl
 */

angular.module('anotareApp')
  .config(['$compileProvider', function($compileProvider) {
    var oldWhiteList = $compileProvider.imgSrcSanitizationWhitelist();
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
  }])
  .directive("imgurl", ['$http', function($http) {
    return {
      restrict: 'A',
      require: '^navigation-bar',
      link: function($scope, element, attributes) {
        $scope.validateUrl = function() {
          if ($scope.urlValue != "") {
            $http({
              method: 'GET',
              url: $scope.urlValue,
              responseType : 'blob'
            }).then(function successCallback(response) {
              var type = response.headers('Content-type');
              if (type.match('image/.+')) {
                $scope.valid = true;
                var url = URL.createObjectURL(response.data);
                $scope.fileToUpload = url
              } else {
                $scope.fileToUpload = ""
              }
            }, function errorCallback(response) {

              console.log('failed');
            });
          } else {
            $scope.fileToUpload = ""
          }

        }
      }
    }
  }]);
