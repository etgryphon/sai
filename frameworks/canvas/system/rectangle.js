/*globals Sai */
sc_require('system/shape');

Sai.Rectangle = Sai.Shape.extend({
  
  isRectangle: YES,
  
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  radius: null,
  
  render: function(canvas, firstTime) {
    var rect = null,
        x = this.get('x'),
        y = this.get('y'),
        h = this.get('height'),
        w = this.get('width'),
        cr = this.get('radius') || 0,
        attrs = this.basicAttrs();
        
    if (firstTime) {
      rect = Sai.canvas_create('rect', canvas, x, y, h, w, cr, attrs);
      this._element = rect;
    }
  }
  
  
});