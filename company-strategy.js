/* 公司战略：行业方向 · 高管汇报 · 秘书 · 三选一决策 — 由 build.js 注入 */
const COMPANY_EXEC_DEFS = [
  { key: 'cfo', name: '王建国', title: '财务高管', dept: '财务部', icon: '💰' },
  { key: 'biz', name: '陈海洋', title: '商务高管', dept: '商务部', icon: '🌐' },
  { key: 'hr', name: '林婉儿', title: '人力高管', dept: '人力资源部', icon: '👥' },
  { key: 'cto', name: '技术高管', title: '技术高管', dept: '技术部', icon: '⚙' },
  { key: 'ops', name: '刘运营', title: '运营高管', dept: '运营部', icon: '📋' }
];

const INDUSTRY_STRATEGY_FALLBACK = {
  '综合': {
    outlook: '内需修复、细分赛道仍有结构性机会，但同质化竞争激烈。',
    trend: '中等增长',
    options: [
      { id: 'aggressive', label: '激进扩张', desc: '押注高增长细分，快速抢占心智', risk: '现金流承压' },
      { id: 'steady', label: '稳健渗透', desc: '深耕存量客户，控制烧钱节奏', risk: '增长偏慢' },
      { id: 'watch', label: '观望储备', desc: '保留现金，等待更明确信号', risk: '错失窗口' }
    ]
  }
};

function buildIndustryStrategyPool() {
  const pool = {};
  const cats = game && game.market ? [...new Set(game.market.map(function (j) { return j.category; }))] : [];
  const jobsByCat = {};
  (game.market || []).forEach(function (j) {
    if (!jobsByCat[j.category]) jobsByCat[j.category] = [];
    if (jobsByCat[j.category].length < 4) jobsByCat[j.category].push(j.title);
  });
  const outlooks = [
    '政策扶持加码，头部集中但长尾仍有缝隙。',
    '需求回暖，品牌与渠道成为胜负手。',
    '技术迭代加速，先发优势窗口约 18–24 个月。',
    '监管趋严，合规成本上升，并购整合活跃。',
    '出海与下沉并行，利润率分化加剧。'
  ];
  cats.forEach(function (cat, i) {
    const sampleJobs = (jobsByCat[cat] || []).slice(0, 3).join('、') || '相关岗位';
    pool[cat] = {
      outlook: outlooks[i % outlooks.length] + ' 参考岗位：' + sampleJobs + '。',
      trend: ['高增长', '中等增长', '结构性机会', '谨慎乐观'][i % 4],
      options: [
        { id: 'aggressive', label: '激进进入「' + cat + '」', desc: '高举高打，品牌+渠道双投', risk: '回收周期长' },
        { id: 'steady', label: '试点渗透', desc: '单点验证后再扩编', risk: '竞品可能抢先' },
        { id: 'watch', label: '暂缓布局', desc: '继续观察政策与竞品动向', risk: '团队士气波动' }
      ]
    };
  });
  pool['综合'] = INDUSTRY_STRATEGY_FALLBACK['综合'];
  return pool;
}

function getExecDisplayName(key) {
  const pc = game && game.playerCompany;
  const def = COMPANY_EXEC_DEFS.find(function (e) { return e.key === key; });
  if (pc && pc.board && pc.board.execs && pc.board.execs[key] && pc.board.execs[key] !== '（待任命）') {
    return pc.board.execs[key];
  }
  return def ? def.name : key;
}

function tickCompanyExecutiveDailyReports() {
  if (!hasPlayerCompany()) return;
  const pc = game.playerCompany;
  migrateCompanyManagement();
  if (!pc.secretary) pc.secretary = { name: '苏小秘', id: 'staff_secretary', briefs: [], unread: 0 };
  const dayKey = (game.week || 0) + '_' + ((game.daily && game.daily.phase) || 'd');
  if (pc.secretary.lastDayKey === dayKey) return;
  pc.secretary.lastDayKey = dayKey;
  const reports = [];
  COMPANY_EXEC_DEFS.forEach(function (ex) {
    const r = genExecutiveDailyReport(ex.key);
    if (r) reports.push(r);
  });
  pc.secretary.briefs = (pc.secretary.briefs || []).concat({
    dayKey: dayKey,
    week: game.week,
    phase: game.daily && game.daily.phase,
    reports: reports,
    read: false
  }).slice(-14);
  pc.secretary.unread = (pc.secretary.unread || 0) + 1;
}

function genExecutiveDailyReport(key) {
  const pc = game.playerCompany;
  const name = getExecDisplayName(key);
  const staffN = (pc.staff || []).length;
  const projN = (pc.projects || []).filter(function (p) { return (p.progress || 0) < 100; }).length;
  const strat = pc.activeStrategy;
  const lines = {
    cfo: '本周现金流' + (game.cash > 500000 ? '充裕' : '偏紧') + '；在研 ' + projN + ' 项，建议关注费用率。',
    biz: '市场端' + (strat ? '按「' + strat.label + '」推进' : '待您定战略方向') + '；' +
      ((pc.branches || []).length > 1 ? '已布局 ' + pc.branches.length + ' 城分公司' : '建议开拓外地分公司') + '。',
    hr: '在职 ' + staffN + ' 人；招聘邮箱待处理 ' + ((pc.recruitInbox || []).filter(function (c) { return c.status === 'pending'; }).length) + ' 份。',
    cto: '技术线' + projN + ' 个项目并行；' + (strat ? '研发资源向「' + strat.industry + '」倾斜' : '等待立项指令') + '。',
    ops: strat ? '已将「' + strat.label + '」拆解为执行里程碑，待您批复方案。' : '运营方案待战略定调后提交。'
  };
  return { key: key, name: name, title: (COMPANY_EXEC_DEFS.find(function (e) { return e.key === key; }) || {}).title, body: lines[key] || '例行汇报。' };
}

function openSecretaryBrief() {
  if (!hasPlayerCompany()) return;
  const pc = game.playerCompany;
  if (!pc.secretary || !pc.secretary.briefs || !pc.secretary.briefs.length) {
    tickCompanyExecutiveDailyReports();
  }
  const briefs = (pc.secretary && pc.secretary.briefs) || [];
  const latest = briefs[briefs.length - 1];
  if (!latest) { addLog('今日暂无高管汇报', 'info'); return; }
  latest.read = true;
  pc.secretary.unread = 0;
  let html = '<p class="fold-meta">苏小秘整理 · 第 ' + latest.week + ' 周 · ' + (latest.phase === 'morning' ? '白天' : latest.phase === 'evening' ? '晚上' : '本日') + '</p>';
  (latest.reports || []).forEach(function (r) {
    const ex = COMPANY_EXEC_DEFS.find(function (e) { return e.key === r.key; }) || {};
    html += '<div style="margin:8px 0;padding:8px;border:1px solid var(--border);border-radius:8px">';
    html += '<b>' + (ex.icon || '📌') + ' ' + r.name + '（' + r.title + '）</b>';
    html += '<p class="fold-meta" style="margin:4px 0 0">' + r.body + '</p></div>';
  });
  const buttons = [
    { text: '行业战略', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); openIndustryStrategyMenu(); } },
    { text: '查看周报', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); openCompanyReportArchive('weekly'); } },
    { text: '查看月报', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); openCompanyReportArchive('monthly'); } }
  ];
  if (pc.pendingExecProposal) {
    buttons.unshift({ text: '待批方案', primary: true, handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); openPendingExecProposal(); } });
  }
  buttons.push({ text: '知道了', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '📋', title: '秘书简报 · 高管汇报', html: html, buttons: buttons });
  }
}

function openIndustryStrategyMenu() {
  if (!hasPlayerCompany()) return;
  const pool = buildIndustryStrategyPool();
  const pc = game.playerCompany;
  const cat = (typeof getCompanyPrimaryIndustry === 'function' ? getCompanyPrimaryIndustry(pc) : null) || '信息技术';
  const prof = pool[cat] || pool['信息技术'] || pool['综合'];
  let html = '<p><b>行业方向 · ' + cat + '</b></p>';
  html += '<p class="fold-meta">预期前景：' + prof.outlook + '</p>';
  html += '<p class="fold-meta">趋势判断：<b>' + prof.trend + '</b></p>';
  if (pc.activeStrategy) {
    html += '<p class="fold-meta" style="color:var(--accent)">当前战略：' + pc.activeStrategy.label + '</p>';
  }
  html += '<p style="margin-top:10px"><b>请做战略决策</b></p>';
  const buttons = (prof.options || []).map(function (opt) {
    return {
      text: opt.label,
      handler: function () {
        if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
        if (typeof openStrategyCityPicker === 'function') {
          openStrategyCityPicker(cat, opt);
        } else {
          applyIndustryStrategy(cat, opt, null);
        }
      }
    };
  });
  buttons.push({ text: '取消', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '🧭', title: '战略决策', html: html, buttons: buttons });
  }
}

function applyIndustryStrategy(industry, option, targetCity) {
  const pc = game.playerCompany;
  pc.activeStrategy = {
    industry: industry, id: option.id, label: option.label, desc: option.desc,
    week: game.week, targetCity: targetCity || getCompanyHqCity()
  };
  if (targetCity && typeof getBranchByCity === 'function' && !getBranchByCity(targetCity)) {
    addLog('🧭 战略定调：' + option.label + ' · 目标城市 ' + targetCity + '（尚未设分公司，可先开拓）', 'success');
  } else {
    addLog('🧭 战略定调：' + option.label + '（' + industry + ' · ' + (targetCity || '总部') + '）', 'success');
  }
  queueExecutiveProposals(industry, option);
}

function queueExecutiveProposals(industry, strategyOpt) {
  const pc = game.playerCompany;
  const proposals = [];
  const baseCost = typeof NEW_INDUSTRY_COST !== 'undefined' ? NEW_INDUSTRY_COST * 0.15 : 1200000;
  const mult = strategyOpt.id === 'aggressive' ? 1.6 : strategyOpt.id === 'steady' ? 1 : 0.6;
  COMPANY_EXEC_DEFS.forEach(function (ex) {
    const cost = Math.round(baseCost * mult * (0.7 + Math.random() * 0.6));
    const weeks = Math.round((strategyOpt.id === 'aggressive' ? 16 : strategyOpt.id === 'steady' ? 24 : 36) * (0.8 + Math.random() * 0.4));
    const rev = Math.round(cost * (1.1 + Math.random() * 0.9));
    const choices = genExecProposalChoices(ex.key, industry, strategyOpt, cost, rev, weeks);
    proposals.push({ execKey: ex.key, execName: getExecDisplayName(ex.key), title: ex.title, choices: choices });
  });
  pc.pendingExecProposals = proposals;
  pc.pendingExecProposal = proposals[0];
  pc.execProposalIdx = 0;
  addLog('📨 五位高管已提交领域方案，苏小秘请您逐一批复', 'info');
  setTimeout(function () { openPendingExecProposal(); }, 300);
}

function genExecProposalChoices(key, industry, strat, cost, rev, weeks) {
  const labels = {
    cfo: ['加杠杆投入', '严控预算', '分期拨付'],
    biz: ['高举高打宣发', '精准渠道渗透', '联名跨界'],
    hr: ['扩招储备', '精简编制', '绩效挂钩扩招'],
    cto: ['自研平台', '外采方案', '混合迭代'],
    ops: ['三城试点', '单点打透', '外包执行']
  };
  const ls = labels[key] || ['方案A', '方案B', '方案C'];
  return ls.map(function (label, i) {
    const cm = cost * (i === 0 ? 1.2 : i === 1 ? 0.85 : 0.65);
    const rv = rev * (i === 0 ? 1.3 : i === 1 ? 1 : 0.75);
    const wk = Math.round(weeks * (i === 0 ? 0.75 : i === 1 ? 1 : 1.3));
    return {
      label: label,
      cost: Math.round(cm),
      revenue: Math.round(rv),
      weeks: wk,
      conflict: i === 0 ? '与财务保守路线冲突' : i === 2 ? '商务端担心声量不足' : null
    };
  });
}

function openPendingExecProposal() {
  const pc = game.playerCompany;
  if (!pc.pendingExecProposal) {
    if (pc.pendingExecProposals && pc.pendingExecProposals.length) {
      pc.pendingExecProposal = pc.pendingExecProposals[pc.execProposalIdx || 0];
    } else { addLog('暂无待批方案', 'info'); return; }
  }
  const p = pc.pendingExecProposal;
  let html = '<p><b>' + p.execName + '（' + p.title + '）</b> 提交执行方案</p>';
  html += '<p class="fold-meta">战略：' + (pc.activeStrategy ? pc.activeStrategy.label : '—') + '</p>';
  const buttons = (p.choices || []).map(function (c, i) {
    return {
      text: c.label + ' · ¥' + (c.cost / 10000).toFixed(0) + '万 / ' + c.weeks + '周',
      handler: function () {
        resolveExecProposal(i);
        if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
      }
    };
  });
  buttons.push({ text: '稍后', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
  let choiceHtml = '<div style="margin:8px 0">';
  (p.choices || []).forEach(function (c) {
    choiceHtml += '<div class="fold-meta" style="margin:4px 0">· ' + c.label + '：成本 ¥' + c.cost.toLocaleString() +
      ' · 预期收益 ¥' + c.revenue.toLocaleString() + ' · 周期 ' + c.weeks + ' 周' +
      (c.conflict ? ' <span style="color:var(--orange)">（' + c.conflict + '）</span>' : '') + '</div>';
  });
  choiceHtml += '</div>';
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '📑', title: '高管方案 · 三选一', html: html + choiceHtml, buttons: buttons });
  }
}

function resolveExecProposal(choiceIdx) {
  const pc = game.playerCompany;
  const p = pc.pendingExecProposal;
  if (!p || !p.choices || !p.choices[choiceIdx]) return;
  const c = p.choices[choiceIdx];
  pc.approvedExecPlans = pc.approvedExecPlans || [];
  pc.approvedExecPlans.push({ execKey: p.execKey, choice: c, week: game.week });
  if (game.cash < c.cost * 0.1) {
    addLog(p.execName + ' 方案「' + c.label + '」通过，但启动金不足（需 10% ¥' + Math.round(c.cost * 0.1).toLocaleString() + '）', 'warn');
  } else {
    game.cash -= Math.round(c.cost * 0.1);
    if (typeof ledgerAddExpense === 'function') ledgerAddExpense('business', '📑', p.execName + '·' + c.label, Math.round(c.cost * 0.1), false);
    addLog('✅ 批准 ' + p.execName + '：「' + c.label + '」· 启动金已付', 'success');
  }
  if (p.execKey === 'ops' && pc.activeStrategy) {
    ensureStrategyProject(pc.activeStrategy.industry, c);
  }
  pc.execProposalIdx = (pc.execProposalIdx || 0) + 1;
  if (pc.pendingExecProposals && pc.execProposalIdx < pc.pendingExecProposals.length) {
    pc.pendingExecProposal = pc.pendingExecProposals[pc.execProposalIdx];
    setTimeout(function () { openPendingExecProposal(); }, 250);
  } else {
    pc.pendingExecProposal = null;
    pc.pendingExecProposals = null;
    addLog('📋 本轮高管方案已全部批复', 'info');
  }
}

function ensureStrategyProject(industry, choice) {
  const pc = game.playerCompany;
  pc.projects = pc.projects || [];
  migrateCompanyBranches();
  const exists = pc.projects.find(function (p) { return p.fromStrategy && p.industry === industry && (p.progress || 0) < 100; });
  if (exists) return;
  const scheme = typeof NEW_PROJECT_SCHEMES !== 'undefined' ? NEW_PROJECT_SCHEMES.standard : { label: '标准编制', roles: [] };
  const budget = choice.cost || 800000;
  const hq = (pc.branches || []).find(function (b) { return b.isHQ; }) || pc.branches[0];
  let targetBranch = hq;
  if (pc.activeStrategy && pc.activeStrategy.targetCity) {
    const cityBr = typeof getBranchByCity === 'function' ? getBranchByCity(pc.activeStrategy.targetCity) : null;
    if (cityBr) targetBranch = cityBr;
  }else if (pc.activeStrategy && pc.activeStrategy.targetCity) {
    targetBranch = hq;
  }
  const branchRoles = (scheme.roles || []).map(function (r) { return { role: r.role, n: r.n }; });
  pc.projects.push({
    id: 'pj_strat_' + game.week + '_' + pc.projects.length,
    name: industry + '战略落地',
    brandName: (pc.brandName || pc.name || '品牌') + '·' + industry,
    productName: null,
    industry: industry,
    scheme: 'standard',
    schemeLabel: scheme.label,
    roles: branchRoles,
    budget: budget,
    progress: 8,
    staffCost: Math.round(budget * 0.06),
    startWeek: game.week,
    tier: 'major',
    deptId: 'biz1',
    branchId: targetBranch ? targetBranch.id : null,
    fromStrategy: true,
    strategyLabel: choice.label,
    expectedRevenue: choice.revenue,
    expectedWeeks: choice.weeks,
    brandFamiliarity: 5,
    brandInfluence: 3
  });
  const pj = pc.projects[pc.projects.length - 1];
  if (typeof enrichProjectMeta === 'function') enrichProjectMeta(pj);
  if (typeof initProjectKpi === 'function') initProjectKpi(pj);
  if (typeof appointProjectManager === 'function') appointProjectManager(pj.id);
  if (typeof appointBranchProjectLead === 'function') appointBranchProjectLead(pj);
  if (typeof syncProjectJobPosts === 'function') syncProjectJobPosts(false);
  addLog('🚀 运营部已在「' + (targetBranch ? targetBranch.name : '总部') + '」立项「' + pj.name + '」', 'success');
}

function openCompanyReportArchive(kind) {
  const pc = game.playerCompany;
  const list = kind === 'monthly' ? (pc.monthlyReports || []) : (pc.weeklyReports || []);
  if (!list.length) {
    if (kind === 'weekly' && pc.pendingWeeklyReport && typeof queueCompanyWeeklyReportModal === 'function') {
      queueCompanyWeeklyReportModal();
      return;
    }
    if (kind === 'monthly' && pc.pendingMonthlyReport && typeof queueCompanyMonthlyReportModal === 'function') {
      queueCompanyMonthlyReportModal();
      return;
    }
    addLog('暂无' + (kind === 'monthly' ? '月' : '周') + '报记录', 'info');
    return;
  }
  const r = list[0];
  let html = '<p class="fold-meta">最近一期 · 第 ' + r.week + ' 周</p>';
  if (kind === 'monthly') {
    html += '<p>净利 <b>' + (r.net >= 0 ? '+' : '') + '¥' + (r.net || 0).toLocaleString() + '</b></p>';
    html += '<p class="fold-meta">营收 ¥' + (r.projectRev || 0).toLocaleString() + ' · 运营 ¥' + (r.opsCost || 0).toLocaleString() + '</p>';
    if (r.financeDigest) html += '<p class="fold-meta"><b>财务高管</b>：' + r.financeDigest + '</p>';
  } else {
    html += '<p>人才贡献 <b>' + (r.hireDelta >= 0 ? '+' : '') + '¥' + (r.hireDelta || 0).toLocaleString() + '</b></p>';
    if (r.financeDigest) html += '<p class="fold-meta"><b>财务摘要</b>：' + r.financeDigest + '</p>';
  }
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: kind === 'monthly' ? '📈' : '📊',
      title: '公司' + (kind === 'monthly' ? '月' : '周') + '报',
      html: html,
      buttons: [{ text: '关闭', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } }]
    });
  }
}

function openCompanyInterviewPicker(postKey) {
  const pc = game.playerCompany;
  const pending = (pc.recruitInbox || []).filter(function (c) { return c.status === 'pending'; });
  let pool = pending;
  if (postKey) {
    pool = pending.filter(function (c) {
      const post = (pc.jobPosts || []).find(function (p) { return p.id === c.postId; });
      return postKey.indexOf('pj_') === 0 ? (post && ('pj_' + post.projectId + '_' + post.title) === postKey) : c.postId === postKey;
    });
  }
  if (pool.length < 3) {
    addLog('该岗位待处理简历不足 3 份，无法安排终面三选一', 'warn');
    return;
  }
  const finalists = pool.slice().sort(function (a, b) {
    const sa = (a.hrRec === 'hire' ? 2 : 0) + (a.mgrRec === 'hire' ? 2 : 0) + (a.exp || 0) * 0.1;
    const sb = (b.hrRec === 'hire' ? 2 : 0) + (b.mgrRec === 'hire' ? 2 : 0) + (b.exp || 0) * 0.1;
    return sb - sa;
  }).slice(0, 3);
  finalists.forEach(function (cv) {
    cv.bizVote = Math.random() < 0.45 ? 'hire' : 'reject';
    if (cv.hrRec === 'hire' && cv.bizVote === 'reject') cv.bizNote = '商务担心成本与客情匹配';
    if (cv.hrRec === 'reject' && cv.bizVote === 'hire') cv.bizNote = '商务看好其客户资源，与人力意见相左';
    cv.hrVote = cv.hrRec;
  });
  pc.pendingInterview = { finalists: finalists, postKey: postKey };
  let html = '<p class="fold-meta">终面三选一 · 人力与商务已投票，请您裁定</p>';
  finalists.forEach(function (cv, i) {
    html += '<div style="margin:8px 0;padding:8px;border:1px solid var(--border);border-radius:8px">';
    html += '<b>' + cv.name + '</b> · ' + cv.title + '<br>';
    html += '<span class="fold-meta">👔 人力（' + getExecDisplayName('hr') + '）：' + (cv.hrVote === 'hire' ? '赞成' : '反对') + '</span><br>';
    html += '<span class="fold-meta">🌐 商务（' + getExecDisplayName('biz') + '）：' + (cv.bizVote === 'hire' ? '赞成' : '反对') + '</span>';
    if (cv.bizNote) html += '<br><span class="fold-meta" style="color:var(--orange)">' + cv.bizNote + '</span>';
    html += '</div>';
  });
  const buttons = finalists.map(function (cv, i) {
    return {
      text: '录用 ' + cv.name,
      handler: function () {
        companyRecruitHire(cv.id);
        (finalists.filter(function (x) { return x.id !== cv.id; })).forEach(function (x) {
          x.status = 'rejected';
          x.decisionWeek = game.week;
        });
        pc.pendingInterview = null;
        if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
        addLog('🎯 终面裁定：录用 ' + cv.name, 'success');
      }
    };
  });
  buttons.push({ text: '暂不决定', handler: function () { pc.pendingInterview = null; if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '🎯', title: '终面三选一', html: html, buttons: buttons });
  }
}

function enhanceCompanyFinancialReports() {
  if (!hasPlayerCompany()) return;
  const pc = game.playerCompany;
  if (pc.pendingWeeklyReport) {
    const wr = pc.pendingWeeklyReport;
    wr.financeDigest = '财务高管' + getExecDisplayName('cfo') + '：本周人力成本约 ¥' +
      Math.round(((pc.staff || []).reduce(function (s, x) { return s + (x.salary || 0); }, 0)) / 52).toLocaleString() +
      '；现金头寸 ¥' + (game.cash || 0).toLocaleString();
  }
  if (pc.pendingMonthlyReport) {
    const mr = pc.pendingMonthlyReport;
    mr.financeDigest = getExecDisplayName('cfo') + ' 提交财报：净利 ' + (mr.net >= 0 ? '+' : '') + '¥' + (mr.net || 0).toLocaleString() +
      '；运营开支 ¥' + (mr.opsCost || 0).toLocaleString() + (mr.stockDelta ? '；持股波动 ' + mr.stockDelta : '');
    const execSuggestions = [];
    if (pc.activeStrategy) execSuggestions.push('运营高管：按「' + pc.activeStrategy.label + '」推进 ' + (pc.activeStrategy.industry || '') + ' 落地');
    execSuggestions.push('商务高管：建议加强「' + ((pc.industries || [])[0] || '主营') + '」宣发');
    execSuggestions.push('人力高管：关注 KPI 低于 55 的项目组');
    mr.suggestions = execSuggestions;
  }
}

function tickCompanyStrategyDaily() {
  if (!hasPlayerCompany()) return;
  tickCompanyExecutiveDailyReports();
}

function renderCompanyStrategyPanelHtml() {
  if (!hasPlayerCompany()) return '';
  const pc = game.playerCompany;
  const unread = (pc.secretary && pc.secretary.unread) || 0;
  let h = '<div style="margin-top:8px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.72rem">';
  h += '<b>📋 秘书台</b>';
  if (unread) h += ' <span style="color:var(--orange)">(' + unread + ' 条未读)</span>';
  h += '<div style="margin-top:4px">';
  h += '<button class="btn" style="font-size:.68rem;margin:2px 4px 2px 0" onclick="openSecretaryBrief()">今日高管汇报</button>';
  h += '<button class="btn" style="font-size:.68rem;margin:2px 4px 2px 0" onclick="openIndustryStrategyMenu()">🧭 行业战略</button>';
  h += '<button class="btn" style="font-size:.68rem;margin:2px 4px 2px 0" onclick="openCompanyReportArchive(\'weekly\')">📊 周报</button>';
  h += '<button class="btn" style="font-size:.68rem;margin:2px 4px 2px 0" onclick="openCompanyReportArchive(\'monthly\')">📈 月报</button>';
  h += '<button class="btn" style="font-size:.68rem;margin:2px 4px 2px 0" onclick="openCompanyGovernanceMenu()">⚖ 治理</button>';
  h += '</div>';
  if (pc.activeStrategy) {
    h += '<p class="fold-meta" style="margin:6px 0 0">当前战略：<b>' + pc.activeStrategy.label + '</b> · ' + pc.activeStrategy.industry + '</p>';
  }
  if (typeof renderCompanyGovernanceHtml === 'function') h += renderCompanyGovernanceHtml();
  h += '</div>';
  return h;
}
