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
    canvas.setAttribute('version', '1.1');
    canvas.setAttribute('baseProfile', 'full');
    canvas.setAttribute('width', '%@px'.fmt(width));
    canvas.setAttribute('height', '%@px'.fmt(height));
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
      elem.setAttribute(attrs, normVal);
    }
    else if (SC.typeOf(attrs) === SC.T_HASH){
      for (key in attrs){
        normVal = this._format_attr(key, attrs[key]);
        elem.setAttribute(key, normVal);
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
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', radius);
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
    ellipse.setAttribute('cx', x);
    ellipse.setAttribute('cy', y);
    ellipse.setAttribute('rx', rx);
    ellipse.setAttribute('ry', ry);
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
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('height', h);
    rect.setAttribute('width', w);
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
    
    textElem.setAttribute('x', x);
    textElem.setAttribute('y', y);
    textElem.setAttribute('height', h);
    textElem.setAttribute('width', w);
    textElem = Sai.svg_attr_set(textElem, attrs);
    // TODO: [EG] add appending of multiline text here...
    textElem.appendChild(tn);

    return textElem;
  }
  
});
