/* Први дан петог разреда — art
 *
 * Every passage gets its own illustration, drawn as an SVG scene right in the
 * browser (no image files, no network, works from any static host).
 *
 * Two rules the pictures follow:
 *   1. Nothing scary. This is a children's book: round shapes, soft colours,
 *      friendly faces, even for the PE teacher with the whistle.
 *   2. A character always looks the same. Characters live in CHARACTERS below,
 *      each with a fixed palette and fixed hair, so Лука is the same boy in the
 *      too-big green hoodie in every scene he appears in.
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
  function eye(x, y, r, colour, look) {
    var dx = (look === 'left' ? -0.2 : look === 'right' ? 0.2 : 0) * r;
    return circle(x, y, r, '#231d33') +
      circle(x + dx, y + r * 0.05, r * 0.72, colour || '#6ec6ff') +
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
   * Everybody in the school is drawn by one function; only the palette, the
   * hair and the props change, so a character is recognisably the same person
   * in every scene they appear in.
   */
  function hairShape(style, hair, hair2) {
    switch (style) {
      case 'pony':
        return path('M22 -4 q 14 4 10 22 q -4 12 -14 12 q 10 -14 4 -34 z', hair) +
          path('M-17 -2 q 0 -19 17 -19 q 17 0 17 19 q -7 -11 -17 -10 q -10 -1 -17 10 z', hair);
      case 'bun':
        return circle(0, -20, 8.5, hair) +
          path('M-16 -2 q 0 -18 16 -18 q 16 0 16 18 q -6 -12 -16 -11 q -10 -1 -16 11 z', hair);
      case 'bob':
        return path('M-18 6 q -3 -28 18 -28 q 21 0 18 28 q -5 -14 -18 -13 q -13 -1 -18 13 z', hair);
      case 'curly':
        return circle(-11, -10, 8, hair) + circle(0, -15, 8.5, hair) + circle(11, -10, 8, hair) +
          path('M-17 -1 q 1 -17 17 -17 q 16 0 17 17 q -7 -10 -17 -9 q -10 -1 -17 9 z', hair);
      case 'short':
      default:
        return path('M-17 -1 q -1 -20 17 -20 q 18 0 17 20 q -4 -10 -9 -9 q -3 -6 -9 -3 q -7 -1 -9 5 q -4 0 -7 7 z', hair) +
          path('M-14 -5 q 2 -8 6 -10', 'none', { stroke: hair2 || hair, 'stroke-width': 2, 'stroke-linecap': 'round' });
    }
  }

  /* One body for everyone: children are simply drawn smaller (see CHARACTERS). */
  function person(p, opts) {
    opts = opts || {};
    var skin = p.skin || '#f7d3ae';
    var top = p.top, bottom = p.bottom, shoes = p.shoes || '#3a3550';
    var o = '';

    /* ранац се црта иза тела, да се увек види да неко иде у школу */
    if (p.bag && !opts.noBag) o += drawBackpack(p.reversed ? 20 : -20, -6, p.bag);

    /* legs + shoes */
    o += rect(-11, 8, 9, 26, bottom, 4.5) + rect(2, 8, 9, 26, bottom, 4.5);
    if (p.stripes) {
      o += path('M-10.5 10 v24 M10.5 10 v24', 'none', { stroke: '#ffffff', 'stroke-width': 1.6, opacity: 0.85 });
    }
    o += ellipse(-6.5, 35, 6.8, 4, shoes) + ellipse(6.5, 35, 6.8, 4, shoes);

    /* skirt / coat / torso */
    if (p.skirt) o += path('M-13 -2 l -6 22 q 19 6 38 0 l -6 -22 z', p.skirt);
    o += path('M-14 -14 q 14 -6 28 0 l 3 26 q -17 6 -34 0 z', top);
    if (p.coat) {
      o += path('M-15 -13 q -4 20 -2 30 q -6 2 -9 0 l 4 -30 z', p.coat) +
        path('M15 -13 q 4 20 2 30 q 6 2 9 0 l -4 -30 z', p.coat);
      o += path('M-6 -14 q 6 4 12 0 l -2 30 q -4 1 -8 0 z', p.coat);
    }
    if (p.tie) o += path('M0 -12 l 4 5 l -4 12 l -4 -12 z', p.tie);

    /* arms */
    if (opts.raise) {
      o += path('M-13 -8 q -10 6 -10 16', 'none', { stroke: top, 'stroke-width': 8, 'stroke-linecap': 'round' });
      o += circle(-23, 9, 4.6, skin);
      o += path('M13 -8 q 12 -14 10 -28', 'none', { stroke: top, 'stroke-width': 8, 'stroke-linecap': 'round' });
      o += circle(23, -38, 4.8, skin);
    } else if (opts.reach) {
      o += path('M-13 -8 q -12 -6 -16 -16', 'none', { stroke: top, 'stroke-width': 8, 'stroke-linecap': 'round' });
      o += circle(-30, -25, 4.6, skin);
      o += path('M13 -8 q 12 -6 16 -16', 'none', { stroke: top, 'stroke-width': 8, 'stroke-linecap': 'round' });
      o += circle(30, -25, 4.6, skin);
    } else {
      o += path('M-13 -8 q -10 6 -10 16', 'none', { stroke: top, 'stroke-width': 8, 'stroke-linecap': 'round' });
      o += circle(-23, 9, 4.6, skin);
      o += path('M13 -8 q 10 6 10 16', 'none', { stroke: top, 'stroke-width': 8, 'stroke-linecap': 'round' });
      o += circle(23, 9, 4.6, skin);
    }

    /* head */
    o += g('translate(0,-32)',
      ellipse(0, 0, 17, 17.5, skin) +
      ellipse(0, 6, 12, 10, '#e5b98f', { opacity: 0.16 }) +
      hairShape(p.hairStyle, p.hair, p.hair2) +
      (opts.sleepy
        ? sleepyEye(-6.4, 2, 4) + sleepyEye(6.4, 2, 4)
        : eye(-6.4, 2, 4.3, p.eye, opts.look) + eye(6.4, 2, 4.3, p.eye, opts.look)) +
      (opts.mouth === 'open' ? ellipse(0, 10, 3.4, 4.2, '#c9576f') : smile(-3, 9.5, 3)) +
      blush(-11, 7, 4, '#ff9db1') + blush(11, 7, 4, '#ff9db1') +
      (p.freckles
        ? circle(-9, 4.5, 0.7, '#c98d63') + circle(-6, 6.5, 0.6, '#c98d63') +
          circle(9, 4.5, 0.7, '#c98d63') + circle(6, 6.5, 0.6, '#c98d63')
        : '') +
      (p.glasses
        ? circle(-6.4, 2, 6.2, 'none', { stroke: p.glasses, 'stroke-width': 1.4 }) +
          circle(6.4, 2, 6.2, 'none', { stroke: p.glasses, 'stroke-width': 1.4 }) +
          path('M-0.2 2 h0.4 M-12.6 2 h-4 M12.6 2 h4', 'none', { stroke: p.glasses, 'stroke-width': 1.4 })
        : ''));

    if (p.whistle) {
      o += path('M0 -18 q -9 8 -10 16', 'none', { stroke: '#e8e2ff', 'stroke-width': 1.6 });
      o += rect(-14, -3, 11, 5, '#ffd76a', 2) + circle(-4, -0.5, 1.4, '#c9a227');
    }
    if (opts.chalk) o += rect(opts.raise ? 21 : 26, opts.raise ? -46 : -2, 4, 10, '#fdf6e6', 2);
    if (opts.book) o += rect(16, 0, 16, 12, '#f0b45a', 2) + rect(16, 0, 16, 3, '#c98a3a', 1);
    if (opts.cup) o += g('translate(26,2) scale(0.8)', drawCup());
    return o;
  }

  function drawBackpack(x, y, colour) {
    return g('translate(' + x + ',' + y + ')',
      rect(-10, -13, 20, 30, colour, 8) +
      rect(-10, 0, 20, 9, '#ffffff', 4, { opacity: 0.3 }) +
      circle(0, 5, 2.4, '#ffffff', { opacity: 0.65 }) +
      path('M-5 -13 q 5 -7 10 0', 'none', { stroke: colour, 'stroke-width': 2.6 }));
  }

  function drawCup() {
    return ellipse(0, 0, 8, 6, '#fdf6e6') + rect(-8, -6, 16, 8, '#fdf6e6', 2) +
      path('M8 -4 q 6 2 0 6', 'none', { stroke: '#fdf6e6', 'stroke-width': 2 }) +
      ellipse(0, -6, 8, 3, '#e2a35d');
  }

  /* Мими, риђа школска мачка: увек иста, са белом брадицом и зеленим очима. */
  function drawCat(opts) {
    opts = opts || {};
    var fur = '#e2915a', belly = '#f6dcb4', inner = '#f2b6a0';
    var o = '';
    o += path(opts.tailUp ? 'M18 6 q 16 -2 14 -22 q -1 -9 -8 -9' : 'M18 8 q 18 2 20 -12 q 1 -8 -6 -9',
      'none', { stroke: fur, 'stroke-width': 7, 'stroke-linecap': 'round' });
    o += ellipse(0, 0, 20, 17, fur);
    o += ellipse(0, 5, 12, 10, belly);
    o += ellipse(-9, 15, 6.4, 4.6, fur) + ellipse(8, 15, 6.4, 4.6, belly);
    o += g('translate(0,-20)',
      path('M-16 -2 l -3 -16 l 14 7 z', fur) +
      path('M16 -2 l 3 -16 l -14 7 z', fur) +
      path('M-13 -3 l -1.6 -9 l 8 4 z', inner) +
      path('M13 -3 l 1.6 -9 l -8 4 z', inner) +
      ellipse(0, 0, 17, 15, fur) +
      ellipse(0, 5, 12, 9, belly, { opacity: 0.9 }) +
      eye(-6.6, -1, 4.4, '#8ef0a5', opts.look) +
      eye(6.6, -1, 4.4, '#8ef0a5', opts.look) +
      path('M-2.6 4.4 l 5.2 0 l -2.6 3 z', '#c96f7e') +
      smile(-4, 7.6, 4) + smile(1.4, 7.6, 3) +
      blush(-11, 5, 3.6, '#ff9db1') + blush(11, 5, 3.6, '#ff9db1') +
      path('M-14 3 l -9 -2 M-14 6 l -9 3 M14 3 l 9 -2 M14 6 l 9 3', 'none',
        { stroke: '#ffffff', 'stroke-width': 0.9, opacity: 0.85, 'stroke-linecap': 'round' }));
    return o;
  }

  function drawPigeon() {
    return path('M2 0 q 14 2 16 -6 q -2 10 -14 10', '#8b93a8') +
      ellipse(0, 0, 12, 10, '#9aa2b8') +
      ellipse(-3, 2, 7, 6, '#c3c9d8') +
      g('translate(-9,-9)',
        circle(0, 0, 6.5, '#9aa2b8') +
        path('M-6 1 l -6 2 l 6 2 z', '#f5a623') +
        circle(1, -1, 2, '#231d33') + circle(0.4, -1.6, 0.7, '#ffffff')) +
      path('M-2 9 l 0 4 M4 9 l 0 4', 'none', { stroke: '#f5a623', 'stroke-width': 2, 'stroke-linecap': 'round' });
  }

  /* palettes — fixed per character */
  var P_KID = { skin: '#f7d3ae', hair: '#4a3324', hair2: '#6b4a34', hairStyle: 'short', eye: '#6ec6ff', top: '#4fa3e3', bottom: '#35406b', shoes: '#ffd76a', bag: '#e2565f', freckles: true };
  var P_LUKA = { skin: '#eec49b', hair: '#2f2a25', hairStyle: 'curly', eye: '#8a6a3a', top: '#7cc47a', bottom: '#4a4a5e', shoes: '#f2f2f2', bag: '#3f8ad8' };
  var P_ANA = { skin: '#f8dcc0', hair: '#6b3f2a', hairStyle: 'pony', eye: '#7fd0ff', top: '#f2a0c0', skirt: '#6b4a8c', bottom: '#8a6ea8', shoes: '#ffffff', bag: '#f0b45a' };
  var P_SOFIJA = { skin: '#f7d3ae', hair: '#f0c86a', hairStyle: 'bob', eye: '#8ef0a5', top: '#7ce7c8', bottom: '#4a5a7a', shoes: '#ff9db1', freckles: true };
  var P_MATH = { skin: '#f0cba6', hair: '#b9b3c9', hairStyle: 'short', eye: '#7a86a8', top: '#dfe4f0', bottom: '#3a3f52', shoes: '#2f2b40', tie: '#c96f7e' };
  var P_MIRA = { skin: '#f7d3ae', hair: '#8c6b57', hairStyle: 'bun', eye: '#8a6a3a', top: '#c98fbb', bottom: '#4a3f60', shoes: '#3a3550', glasses: '#5b4b8a' };
  var P_ENG = { skin: '#e8bb92', hair: '#3a2f4a', hairStyle: 'bob', eye: '#6ec6ff', top: '#f0b45a', bottom: '#35406b', shoes: '#ffffff' };
  var P_BIO = { skin: '#f7d3ae', hair: '#7a5b8c', hairStyle: 'bun', eye: '#8ef0a5', top: '#eef0f8', bottom: '#5b6a8a', shoes: '#dfe4f0', coat: '#f7f8fc', glasses: '#4a5a7a' };
  var P_RASA = { skin: '#e0b184', hair: '#35302b', hairStyle: 'short', eye: '#8a6a3a', top: '#3f5bd8', bottom: '#3f5bd8', shoes: '#ffffff', stripes: true, whistle: true };
  var P_VERA = { skin: '#f7d3ae', hair: '#d8d3e0', hairStyle: 'bob', eye: '#7fd0ff', top: '#7ce7c8', bottom: '#4a4a6e', shoes: '#3a3550', glasses: '#c96f7e' };
  var P_MILICA = { skin: '#f0cba6', hair: '#4a3324', hairStyle: 'pony', eye: '#8ef0a5', top: '#b9a3e3', bottom: '#4a3f60', shoes: '#f2e6c8' };
  var P_MOM = { skin: '#f7d3ae', hair: '#5b3a2a', hairStyle: 'bun', eye: '#8a6a3a', top: '#e2856f', bottom: '#3f4a6b', shoes: '#c98d63' };
  var P_KIOSK = { skin: '#e0b184', hair: '#6b6257', hairStyle: 'short', eye: '#7a86a8', top: '#f0d18a', bottom: '#4a4a5e', shoes: '#3a3550', glasses: '#4a4a5e' };

  function ch(p, opts, name, foot, size) {
    return {
      draw: function () { return person(p, opts || {}); },
      foot: foot || 39, size: size || 1, name: name
    };
  }

  var CHARACTERS = {
    kid: ch(P_KID, {}, 'дете из петог разреда', 39),
    kidHand: ch(P_KID, { raise: true, mouth: 'open' }, 'дете које диже руку', 39),
    kidChalk: ch(P_KID, { raise: true, chalk: true }, 'дете са кредом', 39),
    kidReach: ch(P_KID, { reach: true, mouth: 'open' }, 'дете у скоку', 39),
    kidSleepy: ch(P_KID, { sleepy: true }, 'поспано дете', 39),
    kidBook: ch(P_KID, { book: true }, 'дете са свеском', 39),
    kidNoBag: ch(P_KID, { noBag: true }, 'дете без ранца', 39),
    luka: ch(P_LUKA, {}, 'Лука, друг из одељења', 39),
    lukaHand: ch(P_LUKA, { raise: true }, 'Лука диже руку', 39),
    ana: ch(P_ANA, {}, 'Ана из одељења', 39),
    sofija: ch(P_SOFIJA, {}, 'Софија из одељења', 39),
    teacherMath: ch(P_MATH, { chalk: true }, 'наставник Ђорђевић', 41, 1.16),
    teacherSerbian: ch(P_MIRA, { book: true }, 'наставница Мира', 40, 1.12),
    teacherEnglish: ch(P_ENG, { book: true }, 'наставница Ана', 40, 1.12),
    teacherBio: ch(P_BIO, {}, 'наставница Даница', 40, 1.14),
    teacherPe: ch(P_RASA, { raise: true }, 'наставник Раша', 41, 1.18),
    vera: ch(P_VERA, { book: true }, 'наставница Вера', 40, 1.12),
    milica: ch(P_MILICA, { cup: true }, 'педагог Милица', 40, 1.12),
    mom: ch(P_MOM, {}, 'мама', 40, 1.14),
    kiosk: ch(P_KIOSK, {}, 'продавац на киоску', 40, 1.12),
    cat: { draw: function () { return drawCat({}); }, foot: 20, size: 1.25, name: 'Мими, риђа школска мачка' },
    catUp: { draw: function () { return drawCat({ tailUp: true }); }, foot: 20, size: 1.25, name: 'Мими' },
    pigeon: { draw: drawPigeon, foot: 13, size: 1.2, name: 'голуб', small: true }
  };

  /* ---------- background pieces ---------- */
  function sun(x, y, r) {
    return circle(x, y, r * 2.2, '#fff3c4', { opacity: 0.18 }) +
      circle(x, y, r * 1.5, '#fff3c4', { opacity: 0.22 }) +
      circle(x, y, r, '#fff6d8');
  }
  function cloud(x, y, s, op) {
    return g('translate(' + r2(x) + ',' + r2(y) + ') scale(' + r2(s) + ')',
      ellipse(0, 0, 26, 13, '#ffffff', { opacity: op || 0.7 }) +
      ellipse(-16, 3, 15, 9, '#ffffff', { opacity: op || 0.7 }) +
      ellipse(16, 3, 17, 10, '#ffffff', { opacity: op || 0.7 }));
  }
  function clouds(rnd, n) {
    var o = '';
    for (var i = 0; i < n; i++) o += cloud(rnd() * W, 20 + rnd() * 50, 0.6 + rnd() * 0.6, 0.45 + rnd() * 0.35);
    return o;
  }
  /* Belgrade block of flats: plaster, balconies, a satellite dish or two. */
  function block(x, y, w, h, wall, rnd) {
    var o = rect(x, y, w, h, wall, 4);
    var cols = Math.max(2, Math.floor(w / 26));
    var rows = Math.max(2, Math.floor(h / 30));
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var wx = x + 8 + c * ((w - 16) / cols);
        var wy = y + 10 + r * ((h - 20) / rows);
        var lit = rnd() > 0.6;
        o += rect(wx, wy, 13, 11, lit ? '#ffe9a8' : '#9fb2d8', 2, { opacity: lit ? 0.9 : 0.75 });
      }
    }
    o += rect(x - 2, y - 5, w + 4, 6, '#8a93b8', 2);
    return o;
  }
  function treeGreen(x, baseY, s) {
    return path('M' + (x - 4 * s) + ' ' + baseY + ' l ' + 8 * s + ' 0 l -2 -' + 34 * s + ' l -4 0 z', '#7a5b42') +
      ellipse(x, baseY - 44 * s, 26 * s, 22 * s, '#5aa864') +
      ellipse(x - 16 * s, baseY - 32 * s, 16 * s, 13 * s, '#4d9758') +
      ellipse(x + 17 * s, baseY - 34 * s, 15 * s, 12 * s, '#66b56f');
  }
  function floorTiles(y, a, b) {
    var o = rect(0, y, W, H - y, a);
    for (var i = 0; i < 9; i++) {
      o += path('M' + (i * 50 - 40) + ' ' + H + ' L' + (i * 46 + 30) + ' ' + y, 'none',
        { stroke: b, 'stroke-width': 2, opacity: 0.5 });
    }
    o += path('M0 ' + (y + 22) + ' h400 M0 ' + (y + 44) + ' h400', 'none', { stroke: b, 'stroke-width': 2, opacity: 0.35 });
    return o;
  }
  function desk(x, y, s, top, legs) {
    return rect(x - 26 * s, y - 4 * s, 52 * s, 6 * s, top, 3) +
      rect(x - 22 * s, y + 2 * s, 4 * s, 18 * s, legs) +
      rect(x + 18 * s, y + 2 * s, 4 * s, 18 * s, legs);
  }
  function board(x, y, w, h, colour, chalkLines) {
    var o = rect(x - 5, y - 5, w + 10, h + 10, '#8a6a4e', 4) + rect(x, y, w, h, colour || '#2f5a45', 2);
    if (chalkLines) o += chalkLines;
    o += rect(x, y + h, w, 5, '#a8845e', 2);
    return o;
  }
  function windowWall(rnd, y, h) {
    var o = '';
    for (var i = 0; i < 3; i++) {
      var x = 22 + i * 130;
      o += rect(x, y, 96, h, '#bcd8f2', 4) +
        rect(x, y, 96, h, 'none', 4, { stroke: '#e8e2ff', 'stroke-width': 4 }) +
        path('M' + (x + 48) + ' ' + y + ' v' + h + ' M' + x + ' ' + (y + h / 2) + ' h96', 'none',
          { stroke: '#e8e2ff', 'stroke-width': 3 }) +
        path('M' + (x + 10) + ' ' + (y + h - 12) + ' l 28 -' + (h - 24), 'none',
          { stroke: '#ffffff', 'stroke-width': 8, opacity: 0.35 });
    }
    return o;
  }

  var SKIES = {
    morning: ['#7fc3f0', '#a9dcf5', '#ffe6bd'],
    day: ['#5fb0ec', '#8fd0f2', '#d9f0ff'],
    indoor: ['#cfe0f5', '#e6eefb', '#f6f2e8'],
    warm: ['#f7c98a', '#f9dcb0', '#fff1d8'],
    gym: ['#dfe7f5', '#eef2fa', '#f8e9cf'],
    dusk: ['#f0a05a', '#f7c07a', '#ffe2b0']
  };

  function sky(kind, uid) {
    var c = SKIES[kind] || SKIES.day;
    return el('linearGradient', { id: 'sky' + uid, x1: '0', y1: '0', x2: '0', y2: '1' },
      el('stop', { offset: '0', 'stop-color': c[0] }) +
      el('stop', { offset: '0.6', 'stop-color': c[1] }) +
      el('stop', { offset: '1', 'stop-color': c[2] }));
  }

  var BACKGROUNDS = {
    /* ---------- кућа и улица ---------- */
    kitchen: function (rnd) {
      var o = rect(0, 0, W, H, '#f3e2c8');
      o += rect(0, 0, W, 150, '#f7d9ae');
      o += rect(240, 24, 130, 100, '#bcd8f2', 6) +
        rect(240, 24, 130, 100, 'none', 6, { stroke: '#ffffff', 'stroke-width': 5 }) +
        path('M305 24 v100 M240 74 h130', 'none', { stroke: '#ffffff', 'stroke-width': 4 });
      o += rect(252, 60, 40, 64, '#c9a87e', 2) + rect(318, 48, 44, 76, '#b9987a', 2);
      o += rect(10, 30, 96, 70, '#dfa06a', 5) + path('M58 30 v70 M10 65 h96', 'none', { stroke: '#c9834e', 'stroke-width': 3 });
      o += rect(120, 44, 90, 46, '#e8b9c9', 5) + circle(146, 67, 7, '#fdf6e6') + circle(184, 67, 7, '#fdf6e6');
      o += rect(0, 150, W, 20, '#c98d63');
      o += rect(0, 170, W, 80, '#a86b46');
      o += rect(30, 128, 120, 24, '#f7f2e2', 4);
      o += g('translate(70,120) scale(1.1)', drawCup());
      o += rect(190, 120, 34, 30, '#e2565f', 6) + rect(190, 130, 34, 8, '#ffffff', 2, { opacity: 0.3 });
      return o;
    },
    street: function (rnd) {
      var o = clouds(rnd, 3) + sun(340, 40, 20);
      o += block(0, 60, 110, 130, '#e4d6c0', rnd) + block(120, 40, 96, 150, '#d8c3ae', rnd) +
        block(228, 72, 84, 118, '#e8dcc6', rnd) + block(320, 54, 90, 136, '#d3c0ac', rnd);
      o += treeGreen(60, 190, 0.7) + treeGreen(300, 192, 0.6);
      o += rect(0, 190, W, 20, '#c3bcb0');
      o += rect(0, 210, W, 40, '#6b6870');
      o += path('M0 232 h40 M70 232 h40 M140 232 h40 M210 232 h40 M280 232 h40 M350 232 h40', 'none',
        { stroke: '#f2e6c8', 'stroke-width': 3, opacity: 0.8 });
      o += path('M0 46 q 200 14 400 0', 'none', { stroke: '#7a7a8a', 'stroke-width': 1.4, opacity: 0.7 });
      return o;
    },
    kiosk: function (rnd) {
      var o = clouds(rnd, 2) + sun(60, 34, 16);
      o += block(230, 40, 170, 150, '#ddc9b2', rnd);
      o += rect(0, 190, W, 60, '#8f8a92');
      o += rect(40, 80, 190, 112, '#5fa8c9', 6);
      o += rect(30, 68, 210, 18, '#3f7f9c', 4);
      o += rect(56, 96, 158, 60, '#e8f4fb', 3);
      o += rect(56, 96, 158, 60, 'none', 3, { stroke: '#3f7f9c', 'stroke-width': 3 });
      o += rect(66, 104, 32, 44, '#f0b45a', 2) + rect(104, 104, 32, 44, '#c96f7e', 2) +
        rect(142, 104, 32, 44, '#7cc47a', 2) + rect(180, 104, 26, 44, '#8fa8f0', 2);
      o += rect(56, 160, 158, 8, '#3f7f9c', 2);
      o += path('M250 190 l 6 -26 l 10 0 l 6 26 z', '#7a5b42');
      return o;
    },
    bus: function (rnd) {
      var o = rect(0, 0, W, H, '#d8dce8');
      o += rect(0, 0, W, 26, '#b9becf');
      o += rect(20, 34, 110, 76, '#bcd8f2', 6) + rect(150, 34, 110, 76, '#bcd8f2', 6) + rect(280, 34, 100, 76, '#bcd8f2', 6);
      o += path('M30 100 l 40 -56 M170 100 l 40 -56 M296 100 l 40 -56', 'none', { stroke: '#ffffff', 'stroke-width': 8, opacity: 0.4 });
      o += rect(0, 110, W, 10, '#9aa2b8');
      var i;
      for (i = 0; i < 5; i++) {
        o += rect(24 + i * 84, 118, 8, 60, '#8f97ad', 4);
        o += path('M' + (28 + i * 84) + ' 118 q -10 -8 0 -14', 'none', { stroke: '#c3c9d8', 'stroke-width': 3 });
      }
      o += rect(0, 178, W, 72, '#7f8699');
      o += path('M0 190 h400', 'none', { stroke: '#6b7183', 'stroke-width': 3 });
      o += rect(300, 120, 90, 70, '#c96f7e', 6, { opacity: 0.55 });
      return o;
    },
    park: function (rnd) {
      var o = clouds(rnd, 3) + sun(70, 36, 18);
      o += rect(0, 150, W, 100, '#8ec98a');
      o += treeGreen(50, 190, 1) + treeGreen(340, 194, 0.9) + treeGreen(200, 176, 0.6);
      o += path('M0 214 q 120 -22 400 -4 L400 250 L0 250 z', '#d9c9a2');
      o += rect(250, 150, 76, 10, '#a8845e', 3) + rect(256, 160, 6, 22, '#6b6870') + rect(314, 160, 6, 22, '#6b6870');
      var i;
      for (i = 0; i < 12; i++) o += circle(rnd() * W, 150 + rnd() * 96, 1.6 + rnd() * 2, '#ffe9a8', { opacity: 0.5 });
      return o;
    },
    /* ---------- школа ---------- */
    yard: function (rnd) {
      var o = clouds(rnd, 3) + sun(48, 34, 18);
      o += rect(180, 30, 220, 160, '#f0dcc0', 4);
      o += rect(180, 30, 220, 14, '#c98d63', 3);
      var i;
      for (i = 0; i < 4; i++) o += rect(196 + i * 50, 56, 34, 30, '#bcd8f2', 3, { stroke: '#ffffff', 'stroke-width': 3 });
      for (i = 0; i < 4; i++) o += rect(196 + i * 50, 100, 34, 30, '#bcd8f2', 3, { stroke: '#ffffff', 'stroke-width': 3 });
      o += rect(250, 142, 44, 48, '#c96f7e', 4) + circle(286, 168, 3, '#ffd76a');
      o += treeGreen(70, 186, 0.85);
      o += rect(0, 186, W, 64, '#b9b4ab');
      o += rect(96, 60, 8, 126, '#8f97ad') + rect(70, 54, 60, 8, '#8f97ad', 3);
      o += rect(84, 62, 32, 22, 'none', 2, { stroke: '#ffffff', 'stroke-width': 2 });
      o += path('M0 214 h400', 'none', { stroke: '#f2e6c8', 'stroke-width': 3, opacity: 0.7 });
      return o;
    },
    hallway: function (rnd) {
      var o = rect(0, 0, W, H, '#f2e8d8');
      o += rect(0, 0, W, 118, '#e8dcc6');
      o += rect(0, 112, W, 12, '#c9a87e');
      o += floorTiles(160, '#d8c9b0', '#bfae94');
      var i;
      for (i = 0; i < 3; i++) {
        var x = 30 + i * 130;
        o += rect(x, 40, 62, 120, '#a8785a', 4) + circle(x + 52, 106, 3.4, '#ffd76a');
        o += rect(x + 12, 52, 38, 26, '#bcd8f2', 2);
        o += rect(x + 20, 30, 22, 10, '#f7f2e2', 2);
      }
      o += rect(300, 44, 76, 54, '#f7f2e2', 3) + path('M306 56 h64 M306 68 h64 M306 80 h44', 'none',
        { stroke: '#b9aa92', 'stroke-width': 3 });
      return o;
    },
    classroom: function (rnd) {
      var o = rect(0, 0, W, H, '#f6efdf');
      o += rect(0, 0, W, 130, '#efe3cb');
      o += board(28, 26, 200, 92, '#2f5a45',
        path('M46 50 h60 M46 66 h96 M46 82 h44', 'none', { stroke: '#f7f4e8', 'stroke-width': 3, opacity: 0.9 }) +
        path('M170 46 q 16 10 0 22', 'none', { stroke: '#ffe9a8', 'stroke-width': 3 }));
      o += rect(256, 24, 122, 96, '#bcd8f2', 4) + rect(256, 24, 122, 96, 'none', 4, { stroke: '#ffffff', 'stroke-width': 5 }) +
        path('M317 24 v96 M256 72 h122', 'none', { stroke: '#ffffff', 'stroke-width': 4 });
      o += rect(0, 130, W, 10, '#c9a87e');
      o += floorTiles(160, '#dfd0b4', '#c3b294');
      o += desk(70, 210, 1, '#e8c9a0', '#a8845e') + desk(330, 214, 1, '#e8c9a0', '#a8845e');
      return o;
    },
    langroom: function (rnd) {
      var o = rect(0, 0, W, H, '#f4eee2');
      o += rect(0, 0, W, 132, '#e6e8f2');
      /* мапа Лондона већа од табле */
      o += rect(30, 20, 180, 108, '#cfe4d8', 4) + rect(30, 20, 180, 108, 'none', 4, { stroke: '#8a93b8', 'stroke-width': 3 });
      o += path('M40 96 q 40 -14 60 4 q 30 16 66 -6', 'none', { stroke: '#5fa8c9', 'stroke-width': 5 });
      o += circle(120, 70, 5, '#c96f7e') + rect(146, 44, 8, 40, '#b9a98a', 2) + rect(142, 38, 16, 10, '#e8c98a', 2);
      o += rect(240, 30, 130, 88, '#2f4a6b', 3) + path('M252 48 h60 M252 64 h96 M252 80 h50', 'none',
        { stroke: '#f7f4e8', 'stroke-width': 3, opacity: 0.85 });
      o += rect(0, 132, W, 10, '#b9a98a');
      o += floorTiles(162, '#d6d2c4', '#bab5a4');
      o += desk(60, 216, 0.9, '#dfe4f0', '#8a93b8') + desk(340, 214, 0.9, '#dfe4f0', '#8a93b8');
      return o;
    },
    biolab: function (rnd) {
      var o = rect(0, 0, W, H, '#eef4ec');
      o += rect(0, 0, W, 128, '#dfeee0');
      o += windowWall(rnd, 22, 78);
      o += rect(0, 128, W, 10, '#a8bda8');
      o += floorTiles(158, '#cfdccd', '#b2c3b1');
      /* скелет у ћошку, са шкољком на глави */
      o += g('translate(356,150) scale(0.8)',
        rect(-3, -60, 6, 60, '#f2f2f0', 3) +
        path('M-14 -46 h28 M-12 -36 h24 M-10 -26 h20', 'none', { stroke: '#f2f2f0', 'stroke-width': 4, 'stroke-linecap': 'round' }) +
        circle(0, -70, 10, '#f7f7f4') + circle(-3.5, -71, 2, '#8a93b8') + circle(3.5, -71, 2, '#8a93b8') +
        path('M-10 -80 q 10 -10 20 0 q -10 4 -20 0 z', '#f0a6b6'));
      /* микроскоп на клупи */
      o += desk(120, 206, 1.15, '#dfe4f0', '#8a93b8');
      o += g('translate(120,182)',
        rect(-14, 14, 28, 6, '#4a5a7a', 3) +
        path('M0 14 q -12 -14 0 -26', 'none', { stroke: '#4a5a7a', 'stroke-width': 6 }) +
        rect(-3, -22, 10, 22, '#5b6a8a', 3) + circle(6, -24, 4, '#bcd8f2'));
      o += rect(276, 176, 44, 26, '#cfe4d8', 3) + circle(298, 189, 8, '#8ec98a');
      return o;
    },
    gym: function (rnd) {
      var o = rect(0, 0, W, H, '#f5e9d2');
      o += rect(0, 0, W, 120, '#e8dfc8');
      var i;
      for (i = 0; i < 6; i++) o += rect(12 + i * 66, 18, 44, 74, '#bcd8f2', 3, { stroke: '#e8e2ff', 'stroke-width': 3 });
      o += rect(0, 120, W, 12, '#c9a87e');
      o += rect(0, 132, W, 118, '#e8c294');
      for (i = 0; i < 6; i++) o += path('M0 ' + (150 + i * 18) + ' h400', 'none', { stroke: '#d8ab78', 'stroke-width': 2, opacity: 0.6 });
      o += path('M40 236 q 160 -40 320 0', 'none', { stroke: '#c96f7e', 'stroke-width': 3, opacity: 0.8 });
      o += path('M20 200 q 180 -30 360 0', 'none', { stroke: '#5fa8c9', 'stroke-width': 3, opacity: 0.7 });
      /* козлић и струњача */
      o += rect(268, 158, 74, 26, '#a8785a', 8) + rect(276, 184, 8, 30, '#8a6a4e') + rect(326, 184, 8, 30, '#8a6a4e');
      o += rect(250, 214, 120, 14, '#5b8ad8', 6);
      /* кош */
      o += rect(44, 40, 8, 90, '#8f97ad') + rect(20, 34, 56, 8, '#8f97ad', 3) + circle(48, 52, 12, 'none', { stroke: '#f07a4e', 'stroke-width': 3 });
      return o;
    },
    buffet: function (rnd) {
      var o = rect(0, 0, W, H, '#f7ecd8');
      o += rect(0, 0, W, 124, '#f0dfc0');
      o += rect(30, 22, 200, 84, '#c9563f', 5) + path('M44 44 h80 M44 62 h120 M44 80 h60', 'none',
        { stroke: '#ffe9a8', 'stroke-width': 4, opacity: 0.9 });
      o += rect(250, 30, 128, 74, '#f7f2e2', 4);
      o += circle(280, 56, 12, '#f0b45a') + circle(312, 56, 12, '#e2856f') + circle(344, 56, 12, '#c9a87e');
      o += rect(262, 76, 104, 18, '#e8c294', 3);
      o += rect(0, 124, W, 10, '#c9a87e');
      o += floorTiles(158, '#e0cfae', '#c6b28e');
      o += rect(20, 168, 360, 22, '#b9885e', 5) + rect(20, 190, 360, 10, '#a8785a', 3);
      return o;
    },
    office: function (rnd) {
      var o = rect(0, 0, W, H, '#f6efe4');
      o += rect(0, 0, W, 126, '#efe0d0');
      o += rect(232, 20, 130, 96, '#bcd8f2', 5) + rect(232, 20, 130, 96, 'none', 5, { stroke: '#ffffff', 'stroke-width': 5 }) +
        path('M297 20 v96 M232 68 h130', 'none', { stroke: '#ffffff', 'stroke-width': 4 });
      o += rect(24, 30, 88, 86, '#b9885e', 3);
      var i;
      for (i = 0; i < 3; i++) o += rect(30, 38 + i * 26, 76, 18, i % 2 ? '#7cc47a' : '#c96f7e', 2);
      o += rect(0, 126, W, 10, '#c9a87e');
      o += floorTiles(158, '#dccbb2', '#c0ad92');
      /* фикус */
      o += rect(150, 176, 24, 26, '#c96f7e', 4);
      o += ellipse(162, 160, 12, 20, '#5aa864') + ellipse(148, 150, 11, 15, '#66b56f') + ellipse(176, 152, 10, 14, '#4d9758');
      o += rect(210, 170, 90, 8, '#b9885e', 3) + rect(216, 178, 6, 22, '#8a6a4e') + rect(288, 178, 6, 22, '#8a6a4e');
      o += g('translate(255,162) scale(0.9)', drawCup());
      return o;
    },
    stairs: function (rnd) {
      var o = clouds(rnd, 2) + sun(320, 34, 16);
      o += rect(150, 20, 250, 170, '#f0dcc0', 4);
      var i;
      for (i = 0; i < 3; i++) o += rect(176 + i * 62, 44, 40, 34, '#bcd8f2', 3, { stroke: '#ffffff', 'stroke-width': 3 });
      o += rect(0, 186, W, 64, '#b9b4ab');
      for (i = 0; i < 4; i++) o += rect(0, 150 + i * 14, 190 - i * 10, 16, i % 2 ? '#d8cdbc' : '#cbbfaa', 2);
      o += treeGreen(360, 190, 0.6);
      return o;
    },
    duskStreet: function (rnd) {
      var o = clouds(rnd, 2) + sun(70, 60, 24);
      o += block(0, 70, 110, 120, '#c9a888', rnd) + block(122, 52, 92, 138, '#bb9a7c', rnd) +
        block(226, 80, 84, 110, '#caa98a', rnd) + block(318, 60, 92, 130, '#b5947a', rnd);
      o += treeGreen(56, 190, 0.7) + treeGreen(300, 192, 0.6);
      o += rect(0, 190, W, 20, '#b3a898');
      o += rect(0, 210, W, 40, '#6b6470');
      o += path('M0 232 h40 M70 232 h40 M140 232 h40 M210 232 h40 M280 232 h40 M350 232 h40', 'none',
        { stroke: '#ffe6bd', 'stroke-width': 3, opacity: 0.8 });
      var i;
      for (i = 0; i < 10; i++) o += circle(rnd() * W, 60 + rnd() * 120, 1.4 + rnd() * 1.6, '#fff3c4', { opacity: 0.5 });
      return o;
    }
  };

  /* ---------- passage -> scene map ---------- */
  function s(bg, cast, skyKind, note) {
    return { bg: bg, cast: cast || [], sky: skyKind || 'day', note: note || '' };
  }

  var SCENES = {
    /* јутро */
    kitchen: s('kitchen', ['kidSleepy', 'mom'], 'morning', 'јутро у кухињи пре школе'),
    pack: s('kitchen', ['kidBook'], 'morning', 'паковање ранца'),
    snack: s('kitchen', ['mom', 'kid'], 'morning', 'бурек умотан у фолију'),
    street: s('street', ['kid'], 'morning', 'београдска улица ујутру'),
    kiosk: s('kiosk', ['kid', 'kiosk'], 'morning', 'киоск и нове сличице'),
    bus: s('bus', ['kid'], 'day', 'гужва у аутобусу'),
    bus_win: s('street', ['kidReach'], 'morning', 'излазак тачно на станици'),
    bus_crit: s('street', ['kid', 'ana'], 'morning', 'нова другарица са виолином'),
    bus_fail: s('street', ['kidReach'], 'morning', 'трчање назад уз брдо'),
    bus_kind: s('bus', ['kid'], 'day', 'уступљено место у аутобусу'),
    park: s('park', ['kid', 'catUp'], 'morning', 'пречица кроз парк'),
    park_cat: s('park', ['kid', 'cat', 'pigeon'], 'morning', 'мачка те прати до школе'),

    /* школа */
    schoolyard: s('yard', ['kid'], 'day', 'школско двориште пуно ђака'),
    yard_ask: s('yard', ['kid', 'luka'], 'day', 'упознавање са Луком'),
    yard_lost: s('hallway', ['kid'], 'indoor', 'тражење учионице 12'),
    yard_breathe: s('yard', ['kid'], 'day', 'три удаха поред коша'),
    homeroom: s('classroom', ['vera', 'kid'], 'indoor', 'одељењска наставница Вера'),
    hall: s('hallway', ['kid', 'luka'], 'indoor', 'ходник између часова'),

    /* математика */
    math: s('classroom', ['teacherMath', 'kid'], 'indoor', 'задатак на табли'),
    math_win: s('classroom', ['kidChalk', 'teacherMath'], 'indoor', 'тачан одговор на табли'),
    math_crit: s('classroom', ['kidChalk', 'teacherMath', 'luka'], 'indoor', 'два начина решавања'),
    math_slip: s('classroom', ['kid', 'teacherMath'], 'indoor', 'сломљена креда'),
    math_save: s('classroom', ['kidChalk', 'luka'], 'indoor', 'шапат из треће клупе'),
    math_honest: s('classroom', ['kid', 'teacherMath'], 'indoor', 'друга шанса на табли'),
    math_bad: s('classroom', ['teacherMath', 'kid'], 'indoor', 'уписана лоша оцена'),
    math_called: s('classroom', ['teacherMath', 'kid'], 'indoor', 'прозван из клупе'),
    math_lucky: s('classroom', ['kid', 'teacherMath'], 'indoor', 'погођен тачан број'),

    /* српски */
    serbian: s('classroom', ['teacherSerbian', 'kid'], 'indoor', 'читање наглас'),
    serbian_win: s('classroom', ['kidBook', 'teacherSerbian'], 'indoor', 'прочитана строфа'),
    serbian_crit: s('classroom', ['kidBook', 'teacherSerbian', 'ana'], 'indoor', 'позив на приредбу'),
    serbian_fail: s('classroom', ['kid', 'teacherSerbian'], 'indoor', 'реч која се брани'),
    serbian_extra: s('classroom', ['teacherSerbian', 'kidBook'], 'indoor', 'вежба после часа'),

    /* енглески */
    english: s('langroom', ['teacherEnglish', 'kid'], 'indoor', 'кабинет за енглески'),
    english_win: s('langroom', ['kid', 'teacherEnglish'], 'indoor', 'кратка јасна реченица'),
    english_crit: s('langroom', ['kidReach', 'teacherEnglish', 'luka'], 'indoor', 'сјајна сличица као доказ'),
    english_fail: s('langroom', ['kid', 'teacherEnglish'], 'indoor', 'реченица која се заглави'),
    english_help: s('langroom', ['luka', 'kid', 'teacherEnglish'], 'indoor', 'Лука почиње са тобом'),
    english_bad: s('langroom', ['teacherEnglish', 'kid'], 'indoor', 'час без петице'),

    /* биологија */
    bio: s('biolab', ['teacherBio', 'kid'], 'indoor', 'кабинет са скелетом и микроскопима'),
    bio_win: s('biolab', ['kidBook'], 'indoor', 'ћелије под микроскопом'),
    bio_kind: s('biolab', ['kid', 'sofija', 'teacherBio'], 'indoor', 'помоћ другарици'),
    bio_fail: s('biolab', ['kid', 'teacherBio'], 'indoor', 'мутно светло у микроскопу'),
    bio_extra: s('biolab', ['teacherBio', 'kidBook'], 'indoor', 'пет минута после часа'),

    /* физичко */
    pe: s('gym', ['teacherPe', 'kidNoBag'], 'gym', 'фискултурна сала'),
    pe_borrow: s('gym', ['luka', 'kidNoBag'], 'gym', 'позајмљена мајица'),
    pe_chance: s('gym', ['kidNoBag', 'teacherPe'], 'gym', 'шанса без опреме'),
    pe_helper: s('gym', ['kidNoBag', 'teacherPe'], 'gym', 'помоћник са струњачама'),
    pe_vault: s('gym', ['kidNoBag', 'teacherPe'], 'gym', 'козлић и одскочна даска'),
    pe_win: s('gym', ['kidReach', 'teacherPe'], 'gym', 'прескочен козлић'),
    pe_crit: s('gym', ['kidReach', 'teacherPe', 'luka'], 'gym', 'сала аплаудира'),
    pe_ok: s('gym', ['kidNoBag'], 'gym', 'уредан прескок у два дела'),
    pe_stuck: s('gym', ['kidNoBag', 'teacherPe'], 'gym', 'заглављен на козлићу'),
    pe_bench: s('gym', ['kidNoBag'], 'gym', 'клупа поред радијатора'),

    /* велики одмор */
    breaktime: s('yard', ['kid', 'cat', 'pigeon'], 'day', 'велики одмор у дворишту'),
    break_ball: s('yard', ['kidReach', 'luka'], 'day', 'фудбал на бетону'),
    break_food: s('stairs', ['kid'], 'day', 'бурек на степеницама'),
    break_share: s('stairs', ['kid', 'sofija'], 'day', 'подељен бурек'),
    break_buffet: s('buffet', ['kid'], 'indoor', 'ред за буфет'),
    break_cat: s('yard', ['kid', 'catUp', 'pigeon'], 'day', 'мачка која зна распоред'),
    break_study: s('hallway', ['kidBook'], 'indoor', 'понављање на прозорској дасци'),

    /* пауза и крај */
    faint: s('office', ['milica', 'kid'], 'indoor', 'чаша воде код педагога'),
    end_day: s('hallway', ['kid', 'vera'], 'indoor', 'последње звоно'),
    end_cat: s('yard', ['kid', 'cat'], 'dusk', 'испраћај на школској капији'),
    end_star: s('duskStreet', ['kid'], 'dusk', 'пут кући после савршеног дана'),
    end_friends: s('yard', ['luka', 'kid', 'ana'], 'dusk', 'екипа испред школе'),
    end_clean: s('duskStreet', ['kid'], 'dusk', 'чист картон првог дана'),
    end_ok: s('kitchen', ['mom', 'kid'], 'warm', 'свеска на кухињском столу'),
    end_rough: s('kitchen', ['kidSleepy', 'mom'], 'warm', 'чај после тешког дана')
  };

  /* ---------- layout ---------- */
  var SLOTS = {
    1: [[200, 1]],
    2: [[132, 1], [278, 0.92]],
    3: [[92, 0.92], [200, 1], [312, 0.86]]
  };

  function castLayer(cast, rnd, cast_book) {
    var n = Math.min(cast.length, 3);
    if (!n) return '';
    var slots = SLOTS[n];
    var out = '';
    for (var i = 0; i < n; i++) {
      var name = cast[i];
      var c = cast_book[name];
      if (!c) continue;
      var x = slots[i][0];
      var scale = slots[i][1];
      var y = GROUND + 14 + (i === 1 && n === 3 ? 10 : 0);
      if (c.small) { y -= 2; x += 26; }
      var sc = scale * (c.size || 1);
      out += el('ellipse', {
        cx: r2(x), cy: r2(y - 26 * sc), rx: r2(40 * sc), ry: r2(46 * sc),
        fill: '#fff6d8', opacity: 0.14
      });
      out += el('ellipse', {
        cx: r2(x), cy: r2(y + 2), rx: r2(26 * sc), ry: r2(6 * sc),
        fill: '#000000', opacity: 0.16
      });
      out += g('translate(' + r2(x) + ',' + r2(y - c.foot * sc) + ') scale(' + r2(sc) + ')', c.draw());
    }
    return out;
  }

  /* ---------- пакети слика по причама ----------
   * Свака прича има свој пакет: додатне ликове, додатне позадине и мапу
   * одломак -> сцена. Основни ликови и позадине су заједнички за све приче.
   */
  var PACKS = {};

  function register(id, pack) {
    PACKS[id] = {
      characters: merge(CHARACTERS, pack.characters),
      backgrounds: merge(BACKGROUNDS, pack.backgrounds),
      scenes: pack.scenes || {},
      fallback: pack.fallback || s('hallway', ['kid'], 'indoor', 'школски ходник')
    };
    return PACKS[id];
  }

  function merge(base, extra) {
    var out = {}, k;
    for (k in base) if (Object.prototype.hasOwnProperty.call(base, k)) out[k] = base[k];
    for (k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) out[k] = extra[k];
    return out;
  }

  register('peti', { characters: {}, backgrounds: {}, scenes: SCENES });

  function packFor(packId) {
    return PACKS[packId] || PACKS.peti;
  }

  function sceneFor(id, packId) {
    var pack = packFor(packId);
    return pack.scenes[id] || pack.fallback;
  }

  var uidCount = 0;

  function svg(id, packId) {
    var pack = packFor(packId);
    var scene = sceneFor(id, packId);
    var rnd = rngFrom(seedOf(id));
    var uid = '-' + (++uidCount);
    var bg = (pack.backgrounds[scene.bg] || pack.backgrounds.hallway)(rnd);
    var defs = el('defs', null,
      sky(scene.sky, uid) +
      el('radialGradient', { id: 'vig' + uid, cx: '0.5', cy: '0.5', r: '0.75' },
        el('stop', { offset: '0.55', 'stop-color': '#3a2a1e', 'stop-opacity': '0' }) +
        el('stop', { offset: '1', 'stop-color': '#3a2a1e', 'stop-opacity': '0.28' })));
    var inner = defs +
      rect(0, 0, W, H, 'url(#sky' + uid + ')') +
      bg +
      castLayer(scene.cast, rnd, pack.characters) +
      rect(0, 0, W, H, 'url(#vig' + uid + ')');
    return el('svg', {
      viewBox: '0 0 ' + W + ' ' + H,
      xmlns: 'http://www.w3.org/2000/svg',
      preserveAspectRatio: 'xMidYMid slice',
      role: 'img',
      'aria-label': altFor(id, packId)
    }, inner);
  }

  function altFor(id, packId) {
    var pack = packFor(packId);
    var scene = sceneFor(id, packId);
    var who = [];
    for (var i = 0; i < scene.cast.length; i++) {
      var c = pack.characters[scene.cast[i]];
      if (c && who.indexOf(c.name) === -1) who.push(c.name);
    }
    var base = 'Слика: ' + (scene.note || 'сцена из приче');
    return who.length ? base + ' (' + who.join(', ') + ')' : base;
  }

  /* Алат за цртање, да и друге приче могу да користе исти стил. */
  var lib = {
    W: W, H: H, GROUND: GROUND,
    el: el, g: g, circle: circle, ellipse: ellipse, rect: rect, path: path, r2: r2,
    eye: eye, sleepyEye: sleepyEye, blush: blush, smile: smile,
    person: person, ch: ch, drawCup: drawCup, drawCat: drawCat, drawPigeon: drawPigeon,
    drawBackpack: drawBackpack,
    sun: sun, cloud: cloud, clouds: clouds, block: block, treeGreen: treeGreen,
    floorTiles: floorTiles, desk: desk, board: board, windowWall: windowWall,
    scene: s, backgrounds: BACKGROUNDS, characters: CHARACTERS
  };

  return {
    svg: svg, altFor: altFor, register: register, packs: PACKS,
    scenes: SCENES, characters: CHARACTERS, lib: lib
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = ART;
