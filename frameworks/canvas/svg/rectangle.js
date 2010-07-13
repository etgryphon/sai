/*globals Sai */

sc_require('core');
sc_require('system/rectangle');

Sai.SvgRectangle = Sai.Rectangle.extend({
  
  render: function(canvas, firstTime) {
    var rect = null;
    
    if (firstTime) {
      rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', this.get('x'));
      rect.setAttribute('y', this.get('y'));
      rect.setAttribute('height', this.get('height'));
      rect.setAttribute('width', this.get('width'));
      rect.setAttribute('fill', this.get('fill'));
      rect.setAttribute('stroke', this.get('stroke'));
      rect.setAttribute('stroke-width', '%@px'.fmt(this.get('strokeWidth')));
      this._rect = rect;
      canvas.appendChild(rect);
    }
    
  }
  
});