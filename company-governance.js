/* 公司治理：股权 · 董事会 · 监事 · 合伙创业 · 敌意收购 — 由 build.js 注入 */
const COMPANY_PARTNER_FOUND_PRICE = 10000;
const COMPANY_SOLO_FOUND_PRICE = 50000000;

function migrateCompanyGovernanceFull() {
  if (!game || !game.playerCompany || !game.playerCompany.founded) return;
  const pc = game.playerCompany;
  if (!pc.board) pc.board = {};
  const b = pc.board;
  if (!b.execs) {
    b.execs = { ceo: '你', cfo: '王建国', hr: '林婉儿', biz: '陈海洋', cto: '（待任命）', ops: '刘运营', cmo: '周市场' };
  }
  if (!b.execs.ops) b.execs.ops = '刘运营';
  if (!b.execs.cmo) b.execs.cmo = '周市场';
  if (!b.execs.biz || b.execs.biz === '（待任命）') b.execs.biz = '陈海洋';
  if (b.foundingType == null) b.foundingType = pc.partnerId ? 'partner' : (pc.acquiredFrom ? 'acquired' : 'solo');
  if (b.foundingType === 'solo' || b.foundingType === 'partner') {
    if (!pc.equity || !pc.equity.holders || pc.equity.holders.length > 2) {
      const holders = [{ name: '你', pct: 100, votes: 100, id: 'player', chairman: true }];
      if (b.foundingType === 'partner' && pc.partnerName) {
        holders[0].pct = pc.partnerPlayerPct != null ? pc.partnerPlayerPct : 51;
        holders[0].votes = holders[0].pct;
        holders.push({ name: pc.partnerName, pct: 100 - holders[0].pct, votes: 100 - holders[0].pct, id: pc.partnerId || 'partner' });
      }
      pc.equity = { holders: holders };
    }
    b.playerShares = (pc.equity.holders.find(function (h) { return h.id === 'player'; }) || {}).pct || 100;
    b.chairman = b.chairman || '你';
    b.chairmanId = b.chairmanId || 'player';
    b.chairmanVeto = b.chairmanVeto !== false;
    b.ceo = b.ceo || '你';
    b.superVote = b.chairmanId === 'player' && b.chairmanVeto;
  }
  if (b.supervisor == null && b.supervisorAppointed !== true) b.supervisor = null;
  if (!pc.secretary) pc.secretary = { name: '苏小秘', id: 'staff_secretary', briefs: [] };
  mergeCompanyDeptTemplate(pc);
  if (typeof migrateAcquiredSubsidiaries === 'function') migrateAcquiredSubsidiaries(pc);
  if (typeof ensureBoardExecState === 'function') ensureBoardExecState();
  if (b.supervisor == null && b.supervisorAppointed !== true && typeof promptAppointSupervisorIfNeeded === 'function' && !(game && game._loadingSave)) {
    setTimeout(function () { promptAppointSupervisorIfNeeded(); }, 400);
  }
}

function mergeCompanyDeptTemplate(pc) {
  if (!pc || !pc.departments) return;
  const tpl = typeof COMPANY_DEPT_TEMPLATE !== 'undefined' ? COMPANY_DEPT_TEMPLATE : [];
  tpl.forEach(function (td) {
    if (!pc.departments.some(function (d) { return d.id === td.id; })) pc.departments.push(JSON.parse(JSON.stringify(td)));
  });
  pc.departments.forEach(function (d) {
    const td = tpl.find(function (x) { return x.id === d.id; });
    if (td && td.parent != null && d.parent == null) d.parent = td.parent;
    if (td && td.level != null && d.level == null) d.level = td.level;
  });
}

function getPlayerVotePct() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.equity || !pc.equity.holders) return pc && pc.board ? (pc.board.playerShares || 0) : 0;
  const h = pc.equity.holders.find(function (x) { return x.id === 'player' || x.name === '你'; });
  return h ? (h.votes != null ? h.votes : h.pct) : 0;
}

function isPlayerChairman() {
  const pc = game && game.playerCompany;
  return !!(pc && pc.board && (pc.board.chairmanId === 'player' || pc.board.chairman === '你'));
}

function isSupervisorCandidate(c) {
  if (!c || !c.id || c.id === 'player') return false;
  if ((c.familiarity || 0) >= 35) return true;
  if (c.kind === 'staff') return c.id !== 'staff_ceo' && c.id !== 'staff_cfo' && c.id !== 'staff_hr';
  if (typeof COMPANY_STAFF_NPC !== 'undefined') {
    return COMPANY_STAFF_NPC.some(function (s) {
      return s.id === c.id && s.id !== 'staff_ceo' && s.id !== 'staff_cfo' && s.id !== 'staff_hr';
    });
  }
  return false;
}

function openSupervisorContactPicker() {
  if (typeof openContactPicker !== 'function') {
    addLog('无法打开通讯录', 'fail');
    return;
  }
  openContactPicker({
    title: '任命监事 · 选择联系人',
    hint: '从通讯录选择监事 · 熟悉度≥35 或公司员工（不可选 CEO/CFO/HR）',
    filter: isSupervisorCandidate,
    onPick: function (c) {
      const name = typeof contactDisplayName === 'function' ? contactDisplayName(c) : c.name;
      appointCompanySupervisor(c.id, name);
    }
  });
}

function promptAppointSupervisorIfNeeded() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded || pc.board.supervisorAppointed) return;
  if (typeof consumeModalOpen !== 'undefined' && consumeModalOpen) return;
  if (typeof showConsumeModalHandlers !== 'function') return;
  showConsumeModalHandlers({
    icon: '⚖',
    title: '任命公司监事',
    html: '<p class="fold-meta">公司法要求设立监事。请从通讯录选择一人担任监事（熟悉度≥35 或公司员工，不可选 CEO/CFO/HR）。</p>',
    buttons: [
      {
        text: '打开通讯录选择',
        primary: true,
        handler: function () {
          if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
          openSupervisorContactPicker();
        }
      },
      { text: '稍后', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } }
    ]
  });
}

function collectSupervisorCandidates() {
  const out = [];
  const seen = {};
  function push(c) {
    if (!c || !c.id || seen[c.id] || !isSupervisorCandidate(c)) return;
    seen[c.id] = true;
    out.push(c);
  }
  (game.contacts || []).forEach(push);
  return out;
}

function appointCompanySupervisor(id, name) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.board) return;
  pc.board.supervisor = name;
  pc.board.supervisorId = id;
  pc.board.supervisorAppointed = true;
  addLog('⚖ 已任命监事「' + name + '」', 'success');
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
}

function openPartnerFoundingMenu() {
  if (!game || game.gameOver) return;
  if (hasPlayerCompany()) { addLog('已拥有自己的公司', 'warn'); return; }
  if (game.cash < COMPANY_PARTNER_FOUND_PRICE) {
    addLog('合伙注册需 ¥' + COMPANY_PARTNER_FOUND_PRICE.toLocaleString() + '，现金不足', 'fail');
    return;
  }
  const friends = (game.contacts || []).filter(function (c) {
    return c.id !== 'player' && ((c.familiarity || 0) >= 40 || c.followed || c.kind === 'friend');
  });
  if (!friends.length) {
    addLog('需先在通讯录结识朋友（熟悉度≥40 或已关注）才能合伙开公司', 'fail');
    return;
  }
  let html = '<p class="fold-meta">毕业后可与朋友合伙注册公司，注册资本 ¥' + COMPANY_PARTNER_FOUND_PRICE.toLocaleString() + '（各出一半）。</p>';
  friends.slice(0, 12).forEach(function (c) {
    const dn = typeof contactDisplayName === 'function' ? contactDisplayName(c) : c.name;
    html += '<button type="button" class="btn" style="display:block;width:100%;margin:6px 0" onclick="foundPlayerCompanyWithPartner(\'' +
      String(c.id).replace(/'/g, "\\'") + '\')">' + dn + ' · 熟悉度 ' + (c.familiarity || 0) + '</button>';
  });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '🤝', title: '与朋友合伙开公司',
      html: html,
      buttons: [{ text: '取消', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } }]
    });
  }
}

function foundPlayerCompanyWithPartner(contactId) {
  if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  if (!game || game.gameOver || hasPlayerCompany()) return;
  const c = (game.contacts || []).find(function (x) { return x.id === contactId; });
  if (!c) { addLog('找不到该合伙人', 'fail'); return; }
  if (game.cash < COMPANY_PARTNER_FOUND_PRICE) { addLog('现金不足', 'fail'); return; }
  const partnerName = typeof contactDisplayName === 'function' ? contactDisplayName(c) : c.name;
  const playerPct = 51;
  if (!confirm('与「' + partnerName + '」合伙注册公司？\n各出资 ¥' + (COMPANY_PARTNER_FOUND_PRICE / 2).toLocaleString() + ' · 你持股 ' + playerPct + '%\n\n下一步请选择主营行业')) return;
  if (typeof openCompanyIndustryPicker === 'function') {
    game._partnerFoundCtx = { contactId: contactId, partnerName: partnerName, playerPct: playerPct };
    openCompanyIndustryPicker({
      title: '选择合伙公司主营行业',
      hint: '一次选择一个行业 · 布局达四个及以上时将显示为综合型企业',
      onPick: function (ind) { completeFoundPlayerCompanyWithPartner(contactId, ind); },
      onCancel: function () { game._partnerFoundCtx = null; }
    });
    return;
  }
  completeFoundPlayerCompanyWithPartner(contactId, '信息技术');
}

function completeFoundPlayerCompanyWithPartner(contactId, industry) {
  game._partnerFoundCtx = null;
  if (!game || game.gameOver || hasPlayerCompany()) return;
  const c = (game.contacts || []).find(function (x) { return x.id === contactId; });
  if (!c) { addLog('找不到该合伙人', 'fail'); return; }
  if (!industry || industry === '综合') { addLog('请选择具体行业', 'fail'); return; }
  if (game.cash < COMPANY_PARTNER_FOUND_PRICE) { addLog('现金不足', 'fail'); return; }
  const partnerName = typeof contactDisplayName === 'function' ? contactDisplayName(c) : c.name;
  const playerPct = 51;
  game.cash -= COMPANY_PARTNER_FOUND_PRICE;
  const pc = ensurePlayerCompany();
  pc.founded = true;
  pc.foundedWeek = game.week || 0;
  pc.partnerId = c.id;
  pc.partnerName = partnerName;
  pc.partnerPlayerPct = playerPct;
  pc.acquisitions = { player: null, companion: null };
  pc.holdings = [];
  pc.recruitInbox = [];
  pc.jobPosts = [];
  pc.departments = JSON.parse(JSON.stringify(typeof COMPANY_DEPT_TEMPLATE !== 'undefined' ? COMPANY_DEPT_TEMPLATE : []));
  pc.staff = [];
  pc.projects = [];
  pc.industries = [];
  if (typeof addCompanyIndustry === 'function') addCompanyIndustry(pc, industry);
  else { pc.industries = [industry]; pc.primaryIndustry = industry; }
  pc.weeklyReports = [];
  pc.monthlyReports = [];
  pc.board = {
    foundingType: 'partner',
    playerShares: playerPct,
    chairman: '你',
    chairmanId: 'player',
    chairmanVeto: true,
    ceo: '你',
    supervisor: null,
    supervisorAppointed: false,
    execs: { ceo: '你', cfo: '王建国', hr: '林婉儿', biz: '陈海洋', cto: '（待任命）', ops: '刘运营', cmo: '周市场' },
    pendingVote: null
  };
  pc.equity = {
    holders: [
      { name: '你', pct: playerPct, votes: playerPct, id: 'player', chairman: true },
      { name: partnerName, pct: 100 - playerPct, votes: 100 - playerPct, id: c.id }
    ]
  };
  pc.hqCity = typeof getCompanyHqCity === 'function' ? getCompanyHqCity() : (game.playerCity || '杭州');
  if (typeof ledgerAddExpense === 'function') ledgerAddExpense('business', '🤝', '合伙注册公司', COMPANY_PARTNER_FOUND_PRICE, false);
  addLog('🤝 与 ' + partnerName + ' 合伙成立公司 · 主营「' + industry + '」· 你持股 ' + playerPct + '% · 请命名', 'success');
  if (typeof bumpContactFamiliarity === 'function') bumpContactFamiliarity(c, 5);
  if (typeof syncAllPlayerStaffCircles === 'function') syncAllPlayerStaffCircles();
  if (typeof migrateCompanyGovernanceFull === 'function') migrateCompanyGovernanceFull();
  if (typeof migrateCompanyBranches === 'function') migrateCompanyBranches();
  queuePlayerCompanyNameModal();
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
  if (typeof updateUI === 'function') updateUI();
  if (typeof autoSaveSlot === 'function') autoSaveSlot();
}

function lookupCompanyById(coId) {
  if (!coId || !game) return null;
  if (game.companyById && game.companyById[coId]) return game.companyById[coId];
  return (game.companyAll || []).find(function (c) { return c.id === coId; }) || null;
}

function inferSubsidiaryJobTitle(key) {
  if (key === 'player' && game.employed && game.employment) {
    const job = game.market && game.market[game.employment.jobIdx];
    return job ? job.title : '职员';
  }
  if (key === 'companion' && game.companion && game.companion.employed && game.companion.employment) {
    const job = game.market && game.market[game.companion.employment.jobIdx];
    return job ? job.title : '职员';
  }
  return key === 'companion' ? '留任董事' : '董事长';
}

function initSubsidiaryGovernance(sub, ownershipPct, target) {
  if (!sub) return;
  const pct = Math.round(ownershipPct) || sub.ownershipPct || 100;
  const holders = [{ name: '你', pct: pct, votes: pct, id: 'player', chairman: pct >= 50 }];
  if (target && target.shareholders) {
    target.shareholders.filter(function (h) { return !h.persuaded; }).forEach(function (h) {
      holders.push({ name: h.name, pct: h.pct, votes: h.pct, id: h.id || ('sh_' + h.name) });
    });
  } else if (sub.minorityHolders && sub.minorityHolders.length) {
    sub.minorityHolders.forEach(function (mh) {
      holders.push({ name: mh.name, pct: mh.pct, votes: mh.pct, id: 'sh_' + mh.name });
    });
  }
  sub.equity = { holders: holders };
  sub.board = sub.board || {};
  sub.board.chairman = pct >= 50 ? '你' : (sub.board.chairman || '（待董事会选举）');
  sub.board.chairmanId = pct >= 50 ? 'player' : sub.board.chairmanId;
  sub.board.chairmanVeto = pct >= 50;
  sub.board.playerShares = pct;
  sub.board.foundingType = 'acquired';
  sub.board.execs = sub.board.execs || { ceo: '（待任命）', cfo: '（待任命）' };
  sub.board.pendingVote = null;
  if (sub.board.supervisorAppointed == null) sub.board.supervisorAppointed = false;
}

function getCompanyMgmtContextId() {
  return (game && game.activeCompanyContext) || 'hq';
}

function setCompanyMgmtContext(id) {
  if (!game) return;
  game.activeCompanyContext = id || 'hq';
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
}

function getActiveSubsidiary() {
  const id = getCompanyMgmtContextId();
  if (id === 'hq' || !game || !game.playerCompany) return null;
  return (game.playerCompany.subsidiaries || []).find(function (s) { return s.companyId === id; }) || null;
}

function getPlayerStakeInSub(sub) {
  if (!sub) return 0;
  if (sub.playerRole && sub.playerRole.sharePct != null) return sub.playerRole.sharePct;
  if (sub.equity && sub.equity.holders) {
    const h = sub.equity.holders.find(function (x) { return x.id === 'player' || x.name === '你'; });
    if (h) return h.pct != null ? h.pct : (h.votes || 0);
  }
  return sub.ownershipPct || 0;
}

function subsidiaryMaxRivalPct(sub) {
  if (!sub || !sub.equity || !sub.equity.holders) {
    return sub && sub.minorityHolders ? sub.minorityHolders.reduce(function (m, h) { return Math.max(m, h.pct || 0); }, 0) : 0;
  }
  return sub.equity.holders.reduce(function (m, h) {
    if (h.id === 'player' || h.name === '你') return m;
    return Math.max(m, h.pct || 0);
  }, 0);
}
function playerControlsSubsidiary(sub) {
  if (!sub) return false;
  const stake = getPlayerStakeInSub(sub);
  if (stake >= 50) return true;
  if (sub.board && (sub.board.chairmanId === 'player' || sub.board.chairman === '你')) return true;
  // 相对多数：只要是最大股东即可控制
  return stake > 0 && stake > subsidiaryMaxRivalPct(sub);
}

function migrateSubsidiaryGovernance(sub) {
  if (!sub || sub.equity) return;
  initSubsidiaryGovernance(sub, sub.ownershipPct || 100, null);
}

function renderCompanyContextSwitcherHtml() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded) return '';
  const subs = (pc.subsidiaries || []).filter(function (s) { return !s.status || s.status === 'active'; });
  if (!subs.length) return '';
  const cur = getCompanyMgmtContextId();
  let h = '<div style="margin:0 0 10px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.75rem">';
  h += '<b>管理主体</b> ';
  h += '<select onchange="setCompanyMgmtContext(this.value)" style="margin-left:6px;background:var(--bg);color:var(--text);border:1px solid var(--border);padding:4px 8px;border-radius:4px;max-width:280px">';
  h += '<option value="hq"' + (cur === 'hq' ? ' selected' : '') + '>🏛 ' + (pc.brandName || pc.name || '集团总部') + '</option>';
  subs.forEach(function (sub) {
    const esc = String(sub.companyId).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    h += '<option value="' + esc + '"' + (cur === sub.companyId ? ' selected' : '') + '>🏢 ' + (sub.companyName || '收购企业') + '（控股' + (sub.ownershipPct || 0) + '%）</option>';
  });
  h += '</select></div>';
  return h;
}

function renderSubsidiaryEquityHtml(sub) {
  if (!sub || !sub.equity || !sub.equity.holders) return '';
  let h = '<p style="margin-top:8px"><b>股权结构</b></p>';
  sub.equity.holders.forEach(function (x) {
    h += '<div class="fold-meta">' + x.name + ' · ' + x.pct + '% 股权 · ' + (x.votes != null ? x.votes : x.pct) + ' 票' + (x.chairman ? ' · 董事' : '') + '</div>';
  });
  return h;
}

function buildSubsidiaryMgmtPanelHtml(sub) {
  if (!sub) {
    return '<p class="fold-meta">未找到该企业 · <button type="button" class="btn" onclick="setCompanyMgmtContext(\'hq\')">返回总部</button></p>';
  }
  migrateSubsidiaryGovernance(sub);
  const co = lookupCompanyById(sub.companyId);
  const stake = getPlayerStakeInSub(sub);
  const est = typeof estimateSubsidiaryValue === 'function' ? estimateSubsidiaryValue(sub) : 0;
  const myVal = Math.round(est * stake / 100);
  const pc = game.playerCompany;
  const holdRows = (pc.holdings || []).filter(function (h) { return h.companyId === sub.companyId; });
  let h = '<div class="panel-title" style="margin-bottom:6px">🏢 ' + (sub.companyName || '收购企业') + '</div>';
  h += '<div style="margin:0 0 10px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.75rem;line-height:1.5">';
  h += '<b>控股比例</b> <span style="color:var(--accent)">' + stake + '%</span>';
  if (sub.acquiredWeek) h += ' · 第' + sub.acquiredWeek + '周收购';
  if (co) {
    h += '<br><span class="fold-meta">' + (co.tier && typeof TIER_LABEL !== 'undefined' ? TIER_LABEL[co.tier] : '') + (co.scale && typeof SCALE_LABEL !== 'undefined' ? ' · ' + SCALE_LABEL[co.scale] : '') + (co.city ? ' · ' + co.city : '') + '</span>';
  }
  h += '<br><span class="fold-meta">权益估算 ¥' + myVal.toLocaleString() + ' · 企业估值约 ¥' + est.toLocaleString() + '</span>';
  if (sub.playerRole) h += '<br>你 · <b>' + sub.playerRole.title + '</b> · 持股 ' + sub.playerRole.sharePct + '%';
  if (sub.partnerRole) {
    h += '<br>' + sub.partnerRole.name + ' · ' + sub.partnerRole.title;
    if (sub.partnerRole.note) h += ' · <span style="color:var(--green)">' + sub.partnerRole.note + '</span>';
  }
  h += '</div>';
  if (co && co.desc) h += '<p class="fold-meta" style="margin:0 0 8px">' + co.desc + '</p>';
  const st = co && typeof findStockForCompany === 'function' ? findStockForCompany(co) : null;
  if (st) {
    h += '<div class="company-mgmt-section" style="padding:8px;margin-bottom:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.72rem">';
    h += '<b>📈 上市信息</b> · ' + st.symbol + ' ' + st.name + ' · 现价 ¥' + st.price.toFixed(2);
    h += '</div>';
  }
  if (holdRows.length) {
    h += '<div class="company-mgmt-section" style="padding:8px;margin-bottom:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.72rem">';
    h += '<b>💰 股东持股收益</b> <span class="fold-meta">· 收购取得的流通股份</span>';
    holdRows.forEach(function (hr) {
      const q = stockQuote ? stockQuote(hr.symbol) : (game.stocks || []).find(function (x) { return x.symbol === hr.symbol; });
      const price = q ? q.price : (hr.lastPrice || 0);
      const mv = price * (hr.shares || 0);
      const prev = hr.lastPrice != null ? hr.lastPrice : price;
      const wpl = (price - prev) * (hr.shares || 0);
      const esc = typeof escHoldingSym === 'function' ? escHoldingSym(hr.symbol) : hr.symbol;
      h += '<div class="fold-meta" style="margin-top:4px">' + hr.name + ' · ' + (hr.shares || 0).toLocaleString() + ' 股 · 市值 ¥' + Math.round(mv).toLocaleString();
      if (Math.abs(wpl) >= 1) h += ' · 本周收益 <span style="color:' + (wpl >= 0 ? 'var(--green)' : 'var(--red)') + '">' + (wpl >= 0 ? '+' : '') + '¥' + Math.round(wpl).toLocaleString() + '</span>';
      h += '<br><input type="number" id="subSell_' + esc + '" value="10000" min="1" style="width:64px;font-size:.65rem;margin-top:2px">';
      h += ' <button type="button" class="btn" style="font-size:.62rem;padding:1px 6px" onclick="sellCompanyHolding(\'' + esc + '\',+document.getElementById(\'subSell_' + esc + '\').value)">减持</button>';
      h += ' <button type="button" class="btn" style="font-size:.62rem;padding:1px 6px" onclick="sellCompanyHoldingAll(\'' + esc + '\')">全卖</button>';
      h += '</div>';
    });
    h += '</div>';
  }
  h += '<div class="company-mgmt-section" style="padding:8px;margin-bottom:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.72rem">';
  h += renderSubsidiaryEquityHtml(sub);
  if (sub.board) {
    h += '<p style="margin-top:6px"><b>治理</b></p>';
    h += '<div class="fold-meta">董事长 ' + (sub.board.chairman || '—') + (sub.board.chairmanVeto ? ' · 有一票否决' : '') + '</div>';
    h += '<div class="fold-meta">CEO ' + (sub.board.execs && sub.board.execs.ceo || '—') + '</div>';
  }
  if (sub.minorityHolders && sub.minorityHolders.length) {
    h += '<div class="fold-meta" style="margin-top:4px">少数股东：' + sub.minorityHolders.map(function (mh) { return mh.name + ' ' + mh.pct + '%'; }).join('、') + '</div>';
  }
  h += '</div>';
  if (playerControlsSubsidiary(sub)) {
    const absolute = getPlayerStakeInSub(sub) >= 50;
    h += '<p style="margin:8px 0"><b>大股东决策</b> <span class="fold-meta">· ' + (absolute ? '绝对控股（含一票否决）' : '最大股东·相对多数控制') + '</span></p>';
    h += '<button class="btn btn-primary" style="font-size:.72rem;margin:2px 4px 2px 0" onclick="openSubsidiaryGovernanceMenu(\'' + String(sub.companyId).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\')">⚖ 治理与投票</button>';
    h += '<button class="btn" style="font-size:.72rem;margin:2px 4px 2px 0" onclick="startSubsidiaryDividendVote(\'' + String(sub.companyId).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\')">💵 分红决议</button>';
    h += '<button class="btn" style="font-size:.72rem;margin:2px 4px 2px 0" onclick="switchFinanceTab(\'assets\');showTab(\'stock\')">📊 查看资产</button>';
  } else {
    h += '<p class="fold-meta" style="color:var(--orange)">你不是最大股东（最大对手 ' + subsidiaryMaxRivalPct(sub) + '%），暂不可控制该公司治理。继续增持成为最大股东即可。</p>';
  }
  h += '<button class="btn" style="font-size:.72rem;margin-top:6px" onclick="setCompanyMgmtContext(\'hq\')">← 返回集团总部</button>';
  return h;
}

function openSubsidiaryGovernanceMenu(companyId) {
  const sub = (game.playerCompany.subsidiaries || []).find(function (s) { return s.companyId === companyId; });
  if (!sub) { addLog('未找到该企业', 'fail'); return; }
  migrateSubsidiaryGovernance(sub);
  if (!playerControlsSubsidiary(sub)) { addLog('需控股 50% 以上方可治理', 'fail'); return; }
  let html = '<p><b>' + (sub.companyName || '收购企业') + '</b> · 控股 ' + getPlayerStakeInSub(sub) + '%</p>';
  html += renderSubsidiaryEquityHtml(sub);
  if (sub.board) {
    html += '<p class="fold-meta">董事长 ' + (sub.board.chairman || '—') + ' · CEO ' + (sub.board.execs && sub.board.execs.ceo || '—') + '</p>';
  }
  const buttons = [];
  if ((sub.equity.holders || []).length > 1) {
    buttons.push({ text: '选举董事长', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); startSubsidiaryChairmanElection(companyId); } });
    buttons.push({ text: '任命 CEO', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); startSubsidiaryCeoElection(companyId); } });
  }
  buttons.push({ text: '分红决议', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); startSubsidiaryDividendVote(companyId); } });
  buttons.push({ text: '关闭', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '⚖', title: '子公司治理 · ' + (sub.companyName || ''), html: html, buttons: buttons });
  }
}

function startSubsidiaryChairmanElection(companyId) {
  const sub = (game.playerCompany.subsidiaries || []).find(function (s) { return s.companyId === companyId; });
  if (!sub || !playerControlsSubsidiary(sub)) return;
  migrateSubsidiaryGovernance(sub);
  if (sub.board.pendingVote) { addLog('已有待表决事项', 'warn'); return; }
  const candidates = ['你'];
  (sub.equity.holders || []).forEach(function (h) {
    if (h.name !== '你' && candidates.indexOf(h.name) < 0) candidates.push(h.name);
  });
  sub.board.pendingVote = {
    type: 'chairman', topic: '选举董事长', candidate: '你', votes: {}, week: game.week,
    playerVeto: getPlayerStakeInSub(sub) >= 50, subsidiaryId: companyId
  };
  addLog('🗳 「' + sub.companyName + '」董事会选举董事长', 'info');
  openSubsidiaryVoteModal(companyId);
}

function startSubsidiaryCeoElection(companyId) {
  const sub = (game.playerCompany.subsidiaries || []).find(function (s) { return s.companyId === companyId; });
  if (!sub || !playerControlsSubsidiary(sub)) return;
  migrateSubsidiaryGovernance(sub);
  if (sub.board.pendingVote) { addLog('已有待表决事项', 'warn'); return; }
  const candidate = typeof pickStrangerDisplayName === 'function' ? pickStrangerDisplayName('male') : '职业经理人';
  sub.board.pendingVote = {
    type: 'ceo', topic: '任命 CEO', candidate: candidate, forPct: 62, week: game.week,
    playerVeto: getPlayerStakeInSub(sub) >= 50, subsidiaryId: companyId
  };
  addLog('🗳 「' + sub.companyName + '」董事会审议 CEO：' + candidate, 'info');
  openSubsidiaryVoteModal(companyId);
}

function startSubsidiaryDividendVote(companyId) {
  const sub = (game.playerCompany.subsidiaries || []).find(function (s) { return s.companyId === companyId; });
  if (!sub || !playerControlsSubsidiary(sub)) { addLog('需控股 50% 以上', 'fail'); return; }
  migrateSubsidiaryGovernance(sub);
  const est = typeof estimateSubsidiaryValue === 'function' ? estimateSubsidiaryValue(sub) : 0;
  const stake = getPlayerStakeInSub(sub);
  const amount = Math.round(est * stake / 100 * 0.05);
  if (amount < 1000) { addLog('本期可分红金额过低', 'warn'); return; }
  if (sub.board.pendingVote) { addLog('已有待表决事项', 'warn'); return; }
  sub.board.pendingVote = {
    type: 'dividend', topic: '现金分红 ¥' + amount.toLocaleString(), candidate: amount, forPct: 70,
    week: game.week, playerVeto: stake >= 50, subsidiaryId: companyId
  };
  addLog('🗳 「' + sub.companyName + '」提议分红 ¥' + amount.toLocaleString(), 'info');
  openSubsidiaryVoteModal(companyId);
}

function openSubsidiaryVoteModal(companyId) {
  const sub = (game.playerCompany.subsidiaries || []).find(function (s) { return s.companyId === companyId; });
  const v = sub && sub.board && sub.board.pendingVote;
  if (!v || typeof showConsumeModalHandlers !== 'function') return;
  let html = '<p><b>' + v.topic + '</b></p>';
  if (v.type === 'dividend') html += '<p class="fold-meta">按持股比例向股东派发现金，你预计实收约 ¥' + Math.round(v.candidate * getPlayerStakeInSub(sub) / 100).toLocaleString() + '</p>';
  else html += '<p>提名：<b>' + v.candidate + '</b></p>';
  if (v.forPct != null) html += '<p class="fold-meta">机构票倾向 ' + v.forPct + '% 赞成</p>';
  if (v.playerVeto) html += '<p class="fold-meta" style="color:var(--accent)">你是控股股东，拥有一票否决权</p>';
  const buttons = [
    { text: '赞成', primary: true, handler: function () { resolveSubsidiaryVote(companyId, true); } }
  ];
  if (v.playerVeto) buttons.push({ text: '否决', handler: function () { resolveSubsidiaryVote(companyId, false); } });
  else buttons.push({ text: '反对', handler: function () { resolveSubsidiaryVote(companyId, false); } });
  showConsumeModalHandlers({ icon: '🗳', title: '子公司表决 · ' + (sub.companyName || ''), html: html, buttons: buttons });
}

function resolveSubsidiaryVote(companyId, approve) {
  const sub = (game.playerCompany.subsidiaries || []).find(function (s) { return s.companyId === companyId; });
  const v = sub && sub.board && sub.board.pendingVote;
  if (!v) return;
  if (!approve && v.playerVeto) {
    addLog('🗳 否决「' + v.topic + '」', 'warn');
  } else if (approve || (v.forPct != null && v.forPct >= 50)) {
    if (v.type === 'chairman') {
      sub.board.chairman = v.candidate;
      sub.board.chairmanId = v.candidate === '你' ? 'player' : ('chair_' + game.week);
      sub.board.chairmanVeto = v.candidate === '你';
      addLog('🗳 「' + sub.companyName + '」' + v.candidate + ' 当选董事长', 'success');
    } else if (v.type === 'ceo') {
      sub.board.execs = sub.board.execs || {};
      sub.board.execs.ceo = v.candidate;
      addLog('🗳 「' + sub.companyName + '」' + v.candidate + ' 出任 CEO', 'success');
    } else if (v.type === 'dividend') {
      const total = v.candidate;
      const myShare = Math.round(total * getPlayerStakeInSub(sub) / 100);
      game.cash += myShare;
      if (typeof ledgerAddIncome === 'function') ledgerAddIncome('business', '💵', sub.companyName + ' 分红', myShare);
      addLog('💵 「' + sub.companyName + '」分红到账 ¥' + myShare.toLocaleString(), 'success');
    }
  } else {
    addLog('🗳 表决未通过', 'info');
  }
  sub.board.pendingVote = null;
  if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
  if (typeof renderAssetsPanel === 'function' && game.financeSubTab === 'assets') renderAssetsPanel();
}

function buildAcquiredSubsidiaryRecord(key, co, ownershipPct, target) {
  const pn = game.partnerDisplayName || '伴侣';
  const pct = Math.round(ownershipPct) || 100;
  const minority = target && target.shareholders
    ? target.shareholders.filter(function (h) { return !h.persuaded; }).map(function (h) { return { name: h.name, pct: h.pct }; })
    : [];
  const playerRole = { name: '你', title: pct >= 50 ? '董事长兼法定代表人' : '控股股东', sharePct: pct };
  let partnerRole = null;
  if (key === 'companion') {
    partnerRole = {
      name: pn,
      title: inferSubsidiaryJobTitle('companion'),
      sharePct: 0,
      note: '收购标的任职 · 免遭辞退'
    };
  }
  const record = {
    companyId: co.id,
    companyName: co.name,
    sourceKey: key,
    ownershipPct: pct,
    acquiredWeek: game.week || 0,
    playerRole: playerRole,
    partnerRole: partnerRole,
    minorityHolders: minority,
    managed: true,
    status: 'active'
  };
  initSubsidiaryGovernance(record, pct, target);
  return record;
}

function registerAcquiredSubsidiary(key, co, ownershipPct, target) {
  const pc = game && game.playerCompany;
  if (!pc || !co) return;
  pc.subsidiaries = pc.subsidiaries || [];
  const record = buildAcquiredSubsidiaryRecord(key, co, ownershipPct, target);
  const idx = pc.subsidiaries.findIndex(function (s) { return s.companyId === co.id; });
  if (idx >= 0) pc.subsidiaries[idx] = Object.assign(pc.subsidiaries[idx], record);
  else pc.subsidiaries.push(record);
}

function migrateAcquiredSubsidiaries(pc) {
  if (!pc || !pc.founded) return;
  if (pc._acqMigrating) return;
  if (!pc.acquisitions || typeof pc.acquisitions !== 'object' || Array.isArray(pc.acquisitions)) {
    pc.acquisitions = { player: null, companion: null };
  }
  pc._acqMigrating = true;
  try {
  pc.subsidiaries = Array.isArray(pc.subsidiaries) ? pc.subsidiaries : [];
  if (pc.equity && pc.equity.holders && !Array.isArray(pc.equity.holders)) pc.equity.holders = [];
  ['player', 'companion'].forEach(function (key) {
    const coId = pc.acquisitions[key];
    if (!coId) return;
    const co = lookupCompanyById(coId);
    if (!co) return;
    const existing = pc.subsidiaries.find(function (s) { return s.companyId === coId; });
    let pct = 100;
    if (pc.board && pc.board.playerShares != null) pct = pc.board.playerShares;
    if (pc.equity && pc.equity.holders && pc.equity.holders.length) {
      const playerH = pc.equity.holders.find(function (h) { return h.id === 'player'; });
      if (playerH && playerH.pct != null) pct = playerH.pct;
    }
    if (existing) {
      if (existing.ownershipPct == null) existing.ownershipPct = pct;
      if (!existing.companyName) existing.companyName = co.name;
      if (!existing.playerRole) existing.playerRole = { name: '你', title: pct >= 50 ? '董事长兼法定代表人' : '控股股东', sharePct: pct };
      if (key === 'companion' && !existing.partnerRole) {
        existing.partnerRole = {
          name: game.partnerDisplayName || '伴侣',
          title: inferSubsidiaryJobTitle('companion'),
          sharePct: 0,
          note: '收购标的任职 · 免遭辞退'
        };
      }
      if (existing.managed == null) existing.managed = true;
      if (!existing.sourceKey) existing.sourceKey = key;
      if (!existing.status) existing.status = 'active';
      migrateSubsidiaryGovernance(existing);
      return;
    }
    pc.subsidiaries.push(buildAcquiredSubsidiaryRecord(key, co, pct, null));
  });
  } finally {
    delete pc._acqMigrating;
  }
}

function renderAcquiredSubsidiariesHtml(pc) {
  if (!pc || !pc.subsidiaries || !pc.subsidiaries.length) return '';
  let h = '<div class="company-mgmt-section" style="margin-top:8px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.72rem;line-height:1.6">';
  h += '<b>🏛 收购企业</b> <span class="fold-meta">· 控股子公司 · 纳入集团管理</span>';
  pc.subsidiaries.forEach(function (sub) {
    if (sub.status && sub.status !== 'active') return;
    h += '<div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border)">';
    h += '<b>' + (sub.companyName || '未命名企业') + '</b>';
    h += ' <span class="fold-meta">· 控股 <b style="color:var(--accent)">' + (sub.ownershipPct || 100) + '%</b>';
    if (sub.acquiredWeek) h += ' · 第' + sub.acquiredWeek + '周收购';
    h += '</span>';
    if (sub.playerRole) {
      h += '<div class="fold-meta" style="margin-top:3px">你 · ' + sub.playerRole.title + ' · 持股 ' + sub.playerRole.sharePct + '%</div>';
    }
    if (sub.partnerRole) {
      h += '<div class="fold-meta">' + sub.partnerRole.name + ' · ' + sub.partnerRole.title;
      if (sub.partnerRole.sharePct) h += ' · 持股 ' + sub.partnerRole.sharePct + '%';
      if (sub.partnerRole.note) h += ' · <span style="color:var(--green)">' + sub.partnerRole.note + '</span>';
      h += '</div>';
    }
    if (sub.minorityHolders && sub.minorityHolders.length) {
      h += '<div class="fold-meta">少数股东：' + sub.minorityHolders.map(function (mh) { return mh.name + ' ' + mh.pct + '%'; }).join('、') + '</div>';
    }
    const co = lookupCompanyById(sub.companyId);
    const st = co && typeof findStockForCompany === 'function' ? findStockForCompany(co) : null;
    if (st) h += '<div class="fold-meta">上市 ' + st.symbol + ' · 现价 ¥' + st.price.toFixed(2) + '</div>';
    h += ' <button type="button" class="btn" style="font-size:.65rem;padding:2px 6px;margin-left:4px" onclick="setCompanyMgmtContext(\'' + String(sub.companyId).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + '\')">管理</button>';
    h += '</div>';
  });
  h += '</div>';
  return h;
}

function generateTargetCompanyShareholders(co) {
  if (!co) return [{ name: '创始人', pct: 35, votes: 35, persuaded: false, hostile: false }];
  const founders = [
    { name: co.name + '创始人', pct: 28 + Math.floor(Math.random() * 12), votes: 0, persuaded: false, hostile: false, id: 'sh_founder' },
    { name: '机构投资人A', pct: 15 + Math.floor(Math.random() * 10), votes: 0, persuaded: false, hostile: Math.random() < 0.4, id: 'sh_vc_a' },
    { name: '机构投资人B', pct: 8 + Math.floor(Math.random() * 8), votes: 0, persuaded: false, hostile: Math.random() < 0.35, id: 'sh_vc_b' },
    { name: '员工持股平台', pct: 10 + Math.floor(Math.random() * 8), votes: 0, persuaded: false, hostile: false, id: 'sh_esop' },
    { name: '战略股东', pct: 6 + Math.floor(Math.random() * 10), votes: 0, persuaded: false, hostile: Math.random() < 0.3, id: 'sh_strategic' }
  ];
  let total = 0;
  founders.forEach(function (h) { total += h.pct; h.votes = h.pct; });
  if (total < 100) founders[0].pct += 100 - total;
  else if (total > 100) founders[0].pct = Math.max(5, founders[0].pct - (total - 100));
  if (Math.random() < 0.45) {
    co.poisonPill = { active: true, triggerPct: 30, multiplier: 1.8, label: '毒丸计划：收购方持股超30%时剩余股份溢价' + Math.round(0.8 * 100) + '%' };
  }
  return founders;
}

function getAcquisitionProgress(key) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.acquisitionTargets) return null;
  return pc.acquisitionTargets[key] || null;
}

function startEmployerAcquisitionNegotiation(who) {
  if (!hasPlayerCompany()) { addLog('请先注册自己的公司', 'fail'); return; }
  const co = who === 'companion' ? companionEmployerCompany() : playerEmployerCompany();
  if (!co) { addLog(who === 'companion' ? '伴侣当前无业' : '你当前无业', 'fail'); return; }
  if (typeof isStateOwnedCompany === 'function' && isStateOwnedCompany(co)) {
    addLog('「' + co.name + '」为国有控股，不可收购', 'fail');
    return;
  }
  const pc = ensurePlayerCompany();
  const key = who === 'companion' ? 'companion' : 'player';
  if (pc.acquisitions[key] === co.id) { addLog('该企业已收购完成', 'warn'); return; }
  pc.acquisitionTargets = pc.acquisitionTargets || {};
  if (!pc.acquisitionTargets[key]) {
    const basePrice = companyAcquisitionPrice(co);
    pc.acquisitionTargets[key] = {
      companyId: co.id,
      companyName: co.name,
      basePrice: basePrice,
      shareholders: generateTargetCompanyShareholders(co),
      persuadedPct: 0,
      poisonPill: co.poisonPill || null,
      weeksSpent: 0
    };
  }
  openAcquisitionNegotiationModal(key);
}

function acquisitionPersuadedPct(target) {
  if (!target || !target.shareholders) return 0;
  return target.shareholders.filter(function (h) { return h.persuaded; }).reduce(function (s, h) { return s + h.pct; }, 0);
}

function acquisitionMaxRivalPct(target) {
  if (!target || !target.shareholders) return 0;
  return target.shareholders.filter(function (h) { return !h.persuaded; }).reduce(function (m, h) { return Math.max(m, h.pct || 0); }, 0);
}

// 成为最大股东（相对多数）即可控制公司；超过 50% 为绝对控股
function isLargestAcquirer(target) {
  const p = acquisitionPersuadedPct(target);
  return p > 0 && p > acquisitionMaxRivalPct(target);
}

function acquisitionRemainingPrice(target) {
  if (!target) return 0;
  const remaining = target.shareholders.filter(function (h) { return !h.persuaded; });
  let price = 0;
  const pill = target.poisonPill;
  const persuaded = acquisitionPersuadedPct(target);
  remaining.forEach(function (h) {
    let slice = target.basePrice * (h.pct / 100);
    if (pill && pill.active && persuaded + h.pct > (pill.triggerPct || 30)) slice *= pill.multiplier || 1.8;
    if (h.hostile) slice *= 1.25;
    price += slice;
  });
  return Math.round(price);
}

function openAcquisitionNegotiationModal(key) {
  const pc = game.playerCompany;
  const target = pc.acquisitionTargets[key];
  if (!target) return;
  const persuaded = acquisitionPersuadedPct(target);
  const remainPrice = acquisitionRemainingPrice(target);
  const rivalMax = acquisitionMaxRivalPct(target);
  const largest = isLargestAcquirer(target);
  let html = '<p><b>收购谈判 · ' + target.companyName + '</b></p>';
  html += '<p class="fold-meta">已购入 <b style="color:var(--green)">' + persuaded + '%</b> 股权 · 最大对手股东 ' + rivalMax + '% · ' +
    (persuaded > 50 ? '<b style="color:var(--green)">已绝对控股</b>' : (largest ? '<b style="color:var(--green)">已成为最大股东，可控制公司</b>' : '尚未成为最大股东')) + '</p>';
  html += '<p class="fold-meta">说服每位股东即按其持股比例付款买入，股份立即进入「资产 → 收购持股」可卖出。</p>';
  if (target.poisonPill && target.poisonPill.active) {
    html += '<p class="fold-meta" style="color:var(--orange)">⚠ ' + (target.poisonPill.label || '目标启用毒丸计划') + '</p>';
  }
  html += '<p class="fold-meta">剩余股份估价约 ¥' + remainPrice.toLocaleString() + '</p><ul style="margin:8px 0;padding-left:18px;font-size:.82rem">';
  target.shareholders.forEach(function (h, i) {
    html += '<li>' + (h.persuaded ? '✅ ' : '') + h.name + ' · ' + h.pct + '%' +
      (h.hostile ? ' <span style="color:var(--red)">抵制</span>' : '') + '</li>';
  });
  html += '</ul>';
  const buttons = [];
  target.shareholders.forEach(function (h, i) {
    if (h.persuaded) return;
    buttons.push({
      text: '游说 ' + h.name + '（' + h.pct + '%）',
      handler: function () {
        attemptPersuadeShareholder(key, i);
        if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
      }
    });
  });
  if (largest) {
    buttons.unshift({
      text: persuaded > 50 ? '完成收购（绝对控股 ' + persuaded + '%）' : '完成收购（最大股东 ' + persuaded + '%）',
      primary: true,
      handler: function () { finalizeEmployerAcquisition(key); if (typeof closeConsumeModal === 'function') closeConsumeModal(true); }
    });
  }
  buttons.push({ text: '关闭', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '🏢', title: '股权收购谈判', html: html, buttons: buttons });
  }
}

function attemptPersuadeShareholder(key, idx) {
  const pc = game.playerCompany;
  const target = pc.acquisitionTargets[key];
  if (!target || !target.shareholders[idx] || target.shareholders[idx].persuaded) return;
  const h = target.shareholders[idx];
  const cost = Math.round(target.basePrice * (h.pct / 100) * (h.hostile ? 1.3 : 1));
  if (game.cash < cost) { addLog('游说/要约需 ¥' + cost.toLocaleString() + '，现金不足', 'fail'); return; }
  const persuaded = acquisitionPersuadedPct(target);
  const pill = target.poisonPill;
  let finalCost = cost;
  if (pill && pill.active && persuaded + h.pct > (pill.triggerPct || 30)) finalCost = Math.round(cost * (pill.multiplier || 1.8));
  if (game.cash < finalCost) { addLog('毒丸触发后需 ¥' + finalCost.toLocaleString(), 'fail'); return; }
  const roll = Math.random();
  const chance = h.hostile ? 0.28 : 0.55;
  if (roll > chance) {
    addLog('游说「' + h.name + '」未果，对方观望中', 'warn');
    return;
  }
  game.cash -= finalCost;
  if (typeof ledgerAddExpense === 'function') ledgerAddExpense('business', '🏢', '收购要约·' + h.name, finalCost, false);
  h.persuaded = true;
  target.persuadedPct = acquisitionPersuadedPct(target);
  addLog('✅ 已购入 ' + h.name + ' 持有的 ' + h.pct + '% 股权 · 累计 ' + target.persuadedPct + '%', 'success');
  const coRef = lookupCompanyById(target.companyId);
  if (coRef && typeof syncAcquisitionHolding === 'function') {
    const got = syncAcquisitionHolding(coRef, target);
    if (got) addLog('🧾 股份已入账，可在「资产 → 收购持股」查看、卖出', 'info');
  }
  if (isLargestAcquirer(target)) addLog(target.persuadedPct > 50 ? '已绝对控股，可完成收购' : '你已是最大股东，可完成收购取得控制权', 'info');
  openAcquisitionNegotiationModal(key);
}

function finalizeEmployerAcquisition(key) {
  const pc = game.playerCompany;
  const target = pc.acquisitionTargets[key];
  if (!target || !isLargestAcquirer(target)) {
    addLog('需成为最大股东（相对多数）才能完成收购', 'fail');
    return;
  }
  const co = key === 'companion' ? companionEmployerCompany() : playerEmployerCompany();
  if (!co) return;
  pc.acquisitions[key] = co.id;
  const persuaded = acquisitionPersuadedPct(target);
  if (typeof syncAcquisitionHolding === 'function') syncAcquisitionHolding(co, target);
  else addCompanyHolding(co);
  if (typeof registerAcquiredSubsidiary === 'function') registerAcquiredSubsidiary(key, co, persuaded, target);
  pc.board.foundingType = pc.board.foundingType || 'acquired';
  delete pc.acquisitionTargets[key];
  const pn = key === 'companion' ? (game.partnerDisplayName || '伴侣') : '你';
  const control = persuaded > 50 ? '绝对控股 ' + persuaded + '%' : '最大股东 ' + persuaded + '%·控制';
  addLog('🏢 收购完成「' + co.name + '」· ' + control + ' · ' + pn + '可不去上班且不会被辞退', 'success');
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
  if (typeof updateUI === 'function') updateUI();
}

function startChairmanElection() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded) return;
  migrateCompanyGovernanceFull();
  if (pc.board.pendingVote) { addLog('已有待表决事项', 'warn'); return; }
  const candidates = ['你'];
  (pc.equity.holders || []).forEach(function (h) {
    if (h.name !== '你' && candidates.indexOf(h.name) < 0) candidates.push(h.name);
  });
  if (candidates.length < 2) candidates.push(typeof pickStrangerDisplayName === 'function' ? pickStrangerDisplayName('male') : '赵董事');
  const votes = {};
  candidates.forEach(function (n) { votes[n] = Math.floor(Math.random() * 30); });
  let winner = candidates[0], maxV = -1;
  candidates.forEach(function (n) {
    if (votes[n] > maxV) { maxV = votes[n]; winner = n; }
  });
  if (isPlayerChairman()) votes['你'] = (votes['你'] || 0) + getPlayerVotePct();
  candidates.forEach(function (n) {
    if (n !== '你') {
      const h = (pc.equity.holders || []).find(function (x) { return x.name === n; });
      if (h) votes[n] = (votes[n] || 0) + h.votes;
    }
  });
  winner = candidates[0]; maxV = -1;
  candidates.forEach(function (n) {
    if (votes[n] > maxV) { maxV = votes[n]; winner = n; }
  });
  pc.board.pendingVote = {
    type: 'chairman',
    topic: '选举董事长',
    candidate: winner,
    votes: votes,
    week: game.week,
    playerVeto: isPlayerChairman() && pc.board.chairmanVeto
  };
  addLog('🗳 董事会选举董事长 · 领先：' + winner, 'info');
  openBoardVoteModal();
}

function startCeoElection() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded) return;
  if (pc.board.pendingVote) { addLog('已有待表决事项', 'warn'); return; }
  const candidate = Math.random() < 0.6 ? '你' : (typeof pickStrangerDisplayName === 'function' ? pickStrangerDisplayName('male') : '外聘总裁');
  pc.board.pendingVote = {
    type: 'ceo',
    topic: '选举首席执行官',
    candidate: candidate,
    forPct: 40 + Math.floor(Math.random() * 40),
    week: game.week,
    playerVeto: isPlayerChairman() && pc.board.chairmanVeto
  };
  addLog('🗳 董事会审议 CEO 人选：' + candidate, 'info');
  openBoardVoteModal();
}

function openBoardVoteModal() {
  const pc = game.playerCompany;
  const v = pc.board.pendingVote;
  if (!v || typeof showConsumeModalHandlers !== 'function') return;
  let html = '<p><b>' + v.topic + '</b></p><p>提名：<b>' + v.candidate + '</b></p>';
  if (v.votes) {
    html += '<p class="fold-meta">得票：' + Object.keys(v.votes).map(function (k) { return k + ' ' + v.votes[k]; }).join(' · ') + '</p>';
  } else if (v.forPct != null) {
    html += '<p class="fold-meta">机构票倾向 ' + v.forPct + '% 赞成</p>';
  }
  if (v.playerVeto) html += '<p class="fold-meta" style="color:var(--accent)">你是董事长，拥有一票否决权</p>';
  const buttons = [
    { text: '赞成', primary: true, handler: function () { resolveGovernanceVote(true); } }
  ];
  if (v.playerVeto) buttons.push({ text: '董事长否决', handler: function () { resolveGovernanceVote(false); } });
  else buttons.push({ text: '反对', handler: function () { resolveGovernanceVote(false); } });
  showConsumeModalHandlers({ icon: '🗳', title: '董事会表决', html: html, buttons: buttons });
}

function resolveGovernanceVote(approve) {
  const pc = game.playerCompany;
  const v = pc.board.pendingVote;
  if (!v) return;
  if (!approve && v.playerVeto) {
    addLog('🗳 董事长否决「' + v.topic + '」', 'warn');
  } else if (approve || (v.forPct != null && v.forPct >= 50)) {
    if (v.type === 'chairman') {
      pc.board.chairman = v.candidate;
      pc.board.chairmanId = v.candidate === '你' ? 'player' : ('chair_' + game.week);
      pc.board.chairmanVeto = v.candidate === '你';
      addLog('🗳 ' + v.candidate + ' 当选董事长', 'success');
    } else if (v.type === 'ceo') {
      pc.board.execs.ceo = v.candidate;
      pc.board.ceo = v.candidate;
      const execDept = (pc.departments || []).find(function (d) { return d.id === 'exec'; });
      if (execDept) execDept.head = v.candidate;
      addLog('🗳 ' + v.candidate + ' 出任 CEO', 'success');
    } else if (v.roleKey && typeof applyBoardExecElection === 'function') {
      applyBoardExecElection(v.roleKey, v.candidate);
    }
  } else {
    addLog('🗳 表决未通过', 'info');
  }
  pc.board.pendingVote = null;
  if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
}

function renderCompanyGovernanceHtml() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.board) return '';
  migrateCompanyGovernanceFull();
  const b = pc.board;
  let h = '<p style="margin-top:8px"><b>治理结构</b></p>';
  h += '<div class="fold-meta">董事长 ' + (b.chairman || '—') + (b.chairmanVeto ? ' · 有一票否决' : '') + '</div>';
  h += '<div class="fold-meta">CEO ' + (b.execs && b.execs.ceo || b.ceo || '—') + ' · 监事 ' + (b.supervisor || '<span style="color:var(--orange)">待任命</span>') + '</div>';
  if (b.foundingType === 'solo') h += '<div class="fold-meta">创始独资 · 你持股 100%</div>';
  else if (b.foundingType === 'partner') h += '<div class="fold-meta">合伙创业 · 合伙人 ' + (pc.partnerName || '—') + '</div>';
  else if (b.foundingType === 'acquired') h += '<div class="fold-meta">收购控股 · 需维护少数股东关系</div>';
  return h;
}

function openCompanyGovernanceMenu() {
  if (!hasPlayerCompany()) return;
  const sub = typeof getActiveSubsidiary === 'function' ? getActiveSubsidiary() : null;
  if (sub) { openSubsidiaryGovernanceMenu(sub.companyId); return; }
  migrateCompanyGovernanceFull();
  let html = renderCompanyGovernanceHtml();
  html += typeof renderCompanyEquityHtml === 'function' ? renderCompanyEquityHtml() : '';
  const buttons = [];
  if (!game.playerCompany.board.supervisorAppointed) {
    buttons.push({ text: '任命监事', handler: function () { promptAppointSupervisorIfNeeded(); if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
  }
  if ((game.playerCompany.equity.holders || []).length > 1) {
    buttons.push({ text: '选举董事长', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); startChairmanElection(); } });
    buttons.push({ text: '选举 CEO', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); startCeoElection(); } });
  }
  if (typeof openBoardExecVoteMenu === 'function') {
    buttons.push({ text: '高管改选', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); openBoardExecVoteMenu(); } });
  }
  buttons.push({ text: '关闭', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '⚖', title: '公司治理', html: html, buttons: buttons });
  }
}
