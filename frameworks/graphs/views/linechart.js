// ..........................................................
// A basic Line chart
// 
/*globals Sai */
sc_require('views/axischart');

Sai.LineChartView = Sai.AxisChartView.extend({
  
  // ..........................................................
  // Properties
  
  // @param data: This is an array of arrays of pairs for the data points
  // @example: [[[1,2], [3,4]], [[5,6], [7,8]]]
  // Line #1: "x=1,y=2", "x=3,y=4"
  // Line #2: "x=5,y=6", "x=7,y=8"
  data: null,
  
  // @param: dataAttrs - Array of styling parameters
  // @example: [{color: 'red', weight: 1}, {color: 'green', weight: 2}]
  dataAttrs: null,
  
  // @param grid: show a grid for all the points
  grid: null,
  
  // @param yaxis: {min: 10, max: 100, step: 10}
  yaxis: null,
  
  // @param xaxis: {min: 10, max: 100, step: 10, weight: 1, color: 'blue'}
  xaxis: null,
  
  displayProperties: 'data dataAttrs grid yaxis xaxis'.w(),
  
  renderCanvas: function(canvas, firstTime) {
    var grid = this.get('grid'),
        f = this.get('frame'), axis;
    if (!firstTime) canvas.clear();  
    
    axis = this._makeAxi(f, canvas);
    this._processData(f, canvas, axis[0], axis[1]);
  },
  
  _processData: function(f, canvas, xaxis, yaxis){
    var d = this.get('data') || [],
        dAttrs = this.get('dataAttrs'), attrs,
        xScale = xaxis.coordScale, yScale = yaxis.coordScale, path,
        scaledX, scaledY, scaled, scaledData = [],
        xmin = xaxis.coordMin, xmax = xaxis.coordMax,
        ymin = yaxis.coordMin, ymax = yaxis.coordMax;
        
    // Calculate the scaling factor
    d.forEach( function(line, i){
      scaled = [];
      attrs = dAttrs[i] || {color: 'red', weight: 1};
      line.forEach( function(point, j){
        scaledX = xmin + (point[0]*xScale);
        scaledY = ymin - (point[1]*yScale);
        if (j > 0){
          path += '%@,%@ '.fmt(scaledX, scaledY);
        } else {
          path = 'M%@,%@L'.fmt(scaledX, scaledY);
        }
      });
      console.log('Line Path: ' + path);
      canvas.path(path, attrs, 'line-%@'.fmt(i));
    });   
  },
  
  _makeAxi: function(f, canvas){
    var axis, path, buffer = 0.1, tCount, space,
        xa = this.get('xaxis') || {},
        startX = f.width*buffer,
        endX = f.width*(1.0 - buffer),
        // Y coordinate stuff
        ya = this.get('yaxis') || {}, yScale,
        startY = f.height*(1.0 - buffer),
        endY = f.height*buffer;
    // X Axis
    if (xa){
      // Calculate the coordinate system
      xa.coordMin = startX;
      xa.coordMax = endX;
      xa.coordScale = (endX - startX) / (xa.max - xa.min);
      tCount = ~~((xa.max - xa.min) / xa.step);
      space = (endX - startX)/tCount;
      this.makeAxis(canvas, startX, startY, endX, startY, xa, {direction: 'x', len: 5, count: tCount+1, space: space});
    }
    // Y Axis
    if (ya){
      ya.coordMin = startY;
      ya.coordMax = endY;
      ya.coordScale = (startY - endY) / (ya.max - ya.min);
      tCount = ~~((ya.max - ya.min) / ya.step);
      space = (startY - endY)/tCount;
      this.makeAxis(canvas, startX, startY, startX, endY, ya, {direction: 'y', len: 5, count: tCount+1, space: space});
    }
    
    return [xa, ya];
  },
  
  // _makeAxis: function(sx, sy, ex, ey, axisAttrs, ticks){
  //   var path, i, len, dir, tLen, space, tp, tickFunc;
  //   axisAttrs = axisAttrs || {};
  //   // Draw the line to the end
  //   path = 'M%@,%@L%@,%@'.fmt(sx, sy, ex, ey);
  //   if (ticks){
  //     dir = ticks.direction;
  //     tLen = ticks.len;
  //     space = ticks.space;
  //     tickFunc = dir === 'x' ? function(x,y){ return [x, (y+tLen), (x-space), y]; } : function(x, y){ return [(x-tLen), y, x, (y+space)]; };
  //     for(i = 0, len = ticks.count; i < len; i++){
  //       tp = tickFunc(ex,ey);
  //       ex = tp[2];
  //       ey = tp[3];
  //       path += 'L%@,%@M%@,%@'.fmt(tp[0], tp[1], tp[2], tp[3]);
  //     }
  //   }
  //   console.log('Axis Path: '+path);
  //   return [path, {stroke: axisAttrs.color || 'black', strokeWidth: axisAttrs.weight || 1}];
  // },
    
  mouseDown: function(evt) {
    console.log(evt.target);
  }
  
});

