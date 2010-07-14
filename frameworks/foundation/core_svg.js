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
    canvas.setAttribute('width', '%@px'.fmt(width);
    canvas.setAttribute('height', '%@px'.fmt(height));
    return canvas
  }
  
});
