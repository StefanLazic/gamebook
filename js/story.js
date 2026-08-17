/* Whiskerlight — story data
 * A fantasy gamebook: one kid, one missing cat, one very strange night.
 *
 * Passage shape:
 *   { title, text: [..], effects, firstVisitEffects, ending, choices: [ ... ] }
 * Choice shape:
 *   { text, to, tag, effects, needItem, needFlag, notFlag, needStat, hideWhenLocked,
 *     roll: { stat, dc, success, fail, crit, successEffects, failEffects, itemBonus } }
 */
var STORY = {
  start: 'porch',
  passages: {

    /* ---------- Act I: Thimbledown ---------- */

    porch: {
      title: 'Rupa u obliku mačke',
      text: [
        'Mimi je nestala otkako je izašao mesec, a mesec je sada već baš, baš visoko.',
        'Imaš jedanaest godina, još si u donjem delu pidžame i imaš tačno jedan plan: da pronađeš svoju mačku pre nego što se selo probudi i svi počnu da govore reč *verovatno*.',
        'Njena činija za hranu stoji netaknuta. Udubljenje na jorganu gde spava je hladno. Na stepeniku trema vidi se jedan jedini čađavi otisak šape koji jedva primetno svetluca, kao da je neko prosuo zvezdu pa je loše počistio.'
      ],
      choices: [
        { text: 'Najpre zgrabi potrepštine iz baštenske šupe.', to: 'shed' },
        { text: 'Pokucaj na vrata gospođe Pel — ona nikad ne spava.', to: 'pell' },
        { text: 'Prati svetlucave tragove pravo u baštu.', to: 'garden' }
      ]
    },

    shed: {
      title: 'Šupa puna korisnog đubreta',
      text: [
        'Šupa miriše na listove paradajza i staru kišu. Uzimaš limenu lampu sa klimavom drškom i trakicu sušene ribe iz paketića koji tata krije od tebe.',
        'Na izlazu umalo ne zapneš za baštensku lopatu, koja *sigurno* nije tamo gde si je ostavio. Zemlja ispod vrata šupe raskopana je iznutra.'
      ],
      firstVisitEffects: { items: ['🏮 Limena lampa', '🐟 Suva riba'], flags: { supplied: true } },
      choices: [
        { text: 'Prati tragove u baštu.', to: 'garden' },
        { text: 'Usput skokni do vrata gospođe Pel.', to: 'pell', notFlag: 'metPell' }
      ]
    },

    pell: {
      title: 'Gospođa Pel, koja nikad ne spava',
      text: [
        'Gospođa Pel otvara vrata pre nego što stigneš da pokucaš. Ima devedeset i jednu godinu i plete nešto sa mnogo, mnogo previše rukava.',
        '„Crna mačka, bela čarapica, puna mišljenja?“ kaže. „Da. Prošla je kroz živicu na dnu tvoje bašte. Mačke to rade, u Šupljim noćima. Većina se vrati.“',
        'Utiskuje ti u ruku malo mesingano zvonce. „To je bilo od mog Barnabija. Pozvoni njime tamo gde zvonjava zvuči *pogrešno*, pa ćeš znati da si stigao.“'
      ],
      firstVisitEffects: { items: ['🔔 Barnabijevo zvono'], flags: { metPell: true }, stats: { kindness: 1 } },
      choices: [
        { text: '„Šta je to Šuplja noć?“', to: 'pell_lore' },
        { text: 'Zahvali joj i potrči u baštu.', to: 'garden' }
      ]
    },

    pell_lore: {
      title: 'Šta zna gospođa Pel',
      text: [
        '„Jednom godišnje živice se istanje“, kaže ona, „a šuma s druge strane seti se da je nekad bila veća od sveta. Mačke su pozvane. Deca se *trpe*.“',
        '„Tri stvari čuvaju dete tamo napolju: hrabrost, lukavost i to da budeš iskreno fin prema stvarima sa previše očiju. Ponesi sve tri. Ne prihvataj prečice od bilo koga sa lampom sjajnijom od tvoje.“',
        'Vraća se pletenju. Primećuješ da su dodatni rukavi mačje veličine.'
      ],
      firstVisitEffects: { stats: { cunning: 1 }, flags: { warned: true } },
      choices: [
        { text: 'Kreni ka baštenskoj živici.', to: 'garden' },
        { text: 'Svraćaj do šupe po potrepštine.', to: 'shed', notFlag: 'supplied' }
      ]
    },

    garden: {
      title: 'Živica koja diše',
      text: [
        'Na dnu bašte glogova živica radi nešto što živice nikako ne bi smele da rade: udiše.',
        'Otisci šapa marširaju pravo do otvora koji je jedva dovoljno širok za mačku, a onda staju. Kroz njega vidiš travu koja je pogrešne nijanse srebra i čuješ kako šuma diše nazad.',
        'Otvor je mačje veličine. Ti si, na veliku žalost, dečje veličine.'
      ],
      choices: [
        { text: 'Provuci se kroz trnoviti otvor.',
          roll: { stat: 'cunning', dc: 7, success: 'hollowwood', fail: 'gap_fail', failEffects: { stats: { health: -1 } } } },
        { text: 'Prvo vikni Mimino ime u tamu.', to: 'garden_shout' },
        { text: 'Vrati se po potrepštine.', to: 'shed', notFlag: 'supplied' }
      ]
    },

    garden_shout: {
      title: 'Imena putuju',
      text: [
        '„MIMI!“',
        'Šuma odgovara sa stotinu sitnih glasova, i svi ti glasovi ti učtivo vraćaju *Mimi*, kao razred koji ponavlja tešku reč za diktat. Negde daleko nešto ogromno prestaje da žvaće kako bi oslušnulo.',
        'Imaš snažan osećaj da si upravo celoj šumi ispričao svoja posla. S vedrije strane, živica uzdahne i otvori se malo šire, kao da je impresionirana tvojom nepristojnošću.'
      ],
      firstVisitEffects: { stats: { courage: 1 }, flags: { shouted: true } },
      choices: [
        { text: 'Prođi dok je široko.', to: 'hollowwood' }
      ]
    },

    gap_fail: {
      title: 'Trnje ima svoje mišljenje',
      text: [
        'Živica ti uzme parče rukava i malo tebe pride. Padaš na drugu stranu u gomili udova i peckanja.',
        'Jedan trn, i dalje držeći tvoj rukav, vraća ga nazad. Učtivo. To je trenutak kad tvoja noć prestaje da bude obična.'
      ],
      choices: [ { text: 'Ustani. Nastavi dalje.', to: 'hollowwood' } ]
    },

    /* ---------- Act II: The Hollowwood ---------- */

    hollowwood: {
      title: 'Šuplja šuma',
      text: [
        'Šuma s druge strane je ogromna i tiha i osvetljena odozdo, kao da je mahovina čitavog leta skupljala mesečinu.',
        'Mimini zvezdani tragovi šapa produžavaju napred, pa se onda razdvajaju — što je nemoguće, osim ako ih nije bilo dve, a o tome odbijaš da razmišljaš.',
        'Tri puta: potok crne vode preko kamenova za gaženje, kameni most pod kojim nešto hrče i krug pečuraka gde moljci plešu vrlo organizovano.'
      ],
      choices: [
        { text: 'Pređi crni potok.', to: 'brook', notFlag: 'didBrook' },
        { text: 'Idi preko mosta (i preko onoga ko je ispod njega).', to: 'bridge', notFlag: 'didBridge' },
        { text: 'Uđi u krug pečuraka.', to: 'ring', notFlag: 'didRing' },
        { text: 'Prati gavranju buku dublje unutra.', to: 'crow_market', onlyFlag: 'wandered' }
      ]
    },

    brook: {
      title: 'Potok koji odražava juče',
      text: [
        'Voda je crna i ne pokazuje tebe nego *tebe od pre sat vremena*, kako spavaš, sa Mimi sklupčanom u pregibu tvojih kolena.',
        'Devet kamenova. Srednji je mokar i kezast. Negde ispod vode nešto sa mnogo, mnogo previše peraja drži ritam.'
      ],
      effects: { flags: { didBrook: true, wandered: true } },
      choices: [
        { text: 'Preskači kamenje ne gledajući nadole.',
          roll: { stat: 'courage', dc: 8, success: 'brook_win', fail: 'brook_fail',
                  failEffects: { stats: { health: -1 } }, crit: 'brook_crit' } },
        { text: 'Pregazi kroz vodu — sporo, hladno, sigurno.', to: 'brook_wade' },
        { text: 'Nazad do tri puta.', to: 'hollowwood' }
      ]
    },

    brook_win: {
      title: 'Devet kamenova, devet otkucaja srca',
      text: [
        'Prelaziš preko kamenova kao neko ko je ovo već radio, a perajasto stvorenje ispod tebe aplaudira zvukom mokrih dlanova.',
        'Na drugoj obali nalaziš svica kako sedi u tegli koja je već otvorena. „Baš si se otegao“, kaže. Skoči ti u džep i počne uslužno da svetli.'
      ],
      firstVisitEffects: { items: ['✨ Bezobrazni svitac'], stats: { courage: 1 } },
      choices: [ { text: 'Napred.', to: 'crow_market' } ]
    },

    brook_crit: {
      title: 'Savršeno. Baš savršeno.',
      text: [
        'Pređeš tako lepo da se potok, postiđen, nakratko razlije unazad.',
        'Perajasto stvorenje izroni — sve brkovi i stari novčići — i pokloni ti krljušt koja zuji kada neko u blizini laže. „Za pijacu“, klokota. „Trebaće ti.“',
        'Pridružuje ti se i jedan bezobrazni svitac, nepozvan, iz tegle na obali.'
      ],
      firstVisitEffects: { items: ['✨ Bezobrazni svitac', '🐠 Krljušt istine'], stats: { courage: 1 } },
      choices: [ { text: 'Napred, svetlucavo.', to: 'crow_market' } ]
    },

    brook_fail: {
      title: 'Pljus',
      text: [
        'Kezasti kamen se, ispostavlja se, kezi baš zbog ovoga.',
        'Upadaš do rebara. Voda je toliko hladna da se prepire s tobom. Nešto ogromno i perajasto gurne te — nimalo neljubazno — do druge obale, pa nestane sa tvojom levom papučom kao naplatom.'
      ],
      choices: [ { text: 'Nastavi dalje, gnjecavo.', to: 'crow_market' } ]
    },

    brook_wade: {
      title: 'Sporo i hladno',
      text: [
        'Gaziš. Bedno je i uspeva. Na pola puta, odraz tvog usnulog-ja otvori oči i oblikuje usnama: *iza šupljeg drveta*.',
        'Spremiš to u onaj deo mozga koji i dalje savesno vodi beleške.'
      ],
      firstVisitEffects: { flags: { hint: true }, stats: { cunning: 1 } },
      choices: [ { text: 'Izađi na obalu i nastavi.', to: 'crow_market' } ]
    },

    bridge: {
      title: 'Ispod mosta, hrkanje',
      text: [
        'Hrkanje prestaje. Mahovinasti trol se odmotava ispod mosta — skoro tri metra vlažnog granita sa šeširom od paprati.',
        '„Mostarina“, zagrmi, a onda doda izvinjavajući se: „izvini, posao je takav. Zagonetka ili novčić ili dobrota. Biraj.“',
        'Primećuješ da su mu preko nosa tri duge ogrebotine. Sveže. Mačkastog oblika.'
      ],
      effects: { flags: { didBridge: true, wandered: true } },
      choices: [
        { text: 'Uzmi zagonetku.', to: 'troll_riddle' },
        { text: 'Ponudi suvu ribu.', to: 'troll_gift', needItem: '🐟 Suva riba' },
        { text: 'Pitaj za ogrebotine i da li ga nos boli.', to: 'troll_kind' },
        { text: 'Nazad do tri puta.', to: 'hollowwood' }
      ]
    },

    troll_riddle: {
      title: 'Mostarina od reči',
      text: [
        '„Čuvam se tako što se dajem“, kaže trol. „Lomim se tako što se ispričam. Mala bića me nose preko čitavih šuma.“',
        'Njegove oči su strpljive. Mostovi su strpljivi. Ti nisi, ali se trudiš.'
      ],
      choices: [
        { text: '„Obećanje.“', to: 'troll_right' },
        { text: '„Senka.“', to: 'troll_wrong' },
        { text: '„Baš dobar štap.“', to: 'troll_wrong' },
        { text: 'Pametno pogađaj iz konteksta.',
          roll: { stat: 'cunning', dc: 8, success: 'troll_right', fail: 'troll_wrong' } }
      ]
    },

    troll_right: {
      title: 'Tačno, iritantno tačno',
      text: [
        '„Tačno“, uzdahne trol, koji više voli da naplaćuje mostarinu nego da daje uputstva. „Prođi.“',
        'Dodaje, preko volje: „Tvoja mačka je prošla u vreme izlaska meseca. Hodala je kao da je most njen. Ogrebala me je kad sam rekao da nije. Nosila je nešto u ustima, i to *nije* bio miš.“'
      ],
      firstVisitEffects: { stats: { cunning: 1 }, flags: { trollTold: true } },
      choices: [ { text: 'Pređi most.', to: 'crow_market' } ]
    },

    troll_wrong: {
      title: 'Pogrešno, ali veselo',
      text: [
        '„Ne“, kaže trol, oduševljeno. „Mostarina nije plaćena. Ali pravila su pravila, a pravila kažu da moram samo da budem *neprijatan*.“',
        'Podiže te za kragnu pidžame i spušta na drugu stranu naopačke, pa onda uspravno, da čast bude zadovoljena. Gubiš malo dostojanstva i malo kože.'
      ],
      firstVisitEffects: { stats: { health: -1 } },
      choices: [ { text: 'Odlutaj sa ostacima svog ponosa.', to: 'crow_market' } ]
    },

    troll_gift: {
      title: 'Diplomatija sa suvom ribom',
      text: [
        'Podigneš suvu ribu. Trol je uzme nežno kao da drži dragulj i pojede je na način koji jasno govori da mu niko ništa nije ponudio već dve stotine godina.',
        '„Dobrota prihvaćena“, kaže punih usta. „Savet uključen, besplatno: na gavranjoj pijaci nikad ne prihvataj *prvu* cenu i nikad ne izgovaraj ime svoje mačke naglas. Tamo su imena valuta.“',
        'Pruža ti i grumen mahovine sa mosta. „Žvaći ako mrak postane previše mračan.“'
      ],
      firstVisitEffects: { lose: ['🐟 Suva riba'], items: ['🌿 Mostna mahovina'], stats: { kindness: 1 }, flags: { marketTip: true } },
      choices: [ { text: 'Pređi most sa prijateljem iza sebe.', to: 'crow_market' } ]
    },

    troll_kind: {
      title: 'Da li boli?',
      text: [
        'Niko, za dva veka, nije pitao trola za nos. Sedne tako naglo da se most pobuni.',
        '„Bila je uplašena“, kaže. „Ne od mene. Od onoga što ju je pratilo. Mala crna mačka, bela čarapica, i nešto iza nje što sam mogao da čujem, ali ne i da vidim.“ Dozvoli ti da ogrebotine tapkaš mokrom paprati.',
        '„Idi sad. Mostarina oproštena. I uzmi ovo — znači *ovo dete je prijatelj mosta*. Nekim ljudima je to važno.“'
      ],
      firstVisitEffects: { items: ['🪨 Trolov žeton'], stats: { kindness: 1 }, flags: { trollFriend: true, followed: true } },
      choices: [ { text: 'Pređi most, sad već zabrinut.', to: 'crow_market' } ]
    },

    ring: {
      title: 'Krug vrlo organizovanih moljaca',
      text: [
        'Dvesta moljaca pleše svečani ples iznad pečuraka. Plešu u obliku mačke. Shvataš da oni *odglumljuju* nešto — malu mačku koja trči, a iza nje priliku sa previše nogu.',
        'Moljci zastanu. Žele partnera. Krajnje su jasni po tom pitanju uprkos tome što nemaju lica.'
      ],
      effects: { flags: { didRing: true, wandered: true, followed: true } },
      choices: [
        { text: 'Pleši sa moljcima.',
          roll: { stat: 'kindness', dc: 7, success: 'ring_win', fail: 'ring_fail' } },
        { text: 'Umesto toga isprati celu priču do kraja.', to: 'ring_watch' },
        { text: 'Polako se povuci. Nazad do tri puta.', to: 'hollowwood' }
      ]
    },

    ring_win: {
      title: 'Veoma blesav, veoma ozbiljan ples',
      text: [
        'Plešeš. Loše. Strašno loše, u donjem delu pidžame, sa jednom papučom, u krugu svetlećih pečuraka usred šume koja ne bi smela da postoji.',
        'Moljci su oduševljeni. Sleću ti na ramena i uplete se u sivi plašt koji ništa ne teži i zbog kog se osećaš pomalo nevidljivo.',
        '„Tiho-stvar je prati“, šapuću svi zajedno. „Tiho-stvar hoće njen glas.“'
      ],
      firstVisitEffects: { items: ['🦋 Plašt od moljaca'], stats: { kindness: 1 }, flags: { hushKnown: true } },
      choices: [ { text: 'Prati kuda moljci pokazuju.', to: 'crow_market' } ]
    },

    ring_fail: {
      title: 'Dve leve noge, jedna leva papuča',
      text: [
        'Nagaziš na ples. Znaš to jer se ples zaustavi i svaki moljac se odjednom okrene ka tebi, a to je mnogo gledanja od stvari koje, iskreno, nemaju oči.',
        'Opraštaju ti — moljci su takvi — ali ti ne pozajmljuju svoj plašt. Ipak, pre nego što se razlete, šapnu jednu reč: *„Tiho-stvar.“*'
      ],
      firstVisitEffects: { flags: { hushKnown: true } },
      choices: [ { text: 'Nastavi dalje, uznemiren.', to: 'crow_market' } ]
    },

    ring_watch: {
      title: 'Cela priča, ispričana moljcima',
      text: [
        'Sedneš i odgledaš ples tri puta. Moljac-Mimi trči. Mnogonoga Tiho-stvar je prati. A onda — deo koji si morao da gledaš tri puta da bi bio siguran — moljac-Mimi prestaje da trči i okreće se, zato što nosi nešto malo, a to malo više ne može da trči.',
        'Moljci završavaju. Naklone se. Jedan sleti na tvoj nos da proveri da li si razumeo.'
      ],
      firstVisitEffects: { flags: { hushKnown: true, sawKitten: true }, stats: { cunning: 1 } },
      choices: [ { text: 'Hajde, brzo sad.', to: 'crow_market' } ]
    },

    /* ---------- Act III: The Market and the Witch ---------- */

    crow_market: {
      title: 'Gavranja pijaca',
      text: [
        'Čistina puna tezgi napravljenih od kišobrana, na kojima rade isključivo gavrani u prslucima, osvetljena lampama koje su iskreno samo veoma samodopadljive krijesnice.',
        'Prodaju: pravce, pozajmljena imena, izvinjenja u boci i jednu (1) mapu do Dvora devetostrukog ognjišta, gde — kako objašnjava natpis — *sve izgubljene mačke na kraju budu zavedene*.',
        'Glavni gavran odmeri tvoju pidžamu. „Cena je jedno ime“, kaže. „Ne tvoje. Bilo čije.“'
      ],
      choices: [
        { text: 'Trguj imenom koje ti nije žao da izgubiš (onim nastavnika kog najmanje voliš).', to: 'market_trade' },
        { text: 'Cenkaj se. Nikad ne prihvataj prvu cenu.', to: 'market_haggle', onlyFlag: 'marketTip' },
        { text: 'Pokaži trolov žeton.', to: 'market_token', needItem: '🪨 Trolov žeton' },
        { text: 'Džepari mapu dok se gavrani raspravljaju.',
          roll: { stat: 'cunning', dc: 9, success: 'market_stolen', fail: 'market_caught', failEffects: { stats: { health: -1 } } } }
      ]
    },

    market_trade: {
      title: 'Prodato: jedno ime',
      text: [
        'Izgovoriš jedno ime. Gavrani ga sa velikom svečanošću zapišu i ti odmah više ne možeš da se setiš koje je bilo. Negde se nastavnik matematike budi sa divnim osećajem anonimnosti.',
        'Mapa je pero. Kad ga držiš, ono pokazuje. Trenutno pokazuje toliko uporno da pecka.'
      ],
      firstVisitEffects: { items: ['🪶 Pero koje pokazuje'] },
      choices: [ { text: 'Prati pero.', to: 'thornway' } ]
    },

    market_haggle: {
      title: 'Nikad prva cena',
      text: [
        '„To vam je prva cena“, kažeš. „Saslušaću drugu.“',
        'Svaki gavran na pijaci utihne, a onda prasne u aplauz, što kod gavrana znači da ti bacaju sitne sjajne stvarčice u glavu.',
        '„*Profesionalac*,“ kaže glavni gavran, istovremeno zgađen i impresioniran. Dobijaš mapu-pero za jedno dugme, plus izvinjenje u boci „za kad ti zatreba, a hoće“.'
      ],
      firstVisitEffects: { items: ['🪶 Pero koje pokazuje', '🍾 Izvinjenje u boci'], stats: { cunning: 1 } },
      choices: [ { text: 'Prati pero.', to: 'thornway' } ]
    },

    market_token: {
      title: 'Prijatelj mosta',
      text: [
        'Podigneš trolov žeton. Prsluci se zatežu. Kljunovi se spuštaju.',
        '„Prijatelj mosta“, kaže glavni gavran. „Onda nema naplate; tom velikom vlažnom idiotu dugujemo sve.“ Mapa-pero spušta se u tvoju ruku zajedno s upozorenjem, izrečenim tiho:',
        '„Nešto je večeras prošlo ovuda, a nema ime koje bi moglo da menja. Lovi glas. Idi meko.“'
      ],
      firstVisitEffects: { items: ['🪶 Pero koje pokazuje'], stats: { kindness: 1 }, flags: { hushKnown: true } },
      choices: [ { text: 'Idi meko. Prati pero.', to: 'thornway' } ]
    },

    market_stolen: {
      title: 'Kartografija sa pet prstiju',
      text: [
        'Uzimaš pero dok se dva gavrana raspravljaju da li se mesec računa kao novčić. Ispostavlja se da ne računa, a rasprava je strašno glasna.',
        'Tri koraka si daleko kad glavni gavran sasvim mirno dovikne za tobom: „Dobro. Ali pijaca se uvek naplati, dete. Uzećemo kasnije, a mi biramo kada.“',
        'To je nekako mnogo gore nego da su te uhvatili.'
      ],
      firstVisitEffects: { items: ['🪶 Pero koje pokazuje'], flags: { crowDebt: true }, stats: { cunning: 1 } },
      choices: [ { text: 'Odlazi brzo.', to: 'thornway' } ]
    },

    market_caught: {
      title: 'Gavrani ne promašuju',
      text: [
        'Četrdeset kljunova se odjednom okrene. Precizno te kljucnu, bez prave zlobe, pa te okače za kragnu o tezgu od kišobrana dok se ne izviniš.',
        'Izviniš se. Glavni gavran uzdahne i ipak ti da pero. „Nosi. Sramotiš se.“ Svi gavrani se slažu da je to bilo najsmešnije što se na pijaci dogodilo godinama.'
      ],
      firstVisitEffects: { items: ['🪶 Pero koje pokazuje'] },
      choices: [ { text: 'Iskradaj se niz trnovitu stazu.', to: 'thornway' } ]
    },

    thornway: {
      title: 'Trnoviti put',
      text: [
        'Pero te vuče niz hodnik od crnog trnja u koji mesečina mora da se ugura postrance.',
        'Na pola puta šuma postaje *tiha* — ne nema, nego prigušena, kao da je nečija ruka prekrila usta sveta. Tvoji koraci prestaju da prave zvuk. Tvoj dah prestaje da pravi zvuk.',
        'Nešto hoda kraj tebe, prati tvoj korak u stopu, a ima više nogu nego što je za to potrebno.'
      ],
      choices: [
        { text: 'Sažvaći mostnu mahovinu i vidi istinski.', to: 'hush_seen', needItem: '🌿 Mostna mahovina', effects: { lose: ['🌿 Mostna mahovina'] } },
        { text: 'Pozvoni Barnabijevim zvonom u tišinu.', to: 'hush_bell', needItem: '🔔 Barnabijevo zvono' },
        { text: 'Trči. Samo trči.',
          roll: { stat: 'courage', dc: 9, success: 'witch_hut', fail: 'hush_caught', failEffects: { stats: { health: -2 } } } },
        { text: 'Stoj savršeno mirno i budi vrlo, vrlo dosadan.',
          roll: { stat: 'cunning', dc: 8, success: 'witch_hut', fail: 'hush_caught', failEffects: { stats: { health: -1 } } } }
      ]
    },

    hush_seen: {
      title: 'Tiho-stvar',
      text: [
        'Mahovina ima ukus kao bara koja se izvinjava, a onda možeš da je *vidiš*: visoko, presavijeno, osluškujuće stvorenje napravljeno od prostora između zvukova, okićeno ukradenim glasovima kao narukvicom sa privescima.',
        'Primeti da si ga primetio. Ispostavlja se da je to jedina stvar koju nikako ne podnosi. Trzne se, malo se rasplete i klizne između trnja — ka mestu gde je, shvataš uz trzaj u stomaku, Mimi.'
      ],
      firstVisitEffects: { flags: { hushKnown: true, hushSeen: true }, stats: { courage: 1 } },
      choices: [ { text: 'Juri za njim.', to: 'witch_hut' } ]
    },

    hush_bell: {
      title: 'Zvuk koji ne može da proguta',
      text: [
        'Pozvoniš malim mesinganim zvonom. Tišina pokuša da proguta zvuk i ne uspe — zvonom je jedan dečak zvao svoju mačku na čaj šezdeset godina, a takva zvonjava ima *korenje*.',
        'Tiho-stvar ustukne i ispusti tri ukradena glasa, koji šmugnu u žbunje da pronađu svoje vlasnike. Jedan od njih, na trenutak, zvuči tačno kao mačka koja izgovara tvoje ime.'
      ],
      firstVisitEffects: { flags: { hushKnown: true, bellWorks: true }, stats: { courage: 1 } },
      choices: [ { text: 'Prati glas koji je zvučao kao ona.', to: 'witch_hut' } ]
    },

    hush_caught: {
      title: 'Uzme ti nešto',
      text: [
        'Hladnoća se sklapa oko tebe. Nešto dugo i pažljivo prolazi kroz tvoje džepove, a onda kroz tvoje *misli*, i uzima zvuk tvog sopstvenog smeha — osetiš kako odlazi, kao kad ispadne zub.',
        'Onda ode, dosađeno, jer ti nisi ono što želi. Ležiš u trnju dok ponovo ne možeš da se pomeriš, a šuma polako vraća svoje zvuke.',
        'Trebaće ti taj smeh. Odlučuješ, ležeći tu, da ćeš ga uzeti nazad.'
      ],
      firstVisitEffects: { flags: { laughStolen: true, hushKnown: true }, stats: { courage: 1 } },
      choices: [ { text: 'Ustani. Nastavi dalje.', to: 'witch_hut' } ]
    },

    witch_hut: {
      title: 'Bramblvikina čajna koliba',
      text: [
        'Koliba stoji na panju drveta koje je moralo biti veliko kao katedrala. Dim izlazi iz dimnjaka u obliku malih, zadovoljnih životinja.',
        'Veštica unutra je otprilike godina tvoje mame, sva u mačjoj dlaci, i nimalo nije iznenađena što te vidi. „Aha“, kaže Bramblvik. „Ti si njen. Priča o tebi.“',
        'Sipa tri šolje ne pitajući te koju želiš.'
      ],
      choices: [
        { text: '„Ona PRIČA o meni?“', to: 'witch_talk' },
        { text: 'Popij crvenu šolju (hrabrost).', to: 'tea_red', effects: { stats: { courage: 2 } } },
        { text: 'Popij zelenu šolju (oštrina).', to: 'tea_green', effects: { stats: { cunning: 2 } } },
        { text: 'Popij zlatnu šolju (toplina).', to: 'tea_gold', effects: { stats: { kindness: 2, health: 2 } } }
      ]
    },

    witch_talk: {
      title: 'Šta Mimi govori o tebi',
      text: [
        '„Stalno“, kaže Bramblvik. „Mačke imaju dva doma: jedan gde ih hrane i drugi gde su *potrebne*. Tvoja Mimi je Čuvarka Šuplje šume — još od pre nego što si se rodio — i nijednom nije začepila o detetu s hladnim stopalima.“',
        'Promeša lonac. „Večeras je prošla ovuda u žurbi, noseći nešto. A za njom je prošlo i nešto što nema sopstveni glas. Popij čaj, pa idi i budi od koristi.“'
      ],
      firstVisitEffects: { flags: { knowsWarden: true }, stats: { kindness: 1 } },
      choices: [
        { text: 'Popij crvenu šolju (hrabrost).', to: 'tea_red', effects: { stats: { courage: 2 } } },
        { text: 'Popij zelenu šolju (oštrina).', to: 'tea_green', effects: { stats: { cunning: 2 } } },
        { text: 'Popij zlatnu šolju (toplina).', to: 'tea_gold', effects: { stats: { kindness: 2, health: 2 } } }
      ]
    },

    tea_red: {
      title: 'Crveni čaj',
      text: ['Ima ukus cimeta i onog osećaja kad se uspraviš pred nekim većim od sebe. Ruke prestaju da ti drhte. Bramblvik klimne i pruži ti grančicu jarebike „za kucanje“.'],
      firstVisitEffects: { items: ['🌾 Grančica jarebike'] },
      choices: [ { text: 'Izađi u mrak, ka Dvoru.', to: 'hollow_tree' } ]
    },
    tea_green: {
      title: 'Zeleni čaj',
      text: ['Ima ukus koprive i trenutka tik pre nego što razumeš šalu. Sve postaje oštrije; primećuješ da koliba ima trinaest mačjih vratanca, a jedna se još njišu.'],
      firstVisitEffects: { items: ['🌾 Grančica jarebike'], flags: { hint: true } },
      choices: [ { text: 'Izađi u pravcu vratanca koja se njišu.', to: 'hollow_tree' } ]
    },
    tea_gold: {
      title: 'Zlatni čaj',
      text: ['Ima ukus kao kad te neko lepo ušuška. Ogrebotine se zatvaraju. Bramblvik ti dospe još, a onda napuni malu flašicu „za nešto maleno čemu će trebati više nego tebi“.'],
      firstVisitEffects: { items: ['🌾 Grančica jarebike', '🍼 Topla flašica'] },
      choices: [ { text: 'Izađi, topao, u hladnoću.', to: 'hollow_tree' } ]
    },

    /* ---------- Act IV: The Court of the Ninefold Hearth ---------- */

    hollow_tree: {
      title: 'Šuplje drvo',
      text: [
        'Pero prestaje da vuče kod mrtvog hrasta veličine crkve, rascepljenog s jedne strane. Zvezdani otisci šapa ulaze unutra. Nijedan ne izlazi.',
        'Iznutra dopire zvuk mnogih mačaka koje su strašno tihe, a to je najglasnija tišina koja postoji.'
      ],
      choices: [
        { text: 'Prvo proveri iza šupljeg drveta.', to: 'behind_tree', onlyFlag: 'hint' },
        { text: 'Pokucaj grančicom jarebike.', to: 'court_gate', needItem: '🌾 Grančica jarebike' },
        { text: 'Samo se uvuci.', to: 'court_gate' }
      ]
    },

    behind_tree: {
      title: 'Iza šupljeg drveta',
      text: [
        'Iza drveta, u udubljenju od mahovine, nalazi se gnezdo: tri parčeta ćebeta, izgrižen čep od flaše i jedno veoma malo, veoma sivo mače sa belom čarapicom, koje drhti i strašno se ljuti zbog toga.',
        'Sikće na tebe celim telom. Veličine je zemičke. I nepogrešivo je Miminо.'
      ],
      firstVisitEffects: { flags: { foundKitten: true } },
      choices: [
        { text: 'Daj mu toplu flašicu.', to: 'kitten_flask', needItem: '🍼 Topla flašica' },
        { text: 'Zadeni ga u gornji deo pidžame i ponesi sa sobom.', to: 'kitten_carry' },
        { text: 'Ostavi ga sakrivenog — bezbednije je nego da ide s tobom.', to: 'court_gate', effects: { flags: { kittenLeft: true } } }
      ]
    },

    kitten_flask: {
      title: 'Zemička, nahranjena',
      text: [
        'Mače popije celu flašicu, pa zaspi usred siktanja, što je najsmešnija stvar koju si ikad video. Osetiš kako tvoj ukradeni smeh pokušava da se vrati odakle god da je otišao.',
        'Utakneš toplu grudvicu u pidžamu. Prede kao veoma mali motor sa kvarom.'
      ],
      firstVisitEffects: { items: ['🐈 Uspavano mače'], lose: ['🍼 Topla flašica'], stats: { kindness: 1 }, flags: { hasKitten: true } },
      choices: [ { text: 'Ka Dvoru.', to: 'court_gate' } ]
    },

    kitten_carry: {
      title: 'Mali, besni teret',
      text: [
        'Izujeda te jedanaest puta, sve namerno, nijednom prejako. Onda odustane i zavuče se pod tvoju bradu, i dalje gunđajući.',
        'Nikad u životu nisi nosio nešto pažljivije.'
      ],
      firstVisitEffects: { items: ['🐈 Uspavano mače'], stats: { kindness: 1 }, flags: { hasKitten: true } },
      choices: [ { text: 'Ka Dvoru.', to: 'court_gate' } ]
    },

    court_gate: {
      title: 'Kapija devet brkova',
      text: [
        'Unutrašnjost drveta nije unutrašnjost drveta. To je dvorana korenja i vatre, devet ognjišta gori u krugu, a mačke — stotine mačaka — raspoređene su tačno na mestima najveće moguće smetnje.',
        'Dva ogromna čuvara na vratima, jedan riđ i jedan potpuno odsutan osim po osmehu, zaklanjaju prolaz.',
        '„Kaži svoj posao, toplo stvorenje“, kaže riđi.'
      ],
      choices: [
        { text: 'Pozvoni Barnabijevim zvonom.', to: 'gate_bell', needItem: '🔔 Barnabijevo zvono', hideWhenLocked: false },
        { text: 'Pokaži uspavano mače.', to: 'gate_kitten', needItem: '🐈 Uspavano mače' },
        { text: '„Došao sam po svoju mačku.“',
          roll: { stat: 'courage', dc: 9, success: 'court', fail: 'gate_thrown', failEffects: { stats: { health: -1 } } } },
        { text: 'Ponudi da te prvo češkaju iza ušiju, kao danak.',
          roll: { stat: 'kindness', dc: 8, success: 'court', fail: 'gate_thrown' } }
      ]
    },

    gate_bell: {
      title: 'Zvonjava koja zvuči pogrešno',
      text: [
        'Pozvoniš zvonom i ono zazvuči *pogrešno* — preveliko, previše zlatno, zvuk katedrale iz naprstka.',
        'Sve mačke u dvorani ustanu odjednom. Riđi stražar se pokloni toliko nisko da mu brkovi pometu korenje. „Barnabijevo zvono“, dahne. „Samo Čuvarkino. Prođi, dete. Brzo. Raspravlja se već sat vremena i gubi.“'
      ],
      firstVisitEffects: { stats: { courage: 1 } },
      choices: [ { text: 'Prođi.', to: 'court' } ]
    },

    gate_kitten: {
      title: 'Teretna diplomatija',
      text: [
        'Rasčepiš gornji deo pidžame za jedan prst. Jedno sivo uho, jedna bela čarapica, jedno ogromno zevanje.',
        'Dvorana proizvede zvuk koji nijedan čovek nikad nije čuo: trista mačaka koje kažu *oh*. Stražari se sklanjaju toliko brzo da nevidljivi zaboravi da zadrži osmeh.'
      ],
      choices: [ { text: 'Unesi naslednika unutra.', to: 'court' } ]
    },

    gate_thrown: {
      title: 'Napolje, pa unutra',
      text: [
        'Iz dvorane te ukloni devet mačaka koje rade usklađeno kao profesionalna selidbena firma, spuste te u mahovinu i pilje u tebe.',
        'Onda se iznutra začuje mali glas koji kaže nešto kratko i oštro, pa se stražari ukrute, a riđi promrmlja: „Dobro. *Dobro.* Čuvarka traži tebe.“'
      ],
      choices: [ { text: 'Vrati se unutra uzdignute brade.', to: 'court' } ]
    },

    court: {
      title: 'Dvor devetostrukog ognjišta',
      text: [
        'Na stolici načinjenoj od jedne ogromne fosilizovane kosti sedi Kraljica mačaka: bela, drevna, s očima poput dva novčića na dnu bunara.',
        'A nasred poda, mala i crna i besna, sa belom čarapicom i jednim pocepanim uhom, stoji *Mimi*.',
        '„Eto te“, kaže Mimi glasom za koji nekako oduvek znaš da ga je imala. „Baš ti je trebalo. I još nešto: ne paniči.“'
      ],
      choices: [
        { text: '„TI ZNAŠ DA GOVORIŠ?“', to: 'mochi_talk' },
        { text: 'Uhvati te panika.', to: 'mochi_talk' }
      ]
    },

    mochi_talk: {
      title: 'Ne paniči',
      text: [
        '„Svi umeju da govore“, kaže Mimi. „Neki od nas biraju da kod kuće ne govore, jer bi to sve pokvarilo.“',
        'Kraljica progovori i ognjišta potamne. „Čuvarka je napustila svoju dužnost da sakrije mače, a Tiho-stvar je kroz tanko mesto prošlo za njom. Zakon je star: Čuvarka koja pobegne biva *razobličena*, a njen glas dat tišini da ga ponese kući.“',
        'Mimi te ne gleda. Rep joj je sasvim miran. Tako znaš koliko je uplašena.'
      ],
      choices: [
        { text: '„Onda uzmite moj umesto njenog.“', to: 'trial_offer' },
        { text: '„Dajte mi iskušenje. Otplatiću njen dug.“', to: 'trials' },
        { text: '„Tiho-stvar mi je već uzelo smeh. Hajde da ga vratimo.“', to: 'trials', needFlag: 'laughStolen' },
        { text: 'Ne reci ništa i podigni mače.', to: 'kitten_evidence', needItem: '🐈 Uspavano mače' }
      ]
    },

    kitten_evidence: {
      title: 'Dokaz broj jedan: zemička',
      text: [
        'Podigneš mače. Ono se probudi, pogleda trista mačaka i jednu kraljicu, pa zine pravo u lice kraljevstvu.',
        'Drevne oči Kraljice se suze. „Doneo si naslednicu *ovamo*? Dok je tišina puštena po šumi?“ Duga tišina. „...Pa ipak, doneo si je toplu, nahranjenu i nošenu.“',
        '„Dete može da stane na Iskušenje umesto Čuvarke. Tri provere. Ako sve tri padneš, zadržaću vas oboje.“'
      ],
      firstVisitEffects: { stats: { kindness: 1 }, flags: { royalFavour: true } },
      choices: [ { text: 'Stani na Iskušenje.', to: 'trials' } ]
    },

    trial_offer: {
      title: 'Ponuda kakvu Dvor nije očekivao',
      text: [
        'Dvorana utihne toliko da možeš da čuješ kako devet vatri razmišlja.',
        '„Čovek nudi glas za mačku“, kaže Kraljica polako. „To se nije desilo šest stotina godina. Poslednji put je prošlo *vrlo* dobro, i još se nismo sasvim oporavili od sramote.“',
        '„Ne. Nećeš dati glas. Proći ćeš Iskušenje: hrabrost, lukavost, dobrota. Prođi koliko možeš. Onda ćemo videti koliko vrediš.“'
      ],
      firstVisitEffects: { stats: { courage: 1 }, flags: { royalFavour: true } },
      choices: [ { text: 'Stani na Iskušenje.', to: 'trials' } ]
    },

    trials: {
      title: 'Iskušenje tri šape',
      text: [
        'Kraljica podigne jednu šapu i pod dvorane se otvori u tri vrata puna ognja.',
        '„Uđi u svaka. Uzmi ono što nađeš. Onda idemo u lov, a trebaće ti sve to.“',
        'Mimi, prolazeći kraj tebe, čelom gurne tvoj članak baš onako kako to radi kod kuće kad je činija prazna. To je najhrabrija stvar koju si ikad osetio.'
      ],
      choices: [
        { text: 'Vrata vatre — hrabrost.', to: 'trial_courage', notFlag: 'tCourage' },
        { text: 'Vrata ogledala — lukavost.', to: 'trial_cunning', notFlag: 'tCunning' },
        { text: 'Vrata pepela — dobrota.', to: 'trial_kindness', notFlag: 'tKind' },
        { text: 'Objavi da si spreman i kreni u lov na Tiho-stvar.', to: 'hunt' }
      ]
    },

    trial_courage: {
      title: 'Vrata vatre',
      text: [
        'Iza njih: hodnik ognjišne vatre, a na kraju jedan žar na postolju. Pravilo ne izgovara niko, a svi ga razumeju: *hodaj, ne trči.*'
      ],
      effects: { flags: { tCourage: true } },
      choices: [
        { text: 'Prođi kroz vatru.',
          roll: { stat: 'courage', dc: 8, success: 'trial_c_win', fail: 'trial_c_fail', failEffects: { stats: { health: -1 } } } }
      ]
    },
    trial_c_win: {
      title: 'Žar uzet',
      text: ['Hodaš. Plamen liže, ali ne ujeda. Podigneš žar i on ti sedi u dlanu kao namrgođena mačka, topao i sasvim miran. Negde iza tebe trista mačaka uglas kaže *hm*.'],
      firstVisitEffects: { items: ['🔥 Žar iz ognjišta'], stats: { courage: 1 } },
      choices: [ { text: 'Nazad do trojih vrata.', to: 'trials' } ]
    },
    trial_c_fail: {
      title: 'Potrčao si',
      text: ['Na pola puta tvoja hrabrost proračuna verovatnoću i ti potrčiš. Vatra je više razočarana nego ljuta; sprži ti obrve za uspomenu. Žar ostaje na svom postolju, samodovoljno užaren.'],
      choices: [ { text: 'Nazad do trojih vrata, bez obrva.', to: 'trials' } ]
    },

    trial_cunning: {
      title: 'Vrata ogledala',
      text: [
        'Devet ogledala. U osam njih ti tražiš svoju mačku. U jednom od njih tvoja mačka traži tebe.',
        'Moraš brzo da odabereš ono drugačije, jer se ogledala mešaju kao trik s kartama koji izvodi neko sa previše šapa.'
      ],
      effects: { flags: { tCunning: true } },
      choices: [
        { text: 'Prati neobično ogledalo.',
          roll: { stat: 'cunning', dc: 8, success: 'trial_m_win', fail: 'trial_m_fail' } },
        { text: 'Zatvori oči i umesto toga oslušni predenje.',
          roll: { stat: 'kindness', dc: 9, success: 'trial_m_win', fail: 'trial_m_fail' } }
      ]
    },
    trial_m_win: {
      title: 'Nađeno u pogledu',
      text: ['Lupiš dlanom pravo ogledalo. Ono prsne u hladnu svetlost koja ti se sakuplja u džepu kao krhotina koja pokazuje stvari onakve kakve zaista jesu — uključujući, kad je krišom pogledaš, jedan dugi presavijeni oblik koji vreba na ivici dvorane. Već je ovde.'],
      firstVisitEffects: { items: ['🪞 Krhotina istine'], stats: { cunning: 1 }, flags: { hushHere: true } },
      choices: [ { text: 'Nazad do vrata, sad brže.', to: 'trials' } ]
    },
    trial_m_fail: {
      title: 'Osam pogrešnih pokušaja',
      text: ['Biraš pogrešno, pa pogrešno, pa opet pogrešno. Ogledala se smeju glasom mačke koja je gurnula čašu sa stola. Odlaziš bez ičega osim snažnog osećaja da si bio *procenjen*.'],
      choices: [ { text: 'Nazad do vrata.', to: 'trials' } ]
    },

    trial_kindness: {
      title: 'Vrata pepela',
      text: [
        'Hladna soba, mrtvo ognjište i jedna veoma stara mačka koja leži u pepelu — slepa, mršava, drhtava i odavno iznad toga da je briga ko gleda.',
        'Ovde nema ničega što bi se osvojilo. Naravno, upravo je to ispit.'
      ],
      effects: { flags: { tKind: true } },
      choices: [
        { text: 'Ugrej staru mačku žarom iz ognjišta.', to: 'trial_k_ember', needItem: '🔥 Žar iz ognjišta' },
        { text: 'Skini gornji deo pidžame i umotaj je u njega.', to: 'trial_k_win' },
        { text: 'Sedi i mazi je dok ne prestane da drhti.', to: 'trial_k_win' },
        { text: 'Odi — imaš svoju mačku koju treba spasiti.', to: 'trial_k_leave' }
      ]
    },
    trial_k_ember: {
      title: 'Ognjište ponovo gori',
      text: [
        'Staviš žar u mrtvo ognjište. On plane zvukom sličnim predenju i soba se napuni svetlošću.',
        'Stara mačka otvori mlečne oči. „Oh“, kaže. „Tako je bolje. Ti si onaj sa hladnim stopalima.“ Spusti čelo na tvoje zglobove i nešto toplo i tvrdoglavo nastani ti se u grudima, nešto što nikakva tišina nikad neće moći da pojede.'
      ],
      firstVisitEffects: { items: ['💛 Toplota koja se ne može pojesti'], lose: ['🔥 Žar iz ognjišta'], stats: { kindness: 2, health: 1 }, flags: { blessed: true } },
      choices: [ { text: 'Nazad do vrata.', to: 'trials' } ]
    },
    trial_k_win: {
      title: 'Ništa za osvojiti',
      text: [
        'Sediš u pepelu, u hladnoj sobi, sa neznancem koji umire, i radiš jedinu korisnu stvar koja postoji, a to je da ostaneš.',
        'Posle nekog vremena drhtanje prestane. „Dobar“, promrmlja stara mačka. „Dobrotu jedinu nikad ne troše.“ Izdiše srebrnu nit koja ti se dvaput obavije oko ručnog zgloba i ostane tu.'
      ],
      firstVisitEffects: { items: ['🧵 Srebrna nit'], stats: { kindness: 2 }, flags: { blessed: true } },
      choices: [ { text: 'Nazad do vrata.', to: 'trials' } ]
    },
    trial_k_leave: {
      title: 'Odlaziš',
      text: ['Odlaziš. To je razuman izbor i sedi ti u stomaku kao progutan kamen do kraja noći. Iza tebe, drhtanje se nastavlja.'],
      firstVisitEffects: { stats: { kindness: -1 }, flags: { coldChoice: true } },
      choices: [ { text: 'Nazad do vrata.', to: 'trials' } ]
    },

    /* ---------- Act V: The Hunt ---------- */

    hunt: {
      title: 'Tišina dolazi sama',
      text: [
        'Ne moraš da ideš u lov. Dvorana utihne — ona pogrešna tišina, prigušena vrsta — i svako ognjište zatreperi odjednom.',
        'Tiho-stvar se razmotava između dve vatre: visoko, osluškujuće, okićeno ukradenim glasovima kao zvečkom od tuđih reči. Jedan od tih glasova je tvoj smeh.',
        'Pruža se ka Mimi, koja stoji čvrsto ispred trista utišanih mačaka, jer tako radi Čuvarka.'
      ],
      choices: [
        { text: 'Pozvoni Barnabijevim zvonom — zvukom sa korenjem.', to: 'end_bell', needItem: '🔔 Barnabijevo zvono' },
        { text: 'Podigni krhotinu istine i *vidi* je.', to: 'end_shard', needItem: '🪞 Krhotina istine', hideWhenLocked: false },
        { text: 'Stani ispred Mimi.',
          roll: { stat: 'courage', dc: 9, success: 'end_shield_win', fail: 'end_shield_fail', failEffects: { stats: { health: -2 } } } },
        { text: 'Obrati joj se blago. Pitaj je šta je izgubila.',
          roll: { stat: 'kindness', dc: 8, success: 'end_ask_win', fail: 'end_shield_fail', failEffects: { stats: { health: -1 } } } }
      ]
    },

    end_bell: {
      title: 'Zvuk sa korenjem',
      text: [
        'Pozvoniš zvonom i ovog puta zazvoni ceo Dvor s njim — devet ognjišta, trista grla, šezdeset godina jednog starca koji zove jednu staru mačku kući na čaj.',
        'Tiho-stvar to ne može da proguta. Raspline se kao magla na prozoru i svaki ukradeni glas prsne slobodan i pojuri svom vlasniku. Tvoj smeh te udari u grudi i još se smeješ kad ognjišta opet planu.',
        'Kraljica pažljivo spusti glavu za jedan jedini pedalj. „Dug je plaćen, a šuma je tiša zbog toga.“'
      ],
      choices: [ { text: 'Okreni se ka Mimi.', to: 'aftermath' } ]
    },

    end_shard: {
      title: 'Viđena',
      text: [
        'Podigneš krhotinu i *pogledaš* je — zaista, onako kako je niko nikad nije pogledao — pa kažeš sasvim glasno: „Vidim te.“',
        'Ona stane. Biti viđena jedina je stvar koju tišina ne može da preživi. Sklapa se u sve manju i manju, ispuštajući glasove usput, dok od nje ne ostane malo sivo stvorenje veličine moljca, koje odleprša u korenje da iz ničega počne iznova.',
        'Tvoj smeh se vraća poslednji, pomalo postiđeno, kao pas koji je odlutao u parku.'
      ],
      choices: [ { text: 'Okreni se ka Mimi.', to: 'aftermath' } ]
    },

    end_shield_win: {
      title: 'Ispred',
      text: [
        'Staneš između tišine i mačke, u donjem delu pidžame, sa jednom papučom, i kažeš „ne“.',
        'Zgrabi te i pronađe — na svoju ogromnu zbunjenost — da u tebi nema ničega vrednog jedenja: nimalo tišine, samo topla bučna zbrka od deteta koje svojoj mački priča baš sve.',
        'Pusti te, uvređeno, i pobegne iz dvorane. Dvor eksplodira u najnedostojnije navijanje u poslednjih devet stotina godina.'
      ],
      firstVisitEffects: { stats: { courage: 1 } },
      choices: [ { text: 'Okreni se ka Mimi.', to: 'aftermath' } ]
    },

    end_shield_fail: {
      title: 'Nije dovoljno, sam',
      text: [
        'Nisi dovoljno brz, ni dovoljno glasan, i hladnoća se sklapa oko tebe —',
        '— a onda iz tvog gornjeg dela pidžame / iz korenja izleće veoma mala siva prilika sa belom čarapicom i sikće na Tiho-stvar sa svih svojih dvesta grama.',
        'Ceo Dvor sikće s njom. Trista mačaka. Devet ognjišta. Jedno dete na podu koje se pridružuje s onim što mu je ostalo od glasa. Tišina ne može da pojede buku toliku. Rasplete se i pobegne.'
      ],
      choices: [ { text: 'Uspravi se, dok ti zuji u ušima.', to: 'aftermath' } ]
    },

    end_ask_win: {
      title: 'Šta si izgubila?',
      text: [
        'Učiniš nešto što niko devet stotina godina nije pokušao. Sedneš na pod Dvora, pogledaš nagore u visoku presavijenu tišinu i pitaš: „Šta si *ti* izgubila?“',
        'Ona stane. Polako, među ukradenim glasovima, izađe jedan mali, napukao i njen sopstveni: *„Sve. Bila sam ognjište. Niko nije sedeo kraj mene.“*',
        'Pa ga ponovo potpališ — žarom, niti umotane drhtave stare mačke, ili samo time što se primakneš i napraviš mesta. Tiho-stvar postane deseta vatra u Dvoru devetostrukog ognjišta, gori veoma tiho, i svaki glas koji je uzela vrati se kući.'
      ],
      firstVisitEffects: { stats: { kindness: 1 }, flags: { tenthHearth: true } },
      choices: [ { text: 'Okreni se ka Mimi.', to: 'aftermath' } ]
    },

    aftermath: {
      title: 'Mačje svođenje računa',
      text: [
        'Kraljica mačaka dugo, dugo te posmatra.',
        '„Dug Čuvarke platilo je ljudsko dete u pidžami“, kaže. „Dvor je ponižen, a ja sam, u sebi, oduševljena. Čuvarko Mimi: oslobođena si. Biraj.“',
        'Mimi pogleda devet ognjišta, svoje mače, šumu koju je čuvala još pre nego što si se rodio. Onda tebe.',
        '„Dobro“, kaže. „Onda me pitaj. Kako treba.“'
      ],
      choices: [
        { text: '„Dođi kući. Molim te.“', to: 'end_home' },
        { text: '„Ostani. Ovo je tvoja šuma. Dolaziću svake Šuplje noći.“', to: 'end_stay' },
        { text: '„Dođi kući — i povedi mače. I posao. Snaći ćemo se.“', to: 'end_both', needFlag: 'foundKitten' },
        { text: '„Mogu li ja da ostanem ovde s tobom?“', to: 'end_wild' }
      ]
    },

    /* ---------- Endings ---------- */

    end_home: {
      title: 'Kraj: Udubljenje u jorganu',
      text: [
        '„Naravno“, kaže Mimi i izađe iz Dvora devetostrukog ognjišta ne osvrćući se, uzdignutog repa, kao da joj mesto pripada — što se, ispostavlja se, zapravo donekle i dešava.',
        'Izlazite kroz živicu u četiri ujutru. Pusti ti da je nosiš onaj poslednji komadić puta, što ti nikad ranije nije dopustila.',
        'Ujutru na jorganu ima udubljenje, a u njemu mačka, i ne kaže nijednu jedinu reč — ne za doručkom, ne nikad više, ne tamo gde bi iko mogao da čuje. Ali kad kažeš „Znam šta si“, ona ti polako trepne, što na mačjem znači *da*, a takođe i *nemoj nikom da kažeš*.'
      ],
      ending: true,
      choices: []
    },

    end_stay: {
      title: 'Kraj: Stalni poziv',
      text: [
        'To je najteža rečenica koju si ikad izgovorio i uspeš da je izneseš a da ti glas ne pukne.',
        'Mimi dugo ćuti. „To“, kaže, „je najdobrotnija stvar koju je iko ikada učinio za mene, i tu računam i ono kad si mi dao celu svoju piletinu za večeru.“',
        'Ona ostaje. Ti odlaziš kući sa praznim jorganom — ali svake sledeće Šuplje noći živica udahne i otvori se, a mala crna mačka sa belom čarapicom čeka s druge strane sa celom godinom novosti, i ti si jedina osoba na svetu koja sme da sluša mačje tračeve.'
      ],
      ending: true,
      choices: []
    },

    end_both: {
      title: 'Kraj: Dve mačke, jedna Čuvarka, bez objašnjenja',
      text: [
        '„Oboje“, kažeš. „Sve to. Mače, posao, sve. Imamo baštu i živicu koja se otvara jednom godišnje, a ja *strašno* dobro čuvam tajne.“',
        'Kraljica mačaka pusti zvuk koji bi mogao biti smeh, a mogao bi biti i problem sa plućima. „Mesto Čuvarke, vođeno iz *prizemnice*“, kaže. „Neka bude. Ovaj vek je bio užasno dosadan.“',
        'Kući stižeš u zoru sa mačkom pod jednom rukom i zemičkom pod bradom. Roditeljima se kaže da je bilo jedno napušteno mače. Svi odluče da u to poveruju. U Šupljim noćima tvoj prozor spavaće sobe ostaje otvoren, a cela šuma zna put.'
      ],
      ending: true,
      choices: []
    },

    end_wild: {
      title: 'Kraj: Dete koje je ostalo do jutra',
      text: [
        '„Ne“, kaže Mimi blago, pre nego što Kraljica stigne da odgovori. „Nipošto. Imaš školu.“',
        'Ali pusti te da ostaneš do svitanja, a Dvor — koji su, ispod svega, ipak mačke — te sate provodi sedeći na tebi, svi oni, u smenama, predući, što je najbliže viteštvu što Šuplja šuma nudi.',
        'Kući se vraćaš u izlazak sunca, topao, prekriven dlakom, sa vraćenim smehom i malom sivom senkom koja ti prati pete, i sa stalnim sastankom sa šumom koja će se za tebe uvek, uvek otvoriti.'
      ],
      ending: true,
      choices: []
    },

    faint: {
      title: 'Kraj: Šuma te zadrži još malo',
      text: [
        'Noge te izdaju. Mahovina se podigne da te dočeka, a mnogo je mekša nego što mahovina ima ikakvo pravo da bude.',
        'Budiš se u podne u sopstvenoj bašti, suv, topao, sa zavijenim ogrebotinama u paučinu i moljčevu svilu, i bez mačke.',
        'Na jastuku pored tebe: jedno mesingano zvonce, jedno sivo mače sa belom čarapicom i poruka ispisana paučastom rukom: *„Ostaje da to dovrši. Šalje malenu. Kaže da si bio sjajan, i da pojedeš nešto.“* Sledeće Šuplje noći bićeš spreman. Imaš celu godinu da postaneš hrabriji.'
      ],
      ending: true,
      choices: []
    }
  }
};
