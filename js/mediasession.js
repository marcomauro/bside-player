// ============================================
// B-SIDE - Media Session (Controlli Lockscreen)
// ============================================

import { Engine } from './engine.js';
import { formatDate } from './utils.js';
import { elements } from './ui.js';

const SKIP_TIME = 30; // secondi per skip

/**
 * Aggiorna i metadata della Media Session
 */
export function updateMediaSession() {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: 'Puntata del ' + formatDate(elements.datePicker.value),
      artist: 'Alessio Bertallot',
      album: 'B-SIDE - Radio Capital',
      artwork: [
        { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    });
  }
}

/**
 * Aggiorna la posizione corrente nella Media Session
 * Necessario per mostrare i controlli seek su Android
 */
export function updatePositionState() {
  if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
    try {
      if (Engine.audio.duration && !isNaN(Engine.audio.duration)) {
        navigator.mediaSession.setPositionState({
          duration: Engine.audio.duration,
          playbackRate: Engine.audio.playbackRate || 1,
          position: Engine.audio.currentTime || 0
        });
      }
    } catch (e) {
      // Ignora errori di positionState
    }
  }
}

/**
 * Inizializza i controlli della Media Session
 */
export function initMediaSession() {
  if (!('mediaSession' in navigator)) return;

  // Play
  navigator.mediaSession.setActionHandler('play', function() {
    Engine.intent.shouldBePlaying = true;

    if (Engine.position.current > 0 && Engine.audio.duration && Engine.position.current < Engine.audio.duration) {
      Engine.audio.currentTime = Engine.position.current;
    }

    Engine.audio.play();
  });

  // Pause
  navigator.mediaSession.setActionHandler('pause', function() {
    Engine.position.current = Engine.audio.currentTime;
    Engine.intent.shouldBePlaying = false;
    Engine.intent.pausedByUser = true;
    Engine.audio.pause();
  });

  // Seek backward (-30s) - mostra pulsante su Android
  navigator.mediaSession.setActionHandler('seekbackward', function(details) {
    const skipTime = details.seekOffset || SKIP_TIME;
    const t = Math.max(0, Engine.audio.currentTime - skipTime);
    Engine.position.current = t;
    Engine.audio.currentTime = t;
    updatePositionState();
  });

  // Seek forward (+30s) - mostra pulsante su Android
  navigator.mediaSession.setActionHandler('seekforward', function(details) {
    const skipTime = details.seekOffset || SKIP_TIME;
    const t = Math.min(Engine.audio.duration || Infinity, Engine.audio.currentTime + skipTime);
    Engine.position.current = t;
    Engine.audio.currentTime = t;
    updatePositionState();
  });

  // Previous track (fallback per alcuni dispositivi)
  navigator.mediaSession.setActionHandler('previoustrack', function() {
    const t = Math.max(0, Engine.audio.currentTime - SKIP_TIME);
    Engine.position.current = t;
    Engine.audio.currentTime = t;
    updatePositionState();
  });

  // Next track (fallback per alcuni dispositivi)
  navigator.mediaSession.setActionHandler('nexttrack', function() {
    const t = Math.min(Engine.audio.duration || Infinity, Engine.audio.currentTime + SKIP_TIME);
    Engine.position.current = t;
    Engine.audio.currentTime = t;
    updatePositionState();
  });

  // Seek to posizione specifica (progress bar lockscreen)
  navigator.mediaSession.setActionHandler('seekto', function(details) {
    if (details.seekTime !== undefined) {
      Engine.position.current = details.seekTime;
      Engine.audio.currentTime = details.seekTime;
      updatePositionState();
    }
  });

  // Stop
  try {
    navigator.mediaSession.setActionHandler('stop', function() {
      Engine.intent.shouldBePlaying = false;
      Engine.audio.pause();
      Engine.audio.currentTime = 0;
      Engine.position.current = 0;
    });
  } catch (e) {
    // stop non supportato su tutti i browser
  }
}
