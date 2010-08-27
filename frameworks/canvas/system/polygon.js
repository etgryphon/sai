/*globals Sai */
sc_require('system/shape');

Sai.Polygon = Sai.Shape.extend({
  
  points: null,
  
  render: function(canvas, firstTime) {
    var poly = null,
        p = this.get('points'),
        attrs = this.basicAttrs();
        
    poly = Sai.canvas_create('polygon', canvas, p, attrs);
    this._element = poly;
  }
  
  
});

