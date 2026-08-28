/**
 * GAMIFICATION SYSTEM — Sete Lagoas Política
 * Engine de XP, Níveis, Badges e Quiz.
 */

'use strict';

const GamiSystem = {
  storageKey: 'setelagoas-gamification',
  
  // Constantes de XP
  XP_CONCEITO: 15,
  XP_ARTIGO: 20,
  XP_QUIZ: 25,
  
  // Níveis (Limiares de XP)
  levels: [
    { name: 'Eleitor Iniciante', minXP: 0 },
    { name: 'Cidadão Curioso', minXP: 100 },
    { name: 'Debatedor Informado', minXP: 250 },
    { name: 'Arquiteto Político', minXP: 500 }
  ],
  
  // Badges (Conquistas)
  badges: [
    { id: 'first_blood', name: 'Primeiro Passo', icon: '🌱', desc: 'Leu o primeiro conceito.' },
    { id: 'quiz_master', name: 'Quiz Master', icon: '🧠', desc: 'Acertou a primeira pergunta.' },
    { id: 'scholar', name: 'Estudioso', icon: '📚', desc: 'Atingiu o nível Cidadão Curioso.' }
  ],

  // Banco do Quiz
  quizBank: [
    { id: 'q1', text: 'Qual poder cria leis e fiscaliza o Executivo?', options: ['Executivo', 'Legislativo', 'Judiciário'], correct: 1 },
    { id: 'q2', text: 'O que é inflação?', options: ['Queda geral dos preços', 'Aumento geral dos preços ao longo do tempo', 'Crescimento do PIB'], correct: 1 },
    { id: 'q3', text: 'Em uma democracia, o Estado pertence a:', options: ['Um partido vencedor', 'Um único líder', 'Toda a sociedade'], correct: 2 },
    { id: 'q4', text: 'O orçamento público permite acompanhar:', options: ['Pesquisas eleitorais', 'Prioridades e gastos do governo', 'Câmbio do dólar'], correct: 1 }
  ],

  state: {
    xp: 0,
    levelIdx: 0,
    conceitosLidos: [],
    artigosLidos: [],
    quizzesRespondidos: [],
    badgesUnlocked: []
  },

  init() {
    this.loadState();
    this.setupDOMHooks();
    this.renderWidget();
    this.renderDashboard();
    this.renderCardStates();
    this.setupQuizModal();
  },

  loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.storageKey));
      if (saved) {
        this.state = { ...this.state, ...saved };
      }
    } catch (e) {
      console.warn('Erro ao carregar gamificação', e);
    }
    this.recalculateLevel();
  },

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    this.recalculateLevel();
    this.renderWidget();
    this.renderDashboard();
    this.renderCardStates();
  },

  renderCardStates() {
    // Adiciona a classe .is-complete aos cards cujos conceitos já foram lidos
    document.querySelectorAll('[data-conceito]').forEach(card => {
      const id = card.getAttribute('data-conceito');
      if (this.state.conceitosLidos.includes(id)) {
        card.classList.add('is-complete');
      }
    });
  },

  recalculateLevel() {
    let newLvl = 0;
    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (this.state.xp >= this.levels[i].minXP) {
        newLvl = i;
        break;
      }
    }
    if (newLvl > this.state.levelIdx) {
      this.state.levelIdx = newLvl;
      this.showToast('Subiu de Nível!', `Você agora é: ${this.levels[newLvl].name}`, '⭐', true);
      this.checkBadges();
    }
  },

  checkBadges() {
    const unlock = (id) => {
      if (!this.state.badgesUnlocked.includes(id)) {
        this.state.badgesUnlocked.push(id);
        const badge = this.badges.find(b => b.id === id);
        this.showToast('Nova Conquista!', badge.name, badge.icon);
        this.saveState();
      }
    };

    if (this.state.conceitosLidos.length > 0) unlock('first_blood');
    if (this.state.quizzesRespondidos.length > 0) unlock('quiz_master');
    if (this.state.levelIdx >= 1) unlock('scholar');
  },

  addXP(amount, reason) {
    this.state.xp += amount;
    this.showToast('XP Ganho!', `+${amount} XP (${reason})`, '⚡');
    this.saveState();
    this.checkBadges();
  },

  trackConcept(id) {
    if (!this.state.conceitosLidos.includes(id)) {
      this.state.conceitosLidos.push(id);
      this.addXP(this.XP_CONCEITO, 'Leitura de Conceito');
    }
  },

  trackArticle(id) {
    if (!this.state.artigosLidos.includes(id)) {
      this.state.artigosLidos.push(id);
      this.addXP(this.XP_ARTIGO, 'Leitura de Artigo');
    }
  },

  // UI - Widget
  renderWidget() {
    let widget = document.getElementById('gami-header-widget');
    if (!widget) {
      const navContainer = document.querySelector('.header-inner');
      if (!navContainer) return;
      widget = document.createElement('a');
      widget.id = 'gami-header-widget';
      widget.className = 'gami-widget';
      widget.href = 'conhecimentos.html#dashboard'; // link para o painel
      
      // Inserir antes do botão toggle mobile ou no final
      const toggleBtn = document.getElementById('menu-toggle');
      if (toggleBtn) {
        navContainer.insertBefore(widget, toggleBtn);
      } else {
        navContainer.appendChild(widget);
      }
    }
    const currentLvl = this.levels[this.state.levelIdx];
    widget.innerHTML = `<span class="gami-level-badge">★</span> Lvl ${this.state.levelIdx + 1} (${this.state.xp} XP)`;
  },

  // UI - Dashboard (in conhecimentos.html)
  renderDashboard() {
    const dashContainer = document.getElementById('gami-dashboard-mount');
    if (!dashContainer) return;

    const currentLvl = this.levels[this.state.levelIdx];
    const nextLvl = this.levels[this.state.levelIdx + 1];
    
    let progressHtml = '';
    if (nextLvl) {
      const xpInCurrentLvl = this.state.xp - currentLvl.minXP;
      const xpNeeded = nextLvl.minXP - currentLvl.minXP;
      const pct = Math.min(100, Math.round((xpInCurrentLvl / xpNeeded) * 100));
      progressHtml = `
        <div class="gami-dash-xp">${this.state.xp} / ${nextLvl.minXP} XP para o próximo nível</div>
        <div class="gami-progress-wrapper">
          <div class="gami-progress-bar" style="width: ${pct}%"></div>
        </div>
      `;
    } else {
      progressHtml = `
        <div class="gami-dash-xp">${this.state.xp} XP — Nível Máximo Atingido!</div>
        <div class="gami-progress-wrapper">
          <div class="gami-progress-bar" style="width: 100%"></div>
        </div>
      `;
    }

    const badgesHtml = this.badges.map(b => {
      const unlocked = this.state.badgesUnlocked.includes(b.id);
      return `
        <div class="gami-badge ${unlocked ? 'is-unlocked' : ''}" title="${b.desc}">
          <div class="gami-badge-icon">${b.icon}</div>
          <div class="gami-badge-name">${b.name}</div>
        </div>
      `;
    }).join('');

    const quizDesbloqueado = this.state.conceitosLidos.length >= 6;
    const btnQuizHtml = quizDesbloqueado
      ? `<button id="btn-open-quiz" class="btn btn-vermelho">Fazer a Prova</button>`
      : `<button id="btn-open-quiz" class="btn btn-outline-azul" style="opacity:0.7;">🔒 Prova Bloqueada (${this.state.conceitosLidos.length}/6)</button>
         <p style="font-size:0.75rem; color:var(--texto-suave); margin-top:0.5rem;">Leia os 6 conhecimentos para desbloquear.</p>`;

    dashContainer.innerHTML = `
      <div class="gami-dashboard" id="dashboard">
        <div class="gami-dash-info">
          <div class="gami-dash-header">
            <div class="section-eyebrow">Seu Progresso</div>
            <h2 class="gami-dash-level-title">${currentLvl.name}</h2>
            <div>Nível ${this.state.levelIdx + 1}</div>
          </div>
          ${progressHtml}
          <div style="margin-top: 1.5rem;">
            ${btnQuizHtml}
          </div>
        </div>
        <div class="gami-dash-badges">
          <div class="section-eyebrow">Conquistas</div>
          <div class="gami-badges-grid">
            ${badgesHtml}
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-open-quiz')?.addEventListener('click', () => {
      if (quizDesbloqueado) {
        this.openQuiz();
      } else {
        this.showToast('Prova Bloqueada', 'Leia os 6 conhecimentos para desbloquear a prova.', '🔒');
      }
    });
  },

  // UI - Toast
  showToast(title, msg, icon = '🔔', isLevelUp = false) {
    let container = document.getElementById('gami-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'gami-toast-container';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `gami-toast ${isLevelUp ? 'is-level-up' : ''}`;
    toast.innerHTML = `
      <div class="gami-toast-icon">${icon}</div>
      <div class="gami-toast-content">
        <strong>${title}</strong>
        <span>${msg}</span>
      </div>
    `;
    
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // Hooks do DOM
  setupDOMHooks() {
    // Escuta cliques em links de conceitos
    document.querySelectorAll('a[href^="conhecimento.html?tema="]').forEach(link => {
      link.addEventListener('click', (e) => {
        const urlParams = new URLSearchParams(link.href.split('?')[1]);
        const tema = urlParams.get('tema');
        if (tema) this.trackConcept(tema);
      });
    });

    // Escuta cliques em artigos (PDFs)
    document.querySelectorAll('a[href^="artigos/artigo-"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const docId = link.getAttribute('href');
        this.trackArticle(docId);
      });
    });
  },

  // Modal Quiz Logic
  setupQuizModal() {
    const modalHtml = `
      <div id="gami-quiz-overlay" class="gami-modal-overlay">
        <div class="gami-modal">
          <div class="gami-modal-header">
            <h3>Desafio Rápido</h3>
            <button class="gami-modal-close" id="gami-quiz-close">&times;</button>
          </div>
          <div class="gami-modal-body">
            <div id="gami-quiz-content"></div>
          </div>
          <div class="gami-modal-footer">
            <button class="btn btn-ghost" id="gami-quiz-next" style="display:none;">Próxima Pergunta &rarr;</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('gami-quiz-close').addEventListener('click', () => this.closeQuiz());
    document.getElementById('gami-quiz-next').addEventListener('click', () => this.renderQuizQuestion());
  },

  openQuiz() {
    document.getElementById('gami-quiz-overlay').classList.add('is-open');
    this.renderQuizQuestion();
  },

  closeQuiz() {
    document.getElementById('gami-quiz-overlay').classList.remove('is-open');
  },

  renderQuizQuestion() {
    const content = document.getElementById('gami-quiz-content');
    const nextBtn = document.getElementById('gami-quiz-next');
    nextBtn.style.display = 'none';

    // Achar perguntas não respondidas
    const pending = this.quizBank.filter(q => !this.state.quizzesRespondidos.includes(q.id));
    
    if (pending.length === 0) {
      content.innerHTML = `
        <div style="text-align:center;">
          <h4 style="margin-bottom:1rem; font-size:1.5rem;">🎉 Parabéns!</h4>
          <p style="color:var(--texto-suave);">Você já respondeu corretamente todas as perguntas disponíveis no momento.</p>
        </div>
      `;
      return;
    }

    const q = pending[Math.floor(Math.random() * pending.length)];
    
    let optionsHtml = q.options.map((opt, i) => `
      <button class="gami-quiz-btn" data-idx="${i}">${opt}</button>
    `).join('');

    content.innerHTML = `
      <div class="gami-quiz-question">${q.text}</div>
      <div class="gami-quiz-options">${optionsHtml}</div>
      <div id="gami-quiz-feedback" class="gami-quiz-feedback"></div>
    `;

    content.querySelectorAll('.gami-quiz-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Desabilitar todas
        content.querySelectorAll('.gami-quiz-btn').forEach(b => b.disabled = true);
        
        const idx = parseInt(btn.getAttribute('data-idx'));
        const feedback = document.getElementById('gami-quiz-feedback');
        
        if (idx === q.correct) {
          btn.classList.add('is-correct');
          feedback.textContent = '✅ Resposta Exata!';
          feedback.className = 'gami-quiz-feedback success';
          
          if (!this.state.quizzesRespondidos.includes(q.id)) {
            this.state.quizzesRespondidos.push(q.id);
            this.addXP(this.XP_QUIZ, 'Quiz Correto');
          }
          nextBtn.style.display = 'inline-block';
        } else {
          btn.classList.add('is-wrong');
          // highlight correct
          content.querySelector(`.gami-quiz-btn[data-idx="${q.correct}"]`).classList.add('is-correct');
          feedback.textContent = '❌ Ops, não foi dessa vez.';
          feedback.className = 'gami-quiz-feedback error';
          
          nextBtn.style.display = 'inline-block';
          nextBtn.textContent = 'Tentar outra &rarr;';
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  GamiSystem.init();
});
