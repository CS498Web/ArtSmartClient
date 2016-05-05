'use strict';

/**
 * @ngdoc overview
 * @name anotareApp
 * @description
 * # anotareApp
 *
 * Main module of the application.
 */
angular
  .module('anotareApp', [
    'ngAnimate',
    'ngCookies',
    'LocalStorageModule',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'puElasticInput'
  ])

  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/main/landing');
  //
  // Now set up the states
  $stateProvider

    .state('root', {
      url: '/main',
      templateUrl: 'views/root.html',
      controller: 'RootCtrl'
    })
    .state('root.landing', {
      url: '/landing',
      parent: 'root',
      controller: 'LandingCtrl',
      templateUrl: 'views/landing.html'
    })
    .state('root.explore', {
      url: '/explore',
      parent: 'root',
      templateUrl: 'views/explore.html',
      controller: 'ExploreCtrl'
    })
    .state('root.profile', {
      url: '/profile',
      parent: 'root',
      templateUrl: 'views/profile.html',
      controller: 'ProfileCtrl'
    })
    .state('root.artwork', {
      url: '/artworks/{artwork_id}',
      parent: 'root',
      templateUrl: 'views/annotation.html',
      controller: 'ArtworkCtrl'
    });

}]);


