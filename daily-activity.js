/* 日常活动系统 — 由 build.js 注入 */
const DAY_NAMES=['周一','周二','周三','周四','周五','周六','周日'];
const PHASE_LABELS={morning:'白天',evening:'晚上',rest:'休息',allnight:'通宵'};
const INTERNET_CATS=['信息技术','文化传媒','销售零售与电商'];
const CAR_SHOP={
  economy:{name:'代步车',price:150000,commute:'car'},
  suv:{name:'SUV',price:300000,commute:'car'},
  sports:{name:'跑车',price:900000,commute:'car'}
};
const PHONE_SHOP={
  nokia:{name:'诺基亚',price:100,noApp:true,noTaxi:true},
  xiaomi:{name:'小米',price:2000,default:true},
  huawei:{name:'华为超屌屏',price:18000,posBias:0.12,negBias:-0.05,paidUp:0.08,loseMult:1.4,photoDate:true},
  iphone:{name:'iPhone 20 Pro Max',price:10000,costMult:1.2,negBias:-0.12,loseMult:1.3,photoDate:true}
};
const SURROGACY_LOCAL=500000;
const SURROGACY_FOREIGN=1000000;
const STAT_MAX=120;
const TEMP_STAT_RANGE=10;
const SLOT_HOURS_TOTAL=8;
const SLOT_BATCH_HOURS=8;

function defaultDailyState(){
  return{dayIndex:0,phase:'morning',allnightStreak:0,workSkipDays:0,workedDays:0,weekWorkWarned:false,workedToday:false,jobHuntedToday:false,jobHuntCount:0,subMenu:null,
    slotHoursUsed:0,slotSexUsed:false,slotMasturbateUsed:false,slotSnackUsed:false,snackPortionsToday:0,partnerSnackPortionsToday:0,
    slotContactsUsed:{},slotNoAnswerContacts:{}};
}
function dailySlotHoursLeft(){
  const d=game&&game.daily;return SLOT_HOURS_TOTAL-((d&&d.slotHoursUsed)||0);
}
function dailySlotHoursLabel(){
  const left=dailySlotHoursLeft(),used=SLOT_HOURS_TOTAL-left;
  return '本时段 <b>'+used+'</b>/'+SLOT_HOURS_TOTAL+'h · 剩 '+left+'h';
}
function resetDailySlotFlags(){
  const d=ensureDailyState();if(!d)return;
  d.slotHoursUsed=0;d.slotSexUsed=false;d.slotMasturbateUsed=false;d.slotSnackUsed=false;
}
function dailySlotBlocked(){return dailySlotHoursLeft()<=0}
function dailyCanUseHours(h){
  h=h||1;
  if(dailySlotHoursLeft()<h){addLog('本时段只剩 '+dailySlotHoursLeft()+'h，无法安排 '+h+'h','fail');return false}
  return true;
}
function dailyAddHours(h,jumpNextPhase){
  const d=ensureDailyState();if(!d)return;
  d.slotHoursUsed=Math.min(SLOT_HOURS_TOTAL,(d.slotHoursUsed||0)+h);
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
  if(ph==='morning')advanceDailyPhase('evening');
  else if(ph==='evening')advanceDailyPhase('rest');
  else if(ph==='allnight')renderDailyPanel();
  else renderDailyPanel();
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
  if(hours===SLOT_BATCH_HOURS){
    if(!dailyCanUseHours(SLOT_BATCH_HOURS))return;
    const html=dailyRunScrollSessions(fn,SLOT_BATCH_HOURS);
    dailyAddHours(SLOT_BATCH_HOURS,true);
    if(html)showConsumeModal({icon:'📱',title:'连刷8小时',html:html+'<br><span style="color:var(--green)">时段已满，进入下一时段</span>',buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
    return;
  }
  if(!dailyCanUseHours(1))return;
  const html=dailyRunScrollSessions(fn,1);
  dailyAddHours(1,false);
  if(html)showConsumeModal({icon:'📱',title:'1小时',html:html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
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
  html+='<br><span class="fold-meta">占用 1h · 每10压力多吃1份</span>';
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
  const loc=typeof getSpouseLocationLabel==='function'?getSpouseLocationLabel(phase):'';
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  return '<span class="daily-partner-inline">'+partnerAvatarHtml(game.partnerGender)+' '+pn+' · '+loc+'</span>';
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
  if(typeof isSpouseAtHome==='function'&&!isSpouseAtHome(ph)){addLog('伴侣不在家，无法双人餐','fail');return}
  if(!spendCash(SNACK_MEAL_COUPLE_COST,'双人餐'))return;
  const pPortions=snackPortionsForStress(game.familyStress);
  const partnerStress=game.companion?game.companion.familyStress:0;
  const sPortions=snackPortionsForStress(partnerStress);
  const playerR=applySnackPortionsToPlayer(pPortions);
  const partnerR=applySnackPortionsToPartner(sPortions);
  adjustSpouseIntimacy(1);
  ensureDailyState().slotSnackUsed=true;
  addLog('🍱 双人餐 ¥'+SNACK_MEAL_COUPLE_COST+' · 你'+pPortions+'份 · 伴侣'+sPortions+'份 · 亲密度+1','info');
  showConsumeModal({
    icon:'🍱',title:'双人餐 · 1小时',
    html:snackEatModalHtml('外卖双人餐 ¥'+SNACK_MEAL_COUPLE_COST,playerR,partnerR),
    buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]
  });
  dailyAddHours(1,false);
}
function clearDailySexReserve(){
  if(game&&game.daily)game.daily.slotSexUsed=false;
  game._dailySexPendingHours=0;
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
function phoneDesc(key){
  const p=PHONE_SHOP[key];if(!p)return '';
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
    if(typeof openContactsModal==='function')openContactsModal();
    return;
  }
  if(menu!=='home'&&dailySlotBlocked()){addLog('本时段 '+SLOT_HOURS_TOTAL+'h 已满','fail');return}
  const d=ensureDailyState();
  if((menu==='out'||menu==='home')&&shouldMarkWorkSkipNow())markWorkSkipForPhase();
  d.subMenu=menu;
  renderDailyPanel();
}
function dailyBackToMain(){
  ensureDailyState().subMenu=null;
  renderDailyPanel();
}
function shouldMarkWorkSkipNow(){
  const d=game.daily,ph=d.phase;
  if(ph==='morning')return game.employed&&isScheduledWorkSlot('morning')&&!d.workedToday;
  if(ph==='evening')return game.employed&&isScheduledWorkSlot('evening');
  return false;
}
function markWorkSkipForPhase(){
  const d=game.daily,ph=d.phase;
  if(ph==='morning'&&game.employed&&isScheduledWorkSlot('morning')&&!d.workedToday){
    d.workSkipDays=(d.workSkipDays||0)+1;
    d.workedToday=false;
    addLog('🛋 '+skipWorkLabel()+'（本周第'+d.workSkipDays+'天未上班）','warn');
  }else if(ph==='evening'&&game.employed&&isScheduledWorkSlot('evening')){
    d.workSkipDays=(d.workSkipDays||0)+1;
    addLog('🛋 缺勤晚班（本周第'+d.workSkipDays+'天）','warn');
  }
}
function dailyPickOutMorning(place){
  dailyGoOut(place);
}
function dailyPickOutEvening(kind){
  if(kind==='date')dailyDateEvening();
  else dailyEveningOut(kind);
}
function dailyPickHomeMorning(action){
  if(action==='rest')dailyStayHomeMorning();
  else if(action==='sex')dailyTrySex();
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
  addLog('📋 完成'+(PHASE_LABELS[slot]||slot)+'求职（今日第'+d.jobHuntCount+'次）','info');
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
  return Math.min(STAT_MAX,Math.max(0,ps[k]||0));
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
  if(!game.phone)game.phone='xiaomi';
  if(!game.playerGender)game.playerGender='male';
  if(!game.partnerGender)game.partnerGender='female';
  return game.daily;
}
function effStat(k){
  if(!game||!game.stats)return 0;
  return Math.min(STAT_MAX,Math.max(0,(game.stats[k]||0)+(game.tempStats[k]||0)));
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
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning){
    applyWeeklyStatGrowthSilent();
    applyPartnerWeeklyStatGrowth();
  }else{
    weeklyAutoStatPoints();
    applyPartnerWeeklyStatGrowth();
    maybeTickStocksForDay(0);
  }
}
function phoneCfg(){return PHONE_SHOP[game.phone]||PHONE_SHOP.xiaomi}
function spendWithPhoneMult(amt,label){
  const mult=phoneCfg().costMult||1;
  return spendCash(Math.round(amt*mult),label);
}
function commuteMorning(){
  if(game.ownedCar)return {cost:0,stress:0,mode:'驾车'};
  if(phoneCfg().noTaxi){
    addStress(1,'地铁 ');
    return {cost:0,stress:1,mode:'地铁'};
  }
  if(game.cash>=50&&Math.random()<0.35){
    spendCash(50,'打车');
    return {cost:50,stress:0,mode:'打车'};
  }
  addStress(1,'地铁 ');
  return {cost:0,stress:1,mode:'地铁'};
}
function maybeMeetOnCommute(){
  if(Math.random()<0.18)meetRandomPerson('通勤');
  if(Math.random()<0.04&&isManualJob(game.employment?game.market[game.employment.jobIdx]:null)){
    if(Math.random()<0.5*phoneCfg().loseMult){game.phone='nokia';addLog('📱 手机丢失！只剩诺基亚','fail')}
  }
}
function meetRandomPerson(where,baseChance){
  if(Math.random()>=(baseChance!=null?dailyMeetChance(baseChance):dailyMeetChance(0.55)))return;
  const jobs=game.market.filter(j=>!isOverAgeLimit(j));
  if(!jobs.length)return;
  const job=jobs[Math.floor(Math.random()*jobs.length)];
  const co=pickCompany(job.idx,job.heatPct>=108?'high':job.heatPct>=102?'mid':'low');
  const income=Math.round(job.pay*(0.7+Math.random()*0.6));
  const names=['小陈','阿杰','Linda','老王','小周','阿明','菲菲','大刘'];
  const id='ct_'+game.week+'_'+game.contacts.length;
  const person={id,name:names[Math.floor(Math.random()*names.length)],jobTitle:job.title,category:job.category,
    company:co.name,income,metWeek:game.week,metWhere:where};
  if(game.contacts.some(c=>c.jobTitle===person.jobTitle&&c.company===person.company))return;
  if(typeof ensureContactAffairFields==='function')ensureContactAffairFields(person);
  if(typeof tagMeetContact==='function')tagMeetContact(person);
  game.contacts.push(person);
  addLog('👋 在'+where+'结识 '+person.name+'（'+person.jobTitle+' @'+person.company+' · 年收入约¥'+income.toLocaleString()+'）','info');
}
function addContactFromMeet(person){game.contacts.push(person)}
function advanceDailyPhase(nextPhase){
  const d=ensureDailyState();
  if(!d)return;
  if(typeof checkBffOutingMiss==='function')checkBffOutingMiss();
  d.phase=nextPhase;
  d.subMenu=null;
  resetDailySlotFlags();
  if(typeof resetContactSlotFlags==='function')resetContactSlotFlags();
  renderDailyPanel();
}
function finishDay(restType){
  const d=ensureDailyState();
  if(!d)return;
  if(restType==='allnight'){
    d.allnightStreak=(d.allnightStreak||0)+1;
    addStress(10,'通宵 ');
    if(d.allnightStreak>=5){game.endingType='overwork';endGame('overwork');addLog('💀 连续5天通宵，猝死。','fail');return}
    d.phase='allnight';
    addLog('🌙 进入通宵时段（奖励×2 · APP岗位×2）','warn');
    renderDailyPanel();updateUI();
    return;
  }
  d.allnightStreak=0;
  addLog('😴 休息恢复','info');
  advanceToNextDay();
}
function bumpDayAfterAllnight(){
  const d=ensureDailyState();
  d.dayIndex++;
  d.jobHuntedToday=false;
  d.jobHuntCount=0;
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
  if(!bumpDayAfterAllnight())return;
  d.phase='morning';
  d.workedToday=false;
  addStress(6,'通宵不睡 ');
  addLog('☀ 通宵不睡，硬撑进入白天（未补觉 · 连续通宵 '+d.allnightStreak+' 天）','warn');
  renderDailyPanel();updateUI();
}
function finishAllnightSleepThrough(){
  const d=ensureDailyState();
  if(!d||d.phase!=='allnight')return;
  if(!bumpDayAfterAllnight())return;
  d.allnightStreak=0;
  d.phase='evening';
  d.workedToday=false;
  addStress(-3,'补觉 ');
  addLog('😴 入睡补觉，睡过白天直接到了晚上','info');
  renderDailyPanel();updateUI();
}
function advanceToNextDay(){
  const d=ensureDailyState();
  if(typeof tickSnackDayRebound==='function')tickSnackDayRebound(d);
  if(typeof checkBffOutingMiss==='function')checkBffOutingMiss();
  if(typeof resetContactSlotFlags==='function')resetContactSlotFlags();
  d.dayIndex++;
  d.phase='morning';
  d.workedToday=false;
  d.jobHuntedToday=false;
  d.jobHuntCount=0;
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
  if(!dailyUseMainActivity())return;
  commuteMorning();
  maybeMeetOnCommute();
  game.daily.workedDays=(game.daily.workedDays||0)+1;
  game.daily.workedToday=true;
  const job=game.market[game.employment.jobIdx];
  if(!meetsJobStats(job,true)){
    game.tempStats.body=Math.min(TEMP_STAT_RANGE,game.tempStats.body+2);
    addLog('⚠ 体能/心智/精神靠临时状态硬撑上班','warn');
  }
  addLog('💼 上班（'+DAY_NAMES[game.daily.dayIndex]+'白天）','info');
  dailyAdvanceAfterSlotAction();
}
function dailyGoOut(place){
  if(!dailyUseMainActivity())return;
  const mult=dailyRewardMult();
  const map={park:{stat:'body',n:1,label:'公园'},cafe:{stat:'spirit',n:1,label:'咖啡店'},library:{stat:'mind',n:1,label:'图书馆'}};
  const p=map[place];if(!p)return;
  const gain=Math.round(p.n*mult);
  game.stats[p.stat]=Math.min(STAT_MAX,(game.stats[p.stat]||0)+gain);
  addLog('🚶 外出'+p.label+' · '+p.stat+'+'+gain+(mult>1?'（通宵×'+mult+'）':''),'info');
  if(typeof tryCompleteBffOuting==='function')tryCompleteBffOuting(place);
  meetRandomPerson(p.label,0.55);
  dailyAdvanceAfterSlotAction();
}
function dailyStayHomeMorning(){
  if(!dailyCanUseHours(1))return;
  addStress(-1,'宅家休息 ');
  addLog('🏠 白天宅家休息 · 压力-1','info');
  dailyAddHours(1,false);
}
function dailyEveningOut(kind){
  const mult=dailyRewardMult();
  const phase=game.daily.phase;
  if(!dailyUseMainActivity())return;
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
          if(phase==='allnight')renderDailyPanel();
          else dailyAdvanceAfterSlotAction();
          return;
        }
      }else addLog('🍸 夜店艳遇一夜'+(mult>1?'（通宵×'+mult+'）':''),'info');
    }
    if(Math.random()<Math.min(0.4,0.15*mult))applyHangover(mult);
  }else if(kind==='bar'){
    if(typeof tryCompleteBffOuting==='function')tryCompleteBffOuting('bar');
    if(!spendWithPhoneMult(200,'酒吧')){dailyReleaseMainActivity();return}
    addStress(-1*mult,'酒吧 ');
    if(Math.random()<Math.min(0.45,0.2*mult))applyHangover(mult);
  }else if(kind==='store'){
    if(typeof tryCompleteBffOuting==='function')tryCompleteBffOuting('store');
    if(!spendWithPhoneMult(50,'便利店')){dailyReleaseMainActivity();return}
    addStress(-1*mult,'便利店 ');
    meetRandomPerson('便利店',0.12);
    if(Math.random()<0.08*mult){
      game.referralOpportunity=generateReferralOpportunity();
      addLog('🤝 便利店偶遇熟人，获得内推线索！','success');
    }
  }
  dailyAdvanceAfterSlotAction();
}
function applyHangover(mult){
  mult=mult||1;
  const loss=2*mult;
  ['body','mind','spirit'].forEach(k=>{game.stats[k]=Math.max(0,(game.stats[k]||0)-loss)});
  adjustSpouseIntimacy(-1);
  addStress(3*mult,'宿醉 ');
  addLog('🤢 宿醉：三维-'+loss+'，亲密度-1'+(mult>1?'（通宵×'+mult+'）':''),'warn');
}
function dailyEveningShiftWork(){
  if(!game.employed){dailyAdvanceAfterSlotAction();return}
  if(!dailyUseMainActivity())return;
  commuteMorning();
  game.daily.workedDays=(game.daily.workedDays||0)+1;
  game.daily.workedToday=true;
  addLog('💼 加班/晚班（'+DAY_NAMES[game.daily.dayIndex]+'）','info');
  dailyAdvanceAfterSlotAction();
}
function dailyEveningWorkEvent(){
  if(!game.employed){dailyAdvanceAfterSlotAction();return}
  if(!dailyUseMainActivity())return;
  if(Math.random()<0.5){
    addStress(1,'加班 ');
    addLog('🌃 被迫加班 · 压力+1','warn');
  }else{
    addLog('🍻 公司联谊','info');
    if(Math.random()<0.35)applyHangover();
    if(Math.random()<0.22){
      if(typeof triggerAffairEncounter==='function'){
        const who=typeof createAffairContact==='function'?createAffairContact('联谊'):null;
        if(who){triggerAffairEncounter(who.id,'公司联谊');dailyAdvanceAfterSlotAction();return;}
      }
    }
  }
  dailyAdvanceAfterSlotAction();
}
function dailyJobHunt(slot,method){
  if(game.homeless){addLog('流浪中无法求职','fail');return}
  if(game.casinoActive||game.marketActive){addLog('请先结束赌场/人才市场','warn');return}
  const d=ensureDailyState();
  if(!dailyUseMainActivity())return;
  if(slot==='morning'&&d.phase!=='morning'){addLog('请切换到白天时段','fail');dailyReleaseMainActivity();return}
  if(slot==='evening'&&d.phase!=='evening'){addLog('请切换到晚上时段','fail');dailyReleaseMainActivity();return}
  if(slot==='allnight'&&d.phase!=='allnight'){addLog('请先进入通宵','fail');dailyReleaseMainActivity();return}
  if((method==='market'||method==='headhunter')&&slot!=='morning'){
    addLog('线下与猎头仅限白天','fail');dailyReleaseMainActivity();return;
  }
  game.dailyApplyContext={slot,drawMult:slot==='allnight'?2:1,market:method==='market'};
  showTab('job');
  const jobIdxs=getJobsToApply();
  if(method==='market'){
    enterMarket(true);
    return;
  }
  if(!jobIdxs.length){addLog('请先在求职页多选职业或行业','fail');game.dailyApplyContext=null;dailyReleaseMainActivity();return}
  if(method==='headhunter'){
    const hr=document.querySelector('input[name="applyMethod"][value="headhunter"]');
    if(hr)hr.checked=true;
    runApplyRound(jobIdxs,{slot,forceMethod:'headhunter',drawMult:1});
    return;
  }
  if(game.phone==='nokia'||phoneCfg().noApp){addLog('诺基亚无法用APP，请白天去人才市场','fail');game.dailyApplyContext=null;dailyReleaseMainActivity();return}
  const ar=document.querySelector('input[name="applyMethod"][value="app"]');
  if(ar)ar.checked=true;
  runApplyRound(jobIdxs,{slot,forceMethod:'app',drawMult:slot==='allnight'?2:1});
}
function dailyDateEvening(){
  if(!dailyUseMainActivity())return;
  const ok=game.longDistance?buyOnlineDateDaily():buyDateNightDaily();
  if(!ok){dailyReleaseMainActivity();return}
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

function renderDailyJobMenu(phase){
  const slot=dailyJobSlot();
  let h='<p class="fold-meta">应聘 / 求职</p>';
  if(phase==='morning'){
    h+='<button class="btn" onclick="dailyJobHunt(\'morning\',\'app\')">📱 招聘APP</button>';
    h+='<button class="btn" onclick="dailyJobHunt(\'morning\',\'market\')">🏢 线下人才市场</button>';
    h+='<button class="btn" onclick="dailyJobHunt(\'morning\',\'headhunter\')">🎯 猎头</button>';
  }else if(phase==='evening'||phase==='allnight'){
    h+='<p class="fold-meta" style="margin:4px 0">晚上与通宵仅可用招聘APP</p>';
    h+='<button class="btn" onclick="dailyJobHunt(\''+slot+'\',\'app\')">📱 招聘APP'+(phase==='allnight'?'（岗位×2）': '（1/5岗位）')+'</button>';
  }
  h+='<button class="btn" onclick="dailyBackToMain()">← 返回</button>';
  return h;
}
function renderDailyOutMenu(phase){
  let h='<p class="fold-meta">选择外出地点</p>';
  if(phase==='morning'){
    h+='<button class="btn" onclick="dailyPickOutMorning(\'park\')">🌳 公园（肉体+1）</button>';
    h+='<button class="btn" onclick="dailyPickOutMorning(\'cafe\')">☕ 咖啡店（精神+1）</button>';
    h+='<button class="btn" onclick="dailyPickOutMorning(\'library\')">📚 图书馆（心智+1）</button>';
  }else if(phase==='allnight'){
    h+='<p class="fold-meta">通宵外出 · 减压与事件概率×2</p>';
    h+='<button class="btn" onclick="dailyPickOutEvening(\'club\')">🪩 夜店 ¥500（减压×2）</button>';
    h+='<button class="btn" onclick="dailyPickOutEvening(\'bar\')">🍺 酒吧 ¥200（减压×2）</button>';
    h+='<button class="btn" onclick="dailyPickOutEvening(\'store\')">🏪 便利店 ¥50（减压×2）</button>';
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
  const mk=(act,label,off)=>'<button class="btn" '+(off?'disabled':'')+' onclick="dailyPick'+prefix+'(\''+act+'\')">'+label+'</button> ';
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
  const spouseHome=typeof isSpouseAtHome==='function'?isSpouseAtHome(ph):true;
  h+='<p class="fold-meta">游戏机2h · 电脑1h · 进食1h/次（每时段限吃1次 · 每10压力+1份 · 隔天反弹份数×2）</p>';
  h+='<button class="btn" '+(dis||!game.ownsConsole?'disabled':'')+' onclick="dailyPick'+prefix+'(\'console\')">🎮 游戏机(2h)</button> ';
  h+='<button class="btn" '+(dis||!game.ownsComputer?'disabled':'')+' onclick="dailyPick'+prefix+'(\'computer\')">💻 电脑(1h)</button> ';
  if(stock>=needP){
    h+='<button class="btn" '+(dis||ate?'disabled':'')+' onclick="dailyPick'+prefix+'(\'snack\')">🍿 零食(囤'+stock+'·自己吃'+needP+'份)(1h)</button> ';
  }else{
    h+='<button class="btn" '+(dis||ate?'disabled':'')+' onclick="dailyPick'+prefix+'(\'snack_single\')">🍱 单人餐¥'+SNACK_MEAL_SINGLE_COST+'(吃'+needP+'份)(1h)</button> ';
  }
  if(game.married&&!game.divorced){
    const needS=snackPortionsForStress(game.companion?game.companion.familyStress:0);
    const coupleOff=dis||ate||!spouseHome;
    h+='<button class="btn" '+(coupleOff?'disabled':'')+' onclick="dailyPick'+prefix+'(\'snack_couple\')">🍱 双人餐¥'+SNACK_MEAL_COUPLE_COST+'(你'+needP+'+伴'+needS+'·亲+1)(1h)'+(spouseHome?'':' · 伴侣不在家')+'</button> ';
  }
  if(ate)h+='<span class="fold-meta">本时段已进食</span>';
  return h;
}
function renderDailyHomeMenu(phase){
  const d=game.daily||{};
  let h='<p class="fold-meta">'+dailySlotHoursLabel()+' · 做爱2h · 自慰不占时（各1次）</p>';
  if(game.snackReboundPortions>0)h+='<p style="color:var(--orange);font-size:.72rem">⚠ 你昨日吃了 '+game.snackReboundPortions+' 份零食，今日进食反弹 +'+(game.snackReboundPortions*2)+' 压力</p>';
  if(game.partnerSnackReboundPortions>0)h+='<p style="color:var(--orange);font-size:.72rem">⚠ 伴侣昨日吃了 '+game.partnerSnackReboundPortions+' 份，今日反弹 +'+(game.partnerSnackReboundPortions*2)+'</p>';
  if((game.snackStock||0)>0)h+='<p class="fold-meta" style="font-size:.72rem">零食囤货 '+game.snackStock+' 份</p>';
  if(game.procreateIntentWeek===game.week)h+='<p style="color:var(--green);font-size:.72rem">🍼 备孕中（下次做爱怀孕率提升）</p>';
  if(phase==='morning'){
    h+='<button class="btn" onclick="dailyPickHomeMorning(\'rest\')">🛋 休息1h（-1压力）</button>';
    if(game.married&&!game.divorced){
      const home=typeof isSpouseAtHome==='function'?isSpouseAtHome('morning'):true;
      h+='<button class="btn" '+(d.slotSexUsed||dailySlotHoursLeft()<2?'disabled':'')+' onclick="dailyPickHomeMorning(\'sex\')">💕 做爱(2h)'+(home?'':' · 伴侣不在家')+'</button>';
      h+='<button class="btn" '+(d.slotMasturbateUsed?'disabled':'')+' onclick="dailyPickHomeMorning(\'masturbate\')">🫥 自慰</button>';
    }else if(game.divorced){
      h+='<button class="btn" '+(d.slotMasturbateUsed?'disabled':'')+' onclick="dailyPickHomeMorning(\'masturbate\')">🫥 自慰</button>';
    }
    if(game.married&&!game.divorced&&!game.pregnant&&!game.hasChildren){
      const procOn=game.procreateIntentWeek===game.week;
      h+='<button class="btn" '+(procOn?'disabled':'')+' onclick="dailyPickHomeMorning(\'procreate\')">'+(procOn?'🍼 备孕中':'🍼 备孕¥'+(typeof PROC_CREATE_COST!=='undefined'?PROC_CREATE_COST:3000))+'</button>';
    }
    h+=renderDailyHomeLeisureBtns('HomeMorning');
  }else if(phase==='allnight'){
    h+='<button class="btn" onclick="dailyPickHomeEvening(\'rest\')">🛋 休息1h（-1压力）</button>';
    if(game.married&&!game.divorced){
      h+='<button class="btn" '+(d.slotSexUsed||dailySlotHoursLeft()<2?'disabled':'')+' onclick="dailyPickHomeEvening(\'sex\')">💕 做爱(2h)</button>';
      h+='<button class="btn" '+(d.slotMasturbateUsed?'disabled':'')+' onclick="dailyPickHomeEvening(\'masturbate\')">🫥 自慰</button>';
    }else if(game.divorced){
      h+='<button class="btn" '+(d.slotMasturbateUsed?'disabled':'')+' onclick="dailyPickHomeEvening(\'masturbate\')">🫥 自慰</button>';
    }
    if(game.married&&!game.divorced&&!game.pregnant&&!game.hasChildren){
      const procOn=game.procreateIntentWeek===game.week;
      h+='<button class="btn" '+(procOn?'disabled':'')+' onclick="dailyPickHomeEvening(\'procreate\')">'+(procOn?'🍼 备孕中':'🍼 备孕¥'+(typeof PROC_CREATE_COST!=='undefined'?PROC_CREATE_COST:3000))+'</button>';
    }
    h+=renderDailyHomeLeisureBtns('HomeEvening');
  }else{
    h+='<button class="btn" onclick="dailyPickHomeEvening(\'rest\')">🛋 休息1h（-1压力）</button>';
    if(game.married&&!game.divorced){
      const homeE=typeof isSpouseAtHome==='function'?isSpouseAtHome('evening'):true;
      h+='<button class="btn" '+(d.slotSexUsed||dailySlotHoursLeft()<2?'disabled':'')+' onclick="dailyPickHomeEvening(\'sex\')">💕 做爱(2h)'+(homeE?'':' · 伴侣未归')+'</button>';
      h+='<button class="btn" '+(d.slotMasturbateUsed?'disabled':'')+' onclick="dailyPickHomeEvening(\'masturbate\')">🫥 自慰</button>';
    }else if(game.divorced){
      h+='<button class="btn" '+(d.slotMasturbateUsed?'disabled':'')+' onclick="dailyPickHomeEvening(\'masturbate\')">🫥 自慰</button>';
    }
    if(game.married&&!game.divorced&&!game.pregnant&&!game.hasChildren){
      const procOn=game.procreateIntentWeek===game.week;
      h+='<button class="btn" '+(procOn?'disabled':'')+' onclick="dailyPickHomeEvening(\'procreate\')">'+(procOn?'🍼 备孕中':'🍼 备孕¥'+(typeof PROC_CREATE_COST!=='undefined'?PROC_CREATE_COST:3000))+'</button>';
    }
    h+=renderDailyHomeLeisureBtns('HomeEvening');
  }
  h+='<button class="btn" onclick="dailyBackToMain()">← 返回</button>';
  return h;
}
function renderDailyMainActions(phase,d,sched){
  let h='';
  if(d.slotHoursUsed>0)h+='<p style="color:var(--yellow);font-size:.78rem">'+dailySlotHoursLabel()+' · 做爱(2h)/自慰(不占时)仍可进行</p>';
  if(phase==='rest'){
    h+='<button class="btn btn-primary" onclick="finishDay(\'sleep\')">😴 休息（8h）</button>';
    h+='<button class="btn btn-warn" onclick="finishDay(\'allnight\')">🌙 通宵（+8h · 压力+10）</button>';
    h+='<button class="btn" onclick="dailyOpenCategory(\'contacts\')">📇 通讯录</button>';
    if(d.allnightStreak)h+='<p style="color:var(--orange)">已连续通宵 '+d.allnightStreak+' 天</p>';
    return h;
  }
  if(phase==='allnight'){
    h+='<p class="fold-meta">通宵 · 每时段8h · 奖励×2</p>';
    if(game.employed&&sched)h+='<button class="btn btn-primary" onclick="dailyEveningShiftWork()">💼 加班</button>';
    if(d.slotHoursUsed===0){
      h+=partnerLocTag(phase);
      h+='<button class="btn" onclick="dailyOpenCategory(\'out\')">🚶 外出</button>';
      h+='<button class="btn" onclick="dailyOpenCategory(\'home\')">🏠 宅家</button>';
      h+='<button class="btn" onclick="dailyOpenCategory(\'job\')">📋 应聘求职</button>';
    }else if(dailySlotHoursLeft()>0){
      h+=partnerLocTag(phase);
      h+='<button class="btn" onclick="dailyOpenCategory(\'home\')">🏠 继续宅家（剩'+dailySlotHoursLeft()+'h）</button>';
    }
    h+='<button class="btn" onclick="dailyOpenCategory(\'contacts\')">📇 通讯录</button>';
    h+='<button class="btn btn-warn" onclick="finishAllnightNoSleep()">☀ 通宵不睡（进入白天）</button>';
    h+='<button class="btn btn-primary" onclick="finishAllnightSleepThrough()">😴 入睡（睡过白天→晚上）</button>';
    if(d.allnightStreak)h+='<p style="color:var(--orange)">已连续通宵 '+d.allnightStreak+' 天 · 连5天可能猝死</p>';
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
    }else if(dailySlotHoursLeft()>0){
      h+=partnerLocTag(phase);
      h+='<button class="btn" onclick="dailyOpenCategory(\'home\')">🏠 继续宅家（剩'+dailySlotHoursLeft()+'h）</button>';
    }
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
        h+='<button class="btn btn-primary" onclick="dailyEveningWorkEvent()">🏢 加班/联谊</button>';
      }
      h+=partnerLocTag(phase);
      h+='<button class="btn" onclick="dailyOpenCategory(\'out\')">🚶 外出</button>';
      h+='<button class="btn" onclick="dailyOpenCategory(\'home\')">🏠 宅家</button>';
      h+='<button class="btn" onclick="dailyOpenCategory(\'job\')">📋 应聘求职</button>';
    }else if(dailySlotHoursLeft()>0){
      h+=partnerLocTag(phase);
      h+='<button class="btn" onclick="dailyOpenCategory(\'home\')">🏠 继续宅家（剩'+dailySlotHoursLeft()+'h）</button>';
    }
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
  const p=PHONE_SHOP[key];if(!p||!game)return;
  if(game.phone===key){addLog('已是当前手机','warn');return}
  if(!spendCash(p.price,'购买'+p.name))return;
  game.phone=key;
  addLog('📱 更换'+p.name,'success');
  renderDailyPanel();
}
function setTempStat(k,delta){
  if(!game.tempStats)game.tempStats=defaultTempStats();
  game.tempStats[k]=Math.max(-TEMP_STAT_RANGE,Math.min(TEMP_STAT_RANGE,(game.tempStats[k]||0)+delta));
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
  let html='<div class="daily-hdr"><b>第'+(game.week+1)+'周</b> · '+DAY_NAMES[day]+' · '+PHASE_LABELS[phase]+' · '+dailySlotHoursLabel()+
    (isWeekendDay(day)&&isInternetEmployed()?' · <span style="color:var(--orange)">互联网周末班</span>':'')+
    (isManualEmployed()?' · <span style="color:var(--blue)">轮班制</span>':'')+'</div>';
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  if(game.married&&!game.divorced){
    const loc=typeof getSpouseLocationLabel==='function'?getSpouseLocationLabel(phase):'';
    html+='<div class="daily-partner">'+partnerAvatarHtml(game.partnerGender)+'<div><b>'+pn+'</b><div class="fold-meta">📍 '+loc+'</div></div></div>';
  }
  if(!d.jobHuntedToday)html+='<p style="font-size:.72rem;color:var(--muted)">今日尚未应聘 · 可在「应聘求职」中刷 APP/线下/猎头（晚上与通宵仅 APP）</p>';
  else html+='<p style="font-size:.72rem;color:var(--green)">✓ 今日已应聘</p>';
  html+='<div class="daily-stats">'+
    '<span>你·肉体 <b>'+effStat('body')+'</b> 心智 <b>'+effStat('mind')+'</b> 精神 <b>'+effStat('spirit')+'</b> <span class="fold-meta">(合计'+statTotal(game.stats)+')</span></span>'+
    (game.married&&!game.divorced?'<br><span>'+pn+'·肉体 <b>'+partnerEffStat('body')+'</b> 心智 <b>'+partnerEffStat('mind')+'</b> 精神 <b>'+partnerEffStat('spirit')+'</b> <span class="fold-meta">(合计'+statTotal(game.partnerStats)+')</span></span>':'')+
    '<br><span>亲密度 <b>'+(game.spouseIntimacy!=null?game.spouseIntimacy:'—')+'</b></span></div>';
  html+='<div class="daily-temp">临时加成（±'+TEMP_STAT_RANGE+'，入职靠临时点不足易裁员）'+
    ' <button class="btn" onclick="setTempStat(\'body\',1)">肉体+</button><button class="btn" onclick="setTempStat(\'body\',-1)">-</button>'+
    ' <button class="btn" onclick="setTempStat(\'mind\',1)">心智+</button><button class="btn" onclick="setTempStat(\'mind\',-1)">-</button>'+
    ' <button class="btn" onclick="setTempStat(\'spirit\',1)">精神+</button><button class="btn" onclick="setTempStat(\'spirit\',-1)">-</button></div>';
  html+='<div class="daily-week">'+DAY_NAMES.map((n,i)=>'<span class="daily-dot'+(i<d.dayIndex?' done':i===day&&d.dayIndex<7?' cur':'')+'">'+n+'</span>').join('')+'</div>';
  if(d.dayIndex>=7){
    html+='<p class="daily-done">✅ 本周七天日程已满</p>';
    html+='<button class="btn btn-success" onclick="nextWeek()">进入下周 →</button> ';
    html+='<span class="fold-meta">或使用下方「自动生活」快进</span>';
    el.innerHTML=html;return;
  }
  html+='<div class="daily-actions">';
  const sub=d.subMenu||null;
  if(sub==='job')html+=renderDailyJobMenu(phase);
  else if(sub==='out')html+=renderDailyOutMenu(phase);
  else if(sub==='home')html+=renderDailyHomeMenu(phase);
  else html+=renderDailyMainActions(phase,d,sched);
  html+='</div>';
  html+='<div class="daily-shop"><b>购车</b> ';
  Object.keys(CAR_SHOP).forEach(k=>{const c=CAR_SHOP[k];html+='<button class="btn" onclick="buyCar(\''+k+'\')">'+c.name+' ¥'+(c.price/10000)+'万</button> ';});
  html+=(game.ownedCar?' <span class="fold-meta">已购 '+CAR_SHOP[game.ownedCar].name+'</span>':'')+'</div>';
  html+='<div class="daily-shop"><b>手机</b> 当前：<b>'+(PHONE_SHOP[game.phone]||PHONE_SHOP.xiaomi).name+'</b> · '+phoneDesc(game.phone)+'</div>';
  html+='<div class="daily-shop" style="font-size:.72rem">';
  Object.keys(PHONE_SHOP).forEach(k=>{
    if(k===game.phone)return;
    html+='<div style="margin:4px 0"><button class="btn" onclick="buyPhone(\''+k+'\')">换 '+PHONE_SHOP[k].name+'</button> <span class="fold-meta">'+phoneDesc(k)+'</span></div>';
  });
  html+='</div>';
  if(typeof renderContactsBlock==='function')html+=renderContactsBlock();
  el.innerHTML=html;
}
function migrateDailyState(){
  const d=ensureDailyState();
  if(d){
    if(d.slotHoursUsed==null)d.slotHoursUsed=d.slotActionUsed?8:0;
    if(d.slotSexUsed==null)d.slotSexUsed=false;
    if(d.slotMasturbateUsed==null)d.slotMasturbateUsed=false;
    if(d.slotSnackUsed==null)d.slotSnackUsed=false;
    if(d.snackPortionsToday==null)d.snackPortionsToday=d.hadSnackToday?1:0;
    if(d.partnerSnackPortionsToday==null)d.partnerSnackPortionsToday=0;
  }
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
  if(game.hiredOnTempStats)return 1.45;
  const job=game.employed&&game.employment?game.market[game.employment.jobIdx]:null;
  if(job&&!meetsJobStats(job,false))return 1.25;
  return 1;
}
