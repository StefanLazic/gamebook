/* Први дан првог разреда — слике
 *
 * Пакет слика за причу „prvi“. Користи исти алат и исти стил као js/art.js
 * (ART.lib), само са својом поделом улога: Мила, мама, тата, учитељица
 * Јована, Вук, Тара, бака Даница, домар Мија и саобраћајац Раде.
 *
 * Правила су иста као у основном пакету: ништа страшно и сваки лик изгледа
 * исто у свакој сцени.
 */
(function () {
  'use strict';

  if (typeof ART === 'undefined' || !ART.lib) return;

  var L = ART.lib;
  var g = L.g, rect = L.rect, circle = L.circle, ellipse = L.ellipse, path = L.path;
  var W = L.W, H = L.H;

  /* ---------- палете (сваки лик увек исти) ---------- */
  var P_MILA = { skin: '#f9dcc0', hair: '#4a3324', hair2: '#6b4a34', hairStyle: 'pony', eye: '#7fd0ff', top: '#f2a0c0', skirt: '#e2565f', bottom: '#c9506a', shoes: '#ffffff', bag: '#e2565f' };
  var P_MAMA = { skin: '#f7d3ae', hair: '#5b3a2a', hairStyle: 'bun', eye: '#8a6a3a', top: '#7ce7c8', bottom: '#3f4a6b', shoes: '#c98d63' };
  var P_TATA = { skin: '#f0cba6', hair: '#35302b', hairStyle: 'short', eye: '#7a86a8', top: '#5b8ad8', bottom: '#3a3f52', shoes: '#3a3550' };
  var P_JOVANA = { skin: '#f7d3ae', hair: '#8c6b57', hairStyle: 'bob', eye: '#8ef0a5', top: '#5b8ad8', skirt: '#3f5bd8', bottom: '#4a4a6e', shoes: '#f2f2f2' };
  var P_VUK = { skin: '#eec49b', hair: '#2f2a25', hairStyle: 'curly', eye: '#8a6a3a', top: '#7cc47a', bottom: '#4a4a5e', shoes: '#f2f2f2', bag: '#3f8ad8' };
  var P_TARA = { skin: '#f0cba6', hair: '#f0c86a', hairStyle: 'pony', eye: '#8ef0a5', top: '#b9a3e3', skirt: '#7a5b9c', bottom: '#8a6ea8', shoes: '#ff9db1', bag: '#f0b45a', freckles: true };
  var P_BAKA = { skin: '#f0cba6', hair: '#d8d3e0', hairStyle: 'bun', eye: '#7a86a8', top: '#c98fbb', bottom: '#4a3f60', shoes: '#8a6a4e', glasses: '#5b4b8a' };
  var P_MIJA = { skin: '#e0b184', hair: '#6b6257', hairStyle: 'short', eye: '#8a6a3a', top: '#5a7a5a', bottom: '#4a4a5e', shoes: '#3a3550' };
  var P_RADE = { skin: '#f0cba6', hair: '#35302b', hairStyle: 'short', eye: '#7a86a8', top: '#f0e05a', bottom: '#3a3f52', shoes: '#2f2b40', whistle: true };

  function kid(p, opts, name) { return L.ch(p, opts, name, 39, 0.88); }
  function grown(p, opts, name) { return L.ch(p, opts, name, 40, 1.16); }

  var characters = {
    mila: kid(P_MILA, {}, 'Мила, ђак првак'),
    milaSleepy: kid(P_MILA, { sleepy: true }, 'поспана Мила'),
    milaHand: kid(P_MILA, { raise: true, mouth: 'open' }, 'Мила диже руку'),
    milaBook: kid(P_MILA, { book: true }, 'Мила са свеском'),
    milaReach: kid(P_MILA, { reach: true, mouth: 'open' }, 'Мила у покрету'),
    milaNoBag: kid(P_MILA, { noBag: true }, 'Мила без ранца'),
    milaChalk: kid(P_MILA, { raise: true, chalk: true }, 'Мила са кредом'),
    mama: grown(P_MAMA, {}, 'мама'),
    mamaReach: grown(P_MAMA, { reach: true }, 'мама која маше'),
    tata: grown(P_TATA, { cup: true }, 'тата'),
    jovana: grown(P_JOVANA, { book: true }, 'учитељица Јована'),
    jovanaChalk: grown(P_JOVANA, { raise: true, chalk: true }, 'учитељица Јована код табле'),
    vuk: kid(P_VUK, {}, 'Вук из одељења'),
    vukHand: kid(P_VUK, { raise: true, mouth: 'open' }, 'Вук диже руку'),
    tara: kid(P_TARA, {}, 'Тара из клупе'),
    taraBook: kid(P_TARA, { book: true }, 'Тара са свеском'),
    baka: grown(P_BAKA, { reach: true }, 'бака Даница'),
    mija: grown(P_MIJA, {}, 'домар Мија'),
    rade: grown(P_RADE, { raise: true }, 'саобраћајац Раде')
  };

  /* ---------- нове позадине ---------- */
  var backgrounds = {
    /* дечја соба: кревет, постер, ранац на столици */
    soba: function (rnd) {
      var o = rect(0, 0, W, H, '#f7e6f0');
      o += rect(0, 0, W, 148, '#fbe9f2');
      var i;
      for (i = 0; i < 7; i++) {
        o += path('M' + (18 + i * 58) + ' 0 v148', 'none', { stroke: '#f2d2e4', 'stroke-width': 8, opacity: 0.7 });
      }
      /* прозор са јутарњим небом */
      o += rect(250, 22, 126, 96, '#bcd8f2', 6) +
        rect(250, 22, 126, 96, 'none', 6, { stroke: '#ffffff', 'stroke-width': 5 }) +
        path('M313 22 v96 M250 70 h126', 'none', { stroke: '#ffffff', 'stroke-width': 4 });
      o += circle(288, 52, 12, '#fff3c4');
      /* постер са једнорогом */
      o += rect(28, 26, 88, 66, '#fdf6e6', 4) + rect(28, 26, 88, 66, 'none', 4, { stroke: '#e8a6c8', 'stroke-width': 3 });
      o += ellipse(66, 66, 20, 13, '#ffffff') + circle(82, 54, 9, '#ffffff') +
        path('M88 47 l 4 -12 l -8 6 z', '#ffd76a') +
        path('M46 60 q -12 -10 -6 -20 q 10 8 14 12', '#f2a0c0');
      /* кревет */
      o += rect(0, 150, W, 22, '#e3b7cf');
      o += rect(0, 172, W, 78, '#f3d7e6');
      o += rect(10, 150, 150, 60, '#b9a3e3', 10);
      o += rect(24, 140, 74, 26, '#fdf6e6', 8);
      o += path('M10 176 q 80 -16 150 0 l 0 34 l -150 0 z', '#9fd8f0');
      /* столица са ранцем */
      o += rect(232, 158, 60, 8, '#c9a87e', 3) + rect(238, 166, 6, 40, '#a8845e') + rect(282, 166, 6, 40, '#a8845e');
      o += g('translate(262,140) scale(1.05)', L.drawBackpack(0, 0, '#e2565f'));
      /* будилник */
      o += circle(346, 168, 16, '#fdf6e6') + circle(346, 168, 16, 'none', { stroke: '#e2565f', 'stroke-width': 3 }) +
        path('M346 168 v-9 M346 168 l 7 4', 'none', { stroke: '#4a3f60', 'stroke-width': 2.4, 'stroke-linecap': 'round' }) +
        circle(336, 152, 5, '#e2565f') + circle(356, 152, 5, '#e2565f');
      return o;
    },

    /* купатило: огледало, лавабо, плочице */
    kupatilo: function (rnd) {
      var o = rect(0, 0, W, H, '#dff0f7');
      var i, j;
      for (i = 0; i < 9; i++) {
        for (j = 0; j < 4; j++) {
          o += rect(i * 46 + 2, j * 34 + 2, 42, 30, '#eaf7fc', 4, { opacity: 0.9 });
        }
      }
      o += rect(0, 140, W, 10, '#bcd8f2');
      o += L.floorTiles(168, '#cfe4ef', '#aecadb');
      /* огледало */
      o += rect(120, 22, 160, 100, '#f7fbff', 12) + rect(120, 22, 160, 100, 'none', 12, { stroke: '#9fd8f0', 'stroke-width': 6 });
      o += path('M136 108 l 40 -74', 'none', { stroke: '#ffffff', 'stroke-width': 10, opacity: 0.5 });
      /* лавабо */
      o += ellipse(200, 176, 54, 20, '#ffffff') + rect(146, 176, 108, 16, '#ffffff', 6) +
        rect(192, 150, 8, 22, '#c3d8e4', 3) + path('M196 152 q 14 0 14 14', 'none', { stroke: '#c3d8e4', 'stroke-width': 6 });
      /* чаша са четкицама */
      o += rect(300, 150, 22, 26, '#ffd76a', 4) + rect(304, 132, 4, 20, '#e2565f', 2) + rect(312, 130, 4, 22, '#7ce7c8', 2);
      /* пешкири */
      o += rect(28, 140, 34, 62, '#f2a0c0', 6) + rect(66, 140, 30, 56, '#7ce7c8', 6);
      return o;
    },

    /* раскрсница са семафором и зебром */
    raskrsnica: function (rnd) {
      var o = L.clouds(rnd, 3) + L.sun(330, 40, 18);
      o += L.block(0, 56, 104, 128, '#e4d6c0', rnd) + L.block(112, 40, 92, 144, '#d8c3ae', rnd) +
        L.block(212, 66, 82, 118, '#e8dcc6', rnd);
      /* школа са друге стране */
      o += rect(300, 62, 100, 122, '#f0dcc0', 4) + rect(300, 62, 100, 12, '#c98d63', 3);
      var i;
      for (i = 0; i < 2; i++) o += rect(312 + i * 46, 86, 34, 28, '#bcd8f2', 3, { stroke: '#ffffff', 'stroke-width': 3 });
      o += circle(322, 52, 9, '#e2565f') + circle(346, 46, 9, '#7ce7c8') + circle(368, 52, 9, '#ffd76a');
      /* улица и зебра */
      o += rect(0, 184, W, 16, '#c3bcb0');
      o += rect(0, 200, W, 50, '#6b6870');
      for (i = 0; i < 7; i++) o += rect(20 + i * 54, 204, 30, 42, '#f7f2e2', 3, { opacity: 0.92 });
      /* семафор */
      o += rect(56, 96, 9, 92, '#5a5a68') + rect(40, 44, 40, 58, '#3f3f4e', 8);
      o += circle(60, 58, 9, '#e2565f') + circle(60, 74, 9, '#6b5a2a', { opacity: 0.5 }) + circle(60, 90, 9, '#3f6b4a', { opacity: 0.5 });
      return o;
    },

    /* учионица првог разреда: азбука на зиду, ниске клупе */
    ucionicaPrvi: function (rnd) {
      var o = rect(0, 0, W, H, '#fbf1de');
      o += rect(0, 0, W, 132, '#f5e6cc');
      o += L.board(24, 24, 190, 88, '#2f5a45',
        path('M52 52 l 16 -18 l 16 18 M58 46 h20', 'none', { stroke: '#f7f4e8', 'stroke-width': 4 }) +
        path('M108 52 l 0 -18 l 12 10 l 12 -10 l 0 18', 'none', { stroke: '#f7f4e8', 'stroke-width': 4 }) +
        path('M50 82 h120', 'none', { stroke: '#ffe9a8', 'stroke-width': 3, opacity: 0.85 }));
      /* азбука на зиду */
      var slova = ['А', 'Б', 'В', 'Г', 'Д', 'Ђ'];
      for (var i = 0; i < slova.length; i++) {
        var x = 238 + (i % 3) * 52;
        var y = 26 + Math.floor(i / 3) * 52;
        o += rect(x, y, 44, 44, i % 2 ? '#ffd9e6' : '#d8ecff', 8);
        o += L.el('text', {
          x: L.r2(x + 22), y: L.r2(y + 31), 'text-anchor': 'middle',
          'font-family': 'Nunito, Segoe UI, sans-serif', 'font-size': 26,
          'font-weight': 'bold', fill: '#4a3f60'
        }, slova[i]);
      }
      o += rect(0, 132, W, 10, '#c9a87e');
      o += L.floorTiles(160, '#e6d6b8', '#cbb894');
      o += L.desk(64, 214, 0.92, '#f0d8b0', '#b9885e') + L.desk(336, 216, 0.92, '#f0d8b0', '#b9885e');
      /* корпа са патофнама поред врата */
      o += rect(150, 196, 46, 24, '#c9a87e', 6) + ellipse(162, 196, 9, 5, '#ff9db1') + ellipse(182, 196, 9, 5, '#9fd8f0');
      return o;
    },

    /* двориште првог дана: балони и натпис */
    dvoristePrvi: function (rnd) {
      var o = L.clouds(rnd, 3) + L.sun(52, 34, 18);
      o += rect(170, 26, 230, 162, '#f0dcc0', 4) + rect(170, 26, 230, 14, '#c98d63', 3);
      var i;
      for (i = 0; i < 4; i++) o += rect(186 + i * 52, 52, 36, 30, '#bcd8f2', 3, { stroke: '#ffffff', 'stroke-width': 3 });
      o += rect(238, 140, 46, 48, '#c96f7e', 4) + circle(274, 166, 3, '#ffd76a');
      /* натпис „Добро дошли“ */
      o += rect(180, 96, 200, 30, '#fdf6e6', 8) + rect(180, 96, 200, 30, 'none', 8, { stroke: '#e2565f', 'stroke-width': 3 });
      o += L.el('text', {
        x: 280, y: 118, 'text-anchor': 'middle', 'font-family': 'Nunito, Segoe UI, sans-serif',
        'font-size': 19, 'font-weight': 'bold', fill: '#c9506a'
      }, 'ДОБРО ДОШЛИ');
      /* балони */
      var colors = ['#e2565f', '#5b8ad8', '#7ce7c8', '#ffd76a', '#b9a3e3'];
      for (i = 0; i < 5; i++) {
        var bx = 24 + i * 30, by = 44 + (i % 2) * 22;
        o += path('M' + bx + ' ' + (by + 16) + ' q 6 22 0 44', 'none', { stroke: '#ffffff', 'stroke-width': 1.4, opacity: 0.8 });
        o += ellipse(bx, by, 12, 15, colors[i]) + ellipse(bx - 4, by - 5, 3.6, 4.6, '#ffffff', { opacity: 0.55 });
      }
      o += L.treeGreen(64, 186, 0.8);
      o += rect(0, 186, W, 64, '#b9b4ab');
      o += path('M0 214 h400', 'none', { stroke: '#f2e6c8', 'stroke-width': 3, opacity: 0.7 });
      return o;
    },

    /* ограда на крају дворишта */
    ograda: function (rnd) {
      var o = L.clouds(rnd, 2) + L.sun(300, 40, 16);
      o += L.block(0, 62, 96, 122, '#ddc9b2', rnd) + L.block(300, 54, 100, 130, '#d3c0ac', rnd);
      o += rect(0, 180, W, 70, '#b9b4ab');
      var i;
      o += rect(0, 96, W, 8, '#5a8a6a') + rect(0, 152, W, 8, '#5a8a6a');
      for (i = 0; i < 22; i++) o += rect(6 + i * 18, 90, 7, 96, '#6b9c7a', 3);
      o += L.treeGreen(200, 184, 0.7);
      return o;
    }
  };

  /* ---------- сцене ---------- */
  var s = L.scene;

  var scenes = {
    /* јутро код куће */
    budjenje: s('soba', ['milaSleepy'], 'morning', 'буђење у седам, ранац још празан'),
    prozor: s('soba', ['mila'], 'morning', 'поглед кроз прозор на јутарњи Београд'),
    jos_malo: s('soba', ['milaSleepy', 'mama'], 'morning', 'још мало испод јоргана'),
    kupatilo: s('kupatilo', ['mila'], 'indoor', 'четкица, пена од јагоде и огледало'),
    dorucak: s('kitchen', ['mama', 'milaNoBag', 'tata'], 'morning', 'какао и кифла у кухињи'),
    oblacenje: s('soba', ['milaNoBag'], 'morning', 'хаљина или мајица са једнорогом'),
    jednorog: s('soba', ['mila'], 'morning', 'мајица са једнорогом'),
    ranac: s('soba', ['mila', 'tata'], 'morning', 'паковање црвеног ранца'),
    izlazak: s('street', ['mila', 'mama'], 'morning', 'излазак на улицу пред школу'),

    /* пут до школе */
    park_put: s('park', ['mila', 'mama'], 'morning', 'пречица кроз парк'),
    baka: s('park', ['mila', 'baka'], 'morning', 'помоћ баки са кесама'),
    trotinet: s('street', ['milaReach', 'mama'], 'morning', 'тротинет низ тротоар'),
    trotinet_ok: s('street', ['milaReach'], 'morning', 'савладан ћошак'),
    trotinet_pad: s('park', ['mila', 'mama'], 'morning', 'пад у меку траву'),
    autobus: s('bus', ['mila', 'mama'], 'day', 'аутобус 25'),
    autobus_lepo: s('bus', ['mila'], 'day', 'уступљено место'),
    autobus_slova: s('bus', ['mila'], 'day', 'слова са реклама кроз прозор'),
    semafor: s('raskrsnica', ['mila', 'mama'], 'morning', 'семафор пред школом'),
    semafor_zeleno: s('raskrsnica', ['mila'], 'morning', 'прелаз на зелено'),
    semafor_crveno: s('raskrsnica', ['mila', 'rade'], 'morning', 'саобраћајац зауставља улицу'),

    /* долазак */
    dvoriste: s('dvoristePrvi', ['mila', 'jovana'], 'day', 'двориште пуно балона'),
    mama_maha: s('dvoristePrvi', ['mila', 'mamaReach'], 'day', 'мама маше са капије'),
    red: s('dvoristePrvi', ['jovana', 'mila', 'vuk'], 'day', 'прозивка по списку'),
    kasnjenje: s('dvoristePrvi', ['mila', 'mija'], 'day', 'празно двориште после звона'),

    /* учионица */
    ucionica: s('ucionicaPrvi', ['mila'], 'indoor', 'учионица са азбуком на зиду'),
    bez_patofni: s('ucionicaPrvi', ['jovana', 'mila'], 'indoor', 'патике на новом паркету'),
    klupa: s('ucionicaPrvi', ['mila', 'tara'], 'indoor', 'избор клупе'),
    tara: s('ucionicaPrvi', ['tara', 'mila'], 'indoor', 'Тара са две кике'),
    prozor_klupa: s('ucionicaPrvi', ['mila'], 'indoor', 'последња клупа поред прозора'),

    /* математика */
    matematika: s('ucionicaPrvi', ['jovanaChalk', 'mila'], 'indoor', 'пет јабука и још три на табли'),
    mat_tacno: s('ucionicaPrvi', ['milaHand', 'jovanaChalk'], 'indoor', 'дигнута рука и тачан одговор'),
    mat_crit: s('ucionicaPrvi', ['milaChalk', 'jovanaChalk', 'vuk'], 'indoor', 'решење на два начина'),
    mat_probala: s('ucionicaPrvi', ['milaHand', 'jovana'], 'indoor', 'заједничко бројање наглас'),
    mat_prozvana: s('ucionicaPrvi', ['jovana', 'mila'], 'indoor', 'прозвана из клупе'),
    mat_spas: s('ucionicaPrvi', ['mila', 'jovana'], 'indoor', 'шапат који се ипак чуо'),
    mat_minus: s('ucionicaPrvi', ['jovana', 'mila'], 'indoor', 'први знак поред имена'),
    mat_vuk: s('ucionicaPrvi', ['vukHand', 'mila', 'jovana'], 'indoor', 'шапнут одговор за Вука'),
    mali_odmor: s('hallway', ['mila', 'vuk', 'tara'], 'indoor', 'ходник између два часа'),
    hodnik_trka: s('hallway', ['milaReach', 'mija'], 'indoor', 'клизање по управо опраном ходнику'),

    /* српски */
    srpski: s('ucionicaPrvi', ['jovanaChalk', 'milaBook'], 'indoor', 'слово А на табли'),
    srp_lepo: s('ucionicaPrvi', ['milaBook', 'jovana'], 'indoor', 'ред лепих слова А'),
    srp_krivo: s('ucionicaPrvi', ['jovana', 'milaBook'], 'indoor', 'вођена рука са оловком'),
    srp_tara: s('ucionicaPrvi', ['taraBook', 'milaBook'], 'indoor', 'учење од Таре'),
    papirici: s('ucionicaPrvi', ['mila', 'vuk'], 'indoor', 'папирићи лете по учионици'),
    papirici_uhvacena: s('ucionicaPrvi', ['jovana', 'mila'], 'indoor', 'папирић на учитељичиној ципели'),
    papirici_pokupi: s('ucionicaPrvi', ['mila'], 'indoor', 'скупљање папирића са пода'),
    papirici_pisem: s('ucionicaPrvi', ['milaBook', 'jovana'], 'indoor', 'пуна страна слова'),
    papirici_stali: s('ucionicaPrvi', ['mila', 'vuk', 'jovana'], 'indoor', 'три речи и мир у одељењу'),
    papirici_ne_slusaju: s('ucionicaPrvi', ['vuk', 'mila', 'jovana'], 'indoor', 'дечаци који не слушају'),

    /* велики одмор */
    veliki_odmor: s('dvoristePrvi', ['mila', 'vuk', 'cat'], 'day', 'велики одмор у дворишту'),
    bekstvo: s('ograda', ['mila', 'vuk', 'mija'], 'day', 'рупа у огради и домар Мија'),
    uzina: s('stairs', ['mila', 'tara'], 'day', 'подељена јабука и кифла'),
    lastis: s('dvoristePrvi', ['milaReach', 'tara'], 'day', 'ластиш до колена'),
    macka: s('ograda', ['mila', 'catUp', 'pigeon'], 'day', 'риђа Мица и мрвице'),
    odmor_posle: s('hallway', ['mila', 'tara'], 'indoor', 'звоно за трећи час'),

    /* свет око нас */
    svet: s('ucionicaPrvi', ['jovanaChalk', 'mila'], 'indoor', 'карта Београда на табли'),
    svet_tacno: s('ucionicaPrvi', ['milaHand', 'jovana'], 'indoor', 'Сава и Дунав'),
    svet_skoro: s('ucionicaPrvi', ['mila', 'jovana'], 'indoor', 'скоро тачан одговор'),
    svet_ponovila: s('ucionicaPrvi', ['mila', 'vuk', 'jovana'], 'indoor', 'поновљен туђи шапат'),
    svet_prica: s('ucionicaPrvi', ['mila', 'jovana', 'tara'], 'indoor', 'прича о ушћу са тврђаве'),
    svet_klupa: s('ucionicaPrvi', ['jovana', 'mila'], 'indoor', 'цветићи нацртани по клупи'),

    /* ликовно */
    likovno: s('ucionicaPrvi', ['milaBook', 'tara'], 'indoor', 'бојице и празан папир'),
    lik_klupa: s('ucionicaPrvi', ['milaBook', 'taraBook', 'jovana'], 'indoor', 'цртеж две девојчице у клупи'),
    lik_macka: s('ucionicaPrvi', ['milaBook', 'jovana'], 'indoor', 'цртеж риђе мачке за пано'),
    lik_ulica: s('ucionicaPrvi', ['milaBook', 'jovana'], 'indoor', 'цртеж семафора и мaме'),
    lik_voda: s('ucionicaPrvi', ['mila', 'vuk'], 'indoor', 'просута чаша воде за бојење'),
    lik_voda_izvini: s('ucionicaPrvi', ['mila', 'vuk', 'jovana'], 'indoor', 'заједничко брисање клупе'),
    lik_voda_krije: s('ucionicaPrvi', ['jovana', 'mila', 'vuk'], 'indoor', 'мокри папири испод клупе'),
    lik_voda_popravka: s('ucionicaPrvi', ['milaBook', 'vuk'], 'indoor', 'нови папири и нови цртеж'),

    /* крај дана */
    kraj_dana: s('ucionicaPrvi', ['jovana', 'mila', 'tara'], 'indoor', 'последње звоно'),
    kraj_macka: s('ograda', ['mila', 'cat'], 'dusk', 'поздрав са мачком на зиду'),
    kraj_pet_minusa: s('ucionicaPrvi', ['jovana', 'mila'], 'warm', 'разговор у празној учионици'),
    kraj_pohvalnica: s('dvoristePrvi', ['jovana', 'mila', 'mama'], 'dusk', 'похвалница за храброст првог дана'),
    kraj_drugarstvo: s('dvoristePrvi', ['tara', 'mila', 'vuk'], 'dusk', 'екипа испред школе'),
    kraj_uredna: s('duskStreet', ['mila'], 'dusk', 'пут кући без иједног минуса'),
    kraj_dobar: s('kitchen', ['mama', 'mila'], 'warm', 'свеска на кухињском столу'),
    kraj_tezak: s('kitchen', ['milaSleepy', 'mama'], 'warm', 'чај од нане после дугог дана')
  };

  ART.register('prvi', {
    characters: characters,
    backgrounds: backgrounds,
    scenes: scenes,
    fallback: s('ucionicaPrvi', ['mila'], 'indoor', 'учионица првог разреда')
  });
})();
