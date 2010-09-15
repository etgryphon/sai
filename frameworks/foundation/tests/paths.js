sc_require('core_helpers');
sc_require('core_paths');
/**
 * Sai Helper Path Unit Tests
 *
 * @author Evin Grano
 */
/*globals Sai */
module("Sai Helpers: Paths", {

  setup: function() {},
  teardown: function() {}
  
});

// ..........................................................
// parsePathString() function tests
// 
test("Function: parsePathString(): Null Case", function() {
  equals(Sai.parsePathString(), null, "With no value pass in make sure the response is null");
  var n = null;
  equals(Sai.parsePathString(n), null, "With a null param pass in make sure the response is null");
  var u = undefined;
  equals(Sai.parsePathString(u), null, "With an undefined param pass in make sure the response is null");
});

test("Function: parsePathString(): General Absolute Case", function() {
  var pathStr, pPath;
  
  // Test 1: Triangle > Lineto Path
  pathStr = 'M50,80 L250,80 150,280 z';
  pPath = Sai.parsePathString(pathStr);
  equals(pPath, 'M50,80L250,80L150,280z', "Triangle > Moveto, Lineto: converting path = \'M50,80 L250,80 150,280 z\'");
  
  // Test 2: Rectangle > Vertical and Horizontal Paths
  pathStr = 'M50,80 H250 V280 H50 z';
  pPath = Sai.parsePathString(pathStr);
  equals(pPath, 'M50,80H250V280H50z', " Rectangle > Vertical Lineto & Horizontal Lineto: converting path = \'M50,80 H250 V280 H50 z\'");
  
  // Test 3: Triangle w/out commas
  pathStr = 'M250 150 L150 350 L350 350 Z';
  pPath = Sai.parsePathString(pathStr);
  equals(pPath, 'M250,150L150,350L350,350Z', "Triangle w/out commas: converting path = \'M250 150 L150 350 L350 350 Z\'");
  
  // Test 4: Spiral complex non close 
  pathStr = 'M153 334 C153 334 151 334 151 334 C151 339 153 344 156 344 C164 344 171 339 171 334 C171 322 164 314 156 314 C142 314 131 322 131 334';
  pPath = Sai.parsePathString(pathStr);
  equals(pPath, 'M153,334C153,334,151,334,151,334C151,339,153,344,156,344C164,344,171,339,171,334C171,322,164,314,156,314C142,314,131,322,131,334', "Spiral > Moveto & CurveTo");
});

test("Function: parsePathString(): General Relative Case", function() {
  var pathStr, pPath;
  
  // Test 1: Triangle > Relative Path
  pathStr = 'M50,80 l200,0 -100,200 z';
  pPath = Sai.parsePathString(pathStr);
  equals(pPath, 'M50,80l200,0l-100,200z', "Triangle: converting path = \'M50,80 l200,0 -100,200 z\'");
  
  // Test 2: Rectangle > Vertical and Horizontal Paths
  pathStr = 'M50,80 h200 v200 h-200 z';
  pPath = Sai.parsePathString(pathStr);
  equals(pPath, 'M50,80h200v200h-200z', "Rectangle: converting path = \'M50,80 h200 v200 h-200 z\'");
});


test("Function: pathClone()", function() {
  var pathStr, pPath, pClone;
  
  // Test 1: Triangle > Relative Path
  pathStr = 'M50,80 l200,0 -100,200 z';
  pPath = Sai.parsePathString(pathStr);
  pClone = Sai.pathClone(pPath);
  equals(pClone, 'M50,80l200,0l-100,200z', "Triangle: cloning path = \'M50,80 l200,0 -100,200 z\'");
});


test("Function: pathToAbsolute()", function() {
  var pathStr, pPath, pAbsol;
  
  // Test 1: Triangle > Relative Path
  pathStr = 'M50,80 l200,0 -100,200 z';
  pPath = Sai.parsePathString(pathStr);
  pAbsol = Sai.pathToAbsolute(pPath);
  equals(pAbsol, 'M50,80L250,80L150,280Z', "Triangle: converting (\'M50,80 l200,0 -100,200 z\') to an absolute path");
  
  // Test 2: Elliptical Arc > Relative Path
  pathStr = 'M600,350 l 50,-25 a25,25 -30 0,1 50,-25 l 50,-25 a25,50 -30 0,1 50,-25 l 50,-25 a25,75 -30 0,1 50,-25 l 50,-25 a25,100 -30 0,1 50,-25 l 50,-25';
  pPath = Sai.parsePathString(pathStr);
  pAbsol = Sai.pathToAbsolute(pPath);
  equals(pAbsol, 'M600,350L650,325A25,25,-30,0,1,700,300L750,275A25,50,-30,0,1,800,250L850,225A25,75,-30,0,1,900,200L950,175A25,100,-30,0,1,1000,150L1050,125', "Elliptical Arc > Relative Path to an absolute path");
});

test("Function: path2curve()", function() {
  var pathStr, pPath, p2c;
  
  // Test 1: Triangle
  pathStr = 'M50,10 L250,10 150,185 z';
  pPath = Sai.parsePathString(pathStr);
  p2c = Sai.path2curve(pPath);
  equals(p2c, 'M50,10C50,10,250,10,250,10C250,10,150,185,150,185C150,185,50,10,50,10', "Triangle: redrawing the path (\'M50,10 L250,10 150,185 z\') with curves");
  
  // Test 2: Abstract Path 
  pathStr = 'M40,140 L40,100 10,100 C10,10 90,10 90,100 L60,100 60,140 M140,50 C70,180 195,180 190,100';
  pPath = Sai.parsePathString(pathStr);
  p2c = Sai.path2curve(pPath);
  equals(p2c, 
        'M40,140C40,140,40,100,40,100C40,100,10,100,10,100C10,10,90,10,90,100C90,100,60,100,60,100C60,100,60,140,60,140M140,50C70,180,195,180,190,100', 
        "Abstract Path: redrawing (\'M40,140 L40,100 10,100 C10,10 90,10 90,100 L60,100 60,140 M140,50 C70,180 195,180 190,100\') with curves");
  
  // Test 2: Elliptical Arc > Relative Path
  // pathStr = 'M600,350 l 50,-25 a25,25 -30 0,1 50,-25 l 50,-25 a25,50 -30 0,1 50,-25 l 50,-25 a25,75 -30 0,1 50,-25 l 50,-25 a25,100 -30 0,1 50,-25 l 50,-25';
  // pPath = Sai.parsePathString(pathStr);
  // pAbsol = Sai.pathToAbsolute(pPath);
  // equals(pAbsol, 'M600,350L650,325A25,25,-30,0,1,700,300L750,275A25,50,-30,0,1,800,250L850,225A25,75,-30,0,1,900,200L950,175A25,100,-30,0,1,1000,150L1050,125', "Elliptical Arc > Relative Path to an absolute path");
});

test("Function: curveDim()", function() {
  var pathStr, pPath, pDim;
  
  // Test 1: curve
  pDim = Sai.curveDim(100, 140, 200, 130, 190, 40, 300, 140);
  same(pDim, {min: {x: 100, y: 93}, max: {x: 300, y: 140}}, "Curve Dimension: should be {min: {x: 100, y: 93}, max: {x: 300, y: 140}}");
});

test("Function: pathDimensions()", function() {
  var pathStr, pPath, pDim;
  
  // Test 1: Triangle
  pathStr = 'M50,10 l200,0 -100,200 z';
  pPath = Sai.parsePathString(pathStr);
  pDim = Sai.pathDimensions(pPath);
  same(pDim, {x: 50, y: 10, width: 200, height: 200}, "Triangle: dimensions are {x: 50, y: 10, width: 200, height: 200}");
  
  // Test 2: Abstract Path 
  // pathStr = 'M40,140 L40,100 10,100 C10,10 90,10 90,100 L60,100 60,140 M140,50 C70,180 195,180 190,100';
  // pPath = Sai.parsePathString(pathStr);
  // pDim = Sai.pathDimensions(pPath);
  // equals(pDim, 'M50,80L250,80L150,280Z', "Abstract Path: finding the dimensions of (\'M40,140 L40,100 10,100 C10,10 90,10 90,100 L60,100 60,140 M140,50 C70,180 195,180 190,100\')");
  
  
  
  // Test 2: Elliptical Arc > Relative Path
  // pathStr = 'M600,350 l 50,-25 a25,25 -30 0,1 50,-25 l 50,-25 a25,50 -30 0,1 50,-25 l 50,-25 a25,75 -30 0,1 50,-25 l 50,-25 a25,100 -30 0,1 50,-25 l 50,-25';
  // pPath = Sai.parsePathString(pathStr);
  // pAbsol = Sai.pathToAbsolute(pPath);
  // equals(pAbsol, 'M600,350L650,325A25,25,-30,0,1,700,300L750,275A25,50,-30,0,1,800,250L850,225A25,75,-30,0,1,900,200L950,175A25,100,-30,0,1,1000,150L1050,125', "Elliptical Arc > Relative Path to an absolute path");
});

test("Function: path2vml()", function() {
  var pathStr, pPath, pVml;
  
  // Test 1: Line
  pathStr = 'M10,10 L100,100';
  pPath = Sai.parsePathString(pathStr);
  // debugger;
  pVml = Sai.path2vml(pPath);
  same(pVml, "m 10,10 l 100,100 e", "Line: SVG(M10,10 L100,100) from pt (10,10) to (100,100)");
  
  // Test 2: Abstract Path 
  // pathStr = 'M40,140 L40,100 10,100 C10,10 90,10 90,100 L60,100 60,140 M140,50 C70,180 195,180 190,100';
  // pPath = Sai.parsePathString(pathStr);
  // pDim = Sai.pathDimensions(pPath);
  // equals(pDim, 'M50,80L250,80L150,280Z', "Abstract Path: finding the dimensions of (\'M40,140 L40,100 10,100 C10,10 90,10 90,100 L60,100 60,140 M140,50 C70,180 195,180 190,100\')");
  
  
  
  // Test 2: Elliptical Arc > Relative Path
  // pathStr = 'M600,350 l 50,-25 a25,25 -30 0,1 50,-25 l 50,-25 a25,50 -30 0,1 50,-25 l 50,-25 a25,75 -30 0,1 50,-25 l 50,-25 a25,100 -30 0,1 50,-25 l 50,-25';
  // pPath = Sai.parsePathString(pathStr);
  // pAbsol = Sai.pathToAbsolute(pPath);
  // equals(pAbsol, 'M600,350L650,325A25,25,-30,0,1,700,300L750,275A25,50,-30,0,1,800,250L850,225A25,75,-30,0,1,900,200L950,175A25,100,-30,0,1,1000,150L1050,125', "Elliptical Arc > Relative Path to an absolute path");
});




