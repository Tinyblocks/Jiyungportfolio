// Index page now renders from static tiles emitted by 11ty. 
// We only need filtering behavior; tiles already exist in the DOM.

const galleryEl = document.getElementById('gallery');
const chips = document.querySelectorAll('.chip');
const navLinks = document.querySelectorAll('[data-filter]');

function render(filter = 'all') {
  if (!galleryEl) return;
  galleryEl.setAttribute('aria-busy', 'true');
  const tiles = Array.from(galleryEl.querySelectorAll('.tile'));
  for (const tile of tiles) {
    const cat = tile.dataset.category || 'all';
    const show = filter === 'all' ? true : cat === filter;
    tile.style.display = show ? '' : 'none';
  }
  galleryEl.removeAttribute('aria-busy');
}

function setActive(filter) {
  chips.forEach(b => {
    const is = b.dataset.filter === filter || (filter === 'all' && b.dataset.filter === 'all');
    b.classList.toggle('is-active', is);
    b.setAttribute('aria-pressed', is ? 'true' : 'false');
  });
}

chips.forEach(b => b.addEventListener('click', (e) => {
  const f = e.currentTarget.dataset.filter;
  setActive(f);
  render(f);
  history.replaceState({}, '', f === 'all' ? '/' : `#${f}`);
}));

navLinks.forEach(a => a.addEventListener('click', (e) => {
  const f = e.currentTarget.dataset.filter;
  if (location.pathname.endsWith('/about.html')) {
    e.preventDefault();
    location.href = `/${'#' + f}`; // go home with hash; home bootstraps from hash
    return;
  }
  e.preventDefault();
  setActive(f);
  render(f);
}));

// Initial render – from hash if present
const hash = (location.hash || '#all').replace('#','');
setActive(hash);
render(hash);


