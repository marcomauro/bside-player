// ============================================
// B-SIDE - Sleep (Timer Spegnimento)
// ============================================

import { Engine, setIsPlaying } from './engine.js';
import { elements, updatePlayIcon } from './ui.js';

// Stato del timer
let sleepTimer = null;
let sleepEndTime = null;
let sleepInterval = null;

/**
 * Inizializza il timer di spegnimento
 */
export function initSleep() {
  elements.sleepBtn.addEventListener('click', function() {
    elements.sleepOverlay.classList.add('show');
  });

  elements.sleepOverlay.addEventListener('click', function(e) {
    if (e.target === elements.sleepOverlay) {
      elements.sleepOverlay.classList.remove('show');
    }
  });

  const sleepOptions = document.querySelectorAll('.sleep-option');
  sleepOptions.forEach(function(opt) {
    opt.addEventListener('click', function() {
      const min = parseInt(opt.getAttribute('data-min'));
      setSleep(min);
      elements.sleepOverlay.classList.remove('show');

      sleepOptions.forEach(function(o) {
        o.classList.remove('selected');
      });

      if (min > 0) {
        opt.classList.add('selected');
      }
    });
  });
}

/**
 * Imposta il timer di spegnimento
 * @param {number} min - Minuti prima dello spegnimento (0 per disattivare)
 */
export function setSleep(min) {
  if (sleepTimer) clearTimeout(sleepTimer);
  if (sleepInterval) clearInterval(sleepInterval);

  if (min === 0) {
    sleepEndTime = null;
    elements.sleepIcon.style.display = '';
    elements.sleepCountdown.style.display = 'none';
    elements.sleepBtn.classList.remove('active');
    return;
  }

  sleepEndTime = Date.now() + min * 60000;
  elements.sleepBtn.classList.add('active');
  elements.sleepIcon.style.display = 'none';
  elements.sleepCountdown.style.display = '';

  updateSleepDisplay();

  sleepInterval = setInterval(updateSleepDisplay, 1000);

  sleepTimer = setTimeout(function() {
    Engine.intent.shouldBePlaying = false;
    Engine.audio.pause();
    updatePlayIcon(false);
    setIsPlaying(false);
    setSleep(0);
  }, min * 60000);
}

/**
 * Aggiorna il display del countdown
 */
export function updateSleepDisplay() {
  if (!sleepEndTime) return;

  const rem = Math.max(0, sleepEndTime - Date.now());

  if (rem === 0) {
    setSleep(0);
    return;
  }

  const m = Math.floor(rem / 60000);
  const s = Math.floor((rem % 60000) / 1000);
  elements.sleepCountdown.textContent = m + ':' + (s < 10 ? '0' : '') + s;
}
