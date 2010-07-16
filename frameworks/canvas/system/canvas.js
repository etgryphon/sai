/*globals Sai */
Sai.Canvas = SC.Object.extend({
  
  _elements: null,
  _orderedElements: null,
    
  render: function(view, firstTime) { 
    var canvas = null, frame = view.get('frame'),
        len = this._orderedElements.length;
    
    if (firstTime) {
      canvas = Sai.canvas_create('canvas', frame.width, frame.height);
      view.get('layer').appendChild(canvas);
      this._canvas = canvas;
    }
    
    for (var i = 0; i < len; i++) {
      this._orderedElements[i].render(this, firstTime);
    }
  }, 
  
  getElementByTarget: function(target) { },
  
  appendChild: function(element) {
    this._canvas.appendChild(element);
  },

  element: function(elem, id){
    if (elem.isClass) elem = elem.create();
    this._addCanvasElement(elem, id);
    return elem;
  },
  
  circle: function(x, y, radius, id) {
    var circle;
    x = x || {};
    
    circle = x.isCircle ? x : Sai.Circle.create({ x: x, y: y, radius: radius});
    
    this._addCanvasElement(circle, id);
    return circle;
  },
  
  // rectangle: function(x, y, width, height, id) {
  //   var del = this.delegateFor('canvasDelegate');
  //   var rect = del.canvasCreateRectangle(this, x, y, width, height);
  //   this._addCanvasElement(rect, id);
  //   return rect;
  // },
  // 
  // ellipse: function(x, y, radiusX, radiusY, id) {
  //   var del = this.delegateFor('canvasDelegate');
  //   var ellipse = del.canvasCreateEllipse(this, x, y, radiusX, radiusY);
  //   this._addCanvasElement(ellipse, id);
  //   return ellipse;
  // },
  
  removeElement: function(element) {
    // if (!element) return;
    // 
    // var del = this.get('canvasDelegate');
    // del.canvasRemoveElement(element);
    // 
    // this.orderedElements.removeObject(element);
    // delete this.elements[element.get('id')];
  },
  
  getElementById: function(id) {
    return this.elements[id];
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