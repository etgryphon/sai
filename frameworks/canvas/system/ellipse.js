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
        stroke = this.get('stroke'),
        fill = this.get('fill'),
        sWidth = this.get('strokeWidth');
    if (firstTime) {
      ellipse = Sai.canvas_create('ellipse', x, y, rx, ry, fill, stroke, sWidth);
      this._ellipse = ellipse;
      canvas.appendChild(ellipse);
    }
  }
  
});