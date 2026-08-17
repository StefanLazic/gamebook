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
      title: 'A Cat-Shaped Hole',
      text: [
        'Mochi has been gone since the moon came up, and the moon is now very high indeed.',
        'You are eleven years old, you are still in your pyjama trousers, and you have exactly one plan: find your cat before the village wakes and everybody says the word *probably*.',
        'Her food bowl is untouched. The dent in your quilt where she sleeps is cold. On the porch step there is a single sooty pawprint that glitters faintly, like someone spilled a star and swept it up badly.'
      ],
      choices: [
        { text: 'Grab supplies from the garden shed first.', to: 'shed' },
        { text: 'Knock on Mrs. Pell\u2019s door \u2014 she never sleeps.', to: 'pell' },
        { text: 'Follow the glittering prints straight into the garden.', to: 'garden' }
      ]
    },

    shed: {
      title: 'The Shed of Useful Rubbish',
      text: [
        'The shed smells of tomato leaves and old rain. You take the tin lantern with the wobbly handle, and a strip of dried fish from the packet Dad hides from you.',
        'On the way out you nearly trip over the garden spade, which is *definitely* not where you left it. The soil beneath the shed door has been dug up from the inside.'
      ],
      firstVisitEffects: { items: ['🏮 Tin Lantern', '🐟 Fish Jerky'], flags: { supplied: true } },
      choices: [
        { text: 'Follow the prints into the garden.', to: 'garden' },
        { text: 'Detour to Mrs. Pell\u2019s door.', to: 'pell', notFlag: 'metPell' }
      ]
    },

    pell: {
      title: 'Mrs. Pell, Who Never Sleeps',
      text: [
        'Mrs. Pell answers before you knock. She is ninety-one and knitting something with far too many sleeves.',
        '"Black cat, white sock, opinions?" she says. "Yes. She went through the hedge at the bottom of your garden. Cats do, on Hollow Nights. Most of them come back."',
        'She presses a small brass bell into your hand. "That was my Barnaby\u2019s. Ring it where the ringing sounds *wrong*, and you\u2019ll know you\u2019ve arrived."'
      ],
      firstVisitEffects: { items: ['🔔 Barnaby\u2019s Bell'], flags: { metPell: true }, stats: { kindness: 1 } },
      choices: [
        { text: '"What\u2019s a Hollow Night?"', to: 'pell_lore' },
        { text: 'Thank her and run for the garden.', to: 'garden' }
      ]
    },

    pell_lore: {
      title: 'What Mrs. Pell Knows',
      text: [
        '"One night a year the hedges go thin," she says, "and the wood on the other side remembers it used to be bigger than the world. Cats are invited. Children are *tolerated*."',
        '"Three things keep a child safe out there: nerve, cleverness, and being genuinely nice to things with too many eyes. Take all three. Don\u2019t take shortcuts offered by anyone with a lantern brighter than yours."',
        'She goes back to her knitting. The extra sleeves, you notice, are cat-sized.'
      ],
      firstVisitEffects: { stats: { cunning: 1 }, flags: { warned: true } },
      choices: [
        { text: 'Head for the garden hedge.', to: 'garden' },
        { text: 'Swing by the shed for supplies.', to: 'shed', notFlag: 'supplied' }
      ]
    },

    garden: {
      title: 'The Hedge That Breathes',
      text: [
        'At the bottom of the garden the hawthorn hedge is doing something hedges should not do: inhaling.',
        'The pawprints march right up to a gap no wider than a cat, and stop. Through the gap you can see grass that is the wrong colour of silver, and hear a wood breathing back.',
        'The gap is cat-sized. You are, annoyingly, kid-sized.'
      ],
      choices: [
        { text: 'Wriggle through the thorny gap.',
          roll: { stat: 'cunning', dc: 7, success: 'hollowwood', fail: 'gap_fail', failEffects: { stats: { health: -1 } } } },
        { text: 'Shout Mochi\u2019s name into the dark first.', to: 'garden_shout' },
        { text: 'Go back for supplies.', to: 'shed', notFlag: 'supplied' }
      ]
    },

    garden_shout: {
      title: 'Names Carry',
      text: [
        '"MOCHI!"',
        'The wood answers in a hundred small voices, all of them saying *Mochi* back at you, politely, like a class repeating a spelling word. Somewhere far off, something enormous stops chewing to listen.',
        'You get the strong feeling you have just told the whole forest your business. On the bright side, the hedge sighs and opens a little wider, as if impressed by your rudeness.'
      ],
      firstVisitEffects: { stats: { courage: 1 }, flags: { shouted: true } },
      choices: [
        { text: 'Step through while it\u2019s wide.', to: 'hollowwood' }
      ]
    },

    gap_fail: {
      title: 'Thorns Have Opinions',
      text: [
        'The hedge takes a strip of your sleeve and a strip of you along with it. You land on the other side in a heap, stinging.',
        'A thorn, still holding your sleeve, gives it back. Politely. That is the moment your night stops being ordinary.'
      ],
      choices: [ { text: 'Stand up. Keep going.', to: 'hollowwood' } ]
    },

    /* ---------- Act II: The Hollowwood ---------- */

    hollowwood: {
      title: 'The Hollowwood',
      text: [
        'The wood on the other side is enormous and quiet and lit from below, as if the moss has been storing moonlight all summer.',
        'Mochi\u2019s starry prints run on ahead, then split \u2014 which is impossible, unless there were two of her, which you refuse to think about.',
        'Three ways: a brook of black water on stepping stones, a stone bridge with something snoring beneath it, and a ring of mushrooms where moths are dancing in a very organised manner.'
      ],
      choices: [
        { text: 'Cross the black brook.', to: 'brook', notFlag: 'didBrook' },
        { text: 'Take the bridge (and whoever is under it).', to: 'bridge', notFlag: 'didBridge' },
        { text: 'Enter the mushroom ring.', to: 'ring', notFlag: 'didRing' },
        { text: 'Follow the crow-noise deeper in.', to: 'crow_market', onlyFlag: 'wandered' }
      ]
    },

    brook: {
      title: 'The Brook That Reflects Yesterday',
      text: [
        'The water is black and shows not you but *you an hour ago*, asleep, with Mochi curled in the crook of your knees.',
        'Nine stones. The middle one is wet and grinning. Somewhere under the water, something with far too many fins is keeping time.'
      ],
      effects: { flags: { didBrook: true, wandered: true } },
      choices: [
        { text: 'Leap the stones without looking down.',
          roll: { stat: 'courage', dc: 8, success: 'brook_win', fail: 'brook_fail',
                  failEffects: { stats: { health: -1 } }, crit: 'brook_crit' } },
        { text: 'Wade instead \u2014 slow, cold, certain.', to: 'brook_wade' },
        { text: 'Back to the three ways.', to: 'hollowwood' }
      ]
    },

    brook_win: {
      title: 'Nine Stones, Nine Heartbeats',
      text: [
        'You go over the stones like someone who has done this before, and the finned thing below applauds with a sound like wet hands.',
        'On the far bank you find a glowworm sitting in a jar that has already been opened. "Took you long enough," it says. It hops into your pocket and starts glowing helpfully.'
      ],
      firstVisitEffects: { items: ['✨ Rude Glowworm'], stats: { courage: 1 } },
      choices: [ { text: 'Onward.', to: 'crow_market' } ]
    },

    brook_crit: {
      title: 'Perfect. Absolutely Perfect.',
      text: [
        'You cross so beautifully that the brook, embarrassed, briefly runs backwards.',
        'The finned thing surfaces \u2014 all whiskers and old coins \u2014 and gifts you a scale that hums when someone nearby is lying. "For the market," it burbles. "You\u2019ll want it."',
        'A rude glowworm also joins you, uninvited, from a jar on the bank.'
      ],
      firstVisitEffects: { items: ['✨ Rude Glowworm', '🐠 Truth Scale'], stats: { courage: 1 } },
      choices: [ { text: 'Onward, glowing.', to: 'crow_market' } ]
    },

    brook_fail: {
      title: 'Splash',
      text: [
        'The grinning stone was, in fact, grinning about this.',
        'You go in up to your ribs. The water is so cold it argues with you. Something enormous and finned nudges you \u2014 not unkindly \u2014 to the far bank, then vanishes with your left slipper as payment.'
      ],
      choices: [ { text: 'Squelch onward.', to: 'crow_market' } ]
    },

    brook_wade: {
      title: 'Slow and Cold',
      text: [
        'You wade. It is miserable and it works. Halfway across, the reflection of sleeping-you opens its eyes and mouths: *behind the hollow tree*.',
        'You file that away in the part of your brain that is still taking notes.'
      ],
      firstVisitEffects: { flags: { hint: true }, stats: { cunning: 1 } },
      choices: [ { text: 'Climb out and go on.', to: 'crow_market' } ]
    },

    bridge: {
      title: 'Under the Bridge, a Snore',
      text: [
        'The snoring stops. A moss troll unfolds itself from beneath the bridge \u2014 nine feet of damp granite wearing a hat of ferns.',
        '"Toll," it rumbles, and then, apologetically, "sorry, it\u2019s the job. Riddle or coin or kindness. Pick."',
        'It has, you notice, three long scratches down its nose. Fresh ones. Cat-shaped ones.'
      ],
      effects: { flags: { didBridge: true, wandered: true } },
      choices: [
        { text: 'Take the riddle.', to: 'troll_riddle' },
        { text: 'Offer the fish jerky.', to: 'troll_gift', needItem: '🐟 Fish Jerky' },
        { text: 'Ask about the scratches, and if the nose hurts.', to: 'troll_kind' },
        { text: 'Back to the three ways.', to: 'hollowwood' }
      ]
    },

    troll_riddle: {
      title: 'The Toll of Words',
      text: [
        '"I am kept by being given," says the troll. "I am broken by being told. Small creatures carry me across whole forests."',
        'Its eyes are patient. Bridges are patient. You are not, but you try.'
      ],
      choices: [
        { text: '"A promise."', to: 'troll_right' },
        { text: '"A shadow."', to: 'troll_wrong' },
        { text: '"A really good stick."', to: 'troll_wrong' },
        { text: 'Guess cleverly from context.',
          roll: { stat: 'cunning', dc: 8, success: 'troll_right', fail: 'troll_wrong' } }
      ]
    },

    troll_right: {
      title: 'Correct, Irritatingly',
      text: [
        '"Correct," sighs the troll, who enjoys collecting tolls more than giving directions. "Pass."',
        'It adds, grudgingly: "Your cat went through at moonrise. Walked like she owned the bridge. Scratched me for saying otherwise. She was carrying something in her mouth, and it was *not* a mouse."'
      ],
      firstVisitEffects: { stats: { cunning: 1 }, flags: { trollTold: true } },
      choices: [ { text: 'Cross the bridge.', to: 'crow_market' } ]
    },

    troll_wrong: {
      title: 'Wrong, Cheerfully',
      text: [
        '"No," says the troll, delighted. "Toll unpaid. But rules are rules, and rules say I only have to be *inconvenient*."',
        'It picks you up by the pyjama collar and sets you down on the far side, upside down, then the right way up, so honour is satisfied. You lose a bit of dignity and a bit of skin.'
      ],
      firstVisitEffects: { stats: { health: -1 } },
      choices: [ { text: 'Walk away with the remains of your pride.', to: 'crow_market' } ]
    },

    troll_gift: {
      title: 'Jerky Diplomacy',
      text: [
        'You hold up the fish jerky. The troll takes it with the delicacy of someone handling a jewel and eats it in a way that suggests nobody has offered it anything for two hundred years.',
        '"Kindness accepted," it says thickly. "Advice included, free: at the crow market, never take the *first* price, and never say your cat\u2019s name out loud. Names are currency there."',
        'It also hands you a lump of bridge-moss. "Chew it if the dark gets too dark."'
      ],
      firstVisitEffects: { lose: ['🐟 Fish Jerky'], items: ['🌿 Bridge Moss'], stats: { kindness: 1 }, flags: { marketTip: true } },
      choices: [ { text: 'Cross with a friend behind you.', to: 'crow_market' } ]
    },

    troll_kind: {
      title: 'Does It Hurt?',
      text: [
        'Nobody, in two centuries, has asked the troll about its nose. It sits down so hard the bridge complains.',
        '"She was frightened," it says. "Not of me. Of what was following her. Little black cat, white sock, and something behind her that I could hear but not see." It lets you dab the scratches with a wet fern.',
        '"Go on then. Toll waived. And take this \u2014 it means *this child is a friend of the bridge*. It matters to some folk."'
      ],
      firstVisitEffects: { items: ['🪨 Troll Token'], stats: { kindness: 1 }, flags: { trollFriend: true, followed: true } },
      choices: [ { text: 'Cross the bridge, worried now.', to: 'crow_market' } ]
    },

    ring: {
      title: 'The Ring of Very Organised Moths',
      text: [
        'Two hundred moths are dancing a formal dance above the mushrooms. They are dancing in the shape of a cat. They are, you realise, *reenacting* something \u2014 a small cat running, and behind her a shape with too many legs.',
        'The moths pause. They would like a partner. They are extremely clear about this despite having no faces.'
      ],
      effects: { flags: { didRing: true, wandered: true, followed: true } },
      choices: [
        { text: 'Dance with the moths.',
          roll: { stat: 'kindness', dc: 7, success: 'ring_win', fail: 'ring_fail' } },
        { text: 'Watch the whole story through instead.', to: 'ring_watch' },
        { text: 'Back away slowly. Back to the three ways.', to: 'hollowwood' }
      ]
    },

    ring_win: {
      title: 'A Very Silly, Very Serious Dance',
      text: [
        'You dance. Badly. Enormously badly, in pyjama trousers, with one slipper, in a ring of glowing mushrooms in a wood that should not exist.',
        'The moths are delighted. They settle on your shoulders and knit themselves into a grey cloak that weighs nothing and makes you feel very slightly invisible.',
        '"Hush-thing follows her," they whisper, all together. "Hush-thing wants her voice."'
      ],
      firstVisitEffects: { items: ['🦋 Moth Cloak'], stats: { kindness: 1 }, flags: { hushKnown: true } },
      choices: [ { text: 'Follow the moths\u2019 pointing.', to: 'crow_market' } ]
    },

    ring_fail: {
      title: 'Two Left Feet, One Left Slipper',
      text: [
        'You step on the dance. You can tell, because the dance stops and every moth turns to look at you at once, which is a lot of looking from things with no eyes to speak of.',
        'They forgive you \u2014 moths are like that \u2014 but they will not lend you their cloak. They do whisper one word before scattering: *"Hush-thing."*'
      ],
      firstVisitEffects: { flags: { hushKnown: true } },
      choices: [ { text: 'Go on, unsettled.', to: 'crow_market' } ]
    },

    ring_watch: {
      title: 'The Whole Story, Told in Moths',
      text: [
        'You sit and watch the dance three times through. Moth-Mochi runs. The many-legged Hush-thing follows. And then \u2014 the part you had to watch three times to be sure of \u2014 moth-Mochi stops running and turns around, because she is carrying something small, and the something small cannot run any further.',
        'The moths finish. They bow. One lands on your nose to make sure you understood.'
      ],
      firstVisitEffects: { flags: { hushKnown: true, sawKitten: true }, stats: { cunning: 1 } },
      choices: [ { text: 'Go, quickly now.', to: 'crow_market' } ]
    },

    /* ---------- Act III: The Market and the Witch ---------- */

    crow_market: {
      title: 'The Crow Market',
      text: [
        'A clearing full of stalls made from umbrellas, staffed entirely by crows in waistcoats, lit by lanterns that are honestly just very smug fireflies.',
        'They sell: directions, borrowed names, bottled apologies, and one (1) map to the Court of the Ninefold Hearth, where \u2014 a sign explains \u2014 *all lost cats are eventually filed*.',
        'The head crow eyes your pyjamas. "Price is a name," it says. "Not yours. Anyone\u2019s."'
      ],
      choices: [
        { text: 'Trade a name you don\u2019t mind losing (your least-favourite teacher\u2019s).', to: 'market_trade' },
        { text: 'Haggle. Never take the first price.', to: 'market_haggle', onlyFlag: 'marketTip' },
        { text: 'Show the troll token.', to: 'market_token', needItem: '🪨 Troll Token' },
        { text: 'Pickpocket the map while the crows argue.',
          roll: { stat: 'cunning', dc: 9, success: 'market_stolen', fail: 'market_caught', failEffects: { stats: { health: -1 } } } }
      ]
    },

    market_trade: {
      title: 'Sold: One Name',
      text: [
        'You say a name. The crows write it down with great ceremony, and immediately you cannot remember what it was. Somewhere, a maths teacher wakes up feeling wonderfully anonymous.',
        'The map is a feather. When you hold it, it points. It is currently pointing hard enough to sting.'
      ],
      firstVisitEffects: { items: ['🪶 Pointing Feather'] },
      choices: [ { text: 'Follow the feather.', to: 'thornway' } ]
    },

    market_haggle: {
      title: 'Never the First Price',
      text: [
        '"That\u2019s your first price," you say. "I\u2019ll hear the second."',
        'Every crow in the market goes silent, then bursts into applause, which for crows means throwing small shiny objects at your head.',
        '"A *professional*," says the head crow, disgusted and impressed. You get the feather map for a button, plus a bottled apology "for when you need one, and you will."'
      ],
      firstVisitEffects: { items: ['🪶 Pointing Feather', '🍾 Bottled Apology'], stats: { cunning: 1 } },
      choices: [ { text: 'Follow the feather.', to: 'thornway' } ]
    },

    market_token: {
      title: 'Friend of the Bridge',
      text: [
        'You hold up the troll token. Waistcoats are straightened. Beaks are lowered.',
        '"Bridge-friend," says the head crow. "No charge, then; we owe that big damp idiot everything." The map-feather is pressed into your hand along with a warning, delivered quietly:',
        '"Something came through tonight that doesn\u2019t have a name to trade. It\u2019s hunting a voice. Walk soft."'
      ],
      firstVisitEffects: { items: ['🪶 Pointing Feather'], stats: { kindness: 1 }, flags: { hushKnown: true } },
      choices: [ { text: 'Walk soft. Follow the feather.', to: 'thornway' } ]
    },

    market_stolen: {
      title: 'Five-Finger Cartography',
      text: [
        'You lift the feather while two crows argue about whether a moon counts as a coin. It does not, apparently, and the argument is very loud.',
        'You are three steps away before the head crow calls after you, entirely calm: "Fine. But a market always gets paid, child. We\u2019ll take it later, and we\u2019ll pick when."',
        'That is somehow much worse than being caught.'
      ],
      firstVisitEffects: { items: ['🪶 Pointing Feather'], flags: { crowDebt: true }, stats: { cunning: 1 } },
      choices: [ { text: 'Leave quickly.', to: 'thornway' } ]
    },

    market_caught: {
      title: 'Crows Do Not Miss',
      text: [
        'Forty beaks turn at once. You are pecked with great precision and no real malice, then hung by your collar from an umbrella stall until you apologise.',
        'You apologise. The head crow sighs, and gives you the feather anyway. "Take it. You\u2019re embarrassing." The crows all agree that this was the funniest thing to happen at market in years.'
      ],
      firstVisitEffects: { items: ['🪶 Pointing Feather'] },
      choices: [ { text: 'Slink off along the thorn path.', to: 'thornway' } ]
    },

    thornway: {
      title: 'The Thornway',
      text: [
        'The feather drags you down a corridor of black thorn where the moonlight has to squeeze in sideways.',
        'Halfway along, the wood goes *quiet* \u2014 not silent, but muffled, like a hand over the world\u2019s mouth. Your footsteps stop making sound. Your breath stops making sound.',
        'Something is walking beside you, matching you step for step, and it has more legs than that requires.'
      ],
      choices: [
        { text: 'Chew the bridge moss and see truly.', to: 'hush_seen', needItem: '🌿 Bridge Moss', effects: { lose: ['🌿 Bridge Moss'] } },
        { text: 'Ring Barnaby\u2019s bell into the hush.', to: 'hush_bell', needItem: '🔔 Barnaby\u2019s Bell' },
        { text: 'Run. Just run.',
          roll: { stat: 'courage', dc: 9, success: 'witch_hut', fail: 'hush_caught', failEffects: { stats: { health: -2 } } } },
        { text: 'Stand perfectly still and be very, very boring.',
          roll: { stat: 'cunning', dc: 8, success: 'witch_hut', fail: 'hush_caught', failEffects: { stats: { health: -1 } } } }
      ]
    },

    hush_seen: {
      title: 'The Hush-Thing',
      text: [
        'The moss tastes like a pond apologising, and then you can *see* it: a tall, folded, listening creature made of the spaces between sounds, wearing a collection of stolen voices like charms on a bracelet.',
        'It notices you noticing. That, it turns out, is the one thing it cannot bear. It flinches, unravels a little, and slides away between the thorns \u2014 towards, you realise with a lurch, wherever Mochi is.'
      ],
      firstVisitEffects: { flags: { hushKnown: true, hushSeen: true }, stats: { courage: 1 } },
      choices: [ { text: 'Chase it.', to: 'witch_hut' } ]
    },

    hush_bell: {
      title: 'A Sound It Cannot Swallow',
      text: [
        'You ring the little brass bell. The hush tries to eat the sound and cannot \u2014 the bell was rung by a boy for his cat for sixty years, and that kind of ringing has *roots*.',
        'The Hush-thing recoils, dropping three stolen voices, which scurry off into the undergrowth to find their owners. One of them, briefly, sounds exactly like a cat saying your name.'
      ],
      firstVisitEffects: { flags: { hushKnown: true, bellWorks: true }, stats: { courage: 1 } },
      choices: [ { text: 'Follow the voice that sounded like her.', to: 'witch_hut' } ]
    },

    hush_caught: {
      title: 'It Takes Something',
      text: [
        'Cold folds around you. Something long and careful goes through your pockets, and then through your *thoughts*, and takes the sound of your own laugh \u2014 you feel it go, like a tooth coming out.',
        'Then it leaves, bored, because you are not the one it wants. You lie in the thorns until you can move, and the wood slowly gets its noises back.',
        'You are going to need that laugh. You decide, lying there, that you are going to take it back.'
      ],
      firstVisitEffects: { flags: { laughStolen: true, hushKnown: true }, stats: { courage: 1 } },
      choices: [ { text: 'Get up. Keep going.', to: 'witch_hut' } ]
    },

    witch_hut: {
      title: 'Bramblewick\u2019s Tea Hut',
      text: [
        'A hut stands on the stump of a tree that must have been the size of a cathedral. Smoke comes out of the chimney in the shape of small, contented animals.',
        'The witch inside is about your mum\u2019s age, covered in cat hair, and extremely unsurprised to see you. "Ah," says Bramblewick. "You\u2019re hers. She talks about you."',
        'She pours three cups without asking which one you want.'
      ],
      choices: [
        { text: '"She TALKS about me?"', to: 'witch_talk' },
        { text: 'Drink the red cup (bravery).', to: 'tea_red', effects: { stats: { courage: 2 } } },
        { text: 'Drink the green cup (sharpness).', to: 'tea_green', effects: { stats: { cunning: 2 } } },
        { text: 'Drink the gold cup (warmth).', to: 'tea_gold', effects: { stats: { kindness: 2, health: 2 } } }
      ]
    },

    witch_talk: {
      title: 'What Mochi Says About You',
      text: [
        '"Constantly," says Bramblewick. "Cats keep two homes: one where they\u2019re fed and one where they\u2019re *needed*. Your Mochi is a Warden of the Hollowwood \u2014 has been since before you were born \u2014 and she has never once shut up about the child with the cold feet."',
        'She stirs the pot. "She came through tonight in a hurry, carrying something. And something came through after her, with no voice of its own. Drink your tea, then go and be useful."'
      ],
      firstVisitEffects: { flags: { knowsWarden: true }, stats: { kindness: 1 } },
      choices: [
        { text: 'Drink the red cup (bravery).', to: 'tea_red', effects: { stats: { courage: 2 } } },
        { text: 'Drink the green cup (sharpness).', to: 'tea_green', effects: { stats: { cunning: 2 } } },
        { text: 'Drink the gold cup (warmth).', to: 'tea_gold', effects: { stats: { kindness: 2, health: 2 } } }
      ]
    },

    tea_red: {
      title: 'Red Tea',
      text: ['It tastes of cinnamon and standing up to someone bigger than you. Your hands stop shaking. Bramblewick nods and hands you a twig of rowan "for knocking".'],
      firstVisitEffects: { items: ['🌾 Rowan Twig'] },
      choices: [ { text: 'Out into the dark, towards the Court.', to: 'hollow_tree' } ]
    },
    tea_green: {
      title: 'Green Tea',
      text: ['It tastes of nettles and the moment before you understand a joke. Everything sharpens; you notice the hut has thirteen cat flaps, and one of them is still swinging.'],
      firstVisitEffects: { items: ['🌾 Rowan Twig'], flags: { hint: true } },
      choices: [ { text: 'Out through the swinging flap\u2019s direction.', to: 'hollow_tree' } ]
    },
    tea_gold: {
      title: 'Gold Tea',
      text: ['It tastes like being tucked in. The scratches close. Bramblewick tops up your cup, then fills a small flask "for a small thing that will need it more than you".'],
      firstVisitEffects: { items: ['🌾 Rowan Twig', '🍼 Warm Flask'] },
      choices: [ { text: 'Out, warm, into the cold.', to: 'hollow_tree' } ]
    },

    /* ---------- Act IV: The Court of the Ninefold Hearth ---------- */

    hollow_tree: {
      title: 'The Hollow Tree',
      text: [
        'The feather stops pulling at a dead oak the size of a church, split open down one side. Starry pawprints go in. None come out.',
        'From inside comes the sound of many cats being extremely quiet, which is the loudest quiet there is.'
      ],
      choices: [
        { text: 'Check behind the hollow tree first.', to: 'behind_tree', onlyFlag: 'hint' },
        { text: 'Knock with the rowan twig.', to: 'court_gate', needItem: '🌾 Rowan Twig' },
        { text: 'Just climb in.', to: 'court_gate' }
      ]
    },

    behind_tree: {
      title: 'Behind the Hollow Tree',
      text: [
        'Behind the tree, in a hollow of moss, is a nest: three scraps of blanket, a chewed bottle-top, and one very small, very grey kitten with a white sock, shivering and furious about it.',
        'It hisses at you with its whole body. It is the size of a bread roll. It is, unmistakably, Mochi\u2019s.'
      ],
      firstVisitEffects: { flags: { foundKitten: true } },
      choices: [
        { text: 'Give it the warm flask.', to: 'kitten_flask', needItem: '🍼 Warm Flask' },
        { text: 'Tuck it inside your pyjama top and take it with you.', to: 'kitten_carry' },
        { text: 'Leave it hidden \u2014 safer than coming with you.', to: 'court_gate', effects: { flags: { kittenLeft: true } } }
      ]
    },

    kitten_flask: {
      title: 'Bread Roll, Fed',
      text: [
        'The kitten drinks the whole flask, then falls asleep mid-hiss, which is the funniest thing you have ever seen. You feel your stolen laugh try to come back from wherever it went.',
        'You tuck the warm lump inside your pyjama top. It purrs like a very small engine with a fault.'
      ],
      firstVisitEffects: { items: ['🐈 Sleeping Kitten'], lose: ['🍼 Warm Flask'], stats: { kindness: 1 }, flags: { hasKitten: true } },
      choices: [ { text: 'To the Court.', to: 'court_gate' } ]
    },

    kitten_carry: {
      title: 'Small, Furious Cargo',
      text: [
        'You get bitten eleven times, all of them on purpose, none of them very hard. Then it gives up and burrows under your chin, still grumbling.',
        'You have never carried anything so carefully in your life.'
      ],
      firstVisitEffects: { items: ['🐈 Sleeping Kitten'], stats: { kindness: 1 }, flags: { hasKitten: true } },
      choices: [ { text: 'To the Court.', to: 'court_gate' } ]
    },

    court_gate: {
      title: 'The Gate of Nine Whiskers',
      text: [
        'Inside the tree is not the inside of a tree. It is a hall of roots and firelight, nine hearths burning in a circle, and cats \u2014 hundreds of cats \u2014 arranged in the exact positions of maximum inconvenience.',
        'Two enormous door-guards, one ginger and one entirely absent except for a smile, block the way.',
        '"State your business, warm thing," says the ginger.'
      ],
      choices: [
        { text: 'Ring Barnaby\u2019s bell.', to: 'gate_bell', needItem: '🔔 Barnaby\u2019s Bell', hideWhenLocked: false },
        { text: 'Show the sleeping kitten.', to: 'gate_kitten', needItem: '🐈 Sleeping Kitten' },
        { text: '"I\u2019ve come for my cat."',
          roll: { stat: 'courage', dc: 9, success: 'court', fail: 'gate_thrown', failEffects: { stats: { health: -1 } } } },
        { text: 'Offer to be scratched behind the ears first, as tribute.',
          roll: { stat: 'kindness', dc: 8, success: 'court', fail: 'gate_thrown' } }
      ]
    },

    gate_bell: {
      title: 'The Ringing That Sounds Wrong',
      text: [
        'You ring the bell and it comes out *wrong* \u2014 too big, too golden, a cathedral sound from a thimble.',
        'Every cat in the hall stands up at once. The ginger guard bows so low his whiskers sweep the roots. "Barnaby\u2019s bell," he breathes. "The Warden\u2019s own. Go through, child. Quickly. She has been arguing for an hour and she is losing."'
      ],
      firstVisitEffects: { stats: { courage: 1 } },
      choices: [ { text: 'Go through.', to: 'court' } ]
    },

    gate_kitten: {
      title: 'Cargo Diplomacy',
      text: [
        'You open your pyjama top an inch. One grey ear, one white sock, one enormous yawn.',
        'The hall makes a noise no human has ever heard: three hundred cats going *oh*. The guards stand aside so fast the invisible one forgets to keep its smile.'
      ],
      choices: [ { text: 'Carry the heir inside.', to: 'court' } ]
    },

    gate_thrown: {
      title: 'Out, Then In',
      text: [
        'You are removed from the hall by nine cats working with the coordination of a professional removals firm, deposited in the moss, and stared at.',
        'Then a small voice from inside says something short and sharp, and the guards go stiff, and the ginger mutters, "Fine. *Fine.* The Warden asks for you."'
      ],
      choices: [ { text: 'Walk back in with your chin up.', to: 'court' } ]
    },

    court: {
      title: 'The Court of the Ninefold Hearth',
      text: [
        'On a chair made of one enormous fossilised bone sits the Queen of Cats: white, ancient, with eyes like two coins at the bottom of a well.',
        'And in the middle of the floor, small and black and furious, with a white sock and one torn ear, is *Mochi*.',
        '"There you are," says Mochi, in a voice you have somehow always known she had. "You took ages. Also: don\u2019t panic."'
      ],
      choices: [
        { text: '"YOU CAN TALK?"', to: 'mochi_talk' },
        { text: 'Panic.', to: 'mochi_talk' }
      ]
    },

    mochi_talk: {
      title: 'Don\u2019t Panic',
      text: [
        '"Everyone can talk," says Mochi. "Some of us choose not to, at home, because it would ruin everything."',
        'The Queen speaks, and the hearths dim. "The Warden abandoned her post to hide a kitten, and a Hush-thing came through the thin place after her. The law is old: a Warden who runs is *unmade*, and her voice given to the hush to send it home."',
        'Mochi does not look at you. Her tail is very still. That is how you know how frightened she is.'
      ],
      choices: [
        { text: '"Then take mine instead."', to: 'trial_offer' },
        { text: '"Give me a trial. I\u2019ll pay her debt."', to: 'trials' },
        { text: '"The Hush-thing took my laugh already. Let\u2019s go and get it back."', to: 'trials', needFlag: 'laughStolen' },
        { text: 'Say nothing, and hold up the kitten.', to: 'kitten_evidence', needItem: '🐈 Sleeping Kitten' }
      ]
    },

    kitten_evidence: {
      title: 'Exhibit One: A Bread Roll',
      text: [
        'You hold up the kitten. It wakes, looks at three hundred cats and one queen, and yawns directly at royalty.',
        'The Queen\u2019s ancient eyes narrow. "You brought the heir *here*? With a hush loose in the wood?" A long silence. "...And yet you brought her warm, and fed, and carried."',
        '"The child may stand the Trial in the Warden\u2019s place. Three tests. Fail all three, and I keep you both."'
      ],
      firstVisitEffects: { stats: { kindness: 1 }, flags: { royalFavour: true } },
      choices: [ { text: 'Stand the Trial.', to: 'trials' } ]
    },

    trial_offer: {
      title: 'An Offer the Court Did Not Expect',
      text: [
        'The hall goes so quiet you can hear nine fires thinking.',
        '"A human offers a voice for a cat," says the Queen slowly. "That has not happened in six hundred years. The last time, it went *very* well, and we have never entirely recovered from the embarrassment."',
        '"No. You will not give a voice. You will stand the Trial: courage, cunning, kindness. Pass what you can. Then we shall see what you are worth."'
      ],
      firstVisitEffects: { stats: { courage: 1 }, flags: { royalFavour: true } },
      choices: [ { text: 'Stand the Trial.', to: 'trials' } ]
    },

    trials: {
      title: 'The Trial of Three Paws',
      text: [
        'The Queen raises one paw and the floor of the hall opens into three doorways of firelight.',
        '"Enter each. Take what you find. Then we go hunting, and you will need all of it."',
        'Mochi, passing you, headbutts your ankle exactly the way she does at home when the food bowl is empty. It is the bravest thing you have ever felt.'
      ],
      choices: [
        { text: 'The Door of Fire \u2014 courage.', to: 'trial_courage', notFlag: 'tCourage' },
        { text: 'The Door of Mirrors \u2014 cunning.', to: 'trial_cunning', notFlag: 'tCunning' },
        { text: 'The Door of Ashes \u2014 kindness.', to: 'trial_kindness', notFlag: 'tKind' },
        { text: 'Declare yourself ready and go hunt the Hush-thing.', to: 'hunt' }
      ]
    },

    trial_courage: {
      title: 'The Door of Fire',
      text: [
        'Beyond it: a corridor of hearth-flame, and at the end, a single ember on a plinth. The rule is stated by nobody and understood by everybody: *walk, don\u2019t run.*'
      ],
      effects: { flags: { tCourage: true } },
      choices: [
        { text: 'Walk the fire.',
          roll: { stat: 'courage', dc: 8, success: 'trial_c_win', fail: 'trial_c_fail', failEffects: { stats: { health: -1 } } } }
      ]
    },
    trial_c_win: {
      title: 'Ember Taken',
      text: ['You walk. The flames lick and do not bite. You lift the ember and it sits in your palm like a cross cat, warm and unbothered. Somewhere behind you, three hundred cats say *hm* in unison.'],
      firstVisitEffects: { items: ['🔥 Hearth Ember'], stats: { courage: 1 } },
      choices: [ { text: 'Back to the three doors.', to: 'trials' } ]
    },
    trial_c_fail: {
      title: 'You Ran',
      text: ['Halfway along, your nerve does the maths and you run. The fire is disappointed rather than angry; it singes your eyebrows off as a keepsake. The ember stays on its plinth, glowing smugly.'],
      choices: [ { text: 'Back to the three doors, eyebrow-less.', to: 'trials' } ]
    },

    trial_cunning: {
      title: 'The Door of Mirrors',
      text: [
        'Nine mirrors. In eight of them you are looking for your cat. In one of them, your cat is looking for you.',
        'You must pick the odd one out, and quickly, because the mirrors are shuffling like a card trick performed by someone with far too many paws.'
      ],
      effects: { flags: { tCunning: true } },
      choices: [
        { text: 'Track the odd mirror.',
          roll: { stat: 'cunning', dc: 8, success: 'trial_m_win', fail: 'trial_m_fail' } },
        { text: 'Close your eyes and listen for a purr instead.',
          roll: { stat: 'kindness', dc: 9, success: 'trial_m_win', fail: 'trial_m_fail' } }
      ]
    },
    trial_m_win: {
      title: 'Found in the Looking',
      text: ['You slap your hand on the right mirror. It shatters into cold light that pools in your pocket as a shard that shows things as they truly are \u2014 including, when you glance at it, one long folded shape lurking at the edge of the hall. It is already here.'],
      firstVisitEffects: { items: ['🪞 Truth Shard'], stats: { cunning: 1 }, flags: { hushHere: true } },
      choices: [ { text: 'Back to the doors, faster now.', to: 'trials' } ]
    },
    trial_m_fail: {
      title: 'Eight Wrong Guesses',
      text: ['You pick wrong, and wrong, and wrong. The mirrors laugh in the voice of a cat who has knocked a glass off a table. You leave with nothing but a strong sense of having been *judged*.'],
      choices: [ { text: 'Back to the doors.', to: 'trials' } ]
    },

    trial_kindness: {
      title: 'The Door of Ashes',
      text: [
        'A cold room, a dead hearth, and one very old cat lying in the ashes \u2014 blind, thin, shivering, and far past caring who sees.',
        'There is nothing here to win. That is, of course, the test.'
      ],
      effects: { flags: { tKind: true } },
      choices: [
        { text: 'Warm the old cat with the hearth ember.', to: 'trial_k_ember', needItem: '🔥 Hearth Ember' },
        { text: 'Take off your pyjama top and wrap them in it.', to: 'trial_k_win' },
        { text: 'Sit down and stroke them until they stop shivering.', to: 'trial_k_win' },
        { text: 'Leave \u2014 you have a cat of your own to save.', to: 'trial_k_leave' }
      ]
    },
    trial_k_ember: {
      title: 'The Hearth Relit',
      text: [
        'You set the ember in the dead hearth. It catches with a sound like a purr, and the room fills with light.',
        'The old cat opens milky eyes. "Oh," they say. "That\u2019s better. You\u2019re the one with the cold feet." They press their forehead to your knuckles, and something warm and stubborn settles into your chest that no hush will ever be able to eat.'
      ],
      firstVisitEffects: { items: ['💛 A Warmth That Cannot Be Eaten'], lose: ['🔥 Hearth Ember'], stats: { kindness: 2, health: 1 }, flags: { blessed: true } },
      choices: [ { text: 'Back to the doors.', to: 'trials' } ]
    },
    trial_k_win: {
      title: 'Nothing to Win',
      text: [
        'You sit in the ashes in a cold room with a stranger who is dying, and you do the only useful thing there is, which is stay.',
        'After a while the shivering stops. "Kind," the old cat murmurs. "Kindness is the one they never spend." They breathe out a thread of silver that winds twice round your wrist and stays there.'
      ],
      firstVisitEffects: { items: ['🧵 Silver Thread'], stats: { kindness: 2 }, flags: { blessed: true } },
      choices: [ { text: 'Back to the doors.', to: 'trials' } ]
    },
    trial_k_leave: {
      title: 'You Leave',
      text: ['You leave. It is the sensible choice and it sits in your stomach like a swallowed stone for the rest of the night. Behind you, the shivering continues.'],
      firstVisitEffects: { stats: { kindness: -1 }, flags: { coldChoice: true } },
      choices: [ { text: 'Back to the doors.', to: 'trials' } ]
    },

    /* ---------- Act V: The Hunt ---------- */

    hunt: {
      title: 'The Hush Comes Calling',
      text: [
        'You do not have to go hunting. The hall goes quiet \u2014 the wrong quiet, the muffled kind \u2014 and every hearth gutters at once.',
        'The Hush-thing unfolds from between two fires: tall, listening, hung with stolen voices like a wind chime made of other people\u2019s words. One of those voices is your laugh.',
        'It reaches for Mochi, who stands her ground in front of three hundred silenced cats, because that is what a Warden does.'
      ],
      choices: [
        { text: 'Ring Barnaby\u2019s bell \u2014 the sound with roots.', to: 'end_bell', needItem: '🔔 Barnaby\u2019s Bell' },
        { text: 'Hold up the truth shard and *see* it.', to: 'end_shard', needItem: '🪞 Truth Shard', hideWhenLocked: false },
        { text: 'Step in front of Mochi.',
          roll: { stat: 'courage', dc: 9, success: 'end_shield_win', fail: 'end_shield_fail', failEffects: { stats: { health: -2 } } } },
        { text: 'Speak to it kindly. Ask it what it lost.',
          roll: { stat: 'kindness', dc: 8, success: 'end_ask_win', fail: 'end_shield_fail', failEffects: { stats: { health: -1 } } } }
      ]
    },

    end_bell: {
      title: 'The Sound With Roots',
      text: [
        'You ring the bell, and this time the whole Court rings with it \u2014 nine hearths, three hundred throats, sixty years of one old man calling one old cat home for tea.',
        'The Hush-thing cannot swallow it. It comes apart like fog at a window, and every stolen voice springs loose and bolts for its owner. Your laugh hits you in the chest and you are still laughing when the hearths roar back up.',
        'The Queen inclines her head one careful inch. "The debt is paid, and the wood is quieter for it."'
      ],
      choices: [ { text: 'Turn to Mochi.', to: 'aftermath' } ]
    },

    end_shard: {
      title: 'Seen',
      text: [
        'You hold the shard up and *look* at it \u2014 properly, the way nobody has ever looked at it \u2014 and say, quite loudly, "I see you."',
        'It stops. Being seen is the one thing a hush cannot survive. It folds smaller and smaller, dropping voices as it goes, until what is left is a small grey thing the size of a moth, which flits away into the roots to start again from nothing.',
        'Your laugh comes back last, sheepishly, like a dog that ran off at the park.'
      ],
      choices: [ { text: 'Turn to Mochi.', to: 'aftermath' } ]
    },

    end_shield_win: {
      title: 'In Front',
      text: [
        'You step between a hush and a cat, in pyjama trousers, with one slipper, and you say "no."',
        'It takes hold of you and finds \u2014 to its enormous confusion \u2014 nothing worth eating: no silence in you at all, only a warm noisy tangle of a kid who talks to their cat about everything.',
        'It lets go, offended, and flees the hall. The Court explodes into the most undignified cheering in nine hundred years.'
      ],
      firstVisitEffects: { stats: { courage: 1 } },
      choices: [ { text: 'Turn to Mochi.', to: 'aftermath' } ]
    },

    end_shield_fail: {
      title: 'Not Enough, Alone',
      text: [
        'You are not fast enough, or loud enough, and the cold folds around you \u2014',
        '\u2014 and then a very small grey shape with a white sock hurtles out of your pyjama top / out of the roots and hisses at the Hush-thing with its entire two hundred grams.',
        'The whole Court hisses with it. Three hundred cats. Nine hearths. One kid on the floor, joining in with what\u2019s left of their voice. The hush cannot eat a noise that big. It unravels, and runs.'
      ],
      choices: [ { text: 'Sit up, ears ringing.', to: 'aftermath' } ]
    },

    end_ask_win: {
      title: 'What Did You Lose?',
      text: [
        'You do the thing nobody in nine hundred years has tried. You sit down on the floor of the Court, look up at the tall folded silence, and ask, "What did *you* lose?"',
        'It stops. Slowly, from among the stolen voices, one comes forward that is small and cracked and its own: *"Everything. I was a hearth. Nobody sat at me."*',
        'So you relight it \u2014 with an ember, a wrapped-up shivering old cat\u2019s thread, or just by shuffling over and making room. The Hush-thing becomes the tenth fire in the Court of the Ninefold Hearth, and burns very quietly, and every voice it took goes home.'
      ],
      firstVisitEffects: { stats: { kindness: 1 }, flags: { tenthHearth: true } },
      choices: [ { text: 'Turn to Mochi.', to: 'aftermath' } ]
    },

    aftermath: {
      title: 'The Reckoning of Cats',
      text: [
        'The Queen of Cats considers you for a long, long time.',
        '"The Warden\u2019s debt is paid by a human child in pyjamas," she says. "The Court is humiliated and I am, privately, delighted. Warden Mochi: you are released. Choose."',
        'Mochi looks at the nine hearths, at her kitten, at the wood she has guarded since before you were born. Then at you.',
        '"Well," she says. "Ask me, then. Properly."'
      ],
      choices: [
        { text: '"Come home. Please."', to: 'end_home' },
        { text: '"Stay. This is your wood. I\u2019ll visit every Hollow Night."', to: 'end_stay' },
        { text: '"Come home \u2014 and bring the kitten. And the job. We\u2019ll manage."', to: 'end_both', needFlag: 'foundKitten' },
        { text: '"Can I stay here with you?"', to: 'end_wild' }
      ]
    },

    /* ---------- Endings ---------- */

    end_home: {
      title: 'Ending: The Dent in the Quilt',
      text: [
        '"Obviously," says Mochi, and walks out of the Court of the Ninefold Hearth without looking back, tail up, like she owns the place \u2014 which, it turns out, she sort of does.',
        'You come out through the hedge at four in the morning. She lets you carry her the last bit, which she has never once allowed.',
        'In the morning there is a dent in the quilt, and a cat in it, and she does not say a single word \u2014 not at breakfast, not ever again, not where anyone could hear. But when you say "I know what you are," she blinks at you very slowly, which in cat means *yes*, and also *don\u2019t tell*.'
      ],
      ending: true,
      choices: []
    },

    end_stay: {
      title: 'Ending: A Standing Invitation',
      text: [
        'It is the hardest sentence you have ever said and you get through it without your voice going.',
        'Mochi is quiet for a long moment. "That," she says, "is the kindest thing anyone has ever done to me, and I am including the time you gave me your entire chicken dinner."',
        'She stays. You go home with an empty quilt \u2014 but on every Hollow Night after, the hedge breathes open, and a small black cat with a white sock is waiting on the other side with an entire year of news, and you are the only person alive who gets to hear a cat gossip.'
      ],
      ending: true,
      choices: []
    },

    end_both: {
      title: 'Ending: Two Cats, One Warden, No Explanations',
      text: [
        '"Both," you say. "All of it. The kitten, the job, everything. We\u2019ve got a garden and a hedge that opens once a year and I\u2019m *very* good at keeping secrets."',
        'The Queen of Cats makes a noise that might be a laugh or might be a lung problem. "A Warden\u2019s post, held from a *bungalow*," she says. "Do it. This century has been so boring."',
        'You come home at dawn with a cat under one arm and a bread roll under your chin. Your parents are told there was a stray. Everyone chooses to believe this. On Hollow Nights your bedroom window is left open, and the whole wood knows the way.'
      ],
      ending: true,
      choices: []
    },

    end_wild: {
      title: 'Ending: The Child Who Stayed Till Morning',
      text: [
        '"No," says Mochi, gently, before the Queen can answer. "Absolutely not. You\u2019ve got school."',
        'But she lets you stay till dawn, and the Court \u2014 who are, underneath everything, cats \u2014 spend those hours sitting on you, all of them, in shifts, purring, which is the closest thing to a knighthood the Hollowwood offers.',
        'You go home at sunrise, warm, covered in fur, with your laugh back and a small grey shadow following at your heel, and a standing appointment with a wood that will always, always open for you.'
      ],
      ending: true,
      choices: []
    },

    faint: {
      title: 'Ending: The Wood Keeps You a While',
      text: [
        'Your legs go. The moss comes up to meet you, and it is much softer than moss has any right to be.',
        'You wake at noon in your own garden, dry, warm, with your scratches bandaged in cobweb and moth-silk, and no cat.',
        'On the pillow beside you: one brass bell, one grey kitten with a white sock, and a note in a spidery hand: *"She is staying to finish it. She sends the small one. She says you did brilliantly, and to eat something."* Next Hollow Night, you will be ready. You have a whole year to get braver.'
      ],
      ending: true,
      choices: []
    }
  }
};
