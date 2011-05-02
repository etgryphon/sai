/*globals Sai */
Sai.Element = SC.Object.extend({

  isVisible: YES,
  _element: null,
  id: null,
  
  render: function(canvas, firstTime) {},
  
  basicAttrs: function(attrs){
    attrs = attrs || {};
    
    // add the basic attrs
    attrs.id = this.id;
    return attrs;
  },

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

