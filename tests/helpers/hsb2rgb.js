sc_require('core_helpers');
/**
 * Sai Helper Convertor Unit Tests
 *
 * @author Evin Grano
 */
/*globals Sai */
module("Sai Helpers: HSB => RGB Convertors", {

  setup: function() {},
  teardown: function() {}
  
});

test("Function: hsb2rgb(): Check Zero Case", function() {
  equals(Sai.hsb2rgb(0, 0, 33.3), '#555555', "With all the params, checking that zero saturation makes colors equal to brightness");
  equals(Sai.hsb2rgb(0, 0, 0.333), '#555555', "With all the params with normalization, checking that zero saturation makes colors equal to brightness");
  equals(Sai.hsb2rgb({h: 0, s: 0, b: 33.3}), '#555555', "With one param, checking that zero saturation makes colors equal to brightness");
  equals(Sai.hsb2rgb({h: 0, s: 0, b: 0.333}), '#555555', "With one param with normalization, checking that zero saturation makes colors equal to brightness");
});

test("Function: hsb2rgb(): Check Max Case", function() {
  equals(Sai.hsb2rgb(359, 100, 100), '#FFFFFF', "With all the params, checking that max hue, saturation, and brightness it white");
  equals(Sai.hsb2rgb(1, 1, 1), '#FFFFFF', "With all the params with normalization, checking that max hue, saturation, and brightness it white");
  equals(Sai.hsb2rgb({h: 359, s: 100, b: 100}), '#FFFFFF', "With one param, checking that max hue, saturation, and brightness it white");
  equals(Sai.hsb2rgb({h: 1, s: 1, b: 1}), '#FFFFFF', "With one param with normalization, checking that max hue, saturation, and brightness it white");  
});

test("Function: hsb2rgb(): Check General Case 1", function() {
  equals(Sai.hsb2rgb(120, 79, 52), '#24E525', "With all the params, general case of (h: 120, s: 79%, b: 52%)");
  equals(Sai.hsb2rgb(0.333, 0.79, 0.52), '#24E524', "With all the params with normalization, general case of (h: 120, s: 79%, b: 52%)");
  equals(Sai.hsb2rgb({h: 120, s: 79, b: 52}), '#24E525', "With one param, general case of (h: 120, s: 79%, b: 52%)");
  equals(Sai.hsb2rgb({h: 0.333, s: 0.79, b: 0.52}), '#24E524', "With one param with normalization, general case of (h: 120, s: 79%, b: 52%)");
});

test("Function: hsb2rgb(): Check General Case 2", function() {
  equals(Sai.hsb2rgb(60, 50, 50), '#BFBF3F', "With all the params, general case of (h: 60, s: 50%, b: 50%)");
  equals(Sai.hsb2rgb(0.167, 0.5, 0.5), '#BFBF3F', "With all the params with normalization, general case of (h: 60, s: 50%, b: 50%)");
  equals(Sai.hsb2rgb({h: 60, s: 50, b: 50}), '#BFBF3F', "With one param, general case of (h: 60, s: 50%, b: 50%)");
  equals(Sai.hsb2rgb({h: 0.167, s: 0.5, b: 0.5}), '#BFBF3F', "With one param with normalization, general case of (h: 60, s: 50%, b: 50%)");
});

test("Function: hsb2rgb(): Check General Case 3", function() {
  equals(Sai.hsb2rgb(180, 65, 25), '#166869', "With all the params, general case of (h: 180, s: 65%, b: 25%)");
  equals(Sai.hsb2rgb(0.5, 0.65, 0.25), '#166969', "With all the params with normalization, general case of (h: 180, s: 65%, b: 25%)");
  equals(Sai.hsb2rgb({h: 180, s: 65, b: 25}), '#166869', "With one param, general case of (h: 180, s: 65%, b: 25%)");
  equals(Sai.hsb2rgb({h: 0.5, s: 0.65, b: 0.25}), '#166969', "With one param with normalization, general case of (h: 180, s: 65%, b: 25%)");
});

test("Function: hsb2rgb(): Check General Case 4", function() {
  equals(Sai.hsb2rgb(240, 75, 75), '#8F8FEF', "With all the params, general case of (h: 240, s: 75%, b: 75%)");
  equals(Sai.hsb2rgb(0.667, 0.75, 0.75), '#8F8FEF', "With all the params with normalization, general case of (h: 240, s: 75%, b: 75%)");
  equals(Sai.hsb2rgb({h: 240, s: 75, b: 75}), '#8F8FEF', "With one param, general case of (h: 240, s: 75%, b: 75%)");
  equals(Sai.hsb2rgb({h: 0.667, s: 0.75, b: 0.75}), '#8F8FEF', "With one param with normalization, general case of (h: 240, s: 75%, b: 75%)");
});
