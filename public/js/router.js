
(function() {
  angular.module('tour', ['ui.router', 'ngMap'])
    .config(MainRouter);

    MainRouter.$inject = ['$stateProvider', '$urlRouterProvider']

    function MainRouter($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '../partials/_home.html'
        })
        .state('user', {
          url: '/user',
          templateUrl: '../partials/_user.html'
        })
        $urlRouterProvider.otherwise('/');
      }
})();
