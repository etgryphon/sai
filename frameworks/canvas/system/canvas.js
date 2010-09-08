/*globals Sai */
Sai.Canvas = SC.Object.extend({
  
  _elements: null,
  _orderedElements: null,
    
  render: function(view, firstTime) { 
    var canvas = null, frame = view.get('frame'),
        cId = '%@-vg'.fmt(view.get('layerId')),
        oe = this._orderedElements,
        len = oe ? oe.length : 0;
    
    if (firstTime) {
      canvas = Sai.canvas_create('canvas', cId, frame.width, frame.height);
      this._canvas = canvas;
    }
    else {
      Sai.canvas_clear(this._canvas || {});
    }
    
    // make the individual shapes on the canvas
    for (var i = 0; i < len; i++) {
      oe[i].render(this, firstTime);
    }
  
    this.renderToView(view);
  }, 
  
  getElementByTarget: function(target) { },
  
  clear: function(){
    var oes = this._orderedElements || [],
        len = oes ? oes.length : 0;
    this._canvas = Sai.canvas_clear(this._canvas || {});
    oes.forEach( function(el){
      this.removeElement(el, oes);
    }, this);
    this._orderedElements = null;
    this._elements = null;
  },
  
  renderToView: function(view){
    var elems, c = this._canvas, layer = view.get('layer');
    // For SVG, because can't do innerHTML
    if (SC.none(c.isRenderable)){
      elems = this._orderedElements || [];
      elems.forEach( function(el){
        c.appendChild(el._element);
      });
      layer.appendChild(c);
    }
    // For VML, super speed increase with innerHTML replacement
    else {
      console.log('Render HTML:\n\n%@'.fmt(c.strings));
      elems = c.join(' ');
      layer.innerHTML = elems;
    }
  },

  element: function(elem, id){
    if (elem.isClass) elem = elem.create();
    this._addCanvasElement(elem, id);
    return elem;
  },
  
  circle: function(x, y, radius, attrs, id) {
    var circle;
    x = x || {};
    attrs = attrs || {};
    
    circle = x.isCircle ? x : Sai.Circle.create({ 
      x: x, 
      y: y, 
      radius: radius,
      stroke: attrs.stroke || 'black',
      strokeWidth: attrs.strokeWidth || 1,
      fill: attrs.fill || 'none'
    });
    if (x.isCircle && !id) id = y ; // Allow to passin ID with premade object.
    
    this._addCanvasElement(circle, id);
    return circle;
  },
  
  path: function(path, attrs, id) {
    var elem;
    path = path || {};
    
    elem = path.isPath ? path : Sai.Path.create({
      stroke: attrs.stroke,
      strokeWidth: attrs.strokeWidth,
      path: path
    });
    
    this._addCanvasElement(elem, id);
    return elem;
  },
  
  rectangle: function(x, y, width, height, radius, attrs, id) {
    var elem;
    x = x || {};
    attrs = attrs || {};
    
    elem = x.isRectangle ? x : Sai.Rectangle.create({
      x: x,
      y: y,
      width: width,
      height: height,
      radius: radius,
      stroke: attrs.stroke || 'black',
      strokeWidth: attrs.strokeWidth || 1,
      fill: attrs.fill || 'none'
    });
    
    this._addCanvasElement(elem, id);
    return elem;
  },
  
  text: function(x, y, width, height, text, attrs, id){
    var elem;
    x = x || {};
    attrs = attrs || {};
    
    elem = x.isText ? x : Sai.Text.create({
      x: x,
      y: y,
      width: width,
      height: height,
      text: text,
      fill: attrs.fill || 'black',
      stroke: attrs.stroke || 'none',
      attrs: attrs
    });
    
    this._addCanvasElement(elem, id);
    return elem;
  },
  
  removeElement: function(element, oes) {
    if (!element) return;
    var oe = oes || this._orderedElements;
    if (oe) oe.removeObject(element);
    delete this._elements[element.get('id')];
    element.destroy();
  },
  
  getElementById: function(id) {
    return this._elements[id];
  },
  
  getElementByIndex: function(idx) {
    // TODO
  },
  
  _addCanvasElement: function(element, id) {
    id = id || SC.guidFor(element);
    this._elements = this._elements || {};
    this._orderedElements = this._orderedElements || [];
    element.set('id', id);
    this._elements[id] = element;
    this._orderedElements.pushObject(element);    
  }
  
});

