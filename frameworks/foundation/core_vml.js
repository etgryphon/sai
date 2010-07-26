// ..........................................................
// Sai - Helper Functions for creating primatives in VML
// for Sai
// 
sc_require('core_helpers');
sc_require('core_paths');
/*globals Sai */
Sai.mixin({
  
  vml_begin_node: null,
  vml_end_node: function(elem){ return elem.end(); },
  
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
      elem = elem.attr('strokeweight', '%@'.fmt(val)); 
    }
    else if (attr === 'fill'){
      nVal = Sai.toRGB(val);
      // In the case where it is a gradient and not a color value
      if (nVal.error){
        nVal = this._gradientFill(elem, val);
      }
      else {
        elem = elem.attr('fillcolor', nVal); 
      }
    }
    else if (attr === 'stroke'){
      nVal = Sai.toRGB(val);
      elem = elem.attr('strokecolor', nVal); 
    }
    else {
      elem = elem.attr(attr, val); 
    }
    return elem;
  },
  
  vml_circle_create: function (canvas, x, y, radius, attrs) {
    var round = Math.round, elem, d, sw = 0,
        c = canvas._canvas, 
        sfmt = '%@px';
        
    // normalize data
    if (attrs) sw = (attrs['stroke-width'] || 0) / 2;
    x = round(x - radius - sw);
    y = round(y - radius - sw);
    d = 2*round(radius);
    
    elem = Sai.vml_begin_node(c, 'oval');
    elem = elem.styles({position: 'absolute', top: sfmt.fmt(y), left: sfmt.fmt(x), width: sfmt.fmt(d), height: sfmt.fmt(d)});
    elem = Sai.vml_attr_set(c, elem, attrs);
    elem = Sai.vml_end_node(elem);

    return elem;
  },
  
  // ..........................................................
  // Ellipse API
  // 
  vml_ellipse_create: function (canvas, x, y, rx, ry, attrs){
    var elem, dx, dy, round = Math.round,
        c = canvas._canvas, sfmt = '%@px';
    
    // normalize basic params
    x = round(x - rx);
    y = round(y - ry);
    dx = 2*round(rx);
    dy = 2*round(ry);
    
    elem = Sai.vml_begin_node(c, 'oval');
    elem = elem.styles({position: 'absolute', top: sfmt.fmt(y), left: sfmt.fmt(x), width: sfmt.fmt(dx), height: sfmt.fmt(dy)});
    elem = Sai.vml_attr_set(c, elem, attrs);
    elem = Sai.vml_end_node(elem);
    
    return elem;
  },
  
  // ..........................................................
  // Rectangle API
  // 
  vml_rect_create: function (canvas, x, y, h, w, cr, attrs){
    var elem, round = Math.round, 
        sfmt = '%@px', c = canvas._canvas;

    // normalize basic params
    x = round(x);
    y = round(y);
    h = round(h);
    w = round(w);
    cr = round(cr) || 0;
    
    elem = Sai.vml_begin_node(c, 'roundrect');
    attrs.arcsize = cr;
    elem = elem.styles({position: 'absolute', top: sfmt.fmt(y), left: sfmt.fmt(x), width: sfmt.fmt(w), height: sfmt.fmt(h)});
    elem = Sai.vml_attr_set(c, elem, attrs);
    elem = Sai.vml_end_node(elem);
    
    return elem;
  },
  
  // ..........................................................
  // Text API
  // 
  vml_text_create: function (canvas, x, y, h, w, text, attrs){
    var elem, tn, round = Math.round, c = canvas._canvas;
    
    // normalize basic params
    x = round(x);
    y = round(y);
    h = round(h);
    w = round(w);
    
    // TODO: [EG] VML code to make a text
    
    return elem;
  },
  
  vml_polygon_create: function (canvas, points, attrs){
    var elem, polyPoints = "", 
        isFirst = true, c = canvas._canvas;
    
    // normalize basic params
    points = points || [];
    
    if (SC.typeOf(points) === SC.T_STRING){
      polyPoints = points;
    }
    else if(SC.typeOf(points) === SC.T_ARRAY){
      points.forEach( function(pt){
        if (isFirst){
          polyPoints = '%@px,%@px'.fmt(pt.x, pt.y);
          isFirst = false;
        } 
        else {
          polyPoints += ' %@px,%@px'.fmt(pt.x, pt.y);
        }
      });
    }
    
    elem = Sai.vml_begin_node(c, 'polyline');
    attrs.points = polyPoints;
    // TODO: [EG] check to see if needs style => elem.attr('style', 'position: absolute; top: px; left:%@px; width:%@px; height:%@px'.fmt(x,y,rx,ry));
    elem = Sai.vml_attr_set(c, elem, attrs);
    elem = Sai.vml_end_node(elem);

    return elem;
  },
  
  vml_path_create: function(canvas, path, attrs){
    var elem, pathStr = "", 
        c = canvas._canvas, type;
    // normalize basic params
    path = path || [];
    type = SC.typeOf(path); 
    if ( type === SC.T_STRING){
      pathStr =  Sai.parsePathString(path);
    }
    else if(type === SC.T_ARRAY){
      pathStr = Sai.parsePathString(path.join(" "));
    }
    pathStr = Sai.path2vml(pathStr);
    console.log("Path: %@".fmt(pathStr));
    elem = Sai.vml_begin_node(c, 'path');
    attrs.path = pathStr;
    // TODO: [EG] might need to have size: elem.attr('style', 'position: absolute; top: %@px; left:%@px; width:%@px; height:%@px'.fmt(x,y,w,h));
    elem = Sai.vml_attr_set(c, elem, attrs);
    elem = Sai.vml_end_node(elem);
    
    return elem;
  },
  
  vml_image_create: function(canvas, x, y, h, w, src, attrs){
    var elem, round = Math.round,
        sfmt = '%@px', c = canvas._canvas;

    // normalize basic params
    x = round(x);
    y = round(y);
    h = round(h);
    w = round(w);
    
    elem = Sai.vml_begin_node(c, 'image');
    attrs.src = src;
    elem = elem.styles({position: 'absolute', top: sfmt.fmt(y), left: sfmt.fmt(x), width: sfmt.fmt(w), height: sfmt.fmt(h)});
    elem = Sai.vml_attr_set(c, elem, attrs);
    elem = Sai.vml_end_node(elem);
    
    return elem;
  }
  
});
