/*globals Sai */
sc_require('system/shape');

Sai.Circle = Sai.Shape.extend({
  isCircle: YES,
  // Attributes
  x: 0,
  y: 0,
  radius: 0,
  
  render: function(canvas, firstTime) {
    var circle = null,
        x = this.get('x'),
        y = this.get('y'),
        r = this.get('radius'),
        attrs = this.basicAttrs();
        
    circle = Sai.canvas_create('circle', canvas, x, y, r, attrs);
    this._element = circle;
  }
  
});

