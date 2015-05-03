angular.module('menuApp', [
    'commons',
    'cuistot',
    'serveur',
    'ui.bootstrap',
    'ngRoute'
]).config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/accueil', {
        templateUrl: 'views/accueil.html',
        controller: 'AccueilController'
    }).
      when('/cuistot', {
        templateUrl: 'views/cuistot.html',
        controller: 'CuistotController'
      }).
      when('/serveur', {
        templateUrl: 'views/serveur.html',
        controller: 'ServeurController'
      }).
      otherwise({
        redirectTo: '/accueil'
      });
  }]);