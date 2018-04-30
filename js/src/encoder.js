'use strict';

import {Zip} from './zip_deflate.js';

export class Encoder {
  static encode64(a) {
    let r = "";
    for (let i = 0; i < a.length; i += 3) {
      if (i + 2 == a.length) {
        r += this.append3Bytes(a.charCodeAt(i), a.charCodeAt(i + 1), 0)
      } else {
        if (i + 1 == a.length) {
          r += this.append3Bytes(a.charCodeAt(i), 0, 0)
        } else {
          r += this.append3Bytes(a.charCodeAt(i), a.charCodeAt(i + 1), a.charCodeAt(i + 2))
        }
      }
    }
    return r
  }

  static append3Bytes(c, b, a) {
    let c1 = c >> 2;
    let c2 = ((c & 3) << 4) | (b >> 4);
    let c3 = ((b & 15) << 2) | (a >> 6);
    let c4 = a & 63;
    let r = "";
    r += this.encode6Bit(c1 & 63);
    r += this.encode6Bit(c2 & 63);
    r += this.encode6Bit(c3 & 63);
    r += this.encode6Bit(c4 & 63);
    return r
  }

  static encode6Bit(a) {
    if (a < 10) {
      return String.fromCharCode(48 + a)
    }
    a -= 10;
    if (a < 26) {
      return String.fromCharCode(65 + a)
    }
    a -= 26;
    if (a < 26) {
      return String.fromCharCode(97 + a)
    }
    a -= 26;
    if (a == 0) {
      return "-"
    }
    if (a == 1) {
      return "_"
    }
    return "?"
  }

  static compress(a) {
    let zip = new Zip()
    a = unescape(encodeURIComponent(a));
    return this.encode64(zip.deflate(a, 9));
  }
}
