// ============================================
// B-SIDE - Network (Monitoraggio Rete e Recovery)
// ============================================

import { Engine, isPlaying, setIsPlaying } from './engine.js';
import { savePositionToStorage } from './storage.js';
import { updatePlayIcon } from './ui.js';

/**
 * Inizializza il monitoraggio della rete
 */
export function initNetworkMonitoring() {
  updateNetworkInfo();
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  if ('connection' in navigator) {
    navigator.connection.addEventListener('change', function() {
      const oldQ = Engine.network.quality;
      updateNetworkInfo();

      if (Engine.intent.shouldBePlaying && Engine.network.quality > oldQ) {
        Engine.recovery.attempt = Math.max(0, Engine.recovery.attempt - 2);
        clearRecoveryTimers();

        if (!isPlaying) {
          setTimeout(function() {
            if (Engine.intent.shouldBePlaying && !isPlaying) {
              executeRecovery();
            }
          }, 800);
        }
      }
    });
  }
}

/**
 * Aggiorna le informazioni sulla rete
 */
export function updateNetworkInfo() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  Engine.network.isOnline = navigator.onLine;

  if (conn) {
    Engine.network.type = conn.effectiveType;
    Engine.network.downlink = conn.downlink;
    Engine.network.rtt = conn.rtt;
    Engine.network.saveData = conn.saveData;
  }

  Engine.network.quality = calculateNetworkQuality();
}

/**
 * Calcola la qualità della rete (0-100)
 * @returns {number}
 */
export function calculateNetworkQuality() {
  if (!navigator.onLine) return 0;

  const type = Engine.network.type;
  const downlink = Engine.network.downlink;
  const rtt = Engine.network.rtt;
  let quality = 100;

  if (type === 'slow-2g') quality = 10;
  else if (type === '2g') quality = 30;
  else if (type === '3g') quality = 60;
  else if (type === '4g') quality = 90;

  if (downlink !== null && downlink !== undefined) {
    if (downlink < 0.5) quality = Math.min(quality, 20);
    else if (downlink < 1) quality = Math.min(quality, 40);
    else if (downlink < 2) quality = Math.min(quality, 60);
  }

  if (rtt !== null && rtt !== undefined) {
    if (rtt > 500) quality = Math.min(quality, 30);
    else if (rtt > 300) quality = Math.min(quality, 50);
  }

  return quality;
}

/**
 * Handler per evento online
 */
export function handleOnline() {
  Engine.network.isOnline = true;
  updateNetworkInfo();

  if (Engine.intent.shouldBePlaying && !isPlaying) {
    Engine.recovery.attempt = 0;
    clearRecoveryTimers();

    setTimeout(function() {
      if (Engine.intent.shouldBePlaying && !isPlaying) {
        executeRecovery();
      }
    }, 500);
  }
}

/**
 * Handler per evento offline
 */
export function handleOffline(dateValue) {
  Engine.network.isOnline = false;
  Engine.network.quality = 0;

  if (isPlaying || Engine.intent.shouldBePlaying) {
    Engine.intent.shouldBePlaying = true;
    Engine.position.current = Engine.audio.currentTime || Engine.position.current;
    savePositionToStorage(dateValue);
  }
}

/**
 * Cancella i timer di recovery
 */
export function clearRecoveryTimers() {
  if (Engine.recovery.timer) {
    clearTimeout(Engine.recovery.timer);
    Engine.recovery.timer = null;
  }

  if (Engine.recovery.watchdog) {
    clearTimeout(Engine.recovery.watchdog);
    Engine.recovery.watchdog = null;
  }

  Engine.recovery.scheduledAt = null;
  Engine.recovery.expectedDelay = null;
}

/**
 * Calcola il delay per il prossimo tentativo di recovery
 * @returns {number} - Delay in ms
 */
export function calculateRecoveryDelay() {
  const attempt = Engine.recovery.attempt;
  let baseDelay;

  if (attempt === 0) baseDelay = 500;
  else if (attempt < 3) baseDelay = 1000;
  else if (attempt < 6) baseDelay = 2000;
  else if (attempt < 10) baseDelay = 3000;
  else if (attempt < 15) baseDelay = 5000;
  else if (attempt < 25) baseDelay = 8000;
  else baseDelay = 12000;

  if (Engine.network.quality < 30) baseDelay *= 1.5;
  else if (Engine.network.quality < 60) baseDelay *= 1.2;

  return Math.min(baseDelay, 15000);
}

/**
 * Pianifica un tentativo di recovery
 */
export function scheduleRecovery() {
  if (!Engine.intent.shouldBePlaying || Engine.recovery.attempt >= Engine.recovery.maxAttempts) {
    return;
  }

  clearRecoveryTimers();

  const delay = calculateRecoveryDelay();
  Engine.recovery.scheduledAt = Date.now();
  Engine.recovery.expectedDelay = delay;

  Engine.recovery.timer = setTimeout(function() {
    if (Engine.intent.shouldBePlaying && !isPlaying) {
      executeRecovery();
    }
  }, delay);
}

/**
 * Esegue un tentativo di recovery
 */
export function executeRecovery() {
  if (!Engine.intent.shouldBePlaying || isPlaying || !Engine.network.isOnline) {
    return;
  }

  Engine.recovery.isActive = true;
  Engine.recovery.startTime = Date.now();
  Engine.recovery.attempt++;

  const strategies = ['seek', 'play', 'reload'];
  Engine.recovery.strategy = strategies[Engine.recovery.attempt % strategies.length];

  startWatchdog();

  try {
    if (Engine.recovery.strategy === 'seek' && Engine.audio.duration) {
      const targetTime = Math.max(0, Engine.position.current - 2);
      Engine.audio.currentTime = targetTime;
      Engine.audio.play().catch(function() {
        scheduleRecovery();
      });
    } else if (Engine.recovery.strategy === 'reload') {
      Engine.audio.src = Engine.currentUrl;
      Engine.audio.load();
      Engine.audio.currentTime = Engine.position.current;
      Engine.audio.play().catch(function() {
        scheduleRecovery();
      });
    } else {
      Engine.audio.play().catch(function() {
        scheduleRecovery();
      });
    }
  } catch (e) {
    scheduleRecovery();
  }
}

/**
 * Avvia il watchdog timer
 */
export function startWatchdog() {
  if (Engine.recovery.watchdog) {
    clearTimeout(Engine.recovery.watchdog);
  }

  Engine.recovery.watchdog = setTimeout(function() {
    if (Engine.recovery.isActive && !isPlaying && Engine.intent.shouldBePlaying) {
      scheduleRecovery();
    }
  }, Engine.recovery.watchdogTimeout);
}

/**
 * Chiamato quando il recovery ha successo
 */
export function recoverySuccess() {
  clearRecoveryTimers();
  Engine.recovery.isActive = false;
  Engine.recovery.attempt = 0;
  Engine.recovery.lastRecoveryTime = Date.now();
}
