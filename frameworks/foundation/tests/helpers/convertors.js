sc_require('core_helpers');
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

// ..........................................................
// toTwoCharHex() function tests
// 
test("Function: toHex(): General Case", function() {
  equals(Sai.toTwoCharHex(0), '00', "With val of 0, make sure its 00");
  equals(Sai.toTwoCharHex(255), 'FF', "With val of 255, make sure its FF");
  equals(Sai.toTwoCharHex(120), '78', "With val of 120, make sure its 78");
});

// ..........................................................
// toHex Function Tests...
// 
test("Function: toHex(): General Case", function() {
  equals(Sai.toHex("red"), 'rgb(255, 0, 0)', "With a string param, checking that 'red' is #FF0000");
  equals(Sai.toHex("green"), 'rgb(0, 128, 0)', "With a string param, checking that 'green' is #00FF00");
  equals(Sai.toHex("blue"), 'rgb(0, 0, 255)', "With a string param, checking that 'blue' is #0000FF");
});

test("Function: toHex(): Funky Color Case", function() {
  equals(Sai.toHex("cyan"), 'rgb(0, 255, 255)', "With a string param, checking 'cyan'");
  equals(Sai.toHex("brown"), 'rgb(165, 42, 42)', "With a string param, checking 'brown'");
  equals(Sai.toHex("black"), 'rgb(0, 0, 0)', "With a string param, checking 'black'");
  equals(Sai.toHex("lightblue"), 'rgb(173, 216, 230)', "With a string param, checking 'lightblue'");
  equals(Sai.toHex("purple"), 'rgb(128, 0, 128)', "With a string param, checking 'purple'");
});

// ..........................................................
// hsb2rgb() Function tests
// 
test("Function: hsb2rgb(): Check Zero Case", function() {
  equals(Sai.hsb2rgb(0, 0, 33.3), '#555555', "With all the params, checking that zero saturation makes colors equal to brightness");
  equals(Sai.hsb2rgb(0, 0, 0.333), '#555555', "With all the params with normalization, checking that zero saturation makes colors equal to brightness");
  equals(Sai.hsb2rgb({h: 0, s: 0, b: 33.3}), '#555555', "With one param, checking that zero saturation makes colors equal to brightness");
  equals(Sai.hsb2rgb({h: 0, s: 0, b: 0.333}), '#555555', "With one param with normalization, checking that zero saturation makes colors equal to brightness");
});

test("Function: hsb2rgb(): Check Max Case", function() {
  equals(Sai.hsb2rgb(360, 100, 100), '#FF0000', "With all the params, checking that max hue, saturation, and brightness it white");
  equals(Sai.hsb2rgb(1, 1, 1), '#FF0000', "With all the params with normalization, checking that max hue, saturation, and brightness it white");
  equals(Sai.hsb2rgb({h: 360, s: 100, b: 100}), '#FF0000', "With one param, checking that max hue, saturation, and brightness it white");
  equals(Sai.hsb2rgb({h: 1, s: 1, b: 1}), '#FF0000', "With one param with normalization, checking that max hue, saturation, and brightness it white");  
});

test("Function: hsb2rgb(): Check General Case 1", function() {
  equals(Sai.hsb2rgb(120, 79, 52), '#1C851C', "With all the params, general case of (h: 120, s: 79%, b: 52%)");
  equals(Sai.hsb2rgb(0.333, 0.79, 0.52), '#1C851C', "With all the params with normalization, general case of (h: 120, s: 79%, b: 52%)");
  equals(Sai.hsb2rgb({h: 120, s: 79, b: 52}), '#1C851C', "With one param, general case of (h: 120, s: 79%, b: 52%)");
  equals(Sai.hsb2rgb({h: 0.333, s: 0.79, b: 0.52}), '#1C851C', "With one param with normalization, general case of (h: 120, s: 79%, b: 52%)");
});

test("Function: hsb2rgb(): Check General Case 2", function() {
  equals(Sai.hsb2rgb(60, 50, 50), '#7F8040', "With all the params, general case of (h: 60, s: 50%, b: 50%)");
  equals(Sai.hsb2rgb(0.167, 0.5, 0.5), '#7F8040', "With all the params with normalization, general case of (h: 60, s: 50%, b: 50%)");
  equals(Sai.hsb2rgb({h: 60, s: 50, b: 50}), '#7F8040', "With one param, general case of (h: 60, s: 50%, b: 50%)");
  equals(Sai.hsb2rgb({h: 0.167, s: 0.5, b: 0.5}), '#7F8040', "With one param with normalization, general case of (h: 60, s: 50%, b: 50%)");
});

test("Function: hsb2rgb(): Check General Case 3", function() {
  equals(Sai.hsb2rgb(180, 65, 25), '#164040', "With all the params, general case of (h: 180, s: 65%, b: 25%)");
  equals(Sai.hsb2rgb(0.5, 0.65, 0.25), '#164040', "With all the params with normalization, general case of (h: 180, s: 65%, b: 25%)");
  equals(Sai.hsb2rgb({h: 180, s: 65, b: 25}), '#164040', "With one param, general case of (h: 180, s: 65%, b: 25%)");
  equals(Sai.hsb2rgb({h: 0.5, s: 0.65, b: 0.25}), '#164040', "With one param with normalization, general case of (h: 180, s: 65%, b: 25%)");
});

test("Function: hsb2rgb(): Check General Case 4", function() {
  equals(Sai.hsb2rgb(240, 75, 75), '#3030BF', "With all the params, general case of (h: 240, s: 75%, b: 75%)");
  equals(Sai.hsb2rgb(0.667, 0.75, 0.75), '#3030BF', "With all the params with normalization, general case of (h: 240, s: 75%, b: 75%)");
  equals(Sai.hsb2rgb({h: 240, s: 75, b: 75}), '#3030BF', "With one param, general case of (h: 240, s: 75%, b: 75%)");
  equals(Sai.hsb2rgb({h: 0.667, s: 0.75, b: 0.75}), '#3030BF', "With one param with normalization, general case of (h: 240, s: 75%, b: 75%)");
});

test("Function: hsb2rgb(): Check General Case 5", function() {
  equals(Sai.hsb2rgb(180, 100, 100), '#00FFFF', "With all the params, general case of (h: 180, s: 100%, b: 100%)");
  equals(Sai.hsb2rgb(0.5, 1, 1), '#00FFFF', "With all the params with normalization, general case of (h: 180, s: 100%, b: 100%)");
  equals(Sai.hsb2rgb({h: 180, s: 100, b: 100}), '#00FFFF', "With one param, general case of (h: 180, s: 100%, b: 100%)");
  equals(Sai.hsb2rgb({h: 0.5, s: 1, b: 1}), '#00FFFF', "With one param with normalization, general case of (h: 180, s: 100%, b: 100%)");
});


// ..........................................................
// rgb2hsb() Function test
// 
test("Function: rgb2hsb(): Check Zero Case", function() {
  equals(Sai.rgb2hsb(0, 0, 0), 'hsb(0,0,0)', "With all the params, checking that zero rgb make hsb(0,0,0)");
  equals(Sai.rgb2hsb({r: 0, g: 0, b: 0}), 'hsb(0,0,0)', "With one param, checking that zero rgb make hsb(0,0,0)");
});

test("Function: rgb2hsb(): Check Max Case", function() {
  equals(Sai.rgb2hsb(255, 255, 255), 'hsb(0,0,100)', "With all the params, checking that max RGB is full brightness");
  equals(Sai.rgb2hsb(1, 1, 1), 'hsb(0,0,100)', "With all the params with normalization, checking that max RGB is full brightness");
  equals(Sai.rgb2hsb({r: 255, g: 255, b: 255}), 'hsb(0,0,100)', "With one param, checking that max RGB is full brightness");
  equals(Sai.rgb2hsb({r: 1, g: 1, b: 1}), 'hsb(0,0,100)', "With one param with normalization, checking that max RGB is full brightness");
});

test("Function: rgb2hsb(): Check General Case 1", function() {
  equals(Sai.rgb2hsb(120, 80, 200), 'hsb(249,52,55)', "With all the params, checking that RGB (120,80,200)");
  equals(Sai.rgb2hsb(0.47, 0.314, 0.784), 'hsb(249,52,55)', "With all the params with normalization, checking that RGB (120,80,200)");
  equals(Sai.rgb2hsb({r: 120, g: 80, b: 200}), 'hsb(249,52,55)', "With one param, checking that RGB (120,80,200)");
  equals(Sai.rgb2hsb({r: 0.47, g: 0.314, b: 0.784}), 'hsb(249,52,55)', "With one param with normalization, checking that RGB (120,80,200)");
});

// ..........................................................
// toRGB function tests
// 
test("Function: toRGB(): General Color Case", function() {
  equals(Sai.toRGB("red"), '#FF0000', "With a string param, checking that 'red' is #FF0000");
  equals(Sai.toRGB("green"), '#008000', "With a string param, checking that 'green' is #008000");
  equals(Sai.toRGB("blue"), '#0000FF', "With a string param, checking that 'blue' is #0000FF");
});

test("Function: toRGB(): General 6 Char Hex Case", function() {
  equals(Sai.toRGB("#FF0000"), '#FF0000', "With a string param, checking that '#FF0000' is #FF0000");
  equals(Sai.toRGB("#008000"), '#008000', "With a string param, checking that '#008000' is #008000");
  equals(Sai.toRGB("#0000FF"), '#0000FF', "With a string param, checking that '#0000FF' is #0000FF");
});

test("Function: toRGB(): General 3 Char Hex Case", function() {
  equals(Sai.toRGB("#F00"), '#FF0000', "With a string param, checking that '#F00' is #FF0000");
  equals(Sai.toRGB("#080"), '#008800', "With a string param, checking that '#080' is #008800");
  equals(Sai.toRGB("#00F"), '#0000FF', "With a string param, checking that '#00F' is #0000FF");
});

test("Function: toRGB(): General RGB String Case", function() {
  equals(Sai.toRGB("rgb(0, 255, 255)"), '#00FFFF', "With a string param, checking that 'rgb(0, 255, 255)' is #00FFFF");
  equals(Sai.toRGB("rgb(0,255,255)"), '#00FFFF', "With a string param w/out spaces, checking that 'rgb(0,255,255)' is #00FFFF");
  equals(Sai.toRGB("rgb(0, 1, 1)"), '#000101', "With a string param w/out spaces, checking that 'rgb(0, 1, 1)' is #000101");
  equals(Sai.toRGB("rgb(0,1,1)"), '#000101', "With a string param w/out spaces, checking that 'rgb(0,1,1)' is #000101");
});

test("Function: toRGB(): General HSB String Case", function() {
  equals(Sai.toRGB("hsb(0, 0, 33.3)"), '#555555', "With a string param, checking that 'hsb(0, 0, 33.3)' is #555555");
  equals(Sai.toRGB("hsb(0,0,33.3)"), '#555555', "With a string param w/out spaces, checking that 'hsb(0,0,33.3)' is #555555");
});

// ..........................................................
// getColor() - function test
//
test("Function: resetColor() basic case", function() {
  Sai.resetColor();
  equals(Sai.getColor(), '#BF0000', "null values, checking that null is #BF0000");
  equals(Sai.getColor(), '#FFB946', "2 calls the color value should be #FFB946");
  Sai.resetColor();
  equals(Sai.getColor(), '#BF0000', "After reset, checking that color is #BF0000");
});


