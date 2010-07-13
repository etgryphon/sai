/**
 * Sai Helper Parsers Unit Tests
 *
 * @author Evin Grano
 */
/*globals Sai */
module("Sai Helpers: Parsers", {
  setup: function() {},
  teardown: function() {}
  
});

// ..........................................................
// toTwoCharHex() function tests
// 
test("Function: parsePathString(): Null Case", function() {
  equals(Sai.parsePathString(), null, "With no value pass in make sure the response is null");
  var n = null;
  equals(Sai.parsePathString(n), null, "With a null param pass in make sure the response is null");
  var u = undefined;
  equals(Sai.parsePathString(u), null, "With an undefined param pass in make sure the response is null");
});
