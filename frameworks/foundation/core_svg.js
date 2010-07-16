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
    canvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    canvas.setAttribute('version', '1.1');
    canvas.setAttribute('baseProfile', 'full');
    canvas.setAttribute('width', '%@px'.fmt(width));
    canvas.setAttribute('height', '%@px'.fmt(height));
    return canvas;
  },
  
  svg_circle_create: function (x, y, radius, fill, stroke, strokeWidth) {
    var circle;
    x = Math.round(x);
    y = Math.round(y);
    circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', '%@px'.fmt(strokeWidth));
    
    return circle;
  }
  
});
