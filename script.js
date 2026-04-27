(() => {
  'use strict';

  const TORCH_DURATION = 60 * 60; // seconds
  const STAFF_DURATION = 60 * 60;
  const SPEED_UP_THRESHOLD = 10;
  const SPEED_UP_RESET_MS = 2000;

  // ── State ────────────────────────────────────────────────────────
  let mode = null;        // 'torch' | 'staff'
  let totalSeconds = 0;
  let remaining = 0;
  let running = false;
  let tickInterval = null;
  let controlsVisible = true;
  let controlsTimeout = null;

  // Speed-up tracking
  let plusPressCount = 0, minusPressCount = 0;
  let plusLastPress = 0, minusLastPress = 0;

  // ── DOM ──────────────────────────────────────────────────────────
  const menuScreen    = document.getElementById('menu');
  const timerScreen   = document.getElementById('timer-screen');
  const flameContainer = document.getElementById('flame-container');
  const glowContainer  = document.getElementById('glow-container');
  const timeDisplay   = document.getElementById('time-display');
  const modeLabel     = document.getElementById('mode-label');
  const controls      = document.getElementById('controls');
  const darkness      = document.getElementById('darkness');
  const stopConfirm   = document.getElementById('stop-confirm');

  const btnPlay    = document.getElementById('btn-play');
  const btnStop    = document.getElementById('btn-stop');
  const btnMinus5  = document.getElementById('btn-minus5');
  const btnMinus1  = document.getElementById('btn-minus1');
  const btnPlus1   = document.getElementById('btn-plus1');
  const btnPlus5   = document.getElementById('btn-plus5');
  const btnConfirmStop   = document.getElementById('btn-confirm-stop');
  const btnCancelStop    = document.getElementById('btn-cancel-stop');

  // ── Torch state machine ──────────────────────────────────────────
  // 0=igniting 1=full 2=mid 3=low 4=extinguishing 5=dark
  function torchStateClass() {
    const pct = remaining / totalSeconds;
    if (!running && remaining === totalSeconds) return 'state-igniting';
    if (pct > 0.5)  return 'state-full';
    if (pct > 0.1)  return 'state-mid';
    if (pct > 0)    return 'state-low';
    return 'state-dark';
  }

  // Staff state machine
  // 0=igniting 1=glowing 2=dim 3=extinguishing 4=dark
  function staffStateClass() {
    const pct = remaining / totalSeconds;
    if (!running && remaining === totalSeconds) return 'glow-state-igniting';
    if (pct > 0.15) return 'glow-state-glowing';
    if (pct > 0)    return 'glow-state-dim';
    return 'glow-state-dark';
  }

  // ── Render ───────────────────────────────────────────────────────
  function renderTimer() {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    timeDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function renderState() {
    if (mode === 'torch') {
      const cls = torchStateClass();
      flameContainer.className = cls;
      if (cls === 'state-dark') {
        onExtinguished();
      }
    } else {
      const cls = staffStateClass();
      glowContainer.className = cls;
      if (cls === 'glow-state-dark') {
        onExtinguished();
      }
    }
  }

  function renderPlayButton() {
    btnPlay.textContent = running ? '⏸' : '▶';
  }

  let extinguished = false;
  function onExtinguished() {
    if (extinguished) return;
    extinguished = true;
    stopTick();
    darkness.classList.add('visible');
    setTimeout(() => location.reload(), 5000);
  }

  // ── Timer logic ──────────────────────────────────────────────────
  function startTick() {
    if (tickInterval) return;
    tickInterval = setInterval(() => {
      if (!running) return;
      remaining = Math.max(0, remaining - 1);
      renderTimer();
      renderState();
    }, 1000);
  }

  function stopTick() {
    clearInterval(tickInterval);
    tickInterval = null;
    running = false;
    renderPlayButton();
  }

  function adjustTime(deltaSec) {
    remaining = Math.max(0, Math.min(totalSeconds * 3, remaining + deltaSec));
    renderTimer();
    renderState();
  }

  function speedAdjust(direction) {
    const now = Date.now();
    if (direction === 1) {
      if (now - plusLastPress < SPEED_UP_RESET_MS) plusPressCount++;
      else plusPressCount = 1;
      plusLastPress = now;
      const factor = Math.floor(plusPressCount / SPEED_UP_THRESHOLD) || 1;
      adjustTime(factor * 60);
    } else {
      if (now - minusLastPress < SPEED_UP_RESET_MS) minusPressCount++;
      else minusPressCount = 1;
      minusLastPress = now;
      const factor = Math.floor(minusPressCount / SPEED_UP_THRESHOLD) || 1;
      adjustTime(-factor * 60);
    }
  }

  // ── Controls visibility ──────────────────────────────────────────
  function showControls() {
    controls.classList.remove('hidden');
    controlsVisible = true;
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(hideControls, 3500);
  }

  function hideControls() {
    controls.classList.add('hidden');
    controlsVisible = false;
  }

  // ── Boot mode ────────────────────────────────────────────────────
  function startMode(m) {
    mode = m;
    totalSeconds = m === 'torch' ? TORCH_DURATION : STAFF_DURATION;
    remaining = totalSeconds;
    extinguished = false;

    modeLabel.textContent = m === 'torch' ? 'torch' : 'light spell';
    menuScreen.classList.add('hidden');
    timerScreen.classList.remove('hidden');

    flameContainer.style.display = m === 'torch' ? 'flex' : 'none';
    glowContainer.style.display  = m === 'staff'  ? 'flex' : 'none';

    renderTimer();
    renderState();
    renderPlayButton();
    showControls();

    // Brief igniting delay then autostart
    setTimeout(() => {
      running = true;
      renderPlayButton();
      renderState();
      startTick();
    }, 1200);
  }

  // ── Event handlers ────────────────────────────────────────────────
  document.getElementById('btn-torch').addEventListener('click', () => startMode('torch'));
  document.getElementById('btn-staff').addEventListener('click', () => startMode('staff'));

  timerScreen.addEventListener('click', (e) => {
    if (e.target.closest('#controls') || e.target.closest('#stop-confirm')) return;
    controlsVisible ? hideControls() : showControls();
  });

  btnPlay.addEventListener('click', (e) => {
    e.stopPropagation();
    running = !running;
    if (running) startTick();
    renderPlayButton();
    showControls();
  });

  let wasRunning = false;

  btnStop.addEventListener('click', (e) => {
    e.stopPropagation();
    wasRunning = running;
    stopConfirm.classList.remove('hidden');
    stopTick();
  });

  btnConfirmStop.addEventListener('click', () => {
    stopConfirm.classList.add('hidden');
    remaining = 0;
    renderTimer();
    renderState();
  });

  btnCancelStop.addEventListener('click', () => {
    stopConfirm.classList.add('hidden');
    if (wasRunning) {
      running = true;
      renderPlayButton();
      startTick();
    } else {
      renderPlayButton();
    }
  });

  btnMinus5.addEventListener('click', (e) => { e.stopPropagation(); adjustTime(-300); showControls(); });
  btnMinus1.addEventListener('click', (e) => { e.stopPropagation(); adjustTime(-60);  showControls(); });
  btnPlus1.addEventListener('click',  (e) => { e.stopPropagation(); adjustTime(60);   showControls(); });
  btnPlus5.addEventListener('click',  (e) => { e.stopPropagation(); adjustTime(300);  showControls(); });

})();
