/* 资产总览：不动产 · 持股 · 收购企业 — 由 build.js 注入 */
function switchFinanceTab(tab) {
  if (!game) return;
  game.financeSubTab = tab === 'assets' ? 'assets' : 'stock';
  const stockPanel = document.getElementById('stockTradePanel');
  const assetsPanel = document.getElementById('assetsPanel');
  const btnStock = document.getElementById('btnFinanceStock');
  const btnAssets = document.getElementById('btnFinanceAssets');
  if (stockPanel) stockPanel.style.display = game.financeSubTab === 'stock' ? 'block' : 'none';
  if (assetsPanel) assetsPanel.style.display = game.financeSubTab === 'assets' ? 'block' : 'none';
  if (btnStock) btnStock.classList.toggle('active', game.financeSubTab === 'stock');
  if (btnAssets) btnAssets.classList.toggle('active', game.financeSubTab === 'assets');
  if (game.financeSubTab === 'stock' && typeof renderStocks === 'function') renderStocks();
  else renderAssetsPanel();
}

function renderFinanceTab() {
  if (!game) return;
  if (!game.financeSubTab) game.financeSubTab = 'stock';
  switchFinanceTab(game.financeSubTab);
}

function stockQuote(symbol) {
  if (!game || !symbol || !game.stocks) return null;
  return game.stocks.find(function (x) { return x.symbol === symbol; }) || null;
}

function calcPersonalPortfolioSummary() {
  const rows = [];
  let total = 0;
  if (!game || !game.portfolio) return { rows: rows, total: 0 };
  Object.keys(game.portfolio).forEach(function (sym) {
    const n = game.portfolio[sym] || 0;
    if (n <= 0) return;
    const st = stockQuote(sym);
    if (!st) return;
    const mv = st.price * n;
    total += mv;
    const basis = typeof getStockCostBasis === 'function' ? getStockCostBasis(sym) : null;
    const cost = basis ? basis.avg * n : null;
    const pl = cost != null ? mv - cost : null;
    rows.push({ name: st.name, symbol: sym, shares: n, price: st.price, marketValue: mv, cost: cost, pl: pl });
  });
  return { rows: rows, total: total };
}

function calcCompanyHoldingsSummary() {
  const pc = game && game.playerCompany;
  const rows = [];
  let total = 0;
  if (!pc || !pc.holdings || !pc.holdings.length) return { rows: rows, total: 0 };
  pc.holdings.forEach(function (h) {
    const st = stockQuote(h.symbol);
    const price = st ? st.price : (h.lastPrice || 0);
    const mv = price * (h.shares || 0);
    total += mv;
    const prev = h.lastPrice != null ? h.lastPrice : price;
    const weekPl = (price - prev) * (h.shares || 0);
    rows.push({
      name: h.name || h.companyName, symbol: h.symbol, shares: h.shares,
      price: price, marketValue: mv, companyId: h.companyId, companyName: h.companyName,
      weekPl: weekPl
    });
  });
  return { rows: rows, total: total };
}

function estimateSubsidiaryValue(sub) {
  if (!sub) return 0;
  const co = typeof lookupCompanyById === 'function' ? lookupCompanyById(sub.companyId) : null;
  if (co && typeof companyAcquisitionPrice === 'function') return companyAcquisitionPrice(co);
  const st = co && typeof findStockForCompany === 'function' ? findStockForCompany(co) : null;
  if (st && sub.ownershipPct) return Math.round(st.price * 100000 * (sub.ownershipPct / 100));
  return 0;
}

function fmtMoney(n) {
  if (n == null || isNaN(n)) return '—';
  return '¥' + Math.round(n).toLocaleString();
}

function fmtPl(n) {
  if (n == null || isNaN(n) || Math.abs(n) < 1) return '<span class="fold-meta">—</span>';
  const c = n >= 0 ? 'var(--green)' : 'var(--red)';
  return '<span style="color:' + c + '">' + (n >= 0 ? '+' : '') + fmtMoney(n) + '</span>';
}

function renderAssetsPanel() {
  const el = document.getElementById('assetsPanel');
  if (!el || !game) return;
  migratePropertyCompany();
  let total = game.cash || 0;
  let h = '<div class="assets-panel" style="font-size:.78rem;line-height:1.55">';
  h += '<p class="fold-meta" style="margin:0 0 10px">汇总个人不动产、股票持仓、收购企业股权与集团持股。持股市值每周随行情变动结算至现金。</p>';

  h += '<div class="company-mgmt-section" style="padding:10px;margin-bottom:10px;background:var(--bg);border-radius:8px;border:1px solid var(--border)">';
  h += '<b>🏠 不动产</b>';
  const reBits = [];
  let reVal = 0;
  if (game.ownsHome) {
    reBits.push(game.mortgagePaidOff ? '自住房（房贷已清）' : '自住房（按揭中）');
    reVal += game.mortgagePaidOff ? 2500000 : 800000;
  }
  if (game.villaOwned) { reBits.push('别墅'); reVal += typeof VILLA_PRICE !== 'undefined' ? VILLA_PRICE : 10000000; }
  if (typeof hasPrivateJet === 'function' && hasPrivateJet()) { reBits.push('私人飞机'); reVal += 200000000; }
  if (!reBits.length) h += '<p class="fold-meta" style="margin:6px 0 0">暂无不动产</p>';
  else {
    h += '<p style="margin:6px 0 2px">' + reBits.join(' · ') + '</p>';
    h += '<p class="fold-meta">估算市值 ' + fmtMoney(reVal) + '</p>';
    total += reVal;
  }
  h += '</div>';

  const port = calcPersonalPortfolioSummary();
  h += '<div class="company-mgmt-section" style="padding:10px;margin-bottom:10px;background:var(--bg);border-radius:8px;border:1px solid var(--border)">';
  h += '<b>📈 个人持股</b> <span class="fold-meta">· 炒股账户</span>';
  if (!port.rows.length) h += '<p class="fold-meta" style="margin:6px 0 0">暂无持仓 · <button type="button" class="btn" style="font-size:.68rem;padding:2px 8px" onclick="switchFinanceTab(\'stock\')">去炒股</button></p>';
  else {
    port.rows.forEach(function (r) {
      h += '<div style="margin-top:6px;padding-top:6px;border-top:1px dashed var(--border)">';
      h += '<b>' + r.name + '</b> <span class="fold-meta">' + r.symbol + ' · ' + r.shares.toLocaleString() + ' 股</span>';
      h += '<div class="fold-meta">现价 ¥' + r.price.toFixed(2) + ' · 市值 ' + fmtMoney(r.marketValue);
      if (typeof getStockFloatInfo === 'function') {
        const fi = getStockFloatInfo(r.symbol);
        if (fi && fi.floatShares > 0) h += ' · 占流通 ' + fi.pctOfFloat.toFixed(1) + '%';
      }
      if (r.pl != null) h += ' · 浮盈浮亏 ' + fmtPl(r.pl);
      h += '</div></div>';
    });
    h += '<p style="margin:8px 0 0;font-weight:600">合计 ' + fmtMoney(port.total) + '</p>';
    total += port.total;
  }
  h += '</div>';

  const hold = calcCompanyHoldingsSummary();
  h += '<div class="company-mgmt-section" style="padding:10px;margin-bottom:10px;background:var(--bg);border-radius:8px;border:1px solid var(--border)">';
  h += '<b>🏛 收购持股</b> <span class="fold-meta">· 通过收购取得的上市公司股份</span>';
  if (!hold.rows.length) h += '<p class="fold-meta" style="margin:6px 0 0">暂无 · 在「日常→购房/公司」对原单位发起股权收购</p>';
  else {
    hold.rows.forEach(function (r) {
      const esc = typeof escHoldingSym === 'function' ? escHoldingSym(r.symbol) : r.symbol;
      h += '<div style="margin-top:6px;padding-top:6px;border-top:1px dashed var(--border)">';
      h += '<b>' + r.name + '</b>';
      if (r.companyName && r.companyName !== r.name) h += ' <span class="fold-meta">(' + r.companyName + ')</span>';
      h += '<div class="fold-meta">' + r.shares.toLocaleString() + ' 股 · 现价 ¥' + r.price.toFixed(2);
      h += ' · 市值 ' + fmtMoney(r.marketValue);
      if (typeof getStockFloatInfo === 'function') {
        const fi = getStockFloatInfo(r.symbol);
        if (fi && fi.floatShares > 0) h += ' · 占流通 ' + fi.pctOfFloat.toFixed(1) + '%';
      }
      if (Math.abs(r.weekPl) >= 1) h += ' · 本周股东收益 ' + fmtPl(r.weekPl);
      h += '</div>';
      h += '<div style="margin-top:4px;display:flex;gap:4px;flex-wrap:wrap;align-items:center">';
      h += '<input type="number" id="sellCo_' + esc + '" value="10000" min="1" max="' + r.shares + '" style="width:72px;font-size:.72rem;padding:2px 4px">';
      h += '<button type="button" class="btn" style="font-size:.65rem;padding:2px 8px" onclick="sellCompanyHolding(\'' + esc + '\',+document.getElementById(\'sellCo_' + esc + '\').value)">卖出</button>';
      h += '<button type="button" class="btn" style="font-size:.65rem;padding:2px 8px" onclick="sellCompanyHoldingAll(\'' + esc + '\')">全卖</button>';
      h += '</div></div>';
    });
    h += '<p style="margin:8px 0 0;font-weight:600">合计 ' + fmtMoney(hold.total) + '</p>';
    total += hold.total;
  }
  h += '</div>';

  const pc = game.playerCompany;
  const subs = pc && pc.founded ? (pc.subsidiaries || []).filter(function (s) { return !s.status || s.status === 'active'; }) : [];
  h += '<div class="company-mgmt-section" style="padding:10px;margin-bottom:10px;background:var(--bg);border-radius:8px;border:1px solid var(--border)">';
  h += '<b>🏢 控股企业</b> <span class="fold-meta">· 收购的子公司</span>';
  if (!subs.length) h += '<p class="fold-meta" style="margin:6px 0 0">暂无控股子公司</p>';
  else {
    let subTotal = 0;
    subs.forEach(function (sub) {
      const est = estimateSubsidiaryValue(sub);
      const stake = sub.ownershipPct || (sub.playerRole && sub.playerRole.sharePct) || 0;
      const myVal = Math.round(est * stake / 100);
      subTotal += myVal;
      const co = typeof lookupCompanyById === 'function' ? lookupCompanyById(sub.companyId) : null;
      h += '<div style="margin-top:6px;padding-top:6px;border-top:1px dashed var(--border)">';
      h += '<b>' + (sub.companyName || '未命名') + '</b> <span class="fold-meta">· 控股 ' + stake + '%</span>';
      if (sub.acquiredWeek) h += ' <span class="fold-meta">· 第' + sub.acquiredWeek + '周收购</span>';
      if (co) {
        h += '<div class="fold-meta">' + (co.tier ? TIER_LABEL[co.tier] || co.tier : '') + (co.city ? ' · ' + co.city : '');
        const st = typeof findStockForCompany === 'function' ? findStockForCompany(co) : null;
        if (st) h += ' · 上市 ' + st.symbol + ' ¥' + st.price.toFixed(2);
        h += '</div>';
      }
      if (sub.playerRole) h += '<div class="fold-meta">你 · ' + sub.playerRole.title + ' · 持股 ' + sub.playerRole.sharePct + '%</div>';
      if (sub.minorityHolders && sub.minorityHolders.length) {
        h += '<div class="fold-meta">少数股东：' + sub.minorityHolders.map(function (mh) { return mh.name + ' ' + mh.pct + '%'; }).join('、') + '</div>';
      }
      h += '<div class="fold-meta">权益估算 ' + fmtMoney(myVal) + ' · 企业估值约 ' + fmtMoney(est);
      h += ' <button type="button" class="btn" style="font-size:.65rem;padding:2px 6px" onclick="openSubsidiaryFromAssets(\'' + String(sub.companyId).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\')">管理</button>';
      h += '</div></div>';
    });
    h += '<p style="margin:8px 0 0;font-weight:600">权益合计 ' + fmtMoney(subTotal) + '</p>';
    total += subTotal;
  }
  if (pc && pc.founded) {
    h += '<p class="fold-meta" style="margin-top:8px">集团总部「' + (pc.brandName || pc.name || '自有公司') + '」';
    if (pc.familiarity != null) h += ' · 品牌熟悉度 ' + pc.familiarity;
    if (pc.ipoListed && pc.listedStockCode) {
      const pst = stockQuote(pc.listedStockCode);
      h += ' · <span style="color:var(--green)">上市 ' + pc.listedStockCode + '</span>';
      if (pst) h += ' ¥' + pst.price.toFixed(2);
    }
    h += ' <button type="button" class="btn" style="font-size:.65rem;padding:2px 6px" onclick="showTab(\'company\')">公司管理</button></p>';
  }
  h += '</div>';

  if (pc && pc.founded && pc.equity && pc.equity.holders && pc.equity.holders.length) {
    h += '<div class="company-mgmt-section" style="padding:10px;margin-bottom:10px;background:var(--bg);border-radius:8px;border:1px solid var(--border)">';
    h += '<b>⚖ 集团股权</b>';
    pc.equity.holders.forEach(function (x) {
      h += '<div class="fold-meta">' + x.name + ' · ' + x.pct + '% 股权 · ' + (x.votes != null ? x.votes : x.pct) + ' 票</div>';
    });
    h += '</div>';
  }

  h += '<p style="margin:12px 0 0;padding:10px;background:rgba(88,166,255,.08);border-radius:8px;border:1px solid var(--border)">';
  h += '<b>资产合计（含现金）</b> ' + fmtMoney(total) + ' <span class="fold-meta">· 现金 ' + fmtMoney(game.cash) + ' 已计入</span></p>';
  h += '</div>';
  el.innerHTML = h;
}

function openSubsidiaryFromAssets(companyId) {
  if (typeof setCompanyMgmtContext === 'function') setCompanyMgmtContext(companyId);
  if (typeof showTab === 'function') showTab('company');
}
