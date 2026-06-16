/* 职场圈层级 — 由 build.js 注入 */
const WP_CIRCLE_DEFS = [
  { id: 'team', suffix: '组员圈', size: [3, 5], fam: [45, 65] },
  { id: 'function', suffix: '职能圈', size: [4, 7], fam: [35, 55] },
  { id: 'department', suffix: '部门圈', size: [5, 9], fam: [30, 50] },
  { id: 'company', suffix: '全公司人脉', size: [6, 12], fam: [20, 40] }
];

function wpRng(seed) {
  let s = Math.abs(seed || 1);
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function ensureWorkplaceCircleState() {
  if (!game) return;
  if (!game.playerCircles) game.playerCircles = { social: [], hobby: [], workplace: [] };
  if (!game.workplaceMeta) game.workplaceMeta = { companyId: null, jobIdx: null, week: 0 };
}

function removeEmploymentWorkplaceCircles() {
  if (!game || !game.playerCircles) return;
  game.playerCircles.workplace = (game.playerCircles.workplace || []).filter(function (c) {
    if (typeof isPlayerStaffWorkplaceCircle === 'function') return isPlayerStaffWorkplaceCircle(c);
    return c.id === 'villa_staff' || c.id === 'company_exec' || c.id === 'company_service' || c.id === 'company_team' || c.kind === 'staff';
  });
}

function genWorkplaceColleague(gender, rng) {
  const g = gender || (rng() < 0.5 ? 'male' : 'female');
  const name = typeof pickStrangerDisplayName === 'function' ? pickStrangerDisplayName(g) : '同事';
  const id = 'wp_' + game.week + '_' + Math.floor(rng() * 1e6);
  return { id: id, name: name, gender: g, kind: 'colleague', role: '同事', familiarity: 0, attraction: 5 + Math.floor(rng() * 20) };
}

function syncWorkplaceCirclesFromEmployment() {
  if (!game) return;
  ensureWorkplaceCircleState();
  if (!game.employed || !game.employment || !game.employment.company) {
    if (game.workplaceMeta.companyId) {
      removeEmploymentWorkplaceCircles();
      game.workplaceMeta = { companyId: null, jobIdx: null, week: game.week };
    }
    return;
  }
  const emp = game.employment;
  const job = game.market && game.market[emp.jobIdx];
  const co = emp.company;
  const coKey = co.id || co.name;
  const changed = game.workplaceMeta.companyId !== coKey || game.workplaceMeta.jobIdx !== emp.jobIdx;
  if (!changed) return;
  removeEmploymentWorkplaceCircles();
  game.workplaceMeta = { companyId: coKey, jobIdx: emp.jobIdx, week: game.week };
  const rng = wpRng((game.stockSeed || 1) + String(coKey).length * 17 + emp.jobIdx);
  const jobTitle = job ? job.title : '职员';
  const dept = (emp.importance === 'high' ? '核心' : emp.importance === 'mid' ? '业务' : '基层') + '部';
  WP_CIRCLE_DEFS.forEach(function (def) {
    const lo = def.size[0], hi = def.size[1];
    const n = lo + Math.floor(rng() * (hi - lo + 1));
    const circle = {
      id: 'wp_' + def.id + '_' + coKey,
      kind: def.id,
      name: co.name + '·' + (def.id === 'team' ? jobTitle : def.id === 'function' ? (job ? job.category : '综合') : def.id === 'department' ? dept : '') + def.suffix,
      companyId: coKey,
      members: [{ id: 'player', familiarity: 100, attraction: 0, role: '你' }]
    };
    for (let i = 0; i < n; i++) {
      const col = genWorkplaceColleague(null, rng);
      col.familiarity = def.fam[0] + Math.floor(rng() * (def.fam[1] - def.fam[0]));
      col.company = co.name;
      col.jobTitle = def.id === 'team' ? jobTitle : def.id === 'function' ? jobTitle : ['专员', '主管', '经理'][Math.floor(rng() * 3)];
      col.metWhere = co.name;
      col.metWeek = game.week;
      if (typeof ensureContactDreamFields === 'function') ensureContactDreamFields(col);
      if (typeof ensureContactSocialFields === 'function') ensureContactSocialFields(col);
      const exist = (game.contacts || []).find(function (x) { return x.name === col.name && x.company === co.name; });
      if (!exist) game.contacts.push(col);
      else col.id = exist.id;
      circle.members.push({ id: col.id, familiarity: col.familiarity, attraction: col.attraction || 10, role: col.jobTitle });
    }
    game.playerCircles.workplace.push(circle);
  });
  if (changed) addLog('🏢 职场圈已更新：' + co.name + ' · ' + jobTitle, 'info');
}

function tickWorkplaceCircles() {
  if (!game || game.gameOver) return;
  syncWorkplaceCirclesFromEmployment();
  if (typeof syncAllPlayerStaffCircles === 'function') syncAllPlayerStaffCircles();
  (game.playerCircles.workplace || []).forEach(function (circle) {
    if (!circle.members) return;
    const staffCircle = typeof isPlayerStaffWorkplaceCircle === 'function' && isPlayerStaffWorkplaceCircle(circle);
    if (!staffCircle && !game.employed) return;
    const prob = staffCircle ? 0.08 : 0.12;
    circle.members.forEach(function (m) {
      if (m.id === 'player') return;
      const c = (game.contacts || []).find(function (x) { return x.id === m.id; });
      if (c && Math.random() < prob) {
        c.familiarity = Math.min(100, (c.familiarity || 0) + 1);
        m.familiarity = c.familiarity;
      }
    });
  });
}

function onPlayerEmploymentChanged(wasEmployed) {
  syncWorkplaceCirclesFromEmployment();
}

function workplaceCircleLabel(kind) {
  return { team: '组员圈', function: '职能圈', department: '部门圈', company: '全公司', staff: '勤务职员', colleague: '公司同事' }[kind] || '职场圈';
}
