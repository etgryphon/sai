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
  
  convertAllToRGB: function(colorKeys){
    colorKeys = colorKeys || {};
    for( var key in colorKeys){
      colorKeys[key] = Sai.toRGB(colorKeys[key]);
    }
    
    return colorKeys;
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
  }
});