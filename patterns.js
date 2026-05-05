// ============================================================
//  laiys tracker — chat pattern matching engine
//  Covers: laiys / lays / lais / layz / lay / cameraman / cam
// ============================================================

// Core name variations (regex source strings)
const NAME = `(?:la[iy]+[sz]?s?|lay[sz]?|laiz|lais|layz|l4iys|laiys|lays)`;
const CAM  = `(?:cam(?:era)?(?:man)?|cammer|camman|cammy|cam1|xcam)`;

// A "W" prefix — dub, W, WW, dubs, glazing etc.
const W_PREFIX = `(?:w+|dub+s?|glazing|goat(?:ed)?|based|cooked|ate|no\\s*cap|bussin|fire|cold|sheesh|valid|real\\s*one|top|mvp|sigma|king|legend|goated|carried|goes\\s*hard|hard|slept\\s*on|underrated|respect|facts|pog(?:gers)?|actual\\s*god|the\\s*goat|best\\s*cam(?:era)?(?:man)?)`;

// An "L" prefix — ratio, L, cope etc.
const L_PREFIX = `(?:l+|ratio(?:d|ed)?|cope|skill\\s*issue|trash|garbage|mid|bad|ass|terrible|horrible|worst|bozo|clown|npc|bot|fell\\s*off|done|washed|done\\s*for|cooked\\s*(?:him|u|you)?|finished|stick\\s*to|quit|retire|log\\s*off|uninstall|delete|get\\s*out|leave|go\\s*home|no\\s*one\\s*asked|nobody\\s*asked|shut\\s*(?:up|it)|stfu|su|kys|stop|cap|nah|nope|bruh|bro\\s*what|bffr|be\\s*fr|istg|smh|yikes|oof|😬|💀|🗑️|🤡)`;

// Phrases like "laiys is/was/has..."
const COPULA = `(?:is|was|has|been|got|gets|just|always|never|cant|can't|couldn't|shouldn't|won't|will\\s*never)`;

// Negative adjectives that follow a name
const NEG_ADJ = `(?:trash|garbage|mid|bad|ass|terrible|horrible|awful|the\\s*worst|a\\s*bot|a\\s*npc|a\\s*clown|a\\s*bozo|cringe|annoying|irrelevant|done|finished|washed|cooked|dead|over|done\\s*for|🗑|💀|🤡|📉)`;

// Positive adjectives that follow a name
const POS_ADJ = `(?:cold|fire|hard|goated|the\\s*goat|a\\s*legend|a\\s*king|based|real|valid|built\\s*different|different|crazy\\s*good|insane|nuts|actually\\s*good|underrated|slept\\s*on|top\\s*tier|elite|god(?:like)?|the\\s*best|bussin|pog(?:gers)?|🔥|💯|👑|📈|✅|🐐)`;

// "shut up", "su", "stfu" etc before the name
const SILENCERS = `(?:shut\\s*(?:the\\s*f(?:uck)?\\s*)?up|su|stfu|stf|pipe\\s*down|chill|relax|bro\\s*stop|stop\\s*talking|nobody\\s*cares?|no\\s*one\\s*cares?)`;

// Build patterns list
// Each entry: { pattern: RegExp, type: 'w'|'l', weight: number }
function buildPatterns() {
  const flags = 'i';
  return [

    // ── W laiys / W cam ─────────────────────────────────────
    { r: `\\b${W_PREFIX}\\s+${NAME}\\b`,           type: 'w', weight: 2 },
    { r: `\\b${W_PREFIX}\\s+${CAM}\\b`,            type: 'w', weight: 2 },
    { r: `\\b${NAME}\\s+${W_PREFIX}\\b`,           type: 'w', weight: 2 },
    { r: `\\b${CAM}\\s+${W_PREFIX}\\b`,            type: 'w', weight: 2 },

    // name is/was [positive]
    { r: `\\b${NAME}\\s+${COPULA}\\s+${POS_ADJ}\\b`, type: 'w', weight: 2 },
    { r: `\\b${CAM}\\s+${COPULA}\\s+${POS_ADJ}\\b`,  type: 'w', weight: 2 },

    // name [positive] (no copula)
    { r: `\\b${NAME}\\s+${POS_ADJ}\\b`,            type: 'w', weight: 1 },
    { r: `\\b${CAM}\\s+${POS_ADJ}\\b`,             type: 'w', weight: 1 },

    // [positive] [name]
    { r: `\\b${POS_ADJ}\\s+${NAME}\\b`,            type: 'w', weight: 1 },
    { r: `\\b${POS_ADJ}\\s+${CAM}\\b`,             type: 'w', weight: 1 },

    // "laiys ate", "laiys cooked", "laiys carried"
    { r: `\\b${NAME}\\s+(?:ate|cooked|carried|went\\s*off|popped\\s*off|bodied|snapped|no\\s*diff(?:ed)?|diff(?:ed)?)\\b`, type: 'w', weight: 2 },
    { r: `\\b${CAM}\\s+(?:ate|cooked|carried|went\\s*off|popped\\s*off|bodied|snapped|no\\s*diff(?:ed)?|diff(?:ed)?)\\b`,  type: 'w', weight: 2 },

    // glaze-type phrases
    { r: `(?:glazing|simping\\s+for|riding|stan(?:ning)?)\\s+${NAME}`,  type: 'w', weight: 1 },
    { r: `(?:glazing|simping\\s+for|riding|stan(?:ning)?)\\s+${CAM}`,   type: 'w', weight: 1 },

    // ── L laiys / L cam ─────────────────────────────────────
    { r: `\\b${L_PREFIX}\\s+${NAME}\\b`,           type: 'l', weight: 2 },
    { r: `\\b${L_PREFIX}\\s+${CAM}\\b`,            type: 'l', weight: 2 },
    { r: `\\b${NAME}\\s+${L_PREFIX}\\b`,           type: 'l', weight: 2 },
    { r: `\\b${CAM}\\s+${L_PREFIX}\\b`,            type: 'l', weight: 2 },

    // name is/was [negative]
    { r: `\\b${NAME}\\s+${COPULA}\\s+${NEG_ADJ}\\b`, type: 'l', weight: 2 },
    { r: `\\b${CAM}\\s+${COPULA}\\s+${NEG_ADJ}\\b`,  type: 'l', weight: 2 },

    // name [negative] no copula
    { r: `\\b${NAME}\\s+${NEG_ADJ}\\b`,            type: 'l', weight: 1 },
    { r: `\\b${CAM}\\s+${NEG_ADJ}\\b`,             type: 'l', weight: 1 },

    // shut up / stfu laiys
    { r: `\\b${SILENCERS}\\s+${NAME}\\b`,          type: 'l', weight: 2 },
    { r: `\\b${SILENCERS}\\s+${CAM}\\b`,           type: 'l', weight: 2 },
    { r: `\\b${NAME}\\s+${SILENCERS}\\b`,          type: 'l', weight: 2 },

    // "laiys fell off", "laiys is done"
    { r: `\\b${NAME}\\s+(?:fell\\s*off|is\\s*done|is\\s*finished|is\\s*cooked|is\\s*dead|is\\s*washed|is\\s*mid|is\\s*trash|is\\s*garbage|is\\s*irrelevant|is\\s*cringe|is\\s*a\\s*bot|is\\s*a\\s*npc|is\\s*a\\s*clown)\\b`, type: 'l', weight: 2 },
    { r: `\\b${CAM}\\s+(?:fell\\s*off|is\\s*done|is\\s*finished|is\\s*cooked|is\\s*dead|is\\s*washed|is\\s*mid|is\\s*trash|is\\s*garbage|is\\s*irrelevant|is\\s*cringe|is\\s*a\\s*bot|is\\s*a\\s*npc|is\\s*a\\s*clown)\\b`,  type: 'l', weight: 2 },

    // "nobody asked laiys"
    { r: `(?:nobody|no\\s*one)\\s+(?:asked|cares?(?:\\s+about)?)\\s+(?:u\\s+)?${NAME}`, type: 'l', weight: 2 },
    { r: `(?:nobody|no\\s*one)\\s+(?:asked|cares?(?:\\s+about)?)\\s+(?:u\\s+)?${CAM}`,  type: 'l', weight: 2 },

    // standalone name with emojis
    { r: `\\b${NAME}\\s*(?:💀|🗑️?|🤡|📉|❌|👎)`,  type: 'l', weight: 1 },
    { r: `\\b${NAME}\\s*(?:🔥|💯|👑|📈|✅|👍|🐐)`, type: 'w', weight: 1 },
    { r: `\\b${CAM}\\s*(?:💀|🗑️?|🤡|📉|❌|👎)`,   type: 'l', weight: 1 },
    { r: `\\b${CAM}\\s*(?:🔥|💯|👑|📈|✅|👍|🐐)`,  type: 'w', weight: 1 },

  ].map(({ r, type, weight }) => ({ pattern: new RegExp(r, flags), type, weight }));
}

const PATTERNS = buildPatterns();

/**
 * Classify a chat message.
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

  // If both match, higher score wins; tie → 'w'
  if (wScore >= lScore) return { type: 'w', score: wScore, matched };
  return { type: 'l', score: lScore, matched };
}

// Export for browser (global) and Node
if (typeof module !== 'undefined') module.exports = { classify, PATTERNS };
else window.TrackerPatterns = { classify, PATTERNS };
