var wrtControllers = angular.module('wrtControllers', []);

wrtControllers.controller('WordSearchController', ['$scope', 'Word',
  function($scope, Word) {
    $scope.allWords = Word.query();
    $scope.word = 'Hello world!';
  }]);
