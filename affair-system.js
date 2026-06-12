/* 做爱 / 艳遇 / 出轨 — 由 build.js 注入 */
const AFFAIR_HOTEL_COST=300;
const AFFAIR_LUXURY_HOTEL_COST=2000;
const AFFAIR_BLACKMAIL_TOILET=1000;
const AFFAIR_BLACKMAIL_PARTNER_HOME=10000;
const AFFAIR_BLACKMAIL_NO_WEDDING=100000;
const AFFAIR_WEDDING_COST=100000;
const AFFAIR_MIN_WEEKS_FOR_PROPOSAL=16;
const AFFAIR_WEDDING_DEADLINE_WEEKS=26;
const IMPRISON_DAYS=15;
const IMPRISON_WEEKS=2;
const AFFAIR_OUTDOOR_PREGNANCY_CHANCE=0.08;
const AFFAIR_INDOOR_MISTRESS_PREGNANCY_CHANCE=0.05;
const AFFAIR_PROPOSAL_WEEKLY_CHANCE=0.10;
const AFFAIR_RECENT_ACTIVE_WEEKS=10;
const AFFAIR_PREGNANCY_PAYOFF=50000;
const AFFAIR_PREGNANCY_MARRY_WEEKS=16;
const ABORTION_COST=3000;
const ABORTION_MAX_PREG_WEEKS=12;
const AFFAIR_WEDDING_PREGNANCY_REVEAL=0.55;

let pendingAffairContactId=null;

function isOppositeSexContact(c){
  if(!c||!game)return false;
  const pg=game.playerGender==='female'?'female':'male';
  const cg=c.gender==='female'?'female':'male';
  return pg!==cg;
}
function oppositeAffairGender(){
  return game&&game.playerGender==='female'?'male':'female';
}
function pregnancyWeeksElapsed(){
  if(!game||!game.pregnant)return 0;
  if(typeof ensurePregnancyStartWeek==='function')ensurePregnancyStartWeek();
  if(game.pregnancyStartWeek!=null&&game.pregnancyStartWeek>=0)
    return Math.max(0,(game.week||0)-game.pregnancyStartWeek);
  const total=typeof PREGNANCY_WEEKS!=='undefined'?PREGNANCY_WEEKS:40;
  if(typeof pregnancyWeeksRemaining==='function')return Math.max(0,total-pregnancyWeeksRemaining());
  return total-(game.pregnancyWeeksLeft||0);
}
function canPlayerAbort(){
  return !!(game&&game.pregnant&&game.pregnantSubject==='player'&&pregnancyWeeksElapsed()<=ABORTION_MAX_PREG_WEEKS);
}
function cutContactForever(c){
  if(!c)return;
  c.unreachable=true;
  c.pendingPregnancyBlackmail=false;
  c.pregnancyMarryAgreed=false;
  if(c.affairStatus!=='married_affair')c.affairStatus='ended';
  addLog('📵 '+c.name+' 已与你断绝联系，无法再联络','warn');
}
function applyPregnancyBlackmailRefuseFx(c,opts){
  opts=opts||{};
  if(typeof addStress==='function')addStress(20,'怀孕要挟 ');
  if(game.married&&!game.divorced){
    if(typeof adjustSpouseIntimacy==='function')adjustSpouseIntimacy(-12,'出轨曝光 ');
    addLog('🚨 '+c.name+' 向你的伴侣告密出轨','fail');
    queueAffairModal({
      icon:'🚨',title:'怀孕要挟 · 告密',
      html:'<p><b>'+c.name+'</b> 把怀孕的事捅给了你的伴侣，家里炸开了锅。</p><p class="fold-meta">亲密度 -12 · 压力 +20</p>',
      btn:'……',
      onClose:function(){
        if(Math.random()<0.55&&typeof partnerRequestsDivorce==='function'){
          partnerRequestsDivorce('💔 '+c.name+' 告知伴侣你让她怀孕，提出离婚。',{playerPaysHalf:true});
        }
      }
    });
  }else if(opts.rape!==false){
    imprisonActor(IMPRISON_WEEKS,'强奸指控');
    if(typeof collectFromPlayer==='function')collectFromPlayer(10000,'强奸赔偿');
    else if(game.cash>=10000){game.cash-=10000;addLog('赔偿 ¥1万','fail')}
    addLog('⚖️ '+c.name+' 控告强奸 · 监禁'+IMPRISON_DAYS+'天','fail');
    queueAffairModal({
      icon:'⚖️',title:'强奸指控',
      html:'<p><b>'+c.name+'</b> 报警称你强奸，你被带走调查。</p><p style="color:var(--red)">监禁约 '+IMPRISON_DAYS+' 天 · 赔偿 ¥1万</p>',
      btn:'认栽'
    });
  }
}
function triggerMaleImpregnateBlackmail(c){
  if(!c)return;
  c.pregnantByPlayer=true;
  c.pendingPregnancyBlackmail=true;
  const dl=game.week+AFFAIR_PREGNANCY_MARRY_WEEKS;
  const html='幽会之后她确认怀孕。<br>可选择：<b>限时结婚</b>（须在 '+getDateStr(dl)+' 前完婚）或 <b>支付 ¥'+AFFAIR_PREGNANCY_PAYOFF.toLocaleString()+'</b> 封口。<br>'+
    '<span class="fold-meta">拒付封口费压力+20；无论是否付钱都将断绝联系。拒绝结婚压力+20'+(game.married&&!game.divorced?'，并告知伴侣':'，无伴侣则控告强奸')+'。</span>';
  if(typeof queueAffairModal==='function'){
    queueAffairModal({
      icon:'🤰',title:c.name+' 怀孕了',html:html,
      buttons:[
        {text:'支付五万',handler:function(){pregBlackmailPay(c.id)}},
        {text:'答应结婚',primary:true,handler:function(){pregBlackmailAgreeMarry(c.id)}},
        {text:'拒绝',handler:function(){pregBlackmailRefuse(c.id)}}
      ]
    });
    return;
  }
  showConsumeModal({
    icon:'🤰',title:c.name+' 怀孕了',html:html,
    buttons:[
      {text:'支付五万',fn:'pregBlackmailPay(\''+c.id+'\')'},
      {text:'答应结婚',primary:true,fn:'pregBlackmailAgreeMarry(\''+c.id+'\')'},
      {text:'拒绝',fn:'pregBlackmailRefuse(\''+c.id+'\')'}
    ]
  });
}
function pregBlackmailPay(contactId){
  closeConsumeModal();
  const c=findContact(contactId);
  if(!c)return;
  let paid=false;
  if(typeof spendCash==='function')paid=spendCash(AFFAIR_PREGNANCY_PAYOFF,c.name+'怀孕封口费');
  else if(game.cash>=AFFAIR_PREGNANCY_PAYOFF){
    game.cash-=AFFAIR_PREGNANCY_PAYOFF;
    if(typeof ledgerAddExpense==='function')ledgerAddExpense('affair','💸','怀孕封口费',AFFAIR_PREGNANCY_PAYOFF,false);
    paid=true;
  }
  if(!paid&&typeof addStress==='function')addStress(20,'拒付封口费 ');
  addLog(paid?'💸 已付 ¥'+AFFAIR_PREGNANCY_PAYOFF.toLocaleString()+' 封口费':'无力支付封口费 · 压力+20','fail');
  cutContactForever(c);
  queueAffairModal({
    icon:paid?'💸':'🚨',
    title:paid?'封口费已付':'无力支付封口费',
    html:paid
      ?'<p>你咬牙付了 ¥'+AFFAIR_PREGNANCY_PAYOFF.toLocaleString()+'，<b>'+c.name+'</b> 收下钱后断绝联系。</p>'
      :'<p>你拿不出封口费，<b>'+c.name+'</b> 愤而离去。</p><p class="fold-meta">压力 +20 · 已断绝联系</p>',
    btn:'知道了'
  });
  if(typeof updateUI==='function')updateUI();
}
function pregBlackmailAgreeMarry(contactId){
  closeConsumeModal();
  const c=findContact(contactId);
  if(!c)return;
  c.pendingPregnancyBlackmail=false;
  c.pregnancyMarryAgreed=true;
  c.pregnantByPlayer=true;
  c.affairStatus='proposal_pending';
  c.marriageAgreedWeek=game.week;
  c.pregnancyMarryDeadlineWeek=game.week+AFFAIR_PREGNANCY_MARRY_WEEKS;
  addLog('💍 答应在 '+getDateStr(c.pregnancyMarryDeadlineWeek)+' 前与 '+c.name+' 结婚','info');
  showConsumeModal({
    icon:'💍',title:'限期结婚',
    html:'请尽快办婚礼（¥'+(AFFAIR_WEDDING_COST/10000)+'万）。<br>婚后才知她是否真的怀孕。<br>'+
      '<span style="color:var(--orange)">逾期视同拒绝结婚'+(game.married&&!game.divorced?'（不会被告强奸，但伴侣可能知情）':'（不会被告强奸）')+'</span>',
    buttons:[
      {text:'稍后',fn:'closeConsumeModal()'},
      {text:'现在办婚礼',primary:true,fn:'promptAffairWedding(\''+c.id+'\')'}
    ]
  });
}
function pregBlackmailRefuse(contactId){
  closeConsumeModal();
  const c=findContact(contactId);
  if(!c)return;
  applyPregnancyBlackmailRefuseFx(c,{rape:true});
  cutContactForever(c);
  if(typeof updateUI==='function')updateUI();
}
function affairMistressPregnancyChance(loc){
  if(loc==='outdoor')return AFFAIR_OUTDOOR_PREGNANCY_CHANCE;
  if(loc==='luxury'||loc==='hotel')return AFFAIR_INDOOR_MISTRESS_PREGNANCY_CHANCE;
  return AFFAIR_INDOOR_MISTRESS_PREGNANCY_CHANCE*0.85;
}
function tryAffairMistressPregnancy(c,loc){
  if(!c||!isOppositeSexContact(c)||game.playerGender!=='male')return false;
  if(c.gender==='male'||c.pregnantByPlayer||c.pendingPregnancyBlackmail)return false;
  if(Math.random()>=affairMistressPregnancyChance(loc))return false;
  addLog('🤰 幽会后 '+c.name+' 怀孕了…','warn');
  triggerMaleImpregnateBlackmail(c);
  return true;
}
function tryAffairPlayerPregnancy(c){
  if(!c||game.pregnant||game.hasChildren||!isOppositeSexContact(c)||game.playerGender!=='female')return false;
  const p=typeof AFFAIR_PREGNANCY_CHANCE!=='undefined'?AFFAIR_PREGNANCY_CHANCE:0.15;
  if(Math.random()>=p)return false;
  game.outdoorAffairPregnancy=true;
  if(typeof startPregnancy!=='function'||!startPregnancy(true,'player'))return false;
  addLog('🤰 幽会后你怀孕了（可消费页堕胎，12周内）','warn');
  queueAffairModal({
    icon:'🤰',title:'幽会 · 意外怀孕',
    html:'<p>与 <b>'+c.name+'</b> 幽会后，你发现自己怀孕了。</p><p class="fold-meta">可在消费页堕胎（12周内）；逾期伴侣可能察觉</p>',
    btn:'知道了'
  });
  return true;
}
function tryAffairEncounterPregnancy(c,loc){
  if(!c)return false;
  if(tryAffairMistressPregnancy(c,loc))return true;
  if(tryAffairPlayerPregnancy(c))return true;
  return false;
}
function renderAbortionSpendingRow(){
  if(!game||!game.pregnant||game.pregnantSubject!=='player')return null;
  const wk=pregnancyWeeksElapsed();
  const can=wk<=ABORTION_MAX_PREG_WEEKS;
  return{
    label:'堕胎 ¥'+ABORTION_COST,
    meta:can?('孕期第 '+wk+' 周 · 12周内可堕胎'):'已超过12周 · 无法堕胎'+(game.married&&!game.divorced?' · 伴侣可能察觉':''),
    btn:'堕胎',fn:'promptPlayerAbortion()',off:!can
  };
}
function promptPlayerAbortion(){
  if(!canPlayerAbort()){addLog('已超过12周或无法堕胎','fail');return}
  if(!confirm('确定堕胎？费用 ¥'+ABORTION_COST+'（孕期第 '+pregnancyWeeksElapsed()+' 周）'))return;
  if(typeof spendCash==='function'&&!spendCash(ABORTION_COST,'堕胎'))return;
  game.pregnant=false;
  game.pregnantSubject=null;
  game.pregnancyStartWeek=null;
  game.pregnancyWeeksLeft=0;
  game.pregnancyIntimacyNet=0;
  game.outdoorAffairPregnancy=false;
  game.partnerKnowsPlayerPregnant=false;
  addLog('🏥 堕胎完成 · 花费 ¥'+ABORTION_COST,'info');
  if(typeof renderSpendingPanel==='function')renderSpendingPanel();
  if(typeof updateUI==='function')updateUI();
}
function tickOutdoorPregnancyWeekly(){
  if(!game||!game.pregnant||game.pregnantSubject!=='player')return;
  if(pregnancyWeeksElapsed()>ABORTION_MAX_PREG_WEEKS&&!game.partnerKnowsPlayerPregnant&&game.married&&!game.divorced){
    game.partnerKnowsPlayerPregnant=true;
    if(typeof adjustSpouseIntimacy==='function')adjustSpouseIntimacy(-10,'隐瞒怀孕 ');
    if(typeof addStress==='function')addStress(8,'怀孕曝光 ');
    addLog('🚨 怀孕超过12周 · 伴侣发现你曾可堕胎却隐瞒','fail');
    const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
    queueAffairModal({
      icon:'🚨',title:'怀孕隐瞒败露',
      html:'<p>孕期已超过12周，<b>'+pn+'</b> 察觉你本可堕胎却隐瞒至今。</p><p class="fold-meta">亲密度 -10 · 压力 +8</p>',
      btn:'……'
    });
  }
}
function tickAffairWifePregnancy(c){
  if(!c||!c.wifePregnantConfirmed||!c.babyDueWeek)return;
  if(game.week<c.babyDueWeek)return;
  c.wifePregnantConfirmed=false;
  c.babyDueWeek=0;
  if(!game.hasChildren){
    game.hasChildren=true;
    game.childRaisingMonthsLeft=typeof CHILD_RAISING_MONTHS!=='undefined'?CHILD_RAISING_MONTHS:216;
    addLog('👶 与 '+c.name+' 的孩子降生','success');
    if(typeof addLog==='function')addLog('月生活费上升','info');
    queueAffairModal({
      icon:'👶',title:'私生子降生',
      html:'<p>你与 <b>'+c.name+'</b> 的孩子出生了，抚养费与生活开支随之上升。</p>',
      btn:'知道了'
    });
  }
}

function imprisonmentWeeksLeft(){
  if(!game||!game.imprisonedUntilWeek)return 0;
  return Math.max(0,game.imprisonedUntilWeek-game.week);
}
function imprisonActor(weeks,label){
  if(!game)return;
  const w=weeks||IMPRISON_WEEKS;
  game.imprisonedUntilWeek=Math.max(game.imprisonedUntilWeek||0,game.week+w);
  if(typeof recordImprisonOrExtort==='function')recordImprisonOrExtort();
  addLog('🔒 '+label+' · 监禁约 '+IMPRISON_DAYS+' 天','fail');
  const left=imprisonmentWeeksLeft();
  const html='<p><b>'+label+'</b> · 约 '+IMPRISON_DAYS+' 天（'+w+' 周）</p>'+
    '<p class="fold-meta">剩余刑期 <b>'+left+'</b> 周 · 无法上班、外出或偷情</p>'+
    '<p style="margin-top:8px;font-size:.82rem">日常页可点 <b>服刑快进一周</b>，或用下方 <b>自动生活</b> 批量跳过。</p>';
  if(typeof queueAffairModal==='function'){
    queueAffairModal({icon:'🔒',title:'被监禁',html,btn:'知道了'});
  }else if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({icon:'🔒',title:'被监禁',html,buttons:[{text:'知道了',primary:true,handler:function(){if(typeof closeConsumeModal==='function')closeConsumeModal(true)}}]});
  }
}
function isPlayerImprisoned(){
  return !!(game&&game.imprisonedUntilWeek>game.week);
}
function getPlayerAnnualIncome(){
  if(!game)return 0;
  if(game.employed&&game.employment){
    const job=game.market[game.employment.jobIdx];
    if(job&&job.pay)return job.pay;
  }
  return game.money||0;
}
function companionJob(){
  const c=game&&game.companion;
  if(!c||!c.employed||!c.employment)return null;
  return game.market[c.employment.jobIdx]||null;
}
function companionWorkSlotScheduled(phase,dayIndex){
  const c=game.companion;
  if(!c||!c.employed||!c.employment)return false;
  const job=companionJob();
  if(!job)return false;
  const day=dayIndex!=null?dayIndex:((game.daily&&game.daily.dayIndex)||0);
  const weekend=day>=5;
  if(job.exposure>=4||INTERNET_CATS.includes(job.category)){
    if(weekend)return phase==='morning'||phase==='evening';
    return phase==='morning';
  }
  if(MANUAL_CATS.includes(job.category)||job.category==='交通运输'){
    const k=(game.week*7+day+(c.employment.jobIdx||0))%6;
    const morningShifts=[0,1,3,5],eveningShifts=[2,4];
    if(phase==='morning')return morningShifts.includes(k);
    if(phase==='evening')return eveningShifts.includes(k);
    return false;
  }
  if(weekend)return false;
  return phase==='morning';
}
function isCompanionWorkSlotForDay(phase,dayIndex){
  const ph=phase||'morning';
  if(ph==='morning'&&typeof isPartnerCatchUpSleeping==='function'&&isPartnerCatchUpSleeping(ph))return false;
  return companionWorkSlotScheduled(ph,dayIndex);
}
function isCompanionWorkSlot(phase){
  return isCompanionWorkSlotForDay(phase);
}
function isCompanionEffectivelyAtWork(phase){
  const ph=phase||(game.daily&&game.daily.phase)||'morning';
  if(ph==='morning'&&typeof isPartnerCatchUpSleeping==='function'&&isPartnerCatchUpSleeping(ph))return false;
  return isCompanionWorkSlot(ph);
}
function ensureCompanionMonthlyAbsenceMonth(){
  const c=game&&game.companion;
  if(!c)return;
  const mk=typeof getMonthlyAbsenceMonthKey==='function'?getMonthlyAbsenceMonthKey():1;
  if(c.monthlyAbsenceMonthKey!==mk){
    c.monthlyAbsenceMonthKey=mk;
    c.monthlyAbsenceCount=0;
  }
}
function getCompanionMonthlyAbsenceCount(){
  ensureCompanionMonthlyAbsenceMonth();
  return (game.companion&&game.companion.monthlyAbsenceCount)||0;
}
function recordCompanionWorkSkip(reason){
  const c=game&&game.companion;
  if(!c||!c.employed)return;
  if(typeof companionEmployerOwnerImmune==='function'&&companionEmployerOwnerImmune())return;
  ensureCompanionMonthlyAbsenceMonth();
  c.monthlyAbsenceCount=(c.monthlyAbsenceCount||0)+1;
  const lim=typeof MONTHLY_ABSENCE_LIMIT!=='undefined'?MONTHLY_ABSENCE_LIMIT:4;
  const n=c.monthlyAbsenceCount;
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  addLog('💼 '+pn+(reason||'旷工')+' · 本月 '+n+'/'+lim,'warn');
  if(n>lim)fireCompanionForWorkAbsence();
}
function fireCompanionForWorkAbsence(){
  const c=game&&game.companion;
  if(!c||!c.employed)return;
  if(typeof runAsCompanion==='function'){
    runAsCompanion(()=>{if(typeof recordCareerHistory==='function')recordCareerHistory(game.employment)});
  }
  c.employed=false;
  c.employment=null;
  c.layoffs=(c.layoffs||0)+1;
  ensureCompanionMonthlyAbsenceMonth();
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const lim=typeof MONTHLY_ABSENCE_LIMIT!=='undefined'?MONTHLY_ABSENCE_LIMIT:4;
  addLog('💔 '+pn+'本月旷工超过 '+lim+' 次，被辞退','fail');
  setTimeout(function(){
    if(typeof renderCompanionPanel==='function')renderCompanionPanel();
    if(typeof updateUI==='function')updateUI();
  },0);
}
function tickCompanionMorningCatchUp(){
  const d=game&&game.daily;
  if(!d||d.phase!=='morning'||!d.partnerCatchUpSleep||d.companionMorningSkipLogged)return;
  if(!game.companion||!game.companion.employed)return;
  d.companionMorningSkipLogged=true;
  if(isCompanionWorkSlotForDay('morning',d.dayIndex))recordCompanionWorkSkip('补觉旷工');
}
function isWeekendDayIndex(dayIndex){return dayIndex>=5}
function ensureLongDistancePartnerPresence(phase){
  if(!game||!game.married||game.divorced||!game.longDistance)return;
  const d=game.daily;if(!d)return;
  const ph=phase||(d.phase)||'morning';
  if(d.partnerPresenceRolled&&d._partnerPresencePhase===ph)return;
  d._partnerPresencePhase=ph;
  if(ph==='morning'&&d.partnerCatchUpSleep){
    d.partnerOutForFun=false;
    d.partnerPresenceRolled=true;
    return;
  }
  if(isCompanionEffectivelyAtWork(ph)){
    d.partnerOutForFun=false;
    d.partnerPresenceRolled=true;
    return;
  }
  let outProb=0;
  if(ph==='evening'||ph==='allnight')outProb=0.34;
  else if(ph==='morning'&&isWeekendDayIndex(d.dayIndex||0))outProb=0.38;
  d.partnerOutForFun=outProb>0&&Math.random()<outProb;
  d.partnerPresenceRolled=true;
}
function isPartnerAwakeForPhoneSex(phase){
  if(!game||!game.married||game.divorced)return false;
  const ph=phase||(game.daily&&game.daily.phase)||'morning';
  if(typeof isPartnerCatchUpSleeping==='function'&&isPartnerCatchUpSleeping(ph))return false;
  if(isCompanionEffectivelyAtWork(ph))return false;
  if(game.longDistance){
    ensureLongDistancePartnerPresence(ph);
    if(game.daily&&game.daily.partnerOutForFun)return false;
    if(ph==='allnight'){
      const d=game.daily;
      if(!d)return false;
      if(d.partnerAllnightStayedOut)return false;
      if(d.partnerOutForFun)return false;
      if(typeof isAllnightDevilHours==='function'&&isAllnightDevilHours())return true;
      if(d.partnerAllnightActive)return true;
      if(d.partnerForcedAsleep)return false;
      return false;
    }
    return true;
  }
  if(typeof isPartnerAllnightSleeping==='function'&&isPartnerAllnightSleeping())return false;
  if(typeof isSpouseAtHome==='function'&&!isSpouseAtHome(ph))return false;
  return true;
}
function getPhoneSexBlockReason(skipIntimacy){
  if(!game||game.gameOver)return '游戏已结束';
  if(!game.married||game.divorced)return '仅已婚可电话性爱';
  if(!game.longDistance)return '同城请面对面做爱';
  if(isPlayerImprisoned())return '监禁中无法电话性爱';
  const ph=game.daily&&game.daily.phase;
  if(ph!=='morning'&&ph!=='evening'&&ph!=='rest'&&ph!=='allnight')return '当前时段不适合（请选宅家时段）';
  if(typeof isPlayerAtHomeNow==='function'&&!isPlayerAtHomeNow(ph)){
    if(game.daily&&game.daily.slotActivity==='out')return '你正在外出，无法电话性爱';
    if(typeof isPlayerWorkingNow==='function'&&isPlayerWorkingNow())return '你正在上班或加班，无法电话性爱';
    return '你不在家，无法电话性爱';
  }
  if(sexSessionsLeft()<=0)return '本周做爱次数已用完（'+SEX_WEEKLY_LIMIT+'次）';
  if(!skipIntimacy&&(game.spouseIntimacy==null?0:game.spouseIntimacy)<=0)return '亲密度过低（≤0），对方拒绝';
  if(typeof getMenstrualMakeLoveBlock==='function'){
    const menstrualBlock=getMenstrualMakeLoveBlock();
    if(menstrualBlock)return menstrualBlock.replace(/做爱/g,'电话性爱');
  }
  if(typeof isPartnerAwakeForPhoneSex==='function'&&!isPartnerAwakeForPhoneSex(ph)){
    if(isCompanionEffectivelyAtWork(ph))return '伴侣在上班，无法电话性爱';
    if(typeof isPartnerCatchUpSleeping==='function'&&isPartnerCatchUpSleeping(ph))return '伴侣在家补觉，无法电话性爱';
    if(ph==='allnight')return '伴侣睡梦中，无法电话性爱';
    if(game.daily&&game.daily.partnerOutForFun)return '伴侣在外面玩，无法电话性爱';
    return '伴侣不方便接听，无法电话性爱';
  }
  return null;
}
function ensurePartnerPresence(phase){
  if(!game||!game.married||game.divorced||game.longDistance)return;
  const d=game.daily;if(!d)return;
  const ph=phase||(d.phase)||'morning';
  if(d.partnerPresenceRolled&&d._partnerPresencePhase===ph)return;
  d._partnerPresencePhase=ph;
  if(ph==='morning'&&d.partnerCatchUpSleep){
    d.partnerOutForFun=false;
    d.partnerPresenceRolled=true;
    return;
  }
  if(isCompanionEffectivelyAtWork(ph)){
    d.partnerOutForFun=false;
    d.partnerPresenceRolled=true;
    return;
  }
  let outProb=0;
  if(ph==='evening'||ph==='allnight')outProb=0.34;
  else if(ph==='morning'&&isWeekendDayIndex(d.dayIndex||0))outProb=0.38;
  d.partnerOutForFun=outProb>0&&Math.random()<outProb;
  if(ph==='allnight'&&d.partnerOutForFun&&typeof markPartnerAllnightActive==='function')markPartnerAllnightActive();
  d.partnerPresenceRolled=true;
}
function markPartnerAllnightActive(){
  const d=game&&game.daily;
  if(d&&d.phase==='allnight'){
    d.partnerAllnightActive=true;
    d.partnerForcedAsleep=false;
  }
}
function setPartnerAllnightAsleep(){
  const d=game&&game.daily;
  if(!d||d.phase!=='allnight')return;
  d.partnerForcedAsleep=true;
  d.partnerAllnightActive=false;
  d.partnerAllnightStayedOut=false;
}
function markPartnerAllnightStayedOut(){
  const d=game&&game.daily;
  if(!d||d.phase!=='allnight')return;
  d.partnerAllnightStayedOut=true;
  d.partnerForcedAsleep=false;
  d.partnerAllnightActive=true;
}
function reducePartnerNeglect(amount){
  if(!game||!game.married||game.divorced||game.partnerAffairActive)return;
  const before=game.partnerNeglectPoints||0;
  game.partnerNeglectPoints=Math.max(0,before-(amount||0.18));
}
function isPartnerAllnightSleeping(){
  if(!game||!game.married||game.divorced||game.longDistance)return false;
  const d=game.daily;
  if(!d||d.phase!=='allnight')return false;
  if(d.partnerAllnightStayedOut)return false;
  if(d.partnerAllnightActive)return false;
  if(typeof isPartnerOutForFun==='function'&&isPartnerOutForFun('allnight'))return false;
  if(typeof isSpouseAtHome==='function'&&isSpouseAtHome('allnight'))return true;
  return !!(d.partnerForcedAsleep);
}
function isPartnerCatchUpSleeping(phase){
  if(!game||!game.married||game.divorced||game.longDistance)return false;
  const ph=phase||(game.daily&&game.daily.phase)||'morning';
  if(ph!=='morning')return false;
  return !!(game.daily&&game.daily.partnerCatchUpSleep);
}
function isPartnerOutForFun(phase){
  if(!game||!game.married||game.divorced||game.longDistance)return false;
  const ph=phase||(game.daily&&game.daily.phase)||'morning';
  if(ph==='rest')return false;
  if(typeof isPartnerCatchUpSleeping==='function'&&isPartnerCatchUpSleeping(ph))return false;
  if(isCompanionEffectivelyAtWork(ph))return false;
  ensurePartnerPresence(ph);
  return !!(game.daily&&game.daily.partnerOutForFun);
}
function addCompanionStress(delta){
  if(!game||!game.companion||!delta)return;
  const c=game.companion;
  c.familyStress=Math.max(0,Math.min(200,(c.familyStress||0)+delta));
}
function bumpPartnerAffairRisk(amount){
  if(!game||!game.married||game.divorced||game.partnerAffairActive)return;
  game.partnerNeglectPoints=(game.partnerNeglectPoints||0)+(amount||0.12);
  if(game.partnerNeglectPoints>=0.55&&Math.random()<game.partnerNeglectPoints){
    game.partnerAffairActive=true;
    game.partnerNeglectPoints=0;
    addLog('💋 伴侣因被冷落而出轨','stress');
  }
}
function isSpouseAtHome(phase){
  if(!game||!game.married||game.divorced||game.longDistance)return false;
  const ph=phase||(game.daily&&game.daily.phase)||'morning';
  if(ph==='rest')return true;
  if(typeof isPartnerCatchUpSleeping==='function'&&isPartnerCatchUpSleeping(ph))return true;
  if(isCompanionEffectivelyAtWork(ph))return false;
  if(ph==='evening'||ph==='allnight'||(ph==='morning'&&isWeekendDayIndex((game.daily&&game.daily.dayIndex)||0))){
    ensurePartnerPresence(ph);
    return !game.daily.partnerOutForFun;
  }
  return true;
}
function canEatCoupleSnack(phase){
  if(!game||!game.married||game.divorced)return {ok:false,reason:'仅已婚可点双人餐'};
  const ph=phase||(game.daily&&game.daily.phase)||'morning';
  if(typeof isSpouseAtHome==='function'&&!isSpouseAtHome(ph))return {ok:false,reason:'伴侣不在家，无法双人餐'};
  if(ph==='allnight'&&isPartnerAllnightSleeping())return {ok:false,reason:'伴侣睡梦中，无法双人餐'};
  if(isPartnerCatchUpSleeping(ph))return {ok:false,reason:'伴侣在家补觉，无法双人餐'};
  return {ok:true,reason:''};
}
function getSpouseLocationLabel(phase){
  if(!game||!game.married||game.divorced)return '';
  const ph=phase||(game.daily&&game.daily.phase)||'morning';
  if(game.longDistance)return '异地·'+(typeof PLAYER_HOME_CITY!=='undefined'?PLAYER_HOME_CITY:'家乡');
  if(ph==='morning'&&typeof isPartnerCatchUpSleeping==='function'&&isPartnerCatchUpSleeping(ph))return '在家补觉';
  if(isCompanionEffectivelyAtWork(ph)){
    const c=game.companion,co=c&&c.employment&&c.employment.company;
    return '上班'+(co&&co.name?'·'+co.name:'');
  }
  if(isPartnerOutForFun(ph)){
    if(ph==='morning')return '在外面玩';
    if(ph==='allnight')return '外面玩·通宵';
    return '在外面玩';
  }
  if(ph==='allnight'){
    const ad=game.daily;
    if(ad&&ad.partnerAllnightStayedOut)return '外面玩·通宵';
    if(typeof isPartnerAllnightSleeping==='function'&&isPartnerAllnightSleeping())return '睡梦中';
    if(ad&&ad.partnerAllnightActive)return '在家·醒着';
    if(isSpouseAtHome(ph))return '睡梦中';
    return '在外面玩';
  }
  if(ph==='rest')return '在家';
  return '在家';
}
function playerAbsentSexReason(ph){
  if(typeof isPlayerAwayFromPartner==='function'&&isPlayerAwayFromPartner()){
    if(game.employed&&game.playerCity&&typeof PLAYER_HOME_CITY!=='undefined'&&game.playerCity!==PLAYER_HOME_CITY)
      return '你在外地工作，无法同房';
    return '异地分居，无法同房';
  }
  if(typeof isPlayerAtHomeNow==='function'&&!isPlayerAtHomeNow(ph)){
    const d=game.daily;
    if(d&&d.slotActivity==='out')return '你正在外出，无法同房';
    if(typeof isPlayerWorkingNow==='function'&&isPlayerWorkingNow())return '你正在上班或加班，无法同房';
    return '你不在家，无法同房';
  }
  return null;
}
function partnerAbsentSexReason(ph){
  if(typeof isPartnerCatchUpSleeping==='function'&&isPartnerCatchUpSleeping(ph))
    return '伴侣在家补觉，无法同房';
  if(ph==='allnight'&&typeof isPartnerAllnightSleeping==='function'&&isPartnerAllnightSleeping())
    return '伴侣睡梦中，无法同房';
  if(!isSpouseAtHome(ph)){
    if(isCompanionEffectivelyAtWork(ph)){
      if(ph==='morning')return '白天伴侣不在家（上班中）';
      if(ph==='evening')return '晚上伴侣在上班';
      return '伴侣在上班，无法同房';
    }
    if(typeof isPartnerOutForFun==='function'&&isPartnerOutForFun(ph)){
      if(ph==='morning')return '白天伴侣在外面玩';
      if(ph==='evening')return '晚上伴侣在外面玩';
      return '伴侣在外面玩，无法同房';
    }
    if(ph==='evening')return '晚上伴侣尚未回家';
    return '伴侣不在家，无法同房';
  }
  return null;
}
function getMakeLoveBlockReason(skipIntimacy){
  if(!game||game.gameOver)return '游戏已结束';
  if(!game.married||game.divorced)return '仅已婚可做爱';
  if(game.longDistance)return '异地分居，无法同房';
  if(isPlayerImprisoned())return '监禁中无法同房';
  const ph=game.daily&&game.daily.phase;
  if(ph!=='morning'&&ph!=='evening'&&ph!=='rest'&&ph!=='allnight')return '当前时段不适合（请选宅家时段）';
  const playerBlock=playerAbsentSexReason(ph);
  if(playerBlock)return playerBlock;
  const partnerBlock=partnerAbsentSexReason(ph);
  if(partnerBlock)return partnerBlock;
  if(sexSessionsLeft()<=0)return '本周做爱次数已用完（'+SEX_WEEKLY_LIMIT+'次）';
  if(!skipIntimacy&&(game.spouseIntimacy==null?0:game.spouseIntimacy)<=0)return '亲密度过低（≤0），对方拒绝';
  if(typeof getMenstrualMakeLoveBlock==='function'){
    const menstrualBlock=getMenstrualMakeLoveBlock();
    if(menstrualBlock)return menstrualBlock;
  }
  return null;
}
const NOKIA_PHONE_CHECK_CASH=10000;
function maybePartnerPhoneCheckOnNokia(context){
  if(!game||!game.married||game.divorced)return false;
  if(game.phone!=='nokia'||game.cash<=NOKIA_PHONE_CHECK_CASH)return false;
  let p=context==='switch'?0.18:0.10;
  const ph=game.daily&&game.daily.phase;
  if(isSpouseAtHome(ph))p+=0.08;
  p=Math.min(0.45,p);
  if(Math.random()>=p)return false;
  return partnerDiscoversPhoneAffairs();
}
function partnerDiscoversPhoneAffairs(){
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const lovers=(game.contacts||[]).filter(c=>
    (c.affairCount||0)>0||c.affairStatus==='affair'||c.affairStatus==='fwb'||c.affairStatus==='married_affair'
  );
  if(!lovers.length){
    if(typeof addStress==='function')addStress(2,'被查手机 ');
    addLog('📱 伴侣翻了你的经典诺基亚，没发现情人记录 · 压力+2','info');
    queueAffairModal({
      icon:'📱',title:'查手机 · 虚惊一场',
      html:'<p><b>'+pn+'</b> 趁你不注意翻了经典诺基亚，翻了一圈没发现情人记录，但气氛很尴尬。</p><p class="fold-meta">压力 +2</p>',
      btn:'知道了'
    });
    return false;
  }
  const names=lovers.map(c=>c.name).slice(0,3).join('、');
  if(typeof adjustSpouseIntimacy==='function')adjustSpouseIntimacy(-5);
  if(typeof addStress==='function')addStress(5,'被发现 ');
  addLog('🚨 伴侣检查经典诺基亚，发现情人/炮友：'+names+' · 亲密度-5 · 压力+5','fail');
  queueAffairModal({
    icon:'🚨',title:'手机里的情人记录',
    html:'<p><b>'+pn+'</b> 从你的经典诺基亚里翻出情人/炮友记录：<b>'+names+'</b>。</p><p class="fold-meta">亲密度 -5 · 压力 +5</p>',
    btn:'……',
    onClose:function(){
      if(Math.random()<0.45&&typeof partnerRequestsDivorce==='function'){
        partnerRequestsDivorce('💔 伴侣从你经典诺基亚里发现情人记录，提出离婚。',{playerPaysHalf:true});
      }
    }
  });
  return true;
}
function rollPartnerCaughtAffair(context){
  if(!game||!game.married||game.divorced)return false;
  let p=0;
  if(game.phone==='nokia')p+=(context==='phone'?0.26:0.10);
  const ph=game.daily&&game.daily.phase;
  if(isSpouseAtHome(ph)){
    p+=(context==='phone'?0.20:0.16);
  }
  p=Math.min(0.72,p);
  if(p<=0||Math.random()>=p)return false;
  if(typeof adjustSpouseIntimacy==='function')adjustSpouseIntimacy(-3);
  if(typeof addStress==='function')addStress(3,'被发现 ');
  const what=context==='phone'?'联系情人':'聊骚';
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  addLog('🚨 伴侣发现你'+what+' · 亲密度-3 · 压力+3','fail');
  const caughtP=p;
  queueAffairModal({
    icon:'🚨',title:'偷情被撞见',
    html:'<p><b>'+pn+'</b> 撞见你在'+what+'，场面一度非常尴尬。</p><p class="fold-meta">亲密度 -3 · 压力 +3</p>',
    btn:'……',
    onClose:function(){
      if(caughtP>=0.38&&Math.random()<0.32&&typeof partnerRequestsDivorce==='function'){
        partnerRequestsDivorce('💔 伴侣发现你'+what+'，提出离婚。',{playerPaysHalf:true});
      }
    }
  });
  return true;
}
function contactGenderLabel(g){
  return g==='male'?'男':'女';
}
function contactProfileLabel(c){
  if(!c)return '';
  const g=c.gender?contactGenderLabel(c.gender):'';
  const age=c.age!=null?c.age+'岁':'';
  const job=c.jobTitle||'未知职业';
  const bits=[g,age,job].filter(Boolean);
  return bits.join('·');
}
function ensureContactAffairFields(c){
  if(!c)return null;
  if(!c.gender)c.gender=Math.random()<0.5?'male':'female';
  if(c.age==null)c.age=22+Math.floor(Math.random()*18);
  if(c.body==null)c.body=42+Math.floor(Math.random()*38);
  if(c.mind==null)c.mind=40+Math.floor(Math.random()*40);
  if(c.spirit==null)c.spirit=40+Math.floor(Math.random()*40);
  if(c.hasPartner==null)c.hasPartner=Math.random()<0.42;
  if(!c.affairStatus)c.affairStatus='none';
  if(c.firstAffairWeek==null)c.firstAffairWeek=0;
  if(c.lastAffairWeek==null)c.lastAffairWeek=0;
  if(c.affairCount==null)c.affairCount=0;
  if(c.unreachable==null)c.unreachable=false;
  return c;
}
function findContact(id){
  if(!game||!game.contacts)return null;
  return ensureContactAffairFields(game.contacts.find(x=>x.id===id)||null);
}
function createAffairContact(where,existing,opts){
  opts=opts||{};
  if(existing)return ensureContactAffairFields(existing);
  const jobs=game.market.filter(j=>!isOverAgeLimit(j));
  if(!jobs.length)return null;
  const job=jobs[Math.floor(Math.random()*jobs.length)];
  const co=pickCompany(job.idx,job.heatPct>=108?'high':job.heatPct>=102?'mid':'low');
  const income=Math.round(job.pay*(0.7+Math.random()*0.6));
  if(!game.contacts)game.contacts=[];
  const id='ct_'+game.week+'_'+game.contacts.length+'_'+Math.floor(Math.random()*9999);
  const gender=oppositeAffairGender();
  const displayName=typeof pickStrangerDisplayName==='function'?pickStrangerDisplayName(gender):'路人';
  const person={id,name:displayName,jobTitle:job.title,jobSlug:job.slug,category:job.category,
    company:co?co.name:'未知公司',companyTier:co?co.tier:'mid',companyScale:co?co.scale:'medium',
    income,metWeek:game.week,metWhere:where||'艳遇',
    kind:'affair',gender,age:22+Math.floor(Math.random()*18)};
  ensureContactAffairFields(person);
  if(typeof tagAffairContactGender==='function')tagAffairContactGender(person);
  game.contacts.push(person);
  return person;
}
function affairDurationWeeks(c){
  if(!c||!c.firstAffairWeek||!c.lastAffairWeek)return 0;
  return Math.max(0,c.lastAffairWeek-c.firstAffairWeek);
}
function affairRelationshipWeeks(c){
  if(!c||!c.firstAffairWeek)return 0;
  return Math.max(0,(game.week||0)-c.firstAffairWeek);
}
function affairRecentlyActive(c){
  if(!c||!c.lastAffairWeek)return false;
  return (game.week-c.lastAffairWeek)<=AFFAIR_RECENT_ACTIVE_WEEKS;
}
function recordAffairSession(contact){
  if(!contact)return;
  if(!contact.firstAffairWeek)contact.firstAffairWeek=game.week;
  contact.lastAffairWeek=game.week;
  contact.affairCount=(contact.affairCount||0)+1;
  if(contact.affairStatus==='none')contact.affairStatus='affair';
  if(game.married&&!game.divorced)game.affairActive=true;
  if(typeof recordStrangerSex==='function')recordStrangerSex(contact);
}
function playerAffairSessionCount(){
  if(!game||!game.contacts)return 0;
  return game.contacts.reduce((s,c)=>s+(c.affairCount||0),0);
}
function contactHasAffairRecord(c){
  if(!c)return false;
  const st=c.affairStatus;
  return (c.affairCount||0)>0||st==='affair'||st==='fwb'||st==='married_affair'||st==='proposal_pending';
}
function playerHasAffairContactRecords(){
  return !!(game&&game.contacts&&game.contacts.some(contactHasAffairRecord));
}
function purgeAffairEvidenceForContact(contactId){
  if(pendingAffairContactId===contactId)pendingAffairContactId=null;
  if(queuedAffairProposalId===contactId)queuedAffairProposalId=null;
  if(game&&game.artifacts&&game.artifacts.stats&&Array.isArray(game.artifacts.stats.strangerSexIds)){
    const idx=game.artifacts.stats.strangerSexIds.indexOf(contactId);
    if(idx>=0)game.artifacts.stats.strangerSexIds.splice(idx,1);
  }
}
function syncPlayerAffairStateFromContacts(){
  if(!game)return;
  if(playerHasAffairContactRecords()){
    if(game.married&&!game.divorced)game.affairActive=true;
    return;
  }
  if(game.partnerAffairActive)return;
  game.affairActive=false;
}
function playerAffairStatusHtml(){
  if(!game||!game.married||game.divorced)return '';
  const sessions=playerAffairSessionCount();
  if(game.affairActive){
    return '<div style="color:var(--red)">婚外情进行中 · 幽会'+sessions+'次 · 月支出×2'+
      '<div style="font-size:.66rem;color:var(--muted);margin-top:2px">规则：完成1次幽会即成立；维持约'+
      AFFAIR_MIN_WEEKS_FOR_PROPOSAL+'周且近期有联系可能求婚；异性幽会有怀孕几率；已有亲生子则你无法再怀孕</div></div>';
  }
  if(sessions>0){
    return '<div style="color:var(--orange);font-size:.72rem">婚外情已结束（曾幽会'+sessions+'次）</div>';
  }
  return '';
}
function triggerAffairEncounter(contactOrId,source){
  if(!game||game.gameOver||isPlayerImprisoned())return;
  ensureAffairSlotFlags();
  if(game.daily&&game.daily.affairDoneThisSlot){addLog('本时段已经幽会过','fail');return;}
  if(game.daily&&(game.daily.slotHoursUsed||0)>0&&game.daily.slotActivity!=='out'&&game.daily.slotActivity!=='affair'){
    addLog('本时段已有其他安排，无法幽会','fail');return;
  }
  let contact=typeof contactOrId==='string'?findContact(contactOrId):contactOrId;
  if(!contact)contact=createAffairContact(source||'艳遇');
  if(!contact){addLog('艳遇未果','warn');return}
  pendingAffairContactId=contact.id;
  const src=source||'艳遇';
  const prof=typeof contactProfileLabel==='function'?contactProfileLabel(contact):contact.jobTitle;
  const intro=typeof formatMeetPersonHtml==='function'
    ?formatMeetPersonHtml(contact,src,false)+'<p style="color:var(--orange);margin-top:8px">气氛暧昧，你们越聊越投机…</p>'
    :'<p>与 <b>'+contact.name+'</b>（'+prof+'）· '+src+'</p>';
  if(typeof queuePersonEncounter==='function'){
    queuePersonEncounter({
      lane:'person',
      icon:'💋',title:'艳遇 · '+src,html:intro,btn:'继续',
      onClose:function(){showAffairLocationModal(contact.id,src)}
    });
  }else if(typeof queueEncounterModal==='function'){
    queueEncounterModal({
      lane:'person',
      icon:'💋',title:'艳遇 · '+src,html:intro,btn:'继续',
      onClose:function(){showAffairLocationModal(contact.id,src)}
    });
  }else showAffairLocationModal(contact.id,src);
}
function ensureAffairSlotFlags(){
  const d=game&&game.daily;
  if(!d)return;
  if(d.affairDoneThisSlot==null)d.affairDoneThisSlot=false;
  if(d.affairReservedThisSlot==null)d.affairReservedThisSlot=false;
}
function reserveAffairSlot(){
  ensureAffairSlotFlags();
  const d=game&&game.daily;
  if(!d)return false;
  if(d.affairDoneThisSlot){addLog('本时段已经幽会过','fail');return false;}
  if(d.affairReservedThisSlot)return true;
  if(d.slotActivity==='out'){
    game._affairNestedInOut=true;
    d.affairReservedThisSlot=true;
    return true;
  }
  if((d.slotHoursUsed||0)>0){addLog('本时段已在安排其他事，无法幽会','fail');return false;}
  if(typeof dailyUseMainActivity==='function'&&!dailyUseMainActivity())return false;
  d.affairReservedThisSlot=true;
  d.slotActivity='affair';
  return true;
}
function releaseAffairSlot(){
  const d=game&&game.daily;
  if(!d)return;
  if(game._affairNestedInOut){game._affairNestedInOut=false;return;}
  if(d.affairReservedThisSlot){
    d.affairReservedThisSlot=false;
    d.slotActivity=null;
    if(typeof dailyReleaseMainActivity==='function')dailyReleaseMainActivity();
  }
}
function finishAffairSlotAdvance(){
  pendingAffairContactId=null;
  const d=game&&game.daily;
  if(!d)return;
  d.affairDoneThisSlot=true;
  d.affairReservedThisSlot=false;
  const nested=!!game._affairNestedInOut;
  game._affairNestedInOut=false;
  const hasPending=!!(game._eveningOutAffairPending||game._affairAfterClose);
  if(!nested){
    d.slotActivity=null;
    if(!hasPending&&typeof dailyAdvanceAfterSlotAction==='function')dailyAdvanceAfterSlotAction();
  }
  drainAffairPendingCallbacks();
  if(game._overtimeSocialEndAction){
    const act=game._overtimeSocialEndAction;
    game._overtimeSocialEndAction=null;
    if(typeof applyOvertimeSocialEnd==='function')applyOvertimeSocialEnd(act);
  }
  if(typeof renderSpendingPanel==='function')renderSpendingPanel();
  if(typeof renderDailyPanel==='function')renderDailyPanel();
  if(typeof updateUI==='function')updateUI();
}
function queueAffairModal(opts){
  if(!opts)return;
  const payload={
    lane:'person',
    icon:opts.icon||'💋',
    title:opts.title||'幽会',
    html:opts.html||'',
    btn:opts.btn,
    buttons:opts.buttons,
    onClose:opts.onClose,
    logMsg:opts.logMsg
  };
  if(typeof queuePersonEncounter==='function'){
    queuePersonEncounter(payload);
    return;
  }
  const done=opts.onClose||function(){};
  if(typeof showConsumeModalHandlers==='function'){
    const btns=opts.buttons&&opts.buttons.length?opts.buttons.map(function(b){
      return{text:b.text,primary:!!b.primary,handler:function(){
        if(typeof b.handler==='function')b.handler();
        if(typeof closeConsumeModal==='function')closeConsumeModal(true);
        if(!b.keepOpen)done();
      }};
    }):[{text:opts.btn||'知道了',primary:true,handler:function(){
      if(typeof closeConsumeModal==='function')closeConsumeModal(true);
      done();
    }}];
    showConsumeModalHandlers({icon:payload.icon,title:payload.title,html:payload.html,buttons:btns});
    return;
  }
  if(opts.logMsg&&typeof addLog==='function')addLog(opts.logMsg,'info');
  done();
}
function drainAffairPendingCallbacks(){
  if(!game)return;
  const fn=game._eveningOutAffairPending||game._affairAfterClose;
  game._eveningOutAffairPending=null;
  game._affairAfterClose=null;
  if(!fn)return;
  if(typeof runAfterEncounterModals==='function')runAfterEncounterModals(fn);
  else try{fn()}catch(e){console.error('affair pending',e)}
}
function showAffairResultModal(opts){
  if(!opts)return;
  queueAffairModal({
    icon:opts.icon||'💋',
    title:opts.title||'幽会',
    html:opts.html||'',
    btn:opts.btn||'知道了',
    onClose:finishAffairSlotAdvance
  });
}
function buildAffairSuccessNarrative(c,loc,stressRelief){
  const name=c.name;
  const locLbl=affairLocLabel(loc);
  const narratives={
    hotel:'你们在'+locLbl+'开了间房。门一关上，彼此心照不宣，这一时段在暧昧与喘息里飞快过去。',
    luxury:'行政套房里灯光昏黄，'+name+' 低声说了句「就这一次」。你们在丝绸床单上纠缠，几乎忘了时间。',
    toilet:'地点仓促，你们躲在'+locLbl+'解决欲望。心跳得厉害，但快感来得又快又猛。',
    outdoor:'夜风拂过皮肤，你们在'+locLbl+'彼此取暖。远处偶有脚步声，反而更刺激。',
    car:'座椅放倒，车窗起雾。狭窄空间里，你们用最原始的方式宣泄渴望。',
    their_home:name+' 家里没人（或装作没人）。沙发、走廊、卧室——你们几乎没浪费任何角落。',
    player_home:'把家门关上的一刻，理智就断了。你们在自己家里放肆了一整个时段。'
  };
  let h='<p>'+(narratives[loc]||('你与 '+name+' 在'+locLbl+'幽会，度过了一个隐秘的时段。'))+'</p>';
  h+='<p class="fold-meta">压力 '+(stressRelief<0?stressRelief:'+'+stressRelief)+' · 本时段已占用</p>';
  return h;
}
function concludeAffairEncounter(c,loc,payload){
  const prof=typeof contactProfileLabel==='function'?contactProfileLabel(c):c.jobTitle;
  if(payload&&payload.log)addLog(payload.log,payload.logType||'info');
  let html=payload&&payload.html?payload.html:'';
  if(payload&&payload.meta)html+='<p class="fold-meta">'+payload.meta+'</p>';
  showAffairResultModal({
    icon:payload&&payload.icon?payload.icon:'💋',
    title:payload&&payload.title?payload.title:('幽会 · '+affairLocLabel(loc)),
    html:html,
    btn:payload&&payload.btn?payload.btn:'离开'
  });
}
function showAffairLocationModal(contactId,source){
  const c=findContact(contactId);
  if(!c)return;
  if(!reserveAffairSlot()){
    pendingAffairContactId=null;
    return;
  }
  const ph=game.daily&&game.daily.phase||'evening';
  const spouseHome=isSpouseAtHome(ph);
  const hasCar=!!game.ownedCar;
  const prof=typeof contactProfileLabel==='function'?contactProfileLabel(c):c.jobTitle;
  let html='<p>与 <b>'+c.name+'</b>（'+prof+'）· '+source+'</p>'+
    '<p class="fold-meta">选择幽会地点（不同地点有不同风险与花费）</p><div class="affair-loc-grid">';
  const locs=[
    {k:'hotel',label:'普通酒店',meta:'¥'+AFFAIR_HOTEL_COST},
    {k:'luxury',label:'五星酒店',meta:'¥'+AFFAIR_LUXURY_HOTEL_COST+' · 额外减压'},
    {k:'toilet',label:'厕所',meta:'免费 · 有被发现风险'},
    {k:'outdoor',label:'户外',meta:'免费 · 随机风险'},
    {k:'car',label:'车里',meta:hasCar?'有车 · 可能被发现':'需购车',off:!hasCar},
    {k:'their_home',label:'对方家里',meta:c.hasPartner?'对方有伴侣 · 高风险':'相对私密'},
    {k:'player_home',label:'玩家家里',meta:spouseHome&&(ph==='evening'||ph==='rest')?'伴侣在家 · 不可选':(ph==='morning'?'白天可能被撞见':'私密'),off:spouseHome&&(ph==='evening'||ph==='rest'||ph==='allnight')}
  ];
  locs.forEach(L=>{
    html+='<button class="btn affair-loc-btn" '+(L.off?'disabled':'')+' onclick="pickAffairLocation(\''+contactId+'\',\''+L.k+'\')">'+
      L.label+'<br><span class="fold-meta">'+L.meta+'</span></button>';
  });
  html+='</div>';
  queueAffairModal({
    icon:'💋',
    title:'选择幽会地点',
    html,
    buttons:[{text:'放弃',handler:function(){cancelAffairEncounter(true)}}]
  });
}
function cancelAffairEncounter(fromPicker){
  pendingAffairContactId=null;
  if(typeof closeConsumeModal==='function')closeConsumeModal(true);
  releaseAffairSlot();
  addLog('你放弃了这次艳遇','info');
  if(!fromPicker){
    queueAffairModal({
      icon:'💋',title:'已放弃艳遇',
      html:'<p>你没有继续这次幽会。</p>',
      btn:'知道了'
    });
  }
  if(game&&game._overtimeSocialEndAction){
    const act=game._overtimeSocialEndAction;
    game._overtimeSocialEndAction=null;
    if(typeof applyOvertimeSocialEnd==='function')applyOvertimeSocialEnd(act);
  }
  if(typeof renderDailyPanel==='function')renderDailyPanel();
}
function pickAffairLocation(contactId,loc){
  const c=findContact(contactId);
  if(!c)return;
  if(typeof closeConsumeModal==='function')closeConsumeModal(true);
  resolveAffairLocation(c,loc);
}
function affairCashFailModal(locLabel,cost){
  releaseAffairSlot();
  pendingAffairContactId=null;
  queueAffairModal({
    icon:'💸',
    title:'幽会 · 现金不足',
    html:'<p>你想在<b>'+locLabel+'</b>幽会，但现金不够（需 ¥'+cost.toLocaleString()+'）。</p>',
    btn:'算了'
  });
}
function resolveAffairLocation(c,loc){
  const ph=game.daily&&game.daily.phase||'evening';
  const prof=typeof contactProfileLabel==='function'?contactProfileLabel(c):c.jobTitle;
  let stressRelief=-3;
  let costNote='';
  if(loc==='hotel'){
    if(!spendCash(AFFAIR_HOTEL_COST,'幽会·酒店')){
      addLog('现金不足，无法开房','fail');
      affairCashFailModal('普通酒店',AFFAIR_HOTEL_COST);return;
    }
    costNote='花费 ¥'+AFFAIR_HOTEL_COST;
    if(typeof onArtifactHotelVisit==='function')onArtifactHotelVisit();
  }else if(loc==='luxury'){
    if(!spendCash(AFFAIR_LUXURY_HOTEL_COST,'幽会·五星酒店')){
      addLog('现金不足，无法入住五星酒店','fail');
      affairCashFailModal('五星酒店',AFFAIR_LUXURY_HOTEL_COST);return;
    }
    costNote='花费 ¥'+AFFAIR_LUXURY_HOTEL_COST;
    if(typeof onArtifactHotelVisit==='function')onArtifactHotelVisit();
    addStress(-1,'五星酒店 ');
    stressRelief=-5;
  }else if(loc==='toilet'){
    if(Math.random()<0.28){
      let html='<p>你们刚躲进隔间，就有人撞破。对方勒索封口费，场面极其难堪。</p><p class="fold-meta">厕所幽会 · 被撞破</p>';
      if(!collectFromPlayer(AFFAIR_BLACKMAIL_TOILET,'厕所幽会被勒索')){
        html+='<p style="color:var(--red)">你拿不出 ¥'+AFFAIR_BLACKMAIL_TOILET+'，对方扬言要曝光。</p>';
        concludeAffairEncounter(c,loc,{icon:'🚽',title:'幽会 · 厕所翻车',html:html,log:'无力支付勒索 ¥'+AFFAIR_BLACKMAIL_TOILET,logType:'fail',btn:'狼狈离开'});
      }else{
        if(typeof recordImprisonOrExtort==='function')recordImprisonOrExtort();
        html+='<p style="color:var(--red)">你被迫支付 ¥'+AFFAIR_BLACKMAIL_TOILET+' 才脱身。</p>';
        concludeAffairEncounter(c,loc,{icon:'🚽',title:'幽会 · 厕所翻车',html:html,log:'厕所幽会被发现，勒索 ¥'+AFFAIR_BLACKMAIL_TOILET,logType:'fail',btn:'狼狈离开'});
      }
      return;
    }
  }else if(loc==='outdoor'){
    if(Math.random()<0.18){
      addStress(4,'户外被发现 ');
      concludeAffairEncounter(c,loc,{
        icon:'🌿',title:'幽会 · 户外被撞见',
        html:'<p>你们正在'+affairLocLabel(loc)+'亲热，远处有人经过，尴尬到极点。</p><p class="fold-meta">压力 +4 · 本时段已占用</p>',
        log:'🌿 户外幽会被人撞见，尴尬压力+4',logType:'warn',btn:'赶紧离开'
      });
      return;
    }
    if(Math.random()<0.1&&game.married&&!game.divorced){
      partnerRequestsDivorce('💔 户外偷情被曝光，伴侣提出离婚。',{playerPaysHalf:true});
      concludeAffairEncounter(c,loc,{
        icon:'🌿',title:'幽会 · 户外曝光',
        html:'<p>你们以为四下无人，却被熟人认了出来。消息很快传开。</p><p style="color:var(--red)">伴侣提出离婚。</p>',
        log:'💔 户外偷情被曝光',logType:'fail',btn:'……'
      });
      return;
    }
  }else if(loc==='car'){
    if(Math.random()<0.22&&game.married&&!game.divorced){
      partnerRequestsDivorce('💔 车内偷情被发现，伴侣提出离婚。',{playerPaysHalf:true});
      concludeAffairEncounter(c,loc,{
        icon:'🚗',title:'幽会 · 车内败露',
        html:'<p>车窗上的雾气、凌乱的衣服——一切都被撞破。伴侣当场提出离婚。</p>',
        log:'💔 车内偷情被发现',logType:'fail',btn:'……'
      });
      return;
    }
    if(Math.random()<0.15){
      addStress(2,'车内紧张 ');
      stressRelief=-1;
      costNote='紧张感 +2 压力';
    }
  }else if(loc==='their_home'){
    if(c.hasPartner&&Math.random()<0.32){
      let html='<p>你们以为安全，在 <b>'+c.name+'</b> 家里偷欢时，对方伴侣却突然回家。场面一度失控。</p><p class="fold-meta">对方家里 · 被撞破</p>';
      if(!collectFromPlayer(AFFAIR_BLACKMAIL_PARTNER_HOME,'对方家里幽会被勒索')){
        html+='<p style="color:var(--red)">你无力支付 ¥'+AFFAIR_BLACKMAIL_PARTNER_HOME+' 封口费。</p>';
        concludeAffairEncounter(c,loc,{icon:'🏠',title:'幽会 · 对方家里翻车',html:html,log:'无力支付勒索 ¥'+AFFAIR_BLACKMAIL_PARTNER_HOME,logType:'fail',btn:'逃离'});
      }else{
        if(typeof recordImprisonOrExtort==='function')recordImprisonOrExtort();
        html+='<p style="color:var(--red)">你咬牙支付 ¥'+AFFAIR_BLACKMAIL_PARTNER_HOME+' 才没被当场闹大。</p>';
        concludeAffairEncounter(c,loc,{icon:'🏠',title:'幽会 · 对方家里翻车',html:html,log:'🚨 在对方家里被其伴侣发现，勒索 ¥'+AFFAIR_BLACKMAIL_PARTNER_HOME,logType:'fail',btn:'逃离'});
      }
      return;
    }
    if(c.hasPartner&&Math.random()<0.22){
      const pb=effStat('body'),tb=c.body||50;
      if(pb>=tb+Math.floor(Math.random()*16)-8){
        imprisonActor(IMPRISON_WEEKS,'打架获胜');
        collectFromPlayer(10000,'打架赔偿');
        concludeAffairEncounter(c,loc,{
          icon:'👊',title:'幽会 · 对方家里打架',
          html:'<p>在 <b>'+c.name+'</b> 家里，对方伴侣冲进来与你们扭打。你勉强占了上风，但警察很快赶到。</p><p style="color:var(--red)">被拘押 '+IMPRISON_WEEKS+' 周 · 赔偿 ¥1万</p>',
          log:'👊 与对方伴侣冲突，你打赢但被拘押并赔偿 ¥1万',logType:'fail',btn:'认栽'
        });
        return;
      }
      game.cash=(game.cash||0)+10000;
      game.money=(game.money||0)+10000;
      ledgerAddIncome('affair','💰','冲突对方入狱赔偿',10000);
      c.imprisonedUntilWeek=game.week+IMPRISON_WEEKS;
      concludeAffairEncounter(c,loc,{
        icon:'👊',title:'幽会 · 对方家里打架',
        html:'<p>在 <b>'+c.name+'</b> 家里一场混战之后，对方伴侣落败入狱。你惊魂未定地整理衣服。</p><p class="fold-meta">意外获得 ¥1万 · 本时段已占用</p>',
        log:'👊 冲突中落败方入狱，你获得 ¥1万',logType:'info',btn:'离开'
      });
      return;
    }
  }else if(loc==='player_home'){
    if(ph==='morning'&&Math.random()<0.35&&game.married&&!game.divorced){
      partnerRequestsDivorce('💔 白天偷情时伴侣突然回家，提出离婚。',{playerPaysHalf:true});
      concludeAffairEncounter(c,loc,{
        icon:'🏠',title:'幽会 · 家里被撞破',
        html:'<p>你们在自己家里正缠绵，伴侣突然推门而入。空气凝固了。</p><p style="color:var(--red)">伴侣提出离婚。</p><p class="fold-meta">玩家家里 · 白天偷情</p>',
        log:'💔 白天偷情时伴侣突然回家',logType:'fail',btn:'……'
      });
      return;
    }
  }
  recordAffairSession(c);
  addStress(stressRelief,'偷情 ');
  runSexSession(true);
  const c0=ensureConsumption();
  if(c0)c0.sexSessions=(c0.sexSessions||0)+1;
  tryAffairEncounterPregnancy(c,loc);
  if(typeof tryContractStdFromStranger==='function')tryContractStdFromStranger(c.name);
  let html=buildAffairSuccessNarrative(c,loc,stressRelief);
  if(costNote)html+='<p class="fold-meta">'+costNote+'</p>';
  html+='<p class="fold-meta">与 <b>'+c.name+'</b>（'+prof+'）· '+affairLocLabel(loc)+'</p>';
  concludeAffairEncounter(c,loc,{
    html:html,
    log:'💋 与 '+c.name+'（'+prof+'）幽会（'+affairLocLabel(loc)+'）',
    logType:'info',
    btn:'结束幽会'
  });
}
function affairLocLabel(k){
  return {hotel:'酒店',luxury:'五星酒店',toilet:'厕所',outdoor:'户外',car:'车里',their_home:'对方家里',player_home:'家里'}[k]||k;
}
function startContactAffair(contactId){
  if(!game||game.gameOver||isPlayerImprisoned()){addLog('当前无法偷情','fail');return}
  const c=findContact(contactId);
  if(!c){addLog('联系人不存在','fail');return}
  if(c.unreachable){addLog(c.name+' 已与你断绝联系','fail');return}
  if((!game.married||game.divorced)&&c.affairStatus!=='fwb'&&!(c.affairCount>0)){
    addLog('需先发生艳遇或成为炮友后才能联系','fail');return;
  }
  const ph=game.daily&&game.daily.phase;
  if(ph!=='morning'&&ph!=='evening'&&ph!=='allnight'){
    addLog('请在白天、晚上或通宵时段联系','fail');return;
  }
  ensureAffairSlotFlags();
  if(game.daily&&game.daily.affairDoneThisSlot){addLog('本时段已经幽会过','fail');return;}
  if(game.daily&&(game.daily.slotHoursUsed||0)>0&&game.daily.slotActivity!=='out'){
    addLog('本时段已有其他安排，无法幽会','fail');return;
  }
  triggerAffairEncounter(c.id,'通讯录');
}
function tickAffairRelationships(){
  if(!game||!game.contacts||!game.contacts.length)return;
  if(typeof tickOutdoorPregnancyWeekly==='function')tickOutdoorPregnancyWeekly();
  game.contacts.forEach(c=>{
    ensureContactAffairFields(c);
    tickAffairWifePregnancy(c);
    if(c.pregnancyMarryAgreed&&c.pregnancyMarryDeadlineWeek&&game.week>=c.pregnancyMarryDeadlineWeek&&c.affairStatus!=='married_affair'){
      addLog('💔 未在期限内与 '+c.name+' 结婚','fail');
      queueAffairModal({
        icon:'💔',title:'限期结婚逾期',
        html:'<p>你未在期限内与 <b>'+c.name+'</b> 完婚，对方翻脸。</p>',
        btn:'……',
        onClose:function(){
          applyPregnancyBlackmailRefuseFx(c,{rape:false});
          cutContactForever(c);
        }
      });
      return;
    }
    if(c.affairStatus==='proposal_pending'&&c.marriageAgreedWeek){
      if(game.week%WEEKS_PER_MONTH===0){
        addLog('💍 '+c.name+' 催促你完婚（婚外情）','warn');
        c.marriageUrgeCount=(c.marriageUrgeCount||0)+1;
        if(typeof autoLifeRunning==='undefined'||!autoLifeRunning){
          queueAffairModal({
            icon:'💍',title:c.name+' 催你完婚',
            html:'<p><b>'+c.name+'</b> 又催你办婚礼了。逾期可能被勒索或被告密。</p><p class="fold-meta">婚礼费用 ¥'+AFFAIR_WEDDING_COST.toLocaleString()+'</p>',
            buttons:[
              {text:'稍后',handler:function(){}},
              {text:'现在办婚礼',primary:true,handler:function(){promptAffairWedding(c.id)}}
            ]
          });
        }
      }
      if(game.week-c.marriageAgreedWeek>=AFFAIR_WEDDING_DEADLINE_WEEKS){
        if(!collectFromPlayer(AFFAIR_BLACKMAIL_NO_WEDDING,c.name+'勒索')){
          partnerRequestsDivorce('💔 '+c.name+' 向伴侣告密。');
        }else{
          addLog('💸 '+c.name+' 因迟迟不结婚勒索 ¥10万','fail');
          queueAffairModal({
            icon:'💸',title:'迟迟不结婚 · 被勒索',
            html:'<p><b>'+c.name+'</b> 因你拖延婚礼，勒索 ¥'+AFFAIR_BLACKMAIL_NO_WEDDING.toLocaleString()+' 封口。</p>',
            btn:'认了'
          });
        }
        c.affairStatus='affair';
        c.marriageAgreedWeek=0;
      }
    }
    if((c.affairStatus==='affair'||c.affairStatus==='fwb')&&c.affairCount>0
      &&affairRelationshipWeeks(c)>=AFFAIR_MIN_WEEKS_FOR_PROPOSAL
      &&affairRecentlyActive(c)){
      if(!c.proposalShown&&Math.random()<AFFAIR_PROPOSAL_WEEKLY_CHANCE){
        c.proposalShown=true;
        queueAffairMarriageProposal(c.id);
      }
    }
  });
}
let queuedAffairProposalId=null;
function queueAffairMarriageProposal(contactId){
  queuedAffairProposalId=contactId;
  const c=findContact(contactId);
  if(!c)return;
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning){
    addLog('💍 '+c.name+' 提出结婚（自动生活结束后请处理）','warn');
    return;
  }
  if(game.divorced&&affairRelationshipWeeks(c)<AFFAIR_MIN_WEEKS_FOR_PROPOSAL+12){
    queueAffairModal({
      icon:'💍',title:c.name+' 再次提出关系',
      html:'你已离婚。可选择秘密结婚（¥'+(AFFAIR_WEDDING_COST/10000)+'万）或做长期炮友（对方可能不同意）。',
      buttons:[
        {text:'拒绝',handler:function(){rejectAffairMarriage(contactId)}},
        {text:'长期炮友',handler:function(){agreeAffairFwb(contactId)}},
        {text:'答应结婚',primary:true,handler:function(){agreeAffairMarriage(contactId)}}
      ]
    });
    return;
  }
  queueAffairModal({
    icon:'💍',title:c.name+' 提出结婚',
    html:'你们已保持关系超过半年。<br>答应：需办婚礼 ¥'+(AFFAIR_WEDDING_COST/10000)+'万，对方能力/收入影响压力。<br>拒绝：对方可能告诉你的伴侣。',
    buttons:[
      {text:'拒绝',handler:function(){rejectAffairMarriage(contactId)}},
      {text:'答应',primary:true,handler:function(){agreeAffairMarriage(contactId)}}
    ]
  });
}
function agreeAffairFwb(contactId){
  if(typeof closeConsumeModal==='function')closeConsumeModal(true);
  const c=findContact(contactId);
  if(!c)return;
  if(Math.random()<0.38){
    addLog('💔 '+c.name+' 不愿只做炮友，关系结束','fail');
    c.affairStatus='ended';
    queueAffairModal({
      icon:'💔',title:'炮友提议被拒',
      html:'<p><b>'+c.name+'</b> 不愿只做炮友，关系就此结束。</p>',
      btn:'知道了'
    });
    updateUI();
    return;
  }
  c.affairStatus='fwb';
  addLog('🤝 与 '+c.name+' 成为长期炮友','info');
  queueAffairModal({
    icon:'🤝',title:'长期炮友',
    html:'<p>你与 <b>'+c.name+'</b> 约定保持长期炮友关系。</p>',
    btn:'知道了'
  });
  updateUI();
}
function rejectAffairMarriage(contactId){
  if(typeof closeConsumeModal==='function')closeConsumeModal(true);
  const c=findContact(contactId);
  if(!c)return;
  c.playerRefusedMarriage=true;
  if(game.married&&!game.divorced){
    queueAffairModal({
      icon:'🚨',title:'拒婚 · 被告密',
      html:'<p>你拒绝了 <b>'+c.name+'</b> 的求婚，对方转头向你的伴侣告密。</p>',
      btn:'……',
      onClose:function(){
        partnerRequestsDivorce('💔 '+c.name+' 向你的伴侣告密，提出离婚。');
      }
    });
  }else{
    addLog('💔 '+c.name+' 因被拒而离去','warn');
    queueAffairModal({
      icon:'💔',title:'求婚被拒',
      html:'<p><b>'+c.name+'</b> 因被拒而愤然离去，关系结束。</p>',
      btn:'知道了'
    });
  }
}
function agreeAffairMarriage(contactId){
  if(typeof closeConsumeModal==='function')closeConsumeModal(true);
  const c=findContact(contactId);
  if(!c)return;
  c.affairStatus='proposal_pending';
  c.marriageAgreedWeek=game.week;
  c.marriageUrgeCount=0;
  addLog('💍 答应与 '+c.name+' 结婚，请尽快办婚礼（¥'+(AFFAIR_WEDDING_COST/10000)+'万，逾期可能被勒索）','info');
  queueAffairModal({
    icon:'💍',title:'答应结婚',
    html:'<p>你答应与 <b>'+c.name+'</b> 结婚，请尽快办婚礼。</p><p class="fold-meta">费用 ¥'+AFFAIR_WEDDING_COST.toLocaleString()+' · 逾期可能被勒索</p>',
    buttons:[
      {text:'稍后',handler:function(){}},
      {text:'现在办婚礼',primary:true,handler:function(){promptAffairWedding(contactId)}}
    ]
  });
}
function completeAffairWedding(contactId){
  const c=findContact(contactId);
  if(!c)return;
  if(!spendCash(AFFAIR_WEDDING_COST,c.name+'婚礼'))return;
  c.affairStatus='married_affair';
  c.marriageAgreedWeek=0;
  c.pregnancyMarryAgreed=false;
  c.pendingPregnancyBlackmail=false;
  let wedHtml='<p>你与 <b>'+c.name+'</b> 秘密成婚，婚外情状态开启。</p>';
  if(c.pregnantByPlayer||c.pregnancyMarryAgreed){
    if(Math.random()<AFFAIR_WEDDING_PREGNANCY_REVEAL){
      c.wifePregnantConfirmed=true;
      c.babyDueWeek=game.week+(typeof PREGNANCY_WEEKS!=='undefined'?PREGNANCY_WEEKS:40);
      addLog('💒 婚后发现 '+c.name+' 已怀孕！','success');
      wedHtml+='<p style="color:var(--orange)">婚后才发现她真的怀孕了。</p>';
    }else{
      addLog('💒 与 '+c.name+' 成婚，她并未怀孕','info');
      wedHtml+='<p class="fold-meta">婚后确认她并未怀孕。</p>';
    }
    c.pregnantByPlayer=false;
    c.pregnancyMarryDeadlineWeek=0;
  }
  game.affairActive=true;
  const theirStats=(c.body||0)+(c.mind||0)+(c.spirit||0);
  const myStats=effStat('body')+effStat('mind')+effStat('spirit');
  let stressNote='';
  if(theirStats>myStats){addStress(-10,'情人更强 ');stressNote='情人综合能力更强 · 压力 -10<br>';}
  else if(theirStats<myStats){addStress(10,'情人更弱 ');stressNote='情人综合能力更弱 · 压力 +10<br>';}
  const myInc=getPlayerAnnualIncome(),theirInc=c.income||0;
  if(theirInc>myInc){addStress(-10,'情人收入更高 ');stressNote+='情人收入更高 · 压力 -10<br>';}
  else if(theirInc<myInc){addStress(10,'情人收入更低 ');stressNote+='情人收入更低 · 压力 +10<br>';}
  addLog('💒 与 '+c.name+' 秘密成婚 · 婚外情状态开启','stress');
  if(stressNote)wedHtml+='<p class="fold-meta">'+stressNote+'</p>';
  queueAffairModal({icon:'💒',title:'秘密婚礼',html:wedHtml,btn:'知道了'});
  updateUI();
}
function promptAffairWedding(contactId){
  const c=findContact(contactId);
  if(!c)return;
  queueAffairModal({
    icon:'💒',
    title:'举办婚礼',
    html:'<p>是否与 <b>'+c.name+'</b> 举办秘密婚礼？</p><p class="fold-meta">费用 ¥'+AFFAIR_WEDDING_COST.toLocaleString()+'</p>',
    buttons:[
      {text:'取消',handler:function(){}},
      {text:'举办婚礼',primary:true,handler:function(){completeAffairWedding(contactId)}}
    ]
  });
}
function renderContactAffairBtn(c){
  if(!game.married||game.divorced||isPlayerImprisoned())return '';
  if(c.unreachable)return ' <span class="fold-meta" style="color:var(--muted)">已断绝</span>';
  if(c.affairStatus==='married_affair')return ' <span class="fold-meta">秘密成婚</span>';
  if(c.affairStatus==='proposal_pending')return ' <button class="btn" onclick="promptAffairWedding(\''+c.id+'\')">办婚礼</button>';
  if(c.affairStatus==='fwb')return ' <button class="btn" onclick="startContactAffair(\''+c.id+'\')">炮友</button>';
  if(c.affairCount>0||c.affairStatus==='affair')return ' <button class="btn" onclick="startContactAffair(\''+c.id+'\')">偷情</button>';
  if(game.affairActive||c.affairCount>0)return ' <button class="btn" onclick="startContactAffair(\''+c.id+'\')">偷情</button>';
  return ' <button class="btn" onclick="startContactAffair(\''+c.id+'\')">联系</button>';
}
function migrateAffairContacts(){
  if(!game||!game.contacts)return;
  game.contacts.forEach(ensureContactAffairFields);
}
