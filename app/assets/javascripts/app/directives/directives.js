var wrtDirectives = angular.module('wrtDirectives', []);

wrtDirectives.directive('wrtWordGraph',
  function() {
    return {
      templateUrl: 'word-graph.html',
      link: function(scope, element, attrs) {
        // Initialize the graph
        var sys = arbor.ParticleSystem(1000, 600, 0.5);
        sys.parameters({gravity:true});
        sys.renderer = Renderer(".word-graph");

        // React to the word changing
        scope.$watch('word.id', function(new_word, old_word) {
          if (new_word !== old_word) {
            var graph = {
              nodes: {},
              edges: {}
            };

            graph.nodes[scope.word.id] = {};
            for (i in scope.word.related_words) {
              var relatedWordId = scope.word.related_words[i].id;
              graph.nodes[relatedWordId] = {};
              graph.edges[relatedWordId] = {};
              graph.edges[relatedWordId][scope.word.id] = {};
            }

            sys.merge(graph);
          }
        });
      }
    };
  });
