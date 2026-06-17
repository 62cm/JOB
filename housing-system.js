/* 住房 · 租房/购房/住家 — 由 build.js 注入 */
const HOUSING_RENT_PLANS = [
  { id: 'group', label: '群租', monthly: 300, depositMonths: 1, payMonths: 1, tier: 1 },
  { id: 'shared', label: '单间合租', monthly: 800, depositMonths: 1, payMonths: 3, tier: 2 },
  { id: 'private', label: '独户', monthly: 2000, depositMonths: 1, payMonths: 3, tier: 3 },
  { id: 'large', label: '大公寓', monthly: 6000, depositMonths: 1, payMonths: 3, tier: 4 },
  { id: 'premium', label: '高级公寓', monthly: 8000, depositMonths: 1, payMonths: 3, tier: 5 }
];
const COMMERCIAL_HOME_PRICE = 3000000;
const HOUSING_TIER = { home: 0, dorm: 0, group: 1, shared: 2, private: 3, large: 4, premium: 5, commercial: 6, villa: 7 };
const HOUSING_MOVE_STRESS = 50;
const HOUSING_MOVE_PACK_SLOTS = 2;
const HOUSING_MOVE_RELOC_SLOTS = 1;
const HOUSING_MOVE_LARGE_TIER = 4;
const HOUSING_PACK_HOURS_UNIT = 16;
const HOUSING_LEASE_WEEKS = 52;

function rentPlanMeta(id) {
  return HOUSING_RENT_PLANS.find(function (p) { return p.id === id; }) || null;
}

function migratePlayerHousing(g) {
  g = g || game;
  if (!g || g._housingMigrated) return;
  if (g.housingType) { g._housingMigrated = true; return; }
  if (g.livingAtHome || g.livingSituation === 'home') g.housingType = 'home';
  else if (g.inSchoolDorm || g.livingSituation === 'dorm') g.housingType = 'dorm';
  else if (g.villaOwned) g.housingType = 'villa';
  else if (g.ownsHome) g.housingType = 'commercial';
  g._housingMigrated = true;
}

function migrateRentPlanFields(g) {
  g = g || game;
  if (!g || !g.rentPlan) return;
  const rp = g.rentPlan;
  if (rp.movedIn == null) {
    rp.movedIn = !!(g.housingType && g.housingType === rp.id);
  }
  if (!rp.expireWeek && rp.signedWeek) rp.expireWeek = rp.signedWeek + HOUSING_LEASE_WEEKS;
  if (!rp.expireWeek && g.week) {
    rp.signedWeek = g.week;
    rp.expireWeek = g.week + HOUSING_LEASE_WEEKS;
  }
}

function playerHousingTier(g) {
  g = g || game;
  if (!g) return 0;
  migratePlayerHousing(g);
  if (g.villaOwned) return HOUSING_TIER.villa;
  const ht = g.housingType;
  if (ht && HOUSING_TIER[ht] != null) return HOUSING_TIER[ht];
  if (g.ownsHome) return HOUSING_TIER.commercial;
  return 0;
}

function housingAllowsSex(g) { return playerHousingTier(g) >= HOUSING_TIER.shared; }
function housingAllowsCohabit(g) { return playerHousingTier(g) >= HOUSING_TIER.large; }
function housingAllowsMarriage(g) { return playerHousingTier(g) >= HOUSING_TIER.private; }

function housingRestrictionHint(kind) {
  if (kind === 'sex') return '住房需至少「单间合租」才可做爱';
  if (kind === 'cohabit') return '住房需至少「大公寓」才可与伴侣同居';
  if (kind === 'marry') return '住房需至少「独户」才可结婚';
  return '住房条件不足';
}

function rentMoveInCost(plan) {
  return plan.monthly * plan.depositMonths + plan.monthly * plan.payMonths;
}

function playerRentContractId(g) {
  g = g || game;
  if (!g || !g.rentPlan || !g.rentPlan.id) return null;
  migrateRentPlanFields(g);
  return g.rentPlan.id;
}

function playerActiveRentPlanId(g) {
  return playerRentContractId(g);
}

function isLivingAtRentPlan(planId, g) {
  g = g || game;
  if (!g || !planId) return false;
  migratePlayerHousing(g);
  migrateRentPlanFields(g);
  return g.housingType === planId && g.rentPlan && g.rentPlan.id === planId && g.rentPlan.movedIn !== false;
}

function hasRentContractNotMovedIn(g) {
  g = g || game;
  if (!g || !g.rentPlan) return false;
  migrateRentPlanFields(g);
  return g.rentPlan.movedIn === false;
}

function isCurrentRentPlan(planId) {
  return isLivingAtRentPlan(planId);
}

function hasRentContractFor(planId, g) {
  return playerRentContractId(g) === planId;
}

function rentContractExpiryLabel(g) {
  g = g || game;
  if (!g || !g.rentPlan || !g.rentPlan.expireWeek) return '';
  const ds = typeof getDateStr === 'function' ? getDateStr(g.rentPlan.expireWeek) : ('第' + g.rentPlan.expireWeek + '周');
  return '合同到期 ' + ds + ' · 一年一签 · 到期不续约定金不退';
}

function housingMoveSlotMultFromTier(tier) {
  return tier >= HOUSING_MOVE_LARGE_TIER ? 2 : 1;
}

function housingMoveSlotMult(plan) {
  return plan && plan.tier >= HOUSING_MOVE_LARGE_TIER ? 2 : 1;
}

function housingMoveRequirements(plan, isHome) {
  let m = 1;
  if (isHome) {
    m = housingMoveSlotMultFromTier(playerHousingTier());
  } else {
    const curMult = housingMoveSlotMultFromTier(playerHousingTier());
    const targetMult = plan ? housingMoveSlotMult(plan) : 1;
    m = Math.max(curMult, targetMult);
  }
  const batches = HOUSING_MOVE_RELOC_SLOTS * m;
  return { pack: batches, move: batches };
}

function housingMovePackReadyForNextMove(mv) {
  if (!mv) return false;
  return (mv.packDone || 0) > (mv.moveDone || 0);
}

function housingMoveCanStartPack(mv) {
  if (!mv) return false;
  if ((mv.packDone || 0) >= mv.packNeed) return false;
  return (mv.packDone || 0) <= (mv.moveDone || 0);
}

function housingMoveProgressLabel(mv) {
  if (!mv) return '';
  const packed = housingMovePackReadyForNextMove(mv);
  const partial = mv.packHoursPartial || 0;
  const batch = Math.min((mv.moveDone || 0) + 1, mv.moveNeed);
  let s = '第' + batch + '批 · ';
  if (packed) s += '已整理';
  else if (partial > 0) s += '整理 ' + partial + '/' + HOUSING_PACK_HOURS_UNIT + 'h';
  else s += '整理 0/' + HOUSING_PACK_HOURS_UNIT + 'h';
  s += ' · 搬家 ' + (mv.moveDone || 0) + '/' + mv.moveNeed;
  return s;
}

function syncHousingMovePersist() {
  const mv = game && game.housingMove;
  if (!mv) return;
  const snap = {
    packDone: mv.packDone || 0,
    moveDone: mv.moveDone || 0,
    packHoursPartial: mv.packHoursPartial || 0,
    packNeed: mv.packNeed,
    moveNeed: mv.moveNeed
  };
  if (mv.targetKind === 'rent' && game.rentPlan && game.rentPlan.id === mv.targetPlanId) {
    game.rentPlan.moveProgress = snap;
  } else if (mv.targetKind === 'home') {
    game._housingMoveHome = snap;
  }
}

function clearHousingMovePersist() {
  if (game && game.rentPlan) delete game.rentPlan.moveProgress;
  if (game) delete game._housingMoveHome;
}

function restoreHousingMoveFromRentPlan(planId) {
  if (!game || !planId) return false;
  migrateRentPlanFields(game);
  const rp = game.rentPlan;
  if (!rp || rp.id !== planId || rp.movedIn) return false;
  const mp = rp.moveProgress;
  if (!mp) return false;
  if (!(mp.packDone > 0 || mp.moveDone > 0 || mp.packHoursPartial > 0)) return false;
  const plan = rentPlanMeta(planId);
  const req = housingMoveRequirements(plan, false);
  game.housingMove = {
    targetKind: 'rent',
    targetPlanId: planId,
    packNeed: req.pack,
    moveNeed: req.move,
    packDone: Math.min(mp.packDone || 0, req.pack),
    moveDone: Math.min(mp.moveDone || 0, req.move),
    packHoursPartial: (mp.moveDone || 0) < (mp.packDone || 0) ? 0 : (mp.packHoursPartial || 0)
  };
  return true;
}

function restoreHousingMoveHome() {
  if (!game || !game._housingMoveHome) return false;
  const mp = game._housingMoveHome;
  if (!(mp.packDone > 0 || mp.moveDone > 0 || mp.packHoursPartial > 0)) return false;
  const req = housingMoveRequirements(null, true);
  game.housingMove = {
    targetKind: 'home',
    targetPlanId: null,
    packNeed: req.pack,
    moveNeed: req.move,
    packDone: Math.min(mp.packDone || 0, req.pack),
    moveDone: Math.min(mp.moveDone || 0, req.move),
    packHoursPartial: (mp.moveDone || 0) < (mp.packDone || 0) ? 0 : (mp.packHoursPartial || 0)
  };
  return true;
}

function housingMoveTargetLabel(mv) {
  if (!mv) return '';
  if (mv.targetKind === 'home') return '搬回父母家';
  const plan = rentPlanMeta(mv.targetPlanId);
  return plan ? '搬入「' + plan.label + '」' : '搬家';
}

function housingEnsureDailyReady() {
  if (!game || !game.daily || game.daily.dayIndex >= 7) {
    addLog('请在「日常」页安排时段后再整理/搬家', 'warn');
    return false;
  }
  return true;
}

function housingDoPackProgress() {
  if (!housingEnsureDailyReady()) return false;
  const mv = game.housingMove;
  if (!mv || (mv.packDone || 0) >= mv.packNeed) return false;
  if (!housingMoveCanStartPack(mv)) {
    addLog('本批已整理完毕，请先安排早晨搬家', 'warn');
    return false;
  }
  if (typeof dailySlotHoursLeft !== 'function') return false;
  const left = dailySlotHoursLeft();
  if (left <= 0) {
    addLog('本时段已满', 'fail');
    return false;
  }
  const inProgress = mv.packHoursPartial || 0;
  const need = HOUSING_PACK_HOURS_UNIT - inProgress;
  const take = Math.min(left, need);
  const after = inProgress + take;
  const jump = take >= left || after >= HOUSING_PACK_HOURS_UNIT;
  if (typeof dailyAddHours === 'function') dailyAddHours(take, jump);
  else return false;
  if (after >= HOUSING_PACK_HOURS_UNIT) {
    mv.packDone = (mv.packDone || 0) + 1;
    mv.packHoursPartial = 0;
    addLog('📦 本批行李整理完毕（' + mv.packDone + '/' + mv.packNeed + '）· 可安排早晨搬家', 'success');
  } else {
    mv.packHoursPartial = after;
    addLog('📦 整理行李 ' + after + '/' + HOUSING_PACK_HOURS_UNIT + 'h（占 ' + take + 'h）', 'info');
  }
  syncHousingMovePersist();
  if (typeof autoSaveSlot === 'function') autoSaveSlot();
  return true;
}

function housingDoRelocateProgress() {
  if (!housingEnsureDailyReady()) return false;
  const mv = game.housingMove;
  if (!mv) return false;
  const d = game.daily;
  if ((d.phase || 'morning') !== 'morning') {
    addLog('搬家须从早晨时段开始，且占满整个时段', 'fail');
    return false;
  }
  if (!housingMovePackReadyForNextMove(mv)) {
    addLog('请先完成本批整理（' + HOUSING_PACK_HOURS_UNIT + 'h · 约 ' + HOUSING_MOVE_PACK_SLOTS + ' 个时段）', 'warn');
    return false;
  }
  if (typeof dailyUseMainActivity === 'function' && !dailyUseMainActivity()) return false;
  const plan = mv.targetKind === 'rent' ? rentPlanMeta(mv.targetPlanId) : null;
  const label = '🚚 搬家（' + ((mv.moveDone || 0) + 1) + '/' + mv.moveNeed + '）· ' + housingMoveTargetLabel(mv);
  addLog(label, 'info');
  mv.moveDone = (mv.moveDone || 0) + 1;
  if (typeof dailyAdvanceAfterSlotAction === 'function') dailyAdvanceAfterSlotAction();
  else if (typeof renderDailyPanel === 'function') renderDailyPanel();
  if (mv.moveDone >= mv.moveNeed) {
    if (mv.targetKind === 'home') completeHousingMoveHome();
    else completeHousingMove();
  } else {
    addLog('🚚 本批已搬完 · 还需整理并搬下一批', 'info');
    syncHousingMovePersist();
    refreshHousingUi();
  }
  if (typeof autoSaveSlot === 'function') autoSaveSlot();
  return true;
}

function refreshHousingUi() {
  if (typeof renderDailyPanel === 'function') renderDailyPanel();
  if (typeof updateUI === 'function') updateUI();
}

function signRentContract(plan) {
  if (!game || !plan) return false;
  migrateRentPlanFields(game);
  if (game.rentPlan && game.rentPlan.id === plan.id) return true;
  if (game.rentPlan && game.rentPlan.id !== plan.id) {
    addLog('已有「' + game.rentPlan.label + '」租约 · 请先处理现有合同', 'warn');
    return false;
  }
  const cost = rentMoveInCost(plan);
  if (game.cash < cost) {
    addLog('签约「' + plan.label + '」需 ¥' + cost.toLocaleString() + '（押' + plan.depositMonths + '付' + plan.payMonths + '）', 'fail');
    return false;
  }
  game.cash -= cost;
  game.rentPlan = {
    id: plan.id, label: plan.label, monthly: plan.monthly,
    depositMonths: plan.depositMonths, payMonths: plan.payMonths, tier: plan.tier,
    signedWeek: game.week, expireWeek: game.week + HOUSING_LEASE_WEEKS,
    depositHeld: plan.monthly * plan.depositMonths, movedIn: false
  };
  if (typeof ledgerAddExpense === 'function') ledgerAddExpense('housing', '🏠', plan.label + ' 押' + plan.depositMonths + '付' + plan.payMonths + '（一年合同）', cost, false);
  addLog('📝 签订「' + plan.label + '」租约 · ¥' + cost.toLocaleString() + ' · ' + rentContractExpiryLabel(), 'success');
  return true;
}

function finalizeRentMoveIn(plan) {
  if (!game || !plan) return;
  migrateRentPlanFields(game);
  clearPlayerOwnedHome(game);
  game.villaOwned = false;
  game.housingType = plan.id;
  game.livingSituation = 'rent';
  game.livingAtHome = false;
  game.inSchoolDorm = false;
  if (!game.rentPlan || game.rentPlan.id !== plan.id) {
    game.rentPlan = {
      id: plan.id, label: plan.label, monthly: plan.monthly,
      depositMonths: plan.depositMonths, payMonths: plan.payMonths, tier: plan.tier,
      signedWeek: game.week, expireWeek: game.week + HOUSING_LEASE_WEEKS,
      depositHeld: plan.monthly * plan.depositMonths, movedIn: true
    };
  } else {
    game.rentPlan.movedIn = true;
    if (!game.rentPlan.expireWeek) game.rentPlan.expireWeek = game.week + HOUSING_LEASE_WEEKS;
  }
  delete game.rentPlan.moveProgress;
  addLog('🏠 搬入「' + plan.label + '」· 🔑已入住 · 月租 ¥' + plan.monthly, 'success');
  syncHousingCohabitRule();
  refreshHousingUi();
}

function completeHousingMove() {
  const mv = game && game.housingMove;
  if (!mv || mv.targetKind !== 'rent') return;
  const plan = rentPlanMeta(mv.targetPlanId);
  if (!plan) { game.housingMove = null; return; }
  finalizeRentMoveIn(plan);
  if (typeof addStress === 'function') addStress(HOUSING_MOVE_STRESS, '搬家 ');
  else game.stress = (game.stress || 0) + HOUSING_MOVE_STRESS;
  game.housingMove = null;
  clearHousingMovePersist();
  if (typeof autoSaveSlot === 'function') autoSaveSlot();
}

function completeHousingMoveHome() {
  if (!game) return;
  if (game.rentPlan) {
    const dep = game.rentPlan.depositHeld || (game.rentPlan.monthly * (game.rentPlan.depositMonths || 1));
    addLog('🏠 搬回父母家 · 租约结束 · 押金 ¥' + dep.toLocaleString() + ' 不退', 'warn');
    game.rentPlan = null;
  }
  clearPlayerOwnedHome(game);
  game.housingType = 'home';
  game.livingSituation = 'home';
  game.livingAtHome = true;
  game.inSchoolDorm = false;
  game.villaOwned = false;
  if (typeof addStress === 'function') addStress(HOUSING_MOVE_STRESS, '搬家 ');
  else game.stress = (game.stress || 0) + HOUSING_MOVE_STRESS;
  addLog('🏡 已搬回父母家同住', 'success');
  game.housingMove = null;
  clearHousingMovePersist();
  syncHousingCohabitRule();
  refreshHousingUi();
  if (typeof autoSaveSlot === 'function') autoSaveSlot();
}

function initHousingMove(targetPlanIdOrHome) {
  const isHome = targetPlanIdOrHome === 'home';
  const plan = isHome ? null : rentPlanMeta(targetPlanIdOrHome);
  if (!isHome && !plan) return false;
  if (isHome) {
    if (game.housingType === 'home' || game.livingAtHome) {
      addLog('已在父母家', 'warn');
      return false;
    }
  } else if (isLivingAtRentPlan(plan.id)) {
    addLog('已住在此', 'warn');
    return false;
  }
  if (game.housingMove) {
    const same = isHome
      ? game.housingMove.targetKind === 'home'
      : (game.housingMove.targetKind === 'rent' && game.housingMove.targetPlanId === targetPlanIdOrHome);
    return same;
  }
  if (!isHome && restoreHousingMoveFromRentPlan(plan.id)) return true;
  if (isHome && restoreHousingMoveHome()) return true;
  const req = housingMoveRequirements(plan, isHome);
  game.housingMove = {
    targetKind: isHome ? 'home' : 'rent',
    targetPlanId: isHome ? null : plan.id,
    packNeed: req.pack,
    moveNeed: req.move,
    packDone: 0,
    moveDone: 0,
    packHoursPartial: 0
  };
  syncHousingMovePersist();
  const multNote = req.move > 1 ? '（大公寓及以上×2 · 分' + req.move + '批）' : '';
  addLog('📦 开始' + housingMoveTargetLabel(game.housingMove) + ' · 每批整理 ' + HOUSING_PACK_HOURS_UNIT + 'h + 早晨搬家 1 时段' + multNote + ' · 完成后压力+' + HOUSING_MOVE_STRESS, 'info');
  return true;
}

function buildHousingMoveModalHtml() {
  const mv = game.housingMove;
  if (!mv) return '<p>无进行中的搬家</p>';
  const plan = mv.targetKind === 'rent' ? rentPlanMeta(mv.targetPlanId) : null;
  const packed = housingMovePackReadyForNextMove(mv);
  const ph = game.daily && game.daily.phase;
  const canDaily = game.daily && game.daily.dayIndex < 7;
  let h = '<p><b>' + housingMoveTargetLabel(mv) + '</b></p>';
  h += '<p class="fold-meta">' + housingMoveProgressLabel(mv) + '</p>';
  if (mv.targetKind === 'rent' && plan) {
    h += '<p class="fold-meta">月租 ¥' + plan.monthly + ' · 整理每次 ' + HOUSING_PACK_HOURS_UNIT + 'h（可跨时段凑满）</p>';
  }
  if (!canDaily) h += '<p style="color:var(--orange);font-size:.72rem">请切换到「日常」页操作时段</p>';
  else if (packed) {
    h += '<p style="color:var(--green);font-size:.72rem">✓ 本批已整理 · 搬家须<b>早晨时段</b>且占满 8h</p>';
    if (ph !== 'morning') h += '<p class="fold-meta">当前非早晨，搬家按钮暂不可用</p>';
  } else {
    h += '<p class="fold-meta">整理占 ' + HOUSING_PACK_HOURS_UNIT + 'h/批（约 2 个时段，不足会自动跨时段补齐）</p>';
  }
  return h;
}

function showHousingMoveModal() {
  const mv = game.housingMove;
  if (!mv) return;
  const packed = housingMovePackReadyForNextMove(mv);
  const ph = game.daily && game.daily.phase;
  const canMove = packed && ph === 'morning' && game.daily.dayIndex < 7 &&
    typeof dailySlotHoursLeft === 'function' && dailySlotHoursLeft() >= (typeof SLOT_HOURS_TOTAL !== 'undefined' ? SLOT_HOURS_TOTAL : 8);
  const packAllDone = (mv.packDone || 0) >= mv.packNeed;
  const packLabel = packAllDone ? '整理已完成' : (packed ? '本批已整理' : '📦 整理');
  const moveLabel = canMove ? '🚚 搬家（早晨·占满时段）' : '🚚 搬家（需已整理·早晨）';
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '📦',
      title: '整理与搬家',
      html: buildHousingMoveModalHtml(),
      buttons: [
        {
          text: packLabel,
          primary: !packAllDone && !packed,
          handler: function () {
            if ((mv.packDone || 0) >= mv.packNeed) { addLog('整理已全部完成', 'warn'); return; }
            if (housingDoPackProgress()) showHousingMoveModal();
          }
        },
        {
          text: moveLabel,
          primary: canMove,
          handler: function () {
            if (!housingMovePackReadyForNextMove(mv)) { addLog('请先完成本批整理', 'warn'); showHousingMoveModal(); return; }
            if ((game.daily.phase || 'morning') !== 'morning') { addLog('搬家须从早晨时段开始', 'fail'); showHousingMoveModal(); return; }
            if (housingDoRelocateProgress()) {
              if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
              else showHousingMoveModal();
            } else showHousingMoveModal();
          }
        },
        {
          text: '取消',
          handler: function () {
            if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
          }
        }
      ]
    });
    return;
  }
  if (typeof showConsumeModal === 'function') {
    showConsumeModal({
      icon: '📦', title: '整理与搬家', html: buildHousingMoveModalHtml(),
      buttons: [{ text: '知道了', primary: true, fn: 'closeConsumeModal()' }]
    });
  }
}

function openHousingMoveModal(targetPlanIdOrHome) {
  if (!game || game.gameOver) return;
  const isHome = targetPlanIdOrHome === 'home';
  const plan = isHome ? null : rentPlanMeta(targetPlanIdOrHome);
  if (!isHome && !plan) return;
  if (isHome) {
    if (game.housingType === 'home' || game.livingAtHome) { addLog('已在父母家', 'warn'); return; }
  } else {
    if (isLivingAtRentPlan(plan.id)) { addLog('已住在「' + plan.label + '」', 'warn'); return; }
    if (!signRentContract(plan)) return;
  }
  if (!isHome) restoreHousingMoveFromRentPlan(plan.id);
  else restoreHousingMoveHome();
  if (game.housingMove) {
    const same = isHome ? game.housingMove.targetKind === 'home' : (game.housingMove.targetKind === 'rent' && game.housingMove.targetPlanId === targetPlanIdOrHome);
    if (!same) {
      addLog('请先完成当前搬家（' + housingMoveProgressLabel(game.housingMove) + '）', 'warn');
      return;
    }
  } else if (!initHousingMove(targetPlanIdOrHome)) return;
  showHousingMoveModal();
}

function startHousingMove(planId) {
  openHousingMoveModal(planId);
}

function doHousingMovePackSlot() {
  if (housingDoPackProgress()) showHousingMoveModal();
}

function doHousingMoveRelocateSlot() {
  if (housingDoRelocateProgress()) {
    if (typeof closeConsumeModal === 'function') closeConsumeModal(true);
  }
}

function cancelHousingMove() {
  if (!game || !game.housingMove) return;
  game.housingMove = null;
  addLog('已关闭搬家窗口（整理进度已保留，已签合同仍有效）', 'info');
  refreshHousingUi();
}

function toggleRentHousingInfo() {
  if (!game) return;
  game.rentInfoOpen = !game.rentInfoOpen;
  refreshHousingUi();
}

function renderRentHousingInfoHtml() {
  let h = '<div class="fold-meta" style="margin:6px 0;padding:8px;border:1px solid var(--border);border-radius:6px;line-height:1.55">';
  h += '<div><b>租房</b> · 一年一签 · 到期不续约定金不退 · 整理 ' + HOUSING_PACK_HOURS_UNIT + 'h×2/批 + 早晨搬家</div>';
  h += '<div style="margin-top:4px;color:var(--muted)">单间以下不可做爱 · 独户以下不可结婚 · 大公寓以下不可同居</div>';
  HOUSING_RENT_PLANS.forEach(function (p) {
    const cost = rentMoveInCost(p);
    h += '<div style="margin-top:4px"><b>' + p.label + '</b> · ¥' + p.monthly + '/月 · 首付 ¥' + cost.toLocaleString() + '（押' + p.depositMonths + '付' + p.payMonths + '）</div>';
  });
  h += '</div>';
  return h;
}

function renderRentPlanButtonsHtml() {
  migrateRentPlanFields(game);
  const mv = game.housingMove;
  let h = '<div style="display:flex;flex-wrap:nowrap;gap:3px;margin:6px 0;overflow-x:auto">';
  HOUSING_RENT_PLANS.forEach(function (p) {
    const living = isLivingAtRentPlan(p.id);
    const contracted = hasRentContractFor(p.id) && !living;
    const movingHere = mv && mv.targetKind === 'rent' && mv.targetPlanId === p.id;
    const movingElse = mv && !movingHere;
    let cls = 'btn';
    let label = p.label;
    let onclick = ' onclick="openHousingMoveModal(\'' + p.id + '\')"';
    let disabled = '';
    if (living) {
      cls += ' disabled-rent btn-rent-active';
      label = '已租·' + p.label + ' 🔑已入住';
      disabled = ' disabled';
      onclick = '';
    } else if (movingHere) {
      cls += ' btn-primary';
      label = '搬入中·' + p.label;
      onclick = ' onclick="showHousingMoveModal()"';
    } else if (contracted) {
      cls += ' btn-primary btn-rent-contract';
      label = '已租·' + p.label;
    } else if (movingElse) {
      disabled = ' disabled title="请先完成当前搬家"';
      onclick = '';
    } else {
      cls += ' btn-phone-shop';
    }
    h += '<button type="button" class="' + cls + '" style="flex:1 0 auto;min-width:0;font-size:.62rem;padding:5px 2px;white-space:nowrap"' + disabled + onclick + '>' + label + '</button>';
  });
  h += '</div>';
  if (game.rentPlan) {
    h += '<p class="fold-meta" style="margin:2px 0 6px">' + rentContractExpiryLabel();
    if (hasRentContractNotMovedIn()) h += ' · 已签约待搬入';
    h += '</p>';
  }
  return h;
}

function renderHousingMoveActionsHtml() {
  const mv = game.housingMove;
  if (!mv) return '';
  let h = '<div style="margin:4px 0;font-size:.68rem;color:var(--muted)">';
  h += housingMoveTargetLabel(mv) + ' · ' + housingMoveProgressLabel(mv);
  h += ' <button type="button" class="btn" style="font-size:.62rem;padding:2px 6px;margin-left:4px" onclick="showHousingMoveModal()">打开搬家</button>';
  h += '</div>';
  return h;
}

function clearPlayerOwnedHome(g) {
  g = g || game;
  if (!g) return;
  g.ownsHome = false;
  g.mortgagePaidOff = false;
  g.mortgagePaymentsMade = 0;
  g.mortgageMonthlyOverride = 0;
}

function syncHousingCohabitRule(g) {
  g = g || game;
  if (!g || !g.married || g.divorced) return;
  if (!housingAllowsCohabit(g)) {
    g._housingForcedLD = true;
    if (!g.longDistance) {
      g.longDistance = true;
      addLog('🏠 当前住房无法同居 · 与伴侣异地分居', 'warn');
    }
  } else if (g._housingForcedLD) {
    g._housingForcedLD = false;
    if (typeof syncLongDistanceFromJob === 'function') syncLongDistanceFromJob(true);
    else g.longDistance = false;
  }
}

function playerHousingStatusLabel(g) {
  g = g || game;
  if (!g) return '';
  migratePlayerHousing(g);
  migrateRentPlanFields(g);
  if (g.homeless) return '流浪';
  if (g.housingType === 'home' || g.livingAtHome) return g.livingOffParents ? '住家里（啃老）' : '住家里';
  if (g.housingType === 'dorm' || g.inSchoolDorm) return '学校寝室';
  const plan = isLivingAtRentPlan(g.housingType) ? (g.rentPlan || rentPlanMeta(g.housingType)) : null;
  if (plan) return plan.label + ' · ¥' + plan.monthly + '/月';
  if (g.rentPlan && !g.rentPlan.movedIn) return '待搬入「' + g.rentPlan.label + '」· 现居 ' + (g.housingType === 'home' ? '家里' : playerHousingStatusLabelFallback(g));
  if (g.villaOwned) return '别墅';
  if (g.ownsHome) return g.mortgagePaidOff ? '商品房（已清贷）' : '商品房（按揭）';
  return '未租房';
}

function playerHousingStatusLabelFallback(g) {
  if (g.housingType && rentPlanMeta(g.housingType)) return rentPlanMeta(g.housingType).label;
  return '其他';
}

function playerMortgageStatLabel(g) {
  g = g || game;
  if (!g) return '—';
  migratePlayerHousing(g);
  migrateRentPlanFields(g);
  if (g.homeless) return '流浪';
  if (g.onWelfare) return '低保';
  if (g.housingType === 'home' || g.livingAtHome) return '住家里';
  if (g.housingType === 'dorm' || g.inSchoolDorm) return '住校';
  if (isLivingAtRentPlan(g.housingType)) {
    const plan = g.rentPlan || rentPlanMeta(g.housingType);
    return '租房 · ' + (plan ? plan.label : '');
  }
  if (g.rentPlan && !g.rentPlan.movedIn) return '已租待搬入';
  if (g.ownsHome && !g.mortgagePaidOff) {
    const months = typeof MORTGAGE_MONTHS !== 'undefined' ? MORTGAGE_MONTHS : 360;
    return '还房贷中 ' + (g.mortgagePaymentsMade || 0) + '/' + months + '月';
  }
  if (g.ownsHome && g.mortgagePaidOff) return '房贷已还清';
  if (g.villaOwned) return '别墅（无按揭）';
  return '未租房';
}

function applyLiveAtHomeChoice() {
  openHousingMoveModal('home');
}

function applyRentHousing(planId) {
  openHousingMoveModal(planId);
}

function buyCommercialApartment() {
  if (!game || game.gameOver) return;
  if (game.ownsHome && game.housingType === 'commercial' && !game.mortgagePaidOff) { addLog('已有商品房按揭中', 'warn'); return; }
  if (game.cash < COMMERCIAL_HOME_PRICE) { addLog('商品房需 ¥' + COMMERCIAL_HOME_PRICE.toLocaleString(), 'fail'); return; }
  if (typeof showConsumeModalHandlers === 'function') {
    showConsumeModalHandlers({
      icon: '🏠', title: '购买商品房',
      html: '<p>价格 <b>¥' + COMMERCIAL_HOME_PRICE.toLocaleString() + '</b> · 按揭约 ¥' + (typeof MORTGAGE_PAYMENT !== 'undefined' ? MORTGAGE_PAYMENT : 6000) + '/月</p>',
      buttons: [
        { text: '确认购买', primary: true, handler: function () { closeConsumeModal(true); confirmBuyCommercialApartment(); } },
        { text: '取消', handler: function () { closeConsumeModal(true); } }
      ]
    });
    return;
  }
  if (!confirm('购买商品房？\n¥' + COMMERCIAL_HOME_PRICE.toLocaleString())) return;
  confirmBuyCommercialApartment();
}

function confirmBuyCommercialApartment() {
  if (game.cash < COMMERCIAL_HOME_PRICE) return;
  game.cash -= COMMERCIAL_HOME_PRICE;
  game.ownsHome = true;
  game.mortgagePaidOff = false;
  game.mortgagePaymentsMade = 0;
  game.mortgageMonthlyOverride = 0;
  game.housingType = 'commercial';
  game.livingSituation = 'owned';
  game.livingAtHome = false;
  game.inSchoolDorm = false;
  game.rentPlan = null;
  if (typeof ledgerAddExpense === 'function') ledgerAddExpense('housing', '🏠', '购置商品房', COMMERCIAL_HOME_PRICE, false);
  addLog('🏠 购入商品房 · 按揭 ¥' + (typeof MORTGAGE_PAYMENT !== 'undefined' ? MORTGAGE_PAYMENT : 6000) + '/月', 'success');
  syncHousingCohabitRule();
  if (typeof checkVictory === 'function') checkVictory();
  refreshHousingUi();
  if (typeof autoSaveSlot === 'function') autoSaveSlot();
}

function openRentHousingPicker() {
  toggleRentHousingInfo();
}

function renderHousingPanel() {
  if (!game) return '';
  migratePlayerHousing(game);
  migrateRentPlanFields(game);
  const cur = playerHousingStatusLabel();
  let h = '<p class="fold-meta" style="margin:0 0 8px">当前：<b>' + cur + '</b></p>';
  h += '<div class="panel-title" style="margin:8px 0 4px">🏠 租房 / 住家</div>';
  if (!(game.housingType === 'home' || game.livingAtHome)) {
    h += '<button type="button" class="btn btn-phone-shop" onclick="applyLiveAtHomeChoice()">🏡 搬回家里（整理+搬家）</button><br>';
  } else h += '<p class="fold-meta" style="color:var(--green)">✓ 住家里 · 无房贷</p>';
  h += '<button type="button" class="btn" style="font-size:.72rem;margin:6px 0" onclick="toggleRentHousingInfo()">' +
    (game.rentInfoOpen ? '▲ 收起租房说明与价格' : 'ℹ️ 租房说明与价格') + '</button>';
  if (game.rentInfoOpen) h += renderRentHousingInfoHtml();
  h += renderRentPlanButtonsHtml();
  h += renderHousingMoveActionsHtml();
  h += '<div class="panel-title" style="margin:8px 0 4px">🏢 购房</div>';
  if (game.ownsHome && game.housingType === 'commercial') {
    if (!game.mortgagePaidOff) {
      const need = typeof mortgageLumpPayoffRemaining === 'function' ? mortgageLumpPayoffRemaining() : COMMERCIAL_HOME_PRICE;
      h += '<p class="fold-meta" style="color:var(--green)">✓ 商品房 · 按揭中</p>';
      h += '<button type="button" class="btn btn-phone-shop" onclick="payMortgageLumpSum()">💰 房贷一次性还清 ¥' + (need / 10000).toFixed(0) + '万</button><br>';
    } else h += '<p class="fold-meta" style="color:var(--green)">✓ 商品房 · 房贷已还清</p>';
  } else {
    h += '<button type="button" class="btn btn-phone-shop" onclick="buyCommercialApartment()">🏠 购买商品房 ¥' + (COMMERCIAL_HOME_PRICE / 10000) + '万</button><br>';
  }
  if (!game.villaOwned) {
    h += '<button type="button" class="btn btn-phone-shop" onclick="buyVilla()">🏡 购买别墅 ¥' + ((typeof VILLA_PRICE !== 'undefined' ? VILLA_PRICE : 10000000) / 10000) + '万</button>';
  } else h += '<p class="fold-meta" style="color:var(--green);margin-top:4px">✓ 别墅 · 管家 ¥' + ((typeof VILLA_BUTLER_MONTHLY !== 'undefined' ? VILLA_BUTLER_MONTHLY : 100000) / 10000) + '万/月</p>';
  return h;
}

function resolveHousingMonthlyExpense(g) {
  g = g || game;
  if (!g || g.homeless || g.onWelfare) return null;
  migratePlayerHousing(g);
  migrateRentPlanFields(g);
  const childExp = (g === game && typeof getPlayerChildExpense === 'function') ? getPlayerChildExpense() : { living: 0, additive: false };
  if (g.housingType === 'home' || g.livingAtHome) {
    let living = applyChildLivingCost(2200, childExp);
    let label = g.livingOffParents ? '住家里（啃老）' : '住家里';
    if (childExp.childLabel) label = childExp.childLabel;
    return { housing: 0, living: living, total: living, mortgage: 0, label: label, isRent: false, affairMult: 1 };
  }
  if (g.housingType === 'dorm' || g.inSchoolDorm) {
    const dorm = g.dormRent || 650;
    let living = applyChildLivingCost(2800, childExp);
    let label = '学校寝室';
    if (childExp.childLabel) label = childExp.childLabel;
    return { housing: dorm, living: living, total: dorm + living, mortgage: 0, label: label, isRent: true, affairMult: 1 };
  }
  if (g.rentPlan && (isLivingAtRentPlan(g.rentPlan.id, g) || g.rentPlan.movedIn === false)) {
    const plan = g.rentPlan;
    let living = applyChildLivingCost(3800, childExp);
    let housing = plan.monthly;
    let label = plan.label + ' · 月租';
    if (childExp.childLabel) label = childExp.childLabel;
    let total = housing + living;
    const affairMult = g.affairActive ? 2 : 1;
    if (affairMult > 1) { total *= affairMult; living *= affairMult; housing *= affairMult; label += ' · 婚外情（花费×2）'; }
    return { housing: housing, living: living, total: total, mortgage: 0, label: label, isRent: true, affairMult: affairMult };
  }
  if (g.divorced) return null;
  if (g.ownsHome) return null;
  return null;
}

function tickHousingRentLease() {
  if (!game || !game.rentPlan) return;
  migrateRentPlanFields(game);
  const rp = game.rentPlan;
  if (!rp.expireWeek) return;
  if (game.week === rp.expireWeek - 4) {
    addLog('🏠 「' + rp.label + '」租约将于 ' + (typeof getDateStr === 'function' ? getDateStr(rp.expireWeek) : '') + ' 到期 · 不续签则押金不退', 'warn');
  }
  if (game.week < rp.expireWeek) return;
  const dep = rp.depositHeld || (rp.monthly * (rp.depositMonths || 1));
  addLog('🏠 「' + rp.label + '」租约到期 · 未续签 · 押金 ¥' + dep.toLocaleString() + ' 不退', 'warn');
  const wasLiving = isLivingAtRentPlan(rp.id);
  game.rentPlan = null;
  if (wasLiving) {
    game.housingType = 'home';
    game.livingAtHome = true;
    game.livingSituation = 'home';
    addLog('已搬回父母家', 'info');
    syncHousingCohabitRule();
  }
}

function patchHousingMonthlyExpenses() {
  if (typeof getMonthlyExpenses !== 'function' || getMonthlyExpenses._housingPatched) return;
  const orig = getMonthlyExpenses;
  getMonthlyExpenses = function () {
    const h = resolveHousingMonthlyExpense(game);
    if (h) {
      if (typeof appendPropertyMonthlyExpenses === 'function') appendPropertyMonthlyExpenses(h);
      return h;
    }
    return orig();
  };
  getMonthlyExpenses._housingPatched = true;
}

function patchHousingUiStats() {
  if (typeof updateUI !== 'function' || updateUI._housingPatched) return;
  const orig = updateUI;
  updateUI = function () {
    orig();
    if (!game) return;
    const mortEl = document.getElementById('statMortgage');
    if (mortEl) mortEl.textContent = playerMortgageStatLabel();
  };
  updateUI._housingPatched = true;
}

function patchHousingLoadMigrate() {
  if (typeof migrateLoadedGameState !== 'function' || migrateLoadedGameState._housingMovePatched) return;
  const orig = migrateLoadedGameState;
  migrateLoadedGameState = function (slotIdx) {
    orig(slotIdx);
    if (!game) return;
    migratePlayerHousing(game);
    migrateRentPlanFields(game);
    if (!game.housingMove && game.rentPlan && game.rentPlan.moveProgress && !game.rentPlan.movedIn) {
      restoreHousingMoveFromRentPlan(game.rentPlan.id);
    } else if (!game.housingMove && game._housingMoveHome) {
      restoreHousingMoveHome();
    }
  };
  migrateLoadedGameState._housingMovePatched = true;
}

patchHousingMonthlyExpenses();
patchHousingUiStats();
patchHousingLoadMigrate();
