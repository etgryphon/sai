/*globals Sai */
Sai.Element = SC.Object.extend({

  isVisible: YES,
  _element: null,
  
  render: function(canvas, firstTime) {},
  
  basicAttrs: function(attrs){},

  getBBox: function() {
    var f = this.get('frame') ;
    return {
      x: f.x + (this.bbx || 0),
      y: f.y,
      width: f.width,
      height: f.height
    };
  }
  
});
