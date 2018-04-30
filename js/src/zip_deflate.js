class DeflateCT {
  constructor(){
    this.fc = 0;
    this.dl = 0;
  }
}

class DeflateTreeDesc {
  constructor() {
    this.dyn_tree = null;
    this.static_tree = null;
    this.extra_bits = null;
    this.extra_base = 0;
    this.elems = 0;
    this.max_length = 0;
    this.max_code = 0
  }
}

class DeflateConfiguration {
  constructor(f, e, h, g) {
    this.good_length = f;
    this.max_lazy = e;
    this.nice_length = h;
    this.max_chain = g
  }
}

class DeflateBuffer {
  constructor() {
    this.next = null;
    this.len = 0;
    this.ptr = new Array(this.OUTBUFSIZ);
    this.off = 0
  }
}

export class Zip {
  constructor() {
    this.BUF_SIZE = 16;
    this.WSIZE = 32768;
    this.STORED_BLOCK = 0;
    this.STATIC_TREES = 1;
    this.DYN_TREES = 2;
    this.DEFAULT_LEVEL = 6;
    this.FULL_SEARCH = true;
    this.INBUFSIZ = 32768;
    this.INBUF_EXTRA = 64;
    this.OUTBUFSIZ = 1024 * 8;
    this.window_size = 2 * this.WSIZE;
    this.MIN_MATCH = 3;
    this.MAX_MATCH = 258;
    this.BITS = 16;
    this.LIT_BUFSIZE = 8192;
    this.HASH_BITS = 13;
    if (this.LIT_BUFSIZE > this.INBUFSIZ) {
      alert("error: this.INBUFSIZ is too small")
    }
    if ((this.WSIZE << 1) > (1 << this.BITS)) {
      alert("error: this.WSIZE is too large")
    }
    if (this.HASH_BITS > this.BITS - 1) {
      alert("error: this.HASH_BITS is too large")
    }
    if (this.HASH_BITS < 8 || this.MAX_MATCH != 258) {
      alert("error: Code too clever")
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
    this.free_queue = undefined;
    this.qhead = undefined;
    this.qtail = undefined;
    this.initflag = undefined;
    this.outbuf = null;
    this.outcnt = undefined
    this.outoff = undefined;
    this.complete = undefined;
    this.window = undefined;
    this.d_buf = undefined;
    this.l_buf = undefined;
    this.prev = undefined;
    this.bi_buf = undefined;
    this.bi_valid = undefined;
    this.block_start = undefined;
    this.ins_h = undefined;
    this.hash_head = undefined;
    this.prev_match = undefined;
    this.match_available = undefined;
    this.match_length = undefined;
    this.prev_length = undefined;
    this.strstart = undefined;
    this.match_start = undefined;
    this.eofile = undefined;
    this.lookahead = undefined;
    this.max_chain_length = undefined;
    this.max_lazy_match = undefined;
    this.compr_level = undefined;
    this.good_match = undefined;
    this.nice_match = undefined;
    this.dyn_ltree = undefined;
    this.dyn_dtree = undefined;
    this.static_ltree = undefined;
    this.static_dtree = undefined;
    this.bl_tree = undefined;
    this.l_desc = undefined;
    this.d_desc = undefined;
    this.bl_desc = undefined;
    this.bl_count = undefined;
    this.heap = undefined;
    this.heap_len = undefined;
    this.heap_max = undefined;
    this.depth = undefined;
    this.length_code = undefined;
    this.dist_code = undefined;
    this.base_length = undefined;
    this.base_dist = undefined;
    this.flag_buf = undefined;
    this.last_lit = undefined;
    this.last_dist = undefined;
    this.last_flags = undefined;
    this.flags = undefined;
    this.flag_bit = undefined;
    this.opt_len = undefined;
    this.static_len = undefined;
    this.deflate_data = undefined;
    this.deflate_pos = undefined;
    this.extra_lbits = new Array(0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0);
    this.extra_dbits = new Array(0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13);
    this.extra_blbits = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7);
    this.bl_order = new Array(16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15);
    this.configuration_table = new Array(new DeflateConfiguration(0, 0, 0, 0), new DeflateConfiguration(4, 4, 8, 4), new DeflateConfiguration(4, 5, 16, 8), new DeflateConfiguration(4, 6, 32, 32), new DeflateConfiguration(4, 4, 16, 16), new DeflateConfiguration(8, 16, 32, 32), new DeflateConfiguration(8, 16, 128, 128), new DeflateConfiguration(8, 32, 128, 256), new DeflateConfiguration(32, 128, 258, 1024), new DeflateConfiguration(32, 258, 258, 4096));
  }

  deflate_start(b) {
    let a;
    if (!b) {
      b = this.DEFAULT_LEVEL
    } else {
      if (b < 1) {
        b = 1
      } else {
        if (b > 9) {
          b = 9
        }
      }
    }
    this.compr_level = b;
    this.initflag = false;
    this.eofile = false;
    if (this.outbuf != null) {
      return
    }
    this.free_queue = this.qhead = this.qtail = null;
    this.outbuf = new Array(this.OUTBUFSIZ);
    this.window = new Array(this.window_size);
    this.d_buf = new Array(this.DIST_BUFSIZE);
    this.l_buf = new Array(this.INBUFSIZ + this.INBUF_EXTRA);
    this.prev = new Array(1 << this.BITS);
    this.dyn_ltree = new Array(this.HEAP_SIZE);
    for (a = 0; a < this.HEAP_SIZE; a++) {
      this.dyn_ltree[a] = new DeflateCT()
    }
    this.dyn_dtree = new Array(2 * this.D_CODES + 1);
    for (a = 0; a < 2 * this.D_CODES + 1; a++) {
      this.dyn_dtree[a] = new DeflateCT()
    }
    this.static_ltree = new Array(this.L_CODES + 2);
    for (a = 0; a < this.L_CODES + 2; a++) {
      this.static_ltree[a] = new DeflateCT()
    }
    this.static_dtree = new Array(this.D_CODES);
    for (a = 0; a < this.D_CODES; a++) {
      this.static_dtree[a] = new DeflateCT()
    }
    this.bl_tree = new Array(2 * this.BL_CODES + 1);
    for (a = 0; a < 2 * this.BL_CODES + 1; a++) {
      this.bl_tree[a] = new DeflateCT()
    }
    this.l_desc = new DeflateTreeDesc();
    this.d_desc = new DeflateTreeDesc();
    this.bl_desc = new DeflateTreeDesc();
    this.bl_count = new Array(this.MAX_BITS + 1);
    this.heap = new Array(2 * this.L_CODES + 1);
    this.depth = new Array(2 * this.L_CODES + 1);
    this.length_code = new Array(this.MAX_MATCH - this.MIN_MATCH + 1);
    this.dist_code = new Array(512);
    this.base_length = new Array(this.LENGTH_CODES);
    this.base_dist = new Array(this.D_CODES);
    this.flag_buf = new Array(parseInt(this.LIT_BUFSIZE / 8))
  }

  deflate_end() {
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
    this.flag_buf = null
  }

  reuse_queue(a) {
    a.next = this.free_queue;
    this.free_queue = a
  }

  new_queue() {
    let a;
    if (this.free_queue != null) {
      a = this.free_queue;
      this.free_queue = this.free_queue.next
    } else {
      a = new DeflateBuffer()
    }
    a.next = null;
    a.len = a.off = 0;
    return a
  }

  head1(a) {
    return this.prev[this.WSIZE + a]
  }

  head2(a, b) {
    return this.prev[this.WSIZE + a] = b
  }

  put_byte(a) {
    this.outbuf[this.outoff + this.outcnt++] = a;
    if (this.outoff + this.outcnt == this.OUTBUFSIZ) {
      this.qoutbuf()
    }
  }

  put_short(a) {
    a &= 65535;
    if (this.outoff + this.outcnt < this.OUTBUFSIZ - 2) {
      this.outbuf[this.outoff + this.outcnt++] = (a & 255);
      this.outbuf[this.outoff + this.outcnt++] = (a >>> 8)
    } else {
      this.put_byte(a & 255);
      this.put_byte(a >>> 8)
    }
  }

  INSERT_STRING() {
    this.ins_h = ((this.ins_h << this.H_SHIFT) ^ (this.window[this.strstart + this.MIN_MATCH - 1] & 255)) & this.HASH_MASK;
    this.hash_head = this.head1(this.ins_h);
    this.prev[this.strstart & this.WMASK] = this.hash_head;
    this.head2(this.ins_h, this.strstart)
  }

  SEND_CODE(b, a) {
    this.send_bits(a[b].fc, a[b].dl)
  }

  D_CODE(a) {
    return (a < 256 ? this.dist_code[a] : this.dist_code[256 + (a >> 7)]) & 255
  }

  SMALLER(b, c, a) {
    return b[c].fc < b[a].fc || (b[c].fc == b[a].fc && this.depth[c] <= this.depth[a])
  }

  read_buff(d, b, c) {
    let a;
    for (a = 0; a < c && this.deflate_pos < this.deflate_data.length; a++) {
      d[b + a] = this.deflate_data.charCodeAt(this.deflate_pos++) & 255
    }
    return a
  }

  lm_init() {
    let a;
    for (a = 0; a < this.HASH_SIZE; a++) {
      this.prev[this.WSIZE + a] = 0
    }
    this.max_lazy_match = this.configuration_table[this.compr_level].max_lazy;
    this.good_match = this.configuration_table[this.compr_level].good_length;
    if (!this.FULL_SEARCH) {
      this.nice_match = this.configuration_table[this.compr_level].nice_length
    }
    this.max_chain_length = this.configuration_table[this.compr_level].max_chain;
    this.strstart = 0;
    this.block_start = 0;
    this.lookahead = this.read_buff(this.window, 0, 2 * this.WSIZE);
    if (this.lookahead <= 0) {
      this.eofile = true;
      this.lookahead = 0;
      return
    }
    this.eofile = false;
    while (this.lookahead < this.MIN_LOOKAHEAD && !this.eofile) {
      this.fill_window()
    }
    this.ins_h = 0;
    for (a = 0; a < this.MIN_MATCH - 1; a++) {
      this.ins_h = ((this.ins_h << this.H_SHIFT) ^ (this.window[a] & 255)) & this.HASH_MASK
    }
  }

  longest_match(f) {
    let h = this.max_chain_length;
    let c = this.strstart;
    let d;
    let g;
    let b = this.prev_length;
    let e = (this.strstart > this.MAX_DIST ? this.strstart - this.MAX_DIST : this.NIL);
    let a = this.strstart + this.MAX_MATCH;
    let j = this.window[c + b - 1];
    let i = this.window[c + b];
    if (this.prev_length >= this.good_match) {
      h >>= 2
    }
    do {
      d = f;
      if (this.window[d + b] != i || this.window[d + b - 1] != j || this.window[d] != this.window[c] || this.window[++d] != this.window[c + 1]) {
        continue
      }
      c += 2;
      d++;
      do {} while (this.window[++c] == this.window[++d] && this.window[++c] == this.window[++d] && this.window[++c] == this.window[++d] && this.window[++c] == this.window[++d] && this.window[++c] == this.window[++d] && this.window[++c] == this.window[++d] && this.window[++c] == this.window[++d] && this.window[++c] == this.window[++d] && c < a);
      g = this.MAX_MATCH - (a - c);
      c = a - this.MAX_MATCH;
      if (g > b) {
        this.match_start = f;
        b = g;
        if (this.FULL_SEARCH) {
          if (g >= this.MAX_MATCH) {
            break
          }
        } else {
          if (g >= this.nice_match) {
            break
          }
        }
        j = this.window[c + b - 1];
        i = this.window[c + b]
      }
    } while ((f = this.prev[f & this.WMASK]) > e && --h != 0);
    return b
  }

  fill_window() {
    let c, a;
    let b = this.window_size - this.lookahead - this.strstart;
    if (b == -1) {
      b--
    } else {
      if (this.strstart >= this.WSIZE + this.MAX_DIST) {
        for (c = 0; c < this.WSIZE; c++) {
          this.window[c] = this.window[c + this.WSIZE]
        }
        this.match_start -= this.WSIZE;
        this.strstart -= this.WSIZE;
        this.block_start -= this.WSIZE;
        for (c = 0; c < this.HASH_SIZE; c++) {
          a = this.head1(c);
          this.head2(c, a >= this.WSIZE ? a - this.WSIZE : this.NIL)
        }
        for (c = 0; c < this.WSIZE; c++) {
          a = this.prev[c];
          this.prev[c] = (a >= this.WSIZE ? a - this.WSIZE : this.NIL)
        }
        b += this.WSIZE
      }
    } if (!this.eofile) {
      c = this.read_buff(this.window, this.strstart + this.lookahead, b);
      if (c <= 0) {
        this.eofile = true
      } else {
        this.lookahead += c
      }
    }
  }

  deflate_fast() {
    while (this.lookahead != 0 && this.qhead == null) {
      let a;
      this.INSERT_STRING();
      if (this.hash_head != this.NIL && this.strstart - this.hash_head <= this.MAX_DIST) {
        this.match_length = this.longest_match(this.hash_head);
        if (this.match_length > this.lookahead) {
          this.match_length = this.lookahead
        }
      }
      if (this.match_length >= this.MIN_MATCH) {
        a = this.ct_tally(this.strstart - this.match_start, this.match_length - this.MIN_MATCH);
        this.lookahead -= this.match_length;
        if (this.match_length <= this.max_lazy_match) {
          this.match_length--;
          do {
            this.strstart++;
            this.INSERT_STRING()
          } while (--this.match_length != 0);
          this.strstart++
        } else {
          this.strstart += this.match_length;
          this.match_length = 0;
          this.ins_h = this.window[this.strstart] & 255;
          this.ins_h = ((this.ins_h << this.H_SHIFT) ^ (this.window[this.strstart + 1] & 255)) & this.HASH_MASK
        }
      } else {
        a = this.ct_tally(0, this.window[this.strstart] & 255);
        this.lookahead--;
        this.strstart++
      } if (a) {
        this.flush_block(0);
        this.block_start = this.strstart
      }
      while (this.lookahead < this.MIN_LOOKAHEAD && !this.eofile) {
        this.fill_window()
      }
    }
  }

  deflate_better() {
    while (this.lookahead != 0 && this.qhead == null) {
      this.INSERT_STRING();
      this.prev_length = this.match_length;
      this.prev_match = this.match_start;
      this.match_length = this.MIN_MATCH - 1;
      if (this.hash_head != this.NIL && this.prev_length < this.max_lazy_match && this.strstart - this.hash_head <= this.MAX_DIST) {
        this.match_length = this.longest_match(this.hash_head);
        if (this.match_length > this.lookahead) {
          this.match_length = this.lookahead
        }
        if (this.match_length == this.MIN_MATCH && this.strstart - this.match_start > this.TOO_FAR) {
          this.match_length--
        }
      }
      if (this.prev_length >= this.MIN_MATCH && this.match_length <= this.prev_length) {
        let a;
        a = this.ct_tally(this.strstart - 1 - this.prev_match, this.prev_length - this.MIN_MATCH);
        this.lookahead -= this.prev_length - 1;
        this.prev_length -= 2;
        do {
          this.strstart++;
          this.INSERT_STRING()
        } while (--this.prev_length != 0);
        this.match_available = 0;
        this.match_length = this.MIN_MATCH - 1;
        this.strstart++;
        if (a) {
          this.flush_block(0);
          this.block_start = this.strstart
        }
      } else {
        if (this.match_available != 0) {
          if (this.ct_tally(0, this.window[this.strstart - 1] & 255)) {
            this.flush_block(0);
            this.block_start = this.strstart
          }
          this.strstart++;
          this.lookahead--
        } else {
          this.match_available = 1;
          this.strstart++;
          this.lookahead--
        }
      }
      while (this.lookahead < this.MIN_LOOKAHEAD && !this.eofile) {
        this.fill_window()
      }
    }
  }

  init_deflate() {
    if (this.eofile) {
      return
    }
    this.bi_buf = 0;
    this.bi_valid = 0;
    this.ct_init();
    this.lm_init();
    this.qhead = null;
    this.outcnt = 0;
    this.outoff = 0;
    if (this.compr_level <= 3) {
      this.prev_length = this.MIN_MATCH - 1;
      this.match_length = 0
    } else {
      this.match_length = this.MIN_MATCH - 1;
      this.match_available = 0
    }
    this.complete = false
  }

  deflate_internal(d, b, a) {
    let c;
    if (!this.initflag) {
      this.init_deflate();
      this.initflag = true;
      if (this.lookahead == 0) {
        this.complete = true;
        return 0
      }
    }
    if ((c = this.qcopy(d, b, a)) == a) {
      return a
    }
    if (this.complete) {
      return c
    }
    if (this.compr_level <= 3) {
      this.deflate_fast()
    } else {
      this.deflate_better()
    } if (this.lookahead == 0) {
      if (this.match_available != 0) {
        this.ct_tally(0, this.window[this.strstart - 1] & 255)
      }
      this.flush_block(1);
      this.complete = true
    }
    return c + this.qcopy(d, c + b, a - c)
  }

  qcopy(g, e, b) {
    let f, c, a;
    f = 0;
    while (this.qhead != null && f < b) {
      c = b - f;
      if (c > this.qhead.len) {
        c = this.qhead.len
      }
      for (a = 0; a < c; a++) {
        g[e + f + a] = this.qhead.ptr[this.qhead.off + a]
      }
      this.qhead.off += c;
      this.qhead.len -= c;
      f += c;
      if (this.qhead.len == 0) {
        let d;
        d = this.qhead;
        this.qhead = this.qhead.next;
        this.reuse_queue(d)
      }
    }
    if (f == b) {
      return f
    }
    if (this.outoff < this.outcnt) {
      c = b - f;
      if (c > this.outcnt - this.outoff) {
        c = this.outcnt - this.outoff
      }
      for (a = 0; a < c; a++) {
        g[e + f + a] = this.outbuf[this.outoff + a]
      }
      this.outoff += c;
      f += c;
      if (this.outcnt == this.outoff) {
        this.outcnt = this.outoff = 0
      }
    }
    return f
  }

  ct_init() {
    let e;
    let c;
    let b;
    let a;
    let d;
    if (this.static_dtree[0].dl != 0) {
      return
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
    b = 0;
    for (a = 0; a < this.LENGTH_CODES - 1; a++) {
      this.base_length[a] = b;
      for (e = 0; e < (1 << this.extra_lbits[a]); e++) {
        this.length_code[b++] = a
      }
    }
    this.length_code[b - 1] = a;
    d = 0;
    for (a = 0; a < 16; a++) {
      this.base_dist[a] = d;
      for (e = 0; e < (1 << this.extra_dbits[a]); e++) {
        this.dist_code[d++] = a
      }
    }
    d >>= 7;
    for (; a < this.D_CODES; a++) {
      this.base_dist[a] = d << 7;
      for (e = 0; e < (1 << (this.extra_dbits[a] - 7)); e++) {
        this.dist_code[256 + d++] = a
      }
    }
    for (c = 0; c <= this.MAX_BITS; c++) {
      this.bl_count[c] = 0
    }
    e = 0;
    while (e <= 143) {
      this.static_ltree[e++].dl = 8;
      this.bl_count[8]++
    }
    while (e <= 255) {
      this.static_ltree[e++].dl = 9;
      this.bl_count[9]++
    }
    while (e <= 279) {
      this.static_ltree[e++].dl = 7;
      this.bl_count[7]++
    }
    while (e <= 287) {
      this.static_ltree[e++].dl = 8;
      this.bl_count[8]++
    }
    this.gen_codes(this.static_ltree, this.L_CODES + 1);
    for (e = 0; e < this.D_CODES; e++) {
      this.static_dtree[e].dl = 5;
      this.static_dtree[e].fc = this.bi_reverse(e, 5)
    }
    this.init_block()
  }

  init_block() {
    let a;
    for (a = 0; a < this.L_CODES; a++) {
      this.dyn_ltree[a].fc = 0
    }
    for (a = 0; a < this.D_CODES; a++) {
      this.dyn_dtree[a].fc = 0
    }
    for (a = 0; a < this.BL_CODES; a++) {
      this.bl_tree[a].fc = 0
    }
    this.dyn_ltree[this.END_BLOCK].fc = 1;
    this.opt_len = this.static_len = 0;
    this.last_lit = this.last_dist = this.last_flags = 0;
    this.flags = 0;
    this.flag_bit = 1
  }

  pqdownheap(a, c) {
    let b = this.heap[c];
    let d = c << 1;
    while (d <= this.heap_len) {
      if (d < this.heap_len && this.SMALLER(a, this.heap[d + 1], this.heap[d])) {
        d++
      }
      if (this.SMALLER(a, b, this.heap[d])) {
        break
      }
      this.heap[c] = this.heap[d];
      c = d;
      d <<= 1
    }
    this.heap[c] = b
  }

  gen_bitlen(k) {
    let r = k.dyn_tree;
    let d = k.extra_bits;
    let a = k.extra_base;
    let l = k.max_code;
    let p = k.max_length;
    let q = k.static_tree;
    let i;
    let b, c;
    let o;
    let g;
    let j;
    let e = 0;
    for (o = 0; o <= this.MAX_BITS; o++) {
      this.bl_count[o] = 0
    }
    r[this.heap[this.heap_max]].dl = 0;
    for (i = this.heap_max + 1; i < this.HEAP_SIZE; i++) {
      b = this.heap[i];
      o = r[r[b].dl].dl + 1;
      if (o > p) {
        o = p;
        e++
      }
      r[b].dl = o;
      if (b > l) {
        continue
      }
      this.bl_count[o]++;
      g = 0;
      if (b >= a) {
        g = d[b - a]
      }
      j = r[b].fc;
      this.opt_len += j * (o + g);
      if (q != null) {
        this.static_len += j * (q[b].dl + g)
      }
    }
    if (e == 0) {
      return
    }
    do {
      o = p - 1;
      while (this.bl_count[o] == 0) {
        o--
      }
      this.bl_count[o]--;
      this.bl_count[o + 1] += 2;
      this.bl_count[p]--;
      e -= 2
    } while (e > 0);
    for (o = p; o != 0; o--) {
      b = this.bl_count[o];
      while (b != 0) {
        c = this.heap[--i];
        if (c > l) {
          continue
        }
        if (r[c].dl != o) {
          this.opt_len += (o - r[c].dl) * r[c].fc;
          r[c].fc = o
        }
        b--
      }
    }
  }

  gen_codes(b, g) {
    let d = new Array(this.MAX_BITS + 1);
    let c = 0;
    let e;
    let f;
    for (e = 1; e <= this.MAX_BITS; e++) {
      c = ((c + this.bl_count[e - 1]) << 1);
      d[e] = c
    }
    for (f = 0; f <= g; f++) {
      let a = b[f].dl;
      if (a == 0) {
        continue
      }
      b[f].fc = this.bi_reverse(d[a]++, a)
    }
  }

  build_tree(f) {
    let i = f.dyn_tree;
    let h = f.static_tree;
    let a = f.elems;
    let b, d;
    let g = -1;
    let c = a;
    this.heap_len = 0;
    this.heap_max = this.HEAP_SIZE;
    for (b = 0; b < a; b++) {
      if (i[b].fc != 0) {
        this.heap[++this.heap_len] = g = b;
        this.depth[b] = 0
      } else {
        i[b].dl = 0
      }
    }
    while (this.heap_len < 2) {
      let e = this.heap[++this.heap_len] = (g < 2 ? ++g : 0);
      i[e].fc = 1;
      this.depth[e] = 0;
      this.opt_len--;
      if (h != null) {
        this.static_len -= h[e].dl
      }
    }
    f.max_code = g;
    for (b = this.heap_len >> 1; b >= 1; b--) {
      this.pqdownheap(i, b)
    }
    do {
      b = this.heap[this.SMALLEST];
      this.heap[this.SMALLEST] = this.heap[this.heap_len--];
      this.pqdownheap(i, this.SMALLEST);
      d = this.heap[this.SMALLEST];
      this.heap[--this.heap_max] = b;
      this.heap[--this.heap_max] = d;
      i[c].fc = i[b].fc + i[d].fc;
      if (this.depth[b] > this.depth[d] + 1) {
        this.depth[c] = this.depth[b]
      } else {
        this.depth[c] = this.depth[d] + 1
      }
      i[b].dl = i[d].dl = c;
      this.heap[this.SMALLEST] = c++;
      this.pqdownheap(i, this.SMALLEST)
    } while (this.heap_len >= 2);
    this.heap[--this.heap_max] = this.heap[this.SMALLEST];
    this.gen_bitlen(f);
    this.gen_codes(i, g)
  }

  scan_tree(i, h) {
    let b;
    let f = -1;
    let a;
    let d = i[0].dl;
    let e = 0;
    let c = 7;
    let g = 4;
    if (d == 0) {
      c = 138;
      g = 3
    }
    i[h + 1].dl = 65535;
    for (b = 0; b <= h; b++) {
      a = d;
      d = i[b + 1].dl;
      if (++e < c && a == d) {
        continue
      } else {
        if (e < g) {
          this.bl_tree[a].fc += e
        } else {
          if (a != 0) {
            if (a != f) {
              this.bl_tree[a].fc++
            }
            this.bl_tree[this.REP_3_6].fc++
          } else {
            if (e <= 10) {
              this.bl_tree[this.REPZ_3_10].fc++
            } else {
              this.bl_tree[this.REPZ_11_138].fc++
            }
          }
        }
      }
      e = 0;
      f = a;
      if (d == 0) {
        c = 138;
        g = 3
      } else {
        if (a == d) {
          c = 6;
          g = 3
        } else {
          c = 7;
          g = 4
        }
      }
    }
  }

  send_tree(i, h) {
    let b;
    let f = -1;
    let a;
    let d = i[0].dl;
    let e = 0;
    let c = 7;
    let g = 4;
    if (d == 0) {
      c = 138;
      g = 3
    }
    for (b = 0; b <= h; b++) {
      a = d;
      d = i[b + 1].dl;
      if (++e < c && a == d) {
        continue
      } else {
        if (e < g) {
          do {
            this.SEND_CODE(a, this.bl_tree)
          } while (--e != 0)
        } else {
          if (a != 0) {
            if (a != f) {
              this.SEND_CODE(a, this.bl_tree);
              e--
            }
            this.SEND_CODE(this.REP_3_6, this.bl_tree);
            this.send_bits(e - 3, 2)
          } else {
            if (e <= 10) {
              this.SEND_CODE(this.REPZ_3_10, this.bl_tree);
              this.send_bits(e - 3, 3)
            } else {
              this.SEND_CODE(this.REPZ_11_138, this.bl_tree);
              this.send_bits(e - 11, 7)
            }
          }
        }
      }
      e = 0;
      f = a;
      if (d == 0) {
        c = 138;
        g = 3
      } else {
        if (a == d) {
          c = 6;
          g = 3
        } else {
          c = 7;
          g = 4
        }
      }
    }
  }

  build_bl_tree() {
    let a;
    this.scan_tree(this.dyn_ltree, this.l_desc.max_code);
    this.scan_tree(this.dyn_dtree, this.d_desc.max_code);
    this.build_tree(this.bl_desc);
    for (a = this.BL_CODES - 1; a >= 3; a--) {
      if (this.bl_tree[this.bl_order[a]].dl != 0) {
        break
      }
    }
    this.opt_len += 3 * (a + 1) + 5 + 5 + 4;
    return a
  }

  send_all_trees(b, a, c) {
    let d;
    this.send_bits(b - 257, 5);
    this.send_bits(a - 1, 5);
    this.send_bits(c - 4, 4);
    for (d = 0; d < c; d++) {
      this.send_bits(this.bl_tree[this.bl_order[d]].dl, 3)
    }
    this.send_tree(this.dyn_ltree, b - 1);
    this.send_tree(this.dyn_dtree, a - 1)
  }

  flush_block(a) {
    let c, b;
    let e;
    let f;
    f = this.strstart - this.block_start;
    this.flag_buf[this.last_flags] = this.flags;
    this.build_tree(this.l_desc);
    this.build_tree(this.d_desc);
    e = this.build_bl_tree();
    c = (this.opt_len + 3 + 7) >> 3;
    b = (this.static_len + 3 + 7) >> 3;
    if (b <= c) {
      c = b
    }
    if (f + 4 <= c && this.block_start >= 0) {
      let d;
      this.send_bits((this.STORED_BLOCK << 1) + a, 3);
      this.bi_windup();
      this.put_short(f);
      this.put_short(~f);
      for (d = 0; d < f; d++) {
        this.put_byte(this.window[this.block_start + d])
      }
    } else {
      if (b == c) {
        this.send_bits((this.STATIC_TREES << 1) + a, 3);
        this.compress_block(this.static_ltree, this.static_dtree)
      } else {
        this.send_bits((this.DYN_TREES << 1) + a, 3);
        this.send_all_trees(this.l_desc.max_code + 1, this.d_desc.max_code + 1, e + 1);
        this.compress_block(this.dyn_ltree, this.dyn_dtree)
      }
    }
    this.init_block();
    if (a != 0) {
      this.bi_windup()
    }
  }

  ct_tally(e, c) {
    this.l_buf[this.last_lit++] = c;
    if (e == 0) {
      this.dyn_ltree[c].fc++
    } else {
      e--;
      this.dyn_ltree[this.length_code[c] + this.LITERALS + 1].fc++;
      this.dyn_dtree[this.D_CODE(e)].fc++;
      this.d_buf[this.last_dist++] = e;
      this.flags |= this.flag_bit
    }
    this.flag_bit <<= 1;
    if ((this.last_lit & 7) == 0) {
      this.flag_buf[this.last_flags++] = this.flags;
      this.flags = 0;
      this.flag_bit = 1
    }
    if (this.compr_level > 2 && (this.last_lit & 4095) == 0) {
      let a = this.last_lit * 8;
      let d = this.strstart - this.block_start;
      let b;
      for (b = 0; b < this.D_CODES; b++) {
        a += this.dyn_dtree[b].fc * (5 + this.extra_dbits[b])
      }
      a >>= 3;
      if (this.last_dist < parseInt(this.last_lit / 2) && a < parseInt(d / 2)) {
        return true
      }
    }
    return (this.last_lit == this.LIT_BUFSIZE - 1 || this.last_dist == this.DIST_BUFSIZE)
  }

  compress_block(g, e) {
    let i;
    let b;
    let c = 0;
    let j = 0;
    let f = 0;
    let h = 0;
    let a;
    let d;
    if (this.last_lit != 0) {
      do {
        if ((c & 7) == 0) {
          h = this.flag_buf[f++]
        }
        b = this.l_buf[c++] & 255;
        if ((h & 1) == 0) {
          this.SEND_CODE(b, g)
        } else {
          a = this.length_code[b];
          this.SEND_CODE(a + this.LITERALS + 1, g);
          d = this.extra_lbits[a];
          if (d != 0) {
            b -= this.base_length[a];
            this.send_bits(b, d)
          }
          i = this.d_buf[j++];
          a = this.D_CODE(i);
          this.SEND_CODE(a, e);
          d = this.extra_dbits[a];
          if (d != 0) {
            i -= this.base_dist[a];
            this.send_bits(i, d)
          }
        }
        h >>= 1
      } while (c < this.last_lit)
    }
    this.SEND_CODE(this.END_BLOCK, g)
  }

  send_bits(b, a) {
    if (this.bi_valid > this.BUF_SIZE - a) {
      this.bi_buf |= (b << this.bi_valid);
      this.put_short(this.bi_buf);
      this.bi_buf = (b >> (this.BUF_SIZE - this.bi_valid));
      this.bi_valid += a - this.BUF_SIZE
    } else {
      this.bi_buf |= b << this.bi_valid;
      this.bi_valid += a
    }
  }

  bi_reverse(c, a) {
    let b = 0;
    do {
      b |= c & 1;
      c >>= 1;
      b <<= 1
    } while (--a > 0);
    return b >> 1
  }

  bi_windup() {
    if (this.bi_valid > 8) {
      this.put_short(this.bi_buf)
    } else {
      if (this.bi_valid > 0) {
        this.put_byte(this.bi_buf)
      }
    }
    this.bi_buf = 0;
    this.bi_valid = 0
  }

  qoutbuf() {
    if (this.outcnt != 0) {
      let b, a;
      b = this.new_queue();
      if (this.qhead == null) {
        this.qhead = this.qtail = b
      } else {
        this.qtail = this.qtail.next = b
      }
      b.len = this.outcnt - this.outoff;
      for (a = 0; a < b.len; a++) {
        b.ptr[a] = this.outbuf[this.outoff + a]
      }
      this.outcnt = this.outoff = 0
    }
  }

  deflate(d, f) {
    let b, e;
    let c, a;
    this.deflate_data = d;
    this.deflate_pos = 0;
    if (typeof f == "undefined") {
      f = this.DEFAULT_LEVEL
    }
    this.deflate_start(f);
    e = new Array(1024);
    b = "";
    while ((c = this.deflate_internal(e, 0, e.length)) > 0) {
      for (a = 0; a < c; a++) {
        b += String.fromCharCode(e[a])
      }
    }
    this.deflate_data = null;
    return b
  };
}
