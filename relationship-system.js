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
    (c.attraction || 0) >= REL_PHYSICAL_ATTR;
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
  if (typeof canShowStartDatingButton === 'function' && canShowStartDatingButton(c)) {
    h += '<button class="btn" style="font-size:.72rem;padding:3px 8px" onclick="startDatingWithContact(\'' + eid + '\')">💕 确立恋爱</button> ';
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
    if (r) {
      tickIntimateGiftExchange();
      if (typeof tickPartnerMarriageProposal === 'function') tickPartnerMarriageProposal();
      if (typeof tickDestinyPartnerMeet === 'function') tickDestinyPartnerMeet();
    }
    return r;
  };
  advanceOneWeek._relPatch = true;
}

/* ---------- 主伴侣：恋爱 · 同居 · 求婚 · 吸引力做爱 ---------- */
const CORE_LOVER_ID = 'core_lover';
const PARTNER_WEDDING_COST = 80000;
const PARTNER_PROPOSAL_WEEKLY_CHANCE = 0.07;

function migratePartnerRomance(g) {
  g = g || game;
  if (!g) return;
  if (g.married && !g.divorced) g.romanceStage = null;
}

function hasPrimaryPartner(g) {
  g = g || game;
  if (!g || g.divorced || g.spouseDeceased) return false;
  if (g.married) return true;
  return g.romanceStage === 'dating' || g.romanceStage === 'cohabiting';
}

function partnerRomanceAllowsHomeSex(g) {
  g = g || game;
  if (!hasPrimaryPartner(g)) return false;
  if (g.married) return true;
  return g.romanceStage === 'dating' || g.romanceStage === 'cohabiting';
}

function isPartnerLivingWithPlayer(g) {
  g = g || game;
  if (!hasPrimaryPartner(g)) return false;
  if (g.married && !g.divorced) return !g.longDistance;
  return g.romanceStage === 'cohabiting';
}

function getPartnerRomanceContact() {
  if (!game || !game.contacts) return null;
  if (typeof initCoreContacts === 'function') initCoreContacts();
  if (game.married && !game.divorced) {
    const sid = typeof CORE_CONTACT_IDS !== 'undefined' ? CORE_CONTACT_IDS.spouse : 'core_spouse';
    return game.contacts.find(function (c) { return c && c.id === sid; }) || null;
  }
  if (game.romanceStage === 'dating' || game.romanceStage === 'cohabiting') {
    return game.contacts.find(function (c) { return c && (c.id === CORE_LOVER_ID || c.isPrimaryPartner); }) || null;
  }
  return null;
}

function getPartnerAttraction() {
  const c = getPartnerRomanceContact();
  if (c) return c.attraction || 0;
  if (game && game.married && !game.divorced) return 80;
  return 0;
}

function getPartnerFamiliarity() {
  const c = getPartnerRomanceContact();
  return c ? (c.familiarity || 0) : 0;
}

function partnerAttractionMeetsSexThreshold() {
  return getPartnerAttraction() >= REL_PHYSICAL_ATTR;
}

function partnerMeetsMarriageThreshold() {
  return getPartnerFamiliarity() >= REL_INTIMATE_FAM && getPartnerAttraction() >= REL_INTIMATE_ATTR;
}

function syncPartnerRomanceContact() {
  if (!game) return;
  migratePartnerRomance();
  if (!game.contacts) game.contacts = [];
  if (game.married && !game.divorced) {
    if (typeof syncSpouseContact === 'function') syncSpouseContact();
    game.contacts = game.contacts.filter(function (c) { return c && c.id !== CORE_LOVER_ID; });
    return;
  }
  if (game.romanceStage !== 'dating' && game.romanceStage !== 'cohabiting') {
    game.contacts = game.contacts.filter(function (c) { return c && c.id !== CORE_LOVER_ID; });
    return;
  }
  const name = game.partnerDisplayName || (typeof COMPANION_NAME !== 'undefined' ? COMPANION_NAME : '伴侣');
  const existing = game.contacts.find(function (c) { return c && c.id === CORE_LOVER_ID; });
  const role = game.romanceStage === 'cohabiting' ? '同居' : '恋人';
  if (!existing) {
    if (typeof ensureCoreContact === 'function') {
      ensureCoreContact(CORE_LOVER_ID, {
        kind: 'lover', name: name, gender: game.partnerGender || 'female', role: role,
        company: '', jobTitle: '', income: 0, metWhere: '缘起'
      });
    }
  } else {
    existing.name = name;
    existing.role = role;
    existing.kind = 'lover';
  }
  const c = game.contacts.find(function (x) { return x && x.id === CORE_LOVER_ID; });
  if (c) {
    if (typeof ensureContactSocialFields === 'function') ensureContactSocialFields(c);
    c.isPrimaryPartner = true;
    if (c.familiarity == null) c.familiarity = 58;
    if (c.attraction == null) c.attraction = 48;
    if (c.orientation == null && typeof deriveCoupleOrientation === 'function') {
      c.orientation = game.coupleOrientation || deriveCoupleOrientation(game.playerGender || 'male', game.partnerGender || 'female');
    }
  }
}

function syncPartnerRomanceHousing(g) {
  g = g || game;
  if (!g || g.divorced) return;
  if (g.married && !g.divorced) {
    if (typeof syncHousingCohabitRule === 'function') syncHousingCohabitRule(g);
    return;
  }
  if (g.romanceStage === 'cohabiting') {
    if (typeof housingAllowsCohabit === 'function' && !housingAllowsCohabit(g)) {
      g.romanceStage = 'dating';
      g.longDistance = true;
      addLog('🏠 住房不够大，无法继续同居 · 恢复恋爱分居', 'warn');
      syncPartnerRomanceContact();
    } else {
      g.longDistance = false;
      g._housingForcedLD = false;
    }
  } else if (g.romanceStage === 'dating') {
    g.longDistance = true;
  }
}

function setPrimaryPartnerFromContact(c) {
  if (!c || !game || game.married || game.divorced) return false;
  if (hasPrimaryPartner() && game.partnerDisplayName && game.partnerDisplayName !== c.name) {
    addLog('已有固定伴侣，无法与 ' + c.name + ' 确立恋爱', 'fail');
    return false;
  }
  game.partnerDisplayName = c.name;
  if (c.gender) game.partnerGender = c.gender;
  if (typeof deriveCoupleOrientation === 'function') {
    game.coupleOrientation = deriveCoupleOrientation(game.playerGender || 'male', game.partnerGender || 'female');
  }
  game.romanceStage = 'dating';
  syncPartnerRomanceContact();
  const lover = getPartnerRomanceContact();
  if (lover) {
    lover.familiarity = Math.max(lover.familiarity || 0, c.familiarity || 0);
    lover.attraction = Math.max(lover.attraction || 0, c.attraction || 0);
  }
  syncPartnerRomanceHousing();
  addLog('💕 与 ' + c.name + ' 确立恋爱关系', 'success');
  if (typeof updateUI === 'function') updateUI();
  return true;
}

function startDatingWithContact(contactId) {
  const c = typeof findContact === 'function' ? findContact(contactId) : null;
  if (!c || c.unreachable) { addLog('无法确立恋爱', 'fail'); return; }
  if (typeof isParentContact === 'function' && isParentContact(c)) { addLog('无法与父母恋爱', 'fail'); return; }
  if (typeof isCoreContact === 'function' && isCoreContact(c) && c.kind !== 'lover') {
    addLog('无法与该联系人恋爱', 'fail'); return;
  }
  ensureContactSocialFields(c);
  if ((c.attraction || 0) < REL_PHYSICAL_ATTR) {
    addLog('吸引力需≥' + REL_PHYSICAL_ATTR + ' 才能确立恋爱（当前 ' + (c.attraction | 0) + '）', 'fail');
    return;
  }
  if (typeof mutualOrientationMatch === 'function' && !mutualOrientationMatch(c)) {
    addLog('性向不符，无法恋爱', 'fail'); return;
  }
  setPrimaryPartnerFromContact(c);
}

function promptMoveInTogether() {
  if (!game || game.married || game.romanceStage !== 'dating') {
    addLog('需处于恋爱关系才能同居', 'fail'); return;
  }
  if (typeof housingAllowsCohabit === 'function' && !housingAllowsCohabit()) {
    addLog(typeof housingRestrictionHint === 'function' ? housingRestrictionHint('cohabit') : '住房需大公寓以上', 'fail');
    return;
  }
  const pn = game.partnerDisplayName || '伴侣';
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '🏠', title: '同居',
      html: '<p>与 <b>' + pn + '</b> 开始同居？</p><p class="fold-meta">需大公寓以上 · 同居后可在家做爱、可怀孕</p>',
      buttons: [
        { text: '再想想', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } },
        { text: '开始同居', primary: true, handler: function () {
          if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
          game.romanceStage = 'cohabiting';
          game.longDistance = false;
          syncPartnerRomanceContact();
          syncPartnerRomanceHousing();
          addLog('🏠 与 ' + pn + ' 开始同居', 'success');
          if (typeof updateUI === 'function') updateUI();
        }}
      ]
    });
  } else {
    game.romanceStage = 'cohabiting';
    game.longDistance = false;
    syncPartnerRomanceContact();
    addLog('🏠 与 ' + pn + ' 开始同居', 'success');
  }
}

function completePrimaryPartnerMarriage() {
  if (typeof housingAllowsMarriage === 'function' && !housingAllowsMarriage()) {
    addLog(typeof housingRestrictionHint === 'function' ? housingRestrictionHint('marry') : '住房需独户以上才可结婚', 'fail');
    return false;
  }
  if (typeof spendCash === 'function' && !spendCash(PARTNER_WEDDING_COST, '婚礼')) return false;
  game.married = true;
  game.divorced = false;
  game.romanceStage = null;
  game.longDistance = false;
  if (game.companion) {
    game.companion.married = true;
    game.companion.divorced = false;
  }
  game.spouseIntimacy = typeof INTIMACY_INITIAL !== 'undefined' ? INTIMACY_INITIAL : 80;
  if (typeof syncSpouseIntimacyToCompanion === 'function') syncSpouseIntimacyToCompanion();
  game.contacts = (game.contacts || []).filter(function (c) { return c && c.id !== CORE_LOVER_ID; });
  if (typeof syncSpouseContact === 'function') syncSpouseContact();
  if (typeof syncHousingCohabitRule === 'function') syncHousingCohabitRule();
  addLog('💒 与 ' + (game.partnerDisplayName || '伴侣') + ' 结婚！', 'success');
  if (typeof updateUI === 'function') updateUI();
  return true;
}

function promptProposeToPartner() {
  if (!game || game.gameOver || game.married || game.divorced) { addLog('当前无法求婚', 'fail'); return; }
  if (!hasPrimaryPartner()) { addLog('需先恋爱或同居', 'fail'); return; }
  const pn = game.partnerDisplayName || '伴侣';
  const fam = getPartnerFamiliarity();
  const attr = getPartnerAttraction();
  const ok = partnerMeetsMarriageThreshold();
  const html = '<p>向 <b>' + pn + '</b> 求婚？</p>' +
    '<p class="fold-meta">熟悉 ' + fam + ' · 吸引 ' + attr + '</p>' +
    '<p class="fold-meta">成功需熟悉≥' + REL_INTIMATE_FAM + ' 且吸引≥' + REL_INTIMATE_ATTR + '（与做爱无关）</p>' +
    (ok ? '<p style="color:var(--green)">条件达标，对方会答应</p>' : '<p style="color:var(--orange)">未达标，大概率被拒</p>') +
    '<p class="fold-meta">婚礼 ¥' + PARTNER_WEDDING_COST.toLocaleString() + ' · 需独户以上住房</p>';
  const run = function () {
    if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
    if (ok) completePrimaryPartnerMarriage();
    else {
      const c = getPartnerRomanceContact();
      if (c && typeof bumpContactFamiliarity === 'function') bumpContactFamiliarity(c, -Math.round(4 + attr / 15));
      addLog('💔 ' + pn + ' 拒绝了求婚 · 需熟悉≥' + REL_INTIMATE_FAM + ' 且吸引≥' + REL_INTIMATE_ATTR + '（现 ' + fam + '/' + attr + '）', 'fail');
      if (typeof updateUI === 'function') updateUI();
    }
  };
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '💍', title: '求婚', html: html,
      buttons: [
        { text: '算了', handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } },
        { text: '求婚', primary: true, handler: run }
      ]
    });
  } else run();
}

function queuePartnerMarriageProposal() {
  if (!game || game.married || !hasPrimaryPartner()) return;
  const pn = game.partnerDisplayName || '伴侣';
  const html = '<p><b>' + pn + '</b> 认真地看着你：「我们结婚吧？」</p>' +
    '<p class="fold-meta">熟悉 ' + getPartnerFamiliarity() + ' · 吸引 ' + getPartnerAttraction() + '</p>' +
    '<p class="fold-meta">婚礼 ¥' + PARTNER_WEDDING_COST.toLocaleString() + '</p>';
  const accept = function () {
    if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
    completePrimaryPartnerMarriage();
  };
  const reject = function () {
    if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
    if (typeof adjustSpouseIntimacy === 'function') { /* 非婚无亲密度 */ }
    const c = getPartnerRomanceContact();
    if (c && typeof bumpContactFamiliarity === 'function') bumpContactFamiliarity(c, -3);
    addLog('💔 你拒绝了 ' + pn + ' 的求婚 · 熟悉度-3', 'warn');
    if (typeof updateUI === 'function') updateUI();
  };
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '💍', title: pn + ' 求婚', html: html,
      buttons: [
        { text: '拒绝', handler: reject },
        { text: '答应', primary: true, handler: accept }
      ]
    });
  } else addLog('💍 ' + pn + ' 想和你结婚（请打开界面处理）', 'warn');
}

function tickPartnerMarriageProposal() {
  if (!game || game.gameOver || game.married || game.divorced || !hasPrimaryPartner()) return;
  if (typeof autoLifeRunning !== 'undefined' && autoLifeRunning) return;
  if (!partnerMeetsMarriageThreshold()) return;
  if (Math.random() >= PARTNER_PROPOSAL_WEEKLY_CHANCE) return;
  if (game._partnerProposalWeek === game.week) return;
  game._partnerProposalWeek = game.week;
  queuePartnerMarriageProposal();
}

function tickDestinyPartnerMeet() {
  if (!game || game.gameOver || game.destinyLoveMet || hasPrimaryPartner() || game.married) return;
  if (!game.destinyLove) return;
  const year = game.destinyYear != null ? game.destinyYear : 0;
  const grad = game.graduationYear || (typeof GRADUATION_YEAR !== 'undefined' ? GRADUATION_YEAR : 2024);
  const meetWeek = year <= 0 ? 0 : Math.max(0, (grad + year - (game.birthYear || grad - 22)) * 52);
  if ((game.week || 0) < meetWeek) return;
  game.destinyLoveMet = true;
  if (!game.partnerDisplayName && typeof pickPartnerDisplayName === 'function') {
    game.partnerDisplayName = pickPartnerDisplayName(game.partnerGender || 'female');
  }
  game.romanceStage = 'dating';
  syncPartnerRomanceContact();
  const c = getPartnerRomanceContact();
  if (c) {
    c.familiarity = 62;
    c.attraction = 55;
  }
  syncPartnerRomanceHousing();
  const pn = game.partnerDisplayName || '某人';
  addLog('✨ 命中注定之人出现：' + pn + ' · 确立恋爱', 'success');
  if (typeof queuePersonEncounter === 'function') {
    queuePersonEncounter({
      lane: 'person', icon: '✨', title: '缘起',
      html: '<p>你遇见了 <b>' + pn + '</b>，心跳加速——原来命运早已写好。</p><p class="fold-meta">已确立恋爱 · 熟悉62 · 吸引55</p>',
      btn: '心动'
    });
  }
}

function bumpPartnerRomanceSocial(famDelta, attrDelta, intimacyDelta) {
  if (!game || game.divorced) return;
  if (game.married && !game.divorced) {
    if (intimacyDelta && typeof adjustSpouseIntimacy === 'function') adjustSpouseIntimacy(intimacyDelta);
    return;
  }
  const c = getPartnerRomanceContact();
  if (!c) return;
  if (famDelta && typeof bumpContactFamiliarity === 'function') bumpContactFamiliarity(c, famDelta);
  if (attrDelta && typeof bumpContactAttraction === 'function') bumpContactAttraction(c, attrDelta);
}

function partnerRomanceHomeExtras(pickFn, labelWrap) {
  if (!game || game.married || game.divorced || !hasPrimaryPartner()) return '';
  let h = '';
  if (game.romanceStage === 'dating') {
    h += '<button class="btn" onclick="promptMoveInTogether()">' + (labelWrap ? labelWrap('🏠 同居') : '🏠 同居') + '</button> ';
  }
  if (!game.married) {
    h += '<button class="btn" onclick="promptProposeToPartner()">' + (labelWrap ? labelWrap('💍 求婚') : '💍 求婚') + '</button> ';
  }
  return h;
}

function canShowStartDatingButton(c) {
  if (!c || c.unreachable || hasPrimaryPartner()) return false;
  if (typeof isParentContact === 'function' && isParentContact(c)) return false;
  if (typeof isCoreContact === 'function' && isCoreContact(c)) return false;
  ensureContactSocialFields(c);
  if ((c.attraction || 0) < REL_PHYSICAL_ATTR) return false;
  if (typeof mutualOrientationMatch === 'function' && !mutualOrientationMatch(c)) return false;
  return true;
}

function initRelationshipSystem() {
  patchLifespanForIntimateInheritance();
  patchAdvanceOneWeekForRelations();
  if (!game) return;
  migratePartnerRomance(game);
  syncPartnerRomanceContact();
  syncPartnerRomanceHousing();
  (game.contacts || []).forEach(function (c) {
    ensureContactRelationFields(c);
    if (typeof contactHasAffairRecord === 'function' && contactHasAffairRecord(c) && (c.familiarity || 0) >= 60) {
      /* 旧存档：性伙伴可手动认定，不自动标记 */
    }
  });
}

initRelationshipSystem();
setTimeout(initRelationshipSystem, 0);
