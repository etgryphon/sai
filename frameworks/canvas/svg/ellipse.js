/*globals Sai */

sc_require('core');
sc_require('system/ellipse');

Sai.SvgEllipse = Sai.Ellipse.extend({
  
  render: function(canvas, firstTime) {
    var ellipse = null;
    
    if (firstTime) {
      ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      ellipse.setAttribute('cx', this.get('x'));
      ellipse.setAttribute('cy', this.get('y'));
      ellipse.setAttribute('rx', this.get('radiusX'));
      ellipse.setAttribute('ry', this.get('radiusY'));
      ellipse.setAttribute('fill', this.get('fill'));
      ellipse.setAttribute('stroke', this.get('stroke'));
      ellipse.setAttribute('stroke-width', '%@px'.fmt(this.get('strokeWidth')));
      this._ellipse = ellipse;
      canvas.appendChild(ellipse);
    }
  }
  
});