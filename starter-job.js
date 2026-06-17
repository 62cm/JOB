/* 开局入职 + 满月剧情裁员 — 由 build.js 注入 */

function migrateOpeningJobEvent(){
  if(!game)return;
  if(game.openingLayoffPending==null)game.openingLayoffPending=!!game.starterJobActive;
  if(!game.openingLayoffCompanyId&&game.openingLayoffPending&&game.employed&&game.employment){
    const co=game.employment.company;
    if(co)game.openingLayoffCompanyId=co.id||game.employment.companyId||null;
  }
  if(game.openingLayoffCompanyId==null&&!game.openingLayoffPending)game.openingLayoffCompanyId=null;
  delete game.starterJobActive;
  delete game.starterJobUntilWeek;
  delete game.starterJobWeeksWorked;
}
function initOpeningJobEvent(market,edu,jobCompanies,seed){
  return false;
}
function clearOpeningLayoffEvent(){
  if(game)game.openingLayoffPending=false;
}
function onPlayerEmploymentChanged(wasEmployed){
  if(!game||!game.openingLayoffPending)return;
  if(!game.employed){clearOpeningLayoffEvent();return;}
  if(!wasEmployed||!game.openingLayoffCompanyId)return;
  const emp=game.employment,co=emp&&emp.company;
  const cid=co&&(co.id||emp.companyId);
  if(cid&&cid!==game.openingLayoffCompanyId)clearOpeningLayoffEvent();
}
function checkOpeningLayoffEvent(){
  if(!game||!game.openingLayoffPending||!game.employed)return;
  if(typeof playerEmployerOwnerImmune==='function'&&playerEmployerOwnerImmune()){
    clearOpeningLayoffEvent();
    return;
  }
  const due=typeof WEEKS_PER_MONTH!=='undefined'?WEEKS_PER_MONTH:4;
  if(game.week<due)return;
  const emp=game.employment,co=emp&&emp.company;
  if(!co)return;
  const cid=co.id||emp.companyId;
  if(game.openingLayoffCompanyId&&cid!==game.openingLayoffCompanyId){
    clearOpeningLayoffEvent();
    return;
  }
  const imp=emp.importance||'low';
  const scale=co.scale||'mid';
  const r={
    laidOff:true,
    openingStory:true,
    reason:co.name+' 批次裁员（'+((typeof IMP_LABEL!=='undefined'?IMP_LABEL[imp]:imp)||imp)+'·'+((typeof SCALE_LABEL!=='undefined'?SCALE_LABEL[scale]:scale)||scale)+'）',
    stealth:false
  };
  recordCareerHistory(emp);
  const laidOffEmp={...emp};
  game.employed=false;
  game.employment=null;
  game.layoffs++;
  clearOpeningLayoffEvent();
  addStress(8*(game.stressMultiplier||1),'被裁 ');
  addLog('💔 '+r.reason,'fail');
  if(typeof updateLongDistanceStatus==='function')updateLongDistanceStatus();
  triggerLayoffSeverance(laidOffEmp,r);
}
function showOpeningLayoffStoryModal(onDone){
  if(!game)return;
  const html='<p>入职满一个月，HR 把你叫进会议室。</p>'+
    '<p style="margin-top:10px;line-height:1.65">「公司批次优化，你的岗位在名单里。」</p>'+
    '<p class="fold-meta" style="margin-top:8px">这是开局剧情裁员 · 接下来处理离职赔偿</p>';
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:'💔',title:'满月裁员',html:html,
      buttons:[{text:'……',primary:true,handler:function(){
        if(typeof closeConsumeModal==='function')closeConsumeModal(true);
        if(typeof onDone==='function')onDone();
      }}]
    });
    return;
  }
  addLog('💔 满月剧情裁员','fail');
  if(typeof onDone==='function')onDone();
}
function drainPendingOpeningLayoffStory(){
  if(!game||!game._pendingOpeningLayoffSeverance)return;
  const pending=game._pendingOpeningLayoffSeverance;
  game._pendingOpeningLayoffSeverance=null;
  showOpeningLayoffStoryModal(function(){
    if(typeof triggerLayoffSeverance==='function')triggerLayoffSeverance(pending.emp,pending.layoffInfo);
  });
}
