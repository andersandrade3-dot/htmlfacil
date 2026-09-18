/**
 * GLOSSARY.JS - Dicionário Visual "O que é isso?"
 * Apresenta explicações simples e didáticas sobre cada elemento do HTML.
 */

const GLOSSARY_DATA = [
  {
    tag: "<html>",
    name: "Elemento Raiz",
    description: "É a tag que abraça todo o documento HTML. Tudo o que existe no seu site mora dentro dela.",
    where: "Raiz do arquivo",
    example: "<html>\n  ...\n</html>"
  },
  {
    tag: "<head>",
    name: "Cabeça / Bastidores",
    description: "Guarda informações, configurações e metadados sobre a página que não aparecem diretamente na tela para o usuário (como título da aba e favicon).",
    where: "Dentro do <html>, antes do <body>",
    example: "<head>\n  <title>Nome</title>\n</head>"
  },
  {
    tag: "<body>",
    name: "Corpo da Página",
    description: "É o palco principal! Tudo o que você quer que o usuário veja (textos, imagens, links, botões) deve ser colocado aqui dentro.",
    where: "Dentro do <html>, logo após o </head>",
    example: "<body>\n  <h1>Olá Mundo</h1>\n</body>"
  },
  {
    tag: "<h1> a <h6>",
    name: "Títulos e Cabeçalhos",
    description: "Define títulos da página. O <h1> é o título mais importante (deve ter apenas um principal por página), indo até o <h6> para subtítulos menores.",
    where: "Dentro do <body>",
    example: "<h1>Título Principal</h1>\n<h2>Subtítulo</h2>"
  },
  {
    tag: "<p>",
    name: "Parágrafo",
    description: "Representa um bloco comum de texto. O navegador coloca automaticamente um espaço antes e depois dele.",
    where: "Dentro do <body>",
    example: "<p>Este é um parágrafo de texto.</p>"
  },
  {
    tag: "<strong>",
    name: "Importância / Negrito",
    description: "Indica que o texto tem grande importância ou urgência. Visualmente fica em negrito.",
    where: "Dentro de parágrafos ou títulos no <body>",
    example: "<p>Isto é <strong>muito importante</strong>!</p>"
  },
  {
    tag: "<em>",
    name: "Ênfase / Itálico",
    description: "Dá uma ênfase especial ao tom de voz de uma palavra. Visualmente fica em itálico.",
    where: "Dentro de textos no <body>",
    example: "<p>Eu <em>realmente</em> gostei disso.</p>"
  },
  {
    tag: "<mark>",
    name: "Marca-Texto",
    description: "Destaca o texto com um fundo amarelo chamativo, como uma caneta marca-texto.",
    where: "Dentro de textos no <body>",
    example: "<p>Termo <mark>em destaque</mark>.</p>"
  },
  {
    tag: "<img>",
    name: "Imagem",
    description: "Exibe uma imagem na tela. NÃO precisa de tag de fechamento (</img>). Usa o atributo 'src' para o caminho e 'alt' para descrição.",
    where: "Dentro do <body>",
    example: "<img src=\"foto.jpg\" alt=\"Descrição da foto\">"
  },
  {
    tag: "<a>",
    name: "Link / Âncora",
    description: "Cria um link que leva o usuário para outra página ou site ao ser clicado. O endereço fica no atributo 'href'.",
    where: "Dentro do <body>",
    example: "<a href=\"https://google.com\">Ir para o Google</a>"
  },
  {
    tag: "<title>",
    name: "Título da Aba",
    description: "Define o texto que aparece na aba do navegador e nos resultados de busca do Google.",
    where: "EXCLUSIVAMENTE dentro do <head>",
    example: "<title>Meu Site Pessoal</title>"
  },
  {
    tag: "<link rel='icon'>",
    name: "Favicon",
    description: "Define o pequeno ícone que aparece ao lado do nome da aba no navegador.",
    where: "EXCLUSIVAMENTE dentro do <head>",
    example: "<link rel=\"icon\" href=\"favicon.png\">"
  }
];

class GlossaryManager {
  static renderGlossary(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="tag-anatomy-card">
        <div class="anatomy-title">📐 ANATOMIA VISUAL DE UMA TAG HTML COM ATRIBUTOS:</div>
        <div class="anatomy-diagram">&lt;a href="https://site.com" target="_blank"&gt;Clique Aqui&lt;/a&gt;
│    │        │                               │           │
│    │        │                               │           └── Tag de Fechamento (&lt;/a&gt;)
│    │        │                               └── Texto Clicável (Conteúdo Visível)
│    │        └── Valor do Atributo ("https://...")
│    └── Nome do Atributo (href)
└── Tag de Abertura (&lt;a&gt;)</div>
      </div>

      <div class="glossary-grid">
        ${GLOSSARY_DATA.map(item => `
          <div class="glossary-card">
            <div class="glossary-tag">${escapeHtml(item.tag)}</div>
            <div style="font-size: 11px; font-weight: 700; color: #4ec9b0; margin-bottom: 4px;">${item.name}</div>
            <div class="glossary-desc">${item.description}</div>
            <div style="margin-top: 8px; font-size: 10px; color: #888;">
              <strong>Onde mora:</strong> ${item.where}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
