/*globals Sai */
sc_require('system/element');

Sai.Shape = Sai.Element.extend({
  
  fill: null,
  stroke: null,
  strokeWidth: null,
  
  basicAttrs: function(attrs){
    attrs = attrs || {};
    
    // add the basic attrs
    attrs.fill = this.get('fill') || 'none';
    attrs.stroke = this.get('stroke') || 'none';
    attrs['stroke-width'] = this.get('strokeWidth') || 1;
    
    return attrs;
  }
  
});

