// ============================================================
//  laiys tracker — Twitch IRC bot
//  Connects to stableronaldo's chat, classifies W/L mentions,
//  and saves them to Supabase.
//
//  Run: node bot.js
//  Env vars (optional override): SUPABASE_URL, SUPABASE_KEY, CHANNEL
// ============================================================

require('dotenv').config();
const WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
const { classifyFull } = require('./patterns.js');

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

let reconnectDelay = 2000;

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

  console.log(`[${result.type.toUpperCase()}] ${username}: ${message}`);

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
