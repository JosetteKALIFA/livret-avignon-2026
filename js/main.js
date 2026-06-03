// ═══════════════════════════════════════
// JOSETTE KALIFA — LIVRET AVIGNON 2026
// Navigation multi-pages & PWA
// ═══════════════════════════════════════

// Menu burger mobile
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const burger = document.querySelector('.nav-burger i');
  if (links) {
    links.classList.toggle('open');
    if (burger) burger.className = links.classList.contains('open') ? 'ti ti-x' : 'ti ti-menu-2';
  }
}

// Fermer le menu quand on clique sur un lien (navigation entre pages)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function() {
    const links = document.querySelector('.nav-links');
    const burger = document.querySelector('.nav-burger i');
    if (links) links.classList.remove('open');
    if (burger) burger.className = 'ti ti-menu-2';
  });
});

// Fermer le menu au clic extérieur
document.addEventListener('click', function(e) {
  const nav = document.querySelector('.nav');
  const links = document.querySelector('.nav-links');
  if (links && links.classList.contains('open') && nav && !nav.contains(e.target)) {
    links.classList.remove('open');
    const burger = document.querySelector('.nav-burger i');
    if (burger) burger.className = 'ti ti-menu-2';
  }
});

// PWA — bouton installer
let deferredPrompt;
const installBanner = document.getElementById('install-banner');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBanner) installBanner.classList.add('visible');
});

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
      if (installBanner) installBanner.classList.remove('visible');
    });
  }
}

function dismissInstall() {
  if (installBanner) installBanner.classList.remove('visible');
}

window.addEventListener('appinstalled', () => {
  if (installBanner) installBanner.classList.remove('visible');
});

// ═══════════════════════════════════════
// TRANSITION EN FONDU ENTRE LES PAGES
// ═══════════════════════════════════════
document.addEventListener('click', function(e) {
  const a = e.target.closest('a[href]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href) return;

  // Ignorer : ancres, nouvel onglet, liens externes, mailto/tel, téléchargements
  const isExternal = /^(https?:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
  if (href.startsWith('#') || a.target === '_blank' || a.hasAttribute('download') || isExternal) return;

  // Lien interne → fondu de sortie rapide puis navigation
  e.preventDefault();
  document.body.classList.add('page-leaving');
  setTimeout(function() { window.location.href = href; }, 130);
});

// Réinitialiser le fondu au retour arrière (bfcache)
window.addEventListener('pageshow', function() {
  document.body.classList.remove('page-leaving');
});

// Nav top — devient opaque au scroll
const navTop = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (navTop) {
    navTop.style.background = window.scrollY > 50
      ? 'rgba(0,0,0,0.98)'
      : 'rgba(0,0,0,0.7)';
  }
});
