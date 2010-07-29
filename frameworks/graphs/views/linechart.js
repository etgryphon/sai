// ..........................................................
// A basic Line chart
// 
/*globals Sai */

Sai.LineChartView = Sai.CanvasView.extend({
  
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
  
  renderCanvas: function(canvas, firstTime) {
    var grid = this.get('grid'),
        f = this.get('frame'), axis;
    if (firstTime) {
      axis = this._makeAxi(f, canvas);
      this._processData(f, canvas, axis[0], axis[1]);
    }
  },
  
  _processData: function(f, canvas, xaxis, yaxis){
    var d = this.get('data') || [],
        dAttrs = this.get('dataAttrs'), attrs,
        xScale, yScale,
        scaledX, scaledY, scaled, scaledData = [],
        xmin = xaxis.min, ymin = yaxis.min, path;
        
        
    // Calculate the scaling factor
    //debugger;
    scaledData = d;
    // xScale = (xaxis.max - xmin)/xaxis.step; 
    // yScale = (yaxis.max - ymin)/yaxis.step; 
    // d.forEach( function(line){
    //   scaled = [];
    //   line.forEach( function(point){
    //     scaledX = (point[0]-xmin)/xScale;
    //     scaledY = (point[1]-ymin)/yScale;
    //     scaled.push([scaledX, scaledY]);
    //   });
    //   scaledData.push(scaled);
    // });
    
    // Now, actually draw the lines
    scaledData.forEach( function(line, i){
      attrs = dAttrs[i] || {color: 'red', weight: 1};
      line.forEach( function(point, j){
        if (j > 0){
          path += '%@,%@ '.fmt(point[0], point[1]);
        } else {
          path = 'M%@,%@L'.fmt(point[0], point[1]);
        }
      });
      console.log('Line Path: ' + path);
      
      canvas.path(path, attrs, 'line-%@'.fmt(i));
      //canvas.path(path, {stroke: 'red', strokeWidth: 1}, 'line-%@'.fmt(i));
    });
  },
  
  _makeAxi: function(f, canvas){
    var xa = this.get('xaxis') || {},
        ya = this.get('yaxis') || {}, 
        axis, path, buffer = 0.1,
        startX = f.width*buffer,
        startY = f.height*(1.0 - buffer);
    // X Axis
    if (xa){
      axis = this._makeXAxis(f, xa, startX, startY, buffer);
      canvas.path(axis[0], axis[1], 'x-axis');
    }
    // Y Axis
    if (ya){
      axis = this._makeYAxis(f, ya, startX, startY, buffer);
      canvas.path(axis[0], axis[1], 'y-axis');
    }
    
    return [xa, ya];
  },
  
  _makeXAxis: function(f, xaxis, startX, startY, buffer){
    var path = '', endX;
    
    xaxis = xaxis || {};
    endX = f.width*(1.0 - buffer);
    
    // Draw the line to the end
    path = 'M%@1,%@2L%@3,%@2'.fmt(startX, startY, endX);
    console.log('X-Axis Path: %@'.fmt(path));
    return [path, {stroke: xaxis.color || 'black', strokeWidth: xaxis.weight || 1}];
  },
  
  _makeYAxis: function(f, yaxis, startX, startY, buffer){
    var path = '', endY;
    
    yaxis = yaxis || {};
    endY = f.height*buffer;
    
    // Draw the line to the end
    path = 'M%@1,%@2L%@1,%@3'.fmt(startX, startY, endY);
    console.log('Y-Axis Path: %@'.fmt(path));
    return [path, {stroke: yaxis.color || 'black', strokeWidth: yaxis.weight || 1}];
  },
  
  
  
  mouseDown: function(evt) {
    console.log(evt.target);
  }
  
});