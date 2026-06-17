/* 社交圈 · 关系脑图 · 网络三圈层 — 由 build.js 注入 */
const SCHOOL_RING_DEFS = [
  { id: 'ps_soc_0', name: '小学同学圈', cohort: 0 },
  { id: 'ps_soc_1', name: '初中同学圈', cohort: 1 },
  { id: 'ps_soc_2', name: '高中同学圈', cohort: 2 },
  { id: 'ps_soc_3', name: '大学同学圈', cohort: 3 }
];
const CIRCLE_KIND_LABELS = { family: '家族圈', friends: '朋友圈', social: '社交圈', hobby: '爱好圈', workplace: '职场圈' };

function getContactAge(c) {
  if (!c) return null;
  if (c.id === 'player' && typeof getPlayerAge === 'function') return getPlayerAge();
  if (c.kind === 'child' || String(c.id || '').indexOf('child_') === 0) {
    const ch = typeof findChildRecord === 'function' ? findChildRecord(c.id) : null;
    if (ch && typeof getChildAgeYears === 'function') return getChildAgeYears(ch);
  }
  if (c.birthYear == null) return c.age != null ? c.age : null;
  const startYear = typeof LIFESPAN_GAME_START_YEAR !== 'undefined' ? LIFESPAN_GAME_START_YEAR : 2010;
  return startYear - c.birthYear + Math.floor(((game && game.week) || 0) / 52);
}

function stripForkSuffix(s) {
  let t = String(s || '').trim();
  while (/\s*·\s*分岔\d*$/.test(t)) t = t.replace(/\s*·\s*分岔\d*$/, '').trim();
  return t;
}

function escNetId(id) {
  return String(id || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function ensurePersonLifespan(p) {
  if (!p || p.dead) return p;
  if (p.id === 'player') {
    if (typeof initPlayerLifespan === 'function') initPlayerLifespan(null);
    return p;
  }
  if (typeof initContactLifespan === 'function') initContactLifespan(p, ((p.id || '') + (game.stockSeed || 0)).length * 31);
  return p;
}

function personLifespanLine(p) {
  if (!p) return '—';
  if (p.dead) return '已离世';
  ensurePersonLifespan(p);
  if (p.id === 'player') {
    const age = typeof getPlayerAge === 'function' ? getPlayerAge() : 22;
    return age + '岁 · 预期寿命 ' + (game.lifeExpectancy != null ? game.lifeExpectancy : '?') + ' 岁';
  }
  if (p.kind === 'child' || String(p.id || '').indexOf('child_') === 0) {
    const ch = typeof findChildRecord === 'function' ? findChildRecord(p.id) : null;
    if (ch) {
      const ageLbl = typeof formatChildAge === 'function' ? formatChildAge(ch) : (getContactAge(p) + '岁');
      const bd = typeof getChildBirthDateStr === 'function' ? getChildBirthDateStr(ch) : '';
      return (bd ? '生于 ' + bd + ' · ' : '') + '现年 ' + ageLbl;
    }
  }
  const age = getContactAge(p);
  const exp = p.lifeExpectancy != null ? p.lifeExpectancy : '?';
  if (age != null) return age + '岁 · 预期寿命 ' + exp + ' 岁';
  return '预期寿命 ' + exp + ' 岁';
}

function circleMemberContact(memberId, ownerId) {
  if (!memberId || memberId === 'player') {
    return {
      id: 'player', name: stripForkSuffix(game.playerName) || '你',
      familiarity: 100, attraction: 0, gender: game.playerGender,
      birthYear: game.birthYear, lifeExpectancy: game.lifeExpectancy
    };
  }
  if (memberId === ownerId) {
    const c = (game.contacts || []).find(function (x) { return x.id === ownerId; });
    return c || null;
  }
  return (game.contacts || []).find(function (c) { return c.id === memberId; }) || null;
}

function generateClassmateNpc(ringId, index, cohort) {
  const seed = ((game.stockSeed || 1) + ringId.length * 97 + index * 13 + cohort * 31) | 0;
  const rng = typeof dreamRng === 'function' ? dreamRng(seed) : Math.random;
  const gender = rng() < 0.5 ? 'male' : 'female';
  const surname = typeof namePick === 'function' ? namePick(typeof SURNAME_100 !== 'undefined' ? SURNAME_100 : ['王', '李', '张'], rng) : '赵';
  const given = typeof composeGivenPart === 'function' ? composeGivenPart(gender, rng) : (gender === 'male' ? '伟' : '娜');
  const name = surname + given;
  const id = 'mate_' + ringId + '_' + index;
  const birthYear = (game.birthYear || 1988) + Math.floor(rng() * 3) - 1 + (cohort > 2 ? 0 : -1);
  const contact = {
    id: id, kind: 'classmate', name: name, gender: gender, birthYear: birthYear,
    jobTitle: '学生', company: '', metWhere: SCHOOL_RING_DEFS[cohort].name,
    familiarity: 55 + Math.floor(rng() * 25), attraction: 15 + Math.floor(rng() * 35),
    orientation: typeof rollContactOrientation === 'function' ? rollContactOrientation(gender) : 'bisexual',
    circles: { social: [], hobby: [], workplace: [] }
  };
  if (typeof ensureCoreContact === 'function') ensureCoreContact(id, contact);
  else {
    const exists = (game.contacts || []).find(function (c) { return c.id === id; });
    if (!exists) { game.contacts = game.contacts || []; game.contacts.push(contact); }
  }
  const c = typeof findContact === 'function' ? findContact(id) : contact;
  if (c && typeof ensureContactDreamFields === 'function') ensureContactDreamFields(c);
  if (c && typeof initContactLifespan === 'function') initContactLifespan(c, seed);
  return c || contact;
}

function generateNpcAcquaintance(ownerId, tag, index) {
  const seed = ((ownerId || '').length * 41 + (tag || '').length * 17 + index * 13) | 0;
  const rng = typeof dreamRng === 'function' ? dreamRng(seed) : Math.random;
  const gender = rng() < 0.5 ? 'male' : 'female';
  const id = 'npc_' + String(ownerId).replace(/[^a-z0-9_]/gi, '').slice(0, 12) + '_' + tag + '_' + index;
  const exists = (game.contacts || []).find(function (c) { return c.id === id; });
  if (exists) return exists;
  const name = typeof pickStrangerDisplayName === 'function' ? pickStrangerDisplayName(gender) : ('友人' + index);
  const c = {
    id: id, kind: 'acquaintance', name: name, gender: gender,
    birthYear: (game.birthYear || 1988) + Math.floor(rng() * 8) - 4,
    jobTitle: ['设计师', '销售', '教师', '店员', '工程师'][Math.floor(rng() * 5)],
    company: ['本地公司', '创业公司', '事业单位', ''][Math.floor(rng() * 4)],
    metWhere: '朋友介绍', familiarity: 40 + Math.floor(rng() * 30), attraction: 10 + Math.floor(rng() * 40),
    circles: { social: [], hobby: [], workplace: [] }
  };
  if (typeof ensureCoreContact === 'function') ensureCoreContact(id, c);
  else { game.contacts = game.contacts || []; game.contacts.push(c); }
  const out = typeof findContact === 'function' ? findContact(id) : c;
  if (out && typeof initContactLifespan === 'function') initContactLifespan(out, seed);
  if (out && typeof ensureContactDreamFields === 'function') ensureContactDreamFields(out);
  return out || c;
}

function schoolCircleNeedsPopulate(circle) {
  if (!circle || !circle.members || circle.members.length <= 1) return true;
  const others = circle.members.filter(function (m) { return m.id && m.id !== 'player'; });
  if (!others.length) return true;
  const dupNames = {};
  let bad = 0;
  others.forEach(function (m) {
    const c = circleMemberContact(m.id);
    const n = c ? (c.name || '') : '';
    if (!n || n.indexOf('分岔') >= 0 || n === '匿名') bad++;
    if (n) dupNames[n] = (dupNames[n] || 0) + 1;
  });
  if (bad > 0) return true;
  return Object.keys(dupNames).some(function (k) { return dupNames[k] > 1; });
}

function populatePlayerSchoolCircles(force) {
  if (!game) return;
  game.playerCircles = game.playerCircles || { social: [], hobby: [], workplace: [] };
  let carry = [];
  SCHOOL_RING_DEFS.forEach(function (ring, ri) {
    let circle = game.playerCircles.social.find(function (x) { return x.id === ring.id || x.name === ring.name; });
    if (!circle) {
      circle = { id: ring.id, name: ring.name, members: [] };
      game.playerCircles.social.push(circle);
    }
    if (!force && !schoolCircleNeedsPopulate(circle)) {
      carry = circle.members.filter(function (m) { return m.id && m.id !== 'player'; }).slice(-2);
      return;
    }
    const members = [{ id: 'player', familiarity: 68 + ri * 6, attraction: 8 + ri * 2 }];
    carry.forEach(function (m) {
      if (members.every(function (x) { return x.id !== m.id; })) members.push({ id: m.id, familiarity: m.familiarity || 62, attraction: m.attraction || 20 });
    });
    const target = 5 + Math.floor(Math.random() * 3);
    let idx = 0;
    while (members.length < target) {
      const npc = generateClassmateNpc(ring.id, idx++, ring.cohort);
      if (!members.some(function (x) { return x.id === npc.id; })) {
        members.push({ id: npc.id, familiarity: npc.familiarity || 60, attraction: npc.attraction || 25 });
      }
    }
    circle.members = members;
    carry = members.filter(function (m) { return m.id !== 'player'; }).slice(-2);
  });
  if (!game.playerCircles.hobby || !game.playerCircles.hobby.length) {
    const theme = typeof HOBBY_THEMES !== 'undefined' ? HOBBY_THEMES[Math.floor(Math.random() * HOBBY_THEMES.length)] : '旅行';
    const hob = { id: 'ps_hobby_0', name: theme + '同好', theme: theme, members: [{ id: 'player', familiarity: 80, attraction: 15 }], projects: [] };
    for (let i = 0; i < 3; i++) {
      const n = generateNpcAcquaintance('player', 'hobby', i);
      hob.members.push({ id: n.id, familiarity: 50 + i * 5, attraction: 20 + i * 3 });
    }
    game.playerCircles.hobby = [hob];
  }
}

function ensureNpcThreeCircles(c) {
  if (!c || c.id === 'player') return;
  if (typeof ensureContactDreamFields === 'function') ensureContactDreamFields(c);
  if (!c.circles) c.circles = { social: [], hobby: [], workplace: [] };
  const selfId = c.id;
  if (!c.circles.social.length) {
    const soc = { id: 'soc_' + selfId, name: c.name + '的社交圈', members: [{ id: selfId, familiarity: 100, attraction: 0 }] };
    for (let i = 0; i < 3; i++) {
      const n = generateNpcAcquaintance(selfId, 'soc', i);
      soc.members.push({ id: n.id, familiarity: 45 + Math.floor(Math.random() * 30), attraction: 15 + Math.floor(Math.random() * 25) });
    }
    c.circles.social.push(soc);
  }
  if (!c.circles.hobby.length) {
    const theme = typeof HOBBY_THEMES !== 'undefined' ? HOBBY_THEMES[Math.floor(Math.random() * HOBBY_THEMES.length)] : '美食';
    const hob = { id: 'hob_' + selfId, name: theme + '同好', theme: theme, members: [{ id: selfId, familiarity: 80, attraction: 15 }], projects: [] };
    for (let i = 0; i < 2; i++) {
      const n = generateNpcAcquaintance(selfId, 'hob', i);
      hob.members.push({ id: n.id, familiarity: 40 + i * 8, attraction: 18 + i * 5 });
    }
    c.circles.hobby.push(hob);
  }
  if (!c.circles.workplace.length) {
    const co = c.company || '本地';
    const wp = {
      id: 'wp_' + selfId + '_team',
      kind: 'team',
      name: co + '·同事圈',
      members: [{ id: selfId, familiarity: 100, attraction: 0, role: c.jobTitle || '职员' }]
    };
    for (let i = 0; i < 3; i++) {
      const n = generateNpcAcquaintance(selfId, 'wp', i);
      n.company = co;
      n.jobTitle = n.jobTitle || '同事';
      wp.members.push({ id: n.id, familiarity: 35 + i * 10, attraction: 8 + i * 4, role: '同事' });
    }
    c.circles.workplace.push(wp);
  }
  ensurePersonLifespan(c);
}

function getPersonCircles(personId) {
  if (!game) return { family: [], friends: [], social: [], hobby: [], workplace: [] };
  if (personId === 'player') {
    if (typeof populatePlayerSchoolCircles === 'function') populatePlayerSchoolCircles(false);
    if (typeof syncWorkplaceCirclesFromEmployment === 'function') syncWorkplaceCirclesFromEmployment();
    if (typeof syncAllPlayerStaffCircles === 'function') syncAllPlayerStaffCircles();
    if (typeof syncFamilyCircle === 'function') syncFamilyCircle();
    else if (typeof syncFriendsCircle === 'function') syncFriendsCircle();
    const pc = game.playerCircles || { social: [], hobby: [], workplace: [] };
    pc.family = pc.family || [];
    pc.friends = pc.friends || [];
    return pc;
  }
  const c = (game.contacts || []).find(function (x) { return x.id === personId; });
  if (!c) return { family: [], friends: [], social: [], hobby: [], workplace: [] };
  ensureNpcThreeCircles(c);
  const out = c.circles || { social: [], hobby: [], workplace: [] };
  out.family = out.family || [];
  out.friends = out.friends || [];
  return out;
}

function collectCircleGraphEdges(circles, centerId, ownerId) {
  const nodeMap = {};
  const edgeSet = {};
  function addNode(id, label, fam, attr) {
    if (!id) return;
    if (!nodeMap[id]) nodeMap[id] = { id: id, label: label || '?', fam: fam || 0, attr: attr || 0 };
    else {
      nodeMap[id].fam = Math.max(nodeMap[id].fam, fam || 0);
      nodeMap[id].attr = Math.max(nodeMap[id].attr, attr || 0);
    }
  }
  function addEdge(a, b, w) {
    if (!a || !b || a === b) return;
    const key = a < b ? a + '|' + b : b + '|' + a;
    edgeSet[key] = (edgeSet[key] || 0) + (w || 1);
  }
  (circles || []).forEach(function (circle) {
    const ids = (circle.members || []).map(function (m) { return m.id; }).filter(Boolean);
    ids.forEach(function (mid) {
      const m = (circle.members || []).find(function (x) { return x.id === mid; });
      const contact = circleMemberContact(mid, ownerId);
      const label = contact ? (typeof contactDisplayName === 'function' ? contactDisplayName(contact) : contact.name) : mid;
      addNode(mid, label, m && m.familiarity, m && m.attraction);
    });
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) addEdge(ids[i], ids[j], 1);
    }
  });
  if (centerId && !nodeMap[centerId]) {
    const cc = circleMemberContact(centerId, ownerId);
    addNode(centerId, cc ? cc.name : centerId, 100, 0);
  }
  return {
    nodes: Object.keys(nodeMap).map(function (k) { return nodeMap[k]; }),
    edges: Object.keys(edgeSet).map(function (k) { var p = k.split('|'); return { a: p[0], b: p[1], w: edgeSet[k] }; })
  };
}

function renderCircleMindMapSvg(graph, centerId, width, height) {
  if (!graph || !graph.nodes.length) return '<p class="fold-meta">暂无成员</p>';
  width = width || 340;
  height = height || 260;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.34;
  const pos = {};
  const center = graph.nodes.find(function (n) { return n.id === centerId; }) || graph.nodes[0];
  const others = graph.nodes.filter(function (n) { return n.id !== center.id; });
  pos[center.id] = { x: cx, y: cy };
  others.forEach(function (n, i) {
    const ang = (Math.PI * 2 * i) / Math.max(others.length, 1) - Math.PI / 2;
    pos[n.id] = { x: cx + Math.cos(ang) * radius, y: cy + Math.sin(ang) * radius };
  });
  let svg = '<svg viewBox="0 0 ' + width + ' ' + height + '" class="network-mindmap" style="width:100%;max-width:' + width + 'px;height:auto;background:var(--bg);border-radius:8px;border:1px solid var(--border)">';
  graph.edges.forEach(function (e) {
    const pa = pos[e.a];
    const pb = pos[e.b];
    if (!pa || !pb) return;
    svg += '<line x1="' + pa.x + '" y1="' + pa.y + '" x2="' + pb.x + '" y2="' + pb.y + '" stroke="' + (e.w > 1 ? 'var(--accent)' : 'var(--border)') + '" stroke-width="' + (e.w > 1 ? 2 : 1) + '" opacity="0.8"/>';
  });
  graph.nodes.forEach(function (n) {
    const p = pos[n.id];
    if (!p) return;
    const isCenter = n.id === centerId;
    const r = isCenter ? 20 : 16;
    const eid = escNetId(n.id);
    const clickable = n.id !== centerId ? ' onclick="networkDrillPerson(\'' + eid + '\')" style="cursor:pointer"' : '';
    svg += '<g' + clickable + '>';
    svg += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + r + '" fill="' + (isCenter ? 'var(--accent)' : 'var(--card)') + '" stroke="var(--border)" stroke-width="1.5"/>';
    const label = (n.label || '').length > 3 ? (n.label || '').slice(0, 3) + '…' : (n.label || '?');
    svg += '<text x="' + p.x + '" y="' + (p.y + 3) + '" text-anchor="middle" font-size="8" fill="var(--text)" pointer-events="none">' + label + '</text>';
    if (!isCenter && n.id !== 'player') {
      svg += '<text x="' + p.x + '" y="' + (p.y + r + 10) + '" text-anchor="middle" font-size="7" fill="var(--muted)" pointer-events="none">熟' + Math.round(n.fam) + '/吸' + Math.round(n.attr) + '</text>';
    }
    svg += '</g>';
  });
  svg += '</svg>';
  return svg;
}

function renderMemberChip(memberId, meta, ownerId, isSelf, kind) {
  const c = circleMemberContact(memberId, ownerId);
  if (!c && !isSelf) return '';
  const name = c ? (typeof contactDisplayName === 'function' ? contactDisplayName(c) : c.name) : memberId;
  const life = c ? personLifespanLine(c) : '';
  const fam = meta && meta.familiarity != null ? meta.familiarity : (c && c.familiarity);
  const attr = meta && meta.attraction != null ? meta.attraction : (c && c.attraction);
  const eid = escNetId(memberId);
  if (isSelf || memberId === ownerId) {
    let expHint = '';
    if (ownerId === 'player' && typeof ensurePlayerHobbies === 'function') {
      ensurePlayerHobbies();
      ensurePlayerMajorExp();
      if (typeof ensurePlayerEduHistory === 'function') ensurePlayerEduHistory();
      const parts = [];
      (game.hobbies || []).slice(0, 1).forEach(function (t) {
        parts.push('爱好' + Math.floor((game.hobbyExp || {})[t] || 0) + '%');
      });
      if (game.playerMajor) parts.push('专业' + Math.floor((game.majorExp || {})[game.playerMajor] || 0) + '%');
      if (game.employed && game.employment && game.market) {
        const jt = game.market[game.employment.jobIdx].title;
        parts.push(typeof playerJobCareerExp === 'function' ? jt + playerJobCareerExp(jt) + '%' : jt);
      }
      if (parts.length) expHint = '<br><span class="fold-meta" style="font-size:.65rem">' + parts.join(' · ') + '</span>';
    }
    return '<span class="fold-meta" style="display:inline-block;margin:2px;padding:4px 8px;background:var(--accent);color:var(--bg);border-radius:6px;font-size:.72rem">' + name + '（中心）' + expHint + '</span>';
  }
  const roleLbl = meta && meta.role ? ' · ' + meta.role : (c && c.role ? ' · ' + c.role : (c && c.jobTitle ? ' · ' + c.jobTitle : ''));
  let srcLbl = '';
  if (kind === 'friends' && meta && meta.source) srcLbl = ' · 来自' + meta.source;
  else if (kind === 'friends' && c && c.friendCircleSource) srcLbl = ' · 来自' + c.friendCircleSource;
  else if (kind === 'child' || (c && c.kind === 'child') && c.childStats) {
    const st = c.childStats;
    srcLbl = ' · 肉体' + (st.body || 0) + '/心智' + (st.mind || 0) + '/精神' + (st.spirit || 0);
  }
  return '<button type="button" class="btn" style="font-size:.72rem;margin:2px;padding:4px 8px;line-height:1.35;text-align:left" onclick="networkDrillPerson(\'' + eid + '\')">' +
    '<b>' + name + '</b>' + roleLbl + '<br><span class="fold-meta" style="font-size:.65rem">' + life + ' · 熟' + Math.round(fam || 0) + ' · 吸' + Math.round(attr || 0) + srcLbl + '</span></button>';
}

function renderCircleKindSection(personId, kind) {
  const labels = CIRCLE_KIND_LABELS;
  const circles = getPersonCircles(personId)[kind] || [];
  const sectionKey = 'kind_' + kind + '_' + personId;
  const folded = typeof isCircleFolded === 'function' ? isCircleFolded(sectionKey) : false;
  let h = '<div class="network-circle-kind circle-fold' + (folded ? ' collapsed' : '') + '" style="margin:12px 0;padding:10px;background:var(--card);border-radius:10px;border:1px solid var(--border)">';
  h += '<div class="circle-fold-hdr" style="display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:pointer" onclick="toggleCircleFold(\'' + escNetId(sectionKey) + '\')">';
  h += '<h4 style="margin:0;font-size:.9rem">🌐 ' + labels[kind] + (circles.length ? ' <span class="fold-meta">(' + circles.length + ')</span>' : '') + '</h4>';
  h += '<span class="fold-meta" style="font-size:.72rem">' + (folded ? '展开 ▼' : '折叠 ▲') + '</span></div>';
  h += '<div class="circle-fold-body">';
  if (!circles.length) {
    h += '<p class="fold-meta" style="margin:8px 0 0">暂无' + labels[kind] + '</p></div></div>';
    return h;
  }
  if (kind === 'friends') {
    h += '<p class="fold-meta" style="margin:8px 0 4px">结构图仅显示熟悉度≥' + (typeof FRIENDS_MINDMAP_FAM_THRESHOLD !== 'undefined' ? FRIENDS_MINDMAP_FAM_THRESHOLD : 80) +
      '；下方成员列表为熟悉度≥' + (typeof FRIENDS_FAM_THRESHOLD !== 'undefined' ? FRIENDS_FAM_THRESHOLD : 60) + '（通讯录「关注」可强制入圈）</p>';
  }
  if (kind === 'family') {
    h += '<p class="fold-meta" style="margin:8px 0 4px">树状图自上而下：祖辈 → 父母辈 → 本人辈 → 子女辈 · 虚线为配偶</p>';
  }
  let graphCircles = circles;
  if (kind === 'friends') {
    const minFam = typeof FRIENDS_MINDMAP_FAM_THRESHOLD !== 'undefined' ? FRIENDS_MINDMAP_FAM_THRESHOLD : 80;
    graphCircles = circles.map(function (circle) {
      return {
        id: circle.id,
        name: circle.name,
        theme: circle.theme,
        kind: circle.kind,
        members: (circle.members || []).filter(function (m) {
          if (m.id === personId) return true;
          return (m.familiarity || 0) >= minFam;
        })
      };
    });
  }
  if (kind === 'family' && personId === 'player' && typeof buildFamilyTreeGraph === 'function' && typeof renderFamilyTreeSvg === 'function') {
    const tree = buildFamilyTreeGraph(personId);
    h += tree ? renderFamilyTreeSvg(tree, personId) : '<p class="fold-meta">暂无家族成员</p>';
  } else {
    const graph = collectCircleGraphEdges(graphCircles, personId, personId);
    h += renderCircleMindMapSvg(graph, personId);
  }
  circles.forEach(function (circle) {
    const circleKey = 'circle_' + (circle.id || circle.name) + '_' + personId;
    const cFolded = typeof isCircleFolded === 'function' ? isCircleFolded(circleKey) : true;
    const kindLbl = kind === 'workplace' && circle.kind && typeof workplaceCircleLabel === 'function' ? workplaceCircleLabel(circle.kind) + ' · ' : '';
    const memCount = (circle.members || []).filter(function (m) { return m.id && m.id !== personId; }).length;
    h += '<div class="circle-fold' + (cFolded ? ' collapsed' : '') + '" style="margin:8px 0 0;padding:8px;background:var(--bg);border-radius:8px;border:1px dashed var(--border)">';
    h += '<div class="circle-fold-hdr" style="display:flex;align-items:center;justify-content:space-between;gap:6px;cursor:pointer" onclick="event.stopPropagation();toggleCircleFold(\'' + escNetId(circleKey) + '\')">';
    h += '<b style="font-size:.82rem">' + kindLbl + circle.name + '</b>';
    h += '<span class="fold-meta" style="font-size:.68rem">' + memCount + ' 人 · ' + (cFolded ? '展开' : '折叠') + '</span></div>';
    h += '<div class="circle-fold-body">';
    if (circle.theme) h += '<span class="fold-meta">· ' + circle.theme + '</span>';
    h += '<div style="margin-top:6px;display:flex;flex-wrap:wrap;align-items:flex-start">';
    (circle.members || []).forEach(function (m) {
      h += renderMemberChip(m.id, m, personId, m.id === personId, kind);
    });
    h += '</div>';
    if (kind === 'hobby' && personId === 'player') {
      const active = (game.hobbyProjects || []).find(function (x) { return x.status === 'active'; });
      if (active) h += '<p class="fold-meta" style="margin-top:4px;color:var(--accent)">🎯 ' + active.name + ' ' + active.progressWeeks + '/' + active.durationWeeks + ' 周</p>';
      else h += '<button type="button" class="btn" style="font-size:.72rem;margin-top:4px" onclick="startHobbyCircleProject(\'' + (circle.theme || '') + '\')">🎯 启动爱好项目</button>';
    }
    h += '</div></div>';
  });
  h += '</div></div>';
  return h;
}

function renderThreeCirclesHub(personId) {
  let h = '<div class="network-three-circles">';
  h += renderCircleKindSection(personId, 'family');
  h += renderCircleKindSection(personId, 'friends');
  h += renderCircleKindSection(personId, 'social');
  h += renderCircleKindSection(personId, 'hobby');
  h += renderCircleKindSection(personId, 'workplace');
  h += '</div>';
  return h;
}

function migrateSocialCircles() {
  if (!game) return;
  if (!game.playerCircles || typeof game.playerCircles !== 'object' || Array.isArray(game.playerCircles)) {
    game.playerCircles = { social: [], hobby: [], workplace: [], friends: [], family: [] };
  }
  game.playerCircles = game.playerCircles || { social: [], hobby: [], workplace: [], friends: [], family: [] };
  populatePlayerSchoolCircles(false);
  if (typeof syncAllPlayerStaffCircles === 'function') syncAllPlayerStaffCircles();
  if (typeof migrateFamilyCircles === 'function') migrateFamilyCircles();
  else if (typeof syncFamilyCircle === 'function') syncFamilyCircle();
  (game.contacts || []).forEach(function (c) {
    if (c.kind === 'classmate' || c.kind === 'acquaintance' || c.kind === 'colleague' || c.kind === 'staff') ensureNpcThreeCircles(c);
    ensurePersonLifespan(c);
  });
  ensurePersonLifespan({ id: 'player' });
}
