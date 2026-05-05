// ============================================================
//  laiys tracker — Twitch IRC bot
//  Connects to stableronaldo's chat, classifies W/L mentions,
//  and saves them to Supabase.
//
//  Run: node bot.js
//  Env vars: SUPABASE_URL, SUPABASE_KEY, CHANNEL, ANTHROPIC_API_KEY
// ============================================================

require('dotenv').config();
const WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');
const { classify, KEYWORD_RE } = require('./patterns.js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const CHANNEL      = process.env.CHANNEL || 'stableronaldo';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[bot] SUPABASE_URL and SUPABASE_KEY env vars are required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Initialize Anthropic client (null if no API key — AI fallback is optional)
const ai = process.env.ANTHROPIC_API_KEY
  ? new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

if (!ai) {
  console.warn('[bot] ANTHROPIC_API_KEY not set — AI sentiment fallback disabled');
}

let reconnectDelay = 2000;

/**
 * Claude AI sentiment fallback.
 * Called only when the regex patterns return no match and the message
 * contains a relevant keyword (laiys / lays / cam / cameraman).
 * Returns { type: 'w'|'l'|null }
 */
async function aiClassify(text) {
  if (!ai) return { type: null };
  try {
    const response = await ai.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 10,
      system:
        'You classify Twitch chat messages as positive or negative about a streamer named "laiys" ' +
        '(also known as lays, cam, cameraman). ' +
        'Reply with exactly one word: "positive" or "negative". No explanation, no punctuation.',
      messages: [{ role: 'user', content: text }],
    });
    const answer = response.content?.[0]?.text?.trim().toLowerCase() ?? '';
    if (answer.startsWith('pos')) return { type: 'w' };
    if (answer.startsWith('neg')) return { type: 'l' };
    return { type: null };
  } catch (err) {
    console.error('[ai] classify error:', err.message);
    return { type: null };
  }
}

/**
 * Full classifier: fast regex first, Claude AI fallback if unmatched.
 * Returns { type: 'w'|'l'|null, score, matched, source }
 */
async function classifyFull(text) {
  const result = classify(text);
  if (result.type !== null) return { ...result, source: 'regex' };

  // Only call AI if the message contains a relevant keyword
  if (!KEYWORD_RE.test(text)) return { ...result, source: 'regex' };

  const ai = await aiClassify(text);
  if (ai.type) {
    console.log(`[ai] fallback classified as ${ai.type.toUpperCase()}: ${text}`);
    return { type: ai.type, score: 1, matched: ['[AI]'], source: 'ai' };
  }
  return { type: null, score: 0, matched: [], source: 'none' };
}

function connect() {
  console.log(`[bot] connecting to #${CHANNEL}...`);
  const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

  ws.on('open', () => {
    ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
    const id = Math.floor(Math.random() * 89999) + 10000;
    ws.send(`PASS oauth:justinfan${id}`);
    ws.send(`NICK justinfan${id}`);
    ws.send(`JOIN #${CHANNEL}`);
  });

  ws.on('message', (data) => {
    // Twitch batches multiple IRC lines per frame
    const lines = data.toString().split('\r\n');
    for (const line of lines) {
      const raw = line.trim();
      if (!raw) continue;
      if (raw.startsWith('PING')) { ws.send('PONG :tmi.twitch.tv'); continue; }
      if (raw.includes(`:tmi.twitch.tv 001`)) {
        console.log(`[bot] joined #${CHANNEL}`);
        reconnectDelay = 2000;
      }
      handleLine(raw);
    }
  });

  ws.on('close', () => {
    console.log(`[bot] disconnected — reconnecting in ${reconnectDelay / 1000}s`);
    setTimeout(connect, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, 30000);
  });

  ws.on('error', (err) => {
    console.error('[bot] ws error:', err.message);
  });
}

async function handleLine(raw) {
  // Extract display-name from IRCv3 tags
  let displayName = null;
  if (raw.startsWith('@')) {
    const tags = raw.slice(1, raw.indexOf(' '));
    const dn = tags.match(/display-name=([^;]+)/);
    if (dn && dn[1]) displayName = dn[1];
  }

  const match = raw.match(/:([^!]+)![^\s]+ PRIVMSG #[^\s]+ :(.+)/);
  if (!match) return;

  const username = displayName || match[1];
  const message  = match[2].trim();
  if (!message) return;

  const result = await classifyFull(message);
  if (!result.type) return;

  console.log(`[${result.type.toUpperCase()}] (${result.source}) ${username}: ${message}`);

  const { data, error } = await supabase
    .from('mentions')
    .insert({ username, type: result.type, message })
    .select();

  if (error) {
    console.error('[bot] insert FAILED — message:', error.message, '| code:', error.code, '| hint:', error.hint, '| details:', error.details);
  } else {
    console.log('[bot] insert OK — id:', data?.[0]?.id, '| user:', username, '| type:', result.type);
  }
}

connect();
