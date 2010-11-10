// ..........................................................
// Sai - Helper Functions creating the vector library
//
/*globals Sai */

Sai.Set = SC.Object.extend({
  //  var Set = function (items) {
  //          this.items = [];
  //          this.length = 0;
  //          this.type = "set";
  //          if (items) {
  //              for (var i = 0, ii = items.length; i < ii; i++) {
  //                  if (items[i] && (items[i].constructor == Element || items[i].constructor == Set)) {
  //                      this[this.items.length] = this.items[this.items.length] = items[i];
  //                      this.length++;
  //                  }
  //              }
  //          }
  //      };

  items: [],
  length: 0,
  type: 'set',

  init: function() {
    var items = this.get('items'),
        len   = items.length ;
    this.set('length', len) ;
  },

  push: function () {
    var item,
        len;
    for (var i = 0, ii = arguments.length; i < ii; i++) {
      item = arguments[i];
      if (item) { // TODO: [GD] put back the check if item is Element or Set
        len = this.items.length;
        this[len] = this.items[len] = item;
        this.length++;
      }
    }
    return this;
  },
  pop: function () {
    delete this[this.length--];
    return this.items.pop();
  },
  //      for (var method in Element[proto]) if (Element[proto][has](method)) {
  //          Set[proto][method] = (function (methodname) {
  //              return function () {
  //                  for (var i = 0, ii = this.items.length; i < ii; i++) {
  //                      this.items[i][methodname].apply(this.items[i], arguments);
  //                  }
  //                  return this;
  //              };
  //          })(method);
  //      }
  attr: function (name, value) {
    if (name && R.is(name, array) && R.is(name[0], "object")) {
      for (var j = 0, jj = name.length; j < jj; j++) {
        this.items[j].attr(name[j]);
      }
    } else {
      for (var i = 0, ii = this.items.length; i < ii; i++) {
        this.items[i].attr(name, value);
      }
    }
    return this;
  },
  animate: function (params, ms, easing, callback) {
    (SC.isKind(easing, SC.T_FUNCTION) || !easing) && (callback = easing || null);
    var len = this.items.length,
        i = len,
        set = this,
        collector;
    callback && (collector = function () {
      !--len && callback.call(set);
    });
    this.items[--i].animate(params, ms, easing || collector, collector);
    while (i--) {
      this.items[i].animateWith(this.items[len - 1], params, ms, easing || collector, collector);
    }
    return this;
  },
  insertAfter: function (el) {
    var i = this.items.length;
    while (i--) {
      this.items[i].insertAfter(el);
    }
    return this;
  },
  getBBox: function () {
    var x = [],
        y = [],
        w = [],
        h = [];
    for (var i = this.items.length; i--;) {
      var box = this.items[i].getBBox();
      x.push(box.x);
      y.push(box.y);
      w.push(box.x + box.width);
      h.push(box.y + box.height);
    }
    x = mmin.apply(0, x);
    y = mmin.apply(0, y);
    return {
      x: x,
      y: y,
      width: mmax.apply(0, w) - x,
      height: mmax.apply(0, h) - y
    };
  },
  clone: function (s) {
    s = new Set;
    for (var i = 0, ii = this.items.length; i < ii; i++) {
      s.push(this.items[i].clone());
    }
    return s;
  }

});