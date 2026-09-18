/**
 * HEAD-BODY-GAME.JS - Mini-jogo interativo "Quem mora no HEAD e quem mora no BODY?"
 * Ajuda alunos a internalizarem de forma definitiva a diferença entre metadados e conteúdo visível.
 */

const HEAD_BODY_QUESTIONS = [
  {
    tag: "<h1>",
    description: "Título principal da página",
    correctZone: "BODY",
    explanation: "O <h1> é um conteúdo visível que as pessoas leem diretamente na página, por isso mora no <body>!"
  },
  {
    tag: "<title>",
    description: "Nome que aparece na aba do navegador",
    correctZone: "HEAD",
    explanation: "O <title> é uma informação de cabeçalho sobre a página (não aparece no corpo do site), por isso mora no <head>!"
  },
  {
    tag: "<p>",
    description: "Parágrafo com texto de leitura",
    correctZone: "BODY",
    explanation: "Textos de parágrafos são lidos na tela pelo usuário, portanto moram no <body>."
  },
  {
    tag: "<link rel='icon'>",
    description: "Ícone (favicon) da aba do navegador",
    correctZone: "HEAD",
    explanation: "O favicon é uma configuração externa sobre o site que vai na aba, logo mora exclusivamente no <head>."
  },
  {
    tag: "<img>",
    description: "Foto ou imagem visível na tela",
    correctZone: "BODY",
    explanation: "Imagens são elementos visuais do conteúdo, ficando sempre dentro do <body>."
  },
  {
    tag: "<a>",
    description: "Link clicável para outro site",
    correctZone: "BODY",
    explanation: "Links são botões ou textos interativos na tela do usuário, portanto moram no <body>."
  },
  {
    tag: "<meta charset='UTF-8'>",
    description: "Configuração para aceitar acentos e cedilha",
    correctZone: "HEAD",
    explanation: "Metadados de codificação e idioma são configurações técnicas invisíveis, ficando sempre no <head>."
  },
  {
    tag: "<strong>",
    description: "Palavra destacada em negrito",
    correctZone: "BODY",
    explanation: "A formatação de texto faz parte da leitura visual do usuário, pertencendo ao <body>."
  }
];

class HeadBodyGame {
  constructor() {
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.render();
  }

  render() {
    if (this.currentIndex >= HEAD_BODY_QUESTIONS.length) {
      this.renderGameOver();
      return;
    }

    const currentQ = HEAD_BODY_QUESTIONS[this.currentIndex];

    this.container.innerHTML = `
      <div class="head-body-game-container">
        <div class="game-score-bar">
          <div>Item <strong>${this.currentIndex + 1}</strong> de <strong>${HEAD_BODY_QUESTIONS.length}</strong></div>
          <div>Pontuação: <strong style="color: #4ec9b0;">${this.score} pts</strong></div>
        </div>

        <div class="game-item-display">
          <div style="font-size: 11px; text-transform: uppercase; color: #888; margin-bottom: 6px;">Onde deve ficar esta tag?</div>
          <div class="game-tag-name">${escapeHtml(currentQ.tag)}</div>
          <div class="game-tag-desc">${currentQ.description}</div>
        </div>

        <div class="game-options-container">
          <button class="game-zone-btn" id="btn-choice-head">
            <span style="font-size: 24px;">🧠</span>
            <span class="game-zone-title">&lt;HEAD&gt;</span>
            <span class="game-zone-subtitle">Informações invisíveis e configurações</span>
          </button>

          <button class="game-zone-btn" id="btn-choice-body">
            <span style="font-size: 24px;">👀</span>
            <span class="game-zone-title">&lt;BODY&gt;</span>
            <span class="game-zone-subtitle">Conteúdo que aparece visualmente na página</span>
          </button>
        </div>

        <div class="game-feedback-box" id="game-feedback-msg"></div>
      </div>
    `;

    document.getElementById("btn-choice-head").addEventListener("click", () => this.handleAnswer("HEAD"));
    document.getElementById("btn-choice-body").addEventListener("click", () => this.handleAnswer("BODY"));
  }

  handleAnswer(selectedZone) {
    const currentQ = HEAD_BODY_QUESTIONS[this.currentIndex];
    const isCorrect = selectedZone === currentQ.correctZone;
    const feedbackBox = document.getElementById("game-feedback-msg");

    if (isCorrect) {
      this.score += 10;
      this.streak++;
      feedbackBox.className = "game-feedback-box show feedback-msg feedback-success";
      feedbackBox.innerHTML = `
        <span class="feedback-icon">✅</span>
        <div class="feedback-body">
          <strong>Correto!</strong> ${currentQ.explanation}
        </div>
      `;
      // Toca som de acerto
      if (window.App && window.App.sound) window.App.sound.playSuccess();

      // Desabilita botões temporariamente e avança
      document.getElementById("btn-choice-head").disabled = true;
      document.getElementById("btn-choice-body").disabled = true;

      setTimeout(() => {
        this.currentIndex++;
        this.render();
      }, 1800);

    } else {
      this.streak = 0;
      feedbackBox.className = "game-feedback-box show feedback-msg feedback-error";
      feedbackBox.innerHTML = `
        <span class="feedback-icon">❌</span>
        <div class="feedback-body">
          <strong>Tente novamente!</strong> Pense bem: o usuário consegue visualizar esse elemento diretamente na página?
        </div>
      `;
      if (window.App && window.App.sound) window.App.sound.playError();
    }
  }

  renderGameOver() {
    this.container.innerHTML = `
      <div style="text-align: center; padding: 24px;">
        <div style="font-size: 50px; margin-bottom: 12px;">🎉</div>
        <h2 style="color: #4ec9b0; margin-bottom: 8px;">Parabéns! Você concluiu o desafio!</h2>
        <p style="color: #cbd5e0; margin-bottom: 20px;">
          Você fez <strong>${this.score}</strong> de <strong>${HEAD_BODY_QUESTIONS.length * 10}</strong> pontos possíveis.
          Agora você tem clareza de quem mora no &lt;head&gt; e quem mora no &lt;body&gt;!
        </p>
        <button class="btn-vsc btn-run" id="btn-restart-game">
          🔄 Jogar Novamente
        </button>
      </div>
    `;

    document.getElementById("btn-restart-game").addEventListener("click", () => {
      this.init(this.container.id);
    });
  }
}
