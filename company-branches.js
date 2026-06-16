/* 城市分公司 · 中层管理 — 由 build.js 注入 */
const BRANCH_OPEN_BASE_COST = 1500000;
const BRANCH_MONTHLY_OPS = 60000;
const BRANCH_STAFF_OVERHEAD = 4500;
const BRANCH_MANAGER_ROLES = /分公司经理|区域经理|部门主管|业务总监|城市经理/;

function getCompanyHqCity() {
  const pc = game && game.playerCompany;
  if (pc && pc.hqCity) return pc.hqCity;
  if (game && game.playerCity) return game.playerCity;
  return typeof PLAYER_HOME_CITY !== 'undefined' ? PLAYER_HOME_CITY : '杭州';
}

function branchCityPool() {
  const cities = typeof CITIES !== 'undefined' ? CITIES.slice() : ['北京', '上海', '深圳', '广州', '杭州', '成都', '武汉', '南京'];
  return cities;
}

function migrateCompanyBranches() {
  if (!game || !game.playerCompany || !game.playerCompany.founded) return;
  const pc = game.playerCompany;
  if (!pc.hqCity) pc.hqCity = getCompanyHqCity();
  if (!pc.branches || !pc.branches.length) {
    pc.branches = [createBranchRecord(pc.hqCity, true)];
  }
  ensureHqBranch(pc);
  (pc.branches || []).forEach(function (br) {
    if (!br.kpi) br.kpi = { delivery: 55, morale: 58, composite: 56 };
    if (br.monthlyOps == null) br.monthlyOps = BRANCH_MONTHLY_OPS;
    if (!br.name) br.name = br.isHQ ? '总部（' + br.city + '）' : br.city + '分公司';
  });
  (pc.staff || []).forEach(function (s) {
    if (!s.branchId) s.branchId = pc.branches[0].id;
    if (BRANCH_MANAGER_ROLES.test(s.role || s.title || '') && s.branchId) {
      maybeAppointBranchManagerFromStaff(s, true);
    }
  });
  (pc.projects || []).forEach(function (p) {
    if (!p.branchId) p.branchId = pc.branches[0].id;
    if (p.tier === 'major' && !p.manager && typeof appointBranchProjectLead === 'function') {
      appointBranchProjectLead(p);
    }
  });
  syncBranchStaffCounts(pc);
}

function createBranchRecord(city, isHQ) {
  const coName = (game && game.playerCompany && (game.playerCompany.brandName || game.playerCompany.name)) || '公司';
  return {
    id: (isHQ ? 'br_hq_' : 'br_') + String(city).replace(/\s/g, '') + '_' + ((game && game.week) || 0),
    city: city,
    isHQ: !!isHQ,
    name: isHQ ? coName + '总部（' + city + '）' : city + '分公司',
    manager: isHQ ? '你' : '（待任命）',
    managerStaffId: null,
    managerRole: isHQ ? '负责人' : '分公司经理',
    openWeek: (game && game.week) || 0,
    monthlyOps: BRANCH_MONTHLY_OPS,
    staffCount: 0,
    projectCount: 0,
    kpi: { delivery: 58, morale: 60, composite: 59 }
  };
}

function ensureHqBranch(pc) {
  const hq = pc.hqCity || getCompanyHqCity();
  let hqBr = (pc.branches || []).find(function (b) { return b.isHQ || b.city === hq; });
  if (!hqBr) {
    hqBr = createBranchRecord(hq, true);
    pc.branches.unshift(hqBr);
  }
  hqBr.isHQ = true;
  hqBr.city = hq;
  if (!hqBr.name || hqBr.name.indexOf('总部') < 0) {
    hqBr.name = ((pc.brandName || pc.name || '公司') + '总部（' + hq + '）');
  }
  return hqBr;
}

function getBranchById(id) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.branches) return null;
  return pc.branches.find(function (b) { return b.id === id; }) || null;
}

function getBranchByCity(city) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.branches) return null;
  return pc.branches.find(function (b) { return b.city === city; }) || null;
}

function syncBranchStaffCounts(pc) {
  if (!pc || !pc.branches) return;
  pc.branches.forEach(function (br) {
    br.staffCount = (pc.staff || []).filter(function (s) { return s.branchId === br.id; }).length;
    br.projectCount = (pc.projects || []).filter(function (p) { return p.branchId === br.id && (p.progress || 0) < 100; }).length;
  });
}

function branchOpenCost(city) {
  const tier1 = ['北京', '上海', '深圳', '广州'];
  const tier2 = ['杭州', '成都', '武汉', '南京', '苏州', '天津', '重庆'];
  let mult = 1;
  if (tier1.indexOf(city) >= 0) mult = 1.45;
  else if (tier2.indexOf(city) >= 0) mult = 1.15;
  if (city === getCompanyHqCity()) mult = 0.85;
  return Math.round(BRANCH_OPEN_BASE_COST * mult);
}

function listAvailableBranchCities() {
  migrateCompanyBranches();
  const pc = game.playerCompany;
  const have = {};
  (pc.branches || []).forEach(function (b) { have[b.city] = true; });
  return branchCityPool().filter(function (c) { return !have[c]; });
}

function openBranchCityPicker() {
  if (!hasPlayerCompany()) return;
  migrateCompanyBranches();
  const avail = listAvailableBranchCities();
  if (!avail.length) { addLog('已在全国主要城市布局分公司', 'warn'); return; }
  let html = '<p class="fold-meta">在不同城市设立分公司，任命<b>中层主管/分公司经理</b>就地管理项目与团队。</p>';
  avail.slice(0, 14).forEach(function (city) {
    const cost = branchOpenCost(city);
    const leg = typeof getTravelLeg === 'function' ? getTravelLeg(getPlayerCurrentCity(), city) : null;
    html += '<button type="button" class="btn" style="display:block;width:100%;margin:6px 0" onclick="foundCompanyBranch(\'' +
      String(city).replace(/'/g, "\\'") + '\')">' + city + '分公司 · 开办 ¥' + cost.toLocaleString() +
      (leg ? ' · 驾车单程约 ' + leg.oneWayDriveHours + 'h' : '') + '</button>';
  });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '🏙', title: '开拓分公司',
      html: html,
      buttons: [{ text: '取消', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } }]
    });
  }
}

function foundCompanyBranch(city) {
  if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  if (!hasPlayerCompany() || !city) return;
  migrateCompanyBranches();
  if (getBranchByCity(city)) { addLog(city + ' 已有分公司', 'warn'); return; }
  const cost = branchOpenCost(city);
  if (game.cash < cost) { addLog('开办 ' + city + ' 分公司需 ¥' + cost.toLocaleString(), 'fail'); return; }
  if (!confirm('设立「' + city + '分公司」？\n一次性开办费 ¥' + cost.toLocaleString() + '\n月运营费约 ¥' + BRANCH_MONTHLY_OPS.toLocaleString())) return;
  game.cash -= cost;
  if (typeof ledgerAddExpense === 'function') ledgerAddExpense('business', '🏙', '开办' + city + '分公司', cost, false);
  const pc = game.playerCompany;
  const br = createBranchRecord(city, false);
  pc.branches.push(br);
  if (typeof pickBranchRivals === 'function') br.rivals = pickBranchRivals(city, 3);
  autoAssignBranchManager(br);
  addLog('🏙 ' + city + '分公司成立 · 请任命或招聘分公司经理', 'success');
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
  if (typeof updateUI === 'function') updateUI();
}

function listBranchManagerCandidates(branchId) {
  const pc = game.playerCompany;
  return (pc.staff || []).filter(function (s) {
    if (s.branchId && s.branchId !== branchId) return false;
    const lvl = s.roleLevel != null ? s.roleLevel : (typeof inferRoleLevel === 'function' ? inferRoleLevel(s.role || s.title) : 5);
    return lvl <= 3 || BRANCH_MANAGER_ROLES.test(s.role || s.title || '');
  });
}

function autoAssignBranchManager(br) {
  if (!br || br.managerStaffId) return;
  const candidates = listBranchManagerCandidates(br.id);
  const pick = candidates.find(function (s) { return BRANCH_MANAGER_ROLES.test(s.role || s.title || ''); }) ||
    candidates.find(function (s) { return (s.roleLevel != null ? s.roleLevel : 5) <= 2; });
  if (pick) appointBranchManager(br.id, pick.id, true);
}

function appointBranchManager(branchId, staffId, silent) {
  const pc = game.playerCompany;
  const br = getBranchById(branchId);
  const st = (pc.staff || []).find(function (s) { return s.id === staffId; });
  if (!br || !st) return;
  br.manager = st.name;
  br.managerStaffId = st.id;
  br.managerRole = st.role || st.title || '分公司经理';
  st.branchId = branchId;
  st.role = st.role || st.title;
  if (!BRANCH_MANAGER_ROLES.test(st.role)) st.role = br.isHQ ? '部门主管' : '分公司经理';
  if (st.roleLevel == null || st.roleLevel > 2) st.roleLevel = 2;
  if (!silent) addLog('👔 任命 ' + st.name + ' 为「' + br.name + '」负责人', 'success');
  syncBranchStaffCounts(pc);
}

function maybeAppointBranchManagerFromStaff(staff, silent) {
  if (!staff || !staff.branchId) return;
  const br = getBranchById(staff.branchId);
  if (!br) return;
  const isMgrRole = BRANCH_MANAGER_ROLES.test(staff.role || staff.title || '');
  const lvl = staff.roleLevel != null ? staff.roleLevel : (typeof inferRoleLevel === 'function' ? inferRoleLevel(staff.role || staff.title) : 5);
  if (!isMgrRole && lvl > 2) return;
  if (!br.managerStaffId || br.manager === '（待任命）' || br.manager.indexOf('待任命') >= 0) {
    appointBranchManager(br.id, staff.id, silent);
  }
}

function openBranchManagerPicker(branchId) {
  const br = getBranchById(branchId);
  if (!br) return;
  const candidates = listBranchManagerCandidates(branchId);
  if (!candidates.length) {
    addLog('暂无可用中层，请先招聘部门主管或分公司经理', 'warn');
    return;
  }
  let html = '<p class="fold-meta">为 <b>' + br.name + '</b> 任命负责人（中层向商务高管汇报）</p>';
  const buttons = candidates.map(function (s) {
    return {
      text: s.name + ' · ' + (s.role || s.title),
      handler: function () {
        appointBranchManager(branchId, s.id);
        if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
        if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
      }
    };
  });
  buttons.push({ text: '取消', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '👔', title: '任命分公司负责人', html: html, buttons: buttons });
  }
}

function appointBranchProjectLead(project) {
  if (!project || !project.branchId) return;
  const br = getBranchById(project.branchId);
  if (!br) return;
  if (br.managerStaffId && !project.managerStaffId) {
    const mgr = (game.playerCompany.staff || []).find(function (s) { return s.id === br.managerStaffId; });
    if (mgr) {
      project.manager = mgr.name;
      project.managerStaffId = mgr.id;
      project.managerRole = mgr.role || '分公司经理';
      project.industryDirector = typeof getExecDisplayName === 'function' ? getExecDisplayName('biz') : '商务高管';
    }
  }
}

function tickCompanyBranchesWeekly() {
  if (!hasPlayerCompany()) return;
  migrateCompanyBranches();
  const pc = game.playerCompany;
  syncBranchStaffCounts(pc);
  (pc.branches || []).forEach(function (br) {
    const projs = (pc.projects || []).filter(function (p) { return p.branchId === br.id; });
    if (!projs.length) return;
    let del = 0, n = 0;
    projs.forEach(function (p) {
      if (p.kpi && p.kpi.delivery != null) { del += p.kpi.delivery; n++; }
      else del += p.progress || 0;
      n++;
    });
    const mgr = br.managerStaffId ? (pc.staff || []).find(function (s) { return s.id === br.managerStaffId; }) : null;
    const mgrK = mgr ? (mgr.kpi || 70) : 62;
    br.kpi.delivery = Math.round(del / Math.max(1, n));
    br.kpi.morale = Math.round(Math.min(100, 48 + mgrK * 0.4 + br.staffCount * 0.5));
    br.kpi.composite = Math.round(br.kpi.delivery * 0.55 + br.kpi.morale * 0.45);
    if (br.kpi.composite < 52 && Math.random() < 0.25 && pc.pendingWeeklyReport) {
      pc.pendingWeeklyReport.gossip = (pc.pendingWeeklyReport.gossip || []).concat(
        br.name + ' KPI 偏低（' + br.kpi.composite + '），' + (br.manager || '负责人') + ' 请求总部支援'
      ).slice(-4);
    }
  });
}

function tickCompanyBranchesMonthly() {
  if (!hasPlayerCompany()) return;
  migrateCompanyBranches();
  const pc = game.playerCompany;
  let total = 0;
  (pc.branches || []).forEach(function (br) {
    if (br.isHQ) return;
    const ops = (br.monthlyOps || BRANCH_MONTHLY_OPS) + (br.staffCount || 0) * BRANCH_STAFF_OVERHEAD;
    br.lastMonthOps = ops;
    total += ops;
  });
  if (total > 0) {
    game.cash -= total;
    if (typeof ledgerAddExpense === 'function') ledgerAddExpense('business', '🏙', '分公司运营费', total, false);
    addLog('🏙 分公司月运营费 ¥' + total.toLocaleString(), 'info');
  }
  return total;
}

function branchLabel(branchId) {
  const br = getBranchById(branchId);
  return br ? (br.isHQ ? br.city + '总部' : br.city + '分公司') : '—';
}

function renderCompanyBranchesHtml() {
  if (!hasPlayerCompany()) return '';
  migrateCompanyBranches();
  const pc = game.playerCompany;
  const avail = listAvailableBranchCities().length;
  let h = '<div class="company-mgmt-section" style="margin-top:8px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.72rem;line-height:1.5">';
  h += '<b>🏙 城市分公司</b> <span class="fold-meta">· 总部 ' + pc.hqCity + ' · 中层就地管理</span>';
  h += '<div style="margin-top:4px">';
  if (avail) {
    h += '<button class="btn" style="font-size:.68rem;margin:2px 4px 2px 0" onclick="openBranchCityPicker()">＋ 开拓分公司（' + avail + '城可选）</button>';
  }
  h += '</div>';
  (pc.branches || []).forEach(function (br) {
    const kpi = br.kpi || {};
    const kColor = typeof kpiColor === 'function' ? kpiColor(kpi.composite || 50, 60) : 'var(--muted)';
    h += '<div style="margin-top:8px;padding-top:6px;border-top:1px dashed var(--border)">';
    h += '<b>' + (br.isHQ ? '🏛 ' : '📍 ') + br.name + '</b>';
    h += ' <span class="fold-meta">· ' + br.staffCount + '人 · ' + br.projectCount + '项在研</span>';
    h += '<div class="fold-meta" style="margin:2px 0">负责人 <span style="color:var(--accent)">' + (br.manager || '（待任命）') + '</span>';
    h += ' · KPI <span style="color:' + kColor + '">' + (kpi.composite != null ? kpi.composite : '—') + '</span></div>';
    if (!br.isHQ && (!br.managerStaffId || String(br.manager).indexOf('待任命') >= 0)) {
      h += '<button class="btn" style="font-size:.65rem;padding:2px 6px;margin-top:2px" onclick="openBranchManagerPicker(\'' +
        String(br.id).replace(/'/g, "\\'") + '\')">任命经理</button>';
    } else if (!br.isHQ) {
      h += '<button class="btn" style="font-size:.65rem;padding:2px 6px;margin-top:2px" onclick="openBranchManagerPicker(\'' +
        String(br.id).replace(/'/g, "\\'") + '\')">更换负责人</button>';
    }
    const brProjs = (pc.projects || []).filter(function (p) { return p.branchId === br.id && (p.progress || 0) < 100; });
    if (brProjs.length) {
      h += '<div style="padding-left:8px;margin-top:4px" class="fold-meta">';
      brProjs.forEach(function (p) {
        h += '<div>· ' + (typeof projectDisplayLabel === 'function' ? projectDisplayLabel(p) : p.name) +
          ' ' + (p.progress || 0) + '%' + (p.manager ? ' · ' + p.manager : '') + '</div>';
      });
      h += '</div>';
    }
    h += '</div>';
  });
  h += '</div>';
  return h;
}
