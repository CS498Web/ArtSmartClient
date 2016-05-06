'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:AnnotationCtrl
 * @description
 * # AboutCtrl
 * Controller of the anotareApp
 */
 angular.module('anotareApp')
 .controller('ProfileCtrl', [ '$scope', '$http', 'ArtworkService', 'UserService', '$stateParams',
             function ($scope, $http, ArtworkService, UserService, $stateParams) {
    // $scope.getAllArtwork = function() {
    //     ArtworkService.getAll() 
    //     .then(
    //     //success function
    //     function (response) {
    //         $scope.items = response.data;
    //       },
    //     //error function
    //     function(result) {
    //       console.log("Failed to get the images, result is :");
    //       console.log(result); 
    //     });
    // }

    $scope.user;



    function init() {
        $scope.annotatedArtworkIds = $scope.user.worksAnnotated;
        $scope.annotatedArtworks = [];
        $scope.uploadedArtworkIds = $scope.user.worksUploaded;
        $scope.uploadedArtworks = [];

        for (var i = 0; i < $scope.annotatedArtworkIds.length; i++) {
            ArtworkService.getOne($scope.annotatedArtworkIds[i],
            function(data){
                console.log(data);
                $scope.annotatedArtworks.push(data);
                console.log($scope.annotatedArtworks);
            },
            function(err) {
                console.log(err);
            });
        };

        for (var i = 0; i < $scope.uploadedArtworkIds.length; i++) {
            ArtworkService.getOne($scope.uploadedArtworkIds[i],
            function(data){
                $scope.uploadedArtworks.push(data);
            },
            function(err) {
                console.log(err);
            });
        };
    }



    UserService.getSingleUser($stateParams.user_id, function(data){
      $scope.user = data;
      console.log($scope.user);
      init();
    }, function(err) {
      console.log(err);
    });


    /*$scope.getAnnotatedArtwork = function() {
      var user = $scope.getCurrentUser;
      var worksAnnotated = user.worksAnnotated;
      $scope.user = $scope.getCurrentUser;
      $scope.worksAnnotateds = worksAnnotated;
    }
    $scope.getUploadedArtwork = function() {
      var user = $scope.getCurrentUser;
      var worksUploaded = user.worksUploaded;
      $scope.worksUploadeds = worksUploaded
    }*/
  }]);