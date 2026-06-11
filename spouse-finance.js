const SPOUSE_LOAN_INTIMACY_MIN=20;
const SPOUSE_LOAN_INTIMACY_GIFT=100;
const POCKET_MONEY_MIN=50;
const POCKET_MONEY_MAX=1000;

function migrateSpouseFinance(){
  if(!game)return;
  if(!game.spouseLoans)game.spouseLoans=[];
  if(game.lastPocketMoneyWeek==null)game.lastPocketMoneyWeek=-1;
}
function canUseSpouseFinance(){
  return !!(game&&game.married&&!game.divorced&&!game.gameOver);
}
function partnerDisplayName(){
  return game.partnerDisplayName||(typeof pickPartnerDisplayName==='function'?pickPartnerDisplayName(game.partnerGender||'female'):'伴侣');
}
function spouseIntimacyVal(){
  return game.spouseIntimacy!=null?game.spouseIntimacy:(typeof INTIMACY_INITIAL!=='undefined'?INTIMACY_INITIAL:80);
}
function getPartnerSavings(){
  if(!game||!game.companion)return 0;
  if(typeof liquidateActorPortfolio==='function')liquidateActorPortfolio(game.companion);
  return Math.max(0,game.companion.cash||0);
}
function activeSpouseLoans(){
  if(!game||!game.spouseLoans)return [];
  return game.spouseLoans.filter(l=>l.status==='pending'||l.status==='overdue');
}
function getSpouseLoanCalendarEntries(){
  if(!game||!game.spouseLoans)return [];
  return game.spouseLoans.filter(l=>
    (l.status==='pending'||l.status==='overdue')&&!l.noRepay&&l.dueWeek!=null
  ).sort((a,b)=>a.dueWeek-b.dueWeek);
}
function renderSpouseLoanCalList(loans){
  if(!loans||!loans.length)return '';
  const pn=partnerDisplayName();
  let html='<div class="cal-planned-list cal-spouse-loan-list" onclick="event.stopPropagation()"><div class="cal-planned-hdr cal-spouse-loan-hdr">伴侣借款 · 待归还（'+loans.length+'）</div>';
  loans.forEach(l=>{
    const overdue=l.status==='overdue'||game.week>=l.dueWeek;
    html+='<div class="cal-planned-row'+(overdue?' cal-spouse-overdue':'')+'">'+
      getDateStr(l.dueWeek)+' · ¥'+l.amount.toLocaleString()+' · '+pn+
      (overdue?' · <b style="color:var(--red)">已逾期</b>':'')+
      ' <button type="button" class="btn" style="font-size:.62rem;padding:1px 6px;margin-left:4px" onclick="event.stopPropagation();repaySpouseLoan(\''+l.id+'\')">还款</button></div>';
  });
  return html+'</div>';
}
function renderSpouseFinanceCompanionHtml(){
  if(!canUseSpouseFinance())return '';
  const pn=partnerDisplayName();
  const savings=getPartnerSavings();
  const intim=spouseIntimacyVal();
  const pocketUsed=game.lastPocketMoneyWeek===game.week;
  let html='<div class="companion-section"><h4>财务</h4>'+
    '<div class="companion-row"><span>'+pn+'储蓄</span><span>¥'+savings.toLocaleString()+'</span></div>';
  const loans=activeSpouseLoans();
  if(loans.length){
    html+='<div style="font-size:.68rem;color:var(--muted);margin:4px 0">待还借款</div>';
    loans.forEach(l=>{
      const overdue=l.status==='overdue'||game.week>=l.dueWeek;
      html+='<div class="companion-row"><span>¥'+l.amount.toLocaleString()+'</span><span style="color:'+(overdue?'var(--red)':'var(--yellow)')+'">'+
        getDateStr(l.dueWeek)+(overdue?' · 已逾期':'')+
        ' <button class="btn" style="font-size:.65rem;padding:2px 6px" onclick="repaySpouseLoan(\''+l.id+'\')">归还</button></span></div>';
    });
  }
  html+='<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px">'+
    '<button class="btn" '+(pocketUsed?'disabled':'')+' onclick="askSpousePocketMoney()">要零花钱</button>'+
    '<button class="btn" onclick="promptSpouseLoan()">理财借钱</button></div>'+
    '<div style="font-size:.62rem;color:var(--muted);margin-top:4px">零花钱随机¥'+POCKET_MONEY_MIN+'-'+POCKET_MONEY_MAX+'/周 · 借钱亲密度&lt;20必拒 · &gt;100可免还</div></div>';
  return html;
}
function askSpousePocketMoney(){
  if(!canUseSpouseFinance())return;
  if(game.lastPocketMoneyWeek===game.week){
    addLog('本周已经向伴侣要过零花钱了','warn');
    return;
  }
  const pn=partnerDisplayName();
  const intim=spouseIntimacyVal();
  if(intim<SPOUSE_LOAN_INTIMACY_MIN){
    addLog('💸 '+pn+' 拒绝了：亲密度太低（<'+SPOUSE_LOAN_INTIMACY_MIN+'）','fail');
    return;
  }
  const savings=getPartnerSavings();
  if(savings<POCKET_MONEY_MIN){
    addLog('💸 '+pn+' 手头紧，拿不出零花钱','warn');
    return;
  }
  const want=POCKET_MONEY_MIN+Math.floor(Math.random()*(POCKET_MONEY_MAX-POCKET_MONEY_MIN+1));
  const give=Math.min(want,savings);
  game.companion.cash-=give;
  game.cash+=give;
  game.money+=give;
  if(typeof ledgerAddIncome==='function')ledgerAddIncome('family','💵',pn+'零花钱',give);
  game.lastPocketMoneyWeek=game.week;
  addLog('💵 '+pn+' 给了零花钱 ¥'+give.toLocaleString(),'success');
  if(typeof checkCashStressMilestones==='function')checkCashStressMilestones();
  if(typeof renderCompanionPanel==='function')renderCompanionPanel();
  if(typeof updateUI==='function')updateUI();
  else if(typeof autoSaveSlot==='function')autoSaveSlot();
}
function promptSpouseLoan(){
  if(!canUseSpouseFinance())return;
  const pn=partnerDisplayName();
  const intim=spouseIntimacyVal();
  const savings=getPartnerSavings();
  let note='';
  if(intim<SPOUSE_LOAN_INTIMACY_MIN)note='<span style="color:var(--red)">亲密度&lt;'+SPOUSE_LOAN_INTIMACY_MIN+'，对方肯定不会借</span><br>';
  else if(intim>SPOUSE_LOAN_INTIMACY_GIFT)note='<span style="color:var(--green)">亲密度&gt;'+SPOUSE_LOAN_INTIMACY_GIFT+'，同意后可不用归还</span><br>';
  else note='<span style="color:var(--muted)">同意须于约定期限归还 · 逾期亲密度-20</span><br>';
  showConsumeModal({
    icon:'💰',title:'向'+pn+'借钱（理财）',
    html:note+pn+'储蓄约 <b>¥'+savings.toLocaleString()+'</b> · 亲密度 <b>'+intim+'</b><br>'+
      '金额 <input type="number" id="spouseLoanAmt" min="1" step="100" value="'+Math.min(1000,Math.max(100,savings))+'" style="width:120px;margin-top:6px;background:var(--bg);color:var(--text);border:1px solid var(--border);padding:4px 6px;border-radius:4px">',
    buttons:[
      {text:'取消',fn:'closeConsumeModal()'},
      {text:'开口借',primary:true,fn:'submitSpouseLoanRequest()'}
    ]
  });
}
function submitSpouseLoanRequest(){
  const el=document.getElementById('spouseLoanAmt');
  const amt=Math.floor(Number(el&&el.value)||0);
  closeConsumeModal();
  if(amt<=0){addLog('借款金额无效','fail');return;}
  processSpouseLoanRequest(amt);
}
function spouseLoanApprovalChance(amt,intim,savings){
  if(intim<SPOUSE_LOAN_INTIMACY_MIN)return 0;
  const ratio=savings>0?amt/savings:1;
  if(intim>SPOUSE_LOAN_INTIMACY_GIFT)return Math.max(0.35,Math.min(0.96,0.95-ratio*0.45));
  const base=0.08+(intim-SPOUSE_LOAN_INTIMACY_MIN)/(SPOUSE_LOAN_INTIMACY_GIFT-SPOUSE_LOAN_INTIMACY_MIN)*0.62;
  return Math.max(0.06,Math.min(0.88,base-ratio*0.5));
}
function processSpouseLoanRequest(amt){
  if(!canUseSpouseFinance())return;
  const pn=partnerDisplayName();
  const intim=spouseIntimacyVal();
  if(intim<SPOUSE_LOAN_INTIMACY_MIN){
    addLog('💰 '+pn+' 拒绝了：亲密度太低（<'+SPOUSE_LOAN_INTIMACY_MIN+'）','fail');
    return;
  }
  const savings=getPartnerSavings();
  if(amt>savings){
    addLog('💰 '+pn+' 储蓄不足，借不了 ¥'+amt.toLocaleString(),'fail');
    return;
  }
  const prob=spouseLoanApprovalChance(amt,intim,savings);
  if(Math.random()>=prob){
    addLog('💰 '+pn+' 不同意借 ¥'+amt.toLocaleString(),'warn');
    if(typeof adjustSpouseIntimacy==='function')adjustSpouseIntimacy(-1,'被拒借钱 ');
    return;
  }
  const noRepay=intim>SPOUSE_LOAN_INTIMACY_GIFT;
  game.companion.cash-=amt;
  game.cash+=amt;
  game.money+=amt;
  if(noRepay){
    if(typeof ledgerAddIncome==='function')ledgerAddIncome('family','💰',pn+'资助（免还）',amt);
    addLog('💰 '+pn+' 同意给你 ¥'+amt.toLocaleString()+'（亲密度>'+SPOUSE_LOAN_INTIMACY_GIFT+'，不必归还）','success');
  }else{
    const dueWeeks=2+Math.floor(Math.random()*7);
    const dueWeek=game.week+dueWeeks;
    if(!game.spouseLoans)game.spouseLoans=[];
    game.spouseLoans.push({
      id:'sloan_'+game.week+'_'+Math.floor(Math.random()*9999),
      amount:amt,borrowWeek:game.week,dueWeek,
      status:'pending',noRepay:false,remindWeek:null,penalized:false
    });
    if(typeof ledgerAddIncome==='function')ledgerAddIncome('family','💰','借自'+pn,amt);
    addLog('💰 '+pn+' 借你 ¥'+amt.toLocaleString()+' · 须在 '+getDateStr(dueWeek)+' 前归还（已记入日历）','info');
  }
  if(typeof checkCashStressMilestones==='function')checkCashStressMilestones();
  if(typeof renderCompanionPanel==='function')renderCompanionPanel();
  if(typeof updateUI==='function')updateUI();
  else if(typeof autoSaveSlot==='function')autoSaveSlot();
}
function repaySpouseLoan(loanId){
  if(!game||!game.spouseLoans)return;
  const loan=game.spouseLoans.find(l=>l.id===loanId&&(l.status==='pending'||l.status==='overdue'));
  if(!loan||loan.noRepay)return;
  if(game.cash<loan.amount){
    addLog('现金不足，无法归还 ¥'+loan.amount.toLocaleString(),'fail');
    return;
  }
  const pn=partnerDisplayName();
  game.cash-=loan.amount;
  if(game.companion)game.companion.cash=(game.companion.cash||0)+loan.amount;
  if(typeof ledgerAddExpense==='function')ledgerAddExpense('family','💰','归还'+pn+'借款',loan.amount,false);
  loan.status='repaid';
  addLog('✅ 已归还 '+pn+' ¥'+loan.amount.toLocaleString(),'success');
  if(typeof renderCompanionPanel==='function')renderCompanionPanel();
  if(typeof updateUI==='function')updateUI();
  else if(typeof autoSaveSlot==='function')autoSaveSlot();
}
function tickSpouseLoans(){
  if(!game||!game.spouseLoans||!game.spouseLoans.length)return;
  if(!game.married||game.divorced)return;
  const pn=partnerDisplayName();
  game.spouseLoans.forEach(loan=>{
    if(loan.noRepay||loan.status==='repaid'||loan.status==='forgiven')return;
    if(loan.status!=='pending'&&loan.status!=='overdue')return;
    if(!loan.penalized&&loan.dueWeek!=null&&game.week===loan.dueWeek-1&&!loan.remindWeek){
      loan.remindWeek=game.week;
      addLog('📅 提醒：须在 '+getDateStr(loan.dueWeek)+' 前归还 '+pn+' ¥'+loan.amount.toLocaleString()+'（还剩约7天）','warn');
    }
    if(!loan.penalized&&loan.dueWeek!=null&&game.week>=loan.dueWeek&&loan.status==='pending'){
      loan.status='overdue';
      loan.penalized=true;
      if(typeof adjustSpouseIntimacy==='function')adjustSpouseIntimacy(-20,'未按时还钱 ');
      addLog('💔 未在 '+getDateStr(loan.dueWeek)+' 前归还 '+pn+' ¥'+loan.amount.toLocaleString()+' · 亲密度-20','fail');
    }
  });
  game.spouseLoans=game.spouseLoans.filter(l=>{
    if(l.status==='pending'||l.status==='overdue')return true;
    return l.dueWeek!=null&&game.week-l.dueWeek<12;
  });
}
