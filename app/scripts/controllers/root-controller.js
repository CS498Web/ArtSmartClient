'use strict';

/**
 * @ngdoc function
 * @name anotareApp.controller:RootCtrl
 * @description
 * # RootCtrl
 * Controller of the anotareApp
 */
 angular.module('anotareApp')
 .controller('RootCtrl', ['$scope', '$http', 'UserService', 'AuthService', 'ArtworkService', '$location', '$state',
             function ($scope, $http, UserService, AuthService, ArtworkService, $location, $state) {

 	$scope.login = function(user, success, error) {
 		AuthService.login(user, success, error);
 	}

 	$scope.signup = function(user, success, error) {
        AuthService.signup(user, success, error);
 	}

    $scope.logout = function(success, error) {
        AuthService.logout(success, error);
    }

    $scope.isLoggedIn = function() {
        return AuthService.isLoggedIn();
    }

    $scope.getCurrentUser = function() {
        return AuthService.getCurrentUser();
    }

    $scope.updateCurrentUser = function() {
        $scope.currentUser = $scope.getCurrentUser();
        $scope.username = $scope.currentUser.name;
    }
    
    $scope.modalTitle = "";
    $scope.loggingIn = false;
    $scope.signingUp = false;
    $scope.uploading = false;
    $scope.imageLoaded = false;
    $scope.valid = false;
    $scope.loginName = "";
    $scope.passwordName ="";

    $scope.fileToUpload = "";

    $scope.artworkToUpload= {
        title : "",
        artists: "",
        description: "",
        originLocation: "",
        medium: "",
        year: ""
    }
    

    $scope.toggleLogin = function(){
        $scope.modalTitle = "Log In";
        $scope.loggingIn = !$scope.loggingIn;
        $("#myModal").modal('show');
    }
    $scope.upload = function(){
        $scope.modalTitle = "Upload new artwork";
        $scope.uploading = !$scope.uploading;
        $("#myModal").modal('show');
    }

    $scope.closeModal = function() {
        $scope.uploading = false;
        $scope.loggingIn = false;
        $("#myModal").modal('hide');
    }

    $scope.addWorkUploadedToUser = function(user_id, artwork_id) {
      UserService.getSingleUser(user_id)
      .then( function(response) {
        console.log(response);
        var user = response.data.data;
        if ( _.isArray(user.worksUploaded) ){
          user.worksUploaded.push(artwork_id);
        } else {
          user.worksUploaded = [artwork_id];
        }
        UserService.put(user_id, user)
        .then(function(response) {
        })
      })
    }

    $scope.getAllArtwork = function( success ) {
        ArtworkService.getAll()
        .then(
        //success function
        success,
        //error function
        function(result) {
          console.log("Failed to get the images, result is :");
          console.log(result); 
        });
    }

    $scope.uploadArtwork = function() {
        if (typeof $scope.artworkToUpload.artists === 'string' && 
            $scope.artworkToUpload.artists.trim().length > 0) {
            $scope.artworkToUpload.artists = $scope.artworkToUpload.artists.split(",");
            $scope.artworkToUpload.artists.forEach(function (elem, index) {
                $scope.artworkToUpload.artists[index] = elem.trim();
            })
        }
        $scope.artworkToUpload.imageFile = $scope.fileToUpload;
        ArtworkService.postOne($scope.artworkToUpload, function(artwork) {
            $scope.closeModal();
            $scope.artworkToUpload= {
                title : "",
                artists: "",
                description: "",
                originLocation: "",
                medium: "",
                year: ""
            }
            $scope.addWorkUploadedToUser($scope.currentUser.id, artwork._id);
            $state.go('root.artwork', {artwork_id: artwork._id});
        });
    }

    $scope.navbarLogin = function() {
        $scope.login({
            email: $scope.loginName,
            password: $scope.loginPassword
        }, function() {
            $scope.updateCurrentUser();
            $scope.closeModal();
            $scope.loginName = "";
            $scope.loginPassword = "";
            if ($state.current.name === 'root.landing') {
                $state.go('root.explore', {reload: true});
            }
        }, function() {
            alert("Wrong credentials");
        })
    }

    $scope.navbarLogout = function() {
        $scope.logout(function() {
            $scope.updateCurrentUser();
            $state.go('root.landing', {}, {reload: true});
        }, function(error) {
            console.log(error);
        })
    }

    $scope.goToMyProfile = function() {
        $state.go('root.profile', {user_id: $scope.currentUser.id}, {reload: true});
    }

    $scope.updateCurrentUser();

 }]);



