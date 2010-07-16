// ..........................................................
// Basic Multi SVG view...
// 
/*globals Sai */

Sai.CanvasView = SC.View.extend({
  
  canvas: null,
  childElements: null,
  
  didCreateLayer: function() {
    if (this.willCreateCanvas) this.willCreateCanvas();
    this.canvas = Sai.Canvas.create();
    this.renderCanvas(this.canvas, YES);
    this.canvas.render(this, YES);
    if (this.didCreateCanvas) this.didCreateCanvas();
  },
  
  didUpdateLayer: function() {
    if (this.willUpdateCanvas) this.willUpdateCanvas();
    this.renderCanvas(this.canvas, NO);
    this.canvas.render(this, NO);
    if (this.didUpdateCanvas) this.didUpdateCanvas();
  },
  
  willDestroyLayer: function() {
    this.willDestroyCanvas(this.canvas);
    this.canvas.destroy();
  },
  
  willDestroyCanvas: function(canvas) {
    
  },
  
  getCanvasElementById: function(id) {
    // TODO
  },
  
  getCanvasElementbyTarget: function(target) {
    // TODO
  },
  
  // ..........................................................
  // Override this function to do some custom stuff if you want
  // 
  renderCanvas: function(canvas, firstTime) {
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