/**
 * SETE LAGOAS POLÍTICA — app.js
 * JavaScript Vanilla · MVP
 *
 * Módulos:
 *  1. Menu mobile (hamburger)
 *  2. Barra de progresso de leitura
 *  3. Filtro de notícias
 *  4. Animações de entrada (IntersectionObserver)
 *  5. Navegação ativa (highlight do item atual)
 *  6. Smooth scroll para âncoras internas
 *
 * Arquitetura preparada para integração futura com Firebase.
 */

'use strict';

/* ============================================================
   1. MENU MOBILE
   ============================================================ */
function initMobileMenu() {
  const toggle    = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('is-open');

    toggle.classList.toggle('is-active');
    mobileNav.classList.toggle('is-open');

    toggle.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.setAttribute('aria-hidden', String(isOpen));
  });

  // Fechar ao clicar em link mobile
  mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('is-active');
      mobileNav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });

  // Fechar ao pressionar Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      toggle.classList.remove('is-active');
      mobileNav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      toggle.focus();
    }
  });
}

/* ============================================================
   2. BARRA DE PROGRESSO DE LEITURA
   ============================================================ */
function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop    = window.scrollY || document.documentElement.scrollTop;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = Math.min(progress, 100) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ============================================================
   3. FILTRO DE NOTÍCIAS
   ============================================================ */
function initFiltroNoticias() {
  const btns    = document.querySelectorAll('[data-filtro]');
  const cards   = document.querySelectorAll('[data-categoria]');
  const semRes  = document.getElementById('sem-resultados');

  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filtro = btn.getAttribute('data-filtro');

      // Atualizar estado dos botões
      btns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // Filtrar cards
      let visiveis = 0;
      cards.forEach(card => {
        const cat = card.getAttribute('data-categoria');
        const mostrar = filtro === 'todas' || cat === filtro;

        if (mostrar) {
          card.removeAttribute('data-hidden');
          card.style.animation = 'none'; // FIX: 'noneAnim 0s' era inválido
          // Trigger reflow para animação
          void card.offsetWidth;
          card.style.animation = '';
          visiveis++;
        } else {
          card.setAttribute('data-hidden', 'true');
        }
      });

      // Mensagem sem resultados
      if (semRes) {
        semRes.classList.toggle('visivel', visiveis === 0);
      }
    });
  });
}

/* ============================================================
   4. ANIMAÇÕES DE ENTRADA (IntersectionObserver)
   ============================================================ */
function initFadeInAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Delay escalonado para elementos dentro do mesmo container
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Atribuir delays escalonados por seção
  const sections = document.querySelectorAll('.cards-grid, .principios-grid, .noticias-grid, .missao-grid');
  sections.forEach(section => {
    section.querySelectorAll('.fade-in').forEach((el, i) => {
      el.dataset.delay = i * 80;
    });
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   5. NAVEGAÇÃO ATIVA
   ============================================================ */
function initActiveNav() {
  const pagePath = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link, .mobile-nav-link, .footer-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Se já foi marcado via aria-current no HTML, apenas espelha a classe .active
    if (link.getAttribute('aria-current') === 'page') {
      link.classList.add('active');
      return;
    }

    const linkPage = href.split('/').pop();
    const isIndex  = (linkPage === 'index.html' || linkPage === '') &&
                     (pagePath === '' || pagePath === 'index.html');
    const isMatch  = linkPage === pagePath;

    if (isIndex || isMatch) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   6. SMOOTH SCROLL PARA ÂNCORAS INTERNAS
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
      const elementTop   = target.getBoundingClientRect().top + window.scrollY;
      const offsetPos    = elementTop - headerHeight - 16;

      window.scrollTo({ top: offsetPos, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   7. HERO: Animação de texto entrada
   ============================================================ */
function initHeroAnimation() {
  const heroLabel = document.querySelector('.hero-label');
  const heroTitle = document.querySelector('.hero-title');
  const heroText  = document.querySelector('.hero-text');
  const heroActions = document.querySelector('.hero-actions');
  const heroVisual  = document.querySelector('.hero-visual');

  const items = [heroLabel, heroTitle, heroText, heroActions, heroVisual].filter(Boolean);

  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.65s ease ${i * 0.12}s, transform 0.65s ease ${i * 0.12}s`;
  });

  // Trigger no próximo frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      items.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}

/* ============================================================
   FUTURE: Firebase integration hooks (não ativo no MVP)
   ============================================================ */
// const FirebaseConfig = {
//   apiKey:            'YOUR_API_KEY',
//   authDomain:        'YOUR_AUTH_DOMAIN',
//   projectId:         'YOUR_PROJECT_ID',
//   storageBucket:     'YOUR_STORAGE_BUCKET',
//   messagingSenderId: 'YOUR_SENDER_ID',
//   appId:             'YOUR_APP_ID',
// };
//
// async function fetchNoticias() { /* Firebase Firestore */ }
// async function fetchManifesto() { /* Firebase Storage */ }

/* ============================================================
   INIT — Ponto de entrada
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initReadingProgress();
  initFiltroNoticias();
  initFadeInAnimations();
  initActiveNav();
  initSmoothScroll();
  initHeroAnimation();
  // Gamificação controlada por gamification.js
});
