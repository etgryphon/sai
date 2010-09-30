// ..........................................................
// Basic Multi SVG view...
// 
/*globals Sai */

Sai.CanvasView = SC.View.extend({
  
  canvas: null,
  childElements: null,
  
  _events: ['mouseDown', 'mouseUp'],
  
  init: function(){
    sc_super();
    this._events.forEach( function(eName){
      this[eName] = function(evt){
        var e, c = this.canvas, 
            tId = evt.target.id;
        e = c.getElementById(tId);
        if (e && e[eName]) return e[eName](evt); 
        return NO;
      };
    }, this);
  },
  
  didCreateLayer: function() {
    if (this.willCreateCanvas) this.willCreateCanvas();
    this.canvas = Sai.Canvas.create();
    this.renderCanvas(this.canvas, YES);
    this.renderChildElements(this.canvas, YES);
    this.canvas.render(this, YES);
    if (this.didCreateCanvas) this.didCreateCanvas();
  },
  
  didUpdateLayer: function() {
    if (this.willUpdateCanvas) this.willUpdateCanvas();
    this.renderCanvas(this.canvas, NO);
    this.renderChildElements(this.canvas, NO);
    this.canvas.render(this, NO);
    if (this.didUpdateCanvas) this.didUpdateCanvas();
  },
  
  willDestroyLayer: function() {
    this.willDestroyCanvas(this.canvas);
    this.canvas.destroy();
  },
  
  willDestroyCanvas: function(canvas) {},
  
  // TODO: [EG] getCanvasElementById
  getCanvasElementById: function(id) {},
  
  // TODO: [EG] getCanvasElementbyTarget
  getCanvasElementbyTarget: function(target) {},
  
  // ..........................................................
  // Override this function to do some custom stuff if you want
  // 
  renderCanvas: function(canvas, firstTime) {},
  
  // ..........................................................
  // generally do not overide this...
  // 
  renderChildElements: function(canvas, firstTime){
    var children = this.get('childElements') || [],
        elem, key, i, len;
    if (firstTime) {
      for (i = 0, len = children.length; i < len; i++) {
        if (key = (elem = children[i])) {

          // is this is a key name, lookup view class
          if (typeof key === SC.T_STRING) {
            elem = this[key];
          } else key = null ;

          if (!elem) {
            console.error ("No element with name "+key+" has been found in "+this.toString());
            // skip this one.
            continue;
          }

          if (elem.isClass) {
            elem = elem.create(); // instantiate if needed
            if (key) this[key] = elem ; // save on key name if passed
          } 
        }
        children[i] = elem;
        canvas.element(elem);
      }
    }
  }
});

