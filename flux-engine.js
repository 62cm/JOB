/* 涨落引擎 · 流量/竞品浮动 — 由 build.js 注入 */
function fluxRng(key) {
  const seed = (game ? (game.stockSeed || 0) + game.week * 13 : 1) + (key || '').split('').reduce(function (a, c) { return a + c.charCodeAt(0); }, 0);
  let s = Math.abs(seed) % 2147483646 || 1;
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function ensureFluxState() {
  if (!game) return;
  if (!game.flux) game.flux = { media: {}, ecommerce: {}, categories: {}, stocks: {}, macro: 1 };
  if (game.flux.macro == null) game.flux.macro = 1;
  if (!game.flux.categories) game.flux.categories = {};
  if (!game.flux.stocks) game.flux.stocks = {};
}

function avgCategoryHeat(cat) {
  if (!game || !game.market) return 100;
  const jobs = game.market.filter(function (j) { return j.category === cat; });
  if (!jobs.length) return 100;
  let sum = 0;
  jobs.forEach(function (j) { sum += j.heatPct || 100; });
  return sum / jobs.length;
}

function syncFluxCategoriesFromMarket() {
  if (!game || !game.market) return;
  ensureFluxState();
  const cats = {};
  game.market.forEach(function (j) {
    if (!cats[j.category]) cats[j.category] = [];
    cats[j.category].push(j.heatPct || 100);
  });
  Object.keys(cats).forEach(function (cat) {
    const arr = cats[cat];
    const avg = arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
    const prev = game.flux.categories[cat];
    const index = prev && prev.index != null ? prev.index * 0.7 + avg * 0.3 : avg;
    game.flux.categories[cat] = { index: index, heat: avg, week: game.week, history: (prev && prev.history) || [] };
    const h = game.flux.categories[cat].history;
    if (!h.length || h[h.length - 1].week !== game.week) {
      h.push({ week: game.week, index: Math.round(index) });
      if (h.length > 16) h.shift();
    }
  });
}

function syncFluxStocksFromMarket() {
  if (!game || !game.stocks) return;
  ensureFluxState();
  game.stocks.forEach(function (s) {
    const catIdx = game.flux.categories[s.category];
    const heat = catIdx ? catIdx.index : 100;
    const prev = game.flux.stocks[s.symbol];
    const macro = game.flux.macro || 1;
    const bias = ((heat - 100) / 100) * 0.5 + (macro - 1) * 0.3;
    game.flux.stocks[s.symbol] = {
      symbol: s.symbol, name: s.name, category: s.category,
      bias: bias, heat: heat, week: game.week,
      price: s.price, prevPrice: s.prevPrice
    };
  });
}

function fluxStockDriftModifier(s) {
  ensureFluxState();
  const meta = game.flux.stocks && game.flux.stocks[s.symbol];
  if (!meta) return 0;
  return (meta.bias || 0) * 0.5 + ((game.flux.macro || 1) - 1) * 0.15;
}

function fluxCategoryIndex(cat) {
  ensureFluxState();
  if (!game.flux.categories[cat]) syncFluxCategoriesFromMarket();
  const c = game.flux.categories[cat];
  return c ? c.index : 100;
}

function tickFluxEngine() {
  if (!game || game.gameOver) return;
  ensureFluxState();
  const r = fluxRng('macro');
  const drift = (r() - 0.48) * 0.08;
  game.flux.macro = Math.max(0.55, Math.min(1.65, (game.flux.macro || 1) + drift));
  syncFluxCategoriesFromMarket();
  ['media', 'ecommerce'].forEach(function (domain) {
    const bag = game.flux[domain] || (game.flux[domain] = {});
    Object.keys(bag).forEach(function (track) {
      const cur = bag[track];
      if (!cur || cur.index == null) return;
      const rr = fluxRng(domain + track + game.week);
      const cat = domain === 'ecommerce' ? track : null;
      const catPull = cat && game.flux.categories[cat] ? (game.flux.categories[cat].index - 100) / 500 : 0;
      const ch = ((rr() - 0.5) * 0.12 + catPull) * (game.flux.macro || 1);
      cur.index = Math.max(20, Math.min(500, cur.index * (1 + ch)));
      cur.week = game.week;
    });
  });
  syncFluxStocksFromMarket();
}

function initFluxTrack(domain, track, startIndex) {
  ensureFluxState();
  if (!game.flux[domain][track]) {
    game.flux[domain][track] = { index: startIndex || 100, week: game.week || 0, history: [] };
  }
  return game.flux[domain][track];
}

function fluxTrackIndex(domain, track) {
  ensureFluxState();
  const t = initFluxTrack(domain, track, 100);
  t.history = t.history || [];
  if (!t.history.length || t.history[t.history.length - 1].week !== game.week) {
    t.history.push({ week: game.week, index: Math.round(t.index) });
    if (t.history.length > 16) t.history.shift();
  }
  return t.index;
}

function fluxTrendLabel(domain, track) {
  const t = game && game.flux && game.flux[domain] && game.flux[domain][track];
  if (!t || !t.history || t.history.length < 2) return '—';
  const a = t.history[t.history.length - 2].index;
  const b = t.history[t.history.length - 1].index;
  if (b > a * 1.03) return '↑ 涨';
  if (b < a * 0.97) return '↓ 落';
  return '→ 平';
}
