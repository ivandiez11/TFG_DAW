// scripts/juego.js
console.log("✅ juego.js cargado correctamente");

import { db, auth } from "./firebaseConfig.js";
import { collection, addDoc, doc, getDoc } 
  from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");

  if (!startBtn) {
    console.error("❌ No se encontró el botón startBtn");
    return;
  }

  startBtn.addEventListener("click", startGame);
});

// -----------------------
// VARIABLES DEL JUEGO
// -----------------------
let data = [];
let index = 0;

let lives = 3;
let money = 0;

let modeIndex = 0;
let questionCount = 0;

let answered = false;

// -----------------------
// MODOS DEL JUEGO
// -----------------------
const modes = [
  { name: "FÁCIL", rounds: 5, difficulty: "easy", prize: 100, lives: 3 },
  { name: "MEDIO", rounds: 3, difficulty: "medium", prize: 300, lives: 2 },
  { name: "DIFÍCIL", rounds: 3, difficulty: "hard", prize: 1000, lives: 1 }
];

// -----------------------
// GUARDAR PUNTUACIÓN EN FIRESTORE CON NOMBRE DE USUARIO
// -----------------------
async function guardarPuntuacion(score) {
  try {
    const user = auth.currentUser;
    let username = "Anon";

    if (user) {
      // Leer los datos del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        username = data.usuario || `${data.nombre} ${data.apellido}` || user.email;
      } else {
        username = user.email;
      }
    }

    // Guardar score en Firestore
    await addDoc(collection(db, "scores"), {
      username: username,
      score: score,
      timestamp: Date.now()
    });

    console.log("🔥 Puntuación guardada para:", username);

  } catch (error) {
    console.error("❌ Error al guardar puntuación:", error);
  }
}

// -----------------------
// CONTROL PRINCIPAL
// -----------------------
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
    `https://opentdb.com/api.php?amount=${modes[modeIndex].rounds}&difficulty=${difficulty}&type=multiple`
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

  if (index >= data.length) {
    modeEnd();
    return;
  }

  answered = false;

  const q = data[index];

  document.getElementById("mode").innerText = `Modo ${modes[modeIndex].name}`;
  document.getElementById("question").innerHTML = q.question;

  const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerHTML = answer;
    btn.addEventListener("click", () => checkAnswer(btn, q.correct_answer));
    answersDiv.appendChild(btn);
  });
}

function checkAnswer(selectedBtn, correct) {

  if (answered) return;
  answered = true;

  document.querySelectorAll("#answers button").forEach(btn => btn.disabled = true);

  if (selectedBtn.innerHTML === correct) {
    selectedBtn.classList.add("correct");
    money += modes[modeIndex].prize;
    questionCount++;
  } else {
    selectedBtn.classList.add("wrong");
    lives -= 1;

    document.querySelectorAll("#answers button").forEach(btn => {
      if (btn.innerHTML === correct) btn.classList.add("correct");
    });
  }

  index++;
  updateHUD();

  setTimeout(() => {

    if (lives <= 0) {
      gameOver();
      return;
    }

    showQuestion();

  }, 1000);
}

function updateHUD() {
  const livesEl = document.getElementById("lives");
  const moneyEl = document.getElementById("money");
  if (livesEl) livesEl.innerText = lives;
  if (moneyEl) moneyEl.innerText = money;
}

function modeEnd() {
  document.getElementById("game").style.display = "none";
  document.getElementById("menuEnd").style.display = "block";

  document.getElementById("endTitle").innerText = "✅ MODO SUPERADO";
  document.getElementById("endText").innerText = `Dinero actual: $${money}`;

  document.getElementById("continueBtn").style.display = "block";
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

  document.getElementById("exitBtn").innerText = "SALIR";
  document.getElementById("exitBtn").onclick = endGame;
}

function gameOver() {
  document.getElementById("game").style.display = "none";
  document.getElementById("menuEnd").style.display = "block";

  document.getElementById("endTitle").innerText = "💀 ELIMINADO";
  document.getElementById("endText").innerText = "Has perdido todas las vidas.\nPierdes tu dinero.";

  document.getElementById("continueBtn").style.display = "none";

  document.getElementById("exitBtn").innerText = "REINICIAR";
  document.getElementById("exitBtn").onclick = () => location.reload();
}

function endGame() {

  // Guardar puntuación con el nombre del usuario
  guardarPuntuacion(money);

  document.getElementById("game").style.display = "none";
  document.getElementById("menuEnd").style.display = "block";

  document.getElementById("endTitle").innerText = "🏆 ENHORABUENA";
  document.getElementById("endText").innerText = `Terminaste el juego con $${money}`;

  document.getElementById("continueBtn").style.display = "none";
  document.getElementById("exitBtn").innerText = "JUGAR DE NUEVO";
  document.getElementById("exitBtn").onclick = () => location.reload();
}
