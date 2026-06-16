/* 网络 · 三圈层导航 · 可嵌套点击 — 由 build.js 注入 */
function canUseNetwork() {
  if (!game || game.gameOver) return false;
  if (typeof isPlayerImprisoned === 'function' && isPlayerImprisoned()) return false;
  if (typeof hasUsablePhone === 'function' && !hasUsablePhone() && !game.ownsComputer) return false;
  return !!(game.ownsComputer || (typeof hasUsablePhone === 'function' && hasUsablePhone()));
}

function ensureNetworkStack() {
  if (!game.networkStack || !game.networkStack.length) game.networkStack = ['player'];
}

function openNetworkPerson(id) {
  if (!canUseNetwork()) { addLog('需要手机或电脑才能使用网络', 'fail'); return; }
  if (typeof closeContactsModal === 'function') closeContactsModal();
  ensureNetworkStack();
  if (id === 'player') {
    game.networkStack = ['player'];
  } else if (game.networkStack[game.networkStack.length - 1] !== id) {
    game.networkStack.push(id);
  }
  game.networkFocusId = id;
  showTab('network');
  renderNetworkPanel();
}

function networkDrillPerson(id) {
  if (!id || id === 'player') { openNetworkPerson('player'); return; }
  openNetworkPerson(id);
}

function networkGoBack() {
  ensureNetworkStack();
  if (game.networkStack.length <= 1) {
    game.networkStack = ['player'];
    game.networkFocusId = 'player';
  } else {
    game.networkStack.pop();
    game.networkFocusId = game.networkStack[game.networkStack.length - 1];
  }
  renderNetworkPanel();
}

function networkPersonById(id) {
  if (id === 'player') {
    return {
      id: 'player',
      name: typeof stripForkSuffix === 'function' ? stripForkSuffix(game.playerName) : game.playerName,
      gender: game.playerGender,
      birthYear: game.birthYear,
      lifeExpectancy: game.lifeExpectancy,
      birthCity: game.playerCity || (typeof PLAYER_HOME_CITY !== 'undefined' ? PLAYER_HOME_CITY : '—'),
      jobTitle: game.employed && game.employment ? game.market[game.employment.jobIdx].title : '待业',
      company: game.employed && game.employment ? game.employment.company.name : '',
      familiarity: 100, attraction: 0,
      careerExp: (typeof ensurePlayerCareerExp === 'function' ? ensurePlayerCareerExp() : (game.careerExp || {})),
      hobbies: game.hobbies || [],
      hobbyExp: game.hobbyExp || {},
      majorExp: game.majorExp || {},
      major: game.playerMajor || null,
      dream: game.playerDream || null,
      circles: game.playerCircles || {},
      influence: game.playerInfluence || 8,
      eduHistory: typeof ensurePlayerEduHistory === 'function' ? ensurePlayerEduHistory() : (game.playerEduHistory || []),
      playerEducation: game.playerEducation,
      playerSchoolName: game.playerSchoolName
    };
  }
  const c = (game.contacts || []).find(function (x) { return x.id === id; });
  if (c) {
    if (typeof ensureContactDreamFields === 'function') ensureContactDreamFields(c);
    if (typeof ensureNpcThreeCircles === 'function') ensureNpcThreeCircles(c);
    if (typeof ensurePersonLifespan === 'function') ensurePersonLifespan(c);
  }
  return c;
}

function renderNetworkPanel() {
  const el = document.getElementById('networkPanel');
  if (!el || !game) return;
  if (!canUseNetwork()) {
    el.innerHTML = '<p style="color:var(--muted)">📡 网络需要手机或电脑。通讯录仅显示概况，详情请在此查看。</p>';
    return;
  }
  if (typeof migrateDreamSystem === 'function') migrateDreamSystem();
  if (typeof migrateSocialCircles === 'function') migrateSocialCircles();
  ensureNetworkStack();
  const focusId = game.networkFocusId || game.networkStack[game.networkStack.length - 1] || 'player';
  game.networkFocusId = focusId;
  el.innerHTML = renderNetworkPersonHub(focusId);
}

function renderNetworkPersonHub(id) {
  const p = networkPersonById(id);
  if (!p) return '<p>未找到人物</p>';
  const isPlayer = id === 'player';
  const gen = p.gender === 'female' ? '女' : p.gender === 'male' ? '男' : '—';
  const ori = p.orientation ? (typeof orientationLabel === 'function' ? orientationLabel(p.orientation) : p.orientation) : '—';
  const lifeLine = typeof personLifespanLine === 'function' ? personLifespanLine(p) : '';
  const displayName = typeof stripForkSuffix === 'function' ? stripForkSuffix(p.name) : p.name;

  let h = '';
  if (game.networkStack && game.networkStack.length > 1) {
    h += '<button type="button" class="btn" style="margin-bottom:8px" onclick="networkGoBack()">← 返回上一层</button>';
  }
  if (!isPlayer) {
    h += '<button type="button" class="btn" style="margin-bottom:8px;margin-left:6px" onclick="openNetworkPerson(\'player\')">🏠 回到我的网络</button>';
  }

  h += '<div style="padding:10px;background:var(--card);border-radius:10px;border:1px solid var(--border);margin-bottom:10px">';
  h += '<h3 style="margin:0 0 6px">' + displayName + (isPlayer ? ' <span class="fold-meta">（你）</span>' : '') + '</h3>';
  h += '<p class="fold-meta" style="margin:0"><b>' + lifeLine + '</b></p>';
  h += '<p class="fold-meta" style="margin:4px 0 0">' + gen + ' · ' + (p.birthCity || '—') + ' · 性向 ' + ori + '</p>';
  if (p.influence != null) h += '<p class="fold-meta">公众影响力 ' + p.influence + '</p>';
  h += '<p style="margin:6px 0 0;font-size:.85rem"><b>职业</b> ' + (p.jobTitle || '—') + (p.company ? ' @ ' + p.company : '') + '</p>';
  h += '</div>';

  if (typeof renderEduHistoryHtml === 'function') {
    const eh = p.eduHistory || (isPlayer && game.playerEduHistory) || [];
    if (eh.length) h += renderEduHistoryHtml(eh);
  }

  if (typeof renderPersonExperienceHtml === 'function') {
    h += renderPersonExperienceHtml(isPlayer ? null : p, isPlayer);
  } else if (isPlayer && typeof playerIndustryExperienceHtml === 'function') {
    h += playerIndustryExperienceHtml();
  }

  if (p.dream) {
    h += '<div style="margin-bottom:10px;padding:8px;background:var(--bg);border-radius:8px">';
    h += '<b>理想</b>「' + p.dream.title + '」→ ' + p.dream.career;
    if (p.dream.active) h += ' <span style="color:var(--green)">· 进行中 ' + (p.dream.progress || 0) + '%</span>';
    if (p.dream.completed) h += ' <span style="color:var(--green)">· 已实现</span>';
    if (!isPlayer && p.dream.active && !p.dream.completed) {
      const eid = escNetId(id);
      h += '<div style="margin-top:6px"><button type="button" class="btn" style="font-size:.72rem;margin:2px" onclick="operateOnIdeal(\'' + eid + '\')">⚙ 运营一周</button>';
      const has = typeof findIdealContract === 'function' && findIdealContract(id);
      if (!has) h += '<button type="button" class="btn" style="font-size:.72rem;margin:2px" onclick="acceptIdealWorkContract(\'' + eid + '\')">📋 项目制接单</button>';
      h += '</div>';
    }
    if (!isPlayer && !p.dream.active && !p.dream.completed) {
      h += '<button type="button" class="btn" style="font-size:.72rem;margin-top:4px" onclick="sponsorContactIdeal(\'' + escNetId(id) + '\',1)">✨ 赞助理想</button>';
    }
    h += '</div>';
  }

  h += '<p class="fold-meta" style="margin:0 0 6px">点击脑图节点或成员卡片，可继续查看 TA 的三层圈子 · 连线表示同圈相识</p>';
  if (typeof renderThreeCirclesHub === 'function') {
    h += renderThreeCirclesHub(id);
  } else {
    h += '<p class="fold-meta">圈子模块加载中…</p>';
  }
  return h;
}

function escNetId(id) {
  return String(id || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
