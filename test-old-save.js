const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const script = html.match(/<script>\n([\s\S]*)<\/script>\n<\/body>/)[1];

function makeSelect() {
  const opts = [{ value: '', disabled: false, hidden: false, textContent: '' }];
  const sel = {
    value: '', options: opts, classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {}, focus() {},
    querySelector(q) {
      const m = /value="([^"]+)"/.exec(q || '');
      if (!m) return null;
      const hit = opts.find(o => o.value === m[1]);
      return hit || { disabled: false, hidden: false };
    }
  };
  return sel;
}
const elStore = {};
function domEl(id) {
  const ctx2d = {
    fillRect() {}, clearRect() {}, fillText() {}, strokeText() {},
    measureText() { return { width: 0 }; },
    beginPath() {}, arc() {}, fill() {}, stroke() {}, moveTo() {}, lineTo() {},
    createLinearGradient() { return { addColorStop() {} }; },
    set fillStyle(v) {}, set font(v) {}, set textAlign(v) {}
  };
  const e = {
    id, value: '', classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    innerHTML: '', style: {}, textContent: '', disabled: false, checked: false,
    addEventListener() {}, focus() {}, click() {}, setAttribute() {},
    getContext() { return ctx2d; },
    querySelector() { return null; }, querySelectorAll() { return []; },
    children: [], parentElement: null, width: 100, height: 100
  };
  if (id === 'playerEduSelect' || id === 'playerSchoolSelect') return makeSelect();
  return e;
}

const ctx = {
  console,
  Math, Date, Set, Map, JSON, parseInt, parseFloat, isNaN, isFinite,
  Array, Object, String, Number, Boolean, RegExp, Error, Promise, Symbol,
  localStorage: {
    _d: {},
    getItem(k) { return this._d[k] || null; },
    setItem(k, v) { this._d[k] = v; }
  },
  document: {
    getElementById(id) {
      if (!elStore[id]) elStore[id] = domEl(id);
      return elStore[id];
    },
    querySelector() { return null; },
    querySelectorAll() { return [] },
    createElement() { return domEl('canvas'); }
  },
  devicePixelRatio: 1,
  requestAnimationFrame(fn) { fn(); },
  setTimeout, clearTimeout, setInterval, clearInterval,
  alert() {}, confirm() { return true; }, prompt() { return null; },
  location: { href: 'file:///test/index.html' }
};
vm.createContext(ctx);

try {
  vm.runInContext(script, ctx, { timeout: 180000 });
} catch (e) {
  console.error('LOAD SCRIPT:', e.message);
  console.error(e.stack.split('\n').slice(0, 8).join('\n'));
  process.exit(1);
}

const cases = JSON.stringify([
  { name: 'bare-minimal', game: { week: 10, cash: 50000, market: [], employed: false, contacts: [], log: [] } },
  { name: 'with-parents', game: { week: 20, cash: 80000, married: true, playerName: '王明', birthYear: 1988, contacts: [{ id: 'core_parents', kind: 'parents', name: '爸妈' }], log: [] } },
  { name: 'company-industries-string', game: { week: 40, cash: 300000, playerCompany: { founded: true, industries: '综合', acquisitions: { player: null, companion: null }, staff: [], projects: [], board: { execs: { cto: '（待任命）' } } }, log: [] } },
  { name: 'company-with-villa', game: { week: 60, cash: 5e6, villaOwned: true, playerCompany: { founded: true, name: '测试科技', industries: ['信息技术'], staff: [{ id: 'st1', name: '张三', role: '研发工程师', dept: 'tech' }], projects: [], board: { execs: { cfo: '王建国', cto: '（待任命）' } }, departments: [{ id: 'tech', name: '技术部', head: '（待任命）', parent: 'exec', level: 1 }] }, log: [] } },
  { name: 'bad-acquisitions', game: { week: 30, cash: 200000, playerCompany: { founded: true, acquisitions: 'invalid', subsidiaries: null, industries: ['制造业'] }, log: [] } },
  { name: 'acquisition-co', game: { week: 80, cash: 2e6, playerCompany: { founded: true, acquisitions: { player: 'co_1', companion: null }, subsidiaries: [], industries: ['信息技术'], staff: [], board: { playerShares: 60, execs: {} }, equity: { holders: [{ id: 'player', pct: 60, votes: 60, name: '你' }] } }, log: [] } },
  { name: 'married-children', game: { week: 100, cash: 1e6, married: true, divorced: false, birthYear: 1985, playerName: '李华', children: [{ id: 'ch1', contactId: 'child_1', name: '李小明', monthsLeft: 120, bioFather: 'player' }], contacts: [{ id: 'core_spouse', kind: 'spouse', name: '伴侣' }], log: [] } },
  { name: 'actor-swap-corrupt', game: { week: 120, cash: 6000, money: 5e7, married: false, divorced: true, playerName: '小艾', playerGender: 'male', playerSurname: '王', partnerDisplayName: '林婉', portfolio: { '600000': 50 }, stocks: null, stockSeed: 2031, ownsHome: true, villaOwned: true, parentsInheritanceSettled: true, children: [{ id: 'child_0', contactId: 'child_0', name: '王晨', surname: '王', monthsLeft: 180, bioFather: 'player' }], playerCompany: { founded: true, brandName: '大飞集团', name: '大飞集团', industries: ['交通运输'], holdings: [{ symbol: '601939', name: '建设银行', shares: 50000000 }], subsidiaries: [{ companyId: 'co_sub1', companyName: '收购公司A', ownershipPct: 80, status: 'active' }], staff: [{ id: 's1', name: '员工' }], board: { playerShares: 100, execs: {} }, equity: { holders: [{ id: 'player', pct: 100 }] } }, artifactStats: { stockCostBasis: { '601939': { shares: 100000000, cost: 680000000 } } }, monthLedgerHistory: [{ incomeTotal: 12000000, expenseTotal: 4500000, net: 7500000 }], contacts: [{ id: 'core_spouse', kind: 'spouse', name: '林婉' }, { id: 'core_ex_spouse', kind: 'ex_spouse', name: '林婉' }], companion: { playerName: '小艾', cash: 6000, portfolio: { '600000': 50 }, divorced: true, married: false }, log: [] } }
]);

const results = vm.runInContext(`(() => {
  const cases = ${cases};
  const out = [];
  cases.forEach(function (rec) {
    try {
      const g = JSON.parse(JSON.stringify(rec.game));
      if (!repairGameRecord(g, 0, { salvage: true })) throw new Error('repairGameRecord failed');
      const market = g.market;
      const corp = initCompanyUniverse(market);
      restoreGameState(g, corp);
      currentSlotIndex = 0;
      game._loadingSave = true;
      migrateLoadedGameState(0);
      game._loadingSave = false;
      if (typeof buildFamilyTreeGraph === 'function') buildFamilyTreeGraph('player');
      if (rec.name === 'actor-swap-corrupt') {
        if (game.playerName === '小艾') throw new Error('playerName still 小艾');
        if ((game.portfolio && game.portfolio['601939'] || 0) < 1000000) throw new Error('CCB not restored');
        if (!game.married || game.divorced) throw new Error('should be married not divorced');
        if (game.parentsInheritanceSettled) throw new Error('parents should be alive');
        const ex = (game.contacts || []).some(function (c) { return c && (c.kind === 'ex_spouse' || c.id === 'core_ex_spouse'); });
        if (ex) throw new Error('erroneous ex_spouse should be cleared');
        if (!game.playerCompany || String(game.playerCompany.brandName || '').indexOf('大飞') < 0) throw new Error('company missing');
        if (!game.villaOwned) throw new Error('villa missing');
        if ((game.cash || 0) < 1e6) throw new Error('cash not restored');
        const ch = (game.children || []).find(function (c) { return c && c.surname === '王'; });
        if (!ch || String(ch.name || '').indexOf('晨') < 0) throw new Error('child 王晨 lost');
      }
      if (typeof collectCompanyPeople === 'function' && game.playerCompany && game.playerCompany.founded) {
        collectCompanyPeople();
        if (typeof syncAllPlayerStaffCircles === 'function') syncAllPlayerStaffCircles();
      }
      out.push({ name: rec.name, ok: true });
    } catch (e) {
      out.push({ name: rec.name, ok: false, err: e.message, stack: (e.stack || '').split('\\n').slice(0, 8).join('\\n') });
    }
  });
  return out;
})()`, ctx);

let failed = 0;
results.forEach(function (r) {
  if (r.ok) console.log('OK:', r.name);
  else {
    failed++;
    console.error('FAIL:', r.name, r.err);
    console.error(r.stack);
  }
});
process.exit(failed ? 1 : 0);
