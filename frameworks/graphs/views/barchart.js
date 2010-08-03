// ..........................................................
// A basic Line chart
// 
/*globals Sai */
sc_require('views/axischart');

Sai.BarChartView = Sai.AxisChartView.extend({
  
  // ..........................................................
  // Properties
  
  // @param data: This is an array of arrays of pairs for the data points
  // @example: [[1,2,3], [4,5,6], [7,8,9]]
  // Bar #1: "1, 2, 3"
  // Bar #2: "4, 5, 6"
  data: null,
  
  // @param: dataAttrs - Hash of styling parameters
  // @example: {stacked: true, colors: ['red' , 'blue', 'green']}
  dataAttrs: null,
  
  // @param grid: show a grid for all the points
  grid: null,
  
  // @param yaxis: {color: 'black', step: 10}
  yaxis: null,
  
  // @param xaxis: {color: 'black', labels: ['Morning', 'Afternoon', 'Evening']}
  xaxis: null,
  
  renderCanvas: function(canvas, firstTime) {
    var grid = this.get('grid'),
        d = this.get('data'),
        dAttrs = this.get('dataAttrs') || {stacked: NO, colors: 'black'},
        f = this.get('frame'), axis;
    if (firstTime) {
      axis = this._makeAxi(f, canvas, d, dAttrs.stacked) || [];
      if (dAttrs.stacked){
        this._processDataAsStackedBarGraph(f, canvas, d, dAttrs, axis[0], axis[1]);
      }
      else {
        this._processDataAsRegularBarGraph(f, canvas, d, dAttrs, axis[0], axis[1]);
      }
    }
  },
  
  _processDataAsRegularBarGraph: function(f, canvas, d, dAttrs, xaxis, yaxis){
    // TODO: [EG] Regular Side by Side bar graph
    var x, xBase, bWidth = dAttrs.barWidth || 16, xSpace = xaxis.space,
        xOffset = (xSpace*xaxis.offset), y, 
        bHeight, bSpacing = dAttrs.barSpacing || 0,
        colors = dAttrs.color || dAttrs.colors || 'blue';
    
    xBase = xaxis.coordMin;
    d.forEach( function(series, i){
      xBase += xSpace;
      x = xBase - xOffset;
      if (SC.typeOf(series) === SC.T_ARRAY){
        x -= (xaxis.count*bWidth) - ((xaxis.count-1)*bSpacing);
        series.forEach( function(bar, j){
          bHeight = yaxis.coordScale*bar;
          y = yaxis.coordMin-bHeight;
          canvas.rectangle(~~x, ~~y, bWidth, ~~bHeight, 0, {stroke: colors[j], fill: colors[j]}, 'bar-%@-%@'.fmt(i,j));
          x += bWidth+bSpacing;
        });
      }
      else {
        x -= (bWidth/2); 
        bHeight = yaxis.coordScale*series;
        y = yaxis.coordMin-bHeight;
        canvas.rectangle(~~x, ~~y, bWidth, ~~bHeight, 0, {stroke: colors, fill: colors}, 'bar-%@'.fmt(i));
      }
    });
  },
  
  _processDataAsStackedBarGraph: function(f, canvas, d, dAttrs, xaxis, yaxis){
    // TODO: [EG] Stacked bar graph
  },
  
  _makeAxi: function(f, canvas, d, isStacked){
    var axis, path, buffer = 0.1, tCount, space, barGroups, tmp,
        xa = this.get('xaxis') || {},
        startX = f.width*buffer,
        endX = f.width*(1.0 - buffer),
        // Y coordinate stuff
        ya = this.get('yaxis') || {}, yScale,
        startY = f.height*(1.0 - buffer),
        endY = f.height*buffer;
    
    barGroups = this._calculateBarGroups(d, isStacked);
    // X Axis
    if (xa){
      // Calculate the coordinate system
      xa.coordMin = startX;
      xa.coordMax = endX;
      tmp = (endX - startX);
      xa.space =  ~~(tmp / barGroups[0]);
      xa.offset = 0.5;
      xa.count = barGroups[0];
      axis = this.makeAxis(startX, startY, endX, startY, xa, {direction: 'x', len: 5, count: barGroups[0], space: xa.space, offset: xa.offset});
      canvas.path(axis[0], axis[1], 'x-axis');
    }
    // Y Axis
    if (ya){
      ya.coordMin = startY-(xa.weight || 1);
      ya.coordMax = endY;
      ya.coordScale = (startY - endY) / barGroups[1];
      tCount = ~~(barGroups[1] / ya.step);
      space = (startY - endY)/tCount;
      axis = this.makeAxis(startX, startY, startX, endY, ya, {direction: 'y', len: 5, count: tCount, space: space});
      canvas.path(axis[0], axis[1], 'y-axis');
    }
    
    return [xa, ya];
  },
  
  _calculateBarGroups: function(d, isStacked){
    var ret = [0, 0, d], mmax = Math.max,
        tmpMax = 0, tmpLen = 0; 
    d = d || [];
    if(isStacked){
      // TODO: [EG] find out the groups and height for bar graph data...
    }
    else {
      if (SC.typeOf(d[0]) === SC.T_ARRAY){
        // Find the Max Value and total group number
        d.forEach( function(data){
          tmpLen = data.length || 0;
          ret[0] = ret[0] < tmpLen ? tmpLen : ret[0];
          tmpMax = mmax.apply(0, data);
          ret[1] = ret[1] < tmpMax ? tmpMax : ret[1];
        });
      }
      else {
        ret[0] = d.length || 0;
        ret[1] = mmax.apply(0, d) || 0;
      }
    }
    // Return: [total groups, max height, morphed data]
    return ret;
  },
    
  mouseDown: function(evt) {
    console.log(evt.target);
  }
  
});