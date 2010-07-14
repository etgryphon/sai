// ..........................................................
// Sai - Helper Functions for creating primatives in Sai
// for Sai
// 
sc_require('core_helpers');
sc_require('core_paths');
sc_require('core_svg');
sc_require('core_vml');
/*globals Sai */
Sai.mixin({
  
  canvas_create: function(width, height){
    var t = Sai.vectorType;
    var fName = '%@_canvas_create'.fmt(t.toLowerCase());
    return Sai[fName](width, height);
  }
  
});
