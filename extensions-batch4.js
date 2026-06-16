/* 第四批 · 诈骗岗理想联动 + 爱好外出剧情 — 由 build.js 注入 */
const SCAM_CO_NAMES = ['鸿运信息', '鑫达科技', '汇通咨询'];

function isScamEmployment() {
  if (!game || !game.employed || !game.selfEmploy || !game.selfEmploy.scamBook) return false;
  if (game.employment && game.employment.roleExtra === 'scam') return true;
  const co = game.employment && game.employment.company;
  return !!(co && co.name && SCAM_CO_NAMES.some(function (n) { return co.name.indexOf(n) >= 0; }));
}

function ensureScamBookState() {
  if (!game || !game.selfEmploy) return null;
  const book = game.selfEmploy.scamBook;
  if (!book) return null;
  if (book.opsCredits == null) book.opsCredits = 0;
  if (book.idealConverted == null) book.idealConverted = 0;
  if (book.pipeline == null) book.pipeline = { opsWeeks: 0, linkedContractId: null };
  return book;
}

function pickScamIdealTemplate() {
  if (typeof DREAM_PROJECT_TEMPLATES !== 'undefined' && DREAM_PROJECT_TEMPLATES.length) {
    return DREAM_PROJECT_TEMPLATES[Math.floor(Math.random() * DREAM_PROJECT_TEMPLATES.length)];
  }
  return { id: 'film', career: '创业者', title: '副业项目', desc: '想把积蓄投进一个小生意。' };
}

function markScamIdealLead(target) {
  if (!target || target.converted) return;
  const tpl = pickScamIdealTemplate();
  target.lead = 'ideal';
  target.dreamTplId = tpl.id;
  target.dreamTitle = tpl.title;
  target.dreamCareer = tpl.career;
  target.dreamDesc = tpl.desc;
}

function convertScamLeadToIdeal(idx) {
  const book = ensureScamBookState();
  if (!book || !book.contacts[idx]) { addLog('无效线索', 'fail'); return; }
  const t = book.contacts[idx];
  if (t.converted) { addLog(t.name + ' 已转入联系人', 'warn'); return; }
  if (t.lead !== 'ideal') { addLog('该目标尚未暴露理想诉求', 'fail'); return; }
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const contactId = 'scam_lead_' + game.week + '_' + idx;
  const dream = typeof buildDreamFromTemplate === 'function'
    ? buildDreamFromTemplate(pickScamIdealTemplate())
    : { title: t.dreamTitle || '副业项目', career: t.dreamCareer || '创业者', progress: 8, active: true };
  dream.title = t.dreamTitle || dream.title;
  dream.career = t.dreamCareer || dream.career;
  dream.progress = Math.max(8, dream.progress || 8);
  dream.active = true;
  dream.fromScamLead = true;
  dream.sponsorCash = 0;
  if (typeof ensureCoreContact === 'function') {
    ensureCoreContact(contactId, {
      kind: 'lead', name: t.name, gender: gender, phone: t.phone,
      company: '名单客户', jobTitle: '待开发客户', income: 120000 + Math.floor(Math.random() * 200000),
      metWhere: '诈骗岗名单', familiarity: 62, attraction: 20
    });
  }
  const c = typeof findContact === 'function' ? findContact(contactId) : null;
  if (c) {
    c.dream = dream;
    if (typeof ensureContactDreamFields === 'function') ensureContactDreamFields(c);
    c.familiarity = Math.max(c.familiarity || 0, 62);
  }
  t.converted = true;
  t.contactId = contactId;
  book.idealConverted++;
  book.pipeline.linkedContactId = contactId;
  addLog('✨ 名单转化：' + t.name + ' 的理想「' + dream.title + '」已入网络页 · 可赞助/项目制接单', 'success');
  if (typeof updateUI === 'function') updateUI();
}

function scamWorkShiftHtml() {
  if (!isScamEmployment()) return '';
  const book = ensureScamBookState();
  if (!book) return '';
  const leads = book.contacts.filter(function (t) { return t.lead === 'ideal' && !t.converted; }).length;
  const uncalled = book.contacts.filter(function (t) { return !t.called; }).length;
  return '<p style="margin-top:8px;padding:8px;background:var(--bg);border-radius:8px;border:1px dashed var(--orange)">' +
    '📒 话术运营 · 未拨 ' + uncalled + ' · 理想线索 ' + leads + ' · 运营点 ' + (book.opsCredits || 0) +
    (book.pipeline.linkedContactId ? '<br><span class="fold-meta">已绑定理想客户 · 外呼可推进项目制进度</span>' : '') + '</p>';
}

function scamWorkShiftButtons() {
  if (!isScamEmployment()) return null;
  return [
    { text: '📞 集中外呼', fn: 'doScamOpsWorkShift()' },
    { text: '📒 通讯簿', fn: 'openScamBookFromWork()' }
  ];
}

function openScamBookFromWork() {
  if (typeof openScamBook === 'function') openScamBook();
}

function doScamOpsWorkShift() {
  const book = ensureScamBookState();
  if (!book) { addLog('无通讯簿', 'fail'); return; }
  let dialed = 0, hooked = 0, idealHits = 0;
  const pool = book.contacts.filter(function (t) { return !t.called; }).slice(0, 4);
  pool.forEach(function (t, i) {
    const idx = book.contacts.indexOf(t);
    if (idx < 0) return;
    if (typeof callScamTarget === 'function') {
      const before = t.called;
      callScamTarget(idx);
      if (!before && t.called) {
        dialed++;
        if (t.lead === 'ideal') idealHits++;
        if (t.outcome === 'hook' || (t.lead === 'ideal')) hooked++;
      }
    }
  });
  book.opsCredits = (book.opsCredits || 0) + Math.max(1, dialed);
  book.pipeline.opsWeeks = (book.pipeline.opsWeeks || 0) + 1;
  const con = typeof activeIdealContract === 'function' ? activeIdealContract() : null;
  if (con && con.status === 'active' && book.pipeline.linkedContactId === con.contactId) {
    const boost = 2 + Math.floor(Math.random() * 3);
    con.progress = Math.min(100, con.progress + boost);
    const c = typeof findContact === 'function' ? findContact(con.contactId) : null;
    if (c && c.dream) c.dream.progress = con.progress;
    if (typeof checkIdealContractMilestones === 'function') checkIdealContractMilestones(con);
    addLog('📋 话术推进理想项目 +' + boost + '%', 'success');
  } else if (book.pipeline.linkedContactId) {
    const lc = typeof findContact === 'function' ? findContact(book.pipeline.linkedContactId) : null;
    if (lc && lc.dream && lc.dream.active) {
      lc.dream.progress = Math.min(100, (lc.dream.progress || 0) + 1);
      addLog('✨ 话术维护客户理想 +' + lc.dream.progress + '%', 'info');
    }
  }
  if (typeof addStress === 'function') addStress(4, '话术外呼 ');
  addLog('📞 集中外呼完成 · 拨打 ' + dialed + ' · 上钩 ' + hooked + ' · 理想线索 ' + idealHits, dialed ? 'info' : 'warn');
  if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  if (typeof finishWorkShift === 'function') finishWorkShift();
}

function patchCallScamTargetForIdeal() {
  if (typeof callScamTarget !== 'function' || callScamTarget._idealPatch) return;
  const orig = callScamTarget;
  window.callScamTarget = function (idx) {
    const book = ensureScamBookState();
    if (!book || !book.contacts[idx]) { orig(idx); return; }
    const t = book.contacts[idx];
    if (t.called) { addLog(t.name + ' 已联系过', 'warn'); return; }
    t.called = true;
    book.calls++;
    const ok = Math.random() < 0.22;
    if (ok) {
      t.outcome = 'hook';
      const pay = 200 + Math.floor(Math.random() * 800);
      game.cash += pay;
      book.income += pay;
      if (typeof ledgerAddIncome === 'function') ledgerAddIncome('scam', '📞', '诈骗岗提成', pay);
      if (Math.random() < 0.34) {
        markScamIdealLead(t);
        addLog('📞 ' + t.name + ' · 上钩且流露理想「' + t.dreamTitle + '」+¥' + pay, 'success');
      } else {
        addLog('📞 ' + t.name + ' · 上钩 +¥' + pay, 'success');
      }
      book.opsCredits = (book.opsCredits || 0) + 1;
    } else {
      t.outcome = 'reject';
      addLog('📞 ' + t.name + ' · 未接通或被拒', 'info');
    }
    if (typeof updateUI === 'function') updateUI();
  };
  callScamTarget._idealPatch = true;
}

const HOBBY_BANTER = {
  旅行: ['「这条路我三年前走过，风景绝了。」', '「要不下次组个长线？我来做攻略。」', '「听说山顶那家民宿要关了，得抓紧。」'],
  美食: ['「这家排队是有原因的，招牌别点错。」', '「我知道一家更地道的，下次带你去。」', '「你尝一口这个汤底，鲜不鲜？」'],
  摄影: ['「这光线再晚十分钟就没了。」', '「你这个角度比我昨天拍的还好。」', '「回去一起修图？我教你调色。」'],
  音乐: ['「最近循环的那首，歌词像在写我们。」', '「下次爱好圈搞个小型 live 吧。」', '「你哼的调子我听过，是哪部剧？」'],
  运动: ['「今天状态不错，要不要加一组？」', '「你上次说的护膝我帮你问了。」', '「跑完这圈去喝椰子水？」'],
  阅读: ['「这本书结局争议很大，别剧透。」', '「书店月底有签售，一起？。」', '「你推荐的那本我连夜看完了。」'],
  手工: ['「这个材料网上便宜一半，我发你链接。」', '「上次那个半成品我帮你补完了。」', '「做坏了没关系，重来更有感觉。」'],
  游戏: ['「新副本今晚开，缺你一个。」', '「你上次那套装备搭配绝了。」', '「别氪了，我带你刷。」'],
  default: ['「今天天气真适合出来走走。」', '「跟你出来总能碰到有意思的事。」', '「下次还约？」']
};

const HOBBY_PROJECT_BEATS = [
  '爱好圈本周碰头：大家把分工表摊在桌上，吵了十分钟终于定稿。',
  '有人临时掉链子，你在群里发了段语音把气氛圆了回来。',
  '路过的人围观你们的「奇怪企划」，反而带来了意外灵感。',
  '同行伙伴自掏腰包买了道具，说「这次必须成」。',
  '雨突然下了，你们挤在屋檐下把方案脑暴完了。'
];

function hobbyThemeForOuting(ids) {
  const circle = typeof playerHobbyCircle === 'function' ? playerHobbyCircle() : null;
  if (circle && circle.theme) return circle.theme;
  const active = (game.hobbyProjects || []).find(function (p) { return p.status === 'active'; });
  if (active) return active.theme;
  return 'default';
}

function tryOutdoorCompanionBanter(placeLabel, ids) {
  if (!ids || !ids.length || Math.random() > 0.42) return;
  if (typeof consumeModalOpen !== 'undefined' && consumeModalOpen) return;
  const pickId = ids[Math.floor(Math.random() * ids.length)];
  const buddy = typeof findContact === 'function' ? findContact(pickId) : null;
  if (!buddy) return;
  const theme = hobbyThemeForOuting(ids);
  const pool = HOBBY_BANTER[theme] || HOBBY_BANTER.default;
  const line = pool[Math.floor(Math.random() * pool.length)];
  const prof = typeof contactProfileLabel === 'function' ? contactProfileLabel(buddy) : (buddy.jobTitle || '');
  const html = '<p>与 <b>' + buddy.name + '</b>' + (prof ? '（' + prof + '）' : '') + ' 在「' + placeLabel + '」：</p>' +
    '<p style="margin-top:8px;line-height:1.65;font-size:.9rem">「' + line.replace(/^[「]|」$/g, '') + '」</p>';
  buddy.familiarity = Math.min(100, (buddy.familiarity || 0) + 1);
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '🚶', title: '同行闲聊',
      html: html,
      buttons: [{ text: '嗯嗯', primary: true, handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); } }]
    });
  } else {
    addLog('🚶 ' + buddy.name + '：' + line, 'info');
  }
}

function tickHobbyNarrativeEvents() {
  if (!game || game.gameOver) return;
  const active = (game.hobbyProjects || []).find(function (p) { return p.status === 'active'; });
  if (!active || game.hobbyAttendedWeek !== game.week) return;
  if (Math.random() > 0.28) return;
  const beat = HOBBY_PROJECT_BEATS[Math.floor(Math.random() * HOBBY_PROJECT_BEATS.length)];
  addLog('🎯 「' + active.name + '」· ' + beat, 'info');
  if (Math.random() < 0.15 && typeof addStress === 'function') addStress(-2, '爱好圈放松 ');
}

function tickExtensionsBatch4() {
  patchCallScamTargetForIdeal();
  patchOperateOnIdealScamBonus();
  tickHobbyNarrativeEvents();
}

function patchOperateOnIdealScamBonus() {
  if (typeof operateOnIdeal !== 'function' || operateOnIdeal._scamPatch) return;
  const orig = operateOnIdeal;
  window.operateOnIdeal = function (contactId) {
    const cBefore = typeof findContact === 'function' ? findContact(contactId) : null;
    const progBefore = cBefore && cBefore.dream ? cBefore.dream.progress : 0;
    orig(contactId);
    if (!isScamEmployment()) return;
    const c = typeof findContact === 'function' ? findContact(contactId) : null;
    if (c && c.dream && c.dream.fromScamLead && c.dream.progress < 100 && c.dream.progress === progBefore) {
      c.dream.progress = Math.min(100, (c.dream.progress || 0) + 2);
      addLog('📒 话术经验加成 · 理想进度 ' + c.dream.progress + '%', 'info');
    }
  };
  operateOnIdeal._scamPatch = true;
}
