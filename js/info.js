// ============================================
// B-SIDE - Info (Informazioni App)
// ============================================

import { APP_VERSION, APP_BUILD_DATE } from './config.js';

/**
 * Inizializza il popup informazioni
 */
export function initInfo() {
  const infoBtn = document.getElementById('infoBtn');
  const infoOverlay = document.getElementById('infoOverlay');
  const appVersion = document.getElementById('appVersion');
  const appBuild = document.getElementById('appBuild');

  // Imposta versione e build date
  if (appVersion) {
    appVersion.textContent = 'Versione ' + APP_VERSION;
  }
  if (appBuild) {
    appBuild.textContent = 'Build: ' + APP_BUILD_DATE;
  }

  // Apri popup
  infoBtn.addEventListener('click', function() {
    infoOverlay.classList.add('show');
  });

  // Chiudi popup cliccando fuori
  infoOverlay.addEventListener('click', function(e) {
    if (e.target === infoOverlay) {
      infoOverlay.classList.remove('show');
    }
  });
}
