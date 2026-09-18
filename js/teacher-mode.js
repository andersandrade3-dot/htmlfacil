/**
 * TEACHER-MODE.JS - Modo Professor / Painel Docente com Impressão de Relatório Oficial
 * Permite que professores acompanhem o progresso dos alunos (individual, duplas, trios ou quartetos)
 * e gerem um relatório impresso/PDF formatado em folha A4 com vistos e assinaturas.
 */

class TeacherModeManager {
  static renderTeacherDashboard(containerId, stats, studentTeam) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const totalExercises = EXERCISES.length;
    const completedCount = stats.completedList ? stats.completedList.length : 0;
    const percent = Math.round((completedCount / totalExercises) * 100);

    const team = studentTeam || {
      type: "individual",
      members: ["Aluno Não Identificado"],
      turma: "Geral",
      startedAt: new Date().toLocaleDateString("pt-BR")
    };

    const validMembers = (team.members || []).filter(m => m && m.trim().length > 0);
    const membersDisplay = validMembers.length > 0 ? validMembers.join(", ") : "Nenhum aluno identificado";
    const teamTypeLabel = {
      individual: "Individual (1 Aluno)",
      dupla: "Dupla (2 Alunos)",
      trio: "Trio (3 Alunos)",
      quarteto: "Quarteto (4 Alunos)"
    }[team.type] || "Equipe";

    container.innerHTML = `
      <div class="teacher-dashboard">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap;">
          <div>
            <h2 style="color: #ffffff; font-size: 18px;">Painel Docente &amp; Relatório de Desempenho</h2>
            <p style="color: #8c8c8c; font-size: 12px; margin-top: 2px;">
              Acompanhamento detalhado das competências curriculares e progresso da turma.
            </p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-vsc btn-run" id="btn-print-teacher-report" style="font-weight: 600;">
              🖨️ Imprimir Relatório / Salvar PDF
            </button>
            <button class="btn-vsc btn-secondary" id="btn-export-stats">
              📥 Exportar JSON
            </button>
          </div>
        </div>

        <!-- Card de Identificação da Equipe -->
        <div style="background: #171d26; border: 1px solid #007acc; border-radius: 6px; padding: 14px; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
          <div>
            <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #58a6ff; margin-bottom: 3px;">
              👥 Identificação da Equipe (${teamTypeLabel})
            </div>
            <div style="font-size: 15px; font-weight: bold; color: #ffffff;">
              ${escapeHtml(membersDisplay)}
            </div>
            <div style="font-size: 11px; color: #8b949e; margin-top: 4px;">
              Turma: <strong style="color: #c9d1d9;">${escapeHtml(team.turma || "Não informada")}</strong> &bull; Data de Início: <strong style="color: #c9d1d9;">${team.startedAt || new Date().toLocaleDateString("pt-BR")}</strong>
            </div>
          </div>
          <button class="btn-vsc btn-secondary" id="btn-change-team-names" style="font-size: 11px;">
            ✏️ Alterar Alunos
          </button>
        </div>

        <!-- Métricas Rápidas -->
        <div class="teacher-stats-row">
          <div class="teacher-stat-card">
            <div class="stat-value">${completedCount} / ${totalExercises}</div>
            <div class="stat-label">Exercícios Concluídos (${percent}%)</div>
          </div>
          <div class="teacher-stat-card">
            <div class="stat-value">${stats.totalAttempts || 0}</div>
            <div class="stat-label">Tentativas Registradas</div>
          </div>
          <div class="teacher-stat-card">
            <div class="stat-value">${stats.hintsRequested || 0}</div>
            <div class="stat-label">Dicas Solicitadas</div>
          </div>
        </div>

        <!-- Compartilhar Link com a Turma -->
        <div style="background: #1e1e1e; border: 1px solid #333; border-radius: 6px; padding: 14px;">
          <h3 style="font-size: 13px; color: #fff; margin-bottom: 8px;">🔗 Compartilhar Atividade com a Turma</h3>
          <p style="font-size: 12px; color: #aaa; margin-bottom: 10px;">
            Gere um link direto para os alunos iniciarem diretamente em um exercício específico:
          </p>
          <div style="display: flex; gap: 8px;">
            <select id="teacher-select-exercise" style="background: #252526; color: #fff; border: 1px solid #444; padding: 6px 10px; border-radius: 4px; font-size: 12px; flex: 1;">
              ${EXERCISES.map(ex => `<option value="${ex.id}">Exercício ${ex.id}: ${ex.title}</option>`).join('')}
            </select>
            <button class="btn-vsc" id="btn-generate-share-link">
              Copiar Link Direto
            </button>
          </div>
          <div id="teacher-copy-feedback" style="font-size: 11px; color: #4ec9b0; margin-top: 6px; display: none;">
            ✅ Link copiado para a área de transferência!
          </div>
        </div>

        <!-- Matriz de Competências -->
        <div style="background: #1e1e1e; border: 1px solid #333; border-radius: 6px; overflow: hidden;">
          <div style="padding: 12px 14px; border-bottom: 1px solid #333; font-weight: 600; font-size: 13px; color: #fff;">
            Matriz de Competências Curriculares e Diagnóstico de Erros (25 Exercícios)
          </div>
          <div style="max-height: 280px; overflow-y: auto;">
            <table class="teacher-table">
              <thead>
                <tr>
                  <th style="width: 50px;">Ex.</th>
                  <th>Título &amp; Objetivo Pedagógico</th>
                  <th>Competência Trabalhada</th>
                  <th>Erros Mais Comuns de Iniciantes</th>
                  <th style="width: 80px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${EXERCISES.map(ex => {
                  const isDone = stats.completedList && stats.completedList.includes(ex.id);
                  return `
                    <tr>
                      <td><strong>#${ex.id}</strong></td>
                      <td>
                        <div style="color: #fff; font-weight: 500;">${ex.title}</div>
                        <div style="color: #888; font-size: 11px;">${ex.levelName}</div>
                      </td>
                      <td style="color: #cbd5e0;">
                        ${getExerciseCompetency(ex.id)}
                      </td>
                      <td style="color: #f6e05e; font-size: 11px;">
                        ${getExerciseCommonMistakes(ex.id)}
                      </td>
                      <td>
                        <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; background: ${isDone ? 'rgba(78, 201, 176, 0.2)' : 'rgba(255,255,255,0.06)'}; color: ${isDone ? '#4ec9b0' : '#888'};">
                          ${isDone ? '✅ Concluído' : '⏳ Pendente'}
                        </span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Botão de Imprimir Relatório Oficial
    document.getElementById("btn-print-teacher-report").addEventListener("click", () => {
      TeacherModeManager.triggerPrint(stats, team);
    });

    // Botão Alterar Alunos
    document.getElementById("btn-change-team-names").addEventListener("click", () => {
      if (window.App && window.App.openStudentIdentificationModal) {
        window.App.closeModal("modal-teacher");
        window.App.openStudentIdentificationModal();
      }
    });

    // Compartilhar link
    document.getElementById("btn-generate-share-link").addEventListener("click", () => {
      const select = document.getElementById("teacher-select-exercise");
      const url = new URL(window.location.href);
      url.searchParams.set("ex", select.value);
      navigator.clipboard.writeText(url.toString()).then(() => {
        const fb = document.getElementById("teacher-copy-feedback");
        fb.style.display = "block";
        setTimeout(() => fb.style.display = "none", 3000);
      });
    });

    // Exportar JSON
    document.getElementById("btn-export-stats").addEventListener("click", () => {
      const exportData = {
        studentTeam: team,
        stats: stats,
        date: new Date().toISOString()
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `relatorio_htmlfacil_${team.type}_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  /**
   * Prepara o container oficial de impressão e dispara o diálogo do navegador
   */
  static triggerPrint(stats, team) {
    const printContainer = document.getElementById("print-report-container");
    if (!printContainer) return;

    const totalExercises = EXERCISES.length;
    const completedCount = stats.completedList ? stats.completedList.length : 0;
    const percent = Math.round((completedCount / totalExercises) * 100);

    const validMembers = (team.members || []).filter(m => m && m.trim().length > 0);
    const membersDisplay = validMembers.length > 0 ? validMembers.join(", ") : "Aluno Não Identificado";
    const teamTypeLabel = {
      individual: "Trabalho Individual",
      dupla: "Dupla de Estudantes",
      trio: "Trio de Estudantes",
      quarteto: "Quarteto de Estudantes"
    }[team.type] || "Equipe de Alunos";

    printContainer.innerHTML = `
      <div class="print-header">
        <h1>RELATÓRIO OFICIAL DE PROGRESSO &amp; APRENDIZAGEM — HTML FÁCIL</h1>
        <p>Ambiente Educacional de Programação Web &bull; Simulador Pedagógico</p>
      </div>

      <div class="print-meta-grid">
        <div>
          <div><strong>ESTUDANTE(S) / EQUIPE:</strong> ${escapeHtml(membersDisplay)}</div>
          <div style="margin-top: 4px;"><strong>MODALIDADE:</strong> ${teamTypeLabel} (${validMembers.length} integrante(s))</div>
          <div style="margin-top: 4px;"><strong>TURMA / DISCIPLINA:</strong> ${escapeHtml(team.turma || "Programação Web / HTML e CSS")}</div>
        </div>
        <div style="text-align: right;">
          <div><strong>DATA DE EMISSÃO:</strong> ${new Date().toLocaleDateString("pt-BR")}</div>
          <div style="margin-top: 4px;"><strong>HORÁRIO:</strong> ${new Date().toLocaleTimeString("pt-BR", {hour: '2-digit', minute:'2-digit'})}</div>
          <div style="margin-top: 4px;"><strong>SISTEMA:</strong> HTML Fácil v2.0</div>
        </div>
      </div>

      <div class="print-stats-cards">
        <div class="print-stat-box">
          <strong>${completedCount} / ${totalExercises} (${percent}%)</strong>
          <span>Exercícios Concluídos</span>
        </div>
        <div class="print-stat-box">
          <strong>${stats.totalAttempts || 0}</strong>
          <span>Tentativas e Execuções</span>
        </div>
        <div class="print-stat-box">
          <strong>${stats.hintsRequested || 0}</strong>
          <span>Dicas Solicitadas</span>
        </div>
      </div>

      <table class="print-table">
        <thead>
          <tr>
            <th style="width: 30px;">#</th>
            <th style="width: 140px;">Fase / Exercício</th>
            <th>Competência Curricular Trabalhada</th>
            <th style="width: 85px; text-align: center;">Situação</th>
          </tr>
        </thead>
        <tbody>
          ${EXERCISES.map(ex => {
            const isDone = stats.completedList && stats.completedList.includes(ex.id);
            return `
              <tr>
                <td><strong>${ex.id}</strong></td>
                <td><strong>${escapeHtml(ex.title)}</strong></td>
                <td>${getExerciseCompetency(ex.id)}</td>
                <td style="text-align: center; font-weight: bold; color: ${isDone ? '#006600' : '#666666'};">
                  ${isDone ? 'CONCLUÍDO' : 'PENDENTE'}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <div class="print-footer-signatures">
        <div class="signature-line">
          Assinatura do(s) Aluno(s) / Equipe
        </div>
        <div class="signature-line">
          Visto do Professor(a) &bull; Nota: [ _______ ]
        </div>
      </div>
    `;

    // Dispara o diálogo nativo de impressão (permite salvar em PDF ou imprimir na folha)
    window.print();
  }
}

function getExerciseCompetency(id) {
  const map = {
    1: "Compreensão da raiz do documento HTML",
    2: "Compreensão de metadados e bastidores no <head>",
    3: "Compreensão da área visível do documento no <body>",
    4: "Declaração de padrões modernos com <!DOCTYPE html>",
    5: "Diferenciação entre título principal e corpo de texto",
    6: "Hierarquia tipográfica com níveis de cabeçalho",
    7: "Estruturação de texto em blocos de parágrafos",
    8: "Organização de múltiplos parágrafos",
    9: "Semântica de importância e negrito visual",
    10: "Semântica de ênfase e itálico visual",
    11: "Destaque visual tipo marca-texto",
    12: "Aninhamento e ordem correta de fechamento de tags",
    13: "Inserção de mídia visual e atributo de origem (src)",
    14: "Acessibilidade web e descrição alternativa (alt)",
    15: "Hiperlinks externos e atributo de destino (href)",
    16: "Comportamento de navegação com target=\"_blank\"",
    17: "Título de identificação na aba do navegador",
    18: "Identidade visual na aba (favicon no <head>)",
    19: "Navegação multi-páginas no mesmo projeto",
    20: "Detetive 1: Detecção de tags abertas sem fechamento",
    21: "Detetive 2: Resolução de abertura incompleta e sintaxe de atributos",
    22: "Detetive 3: Organização estrutural correta entre HEAD e BODY",
    23: "Detetive 4: Identificação e correção de grafias de tags inexistentes",
    24: "Detetive 5: Fechamento invertido e criação de texto de âncora",
    25: "Síntese prática: criação de página pessoal completa com todas as tags"
  };
  return map[id] || "Prática de HTML semântico";
}

function getExerciseCommonMistakes(id) {
  const map = {
    1: "Esquecer a barra no fechamento </html>",
    2: "Colocar elementos visíveis dentro do <head>",
    3: "Colocar o <body> dentro do <head>",
    4: "Tentar fechar o <!DOCTYPE> com </!DOCTYPE>",
    5: "Fechar com <h1> em vez de </h1>",
    6: "Usar tag inexistente como <h7> ou grafar errado",
    7: "Escrever texto solto sem abrir a tag <p>",
    8: "Esquecer de fechar um dos parágrafos",
    9: "Cruzar fechamentos: <p><strong>texto</p></strong>",
    10: "Trocar o <em> por tags obsoletas",
    11: "Esquecer o sinal '>' de fechamento",
    12: "Inverter a ordem de fechamento das tags",
    13: "Escrever <img=\"foto.jpg\"> ou tentar fechar <img>",
    14: "Esquecer as aspas no valor do atributo alt",
    15: "Colocar o endereço fora das aspas do href",
    16: "Esquecer o sublinhado em _blank",
    17: "Colocar a tag <title> dentro do <body>",
    18: "Colocar a tag <link rel='icon'> dentro do <body>",
    19: "Escrever o nome do arquivo com erro de digitação",
    20: "Não perceber tags abertas sem fechamento",
    21: "Escrever <h1 sem fechar com > ou <img=\"foto\">",
    22: "Inverter papéis de HEAD (invisível) e BODY (visível)",
    23: "Escrever <ht1> ou <paragrafo>",
    24: "Fechar tag com tag de abertura e deixar link sem âncora",
    25: "Esquecer atributos obrigatórios como src ou href com âncora"
  };
  return map[id] || "Sintaxe de tags ou atributos";
}
