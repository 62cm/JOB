/* 做爱 / 艳遇 / 出轨 — 由 build.js 注入 */
const AFFAIR_HOTEL_COST=300;
const AFFAIR_LUXURY_HOTEL_COST=2000;
const AFFAIR_BLACKMAIL_TOILET=1000;
const AFFAIR_BLACKMAIL_PARTNER_HOME=10000;
const AFFAIR_BLACKMAIL_NO_WEDDING=100000;
const AFFAIR_WEDDING_COST=100000;
const AFFAIR_MIN_WEEKS_FOR_PROPOSAL=26;
const AFFAIR_WEDDING_DEADLINE_WEEKS=26;
const IMPRISON_DAYS=15;
const IMPRISON_WEEKS=2;

let pendingAffairContactId=null;

function imprisonActor(weeks,label){
  if(!game)return;
  game.imprisonedUntilWeek=Math.max(game.imprisonedUntilWeek||0,game.week+(weeks||IMPRISON_WEEKS));
  addLog('🔒 '+label+' · 监禁约 '+IMPRISON_DAYS+' 天','fail');
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
function isCompanionWorkSlot(phase){
  const c=game.companion;
  if(!c||!c.employed||!c.employment)return false;
  const job=companionJob();
  if(!job)return false;
  const day=(game.daily&&game.daily.dayIndex)||0;
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
function isSpouseAtHome(phase){
  if(!game||!game.married||game.divorced||game.longDistance)return false;
  const ph=phase||(game.daily&&game.daily.phase)||'morning';
  if(ph==='rest'||ph==='allnight')return true;
  return !isCompanionWorkSlot(ph);
}
function getSpouseLocationLabel(phase){
  if(!game||!game.married||game.divorced)return '';
  const ph=phase||(game.daily&&game.daily.phase)||'morning';
  if(game.longDistance)return '异地·'+(typeof PLAYER_HOME_CITY!=='undefined'?PLAYER_HOME_CITY:'家乡');
  if(isCompanionWorkSlot(ph)){
    const c=game.companion,co=c&&c.employment&&c.employment.company;
    return '上班'+(co&&co.name?'·'+co.name:'');
  }
  if(ph==='rest'||ph==='allnight')return '在家';
  if(typeof isPartnerOutAndAbout==='function'&&isPartnerOutAndAbout(ph))return '外出';
  return '在家';
}
function getMakeLoveBlockReason(skipIntimacy){
  if(!game||game.gameOver)return '游戏已结束';
  if(!game.married||game.divorced)return '仅已婚可做爱';
  if(game.longDistance)return '异地分居，无法同房';
  if(isPlayerImprisoned())return '监禁中无法同房';
  const ph=game.daily&&game.daily.phase;
  if(ph==='morning'&&!isSpouseAtHome('morning'))return '白天伴侣不在家（上班中）';
  if(ph==='evening'&&!isSpouseAtHome('evening'))return '晚上伴侣尚未回家';
  if(ph!=='morning'&&ph!=='evening'&&ph!=='rest'&&ph!=='allnight')return '当前时段不适合（请选宅家时段）';
  if(sexSessionsLeft()<=0)return '本周做爱次数已用完（'+SEX_WEEKLY_LIMIT+'次）';
  if(!skipIntimacy&&(game.spouseIntimacy==null?0:game.spouseIntimacy)<=0)return '亲密度过低（≤0），对方拒绝';
  return null;
}
function ensureContactAffairFields(c){
  if(!c)return null;
  if(c.body==null)c.body=42+Math.floor(Math.random()*38);
  if(c.mind==null)c.mind=40+Math.floor(Math.random()*40);
  if(c.spirit==null)c.spirit=40+Math.floor(Math.random()*40);
  if(c.hasPartner==null)c.hasPartner=Math.random()<0.42;
  if(!c.affairStatus)c.affairStatus='none';
  if(c.firstAffairWeek==null)c.firstAffairWeek=0;
  if(c.lastAffairWeek==null)c.lastAffairWeek=0;
  if(c.affairCount==null)c.affairCount=0;
  return c;
}
function findContact(id){
  if(!game||!game.contacts)return null;
  return ensureContactAffairFields(game.contacts.find(x=>x.id===id)||null);
}
function createAffairContact(where,existing){
  if(existing)return ensureContactAffairFields(existing);
  const jobs=game.market.filter(j=>!isOverAgeLimit(j));
  if(!jobs.length)return null;
  const job=jobs[Math.floor(Math.random()*jobs.length)];
  const co=pickCompany(job.idx,job.heatPct>=108?'high':job.heatPct>=102?'mid':'low');
  const income=Math.round(job.pay*(0.7+Math.random()*0.6));
  const names=['小陈','阿杰','Linda','老王','小周','阿明','菲菲','大刘','小雨','阿豪'];
  if(!game.contacts)game.contacts=[];
  const id='ct_'+game.week+'_'+game.contacts.length+'_'+Math.floor(Math.random()*9999);
  const person={id,name:names[Math.floor(Math.random()*names.length)],jobTitle:job.title,category:job.category,
    company:co?co.name:'未知公司',income,metWeek:game.week,metWhere:where||'艳遇',
    kind:'affair',gender:game.partnerGender||'female'};
  ensureContactAffairFields(person);
  if(typeof tagAffairContactGender==='function')tagAffairContactGender(person);
  game.contacts.push(person);
  return person;
}
function affairDurationWeeks(c){
  if(!c||!c.firstAffairWeek||!c.lastAffairWeek)return 0;
  return Math.max(0,c.lastAffairWeek-c.firstAffairWeek);
}
function recordAffairSession(contact){
  if(!contact)return;
  if(!contact.firstAffairWeek)contact.firstAffairWeek=game.week;
  contact.lastAffairWeek=game.week;
  contact.affairCount=(contact.affairCount||0)+1;
  if(contact.affairStatus==='none')contact.affairStatus='affair';
  if(game.married&&!game.divorced)game.affairActive=true;
}
function triggerAffairEncounter(contactOrId,source){
  if(!game||game.gameOver||isPlayerImprisoned())return;
  let contact=typeof contactOrId==='string'?findContact(contactOrId):contactOrId;
  if(!contact)contact=createAffairContact(source||'艳遇');
  if(!contact){addLog('艳遇未果','warn');return}
  pendingAffairContactId=contact.id;
  showAffairLocationModal(contact.id,source||'艳遇');
}
function showAffairLocationModal(contactId,source){
  const c=findContact(contactId);
  if(!c)return;
  const ph=game.daily&&game.daily.phase||'evening';
  const spouseHome=isSpouseAtHome(ph);
  const hasCar=!!game.ownedCar;
  let html='<p>与 <b>'+c.name+'</b>（'+c.jobTitle+'）· '+source+'</p>'+
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
  showConsumeModal({icon:'💋',title:'选择幽会地点',html,buttons:[{text:'放弃',fn:'cancelAffairEncounter()'}]});
}
function cancelAffairEncounter(){
  pendingAffairContactId=null;
  closeConsumeModal();
  addLog('你放弃了这次艳遇','info');
}
function pickAffairLocation(contactId,loc){
  const c=findContact(contactId);
  if(!c)return;
  closeConsumeModal();
  resolveAffairLocation(c,loc);
  pendingAffairContactId=null;
}
function resolveAffairLocation(c,loc){
  const ph=game.daily&&game.daily.phase||'evening';
  let stressRelief=-3;
  if(loc==='hotel'){
    if(!spendCash(AFFAIR_HOTEL_COST,'幽会·酒店'))return;
  }else if(loc==='luxury'){
    if(!spendCash(AFFAIR_LUXURY_HOTEL_COST,'幽会·五星酒店'))return;
    addStress(-1,'五星酒店 ');
    stressRelief=-5;
  }else if(loc==='toilet'){
    if(Math.random()<0.28){
      if(!collectFromPlayer(AFFAIR_BLACKMAIL_TOILET,'厕所幽会被勒索'))addLog('无力支付勒索 ¥'+AFFAIR_BLACKMAIL_TOILET,'fail');
      else addLog('厕所幽会被发现，勒索 ¥'+AFFAIR_BLACKMAIL_TOILET,'fail');
      return;
    }
  }else if(loc==='outdoor'){
    if(Math.random()<0.18){
      addStress(4,'户外被发现 ');
      addLog('🌿 户外幽会被人撞见，尴尬压力+4','warn');
    }
    if(Math.random()<0.1&&game.married&&!game.divorced){
      partnerRequestsDivorce('💔 户外偷情被曝光，伴侣提出离婚。',{playerPaysHalf:true});
      return;
    }
  }else if(loc==='car'){
    if(Math.random()<0.22&&game.married&&!game.divorced){
      partnerRequestsDivorce('💔 车内偷情被发现，伴侣提出离婚。',{playerPaysHalf:true});
      return;
    }
    if(Math.random()<0.15)addStress(2,'车内紧张 ');
  }else if(loc==='their_home'){
    if(c.hasPartner&&Math.random()<0.32){
      if(!collectFromPlayer(AFFAIR_BLACKMAIL_PARTNER_HOME,'对方家里幽会被勒索')){
        addLog('无力支付勒索 ¥'+AFFAIR_BLACKMAIL_PARTNER_HOME,'fail');
      }else addLog('🚨 在对方家里被其伴侣发现，勒索 ¥'+AFFAIR_BLACKMAIL_PARTNER_HOME,'fail');
      return;
    }
    if(c.hasPartner&&Math.random()<0.22){
      const pb=effStat('body'),tb=c.body||50;
      if(pb>=tb+Math.floor(Math.random()*16)-8){
        imprisonActor(IMPRISON_WEEKS,'打架获胜');
        collectFromPlayer(10000,'打架赔偿');
        addLog('👊 与对方伴侣冲突，你打赢但被拘押并赔偿 ¥1万','fail');
        return;
      }
      game.cash=(game.cash||0)+10000;
      game.money=(game.money||0)+10000;
      ledgerAddIncome('affair','💰','冲突对方入狱赔偿',10000);
      c.imprisonedUntilWeek=game.week+IMPRISON_WEEKS;
      addLog('👊 冲突中落败方入狱，你获得 ¥1万','info');
    }
  }else if(loc==='player_home'){
    if(ph==='morning'&&Math.random()<0.35&&game.married&&!game.divorced){
      partnerRequestsDivorce('💔 白天偷情时伴侣突然回家，提出离婚。',{playerPaysHalf:true});
      return;
    }
  }
  recordAffairSession(c);
  addStress(stressRelief,'偷情 ');
  runSexSession(true);
  const c0=ensureConsumption();
  if(c0)c0.sexSessions=(c0.sexSessions||0)+1;
  if(Math.random()<0.12&&!game.pregnant&&!game.hasChildren)tryConceiveFromSex(true,true);
  addLog('💋 与 '+c.name+' 幽会（'+affairLocLabel(loc)+'）','info');
  if(game.daily){
    if(game.daily.phase==='allnight')renderDailyPanel();
    else if(game.daily.phase==='morning'||game.daily.phase==='evening')advanceDailyPhase('rest');
  }
  renderSpendingPanel();renderDailyPanel();updateUI();
}
function affairLocLabel(k){
  return {hotel:'酒店',luxury:'五星酒店',toilet:'厕所',outdoor:'户外',car:'车里',their_home:'对方家里',player_home:'家里'}[k]||k;
}
function startContactAffair(contactId){
  if(!game||game.gameOver||isPlayerImprisoned()){addLog('当前无法偷情','fail');return}
  const c=findContact(contactId);
  if(!c){addLog('联系人不存在','fail');return}
  if((!game.married||game.divorced)&&c.affairStatus!=='fwb'&&!(c.affairCount>0)){
    addLog('需先发生艳遇或成为炮友后才能联系','fail');return;
  }
  const ph=game.daily&&game.daily.phase;
  if(ph!=='morning'&&ph!=='evening'&&ph!=='allnight'){
    addLog('请在白天、晚上或通宵时段联系','fail');return;
  }
  triggerAffairEncounter(c.id,'通讯录');
}
function tickAffairRelationships(){
  if(!game||!game.contacts||!game.contacts.length)return;
  game.contacts.forEach(c=>{
    ensureContactAffairFields(c);
    if(c.affairStatus==='proposal_pending'&&c.marriageAgreedWeek){
      if(game.week%WEEKS_PER_MONTH===0){
        addLog('💍 '+c.name+' 催促你完婚（婚外情）','warn');
        c.marriageUrgeCount=(c.marriageUrgeCount||0)+1;
      }
      if(game.week-c.marriageAgreedWeek>=AFFAIR_WEDDING_DEADLINE_WEEKS){
        if(!collectFromPlayer(AFFAIR_BLACKMAIL_NO_WEDDING,c.name+'勒索')){
          partnerRequestsDivorce('💔 '+c.name+' 向伴侣告密。');
        }else addLog('💸 '+c.name+' 因迟迟不结婚勒索 ¥10万','fail');
        c.affairStatus='affair';
        c.marriageAgreedWeek=0;
      }
    }
    if((c.affairStatus==='affair'||c.affairStatus==='fwb')&&c.affairCount>0&&affairDurationWeeks(c)>=AFFAIR_MIN_WEEKS_FOR_PROPOSAL){
      if(!c.proposalShown&&Math.random()<0.06){
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
  if(game.divorced&&affairDurationWeeks(c)<AFFAIR_MIN_WEEKS_FOR_PROPOSAL+26){
    showConsumeModal({
      icon:'💍',title:c.name+' 再次提出关系',
      html:'你已离婚。可选择秘密结婚（¥'+(AFFAIR_WEDDING_COST/10000)+'万）或做长期炮友（对方可能不同意）。',
      buttons:[
        {text:'拒绝',fn:'rejectAffairMarriage(\''+contactId+'\')'},
        {text:'长期炮友',fn:'agreeAffairFwb(\''+contactId+'\')'},
        {text:'答应结婚',primary:true,fn:'agreeAffairMarriage(\''+contactId+'\')'}
      ]
    });
    return;
  }
  showConsumeModal({
    icon:'💍',title:c.name+' 提出结婚',
    html:'你们已保持关系超过半年。<br>答应：需办婚礼 ¥'+(AFFAIR_WEDDING_COST/10000)+'万，对方能力/收入影响压力。<br>拒绝：对方可能告诉你的伴侣。',
    buttons:[
      {text:'拒绝',fn:'rejectAffairMarriage(\''+contactId+'\')'},
      {text:'答应',primary:true,fn:'agreeAffairMarriage(\''+contactId+'\')'}
    ]
  });
}
function agreeAffairFwb(contactId){
  closeConsumeModal();
  const c=findContact(contactId);
  if(!c)return;
  if(Math.random()<0.38){
    addLog('💔 '+c.name+' 不愿只做炮友，关系结束','fail');
    c.affairStatus='ended';
    return;
  }
  c.affairStatus='fwb';
  addLog('🤝 与 '+c.name+' 成为长期炮友','info');
  updateUI();
}
function rejectAffairMarriage(contactId){
  closeConsumeModal();
  const c=findContact(contactId);
  if(!c)return;
  c.playerRefusedMarriage=true;
  if(game.married&&!game.divorced){
    partnerRequestsDivorce('💔 '+c.name+' 向你的伴侣告密，提出离婚。');
  }else addLog('💔 '+c.name+' 因被拒而离去','warn');
}
function agreeAffairMarriage(contactId){
  closeConsumeModal();
  const c=findContact(contactId);
  if(!c)return;
  c.affairStatus='proposal_pending';
  c.marriageAgreedWeek=game.week;
  c.marriageUrgeCount=0;
  addLog('💍 答应与 '+c.name+' 结婚，请尽快办婚礼（¥'+(AFFAIR_WEDDING_COST/10000)+'万，逾期可能被勒索）','info');
}
function completeAffairWedding(contactId){
  const c=findContact(contactId);
  if(!c)return;
  if(!spendCash(AFFAIR_WEDDING_COST,c.name+'婚礼'))return;
  c.affairStatus='married_affair';
  c.marriageAgreedWeek=0;
  game.affairActive=true;
  const theirStats=(c.body||0)+(c.mind||0)+(c.spirit||0);
  const myStats=effStat('body')+effStat('mind')+effStat('spirit');
  if(theirStats>myStats)addStress(-10,'情人更强 ');
  else if(theirStats<myStats)addStress(10,'情人更弱 ');
  const myInc=getPlayerAnnualIncome(),theirInc=c.income||0;
  if(theirInc>myInc)addStress(-10,'情人收入更高 ');
  else if(theirInc<myInc)addStress(10,'情人收入更低 ');
  addLog('💒 与 '+c.name+' 秘密成婚 · 婚外情状态开启','stress');
  updateUI();
}
function promptAffairWedding(contactId){
  if(confirm('与 '+findContact(contactId).name+' 举办婚礼？费用 ¥'+AFFAIR_WEDDING_COST.toLocaleString())){
    completeAffairWedding(contactId);
  }
}
function renderContactAffairBtn(c){
  if(!game.married||game.divorced||isPlayerImprisoned())return '';
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
