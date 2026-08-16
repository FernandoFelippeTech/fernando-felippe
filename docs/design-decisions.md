# Decisões de Design — Portfólio

**Data:** 2026-08-11
**Status:** Aprovada

## Contexto

A versão anterior do portfólio usava fundo escuro, gradiente ciano/roxo/rosa, partículas de código e um monograma com dois "F" espelhados. Comunicava tecnologia, mas se aproximava de templates genéricos e não diferenciava o autor o suficiente.

Direção aprovada: **"Engenharia Criativa"** — precisão técnica combinada com experimentação visual, mantendo desempenho, clareza e manutenção simples no GitHub Pages. Público-alvo: clientes em potencial e recrutadores, em equilíbrio.

## Identidade visual

**Paleta:** grafite quase preto (fundo), branco quente (texto), âmbar elétrico (ação/sinalização), cinza metálico e transparências sutis. Gradiente ciano/roxo/rosa removido.

**Tipografia:** sans-serif forte para títulos/conteúdo; monoespaçada só em etiquetas, índices, status e detalhes técnicos.

**Marca:** monograma "FF" com geometria autoral (não espelhamento simples nem gradiente genérico), com variantes para preloader, header e rodapé.

**Linguagem gráfica:** grid técnico discreto, linhas de construção, formas geométricas 3D com aparência de metal/vidro, iluminação âmbar controlada.

## Estrutura de conteúdo

- **Hero:** conceitual, sem foto. Nome, cargo, resumo curto, dois CTAs ("Explorar projetos" / "Entrar em contato").
- **Sobre:** única seção com foto.
- **Projetos:** Lexora e Talentos Barbearia, mesmo layout de card, selo "Em desenvolvimento" visível em ambos. Sem links quebrados, métricas inventadas ou aparência de produto concluído.
- **Competências:** agrupadas por responsabilidade (interfaces, aplicações, dados, qualidade), não lista decorativa.
- **Processo:** fluxo curto do problema à validação.
- **Contato:** e-mail, LinkedIn, GitHub — sem botão de currículo nesta versão.

## Restrições técnicas

- Sem React, Three.js, bundler ou dependência de runtime.
- Stack: HTML5 semântico, CSS moderno, SVG, JavaScript ES modules, Canvas 2D, `node:test`, GitHub Pages.
- **Aprimoramento progressivo:** conteúdo e navegação principais funcionam sem JavaScript; JS só cuida de preloader, menu, navegação ativa e efeitos visuais.
- Todo movimento respeita `prefers-reduced-motion`; Canvas pausa com `visibilitychange` e limita densidade por tamanho de tela/`devicePixelRatio`.
- Efeitos decorativos nunca bloqueiam links, leitura ou rolagem.

## Não-objetivos

- Framework front-end ou biblioteca 3D.
- Back-end ou painel administrativo.
- Publicar Lexora/Talentos Barbearia como produtos concluídos.
- Métricas, clientes, resultados ou links de demonstração inventados.
- Download de currículo (nesta versão).

## Acessibilidade e SEO

- Estrutura semântica, hierarquia correta de títulos, skip-link, foco visível, navegação por teclado, `aria-expanded` no menu, contraste adequado, texto alternativo na foto.
- Metadados Open Graph/Twitter Card, dados estruturados de pessoa/profissional, conteúdo indexável sem depender de JavaScript.
