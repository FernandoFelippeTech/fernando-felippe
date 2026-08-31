# Portfólio — Fernando Felippe

Portfólio estático de Fernando Felippe, desenvolvedor de software com foco em Engenharia de Inteligência Artificial. A página apresenta seu posicionamento como AI Engineer, áreas de estudo, competências técnicas e canais de contato em uma experiência responsiva e acessível.

## Stack

O projeto não possui dependências de produção nem etapa de build:

- HTML5 semântico;
- CSS modular e responsivo;
- JavaScript com ES modules;
- Canvas 2D para o plano de fundo técnico;
- SVG para a marca;
- `node:test` para verificações automatizadas.

## Estrutura

```text
.
├── index.html                    # Conteúdo e estrutura da página
├── css/                          # Base, componentes, seções, movimento e responsividade
├── js/                           # Navegação, reveals e Canvas técnico
├── images/                       # Foto e monograma SVG
├── docs/                         # Decisões de design e futuro currículo
├── scripts/check-local-links.mjs # Validador de arquivos e âncoras locais
├── tests/portfolio.test.mjs      # Contrato automatizado do portfólio
└── package.json                  # Comandos de teste e validação
```

## Executar localmente

Na raiz do projeto:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`. Um servidor HTTP é recomendado porque o JavaScript usa ES modules.

## Validar

```bash
npm test
npm run validate
```

No Windows com política restritiva do PowerShell, use `npm.cmd test` e `npm.cmd run validate`.

## Currículo

O botão “Baixar CV” está preparado para `docs/Fernando-Felippe-CV.pdf`. Esse arquivo ainda precisa ser adicionado; o projeto não inclui ou gera um currículo fictício.

## Publicação

O site é publicado como conteúdo estático pelo GitHub Pages a partir de `main` / raiz. Não existe build ou workflow de deploy no repositório. Todos os caminhos locais são relativos e compatíveis com GitHub Project Pages.
