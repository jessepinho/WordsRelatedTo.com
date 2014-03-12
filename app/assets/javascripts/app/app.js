wrt = angular.module('WordsRelatedTo', [
  'ngRoute',
  'wrtControllers',
  'wrtServices',
  'wrtDirectives'
]);

wrt.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'search.html',
        controller: 'WordSearchController'
      })
      .when('/:wordId', {
        templateUrl: 'word.html',
        controller: 'WordController'
      });
  }]);
