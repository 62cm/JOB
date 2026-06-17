/* 理想运营 · 公司治理 · 别墅职员 — 由 build.js 注入 */
const IDEAL_OPS_WEEKLY_COST = 8000;
const IDEAL_SPONSOR_TIERS = [
  { label: '小额赞助', cost: 50000, progress: 8 },
  { label: '标准赞助', cost: 200000, progress: 18 },
  { label: '重投入', cost: 800000, progress: 35 }
];
const STATE_OWNED_CODES = ['601398', '601939', '601288', '601988', '601668', '601390', '601766', '601111', '600029', '600104', '601857', '600028'];
const VILLA_STAFF = [
  { id: 'staff_butler', name: '老周', role: '管家', gender: 'male', jobTitle: '别墅管家' },
  { id: 'staff_guard', name: '铁柱', role: '保镖', gender: 'male', jobTitle: '私人保镖' },
  { id: 'staff_driver', name: '小马', role: '司机', gender: 'male', jobTitle: '专职司机' }
];
const COMPANY_STAFF_NPC = [
  { id: 'staff_ceo', name: '你', role: 'CEO', gender: '', jobTitle: '首席执行官' },
  { id: 'staff_cfo', name: '王建国', role: 'CFO', gender: 'male', jobTitle: '财务总监' },
  { id: 'staff_hr', name: '林婉儿', role: 'HR', gender: 'female', jobTitle: '人力总监' },
  { id: 'staff_biz', name: '陈海洋', role: '商务', gender: 'male', jobTitle: '商务总裁' },
  { id: 'staff_ops', name: '刘运营', role: '运营', gender: 'female', jobTitle: '运营总监' },
  { id: 'staff_cmo', name: '周市场', role: '市场', gender: 'male', jobTitle: '市场总监' },
  { id: 'staff_secretary', name: '苏小秘', role: '秘书', gender: 'female', jobTitle: '总裁秘书' }
];
const COMPANY_SERVICE_STAFF = [
  { id: 'staff_co_guard', name: '阿豹', role: '保镖', gender: 'male', jobTitle: '公司保镖' },
  { id: 'staff_co_driver', name: '老赵', role: '司机', gender: 'male', jobTitle: '公司司机' }
];
const PLAYER_STAFF_CIRCLE_IDS = ['villa_staff', 'company_exec', 'company_service', 'company_team'];

function isPlayerStaffWorkplaceCircle(circle) {
  if (!circle) return false;
  if (circle.kind === 'staff') return true;
  return PLAYER_STAFF_CIRCLE_IDS.indexOf(circle.id) >= 0;
}

function ensureStaffContact(s, companyLabel, metWhere, extra) {
  if (typeof ensureCoreContact !== 'function') return null;
  extra = extra || {};
  const c = ensureCoreContact(s.id, {
    kind: 'staff', name: s.name, gender: s.gender, role: s.role,
    company: companyLabel, jobTitle: s.jobTitle,
    income: extra.income != null ? extra.income : 0,
    metWhere: metWhere || companyLabel
  });
  if (typeof ensureContactDreamFields === 'function') ensureContactDreamFields(c);
  if (typeof ensurePersonLifespan === 'function') ensurePersonLifespan(c);
  return c;
}

function ensurePlayerInStaffCircle(circle, roleLabel) {
  if (!circle.members) circle.members = [];
  if (!circle.members.some(function (m) { return m.id === 'player'; })) {
    circle.members.unshift({ id: 'player', familiarity: 100, attraction: 0, role: roleLabel || '你' });
  }
}

function isStateOwnedStock(st) {
  if (!st) return false;
  if (st.stateOwned) return true;
  return STATE_OWNED_CODES.indexOf(String(st.code || st.symbol || '')) >= 0;
}

function isStateOwnedCompany(co) {
  if (!co) return false;
  if (co.stateOwned) return true;
  const st = typeof findStockForCompany === 'function' ? findStockForCompany(co) : null;
  return isStateOwnedStock(st);
}

function migrateCompanyGovernance() {
  if (!game) return;
  const pc = game && game.playerCompany;
  if (pc && pc.founded) {
    if (typeof migrateCompanyGovernanceFull === 'function') migrateCompanyGovernanceFull();
    else if (!pc.board) {
      pc.board = {
        foundingType: 'solo', playerShares: 100, chairman: '你', chairmanId: 'player', chairmanVeto: true,
        ceo: 'player', execs: { ceo: '你', cfo: '王建国', hr: '林婉儿', biz: '陈海洋', cto: '（待任命）', ops: '刘运营', cmo: '周市场' },
        pendingVote: null, supervisor: null, supervisorAppointed: false
      };
    }
  }
  syncAllPlayerStaffCircles();
}

function syncAllPlayerStaffCircles() {
  if (!game) return;
  if (game._syncingStaffCircles) return;
  game._syncingStaffCircles = true;
  try {
    if (!game.playerCircles) game.playerCircles = { social: [], hobby: [], workplace: [] };
    if (typeof hasVilla === 'function' && hasVilla()) syncVillaStaffToWorkplaceCircle();
    else removeStaffWorkplaceCircle('villa_staff');
    if (game.playerCompany && game.playerCompany.founded) {
      syncCompanyStaffToWorkplaceCircle();
      syncCompanyServiceStaffToWorkplaceCircle();
    } else {
      removeStaffWorkplaceCircle('company_exec');
      removeStaffWorkplaceCircle('company_service');
      removeStaffWorkplaceCircle('company_team');
    }
  } finally {
    game._syncingStaffCircles = false;
  }
}

function removeStaffWorkplaceCircle(circleId) {
  if (!game || !game.playerCircles || !game.playerCircles.workplace) return;
  game.playerCircles.workplace = game.playerCircles.workplace.filter(function (c) { return c.id !== circleId; });
}

function syncVillaStaffToWorkplaceCircle() {
  if (!game || !game.villaOwned) return;
  if (!game.playerCircles) game.playerCircles = { social: [], hobby: [], workplace: [] };
  let wp = game.playerCircles.workplace.find(function (c) { return c.id === 'villa_staff'; });
  if (!wp) {
    wp = { id: 'villa_staff', kind: 'staff', name: '别墅勤务圈（管家·保镖·司机）', members: [] };
    game.playerCircles.workplace.push(wp);
  }
  wp.kind = 'staff';
  wp.name = '别墅勤务圈（管家·保镖·司机）';
  ensurePlayerInStaffCircle(wp, '雇主');
  VILLA_STAFF.forEach(function (s) {
    ensureStaffContact(s, '你的别墅', '别墅');
    if (typeof addCircleMember === 'function') {
      addCircleMember(wp, s.id, { familiarity: 72, attraction: 0, role: s.role });
    }
  });
}

function syncCompanyStaffToWorkplaceCircle() {
  if (!game || !game.playerCompany || !game.playerCompany.founded) return;
  if (!game.playerCircles) game.playerCircles = { social: [], hobby: [], workplace: [] };
  const pc = game.playerCompany;
  const coName = pc.name || pc.brandName || '你的公司';
  let wp = game.playerCircles.workplace.find(function (c) { return c.id === 'company_exec'; });
  if (!wp) {
    wp = { id: 'company_exec', kind: 'staff', name: '公司高管圈', members: [] };
    game.playerCircles.workplace.push(wp);
  }
  wp.kind = 'staff';
  wp.name = '公司高管圈 · ' + coName;
  wp.members = [{ id: 'player', familiarity: 100, attraction: 0, role: '老板' }];
  const execIds = typeof getCompanyExecutiveContactIds === 'function' ? getCompanyExecutiveContactIds() : [];
  execIds.forEach(function (cid) {
    const person = typeof resolveCompanyPerson === 'function' ? resolveCompanyPerson(cid) : null;
    if (person && typeof ensureCompanyPersonContact === 'function') ensureCompanyPersonContact(person);
    const c = (game.contacts || []).find(function (x) { return x.id === cid; });
    if (typeof addCircleMember === 'function') {
      addCircleMember(wp, cid, { familiarity: c && c.familiarity != null ? c.familiarity : 58, attraction: 0, role: (c && (c.role || c.jobTitle)) || '高管' });
    }
  });
  let team = game.playerCircles.workplace.find(function (c) { return c.id === 'company_team'; });
  if (!team) {
    team = { id: 'company_team', kind: 'staff', name: '公司同事圈 · ' + coName, members: [] };
    game.playerCircles.workplace.push(team);
  }
  team.kind = 'staff';
  team.name = '公司同事圈 · ' + coName;
  ensurePlayerInStaffCircle(team, '老板');
  if (!team.members) team.members = [{ id: 'player', familiarity: 100, attraction: 0, role: '老板' }];
}

function syncCompanyServiceStaffToWorkplaceCircle() {
  if (!game || !game.playerCompany || !game.playerCompany.founded) return;
  if (!game.playerCircles) game.playerCircles = { social: [], hobby: [], workplace: [] };
  const coName = game.playerCompany.name || '你的公司';
  let wp = game.playerCircles.workplace.find(function (c) { return c.id === 'company_service'; });
  if (!wp) {
    wp = { id: 'company_service', kind: 'staff', name: '公司勤务圈（保镖·司机）', members: [] };
    game.playerCircles.workplace.push(wp);
  }
  wp.kind = 'staff';
  wp.name = '公司勤务圈（保镖·司机）· ' + coName;
  ensurePlayerInStaffCircle(wp, '老板');
  COMPANY_SERVICE_STAFF.forEach(function (s) {
    ensureStaffContact(s, coName, '公司');
    if (typeof addCircleMember === 'function') {
      addCircleMember(wp, s.id, { familiarity: 65, attraction: 0, role: s.role });
    }
  });
}

function sponsorContactIdeal(contactId, tierIdx) {
  const c = typeof findContact === 'function' ? findContact(contactId) : (game.contacts || []).find(function (x) { return x.id === contactId; });
  if (!c || !c.dream) { addLog('对方尚无理想项目', 'fail'); return; }
  const tier = IDEAL_SPONSOR_TIERS[tierIdx != null ? tierIdx : 1];
  if (!tier) return;
  if (game.cash < tier.cost) { addLog('赞助需 ¥' + tier.cost.toLocaleString(), 'fail'); return; }
  game.cash -= tier.cost;
  if (typeof ledgerAddExpense === 'function') ledgerAddExpense('ideal', '✨', '赞助「' + c.dream.title + '」', tier.cost, false);
  c.dream.active = true;
  c.dream.progress = Math.min(100, (c.dream.progress || 0) + tier.progress);
  c.dream.sponsorCash = (c.dream.sponsorCash || 0) + tier.cost;
  addLog('✨ 赞助 ' + c.name + ' 的理想「' + c.dream.title + '」+' + tier.progress + '%', 'success');
  if (typeof updateUI === 'function') updateUI();
}

function operateOnIdeal(contactId) {
  const c = typeof findContact === 'function' ? findContact(contactId) : (game.contacts || []).find(function (x) { return x.id === contactId; });
  if (!c || !c.dream || !c.dream.active) { addLog('需先赞助或激活理想项目', 'fail'); return; }
  if (game.cash < IDEAL_OPS_WEEKLY_COST) { addLog('运营需 ¥' + IDEAL_OPS_WEEKLY_COST, 'fail'); return; }
  game.cash -= IDEAL_OPS_WEEKLY_COST;
  if (typeof ledgerAddExpense === 'function') ledgerAddExpense('ideal', '⚙', '理想项目运营', IDEAL_OPS_WEEKLY_COST, false);
  c.dream.progress = Math.min(100, (c.dream.progress || 0) + 2 + Math.floor(Math.random() * 4));
  c.dream.opsWeeks = (c.dream.opsWeeks || 0) + 1;
  addLog('⚙ 为「' + c.dream.title + '」运营一周 · 进度 ' + c.dream.progress + '%', 'info');
  if (c.dream.progress >= 100) completeContactIdeal(c);
}

function completeContactIdeal(c) {
  if (!c || !c.dream) return;
  c.dream.active = false;
  c.dream.completed = true;
  if (typeof bumpCareerExp === 'function') bumpCareerExp(c, c.dream.career, 12 + Math.floor(Math.random() * 8));
  if (typeof addLog === 'function') addLog('🏆 ' + c.name + ' 的理想「' + c.dream.title + '」实现！', 'success');
}

function tickIdealProjects() {
  if (!game || game.gameOver) return;
  (game.contacts || []).forEach(function (c) {
    if (!c.dream || !c.dream.active || c.dream.progress >= 100) return;
    if (Math.random() < 0.08 && c.dream.sponsorCash > 0) {
      c.dream.progress = Math.min(100, (c.dream.progress || 0) + 1);
    }
    if (c.dream.progress >= 100) completeContactIdeal(c);
  });
  if (game.playerDream && game.playerDream.active && game.playerDream.progress >= 100) {
    addLog('🏆 你的理想「' + game.playerDream.title + '」实现！', 'success');
    game.playerDream.active = false;
    game.playerDream.completed = true;
  }
}

function startBoardVote(topic) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded || !pc.board) { addLog('需拥有公司', 'fail'); return; }
  pc.board.pendingVote = {
    topic: topic || '高管改选', week: game.week,
    forPct: 35 + Math.floor(Math.random() * 40), playerVeto: !!pc.board.superVote
  };
  addLog('🗳 董事会发起表决：' + pc.board.pendingVote.topic, 'info');
}

function resolveBoardVote(approve) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.board || !pc.board.pendingVote) { addLog('暂无待表决事项', 'fail'); return; }
  const v = pc.board.pendingVote;
  if (!approve && pc.board.superVote) {
    addLog('🗳 你行使超级投票权否决「' + v.topic + '」', 'warn');
  } else if (approve || v.forPct >= 50) {
    addLog('🗳 表决通过：' + v.topic, 'success');
  } else {
    addLog('🗳 表决未通过：' + v.topic, 'info');
  }
  pc.board.pendingVote = null;
  if (typeof renderDailyPanel === 'function') renderDailyPanel();
}

function dismissScamOffer(id) {
  if (!game || !game.inbox) return;
  game.inbox = game.inbox.filter(function (it) { return it.id !== id; });
  if (typeof refreshInboxViews === 'function') refreshInboxViews();
  if (typeof renderDailyPanel === 'function') renderDailyPanel();
  if (typeof refreshJobHuntUi === 'function') refreshJobHuntUi();
  addLog('已忽略可疑招聘', 'info');
}

function tryScamJobOffer() {
  if (!game || game.gameOver) return;
  if (!game.selfEmploy) game.selfEmploy = {};
  if (game.selfEmploy.scamOfferWeek === game.week) return;
  const hasBaitOffer = (game.inbox || []).some(function (it) {
    return it.type === 'offer' && (it.scamBait || String(it.id || '').indexOf('_sb_offer') > 0);
  });
  if (hasBaitOffer) return;
  if (Math.random() > 0.35) return;
  game.selfEmploy.scamOfferWeek = game.week;
  const coName = ['鸿运信息', '鑫达科技', '汇通咨询'][Math.floor(Math.random() * 3)];
  (game.inbox || []).unshift({
    id: 'scam_' + game.week, type: 'offer', read: false, week: game.week,
    title: coName + ' · 电话专员', body: '无需经验，投必中。日结提成，培训三天上岗。'
  });
  addLog('📧 收到可疑招聘：' + coName + '（投必中）→ 应聘邮箱', 'warn');
  if (typeof refreshInboxViews === 'function') refreshInboxViews();
  if (typeof refreshJobHuntUi === 'function') refreshJobHuntUi();
}

function nudgeScamJobOfferOnJobHunt() {
  if (!game || game.gameOver) return;
  if (typeof tryScamJobOffer === 'function') tryScamJobOffer();
}

function acceptScamJob() {
  if (!game.selfEmploy) game.selfEmploy = {};
  const sideOnly = game.employed && game.employment && game.employment.roleExtra !== 'scam';
  const coName = ['鸿运信息', '鑫达科技', '汇通咨询'][Math.floor(Math.random() * 3)];
  const offer = {
    company: { id: 'scam_co_mail', name: coName, tier: 'low', scale: 'small', city: game.playerCity || PLAYER_HOME_CITY },
    tier: 'low', importance: 'low', annualPay: 96000, scamProduct: '电话营销套餐', scamUnitPrice: 2999
  };
  if (typeof initScamEmploymentFromOffer === 'function') initScamEmploymentFromOffer(offer, 0);
  else {
    game.selfEmploy.scamBook = game.selfEmploy.scamBook || { contacts: [], calls: 0, income: 0 };
    game.employed = true;
    game.employment = {
      jobIdx: 0, company: offer.company, annualPay: 96000, roleExtra: 'scam', weeksInCompany: 0
    };
    for (let i = 0; i < 12; i++) {
      const gender = Math.random() < 0.5 ? 'male' : 'female';
      game.selfEmploy.scamBook.contacts.push({
        id: 'scam_t_' + i, name: typeof pickStrangerDisplayName === 'function' ? pickStrangerDisplayName(gender) : '目标' + i,
        phone: '1' + Math.floor(1000000000 + Math.random() * 9000000000), called: false,
        familiarity: 12 + Math.floor(Math.random() * 38)
      });
    }
    game.inbox = (game.inbox || []).filter(function (it) { return String(it.id || '').indexOf('scam_') !== 0; });
  }
  addLog(sideOnly
    ? '📒 入坑诈骗岗 · 明面工作保留 · 获得特殊通讯簿'
    : '📒 入职诈骗岗 · 获得特殊通讯簿 · 需完成销售指标', 'warn');
  if (typeof renderDailyPanel === 'function') renderDailyPanel();
  if (typeof refreshJobHuntUi === 'function') refreshJobHuntUi();
  if (typeof updateUI === 'function') updateUI();
}

function callScamTarget(idx) {
  const book = game && game.selfEmploy && game.selfEmploy.scamBook;
  if (!book || !book.contacts[idx]) { addLog('无效目标', 'fail'); return; }
  const t = book.contacts[idx];
  if (t.called) { addLog(t.name + ' 已联系过', 'warn'); return; }
  t.called = true;
  book.calls++;
  const ok = Math.random() < 0.22;
  if (ok) {
    const pay = 200 + Math.floor(Math.random() * 800);
    game.cash += pay;
    book.income += pay;
    if (typeof ledgerAddIncome === 'function') ledgerAddIncome('scam', '📞', '诈骗岗提成', pay);
    addLog('📞 ' + t.name + ' · 上钩 +¥' + pay, 'success');
  } else {
    addLog('📞 ' + t.name + ' · 未接通或被拒', 'info');
  }
}

function tickIdealCompanyExtensions() {
  migrateCompanyGovernance();
  tickIdealProjects();
  tryScamJobOffer();
}

function getActiveCompanyProjects(g) {
  g = g || game;
  const pc = g && g.playerCompany;
  if (!pc || !pc.founded || !pc.projects) return [];
  return pc.projects.filter(function (p) { return (p.progress || 0) < 100 && !p.completed; });
}

function playerIdealProgressPct(g) {
  g = g || game;
  if (!g) return 0;
  const active = getActiveCompanyProjects(g);
  if (active.length) {
    if (active.length === 1) return Math.min(100, Math.round(active[0].progress || 0));
    const avg = active.reduce(function (s, p) { return s + (p.progress || 0); }, 0) / active.length;
    return Math.min(100, Math.round(avg));
  }
  const con = (g.idealWorkContracts || []).find(function (c) { return c.status === 'active'; });
  if (con) return Math.min(100, Math.round(con.progress || 0));
  if (g.playerDream) {
    if (g.playerDream.completed) return 100;
    if (g.playerDream.active) return Math.min(100, Math.round(g.playerDream.progress || 0));
  }
  return 0;
}

function playerIdealProgressLabel(g) {
  g = g || game;
  if (!g) return '—';
  const active = getActiveCompanyProjects(g);
  if (active.length) {
    if (active.length === 1) {
      const p = active[0];
      const name = typeof projectDisplayLabel === 'function' ? projectDisplayLabel(p) : (p.brandName || p.name || '立项');
      const short = name.length > 10 ? name.slice(0, 10) + '…' : name;
      return Math.round(p.progress || 0) + '% · ' + short;
    }
    const avg = Math.round(active.reduce(function (s, p) { return s + (p.progress || 0); }, 0) / active.length);
    return avg + '% · ' + active.length + '项在研';
  }
  const con = (g.idealWorkContracts || []).find(function (c) { return c.status === 'active'; });
  if (con) {
    const t = con.dreamTitle || '项目制';
    const short = t.length > 10 ? t.slice(0, 10) + '…' : t;
    return Math.round(con.progress || 0) + '% · ' + short;
  }
  if (g.playerDream) {
    if (g.playerDream.completed) return '已实现';
    if (g.playerDream.active) {
      const t = g.playerDream.title || '理想';
      const short = t.length > 10 ? t.slice(0, 10) + '…' : t;
      return Math.round(g.playerDream.progress || 0) + '% · ' + short;
    }
  }
  return '无立项';
}
