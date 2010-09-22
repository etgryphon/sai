// ..........................................................
// A basic Line chart
//
/*globals Sai */

Sai.SHIM = {stroke: "none", fill: "#000", "fill-opacity": 0} ;

Sai.PieChartView = Sai.CanvasView.extend(
  /* Sai.BarChartView.prototype */{

  // ..........................................................
  // Properties

  // @param data: This is an array of pairs for the data points
  // @example: [1,2,3,4,5,6]
  // Pie #1: "1, 2, 3, 4, 5, 6"
  data: null,

  // @param: dataAttrs - Hash of styling parameters
  // @example: dataAttrs: { colors: ['green', 'blue', '#F8A377'], radius: 100, padding: 20, values: {font: '9', pos: 'middle', color: 'black'}},
  dataAttrs: null,

  // @param legend: {color: 'black', buffer: 0.15, pos: 'right',
  //  labelAttrs: {offset: -5, fontSize: '9'},
  //  labels: ['Early', 'Morning', 'Afternoon', 'Evening', 'Night']}
  legend: null,

  // Re-Render if these change
  displayProperties: 'data dataAttrs grid yaxis xaxis'.w(),

  renderCanvas: function(canvas, firstTime) {
    var d = this.get('data') || [],
        dAttrs = this.get('dataAttrs') || {},
        f = this.get('frame'),
        legend = this.get('legend'),
        vals = dAttrs.values;
    if (d.length === 0) return;
    dAttrs.values = (SC.typeOf(vals) === SC.T_BOOL) ? {fontSize: '9', pos: 'middle', color: 'black', bColor: 'lightgray'} : (SC.typeOf(vals) === SC.T_HASH) ? vals : null;
    
    if (!firstTime) canvas.clear(); // Make sure we are stating from scratch
    this._processPieData(f, canvas, d, dAttrs, legend);
  },

  _processPieData: function(frame, canvas, values, atts, legend) {
    atts = atts || {};
    var r = atts.radius || 100, l = this.get('layout'),
        len = values.length, series = [], sectors = [],
        angle = 0, total = 0, others = 0, cut = 9,
        defcut = true, colors  = Sai.get('colors'),
        showValues = atts.values, padding = atts.padding || 5,
        l_pos   = (legend && legend.pos) ? legend.pos : "east",
        // Calculate the positioning of the Chart.
        xy      = {
          "north": {
            x: ~~(l.width / 2),
            y: l.height - (r + padding)
          },
          "south": {
            x: ~~(l.width / 2),
            y: r + (padding)
          },
          "east": {
            x: r + padding,
            y: ~~(l.height / 2)
          },
          "west": {
            x: l.width - (r + padding),
            y: ~~(l.height / 2)
          }
        },
        // Calculate the positioning of the legend.
        lxy     = {
          "north": {
            x: ~~(l.width / 2),
            y: l.height - (r + padding)
          },
          "south": {
            x: ~~(l.width / 2),
            y: r + (padding)
          },
          "east": {
            x: xy.east.x * 2,
            y: xy.east.y,
            w: l.width - padding - xy.east.x * 2
          },
          "west": {
            x: padding,
            y: xy.west.y,
            w: xy.west.x - padding
          }
        },
        cx      = atts.x || xy[l_pos].x,
        cy      = atts.y || xy[l_pos].y,
        lx      = legend.x || lxy[l_pos].x,
        ly      = legend.y || lxy[l_pos].y,
        lw      = legend.w || lxy[l_pos].w;

    // Calculate legend
    var color = function(idx) {
      return atts.colors && atts.colors[idx] || colors[idx] || "#666";
    };

    var _legend = function (labels, otherslabel, mark, dir) {
      var lineHeight = 18,
          y = ly - (len * lineHeight)/2,
          h = y + 10,
          lh = h, w, stroke,
          label, lWidth, lHeight, xl, yl,
          t, s, v, r, middle, value, col;
      labels = labels || [];
      dir = (dir && dir.toLowerCase && dir.toLowerCase()) || "east";

      for (var i = 0; i < len; i++) {
        label = labels[i] || values[i].value;

        // If we've been asked to add the value hovering over the pie slices, do so.
        if (showValues) {
          middle = sectors[i].middle;
          value = values[i].value.toString();
          w = value.length * 7;
          
          // FIXME: [EG GD] This is only temp until I add background color to text fields
          col = showValues.bcolor || 'lightgray';
          stroke = showValues.bStroke || 'gray';
          xl = middle.x - (w+8)/2+2; // <= FIXME: [EG GD] Why is this like this
          yl = middle.y - 9; // <= FIXME: [EG GD] Why is this like this
          lWidth = 18; // <= FIXME: [EG GD] Why is this like this
          lHeight = w+8;
          canvas.rectangle(xl, yl, lWidth, lHeight, 0, {fill: col, stroke: stroke}, 'label-back-%@'.fmt(i));
          
          // Calculate all the postions of the text.
          col = showValues.color || 'black';
          stroke = showValues.stroke || col;
          xl = middle.x - (w/2);
          yl = middle.y - 5;
          lWidth = value.length * 6;
          lHeight = 10;
          canvas.text(xl, yl, lWidth, lHeight, value, {fill: col, stroke: stroke, textAnchor: 'center', fontSize: showValues.fontSize, radius: 10}, 'label-text-%@'.fmt(i));
        }
        // now add the legend if told to do so.
        if (legend) {
          s = Sai.Rectangle.create({
            x: lx,
            y: lh,
            width: 10,
            height: 10,
            fill: color(i)
          });
          t = Sai.Text.create({
            x: 14+lx,
            y: lh,
            width: lw,
            height: 10,
            text: label,
            fill: 'black' // text color
          });

          s = canvas.element(s,"legend-mark-%@".fmt(i));
          t = canvas.element(t,"legend-text-%@".fmt(i));
          lh += lineHeight;
        }
      }

    } ;
    
    function sector(cx, cy, r, startAngle, endAngle, fill) {
      var rad = Math.PI / 180,
        x1 = cx + r * Math.cos(-startAngle * rad),
        x2 = cx + r * Math.cos(-endAngle * rad),
        xm = cx + r / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
        y1 = cy + r * Math.sin(-startAngle * rad),
        y2 = cy + r * Math.sin(-endAngle * rad),
        ym = cy + r / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad),
        res = ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(Math.abs(endAngle - startAngle) > 180), 1, x2, y2, "z"];
      res.middle = {x: xm, y: ym};
      return res;
    }

    var returnThisValue = function() {
      return this.value;
    };
    
    if (len === 1) {
      var c = Sai.Circle.create({
        x: cx,
        y: cy,
        radius: r,
        fill: atts.colors && atts.colors[0] || colors[0],
        stroke: atts.stroke || "#fff",
        strokeWidth: atts.strokewidth ? atts.strokewidth : 1
      }),
          i;
      c = canvas.element(c, "circle-0") ;
      series.push(c) ;
      total = values[0];
      values[0] = {value: values[0], order: 0, valueOf: returnThisValue};
      series[0].middle = {x: cx, y: cy};
      series[0].mangle = 180;
    } else {
      
      for (i = 0; i < len; i++) {
        total += values[i];
        values[i] = {value: values[i], order: i, valueOf: returnThisValue};
      }

      if (atts.sorted) {
        values.sort(function (a, b) {
          return b.value - a.value;
        });
      }

      for (i = 0; i < len; i++) {
        if (defcut && (values[i] * 360 / total <= 1.5)) {
          cut = i;
          defcut = false;
        }
        if (i > cut) {
          defcut = false;
          values[cut].value += values[i];
          values[cut].others = true;
          others = values[cut].value;
        }
      }
      len = Math.min(cut + 1, values.length);
      if (others) {
        values.splice(len);
        values[cut].others = true;
      }
      for (i = 0; i < len; i++) {
        var mangle = angle - 360 * values[i] / total / 2;
        if (!i) {
          angle = 90 - mangle;
          mangle = angle - 360 * values[i] / total / 2;
        }
        if (atts.init) {
          var ipath = sector(cx, cy, 1, angle, angle - 360 * values[i] / total).join(",");
        }
        var path = sector(cx, cy, r, angle, angle -= 360 * values[i] / total);
        var p = Sai.Path.create({
          path: atts.init ? ipath : path,
          fill: color(i),
          stroke: atts.stroke || "#fff",
          "stroke-width": (atts.strokewidth ? atts.strokewidth : 1),
          "stroke-linejoin": "round"
        });
        p.value = values[i];
        p.middle = path.middle;
        p.mangle = mangle;
        p = canvas.element(p, "arc-%@".fmt(i)) ;
        sectors.push(p);
        series.push(p);
        if (atts.init) p.animate({path: path.join(",")}, (+atts.init - 1) || 1000, ">");
      }
    }

    // Last thing is to layer the legend or the labels on the pie chart
    if (legend || showValues) _legend(legend.labels, legend.others, legend.mark, legend.pos);
  }

});