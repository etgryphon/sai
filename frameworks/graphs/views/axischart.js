// ..........................................................
// A foundation chart that has axis
// 
/*globals Sai */

Sai.AxisChartView = Sai.CanvasView.extend({

  makeAxis: function(sx, sy, ex, ey, axisAttrs, ticks){
    var path, i, len, dir, tLen, space, tp, tickFunc;
    axisAttrs = axisAttrs || {};
    // Draw the line to the end
    path = 'M%@,%@L%@,%@'.fmt(sx, sy, ex, ey);
    if (ticks){
      dir = ticks.direction;
      tLen = ticks.len;
      space = ticks.space;
      // Find the right tick intremental function based off of the axis (X or Y)
      tickFunc = dir === 'x' ? function(x,y,space){ return [x, (y+tLen), (x-space), y]; } : function(x, y){ return [(x-tLen), y, x, (y+space)]; };
      
      // Some times you want to skip the last tick on the axis
      if (ticks.offset < 1){
        tp = tickFunc(ex,ey,space*ticks.offset);
        ex = tp[2];
        ey = tp[3];
        path += 'M%@,%@'.fmt(ex, ey);
      }
      
      // Draw all the ticks
      for(i = 0, len = ticks.count; i < len; i++){
        tp = tickFunc(ex,ey,space);
        ex = tp[2];
        ey = tp[3];
        path += 'L%@,%@M%@,%@'.fmt(tp[0], tp[1], tp[2], tp[3]);
      }
    }
    console.log('Axis Path: '+path);
    return [path, {stroke: axisAttrs.color || 'black', strokeWidth: axisAttrs.weight || 1}];
  }
  
});