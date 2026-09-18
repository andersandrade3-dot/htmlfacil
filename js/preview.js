/**
 * PREVIEW.JS - Simulador de Navegador Web com Abas Reativas e Iframe Seguro
 * Atualiza dinamicamente o <title> e favicon da aba do navegador e suporta múltiplos arquivos.
 */

class WebBrowserSimulator {
  constructor(options) {
    this.iframe = options.iframe;
    this.tabTitleEl = options.tabTitleEl;
    this.tabFaviconEl = options.tabFaviconEl;
    this.addressBarEl = options.addressBarEl;
    this.onNavigate = options.onNavigate || (() => {});

    this.currentUrl = "http://meu-site.local/index.html";
    this.history = [this.currentUrl];
    this.historyIndex = 0;

    this.init();
  }

  init() {
    // Escuta cliques no iframe para interceptar links entre páginas
    window.addEventListener("message", (event) => {
      if (event.data && event.data.type === "PREVIEW_LINK_CLICK") {
        const href = event.data.href;
        this.handleLinkClick(href);
      }
    });
  }

  /**
   * Renderiza o código HTML do arquivo atual no iframe do simulador
   * @param {string} htmlCode
   * @param {string} currentFileName
   */
  render(htmlCode, currentFileName = "index.html") {
    // 1. Extração do <title>
    const titleMatch = htmlCode.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : "Documento Sem Título";
    if (this.tabTitleEl) {
      this.tabTitleEl.textContent = pageTitle || "meu-site";
    }

    // 2. Extração do Favicon (<link rel="icon" href="...">)
    const faviconMatch = htmlCode.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]*>/i);
    let faviconSrc = "";
    if (faviconMatch) {
      const hrefMatch = faviconMatch[0].match(/href=["']([^"']+)["']/i);
      if (hrefMatch) faviconSrc = hrefMatch[1];
    }

    if (this.tabFaviconEl) {
      if (faviconSrc) {
        this.tabFaviconEl.innerHTML = `<img src="${faviconSrc}" style="width: 14px; height: 14px;" alt="favicon">`;
      } else {
        // Ícone padrão do navegador
        this.tabFaviconEl.innerHTML = `🌐`;
      }
    }

    // 3. Atualização da Barra de Endereço
    this.currentUrl = `http://meu-site.local/${currentFileName}`;
    if (this.addressBarEl) {
      this.addressBarEl.textContent = this.currentUrl;
    }

    // 4. Injeção de script seguro no iframe para interceptar links internos
    const injectedCode = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 16px; margin: 0; }
          </style>
        </head>
        <body>
          ${htmlCode}
          <script>
            // Intercepta links para páginas locais
            document.addEventListener('click', function(e) {
              const anchor = e.target.closest('a');
              if (anchor) {
                const href = anchor.getAttribute('href');
                if (href && (href.endsWith('.html') || href.startsWith('#') || href.includes('http'))) {
                  e.preventDefault();
                  window.parent.postMessage({ type: 'PREVIEW_LINK_CLICK', href: href }, '*');
                }
              }
            });
          </script>
        </body>
      </html>
    `;

    // Renderização via srcdoc segura
    this.iframe.srcdoc = injectedCode;
  }

  handleLinkClick(href) {
    if (href.endsWith(".html")) {
      // Navegação para outro arquivo local (ex: pagina2.html)
      this.onNavigate(href);
    } else if (href.startsWith("http")) {
      // Link externo simulado
      alert(`[Simulador de Navegador]\nVocê clicou em um link externo para:\n${href}\n\nNo ambiente de exercícios, abas externas não são carregadas.`);
    }
  }

  reload(currentCode, fileName) {
    this.render(currentCode, fileName);
  }
}
