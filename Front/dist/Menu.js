angular.module('menuApp', [
    'commons',
    'cuistot',
    'serveur',
    'ui.bootstrap',
    'ngRoute'
]).config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/cuistot', {
        templateUrl: 'partials/cuistot.html',
        controller: 'CuistotController'
      }).
      when('/serveur', {
        templateUrl: 'partials/serveur.html',
        controller: 'ServeurController'
      }).
      otherwise({
        redirectTo: '/index.html'
      });
  }]);;angular.module('commons', []);;angular.module('cuistot', []);;angular.module('serveur',[]);