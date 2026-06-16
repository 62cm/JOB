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
const RIDE_HOURS = 16;

function ensureSelfEmploy() {
  if (!game) return null;
  if (!game.selfEmploy) {
    game.selfEmploy = { ecommerce: null, media: null, partTime: null, vendor: null, scamBook: null };
  }
  return game.selfEmploy;
}

function renderSelfEmployPanel() {
  const el = document.getElementById('selfEmployPanel');
  if (!el || !game) return;
  const se = ensureSelfEmploy();
  let h = '<div class="panel-title">🏪 自营</div><p class="fold-meta" style="margin-bottom:8px">电商/自媒体/兼职/个体户 · 流量涨落联动</p>';
  h += '<div style="display:grid;gap:8px">';
  h += selfEmployRow('ecommerce', '🛒 电商', game.ownsComputer ? (se.ecommerce ? se.ecommerce.brand + ' · ' + se.ecommerce.track : '天狗/淘鱼 · 赛道涨跌') : '需先购买电脑', !!game.ownsComputer);
  h += selfEmployRow('media', '📺 自媒体', (game.ownsComputer && typeof hasUsablePhone === 'function' && hasUsablePhone()) ? (se.media ? se.media.brand + '@' + se.media.platform : 'B站/抖音 · 流量指数') : '需电脑和手机', !!(game.ownsComputer && typeof hasUsablePhone === 'function' && hasUsablePhone()));
  h += selfEmployRow('partTime', '🛵 兼职', '外卖 / 网约车（16h · 需自有车）', true);
  h += selfEmployRow('vendor', '🍜 个体户', se.vendor ? se.vendor.cart + '@' + se.vendor.spot : '美食小车 ¥1万', true);
  h += '</div>';
  if (se.scamBook && se.scamBook.contacts) {
    h += '<div style="margin-top:10px;padding:8px;border:1px solid var(--orange);border-radius:8px">';
    h += '<b style="color:var(--orange)">📒 特殊通讯簿</b> · 已拨 ' + (se.scamBook.calls || 0) + ' · 收入 ¥' + (se.scamBook.income || 0).toLocaleString();
    h += ' <button type="button" class="btn" style="font-size:.72rem" onclick="openScamBook()">打开</button></div>';
  }
  if (!game.employed && typeof acceptScamJob === 'function') {
    const scamMail = (game.inbox || []).find(function (it) { return String(it.id || '').indexOf('scam_') === 0; });
    if (scamMail) {
      h += '<p style="margin-top:8px"><button type="button" class="btn btn-warn" onclick="acceptScamJob();renderSelfEmployPanel()">⚠ 接受可疑招聘（诈骗岗 · 特殊通讯簿）</button></p>';
    } else {
      h += '<p class="fold-meta" style="margin-top:8px">待业时可能收到「投必中」可疑招聘（收件箱）</p>';
    }
  }
  el.innerHTML = h;
}

function selfEmployRow(key, title, meta, ok) {
  return '<div style="padding:10px;border:1px solid var(--border);border-radius:8px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">' +
    '<div><b>' + title + '</b><br><span class="fold-meta">' + meta + '</span></div>' +
    '<button type="button" class="btn" ' + (ok ? '' : 'disabled') + ' onclick="openSelfEmploy(\'' + key + '\')">进入</button></div>';
}

function openSelfEmploy(key) {
  if (key === 'partTime') openPartTimeMenu();
  else if (key === 'vendor') openVendorMenu();
  else if (key === 'ecommerce') openEcommerceMenu();
  else if (key === 'media') openMediaMenu();
}

function openEcommerceMenu() {
  const se = ensureSelfEmploy();
  if (se.ecommerce) {
    const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('ecommerce', se.ecommerce.track) : 100;
    const trend = typeof fluxTrendLabel === 'function' ? fluxTrendLabel('ecommerce', se.ecommerce.track) : '';
    const sales = Math.round(se.ecommerce.baseSales * (idx / 100));
    if (typeof showConsumeModalHandlers !== 'function') return;
    showConsumeModalHandlers({
      icon: '🛒', title: se.ecommerce.brand + ' · ' + se.ecommerce.track,
      html: '<p>平台 ' + se.ecommerce.platformName + ' · 竞品指数 <b>' + Math.round(idx) + '</b> ' + trend + '</p>' +
        '<p class="fold-meta">本周预估销量 ' + sales + ' 单 · 运营占 2h</p>',
      buttons: [
        { text: '本周运营 (+销量)', primary: true, handler: function () { closeConsumeModal(true); runEcommerceWeek(); } },
        { text: '关闭', handler: function () { closeConsumeModal(true); } }
      ]
    });
    return;
  }
  const plat = ECOMMERCE_PLATFORMS[Math.floor(Math.random() * ECOMMERCE_PLATFORMS.length)];
  const brand = prompt('电商品牌名', game.playerName + '优选');
  if (!brand) return;
  if (game.cash < plat.fee) { addLog('注册 ' + plat.name + ' 需 ¥' + plat.fee, 'fail'); return; }
  if (plat.fee) { game.cash -= plat.fee; if (typeof ledgerAddExpense === 'function') ledgerAddExpense('self', '🛒', plat.name + '注册', plat.fee, false); }
  const track = ECOMMERCE_TRACKS[Math.floor(Math.random() * ECOMMERCE_TRACKS.length)];
  if (typeof initFluxTrack === 'function') initFluxTrack('ecommerce', track, 100);
  se.ecommerce = { platform: plat.id, platformName: plat.name, brand: brand.trim(), track: track, baseSales: 20 + Math.floor(Math.random() * 30) };
  addLog('🛒 在 ' + plat.name + ' 开店「' + brand + '」· 赛道 ' + track, 'success');
  renderSelfEmployPanel();
}

function runEcommerceWeek() {
  const se = ensureSelfEmploy();
  if (!se.ecommerce) return;
  const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('ecommerce', se.ecommerce.track) : 100;
  const orders = Math.max(0, Math.round(se.ecommerce.baseSales * (idx / 100) * (0.7 + Math.random() * 0.6)));
  const revenue = orders * (30 + Math.floor(Math.random() * 120));
  game.cash += revenue;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('self', '🛒', '电商营收', revenue);
  addLog('🛒 电商周运营 · ' + orders + ' 单 · +¥' + revenue.toLocaleString() + '（指数' + Math.round(idx) + '）', 'success');
  if (typeof updateUI === 'function') updateUI();
}

function openMediaMenu() {
  const se = ensureSelfEmploy();
  if (se.media) {
    const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('media', se.media.track) : 100;
    const trend = typeof fluxTrendLabel === 'function' ? fluxTrendLabel('media', se.media.track) : '';
    const m = se.media;
    let extra = '';
    if (m.platform === 'bilibili') {
      if (m.pendingUploadUntilWeek && game.week < m.pendingUploadUntilWeek) {
        extra = '<p style="color:var(--orange)">⏳ 视频审核中 · 预计 ' + (typeof getDateStr === 'function' ? getDateStr(m.pendingUploadUntilWeek) : ('第' + m.pendingUploadUntilWeek + '周')) + ' 发布</p>';
      } else if (m.pendingUploadUntilWeek && game.week >= m.pendingUploadUntilWeek) {
        extra = '<p style="color:var(--green)">✅ 视频已发布 · 可查看收益</p>';
      }
    }
    if (m.platform === 'douyin') {
      extra += '<p>🔴 直播连签 <b>' + (m.liveStreak || 0) + '</b> 天' +
        (m.lastLiveWeek === game.week ? ' · 本周已签' : ' · <span style="color:var(--orange)">本周未直播</span>') + '</p>';
    }
    if (typeof showConsumeModalHandlers !== 'function') return;
    const buttons = [{ text: '关闭', handler: function () { closeConsumeModal(true); } }];
    if (m.platform === 'bilibili') {
      if (m.pendingUploadUntilWeek && game.week < m.pendingUploadUntilWeek) {
        buttons.unshift({ text: '等待审核', handler: function () { closeConsumeModal(true); } });
      } else if (m.pendingUploadUntilWeek && game.week >= m.pendingUploadUntilWeek && !m._publishedClaimed) {
        buttons.unshift({ text: '收取发布收益', primary: true, handler: function () { closeConsumeModal(true); claimBilibiliUpload(); } });
      } else {
        buttons.unshift({ text: '投稿（等 2～4 周审核）', primary: true, handler: function () { closeConsumeModal(true); startBilibiliUpload(); } });
      }
    } else if (m.platform === 'douyin') {
      if (m.lastLiveWeek !== game.week) {
        buttons.unshift({ text: '今日直播签到', primary: true, handler: function () { closeConsumeModal(true); runDouyinLive(); } });
      }
      buttons.unshift({ text: '发短视频', handler: function () { closeConsumeModal(true); runMediaWeek(); } });
      if (typeof runMediaLifeScandal === 'function') {
        buttons.unshift({ text: '狗血生活记录', handler: function () { closeConsumeModal(true); runMediaLifeScandal(); } });
      }
    } else {
      buttons.unshift({ text: '本周更新', primary: true, handler: function () { closeConsumeModal(true); runMediaWeek(); } });
      if (typeof runMediaLifeScandal === 'function' && (m.track === '剧情' || m.track === '生活')) {
        buttons.unshift({ text: '狗血生活记录', handler: function () { closeConsumeModal(true); runMediaLifeScandal(); } });
      }
    }
    showConsumeModalHandlers({
      icon: '📺', title: m.brand + ' · ' + m.track,
      html: '<p>' + m.platformName + ' · 流量指数 <b>' + Math.round(idx) + '</b> ' + trend + '</p>' +
        extra + '<p class="fold-meta">流量涨落与行业热度联动</p>',
      buttons: buttons
    });
    return;
  }
  const plat = MEDIA_PLATFORMS[Math.floor(Math.random() * MEDIA_PLATFORMS.length)];
  const brand = prompt('自媒体账号名', game.playerName + 'Official');
  if (!brand) return;
  const track = plat.tracks[Math.floor(Math.random() * plat.tracks.length)];
  if (typeof initFluxTrack === 'function') initFluxTrack('media', track, 100);
  se.media = { platform: plat.id, platformName: plat.name, brand: brand.trim(), track: track, fans: 100 + Math.floor(Math.random() * 400), liveStreak: 0, lastLiveWeek: -1 };
  addLog('📺 开通 ' + plat.name + '「' + brand + '」· 赛道 ' + track, 'success');
  renderSelfEmployPanel();
}

function startBilibiliUpload() {
  const se = ensureSelfEmploy();
  if (!se.media || se.media.platform !== 'bilibili') return;
  if (se.media.pendingUploadUntilWeek && game.week < se.media.pendingUploadUntilWeek) {
    addLog('B站视频仍在审核', 'fail'); return;
  }
  const wait = 2 + Math.floor(Math.random() * 3);
  se.media.pendingUploadUntilWeek = game.week + wait;
  se.media._publishedClaimed = false;
  se.media.uploadTitle = ['入门指南', '实测', 'vlog', '干货分享'][Math.floor(Math.random() * 4)];
  addLog('📤 B站投稿「' + se.media.uploadTitle + '」· 预计 ' + wait + ' 周后发布', 'info');
}

function claimBilibiliUpload() {
  const se = ensureSelfEmploy();
  if (!se.media || !se.media.pendingUploadUntilWeek || game.week < se.media.pendingUploadUntilWeek) return;
  if (se.media._publishedClaimed) return;
  se.media._publishedClaimed = true;
  const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('media', se.media.track) : 100;
  const views = Math.round((se.media.fans || 500) * (idx / 100) * (1.2 + Math.random()));
  const revenue = Math.round(views * 0.02 + Math.random() * 500);
  se.media.fans = (se.media.fans || 500) + Math.floor(views / 400);
  game.cash += revenue;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('self', '📺', 'B站发布', revenue);
  addLog('📺 B站「' + (se.media.uploadTitle || '视频') + '」发布 · 播放 ' + views.toLocaleString() + ' · +¥' + revenue, 'success');
  se.media.pendingUploadUntilWeek = null;
  if (typeof updateUI === 'function') updateUI();
}

function runDouyinLive() {
  const se = ensureSelfEmploy();
  if (!se.media || se.media.platform !== 'douyin') return;
  if (se.media.lastLiveWeek === game.week) { addLog('本周已直播签到', 'warn'); return; }
  const broke = se.media.lastLiveWeek != null && se.media.lastLiveWeek < game.week - 1;
  if (broke) {
    addLog('🔴 抖音直播断签 · 连签归零', 'warn');
    se.media.liveStreak = 0;
  }
  se.media.lastLiveWeek = game.week;
  se.media.liveStreak = (se.media.liveStreak || 0) + 1;
  const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('media', se.media.track) : 100;
  const revenue = Math.round(80 + idx * 0.5 + se.media.liveStreak * 25 + Math.random() * 100);
  game.cash += revenue;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('self', '📺', '抖音直播', revenue);
  addLog('🔴 抖音直播签到 · 连签 ' + se.media.liveStreak + ' · +¥' + revenue, 'success');
  if (typeof updateUI === 'function') updateUI();
}

function tickSelfEmployMedia() {
  const se = game && game.selfEmploy;
  if (!se || !se.media) return;
  if (se.media.platform === 'douyin' && se.media.lastLiveWeek != null && se.media.lastLiveWeek < game.week - 1 && se.media.liveStreak > 0) {
    se.media.liveStreak = 0;
  }
}

function runMediaWeek() {
  const se = ensureSelfEmploy();
  if (!se.media) return;
  const idx = typeof fluxTrackIndex === 'function' ? fluxTrackIndex('media', se.media.track) : 100;
  const views = Math.round((se.media.fans || 500) * (idx / 100) * (0.5 + Math.random()));
  const revenue = Math.round(views * 0.015 + Math.random() * 200);
  se.media.fans = (se.media.fans || 500) + Math.floor(views / 500);
  game.cash += revenue;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('self', '📺', '自媒体', revenue);
  addLog('📺 自媒体更新 · 播放 ' + views.toLocaleString() + ' · +¥' + revenue + ' · 粉 ' + se.media.fans, 'success');
  if (typeof updateUI === 'function') updateUI();
}

function openVendorMenu() {
  const se = ensureSelfEmploy();
  if (!se.vendor) {
    if (game.cash < FOOD_CART_COST) { addLog('美食小车需 ¥' + FOOD_CART_COST, 'fail'); return; }
    if (!confirm('购置美食小车 ¥' + FOOD_CART_COST + '？')) return;
    game.cash -= FOOD_CART_COST;
    if (typeof ledgerAddExpense === 'function') ledgerAddExpense('self', '🍜', '美食小车', FOOD_CART_COST, false);
    const cart = prompt('摊位招牌', game.playerName + '小吃');
    if (!cart) return;
    se.vendor = { cart: cart.trim(), spot: 'school', spotName: '学校门口' };
    addLog('🍜 购置美食小车「' + cart + '」', 'success');
  }
  if (typeof showConsumeModalHandlers === 'function') {
    const buttons = [
      { text: '摆摊 16h', primary: true, handler: function () { closeConsumeModal(true); runVendorShift(); } }
    ];
    if (typeof runFoodVendorCombo === 'function') {
      buttons.unshift({ text: '招牌食材搭配', handler: function () { closeConsumeModal(true); runFoodVendorCombo(); } });
    }
    showConsumeModalHandlers({
      icon: '🍜', title: se.vendor.cart + ' · ' + se.vendor.spotName,
      html: '<p class="fold-meta">摆摊或推出招牌搭配提高客单价</p>',
      buttons: buttons
    });
    return;
  }
  runVendorShift();
}

function runVendorShift() {
  const se = ensureSelfEmploy();
  if (!se.vendor) return;
  const spots = VENDOR_SPOTS.map(function (s) { return s.name; }).join(' / ');
  const spot = prompt('摆摊地点（' + spots + '）', se.vendor.spotName || '学校门口');
  if (!spot) return;
  const found = VENDOR_SPOTS.find(function (s) { return spot.indexOf(s.name) >= 0; }) || VENDOR_SPOTS[0];
  se.vendor.spot = found.id;
  se.vendor.spotName = found.name;
  const revenue = 80 + Math.floor(Math.random() * 220) + (found.id === 'club' ? 120 : 0);
  game.cash += revenue;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('self', '🍜', '摆摊', revenue);
  addLog('🍜 ' + se.vendor.cart + '@' + found.name + ' · 16h · +¥' + revenue, 'success');
  if (typeof updateUI === 'function') updateUI();
}

function openPartTimeMenu() {
  if (typeof showConsumeModalHandlers !== 'function') return;
  const hasCar = !!(game.ownedCar || (game.ownedCars && game.ownedCars.length));
  showConsumeModalHandlers({
    icon: '🛵', title: '兼职',
    html: '<p>外卖 · 1 秒找词 · 普通 ¥10 / 挑战 ¥100</p>' +
      '<p class="fold-meta">网约车 · 占 ' + RIDE_HOURS + 'h（连续两时段）· 日收益 ¥100～300' + (hasCar ? '' : ' · 需自有车') + '</p>',
    buttons: [
      { text: '普通外卖', handler: function () { closeConsumeModal(true); runDeliveryMiniGame(false); } },
      { text: '挑战外卖', primary: true, handler: function () { closeConsumeModal(true); runDeliveryMiniGame(true); } },
      { text: '网约车', handler: function () { closeConsumeModal(true); runRideHailing(); } },
      { text: '取消', handler: function () { closeConsumeModal(true); } }
    ]
  });
}

function runRideHailing() {
  if (!game.ownedCar && !(game.ownedCars && game.ownedCars.length)) { addLog('网约车需自有车', 'fail'); return; }
  const pay = 100 + Math.floor(Math.random() * 201);
  game.cash += pay;
  if (typeof ledgerAddIncome === 'function') ledgerAddIncome('parttime', '🚗', '网约车', pay);
  addLog('🚗 网约车 ' + RIDE_HOURS + 'h · +¥' + pay, 'success');
  if (typeof updateUI === 'function') updateUI();
}

function runDeliveryMiniGame(hard) {
  const words = ['麻辣', '黄焖', '兰州', '沙县', '奶茶', '烧烤', '饺子', '汉堡', '寿司', '盖饭', '米线', '煎饼'];
  const target = words[Math.floor(Math.random() * words.length)];
  const pool = [target];
  while (pool.length < 10) {
    const w = words[Math.floor(Math.random() * words.length)];
    if (pool.indexOf(w) < 0) pool.push(w);
  }
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
  const pick = prompt('【' + (hard ? '挑战' : '普通') + '】找词：' + target + '\n\n' + pool.map(function (w, i) { return (i + 1) + '.' + w; }).join('  '), '1');
  const idx = parseInt(pick, 10) - 1;
  const ok = pool[idx] === target;
  if (ok) {
    const pay = hard ? 100 : 10;
    game.cash += pay;
    if (typeof ledgerAddIncome === 'function') ledgerAddIncome('parttime', '🛵', '外卖', pay);
    addLog('🛵 外卖完成 +¥' + pay, 'success');
  } else {
    const loss = hard ? 10 : 0;
    if (loss) { game.cash -= loss; if (typeof ledgerAddExpense === 'function') ledgerAddExpense('parttime', '🛵', '外卖失败', loss, false); }
    addLog('🛵 外卖失败' + (loss ? ' -¥' + loss : ''), hard ? 'fail' : 'warn');
  }
  if (typeof updateUI === 'function') updateUI();
}

function openScamBook() {
  const book = game && game.selfEmploy && game.selfEmploy.scamBook;
  if (!book || !book.contacts) return;
  let html = '<p class="fold-meta">诈骗岗名单 · 拨打后可转化「理想线索」至网络页</p>';
  if (book.opsCredits) html += '<p class="fold-meta">运营点 ' + book.opsCredits + ' · 已转化理想 ' + (book.idealConverted || 0) + '</p>';
  book.contacts.slice(0, 15).forEach(function (t, i) {
    let tag = '';
    if (t.converted) tag = ' ✓已转化';
    else if (t.lead === 'ideal') tag = ' ✨理想线索';
    else if (t.called) tag = ' 已拨';
    html += '<div style="margin:4px 0">';
    html += '<button type="button" class="btn" style="font-size:.72rem;margin:2px" ' + (t.called ? 'disabled' : '') +
      ' onclick="callScamTarget(' + i + ');closeConsumeModal(true);openScamBook()">' + t.name + tag + '</button>';
    if (t.lead === 'ideal' && !t.converted && typeof convertScamLeadToIdeal === 'function') {
      html += ' <button type="button" class="btn" style="font-size:.72rem;margin:2px" onclick="convertScamLeadToIdeal(' + i + ');closeConsumeModal(true);openScamBook()">转入理想</button>';
    }
    html += '</div>';
  });
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '📒', title: '特殊通讯簿', html: html, buttons: [{ text: '关闭', handler: function () { closeConsumeModal(true); } }] });
  }
}
