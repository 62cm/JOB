/* 通讯录 — 由 build.js 注入 */
const CORE_CONTACT_IDS={parents:'core_parents',bff:'core_bff',spouse:'core_spouse',exSpouse:'core_ex_spouse'};
const PARTNER_NAMES={male:['浩然','俊杰','子轩','宇轩','博文'],female:['雨萱','诗涵','静怡','小艾','思琪']};
const BFF_NAMES={male:['大壮','阿伟','老铁','浩子'],female:['小雅','莉莉','猪猪','阿花']};
const BFF_OUT_PLACES={
  park:{key:'park',label:'公园'},
  cafe:{key:'cafe',label:'咖啡店'},
  library:{key:'library',label:'图书馆'},
  club:{key:'club',label:'夜店'},
  bar:{key:'bar',label:'酒吧'},
  store:{key:'store',label:'便利店'}
};
const CONTACT_NO_ANSWER_CHANCE=0.22;

function pickPartnerDisplayName(gender){
  const pool=PARTNER_NAMES[gender]||PARTNER_NAMES.female;
  return pool[Math.floor(Math.random()*pool.length)];
}
function pickBffName(playerGender){
  const g=playerGender==='female'?'female':'male';
  const pool=BFF_NAMES[g];
  return pool[Math.floor(Math.random()*pool.length)];
}
function contactSlotKey(){
  const d=game&&game.daily;
  return d?((d.dayIndex||0)+'_'+(d.phase||'morning')):'';
}
function resetContactSlotFlags(){
  const d=game&&game.daily;
  if(!d)return;
  d.slotContactsUsed={};
  d.slotNoAnswerContacts={};
}
function wasContactCalled(id){
  const d=game&&game.daily;
  return !!(d&&d.slotContactsUsed&&d.slotContactsUsed[id]===contactSlotKey());
}
function markContactCalled(id){
  const d=ensureDailyState();
  if(!d.slotContactsUsed)d.slotContactsUsed={};
  d.slotContactsUsed[id]=contactSlotKey();
}
function markContactNoAnswer(id){
  const d=ensureDailyState();
  if(!d.slotNoAnswerContacts)d.slotNoAnswerContacts={};
  d.slotNoAnswerContacts[id]=contactSlotKey();
}
function wasContactNoAnswer(id){
  const d=game&&game.daily;
  return !!(d&&d.slotNoAnswerContacts&&d.slotNoAnswerContacts[id]===contactSlotKey());
}
function ensureCoreContact(id,fields){
  if(!game.contacts)game.contacts=[];
  let c=game.contacts.find(x=>x.id===id);
  if(!c){
    c={id,...fields,metWeek:game.week||0,metWhere:'家人'};
    game.contacts.unshift(c);
  }else Object.assign(c,fields);
  return c;
}
function syncSpouseContact(){
  if(!game)return;
  if(!game.contacts)game.contacts=[];
  if(game.divorced||!game.married){
    game.contacts=game.contacts.filter(c=>c.id!==CORE_CONTACT_IDS.spouse);
    return;
  }
  const name=game.partnerDisplayName||COMPANION_NAME;
  const existing=game.contacts.find(c=>c.id===CORE_CONTACT_IDS.spouse);
  const fields={
    kind:'spouse',name,gender:game.partnerGender||'female',role:'伴侣',
    company:'',jobTitle:'',income:0,metWhere:'婚姻'
  };
  if(!existing){
    fields.remark='';
    ensureCoreContact(CORE_CONTACT_IDS.spouse,fields);
  }else{
    const savedRemark=existing.remark;
    ensureCoreContact(CORE_CONTACT_IDS.spouse,fields);
    const c=game.contacts.find(x=>x.id===CORE_CONTACT_IDS.spouse);
    if(c)c.remark=savedRemark!=null?savedRemark:'';
  }
}
function syncExSpouseContact(){
  if(!game||!game.divorced)return;
  if(!game.contacts)game.contacts=[];
  const name=game.partnerDisplayName||game.exPartnerName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'前任');
  const gender=game.partnerGender||'female';
  const role=gender==='male'?'前夫':'前妻';
  game.contacts=game.contacts.filter(c=>c.id!==CORE_CONTACT_IDS.spouse);
  ensureCoreContact(CORE_CONTACT_IDS.exSpouse,{
    kind:'ex_spouse',name,gender,role,remark:role,
    company:'',jobTitle:'',income:0,metWhere:'曾经婚姻'
  });
  game.exPartnerName=name;
}
function initCoreContacts(){
  if(!game)return;
  if(!game.contacts)game.contacts=[];
  if(!game.partnerDisplayName)game.partnerDisplayName=pickPartnerDisplayName(game.partnerGender||'female');
  if(!game.bffName)game.bffName=pickBffName(game.playerGender||'male');
  const pg=game.playerGender||'male';
  ensureCoreContact(CORE_CONTACT_IDS.parents,{kind:'parents',name:'爸妈',gender:'',role:'父母',company:'',jobTitle:'',income:0});
  ensureCoreContact(CORE_CONTACT_IDS.bff,{
    kind:'bff',name:game.bffName,gender:pg==='female'?'female':'male',
    role:pg==='female'?'闺蜜':'基友',company:'',jobTitle:'',income:0,metWhere:'发小'
  });
  syncSpouseContact();
}
function isPlayerAwayFromPartner(){
  if(!game)return false;
  if(game.longDistance)return true;
  if(game.employed&&game.playerCity&&game.playerCity!==PLAYER_HOME_CITY)return true;
  return false;
}
function isPartnerOutAndAbout(phase){
  if(!game||!game.married||game.divorced)return false;
  if(game.longDistance)return false;
  if(isSpouseAtHome(phase))return false;
  if(isCompanionWorkSlot(phase))return false;
  return true;
}
function contactKindLabel(c){
  if(!c)return '';
  if(c.kind==='parents')return '父母';
  if(c.kind==='spouse')return '伴侣';
  if(c.kind==='ex_spouse')return c.role||(c.gender==='male'?'前夫':'前妻');
  if(c.kind==='bff')return c.role||'基友/闺蜜';
  if((c.affairCount||0)>0||c.affairStatus==='affair'||c.affairStatus==='fwb')return '出轨';
  if(c.affairStatus==='married_affair')return '秘密成婚';
  return '熟人';
}
function contactGenderLabel(c){
  if(!c||!c.gender||c.kind==='parents')return '';
  return c.gender==='male'?'男':'女';
}
function contactDisplayName(c){
  if(!c)return '';
  const base=c.name||'?';
  if(c.remark&&c.remark!==base&&c.remark!==contactKindLabel(c))return base+'（'+c.remark+'）';
  return base;
}
function contactPinyinCompare(a,b){
  const na=(a&&a.name)||'',nb=(b&&b.name)||'';
  try{return na.localeCompare(nb,'zh-CN-u-co-pinyin',{sensitivity:'base'})}
  catch(e){try{return na.localeCompare(nb,'zh-CN')}catch(e2){return na.localeCompare(nb)}}
}
function sortedContactsForModal(){
  if(!game||!game.contacts)return [];
  initCoreContacts();
  return [...game.contacts].sort((a,b)=>{
    const sa=!!a.starred,sb=!!b.starred;
    if(sa!==sb)return sb?1:-1;
    return contactPinyinCompare(a,b);
  });
}
function sortedContacts(){return sortedContactsForModal()}
function escContactId(id){return String(id||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'")}
function openContactsModal(){
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning)return;
  if(typeof hasUsablePhone==='function'&&!hasUsablePhone()){addLog('暂无可用手机，无法使用通讯录','fail');return}
  if(typeof isPlayerImprisoned==='function'&&isPlayerImprisoned()){addLog('监禁中无法使用通讯录','fail');return}
  const el=document.getElementById('contactsOverlay');
  if(!el)return;
  renderContactsModal();
  el.classList.remove('hidden');
}
function closeContactsModal(){
  const el=document.getElementById('contactsOverlay');
  if(el)el.classList.add('hidden');
}
function renderContactsModal(){
  const body=document.getElementById('contactsModalBody');
  const ti=document.getElementById('contactsModalTitle');
  if(!body||!game)return;
  initCoreContacts();
  const list=sortedContactsForModal();
  const ph=game.daily&&game.daily.phase;
  if(ti)ti.textContent='📇 通讯录 · '+list.length+' 人';
  let h='<p class="fold-meta" style="margin:0 0 8px">星标置顶 · 按姓名音序 · 每时段每人可联系一次 · 当前 '+PHASE_LABELS[ph||'morning']+'</p>';
  if(game.bffOutingPlan&&!game.bffOutingPlan.completed){
    const p=game.bffOutingPlan;
    h+='<p style="color:var(--yellow);font-size:.72rem;margin:0 0 8px">📅 约了 '+DAY_NAMES[p.dayIndex]+' '+PHASE_LABELS[p.phase]+' → '+p.label+'</p>';
  }
  if(!list.length){
    h+='<p style="color:var(--muted)">暂无联系人</p>';
    body.innerHTML=h;return;
  }
  list.forEach(c=>{
    const chk=canCallContact(c);
    const lbl=contactKindLabel(c);
    const gen=contactGenderLabel(c);
    const eid=escContactId(c.id);
    const extra=c.jobTitle?(c.jobTitle+' @'+c.company):c.metWhere||'';
    const st=(c.affairCount>0?' · 亲热'+(c.affairCount||0)+'次':'')+(c.affairStatus==='fwb'?' · 炮友':'');
    h+='<div class="contact-row'+(c.starred?' starred':'')+'">'+
      '<div class="contact-row-hdr">'+
      '<button type="button" class="contact-star'+(c.starred?'':' off')+'" title="'+(c.starred?'取消星标':'星标置顶')+'" onclick="toggleContactStar(\''+eid+'\')">'+(c.starred?'★':'☆')+'</button>'+
      '<b>'+contactDisplayName(c)+'</b>'+
      (gen?'<span class="contact-gender">'+gen+'</span>':'')+
      '<span class="fold-meta">'+lbl+'</span>'+
      (extra?'<span class="fold-meta">'+extra+st+'</span>':'')+
      '</div>'+
      '<div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:4px;align-items:center">'+
      '<button class="btn" style="font-size:.72rem;padding:3px 8px" '+(chk.ok?'':'disabled')+' onclick="callContactFromModal(\''+eid+'\')">📞 联系</button>'+
      '<button class="btn" style="font-size:.72rem;padding:3px 8px" onclick="promptContactRemark(\''+eid+'\')">✏️ 备注</button>'+
      (c.affairStatus==='proposal_pending'?' <button class="btn" style="font-size:.72rem;padding:3px 8px" onclick="promptAffairWedding(\''+eid+'\')">办婚礼</button>':'')+
      (chk.ok?'':'<span class="fold-meta">'+chk.reason+'</span>')+
      '</div></div>';
  });
  body.innerHTML=h;
}
function toggleContactStar(id){
  const c=game.contacts&&game.contacts.find(x=>x.id===id);
  if(!c)return;
  c.starred=!c.starred;
  renderContactsModal();
}
function promptContactRemark(id){
  const c=game.contacts&&game.contacts.find(x=>x.id===id);
  if(!c)return;
  if(c.kind==='ex_spouse'){addLog('离婚后备注固定为「'+(c.role||'前任')+'」','fail');return}
  const cur=c.remark||'';
  const v=prompt('给「'+c.name+'」设置备注（留空则清除）',cur);
  if(v===null)return;
  c.remark=v.trim();
  renderContactsModal();
  addLog('✏️ 已更新 '+c.name+' 的备注','info');
}
function callContactFromModal(id){
  callContact(id);
  closeContactsModal();
}
function canCallSpouse(){
  if(!game||game.divorced||!game.married)return {ok:false,reason:'无伴侣'};
  if(typeof isPlayerWorkingNow==='function'&&isPlayerWorkingNow())return {ok:false,reason:'上班中无法给伴侣打电话'};
  const ph=game.daily&&game.daily.phase||'morning';
  if(typeof isPartnerOutAndAbout==='function'&&isPartnerOutAndAbout(ph))return {ok:true};
  if(typeof isSpouseAtHome==='function'&&isSpouseAtHome(ph)&&typeof isPlayerAtHomeNow==='function'&&isPlayerAtHomeNow(ph))
    return {ok:false,reason:'都在家，打电话没效果'};
  return {ok:true};
}
function canCallContact(c){
  if(!c||!game||game.gameOver)return {ok:false,reason:'无法联系'};
  if(wasContactCalled(c.id))return {ok:false,reason:'本时段已联系过'};
  if(wasContactNoAnswer(c.id))return {ok:false,reason:'对方未接，本时段不能再拨'};
  const ph=game.daily&&game.daily.phase;
  if(c.kind==='parents'&&ph!=='morning'&&ph!=='evening')return {ok:false,reason:'爸妈仅白天/晚上可联系'};
  if(c.kind==='spouse'||c.id===CORE_CONTACT_IDS.spouse){
    const chk=canCallSpouse();
    if(!chk.ok)return chk;
  }
  return {ok:true};
}
function callContact(id){
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning)return;
  const c=findContact(id)||game.contacts.find(x=>x.id===id);
  if(!c){addLog('联系人不存在','fail');return}
  const chk=canCallContact(c);
  if(!chk.ok){addLog(chk.reason,'fail');return}
  markContactCalled(c.id);
  if(c.kind==='parents')callParents(c);
  else if(c.kind==='spouse')callSpouse(c);
  else if(c.kind==='ex_spouse')callExSpouse(c);
  else if(c.kind==='bff')callBff(c);
  else if((c.affairCount||0)>0||c.affairStatus==='affair'||c.affairStatus==='fwb'||c.affairStatus==='married_affair')callIntimateContact(c);
  else callAcquaintance(c);
  renderDailyPanel();
}
function callParents(c){
  const roll=Math.random();
  let html='';
  if(roll<0.22){
    addStress(-2,'爸妈关心 ');
    html='爸妈嘘寒问暖 · 压力 -2';
  }else if(roll<0.4){
    addStress(2,'爸妈唠叨 ');
    html='爸妈唠叨催婚/工作 · 压力 +2';
  }else if(roll<0.58){
    const give=200+Math.floor(Math.random()*1800);
    game.cash+=give;game.money+=give;
    ledgerAddIncome('parents','👨‍👩‍👦','爸妈资助',give);
    html='爸妈给你打款 <b>¥'+give.toLocaleString()+'</b>';
    addLog('👨‍👩‍👦 爸妈资助 ¥'+give,'success');
  }else{
    const ask=300+Math.floor(Math.random()*2700);
    if(game.cash>=ask){
      game.cash-=ask;
      ledgerAddExpense('family','👨‍👩‍👦','给爸妈钱',ask,false);
      html='爸妈开口要钱 · 你给了 <b>¥'+ask.toLocaleString()+'</b>';
      addLog('👨‍👩‍👦 给爸妈 ¥'+ask,'info');
    }else{
      addStress(3,'无力给爸妈钱 ');
      html='爸妈要钱 ¥'+ask+' · 你手头紧 · 压力 +3';
      addLog('👨‍👩‍👦 无力给爸妈钱 · 压力+3','warn');
    }
  }
  showConsumeModal({icon:'👨‍👩‍👦',title:'联系爸妈',html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
}
function callExSpouse(c){
  const role=contactKindLabel(c);
  const roll=Math.random();
  let html='';
  if(roll<0.35){
    addStress(2,'联系'+role+' ');
    html='聊了几句，气氛有些尴尬 · 压力 +2';
  }else if(roll<0.55&&game.cash>=200){
    const ask=200+Math.floor(Math.random()*800);
    if(game.cash>=ask){
      game.cash-=ask;
      ledgerAddExpense('family','💔','给'+role+'钱',ask,false);
      html='对方开口要钱 · 你给了 ¥'+ask.toLocaleString();
    }else html='对方想借钱 · 你没给';
  }else{
    html='互报近况，没多聊';
  }
  addLog('📞 联系'+role+' '+c.name,'info');
  showConsumeModal({icon:'💔',title:'联系'+role,html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
}
function callSpouse(c,fromOvertime){
  if(game.divorced||!game.married){addLog('已离异','fail');return}
  if(!fromOvertime){
    const chk=canCallSpouse();
    if(!chk.ok){addLog(chk.reason,'fail');return}
  }
  const ph=game.daily&&game.daily.phase||'morning';
  let delta=0,note='';
  if(isPartnerOutAndAbout(ph)){
    delta=Math.random()<0.5?1:-1;
    note=delta>0?'伴侣在外面，聊得开心':'伴侣在外面，语气敷衍';
  }else if(isPlayerAwayFromPartner()&&isSpouseAtHome(ph)){
    delta=1;note='你在外/异地，伴侣在家守候';
  }else if(isCompanionWorkSlot(ph)){
    delta=-1;note='伴侣正在上班，没聊几句就挂了';
  }else if(isSpouseAtHome(ph)&&typeof isPlayerAtHomeNow==='function'&&isPlayerAtHomeNow(ph)){
    delta=0;note='都在家，随便聊了几句，没什么变化';
  }else if(isSpouseAtHome(ph)&&typeof isPlayerAtHomeNow==='function'&&!isPlayerAtHomeNow(ph)){
    delta=0;note='伴侣在家，你在外面…电话没聊出什么';
  }else{
    delta=Math.random()<0.35?1:0;
    note=delta?'通了电话，互报平安':'聊了聊，气氛平平';
  }
  if(delta)adjustSpouseIntimacy(delta);
  const html='<b>'+c.name+'</b><br>'+note+(delta?('<br>亲密度 '+(delta>0?'+':'')+delta+'（现 '+game.spouseIntimacy+'）'):'<br>亲密度无变化');
  addLog('📞 联系伴侣 · '+note+(delta?(' · 亲密度'+(delta>0?'+':'')+delta):''),'info');
  showConsumeModal({icon:'💑',title:fromOvertime?'加班时联系伴侣':'联系伴侣',html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
}
function showBffOutingPicker(contactId){
  let html='<p>和 <b>'+(game.bffName||'基友/闺蜜')+'</b> 约去哪儿？</p><div class="affair-loc-grid">';
  Object.keys(BFF_OUT_PLACES).forEach(k=>{
    const p=BFF_OUT_PLACES[k];
    html+='<button class="btn affair-loc-btn" onclick="confirmBffOuting(\''+contactId+'\',\''+k+'\')">'+p.label+'</button>';
  });
  html+='</div><p class="fold-meta">须在约定时段去对应地点，否则会被骂 · 压力+1</p>';
  showConsumeModal({icon:'🤝',title:'约出去玩',html,buttons:[{text:'取消',fn:'closeConsumeModal()'}]});
}
function confirmBffOuting(contactId,placeKey){
  closeConsumeModal();
  const p=BFF_OUT_PLACES[placeKey];if(!p)return;
  const d=ensureDailyState();
  game.bffOutingPlan={
    week:game.week,dayIndex:d.dayIndex,phase:d.phase,
    place:placeKey,label:p.label,completed:false
  };
  addLog('📅 和 '+(game.bffName||'基友/闺蜜')+' 约好 '+DAY_NAMES[d.dayIndex]+' '+PHASE_LABELS[d.phase]+' 去'+p.label,'info');
  showConsumeModal({
    icon:'🤝',title:'约好了',
    html:'记得 <b>'+DAY_NAMES[d.dayIndex]+' '+PHASE_LABELS[d.phase]+'</b> 去 <b>'+p.label+'</b>，放鸽子会被骂。',
    buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]
  });
}
function callBff(c){
  showBffOutingPicker(c.id);
}
function callAcquaintance(c){
  if(Math.random()<0.28){
    submitContactReferral(c);
    return;
  }
  if(Math.random()<0.45){
    promptContactLoan(c);
    return;
  }
  addLog('📞 和 '+c.name+' 闲聊了一会儿','info');
  showConsumeModal({icon:'📞',title:'联系 '+c.name,html:'聊了聊近况，暂无大事。',buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
}
function submitContactReferral(c){
  const eligible=game.market.map((j,i)=>i).filter(i=>{
    const j=game.market[i];
    return canApplyJob(j)&&!isOverAgeLimit(j);
  });
  if(!eligible.length){
    showConsumeModal({icon:'📋',title:'内推未果',html:c.name+' 想帮忙但暂时没有合适岗位。',buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
    return;
  }
  const ji=eligible[Math.floor(Math.random()*eligible.length)];
  const job=game.market[ji];
  const tier=job.heatPct>=108?'high':job.heatPct>=102?'mid':'low';
  const co=pickCompany(ji,tier);
  const r=seededR(ji*997+game.week*3);
  const openings=genOpeningsForCompany(job,co,r);
  if(!openings.length){
    addLog('📋 '+c.name+' 内推未果','warn');return;
  }
  const op=openings[Math.floor(Math.random()*openings.length)];
  const id='ctref_'+game.week+'_'+Math.floor(Math.random()*99999);
  game.applications.push({
    id,jobIdx:ji,offer:{company:co,tier:co.tier,importance:op.importance,annualPay:op.pay,roleExtra:op.roleExtra||null,
      welfare:op.welfare,startDelayWeeks:op.startDelayWeeks,planned:op.planned,
      newToIndustry:!game.industryExperience[job.category],
      eduGap:Math.max(0,(EDU_RANK[job.education]||4)-(EDU_RANK[game.playerEducation]||4)),
      apps:['boss'],method:'app'},
    status:'pending',applyWeek:game.week,replyWeek:calcApplicationReplyWeek({company:co,tier:co.tier,importance:op.importance,annualPay:op.pay},game.week,ji),
    planned:!!op.planned,interviewWeek:null,resultWeek:null,viaReferral:true,method:'app',
    resumeCostLabel:'熟人内推·'+c.name
  });
  game.totalApplications++;
  addLog('📋 '+c.name+' 内推 '+job.title+' @'+co.name,'success');
  showConsumeModal({icon:'📋',title:'内推成功',html:c.name+' 帮你内推了 <b>'+job.title+'</b> @'+co.name,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
}
function promptContactLoan(c){
  const amt=100+Math.floor(Math.random()*9901);
  const weeks=1+Math.floor(Math.random()*4);
  game._pendingLoan={contactId:c.id,contactName:c.name,amount:amt,dueWeek:game.week+weeks};
  showConsumeModal({
    icon:'💰',title:c.name+' 借钱',
    html:'借 <b>¥'+amt.toLocaleString()+'</b><br>约定 <b>'+weeks+'</b> 周内归还（第 '+getDateStr(game.week+weeks)+' 周前后）',
    buttons:[
      {text:'不借',fn:'rejectContactLoan()'},
      {text:'借给他/她',primary:true,fn:'acceptContactLoan()'}
    ]
  });
}
function rejectContactLoan(){
  closeConsumeModal();
  const p=game._pendingLoan;
  game._pendingLoan=null;
  if(p)addLog('拒绝了 '+p.contactName+' 的借款','info');
}
function acceptContactLoan(){
  closeConsumeModal();
  const p=game._pendingLoan;
  game._pendingLoan=null;
  if(!p)return;
  if(game.cash<p.amount){addLog('现金不足，无法借出','fail');return}
  game.cash-=p.amount;
  ledgerAddExpense('social','💸','借出·'+p.contactName,p.amount,false);
  if(!game.contactLoans)game.contactLoans=[];
  game.contactLoans.push({id:'loan_'+game.week+'_'+Math.floor(Math.random()*9999),contactId:p.contactId,contactName:p.contactName,amount:p.amount,dueWeek:p.dueWeek,status:'pending'});
  addLog('💸 借给 '+p.contactName+' ¥'+p.amount.toLocaleString()+' · '+getDateStr(p.dueWeek)+' 前归还','info');
}
function tickContactLoans(){
  if(!game||!game.contactLoans||!game.contactLoans.length)return;
  game.contactLoans=game.contactLoans.filter(loan=>{
    if(loan.status!=='pending')return loan.status!=='repaid'&&loan.status!=='double';
    if(game.week<loan.dueWeek)return true;
    const roll=Math.random();
    if(roll<0.14){
      addLog('💢 '+loan.contactName+' 赖账不还 ¥'+loan.amount.toLocaleString(),'fail');
      loan.status='default';return false;
    }
    if(roll<0.24){
      const got=loan.amount*2;
      game.cash+=got;game.money+=got;
      ledgerAddIncome('social','💰',loan.contactName+'双倍还款',got);
      addLog('🎉 '+loan.contactName+' 双倍还款 ¥'+got.toLocaleString(),'success');
      loan.status='double';return false;
    }
    game.cash+=loan.amount;game.money+=loan.amount;
    ledgerAddIncome('social','💰',loan.contactName+'还款',loan.amount);
    addLog('💰 '+loan.contactName+' 如期还款 ¥'+loan.amount.toLocaleString(),'success');
    loan.status='repaid';return false;
  });
}
function callIntimateContact(c){
  if(c&&c.unreachable){addLog(c.name+' 已与你断绝联系','fail');return}
  if(typeof rollPartnerCaughtAffair==='function'&&rollPartnerCaughtAffair('phone'))return;
  if(Math.random()<CONTACT_NO_ANSWER_CHANCE){
    markContactNoAnswer(c.id);
    addLog('📞 '+c.name+' 未接电话','warn');
    showConsumeModal({icon:'📵',title:'未接通',html:c.name+' 没接 · 本时段不能再拨',buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
    return;
  }
  if(typeof triggerAffairEncounter==='function')triggerAffairEncounter(c.id,'电话约见');
  else addLog('📞 '+c.name+' 同意见面','info');
}
function slotOrdinal(week,day,phase){
  const phOrder={morning:0,evening:1,rest:2,allnight:3};
  return week*28+day*4+(phOrder[phase]!=null?phOrder[phase]:0);
}
function checkBffOutingMiss(){
  const p=game.bffOutingPlan;
  if(!p||p.completed)return;
  const d=game.daily;
  if(!d)return;
  const planned=slotOrdinal(p.week,p.dayIndex,p.phase);
  const cur=slotOrdinal(game.week,d.dayIndex,d.phase);
  if(cur>planned){
    addStress(1,'爽约基友/闺蜜 ');
    addLog('📞 '+(game.bffName||'基友/闺蜜')+' 骂你放鸽子 · 压力+1','warn');
    game.bffOutingPlan=null;
  }
}
function tryCompleteBffOuting(placeKey){
  const p=game.bffOutingPlan;
  if(!p||p.completed||p.place!==placeKey)return;
  const d=game.daily;
  if(p.week===game.week&&p.dayIndex===d.dayIndex&&p.phase===d.phase){
    p.completed=true;
    addLog('🤝 如约和 '+(game.bffName||'基友/闺蜜')+' 在'+p.label+' 碰面','success');
    game.bffOutingPlan=null;
  }
}
function tagMeetContact(person){
  if(!person)return person;
  person.kind='acquaintance';
  if(person.gender==null)person.gender=Math.random()<0.5?'male':'female';
  return person;
}
function tagAffairContactGender(c){
  if(!c)return c;
  if(c.gender==null)c.gender=game.partnerGender||'female';
  if(!c.kind&&c.affairCount)c.kind='affair';
  return c;
}
function renderContactsBlock(){
  initCoreContacts();
  const n=(game.contacts||[]).length;
  if(!n)return '';
  const noPhone=typeof hasUsablePhone==='function'&&!hasUsablePhone();
  return '<div class="daily-contacts"><b>通讯录</b>（'+n+'人） '+
    '<button class="btn" style="font-size:.7rem;padding:2px 8px" '+(noPhone?'disabled':'')+' onclick="openContactsModal()">打开</button>'+
    (noPhone?'<span class="fold-meta" style="color:var(--red)"> · 无可用手机</span>':'')+'</div>';
}
function migrateContactsSystem(){
  if(!game)return;
  if(!game.contacts)game.contacts=[];
  if(!game.contactLoans)game.contactLoans=[];
  if(!game.partnerDisplayName&&game.married&&!game.divorced)game.partnerDisplayName=pickPartnerDisplayName(game.partnerGender||'female');
  if(!game.bffName)game.bffName=pickBffName(game.playerGender||'male');
  game.contacts.forEach(c=>{
    if(c.starred==null)c.starred=false;
    if(c.remark==null)c.remark='';
    if(c.id===CORE_CONTACT_IDS.spouse||c.kind==='spouse')return;
    if(c.id===CORE_CONTACT_IDS.exSpouse||c.kind==='ex_spouse')return;
    if(c.id===CORE_CONTACT_IDS.parents||c.kind==='parents')return;
    if(c.id===CORE_CONTACT_IDS.bff||c.kind==='bff')return;
    if((c.affairCount||0)>0||c.affairStatus==='affair'||c.affairStatus==='fwb')tagAffairContactGender(c);
    else if(!c.kind)tagMeetContact(c);
  });
  initCoreContacts();
  if(game.divorced)syncExSpouseContact();
}
