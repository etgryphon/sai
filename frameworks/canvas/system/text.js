/*globals Sai */
sc_require('system/element');

Sai.Text = Sai.Shape.extend({
  
  x: 0,
  y: 0,
  height: 0,
  width: 0,
  text: 'Sai.Text',
  
  // Text Attributes
  // ex: {textAnchor: 'left, font: 'Helvetica', fontSize: '12'}
  attrs: null,
  
  basicAttrs: function(attrs){
    var tAttrs = this.get('attrs') || {};
    attrs = attrs || {};
    
    // add the basic attrs
    attrs = sc_super();
    attrs['text-anchor'] = tAttrs.textAnchor || 'left';
    attrs['font-size'] = tAttrs.fontSize || '12';
    attrs['stroke-width'] = Sai.isZeroOrValue(this.get('strokeWidth'), 0);
    attrs.font = tAttrs.font || 'Helvetica, Arial';
    
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

