/**
 * EXERCISES.JS - Banco completo de exercícios do HTML Fácil
 * Organizados em 7 Fases com progressão pedagógica cuidadosa.
 */

const EXERCISES = [
  // ==========================================
  // FASE 1: CONHECENDO A ESTRUTURA
  // ==========================================
  {
    id: 1,
    phase: 1,
    levelName: "Fase 1 — Estrutura Fundamental",
    title: "1. A Raiz de Tudo: <html>",
    task: "Toda página web precisa de uma tag que envolva todo o documento. Crie a tag <code>&lt;html&gt;</code> e feche-a com <code>&lt;/html&gt;</code>.",
    whereDiagram: "← A tag <html> deve começar aqui\n\n\n← E a tag </html> deve fechar no final",
    starterCode: "<!-- Escreva abaixo a tag de abertura e fechamento de html -->\n",
    targetFile: "index.html",
    hints: [
      "HTML é uma linguagem de marcação que usa tags com sinais de menor < e maior >.",
      "A tag que inicia qualquer documento HTML se chama <html>.",
      "Para abrir usamos <html> e para fechar usamos </html> com uma barra invertida antes do nome.",
      "Exemplo de resposta:\n<html>\n</html>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const clean = code.toLowerCase();
      return clean.includes("<html>") && clean.includes("</html>");
    },
    successMessage: "Excelente! Você criou a raiz da sua primeira página web!"
  },
  {
    id: 2,
    phase: 1,
    levelName: "Fase 1 — Estrutura Fundamental",
    title: "2. Os Bastidores: <head>",
    task: "Dentro do <code>&lt;html&gt;</code>, crie a área de informações da página usando a tag <code>&lt;head&gt;</code> e feche com <code>&lt;/head&gt;</code>.",
    whereDiagram: "<html>\n   ← COLOQUE O <head> E </head> AQUI DENTRO\n</html>",
    starterCode: "<html>\n  \n</html>",
    targetFile: "index.html",
    hints: [
      "O <head> (cabeça) guarda informações sobre a página que o usuário não vê diretamente no corpo do site.",
      "O <head> deve ficar dentro da tag <html>.",
      "Abra com <head> e lembre-se de fechar com </head>.",
      "Exemplo:\n<html>\n  <head>\n  </head>\n</html>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const clean = code.toLowerCase();
      return clean.includes("<head>") && clean.includes("</head>");
    },
    successMessage: "Muito bem! O <head> é onde configuramos o título, ícone e metadados da página."
  },
  {
    id: 3,
    phase: 1,
    levelName: "Fase 1 — Estrutura Fundamental",
    title: "3. O Palco Visível: <body>",
    task: "Logo após o fechamento do <code>&lt;/head&gt;</code>, crie a área visível do site usando a tag <code>&lt;body&gt;</code> e feche com <code>&lt;/body&gt;</code>.",
    whereDiagram: "<html>\n  <head>\n  </head>\n  ← COLOQUE O <body> E </body> AQUI\n</html>",
    starterCode: "<html>\n  <head>\n  </head>\n\n</html>",
    targetFile: "index.html",
    hints: [
      "O <body> (corpo) é onde colocamos tudo o que o usuário realmente vê no navegador: textos, imagens, links e botões.",
      "O <body> fica logo abaixo do </head>, mas ainda dentro do <html>.",
      "Abra com <body> e feche com </body>.",
      "Exemplo:\n<html>\n  <head>\n  </head>\n  <body>\n  </body>\n</html>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const clean = code.toLowerCase();
      return clean.includes("<body>") && clean.includes("</body>");
    },
    successMessage: "Perfeito! Agora sua página possui as duas partes fundamentais: HEAD e BODY."
  },
  {
    id: 4,
    phase: 1,
    levelName: "Fase 1 — Estrutura Fundamental",
    title: "4. O DOCTYPE e a Estrutura Completa",
    task: "No topo absoluto de qualquer arquivo HTML moderno, informamos o tipo de documento. Adicione <code>&lt;!DOCTYPE html&gt;</code> na linha 1.",
    whereDiagram: "← COLOQUE <!DOCTYPE html> AQUI NA PRIMEIRA LINHA\n<html>\n  <head></head>\n  <body></body>\n</html>",
    starterCode: "<html>\n  <head>\n  </head>\n  <body>\n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "O DOCTYPE avisa ao navegador que estamos utilizando a versão mais moderna do HTML (HTML5).",
      "Ele não precisa de tag de fechamento (não existe </!DOCTYPE>).",
      "Escreva exatamente <!DOCTYPE html> na primeira linha.",
      "Exemplo:\n<!DOCTYPE html>\n<html>\n  <head></head>\n  <body></body>\n</html>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      return /<!doctype\s+html>/i.test(code);
    },
    successMessage: "Sensacional! Esta é a estrutura base oficial de qualquer página da internet."
  },

  // ==========================================
  // FASE 2: TEXTOS E TÍTULOS
  // ==========================================
  {
    id: 5,
    phase: 2,
    levelName: "Fase 2 — Títulos e Textos",
    title: "5. Meu Primeiro Título: <h1>",
    task: "Crie um título principal para a sua página dentro do <code>&lt;body&gt;</code> usando a tag <code>&lt;h1&gt;</code> com o texto <strong>Meu Primeiro Site</strong>.",
    whereDiagram: "<head>\n   Aqui ficam informações sobre a página.\n</head>\n<body>\n   ← COLOQUE O <h1> AQUI DENTRO\n</body>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    \n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "O título principal é colocado dentro do <body>, pois é um elemento visível.",
      "Para criar um título principal, usamos a tag <h1>.",
      "A estrutura começa com <h1>, depois o texto, e termina com </h1>.",
      "Exemplo:\n<h1>Meu Primeiro Site</h1>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const h1 = dom.querySelector("body h1");
      return !!h1 && h1.textContent.trim().length > 0;
    },
    successMessage: "Parabéns! Veja no simulador à direita como o título apareceu em destaque."
  },
  {
    id: 6,
    phase: 2,
    levelName: "Fase 2 — Títulos e Textos",
    title: "6. Subtítulo com <h2>",
    task: "Logo abaixo do <code>&lt;h1&gt;</code>, adicione um subtítulo usando a tag <code>&lt;h2&gt;</code> escrito <strong>Aprendendo Programação Web</strong>.",
    whereDiagram: "<body>\n  <h1>Meu Primeiro Site</h1>\n  ← COLOQUE O <h2> AQUI LOGO ABAIXO DO H1\n</body>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <h1>Meu Primeiro Site</h1>\n    \n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "A tag <h2> representa um título de segundo nível (subtítulo).",
      "Assim como o <h1>, ele fica dentro do <body>.",
      "Abra com <h2>, escreva o texto e feche com </h2>.",
      "Exemplo:\n<h2>Aprendendo Programação Web</h2>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const h2 = dom.querySelector("body h2");
      return !!h2 && h2.textContent.trim().length > 0;
    },
    successMessage: "Muito bem! O navegador organiza títulos do <h1> (maior) até o <h6> (menor)."
  },
  {
    id: 7,
    phase: 2,
    levelName: "Fase 2 — Títulos e Textos",
    title: "7. Escrevendo Parágrafos: <p>",
    task: "Adicione um parágrafo no <code>&lt;body&gt;</code> usando a tag <code>&lt;p&gt;</code> com uma frase contando o que você achou de criar sua primeira página.",
    whereDiagram: "<body>\n  <h1>Meu Primeiro Site</h1>\n  <h2>Aprendendo Programação Web</h2>\n  ← COLOQUE O <p> AQUI\n</body>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <h1>Meu Primeiro Site</h1>\n    <h2>Aprendendo Programação Web</h2>\n    \n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "A tag <p> vem de 'Paragraph' (parágrafo em inglês).",
      "Ela é usada para blocos comuns de texto e adiciona automaticamente um espaçamento antes e depois.",
      "Lembre-se da estrutura: <p>Seu texto aqui</p>.",
      "Exemplo:\n<p>Estou gostando muito de aprender HTML!</p>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const p = dom.querySelector("body p");
      return !!p && p.textContent.trim().length >= 3;
    },
    successMessage: "Excelente! Você acabou de criar seu primeiro parágrafo de texto."
  },
  {
    id: 8,
    phase: 2,
    levelName: "Fase 2 — Títulos e Textos",
    title: "8. Múltiplos Parágrafos",
    task: "Crie um segundo parágrafo <code>&lt;p&gt;</code> logo abaixo do primeiro. Repare como o navegador separa os dois blocos de texto automaticamente.",
    whereDiagram: "<body>\n  <p>Primeiro parágrafo...</p>\n  ← COLOQUE O SEGUNDO <p> AQUI\n</body>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <h1>Meu Primeiro Site</h1>\n    <p>Este é o primeiro parágrafo.</p>\n    \n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "Você pode ter quantos parágrafos <p> desejar dentro do <body>.",
      "Cada parágrafo deve ter seu próprio fechamento </p>.",
      "Crie um novo parágrafo logo abaixo do anterior.",
      "Exemplo:\n<p>Este é o segundo parágrafo com mais detalhes.</p>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const ps = dom.querySelectorAll("body p");
      return ps.length >= 2;
    },
    successMessage: "Ótimo! No HTML, quebras de linha normais no código não viram parágrafos; precisamos usar a tag <p>."
  },

  // ==========================================
  // FASE 3: FORMATAÇÃO DE TEXTO
  // ==========================================
  {
    id: 9,
    phase: 3,
    levelName: "Fase 3 — Formatação de Texto",
    title: "9. Dando Importância: <strong> (Atalho Alt + W)",
    task: "Dentro do parágrafo, envolva a palavra 'programação' com a tag <code>&lt;strong&gt;</code>.<br><br>💡 <strong>Superpoder do VS Code:</strong> Selecione a palavra com o mouse (ou dê dois cliques nela) e aperte <kbd class=\"kbd-key\">Alt</kbd> + <kbd class=\"kbd-key\">W</kbd> para envolver com tag automaticamente!",
    whereDiagram: "<p>\n  Eu gosto muito de ← COLOQUE <strong>programação</strong> AQUI\n</p>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <p>Eu gosto muito de programação web.</p>\n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "A tag <strong> deixa o texto em negrito e avisa aos leitores de tela que essa palavra é importante.",
      "Atalho Pro do VS Code: Selecione a palavra 'programação' e tecle Alt + W (ou clique no botão '⚡ Envolver Seleção'). Depois digite strong e dê Enter!",
      "Você também pode digitar manualmente colocando <strong> antes da palavra e </strong> logo depois dela.",
      "Exemplo:\n<p>Eu gosto muito de <strong>programação</strong> web.</p>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const strong = dom.querySelector("body p strong");
      return !!strong && strong.textContent.trim().length > 0;
    },
    successMessage: "Muito bem! O texto ganhou destaque e significado semântico com <strong>."
  },
  {
    id: 10,
    phase: 3,
    levelName: "Fase 3 — Formatação de Texto",
    title: "10. Dando Ênfase: <em> (Atalho Alt + W)",
    task: "Use a tag <code>&lt;em&gt;</code> (ênfase) em volta da palavra 'fácil' no segundo parágrafo para deixá-la em itálico.<br><br>⚡ <strong>Pratique o atalho:</strong> Dê dois cliques na palavra 'fácil', aperte <kbd class=\"kbd-key\">Alt</kbd> + <kbd class=\"kbd-key\">W</kbd>, digite <code>em</code> e tecle Enter!",
    whereDiagram: "<p>\n  HTML é muito ← COLOQUE <em>fácil</em> AQUI\n</p>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <p>Eu gosto de <strong>programação</strong>.</p>\n    <p>HTML é muito fácil de aprender.</p>\n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "A tag <em> significa 'emphasis' e deixa o texto em itálico.",
      "Pratique o atalho de desenvolvedor: selecione 'fácil' e aperte Alt + W, depois clique em <em> ou digite 'em'!",
      "Ela deve abrir antes da palavra e fechar logo após: <em>fácil</em>.",
      "Exemplo:\n<p>HTML é muito <em>fácil</em> de aprender.</p>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const em = dom.querySelector("body p em");
      return !!em && em.textContent.trim().length > 0;
    },
    successMessage: "Show! O texto agora possui ênfase estilizada em itálico."
  },
  {
    id: 11,
    phase: 3,
    levelName: "Fase 3 — Formatação de Texto",
    title: "11. O Marca-Texto: <mark>",
    task: "Use a tag <code>&lt;mark&gt;</code> para destacar a palavra 'importante' como se tivesse passado um marca-texto amarelo.<br><br>💡 Experimente selecionar a palavra e pressionar <kbd class=\"kbd-key\">Alt</kbd> + <kbd class=\"kbd-key\">W</kbd>!",
    whereDiagram: "<p>\n  Atenção: isto é ← COLOQUE <mark>importante</mark> AQUI\n</p>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <p>Atenção: isto é importante para o teste.</p>\n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "A tag <mark> simula visualmente uma caneta marca-texto amarela.",
      "Com o atalho Alt + W: selecione 'importante', aperte Alt + W, clique em <mark> e pronto!",
      "Veja o resultado mudar no simulador assim que recarregar o navegador!",
      "Exemplo:\n<p>Atenção: isto é <mark>importante</mark> para o teste.</p>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const mark = dom.querySelector("body p mark");
      return !!mark && mark.textContent.trim().length > 0;
    },
    successMessage: "Incrível! Veja como o navegador colocou o fundo amarelo automaticamente!"
  },
  {
    id: 12,
    phase: 3,
    levelName: "Fase 3 — Formatação de Texto",
    title: "12. Combinando Tags (Aninhamento)",
    task: "Crie um parágrafo que contenha uma palavra em <code>&lt;strong&gt;</code> e outra em <code>&lt;em&gt;</code>, fechando as tags na ordem correta.",
    whereDiagram: "<p>\n   Texto com <strong>negrito</strong> e <em>itálico</em>.\n</p>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <!-- Crie seu parágrafo aqui abaixo -->\n    \n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "Aninhamento significa colocar uma tag dentro da outra.",
      "A regra de ouro é: a última tag que abre é a primeira que deve fechar!",
      "Você pode usar o atalho Alt + W nas palavras para não errar a ordem de fechamento das tags.",
      "Exemplo:\n<p>Hoje é um dia <strong>muito</strong> <em>especial</em>!</p>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const strong = dom.querySelector("body p strong");
      const em = dom.querySelector("body p em");
      return !!strong && !!em;
    },
    successMessage: "Perfeito! Você dominou o aninhamento de tags sem cruzar os fechamentos!"
  },

  // ==========================================
  // FASE 4: IMAGENS E ATRIBUTOS
  // ==========================================
  {
    id: 13,
    phase: 4,
    levelName: "Fase 4 — Imagens e Atributos",
    title: "13. Inserindo uma Imagem: <img> e src",
    task: "Insira uma imagem usando a tag <code>&lt;img&gt;</code> com o atributo <code>src=\"assets/gatinho.svg\"</code> dentro do <code>&lt;body&gt;</code>.<br><br>⚡ <strong>Super Dica do VS Code:</strong> Digite <code>&lt;im</code> e aperte <strong>Enter</strong> para o editor preencher a tag! Ou dentro das aspas de <code>src=\"\"</code>, aperte <strong>Ctrl + Espaço</strong> para listar as imagens da pasta <code>assets/</code>!",
    whereDiagram: "<body>\n  <h1>Minha Foto</h1>\n  ← COLOQUE A TAG <img src=\"assets/gatinho.svg\"> AQUI\n</body>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <h1>Meu Bichinho de Estimação</h1>\n    \n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "A tag <img> serve para exibir imagens. Ela NÃO tem tag de fechamento </img>!",
      "O atributo 'src' significa 'source' (origem/caminho do arquivo de imagem).",
      "Pressione Ctrl + Espaço para abrir o menu do VS Code e selecionar 'assets/gatinho.svg'!",
      "Exemplo:\n<img src=\"assets/gatinho.svg\">"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const img = dom.querySelector("body img");
      return !!img && (img.getAttribute("src") || "").includes("gatinho");
    },
    successMessage: "Que legal! A imagem do gatinho apareceu perfeitamente no simulador! Lembre-se de clicar em 🔄 Recarregar para conferir!"
  },
  {
    id: 14,
    phase: 4,
    levelName: "Fase 4 — Imagens e Atributos",
    title: "14. Acessibilidade com o Atributo alt",
    task: "Adicione o atributo <code>alt=\"Foto de um gatinho fofo\"</code> na sua tag <code>&lt;img&gt;</code>.",
    whereDiagram: "<img src=\"assets/gatinho.svg\"  ← ADICIONE O alt AQUI DENTRO DA TAG >",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <h1>Meu Bichinho de Estimação</h1>\n    <img src=\"assets/gatinho.svg\">\n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "O atributo 'alt' fornece uma descrição textual da imagem para pessoas com deficiência visual (leitores de tela).",
      "Ele é colocado dentro da tag <img>, separado do 'src' por um espaço.",
      "Estrutura: <img src=\"...\" alt=\"descrição aqui\">.",
      "Exemplo:\n<img src=\"assets/gatinho.svg\" alt=\"Foto de um gatinho fofo\">"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const img = dom.querySelector("body img");
      return !!img && img.hasAttribute("alt") && img.getAttribute("alt").trim().length > 0;
    },
    successMessage: "Parabéns por pensar em acessibilidade! Toda imagem na web deve ter um texto alternativo alt."
  },

  // ==========================================
  // FASE 5: LINKS E ÂNCORAS
  // ==========================================
  {
    id: 15,
    phase: 5,
    levelName: "Fase 5 — Links e Navegação",
    title: "15. Criando um Link com <a> e href",
    task: "Crie um link para o Google usando a tag <code>&lt;a&gt;</code> com o atributo <code>href=\"https://www.google.com\"</code> e o texto clicável <strong>Visitar o Google</strong>.",
    whereDiagram: "<body>\n  ← COLOQUE O LINK <a> AQUI DENTRO\n</body>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <h1>Pesquisa na Web</h1>\n    \n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "A tag <a> significa 'anchor' (âncora) e é usada para criar links.",
      "O atributo 'href' indica o endereço de destino (hypertext reference).",
      "O texto que o usuário clica fica ENTRE a abertura <a> e o fechamento </a>.",
      "Exemplo:\n<a href=\"https://www.google.com\">Visitar o Google</a>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const a = dom.querySelector("body a");
      return !!a && (a.getAttribute("href") || "").includes("google") && a.textContent.trim().length > 0;
    },
    successMessage: "Muito bem! O link está ativo e estilizado no simulador!"
  },
  {
    id: 16,
    phase: 5,
    levelName: "Fase 5 — Links e Navegação",
    title: "16. Abrindo em Nova Aba: target=\"_blank\"",
    task: "Adicione o atributo <code>target=\"_blank\"</code> ao link para que ele abra em uma nova aba do navegador.",
    whereDiagram: "<a href=\"https://www.google.com\"  ← ADICIONE target=\"_blank\" AQUI >Google</a>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n  </head>\n  <body>\n    <h1>Pesquisa na Web</h1>\n    <a href=\"https://www.google.com\">Visitar o Google</a>\n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "O atributo target indica onde o link será aberto.",
      "O valor \"_blank\" avisa ao navegador para abrir em uma aba em branco nova.",
      "Coloque um espaço e adicione target=\"_blank\" antes do sinal > de fechamento da tag inicial.",
      "Exemplo:\n<a href=\"https://www.google.com\" target=\"_blank\">Visitar o Google</a>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const a = dom.querySelector("body a");
      return !!a && a.getAttribute("target") === "_blank";
    },
    successMessage: "Excelente! Agora você sabe controlar como os links são abertos no navegador."
  },

  // ==========================================
  // FASE 6: METADADOS E MULTI-PÁGINAS
  // ==========================================
  {
    id: 17,
    phase: 6,
    levelName: "Fase 6 — Identidade da Página",
    title: "17. Nomeando a Aba com <title>",
    task: "Coloque o texto <strong>Meu Site Incrível</strong> na aba do navegador usando a tag <code>&lt;title&gt;</code> dentro do <code>&lt;head&gt;</code>.",
    whereDiagram: "<head>\n  ← O <title> DEVE FICAR AQUI DENTRO DO HEAD!\n</head>\n<body>\n</body>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n    \n  </head>\n  <body>\n    <h1>Bem-vindo!</h1>\n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "O <title> define o título que aparece na aba do navegador, e NÃO no corpo do site.",
      "Por isso, o <title> SEMPRE deve ficar dentro do <head>.",
      "Abra com <title>, digite o título e feche com </title>.",
      "Exemplo:\n<head>\n  <title>Meu Site Incrível</title>\n</head>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const title = dom.querySelector("head title");
      return !!title && title.textContent.trim().length > 0;
    },
    successMessage: "Veja a aba do simulador lá em cima! Ela acabou de mudar com o seu novo título!"
  },
  {
    id: 18,
    phase: 6,
    levelName: "Fase 6 — Identidade da Página",
    title: "18. Ícone da Aba (Favicon)",
    task: "Adicione um favicon na aba usando a tag <code>&lt;link rel=\"icon\" href=\"assets/favicon.svg\"&gt;</code> dentro do <code>&lt;head&gt;</code>.",
    whereDiagram: "<head>\n  <title>Meu Site Incrível</title>\n  ← COLOQUE A TAG <link rel=\"icon\" ...> AQUI NO HEAD\n</head>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Meu Site Incrível</title>\n    \n  </head>\n  <body>\n    <h1>Bem-vindo!</h1>\n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "O favicon é o pequeno ícone que aparece ao lado do nome da aba no navegador.",
      "Como ele é uma informação sobre a página, ele também pertence ao <head>!",
      "A tag <link> não precisa de fechamento (ela é auto-fechável).",
      "Exemplo:\n<link rel=\"icon\" href=\"assets/favicon.svg\">"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const link = dom.querySelector("head link[rel='icon']");
      return !!link && !!link.getAttribute("href");
    },
    successMessage: "Sensacional! O ícone oficial apareceu na aba do simulador!"
  },
  {
    id: 19,
    phase: 6,
    levelName: "Fase 6 — Multi-Páginas",
    title: "19. Conectando Páginas: index.html e pagina2.html",
    task: "Crie um link dentro do <code>&lt;body&gt;</code> de <strong>index.html</strong> que aponte para <code>pagina2.html</code> com o texto <strong>Ir para a Página 2</strong>.",
    whereDiagram: "<body>\n  <h1>Página Principal</h1>\n  ← COLOQUE O LINK <a href=\"pagina2.html\">Ir para a Página 2</a> AQUI\n</body>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Início</title>\n  </head>\n  <body>\n    <h1>Página Inicial</h1>\n    \n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "Para ligar páginas do mesmo site, colocamos o nome do arquivo no atributo href.",
      "Use <a href=\"pagina2.html\">Seu Texto</a>.",
      "Ao clicar no link dentro do simulador, veja a mágica da navegação acontecer!",
      "Exemplo:\n<a href=\"pagina2.html\">Ir para a Página 2</a>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const a = dom.querySelector("body a");
      return !!a && (a.getAttribute("href") || "").includes("pagina2.html");
    },
    successMessage: "Incrível! Você acabou de criar a navegação entre múltiplos arquivos do seu site!"
  },

  // ==========================================
  // FASE 7: CONSERTE O CÓDIGO (DESAFIOS DE DETETIVE)
  // ==========================================
  {
    id: 20,
    phase: 7,
    levelName: "Fase 7 — Conserte o Código",
    title: "20. Detetive 1: O Título Fugitivo",
    task: "O aluno que escreveu este código esqueceu de fechar a tag <code>&lt;title&gt;</code>, o <code>&lt;h1&gt;</code> e o parágrafo <code>&lt;p&gt;</code>. Encontre e feche todas as tags corretamente!",
    whereDiagram: "Encontre os erros nas linhas marcadas no editor e feche todas as tags com </tag>.",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Minha Página\n  </head>\n  <body>\n    <h1>Meu Título\n    <p>Texto do parágrafo\n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "Olhe para a linha 4: a tag <title> foi fechada com </title>?",
      "Olhe para a linha 7: a tag <h1> foi fechada com </h1>?",
      "Olhe para a linha 8: o parágrafo <p> foi fechado com </p>?",
      "Código corrigido:\n<title>Minha Página</title>\n<h1>Meu Título</h1>\n<p>Texto do parágrafo</p>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const h1 = dom.querySelector("body h1");
      const p = dom.querySelector("body p");
      const title = dom.querySelector("head title");
      const hasClosedH1 = /<h1>[\s\S]*?<\/h1>/i.test(code);
      const hasClosedP = /<p>[\s\S]*?<\/p>/i.test(code);
      const hasClosedTitle = /<title>[\s\S]*?<\/title>/i.test(code);
      return !!h1 && !!p && !!title && hasClosedH1 && hasClosedP && hasClosedTitle;
    },
    successMessage: "Excelente trabalho de detetive! Todas as tags foram fechadas no lugar correto!"
  },
  {
    id: 21,
    phase: 7,
    levelName: "Fase 7 — Conserte o Código",
    title: "21. Detetive 2: O Maior Que e a Imagem Quebrada",
    task: "Neste código há 2 erros graves: a tag <code>&lt;h1</code> está sem o sinal de maior <code>&gt;</code>, e a tag de imagem foi escrita de forma errada (<code>&lt;img=\"...\"&gt;</code> em vez de <code>&lt;img src=\"...\"&gt;</code>). Conserte ambos!",
    whereDiagram: "Linha 7: <h1 Meu Site\nLinha 8: <img=\"assets/gatinho.svg\">",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Galeria</title>\n  </head>\n  <body>\n    <h1 Galeria de Fotos</h1>\n    <img=\"assets/gatinho.svg\">\n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "Na linha 7, coloque o sinal '>' logo após o 'h1': <h1>Galeria de Fotos</h1>.",
      "Na linha 8, a tag <img> não usa '=', ela usa o atributo 'src': <img src=\"assets/gatinho.svg\">.",
      "Lembre-se de recarregar o navegador após corrigir para ver a foto carregar!",
      "Código corrigido:\n<h1>Galeria de Fotos</h1>\n<img src=\"assets/gatinho.svg\">"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const h1 = dom.querySelector("body h1");
      const img = dom.querySelector("body img");
      return !!h1 && !!img && (img.getAttribute("src") || "").includes("gatinho") && !code.includes("<h1 Galeria") && !code.includes('<img="');
    },
    successMessage: "Muito bem! Você corrigiu a abertura incompleta e a sintaxe do atributo src!"
  },
  {
    id: 22,
    phase: 7,
    levelName: "Fase 7 — Conserte o Código",
    title: "22. Detetive 3: Elementos no Lugar Errado",
    task: "O aluno inverteu a estrutura: colocou o <code>&lt;h1&gt;</code> e o <code>&lt;p&gt;</code> dentro do <code>&lt;head&gt;</code>, e colocou o <code>&lt;title&gt;</code> dentro do <code>&lt;body&gt;</code>! Mova cada elemento para sua casa correta!",
    whereDiagram: "<head>\n  ← AQUI DEVE FICAR O <title>Meu Site</title>\n</head>\n<body>\n  ← AQUI DEVEM FICAR O <h1> E O <p>\n</body>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <h1>Título Visível</h1>\n    <p>Texto do parágrafo</p>\n  </head>\n  <body>\n    <title>Meu Site</title>\n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "O <head> só guarda metadados como <title>. Ele não aceita <h1> ou <p>.",
      "O <body> é o corpo visível do site onde ficam <h1> e <p>.",
      "Mova <h1> e <p> para dentro do <body>, e coloque o <title> dentro do <head>.",
      "Exemplo de organização:\n<head>\n  <title>Meu Site</title>\n</head>\n<body>\n  <h1>Título Visível</h1>\n  <p>Texto do parágrafo</p>\n</body>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const headTitle = dom.querySelector("head title");
      const bodyH1 = dom.querySelector("body h1");
      const bodyP = dom.querySelector("body p");
      const headVisible = dom.querySelector("head h1, head p");
      return !!headTitle && !!bodyH1 && !!bodyP && !headVisible;
    },
    successMessage: "Espetacular! Agora cada elemento está em sua casa definitiva: HEAD e BODY!"
  },
  {
    id: 23,
    phase: 7,
    levelName: "Fase 7 — Conserte o Código",
    title: "23. Detetive 4: As Tags com Nomes Errados",
    task: "Alguém digitou as tags com erros ortográficos: usou <code>&lt;ht1&gt;</code> em vez de <code>&lt;h1&gt;</code>, e <code>&lt;paragrafo&gt;</code> em vez de <code>&lt;p&gt;</code>! Encontre e corrija os nomes das tags.",
    whereDiagram: "Linha 7: <ht1>...</ht1>  → Corrija para <h1>...</h1>\nLinha 8: <paragrafo>...</paragrafo> → Corrija para <p>...</p>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Nomes de Tags</title>\n  </head>\n  <body>\n    <ht1>Título Principal</ht1>\n    <paragrafo>Este texto precisa da tag certa.</paragrafo>\n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "No padrão HTML não existe a tag <ht1>, o correto é <h1> e </h1>.",
      "Não existe a tag <paragrafo>, a tag oficial de parágrafo é apenas <p> e </p>.",
      "Corrija tanto a tag de abertura quanto a de fechamento.",
      "Exemplo:\n<h1>Título Principal</h1>\n<p>Este texto precisa da tag certa.</p>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const h1 = dom.querySelector("body h1");
      const p = dom.querySelector("body p");
      return !!h1 && !!p && !code.includes("<ht1>") && !code.includes("<paragrafo>");
    },
    successMessage: "Brilhante! O navegador só entende tags quando escritas exatamente com o nome padrão!"
  },
  {
    id: 24,
    phase: 7,
    levelName: "Fase 7 — Conserte o Código",
    title: "24. Detetive 5: O Link Sem Âncora e Fechamento Invertido",
    task: "Dois erros comuns de alunos: o <code>&lt;h2&gt;</code> foi fechado usando <code>&lt;h2&gt;</code> (sem a barra), e a tag <code>&lt;a&gt;</code> foi criada vazia sem nenhum texto de âncora para o usuário clicar! Corrija ambos.",
    whereDiagram: "Linha 7: <h2>Subtítulo<h2> → Precisa fechar com </h2>\nLinha 8: <a href=\"pagina2.html\"></a> → Precisa de um texto de âncora no meio!",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Página de Links</title>\n  </head>\n  <body>\n    <h2>Meu Subtítulo<h2>\n    <a href=\"pagina2.html\"></a>\n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "Para fechar o <h2>, você deve usar a barra invertida: </h2>.",
      "A tag <a> vazia não exibe nada na tela. Coloque uma palavra ou nome dentro dela (ex: <a href=\"pagina2.html\">Ir para Página 2</a>).",
      "Depois de corrigir, clique no botão de recarregar o navegador para conferir o link visível!",
      "Exemplo:\n<h2>Meu Subtítulo</h2>\n<a href=\"pagina2.html\">Ir para a Página 2</a>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const h2 = dom.querySelector("body h2");
      const a = dom.querySelector("body a");
      const hasClosedH2 = /<h2>[\s\S]*?<\/h2>/i.test(code);
      return !!h2 && !!a && hasClosedH2 && a.textContent.trim().length >= 2;
    },
    successMessage: "Perfeito! Você dominou o fechamento correto e aprendeu que todo hiperlink precisa de um texto de âncora!"
  },
  {
    id: 25,
    phase: 7,
    levelName: "Fase 7 — Desafio Final",
    title: "25. Desafio Livre: Sua Página Pessoal Completa",
    task: "Crie uma página pessoal completa no <code>&lt;body&gt;</code> contendo:\n• Seu nome como título <code>&lt;h1&gt;</code>;\n• Um parágrafo <code>&lt;p&gt;</code> sobre você;\n• Uma imagem <code>&lt;img src=\"assets/avatar.svg\" alt=\"Meu avatar\"&gt;</code>;\n• Um link <code>&lt;a href=\"...\"&gt;Texto do link&lt;/a&gt;</code> com texto de âncora visível.",
    whereDiagram: "<body>\n  1. <h1> com seu nome\n  2. <p> sobre você\n  3. <img src=\"assets/avatar.svg\" alt=\"...\">\n  4. <a href=\"...\">Texto para clicar</a>\n</body>",
    starterCode: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Sobre Mim</title>\n  </head>\n  <body>\n    <!-- Monte sua página completa aqui! -->\n    \n  </body>\n</html>",
    targetFile: "index.html",
    hints: [
      "Use as tags que você aprendeu: <h1>, <p>, <img> e <a>.",
      "Lembre-se: o link <a> precisa ter um texto de âncora clicável entre <a> e </a>.",
      "Não se esqueça de recarregar o navegador simulado para ver o seu site pronto!",
      "Exemplo de estrutura:\n<h1>Anderson</h1>\n<p>Estudante de tecnologia.</p>\n<img src=\"assets/avatar.svg\" alt=\"Meu avatar\">\n<a href=\"https://github.com\">Meu Perfil no GitHub</a>"
    ],
    verify: (code, dom, errors) => {
      if (errors.some(e => e.type === 'error')) return false;
      const h1 = dom.querySelector("body h1");
      const p = dom.querySelector("body p");
      const img = dom.querySelector("body img");
      const a = dom.querySelector("body a");
      return !!h1 && !!p && !!img && !!a && a.textContent.trim().length >= 2;
    },
    successMessage: "PARABÉNS! VOCÊ COMPLETOU TODOS OS 25 EXERCÍCIOS DO HTML FÁCIL COM MAESTRIA!"
  }
];
