/* MCE 464 tutorials: tiny canvas plotting + UI helpers (no external dependencies) */
(function () {
  'use strict';
  // MATLAB default ColorOrder, with house colour-vision substitutions (plum for purple, dark green for green)
  const C = {
    blue: '#0072BD', orange: '#D95319', yellow: '#EDB120', plum: '#67355C', green: '#055432',
    cyan: '#4DBEEE', red: '#A2142F', ink: '#1b2a3a', grid: '#e3dfd3', axis: '#9a968a',
    muted: '#5d6675', copper: '#b5632c', paper: '#fffdf8'
  };
  const TAU = 2 * Math.PI;

  function nice(lo, hi, n) {
    const span = hi - lo;
    if (!(span > 0)) return [lo];
    const raw = span / n, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
    const step = (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p;
    const out = [], k0 = Math.ceil(lo / step - 1e-9), k1 = Math.floor(hi / step + 1e-9);
    for (let k = k0; k <= k1; k++) out.push(Math.abs(k * step) < 1e-12 ? 0 : +(k * step).toPrecision(10));
    return out;
  }
  function fmt(v) {
    const a = Math.abs(v);
    if (a !== 0 && (a >= 10000 || a < 0.001)) return v.toExponential(0).replace('e+', 'e');
    return (+v.toPrecision(3)).toString();
  }

  class Plot {
    constructor(canvas, o) {
      this.c = canvas;
      this.o = Object.assign({ pad: [48, 14, 12, 36], xmin: 0, xmax: 1, ymin: 0, ymax: 1 }, o || {});
    }
    set(o) { Object.assign(this.o, o); }
    begin() {
      const c = this.c, o = this.o;
      const w = c.clientWidth || 320, ar = +c.dataset.ar || 0.6, h = Math.round(w * ar);
      const d = Math.min(window.devicePixelRatio || 1, 2);
      c.style.height = h + 'px';
      if (c.width !== Math.round(w * d) || c.height !== Math.round(h * d)) {
        c.width = Math.round(w * d); c.height = Math.round(h * d);
      }
      const g = c.getContext('2d');
      g.setTransform(d, 0, 0, d, 0, 0); g.clearRect(0, 0, w, h);
      this.g = g; this.w = w; this.h = h;
      const p = o.pad; this.l = p[0]; this.t = p[2]; this.pw = w - p[0] - p[1]; this.ph = h - p[2] - p[3];
      let x0 = o.xlog ? Math.log10(o.xmin) : o.xmin, x1 = o.xlog ? Math.log10(o.xmax) : o.xmax;
      let y0 = o.ylog ? Math.log10(o.ymin) : o.ymin, y1 = o.ylog ? Math.log10(o.ymax) : o.ymax;
      if (o.equal) {
        const s = Math.min(this.pw / (x1 - x0), this.ph / (y1 - y0));
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        x0 = cx - this.pw / s / 2; x1 = cx + this.pw / s / 2; y0 = cy - this.ph / s / 2; y1 = cy + this.ph / s / 2;
      }
      this.x0 = x0; this.x1 = x1; this.y0 = y0; this.y1 = y1;
      return g;
    }
    X(x) { if (this.o.xlog) x = Math.log10(x); return this.l + (x - this.x0) / (this.x1 - this.x0) * this.pw; }
    Y(y) { if (this.o.ylog) y = Math.log10(Math.max(y, 1e-300)); return this.t + (1 - (y - this.y0) / (this.y1 - this.y0)) * this.ph; }
    ix(px) { const v = this.x0 + (px - this.l) / this.pw * (this.x1 - this.x0); return this.o.xlog ? Math.pow(10, v) : v; }
    iy(py) { const v = this.y0 + (1 - (py - this.t) / this.ph) * (this.y1 - this.y0); return this.o.ylog ? Math.pow(10, v) : v; }
    clip() { const g = this.g; g.save(); g.beginPath(); g.rect(this.l, this.t, this.pw, this.ph); g.clip(); }
    unclip() { this.g.restore(); }
    axes(a) {
      a = a || {};
      const g = this.g, o = this.o;
      g.save();
      g.font = '12px -apple-system,Helvetica,Arial,sans-serif'; g.fillStyle = C.muted; g.strokeStyle = C.grid; g.lineWidth = 1;
      let xt, yt;
      if (o.xlog) { xt = []; for (let k = Math.ceil(this.x0 - 1e-9); k <= this.x1 + 1e-9; k++) xt.push(Math.pow(10, k)); }
      else xt = a.xticks || nice(this.x0, this.x1, Math.max(3, Math.round(this.pw / 80)));
      if (o.ylog) { yt = []; for (let k = Math.ceil(this.y0 - 1e-9); k <= this.y1 + 1e-9; k++) yt.push(Math.pow(10, k)); }
      else yt = a.yticks || nice(this.y0, this.y1, Math.max(3, Math.round(this.ph / 48)));
      const xf = a.xfmt || (o.xlog ? (v => '10' + sup(Math.round(Math.log10(v)))) : fmt);
      const yf = a.yfmt || (o.ylog ? (v => '10' + sup(Math.round(Math.log10(v)))) : fmt);
      if (a.grid !== false) {
        g.beginPath();
        xt.forEach(v => { const x = this.X(v); g.moveTo(x, this.t); g.lineTo(x, this.t + this.ph); });
        yt.forEach(v => { const y = this.Y(v); g.moveTo(this.l, y); g.lineTo(this.l + this.pw, y); });
        g.stroke();
      }
      g.textAlign = 'center'; g.textBaseline = 'top';
      xt.forEach(v => g.fillText(xf(v), this.X(v), this.t + this.ph + 4));
      g.textAlign = 'right'; g.textBaseline = 'middle';
      yt.forEach(v => g.fillText(yf(v), this.l - 6, this.Y(v)));
      g.strokeStyle = C.axis; g.lineWidth = 1;
      g.strokeRect(this.l + .5, this.t + .5, this.pw, this.ph);
      if (a.zero) {
        g.strokeStyle = C.axis; g.lineWidth = 1.2; g.beginPath();
        if (this.x0 < 0 && this.x1 > 0) { const x = this.X(0); g.moveTo(x, this.t); g.lineTo(x, this.t + this.ph); }
        if (this.y0 < 0 && this.y1 > 0) { const y = this.Y(0); g.moveTo(this.l, y); g.lineTo(this.l + this.pw, y); }
        g.stroke();
      }
      g.fillStyle = C.ink; g.font = '13px -apple-system,Helvetica,Arial,sans-serif';
      if (a.xlabel) { g.textAlign = 'center'; g.textBaseline = 'bottom'; g.fillText(a.xlabel, this.l + this.pw / 2, this.h - 2); }
      if (a.ylabel) { g.save(); g.translate(13, this.t + this.ph / 2); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(a.ylabel, 0, 0); g.restore(); }
      g.restore();
    }
    line(xs, ys, color, lw, dash) {
      const g = this.g; g.save(); this.clip();
      g.strokeStyle = color || C.blue; g.lineWidth = lw || 2; g.lineJoin = 'round'; g.setLineDash(dash || []);
      g.beginPath(); let pen = false;
      for (let i = 0; i < xs.length; i++) {
        if (!isFinite(xs[i]) || !isFinite(ys[i])) { pen = false; continue; }
        const x = this.X(xs[i]), y = this.Y(ys[i]);
        if (pen) g.lineTo(x, y); else { g.moveTo(x, y); pen = true; }
      }
      g.stroke(); this.unclip(); g.restore();
    }
    fill(xs, ys, color, alpha) {
      const g = this.g; g.save(); this.clip(); g.globalAlpha = alpha == null ? 0.25 : alpha; g.fillStyle = color || C.blue;
      g.beginPath(); xs.forEach((x, i) => { const px = this.X(x), py = this.Y(ys[i]); i ? g.lineTo(px, py) : g.moveTo(px, py); });
      g.closePath(); g.fill(); this.unclip(); g.restore();
    }
    dot(x, y, color, r, stroke) {
      const g = this.g; g.save(); g.fillStyle = color || C.red; g.beginPath(); g.arc(this.X(x), this.Y(y), r || 5, 0, TAU); g.fill();
      if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1.5; g.stroke(); } g.restore();
    }
    ring(x, y, color, r) {
      const g = this.g; g.save(); g.strokeStyle = color || C.red; g.lineWidth = 2; g.beginPath(); g.arc(this.X(x), this.Y(y), r || 6, 0, TAU); g.stroke(); g.restore();
    }
    arrow(x0, y0, x1, y1, color, lw, head) {
      const g = this.g, ax = this.X(x0), ay = this.Y(y0), bx = this.X(x1), by = this.Y(y1);
      const L = Math.hypot(bx - ax, by - ay); if (L < 1) return;
      const hl = Math.min(head || 10, L * 0.6), a = Math.atan2(by - ay, bx - ax);
      g.save(); g.strokeStyle = g.fillStyle = color || C.ink; g.lineWidth = lw || 2.2; g.lineCap = 'round';
      g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx - Math.cos(a) * hl * 0.6, by - Math.sin(a) * hl * 0.6); g.stroke();
      g.beginPath(); g.moveTo(bx, by);
      g.lineTo(bx - hl * Math.cos(a - 0.38), by - hl * Math.sin(a - 0.38));
      g.lineTo(bx - hl * Math.cos(a + 0.38), by - hl * Math.sin(a + 0.38)); g.closePath(); g.fill(); g.restore();
    }
    text(s, x, y, color, o) {
      o = o || {}; const g = this.g; g.save();
      g.font = (o.bold ? '700 ' : '') + (o.italic ? 'italic ' : '') + (o.size || 13) + 'px -apple-system,Helvetica,Arial,sans-serif';
      g.fillStyle = color || C.ink; g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'middle';
      g.fillText(s, this.X(x) + (o.dx || 0), this.Y(y) + (o.dy || 0)); g.restore();
    }
    // arc about (cx,cy) in data units from angle a0 to a1 (radians, data-space orientation)
    arc(cx, cy, r, a0, a1, color, lw, dash) {
      const xs = [], ys = [], n = 48;
      for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; xs.push(cx + r * Math.cos(a)); ys.push(cy + r * Math.sin(a)); }
      this.line(xs, ys, color, lw, dash);
    }
  }
  function sup(n) {
    const m = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
    return String(n).split('').map(ch => m[ch] || ch).join('');
  }

  function drag(canvas, plot, cb) {
    let on = false;
    const pos = e => { const r = canvas.getBoundingClientRect(); return [plot.ix(e.clientX - r.left), plot.iy(e.clientY - r.top)]; };
    canvas.addEventListener('pointerdown', e => { on = true; canvas.setPointerCapture(e.pointerId); cb.apply(null, pos(e)); });
    canvas.addEventListener('pointermove', e => { if (on) cb.apply(null, pos(e)); });
    const off = () => { on = false; };
    canvas.addEventListener('pointerup', off); canvas.addEventListener('pointercancel', off);
    canvas.style.cursor = 'crosshair';
  }

  const val = id => +document.getElementById(id).value;
  const chk = id => document.getElementById(id).checked;
  function setVal(id, v) {
    const el = document.getElementById(id); el.value = v;
    const out = document.getElementById(id + '_o'); if (out) out.textContent = (+el.value).toFixed(el.dataset.dp != null ? +el.dataset.dp : 2);
  }
  function bind(ids, cb) {
    ids.forEach(id => {
      const el = document.getElementById(id), out = document.getElementById(id + '_o');
      const upd = () => { if (out) out.textContent = (+el.value).toFixed(el.dataset.dp != null ? +el.dataset.dp : 2); };
      el.addEventListener('input', () => { upd(); cb(); }); el.addEventListener('change', () => { upd(); cb(); }); upd();
    });
  }
  function animate(step) {
    const ctl = { paused: window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches };
    let last = performance.now();
    (function f(now) {
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = Math.max(last, now); // rAF time can precede the start time
      if (!ctl.paused) step(dt);
      requestAnimationFrame(f);
    })(last);
    return ctl;
  }

  // 2-DOF chain  wall-k1-m1-k2-m2-k3-wall : M = diag(m1,m2), K = [[k1+k2,-k2],[-k2,k2+k3]]
  // returns lam (ascending), phi (columns, mass-normalised: phi' M phi = 1, first element >= 0)
  function eig2(m1, m2, k1, k2, k3) {
    const a = k1 + k2, b = -k2, d = k2 + k3;
    const A = m1 * m2, B = a * m2 + d * m1, Cc = a * d - b * b;
    const disc = Math.sqrt(Math.max(B * B - 4 * A * Cc, 0));
    const lam = [(B - disc) / (2 * A), (B + disc) / (2 * A)];
    let phi;
    if (Math.abs(b) < 1e-12) {
      const first = (a / m1 <= d / m2);
      phi = first ? [[1, 0], [0, 1]] : [[0, 1], [1, 0]];
      lam[0] = Math.min(a / m1, d / m2); lam[1] = Math.max(a / m1, d / m2);
    } else {
      phi = lam.map(l => [-b, a - l * m1]);
    }
    phi = phi.map(v => { const s = Math.sqrt(m1 * v[0] * v[0] + m2 * v[1] * v[1]); v = [v[0] / s, v[1] / s]; return v[0] < 0 || (v[0] === 0 && v[1] < 0) ? [-v[0], -v[1]] : v; });
    return { a, b, d, lam, phi, K: [[a, b], [b, d]], M: [[m1, 0], [0, m2]] };
  }

  // Read-out table with KaTeX: rows = [[label, value], ...]; \( \) inside strings is typeset.
  // Throttled (~8 Hz) with a trailing update so the final state is always shown.
  const _ro = new WeakMap();
  function ro(el, rows) {
    const html = rows.map(r => '<tr><th>' + r[0] + '</th><td>' + r[1] + '</td></tr>').join('');
    let st = _ro.get(el); if (!st) { st = { prev: null, t: 0, tm: null, next: null }; _ro.set(el, st); }
    st.next = html;
    const apply = () => { st.tm = null; if (st.next === st.prev) return; el.innerHTML = st.next; st.prev = st.next; st.t = performance.now(); if (window.TUTmath) window.TUTmath(el); };
    const now = performance.now();
    if (now - st.t > 120) apply(); else if (!st.tm) st.tm = setTimeout(apply, 125 - (now - st.t));
  }
  const TeX = s => '\\(' + s + '\\)';
  const f3 = v => (Math.abs(v) < 5e-4 ? 0 : v).toFixed(3);

  window.TUT = { C, TAU, Plot, nice, fmt, drag, val, chk, setVal, bind, animate, eig2, f3, sup, ro, TeX };
})();
