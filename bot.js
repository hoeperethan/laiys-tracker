// ============================================================
//  laiys tracker — Twitch IRC bot
//  Connects to stableronaldo's chat, classifies W/L mentions,
//  and saves them to Supabase.
//
//  Run: node bot.js
//  Env vars: SUPABASE_URL, SUPABASE_KEY, CHANNEL, GEMINI_API_KEY
// ============================================================

require('dotenv').config();
const WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
const { classify, KEYWORD_RE } = require('./patterns.js');

const SUPABASE_URL  = process.env.SUPABASE_URL;
const SUPABASE_KEY  = process.env.SUPABASE_KEY;
const CHANNEL       = process.env.CHANNEL || 'stableronaldo';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDzgzzbiyQCdlFBbREiDDGBFUz__Ftnr_M';
const GEMINI_URL    = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('[bot] SUPABASE_URL and SUPABASE_KEY env vars are required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let reconnectDelay = 2000;

/**
 * Gemini AI sentiment fallback.
 * Called only when the regex patterns return no match and the message
 * contains a relevant keyword (laiys / lays / cam / cameraman).
 * Returns { type: 'w'|'l'|null }
 */
async function aiClassify(text) {
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Is this chat message positive or negative about laiys? Reply with only W for positive or L for negative.\n\nMessage: ${text}`,
          }],
        }],
      }),
    });
    if (!res.ok) {
      console.error('[ai] Gemini HTTP error:', res.status, await res.text());
      return { type: null };
    }
    const json = await res.json();
    const answer = (json.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim().toUpperCase();
    if (answer.startsWith('W')) return { type: 'w' };
    if (answer.startsWith('L')) return { type: 'l' };
    return { type: null };
  } catch (err) {
    console.error('[ai] Gemini classify error:', err.message);
    return { type: null };
  }
}

/**
 * Full classifier: fast regex first, Gemini fallback if unmatched.
 * Returns { type: 'w'|'l'|null, score, matched, source }
 */
async function classifyFull(text) {
  const result = classify(text);
  if (result.type !== null) return { ...result, source: 'regex' };

  // Only call AI if the message contains a relevant keyword
  if (!KEYWORD_RE.test(text)) return { ...result, source: 'regex' };

  const ai = await aiClassify(text); // Gemini fallback
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
