/* 通讯录 — 由 build.js 注入 */
const CORE_CONTACT_IDS={parents:'core_parents',father:'core_father',mother:'core_mother',bff:'core_bff',spouse:'core_spouse',exSpouse:'core_ex_spouse'};
function isParentContact(c){
  if(!c)return false;
  if(c.kind==='parents'||c.kind==='father'||c.kind==='mother')return true;
  return c.id===CORE_CONTACT_IDS.parents||c.id===CORE_CONTACT_IDS.father||c.id===CORE_CONTACT_IDS.mother;
}
const BFF_OUT_PLACES={
  park:{key:'park',label:'公园'},
  cafe:{key:'cafe',label:'咖啡店'},
  library:{key:'library',label:'图书馆'},
  club:{key:'club',label:'夜店'},
  bar:{key:'bar',label:'酒吧'},
  store:{key:'store',label:'便利店'}
};
const CONTACT_NO_ANSWER_CHANCE=0.22;
const CONTACT_FAMILIAR_ACQUAINT=60;
const CONTACT_FAMILIAR_FRIEND=80;
const CONTACT_FAMILIAR_BEST=90;
const CONTACT_ATTRACTION_INTIMATE=70;
const CONTACT_ATTRACTION_CONFESS=75;
const CONTACT_CONFESS_WEEKLY_CHANCE=0.12;
function deriveCoupleOrientation(pg,sg){
  return pg===sg?'homosexual':'heterosexual';
}
function initPlayerOrientation(){
  if(!game)return;
  if(!game.playerOrientation)game.playerOrientation='bisexual';
  if(!game.coupleOrientation&&game.playerGender&&game.partnerGender)
    game.coupleOrientation=deriveCoupleOrientation(game.playerGender,game.partnerGender);
}
function orientationLabel(o){
  return {bisexual:'双性恋',homosexual:'同性恋',heterosexual:'异性恋',unknown:'未知'}[o]||'未知';
}
function rollContactOrientation(gender,rng){
  const r=rng||Math.random;
  const roll=r();
  if(roll<0.38)return gender==='female'?'heterosexual':'homosexual';
  if(roll<0.76)return gender==='male'?'heterosexual':'homosexual';
  return 'unknown';
}
function orientationAttractedTo(ori,personGender,targetGender){
  if(!personGender||!targetGender)return false;
  if(!ori||ori==='unknown')return true;
  if(ori==='bisexual')return true;
  if(ori==='homosexual')return personGender===targetGender;
  if(ori==='heterosexual')return personGender!==targetGender;
  return false;
}
function mutualOrientationMatch(c){
  if(!game||!c||!c.gender)return false;
  const pg=game.playerGender||'male';
  return orientationAttractedTo(game.playerOrientation||'bisexual',pg,c.gender)
    &&orientationAttractedTo(c.orientation||'unknown',c.gender,pg);
}
function ensureContactSocialFields(c){
  if(!c)return null;
  if(c.familiarity==null)c.familiarity=c.kind==='bff'?88:(c.kind==='spouse'?95:25+Math.floor(Math.random()*20));
  if(c.attraction==null)c.attraction=30+Math.floor(Math.random()*45);
  if(!c.orientation&&c.kind!=='parents'&&c.kind!=='spouse')c.orientation=rollContactOrientation(c.gender||'male');
  if(c.kind==='spouse')c.orientation=game.coupleOrientation||deriveCoupleOrientation(game.playerGender,game.partnerGender);
  return c;
}
function bumpContactFamiliarity(c,delta){
  if(!c||isCoreContact(c)&&c.kind==='parents')return;
  ensureContactSocialFields(c);
  c.familiarity=Math.max(0,Math.min(100,(c.familiarity||0)+delta));
}
function bumpContactAttraction(c,delta){
  if(!c)return;
  ensureContactSocialFields(c);
  c.attraction=Math.max(0,Math.min(100,(c.attraction||0)+delta));
}
function contactFamiliarityTier(c){
  const f=c&&(c.familiarity!=null?c.familiarity:0);
  if(f>=CONTACT_FAMILIAR_BEST)return 'best';
  if(f>=CONTACT_FAMILIAR_FRIEND)return 'friend';
  if(f>=CONTACT_FAMILIAR_ACQUAINT)return 'acquaint';
  return 'stranger';
}
function contactFamiliarityTierLabel(c){
  const t=contactFamiliarityTier(c);
  return {stranger:'陌生人',acquaint:'朋友',friend:'好友',best:'挚友'}[t]||'陌生人';
}
function contactIsFriend(c){
  return contactFamiliarityTier(c)!=='stranger';
}
function canDevelopIntimateByAttraction(c){
  if(!c||c.unreachable||isParentContact(c))return false;
  ensureContactSocialFields(c);
  return (c.attraction||0)>=CONTACT_ATTRACTION_INTIMATE&&mutualOrientationMatch(c);
}
function canDevelopIntimateRelation(c){
  if(!c||c.unreachable||isParentContact(c))return false;
  if(typeof isFamilyKind==='function'&&isFamilyKind(c))return false;
  ensureContactSocialFields(c);
  if(canDevelopIntimateByAttraction(c))return true;
  if(!mutualOrientationMatch(c))return false;
  return contactIsFriend(c);
}
function inviteableContacts(){
  initCoreContacts();
  return (game.contacts||[]).filter(function(c){
    if(!c||c.unreachable||isParentContact(c))return false;
    if(c.kind==='bff'||c.kind==='spouse')return true;
    ensureContactSocialFields(c);
    return contactFamiliarityTier(c)==='friend'||contactFamiliarityTier(c)==='best';
  });
}
function pickInviteContactsModal(title,maxPick,onConfirm){
  const list=inviteableContacts();
  if(!list.length){
    addLog('通讯录里还没有可邀请的好友（熟悉度≥80）','fail');
    return;
  }
  maxPick=Math.max(1,maxPick||1);
  if(typeof showConsumeModalHandlers!=='function'){
    const names=list.slice(0,maxPick).map(function(c){return c.name}).join('、');
    onConfirm(list.slice(0,Math.min(maxPick,list.length)));
    return;
  }
  let picked={};
  function renderPick(){
    let html='<p class="fold-meta">最多选 '+maxPick+' 人 · 已选 '+Object.keys(picked).length+'</p><div style="max-height:220px;overflow:auto">';
    list.forEach(function(c){
      const on=!!picked[c.id];
      html+='<button type="button" class="btn" style="display:block;width:100%;margin:4px 0;font-size:.72rem;'+(on?'border-color:var(--green)':'')+'" onclick="toggleVillaInvitePick(\''+escContactId(c.id)+'\')">'+
        (on?'✓ ':'')+contactDisplayName(c)+' · 熟悉'+(c.familiarity|0)+' · 吸引'+(c.attraction|0)+'</button>';
    });
    html+='</div>';
    showConsumeModalHandlers({
      icon:'📇',title:title,html:html,
      buttons:[
        {text:'取消',handler:function(){if(typeof closeConsumeModal==='function')closeConsumeModal(true);}},
        {text:'确认邀请',primary:true,handler:function(){
          const sel=list.filter(function(c){return picked[c.id]});
          if(!sel.length){addLog('请至少选一位','fail');return;}
          if(typeof closeConsumeModal==='function')closeConsumeModal(true);
          onConfirm(sel.slice(0,maxPick));
        }}
      ]
    });
  }
  game._villaInvitePick=picked;
  game._villaInviteRender=renderPick;
  renderPick();
}
function toggleVillaInvitePick(id){
  if(!game._villaInvitePick)game._villaInvitePick={};
  if(game._villaInvitePick[id])delete game._villaInvitePick[id];
  else game._villaInvitePick[id]=true;
  if(typeof game._villaInviteRender==='function')game._villaInviteRender();
}
function respondContactConfession(contactId,accept){
  const c=findContact(contactId);
  if(!c||!c.pendingConfession)return;
  if(isParentContact(c)){c.pendingConfession=false;addLog('无法与父母确立恋爱关系','fail');return}
  if(typeof isFamilyKind==='function'&&isFamilyKind(c)){c.pendingConfession=false;addLog('无法与亲戚确立恋爱关系','fail');return}
  c.pendingConfession=false;
  if(accept){
    c.affairStatus=c.affairStatus==='none'?'affair':c.affairStatus;
    if(!c.firstAffairWeek)c.firstAffairWeek=game.week;
    bumpContactFamiliarity(c,5);
    bumpContactAttraction(c,3);
    if(typeof ensureContactRelationFields==='function')ensureContactRelationFields(c);
    c.intimateRelation=true;
    c.intimateMarkedWeek=game.week||0;
    addLog('💞 接受 '+c.name+' 的表白 · 确立亲密关系认定','success');
    if(game.married&&!game.divorced)game.affairActive=true;
  }else{
    const loss=Math.round(5+(c.attraction||0)/8);
    bumpContactFamiliarity(c,-loss);
    addLog('💔 拒绝 '+c.name+' 的表白 · 熟悉度 -'+loss,'warn');
  }
  if(typeof updateUI==='function')updateUI();
}
function tickContactConfessions(){
  if(!game||!game.contacts||game.gameOver)return;
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning)return;
  initPlayerOrientation();
  game.contacts.forEach(function(c){
    if(isCoreContact(c)||c.unreachable||c.pendingConfession||isParentContact(c))return;
    if(typeof isFamilyKind==='function'&&isFamilyKind(c))return;
    ensureContactSocialFields(c);
    if(contactHasAffairRecord(c))return;
    if((c.attraction||0)<CONTACT_ATTRACTION_CONFESS||!mutualOrientationMatch(c))return;
    if(Math.random()>=CONTACT_CONFESS_WEEKLY_CHANCE)return;
    c.pendingConfession=true;
    queuePersonEncounter({
      lane:'person',icon:'💌',title:c.name+' 的表白',
      html:'<p><b>'+c.name+'</b> 向你表白：「我想和你更进一步…」</p>'+
        '<p class="fold-meta">熟悉度 '+(c.familiarity|0)+' · 吸引力 '+(c.attraction|0)+' · '+orientationLabel(c.orientation)+'</p>'+
        '<p class="fold-meta">接受：确立亲密关系 · 拒绝：熟悉度下降（吸引力越高掉得越多）</p>',
      buttons:[
        {text:'拒绝',handler:function(){respondContactConfession(c.id,false)}},
        {text:'接受',primary:true,handler:function(){respondContactConfession(c.id,true)}}
      ]
    });
  });
}
/* 偶遇弹窗三通道：artifact 神人 > person 认识的人 > event 场所/轶事/结果 */
const encounterLanes={artifact:[],person:[],event:[]};
let encounterModalBusy=false;
let encounterModalPendingClose=null;
let encounterSerialFns=[];
function encounterLanesPending(){
  return encounterModalBusy||encounterLanes.artifact.length+encounterLanes.person.length+encounterLanes.event.length>0;
}
function pickNextEncounterModal(){
  if(encounterLanes.artifact.length)return encounterLanes.artifact.shift();
  if(encounterLanes.person.length)return encounterLanes.person.shift();
  return encounterLanes.event.length?encounterLanes.event.shift():null;
}
function queueArtifactEncounter(opts){if(!opts)return;encounterLanes.artifact.push(opts);pumpEncounterModals()}
function queuePersonEncounter(opts){if(!opts)return;encounterLanes.person.push(opts);pumpEncounterModals()}
function queueEventEncounter(opts){if(!opts)return;encounterLanes.event.push(opts);pumpEncounterModals()}

function formatMeetPersonHtml(person,where,isRepeat){
  if(!person)return '';
  const prof=typeof contactProfileLabel==='function'?contactProfileLabel(person):(person.jobTitle+' @'+(person.company||'?'));
  const gender=typeof contactGenderLabel==='function'?contactGenderLabel(person):'';
  const age=person.age!=null?person.age+'岁':'';
  const metLbl=typeof contactMetLabel==='function'?contactMetLabel(person):'';
  let h='<p>在「<b>'+where+'</b>」'+(isRepeat?'又遇见了':'遇见了')+' <b>'+person.name+'</b>';
  if(gender)h+=' · '+gender;
  if(age)h+=' · '+age;
  h+='。</p><p class="fold-meta">'+prof+'</p>';
  if(person.income)h+='<p class="fold-meta">年收入约 ¥'+person.income.toLocaleString()+'</p>';
  if(metLbl&&!isRepeat)h+='<p class="fold-meta">'+metLbl+'</p>';
  if(!isRepeat)h+='<p>已记入通讯录，日后可多联系熟悉。</p>';
  return h;
}
function parseMetWeekFromContactId(id){
  if(!id||String(id).indexOf('ct_')!==0)return null;
  const parts=String(id).split('_');
  if(parts.length<2)return null;
  const wk=parseInt(parts[1],10);
  return isNaN(wk)?null:wk;
}
function contactMetLabel(c){
  if(!c)return '';
  if(c.kind==='parents')return '结识 · 人生起点 · '+(c.metWhere||'家人');
  if(c.kind==='bff')return '结识 · 人生起点 · '+(c.metWhere||'发小');
  if(c.kind==='spouse'){
    const wk0=c.metWeek;
    const date0=(typeof getDateStr==='function'&&wk0!=null)?getDateStr(wk0):'';
    return date0?('结识 · '+date0+' · '+(c.metWhere||'婚姻')):(c.metWhere||'婚姻');
  }
  if(c.kind==='ex_spouse'){
    const wk0=c.metWeek;
    const date0=(typeof getDateStr==='function'&&wk0!=null)?getDateStr(wk0):'';
    return date0?('结识 · '+date0+' · '+(c.metWhere||'曾经婚姻')):(c.metWhere||'曾经婚姻');
  }
  if(c.kind==='child'){
    const ch=typeof findChildRecord==='function'?findChildRecord(c.id):null;
    const bd=ch&&typeof getChildBirthDateStr==='function'?getChildBirthDateStr(ch):'';
    const age=ch&&typeof formatChildAge==='function'?formatChildAge(ch):'';
    if(bd&&age)return '生于 · '+bd+' · 现年 '+age;
    if(bd)return '生于 · '+bd;
    if(age)return '现年 '+age;
    return c.metWhere||'家庭';
  }
  const where=c.metWhere||'';
  let wk=c.metWeek;
  if(wk==null&&(c.firstAffairWeek||0)>0)wk=c.firstAffairWeek;
  if(wk==null&&c.id){
    const parsed=parseMetWeekFromContactId(c.id);
    if(parsed!=null)wk=parsed;
  }
  if(wk==null&&!where)return '结识 · 时间不明';
  const date=(typeof getDateStr==='function'&&wk!=null)?getDateStr(wk):'';
  if(date&&where)return '结识 · '+date+' · '+where;
  if(date)return '结识 · '+date;
  return where?('结识 · '+where):'结识 · 时间不明';
}
function pumpEncounterModals(){
  if(encounterModalBusy||!encounterLanesPending())return;
  if(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating()){
    const m=pickNextEncounterModal();
    if(m){
      if(m.logMsg)addLog(m.logMsg,'info');
      if(typeof m.onClose==='function'){try{m.onClose()}catch(e){console.error('encounter onClose',e)}}
    }
    setTimeout(pumpEncounterModals,0);
    setTimeout(drainEncounterSerial,0);
    return;
  }
  if(typeof artifactEncounterBlocking==='function'&&artifactEncounterBlocking())return setTimeout(pumpEncounterModals,120);
  if(typeof consumeModalOpen!=='undefined'&&consumeModalOpen)return setTimeout(pumpEncounterModals,120);
  if(typeof statusModalOpen!=='undefined'&&statusModalOpen)return setTimeout(pumpEncounterModals,120);
  const m=pickNextEncounterModal();
  if(!m)return;
  encounterModalBusy=true;
  const done=function(){
    if(!encounterModalBusy&&!encounterModalPendingClose)return;
    encounterModalBusy=false;
    encounterModalPendingClose=null;
    if(typeof m.onClose==='function'){try{m.onClose()}catch(e){console.error('encounter onClose',e)}}
    setTimeout(pumpEncounterModals,80);
    setTimeout(drainEncounterSerial,90);
  };
  encounterModalPendingClose=done;
  const wrapBtn=function(b){
    return{text:b.text,primary:!!b.primary,handler:function(){
      if(typeof b.handler==='function'){try{b.handler()}catch(e){console.error('encounter btn',e)}}
      if(encounterModalBusy){
        if(typeof closeConsumeModal==='function')closeConsumeModal(true);
        else done();
      }
    }};
  };
  const btns=(m.buttons&&m.buttons.length)?m.buttons.map(wrapBtn):[wrapBtn({text:m.btn||'知道了',primary:true})];
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({icon:m.icon||'👋',title:m.title||'偶遇',html:m.html||'',buttons:btns});
  }else if(typeof showConsumeModal==='function'){
    showConsumeModal({icon:m.icon||'👋',title:m.title||'偶遇',html:m.html||'',buttons:[{text:m.btn||'知道了',primary:true,fn:'closeConsumeModal()'}]});
    encounterModalBusy=false;
    if(typeof m.onClose==='function')setTimeout(m.onClose,100);
    setTimeout(pumpEncounterModals,150);
    setTimeout(drainEncounterSerial,160);
  }else{
    encounterModalBusy=false;
    if(m.logMsg)addLog(m.logMsg,'info');
    done();
  }
}
function queueEncounterModal(opts){
  if(!opts)return;
  const lane=opts.lane||(opts.priority==='high'?'artifact':'event');
  if(lane==='artifact')queueArtifactEncounter(opts);
  else if(lane==='person')queuePersonEncounter(opts);
  else queueEventEncounter(opts);
}
function encounterModalConsumeClosed(){
  if(encounterModalPendingClose)encounterModalPendingClose();
}
function drainEncounterSerial(){
  const step=function(){
    if(typeof artifactEncounterBlocking==='function'&&artifactEncounterBlocking())return setTimeout(step,100);
    if(encounterLanesPending())return setTimeout(step,100);
    if(typeof consumeModalOpen!=='undefined'&&consumeModalOpen)return setTimeout(step,100);
    if(typeof statusModalOpen!=='undefined'&&statusModalOpen)return setTimeout(step,100);
    if(!encounterSerialFns.length)return;
    const fn=encounterSerialFns.shift();
    try{fn()}catch(e){console.error('encounter serial',e);}
    setTimeout(step,100);
  };
  step();
}
function runAfterEncounterModals(fn){
  if(typeof fn!=='function')return;
  encounterSerialFns.push(fn);
  drainEncounterSerial();
}
function hasPendingEncounterModals(){
  return encounterLanesPending()||encounterSerialFns.length>0;
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
function clearExSpouseContact(){
  if(!game||!game.contacts)return;
  game.contacts=game.contacts.filter(c=>c.id!==CORE_CONTACT_IDS.exSpouse&&c.kind!=='ex_spouse');
}
function restoreSpouseContactAfterReconcile(){
  if(!game||!game.married||game.divorced)return;
  if(game.exPartnerName)delete game.exPartnerName;
  if(game.exPartnerGender)delete game.exPartnerGender;
  clearExSpouseContact();
  syncSpouseContact();
}
function syncSpouseContact(){
  if(!game)return;
  if(!game.contacts)game.contacts=[];
  if(game.divorced||!game.married){
    game.contacts=game.contacts.filter(c=>c.id!==CORE_CONTACT_IDS.spouse);
    return;
  }
  clearExSpouseContact();
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
function syncParentsContact(){
  if(typeof syncSplitParentsContacts==='function'){syncSplitParentsContacts();return}
  if(!game)return;
  if(!game.contacts)game.contacts=[];
  if(game.parentsInheritanceSettled){
    game.contacts=game.contacts.filter(c=>c.id!==CORE_CONTACT_IDS.parents&&c.kind!=='parents');
    return;
  }
  ensureCoreContact(CORE_CONTACT_IDS.parents,{kind:'parents',name:'爸妈',gender:'',role:'父母',company:'',jobTitle:'',income:0});
}
function initCoreContacts(){
  if(!game)return;
  initPlayerOrientation();
  if(!game.contacts)game.contacts=[];
  if(!game.partnerDisplayName)game.partnerDisplayName=pickPartnerDisplayName(game.partnerGender||'female');
  if(!game.bffName)game.bffName=pickBffName(game.playerGender||'male');
  const pg=game.playerGender||'male';
  syncParentsContact();
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
  if(typeof isPartnerOutForFun==='function')return isPartnerOutForFun(phase);
  if(!game||!game.married||game.divorced)return false;
  if(game.longDistance)return false;
  if(isSpouseAtHome(phase))return false;
  if(isCompanionWorkSlot(phase))return false;
  return true;
}
function contactKindLabel(c){
  if(!c)return '';
  if(c.dead)return '已离世';
  if(c.kind==='parents')return '父母';
  if(c.kind==='father')return '父亲';
  if(c.kind==='mother')return '母亲';
  if(c.kind==='child')return '子女';
  if(c.kind==='grandparent'||c.kind==='spouse_grandparent')return c.role||'祖辈';
  if(c.kind==='great_grandparent'||c.kind==='spouse_great_grandparent')return c.role||'曾祖辈';
  if(c.kind==='spouse_parent')return c.role||'姻亲';
  if(c.kind==='spouse')return '伴侣';
  if(c.kind==='ex_spouse')return c.role||(c.gender==='male'?'前夫':'前妻');
  if(c.kind==='bff')return c.role||'基友/闺蜜';
  if(c.pendingConfession)return '表白中';
  if((c.affairCount||0)>0||c.affairStatus==='affair'||c.affairStatus==='fwb')return '亲密关系';
  if(c.affairStatus==='married_affair')return '秘密成婚';
  ensureContactSocialFields(c);
  return contactFamiliarityTierLabel(c);
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
function isCoreContact(c){
  if(!c)return true;
  if(typeof isFamilyCoreContact==='function'&&isFamilyCoreContact(c))return true;
  if(c.id===CORE_CONTACT_IDS.parents||c.kind==='parents')return true;
  if(c.id===CORE_CONTACT_IDS.father||c.kind==='father')return true;
  if(c.id===CORE_CONTACT_IDS.mother||c.kind==='mother')return true;
  if(c.id===CORE_CONTACT_IDS.bff||c.kind==='bff')return true;
  if(c.id===CORE_CONTACT_IDS.spouse||c.kind==='spouse')return true;
  if(c.id===CORE_CONTACT_IDS.exSpouse||c.kind==='ex_spouse')return true;
  return false;
}
function deleteContactFromModal(id){
  const c=game.contacts&&game.contacts.find(x=>x.id===id);
  if(!c)return;
  if(isCoreContact(c)){addLog('初始联系人（家人/伴侣/基友等）无法删除','fail');return;}
  const name=typeof contactDisplayName==='function'?contactDisplayName(c):c.name;
  const hadAffair=typeof contactHasAffairRecord==='function'&&contactHasAffairRecord(c);
  let msg='确定从通讯录删除「'+name+'」？\n删除后压力 +10';
  if(hadAffair)msg='确定删除「'+name+'」的联系方式？\n其亲密关系/幽会记录将一并销毁。\n删除后压力 +10';
  if(!confirm(msg))return;
  game.contacts=game.contacts.filter(x=>x.id!==id);
  if(game.contactLoans)game.contactLoans=game.contactLoans.filter(l=>l.contactId!==id);
  if(hadAffair&&typeof purgeAffairEvidenceForContact==='function')purgeAffairEvidenceForContact(id);
  if(hadAffair&&typeof syncPlayerAffairStateFromContacts==='function')syncPlayerAffairStateFromContacts();
  if(typeof addStress==='function')addStress(10,'删联系人 ');
  addLog(hadAffair?'🗑 已删除 '+name+' 的联系方式，相关亲密关系记录已销毁 · 压力+10':'🗑 已从通讯录删除 '+name+' · 压力+10','warn');
  if(typeof updateUI==='function')updateUI();
  if(typeof renderDailyPanel==='function')renderDailyPanel();
  renderContactsModal();
}
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
  if(game)game.contactPicker=null;
  const el=document.getElementById('contactsOverlay');
  if(el)el.classList.add('hidden');
}
function isContactPickerActive(){
  return !!(game&&game.contactPicker&&typeof game.contactPicker.onPick==='function');
}
function isScamBookPickerActive(){
  return !!(game&&game.contactPicker&&game.contactPicker.mode==='scamBook');
}
function openContactPicker(opts){
  opts=opts||{};
  if(typeof hasUsablePhone==='function'&&!hasUsablePhone()){addLog('暂无可用手机，无法使用通讯录','fail');return false}
  if(typeof isPlayerImprisoned==='function'&&isPlayerImprisoned()){addLog('监禁中无法使用通讯录','fail');return false}
  game.contactPicker={
    title:opts.title||'选择联系人',
    hint:opts.hint||'点击「选择」确认',
    filter:opts.filter||null,
    onPick:opts.onPick,
    onCancel:opts.onCancel||null
  };
  if(opts.closeConsumeModal!==false&&typeof closeConsumeModal==='function')closeConsumeModal(true);
  openContactsModal();
  return true;
}
function cancelContactPicker(){
  const pk=game&&game.contactPicker;
  const onCancel=pk&&pk.onCancel;
  closeContactsModal();
  if(onCancel)onCancel();
}
function pickContactFromPicker(id){
  const pk=game&&game.contactPicker;
  if(!pk)return;
  const c=(game.contacts||[]).find(function(x){return x.id===id});
  if(!c)return;
  if(pk.filter&&!pk.filter(c)){
    addLog('此人不符合选择条件','fail');
    return;
  }
  const handler=pk.onPick;
  if(game)game.contactPicker=null;
  closeContactsModal();
  if(handler)handler(c);
}
function renderContactPickerRow(c){
  const lbl=contactKindLabel(c);
  const gen=contactGenderLabel(c);
  const eid=escContactId(c.id);
  const dn=typeof contactDisplayName==='function'?contactDisplayName(c):c.name;
  return '<div class="contact-row contact-pick-row">'+
    '<div class="contact-row-hdr"><b>'+dn+'</b>'+
    (gen?'<span class="contact-gender">'+gen+'</span>':'')+
    '<span class="fold-meta">'+lbl+'</span></div>'+
    '<div class="contact-actions-row">'+
    '<button class="btn btn-primary" style="font-size:.72rem;padding:3px 10px" onclick="pickContactFromPicker(\''+eid+'\')">📞 选择</button>'+
    '</div></div>';
}
function isContactGroupFolded(key){
  if(!game)return false;
  game.contactGroupFoldState=game.contactGroupFoldState||{};
  if(game.contactGroupFoldState[key]==null)return false;
  return !!game.contactGroupFoldState[key];
}
function toggleContactGroupFold(key){
  if(!game)return;
  game.contactGroupFoldState=game.contactGroupFoldState||{};
  game.contactGroupFoldState[key]=!isContactGroupFolded(key);
  renderContactsModal();
}
function renderContactsModal(){
  const body=document.getElementById('contactsModalBody');
  const ti=document.getElementById('contactsModalTitle');
  if(!body||!game)return;
  if(isScamBookPickerActive()){
    if(typeof renderScamBookPickerModal==='function')renderScamBookPickerModal(body,ti);
    return;
  }
  initCoreContacts();
  if(typeof syncFriendsCircle==='function')syncFriendsCircle();
  let list=sortedContactsForModal();
  const ph=game.daily&&game.daily.phase;
  const picking=isContactPickerActive();
  const pk=game.contactPicker;
  if(picking&&pk&&pk.filter)list=list.filter(function(c){return pk.filter(c);});
  if(ti)ti.textContent=picking?('📇 '+(pk.title||'选择联系人')):('📇 通讯录 · '+list.length+' 人');
  let h='';
  if(picking){
    h+='<p class="fold-meta" style="margin:0 0 8px">'+(pk.hint||'按组折叠 · 点「选择」拨号')+'</p>';
    h+='<button type="button" class="btn" style="font-size:.72rem;margin-bottom:8px" onclick="cancelContactPicker()">取消</button>';
  }else{
    h+='<p class="fold-meta" style="margin:0 0 8px">按圈层分组 · 点击组名折叠/展开 · 星标置顶 · 熟悉度≥60或「关注」入朋友圈 · 当前 '+PHASE_LABELS[ph||'morning']+'</p>';
  }
  if(game.bffOutingPlan&&!game.bffOutingPlan.completed){
    const p=game.bffOutingPlan;
    h+='<p style="color:var(--yellow);font-size:.72rem;margin:0 0 8px">📅 约了 '+DAY_NAMES[p.dayIndex]+' '+PHASE_LABELS[p.phase]+' → '+p.label+'</p>';
  }
  if(!list.length){
    h+='<p style="color:var(--muted)">'+(picking?'本时段暂无可拨联系人':'暂无联系人')+'</p>';
    body.innerHTML=h;return;
  }
  const groups=typeof groupContactsForModal==='function'?groupContactsForModal(list):[{key:'all',label:'全部',contacts:list}];
  groups.forEach(function(g){
    const folded=isContactGroupFolded(g.key);
    h+='<div class="contact-group-fold">';
    h+='<div class="phone-fold-hdr contact-group-hdr" onclick="toggleContactGroupFold(\''+g.key+'\')">';
    h+='<span class="phone-fold-chev contact-group-chev" style="color:var(--muted)">'+(folded?'▶':'▼')+'</span>';
    h+='<b style="font-size:.85rem">'+g.label+'</b> <span class="fold-meta">'+g.contacts.length+' 人</span>';
    h+='</div>';
    if(!folded){
      h+='<div class="contact-group-body">';
      g.contacts.forEach(function(c){h+=renderContactModalRow(c,ph);});
      h+='</div>';
    }
    h+='</div>';
  });
  body.innerHTML=h;
}
function toggleContactStar(id){
  const c=game.contacts&&game.contacts.find(x=>x.id===id);
  if(!c)return;
  c.starred=!c.starred;
  renderContactsModal();
}
function toggleContactFollow(id){
  const c=game.contacts&&game.contacts.find(x=>x.id===id);
  if(!c||isCoreContact(c))return;
  c.followed=!c.followed;
  if(typeof syncFriendsCircle==='function')syncFriendsCircle();
  renderContactsModal();
  addLog((c.followed?'⭐ 已关注 ':'取消关注 ')+(typeof contactDisplayName==='function'?contactDisplayName(c):c.name)+(c.followed?'，已加入朋友圈':''),'info');
}
function renderContactModalRow(c,ph){
  if(isContactPickerActive())return renderContactPickerRow(c);
  const chk=canCallContact(c);
  const lbl=contactKindLabel(c);
  const gen=contactGenderLabel(c);
  const eid=escContactId(c.id);
  const extra=c.jobTitle?(c.jobTitle+' @'+c.company):'';
  const metLbl=contactMetLabel(c);
  const st=(c.affairCount>0?' · 亲密'+(c.affairCount||0)+'次':'')+(c.affairStatus==='fwb'?' · 炮友':'');
  const soc=(!isCoreContact(c)?' · 熟悉'+(c.familiarity|0)+' · 吸引'+(c.attraction|0):'');
  const src=(c.friendCircleSource&&typeof contactQualifiesForFriendsCircle==='function'&&contactQualifiesForFriendsCircle(c))?' · 来自'+c.friendCircleSource:'';
  let h='<div class="contact-row'+(c.starred?' starred':'')+'">'+
    '<div class="contact-row-hdr">'+
    '<button type="button" class="contact-star'+(c.starred?'':' off')+'" title="'+(c.starred?'取消星标':'星标置顶')+'" onclick="toggleContactStar(\''+eid+'\')">'+(c.starred?'★':'☆')+'</button>'+
    '<b>'+contactDisplayName(c)+'</b>'+
    (gen?'<span class="contact-gender">'+gen+'</span>':'')+
    '<span class="fold-meta">'+lbl+'</span>'+
    (extra?'<span class="fold-meta">'+extra+st+soc+src+'</span>':(st||soc||src?'<span class="fold-meta">'+st+soc+src+'</span>':''))+
    '</div>'+
    (metLbl?'<div class="fold-meta" style="margin:2px 0 4px 22px;color:var(--accent)">'+metLbl+'</div>':'')+
    '<div class="contact-actions-row">'+
    '<button class="btn" style="font-size:.72rem;padding:3px 8px" '+(chk.ok?'':'disabled')+' onclick="callContactFromModal(\''+eid+'\')">📞 联系</button>'+
    '<button class="btn" style="font-size:.72rem;padding:3px 8px" onclick="openNetworkPerson(\''+eid+'\')">🌐 详情</button> '+
    '<button class="btn" style="font-size:.72rem;padding:3px 8px" onclick="promptContactRemark(\''+eid+'\')">✏️ 备注</button> '+
    (!isCoreContact(c)?'<button class="btn" style="font-size:.72rem;padding:3px 8px'+(c.followed?';background:var(--accent);color:var(--bg)':'')+'" onclick="toggleContactFollow(\''+eid+'\')">'+(c.followed?'已关注':'关注')+'</button> ':'')+
    (c.pendingConfession?'<button class="btn" style="font-size:.72rem;padding:3px 8px" onclick="respondContactConfession(\''+eid+'\',true)">接受表白</button> '+
    '<button class="btn" style="font-size:.72rem;padding:3px 8px" onclick="respondContactConfession(\''+eid+'\',false)">拒绝</button> ':'')+
    (typeof relationshipContactActionButtons==='function'?relationshipContactActionButtons(c,eid):'')+
    (c.affairStatus==='proposal_pending'?'<button class="btn" style="font-size:.72rem;padding:3px 8px" onclick="promptAffairWedding(\''+eid+'\')">办婚礼</button> ':'')+
    (chk.ok?'':'<span class="fold-meta">'+chk.reason+'</span>')+
    (!isCoreContact(c)?'<button type="button" class="btn contact-del-btn" onclick="deleteContactFromModal(\''+eid+'\')">🗑 删除</button>':'')+
    '</div></div>';
  return h;
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
  if(game.daily&&game.daily.inOvertime)return {ok:true};
  if(typeof isPlayerWorkingNow==='function'&&isPlayerWorkingNow())return {ok:false,reason:'上班中无法给伴侣打电话'};
  const ph=game.daily&&game.daily.phase||'morning';
  if(typeof isPartnerOutForFun==='function'&&isPartnerOutForFun(ph)){
    if(game.daily&&game.daily.playerCalledPartnerHome)return {ok:false,reason:'本时段已叫过伴侣回家'};
    return {ok:true};
  }
  if(typeof isPartnerOutAndAbout==='function'&&isPartnerOutAndAbout(ph))return {ok:true};
  if(typeof isSpouseAtHome==='function'&&isSpouseAtHome(ph)&&typeof isPlayerAtHomeNow==='function'&&isPlayerAtHomeNow(ph))
    return {ok:false,reason:'都在家，打电话没效果'};
  return {ok:true};
}
function canCallContact(c){
  if(!c||!game||game.gameOver)return {ok:false,reason:'无法联系'};
  if(c.dead)return {ok:false,reason:'对方已离世'};
  if(wasContactCalled(c.id))return {ok:false,reason:'本时段已联系过'};
  if(wasContactNoAnswer(c.id))return {ok:false,reason:'对方未接，本时段不能再拨'};
  const ph=game.daily&&game.daily.phase;
  if(c.kind==='parents'||c.kind==='father'||c.kind==='mother'){
    if(typeof areParentsAlive==='function'?!areParentsAlive():game.parentsInheritanceSettled)return {ok:false,reason:'父母已离世，无法联系'};
    if(ph!=='morning'&&ph!=='evening')return {ok:false,reason:'爸妈仅白天/晚上可联系'};
  }
  if(c.kind==='spouse'||c.id===CORE_CONTACT_IDS.spouse){
    const chk=canCallSpouse();
    if(!chk.ok)return chk;
  }
  return {ok:true};
}
function canCallContactFromOvertime(c){
  if(!c||!game||game.gameOver)return {ok:false,reason:'无法联系'};
  if(c.dead)return {ok:false,reason:'对方已离世'};
  if(wasContactCalled(c.id))return {ok:false,reason:'本时段已联系过'};
  if(wasContactNoAnswer(c.id))return {ok:false,reason:'对方未接，本时段不能再拨'};
  const ph=game.daily&&game.daily.phase;
  if(c.kind==='parents'||c.kind==='father'||c.kind==='mother'){
    if(typeof areParentsAlive==='function'?!areParentsAlive():game.parentsInheritanceSettled)return {ok:false,reason:'父母已离世，无法联系'};
    if(ph!=='morning'&&ph!=='evening'&&ph!=='allnight')return {ok:false,reason:'爸妈仅白天/晚上可联系'};
  }
  if(c.kind==='spouse'||c.id===CORE_CONTACT_IDS.spouse){
    if(!game.married||game.divorced)return {ok:false,reason:'无伴侣'};
    return {ok:true};
  }
  return {ok:true};
}
function isDirectFamilyContact(c){
  if(!c)return false;
  const k=c.kind;
  return k==='grandparent'||k==='great_grandparent'||
    k==='spouse_parent'||k==='spouse_grandparent'||k==='spouse_great_grandparent';
}
function isFamilyRelativeContact(c){
  if(!c)return false;
  if(c.kind==='child')return false;
  if(isDirectFamilyContact(c))return true;
  if(typeof isFamilyKind==='function'&&isFamilyKind(c)&&c.kind!=='spouse'&&c.kind!=='ex_spouse')return true;
  if(c.circle==='family')return true;
  return false;
}
function callFamilyRelative(c){
  if(!c)return;
  c.talkCount=(c.talkCount||0)+1;
  bumpContactFamiliarity(c,2);
  const role=contactKindLabel(c);
  const direct=isDirectFamilyContact(c);
  const roll=Math.random();
  let html='';
  if(roll<0.52){
    const give=150+Math.floor(Math.random()*(direct?2200:900));
    game.cash+=give;game.money+=give;
    ledgerAddIncome('family','🧧',role+'·'+c.name+'红包',give);
    html=role+' <b>'+c.name+'</b> 给你转了 <b>¥'+give.toLocaleString()+'</b>';
    addLog('🧧 '+c.name+' 资助 ¥'+give.toLocaleString(),'success');
  }else if(roll<0.78){
    addStress(-1,role+'关心 ');
    html='聊聊家常 · 压力 -1';
    addLog('📞 '+c.name+' 嘘寒问暖 · 压力-1','info');
  }else if(roll<0.88){
    addStress(1,role+'唠叨 ');
    html=role+'唠叨几句 · 压力 +1';
    addLog('📞 '+c.name+' 唠叨 · 压力+1','info');
  }else if(roll<0.93&&!direct){
    promptContactLoan(c);
    return;
  }else if(roll<0.96&&direct){
    promptContactLoan(c);
    return;
  }else if(roll<0.98&&!direct&&game.cash>=200){
    const ask=200+Math.floor(Math.random()*600);
    if(game.cash>=ask){
      game.cash-=ask;
      ledgerAddExpense('family','👪','给'+c.name+'钱',ask,false);
      html='对方开口要点钱 · 你给了 ¥'+ask.toLocaleString();
      addLog('👪 给 '+c.name+' ¥'+ask,'info');
    }else html='对方想借钱 · 你没给';
  }else{
    html='互报近况，没多聊';
    addLog('📞 和 '+c.name+' 闲聊','info');
  }
  showConsumeModal({icon:'👪',title:'联系'+role,html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
}
function callContact(id,fromOvertime){
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning)return;
  const c=findContact(id)||game.contacts.find(x=>x.id===id);
  if(!c){addLog('联系人不存在','fail');return}
  const inOt=!!fromOvertime||(game.daily&&game.daily.inOvertime);
  const chk=(inOt&&typeof canCallContactFromOvertime==='function')?canCallContactFromOvertime(c):canCallContact(c);
  if(!chk.ok){addLog(chk.reason,'fail');return}
  markContactCalled(c.id);
  if(c.kind==='parents'||c.kind==='father'||c.kind==='mother')callParents(c);
  else if(c.kind==='spouse')callSpouse(c,inOt);
  else if(c.kind==='ex_spouse')callExSpouse(c);
  else if(c.kind==='bff')callBff(c);
  else if((c.affairCount||0)>0||c.affairStatus==='affair'||c.affairStatus==='fwb'||c.affairStatus==='married_affair')callIntimateContact(c);
  else if(isFamilyRelativeContact(c))callFamilyRelative(c);
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
function exChildSupportScenario(){
  if(!game||!game.divorced)return null;
  const cr=typeof ensureChildRecord==='function'?ensureChildRecord():null;
  if(cr&&cr.monthsLeft>0&&cr.custody==='partner'&&cr.bioFather!=='other'){
    if(cr.paternityTested&&!cr.paternityIsPlayer)return null;
    return {kind:'child_support',cr};
  }
  if(!game.hasChildren&&!game.pregnant&&!game.exOtherPregnancyAnnounced&&!game.exPregnancyDisputed){
    return {kind:'ex_pregnancy_claim'};
  }
  return null;
}
function showExChildSupportModal(c,scenario){
  const role=contactKindLabel(c);
  const cr=scenario.cr;
  let html='',buttons=[];
  if(scenario.kind==='child_support'){
    if(!cr.paternityTested){
      html='<b>'+c.name+'</b> 带孩子，要求你每月支付抚养费 <b>¥'+(typeof CHILD_LIVING_COST!=='undefined'?CHILD_LIVING_COST:20000).toLocaleString()+'</b>。<br><br>你可以先做亲子鉴定（¥'+(typeof PATERNITY_TEST_COST!=='undefined'?PATERNITY_TEST_COST:5000).toLocaleString()+'）确认是否亲生。';
      buttons=[
        {text:'亲子鉴定 ¥'+(typeof PATERNITY_TEST_COST!=='undefined'?PATERNITY_TEST_COST:5000).toLocaleString(),primary:true,fn:'closeConsumeModal();runPaternityTest(false)'},
        {text:'先挂断',fn:'closeConsumeModal();updateUI()'}
      ];
    }else if(cr.paternityIsPlayer){
      html='亲子鉴定已确认是你的孩子，需按月支付抚养费 <b>¥'+(typeof CHILD_LIVING_COST!=='undefined'?CHILD_LIVING_COST:20000).toLocaleString()+'</b>。';
      buttons=[{text:'知道了',primary:true,fn:'closeConsumeModal()'}];
    }
  }else{
    game.exOtherPregnancyAnnounced=true;
    html='<b>'+c.name+'</b> 打来电话：「我怀孕了。」对方暗示可能是你的，要求你负责。<br><br>离婚后怀的别人的孩子不应由你承担——建议先做亲子鉴定。';
    buttons=[
      {text:'亲子鉴定 ¥'+(typeof PATERNITY_TEST_COST!=='undefined'?PATERNITY_TEST_COST:5000).toLocaleString(),primary:true,fn:'closeConsumeModal();runPaternityTest(true)'},
      {text:'拒绝，挂断',fn:'closeConsumeModal();addLog("💔 拒绝不合理抚养要求","info");game.exPregnancyDisputed=true;updateUI()'}
    ];
  }
  addLog('📞 联系'+role+' · 抚养/生育纠纷','warn');
  showConsumeModal({icon:'🧬',title:'联系'+role,html,buttons});
}
function callExSpouse(c){
  const role=contactKindLabel(c);
  const childCase=exChildSupportScenario();
  if(childCase&&(childCase.kind==='child_support'||Math.random()<0.4)){
    showExChildSupportModal(c,childCase);
    return;
  }
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
function rollPartnerComesHomeDecision(){
  const intim=game.spouseIntimacy!=null?game.spouseIntimacy:80;
  const ps=game.companion?game.companion.familyStress||0:0;
  let r=Math.random();
  if(intim>=75)r+=0.18;
  else if(intim<40)r-=0.22;
  if(ps>45)r-=0.12;
  if(r<0.28)return 'refuse';
  if(r<0.62)return 'reluctant';
  return 'willing';
}
function callSpouseAskPartnerHome(c){
  if(!game||!game.married||game.divorced)return;
  const d=game.daily;
  const ph=d&&d.phase||'morning';
  if(typeof isPartnerOutForFun==='function'&&!isPartnerOutForFun(ph)){
    callSpouse(c,false);return;
  }
  if(d&&d.playerCalledPartnerHome){addLog('本时段已叫过伴侣回家','fail');return}
  d.playerCalledPartnerHome=true;
  const pn=c.name||game.partnerDisplayName||'伴侣';
  const decision=rollPartnerComesHomeDecision();
  const allnight=ph==='allnight';
  const devil=allnight&&typeof isAllnightDevilHours==='function'&&isAllnightDevilHours();
  let html='',intimDelta=0,partnerStress=0;
  if(decision==='willing'){
    d.partnerOutForFun=false;
    intimDelta=2;partnerStress=-2;
    if(allnight){
      if(devil){
        if(typeof markPartnerAllnightActive==='function')markPartnerAllnightActive();
        html='<b>'+pn+'</b> 赶回来陪你：「行，今晚不睡了！」<br>亲密度 +2 · 可双人餐/做爱 · 通宵末需选作息';
        addLog('📞 通宵后段叫回家 · '+pn+' 醒着回来','success');
      }else{
        if(typeof markPartnerAllnightActive==='function')markPartnerAllnightActive();
        html='<b>'+pn+'</b> 回来了：「今晚陪你！」<br>亲密度 +2 · 伴侣压力 -2 · 可双人餐/做爱';
        addLog('📞 通宵金色时段叫回家 · '+pn+' 醒着回来','success');
      }
      if(typeof reducePartnerNeglect==='function')reducePartnerNeglect(0.22);
    }else{
      html='<b>'+pn+'</b> 痛快答应：「好呀，我这就回来！」<br>亲密度 +2 · 伴侣压力 -2';
      addLog('📞 叫伴侣回家 · 对方欣然答应','success');
    }
  }else if(decision==='reluctant'){
    d.partnerOutForFun=false;
    intimDelta=0;partnerStress=2;
    if(allnight){
      if(devil){
        if(typeof markPartnerAllnightActive==='function')markPartnerAllnightActive();
        html='<b>'+pn+'</b> 嘟囔着回来：「好吧…陪你。」<br>亲密度不变 · 伴侣压力 +2 · 可双人餐/做爱';
        addLog('📞 通宵后段叫回家 · '+pn+' 不情愿地回来','info');
      }else{
        if(typeof markPartnerAllnightActive==='function')markPartnerAllnightActive();
        html='<b>'+pn+'</b> 嘟囔着回来：「好吧…陪你。」<br>亲密度不变 · 伴侣压力 +2 · 可双人餐/做爱';
        addLog('📞 通宵金色时段叫回家 · '+pn+' 醒着回来','info');
      }
      if(typeof reducePartnerNeglect==='function')reducePartnerNeglect(0.18);
    }else{
      html='<b>'+pn+'</b> 嘟囔着回来了：「好吧…下次早点说。」<br>亲密度不变 · 伴侣压力 +2';
      addLog('📞 叫伴侣回家 · 对方不情愿地回来','info');
    }
  }else{
    intimDelta=-2;partnerStress=-1;
    if(allnight){
      if(typeof markPartnerAllnightStayedOut==='function')markPartnerAllnightStayedOut();
      html='<b>'+pn+'</b> 没接电话，继续在外面玩通宵。<br>亲密度 -2 · 伴侣压力 -1 · <span class="fold-meta">通宵结束须各自选作息</span>';
      addLog('📞 通宵叫回家 · '+pn+' 拒接，外面过夜','warn');
      if(typeof bumpPartnerAffairRisk==='function')bumpPartnerAffairRisk(0.12);
    }else{
      html='<b>'+pn+'</b> 拒绝：「再玩一会嘛！」没有回来。<br>亲密度 -2 · 伴侣压力 -1';
      addLog('📞 叫伴侣回家 · 对方拒绝','warn');
      if(typeof bumpPartnerAffairRisk==='function')bumpPartnerAffairRisk(0.1);
    }
  }
  if(intimDelta&&typeof adjustSpouseIntimacy==='function')adjustSpouseIntimacy(intimDelta);
  if(partnerStress&&typeof addCompanionStress==='function')addCompanionStress(partnerStress);
  showConsumeModal({icon:'📞',title:'叫伴侣回家',html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal();renderDailyPanel();updateUI()'}]});
}
function callSpouseAskPartnerHomeFromDaily(){
  if(typeof hasUsablePhone==='function'&&!hasUsablePhone()){addLog('暂无可用手机','fail');return}
  const sid=typeof CORE_CONTACT_IDS!=='undefined'?CORE_CONTACT_IDS.spouse:'core_spouse';
  const c=game.contacts&&game.contacts.find(x=>x.id===sid||x.kind==='spouse');
  if(!c){addLog('找不到伴侣联系人','fail');return}
  const chk=canCallSpouse();
  if(!chk.ok){addLog(chk.reason,'fail');return}
  if(typeof markContactCalled==='function')markContactCalled(c.id);
  callSpouseAskPartnerHome(c);
}
function callSpouse(c,fromOvertime){
  if(game.divorced||!game.married){addLog('已离异','fail');return}
  if(!fromOvertime){
    const chk=canCallSpouse();
    if(!chk.ok){addLog(chk.reason,'fail');return}
  }
  const ph=game.daily&&game.daily.phase||'morning';
  if(!fromOvertime&&typeof isPartnerOutForFun==='function'&&isPartnerOutForFun(ph)){
    callSpouseAskPartnerHome(c);
    return;
  }
  let delta=0,note='';
  if(fromOvertime){
    if(typeof isPartnerOutForFun==='function'&&isPartnerOutForFun(ph)){
      delta=Math.random()<0.55?1:-1;
      note=delta>0?'你在公司加班，对方在外面玩，电话里笑得很开心':'对方在外面，匆匆应付了几句就挂了';
    }else if(typeof isPartnerAllnightSleeping==='function'&&isPartnerAllnightSleeping(ph)){
      delta=0;note='对方已经睡了，没接电话';
    }else if(isSpouseAtHome(ph)){
      if(Math.random()<0.55){delta=2;note='加班到很晚，伴侣在家等你，电话里很暖心'}
      else{delta=1;note='伴侣在家守着，语气略带埋怨：「又这么晚？」'}
    }else if(typeof isCompanionWorkSlot==='function'&&isCompanionWorkSlot(ph)){
      delta=-1;note='伴侣也在忙，只回了条微信说晚点再说';
    }else if(typeof isPartnerOutAndAbout==='function'&&isPartnerOutAndAbout(ph)){
      delta=Math.random()<0.45?1:-1;
      note=delta>0?'对方在外面，听说你还在加班，语气软了下来':'对方在外面，背景很吵，没聊几句';
    }else{
      delta=Math.random()<0.4?1:0;
      note=delta?'通了电话，互报平安':'电话那头吵吵嚷嚷，没聊出什么';
    }
  }else if(isPartnerOutAndAbout(ph)){
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
function isNewAcquaintance(c){
  if(!c||c.kind!=='acquaintance')return false;
  const talks=c.talkCount||0;
  const met=(c.metWeek||0)>=game.week-1;
  return met&&talks<2;
}
function callAcquaintance(c){
  c.talkCount=(c.talkCount||0)+1;
  bumpContactFamiliarity(c,2);
  if(isNewAcquaintance(c)){
    const prof=typeof contactProfileLabel==='function'?contactProfileLabel(c):(c.jobTitle||'');
    addLog('📞 和 '+c.name+' 初次深聊 · 交换联系方式','info');
    showConsumeModal({
      icon:'👋',title:'认识一下',
      html:'和 <b>'+c.name+'</b> 简单聊了几句，互相加了微信。<br>'+(prof?'<span class="fold-meta">'+prof+'</span><br>':'')+
        '<span class="fold-meta">刚认识，还不会约你出去玩或谈钱 · 多联系几次才会熟</span>',
      buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]
    });
    return;
  }
  if(Math.random()<0.28){
    submitContactReferral(c);
    return;
  }
  if(Math.random()<(c.circle==='family'?0.1:0.35)){
    promptContactLoan(c);
    return;
  }
  if(c.circle==='family'&&Math.random()<0.22){
    const give=80+Math.floor(Math.random()*520);
    game.cash+=give;game.money+=give;
    ledgerAddIncome('family','🧧',c.name+'红包',give);
    addLog('🧧 '+c.name+' 给了 ¥'+give,'success');
    showConsumeModal({icon:'🧧',title:'联系 '+c.name,html:'<b>'+c.name+'</b> 给你发了 <b>¥'+give.toLocaleString()+'</b> 红包。',buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
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
  const phOrder={morning:0,evening:1,allnight:2,rest:1};
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
function showMeetPersonModal(person,where,isRepeat,onAfter){
  if(!person)return;
  const payload={
    lane:'person',
    icon:isRepeat?'🔄':'👋',
    title:isRepeat?'又遇见熟人':'结识新朋友',
    html:formatMeetPersonHtml(person,where,!!isRepeat),
    logMsg:'👋 '+(isRepeat?'又遇见':'结识')+' '+person.name+'（'+where+'）',
    onClose:function(){
      addLog('👋 '+(isRepeat?'又遇见':'结识')+' '+person.name+'（'+where+'）','info');
      if(!isRepeat&&typeof bumpContactFamiliarity==='function')bumpContactFamiliarity(person,3);
      else if(isRepeat&&typeof bumpContactFamiliarity==='function')bumpContactFamiliarity(person,1);
      if(typeof maybeTellWorkplaceStory==='function')maybeTellWorkplaceStory(person,where,onAfter);
      else if(typeof onAfter==='function')onAfter();
    }
  };
  if(typeof queuePersonEncounter==='function'){
    queuePersonEncounter(payload);
    return;
  }
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:payload.icon,title:payload.title,html:payload.html,
      buttons:[{text:'知道了',primary:true,handler:function(){
        if(typeof closeConsumeModal==='function')closeConsumeModal(true);
        if(payload.onClose)payload.onClose();
      }}]
    });
    return;
  }
  if(payload.logMsg)addLog(payload.logMsg,'info');
  if(payload.onClose)payload.onClose();
}
function queueBatchMeetModals(persons,where,onAllDone){
  if(!persons||!persons.length){
    if(typeof onAllDone==='function')onAllDone();
    return;
  }
  let i=0;
  const step=function(){
    if(i>=persons.length){
      if(typeof onAllDone==='function')onAllDone();
      return;
    }
    const p=persons[i++];
    showMeetPersonModal(p,where||p.metWhere||'聚会',false,step);
  };
  if(typeof runAfterEncounterModals==='function')runAfterEncounterModals(step);
  else step();
}
function tagMeetContact(person){
  if(!person)return person;
  person.kind='acquaintance';
  if(person.talkCount==null)person.talkCount=0;
  if(person.gender==null)person.gender=Math.random()<0.5?'male':'female';
  ensureContactSocialFields(person);
  if(typeof initPlayerOrientation==='function')initPlayerOrientation();
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
  let hint='';
  if(typeof paternityTestChildEligible==='function'&&paternityTestChildEligible()){
    const cost=typeof PATERNITY_TEST_COST!=='undefined'?PATERNITY_TEST_COST:5000;
    hint='<p class="fold-meta" style="color:var(--orange);margin:4px 0 0">🧬 对方索要抚养费 · 可点「生活消费」做亲子鉴定（¥'+cost.toLocaleString()+'），或在此联系前任</p>';
  }
  return '<div class="daily-contacts"><b>通讯录</b>（'+n+'人） '+
    '<button class="btn btn-allnight-plain" style="font-size:.7rem;padding:2px 8px" '+(noPhone?'disabled':'')+' onclick="openContactsModal()">打开</button>'+
    (noPhone?'<span class="fold-meta" style="color:var(--red)"> · 无可用手机</span>':'')+hint+'</div>';
}
function migrateContactsSystem(){
  if(!game)return;
  initPlayerOrientation();
  if(!game.contacts)game.contacts=[];
  if(!game.contactLoans)game.contactLoans=[];
  if(!game.partnerDisplayName&&game.married&&!game.divorced)game.partnerDisplayName=pickPartnerDisplayName(game.partnerGender||'female');
  if(!game.bffName)game.bffName=pickBffName(game.playerGender||'male');
  game.contacts.forEach(c=>{
    if(c.starred==null)c.starred=false;
    if(c.remark==null)c.remark='';
    if(!c.metWhere&&(c.kind==='acquaintance'||c.kind==='affair'||!c.kind))c.metWhere='不明';
    if(c.metWeek==null&&c.id){
      const parsed=parseMetWeekFromContactId(c.id);
      if(parsed!=null)c.metWeek=parsed;
    }
    if(c.metWeek==null&&(c.kind==='acquaintance'||c.kind==='affair')&&c.id&&String(c.id).indexOf('ct_')===0)c.metWeek=0;
    if(c.followed==null)c.followed=false;
    if(c.id===CORE_CONTACT_IDS.spouse||c.kind==='spouse')return;
    if(c.id===CORE_CONTACT_IDS.exSpouse||c.kind==='ex_spouse')return;
    if(c.id===CORE_CONTACT_IDS.parents||c.kind==='parents')return;
    if(c.id===CORE_CONTACT_IDS.bff||c.kind==='bff')return;
    if((c.affairCount||0)>0||c.affairStatus==='affair'||c.affairStatus==='fwb')tagAffairContactGender(c);
    else if(!c.kind)tagMeetContact(c);
    if(c.talkCount==null)c.talkCount=0;
    ensureContactSocialFields(c);
  });
  initCoreContacts();
  if(typeof syncParentsContact==='function')syncParentsContact();
  if(typeof syncFamilyCircle==='function')syncFamilyCircle();
  if(game.divorced)syncExSpouseContact();
  else if(game.married)restoreSpouseContactAfterReconcile();
}
