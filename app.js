angular.module('Kayab', ['ngRoute', 'ngMessages', 'satellizer'])
  .config(function($routeProvider, $authProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/photo/:id', {
        templateUrl: 'views/detail.html',
        controller: 'DetailCtrl'
      })
      .otherwise('/');

$authProvider.httpInterceptor = true, // Add Authorization header to HTTP request
$authProvider.loginOnSignup = true;
$authProvider.loginRedirect = '/';
$authProvider.logoutRedirect = '/';
$authProvider.signupRedirect = '/login';
$authProvider.loginUrl = 'http://192.168.1.5:3000/auth/login';
$authProvider.signupUrl = 'http://192.168.1.5:3000/auth/signup';
$authProvider.loginRoute = '/login';
$authProvider.signupRoute = '/signup';
$authProvider.tokenName = 'token';
//$authProvider.tokenPrefix = 'satellizer'; // Local Storage name prefix
$authProvider.unlinkUrl = 'http://192.168.1.5:3000/auth/unlink/';
$authProvider.authHeader = 'Authorization';
  })
  .run(function($rootScope, $window, $auth) {
    if ($auth.isAuthenticated() && $window.localStorage.currentUser) {
      $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
    }
  });
