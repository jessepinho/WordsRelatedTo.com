var wrtControllers = angular.module('wrtControllers', []);

wrtControllers.controller('WordSearchController', ['$scope', 'Word',
  function($scope, Word) {
    $scope.allWords = Word.query();
    $scope.word = 'Hello world!';
  }]);

wrtControllers.controller('WordController', ['$scope', 'Word', '$routeParams',
  function($scope, Word, $routeParams) {
    $scope.word = Word.get({wordId: $routeParams.wordId});
  }]);
