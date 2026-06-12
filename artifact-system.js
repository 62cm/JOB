/* 神器系统 — 终身计数不随周/月/自动生活重置 */
const ART_CAT={
  agri:'农林牧渔',edu:'教育',it:'信息技术',media:'文化传媒',hotel:'餐饮住宿',
  transport:'交通运输',lifeSvc:'个人与生活服务',health:'医疗卫生',law:'法律与公共管理',
  mfg:'制造业',retail:'销售零售与电商',green:'新能源与环保',finance:'金融',
  construction:'建筑工程',bizSvc:'商业服务'
};
const BROOM_COST=10,SILVER_BROOM_COST=1000,GOLD_BROOM_COST=100000;
const ARTIFACT_DEFS={
  butian:{id:'butian',icon:'🪨',name:'补天石',effect:'农林牧渔普通必过；肉体>100专家必过；肉体≥120总监必过'},
  answerBook:{id:'answerBook',icon:'📖',name:'答案之书',effect:'教育普通必过；心智>100专家必过；心智≥120总监必过'},
  xinliu:{id:'xinliu',icon:'🌊',name:'心流',effect:'信息技术普通必过；心智>100专家必过；心智≥120总监必过'},
  naotoule:{id:'naotoule',icon:'📺',name:'奶头乐',effect:'文化传媒普通必过；精神>100专家必过；精神≥120总监必过'},
  roomKey:{id:'roomKey',icon:'🗝',name:'万能房卡',effect:'餐饮住宿普通必过；肉体>100专家必过；肉体≥120总监必过'},
  arrowTime:{id:'arrowTime',icon:'⏳',name:'时间的箭头',effect:'交通运输普通必过；肉体>100专家必过；肉体≥120总监必过'},
  lifeSecret:{id:'lifeSecret',icon:'📜',name:'生活的秘密',effect:'个人与生活服务普通必过；精神>100专家必过；精神≥120总监必过'},
  resilientHeart:{id:'resilientHeart',icon:'💪',name:'坚韧的心',effect:'医疗卫生普通必过；三维>80专家必过；三维>100总监必过'},
  theVoice:{id:'theVoice',icon:'👁',name:'那个声音',effect:'法律与公共管理普通必过；精神>100专家必过；精神≥120总监必过'},
  superCup:{id:'superCup',icon:'☕',name:'超级杯具',effect:'制造业普通必过；心智>100专家必过；心智≥120总监必过'},
  superCoupon:{id:'superCoupon',icon:'🎫',name:'超级优惠券',effect:'销售零售与电商普通必过；心智>100专家必过；心智≥120总监必过'},
  subwayCharm:{id:'subwayCharm',icon:'🚇',name:'电车之狼挂件',effect:'新能源与环保普通必过；精神>100专家必过；精神≥120总监必过'},
  casinoToken:{id:'casinoToken',icon:'🎰',name:'赢家筹码',effect:'信息技术普通必过；心智>100专家必过；心智≥120总监必过'},
  capitalEye:{id:'capitalEye',icon:'👁‍🗨',name:'资本之眼',effect:'金融：盈利≥10万普通必过；≥100万专家；≥1000万总监'},
  constructionPass:{id:'constructionPass',icon:'🏗',name:'工地通行证',effect:'建筑工程：异地面试≥50次普通；≥100次专家；≥500次总监'},
  bizCharm:{id:'bizCharm',icon:'💋',name:'红尘凭证',effect:'商业服务：与100位陌生人亲密普通；500位专家；1000位总监'}
};
function defaultArtifactStats(){
  return{
    parkVisits:0,libraryVisits:0,computerUses:0,hotelVisits:0,carDrives:0,subwayRides:0,
    homeStays:0,cafeVisits:0,storeVisits:0,casinoWinTotal:0,scrollMediaHours:0,jobListingsSeen:0,
    remoteInterviews:0,strangerSexIds:[],stdTreatVisits:0,imprisonExtortEvents:0,
    stockRealizedProfit:0,stockCostBasis:{},
    normalCleanCount:0,silverCleanCount:0,goldCleanCount:0
  };
}
function defaultArtifactState(){
  return{owned:{},broomTier:0,broomOwned:false,silverBroomUnlocked:false,goldBroomUnlocked:false};
}
function migrateArtifacts(){
  if(!game)return;
  if(!game.artifactStats)game.artifactStats=defaultArtifactStats();
  const s=game.artifactStats;
  if(!s.strangerSexIds)s.strangerSexIds=[];
  if(!s.stockCostBasis)s.stockCostBasis={};
  if(s.normalCleanCount==null)s.normalCleanCount=0;
  if(s.silverCleanCount==null)s.silverCleanCount=0;
  if(s.goldCleanCount==null)s.goldCleanCount=0;
  if(!game.artifacts)game.artifacts=defaultArtifactState();
  const a=game.artifacts;
  if(!a.owned)a.owned={};
  if(a.broomTier==null)a.broomTier=0;
  if(a.broomOwned==null)a.broomOwned=false;
  if(a.silverBroomUnlocked==null)a.silverBroomUnlocked=false;
  if(a.goldBroomUnlocked==null)a.goldBroomUnlocked=false;
}
function artStats(){migrateArtifacts();return game.artifactStats}
function artState(){migrateArtifacts();return game.artifacts}
function hasArtifact(id){return !!(artState().owned&&artState().owned[id])}
function artifactEncounterBlocking(){
  if(!game)return false;
  return !!(game._artifactEncounterActive||game._artifactRps||game._artifactLibGuess!=null||game._artifactCupPick);
}
function formatArtifactGrantHtml(id,how){
  const def=ARTIFACT_DEFS[id];if(!def)return '';
  return'<p style="font-size:1.05em"><b>'+def.icon+' '+def.name+'</b></p>'+
    (how?'<p style="margin-top:10px"><b>如何获得</b><br><span class="fold-meta">'+how+'</span></p>':'')+
    '<p style="margin-top:10px"><b>神器效果</b><br><span class="fold-meta">'+def.effect+'</span></p>';
}
function showArtifactInteractResult(opts){
  if(!opts)return;
  const payload={
    lane:'artifact',
    icon:opts.icon||'✨',
    title:opts.title||'结缘',
    html:opts.html||'',
    btn:opts.btn||'知道了',
    onClose:opts.onClose
  };
  if(typeof queueArtifactEncounter==='function')queueArtifactEncounter(payload);
  else if(typeof queueEncounterModal==='function')queueEncounterModal(payload);
  else if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:payload.icon,title:payload.title,html:payload.html,
      buttons:[{text:payload.btn,primary:true,handler:function(){
        if(typeof closeConsumeModal==='function')closeConsumeModal(true);
        if(payload.onClose)payload.onClose();
      }}]
    });
  }
}
function showArtifactGameResult(opts){
  if(!opts)return;
  const done=function(){
    if(typeof closeConsumeModal==='function')closeConsumeModal(true);
    if(opts.onClose)opts.onClose();
  };
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:opts.icon||'✨',title:opts.title||'',html:opts.html||'',
      buttons:[{text:opts.btn||'知道了',primary:true,handler:done}]
    });
    return;
  }
  showConsumeModal({
    icon:opts.icon||'✨',title:opts.title||'',html:opts.html||'',
    buttons:[{text:opts.btn||'知道了',primary:true,fn:'closeConsumeModal()'}]
  });
}
function grantArtifact(id,logMsg){
  if(!id||hasArtifact(id))return false;
  const def=ARTIFACT_DEFS[id];if(!def)return false;
  artState().owned[id]={week:game.week};
  addLog((def.icon||'✨')+' 获得神器【'+def.name+'】'+(logMsg?' · '+logMsg:''),'success');
  showArtifactInteractResult({
    icon:def.icon||'✨',
    title:'获得神器 · '+def.name,
    html:formatArtifactGrantHtml(id,logMsg),
    btn:'收下'
  });
  if(typeof renderSpendingPanel==='function')renderSpendingPanel();
  return true;
}
function grantArtifactMeet(id,how,meet){
  if(!id||hasArtifact(id))return;
  meet=meet||{};
  game._artifactEncounterActive=true;
  showArtifactGameResult({
    icon:meet.icon||'✨',
    title:meet.title||'遇见神人',
    html:meet.html||'<p>冥冥中有人向你伸来一只手……</p>',
    btn:meet.btn||'继续',
    onClose:function(){
      game._artifactEncounterActive=false;
      grantArtifact(id,how);
    }
  });
}
function artEffStat(k){
  if(typeof effStat==='function')return effStat(k);
  return Math.min(120,Math.max(0,(game.stats&&game.stats[k])||0));
}
function isLowAiCategory(cat){
  if(!game||!game.market||!cat)return false;
  const jobs=game.market.filter(j=>j.category===cat);
  if(!jobs.length)return false;
  const tot=jobs.reduce((x,j)=>x+j.jobs,0);
  const avg=jobs.reduce((x,j)=>x+j.exposure*j.jobs,0)/tot;
  return avg<=4;
}
function artifactTierRule(cat,imp,opts){
  opts=opts||{};
  const body=artEffStat('body'),mind=artEffStat('mind'),spirit=artEffStat('spirit');
  if(imp==='low')return true;
  if(imp==='mid'){
    if(opts.allStats80)return body>80&&mind>80&&spirit>80;
    if(opts.stat==='body')return body>100;
    if(opts.stat==='mind')return mind>100;
    if(opts.stat==='spirit')return spirit>100;
    return false;
  }
  if(imp==='high'){
    if(opts.allStats100)return body>100&&mind>100&&spirit>100;
    if(opts.stat==='body')return body>=120;
    if(opts.stat==='mind')return mind>=120;
    if(opts.stat==='spirit')return spirit>=120;
    return false;
  }
  return false;
}
function artifactGuaranteedFor(job,offer){
  if(!game||!job||!offer)return false;
  const cat=job.category,imp=offer.importance;
  if(hasArtifact('butian')&&cat===ART_CAT.agri&&artifactTierRule(cat,imp,{stat:'body'}))return true;
  if(hasArtifact('answerBook')&&cat===ART_CAT.edu&&artifactTierRule(cat,imp,{stat:'mind'}))return true;
  if(hasArtifact('xinliu')&&cat===ART_CAT.it&&artifactTierRule(cat,imp,{stat:'mind'}))return true;
  if(hasArtifact('casinoToken')&&cat===ART_CAT.it&&artifactTierRule(cat,imp,{stat:'mind'}))return true;
  if(hasArtifact('naotoule')&&cat===ART_CAT.media&&artifactTierRule(cat,imp,{stat:'spirit'}))return true;
  if(hasArtifact('roomKey')&&cat===ART_CAT.hotel&&artifactTierRule(cat,imp,{stat:'body'}))return true;
  if(hasArtifact('arrowTime')&&cat===ART_CAT.transport&&artifactTierRule(cat,imp,{stat:'body'}))return true;
  if(hasArtifact('lifeSecret')&&cat===ART_CAT.lifeSvc&&artifactTierRule(cat,imp,{stat:'spirit'}))return true;
  if(hasArtifact('resilientHeart')&&cat===ART_CAT.health){
    if(imp==='low')return true;
    if(imp==='mid')return artifactTierRule(cat,imp,{allStats80:true});
    if(imp==='high')return artifactTierRule(cat,imp,{allStats100:true});
  }
  if(hasArtifact('theVoice')&&cat===ART_CAT.law&&artifactTierRule(cat,imp,{stat:'spirit'}))return true;
  if(hasArtifact('superCup')&&cat===ART_CAT.mfg&&artifactTierRule(cat,imp,{stat:'mind'}))return true;
  if(hasArtifact('superCoupon')&&cat===ART_CAT.retail&&artifactTierRule(cat,imp,{stat:'mind'}))return true;
  if(hasArtifact('subwayCharm')&&cat===ART_CAT.green&&artifactTierRule(cat,imp,{stat:'spirit'}))return true;
  if(hasArtifact('capitalEye')&&cat===ART_CAT.finance){
    const p=artStats().stockRealizedProfit||0;
    if(imp==='low'&&p>=100000)return true;
    if(imp==='mid'&&p>=1000000)return true;
    if(imp==='high'&&p>=10000000)return true;
  }
  if(hasArtifact('constructionPass')&&cat===ART_CAT.construction){
    const n=artStats().remoteInterviews||0;
    if(imp==='low'&&n>=50)return true;
    if(imp==='mid'&&n>=100)return true;
    if(imp==='high'&&n>=500)return true;
  }
  if(hasArtifact('bizCharm')&&cat===ART_CAT.bizSvc){
    const n=(artStats().strangerSexIds||[]).length;
    if(imp==='low'&&n>=100)return true;
    if(imp==='mid'&&n>=500)return true;
    if(imp==='high'&&n>=1000)return true;
  }
  return false;
}
function artifactHireMult(job,offer){
  if(!game||!job||!offer||!isLowAiCategory(job.category))return 1;
  const imp=offer.importance,st=artState(),s=artStats();
  let mult=1;
  if(st.broomOwned&&s.normalCleanCount>=100&&imp==='low')mult*=2;
  if(st.broomTier>=2&&s.silverCleanCount>=100&&imp==='mid')mult*=2;
  if(st.broomTier>=3&&s.goldCleanCount>=100&&imp==='high')mult*=2;
  if(job.category===ART_CAT.it&&imp==='low'&&!hasArtifact('xinliu')){
    const u=s.computerUses||0;
    if(u>=10)mult*=1+Math.min(0.5,(u-10)*0.02);
  }
  return mult;
}
function recordJobListingsSeen(n){
  if(!game||!n)return;
  migrateArtifacts();
  artStats().jobListingsSeen=(artStats().jobListingsSeen||0)+n;
  if(artStats().jobListingsSeen>=10000)grantArtifact('xinliu','刷岗过万');
}
function recordScrollMediaHours(h){
  if(!game||!h)return;
  migrateArtifacts();
  artStats().scrollMediaHours=(artStats().scrollMediaHours||0)+h;
  if(artStats().scrollMediaHours>=1000)grantArtifact('naotoule','刷娱乐满千小时');
}
function recordStockTrade(sym,action,shares,price){
  if(!game||!sym||!shares||!price)return;
  migrateArtifacts();
  const s=artStats(),basis=s.stockCostBasis||{};
  if(action==='buy'){
    const prev=basis[sym]||{shares:0,cost:0};
    const cost=price*shares;
    basis[sym]={shares:prev.shares+shares,cost:prev.cost+cost};
  }else if(action==='sell'){
    const prev=basis[sym]||{shares:0,cost:0};
    const avg=prev.shares>0?prev.cost/prev.shares:0;
    const profit=price*shares-avg*shares;
    s.stockRealizedProfit=(s.stockRealizedProfit||0)+profit;
    prev.shares=Math.max(0,prev.shares-shares);
    prev.cost=Math.max(0,prev.cost-avg*shares);
    if(prev.shares<=0)delete basis[sym];else basis[sym]=prev;
    if(s.stockRealizedProfit>=100000)grantArtifact('capitalEye','炒股盈利达标');
  }
}
function recordCasinoSessionEnd(){
  if(!game||game._casinoSessionStartCash==null)return;
  const now=game.cash+(typeof chipMapTotal==='function'?chipMapTotal(game.chipHand):0);
  const delta=now-game._casinoSessionStartCash;
  game._casinoSessionStartCash=null;
  if(delta<=0)return;
  migrateArtifacts();
  artStats().casinoWinTotal=(artStats().casinoWinTotal||0)+delta;
  if(artStats().casinoWinTotal>=100000)grantArtifact('casinoToken','赌场累计赢利达标');
}
function recordRemoteInterview(){
  migrateArtifacts();
  const n=++artStats().remoteInterviews;
  if(n>=50&&!hasArtifact('constructionPass'))grantArtifact('constructionPass','异地面试'+n+'次');
}
function recordStrangerSex(contact){
  if(!contact||contact.kind==='spouse'||contact.id==='core_spouse')return;
  migrateArtifacts();
  const ids=artStats().strangerSexIds;
  if(ids.indexOf(contact.id)>=0)return;
  ids.push(contact.id);
  const n=ids.length;
  if(n>=100&&!hasArtifact('bizCharm'))grantArtifact('bizCharm','与'+n+'位陌生人亲密');
}
function recordImprisonOrExtort(){
  migrateArtifacts();
  artStats().imprisonExtortEvents=(artStats().imprisonExtortEvents||0)+1;
  if(!hasArtifact('theVoice')&&Math.random()<0.22)grantArtifact('theVoice','绝境中的低语');
}
function bumpArtifactStat(key,n){
  if(!game)return;
  migrateArtifacts();
  artStats()[key]=(artStats()[key]||0)+(n||1);
}
function tryArtifactEncounters(ctx){
  if(!game||game.gameOver)return;
  migrateArtifacts();
  const s=artStats();
  if(ctx==='park'&&s.parkVisits>=10&&!hasArtifact('butian')&&Math.random()<0.1)startShennongRps();
  else if(ctx==='library'&&!hasArtifact('answerBook')&&Math.random()<0.08)startLibrarianGuess();
  else if(ctx==='cafe'&&s.cafeVisits>=10&&!hasArtifact('superCup')&&Math.random()<0.12)startLaoluoCupGame();
  else if(ctx==='store'&&s.storeVisits>=10&&!hasArtifact('superCoupon')&&Math.random()<0.1)grantArtifactMeet('superCoupon','常去便利店，老板娘塞来一张发光优惠券',{
    icon:'🏪',title:'便利店 · 老顾客',
    html:'老板娘笑着拉住你：「这张券你拿着，以后用得上。」<br><span class="fold-meta">常来光顾的回报</span>'
  });
  else if(ctx==='hotel'&&s.hotelVisits>=10&&!hasArtifact('roomKey')&&Math.random()<0.1)grantArtifactMeet('roomKey','酒店熟客，前台悄悄塞来万能房卡',{
    icon:'🏨',title:'酒店 · 神秘前台',
    html:'前台压低声音：「这张房卡，任何房间都能开——别张扬。」'
  });
  else if(ctx==='drive'&&s.carDrives>=100&&!hasArtifact('arrowTime')&&Math.random()<0.08)grantArtifactMeet('arrowTime','公路百次，路牌下有人赠你沙漏挂坠',{
    icon:'🛣',title:'公路边的老人',
    html:'老人递来一枚沙漏挂坠：「路走多了，就懂时间往哪流。」'
  });
  else if(ctx==='subway'&&s.subwayRides>=100&&!hasArtifact('subwayCharm'))grantArtifactMeet('subwayCharm','地铁搭乘满百次，获赠电车挂件',{
    icon:'🚇',title:'地铁里的陌生人',
    html:'有人塞进你手里一个小挂件，转身消失在人群里。'
  });
  else if(ctx==='home'&&s.homeStays>=50&&!hasArtifact('lifeSecret')&&Math.random()<0.08)grantArtifactMeet('lifeSecret','宅家日久，悟得生活秘密',{
    icon:'🏠',title:'宅家的顿悟',
    html:'某个发呆的午后，你忽然想通了一些事——像有人在你耳边说了什么。'
  });
}
function onArtifactParkVisit(){bumpArtifactStat('parkVisits');tryArtifactEncounters('park')}
function onArtifactLibraryVisit(){bumpArtifactStat('libraryVisits');tryArtifactEncounters('library')}
function onArtifactComputerUse(){bumpArtifactStat('computerUses')}
function onArtifactHotelVisit(){bumpArtifactStat('hotelVisits');tryArtifactEncounters('hotel')}
function onArtifactCarDrive(){bumpArtifactStat('carDrives');tryArtifactEncounters('drive')}
function onArtifactSubwayRide(){bumpArtifactStat('subwayRides');tryArtifactEncounters('subway')}
function onArtifactHomeStay(){bumpArtifactStat('homeStays');tryArtifactEncounters('home')}
function onArtifactCafeVisit(){bumpArtifactStat('cafeVisits');tryArtifactEncounters('cafe')}
function onArtifactStoreVisit(){bumpArtifactStat('storeVisits');tryArtifactEncounters('store')}
function onArtifactStdVisit(wasCure){
  bumpArtifactStat('stdTreatVisits');
  if(wasCure&&!hasArtifact('resilientHeart')&&Math.random()<0.35)grantArtifact('resilientHeart','治愈性病');
}
function startShennongRps(){
  game._artifactEncounterActive=true;
  game._artifactRps={wins:0,losses:0,round:0};
  showShennongRpsModal();
}
function shennongRpsOutcome(r){
  if(!r)return {won:false,lost:false};
  if(r.wins>=3)return {won:true,lost:false};
  if(r.losses>=3)return {won:false,lost:true};
  const decisive=r.wins+r.losses;
  if(decisive>=5){
    if(r.wins>r.losses)return {won:true,lost:false};
    if(r.losses>r.wins)return {won:false,lost:true};
  }
  return {won:false,lost:false};
}
function showShennongRpsModal(){
  const r=game._artifactRps||{wins:0,losses:0,round:0};
  const decisive=r.wins+r.losses;
  const html='神农氏：「小友，猜拳吧！五局三胜，赢了就给你补天石。」<br><span class="fold-meta">平局不计 · 先赢3局，或满5局有效局后看谁胜得多</span><br>比分 你 '+r.wins+' : '+r.losses+' 神农（有效 '+decisive+'/5 局）';
  const btns=['石头','剪刀','布'].map((label,i)=>{
    const pick=['rock','scissors','paper'][i];
    return {text:label,fn:'playShennongRps(\''+pick+'\')'};
  });
  showConsumeModal({icon:'🌾',title:'遇见神农',html,buttons:btns});
}
function shennongPickLabel(p){
  return p==='rock'?'石头':p==='scissors'?'剪刀':'布';
}
function finishShennongRps(won,r){
  game._artifactRps=null;
  game._artifactEncounterActive=false;
  if(won){
    grantArtifact('butian','公园遇见神农氏，猜拳五局三胜');
    return;
  }
  addLog('猜拳落败，神农一笑而去','info');
  showArtifactInteractResult({
    icon:'🌾',title:'猜拳结束 · 神农离去',
    html:'<p>猜拳落败，神农一笑而去，身影没入林间。</p>'+
      '<p class="fold-meta">最终比分 你 '+(r.wins||0)+' : '+(r.losses||0)+' 神农 · 补天石与你无缘</p>',
    btn:'告别'
  });
}
function playShennongRps(playerPick){
  const picks=['rock','scissors','paper'];
  const god=picks[Math.floor(Math.random()*3)];
  const r=game._artifactRps||(game._artifactRps={wins:0,losses:0,round:0});
  r.round++;
  const win=(playerPick==='rock'&&god==='scissors')||(playerPick==='scissors'&&god==='paper')||(playerPick==='paper'&&god==='rock');
  const draw=playerPick===god;
  if(win)r.wins++;else if(!draw)r.losses++;
  const decisive=r.wins+r.losses;
  const outcome=shennongRpsOutcome(r);
  const won=outcome.won;
  const lost=outcome.lost;
  let roundHtml='你出 <b>'+shennongPickLabel(playerPick)+'</b> · 神农出 <b>'+shennongPickLabel(god)+'</b><br>';
  if(draw)roundHtml+='<p style="color:var(--yellow);margin-top:8px">本局平局（不计入胜负）</p>';
  else if(win)roundHtml+='<p style="color:var(--green);margin-top:8px">本局你赢了！</p>';
  else roundHtml+='<p style="color:var(--red);margin-top:8px">本局你输了</p>';
  roundHtml+='<p class="fold-meta">比分 你 '+r.wins+' : '+r.losses+' 神农 · 有效局 '+decisive+'/5</p>';
  if(typeof closeConsumeModal==='function')closeConsumeModal(true);
  showArtifactGameResult({
    icon:'🌾',
    title:won?'猜拳胜利！':lost?'猜拳结束':'猜拳 · 第 '+r.round+' 局',
    html:roundHtml,
    btn:won?'领取补天石':lost?'告别':'下一局',
    onClose:function(){
      if(won||lost)finishShennongRps(won,r);
      else showShennongRpsModal();
    }
  });
}
function startLibrarianGuess(){
  game._artifactEncounterActive=true;
  game._artifactLibGuess=10+Math.floor(Math.random()*90);
  showConsumeModal({
    icon:'📚',title:'神秘的图书管理员',
    html:'他低声说：「我心里有一个两位数，你只有一次机会。」<br><input id="libGuessInput" type="number" min="10" max="99" style="width:4em;margin-top:8px">',
    buttons:[{text:'猜！',primary:true,fn:'submitLibrarianGuess()'},{text:'放弃',fn:'abandonLibrarianGuess()'}]
  });
}
function abandonLibrarianGuess(){
  if(typeof closeConsumeModal==='function')closeConsumeModal(true);
  game._artifactLibGuess=null;
  game._artifactEncounterActive=false;
  addLog('图书管理员消失在书架间','info');
  showArtifactInteractResult({
    icon:'📚',title:'猜谜放弃',
    html:'你没有猜下去。图书管理员合上书，悄然消失在书架之间。',
    btn:'离开'
  });
}
function submitLibrarianGuess(){
  const el=document.getElementById('libGuessInput');
  const val=el?parseInt(el.value,10):NaN;
  const ans=game._artifactLibGuess;
  if(typeof closeConsumeModal==='function')closeConsumeModal(true);
  game._artifactLibGuess=null;
  game._artifactEncounterActive=false;
  if(val===ans){
    showArtifactGameResult({
      icon:'📚',title:'猜中了！',
      html:'图书管理员微微一笑：「不错，正是 <b>'+ans+'</b>。」<br><span class="fold-meta">他递给你一本泛黄的古书……</span>',
      btn:'接过书',
      onClose:function(){grantArtifact('answerBook','图书馆遇见神秘管理员，一次猜中其心数');}
    });
    return;
  }
  addLog('图书管理员摇摇头：「不对，是 '+ans+'。」','info');
  showArtifactInteractResult({
    icon:'📚',title:'猜谜失败',
    html:'图书管理员摇摇头：「不对，是 <b>'+ans+'</b>。」<br><span class="fold-meta">答案之书与你无缘</span>',
    btn:'告别'
  });
}
function startLaoluoCupGame(){
  game._artifactEncounterActive=true;
  const sizes=['中杯','大杯','特大杯','超大杯'];
  game._artifactCupPick=sizes[Math.floor(Math.random()*sizes.length)];
  const btns=sizes.map(s=>({text:s,fn:'pickLaoluoCup(\''+s+'\')'}));
  showConsumeModal({
    icon:'☕',title:'老罗的茶',
    html:'老罗：「年轻人，猜猜我今天要用哪个杯子？」',
    buttons:btns
  });
}
function pickLaoluoCup(choice){
  const want=game._artifactCupPick;
  if(typeof closeConsumeModal==='function')closeConsumeModal(true);
  game._artifactCupPick=null;
  game._artifactEncounterActive=false;
  if(choice===want){
    showArtifactGameResult({
      icon:'☕',title:'猜对了！',
      html:'老罗举起 <b>'+want+'</b> 笑了：「年轻人，眼光不错！」',
      btn:'接过杯子',
      onClose:function(){grantArtifact('superCup','咖啡店遇见老罗，猜中他今日用杯');}
    });
    return;
  }
  addLog('老罗举起'+want+'：「不对不对。」','info');
  showArtifactInteractResult({
    icon:'☕',title:'猜杯失败',
    html:'你选了 <b>'+choice+'</b>。老罗举起 <b>'+want+'</b>：「不对不对。」<br><span class="fold-meta">超级杯具与你擦肩</span>',
    btn:'告别'
  });
}
function buyBroom(tier){
  migrateArtifacts();
  const st=artState();
  if(tier===1){
    if(st.broomOwned){addLog('已有扫把','warn');return}
    if(typeof spendCash!=='function'||!spendCash(BROOM_COST,'扫把'))return;
    st.broomOwned=true;st.broomTier=1;
    addLog('🧹 购买扫把 ¥'+BROOM_COST+' · 宅家可打扫卫生','success');
  }else if(tier===2){
    if(!st.silverBroomUnlocked){addLog('须先用普通扫把打扫100次','warn');return}
    if(st.broomTier>=2){addLog('已有银扫把','warn');return}
    if(typeof spendCash!=='function'||!spendCash(SILVER_BROOM_COST,'银扫把'))return;
    st.broomTier=2;
    addLog('🧹 购买银扫把 ¥'+SILVER_BROOM_COST,'success');
  }else if(tier===3){
    if(!st.goldBroomUnlocked){addLog('须先用银扫把打扫100次','warn');return}
    if(st.broomTier>=3){addLog('已有金扫把','warn');return}
    if(typeof spendCash!=='function'||!spendCash(GOLD_BROOM_COST,'金扫把'))return;
    st.broomTier=3;
    addLog('🧹 购买金扫把 ¥'+GOLD_BROOM_COST,'success');
  }
  if(typeof renderSpendingPanel==='function')renderSpendingPanel();
}
function dailyCleanHome(){
  if(!artState().broomOwned){addLog('请先在生活消费购买扫把','fail');return}
  if(typeof dailyCanUseHours==='function'&&!dailyCanUseHours(1))return;
  const st=artState(),s=artStats();
  if(typeof addStress==='function')addStress(-1,'打扫卫生 ');
  if(st.broomTier===1)s.normalCleanCount=(s.normalCleanCount||0)+1;
  else if(st.broomTier===2)s.silverCleanCount=(s.silverCleanCount||0)+1;
  else if(st.broomTier>=3)s.goldCleanCount=(s.goldCleanCount||0)+1;
  if(s.normalCleanCount>=100)st.silverBroomUnlocked=true;
  if(s.silverCleanCount>=100)st.goldBroomUnlocked=true;
  addLog('🧹 打扫卫生 · 压力-1 · 累计 '+s.normalCleanCount+'/'+s.silverCleanCount+'/'+s.goldCleanCount,'info');
  if(typeof dailyAddHours==='function')dailyAddHours(1,false);
  else if(typeof dailyAdvanceAfterSlotAction==='function')dailyAdvanceAfterSlotAction();
  if(typeof renderDailyPanel==='function')renderDailyPanel();
}
function renderArtifactSpendingRows(){
  if(!game)return [];
  migrateArtifacts();
  const rows=[],st=artState();
  if(!st.broomOwned){
    rows.push({label:'🧹 扫把 ¥'+BROOM_COST,meta:'宅家打扫卫生 · 每次-1压力 · 扫100次解锁银扫把',btn:'购买',fn:'buyBroom(1)',off:false});
  }
  if(st.silverBroomUnlocked&&st.broomTier<2){
    rows.push({label:'🧹 银扫把 ¥'+SILVER_BROOM_COST,meta:'已普通扫满100次 · 再扫100次解锁金扫把',btn:'购买',fn:'buyBroom(2)',off:false});
  }
  if(st.goldBroomUnlocked&&st.broomTier<3){
    rows.push({label:'🧹 金扫把 ¥'+GOLD_BROOM_COST,meta:'已银扫满100次 · AI影响小的行业总监录取×2',btn:'购买',fn:'buyBroom(3)',off:false});
  }
  Object.keys(ARTIFACT_DEFS).forEach(id=>{
    if(!hasArtifact(id))return;
    const d=ARTIFACT_DEFS[id];
    rows.push({label:d.icon+' '+d.name+'（神器）',meta:d.effect,btn:'已拥有',fn:'',off:true});
  });
  return rows;
}
