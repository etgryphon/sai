/**
 * Sai Helper Convertor Unit Tests
 *
 * @author Evin Grano
 */
/*globals Sai */
module("Sai Helpers: Convertors", {

  setup: function() {},
  teardown: function() {}
  
});

test("Function: hsb2rgb()", function() {
  // test edge cases: Zero
  equals(Sai.hsb2rgb(0, 0, 33.3), '#555555', "With all the params, checking that zero saturation makes colors equal to brightness");
  equals(Sai.hsb2rgb(0, 0, 0.333), '#555555', "With all the params with normalization, checking that zero saturation makes colors equal to brightness");
  equals(Sai.hsb2rgb({h: 0, s: 0, b: 33.3}), '#555555', "With one param, checking that zero saturation makes colors equal to brightness");
  equals(Sai.hsb2rgb({h: 0, s: 0, b: 0.333}), '#555555', "With one param with normalization, checking that zero saturation makes colors equal to brightness");
  // Test Edge Case: Max
  equals(Sai.hsb2rgb(359, 100, 100), '#FFFFFF', "With all the params, checking that max hue, saturation, and brightness it white");
  equals(Sai.hsb2rgb(1, 1, 1), '#FFFFFF', "With all the params with normalization, checking that max hue, saturation, and brightness it white");
  equals(Sai.hsb2rgb({h: 359, s: 100, b: 100}), '#FFFFFF', "With one param, checking that max hue, saturation, and brightness it white");
  equals(Sai.hsb2rgb({h: 1, s: 1, b: 1}), '#FFFFFF', "With one param with normalization, checking that max hue, saturation, and brightness it white");  
});