/* 网络 · 三圈层导航 · 可嵌套点击 — 由 build.js 注入 */
function canViewFullNetwork() {
  if (!game || game.gameOver) return false;
  if (typeof isPlayerImprisoned === 'function' && isPlayerImprisoned()) return false;
  if (typeof ensurePhoneState === 'function') ensurePhoneState();
  if (game.ownsComputer) return true;
  if (typeof hasUsablePhone === 'function' && hasUsablePhone() && game.phone && game.phone !== 'nokia') return true;
  return false;
}

function networkLimitedHintHtml() {
  const phoneName = game.phone && typeof PHONE_SHOP !== 'undefined' && PHONE_SHOP[game.phone]
    ? PHONE_SHOP[game.phone].name : '当前手机';
  if (game.phone === 'nokia') {
    return '<p class="fold-meta" style="margin:12px 0;padding:8px;background:var(--bg);border-radius:8px;border:1px dashed var(--border)">' +
      '📱 ' + phoneName + ' 只能查看本人资料 · 换智能手机或购入电脑后可浏览关系网与他人详情</p>';
  }
  return '<p class="fold-meta" style="margin:12px 0;padding:8px;background:var(--bg);border-radius:8px;border:1px dashed var(--border)">' +
    '📡 需智能手机（非诺基亚）或电脑 · 才能浏览关系网与他人详情</p>';
}

function ensurePlayerNetworkCircles() {
  if (!game) return;
  if (!game.playerCircles || typeof game.playerCircles !== 'object' || Array.isArray(game.playerCircles)) {
    game.playerCircles = { social: [], hobby: [], workplace: [], friends: [], family: [] };
  }
  if (typeof migrateSocialCircles === 'function') migrateSocialCircles();
  const pc = game.playerCircles;
  const socialEmpty = !pc.social || !pc.social.length || pc.social.every(function (circle) {
    return !circle.members || circle.members.filter(function (m) { return m.id && m.id !== 'player'; }).length === 0;
  });
  if (socialEmpty && typeof populatePlayerSchoolCircles === 'function') populatePlayerSchoolCircles(true);
  if ((!pc.hobby || !pc.hobby.length) && typeof populatePlayerSchoolCircles === 'function') populatePlayerSchoolCircles(false);
}

function ensureNetworkStack() {
  if (!game.networkStack || !game.networkStack.length) game.networkStack = ['player'];
}

function openNetworkPerson(id) {
  if (typeof closeContactsModal === 'function') closeContactsModal();
  if (id !== 'player' && !canViewFullNetwork()) {
    addLog('需要智能手机（非诺基亚）或电脑才能查看关系网', 'fail');
    id = 'player';
  }
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
  if (!canViewFullNetwork()) { addLog('需要智能手机（非诺基亚）或电脑才能查看他人', 'fail'); return; }
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
    if (typeof migrateDreamSystem === 'function') migrateDreamSystem();
    else {
      if (typeof ensurePlayerHobbies === 'function') ensurePlayerHobbies();
      if (typeof ensurePlayerMajorExp === 'function') ensurePlayerMajorExp();
      if (typeof seedPlayerCareerFromMajor === 'function') seedPlayerCareerFromMajor();
      if (typeof migratePlayerCareerExp === 'function') migratePlayerCareerExp();
    }
    return {
      id: 'player',
      name: typeof stripForkSuffix === 'function' ? stripForkSuffix(game.playerName) : game.playerName,
      gender: game.playerGender,
      birthYear: game.birthYear,
      lifeExpectancy: game.lifeExpectancy,
      birthCity: game.playerCity || (typeof PLAYER_HOME_CITY !== 'undefined' ? PLAYER_HOME_CITY : '—'),
      jobTitle: game.employed && game.employment && game.market && game.market[game.employment.jobIdx]
        ? game.market[game.employment.jobIdx].title : '待业',
      company: game.employed && game.employment && game.employment.company ? game.employment.company.name : '',
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
  if (typeof migrateDreamSystem === 'function') migrateDreamSystem();
  ensurePlayerNetworkCircles();
  ensureNetworkStack();
  let focusId = game.networkFocusId || game.networkStack[game.networkStack.length - 1] || 'player';
  if (focusId !== 'player' && !canViewFullNetwork()) {
    focusId = 'player';
    game.networkFocusId = 'player';
    game.networkStack = ['player'];
  }
  game.networkFocusId = focusId;
  el.innerHTML = renderNetworkPersonHub(focusId);
}

function renderNetworkPersonHub(id) {
  const p = networkPersonById(id);
  if (!p) return '<p>未找到人物</p>';
  const isPlayer = id === 'player';
  const fullNet = canViewFullNetwork();
  const gen = p.gender === 'female' ? '女' : p.gender === 'male' ? '男' : '—';
  const ori = p.orientation ? (typeof orientationLabel === 'function' ? orientationLabel(p.orientation) : p.orientation) : '—';
  const lifeLine = typeof personLifespanLine === 'function' ? personLifespanLine(p) : '';
  const displayName = typeof stripForkSuffix === 'function' ? stripForkSuffix(p.name) : p.name;

  let h = '';
  if (fullNet && game.networkStack && game.networkStack.length > 1) {
    h += '<button type="button" class="btn" style="margin-bottom:8px" onclick="networkGoBack()">← 返回上一层</button>';
  }
  if (fullNet && !isPlayer) {
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
    h += renderPersonExperienceHtml(p, isPlayer);
  } else if (isPlayer && typeof playerIndustryExperienceHtml === 'function') {
    h += playerIndustryExperienceHtml();
  }

  if (p.dream) {
    h += '<div style="margin-bottom:10px;padding:8px;background:var(--bg);border-radius:8px">';
    h += '<b>理想</b>「' + p.dream.title + '」→ ' + p.dream.career;
    if (p.dream.active) h += ' <span style="color:var(--green)">· 进行中 ' + (p.dream.progress || 0) + '%</span>';
    if (p.dream.completed) h += ' <span style="color:var(--green)">· 已实现</span>';
    if (fullNet && !isPlayer && p.dream.active && !p.dream.completed) {
      const eid = escNetId(id);
      h += '<div style="margin-top:6px"><button type="button" class="btn" style="font-size:.72rem;margin:2px" onclick="operateOnIdeal(\'' + eid + '\')">⚙ 运营一周</button>';
      const has = typeof findIdealContract === 'function' && findIdealContract(id);
      if (!has) h += '<button type="button" class="btn" style="font-size:.72rem;margin:2px" onclick="acceptIdealWorkContract(\'' + eid + '\')">📋 项目制接单</button>';
      h += '</div>';
    }
    if (fullNet && !isPlayer && !p.dream.active && !p.dream.completed) {
      h += '<button type="button" class="btn" style="font-size:.72rem;margin-top:4px" onclick="sponsorContactIdeal(\'' + escNetId(id) + '\',1)">✨ 赞助理想</button>';
    }
    h += '</div>';
  }

  if (fullNet && !isPlayer && !p.dead && typeof relationshipContactActionButtons === 'function') {
    h += '<div style="margin-top:8px">' + relationshipContactActionButtons(p, escNetId(id)) + '</div>';
  }

  if (fullNet && typeof renderThreeCirclesHub === 'function') {
    h += renderThreeCirclesHub(id);
  } else if (isPlayer) {
    h += networkLimitedHintHtml();
  }

  return h;
}

function escNetId(id) {
  return String(id || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
