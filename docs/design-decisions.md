# Decisões de Design — Portfólio AI Engineer

**Data:** 2026-08-30
**Status:** Implementada na branch `redesign-ai-engineer`

## Direção

O portfólio posiciona Fernando Felippe como desenvolvedor de software construindo especialização em Engenharia de Inteligência Artificial. A comunicação combina IA, engenharia de software, dados e construção de produtos reais, sem alegar experiência profissional não comprovada.

## Identidade visual

- Fundo grafite, texto branco quente e âmbar como sinal funcional.
- Azul acinzentado aparece somente em detalhes de dados e conexões.
- Space Grotesk para conteúdo e IBM Plex Mono para estados técnicos.
- Grid, linhas, nós, órbitas e estruturas procedurais sugerem sistemas sendo construídos.
- Sem neon excessivo, cyberpunk, robôs, cérebros 3D ou imagens genéricas de IA.

## Estrutura

- **Header:** marca, cinco âncoras e acesso ao CV local.
- **Hero:** nome, AI Engineer, stack de foco, mensagem e diagrama procedural.
- **Sobre:** foto original, posicionamento profissional preciso e três pilares.
- **Competências:** quatro grupos sem níveis ou percentuais.
- **Projetos:** estado honesto de novos projetos em construção.
- **Contato:** e-mail, LinkedIn, GitHub e WhatsApp existentes.
- **Footer:** identidade, navegação essencial e redes profissionais.

Lexora, Talentos Barbearia e a seção Processo foram removidos porque não representam o estado atual do portfólio.

## Movimento e performance

O Canvas mantém limites de densidade para desktop/mobile, DPR máximo de 1,5, pausa por visibilidade e interação somente com ponteiros finos. Reveals, cursores e construções procedurais respeitam `prefers-reduced-motion`.

O preloader é aprimoramento progressivo: encerra no evento `load`, imediatamente quando o documento já está completo, e possui fallback de 900 ms. Ele não impõe espera artificial longa.

## Acessibilidade e publicação

O documento mantém skip-link, foco visível, landmarks, um único H1, texto alternativo da foto, menu com `aria-expanded`, navegação por teclado e conteúdo legível sem JavaScript. Elementos procedurais são decorativos e ocultos de leitores de tela.

A arquitetura permanece HTML, CSS modular e JavaScript ES modules, sem dependências ou build. Caminhos locais são relativos para publicação na raiz de `main` pelo GitHub Pages.

## Metadados

O documento inclui title e description voltados a AI Engineering, além de Open Graph e Twitter Card básicos sem domínio próprio ou imagem social inventados.
