/* Књига-игра — мотор
 *
 * Учитава причу из регистра STORIES (js/stories.js), исписује одломке,
 * води особине, ствари у ранцу, бацање 2к6 и чување напретка на уређају.
 * Свака прича има своје особине (statDefs), свој чувар правила (guard)
 * и свој сет слика (js/art.js + пакети регистровани преко ART.register).
 */
(function () {
  'use strict';

  var SAVE_PREFIX = 'gamebook.sr-cyr.v2.';

  var el = {
    titleScreen: document.getElementById('title-screen'),
    gameScreen: document.getElementById('game-screen'),
    storyList: document.getElementById('story-list'),
    statBar: document.getElementById('stat-bar'),
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
    menuStories: document.getElementById('menu-stories'),
    menuHowto: document.getElementById('menu-howto'),
    howto: document.getElementById('howto'),
    howtoBtn: document.getElementById('howto-btn'),
    howtoClose: document.getElementById('howto-close'),
    app: document.getElementById('app')
  };

  var story = null;
  var state = null;
  var busy = false;
  var statNodes = {};

  /* ---------- прича ---------- */
  function statDefs() { return (story && story.statDefs) || []; }

  function statDef(key) {
    var defs = statDefs();
    for (var i = 0; i < defs.length; i++) if (defs[i].key === key) return defs[i];
    return null;
  }

  function statLabel(key) {
    var d = statDef(key);
    return d ? d.label : key;
  }

  function newState() {
    var stats = {};
    var defs = statDefs();
    for (var i = 0; i < defs.length; i++) stats[defs[i].key] = defs[i].start || 0;
    return { at: story.start, stats: stats, items: [], flags: {}, visited: {} };
  }

  /* ---------- чување напретка ---------- */
  function saveKeyFor(st) { return SAVE_PREFIX + st.id; }

  function save() {
    try { localStorage.setItem(saveKeyFor(story), JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  function readSave(st, key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || !s.at || !st.passages[s.at]) return null;
      if (!s.stats) s.stats = {};
      if (!s.items) s.items = [];
      if (!s.flags) s.flags = {};
      if (!s.visited) s.visited = {};
      return s;
    } catch (e) { return null; }
  }

  function loadSaved(st) {
    return readSave(st, saveKeyFor(st)) ||
      (st.legacySaveKey ? readSave(st, st.legacySaveKey) : null);
  }

  function clearSave(st) {
    try {
      localStorage.removeItem(saveKeyFor(st));
      if (st.legacySaveKey) localStorage.removeItem(st.legacySaveKey);
    } catch (e) { /* ignore */ }
  }

  /* ---------- помоћне ---------- */
  function has(item) { return state.items.indexOf(item) !== -1; }

  function d6() { return 1 + Math.floor(Math.random() * 6); }

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function applyEffects(fx) {
    if (!fx) return;
    var i;
    if (fx.stats) {
      for (var k in fx.stats) {
        if (!Object.prototype.hasOwnProperty.call(fx.stats, k)) continue;
        var def = statDef(k) || {};
        var lo = typeof def.min === 'number' ? def.min : 0;
        var hi = typeof def.max === 'number' ? def.max : 10;
        state.stats[k] = clamp((state.stats[k] || 0) + fx.stats[k], lo, hi);
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

  /* ---------- исписивање ---------- */
  function bumpStat(key) {
    var chip = statNodes[key] && statNodes[key].chip;
    if (!chip) return;
    chip.classList.remove('bump');
    void chip.offsetWidth;
    chip.classList.add('bump');
  }

  function buildHud() {
    statNodes = {};
    el.statBar.textContent = '';
    var defs = statDefs();
    for (var i = 0; i < defs.length; i++) {
      var def = defs[i];
      var chip = document.createElement('div');
      chip.className = 'stat';
      chip.title = def.label;
      var icon = document.createElement('span');
      icon.className = 'stat-icon';
      icon.textContent = def.icon;
      var value = document.createElement('span');
      value.textContent = '0';
      var name = document.createElement('span');
      name.className = 'stat-name';
      name.textContent = def.label;
      chip.appendChild(icon);
      chip.appendChild(value);
      chip.appendChild(name);
      el.statBar.appendChild(chip);
      statNodes[def.key] = { chip: chip, value: value };
    }
  }

  function renderHud() {
    var defs = statDefs();
    for (var i = 0; i < defs.length; i++) {
      var node = statNodes[defs[i].key];
      if (!node) continue;
      var raw = state.stats[defs[i].key] || 0;
      node.value.textContent = defs[i].format ? defs[i].format(raw) : raw;
    }
  }

  function renderPack() {
    el.pack.textContent = '';
    for (var i = 0; i < state.items.length; i++) {
      var span = document.createElement('span');
      var text = state.items[i];
      // добре и лоше оцене се разликују и бојом, не само знаком
      span.className = 'item' + (text.indexOf('⭐') === 0 ? ' grade-good'
        : text.indexOf('💢') === 0 ? ' grade-bad' : '');
      span.textContent = text;
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

  /* ---------- прво слика, па текст реч по реч ---------- */
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
    el.sceneArt.innerHTML = ART.svg(id, story.art || story.id);
    el.scene.classList.remove('appear');
    void el.scene.offsetWidth;
    el.scene.classList.add('appear');
  }

  function textOf(value) {
    return typeof value === 'function' ? value(state) : value;
  }

  function goto(id, extraNote) {
    if (story.guard) {
      var redirect = story.guard(state, id);
      if (redirect && redirect !== id && story.passages[redirect]) id = redirect;
    }

    var p = story.passages[id];
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
          tag.textContent = statLabel(choice.roll.stat) + ' ' + choice.roll.dc + '+';
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
      again.textContent = story.replayText || 'Почни причу изнова ↺';
      again.addEventListener('click', restart);
      el.choices.appendChild(again);

      var back = document.createElement('button');
      back.className = 'choice';
      back.type = 'button';
      back.textContent = 'Изабери другу причу 📚';
      back.addEventListener('click', showTitle);
      el.choices.appendChild(back);
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

  /* ---------- коцке ---------- */
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
    caption.textContent = 'Бацам 2к6 + ' + statLabel(roll.stat) + ' (' + bonus + ') против ' + roll.dc;
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

  /* ---------- насловни екран са избором приче ---------- */
  function storyCard(st) {
    var card = document.createElement('article');
    card.className = 'story-card';

    var cover = document.createElement('div');
    cover.className = 'story-cover';
    if (typeof ART !== 'undefined') cover.innerHTML = ART.svg(st.cover || st.start, st.art || st.id);
    card.appendChild(cover);

    var body = document.createElement('div');
    body.className = 'story-body';

    var h = document.createElement('h2');
    h.className = 'story-title';
    h.textContent = st.emoji ? st.emoji + ' ' + st.title : st.title;
    body.appendChild(h);

    var blurb = document.createElement('p');
    blurb.className = 'story-blurb';
    blurb.textContent = st.blurb;
    body.appendChild(blurb);

    if (st.tags && st.tags.length) {
      var tags = document.createElement('p');
      tags.className = 'story-tags';
      for (var i = 0; i < st.tags.length; i++) {
        var t = document.createElement('span');
        t.className = 'tag';
        t.textContent = st.tags[i];
        tags.appendChild(t);
      }
      body.appendChild(tags);
    }

    var play = document.createElement('button');
    play.className = 'btn btn-primary';
    play.type = 'button';
    play.textContent = st.playText || 'Играј';
    play.addEventListener('click', function () { clearSave(st); startGame(st, null); });
    body.appendChild(play);

    var saved = loadSaved(st);
    if (saved) {
      var cont = document.createElement('button');
      cont.className = 'btn btn-ghost';
      cont.type = 'button';
      cont.textContent = st.continueText || 'Настави где си стао';
      cont.addEventListener('click', function () { startGame(st, saved); });
      body.appendChild(cont);
    }

    card.appendChild(body);
    return card;
  }

  function renderStoryList() {
    el.storyList.textContent = '';
    for (var i = 0; i < STORIES.list.length; i++) {
      el.storyList.appendChild(storyCard(STORIES.list[i]));
    }
  }

  function syncHowto() {
    var sections = el.howto.querySelectorAll('[data-story]');
    for (var i = 0; i < sections.length; i++) {
      var forStory = sections[i].getAttribute('data-story');
      var show = !story || forStory === story.id;
      sections[i].classList.toggle('hidden', !show);
    }
  }

  function startGame(st, existing) {
    story = st;
    document.title = st.title + ' — књига-игра';
    buildHud();
    state = existing || newState();
    busy = false;
    syncHowto();
    el.titleScreen.classList.add('hidden');
    el.gameScreen.classList.remove('hidden');
    goto(state.at);
  }

  function showTitle() {
    finishReveal();
    busy = false;
    story = null;
    document.title = 'Књига-игра — две приче о првом школском дану';
    syncHowto();
    closeMenu();
    el.gameScreen.classList.add('hidden');
    el.titleScreen.classList.remove('hidden');
    el.app.classList.remove('ending');
    renderStoryList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function restart() {
    if (!story) { showTitle(); return; }
    clearSave(story);
    startGame(story, null);
    closeMenu();
  }

  function openMenu() { el.menu.classList.remove('hidden'); }
  function closeMenu() { el.menu.classList.add('hidden'); }
  function openHowto() { el.howto.classList.remove('hidden'); el.howtoClose.focus(); }
  function closeHowto() { el.howto.classList.add('hidden'); }

  el.skipBtn.addEventListener('click', finishReveal);
  el.passage.addEventListener('click', function () { if (!reveal.done) finishReveal(); });
  el.scene.addEventListener('click', function () { if (!reveal.done) finishReveal(); });

  el.menuBtn.addEventListener('click', openMenu);
  el.menuResume.addEventListener('click', closeMenu);
  el.menuRestart.addEventListener('click', restart);
  el.menuStories.addEventListener('click', showTitle);
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

  renderStoryList();
  syncHowto();
})();
