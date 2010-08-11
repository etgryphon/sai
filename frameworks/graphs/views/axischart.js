// ..........................................................
// A foundation chart that has axis
// 
/*globals Sai */

Sai.AxisChartView = Sai.CanvasView.extend({

  makeAxis: function(canvas, sx, sy, ex, ey, axisAttrs, ticks){
    var path, i, len, dir, tLen, tickPts = {}, currTick,
        space, tp, tOff, tickFunc, rounder = this.rounder, step;
    
    axisAttrs = axisAttrs || {};
    step = axisAttrs.step || 1;
    // Draw the line to the end
    path = 'M%@1,%@2L%@3,%@4M%@1,%@2'.fmt(rounder(sx), rounder(sy), rounder(ex), rounder(ey));
    if (ticks){
      dir = ticks.direction;
      tLen = ticks.len;
      space = ticks.space;
      
      // Find the right tick intremental function based off of the axis (X or Y)
      tickFunc = dir === 'x' ? function(x,y,sp){ return [x, (y+tLen), (x+sp), y]; } : function(x,y,sp){ return [(x-tLen), y, x, (y-sp)]; };
      
      // Some times you want to ofset the start of the ticks to center
      tOff = ticks.offset || 0;
      if (tOff > 0 && tOff < 1){
        tp = tickFunc(sx,sy,space*tOff);
        sx = tp[2];
        sy = tp[3];
        path += 'M%@,%@'.fmt(rounder(sx), rounder(sy));
      }
      
      // Draw all the ticks
      for(i = 0, len = ticks.count; i < len; i++){
        tp = tickFunc(sx,sy,space);
        sx = tp[2];
        sy = tp[3];
        currTick = {x: rounder(tp[0]), y: rounder(tp[1])};
        path += 'L%@,%@M%@,%@'.fmt(currTick.x, currTick.y, rounder(tp[2]), rounder(tp[3]));
        tickPts[i*step] = currTick;
      }
    }
    //console.log('Axis Path: '+path);
    
    // Do Labels
    if (!SC.none(axisAttrs.labels)) this.makeLabels(canvas, tickPts, axisAttrs, ticks);
    
    canvas.path(path, {stroke: axisAttrs.color || 'black', strokeWidth: axisAttrs.weight || 1}, '%@-axis'.fmt(dir));
  },
  
  makeLabels: function(canvas, tickPts, axisAttrs, ticks){
    var dir, labels, l, lAttrs, tick, aa, t, labelPosFunc,
        lWidth, lHeight, lOff;
    
    aa = axisAttrs || {};
    dir = ticks ? ticks.direction || 'x' : 'x';
    labels = aa.labels || [];
    lAttrs = aa.labelAttrs || {};
    lWidth = lAttrs.width || ticks.space*0.9 || 50;
    lHeight = lAttrs.height || 15;
    // TODO: [EG] HATE THIS...need to find out how to calulate the middle point of a text
    lOff = lAttrs.offset || 0;
    
    // Create the label positioning function
    if (dir === 'x'){
      labelPosFunc = function(t, label){ 
        var x, y;
        x = +t.x - (lWidth/2);
        y = +t.y + lOff;
        canvas.text(x, y, lWidth, lHeight, label, {fill: aa.labelColor || aa.color || 'black', textAnchor: 'center', fontSize: lAttrs.fontSize}, 'label-%@'.fmt(label));
        // canvas.rectangle(x, y, lWidth, lHeight, 0, {fill: aa.labelColor || aa.color || 'black', textAnchor: 'center', fontSize: lAttrs.fontSize}, 'label-%@'.fmt(label));
      };
    }
    else{
      labelPosFunc = function(t, label){ 
        var x, y;
        x = t.x - lWidth;
        y = t.y - (lHeight/2) + lOff;
        canvas.text(x, y, lWidth, lHeight, label, {fill: aa.labelColor || aa.color || 'black', textAnchor: 'right', fontSize: lAttrs.fontSize}, 'label-%@'.fmt(label));
        // canvas.rectangle(x, y, lWidth, lHeight, 0, {fill: aa.labelColor || aa.color || 'black', textAnchor: 'right', fontSize: lAttrs.fontSize}, 'label-%@'.fmt(label));
      };
    }
      
    if (SC.typeOf(labels) === SC.T_HASH){ 
      // TODO: [EG] make file line points
    }
    else if (SC.typeOf(labels) === SC.T_ARRAY){
      for (t in tickPts){
        tick = tickPts[t];
        l = labels[t];
        if (!SC.none(tick) && l) labelPosFunc(tick, l);
      }
    }
  },
  
  makeGrid: function(){
    // TODO: [EG] make the grid
  },
  
  rounder: function(x){
    if (x > (~~x+0.00051)) return x.toFixed(3);
    return x.toFixed(0);
  }
  
});