/* 生育：同性玩具、代孕、试管、借精 */
const SURROGACY_LOCAL=500000;
const SURROGACY_FOREIGN=1000000;
const IVF_LOCAL=Math.round(SURROGACY_LOCAL/5);
const IVF_FOREIGN=Math.round(SURROGACY_FOREIGN/5);
const SPERM_NORMAL=100000;
const SPERM_SUPER=200000;
const FERTILITY_DELIVERY_MONTHS=12;
const FERTILITY_DELIVERY_WEEKS=FERTILITY_DELIVERY_MONTHS*(typeof WEEKS_PER_MONTH!=='undefined'?WEEKS_PER_MONTH:4);

function migrateFertility(){
  if(!game)return;
  if(game.fertilityOrder&&!game.fertilityOrder.type)game.fertilityOrder=null;
}
function isSameSexMaleCouple(){
  return typeof isSameSexCouple==='function'&&isSameSexCouple()&&game.playerGender==='male';
}
function isSameSexFemaleCouple(){
  return typeof isSameSexCouple==='function'&&isSameSexCouple()&&game.playerGender==='female';
}
function canStartFertilityOrder(){
  return !!(game&&!game.pregnant&&!game.hasChildren&&!game.homeless&&!game.fertilityOrder&&!game.gameOver);
}
function fertilitySurrogacyEligible(){
  if(!canStartFertilityOrder())return false;
  if(game.married&&!game.divorced&&isSameSexMaleCouple())return true;
  if(game.divorced&&game.playerGender==='male')return true;
  return false;
}
function fertilityIvfEligible(){
  if(!canStartFertilityOrder())return false;
  if(game.married&&!game.divorced&&isSameSexFemaleCouple())return true;
  if(game.divorced&&game.playerGender==='female')return true;
  return false;
}
function fertilityNaturalProcreateEligible(){
  if(!canStartFertilityOrder())return false;
  if(typeof hasPrimaryPartner==='function'&&hasPrimaryPartner()&&!game.divorced&&!isSameSexCouple())return true;
  return false;
}
function showHomeFertilityBtn(){
  if(game.fertilityOrder)return true;
  return fertilityNaturalProcreateEligible()||fertilitySurrogacyEligible()||fertilityIvfEligible();
}
function homeFertilityBtnLabel(){
  if(game.fertilityOrder)return game.fertilityOrder.type==='surrogacy'?'👶 代孕中':'👶 试管中';
  if(game.procreateIntentWeek===game.week)return '🍼 备孕中';
  if(fertilitySurrogacyEligible())return '👶 代孕';
  if(fertilityIvfEligible())return '👶 试管';
  return '🍼 备孕¥'+(typeof PROC_CREATE_COST!=='undefined'?PROC_CREATE_COST:3000);
}
function fertilityOrderLabel(o){
  if(!o)return '';
  const loc=o.foreign?'国外':'国内';
  if(o.type==='surrogacy')return loc+'代孕';
  const sp=o.spermTier==='super'?'超级精子':'普通借精';
  return loc+'试管·'+sp;
}
function renderFertilitySpendingRows(){
  const rows=[];
  if(game.fertilityOrder){
    const o=game.fertilityOrder;
    rows.push({
      label:fertilityOrderLabel(o)+' · 进行中',
      meta:'已付 ¥'+o.cost.toLocaleString()+' · 预计 '+getDateStr(o.dueWeek)+' 交货（'+FERTILITY_DELIVERY_MONTHS+'个月）',
      btn:'进行中',fn:'',off:true
    });
    return rows;
  }
  if(fertilityNaturalProcreateEligible()){
    rows.push({
      label:'备孕 ¥'+PROC_CREATE_COST,
      meta:(game.procreateIntentWeek===game.week?'备孕中 · ':'')+'在宅家备孕 · 下次做爱怀孕率提升',
      btn:game.procreateIntentWeek===game.week?'备孕中':'备孕',
      fn:'setProcreateIntent()',off:game.procreateIntentWeek===game.week
    });
  }
  if(fertilitySurrogacyEligible()){
    rows.push({
      label:'代孕',
      meta:'国内 ¥'+(SURROGACY_LOCAL/10000)+'万 · 国外 ¥'+(SURROGACY_FOREIGN/10000)+'万 · '+FERTILITY_DELIVERY_MONTHS+'个月交货',
      btn:'申请',fn:'promptSurrogacyMenu()',off:false
    });
  }
  if(fertilityIvfEligible()){
    rows.push({
      label:'试管',
      meta:'试管费为代孕1/5（国内¥'+(IVF_LOCAL/10000)+'万/国外¥'+(IVF_FOREIGN/10000)+'万）· 借精普通¥'+(SPERM_NORMAL/10000)+'万/超级¥'+(SPERM_SUPER/10000)+'万',
      btn:'申请',fn:'promptIvfMenu()',off:false
    });
  }
  return rows;
}
function fertilityStatusCompanionRow(){
  if(!game||!game.fertilityOrder)return '';
  const o=game.fertilityOrder;
  const left=Math.max(0,o.dueWeek-game.week);
  const mo=Math.ceil(left/(typeof WEEKS_PER_MONTH!=='undefined'?WEEKS_PER_MONTH:4));
  return '<div class="companion-row"><span>'+fertilityOrderLabel(o)+'</span><span style="color:var(--green)">进行中 · 约剩 '+mo+' 月 · '+getDateStr(o.dueWeek)+' 交货</span></div>';
}
function routeProcreateIntent(){
  if(!game||game.gameOver)return;
  if(game.fertilityOrder){addLog('已有生育订单进行中','warn');return;}
  if(fertilitySurrogacyEligible()){promptSurrogacyMenu();return;}
  if(fertilityIvfEligible()){promptIvfMenu();return;}
  setProcreateIntentNatural();
}
function promptSurrogacyMenu(){
  if(!fertilitySurrogacyEligible()){addLog('当前无法申请代孕','fail');return;}
  showConsumeModal({
    icon:'👶',title:'代孕',
    html:'国内 ¥'+SURROGACY_LOCAL.toLocaleString()+' · 国外 ¥'+SURROGACY_FOREIGN.toLocaleString()+'<br>'+
      '<span style="color:var(--muted)">'+FERTILITY_DELIVERY_MONTHS+' 个月后交货 · 付清全款启动</span>',
    buttons:[
      {text:'国内代孕',fn:'startSurrogacyOrder(false)'},
      {text:'国外代孕',primary:true,fn:'startSurrogacyOrder(true)'}
    ]
  });
}
function promptIvfMenu(){
  if(!fertilityIvfEligible()){addLog('当前无法申请试管','fail');return;}
  showConsumeModal({
    icon:'🧪',title:'试管 + 借精',
    html:'试管费为代孕 1/5<br>国内试管 ¥'+IVF_LOCAL.toLocaleString()+' · 国外 ¥'+IVF_FOREIGN.toLocaleString()+'<br>'+
      '借精：普通 ¥'+SPERM_NORMAL.toLocaleString()+' · 超级精子 ¥'+SPERM_SUPER.toLocaleString()+'<br>'+
      '<span style="color:var(--muted)">'+FERTILITY_DELIVERY_MONTHS+' 个月后交货</span>',
    buttons:[
      {text:'国内·普通精',fn:'startIvfOrder(false,\'normal\')'},
      {text:'国内·超级精',fn:'startIvfOrder(false,\'super\')'},
      {text:'国外·普通精',primary:true,fn:'startIvfOrder(true,\'normal\')'},
      {text:'国外·超级精',fn:'startIvfOrder(true,\'super\')'}
    ]
  });
}
function startSurrogacyOrder(foreign){
  closeConsumeModal();
  if(!fertilitySurrogacyEligible())return;
  const cost=foreign?SURROGACY_FOREIGN:SURROGACY_LOCAL;
  const tag=(foreign?'国外':'国内')+'代孕';
  if(!spendCash(cost,tag))return;
  game.fertilityOrder={
    type:'surrogacy',foreign:!!foreign,spermTier:null,
    startWeek:game.week,dueWeek:game.week+FERTILITY_DELIVERY_WEEKS,cost:cost
  };
  game.procreateIntentWeek=-1;
  addStress(typeof STRESS_CHILD_BIRTH!=='undefined'?STRESS_CHILD_BIRTH:8,tag+' ');
  addLog('👶 '+tag+' 已启动 · 预计 '+getDateStr(game.fertilityOrder.dueWeek)+' 交货（¥'+cost.toLocaleString()+'）','success');
  renderSpendingPanel();updateUI();
}
function startIvfOrder(foreign,spermTier){
  closeConsumeModal();
  if(!fertilityIvfEligible())return;
  const base=foreign?IVF_FOREIGN:IVF_LOCAL;
  const sperm=spermTier==='super'?SPERM_SUPER:SPERM_NORMAL;
  const cost=base+sperm;
  const tag=(foreign?'国外':'国内')+'试管·'+(spermTier==='super'?'超级精子':'普通借精');
  if(!spendCash(cost,tag))return;
  game.fertilityOrder={
    type:'ivf',foreign:!!foreign,spermTier:spermTier==='super'?'super':'normal',
    startWeek:game.week,dueWeek:game.week+FERTILITY_DELIVERY_WEEKS,cost:cost
  };
  game.procreateIntentWeek=-1;
  addStress(typeof STRESS_CHILD_BIRTH!=='undefined'?STRESS_CHILD_BIRTH:8,'试管 ');
  addLog('🧪 '+tag+' 已启动 · 预计 '+getDateStr(game.fertilityOrder.dueWeek)+' 交货（¥'+cost.toLocaleString()+'）','success');
  renderSpendingPanel();updateUI();
}
function tickFertilityOrders(){
  if(!game||!game.fertilityOrder)return;
  const o=game.fertilityOrder;
  const remindWeek=o.dueWeek-(typeof WEEKS_PER_MONTH!=='undefined'?WEEKS_PER_MONTH:4);
  if(!o.reminded&&game.week>=remindWeek&&game.week<o.dueWeek){
    o.reminded=true;
    addLog('📅 提醒：'+fertilityOrderLabel(o)+' 约 1 个月后交货（'+getDateStr(o.dueWeek)+'）','info');
  }
  if(game.week>=o.dueWeek)completeFertilityOrder();
}
function completeFertilityOrder(){
  if(!game||!game.fertilityOrder)return;
  const o=game.fertilityOrder;
  game.fertilityOrder=null;
  game.hasChildren=true;
  game.childRaisingMonthsLeft=typeof CHILD_RAISING_MONTHS!=='undefined'?CHILD_RAISING_MONTHS:216;
  addLog('👶 '+fertilityOrderLabel(o)+' 完成 · 孩子降生！月生活费升至 ¥'+(typeof CHILD_LIVING_COST!=='undefined'?CHILD_LIVING_COST:8000).toLocaleString()+'（持续18年）','success');
  renderSpendingPanel();updateUI();
}
function setProcreateIntentNatural(){
  if(!game||game.gameOver||!fertilityNaturalProcreateEligible()){addLog('无法备孕','fail');return;}
  if(game.procreateIntentWeek===game.week){addLog('已在备孕中','warn');return;}
  if(!spendCash(PROC_CREATE_COST,'备孕'))return;
  game.procreateIntentWeek=game.week;
  addLog('🍼 备孕中（花费 ¥'+PROC_CREATE_COST+'）· 下次做爱怀孕率提升','info');
  showConsumeModal({
    icon:'🍼',title:'备孕中',
    html:'已花费 <b>¥'+PROC_CREATE_COST+'</b><br>本月下次做爱怀孕几率大幅提升',
    buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]
  });
  updateUI();
}
