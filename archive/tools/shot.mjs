#!/usr/bin/env node
/**
 * Full-page screenshots via the Chrome DevTools Protocol.
 *
 *   node tools/shot.mjs <url> <out.png> [width] [height]
 *
 * Scrolls the whole page first so lazy images load and the scroll-triggered
 * reveals fire, returns to the top, then captures beyond the viewport — so the
 * layout viewport stays honest and `100svh` still means one screen.
 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const [url, out, W = 1440, H = 900] = process.argv.slice(2);
if (!url || !out) { console.error('usage: shot.mjs <url> <out.png> [w] [h]'); process.exit(1); }

const PORT = 9222 + (process.pid % 500);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu',
  '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  '--user-data-dir=/tmp/bgs-shot-profile-' + PORT, 'about:blank'
], { stdio: 'ignore' });

let ws, id = 0;
const pending = new Map();
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const msg = { id: ++id, method, params };
  if (sessionId) msg.sessionId = sessionId;
  pending.set(msg.id, { res, rej });
  ws.send(JSON.stringify(msg));
});

try {
  let target;
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250);
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find(t => t.type === 'page');
    } catch { /* not up yet */ }
  }
  if (!target) throw new Error('Chrome did not expose a debugging target');

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));
  ws.addEventListener('message', e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id); pending.delete(m.id);
      m.error ? rej(new Error(m.error.message)) : res(m.result);
    }
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',
    { width: +W, height: +H, deviceScaleFactor: 1, mobile: false });

  await send('Page.navigate', { url });
  await sleep(2500);

  // walk the page so lazy images decode and the reveals fire
  const { result } = await send('Runtime.evaluate',
    { expression: 'document.documentElement.scrollHeight', returnByValue: true });
  const pageH = result.value;
  for (let y = 0; y < pageH; y += Math.round(H * 0.75)) {
    await send('Runtime.evaluate', { expression: `scrollTo({top:${y},behavior:'instant'})` });
    await sleep(230);
  }
  await sleep(1400);
  await send('Runtime.evaluate', { expression: `scrollTo({top:0,behavior:'instant'})` });
  await sleep(700);

  const shot = await send('Page.captureScreenshot',
    { format: 'png', captureBeyondViewport: true, fromSurface: true });
  writeFileSync(out, Buffer.from(shot.data, 'base64'));
  console.log(`${out}  ${W}x${pageH}`);
} finally {
  ws?.close();
  chrome.kill();
}
