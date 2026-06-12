/* 女性生理周期：21–35天 · 月经/排卵/安全期 · 属性±10 · 性行为与怀孕 */
const CYCLE_AGE_MIN = 21;
const CYCLE_AGE_MAX = 35;
const CYCLE_MENSTRUAL_DAYS = 5;
const CYCLE_OVULATION_WINDOW = 2;
const CYCLE_STAT_SWING = 10;
const CYCLE_CONCEIVE_OVULATION = 0.10;
const CYCLE_CONCEIVE_OVULATION_PROC = 0.20;
const CYCLE_CONCEIVE_SAFE = 0.01;
const CYCLE_EDGE_STAT_GATE = 90;
const CYCLE_MISCARRIAGE_CHANCE = 0.08;
const CYCLE_FIRST_TRIMESTER_WEEKS = 12;

function femaleInCycleAge(age){
  return age >= CYCLE_AGE_MIN && age <= CYCLE_AGE_MAX;
}
function getPartnerAge(){
  if(typeof getPlayerAge === 'function') return getPlayerAge();
  return (typeof START_AGE !== 'undefined' ? START_AGE : 22);
}
function rollCycleLength(){
  return 21 + Math.floor(Math.random() * 15);
}
function cycleSubjectKey(who){
  return who === 'partner' ? 'partner' : 'player';
}
function cycleStateField(who, field){
  const k = cycleSubjectKey(who);
  if(k === 'partner') return 'cyclePartner' + field;
  return 'cyclePlayer' + field;
}
function ensureCycleSubject(who){
  if(!game) return null;
  const age = who === 'partner'
    ? getPartnerAge()
    : (typeof getPlayerAge === 'function' ? getPlayerAge() : CYCLE_AGE_MIN);
  const gender = who === 'partner' ? (game.partnerGender || 'female') : (game.playerGender || 'male');
  if(gender !== 'female' || !femaleInCycleAge(age)) return null;
  const lenKey = cycleStateField(who, 'Len');
  const dayKey = cycleStateField(who, 'Day');
  if(!game[lenKey] || game[lenKey] < 21 || game[lenKey] > 35) game[lenKey] = rollCycleLength();
  if(!game[dayKey] || game[dayKey] < 1 || game[dayKey] > game[lenKey]){
    game[dayKey] = 1 + Math.floor(Math.random() * game[lenKey]);
  }
  return {who, len: game[lenKey], day: game[dayKey]};
}
function ovulationBounds(len){
  const center = Math.round(len / 2);
  const start = Math.max(CYCLE_MENSTRUAL_DAYS + 1, center - CYCLE_OVULATION_WINDOW);
  const end = Math.min(len - 5, center + CYCLE_OVULATION_WINDOW);
  return {start, end, center};
}
function cycleStatModForDay(day, len){
  const {start: ovStart, end: ovEnd} = ovulationBounds(len);
  if(day <= CYCLE_MENSTRUAL_DAYS) return -CYCLE_STAT_SWING;
  if(day >= ovStart && day <= ovEnd) return CYCLE_STAT_SWING;
  if(day < ovStart){
    const span = Math.max(1, ovStart - CYCLE_MENSTRUAL_DAYS);
    const t = (day - CYCLE_MENSTRUAL_DAYS) / span;
    return Math.round(-CYCLE_STAT_SWING + t * (CYCLE_STAT_SWING * 2));
  }
  const span = Math.max(1, len - ovEnd);
  const t = (day - ovEnd) / span;
  return Math.round(CYCLE_STAT_SWING - t * (CYCLE_STAT_SWING * 2));
}
function cyclePhaseForSubject(who){
  const st = ensureCycleSubject(who);
  if(!st) return null;
  const pregnant = isSubjectPregnant(who);
  const {start: ovStart, end: ovEnd} = ovulationBounds(st.len);
  let phase = 'safe';
  if(!pregnant && st.day <= CYCLE_MENSTRUAL_DAYS) phase = 'menstrual';
  else if(st.day >= ovStart && st.day <= ovEnd) phase = 'ovulation';
  else if(st.day > CYCLE_MENSTRUAL_DAYS && st.day < ovStart) phase = 'follicular';
  else phase = 'safe';
  return {
    who: st.who,
    day: st.day,
    len: st.len,
    phase,
    statMod: cycleStatModForDay(st.day, st.len),
    pregnant: !!pregnant,
    onPeriod: !pregnant && st.day <= CYCLE_MENSTRUAL_DAYS
  };
}
function isSubjectPregnant(who){
  if(!game || !game.pregnant) return false;
  if(who === 'player') return game.pregnantSubject === 'player';
  return game.pregnantSubject === 'partner' || (!game.pregnantSubject && game.partnerGender === 'female');
}
function cyclePhaseLabel(phase){
  if(phase === 'menstrual') return '月经期';
  if(phase === 'ovulation') return '排卵期';
  if(phase === 'follicular') return '卵泡期';
  return '安全期';
}
function cyclePhaseColor(phase){
  if(phase === 'menstrual') return 'var(--red)';
  if(phase === 'ovulation') return 'var(--green)';
  if(phase === 'follicular') return 'var(--blue)';
  return 'var(--muted)';
}
function getPlayerCycleStatMod(){
  const cs = cyclePhaseForSubject('player');
  return cs ? cs.statMod : 0;
}
function getPartnerCycleStatMod(){
  const cs = cyclePhaseForSubject('partner');
  return cs ? cs.statMod : 0;
}
function tickMenstrualDays(n){
  if(!game || !n) return;
  ['player', 'partner'].forEach(function(who){
    const st = ensureCycleSubject(who);
    if(!st) return;
    const dayKey = cycleStateField(who, 'Day');
    const lenKey = cycleStateField(who, 'Len');
    let day = game[dayKey] + n;
    let len = game[lenKey];
    while(day > len){
      day -= len;
      len = rollCycleLength();
      game[lenKey] = len;
    }
    game[dayKey] = day;
  });
}
function flushMenstrualCycleWeek(){
  if(!game) return;
  const done = game.daily ? (game.daily.dayIndex || 0) : 0;
  const remaining = Math.max(0, 7 - done);
  if(remaining > 0) tickMenstrualDays(remaining);
}
function initMenstrualCycleState(){
  if(!game) return;
  ['player', 'partner'].forEach(function(who){
    ensureCycleSubject(who);
  });
}
function migrateMenstrualCycle(){
  if(!game) return;
  initMenstrualCycleState();
  if(!game.partnerTempStats) game.partnerTempStats = defaultTempStats();
}
function cyclePartnerDisplayName(){
  return game.partnerDisplayName || (typeof COMPANION_NAME !== 'undefined' ? COMPANION_NAME : '伴侣');
}
function closeSexAndClearReserve(){
  if(typeof closeConsumeModal==='function')closeConsumeModal();
  if(typeof clearDailySexReserve==='function')clearDailySexReserve();
}
function fertileFemaleCyclePhase(){
  if(!game || typeof isSameSexCouple === 'function' && isSameSexCouple()) return null;
  if(game.playerGender === 'female') return cyclePhaseForSubject('player');
  if(game.partnerGender === 'female') return cyclePhaseForSubject('partner');
  return null;
}
function menstrualConceptionChance(noCondom){
  if(!noCondom) return typeof PREGNANCY_CHANCE_SAFE !== 'undefined' ? PREGNANCY_CHANCE_SAFE : 0.06;
  const cs = fertileFemaleCyclePhase();
  if(!cs || cs.onPeriod) return 0;
  if(cs.phase === 'ovulation'){
    if(game.procreateIntentWeek === game.week) return CYCLE_CONCEIVE_OVULATION_PROC;
    return CYCLE_CONCEIVE_OVULATION;
  }
  return CYCLE_CONCEIVE_SAFE;
}
function anyEffStatAboveGate(){
  return effStat('body') > CYCLE_EDGE_STAT_GATE || effStat('mind') > CYCLE_EDGE_STAT_GATE || effStat('spirit') > CYCLE_EDGE_STAT_GATE;
}
function anyPartnerEffStatAboveGate(){
  if(typeof partnerEffStat !== 'function') return false;
  return partnerEffStat('body') > CYCLE_EDGE_STAT_GATE || partnerEffStat('mind') > CYCLE_EDGE_STAT_GATE || partnerEffStat('spirit') > CYCLE_EDGE_STAT_GATE;
}
function isAllNightSlot(){
  return !!(game && game.daily && game.daily.phase === 'allnight');
}
function ensurePartnerTempStats(){
  if(!game) return null;
  if(!game.partnerTempStats){
    game.partnerTempStats = typeof defaultTempStats === 'function' ? defaultTempStats() : {body:0,mind:0,spirit:0};
  }
  return game.partnerTempStats;
}
function addPartnerTempStat(k, delta, logMsg){
  if(!game) return 0;
  const ts = ensurePartnerTempStats();
  const prev = ts[k] || 0;
  const range = typeof TEMP_STAT_RANGE !== 'undefined' ? TEMP_STAT_RANGE : 10;
  const next = Math.max(-range, Math.min(range, prev + (delta || 0)));
  if(next === prev) return 0;
  ts[k] = next;
  const actual = next - prev;
  if(logMsg && typeof addLog === 'function'){
    addLog(logMsg + ' · 伴侣临时' + STAT_LABEL[k] + (actual > 0 ? '+' : '') + actual, 'info');
  }
  return actual;
}
function getMenstrualMakeLoveBlock(){
  if(!game || !game.married || game.divorced) return null;
  if(typeof isSameSexCouple === 'function' && isSameSexCouple()) return null;
  const pn = cyclePartnerDisplayName();
  const playerCs = cyclePhaseForSubject('player');
  const partnerCs = cyclePhaseForSubject('partner');
  if(playerCs && playerCs.onPeriod){
    if(anyEffStatAboveGate()) return null;
    return '你正在月经期，无法做爱，只能自慰';
  }
  if(partnerCs && partnerCs.onPeriod){
    if(anyEffStatAboveGate() || isAllNightSlot()) return null;
    return pn + '：「我在月经，不能做爱」';
  }
  return null;
}
function runMutualMasturbationEdge(){
  if(typeof addStress === 'function') addStress(-5, '互相手淫 ');
  if(typeof addPartnerStress === 'function') addPartnerStress(-5, '互相手淫 ');
  const c = typeof ensureConsumption === 'function' ? ensureConsumption() : null;
  if(c) c.masturbationSessions = (c.masturbationSessions || 0) + 1;
  if(typeof addLog === 'function') addLog('🫂 边缘性行为 · 互相手淫 · 双方压力 -5', 'info');
  if(typeof renderSpendingPanel === 'function') renderSpendingPanel();
  if(typeof updateUI === 'function') updateUI();
  if(typeof renderDailyPanel === 'function') renderDailyPanel();
}
function runHelpPartnerMasturbateEdge(){
  if(typeof addPartnerStress === 'function') addPartnerStress(-5, '手淫 ');
  ['body', 'mind', 'spirit'].forEach(function(k){
    addPartnerTempStat(k, 1, '🫂 帮她手淫');
  });
  const c = typeof ensureConsumption === 'function' ? ensureConsumption() : null;
  if(c) c.masturbationSessions = (c.masturbationSessions || 0) + 1;
  if(typeof addLog === 'function') addLog('🫂 边缘性行为 · 帮她手淫 · 伴侣压力 -5 · 临时三维各 +1', 'info');
  if(typeof renderSpendingPanel === 'function') renderSpendingPanel();
  if(typeof updateUI === 'function') updateUI();
  if(typeof renderDailyPanel === 'function') renderDailyPanel();
}
function showMenstrualEdgeModal(mode){
  const pn = cyclePartnerDisplayName();
  let html = '';
  let buttons = [];
  if(mode === 'player_period'){
    html = '你正在月经期，无法做爱。<br>你此刻状态高涨，可选择 <b>边缘性行为（互相手淫）</b>。';
    buttons = [
      {text:'互相手淫', primary:true, fn:'closeConsumeModal();runMutualMasturbationEdge()'},
      {text:'算了', fn:'closeSexAndClearReserve()'}
    ];
  }else{
    html = pn + ' 正在月经，不能做爱，但此刻她请求你帮她手淫。<br><span class="fold-meta">互相手淫：双方压力 -5 · 帮她：她压力 -5，临时肉体/心智/精神各 +1</span>';
    buttons = [
      {text:'互相手淫', fn:'closeConsumeModal();runMutualMasturbationEdge()'},
      {text:'帮她手淫', primary:true, fn:'closeConsumeModal();runHelpPartnerMasturbateEdge()'},
      {text:'拒绝', fn:'closeSexAndClearReserve()'}
    ];
  }
  if(typeof showConsumeModal === 'function'){
    showConsumeModal({icon:'🫂', title:'边缘性行为', html:html, buttons:buttons});
  }
}
function interceptMakeLoveForCycle(batch){
  if(!game || !game.married || game.divorced) return false;
  if(typeof isSameSexCouple === 'function' && isSameSexCouple()) return false;
  const playerCs = cyclePhaseForSubject('player');
  const partnerCs = cyclePhaseForSubject('partner');
  if(playerCs && playerCs.onPeriod){
    if(anyEffStatAboveGate()){
      showMenstrualEdgeModal('player_period');
      return true;
    }
    return false;
  }
  if(partnerCs && partnerCs.onPeriod && (anyEffStatAboveGate() || anyPartnerEffStatAboveGate() || isAllNightSlot())){
    showMenstrualEdgeModal('partner_period');
    return true;
  }
  return false;
}
function rollFirstTrimesterMiscarriage(){
  if(!game || !game.pregnant) return false;
  if(typeof pregnancyWeeksElapsed !== 'function') return false;
  if(pregnancyWeeksElapsed() > CYCLE_FIRST_TRIMESTER_WEEKS) return false;
  if(Math.random() >= CYCLE_MISCARRIAGE_CHANCE) return false;
  game.pregnant = false;
  game.pregnantSubject = null;
  game.pregnancyWeeksLeft = 0;
  game.pregnancyIntimacyNet = 0;
  game.procreateIntentWeek = -1;
  if(typeof adjustSpouseIntimacy === 'function') adjustSpouseIntimacy(-10, '流产 ');
  if(typeof addLog === 'function') addLog('💔 孕早期同房导致流产 · 亲密度 -10', 'fail');
  return true;
}
function makeLovePregnancyWarningHtml(){
  if(!game || !game.pregnant) return '';
  if(typeof pregnancyWeeksElapsed !== 'function') return '';
  if(pregnancyWeeksElapsed() > CYCLE_FIRST_TRIMESTER_WEEKS) return '';
  return '<br><span style="color:var(--red)">⚠ 孕早期（前三个月）做爱有 ' + Math.round(CYCLE_MISCARRIAGE_CHANCE * 100) + '% 流产风险 · 若流产亲密度 -10</span>';
}
function makeLoveConceptionHintHtml(){
  if(!game || game.pregnant || game.hasChildren) return '';
  if(typeof isSameSexCouple === 'function' && isSameSexCouple()) return '';
  const cs = fertileFemaleCyclePhase();
  if(!cs) return '';
  const phaseTxt = cyclePhaseLabel(cs.phase) + '（周期第 ' + cs.day + '/' + cs.len + ' 天）';
  let rate = '';
  if(cs.phase === 'ovulation'){
    rate = game.procreateIntentWeek === game.week
      ? '不戴套怀孕约 ' + Math.round(CYCLE_CONCEIVE_OVULATION_PROC * 100) + '%（备孕）'
      : '不戴套怀孕约 ' + Math.round(CYCLE_CONCEIVE_OVULATION * 100) + '%';
  }else if(!cs.onPeriod){
    rate = '不戴套怀孕约 ' + Math.round(CYCLE_CONCEIVE_SAFE * 100) + '%';
  }
  return '<br><span style="color:var(--muted)">🩸 ' + phaseTxt + (rate ? ' · ' + rate : '') + '</span>';
}
function cycleStatusCompanionRow(){
  if(!game || !game.married || game.divorced) return '';
  const cs = cyclePhaseForSubject('partner');
  if(!cs) return '';
  const pn = cyclePartnerDisplayName();
  const mod = cs.statMod;
  const modTxt = (mod > 0 ? '+' : '') + mod;
  let extra = cs.pregnant ? '（怀孕中 · 无月经）' : '';
  return '<div class="companion-row"><span>🩸 ' + pn + ' · ' + cyclePhaseLabel(cs.phase) + extra + '</span>' +
    '<span style="color:' + cyclePhaseColor(cs.phase) + '">第 ' + cs.day + '/' + cs.len + ' 天 · 三维 ' + modTxt + '</span></div>';
}
function cycleStatusPlayerRow(){
  if(!game) return '';
  const cs = cyclePhaseForSubject('player');
  if(!cs) return '';
  const mod = cs.statMod;
  const modTxt = (mod > 0 ? '+' : '') + mod;
  let extra = cs.pregnant ? '（怀孕中 · 无月经）' : '';
  return '<div class="companion-row"><span>🩸 你的周期 · ' + cyclePhaseLabel(cs.phase) + extra + '</span>' +
    '<span style="color:' + cyclePhaseColor(cs.phase) + '">第 ' + cs.day + '/' + cs.len + ' 天 · 三维 ' + modTxt + '</span></div>';
}
