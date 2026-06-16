/* 公司出行 · 城际驾车/私人飞机 — 由 build.js 注入 */
const PRIVATE_JET_PRICE = 200000000;
const PRIVATE_JET_ANNUAL = 10000000;
const CITY_COORDS = {
  '北京': [39.904, 116.407], '上海': [31.230, 121.474], '深圳': [22.543, 114.058],
  '广州': [23.129, 113.264], '杭州': [30.274, 120.155], '成都': [30.573, 104.067],
  '武汉': [30.593, 114.306], '南京': [32.060, 118.797], '苏州': [31.299, 120.586],
  '西安': [34.342, 108.940], '重庆': [29.563, 106.552], '天津': [39.343, 117.361],
  '青岛': [36.067, 120.382], '大连': [38.914, 121.615], '厦门': [24.480, 118.090],
  '宁波': [29.868, 121.544], '无锡': [31.491, 120.312], '佛山': [23.022, 113.122],
  '东莞': [23.021, 113.752], '合肥': [31.821, 117.227], '长沙': [28.228, 112.939],
  '郑州': [34.747, 113.625], '济南': [36.651, 117.120], '福州': [26.075, 119.297],
  '昆明': [25.039, 102.718], '贵阳': [26.647, 106.630], '南宁': [22.817, 108.367]
};
const ROAD_DISTANCE_FACTOR = 1.32;
const DRIVE_SPEED_KMH = 82;
const JET_CRUISE_KMH = 780;
const JET_GROUND_HOURS = 1.6;

function migratePrivateJet() {
  if (!game) return;
  if (!game.privateJet) game.privateJet = { owned: false, maintWeek: 0 };
}

function hasPrivateJet() {
  migratePrivateJet();
  return !!(game.privateJet && game.privateJet.owned);
}

function hasCompanyDriver() {
  return (typeof hasPlayerCompany === 'function' && hasPlayerCompany()) ||
    (typeof hasVilla === 'function' && hasVilla());
}

function getPlayerCurrentCity() {
  if (game && game.employed && game.playerCity) return game.playerCity;
  return typeof getCompanyHqCity === 'function' ? getCompanyHqCity() :
    (typeof PLAYER_HOME_CITY !== 'undefined' ? PLAYER_HOME_CITY : '杭州');
}

function haversineKm(a, b) {
  const c1 = CITY_COORDS[a], c2 = CITY_COORDS[b];
  if (!c1 || !c2) return a === b ? 0 : 900;
  const R = 6371;
  const dLat = (c2[0] - c1[0]) * Math.PI / 180;
  const dLng = (c2[1] - c1[1]) * Math.PI / 180;
  const lat1 = c1[0] * Math.PI / 180, lat2 = c2[0] * Math.PI / 180;
  const h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function oneWayDriveHours(fromCity, toCity) {
  if (!fromCity || !toCity || fromCity === toCity) return 0;
  const km = haversineKm(fromCity, toCity) * ROAD_DISTANCE_FACTOR;
  const near = typeof NEAR_CITIES !== 'undefined' && NEAR_CITIES.indexOf(toCity) >= 0 &&
    fromCity === (typeof PLAYER_HOME_CITY !== 'undefined' ? PLAYER_HOME_CITY : '杭州');
  if (near && km < 220) return Math.max(1, Math.round((km / 65) * 10) / 10);
  return Math.max(1.5, Math.round((km / DRIVE_SPEED_KMH) * 10) / 10);
}

function oneWayJetHours(fromCity, toCity) {
  if (!fromCity || !toCity || fromCity === toCity) return 0;
  const km = haversineKm(fromCity, toCity) * ROAD_DISTANCE_FACTOR;
  return Math.max(2, Math.round((km / JET_CRUISE_KMH + JET_GROUND_HOURS) * 10) / 10);
}

function getTravelLeg(fromCity, toCity) {
  const driveOne = oneWayDriveHours(fromCity, toCity);
  const jetOne = oneWayJetHours(fromCity, toCity);
  const useJet = hasPrivateJet() && !(game.privateJet && game.privateJet.grounded);
  const oneWay = useJet ? jetOne : driveOne;
  return {
    from: fromCity, to: toCity,
    km: Math.round(haversineKm(fromCity, toCity) * ROAD_DISTANCE_FACTOR),
    oneWayDriveHours: driveOne,
    oneWayJetHours: jetOne,
    oneWayHours: oneWay,
    roundTripHours: Math.round(oneWay * 2 * 10) / 10,
    mode: useJet ? 'jet' : 'driver',
    modeLabel: useJet ? '私人飞机' : '公司司机驾车'
  };
}

function getPersonWorkCity(person) {
  if (!person || !game || !game.playerCompany) return typeof getCompanyHqCity === 'function' ? getCompanyHqCity() : '杭州';
  const pc = game.playerCompany;
  if (person.source === 'staff') {
    const st = (pc.staff || []).find(function (s) { return s.id === person.id; });
    if (st && st.branchId && typeof getBranchById === 'function') {
      const br = getBranchById(st.branchId);
      if (br && br.city) return br.city;
    }
  }
  if (person.branchCity) return person.branchCity;
  if (person.isExecutive || person.source === 'npc' || person.source === 'board') {
    return typeof getCompanyHqCity === 'function' ? getCompanyHqCity() : getPlayerCurrentCity();
  }
  if (person.source === 'dept_head' && person.deptId === 'exec') {
    return typeof getCompanyHqCity === 'function' ? getCompanyHqCity() : getPlayerCurrentCity();
  }
  return typeof getCompanyHqCity === 'function' ? getCompanyHqCity() : getPlayerCurrentCity();
}

function isMiddleManagementPerson(person) {
  if (!person || person.isExecutive) return false;
  if (person.source !== 'staff') return false;
  const pc = game.playerCompany;
  const st = (pc.staff || []).find(function (s) { return s.id === person.id; });
  if (!st) return false;
  const role = st.role || st.title || '';
  if (typeof BRANCH_MANAGER_ROLES !== 'undefined' && BRANCH_MANAGER_ROLES.test(role)) return true;
  const lvl = st.roleLevel != null ? st.roleLevel : (typeof inferRoleLevel === 'function' ? inferRoleLevel(role) : 5);
  return lvl >= 2 && lvl <= 3;
}

function needsTravelToMeetPerson(person) {
  if (!isMiddleManagementPerson(person)) return false;
  const from = getPlayerCurrentCity();
  const to = getPersonWorkCity(person);
  return from !== to;
}

function getMeetingTravelPlan(selectedIds) {
  const from = getPlayerCurrentCity();
  let maxLeg = null;
  (selectedIds || []).forEach(function (cid) {
    const p = typeof resolveCompanyPerson === 'function' ? resolveCompanyPerson(cid) : null;
    if (!p || !needsTravelToMeetPerson(p)) return;
    const to = getPersonWorkCity(p);
    const leg = getTravelLeg(from, to);
    if (!maxLeg || leg.roundTripHours > maxLeg.roundTripHours) maxLeg = leg;
  });
  return maxLeg;
}

function formatTravelLabel(leg) {
  if (!leg || !leg.roundTripHours) return '';
  return leg.from + '→' + leg.to + ' 往返约 ' + leg.roundTripHours + 'h（' + leg.modeLabel +
    (leg.mode === 'driver' ? ' · 单程' + leg.oneWayDriveHours + 'h' : ' · 单程' + leg.oneWayJetHours + 'h') + '）';
}

function consumeCompanyTravelHours(hours, leg, reason) {
  if (!hours || hours < 0.1) return true;
  if (typeof dailyCanUseHours === 'function' && !dailyCanUseHours(hours)) {
    addLog('本时段剩余时间不足 ' + hours + ' 小时（含出行）', 'fail');
    return false;
  }
  if (leg && leg.mode === 'driver' && !hasCompanyDriver()) {
    addLog('异地中层会晤需公司司机或别墅司机，请先开公司或购别墅', 'fail');
    return false;
  }
  if (typeof dailyAddHours === 'function') dailyAddHours(hours, false);
  if (leg) {
    addLog('🚗 出行 · ' + (reason || '公务') + ' · ' + formatTravelLabel(leg), 'info');
  }
  return true;
}

function companyTravelThen(actionFn, travelHours, leg, reason) {
  if (!consumeCompanyTravelHours(travelHours, leg, reason)) return;
  if (typeof actionFn === 'function') actionFn();
}

function buyPrivateJet() {
  if (!game || game.gameOver) return;
  migratePrivateJet();
  if (game.privateJet.owned) { addLog('已拥有私人飞机', 'warn'); return; }
  if (game.cash < PRIVATE_JET_PRICE) {
    addLog('购买私人飞机需 ¥' + PRIVATE_JET_PRICE.toLocaleString(), 'fail');
    return;
  }
  if (!confirm('购买私人飞机？\n¥' + (PRIVATE_JET_PRICE / 100000000) + '亿 · 年维护费 ¥' + (PRIVATE_JET_ANNUAL / 10000) + '万\n城际出行大幅缩短')) return;
  game.cash -= PRIVATE_JET_PRICE;
  game.privateJet.owned = true;
  if (typeof ledgerAddExpense === 'function') ledgerAddExpense('lifestyle', '✈', '购置私人飞机', PRIVATE_JET_PRICE, false);
  addLog('✈ 私人飞机已购入 · 年维护 ¥' + PRIVATE_JET_ANNUAL.toLocaleString(), 'success');
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
  if (typeof updateUI === 'function') updateUI();
}

function tickPrivateJetAnnual() {
  if (!hasPrivateJet()) return;
  if (!game || game.week % 52 !== 0) return;
  if (game.cash < PRIVATE_JET_ANNUAL) {
    addLog('✈ 私人飞机年维护费不足，机队停飞直至补缴', 'warn');
    game.privateJet.grounded = true;
    return;
  }
  game.cash -= PRIVATE_JET_ANNUAL;
  game.privateJet.grounded = false;
  if (typeof ledgerAddExpense === 'function') ledgerAddExpense('lifestyle', '✈', '私人飞机年维护', PRIVATE_JET_ANNUAL, false);
  addLog('✈ 私人飞机年维护 ¥' + PRIVATE_JET_ANNUAL.toLocaleString(), 'info');
}

function openStrategyCityPicker(industry, option, onPick) {
  migrateCompanyBranches();
  const pc = game.playerCompany;
  const cities = [];
  (pc.branches || []).forEach(function (br) { if (cities.indexOf(br.city) < 0) cities.push(br.city); });
  (typeof listAvailableBranchCities === 'function' ? listAvailableBranchCities() : []).slice(0, 8).forEach(function (c) {
    if (cities.indexOf(c) < 0) cities.push(c);
  });
  if (!cities.length) cities.push(getPlayerCurrentCity());
  let html = '<p class="fold-meta">战略「' + option.label + '」· 请选择重点布局城市</p>';
  cities.forEach(function (city) {
    const hasBr = typeof getBranchByCity === 'function' && getBranchByCity(city);
    const leg = getTravelLeg(getPlayerCurrentCity(), city);
    html += '<button type="button" class="btn" style="display:block;width:100%;margin:6px 0" onclick="pickStrategyCity(\'' +
      String(city).replace(/'/g, "\\'") + '\')">' + city +
      (hasBr ? '（已有分公司）' : '（未设分公司 · 开办后可竞单）') +
      ' · 驾车单程约 ' + leg.oneWayDriveHours + 'h' +
      (hasPrivateJet() ? ' / 飞机 ' + leg.oneWayJetHours + 'h' : '') + '</button>';
  });
  window._strategyCityPick = { industry: industry, option: option, onPick: onPick };
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '🏙', title: '选择战略城市',
      html: html,
      buttons: [{ text: '取消', handler: function () {
        window._strategyCityPick = null;
        if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
      }}]
    });
  }
}

function pickStrategyCity(city) {
  const ctx = window._strategyCityPick;
  window._strategyCityPick = null;
  if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  if (!ctx) return;
  if (typeof ctx.onPick === 'function') ctx.onPick(city, ctx.industry, ctx.option);
  else if (typeof applyIndustryStrategy === 'function') applyIndustryStrategy(ctx.industry, ctx.option, city);
}

function openVisitBranchPicker(forTalk) {
  if (!hasPlayerCompany()) return;
  migrateCompanyBranches();
  const pc = game.playerCompany;
  const from = getPlayerCurrentCity();
  let html = '<p class="fold-meta">前往分公司与中层当面沟通（高管可在总部远程对接）</p>';
  (pc.branches || []).forEach(function (br) {
    if (br.city === from) return;
    const leg = getTravelLeg(from, br.city);
    html += '<button type="button" class="btn" style="display:block;width:100%;margin:6px 0" onclick="visitCompanyBranch(\'' +
      String(br.id).replace(/'/g, "\\'") + '\',' + (forTalk ? 'true' : 'false') + ')">' +
      br.name + ' · 往返 ' + leg.roundTripHours + 'h（' + leg.modeLabel + '）</button>';
  });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '🚗', title: '前往分公司',
      html: html || '<p class="fold-meta">你已在总部城市，可直接在人员列表约谈本地中层</p>',
      buttons: [{ text: '关闭', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } }]
    });
  }
}

function visitCompanyBranch(branchId, openTalkList) {
  if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  const br = typeof getBranchById === 'function' ? getBranchById(branchId) : null;
  if (!br) return;
  const leg = getTravelLeg(getPlayerCurrentCity(), br.city);
  if (!consumeCompanyTravelHours(leg.roundTripHours, leg, '前往' + br.name)) return;
  game.playerCompany.visitCity = br.city;
  game.playerCompany.visitBranchId = br.id;
  game.playerCompany.visitUntilDay = (game.week || 0) + '_' + ((game.daily && game.daily.phase) || 'd');
  addLog('📍 已抵达 ' + br.name + ' · 本时段可约谈当地中层', 'success');
  if (openTalkList && typeof openBranchTalkPicker === 'function') openBranchTalkPicker(branchId);
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
}

function isPlayerVisitingBranch(branchId) {
  const pc = game && game.playerCompany;
  if (!pc || !pc.visitBranchId) return false;
  const dayKey = (game.week || 0) + '_' + ((game.daily && game.daily.phase) || 'd');
  return pc.visitBranchId === branchId && pc.visitUntilDay === dayKey;
}

function openBranchTalkPicker(branchId) {
  const br = typeof getBranchById === 'function' ? getBranchById(branchId) : null;
  if (!br) return;
  const people = (typeof collectCompanyPeople === 'function' ? collectCompanyPeople() : []).filter(function (p) {
    if (p.isExecutive) return false;
    return getPersonWorkCity(p) === br.city;
  });
  if (!people.length) { addLog(br.name + ' 暂无可约谈中层', 'warn'); return; }
  let html = '<p class="fold-meta">在 ' + br.name + ' · 选择面谈对象（各 1h）</p>';
  const buttons = people.slice(0, 10).map(function (p) {
    return {
      text: p.name + ' · ' + p.role,
      handler: function () {
        if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
        companyTalkWithLocal(p.id);
      }
    };
  });
  buttons.push({ text: '取消', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '💬', title: '分公司面谈', html: html, buttons: buttons });
  }
}

function companyTalkWithLocal(contactId) {
  companyTalkWithExec(contactId, true);
}

function companyTalkWithExec(contactId, skipTravelCheck) {
  if (!hasPlayerCompany()) return;
  const person = typeof resolveCompanyPerson === 'function' ? resolveCompanyPerson(contactId) : null;
  if (!person) { addLog('找不到该员工', 'fail'); return; }
  let travelLeg = null;
  let travelH = 0;
  if (!skipTravelCheck && needsTravelToMeetPerson(person)) {
    const st = (game.playerCompany.staff || []).find(function (s) { return s.id === person.id; });
    const br = st && st.branchId && typeof getBranchById === 'function' ? getBranchById(st.branchId) : null;
    if (br && isPlayerVisitingBranch(br.id)) {
      travelH = 0;
    } else {
      travelLeg = getTravelLeg(getPlayerCurrentCity(), getPersonWorkCity(person));
      travelH = travelLeg.roundTripHours;
    }
  }
  const talkH = 1;
  const total = travelH + talkH;
  if (typeof dailyCanUseHours === 'function' && !dailyCanUseHours(total)) {
    addLog('本时段剩余时间不足 ' + total + ' 小时（含出行 ' + travelH + 'h + 交谈 1h）', 'fail');
    return;
  }
  if (travelH > 0 && !consumeCompanyTravelHours(travelH, travelLeg, '拜访' + person.name)) return;
  if (typeof dailyAddHours === 'function') dailyAddHours(talkH, false);
  const c = typeof ensureCompanyPersonContact === 'function' ? ensureCompanyPersonContact(person) : null;
  if (!c) { addLog('无法联系该员工', 'fail'); return; }
  const bump = 2 + Math.floor(Math.random() * 4);
  if (typeof bumpContactFamiliarity === 'function') bumpContactFamiliarity(c, bump);
  if (typeof addPersonToCompanyWorkplaceCircle === 'function') {
    addPersonToCompanyWorkplaceCircle(c.id, { role: person.role, familiarity: c.familiarity, attraction: c.attraction || 0 });
  }
  if (!person.isExecutive && typeof syncAllPlayerStaffCircles === 'function') syncAllPlayerStaffCircles();
  const topics = typeof COMPANY_TALK_TOPICS !== 'undefined' ? COMPANY_TALK_TOPICS : ['聊了业务进展。'];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  const travelNote = travelH > 0 ? ' · 含往返出行 ' + travelH + 'h' : '';
  addLog('💬 与 ' + c.name + '（' + getPersonWorkCity(person) + '）面谈 1h · 熟悉+' + bump + travelNote, 'info');
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '💬', title: '公司面谈 · ' + c.name,
      html: '<p>在 <b>' + getPersonWorkCity(person) + '</b> 与 <b>' + c.name + '</b> 面谈 1 小时。</p>' +
        (travelLeg ? '<p class="fold-meta">' + formatTravelLabel(travelLeg) + '</p>' : '') +
        '<p class="fold-meta">' + topic + '</p>',
      buttons: [{ text: '知道了', primary: true, handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } }]
    });
  }
  if (typeof refreshCompanyMgmtUi === 'function') refreshCompanyMgmtUi();
  if (typeof updateUI === 'function') updateUI();
}
