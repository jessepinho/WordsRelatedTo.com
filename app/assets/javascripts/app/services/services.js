var wrtServices = angular.module('wrtServices', ['ngResource']);

wrtServices.factory('Word', ['$resource',
  function($resource) {
    return $resource('words/:wordId.json', {}, {
      query: { method: 'GET', params: { wordId: '' }, isArray: true }
    });
  }]);
