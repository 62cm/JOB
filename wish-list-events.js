/* 愿望清单 · 生日 / 约会 / 孩子讨要 — 由 build.js 注入 */
const PLAYER_WISH_AWARE_FAM = 75;
const CHILD_GIFT_MIN_AGE = 3;
const CHILD_GIFT_ASK_CHANCE = 0.16;
const CHILD_GIFT_CATALOG = [
  { label: '乐高积木', amount: 180, weight: 12, desc: '想要一套能拼很久的积木' },
  { label: '毛绒玩具', amount: 120, weight: 14, desc: '橱窗里那只很大的玩偶' },
  { label: '绘本套装', amount: 150, weight: 11, desc: '幼儿园小朋友都在看的那套' },
  { label: '新书包', amount: 260, weight: 9, desc: '带轮子的那种书包' },
  { label: '游乐园门票', amount: 680, weight: 7, desc: '周末去游乐园' },
  { label: '儿童手表', amount: 520, weight: 5, desc: '能打电话的手表' },
  { label: '冰淇淋基金', amount: 80, weight: 10, desc: '「就买一个」' },
  { label: '新球鞋', amount: 420, weight: 8, desc: '同学都有新款' }
];
const PLAYER_DATE_WISHES = [
  { label: '短途旅行基金', amount: 2800, desc: '约会时许下的愿望' },
  { label: '一顿仪式感晚餐', amount: 1200, desc: '想认真庆祝一下' },
  { label: '理想项目推进费', amount: 3500, desc: '离梦想更近一点' },
  { label: '新外套', amount: 980, desc: '换季了想要一件新的' }
];

function wishListRng(seed) {
  let s = Math.abs(seed || 1);
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function calendarDayAtWeek(week, dayOffset) {
  const start = typeof getGameStartDate === 'function' ? getGameStartDate() : (typeof START_DATE !== 'undefined' ? new Date(START_DATE) : new Date(2024, 0, 1));
  const d = new Date(start.getTime());
  d.setDate(d.getDate() + (week || 0) * 7 + (dayOffset || 0));
  return d;
}

function ensurePersonBirthday(person, seedKey) {
  if (!person || person.birthMonth) return person;
  if (person.birthWeek != null) {
    const d = calendarDayAtWeek(person.birthWeek, 3);
    person.birthMonth = d.getMonth() + 1;
    person.birthDay = d.getDate();
    return person;
  }
  const rng = wishListRng(((game && game.stockSeed) || 1) + String(seedKey || person.id || '').length * 31);
  person.birthMonth = 1 + Math.floor(rng() * 12);
  person.birthDay = 1 + Math.floor(rng() * 28);
  return person;
}

function isBirthdayThisWeek(birthMonth, birthDay, week) {
  if (!birthMonth || !birthDay) return false;
  for (let i = 0; i < 7; i++) {
    const d = calendarDayAtWeek(week, i);
    if (d.getMonth() + 1 === birthMonth && d.getDate() === birthDay) return true;
  }
  return false;
}

function wishCalendarYear() {
  return typeof getGameCalendarYear === 'function' ? getGameCalendarYear() : (2024 + Math.floor(((game && game.week) || 0) / 52));
}

function wishCalendarYear() {
  return typeof getGameCalendarYear === 'function' ? getGameCalendarYear() : (2024 + Math.floor(((game && game.week) || 0) / 52));
}

function getPlayerWishAwareContacts() {
  if (!game) return [];
  const out = [];
  const seen = {};
  function add(c) {
    if (!c || c.dead || c.unreachable || seen[c.id]) return;
    seen[c.id] = true;
    out.push(c);
  }
  (game.contacts || []).forEach(function (c) {
    if (!c) return;
    if (typeof isParentContact === 'function' && isParentContact(c)) {
      if (!game.parentsInheritanceSettled) add(c);
      return;
    }
    if (c.kind === 'spouse' || c.id === 'core_spouse') { add(c); return; }
    if (typeof isMarkedIntimateRelation === 'function' && isMarkedIntimateRelation(c)) { add(c); return; }
    if ((c.familiarity || 0) >= PLAYER_WISH_AWARE_FAM) add(c);
  });
  if (game.married && !game.divorced) {
    const sp = (game.contacts || []).find(function (c) { return c && (c.kind === 'spouse' || c.id === 'core_spouse'); });
    if (!sp) add({ id: 'companion', name: game.partnerDisplayName || '伴侣', kind: 'spouse', familiarity: 80 });
  }
  return out;
}

function assignPlayerWishAwareContacts(entry) {
  if (!entry) return entry;
  const aware = getPlayerWishAwareContacts();
  entry.knownBy = aware.map(function (c) { return c.id; });
  entry.knownByNames = aware.map(function (c) { return c.name || '熟人'; }).slice(0, 6);
  return entry;
}

function playerWishIdentityKey(r) {
  return (r.label || '') + '|' + (r.source || r.kind || '') + '|' + (r.amount || 0);
}

function hasOpenPlayerWishLike(offer) {
  if (!game || !game.playerWishHistory) return false;
  const k = playerWishIdentityKey(offer);
  return game.playerWishHistory.some(function (r) {
    if (!r || r.fulfilled || r.status === 'fulfilled' || r.status === 'refused') return false;
    return playerWishIdentityKey(r) === k;
  });
}

function scanRecentLogForWishHints(limit) {
  const hints = [];
  const log = (game && game.log) ? game.log.slice(-(limit || 14)) : [];
  const rules = [
    { kw: ['加班', '被迫加班', 'KPI', '下班'], wish: { label: '换一份不卷的工作', amount: 0, desc: '最近工作太累，心里冒出这个念头', source: 'work' } },
    { kw: ['压力'], wish: { label: '短途散心', amount: 1500 + Math.floor(Math.random() * 2500), desc: '想暂时逃离日常喘口气', source: 'stress' } },
    { kw: ['裁员', '失业', '离职', '被辞'], wish: { label: '一点缓冲金', amount: 2500 + Math.floor(Math.random() * 3500), desc: '职业变动后想要安全感', source: 'career' } },
    { kw: ['升职', '加薪', '涨薪'], wish: { label: '犒劳自己的努力', amount: 800 + Math.floor(Math.random() * 2200), desc: '值得奖赏自己一次', source: 'career' } },
    { kw: ['约会', '咖啡', '公园', '酒吧', '夜店'], wish: { label: '下次相处的惊喜', amount: 600 + Math.floor(Math.random() * 1800), desc: '相处时记下的一个小念头', source: 'social' } },
    { kw: ['手机', '换机'], wish: { label: '心仪的新手机', amount: 4000 + Math.floor(Math.random() * 8000), desc: '看上了更好的机型', source: 'daily' } },
    { kw: ['亏损', '套牢', '股票'], wish: { label: '回血的缓冲', amount: 2000 + Math.floor(Math.random() * 3000), desc: '投资受挫后想缓一缓', source: 'finance' } },
    { kw: ['孩子', '育儿', '幼儿园'], wish: { label: '给孩子的小惊喜', amount: 400 + Math.floor(Math.random() * 1200), desc: '想让孩子开心一下', source: 'family' } },
    { kw: ['理想', '梦想', '赞助'], wish: null, source: 'dream' }
  ];
  log.forEach(function (entry) {
    const text = typeof entry === 'string' ? entry : (entry && entry.msg) || '';
    if (!text) return;
    rules.forEach(function (rule) {
      if (!rule.kw.some(function (k) { return text.indexOf(k) >= 0; })) return;
      if (rule.source === 'dream' && game.playerDream && game.playerDream.title) {
        hints.push({
          label: '推进「' + game.playerDream.title + '」',
          amount: 800 + Math.floor((game.playerDream.progress || 0) * 40),
          desc: '从最近的经历里长出来的念头',
          source: 'dream'
        });
      } else if (rule.wish) {
        hints.push(Object.assign({}, rule.wish));
      }
    });
  });
  return hints;
}

function collectExperienceWishCandidates() {
  const hints = scanRecentLogForWishHints();
  if (!game) return hints;
  if ((game.stress || 0) >= 7) {
    hints.push({ label: '彻底放空几天', amount: 1600 + Math.floor(Math.random() * 2400), desc: '压力太高，想什么都不做', source: 'stress' });
  }
  if (game.employed && game.daily && (game.daily.slotHoursUsed || 0) >= 6) {
    hints.push({ label: '睡个好觉的装备', amount: 900 + Math.floor(Math.random() * 1100), desc: '加班太多，想改善休息', source: 'work' });
  }
  if (!game.ownsHome && !game.villaOwned && (game.rentMonthly || 0) > 0) {
    hints.push({
      label: '属于自己的小空间',
      amount: Math.min(80000, Math.max(8000, (game.rentMonthly || 3000) * 4)),
      desc: '租房生活让人想要一处归属',
      source: 'housing'
    });
  }
  if (game.playerDream && game.playerDream.active && (game.playerDream.progress || 0) >= 15) {
    hints.push({
      label: '离「' + game.playerDream.title + '」更近一步',
      amount: 1000 + Math.floor((game.playerDream.progress || 0) * 55),
      desc: '理想还在推进，需要下一笔投入',
      source: 'dream'
    });
  }
  if ((game.children || []).length > 0) {
    hints.push({ label: '陪孩子的周末', amount: 500 + Math.floor(Math.random() * 1500), desc: '想认真陪陪孩子', source: 'family' });
  }
  if (game.unemployed || !game.employed) {
    hints.push({ label: '安稳下来的底气', amount: 3000 + Math.floor(Math.random() * 4000), desc: '没工作时特别想要缓冲', source: 'career' });
  }
  return hints;
}

function tickPlayerExperienceWishes() {
  if (!game || game.gameOver) return;
  if (typeof recordPlayerWish !== 'function') return;
  if (game.lastPlayerWishGenWeek === game.week) return;
  if (Math.random() > 0.24) return;
  const candidates = collectExperienceWishCandidates();
  if (!candidates.length) return;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  if (hasOpenPlayerWishLike(pick)) return;
  game.lastPlayerWishGenWeek = game.week;
  recordPlayerWish(Object.assign({}, pick, { kind: 'experience' }), 'open');
  const aware = getPlayerWishAwareContacts();
  if (aware.length) {
    const names = aware.slice(0, 3).map(function (c) { return c.name; }).join('、');
    addLog('💭 经历让你冒出愿望「' + pick.label + '」· ' + names + ' 等人可能察觉到', 'info');
  } else {
    addLog('💭 经历让你冒出愿望「' + pick.label + '」', 'info');
  }
}

function patronWillingness(c, wish) {
  if (!c || !wish) return 0;
  let s = (c.familiarity || 0) * 0.42 + (c.attraction || 0) * 0.33;
  if (typeof isMarkedIntimateRelation === 'function' && isMarkedIntimateRelation(c)) s += 38;
  if (c.kind === 'spouse' || c.id === 'core_spouse' || c.id === 'companion') s += 42;
  if (wish.knownBy && wish.knownBy.length && wish.knownBy.indexOf(c.id) < 0) s *= 0.3;
  if ((wish.amount || 0) > 80000) s *= 0.45;
  else if ((wish.amount || 0) > 20000) s *= 0.72;
  return s / 100;
}

function findPlayerWishRecord(wish) {
  if (!game || !game.playerWishHistory || !wish) return null;
  return game.playerWishHistory.find(function (r) {
    return r === wish || (r.label === wish.label && (r.week || 0) === (wish.week || 0) && (r.amount || 0) === (wish.amount || 0));
  }) || null;
}

function markPlayerWishResolved(wish, status, extra) {
  const row = findPlayerWishRecord(wish);
  if (!row) return;
  row.status = status;
  row.fulfilled = status === 'fulfilled';
  if (extra) Object.assign(row, extra);
}

function promptPatronWishOffer(patron, wish) {
  if (!patron || !wish) return;
  if (typeof autoLifeRunning !== 'undefined' && autoLifeRunning) {
    markPlayerWishResolved(wish, 'fulfilled', {
      fulfilledBy: patron.id,
      fulfilledByName: patron.name,
      patronPaid: wish.amount || 0
    });
    if ((wish.amount || 0) > 0) {
      game.cash = (game.cash || 0) + (wish.amount || 0);
      game.money = (game.money || 0) + (wish.amount || 0);
      if (typeof ledgerAddIncome === 'function') ledgerAddIncome('gift', '🎁', patron.name + '帮你买单', wish.amount || 0);
    }
    addLog('🎁 ' + patron.name + ' 悄悄帮你实现了「' + wish.label + '」', 'success');
    return;
  }
  const pn = patron.name || '熟人';
  const amt = wish.amount || 0;
  let html = '<p><b>' + pn + '</b> 察觉你心里有「' + (wish.label || '愿望') + '」。</p>';
  if (wish.desc) html += '<p class="fold-meta">' + wish.desc + '</p>';
  html += amt > 0
    ? '<p>TA 说：「这份我来买单，约 <b>¥' + amt.toLocaleString() + '</b>。」</p>'
    : '<p>TA 说：「这个我来帮你想办法。」</p>';
  html += '<p class="fold-meta">接受：愿望达成 · 拒绝：TA 不会勉强</p>';
  const accept = function () {
    markPlayerWishResolved(wish, 'fulfilled', {
      fulfilledBy: patron.id,
      fulfilledByName: patron.name,
      patronPaid: amt
    });
    if (amt > 0) {
      game.cash = (game.cash || 0) + amt;
      game.money = (game.money || 0) + amt;
      if (typeof ledgerAddIncome === 'function') ledgerAddIncome('gift', '🎁', pn + '帮你买单·' + wish.label, amt);
    }
    if (typeof bumpContactFamiliarity === 'function' && patron.id !== 'companion') bumpContactFamiliarity(patron, 2);
    else if (typeof adjustSpouseIntimacy === 'function' && (patron.kind === 'spouse' || patron.id === 'companion')) adjustSpouseIntimacy(1);
    addLog('🎁 ' + pn + ' 帮你买单 · 「' + wish.label + '」' + (amt > 0 ? ' ¥' + amt.toLocaleString() : ''), 'success');
    if (typeof renderIdealPanel === 'function') renderIdealPanel();
    if (typeof updateUI === 'function') updateUI();
    if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  };
  const decline = function () {
    addLog('🎁 ' + pn + ' 想帮你实现「' + wish.label + '」· 你婉拒了', 'info');
    if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  };
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '🎁',
      title: pn + ' · 帮你买单',
      html: html,
      buttons: [
        { text: amt > 0 ? '接受 ¥' + amt.toLocaleString() : '接受帮助', primary: true, handler: accept },
        { text: '婉拒', handler: decline }
      ]
    });
  } else accept();
}

function tickPlayerWishPatronOffers() {
  if (!game || game.gameOver) return;
  if (typeof consumeModalOpen !== 'undefined' && consumeModalOpen) return;
  if (Math.random() > 0.13) return;
  const rows = typeof mergePlayerWishRows === 'function' ? mergePlayerWishRows() : (game.playerWishHistory || []);
  const open = rows.filter(function (r) {
    return r && !r.fulfilled && r.status !== 'fulfilled' && r.status !== 'refused' && r.status !== 'broke';
  });
  if (!open.length) return;
  const wish = open[Math.floor(Math.random() * open.length)];
  const aware = getPlayerWishAwareContacts().filter(function (c) {
    return !wish.knownBy || !wish.knownBy.length || wish.knownBy.indexOf(c.id) >= 0;
  });
  if (!aware.length) return;
  aware.sort(function (a, b) { return patronWillingness(b, wish) - patronWillingness(a, wish); });
  const patron = aware[0];
  if (patronWillingness(patron, wish) < 0.26) return;
  if (game.lastPatronOfferWeek === game.week) return;
  game.lastPatronOfferWeek = game.week;
  promptPatronWishOffer(patron, wish);
}

function pushWishEntry(arr, offer, meta) {
  if (!arr || !offer) return;
  const entry = typeof normalizeGiftWishEntry === 'function' ? normalizeGiftWishEntry({
    date: typeof getGiftWishDateStr === 'function' ? getGiftWishDateStr() : ('第' + (game.week || 0) + '周'),
    week: game.week || 0,
    label: offer.label || '愿望',
    desc: offer.desc || (meta && meta.desc) || '',
    amount: offer.amount || 0,
    fulfilled: false,
    status: 'open',
    kind: (meta && meta.kind) || offer.kind || 'daily',
    occasion: (meta && meta.occasion) || offer.occasion || null,
    calendarYear: wishCalendarYear(),
    ownerId: meta && meta.ownerId
  }) : Object.assign({}, offer, { status: 'open', week: game.week || 0 });
  if (meta && meta.ownerId === 'player') assignPlayerWishAwareContacts(entry);
  arr.push(entry);
  if (arr.length > 80 && typeof compactGiftWishHistoryForSave === 'function') {
    arr.splice(0, arr.length, ...compactGiftWishHistoryForSave(arr, 80));
  }
}

function pickWeightedWish(pool) {
  if (!pool || !pool.length) return null;
  const total = pool.reduce(function (s, t) { return s + (t.weight || 1); }, 0);
  let r = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    r -= (pool[i].weight || 1);
    if (r <= 0) return pool[i];
  }
  return pool[0];
}

function pickBirthdayWishOffers(count, cashHint) {
  count = count || 3;
  cashHint = cashHint || (game.cash || 5000);
  let pool = [];
  if (typeof DATE_GIFT_CATALOG !== 'undefined') {
    pool = DATE_GIFT_CATALOG.filter(function (t) { return t.amount <= cashHint * 1.5; });
  }
  if (!pool.length) pool = PLAYER_DATE_WISHES.slice();
  const out = [];
  for (let i = 0; i < count; i++) {
    const g = pickWeightedWish(pool);
    if (g) out.push({ label: g.label, amount: g.amount, desc: '生日愿望清单 · ' + (g.desc || '') });
  }
  return out;
}

function pickChildGiftOffer(ch) {
  const age = typeof getChildAgeYears === 'function' ? getChildAgeYears(ch) : 0;
  let pool = CHILD_GIFT_CATALOG.filter(function (t) {
    return age >= 6 ? true : t.amount <= 500;
  });
  if (!pool.length) pool = CHILD_GIFT_CATALOG;
  const g = pickWeightedWish(pool);
  return g ? { label: g.label, amount: g.amount, desc: g.desc, kind: 'child', occasion: 'child' } : null;
}

function publishBirthdayWishList(ownerName, targetArr, ownerId, offers) {
  if (!targetArr) return;
  offers.forEach(function (o) {
    pushWishEntry(targetArr, o, { kind: 'birthday', occasion: 'birthday', desc: '生日愿望清单', ownerId: ownerId });
  });
  addLog('🎂 ' + ownerName + ' 发布了生日愿望清单（' + offers.length + ' 项）', 'info');
}

function notifyBirthdayWishListModal(ownerName, offers, onClose) {
  if (typeof autoLifeRunning !== 'undefined' && autoLifeRunning) {
    if (typeof onClose === 'function') onClose();
    return;
  }
  if (typeof consumeModalOpen !== 'undefined' && consumeModalOpen) {
    if (typeof onClose === 'function') onClose();
    return;
  }
  let html = '<p><b>' + ownerName + '</b> 的生日到了，发来愿望清单：</p><ul style="margin:8px 0;padding-left:18px;line-height:1.55;font-size:.85rem">';
  offers.forEach(function (o) {
    html += '<li><b>' + o.label + '</b> · ¥' + (o.amount || 0).toLocaleString() + '</li>';
  });
  html += '</ul><p class="fold-meta">可在「理想」页查看 · 熟悉的人会察觉并可能帮你买单</p>';
  const done = function () {
    if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
    if (typeof onClose === 'function') onClose();
  };
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '🎂', title: '生日愿望清单', html: html, buttons: [{ text: '收到了', primary: true, handler: done }] });
  } else done();
}

function tickPersonBirthdayWishes(person, name, targetArr, ownerId, lastYearField) {
  if (!person || !targetArr) return;
  ensurePersonBirthday(person, ownerId || name);
  if (!isBirthdayThisWeek(person.birthMonth, person.birthDay, game.week || 0)) return;
  const y = wishCalendarYear();
  if (person[lastYearField] === y) return;
  person[lastYearField] = y;
  const offers = pickBirthdayWishOffers(2 + Math.floor(Math.random() * 2));
  publishBirthdayWishList(name, targetArr, ownerId, offers);
  notifyBirthdayWishListModal(name, offers);
}

function tickBirthdayWishLists() {
  if (!game || game.gameOver) return;
  if (typeof ensureGiftWishHistory === 'function') ensureGiftWishHistory();
  if (!game.playerWishHistory) game.playerWishHistory = [];
  ensurePersonBirthday(game, 'player');
  tickPersonBirthdayWishes(game, game.playerName || '你', game.playerWishHistory, 'player', 'lastBirthdayWishYear');

  if (game.married && !game.divorced) {
    if (!game.companion) game.companion = {};
    ensurePersonBirthday(game.companion, 'companion');
    const pn = game.partnerDisplayName || '伴侣';
    tickPersonBirthdayWishes(game.companion, pn, game.giftWishHistory, 'partner', 'lastBirthdayWishYear');
  }

  (game.contacts || []).forEach(function (c) {
    if (!c || c.dead || c.unreachable) return;
    if (typeof isParentContact === 'function' && isParentContact(c)) return;
    if (!(typeof isMarkedIntimateRelation === 'function' && isMarkedIntimateRelation(c)) &&
      !(typeof contactHasAffairRecord === 'function' && contactHasAffairRecord(c)) &&
      (c.familiarity || 0) < 70) return;
    if (!c.wishHistory) c.wishHistory = [];
    const dn = typeof contactDisplayName === 'function' ? contactDisplayName(c) : c.name;
    tickPersonBirthdayWishes(c, dn, c.wishHistory, c.id, 'lastBirthdayWishYear');
  });
}

function ensureChildWishHistory(ch) {
  if (!ch.wishHistory) ch.wishHistory = [];
  const c = typeof findContact === 'function' ? findContact(ch.contactId || ch.id) : null;
  if (c) {
    if (!c.wishHistory) c.wishHistory = ch.wishHistory;
    else ch.wishHistory = c.wishHistory;
  }
  return ch.wishHistory;
}

function promptChildGiftAsk(ch, offer) {
  if (!ch || !offer) return;
  if (typeof autoLifeRunning !== 'undefined' && autoLifeRunning) {
    pushWishEntry(ensureChildWishHistory(ch), offer, { kind: 'child', occasion: 'child', ownerId: ch.id });
    addLog('🧸 ' + (ch.name || '孩子') + ' 讨要「' + offer.label + '」', 'info');
    return;
  }
  const name = ch.name || '孩子';
  const ageStr = typeof formatChildAge === 'function' ? formatChildAge(ch) : '';
  const html = '<p><b>' + name + '</b>' + (ageStr ? '（' + ageStr + '）' : '') + ' 递来一张小愿望条：</p>' +
    '<p>「想要 <b>' + offer.label + '</b>」· 约 ¥' + offer.amount.toLocaleString() + '</p>' +
    (offer.desc ? '<p class="fold-meta">' + offer.desc + '</p>' : '') +
    '<p class="fold-meta">3 岁以后的孩子会时不时讨要礼物</p>';
  const record = function (status, paid) {
    const entry = Object.assign({}, offer, { kind: 'child', occasion: 'child' });
    pushWishEntry(ensureChildWishHistory(ch), entry, { kind: 'child', occasion: 'child', ownerId: ch.id });
    const arr = ensureChildWishHistory(ch);
    if (arr.length) arr[arr.length - 1].status = status;
    if (status === 'fulfilled' && paid) {
      game.cash -= paid;
      if (typeof ledgerAddExpense === 'function') ledgerAddExpense('family', '🧸', '给孩子买礼物', paid, false);
      addLog('🧸 给 ' + name + ' 买了「' + offer.label + '」· ¥' + paid.toLocaleString(), 'success');
    } else if (status === 'refused') {
      addLog('🧸 ' + name + ' 失望地收起了愿望条', 'warn');
    } else if (status === 'broke') {
      addLog('🧸 答应不了 ' + name + ' 的「' + offer.label + '」· 囊中羞涩', 'warn');
    }
  };
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '🧸', title: name + ' 讨要礼物', html: html,
      buttons: [
        { text: '买给你 ¥' + offer.amount.toLocaleString(), primary: true, handler: function () {
          closeConsumeModal(true);
          if (game.cash >= offer.amount) record('fulfilled', offer.amount);
          else record('broke', 0);
        }},
        { text: '下次吧', handler: function () { closeConsumeModal(true); record('refused', 0); } }
      ]
    });
  } else {
    pushWishEntry(ensureChildWishHistory(ch), offer, { kind: 'child', occasion: 'child' });
  }
}

function tickChildGiftRequests() {
  if (!game || game.gameOver || !game.children) return;
  if (typeof consumeModalOpen !== 'undefined' && consumeModalOpen) return;
  if (Math.random() > CHILD_GIFT_ASK_CHANCE) return;
  const eligible = game.children.filter(function (ch) {
    return ch && ch.monthsLeft > 0 && typeof getChildAgeYears === 'function' && getChildAgeYears(ch) >= CHILD_GIFT_MIN_AGE;
  });
  if (!eligible.length) return;
  const ch = eligible[Math.floor(Math.random() * eligible.length)];
  if (ch.lastGiftAskWeek === game.week) return;
  ch.lastGiftAskWeek = game.week;
  const offer = pickChildGiftOffer(ch);
  if (!offer) return;
  promptChildGiftAsk(ch, offer);
}

function publishPlayerDateWish() {
  if (!game || game.gameOver) return;
  if (typeof recordPlayerWish !== 'function') return;
  const hints = collectExperienceWishCandidates().filter(function (h) {
    return h.source === 'social' || h.source === 'dream' || h.source === 'stress';
  });
  const pool = hints.length ? hints : [
    { label: '下次约会的仪式感', amount: 800 + Math.floor(Math.random() * 1600), desc: '约会后记在心里的小念头', source: 'social' },
    { label: '一起短途走走', amount: 1200 + Math.floor(Math.random() * 2200), desc: '想留下更多共同回忆', source: 'social' }
  ];
  const pick = pool[Math.floor(Math.random() * pool.length)];
  if (hasOpenPlayerWishLike(pick)) return;
  recordPlayerWish(Object.assign({}, pick, { kind: 'experience', occasion: 'date' }), 'open');
  const aware = getPlayerWishAwareContacts();
  if (aware.length) {
    addLog('💭 约会后你冒出愿望「' + pick.label + '」· 身边人可能察觉到', 'info');
  }
}

function patchGiftWishLabels() {
  if (typeof giftWishKindLabel === 'undefined' || giftWishKindLabel._wishEventPatch) return;
  const orig = giftWishKindLabel;
  giftWishKindLabel = function (r) {
    if (!r) return orig(r);
    if (r.kind === 'experience' || r.source) return '<span class="fold-meta" style="color:var(--blue)">💭 经历萌发</span>';
    if (r.kind === 'birthday' || r.occasion === 'birthday') return '<span class="fold-meta" style="color:var(--accent)">🎂 生日愿望</span>';
    if (r.kind === 'date' || r.occasion === 'date') return '<span class="fold-meta" style="color:var(--pink,#f472b6)">💑 相处时刻</span>';
    if (r.kind === 'child' || r.occasion === 'child') return '<span class="fold-meta" style="color:var(--yellow)">🧸 孩子讨要</span>';
    return orig(r);
  };
  giftWishKindLabel._wishEventPatch = true;
}

function patchPromptDateGiftModal() {
  if (typeof promptDateGiftModal === 'undefined' || promptDateGiftModal._wishEventPatch) return;
  const orig = promptDateGiftModal;
  promptDateGiftModal = function (onDone) {
    publishPlayerDateWish();
    return orig(onDone);
  };
  promptDateGiftModal._wishEventPatch = true;
}

function patchAdvanceOneWeekWishEvents() {
  if (typeof advanceOneWeek === 'undefined' || advanceOneWeek._wishEventsPatch) return;
  const orig = advanceOneWeek;
  advanceOneWeek = function () {
    const r = orig.apply(this, arguments);
    if (r) {
      tickBirthdayWishLists();
      tickChildGiftRequests();
      tickPlayerExperienceWishes();
      tickPlayerWishPatronOffers();
    }
    return r;
  };
  advanceOneWeek._wishEventsPatch = true;
}

function initWishListEvents() {
  patchGiftWishLabels();
  patchPromptDateGiftModal();
  patchAdvanceOneWeekWishEvents();
}

initWishListEvents();
setTimeout(initWishListEvents, 0);
