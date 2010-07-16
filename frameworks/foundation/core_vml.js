// ..........................................................
// Sai - Helper Functions for creating primatives in VML
// for Sai
// 
sc_require('core_helpers');
sc_require('core_paths');
/*globals Sai */
Sai.mixin({
  
  vml_create_node: null//,
  
  // vml_canvas_create: function(width, height){
  //   var canvas;
  //       doc = 
  //   doc.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
  //   try {
  //     if (!doc.namespaces.rvml){ doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml"); }
  //     Sai.vml_create_node = function(tagName) {
  //       return doc.createElement('<rvml:' + tagName + ' class="rvml">');
  //     };
  //   } catch(e) {
  //       createNode = function(tagName) {
  //           return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
  //       };
  //   }
  //   return canvas
  // }
  
});
