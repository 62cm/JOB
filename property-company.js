const MORTGAGE_LUMP_PAYOFF = 3000000;
const VILLA_PRICE = 10000000;
const COMPANY_FOUND_PRICE = 50000000;
const COMPANY_PARTNER_FOUND_PRICE_REF = 10000;
const VILLA_BUTLER_MONTHLY = 100000;
const VILLA_FACILITY_COST = 2000000;
const VILLA_PARTY_TIERS = [
  {id:'small',label:'小型派对',cap:10,cost:100000,stress:-8},
  {id:'medium',label:'中型派对',cap:50,cost:200000,stress:-10},
  {id:'large',label:'大型派对',cap:100,cost:500000,stress:-12},
  {id:'super',label:'超级派对',cap:200,cost:1000000,stress:-15}
];
const COMPANY_STAFF_MONTHLY = 200000;

function migrateCompanyListedStockCodes(){
  if(!game||!game.companyAll)return;
  game.companyAll.forEach(function(co){
    if(!co.listedStockCode)co.listedStockCode=typeof resolveListedStockCodeFromCompanyName==='function'?resolveListedStockCodeFromCompanyName(co.name):null;
  });
}
function ensureStockInGame(symbol){
  if(!game||!symbol)return null;
  game.stocks=game.stocks||[];
  let st=game.stocks.find(function(x){return x.symbol===symbol;});
  if(st)return st;
  const listed=(typeof REAL_COMPANIES!=='undefined'&&REAL_COMPANIES.LISTED_STOCKS)||[];
  const ref=listed.find(function(x){return x.code===symbol;});
  if(!ref)return null;
  st={symbol:ref.code,id:'stk_'+ref.code,name:ref.name,category:ref.category,price:ref.price,prevPrice:ref.price,refPrice:ref.price,history:[ref.price]};
  game.stocks.push(st);
  return st;
}
function applyPlayerCompanyName(name){
  const pc=ensurePlayerCompany();
  const n=String(name||'').trim();
  if(!n)return false;
  pc.name=n;
  if(!pc.brandName)pc.brandName=n;
  if(pc.familiarity==null)pc.familiarity=5;
  if(pc.influence==null)pc.influence=3;
  if(game)game._companyNamePromptQueued=false;
  return true;
}
function queuePlayerCompanyNameModal(){
  const pc=ensurePlayerCompany();
  if(!pc.founded||pc.name){
    if(game)game._companyNamePromptQueued=false;
    return;
  }
  const overlay=document.getElementById('consumeOverlay');
  const existingInp=document.getElementById('playerCoNameInp');
  if(existingInp&&overlay&&!overlay.classList.contains('hidden')){
    setTimeout(function(){existingInp.focus();},0);
    return;
  }
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:'🏢',title:'请为公司命名',
      html:'<p class="fold-meta">已注册公司但尚未命名。请填写正式商号；<b>品牌熟悉度</b>与<b>影响力</b>将从此积累，<b>更名会重置</b>这两项数值。</p>'+
        '<input id="playerCoNameInp" type="text" maxlength="24" placeholder="如：海川智造集团" autocomplete="off" '+
        'style="width:100%;padding:8px;margin-top:8px;box-sizing:border-box;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text)">',
      buttons:[{text:'确认命名',primary:true,handler:function(){
        const inp=document.getElementById('playerCoNameInp');
        const v=inp&&inp.value?inp.value.trim():'';
        if(!v){addLog('请输入公司名称','fail');if(inp)setTimeout(function(){inp.focus();},0);return;}
        applyPlayerCompanyName(v);
        addLog('🏢 公司已命名为「'+v+'」 · 熟悉度 '+pc.familiarity+' · 影响力 '+pc.influence,'success');
        if(typeof closeConsumeModal==='function')closeConsumeModal(true);
        if(typeof renderDailyPanel==='function')renderDailyPanel();
        if(typeof updateUI==='function')updateUI();
        if(typeof autoSaveSlot==='function')autoSaveSlot();
      }}]
    });
    setTimeout(function(){
      const inp=document.getElementById('playerCoNameInp');
      if(!inp)return;
      inp.focus();
      inp.addEventListener('mousedown',function(e){e.stopPropagation();});
      inp.addEventListener('click',function(e){e.stopPropagation();});
    },0);
    return;
  }
  const n=prompt('请为你的公司命名','我的公司');
  if(applyPlayerCompanyName(n))addLog('🏢 公司已命名为「'+pc.name+'」','success');
}
function promptPlayerCompanyNameIfNeeded(){
  const pc=game&&game.playerCompany;
  if(!pc||!pc.founded||pc.name){
    if(game)game._companyNamePromptQueued=false;
    return;
  }
  if(game._companyNamePromptQueued)return;
  if(typeof consumeModalOpen!=='undefined'&&consumeModalOpen){
    const inp=document.getElementById('playerCoNameInp');
    if(inp){setTimeout(function(){inp.focus();},0);}
    return;
  }
  game._companyNamePromptQueued=true;
  setTimeout(function(){
    if(!game||!game.playerCompany||!game.playerCompany.founded||game.playerCompany.name){
      if(game)game._companyNamePromptQueued=false;
      return;
    }
    queuePlayerCompanyNameModal();
  },180);
}
function renamePlayerCompanyBrand(){
  if(!hasPlayerCompany())return;
  const pc=game.playerCompany;
  const cur=pc.brandName||pc.name||'';
  const existingInp=document.getElementById('playerCoBrandInp');
  const overlay=document.getElementById('consumeOverlay');
  if(existingInp&&overlay&&!overlay.classList.contains('hidden')){
    setTimeout(function(){existingInp.focus();},0);
    return;
  }
  let next;
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:'🏷',title:'公司品牌更名',
      html:'<p class="fold-meta">更名将重置品牌熟悉度（当前 '+pc.familiarity+'）与影响力（当前 '+pc.influence+'）</p>'+
        '<input id="playerCoBrandInp" type="text" maxlength="24" value="'+cur.replace(/"/g,'&quot;')+'" autocomplete="off" '+
        'style="width:100%;padding:8px;margin-top:8px;box-sizing:border-box;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text)">',
      buttons:[{text:'确认更名',primary:true,handler:function(){
        const inp=document.getElementById('playerCoBrandInp');
        next=inp&&inp.value?inp.value.trim():'';
        if(!next){addLog('请输入品牌名称','fail');if(inp)setTimeout(function(){inp.focus();},0);return;}
        pc.brandName=next;pc.name=next;pc.familiarity=5;pc.influence=3;
        addLog('🏷 品牌更名为「'+next+'」· 熟悉度与影响力已重置','info');
        if(typeof closeConsumeModal==='function')closeConsumeModal(true);
        if(typeof renderDailyPanel==='function')renderDailyPanel();
      }}]
    });
    setTimeout(function(){
      const inp=document.getElementById('playerCoBrandInp');
      if(!inp)return;
      inp.focus();
      inp.addEventListener('mousedown',function(e){e.stopPropagation();});
      inp.addEventListener('click',function(e){e.stopPropagation();});
    },0);
    return;
  }
  next=prompt('新品牌名称（更名将重置熟悉度与影响力）',cur);
  if(!next||!next.trim())return;
  pc.brandName=next.trim();pc.name=pc.brandName;pc.familiarity=5;pc.influence=3;
  addLog('🏷 品牌更名为「'+pc.brandName+'」','info');
}
function migratePropertyCompany(){
  if(!game)return;
  if(game.propertyPanelOpen==null)game.propertyPanelOpen=false;
  if(game.villaOwned==null)game.villaOwned=false;
  if(!game.villaFacilities)game.villaFacilities={library:false,meditation:false,cinema:false};
  if(!game.privateJet)game.privateJet={owned:false,grounded:false};
  if(!game.playerCompany)game.playerCompany=null;
  else{
    const pc=game.playerCompany;
    if(!pc.acquisitions||typeof pc.acquisitions!=='object'||Array.isArray(pc.acquisitions))pc.acquisitions={player:null,companion:null};
    if(!pc.holdings)pc.holdings=[];
    if(!Array.isArray(pc.subsidiaries))pc.subsidiaries=[];
    if(typeof normalizeCompanyIndustriesRaw==='function')normalizeCompanyIndustriesRaw(pc);
    if(!pc.recruitInbox)pc.recruitInbox=[];
    if(!pc.jobPosts)pc.jobPosts=[];
    if(pc.foundedWeek==null)pc.foundedWeek=game.week||0;
    if(pc.founded&&pc.name&&!pc.brandName)pc.brandName=pc.name;
    if(pc.founded&&pc.name&&pc.familiarity==null)pc.familiarity=5;
    if(pc.founded&&pc.name&&pc.influence==null)pc.influence=3;
    if(typeof migrateAcquiredSubsidiaries==='function')migrateAcquiredSubsidiaries(pc);
    if(typeof migratePlayerCompanyIpo==='function')migratePlayerCompanyIpo(pc);
  }
  migrateCompanyListedStockCodes();
}
function repairPlayerCompanyMinimal(){
  if(!game||!game.playerCompany)return;
  const pc=game.playerCompany;
  if(!pc.acquisitions)pc.acquisitions={player:null,companion:null};
  if(!pc.holdings)pc.holdings=[];
  if(!pc.recruitInbox)pc.recruitInbox=[];
  if(!pc.jobPosts)pc.jobPosts=[];
  if(!pc.staff)pc.staff=[];
  if(!pc.projects)pc.projects=[];
  if(!pc.weeklyReports)pc.weeklyReports=[];
  if(!pc.monthlyReports)pc.monthlyReports=[];
  if(!pc.industries)pc.industries=[];
  else if(typeof normalizeCompanyIndustriesRaw==='function')normalizeCompanyIndustriesRaw(pc);
  if(!pc.departments){
    const tpl=typeof COMPANY_DEPT_TEMPLATE!=='undefined'?COMPANY_DEPT_TEMPLATE:[];
    pc.departments=tpl.length?JSON.parse(JSON.stringify(tpl)):[];
  }
  if(!pc.board)pc.board={execs:{},chairman:'你',chairmanId:'player',playerShares:100};
  if(!pc.equity)pc.equity={holders:[{name:'你',pct:100,votes:100,id:'player',chairman:true}]};
  if(!pc.branches)pc.branches=[];
  if(!pc.subsidiaries)pc.subsidiaries=[];
  if(!pc.secretary)pc.secretary={name:'苏小秘',id:'staff_secretary',briefs:[]};
  if(pc.ipoListed==null)pc.ipoListed=false;
  if(!pc.companyId&&pc.founded)pc.companyId='player_co_'+(pc.foundedWeek||game.week||0);
}
function migratePlayerCompanySafe(){
  if(!game)return;
  try{if(typeof migratePropertyCompany==='function')migratePropertyCompany()}
  catch(e){console.error('migratePropertyCompany',e);repairPlayerCompanyMinimal()}
  if(game.playerCompany&&game.playerCompany.founded){
    try{if(typeof migrateCompanyManagement==='function')migrateCompanyManagement()}
    catch(e){console.error('migrateCompanyManagement',e);repairPlayerCompanyMinimal()}
    try{if(typeof migrateCompanyKpi==='function')migrateCompanyKpi()}
    catch(e){console.error('migrateCompanyKpi',e)}
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
  game.housingType='commercial';
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
  game.housingType='villa';
  game.livingSituation='owned';
  game.livingAtHome=false;
  game.inSchoolDorm=false;
  game.rentPlan=null;
  if(typeof ledgerAddExpense==='function')ledgerAddExpense('housing','🏡','购置别墅',VILLA_PRICE,false);
  if(typeof syncAllPlayerStaffCircles==='function')syncAllPlayerStaffCircles();
  else if(typeof syncVillaStaffToWorkplaceCircle==='function')syncVillaStaffToWorkplaceCircle();
  addLog('🏡 购入别墅 · 花园泳池 · 管家月费 ¥'+VILLA_BUTLER_MONTHLY.toLocaleString(),'success');
  if(typeof renderDailyPanel==='function')renderDailyPanel();
  if(typeof updateUI==='function')updateUI();
  if(typeof autoSaveSlot==='function')autoSaveSlot();
}
function foundPlayerCompany(){
  if(!game||game.gameOver)return;
  if(hasPlayerCompany()){addLog('已拥有自己的公司','warn');return}
  if(game.cash<COMPANY_FOUND_PRICE){addLog('开公司需 ¥'+COMPANY_FOUND_PRICE.toLocaleString()+'，现金不足','fail');return}
  if(!confirm('注册自己的公司？\n¥'+COMPANY_FOUND_PRICE.toLocaleString()+' · 含保镖司机团队 · 月费 ¥'+COMPANY_STAFF_MONTHLY.toLocaleString()+'\n\n下一步请选择主营行业（不可选「综合」）'))return;
  if(typeof openCompanyIndustryPicker==='function'){
    openCompanyIndustryPicker({
      title:'选择公司主营行业',
      hint:'一次选择一个行业 · 布局达四个及以上时将显示为综合型企业',
      onPick:function(ind){completeFoundPlayerCompany(ind)},
      onCancel:function(){}
    });
    return;
  }
  completeFoundPlayerCompany(typeof inferPlayerCompanyIndustry==='function'?inferPlayerCompanyIndustry():'信息技术');
}
function completeFoundPlayerCompany(industry){
  if(!game||game.gameOver||hasPlayerCompany())return;
  if(!industry||industry==='综合'){addLog('请选择具体行业','fail');return}
  if(game.cash<COMPANY_FOUND_PRICE){addLog('开公司需 ¥'+COMPANY_FOUND_PRICE.toLocaleString()+'，现金不足','fail');return}
  game.cash-=COMPANY_FOUND_PRICE;
  const pc=ensurePlayerCompany();
  pc.founded=true;
  pc.foundedWeek=game.week||0;
  pc.acquisitions={player:null,companion:null};
  pc.holdings=[];
  pc.recruitInbox=[];
  pc.jobPosts=[];
  pc.departments=JSON.parse(JSON.stringify(typeof COMPANY_DEPT_TEMPLATE!=='undefined'?COMPANY_DEPT_TEMPLATE:[]));
  pc.staff=[];pc.projects=[];
  pc.industries=[];
  if(typeof addCompanyIndustry==='function')addCompanyIndustry(pc,industry);
  else{pc.industries=[industry];pc.primaryIndustry=industry}
  pc.weeklyReports=[];pc.monthlyReports=[];
  pc.board={
    foundingType:'solo',playerShares:100,chairman:'你',chairmanId:'player',chairmanVeto:true,ceo:'你',
    supervisor:null,supervisorAppointed:false,
    execs:{ceo:'你',cfo:'王建国',hr:'林婉儿',biz:'陈海洋',cto:'（待任命）',ops:'刘运营',cmo:'周市场'},
    pendingVote:null
  };
  pc.equity={holders:[{name:'你',pct:100,votes:100,id:'player',chairman:true}]};
  pc.companyId='player_co_'+(game.week||0);
  pc.ipoListed=false;
  pc.ipo=null;
  pc.hqCity=typeof getCompanyHqCity==='function'?getCompanyHqCity():(game.playerCity||'杭州');
  if(typeof ledgerAddExpense==='function')ledgerAddExpense('business','🏢','注册公司',COMPANY_FOUND_PRICE,false);
  addLog('🏢 公司成立 · 主营「'+industry+'」· 请为公司命名 · 招聘邮箱已开通 · 月费 ¥'+COMPANY_STAFF_MONTHLY.toLocaleString(),'success');
  if(typeof syncAllPlayerStaffCircles==='function')syncAllPlayerStaffCircles();
  else if(typeof syncCompanyStaffToWorkplaceCircle==='function')syncCompanyStaffToWorkplaceCircle();
  if(typeof migrateCompanyGovernanceFull==='function')migrateCompanyGovernanceFull();
  if(typeof migrateCompanyBranches==='function')migrateCompanyBranches();
  queuePlayerCompanyNameModal();
  if(typeof renderDailyPanel==='function')renderDailyPanel();
  if(typeof updateUI==='function')updateUI();
  if(typeof autoSaveSlot==='function')autoSaveSlot();
}
function findStockForCompany(co){
  if(!co||!game)return null;
  migrateCompanyListedStockCodes();
  const code=co.listedStockCode||(typeof resolveListedStockCodeFromCompanyName==='function'?resolveListedStockCodeFromCompanyName(co.name):null);
  if(!code)return null;
  return ensureStockInGame(code);
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
  const coId=getAcquiredCompanyId('player');
  if(!coId||!game||!game.employed||!game.employment)return false;
  return employmentCompanyId(game.employment)===coId;
}
function companionEmployerAcquired(){
  const coId=getAcquiredCompanyId('companion');
  if(!coId)return false;
  const c=game&&game.companion;
  if(!c||!c.employed||!c.employment)return false;
  return employmentCompanyId(c.employment)===coId;
}
function getAcquiredCompanyId(key){
  const pc=game&&game.playerCompany;
  return pc&&pc.acquisitions&&pc.acquisitions[key]!=null?pc.acquisitions[key]:null;
}
function employmentCompanyId(emp){
  if(!emp)return null;
  if(emp.company&&emp.company.id)return emp.company.id;
  if(emp.companyId)return emp.companyId;
  return null;
}
function isCompanyIdAcquired(coId){
  if(!coId)return false;
  const pc=game&&game.playerCompany;
  if(!pc||!pc.founded||!pc.acquisitions)return false;
  return pc.acquisitions.player===coId||pc.acquisitions.companion===coId;
}
function currentActorEmployerImmune(){
  if(typeof _companionActor!=='undefined'&&_companionActor){
    return companionEmployerOwnerImmune();
  }
  return playerEmployerOwnerImmune();
}
function playerEmployerOwnerImmune(){return playerEmployerAcquired()}
function companionEmployerOwnerImmune(){return companionEmployerAcquired()}
function addCompanyHolding(co){
  const pc=ensurePlayerCompany();
  const st=findStockForCompany(co);
  if(!st)return;
  let shares=Math.max(10000,Math.round(companyAcquisitionPrice(co)/st.price));
  if(typeof capSharesToAvailableFloat==='function'){
    const want=shares;
    shares=capSharesToAvailableFloat(st.symbol,shares);
    if(shares<want&&typeof addLog==='function')addLog('⚠ 「'+st.name+'」流通盘上限 · 仅登记 '+(typeof fmtShareCount==='function'?fmtShareCount(shares):shares)+' 股','warn');
  }
  if(shares<=0)return;
  const exist=pc.holdings.find(h=>h.symbol===st.symbol);
  if(exist)exist.shares+=shares;
  else pc.holdings.push({symbol:st.symbol,name:st.name,shares,lastPrice:st.price,companyId:co.id,companyName:co.name,acquired:true});
}
// 收购谈判：按已购入股权比例同步可卖出的持股（游说花的钱 = 买这部分股份）
function syncAcquisitionHolding(co,target){
  const pc=ensurePlayerCompany();
  const st=findStockForCompany(co);
  if(!st)return 0;
  const pct=typeof acquisitionPersuadedPct==='function'?acquisitionPersuadedPct(target):0;
  const fullShares=Math.max(10000,Math.round(companyAcquisitionPrice(co)/st.price));
  let shares=Math.max(0,Math.round(fullShares*(pct/100)));
  const exist=pc.holdings.find(h=>h.symbol===st.symbol);
  if(typeof getStockFloatInfo==='function'){
    const info=getStockFloatInfo(st.symbol);
    if(info){
      const existCo=exist?Math.floor(exist.shares||0):0;
      const maxCo=Math.max(0,info.floatShares-(info.held-existCo));
      if(shares>maxCo){
        if(maxCo<shares&&typeof addLog==='function')addLog('⚠ 「'+st.name+'」流通盘可买上限 · 登记 '+(typeof fmtShareCount==='function'?fmtShareCount(maxCo):maxCo)+'（目标 '+(typeof fmtShareCount==='function'?fmtShareCount(shares):shares)+'）','warn');
        shares=maxCo;
      }
    }
  }else if(typeof capSharesToAvailableFloat==='function'){
    const want=shares;
    shares=capSharesToAvailableFloat(st.symbol,shares);
    if(shares<want&&typeof addLog==='function')addLog('⚠ 「'+st.name+'」流通盘可买上限 · 登记 '+(typeof fmtShareCount==='function'?fmtShareCount(shares):shares)+'（目标 '+(typeof fmtShareCount==='function'?fmtShareCount(want):want)+'）','warn');
  }
  if(shares<=0)return 0;
  if(exist){
    exist.shares=shares;
    exist.companyId=exist.companyId||co.id;
    exist.companyName=exist.companyName||co.name;
    exist.acquired=true;
  }else{
    pc.holdings.push({symbol:st.symbol,name:st.name,shares,lastPrice:st.price,companyId:co.id,companyName:co.name,acquired:true});
  }
  return shares;
}

function escHoldingSym(sym){
  return String(sym||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");
}

function sellCompanyHolding(symbol,shares){
  if(!game||!game.playerCompany)return;
  const pc=game.playerCompany;
  shares=Math.floor(shares)||0;
  if(shares<=0){addLog('请输入卖出股数','fail');return;}
  const h=(pc.holdings||[]).find(function(x){return x.symbol===symbol});
  if(!h||!h.shares){addLog('无该持股','fail');return;}
  if(h.shares<shares){addLog('持股不足 · 当前 '+h.shares.toLocaleString()+' 股','fail');return;}
  const st=game.stocks&&game.stocks.find(function(x){return x.symbol===symbol});
  if(!st){addLog('暂无行情','fail');return;}
  const rev=st.price*shares;
  const comm=typeof stockCommission==='function'?stockCommission(rev):Math.max(0.01,rev*0.0002);
  const net=rev-comm;
  game.cash+=net;
  game.money+=net;
  if(typeof ledgerAddIncome==='function')ledgerAddIncome('invest','📈','减持 '+h.name,net);
  if(typeof recordStockTrade==='function')recordStockTrade(symbol,'sell',shares,st.price);
  h.shares-=shares;
  if(h.shares<=0)pc.holdings=pc.holdings.filter(function(x){return x.symbol!==symbol});
  addLog('卖出收购持股 '+h.name+' ×'+shares.toLocaleString()+' @¥'+st.price.toFixed(2)+' 净收 ¥'+Math.round(net).toLocaleString(),'info');
  if(typeof autoSaveSlot==='function')autoSaveSlot();
  if(typeof renderAssetsPanel==='function'&&game.financeSubTab==='assets')renderAssetsPanel();
  if(typeof refreshCompanyMgmtUi==='function')refreshCompanyMgmtUi();
  if(typeof updateUI==='function')updateUI();
}

function sellCompanyHoldingAll(symbol){
  const pc=game&&game.playerCompany;
  const h=pc&&pc.holdings&&pc.holdings.find(function(x){return x.symbol===symbol});
  if(!h)return;
  sellCompanyHolding(symbol,h.shares);
}

function sellCompanyHoldingPrompt(symbol){
  const pc=game&&game.playerCompany;
  const h=pc&&pc.holdings&&pc.holdings.find(function(x){return x.symbol===symbol});
  if(!h)return;
  const st=game.stocks&&game.stocks.find(function(x){return x.symbol===symbol});
  const price=st?st.price:0;
  const n=prompt('卖出「'+(h.name||symbol)+'」\n现价 ¥'+price.toFixed(2)+' · 可卖 '+h.shares.toLocaleString()+' 股',''+Math.min(h.shares,10000));
  if(n==null||!String(n).trim())return;
  sellCompanyHolding(symbol,parseInt(n,10));
}

const IPO_LISTING_FEE=3000000;
const IPO_MIN_WEEKS=52;
const IPO_MIN_STAFF=8;
const IPO_MIN_FAMILIARITY=15;
const IPO_MIN_INFLUENCE=8;

function playerCompanyReadyForIpo(){
  const pc=game&&game.playerCompany;
  if(!pc||!pc.founded)return {ok:false,reasons:['尚未创办公司'],listed:!!pc&&!!pc.ipoListed};
  if(pc.ipoListed){
    return {ok:false,reasons:[],listed:true,symbol:pc.listedStockCode||(pc.ipo&&pc.ipo.symbol)};
  }
  const weeks=Math.max(0,(game.week||0)-(pc.foundedWeek||0));
  const reasons=[];
  if(weeks<IPO_MIN_WEEKS)reasons.push('成立满 '+IPO_MIN_WEEKS+' 周（当前 '+weeks+' 周）');
  if((pc.staff||[]).length<IPO_MIN_STAFF)reasons.push('员工不少于 '+IPO_MIN_STAFF+' 人（当前 '+(pc.staff||[]).length+'）');
  if(!pc.name&&!pc.brandName)reasons.push('需先为公司命名');
  if((pc.familiarity||0)<IPO_MIN_FAMILIARITY)reasons.push('品牌熟悉度 ≥ '+IPO_MIN_FAMILIARITY+'（当前 '+(pc.familiarity||0)+'）');
  if((pc.influence||0)<IPO_MIN_INFLUENCE)reasons.push('品牌影响力 ≥ '+IPO_MIN_INFLUENCE+'（当前 '+(pc.influence||0)+'）');
  const inds=typeof sanitizeCompanyIndustries==='function'?sanitizeCompanyIndustries(pc):(pc.industries||[]);
  if(!inds.length)reasons.push('需选定主营行业');
  const completed=(pc.projects||[]).some(function(p){return(p.progress||0)>=100});
  if(!completed&&(pc.staff||[]).length<15)reasons.push('需有项目交付完成，或员工达 15 人');
  if((game.cash||0)<IPO_LISTING_FEE)reasons.push('上市费用 ¥'+IPO_LISTING_FEE.toLocaleString()+'（现金不足）');
  return {ok:!reasons.length,reasons:reasons,listed:false,weeks:weeks};
}

function generatePlayerCompanyStockCode(pc){
  const seed=(pc.name||pc.brandName||'co')+(game.week||0)+(game.stockSeed||0);
  let n=(typeof hashStr==='function'?hashStr(seed):seed.length*997)%900+100;
  let code='688'+String(n);
  const used=function(sym){return game.stocks&&game.stocks.some(function(s){return s.symbol===sym});};
  while(used(code)){
    n=(n%900)+101;
    code='688'+String(n);
  }
  return code;
}

function ensurePlayerCompanyStockListed(pc){
  if(!pc||!pc.ipoListed)return null;
  const sym=pc.listedStockCode||(pc.ipo&&pc.ipo.symbol);
  if(!sym)return null;
  let st=game.stocks&&game.stocks.find(function(x){return x.symbol===sym});
  if(st)return st;
  const industry=typeof getCompanyPrimaryIndustry==='function'?getCompanyPrimaryIndustry(pc):((pc.industries||[])[0]||'信息技术');
  const basePrice=pc.ipo&&pc.ipo.ipoPrice?pc.ipo.ipoPrice:12;
  st={symbol:sym,id:'stk_'+sym,name:(pc.brandName||pc.name||'自有公司'),category:industry,
    price:basePrice,prevPrice:basePrice,refPrice:basePrice,history:[basePrice,basePrice],playerCompany:true};
  game.stocks=game.stocks||[];
  game.stocks.push(st);
  return st;
}

function registerPlayerCompanyInUniverse(pc){
  if(!pc||!pc.ipoListed)return;
  const coId=pc.companyId||('player_co_'+(pc.foundedWeek||game.week||0));
  pc.companyId=coId;
  const industry=typeof getCompanyPrimaryIndustry==='function'?getCompanyPrimaryIndustry(pc):((pc.industries||[])[0]||'信息技术');
  const co={
    id:coId,name:pc.brandName||pc.name||'自有公司',
    tier:'mid',scale:'medium',primaryCategory:industry,categories:[industry],
    city:pc.hqCity||game.playerCity||(typeof PLAYER_HOME_CITY!=='undefined'?PLAYER_HOME_CITY:'杭州'),
    listedStockCode:pc.listedStockCode||(pc.ipo&&pc.ipo.symbol),
    headcount:(pc.staff||[]).length,playerOwned:true
  };
  if(!game.companyById)game.companyById={};
  game.companyById[coId]=co;
  if(game.companyAll&&!game.companyAll.some(function(c){return c.id===coId}))game.companyAll.push(co);
}

function migratePlayerCompanyIpo(pc){
  if(!pc||!pc.founded)return;
  if(!pc.companyId)pc.companyId='player_co_'+(pc.foundedWeek||game.week||0);
  if(pc.ipoListed){
    ensurePlayerCompanyStockListed(pc);
    registerPlayerCompanyInUniverse(pc);
    if(!pc.listedStockCode&&pc.ipo)pc.listedStockCode=pc.ipo.symbol;
  }
}

function launchPlayerCompanyIpo(){
  if(!hasPlayerCompany()){addLog('请先创办公司','fail');return;}
  const pc=game.playerCompany;
  const check=playerCompanyReadyForIpo();
  if(check.listed){addLog('公司已上市 · 代码 '+(check.symbol||''),'warn');return;}
  if(!check.ok){
    addLog('暂不满足上市条件：'+(check.reasons[0]||'未知'),'fail');
    return;
  }
  if(!confirm('申请科创板 IPO？\n\n上市费用 ¥'+IPO_LISTING_FEE.toLocaleString()+'\n公司：'+(pc.brandName||pc.name)+'\n条件：成立 '+check.weeks+' 周 · 员工 '+(pc.staff||[]).length+' 人\n\n上市后可在「炒股」页交易本公司股票'))return;
  game.cash-=IPO_LISTING_FEE;
  if(typeof ledgerAddExpense==='function')ledgerAddExpense('business','📊','IPO 上市费用',IPO_LISTING_FEE,false);
  const symbol=generatePlayerCompanyStockCode(pc);
  const industry=typeof getCompanyPrimaryIndustry==='function'?getCompanyPrimaryIndustry(pc):((pc.industries||[])[0]||'信息技术');
  const basePrice=Math.round((8+Math.min(42,(pc.familiarity||5)*0.35+(pc.influence||3)*0.55+(pc.staff||[]).length*0.25))*100)/100;
  pc.companyId=pc.companyId||('player_co_'+(pc.foundedWeek||game.week||0));
  pc.ipoListed=true;
  pc.ipo={symbol:symbol,listedWeek:game.week,ipoPrice:basePrice};
  pc.listedStockCode=symbol;
  const st={
    symbol:symbol,id:'stk_'+symbol,name:(pc.brandName||pc.name),category:industry,
    price:basePrice,prevPrice:basePrice,refPrice:basePrice,history:[basePrice,basePrice],playerCompany:true
  };
  game.stocks=game.stocks||[];
  game.stocks.push(st);
  registerPlayerCompanyInUniverse(pc);
  addLog('🎉 「'+(pc.brandName||pc.name)+'」科创板上市 · 代码 '+symbol+' · 发行价 ¥'+basePrice.toFixed(2),'success');
  if(typeof refreshCompanyMgmtUi==='function')refreshCompanyMgmtUi();
  if(typeof renderAssetsPanel==='function'&&game.financeSubTab==='assets')renderAssetsPanel();
  if(typeof renderStocks==='function'&&game.financeSubTab==='stock')renderStocks();
  if(typeof updateUI==='function')updateUI();
  if(typeof autoSaveSlot==='function')autoSaveSlot();
}

function renderPlayerCompanyIpoHtml(pc){
  if(!pc||!pc.founded)return '';
  const check=playerCompanyReadyForIpo();
  let h='<div class="company-mgmt-section" style="margin:8px 0;padding:8px;background:var(--bg);border-radius:8px;border:1px solid var(--border);font-size:.72rem;line-height:1.55">';
  h+='<b>📊 资本市场</b>';
  if(check.listed){
    const sym=check.symbol||pc.listedStockCode;
    const st=sym&&game.stocks&&game.stocks.find(function(x){return x.symbol===sym});
    h+='<p class="fold-meta" style="margin:4px 0;color:var(--green)">✓ 已上市 · 代码 <b>'+sym+'</b>';
    if(st)h+=' · 现价 ¥'+st.price.toFixed(2);
    if(pc.ipo&&pc.ipo.listedWeek)h+=' · 第'+pc.ipo.listedWeek+'周挂牌';
    h+='</p><button type="button" class="btn" style="font-size:.68rem;margin-top:4px" onclick="switchFinanceTab(\'stock\');showTab(\'stock\')">📈 查看行情</button>';
  }else{
    h+='<p class="fold-meta" style="margin:4px 0">科创板 IPO · 费用 ¥'+(IPO_LISTING_FEE/10000)+'万</p>';
    if(check.ok){
      h+='<p style="margin:4px 0;color:var(--green)">✓ 已满足上市条件（成立 '+check.weeks+' 周）</p>';
      h+='<button type="button" class="btn btn-primary" style="font-size:.72rem;margin-top:4px" onclick="launchPlayerCompanyIpo()">🚀 申请 IPO</button>';
    }else{
      h+='<p class="fold-meta" style="margin:4px 0;color:var(--orange)">待满足：</p><ul style="margin:2px 0 0 16px;padding:0;font-size:.7rem">';
      (check.reasons||[]).forEach(function(r){h+='<li>'+r+'</li>';});
      h+='</ul>';
    }
  }
  h+='</div>';
  return h;
}

function findStockForPlayerCompany(){
  const pc=game&&game.playerCompany;
  if(!pc||!pc.ipoListed)return null;
  migratePlayerCompanyIpo(pc);
  return ensurePlayerCompanyStockListed(pc);
}
function acquireEmployerCompany(who){
  if(typeof startEmployerAcquisitionNegotiation==='function'){startEmployerAcquisitionNegotiation(who);return;}
  acquireEmployerCompanyLegacy(who);
}
function acquireEmployerCompanyLegacy(who){
  if(!hasPlayerCompany()){addLog('请先注册自己的公司','fail');return}
  const pc=ensurePlayerCompany();
  const co=who==='companion'?companionEmployerCompany():playerEmployerCompany();
  if(!co){addLog(who==='companion'?'伴侣当前无业，无法收购':'你当前无业，无法收购','fail');return}
  if(typeof isStateOwnedCompany==='function'&&isStateOwnedCompany(co)){addLog('「'+co.name+'」为国有控股企业，不可收购','fail');return}
  const key=who==='companion'?'companion':'player';
  if(pc.acquisitions[key]===co.id){addLog('该企业已收购','warn');return}
  const price=companyAcquisitionPrice(co);
  const stHint=(findStockForCompany(co)||{}).name;
  if(game.cash<price){addLog('收购 '+co.name+' 需 ¥'+price.toLocaleString()+'，现金不足','fail');return}
  if(!confirm('收购「'+co.name+'」？\n估价 ¥'+price.toLocaleString()+(stHint?' · 持股：'+stHint:'（未上市按规模估算）')))return;
  game.cash-=price;
  pc.acquisitions[key]=co.id;
  addCompanyHolding(co);
  if(typeof registerAcquiredSubsidiary==='function')registerAcquiredSubsidiary(key,co,100,null);
  if(typeof ledgerAddExpense==='function')ledgerAddExpense('business','🏢','收购 '+co.name,price,false);
  const pn=who==='companion'?(game.partnerDisplayName||'伴侣'):'你';
  const st=findStockForCompany(co);
  addLog('🏢 已收购 '+co.name+' · '+pn+'可不去上班且不会被辞退'+(st?' · 持股 '+st.name:'（未上市）'),'success');
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
const JOB_POST_COST = 5000;

function postCompanyJob(){
  if(typeof syncProjectRecruitment==='function'){syncProjectRecruitment();return;}
  addLog('请先在「公司管理」页签查看项目编制缺口','fail');
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
  if(typeof hasPrivateJet==='function'&&hasPrivateJet()){
    const jetM=typeof PRIVATE_JET_ANNUAL!=='undefined'?Math.round(PRIVATE_JET_ANNUAL/12):833333;
    exp.total=(exp.total||0)+jetM;
    exp.living=(exp.living||0)+jetM;
    exp.label=(exp.label||'')+' · 私人飞机维护';
  }
}
function propertyStatusLabel(){
  const bits=[];
  if(game.villaOwned)bits.push('别墅');
  if(game.ownsHome&&!game.mortgagePaidOff)bits.push('商品房按揭');
  else if(game.ownsHome&&game.mortgagePaidOff)bits.push('商品房');
  if(hasPlayerCompany())bits.push('自有公司');
  return bits.filter(Boolean).join(' · ');
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
  if(typeof renderHousingPanel==='function')h+=renderHousingPanel();
  h+='<div class="panel-title" style="margin:10px 0 4px">🏢 公司</div>';
  if(game.villaOwned){
    const vf=game.villaFacilities||{};
    h+='<p class="fold-meta" style="margin-top:4px"><b>别墅设施</b>（各 ¥'+(VILLA_FACILITY_COST/10000)+'万）</p>';
    h+=(!vf.library?'<button class="btn btn-phone-shop" onclick="buildVillaFacility(\'library\')">📚 建造私人图书馆</button> ':'<span class="fold-meta" style="color:var(--green)">✓ 私人图书馆</span> ')+'<br>';
    h+=(!vf.meditation?'<button class="btn btn-phone-shop" onclick="buildVillaFacility(\'meditation\')">🧘 建造静室</button> ':'<span class="fold-meta" style="color:var(--green)">✓ 静室</span> ')+'<br>';
    h+=(!vf.cinema?'<button class="btn btn-phone-shop" onclick="buildVillaFacility(\'cinema\')">🎬 建造私人影院</button> ':'<span class="fold-meta" style="color:var(--green)">✓ 私人影院</span> ')+'<br>';
  }
  if(typeof hasPrivateJet==='function'&&hasPrivateJet()){
    h+='<p class="fold-meta" style="color:var(--green);margin-top:6px">✈ 私人飞机 · 年维护 ¥'+(PRIVATE_JET_ANNUAL/10000)+'万</p>';
  }else{
    h+='<button class="btn btn-phone-shop" onclick="buyPrivateJet()">✈ 购买私人飞机 ¥2亿 · 年维护 ¥1000万</button><br>';
    h+='<p class="fold-meta">城际出行大幅缩短 · 异地中层会晤更省时</p>';
  }
  if(!hasPlayerCompany()){
    h+='<button class="btn btn-phone-shop" onclick="foundPlayerCompany()">🏢 独资开公司 ¥'+(COMPANY_FOUND_PRICE/10000)+'万</button><br>';
    h+='<button class="btn btn-phone-shop" onclick="openPartnerFoundingMenu()">🤝 与朋友合伙 ¥'+(COMPANY_PARTNER_FOUND_PRICE_REF/10000)+'万</button>';
    h+='<p class="fold-meta">独资含保镖司机 · 合伙需通讯录朋友 · 月费 ¥'+(COMPANY_STAFF_MONTHLY/10000)+'万</p>';
  }else{
    const pc=game.playerCompany;
    const coLabel=(pc.name||pc.brandName)?('🏢 '+(pc.brandName||pc.name)):'🏢 自有公司（未命名）';
    h+='<p class="fold-meta" style="color:var(--green);margin-top:6px">'+coLabel+' · 团队月费 ¥'+(COMPANY_STAFF_MONTHLY/10000)+'万';
    if(pc.name&&pc.familiarity!=null)h+=' · 熟悉度 '+pc.familiarity+' · 影响力 '+pc.influence;
    h+='</p>';
    if(!pc.name)h+='<button class="btn btn-primary" style="font-size:.72rem;margin:4px 0" onclick="queuePlayerCompanyNameModal()">✏️ 为公司命名</button> ';
    else h+='<button class="btn" style="font-size:.68rem;margin:4px 0" onclick="renamePlayerCompanyBrand()">🏷 品牌更名</button> ';
    const pCo=playerEmployerCompany(),cCo=companionEmployerCompany();
    if(pCo){
      const got=pc.acquisitions.player===pCo.id;
      const sub=pc.subsidiaries&&pc.subsidiaries.find(function(s){return s.companyId===pCo.id});
      h+='<div style="margin:4px 0">'+(got?'✓ ':'')+'<b>你的单位</b> '+pCo.name;
      if(got&&sub){
        h+=' · 控股 '+sub.ownershipPct+'%';
        if(sub.playerRole)h+=' · '+sub.playerRole.title;
      }else{
        h+=' · 收购价 ¥'+companyAcquisitionPrice(pCo).toLocaleString();
        h+=' <button class="btn" style="font-size:.65rem;padding:2px 6px" onclick="acquireEmployerCompany(\'player\')">股权收购</button>';
      }
      h+='</div>';
    }
    if(cCo){
      const got=pc.acquisitions.companion===cCo.id;
      const pn=game.partnerDisplayName||'伴侣';
      const sub=pc.subsidiaries&&pc.subsidiaries.find(function(s){return s.companyId===cCo.id});
      h+='<div style="margin:4px 0">'+(got?'✓ ':'')+'<b>'+pn+'单位</b> '+cCo.name;
      if(got&&sub){
        h+=' · 控股 '+sub.ownershipPct+'%';
        if(sub.partnerRole)h+=' · '+sub.partnerRole.title;
        h+=' <span class="fold-meta" style="color:var(--green)">免遭辞退</span>';
      }else{
        h+=' · 收购价 ¥'+companyAcquisitionPrice(cCo).toLocaleString();
        h+=' <button class="btn" style="font-size:.65rem;padding:2px 6px" onclick="acquireEmployerCompany(\'companion\')">股权收购</button>';
      }
      h+='</div>';
    }
    if(pc.holdings&&pc.holdings.length){
      h+='<p class="fold-meta">持股：'+pc.holdings.map(function(x){return x.name+' '+x.shares.toLocaleString()+'股'}).join(' · ')+'</p>';
      h+='<button type="button" class="btn" style="font-size:.68rem;margin:2px 0" onclick="switchFinanceTab(\'assets\');showTab(\'stock\')">💼 查看资产与股东收益</button>';
    }
    h+='<p class="fold-meta" style="margin-top:4px">开公司后请点顶部 <b>公司管理</b> 页签查看组织、在研业务与招聘</p>';
    const pendN=(pc.recruitInbox||[]).filter(function(x){return x.status==='pending'||!x.status&&x.decision==null}).length;
    if(pendN)h+='<p class="fold-meta" style="color:var(--orange)">招聘邮箱待处理 '+pendN+' 份</p>';
    h+='<button class="btn" onclick="sellPlayerCompany()">出售公司</button>';
  }
  h+='</div></div>';
  return h;
}
function buildVillaFacility(key){
  if(!hasVilla()){addLog('请先购买别墅','fail');return}
  migratePropertyCompany();
  const vf=game.villaFacilities;
  const names={library:'私人图书馆',meditation:'静室',cinema:'私人影院'};
  if(vf[key]){addLog('已有'+names[key],'warn');return}
  if(game.cash<VILLA_FACILITY_COST){addLog('建造'+names[key]+'需 ¥'+VILLA_FACILITY_COST.toLocaleString(),'fail');return}
  if(!confirm('建造「'+names[key]+'」？\n¥'+VILLA_FACILITY_COST.toLocaleString()))return;
  game.cash-=VILLA_FACILITY_COST;
  vf[key]=true;
  if(typeof ledgerAddExpense==='function')ledgerAddExpense('housing','🏡','建造'+names[key],VILLA_FACILITY_COST,false);
  addLog('🏡 别墅建成 '+names[key],'success');
  if(typeof renderDailyPanel==='function')renderDailyPanel();
  if(typeof updateUI==='function')updateUI();
  if(typeof autoSaveSlot==='function')autoSaveSlot();
}
function hasVillaFacility(key){
  migratePropertyCompany();
  return !!(game.villaFacilities&&game.villaFacilities[key]);
}
function renderVillaHomeExtras(prefix){
  if(!hasVilla())return '';
  migratePropertyCompany();
  const d=game.daily||{};
  const vf=game.villaFacilities||{};
  const dis=!!(typeof dailySlotHoursLeft==='function'&&dailySlotHoursLeft()<=0);
  const partyUsed=!!d.villaPartyUsed;
  const lbl=(t)=>(d.phase==='allnight'&&typeof allnightBtnLabel==='function')?allnightBtnLabel(t):t;
  const mk=(act,label,off)=>'<button class="btn" '+(off?'disabled':'')+' onclick="dailyPick'+prefix+'(\''+act+'\')">'+lbl(label)+'</button> ';
  let h='<p class="fold-meta" style="color:var(--green)">🏡 别墅 · 花园与泳池</p>';
  h+=mk('villa_tea','🍵 院子喝茶1h',dis);
  h+=mk('villa_swim','🏊 游泳1h',dis);
  if(vf.library)h+=mk('villa_library','📚 图书馆研究8h',dis);
  if(vf.meditation)h+=mk('villa_meditate','🧘 静室冥想1h',dis);
  if(vf.cinema)h+=mk('villa_cinema','🎬 影院看电影2h',dis);
  h+=mk('villa_party','🎉 开派对（选规模·每日1次）',partyUsed||dis);
  return h;
}
function dailyVillaLibrary(){
  if(!hasVillaFacility('library'))return;
  if(typeof dailyCanUseHours==='function'&&!dailyCanUseHours(8))return;
  if(typeof addStress==='function')addStress(-1,'研究 ');
  if(typeof addTempStat==='function')addTempStat('mind',1,'📚 图书馆 ');
  if(typeof dailyAddHours==='function')dailyAddHours(8,true);
  if(typeof showConsumeModal==='function')showConsumeModal({icon:'📚',title:'私人图书馆',html:'研读一整时段 · 心智 <b>+1</b> · 压力 <b>-1</b>',buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
  addLog('📚 图书馆研究 · 心智+1 · 压力-1 · 本时段已用尽','info');
}
function dailyVillaMeditate(){
  if(!hasVillaFacility('meditation'))return;
  if(typeof dailyCanUseHours==='function'&&!dailyCanUseHours(1))return;
  if(typeof addStress==='function')addStress(-10,'冥想 ');
  if(typeof dailyAddHours==='function')dailyAddHours(1,false);
  if(typeof showConsumeModal==='function')showConsumeModal({icon:'🧘',title:'静室冥想',html:'压力 <b>-10</b>',buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
  addLog('🧘 静室冥想 · 压力-10','info');
}
function dailyVillaCinema(){
  if(!hasVillaFacility('cinema'))return;
  if(typeof dailyCanUseHours==='function'&&!dailyCanUseHours(2))return;
  if(typeof pickInviteContactsModal!=='function'){
    finishVillaCinema(null);
    return;
  }
  pickInviteContactsModal('邀请谁一起看电影',1,function(guests){finishVillaCinema(guests&&guests[0]);});
}
function finishVillaCinema(guest){
  if(typeof dailyCanUseHours==='function'&&!dailyCanUseHours(2))return;
  if(typeof addStress==='function')addStress(-1,'看电影 ');
  if(typeof dailyAddHours==='function')dailyAddHours(2,false);
  let note='';
  if(guest){
    if(guest.kind==='spouse'&&typeof adjustSpouseIntimacy==='function'){adjustSpouseIntimacy(1);note=' · 与 '+guest.name+' 观影 · 亲密度+1'}
    else if(typeof bumpContactFamiliarity==='function'){bumpContactFamiliarity(guest,1);note=' · 与 '+guest.name+' 观影 · 熟悉度+1'}
  }
  if(typeof showConsumeModal==='function')showConsumeModal({icon:'🎬',title:'私人影院',html:'看了两小时的电影 · 压力 <b>-1</b>'+(note?'<br><span class="fold-meta">'+note+'</span>':''),buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
  addLog('🎬 私人影院 · 压力-1'+note,'info');
  if(typeof renderDailyPanel==='function')renderDailyPanel();
}
function promptVillaPartyTier(){
  if(!hasVilla())return;
  const d=game.daily;
  if(d&&d.villaPartyUsed){addLog('今天已办过别墅派对','fail');return}
  let html='<p class="fold-meta">可邀请通讯录好友 · 不足人数由陌生人补位 · 耗尽今日</p>';
  VILLA_PARTY_TIERS.forEach(function(t){
    html+='<button type="button" class="btn" style="display:block;width:100%;margin:6px 0" onclick="startVillaPartyTier(\''+t.id+'\')">'+
      t.label+' · ≤'+t.cap+'人 · ¥'+(t.cost/10000)+'万</button>';
  });
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({icon:'🎉',title:'选择派对规模',html:html,buttons:[{text:'取消',handler:function(){if(typeof closeConsumeModal==='function')closeConsumeModal(true);}}]});
  }else if(confirm('小型派对 ¥10万？'))startVillaPartyTier('small');
}
function startVillaPartyTier(tierId){
  if(typeof closeConsumeModal==='function')closeConsumeModal(true);
  const tier=VILLA_PARTY_TIERS.find(function(t){return t.id===tierId});
  if(!tier)return;
  if(game.cash<tier.cost){addLog('派对需 ¥'+tier.cost.toLocaleString(),'fail');return}
  if(typeof pickInviteContactsModal==='function'){
    pickInviteContactsModal(tier.label+' · 邀请好友',tier.cap,function(guests){runVillaParty(tier,guests||[]);});
  }else runVillaParty(tier,[]);
}
function runVillaParty(tier,guests){
  if(!hasVilla()||!tier)return;
  const d=typeof ensureDailyState==='function'?ensureDailyState():game.daily;
  if(!d||d.villaPartyUsed)return;
  if(game.cash<tier.cost){addLog('现金不足','fail');return}
  game.cash-=tier.cost;
  if(typeof ledgerAddExpense==='function')ledgerAddExpense('lifestyle','🎉',tier.label,tier.cost,false);
  d.villaPartyUsed=true;
  d.subMenu=null;
  const invited=guests||[];
  invited.forEach(function(g){
    if(typeof bumpContactFamiliarity==='function')bumpContactFamiliarity(g,2);
    if(g.kind==='spouse'&&typeof adjustSpouseIntimacy==='function')adjustSpouseIntimacy(1);
  });
  const needStrangers=Math.max(0,tier.cap-invited.length);
  const met=[];
  for(let i=0;i<needStrangers;i++){
    if(typeof createAffairContact==='function'){
      const c=createAffairContact('别墅'+tier.label,null,{silent:true});
      if(c)met.push(c);
    }
  }
  if(typeof addStress==='function')addStress(tier.stress,'派对 ');
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
    }
    d.slotHoursUsed=total;
  }else if(ph==='evening'||ph==='allnight')d.slotHoursUsed=total;
  const showPartySummary=function(){
    const invHtml=invited.length?('<br>邀请好友：'+invited.map(function(p){return p.name}).join('、')):'';
    const metHtml=met.length?('<br>另有 <b>'+met.length+'</b> 位新面孔'):'';
    if(typeof showConsumeModal==='function'){
      showConsumeModal({
        icon:'🎉',title:tier.label,
        html:tier.label+'（约 '+tier.cap+' 人）'+invHtml+metHtml+'<br>花费 ¥'+tier.cost.toLocaleString()+' · 压力 <b>'+tier.stress+'</b><br><span class="fold-meta">今日日程已耗尽</span>',
        buttons:[{text:'继续',primary:true,fn:'closeConsumeModal()'}]
      });
    }
    addLog('🎉 '+tier.label+' · 邀请 '+invited.length+' 人 · 新识 '+met.length+' 人 · 今日时间耗尽','success');
    if(ph==='allnight'&&typeof showAllnightExhaustedModal==='function')setTimeout(function(){showAllnightExhaustedModal()},80);
    if(typeof renderDailyPanel==='function')renderDailyPanel();
    if(typeof updateUI==='function')updateUI();
    if(typeof autoSaveSlot==='function')autoSaveSlot();
  };
  if(met.length&&typeof queueBatchMeetModals==='function')queueBatchMeetModals(met,tier.label,showPartySummary);
  else showPartySummary();
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
  promptVillaPartyTier();
}
