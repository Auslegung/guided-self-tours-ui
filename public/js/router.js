(function() {
  angular.module('tour', ['ui-router'])
  .config(MainRouter);

  MainRouter.$inject = ['$stateProvider', '$urlRouterProvider']

  function MainRouter($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '../partials/_home.html'
    })
  }
})();

// (function() {
//   angular.module('tour', ['ui-router'])
//     .config(MainRouter);
//
//     MainRouter.$inject = ['$stateProvider', '$urlRouterProvider']
//
//     function MainRouter($stateProvider, $urlRouterProvider) {
//       $stateProvider
//         .state('home', {
//           url: '/',
//           templateUrl: '../partials/_home.html'
//         })
//         .state('signup', {
//           url: '/signup',
//           templateUrl: '../partials/_signup.html'
//         })
//         .state('login', {
//           url: '/login',
//           templateUrl: '../partials/_login.html'
//         })
//         .state('user', {
//           url: '/user',
//           templateUrl: '../partials/_user.html'
//         })
//         $urlRouterProvider.otherwise('/');
//       }
// })();
