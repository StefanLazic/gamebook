/* Whiskerlight — gamebook engine
 * Renders passages from STORY (js/story.js), handles choices, stats,
 * items, 2d6 dice checks and local save/restore.
 */
(function () {
  'use strict';

  var SAVE_KEY = 'whiskerlight.save.sr-cyr.v3';
  var STAT_LABELS = { courage: 'Храброст', cunning: 'Лукавост', kindness: 'Доброта', health: 'Здравље' };

  var el = {
    titleScreen: document.getElementById('title-screen'),
    gameScreen: document.getElementById('game-screen'),
    startBtn: document.getElementById('start-btn'),
    continueBtn: document.getElementById('continue-btn'),
    passage: document.getElementById('passage'),
    scene: document.getElementById('scene'),
    sceneArt: document.getElementById('scene-art'),
    skipBtn: document.getElementById('skip-btn'),
    choices: document.getElementById('choices'),
    rollArea: document.getElementById('roll-area'),
    pack: document.getElementById('pack'),
    menu: document.getElementById('menu'),
    menuBtn: document.getElementById('menu-btn'),
    menuResume: document.getElementById('menu-resume'),
    menuRestart: document.getElementById('menu-restart'),
    menuHowto: document.getElementById('menu-howto'),
    howto: document.getElementById('howto'),
    howtoBtn: document.getElementById('howto-btn'),
    howtoClose: document.getElementById('howto-close'),
    app: document.getElementById('app')
  };

  var state = null;
  var busy = false;

  function newState() {
    return {
      at: STORY.start,
      stats: { courage: 3, cunning: 3, kindness: 3, health: 5 },
      items: [],
      flags: {},
      visited: {}
    };
  }

  /* ---------- persistence ---------- */
  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }
  function loadSaved() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || !s.at || !STORY.passages[s.at]) return null;
      return s;
    } catch (e) { return null; }
  }
  function clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
  }

  /* ---------- helpers ---------- */
  function has(item) { return state.items.indexOf(item) !== -1; }

  function d6() { return 1 + Math.floor(Math.random() * 6); }

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function applyEffects(fx) {
    if (!fx) return;
    var i;
    if (fx.stats) {
      for (var k in fx.stats) {
        if (!Object.prototype.hasOwnProperty.call(fx.stats, k)) continue;
        state.stats[k] = clamp((state.stats[k] || 0) + fx.stats[k], 0, 10);
        bumpStat(k);
      }
    }
    if (fx.items) {
      for (i = 0; i < fx.items.length; i++) {
        if (!has(fx.items[i])) state.items.push(fx.items[i]);
      }
    }
    if (fx.lose) {
      for (i = 0; i < fx.lose.length; i++) {
        var idx = state.items.indexOf(fx.lose[i]);
        if (idx !== -1) state.items.splice(idx, 1);
      }
    }
    if (fx.flags) {
      for (var f in fx.flags) {
        if (Object.prototype.hasOwnProperty.call(fx.flags, f)) state.flags[f] = fx.flags[f];
      }
    }
  }

  function meetsRequirement(choice) {
    if (choice.needItem && !has(choice.needItem)) return false;
    if (choice.needFlag && !state.flags[choice.needFlag]) return false;
    if (choice.needStat) {
      for (var k in choice.needStat) {
        if (Object.prototype.hasOwnProperty.call(choice.needStat, k) &&
            (state.stats[k] || 0) < choice.needStat[k]) return false;
      }
    }
    if (choice.notFlag && state.flags[choice.notFlag]) return false;
    return true;
  }

  /* ---------- rendering ---------- */
  function bumpStat(key) {
    var node = document.getElementById('stat-' + key);
    if (!node) return;
    var chip = node.parentElement;
    chip.classList.remove('bump');
    void chip.offsetWidth;
    chip.classList.add('bump');
  }

  function renderHud() {
    for (var k in STAT_LABELS) {
      if (!Object.prototype.hasOwnProperty.call(STAT_LABELS, k)) continue;
      var node = document.getElementById('stat-' + k);
      if (node) node.textContent = state.stats[k];
    }
  }

  function renderPack() {
    el.pack.textContent = '';
    for (var i = 0; i < state.items.length; i++) {
      var span = document.createElement('span');
      span.className = 'item';
      span.textContent = state.items[i];
      el.pack.appendChild(span);
    }
  }

  // Every word gets its own <span> so the story can be read into view word by
  // word; `into` collects them in reading order for the reveal timer.
  function words(target, text, into) {
    var chunks = String(text).split(/(\s+)/);
    for (var i = 0; i < chunks.length; i++) {
      if (!chunks[i]) continue;
      if (/^\s+$/.test(chunks[i])) {
        target.appendChild(document.createTextNode(chunks[i]));
        continue;
      }
      var w = document.createElement('span');
      w.className = 'w';
      w.textContent = chunks[i];
      target.appendChild(w);
      if (into) into.push(w);
    }
  }

  function paragraph(text, cls, into) {
    var p = document.createElement('p');
    if (cls) p.className = cls;
    // Very small inline markup: *emphasis*
    var parts = String(text).split(/\*/);
    for (var i = 0; i < parts.length; i++) {
      if (!parts[i]) continue;
      if (i % 2 === 1) {
        var em = document.createElement('em');
        words(em, parts[i], into);
        p.appendChild(em);
      } else {
        words(p, parts[i], into);
      }
    }
    return p;
  }

  /* ---------- picture first, then the text, word by word ---------- */
  var reveal = { timer: 0, startDelay: 0, queue: [], done: true };

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function finishReveal() {
    if (reveal.timer) { clearInterval(reveal.timer); reveal.timer = 0; }
    if (reveal.startDelay) { clearTimeout(reveal.startDelay); reveal.startDelay = 0; }
    for (var i = 0; i < reveal.queue.length; i++) reveal.queue[i].classList.add('on');
    reveal.queue = [];
    reveal.done = true;
    el.skipBtn.classList.add('hidden');
    el.choices.classList.remove('waiting');
  }

  function startReveal(queue) {
    reveal.queue = queue;
    if (!queue.length || reducedMotion()) { finishReveal(); return; }
    reveal.done = false;
    el.choices.classList.add('waiting');
    el.skipBtn.classList.remove('hidden');
    var i = 0;
    var step = function () {
      if (i >= queue.length) { finishReveal(); return; }
      queue[i].classList.add('on');
      i++;
    };
    // the picture gets a beat of its own before the words start arriving
    reveal.startDelay = setTimeout(function () {
      reveal.startDelay = 0;
      step();
      reveal.timer = setInterval(step, 65);
    }, 550);
  }

  function renderScene(id) {
    if (typeof ART === 'undefined') return;
    el.sceneArt.innerHTML = ART.svg(id);
    el.scene.classList.remove('appear');
    void el.scene.offsetWidth;
    el.scene.classList.add('appear');
  }

  function textOf(value) {
    return typeof value === 'function' ? value(state) : value;
  }

  function goto(id, extraNote) {
    if (state.stats.health <= 0 && id !== 'faint' && STORY.passages.faint) id = 'faint';

    var p = STORY.passages[id];
    if (!p) { console.error('Missing passage: ' + id); return; }

    state.at = id;
    applyEffects(p.effects);
    var firstVisit = !state.visited[id];
    state.visited[id] = true;
    if (firstVisit) applyEffects(p.firstVisitEffects);

    renderHud();
    renderPack();
    save();

    finishReveal();
    el.rollArea.classList.add('hidden');
    el.rollArea.textContent = '';
    el.passage.textContent = '';
    el.choices.textContent = '';
    el.app.classList.toggle('ending', !!p.ending);

    renderScene(id);

    var queue = [];
    var h = document.createElement('h2');
    words(h, textOf(p.title), queue);
    el.passage.appendChild(h);

    var body = textOf(p.text) || [];
    for (var i = 0; i < body.length; i++) {
      el.passage.appendChild(paragraph(textOf(body[i]), null, queue));
    }
    if (extraNote) el.passage.appendChild(paragraph(extraNote, 'note', queue));

    renderChoices(p);
    startReveal(queue);

    el.passage.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderChoices(p) {
    var list = textOf(p.choices) || [];
    var shown = 0;

    for (var i = 0; i < list.length; i++) {
      (function (choice) {
        if (choice.onlyFlag && !state.flags[choice.onlyFlag]) return;
        var ok = meetsRequirement(choice);
        // Locked choices are hidden by default; a passage can opt in to showing
        // them greyed out (as a tease) with hideWhenLocked: false.
        if (!ok && choice.hideWhenLocked !== false) return;

        var btn = document.createElement('button');
        btn.className = 'choice' + (ok ? '' : ' locked');
        btn.type = 'button';
        btn.appendChild(document.createTextNode(textOf(choice.text)));

        if (choice.roll) {
          var tag = document.createElement('span');
          tag.className = 'tag';
          tag.textContent = STAT_LABELS[choice.roll.stat] + ' ' + choice.roll.dc + '+';
          btn.appendChild(tag);
        } else if (choice.tag) {
          var t2 = document.createElement('span');
          t2.className = 'tag';
          t2.textContent = choice.tag;
          btn.appendChild(t2);
        }

        if (!ok) {
          btn.disabled = true;
          if (choice.needItem) {
            var need = document.createElement('span');
            need.className = 'tag';
            need.textContent = 'треба: ' + choice.needItem;
            btn.appendChild(need);
          }
        } else {
          btn.addEventListener('click', function () { pick(choice); });
        }
        el.choices.appendChild(btn);
        shown++;
      })(list[i]);
    }

    if (!shown && p.ending) {
      var again = document.createElement('button');
      again.className = 'choice';
      again.type = 'button';
      again.textContent = 'Почни нову ноћ ↺';
      again.addEventListener('click', restart);
      el.choices.appendChild(again);
    }
  }

  function pick(choice) {
    if (busy) return;
    applyEffects(choice.effects);
    renderHud();
    renderPack();

    if (choice.roll) {
      doRoll(choice.roll);
    } else {
      goto(choice.to, choice.note);
    }
  }

  /* ---------- dice ---------- */
  function doRoll(roll) {
    busy = true;
    var bonus = state.stats[roll.stat] || 0;
    if (roll.itemBonus && has(roll.itemBonus.item)) bonus += roll.itemBonus.amount;

    el.choices.textContent = '';
    el.rollArea.classList.remove('hidden');
    el.rollArea.textContent = '';

    var wrap = document.createElement('div');
    var dieA = document.createElement('span');
    var dieB = document.createElement('span');
    dieA.className = dieB.className = 'die rolling';
    dieA.textContent = dieB.textContent = '?';
    wrap.appendChild(dieA);
    wrap.appendChild(dieB);
    el.rollArea.appendChild(wrap);

    var caption = document.createElement('p');
    caption.className = 'roll-math';
    caption.textContent = 'Бацам 2к6 + ' + STAT_LABELS[roll.stat] + ' (' + bonus + ') против ' + roll.dc;
    el.rollArea.appendChild(caption);
    el.rollArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    var a = d6(), b = d6();
    var ticks = 0;
    var spin = setInterval(function () {
      dieA.textContent = d6();
      dieB.textContent = d6();
      if (++ticks > 8) {
        clearInterval(spin);
        dieA.classList.remove('rolling');
        dieB.classList.remove('rolling');
        dieA.textContent = a;
        dieB.textContent = b;
        finishRoll(roll, a, b, bonus, caption);
      }
    }, 90);
  }

  function finishRoll(roll, a, b, bonus, caption) {
    var total = a + b + bonus;
    var crit = (a === 6 && b === 6);
    var fumble = (a === 1 && b === 1);
    var win = crit || (!fumble && total >= roll.dc);

    caption.textContent = a + ' + ' + b + ' + ' + bonus + ' = ' + total + ' против ' + roll.dc;

    var line = document.createElement('p');
    line.className = 'roll-line ' + (win ? 'success' : 'fail');
    line.textContent = crit ? 'Две шестице \u2014 савршено бацање!'
      : fumble ? 'Две јединице. Ма немој\u2026'
      : win ? 'Успех!' : 'Не иде ти наруку\u2026';
    el.rollArea.appendChild(line);

    var target = win ? roll.success : roll.fail;
    if (crit && roll.crit) target = roll.crit;
    applyEffects(win ? roll.successEffects : roll.failEffects);
    renderHud();
    renderPack();
    save();

    var cont = document.createElement('button');
    cont.className = 'btn btn-primary';
    cont.type = 'button';
    cont.style.marginTop = '.75rem';
    cont.textContent = 'Даље';
    cont.addEventListener('click', function () {
      busy = false;
      goto(target);
    });
    el.rollArea.appendChild(cont);
    cont.focus();
  }

  /* ---------- screens ---------- */
  function startGame(existing) {
    state = existing || newState();
    busy = false;
    el.titleScreen.classList.add('hidden');
    el.gameScreen.classList.remove('hidden');
    goto(state.at);
  }

  function restart() {
    clearSave();
    startGame(null);
    closeMenu();
  }

  function openMenu() { el.menu.classList.remove('hidden'); }
  function closeMenu() { el.menu.classList.add('hidden'); }
  function openHowto() { el.howto.classList.remove('hidden'); el.howtoClose.focus(); }
  function closeHowto() { el.howto.classList.add('hidden'); }

  el.skipBtn.addEventListener('click', finishReveal);
  el.passage.addEventListener('click', function () { if (!reveal.done) finishReveal(); });
  el.scene.addEventListener('click', function () { if (!reveal.done) finishReveal(); });

  el.startBtn.addEventListener('click', function () { clearSave(); startGame(null); });
  el.menuBtn.addEventListener('click', openMenu);
  el.menuResume.addEventListener('click', closeMenu);
  el.menuRestart.addEventListener('click', restart);
  el.menu.addEventListener('click', function (e) { if (e.target === el.menu) closeMenu(); });
  el.howtoBtn.addEventListener('click', openHowto);
  el.menuHowto.addEventListener('click', function () { closeMenu(); openHowto(); });
  el.howtoClose.addEventListener('click', closeHowto);
  el.howto.addEventListener('click', function (e) { if (e.target === el.howto) closeHowto(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeHowto(); closeMenu(); return; }
    if (el.gameScreen.classList.contains('hidden') ||
        !el.menu.classList.contains('hidden') ||
        !el.howto.classList.contains('hidden')) return;
    if (!reveal.done && (e.key === ' ' || e.key === 'Enter' || /^[1-9]$/.test(e.key))) {
      finishReveal(); e.preventDefault(); return;
    }
    if (/^[1-9]$/.test(e.key)) {
      var buttons = el.choices.querySelectorAll('.choice:not([disabled])');
      var target = buttons[parseInt(e.key, 10) - 1];
      if (target) target.click();
    }
  });

  var saved = loadSaved();
  if (saved) {
    el.continueBtn.classList.remove('hidden');
    el.continueBtn.addEventListener('click', function () { startGame(saved); });
  }
})();
