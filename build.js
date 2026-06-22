const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
try {
  execSync('node gen-workplace-stories.js', { cwd: __dirname, stdio: 'inherit' });
} catch (e) {
  console.error('gen-workplace-stories failed:', e.message);
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const REAL_CO = require('./real-companies.js');
const WISH_LIST_EVENTS_SRC = fs.readFileSync(path.join(__dirname, 'wish-list-events.js'), 'utf8');
const WORK_KPI_SRC = fs.readFileSync(path.join(__dirname, 'work-kpi.js'), 'utf8');
const IDEAL_PANEL_SRC = fs.readFileSync(path.join(__dirname, 'ideal-panel.js'), 'utf8');
const RELATIONSHIP_SYSTEM_SRC = fs.readFileSync(path.join(__dirname, 'relationship-system.js'), 'utf8');
const DAILY_ACTIVITY_SRC = fs.readFileSync(path.join(__dirname, 'daily-activity.js'), 'utf8');
const JOB_HUNT_DAILY_SRC = fs.readFileSync(path.join(__dirname, 'job-hunt-daily.js'), 'utf8');
const AUTO_LIFE_SRC = fs.readFileSync(path.join(__dirname, 'auto-life.js'), 'utf8');
const AFFAIR_SYSTEM_SRC = fs.readFileSync(path.join(__dirname, 'affair-system.js'), 'utf8');
const NAMES_SRC = fs.readFileSync(path.join(__dirname, 'names.js'), 'utf8');
const WORKPLACE_STORIES_DATA_SRC = fs.readFileSync(path.join(__dirname, 'workplace-stories-data.js'), 'utf8');
const WORKPLACE_STORIES_POOLS_SRC = fs.readFileSync(path.join(__dirname, 'workplace-stories-pools-inline.js'), 'utf8');
const WORKPLACE_STORIES_SRC = fs.readFileSync(path.join(__dirname, 'workplace-stories.js'), 'utf8');
const CONTACTS_SYSTEM_SRC = fs.readFileSync(path.join(__dirname, 'contacts-system.js'), 'utf8');
const SPOUSE_FINANCE_SRC = fs.readFileSync(path.join(__dirname, 'spouse-finance.js'), 'utf8');
const FERTILITY_SYSTEM_SRC = fs.readFileSync(path.join(__dirname, 'fertility-system.js'), 'utf8');
const MENSTRUAL_CYCLE_SRC = fs.readFileSync(path.join(__dirname, 'menstrual-cycle.js'), 'utf8');
const STARTER_JOB_SRC = fs.readFileSync(path.join(__dirname, 'starter-job.js'), 'utf8');
const CAMPUS_RECRUITMENT_SRC = fs.readFileSync(path.join(__dirname, 'campus-recruitment.js'), 'utf8');
const ARTIFACT_SYSTEM_SRC = fs.readFileSync(path.join(__dirname, 'artifact-system.js'), 'utf8');
const PROPERTY_COMPANY_SRC = fs.readFileSync(path.join(__dirname, 'property-company.js'), 'utf8');
const HOUSING_SYSTEM_SRC = fs.readFileSync(path.join(__dirname, 'housing-system.js'), 'utf8');
const STOCK_FLOAT_SRC = fs.readFileSync(path.join(__dirname, 'stock-float.js'), 'utf8');
const ASSETS_PANEL_SRC = fs.readFileSync(path.join(__dirname, 'assets-panel.js'), 'utf8');
const COMPANY_MANAGEMENT_SRC = fs.readFileSync(path.join(__dirname, 'company-management.js'), 'utf8');
const COMPANY_GOVERNANCE_SRC = fs.readFileSync(path.join(__dirname, 'company-governance.js'), 'utf8');
const COMPANY_STRATEGY_SRC = fs.readFileSync(path.join(__dirname, 'company-strategy.js'), 'utf8');
const COMPANY_BRANCHES_SRC = fs.readFileSync(path.join(__dirname, 'company-branches.js'), 'utf8');
const COMPANY_TRAVEL_SRC = fs.readFileSync(path.join(__dirname, 'company-travel.js'), 'utf8');
const COMPANY_COMPETITION_SRC = fs.readFileSync(path.join(__dirname, 'company-competition.js'), 'utf8');
const DREAM_SYSTEM_SRC = fs.readFileSync(path.join(__dirname, 'dream-system.js'), 'utf8');
const SOCIAL_CIRCLES_SRC = fs.readFileSync(path.join(__dirname, 'social-circles.js'), 'utf8');
const FAMILY_CIRCLES_SRC = fs.readFileSync(path.join(__dirname, 'family-circles.js'), 'utf8');
const LIFESPAN_SYSTEM_SRC = fs.readFileSync(path.join(__dirname, 'lifespan-system.js'), 'utf8');
const LIFE_EXTENSIONS_SRC = fs.readFileSync(path.join(__dirname, 'life-extensions.js'), 'utf8');
const FLUX_ENGINE_SRC = fs.readFileSync(path.join(__dirname, 'flux-engine.js'), 'utf8');
const OUTDOOR_HOBBY_SRC = fs.readFileSync(path.join(__dirname, 'outdoor-hobby.js'), 'utf8');
const IDEAL_COMPANY_EXT_SRC = fs.readFileSync(path.join(__dirname, 'ideal-company-ext.js'), 'utf8');
const SCAM_JOB_LISTINGS_SRC = fs.readFileSync(path.join(__dirname, 'scam-job-listings.js'), 'utf8');
const WORKPLACE_CIRCLE_SRC = fs.readFileSync(path.join(__dirname, 'workplace-circle.js'), 'utf8');
const PROJECT_WORK_OPS_SRC = fs.readFileSync(path.join(__dirname, 'project-work-ops.js'), 'utf8');
const EXTENSIONS_BATCH3_SRC = fs.readFileSync(path.join(__dirname, 'extensions-batch3.js'), 'utf8');
const EXTENSIONS_BATCH4_SRC = fs.readFileSync(path.join(__dirname, 'extensions-batch4.js'), 'utf8');
const COMPANY_KPI_SRC = fs.readFileSync(path.join(__dirname, 'company-kpi.js'), 'utf8');
const LIFE_CREATION_SRC = fs.readFileSync(path.join(__dirname, 'life-creation.js'), 'utf8');
const NETWORK_PANEL_SRC = fs.readFileSync(path.join(__dirname, 'network-panel.js'), 'utf8');
const SELF_EMPLOY_SRC = fs.readFileSync(path.join(__dirname, 'self-employ.js'), 'utf8');
const GAME_BUILD_ID = '2026.06.17-gaokao-bonus-bet-x3';
const CASINO_WAIT_SCALE = 0.5;
function casinoWaitMs(ms){return Math.max(1,Math.round(ms*CASINO_WAIT_SCALE))}
const CASINO_TIMING = {
  spectateAi: casinoWaitMs(20000),
  spectateFollow: casinoWaitMs(10000),
  spectateRest: casinoWaitMs(15000),
  settleAuto: casinoWaitMs(3000),
  resumeMin: casinoWaitMs(1000)
};

const _DICE_SUM_ODDS_BUILD = {4:50,5:18,6:14,7:12,8:8,9:6,10:6,11:6,12:6,13:8,14:12,15:14,16:18,17:50};
const DICE_SUM_ZONES_HTML = [4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(s => {
  const o = _DICE_SUM_ODDS_BUILD[s];
  return `<div class="num-zone" data-zone="${s}" onclick="placeTableBet('${s}')"><div class="zone-head"><b>${s}</b><span class="zone-side-gold"><span class="zone-pay-odds">1:${o}</span><span class="dice-zone-pct" id="dicePct${s}"></span></span></div><div class="zone-chip-pile" id="pile${s}"></div></div>`;
}).join('\n                ');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>万物涨落 · 理想人生</title>
<style>
  :root { --bg:#0d1117;--panel:#161b22;--border:#30363d;--text:#e6edf3;--muted:#8b949e;--green:#3fb950;--red:#f85149;--blue:#58a6ff;--yellow:#d29922;--accent:#a371f7;--orange:#f0883e; }
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:var(--bg);color:var(--text);line-height:1.5}
  header{background:linear-gradient(135deg,#1a1f35,#0d1117);border-bottom:1px solid var(--border);padding:6px 0 8px;position:relative}
  .header-grid{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;gap:0 12px;align-items:center;padding:0 10px}
  .header-title{grid-column:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:4px 8px 4px 0;min-width:max-content;flex-shrink:0;white-space:nowrap;position:relative;z-index:2}
  .header-title .ht-main{font-size:clamp(1.05rem,2vw,1.45rem);font-weight:800;line-height:1.15;letter-spacing:.02em}
  .header-title .ht-main .ht-accent{color:var(--accent)}
  .header-title .ht-sub{font-size:clamp(.88rem,1.6vw,1.15rem);color:var(--muted);margin-top:2px;font-weight:700;line-height:1.15}
  .header-stats{grid-column:2;min-width:0;overflow:visible}
  .header-prog-row{grid-column:3;display:flex;flex-direction:row;gap:12px;align-items:flex-start;padding:4px 10px;border-left:1px solid var(--border);border-right:1px solid var(--border);flex-shrink:0}
  .social-medals{grid-column:4;position:relative;top:auto;right:auto;text-align:right;max-width:210px;padding:4px 4px 4px 0;align-self:center}
  .social-medals-row{pointer-events:auto}
  .social-medals-title{font-size:.62rem;color:var(--muted);letter-spacing:.08em;margin-bottom:4px}
  .social-medals-row{display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap}
  .social-medal{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:52px;max-width:72px;opacity:.32;filter:grayscale(.85);transition:opacity .2s,filter .2s}
  .social-medal.lit{opacity:1;filter:none}
  .social-medal .medal-icon{font-size:1.15rem;line-height:1}
  .social-medal .medal-name{font-size:.58rem;font-weight:600;color:var(--text);display:none}
  .social-medal.lit .medal-name{display:block}
  .social-medal .medal-effect{font-size:.52rem;color:var(--muted);line-height:1.25;display:none;text-align:center}
  .social-medal.lit .medal-effect{display:block}
  .stats-bar{display:flex;flex-wrap:wrap;gap:10px 12px;font-size:.82rem;align-items:flex-end;padding:4px 0}
  .stat-prog{min-width:0}
  .header-prog-row .stat-prog-ideal{width:118px;flex:0 0 auto}
  .header-prog-row .stat-prog-mort{width:118px;flex:0 0 auto}
  .header-prog-row .stat-prog-sav{width:158px;flex:0 0 auto}
  .header-prog-row .prog-track{width:100%}
  .header-prog-row .milestone-row{width:100%}
  .stat-prog value{display:block;font-size:.68rem;color:var(--text);margin-bottom:2px}
  .prog-track{position:relative;height:8px;background:var(--bg);border-radius:4px;border:1px solid var(--border);overflow:visible}
  .prog-fill{height:100%;border-radius:3px;transition:width .3s ease;min-width:0}
  .prog-fill.mortgage{background:linear-gradient(90deg,#388bfd,#3fb950)}
  .prog-fill.ideal{background:linear-gradient(90deg,#6e40c9,#a371f7,#58a6ff)}
  .prog-fill.savings{background:linear-gradient(90deg,#9e6a03,#d29922,#3fb950)}
  .milestone-row{position:relative;height:30px;margin-top:2px}
  .milestone-mark{position:absolute;transform:translateX(-50%);text-align:center;font-size:.58rem;line-height:1;white-space:nowrap}
  .milestone-mark .tick{width:2px;height:4px;background:var(--border);margin:0 auto 1px;border-radius:1px}
  .milestone-mark .milestone-amt{display:block;font-size:.48rem;line-height:1.1;margin-top:1px;color:inherit}
  .milestone-mark.reached .tick{background:var(--yellow)}
  .milestone-mark.reached{color:var(--yellow)}
  .milestone-mark:not(.reached){color:var(--muted);opacity:.5}
  .stat label{color:var(--muted);font-size:.68rem;display:block}
  .stat value{font-weight:600;font-variant-numeric:tabular-nums}
  .stat value.money{color:var(--green)} .stat value.cash{color:var(--blue)} .stat value.stress{color:var(--red)}
  .stress-track{width:56px;height:5px;background:var(--bg);border-radius:3px;margin-top:2px;overflow:hidden}
  .stress-fill{height:100%;width:0%;background:var(--red)}
  main{display:grid;grid-template-columns:minmax(200px,280px) minmax(160px,200px) minmax(0,1fr) minmax(200px,250px);gap:0;height:calc(100vh - 108px);min-width:960px;transition:grid-template-columns .2s ease}
  main.ref-collapsed{grid-template-columns:34px minmax(160px,200px) minmax(0,1fr) minmax(200px,250px)}
  body.game-active{overflow-x:auto}
  @media(max-width:700px){main{min-width:960px}}
  .ref-panel,.sidebar,.log-panel{background:var(--panel);border-right:1px solid var(--border);overflow-y:auto;padding:10px;font-size:.8rem}
  .ref-panel{font-size:.78rem;display:flex;flex-direction:column;gap:14px;transition:padding .2s ease}
  .ref-panel.collapsed{padding:8px 4px;overflow:hidden}
  .ref-panel.collapsed .ref-panel-body,.ref-panel.collapsed .ref-hdr-wrap{display:none}
  .ref-panel.collapsed .ref-panel-hdr{justify-content:center;width:100%}
  .ref-panel-hdr{display:flex;align-items:flex-start;gap:6px;flex-shrink:0}
  .ref-hdr-wrap{flex:1;min-width:0}
  .ref-collapse-btn{flex-shrink:0;padding:2px 7px;font-size:.72rem;line-height:1.25;background:var(--bg);border:1px solid var(--border);color:var(--muted);border-radius:4px;cursor:pointer}
  .ref-collapse-btn:hover{color:var(--text);border-color:var(--accent)}
  .ref-view-toggle{display:flex;gap:4px;margin-top:6px}
  .ref-view-btn{flex:1;padding:4px 6px;font-size:.66rem;line-height:1.2;background:var(--bg);border:1px solid var(--border);color:var(--muted);border-radius:5px;cursor:pointer}
  .ref-view-btn:hover:not(:disabled){color:var(--text);border-color:var(--accent)}
  .ref-view-btn.active{background:rgba(88,166,255,.15);border-color:var(--accent);color:var(--accent);font-weight:600}
  .ref-view-btn:disabled{opacity:.45;cursor:not-allowed}
  .ref-cat-jump-btn{display:block;width:100%;margin-top:8px;padding:6px 8px;font-size:.68rem;line-height:1.2;background:var(--bg);border:1px solid var(--border);color:var(--muted);border-radius:5px;cursor:pointer}
  .ref-cat-jump-btn:hover{color:var(--text);border-color:var(--accent)}
  .ref-cat-summary{margin-top:10px;padding-top:8px;border-top:1px dashed var(--border)}
  .ref-industry-pick{margin-top:8px;display:flex;flex-wrap:wrap;gap:4px}
  .ref-industry-pick .cat-btn{font-size:.62rem;padding:2px 6px}
  .ref-hdr{font-size:.95rem;font-weight:600;line-height:1.3}
  .ref-sub{font-size:.68rem;color:var(--muted);line-height:1.4;margin-top:2px}
  .stat-section{display:flex;flex-direction:column;gap:6px}
  .stat-section h3{font-size:.65rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
  .stat-big{font-size:1.55rem;font-weight:700;line-height:1}
  .stat-note{font-size:.68rem;color:var(--muted)}
  .tier-bar,.hbar-chart{display:flex;flex-direction:column;gap:4px}
  .tier-row,.hbar-row{display:flex;align-items:center;gap:5px;font-size:.7rem}
  .tier-color{width:9px;height:9px;border-radius:2px;flex-shrink:0}
  .tier-name{flex:1;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .tier-jobs{text-align:right;white-space:nowrap;font-size:.68rem}
  .tier-pct{width:30px;text-align:right;color:var(--muted);font-size:.65rem}
  .histogram{display:flex;align-items:flex-end;gap:2px;height:44px}
  .histogram .bar{flex:1;border-radius:1px 1px 0 0;min-height:1px}
  .hist-labels{display:flex;justify-content:space-between;font-size:.6rem;color:var(--muted);margin-top:2px}
  .hbar-label{width:58px;flex-shrink:0;color:var(--muted);font-size:.65rem;text-align:right}
  .hbar-track{flex:1;height:9px;background:rgba(255,255,255,.04);border-radius:2px;overflow:hidden}
  .hbar-fill{height:100%;border-radius:2px}
  .hbar-val{width:20px;flex-shrink:0;font-size:.65rem;text-align:right}
  .gradient-legend{display:flex;align-items:center;gap:5px;font-size:.65rem;color:var(--muted)}
  .gradient-legend canvas{border-radius:2px;vertical-align:middle}
  .ref-job-detail{padding-top:2px}
  .ref-casino-stats{border:1px solid var(--border);border-radius:8px;padding:8px;background:rgba(15,77,42,.15)}
  .ref-casino-stats h3{font-size:.72rem;color:var(--yellow);margin-bottom:6px}
  .ref-casino-sub{font-size:.62rem;color:var(--muted);margin:-2px 0 6px}
  .ref-casino-block{margin-bottom:10px}
  .ref-casino-block:last-child{margin-bottom:0}
  .ref-casino-block h4{font-size:.65rem;color:var(--muted);margin:6px 0 4px;letter-spacing:.04em}
  .ref-casino-stats .ref-prob-list{max-height:none;overflow:visible}
  .ref-rl-ring-wrap{display:flex;justify-content:center;margin:4px 0 6px;width:100%}
  .ref-rl-ring-wrap canvas{display:block;width:100%;max-width:268px;height:auto}
  .ref-rl-hist-strip{overflow-x:auto;margin:4px 0 6px;padding-bottom:2px;-webkit-overflow-scrolling:touch}
  .ref-rl-hist-grid{display:flex;gap:2px;min-width:max-content;height:78px;align-items:stretch;padding:0 1px}
  .ref-rl-hist-col{flex:0 0 13px;display:flex;flex-direction:column;align-items:center;min-height:0}
  .ref-rl-hist-pct{font-size:.46rem;color:var(--muted);line-height:1;height:9px;text-align:center;white-space:nowrap;transform:scale(.92);transform-origin:center bottom}
  .ref-rl-hist-bar-wrap{flex:1;width:100%;min-height:32px;display:flex;align-items:flex-end;background:rgba(255,255,255,.05);border-radius:2px 2px 0 0;border:1px solid rgba(255,255,255,.06)}
  .ref-rl-hist-bar-fill{width:100%;border-radius:1px 1px 0 0;min-height:0;transition:height .25s ease;background:linear-gradient(180deg,#58a6ff,#d29922)}
  .ref-rl-hist-num{font-size:.5rem;font-weight:800;line-height:1;margin-top:2px;text-align:center}
  .ref-rl-color-probs{display:flex;flex-direction:column;gap:6px;margin-top:4px}
  .ref-rl-color-prob{display:flex;align-items:center;gap:6px;font-size:.68rem}
  .ref-rl-color-prob .ref-prob-name{flex:0 0 32px;font-weight:600}
  .ref-rl-color-prob.rl-red .ref-prob-name{color:#e85d6f}
  .ref-rl-color-prob.rl-black .ref-prob-name{color:#9aa0b0}
  .ref-rl-color-prob .ref-prob-bar{flex:1}
  .ref-panel.casino-ref-mode{overflow-y:visible;overflow:visible}
  .ref-panel.casino-ref-mode .ref-panel-body{overflow:visible}
  .ref-prob-list{display:flex;flex-direction:column;gap:2px;max-height:160px;overflow-y:auto}
  .ref-prob-row{display:flex;align-items:center;gap:5px;font-size:.66rem}
  .ref-prob-name{flex:1;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .ref-prob-bar{flex:0 0 56px;height:5px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden}
  .ref-prob-fill{height:100%;background:linear-gradient(90deg,var(--blue),var(--yellow));border-radius:3px}
  .ref-prob-pct{width:38px;text-align:right;color:var(--muted);font-variant-numeric:tabular-nums}
  .spectate-hud{margin:8px 0;padding:8px 10px;border:1px solid rgba(88,166,255,.35);border-radius:8px;background:rgba(88,166,255,.08);display:flex;flex-wrap:wrap;align-items:center;gap:8px}
  .spectate-phase{flex:1;font-size:.76rem;color:var(--blue);min-width:160px}
  .spectate-phase b{color:var(--yellow)}
  .zone-chip-pile.ai-pile{min-height:28px;opacity:.92;border-top:1px dashed rgba(88,166,255,.35);margin-top:2px;padding-top:3px}
  .zone-chip-pile.ai-pile::before{content:attr(data-ai-label);display:block;font-size:.55rem;color:var(--blue);line-height:1.15;margin-bottom:1px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .bet-zone.ai-target,.num-zone.ai-target{box-shadow:0 0 0 2px rgba(88,166,255,.45)}
  .ref-content h3{font-size:.9rem;margin-bottom:6px}
  .ref-row{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid var(--border);gap:8px}
  .ref-row label{color:var(--muted);flex-shrink:0}
  .ref-rationale{margin-top:8px;padding:8px;background:var(--bg);border-radius:6px;font-size:.72rem;color:var(--muted);line-height:1.55}
  .job-treemap{display:flex;flex-direction:column;gap:10px}
  .industry-block{background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:8px;display:flex;flex-direction:column}
  .industry-hdr{font-weight:700;font-size:.82rem;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center}
  .industry-inner{display:flex;flex-wrap:wrap;gap:5px;align-content:flex-start;max-height:420px;overflow-y:auto}
  .actions-sticky{position:sticky;bottom:0;background:var(--bg);border-top:1px solid var(--border);padding:10px 0;margin-top:8px;z-index:5}
  .job-tile{border:1px solid rgba(255,255,255,.08);border-radius:6px;padding:6px;cursor:pointer;min-width:72px;min-height:52px;display:flex;flex-direction:column;justify-content:space-between;transition:border-color .15s,box-shadow .15s,filter .15s}
  .job-tile:hover{border-color:var(--blue)} .job-tile.selected{outline:2px solid var(--accent)}
  .job-tile.multi-selected{outline:3px solid var(--yellow);box-shadow:0 0 0 1px var(--yellow),inset 0 0 0 999px rgba(210,153,34,.42);filter:brightness(1.12) saturate(1.15);position:relative;z-index:1}
  .daily-job-treemap .job-tile.multi-selected{outline:3px solid var(--accent);box-shadow:0 0 14px rgba(163,113,247,.65),inset 0 0 0 999px rgba(163,113,247,.38);filter:brightness(1.14) saturate(1.2)}
  .job-tile.current-job{box-shadow:0 0 0 1px var(--green)} .job-tile .jt-title{font-weight:600;font-size:.72rem;line-height:1.25}
  .job-tile .jt-meta{font-size:.65rem;color:var(--muted);margin-top:2px}
  .job-tile .jt-stats{font-size:.64rem;display:flex;gap:4px;flex-wrap:wrap;margin-top:3px}
  .legend{display:flex;gap:10px;font-size:.68rem;color:var(--muted);margin-bottom:8px;flex-wrap:wrap}
  .legend i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:3px;vertical-align:middle}
  .log-panel{border-right:none;border-left:1px solid var(--border)}
  .center{overflow-y:auto;padding:12px}
  .panel-title{font-size:.72rem;color:var(--muted);text-transform:uppercase;margin:8px 0 6px;padding-bottom:4px;border-bottom:1px solid var(--border)}
  .cat-btn{background:var(--bg);border:1px solid var(--border);color:var(--muted);padding:2px 7px;border-radius:10px;font-size:.7rem;cursor:pointer;margin:2px}
  .cat-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}
  .job-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
  .job-card{background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:8px;cursor:pointer}
  .job-card:hover{border-color:var(--blue)} .job-card.selected{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}
  .job-card.multi-selected{border-color:var(--yellow);box-shadow:0 0 0 2px var(--yellow)}
  .job-card.current-job{border-color:var(--green)} .job-card.disabled{opacity:.45;cursor:not-allowed}
  .cat-btn.applied{background:rgba(210,153,34,.25);color:var(--yellow);border-color:var(--yellow)}
  .cat-btn.apply-pick{background:rgba(88,166,255,.2);color:var(--blue);border-color:var(--blue)}
  .industry-filter{margin-bottom:6px}
  .industry-filter-hdr{display:flex;align-items:center;gap:6px;width:100%;background:transparent;border:none;color:var(--muted);font-size:.72rem;text-transform:uppercase;padding:6px 0 4px;cursor:pointer;border-bottom:1px solid var(--border);margin:8px 0 0}
  .industry-filter-hdr:hover{color:var(--text)}
  .industry-filter-count{font-size:.65rem;color:var(--accent);text-transform:none}
  .industry-filter-chevron{margin-left:auto;font-size:.6rem;opacity:.7}
  .industry-filter-body{padding-top:4px}
  .industry-filter.collapsed .industry-picker-wrap{display:none}
  .industry-filter-empty{font-size:.68rem;color:var(--muted);padding:2px 0 4px}
  .industry-picker-wrap{margin-top:4px}
  .cat-btn-add{width:100%;margin:4px 0 2px;border-style:dashed;color:var(--muted)}
  .cat-btn-add:hover{color:var(--blue);border-color:var(--blue)}
  .industry-picker-all{display:flex;flex-wrap:wrap;gap:2px;margin-top:4px;padding:4px 0;border-top:1px dashed var(--border);max-height:120px;overflow-y:auto}
  .interview-cal{margin:4px 0 10px}
  .cal-weeks{display:flex;flex-direction:column;gap:4px}
  .cal-week{border:1px solid var(--border);border-radius:6px;padding:5px 7px;background:var(--bg);font-size:.7rem}
  .cal-week.cal-cur{border-color:var(--accent);box-shadow:0 0 0 1px rgba(163,113,247,.25)}
  .cal-date{color:var(--muted);font-size:.65rem;margin-bottom:3px}
  .cal-week.cal-cur .cal-date{color:var(--accent);font-weight:600}
  .cal-events{display:flex;flex-direction:column;gap:2px}
  .cal-ev{padding:2px 5px;border-radius:4px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .cal-ev.cal-invite{background:rgba(210,153,34,.15);color:var(--yellow);border-left:2px solid var(--yellow)}
  .cal-ev.cal-confirmed{background:rgba(63,185,80,.12);color:var(--green);border-left:2px solid var(--green)}
  .cal-ev.cal-planned{background:rgba(88,166,255,.12);color:var(--blue);border-left:2px solid var(--blue)}
  .cal-planned-list{margin-bottom:8px;padding:6px 7px;border:1px dashed var(--border);border-radius:6px;background:rgba(88,166,255,.04)}
  .cal-planned-hdr{font-size:.74rem;color:var(--blue);font-weight:600;margin:0 0 4px;border-style:dashed}
  .cal-planned-row{font-size:.68rem;padding:2px 0;color:var(--muted);line-height:1.35}
  .cal-planned-row b{color:var(--text);font-weight:500}
  .cal-empty{color:var(--muted);opacity:.45;font-size:.65rem}
  .cal-shell{border-radius:8px;padding:2px}
  .cal-view-tabs{display:flex;gap:4px;margin-bottom:6px}
  .cal-view-tabs .btn{flex:1;font-size:.68rem;padding:4px 6px}
  .cal-view-tabs .btn.active{border-color:var(--accent);color:var(--accent);box-shadow:0 0 0 1px rgba(163,113,247,.35)}
  .inbox-fold-hdr{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 8px;margin:6px 0 2px;border:1px solid var(--border);border-radius:6px;background:var(--bg);cursor:pointer;font-size:.74rem}
  .inbox-fold-hdr:hover{border-color:var(--accent)}
  .inbox-fold-hdr .fold-meta{color:var(--muted);font-size:.64rem}
  .inbox-fold-body{padding:0 2px 4px}
  .inbox-cat-block{width:100%;flex:1 1 100%;display:block;margin-bottom:6px}
  .daily-inbox-panel{width:100%;flex:1 1 100%;display:block}
  .daily-inbox-panel .inbox-sort{margin:4px 0 8px}
  .inbox-offer-detail{font-size:.68rem;color:var(--muted);margin-top:5px;padding-top:4px;border-top:1px dashed var(--border)}
  .fin-panel{margin-bottom:10px;border:1px solid var(--border);border-radius:8px;overflow:hidden;background:var(--bg)}
  .fin-fold-hdr{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:7px 9px;cursor:pointer;font-size:.74rem;background:var(--panel)}
  .fin-fold-hdr:hover{border-color:var(--accent)}
  .fin-fold-body{padding:4px 6px 8px;max-height:min(52vh,420px);overflow-y:auto}
  .fin-stmt{padding:8px 6px;border-top:1px solid var(--border)}
  .fin-stmt:first-child{border-top:none}
  .fin-stmt-hdr{display:flex;justify-content:space-between;align-items:baseline;gap:6px;font-size:.72rem;font-weight:600;margin-bottom:4px}
  .fin-stmt-hdr .fold-meta{font-weight:400}
  .fin-bars{display:flex;flex-direction:column;gap:5px;margin:6px 0}
  .fin-bar-row{display:flex;align-items:center;gap:6px;font-size:.64rem}
  .fin-bar-lbl{width:1.6em;text-align:center;flex-shrink:0}
  .fin-bar-track{flex:1;height:9px;background:rgba(255,255,255,.06);border-radius:5px;overflow:hidden}
  .fin-bar-fill{height:100%;border-radius:5px;min-width:2px}
  .fin-bar-fill.inc{background:var(--green)}
  .fin-bar-fill.exp{background:var(--red)}
  .fin-bar-amt{width:4.5em;text-align:right;color:var(--muted);font-size:.62rem;flex-shrink:0}
  .fin-cats{display:grid;grid-template-columns:1fr 1fr;gap:3px 10px;margin-top:6px}
  .fin-col-hdr{font-size:.6rem;color:var(--muted);margin-bottom:2px}
  .fin-cat{display:flex;align-items:center;gap:3px;font-size:.64rem;color:var(--muted)}
  .fin-cat-mand{color:var(--text)}
  .fin-cat b{color:var(--text);font-weight:500;margin-left:auto}
  .fin-net{font-size:.7rem;font-weight:600;margin-top:5px;padding-top:4px;border-top:1px dashed var(--border)}
  .fin-net.pos{color:var(--green)}
  .fin-net.neg{color:var(--red)}
  .cal-planned-fold .inbox-fold-hdr{border-style:dashed}
  .cal-month-hdr{display:flex;align-items:center;justify-content:space-between;gap:4px;margin-bottom:6px;font-size:.72rem;font-weight:600}
  .cal-month-hdr .btn.cal-nav{padding:1px 7px;font-size:.78rem;line-height:1.2;min-width:24px}
  .cal-month-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;font-size:.62rem}
  .cal-dow{text-align:center;color:var(--muted);font-size:.58rem;padding:2px 0}
  .cal-day{min-height:34px;border:1px solid var(--border);border-radius:4px;padding:2px 3px;background:var(--bg);display:flex;flex-direction:column;gap:1px;overflow:hidden}
  .cal-day.cal-pad{background:transparent;border-color:transparent}
  .cal-day.cal-cur-week{border-color:rgba(163,113,247,.45);background:rgba(163,113,247,.06)}
  .cal-day.cal-out{opacity:.55}
  .cal-day-num{font-size:.62rem;color:var(--muted);line-height:1.1}
  .cal-day.cal-cur-week .cal-day-num{color:var(--accent);font-weight:600}
  .cal-day-evs{display:flex;flex-direction:column;gap:1px}
  .cal-ev-mini{font-size:.52rem;line-height:1.15;padding:1px 2px;border-radius:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .cal-ev-mini.cal-planned{background:rgba(88,166,255,.15);color:var(--blue)}
  .cal-ev-mini.cal-invite{background:rgba(210,153,34,.15);color:var(--yellow)}
  .cal-ev-mini.cal-confirmed{background:rgba(63,185,80,.12);color:var(--green)}
  .cal-ev-mini.cal-spouse-loan{background:rgba(163,113,247,.15);color:var(--accent)}
  .cal-spouse-loan-list{border-color:rgba(163,113,247,.35);background:rgba(163,113,247,.04)}
  .cal-spouse-loan-hdr{color:var(--accent)}
  .cal-spouse-overdue{color:var(--red)!important}
  .cal-ev.cal-spouse-loan{background:rgba(163,113,247,.12);color:var(--accent);border-left:2px solid var(--accent)}
  .spending-panel{font-size:.72rem}
  .companion-panel{font-size:.78rem}
  .companion-hdr{display:flex;align-items:center;gap:10px;margin-bottom:10px;padding:10px;border:1px solid var(--border);border-radius:8px;background:var(--panel)}
  .companion-hdr .avatar{font-size:2rem;line-height:1}
  .companion-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin-bottom:10px}
  .companion-stat{background:var(--panel);border:1px solid var(--border);border-radius:6px;padding:8px}
  .companion-stat label{display:block;font-size:.65rem;color:var(--muted)}
  .companion-stat value{font-weight:600;font-variant-numeric:tabular-nums}
  .companion-emp{border:1px solid var(--green);border-radius:8px;padding:10px;margin-bottom:10px;background:rgba(63,185,80,.06)}
  .companion-section{margin-bottom:12px}
  .companion-section h4{font-size:.72rem;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em}
  .companion-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);font-size:.74rem;gap:8px}
  .companion-log{max-height:280px;overflow-y:auto;font-size:.72rem}
  .companion-log .log-entry{padding:3px 0;border-bottom:1px solid rgba(255,255,255,.04)}
  .companion-note{font-size:.7rem;color:var(--muted);margin-bottom:10px;line-height:1.5}
  .spend-row{display:flex;justify-content:space-between;align-items:flex-start;gap:6px;padding:5px 0;border-bottom:1px solid var(--border)}
  .spend-row:last-child{border-bottom:none}
  .spend-meta{color:var(--muted);font-size:.64rem;line-height:1.35;margin-top:2px}
  .spend-row .btn{font-size:.68rem;padding:2px 8px;flex-shrink:0}
  .spend-btns{display:flex;flex-wrap:wrap;gap:4px;justify-content:flex-end;flex-shrink:0;max-width:58%}
  .spend-btns .btn{white-space:nowrap}
  .spend-owned{color:var(--green);font-size:.64rem}
  .inbox-sort{margin:4px 0 8px;display:flex;flex-wrap:wrap;gap:4px}
  .inbox-sort .btn{font-size:.68rem;padding:2px 8px}
  .inbox-sort .btn.active{border-color:var(--accent);color:var(--accent);box-shadow:0 0 0 1px rgba(163,113,247,.3)}
  .inbox-item,.offer-item{border:1px solid var(--border);border-radius:6px;padding:8px;margin:6px 0;font-size:.78rem;background:var(--bg)}
  .inbox-item.has-reply{border-color:var(--green);box-shadow:0 0 0 1px rgba(63,185,80,.35)}
  .inbox-item.ghost{border-color:var(--muted)}
  .inbox-item.invalid{border-color:var(--red);box-shadow:0 0 0 1px rgba(248,81,73,.35);opacity:.88}
  .inbox-item.invalid .invalid-tag{color:var(--red);font-size:.65rem;font-weight:600}
  .mail-badge-wrap{position:relative;display:inline-block}
  .mail-unread{position:absolute;top:-6px;right:-6px;background:var(--red);color:#fff;border-radius:999px;font-size:.58rem;min-width:14px;line-height:14px;padding:0 4px;text-align:center;font-weight:700}
  .btn.disabled-referral,.btn.disabled-referral:disabled{opacity:.42;cursor:not-allowed;filter:grayscale(.85)}
  .daily-job-pick.active{border-color:var(--accent);color:var(--accent)}
  .daily-applied{border-color:var(--green)!important}
  .daily-job-channel-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;align-items:center}
  .daily-job-treemap{max-height:min(42vh,360px);overflow-y:auto;margin:6px 0;padding:4px;border:1px solid var(--border);border-radius:8px}
  .daily-listing-toolbar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 4px}
  .daily-listing-toolbar .btn.active{border-color:var(--accent);color:var(--accent)}
  .daily-app-listings .company-row{width:100%;box-sizing:border-box}
  .daily-job-actions-bottom{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;padding-top:10px;border-top:1px solid var(--border);width:100%}
  .daily-job-actions-bottom .btn{margin:0}
  .inbox-cat-hdr.inbox-cat-expired .fold-meta{color:var(--red)}
  .inbox-cat-hdr.inbox-cat-scam{color:var(--orange);border-color:var(--orange)}
  .inbox-item.inbox-scam{border-color:var(--orange);background:rgba(240,136,62,.1)}
  .daily-scam-bait-row{border-color:rgba(210,153,34,.45)!important;background:rgba(210,153,34,.06)}
  .daily-scam-bait-applied{border-color:var(--green)!important}
  .company-row{display:flex;gap:8px;padding:6px;border-bottom:1px solid var(--border);font-size:.76rem;flex-wrap:wrap;align-items:flex-start}
  .company-row:hover{background:rgba(88,166,255,.05)}
  .company-row.picked{background:rgba(88,166,255,.08)}
  .company-row input[type=checkbox]{margin-top:3px;flex-shrink:0}
  .modal.wide{max-width:820px;width:95%}
  .modal-list{max-height:50vh;overflow-y:auto;margin:8px 0}
  .prob-hidden{display:none}
  .wolf-badge{color:var(--orange);font-size:.72rem}
  .job-card .title{font-weight:600;font-size:.86rem} .job-card .meta{font-size:.7rem;color:var(--muted)}
  .job-card .price{font-size:.95rem;font-weight:700} .job-card .price.up{color:var(--green)} .job-card .price.down{color:var(--red)}
  .sparkline{width:100%;height:26px;margin:3px 0}
  .badge{display:inline-block;padding:1px 5px;border-radius:4px;font-size:.65rem;margin:1px 2px 1px 0}
  .badge-hot{background:rgba(210,153,34,.2);color:var(--yellow)} .badge-cold{background:rgba(88,166,255,.2);color:var(--blue)}
  .badge-ai{background:rgba(248,81,73,.15);color:var(--red)}
  .badge-tier-h{background:rgba(163,113,247,.25);color:var(--accent)} .badge-tier-m{background:rgba(88,166,255,.2);color:var(--blue)}
  .badge-tier-l{background:rgba(139,148,158,.2);color:var(--muted)}
  .badge-scale-l{background:rgba(210,153,34,.2);color:var(--yellow)} .badge-scale-m{background:rgba(63,185,80,.15);color:var(--green)}
  .badge-scale-s{background:rgba(139,148,158,.15);color:var(--muted)}
  .badge-imp-h{background:rgba(63,185,80,.2);color:var(--green)} .badge-imp-m{background:rgba(210,153,34,.2);color:var(--yellow)}
  .badge-imp-l{background:rgba(248,81,73,.15);color:var(--red)}
  .btn{padding:6px 12px;border-radius:6px;border:1px solid var(--border);background:var(--panel);color:var(--text);cursor:pointer;font-size:.82rem}
  .btn:hover{background:#21262d} .btn-primary{background:var(--accent);border-color:var(--accent);color:#fff}
  .btn-success{background:var(--green);border-color:var(--green);color:#fff} .btn-warn{background:var(--orange);border-color:var(--orange);color:#fff}
  .btn:disabled{opacity:.45;cursor:not-allowed}
  @keyframes allnightRainbowShift{0%{background-position:0% 50%}100%{background-position:200% 50%}}
  .allnight-sleep-row{display:flex;gap:8px;flex-wrap:wrap;width:100%;margin-top:10px;padding-top:10px;border-top:1px solid var(--border);clear:both}
  .daily-allnight-gold .btn:not(:disabled):not(.contact-star):not(.btn-allnight-plain):not(.btn-phone-shop){
    background:linear-gradient(145deg,#8b6914,#ffd700 45%,#c9a227 80%,#ffe566)!important;
    border-color:#e6c200!important;
    color:#1a1200!important;
    font-weight:600;
    text-shadow:0 1px 0 rgba(255,255,255,.25);
    box-shadow:0 0 10px rgba(255,215,0,.28),inset 0 1px 0 rgba(255,255,255,.35);
  }
  .daily-allnight-gold .btn:not(:disabled):not(.contact-star):not(.btn-allnight-plain):not(.btn-phone-shop):hover{
    filter:brightness(1.08);
    box-shadow:0 0 14px rgba(255,215,0,.42),inset 0 1px 0 rgba(255,255,255,.45);
  }
  .daily-allnight-devil .btn:not(:disabled):not(.contact-star):not(.btn-allnight-plain):not(.btn-phone-shop){
    background:linear-gradient(90deg,
      #ff0000 0%,#ff0000 7.14%,
      #ff7f00 7.14%,#ff7f00 14.29%,
      #ffff00 14.29%,#ffff00 21.43%,
      #00ff00 21.43%,#00ff00 28.57%,
      #00ffff 28.57%,#00ffff 35.71%,
      #0000ff 35.71%,#0000ff 42.86%,
      #9400d3 42.86%,#9400d3 50%,
      #ff0000 50%,#ff0000 57.14%,
      #ff7f00 57.14%,#ff7f00 64.29%,
      #ffff00 64.29%,#ffff00 71.43%,
      #00ff00 71.43%,#00ff00 78.57%,
      #00ffff 78.57%,#00ffff 85.71%,
      #0000ff 85.71%,#0000ff 92.86%,
      #9400d3 92.86%,#9400d3 100%)!important;
    background-size:200% 100%!important;
    animation:allnightRainbowShift 2.4s linear infinite;
    border-color:rgba(255,255,255,.35)!important;
    color:#fff!important;
    font-weight:700;
    text-shadow:0 0 6px rgba(0,0,0,.85),0 1px 2px rgba(0,0,0,.9);
    box-shadow:0 0 16px rgba(255,0,128,.45),0 0 8px rgba(0,200,255,.25);
    filter:saturate(1.35) brightness(1.05);
  }
  .daily-allnight-devil .btn:not(:disabled):not(.contact-star):not(.btn-allnight-plain):not(.btn-phone-shop):hover{
    filter:saturate(1.5) brightness(1.15);
    box-shadow:0 0 20px rgba(255,0,128,.55),0 0 12px rgba(0,255,200,.35);
  }
  .daily-allnight-gold .btn:disabled,.daily-allnight-devil .btn:disabled{opacity:.42}
  .daily-allnight-gold .btn.btn-allnight-plain:not(:disabled),
  .daily-allnight-devil .btn.btn-allnight-plain:not(:disabled){
    background:var(--panel)!important;border-color:var(--border)!important;color:var(--text)!important;
    font-weight:normal!important;text-shadow:none!important;box-shadow:none!important;animation:none!important;
  }
  .daily-allnight-gold .btn.btn-allnight-plain:not(:disabled):hover,
  .daily-allnight-devil .btn.btn-allnight-plain:not(:disabled):hover{filter:none;background:#21262d!important}
  .daily-allnight-gold .btn.btn-primary.btn-allnight-plain:not(:disabled),
  .daily-allnight-devil .btn.btn-primary.btn-allnight-plain:not(:disabled){
    background:var(--accent)!important;border-color:var(--accent)!important;color:#fff!important;
  }
  .daily-allnight-gold .btn.btn-warn.btn-allnight-plain:not(:disabled),
  .daily-allnight-devil .btn.btn-warn.btn-allnight-plain:not(:disabled){
    background:var(--orange)!important;border-color:var(--orange)!important;color:#fff!important;
  }
  .daily-allnight-gold .daily-shop .btn:not(:disabled),
  .daily-allnight-gold .phone-fold .btn:not(:disabled),
  .daily-allnight-gold .car-fold .btn:not(:disabled),
  .daily-allnight-gold .daily-contacts .btn:not(:disabled),
  .daily-allnight-devil .daily-shop .btn:not(:disabled),
  .daily-allnight-devil .phone-fold .btn:not(:disabled),
  .daily-allnight-devil .car-fold .btn:not(:disabled),
  .daily-allnight-devil .daily-contacts .btn:not(:disabled){
    background:var(--panel)!important;border-color:var(--border)!important;color:var(--text)!important;
    font-weight:normal!important;text-shadow:none!important;box-shadow:none!important;animation:none!important;filter:none!important;
  }
  .daily-allnight-gold .daily-shop .btn:not(:disabled):hover,
  .daily-allnight-gold .phone-fold .btn:not(:disabled):hover,
  .daily-allnight-gold .car-fold .btn:not(:disabled):hover,
  .daily-allnight-gold .daily-contacts .btn:not(:disabled):hover,
  .daily-allnight-devil .daily-shop .btn:not(:disabled):hover,
  .daily-allnight-devil .phone-fold .btn:not(:disabled):hover,
  .daily-allnight-devil .car-fold .btn:not(:disabled):hover,
  .daily-allnight-devil .daily-contacts .btn:not(:disabled):hover{background:#21262d!important;filter:none!important}
  .daily-allnight-gold .btn.btn-phone-shop:not(:disabled),
  .daily-allnight-devil .btn.btn-phone-shop:not(:disabled){
    background:var(--panel)!important;border-color:var(--border)!important;color:var(--text)!important;
    font-weight:normal!important;text-shadow:none!important;box-shadow:none!important;animation:none!important;filter:none!important;
  }
  .daily-allnight-gold .btn.btn-phone-shop:not(:disabled):hover,
  .daily-allnight-devil .btn.btn-phone-shop:not(:disabled):hover{background:#21262d!important;filter:none!important}
  .actions{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;align-items:center}
  .log-entry{font-size:.76rem;padding:4px 0;border-bottom:1px solid var(--border)}
  .log-entry .date{color:var(--muted)} .log-entry.success{color:var(--green)} .log-entry.fail{color:var(--red)}
  .log-entry.warn{color:var(--yellow)} .log-entry.stress{color:var(--orange)}
  .detail-panel,.life-panel,.finance-panel{background:var(--panel);border:1px solid var(--border);border-radius:8px;padding:10px;margin-bottom:10px;font-size:.82rem}
  .prob-meter{display:flex;align-items:center;gap:6px;margin:5px 0;font-size:.8rem}
  .prob-track{flex:1;height:6px;background:var(--bg);border-radius:3px;overflow:hidden}
  .prob-fill{height:100%;border-radius:3px}
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;z-index:100}
  .overlay.hidden{display:none}
  .modal{background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:24px;max-width:540px;max-height:90vh;overflow-y:auto}
  .modal h2{margin-bottom:8px} .modal p{color:var(--muted);margin-bottom:12px;line-height:1.65;text-align:left;font-size:.9rem}
  .modal.victory h2{color:var(--green)} .modal.tragedy h2{color:var(--red)}
  .modal.victory{border-color:var(--green)} .modal.tragedy{border-color:var(--red)}
  .modal .final-stats div{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border);font-size:.85rem}
  .modal.slot-modal{max-width:720px}
  .modal.status-modal{text-align:center;max-width:400px;border-color:rgba(88,166,255,.35)}
  .modal.status-modal h2{font-size:1.1rem;color:var(--text)}
  .modal.status-modal .status-icon{font-size:3rem;line-height:1;margin:8px 0 12px}
  .modal.status-modal p{font-size:.88rem;line-height:1.7}
  .modal.consume-modal{text-align:left;max-width:420px}
  .modal.consume-modal .consume-msg{font-size:.84rem;line-height:1.65;color:var(--muted);margin:10px 0}
  .modal.consume-modal .consume-msg b{color:var(--text)}
  .modal.casino-settle-modal{text-align:left;max-width:480px;max-height:none;overflow:visible;border-color:rgba(210,153,34,.45)}
  .modal.casino-settle-modal h2{text-align:center;font-size:1.05rem}
  .modal.casino-settle-modal .status-icon{text-align:center}
  #casinoSettleOverlay{align-items:flex-start;padding:24px 12px;overflow-y:auto}
  .casino-settle-msg{font-size:.82rem;line-height:1.6;color:var(--text);margin:10px 0;max-height:none;overflow:visible}
  .casino-settle-msg .settle-sum{font-size:1rem;font-weight:700;text-align:center;margin-bottom:8px;color:var(--yellow)}
  .casino-settle-row{display:flex;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:.76rem}
  .casino-settle-row.win{color:var(--green)}
  .casino-settle-row.lose{color:var(--red)}
  .casino-settle-total{margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-weight:600;font-size:.84rem}
  .casino-settle-hint{font-size:.68rem;color:var(--muted);text-align:center;margin-top:6px}
  .consume-actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:14px}
  #statusChangeOverlay{z-index:110}
  .storage-hint{font-size:.78rem;color:var(--yellow);background:rgba(210,153,34,.08);padding:8px;border-radius:6px;margin-bottom:10px}
  .slot-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:12px 0}
  @media(max-width:640px){.slot-grid{grid-template-columns:1fr}}
  .slot-card{position:relative;border:1px solid var(--border);border-radius:8px;padding:10px 28px 10px 10px;background:var(--bg);text-align:left;min-height:120px;display:flex;flex-direction:column}
  .slot-card.selected{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}
  .slot-card.empty{opacity:.9;padding-right:10px}
  .slot-del{position:absolute;top:6px;right:6px;width:22px;height:22px;padding:0;border:1px solid transparent;border-radius:4px;
    background:transparent;color:var(--muted);font-size:.85rem;line-height:1;cursor:pointer;opacity:.55}
  .slot-del:hover{opacity:1;color:var(--red);border-color:rgba(248,81,73,.35);background:rgba(248,81,73,.08)}
  .slot-card .slot-title{font-weight:700;font-size:.85rem;margin-bottom:4px;padding-right:4px}
  .slot-card .slot-char{font-size:.68rem;color:var(--muted);font-weight:400;margin-top:2px}
  .slot-card .save-meta{color:var(--muted);font-size:.7rem;line-height:1.4;flex:1}
  .slot-actions{display:flex;flex-direction:column;gap:4px;margin-top:8px}
  .slot-actions-row{display:flex;gap:5px;flex-wrap:wrap}
  .slot-actions .btn{font-size:.7rem;padding:3px 8px}
  .char-create-panel{margin-top:12px;padding-top:12px;border-top:1px solid var(--border)}
  .rebirth-btn{position:fixed;bottom:12px;right:12px;z-index:90;padding:6px 12px;font-size:.72rem;
    background:rgba(240,136,62,.15);border:1px solid var(--orange);color:var(--orange);border-radius:20px;cursor:pointer}
  .rebirth-btn:hover{background:rgba(240,136,62,.28)}
  .intro-tip{background:rgba(88,166,255,.08);border:1px solid rgba(88,166,255,.25);border-radius:8px;padding:9px;margin-bottom:10px;font-size:.8rem;color:var(--muted)}
  .offer-box{background:var(--bg);border:1px dashed var(--border);border-radius:6px;padding:8px;margin:6px 0}
  .emp-card{background:rgba(63,185,80,.08);border:1px solid rgba(63,185,80,.3);border-radius:8px;padding:9px;margin-bottom:10px;font-size:.82rem}
  .daily-hdr{font-size:.95rem;margin-bottom:8px}
  .daily-time-bar{padding:4px 0 8px;margin-bottom:4px;border-bottom:1px solid var(--border)}
  .daily-stats{display:flex;flex-wrap:wrap;gap:10px;font-size:.8rem;margin-bottom:8px}
  .daily-stats b{color:var(--green)}
  .daily-temp,.daily-stat-panel{font-size:.8rem;margin-bottom:8px;display:block;line-height:1.55}
  .daily-stat-hint{font-size:.68rem;color:var(--muted);margin-bottom:6px}
  .daily-stat-person{margin:8px 0 4px}
  .daily-stat-person-hdr{font-size:.82rem;color:var(--text);margin-bottom:4px}
  .daily-stat-person-hdr b{color:var(--text)}
  .daily-stat-line{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:baseline}
  .stat-dim{display:inline-flex;flex-wrap:wrap;align-items:baseline;gap:4px}
  .stat-dim .stat-name{color:var(--text);font-weight:600}
  .stat-dim .stat-val{color:var(--green);font-weight:700;font-size:.92rem}
  .stat-dim .stat-brk{color:var(--muted);font-size:.68rem}
  .stat-mod.pos{color:var(--green);font-weight:600}
  .stat-mod.neg{color:var(--red);font-weight:600}
  .stat-mod.zero{color:var(--muted)}
  .daily-temp-row{margin:4px 0}
  .daily-week{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px}
  .daily-dot{font-size:.7rem;padding:3px 6px;border-radius:4px;background:var(--bg);border:1px solid var(--border);color:var(--muted)}
  .daily-dot.cur{border-color:var(--green);color:var(--green);background:rgba(63,185,80,.1)}
  .daily-dot.done{opacity:.55;text-decoration:line-through}
  .daily-actions{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;align-items:center}
  .daily-actions .fold-meta{width:100%;margin:0 0 4px}
  .daily-partner{display:flex;align-items:center;gap:8px;font-size:.8rem;margin-bottom:8px;padding:6px 10px;background:var(--bg);border:1px solid var(--border);border-radius:6px}
  .partner-em{font-size:1.35em;line-height:1;flex-shrink:0;display:inline-block;vertical-align:middle;font-family:"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif}
  .daily-partner .partner-em{font-size:1.6rem}
  .daily-partner-inline .partner-em{font-size:1.15em;margin-right:2px}
  .daily-partner-inline{font-size:.72rem;color:var(--muted);padding:4px 8px;border:1px dashed var(--border);border-radius:6px;white-space:nowrap}
  .daily-shop,.phone-fold,.car-fold,.daily-contacts{font-size:.78rem;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)}
  .phone-fold-hdr{display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none;padding:2px 0}
  .phone-fold-body{margin-top:6px;font-size:.72rem}
  .nokia-phone-desc{display:block;margin-top:4px;line-height:1.45;font-size:.7rem}
  .daily-contact-list{max-height:320px;overflow-y:auto;margin-top:4px}
  .daily-contact{padding:3px 0;border-bottom:1px dashed var(--border)}
  .contacts-modal{max-width:440px;max-height:88vh;text-align:left}
  .contacts-modal h2{font-size:1.05rem;margin-bottom:8px;text-align:center}
  .company-recruit-modal{max-width:520px;max-height:88vh;text-align:left}
  .company-recruit-split{display:flex;gap:0;max-height:62vh;margin-top:6px;align-items:stretch}
  .company-recruit-list-pane{flex:1 1 100%;min-width:0;overflow-y:auto;max-height:62vh;font-size:.78rem;transition:flex-basis .2s ease}
  .company-recruit-read-pane{display:none;flex:1 1 56%;min-width:0;max-height:62vh;overflow-y:auto;border-left:1px solid var(--border);padding-left:10px;font-size:.78rem}
  .company-recruit-split.with-read .company-recruit-list-pane{flex:0 0 42%;max-width:42%}
  .company-recruit-split.with-read .company-recruit-read-pane{display:block}
  .company-mgmt-fold{margin-top:8px}
  .company-mgmt-panel{font-size:.82rem;line-height:1.5}
  #companyRecruitBody{font-size:.78rem}
  #contactsModalBody{overflow-y:auto;max-height:62vh;font-size:.78rem;margin-top:6px}
  .daily-side-tools{display:flex;flex-wrap:wrap;gap:10px 18px;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)}
  .daily-side-tools .daily-contacts,.daily-side-tools .daily-wish{border-top:none;margin-top:0;padding-top:0;flex:1;min-width:140px}
  .gift-wish-modal{max-width:min(92vw,640px);max-height:88vh;text-align:left}
  .gift-wish-modal h2{font-size:1.05rem;margin-bottom:8px;text-align:center}
  .wish-table{width:100%;border-collapse:collapse;font-size:.72rem;margin-top:4px;table-layout:fixed}
  .wish-table th,.wish-table td{padding:6px 8px;border-bottom:1px dashed var(--border);text-align:left;vertical-align:top}
  .wish-table th{color:var(--muted);font-weight:600}
  .wish-table .wish-col-date{width:72px;white-space:nowrap}
  .wish-table .wish-col-kind{width:64px;white-space:nowrap}
  .wish-table .wish-col-amt{width:72px;white-space:nowrap}
  .wish-table .wish-col-status{width:56px;white-space:nowrap;text-align:center}
  .wish-table .wish-col-gift{word-break:keep-all;line-height:1.45}
  .wish-table .wish-desc{display:block;margin-top:3px;color:var(--muted);font-size:.68rem;word-break:keep-all;line-height:1.4}
  .wish-ok{color:var(--green)} .wish-no{color:var(--red)} .wish-broke{color:var(--yellow)}
  .contact-row{border-bottom:1px dashed var(--border);padding:8px 4px}
  .contact-row.starred{background:rgba(210,153,34,.07);border-radius:4px}
  .contact-row-hdr{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
  .contact-group-fold{margin:10px 0 8px}
  .contact-group-hdr{padding:6px 0 4px;border-bottom:1px solid var(--border)}
  .contact-group-body{margin-top:4px}
  .contact-group-chev{width:1em;flex-shrink:0}
  .contact-pick-row.contact-pick-disabled{opacity:.55}
  .contact-star{cursor:pointer;border:none;background:transparent;font-size:1rem;padding:0 4px;line-height:1;color:var(--yellow)}
  .contact-star.off{color:var(--muted);opacity:.55}
  .contact-gender{font-size:.68rem;color:var(--blue);border:1px solid rgba(88,166,255,.35);padding:0 4px;border-radius:3px}
  .contact-actions-row{margin-top:5px;display:flex;flex-wrap:wrap;gap:4px;align-items:center;width:100%}
  .contact-del-btn{font-size:.72rem!important;padding:3px 8px!important;margin-left:auto;color:var(--red)!important;border-color:rgba(248,81,73,.35)!important}
  .contact-del-btn:hover{background:rgba(248,81,73,.1)!important}
  .daily-done{color:var(--green);font-size:.85rem}
  .auto-life-summary{display:grid;grid-template-columns:1fr 1fr;gap:6px 14px;font-size:.8rem;margin-bottom:12px}
  .auto-life-summary span{color:var(--muted);display:block;font-size:.7rem}
  .auto-life-events{font-size:.78rem;max-height:220px;overflow-y:auto;border-top:1px solid var(--border);padding-top:8px}
  .auto-life-events ul{margin:6px 0 0;padding-left:18px}
  .auto-life-events li{margin:3px 0}
  .affair-loc-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
  .affair-loc-btn{font-size:.72rem;line-height:1.35;padding:8px 6px;white-space:normal;height:auto}
  #autoLifeOverlay{z-index:105}
  #autoLifeOverlay .modal{max-width:480px;max-height:85vh;overflow-y:auto}
  .apply-method,.gamble-panel,.market-session{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:9px;margin:6px 0}
  .market-hdr{display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding:8px 10px;margin:8px 0;background:rgba(88,166,255,.08);border:1px solid rgba(88,166,255,.25);border-radius:6px;font-size:.82rem}
  .market-hdr b{color:var(--yellow);font-size:1rem}
  .market-booth{display:flex;gap:8px;align-items:flex-start;padding:8px;border-bottom:1px solid var(--border)}
  .market-booth .booth-body{flex:1;font-size:.8rem}
  .market-booth .btn{flex-shrink:0;font-size:.72rem;padding:4px 10px}
  .method-row{display:flex;align-items:center;gap:5px;margin:4px 0;cursor:pointer;flex-wrap:wrap}
  .apply-method select,.gamble-panel select,.gamble-panel input{background:var(--panel);border:1px solid var(--border);color:var(--text);padding:3px 6px;border-radius:4px;font-size:.76rem}
  .cost-hint{color:var(--yellow);font-size:.76rem;margin-top:4px}
  .stock-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);gap:6px;flex-wrap:wrap}
  .stock-row .up{color:var(--red);font-weight:600}
  .stock-row .down{color:var(--green);font-weight:600}
  .portfolio-fold{margin-bottom:8px}
  .portfolio-fold-hdr{display:flex;align-items:center;gap:6px;width:100%;background:transparent;border:none;color:var(--muted);font-size:.72rem;text-transform:uppercase;padding:6px 0 4px;cursor:pointer;border-bottom:1px solid var(--border);margin:0}
  .portfolio-fold-hdr:hover{color:var(--text)}
  .portfolio-fold-count{font-size:.65rem;color:var(--accent);text-transform:none}
  .portfolio-fold-chevron{margin-left:auto;font-size:.6rem;opacity:.7}
  .portfolio-fold.collapsed .portfolio-fold-body{display:none}
  .circle-fold.collapsed .circle-fold-body{display:none}
  .portfolio-panel{font-size:.76rem;color:var(--muted);padding:4px 0 2px}
  .port-row{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 6px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.04)}
  .port-row:last-child{border-bottom:none}
  .port-qty{color:var(--yellow);font-weight:700}
  .port-row .up{color:var(--red);font-weight:600}
  .port-row .down{color:var(--green);font-weight:600}
  .stock-chart-wrap{flex:1;min-width:130px;max-width:220px;display:flex;align-items:center;gap:3px}
  .stock-chart-wrap canvas{flex:1;min-width:0;width:auto;height:36px;display:block;border-radius:4px;background:rgba(0,0,0,.2)}
  .stock-trend-tag{flex:0 0 16px;width:16px;text-align:center;font-size:.9rem;font-weight:800;line-height:1;user-select:none}
  .stock-trend-tag.up{color:var(--red)}
  .stock-trend-tag.down{color:var(--green)}
  .stock-trend-tag.flat{color:var(--muted)}
  .casino-lobby,.casino-floor{background:linear-gradient(180deg,#0f4d2a,#0a3520);border:1px solid #2d6b45;border-radius:10px;padding:12px;margin:6px 0}
  .chip-cage{padding:10px;background:rgba(0,0,0,.25);border:1px solid rgba(210,153,34,.4);border-radius:8px;margin-bottom:10px}
  .chip-cage-hdr{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:8px;font-size:.8rem}
  .chip-cage-hdr b{color:var(--yellow)}
  .cage-rack{display:flex;flex-wrap:wrap;gap:6px;max-height:120px;overflow-y:auto;padding:4px 0}
  .chip-hand-panel{margin:10px 0;padding:10px;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.1);border-radius:8px;min-height:64px}
  .chip-hand-hdr{font-size:.72rem;color:#b8e0c8;margin-bottom:6px;display:flex;justify-content:space-between}
  .chip-hand{display:flex;flex-wrap:wrap;gap:4px;align-items:flex-end;min-height:48px}
  .chip-hand-empty{color:var(--muted);font-size:.76rem;padding:8px 0}
  .chip-stack{position:relative;display:inline-block;vertical-align:bottom;margin:0 4px 16px 0;flex-shrink:0}
  .chip-stack .stack-count{position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);font-size:.62rem;color:var(--yellow);font-weight:700;white-space:nowrap}
  .casino-chip{position:relative;width:42px;height:42px;border-radius:50%;border:none;padding:0;cursor:pointer;flex-shrink:0;
    display:inline-flex;align-items:center;justify-content:center;
    background:
      repeating-conic-gradient(from 8deg,var(--chip-edge) 0deg 14deg,var(--chip-edge-dark) 14deg 28deg),
      radial-gradient(circle at 50% 38%,#fff 0%,#f3f3ef 58%,transparent 59%);
    background-size:100% 100%,100% 100%;
    box-shadow:0 3px 0 rgba(0,0,0,.42),0 5px 9px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.85);
    transition:transform .12s,box-shadow .12s}
  .casino-chip::before{content:'';position:absolute;inset:9px;border-radius:50%;background:radial-gradient(circle at 38% 32%,#fff,#ececea);
    border:1px solid rgba(0,0,0,.07);box-shadow:inset 0 1px 3px rgba(0,0,0,.08);pointer-events:none}
  .casino-chip::after{content:'';position:absolute;inset:5px;border-radius:50%;border:2px dashed rgba(255,255,255,.42);pointer-events:none}
  .casino-chip.chip-cage-size{width:36px;height:36px}
  .casino-chip.chip-cage-size::before{inset:7px}
  .casino-chip.chip-cage-size::after{inset:4px}
  .casino-chip.chip-zone-size{width:32px;height:32px}
  .casino-chip.chip-zone-size::before{inset:6px}
  .casino-chip.chip-zone-size::after{inset:3px}
  .casino-chip:hover{transform:translateY(-2px) scale(1.05)}
  .casino-chip.selected{box-shadow:0 0 0 2px #fff,0 0 12px var(--yellow),0 3px 0 rgba(0,0,0,.42);transform:translateY(-3px) scale(1.08)}
  .chip-val{position:relative;z-index:1;font-size:.58rem;font-weight:800;color:var(--chip-text);line-height:1;letter-spacing:-.02em}
  .casino-chip.chip-cage-size .chip-val{font-size:.5rem}
  .casino-chip.chip-zone-size .chip-val{font-size:.46rem}
  .dice-table{margin:10px 0;padding:10px;background:rgba(0,0,0,.2);border-radius:8px;border:1px solid rgba(255,255,255,.08)}
  .dice-arena{display:flex;justify-content:center;align-items:center;gap:16px;padding:12px 8px;margin:8px 0;background:rgba(0,0,0,.35);border-radius:10px;min-height:88px}
  .die{width:52px;height:52px;background:linear-gradient(145deg,#fffef8,#e8e0d0);border-radius:11px;
    box-shadow:0 5px 0 #6b5344,0 8px 16px rgba(0,0,0,.45);display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);padding:7px;gap:2px}
  .die.rolling{animation:dieShake .07s infinite}
  @keyframes dieShake{0%,100%{transform:rotate(-12deg) translateY(0)}25%{transform:rotate(8deg) translateY(-8px) scale(1.05)}50%{transform:rotate(-6deg) translateY(-4px)}75%{transform:rotate(10deg) translateY(-10px)}}
  .die .pip{width:9px;height:9px;border-radius:50%;background:#c41e3a;box-shadow:inset 0 -1px 1px rgba(0,0,0,.3);justify-self:center;align-self:center}
  .die .pip.hide{visibility:hidden}
  .bet-zones-row{display:flex;gap:8px;margin-bottom:8px}
  .bet-zone{flex:1;min-height:88px;border:2px dashed rgba(255,255,255,.2);border-radius:8px;padding:6px;font-size:.76rem;transition:border-color .15s,background .15s;cursor:pointer;display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;text-align:left}
  .bet-zone:hover,.bet-zone.has-bet{border-color:var(--yellow);background:rgba(210,153,34,.08)}
  .bet-zone.big{border-color:rgba(248,81,73,.45)} .bet-zone.small{border-color:rgba(88,166,255,.45)}
  .bet-zone.triple{border-color:rgba(163,113,247,.5);min-height:0}
  .bet-zone .zone-label{font-weight:700}
  .zone-head{display:flex;justify-content:space-between;align-items:center;gap:6px;width:100%;flex-shrink:0}
  .zone-head .zone-label{text-align:left;flex:1;min-width:0}
  .zone-side-gold{color:var(--yellow);font-size:.68rem;font-weight:700;white-space:nowrap;text-align:right;line-height:1.25;flex-shrink:0}
  .bet-zones-row .zone-side-gold{font-size:.72rem}
  .num-zone .zone-head{align-items:center;margin-bottom:1px}
  .num-zone .zone-side-gold{font-size:.55rem}
  .triple-col .zone-side-gold{font-size:.58rem}
  .zone-chip-pile{min-height:44px;display:flex;flex-wrap:wrap;gap:2px;align-items:flex-end;justify-content:center;margin-top:4px;padding:2px}
  .dice-triple-num-row{display:flex;align-items:stretch;gap:0;width:100%;margin-bottom:8px}
  .triple-col{display:flex;flex-direction:row;gap:4px;flex:0 0 auto;align-items:stretch;align-self:stretch}
  .triple-col .bet-zone.triple{flex:0 0 82px;width:82px;min-height:calc(46px*2 + 3px);height:100%;padding:4px 5px;font-size:.62rem;display:flex;flex-direction:column;justify-content:flex-start}
  .triple-col .bet-zone.triple .zone-label{font-size:.64rem;line-height:1.15}
  .triple-col .zone-chip-pile{min-height:14px;margin-top:2px;padding:1px;flex:1 1 auto;align-content:flex-end;max-height:none;overflow:visible}
  .triple-col .zone-chip-pile.ai-pile{min-height:24px}
  .triple-num-spacer{flex:1;min-width:12px;align-self:stretch}
  .num-zone-col{flex:1 1 auto;min-width:0;display:flex;justify-content:flex-end;align-self:stretch}
  .num-zone-strip{display:grid;grid-template-columns:repeat(7,minmax(32px,1fr));gap:3px;width:100%;max-width:400px}
  .num-zone{min-height:46px;border:2px solid rgba(255,255,255,.15);border-radius:5px;padding:2px 3px;text-align:center;font-size:.62rem;cursor:pointer;display:flex;flex-direction:column;justify-content:flex-start}
  .num-zone:hover,.num-zone.has-bet{border-color:var(--yellow);background:rgba(210,153,34,.08)}
  .num-zone b{font-size:.64rem;line-height:1.1}
  .num-zone .zone-chip-pile{min-height:14px}
  .table-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
  .dice-display{font-size:.9rem;margin:6px 0;color:var(--yellow);text-align:center;line-height:1.2}
  .dice-sum{font-size:2.4rem;font-weight:800;color:#fff;letter-spacing:.02em}
  .dice-sum-note{font-size:.72rem;font-weight:500;color:var(--yellow);margin-top:2px}
  .settle-sum.dice-result-only{font-size:2.2rem;font-weight:800;text-align:center;color:#fff;margin-bottom:6px}
  .casino-game-tabs{margin:10px 0 8px}
  .roulette-table{margin:10px 0;padding:10px;background:rgba(0,0,0,.2);border-radius:8px;border:1px solid rgba(255,255,255,.08)}
  .roulette-stage{display:grid;grid-template-columns:1fr auto 1fr;gap:8px 10px;align-items:center;margin-bottom:8px}
  .roulette-result-panel{grid-column:1;justify-self:start;width:min(200px,42%);max-width:min(200px,42%);margin-left:calc(min(200px,42%) - 2.1em);display:flex;flex-direction:column;justify-content:center;text-align:center;padding:4px 8px;min-height:0;font-size:1.05rem}
  .roulette-result-panel .rl-result-hdr{font-size:.76rem}
  .roulette-result-panel #rlOddsHdr{font-size:.64rem!important}
  .roulette-result-panel .dice-display{font-size:1.05rem}
  .roulette-result-panel .dice-sum{font-size:3.25rem;line-height:1.05}
  .roulette-result-panel .dice-sum-note{font-size:.88rem;margin-top:4px}
  .roulette-wheel-wrap{position:relative;width:min(220px,40vw);height:min(220px,40vw);flex-shrink:0;grid-column:2;justify-self:center}
  .roulette-wheel-wrap canvas{width:100%;height:100%;display:block;border-radius:50%;box-shadow:0 0 0 4px #d4af37,0 8px 24px rgba(0,0,0,.5)}
  .roulette-color-panel{grid-column:3;justify-self:end;display:flex;flex-direction:column;gap:6px;width:204px;min-width:204px;max-width:204px;align-self:stretch;min-height:min(200px,36vw)}
  .rl-result-hdr{font-size:.68rem;color:#9ecfb0;margin-bottom:4px;line-height:1.3}
  .rl-numbers-section{margin-top:0}
  .rl-numbers-hdr{font-size:.72rem;color:#9ecfb0;margin-bottom:4px}
  .rl-board{display:grid;grid-template-columns:40px 1fr;column-gap:4px;row-gap:4px;align-items:stretch}
  .rl-color-bet{flex:1 1 0;width:100%;min-height:52px;border:2px dashed rgba(255,255,255,.2);border-radius:6px;padding:6px 8px;text-align:center;cursor:pointer;font-weight:700;font-size:.72rem;display:flex;flex-direction:column;justify-content:center;line-height:1.15}
  .rl-color-bet .zone-odds{font-size:.5rem;color:#9ecfb0;margin-top:1px;line-height:1.1}
  .rl-color-pct{font-size:.58rem;color:#fff;font-weight:700;margin-top:1px;line-height:1}
  .rl-color-bet .zone-chip-pile{min-height:0;margin-top:2px;padding:0;max-height:28px;overflow:hidden;flex:1 1 auto}
  .rl-board-zero{grid-column:1;grid-row:1;display:flex;flex-direction:column}
  .rl-board-nums{grid-column:2;grid-row:1;min-width:0}
  .rl-color-bet.rl-red{border-color:rgba(196,30,58,.55);background:rgba(196,30,58,.08)}
  .rl-color-bet.rl-black{border-color:rgba(40,40,50,.8);background:rgba(30,30,38,.5)}
  .rl-color-bet:hover,.rl-color-bet.has-bet{border-color:var(--yellow);background:rgba(210,153,34,.1)}
  .rl-zero-col{display:flex;flex-direction:column}
  .rl-zero{min-width:44px;flex:1;border:2px solid rgba(45,138,78,.7);border-radius:6px;background:rgba(45,138,78,.25);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-weight:700;padding:2px}
  .rl-grid{flex:1;display:flex;flex-direction:column;gap:2px}
  .rl-row{display:grid;grid-template-columns:repeat(12,1fr);gap:3px}
  .rl-num{min-height:26px;border:2px solid rgba(255,255,255,.12);border-radius:4px;padding:1px 2px;text-align:center;font-size:.74rem;cursor:pointer;display:flex;flex-direction:column;justify-content:center}
  .rl-num.rl-red{background:rgba(196,30,58,.35);border-color:rgba(196,30,58,.5)}
  .rl-num.rl-black{background:rgba(26,26,34,.85);border-color:rgba(80,80,90,.6)}
  .rl-num:hover,.rl-num.has-bet{outline:2px solid var(--yellow)}
  .rl-num b{font-size:.82rem;font-weight:800;line-height:1}
  .rl-num-pct{font-size:.62rem;color:#fff;font-weight:600;line-height:1;margin-top:0}
  .rl-num .zone-chip-pile,.rl-zero .zone-chip-pile{min-height:0;margin-top:0;padding:0}
  .rl-zero b{font-size:.82rem}
  .rl-zero .rl-num-pct{font-size:.62rem;color:#fff;font-weight:600;margin-top:0}
  .tabs{display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap}
  .tabs .btn{padding:4px 10px;font-size:.75rem} .tabs .btn.active{background:var(--blue);border-color:var(--blue);color:#fff}
  .finance-subtabs{display:flex;gap:6px;margin-bottom:10px}
  .finance-subtabs .btn{font-size:.78rem;padding:5px 14px}
  .finance-subtabs .btn.active{background:var(--accent);border-color:var(--accent);color:#fff}
</style>
</head>
<body>

<div id="startOverlay" class="overlay">
  <div class="modal slot-modal">
    <h2>万物涨落 · 理想人生</h2>
    <p class="storage-hint">存档保存在本机浏览器（GitHub Pages 在线玩同样有效，仅当前浏览器；换电脑或换浏览器无存档）</p>
    <p style="font-size:.92rem;color:var(--text);line-height:1.55;margin:8px 0 4px">在一切消失前，探索理想的人生。</p>
    <p style="font-size:.65rem;color:var(--muted);margin-top:-4px">版本 ${GAME_BUILD_ID} · 若线上数值不对请 Ctrl+F5 强刷</p>
    <div class="slot-grid" id="slotGrid"></div>
    <div id="charCreatePanel" class="char-create-panel" style="display:none">
      <p style="font-weight:600;margin-bottom:8px">档位 <span id="newSlotLabel">1</span> · 创造人生</p>
      <p class="fold-meta" style="margin-bottom:12px">掷骰决定性别、性向、家庭、高考与第一桶金。1988 年生 · 2010 年离校还有一个月。</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary" type="button" onclick="openLifeCreationWizard(pendingNewSlot)">🎲 创造人生</button>
        <button class="btn" type="button" onclick="cancelCharCreate()">返回选档</button>
      </div>
    </div>
  </div>
</div>
<div id="lifeCreationOverlay" class="overlay hidden">
  <div class="modal" id="lifeCreationModal" style="max-width:520px;text-align:left">
    <h2 style="text-align:center;margin-bottom:8px">🎲 创造人生</h2>
    <div id="lifeCreationBody" style="font-size:.88rem;line-height:1.6"></div>
    <div class="consume-actions" id="lifeCreationActions" style="margin-top:14px;justify-content:center"></div>
  </div>
</div>
<button type="button" id="btnRebirth" class="rebirth-btn" style="display:none" onclick="confirmRebirth()">重新投胎</button>

<div id="endOverlay" class="overlay hidden">
  <div class="modal" id="endModal"><h2 id="endTitle">人生终局</h2><p id="endSummary"></p><div class="final-stats" id="finalStats"></div>
  <button class="btn btn-primary" onclick="replayGame()">再来一局</button></div>
</div>
<div id="statusChangeOverlay" class="overlay hidden" onclick="if(event.target===this)closeStatusModal()">
  <div class="modal status-modal">
    <div class="status-icon" id="statusChangeIcon">📌</div>
    <h2 id="statusChangeTitle">人生状态变化</h2>
    <p id="statusChangeMsg"></p>
    <button type="button" class="btn btn-primary" id="statusChangeBtn" onclick="closeStatusModal()" style="margin-top:18px;min-width:140px">继续生活</button>
  </div>
</div>
<div id="autoLifeOverlay" class="overlay hidden">
  <div class="modal status-modal" id="autoLifeModal">
    <div class="status-icon" id="autoLifeIcon">⏩</div>
    <h2 id="autoLifeTitle">自动生活</h2>
    <div id="autoLifeBody" style="text-align:left;font-size:.82rem"></div>
    <div class="consume-actions" id="autoLifeActions" style="margin-top:14px"></div>
  </div>
</div>
<div id="consumeOverlay" class="overlay hidden">
  <div class="modal status-modal consume-modal">
    <div class="status-icon" id="consumeIcon">📱</div>
    <h2 id="consumeTitle">刷手机</h2>
    <div class="consume-msg" id="consumeMsg"></div>
    <div class="consume-actions" id="consumeActions"></div>
  </div>
</div>
<div id="companyRecruitOverlay" class="overlay hidden" onclick="if(event.target===this)closeCompanyRecruitInbox()">
  <div class="modal company-recruit-modal" onclick="event.stopPropagation()">
    <h2 id="companyRecruitTitle">📧 招聘邮箱</h2>
    <div class="company-recruit-split" id="companyRecruitSplit">
      <div class="company-recruit-list-pane" id="companyRecruitListPane">
        <div id="companyRecruitBody"></div>
      </div>
      <div class="company-recruit-read-pane" id="companyRecruitReadPane">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">
          <b id="companyRecruitReadTitle" style="font-size:.85rem">简历详情</b>
          <button type="button" class="btn" style="font-size:.68rem;padding:2px 8px" onclick="closeCompanyCvReadPane()">收起</button>
        </div>
        <div id="companyRecruitReadBody"></div>
        <div id="companyRecruitReadActions" style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px"></div>
      </div>
    </div>
    <div style="text-align:center;margin-top:10px"><button type="button" class="btn" onclick="closeCompanyRecruitInbox()">关闭</button></div>
  </div>
</div>
<div id="contactsOverlay" class="overlay hidden" onclick="if(event.target===this)closeContactsModal()">
  <div class="modal contacts-modal">
    <h2 id="contactsModalTitle">📇 通讯录</h2>
    <div id="contactsModalBody"></div>
    <div style="text-align:center;margin-top:10px"><button type="button" class="btn" onclick="closeContactsModal()">关闭</button></div>
  </div>
</div>
<div id="giftWishOverlay" class="overlay hidden" onclick="if(event.target===this)closeGiftWishModal()">
  <div class="modal gift-wish-modal">
    <h2>📜 历史愿望单</h2>
    <p class="fold-meta" style="text-align:center;margin:-4px 0 8px">伴侣约会时讨要的礼物 · 含年度超级梦想</p>
    <div id="giftWishModalBody"></div>
    <div style="text-align:center;margin-top:10px"><button type="button" class="btn" onclick="closeGiftWishModal()">关闭</button></div>
  </div>
</div>
<div id="casinoSettleOverlay" class="overlay hidden" onclick="if(event.target===this)closeCasinoSettleMenu()">
  <div class="modal casino-settle-modal">
    <div class="status-icon" id="casinoSettleIcon">🎲</div>
    <h2 id="casinoSettleTitle">结算</h2>
    <div class="casino-settle-msg" id="casinoSettleMsg"></div>
    <div class="casino-settle-hint" id="casinoSettleHint"></div>
    <div style="text-align:center"><button type="button" class="btn btn-primary" onclick="closeCasinoSettleMenu()" style="margin-top:14px;min-width:120px">关闭</button></div>
  </div>
</div>

<header id="gameHeader">
  <div class="header-grid">
    <h1 class="header-title">
      <span class="ht-main">万物<span class="ht-accent">涨落</span></span>
      <span class="ht-sub">理想人生</span>
    </h1>
    <div class="stats-bar header-stats">
      <div class="stat"><label>年龄</label><value id="statAge">30岁</value></div>
      <div class="stat"><label>日期</label><value id="statDate">2024-01-07</value></div>
      <div class="stat"><label>周数</label><value id="statWeek">1/1560</value></div>
      <div class="stat"><label>婚姻</label><value id="statMarriage">已婚</value></div>
      <div class="stat"><label>现金</label><value class="cash" id="statCash">¥0</value></div>
      <div class="stat"><label>累计收入</label><value class="money" id="statMoney">¥0</value></div>
      <div class="stat"><label>月支出</label><value id="statMonthly">¥11000</value></div>
      <div class="stat"><label>压力</label><value class="stress" id="statStress">0</value><div class="stress-track"><div class="stress-fill" id="stressBar" style="width:0%"></div></div></div>
      <div class="stat"><label>状态</label><value id="statLife">正常</value></div>
      <div class="stat"><label>理想</label><value id="statIdeal">—</value></div>
      <div class="stat"><label>住房</label><value id="statMortgage">—</value></div>
      <div class="stat"><label>家庭</label><value id="statFamily">无孩</value></div>
    </div>
    <div class="header-prog-row">
      <div class="stat stat-prog stat-prog-ideal">
        <label>理想进度</label>
        <value id="idealProgText">—</value>
        <div class="prog-track"><div class="prog-fill ideal" id="idealProgFill" style="width:0%"></div></div>
      </div>
      <div class="stat stat-prog stat-prog-mort">
        <label>房贷还清</label>
        <value id="mortgageProgText">0/360月</value>
        <div class="prog-track"><div class="prog-fill mortgage" id="mortgageProgFill" style="width:0%"></div></div>
      </div>
      <div class="stat stat-prog stat-prog-sav">
        <label>个人存款</label>
        <value id="savingsProgText">¥0</value>
        <div class="prog-track"><div class="prog-fill savings" id="savingsProgFill" style="width:0%"></div></div>
        <div class="milestone-row" id="milestoneRow"></div>
      </div>
    </div>
    <div class="social-medals" id="socialMedals">
      <div class="social-medals-title">社会勋章</div>
      <div class="social-medals-row" id="socialMedalsRow"></div>
    </div>
  </div>
</header>

<main>
  <aside class="ref-panel" id="refPanel">
    <div class="ref-panel-hdr">
      <button type="button" class="ref-collapse-btn" id="btnRefCollapse" onclick="toggleRefPanel()" title="折叠就业市场">◀</button>
      <div class="ref-hdr-wrap">
        <div class="ref-hdr">中国就业市场</div>
        <div class="ref-sub">242个职业 · 方块面积=就业人数 · 颜色=AI影响（0–10）</div>
        <div class="ref-view-toggle" id="refViewToggle">
          <button type="button" class="ref-view-btn active" data-view="national" onclick="setRefPanelView('national')">全国总览</button>
          <button type="button" class="ref-view-btn" data-view="category" onclick="setRefPanelView('category')">行业分析</button>
          <button type="button" class="ref-view-btn" data-view="job" onclick="setRefPanelView('job')">职业详情</button>
        </div>
      </div>
    </div>
    <div class="ref-panel-body" id="refPanelBody">
      <div id="refCasinoStats" class="ref-casino-stats" style="display:none"></div>
      <div id="refNational"></div>
      <div id="refJobDetail" class="ref-job-detail ref-content" style="display:none"></div>
      <div id="refIndustry" class="ref-job-detail ref-content" style="display:none"></div>
    </div>
  </aside>
  <aside class="sidebar">
    <div class="portfolio-fold" id="portfolioFold">
      <button type="button" class="portfolio-fold-hdr" id="btnPortfolioFold" onclick="togglePortfolioFold()" title="折叠/展开持仓">
        <span>持仓股票</span>
        <span class="portfolio-fold-count" id="portfolioFoldCount"></span>
        <span class="portfolio-fold-chevron" id="portfolioFoldChevron">▼</span>
      </button>
      <div class="portfolio-fold-body" id="portfolioFoldBody">
        <div id="portfolioPanel" class="portfolio-panel">暂无持仓</div>
      </div>
    </div>
    <input type="text" id="searchInput" placeholder="搜索职业..." oninput="onJobSearchInput()" style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:5px 8px;border-radius:6px;margin-bottom:6px">
    <div class="industry-filter" id="industryFilter">
      <button type="button" class="industry-filter-hdr" id="btnIndustryFilterFold" onclick="toggleIndustryFilter()" title="折叠/展开行业筛选">
        <span>筛选行业</span>
        <span class="industry-filter-count" id="industryFilterCount"></span>
        <span class="industry-filter-chevron" id="industryFilterChevron">▼</span>
      </button>
      <div class="industry-filter-body" id="industryFilterBody">
        <div id="categoryList"></div>
        <div class="industry-picker-wrap" id="industryPickerWrap">
          <button type="button" class="cat-btn cat-btn-add" onclick="toggleIndustryPicker()">＋ 添加行业</button>
          <div id="industryPickerAll" class="industry-picker-all" style="display:none"></div>
        </div>
      </div>
    </div>
    <div class="tabs" id="sortBtns">
      <button class="btn active" data-sort="heat" onclick="setSort('heat')">热度</button>
      <button class="btn" data-sort="pay" onclick="setSort('pay')">薪资</button>
      <button class="btn" data-sort="exposure" onclick="setSort('exposure')">AI影响</button>
    </div>
    <div class="life-panel" id="lifePanel"></div>
    <div class="panel-title">求职日历</div>
    <div class="interview-cal" id="interviewCalendar"></div>
  </aside>

  <section class="center">
    <div class="intro-tip" id="actionTip"></div>
    <div class="emp-card" id="empCard" style="display:none"></div>
    <div class="tabs" id="mainTabs">
      <button class="btn active" data-tab="daily" onclick="showTab('daily')">日常</button>
      <button class="btn" data-tab="job" onclick="showTab('job')">应聘求职</button>
      <button class="btn" data-tab="sideincome" onclick="showTab('sideincome')">副业自营</button>
      <button class="btn" data-tab="network" onclick="showTab('network')">网络</button>
      <button class="btn" data-tab="company" id="btnTabCompany" onclick="showTab('company')" style="display:none">公司管理</button>
      <button class="btn" data-tab="stock" onclick="showTab('stock')">资产管理</button>
      <button class="btn" data-tab="gamble" onclick="showTab('gamble')">赌博</button>
      <button class="btn" data-tab="life" onclick="showTab('life')">生活消费</button>
      <button class="btn" data-tab="companion" onclick="showTab('companion')">家庭</button>
      <button class="btn" data-tab="ideal" onclick="showTab('ideal')">理想</button>
    </div>
    <div id="dailyTimeBar" class="daily-time-bar" style="display:none"></div>
    <div id="tabDaily">
      <div class="detail-panel" id="dailyPanel"><p style="color:var(--muted)">开始游戏後，在此安排每周七天日程（白天/晚上/休息）。</p></div>
      <div id="autoLifePanel"></div>
    </div>
    <div id="tabNetwork" style="display:none">
      <div class="detail-panel" id="networkPanel"><p style="color:var(--muted)">本人资料始终可见 · 智能手机（非诺基亚）或电脑可浏览关系网与他人详情</p></div>
    </div>
    <div id="tabCompany" style="display:none">
      <div class="detail-panel company-mgmt-panel" id="companyMgmtPanel"><p style="color:var(--muted)">创办公司后，在此管理组织、在研业务与招聘。</p></div>
    </div>
    <div id="tabJob" style="display:none">
      <div class="detail-panel" id="jobHuntPanel"><p style="color:var(--muted)">在此浏览招聘、投递简历（与日常时段共用 8h）。</p></div>
      <div id="tabJobLegacy" style="display:none">
      <div class="detail-panel" id="campusRecruitmentPanel" style="display:none;margin-bottom:10px">
        <div class="panel-title">🎓 校园招聘 · <span id="campusRecruitMeta"></span></div>
        <p style="font-size:.72rem;color:var(--muted);margin-bottom:6px">离校前专场 · 岗位匹配你的院校与学历 · 录取率约为社会招聘的3倍 · 免费投递</p>
        <div id="campusRecruitList"></div>
      </div>
      <div class="detail-panel" id="detailPanel" style="display:none">
        <h3 id="detailTitle"></h3>
        <div id="detailMeta" style="color:var(--muted);margin-bottom:5px;font-size:.8rem"></div>
        <canvas id="detailChart" width="600" height="90" style="width:100%;max-width:600px;height:90px"></canvas>
        <div id="probSection">
          <div class="prob-meter prob-hidden" id="probResumeRow"><span>简历过关</span><div class="prob-track"><div class="prob-fill" id="resumeProbBar"></div></div><span id="resumeProbText"></span></div>
          <div class="prob-meter prob-hidden" id="probInterviewRow"><span>面试成功</span><div class="prob-track"><div class="prob-fill" id="interviewProbBar"></div></div><span id="interviewProbText"></span></div>
          <div class="prob-meter prob-hidden" id="probReferralRow"><span>内推概率</span><div class="prob-track"><div class="prob-fill" id="referralProbBar"></div></div><span id="referralProbText"></span></div>
          <div class="prob-meter prob-hidden" id="probSpongeRow"><span id="probSpongeLabel">周裁员率</span><div class="prob-track"><div class="prob-fill" id="spongeProbBar"></div></div><span id="spongeProbText"></span></div>
          <div id="probLockedHint" style="display:none;font-size:.75rem;color:var(--muted)"></div>
        </div>
      </div>
      <div class="apply-method" id="applyMethodPanel">
        <div style="font-weight:600;margin-bottom:4px">① 先选应聘渠道（付费后抽取本期招聘）</div>
        <label class="method-row"><input type="radio" name="applyMethod" value="market" onchange="onApplyConfigChange()"> 线下人才市场 ¥200（入场随机刷岗·8小时·每家-10分钟）</label>
        <label class="method-row"><input type="radio" name="applyMethod" value="app" checked onchange="onApplyConfigChange()"> 招聘APP（开通一个¥100/月，可多选平台）</label>
        <div id="appCheckboxes" style="margin-left:16px">
          <label class="method-row"><input type="checkbox" name="appPick" value="boss" checked onchange="onApplyConfigChange()"> BOSS直聘 <span style="color:var(--muted)">优选脑力·头部/重点</span> <span class="app-sub-hint" data-app="boss"></span></label>
          <label class="method-row"><input type="checkbox" name="appPick" value="lagou" checked onchange="onApplyConfigChange()"> 拉勾网 <span style="color:var(--muted)">优选互联网·脑力</span> <span class="app-sub-hint" data-app="lagou"></span></label>
          <label class="method-row"><input type="checkbox" name="appPick" value="liepin" onchange="onApplyConfigChange()"> 猎聘 <span style="color:var(--muted)">优选高管·头部</span> <span class="app-sub-hint" data-app="liepin"></span></label>
          <label class="method-row"><input type="checkbox" name="appPick" value="zhilian" onchange="onApplyConfigChange()"> 智联招聘 <span style="color:var(--muted)">优选中小·体力</span> <span class="app-sub-hint" data-app="zhilian"></span></label>
          <label class="method-row"><input type="checkbox" name="appPick" value="51job" onchange="onApplyConfigChange()"> 前程无忧 <span style="color:var(--muted)">优选基层·中小</span> <span class="app-sub-hint" data-app="51job"></span></label>
        </div>
        <label class="method-row" id="headhunterMethodRow"><input type="radio" name="applyMethod" value="headhunter" id="headhunterRadio" onchange="onApplyConfigChange()"> 猎头（入职成功收年薪20%） <span id="headhunterLockHint" style="font-size:.72rem"></span></label>
        <div class="cost-hint" id="applyCostHint">简历费按渠道收取；面试：在线免费 · 同城¥50 · 异地按路程（远城含住宿）</div>
      </div>
      <div class="detail-panel" id="inboxPanel" style="display:none">
        <div class="panel-title">📬 招聘回复 · 选择面试</div>
        <div class="inbox-sort" id="inboxSortBtns"></div>
        <div id="inboxList"></div>
      </div>
      <div class="detail-panel" id="offersPanel" style="display:none">
        <div class="panel-title">📋 待接 Offer</div>
        <div id="offersList"></div>
      </div>
      <div class="legend">
        <span><i style="background:rgba(63,185,80,.7)"></i>AI低</span>
        <span><i style="background:rgba(210,153,34,.7)"></i>AI中</span>
        <span><i style="background:rgba(248,81,73,.7)"></i>AI高</span>
        <span>方块大小≈就业人数</span>
      </div>
      <p style="font-size:.72rem;color:var(--muted);margin-bottom:6px">每行业一大块 · 热度=100+就业前景% · 线上APP需先选职业；线下市场入场随机刷岗</p>
      <div class="job-treemap" id="jobTreemap"></div>
      <div class="actions actions-sticky">
        <button class="btn btn-primary" id="btnApply" onclick="startApplyFlow()" disabled title="请先点击上方职业方块（可多选）">查看本期招聘</button>
        <button class="btn btn-warn" id="btnReferral" style="display:none" onclick="openReferralModal()">🤝 内推机会</button>
        <span id="applyPickHint" style="display:block;font-size:.72rem;color:var(--muted);margin-top:4px">从「日常」进入应聘后，在此选职业并投递</span>
      </div>
      <div class="detail-panel" id="selfEmployPanel" style="margin-top:10px"></div>
      </div>
    </div>
    <div id="tabSideIncome" style="display:none">
      <div class="detail-panel" id="sideIncomeTabPanel"><p style="color:var(--muted)">兼职、电商、自媒体、个体户 · 不占应聘页签</p></div>
    </div>
    <div id="applyModal" class="overlay hidden">
      <div class="modal wide">
        <h2 id="applyModalTitle">本期招聘 · 勾选投递</h2>
        <p id="applyModalDesc"></p>
        <div style="margin:6px 0;font-size:.78rem">
          <button class="btn" type="button" onclick="toggleAllListings(true)">全选</button>
          <button class="btn" type="button" onclick="toggleAllListings(false)">全不选</button>
          <button class="btn" type="button" id="btnSortListingsPay" style="display:none" onclick="sortApplyListings('pay')">按年薪排序</button>
          <span id="listingPickCount" style="color:var(--muted);margin-left:8px"></span>
        </div>
        <div class="modal-list" id="applyModalList"></div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-primary" id="btnConfirmApply" onclick="confirmBatchApply()">投递选中岗位</button>
          <button class="btn" onclick="closeApplyModal()">放弃本期</button>
        </div>
      </div>
    </div>
    <div id="marketOverlay" class="overlay hidden">
      <div class="modal wide market-session">
        <h2>🏢 线下人才市场</h2>
        <div class="market-hdr">
          <span>剩余 <b id="marketTimeLeft">8小时00分</b></span>
          <span>已投递 <b id="marketApplyCount">0</b> / 48 家</span>
          <span style="color:var(--muted)">投递/再逛 各-10分钟 · 1秒=1分钟</span>
        </div>
        <p style="font-size:.76rem;color:var(--muted);margin-bottom:8px">8个摊位随机刷出，不中意可「再逛逛」换一批。时间耗尽或离场后结束本周求职。</p>
        <div class="modal-list" id="marketBoothList"></div>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
          <button class="btn" id="btnMarketRefresh" onclick="marketRefreshBooths()">再逛逛（-10分钟）</button>
          <button class="btn btn-primary" onclick="leaveMarket()">离场结束</button>
        </div>
      </div>
    </div>
    <div id="referralModal" class="overlay hidden">
      <div class="modal wide">
        <h2>🤝 熟人内推</h2>
        <p id="referralModalDesc">本周有人愿意帮你内推，通常只有一两个岗位。</p>
        <div class="modal-list" id="referralModalList"></div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-primary" id="btnConfirmReferral" onclick="confirmReferralApply()">投递内推</button>
          <button class="btn" onclick="closeReferralModal()">暂不考虑</button>
        </div>
      </div>
    </div>
    <div id="tabStock" style="display:none">
      <div class="finance-subtabs">
        <button type="button" class="btn active" id="btnFinanceStock" onclick="switchFinanceTab('stock')">📈 炒股</button>
        <button type="button" class="btn" id="btnFinanceAssets" onclick="switchFinanceTab('assets')">💼 资产</button>
      </div>
      <div id="stockTradePanel" class="finance-panel">
        <p style="color:var(--muted);margin-bottom:8px">A股真实标的，佣金万分之2。锚点价为2024年初真实市价，现价围绕锚点波动（<b>不是你的买入价</b>，未持仓不显示）。买入后显示<b>成本价</b>与浮盈浮亏。<b style="color:var(--green)">炒股随时可买卖，不占本周求职/赌博行动</b>，四个活动页签可随时切换。</p>
        <div id="stockList"></div>
      </div>
      <div id="assetsPanel" class="finance-panel" style="display:none"></div>
    </div>
    <div id="tabGamble" style="display:none">
      <div id="casinoLobby" class="casino-lobby">
        <p style="color:var(--muted);margin-bottom:8px">场内可切换 <b>骰宝</b> 与 <b>轮盘</b>。每局随机 1–5 位高手入座（东邪/西毒/南帝/北丐/中神通），${CASINO_TIMING.spectateAi / 1000}s 押注 → ${CASINO_TIMING.spectateFollow / 1000}s 跟注 → 开奖 → ${CASINO_TIMING.spectateRest / 1000}s 休息；未下注按时开奖，有下注点「下注完成」。</p>
        <button class="btn btn-warn" id="btnEnterCasino" onclick="enterCasino()">澳门五日游 · ¥2000</button>
        <div class="cost-hint">占用一整周 · 兑筹码后可跟注 AI；也可纯观看</div>
      </div>
      <div id="casinoFloor" class="casino-floor" style="display:none">
        <div class="chip-cage">
          <div class="chip-cage-hdr">
            <span>现金 <b id="casinoCash">¥0</b></span>
            <span>手中筹码 <b id="casinoHandTotal">0</b></span>
            <input type="number" id="chipExchangeAmt" value="1000" min="10" step="10" style="width:80px;font-size:.76rem">
            <button class="btn" onclick="exchangeCashToChips()">按金额兑换</button>
            <button class="btn" onclick="cashAllChipsFromHand()">手中筹码全换现金</button>
          </div>
          <div style="font-size:.68rem;color:#9ecfb0;margin-bottom:4px">筹码柜台 · 点击购入（¥→手中）</div>
          <div class="cage-rack" id="cageRack"></div>
        </div>
        <div class="spectate-hud" id="spectateHud" style="display:none">
          <div class="spectate-phase" id="spectatePhaseText">骰宝围观：准备中…</div>
          <button class="btn" id="btnFollowAi" type="button" onclick="followAiBets()" disabled>跟注高手</button>
        </div>
        <div class="chip-hand-panel">
          <div class="chip-hand-hdr"><span>手中筹码 · 点选后押入赌区</span><span id="selectedChipHint">未选中</span></div>
          <div class="chip-hand" id="chipHand"></div>
        </div>
        <div class="tabs casino-game-tabs">
          <button class="btn active" id="btnCasinoDice" type="button" onclick="switchCasinoGame('dice')">🎲 骰宝</button>
          <button class="btn" id="btnCasinoRoulette" type="button" onclick="switchCasinoGame('roulette')">🎡 轮盘</button>
        </div>
        <div id="casinoDiceGame">
        <div class="dice-table">
          <div class="dice-arena" id="diceArena">
            <div class="die" id="die1"></div>
            <div class="die" id="die2"></div>
            <div class="die" id="die3"></div>
          </div>
          <div id="diceResult" class="dice-display"></div>
          <div style="font-size:.72rem;color:#9ecfb0;margin-bottom:4px">大小区</div>
          <div class="bet-zones-row">
            <div class="bet-zone small" data-zone="small" onclick="placeTableBet('small')"><div class="zone-head"><div class="zone-label">小 4–10</div><span class="zone-side-gold"><span class="zone-pay-odds">1:1</span><span class="dice-zone-pct" id="dicePctSmall"></span></span></div><div class="zone-chip-pile" id="pileSmall"></div></div>
            <div class="bet-zone big" data-zone="big" onclick="placeTableBet('big')"><div class="zone-head"><div class="zone-label">大 11–17</div><span class="zone-side-gold"><span class="zone-pay-odds">1:1</span><span class="dice-zone-pct" id="dicePctBig"></span></span></div><div class="zone-chip-pile" id="pileBig"></div></div>
          </div>
          <div style="font-size:.72rem;color:#9ecfb0;margin:8px 0 4px">豹子区（左）· 点数区（右）：<b>4–17 各为一格</b>，仅当三骰总和<b>恰好</b>等于该数才赢；豹子通杀大小</div>
          <div class="dice-triple-num-row">
            <div class="triple-col">
              <div class="bet-zone triple" data-zone="triple1" onclick="placeTableBet('triple1')"><div class="zone-head"><div class="zone-label">豹子 · 111</div><span class="zone-side-gold"><span class="zone-pay-odds">1:150</span><span class="dice-zone-pct" id="dicePctTriple1"></span></span></div><div class="zone-chip-pile" id="pileTriple1"></div></div>
              <div class="bet-zone triple" data-zone="triple6" onclick="placeTableBet('triple6')"><div class="zone-head"><div class="zone-label">豹子 · 666</div><span class="zone-side-gold"><span class="zone-pay-odds">1:150</span><span class="dice-zone-pct" id="dicePctTriple6"></span></span></div><div class="zone-chip-pile" id="pileTriple6"></div></div>
            </div>
            <div class="triple-num-spacer" aria-hidden="true"></div>
            <div class="num-zone-col">
              <div class="num-zone-strip">
                ${DICE_SUM_ZONES_HTML}
              </div>
            </div>
          </div>
        </div>
        <div class="table-actions">
          <button class="btn btn-warn" id="btnRollDice" onclick="rollCasinoTable()">开盅</button>
          <button class="btn" onclick="clearTableBets()">收回桌面筹码</button>
        </div>
        </div>
        <div id="casinoRouletteGame" style="display:none">
          <div class="roulette-table">
            <div class="roulette-stage">
              <div class="roulette-result-panel">
                <div class="rl-result-hdr">轮盘结果</div>
                <div class="rl-result-hdr" id="rlOddsHdr" style="font-size:.58rem;margin-bottom:6px">欧洲轮盘</div>
                <div id="rouletteResult" class="dice-display">押注后点击开转</div>
              </div>
              <div class="roulette-wheel-wrap">
                <canvas id="rouletteWheel" width="280" height="280"></canvas>
              </div>
              <div class="roulette-color-panel">
                <div class="rl-color-bet rl-red" data-rzone="red" onclick="placeRouletteBet('red')"><div>红</div><div class="zone-odds"></div><div class="rl-color-pct" id="rlPctRed"></div><div class="zone-chip-pile" id="pileRred"></div></div>
                <div class="rl-color-bet rl-black" data-rzone="black" onclick="placeRouletteBet('black')"><div>黑</div><div class="zone-odds"></div><div class="rl-color-pct" id="rlPctBlack"></div><div class="zone-chip-pile" id="pileRblack"></div></div>
              </div>
            </div>
            <div class="rl-numbers-section">
              <div class="rl-numbers-hdr">0 · 数字区（直押 0–36）</div>
              <div class="rl-board">
                <div class="rl-zero-col rl-board-zero">
                  <div class="rl-zero" data-rzone="n0" onclick="placeRouletteBet('n0')"><b>0</b><div class="rl-num-pct" id="rlPct0"></div><div class="zone-chip-pile" id="pileRn0"></div></div>
                </div>
                <div class="rl-grid rl-board-nums" id="rouletteNumGrid"></div>
              </div>
            </div>
          </div>
          <div class="table-actions">
            <button class="btn btn-warn" id="btnSpinRoulette" onclick="spinRoulette()">开转</button>
            <button class="btn" onclick="clearRouletteBets()">收回桌面筹码</button>
          </div>
        </div>
        <div class="table-actions" style="margin-top:12px;border-top:1px solid rgba(255,255,255,.1);padding-top:10px">
          <button class="btn btn-primary" id="btnLeaveCasino" onclick="leaveCasino()">离桌结款 · 进入下周</button>
        </div>
      </div>
    </div>
    <div id="tabLife" style="display:none">
      <div class="finance-panel">
        <p style="color:var(--muted);margin-bottom:8px">备孕/代孕/试管、零食囤货（10/100/1000份折扣）、游戏机/电脑。同性伴侣做爱可选玩具（不怀孕）。进食请在「日常→宅家」。夫妻亲密度初始80，一月不约会会降低。</p>
        <div class="spending-panel" id="spendingPanel"></div>
      </div>
    </div>
    <div id="tabCompanion" style="display:none">
      <div class="companion-panel" id="companionPanel">
        <p class="companion-note">查看配偶与孩子状态。伴侣姓名与通讯录一致；备孕、育儿请在「消费」页操作。</p>
        <div id="companionContent"></div>
      </div>
    </div>
    <div id="tabIdeal" style="display:none">
      <div class="companion-panel" id="idealPanel">
        <p class="companion-note">理想项目助力名单与愿望单。暧昧/亲热≠亲密关系认定；被认定者可在离世时将遗产留给你。</p>
        <div id="idealPanelContent"></div>
      </div>
    </div>
  </section>

  <aside class="log-panel"><div class="panel-title">人生日志</div><div id="financeLedgerPanel"></div><div id="gameLog"></div></aside>
</main>

<script>
const RAW_DATA = ${JSON.stringify(data)};
const REAL_COMPANIES = ${JSON.stringify(REAL_CO)};
const TOTAL_WEEKS = 30 * 52;
const START_DATE = new Date(2024, 0, 1);
function getGameStartDate(){
  let d;
  if(game&&game.startDate){
    const p=String(game.startDate).split('-');
    if(p.length===3){
      d=new Date(parseInt(p[0],10),parseInt(p[1],10)-1,parseInt(p[2],10));
      d.setHours(0,0,0,0);
      if(!isNaN(d.getTime()))return d;
    }
  }
  if(game&&typeof computeGameStartDate==='function'){
    d=computeGameStartDate(game);
    if(d&&!isNaN(d.getTime()))return new Date(d.getTime());
  }
  return new Date(START_DATE.getTime());
}
const HISTORY_LEN = 52;
const WEEKS_PER_MONTH = 4;
const EDU_RANK = {'初中及以下':1,'高中':2,'中专':2,'高中/中专':2,'大专':3,'本科':4,'硕士':5,'博士':6};
function normEduRank(edu){return EDU_RANK[edu]||4}
function eduGapBetween(jobEdu,playerEdu){return Math.max(0,normEduRank(jobEdu)-normEduRank(playerEdu))}
const TIER_ORDER = ['high','mid','low'];
const TIER_LABEL = {high:'头部',mid:'重点',low:'草根'};
const SCALE_ORDER = ['large','medium','small'];
const SCALE_LABEL = {large:'大型',medium:'中型',small:'小型'};
const TOTAL_COMPANIES = 10000;
const SCALE_COUNTS = {large:100,medium:900,small:9000};
const GLOBAL_TIER_COUNTS = {high:700,mid:1300,low:8000};
const JOB_POOL_SIZE = 100;
const TIER_POOL_PER_JOB = {high:7,mid:13,low:80};
const IMP_ORDER = ['low','mid','high'];
const IMP_LABEL = {low:'普通',mid:'专家',high:'总监'};
const ROLE_EXTRA = {intern:'实习',temp:'临时工',scam:'诈骗岗'};
const JOB_APPS = {boss:'BOSS直聘',zhilian:'智联招聘','51job':'前程无忧',lagou:'拉勾网',liepin:'猎聘'};
const APP_COST_EACH = 100;
const APP_SUB_WEEKS = WEEKS_PER_MONTH;
const REFERRER_NAMES = ['张明','李芳','王强','刘洋','陈静','赵磊','孙婷','周浩','吴敏','郑凯','林雪','黄伟','何丽','马超'];
const REFERRER_RELATIONS = ['大学室友','前同事','老同学','亲戚','球友','邻居','朋友的朋友','前领导介绍','读书会认识','健身房搭子','老乡','表姐夫'];
// 优选标签：匹配时加成，不匹配仍可在该平台招聘/投递（基准×1）
const APP_PREFERRED = {
  boss:{brainPrefer:true,manualPrefer:false,tierPrefer:['high','mid'],execPrefer:false,label:'优选脑力·头部/重点'},
  lagou:{brainPrefer:true,manualPrefer:false,tierPrefer:['high','mid'],execPrefer:false,label:'优选互联网·脑力'},
  liepin:{brainPrefer:true,manualPrefer:false,tierPrefer:['high'],execPrefer:true,label:'优选高管·头部'},
  zhilian:{brainPrefer:false,manualPrefer:true,tierPrefer:['mid','low'],execPrefer:false,label:'优选中小·体力'},
  '51job':{brainPrefer:false,manualPrefer:true,tierPrefer:['mid','low'],execPrefer:false,label:'优选基层·中小'}
};
const PROB_REVEAL_FAILS = 100;
const CHANNEL_DRAW_SIZE = {market:40,app:50,headhunter:28,referral:22};
const ALLNIGHT_JOB_PAY_BIAS = 2.8;
const MARKET_ENTRY_FEE = 200;
const MARKET_TIME_BUDGET = 480;
const MARKET_APPLY_MINUTES = 10;
const MARKET_MAX_APPLIES = 48;
const MARKET_BOOTHS = 8;
const MARKET_SEC_PER_MIN = 1;
const WOLF_OFFER_EXPIRES = 100;
const SPONGE_STREAK_WEEKS = 4;
const STRESS_MEDAL_THRESHOLD = 60;
const SOCIAL_MEDALS = [
  {id:'expert',field:'showProbabilities',icon:'📋',label:'应聘专家',effect:'求职详情显示通过概率'},
  {id:'wolf',field:'wolfAchievement',icon:'🐺',label:'独狼',effect:'炒股更易上涨 · 赌桌败局有概率翻盘'},
  {id:'sponge',field:'showSpongeInsight',icon:'🧽',label:'海绵宝宝',effect:'职业详情显示裁员率或实习留存率'}
];
const STARTING_CASH = 50000;
const PARTNER_START_CASH_MAX = 100000;
const PARTNER_SECRET_STASH_MAX = 200000000;
function rollPartnerStartingCash(seed){
  const r=seededRand(Math.abs(seed)||42);
  return Math.floor(r()*(PARTNER_START_CASH_MAX+1));
}
function rollPartnerSecretStashTotal(seed){
  const r=seededRand(Math.abs(seed)||99);
  return Math.floor(r()*(PARTNER_SECRET_STASH_MAX+1));
}
function initPartnerSecretStash(companion,stocks,seed){
  if(!companion)return;
  const total=rollPartnerSecretStashTotal(seed);
  const r=seededRand(Math.abs(seed)+3);
  companion.secretStashPortfolio={};
  if(total<=0){
    companion.secretStash=0;companion.secretStashCash=0;return;
  }
  let cashPart=Math.floor(total*(0.2+r()*0.5));
  let stockBudget=total-cashPart;
  if(!stocks||!stocks.length||stockBudget<3000){
    companion.secretStashCash=total;
    companion.secretStash=total;
    return;
  }
  const s=stocks[Math.floor(r()*stocks.length)];
  const shares=Math.max(1,Math.floor(stockBudget/Math.max(1,s.price)));
  const stockVal=shares*s.price;
  companion.secretStashPortfolio[s.symbol]=shares;
  companion.secretStashCash=cashPart;
  companion.secretStash=cashPart+stockVal;
}
const MORTGAGE_MONTHS = 360;
const MORTGAGE_PAYMENT = 6000;
const CHILD_TRIGGER_CASH = 500000;
const STRESS_UNEMPLOYED_WEEKLY = 1;
const STRESS_SINGLE_WEEKLY = 5;
const STRESS_HIRE_RELIEF = 30;
const STRESS_CHILD_BIRTH = 50;
const STRESS_DIVORCE = 25;
const STRESS_PARENTS_MONTHLY = 6;
const STRESS_LIFE_TIER_DROP = 20;
const STRESS_LONG_DISTANCE_WEEKLY = 1;
const STRESS_MIND_BLOCK = 666;
const STRESS_MAD = 1000;
const PLAYER_HOME_CITY = '杭州';
const CITIES = ['北京','上海','深圳','广州','杭州','成都','武汉','南京','苏州','西安','重庆','天津','青岛','大连','厦门','宁波','无锡','佛山','东莞','合肥','长沙','郑州','济南','福州','昆明','贵阳','南宁'];
const BRANCH_CITY_NAMES = (REAL_COMPANIES.BRANCH_SUFFIXES||[]).map(s=>s.slice(1,-1));
const KNOWN_COMPANY_CITIES = new Set([...CITIES,...BRANCH_CITY_NAMES]);
function parseCityFromCompanyName(name){
  if(!name)return null;
  let found=null;
  let m;
  const reFull=/（([^）]+)）/g;
  while((m=reFull.exec(name))!==null){if(KNOWN_COMPANY_CITIES.has(m[1]))found=m[1];}
  if(found)return found;
  const reHalf=/\(([^)]+)\)/g;
  while((m=reHalf.exec(name))!==null){if(KNOWN_COMPANY_CITIES.has(m[1]))found=m[1];}
  return found;
}
const NEAR_CITIES = ['上海','南京','苏州','宁波','无锡','合肥'];
const INTERVIEW_SLOTS = [
  {id:'0900',label:'09:00',order:0},{id:'1030',label:'10:30',order:1},
  {id:'1430',label:'14:30',order:2},{id:'1600',label:'16:00',order:3}
];
const INTERVIEW_SLOT_HOURS = 2;
function interviewSlotHourTarget(order){return(order+1)*INTERVIEW_SLOT_HOURS}
const SNACK_UNIT_COST = 50;
const SNACK_MEAL_SINGLE_COST = 50;
const SNACK_MEAL_COUPLE_COST = 100;
const SNACK_REBOUND_PER_PORTION = 2;
const SNACK_RELIEF_PER_PORTION = 1;
const SNACK_PORTIONS_CAP = 6;
const SNACK_MIN_NET_RELIEF = 1;
const SCROLL_WEEKLY_LIMIT = 60;
const SV_VIEWS_PER_CLICK = 10;
const SV_TRASH_STRESS = 20;
const SV_FUN_STRESS = 100;
const DRAMA_STRESS_PAIR = 2;
const DRAMA_CLIFF_CHANCE = 0.4;
const FLIRT_CHATS_PER_SESSION = 10;
const FLIRT_SILENT_STRESS = 10;
const FLIRT_AWKWARD_STRESS = 5;
const MOBILE_AD_STRESS = 10;
const MOBILE_PAY_COST = 500;
const MOBILE_ADFREE_COST = 30;
const MOBILE_ADFREE_WEEKS = 4;
const DATE_COST = 500;
const INTIMACY_MIN = -100;
const INTIMACY_MAX = 200;
const INTIMACY_INITIAL = 80;
const DIVORCE_PLEAD_INTIMACY_COST = 100;
const DIVORCE_BUFFER_WEEKS = WEEKS_PER_MONTH;
const DIVORCE_RECONCILE_WISH_MIN = 50;
const DIVORCE_RECONCILE_INTIMACY_AFTER = 120;
const DIVORCE_LAWYER_TIERS={
  normal:{fee:10000,label:'普通律师团队',win:0.30,winAdj:0.32},
  premium:{fee:100000,label:'重点律师团队',win:0.45,winAdj:0.40},
  director:{fee:1000000,label:'总监律师团队',win:0.58,winAdj:0.50}
};
const DIVORCE_MORTGAGE_PAYMENT = 12000;
const SEX_WEEKLY_LIMIT = 7;
const PARTNER_STD_ON_AFFAIR_CHANCE = 0.40;
const PLAYER_STD_FROM_PARTNER_CHANCE = 0.12;
const PLAYER_STD_FROM_STRANGER_CHANCE = 0.01;
const STD_CURE_COST = 3000;
const STD_STRESS_WEEKS = 12;
const STD_TREATMENT_VISITS = 4;
const PREGNANCY_CHANCE_SAFE = 0.06;
const PREGNANCY_CHANCE_RAW = 0.20;
const PREGNANCY_CHANCE_PROC_CREATE = 0.35;
const PROC_CREATE_COST = 3000;
const AFFAIR_PREGNANCY_CHANCE = 0.15;
const PREGNANCY_MONTHS = 10;
const PREGNANCY_WEEKS = PREGNANCY_MONTHS * WEEKS_PER_MONTH;
const PREGNANCY_LAYOFF_CHANCE = 0.32;
const PREGNANCY_POSTPARTUM_INTIMACY_BONUS = 20;
const DIVORCE_ASSET_CAP = 1000000;
const DIVORCE_LAWYER_FEE_MIN = 80000;
const DIVORCE_LAWYER_FEE_RATE = 0.04;
const CONSOLE_COST = 3000;
const COMPUTER_COST = 10000;
const PARENTS_SUPPORT_MONTHS = 120;
const INHERITANCE_NEGATIVE_RATE = 0.05;
const INHERITANCE_ASSET_GATE = 1000000;
const INHERITANCE_MILD_DEBT_CAP = 1000000;
const INHERITANCE_MAX = 100000000;
const INHERITANCE_POSITIVE_RATES = [
  {min:0,max:1000000,share:0.80},
  {min:1000000,max:10000000,share:0.10},
  {min:10000000,max:100000000,share:0.05}
];
const CASH_STRESS_MILESTONES = [
  {amt:500000,key:'m50w',label:'50万'},
  {amt:1000000,key:'m100w',label:'100万'},
  {amt:5000000,key:'m500w',label:'500万'},
  {amt:10000000,key:'m1000w',label:'1000万'},
  {amt:50000000,key:'m5000w',label:'5000万'},
  {amt:100000000,key:'m1e',label:'1亿'}
];
const SAVINGS_BAR_MAX = 500000000;
const SAVINGS_SCALE = [
  {amt:0,pct:0},
  {amt:10000,pct:2},
  {amt:500000,pct:14},
  {amt:3000000,pct:30},
  {amt:10000000,pct:46},
  {amt:50000000,pct:64},
  {amt:100000000,pct:78},
  {amt:500000000,pct:100}
];
const SAVINGS_MILESTONES = [
  {amt:500000,icon:'👶',label:'婴儿'},
  {amt:3000000,icon:'🏠',label:'一套房'},
  {amt:10000000,icon:'🏝️',label:'小岛'},
  {amt:50000000,icon:'🏢',label:'大楼'},
  {amt:100000000,icon:'👍',label:'1亿'}
];
const AFFAIR_CASH_THRESHOLD = 1000000;
const AFFAIR_MARRIED_WEEKS = 7 * 52;
const SAVE_SLOT_COUNT = 3;
const LS_SLOTS = 'csg_slots_v3';
const LS_SLOTS_BACKUP = 'csg_slots_backup_v1';
const GAME_BUILD_ID = '${GAME_BUILD_ID}';
const CHILD_RAISING_MONTHS = 216;
const CHILD_LIVING_COST = 20000;
const PATERNITY_TEST_COST = 5000;
const MANUAL_CATS = ['农林牧渔','制造业','建筑工程','交通运输','餐饮住宿','个人与生活服务'];
const START_AGE = 22;
const MAX_SALARY = 10000000;
const PAY_MULT_RANGES={
  high:{high:[1.8,12],mid:[1.05,2.8],low:[0.82,1.25]},
  mid:{high:[1.25,4],mid:[0.88,1.18],low:[0.72,1.05]},
  low:{high:[0.95,2.2],mid:[0.8,1.08],low:[0.68,1.0]}
};
const SCHOOL_TIER_FACTOR = {
  none:{high:0.0001,mid:0.001,low:1},
  normal:{high:0.01,mid:0.1,low:1},
  '985':{high:0.01,mid:0.1,low:1},
  c9:{high:0.1,mid:1,low:10}
};
const EDU_SCHOOL_ALLOW = {
  '高中':[],
  '中专':[],
  '高中/中专':[],
  '大专':['normal','985'],
  '本科':['normal','985','c9'],
  '硕士':['normal','985','c9'],
  '博士':['normal','985','c9']
};
const EDU_SCHOOL_HINT = {
  '高中':'高中：普通高中学历（文理分科），无院校选择',
  '中专':'中专：中等专业学校 · 含所学专业，无院校选择',
  '高中/中专':'（旧档）将自动区分为高中或中专',
  '大专':'大专：可选普通高校或985/211',
  '本科':'本科及以上：普通高校 / 985·211 / C9·常春藤',
  '硕士':'本科及以上：普通高校 / 985·211 / C9·常春藤',
  '博士':'本科及以上：普通高校 / 985·211 / C9·常春藤'
};
const EDU_TIER_FACTOR = {
  '博士':{high:0.1,mid:1,low:10},
  '硕士':{high:0.1,mid:1,low:10},
  '本科':{high:0.01,mid:0.1,low:1},
  '大专':{high:0.001,mid:0.01,low:1},
  '高中':{high:0.0001,mid:0.001,low:1},
  '中专':{high:0.0001,mid:0.001,low:1},
  '高中/中专':{high:0.0001,mid:0.001,low:1}
};
const IMP_APPLY_FACTOR = {low:1,mid:0.1,high:0.01};
const AGE_LIMIT_CAT = {'信息技术':40,'文化传媒':38,'金融':42,'制造业':45,'销售零售与电商':38};
const HIRE_VS_REFERRAL = 0.35;
const INTERVIEW_LOCAL_COST = 50;
const INTERVIEW_NEAR_TRAVEL = {上海:380,苏州:180,宁波:140,无锡:220,南京:480,合肥:520};
const INTERVIEW_FAR_TRAVEL = {北京:1600,深圳:2100,广州:1900,成都:1700,武汉:900,西安:1400,重庆:1500,青岛:1100,大连:1800,厦门:1200,天津:1500,长沙:800,郑州:900,济南:800,福州:1000,昆明:1900,贵阳:1600,南宁:1500};
const INTERVIEW_ACCOMMODATION_BASE = 380;
const WELFARE_BY_TIER = {
  high:{hours:'9:00-21:00弹性',ot:'加班常态化',leave:'年假15天+带薪病假',ins:'六险二金+补充医疗',meal:'免费三餐+班车',bonus:'年终奖3-8薪'},
  mid:{hours:'9:00-18:30',ot:'周末偶尔加班',leave:'年假10天',ins:'五险一金',meal:'午餐补贴',bonus:'年终奖1-3薪'},
  low:{hours:'轮班/不定时',ot:'加班费不稳定',leave:'法定最低',ins:'五险（部分缺失）',meal:'无',bonus:'看老板心情'}
};
const INTERNET_JOB_CATS=['信息技术','文化传媒','销售零售与电商'];
function clampOt(v,lo,hi){return Math.max(lo,Math.min(hi,v))}
function otLabelFromProbs(forced,pay,roleExtra){
  if(roleExtra==='temp')return pay>=0.35?'排班加班·按班结算':'排班不定时·加班费不稳';
  if(roleExtra==='intern'){
    if(forced>=0.55)return pay>=0.30?'实习常加班·有补贴':'实习常加班·补贴少';
    return '实习期偶尔加班';
  }
  if(forced>=0.70&&pay<0.35)return '加班常态化·加班费少';
  if(forced>=0.70)return '加班常态化';
  if(forced>=0.52)return '工作日常加班';
  if(forced>=0.35)return '周末偶尔加班';
  if(pay<0.28)return '加班费不稳定';
  return '基本准时下班';
}
function hoursLabelFromProbs(forced,tier,roleExtra){
  if(roleExtra==='temp')return '排班制';
  if(roleExtra==='intern')return forced>=0.55?'9:00-20:00':'9:00-18:00';
  if(forced>=0.72)return '9:00-21:00弹性';
  if(forced>=0.55)return '9:00-20:00';
  if(forced>=0.38)return '9:00-18:30';
  if(tier==='low')return '轮班/不定时';
  return '9:00-18:00';
}
function computeOvertimeProfile(tier,importance,roleExtra,company,job,rng){
  const r=typeof rng==='function'?rng:()=>Math.random();
  let forced=tier==='high'?0.74:tier==='mid'?0.44:0.30;
  let pay=tier==='high'?0.58:tier==='mid'?0.40:0.24;
  if(importance==='high'){forced+=0.10;pay+=0.08}
  else if(importance==='mid'){forced+=0.04;pay+=0.03}
  else{forced-=0.05;pay-=0.04}
  if(company){
    if(company.scale==='large'){forced+=0.07;pay+=0.04}
    else if(company.scale==='small'){forced-=0.05;pay-=0.06}
  }
  if(job){
    if(job.exposure>=8){forced+=0.10;pay-=0.04}
    else if(job.exposure>=6){forced+=0.06}
    if(INTERNET_JOB_CATS.includes(job.category))forced+=0.06;
    if(job.heatPct>=115)forced+=0.05;
  }
  if(roleExtra==='intern'){forced+=0.08;pay-=0.15}
  else if(roleExtra==='temp'){forced-=0.08;pay=0.38;forced=clampOt(forced,0.15,0.55)}
  forced+= (r()-0.5)*0.14;
  pay+= (r()-0.5)*0.12;
  forced=clampOt(forced,0.10,0.92);
  pay=clampOt(pay,0.08,0.80);
  const otLabel=otLabelFromProbs(forced,pay,roleExtra);
  const hoursLabel=hoursLabelFromProbs(forced,tier,roleExtra);
  const otPayMult=tier==='high'?1.15:tier==='mid'?1.0:0.85;
  return{forcedEveningProb:forced,otPayProb:pay,otLabel,hoursLabel,otPayMult};
}
function legacyOvertimeProfile(tier,importance,roleExtra,company,job){
  return computeOvertimeProfile(tier||'mid',importance||'low',roleExtra||null,company||null,job||null,()=>0.5);
}
function buildPositionWelfare(tier,importance,roleExtra,company,job,rng){
  const ot=computeOvertimeProfile(tier,importance,roleExtra,company,job,rng);
  const w=WELFARE_BY_TIER[tier];
  const imp=IMP_LABEL[importance];
  const extra=roleExtra==='intern'?' · 实习期薪资约55%·转正不确定':roleExtra==='temp'?' · 周薪结算·随时裁退':'';
  const welfare='工时'+ot.hoursLabel+' · '+ot.otLabel+' · '+w.leave+' · '+w.ins+' · '+w.meal+' · '+w.bonus+' · '+imp+'岗'+extra;
  return{welfare,otProfile:ot};
}
function ensureOfferOtProfile(offer,job){
  if(!offer||offer.otProfile)return;
  const built=buildPositionWelfare(offer.tier,offer.importance,offer.roleExtra,offer.company,job,()=>0.5);
  offer.otProfile=built.otProfile;
  offer.welfare=built.welfare;
}
const MACAU_ENTRY = 2000;
const SPECTATE_AI_MS = ${CASINO_TIMING.spectateAi};
const SPECTATE_FOLLOW_MS = ${CASINO_TIMING.spectateFollow};
const SPECTATE_REST_MS = ${CASINO_TIMING.spectateRest};
const CASINO_RESUME_MIN_MS = ${CASINO_TIMING.resumeMin};
const CASINO_AI_NAMES = ['东邪','西毒','南帝','北丐','中神通'];
const DICE_SUM_ZONES=['4','5','6','7','8','9','10','11','12','13','14','15','16','17'];
const DICE_SUM_ODDS={4:50,5:18,6:14,7:12,8:8,9:6,10:6,11:6,12:6,13:8,14:12,15:14,16:18,17:50};
const DICE_ZONE_LABELS={big:'大 11–17',small:'小 4–10',triple1:'豹子 111',triple6:'豹子 666'};
DICE_SUM_ZONES.forEach(s=>{DICE_ZONE_LABELS[s]='点数 '+s});
const DICE_ODDS_NOMINAL={big:1,small:1,triple1:150,triple6:150};
DICE_SUM_ZONES.forEach(s=>{DICE_ODDS_NOMINAL[s]=DICE_SUM_ODDS[+s]});
const ROULETTE_ODDS_NOMINAL = {red:1,black:1,single:35};
function fmtCasinoOdds(nominalProfit){
  const p=nominalProfit;
  if(p>=100)return '1:'+Math.round(p);
  if(p>=10)return '1:'+p.toFixed(1).replace(/\.0$/,'');
  return '1:'+p.toFixed(2).replace(/\.?0+$/,'');
}
/** 赢时利润（不含本金）；庄家优势仅来自轮盘0、骰宝豹子通杀等规则 */
function casinoWinProfit(amount,nominalOdds){return amount*nominalOdds}
function applyCasinoOddsLabels(){
  BET_ZONES.forEach(z=>{
    const n=DICE_ODDS_NOMINAL[z];
    if(n==null)return;
    const txt=fmtCasinoOdds(n);
    const el=document.querySelector('[data-zone="'+z+'"] .zone-pay-odds');
    if(el)el.textContent=txt;
  });
  const even=fmtCasinoOdds(ROULETTE_ODDS_NOMINAL.red);
  const single=fmtCasinoOdds(ROULETTE_ODDS_NOMINAL.single);
  document.querySelectorAll('.rl-color-bet .zone-odds').forEach(el=>{el.textContent=even});
  const hdr=document.getElementById('rlOddsHdr');
  if(hdr)hdr.textContent='欧洲单零轮盘 · 红/黑 '+even+' · 单号 '+single+' · 0通杀（庄家优势≈2.7%）';
}
const DICE_PCT_ID = {big:'Big',small:'Small',triple1:'Triple1',triple6:'Triple6'};
const CHIP_DENOMS = [10,20,50,100,200,500,1000,2000,5000,10000,100000,200000,500000,1000000];
const CHIP_COLORS = {
  10:{edge:'#b0bec5',edgeDark:'#78909c',text:'#546e7a'},
  20:{edge:'#42a5f5',edgeDark:'#1565c0',text:'#1565c0'},
  50:{edge:'#ff7043',edgeDark:'#d84315',text:'#bf360c'},
  100:{edge:'#424242',edgeDark:'#212121',text:'#212121'},
  200:{edge:'#66bb6a',edgeDark:'#2e7d32',text:'#2e7d32'},
  500:{edge:'#ab47bc',edgeDark:'#6a1b9a',text:'#6a1b9a'},
  1000:{edge:'#ffa726',edgeDark:'#ef6c00',text:'#e65100'},
  2000:{edge:'#ef5350',edgeDark:'#c62828',text:'#b71c1c'},
  5000:{edge:'#8d6e63',edgeDark:'#5d4037',text:'#4e342e'},
  10000:{edge:'#ec407a',edgeDark:'#ad1457',text:'#880e4f'},
  100000:{edge:'#ffca28',edgeDark:'#f9a825',text:'#f57f17'},
  200000:{edge:'#26c6da',edgeDark:'#00838f',text:'#00695c'},
  500000:{edge:'#7e57c2',edgeDark:'#4527a0',text:'#311b92'},
  1000000:{edge:'#ffc400',edgeDark:'#ff6d00',text:'#e65100'}
};
const DIE_PIP_POS = {1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
const BET_ZONES=['big','small','triple1','triple6',...DICE_SUM_ZONES];
const BET_ZONE_PILE_ID = {big:'Big',small:'Small',triple1:'Triple1',triple6:'Triple6'};
const ROULETTE_WHEEL = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const ROULETTE_RED = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const ROULETTE_NUM_ROWS = [[3,6,9,12,15,18,21,24,27,30,33,36],[2,5,8,11,14,17,20,23,26,29,32,35],[1,4,7,10,13,16,19,22,25,28,31,34]];
const ROULETTE_ZONES = ['red','black',...Array.from({length:37},(_,i)=>'n'+i)];
let casinoRolling = false;
let spectateLoopGen = 0;
let spectateTimers = [];
let spectateAutoTimer = null;
let spectateCountdownId = null;
let casinoSettleFreezeId = null;
let casinoSettleFreezeRemain = 0;
let casinoSettleAutoCloseTimer = null;
const CASINO_SETTLE_AUTO_MS = ${CASINO_TIMING.settleAuto};
let marketTimerId = null;
let statusModalQueue = [];
let statusModalOpen = false;
let statusModalCurrentOnClose = null;
const DICE_SUM_WAYS = {3:1,4:3,5:6,6:10,7:15,8:21,9:25,10:27,11:27,12:25,13:21,14:15,15:10,16:6,17:3,18:1};

let game=null,selectedIdx=-1,selectedJobIdxs=new Set(),applyCategoryPicks=new Set(),currentSort='heat',currentCategory='全部',actionDone=false,currentTab='daily',applyModalStep=0,pendingBatch=null,applyListingSort='default',refPanelView='national',refPanelCategory=null;
let calendarView='month',calendarYear=2024,calendarMonth=0;
let refPanelCollapsed=false;
let industryFilterCollapsed=false,industryPickerOpen=false;
let portfolioFoldCollapsed=false;
let interviewSortMode='time';
let inboxFoldOpen={pending:true,replied:true,confirmed:true,attended:true,missed:true,expired:false,ghost:false,rejected:false};
let financeFoldOpen=false;
let plannedFoldOpen=false;
let plannedExpandedCompanies=new Set();
let currentSlotIndex=-1,selectedSlotIndex=0,pendingNewSlot=-1;

function seededRand(seed){let s=Math.abs(seed)||1;return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}}
function shuffleArr(arr,rng){const r=rng||Math.random;for(let i=arr.length-1;i>0;i--){const j=Math.floor(r()*(i+1));const t=arr[i];arr[i]=arr[j];arr[j]=t}return arr}
function hashStr(s){let h=0;for(let i=0;i<s.length;i++)h=((h<<5)-h)+s.charCodeAt(i)|0;return Math.abs(h)}

function resolveListedStockCodeFromCompanyName(name){
  if(!name||typeof REAL_COMPANIES==='undefined'||!REAL_COMPANIES.LISTED_STOCKS)return null;
  const stripSuffix=function(s){
    return String(s).replace(/\s/g,'').replace(/[（(][^）)]*[）)]/g,'')
      .replace(/(分公司|子公司|事业部|研发中心|物流中心|销售中心|服务中心|制造基地|产业园|科技园)$/g,'')
      .replace(/(股份|集团|有限|公司|合资|科技|控股|国际|技术|发展|制造|生产|服务)+$/g,'');
  };
  const raw=String(name).replace(/\s/g,'');
  const candidates=[raw,stripSuffix(raw)].filter(function(c,i,a){return c&&a.indexOf(c)===i;});
  const listed=REAL_COMPANIES.LISTED_STOCKS;
  const aliasBases={'京东方':'京东方A'};
  let bestCode=null,bestScore=0;
  listed.forEach(function(ls){
    const bases=[ls.name,ls.name.replace(/A$/,'')];
    if(ls.name==='京东方A')bases.push('京东方');
    bases.forEach(function(base){
      if(!base||base.length<3)return;
      candidates.forEach(function(c){
        if(c.indexOf(base)>=0&&base.length>bestScore){bestScore=base.length;bestCode=ls.code;}
      });
    });
  });
  Object.keys(aliasBases).forEach(function(alias){
    const ls=listed.find(function(x){return x.name===aliasBases[alias];});
    if(!ls)return;
    candidates.forEach(function(c){
      if(c.indexOf(alias)>=0&&alias.length>bestScore){bestScore=alias.length;bestCode=ls.code;}
    });
  });
  return bestScore>=3?bestCode:null;
}
function pickRealCompanyName(i,tier,scale,primary,used,rng){
  const catData=REAL_COMPANIES.BY_CATEGORY[primary]||REAL_COMPANIES.BY_CATEGORY['商业服务'];
  let list=[...(catData[tier]||[])];
  if(scale==='large'&&catData.foreign)list=list.concat(catData.foreign);
  if(scale==='medium'&&tier==='mid'&&catData.high)list=list.concat(catData.high.slice(0,8));
  if(!list.length)list=[...(catData.low||[]),...(catData.mid||[]),...(catData.high||[])];
  const base=list[Math.floor(rng()*list.length)]||'中国企业';
  let name=base, attempt=0;
  while(used.has(name)&&attempt<40){
    if(attempt<REAL_COMPANIES.BRANCH_SUFFIXES.length)name=base+REAL_COMPANIES.BRANCH_SUFFIXES[attempt];
    else name=base+REAL_COMPANIES.SUBSIDIARY_SUFFIXES[(attempt-REAL_COMPANIES.BRANCH_SUFFIXES.length)%REAL_COMPANIES.SUBSIDIARY_SUFFIXES.length];
    attempt++;
  }
  if(used.has(name))name=base+'（'+primary.slice(0,2)+'·'+i+'）';
  used.add(name);
  return name;
}

function assignCompanyCategories(scale,primary,cats,rng){
  if(scale==='small')return {primaryCategory:primary,categories:[primary]};
  if(scale==='medium'){
    const list=[primary];
    if(rng()<0.4){
      const o=cats[Math.floor(rng()*cats.length)];
      if(o!==primary)list.push(o);
    }
    return {primaryCategory:primary,categories:list};
  }
  const n=Math.min(cats.length,6+Math.floor(rng()*9));
  const set=new Set([primary]);
  while(set.size<n)set.add(cats[Math.floor(rng()*cats.length)]);
  return {primaryCategory:primary,categories:[...set]};
}

function companyHiresForJob(co,jobIdx,job){
  if(!co.categories.includes(job.category))return false;
  const r=seededRand(hashStr(co.id+'_j'+jobIdx));
  if(co.scale==='small')return co.primaryCategory===job.category;
  if(co.scale==='medium'){
    if(co.primaryCategory===job.category)return true;
    return r()<0.28;
  }
  return r()<0.2+co.categories.length*0.045;
}

function buildJobCompanyPools(allCos,market){
  const pools={};
  market.forEach(job=>{
    const eligible=allCos.filter(co=>companyHiresForJob(co,job.idx,job));
    const pool=[];
    TIER_ORDER.forEach(tier=>{
      const need=TIER_POOL_PER_JOB[tier];
      const tierList=shuffleArr(eligible.filter(c=>c.tier===tier),seededRand(job.idx*791+tier.charCodeAt(0)));
      const local=tierList.filter(c=>c.city===PLAYER_HOME_CITY);
      const remote=tierList.filter(c=>c.city!==PLAYER_HOME_CITY);
      const pickedLocal=local.slice(0,need);
      pool.push(...pickedLocal);
      if(pickedLocal.length<need)pool.push(...remote.slice(0,need-pickedLocal.length));
    });
    if(pool.length<JOB_POOL_SIZE){
      const inPool=new Set(pool.map(c=>c.id));
      const rest=shuffleArr(eligible.filter(c=>!inPool.has(c.id)),seededRand(job.idx*443));
      pool.push(...rest.slice(0,JOB_POOL_SIZE-pool.length));
    }
    pools[job.idx]=pool.slice(0,JOB_POOL_SIZE);
  });
  return pools;
}

function initCompanyUniverse(market){
  const cats=[...new Set(RAW_DATA.map(j=>j.category))];
  const used=new Set();
  const tierSlots=shuffleArr([...Array(GLOBAL_TIER_COUNTS.high).fill('high'),...Array(GLOBAL_TIER_COUNTS.mid).fill('mid'),...Array(GLOBAL_TIER_COUNTS.low).fill('low')],seededRand(42));
  const scaleSlots=shuffleArr([...Array(SCALE_COUNTS.large).fill('large'),...Array(SCALE_COUNTS.medium).fill('medium'),...Array(SCALE_COUNTS.small).fill('small')],seededRand(99));
  const tierRank={high:0,mid:1,low:2}, scaleRank={large:0,medium:1,small:2};
  const tierSorted=tierSlots.map((t,i)=>({i,t,r:tierRank[t]})).sort((a,b)=>a.r-b.r);
  const scaleSorted=scaleSlots.map((s,i)=>({i,s,r:scaleRank[s]})).sort((a,b)=>a.r-b.r);
  const pairedTier=new Array(TOTAL_COMPANIES);
  const pairedScale=new Array(TOTAL_COMPANIES);
  for(let k=0;k<TOTAL_COMPANIES;k++){
    pairedTier[scaleSorted[k].i]=tierSorted[k].t;
    pairedScale[scaleSorted[k].i]=scaleSorted[k].s;
  }
  const all=[];
  const byId={};
  for(let i=0;i<TOTAL_COMPANIES;i++){
    const tier=pairedTier[i], scale=pairedScale[i];
    const r=seededRand(i*131+7);
    const primary=cats[Math.floor(r()*cats.length)];
    const name=pickRealCompanyName(i,tier,scale,primary,used,r);
    const catInfo=assignCompanyCategories(scale,primary,cats,r);
    const headcount=scale==='large'?8000+Math.floor(r()*92000):scale==='medium'?400+Math.floor(r()*4600):8+Math.floor(r()*192);
    let city=parseCityFromCompanyName(name);
    if(!city){
      if(scale==='small'&&tier==='low')city=r()<0.58?PLAYER_HOME_CITY:CITIES[Math.floor(r()*CITIES.length)];
      else if(r()<0.28)city=PLAYER_HOME_CITY;
      else city=CITIES[Math.floor(r()*CITIES.length)];
    }
    const co={id:'co_'+i,name,tier,scale,primaryCategory:catInfo.primaryCategory,categories:catInfo.categories,headcount,city,listedStockCode:resolveListedStockCodeFromCompanyName(name)};
    all.push(co); byId[co.id]=co;
  }
  const jobCompanies=buildJobCompanyPools(all,market);
  const stats={total:all.length,byTier:{},byScale:{},avgPerJob:0};
  TIER_ORDER.forEach(t=>stats.byTier[t]=all.filter(c=>c.tier===t).length);
  SCALE_ORDER.forEach(s=>stats.byScale[s]=all.filter(c=>c.scale===s).length);
  const lens=Object.values(jobCompanies).map(a=>a.length);
  stats.avgPerJob=Math.round(lens.reduce((a,b)=>a+b,0)/lens.length);
  return {all,byId,jobCompanies,stats};
}

function initMarket(raw){
  return raw.map((job,i)=>({
    ...job,idx:i,basePay:job.pay,baseJobs:job.jobs,
    pay:job.pay,prevPay:job.pay,jobs:job.jobs,prevJobs:job.jobs,
    heatPct:100+job.outlook,prevHeatPct:100+job.outlook,
    payHistory:[job.pay],jobsHistory:[job.jobs]
  }));
}
function fmtJobsCount(n){
  if(n>=100000000)return(n/100000000).toFixed(1).replace(/\.0$/,'')+'亿人';
  if(n>=10000)return Math.round(n/10000).toLocaleString()+'万人';
  return n.toLocaleString()+'人';
}
function escAttr(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
function bindRefCatJumpClicks(){
  const body=document.getElementById('refPanelBody');
  if(!body||body._catJumpBound)return;
  body._catJumpBound=1;
  body.addEventListener('click',function(e){
    const btn=e.target.closest('[data-ref-cat-jump]');
    if(!btn)return;
    e.preventDefault();
    e.stopPropagation();
    focusRefCategory(btn.getAttribute('data-ref-cat-jump'));
  });
}
function aiExposureColor(exp){
  const t=Math.max(0,Math.min(10,exp))/10;
  const r=Math.round(63+185*t),g=Math.round(185-115*t),b=Math.round(80-35*t);
  return 'rgba('+r+','+g+','+b+',0.5)';
}
function exposureColorRGB(score){
  const t=Math.max(0,Math.min(10,score))/10;
  let r,g,b;
  if(t<0.5){const s=t/0.5;r=Math.round(50+s*180);g=Math.round(160-s*10);b=Math.round(50-s*20)}
  else{const s=(t-0.5)/0.5;r=Math.round(230+s*25);g=Math.round(150-s*110);b=Math.round(30-s*10)}
  return [r,g,b];
}
function exposureColorCSS(score,a){const c=exposureColorRGB(score);return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'}
function fmtStatBigJobs(n){
  if(n>=100000000)return(n/100000000).toFixed(1).replace(/\.0$/,'')+'亿人';
  if(n>=10000)return Math.round(n/10000).toLocaleString()+'万人';
  return n.toLocaleString()+'人';
}
function fmtStatWages(n){
  if(n>=1000000000000)return(n/1000000000000).toFixed(1).replace(/\.0$/,'')+'万亿元';
  if(n>=100000000)return(n/100000000).toFixed(1)+'亿元';
  return '¥'+n.toLocaleString();
}
const REF_PAY_BANDS=[{label:'<3.5万',min:0,max:35000},{label:'3.5–5万',min:35000,max:50000},{label:'5–7.5万',min:50000,max:75000},{label:'7.5–10万',min:75000,max:100000},{label:'10万+',min:100000,max:Infinity}];
const REF_EDU_GROUPS=[{label:'初中及以下',match:['初中及以下']},{label:'高中',match:['高中']},{label:'中专',match:['中专','高中/中专']},{label:'大专',match:['大专']},{label:'本科',match:['本科']},{label:'硕士及以上',match:['硕士','博士']}];
const REF_EXP_TIERS=[{name:'极低',range:[0,1]},{name:'较低',range:[2,3]},{name:'中等',range:[4,5]},{name:'较高',range:[6,7]},{name:'极高',range:[8,10]}];
function computeNationalStats(jobs){
  const totalJobs=jobs.reduce((s,d)=>s+(d.jobs||0),0);
  let wSum=0,wCnt=0,wagesExposed=0;
  const histogram=new Array(11).fill(0);
  const tiers=REF_EXP_TIERS.map(t=>({...t,jobs:0,pct:0}));
  const byCat={};
  jobs.forEach(d=>{
    const j=d.jobs||0;
    if(d.exposure!=null&&j){
      wSum+=d.exposure*j;wCnt+=j;
      histogram[d.exposure]+=j;
      tiers.forEach(t=>{if(d.exposure>=t.range[0]&&d.exposure<=t.range[1])t.jobs+=j});
      if(d.exposure>=7&&d.pay)wagesExposed+=j*d.pay;
    }
    const cat=d.category;
    if(!byCat[cat])byCat[cat]={jobs:0,payW:0,expW:0};
    byCat[cat].jobs+=j;byCat[cat].payW+=(d.pay||0)*j;byCat[cat].expW+=(d.exposure||0)*j;
  });
  tiers.forEach(t=>{t.pct=totalJobs>0?t.jobs/totalJobs*100:0});
  const categories=Object.keys(byCat).map(cat=>{
    const b=byCat[cat];
    return {cat,jobs:b.jobs,pct:totalJobs>0?b.jobs/totalJobs*100:0,
      avgPay:b.jobs>0?Math.round(b.payW/b.jobs):0,
      avgExp:b.jobs>0?b.expW/b.jobs:0};
  }).sort((a,b)=>b.jobs-a.jobs);
  const payBands=REF_PAY_BANDS.map(band=>{
    let s=0,c=0;
    jobs.forEach(d=>{if(d.exposure!=null&&d.jobs&&d.pay!=null&&d.pay>=band.min&&d.pay<band.max){s+=d.exposure*d.jobs;c+=d.jobs}});
    return {...band,avg:c>0?s/c:0};
  });
  const eduBands=REF_EDU_GROUPS.map(grp=>{
    let s=0,c=0;
    jobs.forEach(d=>{if(d.exposure!=null&&d.jobs&&grp.match.includes(d.education)){s+=d.exposure*d.jobs;c+=d.jobs}});
    return {...grp,avg:c>0?s/c:0};
  });
  return {totalJobs,weightedAvg:wCnt>0?wSum/wCnt:0,histogram,tiers,wagesExposed,categories,payBands,eduBands};
}
function drawRefGradientLegend(){
  const c=document.getElementById('refGradientLegend');
  if(!c)return;
  const g=c.getContext('2d');
  for(let x=0;x<72;x++){const score=x/71*10;g.fillStyle=exposureColorCSS(score,1);g.fillRect(x,0,1,7)}
}
function renderRefNational(jobs){
  const el=document.getElementById('refNational');
  if(!el)return;
  const s=computeNationalStats(jobs);
  const maxH=Math.max(...s.histogram,1);
  const histBars=s.histogram.map((cnt,i)=>'<div class="bar" style="height:'+(cnt/maxH*100).toFixed(1)+'%;background:'+exposureColorCSS(i,.85)+'" title="'+i+'分: '+fmtJobsShort(cnt)+'人"></div>').join('');
  const tierRows=s.tiers.map(t=>'<div class="tier-row"><span class="tier-color" style="background:'+exposureColorCSS((t.range[0]+t.range[1])/2,1)+'"></span><span class="tier-name">'+t.name+' ('+t.range[0]+'–'+t.range[1]+')</span><span class="tier-jobs">'+fmtStatBigJobs(t.jobs)+'</span><span class="tier-pct">'+t.pct.toFixed(0)+'%</span></div>').join('');
  const catRows=s.categories.map(c=>'<div class="tier-row"><span class="tier-color" style="background:'+exposureColorCSS(c.avgExp,1)+'"></span><span class="tier-name" title="'+c.cat+'">'+c.cat+'</span><span class="tier-jobs">'+fmtStatBigJobs(c.jobs)+'</span><span class="tier-pct">'+c.pct.toFixed(0)+'%</span></div>').join('');
  const payRows=s.payBands.map(b=>'<div class="hbar-row"><span class="hbar-label">'+b.label+'</span><div class="hbar-track"><div class="hbar-fill" style="width:'+(b.avg/10*100).toFixed(0)+'%;background:'+exposureColorCSS(b.avg,1)+'"></div></div><span class="hbar-val">'+b.avg.toFixed(1)+'</span></div>').join('');
  const eduRows=s.eduBands.map(b=>'<div class="hbar-row"><span class="hbar-label">'+b.label+'</span><div class="hbar-track"><div class="hbar-fill" style="width:'+(b.avg/10*100).toFixed(0)+'%;background:'+exposureColorCSS(b.avg,1)+'"></div></div><span class="hbar-val">'+b.avg.toFixed(1)+'</span></div>').join('');
  el.innerHTML=
    '<div class="stat-section"><h3>全国就业人数</h3><div class="stat-big">'+fmtStatBigJobs(s.totalJobs)+'</div><div class="stat-note">'+jobs.length+'个职业合计'+(game?' · 本周浮动':'')+'</div></div>'+
    '<div class="stat-section"><h3>加权平均 AI 影响</h3><div class="stat-big">'+s.weightedAvg.toFixed(1)+'<span style="font-size:.85rem;color:var(--muted)">/10</span></div><div class="stat-note">按就业人数加权</div></div>'+
    '<div class="stat-section"><h3>就业人数 · AI 分布</h3><div class="histogram">'+histBars+'</div><div class="hist-labels"><span>0</span><span>5</span><span>10</span></div></div>'+
    '<div class="stat-section"><h3>风险分层</h3><div class="tier-bar">'+tierRows+'</div></div>'+
    '<div class="stat-section"><h3>行业分布</h3><div class="tier-bar">'+catRows+'</div></div>'+
    '<div class="stat-section"><h3>收入档位 · AI 影响</h3><div class="hbar-chart">'+payRows+'</div></div>'+
    '<div class="stat-section"><h3>学历 · AI 影响</h3><div class="hbar-chart">'+eduRows+'</div></div>'+
    '<div class="stat-section"><h3>高收入暴露薪资</h3><div class="stat-big">'+fmtStatWages(s.wagesExposed)+'</div><div class="stat-note">AI≥7 职业的年薪总额（中位数×人数）</div></div>'+
    '<div class="stat-section"><div class="gradient-legend"><canvas id="refGradientLegend" width="72" height="7"></canvas><span>低</span><span>高</span></div></div>';
  drawRefGradientLegend();
}
function nationalJobTotal(jobs){
  return(jobs||[]).reduce((s,d)=>s+(d.jobs||0),0);
}
function buildRefCategoryStatsHtml(cat,s,jobCount,opts){
  opts=opts||{};
  const compact=!!opts.compact;
  const all=marketForRef();
  const natTotal=nationalJobTotal(all);
  const share=natTotal>0?s.totalJobs/natTotal*100:0;
  if(compact){
    return '<div class="ref-cat-summary">'+
      '<h4 style="margin:0 0 6px;font-size:.76rem;color:var(--muted)">所属行业</h4>'+
      '<div style="font-weight:600;margin-bottom:6px">'+cat+'</div>'+
      '<div class="ref-row"><label>就业人数</label><span>'+fmtStatBigJobs(s.totalJobs)+' · 占全国 '+share.toFixed(1)+'%</span></div>'+
      '<div class="ref-row"><label>本行业职业</label><span>'+jobCount+' 个</span></div>'+
      '<div class="ref-row"><label>平均 AI</label><span style="color:'+exposureColorCSS(s.weightedAvg,1)+'">'+s.weightedAvg.toFixed(1)+'/10</span></div>'+
      '<button type="button" class="ref-cat-jump-btn" data-ref-cat-jump="'+escAttr(cat)+'">查看行业详情</button>'+
      '</div>';
  }
  const maxH=Math.max(...s.histogram,1);
  const histBars=s.histogram.map((cnt,i)=>'<div class="bar" style="height:'+(cnt/maxH*100).toFixed(1)+'%;background:'+exposureColorCSS(i,.85)+'" title="'+i+'分: '+fmtJobsShort(cnt)+'人"></div>').join('');
  const tierRows=s.tiers.map(t=>'<div class="tier-row"><span class="tier-color" style="background:'+exposureColorCSS((t.range[0]+t.range[1])/2,1)+'"></span><span class="tier-name">'+t.name+' ('+t.range[0]+'–'+t.range[1]+')</span><span class="tier-jobs">'+fmtStatBigJobs(t.jobs)+'</span><span class="tier-pct">'+t.pct.toFixed(0)+'%</span></div>').join('');
  const payRows=s.payBands.map(b=>'<div class="hbar-row"><span class="hbar-label">'+b.label+'</span><div class="hbar-track"><div class="hbar-fill" style="width:'+(b.avg/10*100).toFixed(0)+'%;background:'+exposureColorCSS(b.avg,1)+'"></div></div><span class="hbar-val">'+b.avg.toFixed(1)+'</span></div>').join('');
  const eduRows=s.eduBands.map(b=>'<div class="hbar-row"><span class="hbar-label">'+b.label+'</span><div class="hbar-track"><div class="hbar-fill" style="width:'+(b.avg/10*100).toFixed(0)+'%;background:'+exposureColorCSS(b.avg,1)+'"></div></div><span class="hbar-val">'+b.avg.toFixed(1)+'</span></div>').join('');
  let pickHtml='';
  if(applyCategoryPicks.size>1){
    pickHtml='<div class="ref-industry-pick">'+[...applyCategoryPicks].map(c=>'<button type="button" class="cat-btn'+(c===cat?' active':'')+'" data-ref-cat-jump="'+escAttr(c)+'">'+c+'</button>').join('')+'</div>';
  }
  return pickHtml+
    '<div class="stat-section"><h3>行业就业人数</h3><div class="stat-big">'+fmtStatBigJobs(s.totalJobs)+'</div><div class="stat-note">'+jobCount+' 个职业 · 占全国 '+share.toFixed(1)+'%'+(game?' · 本周浮动':'')+'</div></div>'+
    '<div class="stat-section"><h3>加权平均 AI 影响</h3><div class="stat-big">'+s.weightedAvg.toFixed(1)+'<span style="font-size:.85rem;color:var(--muted)">/10</span></div></div>'+
    '<div class="stat-section"><h3>就业人数 · AI 分布</h3><div class="histogram">'+histBars+'</div><div class="hist-labels"><span>0</span><span>5</span><span>10</span></div></div>'+
    '<div class="stat-section"><h3>风险分层</h3><div class="tier-bar">'+tierRows+'</div></div>'+
    '<div class="stat-section"><h3>收入档位 · AI 影响</h3><div class="hbar-chart">'+payRows+'</div></div>'+
    '<div class="stat-section"><h3>学历 · AI 影响</h3><div class="hbar-chart">'+eduRows+'</div></div>'+
    '<div class="stat-section"><h3>高收入暴露薪资</h3><div class="stat-big">'+fmtStatWages(s.wagesExposed)+'</div><div class="stat-note">本行业 AI≥7 职业年薪总额</div></div>';
}
function renderRefIndustry(cat){
  const el=document.getElementById('refIndustry');
  if(!el)return;
  if(!cat){el.innerHTML='<p class="fold-meta">请在中栏「筛选行业」添加行业，或先选择职业</p>';return}
  const jobs=marketForRef().filter(j=>j.category===cat);
  if(!jobs.length){el.innerHTML='<p class="fold-meta">暂无「'+cat+'」数据</p>';return}
  el.innerHTML=buildRefCategoryStatsHtml(cat,computeNationalStats(jobs),jobs.length,{compact:false});
}
function payMultForOffer(tier,importance,seed){
  const r=seededRand(seed)();
  const rng=PAY_MULT_RANGES[tier][importance];
  return rng[0]+(rng[1]-rng[0])*r;
}

function stockSeedForSlot(slot){return 2024+(slot||0)*10007}
function listedStockRefPrice(symbol){
  const listed=(typeof REAL_COMPANIES!=='undefined'&&REAL_COMPANIES.LISTED_STOCKS)||[];
  const row=listed.find(function(x){return x.code===symbol});
  return row?row.price:null;
}
function repairStockRefPrices(stocks){
  if(!Array.isArray(stocks))return;
  stocks.forEach(function(s){
    if(!s||s.price==null)return;
    const orig=listedStockRefPrice(s.symbol);
    if(s.refPrice==null||s.refPrice<=0){
      s.refPrice=orig!=null?orig:s.price;
      return;
    }
    if(orig&&orig>s.refPrice*1.12&&s.price<=s.refPrice*1.03){
      s.refPrice=orig;
    }
  });
}
function initStocks(seed){
  const listed=REAL_COMPANIES.LISTED_STOCKS||[];
  const pick=shuffleArr([...listed],seededRand(seed||2024)).slice(0,Math.min(24,listed.length));
  return pick.map(s=>{
    const ref=s.price, hist=[];
    let p=ref;
    for(let i=0;i<40;i++){
      p=Math.max(ref*.88,Math.min(ref*1.12,p*(1+(Math.random()-.5)*.028)));
      hist.push(p);
    }
    return {
      symbol:s.code,id:'stk_'+s.code,name:s.name,category:s.category,
      price:p,prevPrice:hist[hist.length-2]||p,refPrice:ref,history:hist,
      totalShares:null,floatShares:null,floatPct:null
    };
  }).map(function(st){return typeof ensureStockFloat==='function'?ensureStockFloat(st):st});
}

function initCategoryTrends(){const t={};[...new Set(RAW_DATA.map(j=>j.category))].forEach(c=>t[c]=[]);return t}

function loadAllSlots(){
  try{
    const raw=JSON.parse(localStorage.getItem(LS_SLOTS)||'[]');
    const slots=[null,null,null];
    for(let i=0;i<SAVE_SLOT_COUNT;i++)slots[i]=raw[i]||null;
    return slots;
  }catch(e){return [null,null,null]}
}
function compactGameForSave(g){
  if(!g)return g;
  if(Array.isArray(g.log)&&g.log.length>40)g.log=g.log.slice(0,40);
  if(Array.isArray(g.monthLedgerHistory)&&g.monthLedgerHistory.length>24)g.monthLedgerHistory=g.monthLedgerHistory.slice(0,24);
  if(Array.isArray(g.stocks))g.stocks.forEach(s=>{
    if(Array.isArray(s.history)&&s.history.length>24)s.history=s.history.slice(-24);
  });
  if(g.casinoHistory)delete g.casinoHistory;
  if(g.companion&&Array.isArray(g.companion.applications)&&g.companion.applications.length>36)
    g.companion.applications=g.companion.applications.slice(0,36);
  if(Array.isArray(g.applications)&&g.applications.length>48)g.applications=g.applications.slice(0,48);
  if(Array.isArray(g.inbox)&&g.inbox.length>60)g.inbox=g.inbox.slice(0,60);
  if(Array.isArray(g.giftWishHistory)&&g.giftWishHistory.length>80){
    g.giftWishHistory=typeof compactGiftWishHistoryForSave==='function'?compactGiftWishHistoryForSave(g.giftWishHistory,80):g.giftWishHistory.slice(-80);
  }
  if(Array.isArray(g.archivedPartnerWishLists)){
    g.archivedPartnerWishLists.forEach(function(a){
      if(Array.isArray(a.wishes)&&a.wishes.length>80)
        a.wishes=typeof compactGiftWishHistoryForSave==='function'?compactGiftWishHistoryForSave(a.wishes,80):a.wishes.slice(-80);
    });
    if(g.archivedPartnerWishLists.length>8)g.archivedPartnerWishLists=g.archivedPartnerWishLists.slice(-8);
  }
  return g;
}
function backupSlotsBeforeWrite(){
  try{
    const cur=localStorage.getItem(LS_SLOTS);
    if(!cur)return;
    let hist=[];
    try{hist=JSON.parse(localStorage.getItem(LS_SLOTS_BACKUP)||'[]')}catch(e){hist=[]}
    hist.unshift({at:new Date().toISOString(),slots:JSON.parse(cur)});
    if(hist.length>12)hist=hist.slice(0,12);
    localStorage.setItem(LS_SLOTS_BACKUP,JSON.stringify(hist));
  }catch(e){console.warn('backupSlots',e)}
}
function writeAllSlots(slots,opts){
  opts=opts||{};
  const slice=slots.slice(0,SAVE_SLOT_COUNT);
  try{
    if(!opts.skipBackup)backupSlotsBeforeWrite();
    localStorage.setItem(LS_SLOTS,JSON.stringify(slice));
    return true;
  }catch(e){
    const quota=e&&(e.name==='QuotaExceededError'||String(e).includes('quota'));
    if(quota&&!opts.compacted){
      const compact=slice.map(rec=>{
        if(!rec||!rec.game)return rec;
        return{...rec,game:compactGameForSave(JSON.parse(JSON.stringify(rec.game)))};
      });
      return writeAllSlots(compact,{compacted:true});
    }
    console.warn('writeAllSlots',e);
    return false;
  }
}
function stripCoInOffer(offer){
  if(!offer)return offer;
  const o={...offer};
  if(o.company&&o.company.id){
    const sid=String(o.company.id);
    if(o.scamBait||sid.indexOf('scam_')===0){
      /* 诈骗/合成企业不在 corp 库，保留完整 company 避免读档后 pipeline 崩溃 */
    }else{
      o.companyId=o.company.id;delete o.company;
    }
  }
  return o;
}
function offerCompanyName(offer){
  if(!offer)return '企业';
  if(offer.company&&offer.company.name)return offer.company.name;
  if(offer.companyId)return String(offer.companyId);
  return '企业';
}
function relinkOffer(offer,byId){
  if(!offer)return offer;
  const o={...offer};
  if(o.companyId&&byId[o.companyId]){o.company=byId[o.companyId];delete o.companyId}
  return o;
}
function serializeGameState(){
  if(typeof _companionActor!=='undefined'&&_companionActor){
    console.warn('serializeGameState: blocked during companion actor swap');
    return null;
  }
  const g={...game};
  delete g.companyAll;delete g.companyById;delete g.jobCompanies;delete g.companyStats;
  delete g._severanceCtx;
  if(g.employment){
    g.employment={...g.employment};
    if(g.employment.company){g.employment.companyId=g.employment.company.id;delete g.employment.company}
  }
  g.inbox=(g.inbox||[]).map(it=>({...it,offer:stripCoInOffer(it.offer)}));
  g.offers=(g.offers||[]).map(o=>({...o,offer:stripCoInOffer(o.offer)}));
  g.applications=(g.applications||[]).map(a=>({...a,offer:stripCoInOffer(a.offer)}));
  if(g.pendingHire)g.pendingHire={...g.pendingHire,offer:stripCoInOffer(g.pendingHire.offer)};
  if(g.referralOpportunity&&g.referralOpportunity.positions){
    g.referralOpportunity={...g.referralOpportunity,positions:g.referralOpportunity.positions.map(p=>({...p,offer:stripCoInOffer(p.offer)}))};
  }
  if(g.monthLedger&&g.monthLedger._closing)delete g.monthLedger._closing;
  g.log=(g.log||[]).slice(0,40);
  g.companion=serializeCompanionActor(g.companion);
  return compactGameForSave(g);
}
function serializeUiState(){
  return{actionDone,selectedIdx,selectedJobIdxs:[...selectedJobIdxs],applyCategoryPicks:[...applyCategoryPicks],
    currentSort,currentCategory,currentTab,calendarView,calendarYear,calendarMonth,refPanelCollapsed,refPanelView,refPanelCategory,industryFilterCollapsed,portfolioFoldCollapsed,interviewSortMode,
    inboxFold:{...inboxFoldOpen},financeFoldOpen,phonePanelOpen:!!(game&&game.phonePanelOpen),carPanelOpen:!!(game&&game.carPanelOpen),plannedFoldOpen,plannedExpanded:[...plannedExpandedCompanies]};
}
const SLOT_LABEL_MAX=20;
function normalizeSlotLabel(s){
  if(s==null)return '';
  return String(s).trim().slice(0,SLOT_LABEL_MAX);
}
function slotArchiveTitle(m){
  if(!m)return '未命名';
  return normalizeSlotLabel(m.slotLabel)||m.playerName||'未命名';
}
function slotCharSubtitle(m){
  if(!m||!m.playerName)return '';
  const label=normalizeSlotLabel(m.slotLabel);
  if(label&&label!==m.playerName)return m.playerName;
  return '';
}
function setSlotLabel(slot,label){
  const slots=loadAllSlots();
  const rec=slots[slot];
  if(!rec)return false;
  if(!rec.meta)rec.meta={};
  const n=normalizeSlotLabel(label);
  if(n)rec.meta.slotLabel=n;
  else delete rec.meta.slotLabel;
  slots[slot]=rec;
  return writeAllSlots(slots);
}
function renameSlotUi(slot){
  const slots=loadAllSlots();
  const rec=slots[slot];
  if(!rec||!rec.meta){alert('该档位无存档');return}
  const cur=rec.meta.slotLabel||'';
  const next=prompt('为档位 '+(slot+1)+' 设置档案名（留空则仅显示角色名）：',cur);
  if(next===null)return;
  if(!setSlotLabel(slot,next)){alert('保存档案名失败');return}
  renderSlotGrid();
}
function buildSlotMetaFromGame(g){
  if(!g)return null;
  const job=g.employed&&g.employment&&g.market?g.market[g.employment.jobIdx]:null;
  let endingTitle='';
  if(g.gameOver){
    if(g.endingType==='overwork')endingTitle='通宵后的清晨';
    else if(g.endingType==='lifespan')endingTitle='命数已尽';
    else if(g.homeless)endingTitle='桥洞底的寒夜';
    else if(g.disabled&&!g.ownsHome&&!g.homeless)endingTitle='出租屋里的沉默';
    else if(g.mortgagePaidOff&&g.ownsHome&&g.married&&!g.divorced)endingTitle='通关 · 安度晚年';
    else endingTitle='已终局';
  }
  return{
    playerName:g.playerName,week:g.week,year:getYear(g.week),age:START_AGE+Math.floor((g.week||0)/52),
    cash:g.cash,money:g.money,gameOver:!!g.gameOver,endingTitle,
    education:g.playerEducation,school:schoolLabelFor(g.playerSchool),
    jobTitle:job?job.title:'待业',employed:!!g.employed,
    mortgage:g.mortgagePaidOff?'已还清':(g.mortgagePaymentsMade||0)+'/'+MORTGAGE_MONTHS
  };
}
function buildSlotMeta(){
  return buildSlotMetaFromGame(game);
}
function isRecoverableFalseEnd(g){
  if(!g||!g.gameOver)return false;
  if((g.week||0)>=TOTAL_WEEKS)return false;
  if(g.endingType==='overwork')return false;
  if(g.endingType==='lifespan')return false;
  if(g.endingType==='bridge'||(g.homeless&&(g.homelessMonths||0)>=24))return false;
  if(g.endingType==='corpse'||(g.disabled&&!g.ownsHome&&!g.homeless))return false;
  if(g.endingType==='victory'||g.endingType==='victory_early')return true;
  if(g.gameWon&&g.mortgagePaidOff&&g.ownsHome&&g.married&&!g.divorced&&!g.homeless)return true;
  return false;
}
function reviveFalseEndGameRecord(g){
  if(!isRecoverableFalseEnd(g))return false;
  g.gameOver=false;
  g.endingType=null;
  if(g.mortgagePaidOff)g.mortgageGoalReached=true;
  if(g.companion)g.companion.gameOver=false;
  return true;
}
function refreshSlotMeta(rec){
  if(!rec||!rec.game)return;
  const prevLabel=rec.meta&&rec.meta.slotLabel;
  const m=buildSlotMetaFromGame(rec.game);
  if(m){
    rec.meta={...rec.meta,...m,savedAt:rec.savedAt||(rec.meta&&rec.meta.savedAt)};
    if(prevLabel)rec.meta.slotLabel=prevLabel;
  }
}
function reviveSlotFromFalseEnd(slot){
  const slots=loadAllSlots();
  const rec=slots[slot];
  if(!rec||!rec.game)return {ok:false,msg:'档位 '+(slot+1)+' 无存档'};
  if(!isRecoverableFalseEnd(rec.game)){
    if(!rec.game.gameOver)return {ok:false,msg:'档位 '+(slot+1)+' 并未终局，无需恢复'};
    return {ok:false,msg:'档位 '+(slot+1)+' 是真实结局（猝死/流浪等）或已满30年，无法用此功能恢复'};
  }
  reviveFalseEndGameRecord(rec.game);
  repairGameRecord(rec.game,slot);
  refreshSlotMeta(rec);
  rec.savedAt=new Date().toLocaleString('zh-CN',{hour12:false});
  slots[slot]=rec;
  if(!writeAllSlots(slots))return {ok:false,msg:'写入 localStorage 失败，请清理浏览器空间后重试'};
  return {ok:true,msg:'档位 '+(slot+1)+' 已恢复（第'+(rec.game.week+1)+'周）· 请点「续档」'};
}
function buildSlotRecord(opts){
  opts=opts||{};
  try{
    const meta=buildSlotMeta();
    if(opts.slotLabel!=null&&opts.slotLabel!=='')meta.slotLabel=normalizeSlotLabel(opts.slotLabel);
    else if(currentSlotIndex>=0){
      const prev=loadAllSlots()[currentSlotIndex];
      if(prev&&prev.meta&&prev.meta.slotLabel)meta.slotLabel=prev.meta.slotLabel;
    }
    return{
      v:1,savedAt:new Date().toLocaleString('zh-CN',{hour12:false}),
      stockSeed:game.stockSeed||stockSeedForSlot(currentSlotIndex),
      meta,game:serializeGameState(),ui:serializeUiState()
    };
  }catch(e){
    console.error('serialize',e);
    return null;
  }
}
function autoSaveSlot(opts){
  if(currentSlotIndex<0||!game)return;
  if(typeof _companionActor!=='undefined'&&_companionActor)return;
  try{
    const rec=buildSlotRecord(opts);
    if(!rec)return;
    const slots=loadAllSlots();
    slots[currentSlotIndex]=rec;
    if(!writeAllSlots(slots)&&game&&!game._saveWarned){
      game._saveWarned=true;
      addLog('⚠ 自动存档失败：浏览器 localStorage 已满。请删其他档位或清理站点数据','warn');
    }
  }catch(e){
    console.warn('autosave',e);
    if(game&&!game._saveWarned){game._saveWarned=true;addLog('⚠ 自动存档失败，浏览器存储可能已满','warn')}
  }
}
function restoreGameState(g,corp){
  game=g;
  if(typeof normalizePlayerStress==='function')normalizePlayerStress();
  game.companyAll=corp.all;game.companyById=corp.byId;game.jobCompanies=corp.jobCompanies;game.companyStats=corp.stats;
  if(game.employment&&game.employment.companyId){
    const empCo=corp.byId[game.employment.companyId];
    if(empCo){
      game.employment.company=empCo;
      delete game.employment.companyId;
    }
  }
  if(typeof ensureEmploymentCompanyLinked==='function')ensureEmploymentCompanyLinked();
  game.inbox=(game.inbox||[]).map(it=>({...it,offer:relinkOffer(it.offer,corp.byId)}));
  game.offers=(game.offers||[]).map(o=>({...o,offer:relinkOffer(o.offer,corp.byId)}));
  game.applications=(game.applications||[]).map(a=>({...a,offer:relinkOffer(a.offer,corp.byId)}));
  if(game.pendingHire&&game.pendingHire.offer)game.pendingHire={...game.pendingHire,offer:relinkOffer(game.pendingHire.offer,corp.byId)};
  if(game.referralOpportunity&&game.referralOpportunity.positions){
    game.referralOpportunity.positions=game.referralOpportunity.positions.map(p=>({...p,offer:relinkOffer(p.offer,corp.byId)}));
  }
  if(typeof migrateScamOfferCompanies==='function')migrateScamOfferCompanies();
  delete game._severanceCtx;
  if(!game.inboxReadIds)game.inboxReadIds=[];
  if(game.monthLedger)delete game.monthLedger._closing;
  casinoRolling=false;pendingBatch=null;consumeModalOpen=false;
  if(typeof resetAutoLifeState==='function')resetAutoLifeState();
  else if(typeof autoLifeRunning!=='undefined')autoLifeRunning=false;
  stopMarketTimer();
  if(game.marketActive){game.marketActive=false;game.marketBooths=[]}
  const mo=document.getElementById('marketOverlay');if(mo)mo.classList.add('hidden');
  const co=document.getElementById('consumeOverlay');if(co)co.classList.add('hidden');
  if(game.casinoActive){
    game.casinoActive=false;game.spectateRunning=false;game.spectatePhase='idle';
    game.chipHand=emptyChipMap();game.tableBets=emptyTableBets();game.rouletteBets=emptyRouletteBets();
  }
  game.companion=restoreCompanionActor(game.companion,corp.byId);
  if(!game.companion)game.companion=createCompanionState(game.playerEducation,game.playerSchool);
}
function restoreUiState(ui){
  actionDone=!!(ui&&ui.actionDone);selectedIdx=ui&&ui.selectedIdx!=null?ui.selectedIdx:-1;
  selectedJobIdxs=new Set((ui&&ui.selectedJobIdxs)||[]);
  applyCategoryPicks=new Set((ui&&ui.applyCategoryPicks)||[]);
  currentSort=(ui&&ui.currentSort)||'heat';currentCategory=(ui&&ui.currentCategory)||'全部';
  currentTab=(ui&&ui.currentTab)||'daily';
  calendarView=(ui&&ui.calendarView)||'month';
  if(ui&&ui.calendarYear!=null){calendarYear=ui.calendarYear;calendarMonth=ui.calendarMonth||0}
  else syncCalendarMonthToGame();
  refPanelCollapsed=!!(ui&&ui.refPanelCollapsed);
  refPanelView=(ui&&ui.refPanelView)||'national';
  refPanelCategory=(ui&&ui.refPanelCategory)||null;
  if(refPanelView==='job'&&selectedIdx<0)refPanelView='national';
  if(refPanelView==='category'&&!refPanelCategory)refPanelView='national';
  industryFilterCollapsed=!!(ui&&ui.industryFilterCollapsed);
  portfolioFoldCollapsed=!!(ui&&ui.portfolioFoldCollapsed);
  industryPickerOpen=false;
  interviewSortMode=(ui&&ui.interviewSortMode)||'time';
  if(ui&&ui.inboxFold)inboxFoldOpen={pending:true,replied:true,confirmed:true,attended:true,missed:true,expired:false,ghost:false,rejected:false,...ui.inboxFold};
  else inboxFoldOpen={pending:true,replied:true,confirmed:true,attended:true,missed:true,expired:false,ghost:false,rejected:false};
  financeFoldOpen=!!(ui&&ui.financeFoldOpen);
  if(ui&&ui.phonePanelOpen!=null&&game)game.phonePanelOpen=!!ui.phonePanelOpen;
  if(ui&&ui.carPanelOpen!=null&&game)game.carPanelOpen=!!ui.carPanelOpen;
  plannedFoldOpen=!!(ui&&ui.plannedFoldOpen);
  plannedExpandedCompanies=new Set((ui&&ui.plannedExpanded)||[]);
  applyRefPanelCollapse();
  applyPortfolioFoldCollapse();
  showTab(currentTab);
}
function toggleRefPanel(){
  refPanelCollapsed=!refPanelCollapsed;
  applyRefPanelCollapse();
}
function applyRefPanelCollapse(){
  const panel=document.getElementById('refPanel');
  const main=document.querySelector('main');
  const btn=document.getElementById('btnRefCollapse');
  if(panel)panel.classList.toggle('collapsed',refPanelCollapsed);
  if(main)main.classList.toggle('ref-collapsed',refPanelCollapsed);
  if(btn){
    btn.textContent=refPanelCollapsed?'▶':'◀';
    btn.title=refPanelCollapsed?'展开就业市场':'折叠就业市场';
  }
}
function stripSlotLabelName(label){
  if(label==null)return '';
  let t=String(label).trim();
  while(/\s*·\s*分岔\d*$/.test(t))t=t.replace(/\s*·\s*分岔\d*$/,'').trim();
  return t;
}
function companionDefaultName(){
  return typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'小艾';
}
function isCompanionDefaultPlayerName(name){
  const n=String(name||'').trim();
  return n===companionDefaultName()||n==='小艾';
}
function isThematicSlotLabel(s){
  if(!s)return true;
  const t=String(s).trim();
  if(/分岔/.test(t))return true;
  return /^(出轨|离婚|暴富|破产|测试|重生|开挂|逆袭|豪门|修罗|纯爱|刀|He|BE|档|槽)$/.test(t);
}
function sumStockCostBasisShares(basis){
  if(!basis||typeof basis!=='object')return 0;
  let n=0;
  Object.keys(basis).forEach(function(sym){n+=(basis[sym]&&basis[sym].shares)||0});
  return n;
}
function sumPortfolioShares(port){
  if(!port||typeof port!=='object')return 0;
  let n=0;
  Object.keys(port).forEach(function(sym){n+=port[sym]||0});
  return n;
}
function sumMonthLedgerIncome(g){
  let total=0;
  (g.monthLedgerHistory||[]).forEach(function(stmt){total+=stmt&&stmt.incomeTotal||0});
  return total;
}
function looksLikeActorSwapCorruption(g,meta){
  if(!g)return false;
  if(!isCompanionDefaultPlayerName(g.playerName))return false;
  const week=g.week||0;
  if(week<4)return false;
  const basisShares=sumStockCostBasisShares(g.artifactStats&&g.artifactStats.stockCostBasis);
  const portShares=sumPortfolioShares(g.portfolio);
  const hasChild=(g.children||[]).some(function(ch){return ch&&(ch.monthsLeft>0||ch.name)});
  const hasCompany=!!(g.playerCompany&&g.playerCompany.founded);
  const hasHome=!!(g.ownsHome||g.villaOwned);
  const ledgerIncome=sumMonthLedgerIncome(g);
  const hasPartner=g.partnerDisplayName&&!isCompanionDefaultPlayerName(g.partnerDisplayName);
  const portfolioGutted=basisShares>=10&&portShares<basisShares*0.5;
  if(hasChild||hasCompany||hasHome||portfolioGutted||ledgerIncome>40000||hasPartner)return true;
  return week>=12;
}
function restorePortfolioFromCostBasis(g){
  const basis=g.artifactStats&&g.artifactStats.stockCostBasis;
  if(!basis||typeof basis!=='object')return false;
  g.portfolio=g.portfolio||{};
  let restored=false;
  Object.keys(basis).forEach(function(sym){
    const sh=(basis[sym]&&basis[sym].shares)||0;
    if(sh<=0)return;
    const cur=g.portfolio[sym]||0;
    if(cur<sh){g.portfolio[sym]=sh;restored=true}
  });
  return restored;
}
function portfolioMarketValueFromGame(g){
  if(!g||!g.stocks)return 0;
  let total=0;
  Object.keys(g.portfolio||{}).forEach(function(sym){
    const n=g.portfolio[sym]||0;
    if(n<=0)return;
    const st=g.stocks.find(function(x){return x.symbol===sym});
    if(st)total+=st.price*n;
  });
  return total;
}
function restoreCashIfCompanionPocket(g){
  if(!g)return false;
  const cur=g.cash||0;
  const portVal=portfolioMarketValueFromGame(g);
  const ledgerIncome=sumMonthLedgerIncome(g);
  let floor=portVal;
  if(g.ownsHome)floor+=g.mortgagePaidOff?800000:120000;
  if(g.playerCompany&&g.playerCompany.founded)floor+=300000;
  if(ledgerIncome>80000)floor=Math.max(floor,Math.round(ledgerIncome*0.25));
  if(floor<30000)return false;
  if(cur>=Math.min(floor*0.2,80000))return false;
  const restored=Math.max(cur,Math.round(Math.min(floor*0.35,Math.max(50000,ledgerIncome*0.15))));
  if(restored<=cur)return false;
  g.cash=restored;
  if((g.money||0)<restored)g.money=Math.max(g.money||0,restored);
  return true;
}
function inferPlayerNameFromSurvivors(g){
  const def=companionDefaultName();
  if(g.playerSurname&&g.playerSurname.length>=1&&g.playerSurname!=='小'&&!isCompanionDefaultPlayerName(g.playerSurname)){
    if(typeof playerNameFromParents==='function'){
      const rng=typeof seededRand==='function'?seededRand((g.stockSeed||1)*41+(g.week||0)):(function(){var x=0;return function(){x++;return(x%997)/997}})();
      return playerNameFromParents(g.playerSurname,g.playerGender||'male',rng);
    }
  }
  const playerChild=(g.children||[]).find(function(ch){return ch&&ch.bioFather==='player'&&ch.name&&ch.name.length>=2});
  if(playerChild){
    const sur=playerChild.surname||surnameFromFullName(playerChild.name);
    if(sur&&sur!=='小'){
      g.playerSurname=sur;
      if(typeof playerNameFromParents==='function'){
        const rng=typeof seededRand==='function'?seededRand((g.stockSeed||1)*41+sur.charCodeAt(0)+(playerChild.name||'').length):(function(){return Math.random})();
        return playerNameFromParents(sur,g.playerGender||'male',rng);
      }
    }
  }
  const metaName=stripSlotLabelName(g._repairMeta&&(g._repairMeta.playerName||g._repairMeta.slotLabel)||'');
  if(metaName.length>=2&&metaName.length<=4&&!isCompanionDefaultPlayerName(metaName)&&!isThematicSlotLabel(metaName))return metaName;
  return null;
}
function rebuildCompanionAfterSwapRepair(g){
  if(!g||typeof createCompanionState!=='function')return;
  const edu=g.playerEducation||'本科';
  const school=g.playerSchool||'normal';
  const seed=g.stockSeed!=null?g.stockSeed:(g.week||0);
  const fresh=createCompanionState(edu,school);
  fresh.playerName=g.partnerDisplayName||companionDefaultName();
  fresh.playerGender=g.partnerGender||'female';
  fresh.partnerGender=g.playerGender||'male';
  fresh.married=!!g.married&&!g.divorced;
  fresh.divorced=!!g.divorced;
  if(typeof initPartnerSecretStash==='function'&&g.stocks)initPartnerSecretStash(fresh,g.stocks,seed*7+23);
  if(typeof initCompanionStartingEmployment==='function'&&g.market&&g.jobCompanies){
    initCompanionStartingEmployment(fresh,g.market,edu,g.jobCompanies,seed*19+77);
  }
  g.companion=fresh;
}
function walkSaveObject(o,fn,depth){
  depth=depth||0;
  if(o==null||depth>18)return;
  fn(o,depth);
  if(Array.isArray(o))o.forEach(function(x){walkSaveObject(x,fn,depth+1)});
  else if(typeof o==='object')Object.keys(o).forEach(function(k){walkSaveObject(o[k],fn,depth+1)});
}
function collectSalvageHints(g){
  const hints={companies:[],holdings:[],portfolios:[],cashVals:[],flags:{villa:false,parentsDead:false,divorced:false,transport:false}};
  if(!g)return hints;
  walkSaveObject(g,function(node){
    if(!node||typeof node!=='object')return;
    if(node.founded&&(node.brandName||node.name||node.industries)){
      const nm=String(node.brandName||node.name||'');
      const inds=Array.isArray(node.industries)?node.industries:[node.primaryIndustry];
      if(nm.indexOf('大飞')>=0||inds.indexOf('交通运输')>=0||(node.staff&&node.staff.length>=3))hints.companies.push(node);
    }
    if(Array.isArray(node.holdings)&&node.holdings.length)hints.holdings.push(node.holdings);
    if(node.portfolio&&typeof node.portfolio==='object'&&!Array.isArray(node.portfolio)){
      const keys=Object.keys(node.portfolio);
      if(keys.length)hints.portfolios.push(node.portfolio);
    }
    if(typeof node.cash==='number'&&node.cash>=500000)hints.cashVals.push(node.cash);
    if(typeof node.money==='number'&&node.money>=500000)hints.cashVals.push(node.money);
    if(node.villaOwned)hints.flags.villa=true;
    if(node.parentsInheritanceSettled)hints.flags.parentsDead=true;
    if(node.divorced)hints.flags.divorced=true;
    if(node.industries&&node.industries.indexOf&&node.industries.indexOf('交通运输')>=0)hints.flags.transport=true;
  });
  return hints;
}
function pickBestPlayerCompany(g,hints){
  let best=g&&g.playerCompany;
  const score=function(pc){
    if(!pc||!pc.founded)return -1;
    let s=0;
    if(pc.brandName)s+=String(pc.brandName).indexOf('大飞')>=0?1000:0;
    if(pc.name&&String(pc.name).indexOf('大飞')>=0)s+=800;
    const inds=Array.isArray(pc.industries)?pc.industries:[];
    if(inds.indexOf('交通运输')>=0)s+=500;
    s+=(pc.holdings||[]).length*40;
    s+=(pc.subsidiaries||[]).length*60;
    s+=(pc.staff||[]).length*5;
    return s;
  };
  (hints.companies||[]).forEach(function(pc){if(score(pc)>score(best))best=pc});
  return best&&score(best)>0?JSON.parse(JSON.stringify(best)):null;
}
function mergeMaxPortfolio(g,portfolios){
  if(!g)return false;
  g.portfolio=g.portfolio||{};
  let changed=false;
  (portfolios||[]).forEach(function(p){
    Object.keys(p||{}).forEach(function(sym){
      const n=Math.floor(p[sym]||0);
      if(n<=0)return;
      if((g.portfolio[sym]||0)<n){g.portfolio[sym]=n;changed=true}
    });
  });
  return changed;
}
function restoreSwappedLifeFlags(g,notes){
  if(!g)return false;
  const swapped=isCompanionDefaultPlayerName(g.playerName)||looksLikeActorSwapCorruption(g,null);
  if(!swapped)return false;
  notes=notes||[];
  let fixed=false;
  const hasChild=(g.children||[]).some(function(ch){return ch&&(ch.monthsLeft>0||ch.name)});
  const hasSpouseContact=(g.contacts||[]).some(function(c){return c&&(c.id==='core_spouse'||c.kind==='spouse')});
  const shouldBeMarried=hasChild||hasSpouseContact||g.hasChildren||g.partnerDisplayName;
  if(shouldBeMarried&&(g.divorced||!g.married)){
    g.married=true;
    g.divorced=false;
    if(g.companion){g.companion.married=true;g.companion.divorced=false}
    if(g.contacts)g.contacts=g.contacts.filter(function(c){return c&&c.id!=='core_ex_spouse'&&c.kind!=='ex_spouse'});
    else if(typeof clearExSpouseContact==='function')clearExSpouseContact();
    if(g.exPartnerName)delete g.exPartnerName;
    if(g.exPartnerGender)delete g.exPartnerGender;
    notes.push('婚姻→已婚（非离异·纠正对调污染）');
    fixed=true;
  }
  if(g.parentsInheritanceSettled||g.livingOffParents){
    g.parentsInheritanceSettled=false;
    g.livingOffParents=false;
    notes.push('父母→在世（纠正对调污染）');
    fixed=true;
  }
  return fixed;
}
function deepSalvageCorruptedSave(g,slot){
  if(!g)return {ok:false,notes:['无存档数据']};
  const notes=[];
  const hints=collectSalvageHints(g);
  const bestPc=pickBestPlayerCompany(g,hints);
  if(bestPc){
    g.playerCompany=bestPc;
    notes.push('公司「'+(bestPc.brandName||bestPc.name||'大飞集团')+'」已恢复');
    if((bestPc.industries||[]).length)notes.push('行业：'+(bestPc.industries||[]).join('、'));
  }
  if(mergeMaxPortfolio(g,hints.portfolios))notes.push('持股已从存档残留合并');
  if(restorePortfolioFromCostBasis(g))notes.push('持股已从成本记录恢复');
  const basis=g.artifactStats&&g.artifactStats.stockCostBasis;
  if(basis&&basis['601939']&&(basis['601939'].shares||0)>(g.portfolio['601939']||0)){
    g.portfolio=g.portfolio||{};
    g.portfolio['601939']=basis['601939'].shares;
    notes.push('建设银行 '+basis['601939'].shares.toLocaleString()+' 股');
  }
  if(g.playerCompany&&g.playerCompany.founded){
    let bestH=g.playerCompany.holdings||[];
    (hints.holdings||[]).forEach(function(h){
      if((h||[]).length>bestH.length)bestH=h;
    });
    if(bestH.length){g.playerCompany.holdings=JSON.parse(JSON.stringify(bestH));notes.push('集团持股 '+bestH.length+' 项')}
  }
  let maxCash=Math.max(g.cash||0,g.money||0);
  (hints.cashVals||[]).forEach(function(v){if(v>maxCash)maxCash=v});
  const portVal=portfolioMarketValueFromGame(g);
  if(portVal>maxCash*0.5)maxCash=Math.max(maxCash,Math.round(portVal*0.02));
  if(maxCash>(g.cash||0)*1.5&&maxCash>=100000){
    g.cash=maxCash;
    g.money=Math.max(g.money||0,maxCash);
    notes.push('现金 ¥'+Math.round(maxCash).toLocaleString());
  }
  if(hints.flags.villa||g.villaOwned){g.villaOwned=true;notes.push('别墅')}
  if(g.privateJet&&g.privateJet.owned)g.privateJet.owned=true;
  restoreSwappedLifeFlags(g,notes);
  if(isCompanionDefaultPlayerName(g.playerName)){
    const inferred=inferPlayerNameFromSurvivors(g);
    if(inferred){g.playerName=inferred;notes.push('角色名→'+inferred)}
  }
  if((g.children||[]).length){
    g.hasChildren=(g.children||[]).some(function(ch){return ch&&ch.monthsLeft>0});
    if(g.hasChildren){
      const active=(g.children||[]).filter(function(ch){return ch&&ch.monthsLeft>0});
      if(active.length)g.childRaisingMonthsLeft=Math.max.apply(null,active.map(function(ch){return ch.monthsLeft||0}));
      g.childRecord=active[0]||g.children[0];
    }
    const wangchen=(g.children||[]).find(function(ch){return ch&&String(ch.name||'').indexOf('晨')>=0});
    if(wangchen)notes.push('孩子 '+wangchen.name);
  }
  if(isCompanionDefaultPlayerName(g.companion&&g.companion.playerName))rebuildCompanionAfterSwapRepair(g);
  g._salvageApplied=true;
  return {ok:notes.length>0,notes:notes};
}
function repairActorSwapCorruption(g,slot){
  return deepSalvageCorruptedSave(g,slot).ok;
}
function repairGameRecord(g,slot,opts){
  opts=opts||{};
  if(!g)return false;
  try{
    if(!g.market||!g.market.length)g.market=initMarket(RAW_DATA);
    if(!g.portfolio||typeof g.portfolio!=='object')g.portfolio={};
    const seed=g.stockSeed!=null?g.stockSeed:stockSeedForSlot(slot>=0?slot:0);
    if(!Array.isArray(g.stocks)||!g.stocks.length){g.stockSeed=seed;g.stocks=initStocks(seed)}
    else{
      repairStockRefPrices(g.stocks);
      g.stocks.forEach(s=>{
        if(s.prevPrice==null)s.prevPrice=s.price;
        if(!Array.isArray(s.history)||!s.history.length)s.history=[s.prevPrice,s.price];
      });
    }
    if(opts.salvage){
      if(slot>=0){try{const rec=loadAllSlots()[slot];g._repairMeta=rec&&rec.meta}catch(e){}}
      const salv=deepSalvageCorruptedSave(g,slot);
      g._actorSwapRepairNotes=salv.notes||[];
      g._actorSwapRepaired=!!salv.ok;
      delete g._repairMeta;
    }
    if(!g.ownedCars||!g.ownedCars.length)g.ownedCars=g.ownedCar?[g.ownedCar]:[];
    else if(g.ownedCar&&!g.ownedCars.includes(g.ownedCar))g.ownedCars.push(g.ownedCar);
    if(!g.ownedCar&&g.ownedCars.length)g.ownedCar=g.ownedCars[0];
    if(!g.daily)g.daily=defaultDailyState();
    if(!g.stats)g.stats=typeof defaultPlayerStats==='function'?defaultPlayerStats():{body:30,mind:30,spirit:30};
    if(!g.partnerStats)g.partnerStats=typeof rollRandomStats==='function'?rollRandomStats():{body:30,mind:30,spirit:30};
    if(!g.tempStats)g.tempStats=typeof defaultTempStats==='function'?defaultTempStats():{body:0,mind:0,spirit:0};
    if(!g.partnerTempStats)g.partnerTempStats=typeof defaultTempStats==='function'?defaultTempStats():{body:0,mind:0,spirit:0};
    if(!g.contacts)g.contacts=[];
    if(!g.ownedPhones||!g.ownedPhones.length)g.ownedPhones=g.phone?[g.phone]:['xiaomi'];
    if(!g.log)g.log=[];
    if(g.casinoHistory&&g.casinoHistory.dice){
      const z=g.casinoHistory.dice.zones||{};
      BET_ZONES.forEach(k=>{if(!z[k])z[k]={hits:0}});
      g.casinoHistory.dice.zones=z;
    }
    if(g.casinoHistory&&g.casinoHistory.roulette){
      const rz=g.casinoHistory.roulette.zones||{};
      ROULETTE_ZONES.forEach(k=>{if(!rz[k])rz[k]={hits:0}});
      g.casinoHistory.roulette.zones=rz;
    }
    if(!g.artifactStats)g.artifactStats=typeof defaultArtifactStats==='function'?defaultArtifactStats():{stockCostBasis:{}};
    if(!g.artifactStats.stockCostBasis)g.artifactStats.stockCostBasis={};
    if(!g._actorSwapRepaired){
      Object.keys(g.portfolio).forEach(sym=>{
        const n=g.portfolio[sym]||0;
        if(n<=0)return;
        const b=g.artifactStats.stockCostBasis[sym];
        if(b&&b.shares>0)return;
        const st=g.stocks.find(x=>x.symbol===sym);
        if(!st)return;
        g.artifactStats.stockCostBasis[sym]={shares:n,cost:st.price*n};
      });
    }
    reviveFalseEndGameRecord(g);
    return true;
  }catch(e){console.error('repairGameRecord',e);return false}
}
function repairSlotRecord(slot){
  const slots=loadAllSlots();
  const rec=slots[slot];
  if(!rec||!rec.game)return false;
  if(!repairGameRecord(rec.game,slot,{salvage:true}))return false;
  const notes=rec.game._actorSwapRepairNotes||[];
  delete rec.game._actorSwapRepaired;
  delete rec.game._actorSwapRepairNotes;
  refreshSlotMeta(rec);
  compactGameForSave(rec.game);
  slots[slot]=rec;
  rec._repairNotes=notes;
  return writeAllSlots(slots);
}
function reviveSlotFromFalseEndUi(slot){
  const r=reviveSlotFromFalseEnd(slot);
  alert(r.msg);
  if(r.ok)renderSlotGrid();
}
function repairSlotRecordUi(slot){
  if(repairSlotRecord(slot)){
    const rec=loadAllSlots()[slot];
    const notes=rec&&rec._repairNotes?rec._repairNotes:[];
    if(rec)delete rec._repairNotes;
    const detail=notes.length?(' · '+notes.join(' · ')):'';
    alert('档位 '+(slot+1)+' 已深捞抢救'+detail+' · 请点「续档」查看（若仍不对请打开 salvage-save.html 回滚备份）');
  }else alert('抢救档位 '+(slot+1)+' 失败或无可捞数据');
  renderSlotGrid();
}
function loadSlotIntoGame(slot){
  const rec=loadAllSlots()[slot];
  if(!rec||!rec.game)return false;
  currentSlotIndex=slot;
  selectedSlotIndex=slot;
  repairGameRecord(rec.game,slot);
  const finishLoad=(repaired)=>{
    currentSlotIndex=slot;selectedSlotIndex=slot;
    if(typeof ensurePlayerStatState==='function')ensurePlayerStatState();
    buildCategories();
    try{renderJobs();renderCasino();renderInbox();renderOffers()}catch(e){console.error('finishLoad panels',e)}
    updateUI();
    rollReferralChance();
    if(repaired)addLog('⚠ 存档已自动修复后读入','warn');
    if(typeof promptCompanyIndustryIfNeeded==='function'){
      setTimeout(function(){promptCompanyIndustryIfNeeded()},650);
    }
    return true;
  };
  try{
    const market=rec.game.market||initMarket(RAW_DATA);
    const corp=initCompanyUniverse(market);
    restoreGameState(rec.game,corp);
    game.appSubscriptions=game.appSubscriptions||{};
    if(game.referralThisWeek&&!game.referralOpportunity)game.referralOpportunity=null;
    delete game.referralThisWeek;
    game.stockSeed=rec.stockSeed||stockSeedForSlot(slot);
    game.stressHighStreak=game.stressHighStreak||0;
    game.showSpongeInsight=!!game.showSpongeInsight;
    game.lifeStressEvents=game.lifeStressEvents||{};
    game.cashStressMilestones=game.cashStressMilestones||{};
    game.shownLifeFlags=game.shownLifeFlags||{};
    game.monthLedgerHistory=game.monthLedgerHistory||[];
    game.spongeModalActive=!!game.spongeModalActive;
    initShownLifeFlagsFromState();
    game._loadingSave=true;
    try{
      migrateLoadedGameState(slot);
    }finally{
      if(game)game._loadingSave=false;
    }
    restoreUiState(rec.ui||{});
    return finishLoad(false);
  }catch(e){
    console.error('loadSlot',e);
    try{
      repairGameRecord(rec.game,slot);
      const market=rec.game.market||initMarket(RAW_DATA);
      const corp=initCompanyUniverse(market);
      restoreGameState(rec.game,corp);
      game.stockSeed=rec.stockSeed||stockSeedForSlot(slot);
      game._loadingSave=true;
      try{
        migrateLoadedGameState();
      }finally{
        if(game)game._loadingSave=false;
      }
      restoreUiState(rec.ui||{});
      return finishLoad(true);
    }catch(e2){
      console.error('loadSlot repair',e2);
      return false;
    }
  }
}
function renderSlotGrid(){
  const grid=document.getElementById('slotGrid');
  if(!grid)return;
  const slots=loadAllSlots();
  grid.innerHTML=slots.map((rec,i)=>{
    const sel=i===selectedSlotIndex?' selected':'';
    if(!rec||!rec.meta){
      return '<div class="slot-card empty'+sel+'" onclick="selectSlot('+i+')"><div class="slot-title">档位 '+(i+1)+'</div>'+
        '<div class="save-meta">空档 · 可开新游戏</div>'+
        '<div class="slot-actions"><button type="button" class="btn btn-primary" onclick="event.stopPropagation();beginNewGame('+i+')">新游戏</button></div></div>';
    }
    const m=rec.meta;
    const status=m.gameOver?('<div style="color:var(--yellow);font-size:.72rem;margin-top:4px">'+m.endingTitle+'</div>'):
      ('<div style="color:var(--green);font-size:.72rem;margin-top:4px">进行中</div>');
    const charSub=slotCharSubtitle(m);
    return '<div class="slot-card'+sel+'" onclick="selectSlot('+i+')">'+
      '<button type="button" class="slot-del" title="删除存档" onclick="event.stopPropagation();deleteSlotConfirm('+i+')">×</button>'+
      '<div class="slot-title">档位 '+(i+1)+' · '+slotArchiveTitle(m)+
      (charSub?'<div class="slot-char">角色 '+charSub+'</div>':'')+'</div>'+
      '<div class="save-meta">'+m.year+'年 · '+m.age+'岁 · 第'+m.week+'周<br>'+
      (m.jobTitle||'待业')+' · 现金 ¥'+(m.cash||0).toLocaleString()+'<br>'+
      '存档 '+rec.savedAt+'</div>'+status+
      '<div class="slot-actions">'+
      '<div class="slot-actions-row">'+
      (!m.gameOver?'<button type="button" class="btn btn-primary" onclick="event.stopPropagation();continueSlot('+i+')">续档</button>':'')+
      (m.gameOver&&rec.game&&(rec.game.week||0)<TOTAL_WEEKS?'<button type="button" class="btn btn-primary" onclick="event.stopPropagation();reviveSlotFromFalseEndUi('+i+')">恢复误终局</button>':'')+
      '<button type="button" class="btn" onclick="event.stopPropagation();repairSlotRecordUi('+i+')">抢救</button>'+
      '<button type="button" class="btn" onclick="event.stopPropagation();renameSlotUi('+i+')">命名</button>'+
      '</div>'+
      '<div class="slot-actions-row">'+renderCopySlotButtons(i,slots)+'</div>'+
      '</div></div>';
  }).join('');
}
function selectSlot(i){selectedSlotIndex=i;renderSlotGrid()}
function showStartOverlay(){
  if(currentSlotIndex>=0&&game)autoSaveSlot();
  document.getElementById('startOverlay').classList.remove('hidden');
  document.getElementById('endOverlay').classList.add('hidden');
  document.body.classList.remove('game-active');
  const cp=document.getElementById('charCreatePanel'),sg=document.getElementById('slotGrid');
  if(cp)cp.style.display='none';
  if(sg)sg.style.display='grid';
  const rb=document.getElementById('btnRebirth');
  if(rb)rb.style.display='none';
  game=null;currentSlotIndex=-1;pendingNewSlot=-1;
  renderSlotGrid();syncPlayerSchoolEdu();
}
function hideStartOverlay(){
  document.getElementById('startOverlay').classList.add('hidden');
  document.body.classList.add('game-active');
  const rb=document.getElementById('btnRebirth');
  if(rb)rb.style.display='block';
}
function beginNewGame(slot){
  selectedSlotIndex=slot;
  const slots=loadAllSlots();
  if(slots[slot]&&slots[slot].meta&&!slots[slot].meta.gameOver){
    if(!confirm('档位 '+(slot+1)+' 有进行中的存档，确定覆写开新档？'))return;
  }else if(slots[slot]&&slots[slot].meta&&slots[slot].meta.gameOver){
    if(!confirm('档位 '+(slot+1)+' 将开启新的人生，旧终局记录会被覆盖。继续？'))return;
  }
  openCharCreateForSlot(slot,(slots[slot]&&slots[slot].meta&&slots[slot].meta.playerName)||'');
}
function cancelCharCreate(){
  pendingNewSlot=-1;
  document.getElementById('charCreatePanel').style.display='none';
  document.getElementById('slotGrid').style.display='grid';
  renderSlotGrid();
}
function continueSlot(slot){
  if(!loadSlotIntoGame(slot)){
    if(confirm('读档失败。是否尝试修复该档位存档后再读？（不会删除原数据，仅补全缺失字段）')){
      if(repairSlotRecord(slot)&&loadSlotIntoGame(slot)){
        hideStartOverlay();
        consumeModalOpen=false;
        if(typeof resetAutoLifeState==='function')resetAutoLifeState();
        else if(typeof autoLifeRunning!=='undefined')autoLifeRunning=false;
        if(typeof ensurePlayerStatState==='function')ensurePlayerStatState();
        if(typeof migrateDailyState==='function')migrateDailyState();
        updateUI();
        addLog('📂 存档已修复并读入（第'+game.week+'周）','success');
        return;
      }
    }
    alert('读档仍失败。请按 F12 打开控制台查看错误，或把报错信息发给我。');
    return;
  }
  hideStartOverlay();
  consumeModalOpen=false;
  if(typeof resetAutoLifeState==='function')resetAutoLifeState();
  else if(typeof autoLifeRunning!=='undefined')autoLifeRunning=false;
  if(typeof ensurePlayerStatState==='function')ensurePlayerStatState();
  if(typeof migrateDailyState==='function')migrateDailyState();
  updateUI();
  const slots=loadAllSlots();
  const rec=slots[slot];
  const title=rec&&rec.meta?slotArchiveTitle(rec.meta):'';
  addLog('📂 读取档位 '+(slot+1)+(title?' · '+title:'')+' 存档（第'+game.week+'周）','info');
}
function deleteSlotConfirm(slot){
  if(!confirm('确定删除档位 '+(slot+1)+' 的存档？'))return;
  const slots=loadAllSlots();slots[slot]=null;writeAllSlots(slots);
  renderSlotGrid();
}
function cloneSlotRecord(rec){
  if(!rec)return null;
  try{return JSON.parse(JSON.stringify(rec))}catch(e){console.warn('cloneSlotRecord',e);return null}
}
function copySlotRecord(fromSlot,toSlot){
  if(fromSlot===toSlot)return {ok:false,msg:'不能复制到同一档位'};
  const slots=loadAllSlots();
  const src=slots[fromSlot];
  if(!src||!src.meta)return {ok:false,msg:'档位 '+(fromSlot+1)+' 无存档可复制'};
  const clone=cloneSlotRecord(src);
  if(!clone||!clone.game)return {ok:false,msg:'复制失败，存档数据损坏'};
  clone.savedAt=new Date().toLocaleString('zh-CN',{hour12:false});
  if(clone.meta){
    const realName=typeof stripForkSuffix==='function'?stripForkSuffix(clone.game.playerName):(clone.game.playerName||'').replace(/\s*·\s*分岔\d*$/,'').trim();
    const baseLabel=typeof stripForkSuffix==='function'?stripForkSuffix(clone.meta.slotLabel||clone.meta.playerName||realName):(String(clone.meta.slotLabel||clone.meta.playerName||realName||'').replace(/\s*·\s*分岔\d*$/,'').trim());
    if(realName&&realName!=='匿名')clone.meta.playerName=realName;
    else if(baseLabel&&!/分岔/.test(baseLabel))clone.meta.playerName=baseLabel;
    clone.meta.slotLabel=(baseLabel||realName||'未命名')+' · 分岔';
  }
  if(clone.game.playerName){
    clone.game.playerName=typeof stripForkSuffix==='function'?stripForkSuffix(clone.game.playerName):clone.game.playerName.replace(/\s*·\s*分岔\d*$/,'').trim();
  }
  repairGameRecord(clone.game,toSlot);
  slots[toSlot]=clone;
  if(!writeAllSlots(slots))return {ok:false,msg:'写入失败：浏览器存储空间可能已满'};
  return {ok:true,msg:'已将档位 '+(fromSlot+1)+' 复制到档位 '+(toSlot+1)+'（分岔存档）'};
}
function copySlotConfirm(fromSlot,toSlot){
  const slots=loadAllSlots();
  if(!slots[fromSlot]||!slots[fromSlot].meta){alert('档位 '+(fromSlot+1)+' 无存档');return}
  if(fromSlot===toSlot)return;
  if(slots[toSlot]&&slots[toSlot].meta){
    const m=slots[toSlot].meta;
    const tip=m.gameOver?'终局':'进行中';
    if(!confirm('档位 '+(toSlot+1)+' 已有存档（'+slotArchiveTitle(m)+' · '+tip+'）。\\n确定用档位 '+(fromSlot+1)+' 的副本覆盖？'))return;
  }
  const r=copySlotRecord(fromSlot,toSlot);
  alert(r.ok?('✓ '+r.msg):r.msg);
  if(r.ok)renderSlotGrid();
}
function renderCopySlotButtons(fromSlot,slots){
  let h='';
  for(let i=0;i<SAVE_SLOT_COUNT;i++){
    if(i===fromSlot)continue;
    const empty=!slots[i]||!slots[i].meta;
    const label=empty?('复制'+(i+1)):('覆盖'+(i+1));
    h+='<button type="button" class="btn" onclick="event.stopPropagation();copySlotConfirm('+fromSlot+','+i+')">'+label+'</button>';
  }
  return h;
}
function openCharCreateForSlot(slot,prefillName){
  selectedSlotIndex=slot;pendingNewSlot=slot;
  document.getElementById('slotGrid').style.display='none';
  document.getElementById('charCreatePanel').style.display='block';
  document.getElementById('newSlotLabel').textContent=String(slot+1);
  const inp=document.getElementById('playerNameInput');
  if(inp)inp.value=prefillName||'';
  const labelInp=document.getElementById('slotLabelInput');
  const prev=loadAllSlots()[slot];
  if(labelInp)labelInp.value=(prev&&prev.meta&&prev.meta.slotLabel)||'';
  syncPlayerSchoolEdu();
}
function confirmRebirth(){
  if(!game)return;
  if(!confirm('重新投胎将清空当前档位并开启全新人生（不读取旧档），确定吗？'))return;
  const slot=currentSlotIndex>=0?currentSlotIndex:(selectedSlotIndex>=0?selectedSlotIndex:0);
  const slots=loadAllSlots();
  slots[slot]=null;
  writeAllSlots(slots);
  game=null;currentSlotIndex=-1;pendingNewSlot=-1;
  document.getElementById('endOverlay').classList.add('hidden');
  showStartOverlay();
}
function replayGame(){
  autoSaveSlot();
  document.getElementById('endOverlay').classList.add('hidden');
  showStartOverlay();
  if(currentSlotIndex>=0)selectedSlotIndex=currentSlotIndex;
  renderSlotGrid();
}

function getPlayerSchoolFromUI(){
  const edu=document.getElementById('playerEduSelect').value;
  if(edu==='高中'||edu==='中专'||edu==='高中/中专')return 'none';
  return document.getElementById('playerSchoolSelect').value;
}
function schoolLabelFor(sk){
  if(sk==='none')return '无院校';
  if(sk==='985')return '985/211';
  if(sk==='c9')return 'C9/常春藤';
  return '普通高校';
}

function syncPlayerSchoolEdu(){
  const eduSel=document.getElementById('playerEduSelect');
  const schSel=document.getElementById('playerSchoolSelect');
  const wrap=document.getElementById('schoolSelectWrap');
  const hint=document.getElementById('schoolEduHint');
  if(!eduSel||!schSel)return;
  const edu=eduSel.value;
  const allowed=EDU_SCHOOL_ALLOW[edu]||[];
  [...eduSel.options].forEach(opt=>{opt.disabled=false;opt.hidden=false});
  if(edu==='高中'||edu==='中专'||edu==='高中/中专'){
    if(wrap)wrap.style.display='none';
    if(hint)hint.textContent=EDU_SCHOOL_HINT[edu];
    return;
  }
  if(wrap)wrap.style.display='';
  ['normal','985','c9'].forEach(sk=>{
    const opt=schSel.querySelector('option[value="'+sk+'"]');
    if(!opt)return;
    const ok=allowed.includes(sk);
    opt.disabled=!ok;
    opt.hidden=!ok;
  });
  if(!allowed.includes(schSel.value))schSel.value=allowed[0];
  if(hint)hint.textContent=EDU_SCHOOL_HINT[edu]||'';
}

function deriveCoupleOrientation(pg,sg){
  return pg===sg?'homosexual':'heterosexual';
}
function createNewGame(slot,playerName,edu,school,playerGender,partnerGender,slotLabel,lifeProfile){
  currentSlotIndex=slot;selectedSlotIndex=slot;pendingNewSlot=-1;
  const stockSeed=stockSeedForSlot(slot);
  const market=initMarket(RAW_DATA);
  const corp=initCompanyUniverse(market);
  const pg=playerGender||'male';
  const sg=partnerGender!=null?partnerGender:(Math.random()<0.5?'male':'female');
  game={
    week:0,money:0,cash:STARTING_CASH,employed:false,
    playerName:playerName,playerEducation:edu,playerSchool:school,stockSeed,
    employment:null,industryExperience:{},careerExp:{},hobbies:[],hobbyExp:{},majorExp:{},careerHistory:[],
    employedWeeks:0,switches:0,layoffs:0,totalApplications:0,successfulHires:0,failedApplications:0,
    jobHuntSpent:0,headhunterDebt:0,longestStreak:0,currentStreak:0,
    familyStress:0,familyPressureEvents:0,stressMultiplier:1,lifeStressEvents:{},cashStressMilestones:{},
    married:false,divorced:false,marriedWeeks:0,affairActive:false,affairTriggered:false,monthsUnderpaid:0,
    spouseIntimacy:INTIMACY_INITIAL,lastDateWeek:0,livingOffSpouse:false,companionFlirtTotal:0,
    mortgageMonthlyOverride:0,procreateIntentWeek:-1,
    ownsHome:false,mortgagePaymentsMade:0,mortgagePaidOff:true,
    hasChildren:false,childRaisingMonthsLeft:0,childRecord:null,
    pregnant:false,pregnantSubject:null,pregnancyStartWeek:null,pregnancyWeeksLeft:0,pregnancyIntimacyNet:0,
    pregnancyBioFather:null,pregnancyConceivedMarried:false,pendingChildCustody:null,
    exPregnancyDisputed:false,exOtherPregnancyAnnounced:false,
    livingOffParents:false,parentsSupportMonthsLeft:PARENTS_SUPPORT_MONTHS,
    parentsInheritanceSettled:false,parentsInheritanceAmount:0,
    onWelfare:false,disabled:false,welfareMonths:0,welfareUnderpaidMonths:0,
    homeless:false,homelessMonths:0,
    gameWon:false,endingType:null,gameOver:false,
    macroUnemployment:.052,prevMacroUnemployment:.052,layoffSeason:0,
    log:[],market,categoryPriceHistory:initCategoryTrends(),
    companyAll:corp.all,companyById:corp.byId,jobCompanies:corp.jobCompanies,companyStats:corp.stats,
    stocks:initStocks(stockSeed),portfolio:{},stockSpent:0,gambleSpent:0,gambleCount:0,
    casinoActive:false,casinoHistory:null,spectateRunning:false,spectatePhase:'idle',
    spectateAis:null,spectatePhaseEnd:0,spectateManualBet:false,spectatePausedMs:0,spectatePauseKind:null,
    marketActive:false,marketTimeLeft:0,marketApplyCount:0,marketBooths:[],
    chipHand:emptyChipMap(),selectedChipDenom:null,tableBets:emptyTableBets(),
    rouletteBets:emptyRouletteBets(),casinoGame:'dice',rouletteWheelRot:0,
    applications:[],inbox:[],inboxReadIds:[],offers:[],appliedCategories:{},resumeFailCount:0,showProbabilities:false,
    wolfAchievement:false,expiredOfferCount:0,stressHighStreak:0,showSpongeInsight:false,
    shownLifeFlags:{},spongeModalActive:false,
    referralOpportunity:null,appSubscriptions:{},usedHeadhunterBatch:false,
    playerCity:PLAYER_HOME_CITY,longDistance:false,casinoCoupons:0,lifestyleSpent:0,
    flirtPeopleTotal:0,mobileAdFreeUntilWeek:0,
    stealthJobSearch:false,stealthSearchWeeks:0,pendingHire:null,severanceBlacklistUntil:0,severanceLitigation:null,
    ownsConsole:false,ownsComputer:false,
    consumption:defaultConsumptionState(),
    companion:createCompanionState(edu,school),
    monthLedger:null,monthLedgerHistory:[],
    stats:rollRandomStats(),partnerStats:rollRandomStats(),tempStats:defaultTempStats(),daily:defaultDailyState(),
    contacts:[],ownedCar:null,ownedCars:[],carPanelOpen:false,carSwitchMonthKey:null,phone:'xiaomi',ownedPhones:['xiaomi'],phonePanelOpen:false,nokiaBonusActive:false,phoneSwitchMonthKey:null,
    playerGender:pg,partnerGender:sg,
    playerOrientation:'bisexual',coupleOrientation:deriveCoupleOrientation(pg,sg),
    hiredOnTempStats:false,partnerSoftRice:0,imprisonedUntilWeek:0,
    outdoorAffairPregnancy:false,partnerKnowsPlayerPregnant:false,
    partnerAffairActive:false,partnerStdActive:false,
    stdActive:false,stdWeeksInfected:0,stdTreatmentVisits:0,stdLastTreatmentWeek:-1,
    snackStock:0,snackReboundPortions:0,partnerSnackReboundPortions:0,
    allnightStreak:0,companionAllnightStreak:0,
    monthlyAbsenceMonthKey:0,monthlyAbsenceCount:0,
    openingLayoffPending:false,openingLayoffCompanyId:null,
    playerNameUserChosen:!!(playerName&&playerName!=='匿名'&&!lifeProfile),
    playerNameGenVersion:lifeProfile?2:(playerName&&playerName!=='匿名'?2:0),
    playerNameMigrated:!!(lifeProfile||(playerName&&playerName!=='匿名'))
  };
  game.partnerDisplayName=typeof pickPartnerDisplayName==='function'?pickPartnerDisplayName(sg):'小艾';
  game.bffName=typeof pickBffName==='function'?pickBffName(pg):'大壮';
  game.contactLoans=[];
  game.spouseLoans=[];
  game.lastPocketMoneyWeek=-1;
  game.lastSpouseLoanMonth=-1;
  game.spouseBigLoanUsed=false;
  game.fertilityOrder=null;
  if(game.companion){
    game.companion.married=false;
    game.companion.divorced=false;
    game.companion.stats=rollRandomStats();
    game.companion.spouseIntimacy=INTIMACY_INITIAL;
    game.companion.lastDateWeek=0;
    game.companion.livingOffSpouse=false;
    game.companion.companionFlirtTotal=0;
    game.companion.playerGender=game.playerGender;
    game.companion.partnerGender=game.partnerGender;
    game.companion.cash=rollPartnerStartingCash(stockSeed*3+11);
    initPartnerSecretStash(game.companion,game.stocks,stockSeed*7+23);
    game.companion.secretStashRevealed=false;
  }
  if(typeof initCoreContacts==='function')initCoreContacts();
  if(typeof applyLifeProfileToGame==='function'&&lifeProfile)applyLifeProfileToGame(lifeProfile);
  else if(typeof applyOpeningLifeDefaults==='function')applyOpeningLifeDefaults(game,edu);
  if(typeof migrateDreamSystem==='function')migrateDreamSystem();
  if(typeof migrateCampusRecruitment==='function')migrateCampusRecruitment();
  if(typeof initMenstrualCycleState==='function')initMenstrualCycleState();
  if(typeof migrateArtifacts==='function')migrateArtifacts();
  selectedJobIdxs=new Set();applyCategoryPicks=new Set();actionDone=false;pendingBatch=null;
  if(typeof resetAutoLifeState==='function')resetAutoLifeState();
  else if(typeof autoLifeRunning!=='undefined')autoLifeRunning=false;
  consumeModalOpen=false;
  calendarView='month';syncCalendarMonthToGame();
  game.phonePanelOpen=false;
  game.carPanelOpen=false;
  try{
    buildCategories();renderJobs();renderCasino();updateUI();
    showTab('daily');
    rollReferralChance();
  }catch(e){
    console.error('createNewGame UI',e);
    addLog('⚠ 界面初始化异常：'+(e.message||e)+' · 已尝试继续','warn');
    try{showTab('daily')}catch(e2){console.error(e2)}
  }
  const schoolLabel=typeof playerEducationDisplayLine==='function'?playerEducationDisplayLine():((game.playerEducation||'本科')+'（'+schoolLabelFor(game.playerSchool)+'）');
  const st=corp.stats;
  const openLine=typeof buildOpeningLifeLog==='function'?buildOpeningLifeLog(game):(function(){
    const gradYear=game.graduationYear||2010;
    const startAge=game.startAge!=null?game.startAge:START_AGE;
    return gradYear+'年 · '+startAge+'岁的'+game.playerName;
  })();
  addLog(openLine+' · 带着 ¥'+(game.cash||0).toLocaleString()+'、'+schoolLabel,'info');
  addLog('📊 你：肉体'+game.stats.body+' 心智'+game.stats.mind+' 精神'+game.stats.spirit+'（合计'+statTotal(game.stats)+'）','info');
  if(game.openingPhase==='residency_seek'){
    addLog('🏥 医学生：大三结束后的暑假 · 请在劳动力市场寻找规培医院（规培约3年）','info');
  }else if(game.inSchoolDorm){
    addLog('🏫 住校寝室 · 生活费含宿舍开销','info');
  }else if(game.livingAtHome){
    addLog('🏠 住家里 · 与父母同住','info');
  }
  addLog('劳动力市场：'+st.total+'家企业（大型'+st.byScale.large+'·中型'+st.byScale.medium+'·小型'+st.byScale.small+
    '｜头部'+st.byTier.high+'·重点'+st.byTier.mid+'·草根'+st.byTier.low+'），每职业约'+st.avgPerJob+'个招聘方。','info');
  autoSaveSlot(slotLabel?{slotLabel}:null);
}
function createNewGameFromLifeCreation(slot,st,slotLabel){
  if(st==null||slot<0)return;
  const outcome=typeof resolveGaokaoOutcome==='function'?resolveGaokaoOutcome(st.gaokaoScore,st,slot*31+7):{education:'本科',school:'normal',graduationYear:GRADUATION_YEAR,startAge:22};
  st.graduationYear=outcome.graduationYear;
  st.startAge=outcome.startAge;
  st.playerEducation=outcome.education;
  st.playerSchool=outcome.school;
  st.gaokaoOutcome=outcome;
  st.gaokaoForkChoice=st.gaokaoForkChoice||outcome.gaokaoForkChoice;
  const edu=outcome.education;
  const school=outcome.school;
  const names=typeof pickParentNames==='function'?pickParentNames(typeof dreamRng==='function'?dreamRng(slot*13+5):Math.random):{surname:'王',fatherSurname:'王',motherSurname:'李'};
  const nameRng=typeof dreamRng==='function'?dreamRng(slot*17+3):Math.random;
  const playerSurname=typeof pickPlayerSurnameFromParents==='function'?pickPlayerSurnameFromParents(names,nameRng):(names.surname||'王');
  const playerName=typeof playerNameFromParents==='function'?playerNameFromParents(playerSurname,st.playerGender||'male',nameRng):'匿名';
  st.parentNames=names;
  const sg=Math.random()<0.5?'male':'female';
  hideStartOverlay();
  const cp=document.getElementById('charCreatePanel'),sg2=document.getElementById('slotGrid');
  if(cp)cp.style.display='none';
  if(sg2)sg2.style.display='grid';
  createNewGame(slot,playerName,edu,school,st.playerGender||'male',sg,slotLabel||'',st);
}
function confirmNewGameInSlot(){
  if(pendingNewSlot<0)pendingNewSlot=selectedSlotIndex;
  if(pendingNewSlot<0){
    alert('请先在档位页点击「新游戏」');
    return;
  }
  const eduSel=document.getElementById('playerEduSelect');
  if(!eduSel){
    alert('界面未加载完整，请 Ctrl+F5 强刷后重试');
    return;
  }
  syncPlayerSchoolEdu();
  const edu=eduSel.value;
  const school=getPlayerSchoolFromUI();
  if(edu!=='高中'&&edu!=='中专'&&edu!=='高中/中专'&&!(EDU_SCHOOL_ALLOW[edu]||[]).includes(school)){
    alert('请先选学历，再选符合的院校：'+(EDU_SCHOOL_HINT[edu]||''));
    return;
  }
  const nameInp=document.getElementById('playerNameInput');
  const playerName=((nameInp&&nameInp.value)||'').trim()||'匿名';
  const labelInp=document.getElementById('slotLabelInput');
  const slotLabel=labelInp?labelInp.value:'';
  const pg=document.getElementById('playerGenderSelect');
  const pgVal=pg?pg.value:'male';
  const sg=Math.random()<0.5?'male':'female';
  try{
    createNewGame(pendingNewSlot,playerName,edu,school,pgVal,sg,slotLabel);
  }catch(e){
    console.error('confirmNewGameInSlot',e);
    alert('开新档失败：'+(e.message||e)+'\\n请 Ctrl+F5 强刷；仍失败请打开浏览器控制台(F12)查看报错');
    return;
  }
  hideStartOverlay();
  const cp=document.getElementById('charCreatePanel'),sg2=document.getElementById('slotGrid');
  if(cp)cp.style.display='none';
  if(sg2)sg2.style.display='grid';
}

function showTab(t){
  currentTab=t;
  document.getElementById('tabDaily').style.display=t==='daily'?'block':'none';
  document.getElementById('tabNetwork').style.display=t==='network'?'block':'none';
  document.getElementById('tabCompany').style.display=t==='company'?'block':'none';
  document.getElementById('tabJob').style.display=t==='job'?'block':'none';
  document.getElementById('tabSideIncome').style.display=t==='sideincome'?'block':'none';
  document.getElementById('tabStock').style.display=t==='stock'?'block':'none';
  document.getElementById('tabGamble').style.display=t==='gamble'?'block':'none';
  document.getElementById('tabLife').style.display=t==='life'?'block':'none';
  document.getElementById('tabCompanion').style.display=t==='companion'?'block':'none';
  document.getElementById('tabIdeal').style.display=t==='ideal'?'block':'none';
  document.querySelectorAll('#mainTabs .btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));
  if(typeof ensurePlayerStatState==='function')ensurePlayerStatState();
  if(typeof renderDailyTimeBar==='function')renderDailyTimeBar();
  if(typeof renderActionTip==='function')renderActionTip();
  if(t==='daily') safeRender(renderDailyPanel,'renderDailyPanel');
  if(t==='network') safeRender(renderNetworkPanel,'renderNetworkPanel');
  if(t==='company') safeRender(renderCompanyMgmtTab,'renderCompanyMgmtTab');
  if(t==='stock'){ if(typeof renderFinanceTab==='function')renderFinanceTab(); else renderStocks(); }
  if(t==='life') renderSpendingPanel();
  if(t==='companion') renderCompanionPanel();
  if(t==='ideal') safeRender(renderIdealPanel,'renderIdealPanel');
  if(t==='job') safeRender(renderJobHuntPanel,'renderJobHuntPanel');
  if(t==='sideincome') safeRender(renderSideIncomeTabPanel,'renderSideIncomeTabPanel');
  renderCasinoRefStats();
}

function buildCategories(){
  const picked=[...applyCategoryPicks].sort();
  const listEl=document.getElementById('categoryList');
  if(listEl){
    if(!picked.length)listEl.innerHTML=industryFilterCollapsed?'':'<div class="industry-filter-empty">未选行业 · 点「添加行业」</div>';
    else listEl.innerHTML=picked.map(c=>{
      let cls='cat-btn apply-pick active';
      if(game&&game.appliedCategories[c])cls+=' applied';
      return '<button class="'+cls+'" onclick="toggleApplyCategory(\\''+c+'\\')" title="点击取消">'+c+'</button>';
    }).join('');
  }
  const countEl=document.getElementById('industryFilterCount');
  if(countEl)countEl.textContent=picked.length?'('+picked.length+')':'';
  buildIndustryPicker();
  applyIndustryFilterCollapse();
}
function buildIndustryPicker(){
  const el=document.getElementById('industryPickerAll');
  if(!el)return;
  const all=[...new Set(RAW_DATA.map(j=>j.category))].sort();
  const unpicked=all.filter(c=>!applyCategoryPicks.has(c));
  el.innerHTML=unpicked.length?unpicked.map(c=>'<button class="cat-btn" onclick="toggleApplyCategory(\\''+c+'\\')">'+c+'</button>').join(''):'<span class="industry-filter-empty">已全部添加</span>';
  el.style.display=industryPickerOpen&&unpicked.length?'flex':'none';
}
function toggleIndustryFilter(){
  industryFilterCollapsed=!industryFilterCollapsed;
  if(industryFilterCollapsed)industryPickerOpen=false;
  buildCategories();
}
function togglePortfolioFold(){
  portfolioFoldCollapsed=!portfolioFoldCollapsed;
  applyPortfolioFoldCollapse();
}
function applyPortfolioFoldCollapse(){
  const wrap=document.getElementById('portfolioFold');
  const chev=document.getElementById('portfolioFoldChevron');
  if(wrap)wrap.classList.toggle('collapsed',portfolioFoldCollapsed);
  if(chev)chev.textContent=portfolioFoldCollapsed?'▶':'▼';
}
function applyIndustryFilterCollapse(){
  const wrap=document.getElementById('industryFilter');
  const chev=document.getElementById('industryFilterChevron');
  if(wrap)wrap.classList.toggle('collapsed',industryFilterCollapsed);
  if(chev)chev.textContent=industryFilterCollapsed?'▶':'▼';
}
function toggleIndustryPicker(force){
  if(force===true)industryPickerOpen=true;
  else if(force===false)industryPickerOpen=false;
  else industryPickerOpen=!industryPickerOpen;
  buildIndustryPicker();
}
function setCategory(c){currentCategory=c;buildCategories();refreshJobTreemapViews()}
function toggleApplyCategory(c){
  const adding=!applyCategoryPicks.has(c);
  if(adding)applyCategoryPicks.add(c);
  else applyCategoryPicks.delete(c);
  if(adding){
    refPanelCategory=c;
    refPanelView='category';
  }else if(refPanelCategory===c){
    refPanelCategory=applyCategoryPicks.size?[...applyCategoryPicks][0]:null;
    if(refPanelView==='category'&&!refPanelCategory)refPanelView='national';
  }
  buildCategories(); refreshJobTreemapViews(); updateButtons();
  if(typeof renderRefPanel==='function')renderRefPanel();
}
function ensureRefPanelCategory(){
  if(refPanelCategory)return refPanelCategory;
  if(selectedIdx>=0&&game&&game.market[selectedIdx])return game.market[selectedIdx].category;
  if(applyCategoryPicks.size)return [...applyCategoryPicks][0];
  return null;
}
function focusRefCategory(cat){
  if(!cat)return;
  refPanelCategory=cat;
  refPanelView='category';
  renderRefPanel();
}
function setSort(s){currentSort=s;document.querySelectorAll('#sortBtns .btn').forEach(b=>b.classList.toggle('active',b.dataset.sort===s));refreshJobTreemapViews()}
function filterJobsForTreemap(extraFilter){
  if(!game)return [];
  const searchEl=document.getElementById('searchInput');
  const search=searchEl?searchEl.value.trim():'';
  return game.market.filter(j=>{
    if(applyCategoryPicks.size&&!applyCategoryPicks.has(j.category))return false;
    if(search&&!j.title.includes(search))return false;
    if(game.onWelfare&&!canApplyJob(j))return false;
    if(extraFilter&&!extraFilter(j))return false;
    return true;
  });
}
function refreshJobTreemapViews(){
  renderJobs();
  if(typeof renderJobHuntPanel==='function'&&typeof currentTab!=='undefined'&&currentTab==='job'){
    const sm=game&&game.daily&&game.daily.jobSubMenu;
    if(sm==='app_jobs'||sm==='headhunter_jobs')renderJobHuntPanel();
  }
}
function onJobSearchInput(){refreshJobTreemapViews()}
function getDateStr(week){const d=getGameStartDate();d.setDate(d.getDate()+week*7);return d.toLocaleDateString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit'})}
function getGameWeekDate(week){
  const d=getGameStartDate();d.setDate(d.getDate()+week*7);d.setHours(0,0,0,0);return d;
}
function dateToGameWeek(date){
  const start=getGameStartDate();
  const d=new Date(date);d.setHours(0,0,0,0);
  return Math.floor((d-start)/86400000/7);
}
function syncCalendarMonthToGame(){
  if(!game)return;
  const d=getGameWeekDate(game.week);
  calendarYear=d.getFullYear();calendarMonth=d.getMonth();
}
function shiftCalendarMonth(delta){
  calendarMonth+=delta;
  if(calendarMonth<0){calendarMonth=11;calendarYear--}
  if(calendarMonth>11){calendarMonth=0;calendarYear++}
  renderInterviewCalendar();
}
function defaultConsumptionState(){
  return{
    snackCount:0,snackRebound:0,dateUsed:false,onlineDateUsed:false,
    consolePlayed:false,computerUsed:false,
    scrollSessions:0,sexSessions:0,masturbationSessions:0,
    svBoring:0,svTrash:0,svInteresting:0,
    dramaViews:0,flirtHot:0,flirtSilent:0,flirtAwkward:0,
    mobileGames:0,mobileAds:0
  };
}
const COMPANION_NAME='小艾';
const COMPANION_APPS=['boss','lagou'];
const ACTOR_FIELDS=[
  'cash','money','employed','playerName','playerEducation','playerSchool',
  'employment','industryExperience','careerExp','hobbies','hobbyExp','majorExp','careerHistory',
  'employedWeeks','switches','layoffs','totalApplications','successfulHires','failedApplications',
  'jobHuntSpent','headhunterDebt','longestStreak','currentStreak',
  'familyStress','familyPressureEvents','stressMultiplier','lifeStressEvents','cashStressMilestones',
  'married','divorced','marriedWeeks','affairActive','affairTriggered','monthsUnderpaid',
  'spouseIntimacy','lastDateWeek','livingOffSpouse','companionFlirtTotal','mortgageMonthlyOverride','procreateIntentWeek',
  'ownsHome','mortgagePaymentsMade','mortgagePaidOff',
  'hasChildren','childRaisingMonthsLeft',
  'livingOffParents','parentsSupportMonthsLeft','parentsInheritanceSettled','parentsInheritanceAmount',
  'onWelfare','disabled','welfareMonths','welfareUnderpaidMonths',
  'homeless','homelessMonths','gameWon','endingType','gameOver',
  'portfolio','stockSpent','gambleSpent','gambleCount',
  'applications','inbox','inboxReadIds','offers','appliedCategories','resumeFailCount',
  'wolfAchievement','expiredOfferCount','stressHighStreak','showProbabilities','showSpongeInsight',
  'referralOpportunity','appSubscriptions','usedHeadhunterBatch',
  'playerCity','longDistance',
  'stealthJobSearch','stealthSearchWeeks','pendingHire','severanceBlacklistUntil','severanceLitigation',
  'ownsConsole','ownsComputer','consumption','lifestyleSpent','flirtPeopleTotal','mobileAdFreeUntilWeek',
  'casinoCoupons','shownLifeFlags',
  'stats','partnerStats','tempStats','daily','contacts','ownedCar','ownedCars','carSwitchMonthKey','phone','playerGender','partnerGender','playerOrientation','coupleOrientation','villaFacilities','birthYear','graduationYear','startAge','familyTier','baseStress','lifeExpectancy','deathWeek','spouseDeceased','stressLifeStreak','stressLifeWarnings','parentNames','parentFamiliarity','gaokaoScore','playerDream','playerCircles','playerInfluence','selfEmploy','hobbyProjects','hobbyAttendedWeek','flux','idealWorkContracts','activeIdealContractId','workplaceMeta','networkFocusId','networkStack','majorPrefs','openingPhase','inheritancePending','destinyLove','destinyYear','lotteryNum','lotteryPending','hiredOnTempStats','partnerSoftRice','livingSituation','livingAtHome','inSchoolDorm','dormRent','playerSchoolCity','residencyTraining','inResidencyPhase','campusRecruitment','playerProfileOpen','myLifeOpen','sideIncomePanelOpen','housingType','rentPlan','_housingForcedLD','_housingMigrated'
];
let _companionActor=false;
function initCompanionStartingEmployment(companion,market,edu,jobCompanies,seed){
  if(!companion||companion.employed||!market||!jobCompanies)return false;
  const rng=seededRand(seed||88);
  const eligible=[];
  market.forEach((j,ji)=>{
    if(isOverAgeLimit(j))return;
    const gap=Math.max(0,(EDU_RANK[j.education]||4)-(EDU_RANK[edu]||4));
    if(gap>=2)return;
    eligible.push(ji);
  });
  shuffleArr(eligible,rng);
  for(let t=0;t<eligible.length;t++){
    const ji=eligible[t],job=market[ji];
    let pool=(jobCompanies[ji]||[]).slice();
    shuffleArr(pool,rng);
    const local=pool.filter(co=>(parseCityFromCompanyName(co.name)||co.city)===PLAYER_HOME_CITY);
    const tryPool=local.length?local:pool;
    for(let ci=0;ci<Math.min(tryPool.length,12);ci++){
      const co=tryPool[ci];
      const r=seededR(ji*97+ci*13+(seed||0));
      const poor=companionActorTotalAssets(companion)<COMPANION_POOR_ASSET_THRESHOLD;
      let openings=genOpeningsForCompany(job,co,r).filter(op=>!op.planned);
      if(!openings.length)continue;
      let op;
      if(poor){
        openings=[...openings].sort((a,b)=>companionOfferEaseScore(b,job,ji)-companionOfferEaseScore(a,job,ji));
        op=openings.find(o=>o.roleExtra==='temp')||openings.find(o=>o.roleExtra==='intern')||
          openings.find(o=>o.importance==='low')||openings[0];
      }else{
        openings=openings.filter(op=>op.roleExtra!=='temp');
        op=openings.find(o=>!o.roleExtra)||openings[0];
      }
      if(!op)continue;
      const internWeeks=op.roleExtra==='intern'?
        (co.tier==='low'?10+Math.floor(rng()*15):co.tier==='mid'?6+Math.floor(rng()*11):4+Math.floor(rng()*8)):0;
      companion.employed=true;
      companion.employment={
        jobIdx:ji,company:co,tier:co.tier,importance:op.importance,
        roleExtra:op.roleExtra||null,annualPay:op.pay,
        otProfile:op.otProfile||legacyOvertimeProfile(co.tier,op.importance,op.roleExtra,co,job),
        internWeeksLeft:internWeeks,
        weeksInIndustry:26+Math.floor(rng()*78),
        weeksInCompany:12+Math.floor(rng()*40),
        weeksInRole:12+Math.floor(rng()*30)
      };
      companion.industryExperience[job.category]=companion.employment.weeksInIndustry;
      companion.employedWeeks=companion.employment.weeksInCompany;
      companion.successfulHires=1;
      companion.playerCity=getCompanyCity(co);
      return true;
    }
  }
  return false;
}
const COMPANION_POOR_ASSET_THRESHOLD=10000;
function companionActorTotalAssets(c){
  if(!c)return 0;
  const cash=c.cash||0;
  const stashCash=c.secretStashCash||0;
  const port=c.secretStashPortfolio||{};
  let stockVal=0;
  if(game&&typeof portfolioMarketValue==='function')stockVal=portfolioMarketValue(port);
  else stockVal=Math.max(0,(c.secretStash||0)-stashCash);
  return Math.max(0,cash+stashCash+stockVal);
}
function companionTotalAssets(){
  if(typeof _companionActor!=='undefined'&&_companionActor){
    const c=game.companion;
    return Math.max(0,(game.cash||0)+(c&&typeof refreshPartnerStashTotal==='function'?refreshPartnerStashTotal():(c&&c.secretStash)||0));
  }
  return game&&game.companion?companionActorTotalAssets(game.companion):0;
}
function companionNeedsEasyJobs(){
  return companionTotalAssets()<COMPANION_POOR_ASSET_THRESHOLD;
}
function companionJobEaseScore(ji){
  const j=game.market[ji];
  if(!j)return 0;
  let s=0;
  if(typeof isManualJob==='function'&&isManualJob(j))s+=8;
  else if(MANUAL_CATS.includes(j.category))s+=5;
  if(j.category==='个人与生活服务'||j.category==='餐饮住宿'||j.category==='销售零售与电商')s+=3;
  if(j.exposure<=3)s+=3;
  s+=Math.min(4,(j.jobs||0)/400000);
  if(j.pay<=120000)s+=2;
  return s;
}
function companionOfferEaseScore(offer,job,jobIdx){
  const o=offer||{};
  let s=jobIdx!=null?companionJobEaseScore(jobIdx):0;
  if(o.roleExtra==='temp')s+=14;
  if(o.roleExtra==='intern')s+=8;
  if(o.importance==='low')s+=6;
  if(o.tier==='low')s+=6;
  if(o.planned)s-=10;
  return s;
}
function pickCompanionJobIdx(eligible,rng){
  if(!eligible.length)return -1;
  if(!companionNeedsEasyJobs())return eligible[Math.floor(rng()*eligible.length)];
  const scored=eligible.map(ji=>({ji,s:companionJobEaseScore(ji)}));
  scored.sort((a,b)=>b.s-a.s);
  const pool=scored.slice(0,Math.min(8,scored.length));
  return pool[Math.floor(rng()*pool.length)].ji;
}
function revealPartnerSecretStashOnDivorce(skipAnnounce){
  if(!game||!game.companion)return;
  if(typeof refreshPartnerStashTotal==='function')refreshPartnerStashTotal();
  const c=game.companion;
  const stash=c.secretStash||0;
  if(!skipAnnounce&&stash>0){
    const cashPart=c.secretStashCash||0;
    const stockPart=Math.max(0,stash-cashPart);
    const pn=game.partnerDisplayName||COMPANION_NAME;
    const detail=stockPart>0?'（现金约 ¥'+cashPart.toLocaleString()+' · 持仓约 ¥'+stockPart.toLocaleString()+'）':'';
    addLog('💔 离婚清算：'+pn+' 隐瞒小金库 ¥'+stash.toLocaleString()+detail+' 已计入分割','info');
  }
  c.secretStashRevealed=true;
}
function createCompanionState(edu,school){
  return{
    playerName:COMPANION_NAME,playerEducation:edu||'本科',playerSchool:school||'normal',
    cash:0,money:0,secretStash:0,secretStashCash:0,secretStashPortfolio:{},secretStashRevealed:false,employed:false,employment:null,
    industryExperience:{},careerHistory:[],
    employedWeeks:0,switches:0,layoffs:0,totalApplications:0,successfulHires:0,failedApplications:0,
    jobHuntSpent:0,headhunterDebt:0,longestStreak:0,currentStreak:0,
    familyStress:0,familyPressureEvents:0,stressMultiplier:1,lifeStressEvents:{},cashStressMilestones:{},
    married:true,divorced:false,marriedWeeks:0,affairActive:false,affairTriggered:false,monthsUnderpaid:0,
    spouseIntimacy:INTIMACY_INITIAL,lastDateWeek:0,livingOffSpouse:false,companionFlirtTotal:0,
    mortgageMonthlyOverride:0,procreateIntentWeek:-1,
    ownsHome:true,mortgagePaymentsMade:0,mortgagePaidOff:false,
    hasChildren:false,childRaisingMonthsLeft:0,childRecord:null,
    pregnant:false,pregnantSubject:null,pregnancyStartWeek:null,pregnancyWeeksLeft:0,pregnancyIntimacyNet:0,
    pregnancyBioFather:null,pregnancyConceivedMarried:false,pendingChildCustody:null,
    exPregnancyDisputed:false,exOtherPregnancyAnnounced:false,
    livingOffParents:false,parentsSupportMonthsLeft:PARENTS_SUPPORT_MONTHS,
    parentsInheritanceSettled:false,parentsInheritanceAmount:0,
    onWelfare:false,disabled:false,welfareMonths:0,welfareUnderpaidMonths:0,
    homeless:false,homelessMonths:0,gameWon:false,endingType:null,gameOver:false,
    portfolio:{},stockSpent:0,gambleSpent:0,gambleCount:0,
    applications:[],inbox:[],inboxReadIds:[],offers:[],appliedCategories:{},resumeFailCount:0,
    wolfAchievement:false,expiredOfferCount:0,stressHighStreak:0,showProbabilities:false,showSpongeInsight:false,
    referralOpportunity:null,appSubscriptions:{},usedHeadhunterBatch:false,
    playerCity:PLAYER_HOME_CITY,longDistance:false,casinoCoupons:0,lifestyleSpent:0,
    flirtPeopleTotal:0,mobileAdFreeUntilWeek:0,
    stealthJobSearch:false,stealthSearchWeeks:0,pendingHire:null,severanceBlacklistUntil:0,severanceLitigation:null,
    ownsConsole:false,ownsComputer:false,consumption:defaultConsumptionState(),
    shownLifeFlags:{},log:[],
    stats:rollRandomStats(),tempStats:defaultTempStats(),daily:defaultDailyState(),
    contacts:[],ownedCar:null,phone:'xiaomi',playerGender:'male',partnerGender:'female',
    hiredOnTempStats:false,partnerSoftRice:0
  };
}
function runAsCompanion(fn){
  if(!game||!game.companion)return;
  const snap={};
  ACTOR_FIELDS.forEach(k=>{snap[k]=game[k]});
  ACTOR_FIELDS.forEach(k=>{game[k]=game.companion[k]});
  if(!game.log)game.log=[];
  game.companion.log=game.companion.log||[];
  const savedLog=game.log;
  game.log=game.companion.log;
  _companionActor=true;
  try{fn()}
  finally{
    ACTOR_FIELDS.forEach(k=>{game.companion[k]=game[k]});
    ACTOR_FIELDS.forEach(k=>{game[k]=snap[k]});
    game.log=savedLog;
    _companionActor=false;
  }
}
function serializeCompanionActor(c){
  if(!c)return null;
  const o={...c};
  if(o.employment){
    o.employment={...o.employment};
    if(o.employment.company){o.employment.companyId=o.employment.company.id;delete o.employment.company}
  }
  o.inbox=(o.inbox||[]).map(it=>({...it,offer:stripCoInOffer(it.offer)}));
  o.offers=(o.offers||[]).map(of=>({...of,offer:stripCoInOffer(of.offer)}));
  o.applications=(o.applications||[]).map(a=>({...a,offer:stripCoInOffer(a.offer)}));
  o.log=(o.log||[]).slice(0,60);
  return o;
}
function restoreCompanionActor(c,byId){
  if(!c)return null;
  if(c.employment&&c.employment.companyId){
    c.employment.company=byId[c.employment.companyId];
    delete c.employment.companyId;
  }
  c.inbox=(c.inbox||[]).map(it=>({...it,offer:relinkOffer(it.offer,byId)}));
  c.offers=(c.offers||[]).map(of=>({...of,offer:relinkOffer(of.offer,byId)}));
  c.applications=(c.applications||[]).map(a=>({...a,offer:relinkOffer(a.offer,byId)}));
  c.log=c.log||[];
  c.consumption=c.consumption||defaultConsumptionState();
  return c;
}
function getMonthlyExpensesFor(a){
  if(!a)return {total:0,label:'',mortgage:0,living:0};
  if(a===game&&(game.livingSituation==='home'||game.livingAtHome)){
    const living=applyChildLivingCost(2200,(a===game&&typeof getPlayerChildExpense==='function')?getPlayerChildExpense():{living:0,additive:false});
    return {housing:0,living,total:living,mortgage:0,label:game.livingOffParents?'住家里（啃老）':'住家里',isRent:false,affairMult:1};
  }
  if(a===game&&game.inSchoolDorm){
    const dorm=game.dormRent||650;
    const living=applyChildLivingCost(2800,(typeof getPlayerChildExpense==='function')?getPlayerChildExpense():{living:0,additive:false});
    return {housing:dorm,living,total:dorm+living,mortgage:0,label:'学校寝室',isRent:true,affairMult:1};
  }
  if(a.homeless)return {housing:0,living:1000,total:1000,mortgage:0,label:'流浪（桥洞）',isRent:true,affairMult:1};
  if(a.onWelfare)return {housing:1000,living:1000,total:2000,mortgage:0,label:a.disabled?'伤残低保':'低保',isRent:true,affairMult:1};
  if(a.divorced){
    const childExp=(a===game&&typeof getPlayerChildExpense==='function')?getPlayerChildExpense():{living:0,additive:false};
    if(a.ownsHome&&!a.mortgagePaidOff){
      let mortgage=a.mortgageMonthlyOverride||MORTGAGE_PAYMENT;
      let living=applyChildLivingCost(5000,childExp);
      return {housing:mortgage,living,total:mortgage+living,mortgage,label:'离异独居',isRent:false,affairMult:1};
    }
    let living=applyChildLivingCost(3000,childExp);
    return {housing:3000,living,total:3000+living,mortgage:0,label:'离异租房',isRent:true,affairMult:1};
  }
  const mortgage=a.ownsHome&&!a.mortgagePaidOff?(a.mortgageMonthlyOverride||MORTGAGE_PAYMENT):0;
  let living=5000;
  let label='自有住房';
  if(a.hasChildren&&a.childRaisingMonthsLeft>0){
    const childExp=(a===game&&typeof getPlayerChildExpense==='function')?getPlayerChildExpense():{living:CHILD_LIVING_COST,additive:false};
    living=applyChildLivingCost(5000,childExp);
    label=childExp.childLabel||('育儿期（'+a.childRaisingMonthsLeft+'月）');
  }else if(a.mortgagePaidOff)label='已还清房贷';
  const affairMult=a.affairActive?2:1;
  let total;
  if(affairMult>1){total=(mortgage+living)*affairMult;living*=affairMult;mortgage*=affairMult;label+=' · 婚外情（花费×2）'}
  else total=mortgage+living;
  return {housing:mortgage,living,total,mortgage,label,isRent:false,affairMult};
}
function companionLifeLabel(a){
  if(game&&game.pregnant&&game.pregnantSubject==='partner')return '孕期';
  if(a.homeless)return '流浪';
  if(a.affairActive)return '婚外情';
  if(a.onWelfare)return a.disabled?'伤残低保':'低保';
  if(a.livingOffSpouse)return '吃软饭';
  if(a.livingOffParents)return '啃老';
  return '正常';
}
function companionTradeStock(sym,action,shares){
  const s=game.stocks.find(x=>x.symbol===sym);if(!s)return;
  shares=Math.floor(shares)||0;if(shares<=0)return;
  if(action==='buy'){
    if(typeof checkStockBuyAllowed==='function'){
      const chk=checkStockBuyAllowed(sym,shares);
      if(!chk.ok)return;
    }
    const cost=s.price*shares,comm=stockCommission(cost),total=cost+comm;
    if(game.cash<total)return;
    game.cash-=total;game.stockSpent+=comm;
    game.portfolio[sym]=(game.portfolio[sym]||0)+shares;
    addLog('买入 '+s.name+' ×'+shares,'info');
  }else{
    const held=game.portfolio[sym]||0;if(held<shares)return;
    const rev=s.price*shares,comm=stockCommission(rev),net=rev-comm;
    game.cash+=net;game.money+=net;game.stockSpent+=comm;
    game.portfolio[sym]=held-shares;if(game.portfolio[sym]<=0)delete game.portfolio[sym];
    addLog('卖出 '+s.name+' ×'+shares,'info');
  }
}
function companionSimulateApply(){
  if(game.homeless||game.gameOver)return;
  const active=game.applications.filter(a=>['pending','interview_invite','interview_confirmed','interview_scheduled'].includes(a.status));
  if(active.length>=4)return;
  if(game.employed&&Math.random()>0.28&&!game.stealthJobSearch)return;
  const eligible=[];
  game.market.forEach((j,ji)=>{if(!isOverAgeLimit(j)&&canApplyJob(j))eligible.push(ji)});
  if(!eligible.length)return;
  const pickRng=seededRand(game.week*503+(game.employed?1:0));
  const ji=pickCompanionJobIdx(eligible,pickRng);
  if(ji<0)return;
  const renewApps=COMPANION_APPS.filter(a=>!isAppSubscribed(a));
  const renewCost=renewApps.length*APP_COST_EACH;
  if(game.cash<renewCost)return;
  if(renewCost){game.cash-=renewCost;game.jobHuntSpent+=renewCost;activateAppSubscriptions(renewApps)}
  const rc={upfront:renewCost,label:COMPANION_APPS.map(a=>JOB_APPS[a]).join('+'),apps:COMPANION_APPS};
  let batch;
  try{batch=drawRecruitmentRound([ji],rc)}catch(e){return}
  if(!batch.listings.length)return;
  const easy=companionNeedsEasyJobs();
  const sorted=[...batch.listings].sort((a,b)=>easy?
    companionOfferEaseScore(b.offer,b.job,b.jobIdx)-companionOfferEaseScore(a.offer,a.job,a.jobIdx):
    b.offer.annualPay-a.offer.annualPay);
  const n=Math.min(sorted.length,1+Math.floor(Math.random()*2));
  for(let i=0;i<n;i++){
    const item=sorted[i];
    const id='capp_'+game.week+'_'+i+'_'+Math.floor(Math.random()*9999);
    game.applications.push({
      id,jobIdx:item.jobIdx,offer:{...item.offer,apps:COMPANION_APPS,method:'app'},
      status:'pending',applyWeek:game.week,replyWeek:calcApplicationReplyWeek(item.offer,game.week,item.jobIdx),
      planned:!!item.offer.planned,interviewWeek:null,resultWeek:null,viaReferral:false,method:'app',
      resumeCostLabel:rc.label
    });
    game.totalApplications++;
  }
  game.appliedCategories[game.market[ji].category]=true;
  if(game.employed)markStealthJobSearch();
  addLog('投递 '+n+' 份简历（'+game.market[ji].title+'）','info');
}
function companionAutoInterviews(){
  game.applications.filter(a=>a.status==='interview_invite').forEach(app=>{
    if(!app.interviewWeek||!app.interviewSlot)return;
    if(isInterviewSlotTaken(app.interviewWeek,app.interviewSlot,app.id))return;
    if(hasInterviewTravelConflict(app,app.interviewWeek,app.interviewSlot))return;
    const est=calcInterviewAttendanceCost(app,false);
    if(game.cash<est.cost)return;
    app.status='interview_confirmed';
    const item=game.inbox.find(x=>x.id===app.id&&x.type==='interview');
    if(item)item.confirmed=true;
    addLog('答应 '+app.offer.company.name+' 面试','info');
  });
  game.applications.filter(a=>a.status==='interview_confirmed'&&a.interviewWeek===game.week&&!a.interviewHeld).forEach(app=>{
    if(canAttendInterviewNow(app))attendInterviewSlot(app.id);
  });
}
function companionAutoOffers(){
  const avail=game.offers.filter(o=>game.week<=o.expireWeek);
  if(!avail.length)return;
  const easy=companionNeedsEasyJobs();
  avail.sort((a,b)=>easy?
    companionOfferEaseScore(b.offer,null,b.jobIdx)-companionOfferEaseScore(a.offer,null,a.jobIdx):
    (b.finalPay||b.offer.annualPay)-(a.finalPay||a.offer.annualPay));
  const best=avail[0];
  if(!best.negotiated)negotiateOffer(best.id);
  else if(best.stage==='contract'||best.negotiated)signContractOffer(best.id);
  avail.slice(1).forEach(o=>declineOffer(o.id));
}
function companionAutoStocks(){
  if(game.gameOver||game.cash<3000)return;
  const held=Object.keys(game.portfolio);
  if(!held.length&&game.cash>12000){
    const s=game.stocks[Math.floor(Math.random()*game.stocks.length)];
    const shares=Math.floor(game.cash*0.12/s.price);
    if(shares>=10)companionTradeStock(s.symbol,'buy',shares);
    return;
  }
  held.forEach(sym=>{
    const s=game.stocks.find(x=>x.symbol===sym),n=game.portfolio[sym];
    if(!s||!n)return;
    if(s.price>=s.prevPrice*1.025&&n>=20)companionTradeStock(sym,'sell',Math.floor(n*0.25));
    else if(s.price<=s.prevPrice*0.975&&game.cash>8000){
      const buy=Math.floor(game.cash*0.06/s.price);
      if(buy>=10)companionTradeStock(sym,'buy',buy);
    }
  });
}
function companionRollReferral(){
  let p=0.03;
  if(game.married&&!game.divorced)p+=0.015;
  if((game.careerHistory||[]).length)p+=0.01;
  if(Math.random()<Math.min(0.07,p))game.referralOpportunity=generateReferralOpportunity();
}
function companionAutoReferral(){
  if(!game.referralOpportunity||game.homeless)return;
  const item=game.referralOpportunity.positions[0];
  if(!item)return;
  const id='cref_'+game.week+'_'+Math.floor(Math.random()*9999);
  if(game.employed)markStealthJobSearch();
  game.applications.push({
    id,jobIdx:item.jobIdx,offer:{...item.offer,method:'referral'},
    status:'pending',applyWeek:game.week,replyWeek:calcApplicationReplyWeek(item.offer,game.week,item.jobIdx),
    planned:!!item.offer.planned,interviewWeek:null,resultWeek:null,viaReferral:true,method:'referral',
    resumeCostLabel:'内推·'+item.referrer
  });
  game.totalApplications++;game.appliedCategories[item.category]=true;
  game.referralOpportunity=null;
  addLog('内推投递 '+item.jobTitle+' @'+item.offer.company.name,'info');
}
function tickCompanionWeek(){
  if(!game||!game.companion||game.companion.gameOver)return;
  const c=game.companion;
  if(typeof ensureCompanionMonthlyAbsenceMonth==='function')ensureCompanionMonthlyAbsenceMonth();
  const compAbsLim=typeof MONTHLY_ABSENCE_LIMIT!=='undefined'?MONTHLY_ABSENCE_LIMIT:4;
  if(c.employed&&(c.monthlyAbsenceCount||0)>compAbsLim){
    if(typeof companionEmployerOwnerImmune==='function'&&companionEmployerOwnerImmune()){
      /* 已收购其就职企业 · 免辞退 */
    }else if(typeof fireCompanionForWorkAbsence==='function')fireCompanionForWorkAbsence();
    else{
      if(typeof runAsCompanion==='function'){
        runAsCompanion(()=>{if(typeof recordCareerHistory==='function')recordCareerHistory(game.employment)});
      }
      c.employed=false;
      c.employment=null;
      c.layoffs=(c.layoffs||0)+1;
      addLog('💔 '+((game.partnerDisplayName)||'伴侣')+'本月旷工超过 '+compAbsLim+' 次，被辞退','fail');
    }
  }
  runAsCompanion(()=>{
    if(game.married&&!game.divorced)game.marriedWeeks++;
    companionRollReferral();
    companionAutoReferral();
    companionSimulateApply();
    companionAutoInterviews();
    companionAutoOffers();
    companionAutoStocks();
    processApplicationPipeline();
    tickPendingHire();
    if(game.employed)processEmployedWeek();
    else addStress(STRESS_UNEMPLOYED_WEEKLY);
    if(game.divorced||!game.married)addStress(STRESS_SINGLE_WEEKLY);
    if(game.longDistance&&game.married&&!game.divorced)addStress(STRESS_LONG_DISTANCE_WEEKLY,'异地 ');
    if(game.week%WEEKS_PER_MONTH===0)processMonthlyBills();
    tickWeeklyConsumption();
    checkCashStressMilestones();
    if(game.week>=TOTAL_WEEKS&&!game.gameOver){
      game.gameOver=true;
      addLog('三十年人生落幕','info');
    }
  });
}
function familyChildStatusHtml(){
  if(!game)return '';
  const rows=[];
  const fertRow=typeof fertilityStatusCompanionRow==='function'?fertilityStatusCompanionRow():'';
  if(fertRow)rows.push(fertRow);
  else if(game.procreateIntentWeek===game.week&&!game.pregnant&&!game.hasChildren)
    rows.push('<div class="companion-row"><span>备孕</span><span style="color:var(--green)">进行中</span></div>');
  if(game.pregnant){
    const pn=game.partnerDisplayName||'伴侣';
    const who=game.pregnantSubject==='player'?'你':(game.pregnantSubject==='partner'?pn:'');
    const pregLeft=typeof pregnancyWeeksRemaining==='function'?pregnancyWeeksRemaining():game.pregnancyWeeksLeft;
    let preg='孕期中 · '+who+'怀孕 · 剩余 '+pregLeft+' 周';
    const net=game.pregnancyIntimacyNet||0;
    if(net)preg+=' · 孕期亲密度净'+(net>=0?'+':'')+net;
    rows.push('<div class="companion-row"><span>孕期</span><span style="color:var(--yellow)">'+preg+'</span></div>');
  }
  const cr=typeof ensureChildRecord==='function'?ensureChildRecord():null;
  const monthsLeft=cr?cr.monthsLeft:(game.childRaisingMonthsLeft||0);
  const childList=typeof getActiveChildren==='function'?getActiveChildren():(cr&&cr.monthsLeft>0?[cr]:[]);
  if(game.hasChildren||monthsLeft>0||childList.length){
    if(childList.length){
      childList.forEach(function(ch){
        const ml=ch.monthsLeft||0;
        if(ml<=0)return;
        const ageLbl=typeof formatChildAge==='function'?formatChildAge(ch):'';
        const bd=typeof getChildBirthDateStr==='function'?getChildBirthDateStr(ch):'';
        const yrsUntil=Math.floor(ml/12),moUntil=ml%12;
        const untilLbl=(yrsUntil?yrsUntil+'年':'')+(moUntil?moUntil+'月':'')||ml+'月';
        let detail=(ch.name||'孩子');
        if(ageLbl)detail+=' · '+ageLbl;
        if(bd)detail+=' · 生于 '+bd;
        detail+=' · 距成年 '+untilLbl;
        const st=ch.stats||{};
        if(st.body!=null)detail+=' · 肉体'+(st.body|0)+'/心智'+(st.mind|0)+'/精神'+(st.spirit|0);
        const exp=typeof childExpenseForEntry==='function'?childExpenseForEntry(ch):0;
        if(exp)detail+=' · ¥'+exp.toLocaleString()+'/月';
        rows.push('<div class="companion-row"><span>育儿</span><span style="color:var(--orange)">'+detail+'</span></div>');
      });
    }else if(monthsLeft>0){
      const yrs=Math.floor(monthsLeft/12),mo=monthsLeft%12;
      const remain=(yrs?yrs+'年':'')+(mo?mo+'月':'')||monthsLeft+'月';
      let detail='进行中 · 剩余 '+monthsLeft+' 月（约'+remain+'）';
      if(cr&&game.divorced){
        detail+=' · 抚养权：'+custodyHolderLabel(cr.custody);
        if(cr.custody==='partner'&&cr.bioFather!=='other'){
          if(cr.paternityTested&&!cr.paternityIsPlayer)detail+=' · 无需抚养费';
          else if(cr.paternityIsPlayer)detail+=' · 抚养费 ¥'+CHILD_LIVING_COST.toLocaleString()+'/月';
          else if(cr.supportDemand)detail+=' · 对方索要抚养费 · <button class="btn" style="font-size:.62rem;padding:1px 6px;vertical-align:baseline" onclick="showPaternityTestPromptModal(false)">亲子鉴定 ¥'+PATERNITY_TEST_COST.toLocaleString()+'</button>';
          else detail+=' · 抚养费待定';
        }else if(cr.bioFather==='other')detail+=' · 非亲生，无需抚养费';
      }else{
        detail+=' · 月生活费 ¥'+CHILD_LIVING_COST.toLocaleString();
      }
      rows.push('<div class="companion-row"><span>育儿</span><span style="color:var(--orange)">'+detail+'</span></div>');
    }else{
      rows.push('<div class="companion-row"><span>孩子</span><span style="color:var(--green)">已成年 · 月生活费已恢复</span></div>');
    }
  }
  if(game.pregnant&&game.divorced){
    const holder=game.pendingChildCustody?custodyHolderLabel(game.pendingChildCustody):'待判定';
    rows.push('<div class="companion-row"><span>离婚孕期</span><span style="color:var(--yellow)">出生后抚养权归 '+holder+
      (game.pregnancyBioFather==='other'?' · 婚外情受孕，无需抚养费':'')+'</span></div>');
  }
  if(!rows.length)return '';
  return '<div class="companion-section"><h4>孩子</h4>'+rows.join('')+'</div>';
}
function renderCompanionPanel(){
  const el=document.getElementById('companionContent');
  if(!el||!game)return;
  const pn=game.partnerDisplayName||(game.married&&!game.divorced&&typeof pickPartnerDisplayName==='function'?pickPartnerDisplayName(game.partnerGender||'female'):'');
  let html='';
  if(game.married&&!game.divorced){
    const intim=game.spouseIntimacy!=null?game.spouseIntimacy:INTIMACY_INITIAL;
    const ps=game.partnerStats||{};
    const loc=typeof getSpouseLocationLabel==='function'?getSpouseLocationLabel():'';
    const genderLabel=game.partnerGender==='male'?'男':'女';
    const intimColor=game.divorced?'var(--muted)':(intim>=60?'var(--green)':intim>=0?'var(--yellow)':'var(--red)');
    const pStreak=typeof getCompanionAllnightStreak==='function'?getCompanionAllnightStreak():0;
    const catchUp=!!(game.daily&&game.daily.partnerCatchUpSleep&&game.daily.phase==='morning');
    const skipDays=typeof getCompanionMonthlyAbsenceCount==='function'?getCompanionMonthlyAbsenceCount():(game.companion&&game.companion.monthlyAbsenceCount)||0;
    const skipLim=typeof MONTHLY_ABSENCE_LIMIT!=='undefined'?MONTHLY_ABSENCE_LIMIT:4;
    html+='<div class="companion-hdr">'+(typeof partnerAvatarHtml==='function'?partnerAvatarHtml(game.partnerGender,true):'<span class="avatar">'+(game.partnerGender==='male'?'👨🏻':'👩🏻')+'</span>')+
      '<div><b>'+pn+'</b> · 配偶（'+genderLabel+'）<br>'+
      '<span style="font-size:.72rem;color:var(--muted)">📍 '+(loc||'—')+
      (game.longDistance?' · <span style="color:var(--orange)">异地</span>':'')+'</span>'+
      (catchUp?'<br><span style="font-size:.72rem;color:var(--blue)">😴 白天在家补觉</span>':'')+
      '<br><span style="font-size:.72rem;color:var(--orange)">通宵：'+(pStreak?'已连续未睡 '+pStreak+' 天':'未通宵')+'</span>'+
      (skipDays?'<br><span style="font-size:.72rem;color:var(--yellow)">本月旷工 '+skipDays+'/'+skipLim+' 天</span>':'')+
      '</div></div>';
    html+='<div class="companion-stats">'+
    '<div class="companion-stat"><label>亲密度</label><value style="color:'+intimColor+'">'+intim+'</value></div>'+
    '<div class="companion-stat"><label>肉体</label><value>'+(ps.body||0)+'</value></div>'+
    '<div class="companion-stat"><label>心智</label><value>'+(ps.mind||0)+'</value></div>'+
    '<div class="companion-stat"><label>精神</label><value>'+(ps.spirit||0)+'</value></div>'+
  '<div class="companion-stat"><label>三维合计</label><value>'+((ps.body||0)+(ps.mind||0)+(ps.spirit||0))+'</value></div>'+
    '</div>';
    const c=game.companion;
    if(c&&c.employed&&c.employment){
      const e=c.employment,j=game.market[e.jobIdx];
      const role=e.roleExtra?IMP_LABEL[e.importance]+'·'+ROLE_EXTRA[e.roleExtra]:IMP_LABEL[e.importance];
      const pay=e.roleExtra==='temp'?'周薪¥'+Math.round(e.annualPay/52).toLocaleString():'年薪¥'+e.annualPay.toLocaleString();
      html+='<div class="companion-emp"><b>'+(j?j.title:'未知岗位')+'</b> @ '+e.company.name+'<br>'+
        pay+' · '+TIER_LABEL[e.tier]+' · '+SCALE_LABEL[e.company.scale]+' · '+role+'</div>';
    }else if(c){
      html+='<div class="companion-emp" style="border-color:var(--border);background:var(--panel)"><span style="color:var(--muted)">当前待业 · 在 '+PLAYER_HOME_CITY+'</span></div>';
    }
    if(typeof renderSpouseFinanceCompanionHtml==='function')html+=renderSpouseFinanceCompanionHtml();
    html+='<div class="companion-section"><h4>关系</h4>'+
    '<div class="companion-row"><span>你聊骚累计</span><span>'+(game.flirtPeopleTotal||0)+' 人</span></div>'+
    '<div class="companion-row"><span>伴侣聊骚累计</span><span>'+(game.companionFlirtTotal||0)+' 次</span></div>'+
    (game.livingOffSpouse?'<div class="companion-row"><span style="color:var(--orange)">吃软饭中</span><span>每周亲密度-5</span></div>':'')+
    (game.partnerAffairActive?'<div class="companion-row"><span style="color:var(--red)">伴侣婚外情</span><span>进行中'+(game.partnerStdActive?' · 已感染性病':'')+'</span></div>':'')+
    (game.affairActive?'<div class="companion-row"><span style="color:var(--red)">你的婚外情</span><span>进行中</span></div>':'')+
    (game.stdActive?'<div class="companion-row"><span style="color:var(--orange)">你的性病</span><span>'+stdTreatmentStatusText()+'</span></div>':'')+
    (typeof cycleStatusCompanionRow==='function'?cycleStatusCompanionRow():'')+
    (typeof cycleStatusPlayerRow==='function'?cycleStatusPlayerRow():'')+
    (typeof renderDivorceProceedingsCompanionHtml==='function'?renderDivorceProceedingsCompanionHtml():'')+
    '<div style="margin-top:8px"><button class="btn" onclick="confirmPlayerDivorce()">主动离婚</button>'+
    '<span style="font-size:.65rem;color:var(--muted);margin-left:6px">保留房产·房贷¥'+DIVORCE_MORTGAGE_PAYMENT+'/月</span></div></div>';
  }else if(game.divorced){
    const ex=game.exPartnerName||pn||'前任';
  const exGender=game.exPartnerGender||game.partnerGender;
    html+='<div class="companion-hdr">'+(typeof partnerAvatarHtml==='function'?partnerAvatarHtml(exGender,true):'<span class="avatar">'+(exGender==='male'?'👨🏻':'👩🏻')+'</span>')+
      '<div><b>'+ex+'</b> · 前夫/前妻<br>'+
      '<span style="font-size:.72rem;color:var(--muted)">已离婚 · 可在通讯录查看</span></div></div>';
  }else{
    html+='<div style="color:var(--muted);padding:12px 0">单身，暂无配偶。</div>';
  }
  html+=familyChildStatusHtml();
  if(!game.pregnant&&!game.hasChildren&&!game.fertilityOrder&&game.procreateIntentWeek!==game.week)
    html+='<div class="companion-section" style="margin-top:8px"><div style="color:var(--muted);font-size:.72rem">暂无孩子。备孕/代孕/试管请在「消费」页操作。</div></div>';
  el.innerHTML=html;
}
function ensureConsumption(){if(!game)return null;if(!game.consumption)game.consumption=defaultConsumptionState();return game.consumption}
function inferCityFromCompany(co){
  if(!co)return PLAYER_HOME_CITY;
  const fromName=parseCityFromCompanyName(co.name);
  if(fromName)return fromName;
  if(co.city)return co.city;
  if(game&&game.companyById&&co.id&&game.companyById[co.id]&&game.companyById[co.id].city)return game.companyById[co.id].city;
  return PLAYER_HOME_CITY;
}
function getCompanyCity(co){return inferCityFromCompany(co)}
function isRemoteCompany(co){return getCompanyCity(co)!==PLAYER_HOME_CITY}
function syncPlayerLocation(){
  if(!game)return;
  if(game.employed&&game.employment&&game.employment.company)
    game.playerCity=getCompanyCity(game.employment.company);
  else game.playerCity=PLAYER_HOME_CITY;
}
function interviewSlotLabel(slotId){const s=INTERVIEW_SLOTS.find(x=>x.id===slotId);return s?s.label:slotId||''}
function interviewSlotOrder(slotId){const s=INTERVIEW_SLOTS.find(x=>x.id===slotId);return s?s.order:99}
function pickInterviewSlot(week,excludeId){
  const taken=new Set();
  (game.applications||[]).forEach(a=>{
    if(a.id===excludeId)return;
    if(a.status==='interview_confirmed'&&a.interviewWeek===week&&a.interviewSlot)taken.add(a.interviewSlot);
  });
  const avail=INTERVIEW_SLOTS.filter(s=>!taken.has(s.id));
  const pool=avail.length?avail:INTERVIEW_SLOTS;
  return pool[Math.floor(Math.random()*pool.length)].id;
}
function isInterviewSlotTaken(week,slotId,excludeId){
  return(game.applications||[]).some(a=>a.id!==excludeId&&a.status==='interview_confirmed'&&a.interviewWeek===week&&a.interviewSlot===slotId);
}
function interviewAttendBlockReason(app){
  if(!app||app.interviewHeld||game.week!==app.interviewWeek)return '';
  if(typeof _companionActor!=='undefined'&&_companionActor)return '';
  const d=game.daily||{};
  if(d.phase!=='morning')return '须在白天（日常·白天）参加面试';
  if(d.slotActivity==='work'||d.inOvertime)return '上班中无法面试';
  if(d.slotActivity==='out')return '外出占用中，无法面试';
  if(isInterviewOnline(app)){
    const target=interviewSlotHourTarget(interviewSlotOrder(app.interviewSlot));
    const used=d.slotHoursUsed||0;
    if(target<=used)return '该在线面试时段已过（白天已用'+used+'h，需至'+target+'h）';
    return '';
  }
  const myOrder=interviewSlotOrder(app.interviewSlot);
  const sameDay=(game.applications||[]).filter(a=>a.status==='interview_confirmed'&&a.interviewWeek===game.week);
  if(sameDay.some(a=>!isInterviewOnline(a)&&interviewSlotOrder(a.interviewSlot)<myOrder&&!a.interviewHeld))
    return '须先完成更早场次的线下面试';
  if((d.slotHoursUsed||0)>0)return '线下面试须白天空闲外出，不可先做其他事';
  return '';
}
function canAttendInterviewNow(app){
  if(!app||app.status!=='interview_confirmed'||app.interviewHeld)return false;
  if(game.week!==app.interviewWeek)return false;
  if(typeof _companionActor!=='undefined'&&_companionActor){
    if(isInterviewOnline(app))return true;
    const myOrder=interviewSlotOrder(app.interviewSlot);
    const sameDay=(game.applications||[]).filter(a=>a.status==='interview_confirmed'&&a.interviewWeek===game.week);
    return!sameDay.some(a=>interviewSlotOrder(a.interviewSlot)<myOrder&&!a.interviewHeld);
  }
  return!interviewAttendBlockReason(app);
}
function applyInterviewDayTimeCost(app){
  if(typeof _companionActor!=='undefined'&&_companionActor)return true;
  const d=typeof ensureDailyState==='function'?ensureDailyState():null;
  if(!d||d.phase!=='morning'){addLog('面试须在白天参加（日常·白天）','fail');return false}
  if(d.slotActivity==='work'||d.inOvertime){addLog('上班中无法参加面试','fail');return false}
  if(d.slotActivity==='out'){addLog('外出占用中，无法参加面试','fail');return false}
  if(isInterviewOnline(app)){
    const target=interviewSlotHourTarget(interviewSlotOrder(app.interviewSlot));
    const used=d.slotHoursUsed||0;
    if(target<=used){addLog('该在线面试时段已过（白天已用'+used+'h）','fail');return false}
    d.slotHoursUsed=target;
    return true;
  }
  if((d.slotHoursUsed||0)>0){addLog('线下面试须白天空闲外出，无法先做其他事再赶场','fail');return false}
  d.slotHoursUsed=SLOT_HOURS_TOTAL;
  d.slotActivity='out';
  return true;
}
function updateLongDistanceStatus(silent){
  if(!game)return;
  syncPlayerLocation();
  if(!game.married||game.divorced){game.longDistance=false;return}
  const remoteJob=!!(game.employed&&game.employment&&game.employment.company&&isRemoteCompany(game.employment.company));
  const was=!!game.longDistance;
  game.longDistance=remoteJob;
  if(!silent&&game.longDistance&&!was){
    const workCity=getCompanyCity(game.employment.company);
    addLog('💔 与伴侣异地（伴侣定居'+PLAYER_HOME_CITY+'·工作在'+workCity+'）· 每周+1压力','stress');
  }else if(!silent&&!game.longDistance&&was){
    addLog('💑 回到'+PLAYER_HOME_CITY+'工作，结束异地','info');
  }
}
function migrateLoadedGameState(slotIdx){
  if(!game)return;
  const slot=slotIdx!=null?slotIdx:(currentSlotIndex>=0?currentSlotIndex:-1);
  if(!game.portfolio||typeof game.portfolio!=='object')game.portfolio={};
  if(!Array.isArray(game.stocks)||!game.stocks.length){
    const seed=game.stockSeed!=null?game.stockSeed:stockSeedForSlot(slot>=0?slot:0);
    game.stockSeed=seed;
    game.stocks=initStocks(seed);
  }
  repairStockRefPrices(game.stocks);
  if(typeof migrateAllStockFloatHoldings==='function')migrateAllStockFloatHoldings();
  if(!game.ownedCars||!game.ownedCars.length)game.ownedCars=game.ownedCar?[game.ownedCar]:[];
  else if(game.ownedCar&&!game.ownedCars.includes(game.ownedCar))game.ownedCars.push(game.ownedCar);
  if(!game.ownedCar&&game.ownedCars.length)game.ownedCar=game.ownedCars[0];
  if(game.carPanelOpen==null)game.carPanelOpen=false;
  if(game.carSwitchMonthKey==null)game.carSwitchMonthKey=null;
  game.playerCity=game.playerCity||PLAYER_HOME_CITY;
  game.consumption=game.consumption||defaultConsumptionState();
  game.casinoCoupons=game.casinoCoupons||0;
  game.lifestyleSpent=game.lifestyleSpent||0;
  game.flirtPeopleTotal=game.flirtPeopleTotal||0;
  if(game.mobileAdFreeUntilWeek==null)game.mobileAdFreeUntilWeek=0;
  const c=game.consumption;
  if(c){
    if(c.scrollSessions==null)c.scrollSessions=0;
    if(c.svBoring==null)c.svBoring=0;
    if(c.svTrash==null)c.svTrash=0;
    if(c.svInteresting==null)c.svInteresting=0;
    if(c.dramaViews==null)c.dramaViews=0;
    if(c.flirtHot==null)c.flirtHot=0;
    if(c.flirtSilent==null)c.flirtSilent=0;
    if(c.flirtAwkward==null)c.flirtAwkward=0;
    if(c.mobileGames==null)c.mobileGames=0;
    if(c.mobileAds==null)c.mobileAds=0;
    delete c.shortVideoUsed;delete c.flirtUsed;delete c.mobileGameUsed;
  }
  game.ownsConsole=!!game.ownsConsole;
  game.ownsComputer=!!game.ownsComputer;
  game.parentsInheritanceSettled=!!game.parentsInheritanceSettled;
  game.parentsInheritanceAmount=game.parentsInheritanceAmount||0;
  if(!game.rouletteBets)game.rouletteBets=emptyRouletteBets();
  if(!game.casinoGame)game.casinoGame='dice';
  if(game.rouletteWheelRot==null)game.rouletteWheelRot=0;
  if(game.spectateRunning==null)game.spectateRunning=false;
  if(!game.spectatePhase)game.spectatePhase='idle';
  if(game.spectatePhaseEnd==null)game.spectatePhaseEnd=0;
  if(game.spectateManualBet==null)game.spectateManualBet=false;
  if(game.spectatePausedMs==null)game.spectatePausedMs=0;
  if(!game.spectatePauseKind)game.spectatePauseKind=null;
  if(game.spectateAiBets&&!game.spectateAis)game.spectateAis=[{name:'中神通',bets:game.spectateAiBets}];
  if(game.spectateAiBets)delete game.spectateAiBets;
  if(game.spectateAis==null)game.spectateAis=null;
  if(game.stealthJobSearch==null)game.stealthJobSearch=false;
  if(game.stealthSearchWeeks==null)game.stealthSearchWeeks=0;
  if(game.severanceBlacklistUntil==null)game.severanceBlacklistUntil=0;
  if(!game.severanceLitigation)game.severanceLitigation=null;
  if(game.spouseIntimacy==null)game.spouseIntimacy=INTIMACY_INITIAL;
  if(typeof restoreSwappedLifeFlags==='function')restoreSwappedLifeFlags(game,[]);
  if(typeof migrateDivorceBufferRestore==='function')migrateDivorceBufferRestore();
  if(game.divorceProceedings&&typeof repairDivorceBufferDeadline==='function')repairDivorceBufferDeadline();
  if(game.divorced){game.spouseIntimacy=0;if(game.companion)game.companion.spouseIntimacy=0}
  if(!game.contactLoans)game.contactLoans=[];
  if(typeof migrateSpouseFinance==='function')migrateSpouseFinance();
  if(typeof migrateFertility==='function')migrateFertility();
  if(typeof migrateMenstrualCycle==='function')migrateMenstrualCycle();
  if(typeof migrateArtifacts==='function')migrateArtifacts();
  if(!game.partnerDisplayName&&game.married&&!game.divorced)game.partnerDisplayName=pickPartnerDisplayName(game.partnerGender||'female');
  game.lastDateWeek=game.lastDateWeek||0;
  game.livingOffSpouse=!!game.livingOffSpouse;
  game.companionFlirtTotal=game.companionFlirtTotal||0;
  game.mortgageMonthlyOverride=game.mortgageMonthlyOverride||0;
  if(game.mortgageGoalReached==null)game.mortgageGoalReached=!!(game.mortgagePaidOff&&game.gameWon);
  game.procreateIntentWeek=game.procreateIntentWeek!=null?game.procreateIntentWeek:-1;
  game.pregnant=!!game.pregnant;
  if(game.pregnancyWeeksLeft==null)game.pregnancyWeeksLeft=0;
  if(game.pregnancyIntimacyNet==null)game.pregnancyIntimacyNet=0;
  if(!game.pregnant){game.pregnantSubject=null;game.pregnancyStartWeek=null}
  else if(typeof ensurePregnancyStartWeek==='function'){ensurePregnancyStartWeek();if(typeof syncPregnancyWeeksLeft==='function')syncPregnancyWeeksLeft()}
  if(game.imprisonedUntilWeek==null)game.imprisonedUntilWeek=0;
  if(game.outdoorAffairPregnancy==null)game.outdoorAffairPregnancy=false;
  if(game.partnerKnowsPlayerPregnant==null)game.partnerKnowsPlayerPregnant=false;
  if(game.pregnancyBioFather==null)game.pregnancyBioFather=game.pregnant?(game.outdoorAffairPregnancy?'other':'player'):null;
  if(game.pregnancyConceivedMarried==null)game.pregnancyConceivedMarried=!!game.pregnant;
  if(game.pendingChildCustody==null)game.pendingChildCustody=null;
  if(game.exPregnancyDisputed==null)game.exPregnancyDisputed=false;
  if(game.exOtherPregnancyAnnounced==null)game.exOtherPregnancyAnnounced=false;
  if(typeof ensureChildRecord==='function')ensureChildRecord();
  if(typeof syncChildRecordCompat==='function')syncChildRecordCompat();
  if(game.partnerAffairActive==null)game.partnerAffairActive=false;
  if(game.partnerNeglectPoints==null)game.partnerNeglectPoints=0;
  if(game.allnightStreak==null)game.allnightStreak=(game.daily&&game.daily.allnightStreak)||0;
  if(game.companionAllnightStreak==null)game.companionAllnightStreak=(game.daily&&game.daily.companionAllnightStreak)||0;
  if(typeof migrateOpeningJobEvent==='function')migrateOpeningJobEvent();
  if(game.partnerStdActive==null)game.partnerStdActive=false;
  if(game.stdActive==null)game.stdActive=false;
  if(game.stdWeeksInfected==null)game.stdWeeksInfected=game.stdWeeksLeft||0;
  if(game.stdTreatmentVisits==null)game.stdTreatmentVisits=0;
  if(game.stdLastTreatmentWeek==null)game.stdLastTreatmentWeek=-1;
  if(game.snackStock==null)game.snackStock=0;
  if(game.snackReboundPortions==null)game.snackReboundPortions=game.snackReboundDay?1:0;
  if(game.partnerSnackReboundPortions==null)game.partnerSnackReboundPortions=0;
  if(game.daily){
    if(game.daily.snackPortionsToday==null)game.daily.snackPortionsToday=game.daily.hadSnackToday?1:0;
    if(game.daily.partnerSnackPortionsToday==null)game.daily.partnerSnackPortionsToday=0;
  }
  if(typeof migrateAffairContacts==='function')migrateAffairContacts();
  if(typeof migratePlayerCompanySafe==='function')migratePlayerCompanySafe();
  else if(typeof migratePropertyCompany==='function')migratePropertyCompany();
  if(game.playerCompany&&game.playerCompany.subsidiaries){
    (game.playerCompany.subsidiaries||[]).forEach(function(s){
      if(typeof migrateSubsidiaryGovernance==='function')migrateSubsidiaryGovernance(s);
    });
  }
  if(game.playerCompany&&typeof migratePlayerCompanyIpo==='function')migratePlayerCompanyIpo(game.playerCompany);
  if(!game.activeCompanyContext)game.activeCompanyContext='hq';
  else if(game.activeCompanyContext!=='hq'){
    const ok=(game.playerCompany&&game.playerCompany.subsidiaries||[]).some(function(s){return s.companyId===game.activeCompanyContext});
    if(!ok)game.activeCompanyContext='hq';
  }
  if(!game.financeSubTab)game.financeSubTab='stock';
  if(typeof migrateDreamSystem==='function')migrateDreamSystem();
  if(typeof migrateCampusRecruitment==='function')migrateCampusRecruitment();
  if(typeof migrateContactsSystem==='function')migrateContactsSystem();
  if(typeof migrateSocialCircles==='function')migrateSocialCircles();
  if(typeof migrateFamilyCircles==='function')migrateFamilyCircles();
  syncSpouseIntimacyToCompanion();
  if(game.employed&&game.employment){
    if(typeof ensureEmploymentCompanyLinked==='function')ensureEmploymentCompanyLinked();
    else if(game.employment.companyId&&game.companyById&&game.companyById[game.employment.companyId]){
      game.employment.company=game.companyById[game.employment.companyId];
      delete game.employment.companyId;
    }else if(game.employment.company&&game.employment.company.id&&game.companyById){
      game.employment.company=game.companyById[game.employment.company.id]||game.employment.company;
    }
    if(game.employment.company&&!game.employment.company.city)
      game.employment.company.city=inferCityFromCompany(game.employment.company);
    if(!game.employment.otProfile){
      const job=game.market[game.employment.jobIdx];
      game.employment.otProfile=legacyOvertimeProfile(game.employment.tier,game.employment.importance,game.employment.roleExtra,game.employment.company,job);
    }
  }
  if(game.pendingHire&&game.pendingHire.offer)ensureOfferOtProfile(game.pendingHire.offer,game.market[game.pendingHire.jobIdx]);
  (game.offers||[]).forEach(o=>{if(o.offer)ensureOfferOtProfile(o.offer,game.market[o.jobIdx])});
  (game.applications||[]).forEach(a=>{if(a.offer)ensureOfferOtProfile(a.offer,game.market[a.jobIdx])});
  if(game.referralOpportunity&&game.referralOpportunity.positions){
    game.referralOpportunity.positions.forEach(p=>{if(p.offer)ensureOfferOtProfile(p.offer,game.market[p.jobIdx])});
  }
  if(!game.pendingHire)game.pendingHire=null;
  (game.offers||[]).forEach(o=>{
    if(!o.stage)o.stage=o.contractSigned?'waiting':'negotiate';
    if(o.negotiated==null)o.negotiated=false;
    if(o.finalPay==null)o.finalPay=o.offer?o.offer.annualPay:0;
    if(o.contractSigned==null)o.contractSigned=false;
  });
  delete game.casinoWatchMode;
  if(game.casinoHistory&&game.casinoHistory.dice){
    const z=game.casinoHistory.dice.zones||{};
    BET_ZONES.forEach(k=>{if(!z[k])z[k]={hits:0}});
    game.casinoHistory.dice.zones=z;
  }
  ensureCasinoHistory();
  (game.applications||[]).forEach(a=>{
    if(a.offer&&a.offer.company){
      const city=inferCityFromCompany(a.offer.company);
      const cityChanged=a.offer.company.city&&a.offer.company.city!==city;
      a.offer.company.city=city;
      if(cityChanged&&(a.status==='interview_invite'||a.status==='interview_confirmed'))setupInterviewMode(a);
    }
    if((a.status==='interview_invite'||a.status==='interview_confirmed')&&a.interviewWeek!=null&&!a.interviewSlot)
      a.interviewSlot=pickInterviewSlot(a.interviewWeek,a.id);
    if((a.status==='interview_invite'||a.status==='interview_confirmed')&&!a.interviewMode)
      setupInterviewMode(a);
  });
  updateLongDistanceStatus(true);
  if(typeof migrateLifespanSystem==='function')migrateLifespanSystem();
  if(typeof syncWorkplaceCirclesFromEmployment==='function')syncWorkplaceCirclesFromEmployment();
  if(typeof promptPlayerCompanyNameIfNeeded==='function')promptPlayerCompanyNameIfNeeded();
  if(!game.companion)game.companion=createCompanionState(game.playerEducation,game.playerSchool);
  else game.companion=restoreCompanionActor(game.companion,game.companyById);
  if(game.companion){
    if(game.companion.secretStash==null)initPartnerSecretStash(game.companion,game.stocks,(game.stockSeed||game.week)*991+17);
    else if(game.companion.secretStashCash==null){
      game.companion.secretStashCash=game.companion.secretStash||0;
      game.companion.secretStashPortfolio=game.companion.secretStashPortfolio||{};
    }
    if(game.companion.secretStashRevealed==null)game.companion.secretStashRevealed=false;
    if(game.married&&!game.divorced&&game.companion.secretStashRevealed)game.companion.secretStashRevealed=false;
    if(!game.divorced&&!game.companion.employed&&!game.companion.employment)
      initCompanionStartingEmployment(game.companion,game.market,game.companion.playerEducation||game.playerEducation,game.jobCompanies,(game.stockSeed||0)*19+77);
  }
  migrateDailyState();
  (game.companion.applications||[]).forEach(a=>{
    if(a.offer&&a.offer.company){
      const city=inferCityFromCompany(a.offer.company);
      const cityChanged=a.offer.company.city&&a.offer.company.city!==city;
      a.offer.company.city=city;
      if(cityChanged&&(a.status==='interview_invite'||a.status==='interview_confirmed'))setupInterviewMode(a);
    }
    if((a.status==='interview_invite'||a.status==='interview_confirmed')&&a.interviewWeek!=null&&!a.interviewSlot)
      a.interviewSlot=pickInterviewSlot(a.interviewWeek,a.id);
    if((a.status==='interview_invite'||a.status==='interview_confirmed')&&!a.interviewMode)
      setupInterviewMode(a);
  });
  if(typeof ensureCompanionEmploymentCompanyLinked==='function')ensureCompanionEmploymentCompanyLinked();
  else if(game.companion&&game.companion.employment&&game.companion.employment.companyId){
    const compCo=game.companyById&&game.companyById[game.companion.employment.companyId];
    if(compCo){
      game.companion.employment.company=compCo;
      delete game.companion.employment.companyId;
    }
  }
  syncInviteExpiryState();
  (game.inbox||[]).forEach(it=>{
    if(it.type!=='interview')return;
    const app=game.applications.find(a=>a.id===it.id);
    if(!app)return;
    if(['invite_expired','conflict_expired','missed','declined'].includes(app.status))
      markInboxInvalid(it,inboxExpiredLabel(app,it));
    else if(app.status==='interview_invite'&&app.interviewWeek!=null&&game.week>=app.interviewWeek){
      app.status='invite_expired';
      markInboxInvalid(it,'未确认，已失效');
    }else if(app.status==='missed'&&!it.invalid)
      markInboxInvalid(it,'已错过');
  });
}
function getPlayerAssets(){
  if(!game)return 0;
  let a=game.cash||0;
  (game.stocks||[]).forEach(s=>{
    const sh=(game.portfolio&&game.portfolio[s.id])||0;
    a+=sh*s.price;
  });
  return a;
}
function randInRange(lo,hi){
  if(hi<=lo)return Math.round(lo);
  return Math.round(lo+Math.random()*(hi-lo));
}
function samplePositiveInheritance(){
  const r=Math.random();
  const pos=1-INHERITANCE_NEGATIVE_RATE;
  let acc=0;
  for(const b of INHERITANCE_POSITIVE_RATES){
    acc+=b.share/pos;
    if(r<acc)return randInRange(b.min,b.max);
  }
  const last=INHERITANCE_POSITIVE_RATES[INHERITANCE_POSITIVE_RATES.length-1];
  return randInRange(last.min,last.max);
}
function sampleNegativeInheritanceDebt(assets){
  const cap=assets<=INHERITANCE_ASSET_GATE?INHERITANCE_MILD_DEBT_CAP:INHERITANCE_MAX;
  const r=Math.random();
  let acc=0;
  const bands=INHERITANCE_POSITIVE_RATES.filter(b=>b.min<cap);
  for(const b of bands){
    acc+=b.share;
    if(r<acc)return randInRange(b.min,Math.min(b.max,cap));
  }
  return randInRange(0,cap);
}
function settleParentsInheritance(silent){
  if(!game||game.parentsInheritanceSettled)return;
  game.parentsInheritanceSettled=true;
  game.livingOffParents=false;
  const assets=getPlayerAssets();
  let amount;
  if(Math.random()<INHERITANCE_NEGATIVE_RATE){
    amount=-sampleNegativeInheritanceDebt(assets);
    if(assets<=INHERITANCE_ASSET_GATE&&amount<-INHERITANCE_MILD_DEBT_CAP)amount=-INHERITANCE_MILD_DEBT_CAP;
  }else amount=samplePositiveInheritance();
  const legacy=game.inheritancePending||0;
  if(legacy>0){
    amount+=legacy;
    game.inheritancePending=0;
  }
  game.parentsInheritanceAmount=amount;
  game.cash+=amount;
  if(amount>0){checkCashStressMilestones();ledgerAddIncome('inheritance','📜','父母遗产',amount)}
  else if(amount<0)ledgerAddExpense('inheritance','📜','父母债务',Math.abs(amount),false);
  if(silent)return;
  const legacyNote=legacy>0?'（含祖辈遗产 ¥'+legacy.toLocaleString()+'）':'';
  if(amount>0)addLog('📜 父母离世：遗产 ¥'+amount.toLocaleString()+legacyNote+' 已入账','success');
  else if(amount<0){
    addLog('📜 父母离世：留下债务 ¥'+Math.abs(amount).toLocaleString()+'（已从账户扣除）','fail');
    markLifeStressEvent('inheritanceDebt','父母债务 ');
  }else addLog('📜 父母离世：未留下财产','info');
  if(typeof syncParentsContact==='function')syncParentsContact();
}
function tickWeeklyConsumption(){
  const c=ensureConsumption();
  if(!c)return;
  Object.assign(c,defaultConsumptionState());
}
function spendCash(amt,label){
  if(game.cash<amt){addLog(label+' 需 ¥'+amt+'，余额不足','fail');return false}
  game.cash-=amt;game.lifestyleSpent=(game.lifestyleSpent||0)+amt;
  ledgerAddExpense('lifestyle','🛒',label,amt,false);
  return true;
}
function getYear(week){const d=getGameStartDate();d.setDate(d.getDate()+week*7);return d.getFullYear()}
function getPlayerAge(){const base=game&&game.startAge!=null?game.startAge:START_AGE;return base+Math.floor((game.week||0)/52)}
function getSelectedApps(){
  const m=getApplyMethod();
  if(m!=='app')return [];
  return [...document.querySelectorAll('input[name="appPick"]:checked')].map(e=>e.value);
}
function aiMultiplier(week){const y=getYear(week)-2024;if(y<=0)return .4;if(y<=5)return .4+y*.12;if(y<=15)return 1+(y-5)*.1;return 2+(y-15)*.06}

function minPayRatioForJob(medianPay){
  const p=Math.max(medianPay,25000);
  const t=Math.min(1,Math.max(0,(Math.log10(p)-4.35)/1.15));
  return 1-t*0.5;
}
function maxPayRatioForJob(medianPay,tier,importance){
  if(tier==='high'&&importance==='high')return Math.min(80,8+Math.log10(Math.max(medianPay,50000))*4);
  if(importance==='high')return tier==='high'?18:6;
  if(importance==='mid')return tier==='high'?4:2.2;
  return tier==='low'?1.15:1.35;
}
function calcAnnualPay(job,tier,importance){
  const m=job.pay;
  const mult=payMultForOffer(tier,importance,job.idx*31+(game?game.week:0)*17+tier.charCodeAt(0));
  let pay=Math.round(m*mult);
  const minR=minPayRatioForJob(m), maxR=maxPayRatioForJob(m,tier,importance);
  pay=Math.max(Math.round(m*minR),Math.min(Math.round(m*maxR),pay));
  if(tier==='high'&&importance==='high')pay=Math.min(MAX_SALARY,pay);
  return pay;
}
function openingRoleExtra(job,co,imp,r){
  if(isManualJob(job))return r()<(co.tier==='low'?0.48:0.32)?'temp':null;
  let internP=imp==='low'?0.38:imp==='mid'?0.14:0.05;
  if(co.tier==='low')internP+=0.22;
  else if(co.tier==='mid'&&imp==='low')internP+=0.12;
  if(job.pay>=200000)internP+=0.08;
  else if(job.pay<60000)internP*=0.75;
  internP=Math.min(0.72,internP);
  if(r()<internP)return 'intern';
  if(co.tier==='low'&&imp==='low'&&r()<0.25)return 'temp';
  return null;
}

function getSchoolTierFactor(tier){
  const s=SCHOOL_TIER_FACTOR[game.playerSchool]||SCHOOL_TIER_FACTOR.normal;
  return s[tier]||1;
}

function getEduTierFactor(tier){
  const e=EDU_TIER_FACTOR[game.playerEducation]||EDU_TIER_FACTOR['本科'];
  return e[tier]||1;
}

function getAgeHireMultiplier(){
  const a=getPlayerAge();
  if(a>=45)return 0.2;
  if(a>=40)return 0.45;
  if(a>=35)return 0.68;
  return 1;
}

function getAgeLimit(job){
  return AGE_LIMIT_CAT[job.category]||50;
}

function isOverAgeLimit(job){
  return getPlayerAge()>getAgeLimit(job);
}

function getUpwardReferralExp(pastTier,pastImp,targetTier,targetImp){
  const pt=TIER_ORDER.indexOf(pastTier),tt=TIER_ORDER.indexOf(targetTier);
  const pi=IMP_ORDER.indexOf(pastImp),ti=IMP_ORDER.indexOf(targetImp);
  const tierUp=pt-tt;
  if(tierUp<=0)return 0;
  if(pi===2&&ti===2&&tierUp===1)return 3;
  if(pi===2&&ti===2&&tierUp===2)return 4;
  if(pi===0&&ti===0&&tierUp===2)return 9;
  if(pi===0&&ti===2&&tierUp===2)return 9;
  return tierUp*3+Math.max(0,ti-pi)*3;
}
function downgradeTier(t,s){return TIER_ORDER[Math.min(2,TIER_ORDER.indexOf(t)+s)]}
function upgradeImp(i,s){return IMP_ORDER[Math.min(2,IMP_ORDER.indexOf(i)+s)]}
function getSwitchType(){const el=document.querySelector('input[name="switchType"]:checked');return el?el.value:'normal'}
function getApplyMethod(){const el=document.querySelector('input[name="applyMethod"]:checked');return el?el.value:'app'}
function onApplyConfigChange(){updateHeadhunterOption();updateAppSubscriptionLabels();updateOfferPreview();updateButtons()}
function isAppSubscribed(app){return game&&((game.appSubscriptions[app]||0)>game.week)}
function getAppRenewalCost(apps){if(!apps||!apps.length)return 0;return apps.filter(a=>!isAppSubscribed(a)).length*APP_COST_EACH}
function activateAppSubscriptions(apps){
  apps.forEach(a=>{
    if(isAppSubscribed(a))return;
    const base=Math.max(game.week,game.appSubscriptions[a]||0);
    game.appSubscriptions[a]=base+APP_SUB_WEEKS;
  });
}
function updateAppSubscriptionLabels(){
  document.querySelectorAll('.app-sub-hint').forEach(el=>{
    const app=el.dataset.app;
    if(!game){el.textContent='';return}
    const exp=game.appSubscriptions[app];
    if(exp>game.week)el.innerHTML='<span style="color:var(--green)">已开通至 '+getDateStr(exp)+' · 不自动续费</span>';
    else el.innerHTML='<span style="color:var(--yellow)">未开通/已到期·¥'+APP_COST_EACH+'/月 · 需手动续费</span>';
  });
}
function hasSeniorWorkExperience(){
  const roles=[];
  if(game.employed&&game.employment)roles.push({tier:game.employment.tier,importance:game.employment.importance});
  (game.careerHistory||[]).forEach(h=>roles.push({tier:h.tier,importance:h.importance}));
  return roles.some(r=>(r.importance==='mid'||r.importance==='high')||(r.tier==='high'||r.tier==='mid'));
}
function canUseHeadhunter(){
  if(!game)return false;
  if(game.playerSchool==='c9')return true;
  return hasSeniorWorkExperience();
}
function updateHeadhunterOption(){
  if(!game)return;
  const ok=canUseHeadhunter();
  const radio=document.getElementById('headhunterRadio');
  const hint=document.getElementById('headhunterLockHint');
  if(radio)radio.disabled=!ok;
  if(hint)hint.textContent=ok?'':'（需C9/常春藤，或曾任专家/总监，或在头部/重点企业任职）';
  if(!ok&&radio&&radio.checked){
    const app=document.querySelector('input[name="applyMethod"][value="app"]');
    if(app)app.checked=true;
  }
}
function generateReferralOpportunity(){
  const eligible=game.market.map((j,i)=>i).filter(i=>{
    const j=game.market[i];
    return canApplyJob(j)&&!isOverAgeLimit(j);
  });
  if(!eligible.length)return null;
  const count=Math.random()<0.12?2:1;
  const positions=[], used=new Set();
  for(let n=0;n<count;n++){
    let ji=eligible[Math.floor(Math.random()*eligible.length)];
    for(let t=0;t<12&&used.has(ji);t++)ji=eligible[Math.floor(Math.random()*eligible.length)];
    if(used.has(ji))continue;
    used.add(ji);
    const job=game.market[ji];
    let tier=job.heatPct>=112?'high':job.heatPct>=102?'mid':'low';
    const co=pickCompany(ji,tier);
    const r=seededR(ji*31+game.week*17+n);
    const openings=genOpeningsForCompany(job,co,r);
    const op=openings[Math.floor(r()*openings.length)];
    const offer={company:co,tier:co.tier,importance:op.importance,annualPay:op.pay,roleExtra:op.roleExtra,
      welfare:op.welfare,otProfile:op.otProfile,startDelayWeeks:op.startDelayWeeks,planned:op.planned,
      newToIndustry:!game.industryExperience[job.category],
      eduGap:eduGapBetween(job.education,game.playerEducation),
      };
    positions.push({uid:'REF'+ji+'_'+co.id+'_'+n,jobIdx:ji,jobTitle:job.title,category:job.category,offer,
      referrer:REFERRER_NAMES[Math.floor(Math.random()*REFERRER_NAMES.length)],
      relation:REFERRER_RELATIONS[Math.floor(Math.random()*REFERRER_RELATIONS.length)]});
  }
  return positions.length?{week:game.week,positions}:null;
}
function rollReferralChance(){
  if(!game)return;
  game.referralOpportunity=null;
  let p=0.03;
  if(game.married&&!game.divorced)p+=0.015;
  if((game.careerHistory||[]).length)p+=0.01;
  if(getBestHighRole())p+=0.015;
  if(Math.random()<Math.min(0.07,p))game.referralOpportunity=generateReferralOpportunity();
  updateReferralButton();
  updateHeadhunterOption();
}
function updateReferralButton(){
  const btn=document.getElementById('btnReferral');
  if(!btn)return;
  const show=game&&game.referralOpportunity&&!actionDone&&!game.casinoActive&&!game.marketActive;
  btn.style.display=show?'inline-block':'none';
  btn.disabled=!show;
}
function renderReferralRow(item,checked){
  const o=item.offer;
  const imp=o.roleExtra?IMP_LABEL[o.importance]+'·'+ROLE_EXTRA[o.roleExtra]:IMP_LABEL[o.importance];
  const pay=formatOfferPay(o);
  const start=o.planned?'<span style="color:var(--blue)">预定招聘</span> · 入职约'+o.startDelayWeeks+'周后':'上岗约'+(o.startDelayWeeks||4)+'周内';
  return '<label class="company-row picked"><input type="radio" name="referralPick" class="referral-pick" data-uid="'+item.uid+'"'+(checked?' checked':'')+'>'+
    '<div style="flex:1"><b>'+o.company.name+'</b> '+fmtCompanyBadge(o.company)+' · <b>'+imp+'</b>'+(o.planned?' <span style="color:var(--blue);font-size:.68rem">预定</span>':'')+'<br>'+
    '招：'+item.jobTitle+' · '+pay+' · '+start+' · '+formatListingInterviewHint(o)+'<br>'+
    '<span style="color:var(--accent)">介绍人：'+item.referrer+'（'+item.relation+'）</span><br>'+
    '<span style="color:var(--muted)">'+o.welfare+'</span></div></label>';
}
function openReferralModal(){
  if(!game||!game.referralOpportunity||actionDone||game.casinoActive||game.marketActive)return;
  const opp=game.referralOpportunity;
  document.getElementById('referralModalDesc').textContent='本周有 '+opp.positions.length+' 个内推岗位，介绍人愿帮你递简历（免费，回复更快）。';
  document.getElementById('referralModalList').innerHTML=opp.positions.map((item,i)=>renderReferralRow(item,i===0)).join('');
  document.getElementById('referralModal').classList.remove('hidden');
}
function closeReferralModal(){
  document.getElementById('referralModal').classList.add('hidden');
}
function confirmReferralApply(){
  if(!game||!game.referralOpportunity||actionDone)return;
  const picked=document.querySelector('input[name="referralPick"]:checked');
  if(!picked){addLog('请选择一个内推岗位','fail');return}
  const item=game.referralOpportunity.positions.find(p=>p.uid===picked.dataset.uid);
  if(!item){addLog('内推岗位无效','fail');return}
  const id='ref_'+game.week+'_'+Math.floor(Math.random()*9999);
  markStealthJobSearch();
  const replyWeek=calcApplicationReplyWeek(item.offer,game.week,item.jobIdx);
  game.applications.push({
    id,jobIdx:item.jobIdx,offer:{...item.offer,method:'referral'},
    status:'pending',applyWeek:game.week,replyWeek,planned:!!item.offer.planned,
    interviewWeek:null,resultWeek:null,viaReferral:true,method:'referral',resumeCostLabel:'内推·'+item.referrer
  });
  game.totalApplications++;
  game.appliedCategories[item.category]=true;
  const refNote=item.offer.planned?'（预定招聘 · 预计 '+getDateStr(replyWeek)+' 公布筛选结果）':'';
  addLog('🤝 通过 '+item.referrer+'（'+item.relation+'）内推投递【'+item.jobTitle+'】@'+item.offer.company.name+refNote,'info');
  updateLongDistanceStatus();
  game.referralOpportunity=null;
  closeReferralModal();
  const inDailyJob=typeof currentTab!=='undefined'&&currentTab==='job';
  if(inDailyJob&&typeof dailySpendJobHours==='function'){
    if(!dailySpendJobHours(typeof JOB_REFERRAL_H!=='undefined'?JOB_REFERRAL_H:4,'🤝 内推投递 -'+(typeof JOB_REFERRAL_H!=='undefined'?JOB_REFERRAL_H:4)+'h')){if(typeof refreshJobHuntUi==='function')refreshJobHuntUi();updateUI();return}
    renderInterviewCalendar();if(typeof refreshJobHuntUi==='function')refreshJobHuntUi();updateUI();
    return;
  }
  actionDone=true;
  finishWeek();
  renderInterviewCalendar();
}

function getResumeCost(){
  const m=getApplyMethod();
  if(m==='market') return {upfront:200,onSuccess:0,label:'线下人才市场'};
  if(m==='app'){
    const apps=getSelectedApps();
    const active=apps.length?apps:['boss'];
    const renewCost=getAppRenewalCost(active);
    const label=active.map(a=>JOB_APPS[a]).join('+');
    return {upfront:renewCost,onSuccess:0,label,apps:active,renewApps:active.filter(a=>!isAppSubscribed(a))};
  }
  return {upfront:0,onSuccess:0,label:'猎头',isHeadhunter:true};
}
function scoreListingForApps(job,co,importance,apps){
  if(!apps||!apps.length)return 1;
  const brain=!isManualJob(job);
  let bonus=0;
  apps.forEach(a=>{
    const p=APP_PREFERRED[a]; if(!p)return;
    if(p.brainPrefer&&brain)bonus+=0.35;
    if(p.manualPrefer&&!brain)bonus+=0.35;
    if(p.tierPrefer.includes(co.tier))bonus+=0.3;
    if(p.execPrefer&&importance==='high')bonus+=0.2;
  });
  return 1+bonus/apps.length;
}
function getAppChannelMult(job,tier,apps,importance){
  if(!apps||!apps.length)return 1;
  const brain=!isManualJob(job);
  let sum=0;
  apps.forEach(a=>{
    const p=APP_PREFERRED[a];
    if(!p){sum+=1;return;}
    let m=1;
    if(p.brainPrefer&&brain)m+=0.14;
    if(p.manualPrefer&&!brain)m+=0.14;
    if(p.tierPrefer.includes(tier))m+=0.12;
    if(p.execPrefer&&importance==='high')m+=0.1;
    sum+=m;
  });
  return Math.min(1.28,sum/apps.length);
}

function isManualJob(job){return MANUAL_CATS.includes(job.category)&&job.exposure<=3}
function playerStress(){
  const v=Number(game?.familyStress);
  return Number.isFinite(v)?Math.max(0,v):0;
}
function normalizePlayerStress(){
  if(!game)return;
  game.familyStress=playerStress();
}
function isStressMindBlocked(){return playerStress()>=STRESS_MIND_BLOCK}
function isStressMad(){return playerStress()>=STRESS_MAD}
function canPlayerWorkWeek(){return !isStressMad()}
function canApplyJobByStress(job){
  if(!job)return false;
  if(isStressMindBlocked()&&!isManualJob(job))return false;
  return true;
}
function canApplyJob(job){
  if(game.onWelfare&&!game.disabled)return isManualJob(job)&&canApplyJobByStress(job);
  return canApplyJobByStress(job);
}

function pickCompany(jobIdx,tier){
  const pool=(game.jobCompanies&&game.jobCompanies[jobIdx])||[];
  const filtered=pool.filter(c=>c.tier===tier);
  return filtered[Math.floor(Math.random()*filtered.length)]||pool[Math.floor(Math.random()*pool.length)]||game.companyAll[0];
}
function fmtCompanyBadge(co){
  return '<span class="badge badge-tier-'+co.tier[0]+'">'+TIER_LABEL[co.tier]+'</span> <span class="badge badge-scale-'+co.scale[0]+'">'+SCALE_LABEL[co.scale]+'</span>';
}

function computeOffer(job,opts={}){
  const {preferSmaller=false,isSwitch=false}=opts;
  const eduGap=eduGapBetween(job.education,game.playerEducation);
  const newToIndustry=!game.industryExperience[job.category];
  const weeks=game.industryExperience[job.category]||0;
  let tier=job.heatPct>=112?'high':job.heatPct>=102?'mid':'low';
  if(game.playerSchool==='c9'&&tier==='low'&&!isSwitch)tier='mid';
  if(game.playerSchool==='985'&&tier==='high'&&!isSwitch)tier='mid';
  if(game.playerSchool==='none'&&tier!=='low'&&!isSwitch)tier='low';
  if(newToIndustry)tier=downgradeTier(tier,1);
  if(eduGap>=1)tier=downgradeTier(tier,eduGap);
  if(eduGap>=2)tier='low';
  if(preferSmaller&&isSwitch)tier='low';
  let importance='low';
  if(newToIndustry||weeks<26)importance='low';
  else if(preferSmaller&&isSwitch&&tier==='low')importance=upgradeImp(importance,1);
  else if(weeks>156&&!newToIndustry&&importance==='low')importance='low';
  if(eduGap>=1&&newToIndustry){importance='low';tier=downgradeTier(tier,1)}
  const company=pickCompany(job.idx,tier);
  const annualPay=calcAnnualPay(job,tier,importance);
  return {company,tier,importance,annualPay,newToIndustry,eduGap,preferSmaller};
}
function seededR(seed){return seededRand(seed)}
function genOpeningsForCompany(job,co,r){
  const openings=[];
  const imps=['low','mid','high'];
  const weights={low:0.8,mid:0.15,high:0.05};
  imps.forEach(imp=>{
    if(r()>weights[imp]+0.15)return;
    const roleExtra=openingRoleExtra(job,co,imp,r);
    const pay=calcAnnualPay(job,co.tier,imp);
    let startDelay,planned;
    if(roleExtra==='temp'){
      startDelay=0;planned=false;
    }else if(co.tier==='high'&&(imp==='high'||imp==='mid')){
      if(r()<0.55){
        planned=true;
        startDelay=Math.floor(22+r()*10);
      }else{
        planned=false;
        startDelay=Math.floor(2+r()*10);
      }
    }else if(co.tier==='mid'&&imp!=='low'&&r()<0.28){
      planned=true;
      startDelay=Math.floor(18+r()*12);
    }else{
      planned=false;
      startDelay=Math.floor(1+r()*10);
    }
    const wf=buildPositionWelfare(co.tier,imp,roleExtra,co,job,r);
    openings.push({importance:imp,roleExtra,pay,welfare:wf.welfare,otProfile:wf.otProfile,startDelayWeeks:startDelay,planned});
  });
  if(!openings.length){
    const wf=buildPositionWelfare(co.tier,'low',isManualJob(job)&&r()<0.4?'temp':null,co,job,r);
    openings.push({importance:'low',roleExtra:isManualJob(job)&&r()<0.4?'temp':null,
      pay:calcAnnualPay(job,co.tier,'low'),welfare:wf.welfare,otProfile:wf.otProfile,startDelayWeeks:Math.floor(1+r()*8),planned:false});
  }
  return openings;
}
function tierImpGap(offer){
  const eduGap=offer.eduGap||0;
  const tierPen=offer.tier==='high'?2:offer.tier==='mid'?1:0;
  const impPen=IMP_ORDER.indexOf(offer.importance);
  return tierPen+impPen+eduGap;
}
function companyProcessDelay(offer,job,kind){
  const co=offer.company;
  const jobAi=job?job.exposure:5;
  let base=0;
  if(co.scale==='large')base+=1.5+Math.random()*2.5;
  else if(co.scale==='medium')base+=0.8+Math.random()*1.5;
  else base+=Math.random()*0.8;
  if(co.tier==='high')base+=0.5+Math.random()*1.5;
  else if(co.tier==='low')base-=0.3;
  if(offer.importance==='high'&&co.tier==='low')base-=1.2+Math.random()*0.8;
  else if(offer.importance==='high'&&co.scale==='large')base+=1+Math.random()*1.5;
  if(offer.annualPay>=600000&&Math.random()<0.5)base+=1+Math.random()*2;
  if(jobAi>=7)base+=0.3+Math.random()*0.7;
  if(co.scale==='small'&&co.tier==='low'&&Math.random()<0.35)base=Math.max(0,base-2);
  if(kind==='screen')return Math.max(1,Math.min(3,1+Math.floor(Math.random()*2)+Math.floor(base*0.3)));
  if(kind==='interviewSchedule')return Math.max(1,Math.min(16,1+Math.floor(Math.random()*3)+Math.floor(base*1.2)));
  if(kind==='hiringResult')return Math.max(1,Math.min(12,1+Math.floor(Math.random()*3)+Math.floor(base)));
  if(kind==='start'){
    if(offer.roleExtra==='temp')return 0;
    if(offer.planned&&offer.startDelayWeeks)return Math.max(1,offer.startDelayWeeks-Math.floor(Math.random()*3));
    if(co.scale==='small'&&Math.random()<0.35)return Math.floor(Math.random()*2);
    return Math.max(1,Math.min(20,1+Math.floor(Math.random()*3)+Math.floor(base*1.1)));
  }
  return 2;
}
function calcApplicationReplyWeek(offer,applyWeek,jobIdx){
  const job=game&&game.market&&jobIdx!=null?game.market[jobIdx]:null;
  if(!offer.planned)return applyWeek+companyProcessDelay(offer,job,'screen');
  const lead=offer.startDelayWeeks||24;
  const screenAt=Math.max(3,Math.floor(lead*0.28+companyProcessDelay(offer,job,'screen')));
  return applyWeek+Math.min(screenAt,Math.max(3,lead-4));
}
function interviewCityForApp(app){return getCompanyCity(app.offer.company)}
function isInterviewOnline(app){return app&&app.interviewMode==='online'}
function getInterviewDistanceTier(city){
  if(city===PLAYER_HOME_CITY)return 'local';
  if(NEAR_CITIES.includes(city))return 'near';
  return 'far';
}
function isFarInterviewCity(city){return getInterviewDistanceTier(city)==='far'}
function isMorningInterviewSlot(slot){return interviewSlotOrder(slot)<2}
function rollInterviewMode(offer){
  const co=offer.company;
  let p=0.12;
  if(co.scale==='small')p+=0.38;
  else if(co.scale==='medium')p+=0.18;
  else p-=0.05;
  if(offer.importance==='low')p+=0.32;
  else if(offer.importance==='mid')p+=0.12;
  else p-=0.08;
  if(co.tier==='low')p+=0.08;
  p=Math.min(0.88,Math.max(0.04,p));
  return Math.random()<p?'online':'onsite';
}
function calcInterviewAttendanceCost(app,randomizeAcc){
  if(isInterviewOnline(app))return {cost:0,label:'在线面试（免费）',needsAccommodation:false};
  const city=interviewCityForApp(app);
  const tier=getInterviewDistanceTier(city);
  if(tier==='local')return {cost:INTERVIEW_LOCAL_COST,label:'同城现场 ¥'+INTERVIEW_LOCAL_COST,needsAccommodation:false};
  if(tier==='near'){
    const t=INTERVIEW_NEAR_TRAVEL[city]||420;
    return {cost:t,label:city+' 往返 ¥'+t,needsAccommodation:false};
  }
  const travel=INTERVIEW_FAR_TRAVEL[city]||1800;
  const acc=randomizeAcc?(INTERVIEW_ACCOMMODATION_BASE+Math.floor(Math.random()*220)):INTERVIEW_ACCOMMODATION_BASE;
  return {cost:travel+acc,label:city+' 往返+住宿 ¥'+(travel+acc),needsAccommodation:true};
}
function setupInterviewMode(app){
  const offer=app.offer;
  app.interviewMode=rollInterviewMode(offer);
  if(isInterviewOnline(app)){
    app.interviewNeedsAccommodation=false;
    app.interviewTravelCost=0;
    return;
  }
  const est=calcInterviewAttendanceCost(app,false);
  app.interviewNeedsAccommodation=!!est.needsAccommodation;
  app.interviewTravelCost=est.cost;
}
function interviewModeLabel(app){
  if(isInterviewOnline(app))return '在线面试';
  const city=interviewCityForApp(app);
  const tier=getInterviewDistanceTier(city);
  if(tier==='local')return '同城现场';
  if(tier==='near')return '异地赴约（'+city+'）';
  return '异地赴约（'+city+'·含住宿）';
}
function formatInterviewCostDesc(app){
  if(isInterviewOnline(app))return '在线免费';
  if(app.interviewTravelCost!=null)return '预计 ¥'+app.interviewTravelCost+(app.interviewNeedsAccommodation?'（含住宿·次日无法排面试）':'');
  return calcInterviewAttendanceCost(app,false).label;
}
function formatListingInterviewHint(offer){
  const city=getCompanyCity(offer.company);
  if(city===PLAYER_HOME_CITY)return '面试：或在线·同城¥50';
  if(getInterviewDistanceTier(city)==='near')return '面试：或在线·'+city+'往返约¥'+(INTERVIEW_NEAR_TRAVEL[city]||420);
  return '面试：或在线·'+city+'往返+住宿';
}
function hasAccommodationRecoveryBlock(week){
  return(game.applications||[]).some(a=>
    a.interviewNeedsAccommodation&&a.interviewWeek===week-1&&
    ['interview_confirmed','interview_scheduled'].includes(a.status)
  );
}
function hasNextWeekBlockForAccommodation(app){
  if(!app.interviewNeedsAccommodation)return false;
  return(game.applications||[]).some(a=>
    a.id!==app.id&&['interview_invite','interview_confirmed'].includes(a.status)&&a.interviewWeek===app.interviewWeek+1
  );
}
function hasInterviewTravelConflict(app,week,slot){
  if(hasAccommodationRecoveryBlock(week))return true;
  if(hasNextWeekBlockForAccommodation(app))return true;
  if(isInterviewOnline(app)){
    return(game.applications||[]).some(a=>
      a.id!==app.id&&a.status==='interview_confirmed'&&a.interviewWeek===week&&a.interviewSlot===slot
    );
  }
  const city=interviewCityForApp(app);
  const others=(game.applications||[]).filter(a=>
    a.id!==app.id&&a.status==='interview_confirmed'&&a.interviewWeek===week&&!isInterviewOnline(a)
  );
  for(const o of others){
    const oc=interviewCityForApp(o);
    if(city===oc)continue;
    if(isFarInterviewCity(city)||isFarInterviewCity(oc)||o.interviewNeedsAccommodation||app.interviewNeedsAccommodation)return true;
    if(isMorningInterviewSlot(slot)&&isMorningInterviewSlot(o.interviewSlot))return true;
  }
  return false;
}
function markStealthJobSearch(){
  if(!game||!game.employed)return;
  game.stealthJobSearch=true;
  game.stealthSearchWeeks=(game.stealthSearchWeeks||0)+1;
  addLog('⚠ 在职求职：被裁概率上升','warn');
}
function toggleInboxFold(cat){
  inboxFoldOpen[cat]=!inboxFoldOpen[cat];
  refreshInboxViews();
}
function refreshInboxViews(){
  if(typeof syncInviteExpiryState==='function')syncInviteExpiryState();
  renderInbox();
  if(typeof refreshJobHuntUi==='function'&&typeof currentTab!=='undefined'&&currentTab==='job')refreshJobHuntUi();
}
function markInboxInvalid(item,reason){
  if(!item)return;
  item.attended=true;item.invalid=true;item.invalidReason=reason||'已失效';
}
function syncInviteExpiryState(){
  if(!game||!game.applications)return;
  game.applications.forEach(app=>{
    if(app.status!=='interview_invite'||app.interviewWeek==null)return;
    if(game.week>=app.interviewWeek){
      app.status='invite_expired';
      const item=game.inbox.find(x=>x.id===app.id&&x.type==='interview');
      markInboxInvalid(item,'未确认，已失效');
    }
  });
}
function expireConflictingInvites(confirmedApp){
  if(!game||!confirmedApp)return;
  (game.applications||[]).forEach(app=>{
    if(app.id===confirmedApp.id||app.status!=='interview_invite')return;
    const week=app.interviewWeek,slot=app.interviewSlot;
    if(week==null||!slot)return;
    const slotTaken=isInterviewSlotTaken(week,slot,app.id);
    const travel=hasInterviewTravelConflict(app,week,slot);
    if(!slotTaken&&!travel)return;
    app.status='conflict_expired';
    const item=game.inbox.find(x=>x.id===app.id&&x.type==='interview');
    markInboxInvalid(item,'与已确认面试冲突，已失效');
    addLog('⏰ '+app.offer.company.name+' 面试邀请因行程冲突失效','warn');
  });
}
function processInterviewInviteExpiry(w){
  syncInviteExpiryState();
  (game.applications||[]).forEach(app=>{
    if(app.status!=='interview_invite'||app.interviewWeek==null)return;
    if(w>app.interviewWeek){
      app.status='invite_expired';
      const item=game.inbox.find(x=>x.id===app.id&&x.type==='interview');
      markInboxInvalid(item,'逾期未确认，已失效');
      addLog('⏰ 错过 '+app.offer.company.name+' 面试（未确认赴约）','warn');
    }
  });
}
function isInviteActionable(app,it){
  if(!app||!it||app.status!=='interview_invite')return false;
  if(it.attended||it.invalid)return false;
  if(app.interviewWeek!=null&&game.week>=app.interviewWeek)return false;
  return true;
}
function classifyInboxItem(it,app){
  if(it.type==='offer'&&(it.scamBait||String(it.id||'').indexOf('scam_')===0||String(it.id||'').indexOf('_sb_offer')>0))return 'scam';
  if(it.type==='ghost')return 'ghost';
  if(it.type==='reject')return 'rejected';
  if(it.type==='interview_done'||it.type==='interview_reply')return it.type==='interview_done'?'attended':'replied';
  if(it.type==='interview_missed')return 'missed';
  if(it.invalid&&!app)return 'expired';
  if(app){
    if(app.status==='missed')return 'missed';
    if(app.status==='interview_scheduled')return 'attended';
    if(['invite_expired','conflict_expired','declined'].includes(app.status))return 'expired';
    if(app.status==='rejected')return 'rejected';
    if(app.status==='interview_invite')return isInviteActionable(app,it)?'pending':'expired';
    if(app.status==='interview_confirmed'){
      if(app.interviewHeld)return 'attended';
      if(app.interviewWeek!=null&&app.interviewWeek>game.week)return 'replied';
      if(app.interviewWeek===game.week)return 'confirmed';
      return 'expired';
    }
  }
  if(it.invalid)return 'expired';
  if(it.type==='interview'&&it.attended)return 'attended';
  if(it.type==='interview'&&it.replied)return 'replied';
  if(it.type==='interview')return 'pending';
  return 'expired';
}
function findInboxApp(it){
  if(!game||!it)return null;
  if(it.type==='reject')return game.applications.find(a=>it.id===a.id+'_rej');
  const baseId=it.appId||it.id.replace(/_sb_offer$/,'').replace(/_attend_confirm$/,'').replace(/_missed_mail$/,'').replace(/_reply_confirm$/,'');
  return game.applications.find(a=>a.id===baseId);
}
function inboxItemKey(it){return it.id+'_'+it.type}
function ensureInboxReadIds(){if(!game.inboxReadIds)game.inboxReadIds=[]}
function isInboxItemUnread(it,app){
  ensureInboxReadIds();
  const cat=classifyInboxItem(it,app);
  if(cat==='pending'||cat==='ghost'||cat==='rejected'||cat==='scam')return !game.inboxReadIds.includes(inboxItemKey(it));
  return false;
}
function markInboxItemsRead(items){
  if(!items||!items.length)return;
  ensureInboxReadIds();
  const set=new Set(game.inboxReadIds);
  items.forEach(it=>set.add(inboxItemKey(it)));
  game.inboxReadIds=[...set];
}
function getVisibleInboxRaw(){
  if(!game||!game.inbox)return [];
  return game.inbox.filter(x=>{
    if(x.type==='offer'&&(String(x.id||'').indexOf('scam_')===0||x.scamBait||String(x.id||'').indexOf('_sb_offer')>0))return true;
    if(x.type==='ghost'||x.type==='reject'||x.type==='interview_done'||x.type==='interview_missed'||x.type==='interview_reply')return true;
    if(x.type!=='interview')return false;
    const app=findInboxApp(x);
    if(app&&['offered','silent'].includes(app.status))return false;
    return true;
  });
}
function markVisibleInboxRead(){markInboxItemsRead(getVisibleInboxRaw())}
function countJobInboxUnread(){
  if(!game||!game.inbox)return 0;
  let n=0;
  getVisibleInboxRaw().forEach(it=>{
    const app=findInboxApp(it);
    if(isInboxItemUnread(it,app))n++;
  });
  return n;
}
function bucketInboxItems(raw){
  const buckets={pending:[],replied:[],confirmed:[],attended:[],missed:[],expired:[],ghost:[],rejected:[],scam:[]};
  raw.forEach(it=>{
    const app=findInboxApp(it);
    const cat=classifyInboxItem(it,app);
    if(buckets[cat])buckets[cat].push(it);
    else buckets.expired.push(it);
  });
  Object.keys(buckets).forEach(k=>{buckets[k]=sortInterviewInboxItems(buckets[k])});
  return buckets;
}
function renderInboxBucketsHtml(buckets){
  let html='';
  html+=renderInboxCategory('⚠ 可疑招聘 · 诈骗岗','scam',buckets.scam,true);
  html+=renderInboxCategory('待确认 · 面试邀请','pending',buckets.pending,true);
  html+=renderInboxCategory('已回复 · 确认参加面试','replied',buckets.replied,true);
  html+=renderInboxCategory('已确认 · 待面试','confirmed',buckets.confirmed,true);
  html+=renderInboxCategory('已参加 · 出席确认','attended',buckets.attended,true);
  html+=renderInboxCategory('未参加 · 缺席通知','missed',buckets.missed,true);
  html+=renderInboxCategory('已失效 · 未确认/冲突','expired',buckets.expired,true);
  html+=renderInboxCategory('未通过筛选 · 无面试机会','ghost',buckets.ghost,true);
  html+=renderInboxCategory('面试未通过','rejected',buckets.rejected,true);
  return html;
}
function inboxExpiredLabel(app,it){
  if(it&&it.invalidReason)return it.invalidReason;
  if(!app)return '已失效';
  if(app.status==='conflict_expired')return '与已确认面试冲突，已失效';
  if(app.status==='invite_expired')return '未确认，已失效';
  if(app.status==='declined')return '已放弃';
  return '已失效';
}
function pushInboxMail(item){
  if(!game||!item)return;
  if(!game.inbox.some(x=>x.id===item.id))game.inbox.push(item);
}
function togglePlannedFold(){
  plannedFoldOpen=!plannedFoldOpen;
  renderInterviewCalendar();
}
function togglePlannedCompany(co){
  if(plannedExpandedCompanies.has(co))plannedExpandedCompanies.delete(co);
  else plannedExpandedCompanies.add(co);
  renderInterviewCalendar();
}
function setCalendarView(v){
  calendarView=v;
  renderInterviewCalendar();
}
function tickPendingHire(){
  if(!game||!game.pendingHire||game.week<game.pendingHire.startWeek)return;
  const p=game.pendingHire;
  const offer={...p.offer,annualPay:p.finalPay||p.offer.annualPay};
  hirePlayer(p.jobIdx,offer,p.viaReferral);
  game.pendingHire=null;
  game.stealthJobSearch=false;
  game.stealthSearchWeeks=0;
}
function getResumeProbability(job,offer,apps){
  let base=job.heatPct>=115?.72:job.heatPct>=108?.6:job.heatPct>=102?.48:job.heatPct>=98?.35:.22;
  if(offer.eduGap>=2)base*=.55; else if(offer.eduGap>=1)base*=.78;
  if(offer.newToIndustry)base*=1.06;
  const m=offer.method||getApplyMethod();
  if(m==='headhunter')base=Math.min(.88,base*1.2+.1);
  else if(m==='referral')base=Math.min(.85,base*1.35+.15);
  else if(m==='app')base=Math.min(.88,base*getAppChannelMult(job,offer.tier,apps,offer.importance));
  else if(m==='campus'&&typeof CAMPUS_HIRE_MULT!=='undefined')base=Math.min(.88,base*CAMPUS_HIRE_MULT);
  const mod=getHireProbabilityModifiers(offer);
  base*=Math.min(1,mod.combined*2.2);
  const gap=tierImpGap(offer);
  if(gap>=5)base*=.08; else if(gap>=4)base*=.2; else if(gap>=3)base*=.45;
  if(game.severanceLitigation&&game.week<game.severanceLitigation.untilWeek){
    const cat=game.market[job.idx]&&game.market[job.idx].category;
    if(cat&&cat===game.severanceLitigation.category)base*=.22;
  }
  if(typeof artifactHireMult==='function')base*=artifactHireMult(job,offer);
  if(typeof playerCareerRankGapForOffer==='function'){
    const rg=playerCareerRankGapForOffer(job,offer);
    if(rg>=3)base*=.04; else if(rg>=2)base*=.12; else if(rg>=1)base*=.38; else if(rg<0)base=Math.min(.88,base*1.06);
  }
  return Math.min(.88,Math.max(0.002,base));
}
function getInterviewProbability(job,offer,hasReferral){
  if(typeof artifactGuaranteedFor==='function'&&artifactGuaranteedFor(job,offer))return 0.88;
  let base=getResumeProbability(job,offer,offer.apps)*.85+.18;
  base*=1-Math.min(.85,playerStress()*game.stressMultiplier*.001);
  if(game.onWelfare)base*=.75;
  if(hasReferral)base=Math.min(.88,base*1.35+.12);
  return Math.min(.88,Math.max(0.03,base));
}
function drawRecruitmentRound(jobIdxs,resumeCost,opts){
  opts=opts||{};
  const listings=[];
  const cats=new Set();
  const method=opts.forceMethod||getApplyMethod();
  const isAllnight=opts.slot==='allnight';
  let drawSize=CHANNEL_DRAW_SIZE[method]||45;
  if(opts.drawScale)drawSize=Math.max(1,Math.round(drawSize*opts.drawScale));
  if(opts.drawMult)drawSize=Math.max(1,Math.round(drawSize*opts.drawMult));
  const apps=opts.apps||resumeCost.apps||getSelectedApps();
  const candidates=[];
  jobIdxs.forEach(ji=>{
    const job=game.market[ji];
    if(!job)return;
    cats.add(job.category);
    const pool=game.jobCompanies&&game.jobCompanies[ji];
    if(!pool||!pool.length){
      const fallback=(game.companyAll||[]).filter(co=>companyHiresForJob(co,ji,job)).slice(0,JOB_POOL_SIZE);
      if(fallback.length)(game.jobCompanies=game.jobCompanies||{})[ji]=fallback;
    }
    shuffleArr([...(game.jobCompanies[ji]||[])],seededRand(ji*1009+game.week)).forEach((co,ci)=>{
      candidates.push({ji,job,co,ci});
    });
  });
  const rng=seededRand(game.week*317+jobIdxs.length+(opts.seedExtra||0));
  const candScore=(c)=>{
    let s=scoreListingForApps(c.job,c.co,'low',apps);
    if(isAllnight)s+=(c.job.pay||0)/70000*ALLNIGHT_JOB_PAY_BIAS;
    return s;
  };
  candidates.sort((a,b)=>candScore(b)-candScore(a)+(rng()-0.5)*0.8);
  const picked=[];
  const usedCo=new Set();
  for(const c of candidates){
    if(picked.length>=drawSize)break;
    if(usedCo.has(c.co.id))continue;
    usedCo.add(c.co.id);
    picked.push(c);
  }
  if(picked.length<drawSize){
    shuffleArr(candidates,rng);
    for(const c of candidates){
      if(picked.length>=drawSize)break;
      if(usedCo.has(c.co.id))continue;
      usedCo.add(c.co.id);
      picked.push(c);
    }
  }
  picked.forEach(({ji,job,co,ci})=>{
    const r=seededR(ji*1009+ci*17+game.week);
    genOpeningsForCompany(job,co,r).forEach((op,oi)=>{
      const offer={company:co,tier:co.tier,importance:op.importance,annualPay:op.pay,roleExtra:op.roleExtra,
        welfare:op.welfare,otProfile:op.otProfile,startDelayWeeks:op.startDelayWeeks,planned:op.planned,
        newToIndustry:!game.industryExperience[job.category],eduGap:eduGapBetween(job.education,game.playerEducation),
        apps};
      listings.push({uid:'L'+ji+'_'+co.id+'_'+oi,jobIdx:ji,jobTitle:job.title,category:job.category,offer});
    });
  });
  if(opts.drawCount!=null&&listings.length>opts.drawCount){
    const lr=seededRand(game.week*401+(opts.seedExtra||0));
    shuffleArr(listings,lr);
    listings.splice(opts.drawCount);
  }
  if(typeof recordJobListingsSeen==='function')recordJobListingsSeen(listings.length);
  return {listings,cats,drawSize:picked.length};
}
function formatOfferPay(offer){
  if(offer.roleExtra==='temp')return '周薪¥'+Math.round(offer.annualPay/52).toLocaleString()+'（折合年薪¥'+offer.annualPay.toLocaleString()+'）';
  if(offer.roleExtra==='intern')return '实习年薪¥'+Math.round(offer.annualPay*0.55).toLocaleString()+'（转正¥'+offer.annualPay.toLocaleString()+'）';
  return '年薪¥'+offer.annualPay.toLocaleString();
}
function renderListingRow(item,checked){
  const o=item.offer;
  const imp=o.roleExtra?IMP_LABEL[o.importance]+'·'+ROLE_EXTRA[o.roleExtra]:IMP_LABEL[o.importance];
  const pay=formatOfferPay(o);
  const start=o.planned?'<span style="color:var(--blue)">预定招聘</span> · 入职约'+o.startDelayWeeks+'周后（提前半年左右）':'上岗约'+o.startDelayWeeks+'周内';
  const fitHint=typeof playerCareerRankFitHtml==='function'?playerCareerRankFitHtml(item.jobTitle,o.importance,o.roleExtra):'';
  return '<label class="company-row picked"><input type="checkbox" class="listing-pick" data-uid="'+item.uid+'"'+(checked?' checked':'')+' onchange="updateListingPickCount()">'+
    '<div style="flex:1"><b>'+o.company.name+'</b> '+fmtCompanyBadge(o.company)+' · <b>'+imp+'</b>'+(o.planned?' <span style="color:var(--blue);font-size:.68rem">预定</span>':'')+fitHint+'<br>'+
    '招：'+item.jobTitle+' · '+pay+' · '+start+' · '+formatListingInterviewHint(o)+
    (isRemoteCompany(o.company)?' · <span style="color:var(--orange)">'+getCompanyCity(o.company)+'</span>':'')+'<br>'+
    '<span style="color:var(--muted)">'+o.welfare+'</span></div></label>';
}
function updateListingPickCount(){
  const n=document.querySelectorAll('.listing-pick:checked').length;
  const el=document.getElementById('listingPickCount');
  if(el)el.textContent='已选 '+n+' 个岗位';
}
function toggleAllListings(on){
  document.querySelectorAll('.listing-pick').forEach(cb=>{cb.checked=on});
  updateListingPickCount();
}
function getSelectedListingUids(){
  return [...document.querySelectorAll('.listing-pick:checked')].map(cb=>cb.dataset.uid);
}
function effectiveListingPay(item){
  const o=item.offer;
  if(o.roleExtra==='intern')return Math.round(o.annualPay*0.55);
  if(o.roleExtra==='temp')return o.annualPay;
  return o.annualPay;
}
function renderApplyModalListings(listings,defaultChecked){
  const checked=defaultChecked?null:new Set(getSelectedListingUids());
  let rows=[...listings];
  if(applyListingSort==='pay')rows.sort((a,b)=>effectiveListingPay(b)-effectiveListingPay(a));
  document.getElementById('applyModalList').innerHTML=rows.map(item=>{
    const on=defaultChecked||(checked&&checked.has(item.uid));
    return renderListingRow(item,on);
  }).join('');
  updateListingPickCount();
  const sortBtn=document.getElementById('btnSortListingsPay');
  if(sortBtn){
    sortBtn.style.display=pendingBatch&&pendingBatch.method==='app'?'inline-block':'none';
    sortBtn.textContent=applyListingSort==='pay'?'已按年薪排序':'按年薪排序';
  }
}
function sortApplyListings(mode){
  if(!pendingBatch||pendingBatch.method!=='app')return;
  applyListingSort=mode;
  renderApplyModalListings(pendingBatch.listings,false);
}
function getJobsToApply(){
  const idxs=[...selectedJobIdxs];
  if(!idxs.length&&selectedIdx>=0)idxs.push(selectedIdx);
  if(applyCategoryPicks.size){
    const filtered=idxs.length?idxs:game.market.map(j=>j.idx);
    return filtered.filter(i=>{
      const cat=game.market[i].category;
      return applyCategoryPicks.has(cat);
    });
  }
  return idxs;
}
function closeApplyModal(){
  document.getElementById('applyModal').classList.add('hidden');
  if(pendingBatch&&pendingBatch.paid&&!pendingBatch.submitted){
    addLog('放弃勾选投递，本期渠道费已消耗','warn');
    if(pendingBatch.dailySlot){
      game.dailyApplyContext=null;
      if(game.daily){
        game.daily.jobSubMenu=null;
        game.daily.dailyPickJobIdxs=[];
      }
      renderDailyPanel();updateUI();
    }else{actionDone=true;finishWeek();}
  }
  pendingBatch=null;
}
function formatMarketTime(min){
  const m=Math.max(0,Math.floor(min));
  const h=Math.floor(m/60), r=m%60;
  return h+'小时'+String(r).padStart(2,'0')+'分';
}
function canMarketSpendTime(){
  return game&&game.marketActive&&game.marketTimeLeft>=MARKET_APPLY_MINUTES;
}
function canMarketApplyNow(){
  return canMarketSpendTime()&&game.marketApplyCount<MARKET_MAX_APPLIES;
}
function generateRandomMarketBooth(){
  const eligible=game.market.map((j,i)=>i).filter(i=>{
    const j=game.market[i];
    return canApplyJob(j)&&!isOverAgeLimit(j);
  });
  if(!eligible.length)return null;
  const ji=eligible[Math.floor(Math.random()*eligible.length)];
  const job=game.market[ji];
  let tier=job.heatPct>=112?'high':job.heatPct>=102?'mid':'low';
  if(Math.random()<0.28)tier=downgradeTier(tier,1);
  const co=pickCompany(ji,tier);
  const r=seededR(ji*997+game.week*13+Math.floor(Math.random()*99999));
  const openings=genOpeningsForCompany(job,co,r);
  const op=openings[Math.floor(Math.random()*openings.length)];
  const offer={company:co,tier:co.tier,importance:op.importance,annualPay:op.pay,roleExtra:op.roleExtra,
    welfare:op.welfare,otProfile:op.otProfile,startDelayWeeks:op.startDelayWeeks,planned:op.planned,
    newToIndustry:!game.industryExperience[job.category],
    eduGap:eduGapBetween(job.education,game.playerEducation),
    method:'market'};
  return {uid:'M'+ji+'_'+co.id+'_'+Math.floor(Math.random()*1e6),jobIdx:ji,jobTitle:job.title,category:job.category,offer};
}
function fillMarketBooths(){
  game.marketBooths=game.marketBooths||[];
  while(game.marketBooths.length<MARKET_BOOTHS){
    const b=generateRandomMarketBooth();
    if(!b)break;
    game.marketBooths.push(b);
  }
}
function renderMarketBooth(item){
  const o=item.offer;
  const imp=o.roleExtra?IMP_LABEL[o.importance]+'·'+ROLE_EXTRA[o.roleExtra]:IMP_LABEL[o.importance];
  const pay=formatOfferPay(o);
  const can=canMarketApplyNow();
  return '<div class="market-booth"><div class="booth-body"><b>'+o.company.name+'</b> '+fmtCompanyBadge(o.company)+' · <b>'+imp+'</b><br>'+
    '招：<b>'+item.jobTitle+'</b>（'+item.category+'） · '+pay+' · '+formatListingInterviewHint(o)+'<br>'+
    '<span style="color:var(--muted)">'+o.welfare+'</span></div>'+
    '<button class="btn btn-primary" onclick="marketApply(\\''+item.uid+'\\')"'+(can?'':' disabled')+'>投递<br>(-10分)</button></div>';
}
function renderMarket(){
  if(!game||!game.marketActive)return;
  const tl=document.getElementById('marketTimeLeft');
  const ac=document.getElementById('marketApplyCount');
  if(tl)tl.textContent=formatMarketTime(game.marketTimeLeft);
  if(ac)ac.textContent=game.marketApplyCount;
  const list=document.getElementById('marketBoothList');
  if(list){
    fillMarketBooths();
    list.innerHTML=game.marketBooths.length?game.marketBooths.map(renderMarketBooth).join(''):
      '<p style="color:var(--muted)">暂无可用摊位</p>';
  }
  const refreshBtn=document.getElementById('btnMarketRefresh');
  if(refreshBtn)refreshBtn.disabled=!canMarketSpendTime();
}
function stopMarketTimer(){
  if(marketTimerId){clearInterval(marketTimerId);marketTimerId=null;}
}
function startMarketTimer(){
  stopMarketTimer();
  marketTimerId=setInterval(()=>{
    if(!game||!game.marketActive)return;
    game.marketTimeLeft--;
    const tl=document.getElementById('marketTimeLeft');
    if(tl)tl.textContent=formatMarketTime(game.marketTimeLeft);
    if(game.marketTimeLeft<=0){
      addLog('人才市场关门，8小时已到。','warn');
      leaveMarket();
      return;
    }
    if(game.marketTimeLeft<MARKET_APPLY_MINUTES)renderMarket();
  },MARKET_SEC_PER_MIN*1000);
}
function enterMarket(fromDaily){
  if(!fromDaily&&actionDone){addLog('本周已行动','warn');return}
  if(game.daily&&game.daily.phase!=='morning'&&!fromDaily){addLog('人才市场仅限白天前往','fail');return}
  if(game.marketActive)return;
  if(game.casinoActive){addLog('在澳门赌桌，无法去人才市场','warn');return}
  if(game.cash<MARKET_ENTRY_FEE){addLog('现金不足，入场费需 ¥'+MARKET_ENTRY_FEE,'fail');return}
  game.cash-=MARKET_ENTRY_FEE;game.jobHuntSpent+=MARKET_ENTRY_FEE;
  ledgerRecordJobHunt(MARKET_ENTRY_FEE,'人才市场入场');
  game.marketActive=true;game.marketTimeLeft=MARKET_TIME_BUDGET;game.marketApplyCount=0;game.marketBooths=[];
  fillMarketBooths();
  document.getElementById('marketOverlay').classList.remove('hidden');
  renderMarket();
  startMarketTimer();
  addLog('🏢 进入人才市场（¥'+MARKET_ENTRY_FEE+'）。计时开始：8小时，投递或再逛逛各-10分钟，最多48家。','info');
  updateButtons();
}
function marketRefreshBooths(){
  if(!game||!game.marketActive)return;
  if(game.marketTimeLeft<MARKET_APPLY_MINUTES){addLog('剩余时间不足10分钟，无法再逛','fail');return}
  game.marketTimeLeft-=MARKET_APPLY_MINUTES;
  game.marketBooths=[];
  fillMarketBooths();
  addLog('🔄 再逛逛，换一批摊位（-10分钟，剩 '+formatMarketTime(game.marketTimeLeft)+'）','info');
  renderMarket();
  if(game.marketTimeLeft<MARKET_APPLY_MINUTES)addLog('剩余时间不足再投递或再逛，建议离场。','warn');
}
function marketApply(uid){
  if(!game||!game.marketActive)return;
  if(game.marketTimeLeft<MARKET_APPLY_MINUTES){addLog('剩余时间不足10分钟，无法再投','fail');return}
  if(game.marketApplyCount>=MARKET_MAX_APPLIES){addLog('已达48家投递上限','fail');return}
  const idx=(game.marketBooths||[]).findIndex(b=>b.uid===uid);
  if(idx<0)return;
  const item=game.marketBooths[idx];
  if(typeof listingAlreadyApplied==='function'&&listingAlreadyApplied(item)){
    addLog('该岗位已投或未到可再投时间','fail');return;
  }
  game.marketTimeLeft-=MARKET_APPLY_MINUTES;
  game.marketApplyCount++;
  const id='mkt_'+game.week+'_'+game.marketApplyCount+'_'+Math.floor(Math.random()*9999);
  markStealthJobSearch();
  const replyWeek=calcApplicationReplyWeek(item.offer,game.week,item.jobIdx);
  game.applications.push({
    id,jobIdx:item.jobIdx,offer:{...item.offer,method:'market'},
    status:'pending',applyWeek:game.week,replyWeek,planned:!!item.offer.planned,
    interviewWeek:null,resultWeek:null,viaReferral:false,method:'market',resumeCostLabel:'人才市场'
  });
  game.totalApplications++;
  game.appliedCategories[item.category]=true;
  addLog('📤 人才市场投递【'+item.jobTitle+'】@'+item.offer.company.name+'（-10分钟，剩 '+formatMarketTime(game.marketTimeLeft)+'）','info');
  updateLongDistanceStatus();
  const nb=generateRandomMarketBooth();
  if(nb)game.marketBooths[idx]=nb;else game.marketBooths.splice(idx,1);
  renderMarket();
  if(game.marketApplyCount>=MARKET_MAX_APPLIES){
    addLog('已投满48家，自动离场。','info');
    leaveMarket();
  }else if(game.marketTimeLeft<MARKET_APPLY_MINUTES){
    addLog('剩余时间不足再投一家，建议离场。','warn');
  }
}
function leaveMarket(){
  if(!game||!game.marketActive)return;
  stopMarketTimer();
  const n=game.marketApplyCount;
  game.marketActive=false;game.marketBooths=[];
  document.getElementById('marketOverlay').classList.add('hidden');
  addLog('人才市场离场，共投递 '+n+' 份简历。','info');
  const ctx=game.dailyApplyContext;
  if(ctx&&ctx.market){
    if(n>0&&typeof markDailyJobHunt==='function')markDailyJobHunt('morning');
    else{
      if(typeof dailyReleaseMainActivity==='function')dailyReleaseMainActivity();
      addLog('未投递简历，本时段行动点已返还','warn');
    }
    game.dailyApplyContext=null;
    updateButtons();renderDailyPanel();updateUI();
    return;
  }
  actionDone=true;
  updateButtons();
  finishWeek();
}
function validateJobsForApply(jobIdxs){
  for(const ji of jobIdxs){
    const job=game.market[ji];
    if(isOverAgeLimit(job)){addLog('【'+job.category+'】超龄，无法查看 '+job.title+' 相关招聘','fail');return false}
    if(!canApplyJob(job)){addLog('低保期间只能应聘体力劳动','fail');return false}
  }
  return true;
}
function runApplyRound(jobIdxs,opts){
  opts=opts||game.dailyApplyContext||{};
  if(!validateJobsForApply(jobIdxs)){
    if(opts.slot&&typeof dailyReleaseMainActivity==='function')dailyReleaseMainActivity();
    return;
  }
  const method=opts.forceMethod||getApplyMethod();
  const rc=getResumeCost();
  if(method==='headhunter'&&!canUseHeadhunter()){addLog('猎头仅限：C9/常春藤学历，或曾任专家/总监岗，或在头部/重点企业任职','fail');return}
  if(method==='app'&&!getSelectedApps().length){addLog('请至少勾选一个招聘APP','fail');return}
  if((method==='market'||method==='headhunter')&&game.daily&&game.daily.phase!=='morning'){
    addLog('线下人才市场与猎头仅限白天使用','fail');return;
  }
  if(rc.upfront>0&&game.cash<rc.upfront){
    const tip=rc.renewApps&&rc.renewApps.length?'开通费需 ¥'+rc.upfront+'（'+rc.renewApps.map(a=>JOB_APPS[a]).join('、')+'）':'渠道费需 ¥'+rc.upfront;
    addLog('现金不足，'+tip,'fail');return;
  }
  if(rc.upfront>0){game.cash-=rc.upfront;game.jobHuntSpent+=rc.upfront;ledgerRecordJobHunt(rc.upfront,rc.label||'求职渠道')}
  if(rc.renewApps&&rc.renewApps.length)activateAppSubscriptions(rc.renewApps);
  const paidNote=rc.upfront>0?'已付 ¥'+rc.upfront+(rc.renewApps&&rc.renewApps.length?'（开通 '+rc.renewApps.map(a=>JOB_APPS[a]).join('、')+' 一个月）':''):'免费';
  addLog('📋 【'+rc.label+'】'+paidNote+'，正在抽取本期招聘…','info');
  let batch;
  try{batch=drawRecruitmentRound(jobIdxs,rc,opts)}
  catch(err){
    if(rc.upfront>0){game.cash+=rc.upfront;game.jobHuntSpent-=rc.upfront}
    addLog('抽取招聘失败：'+(err&&err.message?err.message:'未知错误'),'fail');
    console.error(err);
    return;
  }
  if(!batch.listings.length){
    if(rc.upfront>0){game.cash+=rc.upfront;game.jobHuntSpent-=rc.upfront}
    const poolN=jobIdxs.reduce((s,ji)=>s+(game.jobCompanies[ji]||[]).length,0);
    addLog('本期暂无在招岗位（已选'+jobIdxs.length+'个职业，企业池'+poolN+'家）','fail');
    return;
  }
  pendingBatch={...batch,resumeCost:rc,method,paid:true,jobIdxs,dailySlot:opts.slot||null};
  applyListingSort='default';
  document.getElementById('applyModalTitle').textContent='本期招聘 · 勾选要投的岗位';
  document.getElementById('applyModalDesc').textContent='渠道：'+rc.label+'（'+paidNote+'）· 抽取 '+batch.drawSize+' 家企业 · 共 '+batch.listings.length+' 个在招岗位 · 请按企业实际发布勾选';
  renderApplyModalListings(batch.listings,true);
  updateAppSubscriptionLabels();
  document.getElementById('applyModal').classList.remove('hidden');
}
function startApplyFlow(){
  if(!game){addLog('请先点击「开始人生模拟」','fail');return}
  if(actionDone||game.gameOver)return;
  if(game.casinoActive){addLog('在澳门赌桌，无法求职','warn');return}
  if(game.marketActive){addLog('已在人才市场场内','warn');return}
  if(game.homeless){addLog('流浪中无法求职','fail');return}
  const method=getApplyMethod();
  if((method==='market'||method==='headhunter')&&game.daily&&game.daily.phase!=='morning'){
    addLog('线下人才市场与猎头仅限白天；晚上/通宵请用招聘APP','fail');return;
  }
  if(method==='app'&&(typeof canUseJobApp!=='function'?!game.phone:!canUseJobApp())){addLog(typeof jobAppBlockMessage==='function'?jobAppBlockMessage():'无法使用招聘APP','fail');return}
  if(method==='market'){enterMarket(false);return}
  const jobIdxs=getJobsToApply();
  if(!jobIdxs.length){addLog('请先在上方多选职业或行业','fail');return}
  runApplyRound(jobIdxs);
}
function confirmBatchApply(){
  if(!pendingBatch||actionDone)return;
  const uids=new Set(getSelectedListingUids());
  if(!uids.size){addLog('请至少勾选一个岗位','fail');return}
  let listings=pendingBatch.listings.filter(item=>uids.has(item.uid));
  const {cats,resumeCost,method}=pendingBatch;
  const viaRef=method==='referral';
  if(game.employed)markStealthJobSearch();
  let skipped=0;
  if(typeof listingAlreadyApplied==='function'){
    const ok=[];
    listings.forEach(item=>{
      if(listingAlreadyApplied(item))skipped++;
      else ok.push(item);
    });
    listings=ok;
    if(skipped)addLog('跳过 '+skipped+' 个已投或入职前的岗位','warn');
  }
  if(!listings.length){addLog('没有可投递的岗位','fail');return}
  let plannedCount=0;
  listings.forEach((item,idx)=>{
    const id='app_'+game.week+'_'+idx+'_'+Math.floor(Math.random()*9999);
    const replyWeek=calcApplicationReplyWeek(item.offer,game.week,item.jobIdx);
    if(item.offer.planned)plannedCount++;
    game.applications.push({
      id,jobIdx:item.jobIdx,offer:{...item.offer,apps:resumeCost.apps||getSelectedApps(),method},
      status:'pending',applyWeek:game.week,replyWeek,planned:!!item.offer.planned,
      interviewWeek:null,resultWeek:null,viaReferral:viaRef,method,resumeCostLabel:resumeCost.label
    });
    game.totalApplications++;
  });
  cats.forEach(c=>{game.appliedCategories[c]=true});
  pendingBatch.submitted=true;
  addLog('📤 【'+resumeCost.label+'】投递 '+listings.length+' 份简历（渠道费已付 ¥'+resumeCost.upfront+'）','info');
  if(plannedCount)addLog('📅 '+plannedCount+' 个预定招聘岗位已记入求职日历，到日将通知是否获得面试资格','info');
  updateLongDistanceStatus();
  document.getElementById('applyModal').classList.add('hidden');
  const dailySlot=pendingBatch.dailySlot;
  pendingBatch=null;
  if(dailySlot){
    if(game.daily){
      game.daily.jobSubMenu=null;
      game.daily.dailyPickApp=null;
      game.daily.dailyPickJobIdxs=[];
      game.daily.dailyAppListings=null;
    }
    game.dailyApplyContext=null;
    renderInterviewCalendar();renderDailyPanel();updateUI();
    return;
  }
  actionDone=true; finishWeek();
  renderInterviewCalendar();
}
function processApplicationPipeline(){
  if(!game||!game.applications)return;
  const w=game.week;
  processInterviewInviteExpiry(w);
  game.applications.forEach(app=>{
    if(app.status==='pending'&&w>=app.replyWeek){
      const job=game.market[app.jobIdx], offer=app.offer;
      if(!offer||!job)return;
      const coName=offerCompanyName(offer);
      const gap=tierImpGap(offer);
      if(gap>=6){
        app.status='silent';
        if(app.method==='campus'){
          game.inbox.push({id:app.id+'_silent',type:'ghost',week:w,jobIdx:app.jobIdx,company:coName,
            msg:coName+'：感谢您的关注，本轮暂无合适安排。',offer});
        }
        game.resumeFailCount++;return;
      }
      if(game.severanceBlacklistUntil>game.week&&Math.random()<0.4){
        app.status='ghost';
        game.inbox.push({id:app.id,type:'ghost',week:w,jobIdx:app.jobIdx,company:coName,
          msg:coName+'：感谢您的关注，本轮暂无合适安排。',offer});
        game.resumeFailCount++;return;
      }
      if(game.severanceLitigation&&game.week<game.severanceLitigation.untilWeek){
        const cat=job&&job.category;
        if(cat&&cat===game.severanceLitigation.category&&Math.random()<0.55){
          app.status='ghost';
          game.inbox.push({id:app.id,type:'ghost',week:w,jobIdx:app.jobIdx,company:coName,
            msg:coName+'：背调未通过，暂不合适。',offer});
          game.resumeFailCount++;return;
        }
      }
      const artGuar=typeof artifactGuaranteedFor==='function'&&artifactGuaranteedFor(job,offer);
      const rp=artGuar?0.88:getResumeProbability(job,offer,offer.apps);
      if(!artGuar&&Math.random()>=rp){
        app.status='silent';
        if(app.method==='campus'){
          game.inbox.push({id:app.id+'_silent',type:'ghost',week:w,jobIdx:app.jobIdx,company:coName,
            msg:coName+'：感谢您的关注，本轮暂无合适安排。',offer});
        }
        game.resumeFailCount++;return;
      }
      const ghostRate=artGuar?0:(app.method==='campus'?0.22:(app.viaReferral?0.25:0.52));
      if(Math.random()<ghostRate){
        app.status='ghost';
        const ghostMsg=offer.planned?
          coName+' 预定招聘筛选结果：简历暂未通过本轮筛选，感谢关注。':
          coName+'：感谢您的投递，如有合适机会我们将通知您面试时间。';
        game.inbox.push({id:app.id,type:'ghost',week:w,jobIdx:app.jobIdx,company:coName,
          msg:ghostMsg,offer});
        game.resumeFailCount++;
      }else{
        app.status='interview_invite';
        const sched=companyProcessDelay(offer,job,'interviewSchedule');
        app.interviewWeek=w+sched;
        if(offer.planned&&offer.startDelayWeeks){
          const latestIv=app.applyWeek+offer.startDelayWeeks-2;
          if(app.interviewWeek>latestIv)app.interviewWeek=latestIv;
        }
        app.interviewSlot=pickInterviewSlot(app.interviewWeek,app.id);
        setupInterviewMode(app);
        const slotTxt=interviewSlotLabel(app.interviewSlot);
        const cityTxt=offer.company&&isRemoteCompany(offer.company)?'（'+getCompanyCity(offer.company)+'·异地）':'';
        const whenNote=sched<=1?'近期':'约'+sched+'周后';
        const modeNote=' · '+interviewModeLabel(app)+' · '+formatInterviewCostDesc(app);
        const inviteMsg=offer.planned?
          coName+cityTxt+' 预定招聘筛选通过：【'+IMP_LABEL[offer.importance]+'】面试资格 · '+whenNote+' '+getDateStr(app.interviewWeek)+' '+slotTxt+modeNote:
          coName+cityTxt+' 邀请【'+IMP_LABEL[offer.importance]+'】面试 · '+whenNote+' '+getDateStr(app.interviewWeek)+' '+slotTxt+modeNote;
        game.inbox.push({id:app.id,type:'interview',week:w,jobIdx:app.jobIdx,company:coName,
          interviewWeek:app.interviewWeek,interviewSlot:app.interviewSlot,
          msg:inviteMsg,offer,attended:false,confirmed:false});
        updateLongDistanceStatus();
        if(offer.planned)addLog('✉️ '+coName+' 预定招聘公布：获得面试资格','success');
        else if(app.method==='campus')addLog('✉️ 【校招】'+coName+' 邀请面试 · 见应聘邮箱','success');
      }
    }
    if(app.status==='interview_confirmed'&&app.interviewWeek!=null&&w>app.interviewWeek&&!app.interviewHeld){
      app.status='missed';app.interviewHeld=true;
      const missedInbox=game.inbox.find(x=>x.id===app.id&&x.type==='interview');
      markInboxInvalid(missedInbox,'未到场，已错过');
      const slotTxt=interviewSlotLabel(app.interviewSlot);
      pushInboxMail({id:app.id+'_missed_mail',appId:app.id,type:'interview_missed',week:w,jobIdx:app.jobIdx,
        company:app.offer.company.name,interviewWeek:app.interviewWeek,interviewSlot:app.interviewSlot,offer:app.offer,
        msg:app.offer.company.name+' 面试缺席通知：您未按约参加 '+getDateStr(app.interviewWeek)+' '+slotTxt+' 的面试。'});
      addLog('⏰ 错过 '+app.offer.company.name+' '+slotTxt+' 面试（未按时段到场）','warn');
    }
    if(app.status==='interview_scheduled'&&app.resultWeek&&w>=app.resultWeek){
      const job=game.market[app.jobIdx], offer=app.offer;
      const ip=getInterviewProbability(job,offer,app.viaReferral);
      if(Math.random()<ip){
        app.status='offered';
        const startW=w+companyProcessDelay(offer,job,'start');
        const expW=w+10+Math.floor(Math.random()*8);
        const o={id:app.id,jobIdx:app.jobIdx,offer,startWeek:startW,expireWeek:expW,accepted:false,
          stage:'negotiate',negotiated:false,contractSigned:false,finalPay:offer.annualPay};
        game.offers.push(o);
        const waitNote=startW<=w+1?'很快可上岗':'预计 '+getDateStr(startW)+' 上岗';
        game.inbox.push({id:app.id+'_offer',type:'offer',week:w,jobIdx:app.jobIdx,company:offer.company.name,
          msg:offer.company.name+' 恭喜！拟录用【'+IMP_LABEL[offer.importance]+'】· '+waitNote+' · 请洽谈薪资并签约（有效期至 '+getDateStr(expW)+'）',offer});
      }else{
        app.status='rejected';
        game.inbox.push({id:app.id+'_rej',type:'reject',week:w,jobIdx:app.jobIdx,company:offer.company.name,
          msg:'很遗憾，您未能满足 '+offer.company.name+' '+IMP_LABEL[offer.importance]+' 岗位要求。',offer});
        game.resumeFailCount++;
      }
    }
  });
  game.offers=game.offers.filter(o=>{
    if(o.accepted)return false;
    if(w>o.expireWeek){
      game.expiredOfferCount++;
      addLog('⏰ Offer 过期：'+o.offer.company.name,'warn');
      if(game.expiredOfferCount>=WOLF_OFFER_EXPIRES&&!game.wolfAchievement){
        game.wolfAchievement=true;
        addLog('🐺 社会勋章·独狼 — 炒股与赌博运气大幅提升','success');
      }
      return false;
    }
    return true;
  });
  if(game.resumeFailCount>=PROB_REVEAL_FAILS&&!game.showProbabilities){
    game.showProbabilities=true;
    addLog('📋 社会勋章·应聘专家 — 求职详情显示通过概率','success');
  }
}
function confirmInterview(inboxId){
  syncInviteExpiryState();
  const item=game.inbox.find(x=>x.id===inboxId&&x.type==='interview'&&!x.attended&&!x.invalid);
  if(!item)return;
  const app=game.applications.find(a=>a.id===inboxId);
  if(!app||!isInviteActionable(app,item)){addLog('该面试邀请已失效','fail');return}
  if(game.week>=app.interviewWeek){addLog('已过确认截止（面试周已开始），无法答应','fail');return}
  if(!app.interviewSlot)app.interviewSlot=item.interviewSlot||pickInterviewSlot(app.interviewWeek,app.id);
  if(isInterviewSlotTaken(app.interviewWeek,app.interviewSlot,app.id)){
    addLog(interviewSlotLabel(app.interviewSlot)+' 已有其他面试，该时段只能参加一场','fail');return;
  }
  if(hasInterviewTravelConflict(app,app.interviewWeek,app.interviewSlot)){
    let msg='与已确认面试冲突';
    if(hasAccommodationRecoveryBlock(app.interviewWeek))msg='上一周远城面试需休息，本周无法安排新面试';
    else if(hasNextWeekBlockForAccommodation(app))msg='远城面试含住宿，面试后一周无法排其他场次';
    else if(isInterviewOnline(app))msg='该时段已有其他面试';
    else msg='异地或同日上午无法赶两场（'+getCompanyCity(app.offer.company)+'）';
    addLog(msg,'fail');return;
  }
  app.status='interview_confirmed';
  item.confirmed=true;
  item.replied=true;
  const slotTxt=interviewSlotLabel(app.interviewSlot);
  pushInboxMail({id:app.id+'_reply_confirm',appId:app.id,type:'interview_reply',week:game.week,jobIdx:app.jobIdx,
    company:item.company,interviewWeek:app.interviewWeek,interviewSlot:app.interviewSlot,offer:app.offer,
    msg:'已回复 '+item.company+'：确认参加 '+getDateStr(app.interviewWeek)+' '+slotTxt+' 的面试。'});
  markInboxItemsRead([item]);
  expireConflictingInvites(app);
  const costNote=formatInterviewCostDesc(app);
  addLog('📅 已确认 '+item.company+' 面试（'+getDateStr(app.interviewWeek)+' '+interviewSlotLabel(app.interviewSlot)+' · '+costNote+'）','info');
  updateLongDistanceStatus();
  refreshInboxViews();renderInterviewCalendar();updateUI();
}
function attendInterviewSlot(inboxId){
  const app=game.applications.find(a=>a.id===inboxId);
  if(!app||app.status!=='interview_confirmed'){addLog('面试状态无效','fail');return}
  const blockReason=interviewAttendBlockReason(app);
  if(blockReason){addLog(blockReason,'fail');return}
  if(!canAttendInterviewNow(app)){addLog('须按时间顺序参加当日面试（不能先参加晚场）','fail');return}
  const d=game.daily;
  const prevUsed=d?d.slotHoursUsed:0;
  const prevActivity=d?d.slotActivity:null;
  if(!applyInterviewDayTimeCost(app))return;
  const offer=app.offer;
  const bill=calcInterviewAttendanceCost(app,true);
  const fee=bill.cost;
  if(game.cash<fee){
    if(d){d.slotHoursUsed=prevUsed||0;d.slotActivity=prevActivity;}
    addLog('面试费用 ¥'+fee+' 不足','fail');
    if(typeof renderDailyPanel==='function')renderDailyPanel();
    return;
  }
  if(fee>0){game.cash-=fee;game.jobHuntSpent+=fee;ledgerRecordJobHunt(fee,'面试费用')}
  app.interviewHeld=true;
  app.status='interview_scheduled';
  const job=game.market[app.jobIdx];
  app.resultWeek=app.interviewWeek+companyProcessDelay(offer,job,'hiringResult');
  const item=game.inbox.find(x=>x.id===inboxId&&x.type==='interview');
  if(item)item.attended=true;
  const modeTxt=isInterviewOnline(app)?'在线面试':interviewModeLabel(app);
  const hourNote=isInterviewOnline(app)&&game.daily&&!(typeof _companionActor!=='undefined'&&_companionActor)?
    ' · 白天已用'+game.daily.slotHoursUsed+'/'+SLOT_HOURS_TOTAL+'h':'';
  pushInboxMail({id:app.id+'_attend_confirm',appId:app.id,type:'interview_done',week:game.week,jobIdx:app.jobIdx,
    company:offer.company.name,interviewWeek:app.interviewWeek,interviewSlot:app.interviewSlot,offer,
    msg:offer.company.name+' 面试出席确认：您已按约参加 '+getDateStr(app.interviewWeek)+' '+interviewSlotLabel(app.interviewSlot)+' 的'+modeTxt+'。'});
  addLog('🎤 '+interviewSlotLabel(app.interviewSlot)+' '+modeTxt+'：'+offer.company.name+'（'+IMP_LABEL[offer.importance]+(fee?' ¥'+fee:'')+hourNote+'）','info');
  if(!isInterviewOnline(app)&&isRemoteCompany(offer.company)&&typeof recordRemoteInterview==='function')recordRemoteInterview();
  if(!(typeof _companionActor!=='undefined'&&_companionActor)&&typeof dailyAdvanceAfterSlotAction==='function'){
    const d=game.daily;
    if(!isInterviewOnline(app)&&d&&d.slotHoursUsed>=SLOT_HOURS_TOTAL)dailyAdvanceAfterSlotAction();
    else if(isInterviewOnline(app)&&d&&d.slotHoursUsed>=SLOT_HOURS_TOTAL)dailyAdvanceAfterSlotAction();
    else if(typeof renderDailyPanel==='function')renderDailyPanel();
  }
  refreshInboxViews();renderInterviewCalendar();updateUI();
  if(typeof autoSaveSlot==='function'&&!(typeof _companionActor!=='undefined'&&_companionActor))autoSaveSlot();
}
function skipInterviewAttend(inboxId){
  const app=game.applications.find(a=>a.id===inboxId);
  if(!app||app.status!=='interview_confirmed'||game.week!==app.interviewWeek){addLog('仅面试日当天可选择放弃到场','fail');return}
  app.status='missed';app.interviewHeld=true;
  const item=game.inbox.find(x=>x.id===inboxId&&x.type==='interview');
  markInboxInvalid(item,'已放弃到场');
  const slotTxt=interviewSlotLabel(app.interviewSlot);
  pushInboxMail({id:app.id+'_missed_mail',appId:app.id,type:'interview_missed',week:game.week,jobIdx:app.jobIdx,
    company:app.offer.company.name,interviewWeek:app.interviewWeek,interviewSlot:app.interviewSlot,offer:app.offer,
    msg:app.offer.company.name+' 面试缺席通知：您已放弃 '+getDateStr(app.interviewWeek)+' '+slotTxt+' 的面试。'});
  addLog('未前往 '+app.offer.company.name+' 面试','warn');
  refreshInboxViews();renderInterviewCalendar();updateUI();
}
function attendInterview(inboxId){
  const app=game.applications.find(a=>a.id===inboxId);
  if(app&&app.status==='interview_confirmed'&&game.week===app.interviewWeek)attendInterviewSlot(inboxId);
  else confirmInterview(inboxId);
}
function declineInterview(inboxId){
  const item=game.inbox.find(x=>x.id===inboxId);
  if(!item||item.invalid)return;
  const app=game.applications.find(a=>a.id===inboxId);
  if(app)app.status='declined';
  markInboxInvalid(item,'已放弃');
  markInboxItemsRead([item]);
  addLog('已放弃 '+item.company+' 面试','info');
  refreshInboxViews();
  renderInterviewCalendar();
  updateLongDistanceStatus();
  if(typeof updateUI==='function')updateUI();
}
function buyDateNight(){
  if(!game||game.gameOver)return;
  if(typeof hasPrimaryPartner!=='function'||!hasPrimaryPartner()){addLog('需恋爱、同居或已婚才可约会','fail');return}
  if(game.longDistance){addLog('异地请使用线上约会','fail');return}
  buyDateNightDaily();
}
function buyOnlineDate(){
  if(!game||game.gameOver)return;
  if(typeof hasPrimaryPartner!=='function'||!hasPrimaryPartner()){addLog('需恋爱、同居或已婚才可约会','fail');return}
  if(!game.longDistance){addLog('同城请通过日常外出约会','fail');return}
  buyOnlineDateDaily();
}
function buyDateNightDaily(){
  if(!game||game.gameOver)return false;
  if(typeof hasPrimaryPartner!=='function'||!hasPrimaryPartner()){addLog('需恋爱、同居或已婚才可约会','fail');return false}
  if(game.longDistance){addLog('异地请使用线上约会','fail');return false}
  if(!spendCash(DATE_COST,'约会'))return false;
  game.lastDateWeek=game.week;
  addStress(-5,'约会 ');
  if(typeof bumpPartnerRomanceSocial==='function')bumpPartnerRomanceSocial(1,0,1);
  else adjustSpouseIntimacy(1);
  addLog('💑 与伴侣约会','info');
  renderSpendingPanel();updateUI();
  return true;
}
function buyOnlineDateDaily(){
  if(!game||game.gameOver)return false;
  if(typeof hasPrimaryPartner!=='function'||!hasPrimaryPartner()){addLog('需恋爱、同居或已婚才可约会','fail');return false}
  if(!game.longDistance){addLog('同城请线下约会','fail');return false}
  game.lastDateWeek=game.week;
  addStress(-2,'线上约会 ');
  if(typeof bumpPartnerRomanceSocial==='function'){
    if(Math.random()<0.5)bumpPartnerRomanceSocial(1,0,1);
    else bumpPartnerRomanceSocial(-1,0,-1);
  }else if(Math.random()<0.5)adjustSpouseIntimacy(1);
  else adjustSpouseIntimacy(-1);
  addLog('📱 与伴侣视频约会','info');
  renderSpendingPanel();updateUI();
  return true;
}
function buyGameConsole(){
  if(!game||game.gameOver)return;
  if(game.ownsConsole){addLog('已拥有游戏机','fail');return}
  if(!spendCash(CONSOLE_COST,'游戏机'))return;
  game.ownsConsole=true;addLog('🎮 购入游戏机 ¥'+CONSOLE_COST,'info');
  renderSpendingPanel();updateUI();
}
function playGameConsole(){
  if(!game||game.gameOver)return;
  if(!game.ownsConsole){addLog('请先购买游戏机','fail');return}
  const c=ensureConsumption();if(!c||c.consolePlayed){addLog('本周已打过游戏','fail');return}
  c.consolePlayed=true;
  if(Math.random()<0.5){addStress(-1,'打游戏 ');addLog('🎮 打游戏大捷','success')}
  else{addStress(1,'打游戏 ');addLog('🎮 打游戏连跪','warn')}
  renderSpendingPanel();updateUI();
}
function buyComputer(){
  if(!game||game.gameOver)return;
  if(game.ownsComputer){addLog('已拥有电脑','fail');return}
  if(!spendCash(COMPUTER_COST,'电脑'))return;
  game.ownsComputer=true;addLog('💻 购入电脑 ¥'+COMPUTER_COST,'info');
  renderSpendingPanel();updateUI();
}
function useComputer(){
  if(!game||game.gameOver)return;
  if(!game.ownsComputer){addLog('请先购买电脑','fail');return}
  const c=ensureConsumption();if(!c||c.computerUsed){addLog('本周已使用过电脑','fail');return}
  c.computerUsed=true;
  const roll=Math.random();
  if(roll<0.22){
    const rel=REFERRER_RELATIONS[Math.floor(Math.random()*REFERRER_RELATIONS.length)];
    const name=REFERRER_NAMES[Math.floor(Math.random()*REFERRER_NAMES.length)];
    game.referralOpportunity=generateReferralOpportunity();
    if(game.referralOpportunity){
      addLog('💻 失联多年的'+name+'（'+rel+'）联系上你，带来内推机会','success');
      updateReferralButton();
    }else addLog('💻 联系上老同学，但暂时没有合适内推','info');
  }else if(roll<0.44){
    const s=game.stocks[Math.floor(Math.random()*game.stocks.length)];
    addLog('💻 群友推荐股票 '+s.name+'（'+s.symbol+'）· 盈亏自负','info');
  }else if(roll<0.58){
    game.casinoCoupons=(game.casinoCoupons||0)+1;
    addLog('💻 捞到一张澳门赌场优惠券（下次入场减¥500）','success');
  }else{
    addStress(2,'玩电脑一无所获 ');
    addLog('💻 刷了一夜论坛，毫无收获','warn');
  }
  renderSpendingPanel();updateUI();
}
let consumeModalOpen=false;
function scrollSessionsLeft(){
  const c=ensureConsumption();
  return SCROLL_WEEKLY_LIMIT-((c&&c.scrollSessions)||0);
}
function useScrollHours(n){
  n=Math.max(1,Math.floor(n)||1);
  const c=ensureConsumption();
  if(!c)return 0;
  const left=scrollSessionsLeft();
  const use=Math.min(n,left);
  if(use<=0)return 0;
  c.scrollSessions=(c.scrollSessions||0)+use;
  return use;
}
function useScrollHour(){return useScrollHours(1)===1}
function scrollHourBlocked(){
  if(scrollSessionsLeft()<=0){addLog('本周刷手机已达 '+SCROLL_WEEKLY_LIMIT+' 小时上限','fail');return true}
  return false;
}
function scrollBatchBlocked(hours){
  const left=scrollSessionsLeft();
  if(left<hours){
    addLog('本周只剩 '+left+' 小时，无法连刷 '+hours+' 小时','fail');
    return true;
  }
  return false;
}
function scrollHoursLabel(h){return h===1?'1 小时':h===8?'8连抽（8小时）':h+' 小时'}
function renderScrollActionBtns(fn,hourBtn){
  const left=scrollSessionsLeft();
  const off=left<=0;
  const mk=(label,h,dis)=>'<button class="btn"'+(dis?' disabled':'')+' onclick="'+fn+'('+h+')">'+label+'</button>';
  if(off)return mk(hourBtn,1,true)+mk('8连抽',8,true);
  return mk(hourBtn,1,false)+mk('8连抽',8,left<8);
}
function stressOnIncrease(oldVal,add,threshold,delta,reason){
  let total=0;
  for(let i=1;i<=add;i++){
    if((oldVal+i)%threshold===0)total+=delta;
  }
  if(total)addStress(total,reason);
  return total;
}
function untilThreshold(count,threshold){
  const m=count%threshold;
  return m===0?threshold:threshold-m;
}
function hasMobileAdFree(){return game&&game.week<(game.mobileAdFreeUntilWeek||0)}
function scrollBudgetLine(){return '本周剩余 <b>'+scrollSessionsLeft()+'</b>/'+SCROLL_WEEKLY_LIMIT+' 小时'}
function mobileAdHint(c){
  if(hasMobileAdFree())return '免广告至 '+getDateStr(game.mobileAdFreeUntilWeek);
  return '本周广告 '+c.mobileAds+' 次（再 '+untilThreshold(c.mobileAds,MOBILE_AD_STRESS)+' 次可能 +1 压力）';
}
function watchMobileAd(c){
  if(hasMobileAdFree())return 0;
  const old=c.mobileAds||0;
  c.mobileAds=old+1;
  return stressOnIncrease(old,1,MOBILE_AD_STRESS,1,'手游广告 ');
}
function mobileWinChance(played){return played<20?0.5:Math.max(0.12,0.5-(played-20)*0.025)}
function showConsumeModal(opts){
  if(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating()){
    if(opts&&opts.title&&typeof autoLifeNote==='function')autoLifeNote((opts.icon||'')+' '+opts.title+'（自动略过）');
    return;
  }
  const el=document.getElementById('consumeOverlay');
  const ic=document.getElementById('consumeIcon');
  const ti=document.getElementById('consumeTitle');
  const ms=document.getElementById('consumeMsg');
  const acts=document.getElementById('consumeActions');
  if(!el)return;
  if(ic)ic.textContent=opts.icon||'📱';
  if(ti)ti.textContent=opts.title||'';
  if(ms)ms.innerHTML=opts.html||'';
  if(acts){
    acts.innerHTML='';
    (opts.buttons||[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]).forEach(b=>{
      const btn=document.createElement('button');
      btn.className='btn'+(b.primary?' btn-primary':'');
      btn.textContent=b.text;
      btn.type='button';
      if(b.fn)btn.addEventListener('click',function(e){
        e.preventDefault();
        try{(0,eval)(b.fn)}catch(err){console.error('consumeModal',b.fn,err)}
      });
      acts.appendChild(btn);
    });
  }
  el.classList.remove('hidden');
  consumeModalOpen=true;
}
function showConsumeModalHandlers(opts){
  if(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating()){
    if(opts&&opts.title&&typeof autoLifeNote==='function')autoLifeNote((opts.icon||'')+' '+opts.title+'（自动略过）');
    return;
  }
  const el=document.getElementById('consumeOverlay');
  const ic=document.getElementById('consumeIcon');
  const ti=document.getElementById('consumeTitle');
  const ms=document.getElementById('consumeMsg');
  const acts=document.getElementById('consumeActions');
  if(!el)return;
  if(ic)ic.textContent=opts.icon||'📱';
  if(ti)ti.textContent=opts.title||'';
  if(ms)ms.innerHTML=opts.html||'';
  if(acts){
    acts.innerHTML='';
    const btns=(opts.buttons&&opts.buttons.length)?opts.buttons:[{text:'知道了',primary:true,handler:function(){closeConsumeModal();}}];
    btns.forEach(function(b){
      const btn=document.createElement('button');
      btn.className='btn'+(b.primary?' btn-primary':'');
      btn.textContent=b.text;
      btn.type='button';
      if(b.handler)btn.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        b.handler();
      });
      acts.appendChild(btn);
    });
  }
  el.classList.remove('hidden');
  consumeModalOpen=true;
}
function closeConsumeModal(skipUi){
  const el=document.getElementById('consumeOverlay');
  if(el)el.classList.add('hidden');
  consumeModalOpen=false;
  if(typeof encounterModalConsumeClosed==='function')encounterModalConsumeClosed();
  if(game&&game._resumeOvertimeAfterModal){
    game._resumeOvertimeAfterModal=false;
    if(game.daily&&game.daily.inOvertime&&typeof showOvertimeChoiceModal==='function'){
      showOvertimeChoiceModal();
      return;
    }
  }
  if(game&&game._resumeWorkShiftAfterModal){
    game._resumeWorkShiftAfterModal=false;
    if(typeof returnToWorkShiftModal==='function'){
      returnToWorkShiftModal();
      return;
    }
  }
  if(skipUi)return;
  renderSpendingPanel();updateUI();
}
function mobileGamePaySave(){
  if(!game)return;
  if(game.cash<MOBILE_PAY_COST){
    addStress(1,'手游败 ');
    addLog('手游氪金失败，认输 +1 压力','fail');
  }else{
    game.cash-=MOBILE_PAY_COST;
    game.lifestyleSpent=(game.lifestyleSpent||0)+MOBILE_PAY_COST;
    ledgerAddExpense('lifestyle','🎮','手游氪金',MOBILE_PAY_COST,false);
    addStress(-1,'手游氪金翻盘 ');
    addLog('手游氪金 ¥'+MOBILE_PAY_COST+' 翻盘减压','info');
  }
  closeConsumeModal();
}
function mobileGameAcceptLoss(){
  if(game)addStress(1,'手游败 ');
  closeConsumeModal();
}
function runShortVideoSession(c){
  let boring=0,trash=0,interesting=0;
  for(let i=0;i<SV_VIEWS_PER_CLICK;i++){
    const r=Math.random();
    if(r<0.55)boring++;
    else if(r<0.80)trash++;
    else interesting++;
  }
  const oldTrash=c.svTrash,oldFun=c.svInteresting;
  c.svBoring+=boring;c.svTrash+=trash;c.svInteresting+=interesting;
  const stressUp=stressOnIncrease(oldTrash,trash,SV_TRASH_STRESS,1,'短视频垃圾 ');
  const stressDown=stressOnIncrease(oldFun,interesting,SV_FUN_STRESS,-1,'短视频有趣 ');
  return {boring,trash,interesting,stressUp,stressDown};
}
function consumeShortVideo(hours){
  hours=Math.max(1,Math.floor(hours)||1);
  if(!game||game.gameOver)return;
  if(hours>1?scrollBatchBlocked(hours):scrollHourBlocked())return;
  const used=useScrollHours(hours);
  if(!used)return;
  const c=ensureConsumption();
  const tot={boring:0,trash:0,interesting:0,stressUp:0,stressDown:0};
  for(let h=0;h<used;h++){
    const r=runShortVideoSession(c);
    tot.boring+=r.boring;tot.trash+=r.trash;tot.interesting+=r.interesting;
    tot.stressUp+=r.stressUp;tot.stressDown+=r.stressDown;
  }
  const views=used*SV_VIEWS_PER_CLICK;
  let html='耗费 <b>'+scrollHoursLabel(used)+'</b> · 共刷 <b>'+views+'</b> 条<br>';
  html+='无聊 '+tot.boring+' · 垃圾 '+tot.trash+' · 有趣 '+tot.interesting+'<br>';
  html+=scrollBudgetLine()+'<br>';
  html+='累计垃圾 '+c.svTrash+'（再 '+untilThreshold(c.svTrash,SV_TRASH_STRESS)+' 条可能 +1 压力）<br>';
  html+='累计有趣 '+c.svInteresting+'（再 '+untilThreshold(c.svInteresting,SV_FUN_STRESS)+' 条可 -1 压力）';
  if(tot.stressUp)html+='<br><b>压力 +'+tot.stressUp+'</b>';
  if(tot.stressDown)html+='<br><b>减压 '+Math.abs(tot.stressDown)+'</b>';
  addLog('📱 刷短视频 '+scrollHoursLabel(used),'info');
  showConsumeModal({icon:'📱',title:used>1?'短视频 · 连刷'+used+'小时':'短视频',html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
}
function runShortDramaSession(c){
  const prev=c.dramaViews;
  c.dramaViews++;
  const isFinale=c.dramaViews%2===0;
  let cliff=0,stressDown=0;
  if(isFinale)stressDown=stressOnIncrease(prev,1,DRAMA_STRESS_PAIR,-1,'短剧 ');
  else if(Math.random()<DRAMA_CLIFF_CHANCE){addStress(1,'短剧断章 ');cliff=1}
  return {isFinale,cliff,stressDown,episode:c.dramaViews};
}
function consumeShortDrama(hours){
  hours=Math.max(1,Math.floor(hours)||1);
  if(!game||game.gameOver)return;
  if(hours>1?scrollBatchBlocked(hours):scrollHourBlocked())return;
  const used=useScrollHours(hours);
  if(!used)return;
  const c=ensureConsumption();
  let finales=0,cliffs=0,stressDown=0;
  for(let h=0;h<used;h++){
    const r=runShortDramaSession(c);
    if(r.isFinale)finales++;
    cliffs+=r.cliff;
    stressDown+=r.stressDown;
  }
  let html='耗费 <b>'+scrollHoursLabel(used)+'</b> · 共看 <b>'+used+'</b> 集<br>';
  html+='大结局 '+finales+' 次 · 断章加压 '+cliffs+' 次<br>';
  html+=scrollBudgetLine()+'<br>';
  html+='本周已看 '+c.dramaViews+' 集（再 '+untilThreshold(c.dramaViews,DRAMA_STRESS_PAIR)+' 集凑满一对可减压）';
  if(stressDown)html+='<br><b>减压 '+Math.abs(stressDown)+'</b>';
  if(cliffs)html+='<br><b>断章压力 +'+cliffs+'</b>';
  addLog('📺 刷短剧 '+scrollHoursLabel(used),'info');
  showConsumeModal({icon:'📺',title:used>1?'短剧 · 连刷'+used+'小时':'短剧',html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
}
function runFlirtSession(c){
  let hot=0,silent=0,awkward=0;
  const people=3+Math.floor(Math.random()*6);
  game.flirtPeopleTotal=(game.flirtPeopleTotal||0)+people;
  for(let i=0;i<FLIRT_CHATS_PER_SESSION;i++){
    const r=Math.random();
    if(r<0.22)hot++;
    else if(r<0.62)silent++;
    else awkward++;
  }
  const oldS=c.flirtSilent,oldA=c.flirtAwkward;
  c.flirtHot+=hot;c.flirtSilent+=silent;c.flirtAwkward+=awkward;
  if(hot)addStress(-hot,'聊骚火热 ');
  const stressSilent=stressOnIncrease(oldS,silent,FLIRT_SILENT_STRESS,1,'聊骚无聊 ');
  const stressAwk=stressOnIncrease(oldA,awkward,FLIRT_AWKWARD_STRESS,1,'聊骚尬聊 ');
  return {hot,silent,awkward,people,stressSilent,stressAwk};
}
function consumeFlirt(hours){
  hours=Math.max(1,Math.floor(hours)||1);
  if(!game||game.gameOver)return;
  if(hours>1?scrollBatchBlocked(hours):scrollHourBlocked())return;
  const used=useScrollHours(hours);
  if(!used)return;
  const c=ensureConsumption();
  const tot={hot:0,silent:0,awkward:0,people:0,stressSilent:0,stressAwk:0};
  for(let h=0;h<used;h++){
    const r=runFlirtSession(c);
    tot.hot+=r.hot;tot.silent+=r.silent;tot.awkward+=r.awkward;
    tot.people+=r.people;tot.stressSilent+=r.stressSilent;tot.stressAwk+=r.stressAwk;
  }
  const chats=used*FLIRT_CHATS_PER_SESSION;
  let html='耗费 <b>'+scrollHoursLabel(used)+'</b> · 连聊 <b>'+chats+'</b> 人<br>';
  html+='火热 '+tot.hot+' · 无话可说 '+tot.silent+' · 尬聊 '+tot.awkward+'<br>';
  html+='新认识 <b>'+tot.people+'</b> 人 · 累计聊过 <b>'+game.flirtPeopleTotal+'</b> 人<br>';
  html+=scrollBudgetLine()+'<br>';
  html+='累计无话可说 '+c.flirtSilent+'（再 '+untilThreshold(c.flirtSilent,FLIRT_SILENT_STRESS)+' 次可能 +1 压力）<br>';
  html+='累计尬聊 '+c.flirtAwkward+'（再 '+untilThreshold(c.flirtAwkward,FLIRT_AWKWARD_STRESS)+' 次可能 +1 压力）';
  if(tot.hot)html+='<br><b>减压 '+tot.hot+'</b>（火热）';
  if(tot.stressSilent)html+='<br><b>压力 +'+tot.stressSilent+'</b>';
  if(tot.stressAwk)html+='<br><b>压力 +'+tot.stressAwk+'</b>';
  addLog('💬 聊骚 '+scrollHoursLabel(used),'info');
  showConsumeModal({icon:'💬',title:used>1?'聊骚 · 连刷'+used+'小时':'聊骚',html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
}
function runMobileGameSession(c,autoLoss){
  const played=c.mobileGames||0;
  const win=Math.random()<mobileWinChance(played);
  c.mobileGames=played+1;
  const adStress=watchMobileAd(c);
  if(win){addStress(-1,'手游胜 ');return {win:true,adStress}}
  if(autoLoss){addStress(1,'手游败 ');return {win:false,adStress}}
  return {win:false,adStress,pending:true};
}
function consumeMobileGame(hours){
  hours=Math.max(1,Math.floor(hours)||1);
  if(!game||game.gameOver)return;
  if(hours>1?scrollBatchBlocked(hours):scrollHourBlocked())return;
  const used=useScrollHours(hours);
  if(!used)return;
  const c=ensureConsumption();
  if(used===1){
    const r=runMobileGameSession(c,false);
    addLog('🎮 手游 1 小时','info');
    if(r.win){
      let html='耗费 1 小时 · <b>赢了！减压 1</b><br>';
      if(!hasMobileAdFree())html+='看了 1 条广告<br>';
      if(r.adStress)html+='<b>广告看太多，压力 +'+r.adStress+'</b><br>';
      html+=mobileAdHint(c)+'<br>'+scrollBudgetLine()+'<br>';
      html+='已玩 '+c.mobileGames+' 局（超过 20 局后胜率逐渐下降）';
      showConsumeModal({icon:'🎮',title:'手游',html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
      return;
    }
    let html='耗费 1 小时 · <b>输了</b>，默认 +1 压力<br>';
    if(!hasMobileAdFree())html+='看了 1 条广告<br>';
    if(r.adStress)html+='<b>广告看太多，压力 +'+r.adStress+'</b><br>';
    html+=mobileAdHint(c)+'<br>'+scrollBudgetLine()+'<br>';
    html+='可氪金 <b>¥'+MOBILE_PAY_COST+'</b> 翻盘减压，或认输';
    showConsumeModal({
      icon:'🎮',title:'手游 · 输了',html,
      buttons:[
        {text:'氪金 ¥'+MOBILE_PAY_COST+' 翻盘',primary:true,fn:'mobileGamePaySave()'},
        {text:'认输 +1 压力',fn:'mobileGameAcceptLoss()'}
      ]
    });
    return;
  }
  let wins=0,losses=0,adStress=0;
  for(let h=0;h<used;h++){
    const r=runMobileGameSession(c,true);
    if(r.win)wins++;else losses++;
    adStress+=r.adStress||0;
  }
  let html='耗费 <b>'+scrollHoursLabel(used)+'</b> · 共 <b>'+used+'</b> 局<br>';
  html+='胜 '+wins+' · 负 '+losses+'（连刷自动认输，不可氪金翻盘）<br>';
  if(!hasMobileAdFree())html+='广告约 '+used+' 条<br>';
  if(adStress)html+='<b>广告压力 +'+adStress+'</b><br>';
  html+=mobileAdHint(c)+'<br>'+scrollBudgetLine()+'<br>';
  html+='累计已玩 '+c.mobileGames+' 局';
  addLog('🎮 手游连刷 '+scrollHoursLabel(used)+'（'+wins+'胜'+losses+'负）','info');
  showConsumeModal({icon:'🎮',title:'手游 · 连刷'+used+'小时',html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
}
function buyMobileAdFree(){
  if(!game||game.gameOver)return;
  if(hasMobileAdFree()){addLog('手游免广告仍有效','warn');return}
  if(!spendCash(MOBILE_ADFREE_COST,'手游免广告'))return;
  game.mobileAdFreeUntilWeek=game.week+MOBILE_ADFREE_WEEKS;
  addLog('📵 手游免广告 '+MOBILE_ADFREE_WEEKS+' 周','info');
  renderSpendingPanel();updateUI();
}
function renderSpendingPanel(){
  const el=document.getElementById('spendingPanel');
  if(!el||!game)return;
  const c=ensureConsumption();
  const scrollLeft=scrollSessionsLeft();
  const scrollOff=scrollLeft<=0;
  const stock=game.snackStock||0;
  const artifactRows=typeof renderArtifactSpendingRows==='function'?renderArtifactSpendingRows():[];
  const fertRows=typeof renderFertilitySpendingRows==='function'?renderFertilitySpendingRows():[
    {label:'备孕 ¥'+PROC_CREATE_COST,meta:'在宅家备孕',btn:'备孕',fn:'setProcreateIntent()',off:!game.married||game.divorced||game.hasChildren||game.pregnant}
  ];
  const abortRow=typeof renderAbortionSpendingRow==='function'?renderAbortionSpendingRow():null;
  const paternityRow=typeof renderPaternitySpendingRow==='function'?renderPaternitySpendingRow():null;
  const rows=artifactRows.concat(fertRows).concat(abortRow?[abortRow]:[]).concat(paternityRow?[paternityRow]:[]).concat([
    {label:game.ownsConsole?'游戏机（已购）':'游戏机 ¥'+CONSOLE_COST,meta:game.ownsConsole?'在宅家时段使用 · 本周'+(c.consolePlayed?'已玩':'可玩'):'一次性购买',btn:game.ownsConsole?'已购':'买',fn:'buyGameConsole()',off:!!game.ownsConsole},
    {label:game.ownsComputer?'电脑（已购）':'电脑 ¥'+COMPUTER_COST,meta:game.ownsComputer?'在宅家时段使用 · 本周'+(c.computerUsed?'已用':'可用'):'一次性购买',btn:game.ownsComputer?'已购':'买',fn:'buyComputer()',off:!!game.ownsComputer}
  ]);
  let html='<div class="spend-row"><div><div>🍿 零食囤货 · 库存 <b>'+stock+'</b> 份</div>'+
    '<div class="spend-meta">单价 ¥'+SNACK_UNIT_COST+'/份 · 宅家进食 · 每10压力+1份（最多'+SNACK_PORTIONS_CAP+'份）· 隔天反弹（至少净减'+SNACK_MIN_NET_RELIEF+'压力）</div></div>'+
    '<div class="spend-btns">'+
    '<button class="btn" onclick="buySnackBulk(1)">买1</button> '+
    '<button class="btn" onclick="buySnackBulk(10)">买10·'+snackBulkDiscountLabel(10)+'</button> '+
    '<button class="btn" onclick="buySnackBulk(100)">买100·'+snackBulkDiscountLabel(100)+'</button> '+
    '<button class="btn" onclick="buySnackBulk(1000)">买1000·'+snackBulkDiscountLabel(1000)+'</button>'+
    '</div></div>';
  if(game.casinoCoupons>0)html+='<div class="spend-owned">🎟 赌场优惠券 ×'+game.casinoCoupons+'</div>';
  if(!hasMobileAdFree())html+='<div class="spend-row"><div><div>手游免广告 ¥'+MOBILE_ADFREE_COST+'/月</div><div class="spend-meta">本月不再看广告（仍计时长）</div></div><button class="btn" onclick="buyMobileAdFree()">开通</button></div>';
  else html+='<div class="spend-owned">📵 手游免广告至 '+getDateStr(game.mobileAdFreeUntilWeek)+'</div>';
  rows.forEach(r=>{
    const btns=r.btn?'<button class="btn" '+(r.off?'disabled':'')+(r.fn?' onclick="'+r.fn+'"':'')+'>'+r.btn+'</button>':'<span class="fold-meta">—</span>';
    html+='<div class="spend-row"><div><div>'+r.label+'</div><div class="spend-meta">'+r.meta+'</div></div>'+
      '<div class="spend-btns">'+btns+'</div></div>';
  });
  el.innerHTML=html;
}
function negotiateOffer(offerId){
  const o=game.offers.find(x=>x.id===offerId);
  if(!o||game.week>o.expireWeek)return;
  if(o.negotiated){addLog('薪资已洽谈过，请直接签约','warn');return}
  o.negotiated=true;
  const roll=Math.random();
  let bump=0;
  if(roll<0.32)bump=Math.round(o.offer.annualPay*(0.04+Math.random()*0.1));
  else if(roll<0.58)bump=Math.round(o.offer.annualPay*(0.01+Math.random()*0.04));
  o.finalPay=o.offer.annualPay+bump;
  o.stage='contract';
  addLog('💬 '+o.offer.company.name+' 洽谈后年薪 ¥'+o.finalPay.toLocaleString()+(bump?('（+'+bump+'）'):'（未上调）'),'info');
  renderOffers();
}
function signContractOffer(offerId){
  const o=game.offers.find(x=>x.id===offerId);
  if(!o||game.week>o.expireWeek)return;
  if(!o.negotiated){addLog('请先与企业洽谈薪资待遇','warn');return}
  const app=game.applications.find(a=>a.id===offerId);
  if(app&&app.method==='headhunter'){
    const fee=Math.round((o.finalPay||o.offer.annualPay)*.2);
    if(game.cash>=fee){game.cash-=fee;game.jobHuntSpent+=fee;ledgerRecordJobHunt(fee,'猎头签约费')}else game.headhunterDebt+=fee;
  }
  o.contractSigned=true;o.accepted=true;o.stage='waiting';
  const pay=o.finalPay||o.offer.annualPay;
  game.pendingHire={jobIdx:o.jobIdx,offer:{...o.offer,annualPay:pay},viaReferral:!!(app&&app.viaReferral),startWeek:o.startWeek,finalPay:pay};
  game.offers=game.offers.filter(x=>x.id!==offerId);
  const wait=o.startWeek<=game.week+1?'即将':'预计 '+getDateStr(o.startWeek);
  addLog('📝 与 '+o.offer.company.name+' 签订合同 · '+wait+' 上岗','success');
  renderOffers();
  if(!(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating()))updateUI();
}
function acceptOffer(offerId){signContractOffer(offerId)}
function declineOffer(offerId){
  const o=game.offers.find(x=>x.id===offerId);
  if(!o)return;
  o.accepted=true;
  game.expiredOfferCount++;
  addLog('拒绝 '+o.offer.company.name+' Offer','info');
  renderOffers();
}
function getPlannedPendingEntries(){
  if(!game||!game.applications)return [];
  return game.applications.filter(a=>
    a.status==='pending'&&(a.planned||a.offer&&a.offer.planned)&&a.replyWeek!=null
  ).sort((a,b)=>a.replyWeek-b.replyWeek||String(a.id).localeCompare(String(b.id)));
}
function getInterviewCalendarEntries(){
  if(!game||!game.applications)return [];
  return game.applications.filter(a=>
    (a.status==='interview_invite'||a.status==='interview_confirmed')&&a.interviewWeek!=null&&a.interviewWeek>=game.week-1
  ).sort((a,b)=>a.interviewWeek-b.interviewWeek||String(a.id).localeCompare(String(b.id)));
}
function getAllCalendarInterviewEntries(){
  if(!game||!game.applications)return [];
  return game.applications.filter(a=>
    (a.status==='interview_invite'||a.status==='interview_confirmed')&&a.interviewWeek!=null
  ).sort((a,b)=>a.interviewWeek-b.interviewWeek||String(a.id).localeCompare(String(b.id)));
}
function calAppTitle(a){
  const job=game.market[a.jobIdx];
  return job?job.title:IMP_LABEL[a.offer.importance];
}
function renderCalPlannedList(plannedPending){
  if(!plannedPending.length)return '';
  const byCo={};
  plannedPending.forEach(a=>{
    const co=a.offer.company.name;
    if(!byCo[co])byCo[co]=[];
    byCo[co].push(a);
  });
  const sectionOpen=!!plannedFoldOpen;
  let html='<div class="cal-planned-list cal-planned-fold" onclick="event.stopPropagation()">';
  html+='<div class="cal-planned-hdr inbox-fold-hdr" onclick="togglePlannedFold()">'+
    '<span><b style="color:var(--blue)">预定招聘</b> <span class="fold-meta">等待筛选 · '+plannedPending.length+' 条</span></span>'+
    '<span>'+(sectionOpen?'▼':'▶')+'</span></div>';
  if(sectionOpen){
    html+='<div class="inbox-fold-body">';
    Object.keys(byCo).sort((a,b)=>a.localeCompare(b,'zh-CN')).forEach(co=>{
      const rows=byCo[co];
      const open=plannedExpandedCompanies.has(co);
      html+='<div class="inbox-fold-hdr" onclick="togglePlannedCompany(\\''+co.replace(/'/g,"\\'")+'\\')">'+
        '<span><b>'+co+'</b> <span class="fold-meta">'+rows.length+' 条</span></span><span>'+(open?'▼':'▶')+'</span></div>';
      if(open){
        html+='<div class="inbox-fold-body">';
        rows.forEach(a=>{
          const title=calAppTitle(a);
          const startNote=a.offer&&a.offer.startDelayWeeks?' · 入职约'+getDateStr(a.applyWeek+a.offer.startDelayWeeks):'';
          html+='<div class="cal-planned-row">'+getDateStr(a.replyWeek)+' · '+title+startNote+'</div>';
        });
        html+='</div>';
      }
    });
    html+='</div>';
  }
  return html+'</div>';
}
function renderCalDayMiniEvents(plItems,ivItems,max,spouseItems){
  let html='',n=0;
  plItems.forEach(a=>{
    if(n>=max)return;
    const title=calAppTitle(a);
    html+='<div class="cal-ev-mini cal-planned" title="📬 '+a.offer.company.name+' · '+title+'">📬 '+a.offer.company.name+'</div>';
    n++;
  });
  ivItems.forEach(a=>{
    if(n>=max)return;
    const title=calAppTitle(a);
    const st=a.status==='interview_confirmed'?'confirmed':'invite';
    const sl=interviewSlotLabel(a.interviewSlot);
    html+='<div class="cal-ev-mini cal-'+st+'" title="'+sl+' '+a.offer.company.name+' · '+title+'">'+sl+' '+a.offer.company.name+'</div>';
    n++;
  });
  (spouseItems||[]).forEach(l=>{
    if(n>=max)return;
    const slbl=l.amount>=1000?(Math.round(l.amount/100)/10+'k'):('¥'+l.amount);
    html+='<div class="cal-ev-mini cal-spouse-loan" title="归还伴侣借款 ¥'+l.amount.toLocaleString()+'">💍 '+slbl+'</div>';
    n++;
  });
  return html;
}
function renderMonthCalendarHtml(plannedPending,interviews,spouseLoans){
  const w=game.week;
  const first=new Date(calendarYear,calendarMonth,1);
  const last=new Date(calendarYear,calendarMonth+1,0);
  spouseLoans=spouseLoans||[];
  let html='<div class="cal-month">';
  html+='<div class="cal-month-hdr" onclick="event.stopPropagation()">';
  html+='<button type="button" class="btn cal-nav" onclick="event.stopPropagation();shiftCalendarMonth(-1)">‹</button>';
  html+='<span>'+calendarYear+'年'+(calendarMonth+1)+'月</span>';
  html+='<button type="button" class="btn cal-nav" onclick="event.stopPropagation();shiftCalendarMonth(1)">›</button>';
  html+='</div><div class="cal-month-grid">';
  ['日','一','二','三','四','五','六'].forEach(d=>{html+='<div class="cal-dow">'+d+'</div>'});
  for(let i=0;i<first.getDay();i++)html+='<div class="cal-day cal-pad"></div>';
  for(let day=1;day<=last.getDate();day++){
    const d=new Date(calendarYear,calendarMonth,day);
    const gw=dateToGameWeek(d);
    const pl=plannedPending.filter(a=>a.replyWeek===gw);
    const iv=interviews.filter(a=>a.interviewWeek===gw);
    const sl=spouseLoans.filter(l=>l.dueWeek===gw);
    let cls='cal-day';
    if(gw===w)cls+=' cal-cur-week';
    if(gw<w)cls+=' cal-out';
    html+='<div class="'+cls+'"><span class="cal-day-num">'+day+'</span>';
    if(pl.length||iv.length||sl.length)html+='<div class="cal-day-evs">'+renderCalDayMiniEvents(pl,iv,2,sl)+'</div>';
    html+='</div>';
  }
  return html+'</div></div>';
}
function renderWeekCalendarHtml(plannedPending,interviews,spouseLoans){
  const w=game.week;
  spouseLoans=spouseLoans||[];
  let html='<div class="cal-weeks">';
  for(let i=-1;i<=5;i++){
    const cw=w+i;
    const isCur=cw===w;
    const ivItems=interviews.filter(a=>a.interviewWeek===cw);
    const plItems=plannedPending.filter(a=>a.replyWeek===cw);
    const slItems=spouseLoans.filter(l=>l.dueWeek===cw);
    html+='<div class="cal-week'+(isCur?' cal-cur':'')+'">';
    html+='<div class="cal-date">'+getDateStr(cw)+(isCur?' · 本周':'')+'</div>';
    if(ivItems.length||plItems.length||slItems.length){
      html+='<div class="cal-events">';
      plItems.forEach(a=>{
        const title=calAppTitle(a);
        html+='<div class="cal-ev cal-planned" title="预定招聘筛选结果">📬 '+a.offer.company.name+' · '+title+'</div>';
      });
      ivItems.forEach(a=>{
        const title=calAppTitle(a);
        const st=a.status==='interview_confirmed'?'confirmed':'invite';
        const sl=interviewSlotLabel(a.interviewSlot);
        html+='<div class="cal-ev cal-'+st+'" title="'+a.offer.company.name+'">'+sl+' '+a.offer.company.name+' · '+title+'</div>';
      });
      slItems.forEach(l=>{
        html+='<div class="cal-ev cal-spouse-loan" title="归还伴侣借款">💍 还伴侣 ¥'+l.amount.toLocaleString()+'</div>';
      });
      html+='</div>';
    }else if(cw>=w)html+='<div class="cal-empty">—</div>';
    html+='</div>';
  }
  return html+'</div>';
}
function renderInterviewCalendar(){
  const el=document.getElementById('interviewCalendar');
  if(!el||!game)return;
  const plannedPending=getPlannedPendingEntries();
  const weekInterviews=getInterviewCalendarEntries();
  const monthInterviews=getAllCalendarInterviewEntries();
  const spouseLoans=typeof getSpouseLoanCalendarEntries==='function'?getSpouseLoanCalendarEntries():[];
  const hasAny=plannedPending.length||monthInterviews.length||spouseLoans.length;
  let html='<div class="cal-shell">';
  html+='<div class="cal-view-tabs"><button type="button" class="btn cal-view-btn'+(calendarView==='month'?' active':'')+'" onclick="setCalendarView(\\'month\\')">月历</button>'+
    '<button type="button" class="btn cal-view-btn'+(calendarView==='week'?' active':'')+'" onclick="setCalendarView(\\'week\\')">星期历</button></div>';
  if(!hasAny)html+='<div style="color:var(--muted);font-size:.7rem;margin-bottom:6px">暂无日程</div>';
  html+=renderCalPlannedList(plannedPending);
  html+=typeof renderSpouseLoanCalList==='function'?renderSpouseLoanCalList(spouseLoans):'';
  html+=calendarView==='month'?renderMonthCalendarHtml(plannedPending,monthInterviews,spouseLoans):renderWeekCalendarHtml(plannedPending,weekInterviews,spouseLoans);
  html+='</div>';
  el.innerHTML=html;
}
function setInterviewSort(mode){
  interviewSortMode=mode;
  refreshInboxViews();
}
function sortInterviewInboxItems(items){
  const getOffer=it=>{
    const app=game.applications.find(a=>a.id===it.id);
    return it.offer||(app&&app.offer);
  };
  const sorted=[...items];
  sorted.sort((a,b)=>{
    const appA=game.applications.find(x=>x.id===a.id);
    const appB=game.applications.find(x=>x.id===b.id);
    const offA=getOffer(a),offB=getOffer(b);
    if(interviewSortMode==='time'){
      const wA=appA&&appA.interviewWeek!=null?appA.interviewWeek:a.interviewWeek;
      const wB=appB&&appB.interviewWeek!=null?appB.interviewWeek:b.interviewWeek;
      const wa=wA!=null?wA:999999,wb=wB!=null?wB:999999;
      if(wa!==wb)return wa-wb;
      const sa=appA&&appA.interviewSlot?interviewSlotOrder(appA.interviewSlot):99;
      const sb=appB&&appB.interviewSlot?interviewSlotOrder(appB.interviewSlot):99;
      if(sa!==sb)return sa-sb;
      return a.week-b.week;
    }
    if(interviewSortMode==='pay'){
      const pa=(offA&&offA.annualPay)||0,pb=(offB&&offB.annualPay)||0;
      return pb-pa||String(a.company||'').localeCompare(b.company||'','zh-CN');
    }
    if(interviewSortMode==='company'){
      return String(a.company||'').localeCompare(b.company||'','zh-CN');
    }
    if(interviewSortMode==='imp'){
      const ia=offA?IMP_ORDER.indexOf(offA.importance):-1;
      const ib=offB?IMP_ORDER.indexOf(offB.importance):-1;
      return ib-ia||((offB&&offB.annualPay)||0)-((offA&&offA.annualPay)||0);
    }
    return 0;
  });
  return sorted;
}
function formatInboxOfferDetail(it,app){
  const offer=(app&&app.offer)||it.offer;
  if(!offer||!offer.company)return '';
  const ji=it.jobIdx!=null?it.jobIdx:(app&&app.jobIdx);
  const job=ji!=null&&game.market?game.market[ji]:null;
  const jobTitle=job?job.title:'—';
  const imp=offer.roleExtra?IMP_LABEL[offer.importance]+'·'+ROLE_EXTRA[offer.roleExtra]:IMP_LABEL[offer.importance];
  const pay=formatOfferPay(offer);
  return '<div class="inbox-offer-detail">'+
    '岗位：<b>'+jobTitle+'</b> · '+fmtCompanyBadge(offer.company)+' · <b>'+imp+'</b> · '+pay+
    (offer.welfare?'<br>'+offer.welfare:'')+'</div>';
}
function renderDailyPanelSafe(){if(typeof renderDailyPanel==='function')renderDailyPanel();}
function renderInboxRow(it){
  const app=findInboxApp(it);
  const cat=classifyInboxItem(it,app);
  const ivWeek=app&&app.interviewWeek!=null?app.interviewWeek:it.interviewWeek;
  const slot=app&&app.interviewSlot?app.interviewSlot:it.interviewSlot;
  const slotTxt=slot?interviewSlotLabel(slot):'';
  let cls='inbox-item';
  if(cat==='expired'||it.invalid)cls+=' invalid';
  else if(it.type==='ghost')cls+=' ghost';
  else if(cat==='attended')cls+=' has-reply';
  else if(cat==='missed')cls+=' invalid';
  else if(cat==='replied')cls+=' has-reply';
  else if(it.type==='interview')cls+=' has-reply';
  else if(it.type==='reject')cls+=' invalid';
  else if(cat==='scam')cls+=' inbox-scam';
  else if(it.type==='offer')cls+=' ghost';
  let acts='',invalidTag='';
  if(it.type==='offer'&&String(it.id||'').indexOf('scam_')===0){
    invalidTag='<div class="invalid-tag" style="color:var(--orange);border-color:var(--orange)">⚠ 投必中 · 诈骗岗</div>';
    acts='<button class="btn btn-warn" onclick="acceptScamJob();refreshInboxViews();renderDailyPanelSafe();if(typeof refreshJobHuntUi===\\'function\\')refreshJobHuntUi()">接受（诈骗岗 · 特殊通讯簿）</button>'+
      '<button class="btn" onclick="dismissScamOffer(\\''+it.id+'\\')">忽略</button>';
  }else if(it.type==='offer'&&it.scamBait){
    invalidTag='<div class="invalid-tag" style="color:var(--yellow);border-color:var(--yellow)">✨ 优选录用 · 上岗后需推销套餐</div>';
    acts='<button class="btn btn-warn" onclick="acceptScamBaitOffer(\\''+(it.appId||'')+'\\');refreshInboxViews();renderDailyPanelSafe();if(typeof refreshJobHuntUi===\\'function\\')refreshJobHuntUi()">确认入职</button>'+
      '<button class="btn" onclick="dismissScamBaitOffer(\\''+(it.appId||'')+'\\',\\''+it.id+'\\')">放弃</button>';
  }else if(it.type==='interview_reply'||it.type==='interview_done'||it.type==='interview_missed'){
    acts='<div style="color:var(--'+(it.type==='interview_missed'?'red':'green')+');font-size:.7rem;margin-top:4px">'+
      (it.type==='interview_reply'?'✓ 已回复确认':it.type==='interview_done'?'✓ 已参加确认':'✗ 缺席记录')+'</div>';
  }else if(cat==='missed'){
    invalidTag='<div class="invalid-tag">未参加</div>';
  }else if(cat==='expired'){
    invalidTag='<div class="invalid-tag">'+inboxExpiredLabel(app,it)+'</div>';
  }else if(it.type==='interview'&&app){
    const costDesc=formatInterviewCostDesc(app);
    const fee=app.interviewTravelCost!=null?app.interviewTravelCost:0;
    const online=isInterviewOnline(app);
    const modeNote=interviewModeLabel(app);
    if(app.status==='interview_confirmed'){
      const attendLbl=online?'参加在线面试 '+slotTxt:'前往面试 '+slotTxt+(fee?'（¥'+fee+'）':'');
      if(game.week===app.interviewWeek&&!app.interviewHeld&&canAttendInterviewNow(app)){
        acts='<button class="btn btn-primary" onclick="attendInterviewSlot(\\''+it.id+'\\')">'+attendLbl+'</button>'+
          '<button class="btn" onclick="skipInterviewAttend(\\''+it.id+'\\')">放弃'+(online?'参加':'到场')+'</button>';
      }else if(game.week===app.interviewWeek&&!app.interviewHeld){
        const waitNote=interviewAttendBlockReason(app)||'等待更早场次结束';
        acts='<div style="color:var(--yellow);font-size:.7rem;margin-top:4px">'+waitNote+' · '+slotTxt+
          (online?' · 在线每档占2h':' · 线下占满白天')+'</div>';
      }else{
        acts='<div style="color:var(--green);font-size:.7rem;margin-top:4px">已确认 · '+getDateStr(app.interviewWeek)+' '+slotTxt+' · '+modeNote+'</div>';
      }
    }else if(isInviteActionable(app,it)){
      const slotConflict=slot&&isInterviewSlotTaken(app.interviewWeek,slot,app.id);
      const travelConflict=hasInterviewTravelConflict(app,app.interviewWeek,slot);
      const conflictNote=slotConflict?'<div style="color:var(--red);font-size:.65rem">该时段已被占用</div>':
        travelConflict?'<div style="color:var(--red);font-size:.65rem">与行程冲突（异地/住宿恢复）</div>':'';
      const notThisWeek=ivWeek>game.week?'<div style="color:var(--blue);font-size:.65rem">请于面试周前确认赴约</div>':'';
      acts=notThisWeek+conflictNote+
        '<button class="btn" onclick="confirmInterview(\\''+it.id+'\\')"'+(slotConflict||travelConflict?' disabled':'')+'>答应面试 · '+getDateStr(ivWeek)+' '+slotTxt+'</button>'+
        '<button class="btn" onclick="declineInterview(\\''+it.id+'\\')">放弃</button>'+
        '<div style="color:var(--muted);font-size:.65rem;margin-top:3px">'+modeNote+' · '+costDesc+'</div>';
    }
  }
  const offerLine=(it.type==='interview'||it.type==='reject'||it.type==='ghost')?formatInboxOfferDetail(it,app):
    (it.type==='offer'&&it.body)?('<div class="inbox-offer-detail">'+it.body+'</div>'):'';
  const dateLine='通知 '+getDateStr(it.week)+(ivWeek?' · 面试 <b>'+getDateStr(ivWeek)+(slotTxt?' '+slotTxt:'')+'</b>':'');
  const msgLine=it.msg||(it.title||'');
  const scamNote=cat==='scam'&&!it.scamBait?'<div style="color:var(--orange);font-size:.68rem;margin-bottom:3px">不在 APP 刷岗列表 · 仅通过应聘邮箱投递</div>':'';
  return '<div class="'+cls+'">'+scamNote+'<div>'+msgLine+'</div>'+offerLine+'<div style="color:var(--muted);font-size:.7rem">'+dateLine+'</div>'+invalidTag+acts+'</div>';
}
function renderInboxCategory(title,catKey,items,foldable){
  if(!items.length)return '';
  const open=!foldable||!!inboxFoldOpen[catKey];
  let html='<div class="inbox-cat-block">';
  if(foldable){
    html+='<div class="inbox-fold-hdr inbox-cat-hdr inbox-cat-'+catKey+'" onclick="toggleInboxFold(\\''+catKey+'\\')">'+
      '<span><b>'+title+'</b> <span class="fold-meta">'+items.length+' 条</span></span><span>'+(open?'▼':'▶')+'</span></div>';
  }else{
    html+='<div class="inbox-fold-hdr inbox-cat-hdr" style="cursor:default;border-style:solid"><span><b>'+title+'</b> <span class="fold-meta">'+items.length+' 条</span></span></div>';
  }
  if(open){
    html+='<div class="inbox-fold-body">';
    items.forEach(it=>{html+=renderInboxRow(it)});
    html+='</div>';
  }
  return html+'</div>';
}
function renderInbox(){
  syncInviteExpiryState();
  const panel=document.getElementById('inboxPanel'), list=document.getElementById('inboxList');
  const raw=getVisibleInboxRaw();
  if(!raw.length){if(panel)panel.style.display='none';return}
  if(panel)panel.style.display='block';
  const sortBtns=document.getElementById('inboxSortBtns');
  if(sortBtns){
    const modes=[{id:'time',label:'按时间'},{id:'pay',label:'按薪资'},{id:'company',label:'按企业'},{id:'imp',label:'按岗位等级'}];
    sortBtns.innerHTML=modes.map(m=>'<button type="button" class="btn'+(interviewSortMode===m.id?' active':'')+'" onclick="setInterviewSort(\\''+m.id+'\\')">'+m.label+'</button>').join('');
  }
  if(list)list.innerHTML=renderInboxBucketsHtml(bucketInboxItems(raw));
}
function renderOffers(){
  const panel=document.getElementById('offersPanel'), list=document.getElementById('offersList');
  const pending=game.pendingHire;
  if(!game.offers.length&&!pending){panel.style.display='none';return}
  panel.style.display='block';
  let html='';
  if(pending){
    html+='<div class="offer-item" style="border-color:var(--blue)"><b>待上岗 · '+pending.offer.company.name+'</b><br>'+
      '年薪 ¥'+(pending.finalPay||pending.offer.annualPay).toLocaleString()+' · 预计 '+getDateStr(pending.startWeek)+' 入职</div>';
  }
  html+=game.offers.map(o=>{
    const imp=o.offer.roleExtra?IMP_LABEL[o.offer.importance]+'·'+ROLE_EXTRA[o.offer.roleExtra]:IMP_LABEL[o.offer.importance];
    const pay=o.negotiated?(o.finalPay||o.offer.annualPay):o.offer.annualPay;
    const payTxt=o.negotiated?('洽谈后 ¥'+pay.toLocaleString()):formatOfferPay(o.offer);
    const btns=!o.negotiated?
      '<button class="btn btn-primary" onclick="negotiateOffer(\\''+o.id+'\\')">洽谈薪资</button>':
      '<button class="btn btn-primary" onclick="signContractOffer(\\''+o.id+'\\')">签订合同</button>';
    return '<div class="offer-item"><b>'+o.offer.company.name+'</b> · '+imp+' · '+payTxt+
      '<br>拟入职 '+getDateStr(o.startWeek)+(o.startWeek>game.week+4?'（需等待）':'')+' · 有效期至 '+getDateStr(o.expireWeek)+
      '<div style="margin-top:4px">'+btns+
      '<button class="btn" onclick="declineOffer(\\''+o.id+'\\')">拒绝</button></div></div>';
  }).join('');
  list.innerHTML=html;
}

function getBestHighRole(){
  let best=null;
  game.careerHistory.forEach(h=>{
    if(h.importance==='high'&&(!best||TIER_ORDER.indexOf(h.tier)<TIER_ORDER.indexOf(best.tier)))best=h;
  });
  return best;
}

function getReferralBase(){
  return (game.married&&!game.divorced)?0.02:0.01;
}

function getReferralProbability(offer){
  const base=getReferralBase();
  const past=getBestHighRole();

  if(past){
    const tierDiff=TIER_ORDER.indexOf(past.tier)-TIER_ORDER.indexOf(offer.tier);
    if(tierDiff<0){
      const exp=getUpwardReferralExp(past.tier,past.importance,offer.tier,offer.importance);
      return Math.max(1e-12,Math.pow(10,-exp));
    }
    if(past.importance==='high'){
      if(tierDiff===0){
        if(offer.importance==='low')return 1;
        if(offer.importance==='mid')return 0.1;
        return base;
      }
      if(offer.importance==='low')return 1;
      if(offer.importance==='mid')return 0.1;
      return Math.min(1,0.01*Math.pow(10,tierDiff));
    }
  }
  return base;
}

function getHireProbabilityModifiers(offer){
  const schoolF=getSchoolTierFactor(offer.tier);
  const eduF=getEduTierFactor(offer.tier);
  const impF=IMP_APPLY_FACTOR[offer.importance]||1;
  const ageF=getAgeHireMultiplier();
  return {schoolF,eduF,impF,ageF,combined:Math.min(1,schoolF*eduF*impF*ageF)};
}

function tickSpongeMedal(){
  if(!game)return;
  const was=!!game.showSpongeInsight;
  if(game.familyStress>STRESS_MEDAL_THRESHOLD){
    game.stressHighStreak=(game.stressHighStreak||0)+1;
    if(game.stressHighStreak>=SPONGE_STREAK_WEEKS)game.showSpongeInsight=true;
  }else{
    game.stressHighStreak=0;
    game.showSpongeInsight=false;
  }
  if(game.showSpongeInsight&&!was)addLog('🧽 社会勋章·海绵宝宝 — 职业详情显示裁员率或实习留存率','success');
  else if(!game.showSpongeInsight&&was)addLog('海绵宝宝勋章已收回（压力回落）','info');
}
function getJobLayoffPreview(job,offer){
  if(!job||!offer)return 0;
  const co=offer.company||pickCompany(job.idx,offer.tier||'mid');
  const fakeEmp={
    jobIdx:job.idx,
    company:co,
    weeksInCompany:52,
    weeksInIndustry:(game.industryExperience&&game.industryExperience[job.category])||52,
    tier:offer.tier,
    importance:offer.importance,
    roleExtra:offer.roleExtra||null
  };
  return getLayoffWaveProbability(fakeEmp);
}
function getInternRetentionPreview(job,offer){
  let conv=offer.tier==='low'?0.28:offer.tier==='mid'?0.42:0.58;
  if(offer.importance==='low')conv*=0.88;
  if(isCategorySalaryDeclining(job.category))conv*=0.75;
  return Math.min(0.95,Math.max(0.02,conv));
}
function renderSocialMedals(){
  const row=document.getElementById('socialMedalsRow');
  if(!row||!game)return;
  row.innerHTML=SOCIAL_MEDALS.map(m=>{
    const lit=!!game[m.field];
    return '<div class="social-medal'+(lit?' lit':'')+'" title="'+(lit?(m.label+'：'+m.effect):'')+'">'+
      '<span class="medal-icon">'+m.icon+'</span>'+
      '<span class="medal-name">'+m.label+'</span>'+
      (lit?'<span class="medal-effect">'+m.effect+'</span>':'')+
      '</div>';
  }).join('');
}
function getLayoffWaveProbability(emp){
  if(!emp||!game||!game.market)return 0;
  if(emp.roleExtra!=='intern'&&emp.roleExtra!=='temp'&&emp.weeksInCompany<12)return 0;
  const job=game.market[emp.jobIdx];
  if(!job)return 0;
  const co=emp.company||{scale:'medium',tier:'mid'};
  let base=.0065;
  base*=Math.exp(Math.max(0,(game.macroUnemployment||0)-.055)*5);
  if(game.layoffSeason>0)base*=2.2;
  base*=1+(job.exposure||0)*.09;
  const scaleM={large:1.65,medium:1.25,small:1};
  base*=scaleM[co.scale]||1;
  const tierM={low:1.55,mid:1.12,high:1};
  base*=tierM[co.tier]||1;
  const impM={low:2.4,mid:0.9,high:0.38};
  base*=impM[emp.importance]||1;
  if(emp.weeksInIndustry<26)base*=1.25;
  if(emp.roleExtra==='temp')base*=4;
  if(emp.roleExtra==='intern')base*=2.2;
  if(game.stealthJobSearch)base*=1.55+Math.min(1.2,(game.stealthSearchWeeks||0)*0.07);
  if(typeof layoffTempStatPenalty==='function')base*=layoffTempStatPenalty();
  return Math.min(.48,base);
}

function resolveLayoff(emp){
  const job=game.market[emp.jobIdx],co=emp.company;
  let structP=.028+job.exposure*.012+game.macroUnemployment*.4+(game.layoffSeason>0?.08:0);
  if(co.scale==='large')structP+=0.02;
  if(co.tier==='low')structP+=0.015;
  if(co.tier==='low'&&emp.importance==='low')structP+=0.03;
  if(emp.roleExtra==='intern')structP+=0.035;
  if(game.stealthJobSearch&&Math.random()<0.35)
    return {laidOff:true,reason:co.name+' 裁员（疑似因在职求职）',stealth:true};
  if(Math.random()<structP)
    return {laidOff:true,reason:co.name+' 整岗裁撤【'+job.title+'】（AI影响'+job.exposure+'）',stealth:false};
  const impCut={low:.42,mid:.16,high:.05};
  let p=impCut[emp.importance]*Math.exp(Math.max(0,game.macroUnemployment-.055)*4);
  if(co.scale==='large')p*=1.25;
  if(co.tier==='low')p*=1.4;
  if(co.tier==='mid')p*=1.1;
  if(emp.roleExtra==='intern')p*=1.75;
  if(Math.random()<Math.min(.72,p))return {laidOff:true,reason:co.name+(emp.roleExtra==='intern'?' 实习生优化':' 批次裁员（'+IMP_LABEL[emp.importance]+'·'+SCALE_LABEL[co.scale]+'）'),stealth:false};
  return {laidOff:false,reason:co.name+' 裁员潮中幸存',stealth:false};
}
function isGrassrootsCompany(co){
  return co&&(co.scale==='small'&&co.tier==='low');
}
function autoResolveLayoffSeverance(emp){
  const weeks=emp.weeksInCompany||0;
  const co=emp.company;
  const base=Math.max(5000,Math.round((emp.annualPay/52)*Math.min(weeks,52)*0.45));
  const grassroots=isGrassrootsCompany(co);
  const n1Offered=grassroots?0:Math.round(base*0.45);
  const roll=Math.random();
  let payout=n1Offered,note=n1Offered?'接受 N+1 赔偿':'签字离职（无赔偿）';
  if(roll<0.28){payout=base;note='赔偿谈判成功'}
  else if(roll<0.38){payout=Math.round(base*1.1);note='起诉获赔'}
  else if(roll<0.48){game.severanceBlacklistUntil=game.week+20+Math.floor(Math.random()*20);note='谈判失败';payout=0}
  if(payout>0){game.cash+=payout;ledgerAddIncome('severance','💰','辞退补偿',payout)}
  addLog('⚖️ '+note+(payout?(' ¥'+payout.toLocaleString()):''),roll<0.48?'success':'info');
  if(typeof autoLifeNote==='function')autoLifeNote('⚖️ 被裁 · '+co.name+' · '+note);
}
function triggerLayoffSeverance(emp,layoffInfo){
  layoffInfo=layoffInfo||{};
  if(layoffInfo.openingStory){
    if(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating()){
      game._pendingOpeningLayoffSeverance={emp,layoffInfo:Object.assign({},layoffInfo,{openingStory:false})};
      if(typeof autoLifeNote==='function')autoLifeNote('💔 满月剧情裁员（结束后处理赔偿）');
      return;
    }
    if(typeof showOpeningLayoffStoryModal==='function'){
      showOpeningLayoffStoryModal(function(){
        triggerLayoffSeverance(emp,Object.assign({},layoffInfo,{openingStory:false}));
      });
      return;
    }
  }
  const weeks=emp.weeksInCompany||0;
  const co=emp.company;
  const base=Math.max(5000,Math.round((emp.annualPay/52)*Math.min(weeks,52)*0.45));
  const grassroots=isGrassrootsCompany(co);
  const n1Offered=grassroots?0:Math.round(base*0.45);
  const job=game.market[emp.jobIdx];
  if(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating()){
    autoResolveLayoffSeverance(emp);
    return;
  }
  if(_companionActor){
    const roll=Math.random();
    let payout=n1Offered,note=n1Offered?'接受辞退补偿':'签字离职（无赔偿）';
    if(roll<0.34){payout=base;note='赔偿谈判成功'}
    else if(roll<0.48){payout=Math.round(base*1.15);note='起诉获赔'}
    else if(roll<0.58){game.severanceBlacklistUntil=game.week+20+Math.floor(Math.random()*20);note='谈判失败';payout=0}
    if(payout>0)game.cash+=payout;
    addLog(note+(payout?(' ¥'+payout.toLocaleString()):''),roll<0.48?'success':'info');
    return;
  }
  game._severanceCtx={
    base,n1Offered,grassroots,
    reason:layoffInfo.reason,stealth:!!layoffInfo.stealth,
    company:co.name,category:job?job.category:null,jobIdx:emp.jobIdx
  };
  const policy=grassroots
    ?'<span style="color:var(--orange)">小型草根公司通常不主动给赔偿，但你可以谈判或起诉。</span>'
    :'公司提出 N+1 方案 <b>¥'+n1Offered.toLocaleString()+'</b>（法定参考约 ¥'+base.toLocaleString()+'）';
  const btns=[
    {text:n1Offered>0?('接受 N+1（¥'+n1Offered.toLocaleString()+'）'):'签字离职（无赔偿）',fn:'severanceAcceptLow()'},
    {text:'谈判要求赔偿',primary:true,fn:'severanceNegotiate()'},
    {text:'起诉公司',fn:'severanceSue()'}
  ];
  showConsumeModal({
    icon:'⚖️',title:'离职赔偿',
    html:'<b>'+co.name+'</b> 辞退你<br>理由：'+layoffInfo.reason+'<br>'+policy,
    buttons:btns
  });
}
function severanceAcceptLow(){
  if(game&&game._severanceCtx){
    const p=game._severanceCtx.n1Offered||0;
    if(p>0){game.cash+=p;ledgerAddIncome('severance','💰','辞退补偿 N+1',p)}
    addLog(p>0?('接受 N+1 赔偿 ¥'+p.toLocaleString()):'签字离职，公司未支付赔偿','info');
  }
  game._severanceCtx=null;closeConsumeModal();
}
function severanceNegotiate(){
  if(!game||!game._severanceCtx){closeConsumeModal();return}
  const ctx=game._severanceCtx;
  const chance=ctx.grassroots?0.16:(ctx.n1Offered>0?0.38:0.28);
  if(Math.random()<chance){
    game.cash+=ctx.base;
    ledgerAddIncome('severance','💰','赔偿谈判',ctx.base);
    addStress(10,'赔偿谈判 ');
    addLog('赔偿谈判成功，获全额 ¥'+ctx.base.toLocaleString()+'（+10 压力）','success');
  }else{
    addLog('赔偿谈判失败，公司未支付任何赔偿','fail');
  }
  game._severanceCtx=null;closeConsumeModal();
}
function severanceSue(){
  if(!game||!game._severanceCtx){closeConsumeModal();return}
  const ctx=game._severanceCtx;
  if(Math.random()<0.26){
    const p=Math.round(ctx.base*1.15);
    game.cash+=p;ledgerAddIncome('severance','💰','诉讼获赔',p);
    addLog('诉讼胜诉获赔 ¥'+p.toLocaleString(),'success');
  }else{
    const fee=Math.round(ctx.base*0.25);
    game.cash=Math.max(0,game.cash-fee);
    ledgerAddExpense('legal','⚖️','诉讼律师费',fee,false);
    addLog('诉讼失败并承担律师费 ¥'+fee.toLocaleString(),'fail');
  }
  if(ctx.category){
    game.severanceLitigation={untilWeek:game.week+78+Math.floor(Math.random()*52),category:ctx.category,jobIdx:ctx.jobIdx};
    addLog('⚠ 背调记录：'+ctx.category+' 同行业同职业求职将明显受阻（约 '+(Math.round((game.severanceLitigation.untilWeek-game.week)/4))+' 个月）','warn');
  }
  game._severanceCtx=null;closeConsumeModal();
}

function weeklySalary(job,emp){
  const heat=job.heatPct>100?1+(job.heatPct-100)*.004:1-(100-job.heatPct)*.003;
  let base=emp.annualPay||calcAnnualPay(job,emp.tier,emp.importance);
  if(emp.roleExtra==='intern')base=Math.round(base*0.55);
  let vol=1;
  if(emp.roleExtra==='temp')vol=0.88+((game.week+job.idx*3)%12)/80;
  return Math.max(0,Math.round((base/52)*heat*vol*(1-Math.min(.9,playerStress()*game.stressMultiplier*.0006))));
}

const LIFE_STATUS_MODALS=[
  {key:'divorced',test:g=>g.divorced,icon:'💔',title:'状态：离异',msg:'连续半年无力负担，你已离婚并失去房产。此后租住出租屋，压力倍数翻倍。'},
  {key:'parents',test:g=>g.livingOffParents,icon:'🏠',title:'状态：啃老',msg:'收入不足，开始依靠父母接济。'},
  {key:'welfare',test:g=>g.onWelfare&&!g.disabled,icon:'📋',title:'状态：低保',msg:'父母已不在或无力接济，你开始领取低保，只能从事体力劳动。'},
  {key:'disabled',test:g=>g.disabled,icon:'🚑',title:'状态：伤残低保',msg:'体力劳动中受伤致残，领取伤残低保。'},
  {key:'homeless',test:g=>g.homeless,icon:'🌧',title:'状态：流浪',msg:'被房东赶出，开始在桥洞栖身，房租免费。'},
  {key:'affair',test:g=>g.affairActive,icon:'💋',title:'状态：婚外情',msg:'婚外情爆发，此后月支出翻倍。'},
  {key:'children',test:g=>g.hasChildren,icon:'👶',title:'状态：为人父母',msg:'你和伴侣决定生育，月生活费大幅上升（持续约18年）。'},
  {key:'medal_expert',test:g=>g.showProbabilities,icon:'📋',title:'社会勋章 · 应聘专家',msg:'求职详情将显示简历、面试与内推通过概率。'},
  {key:'medal_wolf',test:g=>g.wolfAchievement,icon:'🐺',title:'社会勋章 · 独狼',msg:'炒股更易上涨，赌桌败局有概率翻盘。'}
];
function initShownLifeFlagsFromState(){
  if(!game)return;
  if(!game.shownLifeFlags)game.shownLifeFlags={};
  LIFE_STATUS_MODALS.forEach(f=>{if(f.test(game))game.shownLifeFlags[f.key]=true});
  game.spongeModalActive=!!game.showSpongeInsight;
}
function queueStatusModal(title,msg,icon,opts){
  if(typeof icon==='object'&&icon&&!opts){opts=icon;icon=undefined}
  opts=opts||{};
  statusModalQueue.push({title,msg,icon:icon||opts.icon||'📌',btn:opts.btn||'继续生活',onClose:opts.onClose});
  showNextStatusModal();
}
function showNextStatusModal(){
  const el=document.getElementById('statusChangeOverlay');
  if(!el||statusModalOpen)return;
  if(!statusModalQueue.length){el.classList.add('hidden');statusModalCurrentOnClose=null;return}
  const m=statusModalQueue.shift();
  const ic=document.getElementById('statusChangeIcon');
  const ti=document.getElementById('statusChangeTitle');
  const ms=document.getElementById('statusChangeMsg');
  const btn=document.getElementById('statusChangeBtn');
  if(ic)ic.textContent=m.icon;
  if(ti)ti.textContent=m.title;
  if(ms)ms.innerHTML=String(m.msg||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\\n/g,'<br>');
  if(btn)btn.textContent=m.btn||'继续生活';
  statusModalCurrentOnClose=m.onClose||null;
  el.classList.remove('hidden');
  statusModalOpen=true;
}
function closeStatusModal(){
  const el=document.getElementById('statusChangeOverlay');
  const cb=statusModalCurrentOnClose;
  statusModalCurrentOnClose=null;
  if(el)el.classList.add('hidden');
  statusModalOpen=false;
  if(typeof cb==='function'){try{cb()}catch(e){console.error('statusModal onClose',e)}}
  if(statusModalQueue.length)setTimeout(showNextStatusModal,80);
}
function checkLifeStatusModals(){
  if(!game||game.gameOver)return;
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning)return;
  if(!game.shownLifeFlags)game.shownLifeFlags={};
  LIFE_STATUS_MODALS.forEach(f=>{
    if(f.test(game)&&!game.shownLifeFlags[f.key]){
      game.shownLifeFlags[f.key]=true;
      queueStatusModal(f.title,f.msg,f.icon);
    }
  });
  const sponge=!!game.showSpongeInsight;
  if(sponge&&!game.spongeModalActive){
    game.spongeModalActive=true;
    queueStatusModal('社会勋章 · 海绵宝宝','连续高压让你对岗位去留格外敏感。职业详情将显示裁员率或实习留存率。','🧽');
  }else if(!sponge&&game.spongeModalActive){
    game.spongeModalActive=false;
    queueStatusModal('社会勋章收回','压力回落，海绵宝宝勋章已失效。','🧽');
  }
}
function addStress(delta,reason){
  if(!game||delta==null||delta===0)return;
  delta=Number(delta);
  if(!Number.isFinite(delta)||delta===0)return;
  normalizePlayerStress();
  const before=playerStress();
  const next=Math.max(0,before+delta);
  game.familyStress=next;
  if(next!==before){
    if(typeof updateHeaderStats==='function')updateHeaderStats();
    if(typeof renderLifePanelContent==='function')renderLifePanelContent();
  }
  if(reason&&next!==before)addLog(reason+(delta>0?'+':'')+delta+' 压力（'+before+'→'+next+'）','stress');
}
function refreshStressDisplay(){
  if(typeof updateHeaderStats==='function')updateHeaderStats();
  if(typeof renderLifePanelContent==='function')renderLifePanelContent();
}
function addPartnerStress(delta,reason){
  if(!game||!game.companion||delta==null||delta===0)return;
  delta=Number(delta);
  if(!Number.isFinite(delta)||delta===0)return;
  const c=game.companion;
  const before=Math.max(0,Number(c.familyStress)||0);
  const next=Math.max(0,before+delta);
  c.familyStress=next;
  if(reason&&next!==before)addLog(reason+'伴侣压力 '+(delta>0?'+':'')+delta+'（'+before+'→'+next+'）','stress');
}
function snackPortionsForStress(stress){
  const s=Math.max(0,Number(stress)||0);
  return Math.min(SNACK_PORTIONS_CAP,1+Math.floor(s/10));
}
function snackReboundPreview(reboundPortions,relief){
  let rebound=(reboundPortions||0)*SNACK_REBOUND_PER_PORTION;
  const minNet=Math.max(1,SNACK_MIN_NET_RELIEF);
  return Math.min(rebound,Math.max(0,relief-minNet));
}
function snackReboundStress(relief){
  const portions=game.snackReboundPortions||0;
  game.snackReboundPortions=0;
  return snackReboundPreview(portions,relief);
}
function partnerSnackReboundStress(relief){
  const portions=game.partnerSnackReboundPortions||0;
  game.partnerSnackReboundPortions=0;
  return snackReboundPreview(portions,relief);
}
function snackBulkDiscount(qty){
  if(qty>=1000)return 0.5;
  if(qty>=100)return 0.8;
  if(qty>=10)return 0.95;
  return 1;
}
function snackBulkTotalPrice(qty){
  qty=Math.max(1,Math.floor(qty)||1);
  return Math.round(SNACK_UNIT_COST*qty*snackBulkDiscount(qty));
}
function snackBulkDiscountLabel(qty){
  const d=snackBulkDiscount(qty);
  if(d<1)return Math.round(d*100)/10+'折';
  return '原价';
}
function buySnackBulk(qty){
  if(!game||game.gameOver)return;
  qty=Math.max(1,Math.floor(qty)||1);
  const cost=snackBulkTotalPrice(qty);
  if(!spendCash(cost,'零食×'+qty))return;
  game.snackStock=(game.snackStock||0)+qty;
  addLog('🍿 购入零食 ×'+qty+'（库存 '+game.snackStock+' 份）¥'+cost.toLocaleString()+' · '+snackBulkDiscountLabel(qty),'success');
  renderSpendingPanel();updateUI();
}
function tickSnackDayRebound(d){
  if(!game||!d)return;
  game.snackReboundPortions=d.snackPortionsToday||0;
  game.partnerSnackReboundPortions=d.partnerSnackPortionsToday||0;
  d.snackPortionsToday=0;
  d.partnerSnackPortionsToday=0;
}
function applySnackPortionsToPlayer(portions){
  portions=Math.max(1,Math.floor(portions)||1);
  const relief=portions*SNACK_RELIEF_PER_PORTION;
  const rebound=snackReboundStress(relief);
  if(rebound)addStress(rebound,'零食隔天反弹 ');
  addStress(-relief,'零食 ');
  const d=ensureDailyState();
  if(d)d.snackPortionsToday=(d.snackPortionsToday||0)+portions;
  return{portions,rebound,relief};
}
function applySnackPortionsToPartner(portions){
  portions=Math.max(1,Math.floor(portions)||1);
  const relief=portions*SNACK_RELIEF_PER_PORTION;
  const rebound=partnerSnackReboundStress(relief);
  if(rebound)addPartnerStress(rebound,'零食隔天反弹 ');
  addPartnerStress(-relief,'零食 ');
  const d=ensureDailyState();
  if(d)d.partnerSnackPortionsToday=(d.partnerSnackPortionsToday||0)+portions;
  return{portions,rebound,relief};
}
function markLifeStressEvent(key,label){
  if(!game)return;
  if(!game.lifeStressEvents)game.lifeStressEvents={};
  if(game.lifeStressEvents[key])return;
  game.lifeStressEvents[key]=true;
  addStress(STRESS_LIFE_TIER_DROP,label);
}
function checkCashStressMilestones(){
  if(!game)return;
  if(!game.cashStressMilestones)game.cashStressMilestones={};
  CASH_STRESS_MILESTONES.forEach(m=>{
    if(game.cashStressMilestones[m.key]||game.cash<m.amt)return;
    game.cashStressMilestones[m.key]=true;
    addStress(-20,'首次存款达'+m.label+' ');
  });
}
function getLedgerMonthKey(week){
  return Math.max(1,Math.ceil((week||0)/WEEKS_PER_MONTH));
}
function ledgerPeriodLabel(week){
  const d=getGameStartDate();
  d.setDate(d.getDate()+(week||game.week)*7);
  return d.toLocaleDateString('zh-CN',{year:'numeric',month:'long'});
}
function sumLedgerBucket(bucket){
  return Object.values(bucket||{}).reduce((s,x)=>s+(x.amount||0),0);
}
function ensureMonthLedger(){
  if(!game)return null;
  game.monthLedgerHistory=game.monthLedgerHistory||[];
  const mk=getLedgerMonthKey(Math.max(1,game.week));
  if(!game.monthLedger||game.monthLedger.monthKey!==mk){
    if(game.monthLedger&&!game.monthLedger._closed)finalizeMonthLedger(false);
    game.monthLedger={
      monthKey:mk,income:{},expense:{},
      weekStart:(mk-1)*WEEKS_PER_MONTH+1,weekEnd:mk*WEEKS_PER_MONTH
    };
  }
  return game.monthLedger;
}
function ledgerAdd(type,cat,icon,label,amount,mandatory){
  if(!game||_companionActor||!amount||amount<=0)return;
  const L=ensureMonthLedger();if(!L)return;
  const bucket=type==='income'?L.income:L.expense;
  if(!bucket[cat])bucket[cat]={icon,label,amount:0,mandatory:!!mandatory};
  bucket[cat].amount+=amount;
}
function ledgerAddIncome(cat,icon,label,amt){ledgerAdd('income',cat,icon,label,amt,false)}
function ledgerAddExpense(cat,icon,label,amt,mandatory){ledgerAdd('expense',cat,icon,label,amt,mandatory)}
function ledgerHousingLabel(exp){
  if(!exp)return '住房';
  if(exp.isRent)return '房租';
  if((exp.mortgage||0)>0||((exp.housing||0)>0&&!exp.mortgagePaidOff))return '房贷';
  return '住房';
}
function ledgerRecordMandatoryExpense(exp,amount){
  if(!amount||amount<=0)return;
  const need=exp.total||amount;
  const housingPart=need>0?Math.round((exp.housing||0)*amount/need):0;
  const live=amount-housingPart;
  if(housingPart>0)ledgerAddExpense('housing','🏠',ledgerHousingLabel(exp),housingPart,true);
  if(live>0)ledgerAddExpense('living','🍜','生活开销',live,true);
}
function ledgerRecordJobHunt(amt,label){
  if(amt>0)ledgerAddExpense('jobhunt','📋',label||'求职支出',amt,false);
}
function finalizeMonthLedger(isPayslip){
  if(!game||!game.monthLedger||game.monthLedger._closed)return;
  const L=game.monthLedger;
  const incomeTotal=sumLedgerBucket(L.income);
  const expenseTotal=sumLedgerBucket(L.expense);
  if(incomeTotal===0&&expenseTotal===0&&!isPayslip){game.monthLedger=null;return}
  const stmt={
    monthKey:L.monthKey,
    period:ledgerPeriodLabel(L.weekEnd||game.week),
    weekRange:[L.weekStart,L.weekEnd||game.week],
    income:JSON.parse(JSON.stringify(L.income)),
    expense:JSON.parse(JSON.stringify(L.expense)),
    incomeTotal,expenseTotal,net:incomeTotal-expenseTotal,
    closedAt:game.week
  };
  game.monthLedgerHistory=game.monthLedgerHistory||[];
  game.monthLedgerHistory.unshift(stmt);
  if(game.monthLedgerHistory.length>48)game.monthLedgerHistory.pop();
  L._closed=true;
  if(isPayslip){
    const sign=stmt.net>=0?'+':'-';
    addLog('📊 '+stmt.period+' 工资单：收入 ¥'+incomeTotal.toLocaleString()+
      ' · 支出 ¥'+expenseTotal.toLocaleString()+
      ' · 结余 '+sign+'¥'+Math.abs(stmt.net).toLocaleString(),stmt.net>=0?'success':'warn');
  }
  game.monthLedger=null;
}
function startNextMonthLedger(){
  if(!game)return;
  const nextWeek=game.week+1;
  const mk=getLedgerMonthKey(nextWeek);
  game.monthLedger={
    monthKey:mk,income:{},expense:{},
    weekStart:nextWeek,weekEnd:mk*WEEKS_PER_MONTH
  };
}
function closeMonthPayslip(){
  if(!game||game.monthLedger&&game.monthLedger._closing)return;
  if(game.monthLedger)game.monthLedger._closing=true;
  finalizeMonthLedger(true);
  startNextMonthLedger();
}
function toggleFinanceFold(){
  financeFoldOpen=!financeFoldOpen;
  renderFinanceLedger();
}
function fmtLedgerAmt(n){
  if(n>=10000)return'¥'+(n/10000).toFixed(n>=100000?1:2).replace(/\\.0$/,'')+'万';
  return'¥'+n.toLocaleString();
}
function renderFinanceLedgerBars(incomeTotal,expenseTotal){
  const max=Math.max(incomeTotal,expenseTotal,1);
  const iPct=Math.round(incomeTotal/max*100);
  const ePct=Math.round(expenseTotal/max*100);
  return'<div class="fin-bars">'+
    '<div class="fin-bar-row"><span class="fin-bar-lbl">💰</span><div class="fin-bar-track"><div class="fin-bar-fill inc" style="width:'+iPct+'%"></div></div><span class="fin-bar-amt">'+fmtLedgerAmt(incomeTotal)+'</span></div>'+
    '<div class="fin-bar-row"><span class="fin-bar-lbl">💸</span><div class="fin-bar-track"><div class="fin-bar-fill exp" style="width:'+ePct+'%"></div></div><span class="fin-bar-amt">'+fmtLedgerAmt(expenseTotal)+'</span></div>'+
    '</div>';
}
function renderFinanceLedgerCats(bucket,type){
  const items=Object.values(bucket||{}).filter(x=>x.amount>0).sort((a,b)=>b.amount-a.amount);
  if(!items.length)return'<div style="font-size:.62rem;color:var(--muted)">无</div>';
  return items.map(x=>'<div class="fin-cat"><span>'+x.icon+'</span><span>'+x.label+'</span><b>'+fmtLedgerAmt(x.amount)+'</b></div>').join('');
}
function renderFinanceLedgerExpenseCols(expense){
  const exp=expense||{};
  const housing=exp.housing,living=exp.living;
  const mand=[];
  if(housing&&housing.amount>0)mand.push(housing);
  if(living&&living.amount>0)mand.push(living);
  const other=Object.entries(exp).filter(([k,x])=>k!=='housing'&&k!=='living'&&x&&x.amount>0)
    .map(([,x])=>x).sort((a,b)=>b.amount-a.amount);
  let html='';
  if(mand.length){
    html+='<div><div class="fin-col-hdr">固定月支出</div>'+
      mand.map(x=>'<div class="fin-cat fin-cat-mand"><span>'+x.icon+'</span><span>'+x.label+'</span><b>'+fmtLedgerAmt(x.amount)+'</b></div>').join('')+
      '</div>';
  }
  html+='<div><div class="fin-col-hdr">其他支出</div>'+
    (other.length?other.map(x=>'<div class="fin-cat"><span>'+x.icon+'</span><span>'+x.label+'</span><b>'+fmtLedgerAmt(x.amount)+'</b></div>').join(''):
      '<div style="font-size:.62rem;color:var(--muted)">无</div>')+
    '</div>';
  return html;
}
function renderFinanceLedger(){
  const el=document.getElementById('financeLedgerPanel');
  if(!el||!game)return;
  const hist=game.monthLedgerHistory||[];
  const cur=game.monthLedger;
  const curInc=sumLedgerBucket(cur&&cur.income);
  const curExp=sumLedgerBucket(cur&&cur.expense);
  const latest=hist[0];
  const summary=latest
    ?latest.period+' · 结余 '+(latest.net>=0?'+':'')+fmtLedgerAmt(Math.abs(latest.net))
    :(curInc||curExp?ledgerPeriodLabel(game.week)+' 记账中…':'暂无账单');
  let body='';
  if(financeFoldOpen){
    if(cur&&(curInc>0||curExp>0)){
      body+='<div class="fin-stmt"><div class="fin-stmt-hdr"><span>'+ledgerPeriodLabel(game.week)+'</span><span class="fold-meta">进行中</span></div>'+
        renderFinanceLedgerBars(curInc,curExp)+
        '<div class="fin-cats"><div><div class="fin-col-hdr">收入来源</div>'+renderFinanceLedgerCats(cur.income,'income')+'</div>'+
        '<div>'+renderFinanceLedgerExpenseCols(cur.expense)+'</div></div>'+
        '<div class="fin-net '+(curInc-curExp>=0?'pos':'neg')+'">暂计结余 '+(curInc-curExp>=0?'+':'')+fmtLedgerAmt(Math.abs(curInc-curExp))+'</div></div>';
    }
    hist.forEach(stmt=>{
      body+='<div class="fin-stmt"><div class="fin-stmt-hdr"><span>'+stmt.period+'</span><span class="fold-meta">第'+stmt.weekRange[0]+'–'+stmt.weekRange[1]+'周</span></div>'+
        renderFinanceLedgerBars(stmt.incomeTotal,stmt.expenseTotal)+
        '<div class="fin-cats"><div><div class="fin-col-hdr">收入来源</div>'+renderFinanceLedgerCats(stmt.income,'income')+'</div>'+
        '<div>'+renderFinanceLedgerExpenseCols(stmt.expense)+'</div></div>'+
        '<div class="fin-net '+(stmt.net>=0?'pos':'neg')+'">结余 '+(stmt.net>=0?'+':'')+fmtLedgerAmt(Math.abs(stmt.net))+'</div></div>';
    });
    if(!body)body='<div style="padding:8px;font-size:.68rem;color:var(--muted)">每月结算后自动生成工资单</div>';
  }
  el.innerHTML='<div class="fin-panel"><div class="fin-fold-hdr" onclick="toggleFinanceFold()">'+
    '<span>📊 财务账单 <span class="fold-meta">'+summary+'</span></span><span>'+(financeFoldOpen?'▼':'▶')+'</span></div>'+
    (financeFoldOpen?'<div class="fin-fold-body">'+body+'</div>':'')+'</div>';
}
function getMonthlyExpenses(){
  if(game.livingSituation==='home'||game.livingAtHome){
    const childExp=getPlayerChildExpense();
    let living=applyChildLivingCost(2200,childExp);
    let label=game.livingOffParents?'住家里（啃老）':'住家里';
    if(childExp.childLabel)label=childExp.childLabel;
    return {housing:0,living,total:living,mortgage:0,label,isRent:false,affairMult:1};
  }
  if(game.inSchoolDorm){
    const dorm=game.dormRent||650;
    const childExp=getPlayerChildExpense();
    let living=applyChildLivingCost(2800,childExp);
    let label='学校寝室';
    if(childExp.childLabel)label=childExp.childLabel;
    return {housing:dorm,living,total:dorm+living,mortgage:0,label,isRent:true,affairMult:1};
  }
  if(game.homeless)return {housing:0,living:1000,total:1000,mortgage:0,label:'流浪（桥洞）',isRent:true,affairMult:1};
  if(game.onWelfare)return {housing:1000,living:1000,total:2000,mortgage:0,label:game.disabled?'伤残低保':'低保',isRent:true,affairMult:1};
  if(game.divorced){
    const childExp=getPlayerChildExpense();
    if(game.ownsHome&&!game.mortgagePaidOff){
      let mortgage=getMortgagePaymentAmt();
      let living=applyChildLivingCost(5000,childExp);
      let total=mortgage+living,label='离异独居';
      if(childExp.childLabel)label=childExp.childLabel;
      if(game.mortgageMonthlyOverride)label+=' · 房贷¥'+mortgage;
      else if(game.mortgagePaidOff)label='离异·已还清房贷';
      const affairMult=game.affairActive?2:1;
      if(affairMult>1){total*=affairMult;living*=affairMult;mortgage*=affairMult;label+=' · 婚外情（花费×2）'}
      return {housing:mortgage,living,total,mortgage,label,isRent:false,affairMult};
    }
    let living=applyChildLivingCost(3000,childExp);
    return {housing:3000,living,total:3000+living,mortgage:0,label:childExp.childLabel||'离异租房',isRent:true,affairMult:1};
  }
  const mortgage=getMortgagePaymentAmt();
  const childExp=getPlayerChildExpense();
  let living=applyChildLivingCost(5000,childExp);
  let total=mortgage+living;
  let label='自有住房';
  if(childExp.childLabel)label=childExp.childLabel;
  else if(game.mortgagePaidOff)label='已还清房贷';
  const affairMult=game.affairActive?2:1;
  if(affairMult>1){total*=affairMult;living*=affairMult;mortgage*=affairMult;label+=' · 婚外情（花费×2）'}
  if(game.partnerSoftRice>0){total+=game.partnerSoftRice;living+=game.partnerSoftRice;label+=' · 伴侣吃软饭¥'+game.partnerSoftRice}
  const exp={housing:mortgage,living,total,mortgage,label,isRent:false,affairMult};
  if(typeof appendPropertyMonthlyExpenses==='function')appendPropertyMonthlyExpenses(exp);
  return exp;
}

function fmtSavingsShort(n){
  if(n>=100000000)return(n/100000000).toFixed(n>=1000000000?1:2).replace(/\\.00$/,'')+'亿';
  if(n>=10000)return Math.round(n/10000)+'万';
  return n.toLocaleString();
}
function savingsBarPct(amt){
  if(amt<=0)return 0;
  const sc=SAVINGS_SCALE;
  if(amt>=sc[sc.length-1].amt)return 100;
  for(let i=1;i<sc.length;i++){
    if(amt<=sc[i].amt){
      const a=sc[i-1],b=sc[i];
      const t=(amt-a.amt)/(b.amt-a.amt);
      return a.pct+t*(b.pct-a.pct);
    }
  }
  return 100;
}

function renderHeaderProgress(){
  if(!game)return;
  const idealPct=typeof playerIdealProgressPct==='function'?playerIdealProgressPct():0;
  const idealFill=document.getElementById('idealProgFill');
  const idealText=document.getElementById('idealProgText');
  if(idealFill)idealFill.style.width=idealPct+'%';
  if(idealText)idealText.textContent=typeof playerIdealProgressLabel==='function'?playerIdealProgressLabel():'—';
  const mortPct=game.mortgagePaidOff?100:Math.min(100,game.mortgagePaymentsMade/MORTGAGE_MONTHS*100);
  const mortFill=document.getElementById('mortgageProgFill');
  const mortText=document.getElementById('mortgageProgText');
  if(mortFill)mortFill.style.width=mortPct+'%';
  if(mortText)mortText.textContent=game.mortgagePaidOff?'已还清':game.mortgagePaymentsMade+'/'+MORTGAGE_MONTHS+'月';
  const cash=Math.max(0,game.cash);
  const savPct=savingsBarPct(cash);
  const savFill=document.getElementById('savingsProgFill');
  const savText=document.getElementById('savingsProgText');
  if(savFill)savFill.style.width=savPct+'%';
  if(savText)savText.textContent='¥'+fmtSavingsShort(cash);
  const mRow=document.getElementById('milestoneRow');
  if(mRow){
    mRow.innerHTML=SAVINGS_MILESTONES.map(m=>{
      const pct=savingsBarPct(m.amt);
      const reached=cash>=m.amt;
      return '<div class="milestone-mark'+(reached?' reached':'')+'" style="left:'+pct+'%" title="'+m.label+' ¥'+m.amt.toLocaleString()+'">'+
        '<div class="tick"></div>'+m.icon+'<span class="milestone-amt">'+fmtSavingsShort(m.amt)+'</span></div>';
    }).join('');
  }
}

function getMortgagePaymentAmt(){
  if(!game||!game.ownsHome||game.mortgagePaidOff)return 0;
  return game.mortgageMonthlyOverride||MORTGAGE_PAYMENT;
}
function syncSpouseIntimacyToCompanion(){
  if(!game||!game.companion)return;
  if(game.spouseIntimacy==null)game.spouseIntimacy=INTIMACY_INITIAL;
  game.companion.spouseIntimacy=game.spouseIntimacy;
}
function adjustSpouseIntimacy(delta,reason){
  if(!game||game.divorced||!game.married)return;
  game.spouseIntimacy=Math.max(INTIMACY_MIN,Math.min(INTIMACY_MAX,(game.spouseIntimacy==null?INTIMACY_INITIAL:game.spouseIntimacy)+delta));
  syncSpouseIntimacyToCompanion();
  if(reason&&delta)addLog(reason+'亲密度 '+(delta>0?'+':'')+delta+'（现 '+game.spouseIntimacy+'）',delta>0?'info':'warn');
}
function portfolioMarketValue(portfolio){
  if(!game||!portfolio)return 0;
  return Object.keys(portfolio).reduce((s,sym)=>{
    const st=game.stocks.find(x=>x.symbol===sym),n=portfolio[sym]||0;
    return s+(st?st.price*n:0);
  },0);
}
function liquidateActorPortfolio(actor){
  if(!actor||!actor.portfolio)return 0;
  let rev=0;
  Object.keys({...actor.portfolio}).forEach(sym=>{
    const n=actor.portfolio[sym]||0;if(!n)return;
    const st=game.stocks.find(x=>x.symbol===sym);if(!st)return;
    const gross=st.price*n,comm=stockCommission(gross),net=gross-comm;
    rev+=net;delete actor.portfolio[sym];
  });
  actor.cash=(actor.cash||0)+rev;
  return rev;
}
function actorTotalAssets(actor){
  if(!actor)return 0;
  return Math.max(0,(actor.cash||0)+portfolioMarketValue(actor.portfolio||{}));
}
function actorDivorceAssets(actor){
  if(!actor)return 0;
  let n=actorTotalAssets(actor);
  if(game&&game.companion&&actor===game.companion){
    if(typeof refreshPartnerStashTotal==='function')n+=Math.max(0,refreshPartnerStashTotal());
    else n+=Math.max(0,actor.secretStash||0);
  }
  return n;
}
function computeDivorceSettlementOwedToPartner(){
  return computeDivorceSettlementBreakdown().owedToPartner;
}
function computeDivorceTakeFromPartner(){
  if(!game||!game.companion)return 0;
  const bd=computeDivorceSettlementBreakdown();
  return bd.takeFromPartner;
}
function computeDivorceSettlementBreakdown(){
  if(!game)return {playerCash:0,playerStock:0,playerTotal:0,partnerCash:0,partnerStock:0,partnerStashCash:0,partnerStashStock:0,partnerStashTotal:0,partnerVisible:0,partnerTotal:0,maritalTotal:0,halfShare:0,owedToPartner:0,takeFromPartner:0};
  if(typeof refreshPartnerStashTotal==='function')refreshPartnerStashTotal();
  const playerCash=Math.max(0,game.cash||0);
  const playerStock=portfolioMarketValue(game.portfolio||{});
  const playerTotal=playerCash+playerStock;
  const c=game.companion;
  const partnerCash=c?Math.max(0,c.cash||0):0;
  const partnerStock=c?portfolioMarketValue(c.portfolio||{}):0;
  const partnerStashCash=c?Math.max(0,c.secretStashCash||0):0;
  const partnerStashStock=typeof partnerStashStockValue==='function'?partnerStashStockValue():Math.max(0,(c&&c.secretStash||0)-partnerStashCash);
  const partnerStashTotal=partnerStashCash+partnerStashStock;
  const partnerVisible=partnerCash+partnerStock;
  const partnerTotal=partnerVisible+partnerStashTotal;
  const maritalTotal=playerTotal+partnerTotal;
  const halfShare=Math.round(maritalTotal/2);
  const owedToPartner=Math.max(0,halfShare-partnerTotal);
  const takeFromPartner=Math.max(0,partnerTotal-halfShare);
  return {playerCash,playerStock,playerTotal,partnerCash,partnerStock,partnerStashCash,partnerStashStock,partnerStashTotal,partnerVisible,partnerTotal,maritalTotal,halfShare,owedToPartner,takeFromPartner};
}
function computeDivorceLawyerFee(bd){
  const marital=(bd&&bd.maritalTotal)||0;
  return Math.max(DIVORCE_LAWYER_FEE_MIN,Math.round(marital*DIVORCE_LAWYER_FEE_RATE));
}
function playerAffordableLawyerFee(fee){
  if(!game||fee<=0)return false;
  const cash=game.cash||0;
  if(cash>=fee)return true;
  const portVal=portfolioMarketValue(game.portfolio||{});
  return cash+portVal>=fee;
}
function evaluateDivorceLawsuitOption(bd,opts){
  opts=opts||{};
  const fee=computeDivorceLawyerFee(bd);
  if(!playerAffordableLawyerFee(fee))return {ok:false,fee,reason:'手头资产不足以支付律师费 ¥'+fee.toLocaleString()+'（含变卖股票）'};
  if(bd.owedToPartner>fee)return {ok:true,fee,mode:'defend'};
  if(opts.playerReceives&&bd.takeFromPartner>fee)return {ok:true,fee,mode:'recover'};
  if(bd.owedToPartner>0)return {ok:false,fee,reason:'应分给对方的 ¥'+bd.owedToPartner.toLocaleString()+' 不足以覆盖律师费 ¥'+fee.toLocaleString()};
  return {ok:false,fee,reason:'争议金额过小，不必打官司'};
}
function buildDivorceSettlementModalHtml(bd,opts,reason,sueInfo){
  opts=opts||{};sueInfo=sueInfo||{};
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  let h='<p class="fold-meta" style="margin:0 0 10px">婚内可分割财产按双方合计对半；对方隐瞒的小金库计入其名下资产。</p>';
  h+='<table class="wish-table" style="font-size:.72rem;margin-bottom:10px"><tbody>';
  h+='<tr><td colspan="2" style="font-weight:600;padding-top:0">你的财产</td></tr>';
  h+='<tr><td class="wish-col-kind">现金</td><td class="wish-col-amt">¥'+bd.playerCash.toLocaleString()+'</td></tr>';
  h+='<tr><td class="wish-col-kind">股票市值</td><td class="wish-col-amt">¥'+bd.playerStock.toLocaleString()+'</td></tr>';
  h+='<tr><td class="wish-col-kind"><b>小计</b></td><td class="wish-col-amt"><b>¥'+bd.playerTotal.toLocaleString()+'</b></td></tr>';
  h+='<tr><td colspan="2" style="font-weight:600;padding-top:8px">'+pn+' 的财产</td></tr>';
  h+='<tr><td class="wish-col-kind">现金</td><td class="wish-col-amt">¥'+bd.partnerCash.toLocaleString()+'</td></tr>';
  h+='<tr><td class="wish-col-kind">股票市值</td><td class="wish-col-amt">¥'+bd.partnerStock.toLocaleString()+'</td></tr>';
  if(bd.partnerStashTotal>0){
    h+='<tr><td class="wish-col-kind">小金库 · 现金</td><td class="wish-col-amt">¥'+bd.partnerStashCash.toLocaleString()+'</td></tr>';
    h+='<tr><td class="wish-col-kind">小金库 · 持仓</td><td class="wish-col-amt">¥'+bd.partnerStashStock.toLocaleString()+'</td></tr>';
    h+='<tr><td class="wish-col-kind">小金库合计</td><td class="wish-col-amt" style="color:var(--orange)">¥'+bd.partnerStashTotal.toLocaleString()+'</td></tr>';
  }else{
    h+='<tr><td class="wish-col-kind">小金库</td><td class="wish-col-amt">未发现</td></tr>';
  }
  h+='<tr><td class="wish-col-kind"><b>小计</b></td><td class="wish-col-amt"><b>¥'+bd.partnerTotal.toLocaleString()+'</b></td></tr>';
  h+='<tr><td colspan="2" style="font-weight:600;padding-top:8px">分割方案</td></tr>';
  h+='<tr><td class="wish-col-kind">婚内可分割合计</td><td class="wish-col-amt">¥'+bd.maritalTotal.toLocaleString()+'</td></tr>';
  h+='<tr><td class="wish-col-kind">各分得一半</td><td class="wish-col-amt">¥'+bd.halfShare.toLocaleString()+'</td></tr>';
  if(bd.owedToPartner>0)
    h+='<tr><td class="wish-col-kind" style="color:var(--red)">你须向对方补足</td><td class="wish-col-amt" style="color:var(--red)"><b>¥'+bd.owedToPartner.toLocaleString()+'</b></td></tr>';
  else if(bd.takeFromPartner>0)
    h+='<tr><td class="wish-col-kind" style="color:var(--green)">对方须向你退还</td><td class="wish-col-amt" style="color:var(--green)"><b>¥'+bd.takeFromPartner.toLocaleString()+'</b></td></tr>';
  else h+='<tr><td class="wish-col-kind">资金清算</td><td class="wish-col-amt">双方已大致持平</td></tr>';
  h+='</tbody></table>';
  if(opts.playerKeepsHome===false)
    h+='<p style="color:var(--orange);font-size:.72rem;margin:0 0 8px">房产：你将<b>失去房产</b>，之后需租住出租屋。</p>';
  else if(opts.playerKeepsHome)
    h+='<p class="fold-meta" style="margin:0 0 8px">房产：你保留住房，月房贷约 ¥'+DIVORCE_MORTGAGE_PAYMENT.toLocaleString()+'。</p>';
  if(game.hasChildren||game.pregnant){
    const cust=typeof resolveChildCustody==='function'?resolveChildCustody():'partner';
    h+='<p class="fold-meta" style="margin:0 0 8px">子女抚养：预计归 <b>'+custodyHolderLabel(cust)+'</b>（按双方就业与性别规则）。</p>';
  }
  if(sueInfo.ok)
    h+='<p class="fold-meta" style="margin:0">可聘请律师打官司（约 ¥'+sueInfo.fee.toLocaleString()+'），胜诉可'+(sueInfo.mode==='recover'?'多追回对方隐匿财产':'减少你须补足的金额')+'；败诉律师费不退。</p>';
  else if(sueInfo.reason)
    h+='<p class="fold-meta" style="margin:0;color:var(--muted)">打官司：'+sueInfo.reason+'</p>';
  return h;
}
function resolveDivorceLawsuit(bd,opts,sueInfo){
  sueInfo=sueInfo||{};
  const fee=sueInfo.fee||computeDivorceLawyerFee(bd);
  const paid=collectFromPlayer(fee,'离婚诉讼律师费');
  if(paid<fee)return {success:false,feePaid:paid,adjustment:0,underpaid:true};
  let chance=0.30;
  if(sueInfo.mode==='recover')chance=0.42;
  if(opts.playerReceives)chance+=0.08;
  if(typeof hasSubstantiveAffairEvidence==='function'&&hasSubstantiveAffairEvidence()&&(opts.playerPaysHalf||bd.owedToPartner>0))chance-=0.14;
  if(bd.partnerStashTotal>500000)chance+=0.10;
  chance=Math.max(0.08,Math.min(0.62,chance));
  const success=Math.random()<chance;
  let adjustment=0;
  if(success){
    if(sueInfo.mode==='recover'&&bd.takeFromPartner>0)
      adjustment=Math.round(Math.max(bd.partnerStashTotal*0.45,bd.takeFromPartner*0.35));
    else if(bd.owedToPartner>0)
      adjustment=Math.round(Math.max(bd.partnerStashTotal*0.55,bd.owedToPartner*0.38));
  }
  return {success,feePaid:paid,adjustment,chance};
}
function applyDivorceAssetSettlement(bd,opts,reason,settlement){
  settlement=settlement||{};
  const execLines=[];
  let owe=bd.owedToPartner;
  let take=bd.takeFromPartner;
  const adj=settlement.lawsuit&&settlement.lawsuit.success?settlement.lawsuit.adjustment:0;
  const adjFail=settlement.lawsuit&&!settlement.lawsuit.success&&settlement.lawsuit.adjustment<0?settlement.lawsuit.adjustment:0;
  if(adj>0){
    if(owe>0)owe=Math.max(0,owe-adj);
    else if(take>0)take+=adj;
  }else if(adjFail<0&&owe>0)owe=owe+Math.abs(adjFail);
  if(take>0){
    const got=transferSettlementFromCompanion(take);
    if(got>0){
      const msg='从对方处收回 ¥'+got.toLocaleString()+(adj>0?'（含诉讼获益）':'');
      addLog('离婚清算：'+msg,'info');
      execLines.push(msg);
    }else{
      const msg='对方应退还 ¥'+take.toLocaleString()+'，但对方手头无钱可执行';
      addLog('离婚清算：'+msg,'warn');
      execLines.push(msg);
    }
    return execLines;
  }
  if(owe>0){
    const cashBefore=game.cash||0;
    const paid=collectFromPlayer(owe,divorcePayLabel(reason));
    if(game.companion)game.companion.cash=(game.companion.cash||0)+paid;
    const cashUsed=Math.min(cashBefore,paid);
    const fromStock=Math.max(0,paid-cashUsed);
    let payLog='婚内财产 ¥'+bd.maritalTotal.toLocaleString()+' · 各半 ¥'+bd.halfShare.toLocaleString()+' · 向对方补足 ¥'+paid.toLocaleString();
    if(adj>0)payLog+='（诉讼减免，原应补 ¥'+bd.owedToPartner.toLocaleString()+'）';
    if(paid<owe)payLog+='（应补 ¥'+owe.toLocaleString()+' · 资产不足）';
    if(fromStock>0)payLog+='（现金 ¥'+cashUsed.toLocaleString()+' + 变卖股票 ¥'+fromStock.toLocaleString()+'）';
    addLog('离婚清算：'+payLog,paid<owe?'warn':'fail');
    execLines.push(payLog);
  }else{
    execLines.push('双方财产大致持平，无需额外资金清算');
    addLog('离婚清算：双方财产大致持平','info');
  }
  return execLines;
}
function showDivorceCompletionModal(reason,opts,bd,settlement,execLines){
  if(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating())return;
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning)return;
  const lines=execLines&&execLines.length?execLines:['财产清算已执行'];
  let html='<p>'+(reason||'婚姻已解除').replace(/^💔\s*/,'')+'</p>';
  if(settlement&&settlement.lawsuit){
    const lbl=settlement.lawsuit.court?'庭审':'诉讼';
    html+='<p style="margin:8px 0;color:'+(settlement.lawsuit.success?'var(--green)':'var(--red)')+'"><b>离婚'+lbl+(settlement.lawsuit.success?'胜诉':'败诉')+'</b></p>';
  }else if(settlement&&settlement.settlementShown){
    html+='<p class="fold-meta" style="margin:0 0 8px"><b>双方已签署财产分割协议</b></p>';
  }
  html+=buildDivorceSettlementModalHtml(bd,opts||{},reason,null);
  html+='<p class="fold-meta" style="margin-top:8px"><b>执行结果：</b><br>'+lines.map(function(l){return '· '+l}).join('<br>')+'</p>';
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:'💔',title:'离婚 · 财产清算完成',html,
      buttons:[{text:'知道了',primary:true,handler:function(){closeConsumeModal(true);updateUI();autoSaveSlot();}}]
    });
  }
}
function transferSettlementFromCompanion(amount){
  if(!game||!game.companion||amount<=0)return 0;
  liquidateActorPortfolio(game.companion);
  let left=amount,taken=0;
  const c=game.companion;
  const fromCash=Math.min(left,Math.max(0,c.cash||0));
  if(fromCash){c.cash-=fromCash;taken+=fromCash;left-=fromCash}
  if(left>0&&(c.secretStashCash||0)>0){
    const fromStash=Math.min(left,c.secretStashCash);
    c.secretStashCash-=fromStash;
    c.secretStash=Math.max(0,(c.secretStash||0)-fromStash);
    taken+=fromStash;
    left-=fromStash;
  }
  if(taken>0){
    game.cash+=taken;
    game.money+=taken;
    ledgerAddIncome('divorce','💰','离婚财产分割',taken);
    checkCashStressMilestones();
  }
  return taken;
}
function collectFromPlayer(amount,label){
  if(!game||amount<=0)return 0;
  if((game.cash||0)<amount)liquidateActorPortfolio(game);
  const pay=Math.min(amount,Math.max(0,game.cash));
  game.cash-=pay;
  if(pay>0)ledgerAddExpense('divorce','💔',label||'离婚赔偿',pay,false);
  if(pay<amount)addLog('资产不足，已赔付 ¥'+pay.toLocaleString()+' / ¥'+amount.toLocaleString(),'warn');
  if(label&&(label.indexOf('勒索')>=0||label.indexOf('敲诈')>=0)&&typeof recordImprisonOrExtort==='function')recordImprisonOrExtort();
  return pay;
}
function transferAssetsToPlayer(fromActor,cap){
  if(!fromActor||!game)return 0;
  liquidateActorPortfolio(fromActor);
  const total=Math.min(cap||DIVORCE_ASSET_CAP,actorTotalAssets(fromActor));
  const take=Math.min(total,fromActor.cash||0);
  fromActor.cash=(fromActor.cash||0)-take;
  game.cash+=take;game.money+=take;
  if(take>0)ledgerAddIncome('divorce','💰','离婚财产',take);
  checkCashStressMilestones();
  return take;
}
function isActorEmployed(actor){
  return !!(actor&&actor.employed&&actor.employment);
}
function custodyHolderLabel(custody){
  if(custody==='player')return '你';
  return game.partnerDisplayName||game.exPartnerName||(game.partnerGender==='male'?'前夫':'前妻');
}
function resolveChildCustody(){
  const playerEmp=isActorEmployed(game);
  const partnerEmp=isActorEmployed(game.companion);
  if(playerEmp&&!partnerEmp)return 'player';
  if(!playerEmp&&partnerEmp)return 'partner';
  if(playerEmp&&partnerEmp){
    if(game.partnerGender==='female')return 'partner';
    if(game.playerGender==='female')return 'player';
    return 'partner';
  }
  if(game.partnerGender==='female')return 'partner';
  if(game.playerGender==='female')return 'player';
  return 'partner';
}
function pregnancyBioFatherFromContext(fromAffair,subject){
  if(fromAffair||game.outdoorAffairPregnancy)return 'other';
  if(subject==='player')return 'player';
  return 'player';
}
function ensureChildRecord(){
  if(!game)return null;
  if(typeof migrateChildrenArray==='function')migrateChildrenArray();
  if(game.childRecord)return game.childRecord;
  if(game.children&&game.children.length){
    const active=game.children.find(function(ch){return ch&&ch.monthsLeft>0;});
    if(active){game.childRecord=active;return active;}
  }
  if(game.hasChildren&&game.childRaisingMonthsLeft>0){
    const conceivedMarried=!game.divorced||!!game.pregnancyConceivedMarried;
    game.childRecord={
      monthsLeft:game.childRaisingMonthsLeft,
      bioFather:game.pregnancyBioFather||(conceivedMarried?'player':'other'),
      conceivedMarried,
      custody:game.divorced?(game.pendingChildCustody||resolveChildCustody()):'joint',
      supportDemand:!!game.divorced,
      paternityTested:false,
      paternityIsPlayer:null
    };
    if(game.childRecord.bioFather==='other')game.childRecord.supportDemand=false;
    game.pendingChildCustody=null;
  }
  return game.childRecord;
}
function syncChildRecordCompat(){
  if(typeof syncChildRecordFromChildren==='function'){syncChildRecordFromChildren();return;}
  const cr=game&&game.childRecord;
  if(!cr)return;
  game.hasChildren=cr.monthsLeft>0;
  game.childRaisingMonthsLeft=cr.monthsLeft||0;
}
function getPlayerChildExpense(){
  if(typeof getPlayerChildrenExpenses==='function'){
    const multi=getPlayerChildrenExpenses();
    if(multi&&multi.living>0)return multi;
  }
  const cr=ensureChildRecord();
  if(!cr||cr.monthsLeft<=0)return {living:0,childLabel:'',additive:false};
  if(!game.divorced)return {living:CHILD_LIVING_COST,childLabel:'育儿期（'+cr.monthsLeft+'月）',additive:false};
  if(cr.custody==='player')return {living:CHILD_LIVING_COST,childLabel:'独自抚养（'+cr.monthsLeft+'月）',additive:false};
  if(cr.bioFather==='other')return {living:0,childLabel:'',additive:false};
  if(cr.paternityTested&&!cr.paternityIsPlayer)return {living:0,childLabel:'',additive:false};
  if(cr.supportDemand&&cr.paternityIsPlayer===true)return {living:CHILD_LIVING_COST,childLabel:'抚养费（'+cr.monthsLeft+'月）',additive:true};
  return {living:0,childLabel:'',additive:false};
}
function applyChildLivingCost(baseLiving,childExp){
  if(!childExp||!childExp.living)return baseLiving;
  if(childExp.additive)return baseLiving+childExp.living;
  return childExp.living;
}
function initChildRecordAtBirth(){
  const custody=game.divorced?(game.pendingChildCustody||resolveChildCustody()):'joint';
  game.pendingChildCustody=null;
  const bioFather=game.pregnancyBioFather||'player';
  let supportDemand=false;
  if(game.divorced&&custody==='partner'&&bioFather!=='other')supportDemand=true;
  if(typeof registerChildAtBirth==='function'){
    const ch=registerChildAtBirth({
      bioFather,
      conceivedMarried:!!game.pregnancyConceivedMarried,
      custody,supportDemand
    });
    if(ch&&ch.name)addLog('👶 '+ch.name+' 降生','success');
  }else{
    game.childRecord={
      monthsLeft:CHILD_RAISING_MONTHS,
      bioFather,
      conceivedMarried:!!game.pregnancyConceivedMarried,
      custody,
      supportDemand:false,
      paternityTested:false,
      paternityIsPlayer:null
    };
    game.hasChildren=true;
    game.childRaisingMonthsLeft=CHILD_RAISING_MONTHS;
  }
  game.pregnancyBioFather=null;
  game.pregnancyConceivedMarried=false;
  if(game.divorced){
    const who=custodyHolderLabel(custody);
    addLog('⚖️ 孩子出生，抚养权归 '+who,'info');
    if(custody==='partner'&&bioFather!=='other'){
      if(game.childRecord)game.childRecord.supportDemand=true;
      showChildSupportDemandModal(who);
    }else if(bioFather==='other'){
      addLog('👶 该子为婚外情受孕，你无需支付抚养费','info');
    }
  }
}
function applyDivorceChildCustody(){
  if(!game)return;
  if(game.pregnant){
    game.pendingChildCustody=resolveChildCustody();
    const who=game.pregnantSubject==='player'?'你':pregnancyWhoLabel();
    const holder=custodyHolderLabel(game.pendingChildCustody);
    addLog('⚖️ 离婚时'+who+'仍怀孕，出生后抚养权归 '+holder,'info');
    if(game.pregnancyBioFather==='other'){
      addLog('👶 该胎为婚外情受孕，离婚后无需支付抚养费','info');
    }
  }
  const cr=ensureChildRecord();
  if(cr&&cr.monthsLeft>0){
    cr.custody=resolveChildCustody();
    addLog('⚖️ 孩子抚养权归 '+custodyHolderLabel(cr.custody),'info');
    if(cr.custody==='partner'&&cr.bioFather!=='other'){
      cr.supportDemand=true;
      showChildSupportDemandModal(custodyHolderLabel('partner'));
    }else if(cr.bioFather==='other'){
      cr.supportDemand=false;
    }
  }
}
function paternityTestChildEligible(){
  if(!game)return false;
  if(typeof getPaternityTestChild==='function'){
    const ch=getPaternityTestChild();
    if(ch)return true;
  }
  const cr=ensureChildRecord();
  return !!(cr&&cr.monthsLeft>0&&cr.custody==='partner'&&cr.bioFather!=='other'&&!cr.paternityTested);
}
function renderPaternitySpendingRow(){
  if(!paternityTestChildEligible())return null;
  return{
    label:'🧬 亲子鉴定 ¥'+PATERNITY_TEST_COST.toLocaleString(),
    meta:'对方带孩子索要抚养费 · 亲生则须按月支付 · 非亲生可免除',
    btn:'鉴定',fn:'showPaternityTestPromptModal(false)',off:false
  };
}
function showChildSupportDemandModal(holderWho){
  if(!game)return;
  if(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating())return;
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning)return;
  const who=holderWho||custodyHolderLabel('partner');
  const exName=game.exPartnerName||game.partnerDisplayName||(game.partnerGender==='male'?'前夫':'前妻');
  const html='<p><b>'+who+'</b>（'+exName+'）带着孩子，要求你每月支付抚养费 <b>¥'+CHILD_LIVING_COST.toLocaleString()+'</b>。</p>'+
    '<p class="fold-meta">若怀疑非亲生，可先花 ¥'+PATERNITY_TEST_COST.toLocaleString()+' 做亲子鉴定；也可在通讯录联系前任协商。</p>';
  addLog('💸 '+who+'（'+exName+'）索要抚养费 ¥'+CHILD_LIVING_COST+'/月','warn');
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:'💸',title:'抚养费纠纷',html,
      buttons:[
        {text:'亲子鉴定 ¥'+PATERNITY_TEST_COST.toLocaleString(),primary:true,handler:function(){
          closeConsumeModal(true);
          runPaternityTest(false);
        }},
        {text:'知道了',handler:function(){closeConsumeModal(true);updateUI();autoSaveSlot();}}
      ]
    });
  }
}
function showPaternityTestResultModal(html){
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:'🧬',title:'亲子鉴定结果',html,
      buttons:[{text:'知道了',primary:true,handler:function(){
        closeConsumeModal(true);
        renderSpendingPanel();updateUI();autoSaveSlot();
      }}]
    });
  }else{
    renderSpendingPanel();updateUI();autoSaveSlot();
  }
}
function showPaternityTestPromptModal(forExPregnancy){
  if(!game)return;
  const cost=PATERNITY_TEST_COST.toLocaleString();
  let html='',title='亲子鉴定';
  if(forExPregnancy){
    const name=game.exPartnerName||game.partnerDisplayName||'前任';
    html='<p><b>'+name+'</b> 声称怀孕后孩子可能是你的，要求你负责。</p>'+
      '<p class="fold-meta">花费 ¥'+cost+' 做亲子鉴定，确认是否与你有关。</p>';
  }else{
    if(!paternityTestChildEligible()){
      html='<p>当前没有需要做亲子鉴定的抚养纠纷。</p>';
      if(typeof showConsumeModalHandlers==='function'){
        showConsumeModalHandlers({icon:'🧬',title,html,buttons:[{text:'知道了',handler:function(){closeConsumeModal(true);}}]});
      }
      return;
    }
    const who=custodyHolderLabel('partner');
    html='<p>'+who+' 带孩子向你索要抚养费，你怀疑孩子并非亲生。</p>'+
      '<p class="fold-meta">花费 ¥'+cost+' 与孩子做亲子鉴定？</p>';
  }
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:'🧬',title,html,
      buttons:[
        {text:'确认鉴定 ¥'+cost,primary:true,handler:function(){
          closeConsumeModal(true);
          runPaternityTest(!!forExPregnancy);
        }},
        {text:'取消',handler:function(){closeConsumeModal(true);}}
      ]
    });
  }
}
function promptPaternityTest(forExPregnancy){
  showPaternityTestPromptModal(forExPregnancy===true);
}
function runPaternityTest(forExPregnancyClaim){
  if(!game)return false;
  if(game.cash<PATERNITY_TEST_COST){
    addLog('亲子鉴定需 ¥'+PATERNITY_TEST_COST.toLocaleString()+'，现金不足','fail');
    if(typeof showConsumeModalHandlers==='function'){
      showConsumeModalHandlers({
        icon:'🧬',title:'亲子鉴定',html:'现金不足，需 ¥'+PATERNITY_TEST_COST.toLocaleString()+'。',
        buttons:[{text:'知道了',handler:function(){closeConsumeModal(true);}}]
      });
    }
    return false;
  }
  game.cash-=PATERNITY_TEST_COST;
  if(typeof ledgerAddExpense==='function')ledgerAddExpense('family','🧬','亲子鉴定',PATERNITY_TEST_COST,false);
  let html='',logMsg='',logType='info';
  if(forExPregnancyClaim){
    game.exPregnancyDisputed=true;
    html='<p style="color:var(--green)"><b>鉴定结果：并非你的亲生骨肉</b></p><p class="fold-meta">无需承担抚养义务。</p>';
    logMsg='🧬 鉴定结果：并非你的亲生骨肉，无需承担抚养义务';
    logType='success';
  }else{
    let cr=typeof getPaternityTestChild==='function'?getPaternityTestChild():ensureChildRecord();
    if(!cr)cr=ensureChildRecord();
    if(!cr){
      html='<p style="color:var(--green)"><b>鉴定结果：并非你的亲生骨肉</b></p><p class="fold-meta">无需支付抚养费。</p>';
      logMsg='🧬 鉴定结果：并非你的亲生骨肉';
      logType='success';
    }else{
      cr.paternityTested=true;
      cr.paternityIsPlayer=cr.bioFather==='player';
      if(cr.paternityIsPlayer){
        cr.supportDemand=true;
        html='<p style="color:var(--orange)"><b>鉴定确认：是你的孩子</b></p><p>需按月支付抚养费 <b>¥'+CHILD_LIVING_COST.toLocaleString()+'</b>（剩余 '+cr.monthsLeft+' 月）。</p>';
        logMsg='🧬 鉴定确认：是你的孩子，需按月支付抚养费 ¥'+CHILD_LIVING_COST.toLocaleString();
        logType='warn';
      }else{
        cr.supportDemand=false;
        html='<p style="color:var(--green)"><b>鉴定结果：不是你的亲生骨肉</b></p><p class="fold-meta">无需支付抚养费。</p>';
        logMsg='🧬 鉴定结果：不是你的亲生骨肉，无需支付抚养费';
        logType='success';
      }
      syncChildRecordCompat();
    }
  }
  if(logMsg)addLog(logMsg,logType);
  showPaternityTestResultModal(html);
  return true;
}
function finalizeDivorce(opts){
  if(!game||game.divorced)return;
  const o=opts||{};
  if(typeof archiveGiftWishHistoryOnDivorce==='function')archiveGiftWishHistoryOnDivorce();
  game.divorced=true;game.married=false;game.romanceStage=null;game.affairActive=false;game.partnerAffairActive=false;game.partnerStdActive=false;game.livingOffSpouse=false;
  game.longDistance=false;
  game.spouseIntimacy=0;
  game.lastDateWeek=0;
  game.procreateIntentWeek=-1;
  if(o.playerKeepsHome){
    game.ownsHome=true;
    if(!game.mortgagePaidOff)game.mortgageMonthlyOverride=DIVORCE_MORTGAGE_PAYMENT;
  }else{
    game.ownsHome=false;game.mortgageMonthlyOverride=0;
  }
  if(!o.skipStress){
    addStress(o.stressDelta||STRESS_DIVORCE,'离婚 ');
    if(!o.playerInitiated)game.stressMultiplier=Math.max(game.stressMultiplier,2);
  }
  markLifeStressEvent('divorced','离婚 ');
  game.lastDivorceReason=o.reason||'💔 离婚了。';
  game.lastDivorceOpts=game.divorceProceedings?game.divorceProceedings.opts:null;
  game.divorcedWeek=game.week||0;
  game.divorceProceedings=null;
  game._pendingDivorce=null;
  addLog(o.reason||'💔 离婚了。','stress');
  if(game.companion){
    game.companion.divorced=true;game.companion.married=false;
    game.companion.affairActive=false;game.companion.livingOffSpouse=false;
    game.companion.spouseIntimacy=0;
    if(!o.playerKeepsHome)game.companion.ownsHome=false;
    revealPartnerSecretStashOnDivorce(!!o.settlementShown);
  }
  applyDivorceChildCustody();
  if(typeof syncExSpouseContact==='function')syncExSpouseContact();
  else if(typeof syncSpouseContact==='function')syncSpouseContact();
  updateLongDistanceStatus(true);
  renderSpendingPanel();updateUI();
}
function confirmPlayerDivorce(){
  if(!game||!game.married||game.divorced)return;
  if(game.divorceProceedings){
    addLog('离婚程序已在进行中','info');
    if(typeof showDivorceMediationModal==='function')showDivorceMediationModal();
    return;
  }
  const html='<p>确定主动提出离婚？</p>'+
    '<p class="fold-meta">你将保留房产，月房贷约 ¥'+DIVORCE_MORTGAGE_PAYMENT.toLocaleString()+'，亲密度清零。随后进入<b>财产公示与分割调解</b>（可协商或打官司）。</p>';
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:'💔',title:'主动离婚',html,
      buttons:[
        {text:'提出离婚',primary:true,handler:function(){
          closeConsumeModal(true);
          const reason='💔 你提出离婚。保留房产，月房贷升至 ¥'+DIVORCE_MORTGAGE_PAYMENT+'。';
          game._pendingDivorce={reason:reason,opts:{playerKeepsHome:true,playerInitiated:true},extra:{}};
          addLog(reason,'stress');
          showDivorceMediationModal();
        }},
        {text:'取消',handler:function(){closeConsumeModal(true);}}
      ]
    });
  }
}
function divorcePayLabel(reason){
  const r=reason||'';
  if(r.indexOf('聊骚')>=0)return '聊骚曝光赔偿';
  if(r.indexOf('偷情')>=0||r.indexOf('婚外情')>=0||r.indexOf('幽会')>=0)return '出轨赔偿';
  if(r.indexOf('怀孕')>=0)return '怀孕相关赔偿';
  return '离婚赔偿';
}
function hasSubstantiveAffairEvidence(){
  if(!game)return false;
  if(game.affairActive||game.affairTriggered)return true;
  if(game.contacts&&game.contacts.some(c=>
    (c.affairCount||0)>0||
    c.affairStatus==='affair'||c.affairStatus==='fwb'||c.affairStatus==='married_affair'
  ))return true;
  return false;
}
function isFlirtOnlyDivorceReason(reason){
  return !!(reason&&reason.indexOf('聊骚')>=0);
}
function getDivorceProceedings(){
  return game&&game.divorceProceedings?game.divorceProceedings:null;
}
function repairDivorceBufferDeadline(){
  const dp=getDivorceProceedings();
  if(!dp||dp.phase==='mediation')return;
  if(!dp.phase)dp.phase='buffer';
  const w=game.week||0;
  const started=dp.startedWeek!=null?dp.startedWeek:w;
  if(dp.startedWeek==null)dp.startedWeek=started;
  const expectDeadline=started+DIVORCE_BUFFER_WEEKS;
  const elapsed=Math.max(0,w-started);
  if(elapsed<DIVORCE_BUFFER_WEEKS&&(!dp.bufferDeadlineWeek||dp.bufferDeadlineWeek<expectDeadline)){
    dp.bufferDeadlineWeek=expectDeadline;
  }
}
function divorceBufferWeeksLeft(){
  const dp=getDivorceProceedings();
  if(!dp)return 0;
  if(dp.phase==='mediation')return 0;
  if(!dp.phase)dp.phase='buffer';
  if(dp.phase!=='buffer')return 0;
  repairDivorceBufferDeadline();
  return Math.max(0,(dp.bufferDeadlineWeek||0)-(game.week||0));
}
function hasAffairContactsInPhone(){
  if(!game||!game.contacts)return false;
  if(typeof contactHasAffairRecord==='function')return game.contacts.some(contactHasAffairRecord);
  return game.contacts.some(function(c){
    return (c.affairCount||0)>0||c.affairStatus==='affair'||c.affairStatus==='fwb'||c.affairStatus==='married_affair';
  });
}
function checkDivorceReconciliationEligibility(){
  const wishCount=typeof getGiftWishCount==='function'?getGiftWishCount():(game.giftWishHistory||[]).length;
  const noAffair=!hasAffairContactsInPhone();
  const intim=game.spouseIntimacy!=null?game.spouseIntimacy:INTIMACY_INITIAL;
  const wishesOk=wishCount>DIVORCE_RECONCILE_WISH_MIN;
  const intimOk=intim>DIVORCE_RECONCILE_INTIMACY_AFTER;
  return {wishesOk,noAffair,intimOk,wishCount,intim,ok:wishesOk&&noAffair&&intimOk};
}
function buildReconciliationCriteriaHtml(){
  const el=checkDivorceReconciliationEligibility();
  return '<p class="fold-meta" style="margin:6px 0 4px"><b>挽回成功须同时满足：</b></p>'+
    '<ul style="font-size:.72rem;margin:0 0 8px;padding-left:18px;line-height:1.55">'+
    '<li'+(el.wishesOk?' style="color:var(--green)"':'')+'>历史愿望单 &gt; '+DIVORCE_RECONCILE_WISH_MIN+' 条（当前 <b>'+el.wishCount+'</b>）</li>'+
    '<li'+(el.noAffair?' style="color:var(--green)"':'')+'>手机通讯录无出轨对象（挽回后旧聊骚累计清零）</li>'+
    '<li'+(el.intimOk?' style="color:var(--green)"':'')+'>亲密度 &gt; '+DIVORCE_RECONCILE_INTIMACY_AFTER+'（当前 <b>'+el.intim+'</b>）</li>'+
    '</ul>';
}
function startDivorceProceedings(reason,opts,extra){
  const w=game.week||0;
  extra=extra||{};
  const skipDeduct=!!extra.skipIntimacyDeduct;
  game.divorceProceedings={
    phase:'buffer',
    reason:reason||'💔 伴侣提出离婚。',
    opts:opts||{},
    extra:extra,
    startedWeek:w,
    bufferDeadlineWeek:w+DIVORCE_BUFFER_WEEKS,
    intimacyDeducted:skipDeduct
  };
  game._pendingDivorce={reason:reason,opts:opts||{},extra:extra};
  if(!skipDeduct){
    adjustSpouseIntimacy(-DIVORCE_PLEAD_INTIMACY_COST,'提出离婚 ');
    game.divorceProceedings.intimacyDeducted=true;
  }
}
function clearDivorceProceedings(){
  if(!game)return;
  game.divorceProceedings=null;
  game._pendingDivorce=null;
}
function getPendingDivorcePayload(){
  const dp=getDivorceProceedings();
  if(dp)return {reason:dp.reason,opts:dp.opts||{},extra:dp.extra||{}};
  return game._pendingDivorce;
}
function buildPartnerDivorceModalHtml(reason,opts,extra){
  opts=opts||{};extra=extra||{};
  const flirt=extra.flirt!=null?extra.flirt:(game.flirtPeopleTotal||0);
  let left=divorceBufferWeeksLeft();
  if(!left&&getDivorceProceedings())left=DIVORCE_BUFFER_WEEKS;
  let html='';
  if(isFlirtOnlyDivorceReason(reason)){
    html='<p>伴侣从你手机/社交记录中发现你累计聊骚 <b>'+flirt+'</b> 人，情绪激动提出离婚。</p>';
    if(!hasSubstantiveAffairEvidence())html+='<p class="fold-meta">未发现幽会、偷情等实质出轨记录。</p>';
    else html+='<p class="fold-meta">同时发现你有实质出轨记录。</p>';
  }else{
    html='<p>'+(reason||'伴侣提出离婚').replace(/^💔\s*/,'')+'</p>';
  }
  const intimNow=game.spouseIntimacy!=null?game.spouseIntimacy:(extra.intim!=null?extra.intim:INTIMACY_INITIAL);
  html+='<p class="fold-meta">提出离婚亲密度 -'+DIVORCE_PLEAD_INTIMACY_COST+' · 现 <b>'+intimNow+'</b></p>';
  html+='<p style="color:var(--orange);margin:8px 0"><b>离婚缓冲期 '+DIVORCE_BUFFER_WEEKS+' 周</b>：婚姻暂不解除，剩余约 <b>'+left+'</b> 周。</p>';
  html+='<p class="fold-meta">缓冲期内可尝试挽回；届满后进入调解 → 财产/抚养权分配；调解不成可请律师庭审。</p>';
  html+=buildReconciliationCriteriaHtml();
  return html;
}
function renderDivorceProceedingsCompanionHtml(){
  const dp=getDivorceProceedings();
  if(!dp||game.divorced)return '';
  const inBuffer=!dp.phase||dp.phase==='buffer';
  const left=inBuffer?divorceBufferWeeksLeft():0;
  let h='<div class="companion-section"><h4 style="color:var(--orange)">离婚程序进行中</h4>';
  if(inBuffer){
    h+='<div class="companion-row"><span>缓冲期</span><span>剩余约 '+left+' 周 · 可挽回</span></div>';
    h+='<div style="margin-top:6px"><button class="btn btn-primary" onclick="attemptDivorceReconciliation()">尝试挽回</button> ';
    h+='<button class="btn" onclick="showDivorceBufferInfoModal()">查看条件</button></div>';
  }else if(dp.phase==='mediation'){
    h+='<div class="companion-row"><span>调解/诉讼</span><span>待处理财产与抚养权</span></div>';
    h+='<div style="margin-top:6px"><button class="btn btn-primary" onclick="showDivorceMediationModal()">进入调解</button></div>';
  }
  h+='</div>';
  return h;
}
function showDivorceBufferInfoModal(){
  const dp=getDivorceProceedings();
  if(!dp)return;
  const html='<p>'+(dp.reason||'').replace(/^💔\s*/,'')+'</p>'+buildReconciliationCriteriaHtml();
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({icon:'📋',title:'离婚缓冲期 · 挽回条件',html,buttons:[
      {text:'尝试挽回',primary:true,handler:attemptDivorceReconciliation},
      {text:'关闭',handler:function(){closeConsumeModal(true)}}
    ]});
  }
}
function forgiveFlirtHistoryOnReconcile(){
  if(!game)return 0;
  const prev=game.flirtPeopleTotal||0;
  game.flirtPeopleTotal=0;
  game.flirtReconcileWeek=game.week||0;
  game.flirtDivorceGraceUntilWeek=(game.week||0)+DIVORCE_BUFFER_WEEKS;
  return prev;
}
function attemptDivorceReconciliation(){
  closeConsumeModal(true);
  if(!game||game.divorced||!getDivorceProceedings())return;
  const el=checkDivorceReconciliationEligibility();
  if(!el.ok){
    let html='<p style="color:var(--red)">挽回失败，条件未全部满足。</p>'+buildReconciliationCriteriaHtml();
    if(typeof showConsumeModalHandlers==='function'){
      showConsumeModalHandlers({icon:'💔',title:'挽回失败',html,buttons:[{text:'继续缓冲期',handler:function(){closeConsumeModal(true)}}]});
    }else addLog('挽回失败：条件未满足','fail');
    return;
  }
  const prevFlirt=forgiveFlirtHistoryOnReconcile();
  clearDivorceProceedings();
  if(typeof restoreSpouseContactAfterReconcile==='function')restoreSpouseContactAfterReconcile();
  else if(typeof syncSpouseContact==='function')syncSpouseContact();
  const okMsg='🙏 挽回成功！婚姻继续（亲密度 '+game.spouseIntimacy+'）'+
    (prevFlirt>0?' · 旧聊骚记录已删除（累计 '+prevFlirt+' 人）':'');
  addLog(okMsg,'success');
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:'🙏',title:'挽回成功',html:'<p style="color:var(--green)"><b>婚姻继续</b></p><p class="fold-meta">亲密度 '+game.spouseIntimacy+
        (prevFlirt>0?' · 旧聊骚记录已删除（累计 '+prevFlirt+' 人）':'')+'</p>',
      buttons:[{text:'知道了',primary:true,handler:function(){
        closeConsumeModal(true);
        if(typeof renderContactsModal==='function'&&document.getElementById('contactsOverlay')&&!document.getElementById('contactsOverlay').classList.contains('hidden'))renderContactsModal();
        updateUI();autoSaveSlot();
      }}]
    });
  }else{
    if(typeof renderContactsModal==='function'&&document.getElementById('contactsOverlay')&&!document.getElementById('contactsOverlay').classList.contains('hidden'))renderContactsModal();
    updateUI();autoSaveSlot();
  }
}
function dismissDivorceBufferModal(){
  closeConsumeModal(true);
  const left=divorceBufferWeeksLeft();
  addLog('📋 进入离婚缓冲期，剩余约 '+left+' 周可挽回','info');
  updateUI();autoSaveSlot();
}
function showDivorceMediationModal(){
  const p=getPendingDivorcePayload();
  if(!p||!game||game.divorced)return;
  if(typeof refreshPartnerStashTotal==='function')refreshPartnerStashTotal();
  const bd=computeDivorceSettlementBreakdown();
  const html='<p class="fold-meta" style="margin:0 0 8px">调解阶段：双方公布财产（含对方小金库），协商分割方案与抚养权。</p>'+
    buildDivorceSettlementModalHtml(bd,p.opts,p.reason,null);
  const buttons=[
    {text:'达成一致 · 按此分割',primary:true,handler:acceptDivorceSettlement},
    {text:'无法达成一致 · 打官司',handler:showDivorceLawyerPickerModal}
  ];
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({icon:'⚖️',title:'离婚调解 · 财产公示',html,buttons});
  }else acceptDivorceSettlement();
}
function showDivorceLawyerPickerModal(){
  closeConsumeModal(true);
  const p=getPendingDivorcePayload();
  if(!p||!game||game.divorced)return;
  const bd=computeDivorceSettlementBreakdown();
  let html='<p class="fold-meta">调解破裂，请选择律师团队进行庭审。法院将宣判财产分割与抚养权并强制执行。</p><ul style="font-size:.72rem;margin:8px 0;padding-left:18px">';
  ['normal','premium','director'].forEach(function(id){
    const t=DIVORCE_LAWYER_TIERS[id];
    const afford=(game.cash||0)>=t.fee||((game.cash||0)+portfolioMarketValue(game.portfolio||{}))>=t.fee;
    html+='<li><b>'+t.label+'</b> · 律师费 ¥'+t.fee.toLocaleString()+' · 胜诉基准 '+Math.round(t.win*100)+'%'+(afford?'':' · <span style="color:var(--red)">资产不足</span>')+'</li>';
  });
  html+='</ul>';
  const buttons=[
    {text:'普通（¥1万）',handler:function(){startDivorceCourtTrial('normal')}},
    {text:'重点（¥10万）',primary:true,handler:function(){startDivorceCourtTrial('premium')}},
    {text:'总监（¥100万）',handler:function(){startDivorceCourtTrial('director')}}
  ];
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({icon:'⚖️',title:'选择律师团队',html,buttons});
  }
}
function resolveDivorceCourtTrial(tierId,bd,opts){
  const t=DIVORCE_LAWYER_TIERS[tierId]||DIVORCE_LAWYER_TIERS.normal;
  const paid=collectFromPlayer(t.fee,t.label+'律师费');
  if(paid<t.fee)return {success:false,feePaid:paid,adjustment:0,underpaid:true,tier:t};
  let chance=t.win;
  if(typeof hasSubstantiveAffairEvidence==='function'&&hasSubstantiveAffairEvidence())chance-=0.12;
  if(bd.partnerStashTotal>500000)chance+=0.08;
  if(opts.playerReceives)chance+=0.06;
  chance=Math.max(0.1,Math.min(0.78,chance));
  const success=Math.random()<chance;
  let adjustment=0,playerKeepsHomeOverride=null;
  if(success){
    if(bd.owedToPartner>0)adjustment=Math.round(Math.max(bd.partnerStashTotal*t.winAdj,bd.owedToPartner*0.35));
    else if(bd.takeFromPartner>0)adjustment=Math.round(Math.max(bd.partnerStashTotal*0.25,bd.takeFromPartner*0.30));
    if(bd.owedToPartner>0)playerKeepsHomeOverride=true;
  }else{
    if(bd.owedToPartner>0)adjustment=-Math.round(bd.owedToPartner*0.12);
    playerKeepsHomeOverride=false;
  }
  return {success,feePaid:paid,adjustment,chance,tier:t,playerKeepsHomeOverride,court:true};
}
function startDivorceCourtTrial(tierId){
  closeConsumeModal(true);
  const p=getPendingDivorcePayload();
  if(!p||!game||game.divorced)return;
  const bd=computeDivorceSettlementBreakdown();
  const t=DIVORCE_LAWYER_TIERS[tierId];
  if(!t)return;
  const afford=(game.cash||0)>=t.fee||((game.cash||0)+portfolioMarketValue(game.portfolio||{}))>=t.fee;
  if(!afford){
    addLog('资产不足以支付 '+t.label+'（¥'+t.fee.toLocaleString()+'）','fail');
    if(typeof showConsumeModalHandlers==='function'){
      showConsumeModalHandlers({
        icon:'⚖️',title:'无法开庭',html:'资产不足以支付 <b>'+t.label+'</b>（¥'+t.fee.toLocaleString()+'）。请换档律师或补足资产。',
        buttons:[{text:'重新选择律师',primary:true,handler:function(){closeConsumeModal(true);showDivorceLawyerPickerModal();}}]
      });
    }else showDivorceLawyerPickerModal();
    return;
  }
  const verdict=resolveDivorceCourtTrial(tierId,bd,p.opts);
  if(verdict.underpaid){
    addLog('律师费不足，无法开庭','fail');
    if(typeof showConsumeModalHandlers==='function'){
      showConsumeModalHandlers({
        icon:'⚖️',title:'无法开庭',html:'律师费不足，无法开庭。请换档律师或补足现金/股票。',
        buttons:[{text:'重新选择律师',primary:true,handler:function(){closeConsumeModal(true);showDivorceLawyerPickerModal();}}]
      });
    }else showDivorceLawyerPickerModal();
    return;
  }
  let html=verdict.success
    ?'<p style="color:var(--green)"><b>法院判决（倾向你方）</b> · 胜率约 '+Math.round(verdict.chance*100)+'%</p>'
    :'<p style="color:var(--red)"><b>法院判决（倾向对方）</b> · 胜率约 '+Math.round(verdict.chance*100)+'%</p>';
  html+='<p>'+t.label+' 律师费 ¥'+verdict.feePaid.toLocaleString()+(verdict.success?'':'，不予退还')+'。</p>';
  if(verdict.adjustment>0&&bd.owedToPartner>0)html+='<p>法院减轻你方补足义务约 <b>¥'+verdict.adjustment.toLocaleString()+'</b></p>';
  else if(verdict.adjustment>0&&bd.takeFromPartner>0)html+='<p>法院判令对方额外支付约 <b>¥'+verdict.adjustment.toLocaleString()+'</b></p>';
  else if(verdict.adjustment<0)html+='<p>法院判令你方额外支付约 <b>¥'+Math.abs(verdict.adjustment).toLocaleString()+'</b></p>';
  if(verdict.playerKeepsHomeOverride===false)html+='<p style="color:var(--orange)">房产判归对方或需搬离出租屋。</p>';
  else if(verdict.playerKeepsHomeOverride===true)html+='<p>房产判归你方保留。</p>';
  const execOpts=Object.assign({},p.opts);
  if(verdict.playerKeepsHomeOverride!=null)execOpts.playerKeepsHome=verdict.playerKeepsHomeOverride;
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({
      icon:'⚖️',title:'法院宣判',html,
      buttons:[{text:'执行判决 · 离婚',primary:true,handler:function(){
        closeConsumeModal(true);
        clearDivorceProceedings();
        executePartnerDivorce(p.reason,execOpts,p.extra,{bd,lawsuit:verdict,settlementShown:true});
      }}]
    });
  }else{
    clearDivorceProceedings();
    executePartnerDivorce(p.reason,execOpts,p.extra,{bd,lawsuit:verdict,settlementShown:true});
  }
}
function acceptDivorceSettlement(){
  closeConsumeModal(true);
  const p=getPendingDivorcePayload();
  if(!p||!game||game.divorced)return;
  const bd=computeDivorceSettlementBreakdown();
  addLog('⚖️ 双方达成一致，签署财产分割协议','info');
  clearDivorceProceedings();
  executePartnerDivorce(p.reason,p.opts,p.extra,{bd,settlementShown:true});
}
function showPartnerDivorceModal(reason,opts,extra){
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const html=buildPartnerDivorceModalHtml(reason,opts,extra);
  const buttons=[
    {text:'尝试挽回',primary:true,handler:attemptDivorceReconciliation},
    {text:'进入缓冲期（'+DIVORCE_BUFFER_WEEKS+'周）',handler:dismissDivorceBufferModal}
  ];
  if(typeof showConsumeModalHandlers==='function'){
    showConsumeModalHandlers({icon:'💔',title:pn+' 提出离婚',html,buttons});
  }else if(typeof queueStatusModal==='function'){
    queueStatusModal(pn+' 提出离婚',html.replace(/<[^>]+>/g,' '),'💔',{btn:'进入缓冲期',onClose:dismissDivorceBufferModal});
  }else{
    startDivorceProceedings(reason,opts,extra);
    dismissDivorceBufferModal();
  }
}
function tickDivorceProceedings(){
  if(!game||!game.divorceProceedings||game.divorced)return;
  const dp=game.divorceProceedings;
  if(dp.phase==='buffer')repairDivorceBufferDeadline();
  if(dp.phase==='buffer'&&(game.week||0)>=dp.bufferDeadlineWeek){
    dp.phase='mediation';
    dp._mediationPending=true;
    addLog('⚖️ 离婚缓冲期届满，进入调解程序','warn');
  }
}
function tryShowPendingDivorceModal(){
  if(!game||!game.divorceProceedings||game.divorced)return;
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning)return;
  if(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating())return;
  if(game.divorceProceedings._mediationPending){
    game.divorceProceedings._mediationPending=false;
    showDivorceMediationModal();
  }
}
function migrateDivorceBufferRestore(){
  if(!game||game.divorceProceedingsRestored)return;
  game.divorceProceedingsRestored=true;
  if(!game.divorced||game.divorceProceedings)return;
  const hasEx=(game.contacts||[]).some(function(c){return c&&(c.id==='core_ex_spouse'||c.kind==='ex_spouse')});
  if(hasEx)return;
  game.divorced=false;
  game.married=true;
  if(game.companion){
    game.companion.divorced=false;
    game.companion.married=true;
    if(game.companion.spouseIntimacy>0)game.spouseIntimacy=game.companion.spouseIntimacy;
    else if((game.spouseIntimacy||0)<=0)game.spouseIntimacy=INTIMACY_INITIAL;
  }else if((game.spouseIntimacy||0)<=0)game.spouseIntimacy=INTIMACY_INITIAL;
  if(!game.ownsHome&&(game.mortgagePaymentsMade>0||game.mortgagePaidOff))game.ownsHome=true;
  if(typeof restoreSpouseContactAfterReconcile==='function')restoreSpouseContactAfterReconcile();
  else if(typeof syncSpouseContact==='function')syncSpouseContact();
  startDivorceProceedings(
    game.lastDivorceReason||'💔 伴侣提出离婚（缓冲期补档）',
    game.lastDivorceOpts||{},
    {intim:game.spouseIntimacy,flirt:game.flirtPeopleTotal||0,skipIntimacyDeduct:true}
  );
  repairDivorceBufferDeadline();
  addLog('📋 离婚缓冲期补档：婚姻恢复，剩余约 '+divorceBufferWeeksLeft()+' 周可挽回','info');
}
function executePartnerDivorce(reason,opts,extra,settlement){
  if(!game||game.divorced)return;
  opts=opts||{};extra=extra||{};settlement=settlement||{};
  const bd=settlement.bd||computeDivorceSettlementBreakdown();
  finalizeDivorce({
    reason:reason||'💔 伴侣提出离婚。',
    playerKeepsHome:!!opts.playerKeepsHome,
    playerInitiated:!!opts.playerInitiated,
    skipStress:false,
    settlementShown:!!settlement.settlementShown
  });
  const execLines=applyDivorceAssetSettlement(bd,opts,reason,settlement)||[];
  if(settlement.lawsuit){
    const lbl=settlement.lawsuit.court?'庭审':'诉讼';
    addLog(settlement.lawsuit.success?'⚖️ 离婚'+lbl+'胜诉':'⚖️ 离婚'+lbl+'败诉',settlement.lawsuit.success?'success':'fail');
  }
  showDivorceCompletionModal(reason,opts,bd,settlement,execLines);
  updateUI();autoSaveSlot();
}
function partnerRequestsDivorce(reason,opts){
  if(!game||!game.married||game.divorced)return;
  if(game.divorceProceedings){
    addLog('离婚程序已在进行中','info');
    if(typeof showDivorceBufferInfoModal==='function')showDivorceBufferInfoModal();
    return;
  }
  opts=opts||{};
  const extra={intim:game.spouseIntimacy,flirt:game.flirtPeopleTotal||0};
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning){
    startDivorceProceedings(reason,opts,extra);
    const dp=game.divorceProceedings;
    if(dp)dp.phase='mediation';
    executePartnerDivorce(reason,opts,extra,{bd:computeDivorceSettlementBreakdown(),settlementShown:true});
    return;
  }
  startDivorceProceedings(reason,opts,extra);
  extra.intim=game.spouseIntimacy;
  showPartnerDivorceModal(reason,opts,extra);
}
function isSameSexCouple(){
  return !!(game&&game.married&&!game.divorced&&game.playerGender===game.partnerGender);
}
function isSameSexFemaleCouple(){
  return isSameSexCouple()&&game.playerGender==='female';
}
function isSameSexMaleCouple(){
  return isSameSexCouple()&&game.playerGender==='male';
}
function partnerHasExtramaritalAffair(){
  if(!game||!game.married||game.divorced)return false;
  if(game.partnerAffairActive)return true;
  if((game.companionFlirtTotal||0)>=100&&game.affairActive&&game.affairTriggered)return true;
  return false;
}
function sexSafeOptionLabel(){
  if(isSameSexFemaleCouple())return '角色扮演';
  return '戴套';
}
function sexRiskOptionLabel(short){
  if(isSameSexMaleCouple())return short?'不戴套':'不戴套（不会怀孕）';
  if(isSameSexCouple())return short?'玩具':'玩具（额外减压）';
  return short?'未戴套':'不戴套（额外减压）';
}
function sexSessionStressLabel(noCondom){
  if(!noCondom)return isSameSexFemaleCouple()?'角色扮演 ':'戴套 ';
  if(isSameSexMaleCouple())return '不戴套 ';
  if(isSameSexCouple())return '玩具 ';
  return '不戴套 ';
}
function tryInfectPartnerWithStd(){
  if(!game||!partnerHasExtramaritalAffair()||game.partnerStdActive)return false;
  if(Math.random()>=PARTNER_STD_ON_AFFAIR_CHANCE)return false;
  game.partnerStdActive=true;
  addLog('🦠 伴侣在婚外情中先感染了性病','warn');
  return true;
}
function infectPlayerWithStd(reason){
  if(!game||game.stdActive)return false;
  game.stdActive=true;
  game.stdWeeksInfected=0;
  game.stdTreatmentVisits=0;
  game.stdLastTreatmentWeek=-1;
  addStress(6,'感染性病 ');
  addLog('🦠 '+reason+' · 压力+6 · 需连续四周去医院并付 ¥'+STD_CURE_COST+' 治愈','fail');
  return true;
}
function tryContractStdFromPartner(){
  if(!game||!game.married||game.divorced||game.stdActive)return false;
  if(!partnerHasExtramaritalAffair()||!game.partnerStdActive)return false;
  if(Math.random()>=PLAYER_STD_FROM_PARTNER_CHANCE)return false;
  return infectPlayerWithStd('伴侣已患性病，你被传染');
}
function tryContractStdFromStranger(contactName){
  if(!game||game.stdActive)return false;
  if(Math.random()>=PLAYER_STD_FROM_STRANGER_CHANCE)return false;
  const who=contactName||'陌生人';
  return infectPlayerWithStd('与'+who+'亲热后感染性病');
}
function tickStdTreatmentGapCheck(){
  if(!game||!game.stdActive)return;
  const v=game.stdTreatmentVisits||0;
  if(v<=0)return;
  const last=game.stdLastTreatmentWeek;
  if(last>=0&&game.week>last+1){
    game.stdTreatmentVisits=0;
    game.stdLastTreatmentWeek=-1;
    addLog('🏥 性病治疗中断（须每周连续就诊），进度清零','warn');
  }
}
function tickStdWeekly(){
  tickStdTreatmentGapCheck();
  if(!game||!game.stdActive)return;
  game.stdWeeksInfected=(game.stdWeeksInfected||0)+1;
  if(game.stdWeeksInfected<=STD_STRESS_WEEKS)addStress(2,'性病 ');
}
function stdTreatmentStatusText(){
  if(!game||!game.stdActive)return '';
  const v=game.stdTreatmentVisits||0;
  return '治疗 '+v+'/'+STD_TREATMENT_VISITS+' 周 · 第4次付 ¥'+STD_CURE_COST+' · 须每周连续就诊';
}
function playerStdHospitalVisit(){
  if(!game||!game.stdActive){addLog('当前无需性病就诊','warn');return}
  const d=typeof ensureDailyState==='function'?ensureDailyState():null;
  if(!d){addLog('请在日常页安排就诊','fail');return}
  if(d.phase==='rest'){addLog('请先选择睡觉或进入后半夜','fail');return}
  if(typeof dailyUseMainActivity==='function'&&!dailyUseMainActivity())return;
  if(game.stdLastTreatmentWeek===game.week){
    if(typeof dailyReleaseMainActivity==='function')dailyReleaseMainActivity();
    addLog('本周已去过医院','warn');
    return;
  }
  tickStdTreatmentGapCheck();
  const next=(game.stdTreatmentVisits||0)+1;
  if(next>=STD_TREATMENT_VISITS){
    if(typeof spendCash==='function'&&!spendCash(STD_CURE_COST,'性病治愈')){
      if(typeof dailyReleaseMainActivity==='function')dailyReleaseMainActivity();
      addLog('治愈需 ¥'+STD_CURE_COST.toLocaleString()+'，现金不足','fail');
      return;
    }
    game.stdActive=false;
    game.stdTreatmentVisits=0;
    game.stdLastTreatmentWeek=-1;
    game.stdWeeksInfected=0;
    if(typeof onArtifactStdVisit==='function')onArtifactStdVisit(true);
    addLog('🏥 完成连续四周治疗，性病已治愈','success');
  }else{
    game.stdTreatmentVisits=next;
    game.stdLastTreatmentWeek=game.week;
    addLog('🏥 性病治疗第 '+next+'/'+STD_TREATMENT_VISITS+' 周（满四次付 ¥'+STD_CURE_COST+' 治愈）','info');
  }
  if(typeof dailyAdvanceAfterSlotAction==='function')dailyAdvanceAfterSlotAction();
  else if(typeof updateUI==='function')updateUI();
  else if(typeof autoSaveSlot==='function')autoSaveSlot();
}
function pregnancyWhoLabel(){
  if(!game||!game.pregnant)return '';
  if(game.pregnantSubject==='player')return '你';
  return game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
}
function resolvePregnantSubject(){
  if(!game)return null;
  if(isSameSexCouple())return null;
  if(game.playerGender==='female')return 'player';
  if(game.playerGender==='male')return 'partner';
  return null;
}
function isFemalePregnancy(){
  return resolvePregnantSubject()!=null;
}
function tryPregnancyLayoff(subject){
  if(!subject||Math.random()>=PREGNANCY_LAYOFF_CHANCE)return;
  if(subject==='player'){
    if(typeof playerEmployerOwnerImmune==='function'&&playerEmployerOwnerImmune())return;
    if(!game.employed||!game.employment)return;
    const emp=game.employment,job=game.market[emp.jobIdx];
    recordCareerHistory(emp);
    game.employed=false;game.layoffs++;game.employment=null;
    addLog('💔 怀孕后遭辞退（'+(job?job.title:'岗位')+' @'+emp.company.name+'）','fail');
    updateLongDistanceStatus();
    return;
  }
  if(subject==='partner'&&game.companion){
    const c=game.companion;
    if(typeof companionEmployerOwnerImmune==='function'&&companionEmployerOwnerImmune())return;
    if(!c.employed||!c.employment)return;
    const emp=c.employment,co=emp.company,job=game.market[emp.jobIdx];
    c.careerHistory=c.careerHistory||[];
    c.careerHistory.push({tier:emp.tier,importance:emp.importance,category:job?job.category:'',
      company:co?co.name:'',weeks:emp.weeksInCompany});
    c.employed=false;c.layoffs=(c.layoffs||0)+1;c.employment=null;
    addLog('💔 '+COMPANION_NAME+'（AI伴侣）怀孕后遭辞退 @'+(co?co.name:'公司'),'fail');
    if(c.log)c.log.unshift({date:getDateStr(game.week),msg:'怀孕后遭辞退 @'+(co?co.name:'公司'),type:'fail'});
  }
}
function ensurePregnancyStartWeek(){
  if(!game||!game.pregnant)return;
  if(game.pregnancyStartWeek!=null&&game.pregnancyStartWeek>=0)return;
  const left=game.pregnancyWeeksLeft||0;
  game.pregnancyStartWeek=Math.max(0,(game.week||0)-(PREGNANCY_WEEKS-left));
}
function pregnancyWeeksRemaining(){
  if(!game||!game.pregnant)return 0;
  ensurePregnancyStartWeek();
  return Math.max(0,(game.pregnancyStartWeek||0)+PREGNANCY_WEEKS-(game.week||0));
}
function syncPregnancyWeeksLeft(){
  if(!game)return;
  game.pregnancyWeeksLeft=game.pregnant?pregnancyWeeksRemaining():0;
}
function startPregnancy(fromAffair,forceSubject){
  if(!game||game.pregnant||game.hasChildren||game.homeless)return false;
  let subject=forceSubject||resolvePregnantSubject();
  if(forceSubject==='player'&&game.playerGender!=='female')subject=resolvePregnantSubject();
  if(!subject){
    game.pregnancyBioFather=pregnancyBioFatherFromContext(!!fromAffair,'partner');
    game.pregnancyConceivedMarried=typeof hasPrimaryPartner==='function'?hasPrimaryPartner():!!(game.married&&!game.divorced);
    initChildRecordAtBirth();
    addStress(STRESS_CHILD_BIRTH,'怀孕 ');
    addLog('👶 '+(fromAffair?'婚外情怀孕':'怀孕成功')+'！','success');
    game.procreateIntentWeek=-1;
    return true;
  }
  game.pregnant=true;
  game.pregnantSubject=subject;
  game.pregnancyStartWeek=game.week;
  game.pregnancyWeeksLeft=PREGNANCY_WEEKS;
  game.pregnancyIntimacyNet=0;
  game.pregnancyBioFather=pregnancyBioFatherFromContext(!!fromAffair,subject);
  game.pregnancyConceivedMarried=typeof hasPrimaryPartner==='function'?hasPrimaryPartner():!!(game.married&&!game.divorced);
  syncAffairState();
  addStress(STRESS_CHILD_BIRTH,'怀孕 ');
  const who=subject==='player'?'你':pregnancyWhoLabel();
  addLog('👶 '+(fromAffair?'婚外情':'')+who+'怀孕！孕期'+PREGNANCY_MONTHS+'个月，每周亲密度±1波动','success');
  tryPregnancyLayoff(subject);
  game.procreateIntentWeek=-1;
  return true;
}
function tickPregnancyWeekly(){
  if(!game||!game.pregnant)return;
  ensurePregnancyStartWeek();
  if(typeof tickOutdoorPregnancyWeekly==='function')tickOutdoorPregnancyWeekly();
  const swing=Math.random()<0.5?1:-1;
  game.pregnancyIntimacyNet=(game.pregnancyIntimacyNet||0)+swing;
  adjustSpouseIntimacy(swing,'孕期波动 ');
  syncPregnancyWeeksLeft();
  if(pregnancyWeeksRemaining()<=0)completePregnancyBirth();
}
function completePregnancyBirth(){
  if(!game)return;
  const net=game.pregnancyIntimacyNet||0;
  game.pregnant=false;
  game.pregnantSubject=null;
  game.pregnancyStartWeek=null;
  game.pregnancyWeeksLeft=0;
  game.pregnancyIntimacyNet=0;
  game.outdoorAffairPregnancy=false;
  game.partnerKnowsPlayerPregnant=false;
  initChildRecordAtBirth();
  if(net<0&&!game.divorced){
    adjustSpouseIntimacy(PREGNANCY_POSTPARTUM_INTIMACY_BONUS,'产后关怀补偿 ');
    addLog('👶 孩子降生！孕期亲密度净减 '+Math.abs(net)+'，产后整体补偿 +'+PREGNANCY_POSTPARTUM_INTIMACY_BONUS,'success');
  }else if(!game.divorced){
    addLog('👶 孩子降生！孕期亲密度净增 +'+(net||0)+'，无产后补偿','success');
  }else{
    addLog('👶 孩子降生！','success');
  }
  const cr=game.childRecord;
  if(!game.divorced){
    addLog('月生活费升至 ¥'+CHILD_LIVING_COST+'（持续18年）','info');
  }else if(cr&&cr.custody==='player'){
    addLog('月生活费升至 ¥'+CHILD_LIVING_COST+'（独自抚养，持续18年）','info');
  }else if(cr&&cr.bioFather==='other'){
    addLog('该子为婚外情受孕，你无需支付抚养费','info');
  }
}
function tryConceiveFromSex(noCondom,fromAffair){
  if(!game||game.pregnant||game.hasChildren||game.homeless)return false;
  if(!fromAffair&&isSameSexCouple())return false;
  if(!fromAffair&&((typeof hasPrimaryPartner==='function'&&!hasPrimaryPartner())||game.divorced))return false;
  let p=noCondom?PREGNANCY_CHANCE_RAW:PREGNANCY_CHANCE_SAFE;
  if(typeof menstrualConceptionChance==='function')p=menstrualConceptionChance(!!noCondom);
  else if(game.procreateIntentWeek===game.week&&noCondom)p=Math.max(p,PREGNANCY_CHANCE_PROC_CREATE);
  if(fromAffair)p=Math.max(p,AFFAIR_PREGNANCY_CHANCE||0.15);
  if(Math.random()>=p)return false;
  if(game.playerGender==='female')return startPregnancy(fromAffair,'player');
  return startPregnancy(fromAffair);
}
function runSexSession(noCondom){
  if(Math.random()<0.2){
    addStress(10,'不和谐 ');
    return {harmony:false};
  }
  addStress(-5,'做爱 ');
  if(noCondom)addStress(-10,sexSessionStressLabel(true));
  return {harmony:true};
}
function runPhoneSexSession(){
  if(Math.random()<0.2){
    addStress(5,'不和谐 ');
    return {harmony:false};
  }
  addStress(-2,'电话性爱 ');
  return {harmony:true};
}
function promptPhoneSex(){
  if(!game||game.gameOver)return;
  if(typeof hasPrimaryPartner!=='function'||!hasPrimaryPartner()){addLog('需有固定伴侣才可电话性爱','fail');return}
  const block=typeof getPhoneSexBlockReason==='function'?getPhoneSexBlockReason(true):null;
  if(block){
    if(game._dailySexPendingHours)clearDailySexReserve();
    showConsumeModal({icon:'📞',title:'无法电话性爱',html:block,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
    return;
  }
  if(typeof interceptMakeLoveForCycle==='function'&&interceptMakeLoveForCycle(1))return;
  if(sexSessionsLeft()<1){
    if(game._dailySexPendingHours)clearDailySexReserve();
    addLog('本周剩余 '+sexSessionsLeft()+' 次','fail');return;
  }
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const devil=typeof isAllnightDevilHours==='function'&&isAllnightDevilHours();
  const attr=typeof getPartnerAttraction==='function'?getPartnerAttraction():null;
  let html=(game.married&&!game.divorced
    ?('亲密度 <b>'+game.spouseIntimacy+'</b><br>')
    :('吸引 <b>'+attr+'</b><br>'))+
    '电话性爱：减压效果约为同房的一半<br>'+
    '每次约 -2 压力 · 20% 不和谐 +5<br>'+
    '<span class="fold-meta">不会怀孕 · 占 2h · 与做爱共用每周次数</span>';
  if(devil){
    const compChoice=typeof ensureCompanionEndChoicePreview==='function'?ensureCompanionEndChoicePreview():(typeof rollCompanionSleepChoice==='function'?rollCompanionSleepChoice():'sleep');
    const compLabel=typeof companionAllnightEndChoiceLabel==='function'?companionAllnightEndChoiceLabel(compChoice):(compChoice==='sleep'?'😴 第二天白天补觉':'☀ 通宵不睡');
    html+='<br><br><span style="color:var(--accent)">🌈 通宵后段 · '+pn+' 预计：<b>'+compLabel+'</b>（通宵结束后再确认）</span>';
  }
  showConsumeModal({
    icon:'📞',title:'电话性爱',
    html:html,
    buttons:[
      {text:'📞 开始',primary:true,fn:'confirmPhoneSex()'},
      {text:'取消',fn:'closeSexAndClearReserve()'}
    ]
  });
}
function confirmPhoneSex(){
  closeConsumeModal();
  if(!game||game.gameOver)return;
  const c=ensureConsumption();if(!c)return;
  if(sexSessionsLeft()<1){
    addLog('本周做爱次数不足','fail');
    if(typeof clearDailySexReserve==='function')clearDailySexReserve();
    return;
  }
  const r=runPhoneSexSession();
  c.sexSessions=(c.sexSessions||0)+1;
  tryContractStdFromPartner();
  const pendingH=game._dailySexPendingHours||0;
  if(pendingH&&typeof dailyAddHours==='function')dailyAddHours(pendingH,false);
  game._dailySexPendingHours=0;
  const pn=game.partnerDisplayName||(typeof COMPANION_NAME!=='undefined'?COMPANION_NAME:'伴侣');
  const devil=typeof isAllnightDevilHours==='function'&&isAllnightDevilHours();
  let partnerChoiceHtml='';
  if(devil){
    const compChoice=typeof ensureCompanionEndChoicePreview==='function'?ensureCompanionEndChoicePreview():(game._companionSleepChoice||'sleep');
    const compLabel=typeof companionAllnightEndChoiceLabel==='function'?companionAllnightEndChoiceLabel(compChoice):(compChoice==='sleep'?'😴 第二天白天补觉':'☀ 通宵不睡');
    partnerChoiceHtml='<br><span style="color:var(--accent)">'+pn+' 预计：<b>'+compLabel+'</b>（通宵结束后再确认）</span>';
  }
  let html=(r.harmony?'<span style="color:var(--green)">减压约 -2</span>':'<span style="color:var(--red)">不太和谐 · 压力 +5</span>')+partnerChoiceHtml;
  if(pendingH)html+='<br><span class="fold-meta">占用 '+pendingH+'h</span>';
  addLog('📞 电话性爱'+(r.harmony?'':' · 不太和谐'),'info');
  showConsumeModal({icon:'📞',title:'电话性爱',html,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
  renderSpendingPanel();updateUI();
  if(typeof renderDailyPanel==='function')renderDailyPanel();
}
function sexSessionsLeft(){
  const c=ensureConsumption();
  return SEX_WEEKLY_LIMIT-((c&&c.sexSessions)||0);
}
function masturbationSessionsLeft(){
  const c=ensureConsumption();
  return SEX_WEEKLY_LIMIT-((c&&c.masturbationSessions)||0);
}
function playerAffairExposureLevel(){
  let level=0;
  const flirt=game.flirtPeopleTotal||0;
  if(flirt>=5)level++;
  if(flirt>=25)level++;
  if(flirt>=60)level++;
  if(game.affairActive)level+=2;
  const affairs=(game.contacts||[]).filter(c=>{
    const st=c.affairStatus;
    return (c.affairCount||0)>0||(st&&st!=='none'&&st!=='ended');
  }).length;
  if(affairs)level+=Math.min(2,affairs);
  return level;
}
function procCreateCondomDiscoverChance(){
  return Math.min(0.82,0.15+playerAffairExposureLevel()*0.11);
}
function resolveProcCreateCondomBetrayal(){
  adjustSpouseIntimacy(-20,'备孕期戴套 ');
  game.procreateIntentWeek=-1;
  addStress(3,'被怀疑出轨 ');
  const chance=procCreateCondomDiscoverChance();
  let html='<span style="color:var(--red)">备孕期却戴套 · 亲密度 -20</span><br>伴侣怀疑你出轨…';
  let discovered=false;
  if(Math.random()<chance){
    discovered=true;
    if(game.affairActive){
      partnerRequestsDivorce('💔 备孕期戴套，伴侣查出婚外情，提出离婚。',{playerPaysHalf:true});
      html+='<br><b style="color:var(--red)">婚外情败露 · 离婚</b>';
    }else if((game.flirtPeopleTotal||0)>=15){
      partnerRequestsDivorce('💔 备孕期戴套，伴侣从你手机发现聊骚记录，提出离婚。',{playerPaysHalf:true});
      html+='<br><b style="color:var(--red)">聊骚记录曝光 · 离婚</b>';
    }else{
      adjustSpouseIntimacy(-10);
      addStress(8,'信任危机 ');
      html+='<br><span style="color:var(--orange)">激烈争吵 · 亲密度再-10 · 压力+8</span>';
    }
  }else{
    html+='<br><span style="color:var(--muted)">暂未抓到实锤，但疑心未消</span>';
  }
  addLog('💔 备孕期戴套 · 伴侣怀疑出轨'+(discovered?' · 事态升级':'（暂未实锤）'),'warn');
  return{html,discovered,chance};
}
function promptMakeLove(batch){
  if(!game||game.gameOver)return;
  if(typeof hasPrimaryPartner!=='function'||!hasPrimaryPartner()){addLog('需恋爱、同居或已婚才可做爱','fail');return}
  batch=Math.max(1,Math.floor(batch)||1);
  const block=typeof getMakeLoveBlockReason==='function'?getMakeLoveBlockReason(true):null;
  if(block){
    if(game._dailySexPendingHours)clearDailySexReserve();
    showConsumeModal({icon:'💔',title:'无法做爱',html:block,buttons:[{text:'知道了',primary:true,fn:'closeConsumeModal()'}]});
    return;
  }
  if(typeof interceptMakeLoveForCycle==='function'&&interceptMakeLoveForCycle(batch))return;
  if(sexSessionsLeft()<batch){
    if(game._dailySexPendingHours)clearDailySexReserve();
    addLog('本周剩余 '+sexSessionsLeft()+' 次','fail');return;
  }
  const procOn=game.procreateIntentWeek===game.week;
  const sameSex=isSameSexCouple();
  const partnerAffair=partnerHasExtramaritalAffair();
  const attr=typeof getPartnerAttraction==='function'?getPartnerAttraction():null;
  let html=(game.married&&!game.divorced
    ?('亲密度 <b>'+game.spouseIntimacy+'</b><br>')
    :('吸引 <b>'+attr+'</b> · 熟悉 <b>'+(typeof getPartnerFamiliarity==='function'?getPartnerFamiliarity():'—')+'</b><br>'))+
    sexSafeOptionLabel()+'：每次 -5 压力 · 20% 不和谐 +10<br>'+
    (sameSex
      ?(isSameSexMaleCouple()
        ?'不戴套：额外 -10 压力 · <span style="color:var(--muted)">不会怀孕</span>'
        :'玩具：额外 -10 压力 · <span style="color:var(--muted)">不会怀孕</span>')
      :'不戴套：额外 -10 压力，怀孕几率更高');
  if(partnerAffair&&game.partnerStdActive){
    html+='<br><span style="color:var(--red)">伴侣已患性病 · 亲密后 '+Math.round(PLAYER_STD_FROM_PARTNER_CHANCE*100)+'% 传染给你</span>';
  }else if(partnerAffair){
    html+='<br><span class="fold-meta">伴侣有婚外情但未患性病时，你不会被传染</span>';
  }
  if(procOn&&!sameSex){
    html+='<br><span style="color:var(--green)">🍼 本月备孕中</span>';
    html+='<br><span style="color:var(--orange)">备孕期若戴套：亲密度-20，伴侣怀疑出轨（聊骚/出轨史提高被抓概率）</span>';
  }
  if(!game.pregnant&&typeof makeLoveConceptionHintHtml==='function')html+=makeLoveConceptionHintHtml();
  if(typeof makeLovePregnancyWarningHtml==='function')html+=makeLovePregnancyWarningHtml();
  if(game.pregnant){
    html+='<br><span class="fold-meta">怀孕期间戴套表示温和同房；不戴套减压更多但有孕早期流产风险</span>';
  }
  const safeBtn=game.pregnant?'戴套（温和 · 无流产风险）':sexSafeOptionLabel();
  const riskBtn=game.pregnant?'不戴套（额外减压 · 有风险）':sexRiskOptionLabel(false);
  showConsumeModal({
    icon:'💕',title:'夫妻生活 ×'+batch,
    html:html,
    buttons:[
      {text:safeBtn,fn:'makeLoveBatch('+batch+',false)'},
      {text:riskBtn,primary:true,fn:'makeLoveBatch('+batch+',true)'},
      {text:'返回',fn:'closeSexAndClearReserve()'}
    ]
  });
}
function makeLoveBatch(batch,noCondom){
  closeConsumeModal();
  if(!game||game.gameOver)return;
  batch=Math.max(1,Math.floor(batch)||1);
  const c=ensureConsumption();if(!c)return;
  if(sexSessionsLeft()<batch){
    addLog('本周做爱次数不足','fail');
    if(game.daily){game.daily.slotSexUsed=false}
    game._dailySexPendingHours=0;
    return;
  }
  const procBetrayal=game.procreateIntentWeek===game.week&&!noCondom&&!game.pregnant;
  let conceived=false,harmony=true,miscarried=false;
  for(let i=0;i<batch;i++){
    if(!miscarried&&noCondom&&typeof rollFirstTrimesterMiscarriage==='function'&&rollFirstTrimesterMiscarriage()){
      miscarried=true;
      harmony=false;
      break;
    }
    const r=runSexSession(!!noCondom);
    if(r&&!r.harmony)harmony=false;
    c.sexSessions=(c.sexSessions||0)+1;
    tryContractStdFromPartner();
    if(!conceived&&!game.hasChildren&&!game.pregnant&&!isSameSexCouple())conceived=tryConceiveFromSex(!!noCondom,false);
  }
  const pendingH=game._dailySexPendingHours||0;
  if(pendingH&&typeof dailyAddHours==='function')dailyAddHours(pendingH,false);
  game._dailySexPendingHours=0;
  const sameSex=isSameSexCouple();
  let html=sexSafeOptionLabel()+' · 每次 -5 压力'+(harmony?'':' · <span style="color:var(--red)">不和谐 +10</span>');
  if(noCondom)html+='<br>'+sexRiskOptionLabel(true)+' · 额外减压';
  if(game.stdActive)html+='<br><span style="color:var(--red)">🦠 性病感染中 · '+stdTreatmentStatusText()+'</span>';
  if(procBetrayal&&!sameSex){
    const betray=resolveProcCreateCondomBetrayal();
    html+='<br><br>'+betray.html;
  }
  if(conceived)html+='<br><b style="color:var(--green)">怀孕！</b>';
  if(miscarried)html+='<br><b style="color:var(--red)">孕早期同房导致流产 · 亲密度 -10</b>';
  if(pendingH)html+='<br><span class="fold-meta">占用 '+pendingH+'h</span>';
  const optTag=noCondom?('（'+sexRiskOptionLabel(true)+'）'):('（'+sexSafeOptionLabel()+'）');
  addLog('💕 做爱 ×'+batch+optTag+(conceived?' · 怀孕！':''),'info');
  const afterSexFn='closeConsumeModal()';
  showConsumeModal({icon:'💕',title:'做爱',html,buttons:[{text:'知道了',primary:true,fn:afterSexFn}]});
  renderSpendingPanel();updateUI();
}
function masturbateBatch(batch){
  if(!game||game.gameOver)return;
  batch=Math.max(1,Math.floor(batch)||1);
  const c=ensureConsumption();if(!c)return;
  if(masturbationSessionsLeft()<batch){addLog('本周剩余 '+masturbationSessionsLeft()+' 次','fail');return}
  for(let i=0;i<batch;i++){
    c.masturbationSessions=(c.masturbationSessions||0)+1;
    if(Math.random()<0.1)addStress(1,'自慰尴尬 ');
    else addStress(-1,'自慰 ');
  }
  addLog('🫥 自慰 ×'+batch,'info');
  renderSpendingPanel();updateUI();
}
function setProcreateIntent(){
  if(typeof routeProcreateIntent==='function'){routeProcreateIntent();return;}
  setProcreateIntentNatural();
}
function renderIntimacyActionBtns(fn,label,forceOff){
  if(forceOff)return '<button class="btn" disabled>'+label+'</button><button class="btn" disabled>七连发</button>';
  const left=fn==='promptMakeLove'?sexSessionsLeft():masturbationSessionsLeft();
  const off=left<=0;
  return '<button class="btn" '+(off?'disabled':'')+' onclick="'+fn+'(1)">'+label+'</button>'+
    '<button class="btn" '+(left<7?'disabled':'')+' onclick="'+fn+'(7)">七连发</button>';
}
function tickMarriageWeekly(){
  if(!game||game.gameOver)return;
  syncSpouseIntimacyToCompanion();
  if(typeof tickAffairRelationships==='function')tickAffairRelationships();
  if(typeof tickContactConfessions==='function')tickContactConfessions();
  tickStdWeekly();
  if(game.pregnant)tickPregnancyWeekly();
  if(game.married&&!game.divorced){
    if(game.divorceProceedings)return;
    if(game.partnerAffairActive&&!game.partnerStdActive&&Math.random()<0.08)tryInfectPartnerWithStd();
    if(game.longDistance)adjustSpouseIntimacy(-1);
    if(game.livingOffSpouse){
      adjustSpouseIntimacy(-5);
      addStress(1,'吃软饭 ');
    }
    if((game.spouseIntimacy||0)<60&&Math.random()<0.12){
      game.companionFlirtTotal=(game.companionFlirtTotal||0)+FLIRT_CHATS_PER_SESSION;
      if(game.companion)game.companion.companionFlirtTotal=game.companionFlirtTotal;
    }
    if((game.companionFlirtTotal||0)>=100&&Math.random()<0.04){
      if(Math.random()<0.45){
        game.affairActive=true;game.affairTriggered=true;game.partnerAffairActive=true;
        tryInfectPartnerWithStd();
        addLog('💋 伴侣聊骚达100+，出轨了！月支出翻倍。','stress');
        if(Math.random()<0.25)tryConceiveFromSex(false,true);
      }else if(Math.random()<0.5){
        partnerRequestsDivorce('💔 伴侣聊骚成瘾，提出离婚。',{playerReceives:true});
      }
    }
    const flirtGrace=(game.flirtDivorceGraceUntilWeek||0)>(game.week||0);
    if(!flirtGrace&&(game.flirtPeopleTotal||0)>=100&&Math.random()<0.035){
      partnerRequestsDivorce('💔 伴侣发现你聊骚记录，提出离婚。',{playerPaysHalf:true});
    }
    if((game.spouseIntimacy||0)<=-100){
      partnerRequestsDivorce('💔 亲密度降至冰点，伴侣坚决离婚。',{playerKeepsHome:false});
    }else if((game.spouseIntimacy||0)<0&&Math.random()<0.08){
      partnerRequestsDivorce('💔 亲密度为负，伴侣提出离婚。',{playerKeepsHome:false});
    }else if(game.familyStress>50&&Math.random()<0.03){
      partnerRequestsDivorce('💔 压力太大，伴侣提出离婚。',{playerKeepsHome:false});
    }
    if(!game.pregnant&&game.week>0&&game.week%WEEKS_PER_MONTH===0){
      const since=game.week-(game.lastDateWeek||0);
      if(since>=WEEKS_PER_MONTH){
        const drop=game.longDistance?10:5;
        adjustSpouseIntimacy(-drop,'久未约会 ');
      }
    }
  }
}
function checkAffairEvent(){
  return;
}

function syncAffairState(){
  if(game.affairActive&&(game.pregnant||game.hasChildren||game.divorced||game.homeless)){
    game.affairActive=false;
    if(game.hasChildren)addLog('👶 有了孩子，婚外情告一段落。','info');
  }
}

function checkChildBirth(){
  return;
}

function tryEnterHomeless(shortfall){
  if(game.disabled&&game.onWelfare&&!game.homeless){
    game.welfareUnderpaidMonths++;
    if(game.welfareUnderpaidMonths>=2){
      game.homeless=true;
      game.onWelfare=false;
      game.employed=false;
      game.employment=null;
      addLog('🌧 伤残低保仍入不敷出，被房东赶出，开始流浪（房租免费，桥洞栖身）','fail');
      updateLongDistanceStatus();
      return true;
    }
  }
  return false;
}

function checkVictory(){
  if(game.gameOver)return;
  const goalReady=game.mortgagePaidOff&&game.ownsHome&&game.married&&!game.divorced&&!game.homeless;
  if(!goalReady)return;
  if(!game.mortgageGoalReached){
    game.mortgageGoalReached=true;
    game.gameWon=true;
    addLog('🏠 房贷已还清！人生目标达成 · 继续生活至满三十年再结算','success');
  }
}

function determineEnding(){
  if(game.endingType==='overwork')return {
    type:'overwork',title:'通宵后的清晨',
    desc:'连日通宵不眠，心脏在凌晨停止跳动。桌上还亮着未关的屏幕，咖啡杯尚有余温。'
  };
  if(game.endingType==='lifespan')return {
    type:'lifespan',title:'命数已尽',
    desc:'你走到了预期寿命的尽头。没有预兆，没有剧变——只是某一天，该来的还是来了。'
  };
  if(game.homeless)return {
    type:'bridge',title:'桥洞底的寒夜',
    desc:'流浪多年，身无分文。一个冬夜，你在桥洞下蜷缩着睡去，再也没有醒来。数日後，路人在积雪中发现冻僵的遗体。'
  };
  if(game.disabled&&!game.ownsHome&&!game.homeless)return {
    type:'corpse',title:'出租屋里的沉默',
    desc:'伤残後你独自租住在狭小的房间里。某天起邻居再没听见动静……两周後破门而入，尸体已腐烂，无人知晓你何时离去。'
  };
  if(game.mortgagePaidOff&&game.ownsHome&&game.married&&!game.divorced)return {
    type:'victory',title:'通关 · 安度晚年',
    desc:'三十年风雨，房贷终于还清。你与伴侣坐在自己的阳台上，看着城市的灯火。余生，安稳而温暖。'
  };
  if(game.hasChildren&&game.divorced&&!game.ownsHome)return {
    type:'child_beg',title:'出租屋里的父亲',
    desc:'离婚後你租住在老旧的单间里。已成年的孩子推门而入，开口便是要钱。你摸了摸空荡的口袋，沉默地转过头去。'
  };
  if(!game.ownsHome)return {
    type:'alone',title:'孤独的出租屋',
    desc:'你没有自己的房子。晚年独自守在出租屋里，电视开着，却没有人说话。窗外是别人的万家灯火。'
  };
  return {
    type:'incomplete',title:'未尽的房贷',
    desc:'三十年过去了，房贷仍未还清。你和伴侣还在奔波，晚年依然在还款的阴影下度过。'
  };
}

function processMonthlyBills(){
  if(game.week<1||game.week%WEEKS_PER_MONTH!==0||game.gameOver)return;
  ensureMonthLedger();
  if(game.monthLedger)game.monthLedger.weekEnd=game.week;
  try{
  checkAffairEvent();
  syncAffairState();
  checkChildBirth();
  const exp=getMonthlyExpenses();
  let income=0;
  if(game.onWelfare&&!game.homeless){
    income=game.disabled?2370:1310;
    game.cash+=income; game.money+=income;
    ledgerAddIncome('welfare','📋',game.disabled?'伤残低保':'低保',income);
    addLog('📋 领取'+(game.disabled?'伤残':'')+'低保 ¥'+income,'info');
  }
  if(typeof tickChildrenMonthly==='function'){
    if(tickChildrenMonthly())addLog('👦 有孩子已成年，相关月支出已调整','info');
  }else{
    const cr=ensureChildRecord();
    if(cr&&cr.monthsLeft>0){
      cr.monthsLeft--;
      syncChildRecordCompat();
      if(cr.monthsLeft===0)addLog('👦 孩子已成年，月生活费恢复 ¥5000','info');
    }else if(game.hasChildren&&game.childRaisingMonthsLeft>0){
      game.childRaisingMonthsLeft--;
      if(game.childRaisingMonthsLeft===0)addLog('👦 孩子已成年，月生活费恢复 ¥5000','info');
    }
  }
  let need=exp.total;
  if(game.cash>=need){
    ledgerRecordMandatoryExpense(exp,need);
    game.cash-=need;
    checkCashStressMilestones();
    game.monthsUnderpaid=0;
    game.welfareUnderpaidMonths=0;
    if(exp.mortgage>0&&!game.mortgagePaidOff){
      game.mortgagePaymentsMade++;
      if(game.mortgagePaymentsMade>=MORTGAGE_MONTHS){
        game.mortgagePaidOff=true;
        addLog('🏠 恭喜！30年房贷全部还清，房子真正属于你了！','success');
        checkVictory();
      }
    }
    if(game.homeless){game.homelessMonths++;if(game.homelessMonths%6===0)addLog('🌧 流浪第'+game.homelessMonths+'月，桥洞为家','warn')}
    const mortInfo=game.ownsHome&&!game.mortgagePaidOff?' · 房贷'+game.mortgagePaymentsMade+'/'+MORTGAGE_MONTHS+'月':'';
    addLog('💳 月支出 ¥'+need.toLocaleString()+'（'+exp.label+'：'+(exp.mortgage?'房贷¥'+exp.mortgage+'+':'')+'生活¥'+exp.living+'）'+mortInfo,'info');
    return;
  }
  let shortfall=need-game.cash;
  const paid=game.cash;
  game.cash=0;
  if(tryEnterHomeless(shortfall))return;
  if(game.homeless){
    if(paid>0)ledgerRecordMandatoryExpense(exp,paid);
    game.homelessMonths++;
    addStress(8,'流浪 ');
    addLog('🌧 流浪中无力维持生活（缺 ¥'+shortfall+'），在桥洞又熬过一個月','warn');
    if(game.homelessMonths>=24&&getYear(game.week)>=2050){endGame('bridge');return}
    return;
  }
  if(!game.onWelfare&&game.married&&!game.divorced){
    if(paid>0)ledgerRecordMandatoryExpense(exp,paid);
    game.cash=0;
    const spouse=game.companion;
    let fromSpouse=0;
    if(spouse){fromSpouse=Math.min(spouse.cash||0,shortfall);spouse.cash-=fromSpouse}
    game.livingOffSpouse=true;
    if(spouse)spouse.livingOffSpouse=true;
    const remain=shortfall-fromSpouse;
    if(remain<=0){
      ledgerRecordMandatoryExpense(exp,need);
      if(fromSpouse>0)ledgerAddIncome('spouse','💑','配偶资助',shortfall);
      addLog('💑 吃软饭：伴侣代付 ¥'+shortfall.toLocaleString()+'（每周亲密度-5）','stress');
      addStress(1*game.stressMultiplier,'吃软饭 ');
      game.monthsUnderpaid=0;
      return;
    }
    shortfall=remain;
  }
  const parentsAlive=typeof areParentsAlive==='function'?areParentsAlive():!game.parentsInheritanceSettled;
  if(!game.onWelfare&&parentsAlive&&(!game.married||game.divorced)){
    game.livingOffParents=true;
    game.livingOffSpouse=false;
    ledgerRecordMandatoryExpense(exp,need);
    ledgerAddIncome('parents','🏠','父母资助',shortfall);
    markLifeStressEvent('parents','开始啃老 ');
    addLog('🏠 收入不足，啃老 ¥'+shortfall.toLocaleString()+'（父母在世）','stress');
    addStress(STRESS_PARENTS_MONTHLY*game.stressMultiplier,'啃老 ');
    game.monthsUnderpaid=0;
    return;
  }
  if(paid>0)ledgerRecordMandatoryExpense(exp,paid);
  game.monthsUnderpaid++;
  addStress(10*game.stressMultiplier,'欠账 ');
  addLog('⚠ 第'+game.monthsUnderpaid+'月无力交满（缺 ¥'+shortfall.toLocaleString()+'）','warn');
  if(!game.divorced&&game.monthsUnderpaid>=6){
    game.monthsUnderpaid=0;
    const hardshipReason='💔 连续半年无力负担家庭开支，伴侣提出离婚。失去房产，租住出租屋（¥6000/月），压力翻倍。';
    partnerRequestsDivorce(hardshipReason,{playerKeepsHome:false});
  }
  if(tryEnterHomeless(shortfall))return;
  if(!parentsAlive&&!game.parentsInheritanceSettled&&typeof settleParentsInheritance==='function')settleParentsInheritance();
  if(!parentsAlive&&!game.onWelfare&&game.monthsUnderpaid>=3){
    game.onWelfare=true;
    markLifeStressEvent('welfare','领取低保 ');
    addLog('📋 父母已不在，无力维持生计，领取低保 ¥1310/月。只能从事体力劳动。','warn');
  }
  }finally{
    closeMonthPayslip();
    if(!(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating()))renderFinanceLedger();
  }
}

function checkManualInjury(){
  if(!game.employed||!game.onWelfare)return;
  const job=game.market[game.employment.jobIdx];
  if(!isManualJob(job))return;
  if(Math.random()<.008){
    game.disabled=true;
    game.employed=false;
    game.employment=null;
    markLifeStressEvent('disabled','伤残 ');
    addLog('🚑 体力劳动中受伤致残！失业并领取伤残低保 ¥2370/月','fail');
    updateLongDistanceStatus();
  }
}

function applyFamilyPressure(cat){
  if(!isCategorySalaryDeclining(cat))return;
  addStress((3+Math.floor(Math.random()*4))*game.stressMultiplier,'行业下行 ');
  if(playerStress()>20&&Math.random()<.3){
    game.familyPressureEvents++;
    const msgs=['家人嫌弃你挣得太少……','亲戚冷嘲热讽。','前妻/前夫发来嘲讽消息。','父母叹气：当初不如考公。'];
    addLog('😔 '+msgs[Math.floor(Math.random()*msgs.length)],'stress');
  }
}

function isCategorySalaryDeclining(cat){
  const h=game.categoryPriceHistory[cat];
  if(!h||h.length<4)return false;
  const r=h.slice(-4); let d=0;
  for(let i=1;i<r.length;i++)if(r[i]<r[i-1])d++;
  return d>=3;
}

function updateMacroUnemployment(){
  game.prevMacroUnemployment=game.macroUnemployment;
  const y=getYear(game.week), ai=aiMultiplier(game.week);
  game.macroUnemployment=Math.max(.028,Math.min(.18,.05+(y-2024)*.0018+(ai-.4)*.025+Math.sin(game.week/120)*.012+(Math.random()-.5)*.008));
  if(Math.random()<.005+ai*.002){game.layoffSeason=3+Math.floor(Math.random()*4);addLog('⚠ 宏观裁员潮！','warn')}
  if(game.layoffSeason>0){game.layoffSeason--;game.macroUnemployment=Math.min(.18,game.macroUnemployment+.006)}
}

function updateCategoryTrends(){
  [...new Set(RAW_DATA.map(j=>j.category))].forEach(cat=>{
    const jobs=game.market.filter(j=>j.category===cat);
    const avg=jobs.reduce((s,j)=>s+j.pay,0)/jobs.length;
    game.categoryPriceHistory[cat].push(avg);
    if(game.categoryPriceHistory[cat].length>16)game.categoryPriceHistory[cat].shift();
  });
}

function recordCareerHistory(emp){
  const job=game.market[emp.jobIdx];
  game.careerHistory.push({tier:emp.tier,importance:emp.importance,roleExtra:emp.roleExtra||null,
    category:job.category,jobTitle:job.title,company:emp.company.name,weeks:emp.weeksInCompany});
}

function confirmPlayerResign(){
  if(!game||!game.employed||game.gameOver)return;
  if(typeof playerEmployerAcquired==='function'&&playerEmployerAcquired()){addLog('已收购就职企业，无法辞职','warn');return}
  const emp=game.employment,co=emp&&emp.company,job=emp&&game.market?game.market[emp.jobIdx]:null;
  const title=job?job.title:'当前岗位';
  const coName=co?co.name:'公司';
  if(!confirm('确定从「'+title+'」@'+coName+' 辞职？\\n辞职后本周起无工资，可继续求职。'))return;
  playerVoluntaryResign();
}
function playerVoluntaryResign(){
  if(!game||!game.employed)return;
  const emp=game.employment,co=emp&&emp.company,job=emp&&game.market?game.market[emp.jobIdx]:null;
  const coName=co?co.name:'公司';
  recordCareerHistory(emp);
  game.employed=false;
  game.employment=null;
  game.switches=(game.switches||0)+1;
  game.stealthJobSearch=false;
  game.stealthSearchWeeks=0;
  if(typeof clearOpeningLayoffEvent==='function')clearOpeningLayoffEvent();
  addStress(3,'辞职 ');
  addLog('📝 主动辞职，离开 '+coName+(job?' · '+job.title:''),'info');
  if(typeof updateLongDistanceStatus==='function')updateLongDistanceStatus();
  if(typeof renderDailyPanel==='function')renderDailyPanel();
  if(typeof updateUI==='function')updateUI();
  if(typeof autoSaveSlot==='function')autoSaveSlot();
}
function hirePlayer(jobIdx,offer,viaReferral){
  const job=game.market[jobIdx];
  if(game.employed&&game.employment)recordCareerHistory(game.employment);
  const was=game.employed;
  const internWeeks=offer.roleExtra==='intern'?
    (offer.tier==='low'?10+Math.floor(Math.random()*15):offer.tier==='mid'?6+Math.floor(Math.random()*11):4+Math.floor(Math.random()*8)):0;
  game.employed=true;
  game.employment={jobIdx,company:offer.company,tier:offer.tier,importance:offer.importance,
    roleExtra:offer.roleExtra||null,annualPay:offer.annualPay,
    otProfile:offer.otProfile||legacyOvertimeProfile(offer.tier,offer.importance,offer.roleExtra,offer.company,job),
    internWeeksLeft:internWeeks,weeksInIndustry:game.industryExperience[job.category]||0,weeksInCompany:0,weeksInRole:0};
  game.successfulHires++;
  if(was)game.switches++;
  else addStress(-STRESS_HIRE_RELIEF,'从无业到入职 ');
  checkCashStressMilestones();
  const role=offer.roleExtra?IMP_LABEL[offer.importance]+'·'+ROLE_EXTRA[offer.roleExtra]:IMP_LABEL[offer.importance];
  let msg=(viaReferral?'🤝 内推入职':'✅ 入职')+'【'+job.title+'】@'+offer.company.name+
    '（'+TIER_LABEL[offer.tier]+'·'+SCALE_LABEL[offer.company.scale]+'·'+role+'）';
  addLog(msg,'success');
  if(typeof hookHirePlayerStats==='function')hookHirePlayerStats(jobIdx);
  if(typeof onPlayerEmploymentChanged==='function')onPlayerEmploymentChanged(was);
  if(typeof onPlayerResidencyHospitalHired==='function'&&game.inResidencyPhase&&game.residencyTraining&&game.residencyTraining.seeking){
    const jt=(job&&job.title)||'';
    const cn=(offer.company&&offer.company.name)||'';
    if(/医|护理|临床|规培|住院/.test(jt+cn))onPlayerResidencyHospitalHired(cn);
  }
  updateHeadhunterOption();
  updateLongDistanceStatus();
}

function stayWeek(){
  if(actionDone||!game.employed||game.casinoActive||game.marketActive)return;
  if(game.daily&&game.daily.dayIndex<7){addLog('请先在「日常」页签完成本周七天日程','warn');showTab('daily');return}
  actionDone=true;processEmployedWeek();finishWeek();
}
function waitWeek(){if(actionDone||game.employed||game.casinoActive||game.marketActive)return;addLog('观望一周…','info');actionDone=true;finishWeek()}

function processEmployedWeek(){
  if(!game.employed)return;
  if(!canPlayerWorkWeek()){
    if(game._stressMadSkipWeek!==game.week){
      game._stressMadSkipWeek=game.week;
      addLog('🌀 压力≥'+STRESS_MAD+'，精神崩溃，本周无法上班（仍可求职）','warn');
    }
    return;
  }
  const emp=game.employment, job=game.market[emp.jobIdx];
  if(isStressMindBlocked()&&!isManualJob(job)){
    if(game._stressMindSkipWeek!==game.week){
      game._stressMindSkipWeek=game.week;
      addLog('🧠 压力≥'+STRESS_MIND_BLOCK+'，无法胜任脑力劳动，本周未出勤','warn');
    }
    return;
  }
  let salary=weeklySalary(job,emp);
  if(game.headhunterDebt>0){const d=Math.min(salary,game.headhunterDebt);game.headhunterDebt-=d;salary-=d;if(d){addLog('扣猎头欠款 ¥'+d,'warn');ledgerAddExpense('debt','💼','猎头欠款',d,false)}}
  game.money+=salary; game.cash+=salary;
  ledgerAddIncome('salary','💼',job.title+'·'+emp.company.name,salary);
  checkCashStressMilestones();
  checkChildBirth();
  emp.weeksInIndustry++; emp.weeksInCompany++; emp.weeksInRole++;
  game.industryExperience[job.category]=(game.industryExperience[job.category]||0)+1;
  if(typeof bumpPlayerCareerFromWork==='function')bumpPlayerCareerFromWork(job,emp);
  applyFamilyPressure(job.category);
  const ownerImmune=typeof currentActorEmployerImmune==='function'&&currentActorEmployerImmune();
  if(!ownerImmune){
  const wp=getLayoffWaveProbability(emp);
  if(Math.random()<wp){
    const r=resolveLayoff(emp);
    if(r.laidOff){
      recordCareerHistory(emp);
      const laidOffEmp={...emp};
      game.employed=false; game.layoffs++; game.employment=null;
      if(typeof clearOpeningLayoffEvent==='function')clearOpeningLayoffEvent();
      addStress(8*game.stressMultiplier,'被裁 ');
      addLog('💔 '+r.reason+'。本周工资 ¥'+salary.toLocaleString(),'fail');
      updateLongDistanceStatus();
      triggerLayoffSeverance(laidOffEmp,r);
      return;
    }
    addLog('😰 '+r.reason,'warn');
  }
  }
  if(emp.roleExtra==='intern'&&emp.internWeeksLeft>0){
    emp.internWeeksLeft--;
    if(emp.internWeeksLeft<=0){
      let conv=emp.tier==='low'?0.28:emp.tier==='mid'?0.42:0.58;
      if(emp.importance==='low')conv*=0.88;
      const catDecl=isCategorySalaryDeclining(job.category);
      if(catDecl)conv*=0.75;
      if(Math.random()<conv){
        emp.roleExtra=null; emp.annualPay=calcAnnualPay(job,emp.tier,emp.importance);
        addLog('🎉 实习转正！年薪 ¥'+emp.annualPay.toLocaleString(),'success');
      }else if(!ownerImmune){
        recordCareerHistory(emp);
        game.employed=false; game.employment=null; game.layoffs++;
        addLog('实习期结束未获留用，离开 '+emp.company.name,'fail');
        updateLongDistanceStatus(); return;
      }else{
        addLog('🏢 收购控股保护 · 实习期结束仍留任 '+emp.company.name,'info');
      }
    }
  }
  if(!ownerImmune&&emp.roleExtra==='temp'&&Math.random()<0.09+game.macroUnemployment*2.4){
    recordCareerHistory(emp);
    game.employed=false; game.employment=null; game.layoffs++;
    addLog('💔 临时工被随时裁退 @'+emp.company.name,'fail');
    updateLongDistanceStatus(); return;
  }
  if(emp.weeksInRole>0&&emp.weeksInRole%52===0&&emp.importance!=='high'&&!emp.roleExtra&&Math.random()<.35){
    emp.importance=upgradeImp(emp.importance,1);
    emp.annualPay=calcAnnualPay(job,emp.tier,emp.importance);
    addLog('📈 晋升至'+IMP_LABEL[emp.importance]+'，年薪 ¥'+emp.annualPay.toLocaleString(),'info');
  }
  game.employedWeeks++; game.currentStreak++;
  addLog('【'+job.title+'·'+emp.company.name+'】+¥'+salary.toLocaleString(),'success');
  checkManualInjury();
}

function finishWeek(){autoSaveSlot();updateUI()}

function updateMarket(){
  const ai=aiMultiplier(game.week);
  game.market.forEach(job=>{
    job.prevPay=job.pay;
    job.prevJobs=job.jobs;
    job.prevHeatPct=job.heatPct;
    const payDrift=1+(Math.sin((game.week+job.idx*13)/65)*0.012+(Math.random()-.5)*0.018)-job.exposure*.002*ai;
    const jobsDrift=1+(Math.sin((game.week+job.idx*7)/90)*0.015+(Math.random()-.5)*0.02)-job.outlook*.0008;
    job.pay=Math.max(Math.round(job.basePay*0.88),Math.min(Math.round(job.basePay*1.12),Math.round(job.basePay*payDrift)));
    job.jobs=Math.max(Math.round(job.baseJobs*0.9),Math.min(Math.round(job.baseJobs*1.1),Math.round(job.baseJobs*jobsDrift)));
    job.heatPct=Math.round(100+job.outlook+(Math.sin((game.week+job.idx)/40)*1.5)+(Math.random()-.5)*1.2);
    job.payHistory.push(job.pay); if(job.payHistory.length>HISTORY_LEN)job.payHistory.shift();
    job.jobsHistory.push(job.jobs); if(job.jobsHistory.length>16)job.jobsHistory.shift();
  });
  updateCategoryTrends(); updateMacroUnemployment();
}

function advanceOneWeek(){
  if(game.week>=TOTAL_WEEKS){endGame('timeout');return false}
  game.week++;
  if(typeof tickResidencyTrainingWeekly==='function')tickResidencyTrainingWeekly();
  if(typeof tickCampusRecruitmentWeekly==='function')tickCampusRecruitmentWeekly();
  if(typeof checkOpeningLayoffEvent==='function')checkOpeningLayoffEvent();
  if(game.married&&!game.divorced)game.marriedWeeks++;
  checkAffairEvent();
  updateMarket();
  processApplicationPipeline();
  tickPendingHire();
  if(game.week>=TOTAL_WEEKS){endGame('timeout');return false}
  if(game.week%WEEKS_PER_MONTH===0)processMonthlyBills();
  if(!game.employed)addStress(STRESS_UNEMPLOYED_WEEKLY);
  if(game.divorced||!game.married)addStress(STRESS_SINGLE_WEEKLY);
  if(game.longDistance&&game.married&&!game.divorced)addStress(STRESS_LONG_DISTANCE_WEEKLY,'异地 ');
  tickWeeklyConsumption();
  tickMarriageWeekly();
  if(typeof tickDivorceProceedings==='function')tickDivorceProceedings();
  if(game.week%52===0)addLog('—— '+getYear(game.week)+'年 ——','warn');
  tickSpongeMedal();
  checkCashStressMilestones();
  if(typeof autoLifeRunning==='undefined'||!autoLifeRunning)tickCompanionWeek();
  if(typeof tickContactLoans==='function')tickContactLoans();
  if(typeof tickHousingRentLease==='function')tickHousingRentLease();
  if(typeof tickSpouseLoans==='function')tickSpouseLoans();
  if(typeof tickFertilityOrders==='function')tickFertilityOrders();
  if(typeof flushMenstrualCycleWeek==='function')flushMenstrualCycleWeek();
  if(typeof tickCompanyManagementWeekly==='function')tickCompanyManagementWeekly();
  else if(typeof tickCompanyRecruitment==='function')tickCompanyRecruitment();
  if(game.week%WEEKS_PER_MONTH===0&&typeof tickCompanyManagementMonthly==='function')tickCompanyManagementMonthly();
  if(typeof tickLifespanDeaths==='function')tickLifespanDeaths();
  if(typeof tickLifeExtensions==='function')tickLifeExtensions();
  if(typeof tickHobbyCircleProjects==='function')tickHobbyCircleProjects();
  if(typeof tickFluxEngine==='function')tickFluxEngine();
  if(typeof tickIdealCompanyExtensions==='function')tickIdealCompanyExtensions();
  if(typeof tickWorkplaceCircles==='function')tickWorkplaceCircles();
  if(typeof tickProjectWorkOps==='function')tickProjectWorkOps();
  if(typeof tickExtensionsBatch3==='function')tickExtensionsBatch3();
  if(typeof tickExtensionsBatch4==='function')tickExtensionsBatch4();
  if(typeof tickSelfEmployMedia==='function')tickSelfEmployMedia();
  return true;
}
function canManualWeekAdvance(){
  if(!game||game.gameOver||autoLifeRunning)return false;
  if(typeof isPlayerImprisoned==='function'&&isPlayerImprisoned())return true;
  if(actionDone)return true;
  const d=game.daily;
  return !!(d&&d.dayIndex>=7);
}
function syncTimeSkipUI(){
  if(!game)return;
  if(typeof updateHeaderStats==='function')updateHeaderStats();
  if(typeof renderHeaderProgress==='function')renderHeaderProgress();
  const logEl=document.getElementById('gameLog');
  if(logEl&&game.log)logEl.innerHTML=game.log.map(l=>'<div class="log-entry '+l.type+'"><span class="date">'+l.date+'</span> '+l.msg+'</div>').join('');
  if(typeof renderDailyPanel==='function')renderDailyPanel();
  if(typeof renderInbox==='function')renderInbox();
  if(typeof renderOffers==='function')renderOffers();
  if(typeof renderJobs==='function')renderJobs();
  if(typeof renderStocks==='function')renderStocks();
  if(typeof renderSpendingPanel==='function')renderSpendingPanel();
  if(typeof renderCompanionPanel==='function')renderCompanionPanel();
  if(typeof renderFinanceLedger==='function')renderFinanceLedger();
  if(typeof updateButtons==='function')updateButtons();
}
function nextWeek(){
  if(!canManualWeekAdvance())return;
  const imprisoned=typeof isPlayerImprisoned==='function'&&isPlayerImprisoned();
  const wasImprisoned=imprisoned;
  if(!advanceOneWeek())return;
  rollReferralChance();
  if(typeof resetWeeklyDaily==='function')resetWeeklyDaily();
  else if(game.daily&&typeof defaultDailyState==='function')game.daily=defaultDailyState();
  if(wasImprisoned){
    if(typeof isPlayerImprisoned==='function'&&isPlayerImprisoned())
      addLog('🔒 服刑中… 剩余 '+(game.imprisonedUntilWeek-game.week)+' 周','info');
    else addLog('🔓 刑满出狱，可重新安排日程','success');
  }
  actionDone=false;
  autoSaveSlot();
  syncTimeSkipUI();
}
function nextMonth(){
  if(!canManualWeekAdvance())return;
  const steps=Math.min(WEEKS_PER_MONTH,TOTAL_WEEKS-game.week);
  if(steps<=0){endGame('timeout');return}
  let advanced=0;
  for(let i=0;i<steps;i++){
    if(!advanceOneWeek())break;
    if(game.employed&&!game.gameOver)processEmployedWeek();
    advanced++;
    if(game.gameOver||consumeModalOpen)break;
  }
  if(advanced>0){
    rollReferralChance();
    if(typeof resetWeeklyDaily==='function')resetWeeklyDaily();
    else if(game.daily&&typeof defaultDailyState==='function')game.daily=defaultDailyState();
    actionDone=consumeModalOpen?true:false;
    addLog('⏭ 快进 '+advanced+' 周（约一个月）至 '+getDateStr(game.week)+(game.employed?' · 已结算各周工资':''),'info');
    autoSaveSlot();
    syncTimeSkipUI();
  }
}

function stockCommission(amt){return Math.max(.01,amt*.0002)}
function getStockCostBasis(sym){
  try{
    if(!game||!sym)return null;
    if(typeof migrateArtifacts==='function')migrateArtifacts();
    const b=game.artifactStats&&game.artifactStats.stockCostBasis&&game.artifactStats.stockCostBasis[sym];
    if(!b||!b.shares||b.shares<=0)return null;
    return {shares:b.shares,cost:b.cost,avg:b.cost/b.shares};
  }catch(e){return null}
}
function fmtStockPlPct(price,avg){
  if(!avg||avg<=0)return '';
  const pl=(price/avg-1)*100;
  const sign=pl>=0?'+':'';
  return sign+pl.toFixed(1)+'%';
}
function stockPlColor(price,avg){
  if(!avg||avg<=0)return 'var(--muted)';
  return price>=avg?'var(--red)':'var(--green)';
}

function tradeStock(sym,action,shares){
  if(!game||game.gameOver)return;
  const s=game.stocks.find(x=>x.symbol===sym); if(!s)return;
  shares=Math.floor(shares)||0; if(shares<=0)return;
  if(action==='buy'){
    if(typeof checkStockBuyAllowed==='function'){
      const chk=checkStockBuyAllowed(sym,shares);
      if(!chk.ok){addLog(chk.msg,'fail');return}
    }
    const cost=s.price*shares, comm=stockCommission(cost), total=cost+comm;
    if(game.cash<total){addLog('现金不足炒股','fail');return}
    game.cash-=total; game.stockSpent+=comm;
    ledgerAddExpense('invest','📈','股票买入',total,false);
    game.portfolio[sym]=(game.portfolio[sym]||0)+shares;
    if(typeof recordStockTrade==='function')recordStockTrade(sym,'buy',shares,total/shares);
    addLog('买入 '+s.name+' ×'+shares+' @¥'+s.price.toFixed(2)+' 成本¥'+(total/shares).toFixed(2)+'/股 佣金¥'+comm.toFixed(2),'info');
  }else{
    const held=game.portfolio[sym]||0; if(held<shares){addLog('持仓不足','fail');return}
    const rev=s.price*shares, comm=stockCommission(rev), net=rev-comm;
    game.cash+=net; game.money+=net; game.stockSpent+=comm;
    ledgerAddIncome('invest','📈','股票卖出',net);
    if(typeof recordStockTrade==='function')recordStockTrade(sym,'sell',shares,s.price);
    game.portfolio[sym]=held-shares; if(game.portfolio[sym]<=0)delete game.portfolio[sym];
    addLog('卖出 '+s.name+' ×'+shares+' 净收¥'+net.toFixed(2),'info');
  }
  autoSaveSlot();
  checkCashStressMilestones();
  renderStocks();
  document.getElementById('statCash').textContent='¥'+game.cash.toLocaleString();
  document.getElementById('statMoney').textContent='¥'+game.money.toLocaleString();
  renderHeaderProgress();
}

function stockTrendDir(s){
  if(!s||s.prevPrice==null)return 'flat';
  if(s.price>s.prevPrice)return 'up';
  if(s.price<s.prevPrice)return 'down';
  return 'flat';
}
function stockTrendTagHtml(s){
  const dir=stockTrendDir(s);
  const glyph=dir==='up'?'▲':dir==='down'?'▼':'─';
  let tip='较上周持平';
  if(s.prevPrice>0){
    const pct=(s.price/s.prevPrice-1)*100;
    tip='较上周 '+(pct>=0?'+':'')+pct.toFixed(2)+'%';
  }
  return '<span class="stock-trend-tag '+dir+'" title="'+tip+'">'+glyph+'</span>';
}
function stockPriceClass(s){return stockTrendDir(s)==='down'?'down':'up'}
function renderStocks(){
  if(!game)return;
  const listEl=document.getElementById('stockList');
  if(!listEl)return;
  if(!Array.isArray(game.stocks)||!game.stocks.length){
    listEl.innerHTML='<p style="color:var(--muted)">股票数据加载中…</p>';
    return;
  }
  if(!game.portfolio||typeof game.portfolio!=='object')game.portfolio={};
  const sorted=[...game.stocks].sort((a,b)=>{
    const ha=game.portfolio[a.symbol]||0,hb=game.portfolio[b.symbol]||0;
    if(ha>0&&hb<=0)return-1;
    if(hb>0&&ha<=0)return 1;
    return a.name.localeCompare(b.name,'zh-CN');
  });
  document.getElementById('stockList').innerHTML=sorted.map(s=>{
    const held=game.portfolio[s.symbol]||0;
    const ch=stockPriceClass(s);
    const fi=typeof getStockFloatInfo==='function'?getStockFloatInfo(s.symbol):null;
    let posTxt='';
    if(held>0){
      const basis=getStockCostBasis(s.symbol);
      posTxt=' <span class="port-qty">持仓 '+held+'</span>';
      if(basis){
        posTxt+=' <span style="color:var(--muted)">成本¥'+basis.avg.toFixed(2)+'</span>';
        posTxt+=' <span style="color:'+stockPlColor(s.price,basis.avg)+'">'+fmtStockPlPct(s.price,basis.avg)+'</span>';
      }
    }
    const coTag=s.playerCompany?' <span style="color:var(--accent);font-size:.65rem">本公司</span>':'';
    const floatLine=fi?'<br><span style="color:var(--muted);font-size:.65rem">流通 '+(typeof fmtShareCount==='function'?fmtShareCount(fi.floatShares):fi.floatShares)+' · 已持 '+(typeof fmtShareCount==='function'?fmtShareCount(fi.held):fi.held)+' · 可买 '+(typeof fmtShareCount==='function'?fmtShareCount(fi.available):fi.available)+'</span>':'';
    const maxBuy=fi?Math.max(1,fi.available):999999999;
    const buyDis=fi&&fi.available<=0?' disabled title="流通盘已满"':'';
    return '<div class="stock-row"><div style="min-width:100px"><b>'+s.name+'</b>'+coTag+' <span style="color:var(--muted)">'+s.symbol+'</span><br>'+
      '<span class="'+ch+'">¥'+s.price.toFixed(2)+'</span>'+posTxt+floatLine+'</div>'+
      '<div class="stock-chart-wrap"><canvas id="stkChart_'+s.symbol+'" height="36"></canvas>'+stockTrendTagHtml(s)+'</div>'+
      '<div><input type="number" id="sh_'+s.symbol+'" value="'+Math.min(100,maxBuy)+'" min="1" max="'+maxBuy+'" style="width:60px">'+
      '<button class="btn"'+buyDis+' onclick="tradeStock(\\''+s.symbol+'\\',\\'buy\\',+document.getElementById(\\'sh_'+s.symbol+'\\').value)">买</button>'+
      '<button class="btn" onclick="tradeStock(\\''+s.symbol+'\\',\\'sell\\',+document.getElementById(\\'sh_'+s.symbol+'\\').value)">卖</button></div></div>';
  }).join('');
  requestAnimationFrame(()=>{
    sorted.forEach(s=>{
      const c=document.getElementById('stkChart_'+s.symbol);
      if(c){const wrap=c.parentElement;const tag=wrap?wrap.querySelector('.stock-trend-tag'):null;const tagW=tag?tag.offsetWidth+6:18;const w=Math.max(80,(wrap?wrap.clientWidth:160)-tagW);drawSparkline(c,s.history,w,36,{cnStock:true,trend:stockTrendDir(s)})}
    });
  });
  let ph='',tv=0;
  Object.keys(game.portfolio).forEach(sym=>{
    const s=game.stocks.find(x=>x.symbol===sym),n=game.portfolio[sym];
    if(!s||!n)return;
    tv+=s.price*n;
    const ch=stockPriceClass(s);
    const basis=getStockCostBasis(sym);
    ph+='<div class="port-row"><b>'+s.name+'</b> <span class="port-qty">×'+n+'</span> '+
      '<span class="'+ch+'">现价 ¥'+s.price.toFixed(2)+'</span> '+
      (basis?'<span style="color:var(--muted)">成本 ¥'+basis.avg.toFixed(2)+'</span> ':'')+
      (basis?'<span style="color:'+stockPlColor(s.price,basis.avg)+'">'+fmtStockPlPct(s.price,basis.avg)+'</span> ':'')+
      '<span style="color:var(--muted)">≈¥'+(s.price*n).toFixed(0)+'</span></div>';
  });
  document.getElementById('portfolioPanel').innerHTML=ph
    ?(ph+'<div style="margin-top:4px;color:var(--text);font-weight:600">合计 ≈¥'+tv.toFixed(0)+'</div>')
    :'暂无持仓';
  const countEl=document.getElementById('portfolioFoldCount');
  const n=Object.keys(game.portfolio).filter(sym=>game.portfolio[sym]>0).length;
  if(countEl)countEl.textContent=n?(n+'只 · ≈¥'+tv.toFixed(0)):'';
  applyPortfolioFoldCollapse();
}

function rollDice(){return [1,2,3].map(()=>1+Math.floor(Math.random()*6))}

function getGamblePayout(betType,betSum,dice,amount){
  const sum=dice[0]+dice[1]+dice[2];
  const isTriple=dice[0]===dice[1]&&dice[1]===dice[2];
  if(betType==='big'){if(isTriple||sum<11)return 0; return casinoWinProfit(amount,1)}
  if(betType==='small'){if(isTriple||sum>10)return 0; return casinoWinProfit(amount,1)}
  if(betType==='triple1'){if(dice[0]===1&&dice[1]===1&&dice[2]===1)return casinoWinProfit(amount,150); return 0}
  if(betType==='triple6'){if(dice[0]===6&&dice[1]===6&&dice[2]===6)return casinoWinProfit(amount,150); return 0}
  const target=+String(betSum);
  const odds=DICE_SUM_ODDS[target];
  if(odds&&sum===target)return casinoWinProfit(amount,odds);
  return 0;
}

function emptyChipMap(){
  const m={}; CHIP_DENOMS.forEach(d=>{m[d]=0}); return m;
}
function chipMapTotal(map){
  if(!map)return 0;
  return CHIP_DENOMS.reduce((s,d)=>s+(map[d]||0)*d,0);
}
function mergeChipMaps(target,source){
  CHIP_DENOMS.forEach(d=>{target[d]=(target[d]||0)+(source[d]||0)});
}
function distributeChips(amount){
  const m=emptyChipMap(); let left=amount;
  [...CHIP_DENOMS].reverse().forEach(d=>{while(left>=d){m[d]++;left-=d}});
  return {map:m,remainder:left};
}
function fmtChipLabel(d){
  if(d>=1000000)return(d/1000000)+'M';
  if(d>=10000)return(d/10000)+'万';
  if(d>=1000)return(d/1000)+'k';
  return String(d);
}
function chipBtnHtml(denom,opts){
  const c=CHIP_COLORS[denom]||CHIP_COLORS[100];
  const cls=['casino-chip',opts.size||'',opts.selected?'selected':''].filter(Boolean).join(' ');
  let style='--chip-edge:'+c.edge+';--chip-edge-dark:'+(c.edgeDark||c.edge)+';--chip-text:'+c.text+';';
  if(opts.stacked)style+='position:absolute;bottom:'+(opts.stackOff||0)+'px;left:0;z-index:'+(opts.stackOff||0)+';';
  const click=opts.onclick?' onclick="'+opts.onclick+'"':'';
  const dbl=opts.ondblclick?' ondblclick="'+opts.ondblclick+'"':'';
  const title=opts.title||('¥'+denom.toLocaleString());
  return '<button type="button" class="'+cls+'" style="'+style+'" title="'+title+'"'+click+dbl+'>'+
    '<span class="chip-val">'+fmtChipLabel(denom)+'</span></button>';
}
function chipStackDims(size){
  if(size==='chip-zone-size')return {h:32,step:4};
  if(size==='chip-cage-size')return {h:36,step:4};
  return {h:42,step:5};
}
function renderChipStacks(map,opts){
  let html='';
  const dims=chipStackDims(opts&&opts.size);
  CHIP_DENOMS.forEach(d=>{
    const n=map[d]||0;if(!n)return;
    const click=opts&&opts.onChip?'selectChipFromHand('+d+')':'';
    const dbl=opts&&opts.onCashIn?'cashChipFromHand('+d+');event.preventDefault()':'';
    const title=opts&&opts.onChip?'¥'+d+' · 点击选中押注 · 双击换回现金':'¥'+d;
    const show=Math.min(n,opts&&opts.maxShow||8);
    const pileH=dims.h+(show-1)*dims.step;
    html+='<div class="chip-stack" style="height:'+pileH+'px;width:'+dims.h+'px">';
    for(let i=0;i<show;i++){
      html+=chipBtnHtml(d,{size:opts&&opts.size,stacked:true,stackOff:i*dims.step,
        selected:game&&game.selectedChipDenom===d,onclick:click,ondblclick:dbl,title:title});
    }
    html+='<span class="stack-count">×'+n+'</span></div>';
  });
  return html;
}
function emptySpectateAiBets(){
  return game&&game.casinoGame==='roulette'?emptyRouletteBets():emptyTableBets();
}
function pickCasinoAis(){
  const count=1+Math.floor(Math.random()*CASINO_AI_NAMES.length);
  const pool=CASINO_AI_NAMES.slice();
  for(let i=pool.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    const t=pool[i];pool[i]=pool[j];pool[j]=t;
  }
  return pool.slice(0,count);
}
function initSpectateAis(){
  const mk=()=>game.casinoGame==='roulette'?emptyRouletteBets():emptyTableBets();
  return pickCasinoAis().map(name=>({name,bets:mk()}));
}
function ensureSpectateAis(){
  if(!game.spectateAis||!game.spectateAis.length)game.spectateAis=initSpectateAis();
  return game.spectateAis;
}
function getSpectateAiNames(){
  return (game.spectateAis||[]).map(a=>a.name);
}
function aggregateSpectateAiBets(){
  const agg=emptySpectateAiBets();
  const zones=game&&game.casinoGame==='roulette'?ROULETTE_ZONES:BET_ZONES;
  (game.spectateAis||[]).forEach(ai=>{
    zones.forEach(z=>{
      if(!agg[z])agg[z]=emptyChipMap();
      mergeChipMaps(agg[z],ai.bets[z]||emptyChipMap());
    });
  });
  return agg;
}
function spectateAiBettorsOnZone(z){
  return (game.spectateAis||[]).filter(ai=>chipMapTotal(ai.bets[z])>0).map(ai=>ai.name);
}
function buildSpectateAiSettleNote(zones,resolveFn,labelFn,resultLog){
  const ais=game.spectateAis||[];
  if(!ais.length)return {aiNote:'',hasBets:false};
  let body='',totalWon=0,totalLost=0,any=false;
  ais.forEach(ai=>{
    let w=0,l=0,rows=[];
    zones.forEach(z=>{
      const v=chipMapTotal(ai.bets[z]);
      if(!v)return;
      any=true;
      const back=resolveFn(z,ai.bets[z]);
      if(back>0){w+=back;rows.push({zone:labelFn(z),bet:v,win:true,payout:back})}
      else{l+=v;rows.push({zone:labelFn(z),bet:v,win:false,payout:0})}
    });
    if(!rows.length)return;
    totalWon+=w;totalLost+=l;
    body+='<div style="margin:6px 0"><b style="color:var(--muted)">'+ai.name+'（旁观，非你的注）</b><br>';
    rows.forEach(r=>{
      body+='<span style="font-size:.72rem;text-align:left;display:block;color:var(--muted)">'+r.zone+' · 他押 ¥'+r.bet+(r.win?' · 若跟注可赢 ¥'+r.payout:' · 若跟注会输')+'</span>';
    });
    body+='</div>';
  });
  if(!any)return {aiNote:'',hasBets:false};
  let aiNote='<div style="margin-top:10px;padding-top:8px;border-top:1px dashed rgba(88,166,255,.35);font-size:.76rem;color:var(--blue)"><b>高手押注参考</b>'+body;
  aiNote+=(totalWon>0?'若跟注合计可赢 ¥'+totalWon:'若跟注合计输 ¥'+totalLost)+'</div>';
  addLog(resultLog(totalWon,totalLost),'info');
  return {aiNote,hasBets:true};
}
function activeBetTotal(){
  if(!game)return 0;
  return game.casinoGame==='roulette'?rouletteBetTotal():tableBetTotal();
}
function resetCasinoSessionHistory(){
  if(!game)return null;
  game.casinoHistory={dice:{rounds:0,zones:{}},roulette:{rounds:0,zones:{}}};
  BET_ZONES.forEach(z=>{game.casinoHistory.dice.zones[z]={hits:0}});
  ROULETTE_ZONES.forEach(z=>{game.casinoHistory.roulette.zones[z]={hits:0}});
  return game.casinoHistory;
}
function ensureCasinoHistory(){
  if(!game||!game.casinoActive)return null;
  if(!game.casinoHistory)return resetCasinoSessionHistory();
  return game.casinoHistory;
}
function clearCasinoBetProbs(){
  BET_ZONES.forEach(z=>{
    const el=document.getElementById(dicePctElId(z));
    if(el)el.textContent='';
  });
  for(let n=0;n<=36;n++){
    const el=document.getElementById('rlPct'+n);
    if(el)el.textContent='';
  }
  const rR=document.getElementById('rlPctRed'),rB=document.getElementById('rlPctBlack');
  if(rR)rR.textContent='';
  if(rB)rB.textContent='';
}
function rouletteZoneLabel(zone){
  if(zone==='red')return '红色';
  if(zone==='black')return '黑色';
  if(zone.charAt(0)==='n')return '号码 '+zone.slice(1);
  return zone;
}
function wouldDiceZoneWin(zone,dice){
  const amt=100;
  if(zone==='big'||zone==='small'||zone==='triple1'||zone==='triple6')return getGamblePayout(zone,null,dice,amt)>0;
  return getGamblePayout('sum',zone,dice,amt)>0;
}
function wouldRouletteZoneWin(zone,n){
  return getRoulettePayout(zone,n,100)>0;
}
function recordDiceHistory(dice){
  if(!game||!game.casinoActive)return;
  const h=ensureCasinoHistory();if(!h)return;
  h.dice.rounds++;
  BET_ZONES.forEach(z=>{if(wouldDiceZoneWin(z,dice))h.dice.zones[z].hits++});
  renderCasinoRefStats();
  renderDiceBetProbs();
}
function recordRouletteHistory(n){
  if(!game||!game.casinoActive)return;
  const h=ensureCasinoHistory();if(!h)return;
  h.roulette.rounds++;
  ROULETTE_ZONES.forEach(z=>{if(wouldRouletteZoneWin(z,n))h.roulette.zones[z].hits++});
  renderCasinoRefStats();
  renderRouletteBetProbs();
}
function fmtHistPct(hits,rounds){
  if(!rounds)return '—';
  return (hits/rounds*100).toFixed(1)+'%';
}
function buildProbListRows(zones,zoneData,rounds,labelFn,sortByRate){
  const rows=zones.map(z=>{
    const hits=(zoneData[z]&&zoneData[z].hits)||0;
    const pct=rounds?hits/rounds*100:0;
    return {z,label:labelFn(z),hits,pct};
  });
  if(sortByRate)rows.sort((a,b)=>b.pct-a.pct||a.label.localeCompare(b.label,'zh-CN'));
  return rows.map(r=>{
    const barW=Math.min(100,Math.round(r.pct));
    return '<div class="ref-prob-row"><span class="ref-prob-name" title="'+r.label+'">'+r.label+'</span>'+
      '<div class="ref-prob-bar"><div class="ref-prob-fill" style="width:'+barW+'%"></div></div>'+
      '<span class="ref-prob-pct">'+fmtHistPct(r.hits,rounds)+'</span></div>';
  }).join('');
}
function buildColorProbRow(label,cls,hits,rounds){
  const pct=rounds?Math.min(100,Math.round(hits/rounds*100)):0;
  return '<div class="ref-rl-color-prob '+cls+'"><span class="ref-prob-name">'+label+'</span>'+
    '<div class="ref-prob-bar"><div class="ref-prob-fill" style="width:'+pct+'%"></div></div>'+
    '<span class="ref-prob-pct">'+fmtHistPct(hits,rounds)+'</span></div>';
}
function rouletteWheelNumFont(r){
  return 'bold '+(r>100?'10':'8')+'px system-ui,sans-serif';
}
function rouletteNumHits(h,num){
  const zd=h&&h.roulette&&h.roulette.zones;
  return(zd&&zd['n'+num]&&zd['n'+num].hits)||0;
}
function buildRouletteHistStrip(h){
  const rounds=h.roulette.rounds||0;
  let maxRate=1/37;
  if(rounds){
    ROULETTE_WHEEL.forEach(num=>{
      const rate=rouletteNumHits(h,num)/rounds;
      if(rate>maxRate)maxRate=rate;
    });
  }
  return ROULETTE_WHEEL.map(num=>{
    const hits=rouletteNumHits(h,num);
    const rate=rounds?hits/rounds:0;
    const pctStr=rounds?fmtHistPct(hits,rounds):'—';
    const barH=rounds?Math.max(hits?3:0,Math.round(rate/maxRate*100)):0;
    const col=rouletteColor(num);
    const numColor=col==='red'?'#e85d6f':col==='black'?'#9aa0b0':'#3fb950';
    return '<div class="ref-rl-hist-col" title="'+num+' · 中'+hits+'次 · '+pctStr+'">'+
      '<div class="ref-rl-hist-pct">'+pctStr+'</div>'+
      '<div class="ref-rl-hist-bar-wrap"><div class="ref-rl-hist-bar-fill" style="height:'+barH+'%"></div></div>'+
      '<div class="ref-rl-hist-num" style="color:'+numColor+'">'+num+'</div></div>';
  }).join('');
}
function drawRefRouletteRing(h){
  const cv=document.getElementById('refRouletteRing');
  if(!cv||!h)return;
  const ctx=cv.getContext('2d');
  if(!ctx)return;
  const rounds=h.roulette.rounds||0;
  const W=cv.width,H=cv.height,cx=W/2,cy=H/2;
  const rCenter=28,rBar0=34,rBar1=96,rNum0=102,rNum1=124;
  const seg=2*Math.PI/ROULETTE_WHEEL.length;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#0d1117';
  ctx.fillRect(0,0,W,H);
  ROULETTE_WHEEL.forEach((num,i)=>{
    const start=-Math.PI/2+i*seg;
    const end=start+seg;
    const col=rouletteColor(num);
    ctx.beginPath();
    ctx.arc(cx,cy,rNum1,start,end);
    ctx.arc(cx,cy,rNum0,end,start,true);
    ctx.closePath();
    ctx.fillStyle=col==='red'?'#6a1a2c':col==='black'?'#22222c':'#1a5c38';
    ctx.fill();
  });
  ROULETTE_WHEEL.forEach((num,i)=>{
    const mid=-Math.PI/2+(i+0.5)*seg;
    const hits=(h.roulette.zones['n'+num]&&h.roulette.zones['n'+num].hits)||0;
    const pct=rounds?hits/rounds:0;
    const x0=cx+Math.cos(mid)*rBar0,y0=cy+Math.sin(mid)*rBar0;
    const x1=cx+Math.cos(mid)*rBar1,y1=cy+Math.sin(mid)*rBar1;
    ctx.lineCap='round';
    ctx.lineWidth=3.2;
    ctx.strokeStyle='rgba(255,255,255,.1)';
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
    if(pct>0){
      const xf=cx+Math.cos(mid)*(rBar0+(rBar1-rBar0)*pct);
      const yf=cy+Math.sin(mid)*(rBar0+(rBar1-rBar0)*pct);
      const grd=ctx.createLinearGradient(x0,y0,x1,y1);
      grd.addColorStop(0,'#58a6ff');
      grd.addColorStop(1,'#d29922');
      ctx.strokeStyle=grd;
      ctx.beginPath();
      ctx.moveTo(x0,y0);
      ctx.lineTo(xf,yf);
      ctx.stroke();
    }
    const nx=cx+Math.cos(mid)*((rNum0+rNum1)/2);
    const ny=cy+Math.sin(mid)*((rNum0+rNum1)/2);
    const numFont=rouletteWheelNumFont(112);
    ctx.fillStyle='#fff';
    ctx.font=numFont;
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(String(num),nx,ny);
    if(rounds>0){
      const tipR=rBar1+5;
      const tx=cx+Math.cos(mid)*tipR;
      const ty=cy+Math.sin(mid)*tipR;
      ctx.fillStyle='#d29922';
      ctx.font=numFont;
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText(String(hits),tx,ty);
    }
  });
  ctx.beginPath();
  ctx.arc(cx,cy,rCenter,0,Math.PI*2);
  ctx.fillStyle='rgba(10,20,14,.96)';
  ctx.fill();
  ctx.fillStyle='#d29922';
  ctx.font='bold 13px system-ui,sans-serif';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText(rounds?rounds+'局':'—',cx,cy);
}
function dicePctElId(z){
  return 'dicePct'+(DICE_PCT_ID[z]||z);
}
function renderDiceBetProbs(){
  BET_ZONES.forEach(z=>{
    const el=document.getElementById(dicePctElId(z));
    if(!el)return;
    const oddsEl=el.parentElement&&el.parentElement.querySelector('.zone-pay-odds');
    if(oddsEl)oddsEl.textContent=DICE_ODDS_NOMINAL[z]!=null?fmtCasinoOdds(DICE_ODDS_NOMINAL[z]):'';
    if(!game||!game.casinoActive){el.textContent='';return}
    const h=game.casinoHistory;
    const rounds=h&&h.dice.rounds||0;
    if(!rounds){el.textContent='';return}
    const hits=(h.dice.zones[z]&&h.dice.zones[z].hits)||0;
    el.textContent=' · '+fmtHistPct(hits,rounds);
  });
}
function renderRouletteBetProbs(){
  if(!game||!game.casinoActive){clearCasinoBetProbs();return}
  const h=game.casinoHistory;
  const rounds=h&&h.roulette.rounds||0;
  const zd=h&&h.roulette.zones;
  function setPct(id,zoneKey){
    const el=document.getElementById(id);
    if(!el)return;
    if(!rounds){el.textContent='';return}
    const hits=(zd[zoneKey]&&zd[zoneKey].hits)||0;
    el.textContent=fmtHistPct(hits,rounds);
  }
  for(let n=0;n<=36;n++)setPct('rlPct'+n,'n'+n);
  setPct('rlPctRed','red');
  setPct('rlPctBlack','black');
}
function renderDiceCasinoRefStats(el,h){
  const rounds=h.dice.rounds||0;
  let html='<h3>🎲 骰宝历史胜率</h3>';
  html+='<div class="ref-casino-sub">已开 '+rounds+' 局 · 胜率=该区命中÷总局数</div>';
  if(rounds>0){
    html+='<div class="ref-casino-block"><h4>各押注区</h4><div class="ref-prob-list">'+
      buildProbListRows(BET_ZONES,h.dice.zones,rounds,z=>DICE_ZONE_LABELS[z]||z,false)+'</div></div>';
  }else{
    html+='<div class="ref-casino-sub">开盅后将显示各押注区命中率</div>';
  }
  el.innerHTML=html;
}
function renderRouletteCasinoRefStats(el,h){
  const rounds=h.roulette.rounds||0;
  const zd=h.roulette.zones;
  let html='<h3>🎡 轮盘历史胜率</h3>';
  html+='<div class="ref-casino-sub">已开 '+rounds+' 局 · 0起顺时针展开</div>';
  html+='<div class="ref-casino-block"><h4>号码概率分布</h4>';
  html+='<div class="ref-rl-hist-strip"><div class="ref-rl-hist-grid">'+buildRouletteHistStrip(h)+'</div></div></div>';
  html+='<div class="ref-casino-block"><h4>环状命中次数</h4>';
  html+='<div class="ref-rl-ring-wrap"><canvas id="refRouletteRing" width="268" height="268"></canvas></div></div>';
  html+='<div class="ref-casino-block"><h4>红 / 黑</h4><div class="ref-rl-color-probs">'+
    buildColorProbRow('红','rl-red',(zd.red&&zd.red.hits)||0,rounds)+
    buildColorProbRow('黑','rl-black',(zd.black&&zd.black.hits)||0,rounds)+'</div></div>';
  el.innerHTML=html;
  if(rounds>0)requestAnimationFrame(()=>drawRefRouletteRing(h));
  else drawRefRouletteRing(h);
}
function renderCasinoRefStats(){
  const el=document.getElementById('refCasinoStats');
  if(!el||!game)return;
  if(!game.casinoActive){
    el.style.display='none';
    el.innerHTML='';
    return;
  }
  const h=ensureCasinoHistory();
  const totalRounds=h?(h.dice.rounds+h.roulette.rounds):0;
  el.style.display='block';
  const mode=game.casinoGame||'dice';
  if(!h||totalRounds===0){
    el.innerHTML='<h3>🎰 赌场历史胜率</h3><div class="ref-casino-sub">'+
      (mode==='roulette'?'轮盘：横向概率条 + 环状命中次数':'骰宝：各押注区概率')+' · 入场后自动记录</div>';
    if(mode==='roulette'){
      const emptyH={roulette:{rounds:0,zones:{}}};
      el.innerHTML+='<div class="ref-casino-block"><h4>号码概率分布</h4><div class="ref-rl-hist-strip"><div class="ref-rl-hist-grid">'+
        buildRouletteHistStrip(emptyH)+'</div></div></div>'+
        '<div class="ref-casino-block"><h4>环状命中次数</h4><div class="ref-rl-ring-wrap"><canvas id="refRouletteRing" width="268" height="268"></canvas></div></div>'+
        '<div class="ref-rl-color-probs">'+buildColorProbRow('红','rl-red',0,0)+buildColorProbRow('黑','rl-black',0,0)+'</div>';
      drawRefRouletteRing(emptyH);
    }
    return;
  }
  if(mode==='roulette')renderRouletteCasinoRefStats(el,h);
  else renderDiceCasinoRefStats(el,h);
}
function emptyTableBets(){
  const z={}; BET_ZONES.forEach(k=>{z[k]=emptyChipMap()}); return z;
}
function emptyRouletteBets(){
  const z={}; ROULETTE_ZONES.forEach(k=>{z[k]=emptyChipMap()}); return z;
}
function tableBetTotal(){return BET_ZONES.reduce((s,z)=>s+chipMapTotal(game.tableBets[z]),0)}
function rouletteBetTotal(){
  if(!game||!game.rouletteBets)return 0;
  return ROULETTE_ZONES.reduce((s,z)=>s+chipMapTotal(game.rouletteBets[z]),0);
}
function rouletteColor(n){
  if(n===0)return 'green';
  return ROULETTE_RED.has(n)?'red':'black';
}
function rouletteZonePileId(zone){
  if(zone==='red')return 'Rred';
  if(zone==='black')return 'Rblack';
  return 'R'+zone;
}
function buildRouletteNumGrid(){
  const grid=document.getElementById('rouletteNumGrid');
  if(!grid||grid.dataset.built)return;
  let html='';
  ROULETTE_NUM_ROWS.forEach(row=>{
    html+='<div class="rl-row">';
    row.forEach(n=>{
      const c=rouletteColor(n);
      html+='<div class="rl-num rl-'+c+'" data-rzone="n'+n+'" onclick="placeRouletteBet(\\'n'+n+'\\')"><b>'+n+'</b><div class="rl-num-pct" id="rlPct'+n+'"></div><div class="zone-chip-pile" id="pileRn'+n+'"></div></div>';
    });
    html+='</div>';
  });
  grid.innerHTML=html;
  grid.dataset.built='1';
}
function rouletteWheelGeom(canvas){
  const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2;
  const r=Math.min(w,h)/2-8;
  const pocketInner=r*0.58;
  const trackR=(r+pocketInner)/2+1;
  const outerR=r-3;
  return{cx,cy,r,pocketInner,trackR,outerR};
}
function drawRouletteBall(ctx,geom,ball){
  if(!geom||!ball)return;
  const rad=ball.angle*Math.PI/180;
  const radius=ball.radius!=null?ball.radius:geom.trackR;
  const x=geom.cx+Math.cos(rad)*radius;
  const y=geom.cy+Math.sin(rad)*radius;
  const size=ball.size!=null?ball.size:6.5;
  const spin=ball.spin||0;
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(spin);
  ctx.beginPath();
  ctx.arc(1.2,2.2,size,0,Math.PI*2);
  ctx.fillStyle='rgba(0,0,0,.38)';
  ctx.fill();
  const g=ctx.createRadialGradient(-size*.28,-size*.28,size*.08,0,0,size);
  g.addColorStop(0,'#ffffff');
  g.addColorStop(0.42,'#f2f2f2');
  g.addColorStop(1,'#a8a8a8');
  ctx.beginPath();
  ctx.arc(0,0,size,0,Math.PI*2);
  ctx.fillStyle=g;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size*.32,-size*.08,size*.17,0,Math.PI*2);
  ctx.fillStyle='rgba(0,0,0,.14)';
  ctx.fill();
  ctx.restore();
}
function drawRouletteWheel(canvas,rotDeg,ball){
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const geom=rouletteWheelGeom(canvas);
  const{cx,cy,r,pocketInner}=geom;
  const seg=360/ROULETTE_WHEEL.length;
  const bowlInner=r*0.14;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(rotDeg*Math.PI/180);
  const bowlGrad=ctx.createRadialGradient(0,0,0,0,0,pocketInner);
  bowlGrad.addColorStop(0,'#ffffff');
  bowlGrad.addColorStop(0.55,'#f4f4f0');
  bowlGrad.addColorStop(0.88,'#e8e6df');
  bowlGrad.addColorStop(1,'#d8d4c8');
  ctx.beginPath();
  ctx.arc(0,0,pocketInner,0,Math.PI*2);
  ctx.fillStyle=bowlGrad;
  ctx.fill();
  ctx.strokeStyle='rgba(180,170,150,.45)';
  ctx.lineWidth=1.5;
  ctx.stroke();
  ROULETTE_WHEEL.forEach((num,i)=>{
    const a0=(i*seg-90)*Math.PI/180;
    const a1=((i+1)*seg-90)*Math.PI/180;
    ctx.beginPath();
    ctx.arc(0,0,r,a0,a1);
    ctx.arc(0,0,pocketInner,a1,a0,true);
    ctx.closePath();
    const col=rouletteColor(num);
    ctx.fillStyle=col==='red'?'#b91c3c':col==='black'?'#14141c':'#1f7a45';
    ctx.fill();
    ctx.strokeStyle='#c9a227';
    ctx.lineWidth=1;
    ctx.stroke();
    const mid=(a0+a1)/2;
    const labelR=(r+pocketInner)/2;
    const tx=Math.cos(mid)*labelR;
    const ty=Math.sin(mid)*labelR;
    ctx.fillStyle='#fff';
    ctx.font=rouletteWheelNumFont(r);
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(String(num),tx,ty);
  });
  ctx.beginPath();
  ctx.arc(0,0,r+2,0,Math.PI*2);
  ctx.strokeStyle='#d4af37';
  ctx.lineWidth=5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0,0,pocketInner,0,Math.PI*2);
  ctx.strokeStyle='#b8962e';
  ctx.lineWidth=2.5;
  ctx.stroke();
  const spindleGrad=ctx.createRadialGradient(0,0,0,0,0,bowlInner);
  spindleGrad.addColorStop(0,'#fffef8');
  spindleGrad.addColorStop(0.5,'#f0ebe0');
  spindleGrad.addColorStop(1,'#c9a227');
  ctx.beginPath();
  ctx.arc(0,0,bowlInner,0,Math.PI*2);
  ctx.fillStyle=spindleGrad;
  ctx.fill();
  ctx.strokeStyle='#8a6d12';
  ctx.lineWidth=1.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0,0,bowlInner*0.35,0,Math.PI*2);
  ctx.fillStyle='#d4af37';
  ctx.fill();
  ctx.restore();
  if(ball!==false){
    const b=ball||{angle:-90,radius:geom.trackR,size:6.5};
    drawRouletteBall(ctx,geom,b);
  }
}
function getRoulettePayout(zone,n,amount){
  if(zone==='red')return rouletteColor(n)==='red'?casinoWinProfit(amount,1):0;
  if(zone==='black')return rouletteColor(n)==='black'?casinoWinProfit(amount,1):0;
  if(zone.charAt(0)==='n'){
    const num=+zone.slice(1);
    return n===num?casinoWinProfit(amount,35):0;
  }
  return 0;
}
function switchCasinoGame(mode){
  if(!game||!game.casinoActive||casinoRolling)return;
  if(mode===game.casinoGame)return;
  if(mode==='dice'&&rouletteBetTotal()>0){addLog('轮盘有押注，请先开转结算后再切换骰宝','warn');return}
  if(mode==='roulette'&&tableBetTotal()>0){addLog('骰宝有押注，请先开盅结算后再切换轮盘','warn');return}
  game.casinoGame=mode;
  stopSpectateLoop();
  startSpectateLoop();
  renderCasino();
  renderCasinoRefStats();
}
function stopSpectateLoop(){
  closeCasinoSettleMenu();
  spectateLoopGen++;
  spectateTimers.forEach(t=>clearTimeout(t));
  spectateTimers=[];
  cancelSpectateAuto();
  if(spectateCountdownId){clearInterval(spectateCountdownId);spectateCountdownId=null}
  if(game){game.spectateRunning=false;game.spectatePhase='idle';game.spectateManualBet=false;game.spectatePausedMs=0;game.spectatePauseKind=null}
  updateSpectateHud();
}
function scheduleSpectate(fn,ms){
  const gen=spectateLoopGen;
  const id=setTimeout(()=>{if(gen===spectateLoopGen)fn();},ms);
  spectateTimers.push(id);
}
function scheduleSpectateAuto(fn,ms,gen){
  if(spectateAutoTimer)clearTimeout(spectateAutoTimer);
  spectateAutoTimer=setTimeout(()=>{
    spectateAutoTimer=null;
    if(gen===spectateLoopGen)fn();
  },ms);
}
function cancelSpectateAuto(){
  if(spectateAutoTimer){clearTimeout(spectateAutoTimer);spectateAutoTimer=null}
}
function isBettingSpectatePhase(){
  return game&&['player_follow','player_betting'].includes(game.spectatePhase);
}
function startCasinoSettleFreeze(){
  if(!isBettingSpectatePhase()||!game.spectatePhaseEnd)return;
  casinoSettleFreezeRemain=Math.max(0,game.spectatePhaseEnd-Date.now());
  if(casinoSettleFreezeRemain<=0)return;
  cancelSpectateAuto();
  if(casinoSettleFreezeId)clearInterval(casinoSettleFreezeId);
  casinoSettleFreezeId=setInterval(()=>{
    if(!game?.casinoActive||!isBettingSpectatePhase()){stopCasinoSettleFreeze();return}
    game.spectatePhaseEnd=Date.now()+casinoSettleFreezeRemain;
    updateSpectateHud();
  },200);
}
function stopCasinoSettleFreeze(resumeAuto){
  if(casinoSettleFreezeId){clearInterval(casinoSettleFreezeId);casinoSettleFreezeId=null}
  const remain=casinoSettleFreezeRemain;
  casinoSettleFreezeRemain=0;
  if(!resumeAuto||remain<=0||!game?.spectateRunning)return;
  const gen=spectateLoopGen;
  if(game.spectatePhase==='player_follow'){
    game.spectatePhaseEnd=Date.now()+remain;
    scheduleSpectateAuto(()=>startSpectateRoll(gen),remain,gen);
    updateSpectateHud();
  }
}
function clearCasinoSettleAutoClose(){
  if(casinoSettleAutoCloseTimer){clearTimeout(casinoSettleAutoCloseTimer);casinoSettleAutoCloseTimer=null}
}
function showCasinoSettleMenu(opts){
  opts=opts||{};
  const el=document.getElementById('casinoSettleOverlay');
  if(!el)return;
  clearCasinoSettleAutoClose();
  document.getElementById('casinoSettleIcon').textContent=opts.icon||'🎲';
  document.getElementById('casinoSettleTitle').textContent=opts.title||'结算';
  document.getElementById('casinoSettleMsg').innerHTML=opts.html||'';
  const autoClose=!!opts.autoClose;
  if(autoClose)stopCasinoSettleFreeze();
  else startCasinoSettleFreeze();
  const hintEl=document.getElementById('casinoSettleHint');
  if(hintEl){
    let hint;
    if(autoClose)hint=opts.hint||('未押注 · '+(CASINO_SETTLE_AUTO_MS/1000)+'秒后自动关闭');
    else{
      hint=opts.hint||'点击关闭或按背景关闭 · 结算展示不占用押注倒计时';
      if(isBettingSpectatePhase()&&casinoSettleFreezeRemain>0)hint='押注倒计时已暂停 · '+hint;
    }
    hintEl.textContent=hint;
  }
  el.classList.remove('hidden');
  if(autoClose)casinoSettleAutoCloseTimer=setTimeout(()=>closeCasinoSettleMenu(),opts.autoCloseMs||CASINO_SETTLE_AUTO_MS);
}
function closeCasinoSettleMenu(){
  clearCasinoSettleAutoClose();
  const el=document.getElementById('casinoSettleOverlay');
  if(el)el.classList.add('hidden');
  stopCasinoSettleFreeze(true);
}
function enterSpectateManualBet(){
  if(!game?.spectateRunning||game.spectatePhase==='rolling'||casinoRolling)return;
  if(game.spectatePhase==='player_follow'&&game.spectatePhaseEnd>Date.now()&&!game.spectateManualBet){
    game.spectatePausedMs=Math.max(0,game.spectatePhaseEnd-Date.now());
    game.spectatePauseKind='follow';
  }else if(game.spectatePhase==='rest'&&game.spectatePhaseEnd>Date.now()&&!game.spectateManualBet){
    game.spectatePausedMs=Math.max(0,game.spectatePhaseEnd-Date.now());
    game.spectatePauseKind='rest';
  }
  cancelSpectateAuto();
  game.spectateManualBet=true;
  setSpectatePhase('player_betting',0);
}
function resumeSpectateTimedFlow(){
  if(!game?.spectateRunning||activeBetTotal()>0||game.spectatePausedMs<=0)return;
  const gen=spectateLoopGen;
  const wait=Math.max(CASINO_RESUME_MIN_MS,game.spectatePausedMs);
  game.spectatePausedMs=0;
  game.spectateManualBet=false;
  if(game.spectatePauseKind==='rest'){
    setSpectatePhase('rest',wait/1000);
    scheduleSpectateAuto(()=>runSpectateRound(gen),wait,gen);
  }else{
    setSpectatePhase('player_follow',wait/1000);
    scheduleSpectateAuto(()=>startSpectateRoll(gen),wait,gen);
  }
  game.spectatePauseKind=null;
}
function setSpectatePhase(phase,seconds){
  if(!game)return;
  game.spectatePhase=phase;
  game.spectatePhaseEnd=seconds>0?Date.now()+seconds*1000:0;
  updateSpectateHud();
  if(spectateCountdownId)clearInterval(spectateCountdownId);
  if(seconds>0){
    spectateCountdownId=setInterval(()=>{
      if(!game?.casinoActive||!game.spectateRunning){clearInterval(spectateCountdownId);spectateCountdownId=null;return}
      updateSpectateHud();
    },200);
  }
}
function spectateSecondsLeft(){
  if(!game?.spectatePhaseEnd)return 0;
  return Math.max(0,Math.ceil((game.spectatePhaseEnd-Date.now())/1000));
}
function updateCasinoActionButtons(){
  const rollBtn=document.getElementById('btnRollDice');
  const spinBtn=document.getElementById('btnSpinRoulette');
  if(!game)return;
  if(rollBtn){
    const onTable=tableBetTotal();
    const manual=!!(game.spectateManualBet||onTable>0);
    if(game.casinoActive&&game.casinoGame==='dice'&&game.spectateRunning){
      if(manual&&onTable>0){rollBtn.textContent='下注完成';rollBtn.disabled=casinoRolling}
      else{rollBtn.textContent='开盅';rollBtn.disabled=true}
    }else if(game.casinoActive&&game.casinoGame==='dice'){
      rollBtn.textContent='开盅';rollBtn.disabled=casinoRolling;
    }else{rollBtn.textContent='开盅';rollBtn.disabled=true}
  }
  if(spinBtn){
    const onTable=rouletteBetTotal();
    const manual=!!(game.spectateManualBet||onTable>0);
    if(game.casinoActive&&game.casinoGame==='roulette'&&game.spectateRunning){
      if(manual&&onTable>0){spinBtn.textContent='下注完成';spinBtn.disabled=casinoRolling}
      else{spinBtn.textContent='开转';spinBtn.disabled=true}
    }else if(game.casinoActive&&game.casinoGame==='roulette'){
      spinBtn.textContent='开转';spinBtn.disabled=casinoRolling;
    }else{spinBtn.textContent='开转';spinBtn.disabled=true}
  }
}
function updateSpectateHud(){
  const hud=document.getElementById('spectateHud');
  const txt=document.getElementById('spectatePhaseText');
  const btn=document.getElementById('btnFollowAi');
  const isRoulette=game&&game.casinoGame==='roulette';
  const show=game&&game.casinoActive&&game.spectateRunning&&(game.casinoGame==='dice'||game.casinoGame==='roulette');
  if(hud)hud.style.display=show?'flex':'none';
  if(!txt||!game)return;
  const s=spectateSecondsLeft();
  const rollLbl=isRoulette?'开转':'开盅';
  const aiNames=getSpectateAiNames().join('、');
  const aiBetLbl=aiNames?'🤖 '+aiNames+' 押注中':'🤖 高手押注中';
  const labels={
    ai_bet:aiBetLbl,player_follow:'👤 跟注窗口',player_betting:'✋ 自行下注',
    rolling:isRoulette?'🎡 开转中':'🎲 开盅中',rest:'👀 观察休息',idle:'围观待机'
  };
  const base=labels[game.spectatePhase]||'围观';
  const settleOpen=document.getElementById('casinoSettleOverlay')&&!document.getElementById('casinoSettleOverlay').classList.contains('hidden');
  txt.innerHTML=base+(s>0&&!game.spectateManualBet?' · 剩余 <b>'+s+'</b>s':'')+
    (settleOpen&&isBettingSpectatePhase()?' · <span style="color:var(--green)">结算菜单中·押注计时暂停</span>':'')+
    (game.spectatePhase==='ai_bet'?'（不计动画）':
      game.spectatePhase==='player_follow'?(aiNames?' · 可跟注 '+aiNames+' · 未下注将按时'+rollLbl:' · 可复制高手押注 · 未下注将按时'+rollLbl):
      game.spectatePhase==='player_betting'?' · 完成后点「下注完成」':'');
  if(btn){
    btn.disabled=game.spectatePhase!=='player_follow'||casinoRolling||!!game.spectateManualBet;
    btn.textContent=game.spectatePhase==='player_follow'&&!game.spectateManualBet?'跟注高手（'+s+'s）':'跟注高手';
  }
  updateCasinoActionButtons();
}
function placeRandomAiRouletteBet(ai){
  const bets=ai.bets;
  const r=Math.random();
  let z;
  if(r<0.35)z='red';
  else if(r<0.7)z='black';
  else z='n'+Math.floor(Math.random()*37);
  if(!bets[z])bets[z]=emptyChipMap();
  const pool=[10,20,50,100,200,500].filter(d=>d<=500);
  const d=pool[Math.floor(Math.random()*pool.length)];
  bets[z][d]=(bets[z][d]||0)+1;
}
function placeRandomAiBet(){
  const ais=ensureSpectateAis();
  if(!ais.length)return;
  const ai=ais[Math.floor(Math.random()*ais.length)];
  if(game.casinoGame==='roulette')return placeRandomAiRouletteBet(ai);
  const bets=ai.bets;
  const z=BET_ZONES[Math.floor(Math.random()*BET_ZONES.length)];
  const pool=[10,20,50,100,200,500].filter(d=>d<=500);
  const d=pool[Math.floor(Math.random()*pool.length)];
  bets[z][d]=(bets[z][d]||0)+1;
}
function aiPlaceBetsOverTime(gen,step,totalSteps){
  if(gen!==spectateLoopGen||!game?.casinoActive||!game.spectateRunning)return;
  if(step<totalSteps){
    placeRandomAiBet();
    renderCasino();
    scheduleSpectate(()=>aiPlaceBetsOverTime(gen,step+1,totalSteps),SPECTATE_AI_MS/totalSteps);
    return;
  }
  scheduleSpectate(()=>startPlayerFollowPhase(gen),0);
}
function startPlayerFollowPhase(gen){
  if(gen!==spectateLoopGen||!game?.casinoActive)return;
  closeCasinoSettleMenu();
  if(game.spectateManualBet||activeBetTotal()>0){
    enterSpectateManualBet();
    return;
  }
  setSpectatePhase('player_follow',SPECTATE_FOLLOW_MS/1000);
  scheduleSpectateAuto(()=>startSpectateRoll(gen),SPECTATE_FOLLOW_MS,gen);
}
function startSpectateRoll(gen){
  if(gen!==spectateLoopGen||!game?.casinoActive||casinoRolling)return;
  if(game.spectateManualBet&&activeBetTotal()<=0)return;
  game.spectateManualBet=false;
  game.spectatePausedMs=0;
  game.spectatePauseKind=null;
  cancelSpectateAuto();
  setSpectatePhase('rolling',0);
  if(game.casinoGame==='roulette'){
    const winNum=Math.floor(Math.random()*37);
    animateRouletteSpin(winNum,()=>{
      if(gen!==spectateLoopGen)return;
      settleSpectateRouletteSpin(winNum);
      setSpectatePhase('rest',SPECTATE_REST_MS/1000);
      scheduleSpectateAuto(()=>runSpectateRound(gen),SPECTATE_REST_MS,gen);
    });
    return;
  }
  const dice=rollDice();
  animateDiceRoll(dice,()=>{
    if(gen!==spectateLoopGen)return;
    settleSpectateRoll(dice);
    setSpectatePhase('rest',SPECTATE_REST_MS/1000);
    scheduleSpectateAuto(()=>runSpectateRound(gen),SPECTATE_REST_MS,gen);
  });
}
function runSpectateRound(gen){
  if(gen!==spectateLoopGen||!game?.casinoActive)return;
  if(game.casinoGame!=='dice'&&game.casinoGame!=='roulette')return;
  closeCasinoSettleMenu();
  game.spectateAis=initSpectateAis();
  game.spectateManualBet=false;
  game.spectatePausedMs=0;
  game.spectatePauseKind=null;
  setSpectatePhase('ai_bet',SPECTATE_AI_MS/1000);
  addLog('🎰 本局入座：'+getSpectateAiNames().join('、'),'info');
  renderCasino();
  aiPlaceBetsOverTime(gen,0,8);
}
function startSpectateLoop(){
  if(!game||!game.casinoActive)return;
  if(game.casinoGame!=='dice'&&game.casinoGame!=='roulette')return;
  stopSpectateLoop();
  game.spectateRunning=true;
  spectateLoopGen++;
  const gen=spectateLoopGen;
  const label=game.casinoGame==='roulette'?'轮盘':'骰宝';
  addLog('👀 '+label+' 高手局：每局 1–5 人随机入座 · 未下注按时开奖','info');
  runSpectateRound(gen);
}
function followAiBets(){
  if(!game||game.spectatePhase!=='player_follow'){addLog('仅在 '+(SPECTATE_FOLLOW_MS/1000)+'s 跟注窗口可复制高手押注','warn');return}
  let copied=0;
  const bets=aggregateSpectateAiBets();
  const aiNames=getSpectateAiNames().join('、');
  if(game.casinoGame==='roulette'){
    ROULETTE_ZONES.forEach(z=>{
      const aiMap=bets[z];
      if(!aiMap)return;
      if(!game.rouletteBets[z])game.rouletteBets[z]=emptyChipMap();
      CHIP_DENOMS.forEach(d=>{
        const need=aiMap[d]||0;
        for(let i=0;i<need;i++){
          if(game.chipHand[d]>0){
            game.chipHand[d]--;
            game.rouletteBets[z][d]=(game.rouletteBets[z][d]||0)+1;
            copied++;
          }
        }
      });
    });
  }else{
    BET_ZONES.forEach(z=>{
      const aiMap=bets[z];
      if(!aiMap)return;
      CHIP_DENOMS.forEach(d=>{
        const need=aiMap[d]||0;
        for(let i=0;i<need;i++){
          if(game.chipHand[d]>0){
            game.chipHand[d]--;
            game.tableBets[z][d]=(game.tableBets[z][d]||0)+1;
            copied++;
          }
        }
      });
    });
  }
  if(copied){
    addLog('已跟注 '+aiNames+'（'+copied+' 枚筹码）','info');
    enterSpectateManualBet();
  }else addLog('手中筹码不足，无法跟注','fail');
  renderCasino();
}
function renderSpectateAiPiles(){
  if(!game||!game.spectateAis||!game.spectateAis.length)return;
  const agg=aggregateSpectateAiBets();
  function paintPiles(selector,zoneList,attr){
    document.querySelectorAll(selector).forEach(box=>{
      const z=box.getAttribute(attr);
      if(!zoneList.includes(z))return;
      let aiPile=box.querySelector('.ai-pile');
      if(!aiPile){
        aiPile=document.createElement('div');
        aiPile.className='zone-chip-pile ai-pile';
        box.appendChild(aiPile);
      }
      const aiMap=agg[z]||emptyChipMap();
      const has=chipMapTotal(aiMap)>0;
      const bettors=spectateAiBettorsOnZone(z);
      if(has)aiPile.setAttribute('data-ai-label',bettors.join('·'));
      else aiPile.removeAttribute('data-ai-label');
      aiPile.innerHTML=has?renderChipStacks(aiMap,{size:'chip-zone-size',maxShow:5}):'';
      box.classList.toggle('ai-target',has&&game.spectatePhase==='player_follow');
    });
  }
  if(game.casinoGame==='roulette')paintPiles('[data-rzone]',ROULETTE_ZONES,'data-rzone');
  else paintPiles('[data-zone]',BET_ZONES,'data-zone');
}
function settleSpectateRouletteSpin(n){
  const col=rouletteColor(n);
  const colLbl=col==='red'?'红':col==='black'?'黑':'绿';
  const {aiNote}=buildSpectateAiSettleNote(ROULETTE_ZONES,(z,m)=>resolveRouletteZonePayout(z,m,n),rouletteZoneLabel,(w,l)=>
    '高手参考：轮盘开出 '+n+'（'+colLbl+'）· '+(w>0?'若跟注可赢 ¥'+w:'跟注将输 ¥'+l));
  settleRouletteSpin(n,{aiNote});
  game.spectateAis=null;
  renderCasino();
}
function settleSpectateRoll(dice){
  const sum=dice[0]+dice[1]+dice[2];
  const {aiNote}=buildSpectateAiSettleNote(BET_ZONES,(z,m)=>resolveZonePayout(z,m,dice),z=>DICE_ZONE_LABELS[z]||z,(w,l)=>
    '高手参考：开盅 '+dice.join('+')+'='+sum+' · '+(w>0?'若跟注可赢 ¥'+w:'跟注将输 ¥'+l));
  settleCasinoRoll(dice,{aiNote});
  game.spectateAis=null;
  renderCasino();
}
function placeRouletteBet(zone){
  if(!game||!game.casinoActive||casinoRolling||game.casinoGame!=='roulette')return;
  const d=game.selectedChipDenom;
  if(!d){addLog('请先从手中点选一枚筹码','warn');return}
  if(!game.chipHand[d]){addLog('手中没有 ¥'+d+' 筹码','fail');return}
  if(!game.rouletteBets[zone])game.rouletteBets[zone]=emptyChipMap();
  game.chipHand[d]--;
  if(!game.chipHand[d]&&game.selectedChipDenom===d)game.selectedChipDenom=null;
  game.rouletteBets[zone][d]=(game.rouletteBets[zone][d]||0)+1;
  if(game.spectateRunning&&rouletteBetTotal()>0)enterSpectateManualBet();
  renderCasino();
}
function clearRouletteBets(){
  if(!game||!game.casinoActive||casinoRolling)return;
  ROULETTE_ZONES.forEach(z=>{mergeChipMaps(game.chipHand,game.rouletteBets[z]);game.rouletteBets[z]=emptyChipMap()});
  if(game.spectateRunning&&game.spectateManualBet){
    game.spectateManualBet=false;
    if(game.spectatePausedMs>0)resumeSpectateTimedFlow();
  }
  renderCasino();
}
function resolveRouletteZonePayout(zone,chipMap,n){
  const chips=chipMapTotal(chipMap);
  if(!chips)return 0;
  let profit=getRoulettePayout(zone,n,chips);
  if(!profit&&game.wolfAchievement&&Math.random()<0.12)profit=chips;
  return profit>0?Math.floor(chips+profit):0;
}
function settleRouletteSpin(n,opts){
  opts=opts||{};
  let won=0,lost=0,rows=[];
  ROULETTE_ZONES.forEach(z=>{
    const map=game.rouletteBets[z];
    const zoneVal=chipMapTotal(map);
    if(!zoneVal)return;
    const back=resolveRouletteZonePayout(z,map,n);
    if(back>0){won+=back;rows.push({zone:rouletteZoneLabel(z),bet:zoneVal,win:true,payout:back});mergeChipMaps(game.chipHand,distributeChips(back).map)}
    else{lost+=zoneVal;rows.push({zone:rouletteZoneLabel(z),bet:zoneVal,win:false,payout:0})}
    game.rouletteBets[z]=emptyChipMap();
  });
  const col=rouletteColor(n);
  const colLbl=col==='red'?'红':col==='black'?'黑':'绿';
  const rr=document.getElementById('rouletteResult');
  recordRouletteHistory(n);
  const payoutNote=won>0?'赢得筹码 ¥'+won.toLocaleString():lost>0?'输掉筹码 ¥'+lost.toLocaleString():'';
  if(rr)rr.innerHTML='<div class="dice-sum">'+n+'</div>'+
    '<div class="dice-sum-note">'+colLbl+'</div>'+
    (payoutNote?'<div class="dice-sum-note">'+payoutNote+'</div>':'');
  if(won>0)addLog('轮盘开出 '+n+'（'+colLbl+'）赢得筹码 ¥'+won.toLocaleString(),'success');
  else if(lost>0){addLog('轮盘开出 '+n+'（'+colLbl+'）输掉筹码 ¥'+lost.toLocaleString(),'fail');addStress(4)}
  else addLog('轮盘开出 '+n+'（'+colLbl+'）','info');
  let html='<div class="settle-sum dice-result-only">'+n+'</div><div style="text-align:center;color:var(--yellow);font-size:.76rem;margin-bottom:6px">'+colLbl+'</div>';
  if(rows.length){
    html+='<div style="font-size:.72rem;color:var(--muted);margin:8px 0 4px">你的押注</div>';
    html+=buildCasinoSettleRows(rows);
    if(won>0||lost>0){
      html+='<div class="casino-settle-total">'+(won>0?'赢得筹码 ¥'+won.toLocaleString():'')+(won>0&&lost>0?' · ':'')+(lost>0?'输掉筹码 ¥'+lost.toLocaleString():'')+'</div>';
    }
    if(opts.aiNote)html+=opts.aiNote;
    showCasinoSettleMenu({icon:'🎡',title:'轮盘结算',html,hint:'点击关闭继续 · 休息阶段可慢慢看'});
  }else{
    if(opts.aiNote)html+=opts.aiNote;
    showCasinoSettleMenu({icon:'🎡',title:'轮盘开奖',html,autoClose:true});
  }
  renderCasino();
}
function animateRouletteSpin(winNum,onDone){
  const idx=ROULETTE_WHEEL.indexOf(winNum);
  const seg=360/ROULETTE_WHEEL.length;
  const target=-(idx*seg+seg/2)-360*(5+Math.floor(Math.random()*3));
  const start=game.rouletteWheelRot||0;
  casinoRolling=true;
  updateCasinoActionButtons();
  const t0=performance.now();
  const duration=4000;
  const rollEnd=0.64;
  const ballRevolutions=8+Math.random()*3;
  const canvas=document.getElementById('rouletteWheel');
  const geom=canvas?rouletteWheelGeom(canvas):null;
  function frame(t){
    const p=Math.min(1,(t-t0)/duration);
    const ease=1-Math.pow(1-p,3);
    const cur=start+(target-start)*ease;
    let ballState=null;
    if(geom){
      if(p<rollEnd){
        const rp=p/rollEnd;
        const rollE=1-Math.pow(1-rp,1.55);
        ballState={
          angle:-90+ballRevolutions*360*rollE,
          radius:geom.outerR,
          spin:rollE*ballRevolutions*Math.PI*5,
          size:6.8
        };
      }else{
        const fp=(p-rollEnd)/(1-rollEnd);
        const fallE=1-Math.pow(1-fp,2.85);
        const rollStop=-90+ballRevolutions*360;
        let radius=geom.outerR+(geom.trackR-geom.outerR)*fallE;
        if(fp>0.72)radius+=Math.sin((fp-0.72)/0.28*Math.PI*5)*1.4*(1-fp)/0.28;
        ballState={
          angle:rollStop+(-90-rollStop)*fallE,
          radius,
          spin:ballRevolutions*Math.PI*5*(1-fp*0.65),
          size:6.5-Math.sin(fp*Math.PI)*0.35
        };
      }
    }
    game.rouletteWheelRot=cur;
    drawRouletteWheel(canvas,cur,ballState);
    if(p<1)requestAnimationFrame(frame);
    else{
      casinoRolling=false;
      updateCasinoActionButtons();
      if(onDone)onDone();
    }
  }
  try{requestAnimationFrame(frame)}
  catch(e){
    console.error('roulette spin',e);
    casinoRolling=false;
    updateCasinoActionButtons();
  }
}
function spinRoulette(){
  if(!game||!game.casinoActive||casinoRolling||game.casinoGame!=='roulette')return;
  const total=rouletteBetTotal();
  if(game.spectateRunning){
    if(total<=0){addLog('未下注将按时自动开转，请先押筹码','warn');return}
    startSpectateRoll(spectateLoopGen);
    return;
  }
  if(total<=0){addLog('请先把筹码押入轮盘','warn');return}
  const winNum=Math.floor(Math.random()*37);
  animateRouletteSpin(winNum,()=>settleRouletteSpin(winNum));
}

function initDiceFaces(){
  [1,2,3].forEach(i=>{
    const el=document.getElementById('die'+i);
    if(el)setDieFace(el,1);
  });
}
function setDieFace(el,value){
  if(!el)return;
  el.dataset.face=value;
  let html='';
  for(let i=0;i<9;i++){
    const on=DIE_PIP_POS[value]&&DIE_PIP_POS[value].includes(i);
    html+='<span class="pip'+(on?'':' hide')+'"></span>';
  }
  el.innerHTML=html;
}
function animateDiceRoll(finalDice,onDone){
  const els=[1,2,3].map(i=>document.getElementById('die'+i)).filter(Boolean);
  if(!els.length){onDone();return}
  casinoRolling=true;
  els.forEach(el=>el.classList.add('rolling'));
  updateCasinoActionButtons();
  let ticks=0;
  const timer=setInterval(()=>{
    els.forEach(el=>setDieFace(el,1+Math.floor(Math.random()*6)));
    ticks++;
    if(ticks>=28){
      clearInterval(timer);
      els.forEach(el=>el.classList.remove('rolling'));
      finalDice.forEach((v,i)=>{if(els[i])setDieFace(els[i],v)});
      casinoRolling=false;
      updateSpectateHud();
      onDone();
    }
  },75);
}

function renderCasino(){
  if(!game)return;
  if(game.tableBets)BET_ZONES.forEach(z=>{if(!game.tableBets[z])game.tableBets[z]=emptyChipMap()});
  if(!game.rouletteBets)game.rouletteBets=emptyRouletteBets();
  else ROULETTE_ZONES.forEach(z=>{if(!game.rouletteBets[z])game.rouletteBets[z]=emptyChipMap()});
  if(!game.casinoGame)game.casinoGame='dice';
  const lobby=document.getElementById('casinoLobby'), floor=document.getElementById('casinoFloor');
  if(lobby)lobby.style.display=game.casinoActive?'none':'block';
  if(floor)floor.style.display=game.casinoActive?'block':'none';
  const diceGame=document.getElementById('casinoDiceGame');
  const rouletteGame=document.getElementById('casinoRouletteGame');
  const isDice=game.casinoGame!=='roulette';
  if(diceGame)diceGame.style.display=isDice?'block':'none';
  if(rouletteGame)rouletteGame.style.display=isDice?'none':'block';
  const btnD=document.getElementById('btnCasinoDice'),btnR=document.getElementById('btnCasinoRoulette');
  if(btnD)btnD.classList.toggle('active',isDice);
  if(btnR)btnR.classList.toggle('active',!isDice);
  const cashEl=document.getElementById('casinoCash');
  if(cashEl)cashEl.textContent='¥'+game.cash.toLocaleString();
  const handTotal=chipMapTotal(game.chipHand);
  const htEl=document.getElementById('casinoHandTotal');
  if(htEl)htEl.textContent='¥'+handTotal.toLocaleString();
  const hint=document.getElementById('selectedChipHint');
  if(hint)hint.textContent=game.selectedChipDenom?'已选 ¥'+game.selectedChipDenom.toLocaleString()+' · 点击赌区押注':'未选中筹码';
  const rack=document.getElementById('cageRack');
  if(rack){
    rack.innerHTML=CHIP_DENOMS.map(d=>chipBtnHtml(d,{size:'chip-cage-size',onclick:'buyChipAtCage('+d+')'})).join('');
  }
  const hand=document.getElementById('chipHand');
  if(hand){
    const stacks=renderChipStacks(game.chipHand,{size:'',onChip:true,onCashIn:true,maxShow:5});
    hand.innerHTML=stacks||'<div class="chip-hand-empty">暂无筹码 · 请在柜台兑换</div>';
  }
  BET_ZONES.forEach(z=>{
    const pileId='pile'+(BET_ZONE_PILE_ID[z]||z);
    const pile=document.getElementById(pileId);
    const map=game.tableBets[z]||emptyChipMap();
    if(pile)pile.innerHTML=renderChipStacks(map,{size:'chip-zone-size',maxShow:8})||'';
    const box=document.querySelector('[data-zone="'+z+'"]');
    if(box)box.classList.toggle('has-bet',chipMapTotal(map)>0);
  });
  applyCasinoOddsLabels();
  if(game.casinoActive){
    renderDiceBetProbs();
    buildRouletteNumGrid();
    ROULETTE_ZONES.forEach(z=>{
      const pile=document.getElementById('pile'+rouletteZonePileId(z));
      const map=game.rouletteBets[z]||emptyChipMap();
      if(pile)pile.innerHTML=renderChipStacks(map,{size:'chip-zone-size',maxShow:z.charAt(0)==='n'?3:6})||'';
      const box=document.querySelector('[data-rzone="'+z+'"]');
      if(box)box.classList.toggle('has-bet',chipMapTotal(map)>0);
    });
    const rw=document.getElementById('rouletteWheel');
    if(rw&&!isDice)drawRouletteWheel(rw,game.rouletteWheelRot||0);
    renderRouletteBetProbs();
  }else{
    renderDiceBetProbs();
    clearCasinoBetProbs();
  }
  if(game.casinoActive&&!casinoRolling){
    const dies=[1,2,3].map(i=>document.getElementById('die'+i));
    if(dies[0]&&!dies[0].dataset.face)initDiceFaces();
  }
  if(game.casinoActive&&game.spectateRunning)renderSpectateAiPiles();
  updateSpectateHud();
  applyRefPanelCasinoVisibility();
}

function enterCasino(){
  if(actionDone){addLog('本周已行动','warn');return}
  if(game.marketActive){addLog('在人才市场，无法去澳门','warn');return}
  if(game.casinoActive)return;
  let entry=MACAU_ENTRY,usedCoupon=false;
  if((game.casinoCoupons||0)>0){entry=Math.max(0,entry-500);usedCoupon=true}
  if(game.cash<entry){addLog('澳门五日游入场需 ¥'+entry,'fail');return}
  if(usedCoupon){game.casinoCoupons--;addLog('🎟 使用赌场优惠券，入场费减免 ¥500','info')}
  game.cash-=entry; game.gambleSpent+=entry; game.gambleCount++;
  ledgerAddExpense('casino','🎰','澳门入场',entry,false);
  game._casinoSessionStartCash=game.cash;
  game.casinoActive=true;
  game.spectateRunning=false; game.spectatePhase='idle'; game.spectateAis=null; game.spectatePhaseEnd=0;
  game.spectateManualBet=false; game.spectatePausedMs=0; game.spectatePauseKind=null;
  game.chipHand=emptyChipMap(); game.tableBets=emptyTableBets();
  game.rouletteBets=emptyRouletteBets(); game.casinoGame='dice'; game.rouletteWheelRot=0;
  game.selectedChipDenom=null;
  casinoRolling=false;
  resetCasinoSessionHistory();
  addLog('✈️ 澳门五日游（¥'+entry+'）· 本局胜率从零计 · 骰宝/轮盘 AI 流程','info');
  renderCasino(); initDiceFaces(); updateButtons(); renderCasinoRefStats();
  startSpectateLoop();
}

function buyChipAtCage(denom){
  if(!game||!game.casinoActive||casinoRolling)return;
  if(game.cash<denom){addLog('现金不足购买 ¥'+denom+' 筹码','fail');return}
  game.cash-=denom; game.chipHand[denom]=(game.chipHand[denom]||0)+1;
  ledgerAddExpense('casino','🎰','购买筹码',denom,false);
  renderCasino();
}

function selectChipFromHand(denom){
  if(!game||!game.casinoActive||casinoRolling)return;
  if(!game.chipHand[denom]){addLog('手中没有该面值筹码','fail');return}
  game.selectedChipDenom=game.selectedChipDenom===denom?null:denom;
  renderCasino();
}

function cashChipFromHand(denom){
  if(!game||!game.casinoActive||casinoRolling)return;
  if(!game.chipHand[denom])return;
  game.chipHand[denom]--;
  game.cash+=denom; game.money+=denom;
  ledgerAddIncome('casino','🎰','筹码兑回',denom);
  if(game.selectedChipDenom===denom&&!game.chipHand[denom])game.selectedChipDenom=null;
  addLog('筹码换回现金 ¥'+denom,'info');
  renderCasino();
}

function cashAllChipsFromHand(){
  if(!game||!game.casinoActive||casinoRolling)return;
  const total=chipMapTotal(game.chipHand);
  if(total<=0){addLog('手中没有筹码','fail');return}
  game.cash+=total; game.money+=total;
  ledgerAddIncome('casino','🎰','筹码兑回',total);
  game.chipHand=emptyChipMap(); game.selectedChipDenom=null;
  addLog('手中筹码全部换回现金 ¥'+total.toLocaleString(),'info');
  renderCasino();
}

function exchangeCashToChips(){
  if(!game||!game.casinoActive||casinoRolling)return;
  let amt=Math.max(10,Math.floor(+document.getElementById('chipExchangeAmt').value)||0);
  amt=Math.floor(amt/10)*10;
  if(amt<10){addLog('最少兑换 ¥10','fail');return}
  if(game.cash<amt){addLog('现金不足','fail');return}
  const {map,remainder}=distributeChips(amt);
  if(remainder>0){addLog('金额无法完全拆成筹码','fail');return}
  game.cash-=amt;
  ledgerAddExpense('casino','🎰','兑换筹码',amt,false);
  mergeChipMaps(game.chipHand,map);
  addLog('兑换筹码 ¥'+amt.toLocaleString()+' 入手','info');
  renderCasino();
}

function placeTableBet(zone){
  if(!game||!game.casinoActive||casinoRolling)return;
  const d=game.selectedChipDenom;
  if(!d){addLog('请先从手中点选一枚筹码','warn');return}
  if(!game.chipHand[d]){addLog('手中没有 ¥'+d+' 筹码','fail');return}
  game.chipHand[d]--;
  if(!game.chipHand[d]&&game.selectedChipDenom===d)game.selectedChipDenom=null;
  game.tableBets[zone][d]=(game.tableBets[zone][d]||0)+1;
  if(game.spectateRunning&&tableBetTotal()>0)enterSpectateManualBet();
  renderCasino();
}

function clearTableBets(){
  if(!game||!game.casinoActive||casinoRolling)return;
  BET_ZONES.forEach(z=>{mergeChipMaps(game.chipHand,game.tableBets[z]);game.tableBets[z]=emptyChipMap()});
  if(game.spectateRunning&&game.spectateManualBet){
    game.spectateManualBet=false;
    if(game.spectatePausedMs>0)resumeSpectateTimedFlow();
  }
  renderCasino();
}

function resolveZonePayout(zone,chipMap,dice){
  const chips=chipMapTotal(chipMap);
  if(!chips)return 0;
  let profit=0;
  if(zone==='big'||zone==='small'||zone==='triple1'||zone==='triple6')profit=getGamblePayout(zone,null,dice,chips);
  else profit=getGamblePayout('sum',zone,dice,chips);
  if(!profit&&game.wolfAchievement&&Math.random()<0.12)profit=chips;
  return profit>0?Math.floor(chips+profit):0;
}

function buildCasinoSettleRows(rows){
  if(!rows.length)return '<div style="color:var(--muted);text-align:center">本局未押注</div>';
  return rows.map(r=>'<div class="casino-settle-row '+(r.win?'win':'lose')+'"><span>'+r.zone+' · 押 ¥'+r.bet.toLocaleString()+'</span><span>'+(r.win?'赢 ¥'+r.payout.toLocaleString():'输')+'</span></div>').join('');
}
function settleCasinoRoll(dice,opts){
  opts=opts||{};
  const sum=dice[0]+dice[1]+dice[2];
  let won=0,lost=0,rows=[];
  BET_ZONES.forEach(z=>{
    const map=game.tableBets[z];
    const zoneVal=chipMapTotal(map);
    if(!zoneVal)return;
    const back=resolveZonePayout(z,map,dice);
    if(back>0){
      won+=back;
      rows.push({zone:DICE_ZONE_LABELS[z]||z,bet:zoneVal,win:true,payout:back});
      mergeChipMaps(game.chipHand,distributeChips(back).map);
    }else{
      lost+=zoneVal;
      rows.push({zone:DICE_ZONE_LABELS[z]||z,bet:zoneVal,win:false,payout:0});
    }
    game.tableBets[z]=emptyChipMap();
  });
  const dr=document.getElementById('diceResult');
  const triple=dice[0]===dice[1]&&dice[1]===dice[2];
  const payoutNote=won>0?'赢得筹码 ¥'+won.toLocaleString():lost>0?'输掉筹码 ¥'+lost.toLocaleString():'';
  if(dr)dr.innerHTML='<div class="dice-sum">'+sum+'</div>'+
    (triple?'<div class="dice-sum-note">豹子 '+dice[0]+dice[0]+dice[0]+'</div>':'')+
    (payoutNote?'<div class="dice-sum-note">'+payoutNote+'</div>':'');
  recordDiceHistory(dice);
  if(won>0)addLog('开盅 '+dice.join('+')+'='+sum+' 赢得筹码 ¥'+won.toLocaleString(),'success');
  else if(lost>0){addLog('开盅 '+dice.join('+')+'='+sum+' 输掉筹码 ¥'+lost.toLocaleString(),'fail');addStress(4)}
  else addLog('开盅 '+dice.join('+')+'='+sum,'info');
  let html='<div class="settle-sum dice-result-only">'+sum+'</div>'+(triple?'<div style="text-align:center;color:var(--accent);font-size:.76rem;margin-bottom:6px">豹子 '+dice[0]+dice[0]+dice[0]+'</div>':'');
  if(rows.length){
    html+='<div style="font-size:.72rem;color:var(--muted);margin:8px 0 4px">你的押注</div>';
    html+=buildCasinoSettleRows(rows);
    if(won>0||lost>0){
      html+='<div class="casino-settle-total">'+(won>0?'赢得筹码 ¥'+won.toLocaleString():'')+(won>0&&lost>0?' · ':'')+(lost>0?'输掉筹码 ¥'+lost.toLocaleString():'')+'</div>';
    }
    if(opts.aiNote)html+=opts.aiNote;
    showCasinoSettleMenu({icon:'🎲',title:'骰宝结算',html,hint:'点击关闭继续 · 休息阶段可慢慢看'});
  }else{
    if(opts.aiNote)html+=opts.aiNote;
    showCasinoSettleMenu({icon:'🎲',title:'骰宝开奖',html,autoClose:true});
  }
  renderCasino();
}

function rollCasinoTable(){
  if(!game||!game.casinoActive||casinoRolling)return;
  const total=tableBetTotal();
  if(game.spectateRunning){
    if(total<=0){addLog('未下注将按时自动开盅，请先押筹码','warn');return}
    startSpectateRoll(spectateLoopGen);
    return;
  }
  if(total<=0){addLog('请先把筹码押入赌区','warn');return}
  const dice=rollDice();
  animateDiceRoll(dice,()=>settleCasinoRoll(dice));
}

function leaveCasino(){
  if(!game||!game.casinoActive||casinoRolling)return;
  closeCasinoSettleMenu();
  const onTable=tableBetTotal()+rouletteBetTotal();
  if(onTable>0){addLog('请先开盅/开转或收回桌面筹码','warn');return}
  const handVal=chipMapTotal(game.chipHand);
  if(handVal>0){
    game.cash+=handVal; game.money+=handVal;
    ledgerAddIncome('casino','🎰','离桌结款',handVal);
    game.chipHand=emptyChipMap();
    addLog('离桌结款：筹码兑换 ¥'+handVal.toLocaleString(),'info');
  }
  if(typeof recordCasinoSessionEnd==='function')recordCasinoSessionEnd();
  stopSpectateLoop();
  game.casinoActive=false;
  game.casinoHistory=null;
  game.spectateAis=null; game.selectedChipDenom=null; casinoRolling=false;
  const dr=document.getElementById('diceResult'); if(dr)dr.textContent='';
  const rr=document.getElementById('rouletteResult'); if(rr)rr.textContent='押注后点击开转';
  addLog('澳门之行结束，本周行动已消耗。','warn');
  actionDone=true;
  renderCasino();
  renderCasinoRefStats();
  renderRefPanel();
  finishWeek();
}

function showEndGameModal(ending){
  const modal=document.getElementById('endModal');
  modal.className='modal'+(ending.type==='victory'?' victory':' tragedy');
  document.getElementById('endTitle').textContent=ending.title;
  document.getElementById('endSummary').innerHTML='<br>'+ending.desc+'<br><br>从2024到'+getYear(game.week)+'，历经 '+Math.floor(game.week/52)+' 年 '+game.week%52+' 周。';
  document.getElementById('finalStats').innerHTML=[
    ['结局',ending.title],
    ['房贷',game.mortgagePaidOff?'已还清':game.mortgagePaymentsMade+'/'+MORTGAGE_MONTHS+'月'],
    ['房产',game.ownsHome?'自有':'租住/流浪'],
    ['生育',game.hasChildren?'是':'否'],
    ['婚姻',game.divorced?'离异':game.married?'已婚':'—'],
    ['累计收入','¥'+game.money.toLocaleString()],
    ['剩余现金','¥'+game.cash.toLocaleString()],
    ['被裁次数',game.layoffs],
  ].map(([k,v])=>'<div><span>'+k+'</span><span>'+v+'</span></div>').join('');
  document.getElementById('endOverlay').classList.remove('hidden');
}
function endGame(trigger){
  if(game.gameOver)return;
  if(_companionActor){
    game.gameOver=true;
    game.endingType=trigger||'timeout';
    addLog('人生落幕','warn');
    return;
  }
  game.gameOver=true;
  const ending=determineEnding();
  game.endingType=ending.type;
  if(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating()){
    game._pendingEndGame={trigger,ending};
    if(typeof autoLifeNote==='function')autoLifeNote('🏁 人生落幕：'+ending.title);
    return;
  }
  showEndGameModal(ending);
  autoSaveSlot();
}

function addLog(msg,type){
  if(!game)return;
  if(_companionActor){
    game.log.unshift({date:getDateStr(game.week),msg,type});
    if(game.log.length>60)game.log.pop();
    return;
  }
  game.log.unshift({date:getDateStr(game.week),msg,type});
  if(game.log.length>120)game.log.pop();
  if(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating()&&typeof autoLifeNote==='function'&&msg){
    if(/啃老|吃软饭|月支出|低保|无力|被裁|入职|投递|离婚|流浪|房贷|怀孕|精神|压力|无法上班|脑力/.test(msg))autoLifeNote(msg);
  }
  if(typeof autoLifeRunning!=='undefined'&&autoLifeRunning)return;
  const logEl=document.getElementById('gameLog');
  if(logEl)logEl.innerHTML=game.log.map(l=>'<div class="log-entry '+l.type+'"><span class="date">'+l.date+'</span> '+l.msg+'</div>').join('');
}

function drawSparkline(canvas,history,w,h,opts){
  opts=opts||{};
  if(!canvas)return; const ctx=canvas.getContext('2d'), dpr=devicePixelRatio||1;
  canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);
  const d=history.slice(-30); if(d.length<2)return;
  const mn=Math.min(...d),mx=Math.max(...d),rg=mx-mn||1;
  const yAt=v=>h-((v-mn)/rg)*(h-4)-2;
  const xAt=i=>i/(d.length-1)*w;
  if(opts.cnStock){
    const padR=14;
    const plotW=Math.max(40,w-padR);
    const xPlot=i=>i/(d.length-1)*plotW;
    const last=d.length-1;
    const dir=opts.trend||(d[last]>d[last-1]?'up':d[last]<d[last-1]?'down':'flat');
    const trendCol=dir==='up'?'#f85149':dir==='down'?'#3fb950':'#8b949e';
    for(let i=1;i<d.length;i++){
      const v0=d[i-1],v1=d[i];
      const isLast=i===last;
      ctx.lineWidth=isLast?2.5:1.5;
      ctx.strokeStyle=isLast?trendCol:(v1>v0?'#f85149':v1<v0?'#3fb950':'#8b949e');
      ctx.beginPath();
      ctx.moveTo(xPlot(i-1),yAt(v0));
      ctx.lineTo(xPlot(i),yAt(v1));
      ctx.stroke();
    }
    const lx=xPlot(last),ly=yAt(d[last]);
    ctx.fillStyle=trendCol;
    ctx.beginPath();
    ctx.arc(lx,ly,3.5,0,Math.PI*2);
    ctx.fill();
    const gx=plotW+padR*0.55,gy=ly;
    ctx.beginPath();
    if(dir==='up'){
      ctx.moveTo(gx,gy-7);ctx.lineTo(gx+7,gy+4);ctx.lineTo(gx-7,gy+4);
    }else if(dir==='down'){
      ctx.moveTo(gx,gy+7);ctx.lineTo(gx+7,gy-4);ctx.lineTo(gx-7,gy-4);
    }else{
      ctx.rect(gx-5,gy-1.5,10,3);
    }
    ctx.closePath();
    ctx.fill();
    return;
  }
  ctx.strokeStyle=d[d.length-1]>=d[d.length-2]?'#3fb950':'#f85149';
  ctx.beginPath(); d.forEach((v,i)=>{const x=xAt(i),y=yAt(v);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}); ctx.stroke();
}

function fmtJobsShort(n){
  if(n>=100000000)return(n/100000000).toFixed(1)+'亿';
  if(n>=10000)return Math.round(n/10000)+'万';
  if(n>=1000)return(n/1000).toFixed(1)+'k';
  return String(n);
}
function jobSortKey(j){return{heat:j=>j.heatPct,pay:j=>j.pay,exposure:j=>j.exposure}[currentSort](j)}
function marketForRef(){
  if(game)return game.market;
  return RAW_DATA.map((job,i)=>({...job,idx:i,basePay:job.pay,baseJobs:job.jobs,pay:job.pay,jobs:job.jobs,heatPct:100+job.outlook}));
}
function renderRefJobDetail(idx){
  const el=document.getElementById('refJobDetail');
  const jobs=marketForRef();
  const job=jobs[idx];
  if(!el||!job)return;
  const upPay=job.prevPay!=null?job.pay>=job.prevPay:null;
  const upJobs=job.prevJobs!=null?job.jobs>=job.prevJobs:null;
  const catJobs=jobs.filter(j=>j.category===job.category);
  const catStats=computeNationalStats(catJobs);
  el.innerHTML='<h3>'+job.title+'</h3>'+
    '<div class="ref-row"><label>行业</label><span>'+job.category+'</span></div>'+
    '<div class="ref-row"><label>年薪中位数</label><span style="color:'+(upPay===false?'var(--red)':upPay?'var(--green)':'var(--text)')+'">¥'+job.pay.toLocaleString()+'</span></div>'+
    '<div class="ref-row"><label>网站基准</label><span>¥'+(job.basePay||job.pay).toLocaleString()+'</span></div>'+
    '<div class="ref-row"><label>就业人数</label><span style="color:'+(upJobs===false?'var(--red)':upJobs?'var(--green)':'var(--text)')+'">'+fmtJobsCount(job.jobs)+'</span></div>'+
    '<div class="ref-row"><label>人数基准</label><span>'+fmtJobsCount(job.baseJobs||job.jobs)+'</span></div>'+
    '<div class="ref-row"><label>热度</label><span>'+job.heatPct+'%</span></div>'+
    '<div class="ref-row"><label>就业前景</label><span>'+(job.outlook>0?'+':'')+job.outlook+'% · '+job.outlook_desc+'</span></div>'+
    '<div class="ref-row"><label>学历要求</label><span>'+job.education+'</span></div>'+
    '<div class="ref-row"><label>AI 影响</label><span style="color:'+exposureColorCSS(job.exposure,1)+'">'+job.exposure+'/10</span></div>'+
    '<div class="ref-rationale"><strong>AI 分析</strong><br>'+job.exposure_rationale+'</div>'+
    buildRefCategoryStatsHtml(job.category,catStats,catJobs.length,{compact:true});
}
function applyRefPanelCasinoVisibility(){
  if(!game)return;
  const panel=document.getElementById('refPanel');
  const nat=document.getElementById('refNational');
  const jd=document.getElementById('refJobDetail');
  const hdr=document.querySelector('#refPanel .ref-hdr');
  const sub=document.querySelector('#refPanel .ref-sub');
  const ind=document.getElementById('refIndustry');
  if(game.casinoActive){
    if(panel)panel.classList.add('casino-ref-mode');
    if(nat)nat.style.display='none';
    if(jd)jd.style.display='none';
    if(ind)ind.style.display='none';
    if(hdr)hdr.textContent='赌桌胜率';
    if(sub)sub.textContent=game.casinoGame==='roulette'?'轮盘 · 环状号码 + 红黑概率':'骰宝 · 各押注区概率';
    renderCasinoRefStats();
    return true;
  }
  if(panel)panel.classList.remove('casino-ref-mode');
  return false;
}
function syncRefViewToggleButtons(){
  const wrap=document.getElementById('refViewToggle');
  if(!wrap)return;
  const casino=!!(game&&game.casinoActive);
  wrap.style.display=casino?'none':'flex';
  wrap.querySelectorAll('.ref-view-btn').forEach(btn=>{
    const v=btn.getAttribute('data-view');
    btn.classList.toggle('active',v===refPanelView);
    if(v==='job')btn.disabled=selectedIdx<0;
    if(v==='category')btn.disabled=!ensureRefPanelCategory();
  });
}
function setRefPanelView(view){
  if(view==='job'){
    if(selectedIdx<0){addLog('请先在求职页点击职业方块','info');return}
    refPanelView='job';
    if(game&&game.market[selectedIdx])refPanelCategory=game.market[selectedIdx].category;
  }else if(view==='category'){
    const cat=ensureRefPanelCategory();
    if(!cat){addLog('请先筛选行业或选择职业','info');return}
    refPanelCategory=cat;
    refPanelView='category';
  }else refPanelView='national';
  renderRefPanel();
}
function renderRefPanel(){
  const nat=document.getElementById('refNational');
  const jd=document.getElementById('refJobDetail');
  const ind=document.getElementById('refIndustry');
  const hdr=document.querySelector('#refPanel .ref-hdr');
  const sub=document.querySelector('#refPanel .ref-sub');
  if(applyRefPanelCasinoVisibility())return;
  syncRefViewToggleButtons();
  const showJob=refPanelView==='job'&&selectedIdx>=0;
  const showCat=refPanelView==='category'&&!!ensureRefPanelCategory();
  if(showJob){
    const job=marketForRef()[selectedIdx];
    if(nat)nat.style.display='none';
    if(ind)ind.style.display='none';
    if(jd){jd.style.display='block';renderRefJobDetail(selectedIdx)}
    if(hdr&&job)hdr.textContent=job.title;
    if(sub&&job)sub.textContent=job.category+' · AI '+job.exposure+'/10';
  }else if(showCat){
    const cat=refPanelCategory||ensureRefPanelCategory();
    const catJobs=marketForRef().filter(j=>j.category===cat);
    if(nat)nat.style.display='none';
    if(jd)jd.style.display='none';
    if(ind){ind.style.display='block';renderRefIndustry(cat)}
    if(hdr)hdr.textContent=cat;
    if(sub)sub.textContent='行业分析 · '+catJobs.length+' 个职业';
  }else{
    if(refPanelView==='job'&&selectedIdx<0)refPanelView='national';
    if(refPanelView==='category'&&!ensureRefPanelCategory())refPanelView='national';
    if(nat){nat.style.display='block';renderRefNational(marketForRef())}
    if(jd)jd.style.display='none';
    if(ind)ind.style.display='none';
    if(hdr)hdr.textContent='中国就业市场';
    if(sub)sub.textContent='242个职业 · 方块面积=就业人数 · 颜色=AI影响（0–10）';
    syncRefViewToggleButtons();
  }
}
function renderJobs(){
  if(!game)return;
  const treemapEl=document.getElementById('jobTreemap');
  if(!treemapEl)return;
  let jobs=filterJobsForTreemap();
  const byCat={};
  jobs.forEach(j=>{(byCat[j.category]=byCat[j.category]||[]).push(j)});
  const cats=Object.keys(byCat).sort((a,b)=>{
    const ka=byCat[a].reduce((s,j)=>s+jobSortKey(j),0)/byCat[a].length;
    const kb=byCat[b].reduce((s,j)=>s+jobSortKey(j),0)/byCat[b].length;
    return kb-ka;
  });
  const sk=jobSortKey;
  treemapEl.innerHTML=cats.map(cat=>{
    const catJobs=[...byCat[cat]].sort((a,b)=>sk(b)-sk(a));
    const maxJ=Math.max(...catJobs.map(j=>j.jobs),1);
    const totalJ=catJobs.reduce((s,j)=>s+j.jobs,0);
    const tiles=catJobs.map(job=>{
      const sc=Math.sqrt(job.jobs/maxJ), w=Math.round(68+sc*118), h=Math.round(48+sc*76);
      const cur=game.employed&&job.idx===game.employment?.jobIdx;
      const multi=selectedJobIdxs.has(job.idx);
      return '<div class="job-tile'+(job.idx===selectedIdx?' selected':'')+(multi?' multi-selected':'')+(cur?' current-job':'')+'" style="flex:0 0 auto;width:'+w+'px;height:'+h+'px;background:'+aiExposureColor(job.exposure)+'" onclick="selectJob('+job.idx+')">'+
        '<div class="jt-title">'+job.title+(cur?' ✓':'')+'</div>'+
        '<div class="jt-meta">¥'+(job.pay/10000).toFixed(1)+'万 · 热'+job.heatPct+'%</div>'+
        '<div class="jt-stats"><span>AI '+job.exposure+'</span><span>'+fmtJobsShort(job.jobs)+'人</span></div></div>';
    }).join('');
    return '<div class="industry-block"><div class="industry-hdr"><span>'+cat+'</span><span style="font-size:.7rem;color:var(--muted)">'+fmtJobsCount(totalJ)+'</span></div><div class="industry-inner">'+tiles+'</div></div>';
  }).join('');
  if(refPanelView==='job'&&selectedIdx<0)refPanelView='national';
  if(refPanelView==='category'&&!ensureRefPanelCategory())refPanelView='national';
  renderRefPanel();
  if(selectedIdx>=0)showDetail(selectedIdx);
  renderCasinoRefStats();
  if(typeof renderCampusRecruitmentPanel==='function')renderCampusRecruitmentPanel();
}

function updateOfferPreview(){
  if(!game)return;
  const rc=getResumeCost();
  const method=getApplyMethod();
  const hint=document.getElementById('applyCostHint');
  if(hint){
    let txt='';
    if(method==='market')txt='线下：付¥200入场 → 随机8摊 → 投递或再逛逛各-10分钟（共8小时/最多48家）· 1秒=1分钟';
    else if(method==='app'){
      const renew=rc.renewApps&&rc.renewApps.length;
      txt='线上：先选职业 → 勾选APP'+(renew?'（本次开通 '+renew+' 个，¥'+rc.upfront+'）':'（已开通APP免费投递）')+' → 抽取企业 → 勾选投递';
    }else txt='猎头：先选职业 → 抽取企业 → 勾选投递 · 入职收年薪20%';
    hint.textContent=txt+' · 面试：在线免费·同城¥50·异地按路程（远城含住宿） · 内推为独立按钮，偶发出现';
  }
  updateAppSubscriptionLabels();
  if(selectedIdx>=0)showDetail(selectedIdx);
}

function selectJob(idx){
  if(!game)return;
  if(game.onWelfare&&!canApplyJob(game.market[idx]))return;
  if(selectedJobIdxs.has(idx)){
    selectedJobIdxs.delete(idx);
    if(selectedIdx===idx)selectedIdx=selectedJobIdxs.size?[...selectedJobIdxs][0]:-1;
    if(selectedIdx<0&&refPanelView==='job')refPanelView='national';
  }else{
    selectedJobIdxs.add(idx);
    selectedIdx=idx;
    refPanelView='job';
    if(game.market[idx])refPanelCategory=game.market[idx].category;
  }
  renderJobs(); updateOfferPreview(); updateButtons();
}

function fmtProb(p){return p<0.0001?(p*1e6).toFixed(2)+'ppm':p<0.01?(p*100).toFixed(3)+'%':Math.round(p*100)+'%'}

function showDetail(idx){
  if(!game||!game.market||idx<0||idx>=game.market.length)return;
  const job=game.market[idx];
  if(!job)return;
  const offer=computeOffer(job,{isSwitch:game.employed});
  offer.apps=getSelectedApps();
  const mod=getHireProbabilityModifiers(offer);
  const ageLim=getAgeLimit(job);
  const showProb=game.showProbabilities;
  const rp=getResumeProbability(job,offer,offer.apps), ip=getInterviewProbability(job,offer,false), ref=getReferralProbability(offer);
  document.getElementById('detailPanel').style.display='block';
  document.getElementById('detailTitle').textContent=job.title;
  const statReq=typeof jobStatRequirement==='function'?jobStatRequirement(job):null;
  const statOk=statReq&&typeof meetsJobStats==='function'?meetsJobStats(job,false):true;
  const playerRankLine=(typeof playerCareerRankForJob==='function'&&typeof playerJobCareerExp==='function')?
    ' · 你的「'+job.title+'」经验 '+playerJobCareerExp(job.title)+'%·'+playerCareerRankForJob(job.title):'';
  document.getElementById('detailMeta').textContent=job.category+' · '+job.education+' · 中位¥'+job.pay.toLocaleString()+' · 热'+job.heatPct+'% · AI '+job.exposure+'/10'+
    ' · 年龄限'+ageLim+'岁'+(isOverAgeLimit(job)?' ⚠超龄':'')+playerRankLine+
    (statReq?' · 属性肉体'+statReq.body+'心智'+statReq.mind+'精神'+statReq.spirit+(statOk?'':' ⚠不足'):'')+
    (showProb?' · 院校×'+mod.schoolF.toFixed(2)+' 学历×'+mod.eduF.toFixed(4):'');
  ['probResumeRow','probInterviewRow','probReferralRow'].forEach(id=>{
    document.getElementById(id).classList.toggle('prob-hidden',!showProb);
  });
  const showSponge=game.showSpongeInsight;
  const spongeRow=document.getElementById('probSpongeRow');
  if(spongeRow){
    spongeRow.classList.toggle('prob-hidden',!showSponge);
    if(showSponge){
      const isIntern=offer.roleExtra==='intern';
      const sp=isIntern?getInternRetentionPreview(job,offer):getJobLayoffPreview(job,offer);
      const lbl=document.getElementById('probSpongeLabel');
      if(lbl)lbl.textContent=isIntern?'实习留存率':'周裁员率';
      const bar=document.getElementById('spongeProbBar');
      if(bar){
        bar.style.width=Math.min(100,sp*100)+'%';
        bar.style.background=sp>.5?'var(--green)':sp>.2?'var(--yellow)':'var(--red)';
      }
      const txt=document.getElementById('spongeProbText');
      if(txt)txt.textContent=fmtProb(sp);
    }
  }
  if(showProb){
    [['resumeProbBar',rp],['interviewProbBar',ip],['referralProbBar',ref]].forEach(([id,p])=>{
      document.getElementById(id).style.width=Math.min(100,p*100)+'%';
      document.getElementById(id).style.background=p>.5?'var(--green)':p>.2?'var(--yellow)':'var(--red)';
    });
    document.getElementById('resumeProbText').textContent=fmtProb(rp);
    document.getElementById('interviewProbText').textContent=fmtProb(ip);
    document.getElementById('referralProbText').textContent=fmtProb(ref);
  }
  drawSparkline(document.getElementById('detailChart'),job.payHistory,600,90);
}

function updateButtons(){
  const btn=document.getElementById('btnApply');
  if(!btn)return;
  const autoDis=!!autoLifeRunning;
  const method=game?getApplyMethod():'app';
  const n=selectedJobIdxs.size||(selectedIdx>=0?1:0);
  const hasPick=n>0||applyCategoryPicks.size>0;
  const needsPick=method==='app'||method==='headhunter';
  btn.disabled=autoDis||actionDone||!game||game.casinoActive||game.marketActive||(needsPick&&!hasPick);
  btn.textContent=method==='market'?'前往人才市场':method==='headhunter'?'猎头寻访':'查看本期招聘';
  updateReferralButton();
  const hint=document.getElementById('applyPickHint');
  if(hint){
    if(!game)hint.textContent='请先开始游戏';
    else if(game.casinoActive)hint.textContent=game.spectateManualBet||tableBetTotal()>0?'已下注 · 点「下注完成」开盅 · 离桌结款':game.spectateRunning?'澳门骰宝围观中 · 未下注按时开盅 · 离桌结款':'在澳门赌桌 · 离桌结款后进入下周';
    else if(game.marketActive)hint.textContent='在人才市场 · 投递或点「离场结束」';
    else if(actionDone)hint.textContent='本周日程已满，请回日常进入下周或使用自动生活';
    else if(method==='market')hint.textContent='线下渠道：点「前往人才市场」付¥200入场，随机刷岗限时投递';
    else if(!hasPick)hint.textContent='↑ 线上/猎头：多选职业方块，或左侧「筛选行业」添加行业';
    else hint.textContent='已选 '+(n||'行业'+applyCategoryPicks.size)+' · 选渠道后点按钮抽取企业招聘';
  }
  const btnEnter=document.getElementById('btnEnterCasino');
  if(btnEnter)btnEnter.disabled=autoDis||actionDone||game.casinoActive;
  const btnLeave=document.getElementById('btnLeaveCasino');
  if(btnLeave)btnLeave.disabled=!game.casinoActive||casinoRolling;
  updateCasinoActionButtons();
}

function updateHeaderStats(){
  if(!game)return;
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  set('statAge',getPlayerAge()+'岁');
  set('statDate',getDateStr(game.week));
  set('statWeek',(game.week+1)+'/'+TOTAL_WEEKS);
  set('statCash','¥'+game.cash.toLocaleString());
  set('statMoney','¥'+game.money.toLocaleString());
  const intim=game.married&&!game.divorced?(game.spouseIntimacy!=null?game.spouseIntimacy:INTIMACY_INITIAL):null;
  const pn=game.partnerDisplayName||(game.married&&!game.divorced?COMPANION_NAME:'');
  set('statMarriage',game.divorced?'离异':game.married?(game.longDistance?'已婚·'+pn+'·亲'+intim:'已婚·'+pn+'·亲'+intim):'单身');
  set('statMonthly','¥'+getMonthlyExpenses().total.toLocaleString());
  const stress=playerStress();
  set('statStress',stress);
  const bar=document.getElementById('stressBar');
  if(bar){
    bar.style.width=Math.min(100,stress)+'%';
    bar.style.background=stress>=STRESS_MAD?'#a371f7':stress>=STRESS_MIND_BLOCK?'#f0883e':'var(--red)';
  }
  let life='正常';
  if(game.imprisonedUntilWeek>game.week)life='监禁中';
  else if(game.homeless)life='流浪';
  else if(game.affairActive)life='婚外情';
  else if(game.onWelfare)life=game.disabled?'伤残低保':'低保';
  else if(game.livingOffSpouse)life='吃软饭';
  else if(game.livingOffParents)life='啃老';
  set('statLife',life);
  set('statIdeal',typeof playerIdealProgressLabel==='function'?playerIdealProgressLabel():'—');
  set('statMortgage',typeof playerMortgageStatLabel==='function'?playerMortgageStatLabel():((game.ownsHome&&game.mortgagePaidOff)?'已还清':(game.ownsHome?game.mortgagePaymentsMade+'/'+MORTGAGE_MONTHS+'月':'—')));
  const pregLeft=game.pregnant?(typeof pregnancyWeeksRemaining==='function'?pregnancyWeeksRemaining():game.pregnancyWeeksLeft):0;
  set('statFamily',game.pregnant?('孕期剩'+pregLeft+'周'):game.hasChildren?(game.childRaisingMonthsLeft>0?'育儿中':'已育'):'无孩');
}
function safeRender(fn,label){
  try{if(typeof fn==='function')fn()}catch(e){console.error(label||'render',e)}
}
function renderLifePanelContent(){
  if(!game)return;
  const lifeEl=document.getElementById('lifePanel');
  if(!lifeEl)return;
  const intim=game.married&&!game.divorced?(game.spouseIntimacy!=null?game.spouseIntimacy:INTIMACY_INITIAL):null;
  const exp=getMonthlyExpenses();
  const carLbl=(game.ownedCar&&typeof CAR_SHOP!=='undefined'&&CAR_SHOP[game.ownedCar])?CAR_SHOP[game.ownedCar].name:'无';
  const phoneLbl=(game.phone&&typeof PHONE_SHOP!=='undefined'&&PHONE_SHOP[game.phone])?PHONE_SHOP[game.phone].name:'无手机';
  const affairHtml=typeof playerAffairStatusHtml==='function'?playerAffairStatusHtml():'';
  lifeEl.innerHTML=
    '<div><b>人生目标</b></div><div style="color:var(--muted);margin:4px 0">还清30年房贷，与伴侣在自己的房中度晚年</div>'+
    '<div><b>本月 ¥'+exp.total.toLocaleString()+'</b> · '+exp.label+'</div>'+
    (typeof playerMortgageStatLabel==='function'?'<div>住房 · '+playerMortgageStatLabel()+'</div>':'')+
    (game.pregnant?'<div style="color:var(--green)">怀孕中 · 剩 '+(typeof pregnancyWeeksRemaining==='function'?pregnancyWeeksRemaining():game.pregnancyWeeksLeft)+' 周 · 亲密度每周±1'+
      ' · '+pregnancyWhoLabel()+' · 净波动 '+(game.pregnancyIntimacyNet||0)+'</div>':'')+
    (game.hasChildren&&game.childRaisingMonthsLeft>0?'<div>育儿剩余 '+game.childRaisingMonthsLeft+' 月</div>':'')+
    (game.married&&!game.divorced?'<div>夫妻亲密度 <b style="color:'+(intim>=60?'var(--green)':intim>=0?'var(--yellow)':'var(--red)')+'">'+intim+'</b> · 约会+1 · 一月未约会-'+(game.longDistance?'10':'5')+'</div>':'')+
    (game.fertilityOrder?'<div style="color:var(--green)">'+(game.fertilityOrder.type==='surrogacy'?'代孕':'试管')+'进行中 · 预计 '+getDateStr(game.fertilityOrder.dueWeek)+' 交货</div>':'')+
    (game.procreateIntentWeek===game.week?'<div style="color:var(--green)">本月备孕中（须做爱）</div>':'')+
    (game.partnerAffairActive?'<div style="color:var(--red)">伴侣婚外情'+(game.partnerStdActive?' · 伴侣已患性病':'')+'</div>':'')+
    affairHtml+
    (game.affairActive&&game.partnerAffairActive?'<div style="color:var(--red)">双方婚外情 · 月支出×2</div>':'')+
    (game.stdActive?'<div style="color:var(--orange)">性病 · '+stdTreatmentStatusText()+(game.stdWeeksInfected<=STD_STRESS_WEEKS?' · 每周压力+2':' · 超过'+STD_STRESS_WEEKS+'周不再加压')+' · 日常去医院</div>':'')+
    (game.livingOffSpouse?'<div style="color:var(--orange)">吃软饭中 · 每周亲密度-5</div>':'')+
    (game.longDistance?'<div style="color:var(--orange)">异地婚恋 · 每周+1压力 · 可线上约会 · 宅家可电话性爱（效果减半·伴侣须在家醒着）</div>':'')+
    (playerStress()>=STRESS_MAD?'<div style="color:#a371f7">精神崩溃（压力≥'+STRESS_MAD+'）· 无法上班 · 仍可求职</div>':'')+
    (playerStress()>=STRESS_MIND_BLOCK&&playerStress()<STRESS_MAD?'<div style="color:var(--orange)">压力过大（≥'+STRESS_MIND_BLOCK+'）· 无法从事脑力劳动</div>':'')+
    '<div style="font-size:.7rem;color:var(--muted)">车'+carLbl+' · '+phoneLbl+' · '+
      (game.employed&&game.longDistance?'工作在 '+game.playerCity+' · 伴侣定居 '+PLAYER_HOME_CITY:
        game.employed?'在 '+game.playerCity+' 工作 · 同城':'无业 · 在 '+PLAYER_HOME_CITY+' 本地')+
    '</div>'+
    (game.homeless?'<div style="color:var(--red)">流浪 '+game.homelessMonths+' 月</div>':'')+
    (typeof parentsSupportStatusHtml==='function'?parentsSupportStatusHtml():'')+
    '<div style="margin-top:6px;font-size:.72rem;color:var(--muted)">35/40/45岁录取递减 · 等级=头部/重点/草根 · 规模=大/中/小（仅影响行业覆盖）</div>';
}
function renderEmpCard(){
  if(!game)return;
  const empCard=document.getElementById('empCard');
  if(!empCard)return;
  if(game.employed&&game.employment){
    const e=game.employment,j=game.market[e.jobIdx];
    empCard.style.display='block';
    const role=e.roleExtra?IMP_LABEL[e.importance]+'·'+ROLE_EXTRA[e.roleExtra]:IMP_LABEL[e.importance];
    const payLbl=e.roleExtra==='temp'?'周薪¥'+Math.round(e.annualPay/52).toLocaleString():e.roleExtra==='intern'?'实习年薪¥'+Math.round(e.annualPay*0.55).toLocaleString():'年薪¥'+e.annualPay.toLocaleString();
    const otLbl=e.otProfile?e.otProfile.otLabel:(e.tier==='high'?'加班常态化':e.tier==='mid'?'周末偶尔加班':'加班费不稳定');
    empCard.innerHTML='<b>'+(j?j.title:'未知岗位')+'</b> @ '+e.company.name+' · '+payLbl+
      ' <span class="badge badge-tier-'+e.tier[0]+'">'+TIER_LABEL[e.tier]+'</span>'+
      ' <span class="badge badge-scale-'+e.company.scale[0]+'">'+SCALE_LABEL[e.company.scale]+'</span>'+
      ' <span class="badge badge-imp-'+e.importance[0]+'">'+role+'</span>'+
      (e.internWeeksLeft>0?' <span style="color:var(--yellow)">实习剩'+e.internWeeksLeft+'周</span>':'')+
      '<div style="font-size:.7rem;color:var(--muted);margin-top:2px">加班：'+otLbl+'</div>';
  }else empCard.style.display='none';
}
function updateUI(){
  if(!game)return;
  if(typeof ensurePlayerStatState==='function')ensurePlayerStatState();
  else if(!game.tempStats&&typeof defaultTempStats==='function')game.tempStats=defaultTempStats();
  if(typeof ensureAutoLifeNotStuck==='function')ensureAutoLifeNotStuck();
  safeRender(updateHeaderStats,'updateHeaderStats');
  safeRender(renderHeaderProgress,'renderHeaderProgress');
  safeRender(renderSocialMedals,'renderSocialMedals');
  safeRender(renderLifePanelContent,'renderLifePanelContent');
  safeRender(renderInterviewCalendar,'renderInterviewCalendar');
  if(typeof isAutoLifeSimulating==='function'&&isAutoLifeSimulating()){
    safeRender(renderAutoLifePanel,'renderAutoLifePanel');
    if(typeof updateAutoLifeProgress==='function')updateAutoLifeProgress();
    safeRender(renderDailyPanel,'renderDailyPanel');
  if(typeof currentTab!=='undefined'&&currentTab==='job')safeRender(renderJobHuntPanel,'renderJobHuntPanel');
    safeRender(renderInbox,'renderInbox');
    safeRender(renderOffers,'renderOffers');
    safeRender(renderStocks,'renderStocks');
    return;
  }
  try{
  safeRender(renderEmpCard,'renderEmpCard');
  if(typeof renderActionTip==='function')renderActionTip();
  else{
    const actionTipEl=document.getElementById('actionTip');
    if(actionTipEl)actionTipEl.innerHTML=actionDone
      ?'<strong>本周日程已满</strong> → 日常页「进入下周」或自动生活':'<strong>'+getDateStr(game.week)+'</strong> · 每时段8h';
  }
  const inJobTab=typeof currentTab!=='undefined'&&currentTab==='job';
  if(game.employed&&selectedIdx<0&&!inJobTab)selectedIdx=game.employment.jobIdx;
  safeRender(renderDailyPanel,'renderDailyPanel');
  if(typeof currentTab!=='undefined'&&currentTab==='job')safeRender(renderJobHuntPanel,'renderJobHuntPanel');
  safeRender(renderAutoLifePanel,'renderAutoLifePanel');
  safeRender(renderJobs,'renderJobs');
  safeRender(renderStocks,'renderStocks');
  safeRender(renderCasino,'renderCasino');
  safeRender(renderInbox,'renderInbox');
  safeRender(renderOffers,'renderOffers');
  safeRender(renderSpendingPanel,'renderSpendingPanel');
  safeRender(renderCompanionPanel,'renderCompanionPanel');
  safeRender(renderNetworkPanel,'renderNetworkPanel');
  safeRender(renderCompanyMgmtTab,'renderCompanyMgmtTab');
  safeRender(syncCompanyMgmtTabVisibility,'syncCompanyMgmtTabVisibility');
  safeRender(renderSideIncomeTabPanel,'renderSideIncomeTabPanel');
  if(typeof renderDailyTimeBar==='function')renderDailyTimeBar();
  safeRender(renderCasinoRefStats,'renderCasinoRefStats');
  safeRender(renderFinanceLedger,'renderFinanceLedger');
  safeRender(updateButtons,'updateButtons');
  safeRender(checkLifeStatusModals,'checkLifeStatusModals');
  if(typeof tryShowPendingDivorceModal==='function')tryShowPendingDivorceModal();
  safeRender(updateHeadhunterOption,'updateHeadhunterOption');
  safeRender(updateOfferPreview,'updateOfferPreview');
  }catch(e){
    console.error('updateUI',e);
    safeRender(renderDailyPanel,'renderDailyPanel');
  if(typeof currentTab!=='undefined'&&currentTab==='job')safeRender(renderJobHuntPanel,'renderJobHuntPanel');
    safeRender(renderAutoLifePanel,'renderAutoLifePanel');
  }
}
${WORKPLACE_STORIES_DATA_SRC}
${WORKPLACE_STORIES_POOLS_SRC}
${WORKPLACE_STORIES_SRC}
${ARTIFACT_SYSTEM_SRC}
${STOCK_FLOAT_SRC}
${HOUSING_SYSTEM_SRC}
${PROPERTY_COMPANY_SRC}
${ASSETS_PANEL_SRC}
${COMPANY_MANAGEMENT_SRC}
${COMPANY_GOVERNANCE_SRC}
${COMPANY_STRATEGY_SRC}
${COMPANY_BRANCHES_SRC}
${COMPANY_TRAVEL_SRC}
${COMPANY_COMPETITION_SRC}
${COMPANY_KPI_SRC}
${DAILY_ACTIVITY_SRC}
${WISH_LIST_EVENTS_SRC}
${WORK_KPI_SRC}
${JOB_HUNT_DAILY_SRC}
${AFFAIR_SYSTEM_SRC}
${NAMES_SRC}
${CONTACTS_SYSTEM_SRC}
${RELATIONSHIP_SYSTEM_SRC}
${DREAM_SYSTEM_SRC}
${IDEAL_PANEL_SRC}
${SOCIAL_CIRCLES_SRC}
${FAMILY_CIRCLES_SRC}
${LIFESPAN_SYSTEM_SRC}
${LIFE_EXTENSIONS_SRC}
${FLUX_ENGINE_SRC}
${OUTDOOR_HOBBY_SRC}
${IDEAL_COMPANY_EXT_SRC}
${SCAM_JOB_LISTINGS_SRC}
${WORKPLACE_CIRCLE_SRC}
${PROJECT_WORK_OPS_SRC}
${EXTENSIONS_BATCH3_SRC}
${EXTENSIONS_BATCH4_SRC}
${LIFE_CREATION_SRC}
${NETWORK_PANEL_SRC}
${SELF_EMPLOY_SRC}
${SPOUSE_FINANCE_SRC}
${FERTILITY_SYSTEM_SRC}
${MENSTRUAL_CYCLE_SRC}
${STARTER_JOB_SRC}
${CAMPUS_RECRUITMENT_SRC}
${AUTO_LIFE_SRC}
renderSlotGrid();
syncPlayerSchoolEdu();
bindRefCatJumpClicks();
renderRefPanel();
applyCasinoOddsLabels();
</script>
</body>
</html>`;

fs.writeFileSync('career-stock-game.html', html, 'utf8');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Built', (fs.statSync('career-stock-game.html').size/1024).toFixed(1)+' KB', '+ index.html');
