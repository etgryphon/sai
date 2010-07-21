// ..........................................................
// Sai - Helper Functions creating paths for Sai
// 
sc_require('core_helpers');
/*globals Sai */
Sai.mixin({
  
  roundPath: function(path) {
    var i, ii, j , jj, round = Math.round;
    for (i = 0, ii = path.length; i < ii; i++) {
      if (path[i][0].toLowerCase() !== "a") {
        for (j = 1, jj = path[i][length]; j < jj; j++) {
          path[i][j] = round(path[i][j]);
        }
      } else {
        path[i][6] = round(path[i][6]);
        path[i][7] = round(path[i][7]);
      }
    }
    return path;
  },
  
  _path2string: function () {
    var p2s = /,?([achlmqrstvxz]),?/gi; // <= TODO: [EG] performance upgrade?
    return this.join(",").replace(p2s, '$1');
  },
  
  // ..........................................................
  // parsePathString:
  // 
  // TODO: Still need tests and documentation
  parsePathString: function (pathString) {
    var pathCommand = /([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig, // <= TODO: [EG] performance upgrade?
        pathValues = /(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig, // <= TODO: [EG] performance upgrade?
        paramFunc, pathStr,
        paramCounts = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0},
        data = [];
    if (!pathString) { return null; }
    if (SC.typeOf(pathString) === SC.T_ARRAY && SC.typeOf(pathString[0]) === SC.T_ARRAY) { // rough assumption, TODO: [EG] WTF?
        data = Sai.pathClone(pathString);
    }
    paramFunc = function (a, b, c) {
      var params = [],
          name = b ? b.toLowerCase() : '';
      c.replace(pathValues, function (a, b) { 
        if (b) params.push(+b);
      });
      if (name === "m" && params[length] > 2) {
          data.push([b].concat(params.splice(0, 2)));
          name = "l";
          b = b === "m" ? "l" : "L";
      }
      while (params.length >= paramCounts[name]) {
        data.push([b].concat(params.splice(0, paramCounts[name])));
        if (!paramCounts[name]) {
          break;
        }
      }
    };
    if (!data.length) {
      pathStr = pathString + ''; 
      pathStr.replace(pathCommand, paramFunc);
    }
    data.toString = Sai._path2string;
    return data;
  },
  
  // ..........................................................
  // pathClone: 
  // Loops through and double array of paths to clone the path
  // 
  pathClone: function (pathArray) {
    var res = [], i, iLen, j, jLen;
    if (!SC.typeOf(pathArray) === SC.T_ARRAY || !(pathArray && SC.typeOf(pathArray[0]) === SC.T_ARRAY)) { // rough assumption
      pathArray = Sai.parsePathString(pathArray);
    }
    for (i = 0, iLen = pathArray.length; i < iLen; i++) {
      res[i] = [];
      for (j = 0, jLen = pathArray[i].length; j < jLen; j++) {
        res[i][j] = pathArray[i][j];
      }
    }
    res.toString = Sai._path2string;
    return res;
  },
  
  // ..........................................................
  // pathToAbsolute() - this function converts a relative path
  // to an absolute path array.
  // TODO: uses the Cacher...
  pathToAbsolute: function (pathArray) {
    if (SC.typeOf(pathArray) === SC.T_ARRAY && SC.typeOf(pathArray[0]) === SC.T_ARRAY) { // rough assumption, TODO: [EG] WTF?
      pathArray = Sai.parsePathString(pathArray);
    }
    var i, iLen, j, jLen,
        r, pa, up_pa, res = [], start = 0, 
        x = 0, y = 0, mx = 0, my = 0;
    
    // TODO: [EG] Document why this exists
    if (pathArray[0][0] === "M") {
      x = +pathArray[0][1];
      y = +pathArray[0][2];
      mx = x;
      my = y;
      start++;
      res[0] = ["M", x, y];
    }
    for (i = start, iLen = pathArray.length; i < iLen; i++) {
      r = res[i] = [];
      pa = pathArray[i];
      up_pa = pa[0].toUpperCase();
      if (pa[0] !== up_pa) {
        r[0] = up_pa;
        switch (up_pa) {
          case "A":
            r[1] = pa[1];
            r[2] = pa[2];
            r[3] = pa[3];
            r[4] = pa[4];
            r[5] = pa[5];
            r[6] = +(pa[6] + x);
            r[7] = +(pa[7] + y);
            break;
          case "V":
            r[1] = +pa[1] + y;
            break;
          case "H":
            r[1] = +pa[1] + x;
            break;
          case "M":
            mx = +pa[1] + x;
            my = +pa[2] + y;
            break;
          default:
            for (j = 1, jLen = pa.length; j < jLen; j++) {
              r[j] = +pa[j] + ((j % 2) ? x : y);
            }
            break;
        }
      } 
      else {
        for (j = 0, jLen = pa.length; j < jLen; j++) {
          res[i][j] = pa[j];
        }
      }
      // TODO: [EG] Why is this like this?
      if (r[0] === 'Z'){
        x = mx;
        y = my;
      }
      else if (r[0] === 'H'){
        x = r[1];
      }
      else if (r[0] === 'V'){
        y = r[1];
      }
      else {
        x = res[i][res[i].length - 2];
        y = res[i][res[i].length - 1];
      }
    }
    res.toString = Sai._path2string;
    return res;
  },
  
  // ..........................................................
  // pathToRelative
  // FIXME: [EG] cacher(function{}, 0, pathClone)
  pathToRelative: function (pathArray) {
    if (SC.typeOf(pathArray) === SC.T_ARRAY && SC.typeOf(pathArray[0]) === SC.T_ARRAY) { // rough assumption, TODO: [EG] WTF?
      pathArray = Sai.parsePathString(pathArray);
    }
    var res = [], i, ii, r, pa, j, jj, k, kk, len,
        x = 0, y = 0, mx = 0, my = 0,
        paLow,start = 0;
    if (pathArray[0][0] === "M") {
      x = pathArray[0][1];
      y = pathArray[0][2];
      mx = x;
      my = y;
      start++;
      res.push(["M", x, y]);
    }
    for (i = start, ii = pathArray.length; i < ii; i++) {
      r = res[i] = [];
      pa = pathArray[i];
      paLow = pa[0].toLowerCase();
      if (pa[0] !== paLow) {
        r[0] = paLow;
        switch (r[0]) {
          case "a":
            r[1] = pa[1];
            r[2] = pa[2];
            r[3] = pa[3];
            r[4] = pa[4];
            r[5] = pa[5];
            r[6] = +(pa[6] - x).toFixed(3);
            r[7] = +(pa[7] - y).toFixed(3);
            break;
          case "v":
            r[1] = +(pa[1] - y).toFixed(3);
            break;
          case "m":
            mx = pa[1];
            my = pa[2];
            break; // TODO: [EG] this was missing...need to check to see if it is needed...
          default:
            for (j = 1, jj = pa.length; j < jj; j++) {
              r[j] = +(pa[j] - ((j % 2) ? x : y)).toFixed(3);
            }
        }
      } 
      else {
        r = res[i] = [];
        if (pa[0] === "m") {
          mx = pa[1] + x;
          my = pa[2] + y;
        }
        for (k = 0, kk = pa.length; k < kk; k++) {
          res[i][k] = pa[k];
        }
      }
      len = res[i].length;
      switch (res[i][0]) {
        case "z":
          x = mx;
          y = my;
          break;
        case "h":
          x += +res[i][len - 1];
          break;
        case "v":
          y += +res[i][len - 1];
          break;
        default:
          x += +res[i][len - 2];
          y += +res[i][len - 1];
      }
    }
    res.toString = this._path2string;
    return res;
  },
  
  // ..........................................................
  // TODO: [EG] Unit Tests and Documentation
  // 
  curveDim: function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
    //debugger;
    var a, b, c, t1, t2,
        y = [p1y, p2y], x = [p1x, p2x],
        dot, minVal, maxVal, 
        round = Math.round, mmin = Math.min, mmax = Math.max;
        
    // Calculate X Values
    a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x);
    b = 2 * (c1x - p1x) - 2 * (c2x - c1x);
    c = p1x - c1x;
    t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
    t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;
        
    if (Math.abs(t1) > 1e12) t1 = 0.5;
    if (Math.abs(t2) > 1e12) t2 = 0.5;
    if (t1 > 0 && t1 < 1) {
      dot = Sai.findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
      x.push(dot.x);
      y.push(dot.y);
    }
    if (t2 > 0 && t2 < 1) {
      dot = Sai.findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
      x.push(dot.x);
      y.push(dot.y);
    }
    
    // Calculate the Y values
    a = (c2y - 2 * c1y + p1y) - (p2y - 2 * c2y + c1y);
    b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
    c = p1y - c1y;
    t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a;
    t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a;
    
    if (Math.abs(t1) > 1e12) t1 = 0.5;
    if (Math.abs(t2) > 1e12) t2 = 0.5;
    
    if (t1 > 0 && t1 < 1) {
      dot = Sai.findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
      x.push(dot.x);
      y.push(dot.y);
    }
    if (t2 > 0 && t2 < 1) {
      dot = Sai.findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
      x.push(dot.x);
      y.push(dot.y);
    }
    
    // Calculate the min and max values to return
    minVal = {x: round(mmin.apply(0, x)), y: round(mmin.apply(0, y))};
    maxVal = {x: round(mmax.apply(0, x)), y: round(mmax.apply(0, y))};
    return { min: minVal, max: maxVal};
  },
  
  // ..........................................................
  // TODO: [EG] Documentation and Unit Test
  // 
  pathDimensions: function (path) {
    var mmax = Math.max, mmin = Math.min;
    if (!path) return {x: 0, y: 0, width: 0, height: 0};
    path = Sai.path2curve(path);
    var x = 0, y = 0,
        X = [], Y = [],
        p, dim, xmin, ymin, i, len, ret = {};
    for (i = 0, len = path.length; i < len; i++) {
      p = path[i];
      if (p[0] === "M") {
        x = p[1];
        y = p[2];
        X.push(x);
        Y.push(y);
      } 
      else {
        dim = Sai.curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
        X = X.concat(dim.min.x, dim.max.x);
        Y = Y.concat(dim.min.y, dim.max.y);
        x = p[5];
        y = p[6];
      }
    }
    xmin = mmin.apply(0, X);
    ymin = mmin.apply(0, Y);
    ret = {x: xmin, y: ymin, width: mmax.apply(0, X) - xmin, height: mmax.apply(0, Y) - ymin};
    return ret;
  },
  
  // Private function
  // TODO: [EG] I am here...
  _processPath: function (path, d) {
    var nx, ny, temp;
    if (!path) return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
    if (!(path[0] in {T:1, Q:1})) {
      d.qx = d.qy = null;
    }
    switch (path[0]) {
      case "M":
        d.X = path[1];
        d.Y = path[2];
        break;
      case "A":
        temp = [d.x, d.y].concat(path.slice(1)); // FIXME: [EG] OK a little funky...needs to be clearer what is going on
        temp = Sai.a2c.apply(0, temp);
        path = ["C"].concat(temp);
        break;
      case "S":
        nx = d.x + (d.x - (d.bx || d.x));
        ny = d.y + (d.y - (d.by || d.y));
        // path = ["C", nx, ny][concat](path.slice(1));
        break;
      case "T":
        d.qx = d.x + (d.x - (d.qx || d.x));
        d.qy = d.y + (d.y - (d.qy || d.y));
        temp = Sai.q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]);
        path = ["C"].concat(temp);
        break;
      case "Q":
        d.qx = path[1];
        d.qy = path[2];
        temp = Sai.q2c(d.x, d.y, path[1], path[2], path[3], path[4]);
        path = ["C"].concat(temp);
        break;
      case "L":
        temp = Sai.l2c(d.x, d.y, path[1], path[2]);
        path = ["C"].concat(temp);
        break;
      case "H":
        temp = Sai.l2c(d.x, d.y, path[1], d.y);
        path = ["C"].concat(temp);
        break;
      case "V":
        temp = Sai.l2c(d.x, d.y, d.x, path[1]);
        path = ["C"].concat(temp);
        break;
      case "Z":
        temp = Sai.l2c(d.x, d.y, d.X, d.Y);
        path = ["C"].concat(temp);
        break;
    }
    return path;
  },
  
  // ..........................................................
  // path2curve: this functions converts any path to its absolute
  // equivalent purely with curves.
  // 
  path2curve: function (path, path2) {
    var i, ii, seg, seg2, seglen, seg2len,
        p = Sai.pathToAbsolute(path),
        p2 = path2 && Sai.pathToAbsolute(path2),
        attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
        attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
        // FIXME: [EG] Dangerous!!! code is changing <ii> in a closure!!!
        fixArc = function (pp, i) {
          var pi;
          if (pp[i].length > 7) {
            pp[i].shift();
            pi = pp[i];
            while (pi.length) {
              pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
            }
            pp.splice(i, 1);
            ii = Math.max(p.length, p2 && p2.length || 0); // FIXME: [EG] too wacky!!!
          }
        },
        // FIXME: [EG] Dangerous!!! code is changing <ii> in a closure!!!
        fixM = function (path1, path2, a1, a2, i) {
          if (path1 && path2 && path1[i][0] === "M" && path2[i][0] !== "M") {
            path2.splice(i, 0, ["M", a2.x, a2.y]);
            a1.bx = 0;
            a1.by = 0;
            a1.x = path1[i][1];
            a1.y = path1[i][2];
            ii = Math.max(p.length, p2 && p2.length || 0);
          }
        };
    for (i = 0, ii = Math.max(p.length, p2 && p2.length || 0); i < ii; i++) {
      p[i] = this._processPath(p[i], attrs);
      fixArc(p, i);
      if (p2) {
        p2[i] = this._processPath(p2[i], attrs2);
        fixArc(p2, i);
      }
      fixM(p, p2, attrs, attrs2, i);
      fixM(p2, p, attrs2, attrs, i);
      seg = p[i];
      seg2 = p2 && p2[i];
      seglen = seg.length;
      seg2len = p2 && seg2.length;
      attrs.x = seg[seglen - 2];
      attrs.y = seg[seglen - 1];
      attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x;
      attrs.by = parseFloat(seg[seglen - 3]) || attrs.y;
      attrs2.bx = p2 && (parseFloat(seg2[seg2len - 4]) || attrs2.x);
      attrs2.by = p2 && (parseFloat(seg2[seg2len - 3]) || attrs2.y);
      attrs2.x = p2 && seg2[seg2len - 2];
      attrs2.y = p2 && seg2[seg2len - 1];
    }
    return p2 ? [p, p2] : p;
  },
  
  // VML specific arguments
  coordsize: 1e3 + " " + 1e3,
  zoom: 10,
  
  path2vml: function(path) {
    var total = /[ahqstv]/ig,
        map = { M: "m", L: "l", C: "c", Z: "x", m: "t", l: "r", c: "v", z: "x" },
        bites = /([clmz]),?([^clmz]*)/gi,
        val = /-?[^,s-]+/g,
        command = Sai.pathToAbsolute,
        vals, isMove, res, pa, p, r,
        round = Math.round,
        i, ii, j, jj;
        
    if ((path + "").match(total)){ command = Sai.path2curve; }
    total = /[clmz]/g; // FIXME: [EG] WTF? Why not just assign this above?
    if (command === Sai.pathToAbsolute && !(path + "").match(total)) {
      res = (path + "").replace(bites,
        function(all, command, args) {
          vals = [];
          isMove = command.toLowerCase() === "m";
          res = map[command];
          args.replace(val,
            function(value) {
              if (isMove && vals.length === 2) {
                res += vals + map[command === "m" ? "l": "L"];
                vals = [];
              }
              vals.push(round(value * Sai.zoom));
            }
          );
          return res + vals;
        }
      );
      return res;
    }
    pa = command(path);
    res = [];
    for (i = 0, ii = pa.length; i < ii; i++) {
      p = pa[i];
      r = pa[i][0].toLowerCase();
      if (r === "z") { r = "x"; }
      for (j = 1, jj = p.length; j < jj; j++) {
        r += round(p[j] * Sai.zoom) + (j !== jj - 1 ? ",": "");
      }
      res.push(r);
    }
    return res.join(" ");
  }
});
