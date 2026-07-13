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

  // Stato rete
  network: {
    isOnline: navigator.onLine,
    type: null,
    downlink: null,
    rtt: null,
    quality: 100
  },

  // Sistema di recovery
  recovery: {
    isActive: false,
    attempt: 0,
    maxAttempts: 35,
    strategy: 'seek',
    timer: null,
    watchdog: null,
    watchdogTimeout: 20000
  },

  // Intento utente
  intent: {
    shouldBePlaying: false
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
