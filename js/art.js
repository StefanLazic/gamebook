/* Бркосјај — art
 *
 * Every passage gets its own illustration, drawn as an SVG scene right in the
 * browser (no image files, no network, works from any static host).
 *
 * Two rules the pictures follow:
 *   1. Nothing scary. This is a children's book: round shapes, soft colours,
 *      friendly faces, even for the troll and the Тихо-створ.
 *   2. A character always looks the same. Characters live in CHARACTERS below,
 *      each with a fixed palette and fixed markings, so Мими is the same black
 *      cat with one white sock and green eyes in every scene she appears in.
 *
 * Public API:  ART.svg(passageId)  ->  SVG markup string
 *              ART.altFor(passageId) -> short description for screen readers
 */
var ART = (function () {
  'use strict';

  var W = 400, H = 250, GROUND = 196;

  /* ---------- deterministic randomness (same passage = same picture) ---------- */
  function seedOf(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h >>> 0;
  }
  function rngFrom(seed) {
    var s = seed || 1;
    return function () {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function r2(n) { return Math.round(n * 100) / 100; }

  /* ---------- tiny svg helpers ---------- */
  function el(name, attrs, inner) {
    var s = '<' + name;
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k) && attrs[k] !== null && attrs[k] !== undefined) {
        s += ' ' + k + '="' + attrs[k] + '"';
      }
    }
    return inner === undefined ? s + '/>' : s + '>' + inner + '</' + name + '>';
  }
  function g(transform, inner) { return el('g', { transform: transform }, inner); }
  function circle(cx, cy, r, fill, extra) {
    var a = { cx: r2(cx), cy: r2(cy), r: r2(r), fill: fill };
    for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) a[k] = extra[k];
    return el('circle', a);
  }
  function ellipse(cx, cy, rx, ry, fill, extra) {
    var a = { cx: r2(cx), cy: r2(cy), rx: r2(rx), ry: r2(ry), fill: fill };
    for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) a[k] = extra[k];
    return el('ellipse', a);
  }
  function rect(x, y, w, h, fill, rx, extra) {
    var a = { x: r2(x), y: r2(y), width: r2(w), height: r2(h), fill: fill, rx: rx || 0 };
    for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) a[k] = extra[k];
    return el('rect', a);
  }
  function path(d, fill, extra) {
    var a = { d: d, fill: fill };
    for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) a[k] = extra[k];
    return el('path', a);
  }

  /* ---------- shared face parts (the "anime" look) ---------- */
  /* Big round eye with a highlight; everything in the book uses these. */
  function eye(x, y, r, colour, look) {
    var dx = (look === 'left' ? -0.2 : look === 'right' ? 0.2 : 0) * r;
    return circle(x, y, r, '#231d33') +
      circle(x + dx, y + r * 0.05, r * 0.72, colour || '#8ef0a5') +
      circle(x + dx, y + r * 0.1, r * 0.34, '#231d33') +
      circle(x + dx - r * 0.25, y - r * 0.3, r * 0.26, '#ffffff', { opacity: 0.95 }) +
      circle(x + dx + r * 0.2, y + r * 0.32, r * 0.13, '#ffffff', { opacity: 0.6 });
  }
  function sleepyEye(x, y, r) {
    return path('M' + r2(x - r) + ' ' + r2(y) + ' q ' + r2(r) + ' ' + r2(r * 0.9) + ' ' + r2(r * 2) + ' 0',
      'none', { stroke: '#231d33', 'stroke-width': r2(r * 0.42), 'stroke-linecap': 'round' });
  }
  function blush(x, y, r, colour) {
    return ellipse(x, y, r, r * 0.6, colour || '#ff9db1', { opacity: 0.5 });
  }
  function smile(x, y, w, colour) {
    return path('M' + r2(x - w) + ' ' + r2(y) + ' q ' + r2(w) + ' ' + r2(w * 0.75) + ' ' + r2(w * 2) + ' 0',
      'none', { stroke: colour || '#231d33', 'stroke-width': 1.6, 'stroke-linecap': 'round' });
  }

  /* ---------- the cast ----------
   * Each cat is drawn by one function; only the palette and the markings change,
   * so the same character is recognisably the same in every scene.
   */
  function catBody(p, s, opts) {
    opts = opts || {};
    var o = '';
    o += ellipse(0, -8, 26, 30, p.inner, { opacity: 0.22 });
    var tail = opts.tailUp
      ? 'M18 6 q 16 -2 14 -22 q -1 -9 -8 -9'
      : 'M18 8 q 18 2 20 -12 q 1 -8 -6 -9';
    o += path(tail, 'none', { stroke: p.fur, 'stroke-width': 7, 'stroke-linecap': 'round' });
    /* body */
    o += ellipse(0, 0, 20, 17, p.fur);
    o += ellipse(0, 5, 12, 10, p.belly);
    /* front paws — Мими's white sock is always the left one */
    o += ellipse(-9, 15, 6.4, 4.6, p.fur);
    o += ellipse(8, 15, 6.4, 4.6, opts.noSock ? p.fur : (p.sock || p.fur));
    /* head */
    o += g('translate(0,-20)',
      path('M-16 -2 l -3 -16 l 14 7 z', p.fur) +
      path('M16 -2 l 3 -16 l -14 7 z', p.fur) +
      path('M-13 -3 l -1.6 -9 l 8 4 z', p.inner) +
      path('M13 -3 l 1.6 -9 l -8 4 z', p.inner) +
      ellipse(0, 0, 17, 15, p.fur) +
      (p.cheek ? ellipse(0, 5, 12, 9, p.belly, { opacity: 0.85 }) : '') +
      eye(-6.6, -1, 4.4, p.eye, opts.look) +
      eye(6.6, -1, 4.4, p.eye, opts.look) +
      path('M-2.6 4.4 l 5.2 0 l -2.6 3 z', p.nose) +
      smile(-4, 7.6, 4) + smile(1.4, 7.6, 3) +
      blush(-11, 5, 3.6, p.blush) + blush(11, 5, 3.6, p.blush) +
      path('M-14 3 l -9 -2 M-14 6 l -9 3 M14 3 l 9 -2 M14 6 l 9 3', 'none',
        { stroke: '#ffffff', 'stroke-width': 0.9, opacity: 0.8, 'stroke-linecap': 'round' }) +
      (p.crown ? path('M-9 -13 l 3 -8 l 3 5 l 3 -7 l 3 7 l 3 -5 l 3 8 z', '#ffd76a',
        { stroke: '#c99a2e', 'stroke-width': 1 }) : '') +
      '');
    if (p.collar) {
      o += path('M-12 -6 q 12 8 24 0', 'none', { stroke: p.collar, 'stroke-width': 3.4, 'stroke-linecap': 'round' });
      o += circle(0, 0, 2.6, '#ffd76a');
    }
    return g('translate(' + r2(0) + ',' + r2(0) + ') scale(' + r2(s) + ')', o);
  }

  var MIMI = { fur: '#3a3350', belly: '#4a4269', inner: '#8f7fb5', eye: '#8ef0a5', nose: '#ff9db1', blush: '#ff9db1', sock: '#f6f3ff', collar: '#6ee7d3', cheek: true };
  var KITTEN = { fur: '#f0d9a8', belly: '#fbeed2', inner: '#f2b6a0', eye: '#7fd0ff', nose: '#ff9db1', blush: '#ffb0a8', cheek: true };
  var QUEEN = { fur: '#efeaff', belly: '#ffffff', inner: '#e0b7d8', eye: '#ffcf6b', nose: '#e08fa6', blush: '#f2a9c0', crown: true, cheek: true };
  var COURT_CAT = { fur: '#a99ad6', belly: '#c7bce8', inner: '#e0b7d8', eye: '#ffd66b', nose: '#e08fa6', blush: '#f2a9c0', cheek: true };

  function drawMimi(o) { return catBody(MIMI, 1, o); }
  function drawKitten(o) { o = o || {}; o.noSock = true; return catBody(KITTEN, 0.62, o); }
  function drawQueen(o) { o = o || {}; o.noSock = true; o.tailUp = true; return catBody(QUEEN, 1.1, o); }
  function drawCourtCat(o) { o = o || {}; o.noSock = true; return catBody(COURT_CAT, 0.8, o); }

  /* The kid: eleven years old, striped pyjama bottoms, sleepy hair, freckles. */
  function drawKid(opts) {
    opts = opts || {};
    var skin = '#f7d3ae', skinDark = '#e5b98f', hair = '#4a3324', py = '#7fa7f0', pyDark = '#5f83c9';
    var o = '';
    /* legs */
    o += rect(-11, 8, 9, 26, py, 4.5) + rect(2, 8, 9, 26, py, 4.5);
    o += path('M-11 16 h9 M-11 24 h9 M2 16 h9 M2 24 h9', 'none', { stroke: pyDark, 'stroke-width': 2, opacity: 0.8 });
    o += ellipse(-6.5, 35, 6.5, 4, '#ffd76a') + ellipse(6.5, 35, 6.5, 4, '#ffd76a');
    /* torso */
    o += path('M-14 -14 q 14 -6 28 0 l 3 26 q -17 6 -34 0 z', py);
    o += path('M-3 -16 l 0 30', 'none', { stroke: pyDark, 'stroke-width': 1.6, opacity: 0.7 });
    /* arms */
    if (opts.reach) {
      o += path('M-13 -8 q -12 -6 -16 -16', 'none', { stroke: py, 'stroke-width': 8, 'stroke-linecap': 'round' });
      o += circle(-30, -25, 4.6, skin);
      o += path('M13 -8 q 12 -6 16 -16', 'none', { stroke: py, 'stroke-width': 8, 'stroke-linecap': 'round' });
      o += circle(30, -25, 4.6, skin);
    } else {
      o += path('M-13 -8 q -10 6 -10 16', 'none', { stroke: py, 'stroke-width': 8, 'stroke-linecap': 'round' });
      o += circle(-23, 9, 4.6, skin);
      o += path('M13 -8 q 10 6 10 16', 'none', { stroke: py, 'stroke-width': 8, 'stroke-linecap': 'round' });
      o += circle(23, 9, 4.6, skin);
    }
    /* head */
    o += g('translate(0,-32)',
      ellipse(0, 0, 17, 17.5, skin) +
      ellipse(0, 6, 12, 10, skinDark, { opacity: 0.18 }) +
      /* hair: sleepy fringe */
      path('M-17 -2 q -1 -20 17 -20 q 18 0 17 20 q -4 -10 -9 -9 q -3 -6 -9 -3 q -7 -1 -9 5 q -4 0 -7 7 z', hair) +
      path('M-15 -6 q 2 -8 6 -10', 'none', { stroke: '#6b4a34', 'stroke-width': 2, 'stroke-linecap': 'round' }) +
      eye(-6.4, 2, 4.3, '#6ec6ff', opts.look) +
      eye(6.4, 2, 4.3, '#6ec6ff', opts.look) +
      (opts.mouth === 'open'
        ? ellipse(0, 10, 3.4, 4.2, '#c9576f')
        : smile(-3, 9.5, 3)) +
      blush(-11, 7, 4, '#ff9db1') + blush(11, 7, 4, '#ff9db1') +
      circle(-9, 4.5, 0.7, '#c98d63') + circle(-6, 6.5, 0.6, '#c98d63') +
      circle(9, 4.5, 0.7, '#c98d63') + circle(6, 6.5, 0.6, '#c98d63'));
    if (opts.lantern) o += drawLantern(28, 4, 0.85);
    if (opts.bell) o += drawBell(-34, -32, 0.9);
    return o;
  }

  function drawBell(x, y, s) {
    return g('translate(' + x + ',' + y + ') scale(' + s + ')',
      circle(0, 0, 13, '#ffe9a8', { opacity: 0.25 }) +
      path('M-7 4 q 0 -12 7 -12 q 7 0 7 12 z', '#e8b53d') +
      rect(-8, 4, 16, 3, '#c9a227', 1.5) +
      circle(0, 8.6, 2.4, '#c9a227') +
      circle(0, -13, 2, '#c9a227') +
      path('M-14 -6 q -4 -4 -3 -9 M14 -6 q 4 -4 3 -9', 'none',
        { stroke: '#ffe9a8', 'stroke-width': 1.6, opacity: 0.8, 'stroke-linecap': 'round' }));
  }

  function drawLantern(x, y, s) {
    return g('translate(' + x + ',' + y + ') scale(' + s + ')',
      path('M0 -14 q 6 0 6 6', 'none', { stroke: '#c9a227', 'stroke-width': 1.6 }) +
      circle(0, 6, 12, '#ffe9a8', { opacity: 0.35 }) +
      rect(-6, -8, 12, 16, '#ffd76a', 3) +
      rect(-7, -10, 14, 3, '#c9a227', 1.5) +
      rect(-7, 7, 14, 3, '#c9a227', 1.5));
  }

  /* Госпођа Пел — ninety-one, white bun, lavender shawl, endless knitting. */
  function drawPell() {
    var o = '';
    o += path('M-16 -8 q 16 -8 32 0 l 5 40 q -21 7 -42 0 z', '#b9a3e3');
    o += path('M-16 -8 q 16 12 32 0 l 3 14 q -19 10 -38 0 z', '#cfc0f0');
    o += path('M-15 0 q -10 10 -8 22', 'none', { stroke: '#b9a3e3', 'stroke-width': 7, 'stroke-linecap': 'round' });
    o += path('M15 0 q 10 10 8 22', 'none', { stroke: '#b9a3e3', 'stroke-width': 7, 'stroke-linecap': 'round' });
    o += circle(-23, 23, 4.4, '#f7d3ae') + circle(23, 23, 4.4, '#f7d3ae');
    o += path('M-24 20 l 20 8 M24 20 l -18 10', 'none', { stroke: '#e8e2ff', 'stroke-width': 1.4 });
    o += ellipse(0, 30, 12, 7, '#f0c6d8');
    o += g('translate(0,-28)',
      ellipse(0, 0, 15, 15.5, '#f7d3ae') +
      path('M-15 -3 q 0 -18 15 -18 q 15 0 15 18 q -6 -12 -15 -10 q -9 -2 -15 10 z', '#f2efff') +
      circle(-12, -10, 6, '#f2efff') + circle(12, -10, 6, '#f2efff') +
      sleepyEye(-6.5, 2, 3.6) + sleepyEye(6.5, 2, 3.6) +
      smile(-3, 9, 3) + blush(-10, 6, 3.6, '#ff9db1') + blush(10, 6, 3.6, '#ff9db1'));
    return o;
  }

  /* Мостарски трол: mossy, round, shy, absolutely not scary. */
  function drawTroll() {
    var o = '';
    o += ellipse(0, 6, 34, 30, '#6ea86a');
    o += ellipse(0, 14, 22, 18, '#8cc487');
    o += ellipse(-30, 26, 11, 8, '#6ea86a') + ellipse(30, 26, 11, 8, '#6ea86a');
    o += g('translate(0,-24)',
      ellipse(0, 0, 26, 23, '#6ea86a') +
      path('M-26 -4 q 6 -16 26 -16 q 20 0 26 16 q -10 -6 -26 -6 q -16 0 -26 6 z', '#4f8c55') +
      circle(-14, -16, 6, '#8ec98a') + circle(6, -20, 5, '#8ec98a') +
      path('M-24 -12 q 4 -12 12 -12 q -2 8 -4 12 z', '#f0a6b6') +
      eye(-9, 1, 5.6, '#ffd76a') + eye(9, 1, 5.6, '#ffd76a') +
      smile(-6, 11, 6) +
      blush(-17, 7, 5, '#f2947f') + blush(17, 7, 5, '#f2947f') +
      path('M-4 12 l 3 5 M5 12 l -2 5', 'none', { stroke: '#ffffff', 'stroke-width': 2, 'stroke-linecap': 'round' }));
    return o;
  }

  /* Гавран у прслуку — the market crows, always the same waistcoat red. */
  function drawCrow(opts) {
    opts = opts || {};
    var o = '';
    o += path('M4 2 q 18 4 22 -8 q -4 14 -20 14', '#2b3a55');
    o += ellipse(0, 0, 16, 18, '#33456b');
    o += ellipse(0, 4, 10, 12, '#b8434a');
    o += path('M-6 -4 l 12 0 l -6 12 z', '#d4737a');
    o += ellipse(-12, -2, 7, 12, '#2b3a55');
    o += g('translate(0,-18)',
      ellipse(0, 0, 12, 11, '#33456b') +
      path('M10 2 l 14 3 l -13 4 z', '#f5a623') +
      eye(-2, -1, 4.2, '#ffd76a', 'right') +
      (opts.hat ? path('M-12 -8 q 12 -6 24 0 l -2 -8 q -10 -4 -20 0 z', '#231d33') : ''));
    o += path('M-4 17 l 0 6 M5 17 l 0 6', 'none', { stroke: '#f5a623', 'stroke-width': 2.4, 'stroke-linecap': 'round' });
    return o;
  }

  /* Брамблвика, чајна вештица — teal hair, freckles, always a cup in hand. */
  function drawWitch() {
    var o = '';
    o += path('M-15 -10 q 15 -8 30 0 l 8 44 q -23 8 -46 0 z', '#5b4b8a');
    o += path('M-8 -6 q 8 26 3 44', 'none', { stroke: '#7a68b0', 'stroke-width': 3, opacity: 0.7 });
    o += path('M-14 -2 q -12 10 -10 20', 'none', { stroke: '#5b4b8a', 'stroke-width': 7, 'stroke-linecap': 'round' });
    o += path('M14 -2 q 12 8 9 18', 'none', { stroke: '#5b4b8a', 'stroke-width': 7, 'stroke-linecap': 'round' });
    o += circle(-24, 20, 4.4, '#f7d3ae');
    o += circle(23, 17, 4.4, '#f7d3ae');
    o += g('translate(30,12) scale(0.9)', drawCup());
    o += g('translate(0,-30)',
      path('M-17 6 q -6 22 4 26 q 6 -14 13 -18 z', '#57c4b0') +
      path('M17 6 q 6 22 -4 26 q -6 -14 -13 -18 z', '#57c4b0') +
      ellipse(0, 0, 15, 15.5, '#f7d3ae') +
      path('M-16 -2 q 1 -18 16 -18 q 15 0 16 18 q -6 -10 -16 -9 q -10 -1 -16 9 z', '#57c4b0') +
      eye(-6.2, 2, 4.2, '#a8e6a3') + eye(6.2, 2, 4.2, '#a8e6a3') +
      smile(-3, 9, 3) + blush(-10, 6, 3.8, '#ff9db1') + blush(10, 6, 3.8, '#ff9db1') +
      circle(-9, 4, 0.7, '#c98d63') + circle(9, 4, 0.7, '#c98d63') +
      path('M-20 -14 q 20 -18 40 0 q -20 -8 -40 0 z', '#3f3468') +
      path('M-8 -14 q 8 -26 20 -6 q -8 -6 -20 6 z', '#3f3468'));
    return o;
  }

  function drawCup() {
    return ellipse(0, 0, 8, 6, '#fdf6e6') + rect(-8, -6, 16, 8, '#fdf6e6', 2) +
      path('M8 -4 q 6 2 0 6', 'none', { stroke: '#fdf6e6', 'stroke-width': 2 }) +
      ellipse(0, -6, 8, 3, '#e2a35d') +
      path('M-3 -12 q 3 -5 0 -9 M3 -12 q 3 -5 0 -9', 'none', { stroke: '#ffffff', 'stroke-width': 1.4, opacity: 0.6, 'stroke-linecap': 'round' });
  }

  /* Мољац — the very organised moths of the mushroom ring. */
  function drawMoth() {
    return path('M0 0 q -16 -14 -20 2 q 2 12 20 4 z', '#f3e6c8') +
      path('M0 0 q 16 -14 20 2 q -2 12 -20 4 z', '#f3e6c8') +
      circle(-12, 2, 2.6, '#d9c39a') + circle(12, 2, 2.6, '#d9c39a') +
      ellipse(0, 2, 4, 8, '#c9b48f') +
      circle(0, -6, 3.6, '#c9b48f') +
      circle(-1.4, -6.6, 1, '#231d33') + circle(1.4, -6.6, 1, '#231d33') +
      path('M-2 -9 q -3 -5 -6 -6 M2 -9 q 3 -5 6 -6', 'none', { stroke: '#c9b48f', 'stroke-width': 1.2, 'stroke-linecap': 'round' });
  }

  /* Тихо-створ: a shy, soft, voiceless thing. Sleepy eyes, no teeth, no claws. */
  function drawHush() {
    var o = '';
    o += path('M-30 20 q -6 -46 30 -46 q 36 0 30 46 q -30 8 -60 0 z', '#cfc9e4', { opacity: 0.75 });
    o += path('M-22 14 q -4 -32 22 -32 q 26 0 22 32 q -22 6 -44 0 z', '#e8e4f6', { opacity: 0.75 });
    o += sleepyEye(-9, -6, 4.6) + sleepyEye(9, -6, 4.6);
    o += smile(-6, 3, 6, '#6c6489');
    o += blush(-16, 2, 5.4, '#ff9db1') + blush(16, 2, 5.4, '#ff9db1');
    o += path('M-28 20 q 8 10 14 0 q 8 10 14 0 q 8 10 14 0', 'none', { stroke: '#c3bcd8', 'stroke-width': 3, opacity: 0.8, 'stroke-linecap': 'round' });
    return o;
  }

  var CHARACTERS = {
    kid: { draw: drawKid, foot: 39, name: 'дете у пиџами' },
    kidLantern: { draw: function () { return drawKid({ lantern: true }); }, foot: 39, name: 'дете са лампом' },
    kidReach: { draw: function () { return drawKid({ reach: true, mouth: 'open' }); }, foot: 39, name: 'дете које се пружа' },
    kidBell: { draw: function () { return drawKid({ reach: true, bell: true }); }, foot: 39, name: 'дете које звони звонцетом' },
    mimi: { draw: function () { return drawMimi({}); }, foot: 20, size: 1.25, name: 'Мими, црна мачка са белом чарапицом' },
    mimiUp: { draw: function () { return drawMimi({ tailUp: true }); }, foot: 20, size: 1.25, name: 'Мими' },
    kitten: { draw: function () { return drawKitten({ tailUp: true }); }, foot: 13, size: 1.25, name: 'маче Земичка' },
    queen: { draw: function () { return drawQueen({}); }, foot: 22, size: 1.2, name: 'мачја краљица' },
    courtCat: { draw: function () { return drawCourtCat({}); }, foot: 17, size: 1.2, name: 'дворска мачка' },
    pell: { draw: drawPell, foot: 38, name: 'госпођа Пел' },
    troll: { draw: drawTroll, foot: 36, size: 0.85, name: 'маховински трол' },
    crow: { draw: drawCrow, foot: 24, name: 'гавран у прслуку' },
    crowHat: { draw: function () { return drawCrow({ hat: true }); }, foot: 24, name: 'гавран са шеширом' },
    witch: { draw: drawWitch, foot: 40, name: 'чајна вештица' },
    moth: { draw: drawMoth, foot: 10, size: 1.4, name: 'мољац' },
    hush: { draw: drawHush, foot: 22, size: 1, name: 'Тихо-створ' }
  };

  /* ---------- backgrounds ---------- */
  function starField(rnd, n, top) {
    var o = '';
    for (var i = 0; i < n; i++) {
      var x = rnd() * W, y = rnd() * (top || 150), r = 0.6 + rnd() * 1.5;
      o += circle(x, y, r, '#fff6d8', { opacity: r2(0.35 + rnd() * 0.55) });
    }
    return o;
  }
  /* The moon sits somewhere different in every passage (seeded), so scenes that
     share a background still do not look like the same drawing twice. */
  function moonAt(rnd, xMin, xMax) {
    return moon(xMin + rnd() * (xMax - xMin), 30 + rnd() * 26, 14 + rnd() * 7);
  }
  function moon(x, y, r) {
    return circle(x, y, r * 2.1, '#ffe9a8', { opacity: 0.12 }) +
      circle(x, y, r * 1.5, '#ffe9a8', { opacity: 0.14 }) +
      circle(x, y, r, '#fff3c4') +
      circle(x - r * 0.35, y - r * 0.2, r * 0.18, '#f2e0a6', { opacity: 0.7 }) +
      circle(x + r * 0.3, y + r * 0.3, r * 0.12, '#f2e0a6', { opacity: 0.7 });
  }
  function tree(x, baseY, s, dark) {
    var trunk = path('M' + (x - 5 * s) + ' ' + baseY + ' q ' + 4 * s + ' -' + 30 * s + ' 0 -' + 52 * s +
      ' l ' + 10 * s + ' 0 q -' + 4 * s + ' ' + 22 * s + ' 0 ' + 52 * s + ' z', dark ? '#2a2340' : '#3b3158');
    var crown = ellipse(x, baseY - 62 * s, 30 * s, 24 * s, dark ? '#33305c' : '#48468a', { opacity: 0.95 }) +
      ellipse(x - 18 * s, baseY - 48 * s, 20 * s, 15 * s, dark ? '#2e2b52' : '#413f7d') +
      ellipse(x + 19 * s, baseY - 50 * s, 18 * s, 14 * s, dark ? '#2e2b52' : '#413f7d');
    return trunk + crown;
  }
  function mushroom(x, y, s, cap) {
    return rect(x - 2.6 * s, y - 9 * s, 5.2 * s, 10 * s, '#f3e6c8', 2) +
      ellipse(x, y - 9 * s, 9 * s, 6 * s, cap || '#e2718a') +
      circle(x - 3 * s, y - 10 * s, 1.6 * s, '#fff2f4') +
      circle(x + 3 * s, y - 11 * s, 1.2 * s, '#fff2f4');
  }
  function grassLine(y, colour) {
    return path('M0 ' + y + ' q 40 -8 80 0 q 40 8 80 0 q 40 -8 80 0 q 40 8 80 0 q 40 -8 80 0 L400 ' + H + ' L0 ' + H + ' z', colour);
  }
  function pawGlow(x, y, s) {
    return g('translate(' + x + ',' + y + ') scale(' + s + ')',
      circle(0, 0, 9, '#9df5c6', { opacity: 0.18 }) +
      ellipse(0, 1.5, 4, 3, '#9df5c6', { opacity: 0.9 }) +
      circle(-3.4, -3, 1.5, '#9df5c6', { opacity: 0.9 }) +
      circle(0, -4.4, 1.5, '#9df5c6', { opacity: 0.9 }) +
      circle(3.4, -3, 1.5, '#9df5c6', { opacity: 0.9 }));
  }

  var SKIES = {
    night: ['#241a44', '#3c2a63', '#5a3f7e'],
    deep: ['#141230', '#241a44', '#3a2a5c'],
    warm: ['#3a2247', '#6b3a5a', '#a8586a'],
    dawn: ['#5c4a86', '#c47a8a', '#ffc48a'],
    indoor: ['#3a2a4e', '#5b3f5f', '#7d5768'],
    ember: ['#2c1636', '#6b2545', '#b8563f']
  };

  function sky(kind) {
    var c = SKIES[kind] || SKIES.night;
    return el('linearGradient', { id: 'sky', x1: '0', y1: '0', x2: '0', y2: '1' },
      el('stop', { offset: '0', 'stop-color': c[0] }) +
      el('stop', { offset: '0.6', 'stop-color': c[1] }) +
      el('stop', { offset: '1', 'stop-color': c[2] }));
  }

  var BACKGROUNDS = {
    porch: function (rnd) {
      return starField(rnd, 40) + moonAt(rnd, 292, 348) +
        rect(0, 60, 250, 140, '#3b2c53', 6) +
        path('M-10 62 L125 6 L262 62 z', '#4c3a68') +
        rect(150, 108, 46, 92, '#6b4a3c', 4) +
        circle(188, 156, 3, '#ffd76a') +
        rect(40, 96, 40, 34, '#ffe9a8', 4, { opacity: 0.85 }) +
        path('M60 96 v34 M40 113 h40', 'none', { stroke: '#6b4a3c', 'stroke-width': 3 }) +
        rect(120, 190, 180, 12, '#5b4433', 3) +
        grassLine(GROUND + 6, '#2f5a45') +
        pawGlow(250, 188, 1) + pawGlow(288, 196, 0.9) + pawGlow(322, 186, 0.8);
    },
    shed: function (rnd) {
      return starField(rnd, 26) +
        rect(60, 66, 280, 136, '#4a3a2e', 6) +
        path('M44 70 L200 20 L356 70 z', '#5e4a3a') +
        rect(150, 110, 100, 92, '#6b5442', 4) +
        path('M200 110 v92', 'none', { stroke: '#4a3a2e', 'stroke-width': 3 }) +
        rect(80, 120, 46, 40, '#2e2440', 3) +
        rect(276, 120, 44, 40, '#2e2440', 3) +
        path('M96 168 l 6 -40 l 8 0 l 6 40 z', '#9aa7b8') +
        grassLine(GROUND + 8, '#2f5a45');
    },
    villageDoor: function (rnd) {
      return starField(rnd, 34) + moonAt(rnd, 30, 96) +
        rect(70, 40, 270, 162, '#4a3a5e', 6) +
        path('M56 46 L205 4 L354 46 z', '#5c4874') +
        rect(170, 96, 74, 106, '#7a5540', 6) +
        circle(232, 152, 3.4, '#ffd76a') +
        rect(86, 96, 54, 44, '#ffe9a8', 4, { opacity: 0.9 }) +
        path('M113 96 v44 M86 118 h54', 'none', { stroke: '#7a5540', 'stroke-width': 3 }) +
        rect(268, 96, 52, 44, '#ffe9a8', 4, { opacity: 0.5 }) +
        grassLine(GROUND + 8, '#2f5a45');
    },
    hedge: function (rnd) {
      var o = starField(rnd, 34) + moonAt(rnd, 30, 100);
      o += path('M0 210 q 40 -110 110 -104 q 60 6 80 -10 q 60 -46 120 4 q 50 40 90 6 L400 210 z', '#2f6b4c');
      for (var i = 0; i < 24; i++) {
        o += circle(rnd() * W, 110 + rnd() * 80, 8 + rnd() * 12, '#38805a', { opacity: 0.65 });
      }
      o += ellipse(212, 172, 26, 30, '#141a2c');
      o += ellipse(212, 172, 20, 24, '#1d2b4a');
      o += pawGlow(150, 200, 1) + pawGlow(180, 190, 0.9) + pawGlow(200, 182, 0.8);
      o += grassLine(GROUND + 12, '#2f5a45');
      return o;
    },
    forest: function (rnd) {
      var o = starField(rnd, 44) + moonAt(rnd, 250, 350);
      o += tree(40, 210, 1.1, true) + tree(360, 214, 1, true) + tree(120, 200, 0.7, true) + tree(280, 202, 0.8, true);
      o += grassLine(GROUND + 10, '#26523f');
      for (var i = 0; i < 10; i++) o += circle(rnd() * W, 160 + rnd() * 70, 1.6 + rnd() * 2, '#9df5c6', { opacity: 0.5 });
      o += mushroom(56, 226, 0.9) + mushroom(348, 232, 1, '#8fa8f0');
      return o;
    },
    brook: function (rnd) {
      var o = starField(rnd, 30) + moonAt(rnd, 40, 130) + tree(30, 200, 0.9, true) + tree(370, 204, 0.9, true);
      o += grassLine(170, '#26523f');
      o += rect(0, 186, W, 64, '#20406b');
      o += path('M0 186 q 60 12 120 0 q 60 -12 120 0 q 60 12 160 0 L400 250 L0 250 z', '#2b5a91', { opacity: 0.8 });
      for (var i = 0; i < 5; i++) {
        o += ellipse(50 + i * 78, 200 + (i % 2) * 12, 20, 9, '#6f7b96');
        o += ellipse(50 + i * 78, 197 + (i % 2) * 12, 18, 7, '#8b96ad');
      }
      o += path('M20 216 q 40 6 90 0 M240 232 q 50 6 110 0', 'none', { stroke: '#a8c6ef', 'stroke-width': 2, opacity: 0.5 });
      return o;
    },
    bridge: function (rnd) {
      var o = starField(rnd, 30) + moonAt(rnd, 250, 344) + tree(24, 206, 0.9, true);
      o += rect(0, 196, W, 54, '#20406b');
      o += path('M40 190 q 160 -120 320 0 z', '#6b6484');
      o += path('M40 190 q 160 -120 320 0 l -14 14 q -146 -96 -292 0 z', '#8a83a6');
      o += path('M120 158 q 80 -46 160 0 q -80 -22 -160 0 z', '#241a3c');
      o += grassLine(GROUND + 14, '#26523f');
      return o;
    },
    ring: function (rnd) {
      var o = starField(rnd, 40) + moonAt(rnd, 36, 120) + tree(360, 208, 1, true) + tree(30, 212, 0.8, true);
      o += grassLine(GROUND - 6, '#26523f');
      o += ellipse(200, 224, 150, 34, '#2f6b4c', { opacity: 0.6 });
      for (var i = 0; i < 9; i++) {
        var a = Math.PI * (i / 8);
        o += mushroom(200 + Math.cos(a) * 150, 226 + Math.sin(a) * 26, 0.9, i % 2 ? '#e2718a' : '#f0b46a');
      }
      return o;
    },
    market: function (rnd) {
      var o = starField(rnd, 34);
      o += tree(20, 210, 0.8, true) + tree(384, 210, 0.8, true);
      o += grassLine(GROUND + 6, '#3b3158');
      var stalls = [[60, '#c96f7e'], [190, '#6fb0c9'], [318, '#c9a86f']];
      for (var i = 0; i < stalls.length; i++) {
        var x = stalls[i][0];
        o += rect(x - 42, 132, 84, 62, '#4a3a5e', 4);
        o += path('M' + (x - 52) + ' 132 l 20 -30 l 64 0 l 20 30 z', stalls[i][1]);
        o += path('M' + (x - 52) + ' 132 q 13 14 26 0 q 13 14 26 0 q 13 14 26 0 q 13 14 26 0', 'none',
          { stroke: stalls[i][1], 'stroke-width': 6 });
        o += circle(x, 108, 4, '#ffd76a');
      }
      for (var j = 0; j < 8; j++) o += circle(rnd() * W, 80 + rnd() * 40, 2.4, '#ffd76a', { opacity: 0.8 });
      return o;
    },
    hut: function (rnd) {
      var o = starField(rnd, 30) + moonAt(rnd, 30, 90) + tree(370, 210, 0.9, true);
      o += rect(96, 92, 210, 110, '#5b4b3a', 8);
      o += path('M74 96 q 130 -78 254 0 z', '#7a5b8c');
      o += path('M240 40 q 6 -18 -4 -26 q 16 6 12 26 z', '#cfc0f0', { opacity: 0.6 });
      o += rect(232, 34, 18, 26, '#5b4b3a', 3);
      o += rect(180, 128, 56, 74, '#8a6a4e', 5) + circle(226, 168, 3.4, '#ffd76a');
      o += rect(112, 122, 48, 42, '#ffe9a8', 4, { opacity: 0.9 });
      o += rect(254, 122, 42, 40, '#ffe9a8', 4, { opacity: 0.7 });
      o += grassLine(GROUND + 10, '#2f5a45');
      o += mushroom(60, 224, 1.1, '#e2718a') + mushroom(340, 230, 0.9, '#8fa8f0');
      return o;
    },
    thorns: function (rnd) {
      var o = starField(rnd, 26, 120);
      o += rect(0, 0, W, H, '#1c1733', { opacity: 0.2 });
      var i;
      for (i = 0; i < 7; i++) {
        var x0 = rnd() * W;
        o += path('M' + r2(x0) + ' 250 q ' + r2(-30 + rnd() * 60) + ' -110 ' + r2(-20 + rnd() * 40) + ' -230',
          'none', { stroke: '#453a63', 'stroke-width': 4 + rnd() * 4, 'stroke-linecap': 'round' });
      }
      for (i = 0; i < 22; i++) {
        var tx = rnd() * W, ty = rnd() * H;
        o += path('M' + r2(tx) + ' ' + r2(ty) + ' l 6 -3 l -1 7 z', '#5e5183');
      }
      /* a moonlit path through the thorns, so there is always a way out */
      o += path('M140 250 q 40 -50 60 -104 q 12 -30 8 -56', 'none',
        { stroke: '#e8e2ff', 'stroke-width': 16, opacity: 0.12, 'stroke-linecap': 'round' });
      for (i = 0; i < 14; i++) {
        o += circle(rnd() * W, 120 + rnd() * 120, 1.4 + rnd() * 2, '#ffe9a8', { opacity: 0.45 });
      }
      o += grassLine(GROUND + 16, '#243a33');
      return o;
    },
    tree: function (rnd) {
      var o = starField(rnd, 34) + moonAt(rnd, 34, 96);
      o += tree(330, 214, 0.8, true) + tree(40, 216, 0.7, true);
      o += path('M150 210 q -22 -70 0 -120 q 20 -46 60 -30 q 44 18 34 62 q -10 50 6 88 z', '#4a3a2e');
      o += ellipse(196, 128, 30, 38, '#241a2c');
      o += ellipse(196, 128, 24, 31, '#2f2340');
      o += ellipse(170, 66, 46, 30, '#3b3158') + ellipse(232, 74, 40, 26, '#3b3158');
      o += grassLine(GROUND + 12, '#26523f');
      return o;
    },
    gate: function (rnd) {
      var o = starField(rnd, 30);
      o += rect(0, 150, W, 100, '#2b2447');
      o += rect(20, 60, 60, 150, '#4a3f70', 6) + rect(320, 60, 60, 150, '#4a3f70', 6);
      o += path('M80 210 q 120 -190 240 0 z', '#372e5c');
      o += path('M100 210 q 100 -160 200 0 z', '#241d42');
      o += circle(200, 96, 20, '#ffd76a', { opacity: 0.2 }) + circle(200, 96, 11, '#ffd76a');
      var i;
      for (i = 0; i < 9; i++) {
        o += path('M' + (110 + i * 22) + ' 150 q 10 -14 22 -4', 'none',
          { stroke: '#e8e2ff', 'stroke-width': 1.6, opacity: 0.75, 'stroke-linecap': 'round' });
      }
      return o;
    },
    court: function (rnd) {
      var o = rect(0, 0, W, H, 'url(#sky)');
      o += rect(0, 176, W, 74, '#3a2a4e');
      o += path('M0 176 h400', 'none', { stroke: '#5b3f5f', 'stroke-width': 3 });
      var i;
      for (i = 0; i < 5; i++) {
        var x = 24 + i * 88;
        o += rect(x, 30, 26, 148, '#4c3a68', 4) + rect(x - 5, 24, 36, 10, '#6b4a7a', 3);
      }
      for (i = 0; i < 9; i++) {
        o += circle(40 + i * 40, 60 + (i % 2) * 16, 8, '#ffb469', { opacity: 0.25 });
        o += circle(40 + i * 40, 60 + (i % 2) * 16, 4.4, '#ffd76a');
      }
      o += ellipse(200, 190, 110, 16, '#7d5768', { opacity: 0.5 });
      return o;
    },
    trialFire: function (rnd) {
      var o = rect(0, 0, W, H, 'url(#sky)');
      o += rect(0, 180, W, 70, '#3a2036');
      o += path('M120 200 q 0 -80 80 -110 q 80 30 80 110 z', '#7c2d3e');
      var i;
      for (i = 0; i < 12; i++) {
        var x = 130 + rnd() * 140, y = 120 + rnd() * 76;
        o += ellipse(x, y, 5 + rnd() * 6, 9 + rnd() * 10, '#ffb469', { opacity: 0.55 });
      }
      o += ellipse(200, 176, 40, 20, '#ffd76a', { opacity: 0.55 });
      return o;
    },
    trialMirror: function (rnd) {
      var o = rect(0, 0, W, H, 'url(#sky)');
      o += rect(0, 182, W, 68, '#332a52');
      var i;
      for (i = 0; i < 4; i++) {
        var x = 34 + i * 96;
        o += rect(x, 44, 68, 140, '#6f6aa6', 30);
        o += rect(x + 5, 50, 58, 128, '#b7d4ee', 26, { opacity: 0.85 });
        o += path('M' + (x + 12) + ' 160 l 22 -80', 'none', { stroke: '#ffffff', 'stroke-width': 6, opacity: 0.35 });
      }
      return o;
    },
    trialAsh: function (rnd) {
      var o = rect(0, 0, W, H, 'url(#sky)');
      o += rect(0, 180, W, 70, '#332a3e');
      o += ellipse(200, 190, 84, 26, '#4a3f4e');
      o += ellipse(200, 186, 60, 17, '#5e5260');
      var i;
      for (i = 0; i < 16; i++) o += circle(rnd() * W, 60 + rnd() * 120, 1.4 + rnd() * 1.6, '#d8d2e4', { opacity: 0.55 });
      o += circle(200, 178, 7, '#ffb469', { opacity: 0.85 });
      o += circle(200, 178, 15, '#ffb469', { opacity: 0.2 });
      return o;
    },
    bedroom: function (rnd) {
      var o = rect(0, 0, W, H, 'url(#sky)');
      o += rect(0, 0, W, 200, '#4a3a68');
      o += rect(232, 26, 116, 96, '#1f1a3c', 8);
      o += moon(300, 60, 14) + starField(rnd, 12, 110);
      o += rect(226, 20, 128, 108, 'none', 8, { stroke: '#6b5a8c', 'stroke-width': 6 });
      o += rect(0, 150, 250, 100, '#7a5b8c', 10);
      o += rect(-10, 138, 260, 28, '#c9a8d8', 12);
      o += ellipse(60, 152, 46, 18, '#f2e6f8');
      o += grassLine(232, '#5b4b7a');
      return o;
    },
    dawn: function (rnd) {
      var o = rect(0, 0, W, H, 'url(#sky)');
      o += circle(320, 96, 30, '#fff3c4', { opacity: 0.35 }) + circle(320, 96, 20, '#fff6d8');
      o += tree(50, 210, 1, true) + tree(360, 214, 0.9, true) + tree(140, 200, 0.6, true);
      o += grassLine(GROUND + 8, '#3f7a52');
      o += mushroom(70, 228, 0.9) + mushroom(320, 232, 0.8, '#f0b46a');
      return o;
    },
    moss: function (rnd) {
      var o = starField(rnd, 30) + moonAt(rnd, 40, 120);
      o += tree(350, 214, 0.9, true) + tree(24, 210, 0.8, true);
      o += grassLine(160, '#2f6b4c');
      o += ellipse(200, 208, 130, 40, '#3f8a5e');
      o += ellipse(200, 202, 100, 28, '#4fa06c');
      var i;
      for (i = 0; i < 14; i++) o += circle(rnd() * W, 150 + rnd() * 90, 1.6 + rnd() * 2.4, '#9df5c6', { opacity: 0.5 });
      return o;
    }
  };

  /* ---------- passage -> scene map ---------- */
  function s(bg, cast, sky, note) {
    return { bg: bg, cast: cast || [], sky: sky || 'night', note: note || '' };
  }

  var SCENES = {
    porch: s('porch', ['kid'], 'night', 'дете на трему прати светлуцаве отиске шапа'),
    shed: s('shed', ['kidLantern'], 'night', 'дете у шупи са лименом лампом'),
    pell: s('villageDoor', ['kid', 'pell'], 'night', 'госпођа Пел на вратима'),
    pell_lore: s('villageDoor', ['pell', 'kid'], 'night', 'госпођа Пел прича о Шупљој ноћи'),
    garden: s('hedge', ['kid'], 'night', 'живица која дише'),
    garden_shout: s('hedge', ['kidReach'], 'night', 'дете дозива Мими'),
    gap_fail: s('hedge', ['kid'], 'deep', 'дете пада кроз трње'),
    hollowwood: s('forest', ['kid'], 'night', 'Шупља шума'),
    brook: s('brook', ['kid'], 'night', 'поток са камењем за гажење'),
    brook_win: s('brook', ['kid'], 'night', 'дете прелази поток'),
    brook_crit: s('brook', ['kid', 'mimiUp'], 'night', 'савршен прелазак'),
    brook_fail: s('brook', ['kid'], 'deep', 'мокро дете у потоку'),
    brook_wade: s('brook', ['kid'], 'deep', 'дете гази кроз хладну воду'),
    bridge: s('bridge', ['kid', 'troll'], 'night', 'трол испод моста'),
    troll_riddle: s('bridge', ['troll', 'kid'], 'night', 'тролова загонетка'),
    troll_right: s('bridge', ['troll', 'kid'], 'night', 'тачан одговор'),
    troll_wrong: s('bridge', ['troll', 'kid'], 'night', 'весео погрешан одговор'),
    troll_gift: s('bridge', ['kid', 'troll'], 'night', 'риба на поклон тролу'),
    troll_kind: s('bridge', ['troll', 'kid'], 'night', 'дете теши трола'),
    ring: s('ring', ['kid', 'moth', 'moth'], 'night', 'круг мољаца'),
    ring_win: s('ring', ['moth', 'kidReach', 'moth'], 'night', 'плес са мољцима'),
    ring_fail: s('ring', ['kid', 'moth'], 'night', 'спотицање у плесу'),
    ring_watch: s('ring', ['moth', 'kid', 'moth'], 'night', 'мољци глуме причу'),
    crow_market: s('market', ['kid', 'crowHat', 'crow'], 'night', 'гаврања пијаца'),
    market_trade: s('market', ['crowHat', 'kid'], 'night', 'трампа именом'),
    market_haggle: s('market', ['kid', 'crowHat'], 'night', 'ценкање са гавраном'),
    market_token: s('market', ['crow', 'kid'], 'night', 'знак пријатеља моста'),
    market_stolen: s('market', ['kid', 'crow'], 'night', 'мапа у џепу'),
    market_caught: s('market', ['kid', 'crow', 'crowHat'], 'night', 'гаврани не промашују'),
    thornway: s('thorns', ['kidLantern'], 'deep', 'трновити пут'),
    hush_seen: s('thorns', ['kid', 'hush'], 'deep', 'Тихо-створ у трњу'),
    hush_bell: s('thorns', ['kidBell', 'hush'], 'deep', 'звоно против тишине'),
    hush_caught: s('thorns', ['kid', 'hush'], 'deep', 'Тихо-створ узима нешто'),
    witch_hut: s('hut', ['kid', 'witch'], 'night', 'чајна колиба'),
    witch_talk: s('hut', ['witch', 'kid', 'mimi'], 'night', 'вештица прича о Мими'),
    tea_red: s('hut', ['kid', 'witch'], 'warm', 'црвени чај'),
    tea_green: s('hut', ['witch', 'kid'], 'night', 'зелени чај'),
    tea_gold: s('hut', ['kid', 'witch'], 'warm', 'златни чај'),
    hollow_tree: s('tree', ['kid'], 'night', 'шупље дрво'),
    behind_tree: s('tree', ['kid', 'kitten'], 'night', 'маче иза дрвета'),
    kitten_flask: s('tree', ['kid', 'kitten'], 'night', 'храњење мачета'),
    kitten_carry: s('forest', ['kid', 'kitten'], 'night', 'дете носи маче'),
    court_gate: s('gate', ['kid'], 'deep', 'капија девет бркова'),
    gate_bell: s('gate', ['kidBell'], 'deep', 'звоњава пред капијом'),
    gate_kitten: s('gate', ['kid', 'kitten'], 'deep', 'маче отвара капију'),
    gate_thrown: s('gate', ['kid', 'courtCat'], 'deep', 'напоље, па унутра'),
    court: s('court', ['kid', 'queen', 'courtCat'], 'indoor', 'Двор деветоструког огњишта'),
    mochi_talk: s('court', ['mimiUp', 'kid'], 'indoor', 'Мими проговара'),
    kitten_evidence: s('court', ['kid', 'kitten', 'queen'], 'indoor', 'маче као доказ'),
    trial_offer: s('court', ['kid', 'queen'], 'indoor', 'понуда Двору'),
    trials: s('court', ['kid', 'queen', 'courtCat'], 'indoor', 'искушење три шапе'),
    trial_courage: s('trialFire', ['kid'], 'ember', 'врата ватре'),
    trial_c_win: s('trialFire', ['kidReach'], 'ember', 'жар узет'),
    trial_c_fail: s('trialFire', ['kid'], 'ember', 'корак уназад'),
    trial_cunning: s('trialMirror', ['kid'], 'indoor', 'врата огледала'),
    trial_m_win: s('trialMirror', ['kid', 'mimi'], 'indoor', 'нађено у погледу'),
    trial_m_fail: s('trialMirror', ['kid'], 'indoor', 'осам погрешних покушаја'),
    trial_kindness: s('trialAsh', ['kid'], 'indoor', 'врата пепела'),
    trial_k_ember: s('trialAsh', ['kidReach'], 'ember', 'огњиште поново гори'),
    trial_k_win: s('trialAsh', ['kid', 'courtCat'], 'ember', 'ништа за освојити'),
    trial_k_leave: s('trialAsh', ['kid'], 'indoor', 'одлазак из собе пепела'),
    hunt: s('thorns', ['kid', 'mimi', 'hush'], 'deep', 'тишина долази сама'),
    end_bell: s('thorns', ['kidBell', 'hush', 'mimi'], 'deep', 'звук са корењем'),
    end_shard: s('thorns', ['kid', 'hush'], 'deep', 'Тихо-створ виђен'),
    end_shield_win: s('thorns', ['kid', 'mimi', 'hush'], 'deep', 'дете штити Мими'),
    end_shield_fail: s('thorns', ['kid', 'hush'], 'deep', 'није довољно, сам'),
    end_ask_win: s('thorns', ['kid', 'hush'], 'deep', 'питање упућено тишини'),
    aftermath: s('moss', ['kid', 'mimi', 'kitten'], 'night', 'мачје свођење рачуна'),
    end_home: s('bedroom', ['kid', 'mimi'], 'indoor', 'удубљење у јоргану'),
    end_stay: s('forest', ['mimiUp', 'kid'], 'night', 'стални позив'),
    end_both: s('bedroom', ['kid', 'mimi', 'kitten'], 'indoor', 'две мачке, једна Чуварка'),
    end_wild: s('dawn', ['kid', 'mimi'], 'dawn', 'дете које је остало до јутра'),
    faint: s('moss', ['kid', 'mimi'], 'night', 'шума те задржи још мало')
  };

  /* ---------- layout ---------- */
  /* Characters stand on the ground line, spread across the frame, the biggest
     one slightly forward so the group never looks like a police line-up. */
  var SLOTS = {
    1: [[200, 1]],
    2: [[132, 1], [278, 0.92]],
    3: [[92, 0.92], [200, 1], [312, 0.86]]
  };

  function castLayer(cast, rnd) {
    var n = Math.min(cast.length, 3);
    if (!n) return '';
    var slots = SLOTS[n];
    var out = '';
    for (var i = 0; i < n; i++) {
      var name = cast[i];
      var ch = CHARACTERS[name];
      if (!ch) continue;
      var x = slots[i][0];
      var scale = slots[i][1];
      var y = GROUND + 14 + (i === 1 && n === 3 ? 10 : 0);
      /* moths and small things float a little above the ground */
      if (name === 'moth') y -= 60 + rnd() * 30;
      if (name === 'hush') y -= 6;
      var sc = scale * (ch.size || 1);
      out += el('ellipse', {
        cx: r2(x), cy: r2(y - 26 * sc), rx: r2(40 * sc), ry: r2(46 * sc),
        fill: '#ffe9a8', opacity: 0.09
      });
      out += el('ellipse', {
        cx: r2(x), cy: r2(y + 2), rx: r2(26 * sc), ry: r2(6 * sc),
        fill: '#000000', opacity: 0.22
      });
      out += g('translate(' + r2(x) + ',' + r2(y - ch.foot * sc) + ') scale(' + r2(sc) + ')', ch.draw());
    }
    return out;
  }

  function sceneFor(id) {
    return SCENES[id] || s('forest', ['kid'], 'night', 'шума');
  }

  function svg(id) {
    var scene = sceneFor(id);
    var rnd = rngFrom(seedOf(id));
    var bg = (BACKGROUNDS[scene.bg] || BACKGROUNDS.forest)(rnd);
    var defs = el('defs', null,
      sky(scene.sky) +
      el('radialGradient', { id: 'vig', cx: '0.5', cy: '0.5', r: '0.75' },
        el('stop', { offset: '0.55', 'stop-color': '#000000', 'stop-opacity': '0' }) +
        el('stop', { offset: '1', 'stop-color': '#000000', 'stop-opacity': '0.4' })));
    var inner = defs +
      rect(0, 0, W, H, 'url(#sky)') +
      bg +
      castLayer(scene.cast, rnd) +
      rect(0, 0, W, H, 'url(#vig)');
    return el('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      xmlns: 'http://www.w3.org/2000/svg',
      preserveAspectRatio: 'xMidYMid slice',
      role: 'img',
      'aria-label': altFor(id)
    }, inner);
  }

  function altFor(id) {
    var scene = sceneFor(id);
    var who = [];
    for (var i = 0; i < scene.cast.length; i++) {
      var ch = CHARACTERS[scene.cast[i]];
      if (ch && who.indexOf(ch.name) === -1) who.push(ch.name);
    }
    var base = 'Слика: ' + (scene.note || 'сцена из приче');
    return who.length ? base + ' (' + who.join(', ') + ')' : base;
  }

  return { svg: svg, altFor: altFor, scenes: SCENES, characters: CHARACTERS };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = ART;
