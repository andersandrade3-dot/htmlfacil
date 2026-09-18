/**
 * APP.JS - Orquestrador Principal do HTML Fácil
 * Conecta o Editor, Validador, Simulador de Navegador, Dicas e Modos Especiais.
 */

class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  }

  playSuccess() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch (e) {}
  }

  playError() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(130, now + 0.1);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  playHint() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }
}

class AppState {
  constructor() {
    this.currentExerciseIndex = 0;
    this.currentFile = "index.html";
    this.virtualFiles = {
      "index.html": "",
      "pagina2.html": `<!DOCTYPE html>
<html>
  <head>
    <title>Página 2</title>
  </head>
  <body>
    <h1>Esta é a Página 2!</h1>
    <p>Você navegou com sucesso para o segundo arquivo.</p>
    <a href="index.html">← Voltar para a Página Inicial</a>
  </body>
</html>`,
      "style.css": `/* O CSS está temporariamente desativado nas primeiras fases.
   O objetivo pedagógico agora é dominar a estrutura HTML! */
body {
  background-color: #ffffff;
}
`
    };

    this.stats = {
      completedList: [],
      totalAttempts: 0,
      hintsRequested: 0
    };

    this.studentTeam = {
      type: "dupla",
      members: ["", "", "", ""],
      turma: "",
      startedAt: new Date().toLocaleDateString("pt-BR")
    };

    this.revealedHintsCount = 0;
    this.currentCustomHints = null;
    this.sound = new SoundEffects();

    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem("htmlfacil_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stats) this.stats = parsed.stats;
        if (parsed.studentTeam) this.studentTeam = parsed.studentTeam;
        if (typeof parsed.currentExerciseIndex === "number") {
          this.currentExerciseIndex = parsed.currentExerciseIndex;
        }
      }
    } catch (e) {}
  }

  saveToStorage() {
    try {
      localStorage.setItem("htmlfacil_state", JSON.stringify({
        stats: this.stats,
        currentExerciseIndex: this.currentExerciseIndex,
        studentTeam: this.studentTeam
      }));
    } catch (e) {}
  }
}

class HTMLFacilApp {
  constructor() {
    window.App = this;
    this.state = new AppState();
    this.sound = this.state.sound;
    this.headBodyGame = new HeadBodyGame();
    this.fixCodeMode = new FixCodeMode();
  }

  init() {
    // 1. Inicializa o Editor
    this.needsBrowserReload = false;
    this.editor = new SimpleCodeEditor({
      textarea: document.getElementById("code-input"),
      highlightEl: document.getElementById("editor-overlay-highlight"),
      lineNumbersEl: document.getElementById("line-numbers"),
      lineHighlightEl: document.getElementById("current-line-highlight"),
      statusCursorEl: document.getElementById("status-cursor"),
      onChange: (code) => {
        this.state.virtualFiles[this.state.currentFile] = code;
        this.needsBrowserReload = true;
        this.notifyReloadNeeded();
        this.runRealtimeValidation(code);
      }
    });

    // 2. Inicializa o Simulador de Navegador
    this.preview = new WebBrowserSimulator({
      iframe: document.getElementById("preview-iframe"),
      tabTitleEl: document.getElementById("browser-tab-title"),
      tabFaviconEl: document.getElementById("browser-tab-favicon"),
      addressBarEl: document.getElementById("browser-address-url"),
      onNavigate: (targetFile) => {
        this.switchFile(targetFile);
      }
    });

    // 3. Carrega o exercício inicial (via URL param ou salvo)
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseParam = parseInt(urlParams.get("ex"), 10);
    if (exerciseParam && exerciseParam >= 1 && exerciseParam <= EXERCISES.length) {
      this.state.currentExerciseIndex = exerciseParam - 1;
    }

    this.loadExercise(this.state.currentExerciseIndex);

    // 4. Configura Eventos da Interface
    this.setupEventListeners();
    this.updateProgressUI();
    this.updateTeamBadgeUI();

    // Se a equipe ainda não foi identificada, abre o modal de identificação logo ao entrar
    const hasStudent = this.state.studentTeam &&
      this.state.studentTeam.members &&
      this.state.studentTeam.members[0] &&
      this.state.studentTeam.members[0].trim().length > 0;

    if (!hasStudent) {
      setTimeout(() => {
        this.openStudentIdentificationModal();
      }, 300);
    } else {
      // Mostra a telinha de instrução da primeira missão para guiar o aluno
      setTimeout(() => {
        this.openGuideModal();
      }, 400);
    }
  }

  notifyReloadNeeded() {
    const reloadBtn = document.getElementById("btn-browser-reload");
    const reminderEl = document.getElementById("browser-refresh-reminder");
    if (reloadBtn) {
      reloadBtn.classList.add("btn-reload-urgent");
      reloadBtn.innerHTML = "⚠️ Recarregar Site!";
    }
    if (reminderEl) {
      reminderEl.style.background = "#fff3cd";
      reminderEl.style.color = "#856404";
      reminderEl.innerHTML = "<span>⚠️ <strong>Código alterado:</strong> clique em <strong>🔄 Recarregar Site!</strong> para ver o resultado antes de avançar!</span>";
    }
  }

  handleBrowserReload() {
    this.needsBrowserReload = false;
    const reloadBtn = document.getElementById("btn-browser-reload");
    const reminderEl = document.getElementById("browser-refresh-reminder");
    if (reloadBtn) {
      reloadBtn.classList.remove("btn-reload-urgent");
      reloadBtn.innerHTML = "🔄 Recarregar";
    }
    if (reminderEl) {
      reminderEl.style.background = "#edf5ff";
      reminderEl.style.color = "#0043ce";
      reminderEl.innerHTML = "<span>✅ <strong>Navegador atualizado!</strong> Agora confira o resultado visual e clique em Executar ou Avançar.</span>";
    }
    this.preview.reload(this.editor.getValue(), this.state.currentFile);
    this.runRealtimeValidation(this.editor.getValue());
  }

  setupEventListeners() {
    // Abas da Sidebar (Atividade vs Arquivos)
    const tabTask = document.getElementById("tab-btn-task");
    const tabFiles = document.getElementById("tab-btn-files");
    const panelTask = document.getElementById("panel-exercise-view");
    const panelFiles = document.getElementById("panel-files-view");

    if (tabTask && tabFiles) {
      tabTask.addEventListener("click", () => {
        tabTask.classList.add("active");
        tabFiles.classList.remove("active");
        if (panelTask) panelTask.style.display = "flex";
        if (panelFiles) panelFiles.style.display = "none";
      });

      tabFiles.addEventListener("click", () => {
        tabFiles.classList.add("active");
        tabTask.classList.remove("active");
        if (panelFiles) panelFiles.style.display = "block";
        if (panelTask) panelTask.style.display = "none";
      });
    }

    // Banner de Missão & Botão de Avanço Rápido
    const btnOpenGuide = document.getElementById("btn-open-guide-modal");
    if (btnOpenGuide) {
      btnOpenGuide.addEventListener("click", () => this.openGuideModal());
    }

    const btnAdvanceBanner = document.getElementById("btn-advance-banner");
    if (btnAdvanceBanner) {
      btnAdvanceBanner.addEventListener("click", () => {
        if (this.needsBrowserReload) {
          this.sound.playError();
          alert("⚠️ Ação Obrigatória!\n\nVocê alterou o código mas ainda não recarregou o site no navegador simulado.\n\nClique no botão vermelho [ ⚠️ Recarregar Site! ] no topo da visualização à direita para conferir o resultado antes de avançar!");
          const reloadBtn = document.getElementById("btn-browser-reload");
          if (reloadBtn) reloadBtn.focus();
          return;
        }

        this.sound.playSuccess();
        const currentEx = EXERCISES[this.state.currentExerciseIndex];
        if (!this.state.stats.completedList.includes(currentEx.id)) {
          this.state.stats.completedList.push(currentEx.id);
        }
        this.state.saveToStorage();
        this.updateProgressUI();
        this.nextExercise();
      });
    }

    // Modal de Guia da Missão ("Telinha de Instrução")
    const btnCloseMission = document.getElementById("btn-close-mission-modal");
    if (btnCloseMission) {
      btnCloseMission.addEventListener("click", () => this.closeModal("modal-mission-intro"));
    }

    const btnStartMission = document.getElementById("btn-start-mission");
    if (btnStartMission) {
      btnStartMission.addEventListener("click", () => {
        this.closeModal("modal-mission-intro");
        this.editor.textarea.focus();
      });
    }

    const btnGuideAskHint = document.getElementById("btn-guide-ask-hint");
    if (btnGuideAskHint) {
      btnGuideAskHint.addEventListener("click", () => {
        this.closeModal("modal-mission-intro");
        this.requestHint();
      });
    }

    // Botão Executar / Verificar
    document.getElementById("btn-run-code").addEventListener("click", () => this.runCode());

    // Botão Dica ("💡 Preciso de ajuda")
    document.getElementById("btn-need-help").addEventListener("click", () => this.requestHint());

    // Botão Recarregar Preview
    document.getElementById("btn-browser-reload").addEventListener("click", () => {
      this.handleBrowserReload();
    });

    // Alternar Arquivo na Árvore / Abas
    document.querySelectorAll(".file-tree-item[data-file]").forEach(item => {
      item.addEventListener("click", () => {
        const file = item.getAttribute("data-file");
        this.switchFile(file);
      });
    });

    document.querySelectorAll(".editor-tab[data-file]").forEach(tab => {
      tab.addEventListener("click", () => {
        const file = tab.getAttribute("data-file");
        this.switchFile(file);
      });
    });

    // Navegação na Barra de Atividades (Sidebar views & Modals)
    document.querySelectorAll(".activity-btn[data-view]").forEach(btn => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");
        this.handleActivityClick(view, btn);
      });
    });

    // Modais
    const btnCloseGame = document.getElementById("btn-close-game-modal");
    if (btnCloseGame) btnCloseGame.addEventListener("click", () => this.closeModal("modal-game"));

    const btnCloseGlossary = document.getElementById("btn-close-glossary-modal");
    if (btnCloseGlossary) btnCloseGlossary.addEventListener("click", () => this.closeModal("modal-glossary"));

    const btnCloseTeacher = document.getElementById("btn-close-teacher-modal");
    if (btnCloseTeacher) btnCloseTeacher.addEventListener("click", () => this.closeModal("modal-teacher"));

    const btnCloseSuccess = document.getElementById("btn-close-success-modal");
    if (btnCloseSuccess) btnCloseSuccess.addEventListener("click", () => this.closeModal("modal-success"));

    // Botão Próximo Exercício no modal de sucesso
    document.getElementById("btn-next-exercise").addEventListener("click", () => {
      this.closeModal("modal-success");
      this.nextExercise();
    });

    // Botão Resetar Exercício
    document.getElementById("btn-reset-exercise").addEventListener("click", () => {
      if (confirm("Deseja restaurar o código inicial deste exercício?")) {
        const curEx = EXERCISES[this.state.currentExerciseIndex];
        this.editor.setValue(curEx.starterCode);
        this.state.virtualFiles[this.state.currentFile] = curEx.starterCode;
        this.preview.render(curEx.starterCode, this.state.currentFile);
        this.runRealtimeValidation(curEx.starterCode);
      }
    });

    // Seletor de Exercício rápido na Statusbar / Topbar
    const exSelector = document.getElementById("exercise-quick-select");
    if (exSelector) {
      exSelector.innerHTML = EXERCISES.map((ex, idx) => `
        <option value="${idx}">Ex. ${ex.id}: ${ex.title}</option>
      `).join('');
      exSelector.value = this.state.currentExerciseIndex;
      exSelector.addEventListener("change", (e) => {
        this.loadExercise(parseInt(e.target.value, 10));
      });
    }

    // Identificação dos Estudantes / Equipe (Individual, Duplas, Trios ou Quartetos)
    const btnEditTeam = document.getElementById("btn-edit-student-team");
    if (btnEditTeam) {
      btnEditTeam.addEventListener("click", () => this.openStudentIdentificationModal());
    }

    const btnCloseTeam = document.getElementById("btn-close-team-modal");
    if (btnCloseTeam) {
      btnCloseTeam.addEventListener("click", () => this.closeModal("modal-student-id"));
    }

    document.querySelectorAll(".team-type-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".team-type-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const type = btn.getAttribute("data-type");
        this.updateTeamTypeInputsVisibility(type);
      });
    });

    const btnSaveTeam = document.getElementById("btn-save-team");
    if (btnSaveTeam) {
      btnSaveTeam.addEventListener("click", () => this.handleSaveTeam());
    }
  }

  openGuideModal() {
    const ex = EXERCISES[this.state.currentExerciseIndex];
    if (!ex) return;

    const phaseEl = document.getElementById("guide-modal-phase");
    const titleEl = document.getElementById("guide-modal-title");
    const taskEl = document.getElementById("guide-modal-task");
    const whereEl = document.getElementById("guide-modal-where");

    if (phaseEl) phaseEl.textContent = ex.levelName;
    if (titleEl) titleEl.textContent = ex.title;
    if (taskEl) taskEl.innerHTML = ex.task;
    if (whereEl) whereEl.textContent = ex.whereDiagram;

    this.openModal("modal-mission-intro");
  }

  loadExercise(index) {
    if (index < 0 || index >= EXERCISES.length) return;
    this.state.currentExerciseIndex = index;
    this.state.revealedHintsCount = 0;
    this.state.currentCustomHints = null;

    const ex = EXERCISES[index];

    // Atualiza metadados do exercício na sidebar
    document.getElementById("exercise-badge-phase").textContent = ex.levelName;
    document.getElementById("exercise-number-display").textContent = `Exercício ${ex.id} de ${EXERCISES.length}`;
    document.getElementById("exercise-title-text").textContent = ex.title;
    document.getElementById("exercise-task-text").innerHTML = ex.task;
    document.getElementById("exercise-where-diagram").textContent = ex.whereDiagram;

    // Atualiza o Banner de Missão no Topo do Editor
    const missionPill = document.getElementById("mission-pill-number");
    const missionText = document.getElementById("mission-summary-text");
    const missionStatus = document.getElementById("mission-status-indicator");
    const missionStatusMsg = document.getElementById("mission-status-text");
    const btnAdvance = document.getElementById("btn-advance-banner");

    if (missionPill) missionPill.textContent = `Missão ${ex.id}`;
    if (missionText) missionText.innerHTML = ex.task;
    if (missionStatus) missionStatus.className = "mission-status-indicator";
    if (missionStatusMsg) missionStatusMsg.textContent = "Aguardando código...";
    if (btnAdvance) btnAdvance.style.display = "none";

    // Atualiza statusbar
    const exSelect = document.getElementById("exercise-quick-select");
    if (exSelect) exSelect.value = index;

    // Reseta dicas
    this.resetHints();

    // Carrega código inicial no editor
    this.state.currentFile = ex.targetFile || "index.html";
    this.state.virtualFiles[this.state.currentFile] = ex.starterCode;
    this.editor.setValue(ex.starterCode);

    // Atualiza simulador
    this.preview.render(ex.starterCode, this.state.currentFile);

    // Validação inicial
    this.runRealtimeValidation(ex.starterCode);

    // Salva progresso
    this.state.saveToStorage();
    this.updateProgressUI();
  }

  switchFile(fileName) {
    if (fileName === "style.css") {
      alert("🔒 O arquivo style.css está bloqueado no momento.\nO foco destes exercícios é aprender a estrutura essencial do HTML.");
      return;
    }

    this.state.currentFile = fileName;

    // Atualiza visual das abas e da árvore
    document.querySelectorAll(".file-tree-item").forEach(el => {
      el.classList.toggle("active", el.getAttribute("data-file") === fileName);
    });

    document.querySelectorAll(".editor-tab").forEach(el => {
      el.classList.toggle("active", el.getAttribute("data-file") === fileName);
    });

    const code = this.state.virtualFiles[fileName] || "";
    this.editor.setValue(code);
    this.preview.render(code, fileName);
  }

  runRealtimeValidation(code) {
    const analysis = PedagogicalValidator.analyze(code);
    const errorLines = analysis.diagnostics
      .filter(d => d.type === 'error' && d.line > 0)
      .map(d => d.line);

    this.editor.setErrorLines(errorLines);
    this.renderDiagnostics(analysis.diagnostics);

    // Validação da missão em tempo real
    const currentEx = EXERCISES[this.state.currentExerciseIndex];
    if (currentEx) {
      const hasErrors = analysis.diagnostics.some(d => d.type === 'error');
      const isPassed = currentEx.verify(code, analysis.dom, analysis.diagnostics);
      const missionStatus = document.getElementById("mission-status-indicator");
      const missionStatusMsg = document.getElementById("mission-status-text");
      const btnAdvance = document.getElementById("btn-advance-banner");

      if (isPassed && !hasErrors) {
        if (this.needsBrowserReload) {
          if (missionStatus) missionStatus.className = "mission-status-indicator";
          if (missionStatusMsg) missionStatusMsg.textContent = "⚠️ Recarregue o site para liberar o avanço!";
          if (btnAdvance) {
            btnAdvance.style.display = "inline-flex";
            btnAdvance.textContent = `🔄 Recarregar Navegador`;
          }
        } else {
          if (missionStatus) missionStatus.className = "mission-status-indicator is-ready";
          if (missionStatusMsg) missionStatusMsg.textContent = "✅ Perfeito! Clique em Avançar";
          if (btnAdvance) {
            btnAdvance.style.display = "inline-flex";
            btnAdvance.textContent = `Avançar para Ex. ${currentEx.id + 1} ➔`;
          }
        }
      } else {
        if (missionStatus) missionStatus.className = "mission-status-indicator";
        if (missionStatusMsg) {
          missionStatusMsg.textContent = code.trim().length > 0 ? "🟡 Digitando..." : "Aguardando código...";
        }
        if (btnAdvance) btnAdvance.style.display = "none";
      }
    }
  }

  runCode() {
    this.state.stats.totalAttempts++;
    const code = this.editor.getValue();
    const currentEx = EXERCISES[this.state.currentExerciseIndex];

    // Exige que o aluno recarregue o navegador antes de validar
    if (this.needsBrowserReload) {
      this.sound.playError();
      const reloadBtn = document.getElementById("btn-browser-reload");
      if (reloadBtn) {
        reloadBtn.classList.add("btn-reload-urgent");
        reloadBtn.focus();
      }
      alert("⚠️ Ação Obrigatória!\n\nVocê fez alterações no código HTML, mas ainda não recarregou o site no navegador simulado.\n\nClique no botão vermelho [ ⚠️ Recarregar Site! ] no topo da visualização à direita para ver o resultado antes de validar!");
      return;
    }

    // Atualiza preview imediatamente
    this.preview.render(code, this.state.currentFile);

    // Análise sintática detalhada
    const analysis = PedagogicalValidator.analyze(code);
    const hasErrors = analysis.diagnostics.some(d => d.type === 'error');

    // Verificação pedagógica do exercício atual
    const isExercisePassed = currentEx.verify(code, analysis.dom, analysis.diagnostics);

    if (isExercisePassed && !hasErrors) {
      // Acerto!
      this.sound.playSuccess();
      if (!this.state.stats.completedList.includes(currentEx.id)) {
        this.state.stats.completedList.push(currentEx.id);
      }
      this.state.saveToStorage();
      this.updateProgressUI();

      this.showSuccessCelebration(currentEx.successMessage);
    } else {
      // Erro pedagógico
      this.sound.playError();
      this.renderDiagnostics(analysis.diagnostics);
    }
  }

  renderDiagnostics(diagnostics) {
    const container = document.getElementById("diagnostic-list-container");
    const badgeEl = document.getElementById("diag-badge-count");
    if (!container) return;

    const errorCount = diagnostics.filter(d => d.type === 'error').length;
    if (badgeEl) {
      badgeEl.textContent = errorCount;
      badgeEl.className = `diag-badge-count ${errorCount > 0 ? 'has-error' : 'is-ok'}`;
    }

    container.innerHTML = diagnostics.map(d => {
      const icon = d.type === 'error' ? '🔴' : (d.type === 'warning' ? '🟡' : '🟢');
      const cssClass = `feedback-msg feedback-${d.type}`;
      return `
        <div class="${cssClass}">
          <span class="feedback-icon">${icon}</span>
          <div class="feedback-body">
            <div>${d.message}</div>
            ${d.line ? `<span class="feedback-line-badge" onclick="window.App.jumpToLine(${d.line})">Ir para Linha ${d.line}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  jumpToLine(lineNum) {
    const lines = this.editor.getValue().split('\n');
    let pos = 0;
    for (let i = 0; i < Math.min(lineNum - 1, lines.length); i++) {
      pos += lines[i].length + 1;
    }
    this.editor.textarea.focus();
    this.editor.textarea.setSelectionRange(pos, pos);
    this.editor.updateCursorPosition();
  }

  requestHint() {
    this.state.stats.hintsRequested++;
    this.sound.playHint();

    const hints = this.state.currentCustomHints || EXERCISES[this.state.currentExerciseIndex].hints;
    if (this.state.revealedHintsCount < hints.length) {
      this.state.revealedHintsCount++;
    }

    this.renderHints(hints);
    this.state.saveToStorage();
  }

  resetHints() {
    this.state.revealedHintsCount = 0;
    const hintsContainer = document.getElementById("hints-display-container");
    const counterEl = document.getElementById("hint-counter-text");
    if (hintsContainer) hintsContainer.innerHTML = "";
    if (counterEl) counterEl.textContent = "0 de 4";
  }

  renderHints(hints) {
    const container = document.getElementById("hints-display-container");
    const counterEl = document.getElementById("hint-counter-text");
    if (!container) return;

    if (counterEl) {
      counterEl.textContent = `${this.state.revealedHintsCount} de ${hints.length}`;
    }

    const stepNames = ["1. Conceito", "2. Tag Específica", "3. Estrutura e Sintaxe", "4. Exemplo Prático"];

    let html = "";
    for (let i = 0; i < this.state.revealedHintsCount; i++) {
      html += `
        <div class="hint-card">
          <div class="hint-step">💡 Dica ${stepNames[i] || i + 1}</div>
          <div>${hints[i].replace(/\n/g, '<br>')}</div>
        </div>
      `;
    }
    container.innerHTML = html;
  }

  showSuccessCelebration(msg) {
    const modal = document.getElementById("modal-success");
    const msgEl = document.getElementById("success-message-text");
    if (msgEl) msgEl.textContent = msg || "Exercício concluído com sucesso!";
    if (modal) modal.classList.add("open");
  }

  nextExercise() {
    if (this.state.currentExerciseIndex < EXERCISES.length - 1) {
      this.loadExercise(this.state.currentExerciseIndex + 1);
      setTimeout(() => {
        this.openGuideModal();
      }, 300);
    } else {
      alert("🎉 Sensacional! Você chegou ao final de todos os exercícios do HTML Fácil!");
    }
  }

  updateProgressUI() {
    const total = EXERCISES.length;
    const completed = this.state.stats.completedList.length;
    const percent = Math.round((completed / total) * 100);

    const barEl = document.getElementById("top-progress-bar");
    const textEl = document.getElementById("top-progress-text");
    const levelEl = document.getElementById("top-progress-level");

    if (barEl) barEl.style.width = `${Math.max(5, percent)}%`;
    if (textEl) textEl.textContent = `${completed} de ${total} (${percent}%)`;
    if (levelEl) {
      const currentEx = EXERCISES[this.state.currentExerciseIndex];
      levelEl.textContent = currentEx ? currentEx.levelName.split('—')[0].trim() : "Nível 1";
    }
  }

  handleActivityClick(view, btn) {
    document.querySelectorAll(".activity-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if (view === "explorer" || view === "exercises") {
      // Abre a barra lateral
      const sidebar = document.getElementById("vsc-sidebar");
      sidebar.classList.remove("collapsed");
    } else if (view === "head-body-game") {
      this.openModal("modal-game");
      this.headBodyGame.init("head-body-game-content");
    } else if (view === "glossary") {
      this.openModal("modal-glossary");
      GlossaryManager.renderGlossary("glossary-content");
    } else if (view === "teacher") {
      this.openModal("modal-teacher");
      TeacherModeManager.renderTeacherDashboard("teacher-content", this.state.stats, this.state.studentTeam);
    } else if (view === "fix-code") {
      this.fixCodeMode.loadChallenge(0);
    }
  }

  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("open");
  }

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("open");
  }

  openStudentIdentificationModal() {
    const team = this.state.studentTeam || {
      type: "dupla",
      members: ["", "", "", ""],
      turma: ""
    };

    // Marca botão de tipo ativo
    document.querySelectorAll(".team-type-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-type") === team.type);
    });

    this.updateTeamTypeInputsVisibility(team.type);

    const m = team.members || [];
    const input1 = document.getElementById("input-student-1");
    const input2 = document.getElementById("input-student-2");
    const input3 = document.getElementById("input-student-3");
    const input4 = document.getElementById("input-student-4");
    const inputTurma = document.getElementById("input-student-turma");

    if (input1) input1.value = m[0] || "";
    if (input2) input2.value = m[1] || "";
    if (input3) input3.value = m[2] || "";
    if (input4) input4.value = m[3] || "";
    if (inputTurma) inputTurma.value = team.turma || "";

    this.openModal("modal-student-id");
    setTimeout(() => {
      if (input1) input1.focus();
    }, 100);
  }

  updateTeamTypeInputsVisibility(type) {
    const row2 = document.getElementById("row-student-2");
    const row3 = document.getElementById("row-student-3");
    const row4 = document.getElementById("row-student-4");

    if (row2) row2.style.display = (type === "dupla" || type === "trio" || type === "quarteto") ? "block" : "none";
    if (row3) row3.style.display = (type === "trio" || type === "quarteto") ? "block" : "none";
    if (row4) row4.style.display = (type === "quarteto") ? "block" : "none";
  }

  handleSaveTeam() {
    const activeTypeBtn = document.querySelector(".team-type-btn.active");
    const type = activeTypeBtn ? activeTypeBtn.getAttribute("data-type") : "dupla";

    const name1 = (document.getElementById("input-student-1")?.value || "").trim();
    const name2 = (document.getElementById("input-student-2")?.value || "").trim();
    const name3 = (document.getElementById("input-student-3")?.value || "").trim();
    const name4 = (document.getElementById("input-student-4")?.value || "").trim();
    const turma = (document.getElementById("input-student-turma")?.value || "").trim();

    if (!name1) {
      alert("Por favor, preencha ao menos o nome do 1º aluno.");
      document.getElementById("input-student-1")?.focus();
      return;
    }

    if (type !== "individual" && !name2) {
      alert("Para duplas, trios ou quartetos, preencha também o nome do 2º aluno.");
      document.getElementById("input-student-2")?.focus();
      return;
    }

    this.state.studentTeam = {
      type: type,
      members: [name1, name2, name3, name4],
      turma: turma,
      startedAt: this.state.studentTeam.startedAt || new Date().toLocaleDateString("pt-BR")
    };

    this.state.saveToStorage();
    this.updateTeamBadgeUI();
    this.closeModal("modal-student-id");
    this.sound.playSuccess();

    // Se o modal do professor estiver aberto, re-renderiza o painel
    const teacherModal = document.getElementById("modal-teacher");
    if (teacherModal && teacherModal.classList.contains("open")) {
      TeacherModeManager.renderTeacherDashboard("teacher-content", this.state.stats, this.state.studentTeam);
    }

    // Guia da primeira missão se estiver na missão inicial
    if (this.state.currentExerciseIndex === 0) {
      setTimeout(() => {
        this.openGuideModal();
      }, 300);
    }
  }

  updateTeamBadgeUI() {
    const displayEl = document.getElementById("titlebar-team-display");
    const badgeEl = document.getElementById("btn-edit-student-team");
    if (!displayEl) return;

    const team = this.state.studentTeam;
    if (!team || !team.members) return;

    const validMembers = team.members.filter(m => m && m.trim().length > 0);

    if (validMembers.length === 0) {
      displayEl.textContent = "Identificar Alunos";
      if (badgeEl) badgeEl.title = "Clique para identificar os estudantes (dupla, trio, quarteto)";
      return;
    }

    let summaryText = "";
    if (team.type === "individual") {
      summaryText = `Aluno: ${validMembers[0]}`;
    } else if (team.type === "dupla") {
      if (validMembers.length >= 2) {
        summaryText = `Dupla: ${validMembers[0].split(' ')[0]} & ${validMembers[1].split(' ')[0]}`;
      } else {
        summaryText = `Dupla: ${validMembers[0]}`;
      }
    } else if (team.type === "trio") {
      summaryText = `Trio: ${validMembers[0].split(' ')[0]} +2`;
    } else if (team.type === "quarteto") {
      summaryText = `Quarteto: ${validMembers[0].split(' ')[0]} +3`;
    } else {
      summaryText = `Equipe (${validMembers.length})`;
    }

    displayEl.textContent = summaryText;
    if (badgeEl) {
      badgeEl.title = `Equipe: ${validMembers.join(", ")}${team.turma ? ` (${team.turma})` : ''} — Clique para alterar`;
    }
  }
}

// Inicialização automática ao carregar o DOM
document.addEventListener("DOMContentLoaded", () => {
  const app = new HTMLFacilApp();
  app.init();
});
