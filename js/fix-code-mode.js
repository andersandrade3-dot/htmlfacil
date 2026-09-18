/**
 * FIX-CODE-MODE.JS - Modo "Conserte o Código" (Depuração Pedagógica)
 * Apresenta códigos com erros reais de iniciantes para o aluno encontrar e corrigir.
 */

const FIX_CODE_CHALLENGES = [
  {
    id: 1,
    title: "1. O Caso dos Fechamentos Trocados",
    description: "Este código possui 3 erros comuns cometidos por alunos: tags fechadas com a tag de abertura ou sem a barra invertida, e tag sem fechamento.",
    buggyCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Meu site<title>
  </head>
  <body>
    <h1>Olá<h1>
    <p>Meu primeiro site
  </body>
</html>`,
    targetErrorsCount: 3,
    hints: [
      "Observe a linha 4: a tag <title> foi fechada usando <title> em vez de </title>.",
      "Observe a linha 7: a tag <h1> foi fechada sem a barra '/'!",
      "Observe a linha 8: o parágrafo <p> não tem a tag de fechamento </p> no final da frase."
    ]
  },
  {
    id: 2,
    title: "2. O Mistério do Maior Que Faltando",
    description: "Aqui o aluno digitou com pressa e esqueceu o sinal '>' na abertura da tag e no atributo.",
    buggyCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Página de Fotos</title>
  </head>
  <body>
    <h1 Minha Foto</h1>
    <img src="assets/gatinho.svg" alt="Gatinho"
    <p>Este é o meu bichinho.</p>
  </body>
</html>`,
    targetErrorsCount: 2,
    hints: [
      "Na linha 7, verifique se a tag <h1> termina com o sinal '>' antes do texto.",
      "Na linha 8, a tag <img> precisa fechar com o sinal '>' no final."
    ]
  },
  {
    id: 3,
    title: "3. O Elemento no Lugar Errado",
    description: "Alguém colocou um elemento visível dentro do <head> e um elemento de configuração no <body>!",
    buggyCode: `<!DOCTYPE html>
<html>
  <head>
    <h1>Título Principal</h1>
  </head>
  <body>
    <title>Meu Site</title>
    <p>Conteúdo da página.</p>
  </body>
</html>`,
    targetErrorsCount: 2,
    hints: [
      "O <h1> é um conteúdo visível e deve morar no <body>, não no <head>.",
      "O <title> é o nome da aba e deve morar no <head>, não no <body>."
    ]
  }
];

class FixCodeMode {
  constructor() {
    this.currentChallengeIndex = 0;
  }

  loadChallenge(index) {
    this.currentChallengeIndex = index;
    const challenge = FIX_CODE_CHALLENGES[index];
    if (!challenge) return;

    // Atualiza o editor com o código com bugs
    if (window.App && window.App.editor) {
      window.App.editor.setValue(challenge.buggyCode);
    }

    // Atualiza painel do exercício com informações do desafio
    const taskContainer = document.getElementById("exercise-task-text");
    const titleContainer = document.getElementById("exercise-title-text");
    const whereContainer = document.getElementById("exercise-where-diagram");

    if (titleContainer) titleContainer.textContent = `🔧 ${challenge.title}`;
    if (taskContainer) taskContainer.innerHTML = `<strong>Desafio de Detetive:</strong> ${challenge.description}`;
    if (whereContainer) whereContainer.textContent = "Analise as linhas do código com atenção, corrija as falhas e clique em 'Executar / Verificar'!";

    // Carrega dicas específicas
    if (window.App) {
      window.App.currentCustomHints = challenge.hints;
      window.App.resetHints();
    }
  }
}
