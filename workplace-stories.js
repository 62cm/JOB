/* 职场八卦 / 行业传说 — 外出遇人有几率开讲 */
const WORKPLACE_STORY_CHANCE = {
  default: 0.58,
  commute: 0.40,
  work: 0.55,
  pantry: 0.62,
  bar: 0.68,
  club: 0.72,
  park: 0.50,
  cafe: 0.58,
  library: 0.35,
  store: 0.45
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
  if (w.includes('联谊')) return WORKPLACE_STORY_CHANCE.bar;
  if (w.includes('地铁')) return WORKPLACE_STORY_CHANCE.commute * 0.95;
  if (w.includes('打车')) return WORKPLACE_STORY_CHANCE.commute * 1.08;
  if (w.includes('驾车')) return WORKPLACE_STORY_CHANCE.commute * 0.85;
  if (w.includes('通勤') || w === 'commute') return WORKPLACE_STORY_CHANCE.commute;
  if (w.includes('工位') || w === 'work') return WORKPLACE_STORY_CHANCE.work;
  if (w.includes('茶水') || w === 'pantry') return WORKPLACE_STORY_CHANCE.pantry;
  return WORKPLACE_STORY_CHANCE.default;
}

function workplaceStoryModalTitle(type) {
  if (type === 'legend') return '行业传说';
  if (type === 'company') return '公司八卦';
  return '职场轶事';
}

function workplaceStoryPlaceLabel(where) {
  if (!where) return '';
  const w = String(where);
  if (w.includes('夜店') || w === 'club') return '夜店';
  if (w.includes('酒吧') || w === 'bar') return '酒吧';
  if (w.includes('公园') || w === 'park') return '公园';
  if (w.includes('咖啡') || w === 'cafe') return '咖啡店';
  if (w.includes('图书馆') || w === 'library') return '图书馆';
  if (w.includes('便利店') || w === 'store') return '便利店';
  if (w.includes('联谊')) return '联谊';
  if (w.includes('地铁')) return '地铁';
  if (w.includes('打车')) return '打车';
  if (w.includes('驾车')) return '驾车';
  return w;
}

function finishWorkplaceStoryModal(person, title, onAfter) {
  addLog('💬 ' + person.name + '讲了段' + title, 'info');
  if (Math.random() < 0.12 && typeof addStress === 'function') addStress(-1, '听八卦 ');
  if (typeof onAfter === 'function') onAfter();
}

function queueWorkplaceStoryModal(person, where, story, onAfter) {
  const storyTitle = workplaceStoryModalTitle(story.type);
  const place = workplaceStoryPlaceLabel(where);
  const modalTitle = (place ? place + ' · ' : '') + storyTitle;
  const prof = typeof contactProfileLabel === 'function' ? contactProfileLabel(person) : (person.jobTitle || '');
  const html =
    '<p>在「<b>' + (place || where || '外面') + '</b>」，<b>' + person.name + '</b>' +
    (prof ? '（' + prof + '）' : '') + ' 跟你聊了几句：</p>' +
    '<p style="margin-top:10px;line-height:1.65;font-size:.9rem">「' + story.text + '」</p>';
  const payload = {
    lane: 'person',
    icon: '💬',
    title: modalTitle,
    html: html,
    btn: '哈哈',
    logMsg: '💬 ' + person.name + '讲了段' + storyTitle,
    onClose: function () {
      finishWorkplaceStoryModal(person, storyTitle, onAfter);
    }
  };
  if (typeof queuePersonEncounter === 'function') {
    queuePersonEncounter(payload);
    return true;
  }
  if (typeof queueEncounterModal === 'function') {
    queueEncounterModal(payload);
    return true;
  }
  if (typeof queueEventEncounter === 'function') {
    queueEventEncounter(payload);
    return true;
  }
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '💬',
      title: modalTitle,
      html: html,
      buttons: [{
        text: '哈哈',
        primary: true,
        handler: function () {
          if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
          finishWorkplaceStoryModal(person, storyTitle, onAfter);
        }
      }]
    });
    return true;
  }
  if (typeof queueStatusModal === 'function') {
    queueStatusModal(modalTitle, person.name + '跟你聊了几句：\n\n「' + story.text + '」', '💬', {
      btn: '哈哈',
      onClose: function () {
        finishWorkplaceStoryModal(person, storyTitle, onAfter);
      }
    });
    return true;
  }
  finishWorkplaceStoryModal(person, storyTitle, onAfter);
  return false;
}

function maybeTellWorkplaceStory(person, where, onAfter, opts) {
  opts = opts || {};
  if (!person) {
    if (typeof onAfter === 'function') onAfter();
    return null;
  }
  if (!opts.force && Math.random() >= workplaceStoryChance(where)) {
    if (typeof onAfter === 'function') onAfter();
    return null;
  }
  let story = pickWorkplaceStoryForPerson(person);
  if (!story || !story.text) {
    const generic = [
      '「你听说没，隔壁组又要改需求了。」',
      '「主管今天脸色不对，悠着点。」',
      '「食堂今天的菜是真不行，有人都在点外卖。」'
    ];
    story = { type: 'company', text: generic[Math.floor(Math.random() * generic.length)] };
  }
  queueWorkplaceStoryModal(person, where, story, onAfter);
  return story;
}
