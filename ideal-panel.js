/* 理想标签页 · 助力名单 · 愿望单 — 由 build.js 注入 */
const IDEAL_HELPERS_PREVIEW = 3;

function ensureDreamProfile() {
  if (!game) return null;
  if (!game.dreamProfile) game.dreamProfile = { ideals: [], sponsored: [], helpers: [] };
  if (!game.dreamProfile.helpers) game.dreamProfile.helpers = [];
  if (!game.playerWishHistory) game.playerWishHistory = [];
  return game.dreamProfile;
}

function recordIdealHelper(contactId, name, title, progress, role) {
  const dp = ensureDreamProfile();
  if (!dp) return;
  let h = dp.helpers.find(function (x) { return x.contactId === contactId && x.title === title; });
  if (!h) {
    h = { contactId: contactId, name: name || '未知', title: title || '理想项目', progress: 0, role: role || '助力', lastWeek: game.week || 0 };
    dp.helpers.push(h);
  }
  h.name = name || h.name;
  h.progress = Math.max(h.progress || 0, progress || 0);
  h.role = role || h.role;
  h.lastWeek = game.week || 0;
  if (progress >= 100) h.completed = true;
}

function syncIdealHelpersFromState() {
  if (!game) return;
  ensureDreamProfile();
  (game.idealWorkContracts || []).forEach(function (con) {
    if (!con || !con.contactId) return;
    const c = typeof findContact === 'function' ? findContact(con.contactId) : null;
    const name = con.contactName || (c && c.name) || '合作方';
    const title = con.dreamTitle || (c && c.dream && c.dream.title) || '理想项目';
    const role = con.status === 'active' ? '项目制运营' : (con.status === 'success' ? '项目制·完成' : '项目制');
    recordIdealHelper(con.contactId, name, title, con.progress || 0, role);
  });
  (game.contacts || []).forEach(function (c) {
    if (!c || !c.dream) return;
    if ((c.dream.sponsorCash || 0) > 0 || c.dream.active) {
      recordIdealHelper(c.id, c.name, c.dream.title, c.dream.progress || 0, (c.dream.sponsorCash || 0) > 0 ? '赞助' : '理想关注');
    }
  });
  if (game.playerDream && game.playerDream.title) {
    if (!game.dreamProfile.ideals) game.dreamProfile.ideals = [];
    const pi = game.dreamProfile.ideals.find(function (x) { return x.id === 'player'; });
    const prog = game.playerDream.progress || 0;
    if (!pi) game.dreamProfile.ideals.push({ id: 'player', name: '我', title: game.playerDream.title, progress: prog });
    else pi.progress = prog;
  }
}

function collectIdealHelperRows() {
  syncIdealHelpersFromState();
  const rows = (game.dreamProfile && game.dreamProfile.helpers) ? game.dreamProfile.helpers.slice() : [];
  rows.sort(function (a, b) { return (b.lastWeek || 0) - (a.lastWeek || 0); });
  return rows;
}

function toggleIdealPanelSection(key) {
  if (!game._idealPanelFold) game._idealPanelFold = { helpers: true, wishes: true };
  game._idealPanelFold[key] = !game._idealPanelFold[key];
  renderIdealPanel();
}

function renderIdealHelperRow(h) {
  const pct = Math.min(100, Math.round(h.progress || 0));
  const col = pct >= 100 ? 'var(--green)' : (pct >= 50 ? 'var(--yellow)' : 'var(--accent)');
  let html = '<div style="padding:8px;margin:4px 0;background:var(--bg);border:1px solid var(--border);border-radius:8px;font-size:.78rem">';
  html += '<b>' + (h.name || '未知') + '</b> · 「' + (h.title || '理想') + '」';
  html += '<br><span class="fold-meta">' + (h.role || '助力') + ' · 进度 <b style="color:' + col + '">' + pct + '%</b>';
  if (h.completed) html += ' · 已完成';
  html += '</span></div>';
  return html;
}

function renderWishTableRows(rows, emptyHint) {
  if (!rows || !rows.length) return '<p class="fold-meta">' + (emptyHint || '暂无记录') + '</p>';
  let h = '<table class="wish-table"><thead><tr><th class="wish-col-date">日期</th><th class="wish-col-kind">类型</th><th class="wish-col-gift">内容</th><th class="wish-col-amt">金额</th><th class="wish-col-status">状态</th></tr></thead><tbody>';
  rows.forEach(function (r) {
    const kind = typeof giftWishKindLabel === 'function' ? giftWishKindLabel(r) : (r.kind || '愿望');
    let st = typeof giftWishStatusLabel === 'function' ? giftWishStatusLabel(r.status) : (r.fulfilled ? '已达成' : '未达成');
    if (r.fulfilledByName) st += '<br><span class="fold-meta" style="font-size:.65rem">🎁 ' + r.fulfilledByName + ' 买单</span>';
    else if (r.knownByNames && r.knownByNames.length) st += '<br><span class="fold-meta" style="font-size:.65rem">👀 ' + r.knownByNames.slice(0, 3).join('、') + ' 可能知道</span>';
    const desc = r.desc ? '<span class="wish-desc">' + r.desc + '</span>' : '';
    h += '<tr><td class="wish-col-date">' + (r.date || '—') + '</td><td class="wish-col-kind">' + kind + '</td><td class="wish-col-gift"><b>' + (r.label || '—') + '</b>' + desc +
      '</td><td class="wish-col-amt">' + ((r.amount || 0) > 0 ? '¥' + (r.amount || 0).toLocaleString() : '—') + '</td><td class="wish-col-status">' + st + '</td></tr>';
  });
  h += '</tbody></table>';
  return h;
}

function collectIntimateContactWishLists() {
  const out = [];
  (game.contacts || []).forEach(function (c) {
    if (!c || !c.wishHistory || !c.wishHistory.length) return;
    out.push({ contact: c, wishes: typeof mergeGiftWishRows === 'function' ? mergeGiftWishRows(c.wishHistory) : c.wishHistory.slice() });
  });
  (game.children || []).forEach(function (ch) {
    if (!ch || !ch.wishHistory || !ch.wishHistory.length) return;
    if (typeof getChildAgeYears === 'function' && getChildAgeYears(ch) < 3) return;
    const pseudo = { id: ch.id, name: ch.name, kind: 'child', wishHistory: ch.wishHistory };
    out.push({ contact: pseudo, wishes: typeof mergeGiftWishRows === 'function' ? mergeGiftWishRows(ch.wishHistory) : ch.wishHistory.slice() });
  });
  return out;
}

function renderIdealPanel() {
  const el = document.getElementById('idealPanelContent');
  if (!el || !game) return;
  if (typeof migrateDreamSystem === 'function') migrateDreamSystem();
  if (!game._idealPanelFold) game._idealPanelFold = { helpers: true, wishes: true };
  syncIdealHelpersFromState();
  if (typeof ensureGiftWishHistory === 'function') ensureGiftWishHistory();
  if (typeof migrateGiftWishArchives === 'function') migrateGiftWishArchives();

  const helpers = collectIdealHelperRows();
  const helpersFold = !!game._idealPanelFold.helpers;
  const wishesFold = !!game._idealPanelFold.wishes;

  let html = '<p class="fold-meta" style="margin:0 0 10px">愿望随经历生长；熟悉的人可能察觉，并愿意帮你买单。伴侣的愿望单仍是约会/年度梦想记录，与下方「我的愿望」不同。</p>';

  html += '<div class="contact-group-fold" style="margin-bottom:12px">';
  html += '<div class="phone-fold-hdr contact-group-hdr" onclick="toggleIdealPanelSection(\'helpers\')">';
  html += '<span class="phone-fold-chev" style="color:var(--muted)">' + (helpersFold ? '▶' : '▼') + '</span> ';
  html += '<b>✨ 理想项目助力</b> <span class="fold-meta">' + helpers.length + ' 人</span></div>';
  if (!helpersFold) {
    helpers.forEach(function (h) { html += renderIdealHelperRow(h); });
  } else {
    helpers.slice(0, IDEAL_HELPERS_PREVIEW).forEach(function (h) { html += renderIdealHelperRow(h); });
    if (helpers.length > IDEAL_HELPERS_PREVIEW) {
      html += '<p class="fold-meta" style="margin:4px 0 0">… 还有 ' + (helpers.length - IDEAL_HELPERS_PREVIEW) + ' 人 · 点击标题展开</p>';
    }
    if (!helpers.length) html += '<p class="fold-meta">尚未助力他人的理想项目 · 可在「网络」页赞助或接项目制合同</p>';
  }
  html += '</div>';

  html += '<div class="contact-group-fold">';
  html += '<div class="phone-fold-hdr contact-group-hdr" onclick="toggleIdealPanelSection(\'wishes\')">';
  html += '<span class="phone-fold-chev" style="color:var(--muted)">' + (wishesFold ? '▶' : '▼') + '</span> ';
  html += '<b>📜 愿望单</b></div>';
  if (!wishesFold) {
    html += '<div style="margin-top:8px"><h4 style="margin:0 0 6px;font-size:.85rem">我的愿望</h4>';
    const pw = mergePlayerWishRows();
    html += renderWishTableRows(pw.slice().reverse(), '还没有愿望 · 工作、压力、约会、理想推进等经历都可能让你冒出念头');
    html += '</div>';

    html += '<div style="margin-top:12px"><h4 style="margin:0 0 6px;font-size:.85rem">伴侣 · 当前</h4>';
    const cur = typeof mergeGiftWishRows === 'function' ? mergeGiftWishRows(game.giftWishHistory || []) : (game.giftWishHistory || []);
    const pn = game.partnerDisplayName || '伴侣';
    html += renderWishTableRows(cur.slice().reverse(), pn + ' 暂无愿望记录');
    html += '</div>';

    (game.archivedPartnerWishLists || []).forEach(function (arc) {
      html += '<div style="margin-top:12px"><h4 style="margin:0 0 6px;font-size:.85rem">' + (arc.partnerName || '前任') + ' · 历史</h4>';
      html += renderWishTableRows((arc.wishes || []).slice().reverse(), '无记录');
      html += '</div>';
    });

    collectIntimateContactWishLists().forEach(function (blk) {
      const dn = typeof contactDisplayName === 'function' ? contactDisplayName(blk.contact) : blk.contact.name;
      html += '<div style="margin-top:12px"><h4 style="margin:0 0 6px;font-size:.85rem">' + dn + ' · 愿望单</h4>';
      html += renderWishTableRows(blk.wishes.slice().reverse(), '暂无');
      html += '</div>';
    });
  } else {
    const preview = [];
    mergePlayerWishRows().slice(-2).forEach(function (w) { preview.push({ who: '我', row: w }); });
    (game.giftWishHistory || []).slice(-2).forEach(function (w) {
      preview.push({ who: game.partnerDisplayName || '伴侣', row: w });
    });
    if (!preview.length) html += '<p class="fold-meta" style="margin-top:6px">暂无愿望 · 点击展开</p>';
    else {
      html += '<ul style="margin:8px 0 0;padding-left:18px;font-size:.75rem;line-height:1.5">';
      preview.forEach(function (p) {
        html += '<li>' + p.who + ' · ' + (p.row.label || '愿望') + ' ¥' + (p.row.amount || 0).toLocaleString() + '</li>';
      });
      html += '</ul><p class="fold-meta">点击标题查看完整愿望单</p>';
    }
  }
  html += '</div>';

  el.innerHTML = html;
}

function mergePlayerWishRows() {
  if (!game.playerWishHistory) game.playerWishHistory = [];
  if (typeof mergeGiftWishRows === 'function') return mergeGiftWishRows(game.playerWishHistory);
  return game.playerWishHistory.slice();
}

function recordPlayerWish(offer, status) {
  if (!game || !offer) return;
  if (!game.playerWishHistory) game.playerWishHistory = [];
  const entry = typeof normalizeGiftWishEntry === 'function' ? normalizeGiftWishEntry({
    date: typeof getGiftWishDateStr === 'function' ? getGiftWishDateStr() : ('第' + (game.week || 0) + '周'),
    week: game.week || 0,
    label: offer.label || '愿望',
    desc: offer.desc || '',
    amount: offer.amount || 0,
    fulfilled: status === 'fulfilled',
    status: status,
    kind: offer.kind || 'playerDream',
    owner: 'player'
  }) : Object.assign({}, offer, { date: '第' + (game.week || 0) + '周', status: status });
  if (typeof assignPlayerWishAwareContacts === 'function') assignPlayerWishAwareContacts(entry);
  game.playerWishHistory.push(entry);
  if (game.playerWishHistory.length > 80 && typeof compactGiftWishHistoryForSave === 'function') {
    game.playerWishHistory = compactGiftWishHistoryForSave(game.playerWishHistory, 80);
  }
}

function patchIdealRecording() {
  if (typeof sponsorContactIdeal === 'function' && !sponsorContactIdeal._idealPanelPatch) {
    const orig = sponsorContactIdeal;
    sponsorContactIdeal = function (contactId, tierIdx) {
      orig.apply(this, arguments);
      const c = typeof findContact === 'function' ? findContact(contactId) : null;
      if (c && c.dream) recordIdealHelper(contactId, c.name, c.dream.title, c.dream.progress || 0, '赞助');
    };
    sponsorContactIdeal._idealPanelPatch = true;
  }
}

patchIdealRecording();
setTimeout(patchIdealRecording, 0);
