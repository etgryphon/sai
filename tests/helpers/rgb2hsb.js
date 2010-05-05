sc_require('core_helpers');
/**
 * Sai Helper Convertor Unit Tests
 *
 * @author Evin Grano
 */
/*globals Sai */
module("Sai Helpers: RGB => HSB Convertors", {

  setup: function() {},
  teardown: function() {}
  
});
test("Function: rgb2hsb(): Check Zero Case", function() {
  equals(Sai.rgb2hsb(0, 0, 0), 'hsb(0,0,0)', "With all the params, checking that zero rgb make hsb(0,0,0)");
  equals(Sai.rgb2hsb({r: 0, g: 0, b: 0}), 'hsb(0,0,0)', "With one param, checking that zero rgb make hsb(0,0,0)");
});

test("Function: hsb2rgb(): Check Max Case", function() {
  equals(Sai.rgb2hsb(255, 255, 255), 'hsb(0,0,100)', "With all the params, checking that max RGB is full brightness");
  equals(Sai.rgb2hsb(1, 1, 1), 'hsb(0,0,100)', "With all the params with normalization, checking that max RGB is full brightness");
  equals(Sai.rgb2hsb({r: 255, g: 255, b: 255}), 'hsb(0,0,100)', "With one param, checking that max RGB is full brightness");
  equals(Sai.rgb2hsb({r: 1, g: 1, b: 1}), 'hsb(0,0,100)', "With one param with normalization, checking that max RGB is full brightness");
});

test("Function: hsb2rgb(): Check General Case 1", function() {
  equals(Sai.rgb2hsb(120, 80, 200), 'hsb(249,52,55)', "With all the params, checking that RGB (120,80,200)");
  equals(Sai.rgb2hsb(0.47, 0.314, 0.784), 'hsb(249,52,55)', "With all the params with normalization, checking that RGB (120,80,200)");
  equals(Sai.rgb2hsb({r: 120, g: 80, b: 200}), 'hsb(249,52,55)', "With one param, checking that RGB (120,80,200)");
  equals(Sai.rgb2hsb({r: 0.47, g: 0.314, b: 0.784}), 'hsb(249,52,55)', "With one param with normalization, checking that RGB (120,80,200)");
});