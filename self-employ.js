/* 自营 · 电商/自媒体/兼职/个体户 — 由 build.js 注入 */
const ECOMMERCE_PLATFORMS = [
  { id: 'tmall', name: '天狗', fee: 1000 },
  { id: 'taofish', name: '淘鱼', fee: 0 }
];
const MEDIA_PLATFORMS = [
  { id: 'bilibili', name: 'B站', tracks: ['游戏', '知识', '生活'] },
  { id: 'douyin', name: '抖音', tracks: ['美食', '旅行', '剧情'] }
];
const ECOMMERCE_TRACKS = ['数码', '美妆', '家居', '食品'];
const VENDOR_SPOTS = [
  { id: 'school', name: '学校门口', cost: 0 },
  { id: 'office', name: '公司楼下', cost: 0 },
  { id: 'club', name: '夜店外', cost: 0 },
  { id: 'cross', name: '路口', cost: 0 }
];
const FOOD_CART_COST = 10000;
const SIDE_TWO_SLOT_H = 16;
const DELIVERY_ROUNDS = 10;
const DELIVERY_TIMER_NORMAL = 3;
const DELIVERY_TIMER_HARD = 1.5;
const ECOMMERCE_OPS_H = 2;
const MEDIA_BILI_PLAN_SLOTS = 4;
const MEDIA_BILI_SHOOT_SLOTS = 2;
const MEDIA_BILI_EDIT_SLOTS = 4;
const MEDIA_DY_SHOOT_H = 1;
const MEDIA_DY_EDIT_H = 1;
const MEDIA_DY_LIVE_H = 2;
const DELIVERY_WORDS = ['麻辣', '黄焖', '兰州', '沙县', '奶茶', '烧烤', '饺子', '汉堡', '寿司', '盖饭', '米线', '煎饼'];
const BILI_TOPICS = ['入门指南', '实测对比', 'vlog日常', '干货分享', '避坑清单'];
const MEDIA_TRACK_REQ = {
  '游戏': { needConsoleOrPc: true, label: '需游戏机或电脑' },
  '知识': { needComputer: true, label: '需电脑' },
  '生活': { needPhone: true, label: '需手机' },
  '美食': { needPhone: true, label: '需手机' },
  '旅行': { needPhone: true, label: '需手机' },
  '剧情': { needPhone: true, needComputer: true, label: '需电脑+手机' }
};

function ensureSelfEmploy() {
  if (!game) return null;
  if (!game.selfEmploy) {
    game.selfEmploy = { shops: {}, vendor: null, scamBook: null, deliveryRuns: 0, rideRuns: 0 };
  }
  migrateSelfEmploy(game.selfEmploy);
  if (!game.selfEmploy.shops) game.selfEmploy.shops = {};
  return game.selfEmploy;
}

function migrateSelfEmploy(se) {
  if (!se) return;
  if (!se.shops) se.shops = {};
  if (se.ecommerce && se.ecommerce.platform) {
    se.shops[se.ecommerce.platform] = se.ecommerce;
    delete se.ecommerce;
  }
  if (se.media && se.media.platform) {
    se.shops[se.media.platform] = se.media;
    delete se.media;
  }
}

function getSelfShop(platformId) {
  const se = ensureSelfEmploy();
  return se && se.shops ? se.shops[platformId] : null;
}

function hasPlayerCar() {
  return !!(game && (game.ownedCar || (game.ownedCars && game.ownedCars.length)));
}

function canUseSideComputer() {
  return !!(game && game.ownsComputer);
}

function canUseSideMediaBase() {
  return canUseSideComputer() && typeof hasUsablePhone === 'function' && hasUsablePhone();
}

function canUseSidePhone() {
  return typeof hasUsablePhone === 'function' && hasUsablePhone();
}

function canUseSideMediaPlatform(platformId) {
  if (platformId === 'douyin') return canUseSidePhone();
  return canUseSideMediaBase();
}

function trackMeetsReq(track, platformId) {
  const req = MEDIA_TRACK_REQ[track] || {};
  if (req.needComputer && platformId !== 'douyin' && !canUseSideComputer()) return false;
  if (req.needPhone && !canUseSidePhone()) return false;
  if (req.needConsoleOrPc && !(game.ownsConsole || canUseSideComputer())) return false;
  return true;
}

function trackReqLabel(track, platformId) {
  const req = MEDIA_TRACK_REQ[track];
  if (!req) return '';
  if (platformId === 'douyin') {
    if (req.needPhone) return '需手机';
    return '';
  }
  return req.label;
}

function playerBrandPresets() {
  const n = (game && game.playerName) ? String(game.playerName).replace(/[·\s].*$/, '') : '我的';
  return [n + '优选', n + '小铺', n + '严选', n + '工坊'];
}

function playerMediaPresets() {
  const n = (game && game.playerName) ? String(game.playerName).replace(/[·\s].*$/, '') : 'My';
  return [n + 'Official', n + 'Studio', n + 'Channel', n + 'Daily'];
}

function vendorCartPresets() {
  const n = (game && game.playerName) ? String(game.playerName).replace(/[·\s].*$/, '') : '招牌';
  return [n + '小吃', n + '烧烤摊', n + '奶茶铺', n + '炸串车'];
}

function ecommercePlatformMeta(id) {
  return ECOMMERCE_PLATFORMS.find(function (p) { return p.id === id; }) || { id: id, name: id, fee: 0 };
}

function mediaPlatformMeta(id) {
  return MEDIA_PLATFORMS.find(function (p) { return p.id === id; }) || { id: id, name: id, tracks: ['生活'] };
}

function sideRefreshUi() {
  if (typeof renderDailyTimeBar === 'function') renderDailyTimeBar();
  if (typeof refreshSelfEmployUi === 'function') refreshSelfEmployUi();
  else if (typeof updateUI === 'function') updateUI();
}

function sideDailyBlockReason() {
  if (!game || !game.daily) return '无日程';
  if (game.daily.dayIndex >= 7) return '本周七天日程已满';
  if (typeof isPlayerImprisoned === 'function' && isPlayerImprisoned()) return '监禁中';
  if (game.daily.slotActivity === 'out') return '外出占满时段';
  if (game.daily.slotActivity === 'work' || game.daily.inOvertime) return '上班中';
  return null;
}

function sideSpendHours(h, activity, logLabel) {
  h = h || 1;
  const block = sideDailyBlockReason();
  if (block) { addLog(block + '，无法' + (logLabel || '副业'), 'fail'); return false; }
  if (typeof dailyCanUseHours !== 'function' || !dailyCanUseHours(h)) return false;
  const d = ensureDailyState();
  if (!d.slotActivity || d.slotActivity === 'sidejob') d.slotActivity = activity || 'sidejob';
  else if (d.slotActivity !== (activity || 'sidejob')) { addLog('本时段已在安排其他事', 'fail'); return false; }
  dailyAddHours(h, false);
  if (logLabel) addLog('⏱ ' + logLabel + ' · -' + h + 'h · 剩 ' + dailySlotHoursLeft() + 'h', 'info');
  sideRefreshUi();
  return true;
}

function sideCanSpendSlots(n) {
  const block = sideDailyBlockReason();
  if (block) return block;
  if (!n || n < 1) return '无效时段数';
  if ((game.daily.slotHoursUsed || 0) > 0) return '本时段已在安排其他事';
  return null;
}

function sideSpendSlots(n, activity, logLabel) {
  const block = sideCanSpendSlots(n);
  if (block) { addLog(block + '，无法开始' + (logLabel || ''), 'fail'); return false; }
  for (let i = 0; i < n; i++) {
    if (i > 0) {
      const d2 = ensureDailyState();
      if (d2.dayIndex >= 7) { addLog('时段不足，无法连续占满 ' + n + ' 时段', 'fail'); return false; }
      if ((d2.slotHoursUsed || 0) > 0) { addLog('下一时段已被占用，需连续 ' + n + ' 时段', 'fail'); return false; }
    }
    const d = ensureDailyState();
    d.slotActivity = activity || 'sidejob';
    d.slotHoursUsed = SLOT_HOURS_TOTAL;
    addLog('⏱ ' + (logLabel || '副业') + ' · 第' + (i + 1) + '时段 ' + SLOT_HOURS_TOTAL + 'h' + (n > 1 ? '（' + (i + 1) + '/' + n + '）' : ''), 'info');
    dailyAdvanceAfterSlotAction();
  }
  if (n > 1) addLog('⏱ ' + (logLabel || '副业') + ' · 共 ' + n + ' 时段（' + (n * SLOT_HOURS_TOTAL) + 'h）', 'info');
  sideRefreshUi();
  return true;
}

function sideCanSpendTwoSlots() {
  return sideCanSpendSlots(2);
}

function sideSpendTwoSlots(activity, logLabel) {
  return sideSpendSlots(2, activity, logLabel);
}

function ecommerceStatusLine(shop) {
  if (!shop) return '未开店 · 注册后运营';
  const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('ecommerce', shop.track) : 100;
  const trend = typeof fluxTrendLabel === 'function' ? fluxTrendLabel('ecommerce', shop.track) : '';
  return '「' + shop.brand + '」· ' + shop.track + ' · 指数' + Math.round(idx) + trend + ' · 运营' + ECOMMERCE_OPS_H + 'h/周';
}

function mediaStatusLine(shop) {
  if (!shop) return '未开通 · 点选进入';
  if (shop.platform === 'bilibili') {
    if (shop.pendingUploadUntilWeek && game.week < shop.pendingUploadUntilWeek) {
      return '「' + shop.brand + '」· 审核剩 ' + (shop.pendingUploadUntilWeek - game.week) + ' 周';
    }
    if (shop.biliDraft) {
      const st = shop.biliDraft.edited ? '待投稿' : (shop.biliDraft.shot ? '待后期' : (shop.biliDraft.planned ? '待拍摄' : '待选题'));
      return '「' + shop.brand + '」· ' + shop.track + ' · ' + st;
    }
  }
  if (shop.platform === 'douyin') {
    const streak = shop.liveStreak || 0;
    const done = shop.lastLiveWeek === game.week;
    if (shop.dyDraft) return '「' + shop.brand + '」· ' + shop.track + ' · 剪辑中';
    return '「' + shop.brand + '」· 连签' + streak + (done ? ' · 本周已播' : ' · 本周未播');
  }
  const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('media', shop.track) : 100;
  return '「' + shop.brand + '」· ' + shop.track + ' · 粉' + (shop.fans || 0) + ' · 指数' + Math.round(idx);
}

function sideChannelBtn(id, icon, label, statusLine, ok) {
  ok = ok !== false;
  const status = statusLine ? '<br><span class="fold-meta">' + statusLine + '</span>' : '';
  return '<button type="button" class="btn" style="text-align:left;width:100%;padding:8px 10px"' + (ok ? '' : ' disabled') +
    ' onclick="openSideChannel(\'' + id + '\')"><b>' + icon + ' ' + label + '</b>' + status + '</button>';
}

function renderSideIncomeChannels() {
  const se = ensureSelfEmploy();
  let h = '';
  h += '<div class="panel-title" style="margin-top:0">🛵 兼职 <span class="fold-meta">· 占日常时段</span></div>';
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">';
  h += sideChannelBtn('delivery', '🛵', '外卖',
    '连续2时段 · 10局 · 普通每局+¥10 / 挑战每局+¥100错-¥10', true);
  h += sideChannelBtn('ride', '🚗', '网约车',
    hasPlayerCar() ? ('连续2时段' + SIDE_TWO_SLOT_H + 'h · 收益¥100～300') : '需自有车', hasPlayerCar());
  h += '</div>';

  h += '<div class="panel-title">🛒 电商' + (canUseSideComputer() ? '' : ' <span class="fold-meta">（需电脑）</span>') + '</div>';
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">';
  ECOMMERCE_PLATFORMS.forEach(function (p) {
    h += sideChannelBtn(p.id, '🛒', p.name, getSelfShop(p.id) ? ecommerceStatusLine(getSelfShop(p.id)) : ('开店 · ' + (p.fee ? '¥' + p.fee : '免费') + ' · 运营' + ECOMMERCE_OPS_H + 'h'), canUseSideComputer());
  });
  h += '</div>';

  h += '<div class="panel-title">📺 自媒体</div>';
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">';
  MEDIA_PLATFORMS.forEach(function (p) {
    const needHint = p.id === 'douyin' ? '需手机' : '需电脑+手机';
    const ok = canUseSideMediaPlatform(p.id);
    const line = getSelfShop(p.id) ? mediaStatusLine(getSelfShop(p.id)) : needHint;
    h += sideChannelBtn(p.id, '📺', p.name, line, ok);
  });
  h += '</div>';

  h += '<div class="panel-title">🍜 个体户</div>';
  const vLine = se.vendor ? ('「' + se.vendor.cart + '」@' + (se.vendor.spotName || '—') + ' · 摆摊' + SIDE_TWO_SLOT_H + 'h') : ('美食小车 ¥' + FOOD_CART_COST.toLocaleString());
  h += sideChannelBtn('vendor', '🍜', '美食小车', vLine, true);
  return h;
}

function hasScamJobOffer() {
  if (!game) return false;
  return !!(game.inbox || []).find(function (it) { return String(it.id || '').indexOf('scam_') === 0; });
}

function toggleSideIncomePanel() {
  if (!game) return;
  if (typeof showTab === 'function') { showTab('sideincome'); return; }
  game.sideIncomePanelOpen = !game.sideIncomePanelOpen;
  if (typeof renderDailyPanel === 'function') renderDailyPanel();
}

function refreshSelfEmployUi() {
  if (typeof currentTab !== 'undefined' && currentTab === 'sideincome' && typeof renderSideIncomeTabPanel === 'function') renderSideIncomeTabPanel();
  else if (typeof renderSelfEmployPanel === 'function') renderSelfEmployPanel();
}

function renderSideIncomeTabPanel() {
  const el = document.getElementById('sideIncomeTabPanel');
  if (!el || !game) return;
  if (typeof renderDailyTimeBar === 'function') renderDailyTimeBar();
  const se = ensureSelfEmploy();
  let h = '<div class="panel-title">🏪 副业 · 自营</div>';
  h += '<p class="fold-meta" style="margin:0 0 10px">与「日常」共用时段 · 弹窗点选 · 收益按文档算法（电商暂不实现进货）</p>';
  h += renderSideIncomeChannels();
  if (se.scamBook && se.scamBook.contacts) {
    h += '<div style="margin-top:10px;padding:8px;border:1px solid var(--orange);border-radius:8px">';
    h += '<b style="color:var(--orange)">📒 诈骗岗 · 特殊通讯簿</b> · 已拨 ' + (se.scamBook.calls || 0);
    h += '<p class="fold-meta" style="margin:6px 0">三种操作须在<b>上班时段</b>进行：📒 单人外呼(1h) · 📞 集中外呼(2h) · 🛒 推销套餐(2h)</p>';
    h += ' <button type="button" class="btn" style="font-size:.72rem" onclick="openScamBook()">打开名单</button>';
    if (typeof isPlayerOnWorkShift === 'function' && isPlayerOnWorkShift()) {
      h += ' <button type="button" class="btn btn-primary" style="font-size:.72rem" onclick="openScamBook(true)">📒 单人外呼</button>';
    }
    h += ' <button type="button" class="btn btn-warn" style="font-size:.72rem" onclick="confirmScamSideJobResign();refreshSelfEmployUi()">脱身（被敲诈）</button></div>';
  } else if (hasScamJobOffer()) {
    const mail = (game.inbox || []).find(function (it) { return String(it.id || '').indexOf('scam_') === 0; });
    h += '<div style="margin-top:10px;padding:8px;border:1px solid var(--orange);border-radius:8px">';
    h += '<b style="color:var(--orange)">⚠ 可疑招聘</b> · ' + (mail && mail.title ? mail.title : '投必中');
    h += '<p style="margin:6px 0 0"><button type="button" class="btn btn-warn" onclick="acceptScamJob();refreshSelfEmployUi()">接受</button></p></div>';
  }
  el.innerHTML = h;
}

function renderSideIncomePanel() {
  if (!game) return '';
  if (game.sideIncomePanelOpen == null) game.sideIncomePanelOpen = false;
  const open = !!game.sideIncomePanelOpen;
  let h = '<div class="phone-fold side-income-fold" style="margin-top:8px">';
  h += '<div class="phone-fold-hdr" onclick="toggleSideIncomePanel()"><b>🏪 副业 · 自营</b>';
  h += '<span class="phone-fold-chev" style="margin-left:auto;color:var(--muted)">' + (open ? '▼' : '▶') + '</span></div>';
  h += '<div class="phone-fold-body"' + (open ? '' : ' style="display:none"') + '>' + renderSideIncomeChannels() + '</div></div>';
  return h;
}

function renderSelfEmployPanel() {
  const el = document.getElementById('selfEmployPanel');
  if (!el || !game) return;
  el.innerHTML = '<div class="panel-title">🏪 自营</div>' + renderSideIncomeChannels();
}

function openSelfEmploy(key) {
  openSideChannel(key === 'partTime' ? 'delivery' : key === 'ecommerce' ? 'tmall' : key);
}

function openSideChannel(id) {
  if (id === 'delivery') return openDeliveryChannel();
  if (id === 'ride') return openRideChannel();
  if (id === 'vendor') return openVendorChannel();
  if (id === 'tmall' || id === 'taofish') return openEcommerceChannel(id);
  if (id === 'bilibili' || id === 'douyin') return openMediaChannel(id);
}

function pickChoiceModal(opts) {
  if (typeof showConsumeModalHandlers !== 'function') return;
  const buttons = (opts.choices || []).map(function (c) {
    return {
      text: c.label, primary: !!c.primary,
      handler: function () {
        closeConsumeModal(true);
        if (typeof c.onPick === 'function') c.onPick(c.value);
      }
    };
  });
  if (opts.cancel !== false) buttons.push({ text: '取消', handler: function () { closeConsumeModal(true); } });
  showConsumeModalHandlers({ icon: opts.icon || '🏪', title: opts.title || '请选择', html: opts.html || '', buttons: buttons });
}

/* ── 外卖：连续2时段 + 10局找词 · 每局单独结算 ── */
function openDeliveryChannel() {
  const block = sideCanSpendTwoSlots();
  if (block) { addLog(block, 'fail'); return; }
  pickChoiceModal({
    icon: '🛵', title: '外卖 · 开工',
    html: '<p>占 <b>连续2时段</b> · 连续完成 <b>' + DELIVERY_ROUNDS + ' 局</b>找词</p>' +
      '<p class="fold-meta">普通：' + DELIVERY_TIMER_NORMAL + '秒 · 每局对+¥10 · 错/超时不算钱<br>挑战：' + DELIVERY_TIMER_HARD + '秒 · 每局对+¥100 · 错/超时-¥10</p>',
    choices: [
      { label: '普通外卖（慢 · 每局+¥10）', primary: true, value: false, onPick: beginDeliveryShift },
      { label: '挑战外卖（快 · 每局+¥100/-¥10）', value: true, onPick: beginDeliveryShift }
    ]
  });
}

function beginDeliveryShift(hard) {
  if (!sideSpendTwoSlots('delivery', '外卖')) return;
  runDeliveryRound(!!hard, 1, 0, 0);
}

function shuffleDeliveryPool(target) {
  const pool = [target];
  while (pool.length < 8) {
    const w = DELIVERY_WORDS[Math.floor(Math.random() * DELIVERY_WORDS.length)];
    if (pool.indexOf(w) < 0) pool.push(w);
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
  }
  return pool;
}

function runDeliveryRound(hard, round, okCount, totalEarned) {
  if (typeof showConsumeModalHandlers !== 'function') return;
  const target = DELIVERY_WORDS[Math.floor(Math.random() * DELIVERY_WORDS.length)];
  const pool = shuffleDeliveryPool(target);
  let left = hard ? DELIVERY_TIMER_HARD : DELIVERY_TIMER_NORMAL;
  let settled = false;
  let timerId = null;

  function finishRound(ok) {
    if (settled) return;
    settled = true;
    if (timerId) clearInterval(timerId);
    timerId = null;
    closeConsumeModal(true);
    let earn = totalEarned;
    const nextOk = okCount + (ok ? 1 : 0);
    if (hard) {
      if (ok) {
        game.cash += 100;
        earn += 100;
        if (typeof ledgerAddIncome === 'function') ledgerAddIncome('parttime', '🛵', '外卖挑战第' + round + '局', 100);
      } else {
        game.cash -= 10;
        earn -= 10;
        if (typeof ledgerAddExpense === 'function') ledgerAddExpense('parttime', '🛵', '外卖挑战第' + round + '局', 10, false);
      }
    } else if (ok) {
      game.cash += 10;
      earn += 10;
      if (typeof ledgerAddIncome === 'function') ledgerAddIncome('parttime', '🛵', '外卖第' + round + '局', 10);
    }
    if (round >= DELIVERY_ROUNDS) return finishDeliveryShift(hard, earn, nextOk);
    setTimeout(function () { runDeliveryRound(hard, round + 1, nextOk, earn); }, 120);
  }

  function bodyHtml() {
    const rule = hard
      ? ('对+¥100 · 错/超时-¥10 · ' + DELIVERY_TIMER_HARD + '秒')
      : ('对+¥10 · 错/超时不扣 · ' + DELIVERY_TIMER_NORMAL + '秒');
    const leftTxt = hard ? (left % 1 === 0 ? String(left) : left.toFixed(1)) : left;
    return '<p>第 <b>' + round + '</b>/' + DELIVERY_ROUNDS + ' 局 · 找：<b style="color:var(--accent)">' + target + '</b></p>' +
      '<p class="fold-meta">⏱ 剩余 <b id="seDeliveryTimer">' + leftTxt + '</b> 秒 · ' + rule + '</p>' +
      (totalEarned !== 0 ? '<p class="fold-meta">本班累计 ¥' + totalEarned + '</p>' : '');
  }

  const buttons = pool.map(function (w) {
    return { text: w, handler: function () { finishRound(w === target); } };
  });

  showConsumeModalHandlers({ icon: '🛵', title: hard ? '挑战外卖' : '普通外卖', html: bodyHtml(), buttons: buttons });
  const tickMs = hard ? 500 : 1000;
  const step = hard ? 0.5 : 1;
  timerId = setInterval(function () {
    if (settled) return;
    left -= step;
    if (left < 0) left = 0;
    const el = document.getElementById('seDeliveryTimer');
    if (el) el.textContent = hard ? (left % 1 === 0 ? String(left) : left.toFixed(1)) : left;
    if (left <= 0) finishRound(false);
  }, tickMs);
}

function finishDeliveryShift(hard, totalEarned, okCount) {
  ensureSelfEmploy().deliveryRuns = (ensureSelfEmploy().deliveryRuns || 0) + 1;
  const sign = totalEarned >= 0 ? '+' : '';
  const wrong = DELIVERY_ROUNDS - okCount;
  addLog('🛵 ' + (hard ? '挑战' : '普通') + '外卖 ' + DELIVERY_ROUNDS + ' 局 · 对' + okCount + ' · ' + sign + '¥' + totalEarned, totalEarned >= 0 ? 'success' : 'fail');
  sideRefreshUi();
  if (typeof showConsumeModalHandlers !== 'function') return;
  const modeLabel = hard ? '挑战外卖' : '普通外卖';
  const earnColor = totalEarned >= 0 ? 'var(--green)' : 'var(--red)';
  const earnLine = hard
    ? ('每局对 +¥100 · 错或超时 -¥10')
    : ('每局对 +¥10 · 错或超时不扣钱');
  showConsumeModalHandlers({
    icon: '🛵',
    title: modeLabel + ' · 结算',
    html: '<p><b>' + DELIVERY_ROUNDS + ' 局</b>已全部结束</p>' +
      '<p>✅ 点对 <b>' + okCount + '</b> 局 · ❌ 错/超时 <b>' + wrong + '</b> 局</p>' +
      '<p class="fold-meta">' + earnLine + '</p>' +
      '<p style="margin-top:10px;font-size:1.1rem">本班收入 <b style="color:' + earnColor + '">' + sign + '¥' + totalEarned + '</b></p>',
    buttons: [{ text: '知道了', primary: true, handler: function () { closeConsumeModal(true); } }]
  });
}

/* ── 网约车：连续2时段 · ¥100～300 ── */
function openRideChannel() {
  if (!hasPlayerCar()) { addLog('网约车需自有车', 'fail'); return; }
  const block = sideCanSpendTwoSlots();
  if (block) { addLog(block, 'fail'); return; }
  if (typeof showConsumeModalHandlers !== 'function') return;
  showConsumeModalHandlers({
    icon: '🚗', title: '网约车 · 出车',
    html: '<p>占 <b>连续2时段（' + SIDE_TWO_SLOT_H + 'h）</b> · 收益 <b>¥100～300</b></p>',
    buttons: [
      { text: '开始出车', primary: true, handler: function () { closeConsumeModal(true); beginRideShift(); } },
      { text: '取消', handler: function () { closeConsumeModal(true); } }
    ]
  });
}

function beginRideShift() {
  if (!hasPlayerCar()) return;
  if (!sideSpendTwoSlots('ride', '网约车')) return;
  const pay = 100 + Math.floor(Math.random() * 201);
  game.cash += pay;
  ensureSelfEmploy().rideRuns = (ensureSelfEmploy().rideRuns || 0) + 1;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('parttime', '🚗', '网约车', pay);
  addLog('🚗 网约车 ' + SIDE_TWO_SLOT_H + 'h · +¥' + pay, 'success');
  sideRefreshUi();
}

/* ── 电商：开店点选 · 周运营2h · flux指数 ── */
function openEcommerceChannel(platformId) {
  if (!canUseSideComputer()) { addLog('电商需先购买电脑', 'fail'); return; }
  const shop = getSelfShop(platformId);
  if (shop) return openEcommerceOps(platformId, shop);
  const plat = ecommercePlatformMeta(platformId);
  pickChoiceModal({
    icon: '🛒', title: plat.name + ' · 开店',
    html: '<p>注册 <b>' + (plat.fee ? '¥' + plat.fee : '免费') + '</b> · 再选品牌与赛道 · 每周运营' + ECOMMERCE_OPS_H + 'h</p>',
    choices: playerBrandPresets().map(function (name, i) {
      return { label: name, primary: i === 0, value: name, onPick: function (brand) { pickEcommerceTrack(platformId, brand); } };
    })
  });
}

function pickEcommerceTrack(platformId, brand) {
  const plat = ecommercePlatformMeta(platformId);
  pickChoiceModal({
    icon: '🛒', title: plat.name + ' · 选赛道',
    html: '<p>品牌 <b>「' + brand + '」</b> · 销量随竞品指数涨落</p>',
    choices: ECOMMERCE_TRACKS.map(function (t, i) {
      return { label: t, primary: i === 0, value: t, onPick: function (track) { confirmOpenEcommerceShop(platformId, brand, track); } };
    })
  });
}

function confirmOpenEcommerceShop(platformId, brand, track) {
  const plat = ecommercePlatformMeta(platformId);
  if (plat.fee && game.cash < plat.fee) { addLog('注册 ' + plat.name + ' 需 ¥' + plat.fee, 'fail'); return; }
  if (plat.fee) {
    game.cash -= plat.fee;
    if (typeof ledgerAddExpense === 'function') ledgerAddExpense('self', '🛒', plat.name + '注册', plat.fee, false);
  }
  if (typeof initFluxTrack === 'function') initFluxTrack('ecommerce', track, 100);
  ensureSelfEmploy().shops[platformId] = {
    platform: platformId, platformName: plat.name, brand: brand, track: track,
    baseSales: 20 + Math.floor(Math.random() * 30)
  };
  addLog('🛒 ' + plat.name + ' 开店「' + brand + '」· ' + track, 'success');
  sideRefreshUi();
  openEcommerceOps(platformId, ensureSelfEmploy().shops[platformId]);
}

function openEcommerceOps(platformId, shop) {
  if (typeof showConsumeModalHandlers !== 'function') return;
  const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('ecommerce', shop.track) : 100;
  const trend = typeof fluxTrendLabel === 'function' ? fluxTrendLabel('ecommerce', shop.track) : '';
  const estSales = Math.round(shop.baseSales * (idx / 100));
  showConsumeModalHandlers({
    icon: '🛒', title: shop.brand + ' · ' + shop.platformName,
    html: '<p>赛道 <b>' + shop.track + '</b> · 指数 <b>' + Math.round(idx) + '</b> ' + trend + '</p>' +
      '<p class="fold-meta">本周预估约 ' + estSales + ' 单 · 运营占 ' + ECOMMERCE_OPS_H + 'h · 进货规则待定</p>',
    buttons: [
      { text: '本周运营（-' + ECOMMERCE_OPS_H + 'h）', primary: true, handler: function () { closeConsumeModal(true); runEcommerceWeek(platformId); } },
      { text: '关闭', handler: function () { closeConsumeModal(true); } }
    ]
  });
}

function runEcommerceWeek(platformId) {
  const shop = getSelfShop(platformId);
  if (!shop) return;
  if (!sideSpendHours(ECOMMERCE_OPS_H, 'ecommerce', '电商运营')) return;
  const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('ecommerce', shop.track) : 100;
  const orders = Math.max(0, Math.round(shop.baseSales * (idx / 100) * (0.7 + Math.random() * 0.6)));
  const revenue = orders * (30 + Math.floor(Math.random() * 120));
  game.cash += revenue;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('self', '🛒', shop.platformName + '营收', revenue);
  addLog('🛒 ' + shop.platformName + ' · ' + orders + ' 单 · 指数' + Math.round(idx) + ' · +¥' + revenue.toLocaleString(), 'success');
  sideRefreshUi();
}

/* ── 自媒体：分平台流程 · 赛道设备要求 ── */
function openMediaChannel(platformId) {
  if (!canUseSideMediaPlatform(platformId)) {
    addLog(platformId === 'douyin' ? '抖音需手机' : 'B站需电脑和手机', 'fail');
    return;
  }
  const shop = getSelfShop(platformId);
  if (shop) return openMediaOps(platformId, shop);
  const plat = mediaPlatformMeta(platformId);
  pickChoiceModal({
    icon: '📺', title: plat.name + ' · 开通',
    html: '<p class="fold-meta">选账号名 → 选赛道（各赛道设备要求不同）</p>',
    choices: playerMediaPresets().map(function (name, i) {
      return { label: name, primary: i === 0, value: name, onPick: function (brand) { pickMediaTrack(platformId, brand); } };
    })
  });
}

function pickMediaTrack(platformId, brand) {
  const plat = mediaPlatformMeta(platformId);
  pickChoiceModal({
    icon: '📺', title: plat.name + ' · 选赛道',
    html: '<p>账号 <b>「' + brand + '」</b></p>',
    choices: plat.tracks.map(function (t, i) {
      const ok = trackMeetsReq(t, platformId);
      return {
        label: t + (ok ? '' : '（' + trackReqLabel(t, platformId) + '）'),
        primary: i === 0 && ok,
        value: t,
        onPick: function (track) {
          if (!trackMeetsReq(track, platformId)) { addLog(trackReqLabel(track, platformId), 'fail'); return; }
          confirmOpenMediaShop(platformId, brand, track);
        }
      };
    })
  });
}

function confirmOpenMediaShop(platformId, brand, track) {
  const plat = mediaPlatformMeta(platformId);
  if (typeof initFluxTrack === 'function') initFluxTrack('media', track, 100);
  ensureSelfEmploy().shops[platformId] = {
    platform: platformId, platformName: plat.name, brand: brand, track: track,
    fans: 100 + Math.floor(Math.random() * 400), liveStreak: 0, lastLiveWeek: -1,
    biliDraft: null, dyDraft: null
  };
  addLog('📺 ' + plat.name + '「' + brand + '」· ' + track, 'success');
  sideRefreshUi();
  openMediaOps(platformId, ensureSelfEmploy().shops[platformId]);
}

function openMediaOps(platformId, shop) {
  if (shop.platform === 'bilibili') return openBilibiliOps(shop);
  return openDouyinOps(shop);
}

function openBilibiliOps(shop) {
  if (typeof showConsumeModalHandlers !== 'function') return;
  const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('media', shop.track) : 100;
  let html = '<p>赛道 <b>' + shop.track + '</b> · 指数 <b>' + Math.round(idx) + '</b> · 粉 ' + (shop.fans || 0) + '</p>';
  html += '<p class="fold-meta">流程：选题' + MEDIA_BILI_PLAN_SLOTS + '时段 → 拍摄' + MEDIA_BILI_SHOOT_SLOTS + '时段 → 剪辑' + MEDIA_BILI_EDIT_SLOTS + '时段 → 投稿审核2～4周</p>';
  if (!trackMeetsReq(shop.track, 'bilibili')) html += '<p style="color:var(--orange)">当前赛道需：' + trackReqLabel(shop.track, 'bilibili') + '</p>';

  if (shop.pendingUploadUntilWeek && game.week < shop.pendingUploadUntilWeek) {
    html += '<p style="color:var(--orange)">⏳ 审核中 · 剩 <b>' + (shop.pendingUploadUntilWeek - game.week) + '</b> 周</p>';
    showConsumeModalHandlers({
      icon: '📺', title: shop.brand + ' · B站', html: html,
      buttons: [{ text: '等待审核', handler: function () { closeConsumeModal(true); } }]
    });
    return;
  }
  if (shop.pendingUploadUntilWeek && game.week >= shop.pendingUploadUntilWeek && !shop._publishedClaimed) {
    showConsumeModalHandlers({
      icon: '📺', title: shop.brand + ' · B站', html: html + '<p style="color:var(--green)">✅ 审核完成 · 可收取发布收益</p>',
      buttons: [
        { text: '收取发布收益', primary: true, handler: function () { closeConsumeModal(true); claimBilibiliUpload('bilibili'); } },
        { text: '关闭', handler: function () { closeConsumeModal(true); } }
      ]
    });
    return;
  }

  const draft = shop.biliDraft;
  const buttons = [{ text: '关闭', handler: function () { closeConsumeModal(true); } }];
  if (!draft || !draft.planned) {
    buttons.unshift({
      text: '① 选题策划（' + MEDIA_BILI_PLAN_SLOTS + '时段）', primary: true,
      handler: function () {
        closeConsumeModal(true);
        const needBlock = sideCanSpendSlots(MEDIA_BILI_PLAN_SLOTS);
        if (needBlock) { addLog(needBlock, 'fail'); return; }
        pickChoiceModal({
          icon: '📝', title: '选题策划',
          html: '<p>占 <b>' + MEDIA_BILI_PLAN_SLOTS + ' 个连续时段</b></p>',
          choices: BILI_TOPICS.map(function (t, i) {
            return {
              label: t, primary: i === 0, value: t,
              onPick: function (topic) {
                if (!sideSpendSlots(MEDIA_BILI_PLAN_SLOTS, 'media', 'B站选题')) return;
                shop.biliDraft = { topic: topic, planned: true, shot: false, edited: false };
                addLog('📝 B站选题「' + topic + '」', 'info');
                sideRefreshUi();
                openBilibiliOps(shop);
              }
            };
          })
        });
      }
    });
  } else if (!draft.shot) {
    buttons.unshift({
      text: '② 拍摄（' + MEDIA_BILI_SHOOT_SLOTS + '时段）', primary: true,
      handler: function () {
        closeConsumeModal(true);
        if (!trackMeetsReq(shop.track, 'bilibili')) { addLog(trackReqLabel(shop.track, 'bilibili'), 'fail'); return; }
        const needBlock = sideCanSpendSlots(MEDIA_BILI_SHOOT_SLOTS);
        if (needBlock) { addLog(needBlock, 'fail'); return; }
        if (!sideSpendSlots(MEDIA_BILI_SHOOT_SLOTS, 'media', 'B站拍摄')) return;
        draft.shot = true;
        addLog('🎬 B站拍摄完成 · 「' + draft.topic + '」', 'info');
        sideRefreshUi();
        openBilibiliOps(shop);
      }
    });
  } else if (!draft.edited) {
    buttons.unshift({
      text: '③ 后期剪辑（' + MEDIA_BILI_EDIT_SLOTS + '时段 · 需电脑）', primary: true,
      handler: function () {
        closeConsumeModal(true);
        if (!canUseSideComputer()) { addLog('后期需电脑', 'fail'); return; }
        const needBlock = sideCanSpendSlots(MEDIA_BILI_EDIT_SLOTS);
        if (needBlock) { addLog(needBlock, 'fail'); return; }
        if (!sideSpendSlots(MEDIA_BILI_EDIT_SLOTS, 'media', 'B站后期')) return;
        draft.edited = true;
        addLog('✂️ B站后期完成', 'info');
        sideRefreshUi();
        openBilibiliOps(shop);
      }
    });
  } else {
    buttons.unshift({
      text: '④ 投稿（进入2～4周审核）', primary: true,
      handler: function () {
        closeConsumeModal(true);
        startBilibiliUpload('bilibili');
        sideRefreshUi();
      }
    });
  }
  showConsumeModalHandlers({ icon: '📺', title: shop.brand + ' · B站', html: html, buttons: buttons });
}

function openDouyinOps(shop) {
  if (typeof showConsumeModalHandlers !== 'function') return;
  const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('media', shop.track) : 100;
  let html = '<p>赛道 <b>' + shop.track + '</b> · 指数 <b>' + Math.round(idx) + '</b> · 连签 ' + (shop.liveStreak || 0) + '</p>';
  html += '<p class="fold-meta">短视频：拍摄' + MEDIA_DY_SHOOT_H + 'h+剪辑' + MEDIA_DY_EDIT_H + 'h · 直播：' + MEDIA_DY_LIVE_H + 'h/次 · 仅需手机</p>';
  if (!trackMeetsReq(shop.track, 'douyin')) html += '<p style="color:var(--orange)">当前赛道需：' + trackReqLabel(shop.track, 'douyin') + '</p>';

  const buttons = [{ text: '关闭', handler: function () { closeConsumeModal(true); } }];
  const draft = shop.dyDraft;

  if (!draft || !draft.shot) {
    buttons.unshift({
      text: '① 拍摄（-' + MEDIA_DY_SHOOT_H + 'h）', primary: true,
      handler: function () {
        closeConsumeModal(true);
        if (!trackMeetsReq(shop.track, 'douyin')) { addLog(trackReqLabel(shop.track, 'douyin'), 'fail'); return; }
        if (!sideSpendHours(MEDIA_DY_SHOOT_H, 'media', '抖音拍摄')) return;
        shop.dyDraft = { shot: true, edited: false };
        addLog('🎬 抖音素材拍摄完成', 'info');
        sideRefreshUi();
        openDouyinOps(shop);
      }
    });
  } else if (!draft.edited) {
    buttons.unshift({
      text: '② 剪辑（-' + MEDIA_DY_EDIT_H + 'h）', primary: true,
      handler: function () {
        closeConsumeModal(true);
        if (!sideSpendHours(MEDIA_DY_EDIT_H, 'media', '抖音剪辑')) return;
        draft.edited = true;
        addLog('✂️ 抖音剪辑完成', 'info');
        sideRefreshUi();
        openDouyinOps(shop);
      }
    });
  } else {
    buttons.unshift({
      text: '③ 发布短视频', primary: true,
      handler: function () {
        closeConsumeModal(true);
        shop.dyDraft = null;
        runMediaWeek('douyin');
      }
    });
  }

  if (shop.lastLiveWeek !== game.week) {
    buttons.unshift({
      text: '🔴 直播签到（-' + MEDIA_DY_LIVE_H + 'h）',
      handler: function () { closeConsumeModal(true); runDouyinLive('douyin'); }
    });
  }
  if ((shop.track === '剧情' || shop.track === '生活') && typeof runMediaLifeScandal === 'function') {
    buttons.unshift({
      text: '狗血生活记录（拍摄+剪辑后）',
      handler: function () {
        closeConsumeModal(true);
        if (!draft || !draft.edited) { addLog('需先完成拍摄与剪辑', 'fail'); return; }
        runMediaLifeScandal('douyin');
      }
    });
  }
  showConsumeModalHandlers({ icon: '📺', title: shop.brand + ' · 抖音', html: html, buttons: buttons });
}

function startBilibiliUpload(platformId) {
  const shop = getSelfShop(platformId);
  if (!shop || !shop.biliDraft || !shop.biliDraft.edited) { addLog('需先完成选题/拍摄/后期', 'fail'); return; }
  if (shop.pendingUploadUntilWeek && game.week < shop.pendingUploadUntilWeek) return;
  const wait = 2 + Math.floor(Math.random() * 3);
  shop.pendingUploadUntilWeek = game.week + wait;
  shop._publishedClaimed = false;
  shop.uploadTitle = shop.biliDraft.topic;
  shop.biliDraft = null;
  addLog('📤 B站投稿「' + shop.uploadTitle + '」· 预计 ' + wait + ' 周后发布', 'info');
}

function claimBilibiliUpload(platformId) {
  const shop = getSelfShop(platformId);
  if (!shop || !shop.pendingUploadUntilWeek || game.week < shop.pendingUploadUntilWeek) return;
  if (shop._publishedClaimed) return;
  shop._publishedClaimed = true;
  const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('media', shop.track) : 100;
  const views = Math.round((shop.fans || 500) * (idx / 100) * (1.2 + Math.random()));
  const revenue = Math.round(views * 0.02 + Math.random() * 500);
  shop.fans = (shop.fans || 500) + Math.floor(views / 400);
  game.cash += revenue;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('self', '📺', 'B站发布', revenue);
  addLog('📺 B站发布 · 播放 ' + views.toLocaleString() + ' · +¥' + revenue, 'success');
  shop.pendingUploadUntilWeek = null;
  sideRefreshUi();
}

function runDouyinLive(platformId) {
  const shop = getSelfShop(platformId);
  if (!shop || shop.platform !== 'douyin') return;
  if (shop.lastLiveWeek === game.week) { addLog('本周已直播', 'warn'); return; }
  if (!sideSpendHours(MEDIA_DY_LIVE_H, 'media', '抖音直播')) return;
  if (shop.lastLiveWeek != null && shop.lastLiveWeek < game.week - 1) {
    addLog('🔴 直播断签 · 连签归零', 'warn');
    shop.liveStreak = 0;
  }
  shop.lastLiveWeek = game.week;
  shop.liveStreak = (shop.liveStreak || 0) + 1;
  const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('media', shop.track) : 100;
  const revenue = Math.round(80 + idx * 0.5 + shop.liveStreak * 25 + Math.random() * 100);
  game.cash += revenue;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('self', '📺', '抖音直播', revenue);
  addLog('🔴 抖音直播 · 连签 ' + shop.liveStreak + ' · +¥' + revenue, 'success');
  sideRefreshUi();
}

function tickSelfEmployMedia() {
  const se = game && game.selfEmploy;
  if (!se || !se.shops) return;
  const dy = se.shops.douyin;
  if (dy && dy.lastLiveWeek != null && dy.lastLiveWeek < game.week - 1 && dy.liveStreak > 0) dy.liveStreak = 0;
}

function runMediaWeek(platformId) {
  const shop = getSelfShop(platformId);
  if (!shop) return;
  const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('media', shop.track) : 100;
  const views = Math.round((shop.fans || 500) * (idx / 100) * (0.5 + Math.random()));
  const revenue = Math.round(views * 0.015 + Math.random() * 200);
  shop.fans = (shop.fans || 500) + Math.floor(views / 500);
  game.cash += revenue;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('self', '📺', shop.platformName, revenue);
  addLog('📺 ' + shop.platformName + ' · 播放 ' + views.toLocaleString() + ' · +¥' + revenue, 'success');
  sideRefreshUi();
}

/* ── 个体户：连续2时段摆摊 ── */
function openVendorChannel() {
  const se = ensureSelfEmploy();
  if (!se.vendor) return openVendorSetup();
  pickVendorSpot();
}

function openVendorSetup() {
  if (game.cash < FOOD_CART_COST) { addLog('美食小车需 ¥' + FOOD_CART_COST, 'fail'); return; }
  pickChoiceModal({
    icon: '🍜', title: '购置美食小车',
    html: '<p>¥' + FOOD_CART_COST.toLocaleString() + ' · 摆摊占连续2时段</p>',
    choices: vendorCartPresets().map(function (name, i) {
      return {
        label: name, primary: i === 0, value: name,
        onPick: function (cart) {
          game.cash -= FOOD_CART_COST;
          if (typeof ledgerAddExpense === 'function') ledgerAddExpense('self', '🍜', '美食小车', FOOD_CART_COST, false);
          ensureSelfEmploy().vendor = { cart: cart, spot: 'school', spotName: '学校门口' };
          addLog('🍜 购置「' + cart + '」', 'success');
          sideRefreshUi();
          pickVendorSpot();
        }
      };
    })
  });
}

function pickVendorSpot() {
  const se = ensureSelfEmploy();
  if (!se.vendor) return;
  pickChoiceModal({
    icon: '🍜', title: se.vendor.cart + ' · 选地点',
    html: '<p>占 <b>连续2时段（' + SIDE_TWO_SLOT_H + 'h）</b></p>',
    choices: VENDOR_SPOTS.map(function (s, i) {
      return {
        label: s.name + (s.id === 'club' ? '（高收益）' : ''), primary: i === 0, value: s,
        onPick: function (spot) { runVendorShift(spot); }
      };
    })
  });
}

function runVendorShift(spot) {
  const se = ensureSelfEmploy();
  if (!se.vendor || !spot) return;
  if (!sideSpendTwoSlots('vendor', '摆摊')) return;
  se.vendor.spot = spot.id;
  se.vendor.spotName = spot.name;
  const revenue = 80 + Math.floor(Math.random() * 220) + (spot.id === 'club' ? 120 : 0);
  game.cash += revenue;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('self', '🍜', '摆摊', revenue);
  addLog('🍜 ' + se.vendor.cart + '@' + spot.name + ' · ' + SIDE_TWO_SLOT_H + 'h · +¥' + revenue, 'success');
  sideRefreshUi();
}

function pickScamBookFromPicker(idx) {
  const pk = game && game.contactPicker;
  if (!pk || pk.mode !== 'scamBook') return;
  const handler = pk.onPick;
  game.contactPicker = null;
  if (typeof closeContactsModal === 'function') closeContactsModal();
  if (handler) handler(idx);
}

function renderScamBookPickerModal(body, ti) {
  const pk = game.contactPicker || {};
  const book = game.selfEmploy && game.selfEmploy.scamBook;
  if (ti) ti.textContent = '📇 ' + (pk.title || '话术通讯簿');
  const fromWork = !!pk.fromWork;
  const left = typeof dailySlotHoursLeft === 'function' ? dailySlotHoursLeft() : 8;
  let h = '<p class="fold-meta" style="margin:0 0 8px">' + (pk.hint || '按组折叠 · 选人外呼') + '</p>';
  h += '<button type="button" class="btn" style="font-size:.72rem;margin-bottom:8px" onclick="cancelContactPicker()">取消</button>';
  if (!book || !book.contacts || !book.contacts.length) {
    h += '<p style="color:var(--muted)">名单为空</p>';
    body.innerHTML = h;
    return;
  }
  const buckets = { uncalled: [], ideal: [], called: [] };
  book.contacts.forEach(function (t, i) {
    if (t.converted) return;
    const row = { t: t, idx: i };
    if (t.called) buckets.called.push(row);
    else if (t.lead === 'ideal') buckets.ideal.push(row);
    else buckets.uncalled.push(row);
  });
  const groups = [];
  if (buckets.uncalled.length) groups.push({ key: 'sb_uncalled', label: '未拨', rows: buckets.uncalled });
  if (buckets.ideal.length) groups.push({ key: 'sb_ideal', label: '理想线索', rows: buckets.ideal });
  if (buckets.called.length) groups.push({ key: 'sb_called', label: '已拨', rows: buckets.called });
  if (!groups.length) {
    h += '<p style="color:var(--muted)">名单已全部转化</p>';
    body.innerHTML = h;
    return;
  }
  groups.forEach(function (g) {
    const folded = typeof isContactGroupFolded === 'function' ? isContactGroupFolded(g.key) : false;
    h += '<div class="contact-group-fold">';
    h += '<div class="phone-fold-hdr contact-group-hdr" onclick="toggleContactGroupFold(\'' + g.key + '\')">';
    h += '<span class="phone-fold-chev contact-group-chev" style="color:var(--muted)">' + (folded ? '▶' : '▼') + '</span>';
    h += '<b style="font-size:.85rem">' + g.label + '</b> <span class="fold-meta">' + g.rows.length + ' 人</span>';
    h += '</div>';
    if (!folded) {
      h += '<div class="contact-group-body">';
      g.rows.forEach(function (row) {
        const canDial = fromWork && !row.t.called && left >= 1;
        h += '<div class="contact-row contact-pick-row' + (canDial ? '' : ' contact-pick-disabled') + '">';
        h += '<div class="contact-row-hdr"><b>' + row.t.name + '</b>';
        if (row.t.lead === 'ideal') h += ' <span class="fold-meta" style="color:var(--yellow)">理想线索</span>';
        if (row.t.called) h += ' <span class="fold-meta">已拨</span>';
        h += '</div><div class="contact-actions-row">';
        if (canDial) {
          h += '<button class="btn btn-primary" style="font-size:.72rem;padding:3px 10px" onclick="pickScamBookFromPicker(' + row.idx + ')">📞 外呼</button>';
        } else if (row.t.lead === 'ideal' && row.t.called && !row.t.converted && typeof convertScamLeadToIdeal === 'function') {
          h += '<button class="btn" style="font-size:.72rem;padding:3px 10px" onclick="convertScamLeadToIdeal(' + row.idx + ');if(typeof openScamBook===\'function\')openScamBook(' + (fromWork ? 'true' : 'false') + ')">✨ 转入联系人</button>';
        } else if (fromWork && !row.t.called && left < 1) {
          h += '<span class="fold-meta">本时段工时已满</span>';
        } else if (!fromWork) {
          h += '<span class="fold-meta">需上班中操作</span>';
        }
        h += '</div></div>';
      });
      h += '</div>';
    }
    h += '</div>';
  });
  body.innerHTML = h;
}

function openScamBook(fromWork) {
  const book = game && game.selfEmploy && game.selfEmploy.scamBook;
  if (!book || !book.contacts) return;
  const onShift = typeof isPlayerOnWorkShift === 'function' && isPlayerOnWorkShift();
  fromWork = !!fromWork || onShift;
  if (typeof hasUsablePhone === 'function' && !hasUsablePhone()) {
    addLog('暂无可用手机', 'fail');
    return;
  }
  if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  const left = typeof dailySlotHoursLeft === 'function' ? dailySlotHoursLeft() : 8;
  game.contactPicker = {
    mode: 'scamBook',
    title: '话术通讯簿',
    hint: fromWork
      ? '按组折叠 · 选人外呼 · 每人1h · 剩 ' + left + 'h'
      : '按组折叠 · 单人外呼需在上班中打开',
    fromWork: fromWork,
    onPick: function (idx) {
      if (fromWork && typeof callScamTargetFromWorkShift === 'function') callScamTargetFromWorkShift(idx);
    },
    onCancel: function () {
      if (fromWork && typeof returnToWorkShiftModal === 'function') returnToWorkShiftModal();
    }
  };
  if (typeof openContactsModal === 'function') openContactsModal();
}
