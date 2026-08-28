# Sete Lagoas Política — MVP

> **Diário político, histórico e intelectual de Sete Lagoas.**

Portal editorial independente sobre política municipal, democracia, história e debate público.

---

## Como Abrir

```
1. Entre na pasta: sete-lagoas-politica/
2. Clique duas vezes em: index.html
3. O navegador abrirá automaticamente.
```

Funciona em qualquer navegador moderno sem necessidade de servidor.

---

## Estrutura

```
sete-lagoas-politica/
│
├── index.html           ← Homepage
├── conhecimentos.html   ← Conceitos básicos de política e economia
├── conhecimento.html    ← Leitura individual de cada conceito
├── artigos.html         ← Panorama semanal com artigos autorais
├── manifesto.html       ← Síntese editorial do Manifesto PSB
├── sobre.html           ← Sobre o projeto
│
├── assets/
│   ├── css/
│   │   └── style.css    ← Design system completo
│   ├── js/
│   │   └── app.js       ← JavaScript vanilla (menu, filtros, animações)
│   └── img/             ← Imagens (para uso futuro)
│
├── artigos/
│   └──                  ← PDFs dos artigos autorais
│
├── documentos/
│   └── Manifesto_e_Programa_do_PSB.pdf
│
└── README.md
```

---

## Funcionalidades

- [x] Homepage com Hero, Destaques, Bloco Manifesto e Princípios
- [x] Página de Conhecimentos com fundamentos de política e economia
- [x] Página de Artigos com panorama semanal e PDFs autorais
- [x] Página do Manifesto com síntese editorial e navegação interna
- [x] Página Sobre com missão e eixo editorial
- [x] Header responsivo com logo + menu desktop
- [x] Menu hamburger funcional (mobile)
- [x] Barra de progresso de leitura
- [x] Animações de entrada com IntersectionObserver
- [x] Smooth scroll para âncoras internas
- [x] Highlight automático do item de menu ativo
- [x] Link para download do PDF do Manifesto PSB
- [x] Layout responsivo: 1920px / 1440px / 1024px / 768px / 480px / 390px
- [x] SEO: title, meta description, meta viewport em todas as páginas
- [x] HTML semântico: header, nav, main, section, article, footer
- [x] Acessibilidade: aria-labels, aria-current, aria-expanded, foco visível

---

## Tecnologias

| Tecnologia | Versão |
|-----------|--------|
| HTML5     | —      |
| CSS3      | —      |
| JavaScript | ES6+ Vanilla |
| Google Fonts | Inter + Barlow Condensed |

Nenhum framework, biblioteca externa ou backend.

---

## Paleta de Cores

| Token         | Hex       |
|---------------|-----------|
| Azul Principal | `#0876B9` |
| Azul Escuro    | `#07517F` |
| Vermelho       | `#E5232B` |
| Branco         | `#FFFFFF` |
| Fundo          | `#F2F6F8` |
| Texto          | `#12212B` |

---

## Nota Editorial

Este portal **não é** o site oficial do PSB nem de qualquer partido ou candidato.
É um projeto editorial independente que pode utilizar documentos públicos como
referência, sempre identificando claramente a fonte.

---

## Roadmap Futuro (não implementado no MVP)

```
Firebase
├── Banco de notícias (Firestore)
├── Painel administrativo
├── Posts com autores e categorias
└── Autenticação

Integrações
├── YouTube (canal de vídeos)
├── Podcast
├── Newsletter
└── Comentários
```

---

© 2026 Sete Lagoas Política — MVP  
Projeto editorial independente · Sete Lagoas/MG
# monocast7
