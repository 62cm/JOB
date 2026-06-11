/* 自动生活 — 由 build.js 注入 */
const AUTO_LIFE_PERIODS={
  week:{label:'一周',weeks:1},
  month:{label:'一个月',weeks:4},
  quarter:{label:'一个季度',weeks:12},
  year:{label:'一年',weeks:52}
};
let autoLifeRunning=false;
let _autoLifeJob=null;
const AUTO_LIFE_CHUNK_WEEKS=1;
const AUTO_LIFE_CHUNK_DELAY_MS=20;

function canStartAutoLife(){
  if(!game||game.gameOver||autoLifeRunning)return false;
  if(game.casinoActive||game.marketActive||pendingBatch||consumeModalOpen)return false;
  return true;
}
function showAutoLifeBusy(label){
  const el=document.getElementById('autoLifeOverlay');
  const ti=document.getElementById('autoLifeTitle');
  const body=document.getElementById('autoLifeBody');
  const acts=document.getElementById('autoLifeActions');
  if(ti)ti.textContent='自动生活中…';
  if(body)body.innerHTML='<p style="color:var(--muted);text-align:center">AI 正在替你安排 <b>'+label+'</b> 的生活</p>'+
    '<p style="font-size:.78rem;color:var(--yellow);text-align:center;margin-top:12px">不可打断 · 请稍候</p>';
  if(acts)acts.innerHTML='';
  if(el)el.classList.remove('hidden');
}
function showAutoLifeReport(report){
  const el=document.getElementById('autoLifeOverlay');
  const ti=document.getElementById('autoLifeTitle');
  const body=document.getElementById('autoLifeBody');
  const acts=document.getElementById('autoLifeActions');
  if(ti)ti.textContent='自动生活汇报 · '+report.periodLabel;
  const cashC=report.cashChange||0;
  const stressC=report.stressChange||0;
  let html='<div class="auto-life-summary">'+
    '<div><span>时间</span><b>'+getDateStr(report.startWeek)+' → '+getDateStr(game.week)+'</b></div>'+
    '<div><span>推进</span><b>'+report.weeksAdvanced+' 周</b></div>'+
    '<div><span>现金变化</span><b style="color:'+(cashC>=0?'var(--green)':'var(--red)')+'">'+(cashC>=0?'+':'')+'¥'+cashC.toLocaleString()+'</b></div>'+
    '<div><span>累计收入增加</span><b style="color:var(--green)">+¥'+(report.incomeChange||0).toLocaleString()+'</b></div>'+
    '<div><span>压力变化</span><b style="color:'+(stressC<=0?'var(--green)':'var(--red)')+'">'+(stressC>0?'+':'')+stressC+'</b></div>'+
    '<div><span>上班周数</span><b>'+(report.workWeeks||0)+'</b></div>'+
    '<div><span>自动投递</span><b>'+(report.applications||0)+' 份</b></div>'+
    '<div><span>约会</span><b>'+(report.dates||0)+' 次</b></div>'+
    (report.layoffs?'<div><span>被裁</span><b style="color:var(--red)">'+report.layoffs+' 次</b></div>':'')+
    (report.hires?'<div><span>入职</span><b style="color:var(--green)">'+report.hires+' 次</b></div>':'')+
    '</div>';
  const ev=(report.events||[]).slice(0,40);
  html+='<div class="auto-life-events"><b>主要事件</b>'+
    (ev.length?'<ul>'+ev.map(e=>'<li>'+e+'</li>').join('')+'</ul>':'<p style="color:var(--muted);font-size:.78rem">本期较平稳，无重大波动</p>')+
    '</div>';
  if(game.gameOver)html+='<p style="color:var(--red);font-weight:600;margin-top:10px">人生已落幕</p>';
  if(body)body.innerHTML=html;
  if(acts)acts.innerHTML='<button class="btn btn-primary" type="button" onclick="closeAutoLifeReport()">关闭汇报</button>';
  if(el)el.classList.remove('hidden');
}
function closeAutoLifeReport(){
  const el=document.getElementById('autoLifeOverlay');
  if(el)el.classList.add('hidden');
  if(game&&game._pendingEndGame&&typeof showEndGameModal==='function'){
    const pe=game._pendingEndGame;
    delete game._pendingEndGame;
    showEndGameModal(pe.ending);
  }
  renderDailyPanel();
  updateUI();
}
function autoLifePushEvent(report,msg){
  if(!report||!msg)return;
  report.events=report.events||[];
  if(report.events.length<50)report.events.push(msg);
}
function autoLifeNote(msg){
  if(!autoLifeRunning||!_autoLifeJob||!msg)return;
  autoLifePushEvent(_autoLifeJob.report,msg);
}
function isAutoLifeSimulating(){
  return !!(autoLifeRunning&&_autoLifeJob);
}
function autoLifeSubmitApplication(report){
  if(game.employed||game.homeless||game.cash<80)return;
  const eligible=game.market.map((j,i)=>i).filter(i=>{
    const j=game.market[i];
    return canApplyJob(j)&&!isOverAgeLimit(j);
  });
  if(!eligible.length)return;
  const ji=eligible[Math.floor(Math.random()*eligible.length)];
  const job=game.market[ji];
  const tier=job.heatPct>=108?'high':job.heatPct>=102?'mid':'low';
  const co=pickCompany(ji,tier);
  if(!co)return;
  const r=seededR(ji*997+game.week*3);
  const openings=genOpeningsForCompany(job,co,r);
  if(!openings.length)return;
  const op=openings[Math.floor(Math.random()*openings.length)];
  const fee=Math.min(game.cash,100);
  game.cash-=fee;
  game.jobHuntSpent+=fee;
  ledgerRecordJobHunt(fee,'自动应聘APP');
  const offer={company:co,tier:co.tier,importance:op.importance,annualPay:op.pay,roleExtra:op.roleExtra||null,
    welfare:op.welfare,startDelayWeeks:op.startDelayWeeks,planned:op.planned,
    newToIndustry:!game.industryExperience[job.category],
    eduGap:Math.max(0,(EDU_RANK[job.education]||4)-(EDU_RANK[game.playerEducation]||4)),
    apps:['boss'],method:'app'};
  const id='auto_'+game.week+'_'+Math.floor(Math.random()*99999);
  const replyWeek=calcApplicationReplyWeek(offer,game.week,ji);
  game.applications.push({
    id,jobIdx:ji,offer,status:'pending',applyWeek:game.week,replyWeek,
    planned:!!offer.planned,interviewWeek:null,resultWeek:null,
    viaReferral:false,method:'app',resumeCostLabel:'自动·APP'
  });
  game.totalApplications++;
  game.appliedCategories[job.category]=true;
  report.applications=(report.applications||0)+1;
  autoLifePushEvent(report,'📋 自动投递 '+job.title+' @'+co.name);
}
function autoLifeSocialWeek(report){
  if(game.married&&!game.divorced&&!game.longDistance&&game.cash>=DATE_COST&&Math.random()<0.35){
    game.cash-=DATE_COST;
    adjustSpouseIntimacy(1);
    report.dates=(report.dates||0)+1;
    autoLifePushEvent(report,'💑 自动约会');
  }else if(game.married&&game.longDistance&&Math.random()<0.3){
    adjustSpouseIntimacy(Math.random()<0.5?1:-1);
    autoLifePushEvent(report,'📱 自动线上约会');
  }
  if(game.stats&&Math.random()<0.25){
    const k=['body','mind','spirit'][Math.floor(Math.random()*3)];
    game.stats[k]=Math.min(STAT_MAX,(game.stats[k]||0)+1);
  }
}
function autoLifeTryAcceptOffer(report){
  if(!game.offers||!game.offers.length||game.employed)return;
  const o=game.offers.find(x=>!x.accepted&&game.week<=x.expireWeek);
  if(!o||!o.offer||Math.random()<0.45)return;
  if(!o.negotiated)negotiateOffer(o.id);
  if(o.negotiated){
    signContractOffer(o.id);
    report.hires=(report.hires||0)+1;
    autoLifePushEvent(report,'✅ 自动接 Offer @'+o.offer.company.name);
  }
}
function simulateAutoLifeWeek(report){
  const cash0=game.cash,money0=game.money,stress0=game.familyStress;
  const emp0=game.employed;
  autoLifeSocialWeek(report);
  if(game.employed){
    if(Math.random()<0.08){
      autoLifePushEvent(report,'🛋 本周选休未全勤');
      if(game.daily)game.daily.workSkipDays=(game.daily.workSkipDays||0)+1;
    }else{
      processEmployedWeek();
      report.workWeeks=(report.workWeeks||0)+1;
    }
  }else{
    if(Math.random()<0.6)autoLifeSubmitApplication(report);
  }
  autoLifeTryAcceptOffer(report);
  report.cashChange=(report.cashChange||0)+(game.cash-cash0);
  report.incomeChange=(report.incomeChange||0)+(game.money-money0);
  report.stressChange=(report.stressChange||0)+(game.familyStress-stress0);
  if(emp0&&!game.employed)report.layoffs=(report.layoffs||0)+1;
  if(!emp0&&game.employed)report.hires=(report.hires||0)+1;
}
function updateAutoLifeProgress(){
  const st=_autoLifeJob;if(!st)return;
  const done=st.report.weeksAdvanced,total=st.targetWeeks;
  const body=document.getElementById('autoLifeBody');
  const ti=document.getElementById('autoLifeTitle');
  if(ti)ti.textContent='自动生活中…';
  if(body){
    const pct=total?Math.min(100,Math.round(done*100/total)):0;
    body.innerHTML='<p style="color:var(--muted);text-align:center">AI 正在替你安排 <b>'+st.cfg.label+'</b></p>'+
      '<p style="font-size:.85rem;text-align:center;margin:10px 0">第 <b>'+done+'</b> / '+total+' 周 · '+pct+'%</p>'+
      '<div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin:0 20px">'+
      '<div style="height:100%;width:'+pct+'%;background:var(--green);transition:width .15s"></div></div>'+
      '<p style="font-size:.78rem;color:var(--yellow);text-align:center;margin-top:12px">不可打断 · 请稍候</p>';
  }
  if(typeof updateHeaderStats==='function')updateHeaderStats();
  const tip=document.getElementById('actionTip');
  if(tip&&game)tip.innerHTML='<strong style="color:var(--yellow)">自动生活中…</strong> · '+getDateStr(game.week)+' · '+done+'/'+total+' 周';
}
function autoLifeSimulateOneWeek(report){
  simulateAutoLifeWeek(report);
  if(typeof tickStocksForWorkweek==='function')tickStocksForWorkweek(5);
  if(!advanceOneWeek())return false;
  report.weeksAdvanced++;
  if(typeof resetWeeklyDaily==='function')resetWeeklyDaily();
  else if(game.daily)game.daily=defaultDailyState();
  rollReferralChance();
  return true;
}
function finishAutoLifeJob(err){
  const st=_autoLifeJob;
  _autoLifeJob=null;
  actionDone=false;
  autoLifeRunning=false;
  if(err){
    const ov=document.getElementById('autoLifeOverlay');
    if(ov)ov.classList.add('hidden');
    addLog('自动生活中断：'+(err.message||err),'fail');
    updateUI();
    return;
  }
  if(!st||!st.report){
    const ov=document.getElementById('autoLifeOverlay');
    if(ov)ov.classList.add('hidden');
    updateUI();
    return;
  }
  if(st.remaining>0&&!game.gameOver){
    autoLifePushEvent(st.report,'⚠ 提前结束（推进 '+st.report.weeksAdvanced+'/'+st.targetWeeks+' 周）');
  }
  addLog('⏩ 自动生活结束：'+st.cfg.label+' · 推进 '+st.report.weeksAdvanced+' 周','info');
  autoSaveSlot();
  showAutoLifeReport(st.report);
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(function(){updateUI()});
  else updateUI();
}
function runAutoLifeChunk(){
  const st=_autoLifeJob;
  if(!st||!game){finishAutoLifeJob();return}
  try{
    let batch=0,stalled=false;
    while(batch<AUTO_LIFE_CHUNK_WEEKS&&st.remaining>0&&!game.gameOver){
      if(!autoLifeSimulateOneWeek(st.report)){stalled=true;break}
      st.remaining--;
      batch++;
    }
    updateAutoLifeProgress();
    if(stalled&&!game.gameOver){
      finishAutoLifeJob();
      return;
    }
    if(st.remaining>0&&!game.gameOver){
      setTimeout(runAutoLifeChunk,AUTO_LIFE_CHUNK_DELAY_MS);
      return;
    }
    finishAutoLifeJob();
  }catch(e){
    console.error('auto-life',e);
    finishAutoLifeJob(e);
  }
}
function runAutoLifeCore(periodKey){
  const cfg=AUTO_LIFE_PERIODS[periodKey];
  if(!cfg||!game)return;
  autoLifeRunning=true;
  const report={
    periodLabel:cfg.label,startWeek:game.week,weeksAdvanced:0,
    cashChange:0,incomeChange:0,stressChange:0,events:[],workWeeks:0,applications:0,dates:0,layoffs:0,hires:0
  };
  const targetWeeks=Math.min(cfg.weeks,TOTAL_WEEKS-game.week);
  if(targetWeeks<=0){
    autoLifeRunning=false;
    const ov=document.getElementById('autoLifeOverlay');
    if(ov)ov.classList.add('hidden');
    addLog('已至人生终点，无法继续自动生活','fail');
    updateUI();
    return;
  }
  actionDone=true;
  _autoLifeJob={periodKey,cfg,report,targetWeeks,remaining:targetWeeks};
  updateAutoLifeProgress();
  setTimeout(runAutoLifeChunk,0);
}
function startAutoLife(periodKey){
  if(!canStartAutoLife()){
    addLog('当前无法自动生活（赌桌/人才市场/弹窗进行中）','fail');
    return;
  }
  const cfg=AUTO_LIFE_PERIODS[periodKey];
  if(!cfg)return;
  if(!confirm('进入「'+cfg.label+'」自动生活？\n\n时间将快速跳过且不可打断，结束后汇报结果。'))return;
  closeConsumeModal();
  document.getElementById('applyModal')&&document.getElementById('applyModal').classList.add('hidden');
  pendingBatch=null;
  autoLifeRunning=true;
  updateUI();
  showAutoLifeBusy(cfg.label);
  setTimeout(function(){runAutoLifeCore(periodKey)},60);
}
function renderAutoLifePanel(){
  const el=document.getElementById('autoLifePanel');
  if(!el||!game)return;
  const dis=autoLifeRunning||game.gameOver||game.casinoActive||game.marketActive;
  el.innerHTML='<div class="daily-shop"><b>自动生活</b> <span class="fold-meta">AI 代操作 · 不可打断 · 结束汇报</span><br>'+
    Object.keys(AUTO_LIFE_PERIODS).map(k=>{
      const p=AUTO_LIFE_PERIODS[k];
      return '<button class="btn" '+(dis?'disabled':'')+' onclick="startAutoLife(\''+k+'\')">'+p.label+'</button> ';
    }).join('')+
    (autoLifeRunning?'<span style="color:var(--yellow);font-size:.75rem">自动生活进行中…</span>':'')+
    '</div>';
}
