/*globals Sai */

sc_require('core');
sc_require('system/canvas');

Sai.Drawable = {
  
  canvas: null,
  
  initMixin: function(){

  },
  
  didCreateLayer: function() {
    if (this.willCreateCanvas) this.willCreateCanvas();
    this.canvas = Sai.createCanvas();
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
  
  renderCanvas: function(canvas, firstTime) {
    
  },
  
  willDestroyCanvas: function(canvas) {
    
  },
  
  getCanvasElementById: function(id) {
    // TODO
  },
  
  getCanvasElementbyTarget: function(target) {
    // TODO
  }
  
};