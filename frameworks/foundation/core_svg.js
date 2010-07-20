// ..........................................................
// Sai - Helper Functions for creating primatives in SVG
// for Sai
// 
sc_require('core_helpers');
sc_require('core_paths');
/*globals Sai */
Sai.mixin({
  
  svg_canvas_create: function(width, height){
    var canvas;
    canvas = document.createElementNS(this.svgns, 'svg');
    canvas.setAttributeNS(null, 'version', '1.1');
    canvas.setAttributeNS(null, 'baseProfile', 'full');
    canvas.setAttributeNS(null, 'width', '%@px'.fmt(width));
    canvas.setAttributeNS(null, 'height', '%@px'.fmt(height));
    return canvas;
  },
  
  // ..........................................................
  // SVG Attr API
  // @param: attrs string | Hash 
  // @param: value (optional) ANY
  svg_attr_set: function(elem, attrs, value){
    var key, normVal;
    value = value || null;
    if (SC.typeOf(attrs) === SC.T_STRING){
      normVal = this._format_attr(attrs, value);
      elem.setAttributeNS(null, attrs, normVal);
    }
    else if (SC.typeOf(attrs) === SC.T_HASH){
      for (key in attrs){
        normVal = this._format_attr(key, attrs[key]);
        elem.setAttributeNS(null, key, normVal);
      }
    }
    
    return elem;
  },
  
  _format_attr: function(attr, val){
    attr = attr ? attr.toLowerCase() : null;
    if (attr === 'stroke-width'){
      // TODO: [EG] more code here to do the right thing...
      return '%@px'.fmt(val);
    }
    else if (attr === 'fill' || attr === 'stroke'){
      return Sai.toRGB(val);
    }
    else {
      return val;
    }
  },
  
  // ..........................................................
  // Circle API
  // 
  svg_circle_create: function (x, y, radius, attrs) {
    var circle;
    x = Math.round(x);
    y = Math.round(y);
    circle = document.createElementNS(this.svgns, 'circle');
    circle.setAttributeNS(null, 'cx', x);
    circle.setAttributeNS(null, 'cy', y);
    circle.setAttributeNS(null, 'r', radius);
    // set the applied attrs
    circle = Sai.svg_attr_set(circle, attrs);
    
    return circle;
  },
  
  // ..........................................................
  // Ellipse API
  // 
  svg_ellipse_create: function (x, y, rx, ry, attrs){
    var ellipse;
    
    // normalize basic params
    x = Math.round(x);
    y = Math.round(y);
    rx = Math.round(rx);
    ry = Math.round(ry);
    
    ellipse = document.createElementNS(this.svgns, 'ellipse');
    ellipse.setAttributeNS(null, 'cx', x);
    ellipse.setAttributeNS(null, 'cy', y);
    ellipse.setAttributeNS(null, 'rx', rx);
    ellipse.setAttributeNS(null, 'ry', ry);
    ellipse = Sai.svg_attr_set(ellipse, attrs);
    
    return ellipse;
  },
  
  // ..........................................................
  // Rectangle API
  // 
  svg_rect_create: function (x, y, h, w, attrs){
    var rect;

    // normalize basic params
    x = Math.round(x);
    y = Math.round(y);
    h = Math.round(h);
    w = Math.round(w);
    
    rect = document.createElementNS(this.svgns, 'rect');
    rect.setAttributeNS(null, 'x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'height', h);
    rect.setAttributeNS(null, 'width', w);
    rect = Sai.svg_attr_set(rect, attrs);

    return rect;
  },
  
  // ..........................................................
  // Text API
  // 
  svg_text_create: function (x, y, h, w, text, attrs){
    var textElem, tn;
    
    // normalize basic params
    x = Math.round(x);
    y = Math.round(y);
    h = Math.round(h);
    w = Math.round(w);
    
    textElem = document.createElementNS(this.svgns, 'text');
    // TODO: [EG] add creation of multiline text here...
    tn = document.createTextNode(text);
    
    textElem.setAttributeNS(null, 'x', x);
    textElem.setAttributeNS(null, 'y', y);
    textElem.setAttributeNS(null, 'height', h);
    textElem.setAttributeNS(null, 'width', w);
    textElem = Sai.svg_attr_set(textElem, attrs);
    // TODO: [EG] add appending of multiline text here...
    textElem.appendChild(tn);

    return textElem;
  },
  
  svg_polygon_create: function (points, attrs){
    var poly, polyPoints = "", isFirst = true;
    
    // normalize basic params
    points = points || [];
    
    if (SC.typeOf(points) === SC.T_STRING){
      polyPoints = points;
    }
    else if(SC.typeOf(points) === SC.T_ARRAY){
      points.forEach( function(pt){
        if (isFirst){
          polyPoints = "%@,%@".fmt(pt.x, pt.y);
          isFirst = false;
        } 
        else {
          polyPoints += " %@,%@".fmt(pt.x, pt.y);
        }
      });
    }
    
    poly = document.createElementNS(this.svgns, 'polygon');
    poly.setAttributeNS(null, 'points', polyPoints);
    poly = Sai.svg_attr_set(poly, attrs);

    return poly;
  },
  
  svg_path_create: function(path, attrs){
    var pathElem, pathStr = "", type;
    // normalize basic params
    path = path || [];
    type = SC.typeOf(path); 
    if ( type === SC.T_STRING){
      pathStr =  Sai.parsePathString(path);
    }
    else if(type === SC.T_ARRAY){
      pathStr = Sai.parsePathString(path.join(" "));
    }
    
    pathElem = document.createElementNS(this.svgns, 'path');
    pathStr = Sai.roundPath(Sai.pathToAbsolute(pathStr));
    pathElem.setAttributeNS(null, 'd', pathStr);
    pathElem = Sai.svg_attr_set(pathElem, attrs);

    return pathElem;
  }
  
});
