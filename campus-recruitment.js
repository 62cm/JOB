/* 离校前校园招聘专场 — 由 build.js 注入 */
const CAMPUS_RECRUITMENT_WEEKS = 4;
const CAMPUS_HIRE_MULT = 3;
const CAMPUS_LISTING_TARGET = 18;
const CAMPUS_DAILY_LIST_MAX_H = 320;

function campusDailyRefreshKey(g) {
  g = g || game;
  const d = g.daily || {};
  return (g.week || 0) + '_' + Math.min(d.dayIndex || 0, 6);
}

function campusRefreshedToday() {
  if (!game || !game.campusRecruitment) return false;
  return game.campusRecruitment.refreshDayKey === campusDailyRefreshKey();
}

function refreshCampusListingsDaily(manual) {
  if (!game || !game.campusRecruitment || !isCampusRecruitmentActive()) return false;
  if (campusRefreshedToday()) {
    if (manual && typeof addLog === 'function') addLog('今日已刷新过校招专场，明天再来', 'warn');
    return false;
  }
  refreshCampusListings();
  if (manual && typeof addLog === 'function') addLog('🎓 校招专场已刷新 · 今日 ' + (game.campusRecruitment.listings || []).length + ' 条岗位', 'info');
  if (typeof refreshJobHuntUi === 'function') refreshJobHuntUi();
  else if (typeof renderJobHuntPanel === 'function') renderJobHuntPanel();
  return true;
}

function migrateCampusRecruitment() {
  if (!game) return;
  if (game.campusRecruitment) return;
  if (game.openingPhase !== 'graduation_month' && game.openingPhase !== 'residency_seek') return;
  if ((game.week || 0) >= CAMPUS_RECRUITMENT_WEEKS) return;
  initCampusRecruitment();
}

function isCampusRecruitmentActive() {
  if (!game || !game.campusRecruitment || !game.campusRecruitment.active) return false;
  if (game.openingPhase !== 'graduation_month' && game.openingPhase !== 'residency_seek') return false;
  return game.campusRecruitment.weeksLeft > 0;
}

function campusCompanyTierOk(coTier, playerSchool, openingPhase) {
  if (openingPhase === 'residency_seek') return true;
  if (playerSchool === 'c9') return true;
  if (playerSchool === '985') return coTier !== 'high';
  if (playerSchool === 'normal') return coTier === 'low' || coTier === 'mid';
  return coTier === 'low';
}

function campusJobEduOk(job, playerEdu) {
  if (!job || !playerEdu) return false;
  if (eduGapBetween(job.education, playerEdu) > 0) return false;
  const playerRank = normEduRank(playerEdu);
  const jobRank = normEduRank(job.education);
  if (playerRank - jobRank > 1) return false;
  return true;
}

function campusJobMajorOk(jobTitle, playerMajor, openingPhase) {
  if (openingPhase === 'residency_seek') {
    return /医生|护理|临床|医疗|护士|规培|住院|药师|检验|影像|康复/.test(String(jobTitle || ''));
  }
  if (!playerMajor) return true;
  const mapped = typeof jobTitleToMajor === 'function' ? jobTitleToMajor(jobTitle) : null;
  if (!mapped) return true;
  return typeof jobRelatesToMajor === 'function' && jobRelatesToMajor(jobTitle, playerMajor);
}

function campusJobEligible(job, g) {
  if (!job || !g) return false;
  if (typeof canApplyJob === 'function' && !canApplyJob(job)) return false;
  if (typeof isOverAgeLimit === 'function' && isOverAgeLimit(job)) return false;
  if (!campusJobEduOk(job, g.playerEducation)) return false;
  if (!campusJobMajorOk(job.title, g.playerMajor, g.openingPhase)) return false;
  return true;
}

function generateCampusListings(g) {
  g = g || game;
  if (!g || !g.market || !g.market.length) return [];
  if (typeof ensurePlayerEduHistory === 'function') ensurePlayerEduHistory(g);
  const playerSchool = g.playerSchool || 'normal';
  const openingPhase = g.openingPhase;
  const eligibleIdxs = [];
  g.market.forEach(function (job, idx) {
    if (campusJobEligible(job, g)) eligibleIdxs.push(idx);
  });
  if (!eligibleIdxs.length) return [];
  const dayKey = (g.week || 0) * 7 + Math.min((g.daily && g.daily.dayIndex) || 0, 6);
  const refreshSalt = (g.campusRecruitment && g.campusRecruitment.refreshCount) || 0;
  const rng = seededRand((g.stockSeed || 1) * 911 + dayKey * 13 + refreshSalt * 997 + eligibleIdxs.length);
  shuffleArr(eligibleIdxs, rng);
  const listings = [];
  const usedKey = new Set();
  const target = Math.min(CAMPUS_LISTING_TARGET, Math.max(8, Math.floor(eligibleIdxs.length * 0.35)));
  let attempts = 0;
  while (listings.length < target && attempts < 800) {
    attempts++;
    const ji = eligibleIdxs[(attempts - 1) % eligibleIdxs.length];
    const job = g.market[ji];
    const pool = (g.jobCompanies && g.jobCompanies[ji]) || [];
    const tierOk = pool.filter(function (co) {
      return campusCompanyTierOk(co.tier, playerSchool, openingPhase) && companyHiresForJob(co, ji, job);
    });
    if (!tierOk.length) continue;
    const co = tierOk[Math.floor(rng() * tierOk.length)];
    const key = co.id + '_' + ji;
    if (usedKey.has(key)) continue;
    usedKey.add(key);
    const r = seededR(ji * 1009 + String(co.id).length * 17 + listings.length * 3);
    const openings = genOpeningsForCompany(job, co, r);
    const op = openings.find(function (o) { return o.importance === 'low' && !o.planned; })
      || openings.find(function (o) { return !o.planned; })
      || openings[0];
    if (!op) continue;
    const offer = {
      company: co, tier: co.tier, importance: op.importance, annualPay: op.pay,
      roleExtra: op.roleExtra, welfare: op.welfare, otProfile: op.otProfile,
      startDelayWeeks: Math.min(op.startDelayWeeks || 2, 6), planned: false,
      newToIndustry: !g.industryExperience[job.category],
      eduGap: eduGapBetween(job.education, g.playerEducation),
      method: 'campus', apps: ['campus']
    };
    listings.push({
      uid: 'CAMP_' + ji + '_' + co.id + '_' + listings.length,
      jobIdx: ji, jobTitle: job.title, category: job.category, offer: offer
    });
  }
  return listings;
}

function refreshCampusListings() {
  if (!game || !game.campusRecruitment) return;
  let listings = generateCampusListings(game);
  const idxs = [];
  const seen = new Set();
  listings.forEach(function (it) {
    if (!seen.has(it.jobIdx)) { seen.add(it.jobIdx); idxs.push(it.jobIdx); }
  });
  if (!idxs.length) {
    game.market.forEach(function (job, idx) {
      if (campusJobEligible(job, game)) idxs.push(idx);
    });
  }
  const seed = (game.week || 0) * 997 + (game.campusRecruitment.refreshCount || 0) * 13 + 7;
  if (typeof mergeScamBaitJobListings === 'function' && idxs.length) {
    listings = mergeScamBaitJobListings(listings, idxs, seed);
  }
  game.campusRecruitment.listings = listings;
  game.campusRecruitment.genWeek = game.week || 0;
  game.campusRecruitment.refreshDayKey = campusDailyRefreshKey();
  game.campusRecruitment.refreshCount = (game.campusRecruitment.refreshCount || 0) + 1;
}

function initCampusRecruitment() {
  if (!game) return;
  if (game.openingPhase !== 'graduation_month' && game.openingPhase !== 'residency_seek') return;
  const weeksLeft = Math.max(0, CAMPUS_RECRUITMENT_WEEKS - (game.week || 0));
  if (weeksLeft <= 0) {
    game.campusRecruitment = { active: false, weeksLeft: 0, listings: [], genWeek: game.week || 0 };
    return;
  }
  game.campusRecruitment = {
    active: true,
    weeksLeft: weeksLeft,
    listings: [],
    genWeek: -1,
    refreshDayKey: null,
    refreshCount: 0
  };
  refreshCampusListings();
  if ((game.week || 0) === 0 && typeof addLog === 'function') {
    addLog('🎓 校园招聘季开启 · 岗位匹配你的院校与学历 · 录取率约为社会招聘的3倍 · 还剩' + weeksLeft + '周', 'success');
  }
}

function tickCampusRecruitmentWeekly() {
  if (!game || !game.campusRecruitment || !game.campusRecruitment.active) return;
  if (game.openingPhase !== 'graduation_month' && game.openingPhase !== 'residency_seek') {
    game.campusRecruitment.active = false;
    return;
  }
  game.campusRecruitment.weeksLeft = Math.max(0, (game.campusRecruitment.weeksLeft || 0) - 1);
  if (game.campusRecruitment.weeksLeft <= 0) {
    game.campusRecruitment.active = false;
    if (typeof addLog === 'function') addLog('🎓 校园招聘季结束 · 专场岗位已撤下', 'info');
  }
}

function campusApplicationMatchesListing(a, item) {
  if (!a || !item || a.method !== 'campus') return false;
  if (a.status === 'silent' || a.status === 'rejected') return false;
  if (a.campusListingUid && item.uid && a.campusListingUid === item.uid) return true;
  if (a.jobIdx !== item.jobIdx) return false;
  const aOffer = a.offer;
  const iOffer = item.offer;
  if (!aOffer || !iOffer) return false;
  let aCo = aOffer.company;
  if (!aCo && aOffer.companyId && game.companyById) aCo = game.companyById[aOffer.companyId];
  const iCo = iOffer.company;
  if (!aCo || !iCo) return false;
  if (aCo.id && iCo.id && aCo.id === iCo.id) return true;
  return aCo.name === iCo.name;
}

function campusListingApplied(item) {
  if (!game || !game.applications || !item) return false;
  if (item.offer && item.offer.scamBait && typeof scamBaitListingApplied === 'function') {
    return scamBaitListingApplied(item);
  }
  return game.applications.some(function (a) { return campusApplicationMatchesListing(a, item); });
}

function applyCampusListing(uid) {
  if (!game || game.gameOver) return;
  if (!isCampusRecruitmentActive()) {
    if (typeof addLog === 'function') addLog('校园招聘季已结束', 'warn');
    return;
  }
  const cr = game.campusRecruitment;
  const item = (cr.listings || []).find(function (x) { return x.uid === uid; });
  if (!item) return;
  if (campusListingApplied(item)) {
    if (typeof addLog === 'function') addLog('该校园招聘岗位已投递', 'warn');
    return;
  }
  if (game.casinoActive || game.marketActive) {
    if (typeof addLog === 'function') addLog('当前无法投递', 'warn');
    return;
  }
  if (game.employed && typeof markStealthJobSearch === 'function') markStealthJobSearch();
  const isBait = !!(item.offer && item.offer.scamBait);
  const id = 'camp_' + game.week + '_' + Math.floor(Math.random() * 9999);
  const replyWeek = game.week;
  const app = {
    id: id, jobIdx: item.jobIdx, campusListingUid: item.uid,
    offer: Object.assign({}, item.offer, { method: 'campus', apps: ['campus'] }),
    status: 'pending', applyWeek: game.week, replyWeek: replyWeek,
    planned: false, interviewWeek: null, resultWeek: null,
    viaReferral: false, method: 'campus', resumeCostLabel: '校园招聘',
    scamBait: isBait, scamBaitId: isBait ? (item.offer.scamBaitId || item.uid) : null
  };
  game.applications.push(app);
  game.totalApplications++;
  game.appliedCategories[item.category] = true;
  if (typeof addLog === 'function') {
    const tag = isBait ? ' · ✨优选（上岗后另有任务）' : '';
    addLog('📤 【校园招聘】投递 ' + item.offer.company.name + ' · ' + item.jobTitle + '（免费 · 约3倍录取率' + tag + '）', 'info');
  }
  if (isBait && typeof processScamBaitApplicationReply === 'function') {
    processScamBaitApplicationReply(app, game.week);
  } else if (typeof processApplicationPipeline === 'function') {
    processApplicationPipeline();
  }
  if (typeof refreshInboxViews === 'function') refreshInboxViews();
  if (typeof updateLongDistanceStatus === 'function') updateLongDistanceStatus();
  if (typeof renderCampusRecruitmentPanel === 'function') renderCampusRecruitmentPanel();
  if (typeof renderInterviewCalendar === 'function') renderInterviewCalendar();
  if (typeof refreshJobHuntUi === 'function') refreshJobHuntUi();
  else if (typeof renderJobHuntPanel === 'function') renderJobHuntPanel();
  if (typeof autoSaveSlot === 'function') autoSaveSlot();
}

function renderCampusListingRowHtml(item, compact) {
  const o = item.offer;
  const applied = campusListingApplied(item);
  const bait = !!(o && o.scamBait);
  const baitTag = bait && typeof scamBaitListingTagHtml === 'function' ? scamBaitListingTagHtml(o) : '';
  const imp = o.roleExtra
    ? (typeof IMP_LABEL !== 'undefined' ? IMP_LABEL[o.importance] : o.importance) + '·' + (typeof ROLE_EXTRA !== 'undefined' ? ROLE_EXTRA[o.roleExtra] : o.roleExtra)
    : (typeof IMP_LABEL !== 'undefined' ? IMP_LABEL[o.importance] : o.importance);
  const pay = typeof formatOfferPay === 'function' ? formatOfferPay(o) : ('年薪¥' + (o.annualPay || 0).toLocaleString());
  const job = game.market[item.jobIdx];
  const eduTxt = job ? job.education : '';
  const fitHint = typeof playerCareerRankFitHtml === 'function' ? playerCareerRankFitHtml(item.jobTitle, o.importance, o.roleExtra) : '';
  const badge = typeof fmtCompanyBadge === 'function' ? fmtCompanyBadge(o.company) : '';
  const fs = compact ? '.75rem' : '.78rem';
  const btnFs = compact ? '.68rem' : '.72rem';
  const btnPad = compact ? '3px 8px' : '4px 10px';
  return '<div class="campus-listing-row" style="display:flex;gap:8px;align-items:flex-start;margin:6px 0;padding:' + (compact ? '8px' : '8px') + ';background:var(--bg);border:1px solid var(--border);border-radius:6px;font-size:' + fs + ';line-height:1.45">' +
    '<div style="flex:1;min-width:0">' +
    '<div><b>' + o.company.name + '</b> ' + badge + ' · <b>' + imp + '</b>' + baitTag + fitHint + '</div>' +
    '<div>招：<b>' + item.jobTitle + '</b>' + (eduTxt ? ' · ' + eduTxt : '') + '</div>' +
    '<div>' + pay + ' · 上岗约' + (o.startDelayWeeks || 2) + '周内 · <span style="color:var(--green)">校招≈3倍录取</span></div>' +
    (o.welfare ? '<div style="color:var(--muted);margin-top:3px">待遇：' + o.welfare + '</div>' : '') +
    '</div>' +
    '<button type="button" class="btn' + (applied ? '' : ' btn-primary') + '" style="flex:0 0 auto;font-size:' + btnFs + ';padding:' + btnPad + '"' +
    (applied ? ' disabled' : '') + ' onclick="applyCampusListing(\'' + item.uid + '\')">' + (applied ? '已投递' : '投递') + '</button></div>';
}

function renderCampusRecruitmentDailyBlock() {
  if (!isCampusRecruitmentActive()) return '';
  const cr = game.campusRecruitment;
  const items = cr.listings || [];
  const refreshed = campusRefreshedToday();
  let h = '<div class="campus-daily-block" style="margin:8px 0;padding:10px;border:1px solid var(--green);border-radius:8px;background:rgba(63,185,80,.06)">';
  h += '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between">';
  h += '<b style="color:var(--green)">🎓 校园招聘 · 还剩 ' + cr.weeksLeft + ' 周</b>';
  h += '<button type="button" class="btn' + (refreshed ? '' : ' btn-primary') + '" style="font-size:.68rem;padding:3px 10px"' +
    (refreshed ? ' disabled title="明日可再刷"' : '') + ' onclick="refreshCampusListingsDaily(true)">🔄 刷新今日专场</button>';
  h += '</div>';
  h += '<p class="fold-meta" style="margin:4px 0 6px">匹配院校与学历 · 录取率≈社会3倍 · 免费投递 · <b>每天可刷一次</b> · <span style="color:var(--yellow)">✨优选</span>=高薪易过（上岗后传销推销，校招与APP均可能出现）</p>';
  if (!refreshed) {
    h += '<p class="fold-meta" style="margin:8px 0;color:var(--muted)">今日尚未刷新 · 点击「刷新今日专场」查看岗位与待遇</p></div>';
    return h;
  }
  if (!items.length) {
    h += '<p class="fold-meta">暂无匹配岗位 · 明日再刷或换周看看</p></div>';
    return h;
  }
  h += '<p class="fold-meta" style="margin:0 0 6px">今日专场 · 共 ' + items.length + ' 条（可滚动查看）</p>';
  h += '<div class="campus-daily-list" style="max-height:' + CAMPUS_DAILY_LIST_MAX_H + 'px;overflow-y:auto;padding-right:4px">';
  items.forEach(function (item) { h += renderCampusListingRowHtml(item, true); });
  h += '</div></div>';
  return h;
}

function renderCampusRecruitmentPanel() {
  const panel = document.getElementById('campusRecruitmentPanel');
  const meta = document.getElementById('campusRecruitMeta');
  const list = document.getElementById('campusRecruitList');
  if (!panel || !list) return;
  if (!isCampusRecruitmentActive()) {
    panel.style.display = 'none';
    return;
  }
  panel.style.display = '';
  const cr = game.campusRecruitment;
  const schoolTxt = typeof schoolLabelFor === 'function' ? schoolLabelFor(game.playerSchool) : (game.playerSchool || '');
  const majorTxt = game.playerMajor ? ' · ' + game.playerMajor : '';
  if (meta) {
    meta.textContent = '还剩 ' + cr.weeksLeft + ' 周 · ' + (game.playerEducation || '') + '（' + schoolTxt + '）' + majorTxt;
  }
  const items = cr.listings || [];
  if (!campusRefreshedToday()) {
    list.innerHTML = '<p style="font-size:.78rem;color:var(--muted)">今日尚未刷新校招专场 · 请在应聘页点击「刷新今日专场」</p>';
    return;
  }
  if (!items.length) {
    list.innerHTML = '<p style="font-size:.78rem;color:var(--muted)">暂无匹配你院校与专业的校招岗位，明日再刷或使用下方社会招聘渠道。</p>';
    return;
  }
  list.innerHTML = items.map(function (item) { return renderCampusListingRowHtml(item, false); }).join('');
}
