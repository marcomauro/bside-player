// ============================================
// B-SIDE - Install (PWA Install Prompt)
// ============================================

import { deferredPrompt, setDeferredPrompt } from './engine.js';
import { elements } from './ui.js';

/**
 * Inizializza la gestione dell'installazione PWA
 */
export function initInstall() {
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    setDeferredPrompt(e);
    elements.installPrompt.classList.add('show');
  });

  elements.installBtn.addEventListener('click', function() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function() {
        setDeferredPrompt(null);
        elements.installPrompt.classList.remove('show');
      });
    }
  });

  elements.installClose.addEventListener('click', function() {
    elements.installPrompt.classList.remove('show');
  });

  window.addEventListener('appinstalled', function() {
    elements.installPrompt.classList.remove('show');
  });
}

/**
 * Registra il Service Worker
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(function() {})
      .catch(function() {});
  }
}
