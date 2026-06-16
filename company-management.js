/* 玩家公司：招聘邮箱 · 组织 · 财报 — 由 build.js 注入 */
const NEW_INDUSTRY_COST = 8000000;
const NEW_PROJECT_SCHEMES = {
  lean: { label: '精干小队', roles: [{ role: '项目经理', n: 1 }, { role: '研发工程师', n: 2 }, { role: '市场专员', n: 1 }] },
  standard: { label: '标准编制', roles: [{ role: '部门主管', n: 1 }, { role: '产品经理', n: 1 }, { role: '研发工程师', n: 3 }, { role: '财务分析', n: 1 }, { role: '客户成功', n: 2 }] },
  heavy: { label: '重投入', roles: [{ role: '部门主管', n: 2 }, { role: '产品经理', n: 2 }, { role: '研发工程师', n: 6 }, { role: '品牌策划', n: 2 }, { role: '运营主管', n: 1 }] }
};
const COMPANY_DEPT_TEMPLATE = [
  { id: 'exec', name: '总裁办', head: '你', parent: null, level: 0 },
  { id: 'hr', name: '人力资源部', head: '林婉儿', parent: 'exec', level: 1 },
  { id: 'finance', name: '财务部', head: '王建国', parent: 'exec', level: 1 },
  { id: 'biz_exec', name: '商务部', head: '陈海洋', parent: 'exec', level: 1 },
  { id: 'marketing', name: '市场部', head: '周市场', parent: 'exec', level: 1 },
  { id: 'tech', name: '技术部', head: '（待任命）', parent: 'exec', level: 1 },
  { id: 'ops', name: '运营部', head: '刘运营', parent: 'exec', level: 1 },
  { id: 'biz1', name: '业务一部', head: '（待任命）', parent: 'biz_exec', level: 2 },
  { id: 'biz2', name: '业务二部', head: '（待任命）', parent: 'biz_exec', level: 2 }
];
const ROLE_DEPT_MAP = {
  '项目经理': 'biz1', '产品经理': 'biz1', '市场专员': 'marketing', '客户成功': 'biz1',
  '品牌策划': 'marketing', '行业总监': 'biz1', '运营主管': 'ops', '部门主管': 'biz1',
  '分公司经理': 'biz_exec', '区域经理': 'biz_exec', '城市经理': 'biz_exec',
  '研发工程师': 'tech', '财务分析': 'finance', '行政助理': 'hr'
};
const ROLE_CAREER_MAP = {
  '项目经理': { titles: ['项目经理', '项目主管', '工程监理'], categories: ['建筑业', '信息技术', '制造业'] },
  '产品经理': { titles: ['产品经理', '产品设计师', '产品运营'], categories: ['信息技术'] },
  '研发工程师': { titles: ['软件工程师', '开发工程师', '算法工程师', '测试工程师'], categories: ['信息技术'] },
  '市场专员': { titles: ['市场专员', '市场营销专员', '新媒体运营'], categories: ['批发和零售业', '文化、体育和娱乐业'] },
  '客户成功': { titles: ['销售代表', '客户经理', '客户服务代表'], categories: ['批发和零售业', '金融业'] },
  '财务分析': { titles: ['财务分析师', '会计师', '审计师'], categories: ['金融', '金融业'] },
  '品牌策划': { titles: ['广告策划', '文案策划', '品牌策划'], categories: ['文化、体育和娱乐业', '批发和零售业'] },
  '运营主管': { titles: ['运营主管', '电商运营', '网店运营'], categories: ['批发和零售业', '信息技术'] },
  '部门主管': { titles: ['部门经理', '业务主管', '生产主管'], categories: ['制造业', '批发和零售业'] },
  '分公司经理': { titles: ['区域经理', '分公司经理', '业务总监'], categories: ['批发和零售业'] },
  '行业总监': { titles: ['销售总监', '业务总监', '市场总监'], categories: [] },
  '行政助理': { titles: ['行政助理', '办公室文员', '秘书'], categories: ['公共管理、社会保障和社会组织'] }
};
const INDUSTRY_PROFILES = {
  '综合': { tagline: '多元化经营', products: ['企业综合服务包', '标准SaaS套餐', '区域代理服务'], templates: [
    { name: '主营业务增长计划', desc: '巩固存量客户，拓展区域渠道与合作伙伴', product: '标准版服务包' },
    { name: '新客户开拓专项', desc: '针对重点行业客户完成试点签约与交付验收', product: '企业入门套餐' }
  ]},
  '信息技术': { tagline: '软件与数字化', products: ['企业协同办公App', '数据中台', 'AI客服系统', '行业SaaS'], templates: [
    { name: '华东SaaS渠道拓展', desc: '面向中型企业推广订阅制软件，完成试点部署', product: '企业协同办公App' },
    { name: '核心模块V2迭代', desc: '重构底层架构，提升性能与付费转化率', product: '数据中台' }
  ]},
  '制造业': { tagline: '智造与供应链', products: ['智能产线改造方案', '工业传感器套件', '精益生产咨询包'], templates: [
    { name: '产线智能化改造', desc: '为工厂客户部署MES与设备联网，缩短交付周期', product: '智能产线改造方案' },
    { name: '供应链协同项目', desc: '打通上下游库存与订单，降低缺料停线风险', product: '工业传感器套件' }
  ]},
  '金融': { tagline: '财富与风控', products: ['理财投顾小程序', '企业风控引擎', '普惠金融产品'], templates: [
    { name: '财富管理获客', desc: '针对高净值客户完成产品路演与合规开户转化', product: '理财投顾小程序' },
    { name: '企业信贷风控试点', desc: '为合作机构上线反欺诈与授信模型', product: '企业风控引擎' }
  ]},
  '金融业': { tagline: '财富与风控', products: ['理财投顾小程序', '企业风控引擎'], templates: [
    { name: '零售金融增长', desc: '拓展理财与保险交叉销售，提升户均AUM', product: '理财投顾小程序' }
  ]},
  '批发和零售业': { tagline: '渠道与品牌', products: ['自有品牌SKU', '社区团购套餐', '直播带货专场'], templates: [
    { name: '双11大促备战', desc: '完成备货、达人合作与全渠道投放', product: '自有品牌SKU' },
    { name: '线下门店焕新', desc: '升级门店陈列与会员体系，拉动复购', product: '社区团购套餐' }
  ]},
  '建筑业': { tagline: '工程与基建', products: ['装配式住宅方案', '智慧工地系统'], templates: [
    { name: '市政配套工程投标', desc: '完成标书、资质与施工组织设计', product: '智慧工地系统' },
    { name: '住宅地块开发', desc: '从拿地到预售证的全周期项目管理', product: '装配式住宅方案' }
  ]},
  '文化、体育和娱乐业': { tagline: '内容与IP', products: ['短剧IP', '线下演出季票', '文创周边'], templates: [
    { name: '短剧IP孵化', desc: '完成剧本、拍摄与平台分发', product: '短剧IP' },
    { name: '品牌联名活动', desc: '联动艺人/赛事资源做整合营销', product: '文创周边' }
  ]},
  '新能源与环保': { tagline: '绿色能源', products: ['分布式光伏包', '储能电站方案', '碳资产管理服务'], templates: [
    { name: '园区光伏试点', desc: '完成勘察、并网与运维托管签约', product: '分布式光伏包' },
    { name: '储能项目交付', desc: '为工商业客户部署峰谷套利系统', product: '储能电站方案' }
  ]},
  '餐饮住宿': { tagline: '餐饮与文旅', products: ['连锁加盟模型', '预制菜供应链', '主题民宿'], templates: [
    { name: '新店型试点', desc: '在核心商圈验证单店模型与翻台率', product: '连锁加盟模型' },
    { name: '中央厨房升级', desc: '标准化预制菜配送，降低门店人力成本', product: '预制菜供应链' }
  ]}
};
function projectMetaSeed(p) {
  const s = String((p && p.id) || '') + '|' + String((p && p.industry) || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return Math.abs(h);
}
function pickIndustryProfile(industry) {
  return INDUSTRY_PROFILES[industry] || INDUSTRY_PROFILES['综合'];
}
const COMPANY_GENERAL_INDUSTRY_LABEL = '综合';
const COMPANY_GENERAL_INDUSTRY_MIN = 4;
function companyIndustryCatalog() {
  const fromMarket = [...new Set((game.market || []).map(function (j) { return j.category; }).filter(function (c) {
    return c && c !== COMPANY_GENERAL_INDUSTRY_LABEL;
  }))].sort();
  if (fromMarket.length) return fromMarket;
  return Object.keys(INDUSTRY_PROFILES).filter(function (k) { return k !== COMPANY_GENERAL_INDUSTRY_LABEL; });
}
function sanitizeCompanyIndustries(pc) {
  if (!pc) return [];
  normalizeCompanyIndustriesRaw(pc);
  return pc.industries.filter(function (c) { return c && c !== COMPANY_GENERAL_INDUSTRY_LABEL; });
}
function normalizeCompanyIndustriesRaw(pc) {
  if (!pc) return;
  const raw = pc.industries;
  if (raw == null) { pc.industries = []; return; }
  if (typeof raw === 'string') {
    pc.industries = raw === COMPANY_GENERAL_INDUSTRY_LABEL ? [] : [raw];
    return;
  }
  if (!Array.isArray(raw)) pc.industries = [];
}
function companyNeedsIndustryPick(pc) {
  if (!pc || !pc.founded) return false;
  return !sanitizeCompanyIndustries(pc).length;
}
function getCompanyPrimaryIndustry(pc) {
  const list = sanitizeCompanyIndustries(pc);
  if (!list.length) return null;
  if (pc.primaryIndustry && list.indexOf(pc.primaryIndustry) >= 0) return pc.primaryIndustry;
  return list[list.length - 1];
}
function getCompanyIndustryDisplayName(pc) {
  const list = sanitizeCompanyIndustries(pc);
  if (!list.length) return '（待选定行业）';
  if (list.length >= COMPANY_GENERAL_INDUSTRY_MIN) return COMPANY_GENERAL_INDUSTRY_LABEL;
  if (list.length === 1) return list[0];
  return list.join('、');
}
function addCompanyIndustry(pc, industry) {
  if (!pc || !industry || industry === COMPANY_GENERAL_INDUSTRY_LABEL) return false;
  pc.industries = sanitizeCompanyIndustries(pc);
  if (pc.industries.indexOf(industry) >= 0) return false;
  pc.industries.push(industry);
  pc.primaryIndustry = industry;
  pc.industryPickPending = false;
  return true;
}
function inferPlayerCompanyIndustry() {
  if (game && game.employed && game.employment && game.market) {
    const job = game.market[game.employment.jobIdx];
    if (job && job.category && job.category !== COMPANY_GENERAL_INDUSTRY_LABEL) return job.category;
  }
  return null;
}
function openCompanyIndustryPicker(opts) {
  opts = opts || {};
  const cats = companyIndustryCatalog();
  const cur = opts.pc ? sanitizeCompanyIndustries(opts.pc) : sanitizeCompanyIndustries(game && game.playerCompany);
  const avail = cats.filter(function (c) { return cur.indexOf(c) < 0; });
  if (!avail.length) { addLog('暂无可选行业', 'warn'); return; }
  let html = '<p class="fold-meta">' + (opts.hint || '请选择公司所属行业（一次选一个）') + '</p>';
  html += '<div style="max-height:240px;overflow-y:auto">';
  avail.forEach(function (cat) {
    const prof = pickIndustryProfile(cat);
    const tag = prof.tagline ? ' · ' + prof.tagline : '';
    const esc = String(cat).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    html += '<button type="button" class="btn" style="display:block;width:100%;margin:6px 0;text-align:left" onclick="confirmCompanyIndustryPick(\'' + esc + '\')"><b>' + cat + '</b><span class="fold-meta">' + tag + '</span></button>';
  });
  html += '</div>';
  game._companyIndustryPickCtx = { onPick: opts.onPick };
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '🏭',
      title: opts.title || '选择公司行业',
      html: html,
      buttons: [{ text: '取消', handler: function () { game._companyIndustryPickCtx = null; if (typeof closeConsumeModal === 'function') closeConsumeModal(true); if (opts.onCancel) opts.onCancel(); } }]
    });
  }
}
function confirmCompanyIndustryPick(industry) {
  const ctx = game && game._companyIndustryPickCtx;
  game._companyIndustryPickCtx = null;
  if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  if (ctx && typeof ctx.onPick === 'function') ctx.onPick(industry);
  else if (typeof applyCompanyIndustryPick === 'function') applyCompanyIndustryPick(industry);
}
function applyCompanyIndustryPick(industry) {
  const pc = game && game.playerCompany;
  if (!pc || !industry) return;
  if (!addCompanyIndustry(pc, industry)) return;
  addLog('🏭 公司行业定为「' + industry + '」', 'success');
  if (typeof migrateProjectDetails === 'function') migrateProjectDetails(pc);
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
  else if (typeof updateUI === 'function') updateUI();
  if (typeof autoSaveSlot === 'function') autoSaveSlot();
}
function promptCompanyIndustryIfNeeded() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded || !companyNeedsIndustryPick(pc)) return;
  if (game._loadingSave) { pc.industryPickPending = true; return; }
  if (typeof consumeModalOpen !== 'undefined' && consumeModalOpen) return;
  openCompanyIndustryPicker({
    title: '选择公司所属行业',
    hint: '请为公司选定主营行业（不可直接选「综合」）。布局达到四个及以上行业时，将自动显示为综合型企业。',
    onPick: function (ind) { applyCompanyIndustryPick(ind); }
  });
}
function migrateCompanyIndustries(pc) {
  if (!pc || !pc.founded) return;
  pc.industries = sanitizeCompanyIndustries(pc);
  if (pc.industries.length && !pc.primaryIndustry) pc.primaryIndustry = pc.industries[pc.industries.length - 1];
  pc.industryPickPending = companyNeedsIndustryPick(pc);
}
function pickJobFromMarket(titleHints, industry, categoryHints) {
  const market = (game && game.market) || [];
  let pool = market.filter(function (j) {
    if (industry && j.category === industry) return true;
    if (categoryHints && categoryHints.length && categoryHints.indexOf(j.category) >= 0) return true;
    return false;
  });
  if (!pool.length) pool = market;
  let i;
  for (i = 0; i < (titleHints || []).length; i++) {
    const hint = titleHints[i];
    const hit = pool.find(function (j) { return j.title.indexOf(hint) >= 0 || hint.indexOf(j.title) >= 0; });
    if (hit) return { title: hit.title, category: hit.category };
  }
  if (pool.length) {
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return { title: pick.title, category: pick.category };
  }
  return { title: (titleHints && titleHints[0]) || '专员', category: industry || '综合' };
}
function roleToCareerInfo(role, industry) {
  const map = ROLE_CAREER_MAP[role];
  if (!map) return { title: role, category: industry || '综合' };
  return pickJobFromMarket(map.titles, industry, map.categories);
}
function enrichProjectRoleCareers(p) {
  if (!p || !p.roles) return;
  const ind = (p.industry && p.industry !== COMPANY_GENERAL_INDUSTRY_LABEL) ? p.industry : (getCompanyPrimaryIndustry(game && game.playerCompany) || '信息技术');
  p.roles.forEach(function (ro) {
    if (!ro.careerTitle) {
      const c = roleToCareerInfo(ro.role, ind);
      ro.careerTitle = c.title;
      ro.careerCategory = c.category;
    }
  });
}
function enrichProjectMeta(p) {
  if (!p) return p;
  const pc = game && game.playerCompany;
  const primary = pc ? getCompanyPrimaryIndustry(pc) : null;
  const ind = (p.industry && p.industry !== COMPANY_GENERAL_INDUSTRY_LABEL) ? p.industry : (primary || inferPlayerCompanyIndustry() || '信息技术');
  p.industry = ind;
  const prof = pickIndustryProfile(ind);
  const seed = projectMetaSeed(p);
  const tpl = prof.templates[seed % prof.templates.length];
  if (!p.productName) p.productName = prof.products[seed % prof.products.length];
  if (!p.desc) {
    if (p.fromStrategy && p.strategyLabel) {
      p.desc = '执行「' + p.strategyLabel + '」战略：在' + ind + '行业' + (tpl ? tpl.desc : '推进落地与首单交付');
    } else if (tpl) {
      p.desc = tpl.desc;
      if (!p.name || p.name.indexOf('战略落地') >= 0) p.name = tpl.name;
      if (!p._productUserSet) p.productName = p.productName || tpl.product;
    } else {
      p.desc = ind + '方向业务拓展与阶段性交付';
    }
  }
  if (!p.deliverable) {
    p.deliverable = p.productName
      ? ('完成「' + p.productName + '」从方案到上线，并达成首批客户验收')
      : '完成本阶段营收与客户交付目标';
  }
  enrichProjectRoleCareers(p);
  return p;
}
function migrateProjectDetails(pc) {
  if (!pc) return;
  migrateCompanyIndustries(pc);
  (pc.projects || []).forEach(function (p) {
    if (!p.industry || p.industry === COMPANY_GENERAL_INDUSTRY_LABEL) {
      const primary = getCompanyPrimaryIndustry(pc);
      if (primary) p.industry = primary;
    }
    enrichProjectMeta(p);
  });
}
function getCompanyIndustriesLabel(pc) {
  if (!pc) return '—';
  const list = sanitizeCompanyIndustries(pc);
  if (!list.length) return '<span style="color:var(--orange)">待选定行业</span>';
  if (list.length >= COMPANY_GENERAL_INDUSTRY_MIN) {
    const primary = getCompanyPrimaryIndustry(pc);
    const prof = pickIndustryProfile(primary || list[0]);
    const tag = prof.tagline ? '（' + prof.tagline + '）' : '';
    return '<b>综合</b> <span class="fold-meta">· 已布局 ' + list.length + ' 个行业 · 主营 ' + (primary || list[0]) + tag + '</span>';
  }
  const primary = getCompanyPrimaryIndustry(pc);
  const prof = pickIndustryProfile(primary);
  const tag = prof.tagline ? '（' + prof.tagline + '）' : '';
  if (list.length === 1) return '<b>' + primary + '</b>' + tag;
  return '主营 <b>' + primary + '</b>' + tag + ' · 已布局 ' + list.join('、');
}
function formatRoleStaffingLine(p, ro, pc) {
  const filled = countStaffOnProjectForRole(p.id, ro.role);
  const need = ro.n || 0;
  const ok = filled >= need;
  const career = ro.careerTitle || roleToCareerInfo(ro.role, p.industry).title;
  const cat = ro.careerCategory || roleToCareerInfo(ro.role, p.industry).category;
  let line = (ok ? '✅' : '⚠️') + ' <b>' + ro.role + '</b> → 招聘职业「' + career + '」';
  if (cat) line += ' <span class="fold-meta">（' + cat + '）</span>';
  line += '：' + filled + '/' + need;
  if (!ok) line += ' <span style="color:var(--orange)">缺 ' + (need - filled) + '</span>';
  const assigned = (pc.staff || []).filter(function (s) { return s.projectId === p.id && (s.role === ro.role || s.title === ro.role); });
  if (assigned.length) line += ' · 在岗：' + assigned.map(function (s) { return s.name; }).join('、');
  return line;
}
let companyRecruitFold = {};
let companyRecruitSelectedCvId = null;

function roleToDept(role) {
  return ROLE_DEPT_MAP[role] || 'biz1';
}
function deptNameById(id) {
  const pc = game && game.playerCompany;
  const d = pc && pc.departments && pc.departments.find(function (x) { return x.id === id; });
  return d ? d.name : id || '—';
}
function countStaffOnProjectForRole(projectId, role) {
  const pc = game && game.playerCompany;
  if (!pc || !projectId) return 0;
  return (pc.staff || []).filter(function (s) {
    return s.projectId === projectId && (s.role === role || s.title === role);
  }).length;
}
function migrateProjectRoles(pc) {
  if (!pc || !pc.projects) return;
  pc.projects.forEach(function (p) {
    if (!p.roles || !p.roles.length) {
      const scheme = NEW_PROJECT_SCHEMES[p.scheme] || NEW_PROJECT_SCHEMES.standard;
      p.roles = (scheme.roles || []).map(function (r) { return { role: r.role, n: r.n }; });
    }
    if (!p.deptId) p.deptId = p.tier === 'major' ? 'biz1' : 'tech';
  });
}
function getProjectStaffingGaps() {
  const pc = game && game.playerCompany;
  if (!pc) return [];
  migrateProjectRoles(pc);
  const gaps = [];
  (pc.projects || []).forEach(function (p) {
    if ((p.progress || 0) >= 100) return;
    (p.roles || []).forEach(function (ro) {
      const filled = countStaffOnProjectForRole(p.id, ro.role);
      const need = Math.max(0, (ro.n || 0) - filled);
      for (let i = 0; i < need; i++) {
        gaps.push({
          projectId: p.id,
          projectLabel: typeof projectDisplayLabel === 'function' ? projectDisplayLabel(p) : (p.name || '项目'),
          role: ro.role,
          deptId: p.deptId || roleToDept(ro.role),
          branchId: p.branchId || null,
          branchCity: typeof branchLabel === 'function' ? branchLabel(p.branchId) : '',
          industry: p.industry || getCompanyPrimaryIndustry(pc) || '信息技术'
        });
      }
    });
  });
  return gaps;
}
function syncExecutiveJobPosts(chargeUser) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded) return { added: 0, gaps: 0 };
  if (typeof getExecutiveStaffingGaps !== 'function') return { added: 0, gaps: 0 };
  if (typeof ensureBoardExecState === 'function') ensureBoardExecState();
  const gaps = getExecutiveStaffingGaps();
  pc.jobPosts = pc.jobPosts || [];
  let added = 0;
  gaps.forEach(function (g) {
    const have = pc.jobPosts.some(function (p) { return p.active && p.execRoleKey === g.execRoleKey; });
    if (have) return;
    const cost = typeof JOB_POST_COST !== 'undefined' ? JOB_POST_COST : 5000;
    if (chargeUser && game.cash < cost) {
      addLog('现金不足，无法为「' + g.label + '」发布招聘（¥' + cost.toLocaleString() + '）', 'fail');
      return;
    }
    if (chargeUser) {
      game.cash -= cost;
      if (typeof ledgerAddExpense === 'function') ledgerAddExpense('business', '📧', '高管招聘·' + g.label, cost, false);
    }
    const ind = typeof getCompanyPrimaryIndustry === 'function' ? getCompanyPrimaryIndustry(pc) : '信息技术';
    const career = g.execRoleKey === 'cto'
      ? { title: '技术总监', category: ind }
      : (g.execRoleKey === 'cfo' ? { title: '财务总监', category: ind }
        : g.execRoleKey === 'hr' ? { title: '人力资源经理', category: ind }
          : g.execRoleKey === 'biz' ? { title: '商务总监', category: ind }
            : g.execRoleKey === 'cmo' ? { title: '市场总监', category: ind }
              : g.execRoleKey === 'ops' ? { title: '运营总监', category: ind }
                : roleToCareerInfo('部门主管', ind));
    pc.jobPosts.push({
      id: 'jp_exec_' + g.execRoleKey + '_' + game.week + '_' + pc.jobPosts.length,
      title: g.label,
      execRoleKey: g.execRoleKey,
      careerTitle: career.title,
      careerCategory: career.category,
      deptId: g.deptId,
      projectLabel: '总部高管',
      week: game.week,
      active: true,
      fromExecutive: true
    });
    added++;
  });
  const vacantKeys = {};
  getExecutiveStaffingGaps().forEach(function (g) { vacantKeys[g.execRoleKey] = true; });
  pc.jobPosts.forEach(function (post) {
    if (!post.fromExecutive || !post.execRoleKey) return;
    if (!vacantKeys[post.execRoleKey]) post.active = false;
  });
  return { added: added, gaps: gaps.length };
}
function postMatchesStaffingNeed(post) {
  if (!post) return false;
  if (post.fromExecutive && post.execRoleKey) {
    return typeof getExecutiveStaffingGaps === 'function' && getExecutiveStaffingGaps().some(function (g) { return g.execRoleKey === post.execRoleKey; });
  }
  if (post.projectId && post.title) {
    return getProjectStaffingGaps().some(function (g) { return g.projectId === post.projectId && g.role === post.title; });
  }
  return false;
}
function syncProjectJobPosts(chargeUser) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded) return { added: 0, gaps: 0 };
  migrateProjectRoles(pc);
  const gaps = getProjectStaffingGaps();
  pc.jobPosts = pc.jobPosts || [];
  const gapKeys = {};
  gaps.forEach(function (g) { gapKeys[g.projectId + '|' + g.role] = (gapKeys[g.projectId + '|' + g.role] || 0) + 1; });
  const activeCount = {};
  pc.jobPosts.forEach(function (post) {
    if (!post.active || !post.projectId) return;
    const k = post.projectId + '|' + post.title;
    activeCount[k] = (activeCount[k] || 0) + 1;
  });
  Object.keys(gapKeys).forEach(function (k) {
    const parts = k.split('|');
    const pid = parts[0];
    const role = parts.slice(1).join('|');
    const need = gapKeys[k];
    const have = activeCount[k] || 0;
    if (have >= need) return;
    const toAdd = need - have;
    const proj = (pc.projects || []).find(function (x) { return x.id === pid; });
    const career = roleToCareerInfo(role, proj ? proj.industry : null);
    for (let i = 0; i < toAdd; i++) {
      const cost = typeof JOB_POST_COST !== 'undefined' ? JOB_POST_COST : 5000;
      if (chargeUser && game.cash < cost) {
        addLog('现金不足，无法为「' + role + '」发布招聘（¥' + cost.toLocaleString() + '）', 'fail');
        break;
      }
      if (chargeUser) {
        game.cash -= cost;
        if (typeof ledgerAddExpense === 'function') ledgerAddExpense('business', '📧', '项目招聘·' + role, cost, false);
      }
      pc.jobPosts.push({
        id: 'jp_' + pid + '_' + role.replace(/\s/g, '') + '_' + game.week + '_' + pc.jobPosts.length,
        title: role,
        careerTitle: career.title,
        careerCategory: career.category,
        industry: proj ? proj.industry : null,
        projectDesc: proj ? proj.desc : null,
        productName: proj ? proj.productName : null,
        projectId: pid,
        projectLabel: proj ? (typeof projectDisplayLabel === 'function' ? projectDisplayLabel(proj) : proj.name) : '',
        deptId: proj ? (proj.deptId || roleToDept(role)) : roleToDept(role),
        branchId: proj ? proj.branchId : null,
        branchLabel: proj && typeof branchLabel === 'function' ? branchLabel(proj.branchId) : '',
        week: game.week,
        active: true,
        fromProject: true
      });
      activeCount[k] = (activeCount[k] || 0) + 1;
    }
  });
  pc.jobPosts.forEach(function (post) {
    if (!post.projectId) {
      if (!post.fromProject) post.active = false;
      return;
    }
    const proj = (pc.projects || []).find(function (x) { return x.id === post.projectId; });
    if (proj && post.title && !post.careerTitle) {
      const career = roleToCareerInfo(post.title, proj.industry);
      post.careerTitle = career.title;
      post.careerCategory = career.category;
      post.industry = proj.industry;
      post.projectDesc = proj.desc;
      post.productName = proj.productName;
    }
    const k = post.projectId + '|' + post.title;
    if (!gapKeys[k]) post.active = false;
    else {
      const still = gapKeys[k];
      const siblings = pc.jobPosts.filter(function (p) { return p.active && p.projectId === post.projectId && p.title === post.title; });
      if (siblings.length > still) post.active = false;
    }
  });
  return { added: gaps.length, gaps: gaps.length };
}
function maybeAppointDeptHead(staff) {
  const pc = game && game.playerCompany;
  if (!pc || !staff || !staff.dept) return;
  const r = staff.role || staff.title || '';
  if (r.indexOf('主管') < 0 && r.indexOf('总监') < 0 && r.indexOf('经理') < 0) return;
  const d = (pc.departments || []).find(function (x) { return x.id === staff.dept; });
  if (d && (!d.head || d.head === '（待任命）' || d.head.indexOf('待任命') >= 0)) d.head = staff.name;
}
const DEPT_HEAD_CONTACT_MAP = { '林婉儿': 'staff_hr', '王建国': 'staff_cfo', '陈海洋': 'staff_biz', '刘运营': 'staff_ops', '周市场': 'staff_cmo' };
const COMPANY_TALK_TOPICS = [
  '聊了本周项目进度与资源协调。',
  '对方汇报了部门近况，气氛融洽。',
  '交换了对市场与竞品的看法。',
  '顺带谈了绩效考核与团队氛围。',
  '沟通了下一阶段的业务重点。'
];

function escCompanyPersonId(id) { return String(id || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }
function isCompanyExecutiveRole(role) {
  const r = String(role || '');
  return /总监|主管|经理|CEO|CFO|CTO|HR|董事|总裁|首席|人力|财务总监|运营主管|行业总监|项目总监/.test(r);
}

const CV_EDU_RANK = { '高中/中专': 2, '高中': 2, '中专': 2, '大专': 3, '本科': 4, '硕士': 5, '博士': 6 };
const CV_EDU_BY_RANK = { 2: '高中/中专', 3: '大专', 4: '本科', 5: '硕士', 6: '博士' };
function cvEduRank(edu) {
  if (edu === '高中' || edu === '中专') return 2;
  return CV_EDU_RANK[edu] || 2;
}
function cvEduAtRank(r) { return CV_EDU_BY_RANK[r] || '本科'; }
function cvRankFromExp(years, pct) {
  if (typeof careerRankLabel === 'function') return careerRankLabel(pct != null ? pct : yearsToCareerExpPct(years));
  const p = pct != null ? pct : yearsToCareerExpPct(years);
  if (p >= 100) return '总监';
  if (p >= 70) return '专家';
  if (p >= 30) return '普通岗';
  return '实习生';
}
function postRequiredCareerRank(post) {
  if (!post) return '普通岗';
  if (post.fromExecutive || isCompanyExecutiveRole(post.title)) return '总监';
  if (/主管|经理|总监|CEO|CFO|CTO|总裁|首席|项目总监|行业总监/.test(post.title || '')) return '专家';
  if (/实习/.test(post.title || '')) return '实习生';
  return '普通岗';
}
function postRequiredEdu(post) {
  if (!post) return '高中/中专';
  if (post.fromExecutive || /总监|CEO|CFO|CTO|总裁|首席/.test(post.title || '')) return '本科';
  if (/经理|主管|项目总监|行业总监/.test(post.title || '')) return '大专';
  return '高中/中专';
}
function scoreCvAgainstPost(cv, post) {
  const reqRank = postRequiredCareerRank(post);
  const reqEdu = postRequiredEdu(post);
  const cvRank = cv.careerRank || cvRankFromExp(cv.exp, cv.careerExp);
  const cvEduR = cvEduRank(cv.edu);
  const reqEduR = cvEduRank(reqEdu);
  let score = 52;
  const gaps = [];
  const pros = [];
  const rankGap = careerRankOrder(reqRank) - careerRankOrder(cvRank);
  if (rankGap > 0) {
    score -= rankGap * 26;
    gaps.push('职级不足（岗位需「' + reqRank + '」，候选人仅「' + cvRank + '」）');
  } else if (rankGap < 0) {
    score += 6;
    pros.push('职级高于岗位要求');
  }
  const eduGap = reqEduR - cvEduR;
  if (eduGap > 0) {
    score -= eduGap * 16;
    gaps.push('学历不足（岗位需「' + reqEdu + '」及以上，候选人「' + cv.edu + '」）');
  } else if (eduGap < 0) {
    score += 4;
  }
  if (post && post.careerCategory && cv.careerCategory) {
    if (cv.careerCategory === post.careerCategory) {
      score += 14;
      pros.push('有「' + post.careerCategory + '」行业背景');
    } else {
      score -= 10;
      gaps.push('行业不符（' + cv.careerCategory + ' → ' + post.careerCategory + '）');
    }
  }
  if (post && post.careerTitle && cv.lastCareerTitle && cv.lastCareerTitle.indexOf(post.careerTitle.slice(0, 2)) >= 0) {
    score += 8;
    pros.push('曾任相近岗位「' + cv.lastCareerTitle + '」');
  }
  if (reqRank === '总监' && cvRank !== '总监') {
    score -= 12;
    if (gaps.indexOf('职级不足（岗位需「总监」，候选人仅「' + cvRank + '」）') < 0) gaps.push('缺少总监级任职经历');
  }
  score = Math.max(0, Math.min(100, Math.round(score)));
  return { score: score, gaps: gaps, pros: pros, reqRank: reqRank, reqEdu: reqEdu, cvRank: cvRank };
}
function cvHrRecFromFit(fit) {
  if (!fit) return 'reject';
  if (fit.score >= 60) return 'hire';
  if (fit.score <= 35) return 'reject';
  return fit.score >= 48 ? 'hire' : 'reject';
}
function cvMgrRecFromFit(fit, post) {
  if (!fit) return 'reject';
  const bar = post && post.fromExecutive ? 68 : 55;
  if (fit.score >= bar) return 'hire';
  if (fit.score <= 32) return 'reject';
  return fit.score >= bar - 10 ? 'hire' : 'reject';
}
function recomputeCvScreening(cv, post) {
  if (!cv || !post) return;
  const fit = scoreCvAgainstPost(cv, post);
  cv.careerRank = cv.careerRank || fit.cvRank;
  cv.fitScore = fit.score;
  cv.fitGaps = fit.gaps;
  cv.fitPros = fit.pros;
  cv.hrRec = cvHrRecFromFit(fit);
  cv.mgrRec = cvMgrRecFromFit(fit, post);
  enrichCvResume(cv, fit, post);
}
function genCompanyCvProfile(post, rng) {
  rng = rng || Math.random;
  const reqRank = postRequiredCareerRank(post);
  const reqEdu = postRequiredEdu(post);
  const reqEduR = cvEduRank(reqEdu);
  const reqRankO = careerRankOrder(reqRank);
  const roll = rng();
  let eduR, rankO, years, careerExp;
  if (roll < 0.52) {
    rankO = reqRankO;
    eduR = Math.max(reqEduR, 4 + Math.floor(rng() * 2));
    years = reqRankO >= 3 ? 8 + Math.floor(rng() * 10) : reqRankO >= 2 ? 4 + Math.floor(rng() * 8) : 1 + Math.floor(rng() * 4);
    careerExp = Math.min(200, yearsToCareerExpPct(years) + Math.floor(rng() * 25));
  } else if (roll < 0.82) {
    rankO = Math.max(0, reqRankO - 1 - Math.floor(rng() * 2));
    eduR = Math.max(2, reqEduR - 1 - Math.floor(rng() * 2));
    years = 1 + Math.floor(rng() * 4);
    careerExp = yearsToCareerExpPct(years);
  } else {
    rankO = Math.min(3, reqRankO + (rng() < 0.5 ? 0 : 1));
    eduR = Math.min(6, reqEduR + 1);
    years = 6 + Math.floor(rng() * 12);
    careerExp = Math.min(200, yearsToCareerExpPct(years) + 30);
  }
  const careerRank = cvRankFromExp(years, careerExp);
  return {
    edu: cvEduAtRank(eduR),
    exp: years,
    careerRank: careerRank,
    careerExp: careerExp,
    careerCategory: post.careerCategory || (typeof getCompanyPrimaryIndustry === 'function' ? getCompanyPrimaryIndustry(game.playerCompany) : '信息技术'),
    lastCareerTitle: (post.careerTitle || post.title || '专员')
  };
}
function companyMeetingHours(participantCount) {
  const n = Math.max(0, participantCount | 0);
  if (n < 1) return 0;
  return Math.max(1, Math.ceil(n / 5));
}
function ensureCompanyStaffContact(staff) {
  if (!staff || !staff.id || !game || !game.playerCompany) return null;
  const coName = game.playerCompany.name || game.playerCompany.brandName || '你的公司';
  if (typeof ensureCoreContact !== 'function') return null;
  const gender = staff.gender || (Math.random() < 0.5 ? 'male' : 'female');
  const c = ensureCoreContact(staff.id, {
    kind: 'staff', name: staff.name, gender: gender,
    role: staff.role || staff.title || '职员', company: coName,
    jobTitle: staff.title || staff.role || '职员',
    metWhere: '公司', familiarity: 52, attraction: 5
  });
  if (typeof ensureContactDreamFields === 'function') ensureContactDreamFields(c);
  if (typeof ensureContactSocialFields === 'function') ensureContactSocialFields(c);
  if (typeof initContactLifespan === 'function') initContactLifespan(c, staff.id.length * 17);
  return c;
}
function ensureDeptHeadContact(dept) {
  if (!dept || !dept.head || dept.head === '你' || String(dept.head).indexOf('待任命') >= 0) return null;
  const pc = game.playerCompany;
  const coName = pc.name || pc.brandName || '你的公司';
  if (DEPT_HEAD_CONTACT_MAP[dept.head] && typeof ensureStaffContact === 'function') {
    const npc = typeof COMPANY_STAFF_NPC !== 'undefined' ? COMPANY_STAFF_NPC.find(function (s) { return s.id === DEPT_HEAD_CONTACT_MAP[dept.head]; }) : null;
    if (npc) return ensureStaffContact(npc, coName, '公司', { income: 500000 });
  }
  const st = (pc.staff || []).find(function (s) { return s.name === dept.head; });
  if (st) return ensureCompanyStaffContact(st);
  const id = 'co_head_' + dept.id;
  if (typeof ensureCoreContact !== 'function') return null;
  const c = ensureCoreContact(id, {
    kind: 'staff', name: dept.head, gender: Math.random() < 0.5 ? 'male' : 'female',
    role: '部门负责人', company: coName, jobTitle: dept.name + '负责人',
    metWhere: '公司', familiarity: 50, attraction: 0
  });
  if (typeof ensureContactDreamFields === 'function') ensureContactDreamFields(c);
  return c;
}
function collectCompanyPeople() {
  if (!hasPlayerCompany()) return [];
  if (typeof normalizeCompanyIndustriesRaw === 'function') normalizeCompanyIndustriesRaw(game.playerCompany);
  const pc = game.playerCompany;
  if (!Array.isArray(pc.departments)) pc.departments = [];
  if (!Array.isArray(pc.staff)) pc.staff = [];
  if (!pc.board) pc.board = { execs: {} };
  if (!pc.board.execs) pc.board.execs = {};
  const seen = {};
  const out = [];
  function pushPerson(p) {
    if (!p || !p.id || seen[p.id]) return;
    seen[p.id] = true;
    out.push(p);
  }
  if (typeof COMPANY_STAFF_NPC !== 'undefined') {
    COMPANY_STAFF_NPC.forEach(function (npc) {
      if (npc.id === 'staff_ceo') return;
      pushPerson({ id: npc.id, name: npc.name, role: npc.jobTitle || npc.role, dept: '高管', deptId: 'exec', isExecutive: true, source: 'npc' });
    });
  }
  (pc.departments || []).forEach(function (d) {
    if (!d.head || d.head === '你' || String(d.head).indexOf('待任命') >= 0) return;
    const cid = DEPT_HEAD_CONTACT_MAP[d.head] || ((pc.staff || []).find(function (s) { return s.name === d.head; }) || {}).id || ('co_head_' + d.id);
    pushPerson({ id: cid, name: d.head, role: d.name + '负责人', dept: d.name, deptId: d.id, isExecutive: true, source: 'dept_head' });
  });
  if (pc.board && pc.board.execs) {
    Object.keys(pc.board.execs).forEach(function (k) {
      const name = pc.board.execs[k];
      if (!name || name === '你' || String(name).indexOf('待任命') >= 0) return;
      const st = (pc.staff || []).find(function (s) { return s.name === name; });
      const cid = (st && st.id) || DEPT_HEAD_CONTACT_MAP[name] || ('co_exec_' + k);
      pushPerson({ id: cid, name: name, role: k.toUpperCase(), dept: '高管', deptId: 'exec', isExecutive: true, source: 'board' });
    });
  }
  (pc.staff || []).forEach(function (s) {
    let branchCity = null;
    if (s.branchId && typeof getBranchById === 'function') {
      const br = getBranchById(s.branchId);
      if (br) branchCity = br.city;
    }
    pushPerson({
      id: s.id, name: s.name, role: s.role || s.title || '职员',
      dept: deptNameById(s.dept), deptId: s.dept, branchCity: branchCity,
      isExecutive: isCompanyExecutiveRole(s.role || s.title), source: 'staff'
    });
  });
  return out;
}
function resolveCompanyPerson(contactId) {
  return collectCompanyPeople().find(function (p) { return p.id === contactId; }) || null;
}
function ensureCompanyPersonContact(person) {
  if (!person) return null;
  const pc = game.playerCompany;
  if (person.source === 'staff') {
    const st = (pc.staff || []).find(function (s) { return s.id === person.id; });
    if (st) return ensureCompanyStaffContact(st);
  }
  if (person.source === 'dept_head') {
    const dept = (pc.departments || []).find(function (d) {
      return DEPT_HEAD_CONTACT_MAP[person.name] || ('co_head_' + d.id) === person.id || d.head === person.name;
    });
    if (dept) return ensureDeptHeadContact(dept);
  }
  if (person.source === 'npc' && typeof ensureStaffContact === 'function' && typeof COMPANY_STAFF_NPC !== 'undefined') {
    const npc = COMPANY_STAFF_NPC.find(function (s) { return s.id === person.id; });
    if (npc) return ensureStaffContact(npc, pc.name || '你的公司', '公司', { income: 500000 });
  }
  const exist = (game.contacts || []).find(function (c) { return c.id === person.id; });
  if (exist) return exist;
  if (typeof ensureCoreContact === 'function') {
    return ensureCoreContact(person.id, {
      kind: 'staff', name: person.name, role: person.role, company: pc.name || '你的公司',
      jobTitle: person.role, metWhere: '公司', familiarity: 45, attraction: 0
    });
  }
  return null;
}
function isInCompanyExecCircle(contactId) {
  const wp = game && game.playerCircles && game.playerCircles.workplace;
  const exec = wp && wp.find(function (c) { return c.id === 'company_exec'; });
  return !!(exec && exec.members && exec.members.some(function (m) { return m.id === contactId; }));
}
function addPersonToCompanyWorkplaceCircle(contactId, meta) {
  if (!game || !game.playerCircles || !contactId || contactId === 'player') return;
  if (isInCompanyExecCircle(contactId)) {
    const exec = game.playerCircles.workplace.find(function (c) { return c.id === 'company_exec'; });
    if (typeof addCircleMember === 'function') addCircleMember(exec, contactId, meta);
    return;
  }
  const coName = game.playerCompany && (game.playerCompany.name || game.playerCompany.brandName) || '你的公司';
  let team = game.playerCircles.workplace.find(function (c) { return c.id === 'company_team'; });
  if (!team) {
    team = { id: 'company_team', kind: 'staff', name: '公司同事圈 · ' + coName, members: [] };
    game.playerCircles.workplace.push(team);
  }
  if (typeof ensurePlayerInStaffCircle === 'function') ensurePlayerInStaffCircle(team, '老板');
  if (typeof addCircleMember === 'function') addCircleMember(team, contactId, meta);
}
function getCompanyExecutiveContactIds() {
  if (!hasPlayerCompany()) return [];
  const ids = [];
  collectCompanyPeople().forEach(function (p) {
    if (p.isExecutive || p.source === 'npc' || p.source === 'dept_head' || p.source === 'board') ids.push(p.id);
  });
  return ids.filter(function (id, i, a) { return a.indexOf(id) === i; });
}
function companyTalkWith(contactId) {
  if (typeof companyTalkWithExec === 'function') { companyTalkWithExec(contactId, false); return; }
}
function runCompanyMeeting(selectedIds) {
  if (!hasPlayerCompany() || !selectedIds || !selectedIds.length) {
    addLog('请至少选择一名与会者', 'fail'); return;
  }
  const meetH = companyMeetingHours(selectedIds.length);
  const travelLeg = typeof getMeetingTravelPlan === 'function' ? getMeetingTravelPlan(selectedIds) : null;
  const travelH = travelLeg ? travelLeg.roundTripHours : 0;
  const totalH = meetH + travelH;
  if (typeof dailyCanUseHours === 'function' && !dailyCanUseHours(totalH)) {
    addLog('本时段剩余时间不足 ' + totalH + ' 小时（出行 ' + travelH + 'h + 会议 ' + meetH + 'h）', 'fail'); return;
  }
  if (travelH > 0 && typeof consumeCompanyTravelHours === 'function' && !consumeCompanyTravelHours(travelH, travelLeg, '异地会议')) return;
  if (typeof dailyAddHours === 'function') dailyAddHours(meetH, false);
  const names = [];
  selectedIds.forEach(function (cid) {
    const person = resolveCompanyPerson(cid);
    if (!person) return;
    const c = ensureCompanyPersonContact(person);
    if (!c) return;
    const bump = 1 + Math.floor(Math.random() * 3);
    if (typeof bumpContactFamiliarity === 'function') bumpContactFamiliarity(c, bump);
    addPersonToCompanyWorkplaceCircle(c.id, { role: person.role, familiarity: c.familiarity, attraction: c.attraction || 0 });
    names.push(c.name);
  });
  if (typeof syncAllPlayerStaffCircles === 'function') syncAllPlayerStaffCircles();
  addLog('📋 公司会议 · ' + selectedIds.length + ' 人参会 · 耗时 ' + totalH + 'h' + (travelH ? '（含出行 ' + travelH + 'h）' : '') + ' · ' + names.join('、'), 'info');
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '📋', title: '公司会议结束',
      html: '<p>会议时长 <b>' + meetH + ' 小时</b>（' + selectedIds.length + ' 人 · 每满 5 人 +1h）' +
        (travelLeg ? '<br><span class="fold-meta">' + formatTravelLabel(travelLeg) + '</span>' : '') + '</p><p class="fold-meta">与会：' + names.join('、') + '</p><p class="fold-meta" style="color:var(--accent)">与会同事已纳入职场圈</p>',
      buttons: [{ text: '知道了', primary: true, handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } }]
    });
  }
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
  else if (typeof renderDailyPanel === 'function') renderDailyPanel();
  if (typeof updateUI === 'function') updateUI();
}
function openCompanyMeetingPicker() {
  if (!hasPlayerCompany()) return;
  const people = collectCompanyPeople();
  if (!people.length) { addLog('公司暂无可参会人员', 'fail'); return; }
  let html = '<p class="fold-meta">至少 1 小时起；每满 <b>5</b> 人额外 +1 小时（6–10 人 2h，11–15 人 3h…）</p>';
  html += '<div id="companyMeetList" style="max-height:220px;overflow-y:auto;margin:8px 0;font-size:.78rem">';
  people.forEach(function (p) {
    const remote = typeof needsTravelToMeetPerson === 'function' && needsTravelToMeetPerson(p);
    const cityTag = p.branchCity && p.branchCity !== (typeof getPlayerCurrentCity === 'function' ? getPlayerCurrentCity() : '') ? ' · ' + p.branchCity : '';
    html += '<label style="display:block;margin:4px 0;cursor:pointer"><input type="checkbox" name="coMeetPick" value="' + escCompanyPersonId(p.id) + '"> ' +
      '<b>' + p.name + '</b> <span class="fold-meta">· ' + p.dept + ' · ' + p.role + cityTag +
      (remote ? ' <span style="color:var(--orange)">需出行</span>' : '') + '</span></label>';
  });
  html += '</div><p class="fold-meta" id="companyMeetHourHint">勾选参会人查看所需时长</p>';
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '📋', title: '公司会议 · 选择参会人',
      html: html,
      buttons: [
        { text: '取消', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } },
        { text: '开始会议', primary: true, handler: function () {
          const boxes = document.querySelectorAll('input[name="coMeetPick"]:checked');
          const ids = [];
          boxes.forEach(function (b) { if (b.value) ids.push(b.value); });
          if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
          runCompanyMeeting(ids);
        }}
      ]
    });
    setTimeout(function () {
      const list = document.getElementById('companyMeetList');
      const hint = document.getElementById('companyMeetHourHint');
      if (!list || !hint) return;
      list.addEventListener('change', function () {
        const ids = [];
        list.querySelectorAll('input[name="coMeetPick"]:checked').forEach(function (b) { if (b.value) ids.push(b.value); });
        const n = ids.length;
        const meetH = companyMeetingHours(n);
        const leg = typeof getMeetingTravelPlan === 'function' ? getMeetingTravelPlan(ids) : null;
        const travelH = leg ? leg.roundTripHours : 0;
        hint.textContent = n ? ('已选 ' + n + ' 人 · 会议 ' + meetH + 'h' + (travelH ? ' + 出行 ' + travelH + 'h' : '') + ' = 共 ' + (meetH + travelH) + 'h') : '勾选参会人查看所需时长';
      });
    }, 60);
  }
}
function renderCompanyPersonRow(person) {
  if (!person) return '';
  const eid = escCompanyPersonId(person.id);
  const inWp = isInCompanyExecCircle(person.id) || (function () {
    const team = game.playerCircles && game.playerCircles.workplace && game.playerCircles.workplace.find(function (c) { return c.id === 'company_team'; });
    return team && team.members && team.members.some(function (m) { return m.id === person.id; });
  })();
  const remote = typeof needsTravelToMeetPerson === 'function' && needsTravelToMeetPerson(person);
  const cityNote = person.branchCity ? ' <span class="fold-meta">· ' + person.branchCity + '</span>' : '';
  return '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:3px 0;padding:3px 0;border-bottom:1px dashed var(--border)">' +
    '<span><b>' + person.name + '</b> <span class="fold-meta">· ' + person.role + '</span>' + cityNote +
    (person.isExecutive ? ' <span class="fold-meta" style="color:var(--accent)">高管</span>' : '') +
    (remote ? ' <span class="fold-meta" style="color:var(--orange)">异地</span>' : '') +
    (inWp ? ' <span class="fold-meta" style="color:var(--green)">职场圈</span>' : '') + '</span>' +
    '<button type="button" class="btn" style="font-size:.65rem;padding:2px 8px;margin-left:auto" onclick="companyTalkWith(\'' + eid + '\')">💬 交谈 1h</button></div>';
}
function syncCompanyMgmtTabVisibility() {
  const btn = document.getElementById('btnTabCompany');
  if (!btn) return;
  const show = !!(game && typeof hasPlayerCompany === 'function' && hasPlayerCompany());
  btn.style.display = show ? '' : 'none';
  if (!show && typeof currentTab !== 'undefined' && currentTab === 'company' && typeof showTab === 'function') showTab('daily');
}
function refreshCompanyMgmtUi() {
  syncCompanyMgmtTabVisibility();
  if (typeof renderCompanyMgmtTab === 'function') renderCompanyMgmtTab();
}
function toggleCompanyMgmtPanel() {
  if (!game) return;
  if (typeof showTab === 'function') showTab('company');
}
function buildCompanyMgmtHtml() {
  if (!game || !hasPlayerCompany()) return '';
  const ctxSub = typeof getActiveSubsidiary === 'function' ? getActiveSubsidiary() : null;
  if (ctxSub && typeof buildSubsidiaryMgmtPanelHtml === 'function') {
    return (typeof renderCompanyContextSwitcherHtml === 'function' ? renderCompanyContextSwitcherHtml() : '') + buildSubsidiaryMgmtPanelHtml(ctxSub);
  }
  migrateCompanyManagement();
  syncProjectJobPosts(false);
  if (typeof syncExecutiveJobPosts === 'function') syncExecutiveJobPosts(false);
  const pc = game.playerCompany;
  const gaps = getProjectStaffingGaps();
  const execGaps = typeof getExecutiveStaffingGaps === 'function' ? getExecutiveStaffingGaps() : [];
  const pendN = (pc.recruitInbox || []).filter(function (x) { return x.status === 'pending'; }).length;
  const activePosts = (pc.jobPosts || []).filter(function (p) { return p.active; }).length;
  let h = typeof renderCompanyContextSwitcherHtml === 'function' ? renderCompanyContextSwitcherHtml() : '';
  h += '<div class="panel-title" style="margin-bottom:6px">🏢 ' + (pc.brandName || pc.name || '自有公司') + '</div>';
  h += '<div style="margin:0 0 10px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.75rem;line-height:1.5">';
  h += '<b>所属行业</b> · ' + getCompanyIndustriesLabel(pc);
  if (typeof companyNeedsIndustryPick === 'function' && companyNeedsIndustryPick(pc)) {
    h += ' <button type="button" class="btn" style="font-size:.68rem;padding:2px 8px;margin-left:4px" onclick="promptCompanyIndustryIfNeeded()">选定行业</button>';
  } else if (typeof sanitizeCompanyIndustries === 'function' && sanitizeCompanyIndustries(pc).length < COMPANY_GENERAL_INDUSTRY_MIN) {
    h += ' <button type="button" class="btn" style="font-size:.68rem;padding:2px 8px;margin-left:4px" onclick="promptNewIndustry()">拓展行业</button>';
  }
  if (pc.activeStrategy) h += '<br><span class="fold-meta">当前战略：' + pc.activeStrategy.label + '（' + pc.activeStrategy.industry + '）</span>';
  h += '</div>';
  if (typeof renderPlayerCompanyIpoHtml === 'function') h += renderPlayerCompanyIpoHtml(pc);
  if (typeof renderAcquiredSubsidiariesHtml === 'function') h += renderAcquiredSubsidiariesHtml(pc);
  h += '<p class="fold-meta" style="margin:0 0 8px">' + (pc.staff || []).length + ' 人 · ' + (pc.projects || []).filter(function (p) { return (p.progress || 0) < 100; }).length + ' 项在研';
  if (gaps.length) h += ' · <span style="color:var(--orange)">项目缺 ' + gaps.length + ' 岗</span>';
  if (execGaps.length) h += ' · <span style="color:var(--orange)">高管缺 ' + execGaps.map(function (g) { return g.label.split(' ')[0]; }).join('、') + '</span>';
  h += ' · 招聘岗位随项目编制缺口自动生成</p>';
  h += '<button class="btn btn-primary" style="font-size:.72rem;margin:2px 4px 2px 0" onclick="openCompanyRecruitInbox()">📬 招聘邮箱' + (pendN ? '（' + pendN + '）' : '') + '</button>';
  h += '<button class="btn" style="font-size:.72rem;margin:2px 4px 2px 0" onclick="syncProjectRecruitment()">📋 同步缺口招聘' + (activePosts ? '（' + activePosts + '岗）' : '') + '</button>';
  h += '<button class="btn" style="font-size:.72rem;margin:2px 4px 2px 0" onclick="openCompanyMeetingPicker()">📋 开会</button>';
  h += '<button class="btn" style="font-size:.72rem;margin:2px 4px 2px 0" onclick="openVisitBranchPicker(true)">🚗 赴分公司</button>';
  if (typeof renderCompanyStrategyPanelHtml === 'function') h += renderCompanyStrategyPanelHtml();
  if (typeof renderCompanyBranchesHtml === 'function') h += renderCompanyBranchesHtml();
  if (typeof renderCompetitionPanelHtml === 'function') h += renderCompetitionPanelHtml();
  const allPeople = collectCompanyPeople();
  if (allPeople.length) {
    h += '<div class="company-mgmt-section" style="margin-top:8px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.72rem">';
    h += '<b>👥 人员互动</b> <span class="fold-meta">· 交谈 1h/人 · 互动后加入职场圈</span>';
    allPeople.forEach(function (p) { h += renderCompanyPersonRow(p); });
    h += '</div>';
  }
  h += '<div class="company-mgmt-section" style="margin-top:8px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.72rem;line-height:1.5">';
  h += '<b>🏢 总部职能</b> <span class="fold-meta">· 分公司见上</span>';
  (pc.departments || []).forEach(function (d) {
    if (d.id === 'biz1' || d.id === 'biz2') return;
    const indent = (d.level || 0) * 12;
    const deptStaff = (pc.staff || []).filter(function (s) { return s.dept === d.id; });
    h += '<div style="margin-top:6px;padding-left:' + indent + 'px">';
    h += (d.level > 0 ? '└ ' : '') + '<b>' + d.name + '</b> · 负责人 <span style="color:var(--accent)">' + d.head + '</span>';
    h += ' <span class="fold-meta">(' + deptStaff.length + '人)</span></div>';
    if (deptStaff.length) {
      h += '<div style="padding-left:' + (indent + 12) + 'px;margin:2px 0 4px" class="fold-meta">';
      deptStaff.forEach(function (s) {
        const pj = s.projectId ? ((pc.projects || []).find(function (p) { return p.id === s.projectId; }) || null) : null;
        h += '<div>· ' + s.name + ' · ' + (s.role || s.title || '职员');
        if (pj) h += ' → ' + (typeof projectDisplayLabel === 'function' ? projectDisplayLabel(pj) : pj.name);
        h += '</div>';
      });
      h += '</div>';
    }
  });
  h += '</div>';
  const activeProj = (pc.projects || []).filter(function (p) { return (p.progress || 0) < 100; });
  h += '<div class="company-mgmt-section" style="margin-top:8px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.72rem;line-height:1.5">';
  h += '<b>🚀 在研业务</b>';
  if (!activeProj.length) {
    h += '<p class="fold-meta" style="margin:4px 0 0">暂无在研项目 · 秘书台「行业战略」立项，或月报新立项</p>';
  } else {
    activeProj.forEach(function (p) {
      const lead = p.manager || p.industryDirector || '（待任命）';
      h += '<div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border)">';
      h += '<b>' + (typeof projectDisplayLabel === 'function' ? projectDisplayLabel(p) : p.name) + '</b>';
      const brTag = p.branchId && typeof branchLabel === 'function' ? branchLabel(p.branchId) : '';
      h += ' <span class="fold-meta">· 行业 <b>' + (p.industry || getCompanyPrimaryIndustry(pc) || '待选定') + '</b>' + (brTag ? ' · ' + brTag : '') + ' · 进度 ' + (p.progress || 0) + '% · 负责人 ' + lead + '</span>';
      if (p.desc) h += '<p class="fold-meta" style="margin:4px 0 2px">' + p.desc + '</p>';
      if (p.productName) h += '<p class="fold-meta" style="margin:2px 0">📦 产品/服务：<b>' + p.productName + '</b></p>';
      if (p.deliverable) h += '<p class="fold-meta" style="margin:2px 0 0">🎯 交付目标：' + p.deliverable + '</p>';
      if (p.schemeLabel) h += '<p class="fold-meta" style="margin:2px 0 4px">编制方案：' + p.schemeLabel + '</p>';
      h += '<div style="margin-top:4px"><span class="fold-meta">所需工种：</span>';
      (p.roles || []).forEach(function (ro) {
        h += '<div class="fold-meta" style="margin:2px 0">' + formatRoleStaffingLine(p, ro, pc) + '</div>';
      });
      h += '</div></div>';
    });
  }
  h += '</div>';
  if (gaps.length || execGaps.length) {
    h += '<p class="fold-meta" style="margin-top:6px;color:var(--orange)">';
    if (execGaps.length) h += '高管空缺 ' + execGaps.length + ' · ';
    if (gaps.length) h += '项目编制缺口 ' + gaps.length + ' · ';
    h += '点「同步缺口招聘」发布需求（¥' + (typeof JOB_POST_COST !== 'undefined' ? JOB_POST_COST : 5000).toLocaleString() + '/岗）</p>';
  }
  return h;
}
function renderCompanyMgmtTab() {
  const el = document.getElementById('companyMgmtPanel');
  if (!el || !game) return;
  if (!hasPlayerCompany()) {
    el.innerHTML = '<p style="color:var(--muted)">尚未创办公司。请在「日常」→ 资产面板注册公司。</p>';
    return;
  }
  el.innerHTML = buildCompanyMgmtHtml();
}
function renderCompanyMgmtPanel() {
  return '';
}
function syncProjectRecruitment() {
  if (!hasPlayerCompany()) return;
  const r = syncProjectJobPosts(true);
  const re = typeof syncExecutiveJobPosts === 'function' ? syncExecutiveJobPosts(true) : { gaps: 0, added: 0 };
  const total = (r.gaps || 0) + (re.gaps || 0);
  if (!total) addLog('在研项目与高管岗位均已满编，暂无招聘缺口', 'info');
  else {
    let msg = '📋 已同步招聘岗位';
    if (re.gaps) msg += ' · 高管缺 ' + re.gaps + ' 岗';
    if (r.gaps) msg += ' · 项目缺 ' + r.gaps + ' 岗';
    addLog(msg, 'success');
  }
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
  else if (typeof renderDailyPanel === 'function') renderDailyPanel();
  if (typeof updateUI === 'function') updateUI();
}

function migrateCompanyManagement() {
  if (!game || !game.playerCompany) return;
  if (game._companyMgmtMigrating) return;
  game._companyMgmtMigrating = true;
  try {
    const pc = game.playerCompany;
    if (!pc.departments || !pc.departments.length) pc.departments = JSON.parse(JSON.stringify(COMPANY_DEPT_TEMPLATE));
    if (!pc.staff) pc.staff = [];
    if (!pc.projects) pc.projects = [];
    normalizeCompanyIndustriesRaw(pc);
    migrateCompanyIndustries(pc);
    if (!pc.weeklyReports) pc.weeklyReports = [];
    if (!pc.monthlyReports) pc.monthlyReports = [];
    if (!pc.pendingWeeklyReport) pc.pendingWeeklyReport = null;
    if (!pc.pendingMonthlyReport) pc.pendingMonthlyReport = null;
    if (!pc.recruitInbox) pc.recruitInbox = [];
    pc.recruitInbox.forEach(function (cv) {
      if (!cv.status) cv.status = cv.decision || 'pending';
      const post = (pc.jobPosts || []).find(function (p) { return p.id === cv.postId; });
      if (post) recomputeCvScreening(cv, post);
      else if (!cv.resume) enrichCvResume(cv);
    });
    (pc.projects || []).forEach(function (p) {
      if (!p.brandName) p.brandName = p.name || '未命名品牌';
      if (p.brandFamiliarity == null) p.brandFamiliarity = 4;
      if (p.brandInfluence == null) p.brandInfluence = 2;
      if (p.productName && p.productFamiliarity == null) p.productFamiliarity = 3;
      if (p.productName && p.productInfluence == null) p.productInfluence = 1;
      if (!p.tier) p.tier = (p.budget || 0) >= 2000000 ? 'major' : 'minor';
      if (!p.manager && typeof appointProjectManager === 'function') appointProjectManager(p.id, true);
    });
    migrateProjectRoles(pc);
    migrateProjectDetails(pc);
    syncProjectJobPosts(false);
    if (typeof syncExecutiveJobPosts === 'function') syncExecutiveJobPosts(false);
    if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
    if (typeof migrateCompanyGovernanceFull === 'function') migrateCompanyGovernanceFull();
    else if (!pc.equity) {
      pc.equity = { holders: [{ name: '你', pct: 100, votes: 100, id: 'player', chairman: true }] };
    }
    if (typeof migrateCompanyBranches === 'function') migrateCompanyBranches();
    if (typeof migrateCompanyCompetition === 'function') migrateCompanyCompetition();
    if (typeof syncAllPlayerStaffCircles === 'function') syncAllPlayerStaffCircles();
  } finally {
    game._companyMgmtMigrating = false;
  }
}
function renderCompanyEquityHtml() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.equity) return '';
  let h = '<p style="margin-top:10px"><b>股权结构</b></p>';
  (pc.equity.holders || []).forEach(function (x) {
    h += '<div class="fold-meta">' + x.name + ' · ' + x.pct + '% 股权 · ' + x.votes + ' 票' + (x.super ? ' · 超级票' : '') + '</div>';
  });
  return h;
}

function appointProjectManager(projectId, silent) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.projects) return;
  const p = pc.projects.find(function (x) { return x.id === projectId; });
  if (!p || p.manager) return;
  const staff = (pc.staff || []).filter(function (s) { return s.role && (s.role.indexOf('主管') >= 0 || s.role.indexOf('经理') >= 0); });
  const pick = staff.length ? staff[Math.floor(Math.random() * staff.length)] : { name: '空降经理', role: '项目总监' };
  p.manager = pick.name;
  p.managerRole = pick.role || '中层管理';
  p.tier = p.budget >= 2000000 ? 'major' : 'minor';
  if (!silent) addLog('👔 「' + (p.brandName || p.name) + '」任命 ' + p.manager + ' 为' + (p.tier === 'major' ? '大项目' : '周期项目') + '负责人', 'info');
}
function projectDisplayLabel(p) {
  if (!p) return '';
  let s = (p.brandName || p.name || '项目');
  if (p.productName) s += ' · ' + p.productName;
  if (p.manager) s += '（' + p.manager + '）';
  return s;
}
function renameCompanyProjectBrand(projectId) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.projects) return;
  const p = pc.projects.find(function (x) { return x.id === projectId; });
  if (!p) return;
  const brand = prompt('新品牌名称（更名将重置品牌熟悉度 ' + (p.brandFamiliarity || 0) + ' 与影响力 ' + (p.brandInfluence || 0) + '）', p.brandName || p.name || '');
  if (!brand || !brand.trim()) return;
  p.brandName = brand.trim();
  p.brandFamiliarity = 4;
  p.brandInfluence = 2;
  addLog('🏷 项目品牌更名为「' + p.brandName + '」· 熟悉度与影响力已重置', 'info');
  if (typeof updateUI === 'function') updateUI();
}
function renameCompanyProjectProduct(projectId) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.projects) return;
  const p = pc.projects.find(function (x) { return x.id === projectId; });
  if (!p) return;
  const prod = prompt('新产品名称（留空表示无单品；更名将重置产品熟悉度与影响力）', p.productName || '');
  if (prod === null) return;
  p.productName = prod.trim() || null;
  p.productFamiliarity = p.productName ? 3 : 0;
  p.productInfluence = p.productName ? 1 : 0;
  addLog('📦 项目产品' + (p.productName ? '更名为「' + p.productName + '」' : '已清除') + ' · 熟悉度与影响力已重置', 'info');
  if (typeof updateUI === 'function') updateUI();
}
function enrichCvResume(cv, fit, post) {
  if (!cv) return;
  post = post || (game.playerCompany && game.playerCompany.jobPosts || []).find(function (p) { return p.id === cv.postId; });
  if (!fit && post) fit = scoreCvAgainstPost(cv, post);
  const skills = ['Excel', '沟通', '数据分析', '项目管理', '客户谈判', 'Python', '财务建模', '品牌策划'];
  const pick = function () { return skills[Math.floor(Math.random() * skills.length)]; };
  const targetJob = (post && post.careerTitle) || cv.title || '相关';
  cv.resume = cv.resume || {};
  cv.resume.summary = '曾任' + (cv.exp || 1) + '年「' + (cv.lastCareerTitle || targetJob) + '」（' + (cv.careerRank || '普通岗') + '），期望担任' + (cv.title || targetJob) + '。';
  cv.resume.lastJob = ['某中型企业', '创业公司', '上市公司子公司', '行业龙头'][Math.floor(Math.random() * 4)];
  cv.resume.lastTitle = cv.lastCareerTitle || (post && post.careerTitle) || cv.title || '专员';
  cv.resume.skills = cv.resume.skills && cv.resume.skills.length ? cv.resume.skills : [pick(), pick(), pick()];
  cv.resume.salaryExpect = cv.resume.salaryExpect || Math.round(80000 + (cv.exp || 1) * 35000 + careerRankOrder(cv.careerRank || '普通岗') * 80000);
  if (fit) {
    const gapTxt = fit.gaps.length ? fit.gaps.join('；') : '无明显硬伤';
    const proTxt = fit.pros.length ? fit.pros.join('；') : '履历基本对口';
    cv.hrNote = cv.hrRec === 'hire'
      ? ('匹配度 ' + fit.score + '/100 · ' + proTxt + '，建议安排面试。')
      : ('匹配度 ' + fit.score + '/100 · ' + gapTxt + '，建议拒收或储备。');
    cv.mgrNote = cv.mgrRec === 'hire'
      ? ('业务侧认可 · ' + proTxt + (post && post.fromExecutive ? ' · 可补高管空缺' : ' · 可补编制') + '。')
      : ('业务侧不认可 · ' + gapTxt + '。');
  } else if (!cv.hrNote) {
    cv.hrNote = cv.hrRec === 'hire' ? '履历尚可，建议面试。' : '契合度一般，建议拒收。';
    cv.mgrNote = cv.mgrRec === 'hire' ? '部门可接收。' : '团队暂不缺编。';
  }
}
function genCompanyCv(post) {
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const prof = genCompanyCvProfile(post, Math.random);
  const age = 22 + (prof.exp || 1) + Math.floor(Math.random() * 4);
  const name = typeof pickStrangerDisplayName === 'function' ? pickStrangerDisplayName(gender) : '应聘者';
  const cv = {
    id: 'cv_' + game.week + '_' + Math.random().toString(36).slice(2, 8),
    week: game.week, postId: post.id, title: post.title, name: name, age: age, gender: gender,
    edu: prof.edu, exp: prof.exp, careerRank: prof.careerRank, careerExp: prof.careerExp,
    careerCategory: prof.careerCategory, lastCareerTitle: prof.lastCareerTitle,
    read: false, status: 'pending'
  };
  recomputeCvScreening(cv, post);
  return cv;
}
function tickCompanyRecruitmentEnriched() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded || !pc.jobPosts || !pc.jobPosts.length) return;
  migrateCompanyManagement();
  pc.recruitInbox = pc.recruitInbox || [];
  pc.jobPosts.filter(function (p) { return p.active; }).forEach(function (post) {
    const n = 3 + Math.floor(Math.random() * 6);
    for (let i = 0; i < n; i++) pc.recruitInbox.unshift(genCompanyCv(post));
  });
  if (pc.recruitInbox.length > 120) pc.recruitInbox = pc.recruitInbox.slice(0, 120);
}
function findCompanyCv(id) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.recruitInbox) return null;
  return pc.recruitInbox.find(function (x) { return x.id === id; }) || null;
}
function escCvId(id) { return String(id || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }
function recLabel(v) { return v === 'hire' ? '<span style="color:var(--green)">建议录取</span>' : '<span style="color:var(--red)">建议拒收</span>'; }
function openCompanyRecruitInbox() {
  if (!hasPlayerCompany()) { addLog('请先注册公司', 'fail'); return; }
  migrateCompanyManagement();
  companyRecruitFold = {};
  companyRecruitSelectedCvId = null;
  renderCompanyRecruitModal();
  const el = document.getElementById('companyRecruitOverlay');
  if (el) el.classList.remove('hidden');
}
function closeCompanyRecruitInbox() {
  companyRecruitSelectedCvId = null;
  const el = document.getElementById('companyRecruitOverlay');
  if (el) el.classList.add('hidden');
}
function closeCompanyCvReadPane() {
  companyRecruitSelectedCvId = null;
  renderCompanyRecruitModal();
}
function setCompanyRecruitSplitOpen(open) {
  const split = document.getElementById('companyRecruitSplit');
  if (split) split.classList.toggle('with-read', !!open);
}
function toggleCompanyRecruitFold(postId) {
  companyRecruitFold[postId] = !companyRecruitFold[postId];
  renderCompanyRecruitModal();
}
function renderCompanyRecruitModal() {
  const body = document.getElementById('companyRecruitBody');
  const ti = document.getElementById('companyRecruitTitle');
  if (!body || !game || !game.playerCompany) return;
  const pc = game.playerCompany;
  migrateCompanyManagement();
  const pending = (pc.recruitInbox || []).filter(function (c) { return c.status === 'pending'; });
  if (ti) ti.textContent = '📧 招聘邮箱 · 待处理 ' + pending.length + ' 份';
  let h = '<p class="fold-meta" style="margin:0 0 8px">按岗位折叠 · 招聘需求来自项目编制缺口与高管空缺</p>';
  if (!pc.recruitInbox || !pc.recruitInbox.length) {
    h += '<p style="color:var(--muted)">暂无简历';
    if (!(pc.jobPosts || []).filter(function (p) { return p.active; }).length) {
      h += ' · 请先在「公司管理」页签同步缺口招聘或立项';
    }
    h += '</p>';
    body.innerHTML = h; return;
  }
  const byPost = {};
  pc.recruitInbox.forEach(function (cv) {
    const post = (pc.jobPosts || []).find(function (p) { return p.id === cv.postId; });
    const k = post && post.execRoleKey ? ('exec_' + post.execRoleKey) : (post && post.projectId ? ('pj_' + post.projectId + '_' + (post.title || cv.title)) : (cv.postId || 'misc'));
    if (!byPost[k]) {
      const careerLine = post && post.careerTitle ? ' · 需「' + post.careerTitle + '」' + (post.careerCategory ? '（' + post.careerCategory + '）' : '') : '';
      byPost[k] = {
        title: (post && post.projectLabel ? post.projectLabel + ' · ' : '') + (cv.title || post && post.title || '岗位') + careerLine,
        postId: k,
        postMeta: post,
        list: []
      };
    }
    byPost[k].list.push(cv);
  });
  Object.keys(byPost).forEach(function (postId) {
    const grp = byPost[postId];
    const open = !!companyRecruitFold[postId];
    const pend = grp.list.filter(function (c) { return c.status === 'pending'; }).length;
    h += '<div class="company-recruit-post" style="margin-bottom:8px;border:1px solid var(--border);border-radius:8px;overflow:hidden">' +
      '<div class="company-recruit-post-hdr" style="padding:8px 10px;background:var(--bg);cursor:pointer" onclick="toggleCompanyRecruitFold(\'' + escCvId(postId) + '\')">' +
      '<b>' + (open ? '▼' : '▶') + ' ' + grp.title + '</b> <span class="fold-meta">共 ' + grp.list.length + ' 份 · 待处理 ' + pend + '</span>';
    if (grp.postMeta && grp.postMeta.projectDesc) {
      h += '<div class="fold-meta" style="margin-top:3px;font-weight:normal">' + grp.postMeta.projectDesc +
        (grp.postMeta.productName ? ' · 产品：' + grp.postMeta.productName : '') +
        (grp.postMeta.industry ? ' · 行业：' + grp.postMeta.industry : '') + '</div>';
    }
    h += '</div>';
    if (open) {
      h += '<div style="padding:6px 10px 10px">';
      grp.list.forEach(function (cv) {
        const st = cv.status === 'pending' ? '待你决定' : (cv.status === 'hired' ? '已录取' : '已拒收');
        h += '<div class="company-cv-row" style="padding:6px 0;border-bottom:1px dashed var(--border);display:flex;flex-wrap:wrap;gap:6px;align-items:center' + (companyRecruitSelectedCvId === cv.id ? ';background:rgba(163,113,247,.08);border-radius:4px' : '') + '">' +
          '<span>' + (cv.read ? '' : '<span style="color:var(--blue)">●</span> ') + '<b>' + cv.name + '</b> ' + cv.age + '岁 · ' + cv.edu + ' · ' + (cv.careerRank || '—') + ' · ' + cv.exp + '年' +
          (cv.fitScore != null ? ' · 匹配' + cv.fitScore : '') + '</span>' +
          '<span class="fold-meta">' + st + '</span>' +
          '<button type="button" class="btn" style="font-size:.68rem;padding:2px 8px;margin-left:auto" onclick="openCompanyCvDetail(\'' + escCvId(cv.id) + '\')">阅读简历</button></div>';
      });
      h += '</div>';
    }
    h += '</div>';
  });
  body.innerHTML = h;
  setCompanyRecruitSplitOpen(!!companyRecruitSelectedCvId);
  if (companyRecruitSelectedCvId) renderCompanyCvReadPane(companyRecruitSelectedCvId);
}
function renderCompanyCvReadPane(cvId) {
  const cv = findCompanyCv(cvId);
  const body = document.getElementById('companyRecruitReadBody');
  const acts = document.getElementById('companyRecruitReadActions');
  const ti = document.getElementById('companyRecruitReadTitle');
  if (!cv || !body || !acts) return;
  if (ti) ti.textContent = '简历 · ' + cv.name;
  const r = cv.resume || {};
  const skills = (r.skills || []).join('、');
  const post = (game.playerCompany && game.playerCompany.jobPosts || []).find(function (p) { return p.id === cv.postId; });
  let head = '<p><b>' + cv.name + '</b> · ' + cv.age + '岁 · ' + cv.edu + ' · 应聘 <b>' + cv.title + '</b></p>';
  if (post && post.projectLabel) head += '<p class="fold-meta">所属项目：' + post.projectLabel +
    (post.branchLabel ? ' · ' + post.branchLabel : '') + ' · ' + deptNameById(post.deptId) +
    (post.industry ? ' · 行业 ' + post.industry : '') + '</p>';
  if (post && post.careerTitle) head += '<p class="fold-meta">招聘岗位：<b>' + post.title + '</b> → 目标职业「' + post.careerTitle + '」' +
    (post.careerCategory ? '（' + post.careerCategory + '）' : '') + '</p>';
  if (post && post.projectDesc) head += '<p class="fold-meta">' + post.projectDesc + (post.productName ? ' · 产品：' + post.productName : '') + '</p>';
  body.innerHTML = head +
    '<p class="fold-meta">期望年薪 ¥' + (r.salaryExpect || 0).toLocaleString() + ' · ' + cv.exp + '年经验 · 职级 <b>' + (cv.careerRank || '—') + '</b>' +
    (cv.careerExp != null ? '（' + cv.careerExp + '%）' : '') +
    (cv.fitScore != null ? ' · 岗位匹配 <b style="color:' + (cv.fitScore >= 55 ? 'var(--green)' : 'var(--red)') + '">' + cv.fitScore + '/100</b>' : '') + '</p>' +
    (cv.fitGaps && cv.fitGaps.length ? '<p class="fold-meta" style="color:var(--orange)">缺口：' + cv.fitGaps.join('；') + '</p>' : '') +
    '<div style="margin:10px 0;padding:10px;background:var(--bg);border-radius:8px;border:1px solid var(--border);line-height:1.6;font-size:.85rem">' +
    '<p><b>自我介绍</b><br>' + (r.summary || '—') + '</p>' +
    '<p><b>上份工作</b> ' + (r.lastJob || '—') + ' · ' + (r.lastTitle || '') + '</p>' +
    '<p><b>技能</b> ' + (skills || '—') + '</p></div>' +
    '<div style="display:grid;gap:6px;margin:10px 0">' +
    '<div class="fold-meta">👔 HR（林婉儿）：' + recLabel(cv.hrRec) + ' — ' + (cv.hrNote || '') + '</div>' +
    '<div class="fold-meta">🧑‍💼 部门主管：' + recLabel(cv.mgrRec) + ' — ' + (cv.mgrNote || '') + '</div></div>' +
    '<p class="fold-meta" style="color:var(--yellow)">人力与商务可能意见相左；可安排终面三选一后您裁定</p>' +
    (cv.status !== 'pending' ? '<p style="color:var(--muted);margin-top:8px">该简历已处理：' + (cv.status === 'hired' ? '已录取' : '已拒收') + '</p>' : '');
  let btns = '';
  if (cv.status === 'pending') {
    btns += '<button type="button" class="btn" onclick="companyRecruitReject(\'' + escCvId(cv.id) + '\')">拒收</button>';
    btns += '<button type="button" class="btn" onclick="openCompanyInterviewPicker(\'' + escCvId(post ? ('pj_' + post.projectId + '_' + post.title) : (cv.postId || 'misc')) + '\')">终面三选一</button>';
    btns += '<button type="button" class="btn btn-primary" onclick="companyRecruitHire(\'' + escCvId(cv.id) + '\')">直接录取</button>';
  }
  acts.innerHTML = btns;
  setCompanyRecruitSplitOpen(true);
}
function openCompanyCvDetail(cvId) {
  const cv = findCompanyCv(cvId);
  if (!cv) return;
  cv.read = true;
  companyRecruitSelectedCvId = cvId;
  const postId = cv.postId || 'misc';
  companyRecruitFold[postId] = true;
  renderCompanyRecruitModal();
}
function companyRecruitHire(cvId) {
  const cv = findCompanyCv(cvId);
  if (!cv || cv.status !== 'pending') return;
  cv.status = 'hired';
  cv.decisionWeek = game.week;
  const pc = ensurePlayerCompany();
  pc.staff = pc.staff || [];
  const post = (pc.jobPosts || []).find(function (p) { return p.id === cv.postId; });
  if (post && post.fromExecutive && post.execRoleKey && typeof applyBoardExecElection === 'function') {
    applyBoardExecElection(post.execRoleKey, cv.name);
    post.active = false;
    if (typeof syncExecutiveJobPosts === 'function') syncExecutiveJobPosts(false);
    addLog('✅ 任命 ' + cv.name + ' 出任 ' + (post.title || post.execRoleKey.toUpperCase()), 'success');
    renderCompanyRecruitModal();
    if (companyRecruitSelectedCvId === cvId) renderCompanyCvReadPane(cvId);
    if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
    else if (typeof renderDailyPanel === 'function') renderDailyPanel();
    if (typeof updateUI === 'function') updateUI();
    return;
  }
  const dept = (post && post.deptId) || roleToDept(cv.title);
  const proj = post && post.projectId ? (pc.projects || []).find(function (x) { return x.id === post.projectId; }) : null;
  const staff = {
    id: 'st_' + cv.id, cvId: cv.id, name: cv.name, title: cv.title, role: cv.title,
    dept: dept, projectId: post ? post.projectId : null,
    branchId: (post && post.branchId) || (proj && proj.branchId) || (pc.branches && pc.branches[0] && pc.branches[0].id),
    salary: cv.resume && cv.resume.salaryExpect ? cv.resume.salaryExpect : 180000,
    hiredWeek: game.week, performance: 0.5 + Math.random() * 0.5, gossip: ''
  };
  if (typeof initStaffKpi === 'function') initStaffKpi(staff);
  if (typeof ensureCompanyStaffContact === 'function') ensureCompanyStaffContact(staff);
  pc.staff.push(staff);
  maybeAppointDeptHead(staff);
  if (typeof maybeAppointBranchManagerFromStaff === 'function') maybeAppointBranchManagerFromStaff(staff, true);
  if (post && post.projectId) {
    if (proj && (cv.title === '项目经理' || cv.title === '部门主管' || cv.title === '分公司经理') && !proj.manager) {
      proj.manager = cv.name;
      proj.managerRole = cv.title;
    }
  }
  syncProjectJobPosts(false);
  if (typeof syncAllPlayerStaffCircles === 'function') syncAllPlayerStaffCircles();
  addLog('✅ 录取 ' + cv.name + '（' + cv.title + '）· 入职' + deptNameById(dept) + (post && post.projectLabel ? ' · ' + post.projectLabel : '') + ' · 年薪 ¥' + staff.salary.toLocaleString(), 'success');
  renderCompanyRecruitModal();
  if (companyRecruitSelectedCvId === cvId) renderCompanyCvReadPane(cvId);
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
  else if (typeof renderDailyPanel === 'function') renderDailyPanel();
  if (typeof updateUI === 'function') updateUI();
}
function companyRecruitReject(cvId) {
  const cv = findCompanyCv(cvId);
  if (!cv || cv.status !== 'pending') return;
  cv.status = 'rejected';
  cv.decisionWeek = game.week;
  addLog('🚫 拒收 ' + cv.name + ' 的简历', 'info');
  renderCompanyRecruitModal();
}
function renderCompanyOrgChartHtml() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.departments) return '';
  migrateProjectRoles(pc);
  let h = '<div class="company-org-chart" style="font-size:.72rem;line-height:1.55;margin:8px 0;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border)">';
  h += '<b style="display:block;margin-bottom:6px">🏢 组织层级</b>';
  pc.departments.forEach(function (d) {
    const indent = (d.level || 0) * 14;
    const deptStaff = (pc.staff || []).filter(function (s) { return s.dept === d.id; });
    h += '<div style="padding-left:' + indent + 'px">' +
      (d.level > 0 ? '└ ' : '') + '<b>' + d.name + '</b> · ' + d.head +
      (deptStaff.length ? ' <span class="fold-meta">(' + deptStaff.length + '人)</span>' : '') + '</div>';
    if (deptStaff.length) {
      h += '<div style="padding-left:' + (indent + 14) + 'px" class="fold-meta">';
      deptStaff.slice(0, 6).forEach(function (s) {
        h += '· ' + s.name + ' ' + (s.role || '') + '<br>';
      });
      if (deptStaff.length > 6) h += '…等' + deptStaff.length + '人';
      h += '</div>';
    }
    (pc.projects || []).filter(function (p) {
      return (p.deptId || (p.tier === 'major' ? 'biz1' : 'tech')) === d.id && (p.progress || 0) < 100;
    }).forEach(function (p) {
      const tier = p.tier === 'major' ? '大项目' : '周期项目';
      const lead = p.tier === 'major' ? (p.industryDirector || '行业总监') : (p.manager || '项目经理');
      const gapN = (p.roles || []).reduce(function (sum, ro) {
        return sum + Math.max(0, (ro.n || 0) - countStaffOnProjectForRole(p.id, ro.role));
      }, 0);
      h += '<div style="padding-left:' + (indent + 14) + 'px" class="fold-meta">↳ ' + tier + '「' +
        (typeof projectDisplayLabel === 'function' ? projectDisplayLabel(p) : p.name) + '」· ' + lead +
        (p.kpi ? ' · KPI ' + p.kpi.composite : '') +
        (gapN ? ' · <span style="color:var(--orange)">缺' + gapN + '人</span>' : '') + '</div>';
    });
  });
  h += '</div>';
  return h;
}
function tickCompanyStaffGossip() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded || !pc.staff || !pc.staff.length) return;
  if (Math.random() > 0.35) return;
  const a = pc.staff[Math.floor(Math.random() * pc.staff.length)];
  const b = pc.staff[Math.floor(Math.random() * pc.staff.length)];
  if (a.id === b.id) return;
  const gossips = [
    a.name + ' 和 ' + b.name + ' 午饭聊得火热，传要组队接新项目',
    a.name + ' 吐槽 ' + b.name + ' 周报太水，部门里小有摩擦',
    a.name + ' 向 ' + b.name + ' 打听年终奖，风言风语扩散',
    a.name + ' 和 ' + b.name + ' 被看到一起加班，八卦称「黄金搭档」'
  ];
  const g = gossips[Math.floor(Math.random() * gossips.length)];
  a.gossip = g;
  if (pc.pendingWeeklyReport) pc.pendingWeeklyReport.gossip = (pc.pendingWeeklyReport.gossip || []).concat(g).slice(-4);
}
function tickCompanyWeeklyReport() {
  if (!hasPlayerCompany()) return;
  migrateCompanyManagement();
  const pc = game.playerCompany;
  const staff = pc.staff || [];
  let hireDelta = 0;
  staff.forEach(function (s) {
    const perf = s.performance || 0.5;
    const wkGain = Math.round((s.salary / 52) * (perf - 0.45) * 0.15);
    s.weeklyPnL = wkGain;
    hireDelta += wkGain;
  });
  const projects = (pc.projects || []).map(function (p) {
    p.progress = Math.min(100, (p.progress || 0) + 2 + Math.floor(Math.random() * 6));
    if (p.progress > 20 && p.brandFamiliarity != null) p.brandFamiliarity = Math.min(100, p.brandFamiliarity + 1);
    if (p.progress > 40 && p.brandInfluence != null) p.brandInfluence = Math.min(100, p.brandInfluence + 1);
    if (p.productName && p.progress > 30 && p.productFamiliarity != null) p.productFamiliarity = Math.min(100, p.productFamiliarity + 1);
    return { name: projectDisplayLabel(p), progress: p.progress, industry: p.industry, brandName: p.brandName, productName: p.productName };
  });
  pc.pendingWeeklyReport = {
    week: game.week, staffCount: staff.length, hireDelta: hireDelta,
    projects: projects, gossip: []
  };
  if (typeof tickCompanyKpi === 'function') tickCompanyKpi();
  if (pc.staff) {
    pc.staff.forEach(function (s) {
      if (s.gossip && s.gossip.indexOf('KPI') >= 0) {
        pc.pendingWeeklyReport.gossip = (pc.pendingWeeklyReport.gossip || []).concat(s.gossip).slice(-4);
      }
    });
  }
  pc.weeklyReports.unshift(pc.pendingWeeklyReport);
  if (pc.weeklyReports.length > 24) pc.weeklyReports = pc.weeklyReports.slice(0, 24);
  if (typeof enhanceCompanyFinancialReports === 'function') enhanceCompanyFinancialReports();
  if (typeof isAutoLifeSimulating === 'function' && isAutoLifeSimulating()) return;
  if (typeof autoLifeRunning !== 'undefined' && autoLifeRunning) return;
  queueCompanyWeeklyReportModal();
}
function queueCompanyWeeklyReportModal() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.pendingWeeklyReport) return;
  if (typeof showConsumeModalHandlers !== 'function') return;
  const r = pc.pendingWeeklyReport;
  let html = '<p class="fold-meta">第 ' + r.week + ' 周 · 在职 ' + r.staffCount + ' 人</p>';
  html += '<p>招聘人才本周贡献：<b style="color:' + (r.hireDelta >= 0 ? 'var(--green)' : 'var(--red)') + '">' +
    (r.hireDelta >= 0 ? '+' : '') + '¥' + r.hireDelta.toLocaleString() + '</b></p>';
  if (r.projects && r.projects.length) {
    html += '<p style="margin-top:8px"><b>项目进度</b></p>';
    r.projects.forEach(function (p) {
      html += '<div class="fold-meta">' + p.name + '（' + p.industry + '） · ' + p.progress + '%</div>';
    });
  } else html += '<p class="fold-meta">暂无在研项目 · 可在月报中立项</p>';
  if (r.gossip && r.gossip.length) {
    html += '<p style="margin-top:8px"><b>办公室八卦</b></p><p class="fold-meta">' + r.gossip.join('<br>') + '</p>';
  }
  if (r.financeDigest) html += '<p class="fold-meta" style="margin-top:8px"><b>财务高管</b>：' + r.financeDigest + '</p>';
  if (typeof renderCompanyKpiHtml === 'function') html += renderCompanyKpiHtml();
  html += renderCompanyOrgChartHtml();
  showConsumeModalHandlers({
    icon: '📊', title: '公司周报', html: html,
    buttons: [{ text: '知道了', primary: true, handler: function () { pc.pendingWeeklyReport = null; if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } }]
  });
}
function tickCompanyMonthlyReport() {
  if (!hasPlayerCompany()) return;
  migrateCompanyManagement();
  const pc = game.playerCompany;
  let projectRev = 0, projectCost = 0;
  (pc.projects || []).forEach(function (p) {
    const rev = Math.round((p.budget || 500000) * (p.progress || 10) / 100 * (0.08 + Math.random() * 0.12));
    const cost = Math.round((p.budget || 500000) * 0.04 + (p.staffCost || 0));
    p.monthRev = rev; p.monthCost = cost;
    projectRev += rev; projectCost += cost;
  });
  let staffPay = 0;
  (pc.staff || []).forEach(function (s) { staffPay += Math.round((s.salary || 0) / 12); });
  const opsCost = COMPANY_STAFF_MONTHLY + staffPay;
  let stockDelta = 0;
  (pc.holdings || []).forEach(function (h) {
    const st = game.stocks && game.stocks.find(function (x) { return x.symbol === h.symbol; });
    if (st && h.shares) stockDelta += Math.round((st.price - (h.lastPrice || st.price)) * h.shares * 0.02);
  });
  const net = projectRev - projectCost - opsCost + stockDelta;
  game.cash += net;
  if (typeof ledgerAddIncome === 'function' && net > 0) ledgerAddIncome('business', '📊', '公司月报盈余', net);
  else if (typeof ledgerAddExpense === 'function' && net < 0) ledgerAddExpense('business', '📊', '公司月报亏损', -net, false);
  const suggestions = [
    '业务一部主管：建议加码 ' + ((pc.industries || [])[0] || '主营') + ' 赛道',
    '财务总监：控制非项目编制，月费已占 ¥' + opsCost.toLocaleString(),
    'HR：可发布岗位扩招，或立项拉动营收'
  ];
  pc.pendingMonthlyReport = {
    week: game.week, projectRev, projectCost, opsCost, stockDelta, net, suggestions,
    projects: (pc.projects || []).slice()
  };
  pc.monthlyReports.unshift(pc.pendingMonthlyReport);
  if (pc.monthlyReports.length > 12) pc.monthlyReports = pc.monthlyReports.slice(0, 12);
  if (typeof enhanceCompanyFinancialReports === 'function') enhanceCompanyFinancialReports();
  if (typeof isAutoLifeSimulating === 'function' && isAutoLifeSimulating()) return;
  if (typeof autoLifeRunning !== 'undefined' && autoLifeRunning) return;
  queueCompanyMonthlyReportModal();
}
function queueCompanyMonthlyReportModal() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.pendingMonthlyReport) return;
  const r = pc.pendingMonthlyReport;
  let html = '<p>项目营收 <b style="color:var(--green)">¥' + r.projectRev.toLocaleString() + '</b> · 项目支出 ¥' + r.projectCost.toLocaleString() + '</p>' +
    '<p>运营开支 ¥' + r.opsCost.toLocaleString() + (r.stockDelta ? ' · 持股波动 ' + (r.stockDelta >= 0 ? '+' : '') + '¥' + r.stockDelta.toLocaleString() : '') + '</p>' +
    '<p style="margin-top:8px">本月净利 <b style="color:' + (r.net >= 0 ? 'var(--green)' : 'var(--red)') + '">' +
    (r.net >= 0 ? '+' : '') + '¥' + r.net.toLocaleString() + '</b></p>';
  if (r.projects && r.projects.length) {
    html += '<p style="margin-top:8px"><b>项目明细</b></p>';
    r.projects.forEach(function (p) {
      html += '<div class="fold-meta">' + projectDisplayLabel(p) + ' · 进度' + (p.progress || 0) + '% · 本月 +' + (p.monthRev || 0).toLocaleString() + ' / -' + (p.monthCost || 0).toLocaleString() +
        (p.brandFamiliarity != null ? ' · 品牌熟悉' + p.brandFamiliarity + '/影响' + p.brandInfluence : '') +
        (p.productName ? ' · 产品熟悉' + (p.productFamiliarity || 0) + '/影响' + (p.productInfluence || 0) : '') + '</div>';
    });
  }
  html += '<p style="margin-top:10px"><b>高管建议</b></p><p class="fold-meta">' + (r.suggestions || []).join('<br>') + '</p>';
  if (r.financeDigest) html += '<p class="fold-meta" style="margin-top:6px"><b>财务财报</b>：' + r.financeDigest + '</p>';
  if (typeof renderCompanyKpiHtml === 'function') html += renderCompanyKpiHtml();
  html += renderCompanyOrgChartHtml();
  html += typeof renderCompanyEquityHtml === 'function' ? renderCompanyEquityHtml() : '';
  if (pc.board) {
    ensureBoardExecState();
    html += '<p style="margin-top:10px"><b>董事会</b> · 你持股 ' + (pc.board.playerShares || getPlayerVotePct() || 100) + '%' +
      (pc.board.chairmanVeto && isPlayerChairman && isPlayerChairman() ? ' · 董事长否决权' : '') + '</p>';
    if (pc.board.execs) {
      html += '<p class="fold-meta">CEO ' + (pc.board.execs.ceo || '你') +
        ' · 财务 ' + (pc.board.execs.cfo || '—') + ' · 人力 ' + (pc.board.execs.hr || '—') +
        ' · 商务 ' + (pc.board.execs.biz || '—') + ' · 技术 ' + (pc.board.execs.cto || '—') +
        ' · 运营 ' + (pc.board.execs.ops || '—') + ' · 市场 ' + (pc.board.execs.cmo || '—') + '</p>';
    }
    if (pc.board.pendingVote) {
      const pv = pc.board.pendingVote;
      html += '<p class="fold-meta" style="color:var(--orange)">待表决：' + pv.topic +
        (pv.candidate ? ' · 提名 ' + pv.candidate : '') + '</p>';
    }
  }
  html += '<p class="fold-meta" style="margin-top:8px">可新开行业（¥' + (NEW_INDUSTRY_COST / 10000) + '万）或立项并选配编制</p>';
  const buttons = [
    { text: '新开行业', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); promptNewIndustry(); } },
    { text: '新立项', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); promptNewCompanyProject(); } }
  ];
  if (typeof openBoardExecVoteMenu === 'function') {
    buttons.unshift({ text: '高管改选', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); openBoardExecVoteMenu(); } });
  } else if (typeof startBoardVote === 'function') {
    buttons.unshift({ text: '发起表决', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); startBoardVote('高管改选'); } });
  }
  if (pc.board && pc.board.pendingVote) {
    const resolveFn = pc.board.pendingVote.roleKey && typeof resolveBoardExecVote === 'function'
      ? resolveBoardExecVote
      : (typeof resolveBoardVote === 'function' ? resolveBoardVote : null);
    if (resolveFn) {
      buttons.unshift({ text: '否决(超级票)', handler: function () { resolveFn(false); pc.pendingMonthlyReport = null; if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
      buttons.unshift({ text: '赞成', handler: function () { resolveFn(true); pc.pendingMonthlyReport = null; if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
    }
  }
  buttons.push({ text: '知道了', primary: true, handler: function () { pc.pendingMonthlyReport = null; if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '📈', title: '公司月报 · ' + getDateStr(game.week), html: html,
      buttons: buttons
    });
  }
}
function promptNewIndustry() {
  if (!hasPlayerCompany()) return;
  const pc = game.playerCompany;
  const list = sanitizeCompanyIndustries(pc);
  if (list.length >= COMPANY_GENERAL_INDUSTRY_MIN - 1) {
    if (!confirm('再拓展一个行业后，公司将显示为「综合」型企业（已布局 ' + list.length + ' 个行业），继续？')) return;
  }
  if (game.cash < NEW_INDUSTRY_COST) { addLog('现金不足', 'fail'); return; }
  openCompanyIndustryPicker({
    title: '拓展新行业',
    hint: '一次选择一个行业 · 费用 ¥' + NEW_INDUSTRY_COST.toLocaleString() + ' · 已有：' + (list.length ? list.join('、') : '无'),
    pc: pc,
    onPick: function (pick) {
      if (game.cash < NEW_INDUSTRY_COST) { addLog('现金不足', 'fail'); return; }
      game.cash -= NEW_INDUSTRY_COST;
      addCompanyIndustry(pc, pick);
      if (typeof ledgerAddExpense === 'function') ledgerAddExpense('business', '🏭', '拓展行业·' + pick, NEW_INDUSTRY_COST, false);
      addLog('🏭 拓展行业：' + pick + (sanitizeCompanyIndustries(pc).length >= COMPANY_GENERAL_INDUSTRY_MIN ? ' · 已成为综合型企业' : ''), 'success');
      if (typeof updateUI === 'function') updateUI();
    }
  });
}
function promptNewCompanyProject() {
  if (!hasPlayerCompany()) return;
  migrateCompanyManagement();
  const brand = prompt('品牌名称（对外经营品牌）', '新锐品牌' + ((game.playerCompany.projects || []).length + 1));
  if (!brand || !brand.trim()) return;
  const productRaw = prompt('产品名称（可选，留空则按行业自动生成）', '');
  const productName = productRaw && productRaw.trim() ? productRaw.trim() : null;
  const name = prompt('项目内部名称（如「华东渠道拓展」）', brand.trim() + '业务线');
  if (!name) return;
  const descRaw = prompt('项目说明（可选，留空则按行业自动生成）', '');
  let schemeHtml = '选择人员编制方案：\n1 精干小队\n2 标准编制\n3 重投入\n4 暂不立项';
  const choice = prompt(schemeHtml, '2');
  if (!choice || choice === '4') return;
  const keys = ['lean', 'standard', 'heavy'];
  const key = keys[(parseInt(choice, 10) || 2) - 1] || 'standard';
  const scheme = NEW_PROJECT_SCHEMES[key];
  let budget = 800000;
  (scheme.roles || []).forEach(function (ro) { budget += ro.n * 120000; });
  if (game.cash < budget * 0.2) { addLog('立项需至少 ¥' + Math.round(budget * 0.2).toLocaleString() + ' 启动金', 'fail'); return; }
  game.cash -= Math.round(budget * 0.2);
  const pc = game.playerCompany;
  pc.projects = pc.projects || [];
  pc.projects.push({
    id: 'pj_' + game.week + '_' + pc.projects.length,
    name: name, brandName: brand.trim(), productName: productName,
    brandFamiliarity: 4, brandInfluence: 2,
    productFamiliarity: productName ? 3 : 0, productInfluence: productName ? 1 : 0,
    industry: getCompanyPrimaryIndustry(pc) || inferPlayerCompanyIndustry() || '信息技术',
    scheme: key, schemeLabel: scheme.label, roles: scheme.roles,
    budget: budget, progress: 5, staffCost: Math.round(budget * 0.08), startWeek: game.week,
    tier: budget >= 2000000 ? 'major' : 'minor', deptId: budget >= 2000000 ? 'biz1' : 'tech',
    branchId: (pc.branches && pc.branches[0] && pc.branches[0].id) || null
  });
  const newPj = pc.projects[pc.projects.length - 1];
  if (productName) newPj._productUserSet = true;
  if (descRaw && descRaw.trim()) newPj.desc = descRaw.trim();
  enrichProjectMeta(newPj);
  if (typeof initProjectKpi === 'function') initProjectKpi(newPj);
  if (typeof appointProjectManager === 'function') appointProjectManager(newPj.id);
  if (typeof appointBranchProjectLead === 'function') appointBranchProjectLead(newPj);
  const bindId = prompt('绑定挚友理想项目？输入联系人姓名（留空跳过）', '');
  if (bindId && bindId.trim()) {
    const contact = (game.contacts || []).find(function (c) { return c.name === bindId.trim() || (c.name && c.name.indexOf(bindId.trim()) >= 0); });
    if (contact && typeof linkCompanyProjectToIdeal === 'function') linkCompanyProjectToIdeal(newPj.id, contact.id);
  }
  addLog('🚀 立项「' + projectDisplayLabel(newPj) + '」· 方案：' + scheme.label + ' · 启动金已付', 'success');
  syncProjectJobPosts(true);
  if (typeof updateUI === 'function') updateUI();
}
function tickCompanyBrandGrowth() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded || !pc.name) return;
  if (pc.familiarity != null && Math.random() < 0.45) pc.familiarity = Math.min(100, pc.familiarity + 1);
  if (pc.influence != null && pc.influence < pc.familiarity && Math.random() < 0.25) pc.influence = Math.min(100, pc.influence + 1);
}
function tickCompanyManagementWeekly() {
  syncProjectJobPosts(false);
  if (typeof tickCompanyRecruitmentEnriched === 'function') tickCompanyRecruitmentEnriched();
  else if (typeof tickCompanyRecruitment === 'function') tickCompanyRecruitment();
  tickCompanyStaffGossip();
  tickCompanyBrandGrowth();
  tickCompanyWeeklyReport();
  if (typeof tickCompanyStrategyDaily === 'function') tickCompanyStrategyDaily();
  if (typeof tickCompanyBranchesWeekly === 'function') tickCompanyBranchesWeekly();
  if (typeof tickIndustryCompetitionWeekly === 'function') tickIndustryCompetitionWeekly();
}
function tickCompanyManagementMonthly() {
  if (typeof tickCompanyBranchesMonthly === 'function') tickCompanyBranchesMonthly();
  if (typeof tickPrivateJetAnnual === 'function') tickPrivateJetAnnual();
  tickCompanyMonthlyReport();
}
