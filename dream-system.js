/* 梦想 · 圈子 · 父母 · 职业经验 — 由 build.js 注入（在 contacts-system 之后） */
const PLAYER_BIRTH_YEAR = 1988;
const GRADUATION_YEAR = 2010;
const CAREER_RANKS = ['实习生', '普通岗', '专家', '总监'];
const DREAM_PROJECT_TEMPLATES = [
  { id: 'film', career: '演员', title: '独立电影', desc: '完成剧本、筹资、拍摄与上映。需要导演、演员、摄影、制片等协作。', support: ['导演', '摄影', '制片', '演员'] },
  { id: 'album', career: '歌手', title: '个人专辑', desc: '创作、录制、发行一张完整专辑。', support: ['制作人', '编曲', '混音', '宣传'] },
  { id: 'game', career: '游戏制作人', title: '独立游戏', desc: '从原型到上线的完整游戏项目。', support: ['程序', '美术', '策划', '测试'] },
  { id: 'building', career: '建筑师', title: '地标方案', desc: '完成可落地的建筑设计方案并通过评审。', support: ['结构工程师', '项目经理', '造价师'] },
  { id: 'engineer', career: '工程师', title: '专利产品', desc: '研发并验证一项可量产的技术方案。', support: ['研发', '测试', '工艺', '市场'] },
  { id: 'writer', career: '作家', title: '长篇作品', desc: '完成并出版一部长篇作品。', support: ['编辑', '插画', '发行', '宣传'] }
];
const HOBBY_THEMES = ['旅行', '美食', '摄影', '音乐', '运动', '阅读', '手工', '游戏'];

function dreamRng(seed) {
  let s = Math.abs(seed || 1);
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
function pickParentNames(rng) {
  const r = rng || Math.random;
  const fatherSurname = typeof namePick === 'function' ? namePick(typeof SURNAME_100 !== 'undefined' ? SURNAME_100 : ['王'], r) : '王';
  const motherSurname = r() < 0.38
    ? (typeof namePick === 'function' ? namePick(typeof SURNAME_100 !== 'undefined' ? SURNAME_100 : ['李'], r) : '李')
    : fatherSurname;
  const father = fatherSurname + (typeof composeGivenPart === 'function' ? composeGivenPart('male', r) : '建国');
  const mother = motherSurname + (typeof composeGivenPart === 'function' ? composeGivenPart('female', r) : '秀英');
  const playerSurname = r() < 0.5 ? fatherSurname : motherSurname;
  return { surname: playerSurname, fatherSurname: fatherSurname, motherSurname: motherSurname, father: father, mother: mother };
}
function playerNameFromParents(surname, gender, rng) {
  const given = typeof composeGivenPart === 'function' ? composeGivenPart(gender, rng) : '明';
  return String(surname || '王') + given;
}
function pickPlayerSurnameFromParents(names, rng) {
  if (!names) return '王';
  const r = rng || Math.random;
  if (names.fatherSurname && names.motherSurname && names.fatherSurname !== names.motherSurname) {
    return r() < 0.5 ? names.fatherSurname : names.motherSurname;
  }
  return names.surname || names.fatherSurname || names.motherSurname || '王';
}
function randomBirthCity(rng) {
  const cities = typeof CITIES !== 'undefined' ? CITIES : ['杭州', '北京', '上海'];
  return cities[Math.floor((rng || Math.random)() * cities.length)];
}
function pickDreamTemplate(rng) {
  const r = rng || Math.random;
  return DREAM_PROJECT_TEMPLATES[Math.floor(r() * DREAM_PROJECT_TEMPLATES.length)];
}
function buildDreamFromTemplate(tpl) {
  if (!tpl) return null;
  return {
    id: tpl.id, title: tpl.title, career: tpl.career, desc: tpl.desc,
    supportRoles: tpl.support.slice(), progress: 0, active: false, needWeeks: 52 + Math.floor(Math.random() * 52)
  };
}
function ensureContactDreamFields(c) {
  if (!c) return null;
  if (!c.birthCity) c.birthCity = randomBirthCity();
  if (!c.careerPrefs) c.careerPrefs = [];
  if (!c.careerHistory) c.careerHistory = [];
  if (!c.careerExp) c.careerExp = {};
  if (!c.hobbyExp) c.hobbyExp = {};
  if (!c.majorExp) c.majorExp = {};
  if (c.influence == null) c.influence = 5 + Math.floor(Math.random() * 15);
  ensureContactEduHistory(c);
  if (!c.circles) c.circles = { social: [], hobby: [], workplace: [] };
  if (!c.careerPrefs.length && Math.random() < 0.75) {
    const jobs = (game && game.market) ? game.market.slice(0, 8) : [];
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n && jobs.length; i++) {
      const j = jobs[Math.floor(Math.random() * jobs.length)];
      if (j && c.careerPrefs.indexOf(j.title) < 0) c.careerPrefs.push(j.title);
    }
  }
  ensurePersonHobbies(c);
  ensurePersonMajorExp(c);
  seedContactCareerExp(c);
  if (!c.dream && Math.random() < 0.55) c.dream = buildDreamFromTemplate(pickDreamTemplate());
  return c;
}
function contactTopCareerExp(c) {
  if (!c || !c.careerExp) return null;
  let best = null, val = 0;
  Object.keys(c.careerExp).forEach(function (k) {
    const v = c.careerExp[k] || 0;
    if (v > val) { val = v; best = k; }
  });
  return best ? { job: best, exp: val, rank: careerRankLabel(val) } : null;
}
function careerRankLabel(exp) {
  const e = exp || 0;
  if (e >= 100) return '总监';
  if (e >= 70) return '专家';
  if (e >= 30) return '普通岗';
  return '实习生';
}
function careerRankOrder(rank) {
  return { '实习生': 0, '普通岗': 1, '专家': 2, '总监': 3 }[rank] || 0;
}
function importanceRequiredCareerRank(importance, roleExtra) {
  if (roleExtra === 'intern') return '实习生';
  if (importance === 'high') return '总监';
  if (importance === 'mid') return '专家';
  return '普通岗';
}
function importanceCareerExpBonus(importance, roleExtra) {
  if (roleExtra === 'intern') return 0;
  if (importance === 'high') return 35;
  if (importance === 'mid') return 15;
  return 0;
}
function weeklyCareerExpDelta(importance, roleExtra) {
  if (roleExtra === 'intern') return 0.35;
  if (importance === 'high') return 0.85;
  if (importance === 'mid') return 0.6;
  return 0.45;
}
function weeksToCareerExpPct(weeks) {
  return Math.min(200, Math.round(((weeks || 0) / 400) * 200));
}
function weeksToCareerRank(weeks) {
  return careerRankLabel(weeksToCareerExpPct(weeks));
}
function yearsToCareerExpPct(years) {
  return Math.min(200, Math.round((years || 0) * 22));
}
function ensurePlayerCareerExp(g) {
  g = g || game;
  if (!g) return {};
  if (!g.careerExp || typeof g.careerExp !== 'object') g.careerExp = {};
  return g.careerExp;
}
function inferJobTitleFromHistory(h, market) {
  if (!h) return '综合';
  if (h.jobTitle) return h.jobTitle;
  market = market || (game && game.market) || [];
  const match = market.find(function (j) { return j.category === h.category; });
  return match ? match.title : (h.category || '综合');
}
function historyImportanceExp(h) {
  const bonus = importanceCareerExpBonus(h.importance, h.roleExtra);
  return Math.min(200, weeksToCareerExpPct(h.weeks || 0) + bonus);
}
function migratePlayerCareerExp(g) {
  g = g || game;
  if (!g) return;
  const ce = ensurePlayerCareerExp(g);
  const market = g.market || [];
  (g.careerHistory || []).forEach(function (h) {
    const title = inferJobTitleFromHistory(h, market);
    ce[title] = Math.max(ce[title] || 0, historyImportanceExp(h));
  });
  if (g.employed && g.employment && market[g.employment.jobIdx]) {
    const job = market[g.employment.jobIdx];
    const emp = g.employment;
    const exp = Math.min(200, weeksToCareerExpPct(emp.weeksInRole || 0) + importanceCareerExpBonus(emp.importance, emp.roleExtra));
    ce[job.title] = Math.max(ce[job.title] || 0, exp);
  }
  const ie = g.industryExperience || {};
  Object.keys(ie).forEach(function (key) {
    if (market.some(function (j) { return j.title === key; })) {
      ce[key] = Math.max(ce[key] || 0, weeksToCareerExpPct(ie[key] || 0));
    }
  });
}
function playerJobCareerExp(jobTitle, g) {
  g = g || game;
  if (!g || !jobTitle) return 0;
  ensurePlayerCareerExp(g);
  return Math.floor(g.careerExp[jobTitle] || 0);
}
function playerCareerRankForJob(jobTitle, g) {
  return careerRankLabel(playerJobCareerExp(jobTitle, g));
}
function bumpPlayerCareerExp(jobTitle, delta, g) {
  g = g || game;
  if (!g || !jobTitle || !delta) return;
  const ce = ensurePlayerCareerExp(g);
  ce[jobTitle] = Math.max(0, Math.min(200, Math.round((ce[jobTitle] || 0) + delta)));
}
function bumpPlayerCareerFromWork(job, emp, g) {
  g = g || game;
  if (!g || !job || !emp) return;
  const delta = weeklyCareerExpDelta(emp.importance, emp.roleExtra);
  bumpPlayerCareerExp(job.title, delta, g);
  ensurePlayerMajorExp(g);
  if (g.playerMajor && jobRelatesToMajor(job.title, g.playerMajor)) {
    bumpPlayerMajorExp(g.playerMajor, delta * 0.65, g);
  }
}
function majorFamily(major) {
  if (!major) return 'other';
  const m = String(major);
  if (/机械|土木|建筑|工程|制造|材料/.test(m)) return 'engineering';
  if (/计算机|软件|信息|电子|通信/.test(m)) return 'cs';
  if (/临床|护理|医学|药学/.test(m)) return 'medical';
  if (/金融|会计|经济|工商|市场|管理/.test(m)) return 'business';
  if (/法学|法律/.test(m)) return 'law';
  if (/新闻|传媒|艺术|设计/.test(m)) return 'media';
  return 'other';
}
function jobRelatesToMajor(jobTitle, major) {
  if (!jobTitle || !major) return false;
  const mapped = jobTitleToMajor(jobTitle);
  if (mapped === major) return true;
  return majorFamily(mapped) === majorFamily(major) && majorFamily(major) !== 'other';
}
function majorToDefaultJobTitle(major) {
  if (!major) return null;
  const m = String(major);
  if (/机械/.test(m)) return '机械工程师';
  if (/计算机|软件/.test(m)) return '软件工程师';
  if (/电子|信息/.test(m)) return '电子工程师';
  if (/土木|建筑/.test(m)) return '土木工程师';
  if (/临床|医学/.test(m)) return '临床医生';
  if (/护理/.test(m)) return '护士';
  if (/金融|会计/.test(m)) return '金融分析师';
  if (/法学|法律/.test(m)) return '律师';
  if (/新闻|传媒/.test(m)) return '记者';
  if (/工商|市场|管理/.test(m)) return '市场专员';
  return null;
}
function contactPrimaryMajor(c) {
  if (!c) return null;
  if (c.major) return c.major;
  ensureContactEduHistory(c);
  const hist = c.eduHistory || [];
  for (let i = hist.length - 1; i >= 0; i--) {
    const e = hist[i];
    if (e && e.major && ['中专', '大专', '本科', '硕士', '博士'].indexOf(e.level) >= 0) return e.major;
  }
  return null;
}
function pickContactHobbies(c, rng) {
  rng = rng || Math.random;
  const pool = HOBBY_THEMES.slice();
  const n = 1 + Math.floor(rng() * 2);
  const out = [];
  while (out.length < n && pool.length) {
    const i = Math.floor(rng() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}
function ensurePersonHobbies(c) {
  if (!c) return;
  const rng = dreamRng(String(c.id || c.name || '').length * 29);
  if (!c.hobbies || !c.hobbies.length) {
    if (c.circles && c.circles.hobby && c.circles.hobby[0] && c.circles.hobby[0].theme) {
      c.hobbies = [c.circles.hobby[0].theme];
    } else {
      c.hobbies = pickContactHobbies(c, rng);
    }
    if (rng() < 0.4) {
      const t2 = HOBBY_THEMES[Math.floor(rng() * HOBBY_THEMES.length)];
      if (c.hobbies.indexOf(t2) < 0) c.hobbies.push(t2);
    }
  }
  if (!c.hobbyExp) c.hobbyExp = {};
  c.hobbies.forEach(function (t) {
    if (c.hobbyExp[t] == null) c.hobbyExp[t] = 8 + Math.floor(rng() * 42);
  });
}
function ensurePersonMajorExp(c) {
  if (!c) return;
  ensureContactEduHistory(c);
  if (!c.majorExp) c.majorExp = {};
  const major = contactPrimaryMajor(c);
  if (major) {
    c.major = major;
    if (c.majorExp[major] == null) c.majorExp[major] = 18 + Math.floor(Math.random() * 48);
  }
}
function seedContactCareerExp(c) {
  if (!c) return;
  if (!c.careerExp) c.careerExp = {};
  const rng = dreamRng(String(c.id || c.name || '').length * 37);
  if (c.jobTitle && !c.careerExp[c.jobTitle]) {
    c.careerExp[c.jobTitle] = 20 + Math.floor(rng() * 55);
  }
  const major = contactPrimaryMajor(c);
  const related = major ? majorToDefaultJobTitle(major) : null;
  if (related) {
    c.careerExp[related] = Math.max(c.careerExp[related] || 0, c.careerExp[c.jobTitle] || 0, 25 + Math.floor(rng() * 45));
  }
}
function ensurePlayerHobbies(g) {
  g = g || game;
  if (!g) return;
  if (!g.hobbies || !g.hobbies.length) {
    const circle = g.playerCircles && g.playerCircles.hobby && g.playerCircles.hobby[0];
    g.hobbies = circle && circle.theme ? [circle.theme] : [HOBBY_THEMES[Math.floor(Math.random() * HOBBY_THEMES.length)]];
    if (Math.random() < 0.45) {
      const t2 = HOBBY_THEMES[Math.floor(Math.random() * HOBBY_THEMES.length)];
      if (g.hobbies.indexOf(t2) < 0) g.hobbies.push(t2);
    }
  }
  if (!g.hobbyExp) g.hobbyExp = {};
  g.hobbies.forEach(function (t) {
    if (g.hobbyExp[t] == null) g.hobbyExp[t] = 10 + Math.floor(Math.random() * 28);
  });
}
function ensurePlayerMajorExp(g) {
  g = g || game;
  if (!g) return;
  ensurePlayerEduHistory(g);
  if (!g.majorExp) g.majorExp = {};
  if (g.playerMajor && g.majorExp[g.playerMajor] == null) {
    g.majorExp[g.playerMajor] = 22 + Math.floor(Math.random() * 35);
  }
}
function bumpPlayerHobbyExp(theme, delta, g) {
  g = g || game;
  if (!g || !theme || !delta) return;
  ensurePlayerHobbies(g);
  g.hobbyExp[theme] = Math.max(0, Math.min(200, Math.round((g.hobbyExp[theme] || 0) + delta)));
}
function bumpPlayerMajorExp(major, delta, g) {
  g = g || game;
  if (!g || !major || !delta) return;
  ensurePlayerMajorExp(g);
  g.majorExp[major] = Math.max(0, Math.min(200, Math.round((g.majorExp[major] || 0) + delta)));
}
function bumpContactHobbyExp(c, theme, delta) {
  if (!c || !theme || !delta) return;
  ensurePersonHobbies(c);
  c.hobbyExp[theme] = Math.max(0, Math.min(200, Math.round((c.hobbyExp[theme] || 0) + delta)));
}
function renderPersonExperienceHtml(p, isPlayer) {
  if (!p) return '';
  if (isPlayer) {
    ensurePlayerHobbies();
    ensurePlayerMajorExp();
    migratePlayerCareerExp();
    p = {
      hobbies: game.hobbies, hobbyExp: game.hobbyExp, majorExp: game.majorExp,
      careerExp: game.careerExp, major: game.playerMajor,
      jobTitle: game.employed && game.employment ? game.market[game.employment.jobIdx].title : null,
      company: game.employed && game.employment ? game.employment.company.name : null,
      employment: game.employment, market: game.market
    };
  } else if (typeof ensureContactDreamFields === 'function') {
    ensureContactDreamFields(p);
  }
  let h = '<div style="margin-bottom:10px;padding:8px;background:var(--bg);border-radius:8px;font-size:.78rem;line-height:1.55">';
  h += '<span class="fold-meta">爱好 → 专业 → 职业</span>';
  const hobbies = p.hobbies || [];
  const hobbyExp = p.hobbyExp || {};
  h += '<div style="margin-top:6px"><b>爱好</b></div>';
  if (!hobbies.length) h += '<div class="fold-meta" style="margin-top:3px">暂无</div>';
  else hobbies.forEach(function (t) {
    const exp = Math.floor(hobbyExp[t] || 0);
    h += '<div class="fold-meta" style="margin-top:3px">' + t + ' · ' + exp + '% · <b>' + careerRankLabel(exp) + '</b></div>';
  });
  const major = p.major || contactPrimaryMajor(p);
  const majorExp = p.majorExp || {};
  h += '<div style="margin-top:8px"><b>专业</b></div>';
  if (!major) h += '<div class="fold-meta" style="margin-top:3px">暂无</div>';
  else {
    const mx = Math.floor(majorExp[major] || 0);
    h += '<div class="fold-meta" style="margin-top:3px">' + major + ' · ' + mx + '% · <b>' + careerRankLabel(mx) + '</b></div>';
  }
  h += '<div style="margin-top:8px"><b>职业经验</b> <span class="fold-meta">· 实习生 / 普通岗 / 专家 / 总监</span></div>';
  if (isPlayer && p.employment && p.market) {
    const job = p.market[p.employment.jobIdx];
    const imp = typeof IMP_LABEL !== 'undefined' ? (IMP_LABEL[p.employment.importance] || p.employment.importance) : p.employment.importance;
    if (job) {
      h += '<div class="fold-meta" style="margin-top:3px">现任 <b>' + job.title + '</b> @ ' + (p.company || '—') + ' · ' + imp + ' · 本岗 ' + (p.employment.weeksInRole || 0) + ' 周 · <b>' + playerJobCareerExp(job.title) + '% ' + playerCareerRankForJob(job.title) + '</b></div>';
    }
  } else if (p.jobTitle) {
    const cx = Math.floor((p.careerExp || {})[p.jobTitle] || 0);
    h += '<div class="fold-meta" style="margin-top:3px">现任 <b>' + p.jobTitle + '</b>' + (p.company ? ' @ ' + p.company : '') + ' · <b>' + cx + '% ' + careerRankLabel(cx) + '</b></div>';
  }
  const ce = p.careerExp || {};
  const titles = Object.keys(ce).filter(function (k) { return (ce[k] || 0) > 0; }).sort(function (a, b) { return (ce[b] || 0) - (ce[a] || 0); });
  if (!titles.length) h += '<div class="fold-meta" style="margin-top:3px">暂无职业积累</div>';
  else titles.slice(0, 8).forEach(function (title) {
    const exp = Math.floor(ce[title] || 0);
    h += '<div class="fold-meta" style="margin-top:3px">' + title + ' · ' + exp + '% · <b>' + careerRankLabel(exp) + '</b></div>';
  });
  h += '</div>';
  return h;
}
function playerIndustryExperienceHtml(g) {
  return renderPersonExperienceHtml(null, true);
}
function migrateEducationSplit(g) {
  g = g || game;
  if (!g || g.playerEducation !== '高中/中专') return;
  g.playerEducation = isZhongzhuanEducation(g, eduRngFor(g, 99)) ? '中专' : '高中';
}
function playerCareerRankGapForOffer(job, offer, g) {
  if (!job || !offer) return 0;
  const req = importanceRequiredCareerRank(offer.importance, offer.roleExtra);
  const have = playerCareerRankForJob(job.title, g);
  return careerRankOrder(req) - careerRankOrder(have);
}
function playerCareerRankFitHtml(jobTitle, importance, roleExtra) {
  if (!jobTitle) return '';
  const req = importanceRequiredCareerRank(importance, roleExtra);
  const have = playerCareerRankForJob(jobTitle);
  const exp = playerJobCareerExp(jobTitle);
  const gap = careerRankOrder(req) - careerRankOrder(have);
  if (gap > 0) {
    return ' <span style="color:var(--red);font-size:.65rem">需「' + req + '」· 你「' + have + '」' + exp + '%</span>';
  }
  return ' <span style="color:var(--green);font-size:.65rem">「' + jobTitle + '」' + exp + '%·' + have + ' ✓</span>';
}
function bumpCareerExp(c, jobKey, delta) {
  if (!c) return;
  ensureContactDreamFields(c);
  const k = jobKey || '综合';
  c.careerExp[k] = Math.max(0, Math.min(200, (c.careerExp[k] || 0) + delta));
  c.careerHistory.unshift({ job: k, weeks: Math.max(1, Math.round(delta * 4)), week: game ? game.week : 0, delta: delta });
  if (c.careerHistory.length > 24) c.careerHistory = c.careerHistory.slice(0, 24);
}
function addCircleMember(circle, personId, meta) {
  if (!circle) return;
  if (!circle.members) circle.members = [];
  const exist = circle.members.find(function (m) { return m.id === personId; });
  if (exist) {
    if (meta) Object.assign(exist, meta);
    return;
  }
  circle.members.push(Object.assign({ id: personId, familiarity: meta && meta.familiarity != null ? meta.familiarity : 40, attraction: meta && meta.attraction != null ? meta.attraction : 30 }, meta || {}));
}
function ensureContactCircles(c) {
  if (!c) return;
  ensureContactDreamFields(c);
  if (!c.circles.social.length) {
    c.circles.social.push({ id: 'soc_' + c.id, name: c.name + '的社交圈', members: [{ id: c.id, familiarity: 100, attraction: 0 }] });
  }
  if (!c.circles.hobby.length && Math.random() < 0.6) {
    const theme = HOBBY_THEMES[Math.floor(Math.random() * HOBBY_THEMES.length)];
    c.circles.hobby.push({ id: 'hob_' + c.id, name: theme + '同好', theme: theme, members: [{ id: c.id, familiarity: 80, attraction: 20 }], projects: [] });
  }
}
function initPlayerSchoolCircles() {
  if (typeof populatePlayerSchoolCircles === 'function') populatePlayerSchoolCircles(false);
  else if (game) {
    game.playerCircles = game.playerCircles || { social: [], hobby: [], workplace: [] };
  }
}
function syncSplitParentsContacts() {
  if (!game) return;
  if (!game.contacts) game.contacts = [];
  if (game.parentsInheritanceSettled) {
    game.contacts = game.contacts.filter(function (c) {
      return c.id !== CORE_CONTACT_IDS.parents && c.id !== CORE_CONTACT_IDS.father && c.id !== CORE_CONTACT_IDS.mother && c.kind !== 'parents' && c.kind !== 'father' && c.kind !== 'mother';
    });
    return;
  }
  const names = game.parentNames || pickParentNames(dreamRng((game.week || 0) + 17));
  if (!game.parentNames) game.parentNames = names;
  backfillParentNameFields(names);
  repairParentNamesGenders(names);
  game.contacts = game.contacts.filter(function (c) { return c.id !== CORE_CONTACT_IDS.parents && c.kind !== 'parents'; });
  const fam = game.familyTier || 'normal';
  const jobs = { rich: { f: '集团董事长', m: '投资人' }, normal: { f: '工程师', m: '会计' }, poor: { f: '待业', m: '超市收银' } };
  const j = jobs[fam] || jobs.normal;
  ensureCoreContact(CORE_CONTACT_IDS.father, {
    kind: 'father', name: names.father, gender: 'male', role: '父亲',
    company: fam === 'rich' ? '家族企业' : '', jobTitle: j.f, income: fam === 'rich' ? 800000 : fam === 'normal' ? 180000 : 36000,
    metWhere: '家庭', familiarity: game.parentFamiliarity != null ? game.parentFamiliarity : (game.familyPocketMoney ? 45 : 72)
  });
  ensureCoreContact(CORE_CONTACT_IDS.mother, {
    kind: 'mother', name: names.mother, gender: 'female', role: '母亲',
    company: '', jobTitle: j.m, income: fam === 'rich' ? 500000 : fam === 'normal' ? 120000 : 28000,
    metWhere: '家庭', familiarity: game.parentFamiliarity != null ? game.parentFamiliarity : (game.familyPocketMoney ? 50 : 78)
  });
  ensureContactDreamFields(game.contacts.find(function (x) { return x.id === CORE_CONTACT_IDS.father; }));
  ensureContactDreamFields(game.contacts.find(function (x) { return x.id === CORE_CONTACT_IDS.mother; }));
  if (typeof initParentLifespans === 'function') initParentLifespans();
}
function backfillParentNameFields(names) {
  if (!names) return;
  function surnameFromFullName(full) {
    if (!full || full.length < 2) return full || '王';
    const doubles = ['欧阳', '司马', '上官', '诸葛', '东方', '皇甫', '令狐', '公孙', '宇文', '长孙'];
    for (let i = 0; i < doubles.length; i++) {
      if (full.indexOf(doubles[i]) === 0) return doubles[i];
    }
    return full.charAt(0);
  }
  if (!names.fatherSurname && names.father) names.fatherSurname = surnameFromFullName(names.father);
  if (!names.motherSurname && names.mother) names.motherSurname = surnameFromFullName(names.mother);
  if (!names.surname) names.surname = names.fatherSurname || names.motherSurname || '王';
}
function repairParentNamesGenders(names) {
  if (!names || typeof fixFullNameGender !== 'function') return;
  const seed = (game && game.stockSeed) || 1;
  if (names.father) {
    const rng = dreamRng(seed * 23 + 7);
    names.father = fixFullNameGender(names.father, 'male', rng, names.fatherSurname);
  }
  if (names.mother) {
    const rng = dreamRng(seed * 29 + 11);
    names.mother = fixFullNameGender(names.mother, 'female', rng, names.motherSurname);
  }
  backfillParentNameFields(names);
}
function migratePlayerNameFromParents() {
  if (!game) return;
  if (game.playerNameGenVersion >= 2) return;
  if (game.playerNameUserChosen) {
    if (game.parentNames) {
      backfillParentNameFields(game.parentNames);
      repairParentNamesGenders(game.parentNames);
      if (typeof syncSplitParentsContacts === 'function') syncSplitParentsContacts();
    }
    if (game.playerName && game.playerName.length >= 2) {
      game.playerSurname = game.playerName.charAt(0);
      if (typeof storePlayerSurnameFromName === 'function') storePlayerSurnameFromName();
    }
    game.playerNameGenVersion = 2;
    game.playerNameMigrated = true;
    return;
  }
  if (!game.parentNames) {
    game.parentNames = pickParentNames(dreamRng((game.stockSeed || 1) + (game.week || 0) + 17));
  }
  backfillParentNameFields(game.parentNames);
  const pg = game.playerGender || 'male';
  const rng = dreamRng((game.stockSeed || 1) * 991 + 17);
  const sur = pickPlayerSurnameFromParents(game.parentNames, rng);
  const properName = playerNameFromParents(sur, pg, rng);
  const cur = typeof stripForkSuffix === 'function' ? stripForkSuffix(game.playerName) : (game.playerName || '');
  const renamed = !cur || cur === '匿名' || cur.length < 2 || cur !== properName;
  game.playerName = properName;
  game.playerSurname = sur;
  if (typeof storePlayerSurnameFromName === 'function') storePlayerSurnameFromName();
  game.playerNameGenVersion = 2;
  game.playerNameMigrated = true;
  if (!renamed) return;
  if (game._loadingSave) {
    if (typeof addLog === 'function') addLog('📛 姓名定为「' + game.playerName + '」（随父母姓）', 'info');
    return;
  }
  if (typeof isAutoLifeSimulating === 'function' && isAutoLifeSimulating()) {
    if (typeof autoLifeNote === 'function') autoLifeNote('📛 姓名定为「' + game.playerName + '」（随父母姓）');
    return;
  }
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '📛', title: '你的名字',
      html: '<p>你终于想起来了——这个姓名来自父母，姓随机继承父亲或母亲之一。</p>' +
        '<p class="fold-meta">父亲：<b>' + game.parentNames.father + '</b><br>母亲：<b>' + game.parentNames.mother + '</b></p>' +
        '<p>从今以后，大家叫你 <b>' + game.playerName + '</b>。</p>',
      buttons: [{ text: '接受', primary: true, handler: function () { if (typeof closeConsumeModal === 'function') closeConsumeModal(true); if (typeof updateUI === 'function') updateUI(); } }]
    });
  } else if (typeof addLog === 'function') {
    addLog('📛 姓名定为「' + game.playerName + '」（随父母姓）', 'info');
  }
}
function migrateDreamSystem() {
  if (!game) return;
  migrateEducationSplit();
  if (!game.birthYear) game.birthYear = PLAYER_BIRTH_YEAR;
  if (!game.graduationYear) game.graduationYear = GRADUATION_YEAR;
  if (!game.dreamProfile) game.dreamProfile = { ideals: [], sponsored: [] };
  if (!game.playerCircles) initPlayerSchoolCircles();
  if (typeof ensurePlayerEduHistory === 'function') ensurePlayerEduHistory();
  if (typeof ensurePlayerHobbies === 'function') ensurePlayerHobbies();
  if (typeof ensurePlayerMajorExp === 'function') ensurePlayerMajorExp();
  if (typeof migratePlayerCareerExp === 'function') migratePlayerCareerExp();
  (game.contacts || []).forEach(function (c) {
    ensureContactDreamFields(c);
    ensureContactCircles(c);
  });
  syncSplitParentsContacts();
  migratePlayerNameFromParents();
  if (typeof migrateLifespanSystem === 'function') migrateLifespanSystem();
}
function isCoreContactKind(c) {
  if (!c) return true;
  return c.kind === 'parents' || c.kind === 'father' || c.kind === 'mother' || c.kind === 'spouse' || c.kind === 'ex_spouse' || c.kind === 'bff';
}
function contactDreamSummary(c) {
  if (!c) return '';
  ensureContactDreamFields(c);
  let s = '';
  if (c.hobbies && c.hobbies.length) {
    const t = c.hobbies[0];
    s += '爱好「' + t + '」' + Math.floor((c.hobbyExp || {})[t] || 0) + '%';
  }
  const major = contactPrimaryMajor(c);
  if (major) s += (s ? ' · ' : '') + '专业「' + major + '」' + Math.floor((c.majorExp || {})[major] || 0) + '%';
  const top = contactTopCareerExp(c);
  if (top) s += (s ? ' · ' : '') + '职业「' + top.job + '」' + top.exp + '%·' + top.rank;
  if (c.dream) s += (s ? ' · ' : '') + (c.dream.active ? '理想进行中：' : '理想：') + c.dream.title;
  return s || '暂无档案';
}
function rollStatsFromLifeProfile(profile) {
  const mode = profile && profile.statsMode;
  if (mode === 'high') return { body: 110, mind: 105, spirit: 100 };
  if (mode === 'low') return { body: 70, mind: 75, spirit: 72 };
  if (mode === 'mind') return { body: 85, mind: 120, spirit: 95 };
  if (mode === 'body') return { body: 120, mind: 80, spirit: 82 };
  if (mode === 'mid') return { body: 95, mind: 90, spirit: 88 };
  return { body: 80 + Math.floor(Math.random() * 40), mind: 80 + Math.floor(Math.random() * 40), spirit: 80 + Math.floor(Math.random() * 40) };
}
const GAOKAO_LINES = {
  zhongzhuan: 160,
  min: 380,
  associate: 380,
  bachelorFork: 480,
  tier985: 540,
  c9: 600,
  doctor: 580,
  masterMin: 380
};
const GAOKAO_MAX_RETAKE = 7;
function gaokaoZhongzhuanCutoff() {
  return GAOKAO_LINES.zhongzhuan;
}
function gaokaoNeedsForkChoice(score) {
  const s = score || 0;
  return s >= GAOKAO_LINES.bachelorFork && s < GAOKAO_LINES.tier985;
}
function gaokaoForkLabels(choice) {
  if (choice === '985_associate') return '985/211 重点大专';
  if (choice === 'normal_bachelor') return '普通本科';
  return '';
}
function computeGraduationFromEdu(edu, seed, retakeYears) {
  const birth = PLAYER_BIRTH_YEAR;
  const extra = retakeYears || 0;
  const rng = typeof dreamRng === 'function' ? dreamRng(seed || 1) : Math.random;
  if (edu === '博士') {
    const startAge = 30 + Math.floor(rng() * 7) + extra;
    return { graduationYear: birth + startAge, startAge: startAge };
  }
  if (edu === '硕士') {
    const graduationYear = 2012 + Math.floor(rng() * 2) + extra;
    return { graduationYear: graduationYear, startAge: graduationYear - birth };
  }
  const gy = GRADUATION_YEAR + extra;
  return { graduationYear: gy, startAge: gy - birth };
}
function resolveGaokaoOutcome(score, st, seed) {
  const s = score || 0;
  const profile = st || {};
  const zz = GAOKAO_LINES.zhongzhuan;
  let education, school = 'none', summary = '';

  if (s < zz) {
    education = '中专';
    summary = '分数 ＜ ' + zz + ' → 中专';
  } else if (s < GAOKAO_LINES.min) {
    education = '高中';
    summary = '达 ' + zz + '～' + (GAOKAO_LINES.min - 1) + ' → 高中毕业（未达最低录取线 ' + GAOKAO_LINES.min + '）';
  } else if (s < GAOKAO_LINES.bachelorFork) {
    education = '大专';
    school = 'normal';
    summary = '达最低线 ' + GAOKAO_LINES.min + ' → 普通大专';
  } else if (s < GAOKAO_LINES.tier985) {
    if (profile.gaokaoForkChoice === '985_associate') {
      education = '大专';
      school = '985';
      summary = '达 ' + GAOKAO_LINES.bachelorFork + ' 线 · 选择 985/211 重点大专';
    } else {
      education = '本科';
      school = 'normal';
      summary = '达 ' + GAOKAO_LINES.bachelorFork + ' 线 · ' + (profile.gaokaoForkChoice === 'normal_bachelor' ? '选择' : '暂定') + ' 普通本科';
    }
  } else if (s < GAOKAO_LINES.c9) {
    education = '本科';
    school = '985';
    summary = '达 985/211 本科线 ' + GAOKAO_LINES.tier985 + ' → 985/211 本科';
  } else {
    education = '本科';
    school = 'c9';
    summary = '达 C9 线 ' + GAOKAO_LINES.c9 + ' → C9/常春藤 本科';
  }

  if (profile.gaokaoBonus && profile.hasDream && s >= GAOKAO_LINES.masterMin) {
    if (s >= GAOKAO_LINES.doctor) {
      education = '博士';
      school = s >= GAOKAO_LINES.c9 ? 'c9' : (school === 'none' ? '985' : school);
      summary += ' · 第四次加投：分数达博士线，攻读博士';
    } else if (profile.educationBoost === 'master') {
      education = '硕士';
      if (school === 'none') school = 'normal';
      summary += ' · 第四次加投：押大落小，学历升至硕士';
    }
  } else if (profile.hasDream && (profile.educationBoost === 'master' || s >= GAOKAO_LINES.doctor) && !profile.gaokaoBonus) {
    summary += ' · 未获第四次加投，本科止步，不继续深造';
  }

  const retakeYears = profile.gaokaoRetakeYears || profile.gaokaoRetakeCount || 0;
  const grad = computeGraduationFromEdu(education, seed, retakeYears);
  const schoolLabel = typeof schoolLabelFor === 'function' ? schoolLabelFor(school) : school;
  return {
    score: s,
    education: education,
    school: school,
    schoolLabel: schoolLabel,
    graduationYear: grad.graduationYear,
    startAge: grad.startAge,
    summary: summary,
    needsForkChoice: gaokaoNeedsForkChoice(s) && !profile.gaokaoForkChoice,
    gaokaoForkChoice: profile.gaokaoForkChoice || null,
    gaokaoRetakeYears: retakeYears,
    lines: GAOKAO_LINES,
    zhongzhuanCutoff: zz
  };
}
function renderGaokaoCutoffsHtml(score) {
  const zz = GAOKAO_LINES.zhongzhuan;
  const s = score != null ? score : '—';
  let h = '<div style="background:rgba(0,0,0,.22);border-radius:8px;padding:8px;margin-top:6px;font-size:.72rem;line-height:1.55">';
  h += '<div style="color:var(--yellow);margin-bottom:4px">📋 高考分数线</div>';
  h += '＜' + zz + ' · 中专<br>';
  h += zz + '～' + (GAOKAO_LINES.min - 1) + ' · 高中毕业<br>';
  h += '≥' + GAOKAO_LINES.min + ' · 最低录取线 → 普通大专（无更低等学历档）<br>';
  h += '≥' + GAOKAO_LINES.bachelorFork + ' · <b>同线二选一</b>：普通本科 或 985/211 重点大专<br>';
  h += '≥' + GAOKAO_LINES.tier985 + ' · 985/211 本科线<br>';
  h += '≥' + GAOKAO_LINES.c9 + ' · C9/常春藤 本科线<br>';
  h += '硕士/博士 · 须第六步<strong>第四次加投</strong>（前三步押中≥2次）且分数达标；否则本科止步';
  if (score != null) h += '<br><br>你的分数 <b style="color:var(--yellow)">' + s + '</b>';
  h += '</div>';
  return h;
}
function mapGaokaoToEducation(score, st) {
  return resolveGaokaoOutcome(score, st, 0).education;
}
function mapGaokaoToSchool(score, st) {
  return resolveGaokaoOutcome(score, st, 0).school;
}

const EDU_MAJOR_POOLS = {
  vocational: ['会计', '电子技术', '护理', '汽车维修', '烹饪', '计算机应用', '电子商务'],
  associate: ['会计', '电子商务', '物流管理', '护理', '市场营销', '机电一体化'],
  bachelor: ['计算机科学与技术', '电子信息工程', '机械设计制造', '工商管理', '金融学', '法学', '新闻学', '土木工程', '临床医学'],
  master: ['金融学', '法学', '计算机技术', '工商管理', '公共管理', '材料科学与工程'],
  doctor: ['物理学', '化学', '生物学', '材料科学', '计算机科学', '临床医学']
};
const UNIVERSITY_POOL = {
  normal: ['省属财经大学', '杭州师范学院', '宁波大学', '温州大学', '浙江传媒学院', '苏州大学', '扬州大学'],
  '985': ['浙江大学', '南京大学', '武汉大学', '华中科技大学', '西安交通大学', '四川大学'],
  c9: ['清华大学', '北京大学', '中国科学技术大学', '复旦大学', '上海交通大学', '浙江大学']
};

function eduRngFor(g, salt) {
  return dreamRng(((g && g.stockSeed) || 1) * 877 + salt + ((g && g.gaokaoScore) || 400));
}
function pickEduItem(arr, rng) {
  if (!arr || !arr.length) return '综合';
  return arr[Math.floor((rng || Math.random)() * arr.length)];
}
function citySchoolPrefix(city) {
  const c = String(city || '杭州').replace(/市$/, '');
  return c;
}
function highSchoolName(city, rng) {
  const p = citySchoolPrefix(city);
  return p + pickEduItem(['第一中学', '高级中学', '第三中学', '实验中学'], rng);
}
function vocationalSchoolName(city, rng) {
  const p = citySchoolPrefix(city);
  return p + pickEduItem(['职业技术学校', '商贸学校', '工业学校', '卫生学校'], rng);
}
function universityName(tier, rng) {
  const pool = UNIVERSITY_POOL[tier] || UNIVERSITY_POOL.normal;
  return pickEduItem(pool, rng);
}
function jobTitleToMajor(title) {
  if (!title) return null;
  const t = String(title);
  if (/计算机|软件|程序|数据|信息/.test(t)) return '计算机科学与技术';
  if (/金融|投资|银行|证券/.test(t)) return '金融学';
  if (/法律|律师|法务/.test(t)) return '法学';
  if (/医生|护理|临床|医疗|护士/.test(t)) return '临床医学';
  if (/机械|数控|模具|工艺/.test(t)) return '机械设计制造';
  if (/土木|建筑|造价|施工/.test(t)) return '土木工程';
  if (/电子|通信|硬件/.test(t)) return '电子信息工程';
  if (/设计|美术|艺术/.test(t)) return '设计学';
  if (/销售|市场|运营|管理|人事|HR/.test(t)) return '工商管理';
  if (/记者|编辑|传媒|文案/.test(t)) return '新闻学';
  return null;
}
function inferAnchorMajor(g, c) {
  if (g && g.playerMajor) return g.playerMajor;
  if (c && c.major) return c.major;
  const prefs = (g && g.majorPrefs) || (c && c.careerPrefs) || [];
  if (prefs.length) {
    const m = jobTitleToMajor(prefs[0]);
    if (m) return m;
  }
  const job = (c && c.jobTitle) || (g && g.employed && g.employment && g.market ? g.market[g.employment.jobIdx].title : null);
  if (job) return jobTitleToMajor(job);
  return null;
}
function pickMajorForLevel(level, g, rng, c) {
  const anchor = inferAnchorMajor(g, c);
  if (anchor) {
    if (level === '中专') {
      if (/机械|电子|计算机|护理|烹饪|汽车/.test(anchor)) return anchor.indexOf('计算机') >= 0 ? '计算机应用' : (anchor.indexOf('机械') >= 0 ? '机电一体化' : pickEduItem(EDU_MAJOR_POOLS.vocational, rng));
      return pickEduItem(EDU_MAJOR_POOLS.vocational, rng);
    }
    if (level === '大专' || level === '本科' || level === '硕士' || level === '博士') return anchor;
  }
  if (level === '中专') return pickEduItem(EDU_MAJOR_POOLS.vocational, rng);
  if (level === '大专') return pickEduItem(EDU_MAJOR_POOLS.associate, rng);
  if (level === '本科') return pickEduItem(EDU_MAJOR_POOLS.bachelor, rng);
  if (level === '硕士') return pickEduItem(EDU_MAJOR_POOLS.master, rng);
  if (level === '博士') return pickEduItem(EDU_MAJOR_POOLS.doctor, rng);
  return pickEduItem(['文科', '理科'], rng);
}
function isZhongzhuanEducation(g, rng) {
  if (!g) return false;
  if (g.playerEducation === '中专') return true;
  if (g.playerEducation === '高中') return false;
  if (g.playerEducation !== '高中/中专') return false;
  const score = g.gaokaoScore;
  if (score != null && score < 220) return false;
  if (score != null && score >= 265) return true;
  return (rng || Math.random)() < 0.55;
}
function eduHistoryEntry(level, year, school, major) {
  const e = { level: level, year: year, school: school };
  if (major) e.major = major;
  return e;
}
function buildPlayerEduHistory(g) {
  if (!g) return [];
  const rng = eduRngFor(g, 41);
  const grad = g.graduationYear || GRADUATION_YEAR;
  const birth = g.birthYear || PLAYER_BIRTH_YEAR;
  const startAge = g.startAge != null ? g.startAge : (grad - birth);
  const hsYear = Math.max(birth + 18, grad - Math.max(4, startAge - 18));
  const city = g.playerCity || (typeof PLAYER_HOME_CITY !== 'undefined' ? PLAYER_HOME_CITY : '杭州');
  const edu = g.playerEducation || '本科';
  const tier = g.playerSchool || 'normal';
  const hist = [];
  if (edu === '高中') {
    hist.push(eduHistoryEntry('高中', hsYear, highSchoolName(city, rng), pickEduItem(['理科', '文科'], rng)));
    return hist;
  }
  if (edu === '中专') {
    const major = pickMajorForLevel('中专', g, rng);
    hist.push(eduHistoryEntry('中专', hsYear, vocationalSchoolName(city, rng), major));
    return hist;
  }
  if (edu === '高中/中专') {
    if (isZhongzhuanEducation(g, rng)) {
      hist.push(eduHistoryEntry('中专', hsYear, vocationalSchoolName(city, rng), pickMajorForLevel('中专', g, rng)));
    } else {
      hist.push(eduHistoryEntry('高中', hsYear, highSchoolName(city, rng), pickEduItem(['理科', '文科'], rng)));
    }
    return hist;
  }
  hist.push(eduHistoryEntry('高中', hsYear, highSchoolName(city, rng), pickEduItem(['理科', '文科'], rng)));
  if (edu === '大专') {
    hist.push(eduHistoryEntry('大专', grad, universityName(tier === 'none' ? 'normal' : tier, rng), pickMajorForLevel('大专', g, rng)));
    return hist;
  }
  const uni = universityName(tier === 'none' ? 'normal' : tier, rng);
  hist.push(eduHistoryEntry('本科', grad, uni, pickMajorForLevel('本科', g, rng)));
  if (edu === '硕士') {
    hist.push(eduHistoryEntry('硕士', grad, uni, pickMajorForLevel('硕士', g, rng)));
  } else if (edu === '博士') {
    hist.push(eduHistoryEntry('硕士', grad - 1, uni, pickMajorForLevel('硕士', g, rng)));
    hist.push(eduHistoryEntry('博士', grad, tier === 'c9' ? universityName('c9', rng) : uni, pickMajorForLevel('博士', g, rng)));
  }
  return hist;
}
function eduHistoryIsComplete(hist, edu) {
  if (!hist || !hist.length) return false;
  function hasLevel(lv) { return hist.some(function (e) { return e && e.level === lv; }); }
  function entryOk(e) {
    if (!e || !e.level || !e.school) return false;
    if (['中专', '大专', '本科', '硕士', '博士'].indexOf(e.level) >= 0 && !e.major) return false;
    return true;
  }
  if (!hist.every(entryOk)) return false;
  if (!hasLevel('高中') && !hasLevel('中专')) return false;
  if (edu === '高中') return hasLevel('高中') && !hasLevel('中专');
  if (edu === '中专') return hasLevel('中专');
  if (edu === '高中/中专') return hasLevel('高中') || hasLevel('中专');
  if (edu === '大专') return hasLevel('大专');
  if (edu === '本科') return hasLevel('本科');
  if (edu === '硕士') return hasLevel('硕士') || hasLevel('本科');
  if (edu === '博士') return hasLevel('博士') || hasLevel('硕士');
  return true;
}
function ensurePlayerEduHistory(g) {
  g = g || game;
  if (!g) return [];
  const edu = g.playerEducation || '本科';
  if (g.playerEduHistory && g.playerEduHistoryVersion >= 2 && eduHistoryIsComplete(g.playerEduHistory, edu)) {
    return g.playerEduHistory;
  }
  g.playerEduHistory = buildPlayerEduHistory(g);
  g.playerEduHistoryVersion = 2;
  const top = g.playerEduHistory[g.playerEduHistory.length - 1];
  if (top && top.major && ['中专', '大专', '本科', '硕士', '博士'].indexOf(top.level) >= 0) {
    g.playerMajor = top.major;
  }
  if (top && top.school && edu !== '高中' && edu !== '中专' && edu !== '高中/中专') g.playerSchoolName = top.school;
  return g.playerEduHistory;
}
function buildContactEduHistory(c) {
  const rng = eduRngFor(game, String(c.id || c.name || '').length * 13);
  const grad = (game && game.graduationYear) || GRADUATION_YEAR;
  const hsYear = grad - 4;
  const city = c.birthCity || (game && game.playerCity) || '杭州';
  const roll = (rng || Math.random)();
  if (roll < 0.14) {
    return [eduHistoryEntry('高中', hsYear, highSchoolName(city, rng), pickEduItem(['理科', '文科'], rng))];
  }
  if (roll < 0.34) {
    return [eduHistoryEntry('中专', hsYear, vocationalSchoolName(city, rng), pickMajorForLevel('中专', null, rng, c))];
  }
  const hist = [eduHistoryEntry('高中', hsYear, highSchoolName(city, rng), pickEduItem(['理科', '文科'], rng))];
  if (roll < 0.54) {
    hist.push(eduHistoryEntry('大专', grad, universityName('normal', rng), pickMajorForLevel('大专', null, rng, c)));
    return hist;
  }
  const uni = universityName(roll > 0.82 ? '985' : 'normal', rng);
  hist.push(eduHistoryEntry('本科', grad, uni, pickMajorForLevel('本科', null, rng, c)));
  if (roll > 0.92) hist.push(eduHistoryEntry('硕士', grad, uni, pickMajorForLevel('硕士', null, rng, c)));
  return hist;
}
function ensureContactEduHistory(c) {
  if (!c) return;
  if (c.id === 'player') return;
  const edu = c.education || c.playerEducation;
  if (c.eduHistory && c.eduHistory.length && c.eduHistory.every(function (e) { return e && e.school && (['中专', '大专', '本科', '硕士', '博士'].indexOf(e.level) < 0 || e.major); })) {
    if (!edu || eduHistoryIsComplete(c.eduHistory, edu)) return;
  }
  c.eduHistory = buildContactEduHistory(c);
}
function renderEduHistoryHtml(hist) {
  if (!hist || !hist.length) return '';
  let h = '<div style="margin-bottom:10px;padding:8px;background:var(--bg);border-radius:8px;font-size:.78rem;line-height:1.55">';
  h += '<b>学历经历</b>';
  hist.slice().sort(function (a, b) { return (a.year || 0) - (b.year || 0); }).forEach(function (e) {
    h += '<div class="fold-meta" style="margin-top:4px">';
    h += (e.year ? e.year + ' · ' : '') + '<b>' + e.level + '</b> · ' + (e.school || '—');
    if (e.major) h += ' · ' + e.major;
    h += '</div>';
  });
  h += '</div>';
  return h;
}
function playerEducationDisplayLine(g) {
  g = g || game;
  if (!g) return '—';
  ensurePlayerEduHistory(g);
  const edu = g.playerEducation || '本科';
  const top = (g.playerEduHistory || [])[g.playerEduHistory.length - 1];
  if (top && top.school && edu !== '高中' && edu !== '中专' && edu !== '高中/中专') {
    return edu + ' · ' + top.school + (top.major ? ' · ' + top.major : '');
  }
  if ((edu === '高中' || edu === '中专' || edu === '高中/中专') && top && top.school) {
    return edu + ' · ' + top.school + (top.major ? ' · 专业 ' + top.major : '');
  }
  return edu + (typeof schoolLabelFor === 'function' ? '（' + schoolLabelFor(g.playerSchool) + '）' : '');
}

function applyLifeProfileToGame(profile) {
  if (!game || !profile) return;
  game.birthYear = PLAYER_BIRTH_YEAR;
  game.graduationYear = profile.graduationYear || GRADUATION_YEAR;
  game.startAge = profile.startAge != null ? profile.startAge : (game.graduationYear - PLAYER_BIRTH_YEAR);
  game.familyTier = profile.familyTier || 'normal';
  game.baseStress = profile.baseStress != null ? profile.baseStress : 30;
  game.lifeExpectancy = profile.lifeExpectancy || 80;
  game.parentFamiliarity = profile.parentFamiliarity != null ? profile.parentFamiliarity : 65;
  game.familyPocketMoney = !!profile.familyPocketMoney;
  game.gaokaoScore = profile.gaokaoScore || 400;
  game.gaokaoForkChoice = profile.gaokaoForkChoice || null;
  game.gaokaoRetakeYears = profile.gaokaoRetakeYears || profile.gaokaoRetakeCount || 0;
  game.preferredGender = profile.preferredGender;
  game.playerOrientation = 'bisexual';
  game.inheritancePending = profile.inheritancePending || 0;
  game.destinyLove = !!profile.destinyLove;
  game.openingPhase = 'graduation_month';
  if (profile.parentNames) game.parentNames = profile.parentNames;
  else game.parentNames = pickParentNames(dreamRng((game.stockSeed || 1) + 3));
  if (profile.startCash != null) { game.cash = profile.startCash; game.money = profile.startCash; }
  game.stats = rollStatsFromLifeProfile(profile);
  game.playerInfluence = 5;
  if (profile.hasDream && profile.dreamBetWin) {
    game.playerDream = buildDreamFromTemplate(pickDreamTemplate(dreamRng(7)));
  }
  if (profile.randomMajorPrefs) game.majorPrefs = (game.market || []).slice(0, 3).map(function (j) { return j.title; });
  if (profile.majorExpBonus) {
    ensurePlayerCareerExp();
    ensurePlayerMajorExp();
    ensurePlayerEduHistory();
    const maj = game.playerMajor;
    if (maj) {
      game.majorExp[maj] = Math.max(game.majorExp[maj] || 0, weeksToCareerExpPct(profile.majorExpBonus) + 18);
      const job = majorToDefaultJobTitle(maj);
      if (job) game.careerExp[job] = Math.max(game.careerExp[job] || 0, weeksToCareerExpPct(profile.majorExpBonus) + 12);
    }
  }
  if (typeof initPlayerSchoolCircles === 'function') initPlayerSchoolCircles();
  if (typeof ensurePlayerEduHistory === 'function') ensurePlayerEduHistory();
  if (typeof migrateSocialCircles === 'function') migrateSocialCircles();
  if (typeof initPlayerLifespan === 'function') initPlayerLifespan(profile);
}
function createIdealForContact(contactId, tplId) {
  const c = typeof findContact === 'function' ? findContact(contactId) : (game.contacts || []).find(function (x) { return x.id === contactId; });
  if (!c) return;
  const tpl = DREAM_PROJECT_TEMPLATES.find(function (t) { return t.id === tplId; }) || pickDreamTemplate();
  c.dream = buildDreamFromTemplate(tpl);
  addLog('✨ 为 ' + c.name + ' 建立理想「' + c.dream.title + '」', 'success');
}
