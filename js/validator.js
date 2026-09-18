/**
 * VALIDATOR.JS - Analisador Sintático & Pedagógico de HTML
 * Desenvolvido especificamente para detectar erros comuns de alunos iniciantes.
 */

const KNOWN_HTML_TAGS = [
  "html", "head", "body", "title", "link", "meta", "style", "script",
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "img", "button",
  "strong", "b", "em", "i", "mark", "small", "span", "div",
  "ul", "ol", "li", "table", "tr", "th", "td", "form", "input",
  "textarea", "footer", "header", "nav", "section", "main", "hr", "br"
];

// Tags que NÃO precisam de fechamento (self-closing / void elements)
const VOID_TAGS = ["img", "link", "meta", "br", "hr", "input"];

// Elementos que pertencem exclusivamente ao HEAD
const HEAD_EXCLUSIVE_TAGS = ["title", "link", "meta", "style"];

// Elementos que pertencem exclusivamente ao BODY (conteúdos visíveis)
const BODY_EXCLUSIVE_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "img", "button",
  "strong", "b", "em", "i", "mark", "small", "span", "div",
  "ul", "ol", "li", "table", "footer", "header", "nav", "section", "main"
];

class PedagogicalValidator {
  /**
   * Analisa o código do aluno e retorna uma lista de diagnósticos pedagógicos
   * @param {string} code
   * @returns {Array<{type: 'error'|'warning'|'success', message: string, line: number, suggestion?: string}>}
   */
  static analyze(code) {
    const diagnostics = [];
    if (!code || !code.trim()) {
      diagnostics.push({
        type: 'warning',
        line: 1,
        message: "O editor está vazio. Comece a digitar o código conforme as instruções ao lado."
      });
      return { diagnostics, dom: null };
    }

    const lines = code.split('\n');

    // 1. Verificação de falta do '>' ou tags truncadas por linha
    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];
      const lineNum = i + 1;

      // Se contém '<' mas não é comentário e não fecha com '>' na mesma linha (ou espaço suspeito)
      const openBrackets = (lineText.match(/</g) || []).length;
      const closeBrackets = (lineText.match(/>/g) || []).length;

      // Ignora linhas de comentários <!DOCTYPE e <!--
      if (!lineText.includes("<!--") && !lineText.includes("<!DOCTYPE") && openBrackets > closeBrackets) {
        // Verifica se é erro como <h1 Meu site</h1> ou <img src="foto.jpg"
        diagnostics.push({
          type: 'error',
          line: lineNum,
          message: `A abertura da tag na linha ${lineNum} parece incompleta. Verifique se você não esqueceu de fechar com o sinal '>'.`
        });
      }

      // Detecta erro comum em atributos: <img="imagem.jpg"> ou <tag="valor">
      const invalidAttrEqual = lineText.match(/<([a-z0-9]+)\s*=\s*["']/i);
      if (invalidAttrEqual) {
        const tagName = invalidAttrEqual[1];
        diagnostics.push({
          type: 'error',
          line: lineNum,
          message: `Sintaxe de atributo incorreta na linha ${lineNum}: você escreveu <code>&lt;${tagName}="..."&gt;</code>. Lembre-se que o atributo precisa de um nome, como <code>&lt;${tagName} src="..."&gt;</code>.`
        });
      }

      // Detecta falta do '=' no atributo: <img src "foto.jpg">
      const missingAttrEquals = lineText.match(/<([a-z0-9]+)\s+([a-z]+)\s+["'][^"']*["']/i);
      if (missingAttrEquals && !['disabled', 'required', 'checked', 'readonly'].includes(missingAttrEquals[2].toLowerCase())) {
        diagnostics.push({
          type: 'error',
          line: lineNum,
          message: `Falta o sinal '=' no atributo '${missingAttrEquals[2]}' na linha ${lineNum}. O correto é <code>${missingAttrEquals[2]}="valor"</code>.`
        });
      }
    }

    // 2. Extração e validação de tokens de tags
    // Encontra todas as tags no código com posição
    const tagRegex = /<(\/)?([a-zA-Z0-9_-]+)([^>]*)>/g;
    let match;
    const tagStack = []; // pilha para verificar fechamento
    const tagCounts = {};

    while ((match = tagRegex.exec(code)) !== null) {
      const fullMatch = match[0];
      const isClosing = match[1] === '/';
      const rawTagName = match[2].toLowerCase();
      const attributes = match[3];
      const lineNum = code.substring(0, match.index).split('\n').length;

      // Verifica se a tag existe na especificação HTML
      if (!KNOWN_HTML_TAGS.includes(rawTagName) && !rawTagName.startsWith('!') && !rawTagName.startsWith('?')) {
        const suggestion = this.findClosestTag(rawTagName);
        diagnostics.push({
          type: 'error',
          line: lineNum,
          message: `A tag <code>&lt;${rawTagName}&gt;</code> na linha ${lineNum} não existe no padrão HTML.${suggestion ? ` Você quis dizer <strong>&lt;${suggestion}&gt;</strong>?` : ''}`
        });
      }

      if (VOID_TAGS.includes(rawTagName)) {
        // Tags vazias (não devem ter </tag>)
        if (isClosing) {
          diagnostics.push({
            type: 'warning',
            line: lineNum,
            message: `A tag <code>&lt;${rawTagName}&gt;</code> é auto-fechável e não deve ter fechamento <code>&lt;/${rawTagName}&gt;</code>.`
          });
        }
        continue;
      }

      if (!isClosing) {
        // Verificação de fechamento errado do tipo: <h1>Meu site<h1>
        // Se já existe uma tag aberta de mesmo nome sem fechamento antes de outra de mesmo nome
        tagStack.push({ name: rawTagName, line: lineNum });
        tagCounts[rawTagName] = (tagCounts[rawTagName] || 0) + 1;
      } else {
        // Tag de fechamento
        if (tagStack.length === 0) {
          diagnostics.push({
            type: 'error',
            line: lineNum,
            message: `Você colocou o fechamento <code>&lt;/${rawTagName}&gt;</code> na linha ${lineNum}, mas nenhuma tag <code>&lt;${rawTagName}&gt;</code> foi aberta antes.`
          });
        } else {
          const lastOpened = tagStack.pop();
          if (lastOpened.name !== rawTagName) {
            diagnostics.push({
              type: 'error',
              line: lineNum,
              message: `Fechamento incorreto ou fora de ordem: você abriu <code>&lt;${lastOpened.name}&gt;</code> na linha ${lastOpened.line}, mas tentou fechar com <code>&lt;/${rawTagName}&gt;</code> na linha ${lineNum}. Lembre-se da regra: a última tag que abre é a primeira que deve fechar!`
            });
          }
        }
      }
    }

    // 3. Tags que ficaram abertas sem fechamento
    while (tagStack.length > 0) {
      const unclosed = tagStack.pop();
      diagnostics.push({
        type: 'error',
        line: unclosed.line,
        message: `Parece que a tag <code>&lt;${unclosed.name}&gt;</code> aberta na linha ${unclosed.line} não foi fechada. Não se esqueça de colocar <code>&lt;/${unclosed.name}&gt;</code>.`
      });
    }

    // 4. Verificação de fechamento duplicado como <h1>texto<h1>
    const duplicateOpenAsCloseRegex = /<([a-z0-9]+)>([^<]+)<([a-z0-9]+)>/gi;
    let dupMatch;
    while ((dupMatch = duplicateOpenAsCloseRegex.exec(code)) !== null) {
      if (dupMatch[1].toLowerCase() === dupMatch[3].toLowerCase() && !VOID_TAGS.includes(dupMatch[1].toLowerCase())) {
        const lineNum = code.substring(0, dupMatch.index).split('\n').length;
        diagnostics.push({
          type: 'warning',
          line: lineNum,
          message: `Atenção: você digitou <code>&lt;${dupMatch[1]}&gt;</code> duas vezes em volta do texto. Para fechar a tag, você deve usar a barra: <code>&lt;/${dupMatch[1]}&gt;</code>.`
        });
      }
    }

    // 5. Verificação Estrutural de HEAD vs BODY via DOM Parser seguro
    let parsedDom = null;
    try {
      const parser = new DOMParser();
      parsedDom = parser.parseFromString(code, 'text/html');

      // Verifica elementos visíveis colocados indevidamente no HEAD
      if (parsedDom.head) {
        for (const tag of BODY_EXCLUSIVE_TAGS) {
          const misplaced = parsedDom.head.querySelectorAll(tag);
          if (misplaced.length > 0) {
            diagnostics.push({
              type: 'error',
              line: 1,
              message: `O elemento <code>&lt;${tag}&gt;</code> é um conteúdo visível que o usuário deve ver na tela. Ele NÃO deve ficar dentro do <code>&lt;head&gt;</code>, mas sim dentro do <code>&lt;body&gt;</code>!`
            });
          }
        }
      }

      // Verifica elementos de metadados colocados indevidamente no BODY
      if (parsedDom.body) {
        for (const tag of HEAD_EXCLUSIVE_TAGS) {
          const misplaced = parsedDom.body.querySelectorAll(tag);
          if (misplaced.length > 0) {
            diagnostics.push({
              type: 'warning',
              line: 1,
              message: `O elemento <code>&lt;${tag}&gt;</code> é uma configuração/metadado da página. O local ideal para ele é dentro do <code>&lt;head&gt;</code>, e não no <code>&lt;body&gt;</code>.`
            });
          }
        }

        // Verifica se há links <a> vazios sem texto de âncora
        const links = parsedDom.body.querySelectorAll('a');
        links.forEach(a => {
          if (!a.textContent.trim() && a.children.length === 0) {
            diagnostics.push({
              type: 'error',
              line: 1,
              message: `A tag <code>&lt;a&gt;</code> foi criada, mas não tem nenhum texto ou palavra dentro dela! O link precisa de um texto de âncora visível entre <code>&lt;a&gt;</code> e <code>&lt;/a&gt;</code> para o usuário saber onde clicar (ex: <code>&lt;a href="..."&gt;Visitar Site&lt;/a&gt;</code>).`
            });
          }
        });
      }

      // Verifica se há texto ou tags soltas antes do <html> ou depois do </html>
      const trimmed = code.trim();
      if (trimmed.includes("</html>")) {
        const afterHtml = trimmed.substring(trimmed.indexOf("</html>") + 7).trim();
        if (afterHtml.length > 0 && !afterHtml.startsWith("<!--")) {
          diagnostics.push({
            type: 'warning',
            line: lines.length,
            message: "Atenção: há conteúdo escrito depois do fechamento de <code>&lt;/html&gt;</code>. Todo o conteúdo da página deve ficar antes dessa tag!"
          });
        }
      }

    } catch (e) {
      console.error("Erro ao analisar DOM:", e);
    }

    // Se nenhum erro foi detectado, emitimos status limpo
    if (diagnostics.length === 0) {
      diagnostics.push({
        type: 'success',
        line: 1,
        message: "Estrutura e sintaxe HTML perfeitas! Nenhuma tag aberta ou erro de digitação encontrado."
      });
    }

    return { diagnostics, dom: parsedDom };
  }

  /**
   * Sugere a tag correta para erros de digitação comuns
   */
  static findClosestTag(typedTag) {
    const typos = {
      "ht1": "h1",
      "h": "h1",
      "pargrafo": "p",
      "paragrafo": "p",
      "prg": "p",
      "imgg": "img",
      "imagem": "img",
      "linke": "a",
      "ancora": "a",
      "bory": "body",
      "bodi": "body",
      "hed": "head",
      "tittle": "title",
      "titlo": "title",
      "strongg": "strong",
      "negrito": "strong",
      "italico": "em"
    };

    if (typos[typedTag]) return typos[typedTag];

    // Busca por distância simples
    let closest = null;
    let minDist = 3;
    for (const tag of KNOWN_HTML_TAGS) {
      const dist = this.levenshtein(typedTag, tag);
      if (dist < minDist) {
        minDist = dist;
        closest = tag;
      }
    }
    return closest;
  }

  static levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
}
