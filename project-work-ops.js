/* 项目制打工运营 · 帮他人完成理想 — 由 build.js 注入 */
const IDEAL_CONTRACT_WEEKLY_PAY = 12000;
const IDEAL_CONTRACT_WEEKS = 12;
const IDEAL_CONTRACT_PHASES = [
  { id: 'plan', name: '立项策划', target: 22, fail: 0.07 },
  { id: 'build', name: '落地执行', target: 55, fail: 0.11 },
  { id: 'sprint', name: '发布冲刺', target: 85, fail: 0.13 },
  { id: 'deliver', name: '收官交付', target: 100, fail: 0.06 }
];

function initIdealContractPhases(contract) {
  if (!contract) return;
  contract.phaseIndex = 0;
  contract.phaseName = IDEAL_CONTRACT_PHASES[0].name;
  contract.riskPoints = contract.riskPoints || 0;
  contract.retriesLeft = contract.retriesLeft != null ? contract.retriesLeft : 2;
  contract.milestonesHit = contract.milestonesHit || [];
}

function checkIdealContractMilestones(con) {
  if (!con || con.status !== 'active') return;
  const p = con.progress || 0;
  IDEAL_CONTRACT_PHASES.forEach(function (ph, idx) {
    if (p >= ph.target && (con.milestonesHit || []).indexOf(ph.id) < 0) {
      con.milestonesHit = con.milestonesHit || [];
      con.milestonesHit.push(ph.id);
      con.phaseIndex = Math.min(IDEAL_CONTRACT_PHASES.length - 1, idx + 1);
      con.phaseName = IDEAL_CONTRACT_PHASES[con.phaseIndex] ? IDEAL_CONTRACT_PHASES[con.phaseIndex].name : '完成';
      if (Math.random() < ph.fail) {
        con.riskPoints = (con.riskPoints || 0) + 1;
        addLog('⚠ 里程碑「' + ph.name + '」遇挫 · 项目风险 +' + con.riskPoints, 'warn');
        if (typeof addStress === 'function') addStress(3, '项目受挫 ');
        if (con.riskPoints >= 3) {
          if ((con.retriesLeft || 0) > 0) {
            con.retriesLeft--;
            con.riskPoints = 1;
            con.progress = Math.max(0, p - 8);
            addLog('🔄 团队抢救：消耗 1 次重试 · 进度回退至 ' + Math.round(con.progress) + '%', 'warn');
          } else {
            failIdealWorkContract(con, 'risk');
            return;
          }
        }
      } else {
        addLog('✅ 里程碑达成：' + ph.name + '（' + ph.target + '%）', 'success');
      }
    }
  });
}

function failIdealWorkContract(con, reason) {
  if (!con || con.status !== 'active') return;
  const c = typeof findContact === 'function' ? findContact(con.contactId) : null;
  if (reason === 'risk') {
    con.status = 'failed';
    const partial = Math.round((con.progress || 0) * 0.4);
    if (c && c.dream) c.dream.progress = Math.max(c.dream.progress || 0, partial);
    addLog('💔 项目制合同失败：「' + con.dreamTitle + '」停滞于 ' + Math.round(con.progress) + '%', 'fail');
  } else if (reason === 'timeout') {
    con.status = 'timeout';
    addLog('⏱ 项目合同到期：「' + con.dreamTitle + '」进度 ' + Math.round(con.progress) + '%', 'warn');
  }
  if (game.activeIdealContractId === con.id) game.activeIdealContractId = null;
}

function idealContractPhaseHtml(con) {
  if (!con) return '';
  const ph = con.phaseName || IDEAL_CONTRACT_PHASES[0].name;
  return ' · 阶段「' + ph + '」' + (con.riskPoints ? ' · 风险' + con.riskPoints : '') +
    (con.retriesLeft != null ? ' · 重试余' + con.retriesLeft : '');
}

function ensureIdealWorkState() {
  if (!game) return;
  if (!game.idealWorkContracts) game.idealWorkContracts = [];
  if (game.activeIdealContractId == null) game.activeIdealContractId = null;
}

function findIdealContract(contactId) {
  return (game.idealWorkContracts || []).find(function (c) {
    return c.contactId === contactId && c.status === 'active';
  });
}

function acceptIdealWorkContract(contactId) {
  ensureIdealWorkState();
  const c = typeof findContact === 'function' ? findContact(contactId) : (game.contacts || []).find(function (x) { return x.id === contactId; });
  if (!c || !c.dream) { addLog('对方没有理想项目', 'fail'); return; }
  if (!c.dream.active && !c.dream.sponsorCash) { addLog('需先赞助或激活对方理想', 'fail'); return; }
  if (typeof contactFamiliarityTier === 'function' && contactFamiliarityTier(c) !== 'best' && (c.familiarity || 0) < 90) {
    addLog('需挚友（熟悉度≥90）才能项目制接单', 'fail'); return;
  }
  if (findIdealContract(contactId)) { addLog('已有该理想的项目合同', 'warn'); return; }
  if ((game.idealWorkContracts || []).filter(function (x) { return x.status === 'active'; }).length >= 2) {
    addLog('最多同时接 2 个理想项目合同', 'fail'); return;
  }
  const contract = {
    id: 'iwc_' + game.week + '_' + Math.random().toString(36).slice(2, 6),
    contactId: contactId, contactName: c.name,
    dreamTitle: c.dream.title, dreamCareer: c.dream.career,
    startWeek: game.week, weeksTotal: IDEAL_CONTRACT_WEEKS, weeksDone: 0,
    progress: c.dream.progress || 0, status: 'active',
    weeklyPay: IDEAL_CONTRACT_WEEKLY_PAY
  };
  initIdealContractPhases(contract);
  game.idealWorkContracts.push(contract);
  game.activeIdealContractId = contract.id;
  c.dream.contractId = contract.id;
  addLog('📋 项目制接单：帮 ' + c.name + ' 运营「' + c.dream.title + '」· ' + IDEAL_CONTRACT_WEEKS + ' 周', 'success');
  if (typeof updateUI === 'function') updateUI();
}

function activeIdealContract() {
  ensureIdealWorkState();
  if (!game.activeIdealContractId) return null;
  return (game.idealWorkContracts || []).find(function (c) { return c.id === game.activeIdealContractId && c.status === 'active'; });
}

function idealWorkShiftHtml() {
  const con = activeIdealContract();
  if (!con) return '';
  return '<p style="margin-top:8px;padding:8px;background:var(--bg);border-radius:8px;border:1px dashed var(--accent)">' +
    '📋 项目制：<b>' + con.dreamTitle + '</b>（' + con.contactName + '）<br>' +
    '<span class="fold-meta">进度 ' + Math.round(con.progress) + '% · 合同 ' + con.weeksDone + '/' + con.weeksTotal + ' 周' +
    idealContractPhaseHtml(con) + '</span></p>';
}

function idealWorkShiftButtons() {
  const con = activeIdealContract();
  if (!con) return null;
  return [{ text: '📋 理想项目制运营', fn: 'doIdealProjectWorkShift()' }];
}

function doIdealProjectWorkShift() {
  const con = activeIdealContract();
  if (!con || con.status !== 'active') { addLog('无有效项目合同', 'fail'); return; }
  const c = typeof findContact === 'function' ? findContact(con.contactId) : null;
  const gain = 3 + Math.floor(Math.random() * 5);
  con.progress = Math.min(100, con.progress + gain);
  con.weeksDone++;
  if (c && c.dream) c.dream.progress = con.progress;
  if (typeof checkIdealContractMilestones === 'function') checkIdealContractMilestones(con);
  if (con.status !== 'active') {
    if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
    if (typeof finishWorkShift === 'function') finishWorkShift();
    return;
  }
  const pay = Math.round(con.weeklyPay * (0.8 + Math.random() * 0.4));
  game.cash += pay;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('ideal', '📋', '项目制运营', pay);
  addLog('📋 项目制运营「' + con.dreamTitle + '」+' + gain + '% · +¥' + pay.toLocaleString(), 'success');
  if (con.progress >= 100 || con.weeksDone >= con.weeksTotal) completeIdealWorkContract(con);
  if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  if (typeof finishWorkShift === 'function') finishWorkShift();
}

function completeIdealWorkContract(con) {
  if (!con || con.status !== 'active' || con.status === 'failed') return;
  con.status = con.progress >= 100 ? 'success' : 'timeout';
  const c = typeof findContact === 'function' ? findContact(con.contactId) : null;
  if (c && c.dream) {
    if (con.progress >= 100) {
      c.dream.progress = 100;
      if (typeof completeContactIdeal === 'function') completeContactIdeal(c);
      else { c.dream.completed = true; c.dream.active = false; }
      addLog('🏆 项目制合同完成：' + c.name + ' 的理想「' + con.dreamTitle + '」', 'success');
    } else {
      addLog('⏱ 项目合同到期：「' + con.dreamTitle + '」进度 ' + Math.round(con.progress) + '%', 'warn');
    }
  }
  if (game.activeIdealContractId === con.id) game.activeIdealContractId = null;
}

function migrateIdealWorkContracts() {
  ensureIdealWorkState();
  (game.idealWorkContracts || []).forEach(function (con) {
    if (con.status === 'active' && con.phaseName == null) initIdealContractPhases(con);
  });
}

function tickIdealWorkContracts() {
  if (!game || game.gameOver) return;
  ensureIdealWorkState();
  migrateIdealWorkContracts();
  if (game.employed && game.daily && (game.daily.workedDays || 0) >= 3) {
    (game.idealWorkContracts || []).forEach(function (con) {
      if (con.status !== 'active' || con._weekTicked === game.week) return;
      con._weekTicked = game.week;
      con.progress = Math.min(100, con.progress + 1);
      const c = typeof findContact === 'function' ? findContact(con.contactId) : null;
      if (c && c.dream) c.dream.progress = con.progress;
      if (typeof checkIdealContractMilestones === 'function') checkIdealContractMilestones(con);
      if (con.status !== 'active') return;
      if (con.progress >= 100) completeIdealWorkContract(con);
    });
  }
  (game.idealWorkContracts || []).forEach(function (con) {
    if (con.status !== 'active') return;
    if (game.week - con.startWeek >= con.weeksTotal) completeIdealWorkContract(con);
  });
}

function linkCompanyProjectToIdeal(projectId, contactId) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.projects) return;
  const p = pc.projects.find(function (x) { return x.id === projectId; });
  const c = typeof findContact === 'function' ? findContact(contactId) : null;
  if (!p || !c || !c.dream) return;
  p.idealContactId = contactId;
  p.idealTitle = c.dream.title;
  p.mission = '帮 ' + c.name + ' 完成理想「' + c.dream.title + '」';
  addLog('🔗 公司项目「' + (p.brandName || p.name) + '」已绑定 ' + c.name + ' 的理想', 'success');
}

function tickCompanyIdealProjects() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded || !pc.projects) return;
  pc.projects.forEach(function (p) {
    if (!p.idealContactId || p.progress >= 100) return;
    const c = typeof findContact === 'function' ? findContact(p.idealContactId) : null;
    if (!c || !c.dream) return;
    if (Math.random() < 0.35) {
      p.progress = Math.min(100, (p.progress || 0) + 1);
      c.dream.progress = Math.min(100, (c.dream.progress || 0) + 2);
      if (c.dream.progress >= 100 && typeof completeContactIdeal === 'function') completeContactIdeal(c);
    }
  });
}

function tickProjectWorkOps() {
  tickIdealWorkContracts();
  tickCompanyIdealProjects();
}
