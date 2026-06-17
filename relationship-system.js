/* 暧昧 · 亲热 · 亲密关系认定 · 愿望互动 · 遗产 — 由 build.js 注入 */
const REL_AMBIGUITY_ATTR = 38;
const REL_PHYSICAL_ATTR = 52;
const REL_PHYSICAL_FAM = 45;
const REL_INTIMATE_FAM = 72;
const REL_INTIMATE_ATTR = 62;
const REL_AMBIGUITY_TO_PHYSICAL = 3;

function ensureContactRelationFields(c) {
  if (!c) return null;
  if (c.ambiguityLevel == null) c.ambiguityLevel = 0;
  if (c.intimateRelation == null) c.intimateRelation = false;
  if (!c.wishHistory) c.wishHistory = [];
  return c;
}

function isMarkedIntimateRelation(c) {
  return !!(c && c.intimateRelation);
}

function canShowAmbiguityButton(c) {
  if (!c || c.unreachable || (typeof isParentContact === 'function' && isParentContact(c))) return false;
  if (typeof isFamilyKind === 'function' && isFamilyKind(c)) return false;
  ensureContactSocialFields(c);
  return (c.attraction || 0) >= REL_AMBIGUITY_ATTR && mutualOrientationMatch(c);
}

function canShowPhysicalButton(c) {
  if (!canShowAmbiguityButton(c)) return false;
  ensureContactRelationFields(c);
  return (c.ambiguityLevel || 0) >= REL_AMBIGUITY_TO_PHYSICAL ||
    ((c.attraction || 0) >= REL_PHYSICAL_ATTR && (c.familiarity || 0) >= REL_PHYSICAL_FAM);
}

function canMarkIntimateRelation(c) {
  if (!c || c.unreachable || c.intimateRelation) return false;
  if (typeof isParentContact === 'function' && isParentContact(c)) return false;
  ensureContactSocialFields(c);
  ensureContactRelationFields(c);
  if (typeof isFamilyKind === 'function' && isFamilyKind(c)) {
    return (c.familiarity || 0) >= REL_INTIMATE_FAM && (c.attraction || 0) >= 50;
  }
  if (!mutualOrientationMatch(c) && (c.attraction || 0) < REL_INTIMATE_ATTR) return false;
  const famOk = (c.familiarity || 0) >= REL_INTIMATE_FAM;
  const attrOk = (c.attraction || 0) >= REL_INTIMATE_ATTR;
  const affairOk = typeof contactHasAffairRecord === 'function' && contactHasAffairRecord(c);
  return famOk && attrOk || affairOk || (typeof contactIsFriend === 'function' && contactIsFriend(c) && attrOk);
}

function markIntimateRelation(contactId) {
  const c = typeof findContact === 'function' ? findContact(contactId) : null;
  if (!c) { addLog('联系人不存在', 'fail'); return; }
  if (!canMarkIntimateRelation(c)) {
    addLog('需熟悉≥' + REL_INTIMATE_FAM + '、吸引≥' + REL_INTIMATE_ATTR + '（或已是性伙伴/挚友）才能认定亲密关系', 'fail');
    return;
  }
  ensureContactRelationFields(c);
  c.intimateRelation = true;
  c.intimateMarkedWeek = game.week || 0;
  bumpContactFamiliarity(c, 3);
  addLog('💞 与 ' + c.name + ' 确立亲密关系（认定标记 · 非必然等于性伙伴）', 'success');
  if (typeof updateUI === 'function') updateUI();
  if (typeof renderIdealPanel === 'function' && typeof currentTab !== 'undefined' && currentTab === 'ideal') renderIdealPanel();
}

function startContactAmbiguity(contactId) {
  const c = typeof findContact === 'function' ? findContact(contactId) : null;
  if (!c || !canShowAmbiguityButton(c)) { addLog('吸引力或性向不符，无法暧昧', 'fail'); return; }
  ensureContactRelationFields(c);
  c.ambiguityLevel = (c.ambiguityLevel || 0) + 1;
  bumpContactFamiliarity(c, 1);
  bumpContactAttraction(c, 1);
  if (typeof addStress === 'function') addStress(-1, '暧昧 ');
  const html = '<p>你和 <b>' + c.name + '</b> 聊得有些越界 · 气氛暧昧。</p>' +
    '<p class="fold-meta">暧昧度 ' + c.ambiguityLevel + ' · 熟悉 ' + (c.familiarity | 0) + ' · 吸引 ' + (c.attraction | 0) + '</p>' +
    '<p class="fold-meta">暧昧≠亲密关系 · 需双方熟悉与吸引达标后可「认定亲密关系」</p>';
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '💋', title: '暧昧', html: html, buttons: [{ text: '嗯…', primary: true, handler: function () { closeConsumeModal(true); } }] });
  } else addLog('💋 与 ' + c.name + ' 暧昧互动', 'info');
  maybeContactGiftPrompt(c, 'ambiguity');
}

function startContactPhysicalIntimacy(contactId) {
  if (!canShowPhysicalButton(typeof findContact === 'function' ? findContact(contactId) : null)) {
    addLog('暧昧度不够或熟悉/吸引不足', 'fail'); return;
  }
  if (typeof triggerAffairEncounter === 'function') {
    triggerAffairEncounter(contactId, '亲热');
    return;
  }
  addLog('无法发起亲热', 'fail');
}

function relationshipContactActionButtons(c, eid) {
  if (!c || isCoreContact(c)) return '';
  let h = '';
  if (canShowAmbiguityButton(c) && !canShowPhysicalButton(c)) {
    h += '<button class="btn" style="font-size:.72rem;padding:3px 8px" onclick="startContactAmbiguity(\'' + eid + '\')">💋 暧昧</button> ';
  }
  if (canShowPhysicalButton(c)) {
    h += '<button class="btn" style="font-size:.72rem;padding:3px 8px" onclick="startContactPhysicalIntimacy(\'' + eid + '\')">🔥 亲热</button> ';
  }
  if (canMarkIntimateRelation(c)) {
    h += '<button class="btn" style="font-size:.72rem;padding:3px 8px" onclick="markIntimateRelation(\'' + eid + '\')">💞 认定亲密关系</button> ';
  } else if (isMarkedIntimateRelation(c)) {
    h += '<span class="fold-meta" style="font-size:.68rem">💞 亲密关系</span> ';
  }
  return h;
}

function giftPressureScore(c) {
  ensureContactSocialFields(c);
  return ((c.familiarity || 0) * 0.45 + (c.attraction || 0) * 0.55) / 100;
}

function maybeContactGiftPrompt(c, reason) {
  if (!c || !game || game.gameOver) return;
  if (Math.random() > giftPressureScore(c) * 0.35) return;
  ensureContactRelationFields(c);
  const amount = 200 + Math.floor(Math.random() * 1800) + Math.floor((c.attraction || 0) * 12);
  const labels = ['请喝咖啡', '想要个小礼物', '借点钱周转', '陪逛街买单'];
  const label = labels[Math.floor(Math.random() * labels.length)];
  const entry = typeof normalizeGiftWishEntry === 'function' ? normalizeGiftWishEntry({
    date: typeof getGiftWishDateStr === 'function' ? getGiftWishDateStr() : ('第' + (game.week || 0) + '周'),
    week: game.week || 0,
    label: label,
    desc: reason === 'ambiguity' ? '暧昧气氛下开口' : '熟悉后开口',
    amount: amount,
    fulfilled: false,
    status: 'open',
    kind: 'contact',
    fromContactId: c.id
  }) : { label: label, amount: amount, date: '第' + (game.week || 0) + '周', status: 'open' };
  c.wishHistory.push(entry);
  if (c.wishHistory.length > 40 && typeof compactGiftWishHistoryForSave === 'function') {
    c.wishHistory = compactGiftWishHistoryForSave(c.wishHistory, 40);
  }
  addLog('🎁 ' + c.name + ' 向你索取：「' + label + '」约 ¥' + amount.toLocaleString(), 'info');
}

function tickIntimateGiftExchange() {
  if (!game || game.gameOver || !game.contacts) return;
  if (Math.random() > 0.11) return;
  const pool = game.contacts.filter(function (c) {
    if (!c || c.unreachable || c.dead) return false;
    return isMarkedIntimateRelation(c) || (typeof contactHasAffairRecord === 'function' && contactHasAffairRecord(c)) ||
      ((c.familiarity || 0) >= 65 && (c.attraction || 0) >= 55);
  });
  if (!pool.length) return;
  const c = pool[Math.floor(Math.random() * pool.length)];
  if (Math.random() < 0.55) maybeContactGiftPrompt(c, 'weekly');
  else if (Math.random() < giftPressureScore(c)) {
    const gift = 100 + Math.floor(Math.random() * 600);
    game.cash = (game.cash || 0) + gift;
    if (typeof ledgerAddIncome === 'function') ledgerAddIncome('gift', '🎁', c.name + '赠礼', gift);
    bumpContactFamiliarity(c, 1);
    addLog('🎁 ' + c.name + ' 送你礼物 · +¥' + gift, 'success');
  }
}

function settleContactInheritance(c) {
  if (!c || !game) return;
  if (!c.intimateRelation && !(typeof contactHasAffairRecord === 'function' && contactHasAffairRecord(c))) return;
  const base = 8000 + Math.floor(Math.random() * 42000) + Math.floor((c.familiarity || 0) * 200);
  game.cash = (game.cash || 0) + base;
  game.money = (game.money || 0) + base;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('inheritance', '🕯', c.name + '遗产', base);
  addLog('📜 ' + c.name + ' 将你列为亲密关系继承人 · 遗产 ¥' + base.toLocaleString(), 'success');
}

function patchLifespanForIntimateInheritance() {
  if (typeof markContactDead === 'undefined' || markContactDead._inheritPatch) return;
  const orig = markContactDead;
  markContactDead = function (c, reason) {
    if (c && !c.dead && c.intimateRelation) settleContactInheritance(c);
    return orig.apply(this, arguments);
  };
  markContactDead._inheritPatch = true;
}

function patchAdvanceOneWeekForRelations() {
  if (typeof advanceOneWeek === 'undefined' || advanceOneWeek._relPatch) return;
  const orig = advanceOneWeek;
  advanceOneWeek = function () {
    const r = orig.apply(this, arguments);
    if (r) tickIntimateGiftExchange();
    return r;
  };
  advanceOneWeek._relPatch = true;
}

function initRelationshipSystem() {
  patchLifespanForIntimateInheritance();
  patchAdvanceOneWeekForRelations();
  if (!game) return;
  (game.contacts || []).forEach(function (c) {
    ensureContactRelationFields(c);
    if (typeof contactHasAffairRecord === 'function' && contactHasAffairRecord(c) && (c.familiarity || 0) >= 60) {
      /* 旧存档：性伙伴可手动认定，不自动标记 */
    }
  });
}

initRelationshipSystem();
setTimeout(initRelationshipSystem, 0);
