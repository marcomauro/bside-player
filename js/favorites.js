// ============================================
// B-SIDE - Favorites (Gestione Preferiti)
// ============================================

import { getFavorites, setFavorites } from './storage.js';
import { formatDate } from './utils.js';
import { elements, updateNav } from './ui.js';
import { updatePlayer } from './audio.js';
import { updateMediaSession } from './mediasession.js';

// Array dei preferiti
let favorites = [];

/**
 * Inizializza i preferiti
 */
export function initFavorites() {
  favorites = getFavorites();

  elements.favBtn.addEventListener('click', function() {
    const d = elements.datePicker.value;
    const idx = favorites.indexOf(d);

    if (idx > -1) {
      favorites.splice(idx, 1);
    } else {
      favorites.unshift(d);
    }

    setFavorites(favorites);
    updateFav();
  });

  elements.menuBtn.addEventListener('click', function() {
    renderFavList();
    elements.favOverlay.classList.add('show');
  });

  elements.favOverlay.addEventListener('click', function(e) {
    if (e.target === elements.favOverlay) {
      elements.favOverlay.classList.remove('show');
    }
  });
}

/**
 * Aggiorna lo stato del pulsante preferito
 */
export function updateFav() {
  elements.favBtn.classList.toggle('active', favorites.indexOf(elements.datePicker.value) > -1);
}

/**
 * Renderizza la lista dei preferiti
 */
export function renderFavList() {
  if (favorites.length === 0) {
    elements.favList.innerHTML = '<div class="favorites-empty">Nessun preferito salvato</div>';
    return;
  }

  let h = '';
  for (let i = 0; i < favorites.length; i++) {
    const d = favorites[i];
    h += '<div class="fav-item" data-date="' + d + '">' +
         '<span>' + formatDate(d) + '</span>' +
         '<button class="fav-item-del" data-date="' + d + '">' +
         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
         '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
         '</svg></button></div>';
  }

  elements.favList.innerHTML = h;

  // Event listeners per i preferiti
  elements.favList.querySelectorAll('.fav-item').forEach(function(item) {
    item.addEventListener('click', function(e) {
      if (!e.target.closest('.fav-item-del')) {
        elements.datePicker.value = item.getAttribute('data-date');
        updatePlayer();
        updateNav();
        updateFav();
        updateMediaSession();
        elements.favOverlay.classList.remove('show');
      }
    });
  });

  // Event listeners per i pulsanti elimina
  elements.favList.querySelectorAll('.fav-item-del').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const d = btn.getAttribute('data-date');
      const idx = favorites.indexOf(d);

      if (idx > -1) {
        favorites.splice(idx, 1);
      }

      setFavorites(favorites);
      updateFav();
      renderFavList();
    });
  });
}
