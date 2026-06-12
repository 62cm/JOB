/* 日常 · 应聘求职（不跳转求职页 · 与宅家共用时段小时） */
const APP_PICK_META={
  boss:{hint:'优选脑力·头部/重点'},
  lagou:{hint:'优选互联网·脑力'},
  liepin:{hint:'优选高管·头部'},
  zhilian:{hint:'优选中小·体力'},
  '51job':{hint:'优选基层·中小'}
};
const JOB_APP_BROWSE_H=1;
const JOB_HEADHUNTER_H=4;
const JOB_REFERRAL_H=4;

function dailyJobSlotKey(){
  const d=game&&game.daily;
  if(!d)return 'morning';
  if(d.phase==='evening')return 'evening';
  if(d.phase==='allnight')return 'allnight';
  return 'morning';
}
function dailyJobDrawSeed(appKey){
  const d=game.daily||{};
  const ph={morning:0,evening:1,rest:2,allnight:3}[d.phase||'morning']||0;
  let h=0;
  for(let i=0;i<(appKey||'').length;i++)h=(h*31+appKey.charCodeAt(i))|0;
  return game.week*10000+d.dayIndex*100+ph*17+(h&0xffff);
}
function ensureDailyJobState(){
  const d=ensureDailyState();
  if(!d.jobSubMenu)d.jobSubMenu=null;
  if(!d.dailyPickJobIdxs)d.dailyPickJobIdxs=[];
  if(d.dailyAppRefreshN==null)d.dailyAppRefreshN=0;
  if(!d.dailyListingSort)d.dailyListingSort='default';
  if(d.jobInboxReturnTo===undefined)d.jobInboxReturnTo=null;
  return d;
}
function dailyJobHourlyBlocked(silent){
  const d=game&&game.daily;
  if(!d)return true;
  if(d.slotActivity==='out'){if(!silent)addLog('外出占用整个时段，无法刷招聘APP或投递','fail');return true}
  if(d.slotActivity==='work'||d.inOvertime){if(!silent)addLog('上班中无法进行应聘操作','fail');return true}
  return false;
}
function dailySpendJobHours(h,logMsg){
  if(dailyJobHourlyBlocked())return false;
  if(!dailyCanUseHours(h))return false;
  const d=ensureDailyState();
  if(d.slotActivity!=='job'&&d.slotActivity!=='out'&&d.slotActivity!=='work')d.slotActivity='job';
  dailyAddHours(h,false);
  if(logMsg)addLog(logMsg,'info');
  return true;
}
function countJobInboxUnread(){
  if(!game||!game.inbox||typeof classifyInboxItem!=='function')return 0;
  let n=0;
  game.inbox.forEach(it=>{
    if(it.type==='ghost'||it.type==='reject'){n++;return}
    if(it.type!=='interview')return;
    const app=game.applications.find(a=>a.id===it.id);
    if(!app)return;
    const cat=classifyInboxItem(it,app);
    if(cat==='active')n++;
  });
  return n;
}
function listingAlreadyApplied(item){
  if(!game||!game.applications||!item)return false;
  const co=item.offer&&item.offer.company;
  return game.applications.some(a=>{
    if(a.jobIdx!==item.jobIdx)return false;
    const ac=a.offer&&a.offer.company;
    if(!ac||!co)return false;
    return(ac.id&&co.id&&ac.id===co.id)||ac.name===co.name;
  });
}
function dailyHeadhunterOk(){
  return typeof canUseHeadhunter==='function'&&canUseHeadhunter();
}
function dailyHeadhunterHint(){
  return dailyHeadhunterOk()?'投递占用4h · 入职成功收年薪20%':'需C9/常春藤或曾任专家/总监/头部企业';
}
function dailyAppSubscribed(appKey){
  return typeof isAppSubscribed==='function'&&isAppSubscribed(appKey);
}
function dailyAppSubHint(appKey){
  if(!game)return '';
  const exp=game.appSubscriptions&&game.appSubscriptions[appKey];
  if(exp>game.week)return '已开通至 '+getDateStr(exp)+' · 不自动续费';
  if(exp&&exp<=game.week)return '已到期 · ¥'+(typeof APP_COST_EACH!=='undefined'?APP_COST_EACH:100)+'/月重新开通';
  return '未开通 · ¥'+(typeof APP_COST_EACH!=='undefined'?APP_COST_EACH:100)+'/月 · 不自动续费';
}
function dailySubscribeApp(appKey){
  if(!game||dailyAppSubscribed(appKey))return true;
  const cost=typeof APP_COST_EACH!=='undefined'?APP_COST_EACH:100;
  if(game.cash<cost){addLog('现金不足，开通需 ¥'+cost,'fail');return false}
  game.cash-=cost;
  game.jobHuntSpent=(game.jobHuntSpent||0)+cost;
  if(typeof ledgerRecordJobHunt==='function')ledgerRecordJobHunt(cost,JOB_APPS[appKey]+'包月');
  if(typeof activateAppSubscriptions==='function')activateAppSubscriptions([appKey]);
  if(typeof updateAppSubscriptionLabels==='function')updateAppSubscriptionLabels();
  addLog('📱 开通 '+JOB_APPS[appKey]+' 至 '+getDateStr(game.appSubscriptions[appKey])+'（不自动续费，到期需重新开通）','success');
  renderDailyPanel();
  return true;
}
function dailyEligibleJobIdxs(){
  return game.market.map((j,i)=>i).filter(i=>{
    const j=game.market[i];
    return typeof canApplyJob==='function'?canApplyJob(j):true;
  }).filter(i=>typeof isOverAgeLimit!=='function'||!isOverAgeLimit(game.market[i]));
}
function dailyAppListingCount(refreshN,appKey){
  const d=game.daily||{};
  const mult=d.phase==='allnight'?2:1;
  const r=seededRand(dailyJobDrawSeed(appKey)+(refreshN||0)*9973+game.week*3);
  const base=5+Math.floor(r()*(16));
  return Math.max(mult===2?10:5,Math.min(40,base*mult));
}
function dailyBeginJobChannel(method){
  if(game.homeless){addLog('流浪中无法求职','fail');return}
  if(game.casinoActive||game.marketActive){addLog('请先结束赌场/人才市场','warn');return}
  const slot=dailyJobSlotKey();
  if((method==='market'||method==='headhunter')&&slot!=='morning'){
    addLog('线下与猎头仅限白天','fail');return;
  }
  const d=ensureDailyJobState();
  if(method==='market'){
    if(dailyJobHourlyBlocked())return;
    if(!dailyUseMainActivity())return;
    d.slotActivity='job';
    game.dailyApplyContext={slot,drawMult:1,market:true};
    if(typeof enterMarket==='function')enterMarket(true);
    return;
  }
  if(method==='headhunter'){
    if(dailyJobHourlyBlocked())return;
    if(!dailyHeadhunterOk()){addLog('猎头渠道未解锁','fail');return}
    if(dailySlotHoursLeft()<JOB_HEADHUNTER_H){addLog('猎头投递需 '+JOB_HEADHUNTER_H+'h，本时段只剩 '+dailySlotHoursLeft()+'h','fail');return}
    d.jobSubMenu='headhunter_jobs';
    d.dailyPickJobIdxs=[];
    renderDailyPanel();return;
  }
  if(method==='app'){
    if(typeof canUseJobApp==='function'&&!canUseJobApp()){
      addLog(typeof jobAppBlockMessage==='function'?jobAppBlockMessage():'无法使用招聘APP','fail');
      return;
    }
    if(dailyJobHourlyBlocked())return;
    if(dailySlotHoursLeft()<JOB_APP_BROWSE_H){addLog('刷APP需 '+JOB_APP_BROWSE_H+'h/次，本时段只剩 '+dailySlotHoursLeft()+'h','fail');return}
    d.jobSubMenu='app_select';
    d.dailyPickApp=null;
    d.dailyPickJobIdxs=[];
    d.dailyAppListings=null;
    d.dailyAppRefreshN=0;
    renderDailyPanel();return;
  }
}
function dailyJobBack(){
  const d=ensureDailyJobState();
  if(d.jobSubMenu==='app_list'){
    d.jobSubMenu='app_jobs';
    d.dailyAppListings=null;
  }else if(d.jobSubMenu==='app_jobs'||d.jobSubMenu==='app_select'||d.jobSubMenu==='headhunter_jobs'||d.jobSubMenu==='inbox'){
    d.jobSubMenu=null;
    d.dailyPickApp=null;
    d.dailyPickJobIdxs=[];
    d.dailyAppListings=null;
    d.dailyAppRefreshN=0;
  }else{
    d.subMenu=null;
    d.jobSubMenu=null;
  }
  renderDailyPanel();
}
function dailyOpenJobInbox(){
  const d=ensureDailyJobState();
  if(d.jobSubMenu!=='inbox')d.jobInboxReturnTo=d.jobSubMenu;
  d.jobSubMenu='inbox';
  if(typeof syncInviteExpiryState==='function')syncInviteExpiryState();
  renderDailyPanel();
}
function dailyCloseJobInbox(){
  const d=ensureDailyJobState();
  d.jobSubMenu=d.jobInboxReturnTo!=null?d.jobInboxReturnTo:null;
  d.jobInboxReturnTo=null;
  renderDailyPanel();
}
function dailyPickApp(appKey){
  if(!dailyAppSubscribed(appKey)){
    addLog('请先开通 '+JOB_APPS[appKey]+'（包月不自动续费）','fail');
    return;
  }
  const d=ensureDailyJobState();
  d.dailyPickApp=appKey;
  d.jobSubMenu='app_jobs';
  d.dailyPickJobIdxs=[];
  d.dailyAppListings=null;
  d.dailyAppRefreshN=0;
  renderDailyPanel();
}
function dailyTogglePickJob(ji){
  const d=ensureDailyJobState();
  if(!d.dailyPickJobIdxs)d.dailyPickJobIdxs=[];
  const idx=d.dailyPickJobIdxs.indexOf(ji);
  if(idx>=0)d.dailyPickJobIdxs.splice(idx,1);
  else d.dailyPickJobIdxs.push(ji);
  renderDailyPanel();
}
function dailyDrawAppListings(refresh){
  const d=ensureDailyJobState();
  const appKey=d.dailyPickApp;
  const jobIdxs=d.dailyPickJobIdxs||[];
  if(!appKey||!jobIdxs.length){addLog('请先选APP和职业','fail');return}
  if(typeof validateJobsForApply==='function'&&!validateJobsForApply(jobIdxs))return;
  if(!dailySpendJobHours(JOB_APP_BROWSE_H,'📱 刷招聘APP -'+JOB_APP_BROWSE_H+'h'))return;
  if(refresh)d.dailyAppRefreshN=(d.dailyAppRefreshN||0)+1;
  else d.dailyAppRefreshN=0;
  const slot=dailyJobSlotKey();
  const drawCount=dailyAppListingCount(d.dailyAppRefreshN,appKey);
  const opts={
    forceMethod:'app',
    slot,
    drawMult:slot==='allnight'?2:1,
    apps:[appKey],
    drawCount,
    seedExtra:dailyJobDrawSeed(appKey)+d.dailyAppRefreshN*9973
  };
  const rc={upfront:0,onSuccess:0,label:JOB_APPS[appKey],apps:[appKey]};
  let batch;
  try{batch=typeof drawRecruitmentRound==='function'?drawRecruitmentRound(jobIdxs,rc,opts):null}
  catch(e){addLog('抽取岗位失败','fail');return}
  if(!batch||!batch.listings.length){addLog(JOB_APPS[appKey]+' 本次未刷到岗位（-'+JOB_APP_BROWSE_H+'h）','warn');renderDailyPanel();return}
  d.dailyAppListings=batch.listings;
  d.dailyListingSort='default';
  d.jobSubMenu='app_list';
  addLog('📋 刷到 '+batch.listings.length+' 条岗位'+(slot==='allnight'?'（通宵×2）':''),'info');
  renderDailyPanel();
}
function dailyRunHeadhunterApply(){
  const d=ensureDailyJobState();
  const jobIdxs=d.dailyPickJobIdxs||[];
  if(!jobIdxs.length){addLog('请至少选择一个职业','fail');return}
  if(!dailySpendJobHours(JOB_HEADHUNTER_H,'🎯 猎头投递 -'+JOB_HEADHUNTER_H+'h'))return;
  const slot=dailyJobSlotKey();
  game.dailyApplyContext={slot,drawMult:1,market:false};
  if(typeof runApplyRound==='function')runApplyRound(jobIdxs,{slot,forceMethod:'headhunter',drawMult:1});
}
function dailySubmitAppListings(){
  const d=ensureDailyJobState();
  const listings=d.dailyAppListings||[];
  const picks=[...document.querySelectorAll('.daily-listing-pick:checked')];
  if(!picks.length){addLog('请勾选要投的岗位','fail');return}
  const uids=new Set(picks.map(cb=>cb.dataset.uid));
  const selected=listings.filter(it=>uids.has(it.uid)&&!listingAlreadyApplied(it));
  if(!selected.length){addLog('所选岗位均已投过','warn');return}
  const appKey=d.dailyPickApp;
  const rc={upfront:0,label:JOB_APPS[appKey],apps:[appKey]};
  if(typeof markStealthJobSearch==='function'&&game.employed)markStealthJobSearch();
  let plannedCount=0;
  selected.forEach((item,idx)=>{
    const id='app_'+game.week+'_'+idx+'_'+Math.floor(Math.random()*9999);
    const replyWeek=typeof calcApplicationReplyWeek==='function'?calcApplicationReplyWeek(item.offer,game.week,item.jobIdx):game.week+2;
    if(item.offer.planned)plannedCount++;
    game.applications.push({
      id,jobIdx:item.jobIdx,offer:{...item.offer,apps:[appKey],method:'app'},
      status:'pending',applyWeek:game.week,replyWeek,planned:!!item.offer.planned,
      interviewWeek:null,resultWeek:null,viaReferral:false,method:'app',resumeCostLabel:rc.label
    });
    game.totalApplications++;
    if(item.category)game.appliedCategories[item.category]=true;
  });
  addLog('📤 【'+rc.label+'】投递 '+selected.length+' 份简历','info');
  if(plannedCount)addLog('📅 '+plannedCount+' 个预定招聘已记入日历','info');
  if(typeof updateLongDistanceStatus==='function')updateLongDistanceStatus();
  if(typeof renderInterviewCalendar==='function')renderInterviewCalendar();
  renderDailyPanel();
}
function dailyJobExitToMain(){
  dailyBackToMain();
}
function dailyToggleAllListings(on){
  document.querySelectorAll('.daily-listing-pick').forEach(cb=>{cb.checked=!!on});
  dailyUpdateListingPickCount();
}
function dailyUpdateListingPickCount(){
  const el=document.getElementById('dailyListingPickCount');
  if(!el)return;
  const n=document.querySelectorAll('.daily-listing-pick:checked').length;
  el.textContent='已选 '+n+' 个岗位';
}
function dailySortAppListings(){
  const d=ensureDailyJobState();
  d.dailyListingSort=d.dailyListingSort==='pay'?'default':'pay';
  renderDailyPanel();
}
function renderDailyJobBottomBtns(html){
  return '<div class="daily-job-actions-bottom">'+html+'</div>';
}
function renderDailyJobTreemap(selectedArr){
  if(!game)return '';
  const picked=new Set(selectedArr||[]);
  const extra=j=>{
    if(typeof canApplyJob==='function'&&!canApplyJob(j))return false;
    if(typeof isOverAgeLimit==='function'&&isOverAgeLimit(j))return false;
    return true;
  };
  let jobs=typeof filterJobsForTreemap==='function'?filterJobsForTreemap(extra):game.market.filter(extra);
  const byCat={};
  jobs.forEach(j=>{(byCat[j.category]=byCat[j.category]||[]).push(j)});
  const cats=Object.keys(byCat).sort((a,b)=>{
    const ka=byCat[a].reduce((s,j)=>s+jobSortKey(j),0)/byCat[a].length;
    const kb=byCat[b].reduce((s,j)=>s+jobSortKey(j),0)/byCat[b].length;
    return kb-ka;
  });
  const sk=jobSortKey;
  let h='<div class="job-treemap daily-job-treemap">';
  cats.forEach(cat=>{
    const catJobs=[...byCat[cat]].sort((a,b)=>sk(b)-sk(a));
    const maxJ=Math.max(...catJobs.map(j=>j.jobs),1);
    const totalJ=catJobs.reduce((s,j)=>s+j.jobs,0);
    const tiles=catJobs.map(job=>{
      const sc=Math.sqrt(job.jobs/maxJ), w=Math.round(68+sc*118), hpx=Math.round(48+sc*76);
      const cur=game.employed&&job.idx===game.employment?.jobIdx;
      const multi=picked.has(job.idx);
      return '<div class="job-tile'+(multi?' multi-selected':'')+(cur?' current-job':'')+'" style="flex:0 0 auto;width:'+w+'px;height:'+hpx+'px;background:'+aiExposureColor(job.exposure)+'" onclick="dailyTogglePickJob('+job.idx+')">'+
        '<div class="jt-title">'+job.title+(cur?' ✓':'')+'</div>'+
        '<div class="jt-meta">¥'+(job.pay/10000).toFixed(1)+'万 · 热'+job.heatPct+'%</div>'+
        '<div class="jt-stats"><span>AI '+job.exposure+'</span><span>'+fmtJobsShort(job.jobs)+'人</span></div></div>';
    }).join('');
    h+='<div class="industry-block"><div class="industry-hdr"><span>'+cat+'</span><span style="font-size:.7rem;color:var(--muted)">'+fmtJobsCount(totalJ)+'</span></div><div class="industry-inner">'+tiles+'</div></div>';
  });
  h+='</div>';
  const filterNote=(typeof applyCategoryPicks!=='undefined'&&applyCategoryPicks.size)?' · 已筛 '+applyCategoryPicks.size+' 个行业':'';
  const searchEl=typeof document!=='undefined'?document.getElementById('searchInput'):null;
  const searchNote=searchEl&&searchEl.value.trim()?' · 搜索「'+searchEl.value.trim()+'」':'';
  h+='<p class="fold-meta">点击方块多选 · 已选 '+picked.size+' 个 · 左侧行业/排序/搜索同步'+filterNote+searchNote+'</p>';
  return h;
}
function renderDailyListingToolbar(sort,pickN){
  return '<div class="daily-listing-toolbar">'+
    '<button type="button" class="btn" onclick="dailyToggleAllListings(true)">全选</button>'+
    '<button type="button" class="btn" onclick="dailyToggleAllListings(false)">全不选</button>'+
    '<button type="button" class="btn'+(sort==='pay'?' active':'')+'" onclick="dailySortAppListings()">'+(sort==='pay'?'已按年薪排序':'按年薪排序')+'</button>'+
    '<span class="fold-meta" id="dailyListingPickCount">已选 '+(pickN!=null?pickN:0)+' 个岗位</span></div>';
}
function renderDailyListingRow(item,checked){
  const o=item.offer;
  const applied=listingAlreadyApplied(item);
  if(applied){
    const imp=o.roleExtra?IMP_LABEL[o.importance]+'·'+ROLE_EXTRA[o.roleExtra]:IMP_LABEL[o.importance];
    const pay=formatOfferPay(o);
    const start=o.planned?'<span style="color:var(--blue)">预定招聘</span> · 入职约'+o.startDelayWeeks+'周后':'上岗约'+o.startDelayWeeks+'周内';
    return '<div class="company-row picked daily-applied"><span class="fold-meta" style="color:var(--green);flex-shrink:0">已投过</span>'+
      '<div style="flex:1"><b>'+o.company.name+'</b> '+fmtCompanyBadge(o.company)+' · <b>'+imp+'</b>'+(o.planned?' <span style="color:var(--blue);font-size:.68rem">预定</span>':'')+'<br>'+
      '招：'+item.jobTitle+' · '+pay+' · '+start+' · '+formatListingInterviewHint(o)+
      (isRemoteCompany(o.company)?' · <span style="color:var(--orange)">'+getCompanyCity(o.company)+'</span>':'')+'<br>'+
      '<span style="color:var(--muted)">'+o.welfare+'</span></div></div>';
  }
  const imp=o.roleExtra?IMP_LABEL[o.importance]+'·'+ROLE_EXTRA[o.roleExtra]:IMP_LABEL[o.importance];
  const pay=formatOfferPay(o);
  const start=o.planned?'<span style="color:var(--blue)">预定招聘</span> · 入职约'+o.startDelayWeeks+'周后（提前半年左右）':'上岗约'+o.startDelayWeeks+'周内';
  return '<label class="company-row picked"><input type="checkbox" class="daily-listing-pick" data-uid="'+item.uid+'"'+(checked?' checked':'')+' onchange="dailyUpdateListingPickCount()">'+
    '<div style="flex:1"><b>'+o.company.name+'</b> '+fmtCompanyBadge(o.company)+' · <b>'+imp+'</b>'+(o.planned?' <span style="color:var(--blue);font-size:.68rem">预定</span>':'')+'<br>'+
    '招：'+item.jobTitle+' · '+pay+' · '+start+' · '+formatListingInterviewHint(o)+
    (isRemoteCompany(o.company)?' · <span style="color:var(--orange)">'+getCompanyCity(o.company)+'</span>':'')+'<br>'+
    '<span style="color:var(--muted)">'+o.welfare+'</span></div></label>';
}
function renderDailyAppListingRows(listings,sort){
  let rows=[...(listings||[])];
  if(sort==='pay'&&typeof effectiveListingPay==='function')rows.sort((a,b)=>effectiveListingPay(b)-effectiveListingPay(a));
  let h='<div class="daily-app-listings">';
  rows.forEach(item=>{h+=renderDailyListingRow(item,true)});
  h+='</div>';
  return h;
}
function renderDailyMailBtn(unread){
  return '<button class="btn mail-badge-wrap" onclick="dailyOpenJobInbox()">📬 应聘邮箱'+
    (unread?'<span class="mail-unread">'+unread+'</span>':'')+'</button>';
}
function renderDailyJobInboxPanel(){
  if(typeof syncInviteExpiryState==='function')syncInviteExpiryState();
  const raw=(game.inbox||[]).filter(x=>{
    if(x.type==='ghost'||x.type==='reject')return true;
    if(x.type!=='interview')return false;
    const app=game.applications.find(a=>a.id===x.id);
    if(app&&['interview_scheduled','offered','silent'].includes(app.status))return false;
    return true;
  });
  let h='<p class="fold-meta">招聘回复 · 与求职页收件箱相同</p>';
  if(!raw.length)h+='<p style="color:var(--muted)">暂无回复</p>';
  else{
    const buckets={active:[],expired:[],ghost:[],rejected:[]};
    raw.forEach(it=>{
      const app=game.applications.find(a=>a.id===it.id||(it.type==='reject'&&it.id===a.id+'_rej'));
      const cat=typeof classifyInboxItem==='function'?classifyInboxItem(it,app):'expired';
      if(buckets[cat])buckets[cat].push(it);else buckets.expired.push(it);
    });
    if(typeof sortInterviewInboxItems==='function'){
      Object.keys(buckets).forEach(k=>{buckets[k]=sortInterviewInboxItems(buckets[k])});
    }
    if(typeof renderInboxCategory==='function'){
      h+=renderInboxCategory('待处理 · 面试邀请','active',buckets.active,false);
      h+=renderInboxCategory('已失效','expired',buckets.expired,true);
      h+=renderInboxCategory('未通过筛选','ghost',buckets.ghost,true);
      h+=renderInboxCategory('面试未通过','rejected',buckets.rejected,true);
    }
  }
  h+=renderDailyJobBottomBtns('<button class="btn" onclick="dailyCloseJobInbox()">← 返回</button> <button class="btn" onclick="dailyJobExitToMain()">退出</button>');
  return h;
}
function renderDailyReferralBtn(){
  const has=game&&game.referralOpportunity;
  const blocked=typeof dailyJobHourlyBlocked==='function'&&dailyJobHourlyBlocked(true);
  const left=typeof dailySlotHoursLeft==='function'?dailySlotHoursLeft():0;
  if(!has||game.casinoActive||game.marketActive)return '<button class="btn disabled-referral" disabled>🤝 内推机会</button>';
  if(blocked||left<(typeof JOB_REFERRAL_H!=='undefined'?JOB_REFERRAL_H:4))return '<button class="btn disabled-referral" disabled title="需'+JOB_REFERRAL_H+'h">🤝 内推机会</button>';
  return '<button class="btn" onclick="dailyOpenReferralModal()">🤝 内推机会（-'+JOB_REFERRAL_H+'h）</button>';
}
function dailyOpenReferralModal(){
  if(!game||!game.referralOpportunity||game.casinoActive||game.marketActive)return;
  if(dailyJobHourlyBlocked())return;
  if(dailySlotHoursLeft()<JOB_REFERRAL_H){addLog('内推投递需 '+JOB_REFERRAL_H+'h，本时段只剩 '+dailySlotHoursLeft()+'h','fail');return}
  if(typeof openReferralModal==='function')openReferralModal();
}
function renderDailyJobMenu(phase){
  const d=ensureDailyJobState();
  const unread=countJobInboxUnread();
  const left=dailySlotHoursLeft();
  if(d.jobSubMenu==='inbox')return renderDailyJobInboxPanel();
  if(d.jobSubMenu==='app_select'){
    let h='<p class="fold-meta">① 单选APP · 包月不自动续费 · 到期需重新开通 · 刷岗 '+JOB_APP_BROWSE_H+'h/次 · 剩 '+left+'h</p>';
    Object.keys(JOB_APPS).forEach(k=>{
      const meta=APP_PICK_META[k]||{};
      const sub=dailyAppSubscribed(k);
      h+='<div style="margin:6px 0;padding:6px;border:1px solid var(--border);border-radius:6px">';
      h+='<div><b>'+JOB_APPS[k]+'</b> <span class="fold-meta">'+meta.hint+'</span></div>';
      h+='<div class="fold-meta">'+dailyAppSubHint(k)+'</div>';
      if(sub)h+='<button class="btn btn-primary" style="margin-top:4px" onclick="dailyPickApp(\''+k+'\')">进入</button>';
      else h+='<button class="btn" style="margin-top:4px" onclick="dailySubscribeApp(\''+k+'\')">开通包月 ¥'+(typeof APP_COST_EACH!=='undefined'?APP_COST_EACH:100)+'</button>';
      h+='</div>';
    });
    h+=renderDailyJobBottomBtns('<button class="btn" onclick="dailyJobBack()">← 返回</button> '+renderDailyMailBtn(unread)+' <button class="btn" onclick="dailyJobExitToMain()">退出</button>');
    return h;
  }
  if(d.jobSubMenu==='app_jobs'){
    const picked=d.dailyPickJobIdxs||[];
    let h='<p class="fold-meta">② '+JOB_APPS[d.dailyPickApp]+' · 点方块选职业 · 首次刷岗 -'+JOB_APP_BROWSE_H+'h · 5-20条'+(phase==='allnight'?'（通宵×2）':'')+' · 剩 '+left+'h</p>';
    h+=renderDailyJobTreemap(picked);
    const canBrowse=left>=JOB_APP_BROWSE_H&&!dailyJobHourlyBlocked(true);
    h+=renderDailyJobBottomBtns(
      '<button class="btn btn-primary" '+(canBrowse?'':'disabled')+' onclick="dailyDrawAppListings(false)">查看岗位（-'+JOB_APP_BROWSE_H+'h）</button> '+
      renderDailyMailBtn(unread)+' <button class="btn" onclick="dailyJobBack()">← 返回</button> <button class="btn" onclick="dailyJobExitToMain()">退出</button>'
    );
    return h;
  }
  if(d.jobSubMenu==='app_list'){
    const n=(d.dailyAppListings||[]).length;
    const sort=d.dailyListingSort||'default';
    const listings=d.dailyAppListings||[];
    const pickN=listings.filter(it=>!listingAlreadyApplied(it)).length;
    let h='<p class="fold-meta">③ '+JOB_APPS[d.dailyPickApp]+' · 共 '+n+' 条 · 刷新 -'+JOB_APP_BROWSE_H+'h/次 · 剩 '+left+'h</p>';
    h+=renderDailyListingToolbar(sort,pickN);
    h+=renderDailyAppListingRows(listings,sort);
    h+=renderDailyJobBottomBtns(
      '<button class="btn btn-primary" onclick="dailySubmitAppListings()">确认投递</button> '+
      '<button class="btn" '+(left>=JOB_APP_BROWSE_H?'':'disabled')+' onclick="dailyDrawAppListings(true)">🔄 刷新（-'+JOB_APP_BROWSE_H+'h）</button> '+
      '<button class="btn" onclick="dailyJobBack()">重选职业</button> '+
      renderDailyMailBtn(unread)+' <button class="btn" onclick="dailyJobExitToMain()">退出</button>'
    );
    return h;
  }
  if(d.jobSubMenu==='headhunter_jobs'){
    let h='<p class="fold-meta">猎头 · 点方块选职业 · 抽取投递 -'+JOB_HEADHUNTER_H+'h · 剩 '+left+'h</p>';
    h+=renderDailyJobTreemap(d.dailyPickJobIdxs||[]);
    h+=renderDailyJobBottomBtns(
      '<button class="btn btn-primary" '+(left>=JOB_HEADHUNTER_H?'':'disabled')+' onclick="dailyRunHeadhunterApply()">抽取并投递（-'+JOB_HEADHUNTER_H+'h）</button> '+
      renderDailyMailBtn(unread)+' <button class="btn" onclick="dailyJobBack()">← 返回</button> <button class="btn" onclick="dailyJobExitToMain()">退出</button>'
    );
    return h;
  }
  let h='<p class="fold-meta">与宅家共用本时段 '+SLOT_HOURS_TOTAL+'h · 剩 <b>'+left+'</b>h · 外出/上班/人才市场占满时段</p>';
  h+='<div class="daily-job-channel-row">';
  h+='<button class="btn mail-badge-wrap" onclick="dailyOpenJobInbox()">📬 应聘邮箱'+
    (unread?'<span class="mail-unread">'+unread+'</span>':'')+'</button> ';
  h+=renderDailyReferralBtn()+'</div>';
  const appCost=typeof APP_COST_EACH!=='undefined'?APP_COST_EACH:100;
  if(phase==='morning'){
    h+='<button class="btn" style="display:block;width:100%;margin:6px 0;text-align:left" onclick="dailyBeginJobChannel(\'app\')">'+
      '📱 招聘APP<br><span class="fold-meta">包月¥'+appCost+'/平台 · 不自动续费 · 刷岗'+JOB_APP_BROWSE_H+'h/次 · 5-20条</span></button>';
    h+='<button class="btn" style="display:block;width:100%;margin:6px 0;text-align:left" onclick="dailyBeginJobChannel(\'market\')">'+
      '🏢 线下人才市场<br><span class="fold-meta">¥'+(typeof MARKET_ENTRY_FEE!=='undefined'?MARKET_ENTRY_FEE:200)+' · 占满本时段 · 8小时场内</span></button>';
    h+='<button class="btn" '+(dailyHeadhunterOk()?'':'disabled')+' style="display:block;width:100%;margin:6px 0;text-align:left" onclick="dailyBeginJobChannel(\'headhunter\')">'+
      '🎯 猎头<br><span class="fold-meta">'+dailyHeadhunterHint()+'</span></button>';
  }else if(phase==='evening'||phase==='allnight'){
    h+='<p class="fold-meta" style="margin:4px 0">晚上/通宵仅招聘APP'+(phase==='allnight'?' · 岗位数×2':'')+'</p>';
    h+='<button class="btn" style="display:block;width:100%;margin:6px 0" onclick="dailyBeginJobChannel(\'app\')">'+
      '📱 招聘APP · '+JOB_APP_BROWSE_H+'h/次 · 5-20条'+(phase==='allnight'?'（通宵10-40条）':'')+'</button>';
  }
  h+='<button class="btn" onclick="dailyJobExitToMain()">退出</button>';
  return h;
}
