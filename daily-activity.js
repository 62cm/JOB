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
const WORK_SCAM_CALL_H=1;
const WORK_SCAM_BATCH_H=2;
const WORK_SCAM_SALES_H=2;
const WORK_GOSSIP_H=1;
const WORK_IDEAL_OPS_H=2;
const SLOT_BATCH_HOURS=8;
const PARTNER_RECALL_HOME_HOURS=2;
const ALLNIGHT_DEVIL_HOURS_START=4;
const OT_SOCIAL_PROB=0.38;
const MONTHLY_ABSENCE_LIMIT=4;
const OT_SLACK_HOURS=6;
const OT_GRIND_HOURS=8;
const OT_SLACK_HOME_HOURS=2;
const OT_SOCIAL_PARTIAL_HOURS=OT_SLACK_HOURS;
const ALLNIGHT_DEATH_BY_STREAK=[0,0.0001,0.01,0.05,0.60,1];
function getAllnightStreak(){return game&&(game.allnightStreak||0)||0}
function setAllnightStreak(n){if(game)game.allnightStreak=Math.max(0,n||0)}
function getCompanionAllnightStreak(){return game&&(game.companionAllnightStreak||0)||0}
function setCompanionAllnightStreak(n){if(game)game.companionAllnightStreak=Math.max(0,n||0)}
function clearCompanionAllnightStreak(){
  if(game&&(game.companionAllnightStreak||0)>0)setCompanionAllnightStreak(0);
}
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
  return '<p style="color:var(--orange);font-size:.72rem">'+(s?'已连续通宵未睡 '+s+' 天':'未通宵')+'</p>';
}
function renderCompanionAllnightStreakHint(){
  const s=getCompanionAllnightStreak();
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  return '<p style="color:var(--orange);font-size:.72rem">'+pn+'：'+(s?'已连续通宵未睡 '+s+' 天':'未通宵')+'</p>';
}
function findCompanySnapshotById(id){
  if(!id||!game)return null;
  if(game.companyById&&game.companyById[id])return game.companyById[id];
  if(typeof SCAM_BAIT_COMPANIES!=='undefined'){
    const bait=SCAM_BAIT_COMPANIES.find(function(c){return c.id===id;});
    if(bait)return Object.assign({},bait,{city:bait.city||game.playerCity||(typeof PLAYER_HOME_CITY!=='undefined'?PLAYER_HOME_CITY:'')});
  }
  if(id==='scam_co_mail'){
    const mailNames=typeof SCAM_CO_NAMES!=='undefined'?SCAM_CO_NAMES:['鸿运信息','鑫达科技','汇通咨询'];
    return{id:id,name:mailNames[0],tier:'low',scale:'small',city:game.playerCity||(typeof PLAYER_HOME_CITY!=='undefined'?PLAYER_HOME_CITY:'')};
  }
  if(game.jobCompanies){
    for(const ji in game.jobCompanies){
      const hit=(game.jobCompanies[ji]||[]).find(function(c){return c.id===id;});
      if(hit)return hit;
    }
  }
  if(game.companyAll){
    const allHit=game.companyAll.find(function(c){return c.id===id;});
    if(allHit)return allHit;
  }
  const scanOffer=function(offer){
    if(!offer)return null;
    if(offer.companyId===id&&offer.company)return offer.company;
    if(offer.company&&offer.company.id===id)return offer.company;
    return null;
  };
  let i,item,co;
  for(i=0;i<(game.applications||[]).length;i++){
    co=scanOffer(game.applications[i].offer);
    if(co)return co;
  }
  for(i=0;i<(game.offers||[]).length;i++){
    co=scanOffer(game.offers[i].offer);
    if(co)return co;
  }
  for(i=0;i<(game.inbox||[]).length;i++){
    item=game.inbox[i];
    co=scanOffer(item.offer||(item.type==='offer'?item:null));
    if(co)return co;
  }
  if(game.pendingHire&&game.pendingHire.offer){
    co=scanOffer(game.pendingHire.offer);
    if(co)return co;
  }
  const book=game.selfEmploy&&game.selfEmploy.scamBook;
  if(book&&book.companyId===id&&book.companyName){
    return{id:id,name:book.companyName,tier:'low',scale:'small',city:game.playerCity||(typeof PLAYER_HOME_CITY!=='undefined'?PLAYER_HOME_CITY:'')};
  }
  return null;
}
function linkEmploymentCompany(emp){
  if(!emp||emp.company)return emp&&emp.company;
  const id=emp.companyId;
  if(!id)return null;
  let co=findCompanySnapshotById(id);
  if(!co&&game.companyById&&game.companyById[id])co=game.companyById[id];
  if(co){
    emp.company=co;
    delete emp.companyId;
    return co;
  }
  emp.company={id:id,name:'就职单位',tier:emp.tier||'mid',scale:'medium',city:game.playerCity||(typeof PLAYER_HOME_CITY!=='undefined'?PLAYER_HOME_CITY:'')};
  delete emp.companyId;
  return emp.company;
}
function ensureEmploymentCompanyLinked(){
  if(!game||!game.employed||!game.employment)return;
  linkEmploymentCompany(game.employment);
}
function ensureCompanionEmploymentCompanyLinked(){
  if(!game||!game.companion||!game.companion.employed||!game.companion.employment)return;
  linkEmploymentCompany(game.companion.employment);
}
function getScamSideEmploymentDisplay(){
  if(!game||!game.selfEmploy||!game.selfEmploy.scamBook)return null;
  if(game.employment&&game.employment.roleExtra==='scam')return null;
  const book=game.selfEmploy.scamBook;
  const sales=book.sales;
  let company=book.companyName||null,title='电销专员';
  if(!company){
    const app=(game.applications||[]).find(function(a){return a.status==='hired_scam'&&a.offer&&a.offer.company;});
    if(app){
      company=app.offer.company.name;
      const j=game.market&&game.market[app.jobIdx];
      if(j)title=j.title;
    }
  }
  if(!company){
    const hist=(game.careerHistory||[]).slice().reverse().find(function(h){return h.roleExtra==='scam'&&h.company;});
    if(hist)company=hist.company;
  }
  if(!company&&typeof SCAM_CO_NAMES!=='undefined')company=SCAM_CO_NAMES[0];
  if(!company)company='诈骗岗';
  return{
    company:company,title:title,
    product:(sales&&sales.product)||'套餐',
    sold:(sales&&sales.sold)||0,
    quota:(sales&&sales.quota)||0
  };
}
function renderEmployedJobBar(){
  if(!game)return '';
  let html='';
  if(game.employed&&game.employment){
    ensureEmploymentCompanyLinked();
    const job=game.market&&game.market[game.employment.jobIdx];
    const co=game.employment.company;
    if(co){
      ensureMonthlyAbsenceMonth();
      const abs=game.monthlyAbsenceCount||0;
      const absHtml=abs>0?' · <span style="color:var(--red)">本月旷工 <b>'+abs+'</b>/'+MONTHLY_ABSENCE_LIMIT+'</span>':'';
      const ownerImmune=typeof playerEmployerAcquired==='function'&&playerEmployerAcquired();
      let scamInfo=null;
      if(typeof getScamEmployerDisplay==='function')scamInfo=getScamEmployerDisplay();
      const resignFn=scamInfo?'confirmScamJobResign()':'confirmPlayerResign()';
      const resignBtn=ownerImmune
        ?'<span class="fold-meta" style="margin-left:8px;color:var(--green)">已收购·不可辞职</span>'
        :' <button type="button" class="btn btn-warn" style="font-size:.68rem;padding:2px 8px;margin-left:8px" onclick="'+resignFn+'">辞职</button>';
      let body='💼 在职：<b>'+(job?job.title:'岗位')+'</b> @ '+co.name;
      if(scamInfo){
        body='💼 在职：<span style="color:var(--orange)">⚠ 传销诈骗岗</span> · 所属 <b>'+scamInfo.company+'</b> · '+scamInfo.title+
          ' · 「'+scamInfo.product+'」'+scamInfo.sold+'/'+scamInfo.quota;
      }
      html+='<div class="daily-employ" style="font-size:.78rem;margin-bottom:8px;padding:6px 10px;background:var(--bg);border:1px solid var(--border);border-radius:6px">'+
        body+absHtml+resignBtn+'</div>';
    }
  }
  if(game.married&&!game.divorced&&game.companion&&game.companion.employed&&game.companion.employment){
    ensureCompanionEmploymentCompanyLinked();
    const ce=game.companion.employment;
    const cco=ce.company;
    const cjob=game.market&&game.market[ce.jobIdx];
    const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
    if(cco){
      html+='<div class="daily-employ" style="font-size:.78rem;margin-bottom:8px;padding:6px 10px;background:rgba(63,185,80,.06);border:1px solid var(--green);border-radius:6px">'+
        '💼 '+pn+' 在职：<b>'+(cjob?cjob.title:'岗位')+'</b> @ '+cco.name+'</div>';
    }
  }
  const scamSide=getScamSideEmploymentDisplay();
  if(scamSide){
    html+='<div class="daily-employ" style="font-size:.78rem;margin-bottom:8px;padding:6px 10px;background:rgba(210,153,34,.08);border:1px solid var(--orange);border-radius:6px">'+
      '💼 暗线：<span style="color:var(--orange)">⚠ 传销诈骗岗</span> · 所属 <b>'+scamSide.company+'</b> · '+scamSide.title+
      ' · 「'+scamSide.product+'」'+scamSide.sold+'/'+scamSide.quota+
      ' <span class="fold-meta">（明面上班弹窗：📒外呼1h · 📞集中2h · 🛒套餐2h）</span>'+
      ' <button type="button" class="btn btn-warn" style="font-size:.68rem;padding:2px 8px;margin-left:6px" onclick="confirmScamSideJobResign()">脱身</button></div>';
  }
  return html;
}
function renderAllnightStreakRow(){
  const ps=getAllnightStreak(),cs=getCompanionAllnightStreak();
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  let t='你：'+(ps?'已连续通宵未睡 '+ps+' 天':'未通宵');
  if(game.married&&!game.divorced)t+=' · '+pn+'：'+(cs?'已连续通宵未睡 '+cs+' 天':'未通宵');
  return '<p style="color:var(--orange);font-size:.72rem;margin:0 0 6px">'+t+'</p>';
}

function defaultDailyState(){
  return{dayIndex:0,phase:'morning',workSkipDays:0,workedDays:0,weekWorkWarned:false,workedToday:false,jobHuntedToday:false,jobHuntCount:0,jobHuntBySlot:{},jobSubMenu:null,jobInboxReturnTo:null,dailyPickApp:null,dailyPickJobIdxs:[],subMenu:null,
    slotHoursUsed:0,slotSexUsed:false,slotMasturbateUsed:false,slotSnackUsed:false,snackPortionsToday:0,partnerSnackPortionsToday:0,
    slotContactsUsed:{},slotNoAnswerContacts:{},slotActivity:null,inOvertime:false,overtimeSlack:0,overtimeDidAction:false,overtimeLastAction:null,
    morningWorkDone:false,eveningShiftDone:false,allnightShiftDone:false,eveningOtTried:false,phoneSwitchedThisSlot:false,
    allnightDay:false,noHomeReturnDay:false,partnerRecallResolved:false,
    partnerOutForFun:false,partnerPresenceRolled:false,partnerInviteOutChecked:false,partnerInviteOutResolved:false,playerCalledPartnerHome:false,
    partnerAllnightActive:false,partnerForcedAsleep:false,partnerAllnightStayedOut:false,allnightEndModalShown:false,eveningEndModalShown:false,partnerCatchUpSleep:false,companionMorningSkipLogged:false,allnightArrivalPending:false,villaPartyUsed:false};
}
function dailySlotHoursLeft(){
  const d=game&&game.daily;return SLOT_HOURS_TOTAL-((d&&d.slotHoursUsed)||0);
}
function dailySlotHoursLabel(){
  const left=dailySlotHoursLeft(),used=SLOT_HOURS_TOTAL-left;
  return '本时段 <b>'+used+'</b>/'+SLOT_HOURS_TOTAL+'h · 剩 '+left+'h';
}
function getDailyCalendarDateStr(){
  if(!game)return '';
  const w=game.week||0;
  const dayIdx=game.daily?Math.min(game.daily.dayIndex||0,6):0;
  let d;
  if(typeof getGameStartDate==='function')d=getGameStartDate();
  else d=new Date(typeof START_DATE!=='undefined'?START_DATE:new Date(2024,0,1));
  d=new Date(d.getTime());
  d.setDate(d.getDate()+w*7+dayIdx);
  return d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日';
}
function playerRomanceStatusLabel(){
  if(!game)return '单身';
  if(game.spouseDeceased)return '丧偶';
  if(game.divorced)return '离异';
  if(game.married&&!game.divorced)return '已婚';
  if(game.contacts&&game.contacts.some(function(c){
    return c&&c.intimateRelation&&!c.dead&&c.kind!=='spouse'&&c.kind!=='ex_spouse'&&c.kind!=='parents'&&c.kind!=='father'&&c.kind!=='mother';
  }))return '恋爱';
  return '单身';
}
function renderActionTip(){
  const el=document.getElementById('actionTip');
  if(!el||!game)return;
  const dateStr=getDailyCalendarDateStr();
  const age=typeof getPlayerAge==='function'?getPlayerAge():'—';
  const romance=playerRomanceStatusLabel();
  el.innerHTML='<b>'+dateStr+'</b> · '+age+'岁 · '+romance;
}
function renderDailyTimeBar(){
  const el=document.getElementById('dailyTimeBar');
  if(!el||!game||!game.daily)return;
  const show=typeof currentTab!=='undefined'&&(currentTab==='daily'||currentTab==='job'||currentTab==='sideincome');
  el.style.display=show?'block':'none';
  if(!show)return;
  const d=ensureDailyState();
  const day=Math.min(d.dayIndex,6);
  const phase=d.phase||'morning';
  el.innerHTML='<div class="daily-hdr"><b>第'+(game.week+1)+'周</b> · '+DAY_NAMES[day]+' · '+PHASE_LABELS[phase]+' · '+dailySlotHoursLabel()+'</div>';
}
function resetDailySlotFlags(keepPartnerPresence){
  const d=ensureDailyState();if(!d)return;
  d.slotHoursUsed=0;d.slotSexUsed=false;d.slotMasturbateUsed=false;d.slotSnackUsed=false;
  d.slotActivity=null;d.inOvertime=false;d.phoneSwitchedThisSlot=false;
  d.affairReservedThisSlot=false;d.affairDoneThisSlot=false;
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
    if(typeof tickCompanyStrategyDaily==='function')tickCompanyStrategyDaily();
    advanceDailyPhase('evening');
    return;
  }
  else if(ph==='evening'){
    const d=game.daily;
    if(d){
      d.slotHoursUsed=SLOT_HOURS_TOTAL;
      d.subMenu=null;
      d.slotActivity=null;
      d.inOvertime=false;
      d.inKpiOvertime=false;
    }
    addLog('🌙 今晚 '+SLOT_HOURS_TOTAL+'h 已过，请选择睡觉或进入后半夜','warn');
    renderDailyPanel();updateUI();
    if(typeof promptEveningEndChoiceIfNeeded==='function')promptEveningEndChoiceIfNeeded();
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
  if(ph==='evening'&&dailySlotBlocked()){
    addLog('今晚时间已用尽，请选择睡觉或进入后半夜','warn');
    if(typeof promptEveningEndChoiceIfNeeded==='function')promptEveningEndChoiceIfNeeded();
    else renderDailyPanel();
    return;
  }
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
  if(menu==='out'||menu==='home'){
    game.myLifeOpen=true;
  }
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
function eveningEndChoicePending(){
  const d=game&&game.daily;
  if(!d||d.phase!=='evening'||!dailySlotBlocked())return false;
  /* 时段已满必须选作息；清掉可能残留的上班/加班标记，避免睡不了 */
  if(d.slotActivity==='work'||d.slotActivity==='overtime')d.slotActivity=null;
  if(d.inOvertime)d.inOvertime=false;
  if(d.inKpiOvertime)d.inKpiOvertime=false;
  return true;
}
function renderEveningEndChoiceRows(){
  if(!eveningEndChoicePending())return '';
  const fromSlack=!!(game&&game._eveningEndAfterSlackSocial);
  if(game)game._eveningEndAfterSlackSocial=false;
  let h='<div class="evening-end-choice" style="margin:10px 0;padding:10px;border:1px solid var(--orange);border-radius:8px;background:rgba(240,136,62,.06)">';
  h+='<p style="color:var(--orange);font-size:.85rem;margin:0 0 6px">'+(fromSlack?'🍻 联谊后回家 · ':'')+'今晚 8h 已用尽</p>';
  h+='<p class="fold-meta" style="margin:0 0 8px">请在下方选择：睡觉进入次日白天，或不睡进入后半夜（金色时段 · 压力+10）</p>';
  h+='<button class="btn btn-primary" onclick="confirmEveningEndChoice(\'sleep\')">😴 睡觉（次日白天）</button> ';
  h+='<button class="btn btn-warn" onclick="confirmEveningEndChoice(\'allnight\')">🌙 不睡，进入后半夜（+8h · 压力+10）</button>';
  h+='</div>';
  return h;
}
function companionAllnightEndChoiceLabel(choice){
  if(choice==='rested')return '😴 昨夜已入睡（白天正常起床）';
  return choice==='sleep'?'😴 第二天白天补觉':'☀ 通宵不睡';
}
function ensureCompanionEndChoicePreview(){
  if(typeof isPartnerAllnightSleeping==='function'&&isPartnerAllnightSleeping())return 'rested';
  if(game._companionSleepChoice!=null)return game._companionSleepChoice;
  if(game.daily&&game.daily.phase==='allnight'&&game.lastCompanionAllnightSleepChoice)
    return game.lastCompanionAllnightSleepChoice;
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
    return '<p style="color:var(--muted);font-size:.72rem;margin:6px 0 0">'+pn+'：😴 睡梦中（已休息 · 白天正常起床）</p>';
  }
  if(game.companionAllnightChoiceResolved&&game.lastCompanionAllnightSleepChoice){
    return '<p style="color:var(--orange);font-size:.72rem;margin:6px 0 0">'+pn+' 的选择：<b>'+companionAllnightEndChoiceLabel(game.lastCompanionAllnightSleepChoice)+'</b></p>';
  }
  const c=ensureCompanionEndChoicePreview();
  const outNote=(d.partnerAllnightStayedOut||d.partnerOutForFun)?' · 在外面玩了一宿':'';
  return '<p style="color:var(--orange);font-size:.72rem;margin:6px 0 0">'+pn+' 的选择：<b>'+companionAllnightEndChoiceLabel(c)+'</b>'+outNote+'</p>';
}
function resolvePartnerAllnightEndChoice(){
  if(!game.married||game.divorced||game.longDistance)return null;
  if(game.companionAllnightChoiceResolved){
    return game.lastCompanionAllnightSleepChoice||'nosleep';
  }
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
      partnerHtml='<p style="margin-top:8px">'+pn+'：<b>😴 睡梦中</b>（已休息 · 白天正常起床）</p>';
    }else if(game.companionAllnightChoiceResolved&&game.lastCompanionAllnightSleepChoice){
      partnerHtml='<p style="margin-top:8px">'+pn+' 的选择：<b>'+companionAllnightEndChoiceLabel(game.lastCompanionAllnightSleepChoice)+'</b></p>';
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
  clearCompanionAllnightStreak();
  d.allnightEndModalShown=false;
  d.partnerAllnightActive=false;
  d.partnerForcedAsleep=false;
  d.partnerAllnightStayedOut=false;
  d.phase='morning';
  d.workedToday=false;
  activatePartnerCatchUpSleep('sleep');
  if(typeof tickCompanionMorningCatchUp==='function')tickCompanionMorningCatchUp();
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
  d.companionMorningSkipLogged=false;
  if(!game.married||game.divorced||game.longDistance)return;
  if(compChoice==='rested')return;
  if(compChoice!=='sleep'&&!game.pendingPartnerCatchUpSleep)return;
  if(d.partnerAllnightStayedOut)return;
  d.partnerOutForFun=false;
  d.partnerCatchUpSleep=true;
  d.partnerPresenceRolled=false;
  d._partnerPresencePhase=null;
  game.pendingPartnerCatchUpSleep=false;
}
function activatePartnerCatchUpSleep(compChoice){
  const choice=compChoice||game.lastCompanionAllnightSleepChoice;
  if(choice==='sleep'||game.pendingPartnerCatchUpSleep)applyPartnerCatchUpSleepIfEligible('sleep');
}
function companionNextDayIndex(){
  const d=game&&game.daily;
  const di=d?d.dayIndex:0;
  return di>=6?0:di+1;
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
  const nextDay=companionNextDayIndex();
  if(typeof isCompanionWorkSlotForDay==='function'&&isCompanionWorkSlotForDay('morning',nextDay)&&game.companion&&game.companion.employed){
    return Math.random()<0.42?'sleep':'nosleep';
  }
  return Math.random()<0.32?'nosleep':'sleep';
}
function resolveCompanionSleepChoice(choice){
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const d=game.daily;
  game.lastCompanionAllnightSleepChoice=choice;
  game.companionAllnightChoiceResolved=true;
  if(choice==='rested'){
    game.pendingPartnerCatchUpSleep=false;
    setCompanionAllnightStreak(0);
    if(d){
      d.partnerForcedAsleep=false;
      d.partnerCatchUpSleep=false;
      d.companionMorningSkipLogged=false;
    }
    addLog('😴 '+pn+'昨夜已入睡，白天正常起床','info');
    return;
  }
  if(choice==='sleep'){
    setCompanionAllnightStreak(0);
    game.pendingPartnerCatchUpSleep=true;
    if(d&&d.phase==='morning')activatePartnerCatchUpSleep('sleep');
    addLog('😴 '+pn+'选择第二天白天补觉','info');
    return;
  }
  game.pendingPartnerCatchUpSleep=false;
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
function showOvertimeFailModal(msg,backFn){
  if(typeof showConsumeModalHandlers!=='function'){
    addLog(msg,'fail');
    if(backFn)backFn();
    return;
  }
  showConsumeModalHandlers({
    icon:'🏢',title:'无法操作',
    html:'<p style="margin:0">'+msg+'</p>',
    buttons:[{text:'知道了',primary:true,handler:backFn||function(){if(typeof closeConsumeModal==='function')closeConsumeModal(true);}}]
  });
}
function showOvertimeResultModal(icon,title,html,buttons){
  if(typeof showConsumeModalHandlers!=='function'){
    if(html)addLog(title,'info');
    if(buttons&&buttons[0]&&buttons[0].handler)buttons[0].handler();
    return;
  }
  showConsumeModalHandlers({icon:icon||'🏢',title:title||'加班',html:html||'',buttons:buttons});
}
function overtimeConsumeHours(h){
  const d=ensureDailyState();
  if(!d||!d.inOvertime)return false;
  if(!dailyCanUseHours(h))return false;
  const prev=d.slotHoursUsed||0;
  d.slotHoursUsed=Math.min(SLOT_HOURS_TOTAL,prev+h);
  maybePartnerSleepOnAllnightDevilStart(prev,d.slotHoursUsed);
  if(typeof consumeModalOpen==='undefined'||!consumeModalOpen)renderDailyPanel();
  return true;
}
function buildOvertimeModalButtons(){
  const d=game.daily;
  const left=dailySlotHoursLeft();
  const buttons=[];
  if(d&&!d.overtimePhoneDone){
    buttons.push({text:'📞 打电话（仅一次 · 不占时）',handler:overtimePhoneCall});
  }
  if(d&&!d.overtimeSlackDone&&!d.overtimeGrindDone&&left>=OT_SLACK_HOURS){
    buttons.push({text:'摸鱼（'+OT_SLACK_HOURS+'h · 压力-1 · 可早回家剩 '+OT_SLACK_HOME_HOURS+'h）',handler:overtimeSlack});
  }
  if(d&&!d.overtimeGrindDone&&!d.overtimeSlackDone&&left>=OT_GRIND_HOURS){
    buttons.push({text:'努力加班（'+OT_GRIND_HOURS+'h · 压力+1 · 可能加班费）',handler:overtimeGrind});
  }
  if(d&&d.overtimeDidAction){
    buttons.push({text:'收工回家',primary:true,handler:requestFinishOvertime});
  }
  if(!buttons.length){
    buttons.push({text:'收工回家',primary:true,handler:requestFinishOvertime});
  }
  return buttons;
}
function showOvertimeChoiceModal(){
  const d=ensureDailyState();
  const ot=getEmploymentOtProfile();
  d.inOvertime=true;
  d.slotActivity='overtime';
  const hint=ot?'<p class="fold-meta" style="margin:0 0 6px">本岗：'+ot.otLabel+' · 加班费概率约 '+fmtOtPct(ot.otPayProb)+'</p>':'';
  const timeLine=typeof dailySlotHoursLine==='function'?dailySlotHoursLine():'';
  let doneNote='';
  if(d.overtimeDidAction){
    doneNote='<p class="fold-meta" style="margin:6px 0 0;color:var(--green)">已选 '+ (d.overtimeLastAction==='grind'?'努力 '+OT_GRIND_HOURS+'h':'摸鱼 '+OT_SLACK_HOURS+'h') +' · 点「收工回家」</p>';
  }else{
    doneNote='<p class="fold-meta" style="margin:6px 0 0">努力 '+OT_GRIND_HOURS+'h 或摸鱼 '+OT_SLACK_HOURS+'h（二选一）· 电话仅一次不占时 · 收工后可能遇到联谊</p>'+
      '<p class="fold-meta" style="margin:4px 0 0">不联谊：努力→午夜前回家；摸鱼→剩 '+OT_SLACK_HOME_HOURS+'h 早回家 · 努力+联谊→后半夜彩虹</p>';
  }
  const html=hint+(timeLine?'<p class="fold-meta" style="margin:0 0 6px">'+timeLine+'</p>':'')+'<p style="margin:0">你在公司加班。</p>'+doneNote;
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({icon:'🏢',title:'加班中',html:html,buttons:buildOvertimeModalButtons()});
    return;
  }
  const legacy=buildOvertimeModalButtons().map(b=>({
    text:b.text,primary:b.primary,
    fn:b.handler===overtimeSlack?'overtimeSlack()':b.handler===overtimeGrind?'overtimeGrind()':b.handler===overtimePhoneCall?'overtimePhoneCall()':'requestFinishOvertime()'
  }));
  showConsumeModal({icon:'🏢',title:'加班中',html:html,buttons:legacy});
}
function overtimeSlack(){
  const d=ensureDailyState();
  if(!d||!d.inOvertime)return;
  if(d.overtimeSlackDone||d.overtimeGrindDone){showOvertimeFailModal('本轮已选过加班方式');return}
  if(!dailyCanUseHours(OT_SLACK_HOURS)){
    showOvertimeFailModal('本时段只剩 '+dailySlotHoursLeft()+'h，无法摸鱼 '+OT_SLACK_HOURS+'h');
    return;
  }
  if(!overtimeConsumeHours(OT_SLACK_HOURS))return;
  addStress(-1,'摸鱼 ');
  d.overtimeSlack=(d.overtimeSlack||0)+1;
  d.overtimeSlackDone=true;
  d.overtimeDidAction=true;
  d.overtimeLastAction='slack';
  showOvertimeResultModal('🐟','摸鱼 · '+OT_SLACK_HOURS+'h',
    '<p>🐟 摸鱼 '+OT_SLACK_HOURS+'h · <b style="color:var(--green)">压力 -1</b></p>'+
    '<p class="fold-meta">被裁风险上升 · 若不联谊可早回家 · 还剩 '+OT_SLACK_HOME_HOURS+'h</p>'+
    '<p class="fold-meta" style="margin-top:6px">点「知道了」后收工或继续（如尚未打电话）</p>',
    [{text:'知道了',primary:true,handler:showOvertimeChoiceModal}]);
}
function overtimeGrind(){
  const d=ensureDailyState();
  if(!d||!d.inOvertime)return;
  if(d.overtimeGrindDone||d.overtimeSlackDone){showOvertimeFailModal('本轮已选过加班方式');return}
  if(!dailyCanUseHours(OT_GRIND_HOURS)){
    showOvertimeFailModal('本时段只剩 '+dailySlotHoursLeft()+'h，无法安排 '+OT_GRIND_HOURS+'h 努力加班');
    return;
  }
  if(!overtimeConsumeHours(OT_GRIND_HOURS))return;
  addStress(1,'拼命 ');
  d.overtimeGrindDone=true;
  d.overtimeDidAction=true;
  d.overtimeLastAction='grind';
  d.slotHoursUsed=SLOT_HOURS_TOTAL;
  const ot=getEmploymentOtProfile();
  const payProb=ot?ot.otPayProb:0.42;
  const payMult=ot?ot.otPayMult||1:1;
  let payLine='💼 努力加了 '+OT_GRIND_HOURS+'h，没有额外报酬';
  if(Math.random()<payProb){
    const bonus=Math.round((200+Math.floor(Math.random()*1200))*payMult);
    game.cash+=bonus;game.money+=bonus;
    payLine='<b style="color:var(--green)">💰 加班费 +¥'+bonus.toLocaleString()+'</b> · 已加 '+OT_GRIND_HOURS+'h';
  }
  showOvertimeResultModal('💼','努力加班 · '+OT_GRIND_HOURS+'h',
    '<p>'+payLine+'</p>'+
    '<p class="fold-meta" style="margin-top:8px">压力 +1 · 今晚 '+OT_GRIND_HOURS+'h 已满 · 不收工联谊则午夜前回家</p>',
    [{text:'收工回家',primary:true,handler:requestFinishOvertime}]);
}
function overtimePhoneCall(){
  const d=ensureDailyState();
  if(!d||!d.inOvertime)return;
  if(d.overtimePhoneDone){showOvertimeFailModal('加班电话本轮只能打一次');return}
  showOvertimePhonePicker();
}
function showOvertimePhonePicker(){
  if(typeof openContactPicker!=='function'){
    addLog('无法打开通讯录','fail');
    showOvertimeChoiceModal();
    return;
  }
  const canPick=typeof canCallContactFromOvertime==='function'?canCallContactFromOvertime:canCallContact;
  openContactPicker({
    title:'加班打电话',
    hint:'仅一次 · 不占时 · 按组折叠 · 点「选择」拨号',
    filter:function(c){return canPick(c).ok;},
    onPick:function(c){overtimeCallContactPick(c.id);},
    onCancel:function(){showOvertimeChoiceModal();}
  });
}
function overtimeCallContactPick(id){
  const d=ensureDailyState();
  if(!d||!d.inOvertime)return;
  const c=game.contacts&&game.contacts.find(function(x){return x.id===id});
  if(!c){addLog('联系人不存在','fail');showOvertimeChoiceModal();return}
  const canPick=typeof canCallContactFromOvertime==='function'?canCallContactFromOvertime:canCallContact;
  const chk=canPick(c);
  if(!chk.ok){showOvertimeFailModal(chk.reason,showOvertimeChoiceModal);return}
  d.overtimePhoneDone=true;
  game._resumeOvertimeAfterModal=true;
  if(typeof callContact==='function')callContact(id,true);
  else showOvertimeChoiceModal();
}
function requestFinishOvertime(){
  const d=ensureDailyState();
  if(!d||!d.inOvertime)return;
  if(!d.overtimeDidAction){
    showOvertimeFailModal('至少先摸鱼或拼命 '+OT_SLACK_HOURS+'/'+OT_GRIND_HOURS+'h 再收工');
    return;
  }
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
  addLog(label||('🚪 收工回家 · 午夜前 · 今晚 '+SLOT_HOURS_TOTAL+'h 已满'),'info');
  renderDailyPanel();updateUI();autoSaveSlot();
}
function finishOvertimeSlackSocial(){
  if(game)game._eveningEndAfterSlackSocial=true;
  const d=ensureDailyState();
  d.inOvertime=false;
  d.slotActivity=null;
  d.slotHoursUsed=SLOT_HOURS_TOTAL;
  addLog('🍻 摸鱼收工后联谊 · 午夜前回家（摸鱼 '+OT_SLACK_HOURS+'h + 联谊 '+OT_SLACK_HOME_HOURS+'h）','info');
  renderDailyPanel();updateUI();autoSaveSlot();
}
function finishOvertimeEveningPartial(){
  const d=ensureDailyState();
  d.inOvertime=false;
  d.slotActivity=null;
  d.slotHoursUsed=OT_SLACK_HOURS;
  addLog('🚪 收工早回家 · 午夜前 · 还剩 '+OT_SLACK_HOME_HOURS+'h 在家','info');
  renderDailyPanel();updateUI();autoSaveSlot();
}
function showOvertimeAllnightArrivalModal(){
  const d=game&&game.daily;
  if(!d||!d.allnightArrivalPending)return;
  const html='努力加班后的联谊已在<b>金色时段</b>结束，回到家已是后半夜。<br><span class="fold-meta">😴 赶紧睡 → 次日清晨（+1压力）；🌈 不睡 → 彩虹时段通宵（剩4h · 不可外出）</span>';
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
    clearCompanionAllnightStreak();
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
  if(!eveningEndChoicePending())return;
  if(typeof consumeModalOpen!=='undefined'&&consumeModalOpen)return;
  if(typeof hasPendingEncounterModals==='function'&&hasPendingEncounterModals())return;
  const d=game.daily;
  if(d&&d.eveningEndModalShown)return;
  if(d)d.eveningEndModalShown=true;
  const fromSlack=!!(game&&game._eveningEndAfterSlackSocial);
  if(game)game._eveningEndAfterSlackSocial=false;
  const html='<p style="color:var(--orange);margin:0 0 6px">'+(fromSlack?'🍻 联谊后回家 · ':'')+'今晚 '+SLOT_HOURS_TOTAL+'h 已用尽</p>'+
    '<p class="fold-meta" style="margin:0">必须选择：睡觉进入次日白天，或不睡进入后半夜（金色时段 · 压力+10）</p>';
  const sleepFn=function(){if(typeof closeConsumeModal==='function')closeConsumeModal(true);confirmEveningEndChoice('sleep');};
  const allnightFn=function(){if(typeof closeConsumeModal==='function')closeConsumeModal(true);confirmEveningEndChoice('allnight');};
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:'🌙',title:'今晚时间已用尽',html:html,
      buttons:[
        {text:'😴 睡觉（次日白天）',primary:true,handler:sleepFn},
        {text:'🌙 不睡，进入后半夜',handler:allnightFn}
      ]
    });
    return;
  }
  renderDailyPanel();
}
function promptEveningEndChoiceIfNeeded(){
  if(!eveningEndChoicePending())return;
  setTimeout(function(){if(typeof showEveningEndChoiceModal==='function')showEveningEndChoiceModal()},60);
}
function confirmEveningEndChoice(choice){
  if(typeof consumeModalOpen!=='undefined'&&consumeModalOpen)closeConsumeModal();
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
function workShiftConsumeHours(h,label){
  const d=ensureDailyState();
  if(!d||game.gameOver)return false;
  if(d.inOvertime||d.slotActivity==='overtime')return false;
  if(!isPlayerOnWorkShift())return false;
  if(!dailyCanUseHours(h))return false;
  const prev=d.slotHoursUsed||0;
  d.slotHoursUsed=Math.min(SLOT_HOURS_TOTAL,prev+h);
  maybePartnerSleepOnAllnightDevilStart(prev,d.slotHoursUsed);
  renderDailyPanel();
  return true;
}
function workShiftAfterAction(){
  if(!isPlayerOnWorkShift())return;
  const d=ensureDailyState();
  if((d.slotHoursUsed||0)>=SLOT_HOURS_TOTAL){
    if(typeof finishWorkShift==='function')finishWorkShift();
    return;
  }
  if(typeof returnToWorkShiftModal==='function')returnToWorkShiftModal();
}
function finishWorkShift(){
  closeConsumeModal();
  if(game&&game.daily){
    game.daily.slotActivity=null;
    game.daily.inOvertime=false;
    if((game.daily.slotHoursUsed||0)<SLOT_HOURS_TOTAL)game.daily.slotHoursUsed=SLOT_HOURS_TOTAL;
  }
  showWorkOffModal('下班了','打卡下班，收拾东西准备离开。');
}
function isPlayerOnWorkShift(){
  if(!game||!game.employed||!game.daily)return false;
  const d=game.daily;
  return !!(d.inOvertime||d.slotActivity==='work'||d.slotActivity==='overtime');
}
function returnToWorkShiftModal(){
  if(!isPlayerOnWorkShift())return;
  setTimeout(function(){
    if(!game||!game.daily||!isPlayerOnWorkShift())return;
    if(game.daily.inOvertime||game.daily.slotActivity==='overtime'){
      if(typeof showOvertimeChoiceModal==='function')showOvertimeChoiceModal();
    }else if(typeof showWorkShiftModal==='function'){
      showWorkShiftModal(false);
    }
  },60);
}
function showWorkShiftActionResult(icon,title,html){
  const resume=function(){
    if(typeof closeConsumeModal==='function')closeConsumeModal(true);
    if(typeof workShiftAfterAction==='function')workShiftAfterAction();
    else if(typeof returnToWorkShiftModal==='function')returnToWorkShiftModal();
  };
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:icon||'💼',title:title||'结果',html:html||'',
      buttons:[{text:'继续上班',primary:true,handler:resume}]
    });
    return;
  }
  showConsumeModal({
    icon:icon||'💼',title:title||'结果',html:html||'',
    buttons:[{text:'继续上班',primary:true,fn:'closeConsumeModal(true);returnToWorkShiftModal()'}]
  });
}
function showWorkShiftModal(useOvertimeFlow){
  if(useOvertimeFlow){
    const d=ensureDailyState();
    d.overtimeDidAction=false;
    d.overtimeLastAction=null;
    d.overtimeSlackDone=false;
    d.overtimeGrindDone=false;
    d.overtimePhoneDone=false;
    showOvertimeChoiceModal();
    return;
  }
  const job=game.employed&&game.employment?game.market[game.employment.jobIdx]:null;
  const co=game.employment&&game.employment.company;
  if(!job){dailyAdvanceAfterSlotAction();return}
  let html='';
  if(typeof getScamEmployerDisplay==='function'){
    const scam=getScamEmployerDisplay();
    if(scam){
      html='<span style="color:var(--orange)">⚠ 传销诈骗岗</span> · 所属 <b>'+scam.company+'</b> · '+scam.title+
        '<br><span class="fold-meta">推销「'+scam.product+'」'+scam.sold+'/'+scam.quota+' · 下方三键：📒单人外呼(1h) · 📞集中外呼(2h) · 🛒推销套餐(2h)</span>';
    }
  }
  if(!html)html='<b>'+job.title+'</b>'+(co?' @ '+co.name:'')+'<br><span class="fold-meta">处理手头工作，忙完点下班</span>';
  if(typeof dailySlotHoursLine==='function')html+='<p class="fold-meta" style="margin:6px 0 0">'+dailySlotHoursLine()+' · 各项操作占时，满 '+SLOT_HOURS_TOTAL+'h 自动下班</p>';
  if(typeof idealWorkShiftHtml==='function')html+=idealWorkShiftHtml();
  const buttons=[{text:'下班',primary:true,fn:'finishWorkShift()'}];
  if(typeof idealWorkShiftButtons==='function'){
    const extra=idealWorkShiftButtons();
    if(extra&&extra.length)extra.forEach(function(b){buttons.unshift(b);});
  }
  if(typeof workplaceGossipShiftButtons==='function'){
    const wg=workplaceGossipShiftButtons();
    if(wg&&wg.length)wg.forEach(function(b){buttons.unshift(b);});
  }
  if(typeof scamWorkShiftButtons==='function'){
    const sg=scamWorkShiftButtons();
    if(sg&&sg.length)sg.forEach(function(b){buttons.unshift(b);});
  }
  if(typeof scamWorkShiftHtml==='function')html+=scamWorkShiftHtml();
  showConsumeModal({
    icon:'💼',title:'上班中',
    html:html,
    buttons:buttons
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
  const leisureModal=function(icon,title,html){
    if(typeof showConsumeModal!=='function'){addLog(title+' · '+html.replace(/<[^>]+>/g,''),'info');return;}
    showConsumeModal({icon:icon,title:title,html:html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
  };
  try{
  if(hours===SLOT_BATCH_HOURS){
    if(!dailyCanUseHours(SLOT_BATCH_HOURS))return;
    const html=dailyRunScrollSessions(fn,SLOT_BATCH_HOURS);
    dailyAddHours(SLOT_BATCH_HOURS,true);
    leisureModal('📱','连刷8小时',(html||'活动已完成')+'<br><span style="color:var(--green)">时段已满，进入下一时段</span>');
    if(fn==='consumeFlirt'&&typeof rollPartnerCaughtAffair==='function')rollPartnerCaughtAffair('flirt');
    if(fn!=='consumeFlirt'&&typeof recordScrollMediaHours==='function')recordScrollMediaHours(SLOT_BATCH_HOURS);
    return;
  }
  if(!dailyCanUseHours(1))return;
  const html=dailyRunScrollSessions(fn,1);
  dailyAddHours(1,false);
  leisureModal('📱','1小时',html||'活动已完成');
  if(fn==='consumeFlirt'&&typeof rollPartnerCaughtAffair==='function')rollPartnerCaughtAffair('flirt');
  }catch(e){
    console.error('dailyLeisureScroll',fn,e);
    addLog('宅家休闲异常：'+(e.message||e),'fail');
    leisureModal('⚠','活动异常','请 F12 查看控制台，或 Ctrl+F5 强刷后重试');
  }
  if(fn!=='consumeFlirt'&&typeof recordScrollMediaHours==='function')recordScrollMediaHours(1);
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
    '被查：未发现情人仅压力+2 · 发现情人亲-5压+5约45%离婚';
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
    if(!s.refPrice||s.refPrice<=0)s.refPrice=ref;
    const floor=ref*0.55;
    const ceil=ref*1.45;
    const span=Math.max(ceil-floor,ref*0.08,0.01);
    const fluxMod=typeof fluxStockDriftModifier==='function'?fluxStockDriftModifier(s):0;
    const pos=Math.max(0,Math.min(1,(s.price-floor)/span));
    const reversion=(0.5-pos)*0.02;
    let ch=(Math.random()-.48+wolfDrift+fluxMod+reversion)*0.058;
    let next=s.price*(1+ch);
    if(next<=floor){
      next=floor+(floor*0.006+ref*0.0015)*(0.35+Math.random()*0.9);
    }else if(next>=ceil){
      next=ceil-(ceil*0.006+ref*0.0015)*(0.35+Math.random()*0.9);
    }
    next=Math.max(floor,Math.min(ceil,next));
    if(Math.abs(next-s.price)<ref*0.00025)next=s.price*(1+(Math.random()>.5?1:-1)*ref*0.0009);
    s.price=next;
    s.history.push(s.price);if(s.history.length>60)s.history.shift();
  });
  if(typeof syncFluxStocksFromMarket==='function')syncFluxStocksFromMarket();
  if(typeof tickPlayerCompanyStockWealth==='function')tickPlayerCompanyStockWealth();
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
  if(menu==='job'){
    if(game.daily&&game.daily.slotActivity==='out'){addLog('外出占用整个时段，请回宅后再应聘','fail');return}
    if(game.daily&&game.daily.phase==='allnight'&&dailySlotBlocked()){
      addLog('本通宵 '+SLOT_HOURS_TOTAL+'h 已满，请选择作息','fail');return;
    }
    if(typeof showTab==='function'){showTab('job');return}
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
  d.subMenu=null;
  renderDailyPanel();
}
function resetDailyWorkFlags(){
  const d=ensureDailyState();if(!d)return;
  d.morningWorkDone=false;
  d.eveningShiftDone=false;
  d.allnightShiftDone=false;
  d.eveningOtTried=false;
}
function ensureDailyWorkFlagsConsistent(){
  const d=game&&game.daily;if(!d)return;
  if(d.phase==='morning'&&(d.slotHoursUsed||0)===0&&!d.workedToday&&d.morningWorkDone){
    d.morningWorkDone=false;
  }
}
function playerCanAttemptWorkNow(){
  if(typeof playerEmployerOwnerImmune==='function'&&playerEmployerOwnerImmune())return false;
  if(!game||!game.employed)return false;
  if(typeof canPlayerWorkWeek==='function'&&!canPlayerWorkWeek())return false;
  if(typeof isStressMindBlocked==='function'&&isStressMindBlocked()&&game.employment){
    const j=game.market[game.employment.jobIdx];
    if(j&&typeof isManualJob==='function'&&!isManualJob(j))return false;
  }
  return true;
}
function isWorkShiftRequired(phase){
  if(typeof playerEmployerOwnerImmune==='function'&&playerEmployerOwnerImmune())return false;
  if(!game||!game.employed||!game.daily)return false;
  phase=phase||(game.daily.phase);
  if(phase==='morning')return isScheduledWorkSlot('morning');
  if(phase==='evening'){
    if(typeof eveningEndChoicePending==='function'&&eveningEndChoicePending())return false;
    if(isScheduledWorkSlot('evening'))return true;
    if(!isWeekendDay(game.daily.dayIndex)&&game.daily.workedToday)return true;
    return false;
  }
  if(phase==='allnight')return isScheduledWorkSlot('allnight');
  return false;
}
function isWorkChoiceOffered(phase){
  const d=game.daily;
  if(!d||!isWorkShiftRequired(phase))return false;
  return (d.slotHoursUsed||0)===0;
}
function shouldMarkWorkSkipNow(){
  if(!isWorkShiftRequired())return false;
  const d=game.daily,ph=d.phase;
  if(ph==='morning')return !d.morningWorkDone;
  if(ph==='evening'){
    if(isScheduledWorkSlot('evening'))return !d.eveningShiftDone;
    if(!isWeekendDay(d.dayIndex)&&d.workedToday&&!d.eveningOtTried)return true;
  }
  if(ph==='allnight')return !d.allnightShiftDone;
  return false;
}
function markWorkSkipForPhase(){
  const d=game.daily,ph=d.phase;
  if(!game.employed||!shouldMarkWorkSkipNow())return;
  if(ph==='morning'&&!d.morningWorkDone){
    recordMonthlyAbsence('白天未上班');
    d.workSkipDays=(d.workSkipDays||0)+1;
    d.workedToday=false;
    d.morningWorkDone=true;
    addLog('🛋 '+skipWorkLabel()+'（本周第'+d.workSkipDays+'天未上班）','warn');
  }else if(ph==='evening'){
    if(isScheduledWorkSlot('evening')&&!d.eveningShiftDone){
      recordMonthlyAbsence('晚班未上');
      d.workSkipDays=(d.workSkipDays||0)+1;
      d.eveningShiftDone=true;
      addLog('🛋 缺勤晚班（本周第'+d.workSkipDays+'天）','warn');
    }else if(!isWeekendDay(d.dayIndex)&&d.workedToday&&!d.eveningOtTried){
      recordMonthlyAbsence('未去加班');
      d.eveningOtTried=true;
      addLog('🛋 今晚没去公司加班','warn');
    }
  }else if(ph==='allnight'&&!d.allnightShiftDone){
    recordMonthlyAbsence('后半夜班未上');
    d.workSkipDays=(d.workSkipDays||0)+1;
    d.allnightShiftDone=true;
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
  else if(action==='clean'&&typeof dailyCleanHome==='function')dailyCleanHome();
  else if(action==='villa_tea'&&typeof dailyVillaTea==='function')dailyVillaTea();
  else if(action==='villa_swim'&&typeof dailyVillaSwim==='function')dailyVillaSwim();
  else if(action==='villa_library'&&typeof dailyVillaLibrary==='function')dailyVillaLibrary();
  else if(action==='villa_meditate'&&typeof dailyVillaMeditate==='function')dailyVillaMeditate();
  else if(action==='villa_cinema'&&typeof dailyVillaCinema==='function')dailyVillaCinema();
  else if(action==='villa_party'&&typeof dailyVillaParty==='function')dailyVillaParty();
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
  else if(action==='clean'&&typeof dailyCleanHome==='function')dailyCleanHome();
  else if(action==='villa_tea'&&typeof dailyVillaTea==='function')dailyVillaTea();
  else if(action==='villa_swim'&&typeof dailyVillaSwim==='function')dailyVillaSwim();
  else if(action==='villa_library'&&typeof dailyVillaLibrary==='function')dailyVillaLibrary();
  else if(action==='villa_meditate'&&typeof dailyVillaMeditate==='function')dailyVillaMeditate();
  else if(action==='villa_cinema'&&typeof dailyVillaCinema==='function')dailyVillaCinema();
  else if(action==='villa_party'&&typeof dailyVillaParty==='function')dailyVillaParty();
}
function dailyPlayConsole(){
  if(!game.ownsConsole){addLog('请先购买游戏机（生活消费）','fail');return}
  if(!dailyCanUseHours(2))return;
  const win=Math.random()<0.5;
  if(win){addStress(-1,'打游戏 ');addLog('🎮 打游戏大捷','success')}
  else{addStress(1,'打游戏 ');addLog('🎮 打游戏连跪','warn')}
  showConsumeModal({icon:'🎮',title:'游戏机 · 2小时',html:win?'大捷！压力 -1':'连跪… 压力 +1',buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
  if(typeof recordScrollMediaHours==='function')recordScrollMediaHours(2);
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
  if(typeof onArtifactComputerUse==='function')onArtifactComputerUse();
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
  if(typeof onArtifactHomeStay==='function')onArtifactHomeStay();
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
function isValidStatObj(s){
  return !!(s&&typeof s==='object'&&!Array.isArray(s)&&('body' in s||'mind' in s||'spirit' in s));
}
function ensurePlayerStatState(){
  if(!game)return;
  if(!isValidStatObj(game.stats)){
    game.stats=typeof rollRandomStats==='function'?rollRandomStats():{body:30,mind:30,spirit:30};
  }else if(typeof isLegacyFlatStats==='function'&&isLegacyFlatStats(game.stats)){
    game.stats=rollRandomStats();
  }
  if(!isValidStatObj(game.partnerStats)){
    game.partnerStats=typeof rollRandomStats==='function'?rollRandomStats():{body:30,mind:30,spirit:30};
  }else if(typeof isLegacyFlatStats==='function'&&isLegacyFlatStats(game.partnerStats)){
    game.partnerStats=rollRandomStats();
  }
  if(!isValidStatObj(game.tempStats))game.tempStats=defaultTempStats();
  if(!isValidStatObj(game.partnerTempStats))game.partnerTempStats=defaultTempStats();
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
  ensureCarState();
  ensurePhoneState();
  if(!game.playerGender)game.playerGender='male';
  if(!game.partnerGender)game.partnerGender='female';
  return game.daily;
}
function effStat(k){
  if(!game||!game.stats)return 0;
  if(!game.tempStats)game.tempStats=defaultTempStats();
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
function cycleStatSwingLabel(){
  return typeof CYCLE_STAT_SWING!=='undefined'?CYCLE_STAT_SWING:10;
}
function renderSubjectStatMods(who){
  const isPlayer=who==='player';
  const base=isPlayer?(game.stats||{}):(ensurePartnerStats()||{});
  const ts=isPlayer
    ?(game.tempStats||defaultTempStats())
    :((typeof ensurePartnerTempStats==='function'?ensurePartnerTempStats():null)||game.partnerTempStats||defaultTempStats());
  const cm=isPlayer
    ?(typeof getPlayerCycleStatMod==='function'?getPlayerCycleStatMod():0)
    :(typeof getPartnerCycleStatMod==='function'?getPartnerCycleStatMod():0);
  const cs=typeof cyclePhaseForSubject==='function'?cyclePhaseForSubject(who):null;
  const label=isPlayer?'你':(game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣'));
  const modCls=(v)=>v>0?'pos':v<0?'neg':'zero';
  const dimChip=(k)=>{
    const b=base[k]||0,t=ts[k]||0,c=cs?cm:0;
    const eff=Math.min(STAT_MAX,Math.max(0,b+t+c));
    let brk='基础'+b+' · 临时<span class="stat-mod '+modCls(t)+'">'+fmtTempDelta(t)+'</span>';
    if(cs&&c)brk+=' · 周期<span class="stat-mod '+modCls(c)+'">'+(c>0?'+':'')+c+'</span>';
    return '<span class="stat-dim"><span class="stat-name">'+STAT_LABEL[k]+'</span> <span class="stat-val">'+eff+'</span> <span class="stat-brk">（'+brk+'）</span></span>';
  };
  let phaseNote='';
  if(cs){
    const col=typeof cyclePhaseColor==='function'?cyclePhaseColor(cs.phase):'var(--muted)';
    const pl=typeof cyclePhaseLabel==='function'?cyclePhaseLabel(cs.phase):cs.phase;
    phaseNote=' <span style="color:'+col+'">🩸 '+pl+' 第'+cs.day+'/'+cs.len+'天</span>';
  }
  return '<div class="daily-stat-person"><div class="daily-stat-person-hdr"><b>'+label+'</b>'+phaseNote+'</div>'+
    '<div class="daily-stat-line">'+dimChip('body')+dimChip('mind')+dimChip('spirit')+'</div></div>';
}
function renderTempStatsHtml(){
  try{
    if(typeof ensurePlayerStatState==='function')ensurePlayerStatState();
    const swing=cycleStatSwingLabel();
    let h='<div class="daily-stat-panel" style="margin:6px 0;padding:8px 10px;border:1px dashed var(--border);border-radius:6px">';
    h+='<div class="daily-stat-hint">基础值不变 · 活动临时每项±'+TEMP_STAT_RANGE+'（持久累积）· 女性生理周期另计±'+swing+' · 求职看有效值</div>';
    h+=renderSubjectStatMods('player');
    if(game.married&&!game.divorced)h+=renderSubjectStatMods('partner');
    h+='</div>';
    return h;
  }catch(e){
    console.error('renderTempStatsHtml',e);
    return '<div class="daily-stat-panel" style="font-size:.72rem;color:var(--red);padding:6px">属性面板加载失败，请 F5 强刷</div>';
  }
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
function resetWeeklyDaily(){
  if(!game)return;
  game.daily=defaultDailyState();
  if(typeof autoLifeRunning==='undefined'||!autoLifeRunning)maybeTickStocksForDay(0);
}
function gameMonthKey(){
  const w=typeof WEEKS_PER_MONTH!=='undefined'?WEEKS_PER_MONTH:4;
  return Math.floor((game.week||0)/w);
}
function phoneSwitchBlockedThisMonth(){
  return game.phoneSwitchMonthKey!=null&&game.phoneSwitchMonthKey===gameMonthKey();
}
function carSwitchBlockedThisMonth(){
  return game.carSwitchMonthKey!=null&&game.carSwitchMonthKey===gameMonthKey();
}
function ensureCarState(){
  if(!game)return;
  if(!game.ownedCars||!game.ownedCars.length)game.ownedCars=game.ownedCar?[game.ownedCar]:[];
  if(game.ownedCar&&!game.ownedCars.includes(game.ownedCar))game.ownedCars.push(game.ownedCar);
  if(!game.ownedCar&&game.ownedCars.length)game.ownedCar=game.ownedCars[0];
  if(game.carPanelOpen==null)game.carPanelOpen=false;
  if(game.carSwitchMonthKey==null)game.carSwitchMonthKey=null;
}
function allCarsOwned(){
  ensureCarState();
  return Object.keys(CAR_SHOP).every(k=>game.ownedCars.includes(k));
}
function applyCarPanelFold(){
  if(!game)return;
  const open=!!game.carPanelOpen;
  const body=document.querySelector('#dailyPanel .car-fold-body');
  const chev=document.querySelector('#dailyPanel .car-fold-chev');
  const meta=document.querySelector('#dailyPanel .car-fold-cur');
  if(body)body.style.display=open?'block':'none';
  if(chev)chev.textContent=open?'▼':'▶';
  if(meta)meta.style.display=open?'':'none';
}
function toggleCarPanel(){
  if(!game)return;
  game.carPanelOpen=!game.carPanelOpen;
  applyCarPanelFold();
}
function switchCar(key){
  ensureCarState();
  const c=CAR_SHOP[key];
  if(!c){addLog('未知车型','fail');return}
  if(!game.ownedCars.includes(key)){addLog('尚未拥有 '+c.name+'，请先购买','fail');return}
  if(carSwitchBlockedThisMonth()){addLog('本月已换过车（每月仅可换一次）','fail');return}
  if(game.ownedCar===key){addLog('已是当前座驾','warn');return}
  game.ownedCar=key;
  game.carSwitchMonthKey=gameMonthKey();
  addStress(-10,'换车 ');
  addLog('🚗 切换至 '+c.name+' · 压力-10 · 本月已换车','info');
  renderDailyPanel();
}
function renderCarPanel(){
  ensureCarState();
  const open=!!game.carPanelOpen;
  const cur=game.ownedCar&&CAR_SHOP[game.ownedCar]?CAR_SHOP[game.ownedCar].name:'无';
  const monthBlocked=carSwitchBlockedThisMonth();
  let h='<div class="car-fold phone-fold"><div class="phone-fold-hdr" onclick="toggleCarPanel()"><b>购车 / 换车</b>';
  h+='<span class="car-fold-cur phone-fold-cur fold-meta"'+(open?'':' style="display:none"')+'> · 当前 '+cur+'</span>';
  h+='<span class="phone-fold-chev car-fold-chev" style="margin-left:auto;color:var(--muted)">'+(open?'▼':'▶')+'</span></div>';
  h+='<div class="phone-fold-body car-fold-body"'+(open?'':' style="display:none"')+'>';
  Object.keys(CAR_SHOP).forEach(k=>{
    const c=CAR_SHOP[k],owned=game.ownedCars.includes(k),active=game.ownedCar===k;
    h+='<div style="margin:4px 0">';
    if(owned){
      h+='<button class="btn btn-phone-shop" '+(active||monthBlocked?'disabled':'')+' onclick="switchCar(\''+k+'\')">'+(active?'✓ ':'')+c.name+'</button>';
    }else{
      h+='<button class="btn btn-phone-shop" onclick="buyCar(\''+k+'\')">购买 '+c.name+' ¥'+(c.price/10000)+'万</button>';
    }
    h+=' <span class="fold-meta">通勤可开车</span></div>';
  });
  h+='<p class="fold-meta">换车每次压力-10 · 每月仅可换一次</p>';
  if(monthBlocked)h+='<p class="fold-meta" style="color:var(--orange)">本月已换过车</p>';
  if(allCarsOwned())h+='<p class="fold-meta" style="color:var(--green)">三款车已全部购入</p>';
  h+='</div></div>';
  return h;
}
function normalizePhoneKey(phone){
  if(!phone)return null;
  if(PHONE_SHOP[phone])return phone;
  const keys=Object.keys(PHONE_SHOP);
  for(let i=0;i<keys.length;i++){
    if(PHONE_SHOP[keys[i]].name===phone)return keys[i];
  }
  return null;
}
function ensurePhoneState(){
  if(!game)return;
  if(!game.ownedPhones||!game.ownedPhones.length)game.ownedPhones=game.phone?[game.phone]:['xiaomi'];
  game.ownedPhones=game.ownedPhones.map(function(k){return normalizePhoneKey(k)||k}).filter(function(k){return !!PHONE_SHOP[k]});
  if(!game.ownedPhones.length)game.ownedPhones=['xiaomi'];
  if(game.phone){
    const nk=normalizePhoneKey(game.phone);
    game.phone=nk||null;
  }
  if(game.phone&&!game.ownedPhones.includes(game.phone))game.ownedPhones.push(game.phone);
  if(!game.ownedPhones.includes('xiaomi'))game.ownedPhones.unshift('xiaomi');
  if(game.phone&&!game.ownedPhones.includes(game.phone))game.phone=null;
  if(!game.phone&&game.ownedPhones.length)game.phone=game.ownedPhones[0];
  if(game.phonePanelOpen==null)game.phonePanelOpen=false;
  if(game.phoneSwitchMonthKey==null)game.phoneSwitchMonthKey=null;
  syncNokiaTempBonus();
}
function phoneFoldRoot(){
  return document.querySelector('#dailyPanel .swap-phone-fold');
}
function applyPhonePanelFold(){
  if(!game)return;
  const open=!!game.phonePanelOpen;
  const fold=phoneFoldRoot();
  if(!fold)return;
  const body=fold.querySelector('.phone-fold-body');
  const chev=fold.querySelector('.phone-fold-chev');
  const meta=fold.querySelector('.phone-fold-cur');
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
  let h='<div class="phone-fold swap-phone-fold"><div class="phone-fold-hdr" onclick="togglePhonePanel()"><b>换手机</b>';
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
  const chance=mode==='taxi'?0.32:mode==='car'?0.22:mode==='subway'?0.18:0.18;
  if(Math.random()<chance)meetRandomPerson(where);
  if(mode!=='car'&&Math.random()<0.04&&isManualJob(game.employment?game.market[game.employment.jobIdx]:null)){
    if(phoneCfg()&&Math.random()<0.5*phoneCfg().loseMult)loseCurrentPhone();
  }
}
function cancelCommuteChoice(){
  closeConsumeModal();
  game._commuteCallback=null;
}
function confirmCommute(mode){
  closeConsumeModal();
  const r=runCommute(mode);
  if(r&&r.mode==='开车'&&typeof onArtifactCarDrive==='function')onArtifactCarDrive();
  if(r&&(r.mode==='地铁'||mode==='subway')&&typeof onArtifactSubwayRide==='function')onArtifactSubwayRide();
  const finish=function(){
    const cb=game._commuteCallback;
    game._commuteCallback=null;
    if(typeof cb==='function')cb(r);
  };
  const afterArt=function(){
    maybeMeetOnCommute(mode);
    if(typeof runAfterEncounterModals==='function')runAfterEncounterModals(finish);
    else finish();
  };
  if(typeof runAfterEncounterModals==='function')runAfterEncounterModals(afterArt);
  else afterArt();
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
  if(!overtimeFlow)d.slotHoursUsed=0;
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
function meetRandomPerson(where,baseChance,onAfter){
  if(Math.random()>=(baseChance!=null?dailyMeetChance(baseChance):dailyMeetChance(0.65)))return false;
  const jobs=game.market.filter(j=>!isOverAgeLimit(j));
  if(!jobs.length)return false;
  const job=jobs[Math.floor(Math.random()*jobs.length)];
  const co=pickCompany(job.idx,job.heatPct>=108?'high':job.heatPct>=102?'mid':'low');
  const income=Math.round(job.pay*(0.7+Math.random()*0.6));
  const dup=game.contacts.find(c=>c.jobTitle===job.title&&c.company===co.name);
  if(dup){
    if(typeof showMeetPersonModal==='function')showMeetPersonModal(dup,where,true,onAfter);
    else{
      addLog('👋 在「'+where+'」又遇见 '+dup.name,'info');
      if(typeof onAfter==='function')onAfter();
    }
    return true;
  }
  const id='ct_'+game.week+'_'+game.contacts.length;
  const gender=Math.random()<0.5?'male':'female';
  const age=22+Math.floor(Math.random()*18);
  const displayName=typeof pickStrangerDisplayName==='function'?pickStrangerDisplayName(gender):'路人';
  const person={id,name:displayName,jobTitle:job.title,jobSlug:job.slug,category:job.category,
    company:co.name,companyTier:co.tier,companyScale:co.scale,income,metWeek:game.week,metWhere:where,gender,age};
  if(typeof ensureContactAffairFields==='function')ensureContactAffairFields(person);
  if(typeof tagMeetContact==='function')tagMeetContact(person);
  person.talkCount=0;
  game.contacts.push(person);
  if(typeof showMeetPersonModal==='function')showMeetPersonModal(person,where,false,onAfter);
  else{
    addLog('👋 结识 '+person.name+'（'+where+'）','info');
    if(typeof onAfter==='function')onAfter();
  }
  return true;
}
function addContactFromMeet(person){game.contacts.push(person)}
function advanceDailyPhase(nextPhase){
  const d=ensureDailyState();
  if(!d)return;
  if(typeof checkBffOutingMiss==='function')checkBffOutingMiss();
  if(nextPhase==='evening'){
    if(d.partnerCatchUpSleep)clearCompanionAllnightStreak();
    d.partnerCatchUpSleep=false;
    d.eveningEndModalShown=false;
  }
  d.phase=nextPhase;
  if(nextPhase==='morning'&&typeof tickCompanionMorningCatchUp==='function')tickCompanionMorningCatchUp();
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
    game.companionAllnightChoiceResolved=false;
    game.pendingPartnerCatchUpSleep=false;
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
  clearCompanionAllnightStreak();
  addLog('😴 休息恢复','info');
  advanceToNextDay();
}
function bumpDayAfterAllnight(){
  const d=ensureDailyState();
  tickAllnightNoReturnIntimacy();
  if(typeof tickMenstrualDays==='function')tickMenstrualDays(1);
  resetPartnerRecallFlag();
  d.dayIndex++;
  d.villaPartyUsed=false;
  d.allnightDay=false;
  d.partnerCatchUpSleep=false;
  d.companionMorningSkipLogged=false;
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
  d.phase='morning';
  d.workedToday=false;
  d.partnerForcedAsleep=false;
  d.partnerAllnightActive=false;
  activatePartnerCatchUpSleep(compChoice);
  if(typeof tickCompanionMorningCatchUp==='function')tickCompanionMorningCatchUp();
  addStress(6,'通宵不睡 ');
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  addLog('☀ 通宵不睡，硬撑进入白天（未补觉 · 连续通宵 '+streak+' 天）'+(d.partnerCatchUpSleep?' · '+pn+'在家补觉':(compChoice==='rested'?' · '+pn+'昨夜已入睡':'')) ,'warn');
  renderDailyPanel();updateUI();
}
function finishAllnightSleepThrough(){
  const d=ensureDailyState();
  if(!d||d.phase!=='allnight')return;
  d.allnightEndModalShown=false;
  const compChoice=resolvePartnerAllnightEndChoice();
  if(!bumpDayAfterAllnight())return;
  setAllnightStreak(0);
  d.partnerForcedAsleep=false;
  d.partnerAllnightActive=false;
  if(compChoice==='sleep')clearCompanionAllnightStreak();
  if(compChoice==='rested')clearCompanionAllnightStreak();
  if(compChoice==='sleep'&&game.companion&&game.companion.employed&&typeof isCompanionWorkSlotForDay==='function'&&isCompanionWorkSlotForDay('morning',d.dayIndex)){
    if(typeof recordCompanionWorkSkip==='function')recordCompanionWorkSkip('睡过头旷工');
  }
  d.partnerCatchUpSleep=false;
  d.phase='evening';
  d.workedToday=false;
  addStress(-3,'补觉 ');
  addLog('😴 入睡补觉，睡过白天直接到了晚上','info');
  renderDailyPanel();updateUI();
}
function advanceToNextDay(){
  const d=ensureDailyState();
  if(game){
    game.lastCompanionAllnightSleepChoice=null;
    game.pendingPartnerCatchUpSleep=false;
    game.companionAllnightChoiceResolved=false;
  }
  tickAllnightNoReturnIntimacy();
  if(typeof tickMenstrualDays==='function')tickMenstrualDays(1);
  resetPartnerRecallFlag();
  d.allnightDay=false;
  if(typeof tickSnackDayRebound==='function')tickSnackDayRebound(d);
  if(typeof checkBffOutingMiss==='function')checkBffOutingMiss();
  if(typeof resetContactSlotFlags==='function')resetContactSlotFlags();
  d.dayIndex++;
  d.villaPartyUsed=false;
  d.phase='morning';
  d.workedToday=false;
  if(typeof tickCompanionMorningCatchUp==='function')tickCompanionMorningCatchUp();
  d.jobHuntedToday=false;
  d.jobHuntCount=0;
  d.jobHuntBySlot={};
  d.subMenu=null;
  resetDailyWorkFlags();
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
    const ownerImmune=typeof playerEmployerOwnerImmune==='function'&&playerEmployerOwnerImmune();
    if(!ownerImmune&&d.workSkipDays>=5){
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
    const d=ensureDailyState();
    if(d.slotHoursUsed>0){addLog('本时段已在安排其他事（已用 '+d.slotHoursUsed+'h）','fail');return}
    promptCommuteChoice(function(){beginWorkShift('morning',false)});
  };
  go();
}
function finishDayOutVisit(label,mult,onDone){
  const q=typeof queueEventEncounter==='function'?queueEventEncounter:
    (typeof queueEncounterModal==='function'?queueEncounterModal:null);
  const advance=function(){
    const d=game.daily;
    if(d)d.slotActivity=null;
    if(typeof onDone==='function')onDone();
    else dailyAdvanceAfterSlotAction();
  };
  if(q){
    q({
      lane:'event',icon:'🚶',title:label+' · 外出结束',
      html:'<p>你在 <b>'+label+'</b> 度过本时段。</p><p class="fold-meta">属性加成已结算 · 可进入下一时段</p>',
      btn:'回家',onClose:advance
    });
    return;
  }
  advance();
}
function dailyOutActivityWatchdog(){
  const d=game.daily;
  if(!d||d.slotHoursUsed<SLOT_HOURS_TOTAL)return;
  if(typeof hasPendingEncounterModals==='function'&&hasPendingEncounterModals())return;
  if(typeof consumeModalOpen!=='undefined'&&consumeModalOpen)return;
  if(d.slotActivity==='out'||d.subMenu==='out'||d.phase==='evening'||d.phase==='allnight'){
    d.slotActivity=null;
    d.subMenu=null;
    addLog('外出流程已恢复','warn');
    dailyAdvanceAfterSlotAction();
  }
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
  if(typeof applyOutdoorCompanions==='function')applyOutdoorCompanions(p.label);
  if(typeof tryCompleteBffOuting==='function')tryCompleteBffOuting(place);
  if(place==='park'&&typeof onArtifactParkVisit==='function')onArtifactParkVisit();
  else if(place==='library'&&typeof onArtifactLibraryVisit==='function')onArtifactLibraryVisit();
  else if(place==='cafe'&&typeof onArtifactCafeVisit==='function')onArtifactCafeVisit();
  if(typeof runAfterEncounterModals==='function'){
    runAfterEncounterModals(function(){meetRandomPerson(p.label,0.72)});
    runAfterEncounterModals(function(){finishDayOutVisit(p.label,mult,dailyAdvanceAfterSlotAction)});
  }else{
    meetRandomPerson(p.label,0.72);
    finishDayOutVisit(p.label,mult,dailyAdvanceAfterSlotAction);
  }
  setTimeout(dailyOutActivityWatchdog,10000);
}
function dailyStayHomeMorning(){
  if(!dailyCanUseHours(1))return;
  addStress(-1,'宅家休息 ');
  addTempStat('spirit',1,'🏠 白天宅家休息');
  addLog('🏠 白天宅家休息 · 压力-1','info');
  if(typeof onArtifactHomeStay==='function')onArtifactHomeStay();
  dailyAddHours(1,false);
}
function buildEveningOutVisitModal(kind,mult,extra){
  const labels={club:'夜店',bar:'酒吧',store:'便利店'};
  const icons={club:'🪩',bar:'🍺',store:'🏪'};
  let html='<p class="fold-meta">场所见闻 · 减压 ×'+mult+'</p>';
  if(extra)html+='<p>'+extra+'</p>';
  else html+='<p>平安度过这一晚。</p>';
  return{icon:icons[kind]||'🚶',title:(labels[kind]||'外出')+' · 当晚',html};
}
function finishEveningOutVisit(kind,mult,extra,skipAdvance){
  const modal=buildEveningOutVisitModal(kind,mult,extra);
  const advance=function(){
    const d=game.daily;
    if(d)d.slotActivity=null;
    if(!skipAdvance&&!pendingAffairContactId)dailyAdvanceAfterSlotAction();
  };
  const q=typeof queueEventEncounter==='function'?queueEventEncounter:
    (typeof queueEncounterModal==='function'?queueEncounterModal:null);
  if(q){
    q({lane:'event',icon:modal.icon,title:modal.title,html:modal.html,btn:'知道了',onClose:advance});
    return;
  }
  showConsumeModal({
    icon:modal.icon,title:modal.title,html:modal.html,
    buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal();dailyAdvanceAfterSlotAction()'}]
  });
}
function eveningOutAffairStep(kind,mult,affairP,visitExtraRef,thenFn){
  if(Math.random()<affairP){
    if(typeof triggerAffairEncounter==='function'){
      const who=typeof createAffairContact==='function'?createAffairContact(kind==='club'?'夜店':'酒吧'):null;
      if(who){
        game._eveningOutAffairPending=thenFn;
        triggerAffairEncounter(who.id,(kind==='club'?'夜店':'酒吧')+'艳遇'+(mult>1?'×'+mult:''));
        return;
      }
    }else{
      addLog('🍸 艳遇一夜'+(mult>1?'（通宵×'+mult+'）':''),'info');
      visitExtraRef.v=(visitExtraRef.v?visitExtraRef.v+'<br>':'')+'🍸 艳遇一夜';
    }
  }
  if(typeof thenFn==='function')thenFn();
}
function dailyEveningOut(kind){
  const mult=dailyRewardMult();
  const phase=game.daily.phase;
  if(!dailyUseMainActivity())return;
  if(phase==='evening'||phase==='allnight')game.daily.noHomeReturnDay=true;
  game.daily.slotActivity='out';
  const outLbl=(typeof OUT_PLACE_LABELS!=='undefined'&&OUT_PLACE_LABELS[kind])||kind;
  if(typeof applyOutdoorCompanions==='function')applyOutdoorCompanions(outLbl);
  setTimeout(dailyOutActivityWatchdog,10000);
  const visitExtraRef={v:''};
  if(kind==='club'){
    if(typeof tryCompleteBffOuting==='function')tryCompleteBffOuting('club');
    if(!spendWithPhoneMult(500,'夜店')){dailyReleaseMainActivity();return}
    addStress(-2*mult,'夜店 ');
    const affairP=Math.min(0.55,0.25*mult);
    runAfterEncounterModals(function(){meetRandomPerson('夜店',0.42)});
    runAfterEncounterModals(function(){
      eveningOutAffairStep('club',mult,affairP,visitExtraRef,function(){
        runAfterEncounterModals(function(){
          if(Math.random()<Math.min(0.4,0.15*mult)){
            applyHangover(mult);
            visitExtraRef.v=(visitExtraRef.v?visitExtraRef.v+'<br>':'')+'🤢 宿醉（临时属性下降 · 亲密度-1）';
          }else visitExtraRef.v=(visitExtraRef.v?visitExtraRef.v+'<br>':'')+'🪩 蹦了一夜，压力下降';
          runAfterEncounterModals(function(){finishEveningOutVisit('club',mult,visitExtraRef.v)});
        });
      });
    });
    return;
  }else if(kind==='bar'){
    if(typeof tryCompleteBffOuting==='function')tryCompleteBffOuting('bar');
    if(!spendWithPhoneMult(200,'酒吧')){dailyReleaseMainActivity();return}
    addStress(-1*mult,'酒吧 ');
    runAfterEncounterModals(function(){meetRandomPerson('酒吧',0.38)});
    runAfterEncounterModals(function(){
      if(Math.random()<Math.min(0.45,0.2*mult)){applyHangover(mult);visitExtraRef.v='🤢 喝大了，宿醉';}
      else visitExtraRef.v='🍺 喝了几杯，放松一下';
      runAfterEncounterModals(function(){finishEveningOutVisit('bar',mult,visitExtraRef.v)});
    });
  }else if(kind==='store'){
    if(typeof onArtifactStoreVisit==='function')onArtifactStoreVisit();
    if(typeof tryCompleteBffOuting==='function')tryCompleteBffOuting('store');
    if(!spendWithPhoneMult(50,'便利店')){dailyReleaseMainActivity();return}
    addStress(-1*mult,'便利店 ');
    runAfterEncounterModals(function(){meetRandomPerson('便利店',0.30)});
    runAfterEncounterModals(function(){
      if(Math.random()<0.08*mult){
        game.referralOpportunity=generateReferralOpportunity();
        visitExtraRef.v='🤝 偶遇熟人，获得内推线索';
        const qEv=typeof queueEventEncounter==='function'?queueEventEncounter:queueEncounterModal;
        if(qEv)qEv({
          lane:'event',icon:'🤝',title:'偶遇事件 · 内推',
          html:'<p>在便利店碰见老熟人，对方手头有岗位愿意帮你<b>内推</b>。</p><p class="fold-meta">本周可留意内推机会。</p>',
          onClose:function(){addLog('🤝 便利店偶遇熟人，获得内推线索！','success')}
        });
      }else visitExtraRef.v='🏪 买了点东西，歇了会儿';
      runAfterEncounterModals(function(){finishEveningOutVisit('store',mult,visitExtraRef.v)});
    });
  }
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
  else if(fromOt&&lastAction==='slack')addLog('🐟 摸鱼收工后联谊 · 占用最后 '+OT_SLACK_HOME_HOURS+'h · 午夜前回家','info');
  if(Math.random()<0.35)applyHangover();
  if(typeof runAfterEncounterModals==='function')runAfterEncounterModals(function(){meetRandomPerson('公司联谊',0.55)});
  else meetRandomPerson('公司联谊',0.55);
  const finishSocial=function(){
    if(fromOt)applyOvertimeSocialEnd(lastAction);
    else{d.inOvertime=false;d.slotActivity=null;dailyAdvanceAfterSlotAction()}
  };
  if(Math.random()<0.22){
    if(typeof triggerAffairEncounter==='function'){
      const who=typeof createAffairContact==='function'?createAffairContact('联谊'):null;
      if(who){
        if(fromOt)game._overtimeSocialEndAction=lastAction;
        game._affairAfterClose=finishSocial;
        triggerAffairEncounter(who.id,'公司联谊');
        return;
      }
    }
  }
  if(typeof runAfterEncounterModals==='function')runAfterEncounterModals(finishSocial);
  else finishSocial();
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
    ?'<span class="fold-meta">努力 '+OT_GRIND_HOURS+'h 后联谊 → 金色时段结束已是<b>后半夜</b> · 到家可选睡觉或彩虹通宵</span>'
    :'<span class="fold-meta">摸鱼 '+OT_SLACK_HOURS+'h 后联谊 → 占用最后 '+OT_SLACK_HOME_HOURS+'h · <b>午夜前</b>回家 · 可选睡觉或进后半夜</span>';
  const declineLabel=grind?'不去，午夜前回家（'+OT_GRIND_HOURS+'h 已满）':'不去，早回家（剩 '+OT_SLACK_HOME_HOURS+'h）';
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
  if(d.slotHoursUsed>0){showOvertimeFailModal('本时段已在安排其他事');return}
  d.eveningOtTried=true;
  d.overtimeDidAction=false;
  d.overtimeLastAction=null;
  d.overtimeSlackDone=false;
  d.overtimeGrindDone=false;
  d.overtimePhoneDone=false;
  d.inOvertime=true;
  d.slotActivity='overtime';
  addStress(1,'加班 ');
  addTempStat('spirit',-1,'🌃 加班');
  showOvertimeChoiceModal();
}
function dailyEveningWorkEvent(){
  if(!game.employed)return;
  const d=ensureDailyState();
  if(d.slotHoursUsed>0){showOvertimeFailModal('本时段已在安排其他事');return}
  startWeekdayEveningOvertime();
}
function getGameCalendarYear(){
  const w=game.week||0;
  if(typeof getDateStr==='function'){
    const m=String(getDateStr(w)).match(/(\d{4})/);
    if(m)return parseInt(m[1],10);
  }
  return 2024+Math.floor(w/52);
}
const SUPER_DREAM_MIN_AMOUNT=10000000;
const SUPER_DREAM_IDS=['mansion','island','movie','concert','yacht','jet','gala','fashion'];
function isGiftWishSuperDream(r){
  if(!r)return false;
  if(r.kind==='superDream'||r.superDream)return true;
  if(r.dreamId&&SUPER_DREAM_IDS.indexOf(r.dreamId)>=0)return true;
  return (r.amount||0)>=SUPER_DREAM_MIN_AMOUNT;
}
function normalizeGiftWishEntry(r){
  if(!r)return r;
  if(isGiftWishSuperDream(r)){r.kind='superDream';r.superDream=true}
  else if(!r.kind)r.kind='daily';
  return r;
}
function ensureSuperDreamGiftHistory(){
  if(!game)return;
  if(!Array.isArray(game.superDreamGiftHistory))game.superDreamGiftHistory=[];
}
function compactGiftWishHistoryForSave(arr,max){
  if(!Array.isArray(arr))return arr;
  max=max||80;
  if(arr.length<=max)return arr.map(normalizeGiftWishEntry);
  const supers=arr.filter(isGiftWishSuperDream).map(normalizeGiftWishEntry);
  const daily=arr.filter(function(r){return !isGiftWishSuperDream(r)}).map(normalizeGiftWishEntry);
  const keepDaily=Math.max(0,max-supers.length);
  return supers.concat(daily.slice(-keepDaily));
}
function giftWishRowKey(r){
  return (r.week||0)+'|'+(r.label||'')+'|'+(r.amount||0)+'|'+(r.status||'');
}
function giftWishCalendarYear(r){
  if(!r)return 0;
  if(r.calendarYear!=null)return r.calendarYear;
  if(r.date){
    const m=String(r.date).match(/(\d{4})/);
    if(m)return parseInt(m[1],10);
  }
  const w=r.week;
  if(w!=null&&typeof getDateStr==='function'){
    const m=String(getDateStr(w)).match(/(\d{4})/);
    if(m)return parseInt(m[1],10);
  }
  return 2024+Math.floor((w||game.week||0)/52);
}
function giftWishDedupeKey(r){
  if(!r)return '';
  normalizeGiftWishEntry(r);
  if(isGiftWishSuperDream(r)){
    return 'super|'+giftWishCalendarYear(r)+'|'+(r.label||'')+'|'+(r.amount||0)+'|'+(r.status||'');
  }
  return 'row|'+giftWishRowKey(r);
}
function dedupeGiftWishList(arr){
  const best={};
  (arr||[]).forEach(function(r){
    if(!r)return;
    const k=giftWishDedupeKey(r);
    if(!k)return;
    const prev=best[k];
    if(!prev||(r.week||0)>(prev.week||0))best[k]=r;
  });
  return Object.keys(best).map(function(k){return best[k]}).sort(function(a,b){return (a.week||0)-(b.week||0)});
}
function recoverSuperDreamsFromLogs(){
  if(!game||!Array.isArray(game.log))return [];
  const out=[];
  game.log.forEach(function(entry){
    const text=typeof entry==='string'?entry:(entry&&entry.msg)||'';
    const date=entry&&entry.date?entry.date:'';
    if(!text)return;
    let m=text.match(/💎\s*年度超级梦想[「『]([^」』]+)[」』]\s*¥([\d,]+)/);
    if(m){
      const y=date?((String(date).match(/(\d{4})/)||[])[1]):null;
      out.push(normalizeGiftWishEntry({date:date,calendarYear:y?parseInt(y,10):null,label:m[1],amount:parseInt(m[2].replace(/,/g,''),10)||0,status:'fulfilled',desc:''}));
      return;
    }
    m=text.match(/🎁\s*囊中羞涩，无法满足[「『]([^」』]+)[」』]\s*¥([\d,]+)/);
    if(m){
      const amt=parseInt(m[2].replace(/,/g,''),10)||0;
      if(amt>=SUPER_DREAM_MIN_AMOUNT){
        const y=date?((String(date).match(/(\d{4})/)||[])[1]):null;
        out.push(normalizeGiftWishEntry({date:date,calendarYear:y?parseInt(y,10):null,label:m[1],amount:amt,status:'broke',desc:''}));
      }
      return;
    }
    if(text.indexOf('💎 拒绝年度超级梦想')>=0){
      const y=date?((String(date).match(/(\d{4})/)||[])[1]):null;
      out.push(normalizeGiftWishEntry({date:date,calendarYear:y?parseInt(y,10):null,label:'年度超级梦想',amount:0,status:'refused',desc:'当年拒绝购买'}));
    }
  });
  return out;
}
function mergeGiftWishRows(wishes,opts){
  opts=opts||{};
  const rows=[];
  const seen={};
  function add(r){
    if(!r)return;
    normalizeGiftWishEntry(r);
    const k=giftWishDedupeKey(r);
    if(seen[k])return;
    seen[k]=true;
    rows.push(r);
  }
  (wishes||[]).forEach(add);
  if(!opts.archived){
    ensureSuperDreamGiftHistory();
    (game.superDreamGiftHistory||[]).forEach(add);
  }
  rows.sort(function(a,b){return (a.week||0)-(b.week||0)});
  return rows;
}
function giftWishExistsAnywhere(k){
  if(game.giftWishHistory&&game.giftWishHistory.some(function(w){return giftWishDedupeKey(w)===k}))return true;
  if(game.superDreamGiftHistory&&game.superDreamGiftHistory.some(function(w){return giftWishDedupeKey(w)===k}))return true;
  if(game.archivedPartnerWishLists&&game.archivedPartnerWishLists.some(function(a){
    return (a.wishes||[]).some(function(w){return giftWishDedupeKey(w)===k});
  }))return true;
  return false;
}
function getGiftWishCount(){
  if(!game)return 0;
  if(typeof mergeGiftWishRows==='function')return mergeGiftWishRows(game.giftWishHistory||[]).length;
  return (game.giftWishHistory||[]).length;
}
function repairGiftWishHistories(){
  if(!game)return;
  ensureGiftWishHistory();
  ensureSuperDreamGiftHistory();
  ensureArchivedPartnerWishLists();
  game.giftWishHistory.forEach(normalizeGiftWishEntry);
  game.archivedPartnerWishLists.forEach(function(arc){
    if(!arc.wishes)arc.wishes=[];
    arc.wishes.forEach(normalizeGiftWishEntry);
  });
  recoverSuperDreamsFromLogs().forEach(function(r){
    const k=giftWishDedupeKey(r);
    if(giftWishExistsAnywhere(k))return;
    if(game.married&&!game.divorced){
      game.superDreamGiftHistory.push(Object.assign({},r));
      game.giftWishHistory.push(Object.assign({},r));
    }else if(game.archivedPartnerWishLists.length){
      const arc=game.archivedPartnerWishLists[game.archivedPartnerWishLists.length-1];
      if(!arc.wishes)arc.wishes=[];
      arc.wishes.push(Object.assign({},r));
    }
  });
  game.giftWishHistory=dedupeGiftWishList(game.giftWishHistory);
  game.superDreamGiftHistory=dedupeGiftWishList(game.superDreamGiftHistory);
  if(game.archivedPartnerWishLists){
    game.archivedPartnerWishLists.forEach(function(arc){
      if(arc.wishes)arc.wishes=dedupeGiftWishList(arc.wishes);
    });
  }
  if(game.giftWishHistory.length>120)game.giftWishHistory=compactGiftWishHistoryForSave(game.giftWishHistory,120);
}
function ensureGiftWishHistory(){
  if(!game)return;
  if(!Array.isArray(game.giftWishHistory))game.giftWishHistory=[];
  if(game.giftWishHistory.length>120)game.giftWishHistory=compactGiftWishHistoryForSave(game.giftWishHistory,120);
}
function ensureArchivedPartnerWishLists(){
  if(!game)return;
  if(!Array.isArray(game.archivedPartnerWishLists))game.archivedPartnerWishLists=[];
}
function archiveGiftWishHistoryOnDivorce(partnerNameOverride){
  if(!game)return;
  ensureGiftWishHistory();
  ensureArchivedPartnerWishLists();
  const wishes=game.giftWishHistory||[];
  if(!wishes.length)return;
  const partnerName=partnerNameOverride||game.partnerDisplayName||game.exPartnerName||(game.partnerGender==='male'?'前夫':'前妻');
  const last=game.archivedPartnerWishLists[game.archivedPartnerWishLists.length-1];
  if(last&&last.partnerName===partnerName&&last.divorcedWeek===(game.week||0)&&last.wishes.length===wishes.length)return;
  game.archivedPartnerWishLists.push({
    partnerName,
    divorcedWeek:game.week||0,
    divorcedDate:getGiftWishDateStr(),
    wishes:mergeGiftWishRows(wishes)
  });
  game.giftWishHistory=[];
  game.superDreamGiftHistory=[];
}
function migrateGiftWishArchives(){
  if(!game||!game.divorced)return;
  ensureArchivedPartnerWishLists();
  if(!game.giftWishHistory||!game.giftWishHistory.length)return;
  const partnerName=game.exPartnerName||game.partnerDisplayName||(game.partnerGender==='male'?'前夫':'前妻');
  archiveGiftWishHistoryOnDivorce(partnerName);
}
function getGiftWishDateStr(){
  if(typeof getDateStr==='function')return getDateStr(game.week||0);
  return '第'+(game.week||0)+'周';
}
function recordGiftWish(offer,status){
  if(!game||!offer)return;
  ensureGiftWishHistory();
  ensureSuperDreamGiftHistory();
  const fulfilled=status==='fulfilled';
  const entry=normalizeGiftWishEntry({
    date:getGiftWishDateStr(),
    week:game.week||0,
    label:offer.label||'未命名礼物',
    desc:offer.desc||'',
    amount:offer.amount,
    fulfilled:fulfilled,
    status:status,
    kind:offer.superDream?'superDream':'daily',
    superDream:!!offer.superDream,
    giftId:offer.giftId||offer.dreamId||null,
    dreamId:offer.dreamId||null,
    calendarYear:offer.calendarYear||(offer.superDream&&typeof getGameCalendarYear==='function'?getGameCalendarYear():null)
  });
  game.giftWishHistory.push(entry);
  if(isGiftWishSuperDream(entry)){
    const sk=giftWishDedupeKey(entry);
    if(!game.superDreamGiftHistory.some(function(w){return giftWishDedupeKey(w)===sk}))
      game.superDreamGiftHistory.push(Object.assign({},entry));
    if(offer.superDream&&typeof getGameCalendarYear==='function')
      game.superDreamGiftYear=getGameCalendarYear();
  }
}
function giftWishKindLabel(r){
  if(isGiftWishSuperDream(r))return '<span class="fold-meta" style="color:var(--accent)">年度梦想</span>';
  return '<span class="fold-meta">日常愿望</span>';
}
function giftWishStatusLabel(st){
  if(st==='fulfilled')return '<span class="wish-ok">已实现</span>';
  if(st==='broke')return '<span class="wish-broke">缺钱未送</span>';
  return '<span class="wish-no">未实现</span>';
}
function renderGiftWishBlock(){
  if(!game)return '';
  let html='';
  if(game.married&&!game.divorced){
    ensureGiftWishHistory();
    const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
    const n=mergeGiftWishRows(game.giftWishHistory).length;
    html+='<div class="daily-wish"><b>'+pn+' · 愿望单</b>（'+n+'条） '+
      '<button class="btn btn-allnight-plain" style="font-size:.7rem;padding:2px 8px" onclick="openGiftWishModal()">打开</button></div>';
  }
  ensureArchivedPartnerWishLists();
  game.archivedPartnerWishLists.forEach(function(arc,i){
    const n=mergeGiftWishRows(arc.wishes||[],{archived:true}).length;
    html+='<div class="daily-wish"><b>'+arc.partnerName+' · 历史愿望单</b>（'+n+'条） '+
      '<button class="btn btn-allnight-plain" style="font-size:.7rem;padding:2px 8px" onclick="openGiftWishModal('+i+')">打开</button></div>';
  });
  return html;
}
function openGiftWishModal(archiveIndex){
  const el=document.getElementById('giftWishOverlay');
  const body=document.getElementById('giftWishModalBody');
  const h2=el&&el.querySelector('h2');
  if(!el||!body)return;
  let rows=[], title='📜 历史愿望单', emptyHint='还没有记录。约会时伴侣讨礼物会记在这里。';
  if(archiveIndex!=null&&archiveIndex>=0){
    ensureArchivedPartnerWishLists();
    const arc=game.archivedPartnerWishLists[archiveIndex];
    if(!arc)return;
    rows=mergeGiftWishRows(arc.wishes||[],{archived:true}).slice().reverse();
    title='📜 '+arc.partnerName+' · 历史愿望单';
    emptyHint='这段婚姻没有留下愿望记录。';
  }else{
    ensureGiftWishHistory();
    rows=mergeGiftWishRows(game.giftWishHistory).slice().reverse();
    const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
    title='📜 '+pn+' · 愿望单';
  }
  if(h2)h2.textContent=title;
  if(!rows.length){
    body.innerHTML='<p class="fold-meta" style="text-align:center;padding:16px 0">'+emptyHint+'</p>';
  }else{
    let h='<table class="wish-table"><thead><tr><th class="wish-col-date">日期</th><th class="wish-col-kind">类型</th><th class="wish-col-gift">礼物名目</th><th class="wish-col-amt">价位</th><th class="wish-col-status">实现</th></tr></thead><tbody>';
    rows.forEach(function(r){
      const desc=r.desc?'<span class="wish-desc">'+r.desc+'</span>':'';
      h+='<tr><td class="wish-col-date">'+r.date+'</td><td class="wish-col-kind">'+giftWishKindLabel(r)+'</td><td class="wish-col-gift"><b>'+(r.label||'—')+'</b>'+desc+
        '</td><td class="wish-col-amt">¥'+(r.amount||0).toLocaleString()+'</td><td class="wish-col-status">'+giftWishStatusLabel(r.status)+'</td></tr>';
    });
    h+='</tbody></table>';
    body.innerHTML=h;
  }
  el.classList.remove('hidden');
}
function closeGiftWishModal(){
  const el=document.getElementById('giftWishOverlay');
  if(el)el.classList.add('hidden');
}
function superDreamFlavor(id,amount){
  if(id==='mansion'){
    if(amount<150000000)return{label:'滨江顶层复式豪宅',desc:'想在江景大平层安家，客厅要能俯瞰整座城的灯火。'};
    if(amount<500000000)return{label:'半山独栋传世豪宅',desc:'要一座带泳池、酒窖和私家花园的半山庄园，能请一整个家族来过周末。'};
    return{label:'庄园公馆群落',desc:'买下庄园用地与主楼群，配管家团队与私密园林——真正的门楣传世。'};
  }
  if(id==='island'){
    if(amount<200000000)return{label:'东南亚私人小岛度假权',desc:'想要一座能直飞抵达的小岛，沙滩、木屋和快艇，每年去住几个月。'};
    if(amount<800000000)return{label:'加勒比海岛产权',desc:'买下整座小岛产权，自己定规矩，邀请亲友来开派对。'};
    return{label:'专属群岛开发权',desc:'不只一座岛——一整片群岛的规划权，名字可以刻在地图上。'};
  }
  if(id==='movie'){
    if(amount<120000000)return{label:'文艺片客串 · 明星搭戏',desc:'想投资一部文艺片并客串，请两位当红演员陪她/他演对手戏，在银幕里活一次别人的人生。'};
    if(amount<400000000)return{label:'院线电影联合出品',desc:'要做一部院线片的联合出品人，和一线影帝影后同框，首映礼走红毯。'};
    return{label:'年度大片领衔出品',desc:'砸重金做年度大片：国际班底、顶级明星、全球宣发——名字出现在片头出品方。'};
  }
  if(id==='concert'){
    if(amount<80000000)return{label:'万人体育馆个人演唱会',desc:'想办一场属于自己的演唱会，万人场馆、顶级音响，全场只喊她/他的名字。'};
    if(amount<280000000)return{label:'巡城三场演唱会',desc:'连办三场巡演，每场不同城市，舞美、乐队、嘉宾阵容都要顶配。'};
    return{label:'全球巡演首发站',desc:'从国内顶级场馆起步，舞美团队按全球巡演标准打造，将来可以接着巡世界。'};
  }
  if(id==='yacht'){
    if(amount<100000000)return{label:'超级游艇泊位与船体',desc:'想要一艘能远洋的游艇，停在专属泊位，周末出海吹风。'};
    return{label:'定制旗舰游艇',desc:'按她/他的喜好定制船体与内饰，船员编制齐全，随时可以环球航行。'};
  }
  if(id==='jet'){
    if(amount<200000000)return{label:'私人飞机包机年卡',desc:'一年内随时包机出行，不用排队登机，想去哪就去哪。'};
    return{label:'私人飞机整机与机组',desc:'买下一架公务机并养机组，全球航线说走就走。'};
  }
  if(id==='gala'){
    if(amount<60000000)return{label:'慈善晚宴冠名',desc:'以她/他名义办一场慈善晚宴，明星站台、媒体曝光，既体面又有意义。'};
    return{label:'年度慈善基金会启动',desc:'成立以自己名字命名的基金会，首场晚宴邀请商界与文娱名流。'};
  }
  if(id==='fashion'){
    if(amount<80000000)return{label:'轻奢品牌联名系列',desc:'和知名品牌推出联名款，从设计到发布会都要参与。'};
    return{label:'高定时装周专场',desc:'在巴黎或米兰办一场个人高定专场，顶级裁缝与造型团队全程服务。'};
  }
  return{label:'超级梦想',desc:'一个配得上你们此刻身价的愿望。'};
}
function tryPickSuperDreamGiftOffer(){
  const c=game.cash||0;
  if(c<10000000)return null;
  const y=getGameCalendarYear();
  if(game.superDreamGiftYear===y)return null;
  const dreams=[
    {id:'mansion',weight:1.3,lo:80000000,hi:1500000000,intimacy:16},
    {id:'island',weight:1.2,lo:120000000,hi:1800000000,intimacy:18},
    {id:'movie',weight:1.2,lo:40000000,hi:1200000000,intimacy:15},
    {id:'concert',weight:1.2,lo:30000000,hi:800000000,intimacy:14},
    {id:'yacht',weight:0.75,lo:50000000,hi:600000000,intimacy:13},
    {id:'jet',weight:0.65,lo:100000000,hi:1200000000,intimacy:15},
    {id:'gala',weight:0.55,lo:20000000,hi:350000000,intimacy:12},
    {id:'fashion',weight:0.55,lo:25000000,hi:400000000,intimacy:13}
  ];
  const pool=dreams.filter(function(d){return c>=d.lo*0.85});
  if(!pool.length)return null;
  const total=pool.reduce(function(s,d){return s+d.weight},0);
  let r=Math.random()*total;
  let pick=pool[0];
  for(let i=0;i<pool.length;i++){
    r-=pool[i].weight;
    if(r<=0){pick=pool[i];break;}
  }
  const hi=Math.min(pick.hi,Math.round(c*0.92));
  const lo=Math.min(pick.lo,hi);
  const amount=Math.round(lo+Math.random()*Math.max(hi-lo,1));
  const flavor=superDreamFlavor(pick.id,amount);
  return{
    amount:amount,label:flavor.label,desc:flavor.desc,dreamId:pick.id,
    intimacy:pick.intimacy,superDream:true,refuseIntimacy:-5,calendarYear:y
  };
}
const DATE_GIFT_CATALOG=[
  {giftId:'rose11',amount:520,need:2000,weight:14,intimacy:3,label:'十一月玫瑰花束',desc:'红玫瑰配满天星，经典约会场面。'},
  {giftId:'dessert_box',amount:520,need:2000,weight:12,intimacy:3,label:'网红甜品盒',desc:'慕斯、马卡龙、草莓塔装一大盒。'},
  {giftId:'hair_clip',amount:520,need:2000,weight:10,intimacy:3,label:'珍珠发夹套装',desc:'她上次逛街多看了两眼的那款。'},
  {giftId:'scented_candle',amount:520,need:2000,weight:8,intimacy:3,label:'香薰蜡烛礼盒',desc:'居家氛围感，味道选了她提过的。'},
  {giftId:'godiva',amount:1314,need:6000,weight:12,intimacy:4,label:'进口巧克力礼盒',desc:'心形铁盒装，刻了约会日期。'},
  {giftId:'starbucks_set',amount:1314,need:6000,weight:10,intimacy:4,label:'星巴克限定杯套装',desc:'城市限定杯+联名保温瓶。'},
  {giftId:'photo_album',amount:1314,need:6000,weight:9,intimacy:4,label:'定制相册本',desc:'把你们约会照片洗出来装订成册。'},
  {giftId:'skincare_mini',amount:1314,need:6000,weight:8,intimacy:4,label:'大牌护肤小样套装',desc:'精华、面霜、面膜旅行装组合。'},
  {giftId:'silver_ring',amount:5200,need:18000,weight:11,intimacy:5,label:'925银开口戒指',desc:'简约款，内侧可刻字。'},
  {giftId:'perfume30',amount:5200,need:18000,weight:10,intimacy:5,label:'沙龙香水30ml',desc:'专柜试香后她最中意的那支。'},
  {giftId:'kindle',amount:5200,need:18000,weight:8,intimacy:5,label:'电子书阅读器',desc:'通勤路上看她总用手机看书。'},
  {giftId:'earbuds',amount:5200,need:18000,weight:7,intimacy:5,label:'降噪耳机',desc:'地铁里她总把音量开很大。'},
  {giftId:'bracelet',amount:8800,need:40000,weight:10,intimacy:5,label:'轻奢品牌手链',desc:'玫瑰金链身，带一颗小吊坠。'},
  {giftId:'bag_small',amount:8800,need:40000,weight:9,intimacy:5,label:'小众设计师小包',desc:'不是大牌，但款式很对她胃口。'},
  {giftId:'spa_card',amount:8800,need:40000,weight:8,intimacy:5,label:'双人SPA体验卡',desc:'按摩+泡浴，下次约会一起去。'},
  {giftId:'watch_fashion',amount:20000,need:90000,weight:9,intimacy:6,label:'时尚腕表',desc:'表盘小巧，日常通勤也能戴。'},
  {giftId:'coat',amount:20000,need:90000,weight:8,intimacy:6,label:'羊绒大衣',desc:'她念叨了一整个冬天的款式。'},
  {giftId:'ipad',amount:20000,need:90000,weight:7,intimacy:6,label:'平板电脑',desc:'追剧、记账、看剧都更方便。'},
  {giftId:'jewelry_set',amount:38888,need:220000,weight:7,intimacy:6,label:'项链耳钉套装',desc:'成套首饰，晚宴场合拿得出手。'},
  {giftId:'weekend_hotel',amount:38888,need:220000,weight:6,intimacy:6,label:'五星酒店周末房券',desc:'江景房两晚，含双人早餐。'},
  {giftId:'camera',amount:38888,need:220000,weight:5,intimacy:6,label:'微单相机',desc:'她说想认真记录生活。'},
  {giftId:'diamond_pendant',amount:66666,need:550000,weight:6,intimacy:7,label:'钻石吊坠项链',desc:'30分主石，白金链，可以天天戴。'},
  {giftId:'luxury_bag',amount:66666,need:550000,weight:5,intimacy:7,label:'经典款名牌手袋',desc:'保值款，她背出去会很有面子。'},
  {giftId:'home_projector',amount:66666,need:550000,weight:4,intimacy:7,label:'激光家庭影院',desc:'把客厅变成私人影院。'},
  {giftId:'watch_luxury',amount:88888,need:1200000,weight:5,intimacy:7,label:'瑞士机械腕表',desc:'自动机芯，礼盒证书齐全。'},
  {giftId:'jade_bangle',amount:88888,need:1200000,weight:4,intimacy:7,label:'和田玉手镯',desc:'长辈看了也会点头的成色。'},
  {giftId:'piano_digital',amount:88888,need:1200000,weight:3,intimacy:7,label:'三角电钢琴',desc:'她小时候学过琴，一直想买一架。'},
  {giftId:'ring_diamond',amount:128000,need:3500000,weight:4,intimacy:8,label:'1克拉钻戒',desc:'虽然不是求婚，但诚意拉满。'},
  {giftId:'car_down',amount:128000,need:3500000,weight:3,intimacy:8,label:'代步车首付款',desc:'让她通勤不用挤地铁。'},
  {giftId:'art_piece',amount:128000,need:3500000,weight:3,intimacy:8,label:'青年画家原作',desc:'挂在家里玄关，来客都会问。'},
  {giftId:'birkin_entry',amount:200000,need:9000000,weight:3,intimacy:8,label:'爱马仕入门款包',desc:'配货排了很久才拿到。'},
  {giftId:'renovation',amount:200000,need:9000000,weight:2.5,intimacy:8,label:'衣帽间改造基金',desc:'把她想要的步入式衣帽间装起来。'},
  {giftId:'trip_europe',amount:200000,need:9000000,weight:2,intimacy:8,label:'欧洲双人游基金',desc:'机票酒店全包，十天自由行。'},
  {giftId:'jewelry_high',amount:388000,need:25000000,weight:2,intimacy:9,label:'高定珠宝套装',desc:'晚宴级项链耳环，镶嵌宝石。'},
  {giftId:'car_gift',amount:388000,need:25000000,weight:1.8,intimacy:9,label:'豪华品牌轿车',desc:'直接提车，写她名字。'},
  {giftId:'apartment_down',amount:388000,need:25000000,weight:1.5,intimacy:9,label:'公寓首付礼金',desc:'在她喜欢的地段付一笔首付。'},
  {giftId:'watch_collect',amount:520000,need:60000000,weight:1.2,intimacy:10,label:'收藏级名表',desc:'限量编号，升值和面子都有。'},
  {giftId:'diamond_set',amount:520000,need:60000000,weight:1,intimacy:10,label:'成套钻石首饰',desc:'项链、耳环、手链一整套。'},
  {giftId:'shop_share',amount:520000,need:60000000,weight:0.8,intimacy:10,label:'商铺产权份额',desc:'核心商圈小面积铺面，收租养老。'},
  {giftId:'painting_master',amount:880000,need:150000000,weight:0.8,intimacy:11,label:'名家书画真迹',desc:'拍卖行成交，可验真可保险。'},
  {giftId:'yacht_share',amount:880000,need:150000000,weight:0.6,intimacy:11,label:'游艇份额',desc:'周末出海，船员随叫随到。'},
  {giftId:'fund_gift',amount:880000,need:150000000,weight:0.5,intimacy:11,label:'私募理财份额',desc:'以她名义认购，稳健增值。'},
  {giftId:'villa_down',amount:1280000,need:400000000,weight:0.4,intimacy:12,label:'别墅定金',desc:'郊区别墅，带花园和车库。'},
  {giftId:'art_auction',amount:1280000,need:400000000,weight:0.35,intimacy:12,label:'拍卖行顶级藏品',desc:'当代艺术家代表作，有证书。'},
  {giftId:'brand_franchise',amount:1280000,need:400000000,weight:0.3,intimacy:12,label:'品牌加盟权',desc:'她一直想开一家自己的店。'}
];
function pickWeightedGift(pool){
  const total=pool.reduce(function(s,t){return s+t.weight},0);
  let r=Math.random()*total;
  for(let i=0;i<pool.length;i++){
    r-=pool[i].weight;
    if(r<=0)return pool[i];
  }
  return pool[0];
}
function pickDateGiftOffer(){
  const superOffer=tryPickSuperDreamGiftOffer();
  if(superOffer)return superOffer;
  const c=game.cash||0;
  let pool=DATE_GIFT_CATALOG.filter(function(t){return t.need<=c*1.15});
  if(!pool.length)pool=DATE_GIFT_CATALOG.filter(function(t){return t.amount===520});
  const g=pickWeightedGift(pool);
  return{
    amount:g.amount,label:g.label,desc:g.desc,giftId:g.giftId,
    intimacy:g.intimacy,refuseIntimacy:-2,superDream:false
  };
}
function datePhaseLabel(){
  const ph=game.daily&&game.daily.phase;
  return (typeof PHASE_LABELS!=='undefined'&&ph)?PHASE_LABELS[ph]:(ph||'本时段');
}
function showDateFlowModal(opts){
  const wrap=function(fn,close){
    return function(){
      if(close!==false&&typeof closeConsumeModal==='function')closeConsumeModal();
      if(typeof fn==='function')fn();
    };
  };
  if(typeof showConsumeModalHandlers==='function'){
    const btns=(opts.buttons&&opts.buttons.length)?opts.buttons.map(function(b){
      return{text:b.text,primary:!!b.primary,handler:wrap(b.handler)};
    }):[{text:opts.btn||'知道了',primary:true,handler:wrap(opts.onClose)}];
    showConsumeModalHandlers({icon:opts.icon||'💑',title:opts.title||'',html:opts.html||'',buttons:btns});
    return;
  }
  const q=typeof queueEventEncounter==='function'?queueEventEncounter:queueEncounterModal;
  q(opts);
}
function promptDateGiftModal(onDone){
  onDone=onDone||function(){};
  if(!game.married||game.divorced)return onDone();
  if(game.playerGender!=='male'||game.partnerGender!=='female')return onDone();
  if(Math.random()>=0.92)return onDone();
  const offer=pickDateGiftOffer();
  const gift=offer.amount;
  const refuseDelta=offer.refuseIntimacy!=null?offer.refuseIntimacy:-2;
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  let html,title,icon;
  if(offer.superDream){
    icon='💎';
    title='约会 · '+getGameCalendarYear()+' 年度超级梦想';
    html='<p>约会后 '+pn+' 认真地说：「这是我今年最大的心愿……」</p>'+
      '<p><b>'+offer.label+'</b> · 约 <b>¥'+gift.toLocaleString()+'</b></p>'+
      (offer.desc?'<p class="fold-meta" style="margin-top:6px">'+offer.desc+'</p>':'')+
      '<p class="fold-meta" style="color:var(--accent)">每年仅一次机会 · '+getGameCalendarYear()+' 年已触发</p>'+
      '<p class="fold-meta">你手头现金约 ¥'+(game.cash||0).toLocaleString()+'</p>'+
      '<p class="fold-meta">买：亲密度+'+offer.intimacy+' · 不买：亲密度'+refuseDelta+' · 缺钱：亲密度-1</p>';
  }else{
    icon='🎁';
    title='约会 · '+pn+' 想要礼物';
    html='<p>约会结束后，'+pn+' 拿出一张小愿望清单：</p>'+
      '<p>「今天能不能送我这份礼物？」</p>'+
      '<p>想要：<b>'+offer.label+'</b> · 约 <b>¥'+gift.toLocaleString()+'</b></p>'+
      (offer.desc?'<p class="fold-meta" style="margin-top:6px">'+offer.desc+'</p>':'')+
      '<p class="fold-meta">你手头现金约 ¥'+(game.cash||0).toLocaleString()+' · 日常礼物按价位分档，名目随机</p>'+
      '<p class="fold-meta">买：亲密度+'+offer.intimacy+' · 不买：亲密度'+refuseDelta+' · 缺钱：亲密度-1</p>';
  }
  showDateFlowModal({
    icon:icon,title:title,html:html,
    buttons:[
      {text:'买礼物 ¥'+gift.toLocaleString(),primary:true,handler:function(){
        if(game.cash>=gift){
          game.cash-=gift;
          adjustSpouseIntimacy(offer.intimacy);
          offer.occasion='date';
          offer.kind='date';
          recordGiftWish(offer,'fulfilled');
          addLog((offer.superDream?'💎 年度超级梦想':'🎁 约会礼物')+'「'+offer.label+'」¥'+gift.toLocaleString()+' · 亲密度+'+offer.intimacy,'info');
          if(typeof renderSpendingPanel==='function')renderSpendingPanel();
          if(typeof updateUI==='function')updateUI();
        }else{
          adjustSpouseIntimacy(-1);
          offer.occasion='date';
          offer.kind='date';
          recordGiftWish(offer,'broke');
          addLog((offer.superDream?'💎 年度超级梦想':'🎁 约会礼物')+'囊中羞涩，无法满足「'+offer.label+'」¥'+gift.toLocaleString()+' · 亲密度-1','warn');
        }
        onDone();
      }},
      {text:'不买',handler:function(){
        adjustSpouseIntimacy(refuseDelta);
        offer.occasion='date';
        offer.kind='date';
        recordGiftWish(offer,'refused');
        addLog((offer.superDream?'💎 拒绝年度超级梦想':'🎁 拒绝买礼物')+' · 亲密度'+refuseDelta,'warn');
        onDone();
      }}
    ]
  });
}
function promptDateSoftRiceModal(onDone){
  onDone=onDone||function(){};
  if(!game.married||game.divorced)return onDone();
  if(game.playerGender!=='female'||game.partnerGender!=='male')return onDone();
  if(Math.random()>=0.35)return onDone();
  const ask=1000+Math.floor(Math.random()*10001);
  const pn=game.partnerDisplayName||'伴侣';
  showDateFlowModal({
    icon:'🍚',title:'约会 · 吃软饭',
    html:'<p>'+pn+' 试探地问：能不能由你每月负担 <b>¥'+ask.toLocaleString()+'</b>？</p>',
    buttons:[
      {text:'同意 ¥'+ask.toLocaleString()+'/月',primary:true,handler:function(){
        game.partnerSoftRice=ask;
        addLog('同意伴侣吃软饭 ¥'+ask+'/月','info');
        onDone();
      }},
      {text:'拒绝',handler:function(){
        adjustSpouseIntimacy(-1);
        addLog('拒绝伴侣吃软饭要求 · 亲密度-1','warn');
        onDone();
      }}
    ]
  });
}
function showDateNightResultModal(onDone){
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const cost=typeof DATE_COST!=='undefined'?DATE_COST:500;
  const phaseLbl=datePhaseLabel();
  showDateFlowModal({
    icon:'💑',title:'约会 · '+phaseLbl,
    html:'<p>与 <b>'+pn+'</b> 度过了愉快的时光。</p><p class="fold-meta">花费 ¥'+cost+' · 压力-5 · 亲密度+1</p>',
    btn:'继续',onClose:onDone
  });
}
function dailyDateEvening(){
  if(!dailyUseMainActivity())return;
  const d=game.daily;
  const ph=d&&d.phase;
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const phaseLbl=datePhaseLabel();
  if(d){
    d.slotActivity='date';
    d.partnerOutForFun=false;
    d.partnerPresenceRolled=true;
    d._partnerPresencePhase=ph;
  }
  const finishDate=function(){
    if(game.daily){
      game.daily.noHomeReturnDay=false;
      game.daily.slotActivity='date';
    }
    if(phoneCfg().photoDate&&!game.longDistance&&Math.random()<0.4)adjustSpouseIntimacy(1);
    showDateNightResultModal(function(){
      promptDateGiftModal(function(){
        promptDateSoftRiceModal(function(){
          if(game.daily)game.daily.slotActivity=null;
          dailyAdvanceAfterSlotAction();
        });
      });
    });
  };
  if(game.longDistance){
    if(!buyOnlineDateDaily()){dailyReleaseMainActivity();return}
    showDateFlowModal({icon:'📱',title:'线上约会 · '+phaseLbl,html:'<p>与 '+pn+' 视频聊天。</p><p class="fold-meta">压力-2 · 亲密度随机 ±1</p>',btn:'挂断',onClose:finishDate});
    return;
  }
  const cost=typeof DATE_COST!=='undefined'?DATE_COST:500;
  if(game.cash<cost){
    addLog('现金不足，无法约会','fail');
    dailyReleaseMainActivity();
    return;
  }
  showDateFlowModal({
    icon:'💑',title:'出门约会 · '+phaseLbl,
    html:'<p>和 <b>'+pn+'</b> 现在出门约会？</p><p class="fold-meta">占满本时段 · 花费 ¥'+cost+' · 压力-5 · 亲密度+1</p>',
    buttons:[
      {text:'去约会 ¥'+cost,primary:true,handler:function(){
        if(!buyDateNightDaily()){dailyReleaseMainActivity();return;}
        finishDate();
      }},
      {text:'算了',handler:function(){dailyReleaseMainActivity()}}
    ]
  });
}

function renderDailyOutMenu(phase){
  let h='';
  if(typeof renderOutdoorCompanionPicker==='function')h+=renderOutdoorCompanionPicker();
  if(typeof hobbyProjectsSummaryHtml==='function')h+=hobbyProjectsSummaryHtml();
  h+='<p class="fold-meta">选择外出地点</p>';
  if(phase==='morning'){
    const wk=game.daily&&isWeekendDay(game.daily.dayIndex);
    if(wk&&game.married&&!game.divorced)h+='<p class="fold-meta">周末白天 · 伴侣可能在外面玩</p>';
    if(game.married&&!game.divorced)h+='<button class="btn" onclick="dailyPickOutMorning(\'date\')">💑 约会</button>';
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
      if(game.married&&!game.divorced)h+='<button class="btn" onclick="dailyPickOutEvening(\'date\')">'+allnightBtnLabel('💑 约会')+'</button>';
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
  if(typeof artState==='function'&&artState().broomOwned){
    h+='<button class="btn" '+(dis?'disabled':'')+' onclick="dailyPick'+prefix+'(\'clean\')">'+lbl('🧹 打扫卫生(1h)')+'</button> ';
  }
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
    if(typeof renderVillaHomeExtras==='function')h+=renderVillaHomeExtras('HomeMorning');
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
    if(typeof renderVillaHomeExtras==='function')h+=renderVillaHomeExtras('HomeEvening');
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
    if(typeof renderVillaHomeExtras==='function')h+=renderVillaHomeExtras('HomeEvening');
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
  return '<button class="btn" onclick="showTab(\'job\')">'+(game.daily&&game.daily.phase==='allnight'?allnightBtnLabel(label):label)+'</button> ';
}
function toggleMyLifeFold(){
  if(!game)return;
  game.myLifeOpen=!game.myLifeOpen;
  renderDailyPanel();
}
function renderMyLifeEntryActions(phase,d,sched){
  let h='';
  if(typeof hobbyProjectsSummaryHtml==='function')h+=hobbyProjectsSummaryHtml();
  if(d.slotHoursUsed>0)h+='<p style="color:var(--yellow);font-size:.72rem">'+dailySlotHoursLabel()+' · 做爱(2h)/自慰(不占时)仍可进行</p>';
  h+=partnerLocTag(phase);
  const left=dailySlotHoursLeft();
  if(left<=0){
    if(phase==='evening'&&typeof eveningEndChoicePending==='function'&&eveningEndChoicePending()){
      h+='<p class="fold-meta" style="color:var(--orange)">今晚 '+SLOT_HOURS_TOTAL+'h 已用尽 · 请在下方选择 😴 睡觉 或 🌙 后半夜</p>';
    }else{
      h+='<p class="fold-meta">本时段已无剩余时间 · 可选发呆/通讯录</p>';
    }
    return h;
  }
  if(phase==='allnight'&&isAllnightDevilHours()){
    h+='<p class="fold-meta" style="color:var(--accent)">🌈 彩虹时段不可外出 · 仍可宅家</p>';
  }
  if(d.slotHoursUsed===0){
    if(!(phase==='allnight'&&isAllnightDevilHours())){
      h+='<button class="btn" onclick="dailyOpenCategory(\'out\')">'+(phase==='allnight'?allnightBtnLabel('🚶 外出'):'🚶 外出')+'</button> ';
    }
    h+='<button class="btn" onclick="dailyOpenCategory(\'home\')">'+(phase==='allnight'?allnightBtnLabel('🏠 宅家'):'🏠 宅家')+'</button>';
  }else if(left>0){
    h+='<button class="btn" onclick="dailyOpenCategory(\'home\')">'+(phase==='allnight'?allnightBtnLabel('🏠 继续宅家（剩'+left+'h）'):'🏠 继续宅家（剩'+left+'h）')+'</button> ';
    if(!(phase==='allnight'&&isAllnightDevilHours())){
      h+='<button class="btn" onclick="dailyOpenCategory(\'out\')">'+(phase==='allnight'?allnightBtnLabel('🚶 继续外出'):'🚶 继续外出')+'</button>';
    }
  }
  return h;
}
function renderMyLifeFold(phase,d,sched){
  if(!game)return '';
  phase=phase||(game.daily&&game.daily.phase)||'morning';
  d=d||ensureDailyState();
  sched=sched==null?(game.employed&&isScheduledWorkSlot(phase)):sched;
  if(game.myLifeOpen==null){
    if(game.playerProfileOpen!=null)game.myLifeOpen=!!game.playerProfileOpen;
    else game.myLifeOpen=true;
  }
  const sub=d.subMenu||null;
  const inSub=sub==='out'||sub==='home';
  const open=!!game.myLifeOpen||inSub;
  let curHint=' · 外出 / 宅家';
  if(inSub)curHint=sub==='out'?' · 外出中':' · 宅家中';
  let h='<div class="phone-fold my-life-fold" style="margin-top:8px">';
  h+='<div class="phone-fold-hdr" onclick="toggleMyLifeFold()"><b>🏠 我的生活</b>';
  h+='<span class="phone-fold-cur fold-meta">'+curHint+'</span>';
  h+='<span class="phone-fold-chev" style="margin-left:auto;color:var(--muted)">'+(open?'▼':'▶')+'</span></div>';
  h+='<div class="phone-fold-body"'+(open?'':' style="display:none"')+'>';
  if(sub==='out')h+=renderDailyOutMenu(phase);
  else if(sub==='home')h+=renderDailyHomeMenu(phase);
  else h+=renderMyLifeEntryActions(phase,d,sched);
  h+='</div></div>';
  return h;
}
function renderDailyMainActions(phase,d,sched){
  let h='';
  if(game&&game.stdActive)h+='<p style="color:var(--orange);font-size:.72rem">🦠 性病：须每周用一个时段去医院，连续四周，第4次付 ¥'+((typeof STD_CURE_COST!=='undefined')?STD_CURE_COST:3000)+' 治愈；中断从头来</p>';
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
      if(game.employed&&sched&&!d.morningWorkDone){
        h+='<p class="fold-meta">'+(wk?'周末':'今日')+'需上班 · 选上班或选休（进宅家/外出即选休）</p>';
        h+='<button class="btn btn-primary" onclick="dailyMorningWork()">💼 '+(wk?'加班':'上班')+'</button>';
      }else if(game.employed&&isManualEmployed()&&!sched&&!wk){
        h+='<p class="fold-meta">🏭 今日白班轮休（产线排班）</p>';
      }
      h+=renderStdHospitalBtn();
    }else if(game.employed&&sched&&!d.morningWorkDone){
      h+='<p class="fold-meta" style="color:var(--orange)">今日有班次但未上班 · 时段已占用</p>';
      h+=renderStdHospitalBtn();
    }else{
      h+=renderStdHospitalBtn();
    }
    h+='<button class="btn" onclick="dailyZoneOut()">😶 发呆（跳下一时段 · 压力-1）</button>';
    h+='<button class="btn" onclick="dailyOpenCategory(\'contacts\')">📇 通讯录</button>';
    return h;
  }
  if(phase==='evening'){
    if(eveningEndChoicePending()){
      h+=renderEveningEndChoiceRows();
      return h;
    }
    const wk=isWeekendDay(d.dayIndex);
    if(d.slotHoursUsed===0){
      if(game.employed&&isScheduledWorkSlot('evening')&&!d.eveningShiftDone){
        h+='<p class="fold-meta">'+(wk?'周末':'今晚')+'需上班</p>';
        h+='<button class="btn btn-primary" onclick="dailyEveningShiftWork()">💼 '+(wk?'加班/晚班':'晚班上班')+'</button>';
      }else if(game.employed&&d.workedToday&&!wk&&!d.eveningOtTried){
        const ot=getEmploymentOtProfile();
        const otHint=ot?' <span class="fold-meta">（'+ot.otLabel+' · 收工后联谊约 '+Math.round(OT_SOCIAL_PROB*100)+'%）</span>':'';
        h+='<button class="btn btn-primary" onclick="dailyEveningWorkEvent()">🏢 加班</button>'+otHint;
      }
      h+=renderStdHospitalBtn();
    }else if(game.employed&&((isScheduledWorkSlot('evening')&&!d.eveningShiftDone)||(d.workedToday&&!wk&&!d.eveningOtTried))){
      h+='<p class="fold-meta" style="color:var(--orange)">今晚有班次/可加班但未去 · 时段已占用</p>';
      h+=renderStdHospitalBtn();
    }else{
      h+=renderStdHospitalBtn();
    }
    h+='<button class="btn" onclick="dailyZoneOut()">😶 发呆（跳下一时段 · 压力-1）</button>';
    h+='<button class="btn" onclick="dailyOpenCategory(\'contacts\')">📇 通讯录</button>';
    return h;
  }
  return h;
}
function buyCar(key){
  const c=CAR_SHOP[key];if(!c||!game)return;
  ensureCarState();
  if(game.ownedCars.includes(key)){addLog('已拥有'+c.name+'，无法重复购买','warn');return}
  if(!spendCash(c.price,'购买'+c.name))return;
  game.ownedCars.push(key);
  if(!game.ownedCar)game.ownedCar=key;
  addLog('🚗 购入'+c.name+' ¥'+c.price.toLocaleString()+(game.ownedCar===key?' · 已设为当前座驾':''),'success');
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
  if(typeof ensureEmploymentCompanyLinked==='function')ensureEmploymentCompanyLinked();
  if(typeof ensurePlayerStatState==='function')ensurePlayerStatState();
  if(typeof ensureAutoLifeNotStuck==='function')ensureAutoLifeNotStuck();
  if(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating()){
    el.innerHTML='<p style="color:var(--yellow);font-size:.85rem">⏩ 自动生活进行中，日程已暂停…</p>';
    return;
  }
  const ov=document.getElementById('autoLifeOverlay');
  if(ov&&!ov.classList.contains('hidden')){
    const acts=document.getElementById('autoLifeActions');
    if(acts&&acts.querySelector('button')){
      el.innerHTML='<p style="color:var(--muted);font-size:.85rem">请阅读自动生活汇报后点击「关闭汇报」</p>';
      return;
    }
  }
  if(typeof isPlayerImprisoned==='function'&&isPlayerImprisoned()){
    const left=Math.max(0,(game.imprisonedUntilWeek||0)-game.week);
    el.innerHTML='<div class="daily-panel-body">'+
      '<p style="color:var(--red);font-size:.85rem">🔒 监禁中（剩 '+left+' 周）· 无法安排日程</p>'+
      '<p class="fold-meta">服刑期间无法上班、外出、偷情或使用通讯录。</p>'+
      '<button class="btn btn-success" onclick="nextWeek()">服刑快进一周 →</button> '+
      '<span class="fold-meta">或使用下方「自动生活」批量快进</span></div>';
    return;
  }
  const d=ensureDailyState();
  if(typeof ensureDailyWorkFlagsConsistent==='function')ensureDailyWorkFlagsConsistent();
  const day=Math.min(d.dayIndex,6);
  const phase=d.phase||'morning';
  const sched=game.employed&&isScheduledWorkSlot(phase);
  const allnightWrap=dailyAllnightWrapClass(phase);
  let html='<div class="daily-panel-body'+allnightWrap+'">';
  html+=renderAllnightStreakRow();
  html+=renderEmployedJobBar();
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  if(game.married&&!game.divorced){
    if(typeof ensurePartnerPresence==='function')ensurePartnerPresence(phase);
    const loc=typeof getSpouseLocationLabel==='function'?getSpouseLocationLabel(phase):'';
    const pStreak=getCompanionAllnightStreak();
    const catchUp=!!(d.partnerCatchUpSleep&&phase==='morning');
    const skipDays=typeof getCompanionMonthlyAbsenceCount==='function'?getCompanionMonthlyAbsenceCount():(game.companion&&game.companion.monthlyAbsenceCount)||0;
    html+='<div class="daily-partner">'+partnerAvatarHtml(game.partnerGender)+'<div><b>'+pn+'</b><div class="fold-meta">📍 '+loc+'</div>'+
      (catchUp?'<div class="fold-meta" style="color:var(--blue)">😴 在家补觉'+(skipDays?(' · 本月旷工 '+skipDays+'/'+MONTHLY_ABSENCE_LIMIT):'')+'</div>':'')+
      '<div class="fold-meta" style="color:var(--orange)">通宵：'+(pStreak?'已连续未睡 '+pStreak+' 天':'未通宵')+'</div>'+
      (!catchUp&&skipDays?'<div class="fold-meta" style="color:var(--yellow)">本月旷工 '+skipDays+'/'+MONTHLY_ABSENCE_LIMIT+' 天</div>':'')+
      '<div class="fold-meta">亲密度 <b>'+(game.spouseIntimacy!=null?game.spouseIntimacy:'—')+'</b></div>'+
      '</div></div>';
  }
  const left=dailySlotHoursLeft();
  html+=renderTempStatsHtml();
  if(typeof renderMyLifeFold==='function')html+=renderMyLifeFold(phase,d,sched);
  html+='<div class="daily-week">'+DAY_NAMES.map((n,i)=>'<span class="daily-dot'+(i<d.dayIndex?' done':i===day&&d.dayIndex<7?' cur':'')+'">'+n+'</span>').join('')+'</div>';
  if(d.dayIndex>=7){
    html+='<p class="daily-done">✅ 本周七天日程已满</p>';
    html+='<button class="btn btn-success" onclick="nextWeek()">进入下周 →</button> ';
    html+='<button class="btn btn-success" onclick="nextMonth()">下一个月 →</button> ';
    html+='<span class="fold-meta">或使用下方「自动生活」快进</span>';
    html+='</div>';
    el.innerHTML=html;return;
  }
  html+=renderPartnerInviteOutHint();
  html+='<div class="daily-actions">';
  if(eveningEndChoicePending()){
    html+=renderEveningEndChoiceRows();
  }else{
    html+=renderDailyMainActions(phase,d,sched);
  }
  html+='</div>';
  if(typeof renderPropertyPanel==='function')html+=renderPropertyPanel();
  html+=renderCarPanel();
  html+=renderPhonePanel();
  html+='<div class="daily-side-tools">';
  if(typeof renderContactsBlock==='function')html+=renderContactsBlock();
  if(typeof renderGiftWishBlock==='function')html+=renderGiftWishBlock();
  html+='</div>';
  html+='</div>';
  el.innerHTML=html;
  if(typeof renderDailyTimeBar==='function')renderDailyTimeBar();
  if(phase==='allnight'&&d.allnightArrivalPending){
    setTimeout(function(){if(typeof showOvertimeAllnightArrivalModal==='function')showOvertimeAllnightArrivalModal()},80);
  }
  if(phase==='allnight'&&dailySlotBlocked()&&!d.allnightEndModalShown&&!d.allnightArrivalPending){
    setTimeout(function(){if(typeof showAllnightExhaustedModal==='function')showAllnightExhaustedModal()},80);
  }
  if(phase==='evening'&&eveningEndChoicePending()){
    setTimeout(function(){if(typeof promptEveningEndChoiceIfNeeded==='function')promptEveningEndChoiceIfNeeded()},80);
  }
  schedulePartnerInviteOutCheck();
}
function migrateDailyState(){
  if(typeof ensurePlayerStatState==='function')ensurePlayerStatState();
  if(game){
    if(game.myLifeOpen==null&&game.playerProfileOpen!=null)game.myLifeOpen=!!game.playerProfileOpen;
    if(game.superDreamGiftYear==null)game.superDreamGiftYear=null;
    ensureGiftWishHistory();
    ensureArchivedPartnerWishLists();
    if(typeof migrateGiftWishArchives==='function')migrateGiftWishArchives();
    if(typeof repairGiftWishHistories==='function')repairGiftWishHistories();
    if(!game.ownedPhones||!game.ownedPhones.length){
      game.ownedPhones=game.phone?[game.phone]:['xiaomi'];
      if(!game.ownedPhones.includes('xiaomi'))game.ownedPhones.unshift('xiaomi');
    }
    if(game.phonePanelOpen==null)game.phonePanelOpen=false;
    if(game.nokiaBonusActive==null)game.nokiaBonusActive=false;
    ensureCarState();
    ensurePhoneState();
    if(typeof ensureEmploymentCompanyLinked==='function')ensureEmploymentCompanyLinked();
    if(game.playerCircles&&(typeof game.playerCircles!=='object'||Array.isArray(game.playerCircles))){
      game.playerCircles={social:[],hobby:[],workplace:[],friends:[],family:[]};
    }
  }
  if(game){
    if(game.pendingPartnerCatchUpSleep==null)game.pendingPartnerCatchUpSleep=false;
    if(game.companionAllnightChoiceResolved==null)game.companionAllnightChoiceResolved=false;
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
    if(d.companionMorningSkipLogged==null)d.companionMorningSkipLogged=false;
    if(d.morningWorkDone==null)d.morningWorkDone=false;
    if(d.eveningShiftDone==null)d.eveningShiftDone=false;
    if(d.allnightShiftDone==null)d.allnightShiftDone=false;
    if(d.eveningOtTried==null)d.eveningOtTried=false;
    if(d.eveningEndModalShown==null)d.eveningEndModalShown=false;
    if(typeof ensureDailyWorkFlagsConsistent==='function')ensureDailyWorkFlagsConsistent();
    if(d.allnightArrivalPending==null)d.allnightArrivalPending=false;
    if(d.villaPartyUsed==null)d.villaPartyUsed=false;
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
  if(!game.partnerTempStats)game.partnerTempStats=defaultTempStats();
  if(game.companion){
    if(game.companion.monthlyAbsenceCount==null)game.companion.monthlyAbsenceCount=0;
    if(game.companion.monthlyAbsenceMonthKey==null&&typeof getMonthlyAbsenceMonthKey==='function')
      game.companion.monthlyAbsenceMonthKey=getMonthlyAbsenceMonthKey();
    if(typeof ensureCompanionMonthlyAbsenceMonth==='function')ensureCompanionMonthlyAbsenceMonth();
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
