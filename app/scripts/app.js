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
      url: '/landing',
      templateUrl: 'views/landing.html'
    })

    .state('root.annotation', {
      url: '/annotation',
      controller: 'AnnotationCtrl'
    })

      .state('root.annotation.explore', {
        url: '/explore',
        templateUrl: 'views/explore.html',
      })
      .state('root.annotation.artwork', {
        url: '/artworks/{artwork_id}',
        templateUrl: 'views/annotation.html'
      });

}]);


