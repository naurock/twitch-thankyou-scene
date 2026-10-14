(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const config = window.CREDITS_CONFIG || {};
  const seconds = Math.max(4, Number(config.pageSeconds) || 12);
  const demo = new URLSearchParams(location.search).get('demo') === '1';
  const empty = { session: '', followers: [], raids: [] };
  let current = empty, signature = '', pages = [], pageIndex = 0, timer;
  const resize = () => {
    const scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    $('stage').style.transform = `scale(${scale})`;
    $('stage').style.left = `${(innerWidth - 1920 * scale) / 2}px`;
    $('stage').style.top = `${(innerHeight - 1080 * scale) / 2}px`;
  };
  addEventListener('resize', resize); resize();
  if (config.channel) $('channel').textContent = config.channel;
  if (config.subtitle) $('subtitle').textContent = config.subtitle;
  if (config.footer) $('footer-text').textContent = config.footer;
  if (/^#[0-9a-f]{6}$/i.test(config.accent)) document.documentElement.style.setProperty('--mint', config.accent);
  if (/^#[0-9a-f]{6}$/i.test(config.warmAccent)) document.documentElement.style.setProperty('--peach', config.warmAccent);
  document.documentElement.style.setProperty('--page-seconds', `${seconds}s`);
  function chunks(items, count, type) {
    const result = [];
    for (let i = 0; i < items.length; i += count) result.push({ type, items: items.slice(i, i + count) });
    return result;
  }
  function makePages() {
    pages = [...chunks(current.followers, 8, 'follow'), ...chunks(current.raids, 3, 'raid'), { type: 'thanks', items: [] }];
  }
  function render() {
    clearTimeout(timer);
    const page = pages[pageIndex] || { type: 'thanks', items: [] };
    const welcome = page.type === 'thanks';
    $('credit-body').className = 'credit-body' + (welcome ? ' welcome' : '');
    $('section-label').textContent = '';
    $('credit-title').textContent = page.type === 'follow' ? 'Neue Follower' : page.type === 'raid' ? 'Raids' : 'Schön, dass ihr da wart.';
    $('section-note').textContent = '';
    const names = $('names'); names.replaceChildren(); names.className = 'names' + (page.type === 'raid' ? ' raids' : '');
    page.items.forEach(item => {
      const row = document.createElement('div'); row.className = 'name';
      if (page.type === 'follow') { const mark = document.createElement('span'); mark.className = 'mark'; mark.textContent = '✦'; row.append(mark); }
      const name = document.createElement('span'); name.className = 'display'; name.textContent = item.name; name.title = item.name; row.append(name);
      if (page.type === 'raid') { const count = document.createElement('span'); count.className = 'raid-count'; count.textContent = item.viewers == null ? 'Willkommen ♡' : `+${item.viewers.toLocaleString('de-DE')} ${item.viewers === 1 ? 'Gast' : 'Gäste'}`; row.append(count); }
      names.append(row);
    });
    // Lange Twitch-Namen passen vollständig hinein, statt abgeschnitten zu werden.
    names.querySelectorAll('.display').forEach(el => { let size = parseFloat(getComputedStyle(el).fontSize); while (el.scrollWidth > el.clientWidth && size > 13) { size--; el.style.fontSize = `${size}px`; } });
    $('page-label').textContent = welcome ? 'BIS BALD' : 'DIESER STREAM';
    $('page-number').textContent = `${String(pageIndex + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}`;
    $('dots').replaceChildren();
    if (pages.length <= 12) pages.forEach((_, i) => { const dot = document.createElement('span'); dot.className = 'dot' + (i === pageIndex ? ' active' : ''); $('dots').append(dot); });
    $('credit-body').classList.remove('enter'); void $('credit-body').offsetWidth; $('credit-body').classList.add('enter');
    $('progress-bar').style.animation = 'none'; void $('progress-bar').offsetWidth; $('progress-bar').style.animation = '';
    timer = setTimeout(() => { makePages(); pageIndex = (pageIndex + 1) % pages.length; render(); }, seconds * 1000);
  }
  function accept(data) {
    if (!data || !Array.isArray(data.followers) || !Array.isArray(data.raids)) return;
    const next = {
      session: String(data.session || ''),
      followers: data.followers.filter(x => x && typeof x.name === 'string' && x.name.trim()),
      raids: data.raids.filter(x => x && typeof x.name === 'string' && x.name.trim()).map(x => ({ ...x, viewers: x.viewers !== null && x.viewers !== undefined && Number.isFinite(Number(x.viewers)) && Number(x.viewers) >= 0 ? Math.floor(Number(x.viewers)) : null }))
    };
    const sig = JSON.stringify(next);
    if (sig === signature) return;
    const restart = next.session !== current.session || signature === '';
    current = next; signature = sig;
    // Neue Namen erscheinen beim nächsten Seitenwechsel, ohne den Abspann laufend zurückzusetzen.
    if (restart) { makePages(); pageIndex = 0; render(); }
  }
  makePages(); render();
  if (demo) {
    $('demo-badge').hidden = false;
    accept({ session: 'demo', followers: ['Mondkind', 'PixelKaffee', 'Nachtfalter', 'LunaSpielt', 'KeksKomplize', 'LeiseDabei', 'Wolkenwanderer', 'Sternenpause', 'EineSehrLangeTwitchKennung'].map(name => ({ name })), raids: [{ name: 'KaffeeKosmos', viewers: 24 }, { name: 'Abendteuer', viewers: 8 }] });
  } else {
    // Klassisches Script funktioniert als lokale OBS-Datei ohne HTTP-Server oder fetch/CORS.
    function poll() {
      const script = document.createElement('script');
      script.src = `data.js?t=${Date.now()}`;
      const finish = () => { script.remove(); setTimeout(poll, 2000); };
      script.onload = () => { accept(window.STREAM_CREDITS); finish(); };
      script.onerror = () => { console.warn('Abspann: data.js nicht lesbar. Letzter Stand bleibt sichtbar.'); finish(); };
      document.head.append(script);
    }
    poll();
  }
})();
