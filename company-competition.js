/* 行业竞单 · 分公司与同业争夺业务 — 由 build.js 注入 */
const COMPETITION_BID_TIERS = [
  { id: 'low', label: '低价抢单', costMult: 0.12, winBonus: -8, marginMult: 0.75 },
  { id: 'standard', label: '标准报价', costMult: 0.18, winBonus: 4, marginMult: 1 },
  { id: 'premium', label: '溢价品牌战', costMult: 0.28, winBonus: 12, marginMult: 1.15 }
];

function migrateCompanyCompetition() {
  if (!game || !game.playerCompany || !game.playerCompany.founded) return;
  const pc = game.playerCompany;
  if (!pc.competitionLog) pc.competitionLog = [];
  if (typeof migrateCompanyBranches === 'function') migrateCompanyBranches();
  (pc.branches || []).forEach(function (br) {
    if (!br.rivals || !br.rivals.length) br.rivals = pickBranchRivals(br.city, br.isHQ ? 2 : 3);
  });
}

function pickBranchRivals(city, n) {
  const pc = game.playerCompany;
  const cat = (typeof getCompanyPrimaryIndustry === 'function' ? getCompanyPrimaryIndustry(pc) : null) ||
    ((pc.industries && pc.industries.length) ? pc.industries[pc.industries.length - 1] : '信息技术');
  const pool = (game.companyAll || []).filter(function (co) {
    if (!co || !co.name) return false;
    const coCity = co.city || (typeof parseCityFromCompanyName === 'function' ? parseCityFromCompanyName(co.name) : null);
    if (coCity && coCity !== city) return false;
    if (co.categories && co.categories.indexOf(cat) >= 0) return true;
    if (co.primaryCategory === cat) return true;
    return !coCity;
  });
  const shuffled = pool.slice().sort(function () { return Math.random() - 0.5; });
  const picks = shuffled.slice(0, n);
  while (picks.length < n && game.companyAll && game.companyAll.length) {
    const co = game.companyAll[Math.floor(Math.random() * game.companyAll.length)];
    if (co && picks.indexOf(co) < 0) picks.push(co);
  }
  return picks.map(function (co) {
    return {
      id: co.id, name: co.name, city: co.city || city,
      tier: co.tier || 'mid', scale: co.scale || 'medium',
      strength: 42 + Math.floor(Math.random() * 38)
    };
  });
}

function calcPlayerBidScore(branch, project, bidTier) {
  const pc = game.playerCompany;
  const tier = COMPETITION_BID_TIERS.find(function (t) { return t.id === bidTier; }) || COMPETITION_BID_TIERS[1];
  let score = 48;
  score += (pc.familiarity || 0) * 0.25;
  score += (pc.influence || 0) * 0.2;
  if (branch && branch.kpi) score += (branch.kpi.composite || 50) * 0.35;
  if (project && project.progress) score += project.progress * 0.08;
  score += tier.winBonus;
  if (branch && branch.managerStaffId) {
    const mgr = (pc.staff || []).find(function (s) { return s.id === branch.managerStaffId; });
    if (mgr) score += ((mgr.kpi || 70) - 60) * 0.4;
  }
  return Math.round(score);
}

function tickIndustryCompetitionWeekly() {
  if (!hasPlayerCompany()) return;
  migrateCompanyCompetition();
  const pc = game.playerCompany;
  const active = (pc.projects || []).filter(function (p) { return (p.progress || 0) < 100; });
  if (!active.length) return;
  if (Math.random() > 0.55) return;
  const proj = active[Math.floor(Math.random() * active.length)];
  const br = typeof getBranchById === 'function' ? getBranchById(proj.branchId) : (pc.branches || [])[0];
  if (!br) return;
  if (!br.rivals || !br.rivals.length) br.rivals = pickBranchRivals(br.city, 3);
  const rival = br.rivals[Math.floor(Math.random() * br.rivals.length)];
  const dealValue = Math.round((proj.budget || 500000) * (0.06 + Math.random() * 0.12));
  pc.pendingCompetition = {
    week: game.week,
    projectId: proj.id,
    projectLabel: typeof projectDisplayLabel === 'function' ? projectDisplayLabel(proj) : proj.name,
    branchId: br.id,
    branchCity: br.city,
    rival: rival,
    dealValue: dealValue,
    industry: proj.industry || (typeof getCompanyPrimaryIndustry === 'function' ? getCompanyPrimaryIndustry(pc) : null) || '信息技术'
  };
  addLog('⚔ ' + br.city + ' · 竞品「' + rival.name + '」争夺「' + pc.pendingCompetition.projectLabel + '」订单', 'warn');
  if (typeof isAutoLifeSimulating === 'function' && isAutoLifeSimulating()) return;
  if (typeof autoLifeRunning !== 'undefined' && autoLifeRunning) return;
  setTimeout(function () { openCompetitionBidModal(); }, 400);
}

function openCompetitionBidModal() {
  const pc = game.playerCompany;
  const deal = pc.pendingCompetition;
  if (!deal) return;
  const br = typeof getBranchById === 'function' ? getBranchById(deal.branchId) : null;
  const mgr = br && br.manager ? br.manager : '分公司经理';
  let html = '<p><b>' + deal.branchCity + ' · 同业竞单</b></p>';
  html += '<p class="fold-meta">项目：' + deal.projectLabel + ' · 行业：' + deal.industry + '</p>';
  html += '<p class="fold-meta">对手：<b style="color:var(--red)">' + deal.rival.name + '</b>（实力 ' + deal.rival.strength + '）</p>';
  html += '<p class="fold-meta">订单估值约 ¥' + deal.dealValue.toLocaleString() + ' · ' + mgr + ' 等你拍板</p>';
  const buttons = COMPETITION_BID_TIERS.map(function (tier) {
    const cost = Math.round((deal.dealValue || 100000) * tier.costMult);
    return {
      text: tier.label + ' · 投入约 ¥' + cost.toLocaleString(),
      handler: function () {
        resolveCompetitionBid(tier.id);
        if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
      }
    };
  });
  buttons.push({
    text: '放弃此单',
    handler: function () {
      resolveCompetitionBid('forfeit');
      if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
    }
  });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '⚔', title: '行业竞单', html: html, buttons: buttons });
  }
}

function resolveCompetitionBid(bidId) {
  const pc = game.playerCompany;
  const deal = pc.pendingCompetition;
  if (!deal) return;
  const proj = (pc.projects || []).find(function (p) { return p.id === deal.projectId; });
  const br = typeof getBranchById === 'function' ? getBranchById(deal.branchId) : null;
  if (bidId === 'forfeit') {
    if (proj) proj.progress = Math.max(0, (proj.progress || 0) - 2);
    addLog('⚔ 放弃竞单 · ' + deal.rival.name + ' 或拿下份额', 'info');
    pc.competitionLog.unshift({ week: game.week, won: false, rival: deal.rival.name, city: deal.branchCity, forfeit: true });
    pc.pendingCompetition = null;
    return;
  }
  const tier = COMPETITION_BID_TIERS.find(function (t) { return t.id === bidId; }) || COMPETITION_BID_TIERS[1];
  const cost = Math.round(deal.dealValue * tier.costMult);
  if (game.cash < cost) { addLog('竞单投入需 ¥' + cost.toLocaleString(), 'fail'); return; }
  game.cash -= cost;
  if (typeof ledgerAddExpense === 'function') ledgerAddExpense('business', '⚔', '竞单投入·' + deal.branchCity, cost, false);
  const playerScore = calcPlayerBidScore(br, proj, bidId);
  const rivalScore = deal.rival.strength + Math.floor(Math.random() * 18);
  const won = playerScore >= rivalScore;
  if (won && proj) {
    const gain = 3 + Math.floor(Math.random() * 5);
    proj.progress = Math.min(100, (proj.progress || 0) + gain);
    const rev = Math.round(deal.dealValue * tier.marginMult);
    game.cash += rev;
    if (typeof ledgerAddIncome === 'function') ledgerAddIncome('business', '⚔', '竞单胜出·' + deal.branchCity, rev);
    if (pc.familiarity != null) pc.familiarity = Math.min(100, pc.familiarity + 1);
    addLog('⚔ 竞单胜出！' + deal.branchCity + ' · +' + gain + '% 进度 · 回款 ¥' + rev.toLocaleString(), 'success');
  } else if (proj) {
    proj.progress = Math.max(0, (proj.progress || 0) - 1);
    addLog('⚔ 竞单失利 · ' + deal.rival.name + ' 拿下订单（我方 ' + playerScore + ' vs ' + rivalScore + '）', 'fail');
  }
  pc.competitionLog.unshift({
    week: game.week, won: won, rival: deal.rival.name, city: deal.branchCity,
    bid: tier.label, score: playerScore, rivalScore: rivalScore
  });
  if (pc.competitionLog.length > 20) pc.competitionLog = pc.competitionLog.slice(0, 20);
  pc.pendingCompetition = null;
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
  if (typeof updateUI === 'function') updateUI();
}

function renderCompetitionPanelHtml() {
  if (!hasPlayerCompany()) return '';
  migrateCompanyCompetition();
  const pc = game.playerCompany;
  let h = '<div style="margin-top:6px;padding:6px 8px;border:1px dashed var(--border);border-radius:6px;font-size:.68rem">';
  h += '<b>⚔ 行业竞单</b>';
  if (pc.pendingCompetition) {
    h += ' <button class="btn" style="font-size:.65rem;padding:2px 6px;margin-left:4px" onclick="openCompetitionBidModal()">待处理竞单</button>';
  }
  (pc.branches || []).forEach(function (br) {
    if (!br.rivals || !br.rivals.length) return;
    h += '<div class="fold-meta" style="margin-top:4px">' + br.city + ' 竞品：' +
      br.rivals.map(function (r) { return r.name; }).slice(0, 3).join('、') + '</div>';
  });
  const recent = (pc.competitionLog || [])[0];
  if (recent) {
    h += '<div class="fold-meta">' + (recent.won ? '✅' : '❌') + ' 第' + recent.week + '周 ' + recent.city + ' vs ' + recent.rival + '</div>';
  }
  h += '</div>';
  return h;
}

function foundCompanyBranchWithCompetition(city) {
  if (typeof foundCompanyBranch === 'function') foundCompanyBranch(city);
  const br = typeof getBranchByCity === 'function' ? getBranchByCity(city) : null;
  if (br) br.rivals = pickBranchRivals(city, 3);
}
