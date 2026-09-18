/**
 * EDITOR.JS - Componente de Editor de Código Estilo VS Code
 * Inclui:
 * 1. Indentação inteligente automática ao dar Enter (como no VS Code)
 * 2. Suporte à tecla Tab (2 espaços)
 * 3. IntelliSense / Autocomplete de tags (img, a, link, etc.) e caminhos de imagens com Ctrl+Espaço
 * 4. Destaque de sintaxe e numeração de linhas sincronizada
 */

const SNIPPET_SUGGESTIONS = [
  {
    prefix: "img",
    label: "img",
    detail: '<img src="" alt="">',
    insert: '<img src="" alt="">',
    cursorOffset: 10, // posiciona o cursor dentro de src="|"
    icon: "🖼️"
  },
  {
    prefix: "a",
    label: "a",
    detail: '<a href=""></a>',
    insert: '<a href=""></a>',
    cursorOffset: 9, // posiciona o cursor dentro de href="|"
    icon: "🔗"
  },
  {
    prefix: "link",
    label: "link:favicon",
    detail: '<link rel="icon" href="">',
    insert: '<link rel="icon" href="">',
    cursorOffset: 19, // posiciona o cursor dentro de href="|"
    icon: "🌐"
  },
  {
    prefix: "h1",
    label: "h1",
    detail: "<h1></h1>",
    insert: '<h1></h1>',
    cursorOffset: 4, // posiciona o cursor entre as tags: <h1>|</h1>
    icon: "🏷️"
  },
  {
    prefix: "h2",
    label: "h2",
    detail: "<h2></h2>",
    insert: '<h2></h2>',
    cursorOffset: 4,
    icon: "🏷️"
  },
  {
    prefix: "p",
    label: "p",
    detail: "<p></p>",
    insert: '<p></p>',
    cursorOffset: 3, // posiciona o cursor entre <p>|</p>
    icon: "📄"
  },
  {
    prefix: "strong",
    label: "strong",
    detail: "<strong></strong>",
    insert: '<strong></strong>',
    cursorOffset: 8,
    icon: "🅱️"
  },
  {
    prefix: "em",
    label: "em",
    detail: "<em></em>",
    insert: '<em></em>',
    cursorOffset: 4,
    icon: "🔤"
  },
  {
    prefix: "mark",
    label: "mark",
    detail: "<mark></mark>",
    insert: '<mark></mark>',
    cursorOffset: 6,
    icon: "🖍️"
  }
];

const IMAGE_ASSET_SUGGESTIONS = [
  { label: "assets/gatinho.svg", detail: "Foto do gatinho fofo", insert: "assets/gatinho.svg", icon: "🐱" },
  { label: "assets/avatar.svg", detail: "Avatar do usuário", insert: "assets/avatar.svg", icon: "👤" },
  { label: "assets/computador.svg", detail: "Desenho de computador", insert: "assets/computador.svg", icon: "💻" },
  { label: "assets/favicon.svg", detail: "Ícone oficial HTML5", insert: "assets/favicon.svg", icon: "🌐" }
];

const LINK_SUGGESTIONS = [
  { label: "pagina2.html", detail: "Segunda página do site", insert: "pagina2.html", icon: "📄" },
  { label: "index.html", detail: "Página inicial do site", insert: "index.html", icon: "🏠" },
  { label: "https://www.google.com", detail: "Link para o Google", insert: "https://www.google.com", icon: "🔍" }
];

class SimpleCodeEditor {
  constructor(options) {
    this.textarea = options.textarea;
    this.highlightEl = options.highlightEl;
    this.lineNumbersEl = options.lineNumbersEl;
    this.lineHighlightEl = options.lineHighlightEl;
    this.statusCursorEl = options.statusCursorEl;
    this.onChange = options.onChange || (() => {});

    this.activeLine = 1;
    this.errorLines = new Set();

    // IntelliSense state
    this.intellisenseEl = null;
    this.currentSuggestions = [];
    this.selectedSuggestionIndex = 0;
    this.intellisenseActive = false;

    this.init();
  }

  init() {
    this.createIntelliSenseElement();

    // Sincronização de digitação
    this.textarea.addEventListener("input", (e) => {
      this.update();
      this.onChange(this.getValue());
      this.checkAutoTriggerIntelliSense();
    });

    // Sincronização de rolagem
    this.textarea.addEventListener("scroll", () => {
      this.highlightEl.scrollTop = this.textarea.scrollTop;
      this.highlightEl.scrollLeft = this.textarea.scrollLeft;
      this.lineNumbersEl.scrollTop = this.textarea.scrollTop;
      if (this.intellisenseActive) this.positionIntelliSense();
    });

    // Manipulação avançada de teclas (Tab, Enter com auto-indentação, Ctrl+Espaço)
    this.textarea.addEventListener("keydown", (e) => this.handleKeyDown(e));

    // Rastreamento de cursor e linha ativa
    ["click", "keyup", "focus"].forEach(evt => {
      this.textarea.addEventListener(evt, () => {
        this.updateCursorPosition();
      });
    });

    document.addEventListener("click", (e) => {
      if (this.intellisenseActive && !this.intellisenseEl.contains(e.target) && e.target !== this.textarea) {
        this.hideIntelliSense();
      }
    });

    this.update();
  }

  createIntelliSenseElement() {
    this.intellisenseEl = document.createElement("div");
    this.intellisenseEl.className = "intellisense-popup";
    this.intellisenseEl.id = "editor-intellisense";
    this.textarea.parentElement.appendChild(this.intellisenseEl);
  }

  handleKeyDown(e) {
    // 1. Tecla de atalho Ctrl + Espaço para disparar IntelliSense / procurar imagem
    if (e.ctrlKey && (e.key === " " || e.code === "Space")) {
      e.preventDefault();
      this.triggerIntelliSense(true);
      return;
    }

    // 2. Navegação no IntelliSense quando aberto
    if (this.intellisenseActive) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.selectedSuggestionIndex = (this.selectedSuggestionIndex + 1) % this.currentSuggestions.length;
        this.renderIntelliSenseItems();
        return;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.selectedSuggestionIndex = (this.selectedSuggestionIndex - 1 + this.currentSuggestions.length) % this.currentSuggestions.length;
        this.renderIntelliSenseItems();
        return;
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        this.applySelectedSuggestion();
        return;
      } else if (e.key === "Escape") {
        e.preventDefault();
        this.hideIntelliSense();
        return;
      }
    }

    // 3. Tecla TAB para indentação
    if (e.key === "Tab") {
      e.preventDefault();
      const start = this.textarea.selectionStart;
      const end = this.textarea.selectionEnd;
      const val = this.textarea.value;
      this.textarea.value = val.substring(0, start) + "  " + val.substring(end);
      this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
      this.update();
      this.onChange(this.getValue());
      return;
    }

    // 4. Atalho Ctrl + Enter para Executar Código
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      if (window.App && window.App.runCode) {
        window.App.runCode();
      }
      return;
    }

    // 5. INDENTAÇÃO INTELIGENTE NO ENTER (ESTILO VS CODE)
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleSmartEnter();
    }
  }

  /**
   * Executa a indentação inteligente de tags idêntica ao VS Code
   */
  handleSmartEnter() {
    const val = this.textarea.value;
    const pos = this.textarea.selectionStart;
    const lineStart = val.lastIndexOf("\n", pos - 1) + 1;
    const lineBeforeCursor = val.substring(lineStart, pos);
    const textAfterCursor = val.substring(pos);

    // Identifica indentação existente na linha
    const indentMatch = lineBeforeCursor.match(/^(\s*)/);
    const currentIndent = indentMatch ? indentMatch[1] : "";

    // Caso 1: Cursor está EXATAMENTE entre a abertura e fechamento de uma tag (ex: <html>|</html> ou <body>|</body>)
    const openTagMatch = lineBeforeCursor.match(/<([a-zA-Z0-9]+)[^>]*>$/);
    const closeTagMatch = textAfterCursor.match(/^<\/([a-zA-Z0-9]+)>/);

    if (openTagMatch && closeTagMatch && openTagMatch[1].toLowerCase() === closeTagMatch[1].toLowerCase()) {
      // Cria quebra tripla estilo VS Code:
      // <tag>
      //   | (cursor aqui indentado)
      // </tag>
      const newIndent = currentIndent + "  ";
      const insertion = "\n" + newIndent + "\n" + currentIndent;
      this.textarea.value = val.substring(0, pos) + insertion + val.substring(pos);
      const newCursorPos = pos + 1 + newIndent.length;
      this.textarea.selectionStart = this.textarea.selectionEnd = newCursorPos;
    }
    // Caso 2: Cursor está logo após abertura de uma tag em bloco (<html>, <head>, <body>, <p>, <div>, etc.)
    else if (openTagMatch && !['img', 'link', 'meta', 'br', 'hr', 'input'].includes(openTagMatch[1].toLowerCase())) {
      const newIndent = currentIndent + "  ";
      const insertion = "\n" + newIndent;
      this.textarea.value = val.substring(0, pos) + insertion + val.substring(pos);
      this.textarea.selectionStart = this.textarea.selectionEnd = pos + insertion.length;
    }
    // Caso 3: Linha normal mantendo a indentação
    else {
      const insertion = "\n" + currentIndent;
      this.textarea.value = val.substring(0, pos) + insertion + val.substring(pos);
      this.textarea.selectionStart = this.textarea.selectionEnd = pos + insertion.length;
    }

    this.update();
    this.onChange(this.getValue());
  }

  /**
   * Verifica se deve abrir sugestões automaticamente enquanto o aluno digita
   */
  checkAutoTriggerIntelliSense() {
    const val = this.textarea.value;
    const pos = this.textarea.selectionStart;
    const lineStart = val.lastIndexOf("\n", pos - 1) + 1;
    const lineBeforeCursor = val.substring(lineStart, pos);

    // Se estiver dentro de src="..." ou digitando após src="
    if (/src=["'][^"']*$/i.test(lineBeforeCursor)) {
      this.showSuggestions(IMAGE_ASSET_SUGGESTIONS, "📁 Escolha a imagem (ou aperte Ctrl+Espaço)");
      return;
    }

    // Se estiver dentro de href="..." ou digitando após href="
    if (/href=["'][^"']*$/i.test(lineBeforeCursor)) {
      this.showSuggestions(LINK_SUGGESTIONS, "🔗 Escolha o link (ou aperte Ctrl+Espaço)");
      return;
    }

    // Se estiver digitando uma tag iniciando com '<'
    const tagMatch = lineBeforeCursor.match(/<([a-z0-9]*)$/i);
    if (tagMatch) {
      const typed = tagMatch[1].toLowerCase();
      const filtered = SNIPPET_SUGGESTIONS.filter(s => s.prefix.startsWith(typed));
      if (filtered.length > 0) {
        this.showSuggestions(filtered, "💡 Sugestões de Tags (Enter para preencher)");
        return;
      }
    }

    this.hideIntelliSense();
  }

  /**
   * Aciona manualmente o IntelliSense com atalho Ctrl+Espaço
   */
  triggerIntelliSense(explicit = false) {
    const val = this.textarea.value;
    const pos = this.textarea.selectionStart;
    const lineStart = val.lastIndexOf("\n", pos - 1) + 1;
    const lineBeforeCursor = val.substring(lineStart, pos);

    if (/src=["'][^"']*$/i.test(lineBeforeCursor) || /src=$/i.test(lineBeforeCursor.trim())) {
      this.showSuggestions(IMAGE_ASSET_SUGGESTIONS, "🖼️ Imagens da pasta assets/ (Enter para escolher)");
    } else if (/href=["'][^"']*$/i.test(lineBeforeCursor)) {
      this.showSuggestions(LINK_SUGGESTIONS, "🔗 Links disponíveis");
    } else {
      // Sugestões de snippets gerais de tags
      this.showSuggestions(SNIPPET_SUGGESTIONS, "⚡ Autocomplete de Tags HTML");
    }
  }

  showSuggestions(list, title = "Sugestões do VS Code") {
    if (!list || list.length === 0) {
      this.hideIntelliSense();
      return;
    }

    this.currentSuggestions = list;
    this.selectedSuggestionIndex = 0;
    this.intellisenseTitle = title;
    this.intellisenseActive = true;
    this.intellisenseEl.classList.add("show");

    this.renderIntelliSenseItems();
    this.positionIntelliSense();
  }

  renderIntelliSenseItems() {
    let html = `
      <div class="intellisense-header">
        <span>${this.intellisenseTitle}</span>
        <span>Tab / Enter ↵</span>
      </div>
    `;

    html += this.currentSuggestions.map((item, idx) => `
      <div class="intellisense-item ${idx === this.selectedSuggestionIndex ? 'selected' : ''}" data-idx="${idx}">
        <div class="intellisense-item-left">
          <span class="intellisense-icon">${item.icon || '⚡'}</span>
          <span class="intellisense-label">${escapeHtml(item.label)}</span>
        </div>
        <span class="intellisense-detail">${escapeHtml(item.detail || '')}</span>
      </div>
    `).join('');

    this.intellisenseEl.innerHTML = html;

    // Adiciona cliques nos itens
    this.intellisenseEl.querySelectorAll(".intellisense-item").forEach(el => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.getAttribute("data-idx"), 10);
        this.selectedSuggestionIndex = idx;
        this.applySelectedSuggestion();
      });
    });
  }

  positionIntelliSense() {
    const lineHeight = 20;
    const topOffset = (this.activeLine) * lineHeight + 16 - this.textarea.scrollTop;
    this.intellisenseEl.style.top = `${Math.max(10, topOffset)}px`;
    this.intellisenseEl.style.left = `80px`;
  }

  hideIntelliSense() {
    this.intellisenseActive = false;
    if (this.intellisenseEl) {
      this.intellisenseEl.classList.remove("show");
    }
  }

  applySelectedSuggestion() {
    const item = this.currentSuggestions[this.selectedSuggestionIndex];
    if (!item) return;

    const val = this.textarea.value;
    const pos = this.textarea.selectionStart;
    const lineStart = val.lastIndexOf("\n", pos - 1) + 1;
    const lineBeforeCursor = val.substring(lineStart, pos);

    // Se estiver inserindo dentro de src="..." ou href="..."
    if (/src=["'][^"']*$/i.test(lineBeforeCursor)) {
      const quoteIndex = Math.max(lineBeforeCursor.lastIndexOf('"'), lineBeforeCursor.lastIndexOf("'"));
      const replaceStart = lineStart + quoteIndex + 1;
      const textAfter = val.substring(pos);
      const closeQuoteMatch = textAfter.indexOf('"');
      const replaceEnd = closeQuoteMatch !== -1 ? pos + closeQuoteMatch : pos;

      this.textarea.value = val.substring(0, replaceStart) + item.insert + val.substring(replaceEnd);
      const newPos = replaceStart + item.insert.length;
      this.textarea.selectionStart = this.textarea.selectionEnd = newPos;
    }
    // Se estiver substituindo tag digitada como <im ou <a
    else if (/<[a-z0-9]*$/i.test(lineBeforeCursor)) {
      const tagOpenIndex = lineBeforeCursor.lastIndexOf("<");
      const replaceStart = lineStart + tagOpenIndex;
      this.textarea.value = val.substring(0, replaceStart) + item.insert + val.substring(pos);
      const newPos = item.cursorOffset !== undefined 
        ? replaceStart + item.cursorOffset 
        : replaceStart + item.insert.length;
      this.textarea.selectionStart = this.textarea.selectionEnd = newPos;
    }
    // Inserção direta
    else {
      this.textarea.value = val.substring(0, pos) + item.insert + val.substring(pos);
      const newPos = pos + item.insert.length;
      this.textarea.selectionStart = this.textarea.selectionEnd = newPos;
    }

    this.hideIntelliSense();
    this.update();
    this.onChange(this.getValue());
    this.textarea.focus();
  }

  getValue() {
    return this.textarea.value;
  }

  setValue(newVal) {
    this.textarea.value = newVal;
    this.update();
  }

  setErrorLines(lines) {
    this.errorLines = new Set(lines);
    this.renderLineNumbers();
  }

  clearErrorLines() {
    this.errorLines.clear();
    this.renderLineNumbers();
  }

  update() {
    this.renderLineNumbers();
    this.renderHighlight();
    this.updateCursorPosition();
  }

  updateCursorPosition() {
    const val = this.textarea.value;
    const pos = this.textarea.selectionStart || 0;
    const lines = val.substring(0, pos).split("\n");
    const currentLine = lines.length;
    const currentCol = lines[lines.length - 1].length + 1;

    this.activeLine = currentLine;

    if (this.statusCursorEl) {
      this.statusCursorEl.textContent = `Linha ${currentLine}, Coluna ${currentCol}`;
    }

    // Posiciona o highlight da linha ativa
    if (this.lineHighlightEl) {
      const lineHeight = 20; // 20px
      const topOffset = (currentLine - 1) * lineHeight + 12 - this.textarea.scrollTop;
      this.lineHighlightEl.style.top = `${topOffset}px`;
      this.lineHighlightEl.style.display = topOffset >= 0 ? "block" : "none";
    }

    this.renderLineNumbers();
  }

  renderLineNumbers() {
    const lineCount = this.textarea.value.split("\n").length;
    let html = "";
    for (let i = 1; i <= lineCount; i++) {
      const isActive = i === this.activeLine ? "active-line" : "";
      const isError = this.errorLines.has(i) ? "error-line" : "";
      html += `<div class="line-number ${isActive} ${isError}">${i}</div>`;
    }
    this.lineNumbersEl.innerHTML = html;
  }

  renderHighlight() {
    const code = this.textarea.value;
    this.highlightEl.innerHTML = this.highlightSyntax(code) + "\n";
  }

  highlightSyntax(code) {
    let safe = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Doctype
    safe = safe.replace(/(&lt;!doctype\s+html&gt;)/gi, '<span class="token-doctype">$1</span>');

    // Comentários HTML
    safe = safe.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="token-comment">$1</span>');

    // Tags e atributos
    safe = safe.replace(/(&lt;\/?[a-zA-Z0-9_-]+)([\s\S]*?)(&gt;)/g, (match, p1, p2, p3) => {
      let attrs = p2.replace(/([a-zA-Z0-9_-]+)(=)("[^"]*"|'[^']*')/g, (m, aName, aEq, aVal) => {
        return `<span class="token-attr">${aName}</span>${aEq}<span class="token-string">${aVal}</span>`;
      });

      return `<span class="token-tag">${p1}</span>${attrs}<span class="token-tag">${p3}</span>`;
    });

    return safe;
  }
}
