/* 公司中层编制 · KPI 考核 — 由 build.js 注入（在 company-management 之后） */
const ROLE_LEVEL_MAP = {
  '首席执行官': 0, 'CEO': 0, '总裁': 0,
  '财务总监': 1, 'CFO': 1, '人力总监': 1, 'HR': 1, '技术总监': 1, 'CTO': 1, '商务总裁': 1,
  '行业总监': 2, '部门主管': 2, '运营主管': 2, '业务总监': 2, '分公司经理': 2, '区域经理': 2, '城市经理': 2,
  '项目经理': 3, '产品经理': 3, '项目总监': 3,
  '小组长': 4, '研发工程师': 5, '市场专员': 5, '客户成功': 5, '财务分析': 5, '品牌策划': 5
};

function inferRoleLevel(role) {
  if (!role) return 5;
  const keys = Object.keys(ROLE_LEVEL_MAP);
  for (let i = 0; i < keys.length; i++) {
    if (role.indexOf(keys[i]) >= 0) return ROLE_LEVEL_MAP[keys[i]];
  }
  if (role.indexOf('主管') >= 0 || role.indexOf('总监') >= 0) return 2;
  if (role.indexOf('经理') >= 0) return 3;
  return 5;
}

function initStaffKpi(staff) {
  if (!staff) return;
  if (staff.kpi == null) staff.kpi = 68 + Math.floor(Math.random() * 22);
  if (staff.kpiTarget == null) staff.kpiTarget = 80;
  staff.role = staff.role || staff.title || '专员';
  if (staff.roleLevel == null) staff.roleLevel = inferRoleLevel(staff.role);
  if (!staff.dept) staff.dept = staff.roleLevel <= 2 ? 'biz1' : 'tech';
}

function initProjectKpi(p) {
  if (!p) return;
  if (!p.kpi) p.kpi = { delivery: 45, budget: 50, morale: 55, composite: 50 };
  if (!p.tier) p.tier = (p.budget || 0) >= 2000000 ? 'major' : 'minor';
  if (!p.deptId) p.deptId = p.tier === 'major' ? 'biz1' : 'tech';
}

function migrateCompanyKpi() {
  if (!game || !game.playerCompany || !game.playerCompany.founded) return;
  if (typeof migrateCompanyManagement === 'function') migrateCompanyManagement();
  const pc = game.playerCompany;
  (pc.staff || []).forEach(initStaffKpi);
  (pc.projects || []).forEach(function (p) {
    initProjectKpi(p);
    if (!p.managerStaffId && p.manager) {
      const mgr = (pc.staff || []).find(function (s) { return s.name === p.manager; });
      if (mgr) p.managerStaffId = mgr.id;
    }
    if (!p.manager && typeof appointProjectManager === 'function') appointProjectManager(p.id, true);
  });
  assignProjectHierarchy();
  if (typeof ensureBoardExecState === 'function') ensureBoardExecState();
}

function findStaffById(id) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.staff) return null;
  return pc.staff.find(function (s) { return s.id === id; }) || null;
}

function deptHeadName(deptId) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.departments) return '（待任命）';
  const d = pc.departments.find(function (x) { return x.id === deptId; });
  return d ? d.head : '（待任命）';
}

function assignProjectHierarchy() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.projects) return;
  const directors = (pc.staff || []).filter(function (s) { return s.roleLevel <= 2; });
  const managers = (pc.staff || []).filter(function (s) { return s.roleLevel === 3; });
  pc.projects.forEach(function (p) {
    if (p.tier === 'major') {
      const br = typeof getBranchById === 'function' ? getBranchById(p.branchId) : null;
      if (br && br.managerStaffId) {
        const bm = findStaffById(br.managerStaffId);
        if (bm) {
          p.manager = bm.name;
          p.managerStaffId = bm.id;
          p.managerRole = bm.role || '分公司经理';
          p.industryDirector = typeof getExecDisplayName === 'function' ? getExecDisplayName('biz') : deptHeadName('biz_exec');
          p.industryDirectorStaffId = null;
          return;
        }
      }
      p.industryDirector = p.industryDirector || deptHeadName(p.deptId || 'biz1');
      const dir = directors.find(function (s) { return s.dept === (p.deptId || 'biz1'); }) ||
        directors[Math.floor(Math.random() * Math.max(1, directors.length))];
      if (dir) {
        p.industryDirectorStaffId = dir.id;
        p.industryDirector = dir.name;
      }
    } else {
      const mgr = managers.find(function (s) { return s.dept === (p.deptId || 'tech'); }) ||
        managers[Math.floor(Math.random() * Math.max(1, managers.length))];
      if (mgr && !p.managerStaffId) {
        p.managerStaffId = mgr.id;
        p.manager = mgr.name;
        p.managerRole = mgr.role;
      }
    }
  });
}

function compositeKpi(kpi) {
  if (!kpi) return 50;
  if (kpi.composite != null) return kpi.composite;
  return Math.round((kpi.delivery || 0) * 0.45 + (kpi.budget || 0) * 0.3 + (kpi.morale || 0) * 0.25);
}

function kpiColor(v, target) {
  if (v >= (target || 80)) return 'var(--green)';
  if (v >= (target || 80) - 12) return 'var(--orange)';
  return 'var(--red)';
}

function tickCompanyKpi() {
  if (typeof hasPlayerCompany === 'function' && !hasPlayerCompany()) return;
  migrateCompanyKpi();
  const pc = game.playerCompany;
  (pc.projects || []).forEach(function (p) {
    const mgr = findStaffById(p.managerStaffId);
    const dir = findStaffById(p.industryDirectorStaffId);
    const mgrBoost = mgr ? (mgr.kpi || 70) / 100 : 0.72;
    const dirBoost = p.tier === 'major' && dir ? (dir.kpi || 70) / 100 : 1;
    const weeksElapsed = Math.max(1, game.week - (p.startWeek || game.week));
    const expected = Math.min(95, 10 + weeksElapsed * 4);
    const actual = p.progress || 0;
    p.kpi.delivery = Math.round(Math.min(100, (actual / Math.max(expected, 1)) * 85 * mgrBoost * dirBoost));
    p.kpi.budget = Math.round(Math.min(100, 100 - (p.monthCost || 0) / Math.max(p.budget || 1, 1) * 40));
    p.kpi.morale = Math.round(Math.min(100, 50 + ((mgr && mgr.kpi) || 70) * 0.35));
    p.kpi.composite = compositeKpi(p.kpi);
    if (p.kpi.composite < 55 && Math.random() < 0.2 && pc.pendingWeeklyReport) {
      pc.pendingWeeklyReport.gossip = (pc.pendingWeeklyReport.gossip || []).concat(
        '项目「' + (p.brandName || p.name) + '」KPI 预警 · 综合 ' + p.kpi.composite
      ).slice(-5);
    }
  });
  (pc.staff || []).forEach(function (s) {
    const delta = Math.random() < 0.55 ? 1 : -1;
    const proj = (pc.projects || []).find(function (p) { return p.managerStaffId === s.id; });
    if (proj && proj.kpi) s.kpi = Math.max(40, Math.min(100, (s.kpi || 70) + delta * (proj.kpi.composite > 75 ? 2 : 1)));
    else s.kpi = Math.max(40, Math.min(100, (s.kpi || 70) + delta));
    if ((s.kpi || 0) < (s.kpiTarget || 80) - 15 && Math.random() < 0.12) {
      s.gossip = s.name + ' KPI 连续偏低，主管约谈中';
    }
  });
}

function renderCompanyKpiHtml() {
  const pc = game && game.playerCompany;
  if (!pc || !pc.founded) return '';
  migrateCompanyKpi();
  let h = '<div style="margin:8px 0;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.72rem">';
  h += '<b>📊 编制 KPI</b>';
  const staff = (pc.staff || []).slice(0, 8);
  if (staff.length) {
    h += '<p class="fold-meta" style="margin:6px 0 4px">中层/骨干考核（目标 80）</p>';
    staff.forEach(function (s) {
      h += '<div>' + s.name + ' · ' + (s.role || s.title || '员工') +
        ' · KPI <b style="color:' + kpiColor(s.kpi, s.kpiTarget) + '">' + Math.round(s.kpi) + '</b>/' + s.kpiTarget + '</div>';
    });
    if ((pc.staff || []).length > 8) h += '<div class="fold-meta">…另有 ' + ((pc.staff || []).length - 8) + ' 人</div>';
  } else {
    h += '<p class="fold-meta">暂无在职员工 KPI · 招聘或立项后生成编制</p>';
  }
  const projs = (pc.projects || []).filter(function (p) { return (p.progress || 0) < 100; }).slice(0, 4);
  if (projs.length) {
    h += '<p class="fold-meta" style="margin:8px 0 4px">在研项目综合 KPI</p>';
    projs.forEach(function (p) {
      const label = typeof projectDisplayLabel === 'function' ? projectDisplayLabel(p) : (p.name || '项目');
      const tier = p.tier === 'major' ? '大项目·' + (p.industryDirector || '行业总监') : '周期·' + (p.manager || '经理');
      h += '<div>' + label + ' <span class="fold-meta">(' + tier + ')</span> · ' +
        '<b style="color:' + kpiColor(p.kpi.composite, 70) + '">' + p.kpi.composite + '</b>' +
        ' 交付' + p.kpi.delivery + '/预算' + p.kpi.budget + '/士气' + p.kpi.morale + '</div>';
    });
  }
  h += '</div>';
  return h;
}
