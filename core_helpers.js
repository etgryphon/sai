// ..........................................................
// Sai - Helper Functions creating the vector library
// 
/*globals Sai */
Sai.mixin({
  toHex: function (color) {
    var range, val, body, trim, colpic, colorVal; 
    if (Sai._vml) {
        // http://dean.edwards.name/weblog/2009/10/convert-any-colour-value-to-hex-in-msie/
        body = this._getBody();
        trim = /^\s+|\s+$/g;
        
        color = (color + '').replace(trim, '');
        range = body.createTextRange();
        try {
          body.style.color = color;
          val = range.queryCommandValue("ForeColor");
          val = ((val & 255) << 16) | (val & 65280) | ((val & 16711680) >>> 16);
          colorVal = "#" + ("000000" + val.toString(16)).slice(-6);
        } catch(e) {
          colorVal = "none";
        }
    } else {
      colpic = this._hiddenColorPicker || document.createElement("i");
      if (SC.none(this._hiddenColorPicker)){
        colpic.title = "Sai Color Picker";
        colpic.style.display = "none";
        document.body.appendChild(colpic);
        this._hiddenColorPicker = colpic;
      }
      colpic.style.color = color;
      colorVal = document.defaultView.getComputedStyle(colpic, '').getPropertyValue("color");
    }
    return colorVal;
  },
  
  // ..........................................................
  // Simple function for finding the correct popup color picture
  // by browser type...
  // 
  _getBody: function(){
    var docum, body = this._body; 
    if (body) return this._body;
    
    try {
      docum = new window.ActiveXObject("htmlfile");
      docum.write("<body>");
      docum.close();
      body = docum.body;
    } catch(e) {
      body = window.createPopup().document.body;
    }
    this._body = body;
    return body;
  },
  
  // ..........................................................
  // Color Convertors
  // 
  // The conversion algorithms for these color spaces are 
  // originally from the book Fundamentals of Interactive 
  // Computer Graphics by Foley and van Dam (c 1982, Addison-Wesley). 
  // Chapter 17 describes color spaces and shows their relationships 
  // via easy-to-follow diagrams.
  hsb2rgb: function(hue, saturation, brightness){
    hue = hue || {};
    var propHash = !SC.none(hue.h) && !SC.none(hue.s) && !SC.none(hue.b),
        red, blue, green,
        temp1, temp2, temp3,
        r, g, b,
        colorConvFunc, toHexConv,
        //i, f, p, q, t, 
        rgb, rg = /^(?=[\da-f]$)/;
    if (SC.typeOf(hue) === SC.T_HASH && propHash) {
        brightness = hue.b*1;
        saturation = hue.s*1;
        hue = hue.h*1;
    }
    // convert to 0-1 range if hue/satuaration/brightness in 0-255 range
    if (hue > 1)  hue /= 359;
    if (saturation > 1) saturation /= 100;
    if (brightness > 1) brightness /= 100;
    
    // Start the convertion process
    colorConvFunc = function(bs, colorHue){ 
      var color, temp = 2.0*brightness - bs;
      
      if ((6.0*colorHue) < 1) { color = temp+(bs-temp)*6.0*colorHue; }
      else if ((2.0*colorHue) < 1) { color = bs; }
      else if ((3.0*colorHue) < 2) { color = temp+(bs-temp)*((2.0/3.0)-colorHue)*6.0; }
      else { color = temp; }
      
      if (color < 0) color*=-1; 
      return Math.round(color*255);
    };
    if (saturation === 0) { 
      red = green = blue = Math.round(brightness*255);
    } 
    else if (brightness < 0.5){
      temp2 = brightness*(1.0+saturation);
      red = colorConvFunc(temp2, (hue+1.0/3.0));
      green = colorConvFunc(temp2, hue);
      blue = colorConvFunc(temp2, (hue-1.0/3.0));
    }
    else if (brightness >= 0.5){
      temp2 = (brightness+saturation) - (brightness*saturation);
      red = colorConvFunc(temp2, (hue+(1.0/3.0)));
      green = colorConvFunc(temp2, hue);
      blue = colorConvFunc(temp2, (hue-(1.0/3.0)));
    }
    else {
      red = green = blue = 0;
    }
    
    // Create the RGB object
    // console.log("R: %@, G: %@, B: %@".fmt(red, green, blue));
    rgb = {r: red, g: green, b: blue, toString: function(){ return this.hex;} };
    
    // Convert to Hex
    r = Sai.toTwoCharHex(red);
    g = Sai.toTwoCharHex(green);
    b = Sai.toTwoCharHex(blue);
    rgb.hex = "#" + r + g + b;
    
    return rgb;
  },
  
  rgb2hsb: function(red, green, blue){
    red = SC.none(red) ? {} : red;
    var propHash = !SC.none(red.r) && !SC.none(red.g) && !SC.none(red.b),
        colMax, colMin, maxMinPlus, maxMinMinus,
        hue, saturation, brightness,
        hsb, hueConvert;
    
    if (SC.typeOf(red) === SC.T_HASH && propHash) {
      green = red.g*1;
      blue = red.b*1;
      red = red.r*1;
    }
    // If first params is a string, then try to extract the RGB from it.
    else if (SC.typeOf(red) === SC.T_STRING) {
      return Sai.toRGB(red);
    }
    
    // convert to 0-1 range if RGB in 0-255 range
    if (red > 1)  red /= 255;
    if (green > 1) green /= 255;
    if (blue > 1) blue /= 255;
    
    colMax = Math.max(red,green,blue);
    colMin = Math.min(red,green,blue);
    maxMinPlus = colMax+colMin;
    maxMinMinus = colMax-colMin;
    
    brightness = maxMinPlus/2;
    
    hueConvert = function(){
      var h = 0;
      if (red === colMax) { h = (green-blue)/maxMinPlus; }
      if (green === colMax) { h = 2.0 + (blue-red)/maxMinPlus; }
      if (blue === colMax) { h = 4.0 + (red-green)/maxMinPlus; }
      return h;
    };
    if (colMax === colMin){
      saturation = hue = 0;
    } 
    else if (brightness < 0.5 ){
      saturation = maxMinMinus/maxMinPlus;
      hue = hueConvert();
    }
    else if (brightness >= 0.5 ){
      saturation = maxMinMinus/(2.0-maxMinPlus);
      hue = hueConvert();
    }
    
    // convert HSB to degrees,%,%
    hue = Math.round(hue*60);
    if (hue < 0) hue+=360;
    saturation = Math.round(saturation*100);
    brightness = Math.round(brightness*100);
    hsb = {h: hue, s: saturation, b: brightness, toString: function(){return 'hsb(' + [this.h, this.s, this.b] + ')';} };
    
    return hsb;
  },
  
  // ..........................................................
  // @public
  // converts 0-255 RGB values to the two character hex value.
  //
  // @param: color (Integer)
  // @returns: String
  toTwoCharHex: function(color){
    var colSt = color.toString(16);
    colSt = colSt.replace(/^(?=[\da-f]$)/, "0");
    return colSt.toUpperCase();
  },
  
  // ..........................................................
  // This converts the folowing inputs into the correct RGB format
  // Examples: 
  //  - blue, green, cyan,
  //  - #555555, #3366AA, #33bb66,
  //  - #555, #FFF, #fff,
  //  - hsb(0,0,0), hsb(0, 0, 0)
  //  - rgb(120,120,120), rgb(120, 120, 120) 
  toRGB: function(color){
    var res, t,
        colorPrefixes = {rb: 1, hs: 1}, firstChars, parsableColor,
        r, g, b,
        red, green, blue,
        rgb, rg = /^(?=[\da-f]$)/, // <= TODO: [EG] performance upgrade?
        colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgb\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|rgb\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\)|hs[bl]\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|hs[bl]\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\))\s*$/i;
        
    // first check to see if the number is null or a negative number...
    if (SC.none(color) || (color*1 < 0)) {
        return {r: -1, g: -1, b: -1, hex: "none", error: 1};
    }
    // check to see if it is the word 'none'
    if (color === "none") {
        return {r: -1, g: -1, b: -1, hex: "none"};
    }
    
    // Check to see if the color is rgb(...), hsb(...), #...
    // if not then try to extract the RGB from the color. i.e 'blue', 'green' 'cyan'
    firstChars = color.substring(0, 2);
    parsableColor = colorPrefixes.hasOwnProperty(firstChars) || color.charAt() === "#";
    if (!parsableColor) color = Sai.toHex(color);
    
    // See if we have a match array for the color parsing
    rgb = color.match(colourRegExp);
    if (rgb) {
        if (rgb[2]) {
            blue = parseInt(rgb[2].substring(5), 16);
            green = parseInt(rgb[2].substring(3, 5), 16);
            red = parseInt(rgb[2].substring(1, 3), 16);
        }
        if (rgb[3]) {
            blue = parseInt((t = rgb[3].charAt(3)) + t, 16);
            green = parseInt((t = rgb[3].charAt(2)) + t, 16);
            red = parseInt((t = rgb[3].charAt(1)) + t, 16);
        }
        if (rgb[4]) {
            rgb = rgb[4].split(/\s*,\s*/);
            red = parseFloat(rgb[0]);
            green = parseFloat(rgb[1]);
            blue = parseFloat(rgb[2]);
        }
        if (rgb[5]) {
            rgb = rgb[5].split(/\s*,\s*/);
            red = parseFloat(rgb[0]) * 2.55;
            green = parseFloat(rgb[1]) * 2.55;
            blue = parseFloat(rgb[2]) * 2.55;
        }
        if (rgb[6]) {
            rgb = rgb[6].split(/\s*,\s*/);
            red = parseFloat(rgb[0]);
            green = parseFloat(rgb[1]);
            blue = parseFloat(rgb[2]);
            return Sai.hsb2rgb(red, green, blue);
        }
        if (rgb[7]) {
            rgb = rgb[7].split(/\s*,\s*/);
            red = parseFloat(rgb[0]) * 2.55;
            green = parseFloat(rgb[1]) * 2.55;
            blue = parseFloat(rgb[2]) * 2.55;
            return Sai.hsb2rgb(red, green, blue);
        }
        rgb = {r: red, g: green, b: blue, toString: function(){ return this.hex;} };
        
        r = Sai.toTwoCharHex(red);
        g = Sai.toTwoCharHex(green);
        b = Sai.toTwoCharHex(blue);
        rgb.hex = "#" + r + g + b;
        
        return rgb;
    }
    return {r: -1, g: -1, b: -1, hex: "none", error: 1};
  },
  
  // ..........................................................
  // Not sure the point of this function but will keep around 
  // for portability
  // 
  getColor: function (value) {
    this.reset = this._reset || function(){ delete this.start; };
    this._reset = this.reset;
    this.getColor.start = this.getColor.start || {h: 0, s: 1, b: value || 0.75};
    var start = this.getColor.start,
        rgb = this.hsb2rgb(start.h, start.s, start.b);
    start.h += 0.075;
    if (start.h > 1) {
        start.h = 0;
        start.s -= 0.2;
        if (start.s <= 0) this.getColor.start = {h: 0, s: 1, b: start.b};
    }
    return rgb.hex;
  },
  
  // ..........................................................
  // resets the color handling from above
  // 
  resetColor: function(){
    var func = this.getColor;
    delete func.start;
  },
  
  // ..........................................................
  // PATH FUNCTIONS:
  // 
  _path2string: function () {
    var p2s = /,?([achlmqrstvxz]),?/gi; // <= TODO: [EG] performance upgrade?
    return this.join(",").replace(p2s, "$1");
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
  // TODO: [EG] Documentation and Unit Test
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
        r[0] = pa[0];
        switch (r[0]) {
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
  // TODO: [EG] Documentation and Unit Test
  // 
  pathDimensions: function (path) {
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
    xmin = Math.min(0, X);
    ymin = Math.min(0, Y);
    ret = {x: xmin, y: ymin, width: Math.max(0, X) - xmin, height: Math.max(0, Y) - ymin};
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
  // TODO: [EG] verify the effect of Cacher function: , null, pathClone)
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
  
  // ..........................................................
  // Math Conversions
  // 
  _rotate: function(x, y, rad){
    var X = x * Math.cos(rad) - y * Math.sin(rad),
        Y = x * Math.sin(rad) + y * Math.cos(rad);
    return {x: X, y: Y};
  },
  
  a2c: function (x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
    // for more information of where this math came from visit:
    // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
    var PI = Math.PI,
        _120 = PI * 120 / 180,
        rad = PI / 180 * (+angle || 0),
        res = [], xy, i, ii,
        // functions
        fcos = Math.cos, fsin = Math.sin;
    if (!recursive) {
      xy = this._rotate(x1, y1, -rad);
      x1 = xy.x;
      y1 = xy.y;
      xy = this._rotate(x2, y2, -rad);
      x2 = xy.x;
      y2 = xy.y;
      var cos = fcos(PI / 180 * angle),
          sin = fsin(PI / 180 * angle),
          x = (x1 - x2) / 2,
          y = (y1 - y2) / 2;
      // rx = Math.max(rx, Math.abs(x)); // TODO: [EG] ignore?
      // ry = Math.max(ry, Math.abs(y)); // TODO: [EG] ignore?
      var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
      if (h > 1) {
        h = Math.sqrt(h);
        rx = h * rx;
        ry = h * ry;
      }
      var rx2 = rx * rx,
          ry2 = ry * ry,
          k = (large_arc_flag === sweep_flag ? -1 : 1) *
              Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
          cx = k * rx * y / ry + (x1 + x2) / 2,
          cy = k * -ry * x / rx + (y1 + y2) / 2,
          f1 = Math.asin(((y1 - cy) / ry).toFixed(7)),
          f2 = Math.asin(((y2 - cy) / ry).toFixed(7));

      f1 = x1 < cx ? PI - f1 : f1;
      f2 = x2 < cx ? PI - f2 : f2;
      if (f1 < 0) f1 = PI * 2 + f1;
      if (f2 < 0) f2 = PI * 2 + f2;
      if (sweep_flag && f1 > f2) {
        f1 = f1 - PI * 2;
      }
      if (!sweep_flag && f2 > f1) {
        f2 = f2 - PI * 2;
      }
    } 
    else {
      f1 = recursive[0];
      f2 = recursive[1];
      cx = recursive[2];
      cy = recursive[3];
    }
    var df = f2 - f1;
    if (Math.abs(df) > _120) {
      var f2old = f2,
          x2old = x2,
          y2old = y2;
      f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
      x2 = cx + rx * fcos(f2);
      y2 = cy + ry * fsin(f2);
      res = this.a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
    }
    df = f2 - f1;
    var c1 = fcos(f1),
        s1 = fsin(f1),
        c2 = fcos(f2),
        s2 = fsin(f2),
        t = Math.tan(df / 4),
        hx = 4 / 3 * rx * t,
        hy = 4 / 3 * ry * t,
        m1 = [x1, y1],
        m2 = [x1 + hx * s1, y1 - hy * c1],
        m3 = [x2 + hx * s2, y2 - hy * c2],
        m4 = [x2, y2];
    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];
    if (recursive) {
      return [m2, m3, m4].concat(res);
    } 
    else {
      res = [m2, m3, m4].concat(res).join().split(",");
      var newres = [];
      for (i = 0, ii = res.length; i < ii; i++) {
        newres[i] = i % 2 ? this._rotate(res[i - 1], res[i], rad).y : this._rotate(res[i], res[i + 1], rad).x;
      }
      return newres;
    }
  },
  
  // TODO: [EG] Document this...
  q2c: function (x1, y1, ax, ay, x2, y2) {
      var _13 = 1 / 3,
          _23 = 2 / 3;
      return [
              _13 * x1 + _23 * ax,
              _13 * y1 + _23 * ay,
              _13 * x2 + _23 * ax,
              _13 * y2 + _23 * ay,
              x2,
              y2
          ];
  },
  
  // TODO: [EG] document and test this...
  l2c: function (x1, y1, x2, y2) {
    return [x1, y1, x2, y2, x2, y2];
  },
  
  // ..........................................................
  // FIXME: [EG] cacher(function(){})
  // 
  parseDots: function (gradient) {
    var dots = [], dot, par,
        i, ii, j, jj, d,
        start, end;
    for (i = 0, ii = gradient[length]; i < ii; i++) {
      dot = {};
      par = gradient[i].match(/^([^:]*):?([\d\.]*)/);
      dot.color = Sai.getRGB(par[1]);
      if (dot.color.error) {
        return null;
      }
      dot.color = dot.color.hex;
      if (par[2]) dot.offset = par[2] + "%";
      dots.push(dot);
    }
    for (i = 1, ii = dots.length - 1; i < ii; i++) {
      if (!dots[i].offset) {
        start = parseFloat(dots[i - 1].offset || 0);
        end = 0;
        for (j = i + 1; j < ii; j++) {
          if (dots[j].offset) {
            end = dots[j].offset;
            break;
          }
        }
        if (!end) {
          end = 100;
          j = ii;
        }
        end = parseFloat(end);
        d = (end - start) / (j - i + 1);
        for (; i < j; i++) { // FIXME: [EG] I don't like this.
          start += d;
          dots[i].offset = start + "%";
        }
      }
    }
    return dots;
  },
  
  // ..........................................................
  // DRAWING FUNCTIONS
  // 
  
  // ..........................................................
  // TODO: [EG] Need Unit Test and documentation
  // 
  findDotAtSegment: function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
    var t1 = 1 - t,
        ret, xVal, yVal,
        pow = Math.pow;
    xVal = pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x;
    yVal = pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y;
    return { x: xVal, y: yVal };
  },
  
  // ..........................................................
  // TODO: [EG] Unit Tests and Documentation
  //
  findDotsAtSegment: function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
    var t1 = 1 - t,
        x = Math.pow(t1, 3) * p1x + Math.pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + Math.pow(t, 3) * p2x,
        y = Math.pow(t1, 3) * p1y + Math.pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + Math.pow(t, 3) * p2y,
        mx = p1x + 2 * t * (c1x - p1x) + t * t * (c2x - 2 * c1x + p1x),
        my = p1y + 2 * t * (c1y - p1y) + t * t * (c2y - 2 * c1y + p1y),
        nx = c1x + 2 * t * (c2x - c1x) + t * t * (p2x - 2 * c2x + c1x),
        ny = c1y + 2 * t * (c2y - c1y) + t * t * (p2y - 2 * c2y + c1y),
        ax = (1 - t) * p1x + t * c1x,
        ay = (1 - t) * p1y + t * c1y,
        cx = (1 - t) * c2x + t * p2x,
        cy = (1 - t) * c2y + t * p2y,
        alpha = (90 - Math.atan((mx - nx) / (my - ny)) * 180 / Math.PI);
    if (mx > nx || my < ny) alpha += 180;
    return {x: x, y: y, m: {x: mx, y: my}, n: {x: nx, y: ny}, start: {x: ax, y: ay}, end: {x: cx, y: cy}, alpha: alpha};
  },
  // ..........................................................
  // TODO: [EG] Unit Tests and Documentation
  // 
  curveDim: function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
    var a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x),
        b = 2 * (c1x - p1x) - 2 * (c2x - c1x),
        c = p1x - c1x,
        t1 = (-b + Math.sqrt(b * b - 4 * a * c)) / 2 / a,
        t2 = (-b - Math.sqrt(b * b - 4 * a * c)) / 2 / a,
        y = [p1y, p2y], x = [p1x, p2x],
        dot, minVal, maxVal;
      
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
    minVal = {x: Math.min(0, x), y: Math.min(0, y)};
    maxVal = {x: Math.max(0, x), y: Math.max(0, y)};
    return { min: minVal, max: maxVal};
  }
});