# Portfólio — Fernando Felippe

Portfólio de Fernando Felippe com uma nova identidade. A página apresenta atuação full stack, projetos em desenvolvimento, competências, processo de trabalho e canais de contato em uma experiência responsiva e acessível.

## Stack

O projeto não possui dependências de produção nem etapa de build. A interface usa:

- HTML5 semântico;
- CSS modular e responsivo;
- JavaScript com ES modules;
- Canvas 2D para o plano de fundo técnico;
- SVG para a marca;
- `node:test` para a verificação automatizada.

## Estrutura

```text
.
├── index.html                  # Conteúdo e estrutura da página
├── css/                        # Tokens, componentes, seções e responsividade
├── js/                         # Navegação, reveals e Canvas técnico
├── images/                     # Foto e monograma SVG
├── scripts/check-local-links.mjs # Validador de arquivos e âncoras locais
├── tests/portfolio.test.mjs     # Contrato automatizado do portfólio
└── package.json                # Comandos de teste e validação
```

## Executar localmente

Na raiz do projeto, inicie um servidor HTTP:

```bash
python -m http.server 8000
```

Depois, abra [http://localhost:8000](http://localhost:8000) no navegador. Para encerrar o servidor, use `Ctrl+C` no terminal.

## Validar

Com Node.js instalado, execute:

```bash
npm run validate
```

O comando roda os testes automatizados e verifica se os arquivos e as âncoras locais referenciados por `index.html` existem.

## Publicação

O site é estático e compatível com GitHub Pages. A publicação é feita automaticamente pelo GitHub Pages conforme a configuração do repositório, sem build ou deploy manual.
