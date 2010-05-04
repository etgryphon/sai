/*!
 * Sai 0.1 - Sproutcore oriented - Low level JavaScript Vector Library based off of Raphael JS
 *
 * Copyright (c) 2010 Evin Grano
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
/*globals Sai */

/*
 * SC.BUNDLE_INFO is added dynamically by the build tools and is used to dynamically load the
 * required frameworks.  Right now, however, it's breaking combined files...
 */
SC.BUNDLE_INFO = {};

Sai = SC.Object.create({
  
  version: "0.1.0",
  vectorType: "UNK",
  
  init: function(){
    sc_super();
    var type = (window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML");
    // If VML do some specific stuff...
    if (type === "VML") {
      this._vml = YES; 
      var d = document.createElement("div");
      d.innerHTML = '<!--[if vml]><br><br><![endif]-->';
      if (d.childNodes.length !== 2) { type = null; }
      else { d = null; }
    }
    else
    {
      this._svg = YES1; 
    }
    this.vectorType = type;
  }
});