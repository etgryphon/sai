/*globals Sai */
sc_require('system/element');

Sai.Text = Sai.Element.extend({
  
  x: 0,
  y: 0,
  height: 0,
  width: 0,
  textAnchor: 'middle',
  //font: '',
  stroke: 'none',
  strokeWidth: 5,
  fill: '#000',
  text: 'Sai.Text',
  
  basicAttrs: function(attrs){
    attrs = attrs || {};
    
    // add the basic attrs
    attrs.fill = this.get('fill');
    attrs.stroke = this.get('stroke');
    attrs['stroke-width'] = this.get('strokeWidth');
    attrs['text-anchor'] = this.get('textAnchor');
    
    return attrs;
  },
    
  render: function(canvas, firstTime) {
    var elem, text = this.get('text'),
        x = this.get('x'),
        y = this.get('y'),
        h = this.get('height'),
        w = this.get('width'),
        attrs = this.basicAttrs();

    if (firstTime) {
      elem = Sai.canvas_create('text', x, y, h, w, text, attrs);
      this._element = elem;
      canvas.appendChild(elem);
    }
  }
});