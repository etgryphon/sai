/*globals Sai */

sc_require('core');
sc_require('mixins/canvas_delegate');

Sai.Canvas = SC.Object.extend(SC.DelegateSupport, Sai.CanvasDelegate, {

  elements: {},
  
  orderedElements: [],
  
  delegate: null,
  
  canvasDelegate: function() {
    var del = this.get('delegate');
    return this.delegateFor('isCanvasDelegate', del, this);
  }.property('delegate').cacheable(),
  
  render: function(view, firstTime) { }, 
  
  getElementByTarget: function(target) { },
  
  circle: function(x, y, radius, id) {
    var del = this.delegateFor('canvasDelegate');
    var circle = del.canvasCreateCircle(this, x, y, radius);
    this._sc_addCanvasElement(circle, id);
    return circle;
  },
  
  rectangle: function(x, y, width, height, id) {
    var del = this.delegateFor('canvasDelegate');
    var rect = del.canvasCreateRectangle(this, x, y, width, height);
    this._sc_addCanvasElement(rect, id);
    return rect;
  },
  
  ellipse: function(x, y, radiusX, radiusY, id) {
    var del = this.delegateFor('canvasDelegate');
    var ellipse = del.canvasCreateEllipse(this, x, y, radiusX, radiusY);
    this._sc_addCanvasElement(ellipse, id);
    return ellipse;
  },
  
  removeElement: function(element) {
    if (!element) return;
    
    var del = this.get('canvasDelegate');
    del.canvasRemoveElement(element);
    
    this.orderedElements.removeObject(element);
    delete this.elements[element.get('id')];
  },
  
  getElementById: function(id) {
    return this.elements[id];
  },
  
  getElementByIndex: function(idx) {
    // TODO
  },
  
  _sc_addCanvasElement: function(element, id) {
    id = id || SC.guidFor(element);
    element.set('id', id);
    this.elements[id] = element;
    this.orderedElements.pushObject(element);    
  }
  
});