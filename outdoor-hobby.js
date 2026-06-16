/* 外出伙伴 · 爱好圈周期项目 — 由 build.js 注入 */
const OUTDOOR_COMPANION_MAX = 3;
const HOBBY_PROJECT_MIN_WEEKS = 4;
const HOBBY_PROJECT_MAX_WEEKS = 10;

function ensureOutdoorCompanionState() {
  if (!game) return;
  if (!game.daily) game.daily = typeof defaultDailyState === 'function' ? defaultDailyState() : {};
  if (!game.daily.outCompanionIds) game.daily.outCompanionIds = [];
  if (!game.playerCircles) game.playerCircles = { social: [], hobby: [], workplace: [] };
  if (!game.hobbyProjects) game.hobbyProjects = [];
}

function outdoorCompanionCandidates() {
  if (!game || !game.contacts) return [];
  return game.contacts.filter(function (c) {
    if (c.dead) return false;
    if (typeof isCoreContact === 'function' && isCoreContact(c) && c.kind !== 'bff') return false;
    if (typeof ensureContactSocialFields === 'function') ensureContactSocialFields(c);
    return (c.familiarity || 0) >= 60;
  });
}

function renderOutdoorCompanionPicker() {
  ensureOutdoorCompanionState();
  const picked = game.daily.outCompanionIds || [];
  const cands = outdoorCompanionCandidates();
  let h = '<p class="fold-meta" style="margin:6px 0">同行伙伴（0～' + OUTDOOR_COMPANION_MAX + ' 人 · 已选 ' + picked.length + '）</p>';
  if (!cands.length) {
    h += '<p class="fold-meta">暂无熟悉度≥60的朋友可邀</p>';
    return h;
  }
  cands.slice(0, 12).forEach(function (c) {
    const on = picked.indexOf(c.id) >= 0;
    const name = typeof contactDisplayName === 'function' ? contactDisplayName(c) : c.name;
    const eid = String(c.id).replace(/'/g, "\\'");
    h += '<button type="button" class="btn" style="font-size:.72rem;margin:2px;padding:3px 8px;' + (on ? 'border-color:var(--green)' : '') + '" onclick="toggleOutdoorCompanion(\'' + eid + '\')">' +
      (on ? '✓ ' : '') + name + '</button> ';
  });
  if (picked.length) h += '<button type="button" class="btn" style="font-size:.72rem;margin-top:4px" onclick="clearOutdoorCompanions()">清空同行</button>';
  return h;
}

function toggleOutdoorCompanion(id) {
  ensureOutdoorCompanionState();
  const arr = game.daily.outCompanionIds;
  const i = arr.indexOf(id);
  if (i >= 0) arr.splice(i, 1);
  else {
    if (arr.length >= OUTDOOR_COMPANION_MAX) { addLog('最多邀请 ' + OUTDOOR_COMPANION_MAX + ' 位同行伙伴', 'fail'); return; }
    arr.push(id);
  }
  if (typeof renderDailyPanel === 'function') renderDailyPanel();
}

function clearOutdoorCompanions() {
  ensureOutdoorCompanionState();
  game.daily.outCompanionIds = [];
  if (typeof renderDailyPanel === 'function') renderDailyPanel();
}

function applyOutdoorCompanions(placeLabel) {
  ensureOutdoorCompanionState();
  const ids = game.daily.outCompanionIds || [];
  if (!ids.length) return;
  ids.forEach(function (cid) {
    const c = typeof findContact === 'function' ? findContact(cid) : (game.contacts || []).find(function (x) { return x.id === cid; });
    if (!c || c.dead) return;
    if (typeof ensureContactSocialFields === 'function') ensureContactSocialFields(c);
    c.familiarity = Math.min(100, (c.familiarity || 0) + 1);
    if (typeof ensureContactDreamFields === 'function') ensureContactDreamFields(c);
    if (typeof addCircleMember === 'function' && game.playerCircles && game.playerCircles.hobby && game.playerCircles.hobby[0]) {
      addCircleMember(game.playerCircles.hobby[0], c.id, { familiarity: c.familiarity, attraction: c.attraction || 30 });
    }
  });
  game.hobbyAttendedWeek = game.week;
  addLog('🚶 与 ' + ids.length + ' 位伙伴同游「' + placeLabel + '」· 熟悉度+1', 'info');
  if (typeof maybeTellWorkplaceStory === 'function' && Math.random() < 0.38) {
    const wpIds = ids.filter(function (cid) {
      const x = typeof findContact === 'function' ? findContact(cid) : null;
      if (!x) return false;
      if (x.kind === 'colleague' || x.metWhere === '职场' || x.metWhere === '入职') return true;
      const circles = game.playerCircles && game.playerCircles.workplace;
      if (!circles) return false;
      return circles.some(function (circle) {
        return (circle.members || []).some(function (m) { return m.id === cid; });
      });
    });
    if (wpIds.length) {
      const pickId = wpIds[Math.floor(Math.random() * wpIds.length)];
      const buddy = typeof findContact === 'function' ? findContact(pickId) : null;
      if (buddy) {
        buddy.company = buddy.company || (game.employment && game.employment.company ? game.employment.company.name : '');
        maybeTellWorkplaceStory(buddy, placeLabel, null);
      }
    }
  }
  if (typeof tryOutdoorCompanionBanter === 'function') tryOutdoorCompanionBanter(placeLabel, ids);
}

function playerHobbyCircle() {
  if (!game || !game.playerCircles || !game.playerCircles.hobby || !game.playerCircles.hobby.length) return null;
  return game.playerCircles.hobby[0];
}

function startHobbyCircleProject(theme) {
  ensureOutdoorCompanionState();
  const circle = playerHobbyCircle();
  if (!circle) { addLog('暂无爱好圈', 'fail'); return; }
  const active = (game.hobbyProjects || []).find(function (p) { return p.status === 'active'; });
  if (active) { addLog('已有进行中的爱好项目「' + active.name + '」', 'fail'); return; }
  const themes = typeof HOBBY_THEMES !== 'undefined' ? HOBBY_THEMES : ['旅行', '美食', '摄影', '音乐'];
  const t = theme || themes[Math.floor(Math.random() * themes.length)];
  const weeks = HOBBY_PROJECT_MIN_WEEKS + Math.floor(Math.random() * (HOBBY_PROJECT_MAX_WEEKS - HOBBY_PROJECT_MIN_WEEKS + 1));
  const proj = {
    id: 'hp_' + game.week + '_' + Math.random().toString(36).slice(2, 6),
    name: t + '小企划', theme: t, circleId: circle.id,
    startWeek: game.week, durationWeeks: weeks, progressWeeks: 0, attendedWeeks: 0,
    requiredAttend: Math.max(2, Math.ceil(weeks * 0.55)), status: 'active'
  };
  game.hobbyProjects.push(proj);
  if (!circle.projects) circle.projects = [];
  circle.projects.push({ id: proj.id, name: proj.name, status: 'active' });
  addLog('🎯 爱好圈启动「' + proj.name + '」· 周期 ' + weeks + ' 周 · 需参与 ≥' + proj.requiredAttend + ' 次外出', 'success');
}

function tickHobbyCircleProjects() {
  if (!game || game.gameOver) return;
  ensureOutdoorCompanionState();
  (game.hobbyProjects || []).forEach(function (p) {
    if (p.status !== 'active') return;
    p.progressWeeks = (p.progressWeeks || 0) + 1;
    if (game.hobbyAttendedWeek === game.week) p.attendedWeeks = (p.attendedWeeks || 0) + 1;
    if (p.progressWeeks < p.durationWeeks) return;
    if ((p.attendedWeeks || 0) < p.requiredAttend) {
      p.status = 'aborted';
      addLog('💨 爱好项目「' + p.name + '」流产（参与不足）', 'warn');
      return;
    }
    const roll = Math.random();
    if (roll < 0.35) {
      p.status = 'fail';
      addLog('😞 爱好项目「' + p.name + '」失败', 'warn');
      const hd = 1 + Math.floor(Math.random() * 2);
      if (typeof bumpPlayerHobbyExp === 'function') bumpPlayerHobbyExp(p.theme, hd);
    } else {
      p.status = 'success';
      const delta = 3 + Math.floor(Math.random() * 8);
      addLog('🎉 爱好项目「' + p.name + '」成功 · 爱好经验 +' + delta, 'success');
      if (typeof bumpPlayerHobbyExp === 'function') bumpPlayerHobbyExp(p.theme, delta);
      const circle = playerHobbyCircle();
      if (circle && circle.members) {
        circle.members.forEach(function (m) {
          if (!m.id || m.id === 'player') return;
          const c = typeof findContact === 'function' ? findContact(m.id) : null;
          if (c && typeof bumpContactHobbyExp === 'function') bumpContactHobbyExp(c, p.theme, Math.max(1, Math.floor(delta * 0.6)));
        });
      }
    }
    const circle = playerHobbyCircle();
    if (circle && circle.projects) {
      const cp = circle.projects.find(function (x) { return x.id === p.id; });
      if (cp) cp.status = p.status;
    }
  });
}

function hobbyProjectsSummaryHtml() {
  const active = (game.hobbyProjects || []).filter(function (p) { return p.status === 'active'; });
  if (!active.length) return '';
  const p = active[0];
  return '<p class="fold-meta" style="color:var(--accent)">🎯 爱好项目「' + p.name + '」' + p.progressWeeks + '/' + p.durationWeeks + ' 周 · 已参与 ' + (p.attendedWeeks || 0) + '/' + p.requiredAttend + '</p>';
}

function patchRenderDailyOutMenu(baseFn) {
  if (typeof baseFn !== 'function') return;
  window._renderDailyOutMenuBase = baseFn;
  window.renderDailyOutMenu = function (phase) {
    return renderOutdoorCompanionPicker() + baseFn(phase) + hobbyProjectsSummaryHtml();
  };
}
