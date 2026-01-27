// ============================================
// B-SIDE - Engine (Stato Globale)
// ============================================

/**
 * Engine - Oggetto centrale per la gestione dello stato dell'applicazione
 */
export const Engine = {
  audio: null,
  currentUrl: '',

  // Tracciamento posizione
  position: {
    current: 0,
    lastSaved: 0,
    saveInterval: null
  },

  // Stato buffer
  buffer: {
    ahead: 0,
    minHealthy: 10,
    isHealthy: false,
    percent: 0
  },

  // Stato rete
  network: {
    isOnline: navigator.onLine,
    type: null,
    downlink: null,
    rtt: null,
    saveData: false,
    quality: 100
  },

  // Sistema di recovery
  recovery: {
    isActive: false,
    startTime: null,
    attempt: 0,
    maxAttempts: 35,
    strategy: 'seek',
    timer: null,
    watchdog: null,
    watchdogTimeout: 20000,
    scheduledAt: null,
    expectedDelay: null,
    lastEventTime: 0,
    lastRecoveryTime: 0,
    minEventInterval: 2000
  },

  // Intento utente
  intent: {
    shouldBePlaying: false,
    pausedByUser: false,
    pausedBySystem: false
  },

  // Ciclo di vita pagina
  lifecycle: {
    isVisible: true,
    isActive: true,
    lastActiveTime: Date.now()
  }
};

// Stato UI globale
export let isPlaying = false;
export function setIsPlaying(value) {
  isPlaying = value;
}

// Deferred prompt per installazione PWA
export let deferredPrompt = null;
export function setDeferredPrompt(value) {
  deferredPrompt = value;
}
