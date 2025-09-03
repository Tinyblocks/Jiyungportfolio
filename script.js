// Index page now renders from static tiles emitted by 11ty. 
// We only need filtering behavior; tiles already exist in the DOM.

const galleryEl = document.getElementById('gallery');
const chips = document.querySelectorAll('.chip');
const navLinks = document.querySelectorAll('[data-filter]');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

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
  const f = e.currentTarget.dataset.filter || 'all';
  e.preventDefault();
  const onHome = !!galleryEl; // gallery exists only on home
  if (!onHome) {
    location.href = f === 'all' ? '/' : `/#${f}`; // navigate home with hash
    return;
  }
  setActive(f);
  render(f);
  if (mobileMenu && !mobileMenu.hasAttribute('hidden')) closeMenu();
  history.replaceState({}, '', f === 'all' ? '/' : `#${f}`);
}));

// Initial render – from hash if present
const hash = (location.hash || '#all').replace('#','');
setActive(hash);
render(hash);

// Mobile menu interactivity
function openMenu(){ if(!mobileMenu) return; mobileMenu.removeAttribute('hidden'); document.body.style.overflow='hidden'; menuToggle?.setAttribute('aria-expanded','true'); }
function closeMenu(){ if(!mobileMenu) return; mobileMenu.setAttribute('hidden',''); document.body.style.overflow=''; menuToggle?.setAttribute('aria-expanded','false'); }
menuToggle?.addEventListener('click', ()=>{
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  expanded ? closeMenu() : openMenu();
});
mobileMenu?.addEventListener('click', (e)=>{
  if (e.target === mobileMenu) closeMenu();
});
document.querySelectorAll('[data-close-menu]')?.forEach(el=>el.addEventListener('click', closeMenu));


