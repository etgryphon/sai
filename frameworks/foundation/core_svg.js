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
    var circle,
        colorStyling = Sai.convertAllToRGB({fill: fill, stroke: stroke});
    x = Math.round(x);
    y = Math.round(y);
    circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', colorStyling.fill);
    circle.setAttribute('stroke', colorStyling.stroke);
    circle.setAttribute('stroke-width', '%@px'.fmt(strokeWidth));
    
    return circle;
  },
  
  svg_ellipse_create: function (x, y, rx, ry, fill, stroke, strokeWidth){
    var ellipse,
        colorStyling = Sai.convertAllToRGB({fill: fill, stroke: stroke});
    x = Math.round(x);
    y = Math.round(y);
    rx = Math.round(rx);
    ry = Math.round(ry);
    ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    ellipse.setAttribute('cx', x);
    ellipse.setAttribute('cy', y);
    ellipse.setAttribute('rx', rx);
    ellipse.setAttribute('ry', ry);
    ellipse.setAttribute('fill', colorStyling.fill);
    ellipse.setAttribute('stroke', colorStyling.stroke);
    ellipse.setAttribute('stroke-width', '%@px'.fmt(strokeWidth));
    
    return ellipse;
  },
  
  svg_rect_create: function (x, y, h, w, fill, stroke, strokeWidth){
    var rect,
        colorStyling = Sai.convertAllToRGB({fill: fill, stroke: stroke});
    x = Math.round(x);
    y = Math.round(y);
    h = Math.round(h);
    w = Math.round(w);
    rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('height', h);
    rect.setAttribute('width', w);
    rect.setAttribute('fill', colorStyling.fill);
    rect.setAttribute('stroke', colorStyling.stroke);
    rect.setAttribute('stroke-width', '%@px'.fmt(strokeWidth));

    return rect;
  }
  
});
