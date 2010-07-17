/*globals Sai */
sc_require('system/element');

Sai.Shape = Sai.Element.extend({
  
  fill: '#ffffff',
  stroke: '#000000',
  strokeWidth: 1,
  
  basicAttrs: function(attrs){
    attrs = attrs || {};
    
    // add the basic attrs
    attrs.fill = this.get('fill');
    attrs.stroke = this.get('stroke');
    attrs['stroke-width'] = this.get('strokeWidth');
    
    return attrs;
  }
  
});