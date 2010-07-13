/*globals Sai */

sc_require('core');

Sai.CanvasDelegate = {
  
  isCanvasDelegate: YES,
  
  canvasRemoveElement: function(canvas, element) { },
  
  canvasCreateCircle: function(canvas, x, y, radius) { },
  
  canvasCreateRectangle: function(canvas, x, y, width, height, cornerRadius) { },
  
  canvasCreateEllipse: function(canvas, x, y, radiusX, radiusY) { }
  
};