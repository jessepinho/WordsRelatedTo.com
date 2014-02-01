var Renderer = function(canvas){
  var canvas = $(canvas).get(0)
  var ctx = canvas.getContext("2d");
  var particleSystem

  var that = {
    init:function(system){
      //
      // the particle system will call the init function once, right before the
      // first frame is to be drawn. it's a good place to set up the canvas and
      // to pass the canvas size to the particle system
      //
      // save a reference to the particle system for use in the .redraw() loop
      particleSystem = system

      // inform the system of the screen dimensions so it can map coords for us.
      // if the canvas is ever resized, screenSize should be called again with
      // the new dimensions
      particleSystem.screenSize(canvas.width, canvas.height)
      //particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side

      // set up some event handlers to allow for node-dragging
      that.initMouseHandling()
    },

    redraw:function(){
      //
      // redraw will be called repeatedly during the run whenever the node positions
      // change. the new positions for the nodes can be accessed by looking at the
      // .p attribute of a given node. however the p.x & p.y values are in the coordinates
      // of the particle system rather than the screen. you can either map them to
      // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
      // which allow you to step through the actual node objects but also pass an
      // x,y point in the screen's coordinate system
      //
      ctx.clearRect(0,0, canvas.width, canvas.height)

      particleSystem.eachEdge(function(edge, pt1, pt2){
        // edge: {source:Node, target:Node, length:#, data:{}}
        // pt1:  {x:#, y:#}  source position in screen coords
        // pt2:  {x:#, y:#}  target position in screen coords

        // draw a line from pt1 to pt2
        ctx.strokeStyle = "rgba(0,0,0, .333)"
        ctx.fillStyle = "white"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(pt1.x, pt1.y)
        ctx.lineTo(pt2.x, pt2.y)
        ctx.stroke()
        ctx.closePath()
      })

      particleSystem.eachNode(function(node, pt){
        // node: {mass:#, p:{x,y}, name:"", data:{}}
        // pt:   {x:#, y:#}  node position in screen coords

        ctx.font = '30px/45px Cardo, serif';
        ctx.textAlign = 'center';
        var w = ctx.measureText(node.data.text).width;
        ctx.fillStyle = 'white';
        //ctx.arc(pt.x, pt.y, 10, 0, Math.PI*2);
        //ctx.fill();
        ctx.closePath();
        ctx.fillStyle = 'black';
        ctx.fillText(node.data.text, pt.x, pt.y);
      })
    },

    initMouseHandling:function(){
      // no-nonsense drag and drop (thanks springy.js)
      var dragged = null;

      // set up a handler object that will initially listen for mousedowns then
      // for moves and mouseups while dragging
      var handler = {
        clicked:function(e){
          var pos = $(canvas).offset();
          _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
          dragged = particleSystem.nearest(_mouseP);

          if (dragged && dragged.node !== null){
            // while we're dragging, don't let physics move the node
            dragged.node.fixed = true
          }

          $(canvas).bind('mousemove', handler.dragged)
          $(window).bind('mouseup', handler.dropped)

          return false
        },
        dragged:function(e){
          var pos = $(canvas).offset();
          var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

          if (dragged && dragged.node !== null){
            var p = particleSystem.fromScreen(s)
            dragged.node.p = p
          }

          return false
        },

        dropped:function(e){
          if (dragged===null || dragged.node===undefined) return
          if (dragged.node !== null) dragged.node.fixed = false
          dragged.node.tempMass = 1000
          dragged = null
          $(canvas).unbind('mousemove', handler.dragged)
          $(window).unbind('mouseup', handler.dropped)
          _mouseP = null
          return false
        }
      }

      // start listening
      $(canvas).mousedown(handler.clicked);

    },

  }
  return that
}

$(document).ready(function(){
  var sys = arbor.ParticleSystem(1000, 600, 0.5);
  sys.parameters({gravity:true});
  sys.renderer = Renderer(".word-graph");

  var wordId = $('.word-graph h1 .word').attr('id');
  sys.addNode(wordId, {
    text: $('.word-graph h1 .word').text(),
    level: 1
  });
  $('.word-graph li').each(function(i) {
    var relatedWordId = $(this).attr('id');
    sys.addNode(relatedWordId, {
      text: $(this).text(),
      level: 2
    });
    sys.addEdge(wordId, relatedWordId);
  });
})
