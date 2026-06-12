/* 日常活动系统 — 由 build.js 注入 */
const DAY_NAMES=['周一','周二','周三','周四','周五','周六','周日'];
const PHASE_LABELS={morning:'白天',evening:'晚上',allnight:'后半夜'};
const INTERNET_CATS=['信息技术','文化传媒','销售零售与电商'];
const CAR_SHOP={
  economy:{name:'代步车',price:150000,commute:'car'},
  suv:{name:'SUV',price:300000,commute:'car'},
  sports:{name:'跑车',price:900000,commute:'car'}
};
const PHONE_SHOP={
  nokia:{name:'经典诺基亚',price:399,noApp:true,noTaxi:true},
  xiaomi:{name:'小米',price:2000,default:true},
  huawei:{name:'华为超D屏',price:18000,posBias:0.12,negBias:-0.05,paidUp:0.08,loseMult:1.4,photoDate:true},
  iphone:{name:'iPhone 20 Pro Max',price:10000,costMult:1.2,negBias:-0.12,loseMult:1.3,photoDate:true}
};
const STAT_MAX=120;
const TEMP_STAT_RANGE=10;
const STAT_LABEL={body:'肉体',mind:'心智',spirit:'精神'};
const SLOT_HOURS_TOTAL=8;
const SLOT_BATCH_HOURS=8;
const PARTNER_RECALL_HOME_HOURS=2;
const ALLNIGHT_DEVIL_HOURS_START=4;
const OT_SOCIAL_PROB=0.38;
const MONTHLY_ABSENCE_LIMIT=4;
const OT_SOCIAL_PARTIAL_HOURS=6;
const ALLNIGHT_DEATH_BY_STREAK=[0,0.0001,0.01,0.05,0.60,1];
function getAllnightStreak(){return game&&(game.allnightStreak||0)||0}
function setAllnightStreak(n){if(game)game.allnightStreak=Math.max(0,n||0)}
function getCompanionAllnightStreak(){return game&&(game.companionAllnightStreak||0)||0}
function setCompanionAllnightStreak(n){if(game)game.companionAllnightStreak=Math.max(0,n||0)}
function allnightNoSleepDeathRate(streak){
  if(streak>=5)return 1;
  if(streak<1)return 0;
  return ALLNIGHT_DEATH_BY_STREAK[Math.min(streak,5)];
}
function allnightDeathAgeMultiplier(){
  if(typeof getPlayerAge!=='function'||typeof START_AGE==='undefined')return 1;
  const decades=Math.max(0,Math.floor((getPlayerAge()-START_AGE)/10));
  return 1+decades*0.10;
}
function allnightDeathRiskPct(currentStreak){
  const next=(currentStreak||0)+1;
  if(next>=5)return 100;
  return Math.min(100,allnightNoSleepDeathRate(next)*allnightDeathAgeMultiplier()*100);
}
function formatAllnightDeathRisk(currentStreak){
  const next=(currentStreak||0)+1;
  if(next>=5)return '100%（必死）';
  if(next===1)return '万分之一';
  const pct=allnightDeathRiskPct(currentStreak);
  return pct<10?pct.toFixed(pct<1?2:0).replace(/\.?0+$/,'')+'%':Math.round(pct)+'%';
}
function rollAllnightSuddenDeath(streak){
  if(streak>=5)return true;
  let p=allnightNoSleepDeathRate(streak)*allnightDeathAgeMultiplier();
  p=Math.min(1,p);
  return Math.random()<p;
}
function renderAllnightStreakHint(){
  const s=getAllnightStreak();
  if(!s)return '';
  return '<p style="color:var(--orange);font-size:.72rem">已连续通宵未睡 '+s+' 天</p>';
}
function renderCompanionAllnightStreakHint(){
  const s=getCompanionAllnightStreak();
  if(!s)return '';
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  return '<p style="color:var(--orange);font-size:.72rem">'+pn+'已连续通宵未睡 '+s+' 天</p>';
}
function renderEmployedJobBar(){
  if(!game||!game.employed||!game.employment)return '';
  const job=game.market&&game.market[game.employment.jobIdx];
  const co=game.employment.company;
  if(!job||!co)return '';
  ensureMonthlyAbsenceMonth();
  const abs=game.monthlyAbsenceCount||0;
  const absHtml=abs>0?' · <span style="color:var(--red)">本月旷工 <b>'+abs+'</b>/'+MONTHLY_ABSENCE_LIMIT+'</span>':'';
  return '<div class="daily-employ" style="font-size:.78rem;margin-bottom:8px;padding:6px 10px;background:var(--bg);border:1px solid var(--border);border-radius:6px">'+
    '💼 在职：<b>'+job.title+'</b> @ '+co.name+absHtml+
    ' <button type="button" class="btn btn-warn" style="font-size:.68rem;padding:2px 8px;margin-left:8px" onclick="confirmPlayerResign()">辞职</button></div>';
}
function renderAllnightStreakRow(){
  const ps=getAllnightStreak(),cs=getCompanionAllnightStreak();
  if(!ps&&!cs)return '';
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  let t='';
  if(ps)t+='你已连续通宵未睡 '+ps+' 天';
  if(ps&&cs)t+=' · ';
  if(cs)t+=pn+'已连续通宵未睡 '+cs+' 天';
  return '<p style="color:var(--orange);font-size:.72rem;margin:0 0 6px">'+t+'</p>';
}

function defaultDailyState(){
  return{dayIndex:0,phase:'morning',workSkipDays:0,workedDays:0,weekWorkWarned:false,workedToday:false,jobHuntedToday:false,jobHuntCount:0,jobHuntBySlot:{},jobSubMenu:null,jobInboxReturnTo:null,dailyPickApp:null,dailyPickJobIdxs:[],subMenu:null,
    slotHoursUsed:0,slotSexUsed:false,slotMasturbateUsed:false,slotSnackUsed:false,snackPortionsToday:0,partnerSnackPortionsToday:0,
    slotContactsUsed:{},slotNoAnswerContacts:{},slotActivity:null,inOvertime:false,overtimeSlack:0,overtimeDidAction:false,overtimeLastAction:null,
    morningWorkDone:false,eveningShiftDone:false,allnightShiftDone:false,eveningOtTried:false,phoneSwitchedThisSlot:false,
    allnightDay:false,noHomeReturnDay:false,partnerRecallResolved:false,
    partnerOutForFun:false,partnerPresenceRolled:false,partnerInviteOutChecked:false,partnerInviteOutResolved:false,playerCalledPartnerHome:false,
    partnerAllnightActive:false,partnerForcedAsleep:false,partnerAllnightStayedOut:false,allnightEndModalShown:false,eveningEndModalShown:false,partnerCatchUpSleep:false,allnightArrivalPending:false};
}
function dailySlotHoursLeft(){
  const d=game&&game.daily;return SLOT_HOURS_TOTAL-((d&&d.slotHoursUsed)||0);
}
function dailySlotHoursLabel(){
  const left=dailySlotHoursLeft(),used=SLOT_HOURS_TOTAL-left;
  return '本时段 <b>'+used+'</b>/'+SLOT_HOURS_TOTAL+'h · 剩 '+left+'h';
}
function resetDailySlotFlags(keepPartnerPresence){
  const d=ensureDailyState();if(!d)return;
  d.slotHoursUsed=0;d.slotSexUsed=false;d.slotMasturbateUsed=false;d.slotSnackUsed=false;
  d.slotActivity=null;d.inOvertime=false;d.phoneSwitchedThisSlot=false;
  if(!keepPartnerPresence){
    d.partnerPresenceRolled=false;
    d.partnerOutForFun=false;
    d.partnerInviteOutChecked=false;
    d.partnerInviteOutResolved=false;
    d.playerCalledPartnerHome=false;
    d._partnerPresencePhase=null;
  }
}
function dailySlotBlocked(){return dailySlotHoursLeft()<=0}
function dailyCanUseHours(h){
  h=h||1;
  if(dailySlotHoursLeft()<h){addLog('本时段只剩 '+dailySlotHoursLeft()+'h，无法安排 '+h+'h','fail');return false}
  return true;
}
function maybePartnerSleepOnAllnightDevilStart(prevUsed,newUsed){
  const d=game&&game.daily;
  if(!d||d.phase!=='allnight')return;
  if(prevUsed>=ALLNIGHT_DEVIL_HOURS_START||newUsed<ALLNIGHT_DEVIL_HOURS_START)return;
  if(!game.married||game.divorced)return;
  if(d.partnerAllnightStayedOut||d.partnerAllnightActive)return;
  if(game.longDistance){
    if(typeof ensureLongDistancePartnerPresence==='function')ensureLongDistancePartnerPresence('allnight');
    if(d.partnerOutForFun)return;
  }else if(typeof isPartnerOutForFun==='function'&&isPartnerOutForFun('allnight'))return;
  if(typeof setPartnerAllnightAsleep==='function')setPartnerAllnightAsleep();
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  addLog('🌈 进入通宵后段 · '+pn+' 入睡了','info');
}
function dailyAddHours(h,jumpNextPhase){
  const d=ensureDailyState();if(!d)return;
  const prev=d.slotHoursUsed||0;
  d.slotHoursUsed=Math.min(SLOT_HOURS_TOTAL,(d.slotHoursUsed||0)+h);
  maybePartnerSleepOnAllnightDevilStart(prev,d.slotHoursUsed);
  if(jumpNextPhase||d.slotHoursUsed>=SLOT_HOURS_TOTAL)dailyAdvanceAfterSlotAction();
  else renderDailyPanel();
}
function dailyUseMainActivity(){
  const d=ensureDailyState();
  if(d.slotHoursUsed>0){addLog('本时段已在安排其他事（已用 '+d.slotHoursUsed+'h）','fail');return false}
  d.slotHoursUsed=SLOT_HOURS_TOTAL;
  return true;
}
function dailyReleaseMainActivity(){
  const d=ensureDailyState();if(d&&d.slotHoursUsed<SLOT_HOURS_TOTAL)d.slotHoursUsed=0;
}
function dailyAdvanceAfterSlotAction(){
  const ph=game.daily&&game.daily.phase;
  if(ph==='morning'){
    if(shouldMarkWorkSkipNow())markWorkSkipForPhase();
    advanceDailyPhase('evening');
    return;
  }
  else if(ph==='evening'){
    const d=game.daily;
    if(d)d.slotHoursUsed=SLOT_HOURS_TOTAL;
    addLog('🌙 今晚 '+SLOT_HOURS_TOTAL+'h 已过，请选择睡觉或进入后半夜','warn');
    renderDailyPanel();updateUI();
    setTimeout(function(){if(typeof showEveningEndChoiceModal==='function')showEveningEndChoiceModal()},60);
    return;
  }else if(ph==='allnight'){
    const d=game.daily;
    if((d.slotHoursUsed||0)>=SLOT_HOURS_TOTAL){
      if(d.subMenu)d.subMenu=null;
      addLog('🌙 本通宵 '+SLOT_HOURS_TOTAL+'h 已用尽，请选择作息','warn');
      renderDailyPanel();updateUI();
      setTimeout(function(){if(typeof showAllnightExhaustedModal==='function')showAllnightExhaustedModal()},60);
      return;
    }
    renderDailyPanel();updateUI();
  }else renderDailyPanel();
}
function isPlayerWorkingNow(){
  if(!game||!game.daily)return false;
  if(game.daily.inOvertime)return true;
  const act=game.daily.slotActivity;
  return act==='work'||act==='overtime';
}
function isPlayerAtHomeNow(ph){
  if(!game)return true;
  ph=ph||(game.daily&&game.daily.phase)||'morning';
  if(game.daily&&game.daily.slotActivity==='out')return false;
  if(isPlayerWorkingNow())return false;
  if(typeof isPlayerAwayFromPartner==='function'&&isPlayerAwayFromPartner())return false;
  return true;
}
function dailyStdHospitalVisit(){
  if(typeof playerStdHospitalVisit==='function')playerStdHospitalVisit();
}
function dailyZoneOut(){
  const d=ensureDailyState(),ph=d.phase;
  if(ph==='allnight'&&dailySlotBlocked()){addLog('本后半夜 '+SLOT_HOURS_TOTAL+'h 已满，请选择作息','fail');return}
  if(shouldMarkWorkSkipNow())markWorkSkipForPhase();
  d.slotHoursUsed=SLOT_HOURS_TOTAL;
  d.subMenu=null;
  addStress(-1,'发呆 ');
  addLog('😶 发呆消磨时光 · 压力-1','info');
  dailyAdvanceAfterSlotAction();
  autoSaveSlot();
}
function continueDailyOpenCategory(menu){
  const d=ensureDailyState();
  if((menu==='out'||menu==='home')&&shouldMarkWorkSkipNow())markWorkSkipForPhase();
  d.subMenu=menu;
  renderDailyPanel();
}
function resetPartnerRecallFlag(){
  const d=game&&game.daily;
  if(d)d.partnerRecallResolved=false;
}
function isAllnightDevilHours(){
  const d=game&&game.daily;
  if(d&&d.allnightArrivalPending)return false;
  return !!(d&&d.phase==='allnight'&&(d.slotHoursUsed||0)>=ALLNIGHT_DEVIL_HOURS_START);
}
function allnightBtnLabel(label){
  return label;
}
function isAllnightGoldenHours(){
  const d=game&&game.daily;
  if(!d||d.phase!=='allnight'||d.allnightArrivalPending)return false;
  if((d.slotHoursUsed||0)>=SLOT_HOURS_TOTAL)return false;
  return !isAllnightDevilHours();
}
function renderAllnightSleepRows(leftA,exhausted){
  let h='';
  if(isAllnightGoldenHours()){
    h+='<div class="allnight-sleep-row"><button class="btn btn-primary btn-allnight-plain" onclick="allnightQuickNap()">😴 赶紧睡（+1压力·→次日清晨）</button></div>';
  }
  if(exhausted){
    h+=renderAllnightPartnerChoiceHint();
    h+='<div class="allnight-sleep-row">';
    h+='<button class="btn btn-warn btn-allnight-plain" onclick="finishAllnightNoSleep()">☀ 通宵不睡（硬撑到次日白天）</button>';
    h+='<button class="btn btn-primary btn-allnight-plain" onclick="finishAllnightSleepThrough()">😴 睡过白天（→第二天晚上）</button>';
    h+='</div>';
  }
  return h;
}
function companionAllnightEndChoiceLabel(choice){
  return choice==='sleep'?'😴 第二天白天补觉':'☀ 通宵不睡';
}
function ensureCompanionEndChoicePreview(){
  if(typeof isPartnerAllnightSleeping==='function'&&isPartnerAllnightSleeping())return 'sleep';
  if(game._companionSleepChoice!=null)return game._companionSleepChoice;
  const c=rollCompanionSleepChoice();
  game._companionSleepChoice=c;
  return c;
}
function renderAllnightPartnerChoiceHint(){
  const d=game&&game.daily;
  if(!d||d.phase!=='allnight'||dailySlotHoursLeft()>0)return '';
  if(!game.married||game.divorced||game.longDistance)return '';
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  if(typeof isPartnerAllnightSleeping==='function'&&isPartnerAllnightSleeping()){
    return '<p style="color:var(--muted);font-size:.72rem;margin:6px 0 0">'+pn+'：😴 睡梦中（你选作息后自动随行）</p>';
  }
  const c=ensureCompanionEndChoicePreview();
  const outNote=(d.partnerAllnightStayedOut||d.partnerOutForFun)?' · 在外面玩了一宿':'';
  return '<p style="color:var(--orange);font-size:.72rem;margin:6px 0 0">'+pn+' 的选择：<b>'+companionAllnightEndChoiceLabel(c)+'</b>'+outNote+'</p>';
}
function resolvePartnerAllnightEndChoice(){
  if(!game.married||game.divorced||game.longDistance)return null;
  const compChoice=ensureCompanionEndChoicePreview();
  game._companionSleepChoice=null;
  resolveCompanionSleepChoice(compChoice);
  return compChoice;
}
function showAllnightExhaustedModal(){
  const d=game&&game.daily;
  if(!d||d.phase!=='allnight'||(d.slotHoursUsed||0)<SLOT_HOURS_TOTAL)return;
  if(d.allnightEndModalShown)return;
  d.allnightEndModalShown=true;
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const hasPartner=!!(game.married&&!game.divorced&&!game.longDistance);
  let partnerHtml='';
  if(hasPartner){
    if(typeof isPartnerAllnightSleeping==='function'&&isPartnerAllnightSleeping()){
      partnerHtml='<p style="margin-top:8px">'+pn+'：<b>😴 睡梦中</b>（你选作息后自动随行）</p>';
    }else{
      const compChoice=ensureCompanionEndChoicePreview();
      const outNote=(d.partnerAllnightStayedOut||d.partnerOutForFun)?' · 在外面玩了一宿':'';
      partnerHtml='<p style="margin-top:8px">'+pn+' 的选择：<b>'+companionAllnightEndChoiceLabel(compChoice)+'</b>'+outNote+'</p>';
    }
  }
  showConsumeModal({
    icon:'🌙',title:'通宵 8h 已用尽',
    html:'必须做出选择，才能继续。<br><span class="fold-meta">连续通宵不睡有猝死风险</span>'+partnerHtml,
    buttons:[
      {text:'😴 睡过白天（→第二天晚上）',primary:true,fn:'confirmAllnightEndChoice("sleep")'},
      {text:'☀ 通宵不睡（硬撑到次日白天）',fn:'confirmAllnightEndChoice("nosleep")'}
    ]
  });
}
function confirmAllnightEndChoice(playerChoice){
  closeConsumeModal();
  const d=game.daily;
  if(d)d.allnightEndModalShown=false;
  if(d){d.subMenu=null;d.noHomeReturnDay=false}
  if(playerChoice==='sleep')finishAllnightSleepThrough();
  else finishAllnightNoSleep();
  autoSaveSlot();
}
function dailyAllnightWrapClass(phase){
  if(phase!=='allnight')return '';
  const d=game&&game.daily;
  if(d&&d.allnightArrivalPending)return '';
  return isAllnightDevilHours()?' daily-allnight-devil':' daily-allnight-gold';
}
function allnightPartnerSleepChoiceApplies(){
  const d=game&&game.daily;
  if(!d||d.phase!=='allnight'||!isAllnightDevilHours())return false;
  if(isWeekendDay(d.dayIndex))return false;
  return !!(game.married&&!game.divorced);
}
function allnightQuickNap(){
  const d=ensureDailyState();
  if(!d||d.phase!=='allnight')return;
  if(!isAllnightGoldenHours()){
    addLog('金色时段外不能赶紧睡；彩虹时段请用完时间后再选作息','fail');
    return;
  }
  if(!bumpDayAfterAllnight())return;
  setAllnightStreak(0);
  d.allnightEndModalShown=false;
  d.partnerAllnightActive=false;
  d.partnerForcedAsleep=false;
  d.partnerAllnightStayedOut=false;
  d.phase='morning';
  d.workedToday=false;
  d.subMenu=null;
  d.noHomeReturnDay=false;
  addStress(1,'赶紧睡 ');
  resetPartnerRecallFlag();
  addLog('😴 赶紧睡 · 压力+1 · 次日清晨醒来','info');
  renderDailyPanel();updateUI();autoSaveSlot();
}
function applyPartnerCatchUpSleepIfEligible(compChoice){
  const d=ensureDailyState();
  if(!d)return;
  d.partnerCatchUpSleep=false;
  if(!game.married||game.divorced||game.longDistance)return;
  if(compChoice!=='sleep')return;
  if(d.partnerForcedAsleep)return;
  if(!d.partnerAllnightActive)return;
  if(d.partnerAllnightStayedOut)return;
  if(typeof isPartnerOutForFun==='function'&&isPartnerOutForFun('allnight'))return;
  d.partnerCatchUpSleep=true;
}
function maybePartnerRecall(onProceed,placeLabel){
  if(!game||!game.married||game.divorced||game.longDistance)return false;
  if(placeLabel==='约会')return false;
  const d=game.daily;
  if(!d)return false;
  const ph=d.phase;
  if(ph!=='evening'&&ph!=='allnight')return false;
  if(typeof isSpouseAtHome==='function'&&!isSpouseAtHome(ph))return false;
  if(typeof isPartnerOutForFun==='function'&&isPartnerOutForFun(ph))return false;
  if(d.partnerRecallResolved)return false;
  if(Math.random()>=0.25)return false;
  d.partnerRecallResolved=true;
  game._partnerRecallOnProceed=onProceed;
  game._partnerRecallPlace=placeLabel||'';
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const where=placeLabel?('（你正要去'+placeLabel+'）'):'';
  showConsumeModal({
    icon:'📞',title:pn+'打来电话',
    html:pn+'希望你早点回家…'+where,
    buttons:[
      {text:'回去（亲+1 · 压力+1）',primary:true,fn:'confirmPartnerRecall(true)'},
      {text:'不回去（亲-1 · 压力-1）',fn:'confirmPartnerRecall(false)'}
    ]
  });
  return true;
}
function confirmPartnerRecall(goHome){
  closeConsumeModal();
  const onProceed=game._partnerRecallOnProceed;
  game._partnerRecallOnProceed=null;
  const place=game._partnerRecallPlace;
  game._partnerRecallPlace=null;
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const d=game.daily;
  if(goHome){
    adjustSpouseIntimacy(1);
    addStress(1,'伴侣召回 ');
    if(d){
      d.noHomeReturnDay=false;
      d.slotActivity=null;
      d.partnerOutForFun=false;
      const commute=Math.min(PARTNER_RECALL_HOME_HOURS,dailySlotHoursLeft());
      if(commute>0){
        const prevH=d.slotHoursUsed||0;
        d.slotHoursUsed=Math.min(SLOT_HOURS_TOTAL,prevH+commute);
        maybePartnerSleepOnAllnightDevilStart(prevH,d.slotHoursUsed);
      }
      d.subMenu='home';
      addLog('📞 听'+pn+'的话回家 · 路上'+commute+'h · 亲密度+1 · 压力+1 · 剩 '+dailySlotHoursLeft()+'h','info');
    }else{
      addLog('📞 听'+pn+'的话回家 · 亲密度+1 · 压力+1','info');
    }
    renderDailyPanel();
    autoSaveSlot();
    return;
  }
  adjustSpouseIntimacy(-1);
  addStress(-1,'拒回家 ');
  if(d)d.noHomeReturnDay=true;
  addLog('📞 没理会'+pn+' · 亲密度-1 · 压力-1'+(place?' · 仍去'+place:''),'warn');
  if(typeof onProceed==='function'){
    game._afterPartnerRecallRefuse=true;
    setTimeout(function(){
      try{onProceed()}finally{game._afterPartnerRecallRefuse=false}
    },0);
  }
}
function rollCompanionSleepChoice(){
  if(typeof isCompanionWorkSlot==='function'&&isCompanionWorkSlot('morning')&&game.companion&&game.companion.employed){
    return Math.random()<0.42?'sleep':'nosleep';
  }
  return Math.random()<0.32?'nosleep':'sleep';
}
function resolveCompanionSleepChoice(choice){
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const d=game.daily;
  game.lastCompanionAllnightSleepChoice=choice;
  if(choice==='sleep'){
    if(typeof isCompanionWorkSlot==='function'&&isCompanionWorkSlot('morning')&&game.companion&&game.companion.employed){
      game.companion.weekWorkSkipDays=(game.companion.weekWorkSkipDays||0)+1;
      addLog('💼 '+pn+'睡过头，明天白天旷工（本周第'+game.companion.weekWorkSkipDays+'天）','warn');
    }
    setCompanionAllnightStreak(0);
    addLog('😴 '+pn+'选择第二天白天补觉','info');
    return;
  }
  const streak=getCompanionAllnightStreak()+1;
  setCompanionAllnightStreak(streak);
  addLog('☀ '+pn+'选择通宵不睡硬撑（连续 '+streak+' 天）','warn');
  if(rollAllnightSuddenDeath(streak)){
    addLog('💀 '+pn+'连续通宵未睡，猝死','fail');
    addStress(25,'伴侣猝死 ');
    if(typeof adjustSpouseIntimacy==='function')adjustSpouseIntimacy(-30);
    if(game.companion){
      if(game.companion.employed&&game.companion.employment&&typeof runAsCompanion==='function'&&typeof recordCareerHistory==='function'){
        runAsCompanion(()=>recordCareerHistory(game.employment));
      }
      game.companion.employed=false;
      game.companion.employment=null;
      game.companion.layoffs=(game.companion.layoffs||0)+1;
    }
    if(typeof queueStatusModal==='function'){
      queueStatusModal('伴侣猝死',pn+'因连续通宵未睡，在清晨倒下。','💀');
    }
  }
}
function showCoupleSleepChoiceModal(forPartnerOnly){
  const compChoice=rollCompanionSleepChoice();
  game._companionSleepChoice=compChoice;
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const compLabel=compChoice==='sleep'?'😴 睡过白天':'☀ 通宵不睡硬撑';
  const html=forPartnerOnly
    ?('🌈 深夜后段 · '+pn+' 接下来只能：<b>'+compLabel+'</b>（工作日可能旷工/猝死风险）')
    :('你和 '+pn+' 都要决定接下来的作息。<br><span class="fold-meta">伴侣（AI）倾向：'+compLabel+'</span>');
  showConsumeModal({
    icon:'🌈',title:forPartnerOnly?'伴侣的作息':'今夜怎么过',
    html:html,
    buttons:forPartnerOnly?[
      {text:'知道了',primary:true,fn:'closeConsumeModal();confirmPartnerOnlySleepChoice()'}
    ]:[
      {text:'😴 入睡（睡过白天→晚上）',primary:true,fn:'confirmCoupleSleepChoice("sleep")'},
      {text:'☀ 通宵不睡（硬撑进入白天）',fn:'confirmCoupleSleepChoice("nosleep")'}
    ]
  });
}
function confirmPartnerOnlySleepChoice(){
  const compChoice=game._companionSleepChoice||'sleep';
  game._companionSleepChoice=null;
  resolveCompanionSleepChoice(compChoice);
  renderDailyPanel();updateUI();
}
function confirmCoupleSleepChoice(playerChoice){
  closeConsumeModal();
  const compChoice=game._companionSleepChoice||'sleep';
  game._companionSleepChoice=null;
  resolveCompanionSleepChoice(compChoice);
  const d=game.daily;
  if(d){
    d.subMenu=null;
    d.noHomeReturnDay=false;
  }
  if(playerChoice==='sleep'){
    finishAllnightSleepThrough();
  }else{
    finishAllnightNoSleep();
  }
  autoSaveSlot();
}
function maybePromptAllnightPartnerSleepChoice(){}
function maybePromptCoupleSleepChoiceAfterSex(){}
function tickAllnightNoReturnIntimacy(){
  if(!game||!game.married||game.divorced||game.longDistance)return;
  const d=game.daily;
  if(!d||!d.allnightDay||!d.noHomeReturnDay)return;
  if(typeof adjustSpouseIntimacy==='function')adjustSpouseIntimacy(-1,'通宵未归 ');
  addLog('💔 通宵一天未回家 · 亲密度-1','warn');
  d.noHomeReturnDay=false;
}
function getEmploymentOtProfile(){
  if(!game||!game.employed||!game.employment)return null;
  if(game.employment.otProfile)return game.employment.otProfile;
  const t=game.employment.tier||'mid';
  if(typeof legacyOvertimeProfile==='function'){
    const job=currentJob();
    return legacyOvertimeProfile(t,game.employment.importance,game.employment.roleExtra,game.employment.company,job);
  }
  return{forcedEveningProb:t==='high'?0.74:t==='mid'?0.44:0.30,otPayProb:t==='high'?0.58:t==='mid'?0.40:0.24,otPayMult:1,otLabel:t==='high'?'加班常态化':t==='mid'?'周末偶尔加班':'加班费不稳定'};
}
function fmtOtPct(p){return Math.round((p||0)*100)+'%'}
function getMonthlyAbsenceMonthKey(){
  if(typeof getLedgerMonthKey==='function')return getLedgerMonthKey(game.week);
  return Math.max(1,Math.ceil((game.week||0)/(typeof WEEKS_PER_MONTH!=='undefined'?WEEKS_PER_MONTH:4)));
}
function ensureMonthlyAbsenceMonth(){
  const mk=getMonthlyAbsenceMonthKey();
  if(game.monthlyAbsenceMonthKey!==mk){
    game.monthlyAbsenceMonthKey=mk;
    game.monthlyAbsenceCount=0;
  }
}
function monthlyAbsencesLeft(){
  ensureMonthlyAbsenceMonth();
  return Math.max(0,MONTHLY_ABSENCE_LIMIT-(game.monthlyAbsenceCount||0));
}
function recordMonthlyAbsence(label){
  ensureMonthlyAbsenceMonth();
  game.monthlyAbsenceCount=(game.monthlyAbsenceCount||0)+1;
  const n=game.monthlyAbsenceCount;
  addLog('📛 旷工'+(label?' · '+label:'')+' · 本月 '+n+'/'+MONTHLY_ABSENCE_LIMIT,'warn');
  if(n>MONTHLY_ABSENCE_LIMIT)addLog('⚠ 本月旷工已超过 '+MONTHLY_ABSENCE_LIMIT+' 次','fail');
}
function appendOvertimeActionNote(line){
  const ms=document.getElementById('consumeMsg');
  if(!ms||!line)return;
  ms.innerHTML=ms.innerHTML+'<p style="margin-top:8px;font-size:.78rem">'+line+'</p>';
}
function buildOvertimeModalButtons(){
  const d=game.daily;
  const buttons=[
    {text:'摸鱼（压力-1 · 裁员风险↑）',handler:overtimeSlack},
    {text:'拼命（压力+1 · 可能加班费）',handler:overtimeGrind},
    {text:'📞 给伴侣打电话（可不打）',handler:overtimeCallSpouse}
  ];
  if(d&&d.overtimeDidAction){
    buttons.push({text:'收工',primary:true,handler:requestFinishOvertime});
  }
  return buttons;
}
function showOvertimeChoiceModal(){
  const d=ensureDailyState();
  const ot=getEmploymentOtProfile();
  d.inOvertime=true;
  d.slotActivity='overtime';
  const hint=ot?'<p class="fold-meta" style="margin:0 0 6px">本岗：'+ot.otLabel+' · 加班费概率约 '+fmtOtPct(ot.otPayProb)+'</p>':'';
  const doneNote=d.overtimeDidAction?'<p class="fold-meta" style="margin:6px 0 0">摸鱼或拼命后可点收工</p>':'<p class="fold-meta" style="margin:6px 0 0">先摸鱼或拼命，再收工；电话可打可不打</p>';
  const html=hint+'你在公司加班。'+doneNote;
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({icon:'🏢',title:'加班中',html:html,buttons:buildOvertimeModalButtons()});
    return;
  }
  const legacy=buildOvertimeModalButtons().map(b=>({
    text:b.text,primary:b.primary,
    fn:b.handler===overtimeSlack?'overtimeSlack()':b.handler===overtimeGrind?'overtimeGrind()':b.handler===overtimeCallSpouse?'overtimeCallSpouse()':'requestFinishOvertime()'
  }));
  showConsumeModal({icon:'🏢',title:'加班中',html:html,buttons:legacy});
}
function overtimeSlack(){
  const d=ensureDailyState();
  if(!d||!d.inOvertime)return;
  addStress(-1,'摸鱼 ');
  d.overtimeSlack=(d.overtimeSlack||0)+1;
  d.overtimeDidAction=true;
  d.overtimeLastAction='slack';
  addLog('🐟 加班摸鱼 · 压力-1 · 被裁风险上升','warn');
  appendOvertimeActionNote('<span style="color:var(--green)">🐟 摸了一会儿鱼，压力减轻了些（可继续选其他操作或收工）</span>');
  showOvertimeChoiceModal();
}
function overtimeGrind(){
  const d=ensureDailyState();
  if(!d||!d.inOvertime)return;
  addStress(1,'拼命 ');
  d.overtimeDidAction=true;
  d.overtimeLastAction='grind';
  const ot=getEmploymentOtProfile();
  const payProb=ot?ot.otPayProb:0.42;
  const payMult=ot?ot.otPayMult||1:1;
  let note='💼 认真加了一会儿班';
  if(Math.random()<payProb){
    const bonus=Math.round((200+Math.floor(Math.random()*1200))*payMult);
    game.cash+=bonus;game.money+=bonus;
    addLog('💰 加班费 ¥'+bonus.toLocaleString(),'success');
    note='<span style="color:var(--green)">💰 拿到加班费 ¥'+bonus.toLocaleString()+'</span>';
  }else addLog('💼 拼命加班，没有额外报酬','info');
  appendOvertimeActionNote(note+'（可继续选其他操作或收工）');
  showOvertimeChoiceModal();
}
function overtimeCallSpouse(){
  const d=ensureDailyState();
  if(!d||!d.inOvertime)return;
  const c=game.contacts&&game.contacts.find(x=>x.id===(typeof CORE_CONTACT_IDS!=='undefined'?CORE_CONTACT_IDS.spouse:'core_spouse')||x.kind==='spouse');
  if(c&&typeof callSpouse==='function'){
    game._resumeOvertimeAfterModal=true;
    callSpouse(c,true);
  }else addLog('找不到伴侣联系人','fail');
}
function requestFinishOvertime(){
  const d=ensureDailyState();
  if(!d||!d.inOvertime)return;
  if(!d.overtimeDidAction){addLog('至少先摸鱼或拼命一会儿再收工','fail');return}
  const wk=isWeekendDay(d.dayIndex);
  if(!wk&&Math.random()<OT_SOCIAL_PROB){
    game._overtimeFinishPending=true;
    closeConsumeModal(true);
    showWeekdaySocialChoiceModal();
    return;
  }
  completeOvertimeEnd();
}
function finishOvertimeEveningFull(label){
  const d=ensureDailyState();
  d.inOvertime=false;
  d.slotActivity=null;
  d.slotHoursUsed=SLOT_HOURS_TOTAL;
  addLog(label||('🚪 收工回家 · 今晚 '+SLOT_HOURS_TOTAL+'h 已用尽'),'info');
  renderDailyPanel();updateUI();autoSaveSlot();
  setTimeout(function(){if(typeof showEveningEndChoiceModal==='function')showEveningEndChoiceModal()},80);
}
function finishOvertimeSlackSocial(){
  if(game)game._eveningEndAfterSlackSocial=true;
  finishOvertimeEveningFull('🍻 摸鱼收工后参加联谊 · 今晚最后 2h 已过');
}
function finishOvertimeEveningPartial(){
  const d=ensureDailyState();
  d.inOvertime=false;
  d.slotActivity=null;
  d.slotHoursUsed=OT_SOCIAL_PARTIAL_HOURS;
  addLog('🚪 收工回家 · 今晚剩 '+dailySlotHoursLeft()+'h','info');
  renderDailyPanel();updateUI();autoSaveSlot();
}
function showOvertimeAllnightArrivalModal(){
  const d=game&&game.daily;
  if(!d||!d.allnightArrivalPending)return;
  const html='拼命加班后的联谊已在<b>金色时段</b>结束，回到家已是后半夜。<br><span class="fold-meta">赶紧睡 → 次日清晨；通宵 → 彩虹时段（宅家/通讯录，不可外出）</span>';
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:'🌃',title:'后半夜到家',
      html:html,
      buttons:[
        {text:'😴 赶紧睡（次日清晨 · +1压力）',primary:true,handler:function(){confirmOvertimeAllnightArrival('sleep')}},
        {text:'🌈 通宵（彩虹时段 · 剩4h）',handler:function(){confirmOvertimeAllnightArrival('stayup')}}
      ]
    });
    return;
  }
  showConsumeModal({
    icon:'🌃',title:'后半夜到家',html:html,
    buttons:[
      {text:'😴 赶紧睡（次日清晨 · +1压力）',primary:true,fn:'confirmOvertimeAllnightArrival("sleep")'},
      {text:'🌈 通宵（彩虹时段 · 剩4h）',fn:'confirmOvertimeAllnightArrival("stayup")'}
    ]
  });
}
function confirmOvertimeAllnightArrival(choice){
  closeConsumeModal(true);
  const d=ensureDailyState();
  if(!d||!d.allnightArrivalPending)return;
  d.allnightArrivalPending=false;
  d.allnightEndModalShown=false;
  if(choice==='sleep'){
    setAllnightStreak(0);
    d.allnightDay=false;
    d.partnerAllnightActive=false;
    d.partnerForcedAsleep=false;
    d.partnerAllnightStayedOut=false;
    resetPartnerRecallFlag();
    resetDailySlotFlags();
    if(!bumpDayAfterAllnight()){renderDailyPanel();updateUI();autoSaveSlot();return}
    d.phase='morning';
    d.workedToday=false;
    d.subMenu=null;
    d.noHomeReturnDay=false;
    addStress(1,'赶紧睡 ');
    addLog('😴 赶紧睡 · 次日清晨醒来','info');
    renderDailyPanel();updateUI();autoSaveSlot();
    return;
  }
  d.allnightDay=true;
  d.slotHoursUsed=ALLNIGHT_DEVIL_HOURS_START;
  addLog('🌈 选择通宵 · 进入彩虹时段（剩 '+dailySlotHoursLeft()+'h · 不可外出）','warn');
  renderDailyPanel();updateUI();autoSaveSlot();
}
function finishOvertimeAllnight(){
  const d=ensureDailyState();
  d.inOvertime=false;
  d.slotActivity=null;
  d.phase='allnight';
  d.allnightDay=true;
  d.allnightArrivalPending=true;
  d.slotHoursUsed=ALLNIGHT_DEVIL_HOURS_START;
  d.allnightEndModalShown=false;
  addLog('🌃 拼命加班联谊（金色时段）结束 · 回到家后半夜','warn');
  renderDailyPanel();updateUI();autoSaveSlot();
  setTimeout(function(){if(typeof showOvertimeAllnightArrivalModal==='function')showOvertimeAllnightArrivalModal()},80);
}
function applyOvertimeSocialEnd(lastAction){
  if(lastAction==='grind')finishOvertimeAllnight();
  else finishOvertimeSlackSocial();
}
function completeOvertimeEnd(){
  const d=ensureDailyState();
  if(!d)return;
  closeConsumeModal(true);
  if(d.overtimeLastAction==='grind')finishOvertimeEveningFull();
  else finishOvertimeEveningPartial();
}
function showEveningEndChoiceModal(){
  const d=game&&game.daily;
  if(!d||d.phase!=='evening')return;
  if(d.eveningEndModalShown)return;
  d.eveningEndModalShown=true;
  const fromSlackSocial=!!(game&&game._eveningEndAfterSlackSocial);
  if(game)game._eveningEndAfterSlackSocial=false;
  const html=fromSlackSocial
    ? '摸鱼收工后联谊结束，今晚已过，<b>尚未进入后半夜</b>。<br><span class="fold-meta">睡觉，或不睡进入后半夜（金色时段）</span>'
    : '今晚的 <b>8</b> 小时已过完。<br><span class="fold-meta">接下来怎么安排？</span>';
  showConsumeModal({
    icon:'🌙',title:fromSlackSocial?'联谊后回家':'夜深了',
    html:html,
    buttons:[
      {text:'😴 睡觉（次日白天）',primary:true,fn:'confirmEveningEndChoice("sleep")'},
      {text:'🌙 不睡，进入后半夜（+8h · 压力+10）',fn:'confirmEveningEndChoice("allnight")'}
    ]
  });
}
function confirmEveningEndChoice(choice){
  closeConsumeModal();
  const d=game.daily;
  if(d)d.eveningEndModalShown=false;
  if(choice==='sleep')finishDay('sleep');
  else finishDay('allnight');
  autoSaveSlot();
}
function showWorkOffModal(title,extraHtml){
  const job=game.employed&&game.employment?game.market[game.employment.jobIdx]:null;
  const co=game.employment&&game.employment.company;
  const html=(extraHtml||'今天的工作结束了。')+
    (job?'<br><b>'+job.title+'</b>'+(co?' @ '+co.name:'') :'')+
    '<br><span class="fold-meta">离开公司后进入下一时段</span>';
  showConsumeModal({
    icon:'🌆',title:title||'下班了',
    html:html,
    buttons:[{text:'离开公司',primary:true,fn:'closeConsumeModal();dailyAdvanceAfterSlotAction();autoSaveSlot()'}]
  });
}
function finishWorkShift(){
  closeConsumeModal();
  if(game&&game.daily){
    game.daily.slotActivity=null;
    game.daily.inOvertime=false;
  }
  showWorkOffModal('下班了','打卡下班，收拾东西准备离开。');
}
function showWorkShiftModal(useOvertimeFlow){
  if(useOvertimeFlow){
    const d=ensureDailyState();
    d.overtimeDidAction=false;
    d.overtimeLastAction=null;
    showOvertimeChoiceModal();
    return;
  }
  const job=game.employed&&game.employment?game.market[game.employment.jobIdx]:null;
  const co=game.employment&&game.employment.company;
  if(!job){dailyAdvanceAfterSlotAction();return}
  showConsumeModal({
    icon:'💼',title:'上班中',
    html:'<b>'+job.title+'</b>'+(co?' @ '+co.name:'')+'<br><span class="fold-meta">处理手头工作，忙完点下班</span>',
    buttons:[{text:'下班',primary:true,fn:'finishWorkShift()'}]
  });
}
function dailyRunScrollSessions(fn,hours){
  const c=ensureConsumption();if(!c)return '';
  hours=Math.max(1,Math.floor(hours)||1);
  let html='';
  if(fn==='consumeShortVideo'){
    const tot={boring:0,trash:0,interesting:0,stressUp:0,stressDown:0};
    for(let i=0;i<hours;i++){const r=runShortVideoSession(c);tot.boring+=r.boring;tot.trash+=r.trash;tot.interesting+=r.interesting;tot.stressUp+=r.stressUp;tot.stressDown+=r.stressDown}
    html='刷 <b>'+hours+'</b> 小时 · 共 '+(hours*SV_VIEWS_PER_CLICK)+' 条<br>无聊 '+tot.boring+' · 垃圾 '+tot.trash+' · 有趣 '+tot.interesting;
    if(tot.stressUp)html+='<br><b>压力 +'+tot.stressUp+'</b>';
    if(tot.stressDown)html+='<br><b>减压 '+Math.abs(tot.stressDown)+'</b>';
    addLog('📱 刷短视频 '+hours+'h','info');
  }else if(fn==='consumeShortDrama'){
    let fin=0,cl=0,sd=0;
    for(let i=0;i<hours;i++){const r=runShortDramaSession(c);if(r.isFinale)fin++;cl+=r.cliff;sd+=r.stressDown}
    html='看 <b>'+hours+'</b> 集 · 大结局 '+fin+' · 断章加压 '+cl;
    if(sd)html+='<br><b>减压 '+Math.abs(sd)+'</b>';
    addLog('📺 刷短剧 '+hours+'h','info');
  }else if(fn==='consumeFlirt'){
    const tot={hot:0,silent:0,awkward:0,people:0};
    for(let i=0;i<hours;i++){const r=runFlirtSession(c);tot.hot+=r.hot;tot.silent+=r.silent;tot.awkward+=r.awkward;tot.people+=r.people}
    html='聊 <b>'+(hours*FLIRT_CHATS_PER_SESSION)+'</b> 人 · 火热 '+tot.hot+' · 尬聊 '+tot.awkward;
    addLog('💬 聊骚 '+hours+'h','info');
  }else if(fn==='consumeMobileGame'){
    let w=0,l=0,ad=0;
    for(let i=0;i<hours;i++){
      c.mobileGames=(c.mobileGames||0)+1;
      const win=Math.random()<mobileWinChance(c.mobileGames);
      if(win){addStress(-1,'手游胜 ');w++}else{addStress(1,'手游负 ');l++}
      ad+=watchMobileAd(c);
    }
    html='玩 <b>'+hours+'</b> 小时 · '+w+'胜'+l+'负'+(ad?'<br>广告压力 +'+ad:'');
    addLog('🎮 手游 '+hours+'h','info');
  }
  return html;
}
function dailyLeisureScroll(fn,hours){
  hours=Math.max(1,Math.floor(hours)||1);
  if(phoneBlocksHomeLeisure()){
    addLog('经典诺基亚无法在家刷视频/游戏/聊骚/短剧','fail');
    return;
  }
  if(hours===SLOT_BATCH_HOURS){
    if(!dailyCanUseHours(SLOT_BATCH_HOURS))return;
    const html=dailyRunScrollSessions(fn,SLOT_BATCH_HOURS);
    dailyAddHours(SLOT_BATCH_HOURS,true);
    if(html)showConsumeModal({icon:'📱',title:'连刷8小时',html:html+'<br><span style="color:var(--green)">时段已满，进入下一时段</span>',buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
    if(fn==='consumeFlirt'&&typeof rollPartnerCaughtAffair==='function')rollPartnerCaughtAffair('flirt');
    return;
  }
  if(!dailyCanUseHours(1))return;
  const html=dailyRunScrollSessions(fn,1);
  dailyAddHours(1,false);
  if(html)showConsumeModal({icon:'📱',title:'1小时',html:html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
  if(fn==='consumeFlirt'&&typeof rollPartnerCaughtAffair==='function')rollPartnerCaughtAffair('flirt');
}
function snackEatModalHtml(title,playerR,partnerR){
  let html='<b>'+title+'</b><br>你：吃 <b>'+playerR.portions+'</b> 份';
  if(playerR.rebound)html+=' · 反弹 +'+playerR.rebound;
  html+=' · 减压 -'+playerR.relief;
  if(partnerR){
    html+='<br>伴侣：吃 <b>'+partnerR.portions+'</b> 份';
    if(partnerR.rebound)html+=' · 反弹 +'+partnerR.rebound;
    html+=' · 减压 -'+partnerR.relief+'<br>亲密度 +1';
  }
  html+='<br><span class="fold-meta">占用 1h · 每10压力+1份（最多6份）· 进食至少净减1压力</span>';
  return html;
}
function dailySnackBlocked(){
  const d=ensureDailyState();
  return !!(d&&d.slotSnackUsed);
}
function partnerAvatarHtml(gender,large){
  const em=gender==='male'?'👨🏻':'👩🏻';
  const cls=large?'avatar':'partner-em';
  return '<span class="'+cls+'" aria-hidden="true">'+em+'</span>';
}
function partnerLocTag(phase){
  if(!game||!game.married||game.divorced)return '';
  if(typeof ensurePartnerPresence==='function')ensurePartnerPresence(phase);
  const loc=typeof getSpouseLocationLabel==='function'?getSpouseLocationLabel(phase):'';
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  let h='<span class="daily-partner-inline">'+partnerAvatarHtml(game.partnerGender)+' '+pn+' · '+loc+'</span>';
  if(typeof isPartnerOutForFun==='function'&&isPartnerOutForFun(phase)&&!(game.daily&&game.daily.playerCalledPartnerHome)){
    h+=' <button class="btn" style="margin-left:6px;font-size:.68rem" onclick="callSpouseAskPartnerHomeFromDaily()">📞 叫回家</button>';
  }
  return h;
}
function renderPartnerInviteOutHint(){
  if(!game||!game.married||game.divorced)return '';
  const ph=game.daily&&game.daily.phase;
  if(typeof isPartnerOutForFun!=='function'||!isPartnerOutForFun(ph))return '';
  return '<p style="color:var(--yellow);font-size:.72rem">'+((game.partnerDisplayName)||'伴侣')+' 在外面玩 · 可能打电话约你出门</p>';
}
function maybePartnerInvitePlayerOut(){
  if(!game||!game.married||game.divorced||game.longDistance)return false;
  const d=game.daily;if(!d)return false;
  const ph=d.phase;
  if(ph!=='evening'&&ph!=='allnight')return false;
  if(d.partnerInviteOutChecked)return false;
  d.partnerInviteOutChecked=true;
  if(d.partnerInviteOutResolved||d.slotHoursUsed>0)return false;
  if(typeof isPartnerOutForFun!=='function'||!isPartnerOutForFun(ph))return false;
  if(typeof isPlayerAtHomeNow==='function'&&!isPlayerAtHomeNow(ph))return false;
  if(Math.random()>=0.3)return false;
  d.partnerInviteOutResolved=true;
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  showConsumeModal({
    icon:'📞',title:pn+'打来电话',
    html:pn+'在外面玩，喊你一起出去：「出来嘛，别老宅着！」<br><span class="fold-meta">出去：占满本时段 · 亲密度+1 · 伴侣压力-2<br>不去：亲密度-1 · 伴侣出轨几率↑</span>',
    buttons:[
      {text:'一起出去（占满时段）',primary:true,fn:'confirmPartnerInviteOut(true)'},
      {text:'不去',fn:'confirmPartnerInviteOut(false)'}
    ]
  });
  return true;
}
function confirmPartnerInviteOut(go){
  closeConsumeModal();
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const d=game.daily;
  if(go){
    if(!dailyUseMainActivity())return;
    adjustSpouseIntimacy(1);
    addStress(-1,'约会 ');
    if(typeof addCompanionStress==='function')addCompanionStress(-2);
    if(d){
      d.partnerOutForFun=false;
      d.noHomeReturnDay=false;
      d.slotActivity='out';
      d.subMenu=null;
      if(typeof markPartnerAllnightActive==='function')markPartnerAllnightActive();
    }
    addLog('💑 应'+pn+'之约一起外出（占满时段）','info');
    dailyAdvanceAfterSlotAction();
    autoSaveSlot();
    return;
  }
  adjustSpouseIntimacy(-1);
  if(typeof addCompanionStress==='function')addCompanionStress(2);
  if(typeof bumpPartnerAffairRisk==='function')bumpPartnerAffairRisk(0.14);
  addLog('📞 拒绝'+pn+'的邀约 · 亲密度-1','warn');
  renderDailyPanel();updateUI();
}
function schedulePartnerInviteOutCheck(){
  if(!game||game.gameOver)return;
  const d=game.daily;
  if(!d||d.dayIndex>=7||d.subMenu||d.slotHoursUsed>0)return;
  const ph=d.phase;
  if(ph!=='evening'&&ph!=='allnight')return;
  setTimeout(function(){maybePartnerInvitePlayerOut()},60);
}
function dailyEatSnackStock(){
  if(dailySnackBlocked()){addLog('本时段已吃过东西','fail');return}
  if(!dailyCanUseHours(1))return;
  const portions=snackPortionsForStress(game.familyStress);
  const stock=game.snackStock||0;
  if(stock<portions){
    addLog('囤货不足：需 '+portions+' 份，库存 '+stock+' 份','fail');
    return;
  }
  game.snackStock=stock-portions;
  const playerR=applySnackPortionsToPlayer(portions);
  ensureDailyState().slotSnackUsed=true;
  addLog('🍿 吃零食 ×'+portions+' 份（库存剩 '+game.snackStock+'）','info');
  showConsumeModal({
    icon:'🍿',title:'零食囤货 · 1小时',
    html:snackEatModalHtml('消耗囤货 '+portions+' 份（仅自己）',playerR,null),
    buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]
  });
  dailyAddHours(1,false);
  renderSpendingPanel();
}
function dailyEatSnackSingle(){
  if(dailySnackBlocked()){addLog('本时段已吃过东西','fail');return}
  if(!dailyCanUseHours(1))return;
  if(!spendCash(SNACK_MEAL_SINGLE_COST,'单人餐'))return;
  const portions=snackPortionsForStress(game.familyStress);
  const playerR=applySnackPortionsToPlayer(portions);
  ensureDailyState().slotSnackUsed=true;
  addLog('🍱 单人餐 ¥'+SNACK_MEAL_SINGLE_COST+' · 吃 '+portions+' 份','info');
  showConsumeModal({
    icon:'🍱',title:'单人餐 · 1小时',
    html:snackEatModalHtml('外卖单人餐 ¥'+SNACK_MEAL_SINGLE_COST+'（仅自己）',playerR,null),
    buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]
  });
  dailyAddHours(1,false);
}
function dailyEatSnackCouple(){
  if(dailySnackBlocked()){addLog('本时段已吃过东西','fail');return}
  if(!dailyCanUseHours(1))return;
  if(!game.married||game.divorced){addLog('仅已婚可点双人餐','fail');return}
  const ph=game.daily&&game.daily.phase;
  const coupleCheck=typeof canEatCoupleSnack==='function'?canEatCoupleSnack(ph):{ok:typeof isSpouseAtHome==='function'?isSpouseAtHome(ph):true,reason:'伴侣不在家，无法双人餐'};
  if(!coupleCheck.ok){addLog(coupleCheck.reason,'fail');return}
  if(!spendCash(SNACK_MEAL_COUPLE_COST,'双人餐'))return;
  const pPortions=snackPortionsForStress(game.familyStress);
  const partnerStress=game.companion?game.companion.familyStress:0;
  const sPortions=snackPortionsForStress(partnerStress);
  const playerR=applySnackPortionsToPlayer(pPortions);
  const partnerR=applySnackPortionsToPartner(sPortions);
  adjustSpouseIntimacy(1);
  ensureDailyState().slotSnackUsed=true;
  addLog('🍱 双人餐 ¥'+SNACK_MEAL_COUPLE_COST+' · 你'+pPortions+'份 · 伴侣'+sPortions+'份 · 亲密度+1','info');
  const afterMeal='closeConsumeModal()';
  showConsumeModal({
    icon:'🍱',title:'双人餐 · 1小时',
    html:snackEatModalHtml('外卖双人餐 ¥'+SNACK_MEAL_COUPLE_COST,playerR,partnerR),
    buttons:[{text:'知道了',primary:true,fn:afterMeal}]
  });
  dailyAddHours(1,false);
}
function clearDailySexReserve(){
  if(game&&game.daily)game.daily.slotSexUsed=false;
  game._dailySexPendingHours=0;
}
function makeLoveHomeSexBtnState(ph){
  const d=game.daily||{};
  const block=typeof getMakeLoveBlockReason==='function'?getMakeLoveBlockReason(false):null;
  const disabled=!!(d.slotSexUsed||dailySlotHoursLeft()<2||block);
  let hint='';
  if(block&&!d.slotSexUsed&&dailySlotHoursLeft()>=2){
    if(block.indexOf('睡梦中')>=0)hint=' · 伴侣睡梦中';
    else if(/伴侣|上班|外面玩|未归/.test(block))hint=' · 伴侣不在家';
    else hint=' · '+block.replace(/，?无法同房$/,'');
  }
  return {disabled,hint};
}
function makePhoneSexHomeBtnState(ph){
  const d=game.daily||{};
  const block=typeof getPhoneSexBlockReason==='function'?getPhoneSexBlockReason(false):null;
  const disabled=!!(d.slotSexUsed||dailySlotHoursLeft()<2||block);
  let hint='';
  if(block&&!d.slotSexUsed&&dailySlotHoursLeft()>=2){
    if(block.indexOf('睡梦中')>=0||block.indexOf('补觉')>=0)hint=' · 伴侣未醒';
    else if(/上班|外面玩|不方便/.test(block))hint=' · 伴侣不在家';
    else hint=' · '+block.replace(/，?无法电话性爱$/,'');
  }
  return {disabled,hint};
}
function dailyTryPhoneSex(){
  const d=ensureDailyState();
  if(d.slotSexUsed){addLog('本时段已做过爱或电话性爱','fail');return false}
  if(!dailyCanUseHours(2)){return false}
  const block=typeof getPhoneSexBlockReason==='function'?getPhoneSexBlockReason(false):null;
  if(block){
    showConsumeModal({icon:'📞',title:'无法电话性爱',html:block,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
    return false;
  }
  d.slotSexUsed=true;
  game._dailySexPendingHours=2;
  promptPhoneSex();
  return true;
}
function dailyTrySex(){
  const d=ensureDailyState();
  if(d.slotSexUsed){addLog('本时段已做过爱','fail');return false}
  if(!dailyCanUseHours(2)){return false}
  const block=typeof getMakeLoveBlockReason==='function'?getMakeLoveBlockReason(false):null;
  if(block){
    showConsumeModal({icon:'💔',title:'无法做爱',html:block,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
    return false;
  }
  d.slotSexUsed=true;
  game._dailySexPendingHours=2;
  promptMakeLove(1);
  return true;
}
function dailyTryMasturbate(){
  const d=ensureDailyState();
  if(d.slotMasturbateUsed){addLog('本时段已自慰','fail');return false}
  if(!game.married&&!game.divorced){addLog('无法自慰','fail');return false}
  d.slotMasturbateUsed=true;
  const awkward=Math.random()<0.1;
  const delta=awkward?1:-1;
  if(awkward)addStress(1,'自慰尴尬 ');
  else addStress(-1,'自慰 ');
  const c=ensureConsumption();if(c)c.masturbationSessions=(c.masturbationSessions||0)+1;
  showConsumeModal({
    icon:'🫥',title:'自慰',
    html:(awkward?'<span style="color:var(--red)">有点尴尬… 压力 +1</span>':'<span style="color:var(--green)">释放压力 -1</span>')+
      '<br><span class="fold-meta">不占用时段时长 · 本时段不可再次自慰</span>',
    buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]
  });
  renderDailyPanel();
  return true;
}
function nokiaPhoneDescText(){
  const cash=typeof NOKIA_PHONE_CHECK_CASH!=='undefined'?NOKIA_PHONE_CHECK_CASH:10000;
  return '¥399<br>'+
    '加成：使用中临时肉体+1、心智+1、精神+1（切换其它手机立即消失）<br>'+
    '限制：无招聘APP（有电脑可电脑应聘）· 通勤仅地铁 · 不可宅家刷短视频/短剧/聊骚/手游<br>'+
    '暴露：宅家聊骚被抓概率+10% · 通讯录联系情人+26%（伴侣在家再+16%/+20%）<br>'+
    '查机：现金&gt;¥'+cash.toLocaleString()+'时，换机约18% · 每进入新时段约10% · 伴侣在家+8%<br>'+
    '被查：未发现情人亲密度-1压力+2 · 发现情人亲-5压+5约45%离婚';
}
function phoneDesc(key){
  const p=PHONE_SHOP[key];if(!p)return '';
  if(key==='nokia')return nokiaPhoneDescText();
  const bits=['¥'+p.price.toLocaleString()];
  if(p.noApp)bits.push('无招聘APP');
  else bits.push('可用APP');
  if(p.noTaxi)bits.push('只能地铁');
  else bits.push('可打车');
  if(p.costMult)bits.push('外出消费×'+p.costMult);
  if(p.posBias)bits.push('正面事件+'+Math.round(p.posBias*100)+'%');
  if(p.negBias)bits.push('负面事件'+Math.round(p.negBias*100)+'%');
  if(p.paidUp)bits.push('氪金翻盘+'+Math.round(p.paidUp*100)+'%');
  if(p.loseMult)bits.push('丢机×'+p.loseMult);
  if(p.photoDate)bits.push('拍照约会加成');
  return bits.join(' · ');
}
function isTradingDay(dayIndex){
  return dayIndex<5;
}
function tickStocksOnce(){
  if(!game||!game.stocks)return;
  const wolfDrift=game.wolfAchievement?0.04:0;
  game.stocks.forEach(s=>{
    s.prevPrice=s.price;
    const ref=s.refPrice||s.price;
    const ch=(Math.random()-.48+wolfDrift)*0.035;
    s.price=Math.max(ref*0.55,Math.min(ref*1.45,s.price*(1+ch)));
    s.history.push(s.price);if(s.history.length>60)s.history.shift();
  });
}
function maybeTickStocksForDay(dayIndex){
  if(isTradingDay(dayIndex))tickStocksOnce();
}
function tickStocksForWorkweek(n){
  n=n||5;for(let i=0;i<n;i++)tickStocksOnce();
}
function dailyJobSlot(){
  const ph=game.daily&&game.daily.phase;
  if(ph==='morning')return 'morning';
  if(ph==='evening')return 'evening';
  if(ph==='allnight')return 'allnight';
  return null;
}
function dailyOpenCategory(menu){
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning)return;
  if(typeof isPlayerImprisoned==='function'&&isPlayerImprisoned()){addLog('监禁中无法安排日程','fail');return}
  if(menu==='contacts'){
    if(!hasUsablePhone()){addLog('暂无可用手机，无法使用通讯录','fail');return}
    if(typeof openContactsModal==='function')openContactsModal();
    return;
  }
  if(menu==='out'&&game.daily&&game.daily.phase==='allnight'&&typeof isAllnightDevilHours==='function'&&isAllnightDevilHours()){
    addLog('彩虹时段不可外出','fail');return;
  }
  if(menu==='job'&&game.daily&&game.daily.slotActivity==='out'){addLog('外出占用整个时段，请回宅后再应聘','fail');return}
  if(game.daily&&game.daily.phase==='allnight'&&dailySlotBlocked()&&menu!=='contacts'&&menu!=='home'){
    addLog('本通宵 '+SLOT_HOURS_TOTAL+'h 已满，请选择作息','fail');return;
  }
  if(menu!=='home'&&menu!=='job'&&dailySlotBlocked()){addLog('本时段 '+SLOT_HOURS_TOTAL+'h 已满','fail');return}
  continueDailyOpenCategory(menu);
}
function dailyBackToMain(){
  const d=ensureDailyState();
  if(d.subMenu==='job'){
    d.jobSubMenu=null;
    d.dailyPickApp=null;
    d.dailyPickJobIdxs=[];
    if(d.dailyAppListings!=null)d.dailyAppListings=null;
    d.dailyAppRefreshN=0;
  }
  d.subMenu=null;
  renderDailyPanel();
}
function shouldMarkWorkSkipNow(){
  const d=game.daily,ph=d.phase;
  if(!game.employed)return false;
  if(ph==='morning')return isScheduledWorkSlot('morning')&&!d.morningWorkDone;
  if(ph==='evening'){
    if(isScheduledWorkSlot('evening'))return !d.eveningShiftDone;
    if(!isWeekendDay(d.dayIndex)&&d.morningWorkDone&&!d.eveningOtTried)return true;
  }
  if(ph==='allnight')return isScheduledWorkSlot('allnight')&&!d.allnightShiftDone;
  return false;
}
function markWorkSkipForPhase(){
  const d=game.daily,ph=d.phase;
  if(!game.employed)return;
  if(ph==='morning'&&isScheduledWorkSlot('morning')&&!d.morningWorkDone){
    recordMonthlyAbsence('白天未上班');
    d.workSkipDays=(d.workSkipDays||0)+1;
    d.workedToday=false;
    addLog('🛋 '+skipWorkLabel()+'（本周第'+d.workSkipDays+'天未上班）','warn');
  }else if(ph==='evening'){
    if(isScheduledWorkSlot('evening')&&!d.eveningShiftDone){
      recordMonthlyAbsence('晚班未上');
      d.workSkipDays=(d.workSkipDays||0)+1;
      addLog('🛋 缺勤晚班（本周第'+d.workSkipDays+'天）','warn');
    }else if(!isWeekendDay(d.dayIndex)&&d.morningWorkDone&&!d.eveningOtTried){
      recordMonthlyAbsence('未去加班');
      addLog('🛋 今晚没去公司加班','warn');
    }
  }else if(ph==='allnight'&&isScheduledWorkSlot('allnight')&&!d.allnightShiftDone){
    recordMonthlyAbsence('后半夜班未上');
    d.workSkipDays=(d.workSkipDays||0)+1;
    addLog('🛋 缺勤后半夜班（本周第'+d.workSkipDays+'天）','warn');
  }
}
const OUT_PLACE_LABELS={park:'公园',cafe:'咖啡店',library:'图书馆',date:'约会',club:'夜店',bar:'酒吧',store:'便利店'};
function dailyPickOutMorning(place){
  if(place==='date'){dailyDateEvening();return}
  dailyGoOut(place);
}
function dailyPickOutEvening(kind){
  const label=OUT_PLACE_LABELS[kind]||kind;
  if(kind==='date'){dailyDateEvening();return}
  const run=()=>dailyEveningOut(kind);
  if(maybePartnerRecall(run,label))return;
  run();
}
function dailyPickHomeMorning(action){
  if(action==='rest')dailyStayHomeMorning();
  else if(action==='sex')dailyTrySex();
  else if(action==='phone_sex')dailyTryPhoneSex();
  else if(action==='masturbate')dailyTryMasturbate();
  else if(action==='scroll_sv')dailyLeisureScroll('consumeShortVideo',1);
  else if(action==='scroll_sd')dailyLeisureScroll('consumeShortDrama',1);
  else if(action==='scroll_fl')dailyLeisureScroll('consumeFlirt',1);
  else if(action==='scroll_mg')dailyLeisureScroll('consumeMobileGame',1);
  else if(action==='scroll_sv8')dailyLeisureScroll('consumeShortVideo',8);
  else if(action==='scroll_sd8')dailyLeisureScroll('consumeShortDrama',8);
  else if(action==='scroll_fl8')dailyLeisureScroll('consumeFlirt',8);
  else if(action==='scroll_mg8')dailyLeisureScroll('consumeMobileGame',8);
  else if(action==='console')dailyPlayConsole();
  else if(action==='computer')dailyUseComputer();
  else if(action==='snack')dailyEatSnackStock();
  else if(action==='snack_single')dailyEatSnackSingle();
  else if(action==='snack_couple')dailyEatSnackCouple();
  else if(action==='procreate')dailyStartProcreate();
}
function dailyPickHomeEvening(action){
  if(action==='rest')dailyStayHomeEvening();
  else if(action==='sex')dailyTrySex();
  else if(action==='phone_sex')dailyTryPhoneSex();
  else if(action==='masturbate')dailyTryMasturbate();
  else if(action==='scroll_sv')dailyLeisureScroll('consumeShortVideo',1);
  else if(action==='scroll_sd')dailyLeisureScroll('consumeShortDrama',1);
  else if(action==='scroll_fl')dailyLeisureScroll('consumeFlirt',1);
  else if(action==='scroll_mg')dailyLeisureScroll('consumeMobileGame',1);
  else if(action==='scroll_sv8')dailyLeisureScroll('consumeShortVideo',8);
  else if(action==='scroll_sd8')dailyLeisureScroll('consumeShortDrama',8);
  else if(action==='scroll_fl8')dailyLeisureScroll('consumeFlirt',8);
  else if(action==='scroll_mg8')dailyLeisureScroll('consumeMobileGame',8);
  else if(action==='console')dailyPlayConsole();
  else if(action==='computer')dailyUseComputer();
  else if(action==='snack')dailyEatSnackStock();
  else if(action==='snack_single')dailyEatSnackSingle();
  else if(action==='snack_couple')dailyEatSnackCouple();
  else if(action==='procreate')dailyStartProcreate();
}
function dailyPlayConsole(){
  if(!game.ownsConsole){addLog('请先购买游戏机（生活消费）','fail');return}
  if(!dailyCanUseHours(2))return;
  const win=Math.random()<0.5;
  if(win){addStress(-1,'打游戏 ');addLog('🎮 打游戏大捷','success')}
  else{addStress(1,'打游戏 ');addLog('🎮 打游戏连跪','warn')}
  showConsumeModal({icon:'🎮',title:'游戏机 · 2小时',html:win?'大捷！压力 -1':'连跪… 压力 +1',buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
  dailyAddHours(2,false);
}
function dailyUseComputer(){
  if(!game.ownsComputer){addLog('请先购买电脑（生活消费）','fail');return}
  if(!dailyCanUseHours(1))return;
  const roll=Math.random();
  let msg='';
  if(roll<0.22){
    const rel=REFERRER_RELATIONS[Math.floor(Math.random()*REFERRER_RELATIONS.length)];
    const name=REFERRER_NAMES[Math.floor(Math.random()*REFERRER_NAMES.length)];
    game.referralOpportunity=generateReferralOpportunity();
    if(game.referralOpportunity){msg='失联多年的'+name+'（'+rel+'）带来内推机会！';addLog('💻 '+msg,'success');updateReferralButton()}
    else{msg='联系上老同学，暂无内推';addLog('💻 '+msg,'info')}
  }else if(roll<0.44){
    const s=game.stocks[Math.floor(Math.random()*game.stocks.length)];
    msg='群友推荐 '+s.name+'（'+s.symbol+'）';addLog('💻 '+msg,'info');
  }else if(roll<0.58){
    game.casinoCoupons=(game.casinoCoupons||0)+1;
    msg='捞到赌场优惠券一张';addLog('💻 '+msg,'success');
  }else{addStress(2,'玩电脑一无所获 ');msg='刷论坛毫无收获，压力+2';addLog('💻 '+msg,'warn')}
  showConsumeModal({icon:'💻',title:'电脑 · 1小时',html:msg,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
  dailyAddHours(1,false);
}
function dailyStartProcreate(){
  if(typeof setProcreateIntent==='function')setProcreateIntent();
}
function dailyStayHomeEvening(){
  if(!dailyCanUseHours(1))return;
  addStress(-1,'宅家休息 ');
  addTempStat('spirit',1,'🏠 晚上宅家休息');
  addLog('🏠 晚上宅家休息 · 压力-1','info');
  dailyAddHours(1,false);
}
function isWeekendDay(dayIndex){return dayIndex>=5}
function currentJob(){
  if(!game||!game.employed||!game.employment)return null;
  return game.market[game.employment.jobIdx];
}
function isInternetEmployed(){
  const job=currentJob();if(!job)return false;
  return job.exposure>=4||INTERNET_CATS.includes(job.category);
}
function isManualEmployed(){
  const job=currentJob();return job?isManualJob(job):false;
}
function shiftSlotKey(){
  const d=game.daily;
  return(game.week*7+(d?d.dayIndex:0)+(game.employment?game.employment.jobIdx:0))%6;
}
function isScheduledWorkSlot(phase){
  if(!game||!game.employed||!game.daily)return false;
  const day=game.daily.dayIndex;
  const weekend=isWeekendDay(day);
  if(phase==='allnight'&&weekend&&isInternetEmployed())return true;
  if(isInternetEmployed()){
    if(weekend)return phase==='morning'||phase==='evening';
    return phase==='morning';
  }
  if(isManualEmployed()){
    const k=shiftSlotKey();
    const morningShifts=[0,1,3,5],eveningShifts=[2,4];
    if(phase==='morning')return morningShifts.includes(k);
    if(phase==='evening')return eveningShifts.includes(k);
    return false;
  }
  if(weekend)return false;
  return phase==='morning';
}
function skipWorkLabel(){return game.homeless?'流浪':'选休'}
function markDailyJobHunt(slot){
  const d=ensureDailyState();
  d.jobHuntedToday=true;
  d.jobHuntCount=(d.jobHuntCount||0)+1;
  addLog('📋 完成'+(PHASE_LABELS[slot]||slot)+'求职','info');
  dailyAdvanceAfterSlotAction();
  renderDailyPanel();
}
function dailyRewardMult(){
  const d=game.daily;
  return d&&d.phase==='allnight'?2:1;
}
function dailyMeetChance(base){
  return Math.min(0.95,base*dailyRewardMult());
}
function rollRandomStats(){
  const MAX=STAT_MAX, TOTAL=240;
  for(let i=0;i<400;i++){
    const body=Math.floor(Math.random()*(MAX+1));
    const mind=Math.floor(Math.random()*(MAX+1));
    const spirit=TOTAL-body-mind;
    if(spirit>=0&&spirit<=MAX)return {body,mind,spirit,points:0};
  }
  return {body:80,mind:80,spirit:80,points:0};
}
function isLegacyFlatStats(s){
  return !!(s&&s.body===58&&s.mind===58&&s.spirit===58);
}
function defaultPlayerStats(){
  return rollRandomStats();
}
function defaultTempStats(){
  return{body:0,mind:0,spirit:0};
}
function ensurePartnerStats(){
  if(!game)return null;
  if(!game.partnerStats||isLegacyFlatStats(game.partnerStats))game.partnerStats=rollRandomStats();
  return game.partnerStats;
}
function partnerEffStat(k){
  const ps=ensurePartnerStats();
  if(!ps)return 0;
  const pt=(game.partnerTempStats&&game.partnerTempStats[k])||0;
  const cm=typeof getPartnerCycleStatMod==='function'?getPartnerCycleStatMod():0;
  return Math.min(STAT_MAX,Math.max(0,(ps[k]||0)+pt+cm));
}
function statTotal(s){
  if(!s)return 0;
  return (s.body||0)+(s.mind||0)+(s.spirit||0);
}
function ensureDailyState(){
  if(!game)return null;
  if(!game.daily)game.daily=defaultDailyState();
  if(!game.stats)game.stats=defaultPlayerStats();
  if(!game.tempStats)game.tempStats=defaultTempStats();
  if(!game.contacts)game.contacts=[];
  if(game.ownedCar==null)game.ownedCar=null;
  ensurePhoneState();
  if(!game.playerGender)game.playerGender='male';
  if(!game.partnerGender)game.partnerGender='female';
  return game.daily;
}
function effStat(k){
  if(!game||!game.stats)return 0;
  const cm=typeof getPlayerCycleStatMod==='function'?getPlayerCycleStatMod():0;
  return Math.min(STAT_MAX,Math.max(0,(game.stats[k]||0)+(game.tempStats[k]||0)+cm));
}
function addTempStat(k,delta,logMsg){
  if(!game)return 0;
  if(!game.tempStats)game.tempStats=defaultTempStats();
  const prev=game.tempStats[k]||0;
  const next=Math.max(-TEMP_STAT_RANGE,Math.min(TEMP_STAT_RANGE,prev+(delta||0)));
  if(next===prev)return 0;
  game.tempStats[k]=next;
  const actual=next-prev;
  if(logMsg){
    addLog(logMsg+' · 临时'+STAT_LABEL[k]+(actual>0?'+':'')+actual,'info');
  }
  return actual;
}
function fmtTempDelta(v){
  const n=v||0;
  if(n>0)return '+'+n;
  return ''+n;
}
function renderTempStatsHtml(){
  const ts=game.tempStats||defaultTempStats();
  const chip=(k,v)=>'<span>'+STAT_LABEL[k]+' <b style="color:'+(v>0?'var(--green)':v<0?'var(--red)':'var(--muted)')+'">'+fmtTempDelta(v)+'</b></span>';
  return '<div class="daily-temp">临时状态（活动积累，每项±'+TEMP_STAT_RANGE+'，下周清零，入职计入有效属性） · '+
    chip('body',ts.body)+' · '+chip('mind',ts.mind)+' · '+chip('spirit',ts.spirit)+'</div>';
}
function jobStatRequirement(job){
  if(!job)return {body:0,mind:0,spirit:0};
  const pay=job.pay||0;
  const manual=MANUAL_CATS.includes(job.category);
  const transport=job.category==='交通运输';
  let body=manual||transport?45:30;
  let mind=manual?25:40;
  let spirit=manual?30:35;
  if(job.category==='个人与生活服务')spirit=55;
  if(['金融','法律','咨询'].some(c=>(job.category||'').includes(c))){mind=65;spirit=60}
  if(pay>=200000){body=Math.max(body,75);mind=Math.max(mind,70);spirit=Math.max(spirit,65)}
  if(pay>=350000||job.title&&(job.title.includes('飞行员')||job.title.includes('机长')))body=100;
  if(pay>=150000)mind=Math.max(mind,55);
  return {body,mind,spirit};
}
function meetsJobStats(job,useTemp){
  const req=jobStatRequirement(job);
  const g=(k)=>useTemp?effStat(k):(game.stats[k]||0);
  return g('body')>=req.body&&g('mind')>=req.mind&&g('spirit')>=req.spirit;
}
function weeklyAutoStatPoints(){
  if(!game||!game.stats)return;
  const pts=3;
  const edu=game.playerEducation||'本科';
  let b=1,m=1,s=1;
  if(edu==='博士'||edu==='硕士'){m=2;s=1}
  else if(edu==='高中/中专'||edu==='大专'){b=2}
  else{b=1;m=1;s=1}
  game.stats.body=Math.min(STAT_MAX,game.stats.body+b);
  game.stats.mind=Math.min(STAT_MAX,game.stats.mind+m);
  game.stats.spirit=Math.min(STAT_MAX,game.stats.spirit+s);
  addLog('📈 本周自动成长：肉体+'+b+' 心智+'+m+' 精神+'+s,'info');
}
function applyWeeklyStatGrowthSilent(){
  if(!game||!game.stats)return;
  const edu=game.playerEducation||'本科';
  let b=1,m=1,s=1;
  if(edu==='博士'||edu==='硕士'){m=2;s=1}
  else if(edu==='高中/中专'||edu==='大专'){b=2}
  game.stats.body=Math.min(STAT_MAX,game.stats.body+b);
  game.stats.mind=Math.min(STAT_MAX,game.stats.mind+m);
  game.stats.spirit=Math.min(STAT_MAX,game.stats.spirit+s);
}
function applyPartnerWeeklyStatGrowth(){
  if(!game||!game.married||game.divorced)return;
  const ps=ensurePartnerStats();
  ps.body=Math.min(STAT_MAX,(ps.body||0)+1);
  ps.mind=Math.min(STAT_MAX,(ps.mind||0)+1);
  ps.spirit=Math.min(STAT_MAX,(ps.spirit||0)+1);
}
function resetWeeklyDaily(){
  if(!game)return;
  game.daily=defaultDailyState();
  game.tempStats=defaultTempStats();
  game.partnerTempStats=defaultTempStats();
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning){
    applyWeeklyStatGrowthSilent();
    applyPartnerWeeklyStatGrowth();
  }else{
    weeklyAutoStatPoints();
    applyPartnerWeeklyStatGrowth();
    maybeTickStocksForDay(0);
  }
}
function gameMonthKey(){
  const w=typeof WEEKS_PER_MONTH!=='undefined'?WEEKS_PER_MONTH:4;
  return Math.floor((game.week||0)/w);
}
function phoneSwitchBlockedThisMonth(){
  return game.phoneSwitchMonthKey!=null&&game.phoneSwitchMonthKey===gameMonthKey();
}
function ensurePhoneState(){
  if(!game)return;
  if(!game.ownedPhones||!game.ownedPhones.length)game.ownedPhones=['xiaomi'];
  if(!game.ownedPhones.includes('xiaomi'))game.ownedPhones.unshift('xiaomi');
  if(game.phone&&!game.ownedPhones.includes(game.phone))game.phone=null;
  if(!game.phone&&game.ownedPhones.length)game.phone=game.ownedPhones[0];
  if(game.phonePanelOpen==null)game.phonePanelOpen=false;
  if(game.phoneSwitchMonthKey==null)game.phoneSwitchMonthKey=null;
  syncNokiaTempBonus();
}
function applyPhonePanelFold(){
  if(!game)return;
  const open=!!game.phonePanelOpen;
  const body=document.querySelector('#dailyPanel .phone-fold-body');
  const chev=document.querySelector('#dailyPanel .phone-fold-chev');
  const meta=document.querySelector('#dailyPanel .phone-fold-cur');
  if(body)body.style.display=open?'block':'none';
  if(chev)chev.textContent=open?'▼':'▶';
  if(meta)meta.style.display=open?'':'none';
}
function hasUsablePhone(){
  ensurePhoneState();
  return !!(game.phone&&game.ownedPhones&&game.ownedPhones.includes(game.phone));
}
function syncNokiaTempBonus(){
  if(!game||typeof addTempStat!=='function')return;
  const on=game.phone==='nokia';
  if(on&&!game.nokiaBonusActive){
    addTempStat('body',1);addTempStat('mind',1);addTempStat('spirit',1);
    game.nokiaBonusActive=true;
  }else if(!on&&game.nokiaBonusActive){
    addTempStat('body',-1);addTempStat('mind',-1);addTempStat('spirit',-1);
    game.nokiaBonusActive=false;
  }
}
function phoneBlocksHomeLeisure(){
  return !!(game&&game.phone==='nokia');
}
function canUseJobApp(){
  if(typeof hasUsablePhone!=='function'||!hasUsablePhone())return false;
  const cfg=phoneCfg();
  if(!cfg.noApp)return true;
  return game.phone==='nokia'&&!!game.ownsComputer;
}
function jobAppBlockMessage(){
  if(typeof hasUsablePhone==='function'&&!hasUsablePhone())return '无可用手机，无法使用招聘APP';
  if(canUseJobApp())return '';
  const pn=game.phone&&PHONE_SHOP[game.phone]?PHONE_SHOP[game.phone].name:'当前手机';
  if(game.phone==='nokia')return pn+'无法用招聘APP（已购电脑可用电脑应聘，或白天去人才市场）';
  return pn+'无法使用招聘APP，请更换手机或白天去人才市场';
}
function loseCurrentPhone(){
  if(!game||!game.phone)return;
  ensurePhoneState();
  const lost=game.phone,p=PHONE_SHOP[lost];
  game.ownedPhones=game.ownedPhones.filter(k=>k!==lost);
  if(lost==='nokia'&&game.nokiaBonusActive){
    if(typeof addTempStat==='function'){addTempStat('body',-1);addTempStat('mind',-1);addTempStat('spirit',-1)}
    game.nokiaBonusActive=false;
  }
  game.phone=game.ownedPhones.length?game.ownedPhones[0]:null;
  syncNokiaTempBonus();
  if(!game.phone)addLog('📱 '+(p?p.name:'手机')+' 丢失！暂无可用手机，无法使用通讯录','fail');
  else addLog('📱 '+(p?p.name:'手机')+' 丢失！已切换至 '+PHONE_SHOP[game.phone].name,'fail');
}
function phoneCfg(){
  ensurePhoneState();
  if(!game.phone)return {noApp:true,noTaxi:true,costMult:1,loseMult:1};
  return PHONE_SHOP[game.phone]||PHONE_SHOP.xiaomi;
}
function togglePhonePanel(){
  if(!game)return;
  game.phonePanelOpen=!game.phonePanelOpen;
  applyPhonePanelFold();
}
function switchPhone(key){
  ensurePhoneState();
  const p=PHONE_SHOP[key];
  if(!p){addLog('未知手机','fail');return}
  if(!game.ownedPhones.includes(key)){addLog('尚未拥有 '+p.name+'，请先购买','fail');return}
  if(phoneSwitchBlockedThisMonth()){addLog('本月已换过手机（每月仅可换一次）','fail');return}
  if(game.phone===key){addLog('已是当前手机','warn');return}
  if(game.phone==='nokia'&&game.nokiaBonusActive&&typeof addTempStat==='function'){
    addTempStat('body',-1);addTempStat('mind',-1);addTempStat('spirit',-1);
    game.nokiaBonusActive=false;
  }
  game.phone=key;
  syncNokiaTempBonus();
  game.phoneSwitchMonthKey=gameMonthKey();
  addStress(10,'换手机 ');
  addLog('📱 切换至 '+p.name+' · 压力+10 · 本月已换机','info');
  if(key==='nokia'&&typeof maybePartnerPhoneCheckOnNokia==='function')maybePartnerPhoneCheckOnNokia('switch');
  renderDailyPanel();
}
function renderPhonePanel(){
  ensurePhoneState();
  const d=ensureDailyState();
  const open=!!game.phonePanelOpen;
  const cur=game.phone&&PHONE_SHOP[game.phone]?PHONE_SHOP[game.phone].name:'无';
  const monthBlocked=phoneSwitchBlockedThisMonth();
  let h='<div class="phone-fold"><div class="phone-fold-hdr" onclick="togglePhonePanel()"><b>换手机</b>';
  h+='<span class="phone-fold-cur fold-meta"'+(open?'':' style="display:none"')+'> · 当前 '+cur+'</span>';
  h+='<span class="phone-fold-chev" style="margin-left:auto;color:var(--muted)">'+(open?'▼':'▶')+'</span></div>';
  h+='<div class="phone-fold-body"'+(open?'':' style="display:none"')+'>';
  if(!hasUsablePhone())h+='<p style="color:var(--red);margin:0 0 6px">暂无可用手机，无法使用通讯录</p>';
  Object.keys(PHONE_SHOP).forEach(k=>{
    const p=PHONE_SHOP[k],owned=game.ownedPhones.includes(k),active=game.phone===k;
    h+='<div style="margin:4px 0">';
    if(owned){
      h+='<button class="btn btn-phone-shop" '+(active||monthBlocked?'disabled':'')+' onclick="switchPhone(\''+k+'\')">'+(active?'✓ ':'')+p.name+'</button>';
    }else{
      h+='<button class="btn btn-phone-shop" onclick="buyPhone(\''+k+'\')">购买 '+p.name+' ¥'+p.price.toLocaleString()+'</button>';
    }
      h+=(k==='nokia'?'<div class="fold-meta nokia-phone-desc">'+phoneDesc(k)+'</div>':' <span class="fold-meta">'+phoneDesc(k)+'</span>')+'</div>';
  });
  h+='<p class="fold-meta">换机每次压力+10 · 每月仅可换一次</p>';
  if(monthBlocked)h+='<p class="fold-meta" style="color:var(--orange)">本月已换过手机</p>';
  h+='</div></div>';
  return h;
}
function spendWithPhoneMult(amt,label){
  const mult=phoneCfg().costMult||1;
  return spendCash(Math.round(amt*mult),label);
}
function canTakeTaxi(){
  return !phoneCfg().noTaxi&&game.cash>=50;
}
function runCommute(mode){
  if(mode==='car'&&game.ownedCar){
    addLog('🚗 开车通勤','info');
    return {cost:0,stress:0,mode:'开车'};
  }
  if(mode==='taxi'){
    if(!canTakeTaxi()){
      addStress(1,'地铁 ');
      addLog('🚇 打车不成，改坐地铁','warn');
      return {cost:0,stress:1,mode:'地铁'};
    }
    spendCash(50,'打车');
    addLog('🚕 打车通勤 ¥50','info');
    return {cost:50,stress:0,mode:'打车'};
  }
  addStress(1,'地铁 ');
  addLog('🚇 地铁通勤 · 压力+1','info');
  return {cost:0,stress:1,mode:'地铁'};
}
function maybeMeetOnCommute(mode){
  const where=mode==='taxi'?'打车':mode==='car'?'驾车':'地铁';
  const chance=mode==='taxi'?0.24:mode==='car'?0.15:0.11;
  if(Math.random()<chance)meetRandomPerson(where);
  if(mode!=='car'&&Math.random()<0.04&&isManualJob(game.employment?game.market[game.employment.jobIdx]:null)){
    if(phoneCfg()&&Math.random()<0.5*phoneCfg().loseMult)loseCurrentPhone();
  }
}
function cancelCommuteChoice(){
  closeConsumeModal();
  game._commuteCallback=null;
  dailyReleaseMainActivity();
}
function confirmCommute(mode){
  closeConsumeModal();
  const r=runCommute(mode);
  maybeMeetOnCommute(mode);
  const cb=game._commuteCallback;
  game._commuteCallback=null;
  if(typeof cb==='function')cb(r);
}
function promptCommuteChoice(onDone){
  const hasCar=!!game.ownedCar;
  const canTaxi=canTakeTaxi();
  let html='选择通勤方式：';
  const buttons=[{text:'🚇 地铁（压力+1）',fn:'confirmCommute("subway")'}];
  if(canTaxi)buttons.push({text:'🚕 打车（¥50）',fn:'confirmCommute("taxi")'});
  else if(phoneCfg().noTaxi)html+='<br><span class="fold-meta">当前手机仅支持地铁</span>';
  else html+='<br><span class="fold-meta">现金不足 ¥50，无法打车</span>';
  if(hasCar)buttons.push({text:'🚗 开车（有车 · 省油费）',primary:!canTaxi,fn:'confirmCommute("car")'});
  buttons.push({text:'取消',fn:'cancelCommuteChoice()'});
  game._commuteCallback=onDone;
  showConsumeModal({icon:'🚦',title:'通勤',html,buttons});
}
function beginWorkShift(period,overtimeFlow){
  const d=game.daily;
  const ph=d.phase;
  d.workedDays=(d.workedDays||0)+1;
  d.workedToday=true;
  if(ph==='morning'||period==='morning')d.morningWorkDone=true;
  if(ph==='evening'||period==='evening'){
    d.eveningOtTried=true;
    if(!overtimeFlow&&isScheduledWorkSlot('evening'))d.eveningShiftDone=true;
  }
  if(ph==='allnight')d.allnightShiftDone=true;
  d.slotActivity=overtimeFlow?'overtime':'work';
  const job=game.market[game.employment.jobIdx];
  if(!meetsJobStats(job,true)){
    const req=jobStatRequirement(job);
    const boosted=[];
    ['body','mind','spirit'].forEach(k=>{
      if(effStat(k)<req[k]&&addTempStat(k,2))boosted.push(STAT_LABEL[k]+'+2');
    });
    if(boosted.length)addLog('⚠ 硬撑上班 · 临时'+boosted.join('、'),'warn');
  }
  const label=period==='evening'?'晚班':'白天';
  addLog('💼 '+label+'上班（'+DAY_NAMES[d.dayIndex]+'）','info');
  showWorkShiftModal(!!overtimeFlow);
}
function meetRandomPerson(where,baseChance){
  if(Math.random()>=(baseChance!=null?dailyMeetChance(baseChance):dailyMeetChance(0.55)))return;
  const jobs=game.market.filter(j=>!isOverAgeLimit(j));
  if(!jobs.length)return;
  const job=jobs[Math.floor(Math.random()*jobs.length)];
  const co=pickCompany(job.idx,job.heatPct>=108?'high':job.heatPct>=102?'mid':'low');
  const income=Math.round(job.pay*(0.7+Math.random()*0.6));
  const id='ct_'+game.week+'_'+game.contacts.length;
  const gender=Math.random()<0.5?'male':'female';
  const age=22+Math.floor(Math.random()*18);
  const displayName=typeof pickStrangerDisplayName==='function'?pickStrangerDisplayName(gender):'路人';
  const person={id,name:displayName,jobTitle:job.title,jobSlug:job.slug,category:job.category,
    company:co.name,companyTier:co.tier,companyScale:co.scale,income,metWeek:game.week,metWhere:where,gender,age};
  if(game.contacts.some(c=>c.jobTitle===person.jobTitle&&c.company===person.company))return;
  if(typeof ensureContactAffairFields==='function')ensureContactAffairFields(person);
  if(typeof tagMeetContact==='function')tagMeetContact(person);
  game.contacts.push(person);
  const prof=typeof contactProfileLabel==='function'?contactProfileLabel(person):(person.jobTitle+' @'+person.company);
  person.talkCount=0;
  const meetMsg='在「'+where+'」遇见了 '+person.name+'，互相打了个招呼。\n\n'+prof+'\n年收入约 ¥'+income.toLocaleString()+'\n\n已记入通讯录，日后可多联系熟悉。';
  if(typeof queueStatusModal==='function'){
    queueStatusModal('结识新朋友',meetMsg,'👋',{btn:'关闭',onClose:function(){
      if(typeof maybeTellWorkplaceStory==='function')maybeTellWorkplaceStory(person,where);
    }});
  }else if(typeof maybeTellWorkplaceStory==='function')maybeTellWorkplaceStory(person,where);
  addLog('👋 结识 '+person.name+'（'+where+'）','info');
}
function addContactFromMeet(person){game.contacts.push(person)}
function advanceDailyPhase(nextPhase){
  const d=ensureDailyState();
  if(!d)return;
  if(typeof checkBffOutingMiss==='function')checkBffOutingMiss();
  if(nextPhase==='evening'){
    d.partnerCatchUpSleep=false;
    d.eveningEndModalShown=false;
  }
  d.phase=nextPhase;
  d.subMenu=null;
  resetPartnerRecallFlag();
  resetDailySlotFlags();
  if(typeof resetContactSlotFlags==='function')resetContactSlotFlags();
  if(game.phone==='nokia'&&game.cash>10000&&typeof maybePartnerPhoneCheckOnNokia==='function')maybePartnerPhoneCheckOnNokia('phase');
  renderDailyPanel();
}
function finishDay(restType){
  const d=ensureDailyState();
  if(!d)return;
  if(restType==='allnight'){
    addStress(10,'通宵 ');
    resetDailySlotFlags(false);
    game.lastCompanionAllnightSleepChoice=null;
    game._companionSleepChoice=null;
    d.phase='allnight';
    d.allnightDay=true;
    d.partnerAllnightActive=false;
    d.partnerForcedAsleep=false;
    d.partnerAllnightStayedOut=false;
    d.allnightEndModalShown=false;
    resetPartnerRecallFlag();
    addLog('🌙 进入后半夜时段（奖励×2 · APP岗位×2）','warn');
    renderDailyPanel();updateUI();
    return;
  }
  setAllnightStreak(0);
  addLog('😴 休息恢复','info');
  advanceToNextDay();
}
function bumpDayAfterAllnight(){
  const d=ensureDailyState();
  tickAllnightNoReturnIntimacy();
  if(typeof tickMenstrualDays==='function')tickMenstrualDays(1);
  resetPartnerRecallFlag();
  d.dayIndex++;
  d.allnightDay=false;
  d.partnerCatchUpSleep=false;
  d.jobHuntedToday=false;
  d.jobHuntCount=0;
  d.jobHuntBySlot={};
  d.subMenu=null;
  if(typeof tickSnackDayRebound==='function')tickSnackDayRebound(d);
  if(typeof checkBffOutingMiss==='function')checkBffOutingMiss();
  if(typeof resetContactSlotFlags==='function')resetContactSlotFlags();
  resetDailySlotFlags();
  maybeTickStocksForDay(d.dayIndex);
  if(d.dayIndex>=7){
    d.dayIndex=7;
    finishWeeklyDaily();
    return false;
  }
  return true;
}
function finishAllnightNoSleep(){
  const d=ensureDailyState();
  if(!d||d.phase!=='allnight')return;
  d.allnightEndModalShown=false;
  const streak=getAllnightStreak()+1;
  setAllnightStreak(streak);
  if(rollAllnightSuddenDeath(streak)){
    game.endingType='overwork';
    if(typeof endGame==='function')endGame('overwork');
    addLog('💀 连续'+streak+'天通宵未睡，猝死。','fail');
    renderDailyPanel();updateUI();
    return;
  }
  const compChoice=resolvePartnerAllnightEndChoice();
  if(!bumpDayAfterAllnight())return;
  applyPartnerCatchUpSleepIfEligible(compChoice);
  d.phase='morning';
  d.workedToday=false;
  addStress(6,'通宵不睡 ');
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  addLog('☀ 通宵不睡，硬撑进入白天（未补觉 · 连续通宵 '+streak+' 天）'+(d.partnerCatchUpSleep?' · '+pn+'在家补觉':''),'warn');
  renderDailyPanel();updateUI();
}
function finishAllnightSleepThrough(){
  const d=ensureDailyState();
  if(!d||d.phase!=='allnight')return;
  d.allnightEndModalShown=false;
  resolvePartnerAllnightEndChoice();
  if(!bumpDayAfterAllnight())return;
  setAllnightStreak(0);
  d.partnerCatchUpSleep=false;
  d.phase='evening';
  d.workedToday=false;
  addStress(-3,'补觉 ');
  addLog('😴 入睡补觉，睡过白天直接到了晚上','info');
  renderDailyPanel();updateUI();
}
function advanceToNextDay(){
  const d=ensureDailyState();
  tickAllnightNoReturnIntimacy();
  if(typeof tickMenstrualDays==='function')tickMenstrualDays(1);
  resetPartnerRecallFlag();
  d.allnightDay=false;
  if(typeof tickSnackDayRebound==='function')tickSnackDayRebound(d);
  if(typeof checkBffOutingMiss==='function')checkBffOutingMiss();
  if(typeof resetContactSlotFlags==='function')resetContactSlotFlags();
  d.dayIndex++;
  d.phase='morning';
  d.workedToday=false;
  d.jobHuntedToday=false;
  d.jobHuntCount=0;
  d.jobHuntBySlot={};
  d.subMenu=null;
  resetDailySlotFlags();
  maybeTickStocksForDay(d.dayIndex);
  if(d.dayIndex>=7){
    d.dayIndex=7;
    finishWeeklyDaily();
    return;
  }
  renderDailyPanel();updateUI();
}
function finishWeeklyDaily(){
  const d=game.daily;
  if(game.employed){
    if(d.workedDays>0)processEmployedWeek();
    if(d.workSkipDays>=5){
      game.employed=false;
      if(game.employment)recordCareerHistory(game.employment);
      game.employment=null;
      game.layoffs++;
      if(typeof clearOpeningLayoffEvent==='function')clearOpeningLayoffEvent();
      addLog('💔 累计选休/缺勤5天，被辞退。','fail');
    }else if(d.workSkipDays>=3&&!d.weekWorkWarned){
      d.weekWorkWarned=true;
      addLog('⚠ 本周已缺勤'+d.workSkipDays+'天，再缺勤将被辞退','warn');
    }
  }
  actionDone=true;
  addLog('📅 本周七天日程已排满，可进入下周','success');
  renderDailyPanel();updateUI();autoSaveSlot();
}
function dailyMorningWork(){
  if(!game.employed){addLog('当前无业','fail');return}
  if(typeof canPlayerWorkWeek==='function'&&!canPlayerWorkWeek()){addLog('压力≥'+(typeof STRESS_MAD!=='undefined'?STRESS_MAD:1000)+'，精神崩溃，无法上班（仍可求职）','fail');return}
  if(typeof isStressMindBlocked==='function'&&isStressMindBlocked()&&game.employment){
    const j=game.market[game.employment.jobIdx];
    if(j&&typeof isManualJob==='function'&&!isManualJob(j)){addLog('压力≥'+(typeof STRESS_MIND_BLOCK!=='undefined'?STRESS_MIND_BLOCK:666)+'，无法胜任脑力劳动','fail');return}
  }
  const go=function(){
    if(!dailyUseMainActivity())return;
    promptCommuteChoice(function(){beginWorkShift('morning',false)});
  };
  go();
}
function dailyGoOut(place){
  if(!dailyUseMainActivity())return;
  game.daily.slotActivity='out';
  if(game.daily.phase==='evening'||game.daily.phase==='allnight')game.daily.noHomeReturnDay=true;
  const mult=dailyRewardMult();
  const map={park:{stat:'body',n:1,label:'公园'},cafe:{stat:'spirit',n:1,label:'咖啡店'},library:{stat:'mind',n:1,label:'图书馆'}};
  const p=map[place];if(!p)return;
  const gain=Math.round(p.n*mult);
  addTempStat(p.stat,gain,'🚶 外出'+p.label+(mult>1?'（通宵×'+mult+'）':''));
  if(typeof tryCompleteBffOuting==='function')tryCompleteBffOuting(place);
  meetRandomPerson(p.label,0.55);
  dailyAdvanceAfterSlotAction();
}
function dailyStayHomeMorning(){
  if(!dailyCanUseHours(1))return;
  addStress(-1,'宅家休息 ');
  addTempStat('spirit',1,'🏠 白天宅家休息');
  addLog('🏠 白天宅家休息 · 压力-1','info');
  dailyAddHours(1,false);
}
function buildEveningOutVisitModal(kind,mult,extra){
  const labels={club:'夜店',bar:'酒吧',store:'便利店'};
  const icons={club:'🪩',bar:'🍺',store:'🏪'};
  let html=(labels[kind]||'外出')+' · 减压 ×'+mult;
  if(extra)html+='<br>'+extra;
  return{icon:icons[kind]||'🚶',title:'到了'+(labels[kind]||'目的地'),html};
}
function finishEveningOutVisit(kind,mult,extra){
  const phase=game.daily&&game.daily.phase;
  const modal=buildEveningOutVisitModal(kind,mult,extra);
  const afterRefuse=!!game._afterPartnerRecallRefuse;
  const affairModalPending=!!pendingAffairContactId;
  if(afterRefuse&&!affairModalPending){
    showConsumeModal({
      icon:modal.icon,title:modal.title,html:modal.html,
      buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal();dailyAdvanceAfterSlotAction()'}]
    });
    return;
  }
  dailyAdvanceAfterSlotAction();
}
function dailyEveningOut(kind){
  const mult=dailyRewardMult();
  const phase=game.daily.phase;
  if(!dailyUseMainActivity())return;
  if(phase==='evening'||phase==='allnight')game.daily.noHomeReturnDay=true;
  let visitExtra='';
  if(kind==='club'){
    if(typeof tryCompleteBffOuting==='function')tryCompleteBffOuting('club');
    if(!spendWithPhoneMult(500,'夜店')){dailyReleaseMainActivity();return}
    addStress(-2*mult,'夜店 ');
    const affairP=Math.min(0.55,0.25*mult);
    if(Math.random()<affairP){
      if(typeof triggerAffairEncounter==='function'){
        const who=typeof createAffairContact==='function'?createAffairContact('夜店'):null;
        if(who){
          triggerAffairEncounter(who.id,'夜店艳遇'+(mult>1?'×'+mult:''));
          if(!game._afterPartnerRecallRefuse)dailyAdvanceAfterSlotAction();
          return;
        }
      }else{addLog('🍸 夜店艳遇一夜'+(mult>1?'（通宵×'+mult+'）':''),'info');visitExtra='🍸 艳遇一夜';}
    }
    if(Math.random()<Math.min(0.4,0.15*mult)){applyHangover(mult);visitExtra=(visitExtra?visitExtra+'<br>':'')+'🤢 宿醉（临时属性下降 · 亲密度-1）';}
    else visitExtra=(visitExtra?visitExtra+'<br>':'')+'🪩 蹦了一夜，压力下降';
  }else if(kind==='bar'){
    if(typeof tryCompleteBffOuting==='function')tryCompleteBffOuting('bar');
    if(!spendWithPhoneMult(200,'酒吧')){dailyReleaseMainActivity();return}
    addStress(-1*mult,'酒吧 ');
    if(Math.random()<Math.min(0.45,0.2*mult)){applyHangover(mult);visitExtra='🤢 喝大了，宿醉';}
    else visitExtra='🍺 喝了几杯，放松一下';
  }else if(kind==='store'){
    if(typeof tryCompleteBffOuting==='function')tryCompleteBffOuting('store');
    if(!spendWithPhoneMult(50,'便利店')){dailyReleaseMainActivity();return}
    addStress(-1*mult,'便利店 ');
    meetRandomPerson('便利店',0.12);
    if(Math.random()<0.08*mult){
      game.referralOpportunity=generateReferralOpportunity();
      addLog('🤝 便利店偶遇熟人，获得内推线索！','success');
      visitExtra='🤝 偶遇熟人，获得内推线索';
    }else visitExtra='🏪 买了点东西，歇了会儿';
  }
  finishEveningOutVisit(kind,mult,visitExtra);
}
function applyHangover(mult){
  mult=mult||1;
  const loss=2*mult;
  ['body','mind','spirit'].forEach(k=>addTempStat(k,-loss));
  adjustSpouseIntimacy(-1);
  addStress(3*mult,'宿醉 ');
  addLog('🤢 宿醉：临时肉体-'+loss+' 心智-'+loss+' 精神-'+loss+'，亲密度-1'+(mult>1?'（通宵×'+mult+'）':''),'warn');
}
function dailyEveningShiftWork(){
  if(!game.employed){dailyAdvanceAfterSlotAction();return}
  const d=game.daily;
  if(d&&d.slotHoursUsed>0){addLog('本时段已在安排其他事（已用 '+d.slotHoursUsed+'h）','fail');return}
  const wk=isWeekendDay(d.dayIndex);
  const ph=d.phase;
  const useOt=wk||(ph==='allnight'&&isScheduledWorkSlot('allnight'));
  const go=function(){
    if(!dailyUseMainActivity())return;
    const period=ph==='allnight'?'allnight':'evening';
    promptCommuteChoice(function(){beginWorkShift(period,useOt)});
  };
  go();
}
function acceptCompanySocial(){
  closeConsumeModal(true);
  const d=ensureDailyState();
  const fromOt=!!game._overtimeFinishPending;
  const lastAction=d.overtimeLastAction;
  game._overtimeFinishPending=false;
  addLog('🍻 参加公司联谊','info');
  if(fromOt&&lastAction==='grind')addLog('✨ 拼命加班联谊 · 后半夜金色时段','info');
  else if(fromOt&&lastAction==='slack')addLog('🐟 摸鱼收工后联谊 · 今晚最后 2h','info');
  if(Math.random()<0.35)applyHangover();
  if(Math.random()<0.22){
    if(typeof triggerAffairEncounter==='function'){
      const who=typeof createAffairContact==='function'?createAffairContact('联谊'):null;
      if(who){
        if(fromOt)game._overtimeSocialEndAction=lastAction;
        triggerAffairEncounter(who.id,'公司联谊');
        return;
      }
    }
  }
  if(fromOt)applyOvertimeSocialEnd(lastAction);
  else{d.inOvertime=false;d.slotActivity=null;dailyAdvanceAfterSlotAction()}
}
function declineCompanySocial(){
  closeConsumeModal(true);
  const d=ensureDailyState();
  if(game._overtimeFinishPending){
    game._overtimeFinishPending=false;
    if(d.overtimeLastAction==='grind'){
      addLog('🚪 婉拒联谊 · 收工回家，今晚时间已用尽','info');
      finishOvertimeEveningFull();
      return;
    }
    addLog('🚪 婉拒联谊早退 · 今晚剩 '+dailySlotHoursLeft()+'h','info');
    finishOvertimeEveningPartial();
    return;
  }
  d.inOvertime=false;
  d.slotActivity=null;
  d.slotHoursUsed=OT_SOCIAL_PARTIAL_HOURS;
  addLog('🚪 婉拒联谊早退 · 今晚剩 '+dailySlotHoursLeft()+'h','info');
  renderDailyPanel();updateUI();autoSaveSlot();
}
function showWeekdaySocialChoiceModal(){
  const d=ensureDailyState();
  const grind=d.overtimeLastAction==='grind';
  const meta=grind
    ?'<span class="fold-meta">拼命收工后联谊在后半夜金色时段；回家后可选睡4h或通宵（彩虹按钮）；不去则今晚时间用尽</span>'
    :'<span class="fold-meta">摸鱼收工后联谊占用今晚最后 <b>2</b>h；回家后可选睡觉或进入后半夜；不参加可早退还剩 2h</span>';
  const declineLabel=grind?'不去，回家（今晚过完）':'不去，回家（剩2h）';
  if(typeof showConsumeModalHandlers!=='function'){acceptCompanySocial();return}
  showConsumeModalHandlers({
    icon:'🍻',title:'公司联谊',
    html:'部门今晚联谊，是否参加？<br>'+meta,
    buttons:[
      {text:'参加联谊',primary:true,handler:acceptCompanySocial},
      {text:declineLabel,handler:declineCompanySocial}
    ]
  });
}
function startWeekdayEveningOvertime(){
  const d=ensureDailyState();
  d.eveningOtTried=true;
  d.overtimeDidAction=false;
  d.overtimeLastAction=null;
  if(!dailyUseMainActivity())return;
  addStress(1,'加班 ');
  addTempStat('spirit',-1,'🌃 加班');
  addLog('🌃 到公司加班 · 压力+1','warn');
  showOvertimeChoiceModal();
}
function dailyEveningWorkEvent(){
  if(!game.employed)return;
  const d=ensureDailyState();
  if(d.slotHoursUsed>0){addLog('本时段已在安排其他事','fail');return}
  startWeekdayEveningOvertime();
}
function dailyDateEvening(){
  if(!dailyUseMainActivity())return;
  const ph=game.daily&&game.daily.phase;
  if(typeof isPartnerOutForFun==='function'&&isPartnerOutForFun(ph)){
    game.daily.partnerOutForFun=false;
    addLog('💑 在外面碰头约会','info');
  }
  const ok=game.longDistance?buyOnlineDateDaily():buyDateNightDaily();
  if(!ok){dailyReleaseMainActivity();return}
  if(game.daily)game.daily.noHomeReturnDay=false;
  if(phoneCfg().photoDate&&!game.longDistance&&Math.random()<0.4)adjustSpouseIntimacy(1);
  handleGenderDateExtras();
  dailyAdvanceAfterSlotAction();
}
function handleGenderDateExtras(){
  if(!game.married||game.divorced)return;
  const pg=game.playerGender,sg=game.partnerGender;
  if(pg==='male'&&sg==='female'&&Math.random()<0.45){
    const gift=[520,1314,5200,8800,20000][Math.floor(Math.random()*5)];
    if(game.cash>=gift){
      game.cash-=gift;
      adjustSpouseIntimacy(5);
      addLog('🎁 约会礼物 ¥'+gift+' · 亲密度+5','info');
    }else{adjustSpouseIntimacy(-1);addLog('🎁 无法满足礼物要求 · 亲密度-1','warn')}
  }
  if(pg==='female'&&sg==='male'&&Math.random()<0.35){
    const ask=1000+Math.floor(Math.random()*10001);
    if(confirm('伴侣要求吃软饭 ¥'+ask+'/月负担，是否同意？')){
      game.partnerSoftRice=ask;
      addLog('同意伴侣吃软饭 ¥'+ask+'/月','info');
    }else adjustSpouseIntimacy(-1);
  }
}

function renderDailyOutMenu(phase){
  let h='<p class="fold-meta">选择外出地点</p>';
  if(phase==='morning'){
    const wk=game.daily&&isWeekendDay(game.daily.dayIndex);
    if(wk&&game.married&&!game.divorced){
      h+='<p class="fold-meta">周末白天 · 伴侣可能在外面玩</p>';
      h+='<button class="btn" onclick="dailyPickOutMorning(\'date\')">💑 约会</button>';
    }
    h+='<button class="btn" onclick="dailyPickOutMorning(\'park\')">🌳 公园（临时肉体+1）</button>';
    h+='<button class="btn" onclick="dailyPickOutMorning(\'cafe\')">☕ 咖啡店（临时精神+1）</button>';
    h+='<button class="btn" onclick="dailyPickOutMorning(\'library\')">📚 图书馆（临时心智+1）</button>';
  }else if(phase==='allnight'){
    if(isAllnightDevilHours()){
      h+='<p class="fold-meta" style="color:var(--accent)">🌈 彩虹时段不可外出</p>';
    }else{
      h+='<p class="fold-meta">通宵外出 · 减压与事件概率×2 · ✨ 金色</p>';
      h+='<button class="btn" onclick="dailyPickOutEvening(\'club\')">'+allnightBtnLabel('🪩 夜店 ¥500（减压×2）')+'</button>';
      h+='<button class="btn" onclick="dailyPickOutEvening(\'bar\')">'+allnightBtnLabel('🍺 酒吧 ¥200（减压×2）')+'</button>';
      h+='<button class="btn" onclick="dailyPickOutEvening(\'store\')">'+allnightBtnLabel('🏪 便利店 ¥50（减压×2）')+'</button>';
    }
  }else{
    if(game.married&&!game.divorced)h+='<button class="btn" onclick="dailyPickOutEvening(\'date\')">💑 约会</button>';
    h+='<button class="btn" onclick="dailyPickOutEvening(\'club\')">🪩 夜店 ¥500</button>';
    h+='<button class="btn" onclick="dailyPickOutEvening(\'bar\')">🍺 酒吧 ¥200</button>';
    h+='<button class="btn" onclick="dailyPickOutEvening(\'store\')">🏪 便利店 ¥50</button>';
  }
  h+='<button class="btn" onclick="dailyBackToMain()">← 返回</button>';
  return h;
}
function renderDailyHomeLeisureBtns(prefix){
  const left=dailySlotHoursLeft();
  const dis=left<=0;
  const dis8=left<8;
  let h='<p class="fold-meta">刷手机 · 1h不跳时段 / 8连抽占满8h并进入下一时段</p>';
  const lbl=(t)=>(game.daily&&game.daily.phase==='allnight')?allnightBtnLabel(t):t;
  const mk=(act,label,off)=>'<button class="btn" '+(off?'disabled':'')+' onclick="dailyPick'+prefix+'(\''+act+'\')">'+lbl(label)+'</button> ';
  h+=mk('scroll_sv','📱短视频1h',dis);
  h+=mk('scroll_sd','📺短剧1h',dis);
  h+=mk('scroll_fl','💬聊骚1h',dis);
  h+=mk('scroll_mg','🎮手游1h',dis);
  h+='<br>'+mk('scroll_sv8','📱8连抽',dis8)+mk('scroll_sd8','📺8连抽',dis8);
  h+=mk('scroll_fl8','💬8连抽',dis8)+mk('scroll_mg8','🎮8连抽',dis8);
  const stock=game.snackStock||0;
  const needP=snackPortionsForStress(game.familyStress);
  const ate=!!(game.daily&&game.daily.slotSnackUsed);
  const ph=game.daily&&game.daily.phase;
  const coupleCheck=typeof canEatCoupleSnack==='function'?canEatCoupleSnack(ph):{ok:true,reason:''};
  h+='<p class="fold-meta">游戏机2h · 电脑1h · 进食1h/次（每时段限吃1次 · 每10压力+1份 · 隔天反弹份数×2）</p>';
  h+='<button class="btn" '+(dis||!game.ownsConsole?'disabled':'')+' onclick="dailyPick'+prefix+'(\'console\')">'+lbl('🎮 游戏机(2h)')+'</button> ';
  h+='<button class="btn" '+(dis||!game.ownsComputer?'disabled':'')+' onclick="dailyPick'+prefix+'(\'computer\')">'+lbl('💻 电脑(1h)')+'</button> ';
  if(stock>=needP){
    h+='<button class="btn" '+(dis||ate?'disabled':'')+' onclick="dailyPick'+prefix+'(\'snack\')">'+lbl('🍿 零食(囤'+stock+'·自己吃'+needP+'份)(1h)')+'</button> ';
  }else{
    h+='<button class="btn" '+(dis||ate?'disabled':'')+' onclick="dailyPick'+prefix+'(\'snack_single\')">'+lbl('🍱 单人餐¥'+SNACK_MEAL_SINGLE_COST+'(吃'+needP+'份)(1h)')+'</button> ';
  }
  if(game.married&&!game.divorced){
    const needS=snackPortionsForStress(game.companion?game.companion.familyStress:0);
    const coupleOff=dis||ate||!coupleCheck.ok;
    let coupleHint='';
    if(!coupleCheck.ok&&coupleCheck.reason.indexOf('睡梦中')>=0)coupleHint=' · 伴侣睡梦中';
    else if(!coupleCheck.ok)coupleHint=' · 伴侣不在家';
    h+='<button class="btn" '+(coupleOff?'disabled':'')+' onclick="dailyPick'+prefix+'(\'snack_couple\')">'+lbl('🍱 双人餐¥'+SNACK_MEAL_COUPLE_COST+'(你'+needP+'+伴'+needS+'·亲+1)(1h)')+coupleHint+'</button> ';
  }
  if(ate)h+='<span class="fold-meta">本时段已进食</span>';
  return h;
}
function renderDailyHomeMenu(phase){
  const d=game.daily||{};
  const sexMeta=game.longDistance&&!game.divorced?'电话性爱2h':'做爱2h';
  let h='<p class="fold-meta">'+dailySlotHoursLabel()+' · '+sexMeta+' · 自慰不占时（各1次）</p>';
  if(game.snackReboundPortions>0){
    const need=typeof snackPortionsForStress==='function'?snackPortionsForStress(game.familyStress):1;
    const relief=need*(typeof SNACK_RELIEF_PER_PORTION!=='undefined'?SNACK_RELIEF_PER_PORTION:1);
    const raw=game.snackReboundPortions*2;
    const capped=typeof snackReboundPreview==='function'?snackReboundPreview(game.snackReboundPortions,relief):raw;
    h+='<p style="color:var(--orange);font-size:.72rem">⚠ 昨日零食 '+game.snackReboundPortions+' 份 · 今日反弹约 +'+capped+'（进食仍至少净减1压力）</p>';
  }
  if(game.partnerSnackReboundPortions>0)h+='<p style="color:var(--orange);font-size:.72rem">⚠ 伴侣昨日吃了 '+game.partnerSnackReboundPortions+' 份，今日反弹 +'+(game.partnerSnackReboundPortions*2)+'</p>';
  if((game.snackStock||0)>0)h+='<p class="fold-meta" style="font-size:.72rem">零食囤货 '+game.snackStock+' 份</p>';
  if(game.fertilityOrder)h+='<p style="color:var(--green);font-size:.72rem">👶 '+(game.fertilityOrder.type==='surrogacy'?'代孕':'试管')+'进行中 · 预计 '+getDateStr(game.fertilityOrder.dueWeek)+' 交货</p>';
  else if(game.procreateIntentWeek===game.week)h+='<p style="color:var(--green);font-size:.72rem">🍼 备孕中（下次做爱怀孕率提升）</p>';
  if(phase==='morning'){
    h+='<button class="btn" onclick="dailyPickHomeMorning(\'rest\')">🛋 休息1h（-1压力·临时精神+1）</button>';
    if(game.married&&!game.divorced){
      if(game.longDistance){
        const phoneM=makePhoneSexHomeBtnState('morning');
        h+='<button class="btn" '+(phoneM.disabled?'disabled':'')+' onclick="dailyPickHomeMorning(\'phone_sex\')">📞 电话性爱(2h)'+phoneM.hint+'</button>';
      }else{
        const sexM=makeLoveHomeSexBtnState('morning');
        h+='<button class="btn" '+(sexM.disabled?'disabled':'')+' onclick="dailyPickHomeMorning(\'sex\')">💕 做爱(2h)'+sexM.hint+'</button>';
      }
      h+='<button class="btn" '+(d.slotMasturbateUsed?'disabled':'')+' onclick="dailyPickHomeMorning(\'masturbate\')">🫥 自慰</button>';
    }else if(game.divorced){
      h+='<button class="btn" '+(d.slotMasturbateUsed?'disabled':'')+' onclick="dailyPickHomeMorning(\'masturbate\')">🫥 自慰</button>';
    }
    if(typeof showHomeFertilityBtn==='function'?showHomeFertilityBtn():(game.married&&!game.divorced&&!game.pregnant&&!game.hasChildren)){
      const fertBusy=!!game.fertilityOrder||game.procreateIntentWeek===game.week;
      const lbl=typeof homeFertilityBtnLabel==='function'?homeFertilityBtnLabel():'🍼 备孕';
      h+='<button class="btn" '+(fertBusy?'disabled':'')+' onclick="dailyPickHomeMorning(\'procreate\')">'+lbl+'</button>';
    }
    h+=renderDailyHomeLeisureBtns('HomeMorning');
  }else if(phase==='allnight'){
    const leftN=dailySlotHoursLeft();
    if(leftN<=0){
      h+='<p style="color:var(--orange);font-size:.78rem">本通宵8h已用尽</p>';
      h+='<button class="btn" onclick="dailyBackToMain()">← 返回选择作息</button>';
      return h;
    }
    if(isAllnightDevilHours())h+='<p style="color:var(--accent);font-size:.72rem">🌈 通宵后段（第5–8h）· 与伴侣相关的活动会影响对方作息</p>';
    h+='<button class="btn" onclick="dailyPickHomeEvening(\'rest\')">'+allnightBtnLabel('🛋 休息1h（-1压力·临时精神+1）')+'</button>';
    if(game.married&&!game.divorced){
      if(game.longDistance){
        const phoneN=makePhoneSexHomeBtnState('allnight');
        h+='<button class="btn" '+(phoneN.disabled?'disabled':'')+' onclick="dailyPickHomeEvening(\'phone_sex\')">'+allnightBtnLabel('📞 电话性爱(2h)'+phoneN.hint)+'</button>';
      }else{
        const sexN=makeLoveHomeSexBtnState('allnight');
        h+='<button class="btn" '+(sexN.disabled?'disabled':'')+' onclick="dailyPickHomeEvening(\'sex\')">'+allnightBtnLabel('💕 做爱(2h)'+sexN.hint)+'</button>';
      }
      h+='<button class="btn" '+(d.slotMasturbateUsed?'disabled':'')+' onclick="dailyPickHomeEvening(\'masturbate\')">'+allnightBtnLabel('🫥 自慰')+'</button>';
    }else if(game.divorced){
      h+='<button class="btn" '+(d.slotMasturbateUsed?'disabled':'')+' onclick="dailyPickHomeEvening(\'masturbate\')">'+allnightBtnLabel('🫥 自慰')+'</button>';
    }
    if(typeof showHomeFertilityBtn==='function'?showHomeFertilityBtn():(game.married&&!game.divorced&&!game.pregnant&&!game.hasChildren)){
      const fertBusy=!!game.fertilityOrder||game.procreateIntentWeek===game.week;
      const fertLbl=typeof homeFertilityBtnLabel==='function'?homeFertilityBtnLabel():'🍼 备孕';
      h+='<button class="btn" '+(fertBusy?'disabled':'')+' onclick="dailyPickHomeEvening(\'procreate\')">'+allnightBtnLabel(fertLbl)+'</button>';
    }
    h+=renderDailyHomeLeisureBtns('HomeEvening');
  }else{
    h+='<button class="btn" onclick="dailyPickHomeEvening(\'rest\')">🛋 休息1h（-1压力·临时精神+1）</button>';
    if(game.married&&!game.divorced){
      if(game.longDistance){
        const phoneE=makePhoneSexHomeBtnState('evening');
        h+='<button class="btn" '+(phoneE.disabled?'disabled':'')+' onclick="dailyPickHomeEvening(\'phone_sex\')">📞 电话性爱(2h)'+phoneE.hint+'</button>';
      }else{
        const sexE=makeLoveHomeSexBtnState('evening');
        h+='<button class="btn" '+(sexE.disabled?'disabled':'')+' onclick="dailyPickHomeEvening(\'sex\')">💕 做爱(2h)'+sexE.hint+'</button>';
      }
      h+='<button class="btn" '+(d.slotMasturbateUsed?'disabled':'')+' onclick="dailyPickHomeEvening(\'masturbate\')">🫥 自慰</button>';
    }else if(game.divorced){
      h+='<button class="btn" '+(d.slotMasturbateUsed?'disabled':'')+' onclick="dailyPickHomeEvening(\'masturbate\')">🫥 自慰</button>';
    }
    if(typeof showHomeFertilityBtn==='function'?showHomeFertilityBtn():(game.married&&!game.divorced&&!game.pregnant&&!game.hasChildren)){
      const fertBusy=!!game.fertilityOrder||game.procreateIntentWeek===game.week;
      const lbl=typeof homeFertilityBtnLabel==='function'?homeFertilityBtnLabel():'🍼 备孕';
      h+='<button class="btn" '+(fertBusy?'disabled':'')+' onclick="dailyPickHomeEvening(\'procreate\')">'+lbl+'</button>';
    }
    h+=renderDailyHomeLeisureBtns('HomeEvening');
  }
  h+='<button class="btn" onclick="dailyBackToMain()">← 返回</button>';
  return h;
}
function renderStdHospitalBtn(){
  if(!game||!game.stdActive)return '';
  const v=game.stdTreatmentVisits||0;
  const done=game.stdLastTreatmentWeek===game.week;
  return '<button class="btn btn-warn" '+(done?'disabled':'')+' onclick="dailyStdHospitalVisit()">🏥 去医院（性病 '+v+'/'+((typeof STD_TREATMENT_VISITS!=='undefined')?STD_TREATMENT_VISITS:4)+' 周'+(v>=3?' · 付¥'+((typeof STD_CURE_COST!=='undefined')?STD_CURE_COST:3000):'')+'）'+(done?' · 本周已诊':'')+'</button> ';
}
function renderPartialSlotJobBtn(){
  if(typeof dailyJobHourlyBlocked==='function'&&dailyJobHourlyBlocked(true))return '';
  if(dailySlotHoursLeft()<=0)return '';
  const label='📋 应聘求职（剩'+dailySlotHoursLeft()+'h）';
  return '<button class="btn" onclick="dailyOpenCategory(\'job\')">'+(game.daily&&game.daily.phase==='allnight'?allnightBtnLabel(label):label)+'</button> ';
}
function renderDailyMainActions(phase,d,sched){
  let h='';
  if(game&&game.stdActive)h+='<p style="color:var(--orange);font-size:.72rem">🦠 性病：须每周用一个时段去医院，连续四周，第4次付 ¥'+((typeof STD_CURE_COST!=='undefined')?STD_CURE_COST:3000)+' 治愈；中断从头来</p>';
  if(d.slotHoursUsed>0)h+='<p style="color:var(--yellow);font-size:.78rem">'+dailySlotHoursLabel()+' · 做爱(2h)/自慰(不占时)仍可进行</p>';
  if(phase==='rest'){
    h+='<p style="color:var(--orange);font-size:.78rem">请选择睡觉或进入后半夜</p>';
    h+='<button class="btn btn-primary" onclick="confirmEveningEndChoice(\'sleep\')">😴 睡觉（次日白天）</button>';
    h+='<button class="btn btn-warn" onclick="confirmEveningEndChoice(\'allnight\')">🌙 后半夜不睡（+8h · 压力+10）</button>';
    return h;
  }
  if(phase==='allnight'){
    if(d.allnightArrivalPending){
      h+='<p style="color:var(--orange);font-size:.85rem">🌃 拼命加班联谊（金色时段）结束 · 后半夜到家</p>';
      h+='<p class="fold-meta">赶紧睡 → 次日清晨；通宵 → 彩虹时段（不可外出）</p>';
      h+='<button class="btn btn-primary" onclick="confirmOvertimeAllnightArrival(\'sleep\')">😴 赶紧睡（次日清晨 · +1压力）</button> ';
      h+='<button class="btn btn-warn" onclick="confirmOvertimeAllnightArrival(\'stayup\')">🌈 通宵（彩虹时段 · 剩4h）</button>';
      return h;
    }
    const leftA=dailySlotHoursLeft();
    const exhausted=leftA<=0;
    h+='<p class="fold-meta">后半夜 · 每时段8h · 奖励×2'+(isAllnightDevilHours()?' · <span style="color:var(--accent)">🌈 后段</span>':' · <span style="color:#ffd700">✨ 金色时段</span>')+'</p>';
    if(exhausted){
      h+='<p style="color:var(--orange);font-size:.78rem">本后半夜8h已用尽，请选择作息</p>';
    }else{
      if(game.employed&&sched)h+='<button class="btn btn-primary" onclick="dailyEveningShiftWork()">'+allnightBtnLabel('💼 加班')+'</button>';
      if(d.slotHoursUsed===0){
        h+=partnerLocTag(phase);
        if(!isAllnightDevilHours())h+='<button class="btn" onclick="dailyOpenCategory(\'out\')">'+allnightBtnLabel('🚶 外出')+'</button>';
        h+='<button class="btn" onclick="dailyOpenCategory(\'home\')">'+allnightBtnLabel('🏠 宅家')+'</button>';
        if(!isAllnightDevilHours())h+='<button class="btn" onclick="dailyOpenCategory(\'job\')">'+allnightBtnLabel('📋 应聘求职')+'</button>';
        h+=renderStdHospitalBtn();
      }else if(leftA>0){
        h+=partnerLocTag(phase);
        h+='<button class="btn" onclick="dailyOpenCategory(\'home\')">'+allnightBtnLabel('🏠 继续宅家（剩'+leftA+'h）')+'</button> ';
        if(!isAllnightDevilHours())h+=renderPartialSlotJobBtn();
      }
      h+=renderStdHospitalBtn();
    }
    h+='<button class="btn btn-allnight-plain" onclick="dailyOpenCategory(\'contacts\')">📇 通讯录</button>';
    h+=renderAllnightSleepRows(leftA,exhausted);
    h+=renderAllnightStreakHint();
    h+=renderCompanionAllnightStreakHint();
    return h;
  }
  if(phase==='morning'){
    const wk=isWeekendDay(d.dayIndex);
    if(d.slotHoursUsed===0){
      if(game.employed&&sched){
        h+='<p class="fold-meta">'+(wk?'周末':'今日')+'需上班 · 选上班或选休</p>';
        h+='<button class="btn btn-primary" onclick="dailyMorningWork()">💼 '+(wk?'加班':'上班')+'</button>';
      }
      h+=partnerLocTag(phase);
      h+='<button class="btn" onclick="dailyOpenCategory(\'out\')">🚶 外出</button>';
      h+='<button class="btn" onclick="dailyOpenCategory(\'home\')">🏠 宅家</button>';
      h+='<button class="btn" onclick="dailyOpenCategory(\'job\')">📋 应聘求职</button>';
      h+=renderStdHospitalBtn();
    }else if(dailySlotHoursLeft()>0){
      h+=partnerLocTag(phase);
      h+='<button class="btn" onclick="dailyOpenCategory(\'home\')">🏠 继续宅家（剩'+dailySlotHoursLeft()+'h）</button> ';
      h+=renderPartialSlotJobBtn();
    }
    h+='<button class="btn" onclick="dailyZoneOut()">😶 发呆（跳下一时段 · 压力-1）</button>';
    h+=renderStdHospitalBtn();
    h+='<button class="btn" onclick="dailyOpenCategory(\'contacts\')">📇 通讯录</button>';
    return h;
  }
  if(phase==='evening'){
    const wk=isWeekendDay(d.dayIndex);
    if(d.slotHoursUsed===0){
      if(game.employed&&isScheduledWorkSlot('evening')){
        h+='<p class="fold-meta">'+(wk?'周末':'今晚')+'需上班</p>';
        h+='<button class="btn btn-primary" onclick="dailyEveningShiftWork()">💼 '+(wk?'加班/晚班':'晚班上班')+'</button>';
      }else if(game.employed&&d.workedToday&&!wk){
        const ot=getEmploymentOtProfile();
        const otP=ot?ot.forcedEveningProb:0.5;
        const otHint=ot?' <span class="fold-meta">（'+ot.otLabel+' · 收工后联谊约 '+Math.round(OT_SOCIAL_PROB*100)+'%）</span>':'';
        h+='<button class="btn btn-primary" onclick="dailyEveningWorkEvent()">🏢 加班</button>'+otHint;
      }
      h+=partnerLocTag(phase);
      h+='<button class="btn" onclick="dailyOpenCategory(\'out\')">🚶 外出</button>';
      h+='<button class="btn" onclick="dailyOpenCategory(\'home\')">🏠 宅家</button>';
      h+='<button class="btn" onclick="dailyOpenCategory(\'job\')">📋 应聘求职</button>';
      h+=renderStdHospitalBtn();
    }else if(dailySlotHoursLeft()>0){
      h+=partnerLocTag(phase);
      h+='<button class="btn" onclick="dailyOpenCategory(\'home\')">🏠 继续宅家（剩'+dailySlotHoursLeft()+'h）</button> ';
      h+=renderPartialSlotJobBtn();
    }
    h+='<button class="btn" onclick="dailyZoneOut()">😶 发呆（跳下一时段 · 压力-1）</button>';
    h+=renderStdHospitalBtn();
    h+='<button class="btn" onclick="dailyOpenCategory(\'contacts\')">📇 通讯录</button>';
    return h;
  }
  return h;
}
function buyCar(key){
  const c=CAR_SHOP[key];if(!c||!game)return;
  if(game.ownedCar===key){addLog('已拥有'+c.name,'warn');return}
  if(!spendCash(c.price,'购买'+c.name))return;
  game.ownedCar=key;
  addLog('🚗 购入'+c.name+' ¥'+c.price.toLocaleString(),'success');
  renderDailyPanel();renderSpendingPanel();
}
function buyPhone(key){
  ensurePhoneState();
  const p=PHONE_SHOP[key];if(!p||!game)return;
  if(game.ownedPhones.includes(key)){switchPhone(key);return}
  if(!spendCash(p.price,'购买'+p.name))return;
  game.ownedPhones.push(key);
  switchPhone(key);
  addLog('📱 购入'+p.name+' ¥'+p.price.toLocaleString(),'success');
  renderDailyPanel();
}
function renderDailyPanel(){
  const el=document.getElementById('dailyPanel');
  if(!el||!game)return;
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning){
    el.innerHTML='<p style="color:var(--yellow);font-size:.85rem">⏩ 自动生活进行中，日程已暂停…</p>';
    return;
  }
  if(typeof isPlayerImprisoned==='function'&&isPlayerImprisoned()){
    el.innerHTML='<p style="color:var(--red);font-size:.85rem">🔒 监禁中（剩 '+(game.imprisonedUntilWeek-game.week)+' 周）· 无法安排日程</p>';
    return;
  }
  const ov=document.getElementById('autoLifeOverlay');
  if(ov&&!ov.classList.contains('hidden')){
    el.innerHTML='<p style="color:var(--muted);font-size:.85rem">请阅读自动生活汇报后点击「关闭汇报」</p>';
    return;
  }
  const d=ensureDailyState();
  const day=Math.min(d.dayIndex,6);
  const phase=d.phase||'morning';
  const sched=game.employed&&isScheduledWorkSlot(phase);
  const allnightWrap=dailyAllnightWrapClass(phase);
  let html='<div class="daily-panel-body'+allnightWrap+'">';
  html+='<div class="daily-hdr"><b>第'+(game.week+1)+'周</b> · '+DAY_NAMES[day]+' · '+PHASE_LABELS[phase]+' · '+dailySlotHoursLabel()+
    (isWeekendDay(day)&&isInternetEmployed()?' · <span style="color:var(--orange)">互联网周末班</span>':'')+
    (isManualEmployed()?' · <span style="color:var(--blue)">轮班制</span>':'')+'</div>';
  html+=renderAllnightStreakRow();
  html+=renderEmployedJobBar();
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  if(game.married&&!game.divorced){
    if(typeof ensurePartnerPresence==='function')ensurePartnerPresence(phase);
    const loc=typeof getSpouseLocationLabel==='function'?getSpouseLocationLabel(phase):'';
    const pStreak=getCompanionAllnightStreak();
    html+='<div class="daily-partner">'+partnerAvatarHtml(game.partnerGender)+'<div><b>'+pn+'</b><div class="fold-meta">📍 '+loc+'</div>'+
      (pStreak?'<div class="fold-meta" style="color:var(--orange)">已连续通宵未睡 '+pStreak+' 天</div>':'')+
      '</div></div>';
  }
  const left=dailySlotHoursLeft();
  html+='<p style="font-size:.72rem;color:var(--muted)">本时段剩 '+left+'h · 刷APP '+JOB_APP_BROWSE_H+'h/次 · 猎头/内推 '+JOB_HEADHUNTER_H+'h · 与宅家共用</p>';
  const bs=game.stats||{};
  html+='<div class="daily-stats">'+
    '<span>你·肉体 <b>'+effStat('body')+'</b> <span class="fold-meta">基础'+(bs.body||0)+'</span> · 心智 <b>'+effStat('mind')+'</b> <span class="fold-meta">基础'+(bs.mind||0)+'</span> · 精神 <b>'+effStat('spirit')+'</b> <span class="fold-meta">基础'+(bs.spirit||0)+'</span> <span class="fold-meta">(永久合计'+statTotal(bs)+')</span></span>'+
    (game.married&&!game.divorced?'<br><span>'+pn+'·肉体 <b>'+partnerEffStat('body')+'</b> 心智 <b>'+partnerEffStat('mind')+'</b> 精神 <b>'+partnerEffStat('spirit')+'</b> <span class="fold-meta">(合计'+statTotal(game.partnerStats)+')</span></span>':'')+
    '<br><span>亲密度 <b>'+(game.spouseIntimacy!=null?game.spouseIntimacy:'—')+'</b></span></div>';
  html+=renderTempStatsHtml();
  html+='<div class="daily-week">'+DAY_NAMES.map((n,i)=>'<span class="daily-dot'+(i<d.dayIndex?' done':i===day&&d.dayIndex<7?' cur':'')+'">'+n+'</span>').join('')+'</div>';
  if(d.dayIndex>=7){
    html+='<p class="daily-done">✅ 本周七天日程已满</p>';
    html+='<button class="btn btn-success" onclick="nextWeek()">进入下周 →</button> ';
    html+='<span class="fold-meta">或使用下方「自动生活」快进</span>';
    html+='</div>';
    el.innerHTML=html;return;
  }
  html+=renderPartnerInviteOutHint();
  html+='<div class="daily-actions">';
  const sub=d.subMenu||null;
  if(sub==='job')html+=renderDailyJobMenu(phase);
  else if(sub==='out')html+=renderDailyOutMenu(phase);
  else if(sub==='home')html+=renderDailyHomeMenu(phase);
  else html+=renderDailyMainActions(phase,d,sched);
  html+='</div>';
  html+='<div class="daily-shop"><b>购车</b> ';
  Object.keys(CAR_SHOP).forEach(k=>{const c=CAR_SHOP[k];html+='<button class="btn btn-allnight-plain" onclick="buyCar(\''+k+'\')">'+c.name+' ¥'+(c.price/10000)+'万</button> ';});
  html+=(game.ownedCar?' <span class="fold-meta">已购 '+CAR_SHOP[game.ownedCar].name+'</span>':'')+'</div>';
  html+=renderPhonePanel();
  if(typeof renderContactsBlock==='function')html+=renderContactsBlock();
  html+='</div>';
  el.innerHTML=html;
  if(phase==='evening'&&dailySlotBlocked()&&!d.eveningEndModalShown&&!d.inOvertime&&d.slotActivity!=='work'&&d.slotActivity!=='overtime'){
    setTimeout(function(){if(typeof showEveningEndChoiceModal==='function')showEveningEndChoiceModal()},80);
  }
  if(phase==='allnight'&&d.allnightArrivalPending){
    setTimeout(function(){if(typeof showOvertimeAllnightArrivalModal==='function')showOvertimeAllnightArrivalModal()},80);
  }
  if(phase==='allnight'&&dailySlotBlocked()&&!d.allnightEndModalShown&&!d.allnightArrivalPending){
    setTimeout(function(){if(typeof showAllnightExhaustedModal==='function')showAllnightExhaustedModal()},80);
  }
  schedulePartnerInviteOutCheck();
}
function migrateDailyState(){
  if(game){
    if(!game.ownedPhones||!game.ownedPhones.length){
      game.ownedPhones=game.phone?[game.phone]:['xiaomi'];
      if(!game.ownedPhones.includes('xiaomi'))game.ownedPhones.unshift('xiaomi');
    }
    if(game.phonePanelOpen==null)game.phonePanelOpen=false;
    if(game.nokiaBonusActive==null)game.nokiaBonusActive=false;
    ensurePhoneState();
  }
  const d=ensureDailyState();
  if(d){
    if(d.slotHoursUsed==null)d.slotHoursUsed=d.slotActionUsed?8:0;
    if(d.slotSexUsed==null)d.slotSexUsed=false;
    if(d.slotMasturbateUsed==null)d.slotMasturbateUsed=false;
    if(d.slotSnackUsed==null)d.slotSnackUsed=false;
    if(d.snackPortionsToday==null)d.snackPortionsToday=d.hadSnackToday?1:0;
    if(d.partnerSnackPortionsToday==null)d.partnerSnackPortionsToday=0;
    if(d.allnightDay==null)d.allnightDay=false;
    if(d.noHomeReturnDay==null)d.noHomeReturnDay=false;
    if(d.partnerRecallResolved==null)d.partnerRecallResolved=false;
    if(game.allnightStreak==null)game.allnightStreak=(d.allnightStreak||0);
    if(game.companionAllnightStreak==null)game.companionAllnightStreak=(d.companionAllnightStreak||0);
    if(d.partnerOutForFun==null)d.partnerOutForFun=false;
    if(d.partnerPresenceRolled==null)d.partnerPresenceRolled=false;
    if(d.partnerInviteOutChecked==null)d.partnerInviteOutChecked=false;
    if(d.partnerInviteOutResolved==null)d.partnerInviteOutResolved=false;
    if(d.playerCalledPartnerHome==null)d.playerCalledPartnerHome=false;
    if(d.partnerAllnightActive==null)d.partnerAllnightActive=false;
    if(d.partnerForcedAsleep==null)d.partnerForcedAsleep=false;
    if(d.partnerAllnightStayedOut==null)d.partnerAllnightStayedOut=false;
    if(d.allnightEndModalShown==null)d.allnightEndModalShown=false;
    if(d.partnerCatchUpSleep==null)d.partnerCatchUpSleep=false;
    if(d.eveningEndModalShown==null)d.eveningEndModalShown=false;
    if(d.allnightArrivalPending==null)d.allnightArrivalPending=false;
    if(game.monthlyAbsenceMonthKey==null){
      game.monthlyAbsenceMonthKey=game.overtimeRefuseMonthKey!=null?game.overtimeRefuseMonthKey:getMonthlyAbsenceMonthKey();
      game.monthlyAbsenceCount=game.overtimeRefuseCount!=null?game.overtimeRefuseCount:0;
    }
    ensureMonthlyAbsenceMonth();
    if(d.phase==='rest'){
      d.phase='evening';
      if((d.slotHoursUsed||0)<SLOT_HOURS_TOTAL)d.slotHoursUsed=SLOT_HOURS_TOTAL;
    }
  }
  if(game.partnerNeglectPoints==null)game.partnerNeglectPoints=0;
  if(game.companion&&game.companion.weekWorkSkipDays==null)game.companion.weekWorkSkipDays=0;
  if(game.companion){
    if(!game.companion.stats||game.companion.stats===game.stats||isLegacyFlatStats(game.companion.stats))
      game.companion.stats=rollRandomStats();
    game.companion.playerGender=game.playerGender;
    game.companion.partnerGender=game.partnerGender;
  }
  if(game.stats&&isLegacyFlatStats(game.stats))game.stats=rollRandomStats();
  ensurePartnerStats();
}
function hookHirePlayerStats(jobIdx){
  const job=game.market[jobIdx];
  if(!meetsJobStats(job,true)){
    game.hiredOnTempStats=true;
    addLog('⚠ 凭临时属性入职 '+job.title+'，能力不足易被裁','warn');
  }else game.hiredOnTempStats=false;
}
function layoffTempStatPenalty(){
  let p=1;
  if(game.hiredOnTempStats)p=Math.max(p,1.45);
  const job=game.employed&&game.employment?game.market[game.employment.jobIdx]:null;
  if(job&&!meetsJobStats(job,false))p=Math.max(p,1.25);
  const slack=game.daily&&game.daily.overtimeSlack||0;
  if(slack)p+=slack*0.1;
  return p;
}
