// ============================================
// B-SIDE - Sleep (Timer Spegnimento)
// ============================================

import { Engine, setIsPlaying } from './engine.js';
import { elements, updatePlayIcon } from './ui.js';
import { savePositionToStorage } from './storage.js';

// Stato del timer
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
  // Pulisci timer precedente
  if (sleepInterval) {
    clearInterval(sleepInterval);
    sleepInterval = null;
  }

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

  // Usa setInterval che controlla attivamente se il tempo è scaduto
  // Questo funziona meglio quando l'app è in background
  sleepInterval = setInterval(checkAndUpdateSleep, 1000);
}

/**
 * Controlla se il timer è scaduto e aggiorna il display
 */
function checkAndUpdateSleep() {
  if (!sleepEndTime) {
    if (sleepInterval) {
      clearInterval(sleepInterval);
      sleepInterval = null;
    }
    return;
  }

  const rem = sleepEndTime - Date.now();

  // Timer scaduto
  if (rem <= 0) {
    stopPlayback();
    return;
  }

  // Aggiorna display
  const m = Math.floor(rem / 60000);
  const s = Math.floor((rem % 60000) / 1000);
  elements.sleepCountdown.textContent = m + ':' + (s < 10 ? '0' : '') + s;
}

/**
 * Ferma la riproduzione quando il timer scade
 */
function stopPlayback() {
  // Salva la posizione prima di fermare
  if (Engine.audio.currentTime > 0) {
    Engine.position.current = Engine.audio.currentTime;
    const datePicker = document.getElementById('datePicker');
    if (datePicker && datePicker.value) {
      savePositionToStorage(datePicker.value);
    }
  }

  // Ferma la riproduzione
  Engine.intent.shouldBePlaying = false;
  Engine.audio.pause();
  setIsPlaying(false);
  updatePlayIcon(false);

  // Reset del timer
  setSleep(0);
}

/**
 * Aggiorna il display del countdown (per compatibilità)
 */
export function updateSleepDisplay() {
  if (!sleepEndTime) return;

  const rem = Math.max(0, sleepEndTime - Date.now());

  if (rem === 0) {
    stopPlayback();
    return;
  }

  const m = Math.floor(rem / 60000);
  const s = Math.floor((rem % 60000) / 1000);
  elements.sleepCountdown.textContent = m + ':' + (s < 10 ? '0' : '') + s;
}
