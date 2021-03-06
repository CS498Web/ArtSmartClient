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
      link: function($scope, element, attributes) {
        $scope.validateUrl = function() {
          var formHeader = {
            headers:{ 
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
          if ($scope.urlValue !== "") {
            $http({
              method: 'GET',
              url: $scope.urlValue,
              responseType : 'blob',
              headers: formHeader,
              withCredentials: true
            }).then(function successCallback(response) {
              var type = response.headers('Content-type');
              if (type.match('image/.+')) {
                $scope.valid = true;
                var reader = new window.FileReader();
                reader.readAsDataURL(response.data); 
                reader.onloadend = function() {
                  $scope.fileToUpload = reader.result;
                }
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
