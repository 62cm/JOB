/* 流通盘 · 持股上限 — 由 build.js 注入 */
function stockFloatHash(symbol) {
  let h = 0;
  const s = String(symbol || '');
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function ensureStockFloat(stock) {
  if (!stock || !stock.symbol) return stock;
  if (stock.floatShares != null && stock.totalShares != null) return stock;
  const ref = stock.refPrice || stock.price || 10;
  let totalShares;
  if (ref >= 800) totalShares = 1.25e9;
  else if (ref >= 200) totalShares = 2.4e9;
  else if (ref >= 50) totalShares = 4.5e9;
  else if (ref >= 10) totalShares = 8e9;
  else totalShares = 2.5e10;
  const floatPct = 0.12 + (stockFloatHash(stock.symbol) % 23) / 100;
  stock.totalShares = Math.floor(totalShares);
  stock.floatShares = Math.floor(totalShares * floatPct);
  stock.floatPct = Math.round(floatPct * 1000) / 10;
  return stock;
}
function migrateStockFloats(stocks) {
  if (!Array.isArray(stocks)) return;
  stocks.forEach(ensureStockFloat);
}
function countPlayerPortfolioShares(sym, g) {
  g = g || game;
  return g && g.portfolio ? Math.floor(g.portfolio[sym] || 0) : 0;
}
function countCompanyHoldingsShares(sym, g) {
  g = g || game;
  if (!g || !g.playerCompany) return 0;
  let n = 0;
  (g.playerCompany.holdings || []).forEach(function (h) {
    if (h && h.symbol === sym) n += Math.floor(h.shares || 0);
  });
  return n;
}
function countAllHeldShares(sym, g) {
  g = g || game;
  let n = countPlayerPortfolioShares(sym, g) + countCompanyHoldingsShares(sym, g);
  if (g && g.companion && g.companion.portfolio) n += Math.floor(g.companion.portfolio[sym] || 0);
  return n;
}
function getStockFloatInfo(sym, g) {
  g = g || game;
  const st = g && g.stocks && g.stocks.find(function (x) { return x.symbol === sym; });
  if (!st) return null;
  ensureStockFloat(st);
  const held = countAllHeldShares(sym, g);
  const floatShares = st.floatShares || 0;
  return {
    stock: st,
    totalShares: st.totalShares,
    floatShares: floatShares,
    floatPct: st.floatPct,
    held: held,
    available: Math.max(0, floatShares - held),
    pctOfFloat: floatShares > 0 ? (held / floatShares) * 100 : 0
  };
}
function maxSecondaryBuyShares(sym, g) {
  const info = getStockFloatInfo(sym, g);
  return info ? info.available : 0;
}
function capSharesToAvailableFloat(sym, wantShares, g) {
  return Math.min(Math.floor(wantShares || 0), maxSecondaryBuyShares(sym, g));
}
function fmtShareCount(n) {
  n = Math.floor(n || 0);
  if (n >= 1e8) return (n / 1e8).toFixed(2) + '亿股';
  if (n >= 1e4) return (n / 1e4).toFixed(0) + '万股';
  return n.toLocaleString() + '股';
}
function stockFloatCapMessage(sym, g) {
  const info = getStockFloatInfo(sym, g);
  if (!info) return '暂无流通数据';
  return '流通盘 ' + fmtShareCount(info.floatShares) + '（占总股本 ' + info.floatPct + '%）· 已持 ' + fmtShareCount(info.held) + ' · 还可买 ' + fmtShareCount(info.available);
}
function clampHoldingsToFloat(sym, g, silent) {
  g = g || game;
  const info = getStockFloatInfo(sym, g);
  if (!info || info.held <= info.floatShares) return false;
  let excess = info.held - info.floatShares;
  let changed = false;
  const pc = g.playerCompany;
  if (pc && pc.holdings) {
    const h = pc.holdings.find(function (x) { return x.symbol === sym; });
    if (h && h.shares > 0 && excess > 0) {
      const cut = Math.min(h.shares, excess);
      h.shares -= cut;
      if (h.shares <= 0) pc.holdings = pc.holdings.filter(function (x) { return x.symbol !== sym; });
      excess -= cut;
      changed = true;
    }
  }
  if (excess > 0 && g.portfolio && g.portfolio[sym]) {
    const cut = Math.min(g.portfolio[sym], excess);
    g.portfolio[sym] -= cut;
    if (g.portfolio[sym] <= 0) delete g.portfolio[sym];
    excess -= cut;
    changed = true;
  }
  if (changed && !silent && typeof addLog === 'function') {
    addLog('⚠ 「' + (info.stock.name || sym) + '」持仓超过流通盘，已按上限校正', 'warn');
  }
  return changed;
}
function migrateAllStockFloatHoldings(g) {
  g = g || game;
  if (!g || !g.stocks) return;
  migrateStockFloats(g.stocks);
  g.stocks.forEach(function (st) { clampHoldingsToFloat(st.symbol, g, true); });
}
function checkStockBuyAllowed(sym, shares, g) {
  g = g || game;
  shares = Math.floor(shares) || 0;
  if (shares <= 0) return { ok: false, msg: '请输入股数' };
  const info = getStockFloatInfo(sym, g);
  if (!info) return { ok: false, msg: '暂无行情' };
  if (shares > info.available) {
    if (info.available <= 0) {
      return { ok: false, msg: '「' + info.stock.name + '」流通盘已满（流通 ' + fmtShareCount(info.floatShares) + '，已持 ' + fmtShareCount(info.held) + '）' };
    }
    return { ok: false, msg: '超过流通盘可买上限 · 最多还可买 ' + fmtShareCount(info.available), cap: info.available };
  }
  return { ok: true, info: info };
}
