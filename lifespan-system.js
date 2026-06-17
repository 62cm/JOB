/* 寿命 · 自然死亡 — 由 build.js 注入（在 dream-system 之后） */
const LIFESPAN_GAME_START_YEAR = 2010;
const LIFESPAN_DEFAULT_EXPECT = 80;

function lifespanRng(seed) {
  let s = Math.abs(seed || 1);
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
function rollLifeExpectancy(base, rng) {
  const r = rng || Math.random;
  const b = base != null ? base : LIFESPAN_DEFAULT_EXPECT;
  return Math.max(40, Math.min(120, b + Math.floor(r() * 11) - 5));
}
function rollDeathWeekFromAge(startAge, lifeExpectancy, rng) {
  const r = rng || Math.random;
  const yearsLeft = Math.max(1, lifeExpectancy - startAge);
  const baseWeek = yearsLeft * 52;
  const jitter = Math.floor(r() * 52);
  return Math.max(1, baseWeek + jitter - 26);
}
function initPlayerLifespan(profile) {
  if (!game) return;
  if (!game.birthYear) game.birthYear = typeof PLAYER_BIRTH_YEAR !== 'undefined' ? PLAYER_BIRTH_YEAR : 1988;
  const startAge = typeof START_AGE !== 'undefined' ? START_AGE : 22;
  if (game.lifeExpectancy == null) game.lifeExpectancy = rollLifeExpectancy(LIFESPAN_DEFAULT_EXPECT, lifespanRng((game.stockSeed || 1) + 401));
  if (profile && profile.lifeExpectancy != null) game.lifeExpectancy = profile.lifeExpectancy;
  if (game.deathWeek == null) {
    game.deathWeek = rollDeathWeekFromAge(startAge, game.lifeExpectancy, lifespanRng((game.stockSeed || 1) + 402));
  }
}
function initParentLifespans() {
  if (!game || game.parentsInheritanceSettled) return;
  const pb = game.birthYear || LIFESPAN_GAME_START_YEAR - (typeof START_AGE !== 'undefined' ? START_AGE : 22);
  const rng = lifespanRng((game.stockSeed || 1) + 503 + (game.week || 0));
  const father = game.contacts && game.contacts.find(function (c) { return c.id === CORE_CONTACT_IDS.father; });
  const mother = game.contacts && game.contacts.find(function (c) { return c.id === CORE_CONTACT_IDS.mother; });
  [father, mother].forEach(function (p, i) {
    if (!p || p.dead) return;
    if (p.birthYear == null) {
      const ageWhenPlayerBorn = i === 0 ? (28 + Math.floor(rng() * 7)) : (26 + Math.floor(rng() * 6));
      p.birthYear = pb - ageWhenPlayerBorn;
    }
    if (p.lifeExpectancy == null) p.lifeExpectancy = rollLifeExpectancy(78 + i * 2, rng);
    if (p.deathWeek == null) {
      const ageAtStart = LIFESPAN_GAME_START_YEAR - p.birthYear;
      p.deathWeek = rollDeathWeekFromAge(ageAtStart, p.lifeExpectancy, rng);
    }
  });
}
function initContactLifespan(c, seed) {
  if (!c || c.dead) return c;
  if (typeof isFamilyKind === 'function' && isFamilyKind(c)) return c;
  const rng = lifespanRng(seed || (c.id || '').length * 17 + (game ? game.week : 0));
  if (c.birthYear == null) {
    const playerAge = typeof getPlayerAge === 'function' ? getPlayerAge() : 22;
    const delta = 2 + Math.floor(rng() * 12);
    c.birthYear = (game && game.birthYear ? game.birthYear : 1988) - delta + Math.floor(rng() * (delta * 2));
  }
  if (c.lifeExpectancy == null) c.lifeExpectancy = rollLifeExpectancy(76 + Math.floor(rng() * 10), rng);
  if (c.deathWeek == null) {
    const ageNow = Math.max(1, (typeof getPlayerAge === 'function' ? getPlayerAge() : 22) + (c.birthYear < (game.birthYear || 1988) ? 4 : -2));
    c.deathWeek = (game ? game.week : 0) + rollDeathWeekFromAge(ageNow, c.lifeExpectancy, rng);
  }
  return c;
}
function initCompanionLifespan() {
  if (!game || !game.companion) return;
  const c = game.companion;
  const rng = lifespanRng((game.stockSeed || 1) + 607);
  if (c.birthYear == null) c.birthYear = (game.birthYear || 1988) + Math.floor(rng() * 5) - 2;
  if (c.lifeExpectancy == null) c.lifeExpectancy = rollLifeExpectancy(game.lifeExpectancy || LIFESPAN_DEFAULT_EXPECT, rng);
  if (c.deathWeek == null) {
    const ageAtStart = LIFESPAN_GAME_START_YEAR - c.birthYear;
    c.deathWeek = rollDeathWeekFromAge(ageAtStart, c.lifeExpectancy, rng);
  }
}
function migrateLifespanSystem() {
  if (!game) return;
  initPlayerLifespan(null);
  if (typeof syncSplitParentsContacts === 'function') syncSplitParentsContacts();
  initParentLifespans();
  initCompanionLifespan();
  (game.contacts || []).forEach(function (c) {
    if (c.kind === 'father' || c.kind === 'mother') return;
    if (isCoreContactKind && isCoreContactKind(c) && c.kind !== 'bff') return;
    initContactLifespan(c, (c.id || '').length * 31 + (game.stockSeed || 0));
  });
}
function areParentsAlive() {
  if (!game || game.parentsInheritanceSettled) return false;
  const father = game.contacts && game.contacts.find(function (c) { return c.id === CORE_CONTACT_IDS.father; });
  const mother = game.contacts && game.contacts.find(function (c) { return c.id === CORE_CONTACT_IDS.mother; });
  if (!father && !mother) return !game.parentsInheritanceSettled;
  return (!father || !father.dead) || (!mother || !mother.dead);
}
function bothParentsDead() {
  if (!game || game.parentsInheritanceSettled) return false;
  const father = game.contacts && game.contacts.find(function (c) { return c.id === CORE_CONTACT_IDS.father; });
  const mother = game.contacts && game.contacts.find(function (c) { return c.id === CORE_CONTACT_IDS.mother; });
  if (!father && !mother) return false;
  const fDead = !father || father.dead;
  const mDead = !mother || mother.dead;
  return fDead && mDead;
}
function markContactDead(c, reason) {
  if (!c || c.dead) return;
  c.dead = true;
  const name = c.name || '?';
  if (typeof addLog === 'function') addLog('🕯 ' + name + ' 离世' + (reason ? '（' + reason + '）' : ''), 'warn');
}
function tickLifespanDeaths() {
  if (!game || game.gameOver) return;
  migrateLifespanSystem();
  const week = game.week;
  if (game.deathWeek != null && week >= game.deathWeek && game.endingType !== 'overwork') {
    game.endingType = 'lifespan';
    if (typeof endGame === 'function') endGame('lifespan');
    return;
  }
  const father = game.contacts && game.contacts.find(function (c) { return c.id === CORE_CONTACT_IDS.father; });
  const mother = game.contacts && game.contacts.find(function (c) { return c.id === CORE_CONTACT_IDS.mother; });
  if (father && !father.dead && father.deathWeek != null && week >= father.deathWeek) markContactDead(father, '寿终');
  if (mother && !mother.dead && mother.deathWeek != null && week >= mother.deathWeek) markContactDead(mother, '寿终');
  if (bothParentsDead() && typeof settleParentsInheritance === 'function') settleParentsInheritance();
  if (game.companion && !game.companion.dead && !game.divorced && game.married) {
    if (game.companion.deathWeek != null && week >= game.companion.deathWeek) {
      game.companion.dead = true;
      game.spouseDeceased = true;
      const pn = game.partnerDisplayName || '伴侣';
      if (typeof addLog === 'function') addLog('🕯 ' + pn + ' 离世（寿终）', 'warn');
      const sp = game.contacts && game.contacts.find(function (c) { return c.id === CORE_CONTACT_IDS.spouse; });
      if (sp) sp.dead = true;
    }
  }
  (game.contacts || []).forEach(function (c) {
    if (c.dead) return;
    if (c.kind === 'father' || c.kind === 'mother' || c.kind === 'spouse') return;
    if (c.deathWeek != null && week >= c.deathWeek) markContactDead(c, '寿终');
  });
}
function personAgeLabel(person) {
  if (!person) return '';
  if (person.dead) return '已离世';
  const by = person.birthYear;
  if (by == null) return '';
  const age = LIFESPAN_GAME_START_YEAR - by + Math.floor((game ? game.week : 0) / 52);
  return age + ' 岁 · 预期 ' + (person.lifeExpectancy || '?') + ' 岁';
}
function parentsSupportStatusHtml() {
  if (!game) return '';
  if (game.parentsInheritanceSettled) {
    const amt = game.parentsInheritanceAmount || 0;
    return '<div style="color:' + (amt >= 0 ? 'var(--green)' : 'var(--red)') + '">父母遗产结算：' +
      (amt >= 0 ? '¥' : '-¥') + Math.abs(amt).toLocaleString() + '</div>';
  }
  if (!areParentsAlive()) return '';
  if (game.livingOffParents) return '<div style="color:var(--orange)">啃老中（父母在世）</div>';
  return '<div style="font-size:.72rem;color:var(--muted)">父母在世 · 困难时可依靠父母接济</div>';
}
