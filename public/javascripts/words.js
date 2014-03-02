var Renderer = function(canvas){
  var particleSystem;

  var that = {
    init:function(system){
      // the particle system will call the init function once, right before the
      // first frame is to be drawn. it's a good place to set up the canvas and
      // to pass the canvas size to the particle system
      //
      // save a reference to the particle system for use in the .redraw() loop
      particleSystem = system

      // inform the system of the screen dimensions so it can map coords for us.
      // if the canvas is ever resized, screenSize should be called again with
      // the new dimensions
      // Thanks to http://ameijer.nl/2011/08/resizable-html5-canvas/ for the
      // responsive canvas
      function respondCanvas() {
        // Set canvas size
        $(canvas).css({
          width: $(canvas).parent()[0].offsetWidth,
          height: $(canvas).parent()[0].offsetHeight
        });
        particleSystem.screenSize($(canvas).width(), $(canvas).height());
        particleSystem.screenPadding($(canvas).height() * 0.1, $(canvas).width() * 0.1);

        that.redraw();
      }
      respondCanvas();
      $(window).resize(respondCanvas);

      // set up some event handlers to allow for node-dragging
      that.initMouseHandling()
    },

    redraw:function(){
      // redraw will be called repeatedly during the run whenever the node
      // positions change. the new positions for the nodes can be accessed by
      // looking at the .p attribute of a given node. however the p.x & p.y
      // values are in the coordinates of the particle system rather than the
      // screen. you can either map them to the screen yourself, or use the
      // convenience iterators .eachNode (and .eachEdge) which allow you to step
      // through the actual node objects but also pass an x,y point in the
      // screen's coordinate system
      particleSystem.eachEdge(function(edge, pt1, pt2){
        // edge: {source:Node, target:Node, length:#, data:{}}
        // pt1:  {x:#, y:#}  source position in screen coords
        // pt2:  {x:#, y:#}  target position in screen coords
      })

      particleSystem.eachNode(function(node, pt){
        // node: {mass:#, p:{x,y}, name:"", data:{}}
        // pt:   {x:#, y:#}  node position in screen coords
        var w = node.data.element[0].offsetWidth;
        var h = node.data.element[0].offsetHeight;
        node.data.element.css({
          transform: 'translate(' + (pt.x - w/2) + 'px,' + (pt.y - h/2) + 'px' + ')'
        });
      })
    },

    initMouseHandling:function(){
      // no-nonsense drag and drop (thanks springy.js)
      var nodeWrapper = null;

      // set up a handler object that will initially listen for mousedowns then
      // for moves and mouseups while dragging
      var handler = {
        mousedown:function(e){
          var pos = $(canvas).offset();
          _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
          nodeWrapper = particleSystem.nearest(_mouseP);

          nodeWrapper.wasDragged = false
          if (nodeWrapper && nodeWrapper.node !== null){
            // while we're dragging, don't let physics move the node
            nodeWrapper.node.fixed = true
          }

          $(canvas).bind('mousemove', handler.mousemove)
          $(window).bind('mouseup', handler.mouseup)

          return false
        },
        mousemove: function(e){
          var pos = $(canvas).offset();
          var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top);

          if (nodeWrapper && nodeWrapper.node !== null){
            var p = particleSystem.fromScreen(s);
            nodeWrapper.node.p = p;
            nodeWrapper.wasDragged = true
          }

          return false
        },

        mouseup: function(e){
          if (nodeWrapper===null || nodeWrapper.node===undefined) return;
          if (nodeWrapper.node !== null) nodeWrapper.node.fixed = false;
          nodeWrapper.node.tempMass = 1000;
          $(canvas).unbind('mousemove', handler.mousemove);
          $(window).unbind('mouseup', handler.mouseup);
          _mouseP = null;

          return false;
        },

        click: function(e) {
          if (nodeWrapper.wasDragged) {
            e.preventDefault();
          }
          nodeWrapper = null;
        }
      }

      // start listening
      $(canvas).mousedown(handler.mousedown);
      $(canvas).click(handler.click);
    },

  }
  return that
}

function initWordGraph() {
  if ($('.word-graph').length) {
    var sys = arbor.ParticleSystem(1000, 600, 0.5);
    sys.parameters({gravity:true});
    sys.renderer = Renderer(".word-graph");

    var wordId = $('.word-graph h1 .word').data('word-id');
    sys.addNode(wordId, {
      element: $('.word-graph h1 .word')
    });
    $('.word-graph .word:not([data-word-id=' + wordId + '])').each(function(i) {
      var relatedWordId = $(this).data('word-id');
      sys.addNode(relatedWordId, {
        element: $(this)
      });
      sys.addEdge(wordId, relatedWordId);
    });

    window.arborParticleSystem = sys;

    $('.word.add').click(function (e) {
      $('input[type="text"]', this).focus();
    });
  }
}
