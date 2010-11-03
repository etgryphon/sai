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

  dataArray: function() {
    var ret = [],
        data = this.get('data');
    function walkArray(arr) {
      if (arr && arr.isEnumerable) {
        arr.forEach(function(item) {
          if (item && item.isEnumerable) {
            walkArray(item);
          } else {
            ret.push(item);
          }
        });
      }
    }
    walkArray(data);
    return ret;
  }.property('data').cacheable(),

  /**
   *
   * outOf - Will scale your restulds to this. eg 100, if you want to show your results as a percentage.
   *
   * @example: {stacked: true, horizontal: true, colors: ['red' , 'blue', 'green']}
   * @param: dataAttrs - Hash of styling parameters
   */
  dataAttrs: null,
  
  // @param grid: show a grid for all the points
  grid: null,
  
  // @param yaxis: {color: 'black', step: 10}
  yaxis: null,
  
  // @param xaxis: {color: 'black', labels: ['Morning', 'Afternoon', 'Evening']}
  xaxis: null,
  
  displayProperties: 'data dataAttrs grid yaxis xaxis'.w(),
  
  renderCanvas: function(canvas, firstTime) {
    var grid = this.get('grid'), barFunc,
        d = this.get('data') || [],
        dAttrs = this.get('dataAttrs') || {stacked: NO, horizontal: NO, colors: 'black'},
        f = this.get('frame'), axis;
    if(d.length === 0) return;

    if (!firstTime) canvas.clear();  
    axis = this._makeAxi(f, canvas, d, dAttrs.stacked, dAttrs.horizontal) || [];
    if (dAttrs.stacked){
      barFunc = dAttrs.horizontal ? this._processDataAsHStackedBarGraph : this._processDataAsVStackedBarGraph;
      barFunc(f, canvas, d, dAttrs, axis[0], axis[1]);
    }
    else {
      barFunc = dAttrs.horizontal ? this._processDataAsHRegularBarGraph : this._processDataAsVRegularBarGraph;
      barFunc(f, canvas, d, dAttrs, axis[0], axis[1]);
    }
  },
  
  _processDataAsVRegularBarGraph: function(f, canvas, d, dAttrs, xaxis, yaxis){
    var x, xBase, bWidth = dAttrs.barWidth || 16, xSpace = xaxis.space,
        xOffset = (xSpace*xaxis.offset), y, 
        bHeight, bSpacing = dAttrs.barSpacing || 0,
        colors = dAttrs.color || dAttrs.colors || 'blue',
        gmn = xaxis.maxGroupNum;
    
    xBase = xaxis.coordMin;
    d.forEach( function(series, i){
      xBase += xSpace;
      x = xBase - xOffset;
      if (SC.typeOf(series) === SC.T_ARRAY){
        x -= ((gmn*bWidth) + ((gmn-1)*bSpacing))/2;
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
  
  _processDataAsHRegularBarGraph: function(f, canvas, d, dAttrs, xaxis, yaxis){
    var y, yBase, bHeight = dAttrs.barWidth || 16, ySpace = yaxis.space,
        yOffset = (ySpace*yaxis.offset), x, 
        bWidth, bSpacing = dAttrs.barSpacing || 0,
        colors = dAttrs.color || dAttrs.colors || 'blue',
        gmn = yaxis.maxGroupNum, gmnStart = ((gmn*bHeight) + ((gmn-1)*bSpacing))/2;
    yBase = yaxis.coordMin;
    x = xaxis.coordMin;
    d.forEach( function(series, i){
      yBase -= ySpace;
      y = yBase + yOffset;
      if (SC.typeOf(series) === SC.T_ARRAY){
        y -= gmnStart;
        series.forEach( function(bar, j){
          bWidth = xaxis.coordScale*bar;
          canvas.rectangle(x, ~~y, bWidth, bHeight, 0, {stroke: colors[j], fill: colors[j]}, 'bar-%@-%@'.fmt(i,j));
          y += bHeight+bSpacing;
        });
      }
      else {
        y -= (bHeight/2); 
        bWidth = xaxis.coordScale*series;
        canvas.rectangle(x, ~~y, ~~bWidth, bHeight, 0, {stroke: colors, fill: colors}, 'bar-%@'.fmt(i));
      }
    });
  },
  
  _processDataAsVStackedBarGraph: function(f, canvas, d, dAttrs, xaxis, yaxis){
    // TODO: [EG] Stacked bar graph
    var x, xBase, bWidth = dAttrs.barWidth || 16, xSpace = xaxis.space,
        xOffset = (xSpace*xaxis.offset), y, 
        bHeight, bSpacing = dAttrs.barSpacing || 0,
        colors = dAttrs.color || dAttrs.colors || 'blue';
    
    xBase = xaxis.coordMin;
    d.forEach( function(series, i){
      xBase += xSpace;
      x = xBase - xOffset;
      x -= (bWidth/2); 
      if (SC.typeOf(series) === SC.T_ARRAY){
        y = yaxis.coordMin;
        series.forEach( function(bar, j){
          bHeight = yaxis.coordScale*bar;
          y = y-bHeight;
          canvas.rectangle(~~x, ~~y, bWidth, ~~bHeight, 0, {stroke: colors[j], fill: colors[j]}, 'bar-%@-%@'.fmt(i,j));
        });
      }
      else {
        bHeight = yaxis.coordScale*series;
        y = yaxis.coordMin-bHeight;
        canvas.rectangle(~~x, ~~y, bWidth, ~~bHeight, 0, {stroke: colors, fill: colors}, 'bar-%@'.fmt(i));
      }
    });
  },
  
  _processDataAsHStackedBarGraph: function(f, canvas, d, dAttrs, xaxis, yaxis){
    // TODO: [EG] Stacked bar graph
    var y, yBase, bHeight = dAttrs.barWidth || 16, ySpace = yaxis.space,
        yOffset = (ySpace*yaxis.offset), x, 
        bWidth, bSpacing = dAttrs.barSpacing || 0,
        colors = dAttrs.color || dAttrs.colors || 'blue';
    
    yBase = yaxis.coordMin;
    d.forEach( function(series, i){
      yBase -= ySpace;
      y = yBase + yOffset;
      y -= (bHeight/2); 
      if (SC.typeOf(series) === SC.T_ARRAY){
        x = xaxis.coordMin;
        series.forEach( function(bar, j){
          bWidth = xaxis.coordScale*bar;
          canvas.rectangle(~~x, ~~y, ~~bWidth, bHeight, 0, {stroke: colors[j], fill: colors[j]}, 'bar-%@-%@'.fmt(i,j));
          x += bWidth;
        });
      }
      else {
        bHeight = xaxis.coordScale*series;
        x = xaxis.coordMin-bHeight;
        canvas.rectangle(~~x, ~~y, bWidth, ~~bHeight, 0, {stroke: colors, fill: colors}, 'bar-%@'.fmt(i));
      }
    });
  },
  
  _makeAxi: function(f, canvas, d, isStacked, isHorizontal){
    var axis, path, tCount, space, offset, barGroups, tmp, aa, xt, yt,
        xa = this.get('xaxis') || {},
        ya = this.get('yaxis') || {}, yScale,
        xBuffer = xa.buffer || 0.1,
        yBuffer = ya.buffer || 0.1,
        startX = f.width*yBuffer,
        endX = f.width*0.95,
        // Y coordinate stuff
        startY = f.height*(1.0 - xBuffer),
        endY = f.height*0.05, dLen = d.length || 0;
        
    
    barGroups = this._calculateBarGroups(d, isStacked);
    // X Axis
    if (xa){
      // Calculate the coordinate system
      xa.coordMin = startX;
      xa.coordMax = endX;
      aa = isHorizontal ? this._calcForLabelAlignment(xa, startX, endX, barGroups) : this._calcForBarAlignment(dLen, xa, startX, endX, barGroups.maxGroupNum);
      xa = aa[0]; tCount = aa[1];
      if (SC.none(xa.hidden) || !xa.hidden) this.makeAxis(canvas, startX, startY, endX, startY, xa, {direction: 'x', len: 5, start: barGroups.minHeight, count: tCount, space: xa.space, offset: xa.offset});
    }
    // Y Axis
    if (ya){
      ya.coordMin = startY;
      ya.coordMax = endY;
      aa = isHorizontal ? this._calcForBarAlignment(dLen, ya, endY, startY, barGroups.maxGroupNum) : this._calcForLabelAlignment(ya, endY, startY, barGroups);
      ya = aa[0]; tCount = aa[1];
      if (SC.none(ya.hidden) || !ya.hidden) this.makeAxis(canvas, startX, startY, startX, endY, ya, {direction: 'y', len: 5, start: barGroups.minHeight, count: tCount, space: ya.space, offset: ya.offset});
    }
    
    return [xa, ya];
  },
  
  _calcForBarAlignment: function(len, axis, start, end, maxGroupNum){
    var tCount, tmp = (end - start);
    axis = axis || {};
  
    axis.space =  tmp / len;
    axis.offset = 0.5;
    axis.maxGroupNum = maxGroupNum;
    tCount = len;
    
    return [axis, tCount];
  },
  
  _calcForLabelAlignment: function(axis, start, end, barGroups){
    var tCount, hasStepIncrement, hasStepCount,
        maxHeight = barGroups.maxHeight;
    axis = axis || {};
    hasStepIncrement = !SC.none(axis.step);
    hasStepCount = !SC.none(axis.steps);

    axis.coordScale = (end - start) / maxHeight;
    
    if(!hasStepIncrement && !hasStepCount){ // use the auto scale steps
      tCount = ~~((barGroups.maxHeight - barGroups.minHeight)/barGroups.step);
      axis.step = barGroups.step;
    } else if(hasStepCount){ // use a total count of X
      tCount = axis.steps;
      axis.step = ~~((barGroups.maxHeight - barGroups.minHeight)/tCount);
    } else { // Use step increments of X
      tCount = ~~((barGroups.maxHeight - barGroups.minHeight) / axis.step);
    }
    
    axis.space = (end - start)/tCount;
    tCount += 1; // add the last tick to the line
    axis.offset = 0;
    
    // Return modified Axis and tick count
    return [axis, tCount];
  },
  
  _calculateBarGroups: function(d, isStacked){
    var ret = {maxGroupNum: 0, maxHeight: 0, minHeight: 0, step: 0}, mmax = Math.max,
        tmpMax = 0, tmpLen = 0, totalHeights = [],
        outOf = this.get('dataAttrs').outOf, autoScale;
    d = d || [];
    if(isStacked){
      ret.maxGroupNum = 1;
      if (SC.typeOf(d[0]) === SC.T_ARRAY){
        // Find the Max Value and total group number
        d.forEach( function(data){
          tmpMax = 0;
          data.forEach( function(x){ tmpMax += x; });
          totalHeights.push(tmpMax);
        });
        if (outOf) { totalHeights.push(0) }
        autoScale = Sai.autoscale(totalHeights);
        console.log("Stacked Autoscale", autoScale);
      }
      else {
        autoScale = Sai.autoscale(SC.clone(d).push(0));
      }
    }
    else {
      if (SC.typeOf(d[0]) === SC.T_ARRAY){
        // Find the Max Value and total group number
        d.forEach( function(data){
          tmpLen = data.length || 0;
          ret.maxGroupNum = ret.maxGroupNum < tmpLen ? tmpLen : ret.maxGroupNum;
          totalHeights.pushObjects(data);
        });
        autoScale = Sai.autoscale(totalHeights);
      }
      else {
        autoScale = Sai.autoscale(d);
        ret.maxGroupNum = d.length || 0;
      }
    }

    ret.maxHeight = autoScale.max;
    ret.minHeight = autoScale.min;
    ret.step      = autoScale.step;

    return ret;
  }
});

