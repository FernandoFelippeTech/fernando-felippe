# Portfólio Engenharia Criativa — Especificação de Design

**Data:** 2026-08-11  
**Status:** Aprovada  
**Repositório:** `FernandoFelippeTech/fernando-felippe`

## Contexto

O portfólio atual é uma página estática em HTML, CSS e JavaScript puro. Ele utiliza fundo escuro,
gradiente ciano/roxo/rosa, partículas de código, monograma com dois “F” espelhados e três projetos
genéricos. Essa identidade comunica tecnologia, mas se aproxima de muitos templates de portfólio e
não diferencia Fernando Felippe de forma suficiente.

A reformulação deve atender clientes e recrutadores em equilíbrio. A nova direção aprovada é
“Engenharia Criativa”: precisão técnica combinada com experimentação visual, mantendo desempenho,
clareza e manutenção simples no GitHub Pages.

## Objetivos

- Criar uma identidade visual autoral e menos genérica.
- Demonstrar competência técnica sem perder impacto visual.
- Apresentar Lexora e Talentos Barbearia com transparência como projetos em desenvolvimento.
- Preservar boa experiência em desktop e celular.
- Manter a aplicação estática, leve e fácil de publicar no GitHub Pages.
- Atender requisitos essenciais de acessibilidade, SEO e movimento reduzido.

## Não objetivos

- Adicionar framework front-end ou biblioteca 3D.
- Criar back-end ou painel administrativo para o portfólio.
- Publicar Lexora ou Talentos Barbearia como produtos concluídos.
- Inventar métricas, clientes, resultados ou links de demonstração.
- Adicionar download de currículo nesta versão.

## Público e posicionamento

O portfólio deve funcionar para dois públicos:

1. clientes e empresas interessados em contratar serviços de desenvolvimento;
2. recrutadores avaliando habilidades, processo e qualidade técnica.

O tom será confiante, direto e profissional. A página deve demonstrar criatividade sem parecer um
experimento artístico desconectado de entregas reais.

## Identidade visual

### Paleta

- grafite quase preto como fundo principal;
- superfícies em variações discretas de cinza profundo;
- branco quente para textos principais;
- âmbar elétrico como cor de ação e sinalização;
- cinza metálico e transparências sutis em elementos técnicos.

O gradiente ciano/roxo/rosa atual será removido.

### Tipografia

- tipografia sans-serif forte e contemporânea para títulos e conteúdo;
- tipografia monoespaçada apenas em etiquetas, índices, status e detalhes técnicos;
- hierarquia expressiva, mas legível em telas pequenas.

### Marca

O monograma “FF” será redesenhado com geometria mais autoral. A marca deve comunicar construção,
estrutura e precisão, evitando apenas espelhar duas letras ou depender de um gradiente genérico.
Serão produzidas variantes coerentes para preloader, header e rodapé.

### Linguagem gráfica

- grid técnico discreto;
- linhas de construção e marcações de projeto;
- formas geométricas tridimensionais com aparência de metal e vidro;
- iluminação âmbar controlada;
- profundidade e textura sem comprometer contraste.

## Estrutura de conteúdo

### 1. Hero

Hero conceitual, sem foto. Deve conter:

- nome “Fernando Felippe”;
- cargo “Desenvolvedor Full Stack”;
- resumo curto orientado a produtos digitais e impacto;
- CTA principal “Explorar projetos”;
- CTA secundário “Entrar em contato”;
- composição geométrica tridimensional responsiva.

### 2. Sobre

A foto existente permanece nesta seção com tratamento integrado à identidade. O conteúdo deve
explicar a combinação entre criatividade e engenharia, sem alegações não verificadas.

### 3. Projetos

A seção continua se chamando “Projetos”. Lexora e Talentos Barbearia utilizam exatamente o mesmo
layout de card e recebem selo visível “Em desenvolvimento”. Cada card contém:

- nome;
- status;
- problema que o projeto pretende resolver;
- principais funcionalidades;
- tecnologias utilizadas;
- estágio atual.

Lexora será descrito como plataforma de aprendizagem de idiomas. Talentos Barbearia será descrito
como plataforma de apresentação e agendamento com foco mobile. Não haverá links quebrados,
métricas inventadas ou aparência de produto concluído. O grid ficará preparado para projetos
concluídos no futuro.

### 4. Competências

As competências serão agrupadas por responsabilidade — por exemplo, interfaces, aplicações,
back-end/dados e qualidade — em vez de uma lista decorativa de tecnologias.

### 5. Processo

Uma seção curta apresentará o fluxo de trabalho, da compreensão do problema à validação da
entrega. Ela deve reforçar organização e pensamento de produto.

### 6. Contato

Manter e destacar e-mail, LinkedIn e GitHub. Não haverá botão de currículo nesta versão.

### 7. Rodapé

Assinatura profissional concisa, nova variante do monograma e links essenciais.

## Movimento e interação

- preloader curto com o novo monograma, sem espera artificial longa;
- entrada progressiva do hero;
- parallax leve nas formas geométricas;
- linhas técnicas com reação sutil ao cursor em dispositivos compatíveis;
- revelação progressiva durante rolagem;
- cards com profundidade e iluminação no hover;
- indicação da seção atual na navegação;
- menu mobile acessível;
- efeitos decorativos nunca bloqueiam links, leitura ou rolagem.

Todo movimento respeitará `prefers-reduced-motion`. No celular, efeitos serão simplificados e não
dependerão de hover. Animações contínuas devem usar `requestAnimationFrame`, ser pausadas quando a
aba estiver oculta e evitar trabalho desnecessário fora da viewport.

## Arquitetura técnica

### Plataforma

- HTML semântico;
- CSS responsivo organizado por componentes;
- JavaScript puro organizado por responsabilidades;
- SVG para marca, ícones e elementos gráficos;
- Canvas apenas para o fundo técnico interativo leve;
- publicação compatível com GitHub Pages.

Não serão adicionados Three.js, React, bundler ou dependências de runtime.

### Aprimoramento progressivo

O conteúdo, navegação, projetos e contato continuarão disponíveis sem JavaScript. JavaScript será
responsável apenas por preloader, menu, navegação ativa e aprimoramentos visuais.

### Responsividade

- composição completa em desktop;
- geometrias simplificadas e fluxo vertical no celular;
- CTAs tocáveis e navegação sem overflow;
- tipografia fluida com limites seguros;
- imagem da seção Sobre redimensionada sem distorção.

## Acessibilidade

- estrutura semântica e hierarquia correta de títulos;
- link de salto para o conteúdo;
- estados de foco visíveis;
- navegação e menu operáveis por teclado;
- `aria-expanded` e rótulos apropriados no menu;
- contraste adequado;
- texto alternativo útil para a foto;
- elementos decorativos ignorados por tecnologias assistivas;
- suporte integral a movimento reduzido.

## SEO e compartilhamento

- título e descrição coerentes com o posicionamento;
- metadados Open Graph e Twitter Card;
- URL canônica quando o endereço final estiver disponível;
- dados estruturados simples de pessoa/profissional, sem informações inventadas;
- conteúdo indexável sem depender de JavaScript.

## Desempenho

- nenhuma biblioteca 3D;
- SVG e CSS preferidos para elementos geométricos;
- Canvas com densidade limitada por tamanho da tela e `devicePixelRatio` controlado;
- foto otimizada e dimensões declaradas;
- fontes limitadas aos pesos utilizados;
- efeitos pausados com `visibilitychange`;
- experiência funcional quando animações forem desativadas.

## Validação

- validar a estrutura HTML;
- verificar links internos e externos;
- testar navegação por teclado e menu mobile;
- testar `prefers-reduced-motion`;
- conferir desktop e larguras móveis representativas;
- verificar ausência de overflow horizontal;
- executar auditoria básica de acessibilidade e desempenho;
- confirmar que Lexora e Talentos Barbearia aparecem como “Em desenvolvimento”;
- confirmar que não existem placeholders genéricos ou alegações inventadas.

## Estratégia de entrega

O trabalho será realizado em branch separada, com commits pequenos e verificáveis. Após testes e
revisão, a branch será enviada ao GitHub e um Pull Request será aberto contra `main`. A integração
final dependerá de aprovação.

## Critérios de aceitação

- identidade “Engenharia Criativa” reconhecível e consistente;
- paleta genérica atual substituída por grafite, branco quente e âmbar;
- hero conceitual com dois CTAs e sem foto;
- foto presente apenas na seção Sobre;
- Lexora e Talentos Barbearia no mesmo layout, ambos claramente em desenvolvimento;
- competências, processo e contato completos;
- navegação funcional em desktop e mobile;
- conteúdo principal utilizável sem JavaScript;
- movimento reduzido respeitado;
- build estático compatível com GitHub Pages;
- ausência de frameworks e bibliotecas 3D;
- documentação e validações concluídas antes do Pull Request.
