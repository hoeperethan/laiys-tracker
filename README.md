# laiys tracker

Real-time Twitch chat W/L tracker for laiys.

## Run locally

You need Node.js installed (comes with Claude Code).

```bash
cd laiys-tracker
node server.js
```

Then open http://localhost:3000 in your browser.

1. Type the Twitch channel name in the top right input
2. Hit Connect
3. Watch the W/L counts and leaderboards update live

## What it tracks

**W mentions** (positive / glazing):
- "W laiys", "W cam", "dub laiys"
- "laiys cooked", "laiys ate", "laiys carried"
- "laiys is goated / fire / cold / based"
- "goat laiys", "king laiys", "W cameraman"
- emoji combos: laiys 🔥💯👑🐐

**L mentions** (negative / hate):
- "L laiys", "L cam", "ratio laiys"
- "su laiys", "stfu laiys", "shut up laiys"
- "laiys is trash / mid / garbage / washed"
- "nobody asked laiys", "laiys fell off"
- emoji combos: laiys 💀🗑🤡📉

## Files

- `index.html` — the full UI
- `patterns.js` — all the W/L detection patterns
- `server.js` — local web server
