/* 生成每种职业 10 则职场小故事 → workplace-stories-data.js */
const fs = require('fs');
const path = require('path');
const jobs = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
const pools = require('./workplace-story-pools.js');

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function composeJobStory(job, idx) {
  const cat = pools.CATEGORY_STORIES[job.category] || pools.CATEGORY_STORIES['商业服务'];
  const base = cat[idx % cat.length];
  const twist = pools.JOB_TWISTS[(hashStr(job.slug) + idx) % pools.JOB_TWISTS.length];
  let s = base.replace(/\{job\}/g, job.title).replace(/\{category\}/g, job.category);
  if (twist) s = s.replace(/\{twist\}/g, twist.replace(/\{job\}/g, job.title));
  else s = s.replace(/\{twist\}/g, '');
  return s.replace(/\s+/g, ' ').trim();
}

const JOB_WORKPLACE_STORIES = {};
for (const job of jobs) {
  JOB_WORKPLACE_STORIES[job.slug] = [];
  for (let i = 0; i < 10; i++) JOB_WORKPLACE_STORIES[job.slug].push(composeJobStory(job, i));
}

const jobOut =
  '/* 由 gen-workplace-stories.js 生成，勿手改 */\nconst JOB_WORKPLACE_STORIES = ' +
  JSON.stringify(JOB_WORKPLACE_STORIES, null, 0) +
  ';\n';
fs.writeFileSync(path.join(__dirname, 'workplace-stories-data.js'), jobOut, 'utf8');

const poolOut =
  '/* 由 gen-workplace-stories.js 生成，勿手改 */\nconst WORKPLACE_STORY_POOLS = ' +
  JSON.stringify({
    INDUSTRY_LEGENDS: pools.INDUSTRY_LEGENDS,
    COMPANY_GOSSIP: pools.COMPANY_GOSSIP
  }, null, 0) +
  ';\n';
fs.writeFileSync(path.join(__dirname, 'workplace-stories-pools-inline.js'), poolOut, 'utf8');
console.log('Generated', jobs.length, 'jobs × 10 =', jobs.length * 10, 'stories + gossip pools');
