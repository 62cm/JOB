/* 原始压力回归 · 高压减寿 — 由 build.js 注入 */
const BASE_STRESS_PULL = 2;
const STRESS_LIFE_WARN = 100;
const STRESS_LIFE_STREAK_WEEKS = 4;

function tickBaseStressRegression() {
  if (!game || game.gameOver) return;
  const base = game.baseStress != null ? game.baseStress : 30;
  const cur = typeof playerStress === 'function' ? playerStress() : (game.familyStress || 0);
  if (cur <= base) return;
  const pull = Math.min(BASE_STRESS_PULL, cur - base);
  if (pull > 0 && typeof addStress === 'function') addStress(-pull, '向心力 ');
}

function tickStressLifespanPenalty() {
  if (!game || game.gameOver) return;
  if (typeof migrateLifespanSystem === 'function') migrateLifespanSystem();
  const stress = typeof playerStress === 'function' ? playerStress() : (game.familyStress || 0);
  game.stressLifeStreak = game.stressLifeStreak || 0;
  game.stressLifeWarnings = game.stressLifeWarnings || 0;
  if (stress > STRESS_LIFE_WARN) {
    game.stressLifeStreak++;
    if (game.stressLifeStreak === STRESS_LIFE_STREAK_WEEKS) {
      game.stressLifeWarnings++;
      game.stressLifeStreak = 0;
      game.lifeExpectancy = Math.max(40, (game.lifeExpectancy || 80) - 1);
      if (game.deathWeek != null) game.deathWeek = Math.max(game.week + 1, game.deathWeek - 52);
      if (typeof addLog === 'function') {
        addLog('⚠ 连续 ' + STRESS_LIFE_STREAK_WEEKS + ' 周压力>' + STRESS_LIFE_WARN + ' · 预期寿命 −1 岁（现 ' + game.lifeExpectancy + ' 岁）', 'warn');
      }
    }
  } else {
    game.stressLifeStreak = 0;
  }
}

function tickLifeExtensions() {
  tickBaseStressRegression();
  tickStressLifespanPenalty();
}
