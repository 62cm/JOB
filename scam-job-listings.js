/* 高薪诱饵岗 · 混入招聘APP · 投递高录取 · 上岗后传销/诈骗卖货 — 由 build.js 注入 */
const SCAM_BAIT_COMPANIES = [
  { id: 'scam_co_xc', name: '星辰优选控股', tier: 'mid', scale: 'medium', city: null, product: '康养优选套餐', unitPrice: 3998 },
  { id: 'scam_co_yx', name: '悦享金服', tier: 'mid', scale: 'small', city: null, product: '财富成长计划', unitPrice: 5888 },
  { id: 'scam_co_ky', name: '康源生命科技', tier: 'high', scale: 'medium', city: null, product: '细胞调理疗程', unitPrice: 12800 },
  { id: 'scam_co_zf', name: '智造未来集团', tier: 'mid', scale: 'large', city: null, product: '智能生活套装', unitPrice: 4599 }
];
const SCAM_BAIT_WELFARE = [
  '六险二金·带薪旅游·住房补贴·弹性工时·团队分红',
  '14薪·节日礼金·免费培训·晋升快·主管一对一带教',
  '高底薪+高提成·包住宿·季度出国游·股权激励（口头）'
];
const SCAM_BAIT_TAGS = ['✨优选·高福利', '急招·待遇从优', '⭐星级岗位·极速响应'];

function scamBaitChannelActive() {
  if (!game || game.gameOver) return false;
  return true;
}

function scamBaitDrawSeed(seedExtra) {
  return (game.week || 0) * 7919 + (seedExtra || 0) * 13 + 42;
}

function pickScamBaitCompany(rng) {
  const co = SCAM_BAIT_COMPANIES[Math.floor(rng() * SCAM_BAIT_COMPANIES.length)];
  return Object.assign({}, co, {
    city: co.city || game.playerCity || (typeof PLAYER_HOME_CITY !== 'undefined' ? PLAYER_HOME_CITY : '上海'),
    primaryCategory: '综合'
  });
}

function bumpImportance(imp) {
  if (imp === 'low') return 'mid';
  if (imp === 'mid') return 'high';
  return 'high';
}

function generateScamBaitListings(jobIdxs, seedExtra, count) {
  if (!scamBaitChannelActive() || !jobIdxs || !jobIdxs.length || !count) return [];
  const rng = seededRand(scamBaitDrawSeed(seedExtra));
  const listings = [];
  const used = new Set();
  let attempts = 0;
  while (listings.length < count && attempts < 24) {
    attempts++;
    const ji = jobIdxs[Math.floor(rng() * jobIdxs.length)];
    const job = game.market[ji];
    if (!job) continue;
    const co = pickScamBaitCompany(rng);
    const key = co.id + '_' + ji;
    if (used.has(key)) continue;
    used.add(key);
    const basePay = job.pay || 120000;
    const payMult = 1.38 + rng() * 0.32;
    const annualPay = Math.round(basePay * payMult / 1000) * 1000;
    const importance = bumpImportance('low');
    const baitId = 'SB_' + co.id + '_' + ji + '_' + listings.length;
    const welfare = SCAM_BAIT_WELFARE[Math.floor(rng() * SCAM_BAIT_WELFARE.length)];
    const offer = {
      company: co, tier: co.tier, importance: importance, annualPay: annualPay,
      roleExtra: null, welfare: welfare,
      otProfile: typeof legacyOvertimeProfile === 'function' ? legacyOvertimeProfile(co.tier, importance, null, co, job) : null,
      startDelayWeeks: 1 + Math.floor(rng() * 2), planned: false,
      newToIndustry: !game.industryExperience[job.category],
      eduGap: typeof eduGapBetween === 'function' ? eduGapBetween(job.education, game.playerEducation) : 0,
      scamBait: true, scamBaitId: baitId, scamProduct: co.product, scamUnitPrice: co.unitPrice,
      method: 'app', apps: []
    };
    listings.push({
      uid: baitId, jobIdx: ji, jobTitle: job.title, category: job.category, offer: offer,
      scamBait: true
    });
  }
  return listings;
}

function mergeScamBaitJobListings(listings, jobIdxs, seedExtra) {
  if (!scamBaitChannelActive()) return listings || [];
  const lr = seededRand(scamBaitDrawSeed(seedExtra) + 17);
  const n = lr() > 0.15 ? 2 : 1;
  const bait = generateScamBaitListings(jobIdxs, seedExtra, n);
  if (!bait.length) return listings || [];
  return bait.concat(listings || []);
}

function isScamBaitListing(item) {
  return !!(item && (item.scamBait || (item.offer && item.offer.scamBait)));
}

function scamBaitListingApplied(item) {
  if (!game || !game.applications || !item) return false;
  const bid = item.offer && item.offer.scamBaitId;
  return game.applications.some(function (a) {
    if (a.status === 'silent' || a.status === 'rejected') return false;
    if (!a.scamBait && !(a.offer && a.offer.scamBait)) return false;
    if (bid && a.scamBaitId === bid) return true;
    if (a.scamBaitId && item.uid && a.scamBaitId === item.uid) return true;
    return a.jobIdx === item.jobIdx && a.offer && item.offer && a.offer.company && item.offer.company
      && a.offer.company.id === item.offer.company.id;
  });
}

function initScamEmploymentFromOffer(offer, jobIdx) {
  if (!game) return;
  if (!game.selfEmploy) game.selfEmploy = {};
  const co = offer.company || { name: '鸿运信息', tier: 'low', scale: 'small' };
  const product = offer.scamProduct || '康养优选套餐';
  const unitPrice = offer.scamUnitPrice || 3998;
  game.selfEmploy.scamBook = game.selfEmploy.scamBook || { contacts: [], calls: 0, income: 0 };
  const book = game.selfEmploy.scamBook;
  if (!book.contacts.length) {
    for (let i = 0; i < 12; i++) {
      const gender = Math.random() < 0.5 ? 'male' : 'female';
      book.contacts.push({
        id: 'scam_t_' + i,
        name: typeof pickStrangerDisplayName === 'function' ? pickStrangerDisplayName(gender) : '目标' + i,
        phone: '1' + Math.floor(1000000000 + Math.random() * 9000000000), called: false,
        familiarity: 12 + Math.floor(Math.random() * 38)
      });
    }
  }
  book.sales = {
    product: product, unitPrice: unitPrice,
    quota: 12, sold: book.sales && book.sales.sold || 0,
    weekTarget: 2, weekSold: 0, mlmRecruits: book.sales && book.sales.mlmRecruits || 0
  };
  book.companyId = co.id || book.companyId || 'scam_co_mail';
  book.companyName = co.name || book.companyName || '鸿运信息';
  if (book.scamWeeks == null) book.scamWeeks = 0;
  if (book.opsCredits == null) book.opsCredits = 0;
  const keepPrimary = game.employed && game.employment && game.employment.roleExtra !== 'scam';
  if (!keepPrimary) {
    game.employed = true;
    game.employment = {
      jobIdx: jobIdx != null ? jobIdx : 0,
      company: co, tier: offer.tier || co.tier || 'mid',
      importance: offer.importance || 'mid', annualPay: offer.annualPay || 120000,
      roleExtra: 'scam', weeksInCompany: 0,
      scamProduct: product
    };
  }
  game.inbox = (game.inbox || []).filter(function (it) {
    return !(it.scamBait || (it.type === 'offer' && String(it.id || '').indexOf('scam_') === 0));
  });
}

function dismissScamBaitOffer(appId, inboxId) {
  if (!game) return;
  if (appId) {
    const app = (game.applications || []).find(function (a) { return a.id === appId; });
    if (app && app.status === 'scam_offered') app.status = 'declined';
  }
  if (inboxId) game.inbox = (game.inbox || []).filter(function (it) { return it.id !== inboxId; });
  if (typeof refreshInboxViews === 'function') refreshInboxViews();
  if (typeof refreshJobHuntUi === 'function') refreshJobHuntUi();
  addLog('已放弃优选录用', 'info');
}

function acceptScamBaitOffer(appId) {
  if (!game) return;
  const app = (game.applications || []).find(function (a) { return a.id === appId; });
  if (!app || !app.scamBait) { addLog('无效录用', 'fail'); return; }
  const sideOnly = game.employed && game.employment && game.employment.roleExtra !== 'scam';
  initScamEmploymentFromOffer(app.offer, app.jobIdx);
  app.status = 'hired_scam';
  const coName = app.offer.company && app.offer.company.name;
  addLog(sideOnly
    ? '📒 入坑「' + coName + '」· 明面工作保留 · 上班可开通讯簿推销'
    : '📒 入职「' + coName + '」· 实为传销诈骗岗 · 需完成套餐销售指标', 'warn');
  if (typeof refreshInboxViews === 'function') refreshInboxViews();
  if (typeof renderDailyPanel === 'function') renderDailyPanel();
  if (typeof refreshJobHuntUi === 'function') refreshJobHuntUi();
  if (typeof updateUI === 'function') updateUI();
}

function processScamBaitApplicationReply(app, w) {
  if (!app || !app.scamBait || app.status !== 'pending' || w < app.replyWeek) return false;
  const offer = app.offer;
  if (!offer || !offer.company) return false;
  const job = game.market[app.jobIdx];
  const coName = offer.company.name || '优选企业';
  if (Math.random() < 0.05) {
    app.status = 'ghost';
    game.inbox.push({
      id: app.id + '_ghost', type: 'ghost', week: w, jobIdx: app.jobIdx,
      company: coName,
      msg: coName + '：感谢您的关注，本轮暂无合适安排。',
      offer: offer
    });
    game.resumeFailCount++;
    if (typeof refreshInboxViews === 'function') refreshInboxViews();
    return true;
  }
  app.status = 'scam_offered';
  game.inbox.unshift({
    id: app.id + '_sb_offer', type: 'offer', week: w, scamBait: true, appId: app.id,
    read: false, jobIdx: app.jobIdx,
    title: coName + ' · ' + (job ? job.title : '精英岗'),
    body: '恭喜！经快速评审您已入围录用名单。薪资' + (typeof formatOfferPay === 'function' ? formatOfferPay(offer) : '') + '，福利从优，请确认入职。',
    offer: offer
  });
  addLog('🎉 ' + coName + ' 极速回复：拟录用（应聘邮箱 → 可疑招聘）', 'success');
  if (typeof refreshInboxViews === 'function') refreshInboxViews();
  return true;
}

function tickScamSalesWeekly() {
  const book = game && game.selfEmploy && game.selfEmploy.scamBook;
  if (!book || !book.sales) return;
  book.scamWeeks = (book.scamWeeks || 0) + 1;
  if (typeof isScamEmployment === 'function' && !isScamEmployment()) return;
  const s = book.sales;
  if (s.weekSold < s.weekTarget) {
    addLog('⚠ 本周套餐销售未达标（' + s.weekSold + '/' + s.weekTarget + '）· 主管施压', 'warn');
    if (typeof addStress === 'function') addStress(5, '传销施压 ');
  } else {
    addLog('✓ 本周销售指标达标 · ' + s.weekSold + ' 单', 'info');
  }
  s.weekSold = 0;
}

function doScamProductSales() {
  if (typeof workShiftConsumeHours === 'function' && !workShiftConsumeHours(2, '推销套餐')) return;
  const book = typeof ensureScamBookState === 'function' ? ensureScamBookState() : null;
  if (!book || !book.sales) {
    if (typeof showWorkShiftActionResult === 'function') {
      showWorkShiftActionResult('🛒', '推销套餐', '<p class="fold-meta">暂无销售任务</p>');
    } else addLog('暂无销售任务', 'fail');
    return;
  }
  const s = book.sales;
  let sold = 0, income = 0, failed = 0, mlm = 0;
  const attempts = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < attempts; i++) {
    if (Math.random() < 0.28) {
      sold++;
      const comm = Math.round(s.unitPrice * (0.08 + Math.random() * 0.12));
      income += comm;
      s.sold++;
      s.weekSold++;
      if (Math.random() < 0.12) {
        s.mlmRecruits = (s.mlmRecruits || 0) + 1;
        mlm++;
      }
    } else failed++;
  }
  if (income) {
    game.cash += income;
    book.income = (book.income || 0) + income;
    if (typeof ledgerAddIncome === 'function') ledgerAddIncome('scam', '🛒', '套餐推销提成', income);
  }
  const left = Math.max(0, s.quota - s.sold);
  addLog('🛒 推销「' + s.product + '」· 成交 ' + sold + ' 单 +¥' + income + ' · 总进度 ' + s.sold + '/' + s.quota + (left ? ' · 还差 ' + left + ' 单' : ' · 阶段指标完成'), sold ? 'success' : 'warn');
  if (typeof addStress === 'function') addStress(3 + failed, '推销话术 ');
  let html = '<p>「<b>' + s.product + '</b>」2h 话术 · 开口 <b>' + attempts + '</b> 次 · 成交 <b>' + sold + '</b> 单</p>';
  html += '<p>提成 <b style="color:var(--green)">+¥' + income.toLocaleString() + '</b> · 压力 +' + (3 + failed) + '</p>';
  html += '<p class="fold-meta">总进度 ' + s.sold + '/' + s.quota + ' · 本周 ' + s.weekSold + '/' + s.weekTarget + (left ? ' · 还差 ' + left + ' 单' : ' · 阶段指标完成') + '</p>';
  if (!sold) html += '<p class="fold-meta">今天几次都被拒了</p>';
  if (mlm) html += '<p style="color:var(--orange);font-size:.85rem">👥 发展下线 +' + mlm + '</p>';
  if (typeof updateUI === 'function') updateUI();
  if (typeof showWorkShiftActionResult === 'function') showWorkShiftActionResult('🛒', '推销套餐', html);
}

function isPlayerScamEmployed() {
  return !!(game && game.employed && game.employment && game.employment.roleExtra === 'scam');
}

function getScamEmployerDisplay() {
  if (!isPlayerScamEmployed()) return null;
  const emp = game.employment;
  const co = emp && emp.company;
  const job = game.market && emp && game.market[emp.jobIdx];
  const book = game.selfEmploy && game.selfEmploy.scamBook;
  const sales = book && book.sales;
  return {
    company: co && co.name ? co.name : '未知单位',
    title: job && job.title ? job.title : '电销专员',
    product: emp.scamProduct || (sales && sales.product) || '套餐',
    sold: sales ? sales.sold : 0,
    quota: sales ? sales.quota : 0
  };
}

function calcScamExitExtortion(opts) {
  opts = opts || {};
  const book = opts.book || (game && game.selfEmploy && game.selfEmploy.scamBook);
  let weeks = opts.weeksInCompany;
  if (weeks == null) {
    const emp = game && game.employment;
    weeks = (emp && emp.roleExtra === 'scam' ? emp.weeksInCompany : (book && book.scamWeeks)) || 0;
  }
  let amt = 5000 + Math.floor(Math.random() * 3000);
  amt += weeks * 1200;
  if (book && book.sales) {
    amt += Math.max(0, book.sales.quota - book.sales.sold) * 600;
    amt += (book.sales.mlmRecruits || 0) * 2500;
  }
  return amt;
}

function finishScamJobResign(fee, paid, coName, title) {
  const emp = game.employment;
  if (emp && typeof recordCareerHistory === 'function') recordCareerHistory(emp);
  if (game.selfEmploy) game.selfEmploy.scamBook = null;
  game.employed = false;
  game.employment = null;
  game.switches = (game.switches || 0) + 1;
  game.stealthJobSearch = false;
  game.stealthSearchWeeks = 0;
  if (typeof clearOpeningLayoffEvent === 'function') clearOpeningLayoffEvent();
  if (typeof addStress === 'function') addStress(paid < fee ? 5 : 3, '辞职 ');
  addLog('📝 离开传销诈骗岗「' + coName + '」· 被敲诈 ¥' + paid.toLocaleString() + (paid < fee ? '（未付清）' : ''), 'warn');
  if (typeof updateLongDistanceStatus === 'function') updateLongDistanceStatus();
  if (typeof renderDailyPanel === 'function') renderDailyPanel();
  if (typeof updateUI === 'function') updateUI();
  if (typeof autoSaveSlot === 'function') autoSaveSlot();
}

function finishScamSideJobResign(fee, paid, coName, title) {
  if (game.selfEmploy) game.selfEmploy.scamBook = null;
  (game.applications || []).forEach(function (a) {
    if (a.status === 'hired_scam') a.status = 'left_scam';
  });
  if (typeof addStress === 'function') addStress(paid < fee ? 5 : 3, '脱身 ');
  addLog('📝 甩掉暗线传销「' + coName + '」· 被敲诈 ¥' + paid.toLocaleString() + (paid < fee ? '（未付清）' : '') + ' · 明面工作保留', 'warn');
  if (typeof renderDailyPanel === 'function') renderDailyPanel();
  if (typeof refreshSelfEmployUi === 'function') refreshSelfEmployUi();
  if (typeof updateUI === 'function') updateUI();
  if (typeof autoSaveSlot === 'function') autoSaveSlot();
}

function getScamResignContext(sideOnly) {
  if (!sideOnly && isPlayerScamEmployed()) {
    return { mode: 'primary', info: getScamEmployerDisplay() };
  }
  const side = typeof getScamSideEmploymentDisplay === 'function' ? getScamSideEmploymentDisplay() : null;
  if (side && game.selfEmploy && game.selfEmploy.scamBook) {
    return { mode: 'side', info: side };
  }
  return null;
}

function showScamExtortionResultModal(html) {
  const done = function () {
    if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  };
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({ icon: '⚠', title: '离职 · 被敲诈', html: html, buttons: [{ text: '知道了', primary: true, handler: done }] });
  } else if (typeof showConsumeModal === 'function') {
    showConsumeModal({ icon: '⚠', title: '离职 · 被敲诈', html: html, buttons: [{ text: '知道了', primary: true, fn: 'closeConsumeModal(true)' }] });
  }
}

function runScamExitExtortion(ctx) {
  if (!ctx || !ctx.info) {
    addLog('当前无传销诈骗岗', 'fail');
    return;
  }
  const coName = ctx.info.company || '该单位';
  const title = ctx.info.title || '电销岗';
  const side = ctx.mode === 'side';
  const book = game.selfEmploy && game.selfEmploy.scamBook;
  const weeks = side ? ((book && book.scamWeeks) || 0) : ((game.employment && game.employment.weeksInCompany) || 0);
  const fee = calcScamExitExtortion({ book: book, weeksInCompany: weeks });
  const prompt = side
    ? '确定从暗线「' + coName + '」脱身？\n\n明面工作保留 · 人事会敲诈约 ¥' + fee.toLocaleString() + ' 才放人（培训费/违约金名义）。'
    : '确定从「' + coName + '」辞职？\n\n实为传销诈骗岗 · 人事会敲诈约 ¥' + fee.toLocaleString() + ' 才放人（和普通辞职一样能走，但要破财）。';
  if (!confirm(prompt)) return;
  let paid = 0;
  let html = '<p><b>所属单位：</b>' + coName + ' · ' + title + '</p>';
  html += '<p class="fold-meta">' + (side ? '暗线传销 · ' : '') + '主管以培训费/违约金名义拦人</p>';
  if (game.cash >= fee) {
    game.cash -= fee;
    paid = fee;
    if (typeof ledgerAddExpense === 'function') ledgerAddExpense('scam', '⚠', '传销岗离职敲诈', fee, false);
    html += '<p>你付了 <b style="color:var(--orange)">¥' + fee.toLocaleString() + '</b>，对方收钱放行。</p>';
  } else if (game.cash > 0) {
    paid = game.cash;
    game.cash = 0;
    if (typeof ledgerAddExpense === 'function') ledgerAddExpense('scam', '⚠', '传销岗离职敲诈', paid, false);
    html += '<p>你只凑出 <b>¥' + paid.toLocaleString() + '</b>，仍被恐吓欠 ¥' + (fee - paid).toLocaleString() + '，勉强脱身。</p>';
    if (typeof addStress === 'function') addStress(8, '被敲诈 ');
  } else {
    html += '<p>你身无分文，被威胁掌握把柄 · 没收到钱也被轰出门。</p>';
    if (typeof addStress === 'function') addStress(12, '被敲诈 ');
  }
  if (side) finishScamSideJobResign(fee, paid, coName, title);
  else finishScamJobResign(fee, paid, coName, title);
  showScamExtortionResultModal(html);
}

function confirmScamJobResign() {
  const ctx = getScamResignContext(false);
  if (!ctx) {
    addLog('当前无传销诈骗岗', 'fail');
    return;
  }
  runScamExitExtortion(ctx);
}

function confirmScamSideJobResign() {
  const ctx = getScamResignContext(true);
  if (!ctx) {
    addLog('当前无暗线传销岗', 'fail');
    return;
  }
  runScamExitExtortion(ctx);
}

function patchConfirmPlayerResignForScam() {
  if (typeof confirmPlayerResign === 'undefined' || confirmPlayerResign._scamResignPatch) return;
  const orig = confirmPlayerResign;
  confirmPlayerResign = function () {
    if (!game || !game.employed || game.gameOver) return;
    if (typeof playerEmployerAcquired === 'function' && playerEmployerAcquired()) {
      addLog('已收购就职企业，无法辞职', 'warn'); return;
    }
    if (isPlayerScamEmployed()) {
      confirmScamJobResign();
      return;
    }
    return orig();
  };
  confirmPlayerResign._scamResignPatch = true;
}

function scamBaitListingTagHtml(offer) {
  if (!offer || !offer.scamBait) return '';
  const tag = SCAM_BAIT_TAGS[Math.abs(String(offer.scamBaitId || '').length) % SCAM_BAIT_TAGS.length];
  return ' <span style="color:var(--yellow);font-size:.68rem">' + tag + '</span>';
}

function patchProcessApplicationPipelineForScamBait() {
  if (typeof processApplicationPipeline !== 'function' || processApplicationPipeline._scamBaitPatch) return;
  const orig = processApplicationPipeline;
  processApplicationPipeline = function () {
    if (game && game.applications) {
      const w = game.week;
      game.applications.forEach(function (app) {
        if (app.scamBait && app.status === 'pending' && w >= app.replyWeek) {
          processScamBaitApplicationReply(app, w);
        }
      });
    }
    return orig.apply(this, arguments);
  };
  processApplicationPipeline._scamBaitPatch = true;
}

function patchWeeklyTickForScamSales() {
  if (typeof advanceOneWeek !== 'function' || advanceOneWeek._scamSalesPatch) return;
  const orig = advanceOneWeek;
  advanceOneWeek = function () {
    tickScamSalesWeekly();
    return orig.apply(this, arguments);
  };
  advanceOneWeek._scamSalesPatch = true;
}

function ensureScamResignPatch() {
  patchConfirmPlayerResignForScam();
  if (typeof confirmPlayerResign === 'undefined' || !confirmPlayerResign._scamResignPatch) {
    setTimeout(ensureScamResignPatch, 0);
  }
}

function migrateScamOfferCompanies() {
  if (!game) return;
  function fixOffer(offer) {
    if (!offer || offer.company || !offer.companyId) return;
    const sid = String(offer.companyId);
    if (sid.indexOf('scam_') !== 0 && !offer.scamBait) return;
    const co = SCAM_BAIT_COMPANIES.find(function (c) { return c.id === offer.companyId; });
    if (co) {
      offer.company = Object.assign({}, co, {
        city: co.city || game.playerCity || (typeof PLAYER_HOME_CITY !== 'undefined' ? PLAYER_HOME_CITY : '上海'),
        primaryCategory: '综合'
      });
    } else {
      offer.company = {
        id: offer.companyId, name: '鸿运信息', tier: 'low', scale: 'small',
        city: game.playerCity || (typeof PLAYER_HOME_CITY !== 'undefined' ? PLAYER_HOME_CITY : '上海')
      };
    }
  }
  (game.applications || []).forEach(function (a) { if (a.offer) fixOffer(a.offer); });
  (game.inbox || []).forEach(function (it) { if (it.offer) fixOffer(it.offer); });
  (game.offers || []).forEach(function (o) { if (o.offer) fixOffer(o.offer); });
}

function initScamJobListings() {
  migrateScamOfferCompanies();
  ensureScamPipelinePatch();
  patchWeeklyTickForScamSales();
  ensureScamResignPatch();
}

function ensureScamPipelinePatch() {
  patchProcessApplicationPipelineForScamBait();
  if (typeof processApplicationPipeline === 'undefined' || !processApplicationPipeline._scamBaitPatch) {
    setTimeout(ensureScamPipelinePatch, 0);
  }
}

initScamJobListings();
