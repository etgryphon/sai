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
        stroke = this.get('stroke'),
        fill = this.get('fill'),
        sWidth = this.get('strokeWidth');
    if (firstTime) {
      circle = Sai.canvas_create('circle', x, y, r, fill, stroke, sWidth);
      this._circle = circle;
      canvas.appendChild(circle);
    }
  }
  
});