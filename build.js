const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const REAL_CO = require('./real-companies.js');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>职业股市 · 30年人生模拟</title>
<style>
  :root { --bg:#0d1117;--panel:#161b22;--border:#30363d;--text:#e6edf3;--muted:#8b949e;--green:#3fb950;--red:#f85149;--blue:#58a6ff;--yellow:#d29922;--accent:#a371f7;--orange:#f0883e; }
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:var(--bg);color:var(--text);line-height:1.5}
  header{background:linear-gradient(135deg,#1a1f35,#0d1117);border-bottom:1px solid var(--border);padding:8px 16px}
  .header-row{display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap}
  header h1{font-size:1.05rem;margin:0;white-space:nowrap;line-height:1.3} header h1 span{color:var(--accent)}
  .stats-bar{display:flex;flex-wrap:wrap;gap:10px 12px;font-size:.82rem;flex:1;align-items:flex-end}
  .stat-prog{min-width:0}
  .stat-prog-mort .prog-track{width:88px}
  .stat-prog-sav{min-width:168px}
  .stat-prog-sav .prog-track{width:156px}
  .stat-prog value{display:block;font-size:.68rem;color:var(--text);margin-bottom:2px}
  .prog-track{position:relative;height:8px;background:var(--bg);border-radius:4px;border:1px solid var(--border);overflow:visible}
  .prog-fill{height:100%;border-radius:3px;transition:width .3s ease;min-width:0}
  .prog-fill.mortgage{background:linear-gradient(90deg,#388bfd,#3fb950)}
  .prog-fill.savings{background:linear-gradient(90deg,#9e6a03,#d29922,#3fb950)}
  .milestone-row{position:relative;height:18px;margin-top:1px;width:156px}
  .milestone-mark{position:absolute;transform:translateX(-50%);text-align:center;font-size:.58rem;line-height:1;white-space:nowrap}
  .milestone-mark .tick{width:2px;height:4px;background:var(--border);margin:0 auto 1px;border-radius:1px}
  .milestone-mark.reached .tick{background:var(--yellow)}
  .milestone-mark.reached{color:var(--yellow)}
  .milestone-mark:not(.reached){color:var(--muted);opacity:.5}
  .stat label{color:var(--muted);font-size:.68rem;display:block}
  .stat value{font-weight:600;font-variant-numeric:tabular-nums}
  .stat value.money{color:var(--green)} .stat value.cash{color:var(--blue)} .stat value.stress{color:var(--red)}
  .stress-track{width:56px;height:5px;background:var(--bg);border-radius:3px;margin-top:2px;overflow:hidden}
  .stress-fill{height:100%;background:var(--red)}
  main{display:grid;grid-template-columns:280px 200px 1fr 250px;gap:0;height:calc(100vh - 96px)}
  @media(max-width:1200px){main{grid-template-columns:1fr 1fr;height:auto}}
  .ref-panel,.sidebar,.log-panel{background:var(--panel);border-right:1px solid var(--border);overflow-y:auto;padding:10px;font-size:.8rem}
  .ref-panel{font-size:.78rem;display:flex;flex-direction:column;gap:14px}
  .ref-hdr{font-size:.95rem;font-weight:600;line-height:1.3}
  .ref-sub{font-size:.68rem;color:var(--muted);line-height:1.4;margin-top:-8px}
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
  .ref-content h3{font-size:.9rem;margin-bottom:6px}
  .ref-row{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid var(--border);gap:8px}
  .ref-row label{color:var(--muted);flex-shrink:0}
  .ref-rationale{margin-top:8px;padding:8px;background:var(--bg);border-radius:6px;font-size:.72rem;color:var(--muted);line-height:1.55}
  .job-treemap{display:flex;flex-direction:column;gap:10px}
  .industry-block{background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:8px;display:flex;flex-direction:column}
  .industry-hdr{font-weight:700;font-size:.82rem;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center}
  .industry-inner{display:flex;flex-wrap:wrap;gap:5px;align-content:flex-start;max-height:420px;overflow-y:auto}
  .actions-sticky{position:sticky;bottom:0;background:var(--bg);border-top:1px solid var(--border);padding:10px 0;margin-top:8px;z-index:5}
  .job-tile{border:1px solid rgba(255,255,255,.08);border-radius:6px;padding:6px;cursor:pointer;min-width:72px;min-height:52px;display:flex;flex-direction:column;justify-content:space-between;transition:border-color .15s}
  .job-tile:hover{border-color:var(--blue)} .job-tile.selected{outline:2px solid var(--accent)} .job-tile.multi-selected{outline:2px solid var(--yellow)}
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
  .inbox-item,.offer-item{border:1px solid var(--border);border-radius:6px;padding:8px;margin:6px 0;font-size:.78rem;background:var(--bg)}
  .inbox-item.has-reply{border-color:var(--green);box-shadow:0 0 0 1px rgba(63,185,80,.35)}
  .inbox-item.ghost{border-color:var(--muted)}
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
  .save-history-panel{margin-top:10px;padding:10px;background:var(--bg);border:1px solid var(--border);border-radius:8px;max-height:220px;overflow-y:auto;text-align:left}
  .save-entry{padding:8px;margin-bottom:6px;border:1px solid var(--border);border-radius:6px;font-size:.78rem;line-height:1.45}
  .save-entry.victory{border-color:rgba(63,185,80,.45)}
  .save-entry.tragedy{border-color:rgba(248,81,73,.35)}
  .save-entry .save-meta{color:var(--muted);font-size:.7rem}
  .save-entry b{font-size:.82rem}
  .intro-tip{background:rgba(88,166,255,.08);border:1px solid rgba(88,166,255,.25);border-radius:8px;padding:9px;margin-bottom:10px;font-size:.8rem;color:var(--muted)}
  .offer-box{background:var(--bg);border:1px dashed var(--border);border-radius:6px;padding:8px;margin:6px 0}
  .emp-card{background:rgba(63,185,80,.08);border:1px solid rgba(63,185,80,.3);border-radius:8px;padding:9px;margin-bottom:10px;font-size:.82rem}
  .apply-method,.gamble-panel{background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:9px;margin:6px 0}
  .method-row{display:flex;align-items:center;gap:5px;margin:4px 0;cursor:pointer;flex-wrap:wrap}
  .apply-method select,.gamble-panel select,.gamble-panel input{background:var(--panel);border:1px solid var(--border);color:var(--text);padding:3px 6px;border-radius:4px;font-size:.76rem}
  .cost-hint{color:var(--yellow);font-size:.76rem;margin-top:4px}
  .stock-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);gap:6px;flex-wrap:wrap}
  .stock-chart-wrap{flex:1;min-width:120px;max-width:200px}
  .stock-chart-wrap canvas{width:100%;height:36px;display:block;border-radius:4px;background:rgba(0,0,0,.2)}
  .casino-lobby,.casino-floor{background:linear-gradient(180deg,#0f4d2a,#0a3520);border:1px solid #2d6b45;border-radius:10px;padding:12px;margin:6px 0}
  .chip-cage{padding:10px;background:rgba(0,0,0,.25);border:1px solid rgba(210,153,34,.4);border-radius:8px;margin-bottom:10px}
  .chip-cage-hdr{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:8px;font-size:.8rem}
  .chip-cage-hdr b{color:var(--yellow)}
  .cage-rack{display:flex;flex-wrap:wrap;gap:6px;max-height:120px;overflow-y:auto;padding:4px 0}
  .chip-hand-panel{margin:10px 0;padding:10px;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.1);border-radius:8px;min-height:64px}
  .chip-hand-hdr{font-size:.72rem;color:#b8e0c8;margin-bottom:6px;display:flex;justify-content:space-between}
  .chip-hand{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-end;min-height:48px}
  .chip-hand-empty{color:var(--muted);font-size:.76rem;padding:8px 0}
  .chip-stack{display:inline-flex;flex-direction:column;align-items:center;gap:2px}
  .chip-stack .stack-count{font-size:.62rem;color:var(--yellow);font-weight:700}
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
  .bet-zone{flex:1;min-height:88px;border:2px dashed rgba(255,255,255,.2);border-radius:8px;padding:6px;text-align:center;font-size:.76rem;transition:border-color .15s,background .15s;cursor:pointer}
  .bet-zone:hover,.bet-zone.has-bet{border-color:var(--yellow);background:rgba(210,153,34,.08)}
  .bet-zone.big{border-color:rgba(248,81,73,.45)} .bet-zone.small{border-color:rgba(88,166,255,.45)}
  .bet-zone .zone-label{font-weight:700}
  .zone-chip-pile{min-height:44px;display:flex;flex-wrap:wrap;gap:3px;align-items:center;justify-content:center;margin-top:4px;padding:2px}
  .num-zone-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
  .num-zone{min-height:80px;border:2px solid rgba(255,255,255,.15);border-radius:6px;padding:5px;text-align:center;font-size:.7rem;cursor:pointer}
  .num-zone:hover,.num-zone.has-bet{border-color:var(--yellow);background:rgba(210,153,34,.08)}
  .num-zone .odds{color:#9ecfb0;font-size:.62rem}
  .table-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
  .dice-display{font-size:.9rem;margin:6px 0;color:var(--yellow);text-align:center}
  .dice-sum{font-size:1.05rem;font-weight:700;color:#fff}
  .tabs{display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap}
  .tabs .btn{padding:4px 10px;font-size:.75rem} .tabs .btn.active{background:var(--blue);border-color:var(--blue);color:#fff}
</style>
</head>
<body>

<div id="startOverlay" class="overlay">
  <div class="modal">
    <h2>职业股市 · 人生模拟</h2>
    <p><strong>通关目标：</strong>30年内还清房贷，与伴侣在自己的房中安度晚年。存款超50万可生育（月支出升至2万，维持18年）。各类落魄结局：出租屋孤独终老、离异子女讨钱、伤残尸体无人知、流浪桥洞冻死……</p>
    <p>学历：<select id="playerEduSelect" onchange="syncPlayerSchoolEdu()" style="background:var(--bg);color:var(--text);border:1px solid var(--border);padding:4px 8px;border-radius:4px">
      <option value="高中/中专">高中/中专</option><option value="大专">大专</option>
      <option value="本科" selected>本科</option><option value="硕士">硕士</option><option value="博士">博士</option>
    </select>
    <span id="schoolSelectWrap">院校：<select id="playerSchoolSelect" onchange="syncPlayerSchoolEdu()" style="background:var(--bg);color:var(--text);border:1px solid var(--border);padding:4px 8px;border-radius:4px">
      <option value="normal">普通高校</option>
      <option value="985">985/211（擅长中企）</option>
      <option value="c9">C9/常春藤（擅长大企）</option>
    </select></span></p>
    <p id="schoolEduHint" style="font-size:.78rem;color:var(--muted);margin:-6px 0 10px"></p>
    <p>昵称 <input type="text" id="playerNameInput" maxlength="16" placeholder="本地取名，仅保存在本机浏览器" style="background:var(--bg);color:var(--text);border:1px solid var(--border);padding:4px 8px;border-radius:4px;width:200px"></p>
    <p style="font-size:.85rem;color:var(--muted)">30岁开局。约一万家企业：大型100·中型900·小型9000；等级分头部/重点/草根（与规模无关）。内推录取看等级，不看规模。</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">
      <button class="btn btn-primary" onclick="startGame()">开始人生模拟</button>
      <button class="btn" type="button" onclick="toggleSaveHistory()">本地存档 (<span id="saveCount">0</span>)</button>
    </div>
    <div id="saveHistoryPanel" class="save-history-panel" style="display:none">
      <div style="font-size:.72rem;color:var(--muted);margin-bottom:6px">终局或重开时自动记录 · 仅存本机</div>
      <div id="saveHistoryList"></div>
      <button class="btn" type="button" style="margin-top:6px" onclick="clearSaveHistory()">清空全部存档</button>
    </div>
  </div>
</div>

<div id="endOverlay" class="overlay hidden">
  <div class="modal" id="endModal"><h2 id="endTitle">人生终局</h2><p id="endSummary"></p><div class="final-stats" id="finalStats"></div>
  <button class="btn btn-primary" onclick="replayGame()">再来一局</button></div>
</div>

<header>
  <div class="header-row">
    <h1>职业<span>股市</span> · 30年模拟</h1>
    <div class="stats-bar">
      <div class="stat"><label>年龄</label><value id="statAge">30岁</value></div>
      <div class="stat"><label>日期</label><value id="statDate">2024-01-07</value></div>
      <div class="stat"><label>周数</label><value id="statWeek">1/1560</value></div>
      <div class="stat"><label>婚姻</label><value id="statMarriage">已婚</value></div>
      <div class="stat"><label>现金</label><value class="cash" id="statCash">¥0</value></div>
      <div class="stat"><label>累计收入</label><value class="money" id="statMoney">¥0</value></div>
      <div class="stat"><label>月支出</label><value id="statMonthly">¥11000</value></div>
      <div class="stat"><label>压力</label><value class="stress" id="statStress">0</value><div class="stress-track"><div class="stress-fill" id="stressBar"></div></div></div>
      <div class="stat"><label>状态</label><value id="statLife">正常</value></div>
      <div class="stat"><label>房贷</label><value id="statMortgage">0/360月</value></div>
      <div class="stat"><label>家庭</label><value id="statFamily">无孩</value></div>
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
  </div>
</header>

<main>
  <aside class="ref-panel" id="refPanel">
    <div>
      <div class="ref-hdr">中国就业市场</div>
      <div class="ref-sub">242个职业 · 方块面积=就业人数 · 颜色=AI影响（0–10）</div>
    </div>
    <div id="refNational"></div>
    <div id="refJobDetail" class="ref-job-detail ref-content" style="display:none"></div>
  </aside>
  <aside class="sidebar">
    <div class="panel-title">筛选职业</div>
    <input type="text" id="searchInput" placeholder="搜索..." oninput="renderJobs()" style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);padding:5px 8px;border-radius:6px;margin-bottom:6px">
    <div id="categoryList"></div>
    <div class="tabs" id="sortBtns">
      <button class="btn active" data-sort="heat" onclick="setSort('heat')">热度</button>
      <button class="btn" data-sort="pay" onclick="setSort('pay')">薪资</button>
      <button class="btn" data-sort="exposure" onclick="setSort('exposure')">AI</button>
    </div>
    <div class="life-panel" id="lifePanel"></div>
    <div class="panel-title">持仓股票</div>
    <div id="portfolioPanel" style="font-size:.76rem;color:var(--muted)">暂无持仓</div>
  </aside>

  <section class="center">
    <div class="intro-tip" id="actionTip"></div>
    <div class="emp-card" id="empCard" style="display:none"></div>
    <div class="tabs" id="mainTabs">
      <button class="btn active" onclick="showTab('job')">求职</button>
      <button class="btn" onclick="showTab('stock')">炒股</button>
      <button class="btn" onclick="showTab('gamble')">赌博</button>
    </div>
    <div id="tabJob">
      <div class="detail-panel" id="detailPanel" style="display:none">
        <h3 id="detailTitle"></h3>
        <div id="detailMeta" style="color:var(--muted);margin-bottom:5px;font-size:.8rem"></div>
        <canvas id="detailChart" width="600" height="90" style="width:100%;max-width:600px;height:90px"></canvas>
        <div id="probSection">
          <div class="prob-meter prob-hidden" id="probResumeRow"><span>简历过关</span><div class="prob-track"><div class="prob-fill" id="resumeProbBar"></div></div><span id="resumeProbText"></span></div>
          <div class="prob-meter prob-hidden" id="probInterviewRow"><span>面试成功</span><div class="prob-track"><div class="prob-fill" id="interviewProbBar"></div></div><span id="interviewProbText"></span></div>
          <div class="prob-meter prob-hidden" id="probReferralRow"><span>内推概率</span><div class="prob-track"><div class="prob-fill" id="referralProbBar"></div></div><span id="referralProbText"></span></div>
          <div id="probLockedHint" style="font-size:.75rem;color:var(--muted)">累计100次简历未通过后显示概率（当前 <span id="resumeFailCount">0</span>/100）</div>
        </div>
      </div>
      <div class="apply-method" id="applyMethodPanel">
        <div style="font-weight:600;margin-bottom:4px">① 先选应聘渠道（付费后抽取本期招聘）</div>
        <label class="method-row"><input type="radio" name="applyMethod" value="market" onchange="onApplyConfigChange()"> 线下人才市场 ¥200</label>
        <label class="method-row"><input type="radio" name="applyMethod" value="app" checked onchange="onApplyConfigChange()"> 招聘APP（多选，每个¥100，最高¥500）</label>
        <div id="appCheckboxes" style="margin-left:16px">
          <label class="method-row"><input type="checkbox" name="appPick" value="boss" checked onchange="onApplyConfigChange()"> BOSS直聘 <span style="color:var(--muted)">优选脑力·头部/重点</span></label>
          <label class="method-row"><input type="checkbox" name="appPick" value="lagou" checked onchange="onApplyConfigChange()"> 拉勾网 <span style="color:var(--muted)">优选互联网·脑力</span></label>
          <label class="method-row"><input type="checkbox" name="appPick" value="liepin" onchange="onApplyConfigChange()"> 猎聘 <span style="color:var(--muted)">优选高管·头部</span></label>
          <label class="method-row"><input type="checkbox" name="appPick" value="zhilian" onchange="onApplyConfigChange()"> 智联招聘 <span style="color:var(--muted)">优选中小·体力</span></label>
          <label class="method-row"><input type="checkbox" name="appPick" value="51job" onchange="onApplyConfigChange()"> 前程无忧 <span style="color:var(--muted)">优选基层·中小</span></label>
        </div>
        <label class="method-row" id="headhunterMethodRow"><input type="radio" name="applyMethod" value="headhunter" id="headhunterRadio" onchange="onApplyConfigChange()"> 猎头（入职成功收年薪20%） <span id="headhunterLockHint" style="font-size:.72rem"></span></label>
        <label class="method-row" id="referralMethodRow" style="display:none"><input type="radio" name="applyMethod" value="referral" onchange="onApplyConfigChange()"> 内推（本周偶遇机会）</label>
        <div class="cost-hint" id="applyCostHint">简历费按渠道收取；面试费：普通¥0 / 专家¥100 / 总监¥200</div>
      </div>
      <div class="detail-panel" id="inboxPanel" style="display:none">
        <div class="panel-title">📬 招聘回复 · 选择面试</div>
        <div id="inboxList"></div>
      </div>
      <div class="detail-panel" id="offersPanel" style="display:none">
        <div class="panel-title">📋 待接 Offer <span id="wolfBadge" class="wolf-badge"></span></div>
        <div id="offersList"></div>
      </div>
      <div class="legend">
        <span><i style="background:rgba(63,185,80,.7)"></i>AI低</span>
        <span><i style="background:rgba(210,153,34,.7)"></i>AI中</span>
        <span><i style="background:rgba(248,81,73,.7)"></i>AI高</span>
        <span>方块大小≈就业人数</span>
      </div>
      <p style="font-size:.72rem;color:var(--muted);margin-bottom:6px">每行业一大块 · 热度=100+就业前景% · 多选后选渠道投递</p>
      <div class="job-treemap" id="jobTreemap"></div>
      <div class="actions actions-sticky">
        <button class="btn btn-primary" id="btnApply" onclick="startApplyFlow()" disabled title="请先点击上方职业方块（可多选）">查看本期招聘</button>
        <button class="btn" id="btnStay" onclick="stayWeek()" disabled>坚守本周</button>
        <button class="btn" id="btnWait" onclick="waitWeek()" disabled>观望一周</button>
        <button class="btn btn-success" id="btnNext" onclick="nextWeek()" disabled>进入下周 →</button>
        <span id="applyPickHint" style="display:block;font-size:.72rem;color:var(--muted);margin-top:4px"></span>
      </div>
    </div>
    <div id="applyModal" class="overlay hidden">
      <div class="modal wide">
        <h2 id="applyModalTitle">本期招聘 · 勾选投递</h2>
        <p id="applyModalDesc"></p>
        <div style="margin:6px 0;font-size:.78rem">
          <button class="btn" type="button" onclick="toggleAllListings(true)">全选</button>
          <button class="btn" type="button" onclick="toggleAllListings(false)">全不选</button>
          <span id="listingPickCount" style="color:var(--muted);margin-left:8px"></span>
        </div>
        <div class="modal-list" id="applyModalList"></div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-primary" id="btnConfirmApply" onclick="confirmBatchApply()">投递选中岗位</button>
          <button class="btn" onclick="closeApplyModal()">放弃本期</button>
        </div>
      </div>
    </div>
    <div id="tabStock" style="display:none">
      <div class="finance-panel">
        <p style="color:var(--muted);margin-bottom:8px">A股真实标的（参考市价），佣金万分之2。股价围绕参考价波动。</p>
        <div id="stockList"></div>
      </div>
    </div>
    <div id="tabGamble" style="display:none">
      <div id="casinoLobby" class="casino-lobby">
        <p style="color:var(--muted);margin-bottom:8px">三颗骰子猜大小与点数，庄家抽成5%，围骰通杀。须先兑筹码再上赌桌，离桌前请把筹码换回人民币。</p>
        <button class="btn btn-warn" id="btnEnterCasino" onclick="enterCasino()">澳门五日游 · ¥2000</button>
        <div class="cost-hint">点击出发，占用一整周 · 场内另用筹码下注</div>
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
        <div class="chip-hand-panel">
          <div class="chip-hand-hdr"><span>手中筹码 · 点选后押入赌区</span><span id="selectedChipHint">未选中</span></div>
          <div class="chip-hand" id="chipHand"></div>
        </div>
        <div class="dice-table">
          <div class="dice-arena" id="diceArena">
            <div class="die" id="die1"></div>
            <div class="die" id="die2"></div>
            <div class="die" id="die3"></div>
          </div>
          <div id="diceResult" class="dice-display"></div>
          <div style="font-size:.72rem;color:#9ecfb0;margin-bottom:4px">大小区</div>
          <div class="bet-zones-row">
            <div class="bet-zone small" data-zone="small" onclick="placeTableBet('small')"><div class="zone-label">小 4–10</div><div class="zone-chip-pile" id="pileSmall"></div></div>
            <div class="bet-zone big" data-zone="big" onclick="placeTableBet('big')"><div class="zone-label">大 11–17</div><div class="zone-chip-pile" id="pileBig"></div></div>
          </div>
          <div style="font-size:.72rem;color:#9ecfb0;margin:8px 0 4px">数字区（围骰通杀）</div>
          <div class="num-zone-grid">
            <div class="num-zone" data-zone="4" onclick="placeTableBet('4')"><b>4/17</b><div class="odds">1:50</div><div class="zone-chip-pile" id="pile4"></div></div>
            <div class="num-zone" data-zone="5" onclick="placeTableBet('5')"><b>5/16</b><div class="odds">1:18</div><div class="zone-chip-pile" id="pile5"></div></div>
            <div class="num-zone" data-zone="6" onclick="placeTableBet('6')"><b>6/15</b><div class="odds">1:14</div><div class="zone-chip-pile" id="pile6"></div></div>
            <div class="num-zone" data-zone="7" onclick="placeTableBet('7')"><b>7/14</b><div class="odds">1:12</div><div class="zone-chip-pile" id="pile7"></div></div>
            <div class="num-zone" data-zone="8" onclick="placeTableBet('8')"><b>8/13</b><div class="odds">1:8</div><div class="zone-chip-pile" id="pile8"></div></div>
            <div class="num-zone" data-zone="9" onclick="placeTableBet('9')"><b>9–12</b><div class="odds">1:6</div><div class="zone-chip-pile" id="pile9"></div></div>
          </div>
        </div>
        <div class="table-actions">
          <button class="btn btn-warn" id="btnRollDice" onclick="rollCasinoTable()">开盅</button>
          <button class="btn" onclick="clearTableBets()">收回桌面筹码</button>
          <button class="btn btn-primary" id="btnLeaveCasino" onclick="leaveCasino()">离桌结款 · 进入下周</button>
        </div>
      </div>
    </div>
  </section>

  <aside class="log-panel"><div class="panel-title">人生日志</div><div id="gameLog"></div></aside>
</main>

<script>
const RAW_DATA = ${JSON.stringify(data)};
const REAL_COMPANIES = ${JSON.stringify(REAL_CO)};
const TOTAL_WEEKS = 30 * 52;
const START_DATE = new Date(2024, 0, 1);
const HISTORY_LEN = 52;
const WEEKS_PER_MONTH = 4;
const EDU_RANK = {'初中及以下':1,'高中/中专':2,'大专':3,'本科':4,'硕士':5,'博士':6};
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
const ROLE_EXTRA = {intern:'实习',temp:'临时工'};
const JOB_APPS = {boss:'BOSS直聘',zhilian:'智联招聘','51job':'前程无忧',lagou:'拉勾网',liepin:'猎聘'};
const APP_COST_EACH = 100;
const APP_COST_MAX = 500;
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
const WOLF_OFFER_EXPIRES = 100;
const STARTING_CASH = 20000;
const MORTGAGE_MONTHS = 360;
const MORTGAGE_PAYMENT = 6000;
const CHILD_TRIGGER_CASH = 500000;
const SAVINGS_BAR_MAX = 100000000;
const SAVINGS_LOG_MIN = 10000;
const SAVINGS_MILESTONES = [
  {amt:500000,icon:'👶',label:'婴儿'},
  {amt:3000000,icon:'🏠',label:'一套房'},
  {amt:10000000,icon:'🏝️',label:'小岛'},
  {amt:50000000,icon:'🏢',label:'大楼'},
  {amt:100000000,icon:'👍',label:'大拇指'}
];
const AFFAIR_CASH_THRESHOLD = 1000000;
const AFFAIR_MARRIED_WEEKS = 7 * 52;
const LS_PLAYER_NAME = 'csg_player_name_v1';
const LS_SAVE_HISTORY = 'csg_save_history_v1';
const CHILD_RAISING_MONTHS = 216;
const CHILD_LIVING_COST = 20000;
const MANUAL_CATS = ['农林牧渔','制造业','建筑工程','交通运输','餐饮住宿','个人与生活服务'];
const START_AGE = 30;
const MAX_SALARY = 10000000;
const PAY_MULT_RANGES={
  high:{high:[10,100],mid:[5,25],low:[2,6]},
  mid:{high:[3,12],mid:[0.85,1.2],low:[0.25,0.65]},
  low:{high:[1.2,4],mid:[0.12,0.35],low:[0.05,0.12]}
};
const SCHOOL_TIER_FACTOR = {
  none:{high:0.0001,mid:0.001,low:1},
  normal:{high:0.01,mid:0.1,low:1},
  '985':{high:0.01,mid:0.1,low:1},
  c9:{high:0.1,mid:1,low:10}
};
const EDU_SCHOOL_ALLOW = {
  '高中/中专':[],
  '大专':['normal','985'],
  '本科':['normal','985','c9'],
  '硕士':['normal','985','c9'],
  '博士':['normal','985','c9']
};
const EDU_SCHOOL_HINT = {
  '高中/中专':'高中/中专：无需选择院校',
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
  '高中/中专':{high:0.0001,mid:0.001,low:1}
};
const IMP_APPLY_FACTOR = {low:1,mid:0.1,high:0.01};
const AGE_LIMIT_CAT = {'信息技术':40,'文化传媒':38,'金融':42,'制造业':45,'销售零售与电商':38};
const HIRE_VS_REFERRAL = 0.35;
const INTERVIEW_COST = {low:0,mid:100,high:200};
const WELFARE_BY_TIER = {
  high:{hours:'9:00-21:00弹性',ot:'加班常态化',leave:'年假15天+带薪病假',ins:'六险二金+补充医疗',meal:'免费三餐+班车',bonus:'年终奖3-8薪'},
  mid:{hours:'9:00-18:30',ot:'周末偶尔加班',leave:'年假10天',ins:'五险一金',meal:'午餐补贴',bonus:'年终奖1-3薪'},
  low:{hours:'轮班/不定时',ot:'加班费不稳定',leave:'法定最低',ins:'五险（部分缺失）',meal:'无',bonus:'看老板心情'}
};
const HOUSE_EDGE = 0.05;
const MACAU_ENTRY = 2000;
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
const BET_ZONES = ['big','small','4','5','6','7','8','9'];
let casinoRolling = false;
const DICE_SUM_WAYS = {3:1,4:3,5:6,6:10,7:15,8:21,9:25,10:27,11:27,12:25,13:21,14:15,15:10,16:6,17:3,18:1};

let game=null,selectedIdx=-1,selectedJobIdxs=new Set(),applyCategoryPicks=new Set(),currentSort='heat',currentCategory='全部',actionDone=false,currentTab='job',applyModalStep=0,pendingBatch=null;

function seededRand(seed){let s=Math.abs(seed)||1;return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}}
function shuffleArr(arr,rng){const r=rng||Math.random;for(let i=arr.length-1;i>0;i--){const j=Math.floor(r()*(i+1));const t=arr[i];arr[i]=arr[j];arr[j]=t}return arr}
function hashStr(s){let h=0;for(let i=0;i<s.length;i++)h=((h<<5)-h)+s.charCodeAt(i)|0;return Math.abs(h)}

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
      pool.push(...tierList.slice(0,need));
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
    const co={id:'co_'+i,name,tier,scale,primaryCategory:catInfo.primaryCategory,categories:catInfo.categories,headcount};
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
const REF_EDU_GROUPS=[{label:'初中及以下',match:['初中及以下']},{label:'高中/中专',match:['高中/中专']},{label:'大专',match:['大专']},{label:'本科',match:['本科']},{label:'硕士及以上',match:['硕士','博士']}];
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
function payMultForOffer(tier,importance,seed){
  const r=seededRand(seed)();
  const rng=PAY_MULT_RANGES[tier][importance];
  return rng[0]+(rng[1]-rng[0])*r;
}

function initStocks(){
  const listed=REAL_COMPANIES.LISTED_STOCKS||[];
  const pick=shuffleArr([...listed],seededRand(2024)).slice(0,Math.min(24,listed.length));
  return pick.map(s=>{
    const ref=s.price, hist=[];
    let p=ref;
    for(let i=0;i<40;i++){
      p=Math.max(ref*.88,Math.min(ref*1.12,p*(1+(Math.random()-.5)*.028)));
      hist.push(p);
    }
    return {
      symbol:s.code,id:'stk_'+s.code,name:s.name,category:s.category,
      price:p,prevPrice:hist[hist.length-2]||p,refPrice:ref,history:hist
    };
  });
}

function initCategoryTrends(){const t={};[...new Set(RAW_DATA.map(j=>j.category))].forEach(c=>t[c]=[]);return t}

function getStoredPlayerName(){
  try{return localStorage.getItem(LS_PLAYER_NAME)||''}catch(e){return ''}
}
function setStoredPlayerName(name){
  try{localStorage.setItem(LS_PLAYER_NAME,(name||'').trim())}catch(e){}
}
function getSaveHistory(){
  try{return JSON.parse(localStorage.getItem(LS_SAVE_HISTORY)||'[]')}catch(e){return []}
}
function setSaveHistory(list){
  try{localStorage.setItem(LS_SAVE_HISTORY,JSON.stringify(list))}catch(e){}
}
function refreshSaveHistoryUI(){
  const list=getSaveHistory();
  const cnt=document.getElementById('saveCount');
  if(cnt)cnt.textContent=String(list.length);
  const box=document.getElementById('saveHistoryList');
  if(!box)return;
  if(!list.length){box.innerHTML='<div style="color:var(--muted);font-size:.78rem">暂无存档，完成一局或点「再来一局」后会自动保存</div>';return}
  box.innerHTML=list.map(s=>{
    const cls=s.endingType==='victory'||s.endingType==='victory_early'?'victory':(s.endingType==='incomplete'?'':'tragedy');
    return '<div class="save-entry '+cls+'"><b>'+s.playerName+'</b> · '+s.endingTitle+
      '<div class="save-meta">'+s.savedAt+' · '+s.reason+' · '+s.education+'（'+s.school+'） · '+
      s.year+'年'+s.age+'岁 · 第'+s.weeks+'周</div>'+
      '<div>现金 ¥'+(s.cash||0).toLocaleString()+' · 累计 ¥'+(s.money||0).toLocaleString()+
      ' · 房贷 '+s.mortgage+' · 入职'+s.hires+'次 · 被裁'+s.layoffs+'次</div></div>';
  }).join('');
}
function toggleSaveHistory(){
  const p=document.getElementById('saveHistoryPanel');
  if(!p)return;
  const show=p.style.display==='none';
  p.style.display=show?'block':'none';
  if(show)refreshSaveHistoryUI();
}
function clearSaveHistory(){
  if(!confirm('确定清空本机全部存档？'))return;
  setSaveHistory([]);
  refreshSaveHistoryUI();
}
function archiveGameSave(reason){
  if(!game)return;
  const name=(game.playerName||getStoredPlayerName()||'匿名').trim()||'匿名';
  let endingTitle='中途重开', endingType=game.endingType||'incomplete';
  if(game.gameOver){
    const e=determineEnding();
    endingTitle=e.title;
    endingType=e.type;
  }else if(reason==='restart')endingTitle='中途重开（第'+game.week+'周）';
  const rec={
    id:Date.now(),playerName:name,
    savedAt:new Date().toLocaleString('zh-CN',{hour12:false}),
    reason:reason==='ending'?'终局':'重开',
    endingTitle,endingType,
    education:game.playerEducation,
    school:schoolLabelFor(game.playerSchool),
    age:getPlayerAge(),year:getYear(game.week),weeks:game.week,
    cash:game.cash,money:game.money,
    mortgage:game.mortgagePaidOff?'已还清':game.mortgagePaymentsMade+'/'+MORTGAGE_MONTHS,
    layoffs:game.layoffs||0,hires:game.successfulHires||0,
    married:game.divorced?'离异':game.married?'已婚':'单身',
    children:game.hasChildren?'是':'否'
  };
  const list=getSaveHistory();
  list.unshift(rec);
  if(list.length>80)list.length=80;
  setSaveHistory(list);
  refreshSaveHistoryUI();
}
function replayGame(){
  if(game&&!game._archived)archiveGameSave('restart');
  location.reload();
}
function initPlayerProfile(){
  const inp=document.getElementById('playerNameInput');
  if(inp)inp.value=getStoredPlayerName();
  refreshSaveHistoryUI();
}

function getPlayerSchoolFromUI(){
  const edu=document.getElementById('playerEduSelect').value;
  if(edu==='高中/中专')return 'none';
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
  if(edu==='高中/中专'){
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

function startGame(){
  syncPlayerSchoolEdu();
  const eduSel=document.getElementById('playerEduSelect');
  const schSel=document.getElementById('playerSchoolSelect');
  const edu=eduSel.value;
  const school=getPlayerSchoolFromUI();
  if(edu!=='高中/中专'&&!(EDU_SCHOOL_ALLOW[edu]||[]).includes(school)){
    alert('请先选学历，再选符合的院校：'+(EDU_SCHOOL_HINT[edu]||''));
    return;
  }
  const nameInp=document.getElementById('playerNameInput');
  const playerName=((nameInp&&nameInp.value)||'').trim()||'匿名';
  setStoredPlayerName(playerName);
  if(game&&!game.gameOver&&!game._archived)archiveGameSave('restart');
  document.getElementById('startOverlay').classList.add('hidden');
  const market=initMarket(RAW_DATA);
  const corp=initCompanyUniverse(market);
  game={
    week:0,money:0,cash:STARTING_CASH,employed:false,
    playerName:playerName,playerEducation:edu,playerSchool:school,_archived:false,
    employment:null,industryExperience:{},careerHistory:[],
    employedWeeks:0,switches:0,layoffs:0,totalApplications:0,successfulHires:0,failedApplications:0,
    jobHuntSpent:0,headhunterDebt:0,longestStreak:0,currentStreak:0,
    familyStress:0,familyPressureEvents:0,stressMultiplier:1,
    married:true,divorced:false,marriedWeeks:0,affairActive:false,affairTriggered:false,monthsUnderpaid:0,
    ownsHome:true,mortgagePaymentsMade:0,mortgagePaidOff:false,
    hasChildren:false,childRaisingMonthsLeft:0,
    livingOffParents:false,parentsSupportMonthsLeft:120,
    onWelfare:false,disabled:false,welfareMonths:0,welfareUnderpaidMonths:0,
    homeless:false,homelessMonths:0,
    gameWon:false,endingType:null,gameOver:false,
    macroUnemployment:.052,prevMacroUnemployment:.052,layoffSeason:0,
    log:[],market,categoryPriceHistory:initCategoryTrends(),
    companyAll:corp.all,companyById:corp.byId,jobCompanies:corp.jobCompanies,companyStats:corp.stats,
    stocks:initStocks(),portfolio:{},stockSpent:0,gambleSpent:0,gambleCount:0,
    casinoActive:false,chipHand:emptyChipMap(),selectedChipDenom:null,tableBets:emptyTableBets(),
    applications:[],inbox:[],offers:[],appliedCategories:{},resumeFailCount:0,showProbabilities:false,
    wolfAchievement:false,expiredOfferCount:0,referralThisWeek:false,usedHeadhunterBatch:false
  };
  selectedJobIdxs=new Set(); applyCategoryPicks=new Set();
  buildCategories(); renderJobs(); renderCasino(); updateUI();
  rollReferralChance();
  const schoolLabel=schoolLabelFor(game.playerSchool);
  const st=corp.stats;
  addLog('2024年，'+START_AGE+'岁的'+game.playerName+'带着 ¥'+STARTING_CASH.toLocaleString()+'、'+game.playerEducation+'（'+schoolLabel+'）出发。','info');
  addLog('劳动力市场：'+st.total+'家企业（大型'+st.byScale.large+'·中型'+st.byScale.medium+'·小型'+st.byScale.small+
    '｜头部'+st.byTier.high+'·重点'+st.byTier.mid+'·草根'+st.byTier.low+'），每职业约'+st.avgPerJob+'个招聘方。','info');
}

function showTab(t){
  currentTab=t;
  document.getElementById('tabJob').style.display=t==='job'?'block':'none';
  document.getElementById('tabStock').style.display=t==='stock'?'block':'none';
  document.getElementById('tabGamble').style.display=t==='gamble'?'block':'none';
  document.querySelectorAll('#mainTabs .btn').forEach(b=>b.classList.toggle('active',b.textContent.includes(t==='job'?'求职':t==='stock'?'炒股':'赌博')));
  if(t==='stock') renderStocks();
}

function buildCategories(){
  const cats=['全部',...new Set(RAW_DATA.map(j=>j.category))];
  document.getElementById('categoryList').innerHTML=cats.map(c=>{
    let cls='cat-btn';
    if(c===currentCategory)cls+=' active';
    if(c!=='全部'&&applyCategoryPicks.has(c))cls+=' apply-pick';
    if(c!=='全部'&&game&&game.appliedCategories[c])cls+=' applied';
    const fn=c==='全部'?'setCategory(\\'全部\\')':'toggleApplyCategory(\\''+c+'\\')';
    return '<button class="'+cls+'" onclick="'+fn+'">'+c+'</button>';
  }).join('');
}
function setCategory(c){currentCategory=c;buildCategories();renderJobs()}
function toggleApplyCategory(c){
  if(applyCategoryPicks.has(c))applyCategoryPicks.delete(c); else applyCategoryPicks.add(c);
  currentCategory=c;
  buildCategories(); renderJobs();
}
function setSort(s){currentSort=s;document.querySelectorAll('#sortBtns .btn').forEach(b=>b.classList.toggle('active',b.dataset.sort===s));renderJobs()}
function getDateStr(week){const d=new Date(START_DATE);d.setDate(d.getDate()+week*7);return d.toLocaleDateString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit'})}
function getYear(week){const d=new Date(START_DATE);d.setDate(d.getDate()+week*7);return d.getFullYear()}
function getPlayerAge(){return START_AGE+Math.floor(game.week/52)}
function getSelectedApps(){
  const m=getApplyMethod();
  if(m!=='app')return [];
  return [...document.querySelectorAll('input[name="appPick"]:checked')].map(e=>e.value);
}
function aiMultiplier(week){const y=getYear(week)-2024;if(y<=0)return .4;if(y<=5)return .4+y*.12;if(y<=15)return 1+(y-5)*.1;return 2+(y-15)*.06}

function calcAnnualPay(job,tier,importance){
  const m=job.pay;
  const mult=payMultForOffer(tier,importance,job.idx*31+(game?game.week:0)*17+tier.charCodeAt(0));
  let pay=Math.round(m*mult);
  if(tier==='high'&&importance==='high')pay=Math.min(MAX_SALARY,Math.max(Math.round(m*10),pay));
  if(tier==='low'&&importance==='low')pay=Math.max(Math.round(m*0.05),Math.min(Math.round(m*0.12),pay));
  return pay;
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
function onApplyConfigChange(){updateHeadhunterOption();updateOfferPreview();updateButtons()}
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
function rollReferralChance(){
  if(!game)return;
  game.referralThisWeek=Math.random()<0.12||getBestHighRole()!==null;
  const row=document.getElementById('referralMethodRow');
  if(row)row.style.display=game.referralThisWeek?'flex':'none';
  updateHeadhunterOption();
}

function getResumeCost(){
  const m=getApplyMethod();
  if(m==='market') return {upfront:200,onSuccess:0,label:'线下人才市场'};
  if(m==='app'){
    const apps=getSelectedApps();
    const n=Math.max(1,apps.length);
    const fee=Math.min(APP_COST_MAX,n*APP_COST_EACH);
    const label=apps.length?apps.map(a=>JOB_APPS[a]).join('+'):'招聘APP';
    return {upfront:fee,onSuccess:0,label,apps:apps.length?apps:['boss']};
  }
  if(m==='referral') return {upfront:0,onSuccess:0,label:'内推',isReferral:true};
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
function canApplyJob(job){if(game.onWelfare&&!game.disabled)return isManualJob(job);return true}

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
  const eduGap=Math.max(0,(EDU_RANK[job.education]||4)-(EDU_RANK[game.playerEducation]||4));
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
  return {company,tier,importance,annualPay,newToIndustry,eduGap,preferSmaller,interviewCost:INTERVIEW_COST[importance]};
}
function buildPositionWelfare(tier,importance,roleExtra){
  const w=WELFARE_BY_TIER[tier];
  const imp=IMP_LABEL[importance];
  let extra=roleExtra==='intern'?' · 实习期1-3月薪资减半':roleExtra==='temp'?' · 周薪结算随时裁':'';
  return '工时'+w.hours+' · '+w.ot+' · '+w.leave+' · '+w.ins+' · '+w.meal+' · '+w.bonus+' · '+imp+'岗'+extra;
}
function seededR(seed){return seededRand(seed)}
function genOpeningsForCompany(job,co,r){
  const openings=[];
  const imps=['low','mid','high'];
  const weights={low:0.8,mid:0.15,high:0.05};
  imps.forEach(imp=>{
    if(r()>weights[imp]+0.15)return;
    const roleExtra=isManualJob(job)?(r()<0.35?'temp':null):(!isManualJob(job)&&imp==='low'&&r()<0.28?'intern':null);
    const pay=roleExtra==='intern'?Math.round(calcAnnualPay(job,co.tier,imp)*0.5):
      roleExtra==='temp'?Math.round(calcAnnualPay(job,co.tier,imp)/52):calcAnnualPay(job,co.tier,imp);
    const startDelay=roleExtra==='temp'?0:r()<0.08?Math.floor(20+r()*8):Math.floor(1+r()*12);
    openings.push({importance:imp,roleExtra,pay,welfare:buildPositionWelfare(co.tier,imp,roleExtra),startDelayWeeks:startDelay,
      planned:r()<0.06});
  });
  if(!openings.length)openings.push({importance:'low',roleExtra:isManualJob(job)&&r()<0.4?'temp':null,
    pay:calcAnnualPay(job,co.tier,'low'),welfare:buildPositionWelfare(co.tier,'low',null),startDelayWeeks:Math.floor(1+r()*8),planned:false});
  return openings;
}
function tierImpGap(offer){
  const eduGap=offer.eduGap||0;
  const tierPen=offer.tier==='high'?2:offer.tier==='mid'?1:0;
  const impPen=IMP_ORDER.indexOf(offer.importance);
  return tierPen+impPen+eduGap;
}
function replyDelayWeeks(tier,importance){
  let d=1+Math.floor(Math.random()*2);
  if(tier==='high')d+=1+Math.floor(Math.random()*2);
  if(importance==='high')d+=1;
  if(importance==='mid')d+=Math.floor(Math.random()*2);
  return d;
}
function getResumeProbability(job,offer,apps){
  let base=job.heatPct>=115?.72:job.heatPct>=108?.6:job.heatPct>=102?.48:job.heatPct>=98?.35:.22;
  if(offer.eduGap>=2)base*=.55; else if(offer.eduGap>=1)base*=.78;
  if(offer.newToIndustry)base*=1.06;
  const m=getApplyMethod();
  if(m==='headhunter')base=Math.min(.88,base*1.2+.1);
  else if(m==='referral')base=Math.min(.85,base*1.35+.15);
  else if(m==='app')base=Math.min(.88,base*getAppChannelMult(job,offer.tier,apps,offer.importance));
  const mod=getHireProbabilityModifiers(offer);
  base*=Math.min(1,mod.combined*2.2);
  const gap=tierImpGap(offer);
  if(gap>=5)base*=.08; else if(gap>=4)base*=.2; else if(gap>=3)base*=.45;
  return Math.min(.88,Math.max(0.002,base));
}
function getInterviewProbability(job,offer,hasReferral){
  let base=getResumeProbability(job,offer,offer.apps)*.85+.18;
  base*=1-game.familyStress*game.stressMultiplier*.003;
  if(game.onWelfare)base*=.75;
  if(hasReferral)base=Math.min(.88,base*1.35+.12);
  return Math.min(.88,Math.max(0.03,base));
}
function drawRecruitmentRound(jobIdxs,resumeCost){
  const listings=[];
  const cats=new Set();
  const method=getApplyMethod();
  const drawSize=CHANNEL_DRAW_SIZE[method]||45;
  const apps=resumeCost.apps||getSelectedApps();
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
  const rng=seededRand(game.week*317+jobIdxs.length);
  candidates.sort((a,b)=>scoreListingForApps(b.job,b.co,'low',apps)-scoreListingForApps(a.job,a.co,'low',apps)+(rng()-0.5)*0.8);
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
        welfare:op.welfare,startDelayWeeks:op.startDelayWeeks,planned:op.planned,
        newToIndustry:!game.industryExperience[job.category],eduGap:Math.max(0,(EDU_RANK[job.education]||4)-(EDU_RANK[game.playerEducation]||4)),
        interviewCost:INTERVIEW_COST[op.importance],apps};
      listings.push({uid:'L'+ji+'_'+co.id+'_'+oi,jobIdx:ji,jobTitle:job.title,category:job.category,offer});
    });
  });
  return {listings,cats,drawSize:picked.length};
}
function renderListingRow(item,checked){
  const o=item.offer;
  const imp=o.roleExtra?IMP_LABEL[o.importance]+'·'+ROLE_EXTRA[o.roleExtra]:IMP_LABEL[o.importance];
  const pay=o.roleExtra==='temp'?'周薪¥'+o.annualPay.toLocaleString():'年薪¥'+o.annualPay.toLocaleString();
  const start=o.planned?'预定·约'+o.startDelayWeeks+'周后':'上岗约'+o.startDelayWeeks+'周内';
  return '<label class="company-row picked"><input type="checkbox" class="listing-pick" data-uid="'+item.uid+'"'+(checked?' checked':'')+' onchange="updateListingPickCount()">'+
    '<div style="flex:1"><b>'+o.company.name+'</b> '+fmtCompanyBadge(o.company)+' · <b>'+imp+'</b><br>'+
    '招：'+item.jobTitle+' · '+pay+' · '+start+' · 面试¥'+(o.interviewCost||0)+'<br>'+
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
    actionDone=true; finishWeek();
  }
  pendingBatch=null;
}
function startApplyFlow(){
  if(!game){addLog('请先点击「开始人生模拟」','fail');return}
  if(actionDone||game.gameOver)return;
  if(game.casinoActive){addLog('在澳门赌桌，无法求职','warn');return}
  if(game.homeless){addLog('流浪中无法求职','fail');return}
  const jobIdxs=getJobsToApply();
  if(!jobIdxs.length){addLog('请多选职业或行业','fail');return}
  for(const ji of jobIdxs){
    const job=game.market[ji];
    if(isOverAgeLimit(job)){addLog('【'+job.category+'】超龄，无法查看 '+job.title+' 相关招聘','fail');return}
    if(!canApplyJob(job)){addLog('低保期间只能应聘体力劳动','fail');return}
  }
  const rc=getResumeCost();
  if(getApplyMethod()==='headhunter'&&!canUseHeadhunter()){addLog('猎头仅限：C9/常春藤学历，或曾任专家/总监岗，或在头部/重点企业任职','fail');return}
  if(getApplyMethod()==='app'&&!getSelectedApps().length){addLog('请至少勾选一个招聘APP','fail');return}
  if(rc.upfront>0&&game.cash<rc.upfront){addLog('现金不足，渠道费需 ¥'+rc.upfront,'fail');return}
  if(rc.upfront>0){game.cash-=rc.upfront;game.jobHuntSpent+=rc.upfront}
  addLog('📋 【'+rc.label+'】支付 ¥'+rc.upfront+'，正在抽取本期招聘…','info');
  let batch;
  try{batch=drawRecruitmentRound(jobIdxs,rc)}
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
  pendingBatch={...batch,resumeCost:rc,method:getApplyMethod(),paid:true,jobIdxs};
  const modal=document.getElementById('applyModal');
  document.getElementById('applyModalTitle').textContent='本期招聘 · 勾选要投的岗位';
  document.getElementById('applyModalDesc').textContent='渠道：'+rc.label+'（已付 ¥'+rc.upfront+'）· 抽取 '+batch.drawSize+' 家企业 · 共 '+batch.listings.length+' 个在招岗位 · 请按企业实际发布勾选';
  document.getElementById('applyModalList').innerHTML=batch.listings.map(item=>renderListingRow(item,true)).join('');
  updateListingPickCount();
  modal.classList.remove('hidden');
}
function confirmBatchApply(){
  if(!pendingBatch||actionDone)return;
  const uids=new Set(getSelectedListingUids());
  if(!uids.size){addLog('请至少勾选一个岗位','fail');return}
  const listings=pendingBatch.listings.filter(item=>uids.has(item.uid));
  const {cats,resumeCost,method}=pendingBatch;
  const viaRef=method==='referral';
  listings.forEach((item,idx)=>{
    const id='app_'+game.week+'_'+idx+'_'+Math.floor(Math.random()*9999);
    const replyIn=replyDelayWeeks(item.offer.tier,item.offer.importance)+(item.offer.planned?item.offer.startDelayWeeks:0);
    game.applications.push({
      id,jobIdx:item.jobIdx,offer:{...item.offer,apps:resumeCost.apps||getSelectedApps(),method},
      status:'pending',applyWeek:game.week,replyWeek:game.week+replyIn,
      interviewWeek:null,resultWeek:null,viaReferral:viaRef,method,resumeCostLabel:resumeCost.label
    });
    game.totalApplications++;
  });
  cats.forEach(c=>{game.appliedCategories[c]=true});
  pendingBatch.submitted=true;
  addLog('📤 【'+resumeCost.label+'】投递 '+listings.length+' 份简历（渠道费已付 ¥'+resumeCost.upfront+'）','info');
  document.getElementById('applyModal').classList.add('hidden');
  pendingBatch=null; actionDone=true; finishWeek();
}
function processApplicationPipeline(){
  if(!game||!game.applications)return;
  const w=game.week;
  game.applications.forEach(app=>{
    if(app.status==='pending'&&w>=app.replyWeek){
      const job=game.market[app.jobIdx], offer=app.offer;
      const gap=tierImpGap(offer);
      if(gap>=6){app.status='silent';game.resumeFailCount++;return}
      const rp=getResumeProbability(job,offer,offer.apps);
      if(Math.random()>=rp){app.status='silent';game.resumeFailCount++;return}
      const ghostRate=app.viaReferral?0.25:0.52;
      if(Math.random()<ghostRate){
        app.status='ghost';
        game.inbox.push({id:app.id,type:'ghost',week:w,jobIdx:app.jobIdx,company:offer.company.name,
          msg:offer.company.name+'：感谢您的投递，如有合适机会我们将通知您面试时间。',offer});
        game.resumeFailCount++;
      }else{
        app.status='interview_invite';
        app.interviewWeek=w+replyDelayWeeks(offer.tier,offer.importance);
        game.inbox.push({id:app.id,type:'interview',week:w,jobIdx:app.jobIdx,company:offer.company.name,
          msg:offer.company.name+' 邀请您面试【'+IMP_LABEL[offer.importance]+'】岗位，请确认是否参加。',offer,attended:false});
      }
    }
    if(app.status==='interview_scheduled'&&app.resultWeek&&w>=app.resultWeek){
      const job=game.market[app.jobIdx], offer=app.offer;
      const ip=getInterviewProbability(job,offer,app.viaReferral);
      if(Math.random()<ip){
        app.status='offered';
        const startW=w+2+Math.floor(Math.random()*3);
        const expW=w+6+Math.floor(Math.random()*6);
        const o={id:app.id,jobIdx:app.jobIdx,offer,startWeek:startW,expireWeek:expW,accepted:false};
        game.offers.push(o);
        game.inbox.push({id:app.id+'_offer',type:'offer',week:w,jobIdx:app.jobIdx,company:offer.company.name,
          msg:offer.company.name+' 恭喜！录用【'+IMP_LABEL[offer.importance]+'】，入职时间 '+getDateStr(startW)+'，Offer有效期至 '+getDateStr(expW),offer});
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
        addLog('🐺 独狼成就！100个Offer过期未接 — 炒股与赌博运气大幅提升','success');
      }
      return false;
    }
    return true;
  });
  if(game.resumeFailCount>=PROB_REVEAL_FAILS)game.showProbabilities=true;
}
function attendInterview(inboxId){
  const item=game.inbox.find(x=>x.id===inboxId&&x.type==='interview'&&!x.attended);
  if(!item)return;
  const app=game.applications.find(a=>a.id===inboxId);
  if(!app||app.status!=='interview_invite')return;
  const fee=item.offer.interviewCost||0;
  if(game.cash<fee){addLog('面试费 ¥'+fee+' 不足','fail');return}
  if(fee>0){game.cash-=fee;game.jobHuntSpent+=fee}
  item.attended=true;
  app.status='interview_scheduled';
  app.resultWeek=game.week+replyDelayWeeks(item.offer.tier,item.offer.importance);
  addLog('🎤 参加 '+item.company+' 面试（'+IMP_LABEL[item.offer.importance]+' ¥'+fee+'）','info');
  renderInbox();
}
function declineInterview(inboxId){
  const item=game.inbox.find(x=>x.id===inboxId);
  if(!item)return;
  const app=game.applications.find(a=>a.id===inboxId);
  if(app)app.status='declined';
  item.attended=true;
  addLog('已放弃 '+item.company+' 面试','info');
  renderInbox();
}
function acceptOffer(offerId){
  const o=game.offers.find(x=>x.id===offerId);
  if(!o||game.week>o.expireWeek)return;
  const app=game.applications.find(a=>a.id===offerId);
  if(app&&app.method==='headhunter'){
    const fee=Math.round(o.offer.annualPay*.2);
    if(game.cash>=fee){game.cash-=fee;game.jobHuntSpent+=fee}else game.headhunterDebt+=fee;
  }
  hirePlayer(o.jobIdx,o.offer,app&&app.viaReferral);
  o.accepted=true;
  game.offers=[];
  addLog('✅ 接受 '+o.offer.company.name+' 的 Offer','success');
  renderOffers();
}
function declineOffer(offerId){
  const o=game.offers.find(x=>x.id===offerId);
  if(!o)return;
  o.accepted=true;
  game.expiredOfferCount++;
  addLog('拒绝 '+o.offer.company.name+' Offer','info');
  renderOffers();
}
function renderInbox(){
  const panel=document.getElementById('inboxPanel'), list=document.getElementById('inboxList');
  const items=game.inbox.filter(x=>x.type==='interview'||x.type==='ghost').slice(-40).reverse();
  if(!items.length){panel.style.display='none';return}
  panel.style.display='block';
  list.innerHTML=items.map(it=>{
    const cls=it.type==='interview'?'inbox-item has-reply':'inbox-item ghost';
    let acts=it.type==='interview'&&!it.attended?
      '<button class="btn" onclick="attendInterview(\\''+it.id+'\\')">参加面试（¥'+(it.offer.interviewCost||0)+'）</button>'+
      '<button class="btn" onclick="declineInterview(\\''+it.id+'\\')">放弃</button>':'';
    return '<div class="'+cls+'"><div>'+it.msg+'</div><div style="color:var(--muted);font-size:.7rem">'+getDateStr(it.week)+'</div>'+acts+'</div>';
  }).join('');
}
function renderOffers(){
  const panel=document.getElementById('offersPanel'), list=document.getElementById('offersList');
  const badge=document.getElementById('wolfBadge');
  if(game.wolfAchievement&&badge)badge.textContent='🐺独狼';
  if(!game.offers.length){panel.style.display='none';return}
  panel.style.display='block';
  list.innerHTML=game.offers.map(o=>{
    const imp=o.offer.roleExtra?IMP_LABEL[o.offer.importance]+'·'+ROLE_EXTRA[o.offer.roleExtra]:IMP_LABEL[o.offer.importance];
    return '<div class="offer-item"><b>'+o.offer.company.name+'</b> · '+imp+' · 年薪¥'+o.offer.annualPay.toLocaleString()+
      '<br>入职 '+getDateStr(o.startWeek)+' · 有效期至 '+getDateStr(o.expireWeek)+
      '<div style="margin-top:4px"><button class="btn btn-primary" onclick="acceptOffer(\\''+o.id+'\\')">接受</button>'+
      '<button class="btn" onclick="declineOffer(\\''+o.id+'\\')">拒绝</button></div></div>';
  }).join('');
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

function getLayoffWaveProbability(emp){
  if(emp.weeksInCompany<20)return 0;
  const job=game.market[emp.jobIdx];
  let base=.0035;
  base*=Math.exp(Math.max(0,game.macroUnemployment-.055)*5);
  if(game.layoffSeason>0)base*=1.8;
  base*=1+job.exposure*.03;
  if(emp.importance==='low')base*=1.35; else if(emp.importance==='high')base*=.4;
  if(emp.weeksInIndustry<26)base*=1.25;
  if(emp.tier==='low'&&emp.importance==='low')base*=2.2;
  if(emp.roleExtra==='temp')base*=3.5;
  return Math.min(.25,base);
}

function resolveLayoff(emp){
  const job=game.market[emp.jobIdx],co=emp.company;
  if(Math.random()<.025+job.exposure*.006+game.macroUnemployment*.35+(game.layoffSeason>0?.05:0))
    return {laidOff:true,reason:co.name+' 整岗裁撤【'+job.title+'】'};
  const impCut={low:.28,mid:.12,high:.04};
  let p=impCut[emp.importance]*Math.exp(Math.max(0,game.macroUnemployment-.055)*4);
  if(Math.random()<Math.min(.6,p))return {laidOff:true,reason:co.name+' 批次裁员（'+IMP_LABEL[emp.importance]+'重要度）'};
  return {laidOff:false,reason:co.name+' 裁员潮中幸存'};
}

function weeklySalary(job,emp){
  const heat=job.heatPct>100?1+(job.heatPct-100)*.004:1-(100-job.heatPct)*.003;
  let base=emp.annualPay||calcAnnualPay(job,emp.tier,emp.importance);
  if(emp.roleExtra==='intern')base=Math.round(base*0.5);
  let vol=1;
  if(emp.roleExtra==='temp'||emp.tier==='low'&&emp.importance==='low')vol=0.7+((game.week+job.idx*3)%20)/35;
  if(emp.roleExtra==='temp')return Math.round(base*heat*vol*(1-game.familyStress*game.stressMultiplier*.0006));
  return Math.round(base/52*heat*vol*(1-game.familyStress*game.stressMultiplier*.0006));
}

function getMonthlyExpenses(){
  if(game.homeless)return {housing:0,living:1000,total:1000,mortgage:0,label:'流浪（桥洞）',isRent:true,affairMult:1};
  if(game.onWelfare)return {housing:1000,living:1000,total:2000,mortgage:0,label:game.disabled?'伤残低保':'低保',isRent:true,affairMult:1};
  if(game.divorced)return {housing:3000,living:3000,total:6000,mortgage:0,label:'离异租房',isRent:true,affairMult:1};
  const mortgage=game.ownsHome&&!game.mortgagePaidOff?MORTGAGE_PAYMENT:0;
  let living=5000;
  if(game.hasChildren&&game.childRaisingMonthsLeft>0)living=CHILD_LIVING_COST;
  let total=mortgage+living;
  let label='自有住房';
  if(game.hasChildren&&game.childRaisingMonthsLeft>0)label='育儿期（'+game.childRaisingMonthsLeft+'月）';
  else if(game.mortgagePaidOff)label='已还清房贷';
  const affairMult=game.affairActive?2:1;
  if(affairMult>1){total*=affairMult;living*=affairMult;mortgage*=affairMult;label+=' · 婚外情（花费×2）'}
  return {housing:mortgage,living,total,mortgage,label,isRent:false,affairMult};
}

function fmtSavingsShort(n){
  if(n>=100000000)return(n/100000000).toFixed(n>=1000000000?1:2).replace(/\\.00$/,'')+'亿';
  if(n>=10000)return Math.round(n/10000)+'万';
  return n.toLocaleString();
}
function savingsLogPct(amt){
  if(amt<=0)return 0;
  const lo=Math.log10(SAVINGS_LOG_MIN), hi=Math.log10(SAVINGS_BAR_MAX);
  if(amt<SAVINGS_LOG_MIN)return amt/SAVINGS_LOG_MIN*((Math.log10(SAVINGS_LOG_MIN)-lo)/(hi-lo)*100);
  return Math.min(100,(Math.log10(amt)-lo)/(hi-lo)*100);
}

function renderHeaderProgress(){
  if(!game)return;
  const mortPct=game.mortgagePaidOff?100:Math.min(100,game.mortgagePaymentsMade/MORTGAGE_MONTHS*100);
  const mortFill=document.getElementById('mortgageProgFill');
  const mortText=document.getElementById('mortgageProgText');
  if(mortFill)mortFill.style.width=mortPct+'%';
  if(mortText)mortText.textContent=game.mortgagePaidOff?'已还清':game.mortgagePaymentsMade+'/'+MORTGAGE_MONTHS+'月';
  const cash=Math.max(0,game.cash);
  const savPct=savingsLogPct(cash);
  const savFill=document.getElementById('savingsProgFill');
  const savText=document.getElementById('savingsProgText');
  if(savFill)savFill.style.width=savPct+'%';
  if(savText)savText.textContent='¥'+fmtSavingsShort(cash);
  const mRow=document.getElementById('milestoneRow');
  if(mRow){
    mRow.innerHTML=SAVINGS_MILESTONES.map(m=>{
      const pct=savingsLogPct(m.amt);
      const reached=cash>=m.amt;
      return '<div class="milestone-mark'+(reached?' reached':'')+'" style="left:'+pct+'%" title="'+m.label+' ¥'+m.amt.toLocaleString()+'">'+
        '<div class="tick"></div>'+m.icon+'</div>';
    }).join('');
  }
}

function checkAffairEvent(){
  if(!game||game.gameOver||game.affairTriggered||game.divorced||!game.married||game.hasChildren||game.homeless)return;
  if(game.cash<AFFAIR_CASH_THRESHOLD)return;
  if(game.marriedWeeks<AFFAIR_MARRIED_WEEKS)return;
  game.affairActive=true;
  game.affairTriggered=true;
  game.familyStress=Math.min(100,game.familyStress+22);
  addLog('💋 结婚已满'+AFFAIR_MARRIED_WEEKS/52+'年仍无子女，存款突破百万，婚外情爆发。此后月支出翻倍。','stress');
}

function syncAffairState(){
  if(game.affairActive&&(game.hasChildren||game.divorced||game.homeless)){
    game.affairActive=false;
    if(game.hasChildren)addLog('👶 有了孩子，婚外情告一段落。','info');
  }
}

function checkChildBirth(){
  if(game.hasChildren||game.divorced||!game.married||game.homeless)return;
  if(game.cash>=CHILD_TRIGGER_CASH){
    game.hasChildren=true;
    game.childRaisingMonthsLeft=CHILD_RAISING_MONTHS;
    syncAffairState();
    addLog('👶 存款突破50万，你和伴侣决定生育！月生活费升至 ¥'+CHILD_LIVING_COST+'（房贷不变，持续18年）','success');
  }
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
      return true;
    }
  }
  return false;
}

function checkVictory(){
  if(game.gameOver)return;
  if(game.mortgagePaidOff&&game.ownsHome&&game.married&&!game.divorced&&!game.homeless){
    game.gameWon=true;
    endGame('victory_early');
  }
}

function determineEnding(){
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
  checkAffairEvent();
  syncAffairState();
  checkChildBirth();
  const exp=getMonthlyExpenses();
  let income=0;
  if(game.onWelfare&&!game.homeless){
    income=game.disabled?2370:1310;
    game.cash+=income; game.money+=income;
    addLog('📋 领取'+(game.disabled?'伤残':'')+'低保 ¥'+income,'info');
  }
  if(game.hasChildren&&game.childRaisingMonthsLeft>0){
    game.childRaisingMonthsLeft--;
    if(game.childRaisingMonthsLeft===0)addLog('👦 孩子已成年，月生活费恢复 ¥5000','info');
  }
  let need=exp.total;
  if(game.cash>=need){
    game.cash-=need;
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
  const shortfall=need-game.cash;
  game.cash=0;
  if(tryEnterHomeless(shortfall))return;
  if(game.homeless){
    game.homelessMonths++;
    game.familyStress=Math.min(100,game.familyStress+8);
    addLog('🌧 流浪中无力维持生活（缺 ¥'+shortfall+'），在桥洞又熬过一個月','warn');
    if(game.homelessMonths>=24&&getYear(game.week)>=2050){endGame('bridge');return}
    return;
  }
  if(!game.onWelfare&&game.parentsSupportMonthsLeft>0){
    game.livingOffParents=true;
    game.parentsSupportMonthsLeft--;
    addLog('🏠 收入不足，啃老 ¥'+shortfall.toLocaleString()+'（剩余'+game.parentsSupportMonthsLeft+'月）','stress');
    game.familyStress=Math.min(100,game.familyStress+6*game.stressMultiplier);
    game.monthsUnderpaid=0;
    return;
  }
  game.monthsUnderpaid++;
  game.familyStress=Math.min(100,game.familyStress+10*game.stressMultiplier);
  addLog('⚠ 第'+game.monthsUnderpaid+'月无力交满（缺 ¥'+shortfall.toLocaleString()+'）','warn');
  if(!game.divorced&&game.monthsUnderpaid>=6){
    game.divorced=true; game.married=false; game.affairActive=false; game.ownsHome=false; game.stressMultiplier=2;
    game.familyStress=Math.min(100,game.familyStress+25);
    addLog('💔 连续半年无力负担，离婚了。失去房产，租住出租屋（¥6000/月），压力翻倍。','stress');
    game.monthsUnderpaid=0;
  }
  if(tryEnterHomeless(shortfall))return;
  if(game.parentsSupportMonthsLeft<=0&&!game.onWelfare&&game.monthsUnderpaid>=3){
    game.onWelfare=true;
    addLog('📋 啃老十年耗尽，领取低保 ¥1310/月。只能从事体力劳动。','warn');
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
    addLog('🚑 体力劳动中受伤致残！失业并领取伤残低保 ¥2370/月','fail');
  }
}

function applyFamilyPressure(cat){
  if(!isCategorySalaryDeclining(cat))return;
  game.familyStress=Math.min(100,game.familyStress+(3+Math.floor(Math.random()*4))*game.stressMultiplier);
  if(game.familyStress>20&&Math.random()<.3){
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
  game.careerHistory.push({tier:emp.tier,importance:emp.importance,category:game.market[emp.jobIdx].category,
    company:emp.company.name,weeks:emp.weeksInCompany});
}

function hirePlayer(jobIdx,offer,viaReferral){
  const job=game.market[jobIdx];
  if(game.employed&&game.employment)recordCareerHistory(game.employment);
  const was=game.employed;
  const internWeeks=offer.roleExtra==='intern'?4+Math.floor(Math.random()*9):0;
  game.employed=true;
  game.employment={jobIdx,company:offer.company,tier:offer.tier,importance:offer.importance,
    roleExtra:offer.roleExtra||null,annualPay:offer.annualPay,
    internWeeksLeft:internWeeks,weeksInIndustry:game.industryExperience[job.category]||0,weeksInCompany:0,weeksInRole:0};
  game.successfulHires++;
  if(was)game.switches++;
  const role=offer.roleExtra?IMP_LABEL[offer.importance]+'·'+ROLE_EXTRA[offer.roleExtra]:IMP_LABEL[offer.importance];
  let msg=(viaReferral?'🤝 内推入职':'✅ 入职')+'【'+job.title+'】@'+offer.company.name+
    '（'+TIER_LABEL[offer.tier]+'·'+SCALE_LABEL[offer.company.scale]+'·'+role+'）';
  addLog(msg,'success');
  updateHeadhunterOption();
}

function stayWeek(){if(actionDone||!game.employed||game.casinoActive)return;actionDone=true;processEmployedWeek();finishWeek()}
function waitWeek(){if(actionDone||game.employed||game.casinoActive)return;addLog('观望一周…','info');actionDone=true;finishWeek()}

function processEmployedWeek(){
  if(!game.employed)return;
  const emp=game.employment, job=game.market[emp.jobIdx];
  let salary=weeklySalary(job,emp);
  if(game.headhunterDebt>0){const d=Math.min(salary,game.headhunterDebt);game.headhunterDebt-=d;salary-=d;if(d)addLog('扣猎头欠款 ¥'+d,'warn')}
  game.money+=salary; game.cash+=salary;
  checkChildBirth();
  emp.weeksInIndustry++; emp.weeksInCompany++; emp.weeksInRole++;
  game.industryExperience[job.category]=(game.industryExperience[job.category]||0)+1;
  applyFamilyPressure(job.category);
  const wp=getLayoffWaveProbability(emp);
  if(Math.random()<wp){
    const r=resolveLayoff(emp);
    if(r.laidOff){
      recordCareerHistory(emp);
      game.employed=false; game.layoffs++; game.employment=null;
      game.familyStress=Math.min(100,game.familyStress+8*game.stressMultiplier);
      addLog('💔 '+r.reason+'。本周工资 ¥'+salary.toLocaleString(),'fail'); return;
    }
    addLog('😰 '+r.reason,'warn');
  }
  if(emp.roleExtra==='intern'&&emp.internWeeksLeft>0){
    emp.internWeeksLeft--;
    if(emp.internWeeksLeft<=0){
      let conv=emp.tier==='low'?0.5:emp.tier==='mid'?0.28:0.12;
      const catDecl=isCategorySalaryDeclining(job.category);
      if(catDecl)conv*=0.7;
      if(Math.random()<conv){
        emp.roleExtra=null; emp.annualPay=calcAnnualPay(job,emp.tier,emp.importance);
        addLog('🎉 实习转正！年薪 ¥'+emp.annualPay.toLocaleString(),'success');
      }else{
        recordCareerHistory(emp);
        game.employed=false; game.employment=null;
        addLog('实习期结束未获留用，离开 '+emp.company.name,'fail');
        return;
      }
    }
  }
  if(emp.roleExtra==='temp'&&Math.random()<0.06+game.macroUnemployment*2){
    recordCareerHistory(emp);
    game.employed=false; game.employment=null; game.layoffs++;
    addLog('💔 临时工被随时裁退 @'+emp.company.name,'fail');
    return;
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

function finishWeek(){ updateUI(); }

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
  const wolfDrift=game.wolfAchievement?0.04:0;
  game.stocks.forEach(s=>{
    s.prevPrice=s.price;
    const ref=s.refPrice||s.price;
    const ch=(Math.random()-.48+wolfDrift)*0.035;
    s.price=Math.max(ref*0.55,Math.min(ref*1.45,s.price*(1+ch)));
    s.history.push(s.price); if(s.history.length>60)s.history.shift();
  });
  updateCategoryTrends(); updateMacroUnemployment();
}

function nextWeek(){
  if(!actionDone||game.gameOver)return;
  if(game.week>=TOTAL_WEEKS){endGame('timeout');return}
  game.week++;
  if(game.married&&!game.divorced)game.marriedWeeks++;
  checkAffairEvent();
  updateMarket(); processApplicationPipeline(); rollReferralChance(); actionDone=false;
  if(game.week>=TOTAL_WEEKS){endGame('timeout');return}
  if(game.week%WEEKS_PER_MONTH===0)processMonthlyBills();
  if(game.week%52===0)addLog('—— '+getYear(game.week)+'年 ——','warn');
  updateUI();
}

function stockCommission(amt){return Math.max(.01,amt*.0002)}

function tradeStock(sym,action,shares){
  if(actionDone){addLog('本周已行动','warn');return}
  if(game.casinoActive){addLog('在澳门赌桌，无法炒股','warn');return}
  const s=game.stocks.find(x=>x.symbol===sym); if(!s)return;
  shares=Math.floor(shares)||0; if(shares<=0)return;
  if(action==='buy'){
    const cost=s.price*shares, comm=stockCommission(cost), total=cost+comm;
    if(game.cash<total){addLog('现金不足炒股','fail');return}
    game.cash-=total; game.stockSpent+=comm;
    game.portfolio[sym]=(game.portfolio[sym]||0)+shares;
    addLog('买入 '+s.name+' ×'+shares+' @¥'+s.price.toFixed(2)+' 佣金¥'+comm.toFixed(2),'info');
  }else{
    const held=game.portfolio[sym]||0; if(held<shares){addLog('持仓不足','fail');return}
    const rev=s.price*shares, comm=stockCommission(rev), net=rev-comm;
    game.cash+=net; game.money+=net; game.stockSpent+=comm;
    game.portfolio[sym]=held-shares; if(game.portfolio[sym]<=0)delete game.portfolio[sym];
    addLog('卖出 '+s.name+' ×'+shares+' 净收¥'+net.toFixed(2),'info');
  }
  actionDone=true; finishWeek();
}

function renderStocks(){
  if(!game)return;
  document.getElementById('stockList').innerHTML=game.stocks.map(s=>{
    const held=game.portfolio[s.symbol]||0;
    const ch=s.price>=s.prevPrice?'up':'down';
    const ref=s.refPrice?(' 参考¥'+s.refPrice):'';
    return '<div class="stock-row"><div style="min-width:100px"><b>'+s.name+'</b> <span style="color:var(--muted)">'+s.symbol+'</span><br>'+
      '<span class="'+ch+'">¥'+s.price.toFixed(2)+'</span>'+ref+' 持仓:'+held+'</div>'+
      '<div class="stock-chart-wrap"><canvas id="stkChart_'+s.symbol+'" height="36"></canvas></div>'+
      '<div><input type="number" id="sh_'+s.symbol+'" value="100" min="1" style="width:60px">'+
      '<button class="btn" onclick="tradeStock(\\''+s.symbol+'\\',\\'buy\\',+document.getElementById(\\'sh_'+s.symbol+'\\').value)">买</button>'+
      '<button class="btn" onclick="tradeStock(\\''+s.symbol+'\\',\\'sell\\',+document.getElementById(\\'sh_'+s.symbol+'\\').value)">卖</button></div></div>';
  }).join('');
  requestAnimationFrame(()=>{
    game.stocks.forEach(s=>{
      const c=document.getElementById('stkChart_'+s.symbol);
      if(c){const w=c.parentElement?c.parentElement.clientWidth:160;drawSparkline(c,s.history,w,36)}
    });
  });
  let ph=''; let tv=0;
  Object.keys(game.portfolio).forEach(sym=>{
    const s=game.stocks.find(x=>x.symbol===sym), n=game.portfolio[sym];
    if(s){tv+=s.price*n;ph+='<div>'+s.name+' ×'+n+' ≈¥'+(s.price*n).toFixed(0)+'</div>'}
  });
  document.getElementById('portfolioPanel').innerHTML=ph||'暂无持仓';
}

function rollDice(){return [1,2,3].map(()=>1+Math.floor(Math.random()*6))}

function getGamblePayout(betType,betSum,dice,amount){
  const sum=dice[0]+dice[1]+dice[2];
  const isTriple=dice[0]===dice[1]&&dice[1]===dice[2];
  if(betType==='big'){if(isTriple||sum<11)return 0; return amount*(1-HOUSE_EDGE)}
  if(betType==='small'){if(isTriple||sum>10)return 0; return amount*(1-HOUSE_EDGE)}
  const oddsMap={4:50,5:18,6:14,7:12,8:8,9:6};
  if(betSum==='9'){if(sum>=9&&sum<=12&&!isTriple)return amount*6*(1-HOUSE_EDGE);return 0}
  const n=+betSum, targets=n<=9?[n,18-n]:[n];
  if(targets.includes(sum)&&!isTriple)return amount*oddsMap[n]*(1-HOUSE_EDGE);
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
  const style='--chip-edge:'+c.edge+';--chip-edge-dark:'+(c.edgeDark||c.edge)+';--chip-text:'+c.text+';';
  const click=opts.onclick?' onclick="'+opts.onclick+'"':'';
  const dbl=opts.ondblclick?' ondblclick="'+opts.ondblclick+'"':'';
  const title=opts.title||('¥'+denom.toLocaleString());
  return '<button type="button" class="'+cls+'" style="'+style+'" title="'+title+'"'+click+dbl+'>'+
    '<span class="chip-val">'+fmtChipLabel(denom)+'</span></button>';
}
function renderChipStacks(map,opts){
  let html='';
  CHIP_DENOMS.forEach(d=>{
    const n=map[d]||0; if(!n)return;
    const click=opts&&opts.onChip?'selectChipFromHand('+d+')':'';
    const dbl=opts&&opts.onCashIn?'cashChipFromHand('+d+');event.preventDefault()':'';
    const title=opts&&opts.onChip?'¥'+d+' · 点击选中押注 · 双击换回现金':'¥'+d;
    const show=Math.min(n,opts&&opts.maxShow||6);
    html+='<div class="chip-stack">';
    for(let i=0;i<show;i++)html+=chipBtnHtml(d,{size:opts.size,selected:game&&game.selectedChipDenom===d,onclick:click,ondblclick:dbl,title:title});
    html+='<span class="stack-count">×'+n+'</span></div>';
  });
  return html;
}
function emptyTableBets(){
  const z={}; BET_ZONES.forEach(k=>{z[k]=emptyChipMap()}); return z;
}
function tableBetTotal(){return BET_ZONES.reduce((s,z)=>s+chipMapTotal(game.tableBets[z]),0)}

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
  const btn=document.getElementById('btnRollDice'); if(btn)btn.disabled=true;
  let ticks=0;
  const timer=setInterval(()=>{
    els.forEach(el=>setDieFace(el,1+Math.floor(Math.random()*6)));
    ticks++;
    if(ticks>=28){
      clearInterval(timer);
      els.forEach(el=>el.classList.remove('rolling'));
      finalDice.forEach((v,i)=>{if(els[i])setDieFace(els[i],v)});
      casinoRolling=false;
      if(btn)btn.disabled=false;
      onDone();
    }
  },75);
}

function renderCasino(){
  if(!game)return;
  const lobby=document.getElementById('casinoLobby'), floor=document.getElementById('casinoFloor');
  if(lobby)lobby.style.display=game.casinoActive?'none':'block';
  if(floor)floor.style.display=game.casinoActive?'block':'none';
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
    const pileId='pile'+(z==='big'?'Big':z==='small'?'Small':z);
    const pile=document.getElementById(pileId);
    const map=game.tableBets[z]||emptyChipMap();
    if(pile)pile.innerHTML=renderChipStacks(map,{size:'chip-zone-size',maxShow:8})||'';
    const box=document.querySelector('[data-zone="'+z+'"]');
    if(box)box.classList.toggle('has-bet',chipMapTotal(map)>0);
  });
  if(game.casinoActive&&!casinoRolling){
    const dies=[1,2,3].map(i=>document.getElementById('die'+i));
    if(dies[0]&&!dies[0].dataset.face)initDiceFaces();
  }
}

function enterCasino(){
  if(actionDone){addLog('本周已行动','warn');return}
  if(game.casinoActive)return;
  if(game.cash<MACAU_ENTRY){addLog('澳门五日游需 ¥'+MACAU_ENTRY,'fail');return}
  game.cash-=MACAU_ENTRY; game.gambleSpent+=MACAU_ENTRY; game.gambleCount++;
  game.casinoActive=true; game.chipHand=emptyChipMap(); game.tableBets=emptyTableBets(); game.selectedChipDenom=null;
  casinoRolling=false;
  addLog('✈️ 澳门五日游出发，入场费 ¥'+MACAU_ENTRY+'。请在柜台兑换筹码，持筹上赌桌。','info');
  renderCasino(); initDiceFaces(); updateButtons();
}

function buyChipAtCage(denom){
  if(!game||!game.casinoActive||casinoRolling)return;
  if(game.cash<denom){addLog('现金不足购买 ¥'+denom+' 筹码','fail');return}
  game.cash-=denom; game.chipHand[denom]=(game.chipHand[denom]||0)+1;
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
  if(game.selectedChipDenom===denom&&!game.chipHand[denom])game.selectedChipDenom=null;
  addLog('筹码换回现金 ¥'+denom,'info');
  renderCasino();
}

function cashAllChipsFromHand(){
  if(!game||!game.casinoActive||casinoRolling)return;
  const total=chipMapTotal(game.chipHand);
  if(total<=0){addLog('手中没有筹码','fail');return}
  game.cash+=total; game.money+=total;
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
  renderCasino();
}

function clearTableBets(){
  if(!game||!game.casinoActive||casinoRolling)return;
  BET_ZONES.forEach(z=>{mergeChipMaps(game.chipHand,game.tableBets[z]);game.tableBets[z]=emptyChipMap()});
  renderCasino();
}

function resolveZonePayout(zone,chipMap,dice){
  const chips=chipMapTotal(chipMap);
  if(!chips)return 0;
  let profit=0;
  if(zone==='big'||zone==='small')profit=getGamblePayout(zone,null,dice,chips);
  else profit=getGamblePayout('sum',zone,dice,chips);
  if(!profit&&game.wolfAchievement&&Math.random()<0.12)profit=chips*(1-HOUSE_EDGE);
  return profit>0?Math.floor(chips+profit):0;
}

function settleCasinoRoll(dice){
  const sum=dice[0]+dice[1]+dice[2];
  let won=0, lost=0;
  BET_ZONES.forEach(z=>{
    const map=game.tableBets[z];
    const zoneVal=chipMapTotal(map);
    if(!zoneVal)return;
    const back=resolveZonePayout(z,map,dice);
    if(back>0){
      won+=back;
      mergeChipMaps(game.chipHand,distributeChips(back).map);
    }else lost+=zoneVal;
    game.tableBets[z]=emptyChipMap();
  });
  const dr=document.getElementById('diceResult');
  if(dr)dr.innerHTML='<span class="dice-sum">'+dice.join(' + ')+' = '+sum+'</span>'+
    (won>0?' · 赢得筹码 ¥'+won.toLocaleString():' · 输掉筹码 ¥'+lost.toLocaleString());
  if(won>0)addLog('开盅 '+dice.join('+')+'='+sum+' 赢得筹码 ¥'+won.toLocaleString(),'success');
  else{addLog('开盅 '+dice.join('+')+'='+sum+' 输掉筹码 ¥'+lost.toLocaleString(),'fail');game.familyStress=Math.min(100,game.familyStress+4)}
  renderCasino();
}

function rollCasinoTable(){
  if(!game||!game.casinoActive||casinoRolling)return;
  const total=tableBetTotal();
  if(total<=0){addLog('请先把筹码押入赌区','warn');return}
  const dice=rollDice();
  animateDiceRoll(dice,()=>settleCasinoRoll(dice));
}

function leaveCasino(){
  if(!game||!game.casinoActive||casinoRolling)return;
  const onTable=tableBetTotal();
  if(onTable>0){addLog('请先开盅或收回桌面筹码','warn');return}
  const handVal=chipMapTotal(game.chipHand);
  if(handVal>0){
    game.cash+=handVal; game.money+=handVal; game.chipHand=emptyChipMap();
    addLog('离桌结款：筹码兑换 ¥'+handVal.toLocaleString(),'info');
  }
  game.casinoActive=false; game.selectedChipDenom=null; casinoRolling=false;
  const dr=document.getElementById('diceResult'); if(dr)dr.textContent='';
  addLog('澳门五日游结束，本周行动已消耗。','warn');
  actionDone=true; renderCasino(); finishWeek();
}

function endGame(trigger){
  if(game.gameOver)return;
  game.gameOver=true;
  const ending=determineEnding();
  game.endingType=ending.type;
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
  if(!game._archived){archiveGameSave('ending');game._archived=true}
}

function addLog(msg,type){
  game.log.unshift({date:getDateStr(game.week),msg,type});
  if(game.log.length>120)game.log.pop();
  document.getElementById('gameLog').innerHTML=game.log.map(l=>'<div class="log-entry '+l.type+'"><span class="date">'+l.date+'</span> '+l.msg+'</div>').join('');
}

function drawSparkline(canvas,history,w,h){
  if(!canvas)return; const ctx=canvas.getContext('2d'), dpr=devicePixelRatio||1;
  canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);
  const d=history.slice(-30); if(d.length<2)return;
  const mn=Math.min(...d),mx=Math.max(...d),rg=mx-mn||1;
  ctx.strokeStyle=d[d.length-1]>=d[d.length-2]?'#3fb950':'#f85149';
  ctx.beginPath(); d.forEach((v,i)=>{const x=i/(d.length-1)*w,y=h-((v-mn)/rg)*(h-4)-2;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}); ctx.stroke();
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
    '<div class="ref-rationale"><strong>AI 分析</strong><br>'+job.exposure_rationale+'</div>';
}
function renderRefPanel(idx){
  const nat=document.getElementById('refNational');
  const jd=document.getElementById('refJobDetail');
  const hdr=document.querySelector('#refPanel .ref-hdr');
  const sub=document.querySelector('#refPanel .ref-sub');
  if(idx>=0){
    const job=marketForRef()[idx];
    if(nat)nat.style.display='none';
    if(jd){jd.style.display='block';renderRefJobDetail(idx)}
    if(hdr&&job)hdr.textContent=job.title;
    if(sub)sub.textContent='再次点击取消选择 · 返回全国统计';
  }else{
    if(nat){nat.style.display='block';renderRefNational(marketForRef())}
    if(jd)jd.style.display='none';
    if(hdr)hdr.textContent='中国就业市场';
    if(sub)sub.textContent='242个职业 · 方块面积=就业人数 · 颜色=AI影响（0–10）';
  }
}
function renderJobs(){
  if(!game)return;
  const searchEl=document.getElementById('searchInput');
  const search=searchEl?searchEl.value:'';
  const treemapEl=document.getElementById('jobTreemap');
  if(!treemapEl)return;
  let jobs=game.market.filter(j=>{
    if(currentCategory!=='全部'&&j.category!==currentCategory)return false;
    if(search&&!j.title.includes(search))return false;
    if(game.onWelfare&&!canApplyJob(j))return false;
    return true;
  });
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
  if(selectedIdx>=0){renderRefPanel(selectedIdx);showDetail(selectedIdx)}
  else renderRefPanel(-1);
}

function updateOfferPreview(){
  if(!game)return;
  const rc=getResumeCost();
  const hint=document.getElementById('applyCostHint');
  if(hint)hint.textContent='先选渠道（¥'+rc.upfront+'）→ 抽取企业 → 勾选投递 · APP标注为优选方向，各类企业均可能出现在任一平台 · 面试：普通¥0/专家¥100/总监¥200'+
    (rc.isHeadhunter?' · 入职收年薪20%':'');
  if(selectedIdx>=0)showDetail(selectedIdx);
}

function selectJob(idx){
  if(!game)return;
  if(game.onWelfare&&!canApplyJob(game.market[idx]))return;
  if(selectedJobIdxs.has(idx)){selectedJobIdxs.delete(idx);if(selectedIdx===idx)selectedIdx=selectedJobIdxs.size?[...selectedJobIdxs][0]:-1}
  else{selectedJobIdxs.add(idx);selectedIdx=idx;}
  renderJobs(); updateOfferPreview(); updateButtons();
}

function fmtProb(p){return p<0.0001?(p*1e6).toFixed(2)+'ppm':p<0.01?(p*100).toFixed(3)+'%':Math.round(p*100)+'%'}

function showDetail(idx){
  const job=game.market[idx], offer=computeOffer(job,{isSwitch:game.employed});
  offer.apps=getSelectedApps();
  const mod=getHireProbabilityModifiers(offer);
  const ageLim=getAgeLimit(job);
  const showProb=game.showProbabilities;
  const rp=getResumeProbability(job,offer,offer.apps), ip=getInterviewProbability(job,offer,false), ref=getReferralProbability(offer);
  document.getElementById('detailPanel').style.display='block';
  document.getElementById('detailTitle').textContent=job.title;
  document.getElementById('detailMeta').textContent=job.category+' · '+job.education+' · 中位¥'+job.pay.toLocaleString()+' · 热'+job.heatPct+'% · AI '+job.exposure+'/10'+
    ' · 年龄限'+ageLim+'岁'+(isOverAgeLimit(job)?' ⚠超龄':'')+
    (showProb?' · 院校×'+mod.schoolF.toFixed(2)+' 学历×'+mod.eduF.toFixed(4):'');
  ['probResumeRow','probInterviewRow','probReferralRow'].forEach(id=>{
    document.getElementById(id).classList.toggle('prob-hidden',!showProb);
  });
  const lock=document.getElementById('probLockedHint');
  if(lock){lock.style.display=showProb?'none':'block';document.getElementById('resumeFailCount').textContent=game.resumeFailCount}
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
  const n=selectedJobIdxs.size||(selectedIdx>=0?1:0);
  const hasPick=n>0||applyCategoryPicks.size>0;
  btn.disabled=actionDone||!hasPick||!game||game.casinoActive;
  btn.textContent='查看本期招聘';
  const hint=document.getElementById('applyPickHint');
  if(hint){
    if(!game)hint.textContent='请先开始游戏';
    else if(game.casinoActive)hint.textContent='在澳门赌桌 · 离桌结款后进入下周';
    else if(actionDone)hint.textContent='本周已行动，请进入下周';
    else if(!hasPick)hint.textContent='↑ 点击职业方块多选，或左侧点行业标签';
    else hint.textContent='已选 '+(n||'行业'+applyCategoryPicks.size)+' · 选渠道后点按钮抽取企业招聘';
  }
  document.getElementById('btnStay').disabled=actionDone||!game.employed||game.casinoActive;
  document.getElementById('btnWait').disabled=actionDone||game.employed||game.casinoActive;
  document.getElementById('btnNext').disabled=!actionDone;
  const btnEnter=document.getElementById('btnEnterCasino');
  if(btnEnter)btnEnter.disabled=actionDone||game.casinoActive;
  const btnLeave=document.getElementById('btnLeaveCasino');
  if(btnLeave)btnLeave.disabled=!game.casinoActive||casinoRolling;
  const btnRoll=document.getElementById('btnRollDice');
  if(btnRoll)btnRoll.disabled=!game.casinoActive||casinoRolling;
}

function updateUI(){
  if(!game)return;
  document.getElementById('statAge').textContent=getPlayerAge()+'岁';
  document.getElementById('statDate').textContent=getDateStr(game.week);
  document.getElementById('statWeek').textContent=(game.week+1)+'/'+TOTAL_WEEKS;
  document.getElementById('statCash').textContent='¥'+game.cash.toLocaleString();
  document.getElementById('statMoney').textContent='¥'+game.money.toLocaleString();
  document.getElementById('statMarriage').textContent=game.divorced?'离异':game.married?'已婚':'单身';
  document.getElementById('statMonthly').textContent='¥'+getMonthlyExpenses().total.toLocaleString();
  document.getElementById('statStress').textContent=game.familyStress;
  document.getElementById('stressBar').style.width=game.familyStress+'%';
  let life='正常';
  if(game.homeless)life='流浪';
  else if(game.affairActive)life='婚外情';
  else if(game.onWelfare)life=game.disabled?'伤残低保':'低保';
  else if(game.livingOffParents)life='啃老';
  document.getElementById('statLife').textContent=life;
  const exp=getMonthlyExpenses();
  document.getElementById('statMortgage').textContent=game.mortgagePaidOff?'已还清':game.mortgagePaymentsMade+'/'+MORTGAGE_MONTHS+'月';
  document.getElementById('statFamily').textContent=game.hasChildren?(game.childRaisingMonthsLeft>0?'育儿中':'已育'):'无孩';

  document.getElementById('lifePanel').innerHTML=
    '<div><b>人生目标</b></div><div style="color:var(--muted);margin:4px 0">还清30年房贷，与伴侣在自己的房中度晚年</div>'+
    '<div><b>本月 ¥'+exp.total.toLocaleString()+'</b> · '+exp.label+'</div>'+
    (game.ownsHome&&!game.mortgagePaidOff?'<div>房贷进度 '+game.mortgagePaymentsMade+'/'+MORTGAGE_MONTHS+'</div>':'')+
    (game.hasChildren&&game.childRaisingMonthsLeft>0?'<div>育儿剩余 '+game.childRaisingMonthsLeft+' 月</div>':'')+
    (game.cash>=CHILD_TRIGGER_CASH&&!game.hasChildren&&!game.divorced?'<div style="color:var(--green)">存款达标，可生育</div>':'')+
    (game.affairActive?'<div style="color:var(--red)">婚外情中 · 月支出×2</div>':'')+
    (game.homeless?'<div style="color:var(--red)">流浪 '+game.homelessMonths+' 月</div>':'')+
    (game.parentsSupportMonthsLeft<120?'<div>啃老剩余 '+game.parentsSupportMonthsLeft+' 月</div>':'')+
    '<div style="margin-top:6px;font-size:.72rem;color:var(--muted)">35/40/45岁录取递减 · 等级=头部/重点/草根 · 规模=大/中/小（仅影响行业覆盖）</div>';

  const empCard=document.getElementById('empCard');
  if(game.employed&&game.employment){
    const e=game.employment,j=game.market[e.jobIdx];
    empCard.style.display='block';
    const role=e.roleExtra?IMP_LABEL[e.importance]+'·'+ROLE_EXTRA[e.roleExtra]:IMP_LABEL[e.importance];
    empCard.innerHTML='<b>'+j.title+'</b> @ '+e.company.name+' · 年薪¥'+e.annualPay.toLocaleString()+
      ' <span class="badge badge-tier-'+e.tier[0]+'">'+TIER_LABEL[e.tier]+'</span>'+
      ' <span class="badge badge-scale-'+e.company.scale[0]+'">'+SCALE_LABEL[e.company.scale]+'</span>'+
      ' <span class="badge badge-imp-'+e.importance[0]+'">'+role+'</span>'+
      (e.internWeeksLeft>0?' <span style="color:var(--yellow)">实习剩'+e.internWeeksLeft+'周</span>':'');
  }else empCard.style.display='none';

  document.getElementById('actionTip').innerHTML=actionDone
    ?'<strong>本周已行动</strong> → 进入下周 · 查看招聘回复选面试':'<strong>'+getDateStr(game.week)+'</strong>：多选职业/行业→选渠道付费→勾选本期在招岗位→等回复→面试';
  if(game.employed&&selectedIdx<0)selectedIdx=game.employment.jobIdx;
  renderHeaderProgress(); renderJobs(); renderStocks(); renderCasino(); renderInbox(); renderOffers(); updateButtons();
  updateHeadhunterOption();
  updateOfferPreview();
}
initPlayerProfile();
syncPlayerSchoolEdu();
renderRefPanel(-1);
</script>
</body>
</html>`;

fs.writeFileSync('career-stock-game.html', html, 'utf8');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Built', (fs.statSync('career-stock-game.html').size/1024).toFixed(1)+' KB', '+ index.html');
