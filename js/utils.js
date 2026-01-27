// ============================================
// B-SIDE - Utils (Funzioni Utility)
// ============================================

import { MEDIA_BASE_URL } from './config.js';

/**
 * Formatta secondi in formato m:ss
 * @param {number} s - Secondi
 * @returns {string} - Tempo formattato
 */
export function formatTime(s) {
  if (isNaN(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

/**
 * Formatta data da YYYY-MM-DD a DD/MM/YYYY
 * @param {string} d - Data in formato YYYY-MM-DD
 * @returns {string} - Data formattata
 */
export function formatDate(d) {
  const p = d.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}

/**
 * Costruisce URL dell'episodio dalla data
 * @param {string} d - Data in formato YYYY-MM-DD
 * @returns {string} - URL completo del file audio
 */
export function buildUrl(d) {
  const p = d.split('-');
  return MEDIA_BASE_URL + '/' + p[0] + '/' + p[1] + '/' + p[2] +
         '/episodes/bertallot/bertallot_' + p[0] + p[1] + p[2] + '_220000.mp3';
}
