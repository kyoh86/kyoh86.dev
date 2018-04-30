(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.Encoder = void 0;

var _createClass = function () { function a(a, b) { for (var c = 0, d; c < b.length; c++) { d = b[c]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(a, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

var _zip_deflate = require('./zip_deflate.js');

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

var Encoder = exports.Encoder = function () {
  function a() {
    _classCallCheck(this, a);
  }

  _createClass(a, null, [{
    key: 'encode64',
    value: function encode64(b) {
      var a = "";
      for (var c = 0; c < b.length; c += 3) {
        if (c + 2 == b.length) {
          a += this.append3Bytes(b.charCodeAt(c), b.charCodeAt(c + 1), 0);
        } else {
          if (c + 1 == b.length) {
            a += this.append3Bytes(b.charCodeAt(c), 0, 0);
          } else {
            a += this.append3Bytes(b.charCodeAt(c), b.charCodeAt(c + 1), b.charCodeAt(c + 2));
          }
        }
      }
      return a;
    }
  }, {
    key: 'append3Bytes',
    value: function append3Bytes(d, c, b) {
      var a = d >> 2,
          e = (3 & d) << 4 | c >> 4,
          f = (15 & c) << 2 | b >> 6,
          g = 63 & b,
          h = "";

      h += this.encode6Bit(63 & a);
      h += this.encode6Bit(63 & e);
      h += this.encode6Bit(63 & f);
      h += this.encode6Bit(63 & g);
      return h;
    }
  }, {
    key: 'encode6Bit',
    value: function encode6Bit(b) {
      if (10 > b) {
        return String.fromCharCode(48 + b);
      }
      b -= 10;
      if (26 > b) {
        return String.fromCharCode(65 + b);
      }
      b -= 26;
      if (26 > b) {
        return String.fromCharCode(97 + b);
      }
      b -= 26;
      if (0 == b) {
        return "-";
      }
      if (1 == b) {
        return "_";
      }
      return "?";
    }
  }, {
    key: 'compress',
    value: function compress(b) {
      var a = new _zip_deflate.Zip();
      b = unescape(encodeURIComponent(b));
      return this.encode64(a.deflate(b, 9));
    }
  }]);

  return a;
}();

},{"./zip_deflate.js":3}],2:[function(require,module,exports){
'use strict';

var _encoder = require('./encoder.js');

window.addEventListener("load", function () {
  document.querySelectorAll('code.language-uml').forEach(function (a) {
    var b = a.textContent,
        c = "//plantuml.com/plantuml/img/" + _encoder.Encoder.compress(b);

    a.parentNode.outerHTML = '<div><img src="' + c + '" /></div>';
    console.debug("encoding " + a.textContent);
  });
  console.debug("PlantUML");
});

},{"./encoder.js":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var _createClass = function () { function a(a, b) { for (var c = 0, d; c < b.length; c++) { d = b[c]; d.enumerable = d.enumerable || !1; d.configurable = !0; if ("value" in d) d.writable = !0; Object.defineProperty(a, d.key, d); } } return function (b, c, d) { if (c) a(b.prototype, c); if (d) a(b, d); return b; }; }();

function _classCallCheck(a, b) { if (!(a instanceof b)) { throw new TypeError("Cannot call a class as a function"); } }

var DeflateCT = function a() {
  _classCallCheck(this, a);

  this.fc = 0;
  this.dl = 0;
};

var DeflateTreeDesc = function a() {
  _classCallCheck(this, a);

  this.dyn_tree = null;
  this.static_tree = null;
  this.extra_bits = null;
  this.extra_base = 0;
  this.elems = 0;
  this.max_length = 0;
  this.max_code = 0;
};

var DeflateConfiguration = function a(b, c, d, e) {
  _classCallCheck(this, a);

  this.good_length = b;
  this.max_lazy = c;
  this.nice_length = d;
  this.max_chain = e;
};

var DeflateBuffer = function a() {
  _classCallCheck(this, a);

  this.next = null;
  this.len = 0;
  this.ptr = Array(this.OUTBUFSIZ);
  this.off = 0;
};

var Zip = exports.Zip = function () {
  function a() {
    _classCallCheck(this, a);

    this.BUF_SIZE = 16;
    this.WSIZE = 32768;
    this.STORED_BLOCK = 0;
    this.STATIC_TREES = 1;
    this.DYN_TREES = 2;
    this.DEFAULT_LEVEL = 6;
    this.FULL_SEARCH = !0;
    this.INBUFSIZ = 32768;
    this.INBUF_EXTRA = 64;
    this.OUTBUFSIZ = 8192;
    this.window_size = 2 * this.WSIZE;
    this.MIN_MATCH = 3;
    this.MAX_MATCH = 258;
    this.BITS = 16;
    this.LIT_BUFSIZE = 8192;
    this.HASH_BITS = 13;
    if (this.LIT_BUFSIZE > this.INBUFSIZ) {
      alert("error: this.INBUFSIZ is too small");
    }
    if (this.WSIZE << 1 > 1 << this.BITS) {
      alert("error: this.WSIZE is too large");
    }
    if (this.HASH_BITS > this.BITS - 1) {
      alert("error: this.HASH_BITS is too large");
    }
    if (8 > this.HASH_BITS || 258 != this.MAX_MATCH) {
      alert("error: Code too clever");
    }
    this.DIST_BUFSIZE = this.LIT_BUFSIZE;
    this.HASH_SIZE = 1 << this.HASH_BITS;
    this.HASH_MASK = this.HASH_SIZE - 1;
    this.WMASK = this.WSIZE - 1;
    this.NIL = 0;
    this.TOO_FAR = 4096;
    this.MIN_LOOKAHEAD = this.MAX_MATCH + this.MIN_MATCH + 1;
    this.MAX_DIST = this.WSIZE - this.MIN_LOOKAHEAD;
    this.SMALLEST = 1;
    this.MAX_BITS = 15;
    this.MAX_BL_BITS = 7;
    this.LENGTH_CODES = 29;
    this.LITERALS = 256;
    this.END_BLOCK = 256;
    this.L_CODES = this.LITERALS + 1 + this.LENGTH_CODES;
    this.D_CODES = 30;
    this.BL_CODES = 19;
    this.REP_3_6 = 16;
    this.REPZ_3_10 = 17;
    this.REPZ_11_138 = 18;
    this.HEAP_SIZE = 2 * this.L_CODES + 1;
    this.H_SHIFT = parseInt((this.HASH_BITS + this.MIN_MATCH - 1) / this.MIN_MATCH);
    this.free_queue = void 0;
    this.qhead = void 0;
    this.qtail = void 0;
    this.initflag = void 0;
    this.outbuf = null;
    this.outcnt = void 0;
    this.outoff = void 0;
    this.complete = void 0;
    this.window = void 0;
    this.d_buf = void 0;
    this.l_buf = void 0;
    this.prev = void 0;
    this.bi_buf = void 0;
    this.bi_valid = void 0;
    this.block_start = void 0;
    this.ins_h = void 0;
    this.hash_head = void 0;
    this.prev_match = void 0;
    this.match_available = void 0;
    this.match_length = void 0;
    this.prev_length = void 0;
    this.strstart = void 0;
    this.match_start = void 0;
    this.eofile = void 0;
    this.lookahead = void 0;
    this.max_chain_length = void 0;
    this.max_lazy_match = void 0;
    this.compr_level = void 0;
    this.good_match = void 0;
    this.nice_match = void 0;
    this.dyn_ltree = void 0;
    this.dyn_dtree = void 0;
    this.static_ltree = void 0;
    this.static_dtree = void 0;
    this.bl_tree = void 0;
    this.l_desc = void 0;
    this.d_desc = void 0;
    this.bl_desc = void 0;
    this.bl_count = void 0;
    this.heap = void 0;
    this.heap_len = void 0;
    this.heap_max = void 0;
    this.depth = void 0;
    this.length_code = void 0;
    this.dist_code = void 0;
    this.base_length = void 0;
    this.base_dist = void 0;
    this.flag_buf = void 0;
    this.last_lit = void 0;
    this.last_dist = void 0;
    this.last_flags = void 0;
    this.flags = void 0;
    this.flag_bit = void 0;
    this.opt_len = void 0;
    this.static_len = void 0;
    this.deflate_data = void 0;
    this.deflate_pos = void 0;
    this.extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
    this.extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
    this.extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
    this.bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    this.configuration_table = [new DeflateConfiguration(0, 0, 0, 0), new DeflateConfiguration(4, 4, 8, 4), new DeflateConfiguration(4, 5, 16, 8), new DeflateConfiguration(4, 6, 32, 32), new DeflateConfiguration(4, 4, 16, 16), new DeflateConfiguration(8, 16, 32, 32), new DeflateConfiguration(8, 16, 128, 128), new DeflateConfiguration(8, 32, 128, 256), new DeflateConfiguration(32, 128, 258, 1024), new DeflateConfiguration(32, 258, 258, 4096)];
  }

  _createClass(a, [{
    key: "deflate_start",
    value: function deflate_start(c) {
      var d = void 0;
      if (!c) {
        c = this.DEFAULT_LEVEL;
      } else {
        if (1 > c) {
          c = 1;
        } else {
          if (9 < c) {
            c = 9;
          }
        }
      }
      this.compr_level = c;
      this.initflag = !1;
      this.eofile = !1;
      if (null != this.outbuf) {
        return;
      }
      this.free_queue = this.qhead = this.qtail = null;
      this.outbuf = Array(this.OUTBUFSIZ);
      this.window = Array(this.window_size);
      this.d_buf = Array(this.DIST_BUFSIZE);
      this.l_buf = Array(this.INBUFSIZ + this.INBUF_EXTRA);
      this.prev = Array(1 << this.BITS);
      this.dyn_ltree = Array(this.HEAP_SIZE);
      for (d = 0; d < this.HEAP_SIZE; d++) {
        this.dyn_ltree[d] = new DeflateCT();
      }
      this.dyn_dtree = Array(2 * this.D_CODES + 1);
      for (d = 0; d < 2 * this.D_CODES + 1; d++) {
        this.dyn_dtree[d] = new DeflateCT();
      }
      this.static_ltree = Array(this.L_CODES + 2);
      for (d = 0; d < this.L_CODES + 2; d++) {
        this.static_ltree[d] = new DeflateCT();
      }
      this.static_dtree = Array(this.D_CODES);
      for (d = 0; d < this.D_CODES; d++) {
        this.static_dtree[d] = new DeflateCT();
      }
      this.bl_tree = Array(2 * this.BL_CODES + 1);
      for (d = 0; d < 2 * this.BL_CODES + 1; d++) {
        this.bl_tree[d] = new DeflateCT();
      }
      this.l_desc = new DeflateTreeDesc();
      this.d_desc = new DeflateTreeDesc();
      this.bl_desc = new DeflateTreeDesc();
      this.bl_count = Array(this.MAX_BITS + 1);
      this.heap = Array(2 * this.L_CODES + 1);
      this.depth = Array(2 * this.L_CODES + 1);
      this.length_code = Array(this.MAX_MATCH - this.MIN_MATCH + 1);
      this.dist_code = Array(512);
      this.base_length = Array(this.LENGTH_CODES);
      this.base_dist = Array(this.D_CODES);
      this.flag_buf = Array(parseInt(this.LIT_BUFSIZE / 8));
    }
  }, {
    key: "deflate_end",
    value: function deflate_end() {
      this.free_queue = this.qhead = this.qtail = null;
      this.outbuf = null;
      this.window = null;
      this.d_buf = null;
      this.l_buf = null;
      this.prev = null;
      this.dyn_ltree = null;
      this.dyn_dtree = null;
      this.static_ltree = null;
      this.static_dtree = null;
      this.bl_tree = null;
      this.l_desc = null;
      this.d_desc = null;
      this.bl_desc = null;
      this.bl_count = null;
      this.heap = null;
      this.depth = null;
      this.length_code = null;
      this.dist_code = null;
      this.base_length = null;
      this.base_dist = null;
      this.flag_buf = null;
    }
  }, {
    key: "reuse_queue",
    value: function reuse_queue(b) {
      b.next = this.free_queue;
      this.free_queue = b;
    }
  }, {
    key: "new_queue",
    value: function new_queue() {
      var b = void 0;
      if (null != this.free_queue) {
        b = this.free_queue;
        this.free_queue = this.free_queue.next;
      } else {
        b = new DeflateBuffer();
      }
      b.next = null;
      b.len = b.off = 0;
      return b;
    }
  }, {
    key: "head1",
    value: function head1(b) {
      return this.prev[this.WSIZE + b];
    }
  }, {
    key: "head2",
    value: function head2(c, a) {
      return this.prev[this.WSIZE + c] = a;
    }
  }, {
    key: "put_byte",
    value: function put_byte(b) {
      this.outbuf[this.outoff + this.outcnt++] = b;
      if (this.outoff + this.outcnt == this.OUTBUFSIZ) {
        this.qoutbuf();
      }
    }
  }, {
    key: "put_short",
    value: function put_short(b) {
      b &= 65535;
      if (this.outoff + this.outcnt < this.OUTBUFSIZ - 2) {
        this.outbuf[this.outoff + this.outcnt++] = 255 & b;
        this.outbuf[this.outoff + this.outcnt++] = b >>> 8;
      } else {
        this.put_byte(255 & b);
        this.put_byte(b >>> 8);
      }
    }
  }, {
    key: "INSERT_STRING",
    value: function INSERT_STRING() {
      this.ins_h = (this.ins_h << this.H_SHIFT ^ 255 & this.window[this.strstart + this.MIN_MATCH - 1]) & this.HASH_MASK;
      this.hash_head = this.head1(this.ins_h);
      this.prev[this.strstart & this.WMASK] = this.hash_head;
      this.head2(this.ins_h, this.strstart);
    }
  }, {
    key: "SEND_CODE",
    value: function SEND_CODE(c, b) {
      this.send_bits(b[c].fc, b[c].dl);
    }
  }, {
    key: "D_CODE",
    value: function D_CODE(b) {
      return 255 & (256 > b ? this.dist_code[b] : this.dist_code[256 + (b >> 7)]);
    }
  }, {
    key: "SMALLER",
    value: function SMALLER(d, b, c) {
      return d[b].fc < d[c].fc || d[b].fc == d[c].fc && this.depth[b] <= this.depth[c];
    }
  }, {
    key: "read_buff",
    value: function read_buff(e, d, b) {
      var c = void 0;
      for (c = 0; c < b && this.deflate_pos < this.deflate_data.length; c++) {
        e[d + c] = 255 & this.deflate_data.charCodeAt(this.deflate_pos++);
      }
      return c;
    }
  }, {
    key: "lm_init",
    value: function lm_init() {
      var b = void 0;
      for (b = 0; b < this.HASH_SIZE; b++) {
        this.prev[this.WSIZE + b] = 0;
      }
      this.max_lazy_match = this.configuration_table[this.compr_level].max_lazy;
      this.good_match = this.configuration_table[this.compr_level].good_length;
      if (!this.FULL_SEARCH) {
        this.nice_match = this.configuration_table[this.compr_level].nice_length;
      }
      this.max_chain_length = this.configuration_table[this.compr_level].max_chain;
      this.strstart = 0;
      this.block_start = 0;
      this.lookahead = this.read_buff(this.window, 0, 2 * this.WSIZE);
      if (0 >= this.lookahead) {
        this.eofile = !0;
        this.lookahead = 0;
        return;
      }
      this.eofile = !1;
      while (this.lookahead < this.MIN_LOOKAHEAD && !this.eofile) {
        this.fill_window();
      }
      this.ins_h = 0;
      for (b = 0; b < this.MIN_MATCH - 1; b++) {
        this.ins_h = (this.ins_h << this.H_SHIFT ^ 255 & this.window[b]) & this.HASH_MASK;
      }
    }
  }, {
    key: "longest_match",
    value: function longest_match(k) {
      var f = this.max_chain_length,
          h = this.strstart,
          c = void 0,
          d = void 0,
          g = this.prev_length,
          b = this.strstart > this.MAX_DIST ? this.strstart - this.MAX_DIST : this.NIL,
          e = this.strstart + this.MAX_MATCH,
          a = this.window[h + g - 1],
          j = this.window[h + g];

      if (this.prev_length >= this.good_match) {
        f >>= 2;
      }
      do {
        c = k;
        if (this.window[c + g] != j || this.window[c + g - 1] != a || this.window[c] != this.window[h] || this.window[++c] != this.window[h + 1]) {
          continue;
        }
        h += 2;
        c++;
        do {} while (this.window[++h] == this.window[++c] && this.window[++h] == this.window[++c] && this.window[++h] == this.window[++c] && this.window[++h] == this.window[++c] && this.window[++h] == this.window[++c] && this.window[++h] == this.window[++c] && this.window[++h] == this.window[++c] && this.window[++h] == this.window[++c] && h < e);
        d = this.MAX_MATCH - (e - h);
        h = e - this.MAX_MATCH;
        if (d > g) {
          this.match_start = k;
          g = d;
          if (this.FULL_SEARCH) {
            if (d >= this.MAX_MATCH) {
              break;
            }
          } else {
            if (d >= this.nice_match) {
              break;
            }
          }
          a = this.window[h + g - 1];
          j = this.window[h + g];
        }
      } while ((k = this.prev[k & this.WMASK]) > b && 0 != --f);
      return g;
    }
  }, {
    key: "fill_window",
    value: function fill_window() {
      var d = void 0,
          c = void 0,
          a = this.window_size - this.lookahead - this.strstart;

      if (-1 == a) {
        a--;
      } else {
        if (this.strstart >= this.WSIZE + this.MAX_DIST) {
          for (d = 0; d < this.WSIZE; d++) {
            this.window[d] = this.window[d + this.WSIZE];
          }
          this.match_start -= this.WSIZE;
          this.strstart -= this.WSIZE;
          this.block_start -= this.WSIZE;
          for (d = 0; d < this.HASH_SIZE; d++) {
            c = this.head1(d);
            this.head2(d, c >= this.WSIZE ? c - this.WSIZE : this.NIL);
          }
          for (d = 0; d < this.WSIZE; d++) {
            c = this.prev[d];
            this.prev[d] = c >= this.WSIZE ? c - this.WSIZE : this.NIL;
          }
          a += this.WSIZE;
        }
      }if (!this.eofile) {
        d = this.read_buff(this.window, this.strstart + this.lookahead, a);
        if (0 >= d) {
          this.eofile = !0;
        } else {
          this.lookahead += d;
        }
      }
    }
  }, {
    key: "deflate_fast",
    value: function deflate_fast() {
      while (0 != this.lookahead && null == this.qhead) {
        var b = void 0;
        this.INSERT_STRING();
        if (this.hash_head != this.NIL && this.strstart - this.hash_head <= this.MAX_DIST) {
          this.match_length = this.longest_match(this.hash_head);
          if (this.match_length > this.lookahead) {
            this.match_length = this.lookahead;
          }
        }
        if (this.match_length >= this.MIN_MATCH) {
          b = this.ct_tally(this.strstart - this.match_start, this.match_length - this.MIN_MATCH);
          this.lookahead -= this.match_length;
          if (this.match_length <= this.max_lazy_match) {
            this.match_length--;
            do {
              this.strstart++;
              this.INSERT_STRING();
            } while (0 != --this.match_length);
            this.strstart++;
          } else {
            this.strstart += this.match_length;
            this.match_length = 0;
            this.ins_h = 255 & this.window[this.strstart];
            this.ins_h = (this.ins_h << this.H_SHIFT ^ 255 & this.window[this.strstart + 1]) & this.HASH_MASK;
          }
        } else {
          b = this.ct_tally(0, 255 & this.window[this.strstart]);
          this.lookahead--;
          this.strstart++;
        }if (b) {
          this.flush_block(0);
          this.block_start = this.strstart;
        }
        while (this.lookahead < this.MIN_LOOKAHEAD && !this.eofile) {
          this.fill_window();
        }
      }
    }
  }, {
    key: "deflate_better",
    value: function deflate_better() {
      while (0 != this.lookahead && null == this.qhead) {
        this.INSERT_STRING();
        this.prev_length = this.match_length;
        this.prev_match = this.match_start;
        this.match_length = this.MIN_MATCH - 1;
        if (this.hash_head != this.NIL && this.prev_length < this.max_lazy_match && this.strstart - this.hash_head <= this.MAX_DIST) {
          this.match_length = this.longest_match(this.hash_head);
          if (this.match_length > this.lookahead) {
            this.match_length = this.lookahead;
          }
          if (this.match_length == this.MIN_MATCH && this.strstart - this.match_start > this.TOO_FAR) {
            this.match_length--;
          }
        }
        if (this.prev_length >= this.MIN_MATCH && this.match_length <= this.prev_length) {
          var b = void 0;
          b = this.ct_tally(this.strstart - 1 - this.prev_match, this.prev_length - this.MIN_MATCH);
          this.lookahead -= this.prev_length - 1;
          this.prev_length -= 2;
          do {
            this.strstart++;
            this.INSERT_STRING();
          } while (0 != --this.prev_length);
          this.match_available = 0;
          this.match_length = this.MIN_MATCH - 1;
          this.strstart++;
          if (b) {
            this.flush_block(0);
            this.block_start = this.strstart;
          }
        } else {
          if (0 != this.match_available) {
            if (this.ct_tally(0, 255 & this.window[this.strstart - 1])) {
              this.flush_block(0);
              this.block_start = this.strstart;
            }
            this.strstart++;
            this.lookahead--;
          } else {
            this.match_available = 1;
            this.strstart++;
            this.lookahead--;
          }
        }
        while (this.lookahead < this.MIN_LOOKAHEAD && !this.eofile) {
          this.fill_window();
        }
      }
    }
  }, {
    key: "init_deflate",
    value: function init_deflate() {
      if (this.eofile) {
        return;
      }
      this.bi_buf = 0;
      this.bi_valid = 0;
      this.ct_init();
      this.lm_init();
      this.qhead = null;
      this.outcnt = 0;
      this.outoff = 0;
      if (3 >= this.compr_level) {
        this.prev_length = this.MIN_MATCH - 1;
        this.match_length = 0;
      } else {
        this.match_length = this.MIN_MATCH - 1;
        this.match_available = 0;
      }
      this.complete = !1;
    }
  }, {
    key: "deflate_internal",
    value: function deflate_internal(e, d, b) {
      var a = void 0;
      if (!this.initflag) {
        this.init_deflate();
        this.initflag = !0;
        if (0 == this.lookahead) {
          this.complete = !0;
          return 0;
        }
      }
      if ((a = this.qcopy(e, d, b)) == b) {
        return b;
      }
      if (this.complete) {
        return a;
      }
      if (3 >= this.compr_level) {
        this.deflate_fast();
      } else {
        this.deflate_better();
      }if (0 == this.lookahead) {
        if (0 != this.match_available) {
          this.ct_tally(0, 255 & this.window[this.strstart - 1]);
        }
        this.flush_block(1);
        this.complete = !0;
      }
      return a + this.qcopy(e, a + d, b - a);
    }
  }, {
    key: "qcopy",
    value: function qcopy(h, g, e) {
      var b = void 0,
          f = void 0,
          c = void 0;
      b = 0;
      while (null != this.qhead && b < e) {
        f = e - b;
        if (f > this.qhead.len) {
          f = this.qhead.len;
        }
        for (c = 0; c < f; c++) {
          h[g + b + c] = this.qhead.ptr[this.qhead.off + c];
        }
        this.qhead.off += f;
        this.qhead.len -= f;
        b += f;
        if (0 == this.qhead.len) {
          var a = void 0;
          a = this.qhead;
          this.qhead = this.qhead.next;
          this.reuse_queue(a);
        }
      }
      if (b == e) {
        return b;
      }
      if (this.outoff < this.outcnt) {
        f = e - b;
        if (f > this.outcnt - this.outoff) {
          f = this.outcnt - this.outoff;
        }
        for (c = 0; c < f; c++) {
          h[g + b + c] = this.outbuf[this.outoff + c];
        }
        this.outoff += f;
        b += f;
        if (this.outcnt == this.outoff) {
          this.outcnt = this.outoff = 0;
        }
      }
      return b;
    }
  }, {
    key: "ct_init",
    value: function ct_init() {
      var f = void 0,
          e = void 0,
          c = void 0,
          b = void 0,
          a = void 0;

      if (0 != this.static_dtree[0].dl) {
        return;
      }
      this.l_desc.dyn_tree = this.dyn_ltree;
      this.l_desc.static_tree = this.static_ltree;
      this.l_desc.extra_bits = this.extra_lbits;
      this.l_desc.extra_base = this.LITERALS + 1;
      this.l_desc.elems = this.L_CODES;
      this.l_desc.max_length = this.MAX_BITS;
      this.l_desc.max_code = 0;
      this.d_desc.dyn_tree = this.dyn_dtree;
      this.d_desc.static_tree = this.static_dtree;
      this.d_desc.extra_bits = this.extra_dbits;
      this.d_desc.extra_base = 0;
      this.d_desc.elems = this.D_CODES;
      this.d_desc.max_length = this.MAX_BITS;
      this.d_desc.max_code = 0;
      this.bl_desc.dyn_tree = this.bl_tree;
      this.bl_desc.static_tree = null;
      this.bl_desc.extra_bits = this.extra_blbits;
      this.bl_desc.extra_base = 0;
      this.bl_desc.elems = this.BL_CODES;
      this.bl_desc.max_length = this.MAX_BL_BITS;
      this.bl_desc.max_code = 0;
      c = 0;
      for (b = 0; b < this.LENGTH_CODES - 1; b++) {
        this.base_length[b] = c;
        for (f = 0; f < 1 << this.extra_lbits[b]; f++) {
          this.length_code[c++] = b;
        }
      }
      this.length_code[c - 1] = b;
      a = 0;
      for (b = 0; 16 > b; b++) {
        this.base_dist[b] = a;
        for (f = 0; f < 1 << this.extra_dbits[b]; f++) {
          this.dist_code[a++] = b;
        }
      }
      a >>= 7;
      for (; b < this.D_CODES; b++) {
        this.base_dist[b] = a << 7;
        for (f = 0; f < 1 << this.extra_dbits[b] - 7; f++) {
          this.dist_code[256 + a++] = b;
        }
      }
      for (e = 0; e <= this.MAX_BITS; e++) {
        this.bl_count[e] = 0;
      }
      f = 0;
      while (143 >= f) {
        this.static_ltree[f++].dl = 8;
        this.bl_count[8]++;
      }
      while (255 >= f) {
        this.static_ltree[f++].dl = 9;
        this.bl_count[9]++;
      }
      while (279 >= f) {
        this.static_ltree[f++].dl = 7;
        this.bl_count[7]++;
      }
      while (287 >= f) {
        this.static_ltree[f++].dl = 8;
        this.bl_count[8]++;
      }
      this.gen_codes(this.static_ltree, this.L_CODES + 1);
      for (f = 0; f < this.D_CODES; f++) {
        this.static_dtree[f].dl = 5;
        this.static_dtree[f].fc = this.bi_reverse(f, 5);
      }
      this.init_block();
    }
  }, {
    key: "init_block",
    value: function init_block() {
      var b = void 0;
      for (b = 0; b < this.L_CODES; b++) {
        this.dyn_ltree[b].fc = 0;
      }
      for (b = 0; b < this.D_CODES; b++) {
        this.dyn_dtree[b].fc = 0;
      }
      for (b = 0; b < this.BL_CODES; b++) {
        this.bl_tree[b].fc = 0;
      }
      this.dyn_ltree[this.END_BLOCK].fc = 1;
      this.opt_len = this.static_len = 0;
      this.last_lit = this.last_dist = this.last_flags = 0;
      this.flags = 0;
      this.flag_bit = 1;
    }
  }, {
    key: "pqdownheap",
    value: function pqdownheap(e, a) {
      var c = this.heap[a],
          b = a << 1;

      while (b <= this.heap_len) {
        if (b < this.heap_len && this.SMALLER(e, this.heap[b + 1], this.heap[b])) {
          b++;
        }
        if (this.SMALLER(e, c, this.heap[b])) {
          break;
        }
        this.heap[a] = this.heap[b];
        a = b;
        b <<= 1;
      }
      this.heap[a] = c;
    }
  }, {
    key: "gen_bitlen",
    value: function gen_bitlen(f) {
      var h = f.dyn_tree,
          k = f.extra_bits,
          d = f.extra_base,
          a = f.max_code,
          l = f.max_length,
          m = f.static_tree,
          n = void 0,
          i = void 0,
          b = void 0,
          c = void 0,
          o = void 0,
          g = void 0,
          j = 0;

      for (c = 0; c <= this.MAX_BITS; c++) {
        this.bl_count[c] = 0;
      }
      h[this.heap[this.heap_max]].dl = 0;
      for (n = this.heap_max + 1; n < this.HEAP_SIZE; n++) {
        i = this.heap[n];
        c = h[h[i].dl].dl + 1;
        if (c > l) {
          c = l;
          j++;
        }
        h[i].dl = c;
        if (i > a) {
          continue;
        }
        this.bl_count[c]++;
        o = 0;
        if (i >= d) {
          o = k[i - d];
        }
        g = h[i].fc;
        this.opt_len += g * (c + o);
        if (null != m) {
          this.static_len += g * (m[i].dl + o);
        }
      }
      if (0 == j) {
        return;
      }
      do {
        c = l - 1;
        while (0 == this.bl_count[c]) {
          c--;
        }
        this.bl_count[c]--;
        this.bl_count[c + 1] += 2;
        this.bl_count[l]--;
        j -= 2;
      } while (0 < j);
      for (c = l; 0 != c; c--) {
        i = this.bl_count[c];
        while (0 != i) {
          b = this.heap[--n];
          if (b > a) {
            continue;
          }
          if (h[b].dl != c) {
            this.opt_len += (c - h[b].dl) * h[b].fc;
            h[b].fc = c;
          }
          i--;
        }
      }
    }
  }, {
    key: "gen_codes",
    value: function gen_codes(h, b) {
      var g = Array(this.MAX_BITS + 1),
          d = 0,
          c = void 0,
          e = void 0;

      for (c = 1; c <= this.MAX_BITS; c++) {
        d = d + this.bl_count[c - 1] << 1;
        g[c] = d;
      }
      for (e = 0; e <= b; e++) {
        var f = h[e].dl;
        if (0 == f) {
          continue;
        }
        h[e].fc = this.bi_reverse(g[f]++, f);
      }
    }
  }, {
    key: "build_tree",
    value: function build_tree(j) {
      var f = j.dyn_tree,
          i = j.static_tree,
          h = j.elems,
          a = void 0,
          b = void 0,
          d = -1,
          g = h;

      this.heap_len = 0;
      this.heap_max = this.HEAP_SIZE;
      for (a = 0; a < h; a++) {
        if (0 != f[a].fc) {
          this.heap[++this.heap_len] = d = a;
          this.depth[a] = 0;
        } else {
          f[a].dl = 0;
        }
      }
      while (2 > this.heap_len) {
        var c = this.heap[++this.heap_len] = 2 > d ? ++d : 0;
        f[c].fc = 1;
        this.depth[c] = 0;
        this.opt_len--;
        if (null != i) {
          this.static_len -= i[c].dl;
        }
      }
      j.max_code = d;
      for (a = this.heap_len >> 1; 1 <= a; a--) {
        this.pqdownheap(f, a);
      }
      do {
        a = this.heap[this.SMALLEST];
        this.heap[this.SMALLEST] = this.heap[this.heap_len--];
        this.pqdownheap(f, this.SMALLEST);
        b = this.heap[this.SMALLEST];
        this.heap[--this.heap_max] = a;
        this.heap[--this.heap_max] = b;
        f[g].fc = f[a].fc + f[b].fc;
        if (this.depth[a] > this.depth[b] + 1) {
          this.depth[g] = this.depth[a];
        } else {
          this.depth[g] = this.depth[b] + 1;
        }
        f[a].dl = f[b].dl = g;
        this.heap[this.SMALLEST] = g++;
        this.pqdownheap(f, this.SMALLEST);
      } while (2 <= this.heap_len);
      this.heap[--this.heap_max] = this.heap[this.SMALLEST];
      this.gen_bitlen(j);
      this.gen_codes(f, d);
    }
  }, {
    key: "scan_tree",
    value: function scan_tree(j, i) {
      var h = void 0,
          b = -1,
          f = void 0,
          a = j[0].dl,
          d = 0,
          e = 7,
          c = 4;

      if (0 == a) {
        e = 138;
        c = 3;
      }
      j[i + 1].dl = 65535;
      for (h = 0; h <= i; h++) {
        f = a;
        a = j[h + 1].dl;
        if (++d < e && f == a) {
          continue;
        } else {
          if (d < c) {
            this.bl_tree[f].fc += d;
          } else {
            if (0 != f) {
              if (f != b) {
                this.bl_tree[f].fc++;
              }
              this.bl_tree[this.REP_3_6].fc++;
            } else {
              if (10 >= d) {
                this.bl_tree[this.REPZ_3_10].fc++;
              } else {
                this.bl_tree[this.REPZ_11_138].fc++;
              }
            }
          }
        }
        d = 0;
        b = f;
        if (0 == a) {
          e = 138;
          c = 3;
        } else {
          if (f == a) {
            e = 6;
            c = 3;
          } else {
            e = 7;
            c = 4;
          }
        }
      }
    }
  }, {
    key: "send_tree",
    value: function send_tree(j, i) {
      var h = void 0,
          b = -1,
          f = void 0,
          a = j[0].dl,
          d = 0,
          e = 7,
          c = 4;

      if (0 == a) {
        e = 138;
        c = 3;
      }
      for (h = 0; h <= i; h++) {
        f = a;
        a = j[h + 1].dl;
        if (++d < e && f == a) {
          continue;
        } else {
          if (d < c) {
            do {
              this.SEND_CODE(f, this.bl_tree);
            } while (0 != --d);
          } else {
            if (0 != f) {
              if (f != b) {
                this.SEND_CODE(f, this.bl_tree);
                d--;
              }
              this.SEND_CODE(this.REP_3_6, this.bl_tree);
              this.send_bits(d - 3, 2);
            } else {
              if (10 >= d) {
                this.SEND_CODE(this.REPZ_3_10, this.bl_tree);
                this.send_bits(d - 3, 3);
              } else {
                this.SEND_CODE(this.REPZ_11_138, this.bl_tree);
                this.send_bits(d - 11, 7);
              }
            }
          }
        }
        d = 0;
        b = f;
        if (0 == a) {
          e = 138;
          c = 3;
        } else {
          if (f == a) {
            e = 6;
            c = 3;
          } else {
            e = 7;
            c = 4;
          }
        }
      }
    }
  }, {
    key: "build_bl_tree",
    value: function build_bl_tree() {
      var b = void 0;
      this.scan_tree(this.dyn_ltree, this.l_desc.max_code);
      this.scan_tree(this.dyn_dtree, this.d_desc.max_code);
      this.build_tree(this.bl_desc);
      for (b = this.BL_CODES - 1; 3 <= b; b--) {
        if (0 != this.bl_tree[this.bl_order[b]].dl) {
          break;
        }
      }
      this.opt_len += 3 * (b + 1) + 5 + 5 + 4;
      return b;
    }
  }, {
    key: "send_all_trees",
    value: function send_all_trees(e, b, a) {
      var c = void 0;
      this.send_bits(e - 257, 5);
      this.send_bits(b - 1, 5);
      this.send_bits(a - 4, 4);
      for (c = 0; c < a; c++) {
        this.send_bits(this.bl_tree[this.bl_order[c]].dl, 3);
      }
      this.send_tree(this.dyn_ltree, e - 1);
      this.send_tree(this.dyn_dtree, b - 1);
    }
  }, {
    key: "flush_block",
    value: function flush_block(g) {
      var a = void 0,
          c = void 0,
          b = void 0,
          e = void 0;

      e = this.strstart - this.block_start;
      this.flag_buf[this.last_flags] = this.flags;
      this.build_tree(this.l_desc);
      this.build_tree(this.d_desc);
      b = this.build_bl_tree();
      a = this.opt_len + 3 + 7 >> 3;
      c = this.static_len + 3 + 7 >> 3;
      if (c <= a) {
        a = c;
      }
      if (e + 4 <= a && 0 <= this.block_start) {
        var h = void 0;
        this.send_bits((this.STORED_BLOCK << 1) + g, 3);
        this.bi_windup();
        this.put_short(e);
        this.put_short(~e);
        for (h = 0; h < e; h++) {
          this.put_byte(this.window[this.block_start + h]);
        }
      } else {
        if (c == a) {
          this.send_bits((this.STATIC_TREES << 1) + g, 3);
          this.compress_block(this.static_ltree, this.static_dtree);
        } else {
          this.send_bits((this.DYN_TREES << 1) + g, 3);
          this.send_all_trees(this.l_desc.max_code + 1, this.d_desc.max_code + 1, b + 1);
          this.compress_block(this.dyn_ltree, this.dyn_dtree);
        }
      }
      this.init_block();
      if (0 != g) {
        this.bi_windup();
      }
    }
  }, {
    key: "ct_tally",
    value: function ct_tally(f, e) {
      this.l_buf[this.last_lit++] = e;
      if (0 == f) {
        this.dyn_ltree[e].fc++;
      } else {
        f--;
        this.dyn_ltree[this.length_code[e] + this.LITERALS + 1].fc++;
        this.dyn_dtree[this.D_CODE(f)].fc++;
        this.d_buf[this.last_dist++] = f;
        this.flags |= this.flag_bit;
      }
      this.flag_bit <<= 1;
      if (0 == (7 & this.last_lit)) {
        this.flag_buf[this.last_flags++] = this.flags;
        this.flags = 0;
        this.flag_bit = 1;
      }
      if (2 < this.compr_level && 0 == (4095 & this.last_lit)) {
        var c = 8 * this.last_lit,
            a = this.strstart - this.block_start,
            d = void 0;

        for (d = 0; d < this.D_CODES; d++) {
          c += this.dyn_dtree[d].fc * (5 + this.extra_dbits[d]);
        }
        c >>= 3;
        if (this.last_dist < parseInt(this.last_lit / 2) && c < parseInt(a / 2)) {
          return !0;
        }
      }
      return this.last_lit == this.LIT_BUFSIZE - 1 || this.last_dist == this.DIST_BUFSIZE;
    }
  }, {
    key: "compress_block",
    value: function compress_block(k, g) {
      var e = void 0,
          i = void 0,
          b = 0,
          c = 0,
          j = 0,
          f = 0,
          h = void 0,
          a = void 0;

      if (0 != this.last_lit) {
        do {
          if (0 == (7 & b)) {
            f = this.flag_buf[j++];
          }
          i = 255 & this.l_buf[b++];
          if (0 == (1 & f)) {
            this.SEND_CODE(i, k);
          } else {
            h = this.length_code[i];
            this.SEND_CODE(h + this.LITERALS + 1, k);
            a = this.extra_lbits[h];
            if (0 != a) {
              i -= this.base_length[h];
              this.send_bits(i, a);
            }
            e = this.d_buf[c++];
            h = this.D_CODE(e);
            this.SEND_CODE(h, g);
            a = this.extra_dbits[h];
            if (0 != a) {
              e -= this.base_dist[h];
              this.send_bits(e, a);
            }
          }
          f >>= 1;
        } while (b < this.last_lit);
      }
      this.SEND_CODE(this.END_BLOCK, k);
    }
  }, {
    key: "send_bits",
    value: function send_bits(c, b) {
      if (this.bi_valid > this.BUF_SIZE - b) {
        this.bi_buf |= c << this.bi_valid;
        this.put_short(this.bi_buf);
        this.bi_buf = c >> this.BUF_SIZE - this.bi_valid;
        this.bi_valid += b - this.BUF_SIZE;
      } else {
        this.bi_buf |= c << this.bi_valid;
        this.bi_valid += b;
      }
    }
  }, {
    key: "bi_reverse",
    value: function bi_reverse(d, c) {
      var a = 0;
      do {
        a |= 1 & d;
        d >>= 1;
        a <<= 1;
      } while (0 < --c);
      return a >> 1;
    }
  }, {
    key: "bi_windup",
    value: function bi_windup() {
      if (8 < this.bi_valid) {
        this.put_short(this.bi_buf);
      } else {
        if (0 < this.bi_valid) {
          this.put_byte(this.bi_buf);
        }
      }
      this.bi_buf = 0;
      this.bi_valid = 0;
    }
  }, {
    key: "qoutbuf",
    value: function qoutbuf() {
      if (0 != this.outcnt) {
        var c = void 0,
            b = void 0;
        c = this.new_queue();
        if (null == this.qhead) {
          this.qhead = this.qtail = c;
        } else {
          this.qtail = this.qtail.next = c;
        }
        c.len = this.outcnt - this.outoff;
        for (b = 0; b < c.len; b++) {
          c.ptr[b] = this.outbuf[this.outoff + b];
        }
        this.outcnt = this.outoff = 0;
      }
    }
  }, {
    key: "deflate",
    value: function deflate(g, d) {
      var h = void 0,
          b = void 0,
          e = void 0,
          c = void 0;

      this.deflate_data = g;
      this.deflate_pos = 0;
      if ("undefined" == typeof d) {
        d = this.DEFAULT_LEVEL;
      }
      this.deflate_start(d);
      b = Array(1024);
      h = "";
      while (0 < (e = this.deflate_internal(b, 0, b.length))) {
        for (c = 0; c < e; c++) {
          h += String.fromCharCode(b[c]);
        }
      }
      this.deflate_data = null;
      return h;
    }
  }]);

  return a;
}();

},{}]},{},[2]);
