// scripts/juego.js
console.log("✅ juego.js cargado correctamente");

import { db, auth } from "./firebaseConfig.js";
import { collection, addDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

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
  { name: "EASY LEVEL", rounds: 7, difficulty: "easy", prize: 10000, lives: 3 },
  { name: "MEDIUM LEVEL", rounds: 5, difficulty: "medium", prize: 66000, lives: 2 },
  { name: "HARD LEVEL", rounds: 3, difficulty: "hard", prize: 200000, lives: 1 }
];

// -----------------------
// GUARDAR PUNTUACIÓN EN FIRESTORE
// -----------------------
async function guardarPuntuacion(score) {
  try {
    const user = auth.currentUser;
    let username = "Anon";

    if (user) {
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        username = data.usuario || `${data.nombre} ${data.apellido}` || user.email;
      } else {
        username = user.email;
      }
    }

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

// -----------------------
// MOSTRAR PREGUNTA
// -----------------------
function showQuestion() {

  if (questionCount >= modes[modeIndex].rounds) return modeEnd();
  if (index >= data.length) return modeEnd();

  answered = false;

  const q = data[index];

  document.getElementById("mode").innerText = `${modes[modeIndex].name}`;
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

// -----------------------
// COMPROBAR RESPUESTA
// -----------------------
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
    lives--;

    document.querySelectorAll("#answers button").forEach(btn => {
      if (btn.innerHTML === correct) btn.classList.add("correct");
    });
  }

  index++;
  updateHUD();

  setTimeout(() => {
    if (lives <= 0) return gameOver();
    showQuestion();
  }, 1000);
}

// -----------------------
// HUD — VIDAS ❤️ Y DINERO 💰
// -----------------------
function updateHUD() {
  renderLives();

  const moneyBox = document.getElementById("hudMoney");
  const moneyEl = document.getElementById("money");

  moneyEl.textContent = money;

  moneyBox.classList.add("money-anim");
  setTimeout(() => moneyBox.classList.remove("money-anim"), 500);
}

function renderLives() {
  const livesEl = document.getElementById("lives");
  livesEl.innerHTML = "";

  for (let i = 0; i < lives; i++) {
    const heart = document.createElement("span");
    heart.classList.add("life-heart");
    heart.textContent = "❤️";
    livesEl.appendChild(heart);
  }

  for (let i = lives; i < modes[modeIndex].lives; i++) {
    const heart = document.createElement("span");
    heart.classList.add("life-heart");
    heart.style.opacity = "0.25";
    heart.textContent = "❤️";
    livesEl.appendChild(heart);
  }
}

// -----------------------
// FIN DE MODO
// -----------------------
function modeEnd() {
  document.getElementById("game").style.display = "none";
  document.getElementById("menuEnd").style.display = "block";

  document.getElementById("endTitle").innerText = "✅ DIFFICULTY LEVEL COMPLETED";
  document.getElementById("endText").innerText = `Current money: $${money}`;

  document.getElementById("continueBtn").onclick = () => {
    modeIndex++;

    if (modeIndex >= modes.length) return endGame();

    document.getElementById("menuEnd").style.display = "none";
    document.getElementById("game").style.display = "block";
    loadMode();
  };

  document.getElementById("exitBtn").innerText = "EXIT";
  document.getElementById("exitBtn").onclick = endGame;
}

// -----------------------
// GAME OVER
// -----------------------
function gameOver() {
  showLoseScreen();
}

// -----------------------
// END OF GAME
// -----------------------
function endGame() {

  guardarPuntuacion(money);

  document.getElementById("game").style.display = "none";
  document.getElementById("menuEnd").style.display = "none";

  const screen = document.getElementById("finalScreen");
  const moneyText = document.getElementById("finalMoney");

  moneyText.innerText = `You have won a total of $${money}`;

  screen.style.display = "flex";

  document.getElementById("goHomeBtn").onclick = () => {
    window.location.href = "index.html";
  };
}

// -----------------------
// PANTALLA DE DERROTA
// -----------------------
function showLoseScreen() {

  document.getElementById("game").style.display = "none";
  document.getElementById("menuEnd").style.display = "none";

  const screen = document.getElementById("finalScreen");
  const title = document.getElementById("finalTitle");
  const moneyText = document.getElementById("finalMoney");

  title.innerText = "💀 You have been eliminated!";

  moneyText.innerText =
    `You lost this time... but every defeat is an opportunity to improve 💪\n` +
    `Don't give up, the million awaits you!`;
  screen.style.display = "flex";

  document.getElementById("goHomeBtn").onclick = () => {
    window.location.href = "index.html";
  };
}
