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
      parent: 'root',
      url: '/landing',
      controller: 'RootCtrl',
      templateUrl: 'views/landing.html'
    })
    .state('root.explore', {
      url: '/explore',
      templateUrl: 'views/explore.html',
      controller: 'ArtworkCtrl'
    })
    .state('root.artwork', {
      url: '/artworks/{artwork_id}',
      templateUrl: 'views/annotation.html',
      controller: 'ArtworkCtrl'
    });

}]);


