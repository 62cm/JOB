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
  if(!game||!market||!jobCompanies||game.employed)return false;
  migrateOpeningJobEvent();
  const rng=seededRand(seed||42);
  const eligible=[];
  market.forEach((j,ji)=>{
    if(typeof isOverAgeLimit==='function'&&isOverAgeLimit(j))return;
    eligible.push(ji);
  });
  if(!eligible.length)return false;
  shuffleArr(eligible,rng);
  for(let t=0;t<Math.min(eligible.length,48);t++){
    const ji=eligible[t],job=market[ji];
    const pool=(jobCompanies[ji]||[]).slice();
    if(!pool.length)continue;
    shuffleArr(pool,rng);
    for(let ci=0;ci<Math.min(pool.length,10);ci++){
      const co=pool[ci];
      const r=seededR(ji*59+ci*17+(seed||0));
      const openings=genOpeningsForCompany(job,co,r).filter(op=>!op.planned);
      if(!openings.length)continue;
      const op=openings[Math.floor(rng()*openings.length)];
      const offer={
        company:co,tier:co.tier,importance:op.importance,
        roleExtra:op.roleExtra||null,annualPay:op.pay,
        otProfile:op.otProfile||legacyOvertimeProfile(co.tier,op.importance,op.roleExtra,co,job)
      };
      hirePlayer(ji,offer,false);
      game.openingLayoffPending=true;
      game.openingLayoffCompanyId=co.id||null;
      return true;
    }
  }
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
