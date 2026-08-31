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
   8. RÁDIO DO PORTAL
   ============================================================ */
function initRadio() {
  const tracks = [
    'A FILA.mp3', 'A FILA (1).mp3',
    'APARTAMENTO VAZIO.mp3', 'APARTAMENTO VAZIO (1).mp3',
    'CIDADE PARTIDA.mp3', 'CIDADE PARTIDA (1).mp3',
    'DIPLOMA NA GAVETA.mp3', 'DIPLOMA NA GAVETA (1).mp3',
    'FUNK NÃO É CRIME.mp3', 'FUNK NÃO É CRIME (1).mp3',
    'O ALGORITMO.mp3', 'O ALGORITMO (1).mp3',
    'O FUTURO É DE QUEM_.mp3', 'O FUTURO É DE QUEM_ (1).mp3',
    'O PREÇO DO MERCADO.mp3', 'O PREÇO DO MERCADO (1).mp3',
    'QUEM MORA LONGE.mp3', 'QUEM MORA LONGE (1).mp3',
    'TRABALHA, TRABALHA.mp3', 'TRABALHA, TRABALHA (1).mp3'
  ];
  const radioStateKey = 'portal-radio-state';
  let savedState = {};
  try {
    savedState = JSON.parse(window.sessionStorage.getItem(radioStateKey) || '{}');
  } catch {
    // A rádio continua funcionando quando o armazenamento não está disponível.
  }
  let currentTrack = Number.isInteger(savedState.track) && savedState.track >= 0 && savedState.track < tracks.length
    ? savedState.track
    : Math.floor(Math.random() * tracks.length);
  const savedTime = Number.isFinite(savedState.time) ? savedState.time : 0;
  const shouldResume = savedState.playing === true;
  const audio = new Audio();
  const radio = document.createElement('div');
  radio.className = 'portal-radio';
  radio.setAttribute('aria-label', 'Rádio Sete Lagoas Política');
  radio.innerHTML = `
    <div class="portal-radio-info">
      <span>Rádio SLP</span>
      <strong class="portal-radio-title"></strong>
    </div>
    <div class="portal-radio-actions">
      <button type="button" class="portal-radio-play" aria-label="Tocar rádio">▶</button>
      <button type="button" class="portal-radio-next" aria-label="Trocar música">↻</button>
      <label class="portal-radio-volume">
        <span class="sr-only">Volume</span>
        <input type="range" min="0" max="100" value="70" aria-label="Volume da rádio">
      </label>
    </div>
  `;
  document.body.append(radio);

  const title = radio.querySelector('.portal-radio-title');
  const play = radio.querySelector('.portal-radio-play');
  const volume = radio.querySelector('input');

  function changeTrack(index, autoplay) {
    currentTrack = (index + tracks.length) % tracks.length;
    audio.src = `assets/musicas/${encodeURIComponent(tracks[currentTrack])}`;
    title.textContent = tracks[currentTrack].replace(/\.mp3$/, '').replace(/_/g, ' ');
    if (autoplay) audio.play().catch(() => {});
  }

  audio.addEventListener('loadedmetadata', () => {
    if (savedTime > 0) audio.currentTime = Math.min(savedTime, audio.duration || savedTime);
    if (shouldResume) audio.play().catch(() => {});
  }, { once: true });

  changeTrack(currentTrack, false);
  audio.volume = 0.7;

  window.addEventListener('pagehide', () => {
    try {
      window.sessionStorage.setItem(radioStateKey, JSON.stringify({
        track: currentTrack,
        time: audio.currentTime || 0,
        playing: !audio.paused
      }));
    } catch {
      // Sem armazenamento, a faixa continua normalmente nesta página.
    }
  });

  play.addEventListener('click', () => {
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  });
  radio.querySelector('.portal-radio-next').addEventListener('click', () => {
    changeTrack(currentTrack + 1, !audio.paused);
  });
  volume.addEventListener('input', () => { audio.volume = Number(volume.value) / 100; });
  audio.addEventListener('play', () => { play.textContent = '❚❚'; play.setAttribute('aria-label', 'Pausar rádio'); });
  audio.addEventListener('pause', () => { play.textContent = '▶'; play.setAttribute('aria-label', 'Tocar rádio'); });
  audio.addEventListener('ended', () => changeTrack(currentTrack + 1, true));
}

/* ============================================================
   9. CHAT DE DÚVIDAS FREQUENTES
   Respostas internas, pré-definidas e verificáveis no portal.
   ============================================================ */
function initFAQChat() {
  const faq = [
    ['O que é o Sete Lagoas Política?', 'É um portal editorial independente para o debate político, histórico e intelectual de Sete Lagoas e região.', 'sobre.html'],
    ['O portal representa algum partido?', 'Não. O portal não é canal oficial de partido nem representa instituições governamentais.', 'sobre.html'],
    ['O que encontro no site?', 'Há manifesto e programa, artigos, conteúdos de conhecimento, acervo de imagens, e-book e textos do colunista.', 'index.html'],
    ['Sobre o que é o manifesto?', 'O manifesto reúne uma síntese editorial baseada no Manifesto e Programa do PSB, com temas como desenvolvimento, políticas sociais, democracia, juventude e cultura.', 'manifesto.html'],
    ['Como usar o acervo?', 'O acervo reúne uma biblioteca de imagens e orientações de uso disponíveis na própria página do Acervo.', 'acervo.html'],
    ['O que é o e-book?', 'O e-book apresenta conteúdos sobre pensadores do socialismo, com sumário, informações e forma de aquisição na página dedicada.', 'ebook.html'],
    ['Como adquirir o e-book?', 'A página do e-book explica as opções de aquisição e responde às dúvidas frequentes sobre o material.', 'ebook.html'],
    ['Quem é o colunista?', 'A página do colunista apresenta quem está por trás do Sete Lagoas Política e sua atuação no projeto.', 'colunista.html'],
    ['Quais são os compromissos do portal?', 'O portal declara compromisso com verdade, verificação de fatos, pluralismo do debate e participação cidadã.', 'sobre.html']
  ];
  const chat = document.createElement('aside');
  chat.className = 'portal-chat';
  chat.innerHTML = `
    <button type="button" class="portal-chat-toggle" aria-expanded="false" aria-controls="portal-chat-panel">Dúvidas? Fale com o SLP</button>
    <section class="portal-chat-panel" id="portal-chat-panel" hidden aria-label="Dúvidas frequentes">
      <header><strong>Assistente SLP</strong><button type="button" class="portal-chat-close" aria-label="Fechar">×</button></header>
      <div class="portal-chat-messages" aria-live="polite"><p>Olá! Escolha uma dúvida para consultar informações do portal.</p></div>
      <div class="portal-chat-options"></div>
    </section>
  `;
  document.body.append(chat);

  const panel = chat.querySelector('.portal-chat-panel');
  const toggle = chat.querySelector('.portal-chat-toggle');
  const messages = chat.querySelector('.portal-chat-messages');
  const options = chat.querySelector('.portal-chat-options');

  faq.forEach(([question, answer, url]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = question;
    button.addEventListener('click', () => {
      const userMessage = document.createElement('p');
      userMessage.className = 'portal-chat-user';
      userMessage.textContent = question;
      const reply = document.createElement('p');
      reply.className = 'portal-chat-reply';
      reply.append(answer, ' ');
      const link = document.createElement('a');
      link.href = url;
      link.textContent = 'Saiba mais';
      reply.append(link);
      messages.append(userMessage, reply);
      messages.scrollTop = messages.scrollHeight;
    });
    options.append(button);
  });

  function closeChat() {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', () => {
    if (panel.hidden) {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    } else closeChat();
  });
  chat.querySelector('.portal-chat-close').addEventListener('click', closeChat);
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
  try { initRadio(); } catch (error) { console.error('Erro ao iniciar a rádio.', error); }
  try { initFAQChat(); } catch (error) { console.error('Erro ao iniciar o chat.', error); }
  // Gamificação controlada por gamification.js
});
