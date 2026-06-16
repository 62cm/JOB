/* 创造人生 · 写实赌桌开局 — 由 build.js 注入 */
let lifeCreationState = null;
let lcRolling = false;

function rollCreationDice() {
  return [1, 2, 3].map(function () { return 1 + Math.floor(Math.random() * 6); });
}
function diceSum(d) { return (d || []).reduce(function (a, b) { return a + b; }, 0); }
function diceIsBig(sum) { return sum >= 11; }
function lcDiceScore(d) { return (d[0] || 1) * (d[1] || 1) * (d[2] || 1); }
function lcGaokaoBaseFromRolls(rolls) {
  const first3 = (rolls || []).slice(0, 3);
  if (!first3.length) return 0;
  let max = 0;
  first3.forEach(function (d) { max = Math.max(max, lcDiceScore(d)); });
  return max * 3;
}
function lcGaokaoBonusFromRolls(rolls) {
  const r = rolls || [];
  return r.length >= 4 ? lcDiceScore(r[3]) : 0;
}
function lcRecalcGaokaoScore(st) {
  if (!st) return 0;
  const rolls = st.gaokaoRolls || [];
  st.gaokaoBaseScore = lcGaokaoBaseFromRolls(rolls);
  st.gaokaoBonusPoints = lcGaokaoBonusFromRolls(rolls);
  st.gaokaoScore = st.gaokaoBaseScore + st.gaokaoBonusPoints;
  return st.gaokaoScore;
}
function lcGaokaoScoreBreakdownHtml(st) {
  const base = st.gaokaoBaseScore != null ? st.gaokaoBaseScore : lcGaokaoBaseFromRolls(st.gaokaoRolls);
  const bonus = st.gaokaoBonusPoints || 0;
  let h = '基础分 <span style="color:var(--yellow)">' + base + '</span>（三投最高×3）';
  if (bonus) h += ' + 加投 <span style="color:var(--yellow)">' + bonus + '</span>';
  h += ' = 合计 <b style="color:var(--yellow)">' + (st.gaokaoScore != null ? st.gaokaoScore : base + bonus) + '</b>';
  return h;
}
function spinRoulette() { return Math.floor(Math.random() * 37); }
function lcIsRed(n) {
  if (typeof ROULETTE_RED !== 'undefined') return ROULETTE_RED.has(n);
  return n > 0 && n % 2 === 1;
}

function openLifeCreationWizard(slot) {
  pendingNewSlot = slot;
  lifeCreationState = { slot: slot, step: 0, phase: 'bet', chipColor: null, betPick: null, lastDice: null, resultText: '', results: {}, creationRolls: [], betWinCount: 0, lcWheelRot: 0, gaokaoRetakeCount: 0, gaokaoRetakeYears: 0, gaokaoAccepted: false, gaokaoRollLabels: [], initialHadFourthThrow: null, retakeRolls: [], retakeBetWins: 0, retakeThrowIdx: 0 };
  lcRolling = false;
  renderLifeCreationStep();
  const el = document.getElementById('lifeCreationOverlay');
  if (el) el.classList.remove('hidden');
}
function closeLifeCreationWizard() {
  const el = document.getElementById('lifeCreationOverlay');
  if (el) el.classList.add('hidden');
  lifeCreationState = null;
  lcRolling = false;
}

/* ---------- 写实组件 ---------- */
function lcDieFaceHtml(val) {
  let h = '';
  for (let i = 0; i < 9; i++) {
    const on = typeof DIE_PIP_POS !== 'undefined' && DIE_PIP_POS[val] && DIE_PIP_POS[val].includes(i);
    h += '<span class="pip' + (on ? '' : ' hide') + '"></span>';
  }
  return h;
}
function lcDieHtml(id, val) {
  return '<div class="die" id="' + id + '">' + lcDieFaceHtml(val || 1) + '</div>';
}
function lcDiceTray(dice) {
  const d = dice || [1, 1, 1];
  let h = '<div style="display:flex;gap:10px;justify-content:center;align-items:center;margin:10px 0;min-height:58px">';
  h += lcDieHtml('lcDie0', d[0]) + lcDieHtml('lcDie1', d[1]) + lcDieHtml('lcDie2', d[2]);
  h += '</div>';
  if (dice) {
    const sum = diceSum(dice);
    h += '<div style="text-align:center;margin:-2px 0 6px;font-weight:700">点数合计 <span style="color:var(--yellow)">' + sum + '</span> · ' + (diceIsBig(sum) ? '大' : '小') + '</div>';
  }
  return h;
}
function lcChipStyle(color) {
  if (color === 'pink') return { edge: '#ec407a', dark: '#ad1457', text: '#7a0c3f' };
  return { edge: '#42a5f5', dark: '#1565c0', text: '#0d3c78' };
}
function lcGenderChip(gender, size, extraStyle, blank) {
  const g = gender === 'female' ? 'pink' : 'blue';
  const c = lcChipStyle(g);
  const sz = size || 40;
  const inner = blank ? '' : (gender === 'female' ? '♀' : '♂');
  return '<span class="casino-chip" style="--chip-edge:' + c.edge + ';--chip-edge-dark:' + c.dark + ';--chip-text:' + c.text + ';width:' + sz + 'px;height:' + sz + 'px;cursor:default;' + (extraStyle || '') + '">' +
    (inner ? '<span class="chip-val" style="font-size:' + (sz > 50 ? '.72rem' : '.58rem') + ';color:' + c.text + '">' + inner + '</span>' : '<span class="chip-val"></span>') + '</span>';
}
function lcPlayerChip(size, extraStyle) {
  const st = lifeCreationState;
  return lcGenderChip(st && st.playerGender === 'female' ? 'female' : 'male', size, extraStyle, true);
}
function lcFeltOpen() {
  return '<div style="background:radial-gradient(ellipse at 50% 30%,#1f7a43,#0c3a20);border:6px solid #5b3d22;border-radius:16px;padding:14px 12px;box-shadow:inset 0 2px 16px rgba(0,0,0,.5),0 6px 16px rgba(0,0,0,.4);margin:10px 0">';
}
function lcBigSmallZones() {
  const st = lifeCreationState;
  const pick = st.betPick;
  let h = '<div style="display:flex;gap:10px;margin-top:6px">';
  [['big', '大', 'sum ≥ 11', '#42a5f5'], ['small', '小', 'sum ≤ 10', '#ec407a']].forEach(function (z) {
    const sel = pick === z[0];
    h += '<div onclick="lcPickSide(\'' + z[0] + '\')" style="flex:1;cursor:pointer;border:2px ' + (sel ? 'solid var(--yellow)' : 'dashed rgba(255,255,255,.35)') + ';border-radius:10px;padding:10px 6px;text-align:center;background:' + (sel ? 'rgba(210,153,34,.18)' : 'rgba(0,0,0,.18)') + ';transition:.15s">';
    h += '<div style="font-size:1.6rem;font-weight:800;color:' + z[3] + ';text-shadow:0 1px 0 rgba(0,0,0,.4)">' + z[1] + '</div>';
    h += '<div style="font-size:.66rem;color:rgba(255,255,255,.7)">' + z[2] + '</div>';
    h += '<div style="min-height:44px;display:flex;align-items:center;justify-content:center;margin-top:4px">' + (sel ? lcPlayerChip(40) : '<span style="font-size:.62rem;color:rgba(255,255,255,.45)">点此放置筹码</span>') + '</div>';
    h += '</div>';
  });
  h += '</div>';
  return h;
}

/* ---------- 骰子动画 ---------- */
function lcAnimateDice(finalDice, onDone) {
  const els = ['lcDie0', 'lcDie1', 'lcDie2'].map(function (id) { return document.getElementById(id); });
  if (els.some(function (e) { return !e; })) { onDone(); return; }
  els.forEach(function (e) { e.classList.add('rolling'); });
  let t = 0;
  const iv = setInterval(function () {
    els.forEach(function (e) {
      if (typeof setDieFace === 'function') setDieFace(e, 1 + Math.floor(Math.random() * 6));
    });
    t += 90;
    if (t >= 720) {
      clearInterval(iv);
      els.forEach(function (e, i) {
        e.classList.remove('rolling');
        if (typeof setDieFace === 'function') setDieFace(e, finalDice[i]);
      });
      onDone();
    }
  }, 90);
}

/* ---------- 轮盘（复用赌场 canvas 轮盘 + 滚珠） ---------- */
function lcRouletteWheelHtml() {
  return '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:10px">' +
    '<div style="position:relative;width:min(200px,52vw);height:min(200px,52vw)">' +
    '<div style="position:absolute;top:-2px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-top:16px solid #d4af37;z-index:2;filter:drop-shadow(0 1px 2px rgba(0,0,0,.5))"></div>' +
    '<canvas id="lcRouletteWheel" width="280" height="280" style="width:100%;height:100%;display:block;border-radius:50%;box-shadow:0 0 0 4px #d4af37,0 6px 18px rgba(0,0,0,.45)"></canvas>' +
    '</div></div>';
}
function lcDrawRouletteWheel(ball) {
  const st = lifeCreationState;
  const canvas = document.getElementById('lcRouletteWheel');
  if (!canvas || typeof drawRouletteWheel !== 'function') return;
  let ballState = ball;
  if (ballState === undefined && typeof rouletteWheelGeom === 'function') {
    const geom = rouletteWheelGeom(canvas);
    ballState = { angle: -90, radius: geom.trackR, size: 6.5 };
  }
  drawRouletteWheel(canvas, (st && st.lcWheelRot) || 0, ballState);
}
function lcAnimateRouletteSpin(winNum, onDone) {
  const st = lifeCreationState;
  if (!st) return;
  const order = typeof ROULETTE_WHEEL !== 'undefined' ? ROULETTE_WHEEL : null;
  if (!order) { if (onDone) onDone(); return; }
  const idx = order.indexOf(winNum);
  const seg = 360 / order.length;
  const target = -(idx * seg + seg / 2) - 360 * (5 + Math.floor(Math.random() * 3));
  const start = st.lcWheelRot || 0;
  const t0 = performance.now();
  const duration = 3800;
  const rollEnd = 0.64;
  const ballRevolutions = 8 + Math.random() * 3;
  const canvas = document.getElementById('lcRouletteWheel');
  const geom = canvas && typeof rouletteWheelGeom === 'function' ? rouletteWheelGeom(canvas) : null;
  function frame(t) {
    const p = Math.min(1, (t - t0) / duration);
    const ease = 1 - Math.pow(1 - p, 3);
    const cur = start + (target - start) * ease;
    let ballState = null;
    if (geom) {
      if (p < rollEnd) {
        const rp = p / rollEnd;
        const rollE = 1 - Math.pow(1 - rp, 1.55);
        ballState = { angle: -90 + ballRevolutions * 360 * rollE, radius: geom.outerR, spin: rollE * ballRevolutions * Math.PI * 5, size: 6.8 };
      } else {
        const fp = (p - rollEnd) / (1 - rollEnd);
        const fallE = 1 - Math.pow(1 - fp, 2.85);
        const rollStop = -90 + ballRevolutions * 360;
        let radius = geom.outerR + (geom.trackR - geom.outerR) * fallE;
        if (fp > 0.72) radius += Math.sin((fp - 0.72) / 0.28 * Math.PI * 5) * 1.4 * (1 - fp) / 0.28;
        ballState = { angle: rollStop + (-90 - rollStop) * fallE, radius, spin: ballRevolutions * Math.PI * 5 * (1 - fp * 0.65), size: 6.5 - Math.sin(fp * Math.PI) * 0.35 };
      }
    }
    st.lcWheelRot = cur;
    lcDrawRouletteWheel(ballState);
    if (p < 1) requestAnimationFrame(frame);
    else if (onDone) onDone();
  }
  requestAnimationFrame(frame);
}
function lcRouletteTable() {
  const st = lifeCreationState;
  const pick = st.betPick;
  function cell(n) {
    const red = lcIsRed(n);
    const bg = n === 0 ? '#1b7a43' : (red ? '#c0392b' : '#1c1c1c');
    const sel = pick === 'n' + n;
    return '<div data-rlnum="' + n + '" onclick="lcPickRl(\'n' + n + '\')" class="lc-rl-cell" style="position:relative;flex:1;min-width:0;cursor:pointer;background:' + bg + ';color:#fff;border:1px solid rgba(255,255,255,.18);' +
      (sel ? 'outline:2px solid var(--yellow);outline-offset:-2px;z-index:2;' : '') +
      'font-size:.66rem;font-weight:700;text-align:center;padding:5px 0;border-radius:3px">' + n +
      (sel ? '<span style="position:absolute;top:-8px;left:50%;transform:translateX(-50%)">' + lcPlayerChip(22) + '</span>' : '') + '</div>';
  }
  let h = lcFeltOpen();
  h += lcRouletteWheelHtml();
  h += '<div style="display:flex;gap:6px;align-items:stretch">';
  h += '<div onclick="lcPickRl(\'n0\')" data-rlnum="0" class="lc-rl-cell" style="position:relative;cursor:pointer;width:34px;display:flex;align-items:center;justify-content:center;background:#1b7a43;color:#fff;border-radius:4px;font-weight:800;' + (pick === 'n0' ? 'outline:2px solid var(--yellow);outline-offset:-2px;' : '') + '">0' + (pick === 'n0' ? '<span style="position:absolute;top:-10px;left:50%;transform:translateX(-50%)">' + lcPlayerChip(22) + '</span>' : '') + '</div>';
  h += '<div style="flex:1;display:flex;flex-direction:column;gap:3px">';
  const rows = typeof ROULETTE_NUM_ROWS !== 'undefined' ? ROULETTE_NUM_ROWS : [[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36], [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35], [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]];
  rows.forEach(function (row) {
    h += '<div style="display:flex;gap:3px">' + row.map(cell).join('') + '</div>';
  });
  h += '</div></div>';
  h += '<div style="display:flex;gap:8px;margin-top:8px">';
  [['red', '红 · 生命', '#c0392b'], ['black', '黑 · 金钱', '#1c1c1c']].forEach(function (z) {
    const sel = pick === z[0];
    h += '<div onclick="lcPickRl(\'' + z[0] + '\')" style="flex:1;cursor:pointer;background:' + z[2] + ';color:#fff;text-align:center;padding:10px 0;border-radius:8px;font-weight:800;border:2px ' + (sel ? 'solid var(--yellow)' : 'solid rgba(255,255,255,.25)') + ';position:relative;min-height:52px;display:flex;align-items:center;justify-content:center">' + z[1] +
      (sel ? '<span style="position:absolute;top:-14px;left:50%;transform:translateX(-50%)">' + lcPlayerChip(28) + '</span>' : '') + '</div>';
  });
  h += '</div>';
  h += '</div>';
  return h;
}
function lcSpinRl() {
  const st = lifeCreationState;
  if (lcRolling || !st || !st.betPick) return;
  lcRolling = true;
  const n = spinRoulette();
  const actBtn = document.getElementById('lcRollBtn');
  if (actBtn) { actBtn.disabled = true; actBtn.textContent = '轮盘转动中…'; }
  lcAnimateRouletteSpin(n, function () {
    lcApplyRoulette(n);
  });
}

/* ---------- 渲染主流程 ---------- */
function renderLifeCreationStep() {
  const body = document.getElementById('lifeCreationBody');
  const acts = document.getElementById('lifeCreationActions');
  if (!body || !acts || !lifeCreationState) return;
  const st = lifeCreationState;
  let html = '', buttons = [];

  if (st.step === 0) {
    html = '<p><b>第一步 · 选择你的性别身份</b></p><p class="fold-meta">男 = 蓝色筹码 · 女 = 粉色筹码 · 不知道 = 随机并告知结果 · 筹码中心空白，仅颜色代表身份</p>';
    if (st.phase === 'genderResult') {
      html += lcFeltOpen() + '<div style="text-align:center;padding:8px 0">';
      html += lcGenderChip(st.playerGender, 64, '', true);
      html += '<p style="margin-top:10px;font-size:.88rem">' + st.resultText + '</p>';
      html += '<p class="fold-meta">你的身份筹码已确定 · ' + (st.playerGender === 'male' ? '蓝色' : '粉色') + '</p>';
      html += '</div></div>';
      buttons = [{ text: '继续 →', primary: true, handler: function () { lcAdvance(1); } }];
    } else {
      html += lcFeltOpen() + '<div style="display:flex;gap:14px;justify-content:center;align-items:flex-end;flex-wrap:wrap">';
      html += '<div onclick="lifeCreationPickGender(\'male\')" style="cursor:pointer;text-align:center">' + lcGenderChip('male', 60) + '<div style="margin-top:6px;font-size:.74rem">男（蓝）</div></div>';
      html += '<div onclick="lifeCreationPickGender(\'female\')" style="cursor:pointer;text-align:center">' + lcGenderChip('female', 60) + '<div style="margin-top:6px;font-size:.74rem">女（粉）</div></div>';
      html += '<div onclick="lifeCreationPickGender(\'random\')" style="cursor:pointer;text-align:center"><span class="casino-chip" style="--chip-edge:#9e9e9e;--chip-edge-dark:#616161;--chip-text:#424242;width:60px;height:60px"><span class="chip-val" style="color:#424242">？</span></span><div style="margin-top:6px;font-size:.74rem">不知道</div></div>';
      html += '</div></div>';
    }
  } else if (st.phase === 'gaokaoRetake' || st.phase === 'gaokaoRetakeDream' || st.phase === 'gaokaoRetakeBonus') {
    const isDream = st.phase === 'gaokaoRetakeDream';
    const isBonusOnly = st.phase === 'gaokaoRetakeBonus';
    const throwN = st.retakeThrowIdx || 0;
    html = '<p><b>高复 · 重掷高考分</b></p>';
    html += '<p class="fold-meta">第 ' + st.gaokaoRetakeCount + ' 次高复（+' + st.gaokaoRetakeYears + ' 年）· 仅更换高考分数，家世/性向/压力等不变。</p>';
    if (isDream) {
      html += '<p class="fold-meta">三投押中 ' + (st.retakeBetWins || 0) + ' 次 · <strong>梦想加投（第四投）</strong>：大=有梦想 · 小=不知道，开盅计入高考。</p>';
    } else if (isBonusOnly) {
      html += '<p class="fold-meta">三投押中 ' + (st.retakeBetWins || 0) + ' 次 · 加投仅计分（此前已有四次加骰，无梦想问答）。</p>';
    } else {
      html += '<p class="fold-meta">押大小开盅 · 第 ' + (throwN + 1) + ' / 3 投 · 押中≥2次可再加投一次。</p>';
      if (st._retakeHadFourthBefore) html += '<p style="color:var(--orange);margin:2px 0;font-size:.74rem">加投仅计分，无梦想问答。</p>';
      else html += '<p style="color:var(--green);margin:2px 0;font-size:.74rem">若加投且此前仅三投，将附带梦想问答。</p>';
    }
    html += lcFeltOpen();
    html += lcDiceTray(st.retakeAwaitContinue || st._retakeBonusDone ? st.lastDice : null);
    if (st.retakeAwaitContinue || st._retakeBonusDone) {
      html += '<div style="text-align:center;background:rgba(0,0,0,.28);border-radius:8px;padding:8px;margin-top:4px;font-size:.82rem">' + st.resultText + '</div>';
    } else {
      html += lcBigSmallZones();
    }
    if (st.gaokaoRolls && st.gaokaoRolls.length) {
      html += '<div style="background:rgba(0,0,0,.22);border-radius:8px;padding:8px;margin-top:6px;font-size:.72rem;line-height:1.55">';
      st.gaokaoRolls.forEach(function (d, i) {
        const lab = (st.gaokaoRollLabels && st.gaokaoRollLabels[i]) || ('第' + (i + 1) + '投');
        html += lab + '：' + d.join('×') + ' = <b>' + lcDiceScore(d) + '</b><br>';
      });
      html += lcGaokaoScoreBreakdownHtml(st) + '</div>';
    }
    html += '</div>';
    if (isDream || isBonusOnly) {
      if (st._retakeBonusDone) {
        buttons = [{ text: '查看高考结果 →', primary: true, handler: lcEnterGaokaoReview }];
      } else {
        buttons = [{ text: '🎲 加投开盅', primary: true, id: 'lcRollBtn', disabled: !st.betPick, handler: function () { lcRollRetakeBonus(isDream); } }];
      }
    } else if (st.retakeAwaitContinue) {
      buttons = [{ text: ((st.retakeThrowIdx || 0) >= 3 ? '结算本轮回 →' : '下一投 →'), primary: true, handler: lcRetakeAfterThrow }];
    } else {
      buttons = [{ text: '🎲 摇骰开盅', primary: true, id: 'lcRollBtn', disabled: !st.betPick, handler: lcRollRetakeDice }];
    }
  } else if (st.phase === 'gaokaoReview') {
    html = '<p><b>高考结算 · 是否满意？</b></p>';
    html += '<p class="fold-meta">' + (st.gaokaoBonus ? (st.gaokaoRetakeCount ? '高复重掷含加投。' : '三投及梦想加投已结束。') : (st.gaokaoRetakeCount ? '高复重掷三投已结束。' : '三投已结束，无第四次加投与梦想问答（前三步押中不足 2 次）。')) + '不满意可选择<strong>高复</strong>，每次多花一年（推迟离校、增加开局年龄）。最多高复 ' + (typeof GAOKAO_MAX_RETAKE !== 'undefined' ? GAOKAO_MAX_RETAKE : 7) + ' 次。</p>';
    if (st.gaokaoRetakeCount) {
      html += '<p style="color:var(--orange);margin:4px 0">已高复 ' + st.gaokaoRetakeCount + ' 次 · 累计多花 ' + st.gaokaoRetakeYears + ' 年</p>';
    }
    html += lcFeltOpen();
    if (st.gaokaoRolls && st.gaokaoRolls.length) {
      html += '<div style="background:rgba(0,0,0,.28);border-radius:8px;padding:8px;margin-top:4px;font-size:.76rem;line-height:1.65">';
      st.gaokaoRolls.forEach(function (d, i) {
        const lab = (st.gaokaoRollLabels && st.gaokaoRollLabels[i]) || (i < 3 ? ['性向', '财富', '实力'][i] : '梦想加投');
        html += lab + '：' + d.join('×') + ' = <b>' + lcDiceScore(d) + '</b><br>';
      });
      html += lcGaokaoScoreBreakdownHtml(st) + '</div>';
    }
    if (typeof renderGaokaoCutoffsHtml === 'function') html += renderGaokaoCutoffsHtml(st.gaokaoScore);
    if (typeof gaokaoNeedsForkChoice === 'function' && gaokaoNeedsForkChoice(st.gaokaoScore)) html += lcGaokaoForkHtml(st);
    html += lcGaokaoOutcomeHtml(st, false);
    html += '</div>';
    const left = (typeof GAOKAO_MAX_RETAKE !== 'undefined' ? GAOKAO_MAX_RETAKE : 7) - (st.gaokaoRetakeCount || 0);
    const forkBlock = typeof gaokaoNeedsForkChoice === 'function' && gaokaoNeedsForkChoice(st.gaokaoScore) && !st.gaokaoForkChoice;
    buttons = [{ text: '✓ 满意，继续', primary: true, disabled: forkBlock, handler: lcAcceptGaokao }];
    if (left > 0) {
      buttons.push({ text: '📚 高复（剩余 ' + left + ' 次 · +1 年）', handler: lcRetakeGaokao });
    }
  } else if (st.step >= 1 && st.step <= 3 || st.step === 5) {
    const cfg = lcDiceStepConfig(st.step);
    html = '<p><b>' + cfg.title + '</b></p><p class="fold-meta">' + cfg.sub + '</p>';
    if (st.gaokaoRetakeCount) {
      html += '<p style="color:var(--orange);margin:2px 0">高复第 ' + st.gaokaoRetakeCount + ' 轮 · 已多花 ' + st.gaokaoRetakeYears + ' 年</p>';
    }
    if (cfg.warn) html += '<p style="color:var(--orange);margin:2px 0">' + cfg.warn + '</p>';
    html += lcFeltOpen();
    html += lcDiceTray(st.phase === 'result' ? st.lastDice : null);
    if (st.phase === 'result') {
      html += '<div style="text-align:center;background:rgba(0,0,0,.28);border-radius:8px;padding:8px;margin-top:4px;font-size:.82rem">' + st.resultText + '</div>';
    } else {
      html += lcBigSmallZones();
    }
    html += '</div>';
    if (st.phase === 'result') {
      if (st.step === 5) {
        buttons = [{ text: '查看高考结果 →', primary: true, handler: lcEnterGaokaoReview }];
      } else {
        buttons = [{ text: '继续 →', primary: true, handler: function () { lcAdvance(cfg.next); } }];
      }
    } else {
      buttons = [{ text: '🎲 摇骰开盅', primary: true, id: 'lcRollBtn', disabled: !st.betPick, handler: function () { lcRollDiceBet(st.step); } }];
    }
  } else if (st.step === 4) {
    html = '<p><b>第五步 · 高考命运 · 创造命运</b></p>';
    if (st._gaokaoEligibleBonus) {
      html += '<p class="fold-meta"><b>前三步押中 ' + (st.gaokaoBetWins || st.betWinCount || 0) + ' 次。</b>下面为三投明细；<strong>最终高考分与录取待第六步梦想加投后再公布</strong>。</p>';
    } else {
      html += '<p class="fold-meta"><b>前三步押中 ' + (st.gaokaoBetWins || st.betWinCount || 0) + ' 次，不足 2 次。</b>无第四次加投，亦无梦想问答。下面三投即第二步～第四步已开盅的骰积，直接相加为高考分。</p>';
    }
    html += lcFeltOpen();
    if (st.gaokaoRolls && st.gaokaoRolls.length) {
      const labels = ['第二步 · 性向', '第三步 · 财富', '第四步 · 实力'];
      html += '<div style="background:rgba(0,0,0,.28);border-radius:8px;padding:8px;margin-top:4px;font-size:.76rem;line-height:1.65">';
      st.gaokaoRolls.forEach(function (d, i) {
        html += labels[i] + '：' + d.join('×') + ' = <b>' + lcDiceScore(d) + '</b><br>';
      });
      html += lcGaokaoScoreBreakdownHtml(st);
      if (st._gaokaoEligibleBonus) {
        html += '<br><span style="color:var(--green)">第六步梦想问答可<strong>加投一次</strong>（加投分直接计入总分，最高再 +216）</span>';
      }
      html += '</div>';
    }
    if (!st._gaokaoEligibleBonus && typeof renderGaokaoCutoffsHtml === 'function') html += renderGaokaoCutoffsHtml(st.gaokaoScore);
    if (st.resultText) {
      html += '<div style="text-align:center;background:rgba(0,0,0,.22);border-radius:8px;padding:8px;margin-top:6px;font-size:.82rem">' + st.resultText + '</div>';
    }
    html += '</div>';
    if (st._gaokaoEligibleBonus) {
      buttons = [{ text: '继续 · 梦想加投 →', primary: true, handler: function () { lcAdvance(5); } }];
    } else {
      buttons = [{ text: '查看高考结果 →', primary: true, handler: lcEnterGaokaoReview }];
    }
  } else if (st.step === 6) {
    html = '<p><b>第七步 · 轮盘赌 · 第一桶金</b></p><p class="fold-meta">把之前的身份筹码押在轮盘上。红 = 生命 · 黑 = 金钱 · 也可凶狠押单个数字 0-36。</p>';
    html += '<p style="color:var(--orange);margin:2px 0">告知：第一桶金很重要，当然活着才有命花钱。</p>';
    if (st.phase === 'result') {
      const r = st.roulette;
      html += lcFeltOpen();
      html += lcRouletteWheelHtml();
      html += '<div style="text-align:center;margin:6px 0;font-size:1.1rem;font-weight:800;color:var(--yellow)">开出 ' + (r.isZero ? '0 绿' : (r.isRed ? '红 ' + r.num : '黑 ' + r.num)) + '</div>';
      html += '<div style="text-align:center;background:rgba(0,0,0,.28);border-radius:8px;padding:8px;font-size:.82rem">' + st.resultText + '</div></div>';
      buttons = [{ text: '继续 →', primary: true, handler: function () { lcAdvance(7); } }];
    } else {
      html += lcRouletteTable();
      buttons = [{ text: '🎡 开转', primary: true, id: 'lcRollBtn', disabled: !st.betPick, handler: lcSpinRl }];
    }
  } else if (st.step === 7) {
    html = '<p><b>创造完成</b></p><pre style="white-space:pre-wrap;font-size:.78rem;line-height:1.55">' + lifeCreationSummaryText(st) + '</pre>' +
      '<p class="fold-meta">档案名 <input id="lifeSlotLabel" maxlength="20" placeholder="可留空" style="background:var(--bg);color:var(--text);border:1px solid var(--border);padding:4px 8px;border-radius:4px;width:200px"></p>';
    buttons = [{ text: '开始人生', primary: true, handler: finishLifeCreation }];
  }

  body.innerHTML = html;
  const modal = document.getElementById('lifeCreationModal');
  if (modal) modal.style.maxWidth = (st.step === 6 ? '640px' : '520px');
  if (st.step === 6) setTimeout(function () { lcDrawRouletteWheel(); }, 0);
  acts.innerHTML = '';
  if (st.step > 0 && st.step < 7 && st.phase !== 'result' && st.phase !== 'gaokaoReview' && st.phase !== 'gaokaoRetake' && st.phase !== 'gaokaoRetakeDream' && st.phase !== 'gaokaoRetakeBonus' && !lcRolling) {
    const back = document.createElement('button');
    back.className = 'btn'; back.textContent = '返回选档'; back.type = 'button';
    back.onclick = function () { closeLifeCreationWizard(); cancelCharCreate(); };
    acts.appendChild(back);
  }
  (buttons || []).forEach(function (b) {
    const btn = document.createElement('button');
    btn.className = 'btn' + (b.primary ? ' btn-primary' : '');
    btn.textContent = b.text;
    btn.type = 'button';
    if (b.id) btn.id = b.id;
    if (b.disabled) btn.disabled = true;
    btn.onclick = b.handler;
    acts.appendChild(btn);
  });
}

function lcDiceStepConfig(step) {
  if (step === 1) return { title: '第二步 · 你喜欢的性别', sub: '押 大 = 喜欢男人 · 押 小 = 喜欢女人', warn: '注意：此操作不能反悔，请慎重选择，你只有一个筹码，不能都押注。', next: 2 };
  if (step === 2) return {
    title: '第三步 · 创造命运 · 财富的负担',
    sub: '你希望你有钱吗？钱是不是越多越好？—— 有很多钱押大，少一点也好押小。这关乎物质与感情，也关乎财富带来的负担。',
    next: 3
  };
  if (step === 3) return {
    title: '第四步 · 实力还是压力 · 创造命运',
    sub: '你选择实力还是压力？不只是拳头，或者头脑才能，美貌也是实力的一种。大 = 实力 · 小 = 压力',
    warn: '此掷为高考第三投。若前三步押中≥2次，第六步梦想问答可再加投一次。',
    next: 4
  };
  return { title: '第六步 · 你有梦想吗？', sub: '大 = 有 · 小 = 不知道 · 前三步押中≥2次，本步开盅为高考加投（第四投）', next: 6 };
}

/* ---------- 交互 ---------- */
function lcPickSide(side) {
  const st = lifeCreationState;
  if (!st || lcRolling || st.retakeAwaitContinue || st._retakeBonusDone) return;
  if (st.phase === 'result') return;
  st.betPick = side;
  renderLifeCreationStep();
}
function lcPickRl(zone) {
  const st = lifeCreationState;
  if (!st || lcRolling || st.phase === 'result') return;
  st.betPick = zone;
  renderLifeCreationStep();
}
function lcGaokaoForkHtml(st) {
  const pick = st.gaokaoForkChoice;
  const line = typeof GAOKAO_LINES !== 'undefined' ? GAOKAO_LINES.bachelorFork : 480;
  let h = '<div style="margin-top:8px;padding:10px;background:rgba(210,153,34,.12);border:1px solid rgba(210,153,34,.35);border-radius:8px">';
  h += '<p style="margin:0 0 8px;font-size:.82rem"><b>达 ' + line + ' 线 · 同分同线，请二选一</b></p>';
  h += '<div style="display:flex;gap:8px;flex-wrap:wrap">';
  h += '<button type="button" class="btn' + (pick === 'normal_bachelor' ? ' btn-primary' : '') + '" onclick="lcPickGaokaoFork(\'normal_bachelor\')">🎓 普通本科</button>';
  h += '<button type="button" class="btn' + (pick === '985_associate' ? ' btn-primary' : '') + '" onclick="lcPickGaokaoFork(\'985_associate\')">🏫 985/211 重点大专</button>';
  h += '</div>';
  if (!pick) h += '<p class="fold-meta" style="margin:8px 0 0">选好后方可继续</p>';
  h += '</div>';
  return h;
}
function lcPickGaokaoFork(choice) {
  const st = lifeCreationState;
  if (!st) return;
  st.gaokaoForkChoice = choice;
  lcFinalizeGaokaoOutcome(st);
  renderLifeCreationStep();
}
function lcFinalizeGaokaoOutcome(st) {
  if (!st || typeof resolveGaokaoOutcome !== 'function') return;
  st.gaokaoOutcome = resolveGaokaoOutcome(st.gaokaoScore, st, (st.slot || 0) * 31 + 7);
}
function lcGaokaoOutcomeHtml(st, preview) {
  if (!st || !st.gaokaoOutcome) return '';
  const o = st.gaokaoOutcome;
  let h = '<div style="background:rgba(0,0,0,.28);border-radius:8px;padding:8px;margin-top:6px;font-size:.76rem;line-height:1.65">';
  h += (preview ? '【暂定】' : '【录取】') + ' <b style="color:var(--yellow)">' + o.education + '</b>';
  if (o.school && o.school !== 'none') h += ' · ' + o.schoolLabel;
  h += '<br>离校年份 ' + o.graduationYear + ' · 离校年龄 ' + o.startAge;
  if (o.gaokaoRetakeYears) h += '（含高复 ' + o.gaokaoRetakeYears + ' 年）';
  h += '<br><span class="fold-meta">' + o.summary + '</span>';
  if (o.needsForkChoice) h += '<br><span style="color:var(--orange)">达 480 线 · 请在下方选择普通本科或 985/211 重点大专</span>';
  else if (o.gaokaoForkChoice) h += '<br>去向：' + (typeof gaokaoForkLabels === 'function' ? gaokaoForkLabels(o.gaokaoForkChoice) : o.gaokaoForkChoice);
  if (preview && st._gaokaoEligibleBonus && !st.gaokaoBonus) h += '<br><span style="color:var(--orange)">第六步梦想加投尚未结算，最终分数与录取待定</span>';
  h += '</div>';
  return h;
}
function lcRecordCreationRoll(step, bet, dice) {
  const st = lifeCreationState;
  if (!st) return;
  const sum = diceSum(dice);
  const win = (bet === 'big') === diceIsBig(sum);
  st.creationRolls = st.creationRolls || [];
  st.creationRolls.push({ step: step, dice: dice.slice(), bet: bet, win: win });
  if (win) st.betWinCount = (st.betWinCount || 0) + 1;
  return win;
}
function lcBuildGaokaoFromCreationRolls(st) {
  const rolls = (st.creationRolls || []).filter(function (r) { return r.step >= 1 && r.step <= 3; });
  st.gaokaoRolls = rolls.map(function (r) { return r.dice; });
  st.gaokaoRollLabels = ['性向', '财富', '实力'];
  lcRecalcGaokaoScore(st);
  const winCount13 = rolls.filter(function (r) { return r.win; }).length;
  st.gaokaoBetWins = winCount13;
  st._gaokaoEligibleBonus = winCount13 >= 2;
  const wins = winCount13;
  if (wins === 3) st.statsMode = 'mind';
  else if (wins === 0) st.statsMode = 'body';
  const labels = ['性向', '财富', '实力'];
  st.resultText = '前三步开盅已计入高考：' + rolls.map(function (r, i) {
    return labels[i] + ' ' + r.dice.join('×') + '=' + lcDiceScore(r.dice);
  }).join(' · ') + '。<br>' + lcGaokaoScoreBreakdownHtml(st) +
    (st._gaokaoEligibleBonus ? ' · 押中 ' + winCount13 + ' 次，第六步可梦想加投' : ' · 押中 ' + winCount13 + ' 次，无加投与梦想问答');
  if (!st._gaokaoEligibleBonus) {
    lcApplyNoDreamSkip(st);
    lcFinalizeGaokaoOutcome(st);
  }
}
function lcApplyNoDreamSkip(st) {
  if (!st) return;
  st.hasDream = false;
  st.dreamSkipped = true;
  delete st.dreamBetWin;
  delete st.forceMajorPick;
  delete st.educationBoost;
  delete st.randomMajorPrefs;
  delete st.majorExpBonus;
}
function lcEnterGaokaoReview() {
  const st = lifeCreationState;
  if (!st) return;
  if (st.initialHadFourthThrow == null) {
    st.initialHadFourthThrow = !!(st.gaokaoBonus || ((st.gaokaoRolls || []).length >= 4));
  }
  st.phase = 'gaokaoReview';
  st.retakeAwaitContinue = false;
  st._retakeBonusDone = false;
  lcFinalizeGaokaoOutcome(st);
  renderLifeCreationStep();
}
function lcAcceptGaokao() {
  const st = lifeCreationState;
  if (!st) return;
  if (typeof gaokaoNeedsForkChoice === 'function' && gaokaoNeedsForkChoice(st.gaokaoScore) && !st.gaokaoForkChoice) return;
  st.gaokaoAccepted = true;
  if (!st._gaokaoEligibleBonus) lcApplyNoDreamSkip(st);
  lcAdvance(6);
}
function lcRetakeGaokao() {
  const st = lifeCreationState;
  if (!st) return;
  const max = typeof GAOKAO_MAX_RETAKE !== 'undefined' ? GAOKAO_MAX_RETAKE : 7;
  if ((st.gaokaoRetakeCount || 0) >= max) return;
  if (st.initialHadFourthThrow == null) {
    st.initialHadFourthThrow = !!(st.gaokaoBonus || ((st.gaokaoRolls || []).length >= 4));
  }
  st.gaokaoRetakeCount = (st.gaokaoRetakeCount || 0) + 1;
  st.gaokaoRetakeYears = (st.gaokaoRetakeYears || 0) + 1;
  st._retakeHadFourthBefore = !!(st.gaokaoBonus || ((st.gaokaoRolls || []).length >= 4));
  st.gaokaoRolls = [];
  st.gaokaoRollLabels = [];
  st.gaokaoScore = 0;
  st.gaokaoBaseScore = 0;
  st.gaokaoBonusPoints = 0;
  st.gaokaoBonus = false;
  st.gaokaoForkChoice = null;
  st.gaokaoOutcome = null;
  st.gaokaoAccepted = false;
  st.retakeRolls = [];
  st.retakeBetWins = 0;
  st.retakeThrowIdx = 0;
  st.retakeAwaitContinue = false;
  st._retakeBonusDone = false;
  st.phase = 'gaokaoRetake';
  st.betPick = null;
  st.lastDice = null;
  st.resultText = '';
  lcRolling = false;
  renderLifeCreationStep();
}
function lcRetakeThrowLabel(n) {
  return ['高复一投', '高复二投', '高复三投'][n] || ('高复第' + (n + 1) + '投');
}
function lcRollRetakeDice() {
  const st = lifeCreationState;
  if (!st || lcRolling || !st.betPick || st.phase !== 'gaokaoRetake') return;
  lcRolling = true;
  const btn = document.getElementById('lcRollBtn');
  if (btn) { btn.disabled = true; btn.textContent = '开盅中…'; }
  const dice = rollCreationDice();
  const idx = st.retakeThrowIdx || 0;
  lcAnimateDice(dice, function () {
    lcRolling = false;
    st.lastDice = dice;
    const sum = diceSum(dice);
    const win = (st.betPick === 'big') === diceIsBig(sum);
    st.retakeRolls = st.retakeRolls || [];
    st.retakeRolls.push({ dice: dice.slice(), bet: st.betPick, win: win });
    if (win) st.retakeBetWins = (st.retakeBetWins || 0) + 1;
    st.gaokaoRolls = st.gaokaoRolls || [];
    st.gaokaoRollLabels = st.gaokaoRollLabels || [];
    st.gaokaoRolls.push(dice.slice());
    st.gaokaoRollLabels.push(lcRetakeThrowLabel(idx));
    lcRecalcGaokaoScore(st);
    st.retakeThrowIdx = idx + 1;
    st.resultText = lcRetakeThrowLabel(idx) + '：' + dice.join('×') + ' = <b>' + lcDiceScore(dice) + '</b> · ' +
      (win ? '押中' : '未中') + '<br>' + lcGaokaoScoreBreakdownHtml(st);
    st.retakeAwaitContinue = true;
    renderLifeCreationStep();
  });
}
function lcRetakeAfterThrow() {
  const st = lifeCreationState;
  if (!st) return;
  st.retakeAwaitContinue = false;
  if ((st.retakeThrowIdx || 0) < 3) {
    st.betPick = null;
    st.lastDice = null;
    st.resultText = '';
    renderLifeCreationStep();
    return;
  }
  if ((st.retakeBetWins || 0) >= 2) {
    st.betPick = null;
    st.lastDice = null;
    st._retakeBonusDone = false;
    if (st._retakeHadFourthBefore) {
      st.phase = 'gaokaoRetakeBonus';
      st.resultText = '三投押中 ' + st.retakeBetWins + ' 次 · 请押大小进行加投（仅计分）。';
    } else {
      st.phase = 'gaokaoRetakeDream';
      st.resultText = '三投押中 ' + st.retakeBetWins + ' 次 · 梦想问答加投：大=有梦想 · 小=不知道。';
    }
    renderLifeCreationStep();
  } else {
    lcFinalizeGaokaoOutcome(st);
    lcEnterGaokaoReview();
  }
}
function lcRollRetakeBonus(withDream) {
  const st = lifeCreationState;
  if (!st || lcRolling || !st.betPick) return;
  lcRolling = true;
  const btn = document.getElementById('lcRollBtn');
  if (btn) { btn.disabled = true; btn.textContent = '开盅中…'; }
  const dice = rollCreationDice();
  lcAnimateDice(dice, function () {
    lcRolling = false;
    st.lastDice = dice;
    if (withDream) applyDream(st.betPick, dice);
    st.gaokaoRolls.push(dice.slice());
    st.gaokaoRollLabels.push(withDream ? '梦想加投' : '加投');
    st.gaokaoBonus = true;
    lcRecalcGaokaoScore(st);
    st._retakeBonusDone = true;
    st.resultText = (withDream ? '梦想加投' : '加投') + '：' + dice.join('×') + ' = <b>' + lcDiceScore(dice) + '</b><br>' + lcGaokaoScoreBreakdownHtml(st);
    if (withDream) st.resultText += '<br>' + (st.hasDream ? '你心怀梦想。' : '你尚不知方向。');
    lcFinalizeGaokaoOutcome(st);
    renderLifeCreationStep();
  });
}
function lcAdvance(nextStep) {
  const st = lifeCreationState;
  if (!st) return;
  st.step = nextStep;
  st.phase = 'bet';
  st.betPick = null;
  st.lastDice = null;
  if (nextStep !== 4) st.resultText = '';
  lcRolling = false;
  if (nextStep === 4) {
    lcBuildGaokaoFromCreationRolls(st);
    st.phase = 'result';
  }
  renderLifeCreationStep();
}
function lcRollDiceBet(step) {
  const st = lifeCreationState;
  if (!st || lcRolling || !st.betPick) return;
  lcRolling = true;
  const btn = document.getElementById('lcRollBtn');
  if (btn) { btn.disabled = true; btn.textContent = '开盅中…'; }
  const dice = rollCreationDice();
  lcAnimateDice(dice, function () {
    lcRolling = false;
    st.lastDice = dice;
    lcRecordCreationRoll(step, st.betPick, dice);
    if (step === 1) applyPreference(st.betPick, dice);
    else if (step === 2) applyFamily(st.betPick, dice);
    else if (step === 3) applyPower(st.betPick, dice);
    else if (step === 5) {
      applyDream(st.betPick, dice);
      if (st._gaokaoEligibleBonus) {
        st.gaokaoRolls = st.gaokaoRolls || [];
        st.gaokaoRollLabels = st.gaokaoRollLabels || ['性向', '财富', '实力'];
        st.gaokaoRolls.push(dice.slice());
        st.gaokaoRollLabels.push('梦想加投');
        st.gaokaoBonus = true;
        lcRecalcGaokaoScore(st);
        st.resultText += '<br>加投 +' + st.gaokaoBonusPoints + ' · ' + lcGaokaoScoreBreakdownHtml(st);
      }
      lcFinalizeGaokaoOutcome(st);
    }
    st.phase = 'result';
    renderLifeCreationStep();
  });
}

function lifeCreationPickGender(g) {
  const st = lifeCreationState;
  if (!st) return;
  if (g === 'random') {
    st.playerGender = Math.random() < 0.5 ? 'male' : 'female';
    st.genderRandom = true;
    st.chipColor = st.playerGender === 'male' ? 'blue' : 'pink';
    st.phase = 'genderResult';
    st.resultText = '随机结果：你将成为' + (st.playerGender === 'male' ? '男' : '女') + '性。';
    renderLifeCreationStep();
    return;
  }
  st.playerGender = g;
  st.genderRandom = false;
  st.chipColor = st.playerGender === 'male' ? 'blue' : 'pink';
  lcAdvance(1);
}

/* ---------- 结算逻辑（数值不变，仅由摇出的骰子驱动） ---------- */
function applyPreference(bet, dice) {
  const st = lifeCreationState;
  const sum = diceSum(dice), win = (bet === 'big') === diceIsBig(sum);
  st.preferredGender = bet === 'big' ? 'male' : 'female';
  st.prefBetWin = win;
  st.playerOrientation = 'bisexual';
  const liked = st.preferredGender === 'male' ? '男人' : '女人';
  const other = st.preferredGender === 'male' ? '女人' : '男人';
  st.resultText = (win ? '恭喜你，' : '不用担心，') + '你喜欢的还是' + liked + (win ? '。' : '，但你也会喜欢' + other + '。');
}
function lcFamilyTierLabel(tier) {
  return { rich: '物质优渥的家庭', normal: '寻常家境', poor: '拮据的起点' }[tier] || '寻常家境';
}
function applyFamily(bet, dice) {
  const st = lifeCreationState;
  const sum = diceSum(dice), big = diceIsBig(sum), win = (bet === 'big') === big;
  if (win) st.familyTier = bet === 'big' ? 'rich' : 'poor';
  else st.familyTier = bet === 'big' ? (Math.random() < 0.5 ? 'normal' : 'poor') : (Math.random() < 0.5 ? 'normal' : 'rich');
  st.familyPocketMoney = bet === 'big';
  st.parentFamiliarity = bet === 'big' ? 42 : 78;
  const stance = bet === 'big' ? '你押的是「钱越多越好」——物质与负担' : '你押的是「少一点也好」——感情与陪伴';
  st.resultText = stance + '。骰子落定：' + lcFamilyTierLabel(st.familyTier) +
    (st.familyPocketMoney ? ' · 家里会给零花钱，但亲子关系偏紧张' : ' · 家里不太给零花钱，但亲子关系更亲近');
}
function applyPower(bet, dice) {
  const st = lifeCreationState;
  const sum = diceSum(dice), big = diceIsBig(sum), win = (bet === 'big') === big;
  if (bet === 'big' && win) { st.baseStress = 100; st.statsMode = 'high'; }
  else if (bet === 'big' && !win) { st.baseStress = 50; st.statsMode = 'random'; }
  else if (bet === 'small' && !win) { st.baseStress = 0; st.statsMode = 'low'; }
  else { st.baseStress = 20 + Math.floor(Math.random() * 40); st.statsMode = 'mid'; }
  const modeLabel = { high: '高三维实力', random: '随机三维', low: '低三维但零压力', mid: '中等三维' }[st.statsMode] || st.statsMode;
  st.resultText = '起点：' + modeLabel + ' · 初始压力 ' + st.baseStress;
}
function applyDream(bet, dice) {
  const st = lifeCreationState;
  const sum = diceSum(dice), big = diceIsBig(sum), win = (bet === 'big') === big;
  st.hasDream = bet === 'big';
  st.dreamBetWin = win;
  let extra;
  if (bet === 'big' && win) { st.forceMajorPick = true; extra = '你能亲自选择心仪专业。'; }
  else if (bet === 'big' && !win) { st.educationBoost = 'master'; extra = st._gaokaoEligibleBonus ? '虽未如愿，加投后或可升至硕士。' : '虽未如愿；无第四次加投，本科止步，不继续深造。'; }
  else if (bet === 'small' && !win) { st.randomMajorPrefs = 3; extra = '人生将随机给你三个偏好专业。'; }
  else { st.majorExpBonus = 10; extra = '随缘亦有福，专业经验 +10。'; }
  st.resultText = (st.hasDream ? '你心怀梦想。' : '你尚不知方向。') + extra;
}

function lcApplyRoulette(n) {
  const st = lifeCreationState;
  if (!st) return;
  const isRed = lcIsRed(n), isZero = n === 0, isBlack = n > 0 && !isRed;
  if (st.betPick === 'red' || st.betPick === 'black') {
    st.roulette = { pick: st.betPick, num: n, isRed: isRed, isBlack: isBlack, isZero: isZero };
  } else {
    const k = parseInt(String(st.betPick).slice(1), 10);
    st.roulette = { pick: 'num', pickNum: k, num: n, isRed: isRed, isBlack: isBlack, isZero: isZero };
  }
  applyRouletteOutcome(st);
  st.resultText = lcRouletteResultText(st);
  lcRolling = false;
  st.phase = 'result';
  renderLifeCreationStep();
}
function lcRouletteResultText(st) {
  const r = st.roulette;
  const color = r.isZero ? '绿 0' : (r.isRed ? '红 ' + r.num : '黑 ' + r.num);
  let lines = ['开出 ' + color + '。'];
  if (r.pick === 'red' && r.isRed) lines.push('押红命中 · 预期寿命 +' + r.num + '（' + st.lifeExpectancy + '）');
  else if (r.pick === 'red' && r.isBlack) lines.push('押红落黑 · 预期寿命受损（' + st.lifeExpectancy + '）');
  else if (r.pick === 'black' && r.isBlack) lines.push('押黑命中 · 祖辈遗产 ¥' + (st.inheritancePending || 0).toLocaleString() + '（待父母离世）');
  else if (r.pick === 'black' && r.isRed) lines.push('押黑落红 · 第一桶金 +¥' + (r.num * 100000).toLocaleString() + '，但折寿少许');
  else if (r.pick === 'num' && r.num === r.pickNum) lines.push(r.isRed ? '单押命中红 · 命中注定的爱情将在第 ' + r.num + ' 年降临' : '单押命中黑 · 中得彩金 ¥1,000,000');
  else if (r.isZero) lines.push('开出 0 · 你获得一条命运线索');
  else lines.push('未中 · 命运自有安排');
  lines.push('初始现金 ¥' + (st.startCash || 0).toLocaleString() + ' · 预期寿命 ' + (st.lifeExpectancy || 80));
  return lines.join('<br>');
}

function applyRouletteOutcome(st) {
  const r = st.roulette;
  st.lifeExpectancy = 80 + Math.floor(Math.random() * 11) - 5;
  st.startCash = 5000;
  if (r.pick === 'red' && r.isRed) st.lifeExpectancy += r.num;
  else if (r.pick === 'red' && r.isBlack) st.lifeExpectancy = Math.max(40, st.lifeExpectancy - r.num);
  else if (r.pick === 'black' && r.isBlack) { st.inheritanceNum = r.num; st.inheritancePending = r.num * 100000; }
  else if (r.pick === 'black' && r.isRed) { st.startCash += r.num * 100000; st.lifeExpectancy = Math.max(40, st.lifeExpectancy - Math.floor(r.num / 2)); }
  else if (r.pick === 'num' && r.num === r.pickNum) {
    if (r.isRed) { st.destinyLove = true; st.destinyYear = r.num; }
    else { st.startCash += 1000000; st.lotteryNum = r.num; }
  } else if (r.isZero) st.destinyClue = true;
}

function lifeCreationSummaryText(st) {
  lcFinalizeGaokaoOutcome(st);
  const o = st.gaokaoOutcome || {};
  const grad = o.graduationYear || 2010;
  const age = o.startAge != null ? o.startAge : 22;
  return '性别：' + (st.playerGender === 'male' ? '男' : '女') + (st.genderRandom ? '（随机）' : '') +
    '\n性向：双性恋 · 偏好' + (st.preferredGender === 'male' ? '男性' : '女性') +
    '\n家境：' + lcFamilyTierLabel(st.familyTier) +
    (st.familyPocketMoney ? ' · 有零花钱' : ' · 重感情') +
    '\n原始压力：' + (st.baseStress || 0) + ' · 预期寿命：' + (st.lifeExpectancy || 80) +
    '\n高考：' + (st.gaokaoScore || 0) + (st.gaokaoBonus ? '（含加投）' : '') +
    (st.gaokaoRetakeCount ? ' · 高复 ' + st.gaokaoRetakeCount + ' 次（+' + st.gaokaoRetakeYears + ' 年）' : '') +
    ' → ' + (o.education || '—') + (o.school && o.school !== 'none' ? ' · ' + (o.schoolLabel || o.school) : '') +
    '\n初始现金：¥' + (st.startCash || 0).toLocaleString() +
    (st.inheritancePending ? '\n祖辈遗产（待父母离世）：¥' + st.inheritancePending.toLocaleString() : '') +
    (st.destinyLove ? '\n命中注定的爱情 · 毕业月将相遇' : '') +
    '\n\n' + grad + ' 年 · ' + age + ' 岁 · 离校还有一个月 · 寝室即将到期';
}
function finishLifeCreation() {
  const st = lifeCreationState;
  if (!st) return;
  const labelEl = document.getElementById('lifeSlotLabel');
  const slotLabel = labelEl ? labelEl.value : '';
  closeLifeCreationWizard();
  if (typeof createNewGameFromLifeCreation === 'function') {
    createNewGameFromLifeCreation(st.slot, st, slotLabel);
  }
}
