/* 上班 KPI · 工作(1h) · 工厂计件 · 加班补KPI · 月度扣薪 — 由 build.js 注入 */
const FACTORY_JOB_CATS = ['制造业', '农林牧渔', '建筑工程'];
const KPI_OVERTIME_MAX_H = 4;

function isPlayerScamJobForKpi() {
  if (typeof isScamEmployment === 'function' && isScamEmployment()) return true;
  return !!(game && game.employed && game.employment && game.employment.roleExtra === 'scam');
}

function isFactoryJob(job) {
  if (!job) return false;
  if (FACTORY_JOB_CATS.indexOf(job.category) >= 0) return true;
  return typeof isManualJob === 'function' && isManualJob(job);
}

function workKpiMonthKey() {
  if (typeof getMonthlyAbsenceMonthKey === 'function') return getMonthlyAbsenceMonthKey();
  return Math.max(1, Math.ceil((game.week || 0) / (typeof WEEKS_PER_MONTH !== 'undefined' ? WEEKS_PER_MONTH : 4)));
}

function ensureWorkKpiMonth() {
  if (!game) return null;
  if (!game.workKpi) game.workKpi = {};
  const mk = workKpiMonthKey();
  if (game.workKpi.monthKey !== mk) {
    game.workKpi.monthKey = mk;
    game.workKpi.monthDaysWorked = 0;
    game.workKpi.monthDaysKpiMet = 0;
    game.workKpi.monthDaysMissed = 0;
    game.workKpi.monthOvertimeHours = 0;
  }
  return game.workKpi;
}

function workKpiDailyTarget(job, emp) {
  let t = 100;
  if (emp && emp.importance === 'high') t = 115;
  if (emp && emp.importance === 'low') t = 88;
  if (job && isFactoryJob(job)) t = 92;
  return t;
}

function workKpiInstantChance(job, emp) {
  let p = 0.14;
  if (emp && emp.importance === 'high') p += 0.05;
  if (emp && emp.importance === 'low') p -= 0.03;
  if (typeof effStat === 'function') p += Math.min(0.1, (effStat('mind') || 0) * 0.0012);
  if (job && isFactoryJob(job)) p += 0.04;
  return Math.min(0.32, Math.max(0.07, p));
}

function workKpiProgressGain(job, emp) {
  let g = 11 + Math.floor(Math.random() * 16);
  if (typeof effStat === 'function') g += Math.floor((effStat('mind') || 0) / 7);
  if (emp && emp.importance === 'high') g += 2;
  if (job && isFactoryJob(job)) g += 3;
  return g;
}

function factoryExperienceWeeks(job, emp) {
  if (!game || !job) return 0;
  const cat = (game.industryExperience && game.industryExperience[job.category]) || 0;
  const co = (emp && emp.weeksInCompany) || 0;
  const role = (emp && emp.weeksInRole) || 0;
  return Math.max(cat, co, role);
}

function factoryYieldRate(job, emp) {
  const weeks = factoryExperienceWeeks(job, emp);
  let rate = 0.36 + Math.min(0.5, weeks * 0.011);
  if (typeof effStat === 'function') rate += Math.min(0.06, (effStat('body') || 0) * 0.0005);
  rate += (Math.random() - 0.5) * 0.1;
  return Math.min(0.94, Math.max(0.26, rate));
}

function factoryYieldEstimatePct(job, emp) {
  const weeks = factoryExperienceWeeks(job, emp);
  let rate = 0.36 + Math.min(0.5, weeks * 0.011);
  if (typeof effStat === 'function') rate += Math.min(0.06, (effStat('body') || 0) * 0.0005);
  return Math.round(Math.min(94, Math.max(26, rate * 100)));
}

function factoryDailyPieceCap(job, emp) {
  const annual = (emp && emp.annualPay) || (job && job.pay) || 96000;
  const dailyRef = annual / 52 / 5;
  return Math.max(35, Math.round(dailyRef * 0.32));
}

function factoryPiecePay(job, emp) {
  const annual = (emp && emp.annualPay) || (job && job.pay) || 96000;
  const hourlyWage = Math.max(18, Math.round(annual / 52 / 40));
  const grossPay = Math.max(8, Math.round(hourlyWage * (0.15 + Math.random() * 0.2)));
  const units = 6 + Math.floor(Math.random() * 10);
  const yieldRate = factoryYieldRate(job, emp);
  let goodUnits = Math.round(units * yieldRate);
  if (Math.random() < (yieldRate * units - goodUnits)) goodUnits++;
  goodUnits = Math.max(0, Math.min(units, goodUnits));
  const scrapUnits = units - goodUnits;
  const unitPay = Math.max(1, Math.round(grossPay / units));
  const scrapPenalty = scrapUnits > 0 ? Math.round(scrapUnits * unitPay * 0.12) : 0;
  const pay = Math.max(0, goodUnits * unitPay - scrapPenalty);
  return {
    units: units, goodUnits: goodUnits, scrapUnits: scrapUnits,
    pay: pay, unitPay: unitPay, yieldRate: yieldRate,
    grossPay: grossPay, scrapPenalty: scrapPenalty
  };
}

function maybeFactoryOverproductionReaction(job, emp, piecePayToday) {
  if (!game || !game.employed || !piecePayToday) return false;
  const cap = factoryDailyPieceCap(job, emp);
  if (piecePayToday < cap * 1.65) return false;
  const weeks = factoryExperienceWeeks(job, emp);
  const ratio = piecePayToday / cap;
  if (weeks >= 10 && ratio >= 2.8 && Math.random() < 0.22) {
    triggerFactoryPieceLayoff(job, emp, '计件提成远超产线预算，岗位改为外包编制');
    return true;
  }
  if (ratio >= 2.0 && Math.random() < 0.45) {
    addLog('⚠ 计件触线 · 车间主任：「产量太高，老板雇不起，下批单改定额」', 'warn');
    if (typeof addStress === 'function') addStress(2, '产线压力 ');
  }
  return false;
}

function triggerFactoryPieceLayoff(job, emp, reason) {
  if (!game || !game.employed) return;
  const coName = emp && emp.company && emp.company.name ? emp.company.name : '工厂';
  if (typeof recordCareerHistory === 'function') recordCareerHistory(emp);
  game.employed = false;
  game.employment = null;
  game.layoffs = (game.layoffs || 0) + 1;
  game.stealthJobSearch = false;
  game.stealthSearchWeeks = 0;
  if (typeof clearOpeningLayoffEvent === 'function') clearOpeningLayoffEvent();
  if (typeof addStress === 'function') addStress(9, '被裁 ');
  addLog('💔 ' + coName + '：' + (reason || '计件成本过高') + ' · 被辞退', 'fail');
  if (typeof updateLongDistanceStatus === 'function') updateLongDistanceStatus();
  if (typeof updateUI === 'function') updateUI();
  if (typeof renderDailyPanel === 'function') renderDailyPanel();
}

function initDailyWorkKpi() {
  if (!game || !game.employed || !game.employment || isPlayerScamJobForKpi()) return;
  const job = game.market && game.market[game.employment.jobIdx];
  if (!job) return;
  const d = typeof ensureDailyState === 'function' ? ensureDailyState() : game.daily;
  if (!d) return;
  d.inKpiOvertime = false;
  d.kpiOvertimeHoursUsed = 0;
  d.workKpi = {
    target: workKpiDailyTarget(job, game.employment),
    progress: 0,
    met: false,
    workHours: 0,
    piecePay: 0,
    pieceAttempted: 0,
    pieceGood: 0,
    pieceScrap: 0,
    instantDone: false
  };
}

function ensureDailyWorkKpi() {
  const d = game && game.daily;
  if (!d || !d.workKpi) initDailyWorkKpi();
  return d && d.workKpi;
}

function workKpiStatusHtml(wk, job) {
  if (!wk) return '';
  const pct = Math.min(100, Math.round(wk.progress / Math.max(1, wk.target) * 100));
  const bar = pct >= 100 ? 'var(--green)' : (pct >= 55 ? 'var(--yellow)' : 'var(--orange)');
  let h = '<p style="margin-top:8px;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border)">';
  h += '📊 今日 KPI <b style="color:' + bar + '">' + wk.progress + '</b>/' + wk.target + '（' + pct + '%）';
  if (wk.met) h += ' · <span style="color:var(--green)">已达标</span>';
  if (wk.workHours) h += '<br><span class="fold-meta">已工作 ' + wk.workHours + 'h';
  if (job && isFactoryJob(job) && wk.piecePay) {
    h += ' · 计件 +¥' + wk.piecePay.toLocaleString();
    if (wk.pieceAttempted) {
      const yp = Math.round((wk.pieceGood || 0) / Math.max(1, wk.pieceAttempted) * 100);
      h += ' · 良品 ' + (wk.pieceGood || 0) + '/' + wk.pieceAttempted + '（' + yp + '%）';
    }
  }
  h += '</span></p>';
  return h;
}

function workShiftKpiHtml() {
  if (!game || !game.employed || isPlayerScamJobForKpi()) return '';
  const wk = ensureDailyWorkKpi();
  if (!wk) return '';
  const job = game.market && game.market[game.employment.jobIdx];
  let h = workKpiStatusHtml(wk, job);
  const m = ensureWorkKpiMonth();
  if (m && m.monthDaysWorked > 0) {
    h += '<p class="fold-meta">本月 KPI 达标 ' + m.monthDaysKpiMet + '/' + m.monthDaysWorked + ' 天';
    if (m.monthOvertimeHours) h += ' · 加班补 KPI ' + m.monthOvertimeHours + 'h';
    h += '</p>';
  }
  if (game.daily && game.daily.inKpiOvertime) {
    const left = KPI_OVERTIME_MAX_H - (game.daily.kpiOvertimeHoursUsed || 0);
    h += '<p class="fold-meta" style="color:var(--orange)">⏰ KPI 加班中 · 剩 ' + left + 'h</p>';
  } else if (wk.met) {
    h += '<p class="fold-meta" style="color:var(--green)">✓ KPI 已达标 · 考核只影响月薪，可继续工作/计件至下班</p>';
  } else if (job && isFactoryJob(job)) {
    const expW = factoryExperienceWeeks(job, game.employment);
    const yEst = factoryYieldEstimatePct(job, game.employment);
    h += '<p class="fold-meta">🏭 计件绩效现结 · 熟链 <b>' + expW + '</b> 周 · 良品率约 <b>' + yEst + '%</b>';
    if (expW < 8) h += ' <span style="color:var(--orange)">（新工返工多、收入低）</span>';
    h += ' · 周薪另发</p>';
  } else {
    h += '<p class="fold-meta">💼 每次「工作」1h 推进 KPI · 未达标月底扣薪，达标有奖金</p>';
  }
  return h;
}

function workShiftKpiButtons() {
  if (!game || !game.employed || isPlayerScamJobForKpi()) return null;
  const d = game.daily;
  let left = 0;
  if (d && d.inKpiOvertime) left = KPI_OVERTIME_MAX_H - (d.kpiOvertimeHoursUsed || 0);
  else if (typeof dailySlotHoursLeft === 'function') left = dailySlotHoursLeft();
  else left = 8;
  if (left < 1) return null;
  const job = game.market && game.market[game.employment.jobIdx];
  const label = isFactoryJob(job) ? '🏭 工作（1h·计件）' : '💼 工作（1h）';
  return [{ text: label, fn: 'doWorkShiftJobWork()' }];
}

function doWorkShiftJobWork() {
  if (typeof workShiftConsumeHours === 'function' && !workShiftConsumeHours(1, '工作')) return;
  const wk = ensureDailyWorkKpi();
  if (!wk) {
    if (typeof showWorkShiftActionResult === 'function') showWorkShiftActionResult('💼', '工作', '<p class="fold-meta">无 KPI 任务</p>');
    return;
  }
  const job = game.market[game.employment.jobIdx];
  const emp = game.employment;
  const alreadyMet = !!wk.met;
  wk.workHours = (wk.workHours || 0) + 1;
  let html = '<p>认真干了 <b>1</b> 小时</p>';
  if (isFactoryJob(job)) {
    const piece = factoryPiecePay(job, emp);
    wk.piecePay = (wk.piecePay || 0) + piece.pay;
    wk.pieceAttempted = (wk.pieceAttempted || 0) + piece.units;
    wk.pieceGood = (wk.pieceGood || 0) + piece.goodUnits;
    wk.pieceScrap = (wk.pieceScrap || 0) + piece.scrapUnits;
    if (piece.pay > 0) {
      game.cash += piece.pay;
      if (typeof ledgerAddIncome === 'function') ledgerAddIncome('salary', '🏭', '计件工资', piece.pay);
    }
    const yPct = Math.round(piece.yieldRate * 100);
    html += '<p>做 <b>' + piece.units + '</b> 件 · 良品 <b style="color:var(--green)">' + piece.goodUnits + '</b>';
    if (piece.scrapUnits) html += ' · 返工/报废 <b style="color:var(--orange)">' + piece.scrapUnits + '</b>';
    html += ' · 良品率 <b>' + yPct + '%</b></p>';
    if (piece.scrapPenalty) html += '<p class="fold-meta">废品扣款 -¥' + piece.scrapPenalty + '</p>';
    html += '<p>现结 <b style="color:var(--' + (piece.pay > 0 ? 'green' : 'muted') + ')">' + (piece.pay > 0 ? '+' : '') + '¥' + piece.pay.toLocaleString() + '</b></p>';
    addLog('🏭 计件 良品' + piece.goodUnits + '/' + piece.units + ' · +' + piece.pay + '（良品率' + yPct + '%）', piece.pay > 0 ? 'success' : 'warn');
  }
  if (!alreadyMet) {
    const instantPct = Math.round(workKpiInstantChance(job, emp) * 100);
    if (Math.random() < workKpiInstantChance(job, emp)) {
      wk.progress = wk.target;
      wk.met = true;
      wk.instantDone = true;
      html += '<p style="color:var(--green);margin-top:6px">✨ 效率爆发 · 一次搞定今日 KPI！</p>';
      addLog('✓ 今日 KPI 一次达标（工作 ' + wk.workHours + 'h）', 'success');
    } else {
      const gain = workKpiProgressGain(job, emp);
      wk.progress = Math.min(wk.target, wk.progress + gain);
      html += '<p>KPI +' + gain + ' → <b>' + wk.progress + '</b>/' + wk.target + ' <span class="fold-meta">（一次达标概率约 ' + instantPct + '%）</span></p>';
      if (wk.progress >= wk.target) {
        wk.met = true;
        html += '<p style="color:var(--green)">今日 KPI 达标</p>';
        addLog('✓ 今日 KPI 达标（' + wk.workHours + 'h · ' + wk.progress + '/' + wk.target + '）', 'success');
      }
    }
  } else {
    html += '<p class="fold-meta" style="color:var(--green);margin-top:6px">KPI 已达标 · 本次不计考核' + (isFactoryJob(job) ? ' · 计件照发' : '') + '</p>';
    addLog((isFactoryJob(job) ? '🏭 继续计件' : '💼 继续工作') + '（KPI 已达标）', 'info');
  }
  if (typeof addStress === 'function') addStress(1, '工作 ');
  html += workKpiStatusHtml(wk, job);
  html += '<p class="fold-meta" style="margin-top:6px">压力 +1</p>';
  if (typeof updateUI === 'function') updateUI();
  if (typeof showWorkShiftActionResult === 'function') showWorkShiftActionResult('💼', '工作 · 1h', html);
}

function shouldPromptWorkKpiOvertime() {
  if (!game || !game.employed || isPlayerScamJobForKpi()) return false;
  const d = game.daily;
  const wk = d && d.workKpi;
  if (!wk || wk.met || d.inKpiOvertime) return false;
  return true;
}

function startWorkKpiOvertime() {
  const d = typeof ensureDailyState === 'function' ? ensureDailyState() : game.daily;
  if (!d) return;
  d.inKpiOvertime = true;
  d.kpiOvertimeHoursUsed = d.kpiOvertimeHoursUsed || 0;
  addLog('⏰ 正班结束 · 加班补 KPI', 'warn');
  if (typeof returnToWorkShiftModal === 'function') returnToWorkShiftModal();
}

function promptWorkKpiOvertime() {
  const wk = game.daily && game.daily.workKpi;
  if (!wk) {
    if (typeof finishWorkShift === 'function') finishWorkShift();
    return;
  }
  const html = '<p>今日 KPI <b>' + wk.progress + '</b>/' + wk.target + ' · 正班 ' +
    (typeof SLOT_HOURS_TOTAL !== 'undefined' ? SLOT_HOURS_TOTAL : 8) + 'h 已用完。</p>' +
    '<p class="fold-meta">可加班继续「工作」（最多 ' + KPI_OVERTIME_MAX_H + 'h），或先下班（计入未达标）</p>';
  const goOt = function () {
    if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
    startWorkKpiOvertime();
  };
  const leave = function () {
    if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
    if (typeof finishWorkShift === 'function') finishWorkShift();
  };
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '⏰', title: 'KPI 未达标', html: html,
      buttons: [
        { text: '加班补 KPI', handler: goOt },
        { text: '先下班', primary: true, handler: leave }
      ]
    });
    return;
  }
  if (confirm('KPI 未达标，是否加班？')) goOt();
  else leave();
}

function recordWorkKpiDayOnFinish() {
  if (!game || !game.employed || isPlayerScamJobForKpi()) return;
  const wk = game.daily && game.daily.workKpi;
  if (!wk) return;
  const m = ensureWorkKpiMonth();
  m.monthDaysWorked = (m.monthDaysWorked || 0) + 1;
  if (wk.met) {
    m.monthDaysKpiMet = (m.monthDaysKpiMet || 0) + 1;
  } else {
    m.monthDaysMissed = (m.monthDaysMissed || 0) + 1;
    addLog('📉 今日 KPI 未达标（' + wk.progress + '/' + wk.target + '）', 'warn');
  }
}

function tickWorkKpiMonthly() {
  if (!game || game.gameOver) return;
  const wpm = typeof WEEKS_PER_MONTH !== 'undefined' ? WEEKS_PER_MONTH : 4;
  if (game.week < 1 || game.week % wpm !== 0) return;
  const m = game.workKpi;
  if (!m || !m.monthDaysWorked) return;
  const required = Math.max(1, Math.ceil(m.monthDaysWorked * 0.75));
  const shortfall = Math.max(0, required - (m.monthDaysKpiMet || 0));
  if (shortfall <= 0) {
    if (!game.employed || !game.employment) {
      addLog('📊 本月 KPI 考核达标（' + m.monthDaysKpiMet + '/' + m.monthDaysWorked + ' 天）', 'info');
      return;
    }
    const job = game.market[game.employment.jobIdx];
    if (!job) return;
    const ws = typeof weeklySalary === 'function' ? weeklySalary(job, game.employment) : 2000;
    const bonus = Math.round(ws * 0.05 * Math.max(1, m.monthDaysKpiMet || 0));
    if (bonus > 0) {
      game.cash = (game.cash || 0) + bonus;
      game.money = (game.money || 0) + bonus;
      if (typeof ledgerAddIncome === 'function') ledgerAddIncome('salary', '📊', 'KPI达标奖金', bonus);
      addLog('📊 本月 KPI 达标 · 奖金 +¥' + bonus.toLocaleString() + '（' + m.monthDaysKpiMet + '/' + m.monthDaysWorked + ' 天）', 'success');
    } else {
      addLog('📊 本月 KPI 考核达标（' + m.monthDaysKpiMet + '/' + m.monthDaysWorked + ' 天）', 'info');
    }
    return;
  }
  const otRescue = Math.floor((m.monthOvertimeHours || 0) / 2);
  const remaining = Math.max(0, shortfall - otRescue);
  if (remaining <= 0) {
    addLog('⏰ 本月 KPI 靠加班补够（加班 ' + m.monthOvertimeHours + 'h）', 'info');
    return;
  }
  if (!game.employed || !game.employment) return;
  const job = game.market[game.employment.jobIdx];
  if (!job) return;
  const ws = typeof weeklySalary === 'function' ? weeklySalary(job, game.employment) : 2000;
  const penalty = Math.round(ws * 0.07 * remaining);
  if (penalty > 0) {
    game.cash = Math.max(0, (game.cash || 0) - penalty);
    game.money = Math.max(0, (game.money || 0) - penalty);
    if (typeof ledgerAddExpense === 'function') ledgerAddExpense('salary', '📉', 'KPI未达标扣薪', penalty, false);
    addLog('📉 本月 KPI 差 ' + remaining + ' 天 · 扣薪 ¥' + penalty.toLocaleString(), 'warn');
  }
}

function patchWorkShiftConsumeHoursForKpi() {
  if (typeof workShiftConsumeHours === 'undefined' || workShiftConsumeHours._kpiPatch) return;
  const orig = workShiftConsumeHours;
  workShiftConsumeHours = function (h, label) {
    const d = typeof ensureDailyState === 'function' ? ensureDailyState() : (game && game.daily);
    if (d && d.inKpiOvertime && typeof isPlayerOnWorkShift === 'function' && isPlayerOnWorkShift()) {
      if ((d.kpiOvertimeHoursUsed || 0) + h > KPI_OVERTIME_MAX_H) {
        addLog('今日 KPI 加班最多 ' + KPI_OVERTIME_MAX_H + 'h', 'fail');
        return false;
      }
      d.kpiOvertimeHoursUsed = (d.kpiOvertimeHoursUsed || 0) + h;
      const m = ensureWorkKpiMonth();
      m.monthOvertimeHours = (m.monthOvertimeHours || 0) + h;
      if (typeof renderDailyPanel === 'function') renderDailyPanel();
      return true;
    }
    return orig.apply(this, arguments);
  };
  workShiftConsumeHours._kpiPatch = true;
}

function patchWorkShiftAfterActionForKpi() {
  if (typeof workShiftAfterAction === 'undefined' || workShiftAfterAction._kpiPatch) return;
  const orig = workShiftAfterAction;
  workShiftAfterAction = function () {
    if (!isPlayerOnWorkShift()) return;
    const d = game.daily;
    const cap = typeof SLOT_HOURS_TOTAL !== 'undefined' ? SLOT_HOURS_TOTAL : 8;
    if ((d.slotHoursUsed || 0) >= cap) {
      if (typeof finishWorkShift === 'function') finishWorkShift();
      return;
    }
    return orig.apply(this, arguments);
  };
  workShiftAfterAction._kpiPatch = true;
}

function patchBeginWorkShiftForKpi() {
  if (typeof beginWorkShift === 'undefined' || beginWorkShift._kpiPatch) return;
  const orig = beginWorkShift;
  beginWorkShift = function (period, overtimeFlow) {
    orig.apply(this, arguments);
    if (!overtimeFlow) initDailyWorkKpi();
  };
  beginWorkShift._kpiPatch = true;
}

function patchFinishWorkShiftForKpi() {
  if (typeof finishWorkShift === 'undefined' || finishWorkShift._kpiPatch) return;
  const orig = finishWorkShift;
  finishWorkShift = function () {
    recordWorkKpiDayOnFinish();
    if (game && game.employed && game.employment) {
      const job = game.market && game.market[game.employment.jobIdx];
      const wk = game.daily && game.daily.workKpi;
      if (job && isFactoryJob(job) && wk && wk.piecePay) {
        maybeFactoryOverproductionReaction(job, game.employment, wk.piecePay);
      }
    }
    if (game && game.daily) {
      game.daily.inKpiOvertime = false;
      game.daily.kpiOvertimeHoursUsed = 0;
    }
    return orig.apply(this, arguments);
  };
  finishWorkShift._kpiPatch = true;
}

function patchShowWorkShiftModalForKpi() {
  if (typeof showWorkShiftModal === 'undefined' || showWorkShiftModal._kpiPatch) return;
  const orig = showWorkShiftModal;
  showWorkShiftModal = function (useOvertimeFlow) {
    if (useOvertimeFlow) return orig.apply(this, arguments);
    orig.apply(this, arguments);
    if (isPlayerScamJobForKpi()) return;
    const el = document.getElementById('consumeMsg');
    const acts = document.getElementById('consumeActions');
    if (el && typeof workShiftKpiHtml === 'function') {
      const extra = workShiftKpiHtml();
      if (extra) el.innerHTML += extra;
    }
    if (acts && typeof workShiftKpiButtons === 'function') {
      const kb = workShiftKpiButtons();
      if (kb && kb.length) {
        kb.forEach(function (b) {
          const btn = document.createElement('button');
          btn.className = 'btn';
          btn.type = 'button';
          btn.textContent = b.text;
          btn.setAttribute('onclick', b.fn);
          acts.insertBefore(btn, acts.firstChild);
        });
      }
    }
  };
  showWorkShiftModal._kpiPatch = true;
}

function patchAdvanceOneWeekForKpi() {
  if (typeof advanceOneWeek === 'undefined' || advanceOneWeek._kpiPatch) return;
  const orig = advanceOneWeek;
  advanceOneWeek = function () {
    const r = orig.apply(this, arguments);
    if (r) tickWorkKpiMonthly();
    return r;
  };
  advanceOneWeek._kpiPatch = true;
}

function ensureWorkKpiPatches() {
  patchWorkShiftConsumeHoursForKpi();
  patchWorkShiftAfterActionForKpi();
  patchBeginWorkShiftForKpi();
  patchFinishWorkShiftForKpi();
  patchShowWorkShiftModalForKpi();
  patchAdvanceOneWeekForKpi();
  if (typeof beginWorkShift === 'undefined' || !beginWorkShift._kpiPatch) setTimeout(ensureWorkKpiPatches, 0);
}

ensureWorkKpiPatches();
