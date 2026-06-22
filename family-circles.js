/* 家族圈 · 朋友圈 · 子女档案 — 由 build.js 注入（在 social-circles 之后） */
const FRIENDS_FAM_THRESHOLD = 60;
const FRIENDS_MINDMAP_FAM_THRESHOLD = 80;
const FAMILY_ANCESTOR_DEFS = [
  { id: 'core_pp_gf', kind: 'grandparent', role: '爷爷', gender: 'male', line: 'paternal', gen: 2 },
  { id: 'core_pp_gm', kind: 'grandparent', role: '奶奶', gender: 'female', line: 'paternal', gen: 2 },
  { id: 'core_pm_gf', kind: 'grandparent', role: '外公', gender: 'male', line: 'maternal', gen: 2 },
  { id: 'core_pm_gm', kind: 'grandparent', role: '外婆', gender: 'female', line: 'maternal', gen: 2 }
];
const SPOUSE_ANCESTOR_DEFS = [
  { id: 'core_sp_father', kind: 'spouse_parent', role: '岳父/公公', gender: 'male', gen: 1 },
  { id: 'core_sp_mother', kind: 'spouse_parent', role: '岳母/婆婆', gender: 'female', gen: 1 },
  { id: 'core_sp_pp_gf', kind: 'spouse_grandparent', role: '配偶爷爷', gender: 'male', line: 'paternal', gen: 2 },
  { id: 'core_sp_pp_gm', kind: 'spouse_grandparent', role: '配偶奶奶', gender: 'female', line: 'paternal', gen: 2 },
  { id: 'core_sp_pm_gf', kind: 'spouse_grandparent', role: '配偶外公', gender: 'male', line: 'maternal', gen: 2 },
  { id: 'core_sp_pm_gm', kind: 'spouse_grandparent', role: '配偶外婆', gender: 'female', line: 'maternal', gen: 2 }
];
const CONTACT_GROUP_LABELS = {
  family: '家族',
  friends: '朋友圈',
  workplace: '职场圈',
  social: '校友圈',
  hobby: '爱好圈',
  other: '社会'
};

function familyRng(key) {
  const seed = ((game && game.stockSeed) || 1) + String(key || '').length * 47 + (game.week || 0);
  return typeof dreamRng === 'function' ? dreamRng(seed) : function () { return Math.random(); };
}
function surnameFromFullName(full) {
  if (!full || full.length < 2) return full || '王';
  const doubles = ['欧阳', '司马', '上官', '诸葛', '东方', '皇甫', '令狐', '公孙', '宇文', '长孙'];
  for (let i = 0; i < doubles.length; i++) {
    if (full.indexOf(doubles[i]) === 0) return doubles[i];
  }
  return full.charAt(0);
}
function genPersonName(gender, seedKey, surnameHint) {
  const rng = familyRng(seedKey);
  const surname = surnameHint || (typeof namePick === 'function' ? namePick(typeof SURNAME_100 !== 'undefined' ? SURNAME_100 : ['王'], rng) : '王');
  const given = typeof composeGivenPart === 'function' ? composeGivenPart(gender, rng) : (gender === 'male' ? '伟' : '娜');
  return surname + given;
}
function rollChildStats(seedKey) {
  const rng = familyRng(seedKey + '_stats');
  return {
    body: 40 + Math.floor(rng() * 31),
    mind: 40 + Math.floor(rng() * 31),
    spirit: 40 + Math.floor(rng() * 31)
  };
}
function playerLineSurnames() {
  const names = game.parentNames || {};
  return {
    paternal: names.fatherSurname || surnameFromFullName(names.father || ''),
    maternal: names.motherSurname || surnameFromFullName(names.mother || '')
  };
}
function getPlayerSurname() {
  if (!game) return '王';
  const companionDefault = typeof COMPANION_NAME !== 'undefined' ? COMPANION_NAME : '小艾';
  if (game.playerSurname && game.playerSurname.length >= 1 && game.playerSurname !== '小') return game.playerSurname;
  const playerChild = (game.children || []).find(function (ch) {
    return ch && ch.bioFather === 'player' && ch.name && ch.name.length >= 2;
  });
  if (playerChild) {
    const sur = playerChild.surname || surnameFromFullName(playerChild.name);
    if (sur && sur !== '小') return sur;
  }
  if (game.playerName && game.playerName.length >= 2 && game.playerName !== companionDefault && game.playerName !== '小艾') {
    return surnameFromFullName(game.playerName);
  }
  const lines = playerLineSurnames();
  return lines.paternal || lines.maternal || '王';
}
function storePlayerSurnameFromName() {
  if (!game || !game.playerName) return;
  const companionDefault = typeof COMPANION_NAME !== 'undefined' ? COMPANION_NAME : '小艾';
  if (game.playerName === companionDefault || game.playerName === '小艾') return;
  game.playerSurname = getPlayerSurname();
}
function getPlayerDisplaySurname() {
  if (!game) return '王';
  if (game.playerName && game.playerName.length >= 2) {
    return surnameFromFullName(game.playerName);
  }
  const names = game.parentNames || {};
  if (names.surname) return names.surname;
  const lines = playerLineSurnames();
  return lines.maternal || lines.paternal || '王';
}
function spouseLineSurname() {
  const sp = (game.contacts || []).find(function (c) { return c.id === CORE_CONTACT_IDS.spouse || c.kind === 'spouse'; });
  if (!sp || !sp.name) return null;
  return surnameFromFullName(sp.name);
}
function ancestorSurnameHint(def) {
  const lines = playerLineSurnames();
  if (def.id.indexOf('core_sp_') === 0) {
    const ss = spouseLineSurname();
    if (!ss) return null;
    if (def.line === 'maternal') return ss;
    return ss;
  }
  if (def.line === 'maternal') return lines.maternal;
  return lines.paternal;
}
function playerBirthYearRef() {
  return game.birthYear || (typeof PLAYER_BIRTH_YEAR !== 'undefined' ? PLAYER_BIRTH_YEAR : 1988);
}
function ancestorBirthYear(def) {
  const pb = playerBirthYearRef();
  const rng = familyRng((def.id || '') + '_age');
  if (def.gen === 1) {
    return pb - (24 + Math.floor(rng() * 9));
  }
  if (def.gen === 2) {
    return pb - (50 + Math.floor(rng() * 15));
  }
  return pb - 55;
}
function initFamilyAncestorLifespan(c, def) {
  if (!c || c.dead) return c;
  c.birthYear = ancestorBirthYear(def);
  if (c.attraction == null) {
    c.attraction = 20 + Math.floor(familyRng((def.id || '') + '_attr')() * 35);
  }
  if (c.lifeExpectancy == null) {
    const rng = familyRng((def.id || '') + '_life');
    const base = def.gen === 2 ? 82 : 78;
    c.lifeExpectancy = typeof rollLifeExpectancy === 'function' ? rollLifeExpectancy(base, rng) : base;
  }
  return c;
}
function ensureFamilyAncestorContact(def) {
  if (!game) return null;
  const hint = ancestorSurnameHint(def);
  if (def.id.indexOf('core_sp_') === 0 && !hint && !(game.married && !game.divorced)) return null;
  const existing = (game.contacts || []).find(function (c) { return c.id === def.id; });
  const name = existing && existing.name ? existing.name : genPersonName(def.gender, def.id, hint);
  const birthYear = ancestorBirthYear(def);
  const role = def.role;
  const fields = {
    kind: def.kind, name: name, gender: def.gender, role: role,
    company: '', jobTitle: def.gen >= 2 ? '退休' : '', metWhere: '家族',
    birthYear: birthYear, familiarity: 55 + def.gen * 5, unreachable: false
  };
  if (!existing || existing.attraction == null) {
    fields.attraction = 20 + Math.floor(familyRng(def.id + '_attr')() * 35);
  }
  if (typeof ensureCoreContact === 'function') ensureCoreContact(def.id, fields);
  const c = (game.contacts || []).find(function (x) { return x.id === def.id; });
  if (c) initFamilyAncestorLifespan(c, def);
  return c;
}
function isFamilyKind(c) {
  if (!c) return false;
  const k = c.kind;
  return k === 'father' || k === 'mother' || k === 'parents' || k === 'spouse' || k === 'ex_spouse' ||
    k === 'child' || k === 'grandparent' || k === 'great_grandparent' ||
    k === 'spouse_parent' || k === 'spouse_grandparent' || k === 'spouse_great_grandparent';
}
function isFamilyCoreContact(c) {
  if (!c) return false;
  if (isFamilyKind(c)) return true;
  if (c.id === CORE_CONTACT_IDS.father || c.id === CORE_CONTACT_IDS.mother) return true;
  if (c.id === CORE_CONTACT_IDS.spouse || c.id === CORE_CONTACT_IDS.exSpouse) return true;
  if (String(c.id || '').indexOf('child_') === 0) return true;
  return FAMILY_ANCESTOR_DEFS.some(function (d) { return d.id === c.id; }) ||
    SPOUSE_ANCESTOR_DEFS.some(function (d) { return d.id === c.id; });
}
function childRaisingMonthsTotal() {
  return typeof CHILD_RAISING_MONTHS !== 'undefined' ? CHILD_RAISING_MONTHS : 216;
}
function childWeeksPerMonth() {
  return typeof WEEKS_PER_MONTH !== 'undefined' ? WEEKS_PER_MONTH : 4;
}
function lifespanStartYear() {
  return typeof LIFESPAN_GAME_START_YEAR !== 'undefined' ? LIFESPAN_GAME_START_YEAR : 2010;
}
function childRaisedMonths(ch) {
  if (!ch) return 0;
  return Math.max(0, childRaisingMonthsTotal() - (ch.monthsLeft || 0));
}
function getChildAgeYears(ch) {
  return Math.floor(childRaisedMonths(ch) / 12);
}
function getChildAgeMonths(ch) {
  return childRaisedMonths(ch) % 12;
}
function formatChildAge(ch) {
  const y = getChildAgeYears(ch);
  const m = getChildAgeMonths(ch);
  if (y <= 0 && m <= 0) return '未满1个月';
  if (y <= 0) return m + '个月';
  if (m <= 0) return y + '岁';
  return y + '岁' + m + '个月';
}
function repairChildBirthDate(ch) {
  if (!ch || !game) return ch;
  const raised = childRaisedMonths(ch);
  ch.birthWeek = (game.week || 0) - raised * childWeeksPerMonth();
  ch.birthYear = lifespanStartYear() + Math.floor(ch.birthWeek / 52);
  return ch;
}
function getChildBirthDateStr(ch) {
  if (!ch) return '';
  repairChildBirthDate(ch);
  if (typeof getDateStr === 'function' && ch.birthWeek != null) return getDateStr(ch.birthWeek);
  return ch.birthYear ? String(ch.birthYear) + '年' : '';
}
function findChildRecord(contactId) {
  if (!game || !contactId) return null;
  return (game.children || []).find(function (ch) {
    return ch && (ch.id === contactId || ch.contactId === contactId);
  }) || null;
}
function ensureChildrenArray() {
  if (!game) return [];
  if (!game.children) game.children = [];
  return game.children;
}
function syncChildRecordFromChildren() {
  if (!game) return;
  const active = (game.children || []).filter(function (ch) { return ch && ch.monthsLeft > 0; });
  game.hasChildren = active.length > 0;
  game.childRaisingMonthsLeft = active.length ? Math.max.apply(null, active.map(function (ch) { return ch.monthsLeft; })) : 0;
  if (active.length) game.childRecord = active[0];
  else game.childRecord = null;
}
function backfillChildEntry(ch, index) {
  if (!ch) return ch;
  if (!ch.id) ch.id = 'child_' + index;
  if (!ch.contactId) ch.contactId = ch.id;
  repairChildBirthDate(ch);
  if (!ch.stats) ch.stats = rollChildStats(ch.id);
  if (!ch.name) {
    const sur = ch.surname || pickChildSurname(ch);
    const rng = familyRng(ch.id + '_name');
    const given = typeof composeGivenPart === 'function' ? composeGivenPart(ch.gender || 'male', rng) : '明';
    ch.name = sur + given;
    ch.surname = sur;
  }
  fixChildSurnameAndName(ch);
  if (!ch.gender) ch.gender = Math.random() < 0.5 ? 'male' : 'female';
  ensureChildContact(ch);
  return ch;
}
function pickChildSurname(ch) {
  const lines = playerLineSurnames();
  if (ch.bioFather === 'player') return getPlayerSurname() || lines.maternal || lines.paternal || '王';
  if (ch.bioFather === 'other' && ch.motherContactId) {
    const mom = (game.contacts || []).find(function (c) { return c.id === ch.motherContactId; });
    if (mom && mom.name) return surnameFromFullName(mom.name);
  }
  if (game.married && !game.divorced) {
    const ss = spouseLineSurname();
    if (ss) return ss;
  }
  return lines.paternal || '王';
}
function ensureChildContact(ch) {
  if (!ch || !ch.id) return null;
  const stats = ch.stats || rollChildStats(ch.id);
  const fields = {
    kind: 'child', name: ch.name, gender: ch.gender || 'male', role: '子女',
    metWhere: '家庭', metWeek: ch.birthWeek != null ? ch.birthWeek : (game.week || 0),
    familiarity: 95, attraction: 0,
    childStats: stats, birthYear: ch.birthYear, birthWeek: ch.birthWeek
  };
  if (typeof ensureCoreContact === 'function') ensureCoreContact(ch.contactId || ch.id, fields);
  const c = (game.contacts || []).find(function (x) { return x.id === (ch.contactId || ch.id); });
  if (c) {
    c.childStats = stats;
    c.birthYear = ch.birthYear;
    c.birthWeek = ch.birthWeek;
    c.metWeek = ch.birthWeek != null ? ch.birthWeek : c.metWeek;
    if (typeof initContactLifespan === 'function') initContactLifespan(c, ch.id.length * 19);
  }
  return c;
}
function migrateChildrenArray() {
  if (!game) return;
  ensureChildrenArray();
  if (!game.children.length && game.childRecord && (game.childRecord.monthsLeft > 0 || game.hasChildren)) {
    const cr = game.childRecord;
    game.children.push({
      id: 'child_0', contactId: 'child_0',
      monthsLeft: cr.monthsLeft || game.childRaisingMonthsLeft || 0,
      bioFather: cr.bioFather || 'player',
      conceivedMarried: !!cr.conceivedMarried,
      custody: cr.custody || 'joint',
      supportDemand: !!cr.supportDemand,
      paternityTested: !!cr.paternityTested,
      paternityIsPlayer: cr.paternityIsPlayer,
      motherContactId: game.married && !game.divorced ? CORE_CONTACT_IDS.spouse : null
    });
  }
  game.children.forEach(function (ch, i) { backfillChildEntry(ch, i); fixChildSurnameAndName(ch); repairChildBirthDate(ch); });
  syncChildRecordFromChildren();
}
function repairAllChildSurnames() {
  if (!game || !game.children) return;
  migrateChildrenArray();
  (game.children || []).forEach(function (ch) {
    fixChildSurnameAndName(ch);
    ensureChildContact(ch);
  });
}
function registerChildAtBirth(opts) {
  if (!game) return null;
  opts = opts || {};
  const idx = (game.children || []).length;
  const id = 'child_' + idx;
  const months = typeof CHILD_RAISING_MONTHS !== 'undefined' ? CHILD_RAISING_MONTHS : 216;
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const bioFather = opts.bioFather || game.pregnancyBioFather || 'player';
  const motherId = opts.motherContactId || (bioFather === 'other' ? opts.affairContactId : (game.married && !game.divorced ? CORE_CONTACT_IDS.spouse : null));
  const ch = {
    id: id, contactId: id, gender: gender,
    monthsLeft: months,
    bioFather: bioFather,
    conceivedMarried: !!opts.conceivedMarried,
    custody: opts.custody || 'joint',
    supportDemand: !!opts.supportDemand,
    paternityTested: false,
    paternityIsPlayer: null,
    motherContactId: motherId,
    affairContactId: opts.affairContactId || null,
    birthWeek: game.week || 0,
    birthYear: lifespanStartYear() + Math.floor((game.week || 0) / 52)
  };
  ch.surname = pickChildSurname(ch);
  backfillChildEntry(ch, idx);
  ensureChildrenArray().push(ch);
  syncChildRecordFromChildren();
  if (typeof syncFamilyCircle === 'function') syncFamilyCircle();
  return ch;
}
function registerAffairChild(contact) {
  if (!game || !contact) return null;
  const months = typeof CHILD_RAISING_MONTHS !== 'undefined' ? CHILD_RAISING_MONTHS : 216;
  return registerChildAtBirth({
    bioFather: game.playerGender === 'male' ? 'player' : 'other',
    affairContactId: contact.id,
    motherContactId: game.playerGender === 'female' ? 'player' : contact.id,
    custody: 'partner',
    supportDemand: game.playerGender === 'male',
    conceivedMarried: false
  });
}
function getActiveChildren() {
  migrateChildrenArray();
  return (game.children || []).filter(function (ch) { return ch && ch.monthsLeft > 0; });
}
function childExpenseForEntry(ch) {
  if (!ch || ch.monthsLeft <= 0) return 0;
  if (!game.divorced) return typeof CHILD_LIVING_COST !== 'undefined' ? CHILD_LIVING_COST : 20000;
  if (ch.custody === 'player') return typeof CHILD_LIVING_COST !== 'undefined' ? CHILD_LIVING_COST : 20000;
  if (ch.bioFather === 'other') return 0;
  if (ch.paternityTested && !ch.paternityIsPlayer) return 0;
  if (ch.supportDemand && ch.paternityIsPlayer === true) return typeof CHILD_LIVING_COST !== 'undefined' ? CHILD_LIVING_COST : 20000;
  if (ch.supportDemand && ch.bioFather === 'player' && !ch.paternityTested) return typeof CHILD_LIVING_COST !== 'undefined' ? CHILD_LIVING_COST : 20000;
  return 0;
}
function getPlayerChildrenExpenses() {
  const kids = getActiveChildren();
  if (!kids.length) return { living: 0, childLabel: '', additive: false };
  let living = 0;
  let additive = false;
  const labels = [];
  kids.forEach(function (ch) {
    const exp = childExpenseForEntry(ch);
    if (!exp) return;
    if (game.divorced && ch.custody === 'partner' && ch.supportDemand) additive = true;
    living += exp;
    labels.push((ch.name || '孩子') + ' ¥' + exp.toLocaleString());
  });
  const childLabel = labels.length ? ('育儿 ' + labels.length + ' 人 · ' + labels.join('、')) : '';
  return { living: living, childLabel: childLabel, additive: additive };
}
function tickChildrenMonthly() {
  if (!game) return;
  migrateChildrenArray();
  let anyAdult = false;
  (game.children || []).forEach(function (ch) {
    if (!ch || ch.monthsLeft <= 0) return;
    ch.monthsLeft--;
    if (ch.monthsLeft === 0) anyAdult = true;
  });
  syncChildRecordFromChildren();
  if (anyAdult && typeof syncFamilyCircle === 'function') syncFamilyCircle();
  return anyAdult;
}
function getPaternityTestChild() {
  migrateChildrenArray();
  return (game.children || []).find(function (ch) {
    return ch && ch.monthsLeft > 0 && ch.custody === 'partner' && ch.bioFather !== 'other' && !ch.paternityTested;
  }) || null;
}
function findCircleMembership(personId, circles, kind) {
  if (!circles || !circles.length) return null;
  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    if ((circle.members || []).some(function (m) { return m.id === personId; })) {
      return { kind: kind, circle: circle };
    }
  }
  return null;
}
function resolveContactCircleSource(personId) {
  if (!game || !personId || personId === 'player') return '';
  if (isFamilyCoreContact({ id: personId }) || (game.children || []).some(function (ch) { return ch.id === personId || ch.contactId === personId; })) return '家族圈';
  const pc = game.playerCircles || {};
  let hit = findCircleMembership(personId, pc.workplace, 'workplace');
  if (hit) return (hit.circle.name || '职场圈');
  hit = findCircleMembership(personId, pc.social, 'social');
  if (hit) return (hit.circle.name || '校友圈');
  hit = findCircleMembership(personId, pc.hobby, 'hobby');
  if (hit) return (hit.circle.name || '爱好圈');
  const c = (game.contacts || []).find(function (x) { return x.id === personId; });
  if (c && c.metWhere && c.metWhere !== '不明') return c.metWhere;
  return '社会';
}
function contactQualifiesForFriendsCircle(c) {
  if (!c || c.dead || c.id === 'player') return false;
  if (c.followed) return true;
  if (isFamilyCoreContact(c) && c.kind !== 'bff') return false;
  ensureContactSocialFields(c);
  return (c.familiarity || 0) >= FRIENDS_FAM_THRESHOLD;
}
function syncFriendsCircle() {
  if (!game) return;
  game.playerCircles = game.playerCircles || { social: [], hobby: [], workplace: [], friends: [], family: [] };
  const members = [{ id: 'player', familiarity: 100, attraction: 0 }];
  const seen = { player: true };
  (game.contacts || []).forEach(function (c) {
    if (!contactQualifiesForFriendsCircle(c)) return;
    if (seen[c.id]) return;
    seen[c.id] = true;
    const src = resolveContactCircleSource(c.id);
    c.friendCircleSource = c.followed ? (src + ' · 关注') : src;
    members.push({
      id: c.id,
      familiarity: c.familiarity || FRIENDS_FAM_THRESHOLD,
      attraction: c.attraction || 0,
      source: c.friendCircleSource
    });
  });
  game.playerCircles.friends = [{ id: 'friends_main', name: '朋友圈', members: members }];
}
function buildFamilySubcircle(id, name, memberIds) {
  const members = [{ id: 'player', familiarity: 100, attraction: 0 }];
  const seen = { player: true };
  (memberIds || []).forEach(function (mid) {
    if (!mid || seen[mid]) return;
    seen[mid] = true;
    const c = (game.contacts || []).find(function (x) { return x.id === mid; });
    members.push({ id: mid, familiarity: c && c.familiarity != null ? c.familiarity : 80, attraction: c && c.attraction != null ? c.attraction : 25 });
  });
  return { id: id, name: name, members: members };
}
function syncFamilyCircle() {
  if (!game) return;
  migrateChildrenArray();
  game.playerCircles = game.playerCircles || { social: [], hobby: [], workplace: [], friends: [], family: [] };
  FAMILY_ANCESTOR_DEFS.forEach(function (d) { ensureFamilyAncestorContact(d); });
  if (game.married && !game.divorced) {
    SPOUSE_ANCESTOR_DEFS.forEach(function (d) { ensureFamilyAncestorContact(d); });
  }
  const gen2 = FAMILY_ANCESTOR_DEFS.filter(function (d) { return d.gen === 2; }).map(function (d) { return d.id; });
  const parents = [CORE_CONTACT_IDS.father, CORE_CONTACT_IDS.mother];
  const spouseIds = [];
  if (game.married && !game.divorced) spouseIds.push(CORE_CONTACT_IDS.spouse);
  if (game.divorced) spouseIds.push(CORE_CONTACT_IDS.exSpouse);
  const spParents = (game.married && !game.divorced) ? SPOUSE_ANCESTOR_DEFS.filter(function (d) { return d.gen === 1; }).map(function (d) { return d.id; }) : [];
  const spGen2 = (game.married && !game.divorced) ? SPOUSE_ANCESTOR_DEFS.filter(function (d) { return d.gen === 2; }).map(function (d) { return d.id; }) : [];
  const childIds = (game.children || []).map(function (ch) { return ch.contactId || ch.id; });
  const exIds = game.divorced ? [CORE_CONTACT_IDS.exSpouse] : [];
  game.playerCircles.family = [
    buildFamilySubcircle('family_grand', '祖辈', gen2.concat(spGen2)),
    buildFamilySubcircle('family_parents', '父母与姻亲', parents.concat(spParents)),
    buildFamilySubcircle('family_core', '本人与伴侣', spouseIds),
    buildFamilySubcircle('family_children', '子女', childIds),
    buildFamilySubcircle('family_ex', '前任', exIds.filter(function (id, i, a) { return a.indexOf(id) === i && (!game.married || id !== CORE_CONTACT_IDS.spouse); }))
  ].filter(function (c) { return c.members.length > 1; });
  if (typeof syncFriendsCircle === 'function') syncFriendsCircle();
}
function familyMemberMeta(personId) {
  const circles = game && game.playerCircles && game.playerCircles.family;
  if (!circles) return null;
  for (let i = 0; i < circles.length; i++) {
    const m = (circles[i].members || []).find(function (x) { return x.id === personId; });
    if (m) return m;
  }
  return null;
}
function familyContactExists(id) {
  if (!id || id === 'player') return true;
  return !!(game.contacts || []).find(function (c) { return c.id === id; });
}
function familyRoleLabel(id) {
  const def = FAMILY_ANCESTOR_DEFS.find(function (d) { return d.id === id; }) ||
    SPOUSE_ANCESTOR_DEFS.find(function (d) { return d.id === id; });
  if (def) return def.role;
  if (id === 'player') return '本人';
  if (id === CORE_CONTACT_IDS.father) return '父亲';
  if (id === CORE_CONTACT_IDS.mother) return '母亲';
  if (id === CORE_CONTACT_IDS.spouse) return '伴侣';
  if (id === CORE_CONTACT_IDS.exSpouse) return '前任';
  const c = (game.contacts || []).find(function (x) { return x.id === id; });
  if (c && c.role) return c.role;
  if (c && c.kind === 'child') return '子女';
  return '';
}
function buildFamilyTreeGraph(ownerId) {
  if (!game || ownerId !== 'player') return null;
  syncFamilyCircle();
  const nodes = [];
  const edges = [];
  const seen = {};
  const married = !!(game.married && !game.divorced);
  function addPerson(id, tier, col, roleHint) {
    if (!id || seen[id]) return false;
    if (!familyContactExists(id)) return false;
    seen[id] = true;
    const contact = typeof circleMemberContact === 'function' ? circleMemberContact(id, ownerId) : null;
    const label = contact ? (typeof contactDisplayName === 'function' ? contactDisplayName(contact) : contact.name) : (id === 'player' ? '你' : id);
    const meta = familyMemberMeta(id);
    nodes.push({
      id: id, label: label, tier: tier, col: col,
      role: roleHint || familyRoleLabel(id),
      fam: meta && meta.familiarity != null ? meta.familiarity : (contact && contact.familiarity != null ? contact.familiarity : 0),
      attr: meta && meta.attraction != null ? meta.attraction : (contact && contact.attraction != null ? contact.attraction : 0)
    });
    return true;
  }
  function linkParentChild(parentId, childId) {
    if (parentId && childId && seen[parentId] && seen[childId]) edges.push({ type: 'child', a: parentId, b: childId });
  }
  function linkSpouse(a, b) {
    if (a && b && seen[a] && seen[b]) edges.push({ type: 'spouse', a: a, b: b });
  }
  function addPair(a, b, tier, col) {
    const okA = addPerson(a, tier, col, null);
    const okB = addPerson(b, tier, col + 1, null);
    if (okA && okB) linkSpouse(a, b);
    return okA || okB;
  }
  addPair('core_pp_gf', 'core_pp_gm', 0, 1);
  addPair('core_pm_gf', 'core_pm_gm', 0, 5);
  if (married) {
    addPair('core_sp_pp_gf', 'core_sp_pp_gm', 0, 9);
    addPair('core_sp_pm_gf', 'core_sp_pm_gm', 0, 13);
  }
  addPerson(CORE_CONTACT_IDS.father, 1, 2, '父亲');
  addPerson(CORE_CONTACT_IDS.mother, 1, 6, '母亲');
  if (married) {
    addPerson('core_sp_father', 1, 10, null);
    addPerson('core_sp_mother', 1, 14, null);
    linkParentChild('core_sp_pp_gf', 'core_sp_father');
    linkParentChild('core_sp_pp_gm', 'core_sp_father');
    linkParentChild('core_sp_pm_gf', 'core_sp_mother');
    linkParentChild('core_sp_pm_gm', 'core_sp_mother');
  }
  linkParentChild('core_pp_gf', CORE_CONTACT_IDS.father);
  linkParentChild('core_pp_gm', CORE_CONTACT_IDS.father);
  linkParentChild('core_pm_gf', CORE_CONTACT_IDS.mother);
  linkParentChild('core_pm_gm', CORE_CONTACT_IDS.mother);
  addPerson('player', 2, 5, '本人');
  if (married) {
    addPerson(CORE_CONTACT_IDS.spouse, 2, 7, '伴侣');
    linkSpouse('player', CORE_CONTACT_IDS.spouse);
    linkParentChild('core_sp_father', CORE_CONTACT_IDS.spouse);
    linkParentChild('core_sp_mother', CORE_CONTACT_IDS.spouse);
  }
  if (seen[CORE_CONTACT_IDS.father]) linkParentChild(CORE_CONTACT_IDS.father, 'player');
  if (seen[CORE_CONTACT_IDS.mother]) linkParentChild(CORE_CONTACT_IDS.mother, 'player');
  if (game.divorced && familyContactExists(CORE_CONTACT_IDS.exSpouse)) {
    addPerson(CORE_CONTACT_IDS.exSpouse, 2, 9, '前任');
  }
  const childIds = (game.children || []).filter(function (ch) { return ch && ch.monthsLeft > 0; }).map(function (ch) { return ch.contactId || ch.id; });
  childIds.forEach(function (cid, i) {
    if (!addPerson(cid, 3, 4 + i * 2, '子女')) return;
    linkParentChild('player', cid);
    if (married && seen[CORE_CONTACT_IDS.spouse]) linkParentChild(CORE_CONTACT_IDS.spouse, cid);
  });
  if (!nodes.length) return null;
  return { nodes: nodes, edges: edges, ownerId: ownerId };
}
function renderFamilyTreeSvg(graph, ownerId, width) {
  if (!graph || !graph.nodes.length) return '<p class="fold-meta">暂无家族成员</p>';
  width = width || 520;
  const colW = 56;
  const rowH = 72;
  const padX = 28;
  const padY = 24;
  const maxCol = graph.nodes.reduce(function (m, n) { return Math.max(m, n.col); }, 0);
  const maxTier = graph.nodes.reduce(function (m, n) { return Math.max(m, n.tier); }, 0);
  const height = padY * 2 + (maxTier + 1) * rowH + 20;
  width = Math.max(width, padX * 2 + (maxCol + 1) * colW);
  const pos = {};
  graph.nodes.forEach(function (n) {
    pos[n.id] = { x: padX + n.col * colW + colW / 2, y: padY + n.tier * rowH };
  });
  const tierLabels = ['祖辈', '父母辈', '本人辈', '子女辈'];
  let svg = '<svg viewBox="0 0 ' + width + ' ' + height + '" class="network-family-tree" style="width:100%;max-width:' + width + 'px;height:auto;background:var(--bg);border-radius:8px;border:1px solid var(--border)">';
  graph.edges.forEach(function (e) {
    const pa = pos[e.a];
    const pb = pos[e.b];
    if (!pa || !pb) return;
    if (e.type === 'spouse') {
      svg += '<line x1="' + pa.x + '" y1="' + pa.y + '" x2="' + pb.x + '" y2="' + pb.y + '" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.85"/>';
      return;
    }
    const midY = (pa.y + pb.y) / 2;
    svg += '<path d="M' + pa.x + ' ' + pa.y + ' L' + pa.x + ' ' + midY + ' L' + pb.x + ' ' + midY + ' L' + pb.x + ' ' + pb.y + '" fill="none" stroke="var(--border)" stroke-width="1.4"/>';
  });
  for (let t = 0; t <= maxTier; t++) {
    const y = padY + t * rowH - 10;
    if (y > 4) svg += '<text x="6" y="' + y + '" font-size="7" fill="var(--muted)">' + (tierLabels[t] || '') + '</text>';
  }
  graph.nodes.forEach(function (n) {
    const p = pos[n.id];
    if (!p) return;
    const isCenter = n.id === ownerId;
    const r = isCenter ? 18 : 15;
    const eid = typeof escNetId === 'function' ? escNetId(n.id) : String(n.id).replace(/'/g, "\\'");
    const clickable = n.id !== ownerId ? ' onclick="networkDrillPerson(\'' + eid + '\')" style="cursor:pointer"' : '';
    svg += '<g' + clickable + '>';
    svg += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + r + '" fill="' + (isCenter ? 'var(--accent)' : 'var(--card)') + '" stroke="var(--border)" stroke-width="1.5"/>';
    const short = (n.label || '').length > 3 ? (n.label || '').slice(0, 3) + '…' : (n.label || '?');
    svg += '<text x="' + p.x + '" y="' + (p.y + 3) + '" text-anchor="middle" font-size="8" fill="var(--text)" pointer-events="none">' + short + '</text>';
    if (n.role) svg += '<text x="' + p.x + '" y="' + (p.y + r + 11) + '" text-anchor="middle" font-size="7" fill="var(--accent)" pointer-events="none">' + n.role + '</text>';
    if (!isCenter && n.id !== 'player') {
      svg += '<text x="' + p.x + '" y="' + (p.y + r + 21) + '" text-anchor="middle" font-size="6.5" fill="var(--muted)" pointer-events="none">熟' + Math.round(n.fam || 0) + '/吸' + Math.round(n.attr || 0) + '</text>';
    }
    svg += '</g>';
  });
  svg += '</svg>';
  return svg;
}
function isInPlayerCircleKind(personId, kind) {
  const circles = game && game.playerCircles && game.playerCircles[kind];
  if (!circles) return false;
  return circles.some(function (circle) {
    return (circle.members || []).some(function (m) { return m.id === personId; });
  });
}
function contactModalGroupKey(c) {
  if (!c) return 'other';
  if (isFamilyCoreContact(c)) return 'family';
  if (contactQualifiesForFriendsCircle(c) || isInPlayerCircleKind(c.id, 'friends')) return 'friends';
  if (isInPlayerCircleKind(c.id, 'workplace')) return 'workplace';
  if (c.kind === 'classmate' || isInPlayerCircleKind(c.id, 'social')) return 'social';
  if (isInPlayerCircleKind(c.id, 'hobby')) return 'hobby';
  return 'other';
}
function groupContactsForModal(list) {
  const order = ['family', 'friends', 'workplace', 'social', 'hobby', 'other'];
  const buckets = {};
  order.forEach(function (k) { buckets[k] = []; });
  (list || []).forEach(function (c) {
    const k = contactModalGroupKey(c);
    buckets[k].push(c);
  });
  return order.filter(function (k) { return buckets[k].length; }).map(function (k) {
    return { key: k, label: CONTACT_GROUP_LABELS[k], contacts: buckets[k] };
  });
}
function isCircleFolded(key) {
  if (!game) return true;
  game.circleFoldState = game.circleFoldState || {};
  if (game.circleFoldState[key] == null) {
    if (String(key).indexOf('kind_') === 0) return false;
    return true;
  }
  return !!game.circleFoldState[key];
}
function toggleCircleFold(key) {
  if (!game) return;
  game.circleFoldState = game.circleFoldState || {};
  game.circleFoldState[key] = !isCircleFolded(key);
  if (typeof renderNetworkPanel === 'function') renderNetworkPanel(game.networkFocusId || 'player');
  else if (typeof updateUI === 'function') updateUI();
}
function fixChildSurnameAndName(ch) {
  if (!ch) return ch;
  if (ch.name && ch.name.length >= 2 && ch.surname && ch.name.indexOf(ch.surname) === 0) {
    const c = (game.contacts || []).find(function (x) { return x.id === (ch.contactId || ch.id); });
    if (c && ch.name) c.name = ch.name;
    return ch;
  }
  const companionDefault = typeof COMPANION_NAME !== 'undefined' ? COMPANION_NAME : '小艾';
  let sur = pickChildSurname(ch);
  if ((sur === '小' || sur === companionDefault) && ch.surname && ch.surname.length >= 1 && ch.surname !== '小') {
    sur = ch.surname;
  }
  if ((sur === '小' || sur === companionDefault) && ch.name && ch.name.length >= 2) {
    const fromName = surnameFromFullName(ch.name);
    if (fromName && fromName !== '小') sur = fromName;
  }
  const oldSur = ch.surname || surnameFromFullName(ch.name || '');
  ch.surname = sur;
  if (ch.name && ch.name.length > 1) {
    const curSur = surnameFromFullName(ch.name);
    const given = ch.name.slice(curSur.length);
    if (curSur !== sur && given) ch.name = sur + given;
    else if (!given && ch.name.indexOf(sur) !== 0) {
      ch.name = sur + ch.name.slice(oldSur.length);
    }
  }
  const c = (game.contacts || []).find(function (x) { return x.id === (ch.contactId || ch.id); });
  if (c && ch.name) c.name = ch.name;
  return ch;
}
function migrateChildrenSurnames() {
  if (!game) return;
  migrateChildrenArray();
  (game.children || []).forEach(function (ch, i) {
    if (!ch) return;
    backfillChildEntry(ch, i);
    fixChildSurnameAndName(ch);
  });
  syncChildRecordFromChildren();
}
function pruneObsoleteGreatGrandContacts() {
  if (!game || !game.contacts) return;
  const dropKinds = ['great_grandparent', 'spouse_great_grandparent'];
  game.contacts = game.contacts.filter(function (c) {
    return dropKinds.indexOf(c.kind) < 0;
  });
}
function repairAllFamilyAncestorAges() {
  if (!game) return;
  FAMILY_ANCESTOR_DEFS.forEach(function (d) { ensureFamilyAncestorContact(d); });
  if (game.married && !game.divorced) {
    SPOUSE_ANCESTOR_DEFS.forEach(function (d) { ensureFamilyAncestorContact(d); });
  }
}
function repairFamilyAttractionOnce() {
  if (!game || !game.contacts) return;
  (game.contacts || []).forEach(function (c) {
    if (!c || typeof isFamilyKind !== 'function' || !isFamilyKind(c)) return;
    if (c.kind === 'spouse') return;
    if (c.attraction == null || c.attraction === 0) {
      c.attraction = 20 + Math.floor(familyRng((c.id || '') + '_attrfix')() * 35);
    }
  });
}
function migrateFamilyCircles() {
  if (!game) return;
  if (game.familyCirclesVersion >= 4) {
    migrateChildrenSurnames();
    (game.children || []).forEach(function (ch) {
      if (ch) repairChildBirthDate(ch);
    });
    repairAllFamilyAncestorAges();
    syncFamilyCircle();
    return;
  }
  if (game.familyCirclesVersion >= 3) {
    game.familyCirclesVersion = 4;
    repairFamilyAttractionOnce();
    migrateChildrenSurnames();
    (game.children || []).forEach(function (ch) {
      if (ch) repairChildBirthDate(ch);
    });
    repairAllFamilyAncestorAges();
    syncFamilyCircle();
    return;
  }
  if (game.familyCirclesVersion >= 2) {
    game.familyCirclesVersion = 4;
    pruneObsoleteGreatGrandContacts();
    repairFamilyAttractionOnce();
    migrateChildrenSurnames();
    (game.children || []).forEach(function (ch) {
      if (ch) repairChildBirthDate(ch);
    });
    repairAllFamilyAncestorAges();
    syncFamilyCircle();
    return;
  }
  if (game.familyCirclesVersion >= 1) {
    game.familyCirclesVersion = 4;
    pruneObsoleteGreatGrandContacts();
    repairFamilyAttractionOnce();
    migrateChildrenSurnames();
    (game.children || []).forEach(function (ch) {
      if (ch) repairChildBirthDate(ch);
    });
    repairAllFamilyAncestorAges();
    syncFamilyCircle();
    return;
  }
  game.familyCirclesVersion = 4;
  game.circleFoldState = game.circleFoldState || {};
  (game.contacts || []).forEach(function (c) {
    if (c.followed == null) c.followed = false;
  });
  repairFamilyAttractionOnce();
  migrateChildrenSurnames();
  (game.children || []).forEach(function (ch) {
    if (ch) repairChildBirthDate(ch);
  });
  if (typeof syncSplitParentsContacts === 'function') syncSplitParentsContacts();
  syncFamilyCircle();
}
