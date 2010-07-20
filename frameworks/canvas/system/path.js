/*globals Sai */
sc_require('system/shape');

Sai.Path = Sai.Shape.extend({
  
  path: null,
  
  render: function(canvas, firstTime) {
    var elem = null,
        path = this.get('path'),
        attrs = this.basicAttrs();
        
    if (firstTime) {
      elem = Sai.canvas_create('path', path, attrs);
      this._element = elem;
      canvas.appendChild(elem);
    }
  }
});