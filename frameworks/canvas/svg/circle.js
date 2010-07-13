/*globals Sai */

sc_require('core');
sc_require('system/circle');

Sai.SvgCircle = Sai.Circle.extend({
  
  render: function(canvas, firstTime) {
    var circle = null;
    
    if (firstTime) {
      circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', this.get('x'));
      circle.setAttribute('cy', this.get('y'));
      circle.setAttribute('r', this.get('radius'));
      circle.setAttribute('fill', this.get('fill'));
      circle.setAttribute('stroke', this.get('stroke'));
      circle.setAttribute('stroke-width', '%@px'.fmt(this.get('strokeWidth')));
      this._circle = circle;
      canvas.appendChild(circle);
    }
    
  }
  
});