// ============================================================
//  laiys tracker — exhaustive W/L pattern matching engine
//  Covers: laiys / lays / lais / layz / lay / cameraman / cam
//  200+ W vocabulary items, 200+ L vocabulary items
// ============================================================

const NAME = `(?:la[iy]+[sz]?s?|lay[sz]?|laiz|lais|layz|l4iys|laiys|lays)`;
const CAM  = `(?:cam(?:era)?(?:man)?|cammer|camman|cammy|cam1|xcam)`;

// Flexible copula / intensifier
const COPULA = `(?:is|was|has|been|got|gets|just|always|still|really|actually|lowkey|highkey|honestly|genuinely|literally|def(?:initely)?|for\\s*real|fr|no\\s*cap|ong|on\\s*god)`;

// ── W VOCABULARY ─────────────────────────────────────────────

// 100+ positive adjectives
const W_ADJ = `(?:` + [
  'fire', 'cold', 'cold\\s*blooded', 'icy', 'frosty',
  'hard', 'hard\\s*af', 'hard\\s*asf',
  'goated', 'god(?:like|tier)?', 'godly',
  'based', 'valid', 'real', 'facts',
  'different', 'built\\s*different', 'built\\s*diff',
  'crazy', 'insane', 'nuts', 'wild', 'stupid\\s*good', 'dumb\\s*good', 'filthy', 'disgusting\\s*good', 'sick', 'nasty\\s*good',
  'elite', 'elite\\s*tier', 'god\\s*tier', 's\\s*tier', 'top\\s*tier', 'top\\s*notch', 'top\\s*flight', 'top\\s*dog',
  'legendary', 'iconic', 'historic', 'mythical', 'immortal',
  'perfect', 'flawless', 'immaculate', 'pristine', 'clean', 'crisp',
  'cracked', 'cracked\\s*out', 'cracked\\s*af',
  'raw', 'unfiltered', 'uncut',
  'unmatched', 'unrivaled', 'unparalleled', 'undefeated', 'unbothered',
  'untouchable', 'unstoppable', 'inevitable', 'undeniable', 'irresistible',
  'dominant', 'dominating', 'superior', 'supreme', 'transcendent',
  'powerful', 'strong', 'tough', 'sturdy',
  'smart', 'intelligent', 'clever', 'witty', 'sharp', 'genius',
  'funny', 'hilarious', 'comedic', 'comical', 'entertaining', 'fun', 'enjoyable', 'wholesome',
  'cool', 'awesome', 'amazing', 'incredible', 'unbelievable', 'outstanding', 'exceptional',
  'extraordinary', 'phenomenal', 'stellar', 'superb', 'magnificent', 'brilliant',
  'remarkable', 'impressive', 'clutch', 'capable', 'skilled', 'talented', 'gifted', 'blessed',
  'special', 'unique', 'one\\s*of\\s*a\\s*kind', 'original', 'authentic', 'genuine', 'solid', 'consistent',
  'bussin', 'bussin\\s*bussin', 'pog(?:gers)?', 'sheesh',
  'sigma', 'alpha', 'chad',
  'great', 'nice', 'good', 'decent', 'certified', 'official', 'legit',
  'underrated', 'slept\\s*on', 'overlooked', 'underappreciated',
  'better', 'best', 'number\\s*one',
  'on\\s*top', 'winning', 'on\\s*another\\s*level',
  'nasty', 'menacing', 'menace',
  'clean\\s*af', 'smooth', 'calculated', 'composed',
  'cracked', 'icy', 'locked\\s*in', 'dialed\\s*in',
  'immovable', 'unstained', 'untarnished', 'unskippable',
  'a\\s*real\\s*one', 'a\\s*problem', 'a\\s*vibe',
  'him', 'that\\s*guy', 'the\\s*guy', 'that\\s*dude', 'the\\s*man',
  'mvp', 'king', 'legend', 'goat', 'god',
].join('|') + `)`;

// 35+ positive identity noun phrases
const W_IDENTITY = `(?:` + [
  'the\\s*goat', 'a\\s*goat', 'an?\\s*actual\\s*goat', 'the\\s*certified\\s*goat',
  'a\\s*legend', 'the\\s*legend', 'an?\\s*actual\\s*legend', 'a\\s*living\\s*legend',
  'a\\s*king', 'the\\s*king', 'the\\s*true\\s*king',
  'a\\s*god', 'an?\\s*actual\\s*god', 'a\\s*demigod', 'a\\s*gaming\\s*god',
  'a\\s*sigma', 'the\\s*sigma', 'a\\s*sigma\\s*male',
  'him', 'the\\s*guy', 'that\\s*guy', 'that\\s*dude', 'the\\s*man', 'the\\s*one', 'the\\s*chosen\\s*one',
  'a\\s*real\\s*one', 'a\\s*certified\\s*real\\s*one',
  'a\\s*menace', 'a\\s*problem', 'a\\s*monster', 'a\\s*beast', 'a\\s*machine', 'a\\s*demon', 'a\\s*goblin',
  'an\\s*icon', 'a\\s*vibe', 'a\\s*whole\\s*vibe', 'the\\s*main\\s*character',
  'different\\s*breed', 'a\\s*different\\s*breed', 'built\\s*different', 'built\\s*diff',
  'on\\s*another\\s*level', 'in\\s*a\\s*different\\s*league', 'in\\s*his\\s*own\\s*lane',
  'the\\s*best', 'number\\s*one', 'the\\s*greatest', 'the\\s*goat\\s*of\\s*all\\s*time',
  'a\\s*living\\s*legend', 'already\\s*a\\s*legend',
  'something\\s*else', 'something\\s*special', 'one\\s*of\\s*one', 'one\\s*in\\s*a\\s*million',
  'too\\s*good', 'too\\s*real', 'too\\s*cold', 'too\\s*hard',
  'facts', 'valid', 'not\\s*human', 'built\\s*for\\s*this',
  'an?\\s*all\\s*time\\s*great', 'an?\\s*actual\\s*all\\s*timer',
].join('|') + `)`;

// 40+ positive action verbs / state phrases
const W_ACTIONS = `(?:` + [
  'ate', 'ate\\s*up', 'ate\\s*it\\s*up', 'ate\\s*that', 'ate\\s*that\\s*up', 'ate\\s*and\\s*left\\s*no\\s*crumbs?',
  'cooked', 'cooked\\s*em', 'cooked\\s*them', 'cooked\\s*everyone', 'cooked\\s*it',
  'carried', 'carried\\s*hard', 'carried\\s*the\\s*team', 'hard\\s*carried', 'solo\\s*carried', 'literally\\s*carried',
  'snapped', 'snapped\\s*on\\s*em', 'snapped\\s*on\\s*that', 'snapped\\s*fr',
  'bodied', 'bodied\\s*em', 'bodied\\s*them', 'bodied\\s*that',
  'went\\s*off', 'went\\s*crazy', 'went\\s*stupid', 'went\\s*dumb', 'went\\s*hard', 'went\\s*insane', 'went\\s*nuts', 'went\\s*off\\s*on\\s*em',
  'popped\\s*off', 'popped\\s*off\\s*on\\s*em',
  'no\\s*diff(?:ed)?', 'diff(?:ed)?\\s*em', 'diffed\\s*everyone', 'ez\\s*diff(?:ed)?',
  'slapped', 'slapped\\s*different', 'slapped\\s*hard',
  'smacked', 'clapped', 'demolished', 'destroyed', 'dismantled', 'annihilated',
  'ran\\s*it\\s*up', 'ran\\s*through', 'ran\\s*that', 'ran\\s*it',
  'owned', 'dominated', 'crushed', 'decimated', 'obliterated',
  'goes\\s*hard', 'goes\\s*crazy', 'goes\\s*off', 'goes\\s*stupid',
  'never\\s*misses?', 'never\\s*loses?', 'always\\s*wins?', 'always\\s*delivers?', 'always\\s*cooking',
  'is\\s*winning', 'is\\s*on\\s*top', 'is\\s*that\\s*guy', 'is\\s*him', 'is\\s*different',
  'winning', 'cooking', 'eating', 'thriving',
  'built\\s*different', 'built\\s*diff',
  'on\\s*top', 'on\\s*another\\s*level',
].join('|') + `)`;

// 20+ appreciation verbs (prefix: "I/we X laiys")
const W_APPRECIATION = `(?:` + [
  '(?:i\\s+)?love', '(?:we\\s+)?love', '(?:everyone\\s+)?loves?', '(?:they\\s+)?love', '(?:you\\s+)?love',
  '(?:i\\s+)?adore', '(?:i\\s+)?appreciate', '(?:i\\s+)?respect', '(?:i\\s+)?support',
  '(?:i\\s+)?stan', '(?:we\\s+)?stan', '(?:everyone\\s+)?stans?',
  '(?:i\\s+)?enjoy', '(?:i\\s+)?like', '(?:i\\s+)?cherish', '(?:i\\s+)?admire', '(?:i\\s+)?worship',
  '(?:i\\s+)?ride\\s+with', '(?:i\\s+)?fuck\\s+with', '(?:i\\s+)?fw', '(?:i\\s+)?rock\\s+with', '(?:i\\s+)?mess\\s+with',
  'big\\s+fan\\s+of', 'biggest\\s+fan\\s+of', 'huge\\s+fan\\s+of',
  'mad\\s+love\\s+for', 'much\\s+love\\s+for', 'all\\s+love\\s+for',
  '(?:i\\s+)?back', '(?:i\\s+)?rep', '(?:i\\s+)?vouch\\s+for',
].join('|') + `)`;

// 25+ W prefix words (come before the name)
const W_PREFIX_WORDS = `(?:` + [
  'w+', 'dub+s?', 'big\\s*w', 'actual\\s*w', 'massive\\s*w',
  'goat(?:ed)?', 'the\\s*goat', 'actual\\s*goat',
  'king', 'legend', 'god', 'sigma', 'mvp', 'the\\s*mvp', 'actual\\s*mvp',
  'fire', 'cold', 'valid', 'real\\s*one', 'based',
  'pog(?:gers)?', 'sheesh', 'facts', 'no\\s*cap', 'bussin',
  'underrated', 'slept\\s*on', 'glazing',
  'respect', 'big\\s*respect', 'much\\s*respect',
  'love', 'big\\s*love', 'much\\s*love', 'we\\s*love', 'i\\s*love', 'everyone\\s*loves?',
  'ate', 'carried', 'cooked', 'elite', 'cracked',
].join('|') + `)`;

// ── L VOCABULARY ─────────────────────────────────────────────

// 100+ negative adjectives
const L_ADJ = `(?:` + [
  'trash', 'garbage', 'dogwater', 'donkey', 'bum', 'scrub',
  'mid', 'mediocre', 'average', 'below\\s*average', 'subpar', 'pedestrian',
  'bad', 'terrible', 'horrible', 'awful', 'atrocious', 'horrendous', 'dreadful', 'ghastly', 'dire', 'abysmal',
  'ass', 'ass\\s*af', 'ass\\s*asf', 'absolute\\s*ass', 'pure\\s*ass', 'complete\\s*ass',
  'cringe', 'cringy', 'cringe\\s*af', 'cringe\\s*asf', 'cringeworthy',
  'weird', 'strange', 'odd', 'creepy', 'sketchy', 'sus', 'suspicious',
  'annoying', 'irritating', 'infuriating', 'aggravating', 'insufferable', 'unbearable',
  'toxic', 'cancerous', 'cancer', 'corrosive',
  'pathetic', 'pitiful', 'miserable', 'deplorable', 'disgraceful', 'shameful', 'embarrassing', 'humiliating', 'mortifying',
  'ridiculous', 'absurd', 'ludicrous', 'preposterous', 'outrageous', 'egregious', 'laughable',
  'gross', 'disgusting', 'revolting', 'repulsive', 'vile', 'foul', 'rancid', 'putrid', 'stinky', 'smelly', 'sickening',
  'ugly', 'hideous', 'repugnant', 'abhorrent', 'loathsome', 'detestable', 'despicable',
  'worthless', 'useless', 'pointless', 'hopeless', 'helpless', 'clueless',
  'braindead', 'mindless', 'brainless', 'senseless', 'thoughtless', 'vapid', 'empty',
  'irrelevant', 'washed', 'done', 'finished', 'cooked', 'dead', 'over', 'gone', 'expired', 'buried', 'cancelled', 'deleted',
  'soft', 'scared', 'cowardly', 'spineless',
  'fake', 'phony', 'fraudulent',
  'overrated', 'overhyped', 'overpraised',
  'lame', 'boring', 'dull', 'bland', 'dry',
  'basic', 'predictable', 'unoriginal', 'generic', 'cookie\\s*cutter',
  'weak', 'feeble', 'frail', 'fragile', 'brittle',
  'ew+', 'eww+', 'yuck', 'yikes', 'oof', 'bruh',
  'not\\s*him', 'not\\s*it', 'not\\s*real', 'cap', 'capping',
  'clout\\s*chasing', 'leaching', 'parasitic',
  'delusional', 'lost', 'cooked', 'done\\s*for',
  'never\\s*was', 'has\\s*been',
].join('|') + `)`;

// 40+ negative identity noun phrases
const L_IDENTITY = `(?:` + [
  'a\\s*bot', 'a\\s*npc', 'an?\\s*npc', 'a\\s*robot', 'a\\s*script',
  'a\\s*clown', 'a\\s*clown\\s*ass', 'a\\s*whole\\s*clown', 'an?\\s*actual\\s*clown',
  'a\\s*bozo', 'a\\s*whole\\s*bozo', 'an?\\s*actual\\s*bozo', 'a\\s*certified\\s*bozo',
  'a\\s*joke', 'a\\s*punchline', 'a\\s*meme', 'a\\s*laughingstock',
  'a\\s*fraud', 'a\\s*liar', 'a\\s*snake', 'a\\s*rat', 'a\\s*snitch',
  'a\\s*leech', 'a\\s*clout\\s*chaser', 'a\\s*parasite', 'a\\s*sellout',
  'a\\s*loser', 'a\\s*failure', 'a\\s*disappointment', 'a\\s*disgrace', 'an?\\s*embarrassment',
  'a\\s*bum', 'a\\s*nobody', 'a\\s*nothing', 'a\\s*zero', 'a\\s*big\\s*zero',
  'nothing', 'nobody', 'irrelevant', 'replaceable', 'forgettable', 'disposable',
  'a\\s*has\\s*been', 'a\\s*never\\s*was', 'washed\\s*up',
  'a\\s*waste', 'a\\s*waste\\s*of\\s*time', 'a\\s*waste\\s*of\\s*space',
  'not\\s*him', 'not\\s*the\\s*guy', 'not\\s*that\\s*dude', 'not\\s*it', 'not\\s*the\\s*one',
  'not\\s*real', 'not\\s*built\\s*for\\s*this', 'not\\s*cut\\s*out\\s*for\\s*this',
  'not\\s*meant\\s*for\\s*this', 'not\\s*gonna\\s*make\\s*it',
  'done\\s*for', 'finished', 'over\\s*for',
  'a\\s*mistake', 'a\\s*liability', 'a\\s*burden', 'a\\s*problem',
  'dead\\s*weight', 'background\\s*noise', 'a\\s*sideshow', 'a\\s*distraction',
  'out\\s*of\\s*place', 'out\\s*of\\s*his\\s*league', 'out\\s*of\\s*his\\s*depth',
  'a\\s*spectator', 'a\\s*seat\\s*filler',
].join('|') + `)`;

// 40+ negative action verbs / state phrases
const L_ACTIONS = `(?:` + [
  'fell\\s*off', 'falling\\s*off', 'fell\\s*off\\s*hard', 'fell\\s*off\\s*bad',
  'sucks', 'stinks', 'stank', 'reeks', 'smells',
  'flopped', 'bombed', 'choked', 'fumbled', 'fumbled\\s*the\\s*bag', 'bricked', 'bricked\\s*it',
  'missed', 'missed\\s*hard', 'missed\\s*badly',
  'cooked\\s*himself', 'cooked\\s*themselves', 'cooked\\s*it\\s*bad',
  'is\\s*irrelevant', 'is\\s*nobody', 'is\\s*nothing',
  'is\\s*trash', 'is\\s*garbage', 'is\\s*mid', 'is\\s*bad', 'is\\s*terrible',
  'is\\s*awful', 'is\\s*horrible', 'is\\s*washed', 'is\\s*done', 'is\\s*finished',
  'is\\s*dead', 'is\\s*over', 'is\\s*expired', 'is\\s*cooked', 'is\\s*cancelled',
  'is\\s*cringe', 'is\\s*annoying', 'is\\s*weird', 'is\\s*toxic',
  'is\\s*fake', 'is\\s*a\\s*fraud', 'is\\s*a\\s*liar', 'is\\s*a\\s*snake',
  'is\\s*boring', 'is\\s*lame', 'is\\s*overrated', 'is\\s*pathetic',
  'is\\s*a\\s*clown', 'is\\s*a\\s*bozo', 'is\\s*a\\s*bot', 'is\\s*a\\s*npc',
  'is\\s*a\\s*joke', 'is\\s*a\\s*loser', 'is\\s*a\\s*bum', 'is\\s*a\\s*nobody',
  'is\\s*replaceable', 'is\\s*forgettable', 'is\\s*disposable',
  'is\\s*a\\s*has\\s*been', 'is\\s*not\\s*him', 'is\\s*not\\s*it', 'is\\s*not\\s*the\\s*guy',
  'will\\s*never\\s*be\\s*good', 'will\\s*never\\s*improve', 'will\\s*never\\s*be\\s*him',
  'should\\s*quit', 'should\\s*retire', 'should\\s*leave', 'should\\s*stop', 'needs\\s*to\\s*quit',
  'never\\s*was', 'never\\s*will\\s*be',
].join('|') + `)`;

// 20+ hate verbs (prefix: "I/we X laiys")
const L_HATE = `(?:` + [
  '(?:i\\s+)?hate', '(?:we\\s+)?hate', '(?:everyone\\s+)?hates?', '(?:they\\s+)?hate',
  '(?:i\\s+)?despise', '(?:i\\s+)?detest', '(?:i\\s+)?loathe', '(?:i\\s+)?dislike',
  'can\'t\\s+stand', 'cannot\\s+stand', 'cant\\s+stand',
  'can\'t\\s+watch', 'cannot\\s+watch', 'cant\\s+watch', 'can\'t\\s+stand\\s+watching',
  '(?:i\\s+)?cringe\\s+at', '(?:i\\s+)?cringe\\s+watching',
  'no\\s+one\\s+likes?', 'nobody\\s+likes?', 'everybody\\s+hates?', 'everyone\\s+hates?',
  'nobody\\s+wants?', 'no\\s+one\\s+wants?',
  '(?:i\\s+)?cannot\\s+stand', '(?:i\\s+)?absolutely\\s+hate',
].join('|') + `)`;

// 25+ silence / dismissal commands
const L_SILENCERS = `(?:` + [
  'shut\\s*(?:the\\s*f(?:uck)?\\s*)?up', 'stfu', 'stf', 'su',
  'pipe\\s*down', 'chill', 'stop\\s*talking', 'stop\\s*speaking', 'be\\s*quiet', 'zip\\s*it',
  'nobody\\s*asked', 'no\\s*one\\s*asked', 'did\\s*anyone\\s*ask', 'who\\s*asked', 'who\\s*tf\\s*asked',
  'nobody\\s*cares?', 'no\\s*one\\s*cares?', 'who\\s*cares?',
  'log\\s*off', 'log\\s*out', 'get\\s*off', 'get\\s*out', 'leave', 'go\\s*away', 'go\\s*home',
  'quit', 'retire', 'delete', 'uninstall', 'vanish', 'disappear', 'touch\\s*grass',
  'kys', 'end\\s*it',
  'nobody\\s*wants\\s*(?:you|him|u)', 'no\\s*one\\s*wants\\s*(?:you|him|u)',
  'nobody\\s*likes\\s*(?:you|him|u)', 'no\\s*one\\s*likes\\s*(?:you|him|u)',
].join('|') + `)`;

// 25+ L prefix words (come before name)
const L_PREFIX_WORDS = `(?:` + [
  'l+', 'big\\s*l', 'actual\\s*l', 'massive\\s*l', 'permanent\\s*l', 'certified\\s*l',
  'ratio(?:d|ed)?', 'get\\s*ratio(?:d|ed)?',
  'cope', 'copium', 'skill\\s*issue', 'get\\s*good', 'git\\s*gud', 'get\\s*better',
  'trash', 'garbage', 'bozo', 'clown', 'bum',
  'npc', 'bot', 'robot',
  'ew+', 'eww+', 'gross', 'yuck', 'yikes', 'oof', 'disgusting', 'revolting',
  'smh', 'lmao', 'lmfao', 'bruh',
  'nobody\\s*likes?', 'no\\s*one\\s*likes?', 'everyone\\s*hates?',
].join('|') + `)`;

// ── Pattern builder ───────────────────────────────────────────

function buildPatterns() {
  const flags = 'i';
  const p = (r, type, weight) => ({ pattern: new RegExp(r, flags), type, weight });
  const nm = NAME;
  const cm = CAM;
  const cop = COPULA;

  return [

    // ══════════════════════════════════════════════════════════
    //  W PATTERNS
    // ══════════════════════════════════════════════════════════

    // Appreciation: "love laiys", "we love laiys", "i love laiys"
    p(`${W_APPRECIATION}\\s+${nm}`, 'w', 3),
    p(`${W_APPRECIATION}\\s+${cm}`, 'w', 3),

    // W prefix before name: "W laiys", "king laiys", "goat laiys"
    p(`\\b${W_PREFIX_WORDS}\\s+${nm}\\b`, 'w', 2),
    p(`\\b${W_PREFIX_WORDS}\\s+${cm}\\b`, 'w', 2),

    // Name then W prefix: "laiys W", "laiys goat"
    p(`\\b${nm}\\s+${W_PREFIX_WORDS}\\b`, 'w', 2),
    p(`\\b${cm}\\s+${W_PREFIX_WORDS}\\b`, 'w', 2),

    // Name + copula + W adjective: "laiys is fire", "laiys is cold"
    p(`\\b${nm}\\s+${cop}\\s+${W_ADJ}\\b`, 'w', 2),
    p(`\\b${cm}\\s+${cop}\\s+${W_ADJ}\\b`, 'w', 2),

    // Name + copula + W identity: "laiys is the goat", "laiys is a king"
    p(`\\b${nm}\\s+${cop}\\s+${W_IDENTITY}\\b`, 'w', 2),
    p(`\\b${cm}\\s+${cop}\\s+${W_IDENTITY}\\b`, 'w', 2),

    // Name + W adjective (no copula): "laiys fire", "laiys cold"
    p(`\\b${nm}\\s+${W_ADJ}\\b`, 'w', 1),
    p(`\\b${cm}\\s+${W_ADJ}\\b`, 'w', 1),

    // Name + W identity (no copula): "laiys the goat", "laiys a legend"
    p(`\\b${nm}\\s+${W_IDENTITY}\\b`, 'w', 1),
    p(`\\b${cm}\\s+${W_IDENTITY}\\b`, 'w', 1),

    // W adjective before name: "fire laiys", "cold laiys"
    p(`\\b${W_ADJ}\\s+${nm}\\b`, 'w', 1),
    p(`\\b${W_ADJ}\\s+${cm}\\b`, 'w', 1),

    // W identity before name: "the goat laiys", "a legend laiys"
    p(`\\b${W_IDENTITY}\\s+${nm}\\b`, 'w', 1),
    p(`\\b${W_IDENTITY}\\s+${cm}\\b`, 'w', 1),

    // Name + positive actions
    p(`\\b${nm}\\s+${W_ACTIONS}\\b`, 'w', 2),
    p(`\\b${cm}\\s+${W_ACTIONS}\\b`, 'w', 2),

    // Explicit hard-coded W phrases (all the ones the user listed)
    p(`(?:laiys|lays)\\s+is\\s+that\\s+(?:guy|dude)`,      'w', 3),
    p(`(?:laiys|lays)\\s+different`,                         'w', 2),
    p(`(?:laiys|lays)\\s+on\\s+top`,                        'w', 2),
    p(`(?:laiys|lays)\\s+winning`,                           'w', 2),
    p(`(?:laiys|lays)\\s+goes?\\s+hard`,                    'w', 2),
    p(`(?:laiys|lays)\\s+built\\s+diff(?:erent)?`,          'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+cold`,                       'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+fire`,                       'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+hard`,                       'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+crazy`,                      'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+insane`,                     'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+real`,                       'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+valid`,                      'w', 2),
    p(`(?:laiys|lays)\\s+carried`,                           'w', 2),
    p(`(?:laiys|lays)\\s+ate`,                               'w', 2),
    p(`(?:laiys|lays)\\s+snapped`,                           'w', 2),
    p(`(?:laiys|lays)\\s+bodied`,                            'w', 2),
    p(`(?:laiys|lays)\\s+went\\s+crazy`,                    'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+elite`,                      'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+(?:a\\s+)?god`,             'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+goated`,                     'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+the\\s+goat`,               'w', 3),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+legend`,               'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+king`,                 'w', 2),
    p(`(?:laiys|lays)\\s+cooked`,                            'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+sigma`,                      'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+based`,                      'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+bussin`,                     'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+different`,                  'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+on\\s+another\\s+level`,    'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+built\\s+diff(?:erent)?`,   'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+real\\s+one`,          'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+facts`,                      'w', 2),
    p(`(?:laiys|lays)\\s+goes\\s+crazy`,                    'w', 2),
    p(`(?:laiys|lays)\\s+goes\\s+hard`,                     'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+cracked`,                    'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+clean`,                      'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+(?:a\\s+)?menace`,          'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+him`,                        'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+the\\s+(?:guy|man|one)`,    'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+that\\s+dude`,              'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+special`,                    'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+unique`,                     'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+raw`,                        'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+unmatched`,                  'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+undefeated`,                 'w', 2),
    p(`(?:laiys|lays)\\s+never\\s+loses?`,                  'w', 2),
    p(`(?:laiys|lays)\\s+always\\s+wins?`,                  'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+untouchable`,                'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+unstoppable`,                'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+inevitable`,                 'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+powerful`,                   'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+strong`,                     'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+smart`,                      'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+funny`,                      'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+hilarious`,                  'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+entertaining`,               'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+fun`,                        'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+enjoyable`,                  'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+wholesome`,                  'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+cool`,                       'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+awesome`,                    'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+amazing`,                    'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+incredible`,                 'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+unbelievable`,               'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+legendary`,                  'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+iconic`,                     'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+historic`,                   'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+perfect`,                    'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+flawless`,                   'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+immaculate`,                 'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+number\\s+one`,              'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+the\\s+best`,               'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+better`,                     'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+superior`,                   'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+dominant`,                   'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+the\\s+GOAT`,               'w', 3),
    p(`(?:laiys|lays)\\s+is\\s+nice`,                       'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+great`,                      'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+nasty`,                      'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+(?:monster|beast|machine|demon)`, 'w', 2),
    p(`(?:laiys|lays)\\s+hard\\s+carried`,                  'w', 3),
    p(`(?:laiys|lays)\\s+solo\\s+carried`,                  'w', 3),
    p(`(?:laiys|lays)\\s+ate\\s+(?:and\\s+)?(?:left\\s+)?no\\s+crumbs?`, 'w', 3),
    p(`i\\s+love\\s+(?:laiys|lays)`,                        'w', 3),
    p(`we\\s+love\\s+(?:laiys|lays)`,                       'w', 3),
    p(`love\\s+(?:laiys|lays)`,                              'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+on\\s+top`,                 'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+winning`,                    'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+whole\\s+vibe`,        'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+too\\s+(?:good|cold|hard|fire|crazy|elite)`, 'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+(?:insanely|actually|genuinely|literally)\\s+good`, 'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+so\\s+(?:good|great|cool|funny|smart|fire|cold|hard)`, 'w', 2),
    p(`(?:laiys|lays)\\s+never\\s+misses?`,                 'w', 2),
    p(`(?:laiys|lays)\\s+always\\s+delivers?`,              'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+locked\\s+in`,              'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+in\\s+a\\s+different\\s+league`, 'w', 2),
    p(`(?:laiys|lays)\\s+is\\s+one\\s+of\\s+a\\s+kind`,   'w', 2),
    p(`(?:laiys|lays)\\s+popped\\s+off`,                    'w', 2),
    p(`(?:laiys|lays)\\s+went\\s+off`,                      'w', 2),
    p(`(?:laiys|lays)\\s+went\\s+(?:stupid|dumb|hard|insane|nuts)`, 'w', 2),
    p(`(?:laiys|lays)\\s+no\\s+diff(?:ed)?`,               'w', 2),

    // Emoji W patterns
    p(`\\b${nm}\\s*(?:🔥|💯|👑|📈|✅|👍|🐐|💪|⭐|🌟|😤|🔝|💎|🏆|🫡|🫶|❤️|💙|🙏)`, 'w', 1),
    p(`\\b${cm}\\s*(?:🔥|💯|👑|📈|✅|👍|🐐|💪|⭐|🌟|😤|🔝|💎|🏆|🫡|🫶|❤️|💙|🙏)`, 'w', 1),
    p(`(?:🔥|💯|👑|🐐|💪|⭐|🌟|💎|🏆)\\s*\\b${nm}`, 'w', 1),
    p(`(?:🔥|💯|👑|🐐|💪|⭐|🌟|💎|🏆)\\s*\\b${cm}`, 'w', 1),

    // ══════════════════════════════════════════════════════════
    //  L PATTERNS
    // ══════════════════════════════════════════════════════════

    // Disgust/gross prefix: "eww laiys", "gross laiys", "yuck laiys"
    p(`(?:eww+|ew+|gross|yuck|disgusting|revolting|repulsive)\\s+${nm}`, 'l', 3),
    p(`(?:eww+|ew+|gross|yuck|disgusting|revolting|repulsive)\\s+${cm}`, 'l', 3),

    // L prefix before name: "L laiys", "ratio laiys", "trash laiys"
    p(`\\b${L_PREFIX_WORDS}\\s+${nm}\\b`, 'l', 2),
    p(`\\b${L_PREFIX_WORDS}\\s+${cm}\\b`, 'l', 2),

    // Name then L prefix: "laiys L", "laiys trash"
    p(`\\b${nm}\\s+${L_PREFIX_WORDS}\\b`, 'l', 2),
    p(`\\b${cm}\\s+${L_PREFIX_WORDS}\\b`, 'l', 2),

    // Hate: "hate laiys", "everyone hates laiys"
    p(`${L_HATE}\\s+${nm}`, 'l', 3),
    p(`${L_HATE}\\s+${cm}`, 'l', 3),

    // Silence: "shut up laiys", "nobody asked laiys"
    p(`\\b${L_SILENCERS}\\s+${nm}\\b`, 'l', 2),
    p(`\\b${L_SILENCERS}\\s+${cm}\\b`, 'l', 2),
    p(`\\b${nm}\\s+${L_SILENCERS}\\b`, 'l', 2),
    p(`\\b${cm}\\s+${L_SILENCERS}\\b`, 'l', 2),

    // Name + negative actions
    p(`\\b${nm}\\s+${L_ACTIONS}\\b`, 'l', 2),
    p(`\\b${cm}\\s+${L_ACTIONS}\\b`, 'l', 2),

    // Name + copula + L adjective: "laiys is trash", "laiys is mid"
    p(`\\b${nm}\\s+(?:is|was|has\\s*been|got|been)\\s+${L_ADJ}\\b`, 'l', 2),
    p(`\\b${cm}\\s+(?:is|was|has\\s*been|got|been)\\s+${L_ADJ}\\b`, 'l', 2),

    // Name + copula + L identity: "laiys is a bot", "laiys is a clown"
    p(`\\b${nm}\\s+(?:is|was)\\s+${L_IDENTITY}\\b`, 'l', 2),
    p(`\\b${cm}\\s+(?:is|was)\\s+${L_IDENTITY}\\b`, 'l', 2),

    // Name + L adjective (no copula)
    p(`\\b${nm}\\s+${L_ADJ}\\b`, 'l', 1),
    p(`\\b${cm}\\s+${L_ADJ}\\b`, 'l', 1),

    // L adjective before name
    p(`\\b${L_ADJ}\\s+${nm}\\b`, 'l', 1),
    p(`\\b${L_ADJ}\\s+${cm}\\b`, 'l', 1),

    // L identity before name
    p(`\\b${L_IDENTITY}\\s+${nm}\\b`, 'l', 1),
    p(`\\b${L_IDENTITY}\\s+${cm}\\b`, 'l', 1),

    // Explicit hard-coded L phrases (all the user listed)
    p(`(?:laiys|lays)\\s+fell\\s+off`,                       'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+washed`,                      'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+done`,                        'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+finished`,                    'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+cooked`,                      'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+dead`,                        'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+irrelevant`,                  'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+overrated`,                   'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+bot`,                   'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+npc`,                   'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+clown`,                 'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+bozo`,                  'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+joke`,                  'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+fraud`,                 'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+liar`,                  'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+snake`,                 'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+rat`,                   'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+loser`,                 'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+nobody`,                'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+bum`,                   'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+pathetic`,                    'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+sad`,                         'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+failure`,               'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+disappointment`,        'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+replaceable`,                 'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+forgettable`,                 'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+not\\s+him`,                 'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+not\\s+the\\s+guy`,         'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+not\\s+it`,                  'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+not\\s+real`,                'l', 2),
    p(`(?:laiys|lays)\\s+should\\s+quit`,                    'l', 2),
    p(`(?:laiys|lays)\\s+should\\s+retire`,                  'l', 2),
    p(`(?:laiys|lays)\\s+should\\s+leave`,                   'l', 2),
    p(`(?:laiys|lays)\\s+needs\\s+to\\s+quit`,              'l', 2),
    p(`(?:laiys|lays)\\s+sucks`,                             'l', 2),
    p(`(?:laiys|lays)\\s+stinks`,                            'l', 2),
    p(`(?:laiys|lays)\\s+flopped`,                           'l', 2),
    p(`(?:laiys|lays)\\s+choked`,                            'l', 2),
    p(`(?:laiys|lays)\\s+fumbled`,                           'l', 2),
    p(`(?:laiys|lays)\\s+bricked`,                           'l', 2),
    p(`(?:laiys|lays)\\s+never\\s+was`,                     'l', 2),
    p(`(?:laiys|lays)\\s+never\\s+will\\s+be`,              'l', 2),
    p(`(?:laiys|lays)\\s+doesn't\\s+belong`,                'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+cringe`,                     'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+annoying`,                   'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+weird`,                      'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+toxic`,                      'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+boring`,                     'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+lame`,                       'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+fake`,                       'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+mid`,                        'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+trash`,                      'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+garbage`,                    'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+bad`,                        'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+terrible`,                   'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+horrible`,                   'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+awful`,                      'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+disgusting`,                 'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+gross`,                      'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+ugly`,                       'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+nothing`,                    'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+nobody`,                     'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+worthless`,                  'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+useless`,                    'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+pointless`,                  'l', 2),
    p(`eww+\\s+(?:laiys|lays)`,                              'l', 3),
    p(`ew+\\s+(?:laiys|lays)`,                               'l', 3),
    p(`gross\\s+(?:laiys|lays)`,                             'l', 3),
    p(`yuck\\s+(?:laiys|lays)`,                              'l', 3),
    p(`i\\s+hate\\s+(?:laiys|lays)`,                        'l', 3),
    p(`we\\s+hate\\s+(?:laiys|lays)`,                       'l', 3),
    p(`hate\\s+(?:laiys|lays)`,                              'l', 2),
    p(`everyone\\s+hates?\\s+(?:laiys|lays)`,               'l', 3),
    p(`nobody\\s+likes?\\s+(?:laiys|lays)`,                 'l', 3),
    p(`no\\s+one\\s+(?:asked|cares?|likes?)\\s+(?:about\\s+)?(?:laiys|lays)`, 'l', 2),
    p(`(?:nobody|no\\s+one)\\s+wants?\\s+(?:laiys|lays)`,  'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+waste(?:\\s+of\\s+(?:time|space))?`, 'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+(?:has\\s*been|never\\s*was)`, 'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+done\\s+for`,                'l', 2),
    p(`(?:laiys|lays)\\s+will\\s+never\\s+be\\s+good`,      'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+out\\s+of\\s+his\\s+(?:league|depth)`, 'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+a\\s+(?:clout\\s*chaser|leech|parasite)`, 'l', 2),
    p(`(?:laiys|lays)\\s+is\\s+(?:delusional|lost|cooked|expired)`, 'l', 2),

    // Emoji L patterns
    p(`\\b${nm}\\s*(?:💀|🗑️?|🤡|📉|❌|👎|🚮|🗑|💩|🤮|😬|🤣|😂|☠️)`, 'l', 1),
    p(`\\b${cm}\\s*(?:💀|🗑️?|🤡|📉|❌|👎|🚮|🗑|💩|🤮|😬|🤣|😂|☠️)`, 'l', 1),
    p(`(?:💀|🤡|🗑️?|❌|👎|🚮|💩|🤮)\\s*\\b${nm}`, 'l', 1),
    p(`(?:💀|🤡|🗑️?|❌|👎|🚮|💩|🤮)\\s*\\b${cm}`, 'l', 1),

  ];
}

const PATTERNS = buildPatterns();

// Keyword filter — does this message mention laiys/lays/cam?
const KEYWORD_RE = /\b(?:la[iy]+[sz]?s?|lay[sz]?|laiz|lais|layz|l4iys|laiys|lays|cam(?:era)?(?:man)?|cammer|camman|cammy|cam1|xcam)\b/i;

/**
 * Classify a chat message synchronously via regex.
 * Returns { type: 'w'|'l'|null, score: number, matched: string[] }
 */
function classify(text) {
  let wScore = 0, lScore = 0;
  const matched = [];

  for (const { pattern, type, weight } of PATTERNS) {
    const m = text.match(pattern);
    if (m) {
      if (type === 'w') wScore += weight;
      else lScore += weight;
      matched.push(m[0]);
    }
  }

  if (wScore === 0 && lScore === 0) return { type: null, score: 0, matched: [] };
  if (wScore >= lScore) return { type: 'w', score: wScore, matched };
  return { type: 'l', score: lScore, matched };
}

// Export for browser (global) and Node
if (typeof module !== 'undefined') module.exports = { classify, PATTERNS, KEYWORD_RE };
else window.TrackerPatterns = { classify, PATTERNS, KEYWORD_RE };
