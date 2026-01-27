// ============================================
// B-SIDE - Media Session (Controlli Lockscreen)
// ============================================

import { Engine } from './engine.js';
import { formatDate } from './utils.js';
import { elements } from './ui.js';

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
 * Inizializza i controlli della Media Session
 */
export function initMediaSession() {
  if (!('mediaSession' in navigator)) return;

  navigator.mediaSession.setActionHandler('play', function() {
    Engine.intent.shouldBePlaying = true;

    if (Engine.position.current > 0 && Engine.audio.duration && Engine.position.current < Engine.audio.duration) {
      Engine.audio.currentTime = Engine.position.current;
    }

    Engine.audio.play();
  });

  navigator.mediaSession.setActionHandler('pause', function() {
    Engine.position.current = Engine.audio.currentTime;
    Engine.intent.shouldBePlaying = false;
    Engine.intent.pausedByUser = true;
    Engine.audio.pause();
  });

  navigator.mediaSession.setActionHandler('seekbackward', function() {
    const t = Math.max(0, Engine.audio.currentTime - 30);
    Engine.position.current = t;
    Engine.audio.currentTime = t;
  });

  navigator.mediaSession.setActionHandler('seekforward', function() {
    const t = Engine.audio.currentTime + 30;
    Engine.position.current = t;
    Engine.audio.currentTime = t;
  });

  // Pulsanti ⏮ ⏭ nella lockscreen (usati come -30s / +30s)
  navigator.mediaSession.setActionHandler('previoustrack', function() {
    const t = Math.max(0, Engine.audio.currentTime - 30);
    Engine.position.current = t;
    Engine.audio.currentTime = t;
  });

  navigator.mediaSession.setActionHandler('nexttrack', function() {
    const t = Math.min(Engine.audio.duration || Infinity, Engine.audio.currentTime + 30);
    Engine.position.current = t;
    Engine.audio.currentTime = t;
  });

  navigator.mediaSession.setActionHandler('seekto', function(d) {
    if (d.seekTime) {
      Engine.position.current = d.seekTime;
      Engine.audio.currentTime = d.seekTime;
    }
  });
}
