/*globals Sai */
sc_require('system/shape');

Sai.Ellipse = Sai.Shape.extend({
  
  x: 0, 
  y: 0,
  radiusX: 0,
  radiusY: 0,
  
  render: function(canvas, firstTime) {
    var ellipse = null,
        x = this.get('x'),
        y = this.get('y'),
        rx = this.get('radiusX'),
        ry = this.get('radiusY'),
        attrs = this.basicAttrs();

    ellipse = Sai.canvas_create('ellipse', canvas, x, y, rx, ry, attrs);
    this._element = ellipse;
  }
  
});