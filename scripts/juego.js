console.log("✅ juego.js cargado correctamente");

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");

  if (!startBtn) {
    console.error("❌ No se encontró el botón startBtn");
    return;
  }

  startBtn.addEventListener("click", startGame);
});

const API_URL = "https://opentdb.com/api.php?amount=10&category=17&type=multiple";

let data = [];
let index = 0;

let lives = 3;
let money = 0;

let modeIndex = 0;
let questionCount = 0;

const modes = [
  {name: "FÁCIL", rounds: 5, difficulty: "easy", prize: 100, lives: 3},
  {name: "MEDIO", rounds: 3, difficulty: "medium", prize: 300, lives: 2},
  {name: "DIFÍCIL", rounds: 3, difficulty: "hard", prize: 1000, lives: 1}
];

async function startGame() {
  document.getElementById("start").style.display = "none";
  document.getElementById("game").style.display = "block";
  loadMode();
}

async function loadMode() {
  questionCount = 0;
  lives = modes[modeIndex].lives;

  await loadQuestions(modes[modeIndex].difficulty);
  showQuestion();
  updateHUD();
}

async function loadQuestions(difficulty) {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=${modes[modeIndex].rounds}&category=17&difficulty=${difficulty}&type=multiple`
  );
  const json = await response.json();
  data = json.results;
  index = 0;
}

function showQuestion() {
  if (questionCount >= modes[modeIndex].rounds) {
    modeEnd();
    return;
  }

  const q = data[index];

  document.getElementById("mode").innerText = `Modo ${modes[modeIndex].name}`;
  document.getElementById("question").innerHTML = q.question;

  let answers = [...q.incorrect_answers, q.correct_answer];
  answers.sort(() => Math.random() - 0.5);

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerHTML = answer;
    btn.onclick = () => checkAnswer(btn, q.correct_answer);
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(selectedBtn, correct) {

  // DESACTIVAR BOTONES
  document.querySelectorAll("#answers button").forEach(btn => {
    btn.disabled = true;
  });

  // ACIERTO
  if (selectedBtn.innerHTML === correct) {
    selectedBtn.classList.add("correct");
    money += modes[modeIndex].prize;
  } 
  // FALLO
  else {
    selectedBtn.classList.add("wrong");
    lives--;
    // 🔥 MARCAR LA RESPUESTA CORRECTA AUTOMÁTICAMENTE
  document.querySelectorAll("#answers button").forEach(btn => {
    if (btn.innerHTML === correct) {
      btn.classList.add("correct");
    }
  });
  }

  // SIEMPRE AVANZA DE PREGUNTA
  questionCount++;
  index++;

  updateHUD();

  // ESPERA 1 SEGUNDO Y CAMBIA
  setTimeout(() => {

    if (lives <= 0) {
      gameOver();
      return;
    }

    showQuestion();

  }, 1000);
}


function updateHUD() {
  document.getElementById("lives").innerText = lives;
  document.getElementById("money").innerText = money;
}

function modeEnd() {

  document.getElementById("game").style.display = "none";
  document.getElementById("menuEnd").style.display = "block";

  document.getElementById("endTitle").innerText = "✅ MODO SUPERADO";
  document.getElementById("endText").innerText = `Dinero actual: $${money}`;

  document.getElementById("continueBtn").onclick = () => {
    modeIndex++;

    if (modeIndex >= modes.length) {
      endGame();
      return;
    }

    document.getElementById("menuEnd").style.display = "none";
    document.getElementById("game").style.display = "block";
    loadMode();
  };

  document.getElementById("exitBtn").onclick = () => {
    endGame();
  };
}

function gameOver() {

  document.getElementById("game").style.display = "none";
  document.getElementById("menuEnd").style.display = "block";

  document.getElementById("endTitle").innerText = "💀 ELIMINADO";
  document.getElementById("endText").innerText = "Has perdido todas las vidas.\nPierdes tu dinero.";

  document.getElementById("continueBtn").style.display = "none";

  document.getElementById("exitBtn").innerText = "REINICIAR";
  document.getElementById("exitBtn").onclick = () => {
    location.reload();
  };
}

function endGame() {

  document.getElementById("game").style.display = "none";
  document.getElementById("menuEnd").style.display = "block";

  document.getElementById("endTitle").innerText = "🏆 ENHORABUENA";
  document.getElementById("endText").innerText = `Terminaste el juego con $${money}`;

  document.getElementById("continueBtn").style.display = "none";
  document.getElementById("exitBtn").innerText = "JUGAR DE NUEVO";

  document.getElementById("exitBtn").onclick = () => {
    location.reload();
  };
}
