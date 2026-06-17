/* 第三批深化 — 由 build.js 注入（在 project-work-ops 之后） */
const BOARD_EXEC_ROLES = [
  { key: 'ceo', label: '首席执行官 CEO', deptId: 'exec', headField: 'head' },
  { key: 'cfo', label: '财务高管 CFO', deptId: 'finance', defaultName: '王建国' },
  { key: 'hr', label: '人力高管 HR', deptId: 'hr', defaultName: '林婉儿' },
  { key: 'biz', label: '商务高管', deptId: 'biz_exec', defaultName: '陈海洋' },
  { key: 'cmo', label: '市场高管 CMO', deptId: 'marketing', defaultName: '周市场' },
  { key: 'cto', label: '技术高管 CTO', deptId: 'tech', defaultName: '（待任命）' },
  { key: 'ops', label: '运营高管 COO', deptId: 'ops', defaultName: '刘运营' }
];

function isExecSeatVacant(name) {
  if (!name) return true;
  const s = String(name);
  return s === '（待任命）' || s === '（空缺）' || s.indexOf('待任命') >= 0;
}

function getExecutiveStaffingGaps() {
  if (!game || !game.playerCompany || !game.playerCompany.founded) return [];
  ensureBoardExecState();
  const pc = game.playerCompany;
  const gaps = [];
  BOARD_EXEC_ROLES.forEach(function (r) {
    if (r.key === 'ceo') return;
    const cur = (pc.board.execs && pc.board.execs[r.key]) || r.defaultName;
    if (!isExecSeatVacant(cur)) return;
    gaps.push({ execRoleKey: r.key, role: r.label, deptId: r.deptId, label: r.label });
  });
  return gaps;
}

function ensureBoardExecState() {
  if (!game || !game.playerCompany || !game.playerCompany.founded) return;
  const pc = game.playerCompany;
  if (!pc.board) pc.board = { playerShares: 51, investorShares: 49, superVote: true, pendingVote: null };
  if (!pc.board.execs) {
    pc.board.execs = { ceo: '你', cfo: '王建国', hr: '林婉儿', biz: '陈海洋', cto: '（待任命）', ops: '刘运营', cmo: '周市场' };
  }
  (pc.departments || []).forEach(function (d) {
    if (d.id === 'exec') d.head = pc.board.execs.ceo || '你';
    if (d.id === 'finance') d.head = pc.board.execs.cfo || '王建国';
    if (d.id === 'hr') d.head = pc.board.execs.hr || '林婉儿';
    if (d.id === 'biz_exec' && pc.board.execs.biz && pc.board.execs.biz !== '（待任命）') d.head = pc.board.execs.biz;
    if (d.id === 'marketing' && pc.board.execs.cmo && pc.board.execs.cmo !== '（待任命）') d.head = pc.board.execs.cmo;
    if (d.id === 'tech' && pc.board.execs.cto && pc.board.execs.cto !== '（待任命）') d.head = pc.board.execs.cto;
    if (d.id === 'ops' && pc.board.execs.ops && pc.board.execs.ops !== '（待任命）') d.head = pc.board.execs.ops;
    if (d.id === 'biz1' && pc.board.execs.biz && pc.board.execs.biz !== '（待任命）' && (!d.head || d.head.indexOf('待任命') >= 0)) d.head = '（中层待任命）';
  });
}

function randomExecCandidateName() {
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  return typeof pickStrangerDisplayName === 'function' ? pickStrangerDisplayName(gender) : (gender === 'male' ? '赵强' : '李婷');
}

function openBoardExecVoteMenu() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded) { addLog('需拥有公司', 'fail'); return; }
  ensureBoardExecState();
  let html = '<p class="fold-meta">选择要改选的高管岗位 · 表决通过后写入组织图</p><ul style="margin:8px 0;padding-left:18px;font-size:.85rem">';
  BOARD_EXEC_ROLES.forEach(function (r) {
    const cur = (pc.board.execs && pc.board.execs[r.key]) || r.defaultName || '（空缺）';
    html += '<li><b>' + r.label + '</b>：现任 ' + cur + '</li>';
  });
  html += '</ul>';
  const buttons = BOARD_EXEC_ROLES.filter(function (r) { return r.key !== 'ceo'; }).map(function (r) {
    return {
      text: '改选 ' + r.label.split(' ')[0],
      handler: function () {
        if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
        startBoardExecVote(r.key);
      }
    };
  });
  buttons.push({ text: '取消', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '🗳', title: '董事会 · 高管改选', html: html, buttons: buttons });
  }
}

function startBoardExecVote(roleKey) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded) return;
  ensureBoardExecState();
  const role = BOARD_EXEC_ROLES.find(function (r) { return r.key === roleKey; });
  if (!role) return;
  if (pc.board.pendingVote) { addLog('已有待表决事项', 'warn'); return; }
  const incumbent = (pc.board.execs && pc.board.execs[roleKey]) || role.defaultName || '（空缺）';
  const incumbentVacant = isExecSeatVacant(incumbent);
  const challenger = randomExecCandidateName();
  const keep = !incumbentVacant && Math.random() < 0.35;
  let candidate = keep ? incumbent : challenger;
  if (isExecSeatVacant(candidate)) candidate = challenger;
  const playerPct = typeof getPlayerVotePct === 'function' ? getPlayerVotePct() : (pc.board.playerShares || 100);
  if (playerPct >= 100 || (pc.board.foundingType === 'solo' && playerPct >= 51)) {
    applyBoardExecElection(roleKey, candidate);
    addLog('🗳 你持股过半，高管改选「' + candidate + '」已生效', 'success');
    return;
  }
  pc.board.pendingVote = {
    roleKey: roleKey,
    topic: '改选 ' + role.label,
    candidate: candidate,
    challenger: challenger,
    incumbent: incumbent,
    forPct: 38 + Math.floor(Math.random() * 38),
    week: game.week,
    playerVeto: !!pc.board.superVote
  };
  addLog('🗳 董事会审议：' + role.label + ' · 提名「' + candidate + '」', 'info');
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '🗳', title: '高管改选表决',
      html: '<p><b>' + role.label + '</b></p><p>现任：<b>' + incumbent + '</b></p><p>提名：<b>' + candidate + '</b></p>' +
        '<p class="fold-meta">机构票倾向 ' + pc.board.pendingVote.forPct + '% 赞成 · 你可投赞成或行使超级否决</p>',
      buttons: [
        { text: '赞成', primary: true, handler: function () { resolveBoardExecVote(true); } },
        { text: '超级否决', handler: function () { resolveBoardExecVote(false); } }
      ]
    });
  }
}

function applyBoardExecElection(roleKey, name) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.board) return;
  if (isExecSeatVacant(name)) return;
  ensureBoardExecState();
  pc.board.execs[roleKey] = name;
  const role = BOARD_EXEC_ROLES.find(function (r) { return r.key === roleKey; });
  if (role && pc.departments) {
    const dept = pc.departments.find(function (d) { return d.id === role.deptId; });
    if (dept) dept.head = name;
  }
  if (roleKey !== 'ceo' && typeof ensureCoreContact === 'function') {
    const staffId = 'staff_' + roleKey;
    ensureCoreContact(staffId, {
      kind: 'staff', name: name, gender: 'male', role: roleKey.toUpperCase(),
      company: pc.name || '你的公司', jobTitle: role.label, income: 700000, metWhere: '董事会'
    });
    if (typeof syncCompanyStaffToWorkplaceCircle === 'function') syncCompanyStaffToWorkplaceCircle();
  }
}

function resolveBoardExecVote(approve) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.board || !pc.board.pendingVote) { addLog('暂无待表决事项', 'fail'); return; }
  const v = pc.board.pendingVote;
  const passed = approve && (v.forPct >= 50 || approve === true);
  if (!approve && pc.board.superVote) {
    addLog('🗳 超级投票权否决「' + v.topic + '」· 留任 ' + v.incumbent, 'warn');
  } else if (passed) {
    applyBoardExecElection(v.roleKey, v.candidate);
    addLog('🗳 表决通过：' + v.candidate + ' 出任 ' + v.topic.replace('改选 ', ''), 'success');
  } else {
    addLog('🗳 表决未通过：' + v.incumbent + ' 留任', 'info');
  }
  pc.board.pendingVote = null;
  if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  if (typeof renderDailyPanel === 'function') renderDailyPanel();
  if (typeof updateUI === 'function') updateUI();
}

function pickWorkplaceColleague(preferKind) {
  if (!game || !game.playerCircles || !game.playerCircles.workplace) return null;
  const circles = game.playerCircles.workplace.filter(function (c) {
    return c.kind === preferKind || c.id.indexOf('wp_') === 0;
  });
  if (!circles.length) return null;
  const circle = circles[Math.floor(Math.random() * circles.length)];
  const members = (circle.members || []).filter(function (m) { return m.id && m.id !== 'player'; });
  if (!members.length) return null;
  const pick = members[Math.floor(Math.random() * members.length)];
  return (game.contacts || []).find(function (c) { return c.id === pick.id; }) || null;
}

function tryColleagueWorkplaceGossip(where, onAfter, forceStory) {
  let colleague = pickWorkplaceColleague('team') || pickWorkplaceColleague('department');
  if (!colleague && forceStory) {
    const job = game.employment && game.market ? game.market[game.employment.jobIdx] : null;
    colleague = { id: 'work_gossip_npc', name: '同事', jobTitle: job ? job.title : '职员' };
  }
  if (!colleague) {
    if (typeof onAfter === 'function') onAfter();
    return;
  }
  colleague.companyTier = game.employment && game.employment.company ? game.employment.company.tier : colleague.companyTier;
  colleague.companyScale = game.employment && game.employment.company ? game.employment.company.scale : colleague.companyScale;
  if (!colleague.company && game.employment && game.employment.company) colleague.company = game.employment.company.name;
  if (typeof maybeTellWorkplaceStory === 'function') {
    maybeTellWorkplaceStory(colleague, where || '工位', function () {
      if (colleague.id !== 'work_gossip_npc') {
        colleague.familiarity = Math.min(100, (colleague.familiarity || 0) + 1);
      }
      if (typeof onAfter === 'function') onAfter();
    }, forceStory ? { force: true } : null);
    return;
  }
  if (typeof onAfter === 'function') onAfter();
}

function workplaceGossipShiftButtons() {
  if (!game || !game.employed) return null;
  if (typeof isPlayerOnWorkShift === 'function' && isPlayerOnWorkShift() && !game.daily.inOvertime) {
    const left = typeof dailySlotHoursLeft === 'function' ? dailySlotHoursLeft() : 8;
    if (left < 1) return null;
  }
  return [{ text: '☕ 同事八卦（1h）', fn: 'doWorkplaceGossipShift()' }];
}

function doWorkplaceGossipShift() {
  if (typeof workShiftConsumeHours === 'function' && !workShiftConsumeHours(1, '同事八卦')) return;
  if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  tryColleagueWorkplaceGossip('工位', function () {
    if (typeof workShiftAfterAction === 'function') workShiftAfterAction();
  }, true);
}

function tickWorkplaceCircleGossip() {
  if (!game || game.gameOver || !game.employed) return;
  if (Math.random() > 0.14) return;
  if (typeof consumeModalOpen !== 'undefined' && consumeModalOpen) return;
  if (typeof autoLifeRunning !== 'undefined' && autoLifeRunning) return;
  const colleague = pickWorkplaceColleague('team');
  if (!colleague) return;
  colleague.company = colleague.company || (game.employment && game.employment.company ? game.employment.company.name : '');
  if (typeof maybeTellWorkplaceStory === 'function') {
    maybeTellWorkplaceStory(colleague, '茶水间', null);
  }
}

function runMediaLifeScandal(platformId) {
  let se = null;
  if (platformId && typeof getSelfShop === 'function') se = getSelfShop(platformId);
  if (!se && typeof getSelfShop === 'function') se = getSelfShop('douyin') || getSelfShop('bilibili');
  if (!se) { addLog('需先开通自媒体', 'fail'); return; }
  if (se.platform !== 'douyin' && se.track !== '剧情' && se.track !== '生活') {
    addLog('狗血内容适合抖音或剧情/生活赛道', 'fail'); return;
  }
  const views = Math.round((se.fans || 500) * (1.5 + Math.random() * 2));
  const revenue = Math.round(views * 0.025 + Math.random() * 800);
  const sued = Math.random() < 0.22;
  game.cash += revenue;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('self', '📺', '狗血流量', revenue);
  se.fans = (se.fans || 500) + Math.floor(views / 300);
  if (sued) {
    const fine = 500 + Math.floor(Math.random() * 1500);
    game.cash -= fine;
    if (typeof addStress === 'function') addStress(8, '被索赔 ');
    addLog('📺 狗血生活记录爆火但当事人索赔 · 流量 +' + views + ' · 净收入约 ¥' + (revenue - fine), 'warn');
  } else {
    addLog('📺 狗血生活记录爆火 · 播放 ' + views.toLocaleString() + ' · +¥' + revenue, 'success');
  }
  if (typeof updateUI === 'function') updateUI();
}

function runFoodVendorCombo() {
  const se = game && game.selfEmploy && game.selfEmploy.vendor;
  if (!se) { addLog('需先购置美食小车', 'fail'); return; }
  const combos = [
    { name: '麻辣+年糕', bonus: 1.35 },
    { name: '炸鸡+啤酒', bonus: 1.25 },
    { name: '奶茶+鸡排', bonus: 1.2 }
  ];
  const pick = combos[Math.floor(Math.random() * combos.length)];
  const base = 80 + Math.floor(Math.random() * 180);
  const revenue = Math.round(base * pick.bonus);
  game.cash += revenue;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('self', '🍜', '招牌搭配', revenue);
  addLog('🍜 推出搭配「' + pick.name + '」· +¥' + revenue, 'success');
  if (typeof updateUI === 'function') updateUI();
}

function tickExtensionsBatch3() {
  ensureBoardExecState();
  tickWorkplaceCircleGossip();
}
