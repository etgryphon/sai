/*globals Sai */
sc_require('system/shape');

Sai.Rectangle = Sai.Shape.extend({
  
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  cornerRadius: 0,
  
  render: function(canvas, firstTime) {
    var rect = null,
        x = this.get('x'),
        y = this.get('y'),
        h = this.get('height'),
        w = this.get('width'),
        stroke = this.get('stroke'),
        fill = this.get('fill'),
        sWidth = this.get('strokeWidth');
    if (firstTime) {
      rect = Sai.canvas_create('rect', x, y, h, w, fill, stroke, sWidth);
      this._element = rect;
      canvas.appendChild(rect);
    }
  }
  
  
});