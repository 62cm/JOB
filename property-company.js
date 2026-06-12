const MORTGAGE_LUMP_PAYOFF = 3000000;
const VILLA_PRICE = 10000000;
const COMPANY_FOUND_PRICE = 50000000;
const VILLA_BUTLER_MONTHLY = 100000;
const COMPANY_STAFF_MONTHLY = 200000;

function migratePropertyCompany(){
  if(!game)return;
  if(game.propertyPanelOpen==null)game.propertyPanelOpen=false;
  if(game.villaOwned==null)game.villaOwned=false;
  if(!game.playerCompany)game.playerCompany=null;
  else{
    const pc=game.playerCompany;
    if(!pc.acquisitions)pc.acquisitions={player:null,companion:null};
    if(!pc.holdings)pc.holdings=[];
    if(!pc.recruitInbox)pc.recruitInbox=[];
    if(!pc.jobPosts)pc.jobPosts=[];
    if(pc.foundedWeek==null)pc.foundedWeek=game.week||0;
  }
}
function hasVilla(){return !!(game&&game.villaOwned)}
function hasPlayerCompany(){return !!(game&&game.playerCompany&&game.playerCompany.founded)}
function ensurePlayerCompany(){
  if(!game)return null;
  migratePropertyCompany();
  if(!game.playerCompany){
    game.playerCompany={founded:false,foundedWeek:0,acquisitions:{player:null,companion:null},holdings:[],recruitInbox:[],jobPosts:[]};
  }
  return game.playerCompany;
}
function togglePropertyPanel(){
  if(!game)return;
  game.propertyPanelOpen=!game.propertyPanelOpen;
  if(typeof applyPropertyPanelFold==='function')applyPropertyPanelFold();
}
function applyPropertyPanelFold(){
  if(!game)return;
  const open=!!game.propertyPanelOpen;
  const body=document.querySelector('#dailyPanel .property-fold-body');
  const chev=document.querySelector('#dailyPanel .property-fold-chev');
  const meta=document.querySelector('#dailyPanel .property-fold-cur');
  if(body)body.style.display=open?'block':'none';
  if(chev)chev.textContent=open?'▼':'▶';
  if(meta)meta.style.display=open?'':'none';
}
function mortgageLumpPayoffRemaining(){
  if(!game||!game.ownsHome||game.mortgagePaidOff)return 0;
  return MORTGAGE_LUMP_PAYOFF;
}
function payMortgageLumpSum(){
  if(!game||game.gameOver)return;
  if(!game.ownsHome||game.mortgagePaidOff){addLog('房贷已还清或暂无房贷','warn');return}
  const need=mortgageLumpPayoffRemaining();
  if(game.cash<need){addLog('提前还清需 ¥'+need.toLocaleString()+'，现金不足','fail');return}
  if(!confirm('一次性提前还清房贷？\n需支付 ¥'+need.toLocaleString()))return;
  game.cash-=need;
  game.mortgagePaidOff=true;
  game.mortgagePaymentsMade=typeof MORTGAGE_MONTHS!=='undefined'?MORTGAGE_MONTHS:360;
  if(typeof ledgerAddExpense==='function')ledgerAddExpense('housing','🏠','房贷一次性还清',need,false);
  addLog('🏠 已一次性还清房贷 ¥'+need.toLocaleString(),'success');
  if(typeof checkVictory==='function')checkVictory();
  if(typeof renderDailyPanel==='function')renderDailyPanel();
  if(typeof updateUI==='function')updateUI();
  if(typeof autoSaveSlot==='function')autoSaveSlot();
}
function buyVilla(){
  if(!game||game.gameOver)return;
  if(game.villaOwned){addLog('已拥有别墅','warn');return}
  if(game.cash<VILLA_PRICE){addLog('购买别墅需 ¥'+VILLA_PRICE.toLocaleString()+'，现金不足','fail');return}
  if(!confirm('购买别墅（花园·泳池·管家）？\n¥'+VILLA_PRICE.toLocaleString()+' · 每月管家 ¥'+VILLA_BUTLER_MONTHLY.toLocaleString()))return;
  game.cash-=VILLA_PRICE;
  game.villaOwned=true;
  if(typeof ledgerAddExpense==='function')ledgerAddExpense('housing','🏡','购置别墅',VILLA_PRICE,false);
  addLog('🏡 购入别墅 · 花园泳池 · 管家月费 ¥'+VILLA_BUTLER_MONTHLY.toLocaleString(),'success');
  if(typeof renderDailyPanel==='function')renderDailyPanel();
  if(typeof updateUI==='function')updateUI();
  if(typeof autoSaveSlot==='function')autoSaveSlot();
}
function foundPlayerCompany(){
  if(!game||game.gameOver)return;
  if(hasPlayerCompany()){addLog('已拥有自己的公司','warn');return}
  if(game.cash<COMPANY_FOUND_PRICE){addLog('开公司需 ¥'+COMPANY_FOUND_PRICE.toLocaleString()+'，现金不足','fail');return}
  if(!confirm('注册自己的公司？\n¥'+COMPANY_FOUND_PRICE.toLocaleString()+' · 含保镖司机团队 · 月费 ¥'+COMPANY_STAFF_MONTHLY.toLocaleString()))return;
  game.cash-=COMPANY_FOUND_PRICE;
  const pc=ensurePlayerCompany();
  pc.founded=true;
  pc.foundedWeek=game.week||0;
  pc.acquisitions={player:null,companion:null};
  pc.holdings=[];
  pc.recruitInbox=[];
  pc.jobPosts=[];
  if(typeof ledgerAddExpense==='function')ledgerAddExpense('business','🏢','注册公司',COMPANY_FOUND_PRICE,false);
  addLog('🏢 公司成立 · 可收购就职企业 · 招聘邮箱已开通 · 月费 ¥'+COMPANY_STAFF_MONTHLY.toLocaleString(),'success');
  if(typeof renderDailyPanel==='function')renderDailyPanel();
  if(typeof updateUI==='function')updateUI();
  if(typeof autoSaveSlot==='function')autoSaveSlot();
}
function findStockForCompany(co){
  if(!co||!game||!game.stocks)return null;
  const name=(co.name||'').replace(/\s/g,'');
  let hit=game.stocks.find(s=>name.indexOf(s.name)>=0||s.name.indexOf(name.slice(0,Math.min(4,name.length)))>=0);
  if(hit)return hit;
  const short=name.replace(/[（(].*?[）)]/g,'').replace(/股份|集团|有限|公司/g,'');
  hit=game.stocks.find(s=>short.indexOf(s.name)>=0||s.name.indexOf(short.slice(0,2))>=0);
  return hit||null;
}
function companyScaleMult(scale){
  return {large:12,medium:6,small:3}[scale]||4;
}
function companyAcquisitionPrice(co){
  if(!co)return 0;
  const st=findStockForCompany(co);
  const sm=companyScaleMult(co.scale);
  const tm={high:1.4,mid:1.15,low:1}[co.tier]||1;
  if(st)return Math.round(st.price*80000*sm*tm);
  return Math.round(5000000*sm*tm);
}
function companySellValuation(){
  const pc=game&&game.playerCompany;
  if(!pc||!pc.founded)return 0;
  let v=COMPANY_FOUND_PRICE*0.35;
  (pc.holdings||[]).forEach(h=>{
    const st=game.stocks&&game.stocks.find(x=>x.symbol===h.symbol);
    if(st&&h.shares)v+=st.price*h.shares;
  });
  return Math.round(v);
}
function playerEmployerCompany(){
  if(!game||!game.employed||!game.employment||!game.employment.company)return null;
  return game.employment.company;
}
function companionEmployerCompany(){
  const c=game&&game.companion;
  if(!c||!c.employed||!c.employment||!c.employment.company)return null;
  return c.employment.company;
}
function playerEmployerAcquired(){
  const pc=game&&game.playerCompany;
  if(!pc||!pc.founded||!pc.acquisitions)return false;
  const co=playerEmployerCompany();
  return !!(co&&pc.acquisitions.player===co.id);
}
function companionEmployerAcquired(){
  const pc=game&&game.playerCompany;
  if(!pc||!pc.founded||!pc.acquisitions)return false;
  const co=companionEmployerCompany();
  return !!(co&&pc.acquisitions.companion===co.id);
}
function playerEmployerOwnerImmune(){return playerEmployerAcquired()}
function companionEmployerOwnerImmune(){return companionEmployerAcquired()}
function addCompanyHolding(co){
  const pc=ensurePlayerCompany();
  const st=findStockForCompany(co);
  if(!st)return;
  const shares=Math.max(10000,Math.round(companyAcquisitionPrice(co)/st.price));
  const exist=pc.holdings.find(h=>h.symbol===st.symbol);
  if(exist)exist.shares+=shares;
  else pc.holdings.push({symbol:st.symbol,name:st.name,shares,lastPrice:st.price,companyId:co.id,companyName:co.name});
}
function acquireEmployerCompany(who){
  if(!hasPlayerCompany()){addLog('请先注册自己的公司','fail');return}
  const pc=ensurePlayerCompany();
  const co=who==='companion'?companionEmployerCompany():playerEmployerCompany();
  if(!co){addLog(who==='companion'?'伴侣当前无业，无法收购':'你当前无业，无法收购','fail');return}
  const key=who==='companion'?'companion':'player';
  if(pc.acquisitions[key]===co.id){addLog('该企业已收购','warn');return}
  const price=companyAcquisitionPrice(co);
  if(game.cash<price){addLog('收购 '+co.name+' 需 ¥'+price.toLocaleString()+'，现金不足','fail');return}
  if(!confirm('收购「'+co.name+'」？\n估价 ¥'+price.toLocaleString()+(findStockForCompany(co)?'（参考股价×规模）':'（未上市按规模估算）')))return;
  game.cash-=price;
  pc.acquisitions[key]=co.id;
  addCompanyHolding(co);
  if(typeof ledgerAddExpense==='function')ledgerAddExpense('business','🏢','收购 '+co.name,price,false);
  const pn=who==='companion'?(game.partnerDisplayName||'伴侣'):'你';
  addLog('🏢 已收购 '+co.name+' · '+pn+'可不去上班且不会被辞退','success');
  if(typeof renderDailyPanel==='function')renderDailyPanel();
  if(typeof updateUI==='function')updateUI();
  if(typeof autoSaveSlot==='function')autoSaveSlot();
}
function sellPlayerCompany(){
  const pc=game&&game.playerCompany;
  if(!pc||!pc.founded){addLog('尚未拥有公司','fail');return}
  const val=companySellValuation();
  if(!confirm('出售公司？\n按当前持股与市值估算约 ¥'+val.toLocaleString()))return;
  game.cash+=val;
  if(typeof ledgerAddIncome==='function')ledgerAddIncome('business','🏢','出售公司',val);
  game.playerCompany=null;
  addLog('🏢 公司已出售 · 到账约 ¥'+val.toLocaleString(),'info');
  if(typeof renderDailyPanel==='function')renderDailyPanel();
  if(typeof updateUI==='function')updateUI();
  if(typeof autoSaveSlot==='function')autoSaveSlot();
}
function postCompanyJob(){
  const pc=ensurePlayerCompany();
  if(!pc.founded)return;
  const titles=['市场专员','行政助理','财务分析','产品经理','研发工程师','品牌策划','客户成功','运营主管'];
  const title=titles[Math.floor(Math.random()*titles.length)];
  pc.jobPosts.push({id:'jp_'+game.week+'_'+pc.jobPosts.length,title:title,week:game.week,active:true});
  addLog('📧 已发布岗位「'+title+'」· 下周起收简历','success');
  if(typeof renderDailyPanel==='function')renderDailyPanel();
}
function tickCompanyRecruitment(){
  const pc=game&&game.playerCompany;
  if(!pc||!pc.founded||!pc.jobPosts||!pc.jobPosts.length)return;
  pc.recruitInbox=pc.recruitInbox||[];
  pc.jobPosts.filter(p=>p.active).forEach(post=>{
    const n=5+Math.floor(Math.random()*11);
    for(let i=0;i<n;i++){
      const gender=Math.random()<0.5?'male':'female';
      const age=22+Math.floor(Math.random()*16);
      const name=typeof pickStrangerDisplayName==='function'?pickStrangerDisplayName(gender):'应聘者';
      pc.recruitInbox.unshift({
        id:'cv_'+game.week+'_'+Math.random().toString(36).slice(2,8),
        week:game.week,postId:post.id,title:post.title,name,age,gender,
        edu:['本科','硕士','大专','高中'][Math.floor(Math.random()*4)],
        exp:1+Math.floor(Math.random()*12),read:false
      });
    }
  });
  if(pc.recruitInbox.length>80)pc.recruitInbox=pc.recruitInbox.slice(0,80);
}
function tickPlayerCompanyStockWealth(){
  const pc=game&&game.playerCompany;
  if(!pc||!pc.founded||!pc.holdings||!pc.holdings.length||!game.stocks)return;
  let delta=0;
  pc.holdings.forEach(h=>{
    const st=game.stocks.find(x=>x.symbol===h.symbol);
    if(!st||!h.shares)return;
    const prev=h.lastPrice!=null?h.lastPrice:st.prevPrice||st.price;
    delta+=(st.price-prev)*h.shares;
    h.lastPrice=st.price;
  });
  if(Math.abs(delta)>=1){
    game.cash+=delta;
    if(typeof ledgerAddIncome==='function'&&delta>0)ledgerAddIncome('business','📈','持股市值变动',delta);
    else if(typeof ledgerAddExpense==='function'&&delta<0)ledgerAddExpense('business','📉','持股市值变动',-delta,false);
    addLog((delta>=0?'📈 持股浮盈兑现 ':'📉 持股浮亏 ') +'¥'+Math.abs(Math.round(delta)).toLocaleString(),delta>=0?'info':'warn');
  }
}
function appendPropertyMonthlyExpenses(exp){
  if(!game||!exp)return;
  if(game.villaOwned){
    exp.total=(exp.total||0)+VILLA_BUTLER_MONTHLY;
    exp.living=(exp.living||0)+VILLA_BUTLER_MONTHLY;
    exp.label=(exp.label||'')+' · 别墅管家';
  }
  if(hasPlayerCompany()){
    exp.total=(exp.total||0)+COMPANY_STAFF_MONTHLY;
    exp.living=(exp.living||0)+COMPANY_STAFF_MONTHLY;
    exp.label=(exp.label||'')+' · 公司团队';
  }
}
function propertyStatusLabel(){
  const bits=[];
  if(game.villaOwned)bits.push('别墅');
  if(hasPlayerCompany())bits.push('自有公司');
  if(game.mortgagePaidOff&&game.ownsHome&&!game.villaOwned)bits.push('房贷已清');
  return bits.length?bits.join(' · '):'';
}
function renderPropertyPanel(){
  if(!game)return '';
  migratePropertyCompany();
  const open=!!game.propertyPanelOpen;
  const status=propertyStatusLabel();
  let h='<div class="property-fold phone-fold"><div class="phone-fold-hdr" onclick="togglePropertyPanel()"><b>购房 / 公司</b>';
  h+='<span class="property-fold-cur phone-fold-cur fold-meta"'+(open?'':' style="display:none"')+'>'+(status?' · '+status:'')+'</span>';
  h+='<span class="phone-fold-chev property-fold-chev" style="margin-left:auto;color:var(--muted)">'+(open?'▼':'▶')+'</span></div>';
  h+='<div class="phone-fold-body property-fold-body"'+(open?'':' style="display:none"')+'>';
  if(game.ownsHome&&!game.mortgagePaidOff){
    const need=mortgageLumpPayoffRemaining();
    h+='<button class="btn btn-phone-shop" onclick="payMortgageLumpSum()">💰 房贷一次性还清 ¥'+(need/10000).toFixed(0)+'万</button><br>';
  }else if(game.mortgagePaidOff)h+='<p class="fold-meta" style="color:var(--green)">房贷已还清</p>';
  if(!game.villaOwned){
    h+='<button class="btn btn-phone-shop" onclick="buyVilla()">🏡 购买别墅 ¥'+(VILLA_PRICE/10000)+'万 · 花园泳池</button><br>';
  }else h+='<p class="fold-meta" style="color:var(--green)">已拥有别墅 · 管家 ¥'+(VILLA_BUTLER_MONTHLY/10000)+'万/月</p>';
  if(!hasPlayerCompany()){
    h+='<button class="btn btn-phone-shop" onclick="foundPlayerCompany()">🏢 开公司 ¥'+(COMPANY_FOUND_PRICE/10000)+'万</button>';
    h+='<p class="fold-meta">含保镖司机 · 月费 ¥'+(COMPANY_STAFF_MONTHLY/10000)+'万 · 可收购就职企业</p>';
  }else{
    const pc=game.playerCompany;
    h+='<p class="fold-meta" style="color:var(--green);margin-top:6px">🏢 自有公司 · 团队月费 ¥'+(COMPANY_STAFF_MONTHLY/10000)+'万</p>';
    const pCo=playerEmployerCompany(),cCo=companionEmployerCompany();
    if(pCo){
      const got=pc.acquisitions.player===pCo.id;
      h+='<div style="margin:4px 0">'+(got?'✓ ':'')+'<b>你的单位</b> '+pCo.name+' · 收购价 ¥'+companyAcquisitionPrice(pCo).toLocaleString();
      if(!got)h+=' <button class="btn" style="font-size:.65rem;padding:2px 6px" onclick="acquireEmployerCompany(\'player\')">收购</button>';
      h+='</div>';
    }
    if(cCo){
      const got=pc.acquisitions.companion===cCo.id;
      const pn=game.partnerDisplayName||'伴侣';
      h+='<div style="margin:4px 0">'+(got?'✓ ':'')+'<b>'+pn+'单位</b> '+cCo.name+' · 收购价 ¥'+companyAcquisitionPrice(cCo).toLocaleString();
      if(!got)h+=' <button class="btn" style="font-size:.65rem;padding:2px 6px" onclick="acquireEmployerCompany(\'companion\')">收购</button>';
      h+='</div>';
    }
    if(pc.holdings&&pc.holdings.length){
      h+='<p class="fold-meta">持股：'+pc.holdings.map(x=>x.name+' '+Math.round(x.shares/1000)/10+'万股').join(' · ')+'</p>';
    }
    h+='<button class="btn" style="margin-top:4px" onclick="postCompanyJob()">📧 发布招聘岗位</button> ';
    h+='<button class="btn" onclick="sellPlayerCompany()">出售公司</button>';
    const inbox=(pc.recruitInbox||[]).filter(x=>!x.read);
    h+='<div class="company-recruit-inbox" style="margin-top:8px"><b>招聘邮箱</b>（未读 '+(inbox.length)+'）</div>';
    if(!pc.recruitInbox||!pc.recruitInbox.length)h+='<p class="fold-meta">发布岗位后，每周会收到应聘者简历</p>';
    else{
      h+='<div style="max-height:120px;overflow-y:auto;font-size:.68rem;margin-top:4px">';
      pc.recruitInbox.slice(0,12).forEach(r=>{
        h+='<div style="padding:3px 0;border-bottom:1px dashed var(--border)">'+
          (r.read?'':'<span style="color:var(--blue)">● </span>')+
          '<b>'+r.name+'</b> '+r.age+'岁 · '+r.edu+' · 应聘'+r.title+' · '+r.exp+'年经验</div>';
        r.read=true;
      });
      h+='</div>';
    }
  }
  h+='</div></div>';
  return h;
}
function renderVillaHomeExtras(prefix){
  if(!hasVilla())return '';
  const d=game.daily||{};
  const dis=!!(typeof dailySlotHoursLeft==='function'&&dailySlotHoursLeft()<=0);
  const partyUsed=!!d.villaPartyUsed;
  const lbl=(t)=>(d.phase==='allnight'&&typeof allnightBtnLabel==='function')?allnightBtnLabel(t):t;
  const mk=(act,label,off)=>'<button class="btn" '+(off?'disabled':'')+' onclick="dailyPick'+prefix+'(\''+act+'\')">'+lbl(label)+'</button> ';
  let h='<p class="fold-meta" style="color:var(--green)">🏡 别墅 · 花园与泳池</p>';
  h+=mk('villa_tea','🍵 院子喝茶1h',dis);
  h+=mk('villa_swim','🏊 游泳1h',dis);
  h+=mk('villa_party','🎉 开派对（耗尽今日·每日1次）',partyUsed||dis);
  return h;
}
function dailyVillaTea(){
  if(!hasVilla())return;
  if(typeof dailyCanUseHours==='function'&&!dailyCanUseHours(1))return;
  if(typeof addStress==='function')addStress(-5,'喝茶 ');
  if(typeof addTempStat==='function')addTempStat('spirit',5,'🍵 院子喝茶 ');
  if(typeof dailyAddHours==='function')dailyAddHours(1,false);
  if(typeof showConsumeModal==='function')showConsumeModal({icon:'🍵',title:'院子喝茶',html:'压力 <b>-5</b> · 临时精神 <b>+5</b>',buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
  addLog('🍵 在院子喝茶 · 压力-5 · 临时精神+5','info');
}
function dailyVillaSwim(){
  if(!hasVilla())return;
  if(typeof dailyCanUseHours==='function'&&!dailyCanUseHours(1))return;
  if(typeof addStress==='function')addStress(-5,'游泳 ');
  if(typeof addTempStat==='function')addTempStat('body',5,'🏊 游泳 ');
  if(typeof dailyAddHours==='function')dailyAddHours(1,false);
  if(typeof showConsumeModal==='function')showConsumeModal({icon:'🏊',title:'游泳',html:'压力 <b>-5</b> · 临时肉体 <b>+5</b>',buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
  addLog('🏊 泳池畅游 · 压力-5 · 临时肉体+5','info');
}
function villaPartyMeetPeople(){
  const n=4+Math.floor(Math.random()*5);
  const people=[];
  for(let i=0;i<n;i++){
    if(typeof createAffairContact==='function'){
      const c=createAffairContact('别墅派对',null,{silent:true});
      if(c)people.push(c);
    }
  }
  return people;
}
function dailyVillaParty(){
  if(!hasVilla())return;
  const d=typeof ensureDailyState==='function'?ensureDailyState():game.daily;
  if(!d)return;
  if(d.villaPartyUsed){addLog('今天已办过别墅派对（每日限1次）','fail');return}
  d.villaPartyUsed=true;
  d.subMenu=null;
  const met=villaPartyMeetPeople();
  if(typeof addStress==='function')addStress(-8,'派对 ');
  const ph=d.phase;
  const total=typeof SLOT_HOURS_TOTAL!=='undefined'?SLOT_HOURS_TOTAL:8;
  if(ph==='morning'){
    if(typeof shouldMarkWorkSkipNow==='function'&&shouldMarkWorkSkipNow()&&typeof markWorkSkipForPhase==='function')markWorkSkipForPhase();
    d.phase='evening';
    d.eveningEndModalShown=false;
    d.partnerCatchUpSleep=false;
    if(typeof resetDailySlotFlags==='function')resetDailySlotFlags();
    if(game.employed&&typeof isScheduledWorkSlot==='function'&&isScheduledWorkSlot('evening')&&!d.eveningShiftDone){
      if(typeof recordMonthlyAbsence==='function')recordMonthlyAbsence('白天派对未上班');
      d.workSkipDays=(d.workSkipDays||0)+1;
      d.eveningShiftDone=true;
      addLog('🛋 晚上未上班（派对耗尽今日 · 本周第'+d.workSkipDays+'天）','warn');
    }
    d.slotHoursUsed=total;
  }else if(ph==='evening'){
    d.slotHoursUsed=total;
  }else if(ph==='allnight'){
    d.slotHoursUsed=total;
  }
  const showPartySummary=function(){
    const metHtml=met.length?('<br>认识了 <b>'+met.length+'</b> 人：'+met.map(function(p){return p.name}).join('、')):'';
    if(typeof showConsumeModal==='function'){
      showConsumeModal({
        icon:'🎉',title:'别墅派对',
        html:'派对从'+({morning:'白天',evening:'晚上',allnight:'后半夜'}[ph]||'本时段')+'一直嗨到深夜…'+metHtml+'<br>压力 <b>-8</b><br><span class="fold-meta">今日日程已耗尽，请选择睡觉或通宵</span>',
        buttons:[{text:'继续',primary:true,fn:'closeConsumeModal()'}]
      });
    }
    addLog('🎉 别墅派对 · 认识 '+met.length+' 人 · 今日时间耗尽','success');
    if(ph==='allnight'&&typeof showAllnightExhaustedModal==='function'){
      setTimeout(function(){showAllnightExhaustedModal()},80);
    }
    if(typeof renderDailyPanel==='function')renderDailyPanel();
    if(typeof updateUI==='function')updateUI();
    if(typeof autoSaveSlot==='function')autoSaveSlot();
  };
  if(met.length&&typeof queueBatchMeetModals==='function'){
    queueBatchMeetModals(met,'别墅派对',showPartySummary);
  }else showPartySummary();
}
