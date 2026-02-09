// ============================================
// B-SIDE - Toast (Notifiche)
// ============================================

let toastElement = null;
let toastTimeout = null;

/**
 * Inizializza il sistema di notifiche toast
 */
export function initToast() {
  toastElement = document.getElementById('toast');
}

/**
 * Mostra una notifica toast
 * @param {string} message - Messaggio da mostrare
 * @param {string} type - Tipo di notifica ('info' o 'error')
 * @param {number} duration - Durata in ms (default 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
  if (!toastElement) return;

  // Cancella timeout precedente
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  // Imposta messaggio e tipo
  toastElement.textContent = message;
  toastElement.className = 'toast';
  if (type === 'error') {
    toastElement.classList.add('error');
  }

  // Mostra toast
  toastElement.classList.add('show');

  // Nascondi dopo la durata
  toastTimeout = setTimeout(function() {
    toastElement.classList.remove('show');
  }, duration);
}

/**
 * Nasconde il toast
 */
export function hideToast() {
  if (!toastElement) return;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  toastElement.classList.remove('show');
}
