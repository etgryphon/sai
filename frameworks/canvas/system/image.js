/*globals Sai */
sc_require('system/element');

Sai.Image = Sai.Element.extend({
  
  x: 0,
  y: 0,
  height: 0,
  width: 0,
  image: null,
  
  basicAttrs: function(attrs){
    attrs = attrs || {};
    
    // add the basic attrs
    
    return attrs;
  },
    
  render: function(canvas, firstTime) {
    var elem, text = this.get('text'),
        x = this.get('x'),
        y = this.get('y'),
        h = this.get('height'),
        w = this.get('width'),
        src = this.get('image'),
        attrs = this.basicAttrs();

    elem = Sai.canvas_create('image', canvas, x, y, h, w, src, attrs);
    this._element = elem;
  }
});

