/*globals Sai */
sc_require('system/element');

Sai.Text = Sai.Element.extend({
  
  x: 0,
  y: 0,
  height: 0,
  width: 0,
  textAnchor: null,
  font: null,
  stroke: 'none',
  strokeWidth: null,
  fill: '#000',
  text: 'Sai.Text',
  
  basicAttrs: function(attrs){
    attrs = attrs || {};
    
    // add the basic attrs
    attrs.fill = this.get('fill');
    attrs.stroke = this.get('stroke');
    attrs['stroke-width'] = this.get('strokeWidth') || 1;
    attrs['text-anchor'] = this.get('textAnchor') || 'left';
    attrs['font-size'] = this.get('font') || '12';
    attrs.font = this.get('font') || 'Helvetica, Ariel';
    
    return attrs;
  },
    
  render: function(canvas, firstTime) {
    var elem, text = this.get('text'),
        x = this.get('x'),
        y = this.get('y'),
        h = this.get('height'),
        w = this.get('width'),
        attrs = this.basicAttrs();
        
    elem = Sai.canvas_create('text', canvas, x, y, h, w, text, attrs);
    this._element = elem;
  }
});