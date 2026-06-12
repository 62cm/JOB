/* 职场八卦 / 行业传说 — 外出遇人有几率开讲 */
const WORKPLACE_STORY_CHANCE = {
  default: 0.38,
  commute: 0.22,
  bar: 0.55,
  club: 0.58,
  park: 0.32,
  cafe: 0.42,
  library: 0.18,
  store: 0.28
};

function wsHash(s) {
  let h = 0;
  for (let i = 0; i < (s || '').length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function jobSlugFromTitle(title) {
  if (!game || !game.market) return null;
  const j = game.market.find(x => x.title === title);
  return j ? j.slug : null;
}

function pickJobWorkplaceStory(person) {
  if (typeof JOB_WORKPLACE_STORIES === 'undefined' || !person) return null;
  const slug = person.jobSlug || jobSlugFromTitle(person.jobTitle);
  if (!slug) return null;
  const pool = JOB_WORKPLACE_STORIES[slug];
  if (!pool || !pool.length) return null;
  const seed = wsHash((slug || '') + '_' + (person.id || '') + '_' + (game.week || 0));
  return pool[seed % pool.length];
}

function pickCompanyGossipStory(person) {
  if (typeof WORKPLACE_STORY_POOLS === 'undefined' || !person) return null;
  const tier = person.companyTier || 'mid';
  const scale = person.companyScale || 'medium';
  const key = scale + '_' + tier;
  const pool = WORKPLACE_STORY_POOLS.COMPANY_GOSSIP[key] || WORKPLACE_STORY_POOLS.COMPANY_GOSSIP['medium_mid'];
  if (!pool || !pool.length) return null;
  const seed = wsHash(key + '_' + (person.company || '') + '_' + (game.week || 0));
  let s = pool[seed % pool.length];
  if (person.company) s = '在' + person.company + '那边，' + s;
  return s;
}

function pickIndustryLegendStory() {
  if (typeof WORKPLACE_STORY_POOLS === 'undefined') return null;
  const pool = WORKPLACE_STORY_POOLS.INDUSTRY_LEGENDS;
  if (!pool || !pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickWorkplaceStoryForPerson(person) {
  if (!person) return null;
  const r = Math.random();
  if (r < 0.50) {
    const s = pickJobWorkplaceStory(person);
    if (s) return { type: 'job', text: s };
  }
  if (r < 0.82) {
    const s = pickCompanyGossipStory(person);
    if (s) return { type: 'company', text: s };
  }
  const s = pickIndustryLegendStory();
  if (s) return { type: 'legend', text: s };
  const fallback = pickJobWorkplaceStory(person);
  return fallback ? { type: 'job', text: fallback } : null;
}

function workplaceStoryChance(where) {
  if (!where) return WORKPLACE_STORY_CHANCE.default;
  const w = String(where);
  if (w.includes('夜店') || w.includes('酒吧') || w === 'bar' || w === 'club') return WORKPLACE_STORY_CHANCE.club;
  if (w.includes('公园') || w === 'park') return WORKPLACE_STORY_CHANCE.park;
  if (w.includes('咖啡') || w === 'cafe') return WORKPLACE_STORY_CHANCE.cafe;
  if (w.includes('图书馆') || w === 'library') return WORKPLACE_STORY_CHANCE.library;
  if (w.includes('便利店') || w === 'store') return WORKPLACE_STORY_CHANCE.store;
  if (w.includes('通勤') || w === 'commute') return WORKPLACE_STORY_CHANCE.commute;
  return WORKPLACE_STORY_CHANCE.default;
}

function workplaceStoryModalTitle(type) {
  if (type === 'legend') return '行业传说';
  if (type === 'company') return '公司八卦';
  return '职场轶事';
}

function maybeTellWorkplaceStory(person, where) {
  if (!person || Math.random() >= workplaceStoryChance(where)) return null;
  const story = pickWorkplaceStoryForPerson(person);
  if (!story || !story.text) return null;
  const title = workplaceStoryModalTitle(story.type);
  const msg = person.name + '跟你聊了几句：\n\n「' + story.text + '」';
  if (typeof queueStatusModal === 'function') {
    queueStatusModal(title, msg, '💬', {
      btn: '关闭',
      onClose: function () {
        if (Math.random() < 0.12 && typeof addStress === 'function') addStress(-1, '听八卦 ');
      }
    });
  }
  addLog('💬 ' + person.name + '讲了段' + title, 'info');
  return story;
}
