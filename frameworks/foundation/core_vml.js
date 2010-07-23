// ..........................................................
// Sai - Helper Functions for creating primatives in VML
// for Sai
// 
sc_require('core_helpers');
sc_require('core_paths');
/*globals Sai */
Sai.mixin({
  
  vml_begin_node: null,
  vml_end_node: function(elem){ elem.end(); },
  
  vml_canvas_create: function(id, width, height){
    var canvas = SC.RenderContext('div').id(id), doc = document;
    canvas.isRenderable = YES;
    try {
      if (!doc.namespaces.rvml){ doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml"); }
      Sai.vml_begin_node = function(context, tagName) {
        context = context.begin('rvml:%@'.fmt(tagName)).addClass('rvml');
        return context;
      };
    } 
    catch(e) {
      Sai.vml_begin_node = function(context, tagName) {
        context = context.begin(tagName).attr({xmls: 'urn:schemas-microsoft.com:vml'}).addClass('rvml');
        return context;
      };
    }
    return canvas;
  },
  
  // ..........................................................
  // VML Attr API
  // @param: attrs string | Hash 
  // @param: value (optional) ANY
  vml_attr_set: function(canvas, elem, attrs, value){
    var key, normVal;
    value = value || null;
    if (SC.typeOf(attrs) === SC.T_STRING){
      elem = this.vml_format_attr(elem, attrs, value);
    }
    else if (SC.typeOf(attrs) === SC.T_HASH){
      for(key in attrs){
        elem = this.vml_format_attr(elem, key, attrs[key]);
      }
    }
    
    return elem;
  },
  
  vml_format_attr: function(elem, attr, val){
    var nVal = val;
    attr = attr ? attr.toLowerCase() : null;
    if (attr === 'stroke-width'){
      // TODO: [EG] more code here to do the right thing...
      elem.attr('strokeweight', '%@'.fmt(val)); 
    }
    else if (attr === 'fill'){
      nVal = Sai.toRGB(val);
      // In the case where it is a gradient and not a color value
      if (nVal.error){
        nVal = this._gradientFill(elem, val);
      }
      else {
        elem.attr('fillcolor', nVal); 
      }
    }
    else if (attr === 'stroke'){
      nVal = Sai.toRGB(val);
      elem.attr('strokecolor', nVal); 
    }
    return elem;
  },
  
  vml_circle_create: function (canvas, x, y, radius, attrs) {
    var d = radius*2, elem,
        c = canvas._canvas;
        
    // normalize data
    x = Math.round(x);
    y = Math.round(y);

    elem = Sai.vml_begin_node(c, 'oval');
    elem.attr('style', 'position: absolute; top: %@px; left:%@px; width:%@px; height:%@px'.fmt(x,y,d,d));
    elem = Sai.vml_attr_set(c, elem, attrs);
    Sai.vml_end_node(elem);

    return elem;
  }
  
});
