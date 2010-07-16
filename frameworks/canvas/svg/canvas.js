// /*globals Sai */
// 
// Sai.SvgCanvas = Sai.Canvas.extend({
//   
//   render: function(view, firstTime) { 
//     var canvas = null, frame = view.get('frame');
//     
//     if (firstTime) {
//       // canvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//       // canvas.setAttribute('version', '1.1');
//       // canvas.setAttribute('baseProfile', 'full');
//       // canvas.setAttribute('width', '%@px'.fmt(view.get('frame').width));
//       // canvas.setAttribute('height', '%@px'.fmt(view.get('frame').height));
//       
//       canvas = Sai.svg_canvas_create(frame.width, frame.height);
//       view.get('layer').appendChild(canvas);
//       this._canvas = canvas;
//     }
//     
//     for (var i = 0; i < this.orderedElements.length; i++) {
//       this.orderedElements[i].render(this, firstTime);
//     }
//   },
//   
//   appendChild: function(element) {
//     this._canvas.appendChild(element);
//   },
//   
//   canvasCreateCircle: function(canvas, x, y, radius) {
//     var circle = Sai.SvgCircle.create({
//       x: x, 
//       y: y, 
//       radius: radius
//     });
//     return circle;
//   },
//   
//   canvasCreateRectangle: function(canvas, x, y, width, height, cornerRadius) { 
//     var rect = Sai.SvgRectangle.create({
//       x: x, 
//       y: y, 
//       width: width,
//       height: height,
//       cornerRadius: cornerRadius
//     });
//     return rect;
//   },
//   
//   canvasCreateEllipse: function(canvas, x, y, radiusX, radiusY) { 
//     var ellipse = Sai.SvgEllipse.create({
//       x: x, 
//       y: y, 
//       radiusX: radiusX,
//       radiusY: radiusY
//     });
//     return ellipse;
//   }
//   
// });